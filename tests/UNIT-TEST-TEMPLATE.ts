/**
 * TEMPLATE: Proper Unit Test Structure for WB Components
 * 
 * This template shows how to write REAL unit tests that test individual methods
 * in isolation, not full page interactions.
 * 
 * CRITICAL REQUIREMENTS (MANDATORY for ALL tests):
 * - Universal loop detection to prevent infinite loops
 * - Uncaught exception handling with full stack traces
 * - Tests MUST fail immediately on any uncaught exception
 */

import { test, expect } from '@playwright/test';
import { 
  createLoopDetector, 
  setupUniversalLoopDetection,
  setupExceptionHandling,
  createTimeoutLoopDetector 
} from './universal-loop-detection.js';

test.describe('wb-[component-name] Unit Tests', () => {
  
  // Test individual methods in isolation WITH LOOP DETECTION
  test('methodName should do specific thing', async ({ page }) => {
    // Create minimal environment to test just one method
    await page.setContent(`
      <script type="module">
        import '../components/wb-[component-name]/wb-[component-name].js';
        
        // Import loop detection utilities
        import { createLoopDetector, setupUniversalLoopDetection } from '../tests/universal-loop-detection.js';
        
        // Create instance for testing
        const component = document.createElement('wb-[component-name]');
        document.body.appendChild(component);
        
        // UNIVERSAL PROTECTION: Setup comprehensive monitoring (loops + exceptions)
        const loopDetection = setupUniversalLoopDetection(component, {
          testName: 'methodName should do specific thing'
        });
        
        // Mock dependencies WITH loop detection
        let mockCallCount = 0;
        component.shadowRoot.querySelector = function(selector) {
          mockCallCount++;
          if (mockCallCount > 5) {
            throw new Error('Infinite loop detected in querySelector mock');
          }
          
          // Return mock elements instead of real DOM
          return {
            addEventListener: () => {},
            removeEventListener: () => {},
            value: 'mock-value'
          };
        };
        
        // Expose for testing
        window.testComponent = component;
        window.loopDetection = loopDetection;
      </script>
    `);
    
    // Test the specific method in isolation WITH TIMEOUT PROTECTION
    const result = await page.evaluate(async () => {
      const component = (window as any).testComponent;
      const loopDetection = (window as any).loopDetection;
      
      try {
        // Run operation with timeout to catch infinite loops
        const testResult = await loopDetection.runWithTimeout(async () => {
          // Setup test data
          const mockInput = { someProperty: 'test-value' };
          
          // Call the method we're testing
          const output = component.methodName(mockInput);
          
          // Return test results
          return {
            input: mockInput,
            output: output,
            internalState: component._someProperty,
            methodExists: typeof component.methodName === 'function'
          };
        }, 'methodName test');
        
        return {
          ...testResult,
          loopErrors: loopDetection.getConsoleErrors(),
          hasLoopError: loopDetection.hasLoopErrors(),
          exceptions: loopDetection.getExceptions(),
          hasExceptions: loopDetection.hasExceptions(),
          exceptionReport: loopDetection.getExceptionReport()
        };
      } finally {
        // Always cleanup
        loopDetection.cleanup();
      }
    });
    
    // Assert the method behaves correctly AND no loops/exceptions occurred
    expect(result.methodExists).toBe(true);
    expect(result.output).toBe('expected-result');
    expect(result.internalState).toBe('expected-state');
    
    // CRITICAL: Validate no loops occurred
    expect(result.hasLoopError).toBe(false);
    expect(result.loopErrors).toHaveLength(0);
    
    // CRITICAL: Validate no uncaught exceptions occurred
    expect(result.hasExceptions).toBe(false);
    if (result.hasExceptions) {
      console.error('Uncaught exceptions in test:', result.exceptionReport);
    }
    expect(result.exceptions).toHaveLength(0);
  });
  
  // Test error handling WITH EXCEPTION MONITORING
  test('methodName should handle invalid input gracefully', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import '../components/wb-[component-name]/wb-[component-name].js';
        import { setupExceptionHandling } from '../tests/universal-loop-detection.js';
        
        const component = document.createElement('wb-[component-name]');
        
        // EXCEPTION HANDLING: Monitor for uncaught exceptions
        const exceptionHandler = setupExceptionHandling('invalid input test');
        
        window.testComponent = component;
        window.exceptionHandler = exceptionHandler;
      </script>
    `);
    
    const result = await page.evaluate(() => {
      const component = (window as any).testComponent;
      const exceptionHandler = (window as any).exceptionHandler;
      
      try {
        // Test with invalid input
        const output = component.methodName(null);
        
        return { 
          success: true, 
          output, 
          error: null,
          exceptions: exceptionHandler.getExceptions(),
          hasExceptions: exceptionHandler.hasExceptions()
        };
      } catch (error) {
        return { 
          success: false, 
          output: null, 
          error: error instanceof Error ? error.message : String(error),
          exceptions: exceptionHandler.getExceptions(),
          hasExceptions: exceptionHandler.hasExceptions()
        };
      } finally {
        // Cleanup
        exceptionHandler.cleanup();
      }
    });
    
    // Should handle errors gracefully
    expect(result.success).toBe(true);
    expect(result.output).toBe('default-value'); // or whatever error handling does
    
    // CRITICAL: No uncaught exceptions should occur during error handling
    expect(result.hasExceptions).toBe(false);
    expect(result.exceptions).toHaveLength(0);
  });
  
  // Test event handlers in isolation
  test('eventHandler should update state correctly', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import '../components/wb-[component-name]/wb-[component-name].js';
        const component = document.createElement('wb-[component-name]');
        window.testComponent = component;
      </script>
    `);
    
    const result = await page.evaluate(() => {
      const component = (window as any).testComponent;
      
      // Mock event object
      const mockEvent = {
        detail: { value: 'new-value' },
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      
      // Call event handler directly
      component.handleSomeEvent(mockEvent);
      
      return {
        newState: component._someState,
        handlerExists: typeof component.handleSomeEvent === 'function'
      };
    });
    
    expect(result.handlerExists).toBe(true);
    expect(result.newState).toBe('new-value');
  });
});

/**
 * INTEGRATION TESTS (separate from unit tests)
 * These test component interactions and DOM integration
 */
test.describe('wb-[component-name] Integration Tests', () => {
  
  test('component should render correctly in DOM', async ({ page }) => {
    await page.goto('/components/wb-[component-name]/wb-[component-name]-demo.html');
    
    await page.waitForSelector('wb-[component-name]');
    
    const isVisible = await page.locator('wb-[component-name]').isVisible();
    expect(isVisible).toBe(true);
  });
  
  test('user interaction should trigger expected behavior', async ({ page }) => {
    await page.goto('/components/wb-[component-name]/wb-[component-name]-demo.html');
    
    // Test actual user interactions
    await page.click('[data-testid="some-button"]');
    
    const result = await page.locator('[data-testid="result"]').textContent();
    expect(result).toBe('expected-result');
  });
});

/**
 * SYSTEMATIC CONTROL TESTING (for components with controls)
 * This ensures every interactive element is tested
 */
test.describe('wb-[component-name] Control Testing', () => {
  
  test('systematically test every interactive element WITH LOOP DETECTION', async ({ page }) => {
    await page.goto('/components/wb-[component-name]/wb-[component-name]-demo.html');
    
    // UNIVERSAL LOOP DETECTION: Monitor console for loop errors
    const loopErrors: string[] = [];
    page.on('console', msg => {
      const text = msg.text().toLowerCase();
      if (['infinite', 'loop', 'recursion', 'stack overflow'].some(keyword => text.includes(keyword))) {
        loopErrors.push(msg.text());
      }
    });
    
    // Set timeout to detect hanging operations
    page.setDefaultTimeout(3000);
    
    // Wait for component
    await page.waitForSelector('wb-[component-name]');
    
    // Test every button WITH TIMEOUT PROTECTION
    const buttons = await page.locator('button').all();
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent();
      console.log(`Testing button: ${text}`);
      
      // Wrap each interaction with timeout to catch infinite loops
      await Promise.race([
        button.click(),
        page.waitForTimeout(2000).then(() => {
          throw new Error(`Button click timed out - possible infinite loop: ${text}`);
        })
      ]);
      
      await page.waitForTimeout(100);
      
      // CRITICAL: Check for loop errors after each interaction
      expect(loopErrors).toHaveLength(0);
    }
    
    // Test every input WITH BOUNDARY VALUES AND LOOP DETECTION
    const inputs = await page.locator('input').all();
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      console.log(`Testing input type: ${type}`);
      
      if (type === 'range') {
        // Test boundary values for range inputs
        const min = await input.getAttribute('min') || '0';
        const max = await input.getAttribute('max') || '100';
        const boundaryValues = [min, max, '50']; // min, max, middle
        
        for (const value of boundaryValues) {
          await Promise.race([
            input.fill(value),
            page.waitForTimeout(1000).then(() => {
              throw new Error(`Range input fill timed out - possible infinite loop: ${value}`);
            })
          ]);
          
          await page.waitForTimeout(50);
          expect(loopErrors).toHaveLength(0);
        }
      } else if (type === 'text') {
        // Test boundary values for text inputs
        const testValues = ['', 'test', 'a'.repeat(100)]; // empty, normal, long
        
        for (const value of testValues) {
          await Promise.race([
            input.fill(value),
            page.waitForTimeout(1000).then(() => {
              throw new Error(`Text input fill timed out - possible infinite loop: ${value}`);
            })
          ]);
          
          await page.waitForTimeout(50);
          expect(loopErrors).toHaveLength(0);
        }
      } else if (type === 'checkbox') {
        await Promise.race([
          (async () => {
            await input.check();
            await input.uncheck();
          })(),
          page.waitForTimeout(1000).then(() => {
            throw new Error(`Checkbox interaction timed out - possible infinite loop`);
          })
        ]);
      }
      
      await page.waitForTimeout(100);
    }
    
    // Test every select
    const selects = await page.locator('select').all();
    for (let i = 0; i < selects.length; i++) {
      const select = selects[i];
      const options = await select.locator('option').all();
      
      for (let j = 1; j < Math.min(options.length, 3); j++) {
        const value = await options[j].getAttribute('value');
        if (value) {
          await select.selectOption(value);
          await page.waitForTimeout(100);
        }
      }
    }
  });
});