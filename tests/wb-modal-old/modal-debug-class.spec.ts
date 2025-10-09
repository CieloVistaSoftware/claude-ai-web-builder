import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test('Debug Web Component class structure', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.goto('http://127.0.0.1:8080/components/wb-modal/wb-modal-demo.html', {
        waitUntil: 'networkidle'
    });
  });
  
  const debugInfo = await page.evaluate(() => {
    // Check the class definition
    const WBModalClass = customElements.get('wb-modal');
    
    // Create an instance manually
    const instance = new WBModalClass();
    
    // Check prototype methods
    const prototypeMethods = Object.getOwnPropertyNames(WBModalClass.prototype)
      .filter(name => typeof WBModalClass.prototype[name] === 'function');
    
    // Check instance methods
    const instanceMethods = [];
    for (let prop in instance) {
      if (typeof instance[prop] === 'function') {
        instanceMethods.push(prop);
      }
    }
    
    // Create via createElement
    const createdElement = document.createElement('wb-modal');
    const createdMethods = [];
    for (let prop in createdElement) {
      if (typeof createdElement[prop] === 'function') {
        createdMethods.push(prop);
      }
    }
    
    return {
      classExists: !!WBModalClass,
      prototypeMethods,
      instanceMethods,
      createdMethods,
      hasShowOnPrototype: typeof WBModalClass.prototype.show,
      hasShowOnInstance: typeof instance.show,
      hasShowOnCreated: typeof createdElement.show,
      instanceConstructor: instance.constructor.name,
      createdConstructor: createdElement.constructor.name
    };
  });
  
  console.log('🔍 Web Component class debug:', debugInfo);
});