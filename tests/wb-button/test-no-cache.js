#!/usr/bin/env node
/**
 * Test with cache disabled
 */

import playwright from 'playwright';

const DEMO_URL = 'http://localhost:8081/components/wb-button/wb-button-demo.html';

async function testWithCacheClear() {
  console.log('🔍 Testing with cache disabled...\n');
  
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Disable cache
  await context.route('**/*', route => {
    route.continue();
  });
  
  await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const check = await page.evaluate(() => {
    const wbDemo = document.querySelector('wb-demo');
    if (!wbDemo?.shadowRoot) return { error: 'No shadow root' };
    
    const examplesPanel = wbDemo.shadowRoot.querySelector('#examples-panel');
    const examplesTab = Array.from(wbDemo.shadowRoot.querySelectorAll('.tab-button'))
      .find(btn => btn.textContent.includes('Examples'));
    
    const styles = window.getComputedStyle(examplesPanel);
    
    return {
      examplesPanel: {
        display: styles.display,
        hasActive: examplesPanel.classList.contains('active')
      },
      examplesTab: {
        hasActive: examplesTab?.classList.contains('active')
      }
    };
  });
  
  console.log('Tab state:', JSON.stringify(check, null, 2));
  
  const buttonCheck = await page.evaluate(() => {
    const btn = document.querySelector('wb-button[variant="primary"] button');
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  
  console.log('Button dimensions:', buttonCheck);
  
  if (buttonCheck && buttonCheck.width > 0 && buttonCheck.height > 0) {
    console.log('\n✅ BUTTONS ARE VISIBLE!\n');
  } else {
    console.log('\n❌ STILL NOT VISIBLE\n');
  }
  
  console.log('Browser open for 30 seconds...');
  await page.waitForTimeout(30000);
  
  await browser.close();
}

testWithCacheClear();
