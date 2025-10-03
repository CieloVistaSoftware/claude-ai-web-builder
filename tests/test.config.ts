// @ts-nocheck
/**
 * @file test.config.js
 * @description Test-specific configuration that extends the main config
 * @module test/config
 */

import config from "../config";

/**
 * Test configuration for use with Playwright and other test frameworks
 */
export const testConfig = {
  // Base paths for tests
  baseUrl: config.getMainUrl('file'), // Use file:// protocol by default for tests
  
  // Alternative URLs for different test environments
  urls: {
    file: config.getMainUrl('file'),
    local: config.getMainUrl('local'),
    legacy: config.getLegacyUrl('file')
  },
  
  // Test timeouts
  timeouts: {
    ...config.settings.timeouts,
    test: 30000, // Default test timeout
    action: 2000, // Timeout for user actions
  },
  
  // Test data storage keys
  storage: {
    websiteState: config.settings.storageKey,
  },
  
  // Default test settings
  defaults: {
    theme: config.settings.defaultTheme,
    layout: config.settings.defaultLayout,
    browser: 'chromium',
    headless: true,
  },
  
  // Server settings for test environment
  server: {
    port: config.settings.ports.test,
    host: 'localhost',
    root: config.paths.app.rootDir,
  }
};

export default testConfig;
