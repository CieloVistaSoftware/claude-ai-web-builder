# Playwright Test Suite for Claude AI Website Builder

## 🚀 Overview

This directory contains the modern Playwright test suite for the Claude AI Website Builder project. All PowerShell tests have been converted to TypeScript Playwright tests for better reliability, cross-browser support, and modern testing practices.

## 📋 Test Coverage

### Converted Test Suites

| Test Suite | Description | PowerShell Original |
|------------|-------------|-------------------|
| `colorBar.spec.ts` | Color bar functionality and controls | `ConsolidatedColorBarTests.ps1` |
| `colorWheel.spec.ts` | Color wheel implementation | `ColorWheelImplementation.Tests.ps1` |
| `cssStandards.spec.ts` | CSS standards validation | `CssStandardsValidation.Tests.ps1` |
| `dynamicPages.spec.ts` | Dynamic page creation and navigation | `ConsolidatedDynamicPagesTests.ps1` |
| `floatingTableTheme.spec.ts` | Floating table theme controls | `FloatingTableThemeControls.Tests.ps1` |
| `footer.spec.ts` | Footer visibility and positioning | `ConsolidatedFooterTests.ps1` |
| `frontendBackendArchitecture.spec.ts` | Server architecture and file serving | `FrontendBackendArchitecture.Tests.ps1` |
| `gridLayout.spec.ts` | Grid layout with golden ratio | `GridLayout.Tests.ps1` |
| `mediaPlaceholder.spec.ts` | Media placeholder behavior | `MediaPlaceholder.Tests.ps1` |
| `navWidth.spec.ts` | Navigation width calculations | `NavWidth.Tests.ps1` |
| `obsoleteFileCheck.spec.ts` | File organization and cleanup | `ObsoleteFileCheck.Tests.ps1` |
| `serverPathFix.spec.ts` | Server path configuration | `ServerPathFix.Tests.ps1` |
| `tableImplementation.spec.ts` | Table component functionality | `TableImplementation.Tests.ps1` |
| `tableTheme.spec.ts` | Table theme integration | `TableThemeImplementation.Tests.ps1` |
| `tableThemeComponentIntegration.spec.ts` | Component integration | `TableThemeComponentIntegration.Tests.ps1` |
| `tabStyling.spec.ts` | Tab styling functionality | `TabStylingTest.ps1` |
| `templateLoader.spec.ts` | Website template generator | `TemplateLoader.Tests.ps1` |
| `themeGeneratorFileStructure.spec.ts` | Theme file organization | `ThemeGeneratorFileStructureTest.ps1` |
| `themeGeneratorRefactoring.spec.ts` | Refactored theme generator | `ThemeGeneratorRefactoringTests.ps1` |
| `themeGeneratorSimple.spec.ts` | Simple theme generation | `ThemeGeneratorSimpleTests.ps1` |
| `themeOrganization.spec.ts` | Theme directory organization | `ConsolidatedThemeTests.ps1` |
| `typescriptConfig.spec.ts` | TypeScript configuration | `TypescriptConfigTest.Tests.ps1` |

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
npx playwright test dynamicPages.spec.ts
```

### UI Mode (Interactive)
```bash
npm run test:ui
```

### Debug Mode
```bash
npm run test:debug
```

### Headed Mode (Show Browser)
```bash
npm run test:headed
```

### Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
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
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Parallel**: Yes (full parallel execution)
- **Retries**: 2 retries on CI, 0 locally

### TypeScript Configuration  
- **File**: `tsconfig.json`
- **Target**: ES2020
- **Module**: CommonJS
- **Strict mode**: Enabled

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chromium | Latest | ✅ Primary |
| Firefox | Latest | ✅ Supported |
| WebKit (Safari) | Latest | ✅ Supported |
| Mobile Chrome | Latest | ✅ Mobile Testing |
| Mobile Safari | Latest | ✅ Mobile Testing |

## 📝 Writing New Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name Tests', () => {
  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    const element = await page.locator('#element-id');
    await expect(element).toBeVisible();
  });
});
```

### Best Practices
1. **Use descriptive test names**
2. **Wait for network idle state**
3. **Use proper selectors** (prefer data-testid, id, or semantic selectors)
4. **Handle async operations** with proper waits
5. **Test mobile responsiveness**
6. **Include accessibility checks** where appropriate

## 🐛 Debugging Tests

### Debug Specific Test
```bash
npx playwright test --debug colorBar.spec.ts
```

### Generate Trace
```bash
npx playwright test --trace on
```

### Show Trace
```bash
npx playwright show-trace trace.zip
```

## 🔄 Migration from PowerShell

### Completed Migration
All PowerShell tests have been successfully converted to Playwright. The migration includes:

- ✅ All test logic preserved
- ✅ Enhanced with browser automation
- ✅ Cross-browser compatibility
- ✅ Visual testing capabilities
- ✅ Better error reporting
- ✅ CI/CD integration ready

### Cleanup
To remove old PowerShell tests (after verifying Playwright tests work):
```powershell
.\cleanup-ps1-tests.ps1
```

## 📈 Performance

### Test Execution Speed
- **Parallel execution**: Tests run simultaneously
- **Smart waiting**: Only wait as needed
- **Browser reuse**: Efficient browser management
- **Selective testing**: Run only changed tests

### CI/CD Integration
```yaml
# Example GitHub Actions integration
- name: Run Playwright tests
  run: npx playwright test
- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 🛠️ Maintenance

### Regular Tasks
1. **Update Playwright**: `npm update @playwright/test`
2. **Update browsers**: `npx playwright install`
3. **Review failing tests**: Check HTML reports
4. **Update test data**: Modify test fixtures as needed

### Troubleshooting

#### Tests Timing Out
- Increase timeout in test configuration
- Check for slow network requests
- Verify page load states

#### Element Not Found
- Use better selectors
- Add proper waits
- Check for dynamic content

#### Flaky Tests
- Add explicit waits
- Check for race conditions
- Use more stable selectors

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## 🏆 Benefits

### Over PowerShell Tests
- ✅ **Cross-browser testing**
- ✅ **Visual regression testing**
- ✅ **Better debugging tools**
- ✅ **Parallel execution**
- ✅ **Modern tooling**
- ✅ **CI/CD ready**
- ✅ **Better reporting**
- ✅ **Mobile testing**

### For Development
- 🚀 **Faster feedback**
- 🔍 **Better error messages**
- 📊 **Detailed reports**
- 🎯 **Targeted testing**
- 🔄 **Watch mode**
- 🖥️ **UI mode for debugging**

---

**Ready to test with modern tools!** 🚀
