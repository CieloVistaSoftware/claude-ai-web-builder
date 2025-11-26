// link-ref-checker.cjs
// Comprehensive reference checker for WB project
// Checks all <link>, <script>, <a> in HTML and all imports in JS files

const fs = require('fs');
const path = require('path');

// Directories to scan
const SCAN_DIRS = [
    'components',
    'tests',
    'demos',
    'src'
];

// File patterns
const HTML_EXTENSIONS = ['.html', '.htm'];
const JS_EXTENSIONS = ['.js', '.mjs'];

// Results storage
const results = {
    html: {
        links: [],
        scripts: [],
        anchors: []
    },
    js: {
        imports: [],
        dynamicImports: []
    },
    summary: {
        total: 0,
        ok: 0,
        broken: 0,
        external: 0
    }
};

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Skip node_modules and hidden directories
            if (file !== 'node_modules' && !file.startsWith('.')) {
                getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

/**
 * Check if a path is external (http, https, //)
 */
function isExternal(refPath) {
    return /^(https?:)?\/\//.test(refPath) || refPath.startsWith('data:');
}

/**
 * Resolve and check if a reference exists
 */
function checkReference(sourceFile, refPath) {
    if (isExternal(refPath)) {
        return { exists: null, external: true, resolved: refPath };
    }

    // Handle query strings and hashes
    const cleanPath = refPath.split('?')[0].split('#')[0];
    
    if (!cleanPath) {
        return { exists: null, external: false, resolved: refPath, empty: true };
    }

    // Resolve relative path from source file's directory
    const sourceDir = path.dirname(sourceFile);
    const resolved = path.resolve(sourceDir, cleanPath);
    const exists = fs.existsSync(resolved);

    return { exists, external: false, resolved };
}

/**
 * Check HTML file for link, script, and anchor references
 */
function checkHtmlFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check <link href="...">
    const linkRegex = /<link\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        const href = match[1];
        const check = checkReference(filePath, href);
        results.html.links.push({
            file: filePath,
            ref: href,
            ...check,
            line: getLineNumber(content, match.index)
        });
        updateSummary(check);
    }

    // Check <script src="...">
    const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
    while ((match = scriptRegex.exec(content)) !== null) {
        const src = match[1];
        const check = checkReference(filePath, src);
        results.html.scripts.push({
            file: filePath,
            ref: src,
            ...check,
            line: getLineNumber(content, match.index)
        });
        updateSummary(check);
    }

    // Check <a href="..."> (only internal links to files)
    const anchorRegex = /<a\s+[^>]*href=["']([^"'#][^"']*)["'][^>]*>/gi;
    while ((match = anchorRegex.exec(content)) !== null) {
        const href = match[1];
        // Skip javascript:, mailto:, tel:, etc.
        if (/^(javascript|mailto|tel|sms):/.test(href)) continue;
        
        const check = checkReference(filePath, href);
        // Only track file references (with extensions)
        if (!check.external && /\.\w+$/.test(href.split('?')[0])) {
            results.html.anchors.push({
                file: filePath,
                ref: href,
                ...check,
                line: getLineNumber(content, match.index)
            });
            updateSummary(check);
        }
    }
}

/**
 * Check JS file for import statements
 */
function checkJsFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check static imports: import x from '...' or import '...'
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        const check = checkReference(filePath, importPath);
        
        // For JS imports, try adding .js extension if not present
        if (!check.exists && !check.external && !importPath.endsWith('.js')) {
            const withJs = checkReference(filePath, importPath + '.js');
            if (withJs.exists) {
                check.exists = true;
                check.resolved = withJs.resolved;
                check.note = 'Resolved with .js extension';
            }
        }
        
        results.js.imports.push({
            file: filePath,
            ref: importPath,
            ...check,
            line: getLineNumber(content, match.index)
        });
        updateSummary(check);
    }

    // Check dynamic imports: import('...')
    const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = dynamicImportRegex.exec(content)) !== null) {
        const importPath = match[1];
        // Skip if it has template literals or variables
        if (importPath.includes('${') || importPath.includes('+')) continue;
        
        const check = checkReference(filePath, importPath);
        results.js.dynamicImports.push({
            file: filePath,
            ref: importPath,
            ...check,
            line: getLineNumber(content, match.index)
        });
        updateSummary(check);
    }
}

/**
 * Get line number from character index
 */
function getLineNumber(content, index) {
    const lines = content.substring(0, index).split('\n');
    return lines.length;
}

/**
 * Update summary counts
 */
function updateSummary(check) {
    results.summary.total++;
    if (check.external) {
        results.summary.external++;
    } else if (check.exists) {
        results.summary.ok++;
    } else {
        results.summary.broken++;
    }
}

/**
 * Format path for display (relative to project root)
 */
function formatPath(fullPath) {
    return path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
}

/**
 * Print results
 */
function printResults() {
    console.log('\n' + '═'.repeat(80));
    console.log('WB REFERENCE CHECKER - COMPREHENSIVE REPORT');
    console.log('═'.repeat(80));
    console.log(`Scan Date: ${new Date().toLocaleString()}`);
    console.log('─'.repeat(80));

    // Print broken references first (most important)
    const allBroken = [
        ...results.html.links.filter(r => r.exists === false),
        ...results.html.scripts.filter(r => r.exists === false),
        ...results.html.anchors.filter(r => r.exists === false),
        ...results.js.imports.filter(r => r.exists === false),
        ...results.js.dynamicImports.filter(r => r.exists === false)
    ];

    if (allBroken.length > 0) {
        console.log('\n❌ BROKEN REFERENCES (' + allBroken.length + ')');
        console.log('─'.repeat(80));
        
        allBroken.forEach(r => {
            console.log(`\n[BROKEN] ${formatPath(r.file)}:${r.line}`);
            console.log(`  Reference: ${r.ref}`);
            console.log(`  Resolved:  ${formatPath(r.resolved)}`);
        });
    } else {
        console.log('\n✅ NO BROKEN REFERENCES FOUND!');
    }

    // Summary by type
    console.log('\n' + '─'.repeat(80));
    console.log('SUMMARY BY TYPE');
    console.log('─'.repeat(80));
    
    const types = [
        { name: 'HTML <link> tags', items: results.html.links },
        { name: 'HTML <script> tags', items: results.html.scripts },
        { name: 'HTML <a> tags (files)', items: results.html.anchors },
        { name: 'JS static imports', items: results.js.imports },
        { name: 'JS dynamic imports', items: results.js.dynamicImports }
    ];

    types.forEach(type => {
        const ok = type.items.filter(r => r.exists === true).length;
        const broken = type.items.filter(r => r.exists === false).length;
        const external = type.items.filter(r => r.external).length;
        const total = type.items.length;
        
        if (total > 0) {
            const status = broken > 0 ? '❌' : '✅';
            console.log(`${status} ${type.name}: ${total} total (${ok} ok, ${broken} broken, ${external} external)`);
        }
    });

    // Overall summary
    console.log('\n' + '─'.repeat(80));
    console.log('OVERALL SUMMARY');
    console.log('─'.repeat(80));
    console.log(`Total References: ${results.summary.total}`);
    console.log(`✅ OK:           ${results.summary.ok}`);
    console.log(`❌ Broken:       ${results.summary.broken}`);
    console.log(`🌐 External:     ${results.summary.external}`);
    
    if (results.summary.broken > 0) {
        console.log('\n⚠️  ACTION REQUIRED: Fix broken references above!');
        process.exitCode = 1;
    } else {
        console.log('\n🎉 All internal references are valid!');
    }
    
    console.log('\n' + '═'.repeat(80));
}

/**
 * Export results as JSON (for programmatic use)
 */
function exportJson() {
    return JSON.stringify(results, null, 2);
}

/**
 * Main entry point
 */
function main() {
    const rootDir = __dirname;
    
    console.log('Scanning directories:', SCAN_DIRS.join(', '));
    
    SCAN_DIRS.forEach(dir => {
        const fullDir = path.join(rootDir, dir);
        const files = getAllFiles(fullDir);
        
        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            
            if (HTML_EXTENSIONS.includes(ext)) {
                checkHtmlFile(file);
            } else if (JS_EXTENSIONS.includes(ext)) {
                checkJsFile(file);
            }
        });
    });

    printResults();
    
    // If --json flag, also output JSON
    if (process.argv.includes('--json')) {
        const jsonFile = path.join(rootDir, 'ref-check-results.json');
        fs.writeFileSync(jsonFile, exportJson());
        console.log(`\nJSON results saved to: ${jsonFile}`);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

// Export for programmatic use
module.exports = { checkHtmlFile, checkJsFile, results, exportJson };
