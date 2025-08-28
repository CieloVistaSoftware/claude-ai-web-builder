import { test, expect } from "@playwright/test";

/**
 * Consolidated Color Bar Tests
 *
 * This test suite checks all color bar functionality for the Website Builder.
 * Converted from ConsolidatedColorBarTests.ps1
 */

test.describe("Color Bar Functionality Tests", () => {
  // Increase timeout for all tests in this group
  test.setTimeout(30000);
  test.beforeEach(async ({ page }) => {
    // Navigate to the main website builder page
    await page.goto("/wb/wb/wb/wb.html");
    // Ensure the page has loaded completely
    await page.waitForLoadState("networkidle");
  });
  test("HTML structure should include color controls", async ({ page }) => {
    // Check for color bar container
    const colorBar = await page.locator("#color-bar");
    await expect(colorBar).toBeVisible();

    // Check for color input controls
    const colorInputs = await page.locator('input[type="color"]');
    expect(await colorInputs.count()).toBeGreaterThan(0);

    // Check for primary and accent color inputs
    const primaryColor = await page.locator("#primary-color");
    await expect(primaryColor).toBeVisible();

    const accentColor = await page.locator("#accent-color");
    await expect(accentColor).toBeVisible();

    // Check for color controls wrapper
    const colorControls = await page.locator(".color-controls");
    await expect(colorControls).toBeVisible();
  });

  test("JavaScript should include color handling functions", async ({
    page,
  }) => {
    // Check if JS functions for color handling exist
    const colorFunctionsExist = await page.evaluate(() => {
      const scriptElements = Array.from(document.querySelectorAll("script"));
      const scripts = scriptElements
        .map((script) => script.textContent)
        .join("");

      const hasUpdateColors =
        scripts.includes("updateColors") ||
        scripts.includes("updateColorScheme");
      const hasApplyTheme =
        scripts.includes("applyTheme") || scripts.includes("applyColorTheme");
      const hasSaveColors =
        scripts.includes("saveColors") || scripts.includes("saveColorScheme");

      return hasUpdateColors && hasApplyTheme && hasSaveColors;
    });

    expect(colorFunctionsExist).toBeTruthy();
  });
  test("Color bar should update theme when colors change", async ({ page }) => {
    // Get the initial color value displayed next to the input
    const primaryColorLabel = await page.locator(
      ".color-slider-group:has(#primary-color) .color-value"
    );
    await expect(primaryColorLabel).toBeVisible();
    const initialColorValue = await primaryColorLabel.textContent();

    // Change the primary color
    const primaryColorInput = await page.locator("#primary-color");
    await expect(primaryColorInput).toBeVisible();
    await primaryColorInput.evaluate((el) => {
      // Set value to a bright red
      (el as HTMLInputElement).value = "#ff0000";
      // Dispatch input event to trigger change handlers
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });

    // Click the apply colors button to apply the changes
    const applyButton = page.locator("#apply-colors");
    await expect(applyButton).toBeVisible();
    await applyButton.click();

    // Wait a moment for the color change to apply
    await page.waitForTimeout(1000);

    // Get the updated color value
    const newColorValue = await primaryColorLabel.textContent();

    // The color value should have changed to reflect the new color
    expect(initialColorValue).not.toEqual(newColorValue);
    if (newColorValue) {
      expect(newColorValue.toLowerCase()).toEqual("#ff0000");
    } else {
      throw new Error("Color value not updated after color change");
    }
  });

  test("CSS should have color variables defined", async ({ page }) => {
    // Check if CSS custom properties for colors are defined
    const hasCssColorVariables = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return (
        styles.getPropertyValue("--primary-color") !== "" ||
        styles.getPropertyValue("--accent-color") !== "" ||
        styles.getPropertyValue("--text-color") !== "" ||
        styles.getPropertyValue("--background-color") !== ""
      );
    });

    expect(hasCssColorVariables).toBeTruthy();
  });
});
