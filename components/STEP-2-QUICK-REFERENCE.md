# Step 2: Quick Reference - Copy-Paste Code Snippets

## For wb-color-picker

### Change 1: Add Static Property (Line 7)
```javascript
class WBColorPicker extends WBBaseComponent {
    static styleUrl = './wb-color-picker.css';  // ← ADD THIS
```

### Change 2: Remove loadCSS() Call (Line 33)
```javascript
connectedCallback() {
    super.connectedCallback();  // ← ADD THIS
    // REMOVE: this.loadCSS();
    this.render();
    this.setupEventListeners();
}
```

### Change 3: Delete loadCSS() Method (Lines 47-62)
Remove entire method definition.

---

## For wb-dev-toolbox

### New File: wb-dev-toolbox.css
Create this file with all extracted styles.

### Change 1: Add Static Property (Line 5)
```javascript
class WBDevToolbox extends WBBaseComponent {
    static styleUrl = './wb-dev-toolbox.css';  // ← ADD THIS
```

### Change 2: Update Method (Line 40)
Remove `<style>` block from template, keep only HTML.

### Change 3: Add Super Call (Line 54)
```javascript
connectedCallback() {
    super.connectedCallback();  // ← ADD THIS
    // ... rest of method
}
```

---

## For wb-color-transformer

✅ **No changes needed** - Already follows best practices!

---

## Verification

Run in browser console:
```javascript
// Test CSS loading
const picker = document.querySelector('wb-color-picker');
console.log('CSS loaded:', !!picker.shadowRoot.querySelector('link'));
```

---

**Status**: ✅ Ready for Copy-Paste Implementation
