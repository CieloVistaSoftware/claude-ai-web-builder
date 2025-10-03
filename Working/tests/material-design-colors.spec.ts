// @ts-nocheck
// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test suite for Material Design color editor functionality
 * Tests both light and dark mode color generation and application
 */

test.describe('Material Design Color Editor', (): any => {

  test.beforeEach(async ({ page }): any => {
    await page.goto('/MaterialDesign.html');
    // Wait for Material Color Utilities to load
    await page.waitForFunction(() => 'MaterialColorUtilities' in window, { timeout: 5000 });
    // Wait for page to be fully initialized
    await page.waitForTimeout(500);
  });

  test('should load Material Color Utilities library', async ({ page }): any => {
    // Check that the Material Color Utilities library is loaded
    const hasLibrary = await page.evaluate(() => 'MaterialColorUtilities' in window);
    expect(hasLibrary).toBe(true);

    // Check status indicator shows real Material Design
    const statusText = await page.locator('.status-indicator').textContent();
    expect(statusText).toContain('Real Material Design');
  });

  test('should generate different colors for light and dark modes', async ({ page }): any => {
    // Start in light mode (default)
    await expect(page.locator('body')).not.toHaveAttribute('data-theme', 'dark');

    // Get initial primary color in light mode
    const lightPrimary = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--md-primary');
    });

    // Switch to dark mode
    await page.locator('.theme-toggle').click();
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(100); // Wait for color recalculation

    // Get primary color in dark mode
    const darkPrimary = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--md-primary');
    });

    // Colors should be different between light and dark modes
    expect(lightPrimary.trim()).not.toBe(darkPrimary.trim());

    console.log('Light mode primary:', lightPrimary);
    console.log('Dark mode primary:', darkPrimary);
  });

  test('should update colors when hue slider is moved in light mode', async ({ page }): any => {
    // Ensure we're in light mode
    await page.evaluate((): any => {
      const toggleElement = document.querySelector('.theme-toggle');
      if (document.body.getAttribute('data-theme') === 'dark' && toggleElement) {
        toggleElement.dispatchEvent(new Event('click'));
      }
    });
    await page.waitForTimeout(100);

    // Get initial primary color
    const initialPrimary = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--md-primary').trim();
    });

    // Move the hue slider to a different position
    const colorSlider = page.locator('.color-slider');
    const sliderBox = await colorSlider.boundingBox();

    if (sliderBox) {
      // Click at 25% position (should give us a different hue)
      await colorSlider.click({
        position: { x: sliderBox.width * 0.25, y: sliderBox.height / 2 }
      });
    }

    await page.waitForTimeout(200); // Wait for color update

    // Get new primary color
    const newPrimary = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--md-primary').trim();
    });

    // Color should have changed
    expect(initialPrimary).not.toBe(newPrimary);

    console.log('Initial primary (light):', initialPrimary);
    console.log('New primary (light):', newPrimary);
  });

  test('should update colors when hue slider is moved in dark mode', async ({ page }): any => {
    // Switch to dark mode
    await page.locator('.theme-toggle').click();
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(200);

    // Get initial primary color in dark mode
    const initialPrimary = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--md-primary').trim();
    });

    // Move the hue slider to a different position
    const colorSlider = page.locator('.color-slider');
    const sliderBox = await colorSlider.boundingBox();

    if (sliderBox) {
      // Click at 75% position (should give us a different hue)
      await colorSlider.click({
        position: { x: sliderBox.width * 0.75, y: sliderBox.height / 2 }
      });
    }

    await page.waitForTimeout(200); // Wait for color update

    // Get new primary color
    const newPrimary = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--md-primary').trim();
    });

    // Color should have changed
    expect(initialPrimary).not.toBe(newPrimary);

    console.log('Initial primary (dark):', initialPrimary);
    console.log('New primary (dark):', newPrimary);
  });

  test('should maintain color changes when switching between light and dark modes', async ({ page }): any => {
    // Start in light mode and set a specific color
    const colorSlider = page.locator('.color-slider');
    const sliderBox = await colorSlider.boundingBox();

    if (sliderBox) {
      // Set slider to 30% position
      await colorSlider.click({
        position: { x: sliderBox.width * 0.3, y: sliderBox.height / 2 }
      });
    }
    await page.waitForTimeout(200);

    // Get the primary color in light mode
    const lightPrimary = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--md-primary').trim();
    });

    // Switch to dark mode
    await page.locator('.theme-toggle').click();
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(200);

    // Get the primary color in dark mode
    const darkPrimary = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--md-primary').trim();
    });

    // Switch back to light mode
    await page.locator('.theme-toggle').click();
    await expect(page.locator('body')).not.toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(200);

    // Get the primary color again in light mode
    const lightPrimaryAgain = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--md-primary').trim();
    });

    // Light mode color should be consistent
    expect(lightPrimary).toBe(lightPrimaryAgain);

    // Light and dark should be different (Material Design generates different colors for each mode)
    expect(lightPrimary).not.toBe(darkPrimary);

    console.log('Light mode primary:', lightPrimary);
    console.log('Dark mode primary:', darkPrimary);
    console.log('Light mode primary (after toggle):', lightPrimaryAgain);
  });

  test('should update color swatch display values when colors change', async ({ page }): any => {
    // Get initial swatch value
    const initialSwatchValue = await page.locator('.primary-swatch .color-value').textContent();

    // Move slider to change color
    const colorSlider = page.locator('.color-slider');
    const sliderBox = await colorSlider.boundingBox();

    if (sliderBox) {
      await colorSlider.click({
        position: { x: sliderBox.width * 0.6, y: sliderBox.height / 2 }
      });
    }
    await page.waitForTimeout(200);

    // Get new swatch value
    const newSwatchValue = await page.locator('.primary-swatch .color-value').textContent();

    // Swatch display should have updated
    expect(initialSwatchValue).not.toBe(newSwatchValue);

    // Value should be a valid hex color
    expect(newSwatchValue).toMatch(/^#[0-9A-F]{6}$/);
  });

  test('should handle custom color input correctly', async ({ page }): any => {
    // Enter a custom color
    await page.locator('#colorHex').fill('#FF5722');
    await page.locator('.apply-color-btn').click();
    await page.waitForTimeout(200);

    // Check that the color was applied
    const appliedPrimary = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--md-primary').trim();
    });

    // The applied color might not be exactly #FF5722 due to Material Design color generation,
    // but it should be related to the orange family
    expect(appliedPrimary).toMatch(/^#[0-9A-F]{6}$/);

    // Check that the color picker was updated
    const colorPickerValue = await page.locator('#colorPicker').inputValue();
    expect(colorPickerValue.toUpperCase()).toBe('#FF5722');
  });
});
