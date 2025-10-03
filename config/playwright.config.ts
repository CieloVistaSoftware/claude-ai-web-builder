// @ts-nocheck
// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { testConfig } from "./tests/test.config";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: testConfig.timeouts.test,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: testConfig.timeouts.action
  },
  /* Run tests in files in parallel */
  fullyParallel: false, // Set to false to run tests sequentially for better error debugging
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: true, // Always fail on .only to avoid partial test runs
  /* Stop on first test failure for faster feedback */
  maxFailures: 1, // Stop execution after first test failure
  /* No retries to immediately see failures */
  retries: 0,
  /* Use a single worker for predictable output */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: testConfig.timeouts.action,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: testConfig.urls.local,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  /* Run your local dev server before starting the tests */
  webServer: {
    command: `npx http-server ${testConfig.server.root} -p ${testConfig.server.port}`,
    port: testConfig.server.port,
    reuseExistingServer: !process.env.CI,
    timeout: testConfig.timeouts.serverStart,
    stdout: 'pipe', // Capture the stdout to see server logs
    stderr: 'pipe', // Capture the stderr to see error logs
  },
});
