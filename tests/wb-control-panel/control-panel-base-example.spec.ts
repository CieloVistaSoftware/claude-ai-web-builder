// @ts-nocheck
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

/**
 * Example: Control Panel Demo Tests using BaseUnitTest
 * This shows how ALL our tests should be structured
 */

// Create base test instance with mandatory error monitoring
const baseTest = new BaseUnitTest();

test.describe('Control Panel Demo Tests (BaseUnitTest Example)', () => {

  // MANDATORY: Setup standard beforeEach with error monitoring
  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
    await page.waitForTimeout(3000);
  });

  // Example test using BaseUnitTest framework
  test('demo page should load with proper title and content', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // Test logic - BaseUnitTest handles error monitoring automatically
      await expect(page).toHaveTitle('WB Control Panel - Complete Demo');
      await expect(page.locator('h1')).toContainText('WB Website Builder Control Panel');
      await expect(page.locator('.demo-instructions')).toBeVisible();
    });
  });

  test('control panel should be visible and functional', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      const controlPanel = page.locator('#main-control-panel');
      await expect(controlPanel).toBeVisible();
      await expect(controlPanel).toHaveAttribute('theme');
      await expect(controlPanel).toHaveAttribute('draggable', 'true');
      
      // Test theme selector functionality
      const themeSelect = page.locator('#theme-select');
      if (await themeSelect.count() > 0) {
        await themeSelect.selectOption('ocean');
        await page.waitForTimeout(500);
        
        const currentTheme = await page.evaluate(() => 
          document.documentElement.getAttribute('data-theme')
        );
        expect(currentTheme).toBe('ocean');
      }
    });
  });

  test('wb-event-log should be capturing errors properly', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      // BaseUnitTest automatically validates wb-event-log integration
      // This test just verifies it's working as expected
      
      const eventLogStatus = await page.evaluate(() => {
        const eventLog = document.querySelector('wb-event-log');
        return {
          exists: !!eventLog,
          hasEvents: eventLog?.shadowRoot?.querySelectorAll('.event-item')?.length > 0,
          hasErrors: eventLog?.shadowRoot?.querySelectorAll('.event-error')?.length > 0
        };
      });
      
      expect(eventLogStatus.exists).toBe(true);
      // Should have some events logged during initialization
      expect(eventLogStatus.hasEvents).toBe(true);
    });
  });

  // Traditional test can also use BaseUnitTest validation manually
  test('manual validation example', async ({ page }) => {
    // Your test logic here
    const buttons = await page.locator('button').count();
    expect(buttons).toBeGreaterThan(0);
    
    // MANDATORY: Validate no critical errors (all tests should do this)
    await baseTest.validateNoCriticalErrors();
    
    console.log('✅ Manual validation test passed');
  });

  // Export event log after each test
  test.afterEach(async ({ page }) => {
    try {
      await baseTest.exportEventLogToTestResults(page, 'control-panel-base-example');
    } catch (error) {
      console.error('Failed to export event log:', error);
    }
  });

});