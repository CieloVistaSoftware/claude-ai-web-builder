/**
 * Control Panel Element Detection Test
 * 
 * This test inspects the actual DOM structure of the control panel to understand
 * what elements are present and why the hue loop tests are failing.
 */

import { test, expect } from '@playwright/test';

test.describe('Control Panel Element Detection', () => {
  
  test('inspect control panel DOM structure', async ({ page }) => {
    // Navigate to control panel demo
    await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
    
    // Wait for control panel to load
    await page.waitForSelector('#main-control-panel', { state: 'visible' });
    await page.waitForTimeout(3000); // Give components time to fully initialize
    
    // Get information about all interactive elements
    const elementInfo = await page.evaluate(() => {
      interface RangeInputInfo {
        index: number;
        id: string;
        className: string;
        value: string;
        min: string;
        max: string;
        visible: boolean;
        parentId?: string;
        parentClass?: string;
      }
      
      interface InputInfo {
        index: number;
        type: string;
        id: string;
        className: string;
        value: string;
        visible: boolean;
      }
      
      interface ButtonInfo {
        index: number;
        id: string;
        className: string;
        textContent?: string;
        visible: boolean;
      }
      
      interface ColorBarInfo {
        index: number;
        id: string;
        className: string;
        visible: boolean;
        shadowRoot: boolean;
        innerHTML: string;
      }
      
      interface ColorComponentInfo {
        index: number;
        id: string;
        className: string;
        visible: boolean;
        shadowRoot: boolean;
      }
      
      interface StructureInfo {
        id: string;
        className: string;
        childElementCount: number;
        innerHTML: string;
      }
      
      const info = {
        rangeInputs: [] as RangeInputInfo[],
        buttons: [] as ButtonInfo[],
        selects: [] as any[],
        colorBars: [] as ColorBarInfo[],
        colorComponents: [] as ColorComponentInfo[],
        allInputs: [] as InputInfo[],
        structure: null as StructureInfo | null
      };
      
      // Check for range inputs
      const ranges = document.querySelectorAll('input[type="range"]');
      ranges.forEach((input, i) => {
        const inputEl = input as HTMLInputElement;
        info.rangeInputs.push({
          index: i,
          id: inputEl.id,
          className: inputEl.className,
          value: inputEl.value,
          min: inputEl.min,
          max: inputEl.max,
          visible: (input as HTMLElement).offsetParent !== null,
          parentId: inputEl.parentElement?.id,
          parentClass: inputEl.parentElement?.className
        });
      });
      
      // Check for all input elements
      const allInputs = document.querySelectorAll('input');
      allInputs.forEach((input, i) => {
        const inputEl = input as HTMLInputElement;
        info.allInputs.push({
          index: i,
          type: inputEl.type,
          id: inputEl.id,
          className: inputEl.className,
          value: inputEl.value,
          visible: (input as HTMLElement).offsetParent !== null
        });
      });
      
      // Check for buttons
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button, i) => {
        info.buttons.push({
          index: i,
          id: button.id,
          className: button.className,
          textContent: button.textContent?.trim(),
          visible: button.offsetParent !== null
        });
      });
      
      // Check for wb-color-bars elements
      const colorBars = document.querySelectorAll('wb-color-bars');
      colorBars.forEach((el, i) => {
        info.colorBars.push({
          index: i,
          id: el.id,
          className: el.className,
          visible: (el as HTMLElement).offsetParent !== null,
          shadowRoot: !!el.shadowRoot,
          innerHTML: el.innerHTML.substring(0, 200)
        });
      });
      
      // Check for wb-color-bar elements
      const colorComponents = document.querySelectorAll('wb-color-bar');
      colorComponents.forEach((el, i) => {
        info.colorComponents.push({
          index: i,
          id: el.id,
          className: el.className,
          visible: (el as HTMLElement).offsetParent !== null,
          shadowRoot: !!el.shadowRoot
        });
      });
      
      // Get overall control panel structure
      const controlPanel = document.querySelector('#main-control-panel');
      if (controlPanel) {
        info.structure = {
          id: controlPanel.id,
          className: controlPanel.className,
          childElementCount: controlPanel.childElementCount,
          innerHTML: controlPanel.innerHTML.substring(0, 500) + '...'
        };
      }
      
      return info;
    });
    
    console.log('=== CONTROL PANEL ELEMENT ANALYSIS ===');
    console.log(`Found ${elementInfo.rangeInputs.length} range inputs`);
    console.log(`Found ${elementInfo.allInputs.length} total inputs`);
    console.log(`Found ${elementInfo.buttons.length} buttons`);
    console.log(`Found ${elementInfo.colorBars.length} wb-color-bars elements`);
    console.log(`Found ${elementInfo.colorComponents.length} wb-color-bar elements`);
    
    console.log('\\n=== RANGE INPUTS DETAILS ===');
    elementInfo.rangeInputs.forEach(input => {
      console.log(`Range ${input.index}:`, {
        id: input.id,
        class: input.className,
        value: input.value,
        range: `${input.min}-${input.max}`,
        visible: input.visible,
        parentId: input.parentId,
        parentClass: input.parentClass
      });
    });
    
    console.log('\\n=== ALL INPUTS DETAILS ===');
    elementInfo.allInputs.forEach(input => {
      console.log(`Input ${input.index}:`, {
        type: input.type,
        id: input.id,
        class: input.className,
        value: input.value,
        visible: input.visible
      });
    });
    
    console.log('\\n=== WB-COLOR-BARS DETAILS ===');
    elementInfo.colorBars.forEach(colorBar => {
      console.log(`ColorBars ${colorBar.index}:`, {
        id: colorBar.id,
        class: colorBar.className,
        visible: colorBar.visible,
        shadowRoot: colorBar.shadowRoot,
        innerHTML: colorBar.innerHTML.substring(0, 100)
      });
    });
    
    console.log('\\n=== CONTROL PANEL STRUCTURE ===');
    console.log('Control Panel:', elementInfo.structure);
    
    // Check if any range inputs are visible - this is what the failing test was looking for
    const visibleRangeInputs = elementInfo.rangeInputs.filter(input => input.visible);
    console.log(`\\nVisible range inputs: ${visibleRangeInputs.length}/${elementInfo.rangeInputs.length}`);
    
    if (visibleRangeInputs.length === 0) {
      console.log('❌ NO VISIBLE RANGE INPUTS FOUND in main DOM - This explains the test timeout');
      
      // Let's check inside shadow DOM
      const shadowDOMInputs = await page.evaluate(() => {
        interface ShadowInputInfo {
          colorBarIndex: number;
          inputIndex: number;
          id: string;
          className: string;
          value: string;
          min: string;
          max: string;
          visible: boolean;
        }
        
        const shadowInputs: ShadowInputInfo[] = [];
        const colorBars = document.querySelectorAll('wb-color-bars');
        
        colorBars.forEach((colorBar, i) => {
          if (colorBar.shadowRoot) {
            const shadowRanges = colorBar.shadowRoot.querySelectorAll('input[type="range"]');
            shadowRanges.forEach((input, j) => {
              const inputEl = input as HTMLInputElement;
              shadowInputs.push({
                colorBarIndex: i,
                inputIndex: j,
                id: inputEl.id,
                className: inputEl.className,
                value: inputEl.value,
                min: inputEl.min,
                max: inputEl.max,
                visible: (input as HTMLElement).offsetParent !== null
              });
            });
          }
        });
        
        return shadowInputs;
      });
      
      console.log('\\n=== SHADOW DOM RANGE INPUTS ===');
      console.log(`Found ${shadowDOMInputs.length} range inputs in shadow DOM`);
      shadowDOMInputs.forEach(input => {
        console.log(`Shadow Range [${input.colorBarIndex}:${input.inputIndex}]:`, {
          id: input.id,
          class: input.className,
          value: input.value,
          range: `${input.min}-${input.max}`,
          visible: input.visible
        });
      });
      
      if (shadowDOMInputs.length > 0) {
        console.log('✅ Found range inputs in shadow DOM - this is where the hue sliders are!');
      } else {
        console.log('❌ No range inputs found in shadow DOM either');
      }
    } else {
      console.log('✅ Found visible range inputs in main DOM');
    }
  });
});