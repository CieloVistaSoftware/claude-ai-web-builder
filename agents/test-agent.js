#!/usr/bin/env node

/**
 * WB Test Agent
 * 
 * A callable agent for running tests programmatically.
 * Can be invoked by Claude, scripts, or CLI.
 * 
 * @module agents/test-agent
 * @version 1.0.0
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

/**
 * Test Agent Configuration
 */
const CONFIG = {
  testDir: path.join(PROJECT_ROOT, 'tests'),
  resultsDir: path.join(PROJECT_ROOT, 'test-results'),
  diagnosticsDir: path.join(PROJECT_ROOT, 'tests', 'test-results'),
  playwrightConfig: path.join(PROJECT_ROOT, 'playwright.config.js'),
  shadowDiagnosticsFile: path.join(PROJECT_ROOT, 'wb-shadow-diagnostics.html'),
  port: 8080,
  timeout: 60000,
  retries: 1
};

/**
 * Test Categories - Maps to test directories and patterns
 */
const TEST_CATEGORIES = {
  'component': {
    patterns: ['wb-*/**/*.spec.ts', 'wb-*/**/*.spec.js'],
    description: 'All component tests (wb-button, wb-modal, etc.)'
  },
  'shadow-diagnostics': {
    patterns: ['wb-shadow-diagnostics.spec.js'],
    description: 'Shadow DOM diagnostic tests for components'
  },
  'control-panel': {
    patterns: ['wb-control-panel/**/*.spec.ts'],
    description: 'Control panel functionality tests'
  },
  'color': {
    patterns: ['wb-color/**/*.spec.ts', 'wb-color-bar/**/*.spec.ts', 'wb-color-bars/**/*.spec.ts'],
    description: 'Color system and color bar tests'
  },
  'theme': {
    patterns: ['wb-theme/**/*.spec.ts'],
    description: 'Theme switching and persistence tests'
  },
  'modal': {
    patterns: ['wb-modal/**/*.spec.ts'],
    description: 'Modal dialog tests'
  },
  'button': {
    patterns: ['wb-button/**/*.spec.ts', 'wb-button/**/*.spec.js'],
    description: 'Button component tests'
  },
  'tab': {
    patterns: ['wb-tab/**/*.spec.ts'],
    description: 'Tab component tests'
  },
  'nav': {
    patterns: ['wb-nav/**/*.spec.ts'],
    description: 'Navigation component tests'
  },
  'layout': {
    patterns: ['wb-layout/**/*.spec.ts', 'wb-layout*.spec.js'],
    description: 'Layout component tests'
  },
  'integration': {
    patterns: ['integration/**/*.spec.ts', 'integrated.spec.ts'],
    description: 'Integration tests'
  },
  'socket': {
    patterns: ['socket/**/*.spec.ts'],
    description: 'WebSocket tests'
  },
  'media': {
    patterns: ['media/**/*.spec.ts'],
    description: 'Media handling tests'
  },
  'all': {
    patterns: ['**/*.spec.ts', '**/*.spec.js'],
    description: 'All tests'
  }
};

/**
 * Agent Result Interface
 * @typedef {Object} AgentResult
 * @property {boolean} success - Overall success status
 * @property {string} category - Test category run
 * @property {number} passed - Number of passed tests
 * @property {number} failed - Number of failed tests
 * @property {number} skipped - Number of skipped tests
 * @property {number} duration - Total duration in milliseconds
 * @property {Array} details - Detailed test results
 * @property {string} summary - Human-readable summary
 * @property {string} timestamp - ISO timestamp of run
 * @property {Object} errors - Any errors encountered
 */

/**
 * Kill processes on specific ports
 * @param {number[]} ports - Ports to free
 */
async function killPorts(ports = [8080, 3000]) {
  console.log('🔪 Killing processes on ports:', ports.join(', '));
  
  for (const port of ports) {
    try {
      await execAsync(`npx kill-port ${port}`, { cwd: PROJECT_ROOT });
    } catch (e) {
      // Port might not be in use, ignore error
    }
  }
}

/**
 * Start the test server
 * @returns {Promise<ChildProcess>}
 */
async function startServer() {
  console.log('🚀 Starting test server on port', CONFIG.port);
  
  const server = spawn('npx', ['http-server', '-p', CONFIG.port.toString()], {
    cwd: PROJECT_ROOT,
    stdio: 'pipe',
    shell: true,
    detached: false
  });
  
  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  return server;
}

/**
 * Check if test server is running
 * @returns {Promise<boolean>}
 */
async function isServerRunning() {
  try {
    const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${CONFIG.port}`);
    return stdout.trim() === '200';
  } catch (e) {
    return false;
  }
}

/**
 * Get list of available test files
 * @param {string} category - Test category
 * @returns {string[]}
 */
function getTestFiles(category = 'all') {
  const testFiles = [];
  const patterns = TEST_CATEGORIES[category]?.patterns || TEST_CATEGORIES.all.patterns;
  
  function walkDir(dir) {
    if (!existsSync(dir)) return;
    
    const files = readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath);
      } else if (stat.isFile() && (file.endsWith('.spec.ts') || file.endsWith('.spec.js'))) {
        const relativePath = path.relative(CONFIG.testDir, filePath);
        
        // Check if matches any pattern
        for (const pattern of patterns) {
          const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\//g, '[\\\\/]'));
          if (regex.test(relativePath) || pattern === '**/*.spec.ts' || pattern === '**/*.spec.js') {
            testFiles.push(relativePath);
            break;
          }
        }
      }
    }
  }
  
  walkDir(CONFIG.testDir);
  return [...new Set(testFiles)]; // Remove duplicates
}

/**
 * Run Playwright tests
 * @param {Object} options - Test options
 * @returns {Promise<AgentResult>}
 */
async function runTests(options = {}) {
  const {
    category = 'all',
    pattern = null,
    headed = false,
    debug = false,
    failFast = false,
    reporter = 'list',
    timeout = CONFIG.timeout,
    specific = null  // Specific test file
  } = options;
  
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          🤖 WB TEST AGENT - Starting Test Run              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  // Build command arguments
  const args = ['playwright', 'test'];
  
  // Add specific file or pattern
  if (specific) {
    args.push(specific);
  } else if (pattern) {
    args.push('--grep', pattern);
  } else if (category !== 'all') {
    const patterns = TEST_CATEGORIES[category]?.patterns;
    if (patterns && patterns.length > 0) {
      // For specific categories, we'll use the first pattern
      const firstPattern = patterns[0].replace(/\*\*\//g, '').replace(/\*/g, '');
      if (firstPattern) {
        args.push('--grep', firstPattern);
      }
    }
  }
  
  // Add options
  if (headed) args.push('--headed');
  if (debug) args.push('--debug');
  if (failFast) args.push('-x');
  args.push('--reporter', reporter);
  args.push('--timeout', timeout.toString());
  
  console.log('📋 Running:', 'npx', args.join(' '));
  console.log('📁 Category:', category);
  console.log('⏱️  Timeout:', timeout, 'ms');
  console.log('─'.repeat(60));
  
  return new Promise((resolve) => {
    let output = '';
    let errorOutput = '';
    
    const child = spawn('npx', args, {
      cwd: PROJECT_ROOT,
      stdio: 'pipe',
      shell: true
    });
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });
    
    child.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      process.stderr.write(text);
    });
    
    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      
      // Parse results from output
      const passedMatch = output.match(/(\d+) passed/);
      const failedMatch = output.match(/(\d+) failed/);
      const skippedMatch = output.match(/(\d+) skipped/);
      
      const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      const failed = failedMatch ? parseInt(failedMatch[1]) : 0;
      const skipped = skippedMatch ? parseInt(skippedMatch[1]) : 0;
      
      const result = {
        success: code === 0,
        category,
        passed,
        failed,
        skipped,
        total: passed + failed + skipped,
        duration,
        timestamp,
        exitCode: code,
        summary: generateSummary(code === 0, passed, failed, skipped, duration),
        details: parseTestDetails(output),
        errors: errorOutput ? { stderr: errorOutput.substring(0, 2000) } : null
      };
      
      // Save results
      saveResults(result);
      
      console.log('\n' + '═'.repeat(60));
      console.log(result.summary);
      console.log('═'.repeat(60));
      
      resolve(result);
    });
    
    // Timeout handling
    setTimeout(() => {
      if (child.exitCode === null) {
        child.kill('SIGTERM');
        resolve({
          success: false,
          category,
          passed: 0,
          failed: 0,
          skipped: 0,
          total: 0,
          duration: Date.now() - startTime,
          timestamp,
          exitCode: -1,
          summary: '❌ Test run timed out',
          details: [],
          errors: { timeout: `Test exceeded ${timeout}ms timeout` }
        });
      }
    }, timeout + 10000);
  });
}

/**
 * Generate human-readable summary
 */
function generateSummary(success, passed, failed, skipped, duration) {
  const status = success ? '✅ PASSED' : '❌ FAILED';
  const durationStr = duration > 60000 
    ? `${Math.round(duration / 60000)}m ${Math.round((duration % 60000) / 1000)}s`
    : `${Math.round(duration / 1000)}s`;
  
  return `
🤖 TEST AGENT RESULTS
${status}

📊 Statistics:
   ✅ Passed:  ${passed}
   ❌ Failed:  ${failed}
   ⏭️  Skipped: ${skipped}
   📋 Total:   ${passed + failed + skipped}
   ⏱️  Duration: ${durationStr}
`.trim();
}

/**
 * Parse test details from output
 */
function parseTestDetails(output) {
  const details = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    if (line.includes('✓') || line.includes('✔')) {
      details.push({ status: 'passed', test: line.trim() });
    } else if (line.includes('✗') || line.includes('✘') || line.includes('×')) {
      details.push({ status: 'failed', test: line.trim() });
    } else if (line.includes('○') || line.includes('-')) {
      details.push({ status: 'skipped', test: line.trim() });
    }
  }
  
  return details;
}

/**
 * Save test results to file
 */
function saveResults(result) {
  const resultsFile = path.join(CONFIG.resultsDir, `agent-results-${Date.now()}.json`);
  
  try {
    writeFileSync(resultsFile, JSON.stringify(result, null, 2));
    console.log(`\n📁 Results saved: ${resultsFile}`);
  } catch (e) {
    console.warn('⚠️ Could not save results:', e.message);
  }
}

/**
 * Run Shadow DOM diagnostics for a component
 * @param {string} componentTag - Component tag name (e.g., 'wb-button')
 * @returns {Promise<AgentResult>}
 */
async function runShadowDiagnostics(componentTag = 'wb-button') {
  console.log(`\n🔍 Running Shadow DOM diagnostics for <${componentTag}>`);
  
  return runTests({
    specific: 'wb-shadow-diagnostics.spec.js',
    category: 'shadow-diagnostics'
  });
}

/**
 * Run component-specific tests
 * @param {string} componentName - Component name (e.g., 'button', 'modal')
 * @returns {Promise<AgentResult>}
 */
async function runComponentTests(componentName) {
  const category = `wb-${componentName}`.toLowerCase();
  const mappedCategory = Object.keys(TEST_CATEGORIES).find(k => k.includes(componentName));
  
  if (mappedCategory) {
    return runTests({ category: mappedCategory });
  }
  
  // Try to find specific test files
  const testFiles = getTestFiles('all').filter(f => 
    f.toLowerCase().includes(componentName.toLowerCase())
  );
  
  if (testFiles.length > 0) {
    console.log(`📋 Found ${testFiles.length} test files for "${componentName}"`);
    return runTests({ pattern: componentName });
  }
  
  return {
    success: false,
    category: componentName,
    passed: 0,
    failed: 0,
    skipped: 0,
    total: 0,
    duration: 0,
    timestamp: new Date().toISOString(),
    summary: `❌ No tests found for component: ${componentName}`,
    details: [],
    errors: { notFound: `No test files found matching "${componentName}"` }
  };
}

/**
 * List available test categories
 * @returns {Object}
 */
function listCategories() {
  console.log('\n📚 Available Test Categories:');
  console.log('─'.repeat(60));
  
  for (const [name, config] of Object.entries(TEST_CATEGORIES)) {
    const fileCount = name === 'all' 
      ? getTestFiles('all').length 
      : getTestFiles(name).length;
    
    console.log(`  ${name.padEnd(20)} - ${config.description} (${fileCount} files)`);
  }
  
  return TEST_CATEGORIES;
}

/**
 * List all test files
 * @param {string} category - Optional category filter
 * @returns {string[]}
 */
function listTestFiles(category = 'all') {
  const files = getTestFiles(category);
  
  console.log(`\n📋 Test Files (${category}):`);
  console.log('─'.repeat(60));
  
  for (const file of files) {
    console.log(`  📄 ${file}`);
  }
  
  console.log(`\n📊 Total: ${files.length} files`);
  
  return files;
}

/**
 * Quick health check
 * @returns {Promise<Object>}
 */
async function healthCheck() {
  console.log('\n🏥 Running Health Check...');
  console.log('─'.repeat(60));
  
  const checks = {
    testDir: existsSync(CONFIG.testDir),
    playwrightConfig: existsSync(CONFIG.playwrightConfig),
    shadowDiagnostics: existsSync(CONFIG.shadowDiagnosticsFile),
    testFileCount: getTestFiles('all').length,
    serverRunning: await isServerRunning()
  };
  
  console.log(`  📁 Test Directory:        ${checks.testDir ? '✅' : '❌'}`);
  console.log(`  ⚙️  Playwright Config:     ${checks.playwrightConfig ? '✅' : '❌'}`);
  console.log(`  🔬 Shadow Diagnostics:    ${checks.shadowDiagnostics ? '✅' : '❌'}`);
  console.log(`  📋 Test Files Found:      ${checks.testFileCount}`);
  console.log(`  🌐 Server Running:        ${checks.serverRunning ? '✅' : '❌'}`);
  
  return checks;
}

// =============================================================================
// AGENT API - The main interface for calling the agent
// =============================================================================

/**
 * Test Agent API
 * Main entry point for programmatic test execution
 */
const TestAgent = {
  /**
   * Run tests by category
   * @param {string} category - Test category (see listCategories)
   * @param {Object} options - Additional options
   */
  run: runTests,
  
  /**
   * Run tests for a specific component
   * @param {string} componentName - Component name (button, modal, etc.)
   */
  component: runComponentTests,
  
  /**
   * Run Shadow DOM diagnostics
   * @param {string} componentTag - Component tag to diagnose
   */
  diagnose: runShadowDiagnostics,
  
  /**
   * List available categories
   */
  categories: listCategories,
  
  /**
   * List test files
   * @param {string} category - Optional category filter
   */
  files: listTestFiles,
  
  /**
   * Health check
   */
  health: healthCheck,
  
  /**
   * Kill ports before testing
   */
  killPorts,
  
  /**
   * Start test server
   */
  startServer,
  
  /**
   * Configuration
   */
  config: CONFIG,
  
  /**
   * Available test categories
   */
  TEST_CATEGORIES
};

// =============================================================================
// CLI INTERFACE
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  switch (command) {
    case 'run':
      const category = args[1] || 'all';
      const options = {
        category,
        headed: args.includes('--headed'),
        debug: args.includes('--debug'),
        failFast: args.includes('-x') || args.includes('--fail-fast')
      };
      await killPorts();
        const runResult = await runTests(options);
        console.log(JSON.stringify(runResult, null, 2));
      break;
      
    case 'component':
      const componentName = args[1];
      if (!componentName) {
        console.log('❌ Please specify a component name');
        console.log('   Usage: test-agent component <name>');
        process.exit(1);
      }
      await killPorts();
        const compResult = await runComponentTests(componentName);
        console.log(JSON.stringify(compResult, null, 2));
      break;
      
    case 'diagnose':
      const tag = args[1] || 'wb-button';
      await killPorts();
        const diagResult = await runShadowDiagnostics(tag);
        console.log(JSON.stringify(diagResult, null, 2));
      break;
      
    case 'categories':
      listCategories();
      break;
      
    case 'files':
      listTestFiles(args[1] || 'all');
      break;
      
    case 'health':
      await healthCheck();
      break;
      
    case 'help':
    default:
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                 🤖 WB TEST AGENT                           ║
╚════════════════════════════════════════════════════════════╝

USAGE:
  node agents/test-agent.js <command> [options]

COMMANDS:
  run [category]       Run tests (default: all)
  component <name>     Run tests for specific component
  diagnose [tag]       Run Shadow DOM diagnostics
  categories           List available test categories
  files [category]     List test files
  health               Run health check
  help                 Show this help

OPTIONS:
  --headed             Run in headed browser mode
  --debug              Run in debug mode
  -x, --fail-fast      Stop on first failure

EXAMPLES:
  node agents/test-agent.js run all
  node agents/test-agent.js run control-panel --headed
  node agents/test-agent.js component button
  node agents/test-agent.js diagnose wb-modal
  node agents/test-agent.js health

PROGRAMMATIC USAGE:
  import TestAgent from './agents/test-agent.js';
  
  // Run all tests
  const result = await TestAgent.run({ category: 'all' });
  
  // Run component tests
  const result = await TestAgent.component('button');
  
  // Run diagnostics
  const result = await TestAgent.diagnose('wb-button');
`);
  }
}

// Run CLI if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

// Export for module usage
export default TestAgent;
export { 
  runTests, 
  runComponentTests, 
  runShadowDiagnostics, 
  listCategories, 
  listTestFiles, 
  healthCheck,
  killPorts,
  startServer,
  CONFIG,
  TEST_CATEGORIES
};
