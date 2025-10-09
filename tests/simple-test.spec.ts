// @ts-nocheck
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from './helpers/BaseUnitTestSimple.js';

test('simple test', async ({ page }): any => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/.*/);
});
