import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('Modal DOM Inspection', () => {
  const baseTest = new BaseUnitTest();
  
  test('Inspect modal DOM structure and CSS application', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html', {
          waitUntil: 'networkidle'
        });
    
        // Override console.log to capture it
        const logs = [];
        page.on('console', msg => {
          if (msg.type() === 'log' && msg.text().includes('🔍')) {
            logs.push(msg.text());
          }
        });
    
        // Override modal creation to debug
        await page.evaluate(() => {
          if (window.WBModal && window.WBModal.show) {
            const originalShow = window.WBModal.show;
            window.WBModal.show = function(modal, triggerElement) {
              console.log('🔍 MODAL DEBUGGING START');
              
              // Step 1: Check trigger element and demo-section finding
              if (triggerElement) {
                const demoSection = triggerElement.closest('.demo-section');
                console.log('🔍 Demo section found:', !!demoSection);
                
                if (demoSection) {
                  const sectionRect = demoSection.getBoundingClientRect();
                  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                  
                  const modalTop = sectionRect.top + scrollTop;
                  const modalLeft = sectionRect.left + scrollLeft;
                  const modalWidth = Math.min(sectionRect.width, 500);
                  
                  console.log('🔍 Calculated position:', { modalTop, modalLeft, modalWidth });
                  console.log('🔍 Section rect:', sectionRect);
                  console.log('🔍 Scroll offsets:', { scrollTop, scrollLeft });
                  
                  // Set CSS properties
                  modal.style.setProperty('--wb-modal-top', modalTop + 'px');
                  modal.style.setProperty('--wb-modal-left', modalLeft + 'px');
                  modal.style.setProperty('--wb-modal-width', modalWidth + 'px');
                  
                  console.log('🔍 CSS properties set on modal:');
                  console.log('  --wb-modal-top:', modal.style.getPropertyValue('--wb-modal-top'));
                  console.log('  --wb-modal-left:', modal.style.getPropertyValue('--wb-modal-left'));
                  console.log('  --wb-modal-width:', modal.style.getPropertyValue('--wb-modal-width'));
                }
              }
              
              // Step 2: Call original show
              const result = originalShow.call(this, modal, triggerElement);
              
              // Step 3: Check modal state after show
              setTimeout(() => {
                console.log('🔍 MODAL STATE AFTER SHOW:');
                console.log('  Modal element:', modal);
                console.log('  Modal parent:', modal.parentElement?.tagName);
                console.log('  Modal classList:', Array.from(modal.classList));
                
                const computed = window.getComputedStyle(modal);
                console.log('  Computed styles:');
                console.log('    position:', computed.position);
                console.log('    top:', computed.top);
                console.log('    left:', computed.left);
                console.log('    width:', computed.width);
                console.log('    transform:', computed.transform);
                console.log('    opacity:', computed.opacity);
                console.log('    visibility:', computed.visibility);
                console.log('    z-index:', computed.zIndex);
                
                const bounds = modal.getBoundingClientRect();
                console.log('  Bounding rect:', bounds);
                
                // Check if CSS custom properties are being read correctly
                const customPropsOnElement = {
                  modalTop: modal.style.getPropertyValue('--wb-modal-top'),
                  modalLeft: modal.style.getPropertyValue('--wb-modal-left'),
                  modalWidth: modal.style.getPropertyValue('--wb-modal-width')
                };
                console.log('  Custom properties on element:', customPropsOnElement);
                
                // Check if CSS variables are accessible in computed styles
                const rootStyles = window.getComputedStyle(document.documentElement);
                console.log('  Root CSS variables available:', {
                  neutralBg: rootStyles.getPropertyValue('--neutral-800'),
                  primary: rootStyles.getPropertyValue('--primary')
                });
                
                console.log('🔍 MODAL DEBUGGING END');
              }, 50);
              
              return result;
            };
          }
        });
    
        // Click modal button
        await page.click('#basic-modal-btn');
        await page.waitForSelector('.wb-modal.wb-modal--open', { timeout: 2000 });
        
        // Wait for debug logs
        await page.waitForTimeout(200);
        
        // Get the modal and check its final state
        const modal = page.locator('.wb-modal.wb-modal--open').first();
        
        // Check DOM structure
        const domStructure = await page.evaluate(() => {
          const modal = document.querySelector('.wb-modal.wb-modal--open');
          if (!modal) return 'Modal not found';
          
          return {
            modalTag: modal.tagName,
            modalId: modal.id,
            modalClasses: Array.from(modal.classList),
            parentTag: modal.parentElement?.tagName,
            parentId: modal.parentElement?.id,
            parentClasses: Array.from(modal.parentElement?.classList || []),
            customPropsOnModal: {
              top: modal.style.getPropertyValue('--wb-modal-top'),
              left: modal.style.getPropertyValue('--wb-modal-left'),
              width: modal.style.getPropertyValue('--wb-modal-width')
            },
            computedStyles: {
              position: window.getComputedStyle(modal).position,
              top: window.getComputedStyle(modal).top,
              left: window.getComputedStyle(modal).left,
              width: window.getComputedStyle(modal).width
            },
            cssRuleMatches: (() => {
              // Check which CSS rules are matching the modal
              const sheets = Array.from(document.styleSheets);
              const matchingRules = [];
              
              sheets.forEach(sheet => {
                try {
                  Array.from(sheet.cssRules).forEach(rule => {
                    if (rule.selectorText && rule.selectorText.includes('.wb-modal') && modal.matches(rule.selectorText)) {
                      matchingRules.push({
                        selector: rule.selectorText,
                        cssText: rule.style.cssText.substring(0, 200)
                      });
                    }
                  });
                } catch (e) {
                  // Cross-origin restrictions
                }
              });
              
              return matchingRules;
            })()
          };
        });
        
        console.log('DOM Structure Analysis:', JSON.stringify(domStructure, null, 2));
    
        // Final bounds check
        const modalBounds = await modal.boundingBox();
        console.log('Final modal bounds:', modalBounds);
    
        // The modal should be using the correct position
        expect(domStructure.customPropsOnModal.top).toBeTruthy();
        expect(domStructure.computedStyles.position).toBe('absolute');
    });
  });
});