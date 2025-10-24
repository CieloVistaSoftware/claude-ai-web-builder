# Website Builder Events Reference

## Overview
This document lists all custom events fired and listened to throughout the Website Builder system. It starts from `index.html` and traces event flow through every major component and global listener.

---

## 1. index.html (Entry Point)
- **Global Listeners Registered:**
  - `wb-theme-listener.js` (listens for theme, color, harmony, layout events)
  - Other global scripts may register listeners for navigation, layout, etc.

---

## 2. Global Theme Listener (`wb-theme-listener.js`)
- **Listens for:**
  - `wb:mode-changed`
  - `wb:theme-changed`
  - `wb:color-changed`
  - `wb:color-harmony-change`
  - `wb:harmony-changed`
  - `wb:layout-changed`
- **Fires:**
  - Updates CSS variables on `:root` and `body`

---

## 3. Control Panel (`wb-control-panel`)
- **Fires:**
  - `wb:color-changed` (when sliders or color pickers are used)
  - `wb:mode-changed` (theme mode switch)
  - `wb:theme-changed` (theme selection)
  - `wb:layout-changed` (layout changes)
- **Listens for:**
  - May listen for `wb:color-harmony-change` to update preview

---

## 4. Color Harmony Component (`wb-color-harmony`)
- **Fires:**
  - `wb:color-harmony-change` (when palette changes)
- **Listens for:**
  - May listen for `wb:color-changed` to update its own state

---

## 5. Other Components (e.g., `wb-btn`, `wb-card`, etc.)
- **Listens for:**
  - CSS variable changes (reactive via CSS)
  - May listen for theme or color events if they have dynamic logic
- **Fires:**
  - Typically do not fire global events, but may dispatch local events for interaction

---

## 6. Layout Manager (`layout-manager.js`)
- **Fires:**
  - `wb:layout-changed` (when layout is switched)
- **Listens for:**
  - May listen for theme or mode changes to adjust layout styling

---

## 7. Demo Pages (e.g., `wb-color-harmony-demo.html`)
- **Fires:**
  - May dispatch color or harmony events for demonstration
- **Listens for:**
  - Theme, color, and palette events to update UI

---

## Event Flow Example
1. User changes color in `wb-control-panel` → fires `wb:color-changed`
2. `wb-theme-listener.js` updates CSS variables
3. All components update their styles reactively
4. If `wb-color-harmony` changes palette, it fires `wb:color-harmony-change`
5. Theme listener and any preview components update accordingly

---

## Best Practices
- Always use `bubbles: true` for global events
- Components should not directly couple to listeners—use events
- Use CSS variables for style reactivity

## Extending
Add new events and listeners as needed for new features. Document them here for clarity.

## License
MIT
