# WB Slider Component

A customizable slider input component for the Website Builder system with full theming and accessibility support.

## Overview

The WB Slider component provides a flexible range input control that integrates seamlessly with the Website Builder color system and control panel. It supports multiple variants, sizes, and can display values in real-time.

## Features

### Core Features
- **Value Display**: Optional real-time value display
- **Custom Range**: Configurable min, max, and step values
- **Multiple Variants**: Primary, success, warning, and error colors
- **Size Options**: Small, standard, and large sizes
- **Smooth Animations**: CSS transitions for value changes
- **Dark Mode Support**: Automatic theme adaptation
- **Accessibility**: Full keyboard navigation and ARIA labels

### Visual Features
- Track fill that follows thumb position
- Customizable track and thumb colors
- Hover and focus states
- Disabled state styling
- Value tooltip option

## Installation

### Basic Usage

```html
<!-- Include component files -->
<link rel="stylesheet" href="wb-slider.css">
<script src="wb-slider.js"></script>

<!-- Use in HTML -->
<wb-slider id="volume" label="Volume" min="0" max="100" value="50"></wb-slider>
```

### JavaScript API

```javascript
// Create programmatically
const slider = WBSlider.create({
    label: 'Brightness',
    min: 0,
    max: 100,
    value: 75,
    showValue: true,
    variant: 'primary',
    onchange: (value) => {
        console.log('Brightness:', value);
    }
});

document.body.appendChild(slider);
```

## Configuration Options

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | '' | Label text for the slider |
| `min` | number | 0 | Minimum value |
| `max` | number | 100 | Maximum value |
| `step` | number | 1 | Step increment |
| `value` | number | 50 | Initial value |
| `show-value` | boolean | false | Show current value |
| `variant` | string | 'primary' | Color variant |
| `size` | string | 'standard' | Size option |
| `disabled` | boolean | false | Disabled state |

### Variants

- **primary**: Default blue color scheme
- **success**: Green for positive values
- **warning**: Orange for caution states
- **error**: Red for critical values

### Sizes

- **small**: Compact slider for tight spaces
- **standard**: Default size
- **large**: Larger touch targets

## API Methods

### `create(options)`
Creates a new slider instance.

```javascript
const slider = WBSlider.create({
    label: 'Opacity',
    min: 0,
    max: 1,
    step: 0.1,
    value: 0.8,
    showValue: true
});
```

### `getValue(slider)`
Get the current value.

```javascript
const value = WBSlider.getValue(slider);
console.log('Current value:', value);
```

### `setValue(slider, value)`
Set the slider value programmatically.

```javascript
WBSlider.setValue(slider, 75);
```

### `setDisabled(slider, disabled)`
Enable or disable the slider.

```javascript
WBSlider.setDisabled(slider, true); // Disable
WBSlider.setDisabled(slider, false); // Enable
```

### `setLabel(slider, label)`
Update the slider label.

```javascript
WBSlider.setLabel(slider, 'New Label');
```

## Events

### `wbSliderReady`
Fired when the component is initialized.

```javascript
document.addEventListener('wbSliderReady', () => {
    console.log('WB Slider component ready');
});
```

### `wbSliderChange`
Fired when the slider value changes.

```javascript
document.addEventListener('wbSliderChange', (event) => {
    const { id, value, element } = event.detail;
    console.log(`Slider ${id} changed to ${value}`);
});
```

## CSS Variables

The component uses CSS custom properties for theming:

```css
:root {
    /* Slider dimensions */
    --wb-slider-height: 0.5rem;
    --wb-slider-thumb-size: 1.25rem;
    
    /* Colors - automatically bound to control panel */
    --wb-slider-track-bg: var(--neutral-700);
    --wb-slider-fill-bg: var(--primary);
    --wb-slider-thumb-bg: white;
    
    /* Transitions */
    --wb-slider-transition: all 0.2s ease;
}
```

## Examples

### Basic Slider
```html
<wb-slider label="Basic Slider"></wb-slider>
```

### With Value Display
```html
<wb-slider label="Temperature" min="0" max="100" show-value="true"></wb-slider>
```

### Custom Range
```html
<wb-slider label="Rating" min="1" max="5" step="0.5" value="3.5"></wb-slider>
```

### Different Variants
```html
<wb-slider variant="primary" label="Primary"></wb-slider>
<wb-slider variant="success" label="Success"></wb-slider>
<wb-slider variant="warning" label="Warning"></wb-slider>
<wb-slider variant="error" label="Error"></wb-slider>
```

### Programmatic Control
```javascript
// Create slider
const volumeSlider = WBSlider.create({
    label: 'Master Volume',
    min: 0,
    max: 100,
    value: 80,
    showValue: true,
    onchange: (value) => {
        // Update volume
        audio.volume = value / 100;
    }
});

// Later, update value
WBSlider.setValue(volumeSlider, 50);

// Disable during loading
WBSlider.setDisabled(volumeSlider, true);
```

## Control Panel Integration

The slider automatically integrates with the Website Builder control panel:

1. **Color Binding**: Inherits primary colors from control panel
2. **Theme Support**: Adapts to dark/light theme changes
3. **CSS Variable Updates**: Responds to custom color selections
4. **Event Integration**: Can trigger control panel updates

## Accessibility

- Full keyboard navigation (Arrow keys, Home, End)
- ARIA attributes for screen readers
- Focus indicators
- Label association
- Value announcements

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Best Practices

1. **Always provide labels** for accessibility
2. **Use appropriate variants** to indicate state
3. **Show values** when precision matters
4. **Set meaningful min/max** ranges
5. **Consider step size** for user experience
6. **Test with keyboard** navigation

## Troubleshooting

### Slider not responding
- Check if JavaScript is loaded
- Verify slider is not disabled
- Check console for errors

### Styling issues
- Ensure CSS file is loaded
- Check for CSS conflicts
- Verify theme variables are set

### Value not updating
- Confirm event listeners are attached
- Check if value is within min/max range
- Verify step value is appropriate