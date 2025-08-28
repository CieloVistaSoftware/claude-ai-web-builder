/**
 * Theme Control UI Tests
 *
 * This file tests theme selection UI and functionality:
 *   - Theme dropdown existence and functionality
 *   - Default dark mode settings
 *   - Theme persistence
 *   - Ensuring no duplicate theme controls
 */

import { test, expect } from "@playwright/test";

test.describe("Theme Control UI Tests", () => {
  test("should have single theme control in the floating panel only", async ({
    page,
  }) => {
    await page.goto("/wb/wb.html");

    // Wait for the page to fully load
    await page.waitForLoadState("networkidle");

    // Check if we have exactly one theme-select dropdown
    const themeSelects = await page.locator("#theme-select").all();
    expect(themeSelects.length).toBe(1);

    // Verify the theme select is inside the control panel
    const themeSelectInPanel = await page
      .locator("#control-panel #theme-select")
      .count();
    expect(themeSelectInPanel).toBe(1);

    // Ensure no theme-select outside of control panel
    const themeSelectOutsidePanel = await page
      .locator("#theme-select")
      .filter({ has: page.locator(":not(#control-panel *)") })
      .count();
    expect(themeSelectOutsidePanel).toBe(0);
  });

  test("should default to dark mode", async ({ page }) => {
    await page.goto("/wb/wb.html");
    await page.waitForLoadState("networkidle");

    // Check if body has data-theme attribute set to dark
    const bodyTheme = await page.evaluate(() => {
      return document.body.getAttribute("data-theme");
    });

    expect(bodyTheme).toBe("dark");

    // Check if the theme-select dropdown is set to dark
    const selectedTheme = await page
      .locator("#theme-select")
      .evaluate((select) => {
        return (select as HTMLSelectElement).value;
      });

    expect(selectedTheme).toBe("dark");
  });

  test("should persist theme selection after page reload", async ({ page }) => {
    await page.goto("/wb/wb/wb.html");

    // First ensure we're in dark mode to start
    await page.evaluate(() => {
      document.body.setAttribute("data-theme", "dark");
      (document.getElementById("theme-select") as HTMLSelectElement).value =
        "dark";
    });

    // Change to light mode
    await page.selectOption("#theme-select", "light");

    // Give browser time to save to localStorage
    await page.waitForTimeout(300);

    // Reload the page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Check that light mode persisted
    const bodyTheme = await page.evaluate(() => {
      return document.body.getAttribute("data-theme");
    });

    expect(bodyTheme).toBe("light");

    // Reset to dark mode for other tests
    await page.selectOption("#theme-select", "dark");
    await page.waitForTimeout(300);
  });

  test("should set dark mode as default with no saved state", async ({
    page,
    context,
  }) => {
    // Clear localStorage to simulate first visit
    await context.clearCookies();
    await page.goto("/wb/wb/wb.html");
    await page.evaluate(() => localStorage.clear());

    // Reload the page to force init with clear state
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Check that dark mode is set as default
    const bodyTheme = await page.evaluate(() => {
      return document.body.getAttribute("data-theme");
    });

    expect(bodyTheme).toBe("dark");
  });
});
