# Website Builder Test Documentation

## Overview

This document explains how to run tests for the Website Builder components. The test suite uses Playwright for end-to-end testing and includes tests for UI components, themes, and functionality.

## Main Test Commands

### 1. **Run All Tests** (from project root)
```bash
npm test
```
This runs: `playwright test --config=playwright.real.config.cjs`

### 2. **Run Tests with UI** (interactive mode)
```bash
npm run test:ui
```
Shows Playwright's UI where you can run/debug tests visually. This is useful for:
- Debugging failing tests
- Running specific tests
- Viewing test execution in real-time

### 3. **Run Tests with Fail-Fast**
```bash
npm run test:failfast
```
Stops on first failure (useful for debugging)

### 4. **Run Specific Test Categories**
```bash
npm run test:all              # All tests
npm run test:socket-only      # WebSocket tests only
npm run test:ui-only          # UI tests only
npm run test:category         # Choose category interactively
```

## Component-Specific Test Commands

### For Control Panel Tests:
```bash
# From project root
npx playwright test control-panel.spec.ts
npx playwright test theme-*.spec.ts
npx playwright test real-*.spec.ts
```

### For Material Design Tests:
```bash
npx playwright test material-design-colors.spec.ts
```

### For WebSocket/Claude Tests:
```bash
npm run test:claude
npm run test:claude:run
npm run test:claude:node
npm run test:claude:direct
```

## Before Running Tests

### 1. **Kill Existing Processes**
```bash
npm run kill-port
```
This ensures ports 3000, 8080, etc. are free before starting tests.

### 2. **Start Test Server Manually** (optional)
```bash
npm run serve
```
Starts http-server on port 3000. This is usually handled automatically by the test runner.

### 3. **Check Server Health**
```bash
npm run check-server
```
Verifies the server is running correctly before tests.

## Test Configuration

- **Port**: Tests run on port 3000 with a test server
- **Base Directory**: Tests use `/Working` directory as the base
- **Parallelization**: Tests run in parallel across 8 workers
- **Browsers**: Tests run on Chromium, Firefox, and WebKit
- **Timeout**: 60 seconds per test, 15 seconds per action
- **Screenshots**: Captured on failure
- **Videos**: Recorded on first retry
- **Traces**: Retained on failure for debugging

## HTML Files Being Tested

### Primary Test Targets:
1. **`/Working/index.html`** - Main application (most tests)
2. **`/Working/MaterialDesign.html`** - Material Design implementation
3. **`/components/color-bar/color-bar-demo.html`** - Color bar component
4. **`/components/control-panel-new/tests/test-page.html`** - Control panel components
5. **`/tests/intellisense-test-simple.html`** - IntelliSense functionality

## View Test Reports

### HTML Report
```bash
npx playwright show-report
```
Opens the HTML test report after tests complete. The report includes:
- Pass/fail status for each test
- Screenshots of failures
- Test execution timeline
- Traces for debugging

### Live Test Results
During test execution, results are displayed in the terminal with:
- Real-time progress
- Failed test details
- Error messages and stack traces

## Writing New Tests

### Test File Location
- Place new test files in `/tests` directory
- Use `.spec.ts` or `.spec.js` extension
- Follow naming convention: `feature-name.spec.ts`

### Basic Test Structure
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

## Debugging Failed Tests

### 1. Run Test in UI Mode
```bash
npx playwright test --ui failing-test.spec.ts
```

### 2. Run Test in Debug Mode
```bash
npx playwright test --debug failing-test.spec.ts
```

### 3. View Test Trace
```bash
npx playwright show-trace trace.zip
```

### 4. Run Specific Test
```bash
npx playwright test -g "test name pattern"
```

## Common Issues and Solutions

### Port Already in Use
```bash
npm run kill-port
```

### Tests Timing Out
- Increase timeout in test: `test.setTimeout(120000)`
- Check if server is running: `npm run check-server`

### Tests Failing in CI
- Ensure `CI` environment variable is set
- Check browser compatibility
- Review screenshots in test report

## Test File Organization

```
/tests/
  ├── control-panel.spec.ts          # Control panel functionality
  ├── theme-*.spec.ts               # Theme-related tests
  ├── real-*.spec.ts                # Real-world scenarios
  ├── material-design-colors.spec.ts # Material Design tests
  └── integrated.spec.ts            # Integration tests

/Working/tests/
  ├── Similar test files for Working directory
  └── test-server.js               # Test server configuration
```

## CI/CD Integration

The tests are configured to run in CI environments with:
- Headless browser execution
- No server reuse
- Parallel execution
- Artifact collection for failures

## Best Practices

1. **Keep Tests Isolated**: Each test should be independent
2. **Use Page Objects**: Create reusable page object models
3. **Wait for Elements**: Use proper wait strategies
4. **Clean Test Data**: Reset state between tests
5. **Descriptive Names**: Use clear test and describe block names
6. **Group Related Tests**: Use describe blocks for organization
7. **Handle Async Properly**: Always await async operations

## Quick Reference

```bash
# Most common commands
npm test                    # Run all tests
npm run test:ui            # Interactive UI mode
npx playwright test -g "pattern"  # Run specific tests
npm run kill-port          # Free up ports
npx playwright show-report # View results
```

---

## Test Agent (NEW)

The project now includes a **Test Agent** that provides a programmatic interface for running tests. This is especially useful for Claude AI integration and automation.

### Quick Usage

```bash
# Run all tests via agent
npm run agent:test

# Run by category
node agents/test-agent.cjs run control-panel

# Run component tests
node agents/test-agent.cjs component button

# Shadow DOM diagnostics
node agents/test-agent.cjs diagnose wb-modal

# List categories
node agents/test-agent.cjs categories

# Health check
node agents/test-agent.cjs health
```

### Programmatic Usage

```javascript
const TestAgent = require('./agents/test-agent.cjs');

// Run tests
const result = await TestAgent.run({ category: 'control-panel' });
console.log(result.success ? '✅ Passed' : '❌ Failed');
console.log(result.summary);
```

See [agents/AGENT.md](../agents/AGENT.md) for full documentation.