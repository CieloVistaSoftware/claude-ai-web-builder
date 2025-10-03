// @ts-nocheck
// WebSocket Dependency Loading Test
import { test, expect } from '@playwright/test';

test('WebSocket dependencies load correctly', async ({ page }): any => {
  // Start by loading the test page
  await page.goto('http://localhost:3000/test-claude-socket.html');
  
  // Wait for the socket connection to be established
  await page.waitForFunction(() => window.socket && window.socket.connected);
  console.log('Socket connection established');
  
  // Wait for the test to complete
  await page.waitForSelector('#test-status:not(:contains("Running..."))');
  
  // Check if the test passed
  const testStatus = await page.textContent('#test-status');
  expect(testStatus).toBe('SUCCESS');
  
  // Check network requests to ensure they're using WebSockets
  // We'll use Playwright's request handling to check this
  let httpRequestsMade: any[] = [];
  
  page.on('request', request => {
    const url = request.url();
    // Only track JavaScript file requests that aren't socket.io
    if (url.endsWith('.js') && !url.includes('socket.io')) {
      httpRequestsMade.push(url);
    }
  });
  
  // Now load dependencies via WebSocket
  await page.evaluate(async (): any => {
    // Load WebSocketDependencyLoader.js via Socket first
    const loaderScript = document.createElement('script');
    loaderScript.type = 'module';
    loaderScript.textContent = `
      import WebSocketDependencyLoader from "/websocket-dependency-loader";
      window.wsLoader = new WebSocketDependencyLoader(window.socket);
      console.log('WebSocketDependencyLoader imported');
    `;
    document.head.appendChild(loaderScript);
    
    // Wait for loader to be available
    await new Promise(resolve => {
      const checkLoader = (): any => {
        if (window.wsLoader) {
          resolve();
        } else {
          setTimeout(checkLoader, 100);
        }
      };
      checkLoader();
    });
    
    // Test loading various dependencies
    await Promise.all([
      window.wsLoader.loadScript('./wb.js'),
      window.wsLoader.loadCSS('./wb.css'),
      window.wsLoader.loadScript('./websocket-dependency-loader.js')
    ]);
    
    console.log('Dependencies loaded via WebSocket');
  });
  
  // Wait a moment for any potential HTTP requests to happen
  await page.waitForTimeout(1000);
  
  // Check if any HTTP GET requests were made for the loaded resources
  console.log('HTTP requests made:', httpRequestsMade);
  expect(httpRequestsMade.filter(url => 
    url.includes('wb.js') || 
    url.includes('wb.css') || 
    url.includes('websocket-dependency-loader.js')
  ).length).toBe(0);
  
  // Check the log for WebSocket loading confirmation
  const logs = await page.evaluate((): any => {
    return Array.from(document.querySelectorAll('.log'))
      .map(log => log.textContent);
  });
  
  // Verify WebSocket loading logs
  const loadingLogs = logs.filter(log => log.includes('Loading') && log.includes('WebSocket'));
  expect(loadingLogs.length).toBeGreaterThan(0);
  
  // Make sure we have successful loads
  const successLogs = logs.filter(log => 
    (log.includes('executed') || log.includes('applied')) && 
    !log.includes('Error')
  );
  expect(successLogs.length).toBeGreaterThan(0);
});
