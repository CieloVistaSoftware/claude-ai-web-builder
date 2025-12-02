import { test, expect } from '@playwright/test';

// Helper to capture errors
async function captureAndLogError(testName, error) {
  const errorText = `TEST: ${testName}\nERROR: ${error?.message || error}\nSTACK: ${error?.stack || 'N/A'}`;
  console.error(errorText);
  throw error;
}

test.describe('wb-linkedinAd', () => {

  test('wb-linkedinAd loads without errors', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          <script type="module">
            (async () => {
              try {
                await import('http://localhost:3000/wb-linkedinAd/wb-linkedinAd.js');
                window.loadSuccess = true;
              } catch (err) {
                window.scriptError = err.message;
                window.errorStack = err.stack;
              }
            })();
          </script>
        </body>
        </html>
      `);
      
      await page.waitForTimeout(1500);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const loadSuccess = await page.evaluate(() => window.loadSuccess);
      expect(loadSuccess).toBe(true);
    } catch (error) {
      await captureAndLogError('wb-linkedinAd loads without errors', error);
    }
  });

  test('wb-linkedinAd file is accessible', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/wb-linkedinAd/wb-linkedinAd.js');
      const status = page.url();
      expect(status).toContain('wb-linkedinAd.js');
    } catch (error) {
      await captureAndLogError('wb-linkedinAd file is accessible', error);
    }
  });

});
