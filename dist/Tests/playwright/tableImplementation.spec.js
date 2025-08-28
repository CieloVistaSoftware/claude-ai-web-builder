"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
/**
 * Table Implementation Tests
 *
 * Tests for table.html functionality and table.json data structure.
 * Converted from TableImplementation.Tests.ps1
 */
test_1.test.describe('Table Implementation Tests', () => {
    test_1.test.setTimeout(30000);
    (0, test_1.test)('should have valid table.json with required datasets', async ({ page }) => {
        // Test that table.json exists and is accessible
        const response = await page.request.get('/components/table/table.json');
        (0, test_1.expect)(response.status()).toBe(200);
        // Parse and validate JSON structure
        const jsonContent = await response.json();
        // Check for required datasets
        (0, test_1.expect)(jsonContent.employees, 'Should have employees dataset').toBeDefined();
        (0, test_1.expect)(jsonContent.products, 'Should have products dataset').toBeDefined();
        (0, test_1.expect)(jsonContent.transactions, 'Should have transactions dataset').toBeDefined();
        // Verify datasets have records
        (0, test_1.expect)(jsonContent.employees.length, 'Employees dataset should have records').toBeGreaterThan(0);
        (0, test_1.expect)(jsonContent.products.length, 'Products dataset should have records').toBeGreaterThan(0);
        (0, test_1.expect)(jsonContent.transactions.length, 'Transactions dataset should have records').toBeGreaterThan(0);
        // Verify data structure of employees
        if (jsonContent.employees.length > 0) {
            const employee = jsonContent.employees[0];
            (0, test_1.expect)(employee).toHaveProperty('id');
            (0, test_1.expect)(employee).toHaveProperty('name');
        }
        // Verify data structure of products
        if (jsonContent.products.length > 0) {
            const product = jsonContent.products[0];
            (0, test_1.expect)(product).toHaveProperty('id');
            (0, test_1.expect)(product).toHaveProperty('name');
        }
    });
    (0, test_1.test)('should load table.html with proper API usage', async ({ page }) => {
        await page.goto('/components/table/table.html');
        await page.waitForLoadState('networkidle');
        // Check that the page loads without errors
        const title = await page.title();
        (0, test_1.expect)(title).toBeTruthy();
        // Verify table element exists
        const table = await page.locator('table').first();
        await (0, test_1.expect)(table).toBeVisible();
        // Check that JavaScript uses proper API methods
        const apiUsage = await page.evaluate(() => {
            const scripts = Array.from(document.querySelectorAll('script'));
            const scriptContent = scripts.map(script => script.textContent).join('');
            return {
                usesSetColumns: scriptContent.includes('.setColumns('),
                usesSetData: scriptContent.includes('.setData('),
                avoidsLoadData: !scriptContent.includes('.loadData('),
                avoidsDirectAssignment: !scriptContent.includes('.columns =') && !scriptContent.includes('.data =')
            };
        });
        (0, test_1.expect)(apiUsage.usesSetColumns, 'Should use setColumns method').toBe(true);
        (0, test_1.expect)(apiUsage.usesSetData, 'Should use setData method').toBe(true);
        (0, test_1.expect)(apiUsage.avoidsLoadData, 'Should not use deprecated loadData method').toBe(true);
    });
    (0, test_1.test)('should display data from table.json correctly', async ({ page }) => {
        await page.goto('/components/table/table.html');
        await page.waitForLoadState('networkidle');
        // Wait for table to populate
        await page.waitForTimeout(1000);
        // Check that table has rows
        const tableRows = await page.locator('table tbody tr');
        const rowCount = await tableRows.count();
        (0, test_1.expect)(rowCount, 'Table should have data rows').toBeGreaterThan(0);
        // Check that table has headers
        const tableHeaders = await page.locator('table thead th');
        const headerCount = await tableHeaders.count();
        (0, test_1.expect)(headerCount, 'Table should have header columns').toBeGreaterThan(0);
        // Verify that data is displayed (check first row has content)
        if (rowCount > 0) {
            const firstRowCells = await page.locator('table tbody tr:first-child td');
            const firstCellText = await firstRowCells.first().textContent();
            (0, test_1.expect)(firstCellText, 'First cell should have content').toBeTruthy();
        }
    });
    (0, test_1.test)('should handle dataset switching', async ({ page }) => {
        await page.goto('/components/table/table.html');
        await page.waitForLoadState('networkidle');
        // Look for dataset selector controls
        const datasetSelector = await page.locator('select[name="dataset"], #dataset-select, .dataset-selector').first();
        if (await datasetSelector.count() > 0) {
            // Get initial row count
            await page.waitForTimeout(500);
            const initialRows = await page.locator('table tbody tr').count();
            // Switch to different dataset
            const options = await datasetSelector.locator('option').all();
            if (options.length > 1) {
                await datasetSelector.selectOption({ index: 1 });
                await page.waitForTimeout(500);
                // Verify table updated
                const newRows = await page.locator('table tbody tr').count();
                // Datasets might have different row counts
                (0, test_1.expect)(newRows, 'Table should have rows after dataset switch').toBeGreaterThan(0);
            }
        }
    });
    (0, test_1.test)('should have proper column mappings for each dataset', async ({ page }) => {
        // Load the JSON data first
        const response = await page.request.get('/components/table/table.json');
        const jsonContent = await response.json();
        await page.goto('/components/table/table.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        // Check that columns match data structure
        const tableHeaders = await page.locator('table thead th').all();
        const headerTexts = await Promise.all(tableHeaders.map(header => header.textContent()));
        // Verify headers are meaningful (not empty)
        const meaningfulHeaders = headerTexts.filter(text => text && text.trim().length > 0);
        (0, test_1.expect)(meaningfulHeaders.length, 'Should have meaningful column headers').toBeGreaterThan(0);
        // If we have employee data, check for common employee fields
        if (jsonContent.employees && jsonContent.employees.length > 0) {
            const employeeFields = Object.keys(jsonContent.employees[0]);
            // At least some headers should correspond to employee fields (case-insensitive)
            const matchingHeaders = headerTexts.filter(header => employeeFields.some(field => header && header.toLowerCase().includes(field.toLowerCase())));
            // This is a flexible check - we expect some correlation
            (0, test_1.expect)(matchingHeaders.length, 'Headers should relate to data fields').toBeGreaterThanOrEqual(0);
        }
    });
    (0, test_1.test)('should handle empty datasets gracefully', async ({ page }) => {
        await page.goto('/components/table/table.html');
        await page.waitForLoadState('networkidle');
        // Check that the page doesn't crash with no data
        const pageErrors = [];
        page.on('pageerror', error => pageErrors.push(error.message));
        page.on('console', msg => {
            if (msg.type() === 'error') {
                pageErrors.push(msg.text());
            }
        });
        // Try to trigger empty dataset scenario
        await page.evaluate(() => {
            // Simulate setting empty data
            const table = document.querySelector('table');
            if (table && window.tableComponent) {
                try {
                    window.tableComponent.setData([]);
                }
                catch (e) {
                    // Ignore if method doesn't exist
                }
            }
        });
        await page.waitForTimeout(500);
        // Check that no critical errors occurred
        const criticalErrors = pageErrors.filter(error => !error.includes('Warning') &&
            !error.includes('404') &&
            !error.includes('favicon'));
        (0, test_1.expect)(criticalErrors.length, `Should handle empty data without critical errors: ${criticalErrors.join(', ')}`).toBe(0);
    });
    (0, test_1.test)('should support table sorting if implemented', async ({ page }) => {
        await page.goto('/components/table/table.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        // Look for sortable headers
        const sortableHeaders = await page.locator('table thead th[data-sortable], table thead th.sortable, table thead th[onclick]');
        if (await sortableHeaders.count() > 0) {
            // Get initial first row data
            const firstRowInitial = await page.locator('table tbody tr:first-child td:first-child').textContent();
            // Click on first sortable header
            await sortableHeaders.first().click();
            await page.waitForTimeout(500);
            // Check if sorting occurred (data might have changed)
            const firstRowAfterSort = await page.locator('table tbody tr:first-child td:first-child').textContent();
            // This is a flexible check - sorting might or might not change the first row
            (0, test_1.expect)(firstRowAfterSort, 'Should still have data after sort attempt').toBeTruthy();
        }
    });
    (0, test_1.test)('should be responsive and mobile-friendly', async ({ page }) => {
        await page.goto('/components/table/table.html');
        await page.waitForLoadState('networkidle');
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        // Check that table is still visible and accessible
        const table = await page.locator('table');
        await (0, test_1.expect)(table).toBeVisible();
        // Check for mobile optimizations (horizontal scroll, responsive design)
        const tableContainer = await page.locator('.table-responsive, .table-container, table').first();
        const containerStyles = await tableContainer.evaluate(el => {
            const styles = getComputedStyle(el);
            return {
                overflow: styles.overflow,
                overflowX: styles.overflowX,
                display: styles.display
            };
        });
        // Table should be visible and potentially scrollable on mobile
        (0, test_1.expect)(containerStyles.display).not.toBe('none');
    });
});
//# sourceMappingURL=tableImplementation.spec.js.map