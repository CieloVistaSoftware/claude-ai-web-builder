import { test, expect } from '@playwright/test';

test('wb.html color bar is displayed and controls work properly', async ({ page }) => {
  // Navigate to the wb.html page
  await page.goto('http://localhost:3000/wb/wb.html');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  
  // Check if the color bar exists
  const colorBar = page.locator('#color-bar');
  await expect(colorBar).toBeVisible();
  
  // Check if the color preview exists
  const colorPreview = page.locator('#color-bar-preview');
  await expect(colorPreview).toBeVisible();
  
  // Get the initial color value
  const initialColorValue = await colorPreview.textContent();
  
  // Change the color by moving the slider
  await colorBar.evaluate((el) => {
    const input = el as HTMLInputElement;
    input.value = '180'; // Set to cyan (180 degrees)
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  
  // Wait for the color to update
  await page.waitForTimeout(500);
  
  // Get the updated color value
  const updatedColorValue = await colorPreview.textContent();
  
  // The color should have changed
  expect(updatedColorValue).not.toEqual(initialColorValue);
  
  // Test the lightness slider
  const lightnessSlider = page.locator('#lightness-slider');
  await expect(lightnessSlider).toBeVisible();
  
  await lightnessSlider.evaluate((el) => {
    const input = el as HTMLInputElement;
    input.value = '70'; // Increase lightness to 70%
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  
  // Wait for the color to update
  await page.waitForTimeout(500);
  
  // Get the final color value
  const lightColorValue = await colorPreview.textContent();
  
  // The color should have changed again
  expect(lightColorValue).not.toEqual(updatedColorValue);
  
  // Test the saturation slider
  const saturationSlider = page.locator('#saturation-slider');
  await expect(saturationSlider).toBeVisible();
  
  await saturationSlider.evaluate((el) => {
    const input = el as HTMLInputElement;
    input.value = '50'; // Decrease saturation to 50%
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  
  // Wait for the color to update
  await page.waitForTimeout(500);
  
  // Get the final color value
  const finalColorValue = await colorPreview.textContent();
  
  // The color should have changed again
  expect(finalColorValue).not.toEqual(lightColorValue);
});
