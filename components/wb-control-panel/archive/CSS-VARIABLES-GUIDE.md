# Control Panel v2 - Custom CSS Variables Guide

## 🎯 Quick Start

### Default Usage
```html
<wb-control-panel-v2></wb-control-panel-v2>
```

**Applies to these CSS variables:**
- `--text-primary` (from Hue/Sat/Light sliders)
- `--primary` (from Hue/Sat/Light sliders)
- `--bg-primary` (from Background sliders)
- `--background` (from Background sliders)

---

## 🎨 Custom CSS Variables

### Change Primary Color Variable
```html
<wb-control-panel-v2 css-primary="--my-color"></wb-control-panel-v2>
```

Now the Hue/Sat/Light sliders will update `--my-color` instead of `--primary`

### Change All Variables
```html
<wb-control-panel-v2 
    css-primary="--accent"
    css-hue="--main-hue"
    css-sat="--main-saturation"
    css-light="--main-lightness">
</wb-control-panel-v2>
```

---

## 📋 Available Attributes

| Attribute | Default Value | Description |
|-----------|---------------|-------------|
| `css-primary` | `--primary` | Main color variable |
| `css-hue` | `--text-primary` | Hue component |
| `css-sat` | `--text-primary` | Saturation component |
| `css-light` | `--text-primary` | Lightness component |

---

## 💡 Real-World Examples

### Example 1: Brand Colors
```html
<!-- Control panel updates your brand color -->
<wb-control-panel-v2 css-primary="--brand-color"></wb-control-panel-v2>

<style>
    .logo {
        color: var(--brand-color);
    }
    .button-primary {
        background: var(--brand-color);
    }
</style>
```

### Example 2: Text vs Background
```html
<!-- Separate controls for text and background -->
<wb-control-panel-v2 css-primary="--text-color"></wb-control-panel-v2>

<style>
    body {
        color: var(--text-color);
        background: var(--bg-primary);
    }
</style>
```

### Example 3: Multiple Color Schemes
```html
<!-- Light theme colors -->
<wb-control-panel-v2 
    css-primary="--light-text"
    id="light-panel">
</wb-control-panel-v2>

<!-- Dark theme colors -->
<wb-control-panel-v2 
    css-primary="--dark-text"
    id="dark-panel">
</wb-control-panel-v2>
```

---

## ✅ What's Fixed in v2

1. **Theme changes work** ✅
   - Applies `data-theme` attribute to body immediately
   - Works with your existing theme CSS

2. **Proper scrolling** ✅
   - Panel has fixed max-height
   - Scrolls smoothly with custom scrollbar

3. **Background colors** ✅
   - Added separate BG Hue/Sat/Light controls
   - Applies to `--bg-primary` and `--background`

4. **Custom CSS variables** ✅
   - Use `css-primary` attribute to target any variable
   - Shows current variable name in UI

---

## 🔧 How It Works

**Simple flow:**
```
User moves slider → JS updates CSS variable → Page updates instantly
```

**No:**
- ❌ Event bus confusion
- ❌ Component registry overhead  
- ❌ Schema validation
- ❌ "Reactive" vs "Imperative" debates

**Just:**
- ✅ Direct CSS variable updates
- ✅ Immediate visual feedback
- ✅ Simple and predictable

---

## 🚀 Migration from v1

**Old (v1 - doesn't work):**
```html
<wb-control-panel></wb-control-panel>
```

**New (v2 - works immediately):**
```html
<wb-control-panel-v2></wb-control-panel-v2>
```

**That's it!** Everything else is the same.

---

## 📝 Notes

- Control panel is self-contained (shadow DOM)
- No dependencies required
- ~300 lines of code (vs 2000+ in v1)
- Works in all modern browsers
- Can have multiple panels on one page

---

**Questions?** Open `test-simple.html` to see it in action!
