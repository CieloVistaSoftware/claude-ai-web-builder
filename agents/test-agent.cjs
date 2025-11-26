#!/usr/bin/env node

/**
 * WB Test Agent - CommonJS Wrapper
 * 
 * This provides a CommonJS interface to the Test Agent
 * for environments that don't support ES Modules.
 * 
 * @module agents/test-agent-cjs
 * @version 1.0.0
 */

const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const { existsSync, readFileSync, writeFileSync, readdirSync, statSync } = require('fs');
const path = require('path');

const execAsync = promisify(exec);
const PROJECT_ROOT = path.resolve(__dirname, '..');

/**
 * Test Agent Configuration
 */
const CONFIG = {
  testDir: path.join(PROJECT_ROOT, 'tests'),
  resultsDir: path.join(PROJECT_ROOT, 'test-results'),
  playwrightConfig: path.join(PROJECT_ROOT, 'playwright.config.js'),
  port: 8080,
  timeout: 60000
};

/**
 * Test Categories
 */
const TEST_CATEGORIES = {
  'component': { patterns: ['wb-*/**/*.spec.ts'], description: 'All component tests' },
  'shadow-diagnostics': { patterns: ['wb-shadow-diagnostics.spec.js'], description: 'Shadow DOM diagnostics' },
  'control-panel': { patterns: ['wb-control-panel/**/*.spec.ts'], description: 'Control panel tests' },
  'color': { patterns: ['wb-color/**/*.spec.ts'], description: 'Color system tests' },
  'theme': { patterns: ['wb-theme/**/*.spec.ts'], description: 'Theme tests' },
  'modal': { patterns: ['wb-modal/**/*.spec.ts'], description: 'Modal tests' },
  'button': { patterns: ['wb-button/**/*.spec.*'], description: 'Button tests' },
  'tab': { patterns: ['wb-tab/**/*.spec.ts'], description: 'Tab tests' },
  'nav': { patterns: ['wb-nav/**/*.spec.ts'], description: 'Navigation tests' },
  'integration': { patterns: ['integration/**/*.spec.ts'], description: 'Integration tests' },
  'all': { patterns: ['**/*.spec.ts', '**/*.spec.js'], description: 'All tests' }
};

/**
 * Kill processes on port
 */
async function killPorts(ports = [8080, 3000]) {
  console.log('🔪 Killing processes on ports:', ports.join(', '));
  for (const port of ports) {
    try {
      await execAsync(`npx kill-port ${port}`, { cwd: PROJECT_ROOT });
    } catch (e) { /* ignore */ }
  }
}

/**
 * Run Playwright tests
 */
function runTests(options = {}) {
  const {
    category = 'all',
    pattern = null,
    headed = false,
    debug = false,
    failFast = false,
    timeout = CONFIG.timeout,
    specific = null
  } = options;

  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          🤖 WB TEST AGENT - Starting Test Run              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const args = ['playwright', 'test'];
  
  if (specific) {
    args.push(specific);
  } else if (pattern) {
    args.push('--grep', pattern);
  }

  if (headed) args.push('--headed');
  if (debug) args.push('--debug');
  if (failFast) args.push('-x');
  args.push('--timeout', timeout.toString());

  console.log('📋 Running:', 'npx', args.join(' '));
  console.log('📁 Category:', category);
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
        summary: `${code === 0 ? '✅ PASSED' : '❌ FAILED'} - Passed: ${passed}, Failed: ${failed}, Skipped: ${skipped}`,
        errors: errorOutput ? { stderr: errorOutput.substring(0, 2000) } : null
      };

      // Save results
      const resultsFile = path.join(CONFIG.resultsDir, `agent-results-${Date.now()}.json`);
      try {
        writeFileSync(resultsFile, JSON.stringify(result, null, 2));
        console.log(`\n📁 Results saved: ${resultsFile}`);
      } catch (e) { /* ignore */ }

      console.log('\n' + '═'.repeat(60));
      console.log(result.summary);
      console.log('═'.repeat(60));

      resolve(result);
    });
  });
}

/**
 * Run component-specific tests
 */
async function runComponentTests(componentName) {
  return runTests({ pattern: componentName });
}

/**
 * Run Shadow DOM diagnostics
 */
async function runShadowDiagnostics(componentTag = 'wb-button') {
  console.log(`\n🔍 Running Shadow DOM diagnostics for <${componentTag}>`);
  return runTests({ specific: 'wb-shadow-diagnostics.spec.js' });
}

/**
 * List categories
 */
function listCategories() {
  console.log('\n📚 Available Test Categories:');
  console.log('─'.repeat(60));
  for (const [name, config] of Object.entries(TEST_CATEGORIES)) {
    console.log(`  ${name.padEnd(20)} - ${config.description}`);
  }
  return TEST_CATEGORIES;
}

/**
 * Health check
 */
async function healthCheck() {
  console.log('\n🏥 Running Health Check...');
  const checks = {
    testDir: existsSync(CONFIG.testDir),
    playwrightConfig: existsSync(CONFIG.playwrightConfig)
  };
  console.log(`  📁 Test Directory:     ${checks.testDir ? '✅' : '❌'}`);
  console.log(`  ⚙️  Playwright Config:  ${checks.playwrightConfig ? '✅' : '❌'}`);
  return checks;
}

// Test Agent API
const TestAgent = {
  run: runTests,
  component: runComponentTests,
  diagnose: runShadowDiagnostics,
  categories: listCategories,
  health: healthCheck,
  killPorts,
  config: CONFIG,
  TEST_CATEGORIES
};

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'run':
      await killPorts();
      await runTests({ category: args[1] || 'all', headed: args.includes('--headed'), debug: args.includes('--debug'), failFast: args.includes('-x') });
      break;
    case 'component':
      await killPorts();
      await runComponentTests(args[1]);
      break;
    case 'diagnose':
      await killPorts();
      await runShadowDiagnostics(args[1] || 'wb-button');
      break;
    case 'categories':
      listCategories();
      break;
    case 'health':
      await healthCheck();
      break;
    default:
      console.log(`
🤖 WB TEST AGENT (CommonJS)

USAGE: node agents/test-agent.cjs <command> [options]

COMMANDS:
  run [category]     Run tests (all, component, control-panel, etc.)
  component <name>   Run tests for specific component
  diagnose [tag]     Run Shadow DOM diagnostics
  categories         List test categories
  health             Health check

OPTIONS:
  --headed           Run in headed mode
  --debug            Debug mode
  -x                 Fail fast
      `);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TestAgent;
