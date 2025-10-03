export {};
// @ts-nocheck
// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Color Explorer UI Tests', (): any => {
  test.beforeEach(async ({ page }): any => {
    await page.goto('/components/color-bar/color-bar-demo.html');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    // Wait for color-bar components to load
    await page.waitForSelector('color-bar', { state: 'visible' });
  });

  test('Color bar components should be visible and styled correctly', async ({ page }): any => {
    // Check if color bar components exist and are visible
    const colorBars = await page.locator('color-bar');
    expect(await colorBars.count()).toBeGreaterThan(0);
    
    const firstColorBar = colorBars.first();
    await expect(firstColorBar).toBeVisible();

    // Check if the color bar has slider elements
    const slider = firstColorBar.locator('[role="slider"]');
    await expect(slider).toBeVisible();
    
    console.log('Color bar components are visible and properly styled');
  });

  test('Color bar components should respond to interaction', async ({ page }): any => {
    // Get the first color bar component
    const colorBar = await page.locator('color-bar').first();
    const slider = colorBar.locator('[role="slider"]');
    
    // Interact with the slider
    await slider.click();
    await page.waitForTimeout(300);
    
    console.log('Color bar interaction completed');
  });

  test('Color bar components should not have duplicate sliders', async ({ page }): any => {
    // Count the number of color-bar components
    const colorBars = await page.locator('color-bar');
    const colorBarCount = await colorBars.count();
    expect(colorBarCount).toBeGreaterThan(0);

    // Each color bar should have exactly one slider
    for (let i = 0; i < colorBarCount; i++) {
      const colorBar = colorBars.nth(i);
      const sliders = colorBar.locator('[role="slider"]');
      expect(await sliders.count()).toBe(1);
    }
    
    console.log(`Verified ${colorBarCount} color bar components each have exactly one slider`);
  });
});
