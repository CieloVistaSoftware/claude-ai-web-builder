// @ts-nocheck
// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test suite for theme initialization and dark/light mode functionality
 */

test.describe('Theme and Dark Mode Initialization', (): any => {

  // Before each test, navigate to the index page
  test.beforeEach(async ({ page }): any => {
    await page.goto('/index.html');
    // Wait for the control panel to be visible
    await page.waitForSelector('#control-panel');
    // Wait for all scripts to execute
    await page.waitForTimeout(300);
  });

  // Test initial theme and dark mode state
  test('should initialize with correct theme and dark mode', async ({ page }): any => {
    // Check that the data-theme attribute is set to default
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'default');

    // Check that the data-mode attribute is set to dark
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Check that the dark mode toggle is checked
    await expect(page.locator('#dark-mode-toggle')).toBeChecked();

    // Verify CSS variables are set correctly
    const bgColor = await page.evaluate((): any => {
      return getComputedStyle(document.body).backgroundColor;
    });

    // Check that we get a dark background color (should be dark, not light)
    // This is a loose check since the exact color may vary
    const rgb = bgColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
    if (rgb) {
      const [_, r, g, b] = rgb;
      // Dark colors typically have lower RGB values
      const brightness = (parseInt(r) + parseInt(g) + parseInt(b)) / 3;
      expect(brightness).toBeLessThan(128); // Assuming dark mode has brightness < 128 (0-255 scale)
    }
  });

  // Test light/dark mode toggle
  test('dark mode toggle should switch between themes', async ({ page }): any => {
    // Initially should be in dark mode
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Get initial background color
    const initialBgColor = await page.evaluate((): any => {
      return getComputedStyle(document.body).backgroundColor;
    });

    // Toggle to light mode
    await page.locator('#dark-mode-toggle').uncheck();
    await page.waitForTimeout(100); // Give time for styles to apply

    // Should now be in light mode
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Get new background color
    const lightBgColor = await page.evaluate((): any => {
      return getComputedStyle(document.body).backgroundColor;
    });

    // Colors should be different after toggle
    expect(initialBgColor).not.toEqual(lightBgColor);

    // Toggle back to dark mode
    await page.locator('#dark-mode-toggle').check();
    await page.waitForTimeout(100); // Give time for styles to apply

    // Should be back in dark mode
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Get final background color
    const finalBgColor = await page.evaluate((): any => {
      return getComputedStyle(document.body).backgroundColor;
    });

    // Should be back to initial dark color
    expect(finalBgColor).toEqual(initialBgColor);
  });

  // Test that theme selection preserves dark/light mode
  test('theme selection should preserve dark/light mode', async ({ page }): any => {
    // Start in dark mode with default theme
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'default');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Switch to light mode
    await page.locator('#dark-mode-toggle').uncheck();
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Change theme to cyberpunk
    await page.selectOption('#theme-select', 'cyberpunk');
    await page.waitForTimeout(100);

    // Should still be in light mode
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'cyberpunk');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Switch back to dark mode
    await page.locator('#dark-mode-toggle').check();
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Change theme to ocean
    await page.selectOption('#theme-select', 'ocean');
    await page.waitForTimeout(100);

    // Should still be in dark mode
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'ocean');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');
  });
});
