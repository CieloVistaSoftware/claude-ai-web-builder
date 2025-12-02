# WB Framework Component Rules

## AI Development Rule: Don't Come Back Until It Works

### The Rule

**When creating or modifying a component, keep making changes until tests pass. Only report "done" when it actually works.**

### Test Rule: Every Change Gets a Test

**When you modify a component, you MUST add a test for that specific change.**

| Action | Required Test |
|--------|---------------|
| Add new attribute | Test that attribute works |
| Add new method | Test that method |
| Fix a bug | Add test that catches the bug |
| Change behavior | Update/add test for new behavior |
| Add event | Test that event fires |
| Change styling | Test that styles apply |

**Example:** If you add a `disabled` attribute to `wb-button`:

```typescript
// Add this test to tests/wb-button/wb-button.spec.ts
test('should respect disabled attribute', async ({ page }) => {
  await page.goto('/components/wb-button/wb-button-demo.html');
  
  const button = page.locator('wb-button[disabled]');
  await expect(button).toBeVisible();
  
  // Verify it's actually disabled
  const isDisabled = await button.evaluate(el => el.hasAttribute('disabled'));
  expect(isDisabled).toBe(true);
});
```

**The test proves the change works. No test = not done.**

### Workflow

1. **Make the change**
2. **Run the test:** `npm test` or `npx playwright test tests/wb-{name}/`
3. **If it fails → fix it** (don't report back)
4. **Run test again**
5. **Repeat until it passes**
6. **Only then say "done"**

### Test Commands

```bash
# Run all tests (auto-starts server)
npm test

# Run specific component test
npx playwright test tests/wb-button/

# Run with visible browser
npm run test:headed

# Run with debug UI
npm run test:ui

# Stop on first failure
npm run test:failfast
```

### Server Auto-Start

Playwright is configured to **automatically start the server** before tests run.

The `webServer` config in `/tests/playwright.config.js`:

```js
webServer: {
  command: 'npx http-server .. -p 8080 -c-1',
  url: 'http://localhost:8080',
  reuseExistingServer: !process.env.CI,
  timeout: 30000,
},
```

**What this does:**
- Starts `http-server` on port 8080 before tests
- Serves from project root (`..` from tests folder)
- Reuses existing server if one is already running (for local dev)
- `-c-1` disables caching (always fresh files)

**If tests fail with "server not running":**
1. Check port 8080 isn't blocked: `npm run kill-port`
2. Verify http-server is installed: `npm ls http-server`
3. Manually test server: `npx http-server -p 8080`

### Validation Checklist (Before Saying "Done")

- [ ] Tests pass (`npm test`)
- [ ] Demo page loads without errors
- [ ] No console errors in browser
- [ ] Component renders visibly (not zero dimensions)
- [ ] CSS is applied (not default/gray)
- [ ] Shadow DOM diagnostic passes (if applicable)

### If No Test Exists

1. Create one in `/tests/wb-{name}/`
2. Use existing tests as templates (see `/tests/UNIT-TEST-TEMPLATE.ts`)
3. At minimum, test that component renders and is visible

### Test Structure Rules

**Location:** Tests go in `/tests/wb-{name}/` folder

**File naming:** `wb-{name}.spec.ts` or `{feature}.spec.ts`

**Required elements:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('wb-{name}', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/wb-{name}/wb-{name}-demo.html');
    await page.waitForSelector('wb-{name}');
  });

  test('should render and be visible', async ({ page }) => {
    const component = page.locator('wb-{name}');
    await expect(component).toBeVisible();
    
    // Check not zero-sized
    const box = await component.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test('should have Shadow DOM', async ({ page }) => {
    const hasShadow = await page.evaluate(() => {
      const el = document.querySelector('wb-{name}');
      return !!el?.shadowRoot;
    });
    expect(hasShadow).toBe(true);
  });

  test('should respond to attribute changes', async ({ page }) => {
    // Test your component's attributes
  });
});
```

### Loop Detection (REQUIRED)

All tests MUST include loop detection to catch infinite loops:

```typescript
// Monitor console for loop errors
const loopErrors: string[] = [];
page.on('console', msg => {
  const text = msg.text().toLowerCase();
  if (['infinite', 'loop', 'recursion', 'stack overflow'].some(k => text.includes(k))) {
    loopErrors.push(msg.text());
  }
});

// After interactions
expect(loopErrors).toHaveLength(0);
```

### Exception Handling (REQUIRED)

Tests MUST fail on uncaught exceptions:

```typescript
page.on('pageerror', error => {
  throw new Error(`Uncaught exception: ${error.message}`);
});
```

### Test Minimum Requirements

Every component test MUST verify:

1. **Renders** - Component appears in DOM
2. **Visible** - Has non-zero dimensions
3. **Shadow DOM** - shadowRoot exists (if `useShadow = true`)
4. **CSS Applied** - Not default gray/unstyled
5. **No Console Errors** - Clean console
6. **No Infinite Loops** - Loop detection passes
7. **Attributes Work** - Observed attributes trigger changes

### Test Coverage Rule

**Every component MUST have its own test folder.**

```
/tests/wb-{name}/
└── wb-{name}.spec.ts    ← At minimum, basic render test
```

**Current Status:** Many components are missing tests. When working on a component:

1. Check if `/tests/wb-{name}/` exists
2. If not, create it with at least a basic render test
3. Run the test before saying "done"

**To create a missing test folder:**

```bash
# Option 1: Use the script
npm run test:create wb-card

# Option 2: Manual
mkdir tests/wb-{name}
cp tests/UNIT-TEST-TEMPLATE.ts tests/wb-{name}/wb-{name}.spec.ts
```

**To check test coverage:**

```bash
npm run test:coverage
```

This shows which components have tests and which are missing.

**Quick test to add for any component:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('wb-{name}', () => {
  test('should render and be visible', async ({ page }) => {
    await page.goto('/components/wb-{name}/wb-{name}-demo.html');
    
    const component = page.locator('wb-{name}');
    await expect(component).toBeVisible();
    
    const box = await component.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });
});
```

### What NOT To Do

- ❌ Report back with "I made the change, please test it"
- ❌ Say "this should work" without running tests
- ❌ Overwrite working code without re-testing
- ❌ Skip testing because "it's a small change"

### What TO Do

- ✅ Run tests after every change
- ✅ Fix failures before reporting
- ✅ Verify demo page works
- ✅ Only say "done" when it actually works

---

## Quick Start

```bash
npm run new        # Create new component (interactive)
npm run build      # Build all components
```

## File Structure

Every component lives in its own folder under `/components/wb-{name}/` with these files:

| File | Required | Purpose |
|------|----------|---------|
| `wb-{name}.js` | ✅ | Component class |
| `wb-{name}.css` | ✅ | Component styles |
| `wb-{name}-demo.html` | ✅ | Demo page |
| `wb-{name}.md` | ✅ | Documentation |
| `wb-{name}.schema.json` | Optional | JSON schema for config |
| `claude.md` | Optional | AI development notes |

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Folder | `wb-{name}` | `wb-button` |
| Element tag | `wb-{name}` | `<wb-button>` |
| Class name | `WB{Name}` | `WBButton` |
| CSS class | `wb-{name}` | `.wb-button` |
| CSS variable | `--wb-{name}-{property}` | `--wb-button-bg` |
| Event | `wb-{name}:{action}` | `wb-button:click` |

## Base Class

**Always extend `WBBaseComponent`**, not `HTMLElement`:

```js
import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBMyComponent extends WBBaseComponent {
    // ...
}
```

### WBBaseComponent Features

- **Shadow DOM** - auto-created (opt out with `static useShadow = false`)
- **CSS loading** - `static styleUrl = './wb-my-component.css'`
- **Events** - `this.fireEvent('name', detail)`
- **Logging** - `this.logInfo()`, `this.logError()`, `this.logDebug()`
- **Attributes** - `this.setAttr()`, `this.getAttr()`
- **Slots** - `this.getSlotNodes()`, `this.isSlotEmpty()`
- **Theme** - `this.getCurrentTheme()`, auto theme change handling
- **Schema** - `static schemaUrl`, `this.loadSchema()`

## Component Template

```js
// @ts-nocheck
/**
 * WB MyComponent Web Component
 * 
 * Description of what this component does.
 * 
 * @example
 * <wb-my-component variant="primary">Content</wb-my-component>
 * 
 * @events
 * - wb-my-component:ready - Fired when component initializes
 * - wb-my-component:change - Fired when value changes
 * 
 * @version 1.0.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';

console.log('🔷 WB MyComponent: Starting...');

// Fallback config
const fallbackConfig = {
    component: { name: 'wb-my-component', version: '1.0.0' },
    classes: {
        base: 'wb-my-component',
        variants: { primary: 'wb-my-component--primary' }
    },
    defaults: { variant: 'primary' },
    events: { 
        ready: 'wb-my-component:ready', 
        change: 'wb-my-component:change' 
    }
};

// Reactive signal helper
function createSignal(initial) {
    let value = initial;
    const listeners = [];
    return [
        () => value,
        (v) => { value = v; listeners.forEach(fn => fn(value)); },
        (fn) => listeners.push(fn)
    ];
}

class WBMyComponent extends WBBaseComponent {
    constructor() {
        super();
        this.config = fallbackConfig;
        
        // Reactive state
        [this.getVariant, this.setVariant, this.onVariant] = createSignal('primary');
        this.onVariant(() => this.render());
    }

    connectedCallback() {
        super.connectedCallback();  // REQUIRED: inherits theme, logging, etc.
        this.render();
        this.dispatchEvent(new CustomEvent(this.config.events.ready, { 
            bubbles: true, 
            detail: { component: this } 
        }));
    }

    render() {
        const target = this.shadowRoot || this;
        target.innerHTML = `
            <div class="${this.config.classes.base} ${this.config.classes.variants[this.getVariant()]}">
                <slot></slot>
            </div>
        `;
    }

    static get observedAttributes() { 
        return ['variant']; 
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'variant') this.setVariant(newValue || 'primary');
    }
}

// Register element
if (!customElements.get('wb-my-component')) {
    customElements.define('wb-my-component', WBMyComponent);
}

// Global namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBMyComponent = WBMyComponent;
window.WBMyComponent = WBMyComponent;

// ES6 exports
export { WBMyComponent };
export default WBMyComponent;
```

## Demo Page Template

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WB MyComponent Demo</title>
    
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="./wb-my-component.css">
    
    <!-- ONE import for ALL WB components -->
    <script type="module" src="../../src/js/main.js"></script>
</head>
<body data-theme="dark">
    <wb-demo title="wb-my-component Demo" markdown="./wb-my-component.md">
        <div slot="examples">
            <div class="demo-section">
                <h2>Basic Usage</h2>
                <wb-my-component>Hello World</wb-my-component>
            </div>
        </div>
    </wb-demo>
</body>
</html>
```

## CSS Architecture Rules

### The Golden Rule: No Duplication

1. **Check `/styles/` first** - all base styles live there
2. **Component CSS only adds new stuff** - specific to that component only
3. **Never duplicate** what's already in main.css, _variables.css, _base.css, etc.

### Style Hierarchy

```
/styles/
├── main.css          ← Imports everything below
├── _variables.css    ← CSS custom properties (colors, spacing, etc.)
├── _base.css         ← Reset, typography, foundational elements
├── _utilities.css    ← Reusable utility classes
└── layouts.css       ← Layout system, responsive design

/components/wb-{name}/
└── wb-{name}.css     ← ONLY styles unique to this component
```

### What Goes Where

| Location | What belongs there |
|----------|-------------------|
| `_variables.css` | CSS custom properties, design tokens |
| `_base.css` | Element resets, typography, body styles |
| `_utilities.css` | `.flex`, `.hidden`, `.text-center`, etc. |
| `layouts.css` | Grid systems, responsive breakpoints |
| `wb-{name}.css` | Component-specific classes ONLY |

### Example: Component CSS

```css
/* wb-my-component.css */

/* ✅ Good - component-specific styles only */
.wb-my-component {
    display: flex;
    gap: var(--spacing-md);  /* Use existing variable */
}

.wb-my-component__header {
    border-bottom: 1px solid var(--border-color);  /* Use existing variable */
}

/* ❌ Bad - duplicating base styles */
* { box-sizing: border-box; }  /* Already in _base.css */
body { margin: 0; }            /* Already in _base.css */
.flex { display: flex; }       /* Already in _utilities.css */
```

---

## main.css - Central Style Loader

**Location:** `/styles/main.css`

This single file imports all foundational CSS in the correct order:

```html
<!-- ONE import loads all base styles -->
<link rel="stylesheet" href="../../styles/main.css">
```

### Load Order (managed by main.css)

1. **_variables.css** - CSS custom properties and design tokens
2. **_base.css** - Reset, typography, foundational element styles
3. **_utilities.css** - Reusable utility classes and patterns
4. **layouts.css** - Layout system and responsive design

### Theme System

main.css includes dark/light theme support:

```html
<!-- Dark theme (default) -->
<html lang="en" data-theme="dark">

<!-- Light theme -->
<html lang="en" data-theme="light">
```

### CSS Variables Available

| Variable | Purpose |
|----------|--------|
| `--bg-color` | Page background |
| `--bg-primary/secondary/tertiary` | Surface backgrounds |
| `--text-primary/secondary/muted` | Text colors |
| `--border-color` | Border colors |
| `--primary` | Primary brand color |
| `--surface-base/raised/overlay` | Layer surfaces |

---

## Harmonic Color System (HCS)

The WB Framework uses a **wave theory-based color system** that applies musical harmony principles to color relationships.

### Core Concept

All colors are mathematically derived from HSL values using harmony angles:

```css
/* Foundation - everything derives from these */
--hue-primary: 240;        /* Base hue (0-360) */
--saturation-primary: 70;  /* Vibrancy (0-100) */
--lightness-primary: 50;   /* Brightness (0-100) */

--primary: hsl(var(--hue-primary), var(--saturation-primary)%, var(--lightness-primary)%);
```

### Traditional Color Harmonies

| Harmony | Angle | Description |
|---------|-------|-------------|
| Complementary | 180° | Opposite on color wheel |
| Triadic | 120° | Three colors equally spaced |
| Tetradic | 90° | Four colors (rectangle) |
| Analogous | ±30° | Adjacent colors |
| Split Complementary | 150°/210° | Base + two adjacent to complement |

### Wave Theory Harmonies (Unique to WB)

| Harmony | Description |
|---------|-------------|
| Beat Pattern | Interference between close frequencies |
| Harmonic Series | Musical harmonic ratios (÷2, ÷3, ÷4) applied to hue |
| Doppler Shift | Frequency shift effect (blueshift/redshift) |
| Standing Wave | Nodes and antinodes pattern |
| Phase 30°/45° | Phase modulation increments |
| Frequency Modulation (FM) | Carrier + sidebands |
| Amplitude Modulation (AM) | Intensity variation creates beats |
| Wave Superposition | Constructive/destructive interference |

### Using Colors in Components

**Don't hardcode colors** - use the semantic tokens:

```css
/* ❌ Bad */
.my-button { background: #6366f1; }

/* ✅ Good */
.my-button { background: var(--primary); }
```

### Semantic Color Tokens

| Token | Purpose | Psychology |
|-------|---------|------------|
| `--primary` | Brand, primary actions | Trust |
| `--secondary` | Secondary actions | Support |
| `--accent` | Call-to-action, emphasis | Attention |
| `--success-color` | Success states | Growth |
| `--warning-color` | Warnings, caution | Attention |
| `--error-color` | Errors, danger | Alert |
| `--info-color` | Information | Trust |

### Programmatic Color Control

Change the entire theme by modifying foundation variables:

```js
// Change to cyan theme
document.documentElement.style.setProperty('--hue-primary', '180');

// Make more vibrant
document.documentElement.style.setProperty('--saturation-primary', '90');
```

### wb-control-panel Integration

The `<wb-control-panel>` component provides UI controls for:
- Dark/Light mode toggle
- Named themes (Default, Cyberpunk, Ocean, Forest, etc.)
- HCS wave-based themes (Complementary, Triadic, Beat Pattern, etc.)
- Fine-tune sliders for Hue, Saturation, Lightness
- Background color controls
- Layout and footer position

---

## main.js - Central Component Loader

**Location:** `/src/js/main.js`

This single file imports ALL WB components. Use it in demo pages instead of importing individual components:

```html
<!-- ONE import loads everything -->
<script type="module" src="../../src/js/main.js"></script>
```

### Load Order (managed by main.js)

1. **Core/Base** - `wb-base`, `wb-css-loader`, `wb-reactive-base`
2. **UI Components** - buttons, cards, inputs, modals, tabs, etc.
3. **Layout** - grid, nav, footer, viewport
4. **Resize** - resize panels (both, east-west, up-down)
5. **Color** - color-bar, color-harmony, color-picker, etc.
6. **Developer Tools** - demo, event-log, dev-toolbox, log-viewer
7. **Control Panel & Theme** - control-panel, theme-manager
8. **Specialized** - change-text, semantic-elements, linkedinAd, rag

### When Creating a New Component

**You must add your component to main.js** after creating it:

```js
// Add to the appropriate section in main.js
import '../../components/wb-my-component/wb-my-component.js';
```

### Events

main.js dispatches a ready event when all components are loaded:

```js
window.addEventListener('wb-components-ready', (e) => {
    console.log('All WB components loaded!', e.detail.version);
});
```

## General Rules

1. **Always use Shadow DOM** unless there's a strong reason not to
2. **Always call `super.connectedCallback()`** in your connectedCallback
3. **Prefix all CSS custom properties** with component name
4. **Document all public properties, methods, and events** in JSDoc
5. **Write unit and integration tests**
6. **Ensure accessibility** (ARIA roles, keyboard navigation)
7. **Avoid global side effects**
8. **Use reactive signals** for state management (`createSignal`)
9. **Include fallback config** so component works without JSON loading

## Event Naming

```js
// Pattern: wb-{component}:{action}
this.dispatchEvent(new CustomEvent('wb-button:click', {
    bubbles: true,
    composed: true,  // crosses shadow DOM boundary
    detail: { value: this.getValue() }
}));

// Or use inherited helper:
this.fireEvent('click', { value: this.getValue() });
```

## CSS Loading Options

```js
// Option 1: Static styleUrl (auto-loaded by WBBaseComponent)
class WBMyComponent extends WBBaseComponent {
    static styleUrl = './wb-my-component.css';
}

// Option 2: Use CSS loader
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

async connectedCallback() {
    super.connectedCallback();
    await loadComponentCSS(this, 'wb-my-component.css');
    this.render();
}
```

## Registration Options

```js
// Option 1: Standard registration
if (!customElements.get('wb-my-component')) {
    customElements.define('wb-my-component', WBMyComponent);
}

// Option 2: Use WBBaseComponent helper
WBMyComponent.register('wb-my-component');

// Option 3: Register with WBComponentRegistry (if available)
if (window.WBComponentRegistry) {
    window.WBComponentRegistry.register('wb-my-component', WBMyComponent, [], {
        version: '1.0.0',
        type: 'ui',
        description: 'My component description'
    });
}
```

## Checklist for New Components

- [ ] Folder created: `/components/wb-{name}/`
- [ ] Extends `WBBaseComponent`
- [ ] Calls `super.connectedCallback()`
- [ ] Has `.js`, `.css`, `-demo.html`, `.md` files
- [ ] Uses `wb-{name}` naming throughout
- [ ] Events use `wb-{name}:{action}` pattern
- [ ] CSS variables prefixed with `--wb-{name}-`
- [ ] Registered with `customElements.define()`
- [ ] Exported as ES6 module
- [ ] Added to global `window.WB.components`
- [ ] Demo page works with `wb-demo` wrapper
- [ ] Accessibility tested

## Debugging: Shadow DOM Diagnostic Tool

The WB Framework includes a **universal diagnostic tool** for runtime debugging:

**Location:** `/components/wb-shadow-diagnostics.html`

### What It Tests

1. **Environment Check** - Custom Elements API, Shadow DOM API, ES Modules support
2. **CSS Variables** - Validates `:root` CSS custom properties
3. **Component Registration** - Verifies `customElements.define()` worked
4. **Shadow DOM Structure** - Checks if Shadow DOM exists and matches `useShadow` config
5. **CSS Loading** - Validates CSS file path and HTTP status
6. **Render Persistence** - Tests if CSS survives re-renders (common bug!)
7. **Element Inspection** - Lists all elements inside Shadow DOM
8. **Computed Styles** - Shows actual applied colors and display values
9. **Dimensions & Visibility** - Detects zero-size (invisible) elements
10. **Attributes** - Shows all attributes on test elements
11. **Raw HTML Dump** - Full Shadow DOM innerHTML for debugging
12. **Final Verdict** - Pass/fail summary with specific issues

### How to Use

1. Open `/components/wb-shadow-diagnostics.html` in browser
2. Select your component from the dropdown
3. Click **🚀 Run Diagnostics**
4. Review the 12-section report
5. Click **📋 Copy Issues** to get a text report for debugging

### Common Issues It Catches

| Issue | Symptom | Fix |
|-------|---------|-----|
| CSS destroyed on re-render | Styles disappear after attribute change | Save/restore `<link>` tags in `render()` |
| Wrong CSS path | 404 error, no styles | Use `./` relative path |
| Missing Shadow DOM | `useShadow=true` but no shadowRoot | Check `super()` call in constructor |
| Zero dimensions | Element exists but invisible | Check CSS `display`, `width`, `height` |
| Gray/default colors | CSS not applied | Verify CSS file loads (check Network tab) |

### Quick Fix for CSS Persistence

If the diagnostic shows CSS is destroyed on re-render, update your `render()` method:

```js
render() {
    // Save CSS links BEFORE clearing innerHTML
    const existingLinks = Array.from(this.shadowRoot.querySelectorAll('link[rel="stylesheet"]'));
    
    // Set new HTML
    this.shadowRoot.innerHTML = `<div class="my-component">...</div>`;
    
    // Re-append CSS links
    existingLinks.forEach(link => this.shadowRoot.appendChild(link));
}
```

## References

- [WBBaseComponent Source](../../components/wb-base/wb-base.js)
- [Component Template](../../components/_TEMPLATE/)
- [Shadow DOM Diagnostic Tool](../../components/wb-shadow-diagnostics.html)
- [Webcomponents Guide](./How-to-Webcomponents.md)
