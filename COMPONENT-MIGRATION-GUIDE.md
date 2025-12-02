# PHASE 2 - COMPONENT MIGRATION GUIDE

**Status**: ✅ Template complete (wb-button)  
**Remaining**: 40 components  
**Estimated**: 2-3 minutes per component

---

## Quick Reference - 3 Changes Per Component

### 1️⃣ JavaScript - Remove Shadow DOM
```javascript
// BEFORE (Shadow DOM)
static useShadow = true;

async connectedCallback() {
  super.connectedCallback();
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './component-name.css';
  this.shadowRoot.appendChild(link);
  this.render();
}

// AFTER (Light DOM)
static useShadow = false;

async connectedCallback() {
  super.connectedCallback();
  this.classList.add('wb-component', 'wb-component-name');
  // CSS is global now, no loading needed
  this.render();
}
```

### 2️⃣ JavaScript - Rendering
```javascript
// BEFORE (Shadow DOM)
render() {
  const target = this.shadowRoot || this;
  target.innerHTML = `<div>...</div>`;
}

// AFTER (Light DOM)
render() {
  this.innerHTML = `<div>...</div>`;
  // That's it! No shadow root handling needed
}
```

### 3️⃣ CSS - Token Variables
```css
/* BEFORE (Hardcoded colors) */
.component {
  background: #2a2a2a;
  color: #ffffff;
  border: 1px solid #404040;
}

/* AFTER (Token variables) */
.component {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
```

---

## Component List - Priority Order

### TIER 1: Form Components (8)
These are used most frequently and simplest to migrate.

- [ ] **wb-button** ✅ DONE - Use as template
- [ ] **wb-input** - Text input field
- [ ] **wb-select** - Dropdown selector
- [ ] **wb-toggle** - Toggle switch
- [ ] **wb-slider** - Range slider
- [ ] **wb-search** - Search field
- [ ] **wb-tab** - Tab navigation
- [ ] **wb-checkbox** - Checkbox (if exists)

### TIER 2: Container Components (8)
Layout and display components.

- [ ] **wb-card** - Content card
- [ ] **wb-modal** - Modal dialog
- [ ] **wb-header** - Header/navigation
- [ ] **wb-footer** - Footer
- [ ] **wb-grid** - Grid layout
- [ ] **wb-layout** - Layout wrapper
- [ ] **wb-hero** - Hero section
- [ ] **wb-panel** - Side panel (if exists)

### TIER 3: Data Display (8)
Table and list components.

- [ ] **wb-table** - Data table
- [ ] **wb-nav** - Navigation menu
- [ ] **wb-status** - Status indicator
- [ ] **wb-color-bar** - Color display
- [ ] **wb-color-bars** - Color array display
- [ ] **wb-image-insert** - Image insertion
- [ ] **wb-event-log** - Event logging
- [ ] **wb-log-viewer** - Log display

### TIER 4: Interactive (8)
Advanced interactive components.

- [ ] **wb-color-picker** - Color picker
- [ ] **wb-color-harmony** - Harmony tool
- [ ] **wb-color-mapper** - Color mapping
- [ ] **wb-color-transformer** - Color transformation
- [ ] **wb-control-panel** - Control panel
- [ ] **wb-keyboard-manager** - Keyboard handling
- [ ] **wb-resize-panel** - Resizable panel
- [ ] **wb-chatbot** - Chatbot interface

### TIER 5: Utilities (8+)
Utility and helper components.

- [ ] **wb-base** ✅ DONE - Already updated
- [ ] **wb-css-loader** - CSS loading utility
- [ ] **wb-reactive-base** - Reactive utilities
- [ ] **wb-dev-toolbox** - Dev tools
- [ ] **wb-shadow-diagnostics** - Diagnostics
- [ ] **wb-viewport** - Viewport info
- [ ] **wb-demo** - Demo wrapper
- [ ] Other utility components...

---

## Migration Checklist Template

Use this for each component:

### Component: `wb-[component-name]`

**Files to modify**:
- [ ] `components/wb-[name]/wb-[name].js`
- [ ] `components/wb-[name]/wb-[name].css`

**JavaScript Changes**:
1. [ ] Change `static useShadow = true` → `static useShadow = false`
2. [ ] Remove Shadow DOM CSS loading code
3. [ ] Add `this.classList.add('wb-component', 'wb-[name]')` to connectedCallback
4. [ ] Change `this.shadowRoot.innerHTML` → `this.innerHTML`
5. [ ] Remove `target = this.shadowRoot || this` logic

**CSS Changes**:
1. [ ] Replace all hardcoded colors with token variables
   - `#6366f1` → `var(--color-primary)`
   - `#2a2a2a` → `var(--bg-secondary)`
   - `#ffffff` → `var(--text-primary)`
   - `#404040` → `var(--border-primary)`
2. [ ] Replace hardcoded spacing with tokens
   - `1rem` → `var(--spacing-md)`
   - `0.5rem` → `var(--spacing-sm)`
3. [ ] Replace font values with tokens
   - `font-family: sans-serif` → `var(--font-family-base)`
   - `font-size: 14px` → `var(--font-size-base)`

**Testing**:
1. [ ] Ensure `styles/css-tokens.css` is included in test HTML
2. [ ] Verify component renders in Light DOM (no Shadow Root)
3. [ ] Test color token inheritance
4. [ ] Test token injection changes colors

---

## CSS Variable Reference

### Color Tokens

**Format**: `--color-[role]-[intensity]`

**Roles**: primary, secondary, success, danger, warning, info  
**Intensities**: subtle, soft, [base], bold, vivid

```css
/* Example for primary role */
--color-primary              /* Base color */
--color-primary-subtle       /* 88% lightness - backgrounds */
--color-primary-soft         /* 72% lightness - hover */
--color-primary-bold         /* 35% lightness - active */
--color-primary-vivid        /* 18% lightness - borders */
```

### Text Colors

```css
--text-primary              /* Main text (white on dark) */
--text-secondary            /* Secondary text (dimmed) */
--text-tertiary             /* Helper text (very dim) */
--text-disabled             /* Disabled text */
--text-primary-inverse      /* Text on light bg (black) */
--text-secondary-inverse    /* Text on light bg (gray) */
```

### Surface Colors

```css
--bg-primary                /* Main background (darkest) */
--bg-secondary              /* Cards, panels */
--bg-tertiary               /* Hover states */
--bg-active                 /* Active states */
```

### Border Colors

```css
--border-primary            /* Main borders */
--border-secondary          /* Subtle borders */
--border-tertiary           /* Light borders */
```

### Spacing

```css
--spacing-xs: 0.25rem       /* 4px */
--spacing-sm: 0.5rem        /* 8px */
--spacing-md: 1rem          /* 16px */
--spacing-lg: 1.5rem        /* 24px */
--spacing-xl: 2rem          /* 32px */
--spacing-2xl: 3rem         /* 48px */
```

### Typography

```css
--font-family-base          /* Main font stack */
--font-size-xs: 0.625rem    /* 10px */
--font-size-sm: 0.75rem     /* 12px */
--font-size-base: 0.875rem  /* 14px */
--font-size-lg: 1rem        /* 16px */
--font-size-xl: 1.25rem     /* 20px */
--font-weight-[light|normal|medium|semibold|bold]
```

### Effects

```css
--shadow-sm                 /* Subtle shadow */
--shadow-md                 /* Medium shadow */
--shadow-lg                 /* Large shadow */
--transition-fast           /* 0.15s ease */
--transition-normal         /* 0.3s ease */
--transition-slow           /* 0.5s ease */
--radius-sm: 4px            /* Subtle rounding */
--radius-md: 6px            /* Default rounding */
--radius-lg: 8px            /* More rounding */
--radius-xl: 12px           /* Large rounding */
--radius-full: 9999px       /* Pill/circle */
```

---

## Common Color Migrations

### Primary Actions
```css
/* BEFORE */
background: #6366f1;        /* Hardcoded indigo */
color: #ffffff;
border-color: #4f46e5;

/* AFTER */
background: var(--color-primary);
color: var(--text-primary);
border-color: var(--color-primary-bold);
```

### Secondary/Neutral
```css
/* BEFORE */
background: #2a2a2a;
color: #e0e0e0;
border: 1px solid #404040;

/* AFTER */
background: var(--bg-secondary);
color: var(--text-secondary);
border: 1px solid var(--border-primary);
```

### Success State
```css
/* BEFORE */
color: #10b981;
background: rgba(16, 185, 129, 0.1);

/* AFTER */
color: var(--color-success);
background: var(--color-success-subtle);
```

### Danger/Error State
```css
/* BEFORE */
color: #ef4444;
background: rgba(239, 68, 68, 0.1);

/* AFTER */
color: var(--color-danger);
background: var(--color-danger-subtle);
```

### Hover Effects
```css
/* BEFORE */
.component:hover {
  background: #404040;
}

/* AFTER */
.component:hover {
  background: var(--color-secondary-soft);
}
```

### Active/Focus States
```css
/* BEFORE */
.component:active {
  background: #1a1a1a;
}

/* AFTER */
.component:active {
  background: var(--color-secondary-bold);
}
```

---

## Common JS Patterns

### Pattern 1: Render Method
```javascript
// BEFORE - Shadow DOM complexity
render() {
  const target = this.shadowRoot || this;
  target.innerHTML = `...`;
  
  if (this.shadowRoot) {
    const existingLinks = Array.from(this.shadowRoot.querySelectorAll('link'));
    existingLinks.forEach(link => this.shadowRoot.appendChild(link));
  }
}

// AFTER - Clean and simple
render() {
  this.innerHTML = `...`;
}
```

### Pattern 2: CSS Loading (Remove entirely)
```javascript
// BEFORE
async connectedCallback() {
  super.connectedCallback();
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./component.css', import.meta.url).href;
  this.shadowRoot.appendChild(link);
  await new Promise(resolve => {
    link.onload = resolve;
  });
  this.render();
}

// AFTER
async connectedCallback() {
  super.connectedCallback();
  this.classList.add('wb-component', 'wb-component-name');
  // CSS is global, already loaded via styles/css-tokens.css in HTML
  this.render();
}
```

### Pattern 3: Element Selection
```javascript
// BEFORE - Shadow DOM queries
const button = this.shadowRoot.querySelector('button');

// AFTER - Light DOM queries
const button = this.querySelector('button');
```

---

## Testing Each Component

### 1. HTML Setup
```html
<!DOCTYPE html>
<html>
<head>
  <!-- CRITICAL: Include global CSS tokens -->
  <link rel="stylesheet" href="styles/css-tokens.css">
</head>
<body>
  <!-- Test the component -->
  <wb-[component-name>Test</wb-[component-name]>
  
  <script type="module">
    import { TokenInjector } from './utils/token-injector.js';
    
    // Inject default theme
    const injector = new TokenInjector('#6366f1');
    injector.inject();
  </script>
</body>
</html>
```

### 2. Browser Check
- [ ] Component renders without errors
- [ ] Component has NO Shadow Root (check DevTools)
- [ ] Colors match token values
- [ ] Hover/active states work
- [ ] Responsive behavior preserved

### 3. Color Injection Test
```javascript
// In browser console
TokenInjector.inject();  // Already done
// Change colors
document.documentElement.style.setProperty('--color-primary', '#ff0000');
// Components should immediately turn red
```

---

## Batch Migration (Optional)

If you want to migrate components quickly in groups:

### Bash Script (Windows PowerShell)
```powershell
# Find all component JS files needing migration
$components = Get-ChildItem "C:\Users\jwpmi\Downloads\AI\wb\components\wb-*" -Directory

foreach ($comp in $components) {
  $jsFile = Join-Path $comp.FullName "$(comp.Name).js"
  if (Test-Path $jsFile) {
    # Check if still using Shadow DOM
    $content = Get-Content $jsFile
    if ($content -match "static useShadow = true") {
      Write-Host "❌ $($comp.Name) - needs migration"
    } else {
      Write-Host "✅ $($comp.Name) - already migrated"
    }
  }
}
```

---

## FAQ - Migration

**Q: Do components need to register globally?**  
A: No, they automatically register when imported. Just make sure the JS file is loaded.

**Q: Can I test one component at a time?**  
A: Yes! Just include `styles/css-tokens.css` in the HTML and test individually.

**Q: What if a component has complex Shadow DOM styles?**  
A: Flatten them to Light DOM styles. If you absolutely need Shadow DOM, set `static useShadow = true` and keep the old pattern for that one component.

**Q: Do I need to update component tests?**  
A: Update shadow DOM queries to Light DOM queries:
```javascript
// Before
component.shadowRoot.querySelector('button')

// After
component.querySelector('button')
```

**Q: Can themes be saved?**  
A: Yes! Use TokenInjector.toJSON() to save, TokenInjector.fromJSON() to load.

---

## Progress Tracking

### Tier 1 Form Components: ___ / 8
### Tier 2 Container Components: ___ / 8
### Tier 3 Data Display: ___ / 8
### Tier 4 Interactive: ___ / 8
### Tier 5 Utilities: ___ / 8+

**Total Progress**: ___ / 41+ components

---

## Next Steps

1. **Pick first component** - Start with `wb-input` (similar to wb-button)
2. **Follow checklist** - Use the template above
3. **Test in browser** - Verify no Shadow DOM
4. **Check console** - Ensure no CSS loading errors
5. **Mark done** - Check off the list

**Estimated completion**: 2-3 hours for all 41 components at 2 min each

Ready to start migrating?

