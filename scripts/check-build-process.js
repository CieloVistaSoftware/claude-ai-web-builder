// Quick check of build process behavior
const fs = require('fs');
const path = require('path');

console.log('Checking build process...');

// Check if build.js exists
const buildPath = './build.js';
if (fs.existsSync(buildPath)) {
    console.log('✓ build.js found');
    
    // Read build.js content to understand dist folder handling
    const buildContent = fs.readFileSync(buildPath, 'utf8');
    
    // Look for dist folder operations
    const distOperations = [];
    const lines = buildContent.split('\n');
    
    lines.forEach((line, index) => {
        if (line.includes('dist') || line.includes('rmSync') || line.includes('unlinkSync') || 
            line.includes('rm -rf') || line.includes('clean') || line.includes('delete')) {
            distOperations.push(`Line ${index + 1}: ${line.trim()}`);
        }
    });
    
    if (distOperations.length > 0) {
        console.log('\nDist folder operations found:');
        distOperations.forEach(op => console.log(op));
    } else {
        console.log('\nNo explicit dist folder cleanup operations found');
    }
    
} else {
    console.log('✗ build.js not found');
}

// Check if dist folder exists
const distPath = './dist';
if (fs.existsSync(distPath)) {
    console.log('✓ dist folder exists');
    const files = fs.readdirSync(distPath);
    console.log(`  Contains ${files.length} files/folders`);
} else {
    console.log('✗ dist folder does not exist');
}