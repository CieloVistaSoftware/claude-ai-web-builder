# WB Framework Migration Guide v2.0

**Purpose:** Step-by-step process for refactoring components  
**Timeline:** 4-5 weeks (Phases 2-5)  
**Status:** Ready to execute  

---

## Phase 2: Foundation (Week 2)

### Step 1: Audit `wb-base`

**Checklist:**
```
[ ] Extends HTMLElement
[ ] Provides useShadow property
[ ] Handles shadow root creation
[ ] No specific UI logic
[ ] Other components extend it
[ ] Has tests
```

**If issues found:**
1. List all problems
2. Create refactor plan
3. Execute refactor
4. Run all dependent tests
5. Update status in claude.md

### Step 2: Refactor Color Utilities

**Files:**
- `wb-color-harmony.js`
- `wb-color-mapper.js`
- `wb-color-transformer.js`
- `wb-color-utils.js`

**For each utility:**
```
[ ] Pure JavaScript (no DOM)
[ ] No side effects
[ ] Testable independently
[ ] Used by other components
[ ] Has documentation
[ ] Has tests
```

---

## Phase 3: Decorators (Week 3-4)

### Step 1: Pick First Decorator

**Start with:** `wb-control-panel` or `wb-theme-provider`

### Step 2: Review Current Code

```bash
cat components/wb-control-panel/wb-control-panel.js
```

**Look for problems:**
- ❌ Modifying children
- ❌ Clearing innerHTML
- ❌ Using Shadow DOM
- ✅ Just wrapping content

### Step 3: Create Refactored Version

```bash
# 1. Copy template
cp ARCHITECTURE/DECORATOR-TEMPLATE.js wb-control-panel/wb-control-panel-v2.js

# 2. Edit the template
# - Replace DECORATOR_NAME with wb-control-panel
# - Replace DecoratorName with WBControlPanel
# - Implement logic

# 3. Keep as v2 for now (compare side-by-side)
```

### Step 4: Write Tests

```javascript
test('wraps children without modifying them', async ({ page }) => {
  await page.setContent(`
    <wb-control-panel>
      <div class="original">Original Content</div>
    </wb-control-panel>
  `);
  
  const originalContent = await page.$('.original');
  expect(originalContent).not.toBeNull();
  expect(await originalContent.textContent()).toBe('Original Content');
});

test('adds control panel output after children', async ({ page }) => {
  await page.setContent(`
    <wb-control-panel>
      <div>Content</div>
    </wb-control-panel>
  `);
  
  const controlOutput = await page.$('.decorator-wb-control-panel');
  expect(controlOutput).not.toBeNull();
});
```

### Step 5: Test & Verify

```bash
npx playwright test components/wb-control-panel/wb-control-panel.playwright.spec.js
```

If tests pass: ✅ Ready to merge  
If tests fail: ❌ Fix and re-test

### Step 6: Merge & Update Status

```bash
# Backup original
mv wb-control-panel.js wb-control-panel.old.js

# Use v2
mv wb-control-panel-v2.js wb-control-panel.js

# Delete old
rm wb-control-panel.old.js
```

**Update COMPONENT-CHECKLIST.md:**
```
Change wb-control-panel status to: ✅ DONE
```

### Step 7: Repeat for All 13 Decorators

**Priority order:**
1. `wb-control-panel`
2. `wb-theme-provider`
3. `wb-layout`
4. `wb-grid`
5-13. Others

---

## Phase 4: Components (Week 5-6)

### Step 1: Start with `wb-button`

### Step 2: Separate Concerns

**Current wb-button.js has:**
- ❌ Button logic
- ❌ Examples logic
- ❌ Clipboard logic

**After refactor:**
- ✅ Only button logic (in wb-button.js)
- ✅ Examples logic (in wb-examples-decorator.js)
- ✅ Clipboard logic (in wb-clipboard-decorator.js)

### Step 3: Create Pure Button

```bash
# Copy template
cp ARCHITECTURE/COMPONENT-TEMPLATE.js wb-button/wb-button-v2.js

# Edit:
# - Replace COMPONENT_NAME with wb-button
# - Replace ComponentName with WBButton
# - Keep ONLY button logic
# - Remove examples/clipboard code
```

### Step 4: Create Decorators

```bash
# Create examples decorator
cp ARCHITECTURE/DECORATOR-TEMPLATE.js wb-examples-decorator/wb-examples-decorator.js

# Create clipboard decorator
cp ARCHITECTURE/DECORATOR-TEMPLATE.js wb-clipboard-decorator/wb-clipboard-decorator.js

# Implement their createDecoratorOutput() logic
```

### Step 5: Update Tests

**Old test (wb-button.playwright.spec.js):**
```javascript
// ❌ OLD: Testing everything together
test('renders examples block', async ({ page }) => { ... });
```

**New tests:**
```javascript
// ✅ NEW: Only test button
test('renders button without error', async ({ page }) => { ... });

// ✅ NEW: Test decorator separately
test('wb-examples-decorator wraps button', async ({ page }) => { ... });

// ✅ NEW: Test composition
test('wb-button works with wb-examples-decorator', async ({ page }) => { ... });
```

### Step 6: Test & Verify

```bash
# Test pure button
npx playwright test components/wb-button/wb-button.playwright.spec.js

# Test examples decorator
npx playwright test components/wb-examples-decorator/wb-examples-decorator.playwright.spec.js

# Test composition (together)
npx playwright test components/**/composition.spec.js
```

### Step 7: Repeat for Other Components

**Priority:**
1. `wb-button` ✅
2. `wb-input`
3. `wb-select`
4. `wb-card`
5. `wb-modal`
6. Others...

---

## Phase 5: Validation (Week 7)

### Step 1: Integration Testing

```javascript
test('complex composition works', async ({ page }) => {
  await page.setContent(`
    <wb-control-panel>
      <wb-theme-provider colors="dark">
        <wb-layout-grid columns="2">
          <wb-examples-decorator>
            <wb-clipboard-decorator>
              <wb-button variant="primary">Save</wb-button>
            </wb-clipboard-decorator>
          </wb-examples-decorator>
        </wb-layout-grid>
      </wb-theme-provider>
    </wb-control-panel>
  `);
  
  expect(await page.$('wb-button')).not.toBeNull();
  expect(await page.$('wb-control-panel')).not.toBeNull();
});
```

### Step 2: Performance Check

- Measure load time
- Measure render time
- Compare to old version
- Should be same or better

### Step 3: Documentation Review

For each component:
```
[ ] README.md updated
[ ] API documented
[ ] Examples current
[ ] Migration notes included
[ ] claude.md status updated
```

### Step 4: Release v2.0

```bash
# Update version
# Edit: components/package.json
# "version": "2.0.0"

# Update CHANGELOG
# Add: Migration notes, breaking changes

# Tag release
# git tag v2.0.0
```

---

## Troubleshooting

### Problem: Tests timeout

**Cause:** Component not registering  
**Fix:**
```javascript
await page.waitForFunction(() => customElements.get('wb-button'), 
  { timeout: 5000 });
```

### Problem: CSS not loading

**Cause:** Path resolution issue  
**Fix:**
```javascript
// Use import.meta.url for CSS paths
link.href = new URL('./wb-button.css', import.meta.url).href;
```

### Problem: Children get modified

**Cause:** Using innerHTML after saving  
**Fix:**
```javascript
// ✅ RIGHT way (children preserved)
const html = this.innerHTML;
this.appendChild(decorator);  // Adds after children
```

---

## Success Checklist

Before declaring component "DONE":

**Code Quality:**
- [ ] Follows template
- [ ] No console.log()
- [ ] Comments on complex logic
- [ ] Under 150 lines
- [ ] Consistent naming

**Testing:**
- [ ] Playwright tests pass
- [ ] Edge cases covered
- [ ] Works with decorators
- [ ] No console errors

**Documentation:**
- [ ] API documented
- [ ] Examples accurate
- [ ] Demo works
- [ ] claude.md updated

---

**Status:** Ready to execute  
**Timeline:** 4-5 weeks  
**Next:** Begin Phase 2
