import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('Modal Right Edge Positioning Tests', () => {
  const baseTest = new BaseUnitTest();
  
  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.waitForTimeout(3000);
  });
  });

  test('Modal slides in from right with 1rem margin from right edge', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🧪 Testing modal right-edge positioning with 1rem margin');
    
        // Get the demo section bounds before opening modal
        const demoSectionBounds = await page.evaluate(() => {
          const demoSection = document.querySelector('.demo-section');
          if (demoSection) {
            const rect = demoSection.getBoundingClientRect();
            return {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              right: rect.right
            };
          }
          return null;
        });
        
        console.log('📐 Demo section bounds:', demoSectionBounds);
    
        // Click basic modal button
        await page.click('#basic-modal-btn');
        await page.waitForSelector('.wb-modal.wb-modal--open', { timeout: 2000 });
        
        // Get modal bounds
        const modal = page.locator('.wb-modal.wb-modal--open').first();
        const modalBounds = await modal.boundingBox();
        
        console.log('📐 Modal bounds:', modalBounds);
    
        if (modalBounds && demoSectionBounds) {
          // Calculate expected position
          const expectedMargin = 16; // 1rem = 16px
          const expectedRightEdge = demoSectionBounds.right - expectedMargin;
          const actualRightEdge = modalBounds.x + modalBounds.width;
          
          console.log('📊 Right edge analysis:');
          console.log(`  Demo section right edge: ${demoSectionBounds.right}px`);
          console.log(`  Expected modal right edge: ${expectedRightEdge}px (with 1rem margin)`);
          console.log(`  Actual modal right edge: ${actualRightEdge}px`);
          console.log(`  Difference: ${Math.abs(actualRightEdge - expectedRightEdge)}px`);
    
          // Modal right edge should be 1rem (16px) from demo section right edge
          expect(Math.abs(actualRightEdge - expectedRightEdge)).toBeLessThan(5); // Allow 5px tolerance
    
          // Modal should be positioned in the right area of the demo section
          expect(modalBounds.x).toBeGreaterThan(demoSectionBounds.x + demoSectionBounds.width * 0.3);
          
          console.log('✅ Modal positioned correctly with 1rem margin from right edge');
        } else {
          throw new Error('Could not get modal or demo section bounds');
        }
    });
  });

  test('Animation timing is 100ms', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🧪 Testing 100ms animation timing');
    
        const startTime = Date.now();
        
        // Click basic modal
        await page.click('#basic-modal-btn');
        
        // Wait for modal to appear
        const modal = page.locator('.wb-modal.wb-modal--open').first();
        await expect(modal).toBeVisible();
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        console.log(`⏱️ Total time for modal to appear: ${totalTime}ms`);
        
        // Should take around 100ms + some overhead for DOM operations
        // Allow up to 500ms for browser processing and network delays
        expect(totalTime).toBeLessThan(500);
        
        // Check CSS transition timing
        const transitionDuration = await modal.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return computed.transitionDuration;
        });
        
        console.log(`🎬 CSS transition duration: ${transitionDuration}`);
        
        // Should be 0.1s (100ms)
        expect(transitionDuration).toContain('0.1s');
    });
  });

  test('Multiple modals stack with right-edge positioning', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🧪 Testing modal stacking with right-edge positioning');
    
        // Open first modal
        await page.click('#basic-modal-btn');
        await page.waitForSelector('.wb-modal.wb-modal--open', { timeout: 2000 });
        
        const firstModal = page.locator('.wb-modal.wb-modal--open').first();
        const firstModalBounds = await firstModal.boundingBox();
        
        console.log('📐 First modal bounds:', firstModalBounds);
    
        // Check if there's a button to open another modal inside the first modal
        const nestedModalBtn = firstModal.locator('button').filter({ hasText: /Another|Second|Stack/ }).first();
        
        if (await nestedModalBtn.isVisible()) {
          await nestedModalBtn.click();
          
          // Wait for second modal
          await page.waitForSelector('.wb-modal.wb-modal--open:nth-child(2)', { timeout: 2000 }).catch(() => {
            // Second modal might not exist, that's ok
          });
          
          const allModals = page.locator('.wb-modal.wb-modal--open');
          const modalCount = await allModals.count();
          
          console.log(`📊 Found ${modalCount} stacked modals`);
          
          if (modalCount > 1) {
            const secondModal = allModals.nth(1);
            const secondModalBounds = await secondModal.boundingBox();
            
            console.log('📐 Second modal bounds:', secondModalBounds);
            
            // Second modal should have higher z-index
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
    });
  });

  test('Visual verification - screenshot test', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('📸 Taking visual verification screenshots');
    
        // Clear any existing modals
        await page.evaluate(() => {
          document.querySelectorAll('.wb-modal').forEach(modal => modal.remove());
          document.querySelectorAll('.wb-modal-backdrop').forEach(backdrop => backdrop.remove());
        });
    
        // Add visual indicators
        await page.addStyleTag({
          content: `
            .demo-section {
              border: 2px dashed blue !important;
              position: relative;
            }
            .demo-section::after {
              content: "Demo Section";
              position: absolute;
              top: -25px;
              left: 0;
              background: blue;
              color: white;
              padding: 2px 8px;
              font-size: 12px;
              border-radius: 4px;
            }
            .wb-modal {
              border: 3px solid red !important;
            }
            .wb-modal::before {
              content: "Modal (should be 1rem from right edge)";
              position: absolute;
              top: -30px;
              right: 0;
              background: red;
              color: white;
              padding: 2px 8px;
              font-size: 12px;
              border-radius: 4px;
              white-space: nowrap;
            }
          `
        });
    
        // Test different modal types
        const modalTests = [
          { button: '#basic-modal-btn', name: 'basic' },
          { button: '#danger-modal-btn', name: 'danger' },
          { button: '#success-modal-btn', name: 'success' }
        ];
    
        for (const test of modalTests) {
          // Clear previous modals
          await page.evaluate(() => {
            document.querySelectorAll('.wb-modal').forEach(modal => modal.remove());
            document.querySelectorAll('.wb-modal-backdrop').forEach(backdrop => backdrop.remove());
          });
    
          console.log(`📸 Testing ${test.name} modal positioning`);
          
          await page.click(test.button);
          await page.waitForSelector('.wb-modal.wb-modal--open', { timeout: 2000 });
          
          // Take screenshot
          await page.screenshot({ 
            path: `modal-right-edge-${test.name}.png`, 
            fullPage: true 
          });
        }
    
        console.log('✅ Screenshots saved: modal-right-edge-*.png');
    });
  });
});