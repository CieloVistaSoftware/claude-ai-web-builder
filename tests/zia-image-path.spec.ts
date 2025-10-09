// @ts-nocheck
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from './helpers/BaseUnitTestSimple.js';

test.describe('Zia Image Path Tests', (): any => {

  test('zia.png favicon should have correct absolute path', async ({ page }): any => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Check the favicon link has the correct absolute path
    const faviconLink = page.locator('link[rel="icon"]');
    await expect(faviconLink).toHaveAttribute('href', 'C:\\Users\\jwpmi\\Downloads\\Images\\Photos\\Small\\zia.png');
    await expect(faviconLink).toHaveAttribute('type', 'image/png');

    console.log('✅ Favicon link has correct absolute path');
  });

  test('zia.png apple-touch-icon should have correct absolute path', async ({ page }): any => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Check the apple-touch-icon link has the correct absolute path
    const appleTouchIconLink = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleTouchIconLink).toHaveAttribute('href', 'C:\\Users\\jwpmi\\Downloads\\Images\\Photos\\Small\\zia.png');

    console.log('✅ Apple touch icon link has correct absolute path');
  });

  test('verify no references to old zia.svg paths', async ({ page }): any => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Get the page content
    const content = await page.content();

    // Verify no references to old zia.svg or ziasymbol.svg paths
    expect(content).not.toContain('zia.svg');
    expect(content).not.toContain('ziasymbol.svg');

    console.log('✅ No old zia.svg references found');
  });

});
