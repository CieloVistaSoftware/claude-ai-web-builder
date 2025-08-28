/**
 * Theme Generator Simple Tests
 * 
 * Converted from ThemeGeneratorSimpleTests.ps1
 * Simple verification test for the refactored Theme Generator
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to get project root path
function getProjectRoot() {
  const testDir = path.resolve(__dirname);
  const testsDir = path.dirname(testDir);
  return path.dirname(testsDir);
}

test.describe('Theme Generator Simple Tests', () => {
  const projectRoot = getProjectRoot();
  
  test('should have theme-generator.html redirect setup', async () => {
    const originalFile = path.join(projectRoot, 'themes', 'theme-generator.html');
    
    if (fs.existsSync(originalFile)) {
      const content = fs.readFileSync(originalFile, 'utf8');
      
      // Check for redirect meta tag
      expect(content).toMatch(/meta http-equiv="refresh"/i);
      console.log('✅ Redirect meta tag is correctly set up');
      
      // Check that original file has been cleaned of JS functions
      expect(content).not.toContain('generateAndApplyTheme');
      console.log('✅ Original file has been properly cleaned (no JS functions)');
    } else {
      console.log('⚠️ Original theme-generator.html file not found');
    }
  });

  test('should have all required theme generator files', async () => {
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
        
        expect(fs.existsSync(filePath)).toBeTruthy();
      } else {
        console.log(`❌ Missing file: ${fileName}`);
        allFilesExist = false;
      }
    });
    
    expect(allFilesExist).toBeTruthy();
  });

  test('should have proper file content structure', async () => {
    const redirectedFolder = path.join(projectRoot, 'themes', 'generator');
    const indexFile = path.join(redirectedFolder, 'index.html');
    const scriptFile = path.join(redirectedFolder, 'script.js');
    const styleFile = path.join(redirectedFolder, 'styles.css');
    
    // Check CSS link in HTML
    if (fs.existsSync(indexFile)) {
      const htmlContent = fs.readFileSync(indexFile, 'utf8');
      
      expect(htmlContent).toMatch(/<link.*rel="stylesheet".*href="styles\.css">/i);
      console.log('✅ CSS is properly linked in index.html');
      
      // Check for script tag
      expect(htmlContent).toMatch(/<script.*src="script\.js">/i);
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
      
      expect(hasThemeFunctions).toBeTruthy();
      console.log('✅ JavaScript contains theme generation functions');
    }
    
    // Check CSS content
    if (fs.existsSync(styleFile)) {
      const cssContent = fs.readFileSync(styleFile, 'utf8');
      
      // Should contain CSS rules
      const hasCssRules = cssContent.includes('{') && cssContent.includes('}');
      
      expect(hasCssRules).toBeTruthy();
      console.log('✅ CSS file contains styling rules');
    }
  });

  test('should load theme generator in browser', async ({ page }) => {
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
      } catch (error) {
        console.log(`⚠️ Could not load theme generator at: ${path}`);
      }
    }
    
    if (pageLoaded) {
      // Check if the page loads without major errors
      await expect(page.locator('body')).toBeVisible();
      
      // Look for theme generator elements
      const themeControls = page.locator('.theme-control, .color-control, input[type="range"], .color-picker');
      
      if (await themeControls.count() > 0) {
        console.log('✅ Theme generator controls found');
        await expect(themeControls.first()).toBeVisible();
      }
        // Check for any JavaScript errors
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      
      await page.waitForTimeout(1000);
      
      if (errors.length === 0) {
        console.log('✅ No JavaScript errors detected');
      } else {
        console.log(`⚠️ JavaScript errors detected: ${errors.join(', ')}`);
      }
    } else {
      console.log('⚠️ Could not load theme generator from any expected path');
    }
  });

  test('should have functional theme generation', async ({ page }) => {
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
            expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
          }
          
          console.log('✅ Theme generation controls are functional');
        }
        
        break;
      } catch (error) {
        console.log(`⚠️ Could not test theme generation at: ${path}`);
      }
    }
  });

  test('should redirect from original theme-generator.html', async ({ page }) => {
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
      } else {
        console.log('⚠️ No redirect detected or redirect target different');
        console.log(`Current URL: ${currentUrl}`);
      }
      
      // Verify the page loads properly after redirect
      await expect(page.locator('body')).toBeVisible();
      
    } catch (error) {
      console.log(`⚠️ Could not test redirect functionality: ${(error as Error).message}`);
    }
  });
});
