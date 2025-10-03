import { test, expect } from '@playwright/test';

test.describe('Modal Debug Closest', () => {
  
  test('Debug closest() method finding demo-section', async ({ page }) => {
    await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html', {
      waitUntil: 'networkidle'
    });
    await page.waitForFunction(() => window.WBModal !== undefined);

    // Test the closest() method directly
    const closestResult = await page.evaluate(() => {
      const button = document.getElementById('basic-modal-btn');
      console.log('Button found:', button);
      
      if (!button) return { error: 'Button not found' };
      
      // Check button's ancestors
      let current = button;
      const ancestors = [];
      while (current && current !== document.body) {
        ancestors.push({
          tagName: current.tagName,
          id: current.id,
          className: current.className,
          classList: Array.from(current.classList || [])
        });
        current = current.parentElement;
      }
      
      // Test closest() method
      const demoSection = button.closest('.demo-section');
      const heroDemo = button.closest('.hero-demo');
      
      return {
        button: {
          id: button.id,
          tagName: button.tagName,
          className: button.className
        },
        ancestors: ancestors,
        demoSection: demoSection ? {
          tagName: demoSection.tagName,
          id: demoSection.id,
          className: demoSection.className,
          rect: demoSection.getBoundingClientRect()
        } : null,
        heroDemo: heroDemo ? {
          tagName: heroDemo.tagName,
          id: heroDemo.id,
          className: heroDemo.className
        } : null
      };
    });
    
    console.log('Closest() debug result:', JSON.stringify(closestResult, null, 2));

    // If demo-section is not found, let's manually check the HTML structure
    if (!closestResult.demoSection) {
      console.log('❌ demo-section not found via closest()');
      
      // Let's examine the HTML structure around the button
      const htmlStructure = await page.evaluate(() => {
        const button = document.getElementById('basic-modal-btn');
        if (!button) return 'Button not found';
        
        // Get the outer container
        let container = button;
        for (let i = 0; i < 5; i++) {
          container = container.parentElement;
          if (!container) break;
        }
        
        return container ? container.outerHTML.substring(0, 1000) : 'No container found';
      });
      
      console.log('HTML structure around button:', htmlStructure);
    } else {
      console.log('✅ demo-section found via closest()');
    }

    // Now let's override the modal positioning to add debugging
    await page.evaluate(() => {
      if (window.WBModal && window.WBModal.show) {
        const originalShow = window.WBModal.show;
        window.WBModal.show = function(modal, triggerElement) {
          console.log('🔍 Modal show debugging:');
          console.log('  triggerElement:', triggerElement);
          
          if (triggerElement) {
            const demoSection = triggerElement.closest('.demo-section');
            const heroDemo = triggerElement.closest('.hero-demo');
            
            console.log('  demoSection via closest:', demoSection);
            console.log('  heroDemo via closest:', heroDemo);
            
            if (demoSection) {
              const sectionRect = demoSection.getBoundingClientRect();
              console.log('  sectionRect:', sectionRect);
              
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
              console.log('  scroll offsets:', { scrollTop, scrollLeft });
              
              const modalTop = sectionRect.top + scrollTop;
              const modalLeft = sectionRect.left + scrollLeft;
              const modalWidth = Math.min(sectionRect.width, 500);
              
              console.log('  calculated position:', { modalTop, modalLeft, modalWidth });
              
              modal.style.setProperty('--wb-modal-top', modalTop + 'px');
              modal.style.setProperty('--wb-modal-left', modalLeft + 'px');
              modal.style.setProperty('--wb-modal-width', modalWidth + 'px');
              
              console.log('  CSS properties set:', {
                top: modal.style.getPropertyValue('--wb-modal-top'),
                left: modal.style.getPropertyValue('--wb-modal-left'),
                width: modal.style.getPropertyValue('--wb-modal-width')
              });
            } else {
              console.log('  ❌ No demo-section found, using fallback');
              modal.style.setProperty('--wb-modal-top', '100px');
              modal.style.setProperty('--wb-modal-left', '100px');
              modal.style.setProperty('--wb-modal-width', '400px');
            }
          } else {
            console.log('  ❌ No trigger element provided');
          }
          
          return originalShow.call(this, modal, triggerElement);
        };
      }
    });

    // Now test the modal
    await page.click('#basic-modal-btn');
    await page.waitForSelector('.wb-modal.wb-modal--open', { timeout: 2000 });
    
    const modal = page.locator('.wb-modal.wb-modal--open').first();
    const modalBounds = await modal.boundingBox();
    
    console.log('Final modal bounds:', modalBounds);

    // Check if we found a demo-section
    if (closestResult.demoSection) {
      expect(closestResult.demoSection).toBeTruthy();
      console.log('✅ Demo section found successfully');
    } else {
      console.log('❌ Demo section NOT found - this is the root cause of the positioning issue');
    }
  });
});