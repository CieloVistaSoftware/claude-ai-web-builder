```markdown
# feature: Playwright Test Suite for Claude AI Website Builder

## 🚀 What It Does

This feature provides a modern Playwright test suite for the Claude AI Website Builder project. It replaces the legacy PowerShell tests with TypeScript-based Playwright tests, offering improved reliability, cross-browser support, and adherence to modern testing practices.

## 📋 Test Coverage

### Converted Test Suites

| Test Suite                          | Description                          | PowerShell Original                  |
|-------------------------------------|--------------------------------------|---------------------------------------|
| `colorBar.spec.ts`                  | Color bar functionality and controls | `ConsolidatedColorBarTests.ps1`      |
| `dynamicPages.spec.ts`              | Dynamic page creation and navigation | `ConsolidatedDynamicPagesTests.ps1`  |
| `themeGeneratorSimple.spec.ts`      | Simple theme generation              | `ThemeGeneratorSimpleTests.ps1`      |
| `typescriptConfig.spec.ts`          | TypeScript configuration             | `TypescriptConfigTest.Tests.ps1`     |

For the full list of test suites, see [docs/test-suites.md](docs/test-suites.md).

## ⚙️ Internal Architecture

The Playwright test suite is structured as follows:
- **Test Files**: Located in the `tests/` directory, each file targets a specific feature or functionality.
- **Configuration**: Centralized in `playwright.config.ts` for browser settings, base URL, and parallel execution.
- **Utilities**: Shared helper functions are stored in `utils/` to reduce code duplication.
- **Reports**: Test results are automatically generated in `playwright-report/` and include HTML, JSON, screenshots, and traces.

## 🧪 Manual Test

To manually verify the Playwright test suite:
1. **Setup**:
   - Install dependencies: `npm install`
   - Install Playwright browsers: `npx playwright install`
2. **Run Tests**:
   - All tests: `npm test`
   - Specific test: `npx playwright test colorBar.spec.ts`
3. **View Reports**:
   - Open the HTML report: `npm run test:report`
   - Inspect screenshots and traces for failures.

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Setup
```powershell
# Run the migration script (if not already done)
.\migrate-to-playwright.ps1

# Or manually install dependencies
npm install
npx playwright install
```

## 🧪 Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suite
```bash
npx playwright test colorBar.spec.ts
```

### Debug Mode
```bash
npm run test:debug
```

## 📊 Test Reports

### View HTML Report
```bash
npm run test:report
```

### Generate Test Results
Tests automatically generate:
- HTML reports in `playwright-report/`
- JSON results in `test-results.json`
- Screenshots on failure
- Video recordings on failure
- Trace files for debugging

## 🔧 Configuration

### Playwright Configuration
- **File**: `playwright.config.ts`
- **Base URL**: `http://localhost:8080`
- **Browsers**: Chrome, Firefox, Safari
- **Parallel**: Yes
- **Retries**: 2 retries on CI, 0 locally

## 📝 Writing New Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name Tests', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/your-page.html');
    const element = await page.locator('#element-id');
    await expect(element).toBeVisible();
  });
});
```

### Best Practices
1. Use descriptive test names.
2. Wait for network idle state.
3. Use proper selectors (e.g., `data-testid`).
4. Test mobile responsiveness.
5. Include accessibility checks.

## 🔄 Migration from PowerShell

### Completed Migration
All PowerShell tests have been successfully converted to Playwright. The migration includes:
- Cross-browser compatibility
- Visual testing capabilities
- CI/CD integration ready

### Cleanup
To remove old PowerShell tests:
```powershell
.\cleanup-playwright.ps1
```
```