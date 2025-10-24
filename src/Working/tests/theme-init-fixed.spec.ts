// @ts-nocheck
// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Updated test suite for theme initialization and dark/light mode functionality
 * with improved handling of CSS variables and cross-browser compatibility
 */

test.describe('Theme and Dark Mode Initialization', (): any => {

  test.beforeEach(async ({ page }): any => {
    // Navigate to the index page using HTTP server
    await page.goto('/index.html');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');

    // Wait for the control panel to be visible and ready
    await page.waitForSelector('#control-panel', { state: 'visible' });

    // Give extra time for styles to apply
    await page.waitForTimeout(500);
  });

  // Test initial theme and dark mode state
  test('should initialize with correct theme and dark mode', async ({ page }): any => {
    // Check that the data-theme attribute is set to default
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'default');

    // Check that the data-mode attribute is set to dark
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Check that dark mode classes are applied
    const hasClass = await page.evaluate(() => document.body.classList.contains('dark-mode'));
    expect(hasClass).toBe(true);

    // Check that the dark mode toggle is checked
    await expect(page.locator('#dark-mode-toggle')).toBeChecked();

    // Check background color to ensure it's dark
    const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log('Background color:', bgColor);

    const isBgDark = await page.evaluate((): any => {
      const rgb = getComputedStyle(document.body).backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!rgb) return false;
      const [_, r, g, b] = rgb.map(Number);
      // Calculate perceived brightness
      return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
    });

    expect(isBgDark).toBe(true);
  });

  // Test light/dark mode toggle
  test('dark mode toggle should switch between themes', async ({ page }): any => {
    // Initially should be in dark mode
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Toggle to light mode
    await page.locator('#dark-mode-toggle').click();
    await page.waitForTimeout(300); // Wait for styles to apply

    // Should now be in light mode
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Check that light mode class is applied
    const hasLightClass = await page.evaluate(() => document.body.classList.contains('light-mode'));
    expect(hasLightClass).toBe(true);

    // Check background color
    const isLightBg = await page.evaluate((): any => {
      const rgb = getComputedStyle(document.body).backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!rgb) return false;
      const [_, r, g, b] = rgb.map(Number);
      // Calculate perceived brightness
      return (r * 0.299 + g * 0.587 + b * 0.114) >= 128;
    });

    expect(isLightBg).toBe(true);

    // Toggle back to dark mode
    await page.locator('#dark-mode-toggle').click();
    await page.waitForTimeout(300); // Wait for styles to apply

    // Should be back in dark mode
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Check dark mode class is back
    const hasDarkClass = await page.evaluate(() => document.body.classList.contains('dark-mode'));
    expect(hasDarkClass).toBe(true);
  });

  // Test that theme selection preserves dark/light mode
  test('theme selection should preserve dark/light mode', async ({ page }): any => {
    // Start in dark mode with default theme
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'default');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Switch to light mode
    await page.locator('#dark-mode-toggle').click();
    await page.waitForTimeout(300);

    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Change theme to cyberpunk
    await page.selectOption('#theme-select', 'cyberpunk');
    await page.waitForTimeout(300);

    // Should still be in light mode
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'cyberpunk');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Switch back to dark mode
    await page.locator('#dark-mode-toggle').click();
    await page.waitForTimeout(300);

    // Should now be in dark mode but still cyberpunk theme
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'cyberpunk');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Change theme to ocean
    await page.selectOption('#theme-select', 'ocean');
    await page.waitForTimeout(300);

    // Should still be in dark mode
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'ocean');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');
  });
});
