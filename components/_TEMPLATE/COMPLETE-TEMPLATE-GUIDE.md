# 🎯 WB Component Template - Complete Guide

## Why This Template Exists

After analyzing your component issues, we discovered **5 recurring problems**:

1. **Duplicate Shadow Roots** - Components calling `attachShadow()` when parent already did
2. **Wrong Dark Mode** - Using `@media (prefers-color-scheme: dark)` instead of `data-mode` attributes
3. **Missing CSS Files** - Importing stylesheets that don't exist
4. **Demo File Naming** - Files not discovered because missing "demo" in filename
5. **Manual Build Updates** - Forgetting to update `main.js` and manifests

**This template solves ALL of these problems!**

---

## 🚀 Quick Start (5 Minutes)

### 1. Copy Files from _TEMPLATE folder
```bash
cd C:\Users\jwpmi\Downloads\AI\wb\components
mkdir wb-my-component
# Copy all wb-COMPONENT-NAME.* files
```

### 2. Find and Replace
- `COMPONENT-NAME` → `my-component`
- `ComponentName` → `MyComponent`

### 3. Build
```bash
npm run build
```

---

## 🎯 The 5 Critical Rules

### 1. Never Call attachShadow()
```javascript
// ❌ WRONG
class MyComponent extends WBBaseComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // ERROR!
    }
}

// ✅ CORRECT  
class MyComponent extends WBBaseComponent {
    constructor() {
        super(); // Parent creates shadow root
    }
}
```

### 2. Use data-mode for Dark Mode
```css
/* ❌ WRONG - OS dark mode only */
@media (prefers-color-scheme: dark) {
    .component { background: black; }
}

/* ✅ CORRECT - Control panel dark mode */
:host([data-mode="dark"]) .component {
    background: var(--bg-secondary-dark);
}
```

### 3. Only Import main.css
```html
<!-- ❌ WRONG -->
<link rel="stylesheet" href="./missing-file.css">

<!-- ✅ CORRECT -->
<link rel="stylesheet" href="../../styles/main.css">
<link rel="stylesheet" href="./wb-component.css">
```

### 4. Demo Filename Must Include "demo"
```
❌ wb-component-test.html       # NOT discovered
✅ wb-component-demo.html       # DISCOVERED!
```

### 5. Run npm run build
```bash
npm run build  # Auto-updates main.js and manifests
```

---

## 📁 File Structure

```
wb-YOUR-COMPONENT/
├── wb-YOUR-COMPONENT.js          # Extends WBBaseComponent
├── wb-YOUR-COMPONENT.css         # Uses data-mode for dark mode
├── wb-YOUR-COMPONENT-demo.html   # Contains "demo" in name
├── wb-YOUR-COMPONENT.md          # Documentation
├── wb-YOUR-COMPONENT.schema.json # Schema (optional)
└── ✅ claude.md                  # Issue tracking
```

---

## 🔧 JavaScript Template Explained

### Key Features:

1. **Extends WBBaseComponent** (parent creates shadow root)
2. **Reactive Signals** for state management
3. **Proper Lifecycle** hooks
4. **Attribute Observation** for reactivity

```javascript
class WBComponentName extends WBBaseComponent {
    constructor() {
        super(); // CRITICAL: Parent creates shadow root!
        [this.getVariant, this.setVariant, this.onVariant] = createSignal('primary');
        this.onVariant(() => this.render()); // Auto re-render
    }

    connectedCallback() {
        this.render();
        this.dispatchEvent(new CustomEvent('ready', { bubbles: true }));
    }

    render() {
        this.innerHTML = `<div class="wb-component">...</div>`;
    }
}
```

---

## 🎨 CSS Template Explained

### Critical: Dark Mode Implementation

**The Problem:**
- `@media (prefers-color-scheme: dark)` only responds to OS settings
- Your control panel uses `data-mode` attributes
- Users expect YOUR control panel to work!

**The Solution:**
```css
/* Light mode (default) */
.wb-component {
    background: var(--bg-secondary, #f5f5f5);
    color: var(--text-primary, #1a1a1a);
}

/* Dark mode (control panel) */
:host([data-mode="dark"]) .wb-component,
:host([data-theme*="dark"]) .wb-component {
    background: var(--bg-secondary-dark, #2a2a2a);
    color: var(--text-primary-dark, #ffffff);
}
```

---

## 📄 Demo Template Explained

### Critical Requirements:

1. **Filename MUST contain "demo"**
2. **Only import main.css**
3. **Use wb-demo wrapper**

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <script src="/config.js"></script>
    <script src="/utils/auto-loader.js"></script>
    <link rel="stylesheet" href="../../styles/main.css">
    <link rel="stylesheet" href="./wb-COMPONENT-NAME.css">
</head>
<body data-theme="dark">
    <wb-demo title="Demo" markdown="./wb-COMPONENT-NAME.md">
        <div slot="examples">
            <wb-COMPONENT-NAME variant="primary">Test</wb-COMPONENT-NAME>
        </div>
    </wb-demo>
    <script type="module" src="../wb-demo/wb-demo.js"></script>
    <script type="module" src="./wb-COMPONENT-NAME.js"></script>
</body>
</html>
```

---

## 🛠️ Build System

### How It Works:

```bash
npm run build
```

This automatically:
1. Scans for all `components/wb-*/*.js` files
2. Updates `styles/main.js` with imports
3. Finds all `*demo*.html` files
4. Updates `demos-manifest.json`
5. Updates component index

**No manual editing required!**

---

## ✅ Checklist

- [ ] Copy template files
- [ ] Find/Replace COMPONENT-NAME
- [ ] Find/Replace ComponentName
- [ ] Implement component logic
- [ ] Style with data-mode dark mode
- [ ] Create demo (with "demo" in filename!)
- [ ] Run `npm run build`
- [ ] Test light mode
- [ ] Test dark mode (toggle control panel!)
- [ ] No console errors

---

## 📚 Study These Examples

1. **wb-button** - Full-featured component
2. **wb-card** - Content display
3. **wb-modal** - Overlay pattern

---

## 🎉 Summary

Follow this template and you'll never have:
- ❌ Duplicate shadow root errors
- ❌ Dark mode not working
- ❌ Missing CSS files
- ❌ Demos not discovered
- ❌ Manual build updates

**Just copy, customize, and build!** 🚀
