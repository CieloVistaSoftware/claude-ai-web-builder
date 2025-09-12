#!/usr/bin/env node

/**
 * Website Builder Distribution Build Script - Consolidated
 * Merged from all build-dist*.js files
 * Creates clean obfuscated distributions without file conflicts
 * Date: September 2, 2025
 */


const { execSync } = require('child_process');

// Build Configuration
const CONFIG = {
    sourceDir: 'wb',
    distDir: 'dist/wb',
    obfuscateJs: true,
    minifyCss: true,
    cleanBuild: true,
    preserveComments: false,
    developmentMode: false,
    includeSourceMaps: false,
    validateOutput: true,
    copyAssets: true
};

// Color output functions for better logging
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
    log(`❌ ERROR: ${message}`, 'red');
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function logDebug(message) {
    if (!CONFIG.developmentMode) return;
    log(`🐛 DEBUG: ${message}`, 'dim');
}

// Utility functions
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        logInfo(`Created directory: ${dirPath}`);
    }
}

function copyFile(src, dest, description = '') {
    try {
        const content = fs.readFileSync(src, 'utf8');
        fs.writeFileSync(dest, content);
        const size = (content.length / 1024).toFixed(2);
        logSuccess(`Copied ${description || path.basename(src)}: ${src} → ${dest} (${size} KB)`);
        return content;
    } catch (error) {
        logError(`Failed to copy ${src}: ${error.message}`);
        return null;
    }
}

function deleteFile(filePath, silent = false) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            if (!silent) logInfo(`Deleted: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        logWarning(`Could not delete ${filePath}: ${error.message}`);
        return false;
    }
}

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return (stats.size / 1024).toFixed(2);
    } catch (error) {
        return '0.00';
    }
}

// Advanced JavaScript obfuscation
function obfuscateJavaScript(jsContent, filename = 'wb.js') {
    try {
        logInfo(`Obfuscating JavaScript: ${filename}`);
        
        let obfuscated = jsContent;
        
        // Advanced variable name replacements
        const variableReplacements = {
            'isEditMode': '_0x1a2b',
            'clickTimer': '_0x2c3d',
            'clickCount': '_0x4e5f',
            'builderConfig': '_0x6g7h',
            'updateStatus': '_0x8i9j',
            'handleEditableClick': '_0x0k1l',
            'toggleEditMode': '_0x2m3n',
            'saveWebsite': '_0x4o5p',
            'applyColor': '_0x6q7r',
            'hslToHex': '_0x8s9t',
            'loadConfiguration': '_0x0u1v',
            'saveConfiguration': '_0x2w3x',
            'initializeColorFineControls': '_0x4y5z',
            'ensureDirectoryExists': '_0xa1b2',
            'copyFile': '_0xc3d4',
            'deleteFile': '_0xe5f6'
        };
        
        // Function name obfuscation
        const functionReplacements = {
            'function loadConfiguration': 'function _0xLoad',
            'function saveConfiguration': 'function _0xSave',
            'function updateColor': 'function _0xUpd',
            'function handleClick': 'function _0xClick',
            'function initColors': 'function _0xInit'
        };
        
        // Apply variable replacements
        for (const [original, replacement] of Object.entries(variableReplacements)) {
            const regex = new RegExp(`\\b${original}\\b`, 'g');
            obfuscated = obfuscated.replace(regex, replacement);
        }
        
        // Apply function replacements
        for (const [original, replacement] of Object.entries(functionReplacements)) {
            const regex = new RegExp(original, 'g');
            obfuscated = obfuscated.replace(regex, replacement);
        }
        
        // Remove comments and compress
        obfuscated = obfuscated
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/console\.log\([^)]*\);?/g, '') // Remove console.log statements
            .replace(/console\.debug\([^)]*\);?/g, '') // Remove console.debug
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/;\s*}/g, ';}') // Remove spaces before closing braces
            .replace(/{\s*/g, '{') // Remove spaces after opening braces
            .replace(/;\s*/g, ';') // Remove spaces after semicolons
            .replace(/,\s*/g, ',') // Remove spaces after commas
            .trim();
        
        // Add obfuscation header with timestamp
        const timestamp = new Date().toISOString();
        const header = `/*! Website Builder v1.0 - Built ${timestamp} - Do not modify */\n`;
        
        // Add some dummy code to make reverse engineering harder
        const dummyVars = 'var _0xdummy1=function(){return false;},_0xdummy2=null,_0xdummy3="";';
        
        const finalCode = header + dummyVars + obfuscated;
        
        logSuccess(`JavaScript obfuscated: ${jsContent.length} → ${finalCode.length} chars`);
        return finalCode;
        
    } catch (error) {
        logError(`JavaScript obfuscation failed: ${error.message}`);
        return jsContent; // Return original on failure
    }
}

// Enhanced CSS minification
function minifyCSS(cssContent, filename = 'wb.css') {
    try {
        logInfo(`Minifying CSS: ${filename}`);
        
        let minified = cssContent
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/;\s*}/g, ';}') // Remove spaces before closing braces
            .replace(/{\s*/g, '{') // Remove spaces after opening braces
            .replace(/;\s*/g, ';') // Remove spaces after semicolons
            .replace(/,\s*/g, ',') // Remove spaces after commas
            .replace(/:\s*/g, ':') // Remove spaces after colons
            .replace(/\s*>\s*/g, '>') // Remove spaces around child selectors
            .replace(/\s*\+\s*/g, '+') // Remove spaces around adjacent selectors
            .replace(/\s*~\s*/g, '~') // Remove spaces around general sibling selectors
            .replace(/\s*\|\s*/g, '|') // Remove spaces around attribute selectors
            .replace(/\s*\[\s*/g, '[') // Remove spaces in attribute selectors
            .replace(/\s*\]\s*/g, ']') // Remove spaces in attribute selectors
            .replace(/\s*\(\s*/g, '(') // Remove spaces in functions
            .replace(/\s*\)\s*/g, ')') // Remove spaces in functions
            .replace(/0\.(\d+)/g, '.$1') // Remove leading zeros
            .replace(/(\d)\.0+(\D)/g, '$1$2') // Remove trailing zeros
            .replace(/\s*!important/g, '!important') // Clean !important
            .trim();
        
        logSuccess(`CSS minified: ${cssContent.length} → ${minified.length} chars`);
        return minified;
        
    } catch (error) {
        logError(`CSS minification failed: ${error.message}`);
        return cssContent; // Return original on failure
    }
}

// Main build function with comprehensive error handling
function buildDistribution() {
    const startTime = Date.now();
    
    try {
        log('\n🚀 Website Builder Distribution Build', 'bright');
        log('═'.repeat(60), 'cyan');
        logInfo(`Build started at ${new Date().toLocaleString()}`);
        logInfo(`Configuration: ${JSON.stringify(CONFIG, null, 2)}`);
        
        // Validate source directory
        if (!fs.existsSync(CONFIG.sourceDir)) {
            logError(`Source directory '${CONFIG.sourceDir}' does not exist`);
            process.exit(1);
        }
        
        // Create and clean dist directory
        ensureDirectoryExists(CONFIG.distDir);
        
        if (CONFIG.cleanBuild) {
            logInfo('Cleaning previous build...');
            const distFiles = fs.readdirSync(CONFIG.distDir);
            let cleanedCount = 0;
            
            distFiles.forEach(file => {
                const filePath = path.join(CONFIG.distDir, file);
                if (fs.statSync(filePath).isFile()) {
                    if (deleteFile(filePath, true)) {
                        cleanedCount++;
                    }
                }
            });
            
            logSuccess(`Cleaned ${cleanedCount} files from previous build`);
        }
        
        // Process HTML files
        logInfo('Processing HTML files...');
        const htmlFiles = ['wb.html', 'index.html'];
        htmlFiles.forEach(htmlFile => {
            const htmlPath = path.join(CONFIG.sourceDir, htmlFile);
            if (fs.existsSync(htmlPath)) {
                const htmlContent = fs.readFileSync(htmlPath, 'utf8');
                const processedHtml = processHTML(htmlContent, htmlFile);
                fs.writeFileSync(path.join(CONFIG.distDir, htmlFile), processedHtml);
                logSuccess(`Processed ${htmlFile}`);
            } else {
                logWarning(`${htmlFile} not found in source directory (${CONFIG.sourceDir})`);
            }
        });
        
        // Process CSS files
        logInfo('Processing CSS files...');
        const cssPath = path.join(CONFIG.sourceDir, 'wb.css');
        if (fs.existsSync(cssPath)) {
            let cssContent = fs.readFileSync(cssPath, 'utf8');
            
            if (CONFIG.minifyCss) {
                cssContent = minifyCSS(cssContent, 'wb.css');
                fs.writeFileSync(path.join(CONFIG.distDir, 'wb.min.css'), cssContent);
                logSuccess('Created wb.min.css (minified)');
                
                // Update HTML references
                const htmlPath = path.join(CONFIG.distDir, 'wb.html');
                if (fs.existsSync(htmlPath)) {
                    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
                    htmlContent = htmlContent.replace(/wb\.css/g, 'wb.min.css');
                    fs.writeFileSync(htmlPath, htmlContent);
                }
            } else {
                copyFile(cssPath, path.join(CONFIG.distDir, 'wb.css'), 'CSS file');
            }
        } else {
            logWarning('wb.css not found in source directory');
        }
        
        // Process JavaScript files
        logInfo('Processing JavaScript files...');
        const jsPath = path.join(CONFIG.sourceDir, 'wb.js');
        if (fs.existsSync(jsPath)) {
            let jsContent = fs.readFileSync(jsPath, 'utf8');
            
            if (CONFIG.obfuscateJs) {
                jsContent = obfuscateJavaScript(jsContent, 'wb.js');
                fs.writeFileSync(path.join(CONFIG.distDir, 'wb.min.js'), jsContent);
                logSuccess('Created wb.min.js (obfuscated)');
                
                // Ensure no wb.js exists in dist to prevent conflicts
                deleteFile(path.join(CONFIG.distDir, 'wb.js'), true);
                
            } else {
                copyFile(jsPath, path.join(CONFIG.distDir, 'wb.js'), 'JavaScript file');
            }
        } else {
            logWarning('wb.js not found in source directory');
        }
        
        // Copy assets if enabled
        if (CONFIG.copyAssets) {
            copyAssets();
        }
        
        // Validate output if enabled
        if (CONFIG.validateOutput) {
            const securityChecks = verifyBuildSecurity();
            const failedChecks = securityChecks.filter(check => check.status === 'FAIL');
            
            if (failedChecks.length > 0) {
                logError('Build validation failed!');
                failedChecks.forEach(check => {
                    logError(`${check.name}: ${check.message}`);
                });
                process.exit(1);
            }
        }
        
        // Generate build report
        log('\n📁 Distribution Contents:', 'cyan');
        const distFiles = fs.readdirSync(CONFIG.distDir);
        let totalSize = 0;
        
        distFiles.forEach(file => {
            const filePath = path.join(CONFIG.distDir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isFile()) {
                const size = stats.size / 1024;
                totalSize += size;
                log(`   📄 ${file} (${size.toFixed(2)} KB)`, 'green');
            } else if (stats.isDirectory()) {
                log(`   📁 ${file}/`, 'blue');
            }
        });
        
        const buildTime = ((Date.now() - startTime) / 1000).toFixed(2);
        
        log('\n' + '═'.repeat(60), 'cyan');
        logSuccess(`🎉 Build completed successfully in ${buildTime}s!`);
        log(`📍 Output: ${CONFIG.distDir} (${totalSize.toFixed(2)} KB total)`, 'blue');
        
        if (CONFIG.obfuscateJs) {
            log('🔒 JavaScript obfuscated for security', 'magenta');
        }
        if (CONFIG.minifyCss) {
            log('🗜️  CSS minified for performance', 'magenta');
        }
        
        log('\n💡 Next steps:', 'yellow');
        log('   1. Test the distribution in a web browser', 'yellow');
        log('   2. Verify all functionality works correctly', 'yellow');
        log('   3. Deploy to your web server', 'yellow');
        
    } catch (error) {
        logError(`Build failed: ${error.message}`);
        logDebug(error.stack);
        process.exit(1);
    }
}

// Build with custom options
function buildWithOptions(options = {}) {
    const originalConfig = { ...CONFIG };
    
    try {
        // Merge options with default config
        Object.assign(CONFIG, options);
        
        logDebug(`Custom build options: ${JSON.stringify(options, null, 2)}`);
        
        buildDistribution();
        
    } finally {
        // Restore original config
        Object.assign(CONFIG, originalConfig);
    }
}

// Advanced command line interface
function parseArguments() {
    const args = process.argv.slice(2);
    const options = {};
    const flags = [];
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg.startsWith('--')) {
            if (arg.includes('=')) {
                const [key, value] = arg.substring(2).split('=');
                options[key.replace(/-/g, '_')] = value;
            } else {
                const key = arg.substring(2).replace(/-/g, '_');
                
                // Check if next arg is a value
                if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
                    options[key] = args[i + 1];
                    i++; // Skip next arg since we used it as value
                } else {
                    flags.push(key);
                }
            }
        } else if (arg.startsWith('-')) {
            flags.push(...arg.substring(1).split(''));
        }
    }
    
    return { options, flags };
}

function showHelp() {
    console.log(`
${colors.bright}Website Builder Distribution Build Script${colors.reset}
${colors.cyan}═${'═'.repeat(50)}${colors.reset}

${colors.yellow}Usage:${colors.reset} node build-dist.js [options]

${colors.yellow}Options:${colors.reset}
  --source=DIR          Source directory (default: wb)
  --dist=DIR           Distribution directory (default: dist/wb)
  --no-obfuscate       Disable JavaScript obfuscation
  --no-minify          Disable CSS minification
  --no-clean           Skip cleaning previous build
  --no-assets          Skip copying asset files
  --no-validate        Skip build validation
  --dev                Development mode (no obfuscation/minification)
  --source-maps        Include source maps (dev mode only)
  --preserve-comments  Keep comments in output
  --help, -h           Show this help message
  --version, -v        Show version information

${colors.yellow}Examples:${colors.reset}
  ${colors.green}node build-dist.js${colors.reset}
    Standard production build with obfuscation and minification

  ${colors.green}node build-dist.js --dev${colors.reset}
    Development build (no obfuscation, keep comments)

  ${colors.green}node build-dist.js --no-obfuscate --source=src --dist=build${colors.reset}
    Custom directories, no obfuscation but with minification

  ${colors.green}node build-dist.js --no-clean --no-validate${colors.reset}
    Quick build without cleaning or validation

${colors.yellow}Build Modes:${colors.reset}
  ${colors.blue}Production${colors.reset} - Full obfuscation, minification, validation
  ${colors.blue}Development${colors.reset} - No obfuscation, preserved formatting, source maps
`);
}

// Main CLI function
function main() {
    const { options, flags } = parseArguments();
    
    // Handle help and version
    if (flags.includes('h') || flags.includes('help')) {
        showHelp();
        return;
    }
    
    if (flags.includes('v') || flags.includes('version')) {
        console.log('Website Builder Build Script v1.0.0');
        return;
    }
    
    // Parse build options
    const buildOptions = {};
    
    // Directory options
    if (options.source) buildOptions.sourceDir = options.source;
    if (options.dist) buildOptions.distDir = options.dist;
    
    // Feature toggles
    if (flags.includes('no_obfuscate')) buildOptions.obfuscateJs = false;
    if (flags.includes('no_minify')) buildOptions.minifyCss = false;
    if (flags.includes('no_clean')) buildOptions.cleanBuild = false;
    if (flags.includes('no_assets')) buildOptions.copyAssets = false;
    if (flags.includes('no_validate')) buildOptions.validateOutput = false;
    
    // Development mode
    if (flags.includes('dev')) {
        buildOptions.developmentMode = true;
        buildOptions.obfuscateJs = false;
        buildOptions.minifyCss = false;
        buildOptions.preserveComments = true;
        buildOptions.includeSourceMaps = true;
    }
    
    // Other options
    if (flags.includes('source_maps')) buildOptions.includeSourceMaps = true;
    if (flags.includes('preserve_comments')) buildOptions.preserveComments = true;
    
    // Start build
    buildWithOptions(buildOptions);
}

// Export functions for use as module
module.exports = {
    buildDistribution,
    buildWithOptions,
    obfuscateJavaScript,
    minifyCSS,
    CONFIG
};

// Run if called directly
if (require.main === module) {
    main();
}