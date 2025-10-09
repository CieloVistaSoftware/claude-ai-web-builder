import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('Modal CSS Debug Tests', () => {
  const baseTest = new BaseUnitTest();
  
  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html');
    await page.waitForTimeout(3000);
  });

  test('Check CSS loading and rule application', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Check if modal CSS file is loaded
        const stylesheets = await page.evaluate(() => {
          const sheets = Array.from(document.styleSheets);
          return sheets.map(sheet => {
            try {
              return {
                href: sheet.href,
                rules: sheet.cssRules ? sheet.cssRules.length : 'Access denied'
              };
            } catch (e) {
              return {
                href: sheet.href,
                error: e.message
              };
            }
          });
        });
        
        console.log('Loaded stylesheets:', stylesheets);
    
        // Check for wb-modal CSS specifically
        const modalCSSLoaded = stylesheets.some(sheet => 
          sheet.href && sheet.href.includes('wb-modal.css')
        );
        console.log('Modal CSS loaded:', modalCSSLoaded);
    
        // Check if wb-modal class exists in CSS
        const modalCSSRules = await page.evaluate(() => {
          const rules = [];
          Array.from(document.styleSheets).forEach(sheet => {
            try {
              Array.from(sheet.cssRules).forEach(rule => {
                if (rule.selectorText && rule.selectorText.includes('.wb-modal')) {
                  rules.push({
                    selector: rule.selectorText,
                    style: rule.style.cssText
                  });
                }
              });
            } catch (e) {
              // Cross-origin or other restrictions
            }
          });
          return rules;
        });
        
        console.log('Modal CSS rules found:', modalCSSRules);
    
        // Create a modal and check its CSS
        await page.click('#basic-modal-btn');
        await page.waitForSelector('.wb-modal', { timeout: 2000 });
    
        // Check all CSS that applies to the modal
        const modalElement = page.locator('.wb-modal').first();
        
        const allStyles = await modalElement.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          const inline = el.style;
          
          return {
            computed: {
              position: computed.position,
              top: computed.top,
              left: computed.left,
              width: computed.width,
              height: computed.height,
              transform: computed.transform,
              opacity: computed.opacity,
              visibility: computed.visibility,
              zIndex: computed.zIndex
            },
            inline: {
              position: inline.position,
              top: inline.top,
              left: inline.left,
              width: inline.width,
              cssText: inline.cssText
            },
            classList: Array.from(el.classList),
            customProps: {
              modalTop: el.style.getPropertyValue('--wb-modal-top'),
              modalLeft: el.style.getPropertyValue('--wb-modal-left'),
              modalWidth: el.style.getPropertyValue('--wb-modal-width')
            }
          };
        });
        
        console.log('Modal element styles:', allStyles);
    
        // Check for CSS override conflicts
        const conflicts = await modalElement.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          const conflicts = [];
          
          // Check if position is being overridden
          if (computed.position !== 'absolute') {
            conflicts.push(`Position should be absolute but is: ${computed.position}`);
          }
          
          if (computed.top === 'auto') {
            conflicts.push('Top should use CSS custom property but is: auto');
          }
          
          if (computed.left === 'auto') {
            conflicts.push('Left should use CSS custom property but is: auto');
          }
          
          return conflicts;
        });
        
        console.log('CSS conflicts found:', conflicts);
    
        // Manually inject CSS to test if it works
        await page.addStyleTag({
          content: `
            .wb-modal {
              position: absolute !important;
              top: var(--wb-modal-top, 100px) !important;
              left: var(--wb-modal-left, 100px) !important;
              width: var(--wb-modal-width, 400px) !important;
              background: red !important;
              z-index: 9999 !important;
            }
          `
        });
    
        // Check if manual CSS injection works
        const stylesAfterInjection = await modalElement.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            position: computed.position,
            top: computed.top,
            left: computed.left,
            background: computed.background
          };
        });
        
        console.log('Styles after manual CSS injection:', stylesAfterInjection);
    
        // The modal should now be positioned correctly if CSS works
        const modalBounds = await modalElement.boundingBox();
        console.log('Modal bounds after CSS injection:', modalBounds);
    });
  });

  test('Force CSS via JavaScript', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Click to create modal
        await page.click('#basic-modal-btn');
        await page.waitForSelector('.wb-modal', { timeout: 2000 });
    
        // Force CSS directly via JavaScript
        const result = await page.evaluate(() => {
          const modal = document.querySelector('.wb-modal');
          const demoSection = document.querySelector('.demo-section');
          
          if (!modal || !demoSection) {
            return { error: 'Modal or demo section not found' };
          }
    
          // Get demo section position
          const rect = demoSection.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          
          // Calculate position
          const modalTop = rect.top + scrollTop;
          const modalLeft = rect.left + scrollLeft;
          const modalWidth = Math.min(rect.width, 500);
          
          // Force positioning via JavaScript
          modal.style.position = 'absolute';
          modal.style.top = modalTop + 'px';
          modal.style.left = modalLeft + 'px';
          modal.style.width = modalWidth + 'px';
          modal.style.transform = 'translateX(0)';
          modal.style.opacity = '1';
          modal.style.visibility = 'visible';
          modal.style.pointerEvents = 'auto';
          modal.style.zIndex = '9999';
          
          return {
            success: true,
            demoSectionRect: rect,
            calculatedPosition: { modalTop, modalLeft, modalWidth },
            finalStyles: {
              position: modal.style.position,
              top: modal.style.top,
              left: modal.style.left,
              width: modal.style.width
            }
          };
        });
        
        console.log('JavaScript positioning result:', result);
    
        // Take a screenshot
        await page.screenshot({ path: 'modal-js-positioning.png', fullPage: true });
    
        // Verify the modal is now positioned correctly
        const modal = page.locator('.wb-modal').first();
        await expect(modal).toBeVisible();
        
        const modalBounds = await modal.boundingBox();
        console.log('Modal bounds after JS positioning:', modalBounds);
    
        // Modal should now be in the demo section area
        if (result.success && modalBounds) {
          const expectedY = result.demoSectionRect.top + (window.pageYOffset || 0);
          expect(modalBounds.y).toBeCloseTo(expectedY, 50);
        }
    });
  });
});