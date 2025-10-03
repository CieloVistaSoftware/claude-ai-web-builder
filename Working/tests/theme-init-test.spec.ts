// @ts-nocheck
// @ts-check
import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test suite specifically for theme initialization in dark mode
 * This test mimics the failing test but adapts to the Monday version structure
 */

test.describe('Theme Initialization in Dark Mode', (): any => {

  test.beforeEach(async ({ page }): any => {
    // Use the test server instead of file:// protocol
    await page.goto('/index.html');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    // Wait for the control panel to be visible
    await page.waitForSelector('#control-panel', { state: 'visible' });
    // Give a bit of time for scripts to execute
    await page.waitForTimeout(300);
  });

  /**
   * This test checks that the page loads with dark mode as default
   * and applies the appropriate CSS variables
   */
  test('index.html applies dark mode CSS variables on load', async ({ page }): any => {
    // Check that the data-mode attribute is set to dark
    const modeAttr = await page.evaluate(() => document.body.getAttribute('data-mode'));
    expect(modeAttr).toBe('dark');

    // Check that the dark mode toggle is checked
    const isDarkModeChecked = await page.locator('#dark-mode-toggle').isChecked();
    expect(isDarkModeChecked).toBe(true);

    // Check that dark mode classes are applied
    const bodyClasses = await page.evaluate(() => Array.from(document.body.classList));
    expect(bodyClasses.includes('dark-mode')).toBe(true);

    // Check background color to ensure it's dark
    const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    // Extract RGB values and check brightness
    const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [_, r, g, b] = rgbMatch;
      const brightness = (parseInt(r) + parseInt(g) + parseInt(b)) / 3;
      // Dark background should have a lower brightness value
      expect(brightness).toBeLessThan(128); // 0-255 scale
    } else {
      // Fallback check if regex fails
      expect(bgColor).not.toBe('rgb(255, 255, 255)'); // Not white
    }

    // Test switching to light mode
    await page.locator('#dark-mode-toggle').uncheck();
    await page.waitForTimeout(300); // Wait for changes to apply

    // Verify mode was changed
    const lightModeAttr = await page.evaluate(() => document.body.getAttribute('data-mode'));
    expect(lightModeAttr).toBe('light');

    // Now switch back to dark mode
    await page.locator('#dark-mode-toggle').check();
    await page.waitForTimeout(300); // Wait for changes to apply

    // Verify back to dark mode
    const darkModeAgain = await page.evaluate(() => document.body.getAttribute('data-mode'));
    expect(darkModeAgain).toBe('dark');
  });

  /**
   * This test ensures that theme selection preserves the dark/light mode setting
   */
  test('theme selection maintains dark/light mode state', async ({ page }): any => {
    // Verify starting in dark mode
    const initialMode = await page.evaluate(() => document.body.getAttribute('data-mode'));
    expect(initialMode).toBe('dark');

    // Change theme to cyberpunk
    await page.selectOption('#theme-select', 'cyberpunk');
    await page.waitForTimeout(300);

    // Mode should still be dark
    const modeAfterThemeChange = await page.evaluate(() => document.body.getAttribute('data-mode'));
    expect(modeAfterThemeChange).toBe('dark');

    // Switch to light mode
    await page.locator('#dark-mode-toggle').uncheck();
    await page.waitForTimeout(300);

    // Change theme to ocean
    await page.selectOption('#theme-select', 'ocean');
    await page.waitForTimeout(300);

    // Mode should still be light
    const finalMode = await page.evaluate(() => document.body.getAttribute('data-mode'));
    expect(finalMode).toBe('light');
  });

  /**
   * This test ensures the color explorer updates colors in real time
   */
  test('color explorer updates colors in real time', async ({ page }): any => {
    // Get initial primary color
    const initialColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary'));

    // Change hue slider
    await page.fill('#hue-slider', '120');
    await page.waitForTimeout(300);

    // Get new primary color
    const newColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary'));

    // Colors should be different
    expect(initialColor).not.toBe(newColor);

    // Check that the preview box was updated
    const previewColor = await page.locator('#color-preview').evaluate(el =>
      window.getComputedStyle(el).backgroundColor);

    // Preview box should have the new color (specific value check not needed)
    expect(previewColor).not.toBe('rgb(255, 255, 255)');
  });
});
