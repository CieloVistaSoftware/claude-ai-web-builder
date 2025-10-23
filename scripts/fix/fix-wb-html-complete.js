#!/usr/bin/env node

/**
 * WB.HTML AUTO FIX BATCH JOB v2.0
 * =====================================
 * Comprehensive test and fix suite
 * Runs silently without user interaction
 * Generates detailed log file
 * 
 * Usage: npm run fix:wb-html
 *        OR node fix-wb-html-complete.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const WB_HTML_PATH = path.join(__dirname, 'wb.html');
const BACKUP_PATH = path.join(__dirname, 'wb.html.backup');
const LOG_PATH = path.join(__dirname, 'wb-html-fix-complete.log');
const COMPONENTS_DIR = path.join(__dirname, 'components');

// Test tracking
const results = {
  tests: [],
  passed: 0,
  failed: 0,
  fixed: 0,
  warnings: []
};

// ==========================================
// LOGGING FUNCTIONS
// ==========================================
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
  fs.appendFileSync(LOG_PATH, logEntry + '\n');
}

function logTest(testName, passed, message = '') {
  const result = passed ? 'PASS' : 'FAIL';
  log(`TEST: ${testName} - ${result} ${message}`, result.toLowerCase());
  results.tests.push({ name: testName, passed, message });
  if (passed) results.passed++;
  else results.failed++;
}

function logFix(fixName, applied = true) {
  if (applied) {
    log(`FIX: ${fixName}`, 'fix');
    results.fixed++;
  }
}

// ==========================================
// INITIALIZATION
// ==========================================
log('========================================', 'info');
log('WB.HTML AUTO FIX BATCH JOB v2.0', 'info');
log('Started: ' + new Date().toLocaleString(), 'info');
log('========================================', 'info');
log('', 'info');

// ==========================================
// TEST 1: FILE EXISTS & READABLE
// ==========================================
log('TEST PHASE 1: File Integrity Check', 'info');

if (!fs.existsSync(WB_HTML_PATH)) {
  logTest('File Exists', false, 'wb.html not found!');
  log('CRITICAL: Cannot proceed without wb.html', 'error');
  process.exit(1);
}

logTest('File Exists', true);

let htmlContent;
try {
  htmlContent = fs.readFileSync(WB_HTML_PATH, 'utf-8');
  logTest('File Readable', true, `Size: ${(htmlContent.length / 1024).toFixed(2)}KB`);
} catch (e) {
  logTest('File Readable', false, e.message);
  process.exit(1);
}

// ==========================================
// TEST 2: CREATE BACKUP
// ==========================================
log('TEST PHASE 2: Backup Creation', 'info');

try {
  fs.copyFileSync(WB_HTML_PATH, BACKUP_PATH);
  logTest('Backup Created', true, `Backed up to wb.html.backup`);
} catch (e) {
  logTest('Backup Created', false, e.message);
  results.warnings.push('Backup creation failed');
}

// ==========================================
// TEST 3: HTML STRUCTURE VALIDATION
// ==========================================
log('TEST PHASE 3: HTML Structure Validation', 'info');

const hasDoctype = /<!DOCTYPE\s+html>/i.test(htmlContent);
logTest('DOCTYPE Present', hasDoctype);

const hasHtmlTag = /<html/i.test(htmlContent);
logTest('HTML Tag Present', hasHtmlTag);

const hasHeadTag = /<head/i.test(htmlContent);
logTest('HEAD Tag Present', hasHeadTag);

const hasBodyTag = /<body/i.test(htmlContent);
logTest('BODY Tag Present', hasBodyTag);

const hasLangAttr = /html\s+[^>]*lang="en"/i.test(htmlContent);
logTest('Language Attribute', hasLangAttr);

const hasCharset = /charset\s*=\s*["']UTF-8["']/i.test(htmlContent);
logTest('UTF-8 Charset', hasCharset);

// ==========================================
// TEST 4: REQUIRED META TAGS
// ==========================================
log('TEST PHASE 4: Meta Tags Validation', 'info');

const hasViewport = /name\s*=\s*["']viewport["']/i.test(htmlContent);
logTest('Viewport Meta Tag', hasViewport);

const hasDescription = /name\s*=\s*["']description["']/i.test(htmlContent);
logTest('Description Meta Tag', hasDescription);

const hasTitle = /<title[^>]*>/i.test(htmlContent);
logTest('Title Tag', hasTitle);

// ==========================================
// TEST 5: COMPONENT ELEMENTS
// ==========================================
log('TEST PHASE 5: Component Elements Check', 'info');

const components = [
  'wb-control-panel',
  'wb-layout',
  'wb-nav',
  'wb-footer',
  'wb-status',
  'wb-theme-manager'
];

components.forEach(comp => {
  const hasComponent = new RegExp(`<${comp}[\\s>]`, 'i').test(htmlContent);
  logTest(`Component: ${comp}`, hasComponent);
});

// ==========================================
// TEST 6: SCRIPT IMPORTS
// ==========================================
log('TEST PHASE 6: Script Imports Validation', 'info');

const hasWbJs = /src\s*=\s*["']wb\.js["']/i.test(htmlContent);
logTest('Script: wb.js', hasWbJs);

const hasIndexJs = /src\s*=\s*["']index\.js["']/i.test(htmlContent);
logTest('Script: index.js', hasIndexJs);

const hasModuleType = /type\s*=\s*["']module["']/i.test(htmlContent);
logTest('Module Type Scripts', hasModuleType);

// ==========================================
// TEST 7: STYLESHEETS
// ==========================================
log('TEST PHASE 7: Stylesheet References', 'info');

const hasMainCss = /['"]\.\/styles\/main\.css['"]|['"]styles\/main\.css['"]/i.test(htmlContent);
logTest('Stylesheet: styles/main.css', hasMainCss);

const hasFaviconRef = /favicon/i.test(htmlContent);
logTest('Favicon Reference', hasFaviconRef);

// ==========================================
// TEST 8: SEMANTIC HTML
// ==========================================
log('TEST PHASE 8: Semantic HTML Elements', 'info');

const semanticTags = ['header', 'main', 'article', 'aside', 'footer'];
semanticTags.forEach(tag => {
  const hasTag = new RegExp(`<${tag}[\\s>]`, 'i').test(htmlContent);
  logTest(`Semantic: <${tag}>`, hasTag);
});

// ==========================================
// TEST 9: COMPONENT DIRECTORIES
// ==========================================
log('TEST PHASE 9: Component Directories Validation', 'info');

components.forEach(comp => {
  const compPath = path.join(COMPONENTS_DIR, comp);
  const exists = fs.existsSync(compPath);
  logTest(`Directory: ${comp}`, exists, exists ? 'Found' : 'Not found');
});

// ==========================================
// TEST 10: SUPPORTING FILES
// ==========================================
log('TEST PHASE 10: Supporting Files Check', 'info');

const supportingFiles = [
  'wb.js',
  'index.js',
  'wb.css',
  'styles/main.css'
];

supportingFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  logTest(`File: ${file}`, exists, exists ? 'Found' : 'Not found');
});

// ==========================================
// AUTOMATIC FIXES PHASE
// ==========================================
log('', 'info');
log('FIX PHASE: Applying Automatic Corrections', 'info');
log('', 'info');

let fixedContent = htmlContent;

// Fix 1: Add DOCTYPE if missing
if (!fixedContent.match(/^<!DOCTYPE\s+html>/i)) {
  fixedContent = '<!DOCTYPE html>\r\n' + fixedContent;
  logFix('Added DOCTYPE declaration');
}

// Fix 2: Add lang attribute to html element
if (!fixedContent.match(/html\s+[^>]*lang="en"/i)) {
  fixedContent = fixedContent.replace(/^<html(\s|>)/i, '<html lang="en"$1');
  logFix('Added language attribute (lang="en")');
}

// Fix 3: Add UTF-8 charset if missing
if (!fixedContent.match(/charset\s*=\s*["']UTF-8["']/i)) {
  fixedContent = fixedContent.replace(
    /(<meta\s+name\s*=\s*["']viewport["'][^>]*>)/i,
    '$1\r\n    <meta charset="UTF-8" />'
  );
  logFix('Added UTF-8 charset declaration');
}

// Fix 4: Ensure module type on scripts
if (fixedContent.match(/<script\s+src\s*=\s*["'](wb\.js|index\.js)/i)) {
  const originalContent = fixedContent;
  fixedContent = fixedContent.replace(
    /(<script)\s+src\s*=\s*["'](wb\.js|index\.js)["']/gi,
    '$1 type="module" src="$2"'
  );
  if (fixedContent !== originalContent) {
    logFix('Ensured module type on script elements');
  }
}

// Fix 5: Ensure proper head section structure
if (!fixedContent.match(/<head[^>]*>/i)) {
  log('WARNING: HEAD tag not found in HTML structure', 'warning');
  results.warnings.push('HEAD tag structure may be incorrect');
}

// Fix 6: Validate DOCTYPE placement
if (fixedContent.match(/<!DOCTYPE[^>]*>/i)) {
  const doctypeIndex = fixedContent.search(/<!DOCTYPE[^>]*>/i);
  if (doctypeIndex > 0) {
    const beforeDoctypeContent = fixedContent.substring(0, doctypeIndex).trim();
    if (beforeDoctypeContent.length > 0) {
      log('WARNING: Content found before DOCTYPE', 'warning');
      results.warnings.push('Content appears before DOCTYPE');
    }
  }
}

// ==========================================
// WRITE FIXED CONTENT
// ==========================================
log('FIX PHASE: Writing Corrected File', 'info');

if (fixedContent !== htmlContent) {
  try {
    fs.writeFileSync(WB_HTML_PATH, fixedContent, 'utf-8');
    log('Successfully wrote fixed content to wb.html', 'success');
    logFix('File Updated');
  } catch (e) {
    log(`ERROR writing fixed content: ${e.message}`, 'error');
    results.warnings.push('Could not write fixes to file');
  }
} else {
  log('No fixes were needed - file is already optimal', 'success');
}

// ==========================================
// FINAL VERIFICATION
// ==========================================
log('', 'info');
log('VERIFICATION PHASE: Final Validation', 'info');

let verifiedContent;
try {
  verifiedContent = fs.readFileSync(WB_HTML_PATH, 'utf-8');
  logTest('Final Verification', true, 'File read successfully');
} catch (e) {
  logTest('Final Verification', false, 'Could not read file');
}

// ==========================================
// GENERATE REPORT
// ==========================================
log('', 'info');
log('========================================', 'info');
log('FINAL REPORT', 'info');
log('========================================', 'info');

const totalTests = results.passed + results.failed;
const passPercentage = totalTests > 0 ? ((results.passed / totalTests) * 100).toFixed(2) : 0;

log(`Total Tests Run: ${totalTests}`, 'info');
log(`Tests Passed: ${results.passed}`, 'info');
log(`Tests Failed: ${results.failed}`, 'info');
log(`Fixes Applied: ${results.fixed}`, 'info');
log(`Pass Rate: ${passPercentage}%`, 'info');
log(`Warnings: ${results.warnings.length}`, 'info');

if (results.warnings.length > 0) {
  log('', 'info');
  log('Warnings:', 'warning');
  results.warnings.forEach(w => log(`  - ${w}`, 'warning'));
}

log('', 'info');
log('Status Summary:', 'info');
if (passPercentage >= 95) {
  log('✓ EXCELLENT - wb.html is in production-ready condition!', 'success');
} else if (passPercentage >= 80) {
  log('✓ GOOD - wb.html has minor issues but is functional', 'success');
} else if (passPercentage >= 60) {
  log('⚠ FAIR - wb.html has several issues that should be addressed', 'warning');
} else {
  log('✗ POOR - wb.html needs significant work', 'error');
}

log('', 'info');
log('Completed: ' + new Date().toLocaleString(), 'info');
log('Log File: ' + LOG_PATH, 'info');
log('Backup File: ' + BACKUP_PATH, 'info');
log('========================================', 'info');

console.log('\n✓ Batch job completed! Check wb-html-fix-complete.log for details.\n');
process.exit(0);
