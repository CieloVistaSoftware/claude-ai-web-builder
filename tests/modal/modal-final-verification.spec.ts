import { test, expect } from '@playwright/test';

test.describe('Final Modal Verification', () => {
  
  test('Final verification - Modal slides in from right', async ({ page }) => {
    // Force browser to clear cache
    await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html', {
      waitUntil: 'networkidle'
    });
    
    // Force hard refresh to ensure latest CSS is loaded
    await page.reload({ waitUntil: 'networkidle' });
    
    await page.waitForFunction(() => window.WBModal !== undefined);
    
    console.log('=== FINAL MODAL VERIFICATION TEST ===');
    
    // Clear any existing modals
    await page.evaluate(() => {
      document.querySelectorAll('.wb-modal').forEach(modal => modal.remove());
      document.querySelectorAll('.wb-modal-backdrop').forEach(backdrop => backdrop.remove());
    });

    // Get button and demo section positions before clicking
    const button = page.locator('#basic-modal-btn');
    const buttonBounds = await button.boundingBox();
    console.log('✓ Basic Modal button found at:', buttonBounds);

    // Find the demo section containing this button
    const parentDemoSection = await page.evaluate(() => {
      const btn = document.getElementById('basic-modal-btn');
      const demoSection = btn?.closest('.demo-section');
      if (demoSection) {
        const rect = demoSection.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          element: true
        };
      }
      return null;
    });
    
    console.log('✓ Demo section found:', parentDemoSection);

    // Override WBModal.show to track positioning logic
    await page.evaluate(() => {
      window.modalDebugInfo = [];
      
      if (window.WBModal && window.WBModal.show) {
        const originalShow = window.WBModal.show;
        window.WBModal.show = function(modal, triggerElement) {
          console.log('🔍 WBModal.show called');
          console.log('  Modal:', modal);
          console.log('  Trigger:', triggerElement);
          
          window.modalDebugInfo.push({
            step: 'show_called',
            hasTrigger: !!triggerElement,
            triggerTagName: triggerElement?.tagName,
            triggerId: triggerElement?.id
          });
          
          // Call original show method
          const result = originalShow.call(this, modal, triggerElement);
          
          // After show is called, check the modal state
          setTimeout(() => {
            if (modal) {
              const computed = window.getComputedStyle(modal);
              const bounds = modal.getBoundingClientRect();
              
              window.modalDebugInfo.push({
                step: 'after_show',
                computed: {
                  position: computed.position,
                  top: computed.top,
                  left: computed.left,
                  transform: computed.transform,
                  width: computed.width,
                  opacity: computed.opacity,
                  visibility: computed.visibility
                },
                bounds: {
                  x: bounds.x,
                  y: bounds.y,
                  width: bounds.width,
                  height: bounds.height
                },
                customProps: {
                  modalTop: modal.style.getPropertyValue('--wb-modal-top'),
                  modalLeft: modal.style.getPropertyValue('--wb-modal-left'),
                  modalWidth: modal.style.getPropertyValue('--wb-modal-width')
                },
                classList: Array.from(modal.classList)
              });
            }
          }, 100);
          
          return result;
        };
      }
    });

    // Click the basic modal button
    console.log('🖱️ Clicking Basic Modal button...');
    await button.click();

    // Wait for modal to appear
    await page.waitForSelector('.wb-modal.wb-modal--open', { timeout: 3000 });
    
    // Get final modal state
    const modal = page.locator('.wb-modal.wb-modal--open').first();
    const modalBounds = await modal.boundingBox();
    
    console.log('📍 Modal final position:', modalBounds);

    // Get debug info
    const debugInfo = await page.evaluate(() => window.modalDebugInfo || []);
    console.log('🔍 Debug information:', JSON.stringify(debugInfo, null, 2));

    // Verify positioning
    if (modalBounds && parentDemoSection) {
      const modalY = modalBounds.y;
      const demoY = parentDemoSection.y;
      const yDifference = Math.abs(modalY - demoY);
      
      console.log(`📊 Y Position Analysis:`);
      console.log(`  Demo Section Y: ${demoY}`);
      console.log(`  Modal Y: ${modalY}`);
      console.log(`  Difference: ${yDifference}px`);
      
      if (yDifference <= 100) {
        console.log('✅ SUCCESS: Modal positioned correctly over demo section!');
      } else {
        console.log('❌ FAIL: Modal not positioned over demo section');
      }
      
      // The modal should be positioned near the demo section (within 100px)
      expect(yDifference, 'Modal should be positioned over demo section').toBeLessThan(100);
    }

    // Test slide-in behavior by checking transform
    const finalTransform = await modal.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    
    console.log('🎭 Final transform:', finalTransform);
    
    // Transform should be translateX(0) when fully open
    expect(finalTransform === 'matrix(1, 0, 0, 1, 0, 0)' || finalTransform === 'none').toBeTruthy();

    // Take a screenshot for visual verification
    await page.screenshot({ 
      path: 'modal-final-verification.png', 
      fullPage: true 
    });

    console.log('✅ Test completed - see modal-final-verification.png for visual confirmation');
  });

  test('Test multiple modal buttons', async ({ page }) => {
    await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html', {
      waitUntil: 'networkidle'
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.WBModal !== undefined);

    const buttonsToTest = ['#basic-modal-btn', '#danger-modal-btn', '#success-modal-btn'];
    
    for (const buttonId of buttonsToTest) {
      console.log(`\n🧪 Testing: ${buttonId}`);
      
      // Clear previous modals
      await page.evaluate(() => {
        document.querySelectorAll('.wb-modal').forEach(modal => modal.remove());
        document.querySelectorAll('.wb-modal-backdrop').forEach(backdrop => backdrop.remove());
      });

      if (await page.locator(buttonId).isVisible()) {
        await page.click(buttonId);
        
        // Wait for modal
        await page.waitForSelector('.wb-modal.wb-modal--open', { timeout: 2000 });
        
        const modal = page.locator('.wb-modal.wb-modal--open').first();
        const modalBounds = await modal.boundingBox();
        
        console.log(`  Modal bounds: ${JSON.stringify(modalBounds)}`);
        
        // Check if modal is positioned reasonably (not at bottom of page)
        const pageHeight = await page.evaluate(() => document.body.scrollHeight);
        const modalAtBottom = modalBounds && modalBounds.y > pageHeight - 300;
        
        if (modalAtBottom) {
          console.log(`  ❌ Modal at bottom of page (y=${modalBounds?.y}, pageHeight=${pageHeight})`);
        } else {
          console.log(`  ✅ Modal positioned correctly (y=${modalBounds?.y})`);
        }
        
        expect(modalAtBottom, `Modal ${buttonId} should not be at bottom`).toBeFalsy();
        
        // Close modal
        const closeBtn = modal.locator('.wb-modal-close').first();
        await closeBtn.click();
        
        await page.waitForTimeout(500);
      }
    }
  });
});