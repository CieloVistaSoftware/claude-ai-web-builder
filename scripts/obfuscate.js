const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist/wb');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Source and output paths
const inputFile = path.join(__dirname, '../wb/wb.js');
const outputFile = path.join(distDir, 'wb.min.js');

// Copy other files to dist
const filesToCopy = [
    { src: '../wb/wb.css', dest: path.join(distDir, 'wb.css') },
    { src: '../wb/wb.html', dest: path.join(distDir, 'wb.html') }
];

filesToCopy.forEach(({ src, dest }) => {
    const srcPath = path.join(__dirname, src);
    if (fs.existsSync(srcPath)) {
        let content = fs.readFileSync(srcPath, 'utf8');
        
        // Update script reference in HTML
        if (src.endsWith('.html')) {
            content = content.replace(
                'src="../dist/wb/wb.js"',
                'src="wb.min.js"'
            );
        }
        
        fs.writeFileSync(dest, content);
        console.log(`📁 Copied: ${src} → ${dest}`);
    }
});

const sourceCode = fs.readFileSync(inputFile, 'utf8');

// Obfuscate the code
const obfuscationResult = JavaScriptObfuscator.obfuscate(sourceCode, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: true,
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
    transformObjectKeys: true,
    unicodeEscapeSequence: false
});

// Write obfuscated code
fs.writeFileSync(outputFile, obfuscationResult.getObfuscatedCode());
console.log('✅ JavaScript obfuscated successfully!');
console.log(`📁 Source: ${inputFile}`);
console.log(`📁 Output: ${outputFile}`);
console.log(`🚀 Ready for deployment from dist/wb/ folder`);