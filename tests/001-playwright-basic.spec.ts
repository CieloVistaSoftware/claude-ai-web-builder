import { test, expect } from '@playwright/test';

/**
 * Simple standalone test that doesn't require a server
 * Tests basic Playwright functionality
 */

test.describe('Playwright Basic Tests', () => {
  test('should load about:blank', async ({ page }) => {
    await page.goto('about:blank');
    const title = await page.title();
    expect(title).toBeDefined();
  });

  test('should execute JavaScript', async ({ page }) => {
    await page.goto('about:blank');
    const result = await page.evaluate(() => {
      return 2 + 2;
    });
    expect(result).toBe(4);
  });

  test('should find DOM elements', async ({ page }) => {
    await page.goto('data:text/html,<div id="test">Hello Playwright</div>');
    const element = await page.locator('#test');
    await expect(element).toHaveText('Hello Playwright');
  });

  test('should create and verify content', async ({ page }) => {
    await page.goto('data:text/html,<html><body><h1>Test</h1></body></html>');
    const heading = await page.locator('h1');
    await expect(heading).toBeVisible();
    expect(await heading.textContent()).toBe('Test');
  });
});
