# WB Color Harmony Web Component

## Overview
`wb-color-harmony` is an interactive web component for generating and visualizing color harmony palettes. It provides HSL sliders, a harmony type selector, and emits palette events. Designed for both display and interactive color theory exploration.

## Features
- HSL sliders (hue, saturation, lightness)
- Harmony type selector (complementary, analogous, triadic, split, square, monochromatic)
- Live palette visualization as labeled swatches
- Emits `wb:color-harmony-change` event with the current palette
- Fully externalized styles and schema

## Usage
```html
<wb-color-harmony></wb-color-harmony>
<script type="module" src="wb-color-harmony.js"></script>
```

## Properties
- `palette`: Array of color objects `{ name, hue, saturation, lightness }` (read-only, set by controls)

## Events
- `wb:color-harmony-change`: Fired whenever the palette changes. Detail: `{ palette }`

## Example
```js
document.querySelector('wb-color-harmony').addEventListener('wb:color-harmony-change', e => {
  console.log('Palette:', e.detail.palette);
});
```
This example adds an event listener to the `wb-color-harmony` component. Whenever the palette changes (due to slider or dropdown interaction), it logs the updated palette object to the console.

## Demo
See `wb-color-harmony-demo.html` for a two-tab demo (Documentation + Examples) with live controls and palette output.

## See Also
- `wb-color-bar`, `wb-color-bars`
- `harmonic-color-mixer.html` demo

## Palette Key Dropdown Specification

The component must include a dropdown (select) for palette key selection with the following requirements:

- The dropdown appears alongside the HSL sliders.
- The first option is (Show All), which when selected, updates all swatches when sliders are changed.
- The dropdown lists all palette keys in this order:
  - primary
  - secondary
  - accent
  - highlight
  - background
  - foreground
  - border
  - plus30
  - plus45
  - plus60
  - plus90
  - minus30
  - minus45
  - minus60
  - minus90
- When a specific key is selected, only that swatch is updated by slider changes; all other swatches remain unchanged.
- All swatches are always visible; the selected swatch is visually highlighted.
- The dropdown defaults to (Show All) on component load.

This ensures users can update the entire palette at once or fine-tune individual colors while seeing the full palette context.


