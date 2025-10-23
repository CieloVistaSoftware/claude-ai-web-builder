# WB Theme Listener

## Overview
`wb-theme-listener.js` is a global event listener script for the Website Builder system. It listens for theme, color, and layout change events and updates CSS variables on the document, enabling dynamic theming and palette changes across all components and pages.

## Features
- Listens for theme, color, mode, harmony, and layout change events
- Updates CSS custom properties (variables) on `:root` and `body`
- Enables real-time color and theme changes for all components
- Supports both named themes and HCS (Harmony Color System) palettes
- Works with any reactive component that dispatches the correct events


## Usage
Include after your main CSS:
```html
<link rel="stylesheet" href="../../styles/main.css">
<script src="../../styles/wb-theme-listener.js"></script>
```

## How WB Theme Listener Gets Started

`wb-theme-listener.js` is started automatically when you include it in your HTML with a `<script src="../../styles/wb-theme-listener.js"></script>` tag. There is no manual initialization required. As soon as the script loads, it immediately attaches event listeners to the document and begins listening for theme, color, and layout events. No function call or setup is needed—just include the script and it runs.

## Events Listened
- `wb:mode-changed` — Updates theme mode (light/dark)
- `wb:theme-changed` — Applies named or HCS theme palettes
- `wb:color-changed` — Updates primary color variables
- `wb:color-harmony-change` — (Recommended) Updates palette from harmony component
- `wb:harmony-changed` — Logs harmony mode changes
- `wb:layout-changed` — Updates layout attributes

## How It Works
When a color or theme event is dispatched (e.g., by `<wb-color-harmony>` or a control panel), the listener updates CSS variables such as:
- `--primary`, `--primary-dark`, `--primary-light`
- `--hue-primary`, `--saturation-primary`, `--lightness-primary`
- Any palette keys provided by the event

This allows all components and CSS to use the latest theme and palette values reactively.

## Example: Dispatching a Color Change
```js
// In a component
this.dispatchEvent(new CustomEvent('wb:color-changed', {
  bubbles: true,
  detail: { hue, saturation, lightness }
}));
```

## Example: Dispatching a Harmony Palette Change
```js
// In wb-color-harmony.js
this.dispatchEvent(new CustomEvent('wb:color-harmony-change', {
  bubbles: true,
  detail: {
    palette: { primary, secondary, accent, ... },
    harmonyMode,
    baseColor: { hue, saturation, lightness }
  }
}));
```

## Extending
You can add listeners for additional events or palette keys as needed. The system is fully decoupled and event-driven.

## Best Practices
- Always dispatch color/harmony events with `bubbles: true` so the global listener can catch them.
- Use CSS variables in your styles for maximum reactivity.
- Do not couple components directly—use events for communication.

## License
MIT
