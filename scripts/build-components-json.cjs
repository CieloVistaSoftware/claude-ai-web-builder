// build-components-json.cjs
// Renamed from build-components-json.js to support require() in Node ES module context.

const fs = require('fs');
const path = require('path');

// ...existing code from build-components-json.js...

// Read all component schema files and aggregate tags for VS Code html custom data
const componentsDir = path.join(__dirname, '../components');
const outputFile = path.join(__dirname, '../wb-components.html-data.json');

function findSchemaFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findSchemaFiles(filePath));
    } else if (file.endsWith('.schema.json')) {
      results.push(filePath);
    }
  });
  return results;
}

function extractTagName(schemaPath) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  if (schema && schema['$id']) {
    const match = schema['$id'].match(/([a-z0-9\-]+)\.schema\.json$/);
    if (match) return match[1];
  }
  if (schema && schema['title']) {
    return schema['title'];
  }
  return null;
}

function buildHtmlData() {
  const schemas = findSchemaFiles(componentsDir);
  const tags = schemas.map(extractTagName).filter(Boolean).map(tag => ({
    name: tag,
    description: `Web component <${tag}>`
  }));
  const htmlData = {
    version: 1.1,
    tags
  };
  fs.writeFileSync(outputFile, JSON.stringify(htmlData, null, 2));
  console.log(`Wrote ${tags.length} tags to wb-components.html-data.json`);
}

buildHtmlData();
