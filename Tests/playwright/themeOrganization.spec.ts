/**
 * Theme Organization Tests
 * 
 * Converted from ConsolidatedThemeTests.ps1
 * This file tests theme-related organization and functionality:
 *   - Theme directory structure
 *   - Key theme files existence and location
 *   - Proper organization of theme components
 *   - "zzz" prefixed files organization
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to get project root path
function getProjectRoot() {
  // Get the absolute path to the test file directory (Tests/playwright)
  const testDir = path.resolve(__dirname);
  // Go up one directory to get the Tests directory
  const testsDir = path.dirname(testDir);
  // Go up one more directory to get the project root
  return path.dirname(testsDir);
}

test.describe('Theme File Organization Tests', () => {
  const projectRoot = getProjectRoot();

  test('should have themes directory with key files', async () => {
    // Check if themes directory exists
    const themesDir = path.join(projectRoot, 'themes');
    expect(fs.existsSync(themesDir)).toBeTruthy();
    
    // Check if key theme files exist
    const hslColorPickerPath = path.join(themesDir, 'hsl-color-picker.html');
    const hueColorSliderPath = path.join(themesDir, 'hue-color-slider.html');
    const themeGeneratorPath = path.join(themesDir, 'theme-generator.html');
    
    expect(fs.existsSync(hslColorPickerPath)).toBeTruthy();
    expect(fs.existsSync(hueColorSliderPath)).toBeTruthy();
    expect(fs.existsSync(themeGeneratorPath)).toBeTruthy();
  });

  test('should have no zzz prefixed files in themes directory', async () => {
    const themesDir = path.join(projectRoot, 'themes');
    const files = fs.readdirSync(themesDir);
    
    // Filter files with 'zzz' prefix
    const zzzFiles = files.filter(file => file.startsWith('zzz'));
    
    // Expect no zzz files in themes directory
    expect(zzzFiles.length).toBe(0);
  });

  test('should have zzz directory with theme demo component', async () => {
    // Check if zzz directory exists
    const zzzDir = path.join(projectRoot, 'zzz');
    expect(fs.existsSync(zzzDir)).toBeTruthy();
    
    // Check if theme demo component exists in the zzz directory
    const zzzThemeDemoPath = path.join(zzzDir, 'zzztheme-demo-component.tsx');
    expect(fs.existsSync(zzzThemeDemoPath)).toBeTruthy();
  });
});

test.describe('Theme Files Content Tests', () => {
  test('should have proper theme generator implementation', async ({ page }) => {
    await page.goto('/themes/theme-generator.html');
    
    // Check if the page loaded
    await expect(page).toHaveTitle(/Theme Generator|Theme|Generator/i);
    
    // Check for theme generation UI elements
    const colorPicker = await page.locator('.color-picker');
    await expect(colorPicker).toBeVisible();
    
    // Check for theme preview elements
    const themePreview = await page.locator('.theme-preview');
    await expect(themePreview).toBeVisible();
    
    // Check for CSS variables generation functionality
    const hasCssVarsFunction = await page.evaluate(() => {
      const scriptElements = Array.from(document.querySelectorAll('script'));
      const scripts = scriptElements.map(script => script.textContent).join('');
      return scripts.includes('generateCssVars') || 
             scripts.includes('generateTheme') || 
             scripts.includes('updateTheme');
    });
    
    expect(hasCssVarsFunction).toBeTruthy();
  });
  
  test('should have proper HSL color picker implementation', async ({ page }) => {
    await page.goto('/themes/hsl-color-picker.html');
    
    // Check if the page loaded
    await expect(page).toHaveTitle(/HSL Color|Color Picker|HSL/i);
    
    // Check for HSL input sliders
    const hueSlider = await page.locator('input[type="range"]').nth(0);
    await expect(hueSlider).toBeVisible();
    
    // Test color picker functionality by moving a slider
    await hueSlider.fill('180'); // Set hue to 180
    
    // Check if the color preview updates
    const colorPreview = await page.locator('.color-preview');
    
    // Wait for any potential color update
    await page.waitForTimeout(100);
    
    // Get the background color after the update
    const backgroundColor = await colorPreview.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Expect the color to be different from default (exact value might vary)
    expect(backgroundColor).not.toBe('rgb(255, 0, 0)'); // Not red
  });
});
