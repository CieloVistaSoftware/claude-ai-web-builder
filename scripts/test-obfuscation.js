// Test script to verify obfuscation system is working
console.log("Testing obfuscation system...");

const fs = require('fs');
const path = require('path');

// Check if obfuscation script exists
const obfuscateScript = path.join(__dirname, 'scripts', 'obfuscate.js');
if (fs.existsSync(obfuscateScript)) {
    console.log("✅ Obfuscation script found");
} else {
    console.log("❌ Obfuscation script missing");
}

// Check if wb.js exists
const wbJs = path.join(__dirname, 'wb', 'wb.js');
if (fs.existsSync(wbJs)) {
    console.log("✅ Source wb.js found");
} else {
    console.log("❌ Source wb.js missing");
}

// Check if dist directory exists
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
    console.log("✅ Dist directory exists");
} else {
    console.log("❌ Dist directory missing");
}

console.log("Test complete. Run 'npm run obfuscate' to test the obfuscation system.");