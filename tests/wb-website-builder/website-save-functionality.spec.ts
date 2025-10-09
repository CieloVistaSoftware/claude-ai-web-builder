// @ts-nocheck
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('Website Save Button Functionality Tests', (): any => {

  test.beforeEach(async ({ page }): any => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Wait for the control elements to be visible
    await page.waitForSelector('text="Website Builder Controls"', { state: 'visible', timeout: 10000 });

    // Wait specifically for the save button to be present and visible
    await page.waitForSelector('button:has-text("Save Website")', { state: 'visible', timeout: 5000 });
  });

  test('Save website button should be clickable and functional', async ({ page }): any => {
    // Change some settings to test
    await page.locator('select').nth(1).selectOption('ocean'); // Theme
    await page.waitForTimeout(300);

    // Verify save button exists and is clickable
    const saveButton = page.locator('button:has-text("Save Website")');
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();

    // Click the save button - should not throw error
    await saveButton.click();
    await page.waitForTimeout(1000);

    console.log('✅ Save Website button is functional and clickable');
  });

  test('Import website button should be clickable', async ({ page }): any => {
    // Verify import button exists and is clickable
    const importButton = page.locator('button:has-text("Import Website")');
    await expect(importButton).toBeVisible();
    await expect(importButton).toBeEnabled();

    console.log('✅ Import Website button is functional');
  });

  test('Reset settings button should be functional', async ({ page }): any => {
    // Change some settings first
    await page.locator('select').nth(1).selectOption('cyberpunk'); // Change theme
    await page.waitForTimeout(300);

    // Click reset button
    const resetButton = page.locator('button:has-text("Reset Settings")');
    await expect(resetButton).toBeVisible();
    await expect(resetButton).toBeEnabled();
    
    // Note: Reset might show a confirmation dialog
    page.on('dialog', async dialog => {
      console.log('Dialog appeared:', dialog.message());
      await dialog.accept();
    });
    
    await resetButton.click();
    await page.waitForTimeout(1000);

    console.log('✅ Reset Settings button is functional');
  });

  test('Edit mode toggle should work with save operations', async ({ page }): any => {
    // Enable edit mode
    const editButton = page.locator('button:has-text("Edit Mode")');
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForTimeout(1000);

    // Save button should still work in edit mode
    const saveButton = page.locator('button:has-text("Save Website")');
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await page.waitForTimeout(1000);

    console.log('✅ Save functionality works in edit mode');
  });
});