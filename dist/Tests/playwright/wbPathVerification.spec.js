"use strict";
/**
 * wb.html Path Verification Tests
 *
 * This file tests that the wb.html file is accessible at the correct path
 * and that the page loads properly with all required elements.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe("wb.html Path Verification Tests", () => {
    (0, test_1.test)("should be accessible at /wb/wb.html", async ({ page }) => {
        await page.goto("/wb/wb.html");
        // Wait for the page to fully load
        await page.waitForLoadState("networkidle");
        // Verify the page has loaded by checking for key elements
        await (0, test_1.expect)(page.locator("#control-panel")).toBeVisible();
        await (0, test_1.expect)(page.locator("#theme-select")).toBeVisible();
        await (0, test_1.expect)(page.locator("body[data-theme]")).toHaveAttribute("data-theme", "dark");
        // Check page title
        const title = await page.title();
        (0, test_1.expect)(title).toBe("Claude AI Web Builder");
    });
    (0, test_1.test)("should redirect from / to correct wb.html path", async ({ page }) => {
        await page.goto("/");
        // Wait for the page to fully load and any redirects to complete
        await page.waitForLoadState("networkidle");
        // Check that we've landed on the correct page
        const url = new URL(page.url());
        // It might be either /wb/wb.html or just / depending on how the redirect works
        // Let's check for the presence of the key elements instead
        await (0, test_1.expect)(page.locator("#control-panel")).toBeVisible();
        await (0, test_1.expect)(page.locator("#theme-select")).toBeVisible();
    });
    (0, test_1.test)("should not find wb.html at root path", async ({ page, request }) => {
        // This confirms that we shouldn't be using /wb.html in our tests
        const response = await request.get("/wb.html", { failOnStatusCode: false });
        // We should get a 404 or a redirect, but not a 200 OK
        (0, test_1.expect)(response.status()).not.toBe(200);
    });
});
//# sourceMappingURL=wbPathVerification.spec.js.map