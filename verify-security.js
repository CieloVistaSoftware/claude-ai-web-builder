// Security Verification Script
// Checks that wb.js is NEVER in the dist folder

const fs = require('fs');
const path = require('path');

console.log('🔍 SECURITY CHECK: Verifying source code protection...\n');

const distWbJs = path.join(__dirname, 'dist', 'wb', 'wb.js');
const distWbMinJs = path.join(__dirname, 'dist', 'wb', 'wb.min.js');
const sourceWbJs = path.join(__dirname, 'wb', 'wb.js');

// Check 1: wb.js should NOT exist in dist
if (fs.existsSync(distWbJs)) {
    console.log('❌ SECURITY BREACH: wb.js found in dist folder!');
    console.log('🚨 Your source code is exposed!');
} else {
    console.log('✅ SECURE: No wb.js in dist folder');
}

// Check 2: wb.min.js SHOULD exist in dist
if (fs.existsSync(distWbMinJs)) {
    console.log('✅ PROTECTED: wb.min.js (obfuscated) found in dist');
} else {
    console.log('⚠️  WARNING: No wb.min.js found - run npm run obfuscate');
}

// Check 3: Source should exist
if (fs.existsSync(sourceWbJs)) {
    console.log('✅ SOURCE: wb.js found in source folder');
} else {
    console.log('⚠️  WARNING: No source wb.js found');
}

console.log('\n🛡️  Protection mechanism: The obfuscation script has a condition:');
console.log('   if (file.endsWith(\'.js\')) { return; }');
console.log('   This prevents ANY .js file from being copied to dist');
console.log('   Only .min.js (obfuscated) files are created in dist');