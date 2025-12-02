// wb-show-htmlfiles.spec.ts
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:8081/wb-show-htmlfiles/index.html';

test.describe('HTML Files Navigator', () => {
  test('all navigator links open valid HTML files', async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for component to load
    await page.waitForSelector('wb-show-htmlfiles');
    // Get shadow root
    const shadow = await page.evaluateHandle(() => document.querySelector('wb-show-htmlfiles').shadowRoot);
    // Get all list items
    const items = await shadow.evaluate(shadowRoot => Array.from(shadowRoot.querySelectorAll('li')).map(li => li.textContent));
    for (let i = 0; i < items.length; i++) {
      // Click each item
      await shadow.evaluate((shadowRoot, idx) => {
        shadowRoot.querySelectorAll('li')[idx].click();
      }, i);
      // Wait for iframe src to update
      const src = await page.locator('#preview').getAttribute('src');
      expect(src).toBeTruthy();
      // Wait for iframe to load
      const frame = page.frameLocator('#preview');
      await expect(frame.locator('html')).toBeVisible({ timeout: 5000 });
      // Optionally check for error text in iframe
      const bodyText = await frame.locator('body').textContent();
      expect(bodyText).not.toMatch(/404|Not Found|Error/i);
    }
  });
});
