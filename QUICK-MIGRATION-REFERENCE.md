# QUICK MIGRATION REFERENCE - 2 MINUTE TEMPLATE

**Print this out** - Use it for migrating each component

---

## Step 1: Open Component Files (30 seconds)

```
C:\Users\jwpmi\Downloads\AI\wb\components\wb-[NAME]\
  ├── wb-[NAME].js
  └── wb-[NAME].css
```

---

## Step 2: JavaScript Changes (45 seconds)

### Find and Change (Line ~15)
```javascript
// BEFORE
static useShadow = true;

// AFTER
static useShadow = false;
```

### Find and Remove - Shadow DOM CSS Loading
**Delete this entire block** (~10 lines):
```javascript
// REMOVE THIS:
async connectedCallback() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = ./wb-[name].css`;
  this.shadowRoot.appendChild(link);
  await new Promise(resolve => {
    link.onload = resolve;
  });
  this.render();
}

// REPLACE WITH:
async connectedCallback() {
  super.connectedCallback();
  this.classList.add('wb-component', 'wb-[name]');
  this.render();
}
```

### Find and Simplify - Rendering
```javascript
// BEFORE
render() {
  const target = this.shadowRoot || this;
  target.innerHTML = `...`;
}

// AFTER
render() {
  this.innerHTML = `...`;
}
```

---

## Step 3: CSS Changes (45 seconds)

### Replace All Hardcoded Colors

**Color Mapping**:
```css
#6366f1    → var(--color-primary)
#10b981    → var(--color-success)
#ef4444    → var(--color-danger)
#f59e0b    → var(--color-warning)
#3b82f6    → var(--color-info)

#2a2a2a    → var(--bg-secondary)
#1a1a1a    → var(--bg-primary)
#ffffff    → var(--text-primary)
#e0e0e0    → var(--text-secondary)
#404040    → var(--border-primary)
```

**Spacing Mapping**:
```css
0.25rem    → var(--spacing-xs)
0.5rem     → var(--spacing-sm)
1rem       → var(--spacing-md)
1.5rem     → var(--spacing-lg)
2rem       → var(--spacing-xl)
3rem       → var(--spacing-2xl)
```

**Find-Replace in Editor**:
1. Open CSS file
2. Use Find & Replace (Ctrl+H)
3. Replace each color pair
4. Test in browser

---

## Step 4: Test (30 seconds)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles/css-tokens.css">
</head>
<body>
  <wb-[name]>Test</wb-[name]>
  
  <script type="module">
    import('./utils/token-injector.js').then(m => {
      new m.TokenInjector('#6366f1').inject();
    });
  </script>
</body>
</html>
```

**Checklist**:
- [ ] No errors in console
- [ ] Component renders
- [ ] DevTools: No Shadow Root
- [ ] Colors match tokens

---

## Component Checklist

**Form Components** (8):
- [ ] wb-button ✅ DONE
- [ ] wb-input
- [ ] wb-select
- [ ] wb-toggle
- [ ] wb-slider
- [ ] wb-search
- [ ] wb-tab
- [ ] wb-checkbox

**Container Components** (8):
- [ ] wb-card
- [ ] wb-modal
- [ ] wb-header
- [ ] wb-footer
- [ ] wb-grid
- [ ] wb-layout
- [ ] wb-hero
- [ ] wb-panel

**Data Display** (8):
- [ ] wb-table
- [ ] wb-nav
- [ ] wb-status
- [ ] wb-color-bar
- [ ] wb-event-log
- [ ] wb-log-viewer
- [ ] wb-image-insert
- [ ] (4 more)

**Interactive** (8):
- [ ] wb-color-picker
- [ ] wb-color-harmony
- [ ] wb-color-mapper
- [ ] wb-color-transformer
- [ ] wb-control-panel
- [ ] wb-keyboard-manager
- [ ] wb-resize-panel
- [ ] wb-chatbot

**Utilities** (8+):
- [ ] wb-base ✅ DONE
- [ ] wb-css-loader
- [ ] wb-reactive-base
- [ ] (5+ more)

---

## Time Estimate

```
Per Component:
  JS changes:     45 seconds
  CSS changes:    45 seconds
  Testing:        30 seconds
  ─────────────────────────
  Total:          2 minutes

For All 41 Components:
  41 × 2 min = 82 minutes (~1.5 hours)

Recommended:
  Session 1: Tier 1 Forms (8 components) = 16 min
  Session 2: Tier 2 Containers (8) = 16 min
  Session 3: Tier 3 Data (8) = 16 min
  Session 4: Tier 4 Interactive (8) = 16 min
  Session 5: Tier 5 Utilities (9+) = 20 min
```

---

## Copy-Paste Template

**For wb-button replacement in connectedCallback**:
```javascript
async connectedCallback() {
  super.connectedCallback();
  this.classList.add('wb-component', 'wb-[component-name]');
  // CSS is global via styles/css-tokens.css
  this.render();
}
```

**For wb-button replacement in render**:
```javascript
render() {
  this.innerHTML = `<div class="...">content</div>`;
}
```

---

## Common Issues & Fixes

### Issue: "Shadow Root is null"
```javascript
// WRONG (Shadow DOM style):
const el = this.shadowRoot.querySelector('button');

// RIGHT (Light DOM style):
const el = this.querySelector('button');
```

### Issue: Styles not applying
```
Check: Is styles/css-tokens.css included in HTML head?
Check: Did you remove Shadow DOM CSS loading?
Check: Are CSS class names correct?
```

### Issue: Colors still hardcoded
```
Find & Replace all color values with tokens:
  #HEX values → var(--color-*)
  rgb(x,y,z) → var(--color-*)
  hsl(...)   → var(--color-*)
```

---

## Token Quick Reference

**Primary Colors**:
- `--color-primary` - Base
- `--color-primary-subtle` - Light (88%)
- `--color-primary-soft` - Medium (72%)
- `--color-primary-bold` - Dark (35%)
- `--color-primary-vivid` - Darkest (18%)

**Text**:
- `--text-primary` - Main text
- `--text-secondary` - Secondary
- `--text-tertiary` - Tertiary
- `--text-disabled` - Disabled

**Background**:
- `--bg-primary` - Main
- `--bg-secondary` - Secondary
- `--bg-tertiary` - Tertiary

**Borders**:
- `--border-primary`
- `--border-secondary`

**Spacing**:
- `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`

---

## Success Criteria ✓

For each component, confirm:
- [ ] `static useShadow = false`
- [ ] No Shadow DOM CSS loading code
- [ ] Render uses `this.innerHTML`
- [ ] All colors use token variables
- [ ] No hardcoded colors remain
- [ ] DevTools shows Light DOM
- [ ] Colors work from tokens
- [ ] No console errors

---

## VS Code Tips

**Find & Replace (Ctrl+H)**:
- Find: `#6366f1` → Replace: `var(--color-primary)`
- Find: `#2a2a2a` → Replace: `var(--bg-secondary)`
- Find: `this.shadowRoot.` → Replace: `this.`

**Multi-file Replace**:
1. Ctrl+Shift+H (Find & Replace)
2. Click "Replace All" button
3. Applies to all files in folder

---

## When Stuck

1. **Reference**: Look at `wb-button` (already migrated)
2. **Guide**: Check `COMPONENT-MIGRATION-GUIDE.md`
3. **Tokens**: Reference `styles/css-tokens.css`
4. **Test**: Use test HTML above

---

## You're Ready! 🚀

**wb-button is done. Pick next component.**

**Recommendation**: Start with `wb-input` (simplest, most similar to wb-button)

**Time**: 2 minutes per component

**Your command**: Ready when you are!

