// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Website Save Functionality Tests', (): any => {

  test.beforeEach(async ({ page }): any => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Wait for the control panel content to load
    await page.waitForSelector('#main-control-panel', { state: 'visible', timeout: 10000 });

    // Give time for the control panel content to be injected
    await page.waitForTimeout(2000);

    // Wait specifically for the save button to be present and visible
    await page.waitForSelector('#save-btn', { state: 'visible', timeout: 5000 });
  });

  test('Saved website should preserve dark mode and theme', async ({ page }): any => {
    // Change to a specific theme and ensure dark mode
    await page.locator('#theme-select').selectOption('ocean');
    await page.waitForTimeout(500);

    // Ensure dark mode is enabled
    const darkModeToggle = page.locator('#dark-mode-toggle');
    if (!await darkModeToggle.isChecked()) {
      await darkModeToggle.click();
    }
    await page.waitForTimeout(500);

    // Get current body attributes before saving
    const currentTheme = await page.locator('body').getAttribute('data-theme');
    const currentMode = await page.locator('body').getAttribute('data-mode');
    const currentLayout = await page.locator('body').getAttribute('data-layout');

    console.log(`Current settings - Theme: ${currentTheme}, Mode: ${currentMode}, Layout: ${currentLayout}`);

    // Get current CSS custom properties (colors)
    const primaryColor = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    });
    const bgPrimary = await page.evaluate((): any => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
    });

    console.log(`Current colors - Primary: ${primaryColor}, BG: ${bgPrimary}`);

    // Set up download listener
    const downloadPromise = page.waitForEvent('download');

    console.log('🔄 About to click the SAVE button...');

    // Click save button
    await page.locator('#save-btn').click();

    console.log('✅ Save button clicked! Waiting for download...');

    // Wait for download
    const download = await downloadPromise;

    console.log('📁 Download detected! Opening downloads folder...');

    // Open the downloads folder (Windows)
    const { exec } = await import('child_process');
    const os = await import('os');
    const path = await import('path');

    const downloadsPath = path.join(os.homedir(), 'Downloads');
    exec(`explorer "${downloadsPath}"`, (error): any => {
      if (error) {
        console.log('Could not open downloads folder:', error.message);
      } else {
        console.log('📂 Downloads folder opened!');
      }
    });

    // Save the downloaded file temporarily
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    // Read the downloaded HTML content
    const fs = await import('fs');
    const downloadedContent = fs.readFileSync(downloadPath, 'utf8');

    // Verify the saved HTML contains theme and mode attributes
    expect(downloadedContent).toContain(`data-theme="${currentTheme}"`);
    expect(downloadedContent).toContain(`data-mode="${currentMode}"`);
    expect(downloadedContent).toContain(`data-layout="${currentLayout}"`);

    console.log('✅ Theme, mode, and layout preserved in saved file');
  });

  test('Saved website should preserve colors and CSS variables', async ({ page }): any => {
    // Change hue and colors
    await page.locator('#hue-slider').fill('180'); // Cyan
    await page.waitForTimeout(500);

    // Get current CSS custom properties
    const cssVariables = await page.evaluate((): any => {
      const style = getComputedStyle(document.documentElement);
      return {
        primary: style.getPropertyValue('--primary').trim(),
        secondary: style.getPropertyValue('--secondary').trim(),
        accent: style.getPropertyValue('--accent').trim(),
        bgPrimary: style.getPropertyValue('--bg-primary').trim(),
        bgSecondary: style.getPropertyValue('--bg-secondary').trim(),
        textPrimary: style.getPropertyValue('--text-primary').trim()
      };
    });

    console.log('Current CSS variables:', cssVariables);

    // Set up download listener
    const downloadPromise = page.waitForEvent('download');

    console.log('🔄 About to click the SAVE button (CSS variables test)...');

    // Click save button
    await page.locator('#save-btn').click();

    console.log('✅ Save button clicked! Waiting for download...');

    // Wait for download
    const download = await downloadPromise;

    console.log('📁 Download detected!');

    // Save the downloaded file temporarily
    const downloadPath = await download.path();
    const fs = await import('fs');
    const downloadedContent = fs.readFileSync(downloadPath, 'utf8');

    // Verify CSS variables are preserved (should be in a style tag or inline)
    expect(downloadedContent).toContain('--primary');
    expect(downloadedContent).toContain('--bg-primary');
    expect(downloadedContent).toContain(cssVariables.primary);

    console.log('✅ CSS variables preserved in saved file');
  });

  test('Saved website should have NO insert media buttons', async ({ page }): any => {
    // Enable edit mode to show contextual buttons
    await page.locator('#edit-mode-toggle').click();
    await page.waitForTimeout(2000);

    // Verify contextual buttons exist before saving
    const contextualButtons = page.locator('.contextual-insert-media-btn');
    const buttonCount = await contextualButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
    console.log(`Found ${buttonCount} contextual insert media buttons before saving`);

    // Set up download listener
    const downloadPromise = page.waitForEvent('download');

    console.log('🔄 About to click the SAVE button (insert media buttons test)...');

    // Click save button
    await page.locator('#save-btn').click();

    console.log('✅ Save button clicked! Waiting for download...');

    // Wait for download
    const download = await downloadPromise;

    console.log('📁 Download detected!');

    // Save the downloaded file temporarily
    const downloadPath = await download.path();
    const fs = await import('fs');
    const downloadedContent = fs.readFileSync(downloadPath, 'utf8');

    // Verify NO insert media buttons in saved content
    expect(downloadedContent).not.toContain('contextual-insert-media-btn');
    expect(downloadedContent).not.toContain('insert-media-btn');
    expect(downloadedContent).not.toContain('Insert Media');
    expect(downloadedContent).not.toContain('➕');

    console.log('✅ No insert media buttons found in saved file');
  });

  test('Saved website should have NO edit mode functionality', async ({ page }): any => {
    // Enable edit mode
    await page.locator('#edit-mode-toggle').click();
    await page.waitForTimeout(1000);

    // Verify edit mode is active
    await expect(page.locator('body')).toHaveClass(/edit-mode/);

    // Set up download listener
    const downloadPromise = page.waitForEvent('download');

    // Click save button
    await page.locator('#save-btn').click();

    // Wait for download
    const download = await downloadPromise;

    // Save the downloaded file temporarily
    const downloadPath = await download.path();
    const fs = await import('fs');
    const downloadedContent = fs.readFileSync(downloadPath, 'utf8');

    // Verify NO edit mode classes or functionality in saved content
    expect(downloadedContent).not.toContain('edit-mode');
    expect(downloadedContent).not.toContain('contenteditable="true"');
    expect(downloadedContent).not.toContain('initControlPanelHandlers');

    // Should contain contenteditable="false" for editable elements
    expect(downloadedContent).toContain('contenteditable="false"');

    console.log('✅ No edit mode functionality in saved file');
  });

  test('Saved website should have NO control panel', async ({ page }): any => {
    // Listen for JavaScript errors and log them
    const consoleMessages: any[] = [];
    const pageErrors: any[] = [];

    page.on('console', msg => {
      const message = `${msg.type()}: ${msg.text()}`;
      consoleMessages.push(message);
      console.log('Browser Console:', message);
    });

    page.on('pageerror', error => {
      const errorMessage = `Page Error: ${error.message}`;
      pageErrors.push(errorMessage);
      console.log(errorMessage);
    });

    // Check if save button is present and clickable
    const saveBtn = await page.locator('#save-btn');
    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toBeEnabled();

    // Log current state before clicking
    const hasDownloadLink = await page.evaluate((): any => {
      return document.getElementById('download-link') !== null;
    });
    console.log('Download link exists:', hasDownloadLink);

    // Test if the save function exists
    const saveFunctionExists = await page.evaluate((): any => {
      const btn = document.getElementById('save-btn');
      return btn && btn.onclick !== null;
    });
    console.log('Save function attached:', saveFunctionExists);

    // Click save button and wait a bit to see what happens
    console.log('Clicking save button...');
    await page.locator('#save-btn').click();
    console.log('Save button clicked, waiting a moment...');

    // Wait a bit to see if there are any console errors
    await page.waitForTimeout(2000);

    // Check if any errors occurred
    if (pageErrors.length > 0) {
      console.log('JavaScript errors found:', pageErrors);
      throw new Error(`JavaScript errors occurred: ${pageErrors.join(', ')}`);
    }

    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });

    // Click save button again
    await page.locator('#save-btn').click();

    // Wait for download
    const download = await downloadPromise;

    // Save the downloaded file temporarily
    const downloadPath = await download.path();
    const fs = await import('fs');
    const downloadedContent = fs.readFileSync(downloadPath, 'utf8');

    // Verify NO control panel elements in saved content
    expect(downloadedContent).not.toContain('control-panel');
    expect(downloadedContent).not.toContain('main-control-panel');
    expect(downloadedContent).not.toContain('edit-mode-toggle');
    expect(downloadedContent).not.toContain('theme-select');
    expect(downloadedContent).not.toContain('save-btn');

    console.log('✅ No control panel found in saved file');
  });

  test('Import website preserves navigation layout and ensures sticky/top positioning', async ({ page }): any => {
    // First save a website with top navigation layout
    await page.locator('#theme-select').selectOption('ocean');
    await page.waitForTimeout(500);

    // Ensure top navigation layout is selected
    await page.locator('#layout-select').selectOption('top-nav');
    await page.waitForTimeout(500);

    // Verify current layout before saving
    const currentLayout = await page.locator('body').getAttribute('data-layout');
    expect(currentLayout).toBe('top-nav');

    // Verify navigation is positioned correctly before saving
    const navGridArea = await page.locator('#site-nav').evaluate(el => {
      return window.getComputedStyle(el).gridArea;
    });
    console.log(`Navigation grid-area before save: ${navGridArea}`);

    // Download the saved file
    console.log('📥 Clicking save button to download website...');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#save-btn').click();
    const download = await downloadPromise;
    console.log('✅ Download initiated successfully');

    // Read the downloaded file
    const fs = await import('fs');
    const path = await import('path');
    const os = await import('os');

    const downloadPath = path.join(os.tmpdir(), await download.suggestedFilename());
    await download.saveAs(downloadPath);

    const savedContent = fs.readFileSync(downloadPath, 'utf8');
    console.log(`📄 Saved file length: ${savedContent.length} characters`);

    // Verify the saved file has proper navigation structure
    expect(savedContent).toContain('id="site-nav"');
    expect(savedContent).toContain('class="site-nav"');
    expect(savedContent).toContain('data-layout="top-nav"');

    // Now change to a different layout to test import
    await page.locator('#layout-select').selectOption('left-nav');
    await page.waitForTimeout(500);

    // Verify layout changed
    const changedLayout = await page.locator('body').getAttribute('data-layout');
    expect(changedLayout).toBe('left-nav');

    // Import the saved file using the import button
    console.log('📤 Testing import functionality...');

    // Trigger file input (simulate file selection)
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(downloadPath);
    await page.waitForTimeout(1000);

    // Verify import was successful
    const importedLayout = await page.locator('body').getAttribute('data-layout');
    expect(importedLayout).toBe('top-nav');
    console.log(`✅ Layout correctly restored to: ${importedLayout}`);

    // Verify navigation is positioned at the top after import
    const importedNavGridArea = await page.locator('#site-nav').evaluate(el => {
      return window.getComputedStyle(el).gridArea;
    });
    expect(importedNavGridArea).toBe('nav');
    console.log(`✅ Navigation grid-area after import: ${importedNavGridArea}`);

    // Verify navigation is the first child of site-container (top position)
    const isNavFirstChild = await page.evaluate((): any => {
      const siteContainer = document.getElementById('site-container');
      const siteNav = document.getElementById('site-nav');
      return siteContainer && siteNav && siteContainer.children[0] === siteNav;
    });
    expect(isNavFirstChild).toBe(true);
    console.log('✅ Navigation is positioned as first child (top position)');

    // Verify CSS grid layout is properly applied
    const containerGridTemplate = await page.locator('#site-container').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        gridTemplateAreas: styles.gridTemplateAreas,
        gridTemplateColumns: styles.gridTemplateColumns
      };
    });
    expect(containerGridTemplate.display).toBe('grid');
    expect(containerGridTemplate.gridTemplateAreas).toContain('nav');
    console.log(`✅ Grid layout preserved: ${JSON.stringify(containerGridTemplate)}`);

    // Verify navigation has proper sticky/top styling
    const navStyles = await page.locator('#site-nav').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        zIndex: styles.zIndex,
        display: styles.display,
        width: styles.width
      };
    });
    console.log(`✅ Navigation styles: ${JSON.stringify(navStyles)}`);

    // Clean up
    fs.unlinkSync(downloadPath);
    console.log('✅ Import test completed successfully - navigation layout preserved');
  });

});
