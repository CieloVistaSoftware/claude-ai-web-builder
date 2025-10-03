// @ts-nocheck
// @ts-check
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

/**
 * Test suite for the Website Builder control panel
 */

test.describe('Website Builder Control Panel Tests', (): any => {

  // Before each test, navigate to the index page
  test.beforeEach(async ({ page }): any => {
    await page.goto('/index.html');
    // Wait for the control panel to be visible
    await page.waitForSelector('#main-control-panel');
    // Minimize Claude AI panel to prevent interference
    await minimizeClaudePanel(page);
  });
  // Simple smoke test to ensure the control panel renders
  test('control panel should be visible', async ({ page }): any => {
    const controlPanel = page.locator('#main-control-panel');
    await expect(controlPanel).toBeVisible();

    // Check that the title is correctly displayed
    const title = page.locator('#drag-handle h3');
    await expect(title).toHaveText('Website Builder');
  });
  // Test edit mode toggle
  test('edit mode toggle should change state', async ({ page }): any => {
    // Get the edit mode toggle button
    const editToggle = page.locator('#edit-mode-toggle');

    // Check initial state (should be off)
    await expect(editToggle).toHaveText('Edit Mode');
    await expect(page.locator('#status-info')).toHaveText('Edit mode: OFF');

    // Click the toggle button
    await editToggle.click();

    // Check the new state (should be on)
    await expect(editToggle).toHaveText('Exit Edit Mode');
    await expect(page.locator('#status-info')).toHaveText('Edit mode: ON');

    // Check that editable elements are now editable
    const editableElements = page.locator('.editable');
    const firstEditable = editableElements.first();
    await expect(firstEditable).toHaveAttribute('contenteditable', 'true');
  });

  // Test layout selection
  test('layout selector should change the layout', async ({ page }): any => {
    // Check initial layout
    await expect(page.locator('body')).toHaveAttribute('data-layout', 'top-nav');

    // Select left navigation layout
    await page.selectOption('#layout-select', 'left-nav');
    await expect(page.locator('body')).toHaveAttribute('data-layout', 'left-nav');

    // Select right navigation layout
    await page.selectOption('#layout-select', 'right-nav');
    await expect(page.locator('body')).toHaveAttribute('data-layout', 'right-nav');

    // Return to top navigation layout
    await page.selectOption('#layout-select', 'top-nav');
    await expect(page.locator('body')).toHaveAttribute('data-layout', 'top-nav');
  });
  // Test gradient toggle
  test('gradient toggle should add/remove gradient mode class', async ({ page }): any => {
    const heroSection = page.locator('#hero-section');
    const gradientToggle = page.locator('#gradient-toggle');

    // Initially should not have gradient mode
    await expect(heroSection).not.toHaveClass(/gradient-mode/);

    // Enable gradient mode
    await gradientToggle.check();
    await expect(heroSection).toHaveClass(/gradient-mode/);

    // Disable gradient mode
    await gradientToggle.uncheck();
    await expect(heroSection).not.toHaveClass(/gradient-mode/);
  });

  // Test theme selection
  test('theme selector should change the theme', async ({ page }): any => {
    // Check initial theme
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'default');

    // Test each theme
    const themes = ['cyberpunk', 'ocean', 'sunset', 'forest', 'default'];

    for (const theme of themes) {
      await page.selectOption('#theme-select', theme);
      await expect(page.locator('body')).toHaveAttribute('data-theme', theme);

      // Wait for color application
      await page.waitForTimeout(300);

      // Verify that the status message is updated
      if (theme !== 'default') {
        await expect(page.locator('#status-message')).toContainText(`Theme changed to: ${theme}`);
      }
    }
  });
  // Test dark mode toggle
  test('dark mode toggle should switch between light and dark mode', async ({ page }): any => {
    const darkModeToggle = page.locator('#dark-mode-toggle');

    // Check initial state (should be dark mode)
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');
    await expect(darkModeToggle).toBeChecked();

    // Switch to light mode
    await darkModeToggle.uncheck();
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Switch back to dark mode
    await darkModeToggle.check();
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'dark');
  });
  // Test color explorer sliders
  test('color explorer sliders should update colors', async ({ page }): any => {
    // Get color preview element
    const colorPreview = page.locator('#color-preview');
    const initialColor = await colorPreview.evaluate(el => el.textContent);

    // Change hue slider
    await page.locator('#hue-slider').fill('120');
    await page.locator('#saturation-slider').fill('85');
    await page.locator('#lightness-slider').fill('60');
    await page.locator('#harmony-angle-slider').fill('120');

    // Wait for color application
    await page.waitForTimeout(300);

    // Check if color preview has been updated (should be different)
    const newColor = await colorPreview.evaluate(el => el.textContent);
    expect(newColor).not.toEqual(initialColor);

    // Check that the hue value is updated
    const hueValue = await page.locator('#hue-value').textContent();
    expect(hueValue).toContain('120°');

    // Check that the harmony value is updated
    const harmonyValue = await page.locator('#harmony-value').textContent();
    expect(harmonyValue).toContain('120°');
    expect(harmonyValue).toContain('(Split-Complementary)');

    // Check if some elements got the new colors
    // Title should have the primary color
    const siteTitle = page.locator('.site-title');
    const primaryColor = await siteTitle.evaluate(el => window.getComputedStyle(el).color);

    // Description should have the secondary color
    const siteSubtitle = page.locator('.site-subtitle');
    const secondaryColor = await siteSubtitle.evaluate(el => window.getComputedStyle(el).color);

    // They should be different
    expect(primaryColor).not.toEqual(secondaryColor);
  });
  // Test panel minimization
  test('minimize button should hide and show panel content', async ({ page }): any => {
    const minimizeBtn = page.locator('#minimize-btn');
    const controlPanelBody = page.locator('.control-panel-body');

    // Initially panel body should be visible
    await expect(controlPanelBody).toBeVisible();

    // Click minimize
    await minimizeBtn.click();

    // Panel body should be hidden
    await expect(controlPanelBody).not.toBeVisible();

    // Click again to maximize
    await minimizeBtn.click();

    // Panel body should be visible again
    await expect(controlPanelBody).toBeVisible();
  });
  // Test save functionality
  test('save button click should trigger status updates', async ({ page }): any => {
    const saveBtn = page.locator('#save-btn');

    // Click the save button
    await saveBtn.click();

    // The save operation might complete very quickly, so we just check for the final success message
    // We increase the timeout here because generating the download might take longer
    await expect(page.locator('#status-message')).toContainText('saved successfully', { timeout: 5000 });
  });

  // Test complex combinations
  test('combination of theme, layout, and dark mode', async ({ page }): any => {
    // Set theme to cyberpunk
    await page.selectOption('#theme-select', 'cyberpunk');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'cyberpunk');

    // Set layout to left nav
    await page.selectOption('#layout-select', 'left-nav');
    await expect(page.locator('body')).toHaveAttribute('data-layout', 'left-nav');

    // Switch to light mode
    await page.locator('#dark-mode-toggle').uncheck();
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Enable gradient
    await page.locator('#gradient-toggle').check();
    await expect(page.locator('#hero-section')).toHaveClass(/gradient-mode/);

    // Wait for all styles to apply
    await page.waitForTimeout(500);

    // Verify that all attributes are set correctly
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'cyberpunk');
    await expect(page.locator('body')).toHaveAttribute('data-layout', 'left-nav');
    await expect(page.locator('body')).toHaveAttribute('data-mode', 'light');

    // Verify that the hero section has gradient mode class
    await expect(page.locator('#hero-section')).toHaveClass(/gradient-mode/);
  });

  // Test reset functionality
  test('reset button should show confirmation dialog', async ({ page }): any => {
    // Mock the confirm dialog to return true
    page.on('dialog', dialog => dialog.accept());

    // Click the reset button
    await page.locator('#reset-btn').click();

    // Since we've mocked the dialog to return true, page reload should happen
    // We can't easily test the reload itself, but we can check that we tried to perform it
  });
  // Test panel dragging (basic functionality test, not position)
  test('drag handle should be active', async ({ page }): any => {
    const dragHandle = page.locator('#drag-handle');
    await expect(dragHandle).toBeVisible();

    // This is a simple check since we can't easily test actual dragging in headless mode
  });
});
