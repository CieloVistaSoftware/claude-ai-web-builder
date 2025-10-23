# 🚀 START HERE - WB Component Template

## What You Need to Know (30 Seconds)

Your .js and .css integration issues existed because of **5 common problems**:

1. ❌ Components calling `attachShadow()` when parent already did
2. ❌ Using `@media (prefers-color-scheme: dark)` instead of `data-mode` attributes
3. ❌ Importing CSS files that don't exist
4. ❌ Demo files not discovered (missing "demo" in filename)
5. ❌ Manually updating `main.js` instead of letting build do it

**This template fixes ALL of them!** ✅

---

## 📁 Template Files (All in This Folder)

1. **`TEMPLATE-SUMMARY.md`** ← **Start with this!** (Quick overview)
2. **`COMPLETE-TEMPLATE-GUIDE.md`** ← Full detailed guide
3. **`wb-COMPONENT-NAME.js`** ← Your JS template
4. **`wb-COMPONENT-NAME.css`** ← Your CSS template
5. **`wb-COMPONENT-NAME-demo.html`** ← Your demo template
6. **`wb-COMPONENT-NAME.md`** ← Documentation template
7. **`wb-COMPONENT-NAME.schema.json`** ← Schema template
8. **`claude-template.md`** ← Issue tracking template

---

## ⚡ Quick Start (5 Minutes)

### 1. Copy Files
```bash
cd C:\Users\jwpmi\Downloads\AI\wb\components
mkdir wb-my-component
# Copy all wb-COMPONENT-NAME.* files to wb-my-component/
```

### 2. Find/Replace in ALL Files
- `COMPONENT-NAME` → `my-component`
- `ComponentName` → `MyComponent`

### 3. Build
```bash
npm run build
```

Done! Your component is integrated! 🎉

---

## 🎯 The Critical Rules

### JavaScript:
```javascript
// ✅ CORRECT
class MyComponent extends WBBaseComponent {
    constructor() {
        super(); // Parent creates shadow root
    }
}

// ❌ WRONG
class MyComponent extends WBBaseComponent {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // ERROR!
    }
}
```

### CSS:
```css
/* ✅ CORRECT - Control panel dark mode */
:host([data-mode="dark"]) .component {
    background: black;
}

/* ❌ WRONG - OS dark mode only */
@media (prefers-color-scheme: dark) {
    .component { background: black; }
}
```

### HTML:
```
✅ wb-component-demo.html       # Discovered!
✅ wb-component-simple-demo.html # Discovered!
❌ wb-component-test.html       # NOT discovered
```

---

## 📖 Read Next

1. **`TEMPLATE-SUMMARY.md`** - Quick overview with examples
2. **`COMPLETE-TEMPLATE-GUIDE.md`** - Full detailed guide
3. Copy template files and start coding!

---

## 🆘 If You Get Stuck

### Problem: Component not loading
- Check console for errors
- Did you extend WBBaseComponent?
- Did you call `super()` in constructor?

### Problem: Dark mode not working
- Using `:host([data-mode="dark"])`? ✅
- Using `@media (prefers-color-scheme)`? ❌

### Problem: Demo not in component browser
- Filename contains "demo"? ✅
- Ran `npm run build`? ✅

---

**You got this! 🚀**

These templates solve your .js/.css integration issues permanently.

Read `TEMPLATE-SUMMARY.md` next! 📖
