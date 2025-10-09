import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test('Simple modal debug', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html', {
        waitUntil: 'networkidle'
    });
  });
  
  // Check if WBModal is available
  const wbModalStatus = await page.evaluate(() => {
    return {
      WBModal: typeof window.WBModal,
      customElement: typeof customElements.get('wb-modal'),
      config: window.WBModal ? typeof window.WBModal.getConfig() : 'no-WBModal'
    };
  });
  
  console.log('🔍 Initial status:', wbModalStatus);
  
  // Try to create a modal
  const createResult = await page.evaluate(() => {
    try {
      console.log('About to create modal...');
      const modal = window.WBModal.create({
        title: 'Test Modal',
        content: '<p>Test content</p>'
      });
      
      console.log('Modal created:', modal);
      
      if (!modal) {
        return {
          success: false,
          error: 'Modal creation returned null'
        };
      }
      
      return {
        success: true,
        modalType: modal.tagName,
        hasShowMethod: typeof modal.show,
        classList: Array.from(modal.classList),
        attributes: {
          title: modal.getAttribute('title'),
          size: modal.getAttribute('size')
        },
        constructorName: modal.constructor.name
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });
  
  console.log('🔍 Create result:', createResult);
  
  // Try to show the modal
  const showResult = await page.evaluate(() => {
    try {
      const modal = window.WBModal.create({
        title: 'Test Modal',
        content: '<p>Test content</p>'
      });
      
      const button = document.getElementById('basic-modal-btn');
      return window.WBModal.show(modal, button);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  });
  
  console.log('🔍 Show result:', showResult);
  
  // Wait a bit and check if modal appeared
  await page.waitForTimeout(1000);
  
  const modalCount = await page.evaluate(() => {
    return document.querySelectorAll('wb-modal, .wb-modal').length;
  });
  
  console.log('🔍 Modal count after show:', modalCount);
});