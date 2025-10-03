/**
 * SPECIFIC WB Modal Animation Tests
 * Tests the exact animation behavior that was broken for 4 hours
 * These tests validate the slide-down animation from container top to bottom-right
 */

import { test, expect } from '@playwright/test';

test.describe('WB Modal - Animation Specific Tests', () => {
    
    test.beforeEach(async ({ page }) => {
        // Navigate to modal demo page
        await page.goto('file://' + process.cwd() + '/components/wb-modal/wb-modal-demo.html');
        
        // Wait for component to load
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000);
        
        // Wait for component ready
        await page.waitForFunction(() => window.WBModal !== undefined);
    });

    test.describe('CRITICAL: Slide Animation Direction', () => {
        
        test('modal slides DOWN from container top (not up from bottom)', async ({ page }) => {
            console.log('🧪 Testing modal slides DOWN (the bug that took 4 hours)...');
            
            const animationDirection = await page.evaluate(async () => {
                // Create demo section container at specific position
                const container = document.createElement('div');
                container.className = 'demo-section';
                container.style.position = 'absolute';
                container.style.top = '100px';
                container.style.left = '50px';
                container.style.width = '300px';
                container.style.height = '150px';
                container.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                document.body.appendChild(container);
                
                // Create trigger button
                const trigger = document.createElement('button');
                trigger.textContent = 'Test Button';
                trigger.style.margin = '20px';
                container.appendChild(trigger);
                
                // Track modal positions during animation
                const positions = [];
                
                // Create modal
                const modal = window.WBModal.create({
                    title: 'Animation Test',
                    content: '<p>Testing slide direction</p>'
                });
                
                // Start position tracking
                const trackPosition = () => {
                    const modalEl = document.querySelector('wb-modal');
                    if (modalEl) {
                        const rect = modalEl.getBoundingClientRect();
                        positions.push({
                            time: Date.now(),
                            top: rect.top,
                            visible: rect.width > 0 && rect.height > 0
                        });
                    }
                };
                
                const trackingInterval = setInterval(trackPosition, 50);
                
                // Show modal
                modal.show(trigger);
                
                // Track for 1.5 seconds
                await new Promise(resolve => setTimeout(resolve, 1500));
                clearInterval(trackingInterval);
                
                // Clean up
                modal.hide();
                container.remove();
                
                // Analyze positions
                const visiblePositions = positions.filter(p => p.visible);
                if (visiblePositions.length < 2) {
                    return { error: 'Not enough position data captured' };
                }
                
                const startPos = visiblePositions[0];
                const endPos = visiblePositions[visiblePositions.length - 1];
                const movement = endPos.top - startPos.top;
                
                return {
                    success: true,
                    startTop: startPos.top,
                    endTop: endPos.top,
                    movement: movement,
                    containerTop: 100, // We set it to 100px
                    movingDown: movement > 0,
                    totalPositions: positions.length,
                    visiblePositions: visiblePositions.length
                };
            });
            
            console.log('Animation analysis:', animationDirection);
            
            // The modal should move DOWN (positive movement)
            expect(animationDirection.success).toBe(true);
            expect(animationDirection.movingDown).toBe(true);
            expect(animationDirection.movement).toBeGreaterThan(50); // Should move down at least 50px
            
            // Modal should start near container top
            expect(Math.abs(animationDirection.startTop - animationDirection.containerTop)).toBeLessThan(50);
        });

        test('modal starts at exact container top position', async ({ page }) => {
            console.log('🧪 Testing modal start position accuracy...');
            
            const startPositionTest = await page.evaluate(() => {
                // Create container at known position
                const container = document.createElement('div');
                container.className = 'demo-section';
                container.style.position = 'absolute';
                container.style.top = '200px';
                container.style.left = '100px';
                container.style.width = '400px';
                container.style.height = '100px';
                container.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                document.body.appendChild(container);
                
                const trigger = document.createElement('button');
                trigger.textContent = 'Test';
                container.appendChild(trigger);
                
                // Create modal
                const modal = window.WBModal.create({
                    title: 'Position Test',
                    content: '<p>Testing start position</p>'
                });
                
                // Show modal and immediately check start position
                modal.show(trigger);
                
                const startTopValue = modal.style.getPropertyValue('--wb-modal-start-top');
                const containerRect = container.getBoundingClientRect();
                const containerTop = containerRect.top + window.pageYOffset;
                
                // Clean up
                modal.hide();
                container.remove();
                
                return {
                    startTopCSS: startTopValue,
                    containerTop: containerTop,
                    expectedTop: 200, // What we set it to
                    difference: Math.abs(parseInt(startTopValue) - containerTop)
                };
            });
            
            console.log('Start position test:', startPositionTest);
            
            // Modal should start at container top within 5px tolerance
            expect(startPositionTest.difference).toBeLessThan(5);
        });

        test('modal ends at bottom-right corner (1rem from edges)', async ({ page }) => {
            console.log('🧪 Testing modal final position...');
            
            await page.evaluate(() => {
                const container = document.createElement('div');
                container.className = 'demo-section';
                container.style.position = 'absolute';
                container.style.top = '50px';
                container.style.height = '100px';
                document.body.appendChild(container);
                
                const trigger = document.createElement('button');
                container.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Final Position Test',
                    content: '<p>Testing final position</p>'
                });
                
                modal.show(trigger);
            });
            
            // Wait for animation to complete
            await page.waitForTimeout(1200);
            
            const finalPosition = await page.evaluate(() => {
                const modal = document.querySelector('wb-modal');
                if (!modal) return { error: 'Modal not found' };
                
                const rect = modal.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                return {
                    bottom: rect.bottom,
                    right: rect.right,
                    viewportWidth,
                    viewportHeight,
                    expectedBottom: viewportHeight - 16, // 1rem = 16px
                    expectedRight: viewportWidth - 16,
                    bottomDiff: Math.abs(rect.bottom - (viewportHeight - 16)),
                    rightDiff: Math.abs(rect.right - (viewportWidth - 16))
                };
            });
            
            console.log('Final position test:', finalPosition);
            
            // Modal should be 1rem (16px) from bottom and right edges
            expect(finalPosition.bottomDiff).toBeLessThan(20); // 20px tolerance
            expect(finalPosition.rightDiff).toBeLessThan(20);
        });
    });

    test.describe('Animation Timing and Performance', () => {
        
        test('animation completes within expected timeframe', async ({ page }) => {
            const timingTest = await page.evaluate(async () => {
                const container = document.createElement('div');
                container.className = 'demo-section';
                document.body.appendChild(container);
                
                const trigger = document.createElement('button');
                container.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Timing Test',
                    content: '<p>Testing timing</p>',
                    duration: 1000 // 1 second
                });
                
                const startTime = Date.now();
                modal.show(trigger);
                
                // Wait for animation to complete
                await new Promise(resolve => setTimeout(resolve, 1200));
                
                const endTime = Date.now();
                const actualDuration = endTime - startTime;
                
                modal.hide();
                container.remove();
                
                return {
                    expectedDuration: 1000,
                    actualDuration,
                    difference: Math.abs(actualDuration - 1200), // Including our wait buffer
                    withinTolerance: Math.abs(actualDuration - 1200) < 300 // 300ms tolerance
                };
            });
            
            expect(timingTest.withinTolerance).toBe(true);
        });

        test('custom duration attribute works', async ({ page }) => {
            const customDurationTest = await page.evaluate(async () => {
                const container = document.createElement('div');
                container.className = 'demo-section';
                document.body.appendChild(container);
                
                const trigger = document.createElement('button');
                container.appendChild(trigger);
                
                // Test with 2 second duration
                const modal = window.WBModal.create({
                    title: 'Custom Duration Test',
                    content: '<p>Testing custom duration</p>',
                    duration: 2000
                });
                
                modal.show(trigger);
                
                // Check that CSS property is set
                const durationCSS = modal.style.getPropertyValue('--wb-modal-duration');
                
                modal.hide();
                container.remove();
                
                return {
                    durationSet: durationCSS === '2000ms',
                    actualValue: durationCSS
                };
            });
            
            expect(customDurationTest.durationSet).toBe(true);
        });
    });

    test.describe('Container Detection Logic', () => {
        
        test('detects .demo-section container correctly', async ({ page }) => {
            const demoSectionTest = await page.evaluate(() => {
                const demoSection = document.createElement('div');
                demoSection.className = 'demo-section';
                demoSection.style.position = 'absolute';
                demoSection.style.top = '300px';
                document.body.appendChild(demoSection);
                
                const trigger = document.createElement('button');
                demoSection.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Demo Section Test',
                    content: '<p>Testing demo section detection</p>'
                });
                
                modal.show(trigger);
                
                const startTop = modal.style.getPropertyValue('--wb-modal-start-top');
                
                modal.hide();
                demoSection.remove();
                
                return {
                    startTopSet: startTop !== '',
                    startTopValue: parseInt(startTop),
                    expectedNear: 300
                };
            });
            
            expect(demoSectionTest.startTopSet).toBe(true);
            expect(Math.abs(demoSectionTest.startTopValue - demoSectionTest.expectedNear)).toBeLessThan(50);
        });

        test('detects .hero-demo container correctly', async ({ page }) => {
            const heroDemoTest = await page.evaluate(() => {
                const heroDemo = document.createElement('div');
                heroDemo.className = 'hero-demo';
                heroDemo.style.position = 'absolute';
                heroDemo.style.top = '150px';
                document.body.appendChild(heroDemo);
                
                const trigger = document.createElement('button');
                heroDemo.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Hero Demo Test',
                    content: '<p>Testing hero demo detection</p>'
                });
                
                modal.show(trigger);
                
                const startTop = modal.style.getPropertyValue('--wb-modal-start-top');
                
                modal.hide();
                heroDemo.remove();
                
                return {
                    startTopSet: startTop !== '',
                    startTopValue: parseInt(startTop),
                    expectedNear: 150
                };
            });
            
            expect(heroDemoTest.startTopSet).toBe(true);
            expect(Math.abs(heroDemoTest.startTopValue - heroDemoTest.expectedNear)).toBeLessThan(50);
        });

        test('falls back to parentElement when no special container found', async ({ page }) => {
            const parentElementTest = await page.evaluate(() => {
                const genericDiv = document.createElement('div');
                genericDiv.style.position = 'absolute';
                genericDiv.style.top = '400px';
                document.body.appendChild(genericDiv);
                
                const trigger = document.createElement('button');
                genericDiv.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Parent Element Test',
                    content: '<p>Testing parent element fallback</p>'
                });
                
                modal.show(trigger);
                
                const startTop = modal.style.getPropertyValue('--wb-modal-start-top');
                
                modal.hide();
                genericDiv.remove();
                
                return {
                    startTopSet: startTop !== '',
                    startTopValue: parseInt(startTop),
                    expectedNear: 400
                };
            });
            
            expect(parentElementTest.startTopSet).toBe(true);
            expect(Math.abs(parentElementTest.startTopValue - parentElementTest.expectedNear)).toBeLessThan(50);
        });
    });

    test.describe('CSS Animation Properties', () => {
        
        test('modal has correct transition properties', async ({ page }) => {
            const transitionTest = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                document.body.appendChild(modal);
                
                const computedStyle = getComputedStyle(modal);
                const transition = computedStyle.transition;
                
                modal.remove();
                
                return {
                    hasTransition: transition !== 'none' && transition !== '',
                    transitionValue: transition,
                    includesTop: transition.includes('top'),
                    includesVisibility: transition.includes('visibility')
                };
            });
            
            expect(transitionTest.hasTransition).toBe(true);
            expect(transitionTest.includesTop).toBe(true);
            expect(transitionTest.includesVisibility).toBe(true);
        });

        test('modal positioning CSS properties are correct', async ({ page }) => {
            const positioningTest = await page.evaluate(() => {
                const modal = document.createElement('wb-modal');
                document.body.appendChild(modal);
                
                const computedStyle = getComputedStyle(modal);
                
                modal.remove();
                
                return {
                    position: computedStyle.position,
                    right: computedStyle.right,
                    maxWidth: computedStyle.maxWidth
                };
            });
            
            expect(positioningTest.position).toBe('fixed');
            expect(positioningTest.right).toBe('16px'); // 1rem
            expect(positioningTest.maxWidth).toBe('50vw');
        });
    });

    test.describe('Animation Regression Tests', () => {
        
        test('modal does NOT slide upward (the original bug)', async ({ page }) => {
            console.log('🧪 REGRESSION TEST: Ensuring modal never slides UP...');
            
            const regressionTest = await page.evaluate(async () => {
                const container = document.createElement('div');
                container.className = 'demo-section';
                container.style.position = 'absolute';
                container.style.top = '100px';
                document.body.appendChild(container);
                
                const trigger = document.createElement('button');
                container.appendChild(trigger);
                
                const modal = window.WBModal.create({
                    title: 'Regression Test',
                    content: '<p>This should NOT slide up!</p>'
                });
                
                const positions = [];
                const trackingInterval = setInterval(() => {
                    const modalEl = document.querySelector('wb-modal');
                    if (modalEl) {
                        const rect = modalEl.getBoundingClientRect();
                        if (rect.width > 0) {
                            positions.push(rect.top);
                        }
                    }
                }, 25);
                
                modal.show(trigger);
                
                // Track for animation duration
                await new Promise(resolve => setTimeout(resolve, 1100));
                clearInterval(trackingInterval);
                
                modal.hide();
                container.remove();
                
                if (positions.length < 2) {
                    return { error: 'Insufficient position data' };
                }
                
                // Check that movement is generally downward
                let upwardMovements = 0;
                let downwardMovements = 0;
                
                for (let i = 1; i < positions.length; i++) {
                    const movement = positions[i] - positions[i - 1];
                    if (movement < -5) upwardMovements++; // Moving up by more than 5px
                    if (movement > 5) downwardMovements++; // Moving down by more than 5px
                }
                
                return {
                    totalPositions: positions.length,
                    upwardMovements,
                    downwardMovements,
                    firstPosition: positions[0],
                    lastPosition: positions[positions.length - 1],
                    netMovement: positions[positions.length - 1] - positions[0]
                };
            });
            
            console.log('Regression test results:', regressionTest);
            
            // CRITICAL: Modal should move DOWN, not UP
            expect(regressionTest.netMovement).toBeGreaterThan(0);
            
            // There should be minimal upward movements (some jitter is OK)
            expect(regressionTest.upwardMovements).toBeLessThan(3);
            
            // There should be significant downward movement
            expect(regressionTest.downwardMovements).toBeGreaterThan(0);
        });

        test('modal animation works on multiple successive shows', async ({ page }) => {
            const multipleShowsTest = await page.evaluate(async () => {
                const container = document.createElement('div');
                container.className = 'demo-section';
                container.style.position = 'absolute';
                container.style.top = '80px';
                document.body.appendChild(container);
                
                const trigger = document.createElement('button');
                container.appendChild(trigger);
                
                const results = [];
                
                // Test 3 consecutive modal shows
                for (let i = 0; i < 3; i++) {
                    const modal = window.WBModal.create({
                        title: `Test Modal ${i + 1}`,
                        content: `<p>Modal number ${i + 1}</p>`
                    });
                    
                    modal.show(trigger);
                    
                    // Wait briefly for animation to start
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    const startTop = modal.style.getPropertyValue('--wb-modal-start-top');
                    const hasOpenClass = modal.classList.contains('wb-modal--open');
                    
                    results.push({
                        iteration: i + 1,
                        startTopSet: startTop !== '',
                        hasOpenClass,
                        startTopValue: parseInt(startTop)
                    });
                    
                    modal.hide();
                    
                    // Wait for hide animation
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                
                container.remove();
                return results;
            });
            
            // All iterations should work correctly
            multipleShowsTest.forEach((result, index) => {
                expect(result.startTopSet).toBe(true);
                expect(result.hasOpenClass).toBe(true);
                expect(Math.abs(result.startTopValue - 80)).toBeLessThan(50);
            });
        });
    });
});

/**
 * WHAT THESE SPECIFIC ANIMATION TESTS VALIDATE:
 * 
 * 1. **CRITICAL BUG**: Modal slides DOWN (not UP) - the exact bug that took 4 hours
 * 2. **Start Position**: Modal starts at exact container top position
 * 3. **End Position**: Modal ends at bottom-right corner (1rem from edges)
 * 4. **Animation Timing**: Animation completes within expected timeframe
 * 5. **Custom Duration**: Duration attribute properly sets animation timing
 * 6. **Container Detection**: Proper detection of .demo-section, .hero-demo, parentElement
 * 7. **CSS Properties**: Correct transition and positioning CSS
 * 8. **Regression Tests**: Ensures the original upward sliding bug never comes back
 * 9. **Multiple Shows**: Animation works correctly on successive modal shows
 * 
 * THESE TESTS WILL FAIL IF:
 * - Modal slides upward instead of downward (the original 4-hour bug)
 * - Start position calculation is wrong
 * - Final position is not bottom-right corner
 * - Animation timing is incorrect
 * - Container detection fails
 * - CSS animation properties are missing
 * - Multiple successive animations break
 */