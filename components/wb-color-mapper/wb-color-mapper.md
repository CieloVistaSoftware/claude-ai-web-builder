# WB Color Mapper

## Overview

`<wb-color-mapper>` is a utility web component that maps existing site color variables (including Elementor globals) to the WB theme system. It acts as a bridge between legacy color systems and the modern Harmonic Color System (HCS).

## Purpose

- **Legacy Integration**: Maps old color variables to new WB theme variables
- **Elementor Support**: Automatically handles Elementor global color variables
- **Theme Synchronization**: Keeps site colors synchronized with WB theme changes
- **Zero Visibility**: Hidden controller component (no visual footprint)

## Features

✅ **Automatic theme detection** - Reads `data-theme` attribute from HTML/body  
✅ **Real-time updates** - Uses MutationObserver to track theme changes  
✅ **Elementor compatible** - Maps all Elementor global color variables  
✅ **Multiple themes** - Supports light, dark, cyberpunk, ocean, sunset, and forest  
✅ **Debug utilities** - Built-in methods for diagnosing color issues  
✅ **Fallback values** - Provides defaults when WB variables unavailable  

## Installation

### HTML
```html
<wb-color-mapper theme="dark"></wb-color-mapper>
```

### JavaScript
```javascript
const mapper = document.createElement('wb-color-mapper');
mapper.setAttribute('theme', 'cyberpunk');
document.body.appendChild(mapper);
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | string | `'light'` | Current theme: light, dark, cyberpunk, ocean, sunset, forest |
| `auto-init` | boolean | `true` | Automatically initialize on connection |

## Events

### Dispatched Events

| Event Name | Detail | Description |
|------------|--------|-------------|
| `wb-color-mapper-ready` | `{ component }` | Fired when initialization complete |
| `wb-color-mapper-stored` | `{ valuesCount, originalValues }` | Fired after storing original values |
| `wb-color-mapper-applied` | `{ theme }` | Fired after theme colors applied |

### Listened Events

| Event Name | Source | Action |
|------------|--------|--------|
| `wb-theme-changed` | WB Control Panel | Re-applies theme colors |
| `wb:theme-changed` | WB Theme Manager | Re-applies theme colors |

## Mapped Variables

### Standard Color Variables

```css
/* Backgrounds */
--page-bg
--content-bg
--body-bg
--section-bg
--card-bg
--container-bg
--surface

/* Text Colors */
--text-color
--heading-color
--text
--text-light
--text-muted
--subtitle-color

/* UI Colors */
--link-color
--link-hover
--button-color
--button-hover
--primary-color
--secondary-color
--accent-color

/* Borders */
--border-color
--divider-color
--border

/* Shadows */
--shadow-color
--shadow
```

### Elementor Global Variables

```css
--e-global-color-primary
--e-global-color-secondary
--e-global-color-text
--e-global-color-accent
--e-global-color-aed9d57
--e-global-color-d38321b
--e-global-color-d34c2b5
--e-global-color-6216c8c
--e-global-color-9e89a0d
--e-global-color-d9d0ad5
--e-global-color-5354007
--e-global-color-8b76756
--e-global-color-f56f1d5
```

## Theme Mappings

Each theme maps legacy variables to WB HCS variables:

### Light Theme Example
```css
--page-bg → var(--bg-primary, #f8fafc)
--text-color → var(--text-primary, #1e293b)
--primary-color → var(--primary, #6366f1)
```

### Dark Theme Example
```css
--page-bg → var(--bg-primary, #0f172a)
--text-color → var(--text-primary, #f1f5f9)
--primary-color → var(--primary, #6366f1)
```

### Cyberpunk Theme Example
```css
--page-bg → var(--bg-primary, #0a0a0a)
--text-color → var(--text-primary, #00ffff)
--primary-color → var(--primary, #ff00ff)
```

## Usage Examples

### Basic Setup
```html
<!DOCTYPE html>
<html data-theme="dark">
<head>
    <link rel="stylesheet" href="../../styles/main.css">
</head>
<body>
    <!-- Color mapper will automatically detect theme -->
    <wb-color-mapper></wb-color-mapper>
    
    <!-- Your content here -->
    <div class="content">
        <h1>This text will use mapped colors</h1>
    </div>
</body>
</html>
```

### Manual Theme Change
```javascript
const mapper = document.querySelector('wb-color-mapper');

// Change theme programmatically
mapper.setAttribute('theme', 'cyberpunk');

// Or change on the HTML element
document.documentElement.setAttribute('data-theme', 'ocean');
// Mapper will automatically detect and apply changes
```

### With Control Panel
```html
<!-- Control panel changes theme -->
<wb-control-panel></wb-control-panel>

<!-- Color mapper listens for changes -->
<wb-color-mapper></wb-color-mapper>
```

### Event Handling
```javascript
const mapper = document.querySelector('wb-color-mapper');

// Listen for when colors are applied
mapper.addEventListener('wb-color-mapper-applied', (e) => {
    console.log('Theme applied:', e.detail.theme);
});

// Listen for initialization
mapper.addEventListener('wb-color-mapper-ready', (e) => {
    console.log('Color mapper ready!');
    
    // Debug color variables
    e.detail.component.debugColorVariables();
});
```

## API Methods

### Public Methods

#### `debugColorVariables()`
Logs all detected color CSS variables to console.

```javascript
const mapper = document.querySelector('wb-color-mapper');
const colorVars = mapper.debugColorVariables();
// Returns: Array of { prop, value } objects
```

#### `debugCurrentThemeMappings()`
Logs the current theme's variable mappings.

```javascript
const mapper = document.querySelector('wb-color-mapper');
const mappings = mapper.debugCurrentThemeMappings();
// Returns: Object with all theme mappings
```

#### `diagnoseColorIssues()`
Identifies elements with inline color styles that might override theme colors.

```javascript
const mapper = document.querySelector('wb-color-mapper');
const diagnosis = mapper.diagnoseColorIssues();
// Returns: { summary, problematicElements[] }
```

#### `forceThemeUpdate()`
Forces a re-application of the current theme's colors.

```javascript
const mapper = document.querySelector('wb-color-mapper');
mapper.forceThemeUpdate();
```

## Integration with Elementor

The component automatically detects and handles Elementor elements:

```html
<!-- Elementor widgets will automatically get themed -->
<div class="elementor">
    <div class="elementor-heading-title">
        This heading uses mapped Elementor colors
    </div>
    <div class="elementor-text-editor">
        <p>This text uses mapped colors too</p>
    </div>
</div>
```

## Technical Details

### How It Works

1. **Initialization**: Component attaches to DOM and hides itself
2. **Detection**: Reads current theme from `data-theme` attribute
3. **Mapping**: Looks up theme in mapping configuration
4. **Application**: Injects CSS custom properties into `:root`
5. **Observation**: Watches for theme attribute changes via MutationObserver
6. **Updates**: Re-applies colors when theme changes detected

### CSS Injection Strategy

The component uses two strategies:

1. **Dynamic Stylesheet**: Injects `<style id="wb-color-mapper">` with theme-specific rules
2. **Direct Variables**: Sets CSS custom properties directly on elements using `.style.setProperty()`

### Performance Considerations

- **Lightweight**: Hidden component with zero visual footprint
- **Efficient**: Only re-applies colors when theme actually changes
- **Cached**: Stores original values to prevent unnecessary DOM reads
- **Optimized**: Uses MutationObserver instead of polling

## Troubleshooting

### Colors Not Updating

**Problem**: Theme changes but colors don't update  
**Solution**: Check if `data-theme` attribute is on `<html>` or `<body>`

```javascript
// Verify theme attribute
console.log(document.documentElement.getAttribute('data-theme'));

// Force update
document.querySelector('wb-color-mapper').forceThemeUpdate();
```

### Elementor Colors Not Working

**Problem**: Elementor widgets show wrong colors  
**Solution**: Use debug method to verify Elementor variables

```javascript
const mapper = document.querySelector('wb-color-mapper');
mapper.debugColorVariables();
// Look for --e-global-color-* variables
```

### Inline Styles Override Theme

**Problem**: Some elements have inline styles that override theme  
**Solution**: Use diagnosis method to find problematic elements

```javascript
const mapper = document.querySelector('wb-color-mapper');
const issues = mapper.diagnoseColorIssues();
console.log(issues.problematicElements);
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires support for:
- Custom Elements v1
- CSS Custom Properties
- MutationObserver
- ES6 Classes

## Dependencies

- **WB Theme System**: Requires `main.css` with HCS variables
- **None**: No external JavaScript dependencies

## Related Components

- **[wb-control-panel](../wb-control-panel/wb-control-panel.md)**: Theme control UI
- **[wb-theme](../wb-theme/wb-theme.md)**: Core theme management
- **[wb-color-harmony](../wb-color-harmony/wb-color-harmony.md)**: Color harmony calculations

## Version History

- **v1.0.0** (Current): Initial release with 6 themes and Elementor support

## License

Part of the WB Design System.

---

**Need help?** Check the [claude.md](./claude.md) file for AI assistant context.
