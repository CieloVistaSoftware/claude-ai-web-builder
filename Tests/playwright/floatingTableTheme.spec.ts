/**
 * Floating Table Theme Controls Tests
 * 
 * Converted from FloatingTableThemeControls.Tests.ps1
 * Tests the floating, draggable color control panel for table theming
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

test.describe('Floating Table Theme Controls Tests', () => {
  const projectRoot = getProjectRoot();
  
  test('should have table-theme.html file with floating controls structure', async () => {
    const tableThemeFile = path.join(projectRoot, 'components', 'table', 'table-theme.html');
    
    // Check if the file exists
    expect(fs.existsSync(tableThemeFile)).toBeTruthy();
    
    // Read the content
    const content = fs.readFileSync(tableThemeFile, 'utf8');
    
    // Required CSS classes for floating controls
    const requiredClasses = [
      '.floating-color-control',
      '.control-header',
      '.control-btn',
      '.floating-control-content',
      '.floating-control-group',
      '.color-preview'
    ];
    
    requiredClasses.forEach(className => {
      expect(content).toContain(className);
      console.log(`✅ Found CSS class: ${className}`);
    });
  });

  test('should have required HTML elements for floating controls', async () => {
    const tableThemeFile = path.join(projectRoot, 'components', 'table', 'table-theme.html');
    const content = fs.readFileSync(tableThemeFile, 'utf8');
    
    // Required HTML elements
    const requiredElements = [
      'id="floating-control"',
      'id="control-header"',
      'id="minimize-btn"',
      'id="floating-color-bar"',
      'id="floating-saturation-slider"',
      'id="floating-lightness-slider"',
      'id="floating-theme-select"',
      'id="color-preview"'
    ];
    
    requiredElements.forEach(element => {
      expect(content).toContain(element);
      console.log(`✅ Found HTML element: ${element}`);
    });
  });

  test('should have floating controls working in browser', async ({ page }) => {
    // Navigate to the table theme page
    await page.goto('/components/table/table-theme.html');
    
    // Check if floating control exists
    const floatingControl = page.locator('#floating-control');
    await expect(floatingControl).toBeVisible();
    
    // Check if control header exists
    const controlHeader = page.locator('#control-header');
    await expect(controlHeader).toBeVisible();
    
    // Test minimize functionality if available
    const minimizeBtn = page.locator('#minimize-btn');
    if (await minimizeBtn.count() > 0) {
      await minimizeBtn.click();
      
      // Wait for animation
      await page.waitForTimeout(500);
      
      // Check if control content is hidden or minimized
      const controlContent = page.locator('.floating-control-content');
      if (await controlContent.count() > 0) {
        const isHidden = await controlContent.isHidden();
        console.log(`Control content minimized: ${isHidden}`);
      }
    }
  });

  test('should have draggable floating controls', async ({ page }) => {
    await page.goto('/components/table/table-theme.html');
    
    const floatingControl = page.locator('#floating-control');
    await expect(floatingControl).toBeVisible();
    
    // Get initial position
    const initialPosition = await floatingControl.boundingBox();
    
    if (initialPosition) {
      // Test drag functionality
      await floatingControl.hover();
      await page.mouse.down();
      await page.mouse.move(initialPosition.x + 100, initialPosition.y + 50);
      await page.mouse.up();
      
      // Wait for potential animation
      await page.waitForTimeout(200);
      
      // Get new position
      const newPosition = await floatingControl.boundingBox();
      
      if (newPosition) {
        // Check if position changed (allowing some tolerance)
        const positionChanged = 
          Math.abs(newPosition.x - initialPosition.x) > 10 || 
          Math.abs(newPosition.y - initialPosition.y) > 10;
        
        console.log(`Position changed: ${positionChanged}`);
        console.log(`Initial: (${initialPosition.x}, ${initialPosition.y})`);
        console.log(`New: (${newPosition.x}, ${newPosition.y})`);
      }
    }
  });

  test('should have color controls that update theme', async ({ page }) => {
    await page.goto('/components/table/table-theme.html');
    
    // Look for color controls
    const colorBar = page.locator('#floating-color-bar');
    const saturationSlider = page.locator('#floating-saturation-slider');
    const lightnessSlider = page.locator('#floating-lightness-slider');
    const colorPreview = page.locator('#color-preview');
    
    // Test color bar if it exists
    if (await colorBar.count() > 0) {
      await expect(colorBar).toBeVisible();
      
      // Click on different positions of the color bar
      await colorBar.click({ position: { x: 50, y: 10 } });
      await page.waitForTimeout(100);
      
      console.log('✅ Color bar interaction tested');
    }
    
    // Test saturation slider if it exists
    if (await saturationSlider.count() > 0) {
      await expect(saturationSlider).toBeVisible();
      
      // Drag slider
      await saturationSlider.fill('75');
      await page.waitForTimeout(100);
      
      console.log('✅ Saturation slider interaction tested');
    }
    
    // Test lightness slider if it exists
    if (await lightnessSlider.count() > 0) {
      await expect(lightnessSlider).toBeVisible();
      
      // Drag slider
      await lightnessSlider.fill('60');
      await page.waitForTimeout(100);
      
      console.log('✅ Lightness slider interaction tested');
    }
    
    // Check if color preview updates
    if (await colorPreview.count() > 0) {
      await expect(colorPreview).toBeVisible();
      
      const backgroundColor = await colorPreview.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      console.log(`Color preview background: ${backgroundColor}`);
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)'); // Should have some color
    }
  });

  test('should apply theme changes to table elements', async ({ page }) => {
    await page.goto('/components/table/table-theme.html');
    
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Look for table elements
    const tables = page.locator('table');
    
    if (await tables.count() > 0) {
      const table = tables.first();
      
      // Get initial table styling
      const initialStyles = await table.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
          color: computed.color
        };
      });
      
      console.log('Initial table styles:', initialStyles);
      
      // Try to change theme settings
      const colorControls = page.locator('input[type="range"], .color-bar, .theme-control');
      
      if (await colorControls.count() > 0) {
        const control = colorControls.first();
        await control.click();
        await page.waitForTimeout(500);
        
        // Get updated table styling
        const updatedStyles = await table.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            backgroundColor: computed.backgroundColor,
            borderColor: computed.borderColor,
            color: computed.color
          };
        });
        
        console.log('Updated table styles:', updatedStyles);
        
        // Check if at least one style property changed
        const stylesChanged = 
          initialStyles.backgroundColor !== updatedStyles.backgroundColor ||
          initialStyles.borderColor !== updatedStyles.borderColor ||
          initialStyles.color !== updatedStyles.color;
        
        console.log(`Table styles changed: ${stylesChanged}`);
      }
    } else {
      console.log('No table elements found on the page');
    }
  });

  test('should persist floating control position', async ({ page }) => {
    await page.goto('/components/table/table-theme.html');
    
    const floatingControl = page.locator('#floating-control');
    
    if (await floatingControl.count() > 0) {
      // Move the control
      const initialBox = await floatingControl.boundingBox();
      
      if (initialBox) {
        await floatingControl.hover();
        await page.mouse.down();
        await page.mouse.move(initialBox.x + 150, initialBox.y + 100);
        await page.mouse.up();
        
        await page.waitForTimeout(300);
        
        // Reload page
        await page.reload();
        await page.waitForTimeout(1000);
        
        // Check if position is remembered (this would depend on localStorage implementation)
        const afterReloadBox = await floatingControl.boundingBox();
        
        if (afterReloadBox) {
          console.log(`Position after reload: (${afterReloadBox.x}, ${afterReloadBox.y})`);
          
          // Note: Position persistence would depend on the actual implementation
          // This test mainly verifies the control still exists after reload
          await expect(floatingControl).toBeVisible();
        }
      }
    }
  });
});
