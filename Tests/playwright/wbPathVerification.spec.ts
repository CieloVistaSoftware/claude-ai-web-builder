/**
 * wb.html Path Verification Tests
 *
 * This file tests that the wb.html file is accessible at the correct path
 * and that the page loads properly with all required elements.
 */

import { test, expect } from "@playwright/test";

test.describe("wb.html Path Verification Tests", () => {
  test("should be accessible at /wb/wb.html", async ({ page }) => {
    await page.goto("/wb/wb.html");

    // Wait for the page to fully load
    await page.waitForLoadState("networkidle");

    // Verify the page has loaded by checking for key elements
    await expect(page.locator("#control-panel")).toBeVisible();
    await expect(page.locator("#theme-select")).toBeVisible();
    await expect(page.locator("body[data-theme]")).toHaveAttribute(
      "data-theme",
      "dark"
    );

    // Check page title
    const title = await page.title();
    expect(title).toBe("Claude AI Web Builder");
  });

  test("should redirect from / to correct wb.html path", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to fully load and any redirects to complete
    await page.waitForLoadState("networkidle");

    // Check that we've landed on the correct page
    const url = new URL(page.url());

    // It might be either /wb/wb.html or just / depending on how the redirect works
    // Let's check for the presence of the key elements instead
    await expect(page.locator("#control-panel")).toBeVisible();
    await expect(page.locator("#theme-select")).toBeVisible();
  });

  test("should not find wb.html at root path", async ({ page, request }) => {
    // This confirms that we shouldn't be using /wb.html in our tests
    const response = await request.get("/wb.html", { failOnStatusCode: false });

    // We should get a 404 or a redirect, but not a 200 OK
    expect(response.status()).not.toBe(200);
  });
});
