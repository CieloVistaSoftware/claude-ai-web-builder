# WB Component Testing Standards

## 🎯 **MANDATORY**: Every WB Component Must Have Tests

**RULE**: No WB component is complete without comprehensive tests that prove the implementation is correct.

## Test Requirements Checklist

### ✅ **Required Test Files**

Every WB component must include tests in the main `/tests` directory:

```
tests/wb-[component-name]/
├── wb-[component-name]-comprehensive.spec.ts  # Main test suite (REQUIRED)
├── wb-[component-name]-animation.spec.ts      # Animation tests (if applicable)
├── wb-[component-name]-specific.spec.ts       # Feature-specific tests (if needed)
└── README.md                                  # Test documentation (OPTIONAL)
```

**Integration with Existing Structure:**
- Uses project's Playwright configuration (`playwright.real.config.cjs`)
- Follows TypeScript test patterns (`.spec.ts` files)
- Integrates with existing test server and infrastructure
- Uses established testing patterns from wb-modal and other components

### ✅ **Required Test Coverage**

**Minimum Coverage Thresholds:**
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80% 
- **Statements**: 80%

**Must Test:**
1. **✅ Component Initialization**
   - Renders with shadow DOM
   - Attributes are processed correctly
   - Default values are applied
   - Schema loading works

2. **✅ Core Functionality**
   - All public methods work
   - All event handlers function
   - State management is correct
   - Data binding works properly

3. **✅ User Interactions**
   - Click events work
   - Keyboard navigation functions
   - Touch/mobile interactions
   - Focus management

4. **✅ Accessibility (WCAG 2.1 AA)**
   - ARIA attributes are set
   - Keyboard navigation works
   - Screen reader compatibility
   - Focus indicators visible
   - Color contrast sufficient

5. **✅ Visual Appearance**
   - All variants render correctly
   - Themes apply properly
   - Responsive behavior works
   - Cross-browser compatibility

6. **✅ Error Handling**
   - Invalid inputs handled gracefully
   - Missing dependencies don't crash
   - Network failures are managed
   - Edge cases covered

7. **✅ Performance**
   - Component loads within time limits
   - No memory leaks
   - Efficient DOM updates
   - Large datasets handled well

### ✅ **Test Types Required**

1. **Unit Tests** (`*.test.js`)
   - Component logic testing
   - Method functionality
   - Event dispatching
   - State management
   - Error conditions

2. **End-to-End Tests** (`*.e2e.test.js`)
   - User interaction workflows
   - Visual regression testing
   - Cross-browser compatibility
   - Mobile responsiveness
   - Accessibility compliance

3. **Integration Tests** (when applicable)
   - Component interaction with other WB components
   - Theme system integration
   - Event system integration

## Component Test Template

### WB Component Test Structure (TypeScript + Playwright)

```typescript
/**
 * COMPREHENSIVE WB [ComponentName] Tests
 * Tests every single property, method, and behavior of the wb-[component-name] component
 * Following the established WB project testing patterns
 */

import { test, expect } from '@playwright/test';

test.describe('WB [ComponentName] - Comprehensive Component Tests', () => {
    
    test.beforeEach(async ({ page }) => {
        // Navigate to component demo page
        await page.goto('/components/wb-[component-name]/wb-[component-name]-demo.html');
        
        // Wait for component to load
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000); // Wait for component initialization
        
        // Wait for component ready
        await page.waitForSelector('wb-[component-name]');
    });

    test.describe('Web Component Creation and Registration', () => {
        
        test('wb-[component-name] custom element is registered', async ({ page }) => {
            const isRegistered = await page.evaluate(() => {
                return customElements.get('wb-[component-name]') !== undefined;
            });
            expect(isRegistered).toBe(true);
        });

        test('can create wb-[component-name] element programmatically', async ({ page }) => {
            const componentCreated = await page.evaluate(() => {
                const component = document.createElement('wb-[component-name]');
                return component.tagName === 'WB-[COMPONENT-NAME]';
            });
            expect(componentCreated).toBe(true);
        });
    });

    test.describe('Component Initialization and Rendering', () => {
        
        test('component renders correctly', async ({ page }) => {
            const component = page.locator('#main-component');
            await expect(component).toBeVisible();
            
            // Check shadow DOM exists
            const hasShadowRoot = await page.evaluate(() => {
                const comp = document.querySelector('#main-component') as any;
                return comp.shadowRoot !== null;
            });
            expect(hasShadowRoot).toBe(true);
        });
    });

    test.describe('Core Functionality', () => {
        
        test('main functionality works correctly', async ({ page }) => {
            // Test component's primary functionality
        });
    });

    test.describe('User Interactions', () => {
        
        test('click interactions work', async ({ page }) => {
            // Test click handling
        });
        
        test('keyboard navigation works', async ({ page }) => {
            // Test keyboard interaction
        });
    });

    test.describe('Accessibility Features', () => {
        
        test('ARIA attributes are correctly set', async ({ page }) => {
            // Test ARIA compliance
        });
        
        test('keyboard navigation is accessible', async ({ page }) => {
            // Test keyboard accessibility
        });
    });

    test.describe('Visual Regression Tests', () => {
        
        test('component renders with correct styling', async ({ page }) => {
            const component = page.locator('#main-component');
            await expect(component).toHaveScreenshot('[component-name].png');
        });
    });

    test.describe('Cross-Browser Compatibility', () => {
        
        test('works consistently across browsers', async ({ page, browserName }) => {
            // Browser-specific tests
            await expect(page.locator('#main-component')).toHaveScreenshot(`[component-name]-${browserName}.png`);
        });
    });
});
```

## Testing Commands (Using Existing WB Infrastructure)

### Run Tests Using Project Scripts

```bash
# Run all tests (uses existing Playwright config)
npm test

# Run tests with UI mode
npm run test:ui

# Run specific component tests
npx playwright test tests/wb-[component-name]/

# Run tests for specific browser
npx playwright test --project=chromium tests/wb-[component-name]/

# Generate test report
npx playwright show-report
```

### Existing Project Scripts Available:
- `npm test` - Main test command
- `npm run test:ui` - Interactive test UI  
- `npm run test:config` - Test configuration
- `npm run test:failfast` - Stop on first failure
- `npm run test:safe` - Run with health checks

## Test Quality Gates

### ⛔ **BLOCKING**: Component Cannot Be Merged Without

1. **✅ All tests passing**
2. **✅ Coverage thresholds met** (80%+)
3. **✅ Visual regression tests passing**
4. **✅ Accessibility tests passing**
5. **✅ Cross-browser compatibility verified**
6. **✅ Performance benchmarks met**

### 🚨 **CRITICAL**: Test Failures That Block Release

- Any test failure in production build
- Coverage drop below thresholds
- Accessibility compliance failures
- Performance regression > 20%
- Visual regression without approval

## Testing Tools and Dependencies

### Dependencies (Already Available in WB Project)

The WB project already includes all necessary testing dependencies:

```json
{
  "devDependencies": {
    "@playwright/test": "^1.37.0",
    "typescript": "^5.0.0",
    "jest": "^29.6.0",
    "jsdom": "^22.1.0"
  }
}
```

### Existing Infrastructure:
- **Playwright**: Main testing framework with comprehensive browser support
- **TypeScript**: Type-safe test development
- **HTTP Server**: Test server configuration already set up
- **Visual Regression**: Screenshot comparison built-in
- **Test Reporting**: HTML reports with trace viewing

## Component-Specific Test Patterns

### Form Components
- Input validation
- Form submission
- Error state handling
- Field dependencies

### Navigation Components  
- Route handling
- Active state management
- Breadcrumb generation
- Menu interactions

### Data Display Components
- Data loading states
- Sorting and filtering
- Pagination
- Empty states

### Interactive Components
- State transitions
- Animation completion
- Gesture recognition
- Multi-step workflows

## Continuous Integration

### GitHub Actions Integration

```yaml
name: WB Component Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:all
      - uses: codecov/codecov-action@v3
```

## Test Review Process

### Before Merging PR

1. **✅ All tests pass locally**
2. **✅ All tests pass in CI**
3. **✅ Coverage reports reviewed**
4. **✅ Visual diffs approved**
5. **✅ Performance metrics acceptable**
6. **✅ Accessibility audit passed**

### Code Review Requirements

- Test completeness verified
- Test quality assessed
- Edge cases covered
- Performance implications reviewed
- Accessibility compliance confirmed

## Documentation Requirements

### Test README Must Include

1. **✅ Test overview and strategy**
2. **✅ How to run all test types**
3. **✅ Coverage requirements**
4. **✅ Known issues or limitations**
5. **✅ Debugging instructions**
6. **✅ Contributing guidelines**

### Inline Test Documentation

```javascript
/**
 * Test suite description explaining what is being tested
 * and why it's important for component functionality
 */
describe('Feature Name', () => {
    /**
     * Specific test case explaining the expected behavior
     * and any setup or teardown requirements
     */
    test('should do something specific', () => {
        // Test implementation with comments
    });
});
```

## Test Maintenance

### Regular Tasks

- **Monthly**: Update test dependencies
- **Per Release**: Review coverage reports
- **Per Feature**: Add tests for new functionality  
- **Per Bug Fix**: Add regression tests
- **Quarterly**: Performance benchmark review

### Test Debt Management

- Flaky tests must be fixed immediately
- Outdated tests must be updated or removed
- Missing test coverage must be addressed
- Performance tests must be kept current

## Enforcement

### Component Acceptance Criteria

**A WB component is NOT complete until:**

1. ✅ Comprehensive test suite exists
2. ✅ All tests pass consistently
3. ✅ Coverage thresholds are met
4. ✅ Visual regression tests pass
5. ✅ Accessibility tests pass
6. ✅ Documentation is complete
7. ✅ Code review is approved

**No exceptions to this policy.**

---

## 🎯 **Summary**: Testing is Not Optional

Every WB component must prove its correctness through comprehensive testing. This ensures:

- **Quality**: Components work as expected
- **Reliability**: Components don't break in production
- **Accessibility**: Components work for all users
- **Maintainability**: Changes can be made safely
- **Documentation**: Behavior is clearly specified

**Testing is an integral part of component development, not an afterthought.**