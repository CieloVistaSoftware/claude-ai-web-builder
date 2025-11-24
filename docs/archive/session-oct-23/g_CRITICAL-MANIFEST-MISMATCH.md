# 🔴 CRITICAL ISSUE - PATH/NAME MISMATCH IN MANIFEST

**Date**: October 22, 2025  
**Severity**: 🔴 **CRITICAL - Blocks ALL component loading**  
**Root Cause**: Manifest lists `wb-btn` but folder is `wb-button`

---

## 🎯 THE REAL PROBLEM

The manifest.json has **mismatched names**:

```json
{
  "dependencies": [
    "wb-button"  // ← Actual folder name
  ],
  "components": [
    "wb-btn"     // ← Custom element name (SHORT NAME)
  ]
}
```

But the **auto-loader** is using the component name (`wb-btn`) to construct file paths:

```
Looking for: /components/wb-btn/wb-btn.js  ❌ (doesn't exist)
Should be:  /components/wb-button/wb-button.js  ✅ (exists)
```

---

## 🔍 WHAT'S HAPPENING

1. **Page loads** wb-button-demo.html
2. **Auto-loader scans** for `<wb-btn>` elements
3. **Auto-loader reads** manifest.json
4. **Auto-loader tries to load** from `wb-btn` folder path
5. **Server returns 404** - folder doesn't exist!
6. **Auto-loader tries to execute** HTML (404 error page) as JS
7. **MIME type errors** cascade

---

## ✅ THE FIX

There are **2 ways** to fix this:

### **OPTION A: Update Manifest** (RECOMMENDED - 2 min)
Update manifest.json to use consistent naming:

```json
{
  "dependencies": [
    "wb-base",
    "wb-event-log",
    "wb-button",
    // ...
  ],
  "components": [
    "wb-button",      // ← CHANGED from "wb-btn"
    "wb-card",
    // ...
  ]
}
```

**But**: Custom element name `<wb-btn>` must also exist in the JS!

### **OPTION B: Add Name Mapping** (Better - 5 min)
Create alias mapping in manifest:

```json
{
  "componentAliases": {
    "wb-btn": "wb-button",      // Map short name to folder
    "wb-button": "wb-button"
  },
  "components": [
    "wb-btn",      // Keep short name for custom element
    "wb-card",
  ]
}
```

Then update auto-loader to use this mapping.

### **OPTION C: Disable Auto-Loader** (Quick hack - 1 min)
Just load components manually with `type="module"`:

```html
<script type="module" src="/components/wb-button/wb-button.js"></script>
```

This **bypasses** the auto-loader issue entirely.

---

## 📋 THE REAL PROBLEM

Looking at the actual components:

| Component | Folder Name | Custom Element | File Name | Status |
|-----------|-------------|-----------------|-----------|--------|
| Button | `wb-button` | `<wb-btn>` | `wb-button.js` | ⚠️ MISMATCH |
| Card | `wb-card` | `<wb-card>` | `wb-card.js` | ✅ Consistent |
| Modal | `wb-modal` | `<wb-modal>` | `wb-modal.js` | ✅ Consistent |

So it's **just the button component** that has the naming mismatch!

---

## 🚀 QUICKEST FIX: OPTION C (Recommended)

**Why?** 
- Solves immediate problem (1 min)
- Doesn't require changing manifest
- Works with manual loading
- Avoids auto-loader dependency

**How:**

1. **In wb-button-demo.html**, we already added:
   ```html
   <script type="module" src="./wb-button.js"></script>
   ```

2. **Add to page head** to disable auto-loader triggering:
   ```html
   <script>
     window.WB_AUTOLOADER_DISABLED = true;
   </script>
   ```

3. **Remove the auto-loader call** or disable it in config

---

## 🔧 COMPLETE FIX STRATEGY

### Step 1: Fix the Manifest (Best Long-term)
Change `"wb-btn"` to `"wb-button"` in components list

### Step 2: Update Demo Files
All demo files should load components with `type="module"` directly

### Step 3: Update Auto-Loader (Optional)
Add alias mapping support to handle future naming mismatches

---

## 📝 IMMEDIATE ACTION PLAN

Choose one:

### **Plan A: Quick Fix (5 min)** - Disable auto-loader
1. Update wb-button-demo.html to disable auto-loader
2. Keep `<script type="module" src="./wb-button.js"></script>` 
3. Test - should work

### **Plan B: Fix Manifest (2 min)** - Correct the source
1. Update manifest.json: change `"wb-btn"` → `"wb-button"`
2. Update auto-loader to use folder name (not component name)
3. Test - auto-loader works

### **Plan C: Add Alias Support (10 min)** - Flexible solution
1. Add `componentAliases` to manifest
2. Update auto-loader to use aliases
3. Supports both short and long names
4. Future-proof

---

## 🎯 RECOMMENDATION

**Do Plan A (Quick Fix) NOW**:
- Solves the problem immediately
- Takes 5 minutes max
- Unblocks testing
- Can revisit manifest later

Then **do Plan B (Fix Manifest)** as housekeeping:
- Ensures consistency long-term
- Makes auto-loader work correctly
- Takes 2 minutes

---

## 💡 WHY THIS HAPPENED

The component probably:
1. Started as `wb-btn` (short name for custom element `<wb-btn>`)
2. Later renamed to `wb-button` (folder name)
3. But **manifest wasn't updated**
4. And **custom element still called `<wb-btn>`**
5. Creating mismatch between folder name and element name

---

## 🔍 VERIFICATION

To verify the issue:
1. Check manifest.json - lists `"wb-btn"` ✅ (confirmed)
2. Check folder - named `wb-button` ✅ (confirmed)
3. Check JS file - custom element is `customElements.define('wb-btn', ...)` - need to check
4. Check demo - uses `<wb-btn>` element - need to check

Let me verify the actual custom element name in wb-button.js:

---

**NEXT STEP**: Should I:
1. **A)** Check wb-button.js to see actual custom element name
2. **B)** Implement Plan A (disable auto-loader) immediately
3. **C)** Implement Plan B (fix manifest) immediately
4. **D)** Do all three (full fix)?

What's your preference?
