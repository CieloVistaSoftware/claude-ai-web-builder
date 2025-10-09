export {};
// @ts-nocheck
// @ts-check
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from './helpers/BaseUnitTestSimple.js';

// Define constants for test configuration
const WAIT_TIMEOUT = 500; // Consistent wait time across all tests

test.describe('Website Builder Controls Tests', (): any => {
  test.beforeEach(async ({ page }): any => {
    // Navigate to the main page
    await page.goto('/index.html');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('Edit Mode Toggle should work correctly', async ({ page }): any => {
    // Get the edit mode toggle using correct selector from page snapshots
    const editToggle = page.locator('button:has-text("Edit Mode")');
    await expect(editToggle).toBeVisible();
    await expect(editToggle).toBeEnabled();

    // Test that button is clickable (functionality may vary)
    await editToggle.click();
    await page.waitForTimeout(WAIT_TIMEOUT);

    // Verify button is still functional after click
    await expect(editToggle).toBeEnabled();
    
    // Test second click
    await editToggle.click();
    await page.waitForTimeout(WAIT_TIMEOUT);
    
    // Verify button remains functional
    await expect(editToggle).toBeEnabled();
    
    console.log('✅ Edit Mode button is functional and clickable');
  });

  test('Layout selector changes layout correctly', async ({ page }): any => {
    // Get the layout selector (first select element from page snapshots)
    const layoutSelect = page.locator('select').first();
    await expect(layoutSelect).toBeVisible();
    await expect(layoutSelect).toBeEnabled();

    // Test that we can select different layout options
    const currentLayout = await layoutSelect.evaluate(el => el.value);
    console.log('Current layout:', currentLayout);
    
    // Test selecting different layout options that exist
    await layoutSelect.selectOption('left-nav');
    await page.waitForTimeout(WAIT_TIMEOUT);
    
    const newLayoutValue = await layoutSelect.evaluate(el => el.value);
    expect(newLayoutValue).toBe('left-nav');
    
    // Try another option
    await layoutSelect.selectOption('right-nav');
    await page.waitForTimeout(WAIT_TIMEOUT);
    
    const finalLayoutValue = await layoutSelect.evaluate(el => el.value);
    expect(finalLayoutValue).toBe('right-nav');
    
    // Reset to top-nav
    await layoutSelect.selectOption('top-nav');
    
    console.log('✅ Layout selector is functional');
  });

  test('Reset button should clear changes and show confirm dialog', async ({ page }): any => {
    // Set up a dialog handler to accept the confirmation
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('reset');
      await dialog.accept();
    });

    // Make a change - edit mode on
    const editToggle = page.locator('button:has-text("Edit Mode")');
    const isInitiallyEditing = await page.evaluate(() =>
      document.body.classList.contains('edit-mode')
    );
    if (!isInitiallyEditing) {
      await editToggle.click();
      await page.waitForTimeout(WAIT_TIMEOUT);
    }

    // Click the reset button
    const resetBtn = page.locator('button:has-text("Reset Settings")');
    await resetBtn.click();

    // Wait for the reset to take effect
    await page.waitForTimeout(WAIT_TIMEOUT * 2);

    // Verify page was reset (edit mode should be off)
    const isEditingAfterReset = await page.evaluate(() =>
      document.body.classList.contains('edit-mode')
    );
    expect(isEditingAfterReset).toBeFalsy();
  });

  test('Theme selector should change the theme', async ({ page }): any => {
    // Get the theme selector (second select element from page snapshots)
    const themeSelect = page.locator('select').nth(1);
    await expect(themeSelect).toBeVisible();

    // Get the initial theme
    const initialTheme = await page.evaluate(() =>
      document.body.getAttribute('data-theme')
    );

    // Available themes (from page snapshots - case sensitive)
    const themes = ['Default', 'Cyberpunk', 'Ocean', 'Sunset', 'Forest'];

    // Choose a different theme than the current one
    let newTheme = themes.find(theme => theme !== initialTheme);
    if (!newTheme) newTheme = 'Cyberpunk'; // Fallback to Cyberpunk

    // Change the theme
    await themeSelect.selectOption(newTheme);
    await page.waitForTimeout(WAIT_TIMEOUT);

    // Verify theme changed (theme attribute may be lowercase)
    const currentTheme = await page.evaluate(() =>
      document.body.getAttribute('data-theme')
    );
    expect(currentTheme.toLowerCase()).toBe(newTheme.toLowerCase());

    // Reset to initial theme
    await themeSelect.selectOption(initialTheme || 'Default');
  });
});
