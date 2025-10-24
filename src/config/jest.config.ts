export {};
// @ts-nocheck
/**
 * Jest configuration for Claude WebSocket tests
 */
module.exports = {
  // Timeout for tests in milliseconds
  testTimeout: 30000,
  
  // Environment for tests
  testEnvironment: 'node',
  
  // Patterns to locate test files
  testMatch: [
    '**/tests/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  // Coverage settings
  collectCoverageFrom: [
    'test-claude-socket.js'
  ],
  
  // Setup files to run before tests
  setupFiles: [],
  
  // Verbose output
  verbose: true,
  
  // Automatically clear mock calls between tests
  clearMocks: true,
  
  // Global test timeout
  globalTimeout: 60000
};
