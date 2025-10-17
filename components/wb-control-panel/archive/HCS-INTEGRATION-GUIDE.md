# HCS Control Panel Integration Guide

## 🎨 What Makes This Special

Your **Harmonic Color System (HCS)** is beautifully designed with mathematical color relationships. This control panel works **perfectly** with it by manipulating the **three root variables**:

```css
--hue-primary: 240;          /* 0-360° */
--saturation-primary: 70;    /* 0-100% */
--lightness-primary: 50;     /* 0-100% */
```

**When you change these**, your HCS automatically recalculates:
- ✅ `--accent` (complementary: +180°)
- ✅ `--secondary` (analogous: ±30°)
- ✅ `--neutral-*` (monochromatic scale)
- ✅ All derived colors (dark, light, variants)

---

## 🚀 Quick Start

### 1. Add to Your HTML

```html
<!-- Load your HCS -->
<link rel="stylesheet" href="../../styles/main.css">

<!-- Add the HCS control panel -->
<wb-control-panel-hcs></wb-control-panel-hcs>
<script src="components/wb-control-panel/wb-control-panel-hcs.js"></script>
```

### 2. That's It!

The control panel will:
- ✅ Read current HCS values from `:root`
- ✅ Update them in real-time as you move sliders
- ✅ Apply theme presets (cyberpunk, ocean, sunset, forest)
- ✅ Show live color harmony swatches

---

## 🎯 How It Works

### Control Panel Updates Root Variables
```javascript
// When you move the hue slider:
document.documentElement.style.setProperty('--hue-primary', 180);

// Your HCS automatically recalculates:
--accent: calc(180 + 180) = 360° (red)
--secondary: calc(180 - 30) = 150° (green)
// And ALL derived colors!
```

### Your HCS Does the Math
```css
/* From your main.css: */
--hue-accent: calc(var(--hue-primary) + 180);  /* Complementary */
--hue-secondary-1: calc(var(--hue-primary) - 30);  /* Analogous */
--accent: hsl(var(--hue-accent), var(--saturation-accent)%, ...);
```

**Result:** Change one slider → Entire color scheme recalculates harmoniously! 🎉

---

## 🎨 Features

### 1. Theme Presets
```javascript
// Applies data-theme attribute
<select id="theme-select">
  <option value="dark">Dark (Default)</option>
  <option value="cyberpunk">Cyberpunk</option>
  <option value="ocean">Ocean</option>
  <option value="sunset">Sunset</option>
  <option value="forest">Forest</option>
</select>
```

Works with your existing theme CSS in `main.css`!

### 2. Live Color Harmony
Shows three swatches:
- **Primary** - Your chosen base color
- **Accent** - Complementary (180° opposite)
- **Secondary** - Analogous (30° offset)

### 3. Real-Time Updates
- No delays or event bus confusion
- Direct CSS variable manipulation
- Instant visual feedback

---

## 📊 What Gets Updated

When you change **--hue-primary**, these ALL recalculate:

### Primary Family
- `--primary`
- `--primary-dark`
- `--primary-light`

### Accent Family (Complementary)
- `--accent`
- `--accent-light`
- `--accent-dark`

### Secondary Family (Analogous)
- `--secondary`
- `--secondary-light`
- `--secondary-dark`

### Neutral Scale (Monochromatic)
- `--neutral-50` through `--neutral-900`
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--border-color`, `--border-light`, `--border-dark`

### Semantic Colors
- `--btn-primary-bg`, `--btn-primary-hover`
- `--link-primary`, `--link-primary-hover`
- All other semantic tokens

---

## 🧪 Test Page

Open `test-hcs.html` to see:
1. **Live color swatches** updating in real-time
2. **Buttons** using HCS semantic colors
3. **Status badges** (success, warning, error, info)
4. **Current values** display showing HCS variables
5. **Theme presets** for instant color scheme changes

---

## 💡 Why This Works Better Than v1/v2

### Old Approach (v1/v2)
```javascript
// Applied individual CSS variables
document.documentElement.style.setProperty('--text-primary', color);
document.documentElement.style.setProperty('--primary', color);
document.documentElement.style.setProperty('--accent', ???);  // ❌ What value?
document.documentElement.style.setProperty('--secondary', ???);  // ❌ What value?
```

### HCS Approach (v3)
```javascript
// Just update the root hue - HCS does the rest!
document.documentElement.style.setProperty('--hue-primary', 180);
// ✅ Accent, secondary, neutrals ALL recalculate automatically via CSS calc()
```

---

## 🎯 Color Theory in Action

### Example: Changing Hue from 240° to 180°

**Before (Blue base):**
```css
--hue-primary: 240;       /* Blue */
--accent: hsl(60, ...);   /* Orange (240 + 180 = 60) */
--secondary: hsl(210, ...); /* Blue-cyan (240 - 30 = 210) */
```

**After (Cyan base):**
```css
--hue-primary: 180;       /* Cyan */
--accent: hsl(360, ...);  /* Red (180 + 180 = 360) */
--secondary: hsl(150, ...); /* Green (180 - 30 = 150) */
```

All relationships maintained, colors shift harmoniously! 🌈

---

## 🔧 Customization

Want to change the default values?

### In HTML:
```html
<!-- Control panel reads from :root automatically -->
<wb-control-panel-hcs></wb-control-panel-hcs>
```

### In CSS:
```css
:root {
  --hue-primary: 300;        /* Start with magenta */
  --saturation-primary: 80;  /* More saturated */
  --lightness-primary: 60;   /* Lighter */
}
```

The control panel will load these values on startup!

---

## 📝 Summary

**HCS Control Panel v3:**
- ✅ Works perfectly with your Harmonic Color System
- ✅ Updates root HSL values → entire system recalculates
- ✅ Shows live color harmony swatches
- ✅ Includes theme presets
- ✅ Simple, clean, no dependencies
- ✅ ~300 lines of code (vs 2000+ in v1)

**The secret:** Let your brilliant HCS math do the work! 🎨✨
