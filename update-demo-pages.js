#!/usr/bin/env node

/**
 * UPDATE ALL DEMO PAGES FOR LIGHT DOM COMPONENTS
 * 
 * Purpose: Add CSS tokens + token injector to all demo HTML files
 * This prepares demo pages for Light DOM components (which need global CSS)
 * 
 * Usage: node update-demo-pages.js
 * 
 * What it does:
 * 1. Finds all *-demo.html files
 * 2. Adds css-tokens.css link if missing
 * 3. Adds token injector script if missing
 * 4. Reports success/failure for each
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = 'C:\\Users\\jwpmi\\Downloads\\AI\\wb\\components';

let updated = 0;
let skipped = 0;
let failed = 0;

// ═══════════════════════════════════════════════════════════════════
// DEMO PAGE TEMPLATE SNIPPETS
// ═══════════════════════════════════════════════════════════════════

const CSS_TOKENS_LINK = `    <!-- 🔴 CRITICAL: CSS Tokens System for Light DOM Components -->
    <link rel="stylesheet" href="../../styles/css-tokens.css">
    `;

const TOKEN_INJECTOR_SCRIPT = `
    <!-- 🔴 CRITICAL: Token Injector Script for Light DOM Components -->
    <script type="module">
        import { TokenInjector } from '../../utils/token-injector.js';
        
        // Activate CSS tokens on page load
        document.addEventListener('DOMContentLoaded', () => {
            const injector = new TokenInjector('#6366f1'); // Indigo primary
            injector.inject();
            console.log('✅ CSS tokens injected - Light DOM components ready');
        });
    </script>`;

// ═══════════════════════════════════════════════════════════════════
// FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function findDemoFiles(dir) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recurse into subdirectories
        files.push(...findDemoFiles(fullPath));
      } else if (stat.isFile() && item.endsWith('-demo.html')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error.message}`);
  }
  
  return files;
}

function updateDemoPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if already has CSS tokens
    const hasCssTokens = content.includes('css-tokens.css');
    
    // Check if already has token injector
    const hasTokenInjector = content.includes('TokenInjector') || 
                            content.includes('token-injector.js');
    
    if (hasCssTokens && hasTokenInjector) {
      console.log(`⏭️  ${path.basename(filePath)} - Already updated`);
      skipped++;
      return;
    }
    
    // Add CSS Tokens link (after <head> tag)
    if (!hasCssTokens) {
      // Find first <link> tag and insert before it
      const linkRegex = /(<link[^>]*>)/;
      if (linkRegex.test(content)) {
        content = content.replace(
          linkRegex,
          CSS_TOKENS_LINK + '$1'
        );
      } else {
        // If no links found, add after <head>
        content = content.replace(
          /(<head[^>]*>)/,
          '$1\n' + CSS_TOKENS_LINK
        );
      }
    }
    
    // Add Token Injector script (before </body> tag)
    if (!hasTokenInjector) {
      content = content.replace(
        /(<\/body>)/,
        TOKEN_INJECTOR_SCRIPT + '\n    $1'
      );
    }
    
    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${path.basename(filePath)} - Updated`);
      updated++;
    } else {
      console.log(`⏭️  ${path.basename(filePath)} - No changes needed`);
      skipped++;
    }
  } catch (error) {
    console.error(`❌ ${path.basename(filePath)} - Error: ${error.message}`);
    failed++;
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════

console.log('🌐 UPDATE ALL DEMO PAGES FOR LIGHT DOM COMPONENTS\n');
console.log(`📁 Scanning: ${COMPONENTS_DIR}\n`);

// Find all demo files
const demoFiles = findDemoFiles(COMPONENTS_DIR);
console.log(`📋 Found ${demoFiles.length} demo files\n`);
console.log('Processing...\n');

// Update each one
demoFiles.forEach(file => updateDemoPage(file));

// Summary
console.log('\n' + '═'.repeat(60));
console.log('📊 SUMMARY');
console.log('═'.repeat(60));
console.log(`✅ Updated: ${updated}`);
console.log(`⏭️  Skipped: ${skipped}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Total: ${demoFiles.length}`);

if (failed === 0) {
  console.log('\n🎉 All demo pages ready for Light DOM components!');
  console.log('\n✨ Next step: Run batch-migrate.js');
  console.log('   Command: node batch-migrate.js\n');
} else {
  console.log(`\n⚠️  ${failed} file(s) had errors - review above`);
}
