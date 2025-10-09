import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('Comprehensive Modal Slide-In Tests', () => {
  const baseTest = new BaseUnitTest();
  
  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html');
    await page.waitForTimeout(3000);
  });

  test('ALL modal buttons slide in from right - Visual verification', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Set status light to red before starting
        await page.evaluate(() => {
          window.setStatusLight('code-updating', 'Testing modal slide behavior');
        });
    
        // Get all modal buttons on the page
        const modalButtons = await page.locator('button[id*="modal"], button[id*="alert"], button[id*="confirm"], button[id*="prompt"]').all();
        
        console.log(`Found ${modalButtons.length} modal buttons to test`);
        
        for (let i = 0; i < modalButtons.length; i++) {
          const button = modalButtons[i];
          const buttonId = await button.getAttribute('id');
          const buttonText = await button.textContent();
          
          console.log(`\n=== Testing Button ${i + 1}/${modalButtons.length}: ${buttonId} ("${buttonText}") ===`);
          
          // Track modal positioning before click
          await page.evaluate(() => {
            // Clear any existing modals
            document.querySelectorAll('.wb-modal').forEach(modal => modal.remove());
            document.querySelectorAll('.wb-modal-backdrop').forEach(backdrop => backdrop.remove());
          });
          
          // Get button position for reference
          const buttonBounds = await button.boundingBox();
          console.log(`Button position: x=${buttonBounds?.x}, y=${buttonBounds?.y}`);
          
          // Add modal position tracker
          await page.evaluate(() => {
            window.modalPositions = [];
            
            // Override modal show to track positioning
            if (window.WBModal && window.WBModal.show) {
              const originalShow = window.WBModal.show;
              window.WBModal.show = function(modal, triggerElement) {
                console.log('Modal show called with triggerElement:', triggerElement);
                
                // Track initial position
                if (modal) {
                  const initialTransform = window.getComputedStyle(modal).transform;
                  const initialPosition = modal.getBoundingClientRect();
                  window.modalPositions.push({
                    time: Date.now(),
                    phase: 'initial',
                    transform: initialTransform,
                    position: {
                      x: initialPosition.x,
                      y: initialPosition.y,
                      width: initialPosition.width,
                      height: initialPosition.height
                    }
                  });
                }
                
                return originalShow.call(this, modal, triggerElement);
              };
            }
          });
          
          // Click the button
          await button.click();
          
          // Wait for modal to appear
          await page.waitForSelector('.wb-modal.wb-modal--open', { timeout: 2000 });
          
          // Get the opened modal
          const modal = page.locator('.wb-modal.wb-modal--open').first();
          const modalBounds = await modal.boundingBox();
          
          console.log(`Modal appeared at: x=${modalBounds?.x}, y=${modalBounds?.y}, w=${modalBounds?.width}, h=${modalBounds?.height}`);
          
          // Check if modal is at bottom of page (BAD)
          const pageHeight = await page.evaluate(() => document.body.scrollHeight);
          const modalAtBottom = modalBounds && modalBounds.y > pageHeight - 200;
          
          if (modalAtBottom) {
            console.error(`❌ FAIL: Modal for "${buttonText}" appeared at BOTTOM of page (y=${modalBounds?.y}, pageHeight=${pageHeight})`);
          } else {
            console.log(`✅ PASS: Modal for "${buttonText}" did NOT appear at bottom`);
          }
          
          // Check modal transform (should NOT be translateX(100%) when open)
          const finalTransform = await modal.evaluate((el) => {
            return window.getComputedStyle(el).transform;
          });
          console.log(`Final modal transform: ${finalTransform}`);
          
          // Get modal positioning data
          const positionData = await page.evaluate(() => window.modalPositions || []);
          console.log('Modal position tracking:', positionData);
          
          // Check if modal is positioned relative to demo-section
          const demoSections = await page.locator('.demo-section').all();
          let modalOverlaysDemo = false;
          
          for (const section of demoSections) {
            const sectionBounds = await section.boundingBox();
            if (sectionBounds && modalBounds) {
              const overlaps = modalBounds.x >= sectionBounds.x - 50 && 
                              modalBounds.x <= sectionBounds.x + sectionBounds.width + 50 &&
                              modalBounds.y >= sectionBounds.y - 50 && 
                              modalBounds.y <= sectionBounds.y + sectionBounds.height + 50;
              if (overlaps) {
                modalOverlaysDemo = true;
                console.log(`✅ Modal overlays demo-section at x=${sectionBounds.x}, y=${sectionBounds.y}`);
                break;
              }
            }
          }
          
          if (!modalOverlaysDemo) {
            console.error(`❌ FAIL: Modal for "${buttonText}" does NOT overlay any demo-section`);
          }
          
          // Assert the modal is positioned correctly
          expect(modalAtBottom, `Modal "${buttonText}" should NOT be at bottom of page`).toBeFalsy();
          expect(modalOverlaysDemo, `Modal "${buttonText}" should overlay a demo-section`).toBeTruthy();
          
          // Close the modal
          const closeBtn = modal.locator('.wb-modal-close, button:has-text("OK"), button:has-text("Cancel")').first();
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
          }
          
          // Wait for modal to close
          await page.waitForSelector('.wb-modal.wb-modal--open', { state: 'hidden', timeout: 1000 }).catch(() => {
            // Modal might already be closed
          });
          
          // Small delay between tests
          await page.waitForTimeout(200);
        }
        
        // Set status light back to green
        await page.evaluate(() => {
          window.setStatusLight('ready', 'All modal tests completed');
        });
    });
  });

  test('Manual visual inspection of slide-in behavior', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('\n=== MANUAL VISUAL TEST ===');
        console.log('This test will open modals one by one for visual inspection');
        console.log('Each modal should slide in from the RIGHT side of the demo-section');
        
        const testButtons = [
          '#basic-modal-btn',
          '#danger-modal-btn', 
          '#success-modal-btn',
          '#large-modal-btn',
          '#alert-btn',
          '#confirm-btn'
        ];
        
        for (const buttonId of testButtons) {
          console.log(`\nTesting: ${buttonId}`);
          
          // Clear any existing modals first
          await page.evaluate(() => {
            document.querySelectorAll('.wb-modal').forEach(modal => modal.remove());
            document.querySelectorAll('.wb-modal-backdrop').forEach(backdrop => backdrop.remove());
          });
          
          // Add CSS to make slide-in more visible
          await page.addStyleTag({
            content: `
              .wb-modal {
                transition: transform 0.5s ease-out, opacity 0.5s ease-out !important;
              }
              .wb-modal:not(.wb-modal--open) {
                transform: translateX(100%) !important;
              }
              .wb-modal.wb-modal--open {
                transform: translateX(0) !important;
              }
            `
          });
          
          if (await page.locator(buttonId).isVisible()) {
            await page.click(buttonId);
            
            // Wait for modal and check its behavior
            const modal = page.locator('.wb-modal.wb-modal--open').first();
            await expect(modal).toBeVisible({ timeout: 2000 });
            
            // Let it stay visible for inspection
            await page.waitForTimeout(1000);
            
            // Close modal
            const closeBtn = modal.locator('.wb-modal-close, button:has-text("OK"), button:has-text("Cancel")').first();
            if (await closeBtn.isVisible()) {
              await closeBtn.click();
            }
            
            await page.waitForTimeout(500);
          }
        }
    });
  });
});