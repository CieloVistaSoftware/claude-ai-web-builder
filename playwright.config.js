// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000, // 30 seconds for WB component tests
  expect: {
    timeout: 10000 // 10 seconds for WB component expectations
  },
  fullyParallel: false, // WB components have dependencies - run sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for dependency order
  maxFailures: 5, // Allow some failures but not complete breakdown
  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/wb-test-results.json' }]
  ],

  use: {
    actionTimeout: 10000, // WB components may need more time
    navigationTimeout: 15000, // WB pages can be complex
    baseURL: 'http://127.0.0.1:8081',
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // WB-specific settings
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    bypassCSP: true, // WB components may need CSP bypass
  },

  projects: [
    {
      name: 'wb-components-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // WB Component specific browser settings
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--allow-running-insecure-content'
          ]
        }
      },
    },
  ],

  // Use external server (we start it manually)
  // webServer: {
  //   command: 'python -m http.server 3000',
  //   port: 3000,
  //   reuseExistingServer: true, // Use existing server
  //   timeout: 10000,
  // },

  globalSetup: undefined, // No global setup needed
  globalTeardown: undefined, // No global teardown needed
});