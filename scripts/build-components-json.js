// build-components-json.js
// Scans all component schema files and merges their "tags" into tools/wb-components.html-data.json
// Usage: npm run build:componentsjson

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '..', 'components');
const outputFile = path.join(__dirname, '..', 'tools', 'wb-components.html-data.json');

function findSchemaFiles(dir) {
