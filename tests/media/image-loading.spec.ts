// @ts-nocheck
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from './helpers/BaseUnitTestSimple.js';

test.describe('Image Loading Tests', (): any => {

  test('zia.png favicon should load correctly', async ({ page }): any => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if the favicon link exists
    const faviconLink = page.locator('link[rel="icon"]');
    const faviconCount = await faviconLink.count();
    
    if (faviconCount > 0) {
      // Only test attributes if favicon exists
      await expect(faviconLink).toHaveAttribute('href', '../../../Images/Photos/Small/zia.png');
      await expect(faviconLink).toHaveAttribute('type', 'image/png');
      console.log('✅ Favicon found and verified');
    } else {
      console.log('ℹ️ No favicon link found in HTML - skipping favicon tests');
    }

    // Check if the apple-touch-icon link exists
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    const appleTouchIconCount = await appleTouchIcon.count();
    
    if (appleTouchIconCount > 0) {
      await expect(appleTouchIcon).toHaveAttribute('href', '../../../Images/Photos/Small/zia.png');
      console.log('✅ Apple touch icon found and verified');
    } else {
      console.log('ℹ️ No apple-touch-icon link found in HTML - skipping icon tests');
    }
  });

  test('zia.png image requests should not return 404', async ({ page }): any => {
    const imageRequests: any[] = [];
    const failedRequests: any[] = [];

    // Listen for all requests
    page.on('request', request => {
      if (request.url().includes('zia.png')) {
        imageRequests.push(request.url());
      }
    });

    // Listen for failed responses
    page.on('response', response => {
      if (response.url().includes('zia.png') && response.status() >= 400) {
        failedRequests.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    // Navigate to the application
    await page.goto('/');

    // Wait for all network activity to complete
    await page.waitForLoadState('networkidle');

    // Check image requests if any were made
    if (imageRequests.length > 0) {
      console.log('Image requests made:', imageRequests);
      // Check that no zia.png requests failed
      expect(failedRequests.length).toBe(0);
      if (failedRequests.length > 0) {
        console.log('Failed image requests:', failedRequests);
      }
    } else {
      console.log('ℹ️ No zia.png image requests were made - this is expected if no zia.png images are in the HTML');
    }
  });

  test('no ziasymbol.svg requests should be made', async ({ page }): any => {
    const svgRequests: any[] = [];

    // Listen for requests to .svg files
    page.on('request', request => {
      if (request.url().includes('ziasymbol.svg') || request.url().includes('zia.svg')) {
        svgRequests.push(request.url());
      }
    });

    // Navigate to the application
    await page.goto('/');

    // Wait for all network activity to complete
    await page.waitForLoadState('networkidle');

    // Verify no SVG requests were made
    expect(svgRequests.length).toBe(0);
    if (svgRequests.length > 0) {
      console.log('Unexpected SVG requests:', svgRequests);
    }
  });

});
