#!/usr/bin/env node

const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Directories
const sourceDir = path.join(__dirname, '..', 'wb');
const distDir = path.join(__dirname, '..', 'dist', 'wb');

console.log('🔒 Starting JavaScript obfuscation process...\n');

// 🧹 SECURITY CRITICAL: Always clean dist folder first
console.log('🧹 Cleaning dist folder for security...');
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('✅ Previous dist/wb folder completely removed');
}

// Create fresh, clean dist directory
fs.mkdirSync(distDir, { recursive: true });
console.log('📁 Created fresh, secure dist/wb directory\n');

// Obfuscation configuration
const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: 2000,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: true,
    shuffleStringArray: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
};

try {
    // Read all files from source directory
    const files = fs.readdirSync(sourceDir);
    
    // Copy non-JavaScript files (CSS, HTML, etc.)
    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(distDir, file);
        
        // 🛡️ SECURITY: Never copy source code files to dist
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            console.log(`🔒 SECURITY BLOCK: ${file} (protecting source code - will obfuscate instead)`);
            return; // This ensures wb.js AND wb.ts NEVER get copied
        }
        
        // Copy non-JS files
        fs.copyFileSync(sourcePath, destPath);
        console.log(`📁 Copied: ${path.relative(process.cwd(), sourcePath)} → ${destPath}`);
    });
    
    // Find and obfuscate JavaScript files
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    jsFiles.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const sourceCode = fs.readFileSync(sourcePath, 'utf8');
        
        console.log(`\n🔒 Obfuscating: ${file}`);
        
        // Obfuscate the code
        const obfuscatedResult = JavaScriptObfuscator.obfuscate(sourceCode, obfuscationOptions);
        
        // Create minified filename (wb.js → wb.min.js)
        const minifiedName = file.replace('.js', '.min.js');
        const destPath = path.join(distDir, minifiedName);
        
        // Write obfuscated code
        fs.writeFileSync(destPath, obfuscatedResult.getObfuscatedCode());
        console.log(`✅ Created: ${minifiedName} (${Math.round(obfuscatedResult.getObfuscatedCode().length / 1024)}KB)`);
    });
    
    // Update HTML files to use .min.js versions
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    htmlFiles.forEach(file => {
        const htmlPath = path.join(distDir, file);
        if (fs.existsSync(htmlPath)) {
            let htmlContent = fs.readFileSync(htmlPath, 'utf8');
            
            console.log(`\n🔄 Updating ${file} references...`);
            
            // Replace .js references with .min.js
            jsFiles.forEach(jsFile => {
                const originalRef = jsFile;
                const minifiedRef = jsFile.replace('.js', '.min.js');
                
                // Replace various script reference patterns with simple filename
                const patterns = [
                    new RegExp(`src="${originalRef}"`, 'g'),
                    new RegExp(`src='${originalRef}'`, 'g'),
                    new RegExp(`src="[^"]*/${originalRef}"`, 'g'), // Remove any path prefix
                    new RegExp(`src='[^']*/${originalRef}'`, 'g')  // Remove any path prefix
                ];
                
                patterns.forEach(pattern => {
                    if (pattern.test(htmlContent)) {
                        htmlContent = htmlContent.replace(pattern, `src="${minifiedRef}"`);
                        console.log(`   ✅ Updated: ${originalRef} → ${minifiedRef}`);
                    }
                });
            });
            
            fs.writeFileSync(htmlPath, htmlContent);
            console.log(`✅ Updated ${file} to use obfuscated scripts`);
        }
    });
    
    console.log('\n🎉 Obfuscation complete!');
    
    // 🔍 Verification step
    console.log('\n🔍 Verifying created files:');
    const distFiles = fs.readdirSync(distDir);
    distFiles.forEach(file => {
        const filePath = path.join(distDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   ✅ ${file} (${Math.round(stats.size / 1024)}KB)`);
    });
    
    console.log(`\n📁 Deploy the dist/wb/ folder to your web server`);
    console.log(`🔒 Your source code in wb/ remains protected`);
    console.log(`🌐 Test locally by serving the dist/wb/ directory`);
    
} catch (error) {
    console.error('❌ Obfuscation failed:', error.message);
    process.exit(1);
}