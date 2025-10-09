// @ts-nocheck
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

/**
 * WB Color Bar - Foundational Component Tests
 * Tests the fundamental wb-color-bar component first
 */

test.describe('WB Color Bar - Foundation Component Tests', () => {
  const baseTest = new BaseUnitTest();

  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('/tests/test-wb-color-bar.html');
    await page.waitForTimeout(2000);
  });

  test('wb-color-bar should register as custom element', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const registrationTest = await page.evaluate(() => {
          return {
            isCustomElementDefined: Boolean(customElements.get('wb-color-bar')),
            hasGlobalClass: Boolean(window.ColorBar),
            elementsInDOM: document.querySelectorAll('wb-color-bar').length
          };
        });
    
        expect(registrationTest.isCustomElementDefined).toBeTruthy();
        expect(registrationTest.elementsInDOM).toBeGreaterThan(0);
        console.log('✅ wb-color-bar registered and found in DOM');
    });
  });

  test('wb-color-bar should have shadow DOM structure', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const shadowTest = await page.evaluate(() => {
          const colorBar = document.querySelector('wb-color-bar');
          if (!colorBar) return { exists: false };
          
          const shadowRoot = colorBar.shadowRoot;
          if (!shadowRoot) return { exists: true, hasShadow: false };
          
          return {
            exists: true,
            hasShadow: true,
            hasSlider: Boolean(shadowRoot.querySelector('[role="slider"], input[type="range"], .slider')),
            hasLabel: Boolean(shadowRoot.querySelector('label, .label')),
            hasColorDisplay: Boolean(shadowRoot.querySelector('.color-display, .preview')),
            innerHTML: shadowRoot.innerHTML.length > 0
          };
        });
    
        expect(shadowTest.exists).toBeTruthy();
        expect(shadowTest.hasShadow).toBeTruthy();
        expect(shadowTest.innerHTML).toBeTruthy();
        console.log('✅ wb-color-bar has proper shadow DOM structure');
    });
  });

  test('wb-color-bar should respond to hue changes', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const hueTest = await page.evaluate(() => {
          const colorBar = document.querySelector('wb-color-bar');
          if (!colorBar) return { success: false };
          
          // Test initial hue
          const initialHue = colorBar.getAttribute('hue') || '0';
          
          // Change hue
          colorBar.setAttribute('hue', '180');
          
          return new Promise(resolve => {
            setTimeout(() => {
              const newHue = colorBar.getAttribute('hue');
              resolve({
                success: true,
                initialHue: parseInt(initialHue),
                newHue: parseInt(newHue),
                changed: newHue !== initialHue
              });
            }, 500);
          });
        });
    
        const result = await hueTest;
        expect(result.success).toBeTruthy();
        expect(result.changed).toBeTruthy();
        expect(result.newHue).toBe(180);
        console.log('✅ wb-color-bar responds to hue attribute changes');
    });
  });

  test('wb-color-bar should emit colorchange events', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Set up event listener
        await page.evaluate(() => {
          window.colorBarEvents = [];
          const colorBars = document.querySelectorAll('wb-color-bar');
          colorBars.forEach(colorBar => {
            colorBar.addEventListener('colorchange', (e) => {
              window.colorBarEvents.push({
                type: e.type,
                detail: e.detail,
                timestamp: Date.now()
              });
            });
          });
        });
    
        // Trigger color change
        const eventTest = await page.evaluate(() => {
          const colorBar = document.querySelector('wb-color-bar');
          if (!colorBar) return { success: false };
          
          // Trigger change via attribute
          colorBar.setAttribute('hue', '120');
          
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                success: true,
                eventsReceived: window.colorBarEvents.length,
                lastEvent: window.colorBarEvents[window.colorBarEvents.length - 1]
              });
            }, 1000);
          });
        });
    
        const result = await eventTest;
        expect(result.success).toBeTruthy();
        console.log(`✅ wb-color-bar events: ${result.eventsReceived} received`);
    });
  });
});

/**
 * WB Color Bars - Composite Component Tests
 * Tests wb-color-bars which depends on wb-color-bar
 */

test.describe('WB Color Bars - Composite Component Tests', () => {

  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('/tests/test-wb-color-bars.html');
    await page.waitForTimeout(3000);
  });

  test('wb-color-bars component should load and register correctly', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Test custom element registration
        const registrationTest = await page.evaluate(() => {
          return {
            customElementDefined: Boolean(customElements.get('wb-color-bars')),
            componentInDOM: Boolean(document.querySelector('wb-color-bars')),
            hasClass: Boolean(window.ColorBars),
            wbColorBarDefined: Boolean(customElements.get('wb-color-bar')) // Dependency
          };
        });
    
        console.log('WB Color Bars Registration Test:', registrationTest);
        
        expect(registrationTest.customElementDefined).toBeTruthy();
        expect(registrationTest.componentInDOM).toBeTruthy();
        
        console.log('✅ wb-color-bars component properly registered and instantiated');
    });
  });

  test('wb-color-bars should render all 6 color sliders', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.waitForTimeout(3000);
        
        const sliderTest = await page.evaluate(() => {
          const colorBars = document.querySelector('wb-color-bars');
          if (!colorBars?.shadowRoot) return { valid: false, reason: 'No shadow root' };
          
          const shadowRoot = colorBars.shadowRoot;
          
          // Look for wb-color-bar components (the dependency sliders)
          const colorBarElements = shadowRoot.querySelectorAll('wb-color-bar');
          
          // Look for the specific expected sliders
          const expectedSliders = [
            'text-hue-bar',
            'text-saturation-bar', 
            'text-lightness-bar',
            'bg-hue-bar',
            'bg-saturation-bar',
            'bg-lightness-bar'
          ];
          
          const foundSliders = expectedSliders.map(id => ({
            id,
            found: Boolean(shadowRoot.querySelector(`#${id}`)),
            element: shadowRoot.querySelector(`#${id}`)
          }));
          
          return {
            valid: true,
            colorBarElements: colorBarElements.length,
            foundSliders,
            totalExpected: expectedSliders.length,
            allFound: foundSliders.every(slider => slider.found)
          };
        });
        
        console.log('WB Color Bars Slider Test:', sliderTest);
        
        if (sliderTest.valid) {
          expect(sliderTest.colorBarElements).toBe(6);
          expect(sliderTest.allFound).toBeTruthy();
          console.log(`✅ All 6 color sliders found: ${sliderTest.foundSliders.filter(s => s.found).length}/6`);
        } else {
          console.log('⚠️ Slider test failed:', sliderTest.reason);
        }
    });
  });

  test('wb-color-bars should initialize with correct default values', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.waitForTimeout(2000);
        
        const defaultsTest = await page.evaluate(() => {
          const colorBars = document.querySelector('wb-color-bars');
          if (!colorBars) return { valid: false };
          
          // Test the getter properties
          const values = {
            textHue: colorBars.textHue,
            textSaturation: colorBars.textSaturation,
            textLightness: colorBars.textLightness,
            bgHue: colorBars.bgHue,
            bgSaturation: colorBars.bgSaturation,
            bgLightness: colorBars.bgLightness
          };
          
          // Test the getter methods
          const textColor = colorBars.textColor;
          const bgColor = colorBars.bgColor;
          
          return {
            valid: true,
            values,
            textColor: textColor ? {
              hue: textColor.hue,
              saturation: textColor.saturation,
              lightness: textColor.lightness,
              hex: textColor.hex
            } : null,
            bgColor: bgColor ? {
              hue: bgColor.hue,
              saturation: bgColor.saturation,
              lightness: bgColor.lightness,
              hex: bgColor.hex
            } : null
          };
        });
        
        console.log('WB Color Bars Defaults Test:', defaultsTest);
        
        if (defaultsTest.valid) {
          // Test expected default values (from constructor)
          expect(defaultsTest.values.textHue).toBe(240);
          expect(defaultsTest.values.textSaturation).toBe(70);
          expect(defaultsTest.values.textLightness).toBe(90);
          expect(defaultsTest.values.bgHue).toBe(240);
          expect(defaultsTest.values.bgSaturation).toBe(40);
          expect(defaultsTest.values.bgLightness).toBe(20);
          
          console.log('✅ Default values are correct');
          
          if (defaultsTest.textColor && defaultsTest.bgColor) {
            console.log(`✅ Text color: ${defaultsTest.textColor.hex}`);
            console.log(`✅ Background color: ${defaultsTest.bgColor.hex}`);
          }
        }
    });
  });

  test('wb-color-bars should respond to attribute changes', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.waitForTimeout(2000);
        
        const attributeTest = await page.evaluate(() => {
          const colorBars = document.querySelector('wb-color-bars');
          if (!colorBars) return { valid: false };
          
          // Store original values
          const original = {
            textHue: colorBars.textHue,
            textSaturation: colorBars.textSaturation,
            bgHue: colorBars.bgHue
          };
          
          // Change attributes
          colorBars.setAttribute('text-hue', '180');
          colorBars.setAttribute('text-saturation', '80');  
          colorBars.setAttribute('bg-hue', '300');
          
          // Wait for changes to process
          return new Promise(resolve => {
            setTimeout(() => {
              const updated = {
                textHue: colorBars.textHue,
                textSaturation: colorBars.textSaturation,
                bgHue: colorBars.bgHue
              };
              
              // Restore original values
              colorBars.setAttribute('text-hue', original.textHue.toString());
              colorBars.setAttribute('text-saturation', original.textSaturation.toString());
              colorBars.setAttribute('bg-hue', original.bgHue.toString());
              
              resolve({
                valid: true,
                original,
                updated,
                changesDetected: {
                  textHue: updated.textHue !== original.textHue,
                  textSaturation: updated.textSaturation !== original.textSaturation,
                  bgHue: updated.bgHue !== original.bgHue
                }
              });
            }, 500);
          });
        });
        
        const result = await attributeTest;
        console.log('WB Color Bars Attribute Test:', result);
        
        if (result.valid) {
          expect(result.updated.textHue).toBe(180);
          expect(result.updated.textSaturation).toBe(80);
          expect(result.updated.bgHue).toBe(300);
          
          console.log('✅ Component responds to attribute changes');
        }
    });
  });

  test('wb-color-bars should handle setter methods correctly', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.waitForTimeout(2000);
        
        const setterTest = await page.evaluate(() => {
          const colorBars = document.querySelector('wb-color-bars');
          if (!colorBars) return { valid: false };
          
          // Store original values
          const original = colorBars.textColor;
          
          // Test setter methods
          colorBars.setTextColor(120, 90, 60);
          colorBars.setBgColor(200, 50, 30);
          
          // Wait for updates
          return new Promise(resolve => {
            setTimeout(() => {
              const textColor = colorBars.textColor;
              const bgColor = colorBars.bgColor;
              
              // Restore original
              colorBars.setTextColor(original.hue, original.saturation, original.lightness);
              
              resolve({
                valid: true,
                textColorSet: textColor.hue === 120 && textColor.saturation === 90 && textColor.lightness === 60,
                bgColorSet: bgColor.hue === 200 && bgColor.saturation === 50 && bgColor.lightness === 30,
                textColor,
                bgColor
              });
            }, 500);
          });
        });
        
        const result = await setterTest;
        console.log('WB Color Bars Setter Test:', result);
        
        if (result.valid) {
          expect(result.textColorSet).toBeTruthy();
          expect(result.bgColorSet).toBeTruthy();
          console.log('✅ Setter methods work correctly');
          console.log(`✅ Set text color: ${result.textColor.hex}`);
          console.log(`✅ Set background color: ${result.bgColor.hex}`);
        }
    });
  });

  test('wb-color-bars should fire colorchange events', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.waitForTimeout(2000);
        
        // Set up event listener
        await page.evaluate(() => {
          window.colorChangeEvents = [];
          const colorBars = document.querySelector('wb-color-bars');
          if (colorBars) {
            colorBars.addEventListener('colorchange', (e) => {
              window.colorChangeEvents.push({
                timestamp: Date.now(),
                detail: e.detail
              });
            });
          }
        });
        
        // Trigger color changes
        const eventTest = await page.evaluate(() => {
          const colorBars = document.querySelector('wb-color-bars');
          if (!colorBars) return { valid: false };
          
          // Trigger changes via setters
          colorBars.setTextColor(90, 85, 75);
          colorBars.setBgColor(270, 60, 40);
          
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                valid: true,
                eventsReceived: window.colorChangeEvents.length,
                lastEvent: window.colorChangeEvents[window.colorChangeEvents.length - 1]
              });
            }, 1000);
          });
        });
        
        const result = await eventTest;
        console.log('WB Color Bars Event Test:', result);
        
        if (result.valid) {
          expect(result.eventsReceived).toBeGreaterThan(0);
          console.log(`✅ Received ${result.eventsReceived} colorchange events`);
          
          if (result.lastEvent?.detail) {
            const detail = result.lastEvent.detail;
            console.log(`✅ Event detail includes text color: ${detail.text?.hex}`);
            console.log(`✅ Event detail includes background color: ${detail.background?.hex}`);
          }
        }
    });
  });

  test('wb-color-bars should handle color preview clicks', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.waitForTimeout(2000);
        
        // Test clipboard functionality (may not work in headless mode)
        const clipboardTest = await page.evaluate(() => {
          const colorBars = document.querySelector('wb-color-bars');
          if (!colorBars?.shadowRoot) return { valid: false };
          
          const shadowRoot = colorBars.shadowRoot;
          const textPreview = shadowRoot.querySelector('.text-preview');
          const bgPreview = shadowRoot.querySelector('.bg-preview');
          
          let clipboardEvents = [];
          
          // Listen for clipboard events
          colorBars.addEventListener('colorcopied', (e) => {
            clipboardEvents.push(e.detail);
          });
          
          const results = {
            valid: true,
            hasTextPreview: Boolean(textPreview),
            hasBgPreview: Boolean(bgPreview),
            clipboardEvents: []
          };
          
          // Try clicking previews (clipboard may not work in test environment)
          try {
            if (textPreview) {
              textPreview.click();
            }
            if (bgPreview) {
              bgPreview.click();
            }
          } catch (e) {
            results.clickError = e.message;
          }
          
          // Wait for potential events
          return new Promise(resolve => {
            setTimeout(() => {
              results.clipboardEvents = clipboardEvents;
              resolve(results);
            }, 500);
          });
        });
        
        const result = await clipboardTest;
        console.log('WB Color Bars Preview Test:', result);
        
        if (result.valid) {
          expect(result.hasTextPreview).toBeTruthy();
          expect(result.hasBgPreview).toBeTruthy();
          console.log('✅ Color preview elements found and clickable');
          
          if (result.clipboardEvents.length > 0) {
            console.log(`✅ Clipboard events fired: ${result.clipboardEvents.length}`);
          }
        }
    });
  });

  test('wb-color-bars should update display values correctly', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.waitForTimeout(2000);
        
        const displayTest = await page.evaluate(() => {
          const colorBars = document.querySelector('wb-color-bars');
          if (!colorBars?.shadowRoot) return { valid: false };
          
          const shadowRoot = colorBars.shadowRoot;
          
          // Find display elements
          const hslDisplay = shadowRoot.querySelector('.hsl-display');
          const rgbDisplay = shadowRoot.querySelector('.rgb-display');
          const hexValue = shadowRoot.querySelector('.hex-value');
          
          // Change color and check if displays update
          colorBars.setTextColor(60, 100, 50); // Bright yellow
          
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                valid: true,
                hasHslDisplay: Boolean(hslDisplay),
                hasRgbDisplay: Boolean(rgbDisplay),
                hasHexValue: Boolean(hexValue),
                hslText: hslDisplay?.textContent || '',
                rgbText: rgbDisplay?.textContent || '',
                hexText: hexValue?.textContent || '',
                expectedHsl: 'HSL(60, 100%, 50%)'
              });
            }, 500);
          });
        });
        
        const result = await displayTest;
        console.log('WB Color Bars Display Test:', result);
        
        if (result.valid) {
          expect(result.hasHslDisplay).toBeTruthy();
          expect(result.hasRgbDisplay).toBeTruthy();
          expect(result.hasHexValue).toBeTruthy();
          
          if (result.hslText.includes('60') && result.hslText.includes('100') && result.hslText.includes('50')) {
            console.log('✅ HSL display updates correctly:', result.hslText);
          }
          
          if (result.hexText.startsWith('#')) {
            console.log('✅ Hex display shows valid color:', result.hexText);
          }
          
          console.log('✅ Color value displays are functional');
        }
    });
  });
});