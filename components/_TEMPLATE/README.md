# 🎯 WB Component Template

## The ONE Template to Rule Them All

This template solves all the common issues found in WB components:
- ✅ **No duplicate shadow roots** - Parent class handles it
- ✅ **Correct dark mode** - Uses `data-mode` attributes instead of OS-level media queries
- ✅ **Proper CSS imports** - Follows WB system patterns
- ✅ **Standardized structure** - Consistent file organization
- ✅ **Auto-integration** - Works with build system automatically

## 📁 Template Structure

```
wb-COMPONENT-NAME/
├── wb-COMPONENT-NAME.js          # Main component file
├── wb-COMPONENT-NAME.css         # Component styles
├── wb-COMPONENT-NAME-demo.html   # Demo file (MUST have "demo" in name!)
├── wb-COMPONENT-NAME.md          # Documentation
├── wb-COMPONENT-NAME.schema.json # Schema definition (optional)
└── ✅ claude.md                  # Issue tracking
```

## 🚀 Quick Start

1. **Copy** the `_TEMPLATE` folder
2. **Rename** folder to `wb-YOUR-COMPONENT-NAME`
3. **Find and Replace** all instances of:
   - `COMPONENT-NAME` → `your-component-name`
   - `ComponentName` → `YourComponentName`
4. **Customize** the functionality
5. **Test** using the demo file
6. **Build** to auto-update `main.js` and manifest

## 🎨 Why This Template?

### Problem 1: Shadow Root Duplication
❌ **Old Way:**
```javascript
constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // ERROR! Parent already did this
}
```

✅ **New Way:**
```javascript
constructor() {
    super(); // WBBaseComponent already creates shadow root
    // Just use this.shadowRoot
}
```

### Problem 2: Wrong Dark Mode
❌ **Old Way:**
```css
@media (prefers-color-scheme: dark) {
    /* Only responds to OS settings! */
}
```

✅ **New Way:**
```css
:host([data-mode="dark"]),
:host([data-theme*="dark"]) {
    /* Responds to control panel! */
}
```

### Problem 3: Inconsistent CSS Imports
❌ **Old Way:**
```html
<link rel="stylesheet" href="./missing-file.css">
<link rel="stylesheet" href="../../styles/some-random-file.css">
```

✅ **New Way:**
```html
<!-- WB System Styles Only -->
<link rel="stylesheet" href="../../styles/main.css">
```

### Problem 4: Manual Build Updates
❌ **Old Way:**
- Manually add to `styles/main.js`
- Manually update demos manifest
- Hope you didn't forget anything

✅ **New Way:**
```bash
npm run build
# Automatically:
# 1. Scans for all component .js files
# 2. Updates styles/main.js
# 3. Finds all *demo*.html files
# 4. Updates demos-manifest.json
```

## 📋 File-by-File Guide

### 1. `wb-COMPONENT-NAME.js`
The main component logic:
- Extends `WBBaseComponent`
- Uses reactive signals for state
- Implements proper lifecycle hooks
- Dispatches standardized events

### 2. `wb-COMPONENT-NAME.css`
Component-specific styles:
- Uses CSS custom properties from WB system
- Implements proper dark mode support
- Follows BEM naming convention
- Uses `:host` for web component styling

### 3. `wb-COMPONENT-NAME-demo.html`
The demo/test file:
- MUST have "demo" in the filename
- Uses `<wb-demo>` wrapper component
- Includes examples and documentation
- Has event logging for testing

### 4. `wb-COMPONENT-NAME.md`
Component documentation:
- API reference
- Usage examples
- Event documentation
- Props/attributes list

### 5. `wb-COMPONENT-NAME.schema.json`
JSON schema for configuration:
- Defines component structure
- Documents all properties
- Used for validation

### 6. `✅ claude.md`
Issue tracking:
- Known issues
- Solutions applied
- Development notes

## 🔧 Build System Integration

### Auto-Discovery
The build system automatically finds:
```javascript
// All demo files (any HTML with "demo" in name)
components/**/\*demo*.html

// All component JS files
components/wb-*/*.js

// All schemas
components/wb-*/*.schema.json
```

### Generated Files
Running `npm run build` updates:
1. `styles/main.js` - Component imports
2. `components/demos-manifest.json` - Demo index
3. `components/index.html` - Component browser

## 📝 Checklist for New Components

- [ ] Copy `_TEMPLATE` folder
- [ ] Rename to `wb-YOUR-COMPONENT`
- [ ] Find/replace all template placeholders
- [ ] Implement component logic
- [ ] Style with proper dark mode support
- [ ] Create comprehensive demo
- [ ] Document in .md file
- [ ] Add schema (if needed)
- [ ] Run `npm run build`
- [ ] Test demo file
- [ ] Create ✅ claude.md
- [ ] Commit to repo

## 🎯 Best Practices

### DO ✅
- Extend WBBaseComponent
- Use data-mode attributes for theming
- Keep demo files simple and focused
- Document all events and attributes
- Use reactive signals for state
- Follow BEM naming for CSS
- Import only from /styles/main.css

### DON'T ❌
- Call attachShadow() (parent does it)
- Use @media (prefers-color-scheme)
- Import random CSS files
- Forget "demo" in demo filename
- Manually update build files
- Skip documentation

## 🚨 Common Mistakes to Avoid

### Mistake #1: Duplicate Shadow Root
```javascript
// ❌ WRONG
constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Error!
}

// ✅ CORRECT
constructor() {
    super(); // WBBaseComponent creates shadow root
}
```

### Mistake #2: OS-Level Dark Mode
```css
/* ❌ WRONG - Only works with OS settings */
@media (prefers-color-scheme: dark) {
    .component { background: black; }
}

/* ✅ CORRECT - Works with control panel */
:host([data-mode="dark"]) .component {
    background: black;
}
```

### Mistake #3: Wrong Demo Filename
```
❌ wb-component-test.html      # Not discovered!
❌ wb-component-example.html   # Not discovered!
✅ wb-component-demo.html      # Discovered! ✓
✅ wb-component-demo-simple.html # Discovered! ✓
```

## 🎓 Learning Path

1. **Read** this README fully
2. **Study** the template files
3. **Copy** template for new component
4. **Customize** the template
5. **Test** your component
6. **Build** and verify integration
7. **Document** any issues in claude.md

## 📞 Need Help?

Check these resources:
1. Look at working components: `wb-button`, `wb-card`
2. Read `currentstatus.md` for known issues
3. Check build system: `build/gen-main-imports.js`
4. Review demo system: `components/generate-demos-manifest.js`

---

**Remember:** This template exists because we learned from every mistake. Use it! 🚀
