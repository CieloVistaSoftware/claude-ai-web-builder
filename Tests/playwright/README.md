# Playwright Tests for ClaudeAIWebSiteBuilder

## Overview
This directory contains Playwright tests that replace the original PowerShell tests. Playwright provides a more robust, cross-browser testing solution with better debugging capabilities.

## Converted Tests

The following PowerShell tests have been converted to Playwright:

1. **ColorWheelImplementation.Tests.ps1** → **colorWheel.spec.ts**
   - Tests the color wheel functionality in hue-color-slider.html

2. **ConsolidatedColorBarTests.ps1** → **colorBar.spec.ts**
   - Tests color bar controls and functionality in the main website builder

3. **ConsolidatedDynamicPagesTests.ps1** → **dynamicPages.spec.ts**
   - Tests dynamic page creation and navigation features

4. **ConsolidatedFooterTests.ps1** → **footer.spec.ts**
   - Tests footer visibility controls and positioning options

5. **ConsolidatedThemeTests.ps1** → **themeOrganization.spec.ts**
   - Tests theme directory structure and organization
   - Validates theme file content and functionality

6. **TableThemeImplementation.Tests.ps1** → **tableTheme.spec.ts**
   - Tests table component with dark mode styling
   - Validates table.json data integration

7. **GridLayout.Tests.ps1** → **gridLayout.spec.ts**
   - Tests grid layout calculations using golden ratio
   - Validates responsive design breakpoints

8. **NavWidth.Tests.ps1** → **navWidth.spec.ts**
   - Tests navigation width calculations using Golden Ratio Foundation
   - Validates responsive navigation behavior

9. **MediaPlaceholder.Tests.ps1** → **mediaPlaceholder.spec.ts**
   - Tests media placeholder visibility and behavior
   - Validates drag and drop functionality

10. **CssStandardsValidation.Tests.ps1** → **cssStandards.spec.ts**
    - Validates CSS files against Unified Web Development Standards
    - Tests CSS variables and grid layouts

11. **FloatingTableThemeControls.Tests.ps1** → **floatingTableTheme.spec.ts**
    - Tests floating, draggable color control panel
    - Validates table theme controls functionality

12. **TabStylingTest.ps1** → **tabStyling.spec.ts**
    - Tests tab styling functionality in theme generator
    - Validates CSS custom properties for tabs

13. **TemplateLoader.Tests.ps1** → **templateLoader.spec.ts**
    - Tests website template generator functionality
    - Validates template loading and export features

14. **ThemeGeneratorSimpleTests.ps1** → **themeGeneratorSimple.spec.ts**
    - Tests refactored theme generator structure
    - Validates redirect functionality and file organization

15. **TypescriptConfigTest.Tests.ps1** → **typescriptConfig.spec.ts**
    - Tests TypeScript configuration
    - Validates include/exclude patterns and compiler options

## Conversion Summary

**Total Converted:** 15 major PowerShell test files → TypeScript Playwright tests

**Key Benefits:**
- Cross-browser testing (Chrome, Firefox)
- Better error reporting and debugging
- Screenshot capture on failures
- Parallel test execution
- Modern async/await syntax
- Type safety with TypeScript
- Integration with VS Code test explorer

## Remaining PowerShell Tests

Some PowerShell tests may still exist for specific tasks like:
- Port management and cleanup scripts
- File system operations
- Build and deployment scripts
- Development workflow automation

These may be kept as PowerShell scripts if they serve specific system administration purposes rather than application testing.

## Running the Tests

```bash
# Run all tests headlessly
npm test

# Run tests with UI for debugging
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run specific test suites
npm run test:colorWheel
npm run test:colorBar
npm run test:dynamicPages
npm run test:footer
npm run test:themeOrganization
npm run test:tableTheme
npm run test:gridLayout
npm run test:navWidth
npm run test:mediaPlaceholder
npm run test:cssStandards
npm run test:floatingTableTheme
npm run test:tabStyling
npm run test:templateLoader
npm run test:themeGeneratorSimple
npm run test:typescriptConfig
```

## Test Structure

Each test suite follows a similar pattern:
- Navigate to the relevant page
- Check for the existence of UI elements
- Test interactions with those elements
- Verify that the application responds correctly

## Benefits of Playwright

- Cross-browser testing (Chrome, Firefox)
- Parallel test execution
- Detailed reporting
- Visual debugging
- Trace recording for failed tests
- Screenshot capture on failures
