# Testing Infrastructure Fix Guide - Task #1

**File**: `TESTING-INFRASTRUCTURE-FIX.md`  
**Location**: `/docs/component-guides/`  
**Priority**: 🔴 CRITICAL | **Time**: 1-2 hours | **Status**: ⏳ READY TO DEBUG

---

## 🎯 The Problem

```
❌ "Cannot navigate to invalid URL"
❌ Component demo files not being served
❌ Path resolution issues
❌ Tests cannot execute
```

---

## 🔍 Root Causes

1. **Test Server** - Not starting on correct port or serving from wrong directory
2. **Component Paths** - Demo files not found at expected URLs
3. **File Serving** - Missing MIME types for .js, .css, .json
4. **Test URLs** - Incorrect paths in test files

---

## 🛠️ Fix #1: Update Test Server

**File**: `/tests/test-server.js`

```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;
const PROJECT_ROOT = path.join(__dirname, '..');

// Serve static files
app.use(express.static(PROJECT_ROOT));

// MIME types
app.use((req, res, next) => {
    if (req.path.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    if (req.path.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    if (req.path.endsWith('.json')) res.setHeader('Content-Type', 'application/json');
    next();
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, 'index.html'));
});

// 404 with helpful message
app.use((req, res) => {
    console.warn(`[Server] 404: ${req.path}`);
    res.status(404).send(`
        <h1>404 - Not Found</h1>
        <p>Requested: ${req.path}</p>
        <p>Try: <a href="/components/wb-tab/wb-tab-demo.html">/components/wb-tab/wb-tab-demo.html</a></p>
    `);
});

app.listen(PORT, () => {
    console.log(`✅ Test Server: http://localhost:${PORT}`);
    console.log(`📁 Serving from: ${PROJECT_ROOT}`);
});
```

---

## 🛠️ Fix #2: Update Playwright Config

**File**: `playwright.config.cjs`

```javascript
module.exports = {
    webServer: {
        command: 'node tests/test-server.js',
        port: 3000,
        reuseExistingServer: false,
        timeout: 120 * 1000,
        stdout: 'pipe',
        stderr: 'pipe',
    },
    
    use: {
        baseURL: 'http://localhost:3000',
        navigationTimeout: 30000,
        actionTimeout: 10000,
    },
    
    timeout: 30 * 1000,
    navigationTimeout: 30 * 1000,
    fullyParallel: false,
    maxFailures: 1,
    
    projects: [
        {
            name: 'chromium',
            use: { ...require('@playwright/test').chromium },
        },
    ],
    
    reporter: 'html',
};
```

---

## 🛠️ Fix #3: Update Component Tests

**File**: `tests/wb-tab/wb-tab.spec.ts`

```javascript
import { test, expect } from '@playwright/test';

test.describe('wb-tab Component', () => {
    
    test.beforeEach(async ({ page }) => {
        // ✅ Use relative URL (baseURL is automatically prepended)
        await page.goto('/components/wb-tab/wb-tab-demo.html');
        await page.waitForSelector('wb-tab', { timeout: 5000 });
        await page.waitForTimeout(500);
    });
    
    test('should render tabs', async ({ page }) => {
        const tab = page.locator('wb-tab').first();
        await expect(tab).toBeVisible();
        
        const buttons = await page.locator('wb-tab >>> .tab-button').count();
        expect(buttons).toBeGreaterThan(0);
    });
    
    test('should switch tabs on click', async ({ page }) => {
        const buttons = page.locator('wb-tab >>> .tab-button');
        const secondBtn = buttons.nth(1);
        
        await secondBtn.click();
        await expect(secondBtn).toHaveClass(/active/);
    });
    
    test('should load config from JSON', async ({ page }) => {
        const configTab = page.locator('wb-tab[config-url]');
        await page.waitForTimeout(1000);
        
        const buttons = await configTab.locator('>>> .tab-button').count();
        expect(buttons).toBeGreaterThan(0);
    });
});
```

---

## 🧪 Testing the Fix

### Step 1: Start Server Manually
```bash
node tests/test-server.js
# Output: ✅ Test Server: http://localhost:3000
```

### Step 2: Test URLs Work
```bash
curl -I http://localhost:3000/components/wb-tab/wb-tab-demo.html
# Response: 200 OK
```

### Step 3: Run Tests
```bash
npx playwright test tests/wb-tab/ --config=playwright.config.cjs
# Should see: ✅ tests/wb-tab/wb-tab.spec.ts (3 tests)
```

### Step 4: View Report
```bash
npx playwright show-report
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot navigate to invalid URL" | Check `baseURL` in playwright.config.cjs |
| 404 errors | Verify files exist at `/components/*/` paths |
| Module not defined | Add MIME type config to test server |
| Timeout waiting for selector | Add longer wait times in beforeEach |

---

## 📋 Verification Checklist

- [ ] Test server starts automatically
- [ ] Files served from correct directory
- [ ] MIME types set correctly
- [ ] Component demos accessible
- [ ] Tests navigate successfully
- [ ] Shadow DOM accessible
- [ ] Tests pass without errors
- [ ] Report generates

---

## 💻 Quick Commands

```bash
# Manual server test
node tests/test-server.js

# Run tests
npx playwright test --config=playwright.config.cjs

# Run specific tests
npx playwright test tests/wb-tab/ --config=playwright.config.cjs

# Debug mode
npx playwright test --debug --config=playwright.config.cjs

# Show report
npx playwright show-report
```

---

**Location**: `/docs/component-guides/TESTING-INFRASTRUCTURE-FIX.md`
