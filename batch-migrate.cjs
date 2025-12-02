#!/usr/bin/env node

/**
 * BATCH COMPONENT MIGRATION SCRIPT
 * Migrates all WB components from Shadow DOM to Light DOM + CSS Tokens
 * 
 * Usage: node batch-migrate.js
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = 'C:\\Users\\jwpmi\\Downloads\\AI\\wb\\components';

// Component groups by complexity
const MIGRATION_TIERS = {
  tier1: [
    'wb-input',
    'wb-select', 
    'wb-toggle',
    'wb-slider',
    'wb-search',
    'wb-tab',
  ],
  tier2: [
    'wb-card',
    'wb-modal',
    'wb-header',
    'wb-footer',
    'wb-grid',
    'wb-layout',
    'wb-hero',
  ],
  tier3: [
    'wb-table',
    'wb-nav',
    'wb-status',
    'wb-color-bar',
    'wb-event-log',
    'wb-log-viewer',
  ],
  tier4: [
    'wb-color-picker',
    'wb-color-harmony',
    'wb-color-mapper',
    'wb-control-panel',
  ],
};

// ═══════════════════════════════════════════════════════════════════
// JAVASCRIPT TRANSFORMATIONS
// ═══════════════════════════════════════════════════════════════════

function migrateJavaScript(content, componentName) {
  let migrated = content;

  // 1. Change static useShadow = true to false
  migrated = migrated.replace(
    /static\s+useShadow\s*=\s*true\s*;/g,
    'static useShadow = false;'
  );

  // 2. Remove Shadow DOM attachment from constructor
  migrated = migrated.replace(
    /this\.attachShadow\(\s*\{\s*mode:\s*['"]open['"]\s*\}\s*\);\s*/g,
    '// Shadow DOM removed - Light DOM architecture\n    '
  );

  // 3. Remove CSS loading from Shadow Root
  migrated = migrated.replace(
    /const\s+link\s*=\s*document\.createElement\(['"]link['"]\);[\s\S]*?this\.shadowRoot\.appendChild\(link\);[\s\S]*?\}\s*\);/g,
    ''
  );

  // 4. Simplify connectedCallback - remove CSS loading
  migrated = migrated.replace(
    /async\s+connectedCallback\(\)\s*\{[\s\S]*?await\s+new\s+Promise[\s\S]*?\}[\s\S]*?\}/,
    (match) => {
      if (match.includes('loadCSS')) {
        return match.replace(
          /\s*await\s+this\.loadCSS\(\);/g,
          ''
        ).replace(
          /\s*await\s+loadComponentCSS\([^)]+\);/g,
          '    // CSS is global - no per-component loading needed'
        );
      }
      return match;
    }
  );

  // 5. Add component class
  migrated = migrated.replace(
    /connectedCallback\(\)\s*\{[\s\S]*?super\.connectedCallback\(\);/,
    (match) => {
      const compName = componentName.replace(/^wb-/, '');
      return match + `\n    this.classList.add('wb-component', 'wb-${compName}');`;
    }
  );

  // 6. Replace shadow rendering with Light DOM
  migrated = migrated.replace(
    /const\s+target\s*=\s*this\.shadowRoot\s*\|\|\s*this;/g,
    '// Light DOM only'
  );

  migrated = migrated.replace(
    /target\.innerHTML\s*=/g,
    'this.innerHTML ='
  );

  migrated = migrated.replace(
    /this\.shadowRoot\.innerHTML\s*=/g,
    'this.innerHTML ='
  );

  return migrated;
}

// ═══════════════════════════════════════════════════════════════════
// CSS TRANSFORMATIONS
// ═══════════════════════════════════════════════════════════════════

const COLOR_MAP = {
  // Hardcoded hex colors
  '#6366f1': 'var(--color-primary)',
  '#4f46e5': 'var(--color-primary-bold)',
  '#818cf8': 'var(--color-primary-soft)',
  '#c7d2fe': 'var(--color-primary-subtle)',
  '#312e81': 'var(--color-primary-vivid)',

  // Secondary
  '#6b7280': 'var(--color-secondary)',
  '#2a2a2a': 'var(--bg-secondary)',
  '#1f2937': 'var(--bg-primary)',
  '#ffffff': 'var(--text-primary)',
  '#f3f4f6': 'var(--text-secondary)',
  '#e5e7eb': 'var(--text-secondary)',
  '#d1d5db': 'var(--text-tertiary)',
  '#404040': 'var(--border-primary)',
  '#1a1a1a': 'var(--bg-primary)',
  '#e0e0e0': 'var(--text-secondary)',

  // Success
  '#10b981': 'var(--color-success)',
  '#059669': 'var(--color-success-bold)',
  '#34d399': 'var(--color-success-soft)',
  '#d1fae5': 'var(--color-success-subtle)',

  // Danger
  '#ef4444': 'var(--color-danger)',
  '#dc2626': 'var(--color-danger-bold)',
  '#f87171': 'var(--color-danger-soft)',
  '#fee2e2': 'var(--color-danger-subtle)',

  // Warning
  '#f59e0b': 'var(--color-warning)',
  '#d97706': 'var(--color-warning-bold)',
  '#fbbf24': 'var(--color-warning-soft)',
  '#fef3c7': 'var(--color-warning-subtle)',

  // Info
  '#3b82f6': 'var(--color-info)',
  '#1d4ed8': 'var(--color-info-bold)',
  '#60a5fa': 'var(--color-info-soft)',
  '#dbeafe': 'var(--color-info-subtle)',
};

const SPACING_MAP = {
  '0.25rem': 'var(--spacing-xs)',
  '0.5rem': 'var(--spacing-sm)',
  '1rem': 'var(--spacing-md)',
  '1.5rem': 'var(--spacing-lg)',
  '2rem': 'var(--spacing-xl)',
  '3rem': 'var(--spacing-2xl)',
  '4px': 'var(--spacing-xs)',
  '8px': 'var(--spacing-sm)',
  '16px': 'var(--spacing-md)',
  '24px': 'var(--spacing-lg)',
};

const FONT_MAP = {
  'sans-serif': 'var(--font-family-base)',
  '14px': 'var(--font-size-base)',
  '12px': 'var(--font-size-sm)',
  '16px': 'var(--font-size-lg)',
  '600': 'var(--font-weight-semibold)',
  '700': 'var(--font-weight-bold)',
};

function migrateCSS(content) {
  let migrated = content;

  // Replace colors
  Object.entries(COLOR_MAP).forEach(([hex, token]) => {
    const regex = new RegExp(hex.replace(/#/, '\\#'), 'gi');
    migrated = migrated.replace(regex, token);
  });

  // Replace spacing
  Object.entries(SPACING_MAP).forEach(([spacing, token]) => {
    const regex = new RegExp(spacing.replace(/rem/, 'rem'), 'gi');
    migrated = migrated.replace(regex, token);
  });

  // Replace fonts
  Object.entries(FONT_MAP).forEach(([font, token]) => {
    const regex = new RegExp(font.replace(/'/g, "\\'"), 'gi');
    migrated = migrated.replace(regex, token);
  });

  return migrated;
}

// ═══════════════════════════════════════════════════════════════════
// MIGRATION LOGIC
// ═══════════════════════════════════════════════════════════════════

function migrateComponent(componentName) {
  const componentDir = path.join(COMPONENTS_DIR, componentName);
  const jsFile = path.join(componentDir, `${componentName}.js`);
  const cssFile = path.join(componentDir, `${componentName}.css`);

  try {
    // Migrate JavaScript
    if (fs.existsSync(jsFile)) {
      const jsContent = fs.readFileSync(jsFile, 'utf8');
      const migratedJS = migrateJavaScript(jsContent, componentName);
      fs.writeFileSync(jsFile, migratedJS);
      console.log(`✅ ${componentName}.js - migrated`);
    } else {
      console.log(`⚠️  ${componentName}.js - not found`);
    }

    // Migrate CSS
    if (fs.existsSync(cssFile)) {
      const cssContent = fs.readFileSync(cssFile, 'utf8');
      const migratedCSS = migrateCSS(cssContent);
      fs.writeFileSync(cssFile, migratedCSS);
      console.log(`✅ ${componentName}.css - migrated`);
    } else {
      console.log(`⚠️  ${componentName}.css - not found`);
    }

    return true;
  } catch (error) {
    console.error(`❌ ${componentName} - Error: ${error.message}`);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════

console.log('🚀 BATCH COMPONENT MIGRATION STARTING\n');

let totalSuccess = 0;
let totalFailed = 0;

// Tier 1: Form Components
console.log('📋 TIER 1: FORM COMPONENTS');
console.log('─'.repeat(50));
MIGRATION_TIERS.tier1.forEach(component => {
  if (migrateComponent(component)) {
    totalSuccess++;
  } else {
    totalFailed++;
  }
});
console.log('');

// Tier 2: Container Components
console.log('📋 TIER 2: CONTAINER COMPONENTS');
console.log('─'.repeat(50));
MIGRATION_TIERS.tier2.forEach(component => {
  if (migrateComponent(component)) {
    totalSuccess++;
  } else {
    totalFailed++;
  }
});
console.log('');

// Tier 3: Data Display
console.log('📋 TIER 3: DATA DISPLAY COMPONENTS');
console.log('─'.repeat(50));
MIGRATION_TIERS.tier3.forEach(component => {
  if (migrateComponent(component)) {
    totalSuccess++;
  } else {
    totalFailed++;
  }
});
console.log('');

// Tier 4: Interactive
console.log('📋 TIER 4: INTERACTIVE COMPONENTS');
console.log('─'.repeat(50));
MIGRATION_TIERS.tier4.forEach(component => {
  if (migrateComponent(component)) {
    totalSuccess++;
  } else {
    totalFailed++;
  }
});
console.log('');

// Summary
console.log('═'.repeat(50));
console.log('📊 MIGRATION SUMMARY');
console.log('═'.repeat(50));
console.log(`✅ Successful: ${totalSuccess}`);
console.log(`❌ Failed: ${totalFailed}`);
console.log(`📈 Total: ${totalSuccess + totalFailed}`);
console.log(`\n✨ Batch migration complete!`);

if (totalFailed === 0) {
  console.log('🎉 All components migrated successfully!');
} else {
  console.log(`⚠️  ${totalFailed} component(s) need manual review`);
}
