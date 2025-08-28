"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)('wb.html color bar is displayed and controls work properly', async ({ page }) => {
    // Navigate to the wb.html page
    await page.goto('/wb/wb.html');
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    // Check if the color bar exists
    const colorBar = page.locator('#color-bar');
    await (0, test_1.expect)(colorBar).toBeVisible();
    // Check if the color preview exists
    const colorPreview = page.locator('#color-bar-preview');
    await (0, test_1.expect)(colorPreview).toBeVisible();
    // Get the initial color value
    const initialColorValue = await colorPreview.textContent();
    // Change the color by moving the slider
    await colorBar.evaluate((el) => {
        const input = el;
        input.value = '180'; // Set to cyan (180 degrees)
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    // Wait for the color to update
    await page.waitForTimeout(500);
    // Get the updated color value
    const updatedColorValue = await colorPreview.textContent();
    // The color should have changed
    (0, test_1.expect)(updatedColorValue).not.toEqual(initialColorValue);
    // Test the lightness slider
    const lightnessSlider = page.locator('#lightness-slider');
    await (0, test_1.expect)(lightnessSlider).toBeVisible();
    await lightnessSlider.evaluate((el) => {
        const input = el;
        input.value = '70'; // Increase lightness to 70%
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    // Wait for the color to update
    await page.waitForTimeout(500);
    // Get the final color value
    const lightColorValue = await colorPreview.textContent();
    // The color should have changed again
    (0, test_1.expect)(lightColorValue).not.toEqual(updatedColorValue);
    // Test the saturation slider
    const saturationSlider = page.locator('#saturation-slider');
    await (0, test_1.expect)(saturationSlider).toBeVisible();
    await saturationSlider.evaluate((el) => {
        const input = el;
        input.value = '50'; // Decrease saturation to 50%
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    // Wait for the color to update
    await page.waitForTimeout(500);
    // Get the final color value
    const finalColorValue = await colorPreview.textContent();
    // The color should have changed again
    (0, test_1.expect)(finalColorValue).not.toEqual(lightColorValue);
});
//# sourceMappingURL=ColorBarFunctionality.spec.js.map