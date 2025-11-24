// wb-linkedinAd-playwright.spec.js
const { test, expect } = require('@playwright/test');

test.describe('wb-linkedinAd', () => {
  test('should render with correct headline and CTA', async ({ page }) => {
    await page.goto('file://' + __dirname + '/wb-linkedinAd-demo.html');
    const ad = await page.locator('wb-linkedinAd').first();
    await expect(ad).toBeVisible();
    const headline = await ad.shadowLocator('.headline').textContent();
    expect(headline).toContain('Boost your B2B reach!');
    const cta = await ad.shadowLocator('.cta').textContent();
    expect(cta).toBe('Get Started');
  });

  test('should apply dark mode styles', async ({ page }) => {
    await page.goto('file://' + __dirname + '/wb-linkedinAd-demo.html');
    const ad = await page.locator('wb-linkedinAd').first();
    const bgColor = await ad.evaluate((el) => getComputedStyle(el.shadowRoot.querySelector('.linkedin-ad')).backgroundColor);
    expect(bgColor).not.toBe('rgb(243, 246, 248)'); // Should not be light mode
  });
});
