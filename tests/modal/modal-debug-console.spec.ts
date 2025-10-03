import { test, expect } from '@playwright/test';

test('Debug modal with console monitoring', async ({ page }) => {
  // Listen for console messages
  page.on('console', msg => {
    console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html', {
    waitUntil: 'networkidle'
  });
  
  console.log('🔍 Page loaded, checking WBModal...');
  
  // Wait a bit for initialization
  await page.waitForTimeout(2000);
  
  // Check if WBModal is available
  const status = await page.evaluate(() => {
    return {
      WBModal: typeof window.WBModal,
      config: window.WBModal ? !!window.WBModal.getConfig() : false,
      customElement: !!customElements.get('wb-modal')
    };
  });
  
  console.log('🔍 Status after wait:', status);
  
  // Try clicking a real button like the visual test does
  console.log('🔍 Clicking basic modal button...');
  await page.click('#basic-modal-btn');
  
  // Wait for modal
  await page.waitForTimeout(1000);
  
  const modalAfterClick = await page.evaluate(() => {
    const modals = document.querySelectorAll('wb-modal, .wb-modal');
    return {
      totalModals: modals.length,
      openModals: document.querySelectorAll('.wb-modal--open').length,
      webComponentModals: document.querySelectorAll('wb-modal').length
    };
  });
  
  console.log('🔍 Modal count after clicking button:', modalAfterClick);
});