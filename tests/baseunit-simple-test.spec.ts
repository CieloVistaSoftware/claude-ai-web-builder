import { test, expect } from '@playwright/test';
import { BaseUnitTest } from './helpers/BaseUnitTestSimple.js';

test.describe('BaseUnitTest Simple Test', () => {
  const baseTest = new BaseUnitTest();

  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('about:blank');
  });

  test('simple test with BaseUnitTest should work', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('Running test with BaseUnitTest...');
      expect(true).toBe(true);
      console.log('Test completed successfully');
    });
  });

  test('test with intentional error should be caught', async ({ page }) => {
    await page.goto('data:text/html,<script>console.error("Test error for validation")</script>');
    await page.waitForTimeout(100); // Let error get captured
    
    try {
      await baseTest.validateNoCriticalErrors();
      // Should not reach here
      expect(false).toBe(true);
    } catch (error: any) {
      // Should catch the error
      expect(error.message).toContain('Critical errors detected');
      console.log('✅ BaseUnitTest correctly caught the error');
    }
  });
});