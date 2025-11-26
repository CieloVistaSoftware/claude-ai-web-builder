# WB Control Panel Web Component

A self-contained web component that provides comprehensive control panel functionality with **document-wide color application**.

## Version 2.1 Features

### ✨ New in v2.1
- **Document-Wide Color Application**: Control panel changes affect ALL elements in the body, not just the panel itself
- **SVG Mode Toggle**: Dark/light mode button uses SVG icons only (no text) - moon 🌙 for dark, sun ☀️ for light
- **Backend Health Check**: Log notifications only appear if backend server is confirmed running
- **Enhanced CSS Variables**: More comprehensive set of CSS variables applied to `document.documentElement`

## Overview

The Control Panel component manages all user interface controls for customizing websites including:
- Edit mode toggling
- Dark/Light mode switching (SVG icon button)
- Theme and layout selection
- Color system controls (HSL sliders)
- Layout configurations

## Architecture

### Document-Wide Theming

The control panel applies CSS variables directly to `document.documentElement` (`:root`), meaning **all elements that use CSS variables will automatically update** without needing JavaScript event listeners.

```css
/* These variables are set by the control panel */
:root {
    --primary: hsl(240, 70%, 50%);
    --primary-dark: hsl(240, 70%, 35%);
    --primary-light: hsl(240, 50%, 75%);
    --secondary: hsl(60, 60%, 50%);
    --accent: hsl(210, 60%, 50%);
    --bg-color: hsl(220, 20%, 15%);
    --text-primary: hsl(240, 5%, 98%);
    /* ...and many more */
}
```

Any element using `var(--primary)`, `var(--bg-color)`, etc. will automatically update when control panel settings change.

### Mode Toggle (SVG Icons)

The dark/light mode toggle button displays:
- **Moon SVG** 🌙 when in dark mode (click to switch to light)
- **Sun SVG** ☀️ when in light mode (click to switch to dark)

No text labels - purely icon-based for a cleaner UI.

### Backend Health Check

Before showing any backend-related notifications or attempting to log to the server:
1. Control panel checks `/api/health` endpoint
2. If backend is unavailable, falls back to console logging silently
3. No error popups or notifications if backend is not running

## Installation

### Basic Usage

```html
<!-- Load component loader -->
<script type="module" src="/build/component-loader.js"></script>

<!-- Import control panel -->
<script type="module">
    import '/components/wb-control-panel/wb-control-panel.js';
</script>

<!-- Use the component -->
<wb-control-panel></wb-control-panel>
```

### For Full Document Theming

Your page should use CSS variables from the control panel:

```css
body {
    background-color: var(--bg-color);
    color: var(--text-primary);
}

.my-button {
    background: var(--primary);
    color: white;
}

.my-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
}
```

## CSS Variables Applied

### Primary Colors
```css
--hue-primary: 240;
--saturation-primary: 70;
--lightness-primary: 50;
--primary: hsl(240, 70%, 50%);
--primary-dark: hsl(240, 70%, 35%);
--primary-light: hsl(240, 50%, 75%);
--primary-rgb: 99, 102, 241;
```

### Secondary & Accent
```css
--secondary: hsl(60, 60%, 50%);           /* Complementary (180°) */
--secondary-color-light: hsl(60, 45%, 65%);
--secondary-color-dark: hsl(60, 70%, 40%);
--accent: hsl(210, 60%, 50%);             /* Analogous (-30°) */
--accent-dark: hsl(210, 70%, 35%);
--accent-light: hsl(210, 45%, 70%);
```

### Background Colors
```css
--bg-color: hsl(220, 20%, 15%);
--bg-primary: hsl(220, 18%, 22%);
--bg-secondary: hsl(220, 16%, 30%);
--bg-tertiary: hsl(220, 14%, 37%);
--surface-raised: hsl(220, 17%, 25%);
--surface-overlay: hsl(220, 15%, 33%);
```

### Text Colors (Mode-Aware)
```css
/* Dark Mode */
--text-primary: hsl(240, 5%, 98%);
--text-secondary: hsl(240, 15%, 85%);
--text-tertiary: hsl(240, 20%, 75%);
--text-muted: hsl(240, 25%, 65%);

/* Light Mode */
--text-primary: hsl(240, 10%, 15%);
--text-secondary: hsl(240, 8%, 35%);
--text-tertiary: hsl(240, 6%, 45%);
--text-muted: hsl(240, 6%, 50%);
```

### Borders
```css
--border-color: hsl(240, 6%, 35%);
--border-subtle: hsl(240, 4%, 25%);
```

## Events

### Dispatched Events

```javascript
// Theme applied to entire document
document.addEventListener('wb:theme-applied', (e) => {
    console.log('Theme applied:', e.detail);
    // { mode, primaryHue, primarySat, primaryLight, ... }
});

// Mode changed (dark/light)
document.addEventListener('wb:mode-changed', (e) => {
    console.log('Mode:', e.detail.mode); // 'dark' or 'light'
});

// Primary color changed
document.addEventListener('wb:color-changed', (e) => {
    console.log('Color:', e.detail);
    // { hue, saturation, lightness, harmonyMode }
});

// Background color changed
document.addEventListener('wb:background-color-changed', (e) => {
    console.log('Background:', e.detail);
    // { hue, saturation, lightness }
});

// Layout changed
document.addEventListener('wb:layout-changed', (e) => {
    console.log('Layout:', e.detail.layout);
});

// Footer position changed
document.addEventListener('wb:footer-position-changed', (e) => {
    console.log('Footer:', e.detail.position);
});
```

## Theme Categories

### Named Themes
Pre-configured color themes with auto-calculated harmonies:
- Default (Indigo)
- Cyberpunk
- Neon City
- Ocean
- Forest
- Sunset
- Aurora
- Purple
- Emerald
- Ruby
- Sapphire
- Amber
- Mint
- Coral

### HCS (Harmonic Color System)
Wave-theory based color palettes:
- Complementary (180°)
- Triadic (120°)
- Analogous (±30°)
- Beat Pattern
- Harmonic Series
- Doppler Shift

## File Structure

```
components/wb-control-panel/
├── wb-control-panel.js          # Main component (v2.1)
├── wb-control-panel-shadow.css  # Shadow DOM styles
├── wb-control-panel.css         # Optional external styles
├── wb-control-panel-demo.html   # Demo page
├── wb-control-panel.md          # This documentation
└── wb-control-panel.schema.json # Component schema
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Colors Not Applying to Page Elements
1. Ensure your CSS uses `var(--primary)`, `var(--bg-color)`, etc.
2. Don't override with hardcoded values
3. Check that the control panel component is loaded

### Mode Toggle Not Showing Icon
1. Check browser console for errors
2. Verify the component's Shadow DOM CSS is loading
3. Ensure `/components/wb-control-panel/wb-control-panel-shadow.css` exists

### Backend Logging Not Working
This is expected if the backend server is not running. The control panel:
1. Checks `/api/health` on startup
2. Falls back to console.log if backend unavailable
3. Never shows error popups for missing backend

## License

Part of the WB (Website Builder) project.
