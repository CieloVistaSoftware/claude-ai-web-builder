// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for WB Framework tests
 */
module.exports = defineConfig({
  testDir: './tests',
  
  // Look for both .ts and .js test files
  testMatch: '**/*.spec.ts',
  
  // Don't ignore anything in tests/ (we want subdirectories)
  testIgnore: [],

  // Timeouts
  timeout: 120 * 1000,
  expect: {
    timeout: 15000
  },

  // Execution
  fullyParallel: false,
  forbidOnly: false,
  maxFailures: 3,
  retries: 0,
  workers: 1,

  // Reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  // Browser config
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  // Projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
