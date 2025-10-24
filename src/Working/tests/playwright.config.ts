// @ts-nocheck
// @ts-check
import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.js',  // Only run .spec.js files
  fullyParallel: false,  // Set to false to run tests sequentially
  forbidOnly: !!process.env.CI,
  retries: 0,  // No retries for faster feedback when stopping on first failure
  workers: 1,  // Single worker for predictable output
  reporter: 'html',  // HTML reporter for detailed test results
  maxFailures: 1,  // Stop after first test failure
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',  // Keep traces when tests fail
    screenshot: 'only-on-failure',
    video: 'on-first-retry',     // Record video on first retry of a failed test
    actionTimeout: 10000,        // Increase timeout for actions
    navigationTimeout: 15000,    // Increase timeout for navigations
    headless: false,             // Run in headed mode (visible browser)
    viewport: null,              // Use full screen instead of default viewport
    launchOptions: {
      args: [
        '--start-maximized',       // Start browser maximized
        '--disable-web-security',  // Allow file downloads in tests
        '--allow-running-insecure-content',
        '--disable-features=VizDisplayCompositor'
      ],
      headless: false,             // Ensure headed mode
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        // Remove device configuration that conflicts with null viewport
        channel: 'chrome',
        viewport: null,              // Use full screen instead of fixed viewport
        launchOptions: {
          args: [
            '--start-maximized',      // Start browser maximized
            '--disable-web-security', // Allow file downloads in tests
            '--allow-running-insecure-content',
            '--disable-features=VizDisplayCompositor'
          ],
          headless: false,            // Ensure headed mode
        },
      },
    },
    // Disabled Firefox and WebKit for faster testing feedback
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1280, height: 720 },
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1280, height: 720 },
    //   },
    // },
  ],
  timeout: 60000, // Increased timeout (60 seconds) for more reliable tests

  // Start the test server for tests
  webServer: {
    command: 'node test-server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 20000, // 20 seconds to start the server
  },
});
