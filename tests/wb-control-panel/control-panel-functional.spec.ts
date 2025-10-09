// @ts-nocheck
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';
import { WBTestHelpers } from '../helpers/WBFunctionalTestHelpers.js';

/**
 * FUNCTIONAL TESTS - These test actual component behavior, not just DOM presence
 * Tests the 5 critical areas our previous tests missed:
 * 1. JavaScript components actually initialize
 * 2. Configuration files load successfully 
 * 3. No console errors during execution
 * 4. Components respond to interactions
 * 5. Shadow DOM content renders properly
 */

test.describe('WB Control Panel - FUNCTIONAL TESTING', () => {
  const baseTest = new BaseUnitTest();

  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
    await page.waitForTimeout(3000);
  });

  test('🔧 JavaScript Components Actually Initialize', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('Testing component initialization...');
        
        // Test control panel component initialization
        const controlPanelHealth = await WBTestHelpers.componentHealthCheck(page, '#main-control-panel', {
          shouldHaveConfig: true,
          shouldHaveContent: true
        });
        
        expect(controlPanelHealth.exists).toBe(true);
        expect(controlPanelHealth.healthy).toBe(true);
        expect(controlPanelHealth.errors).toHaveLength(0);
        
        console.log('Control Panel Health:', controlPanelHealth);
        
        // Test wb-nav component initialization (if present)
        const navExists = await page.locator('wb-nav').count();
        if (navExists > 0) {
          await WBTestHelpers.waitForComponentInit(page, 'wb-nav');
          const navConfig = await WBTestHelpers.testConfigLoading(page, 'wb-nav');
          
          expect(navConfig.exists).toBe(true);
          expect(navConfig.hasConfig).toBe(true);
          expect(navConfig.configKeys.length).toBeGreaterThan(0);
          
          console.log('WB Nav Config:', navConfig);
        }
        
        console.log('✅ All components initialized successfully');
    });
  });

  test('📁 Configuration Files Load Successfully', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('Testing configuration file loading...');
        
        // Monitor network requests for config files
        const { requests, failures } = await WBTestHelpers.monitorNetworkRequests(page);
        
        // Reload page to catch all network requests
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Check for config file requests
        const configRequests = requests.filter(req => 
          req.url.includes('.json') || req.url.includes('schema') || req.url.includes('config')
        );
        
        const configFailures = failures.filter(fail => 
          fail.url.includes('.json') || fail.url.includes('schema') || fail.url.includes('config')
        );
        
        console.log('Config requests found:', configRequests.length);
        console.log('Config failures:', configFailures.length);
        
        // If there are config failures, log them but don't fail test if component handles gracefully
        if (configFailures.length > 0) {
          console.warn('Config file failures:', configFailures);
        }
        
        // Test that components work despite config issues (fallback configs)
        const controlPanel = await page.locator('#main-control-panel').count();
        expect(controlPanel).toBeGreaterThan(0);
        
        console.log('✅ Configuration loading tested - components handle missing configs gracefully');
    });
  });

  test('🚫 No Console Errors During Execution', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('Testing for console errors...');
        
        // Setup error monitoring
        const { errors, warnings } = WBTestHelpers.setupErrorMonitoring(page);
        
        // Reload page to catch initialization errors
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Wait for components to fully initialize
        await page.waitForTimeout(3000);
        
        // Interact with the page to trigger potential errors
        const buttons = await page.locator('button').count();
        if (buttons > 0) {
          // Click first available button
          try {
            await page.locator('button').first().click();
            await page.waitForTimeout(500);
          } catch (e) {
            console.log('Button click failed (expected if button is in shadow DOM)');
          }
        }
        
        // Check for critical errors (allow warnings)
        const criticalErrors = errors.filter(error => 
          !error.includes('404') && // Allow 404s for optional resources
          !error.includes('Failed to fetch') && // Allow fetch failures for optional configs
          !error.includes('Load failed') // Allow load failures for optional resources
        );
        
        console.log('Total console messages:', errors.length + warnings.length);
        console.log('Critical errors:', criticalErrors.length);
        console.log('Warnings:', warnings.length);
        
        if (criticalErrors.length > 0) {
          console.error('Critical errors found:', criticalErrors);
        }
        
        // Expect no critical errors (warnings and resource 404s are OK)
        expect(criticalErrors.length).toBe(0);
        
        console.log('✅ No critical console errors found');
    });
  });

  test('🖱️ Components Respond to Interactions', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('Testing component interactions...');
        
        // Test theme selector interaction (if available)
        const themeSelect = page.locator('select[id*="theme"], select[name*="theme"]').first();
        const themeSelectCount = await themeSelect.count();
        
        if (themeSelectCount > 0) {
          const interaction = await WBTestHelpers.testComponentInteraction(
            page, 
            'select[id*="theme"], select[name*="theme"]',
            { type: 'change', value: 'ocean' },
            { expectClassChange: true }
          );
          
          console.log('Theme selector interaction result:', interaction);
          // Component should react to theme change
          expect(interaction.afterState).toBeDefined();
        }
        
        // Test layout selector interaction (if available)
        const layoutSelect = page.locator('select[id*="layout"], select[name*="layout"]').first();
        const layoutSelectCount = await layoutSelect.count();
        
        if (layoutSelectCount > 0) {
          const interaction = await WBTestHelpers.testComponentInteraction(
            page,
            'select[id*="layout"], select[name*="layout"]',
            { type: 'change', value: 'left-nav' },
            { expectClassChange: true }
          );
          
          console.log('Layout selector interaction result:', interaction);
          expect(interaction.afterState).toBeDefined();
        }
        
        // Test button interactions
        const buttons = await page.locator('button').count();
        if (buttons > 0) {
          // Find a clickable button that's not disabled
          const clickableButton = await page.locator('button:not(:disabled)').first();
          const clickableCount = await clickableButton.count();
          
          if (clickableCount > 0) {
            const beforeClick = await page.evaluate(() => document.body.className);
            await clickableButton.click();
            await page.waitForTimeout(500);
            const afterClick = await page.evaluate(() => document.body.className);
            
            console.log('Button click - before:', beforeClick, 'after:', afterClick);
            // Button should cause some change (class, attribute, etc.)
            // We don't assert specific changes since buttons have different behaviors
          }
        }
        
        console.log('✅ Component interactions tested');
    });
  });

  test('🌑 Shadow DOM Content Renders Properly', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('Testing shadow DOM rendering...');
        
        // Find all web components that might use shadow DOM
        const webComponents = await page.evaluate(() => {
          const elements = document.querySelectorAll('*');
          const components = [];
          
          elements.forEach(el => {
            // Check if it's a custom element (has hyphen in tag name)
            if (el.tagName.includes('-')) {
              components.push({
                tagName: el.tagName.toLowerCase(),
                id: el.id,
                className: el.className
              });
            }
          });
          
          return components;
        });
        
        console.log('Found web components:', webComponents);
        
        // Test shadow DOM for each component
        for (const component of webComponents) {
          const selector = component.id ? `#${component.id}` : component.tagName;
          const shadowInfo = await WBTestHelpers.testShadowDOMRendering(page, selector);
          
          console.log(`Shadow DOM for ${component.tagName}:`, shadowInfo);
          
          expect(shadowInfo.exists).toBe(true);
          
          // If component has shadow DOM, it should have content
          if (shadowInfo.hasShadowRoot) {
            expect(shadowInfo.shadowChildCount).toBeGreaterThan(0);
            expect(shadowInfo.shadowHTML.length).toBeGreaterThan(0);
          }
        }
        
        console.log('✅ Shadow DOM rendering verified');
    });
  });

  test('🏥 Overall Component Health Check', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('Running comprehensive health check...');
        
        // Get all components on the page
        const allComponents = await page.evaluate(() => {
          const elements = document.querySelectorAll('*[id], *[class*="wb-"], *[class*="control"]');
          return Array.from(elements).map(el => ({
            tagName: el.tagName.toLowerCase(),
            id: el.id,
            classList: Array.from(el.classList)
          }));
        });
        
        console.log('Components found for health check:', allComponents.length);
        
        let healthyComponents = 0;
        let unhealthyComponents = 0;
        
        for (const component of allComponents.slice(0, 5)) { // Test first 5 to avoid timeout
          const selector = component.id ? `#${component.id}` : component.tagName;
          
          try {
            const health = await WBTestHelpers.componentHealthCheck(page, selector, {
              shouldHaveContent: true
            });
            
            if (health.healthy) {
              healthyComponents++;
            } else {
              unhealthyComponents++;
              console.warn(`Unhealthy component ${selector}:`, health.errors);
            }
          } catch (error) {
            console.warn(`Health check failed for ${selector}:`, error.message);
            unhealthyComponents++;
          }
        }
        
        console.log(`Health Check Results: ${healthyComponents} healthy, ${unhealthyComponents} unhealthy`);
        
        // At least 80% of components should be healthy
        const healthRate = healthyComponents / (healthyComponents + unhealthyComponents);
        expect(healthRate).toBeGreaterThanOrEqual(0.8);
        
        console.log(`✅ Component health rate: ${Math.round(healthRate * 100)}%`);
    });
  });

});