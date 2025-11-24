# Component: wb-button

**Status**: ✅ PRODUCTION READY (Light DOM)  
**Last Updated**: November 23, 2025  
**Implementation**: Light DOM (`static useShadow = false`)  
**Location**: `/components/wb-button/`

---

## 📋 Quick Reference

| Property | Value |
|----------|-------|
| **Purpose** | Standardized button with variants, sizes, states, status indicators |
| **Dependencies** | wb-base, wb-css-loader |
| **Files** | wb-button.js (305 lines), wb-button.css (376 lines) |
| **Current Mode** | Light DOM |
| **Shadow DOM** | Working pattern documented (not in production) |
| **Tests** | 40+ Playwright tests passing ✅ |

---

## 🎯 Features

```html
<wb-button variant="primary" size="medium">Click Me</wb-button>
<wb-button variant="toggle" active="true">Toggle Button</wb-button>
```

- **Variants**: primary, secondary, success, toggle
- **Sizes**: small, medium, large  
- **States**: active, disabled
- **Status Indicators**: active (green), inactive (red), neutral (gray)
- **Events**: wb-button:click, wb-button:toggle, wb-button:ready

---

## 🔴 CRITICAL ISSUES & SOLUTIONS

### Issue #1: Buttons Invisible (Zero Dimensions)

**Date**: November 23, 2025

**Problem**: 
Buttons existed in DOM but had `width: 0, height: 0` - completely invisible

**Symptom**: 
```javascript
button.getBoundingClientRect() // { width: 0, height: 0 }
```

**Root Cause**: 
Rendering to Light DOM while Shadow DOM was active

**Wrong Code**:
```javascript
// ❌ Light DOM hidden by Shadow DOM
render() {
  this.innerHTML = '<button>...</button>';
}
```

**Solution**:
```javascript
// ✅ Render to Shadow DOM
render() {
  this.shadowRoot.innerHTML = '<button>...</button>';
}
```

**Result**: 
✅ Buttons became visible with proper dimensions

---

### Issue #2: All Buttons Gray (No Colors)

**Date**: November 23, 2025

**Problem**: 
All buttons rendered as `rgb(240, 240, 240)` regardless of variant
- Primary should be blue `hsl(240, 70%, 50%)` → was gray
- Success should be green `hsl(120, 65%, 45%)` → was gray  
- Secondary should be dark `hsl(240, 35%, 35%)` → was gray

**Investigation**:
1. ✅ Shadow DOM HTML correct - classes present: `wb-btn wb-btn--primary`
2. ✅ CSS link tag exists in Shadow DOM
3. ❌ **CSS FILE PATH WRONG** ← Found it!

**Root Cause**: 
Absolute path instead of relative path caused 404 error

**Wrong Code**:
```javascript
// ❌ Doubles the path, 404 error
link.href = './components/wb-button/wb-button.css';
// Results in: /components/wb-button/components/wb-button/wb-button.css
// HTTP Status: 404 Not Found
```

**Solution**:
```javascript
// ✅ Relative to component folder
link.href = './wb-button.css';
// Results in: /components/wb-button/wb-button.css
// HTTP Status: 200 OK
```

**Result**: 
✅ All buttons immediately showed correct colors (blue, green, gray)

---

### Issue #3: CSS Disappears on Re-render

**Date**: November 23, 2025

**Problem**: 
Colors work initially but disappear when attributes change

**Root Cause**: 
`shadowRoot.innerHTML` replaces ALL content including CSS link

**Wrong Code**:
```javascript
// ❌ Wipes out CSS every render
render() {
  this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="./wb-button.css">
    <button>...</button>
  `;
}
```

**Solution**:
```javascript
// ✅ CSS loaded once, content updates separately
async setupShadowDOM() {
  // Add CSS link ONCE
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './wb-button.css';
  this.shadowRoot.appendChild(link);
  
  // Add container ONCE
  const container = document.createElement('div');
  container.id = 'button-container';
  this.shadowRoot.appendChild(container);
  
  await new Promise(resolve => {
    link.onload = resolve;
    link.onerror = resolve;
  });
}

render() {
  const container = this.shadowRoot.querySelector('#button-container');
  container.innerHTML = '<button>...</button>'; // Only updates content
}
```

**Result**: 
✅ CSS persists across all re-renders

---

### Issue #4: CSS Variables Confusion

**Date**: November 23, 2025

**Problem**: 
Thought CSS variables from `:root` wouldn't work in Shadow DOM

**Root Cause**: 
Misconception - CSS custom properties AUTOMATICALLY inherit into Shadow DOM

**Reality**:
```css
/* main.css - Outside Shadow DOM */
:root {
  --primary: hsl(240, 70%, 50%);
}

/* wb-button.css - Inside Shadow DOM */
.wb-btn--primary {
  background: var(--primary);  /* ✅ WORKS! Auto-inherits from :root */
}
```

**Solution**: 
No special work needed - just use `var()` normally

**Result**: 
✅ CSS variables work automatically in Shadow DOM

---

## 📖 Complete Shadow DOM Pattern (Working)

```javascript
class WBButton extends WBBaseComponent {
  static useShadow = true;  // Enable Shadow DOM
  
  constructor() {
    super();
    this._cssLoaded = false;
  }
  
  async connectedCallback() {
    super.connectedCallback();
    this._buttonText = this.textContent.trim();
    await this.setupShadowDOM();
    this.render();
  }
  
  async setupShadowDOM() {
    if (!this.shadowRoot || this._cssLoaded) return;
    
    // 1. Add CSS link (ONCE, relative path is critical)
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './wb-button.css';  // ← Relative to component folder!
    this.shadowRoot.appendChild(link);
    
    // 2. Add container (ONCE)
    const container = document.createElement('div');
    container.id = 'button-container';
    this.shadowRoot.appendChild(container);
    
    // 3. Wait for CSS to load
    await new Promise(resolve => {
      link.onload = () => {
        this._cssLoaded = true;
        resolve();
      };
      link.onerror = resolve;
    });
  }
  
  render() {
    if (!this.shadowRoot) return;
    
    const container = this.shadowRoot.querySelector('#button-container');
    if (!container) return;
    
    // Update only the container content (CSS stays untouched)
    container.innerHTML = `
      <button class="wb-btn wb-btn--${this.getVariant()}">
        <slot>${this._buttonText}</slot>
      </button>
    `;
  }
}
```

---

## 🔧 Diagnostic Tool

**Location**: `/components/wb-shadow-diagnostics.html`

**Purpose**: Universal Shadow DOM diagnostic for ANY WB component

**Why Created**: After 3+ hours debugging, created comprehensive diagnostic tool

**Usage**:
```
http://localhost:8080/components/wb-shadow-diagnostics.html
```

**12 Diagnostic Sections**:
1. Environment Check (Custom Elements API, Shadow DOM support)
2. CSS Variables (Verify :root variables with previews)
3. Component Registration (Tag registered? useShadow value?)
4. Test Instances (Configurable test HTML)
5. Shadow DOM Structure (Root exists? Children count?)
6. CSS Loading (HTTP 200 vs 404? File size?)
7. Element Inspection (What's in Shadow DOM?)
8. Computed Styles (Actual backgroundColor values)
9. Dimensions & Visibility (Width, height visible?)
10. Attributes (What attributes set?)
11. Raw HTML Dump (Complete Shadow DOM innerHTML)
12. Final Verdict (Pass/fail with specific issues)

**Configuration Panel**:
- Component tag name (e.g., `wb-button`)
- JS file path (e.g., `./wb-button.js`)
- CSS file name (e.g., `wb-button.css`)
- Test HTML (custom instances)

**What It Catches**:
- Shadow DOM not created
- CSS file 404 errors
- CSS path wrong (duplicated segments)
- Elements have no colors
- Elements invisible (zero dimensions)
- Classes not applied
- CSS variables not defined

---

## 📝 Rules for Future Shadow DOM Components

### 1. CSS Path Must Be Relative
```javascript
// ❌ DON'T
link.href = './components/wb-button/wb-button.css';  // Absolute

// ✅ DO
link.href = './wb-button.css';  // Relative to component folder
```

### 2. Render to Shadow DOM, Not Light DOM
```javascript
// ❌ DON'T
this.innerHTML = '<button>...</button>';  // Hidden by Shadow DOM

// ✅ DO
this.shadowRoot.innerHTML = '<button>...</button>';  // Visible
```

### 3. Keep CSS Separate from Content
```javascript
// ❌ DON'T
render() {
  this.shadowRoot.innerHTML = `<link>...<button>...`;  // Replaces CSS
}

// ✅ DO
setupShadowDOM() {
  // Add CSS once
}
render() {
  container.innerHTML = '<button>...';  // Update only content
}
```

### 4. CSS Variables Inherit Automatically
```css
/* No special work needed! */
.wb-btn {
  background: var(--primary);  /* Inherits from :root */
}
```

### 5. Always Test CSS Loading
- Check Network tab for 404 errors
- Verify full resolved URL
- Use diagnostic tool to confirm HTTP 200

---

## 🔍 Diagnostic Process for Shadow DOM

1. **Shadow DOM exists?** `!!element.shadowRoot`
2. **Has content?** `shadowRoot.childNodes.length > 0`
3. **Elements rendered?** `shadowRoot.querySelector('*')`
4. **Elements visible?** `getBoundingClientRect()` width/height > 0
5. **CSS link present?** `shadowRoot.querySelector('link')`
6. **CSS loads?** `fetch(link.href)` returns status 200
7. **Classes applied?** `button.className` has variant classes
8. **Styles applied?** `getComputedStyle()` shows colors

---

## 🎯 Production Decision: Light DOM

**Current**: `static useShadow = false` (Light DOM)

**Reasoning**:
- Simpler and faster
- No CSS loading complexity
- Page-level CSS works naturally
- Better debugging (inspect shows everything)
- All 40+ tests passing

**Shadow DOM Available**:
- Full working pattern documented above
- Tested and verified working
- Can enable by changing `static useShadow = true` and updating render
- Diagnostic tool ready for testing

---

## 🗑️ Cleanup Completed

**Test Files Deleted** (16 files):
- CSS-LOAD-TEST.html
- SHADOW-INSPECTOR.html
- simple-test.html
- TRUE-COLOR-TEST.html
- DIAGNOSTIC-FIXED.html
- CONSOLE-TEST.html
- COLOR-TEST.html
- wb-button-diagnostics.html
- wb-button-shadow-test.js
- wb-button-SHADOW.js (broken version)
- wb-button-SHADOW-FIXED.js (working test version)
- wb-button.backup.js
- cleanup.ps1
- cleanup-tests.bat

**Production Files** (6 files):
- ✅ wb-button.js (main component)
- ✅ wb-button.css (styles)
- ✅ wb-button-demo.html (demo)
- ✅ wb-button.md (documentation)
- ✅ wb-button.schema.json (schema)
- ✅ 🔴 claude.md (this file)

---

## ✅ Previous Issues (Resolved)

### Status Indicators Not Showing

**Date**: November 21, 2025

**Problem**: 
Green/red/gray dots not displaying

**Root Cause**: 
Demo missing `status` attribute support

**Solution**: 
Added `'status'` to observedAttributes

**Result**: 
✅ Status indicators working

---

### Documentation Tab Empty

**Date**: October 10, 2025

**Problem**: 
Documentation tab empty in wb-demo

**Root Cause**: 
wb-demo.js missing markdown loading logic

**Solution**: 
Added WBBaseComponent.renderMarkdownDoc logic

**Result**: 
✅ Documentation loads and displays

---

### Two Tabs Not Showing

**Date**: October 10, 2025

**Problem**: 
Demo didn't show Documentation/Examples tabs

**Root Cause**: 
wb-demo.js not imported

**Solution**: 
Added `<script type="module" src="../wb-demo/wb-demo.js"></script>`

**Result**: 
✅ Two-tab UI appears

---

## ✅ Testing Status

**Unit Tests**: 40+ tests in `tests/wb-button/wb-button.spec.js`

**Coverage**:
- Core functionality ✅
- All variants ✅
- All sizes ✅
- State management ✅
- Status indicators ✅
- Toggle functionality ✅
- Event handling ✅
- Dynamic attributes ✅
- Accessibility ✅
- Control panel integration ✅
- Theme compatibility ✅
- Grid and groups ✅
- Icon support ✅

**Run Tests**:
```bash
npx playwright test tests/wb-button/
npx playwright test tests/wb-button/ --ui
npx playwright test tests/wb-button/ -g "status indicators"
```

---

## 🔗 Related Components

| Relationship | Component |
|--------------|-----------|
| **Inherits From** | wb-base |
| **Uses** | wb-css-loader |
| **Used By** | wb-demo, wb-control-panel, app pages |

---

## 📚 Documentation

**See**: [wb-button.md](./wb-button.md) - Full component documentation  
**See**: [CONTRIBUTING.md](../../CONTRIBUTING.md) - Project rules and checklist

---
