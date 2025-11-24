// @ts-nocheck
const { test, expect } = require('@playwright/test');

/**
 * BaseUnitTest - Standard foundation for all component tests
 * 
 * Provides mandatory functionality that ALL unit tests must have:
 * ✅ wb-event-log integration 
 * ✅ Error monitoring setup
 * ✅ Component initialization checks
 * ✅ Standardized beforeEach with error capture
 * ✅ Console error monitoring
 * ✅ Network request monitoring
 * ✅ Component health validation
 */

export class BaseUnitTest {
  constructor(testUrl, componentName = 'component') {
    this.testUrl = testUrl;
    this.componentName = componentName;
    this.errors = [];
    this.warnings = [];
    this.networkFailures = [];
    this.initialized = false;
  }

  /**
   * Standard beforeEach that ALL tests should use
   * This ensures consistent error monitoring and wb-event-log integration
   */
  async setupStandardBeforeEach(page) {
    // Reset error tracking
    this.errors = [];
    this.warnings = [];
    this.networkFailures = [];

    // Setup comprehensive error monitoring (MANDATORY)
    await this.setupErrorMonitoring(page);
    
    // Setup network monitoring for failed config loads
    await this.setupNetworkMonitoring(page);

    // MANDATORY: Ensure wb-event-log is present and working
    await this.ensureWBEventLogIntegration(page);

    // MANDATORY: Check for component initialization
    await this.checkComponentInitialization(page);

    // Store error references on page for test access
    page.testErrors = this.errors;
    page.testWarnings = this.warnings;
    page.networkFailures = this.networkFailures;
    
    this.initialized = true;
    console.log('✅ BaseUnitTest setup complete with mandatory error monitoring and component validation');
  }

  /**
   * MANDATORY: Setup error monitoring for all console messages
   */
  async setupErrorMonitoring(page) {
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        this.errors.push({
          type: 'console-error',
          message: text,
          timestamp: Date.now()
        });
      } else if (msg.type() === 'warning') {
        this.warnings.push({
          type: 'console-warning', 
          message: text,
          timestamp: Date.now()
        });
      }
    });

    page.on('pageerror', error => {
      this.errors.push({
        type: 'page-error',
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    });

    page.on('requestfailed', request => {
      this.networkFailures.push({
        type: 'network-failure',
        url: request.url(),
        method: request.method(),
        failure: request.failure()?.errorText,
        timestamp: Date.now()
      });
    });
  }

  /**
   * MANDATORY: Setup network monitoring for config file failures
   */
  async setupNetworkMonitoring(page) {
    page.on('response', response => {
      // Track failed config/schema file loads
      if (response.url().includes('.json') || response.url().includes('schema')) {
        if (!response.ok()) {
          this.networkFailures.push({
            type: 'config-load-failure',
            url: response.url(),
            status: response.status(),
            statusText: response.statusText(),
            timestamp: Date.now()
          });
        }
      }
    });
  }

  /**
   * MANDATORY: Ensure wb-event-log is integrated and working
   */
  async ensureWBEventLogIntegration(page, timeout = 5000) {
    try {
      // Wait for wb-event-log to be present
      await page.waitForSelector('wb-event-log', { 
        state: 'attached', 
        timeout 
      });

      // Verify wb-event-log is functional
      const eventLogStatus = await page.evaluate(() => {
        const eventLog = document.querySelector('wb-event-log');
        if (!eventLog) return { exists: false };
        
        return {
          exists: true,
          attached: eventLog.isConnected,
          hasShadowRoot: !!eventLog.shadowRoot,
          initialized: eventLog._initialized === true,
          hasEvents: eventLog.shadowRoot?.querySelectorAll('.event-item')?.length > 0
        };
      });

      if (!eventLogStatus.exists || !eventLogStatus.attached) {
        this.errors.push({
          type: 'wb-event-log-missing',
          message: 'wb-event-log component not found or not attached to DOM',
          timestamp: Date.now()
        });
      }

      return eventLogStatus;
    } catch (error) {
      this.warnings.push({
        type: 'wb-event-log-timeout',
        message: `wb-event-log not available: ${error.message}`,
        timestamp: Date.now()
      });
      return { exists: false, timeout: true };
    }
  }

  /**
   * MANDATORY: Check component initialization state
   */
  async checkComponentInitialization(page) {
    // Check for web components that should be initialized
    const componentStatus = await page.evaluate(() => {
      const webComponents = document.querySelectorAll('*');
      const components = [];
      
      webComponents.forEach(el => {
        if (el.tagName.includes('-')) {
          components.push({
            tagName: el.tagName.toLowerCase(),
            id: el.id,
            hasConfig: el.config !== undefined && el.config !== null,
            initialized: el._initialized === true,
            hasError: el.classList.contains('error') || el.classList.contains('failed'),
            configLoaded: el.config && Object.keys(el.config).length > 0
          });
        }
      });
      
      return components;
    });

    // Check for components with initialization issues
    const problematicComponents = componentStatus.filter(comp => 
      !comp.hasConfig || comp.hasError || (!comp.initialized && comp.tagName !== 'wb-event-log')
    );

    if (problematicComponents.length > 0) {
      this.errors.push({
        type: 'component-initialization-failure',
        message: `Components with initialization issues: ${problematicComponents.map(c => c.tagName).join(', ')}`,
        details: problematicComponents,
        timestamp: Date.now()
      });
    }

    return { 
      total: componentStatus.length, 
      problematic: problematicComponents.length,
      components: componentStatus 
    };
  }

  /**
   * MANDATORY: Validate no critical errors occurred during test
   * ALL tests should call this
   */
  async validateNoCriticalErrors(page) {
    if (!this.initialized) {
      throw new Error('BaseUnitTest not properly initialized - call setupStandardBeforeEach() first');
    }

    // Check for critical errors that should fail tests
    const criticalErrors = this.errors.filter(error => 
      error.type === 'page-error' || 
      error.type === 'component-initialization-failure' ||
      (error.type === 'console-error' && (
        error.message.includes('Cannot read properties of undefined') ||
        error.message.includes('Timeout waiting for component') ||
        error.message.includes('TypeError') ||
        error.message.includes('ReferenceError')
      ))
    );

    if (criticalErrors.length > 0) {
      console.error('Critical errors found:', criticalErrors);
      throw new Error(`Critical errors detected: ${criticalErrors.map(e => e.message).join('; ')}`);
    }

    // Check wb-event-log captured errors
    const eventLogErrors = await page.evaluate(() => {
      const eventLog = document.querySelector('wb-event-log');
      if (!eventLog || !eventLog.shadowRoot) return [];
      
      const errorElements = Array.from(eventLog.shadowRoot.querySelectorAll('.event-error') || []);
      return errorElements.map(el => el.textContent).filter(text => 
        text && (text.includes('config') || text.includes('undefined') || text.includes('timeout'))
      );
    });

    if (eventLogErrors.length > 0) {
      console.error('wb-event-log captured critical errors:', eventLogErrors);
      throw new Error(`wb-event-log captured critical errors: ${eventLogErrors.join('; ')}`);
    }

    return {
      totalErrors: this.errors.length,
      totalWarnings: this.warnings.length,
      criticalErrors: criticalErrors.length,
      networkFailures: this.networkFailures.length,
      eventLogErrors: eventLogErrors.length,
      status: 'clean'
    };
  }

  /**
   * MANDATORY: Component health check that all tests should perform
   */
  async performComponentHealthCheck(page, expectedComponents = []) {
    const healthReport = await page.evaluate((expected) => {
      const report = {
        totalComponents: 0,
        healthyComponents: 0,
        unhealthyComponents: 0,
        missingComponents: [],
        componentDetails: []
      };

      // Check expected components
      expected.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) {
          report.missingComponents.push(selector);
        } else {
          const health = {
            selector,
            exists: true,
            tagName: element.tagName.toLowerCase(),
            hasConfig: element.config !== undefined && element.config !== null,
            initialized: element._initialized === true,
            hasContent: element.innerHTML.length > 0 || (element.shadowRoot && element.shadowRoot.innerHTML.length > 0),
            hasError: element.classList.contains('error') || element.classList.contains('failed'),
            healthy: false
          };

          // Determine if component is healthy
          health.healthy = !health.hasError && (health.hasConfig || health.hasContent);
          
          if (health.healthy) {
            report.healthyComponents++;
          } else {
            report.unhealthyComponents++;
          }

          report.componentDetails.push(health);
          report.totalComponents++;
        }
      });

      return report;
    }, expectedComponents);

    // Fail test if expected components are missing or unhealthy
    if (healthReport.missingComponents.length > 0) {
      throw new Error(`Missing expected components: ${healthReport.missingComponents.join(', ')}`);
    }

    if (healthReport.unhealthyComponents > 0) {
      const unhealthy = healthReport.componentDetails.filter(c => !c.healthy);
      console.warn('Unhealthy components:', unhealthy);
      
      // Only fail if components are completely broken (have errors)
      const broken = unhealthy.filter(c => c.hasError);
      if (broken.length > 0) {
        throw new Error(`Broken components detected: ${broken.map(c => c.selector).join(', ')}`);
      }
    }

    return healthReport;
  }

  /**
   * Create a standardized test template
   */
  async createStandardTest(page, testFunction, expectedComponents = []) {
    // Ensure base setup was called
    if (!this.initialized) {
      throw new Error('BaseUnitTest not initialized - call setupStandardBeforeEach() in beforeEach block');
    }

    try {
      // Run the actual test
      await testFunction();

      // MANDATORY: Validate no critical errors
      await this.validateNoCriticalErrors(page);

      // MANDATORY: Perform component health check if components specified
      if (expectedComponents.length > 0) {
        await this.performComponentHealthCheck(page, expectedComponents);
      }

      console.log(`✅ BaseUnitTest: Test completed with mandatory validations`);
    } catch (error) {
      console.error(`❌ BaseUnitTest: Test failed:`, error.message);
      throw error;
    }
  }

  /**
   * Export wb-event-log data to test-results folder for debugging
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {string} testName - Name of the test for the filename
   */
  async exportEventLogToTestResults(page, testName) {
    try {
      // Get the wb-event-log component
      const eventLogElement = await page.locator('wb-event-log').first();
      
      if (!(await eventLogElement.count())) {
        console.warn('⚠️ No wb-event-log component found - skipping event export');
        return;
      }

      // Get the events data from the component
      const eventsData = await page.evaluate((testName) => {
        const eventLogComponent = document.querySelector('wb-event-log');
        if (!eventLogComponent || !eventLogComponent.events) {
          return null;
        }
        
        return {
          events: eventLogComponent.events,
          totalEvents: eventLogComponent.events.length,
          maxEvents: eventLogComponent.maxEvents,
          exportTime: new Date().toISOString(),
          testName: testName
        };
      }, testName);

      if (!eventsData) {
        console.warn('⚠️ Could not access wb-event-log events - skipping export');
        return;
      }

      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `eventlog-${testName}-${timestamp}.json`;
      
      // Write to test-results folder using Node.js filesystem (this runs in Node.js context, not browser)
      const fs = require('fs');
      const path = require('path');
      
      const testResultsDir = path.join(process.cwd(), 'test-results');
      
      // Ensure test-results directory exists
      if (!fs.existsSync(testResultsDir)) {
        fs.mkdirSync(testResultsDir, { recursive: true });
      }
      
      const filePath = path.join(testResultsDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(eventsData, null, 2));
      
      console.log(`📄 Event log exported: ${filename} (${eventsData.totalEvents} events)`);
      
    } catch (error) {
      console.error('❌ Failed to export event log:', error.message);
    }
  }
}

// Export convenience function for creating base test instances
export function createBaseUnitTest(testUrl, componentName) {
  return new BaseUnitTest(testUrl, componentName);
}

export default BaseUnitTest;