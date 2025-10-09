// @ts-nocheck
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from './helpers/BaseUnitTestSimple.js';

test.describe('Insert Media Button Removal Tests', (): any => {

  test.beforeEach(async ({ page }): any => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Wait for the control panel content to load
    await page.waitForSelector('control-panel', { state: 'visible', timeout: 10000 });

    // Give time for the control panel content to be injected
    await page.waitForTimeout(2000);
  });

  test('Main insert media button should not exist in control panel', async ({ page }): any => {
    // Verify there is NO main insert media button in the control panel
    const mainInsertMediaBtn = page.locator('#insert-media-btn');
    await expect(mainInsertMediaBtn).toHaveCount(0);

    console.log('✅ Confirmed: No main insert media button exists in control panel');
  });

  test('Only contextual insert media buttons should appear in edit mode', async ({ page }): any => {
    // Initially, no contextual insert media buttons should be visible
    const contextualButtons = page.locator('.contextual-insert-media-btn');
    await expect(contextualButtons).toHaveCount(0);

    // Enable edit mode
    const editModeToggle = page.locator('#edit-mode-toggle');
    await editModeToggle.click();

    // Wait for edit mode to activate
    await page.waitForTimeout(2000);

    // Contextual insert media buttons should now be visible
    const buttonCount = await contextualButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Verify still no main button
    const mainInsertMediaBtn = page.locator('#insert-media-btn');
    await expect(mainInsertMediaBtn).toHaveCount(0);

    console.log(`✅ Confirmed: ${buttonCount} contextual buttons exist, 0 main buttons`);
  });

  test('Contextual buttons work correctly for media insertion', async ({ page }): any => {
    // Enable edit mode
    await page.locator('#edit-mode-toggle').click();
    await page.waitForTimeout(2000);

    // Find first contextual insert media button
    const contextualButton = page.locator('.contextual-insert-media-btn').first();
    await expect(contextualButton).toBeVisible();

    // Set up file chooser event listener
    const fileChooserPromise = page.waitForEvent('filechooser');

    // Click the contextual button
    await contextualButton.click();

    // Verify file chooser opens
    const fileChooser = await fileChooserPromise;
    expect(fileChooser).toBeTruthy();

    console.log('✅ Confirmed: Contextual insert media button opens file picker correctly');
  });

});
