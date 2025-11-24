/**
 * WB Button - Visual Regression Test
 * CRITICAL: Tests that buttons are actually VISIBLE on the page
 */

const { test, expect } = require('@playwright/test');

const DEMO_URL = 'http://localhost:8081/components/wb-button/wb-button-demo.html';

test.describe('WB Button - VISUAL VERIFICATION (buttons must be visible!)', () => {
  
  test('CRITICAL: Buttons must be visible with proper styling', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for CSS to load
    
    // Check that wb-button elements exist
    const buttonCount = await page.locator('wb-button').count();
    expect(buttonCount).toBeGreaterThan(0);
    console.log(`✅ Found ${buttonCount} wb-button elements`);
    
    // Check that actual <button> elements are rendered inside wb-button
    const actualButtons = await page.locator('wb-button button.wb-btn').count();
    expect(actualButtons).toBeGreaterThan(0);
    console.log(`✅ Found ${actualButtons} actual button elements with .wb-btn class`);
    
    // CRITICAL: Check that buttons have background color (not transparent/invisible)
    const primaryButton = page.locator('wb-button[variant="primary"]').first().locator('button');
    await expect(primaryButton).toBeVisible();
    
    const bgColor = await primaryButton.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.backgroundColor;
    });
    
    console.log(`Primary button background-color: ${bgColor}`);
    
    // Background should NOT be transparent or rgba(0,0,0,0)
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('transparent');
    expect(bgColor).toBeTruthy();
    
    // Check that button has visible dimensions
    const boundingBox = await primaryButton.boundingBox();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox.width).toBeGreaterThan(0);
    expect(boundingBox.height).toBeGreaterThan(0);
    console.log(`Button dimensions: ${boundingBox.width}x${boundingBox.height}`);
    
    // Verify CSS classes are applied
    const hasVariantClass = await primaryButton.evaluate(el => {
      return el.classList.contains('wb-btn--primary');
    });
    expect(hasVariantClass).toBe(true);
    console.log('✅ Button has variant class');
  });

  test('CRITICAL: CSS file must be loaded', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    
    // Check if wb-button.css is loaded
    const cssLoaded = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.some(link => link.href.includes('wb-button.css'));
    });
    
    console.log(`wb-button.css loaded: ${cssLoaded}`);
    expect(cssLoaded).toBe(true);
  });

  test('CRITICAL: All button variants must be visible', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const variants = ['primary', 'secondary', 'success'];
    
    for (const variant of variants) {
      const button = page.locator(`wb-button[variant="${variant}"]`).first().locator('button');
      await expect(button).toBeVisible();
      
      const bgColor = await button.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      console.log(`${variant} button bg-color: ${bgColor}`);
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(bgColor).not.toBe('transparent');
    }
    
    console.log('✅ All button variants are visible with proper styling');
  });

  test('CRITICAL: Buttons must have text content', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    
    const primaryButton = page.locator('wb-button[variant="primary"]').first();
    const text = await primaryButton.textContent();
    
    expect(text).toBeTruthy();
    expect(text.trim().length).toBeGreaterThan(0);
    console.log(`Button text: "${text.trim()}"`);
  });

  test('CRITICAL: Toggle button must show checkmark when active', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    
    const toggleButton = page.locator('wb-button[variant="toggle"]').first();
    
    // Click to activate
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    const buttonEl = toggleButton.locator('button');
    const hasActiveClass = await buttonEl.evaluate(el => el.classList.contains('active'));
    expect(hasActiveClass).toBe(true);
    
    // Check for checkmark
    const checkmark = toggleButton.locator('.wb-btn__checkmark');
    await expect(checkmark).toBeVisible();
    console.log('✅ Toggle button shows checkmark when active');
  });

  test('CRITICAL: Take screenshot to verify visual appearance', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    // Take screenshot of the examples section
    const examplesPanel = page.locator('#examples-panel');
    await expect(examplesPanel).toBeVisible();
    
    await page.screenshot({ path: 'tests/wb-button/screenshots/wb-button-visual.png', fullPage: true });
    console.log('✅ Screenshot saved to tests/wb-button/screenshots/wb-button-visual.png');
  });
});

test.describe('WB Button - CSS Verification', () => {
  
  test('CSS custom properties must be defined', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    
    const button = page.locator('wb-button[variant="primary"]').first().locator('button');
    
    // Check that CSS variables are accessible
    const cssVars = await button.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        primary: style.getPropertyValue('--primary'),
        bgSecondary: style.getPropertyValue('--bg-secondary'),
        textPrimary: style.getPropertyValue('--text-primary'),
      };
    });
    
    console.log('CSS Variables:', cssVars);
    
    // At least one should be defined
    const hasCSSVars = Object.values(cssVars).some(v => v && v.trim().length > 0);
    expect(hasCSSVars).toBe(true);
  });
  
  test('Button must have proper padding', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    
    const button = page.locator('wb-button[variant="primary"]').first().locator('button');
    
    const padding = await button.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        top: style.paddingTop,
        right: style.paddingRight,
        bottom: style.paddingBottom,
        left: style.paddingLeft
      };
    });
    
    console.log('Button padding:', padding);
    
    // Padding should not be 0
    expect(padding.left).not.toBe('0px');
    expect(padding.right).not.toBe('0px');
  });
});
