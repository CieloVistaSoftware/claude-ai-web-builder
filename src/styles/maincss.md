# main.css

## Purpose
This is the main CSS entry point for the Website Builder system. It imports foundational styles, variables, utilities, and layout rules, and provides the base for all component and page styling.

## Relationships
- Imports `_variables.css` for all design tokens and color variables.
- Imports `_base.css`, `_utilities.css`, and `layouts.css` for resets, utilities, and layout rules.
- Used by all HTML files and components as the primary stylesheet.
- Works with `wb-theme-listener.js` to enable dynamic, reactive theming.

## Reactive System
All color and theme changes are managed via CSS variables. When a variable changes (either in `_variables.css` or via a theme event), all styles using those variables update automatically.

## Related Files
- [_variables.css](_variables.css): Source of all variables.
- [layouts.css](layouts.css): Layout-specific rules using variables.
- [wb-theme-listener.js](../styles/wb-theme-listener.js): Listens for events and updates variables.
