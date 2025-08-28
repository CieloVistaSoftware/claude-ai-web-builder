"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Table Theme Component Tests', () => {
    (0, test_1.test)('should properly load the table-theme.html file', async ({ page }) => {
        const response = await page.goto('/components/table/table-theme.html');
        // Check if page loaded successfully
        (0, test_1.expect)(response?.status()).toBe(200);
        // Check content
        const content = await page.content();
        (0, test_1.expect)(content).toContain('table');
        // Make sure there are no console errors
        const consoleMessages = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleMessages.push(`${msg.type()}: ${msg.text()}`);
            }
        });
        // Give time for any JS to execute
        await page.waitForTimeout(1000);
        // Check console for errors
        (0, test_1.expect)(consoleMessages.join('\n')).toBe('');
    });
});
test_1.test.describe('Theme Generator Tests', () => {
    (0, test_1.test)('should properly load the theme-generator.html file', async ({ page }) => {
        const response = await page.goto('/themes/theme-generator.html');
        // Check if page loaded successfully
        (0, test_1.expect)(response?.status()).toBe(200);
        // Check content
        const content = await page.content();
        (0, test_1.expect)(content).toContain('theme');
        // Make sure there are no console errors
        const consoleMessages = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleMessages.push(`${msg.type()}: ${msg.text()}`);
            }
        });
        // Give time for any JS to execute
        await page.waitForTimeout(1000);
        // Check console for errors
        (0, test_1.expect)(consoleMessages.join('\n')).toBe('');
    });
});
test_1.test.describe('File Access Tests', () => {
    (0, test_1.test)('should check if necessary files exist', async ({ request }) => {
        // Array of critical files that should exist
        const criticalFiles = [
            '/wb/wb.html',
            '/components/table/table-theme.html',
            '/themes/theme-generator.html'
        ];
        for (const filePath of criticalFiles) {
            const response = await request.get(filePath);
            (0, test_1.expect)(response.status(), `File ${filePath} should exist`).toBe(200);
        }
    });
    (0, test_1.test)('should verify API endpoints return expected structure', async ({ request }) => {
        // Test components API
        const componentsResponse = await request.get('/api/components');
        (0, test_1.expect)(componentsResponse.status()).toBe(200);
        const componentsData = await componentsResponse.json();
        (0, test_1.expect)(componentsData).toHaveProperty('success', true);
        // Test themes API
        const themesResponse = await request.get('/api/themes');
        (0, test_1.expect)(themesResponse.status()).toBe(200);
        const themesData = await themesResponse.json();
        (0, test_1.expect)(themesData).toHaveProperty('success', true);
    });
    (0, test_1.test)('should receive proper error message for non-existent files', async ({ request }) => {
        const response = await request.get('/non-existent-file.html');
        (0, test_1.expect)(response.status()).toBe(404);
        const errorData = await response.json();
        (0, test_1.expect)(errorData).toHaveProperty('error');
        (0, test_1.expect)(errorData).toHaveProperty('success', false);
        (0, test_1.expect)(errorData).toHaveProperty('availableRoutes');
        (0, test_1.expect)(Array.isArray(errorData.availableRoutes)).toBe(true);
    });
});
//# sourceMappingURL=fileAccess.spec.js.map