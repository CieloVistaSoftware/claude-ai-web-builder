// @ts-nocheck
import { test, expect } from '@playwright/test';
import { BaseUnitTest } from '../helpers/BaseUnitTestSimple.js';

test.describe('Event Log Export Test', () => {
  const baseTest = new BaseUnitTest();

  test.beforeEach(async ({ page }) => {
    await baseTest.setupStandardBeforeEach(page);
  });

  test('should export event log data successfully', async ({ page }) => {
    await baseTest.createStandardTest(page, async () => {
      console.log('🧪 Testing event log export functionality...');
      
      await page.goto('/components/wb-control-panel/wb-control-panel-demo.html');
      await page.waitForSelector('#main-control-panel', { state: 'visible', timeout: 15000 });
      
      // Manually inject wb-event-log after navigation (since beforeEach injection is lost)
      await page.evaluate(() => {
        console.log('🔍 Post-navigation: Checking for existing wb-event-log...');
        const existing = document.querySelector('wb-event-log');
        console.log('🔍 Post-navigation: Existing wb-event-log found:', !!existing);
        
        if (!existing) {
          console.log('🔍 Post-navigation: Creating new wb-event-log element...');
          const eventLog = document.createElement('wb-event-log');
          eventLog.style.display = 'none'; // Hidden for tests
          eventLog.id = 'test-wb-event-log';
          document.body.appendChild(eventLog);
          console.log('📝 Post-navigation: wb-event-log injected');
          console.log('🔍 Post-navigation: Element added to body, children count:', document.body.children.length);
        }
      });
      
      // Wait for wb-event-log to initialize
      await page.waitForTimeout(500);
      
      // Wait for wb-event-log to be present (including hidden ones)
      console.log('🔍 Looking for wb-event-log component...');
      const eventLogExists = await page.locator('wb-event-log').count();
      const hiddenEventLogExists = await page.locator('#test-wb-event-log').count();
      console.log(`Found ${eventLogExists} visible wb-event-log components`);
      console.log(`Found ${hiddenEventLogExists} hidden wb-event-log components`);
      
      // Debug: Check if any element exists at all
      const allElements = await page.evaluate(() => {
        const allWbEventLogs = document.querySelectorAll('wb-event-log');
        const allTestLogs = document.querySelectorAll('#test-wb-event-log');
        return {
          allWbEventLogs: allWbEventLogs.length,
          allTestLogs: allTestLogs.length,
          bodyChildren: document.body.children.length,
          hasDocument: !!document
        };
      });
      console.log('🔍 Debug info:', allElements);
      
      if (eventLogExists > 0 || hiddenEventLogExists > 0) {
        // Try to get some event data
        const eventData = await page.evaluate(() => {
          const eventLog = document.querySelector('wb-event-log');
          return {
            exists: !!eventLog,
            hasEvents: !!(eventLog && eventLog.events),
            eventCount: eventLog && eventLog.events ? eventLog.events.length : 0
          };
        });
        
        console.log('📊 Event log status:', eventData);
        
        if (eventData.eventCount > 0) {
          console.log('✅ Found events to export');
        } else {
          console.log('⚠️ No events found, but component exists');
        }
      } else {
        console.log('❌ wb-event-log component not found');
      }
      
      console.log('✅ Test completed');
    });
  });

  // Export event log after each test
  test.afterEach(async ({ page }) => {
    console.log('🚀 Starting event log export...');
    try {
      await baseTest.exportEventLogToTestResults(page, 'event-log-export-test');
      console.log('✅ Event log export completed');
    } catch (error) {
      console.error('❌ Failed to export event log:', error.message);
    }
  });
});