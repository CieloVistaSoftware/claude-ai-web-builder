# _variables.css

## Purpose
This file defines all CSS custom properties (variables) and design tokens for the Website Builder system. It is the foundation for all theming, color, and spacing across the app.

## Relationships
- Imported first in `main.css` to ensure all variables are available globally.
- Used by all other CSS files and components for consistent theming.
- Changes to variables here propagate reactively to all styles and components.

## Reactive System
This is a reactive system: when you update a color or variable in `_variables.css`, all components and styles using those variables update automatically. No manual changes are needed elsewhere.

## Related Files
- [main.css](main.css): Imports this file and applies base, utility, and layout styles.
- [layouts.css](layouts.css): Uses variables from this file for layout-specific theming.
- [wb-theme-listener.js](../styles/wb-theme-listener.js): Updates variables dynamically in response to events.
