(async () => {
  const { chromium } = require('playwright');
  const url = 'http://localhost:8080/html/Color%20Harmony%20System/article/Professional-Developer-HCS-System.html';
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  console.log('Page loaded, checking nav buttons...');
  const buttons = await page.$$('.sidebar button.nav-btn');
  console.log('Found', buttons.length, 'nav buttons');
  if (buttons.length === 0) {
    console.error('No nav buttons found');
    await browser.close();
    process.exit(2);
  }

  const firstStyles = await page.evaluate((el) => {
    const c = window.getComputedStyle(el);
    return {
      background: c.backgroundColor,
      color: c.color,
      padding: c.padding,
      border: c.border,
      fontSize: c.fontSize,
      fontWeight: c.fontWeight
    };
  }, buttons[0]);

  for (let i = 0; i < buttons.length; i++) {
    const styles = await page.evaluate((el) => {
      const c = window.getComputedStyle(el);
      return {
        background: c.backgroundColor,
        color: c.color,
        padding: c.padding,
        border: c.border,
        fontSize: c.fontSize,
        fontWeight: c.fontWeight
      };
    }, buttons[i]);
    // Simple comparison
    for (const k of Object.keys(firstStyles)) {
      if (firstStyles[k] !== styles[k]) {
        console.error(`Mismatch on ${k} for button ${i}: ${firstStyles[k]} != ${styles[k]}`);
        await browser.close();
        process.exit(3);
      }
    }
  }

  console.log('Smoke checks passed: nav buttons consistent');
  await browser.close();
  process.exit(0);
})();
