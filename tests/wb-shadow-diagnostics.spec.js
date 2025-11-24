// @ts-check
import { test, expect } from '@playwright/test';

/**
 * WB Shadow DOM Diagnostic Tool - Playwright Test Suite
 * 
 * Tests the diagnostic tool's ability to detect Shadow DOM issues
 * and validate component configuration.
 */

const DIAGNOSTIC_URL = 'http://localhost:8080/wb-shadow-diagnostics.html';

test.describe('WB Shadow DOM Diagnostic Tool', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to diagnostic tool
    await page.goto(DIAGNOSTIC_URL);
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load diagnostic tool successfully', async ({ page }) => {
    // Check title
    await expect(page.locator('h1')).toContainText('WB Component Shadow DOM');
    
    // Check configuration panel exists
    await expect(page.locator('.config-panel')).toBeVisible();
    
    // Check all buttons exist
    await expect(page.getByRole('button', { name: /Run Diagnostics/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Run with Fresh Cache/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Reset to wb-button/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy All Issues/i })).toBeVisible();
  });

  test('should have wb-button selected by default', async ({ page }) => {
    const dropdown = page.locator('#component-tag');
    await expect(dropdown).toHaveValue('wb-button');
    
    // Check auto-generated fields
    await expect(page.locator('#component-js')).toHaveValue('./wb-button/wb-button.js');
    await expect(page.locator('#css-file')).toHaveValue('wb-button.css');
  });

  test('should auto-update paths when component selection changes', async ({ page }) => {
    const dropdown = page.locator('#component-tag');
    
    // Select wb-card
    await dropdown.selectOption('wb-card');
    await page.waitForTimeout(500); // Wait for auto-update
    
    // Check fields updated
    await expect(page.locator('#component-js')).toHaveValue('./wb-card/wb-card.js');
    await expect(page.locator('#css-file')).toHaveValue('wb-card.css');
    await expect(page.locator('#test-html')).toContainText('<wb-card>');
  });

  test('should run diagnostics for wb-button', async ({ page }) => {
    // Click Run Diagnostics
    await page.getByRole('button', { name: /Run Diagnostics/i }).click();
    
    // Wait for results
    await page.waitForSelector('#results-container[style*="display: block"]', { timeout: 10000 });
    
    // Check all 12 sections appear
    await expect(page.locator('h2').filter({ hasText: '1. Environment Check' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '2. CSS Variables' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '3. Component Registration' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '4. Test Component Instances' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '5. Shadow DOM Structure' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '6. CSS File Loading' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '7. Shadow DOM Element Inspection' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '8. Computed Styles Analysis' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '9. Dimensions & Visibility' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '10. Attributes' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '11. Raw Shadow DOM HTML' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: '12. Final Diagnostic Summary' })).toBeVisible();
  });

  test('should validate environment checks pass', async ({ page }) => {
    await page.getByRole('button', { name: /Run Diagnostics/i }).click();
    await page.waitForSelector('#env-check table', { timeout: 5000 });
    
    // Check Custom Elements API
    const customElementsRow = page.locator('#env-check table tr').filter({ hasText: 'Custom Elements API' });
    await expect(customElementsRow.locator('.success')).toContainText('✅ Available');
    
    // Check Shadow DOM API
    const shadowDOMRow = page.locator('#env-check table tr').filter({ hasText: 'Shadow DOM API' });
    await expect(shadowDOMRow.locator('.success')).toContainText('✅ Available');
    
    // Check ES Modules
    const esModulesRow = page.locator('#env-check table tr').filter({ hasText: 'ES Modules' });
    await expect(esModulesRow.locator('.success')).toContainText('✅ Supported');
  });

  test('should validate component file paths', async ({ page }) => {
    await page.getByRole('button', { name: /Run Diagnostics/i }).click();
    await page.waitForSelector('#env-check table', { timeout: 5000 });
    
    // Check Target Component
    const componentRow = page.locator('#env-check table tr').filter({ hasText: 'Target Component' });
    await expect(componentRow.locator('.success')).toContainText('✅ Valid');
    await expect(componentRow).toContainText('<wb-button>');
    
    // Check JS File
    const jsRow = page.locator('#env-check table tr').filter({ hasText: 'Component JS File' });
    await expect(jsRow.locator('.success')).toContainText('✅ Valid');
    await expect(jsRow).toContainText('./wb-button/wb-button.js');
    
    // Check CSS File
    const cssRow = page.locator('#env-check table tr').filter({ hasText: 'Component CSS File' });
    await expect(cssRow.locator('.success')).toContainText('✅ Valid');
    await expect(cssRow).toContainText('wb-button.css');
  });

  test('should import and register wb-button component', async ({ page }) => {
    await page.getByRole('button', { name: /Run Diagnostics/i }).click();
    await page.waitForSelector('#component-reg', { timeout: 5000 });
    
    // Check wb-base imported
    await expect(page.locator('#component-reg')).toContainText('✅ wb-base.js imported');
    
    // Check component imported
    await expect(page.locator('#component-reg')).toContainText('✅ ./wb-button/wb-button.js imported');
    
    // Check component registered
    await expect(page.locator('#component-reg')).toContainText('✅ <wb-button> registered with customElements');
    await expect(page.locator('#component-reg')).toContainText('Class name: WBButton');
  });

  test('should detect Shadow DOM configuration', async ({ page }) => {
    await page.getByRole('button', { name: /Run Diagnostics/i }).click();
    
    // Wait for shadow structure analysis (Section 5)
    await page.waitForSelector('#shadow-structure', { timeout: 10000 });
    await page.waitForTimeout(1500); // Wait for render to complete
    
    // Check EXPECTED vs ACTUAL appears
    const shadowSection = page.locator('#shadow-structure');
    await expect(shadowSection).toContainText('EXPECTED:');
    await expect(shadowSection).toContainText('ACTUAL:');
    
    // Should show Shadow DOM ENABLED expected
    await expect(shadowSection).toContainText('Shadow DOM ENABLED');
    await expect(shadowSection).toContainText('useShadow = true');
  });

  test('should detect Shadow DOM presence correctly', async ({ page }) => {
    await page.getByRole('button', { name: /Run Diagnostics/i }).click();
    await page.waitForSelector('#shadow-structure table', { timeout: 15000 });
    await page.waitForTimeout(3000);
    
    // Check shadow structure table
    const table = page.locator('#shadow-structure table');
    
    // Should find 3 wb-button elements
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(3);
    
    // Each should have Shadow Root present
    for (let i = 1; i <= 3; i++) {
      const row = rows.nth(i - 1);
      await expect(row).toContainText(`Element ${i}`);
      await expect(row.locator('.success')).toContainText('✅ Present');
      await expect(row).toContainText('open'); // Shadow DOM mode
    }
  });

  test('should show final verdict with statistics', async ({ page }) => {
    await page.getByRole('button', { name: /Run Diagnostics/i }).click();
    await page.waitForSelector('#final-verdict', { timeout: 15000 });
    await page.waitForTimeout(3000);
    
    const verdict = page.locator('#final-verdict');
    
    // Should show either pass or fail summary
    const hasSummary = await verdict.locator('.summary-box').count();
    expect(hasSummary).toBe(1);
    
    // Should show statistics
    await expect(verdict).toContainText('Total Checks:');
    await expect(verdict).toContainText('Passed:');
    await expect(verdict).toContainText('Failed:');
    await expect(verdict).toContainText('Success Rate:');
  });

  test('should reset configuration to wb-button', async ({ page }) => {
    // Change to different component
    await page.locator('#component-tag').selectOption('wb-card');
    await expect(page.locator('#component-js')).toHaveValue('./wb-card/wb-card.js');
    
    // Click reset
    await page.getByRole('button', { name: /Reset to wb-button/i }).click();
    
    // Should reset to wb-button
    await expect(page.locator('#component-tag')).toHaveValue('wb-button');
    await expect(page.locator('#component-js')).toHaveValue('./wb-button/wb-button.js');
    await expect(page.locator('#css-file')).toHaveValue('wb-button.css');
  });

  test('should detect MISMATCH when configuration conflicts', async ({ page }) => {
    await page.getByRole('button', { name: /Run Diagnostics/i }).click();
    await page.waitForSelector('#shadow-structure', { timeout: 15000 });
    await page.waitForTimeout(3000);
    
    const shadowSection = page.locator('#shadow-structure');
    
    // Check if MATCH or MISMATCH is shown
    const hasMatch = await shadowSection.getByText('✅ MATCH').count();
    const hasMismatch = await shadowSection.getByText('❌ MISMATCH').count();
    
    // Should have one or the other
    expect(hasMatch + hasMismatch).toBe(1);
  });

  test('should show visible buttons with dimensions', async ({ page }) => {
    await page.getByRole('button', { name: /Run Diagnostics/i }).click();
    await page.waitForSelector('#dimensions table', { timeout: 15000 });
    await page.waitForTimeout(3000);
    
    const table = page.locator('#dimensions table');
    const rows = table.locator('tbody tr');
    
    // Should show 3 elements
    await expect(rows).toHaveCount(3);
    
    // Each should be visible
    for (let i = 0; i < 3; i++) {
      const row = rows.nth(i);
      await expect(row).toContainText('px'); // Has dimensions
      await expect(row.locator('.success')).toContainText('✅ Visible');
    }
  });

});

test.describe('Component Dropdown Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(DIAGNOSTIC_URL);
  });

  test('should disable JS and CSS input fields', async ({ page }) => {
    const jsInput = page.locator('#component-js');
    const cssInput = page.locator('#css-file');
    
    await expect(jsInput).toBeDisabled();
    await expect(cssInput).toBeDisabled();
    
    await expect(jsInput).toHaveAttribute('readonly');
    await expect(cssInput).toHaveAttribute('readonly');
  });

});
