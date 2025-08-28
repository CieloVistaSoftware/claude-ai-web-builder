"use strict";
/**
 * Table Theme Implementation Tests
 *
 * Converted from TableThemeImplementation.Tests.ps1
 * This test checks:
 *   - The table.html component with dark mode styling
 *   - The table.json data integration
 *   - The table-theme-component.js implementation
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
    // Get the absolute path to the test file directory (Tests/playwright)
    const testDir = path.resolve(__dirname);
    // Go up one directory to get the Tests directory
    const testsDir = path.dirname(testDir);
    // Go up one more directory to get the project root
    return path.dirname(testsDir);
}
test_1.test.describe('Table Theme Implementation Tests', () => {
    const projectRoot = getProjectRoot();
    (0, test_1.test)('should have table.html with dark mode styling', async () => {
        const tableHtmlPath = path.join(projectRoot, 'components', 'table', 'table.html');
        // Check if the file exists
        (0, test_1.expect)(fs.existsSync(tableHtmlPath)).toBeTruthy();
        // Read the content of the file
        const tableContent = fs.readFileSync(tableHtmlPath, 'utf8');
        // Check for dark mode CSS variables
        (0, test_1.expect)(tableContent).toContain('--bg-color: #121212');
        (0, test_1.expect)(tableContent).toContain('--text-color: #f0f0f0');
        // Check for table.json integration
        (0, test_1.expect)(tableContent).toContain('table.json');
        (0, test_1.expect)(tableContent).toContain('loadTableData');
    });
    (0, test_1.test)('should have table.json with sample data', async () => {
        const tableJsonPath = path.join(projectRoot, 'components', 'table', 'table.json');
        // Check if the file exists
        (0, test_1.expect)(fs.existsSync(tableJsonPath)).toBeTruthy();
        // Read and parse JSON content
        const jsonContent = JSON.parse(fs.readFileSync(tableJsonPath, 'utf8'));
        // Check for employee data
        (0, test_1.expect)(jsonContent.employees).toBeDefined();
        (0, test_1.expect)(jsonContent.employees.length).toBeGreaterThan(0);
        // Check for product data
        (0, test_1.expect)(jsonContent.products).toBeDefined();
        (0, test_1.expect)(jsonContent.products.length).toBeGreaterThan(0);
        // Check for transaction data
        (0, test_1.expect)(jsonContent.transactions).toBeDefined();
        (0, test_1.expect)(jsonContent.transactions.length).toBeGreaterThan(0);
    });
    (0, test_1.test)('should have table-theme-component.js implementation', async () => {
        const tableThemeComponentPath = path.join(projectRoot, 'components', 'theme', 'table-theme-component.js');
        // Check if the file exists
        (0, test_1.expect)(fs.existsSync(tableThemeComponentPath)).toBeTruthy();
        // Read the content of the file
        const componentContent = fs.readFileSync(tableThemeComponentPath, 'utf8');
        // Check for theme functionality
        (0, test_1.expect)(componentContent).toContain('class TableThemeComponent');
        (0, test_1.expect)(componentContent).toContain('applyBaseThemeToComponent');
        // Check for dark mode related code
        (0, test_1.expect)(componentContent).toContain('isDark');
    });
    (0, test_1.test)('should have table component working in browser', async ({ page }) => {
        // Navigate to the table component
        await page.goto('/components/table/table.html');
        // Check if the page loaded
        await (0, test_1.expect)(page.locator('table').first()).toBeVisible();
        // Check for table headers
        const tableHeaders = await page.locator('th');
        (0, test_1.expect)(await tableHeaders.count()).toBeGreaterThan(0);
        // Check for table rows (data loaded)
        const tableRows = await page.locator('tbody tr');
        (0, test_1.expect)(await tableRows.count()).toBeGreaterThan(0);
        // Test dark mode toggle if it exists
        const darkModeToggle = await page.locator('#darkModeToggle').count();
        if (darkModeToggle > 0) {
            // Click the dark mode toggle
            await page.locator('#darkModeToggle').click();
            // Wait for the style changes to apply
            await page.waitForTimeout(100);
            // Check if dark mode styling was applied
            const bodyBackgroundColor = await page.evaluate(() => {
                return window.getComputedStyle(document.body).backgroundColor;
            });
            // Expect dark background color (could be in various formats)
            (0, test_1.expect)(bodyBackgroundColor).toMatch(/(rgb\(18,\s?18,\s?18\)|#121212|rgba\(18,\s?18,\s?18,\s?1\))/);
        }
    });
});
//# sourceMappingURL=tableTheme.spec.js.map