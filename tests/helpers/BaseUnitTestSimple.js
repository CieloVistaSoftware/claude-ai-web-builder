/**
 * BaseUnitTest - Simplified version that doesn't cause hangs
 * Provides error monitoring without blocking operations
 */

export class BaseUnitTest {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.componentInitIssues = [];
    this.initialized = false;
  }

  /**
   * Setup basic monitoring and inject wb-event-log
   * Now includes wb-event-log injection for complete error monitoring
   */
  async setupStandardBeforeEach(page) {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    console.log(`${timestamp} BUT:18 Setup start`);
    
    // Reset error tracking
    this.errors = [];
    this.warnings = [];
    this.componentInitIssues = [];
    console.log(`📊 ${timestamp} BUT:23 Error arrays reset`);

    // Inject wb-event-log component first
    await this.injectWBEventLog(page);
    console.log(`✅ ${timestamp} BUT:27 wb-event-log ready`);

    // Setup enhanced console monitoring with timestamps and location info
    console.log(`${timestamp} BUT:30 Console monitor setup`);
    page.on('console', msg => {
      const text = msg.text();
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1); // HH:MM:SS.sss
      const location = msg.location();
      const locationStr = location ? ` [${location.url?.split('/').pop() || 'unknown'}:${location.lineNumber || '?'}]` : '';
      
      // Only log non-spam messages or errors/warnings
      if (msg.type() === 'error' || msg.type() === 'warning' || 
          (!text.includes('Symbol Registry: Resolved') && !text.includes('CSS Loader:'))) {
        console.log(`${timestamp}${locationStr} ${msg.type().toUpperCase()}:`);
        
        // Format long arrays vertically
        let formattedText = text;
        if (text.includes('[') && text.includes(']') && text.split(',').length > 5) {
          const arrayMatch = text.match(/\[([^\]]+)\]/);
          if (arrayMatch) {
            const arrayContent = arrayMatch[1];
            const items = arrayContent.split(',').map(item => item.trim());
            const formattedArray = '[\n     ' + items.join(',\n     ') + '\n   ]';
            formattedText = text.replace(arrayMatch[0], formattedArray);
          }
        }
        console.log(`   ${formattedText}`);
      }
      
      if (msg.type() === 'error') {
        this.errors.push({
          type: 'console-error',
          message: text,
          timestamp: Date.now()
        });
        console.log(`${timestamp} Error captured:`);
        console.log(`   🔴 ${text}`);
      } else if (msg.type() === 'warning') {
        this.warnings.push({
          type: 'console-warning', 
          message: text,
          timestamp: Date.now(),
          location: location ? `${location.url?.split('/').pop() || 'unknown'}:${location.lineNumber || '?'}` : 'unknown'
        });
        console.log(`${timestamp} Warning captured:`);
        console.log(`   ⚠️ ${text}`);
      }
    });

    // Setup basic network monitoring (non-blocking) - only log errors and warnings
    console.log(`${timestamp} BUT:65 Network monitor setup`);
    page.on('response', response => {
      // Only log errors (4xx, 5xx) or unexpected requests (not our known resources)
      const url = response.url();
      const isExpectedResource = url.includes('/components/') || url.includes('/utils/') || 
                                url.includes('/styles/') || url.includes('127.0.0.1:8081');
      
      if (!response.ok() && response.status() >= 400) {
        this.errors.push({
          type: 'network-error',
          message: `HTTP ${response.status()}: ${response.url()}`,
          timestamp: Date.now()
        });
        console.log(`${timestamp} Network error:`);
        console.log(`   🚫 ${response.status()} ${response.url()}`);
      } else if (!isExpectedResource || response.status() >= 300) {
        // Log redirects or unexpected external requests
        console.log(`🔗 ${timestamp} Response: ${response.status()} ${response.url()}`);
      }
    });

    this.initialized = true;
    console.log(`✅ ${timestamp} BUT:65 Setup complete`);
  }

  /**
   * Simple validation that checks for critical errors
   */
  async validateNoCriticalErrors() {
    console.log('🔍 BaseUnitTest: Starting error validation...');
    console.log(`📊 Current error count: ${this.errors.length}, warnings: ${this.warnings.length}`);
    
    const criticalErrors = this.errors.filter(error => 
      error.type === 'console-error' && 
      (error.message.includes('Cannot read properties of undefined') ||
       error.message.includes('TypeError') ||
       error.message.includes('ReferenceError'))
    );

    console.log(`🎯 Critical errors found: ${criticalErrors.length}`);
    
    if (criticalErrors.length > 0) {
      const errorMessages = criticalErrors.map(e => e.message).join(', ');
      console.log(`❌ Critical errors detected: ${errorMessages}`);
      throw new Error(`Critical errors detected: ${errorMessages}`);
    }

    console.log('✅ No critical errors detected');
    return true;
  }

  /**
   * Simple test wrapper that adds basic validation
   */
  async createStandardTest(page, testFunction) {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    console.log(`${timestamp} BUT:88 Test start`);
    
    try {
      console.log(`${timestamp} BUT:91 Executing test`);
      // Run the actual test
      await testFunction();
      console.log(`✅ ${timestamp} BUT:117 Test completed`);
      
      console.log(`🔍 ${timestamp} BUT:119 Post-test validation`);
      // Simple validation after test
      await this.validateNoCriticalErrors();
      console.log(`✅ ${timestamp} BUT:122 Validation complete`);
      
    } catch (error) {
      console.log('❌ BaseUnitTest: Error occurred in test or validation');
      console.log('📊 BaseUnitTest: Error summary:', this.getErrorSummary());
      
      // Add error context
      if (this.errors.length > 0) {
        console.log('❌ Test errors detected:', this.errors);
      }
      console.log('🚨 BaseUnitTest: Rethrowing error...');
      throw error;
    }
  }

  /**
   * Inject wb-event-log component into the page for testing
   */
  async injectWBEventLog(page) {
    await page.evaluate(() => {
      console.log('🔍 Checking for existing wb-event-log...');
      const existing = document.querySelector('wb-event-log');
      console.log('🔍 Existing wb-event-log found:', !!existing);
      
      // Only inject if wb-event-log doesn't already exist
      if (!existing) {
        console.log('🔍 Creating new wb-event-log element...');
        const eventLog = document.createElement('wb-event-log');
        eventLog.style.display = 'none'; // Hidden for tests
        eventLog.id = 'test-wb-event-log';
        document.body.appendChild(eventLog);
        const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
        console.log(`📝 ${timestamp} BUT:135 wb-event-log injected`);
        console.log('🔍 Element added to body, children count:', document.body.children.length);
      } else {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
        console.log(`📝 ${timestamp} BUT:138 wb-event-log exists`);
      }
    });
    
    // Wait for wb-event-log to initialize
    await page.waitForTimeout(500);
  }

  /**
   * Get error summary for debugging
   */
  getErrorSummary() {
    return {
      errors: this.errors.length,
      warnings: this.warnings.length,
      componentIssues: this.componentInitIssues.length,
      details: {
        errors: this.errors,
        warnings: this.warnings,
        componentIssues: this.componentInitIssues
      }
    };
  }

  /**
   * Export wb-event-log data to test-results folder for debugging
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {string} testName - Name of the test for the filename
   */
  async exportEventLogToTestResults(page, testName) {
    try {
      // Check if page is still active
      if (page.isClosed()) {
        console.warn('⚠️ Page is closed - cannot export event log');
        return;
      }

      // Get the events data from the component with timeout protection
      const eventsData = await Promise.race([
        page.evaluate((testName) => {
          // Try to find wb-event-log component (including injected hidden ones)
          let eventLogComponent = document.querySelector('wb-event-log');
          if (!eventLogComponent) {
            eventLogComponent = document.querySelector('#test-wb-event-log');
          }
          
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
        }, testName),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Export timeout')), 2000))
      ]);

      if (!eventsData) {
        console.warn('⚠️ Could not access wb-event-log events - skipping export');
        return;
      }

      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `eventlog-${testName}-${timestamp}.json`;
      
      // Write to test-results folder - this needs to be done in Node.js context
      // So we'll pass the data back to the calling context to write
      this.pendingEventExport = {
        filename,
        data: eventsData
      };
      
      // Now write the file in Node.js context using ES modules
      if (this.pendingEventExport) {
        const { writeFileSync, existsSync, mkdirSync } = await import('fs');
        const { join } = await import('path');
        
        const testResultsDir = join(process.cwd(), 'test-results');
        
        // Ensure test-results directory exists
        if (!existsSync(testResultsDir)) {
          mkdirSync(testResultsDir, { recursive: true });
        }
        
        const filePath = join(testResultsDir, this.pendingEventExport.filename);
        writeFileSync(filePath, JSON.stringify(this.pendingEventExport.data, null, 2));
        
        console.log(`📄 Event log exported: ${this.pendingEventExport.filename} (${this.pendingEventExport.data.totalEvents} events)`);
        
        // Update the file list for the HTML viewer
        try {
          await this.updateEventLogFileList();
        } catch (error) {
          console.warn('⚠️ Could not update event log file list:', error.message);
        }
        
        // Clear the pending export
        this.pendingEventExport = null;
      }
      
    } catch (error) {
      console.error('❌ Failed to export event log:', error.message);
      
      // Create a minimal report based on what we know
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `eventlog-${testName}-${timestamp}-ERROR.json`;
      
      try {
        const { writeFileSync, existsSync, mkdirSync } = await import('fs');
        const { join } = await import('path');
        const testResultsDir = join(process.cwd(), 'test-results');
        
        if (!existsSync(testResultsDir)) {
          mkdirSync(testResultsDir, { recursive: true });
        }
        
        const errorReport = {
          testName: testName,
          exportTime: new Date().toISOString(),
          error: error.message,
          note: 'Event log export failed - likely due to page context destruction',
          events: []
        };
        
        const filePath = join(testResultsDir, filename);
        writeFileSync(filePath, JSON.stringify(errorReport, null, 2));
        
        console.log(`📄 Error report created: ${filename}`);
      } catch (fsError) {
        console.error('❌ Could not even create error report:', fsError.message);
      }
    }
  }

  /**
   * Update the eventlog-files.json for the HTML viewer
   */
  async updateEventLogFileList() {
    try {
      const { readdir, writeFile } = await import('fs/promises');
      const { join } = await import('path');
      
      const testResultsDir = join(process.cwd(), 'test-results');
      
      // Read all files in test-results directory
      const files = await readdir(testResultsDir);
      
      // Filter for eventlog JSON files (exclude the file list itself)
      const eventLogFiles = files
        .filter(file => file.startsWith('eventlog-') && file.endsWith('.json') && file !== 'eventlog-files.json')
        .sort((a, b) => {
          // Sort by timestamp (newest first)
          const timestampA = a.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)/);
          const timestampB = b.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)/);
          
          if (timestampA && timestampB) {
            return timestampB[1].localeCompare(timestampA[1]);
          }
          return b.localeCompare(a);
        });
      
      // Write the updated file list
      const outputFile = join(testResultsDir, 'eventlog-files.json');
      await writeFile(outputFile, JSON.stringify(eventLogFiles, null, 2));
      
    } catch (error) {
      // Don't throw, just log the warning (already handled by caller)
      throw error;
    }
  }
}