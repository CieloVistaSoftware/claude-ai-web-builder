const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// This test assumes the server is running on localhost:3030
const BASE_URL = 'http://localhost:3030';

test.describe('Script Runner Server', () => {
  test('should serve runscripts.html at root', async ({ page }) => {
    const res = await page.goto(BASE_URL + '/');
    // Check for expected content in the page
    await expect(page.locator('h1')).toHaveText(/Run PowerShell/i);
    await expect(page.locator('body')).toContainText('What do these scripts do?');
  });

  test('should serve runscripts.html at /scripts/runscripts.html', async ({ page }) => {
    const res = await page.goto(BASE_URL + '/scripts/runscripts.html');
    await expect(page.locator('h1')).toHaveText(/Run PowerShell/i);
    await expect(page.locator('body')).toContainText('What do these scripts do?');
  });
});
