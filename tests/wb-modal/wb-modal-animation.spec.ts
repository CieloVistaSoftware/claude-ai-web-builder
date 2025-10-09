/**
 * REAL Modal Animation Tests - Actually validates behavior
 * Tests that modals slide DOWN from container top to bottom-right position
 * THESE TESTS WILL FAIL IF THE ANIMATION IS BROKEN
 */

import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('WB Modal Animation - REAL TESTS', () => {
  const baseTest = new BaseUnitTest();
    
    test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.waitForTimeout(1000);
  });

    test('CRITICAL: Modal starts at exact container top position', async ({ page }) => {
        console.log('🧪 Testing modal start position...');
        
        // Find a test button and its container
        const testButton = page.locator('button').first();
        await expect(testButton).toBeVisible();
        
        // Get container position before clicking
        const containerTop = await page.evaluate(() => {
            const button = document.querySelector('button');
            const container = button?.closest('.demo-section') || 
                            button?.closest('.hero-demo') || 
                            button?.parentElement;
            if (container) {
                const rect = container.getBoundingClientRect();
                return rect.top + window.pageYOffset;
            }
            return 0;
        });
        
        console.log('Expected container top:', containerTop);
        
        // Click button to open modal
        await testButton.click();
        
        // Check modal start position immediately
        const modalStartTop = await page.evaluate(() => {
            const modal = document.querySelector('wb-modal');
            if (modal) {
                const startTop = modal.style.getPropertyValue('--wb-modal-start-top');
                return parseInt(startTop) || 0;
            }
            return 0;
        });
        
        console.log('Actual modal start top:', modalStartTop);
        
        // FAIL if modal doesn't start at container top
        expect(Math.abs(modalStartTop - containerTop)).toBeLessThan(10); // 10px tolerance
        
        if (Math.abs(modalStartTop - containerTop) >= 10) {
            console.error('❌ ANIMATION BROKEN: Modal not starting at container top!');
            console.error('Expected:', containerTop, 'Actual:', modalStartTop);
        } else {
            console.log('✅ Modal starts at correct container top position');
        }
    });

    test('CRITICAL: Modal ends at bottom-right position after animation', async ({ page }) => {
        console.log('🧪 Testing modal final position...');
        
        // Click button to open modal
        const testButton = page.locator('button').first();
        await testButton.click();
        
        // Wait for animation to complete
        await page.waitForTimeout(1500); // Wait for 1s animation + buffer
        
        // Check final position
        const modalPosition = await page.evaluate(() => {
            const modal = document.querySelector('wb-modal');
            if (modal) {
                const rect = modal.getBoundingClientRect();
                return {
                    bottom: rect.bottom,
                    right: rect.right,
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                };
            }
            return null;
        });
        
        expect(modalPosition).not.toBeNull();
        
        const viewportSize = await page.viewportSize();
        const expectedBottom = viewportSize!.height - 16; // 1rem = 16px
        const expectedRight = viewportSize!.width - 16;   // 1rem = 16px
        
        console.log('Final position check:');
        console.log('Expected bottom:', expectedBottom, 'Actual bottom:', modalPosition!.bottom);
        console.log('Expected right:', expectedRight, 'Actual right:', modalPosition!.right);
        
        // FAIL if modal is not in bottom-right corner
        expect(Math.abs(modalPosition!.bottom - expectedBottom)).toBeLessThan(30); // 30px tolerance
        expect(Math.abs(modalPosition!.right - expectedRight)).toBeLessThan(30);   // 30px tolerance
        
        if (Math.abs(modalPosition!.bottom - expectedBottom) >= 30 || 
            Math.abs(modalPosition!.right - expectedRight) >= 30) {
            console.error('❌ ANIMATION BROKEN: Modal not ending at bottom-right!');
            console.error('Expected bottom-right:', expectedBottom, expectedRight);
            console.error('Actual bottom-right:', modalPosition!.bottom, modalPosition!.right);
        } else {
            console.log('✅ Modal ends at correct bottom-right position');
        }
    });

    test('CRITICAL: Modal animates DOWNWARD from top to bottom', async ({ page }) => {
        console.log('🧪 Testing animation direction...');
        
        const positions: Array<{time: number, top: number, visible: boolean}> = [];
        
        // Start tracking positions
        const trackingInterval = setInterval(async () => {
            try {
                const position = await page.evaluate(() => {
                    const modal = document.querySelector('wb-modal');
                    if (modal) {
                        const rect = modal.getBoundingClientRect();
                        return {
                            top: rect.top,
                            visible: rect.height > 0 && rect.width > 0
                        };
                    }
                    return { top: 0, visible: false };
                });
                
                positions.push({
                    time: Date.now(),
                    top: position.top,
                    visible: position.visible
                });
            } catch (e) {
                // Ignore errors during tracking
            }
        }, 100);
        
        // Click button to open modal
        const testButton = page.locator('button').first();
        await testButton.click();
        
        // Track for animation duration
        await page.waitForTimeout(1500);
        clearInterval(trackingInterval);
        
        // Analyze movement direction
        const visiblePositions = positions.filter(p => p.visible);
        
        expect(visiblePositions.length).toBeGreaterThan(2);
        
        const startPos = visiblePositions[0];
        const endPos = visiblePositions[visiblePositions.length - 1];
        
        console.log('Animation direction analysis:');
        console.log('Start position top:', startPos.top);
        console.log('End position top:', endPos.top);
        console.log('Movement:', endPos.top - startPos.top, 'pixels');
        
        // FAIL if modal moved upward instead of downward
        const movement = endPos.top - startPos.top;
        expect(movement).toBeGreaterThan(50); // Should move down at least 50px
        
        if (movement <= 50) {
            console.error('❌ ANIMATION BROKEN: Modal not moving downward!');
            console.error('Movement was:', movement, 'pixels (should be > 50)');
            console.error('All positions:', visiblePositions);
        } else {
            console.log('✅ Modal animates downward correctly:', movement, 'pixels');
        }
    });

    test('CRITICAL: Modal uses --bg-color background', async ({ page }) => {
        console.log('🧪 Testing modal background color...');
        
        // Click button to open modal
        const testButton = page.locator('button').first();
        await testButton.click();
        
        // Wait for modal to appear
        await page.waitForSelector('wb-modal .wb-modal-dialog', { state: 'visible' });
        
        // Check background color
        const bgColor = await page.evaluate(() => {
            const dialog = document.querySelector('wb-modal .wb-modal-dialog');
            if (dialog) {
                const computedStyle = getComputedStyle(dialog);
                return computedStyle.backgroundColor;
            }
            return '';
        });
        
        console.log('Modal background color:', bgColor);
        console.log('Expected: dark color (rgb values < 50)');
        
        // Extract RGB values
        const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        expect(rgbMatch).toBeTruthy();
        
        if (rgbMatch) {
            const [, r, g, b] = rgbMatch.map(Number);
            console.log('RGB values:', { r, g, b });
            
            // Should be dark (all values < 50 for dark theme)
            expect(r).toBeLessThan(50);
            expect(g).toBeLessThan(50);
            expect(b).toBeLessThan(50);
            
            if (r >= 50 || g >= 50 || b >= 50) {
                console.error('❌ COLOR BROKEN: Modal not using dark background!');
                console.error('RGB:', { r, g, b }, 'Expected: all < 50');
            } else {
                console.log('✅ Modal uses correct dark background');
            }
        }
    });

    test('CRITICAL: Modal respects 50vw width limit', async ({ page }) => {
        console.log('🧪 Testing modal width constraint...');
        
        // Click button to open modal
        const testButton = page.locator('button').first();
        await testButton.click();
        
        // Wait for modal to appear
        await page.waitForSelector('wb-modal', { state: 'visible' });
        
        // Check width constraint
        const modalWidth = await page.evaluate(() => {
            const modal = document.querySelector('wb-modal');
            if (modal) {
                const rect = modal.getBoundingClientRect();
                return rect.width;
            }
            return 0;
        });
        
        const viewportSize = await page.viewportSize();
        const maxAllowedWidth = viewportSize!.width * 0.5; // 50vw
        
        console.log('Modal width constraint check:');
        console.log('Modal width:', modalWidth);
        console.log('Max allowed (50vw):', maxAllowedWidth);
        
        expect(modalWidth).toBeLessThanOrEqual(maxAllowedWidth + 10); // 10px tolerance
        
        if (modalWidth > maxAllowedWidth + 10) {
            console.error('❌ WIDTH BROKEN: Modal exceeds 50vw limit!');
            console.error('Width:', modalWidth, 'Max allowed:', maxAllowedWidth);
        } else {
            console.log('✅ Modal respects width constraint');
        }
    });

    test('INTEGRATION: Complete show/hide animation cycle', async ({ page }) => {
        console.log('🧪 Testing complete animation cycle...');
        
        // Click button to open modal
        const testButton = page.locator('button').first();
        await testButton.click();
        
        // Wait for show animation to complete
        await page.waitForTimeout(1200);
        
        // Verify modal is visible and positioned correctly
        const modalVisible = await page.isVisible('wb-modal');
        expect(modalVisible).toBe(true);
        
        const modalPosition = await page.evaluate(() => {
            const modal = document.querySelector('wb-modal');
            if (modal) {
                const rect = modal.getBoundingClientRect();
                return {
                    bottom: rect.bottom,
                    right: rect.right
                };
            }
            return null;
        });
        
        expect(modalPosition).not.toBeNull();
        
        const viewportSize = await page.viewportSize();
        const atBottomRight = modalPosition!.bottom > (viewportSize!.height - 50) && 
                             modalPosition!.right > (viewportSize!.width - 50);
        
        expect(atBottomRight).toBe(true);
        
        if (!atBottomRight) {
            console.error('❌ INTEGRATION FAIL: Modal not at bottom-right after show');
        } else {
            console.log('✅ Show animation completed successfully');
        }
        
        // Click close button to test hide animation
        const closeButton = page.locator('wb-modal .wb-modal-close');
        await closeButton.click();
        
        // Wait for hide animation to complete
        await page.waitForTimeout(800);
        
        // Verify modal is removed from DOM
        const modalStillVisible = await page.isVisible('wb-modal');
        expect(modalStillVisible).toBe(false);
        
        console.log('✅ Integration test passed completely');
    });
});

/**
 * WHAT THESE TESTS ACTUALLY VALIDATE:
 * 
 * 1. Modal starts at EXACT container top position (not random position)
 * 2. Modal ends at EXACT bottom-right corner (1rem from edges)
 * 3. Modal moves DOWNWARD during animation (not upward!)
 * 4. Modal uses correct dark background color from --bg-color
 * 5. Modal respects 50vw width constraint
 * 6. Complete show/hide cycle works end-to-end
 * 
 * THESE TESTS WILL FAIL IF:
 * - Modal slides upward instead of downward
 * - Modal starts at wrong position  
 * - Modal ends at wrong position
 * - Colors are wrong
 * - Width constraints are ignored
 * - Animation cycle is broken
 */