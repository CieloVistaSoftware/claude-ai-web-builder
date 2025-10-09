/**
 * Control Panel Deep Inspection Test
 * 
 * This test waits longer and inspects nested shadow DOM to find where the range inputs are.
 */

import { test, expect } from '@playwright/test';

test.describe('Control Panel Deep Inspection', () => {
  
  test('wait longer and check nested shadow DOM for range inputs', async ({ page }) => {
    // Navigate to control panel demo
    await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
    
    // Wait for control panel to load
    await page.waitForSelector('#main-control-panel', { state: 'visible' });
    console.log('✅ Control panel loaded');
    
    // Wait for wb-color-bars to be attached
    await page.waitForSelector('wb-color-bars', { state: 'attached' });
    console.log('✅ wb-color-bars attached');
    
    // Wait much longer for components to initialize fully
    await page.waitForTimeout(5000);
    console.log('✅ Waited 5 seconds for full initialization');
    
    // Deep inspection of all shadow DOM layers
    const deepInspection = await page.evaluate(() => {
      interface InputInfo {
        path: string;
        id: string;
        type: string;
        value: string;
        min: string;
        max: string;
        visible: boolean;
        computed: {
          display: string;
          visibility: string;
          opacity: string;
        };
      }
      
      const inputs: InputInfo[] = [];
      let pathCounter = 0;
      
      function inspectElement(element: Element, path: string) {
        pathCounter++;
        if (pathCounter > 1000) return; // Prevent infinite loops
        
        // Check if this element is an input
        if (element.tagName === 'INPUT') {
          const inputEl = element as HTMLInputElement;
          const computed = window.getComputedStyle(inputEl);
          inputs.push({
            path,
            id: inputEl.id,
            type: inputEl.type,
            value: inputEl.value,
            min: inputEl.min,
            max: inputEl.max,
            visible: inputEl.offsetParent !== null,
            computed: {
              display: computed.display,
              visibility: computed.visibility,
              opacity: computed.opacity
            }
          });
        }
        
        // Check shadow DOM
        if (element.shadowRoot) {
          const shadowChildren = element.shadowRoot.children;
          for (let i = 0; i < shadowChildren.length; i++) {
            inspectElement(shadowChildren[i], `${path} > shadow[${i}]`);
          }
        }
        
        // Check regular children
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
          inspectElement(children[i], `${path} > [${i}]`);
        }
      }
      
      // Start inspection from document body
      inspectElement(document.body, 'body');
      
      return {
        inputs,
        pathCounter,
        colorBarsElements: document.querySelectorAll('wb-color-bars').length,
        colorBarElements: document.querySelectorAll('wb-color-bar').length
      };
    });
    
    console.log('\\n=== DEEP SHADOW DOM INSPECTION ===');
    console.log(`Inspected ${deepInspection.pathCounter} elements`);
    console.log(`Found wb-color-bars: ${deepInspection.colorBarsElements}`);
    console.log(`Found wb-color-bar: ${deepInspection.colorBarElements}`);
    console.log(`Found inputs: ${deepInspection.inputs.length}`);
    
    console.log('\\n=== ALL INPUTS FOUND ===');
    deepInspection.inputs.forEach((input, i) => {
      console.log(`Input ${i}:`, {
        path: input.path,
        type: input.type,
        id: input.id,
        value: input.value,
        range: input.type === 'range' ? `${input.min}-${input.max}` : 'N/A',
        visible: input.visible,
        display: input.computed.display,
        visibility: input.computed.visibility,
        opacity: input.computed.opacity
      });
    });
    
    // Filter for range inputs specifically
    const rangeInputs = deepInspection.inputs.filter(input => input.type === 'range');
    console.log(`\\n=== RANGE INPUTS SPECIFICALLY ===`);
    console.log(`Found ${rangeInputs.length} range inputs`);
    
    rangeInputs.forEach((input, i) => {
      console.log(`Range ${i}:`, {
        path: input.path,
        id: input.id,
        value: input.value,
        range: `${input.min}-${input.max}`,
        visible: input.visible,
        styles: input.computed
      });
    });
    
    if (rangeInputs.length === 0) {
      console.log('❌ Still no range inputs found even with deep inspection');
      
      // Let's check if the components are actually working by looking at console messages
      const logs = await page.evaluate(() => {
        // Force re-initialization if needed
        const colorBars = document.querySelectorAll('wb-color-bars');
        const results: any[] = [];
        
        colorBars.forEach((colorBar, i) => {
          results.push({
            index: i,
            id: colorBar.id,
            tagName: colorBar.tagName,
            shadowRoot: !!colorBar.shadowRoot,
            childElementCount: colorBar.childElementCount,
            innerHTML: colorBar.innerHTML
          });
          
          // Try to access any methods or properties
          if (colorBar.shadowRoot) {
            const allElements = colorBar.shadowRoot.querySelectorAll('*');
            results.push({
              shadowElements: Array.from(allElements).map(el => ({
                tagName: el.tagName,
                id: (el as any).id,
                className: el.className,
                type: (el as any).type
              }))
            });
          }
        });
        
        return results;
      });
      
      console.log('\\n=== WB-COLOR-BARS DETAILED ANALYSIS ===');
      logs.forEach((log, i) => {
        console.log(`ColorBars ${i}:`, log);
      });
      
    } else {
      console.log('✅ Found range inputs! The hue sliders exist.');
      
      // Test if we can interact with them
      for (const input of rangeInputs) {
        if (input.visible) {
          console.log(`Testing interaction with range input at: ${input.path}`);
          
          // Try to find and interact with this input
          try {
            // This is tricky because we need to access shadow DOM
            await page.evaluate((inputPath) => {
              // We'll need to manually traverse the path to find the element
              console.log(`Trying to interact with input at path: ${inputPath}`);
            }, input.path);
          } catch (error) {
            console.log(`Error interacting with input: ${error}`);
          }
        }
      }
    }
    
    console.log('\\n=== CONCLUSION ===');
    if (rangeInputs.length > 0) {
      console.log(`✅ SUCCESS: Found ${rangeInputs.length} range inputs for hue slider testing`);
    } else {
      console.log('❌ PROBLEM: No range inputs found - wb-color-bars components may not be initializing properly');
    }
  });
});