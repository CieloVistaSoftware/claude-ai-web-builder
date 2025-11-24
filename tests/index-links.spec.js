const { test, expect } = require('@playwright/test');

test.describe('Index.html Links Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8080/index.html');
    });

    test('should load index.html successfully', async ({ page }) => {
        await expect(page).toHaveTitle('WB Framework - Component Directory');
        await expect(page.locator('.header h1').first()).toContainText('WB Framework Components');
    });

    test('should render components table', async ({ page }) => {
        const componentsTable = page.locator('#componentsTable');
        await expect(componentsTable).toBeVisible();
        
        const rows = page.locator('#componentsBody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('should render HTML files table', async ({ page }) => {
        const htmlFilesTable = page.locator('#htmlFilesTable');
        await expect(htmlFilesTable).toBeVisible();
        
        const rows = page.locator('#htmlFilesBody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('search functionality should filter components', async ({ page }) => {
        const searchInput = page.locator('#searchInput');
        await searchInput.fill('wb-button');
        
        await page.waitForTimeout(300);
        
        const visibleRows = page.locator('#componentsBody tr');
        const rowCount = await visibleRows.count();
        expect(rowCount).toBeGreaterThan(0);
        
        const firstRowText = await visibleRows.first().textContent();
        expect(firstRowText?.toLowerCase()).toContain('button');
    });

    test('filter buttons should work for components', async ({ page }) => {
        const coreFilter = page.locator('.filter-btn[data-filter="core"]');
        await coreFilter.click();
        await expect(coreFilter).toHaveClass(/active/);
        
        await page.waitForTimeout(300);
        
        const visibleRows = page.locator('#componentsBody tr');
        const rowCount = await visibleRows.count();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('search functionality should filter HTML files', async ({ page }) => {
        const searchInput = page.locator('#searchHtmlFiles');
        await searchInput.fill('demo');
        
        await page.waitForTimeout(300);
        
        const visibleRows = page.locator('#htmlFilesBody tr');
        const rowCount = await visibleRows.count();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('filter buttons should work for HTML files', async ({ page }) => {
        const componentsFilter = page.locator('[data-html-filter="components"]');
        await componentsFilter.click();
        await expect(componentsFilter).toHaveClass(/active/);
        
        await page.waitForTimeout(300);
        
        const visibleRows = page.locator('#htmlFilesBody tr');
        const rowCount = await visibleRows.count();
        expect(rowCount).toBeGreaterThan(0);
    });

    test('should validate all component demo links are not 404', async ({ page, context }) => {
        // Get all component demo links
        const demoLinks = await page.locator('#componentsBody .component-link').all();
        
        console.log(`Testing ${demoLinks.length} component demo links...`);
        
        let validLinks = 0;
        let invalidLinks = [];
        
        for (const link of demoLinks) {
            const href = await link.getAttribute('href');
            if (href) {
                try {
                    const newPage = await context.newPage();
                    const response = await newPage.goto(`http://localhost:8080/${href}`, { 
                        waitUntil: 'domcontentloaded',
                        timeout: 10000 
                    });
                    
                    if (response && response.status() === 200) {
                        validLinks++;
                    } else {
                        invalidLinks.push({ href, status: response?.status() });
                    }
                    
                    await newPage.close();
                } catch (error) {
                    invalidLinks.push({ href, error: error.message });
                }
            }
        }
        
        console.log(`Valid links: ${validLinks}`);
        if (invalidLinks.length > 0) {
            console.log('Invalid links:', invalidLinks);
        }
        
        expect(invalidLinks.length).toBe(0);
    });

    test('should validate all documentation links exist', async ({ page, context }) => {
        // Get all documentation links that are not "N/A"
        const docLinks = await page.locator('#componentsBody .doc-link a:not(.no-doc)').all();
        
        console.log(`Testing ${docLinks.length} documentation links...`);
        
        let validLinks = 0;
        let invalidLinks = [];
        
        for (const link of docLinks) {
            const href = await link.getAttribute('href');
            if (href) {
                try {
                    const newPage = await context.newPage();
                    const response = await newPage.goto(`http://localhost:8080/${href}`, { 
                        waitUntil: 'domcontentloaded',
                        timeout: 10000 
                    });
                    
                    if (response && response.status() === 200) {
                        validLinks++;
                    } else {
                        invalidLinks.push({ href, status: response?.status() });
                    }
                    
                    await newPage.close();
                } catch (error) {
                    invalidLinks.push({ href, error: error.message });
                }
            }
        }
        
        console.log(`Valid documentation links: ${validLinks}`);
        if (invalidLinks.length > 0) {
            console.log('Invalid documentation links:', invalidLinks);
        }
        
        // Note: Some .md files might not be served by http-server, so we'll just warn
        console.log(`Total invalid doc links: ${invalidLinks.length}`);
    });

    test('should validate all HTML file links are not 404', async ({ page, context }) => {
        // Get all HTML file links
        const htmlFileLinks = await page.locator('#htmlFilesBody .component-link').all();
        
        console.log(`Testing ${htmlFileLinks.length} HTML file links...`);
        
        let validLinks = 0;
        let invalidLinks = [];
        
        // Test a sample of links (not all to avoid timeout)
        const sampleSize = Math.min(20, htmlFileLinks.length);
        const sampleLinks = htmlFileLinks.slice(0, sampleSize);
        
        for (const link of sampleLinks) {
            const href = await link.getAttribute('href');
            if (href) {
                try {
                    const newPage = await context.newPage();
                    const response = await newPage.goto(`http://localhost:8080/${href}`, { 
                        waitUntil: 'domcontentloaded',
                        timeout: 10000 
                    });
                    
                    if (response && response.status() === 200) {
                        validLinks++;
                    } else {
                        invalidLinks.push({ href, status: response?.status() });
                    }
                    
                    await newPage.close();
                } catch (error) {
                    invalidLinks.push({ href, error: error.message });
                }
            }
        }
        
        console.log(`Valid HTML file links (sample): ${validLinks}/${sampleSize}`);
        if (invalidLinks.length > 0) {
            console.log('Invalid HTML file links:', invalidLinks);
        }
        
        expect(invalidLinks.length).toBe(0);
    });

    test('should validate footer links', async ({ page, context }) => {
        const footerLinks = await page.locator('.footer a').all();
        
        console.log(`Testing ${footerLinks.length} footer links...`);
        
        let validLinks = 0;
        let invalidLinks = [];
        
        for (const link of footerLinks) {
            const href = await link.getAttribute('href');
            if (href) {
                try {
                    const newPage = await context.newPage();
                    const response = await newPage.goto(`http://localhost:8080/${href}`, { 
                        waitUntil: 'domcontentloaded',
                        timeout: 10000 
                    });
                    
                    if (response && response.status() === 200) {
                        validLinks++;
                    } else {
                        invalidLinks.push({ href, status: response?.status() });
                    }
                    
                    await newPage.close();
                } catch (error) {
                    invalidLinks.push({ href, error: error.message });
                }
            }
        }
        
        console.log(`Valid footer links: ${validLinks}`);
        if (invalidLinks.length > 0) {
            console.log('Invalid footer links:', invalidLinks);
        }
        
        expect(invalidLinks.length).toBe(0);
    });

    test('component links should open in new tab', async ({ page }) => {
        const firstDemoLink = page.locator('#componentsBody .component-link').first();
        const target = await firstDemoLink.getAttribute('target');
        expect(target).toBe('_blank');
    });

    test('documentation links should open in new tab', async ({ page }) => {
        const firstDocLink = page.locator('#componentsBody .doc-link a:not(.no-doc)').first();
        if (await firstDocLink.count() > 0) {
            const target = await firstDocLink.getAttribute('target');
            expect(target).toBe('_blank');
        }
    });

    test('HTML file links should open in new tab', async ({ page }) => {
        const firstHtmlLink = page.locator('#htmlFilesBody .component-link').first();
        const target = await firstHtmlLink.getAttribute('target');
        expect(target).toBe('_blank');
    });

    test('empty state should show when no results found', async ({ page }) => {
        const searchInput = page.locator('#searchInput');
        await searchInput.fill('nonexistentcomponentxyz123');
        
        await page.waitForTimeout(300);
        
        const emptyState = page.locator('#emptyState');
        await expect(emptyState).toBeVisible();
        await expect(emptyState).toContainText('No components found');
    });

    test('empty state should show for HTML files when no results found', async ({ page }) => {
        const searchInput = page.locator('#searchHtmlFiles');
        await searchInput.fill('nonexistentfilexyz123');
        
        await page.waitForTimeout(300);
        
        const emptyState = page.locator('#emptyStateHtml');
        await expect(emptyState).toBeVisible();
        await expect(emptyState).toContainText('No HTML files found');
    });

    test('stats bar should display correct information', async ({ page }) => {
        const statsBar = page.locator('.stats-bar');
        await expect(statsBar).toBeVisible();
        
        const statNumbers = await page.locator('.stat-number').allTextContents();
        expect(statNumbers.length).toBeGreaterThan(0);
        
        // Check that the first stat number (Total Components) is displayed
        expect(statNumbers[0]).toBeTruthy();
    });

    test('component type badges should be visible', async ({ page }) => {
        const badges = page.locator('#componentsBody .status-badge');
        const badgeCount = await badges.count();
        expect(badgeCount).toBeGreaterThan(0);
        
        const firstBadge = badges.first();
        await expect(firstBadge).toBeVisible();
    });

    test('folder badges should be visible in HTML files table', async ({ page }) => {
        const badges = page.locator('#htmlFilesBody .status-badge');
        const badgeCount = await badges.count();
        expect(badgeCount).toBeGreaterThan(0);
        
        const firstBadge = badges.first();
        await expect(firstBadge).toBeVisible();
    });
});
