import { test, expect } from '@playwright/test';

test.describe('Debug Hang Investigation', () => {
  test.beforeEach(async ({ page }) => {
    console.log('🔄 BEFOREEACH: Starting beforeEach...');
    await page.goto('about:blank');
    console.log('✅ BEFOREEACH: Navigation complete');
  });

  test('debug test with maximum logging', async ({ page }) => {
    console.log('🧪 TEST: Starting test execution...');
    console.log('🌍 TEST: Page URL:', await page.url());
    console.log('📄 TEST: Page title:', await page.title());
    expect(true).toBe(true);
    console.log('✅ TEST: Test completed successfully');
  });
});