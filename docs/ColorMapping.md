# Color Variable Mapping System

## Overview

The Website Builder (WB) now includes a powerful color mapping system that bridges legacy color variables with our new theme system. This allows the color bar and preset colors in the controller to work correctly with any website, regardless of how their CSS variables were originally defined.

## How It Works

When a user selects a color theme using the controller's color bar or dark mode toggle:

1. The controller sets the `data-theme` attribute on both `<html>` and `<body>` elements
2. The color-mapper.js script detects this change and:
   - Maps legacy color variable names to our new theme system
   - Applies these mappings as CSS custom properties
   - Directly applies color values to ensure compatibility

## Variable Mapping

The color mapping system handles numerous legacy variable names that may be present in converted websites:

### Common Legacy Variables

| Legacy Variable   | Maps To                                          | Description             |
| ----------------- | ------------------------------------------------ | ----------------------- |
| `--page-bg`       | `--bg-primary`                                   | Main background color   |
| `--text-color`    | `--text-primary`                                 | Main text color         |
| `--heading-color` | `--text-primary`                                 | Headers color           |
| `--link-color`    | `--primary`                                      | Link color              |
| `--border-color`  | `--neutral-200` (light) / `--neutral-700` (dark) | Border color            |
| `--accent-color`  | `--accent`                                       | Accent color            |
| `--card-bg`       | `--bg-secondary`                                 | Card/element background |

Plus many other variants to ensure wide compatibility.

## Theme Support

The color mapper supports all themes included in the controller:

- Light (default)
- Dark
- Cyberpunk
- Ocean
- Sunset
- Forest

Each theme has comprehensive mappings for all common CSS variable names.

## Implementation

The color mapping occurs in two complementary ways:

1. **CSS Rule Injection**: Creates CSS rules that map legacy variables to the theme system
2. **Direct CSS Variable Application**: Sets variables directly on HTML and body elements

This dual approach ensures maximum compatibility with different ways that websites might be accessing CSS variables.

## Debugging

For troubleshooting, a global debugging function is available:

```javascript
// Run in console to see all detected color variables
window.debugWbColorVariables();
```

## Adding Support for New Variables

To add support for additional legacy color variables:

1. Identify the legacy variable name
2. Add it to the mappings object in `color-mapper.js` for each theme
3. Run the debug function to verify it's being mapped correctly

## Files

- `components/color-mapper/color-mapper.js`: Main mapping implementation
- `components/wb-controller/wb-controller.js`: Controller that triggers theme changes
- `conversion/conversion-engine.js`: Injects mapper during conversion
- `conversion/file-watcher.js`: Ensures mapper script is included in converted files
