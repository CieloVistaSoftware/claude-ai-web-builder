/**
 * wb-chatbot Component Tests
 * 
 * Tests for the WB Chatbot component
 */

import { test, expect } from '@playwright/test';

test.describe('wb-chatbot', () => {
    
    test.beforeEach(async ({ page }) => {
        // Monitor for console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log('Console error:', msg.text());
            }
        });
        
        // Monitor for page errors
        page.on('pageerror', error => {
            console.log('Page error:', error.message);
        });
        
        await page.goto('/components/wb-chatbot/wb-chatbot-demo.html');
        await page.waitForSelector('wb-chatbot');
    });

    test('should render and be visible', async ({ page }) => {
        const component = page.locator('wb-chatbot').first();
        await expect(component).toBeVisible();
        
        // Check not zero-sized
        const box = await component.boundingBox();
        expect(box?.width).toBeGreaterThan(0);
        expect(box?.height).toBeGreaterThan(0);
    });

    test('should have Shadow DOM', async ({ page }) => {
        const hasShadow = await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            return !!el?.shadowRoot;
        });
        expect(hasShadow).toBe(true);
    });

    test('should display header with title', async ({ page }) => {
        const headerTitle = await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            return el?.shadowRoot?.querySelector('.header-title')?.textContent;
        });
        expect(headerTitle).toBeTruthy();
    });

    test('should display welcome message', async ({ page }) => {
        const hasWelcome = await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            const messages = el?.shadowRoot?.querySelector('#messages');
            return messages?.innerHTML?.includes('WB Framework Assistant');
        });
        expect(hasWelcome).toBe(true);
    });

    test('should have input field and send button', async ({ page }) => {
        const hasInput = await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            const input = el?.shadowRoot?.querySelector('#input-field');
            const btn = el?.shadowRoot?.querySelector('#send-btn');
            return !!input && !!btn;
        });
        expect(hasInput).toBe(true);
    });

    test('should respond to user message', async ({ page }) => {
        // Type a message
        await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            const input = el?.shadowRoot?.querySelector('#input-field') as HTMLInputElement;
            if (input) {
                input.value = 'hello';
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        
        // Click send
        await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            const btn = el?.shadowRoot?.querySelector('#send-btn') as HTMLButtonElement;
            btn?.click();
        });
        
        // Wait for response
        await page.waitForTimeout(100);
        
        // Check response appeared
        const messageCount = await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            const messages = el?.shadowRoot?.querySelectorAll('.wb-chatbot__message');
            return messages?.length || 0;
        });
        
        // Should have: welcome + user message + bot response = 3
        expect(messageCount).toBeGreaterThanOrEqual(3);
    });

    test('should respond to "button" keyword', async ({ page }) => {
        // Send message about button
        await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            const input = el?.shadowRoot?.querySelector('#input-field') as HTMLInputElement;
            if (input) {
                input.value = 'tell me about button';
            }
        });
        
        await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            const btn = el?.shadowRoot?.querySelector('#send-btn') as HTMLButtonElement;
            btn?.click();
        });
        
        await page.waitForTimeout(100);
        
        // Check response contains button info
        const hasButtonResponse = await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            const messages = el?.shadowRoot?.querySelector('#messages');
            return messages?.innerHTML?.includes('wb-button') || messages?.innerHTML?.includes('styled button');
        });
        
        expect(hasButtonResponse).toBe(true);
    });

    test('should respond to Enter key', async ({ page }) => {
        const initialCount = await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            return el?.shadowRoot?.querySelectorAll('.wb-chatbot__message')?.length || 0;
        });
        
        // Type and press Enter
        await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            const input = el?.shadowRoot?.querySelector('#input-field') as HTMLInputElement;
            if (input) {
                input.value = 'help';
                input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));
            }
        });
        
        await page.waitForTimeout(100);
        
        const newCount = await page.evaluate(() => {
            const el = document.querySelector('wb-chatbot');
            return el?.shadowRoot?.querySelectorAll('.wb-chatbot__message')?.length || 0;
        });
        
        expect(newCount).toBeGreaterThan(initialCount);
    });

    test('should respect title attribute', async ({ page }) => {
        // Check the second chatbot with custom title
        const title = await page.evaluate(() => {
            const chatbots = document.querySelectorAll('wb-chatbot');
            if (chatbots.length > 1) {
                const el = chatbots[1];
                return el?.shadowRoot?.querySelector('.header-title')?.textContent;
            }
            return null;
        });
        
        expect(title).toBe('Help Bot');
    });
});
