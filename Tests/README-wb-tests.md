# Website Builder Main Page Test

This test suite comprehensively tests all functions on the main website builder page at `http://localhost:8000/`.

## Test Coverage

### Control Panel Functions
- ✅ Minimize/restore control panel
- ✅ Toggle edit mode on/off
- ✅ Change layout styles (top-nav, left-nav, right-nav)
- ✅ Color explorer functionality
- ✅ Theme switching
- ✅ Custom color controls
- ✅ Save and reset buttons

### Content Editing Functions
- ✅ Enable/disable content editing
- ✅ Text editing of content elements
- ✅ Media placeholder interactions

### Navigation Functions
- ✅ Navigation link functionality
- ✅ Content section visibility

### Footer Functions
- ✅ Footer link functionality
- ✅ Footer content display

### Status Bar Functions
- ✅ Status message display
- ✅ Edit mode status updates

### Responsive Design Tests
- ✅ Mobile viewport (375x667)
- ✅ Tablet viewport (768x1024)
- ✅ Desktop viewport (1920x1080)

### JavaScript Functionality Tests
- ✅ JavaScript file loading
- ✅ Global function availability
- ✅ Event handler functionality

### Performance Tests
- ✅ Page load time
- ✅ Basic accessibility checks

### Error Handling Tests
- ✅ Missing resource handling
- ✅ Invalid input handling

## Running the Tests

### Prerequisites
1. Start the server: `npm run start`
2. Ensure server is running at `http://localhost:8000/`

### Run All Tests
```bash
npx playwright test tests/wb-main-page.spec.ts
```

### Run Specific Test Groups
```bash
# Test only control panel functions
npx playwright test tests/wb-main-page.spec.ts -g "Control Panel Functions"

# Test only responsive design
npx playwright test tests/wb-main-page.spec.ts -g "Responsive Design Tests"

# Test only JavaScript functionality
npx playwright test tests/wb-main-page.spec.ts -g "JavaScript Functionality Tests"
```

### Run with UI Mode (Interactive)
```bash
npx playwright test tests/wb-main-page.spec.ts --ui
```

### Generate Test Report
```bash
npx playwright test tests/wb-main-page.spec.ts --reporter=html
```

## Expected Issues to Test

Based on the comprehensive test coverage, this will identify:

1. **Broken JavaScript Functions** - Any control panel buttons that don't work
2. **Layout Issues** - Problems with responsive design or layout switching
3. **Edit Mode Problems** - Content editing functionality failures
4. **Theme System Issues** - Theme switching or color control problems
5. **Navigation Problems** - Broken links or missing sections
6. **Performance Issues** - Slow loading or resource problems
7. **Accessibility Issues** - Missing labels or poor contrast
8. **Error Handling** - How the page handles failures

## Test Results Analysis

After running the tests, check:
- **Test Summary** - How many tests passed/failed
- **Screenshots** - Visual evidence of failures
- **Console Logs** - JavaScript errors or warnings
- **Network Issues** - Failed resource loading
- **Timing Issues** - Performance bottlenecks

This comprehensive test suite will identify exactly what functions are working and what needs to be fixed on the main website builder page.