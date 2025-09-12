// Quick check script to verify index.html references
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking index.html references...\n');

const indexPath = path.join(__dirname, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

console.log('Looking for references in index.html:');

// Check for href references
const hrefMatches = indexContent.match(/href="[^"]*"/g);
if (hrefMatches) {
    console.log('\n📁 Found href references:');
    hrefMatches.forEach(match => console.log(`   ${match}`));
}

// Check for src references  
const srcMatches = indexContent.match(/src="[^"]*"/g);
if (srcMatches) {
    console.log('\n📄 Found src references:');
    srcMatches.forEach(match => console.log(`   ${match}`));
}

// Check for any wb/ references
if (indexContent.includes('wb/')) {
    console.log('\n⚠️  Found wb/ references (should be dist/wb/):');
    const lines = indexContent.split('\n');
    lines.forEach((line, index) => {
        if (line.includes('wb/')) {
            console.log(`   Line ${index + 1}: ${line.trim()}`);
        }
    });
}

// Check if dist/wb/ references exist
if (indexContent.includes('dist/wb/')) {
    console.log('\n✅ Found dist/wb/ references (correct):');
    const lines = indexContent.split('\n');
    lines.forEach((line, index) => {
        if (line.includes('dist/wb/')) {
            console.log(`   Line ${index + 1}: ${line.trim()}`);
        }
    });
} else {
    console.log('\n❌ No dist/wb/ references found!');
}