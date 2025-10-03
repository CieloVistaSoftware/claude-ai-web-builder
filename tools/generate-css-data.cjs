const fs = require('fs');
const path = require('path');

// Directory containing components
const componentsDir = path.join(__dirname, '..', 'components');

// Find all CSS files
const cssFiles = [];
function findCssFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory() && item.startsWith('wb-')) {
      const cssPath = path.join(itemPath, item + '.css');
      if (fs.existsSync(cssPath)) {
        cssFiles.push({
          componentName: item,
          cssPath: cssPath
        });
      }
    }
  }
}

findCssFiles(componentsDir);

// Also check main styles directory
const stylesDir = path.join(__dirname, '..', 'styles');
if (fs.existsSync(stylesDir)) {
  const styleFiles = fs.readdirSync(stylesDir).filter(f => f.endsWith('.css'));
  for (const file of styleFiles) {
    cssFiles.push({
      componentName: path.basename(file, '.css'),
      cssPath: path.join(stylesDir, file)
    });
  }
}

// Extract CSS custom properties
const customProperties = new Set();
const customPropertyPattern = /--(\w[\w-]*)/g;

for (const { componentName, cssPath } of cssFiles) {
  try {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    let match;
    while ((match = customPropertyPattern.exec(cssContent)) !== null) {
      customProperties.add(match[1]); // Add without the -- prefix
    }
  } catch (error) {
    console.error(`Error processing ${cssPath}: ${error.message}`);
  }
}

// Create VS Code CSS custom data
const cssData = {
  version: 1.1,
  properties: Array.from(customProperties).sort().map(prop => {
    const fullPropName = `--${prop}`;
    
    // Try to determine category and description based on naming patterns
    let description = `Custom property: ${fullPropName}`;
    let category = 'Custom Properties';
    
    if (prop.includes('color') || prop.includes('bg') || prop.includes('text')) {
      category = 'Colors';
      description = `Color property: ${fullPropName}`;
    } else if (prop.includes('size') || prop.includes('width') || prop.includes('height') || prop.includes('padding') || prop.includes('margin')) {
      category = 'Sizing & Spacing';
      description = `Size/spacing property: ${fullPropName}`;
    } else if (prop.includes('font') || prop.includes('text')) {
      category = 'Typography';
      description = `Typography property: ${fullPropName}`;
    } else if (prop.includes('border') || prop.includes('radius')) {
      category = 'Borders';
      description = `Border property: ${fullPropName}`;
    } else if (prop.includes('transition') || prop.includes('animation') || prop.includes('duration')) {
      category = 'Animation';
      description = `Animation property: ${fullPropName}`;
    } else if (prop.startsWith('wb-')) {
      category = 'WB Components';
      description = `WB component property: ${fullPropName}`;
    }
    
    return {
      name: fullPropName,
      description: description,
      relevance: 90,
      references: [
        {
          name: 'WB Components Documentation',
          url: 'https://your-docs-url.com/css-variables'
        }
      ]
    };
  })
};

// Write CSS data file
const cssDataPath = path.join(__dirname, 'wb-components.css-data.json');
fs.writeFileSync(cssDataPath, JSON.stringify(cssData, null, 2));
console.log(`Generated CSS data file: ${cssDataPath}`);
console.log(`Extracted ${cssData.properties.length} CSS custom properties`);

// Show some examples
console.log('\nExample properties found:');
cssData.properties.slice(0, 10).forEach(prop => {
  console.log(`  ${prop.name} - ${prop.description}`);
});
