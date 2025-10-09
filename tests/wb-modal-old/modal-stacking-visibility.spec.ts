import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('Modal Stacking Visibility Tests', () => {
  const baseTest = new BaseUnitTest();
  
  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.waitForTimeout(3000);
  });
  });

  test('Multiple modals stack with visible offset positioning', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🧪 Testing modal stacking with visible offsets');
    
        // Add visual indicators to see stacking clearly
        await page.addStyleTag({
          content: `
            .wb-modal {
              border: 3px solid red !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
            }
            .wb-modal:nth-child(1) { border-color: red !important; }
            .wb-modal:nth-child(2) { border-color: blue !important; }
            .wb-modal:nth-child(3) { border-color: green !important; }
            .wb-modal::before {
              content: "Modal " attr(data-stack-index);
              position: absolute;
              top: -25px;
              left: 10px;
              background: var(--modal-color, red);
              color: white;
              padding: 2px 8px;
              font-size: 12px;
              border-radius: 4px;
              font-weight: bold;
            }
          `
        });
    
        // Override modal creation to add stack indicators
        await page.evaluate(() => {
          if (window.WBModal && window.WBModal.show) {
            const originalShow = window.WBModal.show;
            window.WBModal.show = function(modal, triggerElement) {
              // Add stack index to modal for debugging
              const stackIndex = document.querySelectorAll('.wb-modal').length;
              modal.setAttribute('data-stack-index', stackIndex + 1);
              
              const colors = ['red', 'blue', 'green', 'orange', 'purple'];
              modal.style.setProperty('--modal-color', colors[stackIndex] || 'gray');
              
              console.log(`Opening modal ${stackIndex + 1}`);
              return originalShow.call(this, modal, triggerElement);
            };
          }
        });
    
        // Step 1: Open first modal
        console.log('📝 Opening first modal...');
        await page.click('#basic-modal-btn');
        await page.waitForSelector('.wb-modal.wb-modal--open', { timeout: 2000 });
        
        const firstModal = page.locator('.wb-modal.wb-modal--open').first();
        const firstModalBounds = await firstModal.boundingBox();
        
        console.log('📐 First modal bounds:', firstModalBounds);
    
        // Step 2: Try to open a second modal from within the first modal
        // Look for buttons inside the first modal that might open another modal
        const modalButtons = await firstModal.locator('button').all();
        console.log(`Found ${modalButtons.length} buttons in first modal`);
    
        let secondModalOpened = false;
        
        // Try to find a button that opens another modal
        for (let i = 0; i < modalButtons.length; i++) {
          const button = modalButtons[i];
          const buttonText = await button.textContent();
          console.log(`Button ${i}: "${buttonText}"`);
          
          // Look for buttons that might open another modal
          if (buttonText && (
            buttonText.toLowerCase().includes('another') ||
            buttonText.toLowerCase().includes('second') ||
            buttonText.toLowerCase().includes('stack') ||
            buttonText.toLowerCase().includes('open')
          )) {
            console.log(`📝 Clicking button: "${buttonText}"`);
            await button.click();
            
            // Wait for potential second modal
            await page.waitForTimeout(500);
            
            const allModals = page.locator('.wb-modal.wb-modal--open');
            const modalCount = await allModals.count();
            
            if (modalCount > 1) {
              secondModalOpened = true;
              console.log(`✅ Second modal opened! Total modals: ${modalCount}`);
              break;
            }
          }
        }
    
        // If no second modal button found in first modal, try programmatically creating one
        if (!secondModalOpened) {
          console.log('📝 No second modal button found, creating one programmatically...');
          
          await page.evaluate(() => {
            const secondModal = window.WBModal.create({
              title: 'Second Modal (Stacked)',
              content: '<p>This is the second modal. It should be offset from the first modal so both are visible.</p>',
              buttons: [{
                text: 'Close Second',
                variant: 'primary',
                onclick: () => window.WBModal.hide(secondModal)
              }]
            });
            
            // Get the trigger element (first modal)
            const firstModal = document.querySelector('.wb-modal.wb-modal--open');
            window.WBModal.show(secondModal, firstModal);
          });
          secondModalOpened = true;
        }
    
        if (secondModalOpened) {
          // Get all modals
          const allModals = page.locator('.wb-modal.wb-modal--open');
          const modalCount = await allModals.count();
          
          console.log(`📊 Total modals open: ${modalCount}`);
          
          if (modalCount >= 2) {
            const secondModal = allModals.nth(1);
            const secondModalBounds = await secondModal.boundingBox();
            
            console.log('📐 Second modal bounds:', secondModalBounds);
            console.log('📐 First modal bounds:', firstModalBounds);
            
            if (firstModalBounds && secondModalBounds) {
              // Check that modals are offset from each other
              const topDifference = Math.abs(secondModalBounds.y - firstModalBounds.y);
              const leftDifference = Math.abs(secondModalBounds.x - firstModalBounds.x);
              
              console.log(`📊 Position differences:`)
              console.log(`   Top difference: ${topDifference}px`);
              console.log(`   Left difference: ${leftDifference}px`);
              
              // Modals should be offset by at least 15px in either direction
              const hasOffset = topDifference > 15 || leftDifference > 15;
              
              if (hasOffset) {
                console.log('✅ Modals are properly offset - both should be visible');
              } else {
                console.log('❌ Modals are overlapping - stacked modals may not be visible');
              }
              
              expect(hasOffset, 'Stacked modals should be offset to show both').toBeTruthy();
              
              // Check z-index stacking
              const firstZIndex = await firstModal.evaluate((el) => {
                return parseInt(window.getComputedStyle(el).zIndex || '0');
              });
              
              const secondZIndex = await secondModal.evaluate((el) => {
                return parseInt(window.getComputedStyle(el).zIndex || '0');
              });
              
              console.log(`📊 Z-index comparison: First=${firstZIndex}, Second=${secondZIndex}`);
              expect(secondZIndex).toBeGreaterThan(firstZIndex);
            }
          }
        }
    
        // Take a screenshot to visually verify stacking
        await page.screenshot({ 
          path: 'modal-stacking-visibility.png', 
          fullPage: true 
        });
        
        console.log('✅ Screenshot saved: modal-stacking-visibility.png');
    });
  });

  test('Create three stacked modals programmatically', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🧪 Creating three stacked modals programmatically');
    
        // Add more visible styling
        await page.addStyleTag({
          content: `
            .wb-modal[data-stack="1"] { 
              border: 4px solid red !important; 
              box-shadow: 0 0 0 2px white, 0 0 0 6px red !important;
            }
            .wb-modal[data-stack="2"] { 
              border: 4px solid blue !important; 
              box-shadow: 0 0 0 2px white, 0 0 0 6px blue !important;
            }
            .wb-modal[data-stack="3"] { 
              border: 4px solid green !important; 
              box-shadow: 0 0 0 2px white, 0 0 0 6px green !important;
            }
            .wb-modal::before {
              content: "Modal #" attr(data-stack);
              position: absolute;
              top: -30px;
              left: 10px;
              background: var(--border-color);
              color: white;
              padding: 4px 8px;
              font-size: 14px;
              border-radius: 4px;
              font-weight: bold;
              z-index: 1000;
            }
          `
        });
    
        // Create three modals with proper stacking
        await page.evaluate(() => {
          // Modal 1
          const modal1 = window.WBModal.create({
            title: 'First Modal',
            content: '<p>This is the first modal (red border). It should be at the bottom of the stack.</p>'
          });
          modal1.setAttribute('data-stack', '1');
          modal1.style.setProperty('--border-color', 'red');
          
          // Modal 2  
          const modal2 = window.WBModal.create({
            title: 'Second Modal',
            content: '<p>This is the second modal (blue border). It should be offset from the first.</p>'
          });
          modal2.setAttribute('data-stack', '2');
          modal2.style.setProperty('--border-color', 'blue');
          
          // Modal 3
          const modal3 = window.WBModal.create({
            title: 'Third Modal', 
            content: '<p>This is the third modal (green border). It should be on top with the highest offset.</p>'
          });
          modal3.setAttribute('data-stack', '3');
          modal3.style.setProperty('--border-color', 'green');
          
          // Get trigger element (basic modal button)
          const trigger = document.getElementById('basic-modal-btn');
          
          // Show modals in sequence with slight delays
          window.WBModal.show(modal1, trigger);
          
          setTimeout(() => {
            window.WBModal.show(modal2, trigger);
          }, 150);
          
          setTimeout(() => {
            window.WBModal.show(modal3, trigger);
          }, 300);
        });
    
        // Wait for all modals to appear
        await page.waitForTimeout(1000);
    
        // Check that all three modals are visible
        const allModals = page.locator('.wb-modal.wb-modal--open');
        const modalCount = await allModals.count();
        
        console.log(`📊 Total modals created: ${modalCount}`);
        expect(modalCount).toBe(3);
    
        // Get bounds of all three modals
        const modal1Bounds = await allModals.nth(0).boundingBox();
        const modal2Bounds = await allModals.nth(1).boundingBox();
        const modal3Bounds = await allModals.nth(2).boundingBox();
    
        console.log('📐 Modal positions:');
        console.log('   Modal 1:', modal1Bounds);
        console.log('   Modal 2:', modal2Bounds);
        console.log('   Modal 3:', modal3Bounds);
    
        // Verify stacking - each modal should be offset
        if (modal1Bounds && modal2Bounds && modal3Bounds) {
          const offset1to2 = {
            top: modal2Bounds.y - modal1Bounds.y,
            left: modal2Bounds.x - modal1Bounds.x
          };
          
          const offset2to3 = {
            top: modal3Bounds.y - modal2Bounds.y,
            left: modal3Bounds.x - modal2Bounds.x
          };
          
          console.log('📊 Stacking offsets:');
          console.log(`   Modal 1→2: top=${offset1to2.top}px, left=${offset1to2.left}px`);
          console.log(`   Modal 2→3: top=${offset2to3.top}px, left=${offset2to3.left}px`);
          
          // Each modal should be offset by approximately 20px
          expect(Math.abs(offset1to2.top)).toBeGreaterThan(15);
          expect(Math.abs(offset2to3.top)).toBeGreaterThan(15);
          
          console.log('✅ All three modals are properly stacked with offsets');
        }
    
        // Take final screenshot
        await page.screenshot({ 
          path: 'modal-triple-stack.png', 
          fullPage: true 
        });
        
        console.log('✅ Screenshot saved: modal-triple-stack.png');
    });
  });
});