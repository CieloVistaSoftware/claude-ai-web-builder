import { test, expect } from '@playwright/test';

test.describe('Debug Hang Test', () => {
  test('simple test without BaseUnitTest', async ({ page }) => {
    console.log('Starting simple test...');
    await page.goto('about:blank');
    console.log('Page loaded');
    expect(true).toBe(true);
    console.log('Test completed successfully');
  });
});