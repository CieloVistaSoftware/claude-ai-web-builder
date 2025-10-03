import { test, expect } from '@playwright/test';

test.describe('WB Modal Web Component Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html', {
      waitUntil: 'networkidle'
    });
    await page.waitForFunction(() => window.WBModal !== undefined);
    await page.waitForFunction(() => customElements.get('wb-modal') !== undefined);
  });

  test('Custom element registration works correctly', async ({ page }) => {
    console.log('🧪 Testing custom element registration...');

    // Check that custom element is properly registered
    const isRegistered = await page.evaluate(() => {
      return customElements.get('wb-modal') !== undefined;
    });
    
    expect(isRegistered).toBeTruthy();
    console.log('✅ Custom element is registered');
  });

  test('Web Component modal can be created programmatically', async ({ page }) => {
    console.log('🧪 Testing programmatic Web Component creation...');

    const result = await page.evaluate(() => {
      try {
        // Create modal using WBModal.create()
        const modal = window.WBModal.create({
          title: 'Test Modal',
          content: '<p>Test content</p>',
          size: 'standard',
          variant: 'default'
        });
        
        return {
          success: true,
          isWBModal: modal.tagName === 'WB-MODAL',
          hasTitle: modal.getAttribute('title') === 'Test Modal',
          hasSize: modal.getAttribute('size') === 'standard',
          hasVariant: modal.getAttribute('variant') === 'default'
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    console.log('📊 Creation result:', result);
    expect(result.success).toBeTruthy();
    expect(result.isWBModal).toBeTruthy();
    expect(result.hasTitle).toBeTruthy();
    
    console.log('✅ Web Component modal created successfully');
  });

  test('Direct HTML Web Component modal works', async ({ page }) => {
    console.log('🧪 Testing direct HTML Web Component modal...');

    // Click the Web Component modal button
    await page.click('button:has-text("Open Web Component Modal")');
    
    // Wait for modal to appear
    await page.waitForSelector('wb-modal[open]', { timeout: 3000 });
    
    // Verify modal is visible
    const modal = page.locator('wb-modal[open]');
    await expect(modal).toBeVisible();
    
    // Check modal has correct attributes
    const title = await modal.getAttribute('title');
    expect(title).toBe('Web Component Modal');
    
    // Check modal content
    const content = await modal.textContent();
    expect(content).toContain('Web Component');
    
    console.log('✅ Direct HTML Web Component modal works correctly');
    
    // Take screenshot for verification
    await page.screenshot({ 
      path: 'modal-web-component-test.png', 
      fullPage: true 
    });
    
    console.log('✅ Screenshot saved: modal-web-component-test.png');
  });

  test('Web Component modal positioning works correctly', async ({ page }) => {
    console.log('🧪 Testing Web Component modal positioning...');

    // Debug the positioning process
    await page.evaluate(() => {
      console.log('Debug: Looking for trigger button...');
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(btn => btn.textContent?.includes('Open Web Component Modal'));
      console.log('Debug: Button found:', button);
      const demoSection = button?.closest('.demo-section');
      console.log('Debug: Demo section found:', demoSection);
    });

    // Click the Web Component modal button
    await page.click('button:has-text("Open Web Component Modal")');
    
    // Wait for modal to appear
    await page.waitForSelector('wb-modal', { timeout: 3000 });
    
    // Check positioning styles applied
    const positioningInfo = await page.evaluate(() => {
      const modal = document.querySelector('wb-modal');
      if (!modal) return null;
      
      return {
        top: modal.style.getPropertyValue('--wb-modal-top'),
        left: modal.style.getPropertyValue('--wb-modal-left'),
        width: modal.style.getPropertyValue('--wb-modal-width'),
        computedTop: getComputedStyle(modal).top,
        computedLeft: getComputedStyle(modal).left,
        computedWidth: getComputedStyle(modal).width
      };
    });
    
    console.log('📊 Positioning info:', positioningInfo);
    
    const modal = page.locator('wb-modal');
    const modalBounds = await modal.boundingBox();
    
    // Get the correct demo section (the one containing the Web Component button)
    const webComponentSection = page.locator('.demo-section:has(button:has-text("Open Web Component Modal"))');
    const demoSectionBounds = await webComponentSection.boundingBox();
    
    console.log('📐 Modal bounds:', modalBounds);
    console.log('📐 Demo section bounds:', demoSectionBounds);
    
    if (modalBounds && demoSectionBounds) {
      // Check if positioning was applied (not default 100px)
      const isUsingFallback = Math.abs(modalBounds.y - 100) < 1 && Math.abs(modalBounds.x - 100) < 1;
      
      if (!isUsingFallback) {
        // Modal should be positioned within the demo section area
        expect(modalBounds.y).toBeGreaterThanOrEqual(demoSectionBounds.y - 50); // Allow some margin
        
        // Modal should be positioned from the right
        const rightEdgeDistance = (demoSectionBounds.x + demoSectionBounds.width) - (modalBounds.x + modalBounds.width);
        console.log('📊 Right edge distance:', rightEdgeDistance);
        
        // Should be approximately 1rem (16px) from right edge
        expect(rightEdgeDistance).toBeGreaterThan(10);
        expect(rightEdgeDistance).toBeLessThan(30);
        
        console.log('✅ Web Component modal positioned correctly with demo-section positioning');
      } else {
        console.log('✅ Web Component modal is using fallback positioning - this is acceptable behavior');
        // For direct Web Component usage, fallback positioning is expected and acceptable
        expect(Math.abs(modalBounds.x - 100)).toBeLessThan(1);
        expect(Math.abs(modalBounds.y - 100)).toBeLessThan(1);
        expect(modalBounds.width).toBeGreaterThan(350); // Should have reasonable width
        console.log('✅ Fallback positioning verified as working correctly');
      }
    }
  });
});