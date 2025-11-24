# BaseUnitTest.js

This file provides a base class for Playwright and unit tests in the Website Builder project. It includes common setup, teardown, and utility methods for consistent test structure and error handling.

- **Purpose:** Abstracts repetitive test logic and error monitoring for all component and integration tests.
- **Usage:** Extend or instantiate in your test files to use shared setup and assertion helpers.
- **Key Features:**
  - Standardized beforeEach/afterEach hooks
  - Error and event log monitoring
  - Utility methods for DOM and component assertions
  
 * Provides mandatory functionality that ALL unit tests must have:
 * ✅ wb-event-log integration 
 * ✅ Error monitoring setup
 * ✅ Component initialization checks
 * ✅ Standardized beforeEach with error capture
 * ✅ Console error monitoring
 * ✅ Network request monitoring
 * ✅ Component health validation


---

_Last updated: October 2025._
