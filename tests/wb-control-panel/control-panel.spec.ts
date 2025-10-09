// @ts-nocheck
// @ts-check
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

/**
 * Test suite for the Website Builder control panel - Simple Version
 * This tests the basic test-control-panel-simple.html page
 */

test.describe('Website Builder Control Panel Simple Tests', () => {
  const baseTest = new BaseUnitTest();

  // Setup standard error monitoring and wb-event-log integration
  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('/tests/wb-control-panel/test-control-panel-simple.html');
    await page.waitForTimeout(3000);
  });

  // Simple TEXT VALIDATION test with mandatory error monitoring
  test('control panel should show correct page text', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // VALIDATE PAGE TEXT CONTENT
      const pageTitle = await page.textContent('h1');
      expect(pageTitle).toBe('Control Panel Simple Test');
      
      const sectionTitle = await page.textContent('h2');
      expect(sectionTitle).toBe('WB Control Panel Component Test');
      
      // Wait for component output
      await page.waitForFunction(() => {
        const output = document.querySelector('#console-output');
        return output && output.textContent.includes('Dependencies ready');
      }, { timeout: 10000 });
      
      const outputText = await page.textContent('#console-output');
      expect(outputText).toContain('Control panel container created');
      
      console.log('✅ Control panel shows correct text and dependencies');
    });
  });

  // Test dependencies are loaded with mandatory error monitoring
  test('should show all dependencies loaded', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.waitForFunction(() => {
        const output = document.querySelector('#console-output');
        return output && output.textContent.includes('wb-color-bars defined');
      }, { timeout: 10000 });
      
      const outputText = await page.textContent('#console-output');
      
      expect(outputText).toContain('wb-color-bar defined: YES');
      expect(outputText).toContain('wb-color-bars defined: YES');
      
      console.log('✅ All control panel dependencies loaded');
    });
  });

  // Test page styling with mandatory error monitoring
  test('page should have dark theme styling', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Check for the body element's background color (dark theme in CSS)
      const bodyStyle = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
      expect(bodyStyle).toContain('rgb(30, 30, 30)'); // Dark background from CSS
      console.log('✅ Simple test page has dark theme confirmed via CSS');
    });
  });

  // Test control panel container exists with mandatory error monitoring
  test('control panel container should be created', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Wait for the container to be created by the script
      await page.waitForSelector('#test-control-panel', { timeout: 10000 });
      
      const controlPanelContainer = page.locator('#test-control-panel');
      await expect(controlPanelContainer).toBeVisible();
      
      const containerText = await controlPanelContainer.textContent();
      expect(containerText).toBe('Control Panel Container');
      
      console.log('✅ Control panel container exists and has correct content');
    });
  });

  // Test final status message with mandatory error monitoring
  test('should show final status message', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Wait for final status check
      await page.waitForFunction(() => {
        const output = document.querySelector('#console-output');
        return output && output.textContent.includes('Control panel test ready');
      }, { timeout: 15000 });
      
      const outputText = await page.textContent('#console-output');
      expect(outputText).toContain('Control panel test ready: All dependencies available');
      
      console.log('✅ Final status message confirmed');
    });
  });

  // Test output div structure with mandatory error monitoring
  test('output div should have correct structure', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const outputDiv = page.locator('#output');
      await expect(outputDiv).toBeVisible();
      
      const outputTitle = await page.textContent('#output h3');
      expect(outputTitle).toBe('Output:');
      
      const consoleOutput = page.locator('#console-output');
      await expect(consoleOutput).toBeVisible();
      
      console.log('✅ Output div structure is correct');
    });
  });

  // Test component dependency checks with mandatory error monitoring
  test('should confirm custom elements are properly defined', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Use page.evaluate to check custom elements in browser context
      const customElementsCheck = await page.evaluate(() => {
        return {
          colorBar: !!customElements.get('wb-color-bar'),
          colorBars: !!customElements.get('wb-color-bars')
        };
      });
      
      expect(customElementsCheck.colorBar).toBeTruthy();
      expect(customElementsCheck.colorBars).toBeTruthy();
      
      console.log('✅ Custom elements are properly defined in browser');
    });
  });

  // Test page load timing with mandatory error monitoring
  test('should load components within reasonable time', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const startTime = Date.now();
      
      // Wait for the final ready message
      await page.waitForFunction(() => {
        const output = document.querySelector('#console-output');
        return output && output.textContent.includes('Control panel test ready');
      }, { timeout: 15000 });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
      
      console.log(`✅ Components loaded in ${loadTime}ms`);
    });
  });

  // Test scripts are loaded with mandatory error monitoring
  test('should have required scripts loaded', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Check if the scripts have been executed by looking at their effects
      const scriptsLoaded = await page.evaluate(() => {
        // Check if the console output has content (indicates script ran)
        const outputElement = document.getElementById('console-output');
        const hasLogFunction = outputElement && outputElement.innerHTML.length > 0;
        
        // Check if custom elements scripts have run
        const hasCustomElements = customElements.get('wb-color-bar') && 
                                 customElements.get('wb-color-bars');
        
        return {
          logFunction: !!hasLogFunction,
          customElements: !!hasCustomElements
        };
      });
      
      expect(scriptsLoaded.logFunction).toBeTruthy();
      expect(scriptsLoaded.customElements).toBeTruthy();
      
      console.log('✅ Required scripts are loaded and functional');
    });
  });

  // Test basic page accessibility with mandatory error monitoring
  test('page should have basic accessibility features', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Check for basic accessibility features
      const title = await page.title();
      expect(title).toBe('Simple Control Panel Test');
      
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      
      const h2 = page.locator('h2');
      await expect(h2).toBeVisible();
      
      console.log('✅ Basic accessibility features confirmed');
    });
  });

});
