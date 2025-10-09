#!/usr/bin/env node

/**
 * WB Component Dependency Test Runner
 * Executes tests in proper dependency order per schema requirements
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 WB Component Dependency Test Runner');
console.log('=' .repeat(60));
console.log('Following schema-defined load order and dependencies');
console.log('=' .repeat(60));

// Test execution order based on wb-control-panel schema
const testExecutionPlan = [
  {
    priority: 1,
    name: 'Foundation Components',
    description: 'Base components with no dependencies',
    tests: [
      'tests/wb-color-bar/wb-color-bar-foundation.spec.ts'
    ],
    critical: true,
    parallel: false
  },
  {
    priority: 2, 
    name: 'Composite Components',
    description: 'Components that depend on foundation components',
    tests: [
      'tests/wb-color-bars/wb-color-bars-composite.spec.ts'
    ],
    critical: true,
    parallel: false,
    dependencies: ['wb-color-bar']
  },
  {
    priority: 3,
    name: 'Navigation Components', 
    description: 'Independent navigation components',
    tests: [
      'tests/wb-nav/wb-nav-navigation.spec.ts'
    ],
    critical: true,
    parallel: false
  },
  {
    priority: 4,
    name: 'Integration Components',
    description: 'Components that integrate multiple dependencies',
    tests: [
      'tests/wb-control-panel/control-panel-integration.spec.ts'
    ],
    critical: true,
    parallel: true,
    dependencies: ['wb-color-bar', 'wb-color-bars', 'wb-nav']
  },
  {
    priority: 5,
    name: 'Optional Enhancement Tests',
    description: 'Tests for optional functionality',
    tests: [
      'tests/wb-control-panel/ui-controls.spec.ts'
    ],
    critical: false,
    parallel: true
  }
];

class DependencyTestRunner {
  constructor() {
    this.results = {
      total: 0,
      passed: 0, 
      failed: 0,
      skipped: 0,
      executionOrder: [],
      errors: []
    };
    
    this.startTime = Date.now();
  }

  async validateTestFile(testFile) {
    const fullPath = path.resolve(testFile);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Test file missing: ${testFile}`);
      return false;
    }
    
    console.log(`✅ Test file found: ${path.basename(testFile)}`);
    return true;
  }

  async runTestFile(testFile, timeout = 30000) {
    // Validate file exists first
    const fileExists = await this.validateTestFile(testFile);
    if (!fileExists) {
      return {
        success: false,
        error: `Test file not found: ${testFile}`,
        exitCode: -1
      };
    }
    
    return new Promise((resolve) => {
      console.log(`\n🔍 Running: ${path.basename(testFile)}`);
      
      const args = [
        'playwright', 'test',
        testFile,
        '--config=playwright.config.js',
        `--timeout=${timeout}`,
        '--reporter=line'
      ];
      
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
        // Show important output in real-time
        if (text.includes('✅') || text.includes('❌') || text.includes('passed') || text.includes('failed')) {
          process.stdout.write(text);
        }
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      child.on('close', (code) => {
        const success = code === 0;
        const testName = path.basename(testFile, '.spec.ts');
        
        this.results.total++;
        if (success) {
          this.results.passed++;
          console.log(`✅ ${testName} - PASSED`);
        } else {
          this.results.failed++;
          console.log(`❌ ${testName} - FAILED (exit code: ${code})`);
          if (errorOutput) {
            console.log(`   Error: ${errorOutput.substring(0, 200)}...`);
          }
        }
        
        this.results.executionOrder.push({
          test: testName,
          success,
          duration: Date.now() - this.startTime,
          exitCode: code
        });
        
        resolve({ success, output, error: errorOutput, exitCode: code });
      });
      
      // Timeout handling
      setTimeout(() => {
        child.kill('SIGTERM');
        resolve({
          success: false,
          error: `Test timeout after ${timeout}ms`,
          exitCode: -1
        });
      }, timeout);
    });
  }

  async runTestPhase(phase) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 PHASE ${phase.priority}: ${phase.name}`);
    console.log(`   ${phase.description}`);
    console.log(`   Critical: ${phase.critical ? 'YES' : 'NO'} | Parallel: ${phase.parallel ? 'YES' : 'NO'}`);
    if (phase.dependencies) {
      console.log(`   Dependencies: ${phase.dependencies.join(', ')}`);
    }
    console.log(`${'='.repeat(60)}`);
    
    if (phase.parallel && phase.tests.length > 1) {
      // Run tests in parallel
      const promises = phase.tests.map(test => this.runTestFile(test));
      const results = await Promise.all(promises);
      
      const allPassed = results.every(r => r.success);
      return { success: allPassed, results };
    } else {
      // Run tests sequentially
      const results = [];
      for (const test of phase.tests) {
        const result = await this.runTestFile(test);
        results.push(result);
        
        // Stop on critical failure if this is a critical phase
        if (phase.critical && !result.success) {
          console.log(`💥 Critical test failed in ${phase.name} - stopping execution`);
          return { success: false, results, criticalFailure: true };
        }
      }
      
      const allPassed = results.every(r => r.success);
      return { success: allPassed, results };
    }
  }

  async validateAllTestFiles() {
    console.log('\n🔍 Validating test files before execution...');
    
    let allValid = true;
    const missingFiles = [];
    
    for (const phase of testExecutionPlan) {
      console.log(`\n📋 Phase ${phase.priority}: ${phase.name}`);
      
      for (const testFile of phase.tests) {
        const exists = await this.validateTestFile(testFile);
        if (!exists) {
          allValid = false;
          missingFiles.push({ file: testFile, phase: phase.name, critical: phase.critical });
        }
      }
    }
    
    if (!allValid) {
      console.log('\n❌ MISSING TEST FILES DETECTED:');
      missingFiles.forEach(missing => {
        const criticality = missing.critical ? 'CRITICAL' : 'OPTIONAL';
        console.log(`   ${criticality}: ${missing.file} (${missing.phase})`);
      });
      
      const criticalMissing = missingFiles.filter(m => m.critical);
      if (criticalMissing.length > 0) {
        console.log('\n💥 Critical test files missing - cannot proceed');
        return false;
      }
    }
    
    console.log('\n✅ Test file validation complete');
    return allValid;
  }

  async runAllTests() {
    console.log('\n📊 Starting dependency-ordered test execution...\n');
    
    // Validate all test files first
    const filesValid = await this.validateAllTestFiles();
    if (!filesValid) {
      console.log('\n💥 Test execution aborted due to missing files');
      this.printFinalReport(true);
      return;
    }
    
    let criticalFailure = false;
    
    for (const phase of testExecutionPlan) {
      const phaseResult = await this.runTestPhase(phase);
      
      if (phaseResult.criticalFailure) {
        criticalFailure = true;
        break;
      }
      
      if (phase.critical && !phaseResult.success) {
        console.log(`💥 Critical phase ${phase.name} failed - cannot continue`);
        criticalFailure = true;
        break;
      }
    }
    
    this.printFinalReport(criticalFailure);
  }

  printFinalReport(criticalFailure) {
    const duration = Date.now() - this.startTime;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 WB COMPONENT DEPENDENCY TEST REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n🎯 RESULTS:`);
    console.log(`  📋 Total Tests: ${this.results.total}`);
    console.log(`  ✅ Passed: ${this.results.passed}`);
    console.log(`  ❌ Failed: ${this.results.failed}`);
    console.log(`  ⏱️ Duration: ${(duration / 1000).toFixed(1)}s`);
    
    const successRate = this.results.total > 0 ? 
      (this.results.passed / this.results.total * 100).toFixed(1) : 0;
    
    console.log(`  📈 Success Rate: ${successRate}%`);
    
    if (criticalFailure) {
      console.log(`\n💥 CRITICAL FAILURE DETECTED`);
      console.log(`   Dependency chain broken - remaining tests skipped`);
    }
    
    console.log(`\n📋 EXECUTION ORDER:`);
    this.results.executionOrder.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`  ${index + 1}. ${status} ${result.test}`);
    });
    
    console.log(`\n🔗 DEPENDENCY VALIDATION:`);
    if (this.results.passed >= 3) {
      console.log(`  ✅ Foundation components working (wb-color-bar)`);
    }
    if (this.results.passed >= 4) {
      console.log(`  ✅ Composite components working (wb-color-bars)`);
    }
    if (this.results.passed >= 5) {
      console.log(`  ✅ Navigation components working (wb-nav)`);
    }
    if (this.results.passed >= 6) {
      console.log(`  ✅ Integration layer working (wb-control-panel)`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🏁 Dependency Test Execution Complete');
    console.log('='.repeat(60));
    
    // Exit with proper code
    process.exit(this.results.failed > 0 || criticalFailure ? 1 : 0);
  }
}

// Check server availability
async function checkServer() {
  console.log('🔍 Checking test server availability...');
  
  try {
    const response = await fetch('http://127.0.0.1:8081');
    console.log('✅ Test server is running on 127.0.0.1:8081');
    return true;
  } catch (error) {
    console.log('⚠️ Test server not running on 127.0.0.1:8081');
    console.log('💡 Start server with: python -m http.server 8081');
    return false;
  }
}

// Main execution
async function main() {
  console.log('WB Component System - Schema-Based Dependency Testing');
  
  const serverAvailable = await checkServer();
  if (!serverAvailable) {
    console.log('❌ Cannot run tests without server - exiting');
    process.exit(1);
  }
  
  const runner = new DependencyTestRunner();
  await runner.runAllTests();
}

// Run if called directly
const isMainModule = import.meta.url.startsWith('file:') && 
  process.argv[1] && 
  import.meta.url.endsWith(path.basename(process.argv[1]));

if (isMainModule) {
  main().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

export { DependencyTestRunner, testExecutionPlan };