// @ts-nocheck
// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Enhanced test suite for theme initialization and dark/light mode functionality
 */

test.describe('Theme and Dark Mode Initialization', (): any => {

  test.beforeEach(async ({ page }): any => {
    // Navigate to the index page using HTTP server
    await page.goto('/index.html');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');

    // Wait for the control panel to be visible and ready
    await page.waitForSelector('#control-panel', { state: 'visible' });

    // Wait for JavaScript to execute
    await page.waitForTimeout(500);

    // Log page state for debugging
    console.log('Page loaded. Starting test...');
  });

  // Test initial theme and dark mode state
  test('should initialize with correct theme and dark mode', async ({ page, browserName }): any => {
    // Log browser for debugging
    console.log(`Running test in ${browserName}`);

    // Take a screenshot for debugging
    await page.screenshot({ path: `./theme-init-${browserName}.png` });

    // Check that the data-theme attribute is set to default
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'default');

    // Check that the data-mode attribute is set to dark
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Check that dark mode classes are applied
    const hasClass = await page.evaluate(() => document.body.classList.contains('dark-mode'));
    expect(hasClass).toBe(true);

    // Check that the dark mode toggle is checked
    await expect(page.locator('#dark-mode-toggle')).toBeChecked();

    // Check CSS variables are properly applied
    const cssVars = await page.evaluate((): any => {
      const styles = getComputedStyle(document.documentElement);
      return {
        primary: styles.getPropertyValue('--primary').trim(),
        bgPrimary: styles.getPropertyValue('--bg-primary').trim(),
        textPrimary: styles.getPropertyValue('--text-primary').trim(),
        bodyBg: getComputedStyle(document.body).backgroundColor
      };
    });

    // Validate CSS variables exist
    expect(cssVars.primary).toBeTruthy();
    expect(cssVars.bgPrimary).toBeTruthy();
    expect(cssVars.textPrimary).toBeTruthy();

    // Parse backgroundColor and check for darkness
    const rgbMatch = cssVars.bodyBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [_, r, g, b] = rgbMatch.map(v => parseInt(v));
      const brightness = (r + g + b) / 3;
      expect(brightness).toBeLessThan(128); // Dark colors < 128 on 0-255 scale
      console.log(`Background color brightness: ${brightness}`);
    } else {
      console.log(`Non-standard color format: ${cssVars.bodyBg}`);
      // Fallback check - just ensure it's not white
      expect(cssVars.bodyBg).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
    }
  });

  // Test light/dark mode toggle
  test('dark mode toggle should switch between themes', async ({ page, browserName }): any => {
    console.log(`Testing dark mode toggle in ${browserName}`);

    // Initially should be in dark mode
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');
    expect(await page.evaluate(() => document.body.classList.contains('dark-mode'))).toBe(true);

    // Get initial background color
    const initialBgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log(`Initial background color: ${initialBgColor}`);

    // Toggle to light mode
    await page.locator('#dark-mode-toggle').click();
    await page.waitForTimeout(300); // Give more time for styles to apply

    // Should now be in light mode
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');
    expect(await page.evaluate(() => document.body.classList.contains('light-mode'))).toBe(true);
    expect(await page.evaluate(() => document.body.classList.contains('dark-mode'))).toBe(false);

    // Get new background color
    const lightBgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log(`Light mode background color: ${lightBgColor}`);

    // Colors should be different after toggle
    expect(initialBgColor).not.toEqual(lightBgColor);

    // Toggle back to dark mode
    await page.locator('#dark-mode-toggle').click();
    await page.waitForTimeout(300); // Wait for styles to apply

    // Should be back in dark mode
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');
    expect(await page.evaluate(() => document.body.classList.contains('dark-mode'))).toBe(true);
    expect(await page.evaluate(() => document.body.classList.contains('light-mode'))).toBe(false);

    // Get final background color
    const finalBgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log(`Final background color: ${finalBgColor}`);

    // Background colors should be similar (accounting for slight rendering differences)
    // We'll check if the RGB values are within a small tolerance instead of exact equality
    const compareColors = await page.evaluate((color1, color2): any => {
      const extractRgb = (color) => {
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
      };

      const [r1, g1, b1] = extractRgb(color1);
      const [r2, g2, b2] = extractRgb(color2);

      // Allow small difference in each channel
      const tolerance = 5;
      return Math.abs(r1 - r2) <= tolerance &&
        Math.abs(g1 - g2) <= tolerance &&
        Math.abs(b1 - b2) <= tolerance;
    }, initialBgColor, finalBgColor);

    expect(compareColors).toBe(true);
  });

  // Test that theme selection preserves dark/light mode
  test('theme selection should preserve dark/light mode', async ({ page, browserName }): any => {
    console.log(`Testing theme selection in ${browserName}`);

    // Start in dark mode with default theme
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'default');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Switch to light mode
    await page.locator('#dark-mode-toggle').click();
    await page.waitForTimeout(300);

    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');
    expect(await page.evaluate(() => document.body.classList.contains('light-mode'))).toBe(true);

    // Change theme to cyberpunk
    await page.selectOption('#theme-select', 'cyberpunk');
    await page.waitForTimeout(300);

    // Should still be in light mode
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'cyberpunk');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');
    expect(await page.evaluate(() => document.body.classList.contains('light-mode'))).toBe(true);

    // Switch back to dark mode
    await page.locator('#dark-mode-toggle').click();
    await page.waitForTimeout(300);

    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');
    expect(await page.evaluate(() => document.body.classList.contains('dark-mode'))).toBe(true);

    // Change theme to ocean
    await page.selectOption('#theme-select', 'ocean');
    await page.waitForTimeout(300);

    // Should still be in dark mode
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'ocean');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');
    expect(await page.evaluate(() => document.body.classList.contains('dark-mode'))).toBe(true);
  });
});
