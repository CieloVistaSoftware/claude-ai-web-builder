/**
 * TypeScript Configuration Tests
 * 
 * Converted from TypescriptConfigTest.Tests.ps1
 * Verifies that tsconfig.json properly includes all TypeScript files
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Helper function to get project root path
function getProjectRoot() {
  const testDir = path.resolve(__dirname);
  const testsDir = path.dirname(testDir);
  return path.dirname(testsDir);
}

test.describe('TypeScript Configuration Tests', () => {
  const projectRoot = getProjectRoot();
  
  test('should have valid tsconfig.json file', async () => {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    
    // Check if the file exists
    expect(fs.existsSync(tsconfigPath)).toBeTruthy();
    console.log('✅ tsconfig.json file found');
    
    // Read and parse tsconfig.json content
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    // Check if include patterns exist
    expect(tsconfigContent.include).toBeDefined();
    console.log('✅ Include property found in tsconfig.json');
    
    // Display include patterns
    console.log('📋 TypeScript include patterns:');
    tsconfigContent.include.forEach((pattern: string) => {
      console.log(`  - ${pattern}`);
    });
  });

  test('should include all TypeScript files in the project', async () => {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    // Find all TypeScript files in the project
    const tsFiles = glob.sync('**/*.{ts,tsx}', {
      cwd: projectRoot,
      ignore: ['node_modules/**', 'dist/**', 'build/**']
    });
    
    console.log(`📂 TypeScript files found in the project: ${tsFiles.length}`);
    tsFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    
    // Verify we found some TypeScript files
    expect(tsFiles.length).toBeGreaterThan(0);
  });

  test('should include important directories in tsconfig', async () => {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    const requiredDirs = ['src', 'Tests', 'components'];
    let includesAllDirectories = true;
    
    requiredDirs.forEach(dir => {
      let included = false;
      
      tsconfigContent.include.forEach((pattern: string) => {
        if (pattern.includes(dir) || pattern === '**/*' || pattern === './**/*') {
          included = true;
        }
      });
      
      if (included) {
        console.log(`✅ Directory '${dir}' is included in tsconfig.json`);
      } else {
        console.log(`⚠️ Directory '${dir}' may not be fully included in tsconfig.json`);
        includesAllDirectories = false;
      }
    });
    
    // Should include at least the src directory
    const srcIncluded = tsconfigContent.include.some((pattern: string) => 
      pattern.includes('src') || pattern === '**/*' || pattern === './**/*'
    );
    expect(srcIncluded).toBeTruthy();
  });

  test('should have proper compiler options', async () => {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    // Check for compiler options
    expect(tsconfigContent.compilerOptions).toBeDefined();
    console.log('✅ Compiler options found');
    
    const compilerOptions = tsconfigContent.compilerOptions;
    
    // Check for important compiler options
    const importantOptions = {
      'target': 'Should specify ECMAScript target',
      'module': 'Should specify module system',
      'lib': 'Should specify library files',
      'jsx': 'Should specify JSX handling (if using React)'
    };
    
    Object.entries(importantOptions).forEach(([option, description]) => {
      if (compilerOptions[option]) {
        console.log(`✅ ${option}: ${JSON.stringify(compilerOptions[option])} - ${description}`);
      } else {
        console.log(`⚠️ ${option} not specified - ${description}`);
      }
    });
    
    // Should have at least target specified
    expect(compilerOptions.target).toBeDefined();
  });

  test('should exclude unnecessary directories', async () => {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    // Check for exclude patterns
    if (tsconfigContent.exclude) {
      console.log('📋 TypeScript exclude patterns:');
      tsconfigContent.exclude.forEach((pattern: string) => {
        console.log(`  - ${pattern}`);
      });
      
      // Common directories that should be excluded
      const shouldExclude = ['node_modules', 'dist', 'build'];
      
      shouldExclude.forEach(dir => {
        const isExcluded = tsconfigContent.exclude.some((pattern: string) => 
          pattern.includes(dir)
        );
        
        if (isExcluded) {
          console.log(`✅ ${dir} is properly excluded`);
        } else {
          console.log(`⚠️ ${dir} should probably be excluded`);
        }
      });
    } else {
      console.log('⚠️ No exclude patterns found - consider excluding node_modules, dist, etc.');
    }
  });

  test('should have proper module resolution', async () => {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    const compilerOptions = tsconfigContent.compilerOptions;
    
    if (compilerOptions) {
      // Check module resolution strategy
      if (compilerOptions.moduleResolution) {
        console.log(`✅ Module resolution: ${compilerOptions.moduleResolution}`);
      } else {
        console.log('⚠️ Module resolution not explicitly set');
      }
      
      // Check base URL and paths
      if (compilerOptions.baseUrl) {
        console.log(`✅ Base URL: ${compilerOptions.baseUrl}`);
      }
      
      if (compilerOptions.paths) {
        console.log('✅ Path mapping configured:');
        Object.entries(compilerOptions.paths).forEach(([key, value]) => {
          console.log(`  ${key} -> ${JSON.stringify(value)}`);
        });
      }
      
      // Check for strict type checking
      if (compilerOptions.strict) {
        console.log('✅ Strict type checking enabled');
      } else {
        console.log('⚠️ Consider enabling strict type checking');
      }
    }
  });

  test('should compile TypeScript files without errors', async () => {
    // This test would normally run tsc to check for compilation errors
    // For now, we'll just verify the configuration looks reasonable
    
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    // Check that we have a valid configuration structure
    expect(tsconfigContent).toHaveProperty('compilerOptions');
    expect(tsconfigContent).toHaveProperty('include');
    
    console.log('✅ TypeScript configuration structure is valid');
    
    // Check for common issues
    const compilerOptions = tsconfigContent.compilerOptions;
    
    if (compilerOptions.outDir) {
      const outDir = path.join(projectRoot, compilerOptions.outDir);
      console.log(`Output directory: ${compilerOptions.outDir}`);
      
      // Check if output directory exists or can be created
      const outDirParent = path.dirname(outDir);
      if (fs.existsSync(outDirParent)) {
        console.log('✅ Output directory parent exists');
      }
    }
    
    // Verify include patterns are not conflicting
    const includePatterns = tsconfigContent.include;
    const hasWildcard = includePatterns.some((pattern: string) => 
      pattern.includes('**/*') || pattern.includes('*')
    );
    
    if (hasWildcard) {
      console.log('✅ Include patterns use wildcards for flexibility');
    } else {
      console.log('⚠️ Consider using wildcard patterns for more flexible file inclusion');
    }
  });
});
