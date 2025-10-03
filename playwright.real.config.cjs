// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Create a configuration for running Working version tests from the main project directory
module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000, // Longer timeout for stability
  expect: {
    timeout: 10000    // Longer timeout for assertions
  },
  fullyParallel: true, // Run tests in parallel for speed
  forbidOnly: true, // Always fail on .only to avoid partial test runs
  maxFailures: 50,  // Allow more failures to see full test results
  retries: 0,       // No retries to immediately see failures
  workers: 8,       // 8 workers for parallel execution
  reporter: 'html',

  use: {
    actionTimeout: 15000, // Longer timeout for actions
    navigationTimeout: 20000, // Longer timeout for navigations
    baseURL: 'http://localhost:3000', // Use the test server
    trace: 'retain-on-failure', // Keep trace for debugging
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  // Start the test server for the Working version
  webServer: {
    command: 'cd Working && node tests/test-server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000, // 30 seconds to start server
  },
});