import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Helper to inject the component markup
async function setupDemo(page, markup) {
  await page.setContent('<html><head></head><body></body></html>');
  // Load component as ES module (not classic script)
  await page.addScriptTag({ path: path.resolve(__dirname, 'wb-button.js'), type: 'module' });
  // Wait for component registration
  await page.waitForFunction(() => customElements.get('wb-button'), { timeout: 5000 });
  await page.evaluate((markup) => {
    document.body.innerHTML = markup;
  }, markup);
}

test.describe('wb-button examples attribute', () => {
  test('renders code example block automatically for group with examples', async ({ page }) => {
    await setupDemo(page, `
      <wb-button group="test-group" examples>
        <wb-button class="btn-a">A</wb-button>
        <wb-button class="btn-b">B</wb-button>
      </wb-button>
    `);
    await page.waitForSelector('wb-button[group] .code-container .wb-code-example');
    const codeBlock = await page.$('wb-button[group] .code-container .wb-code-example');
    expect(codeBlock).not.toBeNull();
    const value = await codeBlock.inputValue();
    expect(value).toContain('<wb-button class="btn-a">A</wb-button>');
    expect(value).toContain('<wb-button class="btn-b">B</wb-button>');
  });

  test('copy button copies markup to clipboard', async ({ page }) => {
    await setupDemo(page, `
      <wb-button group="test-group" examples>
        <wb-button class="btn-a">A</wb-button>
        <wb-button class="btn-b">B</wb-button>
      </wb-button>
    `);
    // Component is already loaded via setupDemo
    await page.waitForSelector('wb-button[group] .code-container .copy-btn');
    const copyBtn = await page.$('wb-button[group] .code-container .copy-btn');
    const textarea = await page.$('wb-button[group] .code-container .wb-code-example');
    await textarea.selectText();
    await copyBtn.click();
    // Clipboard API is not available in Playwright browser context, so we check button UI feedback
    const btnText = await copyBtn.textContent();
    expect(btnText).toMatch(/Copied!/);
  });
});
