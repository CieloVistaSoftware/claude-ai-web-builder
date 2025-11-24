#!/usr/bin/env node
/**
 * Debug script - Find out WHY buttons aren't visible
 */

import playwright from 'playwright';

const DEMO_URL = 'http://localhost:8081/components/wb-button/wb-button-demo.html';

async function debugButtons() {
  console.log('🔍 Debugging button visibility...\n');
  
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check what's actually in the DOM
    const debug = await page.evaluate(() => {
      const wbButton = document.querySelector('wb-button[variant="primary"]');
      if (!wbButton) return { error: 'No wb-button found' };
      
      const button = wbButton.querySelector('button');
      if (!button) return { error: 'No button element found inside wb-button' };
      
      const styles = window.getComputedStyle(button);
      const wbButtonStyles = window.getComputedStyle(wbButton);
      
      return {
        wbButton: {
          display: wbButtonStyles.display,
          visibility: wbButtonStyles.visibility,
          opacity: wbButtonStyles.opacity,
          position: wbButtonStyles.position,
          width: wbButtonStyles.width,
          height: wbButtonStyles.height
        },
        button: {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          width: styles.width,
          height: styles.height,
          padding: styles.padding,
          border: styles.border,
          className: button.className,
          innerHTML: button.innerHTML.substring(0, 100)
        },
        slotted: {
          parentTag: wbButton.parentElement?.tagName,
          parentId: wbButton.parentElement?.id,
          parentClass: wbButton.parentElement?.className,
          insideShadowRoot: wbButton.getRootNode() !== document
        }
      };
    });
    
    console.log('🔍 Debug Info:');
    console.log(JSON.stringify(debug, null, 2));
    
    // Check if wb-demo is hiding content
    const demoPanel = await page.evaluate(() => {
      const panel = document.querySelector('#examples-panel');
      if (!panel) return { error: 'No examples-panel found' };
      
      const styles = window.getComputedStyle(panel);
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        className: panel.className
      };
    });
    
    console.log('\n📋 Examples Panel:');
    console.log(JSON.stringify(demoPanel, null, 2));
    
    // Check if we're in Shadow DOM
    const shadowInfo = await page.evaluate(() => {
      const wbDemo = document.querySelector('wb-demo');
      if (!wbDemo) return { error: 'No wb-demo found' };
      
      return {
        hasShadowRoot: !!wbDemo.shadowRoot,
        slotContent: wbDemo.querySelector('[slot="examples"]') ? 'found' : 'not found'
      };
    });
    
    console.log('\n👥 Shadow DOM Info:');
    console.log(JSON.stringify(shadowInfo, null, 2));
    
    console.log('\n\nBrowser staying open for 60 seconds...');
    await page.waitForTimeout(60000);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugButtons();
