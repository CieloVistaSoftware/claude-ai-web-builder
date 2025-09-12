#!/usr/bin/env node

/**
 * Build Script Redirect
 * This file has been consolidated into scripts/build-dist.js
 * 
 * Usage: node scripts/build-dist.js
 * Or run: cd scripts && node build-dist.js
 */

const { execSync } = require('child_process');


console.log('🔄 Redirecting to consolidated build script...');
console.log('📍 Location: scripts/build-dist.js');

try {
    // Change to scripts directory and run the build
    const scriptsDir = path.join(__dirname, 'scripts');
    process.chdir(scriptsDir);
    execSync('node build-dist.js', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Failed to run build script:', error.message);
    console.log('\n💡 Try running manually:');
    console.log('   cd scripts');
    console.log('   node build-dist.js');
    process.exit(1);
}