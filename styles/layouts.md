# layouts.css

## Purpose
This file contains all layout-specific CSS rules for the Website Builder system. It defines grid, flex, and responsive layout patterns, using variables from `_variables.css` for colors and spacing.

## Relationships
- Imported by `main.css` after variables, base, and utility styles.
- Uses variables from `_variables.css` for consistent theming.
- Works with all components and pages to provide responsive layouts.


## Layout Diagrams

### Top Navigation Layout

```
┌─────────────────────────────┐
│         Top Nav Bar         │
├─────────────────────────────┤
│                             │
│         Main Content        │
│                             │
└─────────────────────────────┘
```

### Left Navigation Layout

```
┌────────────┬───────────────┐
│  Left Nav  │   Main Content│
│  Panel     │               │
└────────────┴───────────────┘
```

### Right Navigation Layout

```
┌───────────────┬────────────┐
│   Main Content│  Right Nav │
│               │  Panel     │
└───────────────┴────────────┘
```

## Related Files
- [_variables.css](_variables.css): Provides variables for layout theming.
- [main.css](main.css): Imports this file and applies it globally.
- [wb-theme-listener.js](../styles/wb-theme-listener.js): Can update variables used in layouts.
