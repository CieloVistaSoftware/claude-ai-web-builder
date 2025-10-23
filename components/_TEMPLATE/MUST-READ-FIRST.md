# ⚠️ IMPORTANT: You Must Find/Replace Before Using!

## 🚨 Common Error You're Seeing:

```
Uncaught SyntaxError: "wb-COMPONENT-NAME" is not a valid custom element name
```

**This means you didn't do the Find/Replace step!**

---

## ✅ How to Use This Template (Step-by-Step)

### **Step 1: Decide Your Component Name**

Example: `my-test`

### **Step 2: Copy Template Files**

Copy these files from `_TEMPLATE` folder to your new folder:
- `wb-COMPONENT-NAME.js`
- `wb-COMPONENT-NAME.css`
- `wb-COMPONENT-NAME-demo.html`
- `wb-COMPONENT-NAME.md`
- `wb-COMPONENT-NAME.schema.json`
- `✅ claude.md`

### **Step 3: Find and Replace in ALL Files**

**Open VS Code or your text editor:**

1. Press `Ctrl+Shift+H` (Find and Replace in all files)

2. Replace these **in order**:

   **First:**
   - Find: `wb-COMPONENT-NAME`
   - Replace: `wb-my-test`
   - Click "Replace All"

   **Second:**
   - Find: `COMPONENT-NAME`
   - Replace: `my-test`
   - Click "Replace All"

   **Third:**
   - Find: `WBComponentName`
   - Replace: `WBMyTest`
   - Click "Replace All"

   **Fourth:**
   - Find: `ComponentName`
   - Replace: `MyTest`
   - Click "Replace All"

### **Step 4: Rename Your Files**

Rename the files:
```
wb-COMPONENT-NAME.js         → wb-my-test.js
wb-COMPONENT-NAME.css        → wb-my-test.css
wb-COMPONENT-NAME-demo.html  → wb-my-test-demo.html
wb-COMPONENT-NAME.md         → wb-my-test.md
wb-COMPONENT-NAME.schema.json → wb-my-test.schema.json
```

Keep `✅ claude.md` as is.

### **Step 5: Build**

```bash
npm run build
```

### **Step 6: Test**

Open: `http://127.0.0.1:8083/components/wb-my-test/wb-my-test-demo.html`

---

## 🎯 Example: Creating "wb-my-test"

### Before (Template):
```javascript
class WBComponentName extends WBBaseComponent {
    // ...
}
customElements.define('wb-COMPONENT-NAME', WBComponentName);
```

### After (Your Component):
```javascript
class WBMyTest extends WBBaseComponent {
    // ...
}
customElements.define('wb-my-test', WBMyTest);
```

---

## 🔍 How to Check if You Did It Right

After Find/Replace, search your files for:
- ❌ `COMPONENT-NAME` - Should find **ZERO** results
- ❌ `ComponentName` - Should find **ZERO** results
- ✅ `my-test` - Should find **MANY** results
- ✅ `MyTest` - Should find **MANY** results

---

## 🚨 You CANNOT Use Template Files Directly!

The template files have **placeholders** that must be replaced:
- `COMPONENT-NAME` is NOT a valid custom element name
- `ComponentName` is NOT a valid class name

**You MUST do Find/Replace first!**

---

## 💡 Pro Tip: Use CREATE-COMPONENT.bat

Run the `CREATE-COMPONENT.bat` file in this folder - it will guide you through the process step-by-step!

---

## ❓ Still Having Issues?

Check:
1. ✅ Did you replace ALL instances of `COMPONENT-NAME`?
2. ✅ Did you replace ALL instances of `ComponentName`?
3. ✅ Did you rename the files?
4. ✅ Did you run `npm run build`?
5. ✅ Are you opening the correct URL?

If all else fails, compare your files to `wb-button` component - it's a working example!
