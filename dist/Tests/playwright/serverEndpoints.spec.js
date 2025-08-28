"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Server API Endpoints', () => {
    (0, test_1.test)('should return proper components data from /api/components', async ({ request }) => {
        const response = await request.get('/api/components');
        // Check response status
        (0, test_1.expect)(response.status()).toBe(200);
        // Parse response body
        const responseBody = await response.json();
        // Verify structure
        (0, test_1.expect)(responseBody).toHaveProperty('success');
        (0, test_1.expect)(responseBody.success).toBe(true);
        // Should have components property (even if empty)
        (0, test_1.expect)(responseBody).toHaveProperty('components');
    });
    (0, test_1.test)('should return proper themes data from /api/themes', async ({ request }) => {
        const response = await request.get('/api/themes');
        // Check response status
        (0, test_1.expect)(response.status()).toBe(200);
        // Parse response body
        const responseBody = await response.json();
        // Verify structure
        (0, test_1.expect)(responseBody).toHaveProperty('success');
        (0, test_1.expect)(responseBody.success).toBe(true);
        // Should have themes property (even if empty)
        (0, test_1.expect)(responseBody).toHaveProperty('themes');
    });
    (0, test_1.test)('should return 404 with proper error structure for non-existent routes', async ({ request }) => {
        const response = await request.get('/api/non-existent');
        // Check response status
        (0, test_1.expect)(response.status()).toBe(404);
        // Parse response body
        const responseBody = await response.json();
        // Verify error structure
        (0, test_1.expect)(responseBody).toHaveProperty('error');
        (0, test_1.expect)(responseBody).toHaveProperty('success', false);
        (0, test_1.expect)(responseBody).toHaveProperty('availableRoutes');
        (0, test_1.expect)(Array.isArray(responseBody.availableRoutes)).toBe(true);
    });
});
test_1.test.describe('Key HTML Pages', () => {
    (0, test_1.test)('should load the main website builder page', async ({ page }) => {
        const response = await page.goto('/wb/wb.html');
        // Check response status
        (0, test_1.expect)(response?.status()).toBe(200);
        // Wait for the page to be fully loaded
        await page.waitForLoadState('domcontentloaded');
        // Check that key elements are present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
        await (0, test_1.expect)(page.locator('#control-panel')).toBeVisible();
    });
    (0, test_1.test)('should load the table theme demo page', async ({ page }) => {
        const response = await page.goto('/components/table/table-theme.html');
        // Check response status
        (0, test_1.expect)(response?.status()).toBe(200);
        // Wait for the page to be fully loaded
        await page.waitForLoadState('domcontentloaded');
        // Check that key elements are present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
        // Header might be in different formats, just check for any heading with the text
        await (0, test_1.expect)(page.locator('h1')).toContainText('Table Theme Component');
    });
    (0, test_1.test)('should load the theme generator page', async ({ page }) => {
        const response = await page.goto('/themes/theme-generator.html');
        // Check response status
        (0, test_1.expect)(response?.status()).toBe(200);
        // Wait for the page to be fully loaded
        await page.waitForLoadState('domcontentloaded');
        // Check that key elements are present
        await (0, test_1.expect)(page.locator('body')).toBeVisible();
        await (0, test_1.expect)(page.locator('.container h1')).toContainText('Theme Generator');
    });
});
test_1.test.describe('Server Error Handling', () => {
    (0, test_1.test)('should handle 404 errors properly', async ({ page }) => {
        const response = await page.goto('/non-existent-page.html');
        // Check response status
        (0, test_1.expect)(response?.status()).toBe(404);
        // Get the response body as text
        const responseBody = await response?.text();
        // Parse the JSON response
        try {
            const errorData = JSON.parse(responseBody || '{}');
            // Verify error structure
            (0, test_1.expect)(errorData).toHaveProperty('error');
            (0, test_1.expect)(errorData).toHaveProperty('success', false);
            (0, test_1.expect)(errorData).toHaveProperty('availableRoutes');
            (0, test_1.expect)(Array.isArray(errorData.availableRoutes)).toBe(true);
        }
        catch (e) {
            // If parsing fails, the response wasn't proper JSON
            test_1.test.fail(true, `Expected JSON response for 404 error but got: ${responseBody}`);
        }
    });
});
//# sourceMappingURL=serverEndpoints.spec.js.map