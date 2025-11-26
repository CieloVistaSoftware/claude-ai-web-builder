// Component Architecture Audit Script
// Scans all component .js files and reports their current state

const fs = require('fs');
const path = require('path');

const componentsDir = './components';
const results = [];

// Get all component directories
const components = fs.readdirSync(componentsDir)
    .filter(item => {
        const fullPath = path.join(componentsDir, item);
        return fs.statSync(fullPath).isDirectory() && item.startsWith('wb-');
    });

console.log(`\n🔍 Scanning ${components.length} components...\n`);

components.forEach(componentName => {
    const jsFile = path.join(componentsDir, componentName, `${componentName}.js`);
    
    if (!fs.existsSync(jsFile)) {
        results.push({
            component: componentName,
            status: '❌ Missing',
            hasIIFE: false,
            hasExport: false,
            hasWindow: false
        });
        return;
    }
    
    const content = fs.readFileSync(jsFile, 'utf8');
    
    // Check for patterns
    const hasIIFE = content.includes('(function()') || content.includes('(function ()');
    const hasExport = content.includes('export {') || content.includes('export default');
    const hasWindow = content.includes('window.');
    
    let status;
    if (hasIIFE && !hasExport) {
        status = '⚠️ IIFE - Needs Conversion';
    } else if (!hasIIFE && hasExport && hasWindow) {
        status = '✅ Compliant';
    } else if (!hasIIFE && !hasExport) {
        status = '⚠️ Missing Exports';
    } else {
        status = '❓ Review';
    }
    
    results.push({
        component: componentName,
        status,
        hasIIFE,
        hasExport,
        hasWindow
    });
});

// Print results
console.log('📊 Audit Results:\n');
results.forEach(r => {
    console.log(`${r.status.padEnd(30)} ${r.component}`);
});

// Summary
const needsConversion = results.filter(r => r.status.includes('⚠️')).length;
const compliant = results.filter(r => r.status.includes('✅')).length;

console.log('\n' + '='.repeat(60));
console.log(`✅ Compliant: ${compliant}`);
console.log(`⚠️ Needs Work: ${needsConversion}`);
console.log(`Total: ${results.length}`);
console.log('='.repeat(60) + '\n');
