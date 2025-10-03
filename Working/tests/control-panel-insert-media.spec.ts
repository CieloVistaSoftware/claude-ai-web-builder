// @ts-nocheck
import { test, expect } from '@playwright/test';

/**
 * Minimizes the Claude AI panel to prevent interference with tests
 */
async function minimizeClaudePanel(page): any {
  try {
    // Check if Claude AI panel exists and is visible
    const claudePanel = page.locator('#claude-ai-panel');
    if (await claudePanel.isVisible()) {
      // Check if panel is already minimized by looking at content visibility
      const content = page.locator('#claude-ai-panel .claude-panel-content');
      const isContentVisible = await content.isVisible();

      if (isContentVisible) {
        // Panel is expanded, so minimize it
        const toggleBtn = page.locator('#claude-toggle-btn');
        if (await toggleBtn.isVisible()) {
          await toggleBtn.click();
          console.log('✅ Claude AI panel minimized to prevent test interference');
        }
      } else {
        console.log('ℹ️ Claude AI panel already minimized');
      }
    }
  } catch (error) {
    console.log('⚠️ Could not minimize Claude AI panel:', error.message);
  }
}

test.describe('Control Panel and Insert Media Tests', (): any => {

  test.beforeEach(async ({ page }): any => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Wait for the control panel content to load
    await page.waitForSelector('#main-control-panel', { state: 'visible', timeout: 10000 });

    // Minimize Claude AI panel to prevent interference
    await minimizeClaudePanel(page);

    // Give time for the control panel content to be injected
    await page.waitForTimeout(2000);
  });

  test('Control panel should be visible and properly loaded', async ({ page }): any => {
    // Check if control panel is visible
    const controlPanel = page.locator('#main-control-panel');
    await expect(controlPanel).toBeVisible();

    // Check if control panel has content (not empty)
    const controlPanelText = await controlPanel.textContent();
    expect(controlPanelText).toBeTruthy();
    expect(controlPanelText.length).toBeGreaterThan(10);

    // Check for key control panel elements
    await expect(page.locator('#edit-mode-toggle')).toBeVisible();
    await expect(page.locator('#theme-select')).toBeVisible();
    await expect(page.locator('#layout-select')).toBeVisible();
    await expect(page.locator('#dark-mode-toggle')).toBeVisible();

    // Take screenshot for debugging
    await page.screenshot({ path: 'tests/control-panel-visibility.png' });
  });
  test('Contextual insert media buttons appear when edit mode is enabled', async ({ page }): any => {
    // Initially, no contextual insert media buttons should be visible
    const contextualButtons = page.locator('.contextual-insert-media-btn');
    await expect(contextualButtons).toHaveCount(0);

    // Enable edit mode
    const editModeToggle = page.locator('#edit-mode-toggle');
    await editModeToggle.click();

    // Wait for edit mode to activate
    await page.waitForTimeout(1000);

    // Contextual insert media buttons should now be visible (one for each editable element)
    // Count the actual number of editable elements first
    const editableElements = page.locator('.editable');
    const editableCount = await editableElements.count();
    console.log(`Found ${editableCount} editable elements`);

    // Expect same number of contextual buttons as editable elements
    await expect(contextualButtons).toHaveCount(editableCount);

    // Check if edit mode is properly activated
    await expect(page.locator('body')).toHaveClass(/edit-mode/);

    // Take screenshot
    await page.screenshot({ path: 'tests/edit-mode-enabled.png' });
  });
  test('Contextual insert media button click should show file picker dialog', async ({ page }): any => {
    // Enable edit mode first
    await page.locator('#edit-mode-toggle').click();
    await page.waitForTimeout(2000);

    // Find first contextual insert media button
    const contextualButton = page.locator('.contextual-insert-media-btn').first();
    await expect(contextualButton).toBeVisible();

    // Set up file chooser event listener
    const fileChooserPromise = page.waitForEvent('filechooser');

    // Click the contextual button
    await contextualButton.click();

    // Verify file chooser opens
    const fileChooser = await fileChooserPromise;
    expect(fileChooser).toBeTruthy();

    // Verify file chooser accepts the correct file types
    expect(fileChooser.isMultiple()).toBe(false);
  });
  test('No main insert media button should exist in control panel', async ({ page }): any => {
    // Enable edit mode
    await page.locator('#edit-mode-toggle').click();
    await page.waitForTimeout(1000);

    // Verify there is NO main insert media button in the control panel
    const mainInsertMediaBtn = page.locator('#insert-media-btn');
    await expect(mainInsertMediaBtn).toHaveCount(0);

    // But contextual buttons should exist
    const contextualButtons = page.locator('.contextual-insert-media-btn');
    await expect(contextualButtons.first()).toBeVisible();
  });

  test('Contextual insert media buttons appear on editable elements in edit mode', async ({ page }): any => {
    // Enable edit mode
    await page.locator('#edit-mode-toggle').click();
    await page.waitForTimeout(1000);

    // Check for contextual insert media buttons
    const contextualButtons = page.locator('.contextual-insert-media-btn');

    // Wait for contextual buttons to appear
    await page.waitForTimeout(2000);

    // Should have at least one contextual button (for each editable element)
    const buttonCount = await contextualButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Verify button text
    const firstButton = contextualButtons.first();
    await expect(firstButton).toContainText('Insert Media');

    // Take screenshot
    await page.screenshot({ path: 'tests/contextual-buttons.png' });
  });

  test('Contextual insert media button click opens file picker', async ({ page }): any => {
    // Enable edit mode
    await page.locator('#edit-mode-toggle').click();
    await page.waitForTimeout(2000);

    // Find first contextual insert media button
    const contextualButton = page.locator('.contextual-insert-media-btn').first();
    await expect(contextualButton).toBeVisible();

    // Set up file chooser event listener
    const fileChooserPromise = page.waitForEvent('filechooser');

    // Click the contextual button
    await contextualButton.click();

    // Verify file chooser opens
    const fileChooser = await fileChooserPromise;
    expect(fileChooser).toBeTruthy();
  });
  test('Contextual insert media buttons disappear when edit mode is disabled', async ({ page }): any => {
    // Enable edit mode
    await page.locator('#edit-mode-toggle').click();
    await page.waitForTimeout(1000);

    // Wait for contextual buttons to appear
    await page.waitForTimeout(2000);
    const contextualButtons = page.locator('.contextual-insert-media-btn');
    const buttonCount = await contextualButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Disable edit mode
    await page.locator('#edit-mode-toggle').click();
    await page.waitForTimeout(1000);

    // All contextual buttons should be removed
    await expect(contextualButtons).toHaveCount(0);

    // Body should not have edit-mode class
    await expect(page.locator('body')).not.toHaveClass(/edit-mode/);
  });

  test('Control panel handlers are properly initialized', async ({ page }): any => {
    // Check console for initialization messages
    const logs: any[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        logs.push(msg.text());
      }
    });

    // Reload page to capture initialization logs
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check for expected log messages
    const hasControlPanelLog = logs.some(log =>
      log.includes('Control panel content loaded') ||
      log.includes('Legacy initControlPanelHandlers called') ||
      log.includes('Initializing control panel handlers')
    );

    expect(hasControlPanelLog).toBe(true);

    // Log all messages for debugging
    console.log('Console logs:', logs);
  });

  test('Control panel content is properly injected', async ({ page }): any => {
    // Check if the control panel template content is loaded
    const template = page.locator('#control-panel-content-template');

    // The template should exist
    await expect(template).toBeAttached();

    // Control panel should have the expected structure (5 control groups)
    await expect(page.locator('#main-control-panel .control-group')).toHaveCount(5);

    // Check specific controls exist
    await expect(page.locator('#edit-mode-toggle')).toBeVisible();
    await expect(page.locator('#layout-select')).toBeVisible();
    await expect(page.locator('#theme-select')).toBeVisible();
    await expect(page.locator('#dark-mode-toggle')).toBeVisible();
    await expect(page.locator('#hue-slider')).toBeVisible();
    await expect(page.locator('#reset-btn')).toBeVisible();
    await expect(page.locator('#save-btn')).toBeVisible();
    await expect(page.locator('#import-btn')).toBeVisible();

    // Verify NO main insert media button exists
    await expect(page.locator('#insert-media-btn')).toHaveCount(0);
  });

  test('Debug control panel loading process', async ({ page }): any => {
    // Enable console logging
    const logs: any[] = [];
    const errors: any[] = [];

    page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Reload page and wait for everything to load
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'tests/debug-control-panel.png', fullPage: true });

    // Check DOM structure
    const controlPanelExists = await page.locator('#main-control-panel').count();
    const templateExists = await page.locator('#control-panel-content-template').count();
    const controlGroups = await page.locator('.control-group').count();

    console.log('Control Panel Debug Info:');
    console.log('- Control panel exists:', controlPanelExists > 0);
    console.log('- Template exists:', templateExists > 0);
    console.log('- Control groups found:', controlGroups);
    console.log('- Errors:', errors);
    console.log('- Console logs:', logs.slice(-10)); // Last 10 logs

    // Ensure no JavaScript errors
    expect(errors.length).toBe(0);

    // Ensure control panel is present
    expect(controlPanelExists).toBeGreaterThan(0);
  });

});
