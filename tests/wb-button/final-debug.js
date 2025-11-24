#!/usr/bin/env node
import playwright from 'playwright';

const DEMO_URL = 'http://localhost:8081/components/wb-button/wb-button-demo.html?v=3';

async function debugCSS() {
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto(DEMO_URL);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Click Examples tab
  await page.evaluate(() => {
    const wbDemo = document.querySelector('wb-demo');
    if (wbDemo?.shadowRoot) {
      const examplesTab = wbDemo.shadowRoot.querySelector('.tab-button[data-tab="1"]');
      examplesTab?.click();
    }
  });
  
  await page.waitForTimeout(500);
  
  const debug = await page.evaluate(() => {
    const btn = document.querySelector('wb-button[variant="primary"] button');
    if (!btn) return { error: 'No button found' };
    
    const styles = window.getComputedStyle(btn);
    const rect = btn.getBoundingClientRect();
    
    // Get ALL applied styles
    return {
      dimensions: {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left
      },
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      position: styles.position,
      background: styles.backgroundColor,
      color: styles.color,
      padding: styles.padding,
      margin: styles.margin,
      border: styles.border,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      className: btn.className,
      parentDisplay: window.getComputedStyle(btn.parentElement).display,
      parentVisibility: window.getComputedStyle(btn.parentElement).visibility,
      wbButtonDisplay: window.getComputedStyle(btn.closest('wb-button')).display
    };
  });
  
  console.log('FULL BUTTON STYLES:');
  console.log(JSON.stringify(debug, null, 2));
  
  // Take screenshot
  await page.screenshot({ path: 'tests/wb-button/screenshots/debug.png', fullPage: true });
  console.log('\nScreenshot saved: tests/wb-button/screenshots/debug.png');
  
  console.log('\nBrowser staying open for 60 seconds...');
  await page.waitForTimeout(60000);
  
  await browser.close();
}

debugCSS();
