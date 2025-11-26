# WB Shadow Diagnostics

WB Shadow Diagnostics is a comprehensive testing tool for WB web components that use Shadow DOM.

## What It Tests

This diagnostic tool runs **13 checks** to verify your component is working correctly:

| # | Check | What It Tests |
|---|-------|---------------|
| 1 | Environment | Custom Elements API, Shadow DOM API, ES Modules support |
| 2 | CSS Variables | Root CSS variables are defined (--primary, --success-color, etc.) |
| 3 | Component Registration | Component is registered with `customElements.define()` |
| 4 | Test Instances | Components inject and render correctly |
| 5 | Shadow DOM Structure | Shadow DOM exists and matches `useShadow` config |
| 6 | CSS Loading | CSS link exists in shadow root, file loads (HTTP 200) |
| 6.5 | Render Persistence | CSS link survives re-renders (not destroyed by innerHTML) |
| 7 | Element Inspection | Shadow DOM contains renderable elements |
| 8 | Computed Styles | Styles are actually applied (not gray/transparent) |
| 9 | Dimensions | Elements have width/height (visible, not zero) |
| 10 | Attributes | Attribute reactivity works |
| 11 | HTML Dump | Raw shadow DOM output for inspection |
| 12 | Reference Validation | **NEW!** All imports, links, scripts resolve correctly |
| 13 | Final Verdict | Pass/Fail summary with all issues listed |

## Reference Validation (Section 12)

The new **Reference Validation** check scans:

### In the Component JS file:
- ✅ `import ... from '...'` - static imports
- ✅ `import('...')` - dynamic imports

### In the Demo HTML file:
- ✅ `<link href="...">` - stylesheet links
- ✅ `<script src="...">` - script tags

### Component folder:
- ✅ CSS file exists (`{component-name}.css`)

All paths are resolved relative to the source file and verified to exist via HTTP HEAD request.

## Usage

### Browser UI

1. Open `wb-shadow-diagnostics.html` in a browser
2. Select a component from the dropdown
3. Click **"🚀 Run Diagnostics"** to run all tests
4. Click **"🔗 Check References"** to run only reference validation
5. Review results in each section
6. Click **"📋 Copy Issues"** to copy a full report to clipboard

### As a Component

```html
<wb-shadow-diagnostics></wb-shadow-diagnostics>
```

## Standalone Reference Checker

For checking ALL components at once (not just one), use the command-line tool:

```bash
node link-ref-checker.cjs
```

This scans:
- `components/` folder
- `tests/` folder  
- `demos/` folder
- `src/` folder

And checks:
- All `<link href="">` in HTML files
- All `<script src="">` in HTML files
- All `<a href="">` (internal file links) in HTML files
- All `import ... from '...'` in JS files
- All `import('...')` dynamic imports in JS files

Output includes:
- List of all broken references
- Summary by type
- Overall pass/fail status

Add `--json` flag to export results:
```bash
node link-ref-checker.cjs --json
```

## Files

| File | Purpose |
|------|---------|
| `wb-shadow-diagnostics.js` | Main diagnostic controller (ES module) |
| `wb-shadow-diagnostics.css` | Component-scoped styles |
| `wb-shadow-diagnostics.html` | Full-page UI with live preview |
| `wb-shadow-diag.md` | This documentation |
| `link-ref-checker.cjs` | Standalone CLI reference checker (Node.js) |

## When to Use

Run diagnostics **after any component change**:

- ✅ After creating a new component
- ✅ After modifying component JS
- ✅ After changing CSS paths
- ✅ After updating imports
- ✅ After renaming files
- ✅ Before committing code

## Success Criteria

A component passes all tests when:

- ✅ Shadow DOM is created (if `useShadow = true`)
- ✅ CSS file exists and loads (HTTP 200)
- ✅ CSS link persists after re-render
- ✅ Elements are visible (non-zero dimensions)
- ✅ Styles are applied (colors not gray/transparent)
- ✅ All imports resolve correctly
- ✅ All HTML references are valid
