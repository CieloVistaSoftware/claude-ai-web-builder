import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('Control Panel Hue Loop Bug Tests', () => {
  const baseTest = new BaseUnitTest();

  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
  });

  test('hue slider should not get into infinite loop when changed', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Navigate to control panel demo
      await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
      
      // Wait for control panel to be fully initialized
      await page.waitForSelector('#main-control-panel', { state: 'visible' });
      
      // Wait for color bars to be loaded and rendered
      await page.waitForSelector('wb-color-bars', { state: 'attached' });
      
      // Wait specifically for wb-color-bars components to be rendered
      await page.waitForFunction(() => {
        const colorBarsComponents = document.querySelectorAll('wb-color-bars');
        const primaryColorBar = document.querySelector('#primary-color-bar');
        const bgColorBar = document.querySelector('#bg-color-bar');
        return colorBarsComponents.length >= 2 && primaryColorBar && bgColorBar;
      }, { timeout: 15000 });
      
      await page.waitForTimeout(2000); // Give color components extra time to initialize fully
      
      // Track console messages to detect loops
      const consoleMessages: string[] = [];
      let loopDetected = false;
      let messageCount = 0;
      
      page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Color sliders initialized') || 
            text.includes('Applied primary color') ||
            text.includes('HSL sliders')) {
          messageCount++;
          consoleMessages.push(text);
          
          // If we see the same message repeated many times quickly, it's a loop
          if (messageCount > 10) {
            loopDetected = true;
            console.log(`🚨 Loop detected! Message count: ${messageCount}`);
            console.log(`Recent messages: ${consoleMessages.slice(-5).join(', ')}`);
          }
        }
      });
      
      // Find the primary color bars component (wb-color-bars)
      const primaryColorBars = await page.evaluateHandle(() => {
        return document.querySelector('#primary-color-bar');
      });
      expect(primaryColorBars).toBeTruthy();
      
      // Get initial hue value from wb-color-bars component
      const initialValue = await page.evaluate(() => {
        const primaryColorBar = document.querySelector('#primary-color-bar');
        return primaryColorBar ? primaryColorBar.getAttribute('text-hue') : null;
      });
      console.log(`Initial hue value: ${initialValue}`);
      
      // Test rapid hue changes by clicking on the wb-color-bars component
      // This should trigger the same color change events that were causing infinite loops
      await page.evaluate(() => {
        const primaryColorBar = document.querySelector('#primary-color-bar') as any;
        if (primaryColorBar) {
          // Simulate rapid hue changes that could trigger infinite loops
          primaryColorBar.setAttribute('text-hue', '180');
          primaryColorBar.dispatchEvent(new CustomEvent('colorchange', { 
            detail: { hue: 180, saturation: 70, lightness: 50 }, 
            bubbles: true 
          }));
        }
      });
      await page.waitForTimeout(500);
      
      await page.evaluate(() => {
        const primaryColorBar = document.querySelector('#primary-color-bar') as any;
        if (primaryColorBar) {
          primaryColorBar.setAttribute('text-hue', '240');
          primaryColorBar.dispatchEvent(new CustomEvent('colorchange', { 
            detail: { hue: 240, saturation: 70, lightness: 50 }, 
            bubbles: true 
          }));
        }
      });
      await page.waitForTimeout(500);
      
      await page.evaluate(() => {
        const primaryColorBar = document.querySelector('#primary-color-bar') as any;
        if (primaryColorBar) {
          primaryColorBar.setAttribute('text-hue', '300');
          primaryColorBar.dispatchEvent(new CustomEvent('colorchange', { 
            detail: { hue: 300, saturation: 70, lightness: 50 }, 
            bubbles: true 
          }));
        }
      });
      await page.waitForTimeout(500);
      
      // Check if loop was detected
      if (loopDetected) {
        console.log(`❌ Infinite loop detected in hue slider with ${messageCount} repeated messages`);
        console.log(`Console messages that indicated loop:`, consoleMessages.slice(-10));
        
        // Log current state for debugging
        const currentValue = await page.evaluate(() => {
          const primaryColorBar = document.querySelector('#primary-color-bar');
          return primaryColorBar ? primaryColorBar.getAttribute('text-hue') : null;
        });
        console.log(`Final hue value: ${currentValue}`);
        
        // This test should fail to highlight the bug
        throw new Error(`Infinite loop detected with ${messageCount} repeated messages`);
      } else {
        console.log('✅ No infinite loop detected in hue slider changes');
      }
      
      // Verify the color actually changed
      const finalValue = await page.evaluate(() => {
        const primaryColorBar = document.querySelector('#primary-color-bar');
        return primaryColorBar ? primaryColorBar.getAttribute('text-hue') : null;
      });
      // Note: exact value might vary due to event handling, just verify it changed
      expect(finalValue).not.toBe(initialValue);
      console.log(`Hue successfully changed from ${initialValue} to ${finalValue}`);
    });
  });

  test('color bar should handle rapid hue changes without loops', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
      await page.waitForSelector('#main-control-panel', { state: 'visible' });
      await page.waitForSelector('wb-color-bars', { state: 'attached' });
      
      // Wait for wb-color-bars components to be rendered
      await page.waitForFunction(() => {
        const colorBarsComponents = document.querySelectorAll('wb-color-bars');
        const primaryColorBar = document.querySelector('#primary-color-bar');
        const bgColorBar = document.querySelector('#bg-color-bar');
        return colorBarsComponents.length >= 2 && primaryColorBar && bgColorBar;
      }, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      // Monitor for excessive console output indicating loops
      let excessiveLogging = false;
      let logCount = 0;
      const startTime = Date.now();
      
      page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Color') || text.includes('HSL') || text.includes('Applied')) {
          logCount++;
          
          // If we get more than 20 color-related logs in 2 seconds, that's excessive
          const elapsed = Date.now() - startTime;
          if (logCount > 20 && elapsed < 2000) {
            excessiveLogging = true;
            console.log(`🚨 Excessive logging detected: ${logCount} messages in ${elapsed}ms`);
          }
        }
      });
      
      // Rapidly change hue values to stress test wb-color-bars component
      const hueValues = [0, 60, 120, 180, 240, 300, 360]; // Hue degrees
      
      for (const hue of hueValues) {
        await page.evaluate((hueValue) => {
          const primaryColorBar = document.querySelector('#primary-color-bar') as any;
          if (primaryColorBar) {
            primaryColorBar.setAttribute('text-hue', hueValue.toString());
            primaryColorBar.dispatchEvent(new CustomEvent('colorchange', { 
              detail: { hue: hueValue, saturation: 70, lightness: 50 }, 
              bubbles: true 
            }));
          }
        }, hue);
        await page.waitForTimeout(100); // Very short delay to simulate rapid changes
      }
      
      // Wait a bit more to see if loops develop after changes
      await page.waitForTimeout(1000);
      
      expect(excessiveLogging).toBe(false);
      console.log(`✅ Rapid hue changes completed without excessive logging (${logCount} total messages)`);
    });
  });

  test('background color hue should also not loop', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
      await page.waitForSelector('#main-control-panel', { state: 'visible' });
      
      // Wait for background color bars component to be rendered
      await page.waitForFunction(() => {
        const bgColorBar = document.querySelector('#bg-color-bar');
        return bgColorBar && bgColorBar.tagName.toLowerCase() === 'wb-color-bars';
      }, { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      let loopMessages = 0;
      page.on('console', msg => {
        if (msg.text().includes('Applied background color')) {
          loopMessages++;
        }
      });
      
      // Change background hue using wb-color-bars component
      await page.evaluate(() => {
        const bgColorBar = document.querySelector('#bg-color-bar') as any;
        if (bgColorBar) {
          // Set hue to 45 degrees
          bgColorBar.setAttribute('text-hue', '45');
          bgColorBar.dispatchEvent(new CustomEvent('colorchange', { 
            detail: { hue: 45, saturation: 25, lightness: 15 }, 
            bubbles: true 
          }));
        }
      });
      await page.waitForTimeout(300);
      
      await page.evaluate(() => {
        const bgColorBar = document.querySelector('#bg-color-bar') as any;
        if (bgColorBar) {
          // Set hue to 135 degrees
          bgColorBar.setAttribute('text-hue', '135');
          bgColorBar.dispatchEvent(new CustomEvent('colorchange', { 
            detail: { hue: 135, saturation: 25, lightness: 15 }, 
            bubbles: true 
          }));
        }
      });
      await page.waitForTimeout(300);
      
      await page.evaluate(() => {
        const bgColorBar = document.querySelector('#bg-color-bar') as any;
        if (bgColorBar) {
          // Set hue to 225 degrees
          bgColorBar.setAttribute('text-hue', '225');
          bgColorBar.dispatchEvent(new CustomEvent('colorchange', { 
            detail: { hue: 225, saturation: 25, lightness: 15 }, 
            bubbles: true 
          }));
        }
      });
      await page.waitForTimeout(300);
      
      // Should not have excessive background color messages
      expect(loopMessages).toBeLessThan(10);
      console.log(`✅ Background hue changes completed with ${loopMessages} color application messages`);
    });
  });
});