// Automated test for WB demo width/centering
import { test, expect } from '@playwright/test';

const styleVariants = [
  { target: 'wb-demo', style: 'width:95%;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:95vw;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:95vw;max-width:95vw;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:95vw;max-width:1200px;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:95vw;max-width:1000px;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:95vw;max-width:90vw;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:95vw;position:relative;left:50%;transform:translateX(-50%);' },
  { target: 'wb-demo', style: 'width:95vw;max-width:95vw;position:relative;left:50%;transform:translateX(-50%);' },
  { target: 'wb-demo', style: 'width:96%;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:97%;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:94%;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:98%;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:100vw;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:90vw;margin:0 auto;display:block;' },
  { target: 'wb-demo', style: 'width:80vw;margin:0 auto;display:block;' }
];

test.describe('WB Demo Width/Centerring', () => {
  for (const variant of styleVariants) {
    test(`Style: ${variant.style}`, async ({ page }) => {
          await page.goto('http://localhost:8080/components/wb-shadow-diagnostics/wb-shadow-diagnostics.html');
      await page.evaluate((style) => {
        const el = document.querySelector('wb-demo');
        if (el) el.setAttribute('style', style);
      }, variant.style);
      await page.waitForTimeout(500);
      const demo = await page.$('wb-demo');
      const box = await demo.bonundingBox();
      const vw = await page.evaluate(() => window.innerWidth);
      const widthPercent = (box.width / vw) * 100;
      const leftMargin = box.x;
      const rightMargin = vw - box.x - box.width;
      expect(widthPercent).toBeGreaterThan(93);
      expect(widthPercent).toBeLessThan(97);
      expect(Math.abs(leftMargin - rightMargin)).toBeLessThan(5);
    });
  }
});
