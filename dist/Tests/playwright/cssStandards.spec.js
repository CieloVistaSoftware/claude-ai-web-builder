"use strict";
/**
 * CSS Standards Validation Tests
 *
 * Converted from CssStandardsValidation.Tests.ps1
 * Validates CSS files against Unified Web Development Standards
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Helper function to get project root path
function getProjectRoot() {
    const testDir = path.resolve(__dirname);
    const testsDir = path.dirname(testDir);
    return path.dirname(testsDir);
}
test_1.test.describe("CSS Standards Validation Tests", () => {
    const projectRoot = getProjectRoot();
    (0, test_1.test)("should have wb.css file with required CSS variables", async () => {
        const cssFilePath = path.join(projectRoot, "wb.css");
        // Check if the file exists
        (0, test_1.expect)(fs.existsSync(cssFilePath)).toBeTruthy();
        // Read the CSS content
        const cssContent = fs.readFileSync(cssFilePath, "utf8");
        // Define standards to verify
        const standards = {
            "Golden Ratio": /--golden-ratio:\s*1\.618/,
            "Inverse Golden Ratio": /--inverse-golden-ratio:\s*0\.618/,
            "Header Height": /--header-height:\s*20vh/,
            "Nav Width": /--nav-width:\s*calc\(100vw\s*\/\s*\(var\(--golden-ratio\)\s*\*\s*2\.75\)\)/,
            "Content Padding": /--content-padding:\s*calc\(1rem\s*\*\s*var\(--golden-ratio\)\)/,
            "Space XS": /--space-xs:\s*0\.25rem/,
            "Space SM": /--space-sm:\s*0\.5rem/,
            "Space MD": /--space-md:\s*1rem/,
            "Space LG": /--space-lg:\s*calc\(1rem\s*\*\s*var\(--golden-ratio\)\)/,
            "Space XL": /--space-xl:\s*calc\(1rem\s*\*\s*var\(--golden-ratio\)\s*\*\s*var\(--golden-ratio\)\)/,
        };
        let passCount = 0;
        let failCount = 0;
        // Test each standard
        Object.entries(standards).forEach(([standardName, pattern]) => {
            const match = pattern.test(cssContent);
            if (match) {
                passCount++;
                console.log(`✅ ${standardName} standard found`);
            }
            else {
                failCount++;
                console.log(`❌ ${standardName} standard missing`);
            }
            // Individual expectations for better test reporting
            (0, test_1.expect)(cssContent).toMatch(pattern);
        });
        console.log(`Standards validation: ${passCount} passed, ${failCount} failed`);
    });
    (0, test_1.test)("should have proper grid layout definitions", async () => {
        const cssFilePath = path.join(projectRoot, "wb.css");
        const cssContent = fs.readFileSync(cssFilePath, "utf8");
        // Grid layout patterns
        const gridPatterns = {
            "Left Nav Grid": /grid-template-columns:\s*var\(--nav-width\)\s+1fr/,
            "Header Side Nav Grid": /grid-template-areas.*nav.*header/,
            "Top Nav Grid": /grid-template-areas.*header/,
        };
        Object.entries(gridPatterns).forEach(([gridName, pattern]) => {
            const hasPattern = pattern.test(cssContent);
            console.log(`${hasPattern ? "✅" : "⚠️"} ${gridName}: ${hasPattern ? "found" : "not found"}`);
            // Note: Some grid patterns may be optional depending on layout
            if (gridName === "Left Nav Grid") {
                (0, test_1.expect)(cssContent).toMatch(pattern);
            }
        });
    });
    (0, test_1.test)("should have responsive design breakpoints", async () => {
        const cssFilePath = path.join(projectRoot, "wb.css");
        const cssContent = fs.readFileSync(cssFilePath, "utf8");
        // Look for media queries
        const mediaQueryPatterns = [
            /@media.*max-width.*768px/i,
            /@media.*min-width.*769px/i,
            /@media.*max-width.*1024px/i,
            /@media.*min-width.*1025px/i,
        ];
        let mediaQueriesFound = 0;
        mediaQueryPatterns.forEach((pattern, index) => {
            if (pattern.test(cssContent)) {
                mediaQueriesFound++;
                console.log(`✅ Media query pattern ${index + 1} found`);
            }
        });
        console.log(`Found ${mediaQueriesFound} responsive breakpoints`);
        // Should have at least some responsive design
        (0, test_1.expect)(mediaQueriesFound).toBeGreaterThan(0);
    });
    (0, test_1.test)("should have proper color system variables", async () => {
        const cssFilePath = path.join(projectRoot, "wb.css");
        const cssContent = fs.readFileSync(cssFilePath, "utf8");
        // Color system patterns
        const colorPatterns = {
            "Primary Color": /--(?:primary|color-primary)/i,
            "Secondary Color": /--(?:secondary|color-secondary)/i,
            "Background Color": /--(?:bg|background|color-bg)/i,
            "Text Color": /--(?:text|color-text)/i,
            "Border Color": /--(?:border|color-border)/i,
        };
        Object.entries(colorPatterns).forEach(([colorName, pattern]) => {
            const hasPattern = pattern.test(cssContent);
            console.log(`${hasPattern ? "✅" : "⚠️"} ${colorName}: ${hasPattern ? "found" : "not found"}`);
        });
        // Should have at least basic color variables
        const hasColorSystem = Object.values(colorPatterns).some((pattern) => pattern.test(cssContent));
        (0, test_1.expect)(hasColorSystem).toBeTruthy();
    });
    (0, test_1.test)("should apply CSS standards in browser", async ({ page }) => {
        await page.goto("/wb/wb/wb/wb.html");
        // Check if CSS variables are properly applied
        const cssVariables = await page.evaluate(() => {
            const root = document.documentElement;
            const styles = window.getComputedStyle(root);
            return {
                goldenRatio: styles.getPropertyValue("--golden-ratio"),
                headerHeight: styles.getPropertyValue("--header-height"),
                navWidth: styles.getPropertyValue("--nav-width"),
                spaceMd: styles.getPropertyValue("--space-md"),
            };
        });
        console.log("Applied CSS variables:", cssVariables);
        // Verify that at least some variables are defined
        const definedVariables = Object.values(cssVariables).filter((value) => value && value.trim());
        (0, test_1.expect)(definedVariables.length).toBeGreaterThan(0);
    });
    (0, test_1.test)("should have consistent spacing throughout the application", async ({ page, }) => {
        await page.goto("/wb/wb/wb/wb.html");
        // Check for consistent use of spacing variables
        const spacingUsage = await page.evaluate(() => {
            const elements = document.querySelectorAll("*");
            const spacingValues = new Set();
            elements.forEach((el) => {
                const styles = window.getComputedStyle(el);
                ["margin", "padding", "gap"].forEach((prop) => {
                    const value = styles.getPropertyValue(prop);
                    if (value && value !== "0px") {
                        spacingValues.add(value);
                    }
                });
            });
            return Array.from(spacingValues).slice(0, 10); // Limit for logging
        });
        console.log("Spacing values found:", spacingUsage);
        (0, test_1.expect)(spacingUsage.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=cssStandards.spec.js.map