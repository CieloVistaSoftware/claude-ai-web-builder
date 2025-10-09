import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('Manual Hue Slider Movement Test', () => {
  const baseTest = new BaseUnitTest();

  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
  });

  test('Actually move hue sliders to reproduce infinite loop', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🎯 MANUAL SLIDER MOVEMENT TEST - Reproducing the exact issue');
      
      // Set up aggressive loop detection
      let totalMessages = 0;
      let colorMessages = 0;
      let hueMessages = 0;
      let updateMessages = 0;
      let loopDetected = false;
      const startTime = Date.now();
      
      page.on('console', msg => {
        const text = msg.text();
        totalMessages++;
        
        if (text.includes('color') || text.includes('Color')) colorMessages++;
        if (text.includes('hue') || text.includes('Hue')) hueMessages++;
        if (text.includes('update') || text.includes('Update')) updateMessages++;
        
        // Very sensitive loop detection - look for rapid console spam
        const elapsed = Date.now() - startTime;
        if (totalMessages > 50 && elapsed < 5000) {
          loopDetected = true;
          console.log(`🚨 RAPID CONSOLE SPAM DETECTED: ${totalMessages} messages in ${elapsed}ms`);
        }
        
        if (colorMessages > 20 || hueMessages > 15 || updateMessages > 25) {
          loopDetected = true;
          console.log(`🚨 EXCESSIVE COLOR UPDATES: colors=${colorMessages}, hue=${hueMessages}, updates=${updateMessages}`);
        }
      });
      
      await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
      
      // Wait for full initialization
      await page.waitForSelector('#main-control-panel', { state: 'visible' });
      console.log('✅ Control panel loaded');
      
      // Wait longer for color components
      await page.waitForTimeout(5000);
      
      // Try to find the actual color sliders that are causing the issue
      console.log('🔍 Looking for actual hue sliders...');
      
      // Check what's actually on the page
      const allElements = await page.evaluate(() => {
        interface ElementInfo {
          type: string;
          index: number;
          id: string;
          className: string;
          value?: string;
          min?: string;
          max?: string;
          visible: boolean;
          innerHTML?: string;
        }
        
        const elements: ElementInfo[] = [];
        
        // Look for any input elements
        document.querySelectorAll('input[type="range"]').forEach((el, i) => {
          const input = el as HTMLInputElement;
          const htmlEl = el as HTMLElement;
          elements.push({
            type: 'range-input',
            index: i,
            id: input.id,
            className: input.className,
            value: input.value,
            min: input.min,
            max: input.max,
            visible: htmlEl.offsetParent !== null
          });
        });
        
        // Look for wb-color-bar elements
        document.querySelectorAll('wb-color-bar').forEach((el, i) => {
          const htmlEl = el as HTMLElement;
          elements.push({
            type: 'wb-color-bar',
            index: i,
            id: htmlEl.id,
            className: htmlEl.className,
            visible: htmlEl.offsetParent !== null,
            innerHTML: htmlEl.innerHTML.substring(0, 100) + '...'
          });
        });
        
        // Look for wb-color-bars elements
        document.querySelectorAll('wb-color-bars').forEach((el, i) => {
          const htmlEl = el as HTMLElement;
          elements.push({
            type: 'wb-color-bars',
            index: i,
            id: htmlEl.id,
            className: htmlEl.className,
            visible: htmlEl.offsetParent !== null,
            innerHTML: htmlEl.innerHTML.substring(0, 100) + '...'
          });
        });
        
        return elements;
      });
      
      console.log('📋 Elements found on page:');
      allElements.forEach(el => {
        console.log(`  ${el.type}[${el.index}]: id="${el.id}", class="${el.className}", visible=${el.visible}`);
        if (el.value !== undefined) {
          console.log(`    Value: ${el.value}, Range: ${el.min}-${el.max}`);
        }
      });
      
      // Now try to interact with visible range inputs
      const visibleRangeInputs = allElements.filter(el => el.type === 'range-input' && el.visible);
      
      if (visibleRangeInputs.length > 0) {
        console.log(`🎯 Testing ${visibleRangeInputs.length} visible range inputs...`);
        
        for (let i = 0; i < Math.min(visibleRangeInputs.length, 3); i++) {
          const elementInfo = visibleRangeInputs[i];
          console.log(`\n🧪 Testing slider ${i + 1}: ${elementInfo.id || 'no-id'}`);
          
          // Reset counters for this slider
          totalMessages = 0;
          colorMessages = 0;
          hueMessages = 0;
          updateMessages = 0;
          
          const selector = elementInfo.id ? `#${elementInfo.id}` : `input[type="range"]:nth-of-type(${i + 1})`;
          const slider = page.locator(selector);
          
          try {
            // Check if slider is actually interactable
            await expect(slider).toBeVisible();
            
            console.log(`  Initial value: ${elementInfo.value}`);
            
            // Try different ways of moving the slider that might trigger loops
            console.log('  📝 Method 1: Using fill()...');
            await slider.fill('120');
            await page.waitForTimeout(500);
            
            if (loopDetected) {
              console.log('  🚨 Loop detected with fill() method');
              break;
            }
            
            console.log('  📝 Method 2: Using keyboard arrows...');
            await slider.focus();
            await page.keyboard.press('ArrowRight');
            await page.keyboard.press('ArrowRight');
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(500);
            
            if (loopDetected) {
              console.log('  🚨 Loop detected with keyboard method');
              break;
            }
            
            console.log('  📝 Method 3: Using click and drag...');
            const sliderBox = await slider.boundingBox();
            if (sliderBox) {
              // Click at different positions
              await slider.click({ position: { x: sliderBox.width * 0.3, y: sliderBox.height / 2 } });
              await page.waitForTimeout(300);
              
              await slider.click({ position: { x: sliderBox.width * 0.7, y: sliderBox.height / 2 } });
              await page.waitForTimeout(300);
              
              if (loopDetected) {
                console.log('  🚨 Loop detected with click method');
                break;
              }
            }
            
            console.log('  📝 Method 4: Rapid value changes...');
            const rapidValues = ['180', '0', '360', '90', '270', '45'];
            for (const val of rapidValues) {
              await slider.fill(val);
              await page.waitForTimeout(100); // Very short delay
              
              if (loopDetected) {
                console.log(`  🚨 Loop detected during rapid changes at value ${val}`);
                break;
              }
            }
            
            if (loopDetected) break;
            
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.log(`  ❌ Error testing slider: ${errorMsg}`);
          }
        }
      } else {
        console.log('❌ No visible range inputs found');
        
        // Try interacting with wb-color-bar elements directly
        const colorBars = allElements.filter(el => el.type === 'wb-color-bar' && el.visible);
        if (colorBars.length > 0) {
          console.log(`🎯 Trying to interact with ${colorBars.length} wb-color-bar elements...`);
          
          for (const colorBar of colorBars) {
            const selector = colorBar.id ? `#${colorBar.id}` : `wb-color-bar:nth-of-type(${colorBar.index + 1})`;
            console.log(`Clicking on ${selector}...`);
            
            try {
              await page.click(selector);
              await page.waitForTimeout(1000);
              
              if (loopDetected) {
                console.log('🚨 Loop detected from wb-color-bar interaction');
                break;
              }
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : String(error);
              console.log(`Error clicking ${selector}: ${errorMsg}`);
            }
          }
        }
      }
      
      // Final results
      console.log('\n📊 FINAL RESULTS:');
      console.log(`Total console messages: ${totalMessages}`);
      console.log(`Color-related messages: ${colorMessages}`);
      console.log(`Hue-related messages: ${hueMessages}`);
      console.log(`Update messages: ${updateMessages}`);
      
      if (loopDetected) {
        console.log('🚨🚨🚨 INFINITE LOOP CONFIRMED! 🚨🚨🚨');
        console.log('This is the critical issue described in claude.md');
        throw new Error('CRITICAL: Infinite loop detected when moving hue sliders');
      } else {
        console.log('✅ No infinite loop detected');
        console.log('The issue may be intermittent or require specific conditions');
      }
    });
  });

  // Export event log after each test
  test.afterEach(async ({ page }) => {
    try {
      await baseTest.exportEventLogToTestResults(page, 'control-panel-manual-slider-test');
    } catch (error) {
      console.error('Failed to export event log:', error);
    }
  });
});