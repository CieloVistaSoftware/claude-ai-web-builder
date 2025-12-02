/**
 * Check Test Coverage
 * 
 * Compares components folder to tests folder and reports:
 * - Which components have tests
 * - Which components are missing tests
 * 
 * Usage: node tests/check-test-coverage.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, '..', 'components');
const testsDir = __dirname;

// Get all wb-* component folders
const components = fs.readdirSync(componentsDir)
    .filter(f => f.startsWith('wb-') && fs.statSync(path.join(componentsDir, f)).isDirectory())
    .sort();

// Get all wb-* test folders
const testFolders = fs.readdirSync(testsDir)
    .filter(f => f.startsWith('wb-') && fs.statSync(path.join(testsDir, f)).isDirectory())
    .sort();

// Compare
const withTests = components.filter(c => testFolders.includes(c));
const missingTests = components.filter(c => !testFolders.includes(c));

console.log('═'.repeat(60));
console.log('WB COMPONENT TEST COVERAGE REPORT');
console.log('═'.repeat(60));
console.log('');

console.log(`Total Components: ${components.length}`);
console.log(`With Tests:       ${withTests.length} (${Math.round(withTests.length/components.length*100)}%)`);
console.log(`Missing Tests:    ${missingTests.length} (${Math.round(missingTests.length/components.length*100)}%)`);
console.log('');

console.log('─'.repeat(60));
console.log('✅ COMPONENTS WITH TESTS');
console.log('─'.repeat(60));
withTests.forEach(c => console.log(`  ✅ ${c}`));
console.log('');

console.log('─'.repeat(60));
console.log('❌ COMPONENTS MISSING TESTS');
console.log('─'.repeat(60));
missingTests.forEach(c => console.log(`  ❌ ${c}`));
console.log('');

console.log('═'.repeat(60));
console.log('To create a missing test:');
console.log('  node tests/create-component-test.js wb-{name}');
console.log('═'.repeat(60));
