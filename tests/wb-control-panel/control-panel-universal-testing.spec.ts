/**
 * Control Panel Universal Testing with Loop Detection and Exception Handling
 * 
 * This test implements the new universal testing standards:
 * - Comprehensive loop detection for all interactions
 * - Uncaught exception handling with full stack traces
 * - Boundary value testing on all controls
 * - Systematic testing of every interactive element
 */

import { test, expect } from '@playwright/test';
import { 
  setupUniversalLoopDetection,
  setupExceptionHandling,
  createTimeoutLoopDetector 
} from '../universal-loop-detection.js';

test.describe('Control Panel Universal Testing', () => {
  
  test('systematic control testing with universal protection', async ({ page }) => {
    // Set up monitoring for console errors indicating loops
    const loopErrors: string[] = [];
    page.on('console', msg => {
      const text = msg.text().toLowerCase();
      if (['infinite', 'loop', 'recursion', 'stack overflow'].some(keyword => text.includes(keyword))) {
        loopErrors.push(msg.text());
      }
    });
    
    // Set timeout to detect hanging operations
    page.setDefaultTimeout(5000);
    
    // Navigate with timeout protection
    await Promise.race([
      page.goto('http://localhost:3000/components/wb-control-panel/wb-control-panel-demo.html'),
      page.waitForTimeout(10000).then(() => {
        throw new Error('Navigation timed out - possible infinite loop in page load');
      })
    ]);
    
    // Wait for control panel to be fully loaded
    await page.waitForSelector('#main-control-panel', { state: 'visible' });
    await page.waitForSelector('wb-color-bars', { state: 'attached' });
    await page.waitForTimeout(2000); // Allow components to initialize
    
    // Test every input element with boundary values and loop detection
    const rangeInputs = await page.locator('input[type="range"]').all();
    console.log(`Found ${rangeInputs.length} range inputs to test`);
    
    for (let i = 0; i < rangeInputs.length; i++) {
      const input = rangeInputs[i];
      
      // Get input properties for boundary testing
      const min = await input.getAttribute('min') || '0';
      const max = await input.getAttribute('max') || '100';
      const id = await input.getAttribute('id') || `range-${i}`;
      const initialValue = await input.getAttribute('value') || '50';
      
      console.log(`Testing input ${id}: range ${min}-${max}, initial: ${initialValue}`);
      
      // Boundary values to test: min, min-1, min+1, max, max-1, max+1, null, undefined
      const boundaryValues = [
        min,                              // min value
        String(Number(min) - 1),         // min-1 (invalid)
        String(Number(min) + 1),         // min+1
        max,                              // max value
        String(Number(max) - 1),         // max-1
        String(Number(max) + 1),         // max+1 (invalid)
        '0',                             // zero
        String(Math.floor((Number(min) + Number(max)) / 2)) // middle value
      ];
      
      for (const value of boundaryValues) {
        console.log(`  Testing boundary value: ${value}`);
        
        // Test with timeout protection to catch infinite loops
        await Promise.race([
          (async () => {
            await input.fill(value);
            await page.waitForTimeout(100); // Allow any cascading updates
          })(),
          page.waitForTimeout(2000).then(() => {
            throw new Error(`Input ${id} fill(${value}) timed out - possible infinite loop`);
          })
        ]);
        
        // Verify no loop errors occurred
        expect(loopErrors).toHaveLength(0);
        
        // Verify the input handled the boundary value appropriately
        const actualValue = await input.getAttribute('value');
        const numValue = Number(actualValue);
        const numMin = Number(min);
        const numMax = Number(max);
        
        // Value should be clamped to valid range
        expect(numValue).toBeGreaterThanOrEqual(numMin);
        expect(numValue).toBeLessThanOrEqual(numMax);
        
        console.log(`    Result: ${value} -> ${actualValue}`);
      }
    }
    
    // Test every button with loop detection
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons to test`);
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent() || `button-${i}`;
      
      console.log(`Testing button: ${text}`);
      
      // Test button click with timeout protection
      await Promise.race([
        button.click(),
        page.waitForTimeout(2000).then(() => {
          throw new Error(`Button "${text}" click timed out - possible infinite loop`);
        })
      ]);
      
      await page.waitForTimeout(100);
      
      // Verify no loop errors occurred
      expect(loopErrors).toHaveLength(0);
    }
    
    // Test every select element with boundary options
    const selects = await page.locator('select').all();
    console.log(`Found ${selects.length} select elements to test`);
    
    for (let i = 0; i < selects.length; i++) {
      const select = selects[i];
      const options = await select.locator('option').all();
      const id = await select.getAttribute('id') || `select-${i}`;
      
      console.log(`Testing select ${id} with ${options.length} options`);
      
      // Test boundary options: first, last, and a few in between
      const optionsToTest = [];
      if (options.length > 0) optionsToTest.push(0); // first
      if (options.length > 1) optionsToTest.push(options.length - 1); // last
      if (options.length > 2) optionsToTest.push(Math.floor(options.length / 2)); // middle
      
      for (const optionIndex of optionsToTest) {
        const option = options[optionIndex];
        const value = await option.getAttribute('value');
        const text = await option.textContent();
        
        console.log(`  Testing option ${optionIndex}: ${text} (value: ${value})`);
        
        if (value !== null) {
          // Test option selection with timeout protection
          await Promise.race([
            select.selectOption(value),
            page.waitForTimeout(2000).then(() => {
              throw new Error(`Select ${id} option "${value}" timed out - possible infinite loop`);
            })
          ]);
          
          await page.waitForTimeout(100);
          
          // Verify no loop errors occurred
          expect(loopErrors).toHaveLength(0);
        }
      }
    }
    
    // Test wb-color-bars specific interactions
    const colorBars = await page.locator('wb-color-bars').all();
    console.log(`Found ${colorBars.length} wb-color-bars elements to test`);
    
    for (let i = 0; i < colorBars.length; i++) {
      const colorBar = colorBars[i];
      
      // Test hue changes that previously caused infinite loops
      const hueSliders = await colorBar.locator('input[type="range"]').all();
      
      for (let j = 0; j < hueSliders.length; j++) {
        const slider = hueSliders[j];
        const id = await slider.getAttribute('id') || `hue-slider-${i}-${j}`;
        
        console.log(`Testing color bar slider: ${id}`);
        
        // Test the specific hue values that caused loops
        const problematicValues = ['0', '60', '120', '180', '240', '300', '360'];
        
        for (const hueValue of problematicValues) {
          console.log(`  Testing hue value: ${hueValue}`);
          
          // This is where the infinite loop bug occurred
          await Promise.race([
            (async () => {
              await slider.fill(hueValue);
              await page.waitForTimeout(200); // Allow color updates
            })(),
            page.waitForTimeout(3000).then(() => {
              throw new Error(`Hue slider ${id} fill(${hueValue}) timed out - INFINITE LOOP DETECTED`);
            })
          ]);
          
          // CRITICAL: Verify no loop errors occurred
          if (loopErrors.length > 0) {
            throw new Error(`Infinite loop detected in hue slider ${id} with value ${hueValue}. Loop errors: ${loopErrors.join(', ')}`);
          }
        }
      }
    }
    
    // Final validation - no loops should have occurred during entire test
    expect(loopErrors).toHaveLength(0);
    
    console.log('✅ All control panel elements tested successfully with no infinite loops detected');
  });
  
  test('exception handling validation', async ({ page }) => {
    // Set up comprehensive exception monitoring
    const exceptions: Array<{ message: string; stack?: string; timestamp: number }> = [];
    
    page.on('pageerror', error => {
      exceptions.push({
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    });
    
    // Navigate to control panel
    await page.goto('http://localhost:3000/components/wb-control-panel/wb-control-panel-demo.html');
    await page.waitForSelector('#main-control-panel', { state: 'visible' });
    
    // Inject exception monitoring into the page
    await page.addInitScript(() => {
      const originalError = window.onerror;
      const originalRejection = window.onunhandledrejection;
      
      (window as any).testExceptions = [];
      
      window.onerror = function(message, source, lineno, colno, error) {
        (window as any).testExceptions.push({
          type: 'error',
          message: String(message),
          source,
          lineno,
          colno,
          stack: error?.stack,
          timestamp: Date.now()
        });
        
        if (originalError) {
          return originalError.call(this, message, source, lineno, colno, error);
        }
        return false;
      };
      
      window.onunhandledrejection = function(event) {
        (window as any).testExceptions.push({
          type: 'rejection',
          message: String(event.reason),
          stack: event.reason?.stack,
          timestamp: Date.now()
        });
        
        if (originalRejection) {
          originalRejection.call(window, event);
        }
      };
    });
    
    // Perform all the same interactions as before, but now monitoring for exceptions
    const rangeInputs = await page.locator('input[type="range"]').all();
    
    for (const input of rangeInputs) {
      const min = await input.getAttribute('min') || '0';
      const max = await input.getAttribute('max') || '100';
      
      // Test boundary values that might cause exceptions
      const testValues = [
        min, max, 
        String(Number(min) - 1), String(Number(max) + 1), // Out of bounds
        '', 'invalid', 'null', 'undefined' // Invalid values
      ];
      
      for (const value of testValues) {
        try {
          await input.fill(value);
          await page.waitForTimeout(100);
        } catch (error) {
          // Expected errors are OK, but uncaught exceptions are not
          console.log(`Expected error for value "${value}": ${error}`);
        }
      }
    }
    
    // Check for any uncaught exceptions that occurred
    const pageExceptions = await page.evaluate(() => (window as any).testExceptions || []);
    
    // Log any exceptions found for debugging
    if (pageExceptions.length > 0) {
      console.log('Uncaught exceptions detected:');
      pageExceptions.forEach((exc: any, index: number) => {
        console.log(`  ${index + 1}. ${exc.type}: ${exc.message}`);
        if (exc.stack) {
          console.log(`     Stack: ${exc.stack.split('\\n')[0]}`);
        }
      });
    }
    
    // Validate that no uncaught exceptions occurred
    expect(pageExceptions).toHaveLength(0);
    expect(exceptions).toHaveLength(0);
    
    console.log('✅ No uncaught exceptions detected during control panel testing');
  });
});