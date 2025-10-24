// @ts-nocheck
// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test suite for theme persistence functionality
 * Ensures that theme and mode settings are properly saved to localStorage
 */

test.describe('Theme Persistence', (): any => {

  test.beforeEach(async ({ page }): any => {
    // Navigate to the index page using HTTP server
    await page.goto('/index.html');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');

    // Wait for the control panel to be visible and ready
    await page.waitForSelector('#control-panel', { state: 'visible' });
  });

  test('theme and mode changes are saved to localStorage', async ({ page }): any => {
    // Clear localStorage first to ensure clean state
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('#control-panel', { state: 'visible' });

    // Check initial state
    const initialTheme = await page.evaluate(() => document.body.getAttribute('data-theme'));
    const initialMode = await page.evaluate(() => document.body.getAttribute('data-mode'));
    console.log(`Initial state: theme=${initialTheme}, mode=${initialMode}`);

    // Change theme to ocean
    await page.selectOption('#theme-select', 'ocean');
    await page.waitForTimeout(300);

    // Change mode to light
    if (await page.evaluate(() => document.body.getAttribute('data-mode') === 'dark')) {
      await page.locator('#dark-mode-toggle').click();
      await page.waitForTimeout(300);
    }

    // Check settings were correctly applied
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'ocean');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Check localStorage is updated
    const savedState = await page.evaluate((): any => {
      return JSON.parse(localStorage.getItem('workingSettings') || 'null');
    });

    expect(savedState).not.toBeNull();
    expect(savedState.theme).toBe('ocean');
    expect(savedState.mode).toBe('light');

    // Reload the page to test persistence
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('#control-panel', { state: 'visible' });

    // Check settings were restored
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'ocean');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Check the select dropdown and toggle have proper values
    expect(await page.locator('#theme-select').evaluate(el => /** @type {HTMLSelectElement} */ (el).value)).toBe('ocean');
    expect(await page.locator('#dark-mode-toggle').isChecked()).toBe(false);
  });

  test('dark mode is default when no settings exist', async ({ page }): any => {
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());

    // Reload the page
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('#control-panel', { state: 'visible' });

    // Check default is dark mode and default theme
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'default');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');

    // Check the dropdown and toggle have default values
    expect(await page.locator('#theme-select').evaluate(el => /** @type {HTMLSelectElement} */ (el).value)).toBe('default');
    expect(await page.locator('#dark-mode-toggle').isChecked()).toBe(true);

    // Check localStorage was initialized
    const savedState = await page.evaluate((): any => {
      return JSON.parse(localStorage.getItem('workingSettings') || 'null');
    });

    expect(savedState).not.toBeNull();
    expect(savedState.theme).toBe('default');
    expect(savedState.mode).toBe('dark');
  });
});
