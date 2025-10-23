# CSS Auto-Loading - Quick Reference Card

**Print this and keep it at your desk while refactoring!**

---

## THE GOAL
Every component loads its CSS automatically.

```html
<!-- Before: 2 imports -->
<link rel="stylesheet" href="wb-button/wb-button.css">
<script src="wb-button/wb-button.js"></script>

<!-- After: 1 import -->
<script src="wb-button/wb-button.js"></script>
```

---

## THE ONE-LINE FIX
Add this to every component's `connectedCallback()`:

```javascript
loadComponentCSS(this, 'wb-button.css');
```

That's it! ✅

---

## 5-STEP REFACTORING PROCESS

**Step 1: Import the Utility**
```javascript
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';
```

**Step 2: Call in connectedCallback()**
```javascript
async connectedCallback() {
  super.connectedCallback();
  await loadComponentCSS(this, 'wb-component.css');  // ← THIS LINE
  this.render();
}
```

**Step 3: Extract Embedded CSS (if needed)**
- Find: `<style>` in render method
- Move: All CSS to separate `.css` file
- Delete: `<style>` block from JS

**Step 4: Remove `<style>` from render()**

Before:
```javascript
this.innerHTML = `<style>...CSS...</style><button>...</button>`;
```

After:
```javascript
this.innerHTML = `<button>...</button>`;
```

**Step 5: Test**
- HTML has only `<script>` tag
- Styles render correctly
- No console errors

---

## PHASE 1 COMPONENTS (65 minutes)

| Component | Time |
|-----------|------|
| wb-button | 5 min |
| wb-card | 5 min |
| wb-color-harmony | 5 min |
| wb-control-panel | 10 min |
| wb-demo | 10 min |
| wb-input | 10 min |
| wb-nav | 10 min |
| **TOTAL** | **65 min** |

---

## CHECKLIST: Before You Say "DONE"

- [ ] Import statement added to top of JS file
- [ ] loadComponentCSS() called in connectedCallback()
- [ ] Called BEFORE render()
- [ ] Filename matches actual CSS file
- [ ] All `<style>` tags removed from render()
- [ ] CSS file exists in component folder
- [ ] Test: HTML works with ONLY `<script>` tag
- [ ] Test: Styles render correctly
- [ ] Test: No console errors
- [ ] Demo HTML has no `<link>` tags
- [ ] Component still works perfectly

---

## FILE LOCATIONS TO REMEMBER

```
The Utility:
/components/wb-css-loader/wb-css-loader.js

The Template:
/components/_TEMPLATE/wb-component-template-with-css-loader.js

The Audit Tool:
/scripts/audit-css-loading.js

This Folder:
/docs/_today/
```

---

## KEY INSIGHT

**Why this matters:**

Before: Developers need to remember 2 things  
After: Developers need to remember 1 thing

**One thing is better than two things.** ✅

---

## NEXT STEP

1. **Read**: `CSS-AUTO-LOADING-SUMMARY.md` (5 min)
2. **Pick**: `wb-button` (easiest component)
3. **Follow**: The 5-step process above
4. **Test**: In browser
5. **Celebrate**: First component done! 🎉

---

**Print Date**: October 22, 2025  
**Complexity**: Dead Simple ✅  
**Status**: Ready to Go! 🚀
