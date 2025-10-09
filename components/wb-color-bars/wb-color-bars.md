# Color Bars Web Component

A comprehensive HSL color picker component that provides intuitive control over hue, saturation, and lightness with three separate interactive bars.

## Overview

The Color Bars component offers a complete color selection experience with:
- **Hue Bar**: Full spectrum color selection (0-360°)
- **Saturation Bar**: Intensity control (0-100%)
- **Lightness Bar**: Brightness control (0-100%)
- **Real-time Preview**: Live color preview with hex/RGB/HSL values
- **Copy to Clipboard**: Click to copy hex values

## Features

### 🎨 **Complete HSL Control**
- Three separate bars for hue, saturation, and lightness
- Visual gradient bars that update dynamically
- Precise numeric value display

### 📱 **Universal Input Support**
- **Mouse**: Click and drag for smooth color selection
- **Touch**: Full mobile device compatibility
- **Keyboard**: Arrow keys for precise adjustments (Shift for 10° steps)

### ♿ **Accessibility First**
- ARIA labels and screen reader support
- Keyboard navigation with logical tab order
- High contrast focus indicators
- Reduced motion support

### 🎯 **Developer Friendly**
- Rich event system with detailed color data
- Programmatic API for external control
- Zero dependencies and lightweight
- Custom CSS properties for theming

## Installation

Simply include the component script in your HTML:

```html
<script src="color-bars.js"></script>
```

## Basic Usage

```html
<!-- Simple color picker -->
<color-bars></color-bars>

<!-- With initial values -->
<color-bars hue="120" saturation="80" lightness="60"></color-bars>

<!-- With custom label -->
<color-bars label="Primary Color" hue="240"></color-bars>

<!-- Dark theme -->
<color-bars theme="dark" hue="300"></color-bars>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `hue` | Number | 240 | Initial hue value (0-360 degrees) |
| `saturation` | Number | 70 | Initial saturation percentage (0-100%) |
| `lightness` | Number | 50 | Initial lightness percentage (0-100%) |
| `label` | String | "Color" | Label text displayed above the picker |
| `theme` | String | "light" | Theme variant ("light" or "dark") |
| `disabled` | Boolean | false | Disables the color picker |

## Events

The component fires detailed events with complete color information:

### `colorchange`
Fired continuously while the user is selecting a color (real-time updates during dragging).

### `colorselect` 
Fired when the user finishes selecting a color (mouse up, touch end, keyboard selection).

### `colorcopied`
Fired when a hex value is copied to clipboard.

**Event Detail Structure:**
```javascript
{
  hue: 240,           // 0-360
  saturation: 70,     // 0-100
  lightness: 50,      // 0-100
  hsl: "hsl(240, 70%, 50%)",
  hex: "#6366f1",
  rgb: { r: 99, g: 102, b: 241 }
}
```

## JavaScript API

### Properties

```javascript
const colorPicker = document.querySelector('color-bars');

// Get/set individual values
colorPicker.hue = 180;           // Set hue (0-360)
colorPicker.saturation = 85;     // Set saturation (0-100)
colorPicker.lightness = 45;      // Set lightness (0-100)

// Get current color data
const colorData = colorPicker.color;
console.log(colorData.hex);      // "#3fd6db"
```

### Methods

```javascript
// Set all color values at once
colorPicker.setColor(120, 75, 55);

// Set color with optional parameters
colorPicker.setColor(240);                    // Only hue
colorPicker.setColor(240, 80);                // Hue and saturation
colorPicker.setColor(240, 80, 60);            // All values
```

## Event Handling

```javascript
const colorPicker = document.querySelector('color-bars');

// Real-time color changes
colorPicker.addEventListener('colorchange', (e) => {
    const { hue, saturation, lightness, hex, hsl, rgb } = e.detail;
    
    // Update UI elements
    document.documentElement.style.setProperty('--primary-color', hex);
    console.log(`Color: ${hsl}`);
});

// Final color selection
colorPicker.addEventListener('colorselect', (e) => {
    console.log('Final color selected:', e.detail.hex);
    // Save to preferences, update database, etc.
});

// Clipboard copy events
colorPicker.addEventListener('colorcopied', (e) => {
    console.log(`Copied ${e.detail.hex} to clipboard`);
});
```

## Keyboard Controls

When a color bar is focused (click to focus first):

### Hue Bar
- **← / ↓**: Decrease hue by 1° (10° with Shift)
- **→ / ↑**: Increase hue by 1° (10° with Shift)
- **Home**: Jump to red (0°)
- **End**: Jump to red (360°)

### Saturation/Lightness Bars
- **← / ↓**: Decrease by 1% (10% with Shift)
- **→ / ↑**: Increase by 1% (10% with Shift)
- **Home**: Jump to 0%
- **End**: Jump to 100%

## Theming

The component uses CSS custom properties for easy customization:

```css
color-bars {
    --bar-height: 24px;
    --pointer-size: 18px;
    --border-radius: 12px;
    --transition-speed: 0.2s;
    --text-primary: #333;
    --text-secondary: #666;
    --pointer-border: #333;
    --focus-color: #007bff;
    --preview-size: 40px;
}

/* Dark theme overrides */
color-bars[theme="dark"] {
    --text-primary: #e6e1e5;
    --text-secondary: #cac4d0;
    --pointer-border: #e6e1e5;
    --focus-color: #d0bcff;
}
```

## Integration Examples

### Theme System Integration

```javascript
// Apply selected color to CSS custom properties
colorPicker.addEventListener('colorchange', (e) => {
    const root = document.documentElement;
    
    // Update primary color
    root.style.setProperty('--primary-color', e.detail.hex);
    root.style.setProperty('--primary-hsl', e.detail.hsl);
    
    // Generate complementary colors
    const complementary = generateComplementaryColor(e.detail.hue);
    root.style.setProperty('--secondary-color', complementary);
});
```

### Form Integration

```html
<form>
    <label for="brand-color">Brand Color:</label>
    <color-bars id="brand-color" hue="210" saturation="75"></color-bars>
    <input type="hidden" id="color-value" name="brand_color">
</form>

<script>
document.getElementById('brand-color').addEventListener('colorselect', (e) => {
    document.getElementById('color-value').value = e.detail.hex;
});
</script>
```

### Live Preview Integration

```javascript
// Update multiple elements with selected color
colorPicker.addEventListener('colorchange', (e) => {
    const { hex, hsl, rgb } = e.detail;
    
    // Update backgrounds
    document.querySelectorAll('.color-preview').forEach(el => {
        el.style.backgroundColor = hex;
    });
    
    // Update text colors
    document.querySelectorAll('.primary-text').forEach(el => {
        el.style.color = hex;
    });
    
    // Update borders
    document.querySelectorAll('.primary-border').forEach(el => {
        el.style.borderColor = hex;
    });
});
```

## Advanced Usage

### Multiple Color Pickers

```html
<div class="color-scheme-editor">
    <color-bars id="primary" label="Primary Color" hue="240"></color-bars>
    <color-bars id="secondary" label="Secondary Color" hue="120"></color-bars>
    <color-bars id="accent" label="Accent Color" hue="30"></color-bars>
</div>

<script>
const colorScheme = {
    primary: '#6366f1',
    secondary: '#10b981', 
    accent: '#f59e0b'
};

// Sync all color pickers
['primary', 'secondary', 'accent'].forEach(id => {
    document.getElementById(id).addEventListener('colorselect', (e) => {
        colorScheme[id] = e.detail.hex;
        updateColorScheme(colorScheme);
    });
});
</script>
```

### Color Palette Generation

```javascript
function generatePalette(baseColor) {
    const { hue, saturation, lightness } = baseColor;
    
    return {
        primary: baseColor.hex,
        light: `hsl(${hue}, ${saturation}, ${Math.min(100, lightness + 20)})`,
        dark: `hsl(${hue}, ${saturation}, ${Math.max(0, lightness - 20)})`,
        muted: `hsl(${hue}, ${Math.max(0, saturation - 30)}, ${lightness})`,
        complementary: `hsl(${(hue + 180) % 360}, ${saturation}, ${lightness})`
    };
}

colorPicker.addEventListener('colorchange', (e) => {
    const palette = generatePalette(e.detail);
    applyPalette(palette);
});
```

## Browser Support

- **Chrome**: 54+
- **Firefox**: 63+
- **Safari**: 10.1+
- **Edge**: 79+

For older browsers, include the Web Components polyfill.

## Performance Considerations

- **Lightweight**: ~15KB minified
- **Zero Dependencies**: No external libraries required
- **Efficient Rendering**: Minimal DOM updates during interaction
- **Memory Friendly**: Proper event cleanup and garbage collection

## File Structure

```
color-bars/
├── color-bars.js           # Main component implementation
├── color-bars-demo.html    # Interactive demo and examples
├── color-bars.json         # Component configuration and API
└── color-bars.md           # Documentation (this file)
```

## Contributing

When modifying the component:

1. Test all interaction methods (mouse, touch, keyboard)
2. Verify accessibility with screen readers
3. Test in multiple browsers and devices
4. Update documentation as needed
5. Test integration with existing projects

## License

This component is part of the Website Builder project and follows the same license terms.