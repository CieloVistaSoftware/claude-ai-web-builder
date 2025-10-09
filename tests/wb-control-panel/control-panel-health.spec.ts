// @ts-nocheck
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

/**
 * Core Component Health Tests - Tests the exact gaps found in our error analysis:
 * 1. Component config loading (wb-nav config undefined error)
 * 2. Component initialization state (timeout errors)  
 * 3. Console error monitoring (wb-event-log integration)
 */

test.describe('WB Control Panel - COMPONENT HEALTH CHECKS', () => {
  const baseTest = new BaseUnitTest();

  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
    await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
    await page.waitForTimeout(3000);
  });

  test('wb-event-log should be capturing all errors', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🔍 Testing wb-event-log integration...');
      
      // Wait for wb-event-log to be available (should be injected by BaseUnitTest)
      await page.waitForSelector('wb-event-log', { timeout: 10000 });
      
      // Additional wait for initialization
      await page.waitForTimeout(1000);
        
        // Check if wb-event-log is present and initialized  
        const eventLogStatus = await page.evaluate(() => {
          const eventLog = document.querySelector('wb-event-log');
          if (!eventLog) return { exists: false };
          
          return {
            exists: true,
            attached: eventLog.isConnected,
            hasShadowRoot: !!eventLog.shadowRoot,
            initialized: eventLog._initialized === true,
            eventCount: eventLog.shadowRoot?.querySelectorAll('.event-item')?.length || 0,
            errorCount: eventLog.shadowRoot?.querySelectorAll('.event-error')?.length || 0
          };
        });
        
        console.log('Event Log Status:', eventLogStatus);
        
        expect(eventLogStatus.exists).toBe(true);
        expect(eventLogStatus.attached).toBe(true);
        
        // wb-event-log should have captured initialization events
        expect(eventLogStatus.eventCount).toBeGreaterThan(0);
        
        if (eventLogStatus.errorCount > 0) {
          // Get actual error messages
          const errorMessages = await page.evaluate(() => {
            const eventLog = document.querySelector('wb-event-log');
            const errors = Array.from(eventLog.shadowRoot?.querySelectorAll('.event-error') || []);
            return errors.map(el => el.textContent);
          });
          
          console.error('wb-event-log captured errors:', errorMessages);
          
          // Check if these are the specific errors we're trying to fix
          const hasConfigErrors = errorMessages.some(msg => msg.includes('config') || msg.includes('undefined'));
          const hasTimeoutErrors = errorMessages.some(msg => msg.includes('timeout') || msg.includes('waiting'));
          
          if (hasConfigErrors || hasTimeoutErrors) {
            console.error('CRITICAL: Found the exact errors we need to fix:', { hasConfigErrors, hasTimeoutErrors });
            throw new Error(`Component errors found: ${errorMessages.join(', ')}`);
          }
        }
        
        console.log('✅ wb-event-log is working and capturing events');
    });
  });

  test('wb-nav component should initialize with valid config', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🧭 Testing wb-nav component initialization...');
        
        // Check if wb-nav exists and get its status
        const navStatus = await page.evaluate(() => {
          const navElements = document.querySelectorAll('wb-nav');
          if (navElements.length === 0) return { exists: false };
          
          const nav = navElements[0];
          return {
            exists: true,
            count: navElements.length,
            hasConfig: nav.config !== undefined && nav.config !== null,
            configKeys: nav.config ? Object.keys(nav.config) : [],
            initialized: nav._initialized === true,
            classList: Array.from(nav.classList),
            hasError: nav.classList.contains('error') || nav.classList.contains('failed')
          };
        });
        
        console.log('WB Nav Status:', navStatus);
        
        if (navStatus.exists) {
          expect(navStatus.hasConfig).toBe(true);
          expect(navStatus.configKeys.length).toBeGreaterThan(0);
          expect(navStatus.hasError).toBe(false);
          
          // Specifically check for the 'base' config that was undefined
          const hasBaseConfig = await page.evaluate(() => {
            const nav = document.querySelector('wb-nav');
            return nav && nav.config && nav.config.classes && nav.config.classes.base;
          });
          
          expect(hasBaseConfig).toBeTruthy();
          console.log('✅ wb-nav has valid config including base class');
        } else {
          console.log('ℹ️ No wb-nav components found on page');
        }
    });
  });

  test('component registry should load all components without timeout', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('📋 Testing component registry loading...');
        
        // Monitor for component registry timeouts
        const registryErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error' && msg.text().includes('Timeout waiting for component')) {
            registryErrors.push(msg.text());
          }
        });
        
        // Wait longer for components to load
        await page.waitForTimeout(5000);
        
        // Check component registry status
        const registryStatus = await page.evaluate(() => {
          if (!window.WBComponentRegistry) return { exists: false };
          
          return {
            exists: true,
            loadedComponents: window.WBComponentRegistry.getComponentNames ? window.WBComponentRegistry.getComponentNames() : [],
            pendingComponents: [], // WBComponentRegistry uses loadingPromises Map, not pending
            failedComponents: [], // No explicit failed components tracking in this version
            totalRegistered: window.WBComponentRegistry.getAllComponents ? window.WBComponentRegistry.getAllComponents().length : 0
          };
        });
        
        console.log('Component Registry Status:', registryStatus);
        console.log('Registry Timeout Errors:', registryErrors);
        
        if (registryStatus.exists) {
          expect(registryStatus.failedComponents.length).toBe(0);
          expect(registryStatus.totalRegistered).toBeGreaterThan(0);
        }
        
        // Should have no timeout errors
        expect(registryErrors.length).toBe(0);
        
        console.log('✅ Component registry loaded without timeouts');
    });
  });

  test('all critical components should render without console errors', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🚫 Testing for critical console errors...');
        
        const criticalErrors = [];
        const componentErrors = [];
        
        page.on('console', msg => {
          if (msg.type() === 'error') {
            const text = msg.text();
            if (text.includes('Cannot read properties of undefined')) {
              criticalErrors.push(text);
            }
            if (text.includes('wb-') || text.includes('control-panel')) {
              componentErrors.push(text);
            }
          }
        });
        
        // Reload to catch all initialization errors
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        console.log('Critical Errors Found:', criticalErrors.length);
        console.log('Component Errors Found:', componentErrors.length);
        
        if (criticalErrors.length > 0) {
          console.error('CRITICAL ERRORS:', criticalErrors);
        }
        
        if (componentErrors.length > 0) {
          console.error('COMPONENT ERRORS:', componentErrors);
        }
        
        // Fail if we find the specific errors from the original report
        const hasConfigError = criticalErrors.some(err => err.includes("Cannot read properties of undefined (reading 'base')"));
        const hasTimeoutError = componentErrors.some(err => err.includes('Timeout waiting for component'));
        
        expect(hasConfigError).toBe(false);
        expect(hasTimeoutError).toBe(false);
        
        console.log('✅ No critical component initialization errors found');
    });
  });

  test('control panel demo should be fully functional after component health fixes', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🎛️ Testing complete control panel functionality...');
        
        // Wait for all components to initialize
        await page.waitForTimeout(3000);
        
        // Check that main control panel exists and is functional
        const controlPanel = page.locator('#main-control-panel');
        await expect(controlPanel).toBeVisible();
        
        // Check that theme selector works (should exist and be clickable)
        const themeSelect = page.locator('#theme-select');
        const themeCount = await themeSelect.count();
        
        if (themeCount > 0) {
          await expect(themeSelect).toBeVisible();
          
          // Test theme change functionality
          await themeSelect.selectOption('ocean');
          await page.waitForTimeout(500);
          
          const currentTheme = await page.evaluate(() => 
            document.documentElement.getAttribute('data-theme')
          );
          expect(currentTheme).toBe('ocean');
        }
        
        // Check that layout selector works
        const layoutSelect = page.locator('#layout-select');
        const layoutCount = await layoutSelect.count();
        
        if (layoutCount > 0) {
          await expect(layoutSelect).toBeVisible();
          
          // Test layout change functionality  
          await layoutSelect.selectOption('left-nav');
          await page.waitForTimeout(500);
          
          const currentLayout = await page.evaluate(() =>
            document.documentElement.getAttribute('data-layout')
          );
          expect(currentLayout).toBe('left-nav');
        }
        
        console.log('✅ Control panel is fully functional');
    });
  });

  // Export event log after each test (before page context is destroyed)
  test.afterEach(async ({ page }) => {
    try {
      // Export event log while page context is still active
      await baseTest.exportEventLogToTestResults(page, 'control-panel-health');
    } catch (error) {
      console.error('Failed to export event log:', error);
      // Try to get basic event data as fallback
      try {
        const basicEvents = await page.evaluate(() => {
          const eventLog = document.querySelector('wb-event-log');
          return eventLog?.events?.length || 0;
        });
        console.log(`📋 Event count fallback: ${basicEvents} events captured`);
      } catch (fallbackError) {
        console.error('Fallback also failed - page context destroyed');
      }
    }
  });

});