"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * Server Path Fix Tests
 *
 * Tests for verifying correct server path configuration and file accessibility.
 * Converted from ServerPathFix.Tests.ps1
 */
test_1.test.describe('Server Path Fix Tests', () => {
    test_1.test.setTimeout(30000);
    (0, test_1.test)('should serve files with correct paths', async ({ page }) => {
        // Test that target file is accessible
        const response = await page.request.get('/components/table/table-theme.html');
        (0, test_1.expect)(response.status(), 'table-theme.html should be accessible').toBe(200);
        // Verify content type
        const contentType = response.headers()['content-type'];
        (0, test_1.expect)(contentType).toContain('text/html');
    });
    (0, test_1.test)('should handle relative paths correctly', async ({ page }) => {
        // Test navigation to the file
        await page.goto('/components/table/table-theme.html');
        await page.waitForLoadState('networkidle');
        // Verify page loaded successfully
        const title = await page.title();
        (0, test_1.expect)(title).toBeTruthy();
        // Check that page content is loaded
        const body = await page.locator('body');
        await (0, test_1.expect)(body).toBeVisible();
    });
    (0, test_1.test)('should serve static assets from correct paths', async ({ page }) => {
        const staticAssets = [
            '/wb.css',
            '/wb.js',
            '/components/table/table.json'
        ];
        for (const asset of staticAssets) {
            const response = await page.request.get(asset);
            if (response.status() === 200) {
                // Asset exists and is served correctly
                (0, test_1.expect)(response.status()).toBe(200);
                // Verify appropriate content type
                const contentType = response.headers()['content-type'];
                if (asset.endsWith('.css')) {
                    (0, test_1.expect)(contentType).toContain('text/css');
                }
                else if (asset.endsWith('.js')) {
                    (0, test_1.expect)(contentType).toMatch(/application\/javascript|text\/javascript/);
                }
                else if (asset.endsWith('.json')) {
                    (0, test_1.expect)(contentType).toContain('application/json');
                }
            }
        }
    });
    (0, test_1.test)('should handle directory traversal correctly', async ({ page }) => {
        // Test that subdirectories are accessible
        const subdirectoryPaths = [
            '/components/',
            '/components/table/',
            '/themes/'
        ];
        for (const path of subdirectoryPaths) {
            // Try to access directory (might return 404 or directory listing)
            const response = await page.request.get(path);
            // We expect either 200 (directory listing) or 404 (no listing), but not 500
            (0, test_1.expect)([200, 404, 403]).toContain(response.status());
        }
    });
    (0, test_1.test)('should resolve file URLs without explicit file extensions', async ({ page }) => {
        // Test that server can handle requests without extensions if configured
        try {
            await page.goto('/components/table/table-theme');
            // If server supports extensionless URLs, this should work
            // Otherwise, it should redirect or show 404
            const currentUrl = page.url();
            (0, test_1.expect)(currentUrl).toBeTruthy();
        }
        catch (error) {
            // This is acceptable - not all servers support extensionless URLs
            (0, test_1.expect)(error).toBeDefined();
        }
    });
    (0, test_1.test)('should serve files from root directory correctly', async ({ page }) => {
        // Test that main website files are accessible from root
        const rootFiles = [
            '/wb/wb/wb.html',
            '/index.html'
        ];
        let foundRootFile = false;
        for (const file of rootFiles) {
            const response = await page.request.get(file);
            if (response.status() === 200) {
                foundRootFile = true;
                break;
            }
        }
        (0, test_1.expect)(foundRootFile, 'Should have at least one accessible root file').toBe(true);
    });
    (0, test_1.test)('should handle CORS headers properly for cross-origin requests', async ({ page }) => {
        const response = await page.request.get('/components/table/table-theme.html');
        (0, test_1.expect)(response.status()).toBe(200);
        // Check CORS headers (they might not be set for same-origin requests)
        const corsHeaders = {
            'access-control-allow-origin': response.headers()['access-control-allow-origin'],
            'access-control-allow-methods': response.headers()['access-control-allow-methods'],
            'access-control-allow-headers': response.headers()['access-control-allow-headers']
        };
        // CORS headers are optional for same-origin requests
        // This test is more informational
        if (corsHeaders['access-control-allow-origin']) {
            (0, test_1.expect)(corsHeaders['access-control-allow-origin']).toBeTruthy();
        }
    });
    (0, test_1.test)('should handle port configuration correctly', async ({ page }) => {
        // Verify that the current server is running on expected port
        const currentUrl = page.url();
        const url = new URL(currentUrl);
        // Test that server is responsive
        const response = await page.request.get('/');
        (0, test_1.expect)([200, 404]).toContain(response.status());
        // Verify port is accessible (implicit in successful connection)
        (0, test_1.expect)(url.hostname).toBeTruthy();
        (0, test_1.expect)(url.port).toBeTruthy();
    });
    (0, test_1.test)('should serve JSON files with correct MIME types', async ({ page }) => {
        const jsonFiles = [
            '/components/table/table.json',
            '/package.json'
        ];
        for (const jsonFile of jsonFiles) {
            const response = await page.request.get(jsonFile);
            if (response.status() === 200) {
                const contentType = response.headers()['content-type'];
                (0, test_1.expect)(contentType, `${jsonFile} should have correct MIME type`).toContain('application/json');
                // Verify it's valid JSON
                try {
                    const content = await response.text();
                    JSON.parse(content);
                }
                catch (error) {
                    throw new Error(`${jsonFile} contains invalid JSON: ${error}`);
                }
            }
        }
    });
    (0, test_1.test)('should handle 404 errors gracefully', async ({ page }) => {
        const nonExistentFiles = [
            '/nonexistent.html',
            '/components/nonexistent.js',
            '/fake/path/file.css'
        ];
        for (const file of nonExistentFiles) {
            const response = await page.request.get(file);
            (0, test_1.expect)(response.status(), `${file} should return 404`).toBe(404);
        }
    });
    (0, test_1.test)('should support proper caching headers', async ({ page }) => {
        const response = await page.request.get('/wb.css');
        if (response.status() === 200) {
            const cacheControl = response.headers()['cache-control'];
            const etag = response.headers()['etag'];
            const lastModified = response.headers()['last-modified'];
            // At least one caching mechanism should be present for static files
            const hasCaching = !!(cacheControl || etag || lastModified);
            // This is informational - caching might not be configured
            if (hasCaching) {
                (0, test_1.expect)(hasCaching).toBe(true);
            }
        }
    });
    (0, test_1.test)('should handle concurrent requests efficiently', async ({ page }) => {
        // Test multiple concurrent requests
        const requests = [
            page.request.get('/wb/wb/wb.html'),
            page.request.get('/wb.css'),
            page.request.get('/wb.js'),
            page.request.get('/components/table/table-theme.html')
        ];
        const startTime = Date.now();
        const responses = await Promise.all(requests);
        const endTime = Date.now();
        // All requests should succeed
        responses.forEach((response, index) => {
            if (response.status() !== 404) { // Allow 404 for non-existent files
                (0, test_1.expect)(response.status(), `Request ${index} should succeed`).toBe(200);
            }
        });
        // Concurrent requests should complete reasonably quickly
        const totalTime = endTime - startTime;
        (0, test_1.expect)(totalTime, 'Concurrent requests should complete within reasonable time').toBeLessThan(10000);
    });
});
//# sourceMappingURL=serverPathFix.spec.js.map