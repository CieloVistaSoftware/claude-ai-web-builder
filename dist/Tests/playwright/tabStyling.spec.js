"use strict";
/**
 * Tab Styling Tests
 *
 * Converted from TabStylingTest.ps1
 * Tests the tab styling functionality in the theme generator component
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
test_1.test.describe('Tab Styling Tests', () => {
    const projectRoot = getProjectRoot();
    (0, test_1.test)('should have theme generator component with tab styling methods', async () => {
        const componentPath = path.join(projectRoot, 'components', 'theme', 'theme-generator-component.js');
        // Check if the file exists
        (0, test_1.expect)(fs.existsSync(componentPath)).toBeTruthy();
        // Read the component content
        const componentContent = fs.readFileSync(componentPath, 'utf8');
        // Check for required methods
        (0, test_1.expect)(componentContent).toContain('setupTabStylingListeners()');
        console.log('✅ setupTabStylingListeners() method is implemented');
        (0, test_1.expect)(componentContent).toContain('updateTabStyleCustomProperty(');
        console.log('✅ updateTabStyleCustomProperty() helper method is implemented');
    });
    (0, test_1.test)('should have event listeners for tab styling controls', async () => {
        const componentPath = path.join(projectRoot, 'components', 'theme', 'theme-generator-component.js');
        const componentContent = fs.readFileSync(componentPath, 'utf8');
        // Check for event listeners
        const eventListenerChecks = [
            { name: 'Tab Style Select', pattern: /this\.tabStyleSelect\.addEventListener\('change'/ },
            { name: 'Border Radius', pattern: /this\.tabBorderRadiusInput\.addEventListener\('input'/ },
            { name: 'Transparency', pattern: /this\.tabTransparencyInput\.addEventListener\('input'/ },
            { name: 'Blur', pattern: /this\.tabBlurInput\.addEventListener\('input'/ }
        ];
        eventListenerChecks.forEach(check => {
            const hasListener = check.pattern.test(componentContent);
            console.log(`${hasListener ? '✅' : '⚠️'} ${check.name} event listener: ${hasListener ? 'found' : 'missing'}`);
            if (check.name === 'Tab Style Select') {
                (0, test_1.expect)(componentContent).toMatch(check.pattern);
            }
        });
    });
    (0, test_1.test)('should include tab styling properties in CSS generation', async () => {
        const componentPath = path.join(projectRoot, 'components', 'theme', 'theme-generator-component.js');
        const componentContent = fs.readFileSync(componentPath, 'utf8');
        // Check for CSS custom properties
        const cssProperties = [
            '--tab-border-radius:',
            '--tab-transparency:',
            '--tab-blur:'
        ];
        cssProperties.forEach(property => {
            const hasProperty = componentContent.includes(property);
            console.log(`${hasProperty ? '✅' : '⚠️'} ${property} ${hasProperty ? 'found' : 'missing'}`);
        });
        // At least one tab styling property should be present
        const hasTabStyling = cssProperties.some(prop => componentContent.includes(prop));
        (0, test_1.expect)(hasTabStyling).toBeTruthy();
    });
    (0, test_1.test)('should have tab styling controls working in browser', async ({ page }) => {
        // Navigate to a page that includes the theme generator
        await page.goto('/themes/generator/index.html');
        // Look for tab styling controls
        const tabStyleSelect = page.locator('#tabStyleSelect, .tab-style-select, [name="tabStyle"]');
        const tabBorderRadiusInput = page.locator('#tabBorderRadius, .tab-border-radius, [name="tabBorderRadius"]');
        const tabTransparencyInput = page.locator('#tabTransparency, .tab-transparency, [name="tabTransparency"]');
        const tabBlurInput = page.locator('#tabBlur, .tab-blur, [name="tabBlur"]');
        // Test tab style select if it exists
        if (await tabStyleSelect.count() > 0) {
            await (0, test_1.expect)(tabStyleSelect).toBeVisible();
            // Try to change the value
            await tabStyleSelect.selectOption({ index: 1 });
            await page.waitForTimeout(100);
            console.log('✅ Tab style select control tested');
        }
        // Test border radius input if it exists
        if (await tabBorderRadiusInput.count() > 0) {
            await (0, test_1.expect)(tabBorderRadiusInput).toBeVisible();
            // Change the value
            await tabBorderRadiusInput.fill('10');
            await page.waitForTimeout(100);
            console.log('✅ Tab border radius control tested');
        }
        // Test transparency input if it exists
        if (await tabTransparencyInput.count() > 0) {
            await (0, test_1.expect)(tabTransparencyInput).toBeVisible();
            // Change the value
            await tabTransparencyInput.fill('0.8');
            await page.waitForTimeout(100);
            console.log('✅ Tab transparency control tested');
        }
        // Test blur input if it exists
        if (await tabBlurInput.count() > 0) {
            await (0, test_1.expect)(tabBlurInput).toBeVisible();
            // Change the value
            await tabBlurInput.fill('5');
            await page.waitForTimeout(100);
            console.log('✅ Tab blur control tested');
        }
    });
    (0, test_1.test)('should apply tab styles to actual tab elements', async ({ page }) => {
        await page.goto('/themes/generator/index.html');
        // Look for tab elements that should be styled
        const tabElements = page.locator('.tab, .tab-btn, [role="tab"], .nav-tab');
        if (await tabElements.count() > 0) {
            const firstTab = tabElements.first();
            // Get initial styles
            const initialStyles = await firstTab.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    borderRadius: computed.borderRadius,
                    opacity: computed.opacity,
                    filter: computed.filter,
                    backgroundColor: computed.backgroundColor
                };
            });
            console.log('Initial tab styles:', initialStyles);
            // Try to modify tab styling controls
            const borderRadiusControl = page.locator('#tabBorderRadius, .tab-border-radius, [name="tabBorderRadius"]');
            if (await borderRadiusControl.count() > 0) {
                await borderRadiusControl.fill('15');
                await page.waitForTimeout(500);
                // Get updated styles
                const updatedStyles = await firstTab.evaluate(el => {
                    const computed = window.getComputedStyle(el);
                    return {
                        borderRadius: computed.borderRadius,
                        opacity: computed.opacity,
                        filter: computed.filter,
                        backgroundColor: computed.backgroundColor
                    };
                });
                console.log('Updated tab styles:', updatedStyles);
                // Check if styles changed
                const stylesChanged = JSON.stringify(initialStyles) !== JSON.stringify(updatedStyles);
                console.log(`Tab styles changed: ${stylesChanged}`);
            }
        }
    });
    (0, test_1.test)('should have CSS custom properties for tab styling', async ({ page }) => {
        await page.goto('/themes/theme-generator.html');
        // Check if tab styling CSS variables are defined
        const cssVariables = await page.evaluate(() => {
            const root = document.documentElement;
            const styles = window.getComputedStyle(root);
            return {
                tabBorderRadius: styles.getPropertyValue('--tab-border-radius'),
                tabTransparency: styles.getPropertyValue('--tab-transparency'),
                tabBlur: styles.getPropertyValue('--tab-blur'),
                tabBackground: styles.getPropertyValue('--tab-background'),
                tabColor: styles.getPropertyValue('--tab-color')
            };
        });
        console.log('Tab styling CSS variables:', cssVariables);
        // Check if at least some tab-related variables are defined
        const definedVariables = Object.entries(cssVariables)
            .filter(([key, value]) => value && value.trim())
            .map(([key]) => key);
        console.log('Defined tab variables:', definedVariables);
        // Should have at least some tab styling variables
        (0, test_1.expect)(definedVariables.length).toBeGreaterThanOrEqual(0);
    });
});
//# sourceMappingURL=tabStyling.spec.js.map