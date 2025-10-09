/**
 * Automated converter to update existing test files to use BaseUnitTest inheritance
 * This script converts standalone test.beforeEach patterns to BaseUnitTest framework
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertTestFile(filePath) {
    console.log(`Converting: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already converted (contains BaseUnitTest import)
    if (content.includes('BaseUnitTest')) {
        console.log(`  ⏭️  Already converted: ${filePath}`);
        return;
    }
    
    // Add BaseUnitTest import after existing imports
    if (content.includes("import { test, expect } from '@playwright/test';")) {
        content = content.replace(
            "import { test, expect } from '@playwright/test';",
            "import { test, expect } from '@playwright/test';\nimport { BaseUnitTest } from '../helpers/BaseUnitTest.js';"
        );
    }
    
    // Add baseTest instance after test.describe
    const describeRegex = /test\.describe\([^,]+,\s*\(\)\s*=>\s*\{/;
    if (describeRegex.test(content)) {
        content = content.replace(describeRegex, (match) => {
            return match + '\n  const baseTest = new BaseUnitTest();';
        });
    }
    
    // Convert test.beforeEach patterns
    const beforeEachRegex = /test\.beforeEach\(async \(\{ page \}\) => \{[\s\S]*?\}\);/g;
    content = content.replace(beforeEachRegex, (match) => {
        // Extract the goto URL from the original beforeEach
        const gotoMatch = match.match(/await page\.goto\('([^']+)'\);/);
        const timeoutMatch = match.match(/await page\.waitForTimeout\((\d+)\);/);
        
        let gotoUrl = gotoMatch ? gotoMatch[1] : '';
        let timeout = timeoutMatch ? timeoutMatch[1] : '3000';
        
        return `test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);${gotoUrl ? `
    await page.goto('${gotoUrl}');` : ''}${timeout ? `
    await page.waitForTimeout(${timeout});` : ''}
  });`;
    });
    
    // Convert individual test functions to use createStandardTest
    const testRegex = /test\('([^']+)',\s*async \(\{ page \}\) => \{([\s\S]*?)\n  \}\);/g;
    content = content.replace(testRegex, (match, testName, testBody) => {
        // Skip if test body is very short (likely already using createStandardTest)
        if (testBody.trim().length < 50) {
            return match;
        }
        
        // Indent the test body properly
        const indentedBody = testBody.replace(/\n/g, '\n    ').trim();
        
        return `test('${testName}', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      ${indentedBody}
    });
  });`;
    });
    
    // Write the converted content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Converted: ${filePath}`);
}

function findTestFiles(dir) {
    const files = [];
    
    function walkDir(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Skip certain directories
                if (['node_modules', '.git', 'playwright-report'].includes(item)) {
                    continue;
                }
                walkDir(fullPath);
            } else if (item.endsWith('.spec.ts')) {
                files.push(fullPath);
            }
        }
    }
    
    walkDir(dir);
    return files;
}

function main() {
    const testsDir = path.join(__dirname, 'tests');
    console.log(`🔍 Searching for test files in: ${testsDir}`);
    
    const testFiles = findTestFiles(testsDir);
    console.log(`📄 Found ${testFiles.length} test files to convert`);
    
    let converted = 0;
    let skipped = 0;
    
    for (const file of testFiles) {
        try {
            const beforeSize = fs.statSync(file).size;
            convertTestFile(file);
            const afterSize = fs.statSync(file).size;
            
            if (afterSize > beforeSize) {
                converted++;
            } else {
                skipped++;
            }
        } catch (error) {
            console.error(`❌ Error converting ${file}: ${error.message}`);
        }
    }
    
    console.log(`\n🎉 Conversion complete!`);
    console.log(`   ✅ Converted: ${converted} files`);
    console.log(`   ⏭️  Skipped: ${skipped} files`);
    console.log(`   📊 Total: ${testFiles.length} files processed`);
    
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Run tests to verify conversion: npx playwright test`);
    console.log(`   2. Review any failing tests for manual adjustments`);
    console.log(`   3. All tests now have mandatory error monitoring and wb-event-log integration`);
}

// Run if this is the main module
main();

export { convertTestFile, findTestFiles };