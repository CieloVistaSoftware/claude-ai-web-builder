# Color Bar Web Component

A reusable, accessible color picker component extracted from the Material Design Color Picker. This component provides an interactive color slider with full support for mouse, touch, and keyboard interactions.

## Features

- 🎨 **Interactive Color Selection**: Click, drag, or use keyboard to select colors
- 📱 **Touch Support**: Full mobile device compatibility
- ♿ **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- 🎨 **Material Design**: Follows Material Design 3 principles
- 🌙 **Theme Support**: Light and dark theme compatibility
- 🎯 **Custom Events**: Fires events for color changes and selections
- 🛠 **Programmatic API**: Full JavaScript API for color control
- 📋 **Copy to Clipboard**: Click color preview to copy hex value
- 🎛 **Customizable**: Attributes for initial values and styling

## Installation

Simply include the component script in your HTML:

```html
<script src="color-bar.js"></script>
```

## Basic Usage

```html
<!-- Simple color bar -->
<color-bar></color-bar>

<!-- With custom initial values -->
<color-bar hue="120" saturation="80" lightness="60"></color-bar>

<!-- With custom label -->
<color-bar hue="240">
    <span slot="label">Primary Color</span>
</color-bar>

<!-- Disabled state -->
<color-bar disabled hue="180"></color-bar>

<!-- Dark theme -->
<color-bar theme="dark" hue="300"></color-bar>

<!-- Minimal theme (no Material Design styling) -->
<color-bar theme="minimal" hue="180"></color-bar>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `hue` | Number | 240 | Initial hue value (0-360) |
| `saturation` | Number | 70 | Initial saturation percentage (0-100) |
| `lightness` | Number | 50 | Initial lightness percentage (0-100) |
| `disabled` | Boolean | false | Disables the color picker |
| `theme` | String | 'light' | Theme variant ('light', 'dark', or 'minimal') |

## Events

The component fires two custom events:

### `colorchange`
Fired continuously while the user is selecting a color (real-time updates).

### `colorselect`
Fired when the user finishes selecting a color (mouse up, touch end).

Both events include detailed color information in `event.detail`:

```javascript
colorBar.addEventListener('colorchange', (event) => {
    console.log(event.detail);
    // {
    //   hue: 240,
    //   saturation: 70,
    //   lightness: 50,
    //   hex: '#6366f1',
    //   hsl: 'hsl(240, 70%, 50%)',
    //   rgb: { r: 99, g: 102, b: 241 }
    // }
});
```

## JavaScript API

### Properties

```javascript
const colorBar = document.querySelector('color-bar');

// Get/set individual values
colorBar.hue = 180;           // Set hue (0-360)
colorBar.saturation = 85;     // Set saturation (0-100)
colorBar.lightness = 45;      // Set lightness (0-100)

// Get current color data
const colorData = colorBar.color;
console.log(colorData.hex);   // '#3fd6db'
```

### Methods

```javascript
// Set all color values at once
colorBar.setColor(120, 75, 55);

// Set color with optional parameters
colorBar.setColor(240);                    // Only hue
colorBar.setColor(240, 80);                // Hue and saturation
colorBar.setColor(240, 80, 60);            // All values
```

## Keyboard Controls

When the color bar is focused (click to focus first):

- **Arrow Keys**: Adjust hue by 1° (hold Shift for 10°)
  - **← / ↓**: Decrease hue
  - **→ / ↑**: Increase hue
- **Home**: Jump to red (hue 0°)
- **End**: Jump to red (hue 360°)

### Fine-Tuning Colors

For precise color adjustments:
1. Click on the color bar to focus it
2. Use left/right arrow keys for 1° increments
3. Hold Shift + arrows for 10° increments
4. Perfect for fine-tuning primary colors and brand colors

## Styling

The component uses CSS custom properties for theming:

```css
color-bar {
    --color-bar-height: 30px;
    --pointer-size: 24px;
    --border-radius: 15px;
    --transition-speed: 0.2s;
    --text-primary: #333;
    --text-secondary: #666;
    --pointer-border: #333;
    --focus-color: #007bff;
}

/* Dark theme overrides */
color-bar[theme="dark"] {
    --text-primary: #e6e1e5;
    --text-secondary: #cac4d0;
    --pointer-border: #e6e1e5;
    --focus-color: #d0bcff;
}
```

## Examples

### Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>Color Picker Example</title>
</head>
<body>
    <h1>Choose a Color</h1>
    <color-bar id="my-color-picker" hue="200"></color-bar>
    <div id="color-display"></div>
    
    <script src="color-bar.js"></script>
    <script>
        const colorPicker = document.getElementById('my-color-picker');
        const display = document.getElementById('color-display');
        
        colorPicker.addEventListener('colorchange', (e) => {
            display.style.backgroundColor = e.detail.hex;
            display.textContent = e.detail.hex;
        });
    </script>
</body>
</html>
```

### Theme Integration

```javascript
// Apply selected color to page theme
colorBar.addEventListener('colorchange', (e) => {
    document.documentElement.style.setProperty('--primary-color', e.detail.hex);
    
    // Generate complementary colors
    const secondary = generateSecondaryColor(e.detail.hue);
    document.documentElement.style.setProperty('--secondary-color', secondary);
});
```

### Form Integration

```html
<form>
    <label for="theme-color">Theme Color:</label>
    <color-bar id="theme-color" hue="210"></color-bar>
    <input type="hidden" id="color-value" name="color">
</form>

<script>
document.getElementById('theme-color').addEventListener('colorselect', (e) => {
    document.getElementById('color-value').value = e.detail.hex;
});
</script>
```

## Browser Support

- Modern browsers with Web Components support
- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

For older browsers, include the Web Components polyfill.

## Accessibility

The component includes comprehensive accessibility features:

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard control
- **Focus Management**: Clear focus indicators
- **High Contrast**: Supports high contrast mode
- **Reduced Motion**: Respects user motion preferences

## Development

### File Structure

```
color-bar/
├── color-bar.js           # Main component implementation
├── color-bar-demo.html    # Interactive demo and examples
├── color-bar.json         # Component configuration and API
└── color-bar.md           # Documentation (this file)
```

### Testing

Open `color-bar-demo.html` in a browser to test all features:
- Basic usage examples
- Programmatic control
- Event handling
- Accessibility features
- Theme support

### Contributing

When modifying the component:

1. Test all interaction methods (mouse, touch, keyboard)
2. Verify accessibility with screen readers
3. Test in multiple browsers
4. Update documentation as needed

## License

This component is part of the Website Builder project and follows the same license terms.