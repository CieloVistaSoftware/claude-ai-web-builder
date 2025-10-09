// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 10 * 1000, // Fast timeout
  expect: {
    timeout: 5000 // Fast expectation timeout
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries for fast fail
  workers: 1,
  maxFailures: 1, // Stop on first failure
  reporter: 'html',

  use: {
    actionTimeout: 5000, // Fast actions
    navigationTimeout: 8000, // Fast navigation
    baseURL: 'http://localhost:3000',
    trace: 'off', // Disable for speed
    screenshot: 'off', // Disable for speed
    video: 'off', // Disable for speed
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'node tests/test-server.js',
    port: 3000, // Explicitly specify port for Playwright to manage
    reuseExistingServer: false, // Always start fresh server
    timeout: 30000,
    ignoreHTTPSErrors: true,
    env: {
      PORT: '3000' // Ensure server uses this exact port
    }
  },
});