import { test, expect } from '@playwright/test';

test('Quick visual check of modal right-edge positioning', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html', {
    waitUntil: 'networkidle'
  });
  await page.waitForFunction(() => window.WBModal !== undefined);

  // Add visual indicators
  await page.addStyleTag({
    content: `
      .demo-section {
        border: 3px solid blue !important;
        position: relative;
      }
      .demo-section::after {
        content: "Demo Section (blue border)";
        position: absolute;
        top: -30px;
        left: 10px;
        background: blue;
        color: white;
        padding: 4px 8px;
        font-size: 14px;
        border-radius: 4px;
        font-weight: bold;
      }
      .wb-modal {
        border: 3px solid red !important;
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.5) !important;
      }
      .wb-modal::before {
        content: "Modal - Right edge should be 1rem from blue border";
        position: absolute;
        top: -35px;
        right: 0;
        background: red;
        color: white;
        padding: 4px 8px;
        font-size: 14px;
        border-radius: 4px;
        white-space: nowrap;
        font-weight: bold;
        z-index: 10000;
      }
    `
  });

  console.log('🎯 Opening modal to verify right-edge positioning...');
  
  // Click basic modal
  await page.click('#basic-modal-btn');
  
  // Wait a moment for animation
  await page.waitForTimeout(200);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'modal-right-edge-verification.png', 
    fullPage: true 
  });
  
  console.log('✅ Screenshot saved: modal-right-edge-verification.png');
  console.log('🔍 Check the screenshot to verify:');
  console.log('   - Modal (red border) slides in from right');
  console.log('   - Modal right edge is 1rem from demo-section right edge (blue border)');
  console.log('   - Modal does NOT slide all the way to left edge');
});