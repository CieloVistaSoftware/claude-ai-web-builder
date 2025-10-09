import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('WB Color Bar - TEXT VALIDATION', () => {
  const baseTest = new BaseUnitTest();
  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('/tests/wb-color-bar/test-wb-color-bar-simple.html');
    await page.waitForTimeout(3000);
  });

  test('should show correct page text', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const title = await page.textContent('h1');
        expect(title).toBe('wb-color-bar Simple Test');
        console.log('✅ Correct page title found');
    });
  });

  test('should show component output text', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      await page.waitForFunction(() => {
          const output = document.querySelector('#console-output');
          return output && output.textContent.includes('wb-color-bar is now defined!');
        }, { timeout: 10000 });
        
        const outputText = await page.textContent('#console-output'); 
        expect(outputText).toContain('wb-color-bar is now defined!');
        expect(outputText).toContain('Found 3 wb-color-bar elements');
        console.log('✅ Component registration text found');
    });
  });
});
