/**
 * Update all test files to use the simplified BaseUnitTest
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function updateTestFile(filePath) {
    console.log(`Updating: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if doesn't contain BaseUnitTest import
    if (!content.includes('BaseUnitTest')) {
        console.log(`  ⏭️  No BaseUnitTest import: ${filePath}`);
        return;
    }
    
    // Update import paths to use simplified version
    content = content.replace(
        /import\s*{\s*BaseUnitTest\s*}\s*from\s*['"][^'"]*BaseUnitTest\.js['"];?/g,
        "import { BaseUnitTest } from './helpers/BaseUnitTestSimple.js';"
    );
    
    // Also handle relative paths
    content = content.replace(
        /import\s*{\s*BaseUnitTest\s*}\s*from\s*['"]\.\.\/helpers\/BaseUnitTest\.js['"];?/g,
        "import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';"
    );
    
    // Write the updated content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Updated: ${filePath}`);
}

function findTestFiles(dir) {
    const files = [];
    
    function walkDir(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
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
    console.log(`🔄 Updating BaseUnitTest imports to use simplified version`);
    
    const testFiles = findTestFiles(testsDir);
    console.log(`📄 Found ${testFiles.length} test files to check`);
    
    let updated = 0;
    
    for (const file of testFiles) {
        try {
            const beforeContent = fs.readFileSync(file, 'utf8');
            updateTestFile(file);
            const afterContent = fs.readFileSync(file, 'utf8');
            
            if (beforeContent !== afterContent) {
                updated++;
            }
        } catch (error) {
            console.error(`❌ Error updating ${file}: ${error.message}`);
        }
    }
    
    console.log(`\n🎉 Update complete!`);
    console.log(`   ✅ Updated: ${updated} files`);
    console.log(`   📊 Total files checked: ${testFiles.length}`);
    console.log(`\nAll tests now use BaseUnitTestSimple.js which doesn't hang!`);
}

main();