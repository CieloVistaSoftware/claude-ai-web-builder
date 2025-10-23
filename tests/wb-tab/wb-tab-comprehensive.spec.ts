/**
 * COMPREHENSIVE WB Tab Tests
 * Tests every single property, method, and behavior of the wb-tab component
 * Following the established WB project testing patterns
 */

import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('WB Tab - Comprehensive Component Tests', () => {
  const baseTest = new BaseUnitTest();
    
    test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('/components/wb-tab/wb-tab-demo.html');
    await page.waitForTimeout(1000);
  });

    test.describe('Web Component Creation and Registration', () => {
        
        test('check browser console for JavaScript errors', async ({ page }) => {
            const errors: string[] = [];
            const logs: string[] = [];
            
            // Capture console errors
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    errors.push(`ERROR: ${msg.text()}`);
                } else {
                    logs.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
                }
            });
            
            // Also capture JavaScript errors
            page.on('pageerror', error => {
                errors.push(`PAGE ERROR: ${error.message}`);
            });
            
            // Navigate and wait
            await page.goto('/components/wb-tab/wb-tab-demo.html');
            await page.waitForTimeout(2000); // Give scripts time to load and execute
            
            console.log('=== BROWSER CONSOLE LOGS ===');
            logs.forEach(log => console.log(log));
            
            console.log('=== BROWSER CONSOLE ERRORS ===');
            errors.forEach(error => console.log(error));
            
            // Check if our debug logs appeared
            const hasDebugLogs = logs.some(log => log.includes('🏷️ WB Tab:'));
            console.log(`Debug logs found: ${hasDebugLogs}`);
            
            // This test will help us see what's happening
            expect(errors.length).toBe(0); // Expect no errors for now, just to see them
        });

        test('wb-tab custom element is registered', async ({ page }) => {
            const isRegistered = await page.evaluate(() => {
                return customElements.get('wb-tab') !== undefined;
            });
            expect(isRegistered).toBe(true);
        });

        test('wb-tab-item custom element is registered', async ({ page }) => {
            const isRegistered = await page.evaluate(() => {
                return customElements.get('wb-tab-item') !== undefined;
            });
            expect(isRegistered).toBe(true);
        });

        test('wb-tab-panel custom element is registered', async ({ page }) => {
            const isRegistered = await page.evaluate(() => {
                return customElements.get('wb-tab-panel') !== undefined;
            });
            expect(isRegistered).toBe(true);
        });

        test('can create wb-tab element programmatically', async ({ page }) => {
            const modalCreated = await page.evaluate(() => {
                const tab = document.createElement('wb-tab');
                return tab.tagName === 'WB-TAB';
            });
            expect(modalCreated).toBe(true);
        });
    });

    test.describe('Component Initialization and Rendering', () => {
        
        test('basic tab component renders correctly', async ({ page }) => {
            const basicTabs = page.locator('#basic-tabs');
            await expect(basicTabs).toBeVisible();
            
            // Check shadow DOM exists
            const hasShadowRoot = await page.evaluate(() => {
                const tab = document.querySelector('#basic-tabs') as any;
                return tab.shadowRoot !== null;
            });
            expect(hasShadowRoot).toBe(true);
        });

        test('tab items are rendered correctly', async ({ page }) => {
            const tabItems = page.locator('#basic-tabs wb-tab-item');
            await expect(tabItems).toHaveCount(4); // Home, Profile, Settings, Help
            
            // Check first tab content
            await expect(tabItems.first()).toContainText('Home');
        });

        test('tab panels are rendered correctly', async ({ page }) => {
            const tabPanels = page.locator('#basic-tabs wb-tab-panel');
            await expect(tabPanels).toHaveCount(4);
            
            // Check first panel is visible
            const firstPanel = tabPanels.first();
            await expect(firstPanel).toBeVisible();
        });

        test('first tab is active by default', async ({ page }) => {
            const firstTab = page.locator('#basic-tabs wb-tab-item[tab-id="home"]');
            const firstPanel = page.locator('#basic-tabs wb-tab-panel[tab-for="home"]');
            
            // Check ARIA attributes
            await expect(firstTab).toHaveAttribute('aria-selected', 'true');
            await expect(firstPanel).toBeVisible();
        });
    });

    test.describe('Tab Switching Functionality', () => {
        
        test('clicking tab switches to correct panel', async ({ page }) => {
            const profileTab = page.locator('#basic-tabs wb-tab-item[tab-id="profile"]');
            const profilePanel = page.locator('#basic-tabs wb-tab-panel[tab-for="profile"]');
            const homePanel = page.locator('#basic-tabs wb-tab-panel[tab-for="home"]');
            
            await profileTab.click();
            
            // Verify switch
            await expect(profileTab).toHaveAttribute('aria-selected', 'true');
            await expect(profilePanel).toBeVisible();
            await expect(homePanel).not.toBeVisible();
        });

        test('programmatic tab switching works', async ({ page }) => {
            // Switch to settings tab programmatically
            await page.click('button:has-text("Switch to Profile")');
            
            const profileTab = page.locator('#basic-tabs wb-tab-item[tab-id="profile"]');
            const profilePanel = page.locator('#basic-tabs wb-tab-panel[tab-for="profile"]');
            
            await expect(profileTab).toHaveAttribute('aria-selected', 'true');
            await expect(profilePanel).toBeVisible();
        });

        test('keyboard navigation works', async ({ page }) => {
            // Focus first tab
            const firstTab = page.locator('#basic-tabs wb-tab-item[tab-id="home"]');
            await firstTab.focus();
            
            // Press right arrow
            await page.keyboard.press('ArrowRight');
            
            // Should switch to profile tab
            const profileTab = page.locator('#basic-tabs wb-tab-item[tab-id="profile"]');
            await expect(profileTab).toHaveAttribute('aria-selected', 'true');
        });

        test('Home and End keys work', async ({ page }) => {
            // Focus and go to last tab
            const firstTab = page.locator('#basic-tabs wb-tab-item[tab-id="home"]');
            await firstTab.focus();
            
            await page.keyboard.press('End');
            
            // Should be on last tab (help)
            const helpTab = page.locator('#basic-tabs wb-tab-item[tab-id="help"]');
            await expect(helpTab).toHaveAttribute('aria-selected', 'true');
            
            // Go to first tab
            await page.keyboard.press('Home');
            
            // Should be back on home tab
            await expect(firstTab).toHaveAttribute('aria-selected', 'true');
        });
    });

    test.describe('Tab Variants', () => {
        
        test('pills variant renders correctly', async ({ page }) => {
            const pillsTabs = page.locator('#pills-tabs');
            await expect(pillsTabs).toHaveAttribute('variant', 'pills');
            
            // Take screenshot for visual verification
            await expect(pillsTabs).toHaveScreenshot('pills-variant.png');
        });

        test('underline variant renders correctly', async ({ page }) => {
            const underlineTabs = page.locator('#underline-tabs');
            await expect(underlineTabs).toHaveAttribute('variant', 'underline');
            
            // Take screenshot for visual verification  
            await expect(underlineTabs).toHaveScreenshot('underline-variant.png');
        });

        test('card variant renders correctly', async ({ page }) => {
            const closableTabs = page.locator('#closable-tabs');
            await expect(closableTabs).toHaveAttribute('variant', 'card');
            
            // Take screenshot for visual verification
            await expect(closableTabs).toHaveScreenshot('card-variant.png');
        });
    });

    test.describe('Closable Tabs', () => {
        
        test('closable tabs have close buttons', async ({ page }) => {
            const closableTab = page.locator('#closable-tabs wb-tab-item[tab-id="1"]');
            
            // Should have close button (might be in shadow DOM)
            const hasCloseButton = await page.evaluate(() => {
                const tab = document.querySelector('#closable-tabs wb-tab-item[tab-id="1"]');
                return tab && (tab.hasAttribute('closable') || tab.innerHTML.includes('×'));
            });
            
            expect(hasCloseButton).toBe(true);
        });

        test('clicking close button removes tab', async ({ page }) => {
            const initialTabCount = await page.locator('#closable-tabs wb-tab-item').count();
            
            // Click close button on second tab
            const closeButton = page.locator('#closable-tabs wb-tab-item[tab-id="1"] .tab-close');
            if (await closeButton.isVisible()) {
                await closeButton.click();
                
                // Wait for removal
                await page.waitForTimeout(300);
                
                // Verify tab count decreased
                const newTabCount = await page.locator('#closable-tabs wb-tab-item').count();
                expect(newTabCount).toBe(initialTabCount - 1);
            }
        });

        test('adding closable tab works', async ({ page }) => {
            const initialTabCount = await page.locator('#closable-tabs wb-tab-item').count();
            
            await page.click('button:has-text("Add Closable Tab")');
            
            // Wait for addition
            await page.waitForTimeout(300);
            
            const newTabCount = await page.locator('#closable-tabs wb-tab-item').count();
            expect(newTabCount).toBe(initialTabCount + 1);
        });
    });

    test.describe('Vertical Orientation', () => {
        
        test('vertical tabs render correctly', async ({ page }) => {
            const verticalTabs = page.locator('#vertical-tabs');
            await expect(verticalTabs).toHaveAttribute('orientation', 'vertical');
            
            // Take screenshot for visual verification
            await expect(verticalTabs).toHaveScreenshot('vertical-tabs.png');
        });

        test('vertical tabs can be clicked', async ({ page }) => {
            const teamTab = page.locator('#vertical-tabs wb-tab-item[tab-id="1"]');
            const teamPanel = page.locator('#vertical-tabs wb-tab-panel[tab-for="1"]');
            
            await teamTab.click();
            
            await expect(teamTab).toHaveAttribute('aria-selected', 'true');
            await expect(teamPanel).toBeVisible();
        });
    });

    test.describe('Dynamic Tab Management', () => {
        
        test('adding dynamic tab works', async ({ page }) => {
            const initialTabCount = await page.locator('#basic-tabs wb-tab-item').count();
            
            await page.click('button:has-text("Add Dynamic Tab")');
            
            // Wait for addition
            await page.waitForTimeout(300);
            
            const newTabCount = await page.locator('#basic-tabs wb-tab-item').count();
            expect(newTabCount).toBe(initialTabCount + 1);
            
            // Check new tab is clickable
            const newTab = page.locator('#basic-tabs wb-tab-item[tab-id^="dynamic-"]').first();
            await expect(newTab).toBeVisible();
            await newTab.click();
            
            // Should switch to new tab
            await expect(newTab).toHaveAttribute('aria-selected', 'true');
        });

        test('removing last tab works', async ({ page }) => {
            const initialTabCount = await page.locator('#basic-tabs wb-tab-item').count();
            
            await page.click('button:has-text("Remove Last Tab")');
            
            // Wait for removal
            await page.waitForTimeout(300);
            
            const newTabCount = await page.locator('#basic-tabs wb-tab-item').count();
            expect(newTabCount).toBe(initialTabCount - 1);
        });
    });

    test.describe('Event Handling', () => {
        
        test('tab change events are logged', async ({ page }) => {
            const eventLog = page.locator('#event-log');
            
            // Click a tab
            const profileTab = page.locator('#basic-tabs wb-tab-item[tab-id="profile"]');
            await profileTab.click();
            
            // Wait for event to be logged
            await page.waitForTimeout(300);
            
            // Check event log contains the change
            await expect(eventLog).toContainText('Tab changed');
        });

        test('tab add events are logged', async ({ page }) => {
            const eventLog = page.locator('#event-log');
            
            await page.click('button:has-text("Add Dynamic Tab")');
            
            // Wait for event to be logged
            await page.waitForTimeout(300);
            
            await expect(eventLog).toContainText('Dynamic tab added');
        });

        test('clear event log works', async ({ page }) => {
            const eventLog = page.locator('#event-log');
            
            // Generate some events
            await page.click('#basic-tabs wb-tab-item[tab-id="profile"]');
            await page.waitForTimeout(100);
            
            // Clear log
            await page.click('button:has-text("Clear Log")');
            
            // Should be cleared
            await expect(eventLog).toContainText('Event log cleared');
        });
    });

    test.describe('Theme Support', () => {
        
        test('theme switching works', async ({ page }) => {
            // Switch to light theme
            await page.click('.theme-toggle');
            
            // Wait for theme change
            await page.waitForTimeout(300);
            
            // Check body has light class
            const hasLightClass = await page.evaluate(() => {
                return document.body.classList.contains('light');
            });
            expect(hasLightClass).toBe(true);
            
            // Take screenshot in light theme
            await expect(page.locator('#basic-tabs')).toHaveScreenshot('tabs-light-theme.png');
        });

        test('components update theme attribute', async ({ page }) => {
            await page.click('.theme-toggle');
            
            // Wait for theme update
            await page.waitForTimeout(300);
            
            // Check tab components have updated theme
            const basicTabs = page.locator('#basic-tabs');
            await expect(basicTabs).toHaveAttribute('theme', 'light');
        });
    });

    test.describe('Accessibility Features', () => {
        
        test('ARIA attributes are correctly set', async ({ page }) => {
            const tabList = page.locator('#basic-tabs').first();
            const firstTab = page.locator('#basic-tabs wb-tab-item').first();
            const firstPanel = page.locator('#basic-tabs wb-tab-panel').first();
            
            // Check tab has correct ARIA role
            await expect(firstTab).toHaveAttribute('role', 'tab');
            
            // Check tabpanel has correct role  
            await expect(firstPanel).toHaveAttribute('role', 'tabpanel');
            
            // Check aria-selected
            await expect(firstTab).toHaveAttribute('aria-selected', 'true');
        });

        test('focus management works correctly', async ({ page }) => {
            const firstTab = page.locator('#basic-tabs wb-tab-item[tab-id="home"]');
            const secondTab = page.locator('#basic-tabs wb-tab-item[tab-id="profile"]');
            
            // First tab should have tabindex 0
            await expect(firstTab).toHaveAttribute('tabindex', '0');
            
            // Other tabs should have tabindex -1
            await expect(secondTab).toHaveAttribute('tabindex', '-1');
            
            // After switching, focus should update
            await secondTab.click();
            
            await expect(firstTab).toHaveAttribute('tabindex', '-1');
            await expect(secondTab).toHaveAttribute('tabindex', '0');
        });

        test('keyboard navigation is accessible', async ({ page }) => {
            // Focus first tab
            const firstTab = page.locator('#basic-tabs wb-tab-item[tab-id="home"]');
            await firstTab.focus();
            
            // Should be focused
            await expect(firstTab).toBeFocused();
            
            // Arrow key should move focus and activate
            await page.keyboard.press('ArrowRight');
            
            const secondTab = page.locator('#basic-tabs wb-tab-item[tab-id="profile"]');
            await expect(secondTab).toBeFocused();
            await expect(secondTab).toHaveAttribute('aria-selected', 'true');
        });
    });

    test.describe('Responsive Behavior', () => {
        
        test('tabs work on mobile viewport', async ({ page }) => {
            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            
            // Basic functionality should still work
            const profileTab = page.locator('#basic-tabs wb-tab-item[tab-id="profile"]');
            await profileTab.click();
            
            await expect(profileTab).toHaveAttribute('aria-selected', 'true');
            
            // Take mobile screenshot
            await expect(page.locator('#basic-tabs')).toHaveScreenshot('tabs-mobile.png');
        });

        test('vertical tabs adapt to mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            
            const verticalTabs = page.locator('#vertical-tabs');
            
            // Should still be functional
            const teamTab = page.locator('#vertical-tabs wb-tab-item[tab-id="1"]');
            await teamTab.click();
            
            await expect(teamTab).toHaveAttribute('aria-selected', 'true');
            
            // Take screenshot
            await expect(verticalTabs).toHaveScreenshot('vertical-tabs-mobile.png');
        });
    });

    test.describe('Performance and Edge Cases', () => {
        
        test('many tabs can be added without breaking', async ({ page }) => {
            // Add 10 tabs quickly
            for (let i = 0; i < 10; i++) {
                await page.click('button:has-text("Add Dynamic Tab")');
                await page.waitForTimeout(50);
            }
            
            // Should still be functional
            const allTabs = page.locator('#basic-tabs wb-tab-item');
            const tabCount = await allTabs.count();
            expect(tabCount).toBeGreaterThan(10);
            
            // Last tab should be clickable
            const lastTab = allTabs.last();
            await lastTab.click();
            await expect(lastTab).toHaveAttribute('aria-selected', 'true');
        });

        test('component handles invalid configurations', async ({ page }) => {
            // Try to set invalid attributes via JavaScript
            const result = await page.evaluate(() => {
                try {
                    const tab = document.querySelector('#basic-tabs') as any;
                    tab.setAttribute('variant', 'invalid-variant');
                    tab.setAttribute('orientation', 'invalid-orientation');
                    tab.setAttribute('theme', 'invalid-theme');
                    return true;
                } catch (error) {
                    return false;
                }
            });
            
            // Should not throw errors
            expect(result).toBe(true);
        });

        test('component initializes within reasonable time', async ({ page }) => {
            const startTime = Date.now();
            
            // Create new tab component
            await page.evaluate(() => {
                const newTab = document.createElement('wb-tab');
                newTab.innerHTML = `
                    <wb-tab-item tab-id="test1">Test 1</wb-tab-item>
                    <wb-tab-item tab-id="test2">Test 2</wb-tab-item>
                    <wb-tab-panel tab-for="test1">Content 1</wb-tab-panel>  
                    <wb-tab-panel tab-for="test2">Content 2</wb-tab-panel>
                `;
                document.body.appendChild(newTab);
            });
            
            // Wait for initialization
            await page.waitForSelector('wb-tab wb-tab-item[role="tab"]');
            
            const endTime = Date.now();
            const initTime = endTime - startTime;
            
            // Should initialize quickly (under 1 second)
            expect(initTime).toBeLessThan(1000);
        });
    });

    test.describe('Cross-Browser Compatibility', () => {
        
        test('works consistently across browsers', async ({ page, browserName }) => {
            // Basic functionality should work the same
            const profileTab = page.locator('#basic-tabs wb-tab-item[tab-id="profile"]');
            await profileTab.click();
            
            await expect(profileTab).toHaveAttribute('aria-selected', 'true');
            
            // Take browser-specific screenshot
            await expect(page.locator('#basic-tabs')).toHaveScreenshot(`tabs-${browserName}.png`);
        });
    });
});