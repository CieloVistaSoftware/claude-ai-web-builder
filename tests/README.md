# WB Framework - Playwright Tests

## Setup

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Version 16 or higher required

2. **Navigate to tests folder:**
   ```bash
   cd C:\Users\jwpmi\Downloads\AI\wb\tests
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Install Playwright browsers:**
   ```bash
   npx playwright install chromium
   ```

## Running Tests

### Run all tests (headless):
```bash
npm test
```

### Run tests with browser visible:
```bash
npm run test:headed
```

### Run tests in debug mode:
```bash
npm run test:debug
```

### Run tests with UI mode (best for development):
```bash
npm run test:ui
```

### Run specific test file:
```bash
npx playwright test wb-shadow-diagnostics.spec.js
```

## Before Running Tests

**IMPORTANT:** Make sure your Python server is running:

```bash
# In a separate terminal, from the wb/components folder:
cd C:\Users\jwpmi\Downloads\AI\wb\components
python simple-server.py
```

The tests will check that `http://localhost:8080` is available.

## Test Results

- Test results will be saved to `playwright-report/` folder
- Screenshots of failures will be in `test-results/` folder
- Open HTML report: `npx playwright show-report`

## What the Tests Check

1. **Diagnostic Tool Loads** - Page loads correctly with all buttons
2. **Component Dropdown** - All WB components listed
3. **Auto-update Paths** - JS/CSS paths update when component changes
4. **Environment Checks** - Browser APIs available
5. **Component Import** - wb-button imports and registers correctly
6. **Shadow DOM Detection** - Detects Shadow DOM presence/absence
7. **EXPECTED vs ACTUAL** - Shows configuration vs reality
8. **Statistics** - Final verdict with pass/fail counts
9. **Visibility** - Buttons are visible with dimensions
10. **Reset Button** - Resets to wb-button configuration

## Troubleshooting

**Port 8080 already in use:**
- Stop your Python server and let Playwright start it automatically
- OR change the port in `playwright.config.js`

**Tests timing out:**
- Increase timeout in test file: `test.setTimeout(30000);`
- Check that `http://localhost:8080/components/wb-shadow-diagnostics.html` loads in browser

**Module not found:**
- Run `npm install` again
- Make sure you're in the `/tests` folder

## Expected Test Results

**Currently:** Some tests will FAIL because wb-button has browser cache issues preventing CSS from loading in Shadow DOM.

**After fixing cache:** All tests should PASS when:
- Shadow DOM is created ✅
- CSS link is present in Shadow DOM ✅
- Colors are correct (not gray) ✅
- MATCH shown (config matches reality) ✅
