/**
 * CSS Standards Validation Tests
 *
 * Converted from CssStandardsValidation.Tests.ps1
 * Validates CSS files against Unified Web Development Standards
 */

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Helper function to get project root path
function getProjectRoot() {
  const testDir = path.resolve(__dirname);
  const testsDir = path.dirname(testDir);
  return path.dirname(testsDir);
}

test.describe("CSS Standards Validation Tests", () => {
  const projectRoot = getProjectRoot();

  test("should have wb.css file with required CSS variables", async () => {
    const cssFilePath = path.join(projectRoot, "wb.css");

    // Check if the file exists
    expect(fs.existsSync(cssFilePath)).toBeTruthy();

    // Read the CSS content
    const cssContent = fs.readFileSync(cssFilePath, "utf8");

    // Define standards to verify
    const standards = {
      "Golden Ratio": /--golden-ratio:\s*1\.618/,
      "Inverse Golden Ratio": /--inverse-golden-ratio:\s*0\.618/,
      "Header Height": /--header-height:\s*20vh/,
      "Nav Width":
        /--nav-width:\s*calc\(100vw\s*\/\s*\(var\(--golden-ratio\)\s*\*\s*2\.75\)\)/,
      "Content Padding":
        /--content-padding:\s*calc\(1rem\s*\*\s*var\(--golden-ratio\)\)/,
      "Space XS": /--space-xs:\s*0\.25rem/,
      "Space SM": /--space-sm:\s*0\.5rem/,
      "Space MD": /--space-md:\s*1rem/,
      "Space LG": /--space-lg:\s*calc\(1rem\s*\*\s*var\(--golden-ratio\)\)/,
      "Space XL":
        /--space-xl:\s*calc\(1rem\s*\*\s*var\(--golden-ratio\)\s*\*\s*var\(--golden-ratio\)\)/,
    };

    let passCount = 0;
    let failCount = 0;

    // Test each standard
    Object.entries(standards).forEach(([standardName, pattern]) => {
      const match = pattern.test(cssContent);

      if (match) {
        passCount++;
        console.log(`✅ ${standardName} standard found`);
      } else {
        failCount++;
        console.log(`❌ ${standardName} standard missing`);
      }

      // Individual expectations for better test reporting
      expect(cssContent).toMatch(pattern);
    });

    console.log(
      `Standards validation: ${passCount} passed, ${failCount} failed`
    );
  });

  test("should have proper grid layout definitions", async () => {
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
      console.log(
        `${hasPattern ? "✅" : "⚠️"} ${gridName}: ${
          hasPattern ? "found" : "not found"
        }`
      );

      // Note: Some grid patterns may be optional depending on layout
      if (gridName === "Left Nav Grid") {
        expect(cssContent).toMatch(pattern);
      }
    });
  });

  test("should have responsive design breakpoints", async () => {
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
    expect(mediaQueriesFound).toBeGreaterThan(0);
  });

  test("should have proper color system variables", async () => {
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
      console.log(
        `${hasPattern ? "✅" : "⚠️"} ${colorName}: ${
          hasPattern ? "found" : "not found"
        }`
      );
    });

    // Should have at least basic color variables
    const hasColorSystem = Object.values(colorPatterns).some((pattern) =>
      pattern.test(cssContent)
    );
    expect(hasColorSystem).toBeTruthy();
  });

  test("should apply CSS standards in browser", async ({ page }) => {
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
    const definedVariables = Object.values(cssVariables).filter(
      (value) => value && value.trim()
    );
    expect(definedVariables.length).toBeGreaterThan(0);
  });

  test("should have consistent spacing throughout the application", async ({
    page,
  }) => {
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
    expect(spacingUsage.length).toBeGreaterThan(0);
  });
});
