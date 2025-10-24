/**
 * Fix syntax errors created by the automated converter
 * Remove await statements that are outside of async function contexts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixSyntaxErrors(filePath) {
    console.log(`Fixing: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern 1: await statements after beforeEach closing brace
    // This pattern looks for:
    //   });
    //   
    //   await page.goto(...);
    const beforeEachFixPattern = /\}\);\s*\n\s*await\s+page\.[^;]+;/g;
    const matches = content.match(beforeEachFixPattern);
    
    if (matches) {
        console.log(`  Found ${matches.length} beforeEach syntax errors to fix`);
        
        // Remove these orphaned await statements
        content = content.replace(beforeEachFixPattern, '});');
        
        console.log(`  ✅ Fixed beforeEach syntax errors`);
    }
    
    // Write the fixed content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Fixed: ${filePath}`);
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
    console.log(`🔧 Fixing syntax errors in: ${testsDir}`);
    
    const testFiles = findTestFiles(testsDir);
    console.log(`📄 Found ${testFiles.length} test files to fix`);
    
    let fixed = 0;
    
    for (const file of testFiles) {
        try {
            const beforeSize = fs.readFileSync(file, 'utf8').length;
            fixSyntaxErrors(file);
            const afterSize = fs.readFileSync(file, 'utf8').length;
            
            if (afterSize !== beforeSize) {
                fixed++;
            }
        } catch (error) {
            console.error(`❌ Error fixing ${file}: ${error.message}`);
        }
    }
    
    console.log(`\n🎉 Syntax error fixing complete!`);
    console.log(`   ✅ Fixed: ${fixed} files`);
    console.log(`   📊 Total: ${testFiles.length} files processed`);
}

// Run the fixes
main();