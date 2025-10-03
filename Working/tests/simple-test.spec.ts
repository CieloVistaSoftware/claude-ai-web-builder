// @ts-nocheck
import { test, expect } from '@playwright/test';

test('simple test', async ({ page }): any => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/.*/);
});
