/**
 * Final Diagnostic Test - Check wb-color-bar Contents
 * 
 * This test will show us exactly what's inside the wb-color-bar shadow DOM
 * to understand why we can't find range inputs.
 */

import { test, expect } from '@playwright/test';

test.describe('WB-Color-Bar Diagnostic', () => {
  
  test('inspect wb-color-bar shadow DOM contents', async ({ page }) => {
    // Navigate to control panel demo
    await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
    
    // Wait for everything to load
    await page.waitForSelector('#main-control-panel', { state: 'visible' });
    await page.waitForSelector('wb-color-bars', { state: 'attached' });
    await page.waitForTimeout(5000); // Extra time for initialization
    
    console.log('=== WB-COLOR-BAR SHADOW DOM DIAGNOSTIC ===');
    
    const diagnosis = await page.evaluate(() => {
      const results: any[] = [];
      const colorBarsElements = document.querySelectorAll('wb-color-bars');
      
      colorBarsElements.forEach((colorBars, colorBarsIndex) => {
        if (colorBars.shadowRoot) {
          const colorBarElements = colorBars.shadowRoot.querySelectorAll('wb-color-bar');
          
          colorBarElements.forEach((colorBar, colorBarIndex) => {
            const analysis = {
              colorBarsId: colorBars.id,
              colorBarsIndex,
              colorBarId: colorBar.id,
              colorBarIndex,
              hasShadowRoot: !!colorBar.shadowRoot,
              innerHTML: colorBar.innerHTML,
              shadowContent: null as any,
              allElements: [] as any[],
              inputs: [] as any[],
              customProperties: [] as any[]
            };
            
            if (colorBar.shadowRoot) {
              // Get all elements in shadow DOM
              const allShadowElements = colorBar.shadowRoot.querySelectorAll('*');
              analysis.allElements = Array.from(allShadowElements).map(el => ({
                tagName: el.tagName,
                id: (el as any).id,
                className: el.className,
                type: (el as any).type,
                textContent: el.textContent?.trim(),
                innerHTML: el.innerHTML?.substring(0, 100)
              }));
              
              // Get all inputs specifically
              const inputs = colorBar.shadowRoot.querySelectorAll('input');
              analysis.inputs = Array.from(inputs).map(input => {
                const inputEl = input as HTMLInputElement;
                return {
                  type: inputEl.type,
                  id: inputEl.id,
                  className: inputEl.className,
                  value: inputEl.value,
                  min: inputEl.min,
                  max: inputEl.max,
                  visible: inputEl.offsetParent !== null,
                  style: inputEl.style.cssText
                };
              });
              
              // Get innerHTML of shadow root
              analysis.shadowContent = colorBar.shadowRoot.innerHTML.substring(0, 500);
              
              // Check for any custom properties or methods
              const customProps = [];
              for (const prop in colorBar) {
                if (typeof (colorBar as any)[prop] === 'function' && !prop.startsWith('_')) {
                  customProps.push(prop);
                }
              }
              analysis.customProperties = customProps;
            }
            
            results.push(analysis);
          });
        }
      });
      
      return results;
    });
    
    console.log(`Found ${diagnosis.length} wb-color-bar elements to analyze:`);
    
    diagnosis.forEach((analysis, i) => {
      console.log(`\\n--- WB-COLOR-BAR ${i + 1} ---`);
      console.log(`ColorBars: ${analysis.colorBarsId} [${analysis.colorBarsIndex}]`);
      console.log(`ColorBar: ${analysis.colorBarId} [${analysis.colorBarIndex}]`);
      console.log(`Has Shadow Root: ${analysis.hasShadowRoot}`);
      console.log(`Inner HTML: ${analysis.innerHTML}`);
      
      if (analysis.hasShadowRoot) {
        console.log(`Shadow DOM Elements: ${analysis.allElements.length}`);
        analysis.allElements.forEach((el: any, j: number) => {
          console.log(`  Element ${j}: ${el.tagName}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className : ''} - ${el.textContent || 'no text'}`);
        });
        
        console.log(`Inputs Found: ${analysis.inputs.length}`);
        analysis.inputs.forEach((input: any, j: number) => {
          console.log(`  Input ${j}:`, {
            type: input.type,
            id: input.id,
            value: input.value,
            range: input.type === 'range' ? `${input.min}-${input.max}` : 'N/A',
            visible: input.visible
          });
        });
        
        console.log(`Custom Methods: ${analysis.customProperties.join(', ')}`);
        console.log(`Shadow Content (first 200 chars): ${analysis.shadowContent.substring(0, 200)}`);
      } else {
        console.log('❌ No shadow root found');
      }
    });
    
    // Summary
    const totalInputs = diagnosis.reduce((sum, analysis) => sum + analysis.inputs.length, 0);
    const rangeInputs = diagnosis.reduce((sum, analysis) => 
      sum + analysis.inputs.filter((input: any) => input.type === 'range').length, 0);
    
    console.log('\\n=== SUMMARY ===');
    console.log(`Total wb-color-bar elements: ${diagnosis.length}`);
    console.log(`Total inputs found: ${totalInputs}`);
    console.log(`Range inputs found: ${rangeInputs}`);
    
    if (rangeInputs === 0) {
      console.log('\\n❌ NO RANGE INPUTS FOUND');
      console.log('This explains why the hue slider tests are failing.');
      console.log('Possible issues:');
      console.log('1. wb-color-bar components are not initializing properly');
      console.log('2. wb-color-bar components do not actually contain range inputs');
      console.log('3. Range inputs are created dynamically and need more time');
      console.log('4. There may be an error in the wb-color-bar component code');
    } else {
      console.log(`\\n✅ FOUND ${rangeInputs} RANGE INPUTS`);
      console.log('The hue sliders exist and can be tested for infinite loops.');
    }
    
    // Don't fail the test, just report findings
    expect(diagnosis.length).toBeGreaterThan(0);
  });
});