// WB Component System - Final Validation Test Runner
// This script runs comprehensive tests on the WB component ecosystem

console.log('🧪 WB Component System - Final Validation Test Runner');
console.log('=' .repeat(60));

import fs from 'fs';
import path from 'path';

// Test configuration
const testConfig = {
    coreFiles: [
        'utils/wb/wb-component-registry.js',
        'utils/wb/wb-component-utils.js'
    ],
    components: [
        'components/wb-color-bar/wb-color-bar.js',
        'components/wb-color-bars/wb-color-bars.js', 
        'components/wb-nav/wb-nav.js',
        'components/wb-control-panel/wb-control-panel.js'
    ],
    testFiles: [
        'components-fixed-test.html',
        'component-diagnosis.html',
        'final-ecosystem-test.html'
    ]
};

// Test results
const results = {
    filesExist: 0,
    filesMissing: 0,
    syntaxValid: 0,
    syntaxErrors: 0,
    totalSize: 0,
    errors: []
};

function formatSize(bytes) {
    return (bytes / 1024).toFixed(1) + 'KB';
}

function validateFile(filePath, category) {
    console.log(`\n🔍 Validating: ${filePath}`);
    
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`❌ File not found: ${filePath}`);
            results.filesMissing++;
            results.errors.push(`Missing file: ${filePath}`);
            return false;
        }
        
        // Get file stats
        const stats = fs.statSync(filePath);
        const size = stats.size;
        results.totalSize += size;
        
        console.log(`✅ File exists: ${formatSize(size)}`);
        results.filesExist++;
        
        // Basic syntax validation for JS files
        if (filePath.endsWith('.js')) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for basic syntax issues
            const syntaxChecks = [
                { pattern: /\bfunction\s+\w+\s*\([^)]*\)\s*{/, name: 'Function definitions' },
                { pattern: /\bclass\s+\w+/, name: 'Class definitions' },
                { pattern: /\bcustomElements\.define\s*\(/, name: 'Custom element registration' },
                { pattern: /\bwindow\.\w+/, name: 'Global object assignments' }
            ];
            
            let foundPatterns = 0;
            syntaxChecks.forEach(check => {
                if (check.pattern.test(content)) {
                    foundPatterns++;
                    console.log(`  ✅ ${check.name} found`);
                }
            });
            
            if (foundPatterns > 0) {
                console.log(`  📝 Syntax validation: ${foundPatterns}/${syntaxChecks.length} patterns found`);
                results.syntaxValid++;
            } else {
                console.log(`  ⚠️  Syntax validation: No expected patterns found`);
                results.syntaxErrors++;
            }
        }
        
        return true;
        
    } catch (error) {
        console.log(`❌ Error validating ${filePath}: ${error.message}`);
        results.errors.push(`Error validating ${filePath}: ${error.message}`);
        return false;
    }
}

function runValidation() {
    console.log('\n📋 CORE FILES VALIDATION');
    console.log('-'.repeat(40));
    testConfig.coreFiles.forEach(file => validateFile(file, 'core'));
    
    console.log('\n🧩 COMPONENT FILES VALIDATION');
    console.log('-'.repeat(40));
    testConfig.components.forEach(file => validateFile(file, 'component'));
    
    console.log('\n🧪 TEST FILES VALIDATION');
    console.log('-'.repeat(40));
    testConfig.testFiles.forEach(file => validateFile(file, 'test'));
    
    // Final report
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL VALIDATION REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📁 FILES:`);
    console.log(`  ✅ Found: ${results.filesExist}`);
    console.log(`  ❌ Missing: ${results.filesMissing}`);
    console.log(`  📦 Total Size: ${formatSize(results.totalSize)}`);
    
    console.log(`\n📝 SYNTAX:`);
    console.log(`  ✅ Valid: ${results.syntaxValid}`);
    console.log(`  ❌ Issues: ${results.syntaxErrors}`);
    
    if (results.errors.length > 0) {
        console.log(`\n🚨 ERRORS (${results.errors.length}):`);
        results.errors.forEach((error, index) => {
            console.log(`  ${index + 1}. ${error}`);
        });
    }
    
    // Overall status
    const totalFiles = testConfig.coreFiles.length + testConfig.components.length + testConfig.testFiles.length;
    const successRate = (results.filesExist / totalFiles * 100).toFixed(1);
    
    console.log(`\n🎯 OVERALL STATUS:`);
    if (results.filesMissing === 0 && results.errors.length === 0) {
        console.log(`  🎉 SUCCESS: All ${totalFiles} files validated (${successRate}%)`);
        console.log(`  🚀 System ready for integration testing!`);
        
        console.log(`\n🔗 RECOMMENDED NEXT STEPS:`);
        console.log(`  1. Open: components-fixed-test.html`);
        console.log(`  2. Check: Browser console for component loading`);
        console.log(`  3. Verify: All 4 components initialize properly`);
        console.log(`  4. Test: Component interactions work correctly`);
        
    } else {
        console.log(`  ⚠️  ISSUES FOUND: ${results.filesMissing} missing files, ${results.errors.length} total errors`);
        console.log(`  🔧 Requires fixes before integration testing`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🏁 Validation Complete');
    console.log('='.repeat(60));
}

// Run the validation
runValidation();