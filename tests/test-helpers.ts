/**
 * WB Component Test Helpers
 * 
 * Shared utilities for testing WB components consistently
 */

import { Page, Locator } from '@playwright/test';

export class WBTestHelpers {
    
    /**
     * Wait for a WB component to fully initialize
     */
    static async waitForComponent(page: Page, selector: string, timeout = 10000): Promise<void> {
        await page.waitForSelector(selector, { timeout });
        await page.waitForLoadState('domcontentloaded');
        
        // Wait for shadow DOM to be created
        await page.waitForFunction((sel) => {
            const element = document.querySelector(sel) as any;
            return element && element.shadowRoot !== null;
        }, selector, { timeout });
        
        // Small delay for component initialization
        await page.waitForTimeout(100);
    }
    
    /**
     * Check if a custom element is registered
     */
    static async isCustomElementRegistered(page: Page, tagName: string): Promise<boolean> {
        return await page.evaluate((tag) => {
            return customElements.get(tag) !== undefined;
        }, tagName);
    }
    
    /**
     * Get shadow DOM content
     */
    static async getShadowContent(page: Page, selector: string): Promise<string> {
        return await page.evaluate((sel) => {
            const element = document.querySelector(sel) as any;
            return element?.shadowRoot?.innerHTML || '';
        }, selector);
    }
    
    /**
     * Simulate realistic user interaction with delay
     */
    static async userClick(page: Page, selector: string): Promise<void> {
        await page.hover(selector);
        await page.waitForTimeout(50);
        await page.click(selector);
        await page.waitForTimeout(100);
    }
    
    /**
     * Test keyboard navigation sequence
     */
    static async testKeyboardNavigation(page: Page, startSelector: string, keys: string[]): Promise<void> {
        await page.focus(startSelector);
        
        for (const key of keys) {
            await page.keyboard.press(key);
            await page.waitForTimeout(50);
        }
    }
    
    /**
     * Check ARIA attributes
     */
    static async checkARIACompliance(page: Page, selector: string): Promise<boolean> {
        const element = page.locator(selector);
        
        // Check basic ARIA requirements
        const hasRole = await element.getAttribute('role') !== null;
        const hasAriaLabel = await element.getAttribute('aria-label') !== null;
        const hasAriaLabelledBy = await element.getAttribute('aria-labelledby') !== null;
        
        return hasRole && (hasAriaLabel || hasAriaLabelledBy);
    }
    
    /**
     * Test theme switching
     */
    static async testThemeSwitch(page: Page, themeToggleSelector: string): Promise<boolean> {
        // Get initial theme
        const initialTheme = await page.evaluate(() => {
            return document.body.classList.contains('light') ? 'light' : 'dark';
        });
        
        // Click theme toggle
        await page.click(themeToggleSelector);
        await page.waitForTimeout(300);
        
        // Verify theme changed
        const newTheme = await page.evaluate(() => {
            return document.body.classList.contains('light') ? 'light' : 'dark';
        });
        
        return newTheme !== initialTheme;
    }
    
    /**
     * Test responsive behavior
     */
    static async testResponsive(page: Page, viewports: { width: number; height: number }[]): Promise<void> {
        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await page.waitForTimeout(200);
            
            // Component should remain functional
            await page.waitForSelector('wb-tab', { state: 'visible' });
        }
    }
    
    /**
     * Performance timing helper
     */
    static async measurePerformance<T>(page: Page, operation: () => Promise<T>): Promise<{ result: T; duration: number }> {
        const startTime = await page.evaluate(() => performance.now());
        const result = await operation();
        const endTime = await page.evaluate(() => performance.now());
        
        return {
            result,
            duration: endTime - startTime
        };
    }
    
    /**
     * Test event handling
     */
    static async testEventHandling(page: Page, eventType: string, triggerAction: () => Promise<void>): Promise<boolean> {
        let eventFired = false;
        
        // Listen for the event
        await page.evaluate((type) => {
            (window as any).testEventFired = false;
            document.addEventListener(type, () => {
                (window as any).testEventFired = true;
            });
        }, eventType);
        
        // Trigger the action
        await triggerAction();
        
        // Check if event was fired
        eventFired = await page.evaluate(() => (window as any).testEventFired);
        
        return eventFired;
    }
    
    /**
     * Wait for animation to complete
     */
    static async waitForAnimation(page: Page, selector: string): Promise<void> {
        await page.waitForFunction((sel) => {
            const element = document.querySelector(sel);
            if (!element) return true;
            
            const style = window.getComputedStyle(element);
            return style.animationPlayState !== 'running' && style.transitionProperty === 'none';
        }, selector);
    }
    
    /**
     * Test component cleanup
     */
    static async testCleanup(page: Page, componentSelector: string): Promise<boolean> {
        // Remove component
        await page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (element) {
                element.remove();
            }
        }, componentSelector);
        
        // Check if properly removed
        const exists = await page.locator(componentSelector).count();
        return exists === 0;
    }
}

/**
 * Common test patterns for WB components
 */
export const WBTestPatterns = {
    
    /**
     * Standard component initialization test
     */
    async testComponentInitialization(page: Page, componentSelector: string, tagName: string) {
        // Component should be registered
        const isRegistered = await WBTestHelpers.isCustomElementRegistered(page, tagName);
        if (!isRegistered) {
            throw new Error(`Custom element ${tagName} is not registered`);
        }
        
        // Component should render
        await WBTestHelpers.waitForComponent(page, componentSelector);
        
        // Should have shadow DOM
        const shadowContent = await WBTestHelpers.getShadowContent(page, componentSelector);
        if (!shadowContent) {
            throw new Error(`Component ${componentSelector} does not have shadow DOM`);
        }
        
        return true;
    },
    
    /**
     * Standard accessibility test
     */
    async testAccessibility(page: Page, componentSelector: string) {
        const component = page.locator(componentSelector);
        
        // Should be focusable or have focusable children
        const isFocusable = await component.evaluate((el) => {
            return el.tabIndex >= 0 || el.querySelector('[tabindex]') !== null;
        });
        
        // Should have proper ARIA attributes
        const hasARIA = await WBTestHelpers.checkARIACompliance(page, componentSelector);
        
        return { isFocusable, hasARIA };
    },
    
    /**
     * Standard visual regression test
     */
    async testVisualRegression(page: Page, componentSelector: string, screenshotName: string) {
        const component = page.locator(componentSelector);
        
        // Wait for component to be stable
        await WBTestHelpers.waitForComponent(page, componentSelector);
        await page.waitForTimeout(200);
        
        // Take screenshot
        return await component.screenshot({ path: `test-results/${screenshotName}` });
    }
};

/**
 * WB Component test configuration
 */
export const WBTestConfig = {
    defaultTimeout: 10000,
    animationTimeout: 500,
    networkTimeout: 5000,
    
    commonViewports: [
        { width: 1920, height: 1080 }, // Desktop
        { width: 768, height: 1024 },  // Tablet
        { width: 375, height: 667 }    // Mobile
    ],
    
    supportedBrowsers: ['chromium', 'firefox', 'webkit'],
    
    testCategories: {
        initialization: 'Component creation and setup',
        functionality: 'Core component features',
        interaction: 'User interactions and events',
        accessibility: 'ARIA compliance and keyboard navigation',
        visual: 'Visual appearance and responsive design',
        performance: 'Load times and resource usage',
        compatibility: 'Cross-browser and device support'
    }
};