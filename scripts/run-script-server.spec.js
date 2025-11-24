const { test, expect } = require('@playwright/test');
const BASE_URL = 'http://localhost:3030';

test.describe('run-script-server.cjs', () => {
  test('should serve runscripts.html at root', async ({ page }) => {
    await page.goto(BASE_URL + '/');
    await expect(page.locator('h1')).toHaveText(/Run PowerShell/i);
    await expect(page.locator('body')).toContainText('What do these scripts do?');
  });

  test('should serve runscripts.html at /scripts/runscripts.html', async ({ page }) => {
    await page.goto(BASE_URL + '/scripts/runscripts.html');
    await expect(page.locator('h1')).toHaveText(/Run PowerShell/i);
    await expect(page.locator('body')).toContainText('What do these scripts do?');
  });
});
