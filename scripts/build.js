#!/usr/bin/env node

/**
 * Simple Website Builder Build Script
 * Defaults to obfuscation and minification
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting complete build process...');

// Kill any existing node processes first
try {
    console.log('🔪 Killing existing node processes...');
    execSync('powershell -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"', { stdio: 'inherit' });
    console.log('✅ Processes killed');
} catch (error) {
    console.log('ℹ️ No processes to kill');
}

// Clean and create dist folder
console.log('🧹 Cleaning dist folder...');
if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
}
fs.mkdirSync('./dist/wb', { recursive: true });
console.log('✅ Dist folder cleaned and created');

// Copy latest HTML file
console.log('📄 Copying latest HTML file...');
const htmlSource = './wb/wb.html';
const htmlDest = './dist/wb/wb.html';
if (fs.existsSync(htmlSource)) {
    let htmlContent = fs.readFileSync(htmlSource, 'utf8');
    // Ensure it references wb.min.js
    htmlContent = htmlContent.replace(/src="wb\.js"/, 'src="wb.min.js"');
    htmlContent = htmlContent.replace(/src="wb-new\.js"/, 'src="wb.min.js"');
    htmlContent = htmlContent.replace(/src="wb-main\.js"/, 'src="wb.min.js"');
    fs.writeFileSync(htmlDest, htmlContent);
    console.log('✅ HTML file copied and updated');
} else {
    console.error('❌ Source HTML file not found:', htmlSource);
}

// Copy latest CSS file
console.log('🎨 Copying latest CSS file...');
const cssSource = './wb/wb.css';
const cssDest = './dist/wb/wb.css';
if (fs.existsSync(cssSource)) {
    fs.copyFileSync(cssSource, cssDest);
    console.log('✅ CSS file copied');
} else {
    console.error('❌ Source CSS file not found:', cssSource);
}

// Build and obfuscate JavaScript
console.log('⚙️ Building and obfuscating JavaScript...');

// Get the working JS file (prioritize wb-new.js as it has latest functionality)
let jsSource = null;
const jsSources = ['./wb/wb-new.js', './wb/wb-main.js', './wb/wb.js'];
for (const source of jsSources) {
    if (fs.existsSync(source)) {
        jsSource = source;
        break;
    }
}

if (!jsSource) {
    console.error('❌ No source JavaScript file found');
    process.exit(1);
}

console.log(`📜 Using JavaScript source: ${jsSource}`);
const jsContent = fs.readFileSync(jsSource, 'utf8');

// Aggressive obfuscation function
function obfuscateJS(code) {
    console.log('🔒 Applying aggressive obfuscation...');
    
    // Remove comments and compress
    let obfuscated = code
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
        .replace(/\/\/.*$/gm, '') // Remove // comments
        .replace(/\s+/g, ' ') // Compress whitespace
        .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .trim();

    // Variable obfuscation with hex names
    const varMap = new Map();
    let counter = 0;
    
    // Find variables and functions
    const varRegex = /(?:let|const|var|function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    while ((match = varRegex.exec(obfuscated)) !== null) {
        const varName = match[1];
        if (!varMap.has(varName) && !['console', 'document', 'window', 'alert', 'prompt'].includes(varName)) {
            varMap.set(varName, `_0x${counter.toString(16)}`);
            counter++;
        }
    }
    
    // Replace variable names
    for (const [original, replacement] of varMap) {
        const regex = new RegExp(`\\b${original}\\b`, 'g');
        obfuscated = obfuscated.replace(regex, replacement);
    }
    
    console.log(`🔒 Obfuscated ${varMap.size} variables/functions`);
    return obfuscated;
}

const obfuscatedJS = obfuscateJS(jsContent);
const jsDest = './dist/wb/wb.min.js';
fs.writeFileSync(jsDest, obfuscatedJS);
console.log('✅ JavaScript obfuscated and saved as wb.min.js');

console.log('🎉 Build process completed successfully!');
console.log('📁 Dist folder contents:');
try {
    const distFiles = fs.readdirSync('./dist/wb');
    distFiles.forEach(file => console.log(`   📄 ${file}`));
} catch (error) {
    console.log('   (could not list files)');
}

// Simple configuration - defaults to obfuscation
const CONFIG = {
    sourceDir: path.join(__dirname, 'wb'),
    distDir: path.join(__dirname, 'dist'),
    obfuscate: true,
    minify: true
};

function log(message, color = '') {
    const colors = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        blue: '\x1b[34m',
        reset: '\x1b[0m'
    };
    console.log(colors[color] + message + colors.reset);
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function obfuscateJS(content) {
    // Comprehensive obfuscation - ALWAYS applied to wb.min.js
    const vars = {
        'isEditMode': '_0xa1b2',
        'clickTimer': '_0xc3d4',
        'clickCount': '_0xe5f6',
        'activeElement': '_0xg7h8',
        'toggleEditMode': '_0xi9j0',
        'saveWebsite': '_0xk1l2',
        'editElement': '_0xm3n4',
        'selectElement': '_0xo5p6',
        'initializeBuilder': '_0xq7r8',
        'setupEditToggle': '_0xs9t0',
        'setupEditableElements': '_0xu1v2',
        'handleElementClick': '_0xw3x4',
        'handleElementDoubleClick': '_0xy5z6',
        'updateStatus': '_0xa7b8',
        'addEditModeStyles': '_0xc9d0'
    };
    
    // Function name obfuscation
    const functions = {
        'function initializeBuilder': 'function _0xInit',
        'function setupEditToggle': 'function _0xSetup',
        'function setupEditableElements': 'function _0xElements',
        'function handleElementClick': 'function _0xClick',
        'function handleElementDoubleClick': 'function _0xDblClick',
        'function selectElement': 'function _0xSelect',
        'function editElement': 'function _0xEdit',
        'function toggleEditMode': 'function _0xToggle',
        'function updateStatus': 'function _0xStatus',
        'function addEditModeStyles': 'function _0xStyles'
    };
    
    // String obfuscation
    const strings = {
        '"edit-toggle"': '"_0xe1"',
        '"wb-selected"': '"_0xs1"',
        '"wb-editable"': '"_0xe2"',
        '"wb-edit-mode"': '"_0xm1"',
        '"status"': '"_0xst"',
        '"properties-panel"': '"_0xpp"',
        'console.log': '/* removed */',
        'console.warn': '/* removed */',
        'console.error': '/* removed */'
    };
    
    let obfuscated = content;
    
    // Apply variable obfuscation
    for (const [orig, repl] of Object.entries(vars)) {
        const regex = new RegExp(`\\b${orig}\\b`, 'g');
        obfuscated = obfuscated.replace(regex, repl);
    }
    
    // Apply function obfuscation
    for (const [orig, repl] of Object.entries(functions)) {
        const regex = new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        obfuscated = obfuscated.replace(regex, repl);
    }
    
    // Apply string obfuscation
    for (const [orig, repl] of Object.entries(strings)) {
        const regex = new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        obfuscated = obfuscated.replace(regex, repl);
    }
    
    // Aggressive compression and obfuscation
    obfuscated = obfuscated
        // Remove all comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        // Remove console statements completely
        .replace(/console\.(log|debug|info|warn|error)\([^)]*\);?/gm, '')
        // Remove debugger statements
        .replace(/debugger;?/g, '')
        // Compress whitespace aggressively
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, ';}')
        .replace(/{\s*/g, '{')
        .replace(/}\s*/g, '}')
        .replace(/;\s*/g, ';')
        .replace(/,\s*/g, ',')
        .replace(/:\s*/g, ':')
        .replace(/\(\s*/g, '(')
        .replace(/\s*\)/g, ')')
        .replace(/\[\s*/g, '[')
        .replace(/\s*\]/g, ']')
        // Remove spaces around operators
        .replace(/\s*=\s*/g, '=')
        .replace(/\s*\+\s*/g, '+')
        .replace(/\s*-\s*/g, '-')
        .replace(/\s*\*\s*/g, '*')
        .replace(/\s*\/\s*/g, '/')
        .replace(/\s*&&\s*/g, '&&')
        .replace(/\s*\|\|\s*/g, '||')
        .replace(/\s*!\s*/g, '!')
        // Remove extra semicolons
        .replace(/;;+/g, ';')
        .trim();
    
    // Add obfuscation header
    const header = `/*! Obfuscated ${new Date().toISOString()} */\n`;
    
    return header + obfuscated;
}

function minifyCSS(content) {
    return content
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, ';}')
        .replace(/{\s*/g, '{')
        .replace(/:\s*/g, ':')
        .replace(/,\s*/g, ',')
        .trim();
}

function build() {
    try {
        log('🚀 Building Website Builder...', 'blue');
        
        // Ensure dist directory
        ensureDir(CONFIG.distDir);
        
        // Clean previous build
        if (fs.existsSync(CONFIG.distDir)) {
            const files = fs.readdirSync(CONFIG.distDir);
            files.forEach(file => {
                const filePath = path.join(CONFIG.distDir, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            });
        }
        
        // Copy and process HTML
        const htmlPath = path.join(CONFIG.sourceDir, 'wb.html');
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf8');
            
            // Update references for minified files
            html = html.replace(/wb\.js/g, 'wb.min.js');
            html = html.replace(/wb\.css/g, 'wb.min.css');
            
            fs.writeFileSync(path.join(CONFIG.distDir, 'wb.html'), html);
            log('✅ Processed wb.html', 'green');
        }
        
        // Process JavaScript - ALWAYS OBFUSCATE wb.min.js
        const jsPath = path.join(CONFIG.sourceDir, 'wb.js');
        if (fs.existsSync(jsPath)) {
            let js = fs.readFileSync(jsPath, 'utf8');
            
            // ALWAYS obfuscate - wb.min.js is NEVER unobfuscated
            js = obfuscateJS(js);
            log('✅ JavaScript heavily obfuscated', 'green');
            
            fs.writeFileSync(path.join(CONFIG.distDir, 'wb.min.js'), js);
            log('✅ Created wb.min.js (OBFUSCATED)', 'green');
        }
        
        // Process CSS
        const cssPath = path.join(CONFIG.sourceDir, 'wb.css');
        if (fs.existsSync(cssPath)) {
            let css = fs.readFileSync(cssPath, 'utf8');
            
            if (CONFIG.minify) {
                css = minifyCSS(css);
                log('✅ CSS minified', 'green');
            }
            
            fs.writeFileSync(path.join(CONFIG.distDir, 'wb.min.css'), css);
            log('✅ Created wb.min.css', 'green');
        }
        
        // Copy additional files
        const additionalFiles = ['wb-mobile.css'];
        additionalFiles.forEach(file => {
            const srcPath = path.join(CONFIG.sourceDir, file);
            if (fs.existsSync(srcPath)) {
                const content = fs.readFileSync(srcPath, 'utf8');
                fs.writeFileSync(path.join(CONFIG.distDir, file), content);
                log(`✅ Copied ${file}`, 'green');
            }
        });
        
        // Show results
        const files = fs.readdirSync(CONFIG.distDir);
        log('\n📁 Build complete! Files created:', 'blue');
        files.forEach(file => {
            const filePath = path.join(CONFIG.distDir, file);
            const size = (fs.statSync(filePath).size / 1024).toFixed(2);
            log(`   ${file} (${size} KB)`, 'green');
        });
        
        log(`\n🎉 Production build ready in: ${CONFIG.distDir}`, 'green');
        
    } catch (error) {
        log(`❌ Build failed: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Run build
build();