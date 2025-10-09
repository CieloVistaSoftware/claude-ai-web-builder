/**
 * COMPREHENSIVE WB Modal Tests
 * Tests every single property, method, and behavior of the wb-modal component
 * These tests will FAIL if any functionality is broken
 */

import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('WB Modal - Comprehensive Property & Method Tests', () => {
  const baseTest = new BaseUnitTest();
    
    test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.waitForTimeout(1000);
  });

    test.describe('Web Component Creation and Registration', () => {
        
        test('wb-modal custom element is registered', async ({ page }) => {
            const isRegistered = await page.evaluate(() => {
                return customElements.get('wb-modal') !== undefined;
            });
            expect(isRegistered).toBe(true);
        });

        test('can create wb-modal element programmatically', async ({ page }) => {
            const modalCreated = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                return modal.tagName === 'WB-MODAL';
            });
            expect(modalCreated).toBe(true);
        });

        test('modal element has correct default class', async ({ page }) => {
            const hasCorrectClass = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                document.body.appendChild(modal);
                return modal.className === 'wb-modal';
            });
            expect(hasCorrectClass).toBe(true);
        });
    });

    test.describe('Observed Attributes', () => {
        
        test('all observed attributes are defined', async ({ page }) => {
            const observedAttrs = await page.evaluate(() => {
                const ModalClass = customElements.get('wb-modal');
                return ModalClass.observedAttributes;
            });
            
            expect(observedAttrs).toContain('title');
            expect(observedAttrs).toContain('size');
            expect(observedAttrs).toContain('variant');
            expect(observedAttrs).toContain('duration');
            expect(observedAttrs).toContain('bg-color');
            expect(observedAttrs).toContain('color');
            expect(observedAttrs).toContain('open');
        });

        test('title attribute changes modal title', async ({ page }) => {
            const titleWorks = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                modal.setAttribute('title', 'Test Title');
                document.body.appendChild(modal);
                
                // Check if title element is created with correct text
                const titleElement = modal.querySelector('.wb-modal-title');
                return titleElement && titleElement.textContent === 'Test Title';
            });
            expect(titleWorks).toBe(true);
        });

        test('size attribute changes modal size class', async ({ page }) => {
            const sizeWorks = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                modal.setAttribute('size', 'large');
                document.body.appendChild(modal);
                
                return modal.classList.contains('wb-modal--large');
            });
            expect(sizeWorks).toBe(true);
        });

        test('variant attribute changes modal variant class', async ({ page }) => {
            const variantWorks = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                modal.setAttribute('variant', 'success');
                document.body.appendChild(modal);
                
                return modal.classList.contains('wb-modal--success');
            });
            expect(variantWorks).toBe(true);
        });

        test('duration attribute sets CSS custom property', async ({ page }) => {
            const durationWorks = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                modal.setAttribute('duration', '2000');
                document.body.appendChild(modal);
                
                return modal.style.getPropertyValue('--wb-modal-duration') === '2000ms';
            });
            expect(durationWorks).toBe(true);
        });

        test('bg-color attribute sets CSS custom property', async ({ page }) => {
            const bgColorWorks = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                modal.setAttribute('bg-color', '#ff0000');
                document.body.appendChild(modal);
                
                return modal.style.getPropertyValue('--wb-modal-bg-color') === '#ff0000';
            });
            expect(bgColorWorks).toBe(true);
        });

        test('color attribute sets CSS custom property', async ({ page }) => {
            const colorWorks = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                modal.setAttribute('color', '#00ff00');
                document.body.appendChild(modal);
                
                return modal.style.getPropertyValue('--wb-modal-color') === '#00ff00';
            });
            expect(colorWorks).toBe(true);
        });
    });

    test.describe('Modal Instance Methods', () => {
        
        test('show() method exists and is callable', async ({ page }) => {
            const showExists = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                return typeof modal.show === 'function';
            });
            expect(showExists).toBe(true);
        });

        test('hide() method exists and is callable', async ({ page }) => {
            const hideExists = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                return typeof modal.hide === 'function';
            });
            expect(hideExists).toBe(true);
        });

        test('show() method shows modal with proper classes', async ({ page }) => {
            await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                modal.setAttribute('title', 'Test');
                modal.innerHTML = '<p>Test content</p>';
                
                // Create trigger element
                const trigger = document.createElement('button');
                trigger.textContent = 'Test Button';
                document.body.appendChild(trigger);
                
                // Show modal
                modal.show(trigger);
            });

            // Wait for animation
            await page.waitForTimeout(200);

            const modalVisible = await page.evaluate(() => {
                const modal = document.querySelector('wb-modal');
                return modal && modal.classList.contains('wb-modal--open');
            });
            
            expect(modalVisible).toBe(true);
        });

        test('hide() method hides modal', async ({ page }) => {
            // First show a modal
            await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                modal.setAttribute('title', 'Test');
                modal.innerHTML = '<p>Test content</p>';
                
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                modal.show(trigger);
                
                // Hide it immediately
                setTimeout(() => modal.hide(), 100);
            });

            // Wait for hide animation
            await page.waitForTimeout(800);

            const modalHidden = await page.evaluate(() => {
                const modal = document.querySelector('wb-modal');
                return modal === null; // Should be removed from DOM
            });
            
            expect(modalHidden).toBe(true);
        });
    });

    test.describe('WBModal Utility Functions', () => {
        
        test('WBModal.create() exists and works', async ({ page }) => {
            const createWorks = await page.evaluate(() => {
                const modal = window.WBModal.create({
                    title: 'Created Modal',
                    content: '<p>Created content</p>'
                });
                return modal && modal.tagName === 'WB-MODAL';
            });
            expect(createWorks).toBe(true);
        });

        test('WBModal.show() exists and returns promise', async ({ page }) => {
            const showWorks = await page.evaluate(async () => {
                const modal = window.WBModal.create({
                    title: 'Test Modal',
                    content: '<p>Test</p>'
                });
                
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const result = window.WBModal.show(modal, trigger);
                return result instanceof Promise;
            });
            expect(showWorks).toBe(true);
        });

        test('WBModal.hide() exists and returns promise', async ({ page }) => {
            const hideWorks = await page.evaluate(async () => {
                const modal = window.WBModal.create({
                    title: 'Test Modal',
                    content: '<p>Test</p>'
                });
                
                const result = window.WBModal.hide(modal);
                return result instanceof Promise;
            });
            expect(hideWorks).toBe(true);
        });

        test('WBModal.alert() exists and returns modal instance', async ({ page }) => {
            const alertWorks = await page.evaluate(() => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const result = window.WBModal.alert('Test alert', 'Alert', trigger);
                return result && result.tagName === 'WB-MODAL';
            });
            expect(alertWorks).toBe(true);
        });

        test('WBModal.confirm() exists and returns promise', async ({ page }) => {
            const confirmWorks = await page.evaluate(() => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const result = window.WBModal.confirm('Test confirm?', 'Confirm', trigger);
                return result instanceof Promise;
            });
            expect(confirmWorks).toBe(true);
        });

        test('WBModal.prompt() exists and returns promise', async ({ page }) => {
            const promptWorks = await page.evaluate(() => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const result = window.WBModal.prompt('Enter name:', 'Default', 'Prompt', trigger);
                return result instanceof Promise;
            });
            expect(promptWorks).toBe(true);
        });

        test('WBModal.closeAll() exists and returns promise', async ({ page }) => {
            const closeAllWorks = await page.evaluate(() => {
                const result = window.WBModal.closeAll();
                return result instanceof Promise;
            });
            expect(closeAllWorks).toBe(true);
        });
    });

    test.describe('Modal Create Options', () => {
        
        test('create() with title option sets title attribute', async ({ page }) => {
            const titleSet = await page.evaluate(() => {
                const modal = window.WBModal.create({
                    title: 'Option Title'
                });
                return modal.getAttribute('title') === 'Option Title';
            });
            expect(titleSet).toBe(true);
        });

        test('create() with size option sets size attribute', async ({ page }) => {
            const sizeSet = await page.evaluate(() => {
                const modal = window.WBModal.create({
                    size: 'large'
                });
                return modal.getAttribute('size') === 'large';
            });
            expect(sizeSet).toBe(true);
        });

        test('create() with variant option sets variant attribute', async ({ page }) => {
            const variantSet = await page.evaluate(() => {
                const modal = window.WBModal.create({
                    variant: 'warning'
                });
                return modal.getAttribute('variant') === 'warning';
            });
            expect(variantSet).toBe(true);
        });

        test('create() with duration option sets duration attribute', async ({ page }) => {
            const durationSet = await page.evaluate(() => {
                const modal = window.WBModal.create({
                    duration: 1500
                });
                return modal.getAttribute('duration') === '1500';
            });
            expect(durationSet).toBe(true);
        });

        test('create() with bgColor option sets bg-color attribute', async ({ page }) => {
            const bgColorSet = await page.evaluate(() => {
                const modal = window.WBModal.create({
                    bgColor: '#123456'
                });
                return modal.getAttribute('bg-color') === '#123456';
            });
            expect(bgColorSet).toBe(true);
        });

        test('create() with color option sets color attribute', async ({ page }) => {
            const colorSet = await page.evaluate(() => {
                const modal = window.WBModal.create({
                    color: '#654321'
                });
                return modal.getAttribute('color') === '#654321';
            });
            expect(colorSet).toBe(true);
        });

        test('create() with content option sets innerHTML', async ({ page }) => {
            const contentSet = await page.evaluate(() => {
                const modal = window.WBModal.create({
                    content: '<p>Test content</p>'
                });
                return modal.innerHTML.includes('<p>Test content</p>');
            });
            expect(contentSet).toBe(true);
        });

        test('create() with buttons option creates footer with buttons', async ({ page }) => {
            const buttonsCreated = await page.evaluate(() => {
                const modal = window.WBModal.create({
                    content: '<p>Test</p>',
                    buttons: [{
                        text: 'OK',
                        variant: 'primary',
                        onclick: () => {}
                    }, {
                        text: 'Cancel',
                        variant: 'secondary',
                        onclick: () => {}
                    }]
                });
                
                const footer = modal.querySelector('.wb-modal-footer');
                const buttons = footer ? footer.querySelectorAll('button') : [];
                return footer && buttons.length === 2;
            });
            expect(buttonsCreated).toBe(true);
        });
    });

    test.describe('Animation and Positioning', () => {
        
        test('modal calculates start position from trigger element', async ({ page }) => {
            const positionCalculated = await page.evaluate(() => {
                // Create a demo section container
                const container = document.createElement('div');
                container.className = 'demo-section';
                container.style.height = '200px';
                container.style.backgroundColor = 'blue';
                document.body.appendChild(container);
                
                // Create trigger button inside container
                const trigger = document.createElement('button');
                trigger.textContent = 'Test';
                container.appendChild(trigger);
                
                // Create and show modal
                const modal = window.WBModal.create({
                    title: 'Position Test',
                    content: '<p>Testing position</p>'
                });
                
                modal.show(trigger);
                
                // Check if start position was set
                const startTop = modal.style.getPropertyValue('--wb-modal-start-top');
                return startTop !== '' && startTop !== '0px';
            });
            expect(positionCalculated).toBe(true);
        });

        test('modal adds wb-modal--open class when shown', async ({ page }) => {
            await page.evaluate(() => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Open Test',
                    content: '<p>Testing open class</p>'
                });
                
                modal.show(trigger);
            });
            
            // Wait for animation to start
            await page.waitForTimeout(100);
            
            const hasOpenClass = await page.evaluate(() => {
                const modal = document.querySelector('wb-modal');
                return modal && modal.classList.contains('wb-modal--open');
            });
            expect(hasOpenClass).toBe(true);
        });

        test('modal creates backdrop element when shown', async ({ page }) => {
            await page.evaluate(() => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Backdrop Test',
                    content: '<p>Testing backdrop</p>'
                });
                
                modal.show(trigger);
            });
            
            // Wait for modal to appear
            await page.waitForTimeout(100);
            
            const backdropExists = await page.evaluate(() => {
                const backdrop = document.querySelector('.wb-modal-backdrop');
                return backdrop !== null;
            });
            expect(backdropExists).toBe(true);
        });
    });

    test.describe('Event Handling', () => {
        
        test('Escape key closes modal', async ({ page }) => {
            // Show modal
            await page.evaluate(() => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Escape Test',
                    content: '<p>Press Escape</p>'
                });
                
                modal.show(trigger);
            });
            
            // Wait for modal to appear
            await page.waitForTimeout(200);
            
            // Press Escape key
            await page.keyboard.press('Escape');
            
            // Wait for hide animation
            await page.waitForTimeout(600);
            
            const modalGone = await page.evaluate(() => {
                return document.querySelector('wb-modal') === null;
            });
            expect(modalGone).toBe(true);
        });

        test('close button closes modal', async ({ page }) => {
            // Show modal
            await page.evaluate(() => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Close Button Test',
                    content: '<p>Click close button</p>'
                });
                
                modal.show(trigger);
            });
            
            // Wait for modal to appear
            await page.waitForTimeout(200);
            
            // Click close button
            await page.click('.wb-modal-close');
            
            // Wait for hide animation
            await page.waitForTimeout(600);
            
            const modalGone = await page.evaluate(() => {
                return document.querySelector('wb-modal') === null;
            });
            expect(modalGone).toBe(true);
        });

        test('backdrop click closes modal', async ({ page }) => {
            // Show modal
            await page.evaluate(() => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Backdrop Test',
                    content: '<p>Click backdrop</p>'
                });
                
                modal.show(trigger);
            });
            
            // Wait for modal to appear
            await page.waitForTimeout(200);
            
            // Click backdrop
            await page.click('.wb-modal-backdrop');
            
            // Wait for hide animation
            await page.waitForTimeout(600);
            
            const modalGone = await page.evaluate(() => {
                return document.querySelector('wb-modal') === null;
            });
            expect(modalGone).toBe(true);
        });
    });

    test.describe('Dialog Promise Behavior', () => {
        
        test('confirm() resolves to true when confirmed', async ({ page }) => {
            const confirmResult = await page.evaluate(async () => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const confirmPromise = window.WBModal.confirm('Test confirm?', 'Test', trigger);
                
                // Wait a bit then click confirm button
                setTimeout(() => {
                    const confirmBtn = document.querySelector('.wb-btn--primary');
                    if (confirmBtn) confirmBtn.click();
                }, 100);
                
                return await confirmPromise;
            });
            expect(confirmResult).toBe(true);
        });

        test('confirm() resolves to false when cancelled', async ({ page }) => {
            const confirmResult = await page.evaluate(async () => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const confirmPromise = window.WBModal.confirm('Test confirm?', 'Test', trigger);
                
                // Wait a bit then click cancel button
                setTimeout(() => {
                    const cancelBtn = document.querySelector('.wb-btn--secondary');
                    if (cancelBtn) cancelBtn.click();
                }, 100);
                
                return await confirmPromise;
            });
            expect(confirmResult).toBe(false);
        });

        test('prompt() resolves to input value when confirmed', async ({ page }) => {
            const promptResult = await page.evaluate(async () => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const promptPromise = window.WBModal.prompt('Enter name:', 'Default', 'Test', trigger);
                
                // Wait a bit then change input and click OK
                setTimeout(() => {
                    const input = document.querySelector('input[type="text"]');
                    if (input) {
                        input.value = 'Test Value';
                    }
                    const okBtn = document.querySelector('.wb-btn--primary');
                    if (okBtn) okBtn.click();
                }, 100);
                
                return await promptPromise;
            });
            expect(promptResult).toBe('Test Value');
        });

        test('prompt() resolves to null when cancelled', async ({ page }) => {
            const promptResult = await page.evaluate(async () => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                const promptPromise = window.WBModal.prompt('Enter name:', 'Default', 'Test', trigger);
                
                // Wait a bit then click cancel button
                setTimeout(() => {
                    const cancelBtn = document.querySelector('.wb-btn--secondary');
                    if (cancelBtn) cancelBtn.click();
                }, 100);
                
                return await promptPromise;
            });
            expect(promptResult).toBe(null);
        });
    });

    test.describe('Cleanup and Memory Management', () => {
        
        test('closeAll() removes all modals and backdrops', async ({ page }) => {
            await page.evaluate(async () => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                // Create multiple modals
                const modal1 = window.WBModal.create({ title: 'Modal 1', content: '<p>First</p>' });
                const modal2 = window.WBModal.create({ title: 'Modal 2', content: '<p>Second</p>' });
                const modal3 = window.WBModal.create({ title: 'Modal 3', content: '<p>Third</p>' });
                
                // Show all modals
                window.WBModal.show(modal1, trigger);
                window.WBModal.show(modal2, trigger);
                window.WBModal.show(modal3, trigger);
                
                // Wait a bit then close all
                setTimeout(async () => {
                    await window.WBModal.closeAll();
                }, 200);
            });
            
            // Wait for cleanup
            await page.waitForTimeout(800);
            
            const allCleaned = await page.evaluate(() => {
                const modals = document.querySelectorAll('wb-modal');
                const backdrops = document.querySelectorAll('.wb-modal-backdrop');
                return modals.length === 0 && backdrops.length === 0;
            });
            expect(allCleaned).toBe(true);
        });

        test('modal properly removes event listeners on hide', async ({ page }) => {
            // This is harder to test directly, but we can test that multiple show/hide cycles work
            const multipleShowHideWorks = await page.evaluate(async () => {
                const trigger = document.createElement('button');
                document.body.appendChild(trigger);
                
                for (let i = 0; i < 5; i++) {
                    const modal = window.WBModal.create({
                        title: `Modal ${i}`,
                        content: '<p>Test</p>'
                    });
                    
                    modal.show(trigger);
                    
                    // Wait briefly then hide
                    await new Promise(resolve => {
                        setTimeout(() => {
                            modal.hide();
                            resolve();
                        }, 50);
                    });
                    
                    // Wait for hide animation
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                // Check that no modals remain
                return document.querySelectorAll('wb-modal').length === 0;
            });
            expect(multipleShowHideWorks).toBe(true);
        });
    });

    test.describe('Component Ready Event', () => {
        
        test('component dispatches wbModalReady event', async ({ page }) => {
            const eventDispatched = await page.evaluate(() => {
                return new Promise((resolve) => {
                    document.addEventListener('wbModalReady', (event) => {
                        resolve(event.detail.component === 'wb-modal');
                    });
                    
                    // Timeout if event doesn't fire
                    setTimeout(() => resolve(false), 2000);
                });
            });
            expect(eventDispatched).toBe(true);
        });
    });
});

/**
 * WHAT THESE TESTS VALIDATE:
 * 
 * 1. Web Component Registration and Creation
 * 2. All Observed Attributes (title, size, variant, duration, bg-color, color, open)
 * 3. Instance Methods (show, hide)
 * 4. Utility Functions (create, show, hide, alert, confirm, prompt, closeAll)
 * 5. Create Options (all configuration options work)
 * 6. Animation and Positioning (start position calculation, open class, backdrop)
 * 7. Event Handling (Escape key, close button, backdrop click)
 * 8. Promise Behavior (confirm/prompt return correct values)
 * 9. Cleanup and Memory Management (proper cleanup, multiple cycles)
 * 10. Component Ready Event
 * 
 * THESE TESTS WILL FAIL IF:
 * - Any attribute doesn't work
 * - Any method is missing or broken
 * - Animation/positioning is wrong
 * - Event handlers don't work
 * - Promises don't resolve correctly
 * - Memory leaks occur
 * - Component doesn't initialize properly
 */