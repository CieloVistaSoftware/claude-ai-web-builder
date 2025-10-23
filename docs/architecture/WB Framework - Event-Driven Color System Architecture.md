# WB Framework - Event-Driven Color System Architecture

**READ THIS FIRST** - This document explains how the entire color system works in the WB Framework.

---

## 🎯 The Core Concept

The WB Framework uses an **event-driven, CSS variable-based color system** that allows a single user action to cascade color changes across ALL components automatically.

```
┌─────────────────────────────────────────────────────────────┐
│                    USER MOVES SLIDER                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           wb-control-panel Component                        │
│   • Dispatches: wb:color-changed Event                      │
│   • Payload: { hue, saturation, lightness }                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│          wb-theme-listener.js (Global Listener)             │
│   • Catches: wb:color-changed Event                         │
│   • Action: Sets CSS custom properties on :root             │
│   • Example: root.style.setProperty('--hue-primary', 240)   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│        _variables.css (CSS Custom Properties)               │
│   • Updates ALL derived colors automatically                │
│   • --primary uses --hue-primary                            │
│   • --secondary uses --hue-primary + 180°                   │
│   • --accent uses --hue-primary - 30°                       │
│   • 50+ colors auto-calculate in cascading effect           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         All Components Using var(--primary) etc             │
│   • No component code changes needed                        │
│   • Colors update automatically                             │
│   • Every control instantly reflects new colors             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Key Files & Their Roles

### 1️⃣ **Control Panel Component**
**Location:** `components/wb-control-panel/wb-control-panel.js`

**What it does:**
- Renders UI with sliders for:
  - Primary Hue (0-360°)
  - Primary Saturation (0-100%)
  - Primary Lightness (0-100%)
  - Background Hue, Saturation, Lightness
- Listens to user input on slider changes
- Dispatches events with new color values

**Events it sends:**
```javascript
// When primary color sliders change
document.dispatchEvent(new CustomEvent('wb:color-changed', {
  detail: {
    hue: 240,
    saturation: 70,
    lightness: 50,
    harmonyMode: 'complementary'
  }
}));

// When background color sliders change
document.dispatchEvent(new CustomEvent('wb:background-color-changed', {
  detail: {
    hue: 220,
    saturation: 20,
    lightness: 15
  }
}));

// When mode toggle clicked
document.dispatchEvent(new CustomEvent('wb:mode-changed', {
  detail: { mode: 'dark' }
}));
```

**Key Methods:**
- `attachEventListeners()` - Attaches to slider DOM elements
- `dispatchColorChange()` - Sends `wb:color-changed` event
- `dispatchBackgroundColorChange()` - Sends `wb:background-color-changed` event
- `saveState()` - Persists settings to localStorage

---

### 2️⃣ **Theme Listener Script**
**Location:** `styles/wb-theme-listener.js`

**What it does:**
- Global event listener that catches ALL color change events
- Updates CSS custom properties on document root
- Makes color changes cascade to all components

**Critical Loading Requirement:**
```html
<!-- MUST load AFTER main.css -->
<link rel="stylesheet" href="./styles/main.css">
<script src="./styles/wb-theme-listener.js" defer></script>
```

**Events it listens for:**
```javascript
// Listens for primary color changes
document.addEventListener('wb:color-changed', (e) => {
  const { hue, saturation, lightness } = e.detail;
  root.style.setProperty('--hue-primary', hue);
  root.style.setProperty('--saturation-primary', saturation);
  root.style.setProperty('--lightness-primary', lightness);
  // Updates --primary, --secondary, --accent automatically!
});

// Listens for background color changes
document.addEventListener('wb:background-color-changed', (e) => {
  const { hue, saturation, lightness } = e.detail;
  root.style.setProperty('--hue-background', hue);
  root.style.setProperty('--saturation-background', saturation);
  root.style.setProperty('--lightness-background', lightness);
});

// Listens for dark/light mode changes
document.addEventListener('wb:mode-changed', (e) => {
  const { mode } = e.detail;
  document.body.setAttribute('data-mode', mode);
  document.documentElement.setAttribute('data-mode', mode);
});

// Listens for theme selection (named or HCS themes)
document.addEventListener('wb:theme-changed', (e) => {
  const { theme, category, data } = e.detail;
  // Applies predefined theme colors
});

// Listens for layout changes
document.addEventListener('wb:layout-changed', (e) => {
  const { layout } = e.detail;
  document.body.setAttribute('data-layout', layout);
});
```

**Key Functions:**
- `applyNamedTheme(data)` - Applies named color theme
- `applyHCSTheme(data)` - Applies Harmonic Color System theme

---

### 3️⃣ **CSS Variables Foundation**
**Location:** `styles/_variables.css`

**What it does:**
- Defines all 50+ CSS custom properties
- Uses HSL-based calculations so colors auto-derive from primary hue
- Maintains color harmony relationships mathematically

**The Magic: Auto-Cascading Colors**

When `--hue-primary` changes from 240° to 280°:

```css
:root {
  --hue-primary: 240; /* User changes to 280 */
  
  /* Primary color uses --hue-primary directly */
  --primary: hsl(var(--hue-primary), 70%, 50%);
  /* Becomes: hsl(280, 70%, 50%) - UPDATES! */
  
  /* Secondary uses complementary harmony (180° offset) */
  --secondary-hue: calc(var(--hue-primary) + 180);
  /* Becomes: calc(280 + 180) = 460 = 100 (mod 360) - UPDATES! */
  
  /* Accent uses analogous harmony (-30° offset) */
  --accent-hue: calc(var(--hue-primary) - 30);
  /* Becomes: calc(280 - 30) = 250 - UPDATES! */
}
```

**Result:** ALL derived colors update automatically!

**Color Families Defined:**

```
PRIMARY FAMILY (from --hue-primary)
├── --primary
├── --primary-dark
└── --primary-light

SECONDARY FAMILY (from --hue-primary + 180°)
├── --secondary
├── --secondary-dark
└── --secondary-light

ACCENT FAMILY (from --hue-primary - 30°)
├── --accent
├── --accent-dark
└── --accent-light

EXTENDED PALETTE (Developer access)
├── --plus30, --plus45, --plus60, --plus90 (Clockwise variations)
├── --minus30, --minus45, --minus60, --minus90 (Counter-clockwise variations)
└── 10 neutral levels (--neutral-50 through --neutral-900)

SEMANTIC COLORS (Fixed, psychology-based)
├── --success-color (Green - 120°)
├── --warning-color (Orange - 35°)
├── --error-color (Red - 0°)
└── --info-color (Blue - 200°)

UI COLORS (Dark/Light mode aware)
├── --bg-primary, --bg-secondary, --bg-tertiary
├── --text-primary, --text-secondary, --text-tertiary
├── --border-color, --border-light, --border-dark
└── Adjusts automatically based on data-mode attribute
```

---

### 4️⃣ **Component CSS Files**
**Location:** All component CSS files (e.g., `components/wb-button/wb-button.css`)

**What they do:**
- Use CSS variables instead of hardcoded colors
- Automatically reflect color changes when variables update

**Example - Button Component:**
```css
/* ✅ CORRECT - Uses variable (will auto-update) */
.wb-button {
  background-color: var(--primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.wb-button:hover {
  background-color: var(--primary-dark);
}

/* ❌ WRONG - Hardcoded color (will NOT update) */
.wb-button {
  background-color: hsl(240, 70%, 50%);
}
```

**Best Practice:** Every component CSS should use variables like:
```css
var(--primary)
var(--primary-dark)
var(--secondary)
var(--accent)
var(--text-primary)
var(--bg-primary)
var(--border-color)
```

---

## 🔄 How It All Works Together

### Scenario: User Moves Primary Hue Slider to 280°

**Step 1: User Interaction**
```javascript
// In wb-control-panel.js
hueSlider.addEventListener('input', (e) => {
  this.state.primaryHue = 280; // User moved slider
  this.dispatchColorChange(); // Send event
});
```

**Step 2: Event Dispatch**
```javascript
// Control panel sends event with new value
document.dispatchEvent(new CustomEvent('wb:color-changed', {
  detail: {
    hue: 280,
    saturation: 70,
    lightness: 50
  }
}));
```

**Step 3: Global Listener Catches It**
```javascript
// In wb-theme-listener.js
document.addEventListener('wb:color-changed', (e) => {
  const root = document.documentElement;
  root.style.setProperty('--hue-primary', 280);
  // Updates inline styles on <html> tag
});
```

**Step 4: CSS Variables Auto-Cascade**
```css
/* In _variables.css - these recalculate automatically */
:root {
  --hue-primary: 280; /* Changed! */
  
  --primary: hsl(280, 70%, 50%); /* Updates! */
  --secondary-hue: calc(280 + 180); /* = 100 (mod 360), Updates! */
  --accent-hue: calc(280 - 30); /* = 250, Updates! */
}
```

**Step 5: All Components Update**
```css
/* Button component CSS */
.wb-button {
  background-color: var(--primary); /* Now hsl(280, 70%, 50%) */
}

/* Card component CSS */
.wb-card {
  border-color: var(--secondary); /* Now hsl(100, 60%, 50%) */
}

/* Header component CSS */
.wb-header {
  color: var(--primary-dark); /* Now hsl(280, 70%, 40%) */
}
```

**Result:** Every component that uses `var(--primary)` instantly updates! 🎨✨

---

## 🚨 Troubleshooting Guide

### ❌ Problem: Sliders Move But Colors Don't Change

**Checklist:**
1. **Is `wb-theme-listener.js` loaded?**
   - Check `wb.html` - look for `<script src="./styles/wb-theme-listener.js">`
   - If missing, add: `<script src="./styles/wb-theme-listener.js" defer></script>`

2. **Is it loaded AFTER `main.css`?**
   ```html
   <!-- ✅ CORRECT ORDER -->
   <link rel="stylesheet" href="./styles/main.css">
   <script src="./styles/wb-theme-listener.js" defer></script>
   
   <!-- ❌ WRONG ORDER -->
   <script src="./styles/wb-theme-listener.js"></script>
   <link rel="stylesheet" href="./styles/main.css">
   ```

3. **Check browser console for errors**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red error messages

4. **Verify events are dispatching**
   - Add this to console:
   ```javascript
   document.addEventListener('wb:color-changed', (e) => {
     console.log('Color changed!', e.detail);
   });
   ```
   - Move slider - should see message

---

### ❌ Problem: Only Some Components Update

**Likely Cause:** Component CSS uses hardcoded colors instead of variables

**Solution:** Update component CSS to use variables
```css
/* ❌ Before - hardcoded */
.my-component {
  background: hsl(240, 70%, 50%);
}

/* ✅ After - uses variable */
.my-component {
  background: var(--primary);
}
```

**Find all hardcoded colors:**
```bash
# Search for hardcoded hsl/rgb values in CSS files
grep -r "hsl(" components/*/
grep -r "rgb(" components/*/
```

---

### ❌ Problem: Colors Don't Match Expected Harmony

**Likely Cause:** CSS variables not defined or calculated incorrectly

**Solution:** Check `_variables.css`
```css
:root {
  --hue-primary: 240;
  --saturation-primary: 70;
  --lightness-primary: 50;
  
  /* These should auto-calculate */
  --secondary-hue: calc(var(--hue-primary) + 180); /* 240 + 180 = 60 */
  --accent-hue: calc(var(--hue-primary) - 30);    /* 240 - 30 = 210 */
}
```

---

### ❌ Problem: Theme Listener Not Catching Events

**Debug Steps:**
1. **Verify event is being dispatched:**
   ```javascript
   // Add to wb-control-panel.js
   console.log('Dispatching color change:', {hue, saturation, lightness});
   ```

2. **Verify listener is active:**
   ```javascript
   // Add to browser console
   console.log(document.getEventListeners(document));
   ```

3. **Check for event typos:**
   - Control panel sends: `wb:color-changed`
   - Listener listens for: `wb:color-changed`
   - Must be EXACT match (case-sensitive)

---

## 📊 Event Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│         wb-control-panel Component                  │
│  • Primary Hue Slider: 0-360°                       │
│  • Primary Sat Slider: 0-100%                       │
│  • Primary Light Slider: 0-100%                     │
│  • Background Hue Slider: 0-360°                    │
│  • Background Sat Slider: 0-100%                    │
│  • Background Light Slider: 0-100%                  │
│  • Mode Toggle (Dark/Light)                         │
│  • Theme Selector (Named or HCS)                    │
└────────────────────┬────────────────────────────────┘
                     │ Dispatches Events:
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   wb:color-    wb:background-  wb:mode-
   changed      color-changed    changed
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────┐
    │  wb-theme-listener.js                  │
    │  • Catches all events globally         │
    │  • Updates CSS custom properties       │
    │  • Sets inline styles on <html>        │
    └────────────────────┬───────────────────┘
                         │ Updates:
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
    --hue-primary  --saturation-primary  --lightness-primary
    --hue-background --saturation-background --lightness-background
    data-mode attribute
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  CSS Variables (_variables.css)        │
    │  • --primary (uses --hue-primary)      │
    │  • --secondary (+ 180°)                │
    │  • --accent (- 30°)                    │
    │  • All 50+ colors auto-calculate       │
    └────────────────────┬───────────────────┘
                         │ Cascade to:
        ┌────────────────┼────────────────────────────┐
        ▼                ▼                ▼            ▼
    wb-button      wb-card         wb-header      wb-nav
    background:    border-color:   color:         background:
    var(--primary) var(--accent)   var(--primary) var(--primary-dark)
        │                ▼                │            │
        └────────────────┼────────────────┼────────────┘
                         │ Result:
                         ▼
            ✨ ALL COMPONENTS UPDATE ✨
```

---

## 💡 Best Practices

### ✅ DO:
- Use CSS variables in all component CSS
- Dispatch events from the control panel
- Let the theme listener handle ALL color changes
- Keep color logic in `_variables.css`
- Use HSL for mathematical color relationships

### ❌ DON'T:
- Manipulate component DOM directly from control panel
- Hardcode colors in component CSS
- Create separate color listeners in individual components
- Mix inline styles with CSS variables
- Forget to load `wb-theme-listener.js`

---

## 🎓 Summary

The WB Framework color system is **event-driven, CSS-first, and mathematically harmonious**:

1. **User interacts** with control panel sliders
2. **Events dispatch** globally to document
3. **Theme listener catches** events and updates CSS variables
4. **CSS cascades** changes to all components automatically
5. **No component code needed** - all colors use variables

This design enables:
- ✅ **Single source of truth** - Colors defined in one place
- ✅ **Automatic cascading** - Change one value, update 50+ colors
- ✅ **Zero redundancy** - No duplicate color logic
- ✅ **Mathematical harmony** - Complementary, analogous, semantic colors auto-calculated
- ✅ **Scalability** - Add new components without touching color system
- ✅ **Maintainability** - AI can understand and extend easily

---

**Last Updated:** October 2025
**Framework:** WB (Website Builder)
**Version:** Current
