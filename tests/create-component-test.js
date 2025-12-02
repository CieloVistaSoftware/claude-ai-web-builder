/**
 * Create Component Test
 * 
 * Generates a basic test folder and spec file for a component.
 * 
 * Usage: node tests/create-component-test.js wb-card
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentName = process.argv[2];

if (!componentName) {
    console.error('❌ Usage: node tests/create-component-test.js wb-{name}');
    process.exit(1);
}

if (!componentName.startsWith('wb-')) {
    console.error('❌ Component name must start with "wb-"');
    process.exit(1);
}

const testDir = path.join(__dirname, componentName);
const testFile = path.join(testDir, `${componentName}.spec.ts`);

// Check if already exists
if (fs.existsSync(testDir)) {
    console.log(`⚠️  Test folder already exists: ${testDir}`);
    process.exit(0);
}

// Create folder
fs.mkdirSync(testDir, { recursive: true });

// Generate test content
const testContent = `/**
 * ${componentName} Tests
 * 
 * Auto-generated basic test. Expand as needed.
 */

import { test, expect } from '@playwright/test';

test.describe('${componentName}', () => {
  
  test.beforeEach(async ({ page }) => {
    // Monitor for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });
    
    // Fail on page errors
    page.on('pageerror', error => {
      throw new Error(\`Uncaught exception: \${error.message}\`);
    });
    
    await page.goto('/components/${componentName}/${componentName}-demo.html');
    await page.waitForSelector('${componentName}');
  });

  test('should render and be visible', async ({ page }) => {
    const component = page.locator('${componentName}').first();
    await expect(component).toBeVisible();
    
    // Check non-zero dimensions
    const box = await component.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test('should have Shadow DOM', async ({ page }) => {
    const hasShadow = await page.evaluate(() => {
      const el = document.querySelector('${componentName}');
      return !!el?.shadowRoot;
    });
    expect(hasShadow).toBe(true);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a moment for any async errors
    await page.waitForTimeout(500);
    
    expect(errors).toHaveLength(0);
  });

  test('should have CSS applied (not unstyled)', async ({ page }) => {
    const styles = await page.evaluate(() => {
      const el = document.querySelector('${componentName}');
      if (!el?.shadowRoot) return null;
      
      const firstEl = el.shadowRoot.querySelector('*:not(link):not(style)');
      if (!firstEl) return null;
      
      const computed = getComputedStyle(firstEl);
      return {
        background: computed.backgroundColor,
        display: computed.display
      };
    });
    
    // Should have some styling applied
    expect(styles).not.toBeNull();
    expect(styles?.display).not.toBe('none');
  });
});
`;

// Write test file
fs.writeFileSync(testFile, testContent);

console.log('✅ Created test folder and file:');
console.log(`   📁 ${testDir}`);
console.log(`   📄 ${testFile}`);
console.log('');
console.log('Next steps:');
console.log(`   1. Review and customize the test`);
console.log(`   2. Run: npx playwright test tests/${componentName}/`);
