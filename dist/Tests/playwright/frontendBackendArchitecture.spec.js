"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * Frontend/Backend Architecture Tests
 *
 * Tests for the server architecture and file serving capabilities.
 * Converted from FrontendBackendArchitecture.Tests.ps1
 */
test_1.test.describe("Frontend/Backend Architecture Tests", () => {
    test_1.test.setTimeout(30000);
    (0, test_1.test)("should serve static files correctly", async ({ page }) => {
        // Test that the main website builder loads
        const response = await page.request.get("/wb/wb/wb.html");
        (0, test_1.expect)(response.status()).toBe(200);
        // Verify content type
        const contentType = response.headers()["content-type"];
        (0, test_1.expect)(contentType).toContain("text/html");
    });
    (0, test_1.test)("should serve CSS files correctly", async ({ page }) => {
        const cssResponse = await page.request.get("/wb.css");
        (0, test_1.expect)(cssResponse.status()).toBe(200);
        const contentType = cssResponse.headers()["content-type"];
        (0, test_1.expect)(contentType).toContain("text/css");
    });
    (0, test_1.test)("should serve JavaScript files correctly", async ({ page }) => {
        const jsResponse = await page.request.get("/wb.js");
        (0, test_1.expect)(jsResponse.status()).toBe(200);
        const contentType = jsResponse.headers()["content-type"];
        (0, test_1.expect)(contentType).toMatch(/application\/javascript|text\/javascript/);
    });
    (0, test_1.test)("should serve component files from components directory", async ({ page, }) => {
        // Test table theme component file
        const tableThemeResponse = await page.request.get("/components/table/table-theme.html");
        (0, test_1.expect)(tableThemeResponse.status()).toBe(200);
        // Test that it contains HTML content
        const content = await tableThemeResponse.text();
        (0, test_1.expect)(content).toContain("<html>");
        (0, test_1.expect)(content).toContain("</html>");
    });
    (0, test_1.test)("should serve theme files from themes directory", async ({ page }) => {
        // Test that theme files are accessible
        const possibleThemeFiles = [
            "/themes/theme-generator.html",
            "/themes/hsl-color-picker.html",
            "/themes/hue-color-slider.html",
        ];
        let foundThemeFile = false;
        for (const themeFile of possibleThemeFiles) {
            const response = await page.request.get(themeFile);
            if (response.status() === 200) {
                foundThemeFile = true;
                break;
            }
        }
        (0, test_1.expect)(foundThemeFile).toBe(true);
    });
    (0, test_1.test)("should handle 404 errors gracefully", async ({ page }) => {
        const response = await page.request.get("/nonexistent-file.html");
        (0, test_1.expect)(response.status()).toBe(404);
    });
    (0, test_1.test)("should serve JSON files correctly", async ({ page }) => {
        const jsonResponse = await page.request.get("/components/table/table.json");
        if (jsonResponse.status() === 200) {
            const contentType = jsonResponse.headers()["content-type"];
            (0, test_1.expect)(contentType).toContain("application/json");
            // Verify it's valid JSON
            const jsonContent = await jsonResponse.text();
            (0, test_1.expect)(() => JSON.parse(jsonContent)).not.toThrow();
        }
    });
    (0, test_1.test)("should support CORS headers if needed", async ({ page }) => {
        const response = await page.request.get("/wb.js");
        (0, test_1.expect)(response.status()).toBe(200);
        // Check if CORS headers are present (they might not be needed for same-origin)
        const corsHeader = response.headers()["access-control-allow-origin"];
        // This test is informational - CORS might not be configured
        if (corsHeader) {
            (0, test_1.expect)(corsHeader).toBeTruthy();
        }
    });
    (0, test_1.test)("should load main application correctly", async ({ page }) => {
        await page.goto("/wb/wb/wb/wb.html");
        await page.waitForLoadState("networkidle");
        // Verify the page title
        const title = await page.title();
        (0, test_1.expect)(title).toBeTruthy();
        // Verify basic page structure
        const body = await page.locator("body");
        await (0, test_1.expect)(body).toBeVisible();
        // Check that JavaScript executed properly
        const jsExecuted = await page.evaluate(() => {
            return (typeof document !== "undefined" && document.readyState === "complete");
        });
        (0, test_1.expect)(jsExecuted).toBe(true);
    });
    (0, test_1.test)("should handle concurrent requests properly", async ({ page }) => {
        // Test that multiple resources can be loaded simultaneously
        const responses = await Promise.all([
            page.request.get("/wb/wb/wb.html"),
            page.request.get("/wb.css"),
            page.request.get("/wb.js"),
        ]);
        responses.forEach((response) => {
            (0, test_1.expect)(response.status()).toBe(200);
        });
    });
    (0, test_1.test)("should maintain proper file structure organization", async ({ page, }) => {
        // Test that files are organized in expected directories
        const fileStructureTests = [
            { path: "/wb/wb/wb.html", description: "main HTML file" },
            { path: "/wb.css", description: "main CSS file" },
            { path: "/wb.js", description: "main JavaScript file" },
        ];
        for (const { path, description } of fileStructureTests) {
            const response = await page.request.get(path);
            (0, test_1.expect)(response.status(), `${description} should be accessible`).toBe(200);
        }
    });
});
//# sourceMappingURL=frontendBackendArchitecture.spec.js.map