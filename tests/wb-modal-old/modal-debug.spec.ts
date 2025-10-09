import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('Modal Debug Tests', () => {
  const baseTest = new BaseUnitTest();
  
  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html');
    await page.waitForTimeout(3000);
  });

  test('Debug modal positioning step by step', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Clear any existing modals
        await page.evaluate(() => {
          document.querySelectorAll('.wb-modal').forEach(modal => modal.remove());
          document.querySelectorAll('.wb-modal-backdrop').forEach(backdrop => backdrop.remove());
        });
    
        // Get the basic modal button
        const button = page.locator('#basic-modal-btn');
        const buttonBounds = await button.boundingBox();
        console.log('Button bounds:', buttonBounds);
    
        // Get the demo-section that contains this button
        const demoSection = button.locator('..').locator('..');  // Parent of parent
        const demoSectionBounds = await demoSection.boundingBox();
        console.log('Demo section bounds:', demoSectionBounds);
    
        // Override the modal show function to debug positioning
        await page.evaluate(() => {
          const originalShow = window.WBModal.show;
          window.WBModal.show = function(modal, triggerElement) {
            console.log('=== MODAL SHOW DEBUG ===');
            console.log('Modal element:', modal);
            console.log('Trigger element:', triggerElement);
            
            if (triggerElement) {
              const demoSection = triggerElement.closest('.demo-section') || triggerElement.closest('.hero-demo');
              console.log('Found demo section:', demoSection);
              
              if (demoSection) {
                const sectionRect = demoSection.getBoundingClientRect();
                console.log('Section rect:', sectionRect);
                
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                console.log('Scroll offsets:', { scrollTop, scrollLeft });
                
                const modalTop = sectionRect.top + scrollTop;
                const modalLeft = sectionRect.left + scrollLeft;
                const modalWidth = Math.min(sectionRect.width, 500);
                
                console.log('Calculated modal position:', { modalTop, modalLeft, modalWidth });
                
                modal.style.setProperty('--wb-modal-top', modalTop + 'px');
                modal.style.setProperty('--wb-modal-left', modalLeft + 'px');
                modal.style.setProperty('--wb-modal-width', modalWidth + 'px');
                
                // Debug: Check if CSS properties are set
                console.log('Modal CSS properties set:');
                console.log('--wb-modal-top:', modal.style.getPropertyValue('--wb-modal-top'));
                console.log('--wb-modal-left:', modal.style.getPropertyValue('--wb-modal-left'));
                console.log('--wb-modal-width:', modal.style.getPropertyValue('--wb-modal-width'));
              } else {
                console.log('No demo section found, using fallback');
              }
            } else {
              console.log('No trigger element provided');
            }
            
            return originalShow.call(this, modal, triggerElement);
          };
        });
    
        // Click the button
        await button.click();
    
        // Wait for modal to appear
        await page.waitForSelector('.wb-modal', { timeout: 2000 });
        
        // Check modal position
        const modal = page.locator('.wb-modal').first();
        const modalBounds = await modal.boundingBox();
        console.log('Final modal bounds:', modalBounds);
    
        // Check computed styles
        const modalStyles = await modal.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            position: computed.position,
            top: computed.top,
            left: computed.left,
            transform: computed.transform,
            width: computed.width,
            height: computed.height
          };
        });
        console.log('Modal computed styles:', modalStyles);
    
        // Check CSS custom properties
        const customProps = await modal.evaluate((el) => {
          return {
            modalTop: el.style.getPropertyValue('--wb-modal-top'),
            modalLeft: el.style.getPropertyValue('--wb-modal-left'),
            modalWidth: el.style.getPropertyValue('--wb-modal-width')
          };
        });
        console.log('Custom CSS properties:', customProps);
    
        // The modal should be positioned over the demo-section, not at the bottom
        if (modalBounds && demoSectionBounds) {
          expect(modalBounds.y).toBeLessThan(demoSectionBounds.y + demoSectionBounds.height + 100);
          expect(modalBounds.y).toBeGreaterThan(demoSectionBounds.y - 100);
        }
    });
  });

  test('Test with forced positioning', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Add debugging CSS
        await page.addStyleTag({
          content: `
            .wb-modal {
              border: 3px solid red !important;
              background: rgba(255, 0, 0, 0.1) !important;
            }
            .demo-section {
              border: 3px solid blue !important;
              background: rgba(0, 0, 255, 0.1) !important;
            }
          `
        });
    
        // Click basic modal
        await page.click('#basic-modal-btn');
        
        // Wait for modal
        await page.waitForSelector('.wb-modal', { timeout: 2000 });
        
        // Force position the modal correctly
        await page.evaluate(() => {
          const modal = document.querySelector('.wb-modal');
          const demoSection = document.querySelector('.demo-section');
          
          if (modal && demoSection) {
            const rect = demoSection.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            // Force the modal to appear at demo-section position
            modal.style.position = 'absolute';
            modal.style.top = (rect.top + scrollTop) + 'px';
            modal.style.left = (rect.left + scrollLeft) + 'px';
            modal.style.width = Math.min(rect.width, 500) + 'px';
            modal.style.transform = 'translateX(0)';
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            modal.style.pointerEvents = 'auto';
            
            console.log('Forced modal position:', {
              top: modal.style.top,
              left: modal.style.left,
              width: modal.style.width
            });
          }
        });
    
        // Take a screenshot for visual verification
        await page.screenshot({ path: 'modal-positioning-debug.png', fullPage: true });
        
        // Check if modal is now positioned correctly
        const modal = page.locator('.wb-modal').first();
        const modalBounds = await modal.boundingBox();
        console.log('Forced modal bounds:', modalBounds);
        
        // The modal should now be visible and positioned over demo-section
        await expect(modal).toBeVisible();
    });
  });
});