// Find malformed href attributes in index.html
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for malformed href attributes in index.html...\n');

const indexPath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

console.log('📄 All href attributes found:');

// Find all href attributes
const hrefMatches = content.match(/href\s*=\s*["'][^"']*["']/g);
if (hrefMatches) {
    hrefMatches.forEach((match, index) => {
        console.log(`   ${index + 1}: ${match}`);
    });
} else {
    console.log('   No href attributes found');
}

// Look for problematic patterns
console.log('\n🚨 Checking for problematic patterns:');

// Empty href
if (content.includes('href=""') || content.includes("href=''")) {
    console.log('   ❌ Found empty href=""');
}

// Missing quotes
const badHrefs = content.match(/href\s*=\s*[^"'][^\s>]*/g);
if (badHrefs) {
    console.log('   ❌ Found href without quotes:');
    badHrefs.forEach(match => console.log(`      ${match}`));
}

// href= with nothing after
if (content.includes('href=') && !content.match(/href\s*=\s*["'][^"']*["']/)) {
    console.log('   ❌ Found malformed href= pattern');
}

// Show line-by-line for context
console.log('\n📋 Lines containing href:');
const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.toLowerCase().includes('href')) {
        console.log(`   Line ${index + 1}: ${line.trim()}`);
    }
});

console.log('\n💡 The URL ending with "href=" suggests a malformed link in the HTML');