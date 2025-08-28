/**
 * Table Theme Implementation Tests
 * 
 * Converted from TableThemeImplementation.Tests.ps1
 * This test checks:
 *   - The table.html component with dark mode styling
 *   - The table.json data integration
 *   - The table-theme-component.js implementation
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Type declarations for window object extensions
declare global {
  interface Window {
    TableThemeDemo: any;
    colorBarState: {
      hue: number;
      saturation: number;
      lightness: number;
    };
    themeEvents: any[];
  }
}

// Helper function to get project root path
function getProjectRoot() {
  // Get the absolute path to the test file directory (Tests/playwright)
  const testDir = path.resolve(__dirname);
  // Go up one directory to get the Tests directory
  const testsDir = path.dirname(testDir);
  // Go up one more directory to get the project root
  return path.dirname(testsDir);
}

test.describe('Table Theme Implementation Tests', () => {
  const projectRoot = getProjectRoot();
  
  test('should have table.html with dark mode styling', async () => {
    const tableHtmlPath = path.join(projectRoot, 'components', 'table', 'table.html');
    
    // Check if the file exists
    expect(fs.existsSync(tableHtmlPath)).toBeTruthy();
    
    // Read the content of the file
    const tableContent = fs.readFileSync(tableHtmlPath, 'utf8');
    
    // Check for dark mode CSS variables
    expect(tableContent).toContain('--bg-color: #121212');
    expect(tableContent).toContain('--text-color: #f0f0f0');
    
    // Check for table.json integration
    expect(tableContent).toContain('table.json');
    expect(tableContent).toContain('loadTableData');
  });
  
  test('should have table.json with sample data', async () => {
    const tableJsonPath = path.join(projectRoot, 'components', 'table', 'table.json');
    
    // Check if the file exists
    expect(fs.existsSync(tableJsonPath)).toBeTruthy();
    
    // Read and parse JSON content
    const jsonContent = JSON.parse(fs.readFileSync(tableJsonPath, 'utf8'));
    
    // Check for employee data
    expect(jsonContent.employees).toBeDefined();
    expect(jsonContent.employees.length).toBeGreaterThan(0);
    
    // Check for product data
    expect(jsonContent.products).toBeDefined();
    expect(jsonContent.products.length).toBeGreaterThan(0);
    
    // Check for transaction data
    expect(jsonContent.transactions).toBeDefined();
    expect(jsonContent.transactions.length).toBeGreaterThan(0);
  });
  
  test('should have table-theme-component.js implementation', async () => {
    const tableThemeComponentPath = path.join(projectRoot, 'components', 'theme', 'table-theme-component.js');
    
    // Check if the file exists
    expect(fs.existsSync(tableThemeComponentPath)).toBeTruthy();
    
    // Read the content of the file
    const componentContent = fs.readFileSync(tableThemeComponentPath, 'utf8');
      // Check for theme functionality
    expect(componentContent).toContain('class TableThemeComponent');
    expect(componentContent).toContain('applyBaseThemeToComponent');
    
    // Check for dark mode related code
    expect(componentContent).toContain('isDark');
  });
    test('should have table component working in browser', async ({ page }) => {
    // Navigate to the table component
    await page.goto('/components/table/table.html');
    
    // Check if the page loaded
    await expect(page.locator('table').first()).toBeVisible();
    
    // Check for table headers
    const tableHeaders = await page.locator('th');
    expect(await tableHeaders.count()).toBeGreaterThan(0);
    
    // Check for table rows (data loaded)
    const tableRows = await page.locator('tbody tr');
    expect(await tableRows.count()).toBeGreaterThan(0);
    
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
      expect(bodyBackgroundColor).toMatch(/(rgb\(18,\s?18,\s?18\)|#121212|rgba\(18,\s?18,\s?18,\s?1\))/);
    }
  });
});

// New comprehensive slider functionality tests
test.describe('Table Theme Sliders Functionality Tests', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the table theme component
    await page.goto('/components/table/table-theme.html');
    await page.waitForLoadState('networkidle');
    
    // Wait for the page to be fully loaded and interactive
    await page.waitForFunction(() => {
      return document.readyState === 'complete' && 
             window.TableThemeDemo && 
             document.querySelector('#color-bar');
    });
  });

  test('should have all required slider elements visible', async ({ page }) => {
    // Check that all three sliders are present and visible
    const hueSlider = page.locator('#color-bar');
    const saturationSlider = page.locator('#saturation-slider');
    const lightnessSlider = page.locator('#lightness-slider');
    
    await expect(hueSlider).toBeVisible();
    await expect(saturationSlider).toBeVisible();
    await expect(lightnessSlider).toBeVisible();
    
    // Verify slider attributes
    await expect(hueSlider).toHaveAttribute('type', 'range');
    await expect(hueSlider).toHaveAttribute('min', '0');
    await expect(hueSlider).toHaveAttribute('max', '360');
    
    await expect(saturationSlider).toHaveAttribute('type', 'range');
    await expect(saturationSlider).toHaveAttribute('min', '0');
    await expect(saturationSlider).toHaveAttribute('max', '100');
    
    await expect(lightnessSlider).toHaveAttribute('type', 'range');
    await expect(lightnessSlider).toHaveAttribute('min', '10');
    await expect(lightnessSlider).toHaveAttribute('max', '90');
  });

  test('should have working value display elements', async ({ page }) => {
    // Check that value display elements exist
    const hueValue = page.locator('#color-bar-value');
    const saturationValue = page.locator('#saturation-value');
    const lightnessValue = page.locator('#lightness-value');
    
    await expect(hueValue).toBeVisible();
    await expect(saturationValue).toBeVisible();
    await expect(lightnessValue).toBeVisible();
    
    // Verify initial values are displayed
    await expect(hueValue).toContainText(/\d+/);
    await expect(saturationValue).toContainText(/\d+/);
    await expect(lightnessValue).toContainText(/\d+/);
  });

  test('should update hue slider value and display', async ({ page }) => {
    const hueSlider = page.locator('#color-bar');
    const hueValue = page.locator('#color-bar-value');
    
    // Test different hue values
    const testValues = [0, 90, 180, 270, 360];
    
    for (const value of testValues) {
      await hueSlider.fill(value.toString());
      await page.waitForTimeout(100); // Allow for DOM updates
      
      // Verify the display updates
      await expect(hueValue).toContainText(value.toString());
      
      // Verify global state is updated
      const stateValue = await page.evaluate(() => window.colorBarState?.hue);
      expect(stateValue).toBe(value);
    }
  });

  test('should update saturation slider value and display', async ({ page }) => {
    const saturationSlider = page.locator('#saturation-slider');
    const saturationValue = page.locator('#saturation-value');
    
    // Test different saturation values
    const testValues = [0, 25, 50, 75, 100];
    
    for (const value of testValues) {
      await saturationSlider.fill(value.toString());
      await page.waitForTimeout(100); // Allow for DOM updates
      
      // Verify the display updates
      await expect(saturationValue).toContainText(value.toString());
      
      // Verify global state is updated
      const stateValue = await page.evaluate(() => window.colorBarState?.saturation);
      expect(stateValue).toBe(value);
    }
  });

  test('should update lightness slider value and display', async ({ page }) => {
    const lightnessSlider = page.locator('#lightness-slider');
    const lightnessValue = page.locator('#lightness-value');
    
    // Test different lightness values
    const testValues = [10, 30, 50, 70, 90];
    
    for (const value of testValues) {
      await lightnessSlider.fill(value.toString());
      await page.waitForTimeout(100); // Allow for DOM updates
      
      // Verify the display updates
      await expect(lightnessValue).toContainText(value.toString());
      
      // Verify global state is updated
      const stateValue = await page.evaluate(() => window.colorBarState?.lightness);
      expect(stateValue).toBe(value);
    }
  });

  test('should update CSS custom properties when sliders change', async ({ page }) => {
    const hueSlider = page.locator('#color-bar');
    const saturationSlider = page.locator('#saturation-slider');
    const lightnessSlider = page.locator('#lightness-slider');
    
    // Set specific values
    await hueSlider.fill('120');
    await saturationSlider.fill('60');
    await lightnessSlider.fill('40');
    
    await page.waitForTimeout(200); // Allow for updates
    
    // Check that CSS custom properties are updated
    const cssValues = await page.evaluate(() => {
      const rootStyle = getComputedStyle(document.documentElement);
      return {
        hue: rootStyle.getPropertyValue('--theme-hue').trim(),
        saturation: rootStyle.getPropertyValue('--theme-saturation').trim(),
        lightness: rootStyle.getPropertyValue('--theme-lightness').trim()
      };
    });
    
    expect(cssValues.hue).toBe('120');
    expect(cssValues.saturation).toBe('60%');
    expect(cssValues.lightness).toBe('40%');
  });

  test('should handle rapid slider movements without errors', async ({ page }) => {
    const hueSlider = page.locator('#color-bar');
    const saturationSlider = page.locator('#saturation-slider');
    const lightnessSlider = page.locator('#lightness-slider');
    
    // Rapid movements on each slider
    const rapidValues = [0, 50, 100, 25, 75];
    
    for (const value of rapidValues) {
      await hueSlider.fill((value * 3.6).toString()); // Scale to 0-360
      await saturationSlider.fill(value.toString());
      await lightnessSlider.fill((10 + value * 0.8).toString()); // Scale to 10-90
      // No wait - test rapid changes
    }
    
    await page.waitForTimeout(500); // Final wait for all updates
    
    // Verify no JavaScript errors occurred
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Final slider movement to trigger any pending errors
    await hueSlider.fill('180');
    await page.waitForTimeout(100);
    
    expect(consoleErrors.length).toBe(0);
  });

  test('should handle boundary values correctly', async ({ page }) => {
    const hueSlider = page.locator('#color-bar');
    const saturationSlider = page.locator('#saturation-slider');
    const lightnessSlider = page.locator('#lightness-slider');
    
    // Test boundary values
    await hueSlider.fill('0');
    await saturationSlider.fill('0');
    await lightnessSlider.fill('10');
    await page.waitForTimeout(100);
    
    // Verify minimum values
    let stateValues = await page.evaluate(() => window.colorBarState);
    expect(stateValues.hue).toBe(0);
    expect(stateValues.saturation).toBe(0);
    expect(stateValues.lightness).toBe(10);
    
    // Test maximum values
    await hueSlider.fill('360');
    await saturationSlider.fill('100');
    await lightnessSlider.fill('90');
    await page.waitForTimeout(100);
    
    // Verify maximum values
    stateValues = await page.evaluate(() => window.colorBarState);
    expect(stateValues.hue).toBe(360);
    expect(stateValues.saturation).toBe(100);
    expect(stateValues.lightness).toBe(90);
  });

  test('should maintain theme consistency across all sliders', async ({ page }) => {
    // Set a complete theme
    await page.locator('#color-bar').fill('210'); // Blue hue
    await page.locator('#saturation-slider').fill('80');
    await page.locator('#lightness-slider').fill('45');
    
    await page.waitForTimeout(200);
    
    // Verify all components of the theme are consistent
    const themeState = await page.evaluate(() => {
      return {
        globalState: window.colorBarState,
        cssVars: {
          hue: getComputedStyle(document.documentElement).getPropertyValue('--theme-hue').trim(),
          saturation: getComputedStyle(document.documentElement).getPropertyValue('--theme-saturation').trim(),
          lightness: getComputedStyle(document.documentElement).getPropertyValue('--theme-lightness').trim()
        },
        sliderValues: {
          hue: (document.getElementById('color-bar') as HTMLInputElement).value,
          saturation: (document.getElementById('saturation-slider') as HTMLInputElement).value,
          lightness: (document.getElementById('lightness-slider') as HTMLInputElement).value
        },
        displayValues: {
          hue: document.getElementById('color-bar-value').textContent,
          saturation: document.getElementById('saturation-value').textContent,
          lightness: document.getElementById('lightness-value').textContent
        }
      };
    });
    
    // All representations should be consistent
    expect(themeState.globalState.hue).toBe(210);
    expect(themeState.globalState.saturation).toBe(80);
    expect(themeState.globalState.lightness).toBe(45);
    
    expect(themeState.cssVars.hue).toBe('210');
    expect(themeState.cssVars.saturation).toBe('80%');
    expect(themeState.cssVars.lightness).toBe('45%');
    
    expect(themeState.sliderValues.hue).toBe('210');
    expect(themeState.sliderValues.saturation).toBe('80');
    expect(themeState.sliderValues.lightness).toBe('45');
    
    expect(themeState.displayValues.hue).toContain('210');
    expect(themeState.displayValues.saturation).toContain('80');
    expect(themeState.displayValues.lightness).toContain('45');
  });

  test('should trigger theme updates and events', async ({ page }) => {
    // Set up event listener to capture theme events
    await page.evaluate(() => {
      window.themeEvents = [];
      document.addEventListener('theme-updated', (e) => {
        window.themeEvents.push((e as CustomEvent).detail);
      });
    });
    
    // Change each slider to trigger events
    await page.locator('#color-bar').fill('150');
    await page.waitForTimeout(100);
    
    await page.locator('#saturation-slider').fill('70');
    await page.waitForTimeout(100);
    
    await page.locator('#lightness-slider').fill('60');
    await page.waitForTimeout(100);
    
    // Verify theme events were triggered
    const eventCount = await page.evaluate(() => window.themeEvents?.length || 0);
    expect(eventCount).toBeGreaterThan(0);
  });
});
