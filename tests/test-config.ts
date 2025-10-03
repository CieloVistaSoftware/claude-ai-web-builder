export {};
// @ts-nocheck
// Define all test files that should be run - all tests are now real tests without mocks
module.exports = {
  // No mock tests remain - all mock tests have been deleted
  mockTests: [],

  // All tests that should be run - only real tests with no mocking
  realTests: [
    'color-controller.spec.js',
    'color-explorer-ui.spec.js',
    'theme-functionality.spec.js',
    'theme-persistence.spec.js',
    'real-controls.spec.js',
    'real-file-operations.spec.js',
    'integrated.spec.js'
  ]
};
