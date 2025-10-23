// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Static Colors Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file:///C:/Users/jwpmi/Downloads/AI/wb/html/Color%20Harmony%20System/article/Professional-Developer-HCS-System.html');
    await page.waitForLoadState('networkidle');
  });

  test('background/foreground/border swatches should change when toggle is unchecked (dynamic)', async ({ page }) => {
    const toggle = page.locator('#static-colors-toggle');
    
    // Ensure toggle is unchecked (dynamic mode)
    await toggle.uncheck();
    
    // Get the computed background color of the swatches
    const bgSwatch = page.locator('.color-card').filter({ hasText: 'Background' }).locator('.color-swatch');
    const fgSwatch = page.locator('.color-card').filter({ hasText: 'Foreground' }).locator('.color-swatch');
    const borderSwatch = page.locator('.color-card').filter({ hasText: 'Border' }).locator('.color-swatch');
    
    const bgColorDynamic = await bgSwatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const fgColorDynamic = await fgSwatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const borderColorDynamic = await borderSwatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    
    console.log('Dynamic mode colors:');
    console.log('  Background:', bgColorDynamic);
    console.log('  Foreground:', fgColorDynamic);
    console.log('  Border:', borderColorDynamic);
    
    // Switch to static mode
    await toggle.check();
    await page.waitForTimeout(500); // Wait for CSS transition
    
    const bgColorStatic = await bgSwatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const fgColorStatic = await fgSwatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const borderColorStatic = await borderSwatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    
    console.log('Static mode colors:');
    console.log('  Background:', bgColorStatic);
    console.log('  Foreground:', fgColorStatic);
    console.log('  Border:', borderColorStatic);
    
    // Static colors should be: #1a1f2e, #e2e8f0, #4a5568
    expect(bgColorStatic, 'Background should be #1a1f2e in static mode').toBe('rgb(26, 31, 46)');
    expect(fgColorStatic, 'Foreground should be #e2e8f0 in static mode').toBe('rgb(226, 232, 240)');
    expect(borderColorStatic, 'Border should be #4a5568 in static mode').toBe('rgb(74, 85, 104)');
  });

  test('static colors should NOT change when switching themes', async ({ page }) => {
    const toggle = page.locator('#static-colors-toggle');
    
    // Enable static mode
    await toggle.check();
    await page.waitForTimeout(500);
    
    const bgSwatch = page.locator('.color-card').filter({ hasText: 'Background' }).locator('.color-swatch');
    
    // Get color in static mode with default theme
    const colorBeforeThemeChange = await bgSwatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    
    console.log('Static color before theme change:', colorBeforeThemeChange);
    
    // Click a different theme button
    await page.locator('button.nav-btn[data-theme="ocean"]').click();
    await page.waitForTimeout(500);
    
    const colorAfterThemeChange = await bgSwatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    
    console.log('Static color after theme change:', colorAfterThemeChange);
    
    // Colors should be IDENTICAL - static mode prevents theme changes
    expect(colorAfterThemeChange, 'Static colors should not change when theme changes').toBe(colorBeforeThemeChange);
  });

  test('dynamic colors SHOULD change when switching themes', async ({ page }) => {
    const toggle = page.locator('#static-colors-toggle');
    
    // Ensure dynamic mode (unchecked)
    await toggle.uncheck();
    await page.waitForTimeout(500);
    
    const bgSwatch = page.locator('.color-card').filter({ hasText: 'Background' }).locator('.color-swatch');
    
    // Get color with default theme
    const colorWithDefaultTheme = await bgSwatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    
    console.log('Dynamic color with default theme:', colorWithDefaultTheme);
    
    // Click a different theme button
    await page.locator('button.nav-btn[data-theme="ocean"]').click();
    await page.waitForTimeout(500);
    
    const colorWithOceanTheme = await bgSwatch.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    
    console.log('Dynamic color with ocean theme:', colorWithOceanTheme);
    
    // Colors should be DIFFERENT - dynamic mode allows theme changes
    expect(colorWithOceanTheme, 'Dynamic colors should change when theme changes').not.toBe(colorWithDefaultTheme);
  });
});
