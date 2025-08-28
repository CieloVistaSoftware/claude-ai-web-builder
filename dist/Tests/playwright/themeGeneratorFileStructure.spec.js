"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * Theme Generator File Structure Tests
 *
 * Tests for proper organization of theme generator files.
 * Converted from ThemeGeneratorFileStructureTest.ps1
 */
test_1.test.describe('Theme Generator File Structure Tests', () => {
    test_1.test.setTimeout(30000);
    (0, test_1.test)('should have proper theme directory structure', async ({ page }) => {
        // Test main themes directory accessibility
        const themesResponse = await page.request.get('/themes/');
        (0, test_1.expect)([200, 404, 403]).toContain(themesResponse.status());
        // Test specific theme files
        const themeFiles = [
            '/themes/theme-generator.html',
            '/themes/hsl-color-picker.html',
            '/themes/hue-color-slider.html'
        ];
        let foundThemeFiles = 0;
        for (const file of themeFiles) {
            const response = await page.request.get(file);
            if (response.status() === 200) {
                foundThemeFiles++;
            }
        }
        (0, test_1.expect)(foundThemeFiles, 'Should have at least one theme file').toBeGreaterThan(0);
    });
    (0, test_1.test)('should have generator subdirectory if refactored', async ({ page }) => {
        // Test if generator subdirectory exists
        const generatorIndexResponse = await page.request.get('/themes/generator/index.html');
        if (generatorIndexResponse.status() === 200) {
            // Refactored structure exists
            const generatorFiles = [
                '/themes/generator/index.html',
                '/themes/generator/script.js',
                '/themes/generator/styles.css'
            ];
            for (const file of generatorFiles) {
                const response = await page.request.get(file);
                (0, test_1.expect)(response.status(), `${file} should be accessible`).toBe(200);
            }
        }
    });
    (0, test_1.test)('should have proper file organization without legacy files', async ({ page }) => {
        // Test that theme files don't contain legacy/backup files
        const legacyPatterns = [
            '/themes/backup',
            '/themes/old',
            '/themes/temp',
            '/themes/zzz'
        ];
        for (const pattern of legacyPatterns) {
            const response = await page.request.get(pattern);
            // These should return 404 (not found) as they shouldn't exist
            (0, test_1.expect)(response.status(), `${pattern} should not exist`).toBe(404);
        }
    });
    (0, test_1.test)('should load theme generator with proper functionality', async ({ page }) => {
        // Try to load the main theme generator
        let themeGeneratorUrl = '/themes/theme-generator.html';
        let response = await page.request.get(themeGeneratorUrl);
        if (response.status() !== 200) {
            // Try the refactored version
            themeGeneratorUrl = '/themes/generator/index.html';
            response = await page.request.get(themeGeneratorUrl);
        }
        if (response.status() === 200) {
            await page.goto(themeGeneratorUrl);
            await page.waitForLoadState('networkidle');
            // Check for theme generator elements
            const themeElements = await page.evaluate(() => {
                const elements = {
                    hasThemeNameInput: !!document.querySelector('#themeName, [name="themeName"], .theme-name'),
                    hasColorSchemeSelect: !!document.querySelector('#colorScheme, [name="colorScheme"], .color-scheme'),
                    hasHueSlider: !!document.querySelector('#primaryHue, [name="primaryHue"], .hue-slider, input[type="range"]'),
                    hasGenerateButton: !!document.querySelector('button:contains("Generate"), .generate-btn, #generate'),
                    hasPreviewArea: !!document.querySelector('#preview, .preview, #lightPreview, #darkPreview')
                };
                return elements;
            });
            // At least some theme generator elements should be present
            const elementCount = Object.values(themeElements).filter(Boolean).length;
            (0, test_1.expect)(elementCount, 'Should have theme generator elements').toBeGreaterThan(0);
        }
    });
    (0, test_1.test)('should have CSS and JavaScript files properly organized', async ({ page }) => {
        // Check for organized CSS files
        const cssFiles = [
            '/themes/generator/styles.css',
            '/themes/theme-generator.css',
            '/css/themes.css'
        ];
        let foundCssFile = false;
        for (const cssFile of cssFiles) {
            const response = await page.request.get(cssFile);
            if (response.status() === 200) {
                foundCssFile = true;
                // Verify it's CSS
                const contentType = response.headers()['content-type'];
                (0, test_1.expect)(contentType).toContain('text/css');
                break;
            }
        }
        // Check for organized JavaScript files
        const jsFiles = [
            '/themes/generator/script.js',
            '/themes/theme-generator.js',
            '/js/theme-generator.js'
        ];
        let foundJsFile = false;
        for (const jsFile of jsFiles) {
            const response = await page.request.get(jsFile);
            if (response.status() === 200) {
                foundJsFile = true;
                // Verify it's JavaScript
                const contentType = response.headers()['content-type'];
                (0, test_1.expect)(contentType).toMatch(/application\/javascript|text\/javascript/);
                break;
            }
        }
        // At least one organized structure should exist
        (0, test_1.expect)(foundCssFile || foundJsFile, 'Should have organized theme files').toBe(true);
    });
    (0, test_1.test)('should not have duplicate theme files', async ({ page }) => {
        // Check for potential duplicate files
        const potentialDuplicates = [
            ['/themes/theme-generator.html', '/themes/generator/index.html'],
            ['/themes/theme-generator.js', '/themes/generator/script.js'],
            ['/themes/theme-generator.css', '/themes/generator/styles.css']
        ];
        for (const [file1, file2] of potentialDuplicates) {
            const response1 = await page.request.get(file1);
            const response2 = await page.request.get(file2);
            // Both files should not exist simultaneously (avoid duplication)
            if (response1.status() === 200 && response2.status() === 200) {
                // If both exist, they should serve different purposes
                // (e.g., one is a redirect, other is the actual content)
                const content1 = await response1.text();
                const content2 = await response2.text();
                // Check if one is a redirect
                const isRedirect = content1.includes('http-equiv="refresh"') ||
                    content2.includes('http-equiv="refresh"');
                (0, test_1.expect)(isRedirect, `${file1} and ${file2} should not be identical duplicates`).toBe(true);
            }
        }
    });
    (0, test_1.test)('should have proper meta tags and SEO structure', async ({ page }) => {
        const themePages = [
            '/themes/theme-generator.html',
            '/themes/generator/index.html'
        ];
        for (const themePage of themePages) {
            const response = await page.request.get(themePage);
            if (response.status() === 200) {
                await page.goto(themePage);
                await page.waitForLoadState('networkidle');
                // Check for proper HTML structure
                const pageStructure = await page.evaluate(() => {
                    return {
                        hasTitle: !!document.title && document.title.length > 0,
                        hasMetaDescription: !!document.querySelector('meta[name="description"]'),
                        hasMetaViewport: !!document.querySelector('meta[name="viewport"]'),
                        hasDoctype: document.doctype !== null,
                        hasLang: !!document.documentElement.lang
                    };
                });
                (0, test_1.expect)(pageStructure.hasTitle, 'Should have page title').toBe(true);
                (0, test_1.expect)(pageStructure.hasDoctype, 'Should have DOCTYPE').toBe(true);
                (0, test_1.expect)(pageStructure.hasMetaViewport, 'Should have viewport meta tag').toBe(true);
                break; // Only test the first accessible page
            }
        }
    });
    (0, test_1.test)('should have consistent file naming conventions', async ({ page }) => {
        // Test that theme-related files follow consistent naming
        const themeFilePatterns = [
            { pattern: 'theme-generator', description: 'theme generator files' },
            { pattern: 'hsl-color', description: 'HSL color files' },
            { pattern: 'hue-color', description: 'hue color files' }
        ];
        for (const { pattern, description } of themeFilePatterns) {
            const htmlFile = `/themes/${pattern}.html`;
            const response = await page.request.get(htmlFile);
            if (response.status() === 200) {
                // If HTML file exists, check for corresponding CSS/JS files
                const cssFile = `/themes/${pattern}.css`;
                const jsFile = `/themes/${pattern}.js`;
                const cssResponse = await page.request.get(cssFile);
                const jsResponse = await page.request.get(jsFile);
                // Files don't have to exist, but if they do, they should be properly named
                if (cssResponse.status() === 200) {
                    const contentType = cssResponse.headers()['content-type'];
                    (0, test_1.expect)(contentType, `${cssFile} should have correct MIME type`).toContain('text/css');
                }
                if (jsResponse.status() === 200) {
                    const contentType = jsResponse.headers()['content-type'];
                    (0, test_1.expect)(contentType, `${jsFile} should have correct MIME type`).toMatch(/application\/javascript|text\/javascript/);
                }
            }
        }
    });
});
//# sourceMappingURL=themeGeneratorFileStructure.spec.js.map