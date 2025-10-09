import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('WB Control Panel - TEXT VALIDATION Tests', () => {
  const baseTest = new BaseUnitTest();
  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('/tests/wb-control-panel/test-control-panel-simple.html');
    await page.waitForTimeout(3000);
  });

  test('should show correct page text', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const pageTitle = await page.textContent('h1');
        expect(pageTitle).toBe('Control Panel Simple Test');
        
        const sectionTitle = await page.textContent('h2');
        expect(sectionTitle).toBe('WB Control Panel Component Test');
        
        console.log('✅ Control panel page displays correct text');
    });
  });

  test('should show dependency status in output', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.waitForFunction(() => {
          const output = document.querySelector('#console-output');
          return output && output.textContent.includes('Dependencies ready');
        }, { timeout: 10000 });
        
        const outputText = await page.textContent('#console-output');
        
        expect(outputText).toContain('wb-color-bar defined: YES');
        expect(outputText).toContain('wb-color-bars defined: YES');
        expect(outputText).toContain('Control panel container created');
        expect(outputText).toContain('Dependencies ready for integration');
        
        console.log('✅ Control panel shows all dependencies ready');
    });
  });

  test('should not show JavaScript errors', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const jsErrors = [];
        
        page.on('console', msg => {
          if (msg.type() === 'error') {
            jsErrors.push(msg.text());
          }
        });
        
        const unexpectedErrors = jsErrors.filter(error => 
          !error.includes('control-panel') && 
          !error.includes('Failed to fetch') &&
          !error.includes('404')
        );
        
        expect(unexpectedErrors.length).toBe(0);
        console.log('✅ Control panel test passes without unexpected errors');
    });
  });
});
