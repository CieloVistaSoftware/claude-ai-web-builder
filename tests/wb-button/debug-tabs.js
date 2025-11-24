#!/usr/bin/env node
/**
 * Debug script - Check Shadow DOM internals
 */

import playwright from 'playwright';

const DEMO_URL = 'http://localhost:8081/components/wb-button/wb-button-demo.html';

async function debugShadowDOM() {
  console.log('🔍 Checking Shadow DOM and tab state...\n');
  
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check Shadow DOM structure
    const shadowDebug = await page.evaluate(() => {
      const wbDemo = document.querySelector('wb-demo');
      if (!wbDemo || !wbDemo.shadowRoot) {
        return { error: 'No wb-demo shadow root' };
      }
      
      const shadow = wbDemo.shadowRoot;
      
      // Find the examples panel in Shadow DOM
      const examplesPanel = shadow.querySelector('#examples-panel');
      const docsPanel = shadow.querySelector('#docs-panel');
      const tabButtons = shadow.querySelectorAll('.tab-button');
      
      const examplesPanelStyles = examplesPanel ? window.getComputedStyle(examplesPanel) : null;
      const docsPanelStyles = docsPanel ? window.getComputedStyle(docsPanel) : null;
      
      return {
        examplesPanel: examplesPanel ? {
          exists: true,
          display: examplesPanelStyles.display,
          className: examplesPanel.className,
          hasActiveClass: examplesPanel.classList.contains('active')
        } : { exists: false },
        docsPanel: docsPanel ? {
          exists: true,
          display: docsPanelStyles.display,
          className: docsPanel.className,
          hasActiveClass: docsPanel.classList.contains('active')
        } : { exists: false },
        tabs: Array.from(tabButtons).map((btn, i) => ({
          index: i,
          text: btn.textContent,
          active: btn.classList.contains('active'),
          dataTab: btn.dataset.tab
        })),
        slotElements: Array.from(wbDemo.querySelectorAll('[slot]')).map(el => ({
          slot: el.getAttribute('slot'),
          tagName: el.tagName,
          childCount: el.children.length
        }))
      };
    });
    
    console.log('🔍 Shadow DOM Structure:');
    console.log(JSON.stringify(shadowDebug, null, 2));
    
    // Click the Examples tab
    console.log('\n🖱️  Clicking Examples tab...');
    await page.evaluate(() => {
      const wbDemo = document.querySelector('wb-demo');
      if (wbDemo && wbDemo.shadowRoot) {
        const examplesTab = Array.from(wbDemo.shadowRoot.querySelectorAll('.tab-button'))
          .find(btn => btn.textContent.includes('Examples'));
        if (examplesTab) {
          examplesTab.click();
        }
      }
    });
    
    await page.waitForTimeout(500);
    
    // Check again after clicking
    const afterClick = await page.evaluate(() => {
      const wbDemo = document.querySelector('wb-demo');
      if (!wbDemo || !wbDemo.shadowRoot) return null;
      
      const examplesPanel = wbDemo.shadowRoot.querySelector('#examples-panel');
      const styles = examplesPanel ? window.getComputedStyle(examplesPanel) : null;
      
      return {
        display: styles?.display,
        className: examplesPanel?.className,
        hasActiveClass: examplesPanel?.classList.contains('active')
      };
    });
    
    console.log('\n📋 After clicking Examples tab:');
    console.log(JSON.stringify(afterClick, null, 2));
    
    // Check if buttons are now visible
    const buttonsVisible = await page.evaluate(() => {
      const wbButton = document.querySelector('wb-button[variant="primary"]');
      if (!wbButton) return false;
      
      const button = wbButton.querySelector('button');
      if (!button) return false;
      
      const rect = button.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    
    console.log(`\n👁️  Buttons visible: ${buttonsVisible}`);
    
    console.log('\n\n⏳ Browser staying open for 60 seconds - CHECK THE BROWSER WINDOW NOW!');
    await page.waitForTimeout(60000);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugShadowDOM();
