# _base.css

## Purpose
This file provides base styles and CSS resets for the Website Builder system. It ensures consistent typography, element rendering, and default spacing across all browsers and devices.

## Relationships
- Imported by `main.css` after variables, so it can use global design tokens.
- Used by all components and pages for foundational styling.
- Works with `_variables.css` and `_utilities.css` for a complete style system.

## Reactive System
Base styles use CSS variables for colors, spacing, and typography. Any change to variables in `_variables.css` updates base styles reactively.

## Related Files
- [_variables.css](_variables.css): Source of all design tokens.
- [main.css](main.css): Imports this file and applies it globally.
- [_utilities.css](_utilities.css): Utility classes for layout and design.
