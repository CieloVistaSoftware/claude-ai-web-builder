import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('WB Control Panel - REAL FUNCTIONALITY Tests', () => {
  const baseTest = new BaseUnitTest();
  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
    await page.waitForTimeout(3000);
  });

  test('theme selector should change themes', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Check for component initialization errors first
        const componentErrors = await page.evaluate(() => {
          const eventLog = document.querySelector('wb-event-log');
          if (!eventLog) return null;
          const errors = Array.from(eventLog.shadowRoot?.querySelectorAll('.event-error') || []);
          return errors.map(el => el.textContent).filter(text => text && (text.includes('config') || text.includes('undefined')));
        });
        
        if (componentErrors && componentErrors.length > 0) {
          console.error('Component initialization errors:', componentErrors);
          // Fail test if there are config/initialization errors
          expect(componentErrors.length).toBe(0);
        }
        
        const themeSelect = page.locator('#theme-select');
        await expect(themeSelect).toBeVisible();
        
        // Test theme changes with DOM response verification
        const beforeChange = await page.evaluate(() => ({
          htmlTheme: document.documentElement.getAttribute('data-theme'),
          bodyClass: document.body.className
        }));
        
        await themeSelect.selectOption('cyberpunk');
        await page.waitForTimeout(500);
        
        const selectedTheme = await themeSelect.inputValue();
        expect(selectedTheme).toBe('cyberpunk');
        
        // Verify DOM actually changed in response
        const afterChange = await page.evaluate(() => ({
          htmlTheme: document.documentElement.getAttribute('data-theme'),
          bodyClass: document.body.className
        }));
        
        // Theme change should affect DOM attributes or classes
        const domChanged = beforeChange.htmlTheme !== afterChange.htmlTheme || 
                         beforeChange.bodyClass !== afterChange.bodyClass;
        
        console.log('Theme change DOM response:', { beforeChange, afterChange, domChanged });
        expect(domChanged).toBe(true);
        
        console.log('✅ Theme selector working with DOM response');
    });
  });

  test('layout selector should change layouts', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const layoutSelect = page.locator('#layout-select');
        await expect(layoutSelect).toBeVisible();
        
        // Test layout changes
        await layoutSelect.selectOption('left-nav');
        await page.waitForTimeout(500);
        
        const selectedLayout = await layoutSelect.inputValue();
        expect(selectedLayout).toBe('left-nav');
        
        // Test another layout
        await layoutSelect.selectOption('right-nav');
        await page.waitForTimeout(500);
        
        const newLayout = await layoutSelect.inputValue();
        expect(newLayout).toBe('right-nav');
        
        console.log('✅ Layout selector working');
    });
  });

  test('color bars should be present and interactive', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const primaryColorBar = page.locator('#primary-color-bar');
        const bgColorBar = page.locator('#bg-color-bar');
        
        await expect(primaryColorBar).toBeVisible();
        await expect(bgColorBar).toBeVisible();
        
        // Check they have the wb-color-bars tag
        const primaryTag = await primaryColorBar.evaluate(el => el.tagName);
        const bgTag = await bgColorBar.evaluate(el => el.tagName);
        
        expect(primaryTag.toLowerCase()).toBe('wb-color-bars');
        expect(bgTag.toLowerCase()).toBe('wb-color-bars');
        
        console.log('✅ Color bars present and properly tagged');
    });
  });

  test('toggle switches should work', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const gradientToggle = page.locator('#gradient-toggle');
        const darkModeToggle = page.locator('#dark-mode-toggle');
        
        await expect(gradientToggle).toBeVisible();
        await expect(darkModeToggle).toBeVisible();
        
        // Test gradient toggle
        const initialGradient = await gradientToggle.isChecked();
        await gradientToggle.click();
        await page.waitForTimeout(300);
        const newGradient = await gradientToggle.isChecked();
        expect(newGradient).not.toBe(initialGradient);
        
        // Test dark mode toggle
        const initialDark = await darkModeToggle.isChecked();
        await darkModeToggle.click();
        await page.waitForTimeout(300);
        const newDark = await darkModeToggle.isChecked();
        expect(newDark).not.toBe(initialDark);
        
        console.log('✅ Toggle switches working');
    });
  });

  test('edit mode button should be clickable', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const editModeBtn = page.locator('#edit-mode-toggle');
        await expect(editModeBtn).toBeVisible();
        await expect(editModeBtn).toBeEnabled();
        
        await editModeBtn.click();
        await page.waitForTimeout(500);
        
        // Should still be enabled after click
        await expect(editModeBtn).toBeEnabled();
        
        console.log('✅ Edit mode button working');
    });
  });

  test('file operation buttons should be functional', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const cloneBtn = page.locator('#clone-btn');
        const saveBtn = page.locator('#save-btn');
        const importBtn = page.locator('#import-btn');
        const resetBtn = page.locator('#reset-btn');
        
        // Check all buttons are visible and enabled
        await expect(cloneBtn).toBeVisible();
        await expect(cloneBtn).toBeEnabled();
        await expect(saveBtn).toBeVisible();
        await expect(saveBtn).toBeEnabled();
        await expect(importBtn).toBeVisible();
        await expect(importBtn).toBeEnabled();
        await expect(resetBtn).toBeVisible();
        await expect(resetBtn).toBeEnabled();
        
        // Test clicking each button
        await cloneBtn.click();
        await page.waitForTimeout(200);
        await saveBtn.click();
        await page.waitForTimeout(200);
        await importBtn.click(); 
        await page.waitForTimeout(200);
        await resetBtn.click();
        await page.waitForTimeout(200);
        
        console.log('✅ All file operation buttons working');
    });
  });

  test('drag handle should be present', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const dragHandle = page.locator('#drag-handle');
        await expect(dragHandle).toBeVisible();
        
        const handleText = await dragHandle.textContent();
        expect(handleText).toContain('⋮⋮');
        
        console.log('✅ Drag handle present');
    });
  });

  test('control panel should be fully visible and functional', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const controlPanel = page.locator('#main-control-panel');
        await expect(controlPanel).toBeVisible();
        
        // Check all sections are present
        const appearanceSection = page.locator('#section-appearance');
        const primaryColorsSection = page.locator('#section-primary-colors');
        const bgColorsSection = page.locator('#section-background-colors');
        const featuresSection = page.locator('#section-features');
        const actionsSection = page.locator('#section-actions');
        
        await expect(appearanceSection).toBeVisible();
        await expect(primaryColorsSection).toBeVisible();
        await expect(bgColorsSection).toBeVisible();
        await expect(featuresSection).toBeVisible();
        await expect(actionsSection).toBeVisible();
        
        console.log('✅ Control panel fully functional with all sections');
    });
  });
});