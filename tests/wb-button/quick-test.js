#!/usr/bin/env node
/**
 * Fixed Button Visibility Test - Works with Shadow DOM
 */

import playwright from 'playwright';

const DEMO_URL = 'http://localhost:8081/components/wb-button/wb-button-demo.html';

async function testButtonVisibility() {
  console.log('🔍 Starting WB Button Visibility Test (Shadow DOM Compatible)...\n');
  
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log(`📄 Loading: ${DEMO_URL}`);
    await page.goto(DEMO_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Test 1: Check if buttons exist and have proper styling
    console.log('\n✅ Test 1: Check button rendering and styling');
    const buttonInfo = await page.evaluate(() => {
      const wbButton = document.querySelector('wb-button[variant="primary"]');
      if (!wbButton) return { error: 'No wb-button found' };
      
      const button = wbButton.querySelector('button');
      if (!button) return { error: 'No button element found' };
      
      const styles = window.getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      
      return {
        exists: true,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        width: rect.width,
        height: rect.height,
        hasVariantClass: button.classList.contains('wb-btn--primary'),
        text: button.textContent.trim()
      };
    });
    
    console.log('   Button info:', JSON.stringify(buttonInfo, null, 2));
    
    if (!buttonInfo.exists) {
      throw new Error(`❌ FAIL: ${buttonInfo.error}`);
    }
    
    if (buttonInfo.display === 'none') {
      throw new Error('❌ FAIL: Button has display: none');
    }
    
    if (buttonInfo.visibility === 'hidden') {
      throw new Error('❌ FAIL: Button has visibility: hidden');
    }
    
    if (buttonInfo.opacity === '0') {
      throw new Error('❌ FAIL: Button has opacity: 0');
    }
    
    if (buttonInfo.width === 0 || buttonInfo.height === 0) {
      throw new Error('❌ FAIL: Button has zero dimensions');
    }
    
    if (buttonInfo.backgroundColor === 'rgba(0, 0, 0, 0)' || buttonInfo.backgroundColor === 'transparent') {
      throw new Error('❌ FAIL: Button has transparent background');
    }
    
    if (!buttonInfo.hasVariantClass) {
      throw new Error('❌ FAIL: Button missing variant class');
    }
    
    console.log('   ✅ Primary button is properly styled and rendered');
    
    // Test 2: Check all variants
    console.log('\n✅ Test 2: Check all button variants');
    const variants = await page.evaluate(() => {
      const variantTypes = ['primary', 'secondary', 'success'];
      return variantTypes.map(variant => {
        const wbButton = document.querySelector(`wb-button[variant="${variant}"]`);
        if (!wbButton) return { variant, error: 'Not found' };
        
        const button = wbButton.querySelector('button');
        if (!button) return { variant, error: 'No button element' };
        
        const styles = window.getComputedStyle(button);
        const rect = button.getBoundingClientRect();
        
        return {
          variant,
          visible: styles.display !== 'none' && styles.visibility !== 'hidden' && parseFloat(styles.opacity) > 0,
          backgroundColor: styles.backgroundColor,
          width: rect.width,
          height: rect.height
        };
      });
    });
    
    variants.forEach(v => {
      console.log(`   ${v.variant}: visible=${v.visible}, bg=${v.backgroundColor}, ${v.width}x${v.height}`);
      if (!v.visible) {
        throw new Error(`❌ FAIL: ${v.variant} button not visible`);
      }
    });
    
    // Test 3: Click test
    console.log('\n✅ Test 3: Test button click functionality');
    const clickWorked = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clicked = false;
        document.addEventListener('wb-button:click', () => {
          clicked = true;
        });
        
        const wbButton = document.querySelector('wb-button[variant="primary"]');
        if (wbButton) {
          const button = wbButton.querySelector('button');
          if (button) {
            button.click();
          }
        }
        
        setTimeout(() => resolve(clicked), 500);
      });
    });
    
    if (!clickWorked) {
      throw new Error('❌ FAIL: Button click event not fired');
    }
    console.log('   ✅ Button click works');
    
    // Test 4: Toggle functionality
    console.log('\n✅ Test 4: Test toggle button');
    const toggleWorked = await page.evaluate(() => {
      const wbButton = document.querySelector('wb-button[variant="toggle"]');
      if (!wbButton) return false;
      
      const button = wbButton.querySelector('button');
      if (!button) return false;
      
      const wasActive = button.classList.contains('active');
      button.click();
      
      // Wait for state change
      return new Promise((resolve) => {
        setTimeout(() => {
          const isActive = button.classList.contains('active');
          resolve(isActive !== wasActive);
        }, 300);
      });
    });
    
    if (!toggleWorked) {
      throw new Error('❌ FAIL: Toggle button not working');
    }
    console.log('   ✅ Toggle button works');
    
    // Test 5: Screenshot
    console.log('\n✅ Test 5: Taking screenshot');
    await page.screenshot({ 
      path: 'tests/wb-button/screenshots/button-test-result.png',
      fullPage: true 
    });
    console.log('   Screenshot saved');
    
    console.log('\n🎉 ALL TESTS PASSED! Buttons are working correctly.\n');
    
    console.log('Browser will stay open for 5 seconds...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('\n💥 TEST FAILED:', error.message);
    console.log('\nBrowser will stay open for 30 seconds for debugging...');
    await page.waitForTimeout(30000);
    throw error;
  } finally {
    await browser.close();
  }
}

testButtonVisibility()
  .then(() => {
    console.log('✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed');
    process.exit(1);
  });
