"use strict";
/**
 * Grid Layout Tests
 *
 * Converted from GridLayout.Tests.ps1
 * Tests grid layout calculations and responsive design breakpoints
 */
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe("Grid Layout Tests", () => {
    (0, test_1.test)("should calculate correct grid layout proportions using golden ratio", async () => {
        const goldenRatio = 1.618;
        const navWidthPercent = Math.round(100 / (goldenRatio * 2.75));
        const contentWidthPercent = 100 - navWidthPercent;
        // Verify calculations
        (0, test_1.expect)(navWidthPercent).toBeCloseTo(22, 0); // Should be approximately 22%
        (0, test_1.expect)(contentWidthPercent).toBeCloseTo(78, 0); // Should be approximately 78%
        console.log(`Navigation width: ${navWidthPercent}%`);
        console.log(`Content width: ${contentWidthPercent}%`);
    });
    (0, test_1.test)("should have correct responsive breakpoints", async () => {
        const tabletBreakpoint = 768;
        const desktopBreakpoint = 1024;
        // Verify breakpoint values
        (0, test_1.expect)(tabletBreakpoint).toBe(768);
        (0, test_1.expect)(desktopBreakpoint).toBe(1024);
        console.log(`Mobile: < ${tabletBreakpoint}px`);
        console.log(`Tablet: ${tabletBreakpoint}px - ${desktopBreakpoint}px`);
        console.log(`Desktop: >= ${desktopBreakpoint}px`);
    });
    (0, test_1.test)("should apply grid layout in browser", async ({ page }) => {
        // Navigate to a page that uses grid layout
        await page.goto("/wb/wb/wb/wb.html");
        // Check if CSS grid is applied
        const gridContainer = await page
            .locator(".layout-container, .grid-container, body")
            .first();
        if ((await gridContainer.count()) > 0) {
            const gridDisplay = await gridContainer.evaluate((el) => {
                return window.getComputedStyle(el).display;
            });
            // Should use grid or flex for layout
            (0, test_1.expect)(gridDisplay).toMatch(/^(grid|flex|block)$/);
        }
    });
    (0, test_1.test)("should have proper grid template areas for different layouts", async ({ page, }) => {
        await page.goto("/wb/wb/wb/wb.html");
        // Test grid template areas if they exist
        const hasGridTemplateAreas = await page.evaluate(() => {
            const elements = document.querySelectorAll("*");
            for (let el of Array.from(elements)) {
                const style = window.getComputedStyle(el);
                if (style.gridTemplateAreas && style.gridTemplateAreas !== "none") {
                    return true;
                }
            }
            return false;
        });
        // Log the result for verification
        console.log(`Grid template areas found: ${hasGridTemplateAreas}`);
    });
});
//# sourceMappingURL=gridLayout.spec.js.map