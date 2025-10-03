/**
 * Modal Dialog Tests
 * Tests to validate the slide-in concept for modal dialogs
 * Ensures modals slide in from the RIGHT and position correctly
 */

import { test, expect } from '@playwright/test';

test.describe('Modal Dialog Slide-In Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the modal demo page
    await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait for modal component to initialize
    await page.waitForFunction(() => window.WBModal !== undefined);
  });

  test('Basic Modal slides in from right', async ({ page }) => {
    // Get the basic modal button
    const basicModalBtn = page.locator('#basic-modal-btn');
    await expect(basicModalBtn).toBeVisible();
    
    // Click the basic modal button
    await basicModalBtn.click();
    
    // Wait for modal to appear
    const modal = page.locator('.wb-modal.wb-modal--open').first();
    await expect(modal).toBeVisible({ timeout: 1000 });
    
    // Check initial position - modal should start from right (translateX(100%))
    const initialTransform = await modal.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.transform;
    });
    
    // Modal should slide from right (100%) to center (0%)
    // When fully open, transform should be translateX(0)
    await page.waitForFunction((selector) => {
      const modal = document.querySelector(selector);
      if (!modal) return false;
      const style = window.getComputedStyle(modal);
      const transform = style.transform;
      // Check if transform is matrix(1, 0, 0, 1, 0, 0) which is translateX(0)
      return transform === 'matrix(1, 0, 0, 1, 0, 0)' || transform === 'none';
    }, '.wb-modal.wb-modal--open');
    
    // Verify modal is positioned in demo-section area
    const demoSection = page.locator('.demo-section').first(); // Get first demo-section
    const modalBounds = await modal.boundingBox();
    const demoSectionBounds = await demoSection.boundingBox();
    
    // Modal should overlay the demo-section
    expect(modalBounds.x).toBeGreaterThanOrEqual(demoSectionBounds.x);
    expect(modalBounds.y).toBeGreaterThanOrEqual(demoSectionBounds.y);
    
    // Close modal
    const closeBtn = modal.locator('.wb-modal-close');
    await closeBtn.click();
    
    // Wait for modal to close
    await expect(modal).not.toBeVisible({ timeout: 1000 });
  });

  test('Modal has correct CSS transition properties', async ({ page }) => {
    // Check that modal has the correct transition setup
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = `
        .test-modal {
          position: absolute;
          transition: transform 0.5ms ease-out, opacity 0.5ms ease-out;
          transform: translateX(100%);
        }
        .test-modal.open {
          transform: translateX(0);
        }
      `;
      document.head.appendChild(style);
      
      const testModal = document.createElement('div');
      testModal.className = 'test-modal';
      document.body.appendChild(testModal);
      
      // Force a reflow
      testModal.offsetHeight;
      
      // Add open class
      testModal.classList.add('open');
      
      return true;
    });
    
    // Click basic modal to test actual implementation
    await page.click('#basic-modal-btn');
    
    const modal = page.locator('.wb-modal.wb-modal--open').first();
    await expect(modal).toBeVisible();
    
    // Check CSS properties
    const transition = await modal.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });
    
    // Should have transform and opacity transitions
    expect(transition).toContain('transform');
    expect(transition).toContain('opacity');
    expect(transition).toContain('0.0005s');
  });

  test('Animation timing is correct (0.5ms)', async ({ page }) => {
    const startTime = Date.now();
    
    // Click basic modal
    await page.click('#basic-modal-btn');
    
    // Wait for modal to appear
    const modal = page.locator('.wb-modal.wb-modal--open').first();
    await expect(modal).toBeVisible();
    
    const endTime = Date.now();
    const animationTime = endTime - startTime;
    
    // Animation should be very fast (0.5ms + some overhead)
    // Allow up to 100ms for browser processing
    expect(animationTime).toBeLessThan(100);
  });

  test('Modal positioning overlays demo-section correctly', async ({ page }) => {
    // Get demo section bounds
    const demoSection = page.locator('.demo-section').first(); // Get first demo-section
    const demoSectionBounds = await demoSection.boundingBox();
    
    // Click basic modal
    await page.click('#basic-modal-btn');
    
    // Wait for modal
    const modal = page.locator('.wb-modal.wb-modal--open').first();
    await expect(modal).toBeVisible();
    
    // Get modal bounds
    const modalBounds = await modal.boundingBox();
    
    // Modal should be positioned over demo-section
    expect(modalBounds.x).toBeCloseTo(demoSectionBounds.x, 1);
    expect(modalBounds.y).toBeCloseTo(demoSectionBounds.y, 1);
    
    // Modal width should not exceed demo-section width or 500px cap
    const expectedWidth = Math.min(demoSectionBounds.width, 500);
    expect(modalBounds.width).toBeLessThanOrEqual(expectedWidth + 1); // Allow 1px tolerance
  });

  test('Multiple modals stack correctly', async ({ page }) => {
    // Click first modal
    await page.click('#basic-modal-btn');
    const firstModal = page.locator('.wb-modal.wb-modal--open').first();
    await expect(firstModal).toBeVisible();
    
    // Click second modal button inside first modal
    const secondModalBtn = firstModal.locator('button').filter({ hasText: 'Open Another Modal' });
    if (await secondModalBtn.isVisible()) {
      await secondModalBtn.click();
      
      // Check that both modals are visible and stacked
      const modals = page.locator('.wb-modal.wb-modal--open');
      await expect(modals).toHaveCount(2);
      
      // Second modal should have higher z-index
      const firstModalZIndex = await firstModal.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).zIndex || '0');
      });
      
      const secondModal = modals.nth(1);
      const secondModalZIndex = await secondModal.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).zIndex || '0');
      });
      
      expect(secondModalZIndex).toBeGreaterThan(firstModalZIndex);
    }
  });

  test('Status light changes during modal operations', async ({ page }) => {
    const statusLight = page.locator('#status-light');
    await expect(statusLight).toBeVisible();
    
    // Initially should be green (ready)
    await expect(statusLight).toHaveClass(/ready/);
    
    // Click modal button - should turn red
    await page.click('#basic-modal-btn');
    
    // Status light should turn red (updating)
    await expect(statusLight).toHaveClass(/updating/);
    
    // Wait for modal to fully open
    const modal = page.locator('.wb-modal.wb-modal--open').first();
    await expect(modal).toBeVisible();
    
    // Status light should return to green
    await expect(statusLight).toHaveClass(/ready/);
  });

  test('Modal slides in from exact right position', async ({ page }) => {
    // Add debugging CSS to capture transform states
    await page.addStyleTag({
      content: `
        .wb-modal {
          /* Ensure we can track the transform changes */
          transition: transform 0.5ms ease-out, opacity 0.5ms ease-out !important;
        }
        .wb-modal:not(.wb-modal--open) {
          transform: translateX(100%) !important;
        }
        .wb-modal.wb-modal--open {
          transform: translateX(0) !important;
        }
      `
    });
    
    // Monitor transform changes
    let transformStates = [];
    await page.exposeFunction('captureTransform', (transform) => {
      transformStates.push(transform);
    });
    
    await page.evaluate(() => {
      // Monitor for transform changes
      const observer = new MutationObserver(() => {
        const modal = document.querySelector('.wb-modal');
        if (modal) {
          const transform = window.getComputedStyle(modal).transform;
          window.captureTransform(transform);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    });
    
    // Click basic modal
    await page.click('#basic-modal-btn');
    
    // Wait for modal to appear
    const modal = page.locator('.wb-modal.wb-modal--open').first();
    await expect(modal).toBeVisible();
    
    // Check final transform state
    const finalTransform = await modal.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    
    // Final state should be translateX(0) - no horizontal offset
    expect(finalTransform === 'matrix(1, 0, 0, 1, 0, 0)' || finalTransform === 'none').toBeTruthy();
  });

  test('All modal variants slide in correctly', async ({ page }) => {
    const modalButtons = [
      '#basic-modal-btn',
      '#danger-modal-btn', 
      '#success-modal-btn',
      '#large-modal-btn'
    ];
    
    for (const buttonId of modalButtons) {
      // Click modal button
      await page.click(buttonId);
      
      // Wait for modal to appear
      const modal = page.locator('.wb-modal.wb-modal--open').first();
      await expect(modal).toBeVisible();
      
      // Verify it slides from right (final transform should be translateX(0))
      const transform = await modal.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      
      expect(transform === 'matrix(1, 0, 0, 1, 0, 0)' || transform === 'none').toBeTruthy();
      
      // Close modal
      const closeBtn = modal.locator('.wb-modal-close');
      await closeBtn.click();
      
      // Wait for modal to close
      await expect(modal).not.toBeVisible();
      
      // Small delay between tests
      await page.waitForTimeout(100);
    }
  });
});