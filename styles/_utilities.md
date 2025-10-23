# _utilities.css

## Purpose
This file contains reusable utility classes and patterns for the Website Builder system. It provides helpers for layout, spacing, color, and display, making it easy to build consistent UIs.

## Relationships
- Imported by `main.css` after base styles, so it can use all variables and resets.
- Used by all components and pages for quick layout and design tweaks.
- Works with `_variables.css` and `_base.css` for a complete style system.

## Reactive System
Utility classes use CSS variables for colors, spacing, and more. Any change to variables in `_variables.css` updates utility styles reactively.

## Related Files
- [_variables.css](_variables.css): Source of all design tokens.
- [main.css](main.css): Imports this file and applies it globally.
- [_base.css](_base.css): Base styles and resets.
