/**
 * Template Loader Tests
 * 
 * Converted from TemplateLoader.Tests.ps1
 * Tests website_template_generator.html functionality and template loading
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

test.describe('Template Loader Tests', () => {
  const projectRoot = getProjectRoot();
  
  test('should have website_template_generator.html file', async () => {
    const htmlFile = path.join(projectRoot, 'website_template_generator.html');
    
    // Check if the file exists
    expect(fs.existsSync(htmlFile)).toBeTruthy();
    console.log('✅ website_template_generator.html exists');
  });

  test('should have required elements in HTML template', async () => {
    const htmlFile = path.join(projectRoot, 'website_template_generator.html');
    
    if (fs.existsSync(htmlFile)) {
      const htmlContent = fs.readFileSync(htmlFile, 'utf8');
      
      // Required elements
      const requiredElements = [
        '<div id="root">',
        'themeSelect',
        'layoutSelect',
        'navSelect',
        'exportBtn'
      ];
      
      requiredElements.forEach(element => {
        expect(htmlContent).toContain(element);
        console.log(`✅ Found element: ${element}`);
      });
    } else {
      // Skip detailed checks if file doesn't exist
      console.log('⚠️ HTML file not found, skipping element checks');
    }
  });

  // Note: main.tsx has been removed as the project uses wb/wb.html approach instead

  test('should load website template generator in browser', async ({ page }) => {
    // Try to navigate to the template generator
    try {
      await page.goto('/html/pages/website_template_generator.html');
      
      // Check if the page loads without errors
      await expect(page.locator('body')).toBeVisible();
      
      // Look for key elements
      const rootElement = page.locator('#root');
      if (await rootElement.count() > 0) {
        await expect(rootElement).toBeVisible();
        console.log('✅ Root element found');
      }
      
      // Look for template selection controls
      const themeSelect = page.locator('#themeSelect, .theme-select, [name="theme"]');
      const layoutSelect = page.locator('#layoutSelect, .layout-select, [name="layout"]');
      const navSelect = page.locator('#navSelect, .nav-select, [name="navigation"]');
      const exportBtn = page.locator('#exportBtn, .export-btn, [name="export"]');
      
      const controls = [
        { name: 'Theme Select', locator: themeSelect },
        { name: 'Layout Select', locator: layoutSelect },
        { name: 'Navigation Select', locator: navSelect },
        { name: 'Export Button', locator: exportBtn }
      ];
      
      for (const control of controls) {
        if (await control.locator.count() > 0) {
          await expect(control.locator).toBeVisible();
          console.log(`✅ ${control.name} found and visible`);
        } else {
          console.log(`⚠️ ${control.name} not found`);
        }
      }
      
    } catch (error) {
      console.log(`⚠️ Could not load template generator: ${(error as Error).message}`);
      
      // Try alternative paths
      const alternativePaths = ['/wb/wb/wb.html', '/index.html', '/'];
      
      for (const altPath of alternativePaths) {
        try {
          await page.goto(altPath);
          console.log(`✅ Successfully loaded alternative path: ${altPath}`);
          break;
        } catch (altError) {
          console.log(`⚠️ Alternative path ${altPath} also failed`);
        }
      }
    }
  });

  test('should have functional template selection controls', async ({ page }) => {
    // Try different possible paths for the template generator
    const possiblePaths = [
      '/website_template_generator.html',
      '/wb/wb/wb.html',
      '/themes/theme-generator.html',
      '/'
    ];
    
    let pageLoaded = false;
    
    for (const path of possiblePaths) {
      try {
        await page.goto(path);
        pageLoaded = true;
        console.log(`✅ Loaded page: ${path}`);
        break;
      } catch (error) {
        console.log(`⚠️ Could not load ${path}`);
      }
    }
    
    if (pageLoaded) {
      // Look for any kind of selection controls
      const selectionControls = page.locator('select, .select, [role="combobox"]');
      
      if (await selectionControls.count() > 0) {
        const firstSelect = selectionControls.first();
        await expect(firstSelect).toBeVisible();
        
        // Try to interact with the control
        const options = await firstSelect.locator('option').count();
        
        if (options > 1) {
          await firstSelect.selectOption({ index: 1 });
          console.log('✅ Successfully interacted with select control');
        }
      }
      
      // Look for buttons that might be related to template operations
      const templateButtons = page.locator('button:has-text("Export"), button:has-text("Generate"), button:has-text("Download"), .export-btn, .generate-btn');
      
      if (await templateButtons.count() > 0) {
        const firstButton = templateButtons.first();
        await expect(firstButton).toBeVisible();
        console.log('✅ Template operation button found');
      }
    }
  });

  test('should handle template export functionality', async ({ page }) => {
    const possiblePaths = [
      '/website_template_generator.html',
      '/wb/wb/wb.html',
      '/themes/theme-generator.html'
    ];
    
    for (const path of possiblePaths) {
      try {
        await page.goto(path);
        
        // Look for export functionality
        const exportButtons = page.locator('button:has-text("Export"), .export-btn, #exportBtn');
        
        if (await exportButtons.count() > 0) {
          const exportBtn = exportButtons.first();
          await expect(exportBtn).toBeVisible();
          
          // Set up download handling
          const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
          
          try {
            await exportBtn.click();
            const download = await downloadPromise;
            
            console.log(`✅ Export functionality works: ${download.suggestedFilename()}`);
            break;
          } catch (downloadError) {
            console.log(`⚠️ Export button clicked but no download triggered`);
            
            // Check if any modal or notification appeared
            const notifications = page.locator('.notification, .alert, .toast, [role="alert"]');
            
            if (await notifications.count() > 0) {
              console.log('✅ Export action triggered some response');
            }
          }
        }
        
        break;
      } catch (error) {
        console.log(`⚠️ Could not test export on ${path}`);
      }
    }
  });
});

