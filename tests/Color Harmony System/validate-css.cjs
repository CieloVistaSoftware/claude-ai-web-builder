// Manual CSS validation script
const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, '..', '..', 'html', 'Color Harmony System', 'article', 'Professional-Developer-HCS-System.css');

console.log('🔍 Validating CSS file for button consistency...\n');

const css = fs.readFileSync(cssFile, 'utf8');
const lines = css.split('\n');

// Find all button-related rules
let buttonRules = [];
let inButtonRule = false;
let currentRule = { start: 0, lines: [], selector: '' };

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Check if line contains button selector
  if ((line.includes('.nav-btn') || line.includes('button')) && line.includes('{')) {
    inButtonRule = true;
    currentRule = { start: i + 1, lines: [line], selector: line };
  } else if (inButtonRule) {
    currentRule.lines.push(line);
    if (line.includes('}')) {
      inButtonRule = false;
      buttonRules.push(currentRule);
    }
  }
}

console.log(`Found ${buttonRules.length} button-related CSS rules:\n`);

buttonRules.forEach((rule, index) => {
  console.log(`Rule ${index + 1} (Line ${rule.start}):`);
  console.log(rule.selector);
  console.log(rule.lines.slice(0, 5).join('\n'));
  if (rule.lines.length > 5) {
    console.log(`  ... (${rule.lines.length - 5} more lines)`);
  }
  console.log('');
});

// Check for variables
console.log('\n📊 Checking CSS variables:');
const hasBackground = css.includes('--background:');
const hasForeground = css.includes('--foreground:');
const hasBorder = css.includes('--border:');
const hasDynamicBackground = css.includes('--dynamic-background:');
const hasStaticClass = css.includes('.static-colors');

console.log(`  --background defined: ${hasBackground ? '✅' : '❌'}`);
console.log(`  --foreground defined: ${hasForeground ? '✅' : '❌'}`);
console.log(`  --border defined: ${hasBorder ? '✅' : '❌'}`);
console.log(`  --dynamic-background defined: ${hasDynamicBackground ? '✅' : '❌'}`);
console.log(`  .static-colors class: ${hasStaticClass ? '✅' : '❌'}`);

console.log('\n✅ CSS validation complete');

// Summary
if (buttonRules.length <= 5 && hasBackground && hasForeground && hasBorder) {
  console.log('\n✅ CSS appears correctly configured for tests');
} else {
  console.log('\n⚠️  CSS may have issues:');
  if (buttonRules.length > 5) {
    console.log(`  - Too many button rules (${buttonRules.length}), expected 3-5`);
  }
  if (!hasBackground || !hasForeground || !hasBorder) {
    console.log('  - Missing required CSS variables');
  }
}
