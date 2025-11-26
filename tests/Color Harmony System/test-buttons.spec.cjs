// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation Buttons Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/html/Color%20Harmony%20System/article/Professional-Developer-HCS-System.html');
    await page.waitForLoadState('networkidle');
  });

  test('all nav buttons should have identical styling', async ({ page }) => {
    // Get all nav buttons
    const buttons = await page.locator('.sidebar button.nav-btn').all();
    
    console.log(`Found ${buttons.length} nav buttons`);
    
    if (buttons.length === 0) {
      throw new Error('No nav buttons found!');
    }

    // Get the computed styles of the first button as reference
    const firstButton = buttons[0];
    const referenceStyles = await firstButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        padding: computed.padding,
        border: computed.border,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        textAlign: computed.textAlign,
        width: computed.width,
        display: computed.display
      };
    });

    console.log('Reference button styles:', referenceStyles);

    // Check each button matches the reference
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const buttonText = await button.textContent();
      
      const styles = await button.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          padding: computed.padding,
          border: computed.border,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          textAlign: computed.textAlign,
          width: computed.width,
          display: computed.display
        };
      });

      console.log(`Button ${i} ("${buttonText}"):`, styles);

      // Compare each style property
      expect(styles.backgroundColor, `Button ${i} ("${buttonText}") backgroundColor mismatch`).toBe(referenceStyles.backgroundColor);
      expect(styles.color, `Button ${i} ("${buttonText}") color mismatch`).toBe(referenceStyles.color);
      expect(styles.padding, `Button ${i} ("${buttonText}") padding mismatch`).toBe(referenceStyles.padding);
      expect(styles.border, `Button ${i} ("${buttonText}") border mismatch`).toBe(referenceStyles.border);
      expect(styles.fontSize, `Button ${i} ("${buttonText}") fontSize mismatch`).toBe(referenceStyles.fontSize);
      expect(styles.fontWeight, `Button ${i} ("${buttonText}") fontWeight mismatch`).toBe(referenceStyles.fontWeight);
      expect(styles.textAlign, `Button ${i} ("${buttonText}") textAlign mismatch`).toBe(referenceStyles.textAlign);
      expect(styles.width, `Button ${i} ("${buttonText}") width mismatch`).toBe(referenceStyles.width);
      expect(styles.display, `Button ${i} ("${buttonText}") display mismatch`).toBe(referenceStyles.display);
    }

    console.log('✅ All buttons have identical styling!');
  });

  test('buttons should not have white or black backgrounds', async ({ page }) => {
    const buttons = await page.locator('.sidebar button.nav-btn').all();
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const buttonText = await button.textContent();
      
      const bgColor = await button.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      console.log(`Button ${i} ("${buttonText}"): ${bgColor}`);

      // Check it's not white (rgb(255, 255, 255))
      expect(bgColor, `Button ${i} ("${buttonText}") should not be white`).not.toBe('rgb(255, 255, 255)');
      
      // Check it's not pure black (rgb(0, 0, 0))
      expect(bgColor, `Button ${i} ("${buttonText}") should not be pure black`).not.toBe('rgb(0, 0, 0)');
    }
  });
});
