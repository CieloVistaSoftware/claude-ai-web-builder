"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * Consolidated Footer Tests
 *
 * This test suite checks all footer functionality for the Website Builder.
 * Converted from ConsolidatedFooterTests.ps1
 */
test_1.test.describe("Footer Functionality Tests", () => {
    // Increase timeout for all tests in this group
    test_1.test.setTimeout(30000);
    test_1.test.beforeEach(async ({ page }) => {
        // Navigate to the main website builder page
        await page.goto("/wb/wb/wb/wb.html");
        // Ensure the page has loaded completely
        await page.waitForLoadState("networkidle");
    });
    (0, test_1.test)("should have footer position controls in HTML", async ({ page }) => {
        // Check for footer position label
        const footerPositionLabel = await page.locator('label[for="footer-position-select"]');
        await (0, test_1.expect)(footerPositionLabel).toBeVisible();
        // Check for footer position select element
        const footerPositionSelect = await page.locator("#footer-position-select");
        await (0, test_1.expect)(footerPositionSelect).toBeVisible();
        // Check for footer position options
        const samePageOption = await page.locator('#footer-position-select option[value="same-page"]');
        await (0, test_1.expect)(samePageOption).toBeAttached();
        const eachPageOption = await page.locator('#footer-position-select option[value="each-page"]');
        await (0, test_1.expect)(eachPageOption).toBeAttached();
    });
    (0, test_1.test)("should have footer visibility controls", async ({ page }) => {
        // Check for footer visibility control checkbox
        const footerVisibilityControl = await page.locator("#footer-visibility");
        await (0, test_1.expect)(footerVisibilityControl).toBeVisible();
        // Check for the footer element
        const footer = await page.locator("footer");
        await (0, test_1.expect)(footer).toBeAttached();
    });
    (0, test_1.test)("should toggle footer visibility when control is clicked", async ({ page, }) => {
        try {
            // Find the footer element
            const footer = await page.locator("footer");
            await (0, test_1.expect)(footer).toBeAttached({ timeout: 5000 });
            // Get initial visibility state via JavaScript to be more reliable
            const initiallyVisible = await page.evaluate(() => {
                const footer = document.querySelector("footer");
                if (!footer)
                    return false;
                const style = window.getComputedStyle(footer);
                return style.display !== "none" && style.visibility !== "hidden";
            });
            // Find and click the visibility toggle
            const visibilityToggle = await page.locator("#footer-visibility");
            await (0, test_1.expect)(visibilityToggle).toBeVisible({ timeout: 5000 });
            await visibilityToggle.click();
            // Wait for the visibility change to apply
            await page.waitForTimeout(1000);
            // Check if visibility changed using JavaScript
            const nowVisible = await page.evaluate(() => {
                const footer = document.querySelector("footer");
                if (!footer)
                    return false;
                const style = window.getComputedStyle(footer);
                return style.display !== "none" && style.visibility !== "hidden";
            });
            // The visibility should have toggled
            (0, test_1.expect)(nowVisible).not.toEqual(initiallyVisible);
            // Toggle back to original state
            await visibilityToggle.click();
            await page.waitForTimeout(1000);
            // Should be back to original state
            const finallyVisible = await page.evaluate(() => {
                const footer = document.querySelector("footer");
                if (!footer)
                    return false;
                const style = window.getComputedStyle(footer);
                return style.display !== "none" && style.visibility !== "hidden";
            });
            (0, test_1.expect)(finallyVisible).toEqual(initiallyVisible);
        }
        catch (error) {
            // Take screenshot if the test fails
            await page.screenshot({ path: "footer-visibility-toggle-failure.png" });
            throw error;
        }
    });
    (0, test_1.test)("should change footer position attribute when select is changed", async ({ page, }) => {
        try {
            // Find the position select element
            const positionSelect = await page.locator("#footer-position-select");
            await (0, test_1.expect)(positionSelect).toBeVisible({ timeout: 5000 });
            // Get all available options
            const options = await positionSelect.locator("option").all();
            if (options.length < 2) {
                console.log("Not enough position options to test");
                return;
            }
            // Store the initial data-footer attribute on body
            const initialFooterPosition = await page.evaluate(() => {
                return document.body.getAttribute("data-footer") || "same-page"; // Default if not set
            });
            // Select a different option
            const newValue = initialFooterPosition === "same-page" ? "each-page" : "same-page";
            await positionSelect.selectOption(newValue);
            // Wait for the change to apply
            await page.waitForTimeout(1000);
            // Check if the body's data-footer attribute has changed
            const updatedFooterPosition = await page.evaluate(() => {
                return document.body.getAttribute("data-footer") || "same-page"; // Default if not set
            });
            // Log the change for debugging
            console.log(`Footer position changed from ${initialFooterPosition} to ${updatedFooterPosition}`);
            // The footer position attribute should have changed
            (0, test_1.expect)(updatedFooterPosition).toEqual(newValue);
        }
        catch (error) {
            // Take screenshot if the test fails
            await page.screenshot({ path: "footer-position-change-failure.png" });
            throw error;
        }
    });
    (0, test_1.test)("should have correct CSS styling for footer", async ({ page }) => {
        // Check if footer has expected CSS properties
        const footer = await page.locator("footer");
        // Get computed styles for the footer
        const styles = await footer.evaluate((el) => {
            const computedStyle = window.getComputedStyle(el);
            return {
                position: computedStyle.position,
                display: computedStyle.display,
                backgroundColor: computedStyle.backgroundColor,
                color: computedStyle.color,
                padding: computedStyle.padding,
                margin: computedStyle.margin,
                // Check if there are CSS rules for the footer
                hasStyles: Array.from(document.styleSheets).some((sheet) => {
                    try {
                        return Array.from(sheet.cssRules).some((rule) => rule.selectorText &&
                            rule.selectorText.includes("footer"));
                    }
                    catch (e) {
                        // CORS may prevent reading rules from external stylesheets
                        return false;
                    }
                }),
            };
        });
        // Footer should be visible and have some styling
        (0, test_1.expect)(styles.display).not.toEqual("none");
        (0, test_1.expect)(styles.padding).not.toEqual("0px");
    });
});
//# sourceMappingURL=footer.spec.js.map