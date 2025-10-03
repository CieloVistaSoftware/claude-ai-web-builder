const fs = require('fs');
const path = require('path');

// Directory containing components
const componentsDir = path.join(__dirname, '..', 'components');

// Find all schema files
const schemaFiles = [];
function findSchemaFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory() && item.startsWith('wb-')) {
      const schemaPath = path.join(itemPath, item + '.schema.json');
      if (fs.existsSync(schemaPath)) {
        schemaFiles.push({
          componentName: item,
          schemaPath: schemaPath
        });
      }
    }
  }
}

findSchemaFiles(componentsDir);

// Process schemas and convert to VS Code format
const vscodeData = {
  version: 1.1,
  tags: [],
  valueSets: []
};

const valueSets = new Map();

for (const { componentName, schemaPath } of schemaFiles) {
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);
    
    const tag = {
      name: componentName,
      description: schema.description || schema.title || `${componentName} web component`,
      attributes: []
    };
    
    // Process properties
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        const attribute = {
          name: propName,
          description: propSchema.description || `${propName} attribute`
        };
        
        // Handle enums
        if (propSchema.enum && propSchema.enum.length > 0) {
          const valueSetName = `${componentName}-${propName}`;
          attribute.valueSet = valueSetName;
          
          // Create value set if not exists
          if (!valueSets.has(valueSetName)) {
            valueSets.set(valueSetName, {
              name: valueSetName,
              values: propSchema.enum.map(value => ({
                name: value,
                description: `${value} option`
              }))
            });
          }
        }
        
        // Add type information for boolean
        if (propSchema.type === 'boolean') {
          attribute.valueSet = 'booleanValues';
          if (!valueSets.has('booleanValues')) {
            valueSets.set('booleanValues', {
              name: 'booleanValues',
              values: [
                { name: 'true', description: 'True value' },
                { name: 'false', description: 'False value' }
              ]
            });
          }
        }
        
        tag.attributes.push(attribute);
      }
    }
    
    vscodeData.tags.push(tag);
    
  } catch (error) {
    console.error(`Error processing ${schemaPath}: ${error.message}`);
  }
}

// Add all value sets
vscodeData.valueSets = Array.from(valueSets.values());

// Sort tags and valueSets for consistency
vscodeData.tags.sort((a, b) => a.name.localeCompare(b.name));
vscodeData.valueSets.sort((a, b) => a.name.localeCompare(b.name));

// Write HTML data file
const htmlDataPath = path.join(__dirname, 'wb-components.html-data.json');
fs.writeFileSync(htmlDataPath, JSON.stringify(vscodeData, null, 2));
console.log(`Generated HTML data file: ${htmlDataPath}`);
console.log(`Processed ${vscodeData.tags.length} components with ${vscodeData.valueSets.length} value sets`);
