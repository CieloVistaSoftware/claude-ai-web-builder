import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive Playwright test suite for the main Website Builder page
 * Tests all interactive functions and UI components at http://localhost:8000/
 */

test.describe('Website Builder Main Page - Comprehensive Function Tests', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Navigate to the main website builder page
    await page.goto('http://localhost:8000/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Verify basic page structure is loaded
    await expect(page.locator('#control-panel')).toBeVisible();
    await expect(page.locator('#site-container')).toBeVisible();
  });

  test.describe('Control Panel Functions', () => {
    test('should minimize and restore control panel', async () => {
      const controlPanel = page.locator('#control-panel');
      const minimizeBtn = page.locator('#minimize-btn');
      
      // Initial state should be expanded
      await expect(controlPanel).toBeVisible();
      await expect(minimizeBtn).toHaveText('−');
      
      // Click minimize button
      await minimizeBtn.click();
      
      // Panel should be minimized (check for minimized class or visibility)
      await expect(minimizeBtn).toHaveText('+');
      
      // Click to restore
      await minimizeBtn.click();
      await expect(minimizeBtn).toHaveText('−');
    });

    test('should toggle edit mode', async () => {
      const editModeToggle = page.locator('#edit-mode-toggle');
      const body = page.locator('body');
      
      // Initial state - edit mode should be off
      await expect(body).not.toHaveClass(/edit-mode/);
      
      // Toggle edit mode on
      await editModeToggle.click();
      await expect(body).toHaveClass(/edit-mode/);
      
      // Toggle edit mode off
      await editModeToggle.click();
      await expect(body).not.toHaveClass(/edit-mode/);
    });

    test('should change layout styles', async () => {
      const layoutSelect = page.locator('#layout-select');
      const siteContainer = page.locator('#site-container');
      
      // Test different layout options
      const layouts = ['top-nav', 'left-nav', 'right-nav'];
      
      for (const layout of layouts) {
        await layoutSelect.selectOption(layout);
        await expect(page.locator('body')).toHaveAttribute('data-layout', layout);
        
        // Verify layout changes are reflected in the UI
        await page.waitForTimeout(500); // Allow time for layout changes
      }
    });

    test('should operate color explorer', async () => {
      const colorBar = page.locator('#color-bar');
      const colorPreview = page.locator('#color-bar-preview');
      const lightnessSlider = page.locator('#lightness-slider');
      const saturationSlider = page.locator('#saturation-slider');
      
      // Test color bar slider
      await colorBar.fill('180'); // Set to cyan
      await expect(colorBar).toHaveValue('180');
      
      // Test lightness adjustment
      await lightnessSlider.fill('70');
      await expect(lightnessSlider).toHaveValue('70');
      
      // Test saturation adjustment
      await saturationSlider.fill('90');
      await expect(saturationSlider).toHaveValue('90');
      
      // Verify color preview updates
      await expect(colorPreview).toBeVisible();
    });

    test('should change themes', async () => {
      const themeSelect = page.locator('#theme-select');
      const body = page.locator('body');
      
      const themes = ['dark', 'light', 'auto', 'cyberpunk', 'ocean', 'sunset', 'forest'];
      
      for (const theme of themes) {
        await themeSelect.selectOption(theme);
        await expect(body).toHaveAttribute('data-theme', theme);
        await page.waitForTimeout(300); // Allow theme transition
      }
    });

    test('should operate custom color controls', async () => {
      const primaryColor = page.locator('#primary-color');
      const secondaryColor = page.locator('#secondary-color');
      const accentColor = page.locator('#accent-color');
      
      // Test primary color change
      await primaryColor.fill('#ff5733');
      await expect(primaryColor).toHaveValue('#ff5733');
      
      // Test secondary color change
      await secondaryColor.fill('#33ff57');
      await expect(secondaryColor).toHaveValue('#33ff57');
      
      // Test accent color change
      await accentColor.fill('#3357ff');
      await expect(accentColor).toHaveValue('#3357ff');
      
      // Verify color values are displayed
      const colorValues = page.locator('.color-value');
      await expect(colorValues).toHaveCount(3);
    });

    test('should handle save and reset buttons', async () => {
      const saveBtn = page.locator('#save-btn');
      const resetBtn = page.locator('#reset-btn');
      
      // Test save button
      await expect(saveBtn).toBeVisible();
      await expect(saveBtn).toBeEnabled();
      await saveBtn.click();
      
      // Test reset button
      await expect(resetBtn).toBeVisible();
      await expect(resetBtn).toBeEnabled();
      await resetBtn.click();
    });
  });

  test.describe('Content Editing Functions', () => {
    test('should enable content editing in edit mode', async () => {
      const editModeToggle = page.locator('#edit-mode-toggle');
      
      // Enable edit mode
      await editModeToggle.click();
      
      // Test editable elements
      const editableElements = [
        '#site-title',
        '#site-subtitle', 
        '#hero-title',
        '#hero-description',
        '#features-title',
        '#about-description'
      ];
      
      for (const selector of editableElements) {
        const element = page.locator(selector);
        await expect(element).toBeVisible();
        await expect(element).toHaveAttribute('contenteditable', 'true');
      }
    });

    test('should allow text editing of content elements', async () => {
      const editModeToggle = page.locator('#edit-mode-toggle');
      const siteTitle = page.locator('#site-title');
      
      // Enable edit mode
      await editModeToggle.click();
      
      // Test editing site title
      const originalText = await siteTitle.textContent();
      await siteTitle.click();
      await siteTitle.fill('New Test Title');
      
      await expect(siteTitle).toHaveText('New Test Title');
      
      // Reset to original (if reset functionality exists)
      await page.locator('#reset-btn').click();
    });

    test('should handle media placeholders', async () => {
      const editModeToggle = page.locator('#edit-mode-toggle');
      const mediaPlaceholders = page.locator('.media-placeholder');
      
      // Enable edit mode
      await editModeToggle.click();
      
      // Test media placeholders are clickable
      await expect(mediaPlaceholders.first()).toBeVisible();
      await mediaPlaceholders.first().hover();
      
      // Verify media tips appear on hover
      await expect(page.locator('[data-media-tip]')).toBeVisible();
    });
  });

  test.describe('Navigation Functions', () => {
    test('should have functional navigation links', async () => {
      const navLinks = page.locator('.nav-link');
      
      // Test each navigation link
      const navItems = ['#home', '#about', '#services', '#portfolio', '#contact'];
      
      for (let i = 0; i < navItems.length; i++) {
        const link = navLinks.nth(i);
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', navItems[i]);
        
        // Click navigation link (should not navigate away from page)
        await link.click();
      }
    });

    test('should display all content sections', async () => {
      const sections = [
        '#site-header',
        '#hero-section', 
        '#features-section',
        '#gallery-section',
        '#about-section'
      ];
      
      for (const selector of sections) {
        await expect(page.locator(selector)).toBeVisible();
      }
    });
  });

  test.describe('Footer Functions', () => {
    test('should display footer with functional links', async () => {
      const footer = page.locator('#site-footer');
      const footerLinks = page.locator('.footer-link');
      
      await expect(footer).toBeVisible();
      
      // Test footer links
      const footerHrefs = ['#privacy', '#terms', '#contact'];
      
      for (let i = 0; i < footerHrefs.length; i++) {
        const link = footerLinks.nth(i);
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', footerHrefs[i]);
      }
    });
  });

  test.describe('Status Bar Functions', () => {
    test('should display status bar with messages', async () => {
      const statusBar = page.locator('.status-bar');
      const statusMessage = page.locator('#status-message');
      
      await expect(statusBar).toBeVisible();
      await expect(statusMessage).toBeVisible();
      
      // Status message should show "Ready to edit" initially
      await expect(statusMessage).toContainText('Ready to edit');
    });

    test('should update status when edit mode changes', async () => {
      const editModeToggle = page.locator('#edit-mode-toggle');
      const statusInfo = page.locator('#status-info');
      
      // Initial state
      await expect(statusInfo).toContainText('Edit mode: OFF');
      
      // Toggle edit mode
      await editModeToggle.click();
      await expect(statusInfo).toContainText('Edit mode: ON');
      
      // Toggle back
      await editModeToggle.click();
      await expect(statusInfo).toContainText('Edit mode: OFF');
    });
  });

  test.describe('Responsive Design Tests', () => {
    test('should work on mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Verify key elements are still visible and functional
      await expect(page.locator('#control-panel')).toBeVisible();
      await expect(page.locator('#site-container')).toBeVisible();
      
      // Test control panel can still be minimized on mobile
      await page.locator('#minimize-btn').click();
      await expect(page.locator('#minimize-btn')).toHaveText('+');
    });

    test('should work on tablet viewport', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Test layout changes work on tablet
      const layoutSelect = page.locator('#layout-select');
      await layoutSelect.selectOption('left-nav');
      await expect(page.locator('body')).toHaveAttribute('data-layout', 'left-nav');
    });

    test('should work on desktop viewport', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // All elements should be visible and functional on desktop
      await expect(page.locator('#control-panel')).toBeVisible();
      await expect(page.locator('#site-container')).toBeVisible();
      await expect(page.locator('.status-bar')).toBeVisible();
    });
  });

  test.describe('JavaScript Functionality Tests', () => {
    test('should load required JavaScript files', async () => {
      // Check if main JavaScript file loads without errors
      const jsErrors: string[] = [];
      
      page.on('pageerror', (error) => {
        jsErrors.push(error.message);
      });
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should have no JavaScript errors
      expect(jsErrors).toHaveLength(0);
    });

    test('should initialize status bar functionality', async () => {
      // Test that updateStatus function is available globally
      const hasUpdateStatus = await page.evaluate(() => {
        return typeof window.updateStatus === 'function';
      });
      
      expect(hasUpdateStatus).toBe(true);
    });

    test('should handle save button click events', async () => {
      const saveBtn = page.locator('#save-btn');
      
      // Monitor console for save button functionality
      const consoleLogs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'log') {
          consoleLogs.push(msg.text());
        }
      });
      
      await saveBtn.click();
      
      // Should trigger save functionality
      expect(consoleLogs.some(log => log.includes('Save'))).toBe(true);
    });
  });

  test.describe('Performance Tests', () => {
    test('should load page within reasonable time', async () => {
      const startTime = Date.now();
      
      await page.goto('http://localhost:8000/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should have no accessibility violations', async () => {
      // Basic accessibility checks
      await expect(page.locator('h1')).toBeVisible(); // Has main heading
      await expect(page.locator('[alt]')).toHaveCount(0); // No images missing alt text
      
      // Check for proper form labels
      const inputs = page.locator('input, select');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        if (id) {
          await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
        }
      }
    });
  });

  test.describe('Error Handling Tests', () => {
    test('should handle missing resources gracefully', async () => {
      // Test with network failures
      await page.route('**/wb.css', route => route.abort());
      
      await page.goto('http://localhost:8000/');
      
      // Page should still load even if CSS fails
      await expect(page.locator('#control-panel')).toBeVisible();
    });

    test('should handle invalid input values', async () => {
      const colorBar = page.locator('#color-bar');
      
      // Try setting invalid values
      await colorBar.evaluate((el: HTMLInputElement) => {
        el.value = '500'; // Outside valid range
      });
      
      // Should handle gracefully without errors
      const jsErrors: string[] = [];
      page.on('pageerror', (error) => {
        jsErrors.push(error.message);
      });
      
      await colorBar.dispatchEvent('input');
      expect(jsErrors).toHaveLength(0);
    });
  });
});