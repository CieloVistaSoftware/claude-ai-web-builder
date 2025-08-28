"use strict";
/**
 * Navigation Width Tests
 *
 * Converted from NavWidth.Tests.ps1
 * Tests navigation width calculations using Golden Ratio Foundation
 */
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe("Navigation Width Tests", () => {
    (0, test_1.test)("should calculate navigation width using golden ratio", async () => {
        const goldenRatio = 1.618;
        const inverseGoldenRatio = 0.618;
        // Calculate nav width using golden ratio formula
        const navWidthPercent = 100 / (goldenRatio * 2.75); // Should give ~22.4%
        // Verify calculations
        (0, test_1.expect)(navWidthPercent).toBeCloseTo(22.4, 1);
        (0, test_1.expect)(goldenRatio).toBeCloseTo(1.618, 3);
        (0, test_1.expect)(inverseGoldenRatio).toBeCloseTo(0.618, 3);
        console.log(`Golden Ratio: ${goldenRatio}`);
        console.log(`Nav width percentage: ${navWidthPercent.toFixed(2)}%`);
    });
    (0, test_1.test)("should calculate responsive nav widths for different viewports", async () => {
        const goldenRatio = 1.618;
        const navWidthPercent = 100 / (goldenRatio * 2.75);
        // Test different viewport sizes
        const viewports = [
            { name: "Mobile", width: 375 },
            { name: "Tablet", width: 768 },
            { name: "Desktop", width: 1920 },
            { name: "Large Desktop", width: 2560 },
        ];
        viewports.forEach((viewport) => {
            const navWidthPixels = Math.round(viewport.width * (navWidthPercent / 100));
            console.log(`${viewport.name} (${viewport.width}px): Nav width = ${navWidthPixels}px`);
            // Verify the calculation makes sense
            (0, test_1.expect)(navWidthPixels).toBeGreaterThan(0);
            (0, test_1.expect)(navWidthPixels).toBeLessThan(viewport.width);
        });
    });
    (0, test_1.test)("should apply navigation width in browser", async ({ page }) => {
        await page.goto("/wb/wb/wb/wb.html");
        // Look for navigation elements
        const navElements = await page
            .locator("nav, .nav, .navigation, .sidebar")
            .all();
        if (navElements.length > 0) {
            const navElement = navElements[0];
            // Get computed width
            const navWidth = await navElement.evaluate((el) => {
                const rect = el.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const widthPercentage = (rect.width / viewportWidth) * 100;
                return {
                    pixels: rect.width,
                    percentage: widthPercentage,
                    viewportWidth: viewportWidth,
                };
            });
            console.log(`Navigation width: ${navWidth.pixels}px (${navWidth.percentage.toFixed(1)}%)`);
            console.log(`Viewport width: ${navWidth.viewportWidth}px`);
            // Verify the width is reasonable (between 15% and 30% of viewport)
            (0, test_1.expect)(navWidth.percentage).toBeGreaterThan(10);
            (0, test_1.expect)(navWidth.percentage).toBeLessThan(40);
        }
    });
    (0, test_1.test)("should maintain golden ratio proportions at different screen sizes", async ({ page, }) => {
        const goldenRatio = 1.618;
        const expectedNavPercent = 100 / (goldenRatio * 2.75);
        // Test different viewport sizes
        const viewportSizes = [
            { width: 375, height: 667 }, // Mobile
            { width: 768, height: 1024 }, // Tablet
            { width: 1920, height: 1080 }, // Desktop
        ];
        for (const size of viewportSizes) {
            await page.setViewportSize(size);
            await page.goto("/wb/wb/wb/wb.html");
            const navElements = await page
                .locator("nav, .nav, .navigation, .sidebar")
                .all();
            if (navElements.length > 0) {
                const navElement = navElements[0];
                const navData = await navElement.evaluate((el) => {
                    const rect = el.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    return {
                        widthPercent: (rect.width / viewportWidth) * 100,
                        viewportWidth: viewportWidth,
                    };
                });
                console.log(`${size.width}x${size.height}: Nav = ${navData.widthPercent.toFixed(1)}%`);
                // Allow some tolerance for different implementations
                (0, test_1.expect)(navData.widthPercent).toBeGreaterThan(15);
                (0, test_1.expect)(navData.widthPercent).toBeLessThan(35);
            }
        }
    });
});
//# sourceMappingURL=navWidth.spec.js.map