# 🎨 WB Color Harmony Component

<div align="center">

**The cornerstone of the WB color system**

*Implementing classical color theory principles within the WB component architecture*

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)]()
[![Shadow DOM](https://img.shields.io/badge/Shadow%20DOM-true-green.svg)]()
[![WB Component](https://img.shields.io/badge/WB-Component-purple.svg)]()

</div>

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Color Theory Fundamentals](#color-theory-fundamentals)
5. [HSL Color Model](#hsl-color-model)
6. [Harmony Algorithms](#harmony-algorithms)
7. [API Reference](#api-reference)
8. [Events](#events)
9. [Usage Examples](#usage-examples)
10. [Theme Integration](#theme-integration)
11. [Accessibility](#accessibility)
12. [Browser Support](#browser-support)

---

## Overview

The `<wb-color-harmony>` component is the **apex of color work** in the WB project, providing:

- 🎯 **Interactive HSL-based color selection** with real-time preview
- 🌈 **Six classical color harmony algorithms** from color theory
- 🖱️ **Clickable harmony swatches** for quick color selection
- 📊 **Dynamic gradient backgrounds** that update based on current color
- 📡 **Complete event system** for integration with other components
- ♿ **Accessible keyboard navigation** and screen reader support

This component serves as the "single source of truth" for color selection across the entire WB ecosystem, enabling consistent theming and color coordination throughout applications.

---

## Installation

### File Structure

```
components/wb-color-harmony/
├── wb-color-harmony.js      # Component logic
├── wb-color-harmony.css     # External styles
├── wb-color-harmony-demo.html  # Interactive demo
└── wb-color-harmony.md      # This documentation
```

### Dependencies

- `wb-base/wb-base.js` - Base component class
- `wb-css-loader/wb-css-loader.js` - CSS loading utility

---

## Quick Start

### HTML

```html
<!-- Basic usage -->
<wb-color-harmony></wb-color-harmony>

<!-- With initial values -->
<wb-color-harmony 
    hue="200" 
    saturation="75" 
    lightness="50"
    harmony-mode="triadic">
</wb-color-harmony>
```

### JavaScript

```javascript
const harmony = document.querySelector('wb-color-harmony');

// Listen for color changes
harmony.addEventListener('colorchange', (e) => {
    console.log('New color:', e.detail.hex);
    console.log('Harmony colors:', e.detail.harmonyColors);
});

// Set color programmatically
harmony.setColor(200, 75, 50);

// Change harmony mode
harmony.setHarmonyMode('triadic');
```

---

## Color Theory Fundamentals

### What is Color Harmony?

**Color harmony** refers to aesthetically pleasing color combinations. These combinations create visual balance and unity. The theory dates back to Isaac Newton's color wheel (1666).

### The Color Wheel

The color wheel arranges hues in a circle based on their chromatic relationship:

```
                        0° RED
                           │
                 330°      │      30°
               MAGENTA     │     ORANGE
                     ╲     │     ╱
           300°       ╲    │    ╱       60°
          PURPLE ──────   ●   ────── YELLOW
                      ╱    │    ╲
               270°  ╱     │     ╲  90°
              VIOLET       │     CHARTREUSE
                           │
                    240°   │   120°
                    BLUE   │   GREEN
                           │
                        180° CYAN
```

### Harmony Relationships

| Relationship | Angle | Effect |
|--------------|-------|--------|
| Complementary | 180° | Maximum contrast, vibrant energy |
| Triadic | 120° | Balanced variety, visual interest |
| Analogous | 30° | Serene, comfortable harmony |
| Split-Comp | 150°/210° | Contrast without tension |
| Tetradic | 90° | Rich complexity, needs balance |

---

## HSL Color Model

This component uses **HSL** (Hue, Saturation, Lightness) rather than RGB because:

1. ✅ HSL maps directly to how humans perceive color
2. ✅ Harmony calculations are simple angular math
3. ✅ Saturation and lightness provide intuitive adjustments
4. ✅ Native CSS support: `hsl()` function

### Hue (0-360°)

| Degree | Color |
|--------|-------|
| 0°/360° | Red |
| 60° | Yellow |
| 120° | Green |
| 180° | Cyan |
| 240° | Blue |
| 300° | Magenta |

### Saturation (0-100%)

- **0%** = Grayscale (no color)
- **50%** = Muted/pastel
- **100%** = Full, vivid color

### Lightness (0-100%)

- **0%** = Pure black
- **50%** = Pure color (most saturated appearance)
- **100%** = Pure white

---

## Harmony Algorithms

### Complementary

Two colors opposite on the wheel (180° apart).

```javascript
complement = (baseHue + 180) % 360
```

**Use Cases:** Call-to-action buttons, high-impact headlines

---

### Triadic

Three colors equally spaced (120° apart).

```javascript
color1 = baseHue
color2 = (baseHue + 120) % 360
color3 = (baseHue + 240) % 360
```

**Use Cases:** Vibrant designs, multi-category dashboards

---

### Analogous

Adjacent colors on the wheel (30° apart).

```javascript
color1 = (baseHue - 30 + 360) % 360
color2 = baseHue
color3 = (baseHue + 30) % 360
```

**Use Cases:** Nature themes, calming interfaces

---

### Split-Complementary

Base + two colors adjacent to complement (150°, 210°).

```javascript
color1 = baseHue
color2 = (baseHue + 150) % 360
color3 = (baseHue + 210) % 360
```

**Use Cases:** Modern web design, versatile branding

---

### Tetradic (Square)

Four colors equally spaced (90° apart).

```javascript
color1 = baseHue
color2 = (baseHue + 90) % 360
color3 = (baseHue + 180) % 360
color4 = (baseHue + 270) % 360
```

**Use Cases:** Complex dashboards, multi-product branding

---

### Monochromatic

Single hue with varying lightness.

```javascript
dark     = { h, s, l - 30 }
midDark  = { h, s, l - 15 }
base     = { h, s, l }
midLight = { h, s, l + 15 }
light    = { h, s, l + 30 }
```

**Use Cases:** Corporate apps, minimalist design

---

## API Reference

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `hue` | Number | 180 | Color hue (0-360) |
| `saturation` | Number | 70 | Color saturation (0-100) |
| `lightness` | Number | 50 | Color lightness (0-100) |
| `harmony-mode` | String | 'complementary' | Active harmony algorithm |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `hue` | Number | Current hue value |
| `saturation` | Number | Current saturation |
| `lightness` | Number | Current lightness |
| `harmonyMode` | String | Current mode |
| `color` | Object | Complete color data (read-only) |

### Methods

| Method | Description |
|--------|-------------|
| `setColor(h, s, l)` | Set HSL values, fires colorchange |
| `setHarmonyMode(mode)` | Change mode, fires harmonychange |
| `getHarmonyColors()` | Get array of harmony colors |
| `copyColor()` | Copy hex to clipboard |
| `randomColor()` | Generate random color |
| `resetColor()` | Reset to defaults |

---

## Events

All events bubble and cross shadow DOM boundaries.

### `colorchange`

Fired when any HSL value changes.

```javascript
element.addEventListener('colorchange', (e) => {
    console.log(e.detail.hex);           // "#26BFBF"
    console.log(e.detail.harmonyColors); // Array
});
```

### `harmonychange`

Fired when harmony mode changes.

```javascript
element.addEventListener('harmonychange', (e) => {
    console.log(e.detail.mode);   // 'triadic'
    console.log(e.detail.colors); // Array
});
```

### `swatchselect`

Fired when a harmony swatch is clicked.

### `colorcopied`

Fired when color is copied to clipboard.

---

## Usage Examples

### Theme Generator

```javascript
function applyTheme(picker) {
    const colors = picker.getHarmonyColors();
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', colors[0]?.hex);
    root.style.setProperty('--color-secondary', colors[1]?.hex);
    root.style.setProperty('--color-accent', colors[2]?.hex);
}
```

### Real-Time CSS Variables

```javascript
picker.addEventListener('colorchange', (e) => {
    const { harmonyColors } = e.detail;
    
    harmonyColors.forEach((color, index) => {
        document.documentElement.style.setProperty(
            `--harmony-${index}`,
            color.hex
        );
    });
});
```

---

## Accessibility

- ✅ Full keyboard navigation
- ✅ Clear labels on all controls
- ✅ Proper ARIA attributes
- ✅ Auto-adjusting text contrast

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 67+ |
| Firefox | 63+ |
| Safari | 12.1+ |
| Edge | 79+ |

---

## Changelog

### v3.0.0 (Current)
- Complete rewrite with full documentation
- All harmony modes fully responsive
- Dynamic slider gradients (fixed brown issue)
- Enhanced accessibility
- Comprehensive event system

---

<div align="center">

**Built with 💜 for the WB Project**

</div>
