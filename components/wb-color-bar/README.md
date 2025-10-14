# WB Color Bar Component

## Overview
`wb-color-bar` is a self-contained web component for HSL color selection, now supporting harmonic color palette generation and event-driven integration.

## Features
- HSL color slider (hue, saturation, or lightness)
- Emits `colorchange` and `colorselect` events
- Emits `wb:color-harmony-change` event with a full harmony palette (complementary, triadic, analogous, etc.)
- Integrates harmonic/heterodyne color logic (see `harmonic-color-mixer` demo)
- Designed for use in `wb-color-bars`, control panels, and host pages

## Events
- `colorchange`: Fired on slider movement, detail includes `{hue, saturation, lightness, value}`
- `colorselect`: Fired on slider release, detail includes `{hue, saturation, lightness, value}`
- `wb:color-harmony-change`: Fired on any HSL change, detail includes `{hue, saturation, lightness, palette}` where `palette` is an array of harmony colors

## Usage
```html
<wb-color-bar type="hue" hue="240" saturation="70" lightness="50"></wb-color-bar>
```

Listen for harmony events:
```js
document.querySelector('wb-color-bar').addEventListener('wb:color-harmony-change', e => {
  console.log('Harmony palette:', e.detail.palette);
});
```

## Harmony Palette Example
The palette includes:
- Primary
- Complement
- Triadic 1
- Triadic 2
- Analogous -30
- Analogous +30

## See Also
- `wb-color-bars`: Multi-slider HSL color picker
- `harmonic-color-mixer.html`: Full interactive color theory demo
- (Planned) `wb-color-harmony`: Standalone harmony palette visualizer

---
*Last updated: 2025-10-14*
