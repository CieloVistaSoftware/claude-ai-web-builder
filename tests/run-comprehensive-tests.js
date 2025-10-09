#!/usr/bin/env node

/**
 * WB Component Test Runner
 * Runs comprehensive tests for all WB components in proper order
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 WB Component Test Runner - Comprehensive Testing');
console.log('=' .repeat(60));

const testConfig = {
  baseURL: 'http://localhost:3000',
  testDir: './tests',
  timeout: 30000,
  retries: 1
};

const testSuites = [
  {
    name: 'WB Control Panel Tests',
    patterns: [
      'tests/wb-control-panel/control-panel.spec.ts',
      'tests/wb-control-panel/control-panel-functionality.spec.ts'
    ],
    priority: 1
  },
  {
    name: 'WB Color Component Tests', 
    patterns: [
      'tests/wb-color/color-controller.spec.ts',
      'tests/wb-color/wb-color-bars.spec.ts'
    ],
    priority: 2
  },
  {
    name: 'General Component Tests',
    patterns: [
      'tests/wb-control-panel/ui-controls.spec.ts'
    ],
    priority: 3
  }
];

async function runTestSuite(suite) {
  console.log(`\n🔍 Running ${suite.name}...`);
  console.log('-'.repeat(40));
  
  for (const pattern of suite.patterns) {
    console.log(`\n📋 Test: ${pattern}`);
    
    try {
      const result = await runPlaywrightTest(pattern);
      if (result.success) {
        console.log(`✅ ${pattern} - PASSED`);
      } else {
        console.log(`❌ ${pattern} - FAILED`);
        console.log(`Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`💥 ${pattern} - ERROR: ${error.message}`);
    }
  }
}

function runPlaywrightTest(testPattern) {
  return new Promise((resolve) => {
    const args = [
      'playwright', 'test',
      testPattern,
      '--config=playwright.config.js',
      '--timeout=30000'
    ];
    
    console.log(`Running: npx ${args.join(' ')}`);
    
    const child = spawn('npx', args, {
      stdio: 'pipe',
      shell: true,
      cwd: process.cwd()
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      // Show real-time output for important messages
      if (text.includes('✅') || text.includes('❌') || text.includes('passed') || text.includes('failed')) {
        process.stdout.write(text);
      }
    });
    
    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    child.on('close', (code) => {
      const success = code === 0;
      
      if (!success && errorOutput) {
        console.log('Error output:', errorOutput.substring(0, 500));
      }
      
      resolve({
        success,
        code,
        output: output.substring(0, 1000), // Truncate for readability
        error: errorOutput.substring(0, 500)
      });
    });
    
    // Timeout after 60 seconds
    setTimeout(() => {
      child.kill('SIGTERM');
      resolve({
        success: false,
        error: 'Test timeout after 60 seconds'
      });
    }, 60000);
  });
}

async function checkServer() {
  console.log('🔍 Checking if test server is running...');
  
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch('http://localhost:3000');
    console.log('✅ Test server is running');
    return true;
  } catch (error) {
    console.log('⚠️ Test server not running - some tests may fail');
    console.log('💡 Start server with: python -m http.server 3000');
    return false;
  }
}

async function runAllTests() {
  console.log('\n📊 Starting comprehensive component testing...');
  
  // Check server availability
  await checkServer();
  
  // Sort test suites by priority
  const sortedSuites = testSuites.sort((a, b) => a.priority - b.priority);
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: 0
  };
  
  // Run each test suite
  for (const suite of sortedSuites) {
    await runTestSuite(suite);
    results.total += suite.patterns.length;
  }
  
  // Final report
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE TEST RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\n🎯 TEST SUMMARY:`);
  console.log(`  📋 Total test files: ${results.total}`);
  console.log(`  ✅ Priority: Control Panel functionality`);
  console.log(`  🎨 Priority: Color component integration`);
  console.log(`  🔧 Priority: UI controls and interactions`);
  
  console.log(`\n🚀 NEXT STEPS:`);
  console.log(`  1. Review test results above`);
  console.log(`  2. Check browser for component functionality`);
  console.log(`  3. Verify all control interactions work`);
  console.log(`  4. Test manual component operations`);
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 Component testing completed');
  console.log('='.repeat(60));
}

// Export for use as module
module.exports = { runAllTests, runTestSuite };

// Run if called directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}