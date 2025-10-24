# 🔧 Troubleshooting: Is the Page Reacting?

## ✅ Quick Checks

### 1. Open Browser Console (F12)
**Look for these messages:**
```
🌊 Wave-Based Color Harmony System Demo initialized
📦 Loading WB components...
✅ DOM loaded - Color Harmony Demo ready
✅ Harmony system loaded!
✅ HCS: Restored mode: dark, theme: dark
✅ wb-control-panel-hcs loaded - adjust colors live!
```

### 2. Check if Control Panel is Visible
- Look in **top-right corner** of page
- Should see floating dark panel
- Title: "🎨 HCS Control Panel"
- If not visible, try:
  - Scroll up
  - Zoom out (Ctrl + -)
  - Resize browser window

### 3. Check if Components Loaded
**In console, type:**
```javascript
document.querySelector('wb-control-panel-hcs')
```
**Should return:** `<wb-control-panel-hcs>` element  
**If null:** Component didn't load

### 4. Test Color Changes Manually
**In console, type:**
```javascript
document.documentElement.style.setProperty('--hue-primary', '180')
```
**Should:** Change page to cyan colors immediately  
**If not:** CSS variables not working

---

## 🐛 Common Issues & Fixes

### Issue 1: Control Panel Not Showing
**Symptoms:** No panel in top-right corner

**Fix A - Check Z-Index:**
```javascript
// In console:
const panel = document.querySelector('wb-control-panel-hcs');
if (panel && panel.shadowRoot) {
    console.log('Panel exists!', panel);
} else {
    console.log('Panel not found or shadow root issue');
}
```

**Fix B - Force Visibility:**
Open DevTools → Elements → Find `<wb-control-panel-hcs>` → Check styles

**Fix C - Reload Page:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear cache and reload

### Issue 2: Colors Not Changing
**Symptoms:** Sliders move but colors don't update

**Diagnostic:**
```javascript
// Check if CSS variables exist:
getComputedStyle(document.documentElement).getPropertyValue('--hue-primary')
// Should return a number like "240"

// Check if main.css loaded:
document.querySelector('link[href*="main.css"]')
// Should return the link element
```

**Fix:**
- Verify `../../styles/main.css` path is correct
- Check Network tab in DevTools for 404 errors
- Ensure main.css has HCS variables defined

### Issue 3: wb-demo Component Not Working
**Symptoms:** Content not showing in tabs

**Fix:**
```javascript
// Check if wb-demo is registered:
customElements.get('wb-demo')
// Should return the class definition

// If undefined, component not loaded
```

**Solution:** Load wb-demo component explicitly:
```html
<script src="../../components/wb-demo/wb-demo.js"></script>
```

### Issue 4: Module Import Errors
**Symptoms:** Console shows import errors

**Check:**
- Are you opening via file:// protocol?
- File protocol may block ES6 modules

**Fix - Use Local Server:**
```bash
# Option 1: Python
cd "C:\Users\jwpmi\Downloads\AI\wb\html\Color Harmony System"
python -m http.server 8000
# Open: http://localhost:8000

# Option 2: Node.js
npx http-server -p 8000

# Option 3: VS Code Live Server
# Right-click index.html → Open with Live Server
```

---

## 🎯 Step-by-Step Diagnostic

### Step 1: Open DevTools
1. Press F12
2. Go to Console tab
3. Look for errors (red text)
4. Take note of any warnings

### Step 2: Check Network Tab
1. Go to Network tab in DevTools
2. Refresh page (F5)
3. Look for failed requests (red status codes)
4. Common issues:
   - `main.css` → 404: Path incorrect
   - `wb-color-harmony.js` → 404: Path incorrect  
   - `wb-control-panel-hcs.js` → 404: Component not found

### Step 3: Check Elements Tab
1. Go to Elements tab
2. Find `<wb-control-panel-hcs>` in DOM tree
3. Expand it
4. Check if `#shadow-root (open)` exists
5. Inside shadow root, look for panel HTML

### Step 4: Test Manually
Run these commands in console:

```javascript
// 1. Check if harmony system loaded
console.log('WBColorHarmony available?', typeof WBColorHarmony);

// 2. Check if control panel exists
console.log('Control panel:', document.querySelector('wb-control-panel-hcs'));

// 3. Test color change manually
document.documentElement.style.setProperty('--hue-primary', '120');
// Page should turn green

// 4. Revert
document.documentElement.style.setProperty('--hue-primary', '240');
// Page should turn blue again
```

---

## ✅ Expected Behavior

### When Page Loads:
1. ✅ Console shows initialization messages
2. ✅ Control panel appears top-right
3. ✅ Page shows dark theme with blue colors (240°)
4. ✅ Two tabs visible: Documentation & Examples

### When You Move Hue Slider:
1. ✅ Slider moves smoothly
2. ✅ Page colors change immediately
3. ✅ All elements update (cards, buttons, text)
4. ✅ Console logs: `🎨 Color changed: --hue-primary = [new value]`

### When You Change Harmony Mode:
1. ✅ Dropdown updates
2. ✅ Accent/secondary colors recalculate
3. ✅ Console logs harmony mode change
4. ✅ Color relationships change visibly

---

## 🔄 Quick Fixes

### Nuclear Option - Complete Reset:
```javascript
// Clear all localStorage
localStorage.clear();

// Reset CSS variables
document.documentElement.style.setProperty('--hue-primary', '240');
document.documentElement.style.setProperty('--saturation-primary', '70');
document.documentElement.style.setProperty('--lightness-primary', '50');

// Reload page
location.reload();
```

### Minimal Working Test:
Create `test.html` in same folder:
```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <title>Control Panel Test</title>
    <link rel="stylesheet" href="../../styles/main.css">
</head>
<body style="padding: 2rem;">
    <h1>Control Panel Test</h1>
    <p>If control panel appears in top-right, it's working!</p>
    
    <script src="../../components/wb-color-harmony/wb-color-harmony.js"></script>
    <wb-control-panel-hcs></wb-control-panel-hcs>
    <script type="module">
        import '../../components/wb-control-panel/archive/wb-control-panel-hcs.js';
        console.log('✅ Test page loaded');
    </script>
</body>
</html>
```

Open `test.html` - if control panel works here, issue is elsewhere.

---

## 📞 Report Back

**Please check and let me know:**

1. ✅ or ❌ Control panel visible?
2. ✅ or ❌ Any console errors?
3. ✅ or ❌ Colors changing when you adjust sliders?
4. ✅ or ❌ Using local server or file:// protocol?

**Copy/paste console output** if there are errors!

---

## 🎯 Most Likely Issues

### 1. Path Issues (90%)
- `../../styles/main.css` path wrong
- `../../components/` path wrong
- Components not where expected

### 2. Module Loading (5%)
- file:// protocol blocking imports
- Need local server

### 3. Component Registration (5%)
- wb-demo not registered
- wb-control-panel-hcs not defined

**Let me know what you see and I'll help fix it!** 🔧
