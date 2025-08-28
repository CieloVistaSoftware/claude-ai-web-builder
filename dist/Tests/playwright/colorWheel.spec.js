"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * Color Wheel Implementation Test
 *
 * This test checks the implementation of the color wheel in the hue-color-slider.html file.
 * Converted from ColorWheelImplementation.Tests.ps1
 */
test_1.test.describe('Color Wheel Implementation Tests', () => {
    (0, test_1.test)('should have color wheel elements and functionality', async ({ page }) => {
        // Navigate to the page with the color wheel
        await page.goto('/themes/hue-color-slider.html');
        // Check if the page loaded
        await (0, test_1.expect)(page).toHaveTitle(/Color Wheel|Hue Color Slider|Hue Color/i);
        // Check for color wheel implementation
        const colorWheel = await page.locator('.color-wheel');
        await (0, test_1.expect)(colorWheel).toBeVisible();
        // Check for color wheel markers
        const markers = await page.locator('.color-wheel-marker');
        (0, test_1.expect)(await markers.count()).toBeGreaterThan(0);
        // Check for primary and accent markers
        const primaryMarker = await page.locator('.primary-marker');
        await (0, test_1.expect)(primaryMarker).toBeVisible();
        const accentMarker = await page.locator('.accent-marker');
        await (0, test_1.expect)(accentMarker).toBeVisible();
        // Check for wheel click handler by inspecting the page's JavaScript
        const hasWheelClickHandler = await page.evaluate(() => {
            const scriptElements = Array.from(document.querySelectorAll('script'));
            const scripts = scriptElements.map(script => script.textContent).join('');
            return scripts.includes('hueWheel.addEventListener(\'click\'') ||
                scripts.includes('hueWheel.addEventListener("click"');
        });
        (0, test_1.expect)(hasWheelClickHandler).toBeTruthy();
        // Test wheel interaction (simulate a click on the wheel)
        await colorWheel.click({ position: { x: 50, y: 50 } }); // Click near the center of the wheel
        // Check if color values were updated after click
        // Wait for the value to update
        await page.waitForTimeout(100);
        // Check if the hue value was updated
        const primaryHueValue = await page.locator('#primaryHueValue').textContent();
        const accentHueValue = await page.locator('#accentHueValue').textContent();
        // Verify that we got text content and the values are numbers
        (0, test_1.expect)(primaryHueValue).not.toBeNull();
        (0, test_1.expect)(accentHueValue).not.toBeNull();
        (0, test_1.expect)(parseInt(primaryHueValue || '0')).not.toBeNaN();
        (0, test_1.expect)(parseInt(accentHueValue || '0')).not.toBeNaN();
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
        (0, test_1.expect)(primaryMarkerStyle.left).toMatch(/\d+px/);
        (0, test_1.expect)(primaryMarkerStyle.top).toMatch(/\d+px/);
    });
});
//# sourceMappingURL=colorWheel.spec.js.map