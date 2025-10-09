import { test, expect } from '@playwright/test';

/**
 * PROPER UNIT TESTS for wb-color-bars component methods
 * These test individual methods in isolation with proper mocking
 */
test.describe('wb-color-bars Unit Tests', () => {
  
  test('handleTextHueChange method should update values without infinite loop', async ({ page }) => {
    // Create minimal test environment for just this method
    await page.setContent(`
      <script type="module">
        import '../components/wb-color-bars/wb-color-bars.js';
        
        const colorBars = document.createElement('wb-color-bars');
        document.body.appendChild(colorBars);
        
        // Extend window interface for testing
        window.testColorBars = colorBars;
      </script>
    `);
    
    await page.waitForSelector('wb-color-bars');
    
    // Test the specific method
    const result = await page.evaluate(() => {
      const colorBars = (window as any).testColorBars;
      const initialHue = colorBars._textHue;
      
      // Mock the event object - UNIT TEST: test just this method
      const mockEvent = {
        detail: { hue: 180, value: 180 }
      };
      
      // Test the method directly without side effects
      colorBars.handleTextHueChange(mockEvent);
      
      return {
        initialHue,
        newHue: colorBars._textHue,
        methodExists: typeof colorBars.handleTextHueChange === 'function'
      };
    });
    
    expect(result.methodExists).toBe(true);
    expect(result.newHue).toBe(180);
    expect(result.newHue).not.toBe(result.initialHue);
  });
  
  test('updateTextColorBars method should not trigger infinite events', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import '../components/wb-color-bars/wb-color-bars.js';
        const colorBars = document.createElement('wb-color-bars');
        document.body.appendChild(colorBars);
        window.testColorBars = colorBars;
        window.eventCount = 0;
        
        // Mock the color bar elements to track method calls
        colorBars.shadowRoot.querySelector = function(selector) {
          if (selector === '#text-saturation-bar') {
            return {
              updateContext: () => {},
              updateValueSilently: () => { window.eventCount++; },
              _value: 50
            };
          }
          return null;
        };
      </script>
    `);
    
    const eventCount = await page.evaluate(() => {
      const colorBars = (window as any).testColorBars;
      (window as any).eventCount = 0;
      
      // Call the method that was causing infinite loops
      colorBars._textSaturation = 75;
      colorBars.updateTextColorBars();
      
      return (window as any).eventCount;
    });
    
    // Should only call updateValueSilently once, not trigger infinite events
    expect(eventCount).toBeLessThanOrEqual(2);
  });

  test('dispatchColorChange method should create proper event structure', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import '../components/wb-color-bars/wb-color-bars.js';
        const colorBars = document.createElement('wb-color-bars');
        document.body.appendChild(colorBars);
        window.testColorBars = colorBars;
        window.lastEvent = null;
        
        colorBars.addEventListener('colorchange', (e) => {
          window.lastEvent = e.detail;
        });
      </script>
    `);
    
    const eventDetail = await page.evaluate(() => {
      const colorBars = (window as any).testColorBars;
      
      // Set test values
      colorBars._textHue = 240;
      colorBars._textSaturation = 70;
      colorBars._textLightness = 50;
      
      // Call method
      colorBars.dispatchColorChange();
      
      return (window as any).lastEvent;
    });
    
    expect(eventDetail).toBeTruthy();
    expect(eventDetail.text).toBeTruthy();
    expect(eventDetail.text.hue).toBe(240);
    expect(eventDetail.text.saturation).toBe(70);
    expect(eventDetail.text.lightness).toBe(50);
    expect(eventDetail.text.hsl).toBe('hsl(240, 70%, 50%)');
  });
});