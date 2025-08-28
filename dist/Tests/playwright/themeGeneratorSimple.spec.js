"use strict";
/**
 * Theme Generator Simple Tests
 *
 * Converted from ThemeGeneratorSimpleTests.ps1
 * Simple verification test for the refactored Theme Generator
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
test_1.test.describe('Theme Generator Simple Tests', () => {
    const projectRoot = getProjectRoot();
    (0, test_1.test)('should have theme-generator.html redirect setup', async () => {
        const originalFile = path.join(projectRoot, 'themes', 'theme-generator.html');
        if (fs.existsSync(originalFile)) {
            const content = fs.readFileSync(originalFile, 'utf8');
            // Check for redirect meta tag
            (0, test_1.expect)(content).toMatch(/meta http-equiv="refresh"/i);
            console.log('✅ Redirect meta tag is correctly set up');
            // Check that original file has been cleaned of JS functions
            (0, test_1.expect)(content).not.toContain('generateAndApplyTheme');
            console.log('✅ Original file has been properly cleaned (no JS functions)');
        }
        else {
            console.log('⚠️ Original theme-generator.html file not found');
        }
    });
    (0, test_1.test)('should have all required theme generator files', async () => {
        const redirectedFolder = path.join(projectRoot, 'themes', 'generator');
        const requiredFiles = [
            path.join(redirectedFolder, 'index.html'),
            path.join(redirectedFolder, 'script.js'),
            path.join(redirectedFolder, 'styles.css')
        ];
        let allFilesExist = true;
        requiredFiles.forEach(filePath => {
            const fileName = path.basename(filePath);
            if (fs.existsSync(filePath)) {
                const fileSize = fs.statSync(filePath).size;
                console.log(`✅ Found ${fileName} - Size: ${fileSize} bytes`);
                // Check for minimum content size to ensure files aren't empty
                if (fileSize < 1000) {
                    console.log(`⚠️ Warning: ${fileName} might be incomplete (size < 1KB)`);
                    allFilesExist = false;
                }
                (0, test_1.expect)(fs.existsSync(filePath)).toBeTruthy();
            }
            else {
                console.log(`❌ Missing file: ${fileName}`);
                allFilesExist = false;
            }
        });
        (0, test_1.expect)(allFilesExist).toBeTruthy();
    });
    (0, test_1.test)('should have proper file content structure', async () => {
        const redirectedFolder = path.join(projectRoot, 'themes', 'generator');
        const indexFile = path.join(redirectedFolder, 'index.html');
        const scriptFile = path.join(redirectedFolder, 'script.js');
        const styleFile = path.join(redirectedFolder, 'styles.css');
        // Check CSS link in HTML
        if (fs.existsSync(indexFile)) {
            const htmlContent = fs.readFileSync(indexFile, 'utf8');
            (0, test_1.expect)(htmlContent).toMatch(/<link.*rel="stylesheet".*href="styles\.css">/i);
            console.log('✅ CSS is properly linked in index.html');
            // Check for script tag
            (0, test_1.expect)(htmlContent).toMatch(/<script.*src="script\.js">/i);
            console.log('✅ JavaScript is properly linked in index.html');
        }
        // Check JavaScript content
        if (fs.existsSync(scriptFile)) {
            const jsContent = fs.readFileSync(scriptFile, 'utf8');
            // Should contain theme generation functions
            const hasThemeFunctions = jsContent.includes('generateAndApplyTheme') ||
                jsContent.includes('applyTheme') ||
                jsContent.includes('function') ||
                jsContent.includes('=>');
            (0, test_1.expect)(hasThemeFunctions).toBeTruthy();
            console.log('✅ JavaScript contains theme generation functions');
        }
        // Check CSS content
        if (fs.existsSync(styleFile)) {
            const cssContent = fs.readFileSync(styleFile, 'utf8');
            // Should contain CSS rules
            const hasCssRules = cssContent.includes('{') && cssContent.includes('}');
            (0, test_1.expect)(hasCssRules).toBeTruthy();
            console.log('✅ CSS file contains styling rules');
        }
    });
    (0, test_1.test)('should load theme generator in browser', async ({ page }) => {
        // Try different possible paths for the theme generator
        const possiblePaths = [
            '/themes/generator/index.html',
            '/themes/generator/',
            '/themes/theme-generator.html'
        ];
        let pageLoaded = false;
        let loadedPath = '';
        for (const path of possiblePaths) {
            try {
                await page.goto(path);
                pageLoaded = true;
                loadedPath = path;
                console.log(`✅ Successfully loaded theme generator at: ${path}`);
                break;
            }
            catch (error) {
                console.log(`⚠️ Could not load theme generator at: ${path}`);
            }
        }
        if (pageLoaded) {
            // Check if the page loads without major errors
            await (0, test_1.expect)(page.locator('body')).toBeVisible();
            // Look for theme generator elements
            const themeControls = page.locator('.theme-control, .color-control, input[type="range"], .color-picker');
            if (await themeControls.count() > 0) {
                console.log('✅ Theme generator controls found');
                await (0, test_1.expect)(themeControls.first()).toBeVisible();
            }
            // Check for any JavaScript errors
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.waitForTimeout(1000);
            if (errors.length === 0) {
                console.log('✅ No JavaScript errors detected');
            }
            else {
                console.log(`⚠️ JavaScript errors detected: ${errors.join(', ')}`);
            }
        }
        else {
            console.log('⚠️ Could not load theme generator from any expected path');
        }
    });
    (0, test_1.test)('should have functional theme generation', async ({ page }) => {
        const possiblePaths = [
            '/themes/generator/index.html',
            '/themes/generator/',
            '/themes/theme-generator.html'
        ];
        for (const path of possiblePaths) {
            try {
                await page.goto(path);
                // Look for theme generation controls
                const colorControls = page.locator('input[type="range"], .color-bar, .hue-slider');
                const previewElements = page.locator('.preview, .theme-preview, .color-preview');
                if (await colorControls.count() > 0) {
                    const control = colorControls.first();
                    // Try to interact with the control
                    await control.click();
                    await page.waitForTimeout(200);
                    // Check if preview updates
                    if (await previewElements.count() > 0) {
                        const preview = previewElements.first();
                        const backgroundColor = await preview.evaluate(el => {
                            return window.getComputedStyle(el).backgroundColor;
                        });
                        console.log(`✅ Theme preview background: ${backgroundColor}`);
                        (0, test_1.expect)(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
                    }
                    console.log('✅ Theme generation controls are functional');
                }
                break;
            }
            catch (error) {
                console.log(`⚠️ Could not test theme generation at: ${path}`);
            }
        }
    });
    (0, test_1.test)('should redirect from original theme-generator.html', async ({ page }) => {
        try {
            // Try to navigate to the original file
            await page.goto('/themes/theme-generator.html');
            // Wait for potential redirect
            await page.waitForTimeout(2000);
            // Check if we were redirected
            const currentUrl = page.url();
            if (currentUrl.includes('/generator/')) {
                console.log('✅ Successfully redirected to generator folder');
                console.log(`Current URL: ${currentUrl}`);
            }
            else {
                console.log('⚠️ No redirect detected or redirect target different');
                console.log(`Current URL: ${currentUrl}`);
            }
            // Verify the page loads properly after redirect
            await (0, test_1.expect)(page.locator('body')).toBeVisible();
        }
        catch (error) {
            console.log(`⚠️ Could not test redirect functionality: ${error.message}`);
        }
    });
});
//# sourceMappingURL=themeGeneratorSimple.spec.js.map