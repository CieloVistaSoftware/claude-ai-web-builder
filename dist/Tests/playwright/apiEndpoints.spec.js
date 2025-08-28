"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
// Define the endpoints to test
const endpoints = [
    {
        path: '/',
        name: 'Home page',
        contentCheck: (content) => (0, test_1.expect)(content).toBeTruthy()
    },
    {
        path: '/wb/wb.html',
        name: 'Website Builder',
        contentCheck: (content) => (0, test_1.expect)(content).toContain('Website Builder')
    },
    {
        path: '/components/table/table-theme.html',
        name: 'Table Theme Demo',
        contentCheck: (content) => (0, test_1.expect)(content).toContain('table')
    },
    {
        path: '/themes/theme-generator.html',
        name: 'Theme Generator',
        contentCheck: (content) => (0, test_1.expect)(content).toContain('theme')
    },
    {
        path: '/api/components',
        name: 'Components API',
        isJson: true,
        contentCheck: (json) => (0, test_1.expect)(json).toBeDefined()
    },
    {
        path: '/api/themes',
        name: 'Themes API',
        isJson: true,
        contentCheck: (json) => (0, test_1.expect)(json).toBeDefined()
    }
];
test_1.test.describe('API Endpoints and Pages', () => {
    // Test each endpoint
    for (const endpoint of endpoints) {
        (0, test_1.test)(`should access ${endpoint.name} at ${endpoint.path}`, async ({ page }) => {
            const response = await page.goto(endpoint.path);
            // Verify response status
            (0, test_1.expect)(response?.status()).toBe(200);
            if (endpoint.isJson) {
                // For API endpoints, check the JSON response
                const responseBody = await response?.text();
                let json;
                try {
                    json = JSON.parse(responseBody || '{}');
                    endpoint.contentCheck(json);
                }
                catch (e) {
                    // If parsing fails, the response wasn't proper JSON
                    test_1.expect.fail(`Failed to parse JSON from ${endpoint.path}: ${responseBody}`);
                }
            }
            else {
                // For HTML pages, check the content
                const content = await page.content();
                endpoint.contentCheck(content);
                // Additional checks for HTML pages: no console errors
                const consoleMessages = [];
                page.on('console', msg => {
                    if (msg.type() === 'error') {
                        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
                    }
                });
                // Give time for any JS to execute and potentially produce errors
                await page.waitForTimeout(1000);
                // Check console for errors
                (0, test_1.expect)(consoleMessages.join('\n')).toBe('');
            }
        });
    }
});
// Test specific functionality for the website builder page
test_1.test.describe('Website Builder Functionality', () => {
    (0, test_1.test)('should have edit mode toggle button', async ({ page }) => {
        await page.goto('/wb/wb.html');
        // Check for edit mode toggle button
        await (0, test_1.expect)(page.locator('#edit-mode-toggle')).toBeVisible();
        // Click on edit mode toggle
        await page.locator('#edit-mode-toggle').click();
        // Verify edit mode is activated
        await (0, test_1.expect)(page.locator('body.edit-mode')).toBeVisible();
    });
});
// Test for components and themes endpoints
test_1.test.describe('API Response Structure', () => {
    (0, test_1.test)('components API should return properly structured data', async ({ request }) => {
        const response = await request.get('/api/components');
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data).toHaveProperty('success');
        (0, test_1.expect)(data.success).toBe(true);
    });
    (0, test_1.test)('themes API should return properly structured data', async ({ request }) => {
        const response = await request.get('/api/themes');
        (0, test_1.expect)(response.status()).toBe(200);
        const data = await response.json();
        (0, test_1.expect)(data).toHaveProperty('success');
        (0, test_1.expect)(data.success).toBe(true);
    });
});
// Error handling tests
test_1.test.describe('Error Handling', () => {
    (0, test_1.test)('should return 404 for non-existent pages', async ({ page }) => {
        const response = await page.goto('/non-existent-page');
        (0, test_1.expect)(response?.status()).toBe(404);
    });
    (0, test_1.test)('should have proper error structure for non-existent API endpoints', async ({ request }) => {
        const response = await request.get('/api/non-existent');
        (0, test_1.expect)(response.status()).toBe(404);
        const data = await response.json();
        (0, test_1.expect)(data).toHaveProperty('error');
        (0, test_1.expect)(data).toHaveProperty('success', false);
        (0, test_1.expect)(data).toHaveProperty('availableRoutes');
    });
});
//# sourceMappingURL=apiEndpoints.spec.js.map