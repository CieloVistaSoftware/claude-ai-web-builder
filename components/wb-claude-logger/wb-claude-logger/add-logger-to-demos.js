#!/usr/bin/env node

/**
 * Add Claude Logger to All Demo Files
 * 
 * This script automatically injects the wb-claude-logger component
 * into all *demo*.html files in the components directory.
 * 
 * Usage:
 *   node add-logger-to-demos.js
 *   node add-logger-to-demos.js --dry-run
 *   node add-logger-to-demos.js --remove
 */

const fs = require('fs');
const path = require('path');

// Configuration
const COMPONENTS_DIR = path.join(__dirname, '..', '..');
const LOGGER_PATTERN = /<!--\s*Claude Logger\s*-->[\s\S]*?<\/wb-claude-logger>/;
const DEMO_PATTERN = /demo.*\.html$/i;

const LOGGER_CODE = `
<!-- Claude Logger -->
<script type="module" src="../../wb-claude-logger/wb-claude-logger.js"></script>
<wb-claude-logger></wb-claude-logger>
`;

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isRemove = args.includes('--remove');

/**
 * Find all demo files recursively
 */
function findDemoFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and hidden directories
            if (item !== 'node_modules' && !item.startsWith('.')) {
                findDemoFiles(fullPath, files);
            }
        } else if (stat.isFile() && DEMO_PATTERN.test(item)) {
            files.push(fullPath);
        }
    }
    
    return files;
}

/**
 * Calculate relative path from demo file to logger
 */
function getLoggerPath(demoFilePath) {
    const demoDir = path.dirname(demoFilePath);
    const loggerPath = path.join(__dirname, 'wb-claude-logger.js');
    let relativePath = path.relative(demoDir, loggerPath);
    
    // Convert Windows paths to forward slashes
    relativePath = relativePath.replace(/\\/g, '/');
    
    return relativePath;
}

/**
 * Check if file already has logger
 */
function hasLogger(content) {
    return content.includes('wb-claude-logger');
}

/**
 * Add logger to demo file
 */
function addLogger(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has logger
    if (hasLogger(content)) {
        return { added: false, reason: 'Already has logger' };
    }
    
    // Get correct relative path
    const loggerPath = getLoggerPath(filePath);
    const loggerCode = `
<!-- Claude Logger -->
<script type="module" src="${loggerPath}"></script>
<wb-claude-logger></wb-claude-logger>
`;
    
    // Try to add before </body>
    if (content.includes('</body>')) {
        content = content.replace('</body>', `${loggerCode}\n</body>`);
    } else {
        // No </body> tag, add at the end
        content += loggerCode;
    }
    
    if (!isDryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
    
    return { added: true, reason: 'Logger added' };
}

/**
 * Remove logger from demo file
 */
function removeLogger(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!hasLogger(content)) {
        return { removed: false, reason: 'No logger found' };
    }
    
    // Remove logger code
    content = content.replace(LOGGER_PATTERN, '');
    
    // Clean up extra blank lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (!isDryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
    
    return { removed: true, reason: 'Logger removed' };
}

/**
 * Main execution
 */
function main() {
    console.log('🔍 Finding demo files...\n');
    
    const demoFiles = findDemoFiles(COMPONENTS_DIR);
    
    if (demoFiles.length === 0) {
        console.log('❌ No demo files found');
        return;
    }
    
    console.log(`Found ${demoFiles.length} demo files\n`);
    
    if (isDryRun) {
        console.log('🔍 DRY RUN MODE - No files will be modified\n');
    }
    
    const results = {
        added: 0,
        skipped: 0,
        removed: 0,
        errors: 0
    };
    
    for (const filePath of demoFiles) {
        const relativePath = path.relative(COMPONENTS_DIR, filePath);
        
        try {
            if (isRemove) {
                const result = removeLogger(filePath);
                if (result.removed) {
                    console.log(`✅ ${relativePath} - ${result.reason}`);
                    results.removed++;
                } else {
                    console.log(`⏭️  ${relativePath} - ${result.reason}`);
                    results.skipped++;
                }
            } else {
                const result = addLogger(filePath);
                if (result.added) {
                    console.log(`✅ ${relativePath} - ${result.reason}`);
                    results.added++;
                } else {
                    console.log(`⏭️  ${relativePath} - ${result.reason}`);
                    results.skipped++;
                }
            }
        } catch (error) {
            console.log(`❌ ${relativePath} - Error: ${error.message}`);
            results.errors++;
        }
    }
    
    console.log('\n📊 Summary:');
    if (isRemove) {
        console.log(`  Removed: ${results.removed}`);
    } else {
        console.log(`  Added: ${results.added}`);
    }
    console.log(`  Skipped: ${results.skipped}`);
    console.log(`  Errors: ${results.errors}`);
    console.log(`  Total: ${demoFiles.length}`);
    
    if (isDryRun) {
        console.log('\n💡 Run without --dry-run to apply changes');
    } else if (isRemove) {
        console.log('\n✅ Logger removed from demo files');
    } else {
        console.log('\n✅ Logger added to demo files');
    }
}

// Run the script
main();
