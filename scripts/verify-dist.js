// Verify obfuscated files exist and check HTML references
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking obfuscated files and references...\n');

const distDir = path.join(__dirname, 'dist', 'wb');
const htmlFile = path.join(distDir, 'wb.html');
const minJsFile = path.join(distDir, 'wb.min.js');

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
    console.log('❌ dist/wb directory does not exist!');
    console.log('🔧 Run: npm run obfuscate');
    process.exit(1);
}

// List all files in dist/wb
console.log('📁 Files in dist/wb/:');
const files = fs.readdirSync(distDir);
files.forEach(file => {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   ${file} (${Math.round(stats.size / 1024)}KB)`);
});

// Check if wb.min.js exists
if (fs.existsSync(minJsFile)) {
    console.log('\n✅ wb.min.js exists');
} else {
    console.log('\n❌ wb.min.js is missing!');
    console.log('🔧 Run: npm run obfuscate');
}

// Check HTML references
if (fs.existsSync(htmlFile)) {
    console.log('\n📄 Checking wb.html script references:');
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    
    // Find script tags
    const scriptMatches = htmlContent.match(/<script[^>]*src="[^"]*"[^>]*>/g);
    if (scriptMatches) {
        scriptMatches.forEach(match => {
            console.log(`   ${match}`);
            if (match.includes('wb.min.js')) {
                console.log('   ✅ Correct reference to wb.min.js');
            } else if (match.includes('wb.js')) {
                console.log('   ❌ Still references wb.js (should be wb.min.js)');
            }
        });
    } else {
        console.log('   ⚠️  No script tags found');
    }
} else {
    console.log('\n❌ wb.html is missing in dist/wb/');
}

console.log('\n💡 If wb.min.js is missing, run: npm run obfuscate');
console.log('💡 The HTML should reference just "wb.min.js" (no path prefix)');