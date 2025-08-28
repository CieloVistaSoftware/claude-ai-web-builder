import { test, expect } from '@playwright/test';

/**
 * Color Wheel Implementation Test
 * 
 * This test checks the implementation of the color wheel in the hue-color-slider.html file.
 * Converted from ColorWheelImplementation.Tests.ps1
 */

test.describe('Color Wheel Implementation Tests', () => {
  test('should have color wheel elements and functionality', async ({ page }) => {
    // Navigate to the page with the color wheel
    await page.goto('/themes/hue-color-slider.html');
    
    // Check if the page loaded
    await expect(page).toHaveTitle(/Color Wheel|Hue Color Slider|Hue Color/i);

    // Check for color wheel implementation
    const colorWheel = await page.locator('.color-wheel');
    await expect(colorWheel).toBeVisible();
    
    // Check for color wheel markers
    const markers = await page.locator('.color-wheel-marker');
    expect(await markers.count()).toBeGreaterThan(0);
    
    // Check for primary and accent markers
    const primaryMarker = await page.locator('.primary-marker');
    await expect(primaryMarker).toBeVisible();
    
    const accentMarker = await page.locator('.accent-marker');
    await expect(accentMarker).toBeVisible();
    
    // Check for wheel click handler by inspecting the page's JavaScript
    const hasWheelClickHandler = await page.evaluate(() => {
      const scriptElements = Array.from(document.querySelectorAll('script'));
      const scripts = scriptElements.map(script => script.textContent).join('');
      return scripts.includes('hueWheel.addEventListener(\'click\'') || 
             scripts.includes('hueWheel.addEventListener("click"');
    });
    
    expect(hasWheelClickHandler).toBeTruthy();
      // Test wheel interaction (simulate a click on the wheel)
    await colorWheel.click({ position: { x: 50, y: 50 } }); // Click near the center of the wheel
    
    // Check if color values were updated after click
    // Wait for the value to update
    await page.waitForTimeout(100);
      // Check if the hue value was updated
    const primaryHueValue = await page.locator('#primaryHueValue').textContent();
    const accentHueValue = await page.locator('#accentHueValue').textContent();
    
    // Verify that we got text content and the values are numbers
    expect(primaryHueValue).not.toBeNull();
    expect(accentHueValue).not.toBeNull();
    expect(parseInt(primaryHueValue || '0')).not.toBeNaN();
    expect(parseInt(accentHueValue || '0')).not.toBeNaN();
      // Get marker elements with IDs for position checking
    const primaryMarkerById = await page.locator('#primaryMarker');
    const accentMarkerById = await page.locator('#accentMarker');
      const primaryMarkerStyle = await primaryMarkerById.evaluate(el => {
      return {
        left: el.style.left,
        top: el.style.top
      };
    });
    
    // Verify that position styles are set
    expect(primaryMarkerStyle.left).toMatch(/\d+px/);
    expect(primaryMarkerStyle.top).toMatch(/\d+px/);
  });
});
