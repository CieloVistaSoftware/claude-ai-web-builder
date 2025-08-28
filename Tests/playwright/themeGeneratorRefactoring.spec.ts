import { test, expect } from '@playwright/test';

/**
 * Theme Generator Refactoring Tests
 * 
 * Tests for the refactored theme generator functionality.
 * Converted from ThemeGeneratorRefactoringTests.ps1
 */

test.describe('Theme Generator Refactoring Tests', () => {
  test.setTimeout(30000);

  test('should have proper redirect setup from main theme-generator.html', async ({ page }) => {
    // Navigate to the original theme-generator.html
    await page.goto('/themes/theme-generator.html');
    
    // Wait for redirect to complete
    await page.waitForURL(/.*\/themes\/generator\/index\.html/);
    
    // Verify we're on the correct page
    expect(page.url()).toContain('/themes/generator/index.html');
  });

  test('should load all required theme generator files', async ({ page }) => {
    await page.goto('/themes/generator/index.html');
    await page.waitForLoadState('networkidle');

    // Check that CSS is loaded
    const cssLink = await page.locator('link[rel="stylesheet"][href="styles.css"]');
    await expect(cssLink).toBeAttached();

    // Check that JavaScript is loaded
    const jsScript = await page.locator('script[src="script.js"]');
    await expect(jsScript).toBeAttached();

    // Verify no 404 errors for resources
    const response = await page.request.get('/themes/generator/styles.css');
    expect(response.status()).toBe(200);

    const jsResponse = await page.request.get('/themes/generator/script.js');
    expect(jsResponse.status()).toBe(200);
  });

  test('should have all required HTML elements', async ({ page }) => {
    await page.goto('/themes/generator/index.html');
    await page.waitForLoadState('networkidle');

    // Check for key form elements
    await expect(page.locator('#themeName')).toBeVisible();
    await expect(page.locator('#colorScheme')).toBeVisible();
    await expect(page.locator('#primaryHue')).toBeVisible();
    await expect(page.locator('#isDark')).toBeVisible();

    // Check for preview elements
    await expect(page.locator('#lightPreview')).toBeVisible();
    await expect(page.locator('#darkPreview')).toBeVisible();
    await expect(page.locator('#semanticDemo')).toBeVisible();
  });

  test('should have working JavaScript functions', async ({ page }) => {
    await page.goto('/themes/generator/index.html');
    await page.waitForLoadState('networkidle');    // Test that key functions are defined
    const functionsExist = await page.evaluate(() => {
      return {
        generateAndApplyTheme: typeof (window as any).generateAndApplyTheme === 'function',
        updatePreview: typeof (window as any).updatePreview === 'function',
        generateTheme: typeof (window as any).generateTheme === 'function',
        applyTheme: typeof (window as any).applyTheme === 'function',
        downloadTheme: typeof (window as any).downloadTheme === 'function'
      };
    });

    expect(functionsExist.generateAndApplyTheme).toBe(true);
    expect(functionsExist.updatePreview).toBe(true);
    expect(functionsExist.generateTheme).toBe(true);
    expect(functionsExist.applyTheme).toBe(true);
    expect(functionsExist.downloadTheme).toBe(true);
  });

  test('should generate theme when form is submitted', async ({ page }) => {
    await page.goto('/themes/generator/index.html');
    await page.waitForLoadState('networkidle');

    // Fill out the form
    await page.fill('#themeName', 'Test Theme');
    await page.selectOption('#colorScheme', 'blue');
    await page.fill('#primaryHue', '220');

    // Submit the form
    const generateButton = await page.locator('button:has-text("Generate Theme")');
    await generateButton.click();

    // Wait for theme generation
    await page.waitForTimeout(1000);

    // Check that preview is updated
    const lightPreview = await page.locator('#lightPreview');
    const darkPreview = await page.locator('#darkPreview');
    
    await expect(lightPreview).toBeVisible();
    await expect(darkPreview).toBeVisible();

    // Verify that CSS variables are applied
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      return {
        primaryColor: computedStyle.getPropertyValue('--primary-color'),
        accentColor: computedStyle.getPropertyValue('--accent-color')
      };
    });

    expect(rootStyles.primaryColor).toBeTruthy();
    expect(rootStyles.accentColor).toBeTruthy();
  });

  test('should handle theme download functionality', async ({ page }) => {
    await page.goto('/themes/generator/index.html');
    await page.waitForLoadState('networkidle');

    // Fill out the form
    await page.fill('#themeName', 'Download Test Theme');
    await page.selectOption('#colorScheme', 'green');

    // Generate theme first
    const generateButton = await page.locator('button:has-text("Generate Theme")');
    await generateButton.click();
    await page.waitForTimeout(1000);

    // Set up download promise
    const downloadPromise = page.waitForEvent('download');

    // Click download button
    const downloadButton = await page.locator('button:has-text("Download Theme")');
    await downloadButton.click();

    // Wait for download to start
    const download = await downloadPromise;
    
    // Verify download properties
    expect(download.suggestedFilename()).toContain('.css');
    expect(download.suggestedFilename()).toContain('theme');
  });

  test('should update preview when hue slider changes', async ({ page }) => {
    await page.goto('/themes/generator/index.html');
    await page.waitForLoadState('networkidle');

    const hueSlider = page.locator('#primaryHue');
    await expect(hueSlider).toBeVisible();

    // Get initial preview state
    const initialPreview = await page.locator('#lightPreview').innerHTML();

    // Change hue value
    await hueSlider.fill('180');
    await page.waitForTimeout(500);

    // Get updated preview state
    const updatedPreview = await page.locator('#lightPreview').innerHTML();

    // Verify that preview has changed
    expect(updatedPreview).not.toBe(initialPreview);
  });

  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('/themes/generator/index.html');
    await page.waitForLoadState('networkidle');

    const darkModeToggle = page.locator('#isDark');
    await expect(darkModeToggle).toBeVisible();

    // Test dark mode toggle
    await darkModeToggle.check();
    await page.waitForTimeout(500);

    // Verify dark mode is applied
    const isDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark-mode') ||
             document.body.classList.contains('dark-mode');
    });

    expect(isDarkMode).toBe(true);

    // Test light mode toggle
    await darkModeToggle.uncheck();
    await page.waitForTimeout(500);

    // Verify light mode is restored
    const isLightMode = await page.evaluate(() => {
      return !document.documentElement.classList.contains('dark-mode') &&
             !document.body.classList.contains('dark-mode');
    });

    expect(isLightMode).toBe(true);
  });
});
