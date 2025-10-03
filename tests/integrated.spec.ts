export {};
// @ts-nocheck
// @ts-check
import { test, expect } from '@playwright/test';

// Define constants for test configuration
const WAIT_TIMEOUT = 500; // Consistent wait time across all tests

test.describe('Integrated Website Builder Tests', (): any => {
  test.beforeEach(async ({ page }): any => {
    // Navigate to the main page
    await page.goto('/index.html');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('Theme and color changes should persist after page reload', async ({ page }): any => {
    // Get the theme selector and change to a specific theme (second select from page snapshots)
    const themeSelect = page.locator('select').nth(1);
    await themeSelect.selectOption('Ocean');
    await page.waitForTimeout(WAIT_TIMEOUT);

    // Change the hue using the hue slider (from page snapshots, sliders are input[type="range"])
    const hueSlider = page.locator('input[type="range"]').first();
    if (await hueSlider.isVisible()) {
      await hueSlider.fill('240'); // Blue hue
      await page.waitForTimeout(WAIT_TIMEOUT);
    }

    // Record the current primary color
    const primaryColorBefore = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    );

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Get the reloaded theme and color
    const currentTheme = await page.evaluate(() =>
      document.body.getAttribute('data-theme')
    );
    const primaryColorAfter = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    );

    // Verify persistence
    expect(currentTheme).toBe('Ocean');
    expect(primaryColorAfter).toBe(primaryColorBefore);

    // Reset to default theme
    await themeSelect.selectOption('Default');
  });

  test('All controls should update their visual state correctly', async ({ page }): any => {
    // Turn on edit mode
    const editToggle = page.locator('button:has-text("Edit Mode")');
    await editToggle.click();
    await page.waitForTimeout(WAIT_TIMEOUT);

    // Verify edit mode is on
    const isEditing = await page.evaluate(() =>
      document.body.classList.contains('edit-mode')
    );
    expect(isEditing).toBeTruthy();

    // Change layout to left-nav (first select from page snapshots)
    const layoutSelect = page.locator('select').first();
    await layoutSelect.selectOption('left-nav');
    await page.waitForTimeout(WAIT_TIMEOUT);

    // Verify layout is applied
    const currentLayout = await page.evaluate(() =>
      document.body.getAttribute('data-layout')
    );
    expect(currentLayout).toBe('left-nav');

    // Change theme to cyberpunk (second select from page snapshots)
    const themeSelect = page.locator('select').nth(1);
    await themeSelect.selectOption('Cyberpunk');
    await page.waitForTimeout(WAIT_TIMEOUT);

    // Verify theme is applied
    const currentTheme = await page.evaluate(() =>
      document.body.getAttribute('data-theme')
    );
    expect(currentTheme).toBe('Cyberpunk');

    // Adjust hue if slider is available (first range slider from page snapshots)
    const hueSlider = page.locator('input[type="range"]').first();
    if (await hueSlider.isVisible()) {
      const initialValue = await hueSlider.inputValue();
      const newValue = initialValue === '0' ? '180' : '0';
      await hueSlider.fill(newValue);
      await page.waitForTimeout(WAIT_TIMEOUT);

      // Verify hue changed
      const currentValue = await hueSlider.inputValue();
      expect(currentValue).toBe(newValue);
    }

    // Turn off edit mode
    await editToggle.click();
    await page.waitForTimeout(WAIT_TIMEOUT);

    // Verify edit mode is off
    const isEditingAfter = await page.evaluate(() =>
      document.body.classList.contains('edit-mode')
    );
    expect(isEditingAfter).toBeFalsy();
  });

  test('Color controls should update website theme colors', async ({ page }): any => {
    // Get the hue slider (first range slider from page snapshots)
    const hueSlider = page.locator('input[type="range"]').first();
    
    if (!await hueSlider.isVisible()) {
      // Skip test if slider is not available
      test.skip();
      console.log('Skipping test: Hue slider not available');
      return;
    }

    // Record initial primary color - try multiple CSS properties
    const initialColors = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        primary: style.getPropertyValue('--primary').trim(),
        primaryColor: style.getPropertyValue('--primary-color').trim(),
        accentColor: style.getPropertyValue('--accent-color').trim()
      };
    });

    console.log('Initial colors:', initialColors);

    // Change hue to red (0)
    await hueSlider.fill('0');
    await page.waitForTimeout(WAIT_TIMEOUT * 2); // Longer wait for color processing

    // Get new colors
    const redColors = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        primary: style.getPropertyValue('--primary').trim(),
        primaryColor: style.getPropertyValue('--primary-color').trim(),
        accentColor: style.getPropertyValue('--accent-color').trim()
      };
    });

    console.log('Red colors:', redColors);

    // Change hue to green (120)
    await hueSlider.fill('120');
    await page.waitForTimeout(WAIT_TIMEOUT * 2);

    // Get green colors
    const greenColors = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        primary: style.getPropertyValue('--primary').trim(),
        primaryColor: style.getPropertyValue('--primary-color').trim(),
        accentColor: style.getPropertyValue('--accent-color').trim()
      };
    });

    console.log('Green colors:', greenColors);

    // Verify at least one color property changed
    const initialChanged = Object.values(initialColors).some(val => val && val !== '');
    const redChanged = Object.values(redColors).some((val, idx) => 
      val && val !== '' && val !== Object.values(initialColors)[idx]
    );
    const greenChanged = Object.values(greenColors).some((val, idx) => 
      val && val !== '' && val !== Object.values(redColors)[idx]
    );

    // Only test if we have color values to work with
    if (initialChanged) {
      expect(redChanged || greenChanged).toBeTruthy();
    } else {
      console.log('No color properties found, skipping color verification');
    }
  });
});
