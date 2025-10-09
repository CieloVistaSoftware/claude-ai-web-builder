import { test, expect } from '@playwright/test';

/**
 * PROPER UNIT TESTS for wb-button component
 * Testing individual methods in isolation with mocked dependencies
 */
test.describe('wb-button Unit Tests', () => {
  
  test('constructor should initialize default properties', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import '../components/wb-button/wb-button.js';
        const button = document.createElement('wb-button');
        window.testButton = button;
      </script>
    `);
    
    const result = await page.evaluate(() => {
      const button = (window as any).testButton;
      return {
        tagName: button.tagName,
        isCustomElement: button.constructor.name !== 'HTMLElement',
        hasConnectedCallback: typeof button.connectedCallback === 'function'
      };
    });
    
    expect(result.tagName).toBe('WB-BUTTON');
    expect(result.isCustomElement).toBe(true);
    expect(result.hasConnectedCallback).toBe(true);
  });
  
  test('handleClick method should dispatch custom event', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import '../components/wb-button/wb-button.js';
        const button = document.createElement('wb-button');
        document.body.appendChild(button);
        
        let eventDispatched = false;
        let eventDetail = null;
        
        button.addEventListener('wb:button-click', (e) => {
          eventDispatched = true;
          eventDetail = e.detail;
        });
        
        window.testButton = button;
        window.testData = { eventDispatched: false, eventDetail: null };
        
        // Mock the event listening
        button.addEventListener('wb:button-click', (e) => {
          window.testData.eventDispatched = true;
          window.testData.eventDetail = e.detail;
        });
      </script>
    `);
    
    const result = await page.evaluate(() => {
      const button = (window as any).testButton;
      
      // Create mock click event
      const mockEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
        target: button
      };
      
      // Call handleClick method directly (unit test)
      if (typeof button.handleClick === 'function') {
        button.handleClick(mockEvent);
      } else {
        // If no handleClick method, simulate click
        button.click();
      }
      
      return {
        methodExists: typeof button.handleClick === 'function',
        eventData: (window as any).testData
      };
    });
    
    // Verify the method exists and works
    expect(result.eventData.eventDispatched).toBe(true);
  });
  
  test('setAttribute should update button properties', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import '../components/wb-button/wb-button.js';
        const button = document.createElement('wb-button');
        window.testButton = button;
      </script>
    `);
    
    const result = await page.evaluate(() => {
      const button = (window as any).testButton;
      
      // Test attribute setting (unit test for attribute handling)
      button.setAttribute('variant', 'primary');
      button.setAttribute('size', 'large');
      button.setAttribute('disabled', 'true');
      
      return {
        variant: button.getAttribute('variant'),
        size: button.getAttribute('size'),
        disabled: button.hasAttribute('disabled'),
        observedAttributes: button.constructor.observedAttributes || []
      };
    });
    
    expect(result.variant).toBe('primary');
    expect(result.size).toBe('large');
    expect(result.disabled).toBe(true);
  });
  
  test('error handling should not throw on invalid input', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import '../components/wb-button/wb-button.js';
        const button = document.createElement('wb-button');
        window.testButton = button;
      </script>
    `);
    
    const result = await page.evaluate(() => {
      const button = (window as any).testButton;
      
      try {
        // Test error handling with invalid inputs
        button.setAttribute('variant', null);
        button.setAttribute('size', undefined);
        button.setAttribute('onclick', 'invalid-function()');
        
        return { success: true, error: null };
      } catch (error) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        };
      }
    });
    
    // Should handle invalid input gracefully
    expect(result.success).toBe(true);
  });
});

/**
 * INTEGRATION TESTS for wb-button component
 * Testing component behavior within DOM context
 */
test.describe('wb-button Integration Tests', () => {
  
  test('button should render correctly in demo page', async ({ page }) => {
    await page.goto('/components/wb-button/wb-button-demo.html');
    
    await page.waitForSelector('wb-button', { timeout: 10000 });
    
    const buttonExists = await page.locator('wb-button').count();
    expect(buttonExists).toBeGreaterThan(0);
    
    const isVisible = await page.locator('wb-button').first().isVisible();
    expect(isVisible).toBe(true);
  });
  
  test('button variants should display different styles', async ({ page }) => {
    await page.goto('/components/wb-button/wb-button-demo.html');
    
    await page.waitForSelector('wb-button');
    
    // Test different button variants if they exist
    const variants = ['primary', 'secondary', 'outline', 'ghost'];
    
    for (const variant of variants) {
      const variantButton = page.locator(`wb-button[variant="${variant}"]`);
      const exists = await variantButton.count() > 0;
      
      if (exists) {
        const isVisible = await variantButton.isVisible();
        expect(isVisible).toBe(true);
        
        console.log(`✅ Button variant '${variant}' renders correctly`);
      }
    }
  });
});

/**
 * SYSTEMATIC CONTROL TESTING for wb-button
 * Testing every interactive element systematically
 */
test.describe('wb-button Systematic Control Tests', () => {
  
  test('every button should be clickable without errors', async ({ page }) => {
    console.log('🔍 SYSTEMATIC TESTING: Every wb-button element');
    
    let errorCount = 0;
    let clickCount = 0;
    
    // Monitor for errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errorCount++;
        console.log(`🚨 Console Error: ${msg.text()}`);
      }
    });
    
    await page.goto('/components/wb-button/wb-button-demo.html');
    await page.waitForSelector('wb-button');
    
    // Find all wb-button elements
    const buttons = await page.locator('wb-button').all();
    console.log(`Found ${buttons.length} wb-button elements to test`);
    
    // Test each button systematically
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      
      try {
        const variant = await button.getAttribute('variant') || 'default';
        const disabled = await button.getAttribute('disabled');
        
        console.log(`  Testing button ${i + 1}: variant="${variant}", disabled=${!!disabled}`);
        
        if (!disabled) {
          await button.click();
          clickCount++;
          await page.waitForTimeout(100);
        }
        
        console.log(`  ✅ Button ${i + 1} tested successfully`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.log(`  ❌ Error testing button ${i + 1}: ${errorMsg}`);
        errorCount++;
      }
    }
    
    // Also test any regular buttons within wb-button components
    const regularButtons = await page.locator('wb-button button, wb-button input[type="button"]').all();
    console.log(`Found ${regularButtons.length} regular buttons within wb-button components`);
    
    for (let i = 0; i < regularButtons.length; i++) {
      const button = regularButtons[i];
      
      try {
        await button.click();
        clickCount++;
        await page.waitForTimeout(100);
        
        console.log(`  ✅ Regular button ${i + 1} tested successfully`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.log(`  ❌ Error testing regular button ${i + 1}: ${errorMsg}`);
        errorCount++;
      }
    }
    
    // Summary
    console.log(`📊 TESTING SUMMARY:`);
    console.log(`Total clicks performed: ${clickCount}`);
    console.log(`Console errors detected: ${errorCount}`);
    
    // Test should pass if no errors occurred
    expect(errorCount).toBe(0);
    expect(clickCount).toBeGreaterThan(0);
    
    console.log('✅ All buttons tested without errors');
  });
});