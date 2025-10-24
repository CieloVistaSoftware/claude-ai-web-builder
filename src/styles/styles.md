# Website Builder Color & Styles System

## Overview
The Website Builder color system is a fully reactive, event-driven architecture for managing themes, palettes, and component styles. It uses CSS custom properties (variables), global event listeners, and web components to ensure that color changes propagate instantly throughout the entire application.

---

## Key Components

### 1. CSS Variables
- Defined in `_variables.css` and imported by `main.css`.
- Provide all base colors, theme tokens, and palette keys.
- Used by every CSS file and component for consistent theming.

### 2. Main Stylesheet (`main.css`)
- Imports variables, base styles, utilities, and layouts.
- Ensures all components and pages use the same color system.

### 3. Theme Listener (`wb-theme-listener.js`)
- Listens for color, theme, and palette change events.
- Updates CSS variables on `:root` and `body` in real time.
- Enables dynamic theming and palette switching.

### 4. Web Components (e.g., `wb-color-harmony`, `wb-control-panel`)
- Fire events (`wb:color-changed`, `wb:color-harmony-change`) when colors or palettes change.
- React to global CSS variable changes for instant style updates.

---

## How It Works
1. **User changes a color or theme** (via a control panel or color harmony component).
2. **Component fires a custom event** (e.g., `wb:color-changed`).
3. **Theme listener updates CSS variables** globally.
4. **All components and styles using those variables update automatically**—no manual refresh needed.

---

## Reactive System
- All colors, backgrounds, borders, and text use CSS variables.
- Changing a variable (by event or in `_variables.css`) updates every style and component instantly.
- No direct coupling—everything is event-driven and variable-based.

---

## Extending the System
- Add new variables to `_variables.css` for new palette keys or theme tokens.
- Dispatch new events from components to update the theme.
- Listen for events in custom scripts to react to color changes.

---

## Example Event Flow
```js
// Component fires event
this.dispatchEvent(new CustomEvent('wb:color-changed', {
  bubbles: true,
  detail: { hue, saturation, lightness }
}));

// Theme listener updates variables
root.style.setProperty('--primary', `hsl(${hue}, ${saturation}%, ${lightness}%)`);
```

---

## Related Files
- [_variables.css](_variables.css)
- [main.css](main.css)
- [layouts.css](layouts.css)
- [wb-theme-listener.js](../styles/wb-theme-listener.js)
- [events.md](../events.md)

---

## Best Practices
- Use CSS variables for all colors and themes.
- Dispatch and listen for events for all color changes.
- Keep components decoupled—never hardcode colors.

## License
MIT
