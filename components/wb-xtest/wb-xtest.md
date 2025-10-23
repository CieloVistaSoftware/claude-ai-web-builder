# WB xtest

## Overview

Brief description of what this component does and why it's useful.

## Usage

```html
<wb-xtest variant="primary" value="example">
    Content goes here
</wb-xtest>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | string | `'primary'` | Visual variant of the component |
| `value` | string | `''` | The component's value |

## Variants

- **primary** - Main variant with primary colors
- **secondary** - Alternative variant with secondary colors

## Events

### wb-xtest:ready
Fired when the component is fully initialized and ready to use.

```javascript
document.addEventListener('wb-xtest:ready', (e) => {
    console.log('Component ready:', e.detail);
});
```

**Detail Object:**
- `component` - Reference to the component instance
- `variant` - Current variant
- `value` - Current value

### wb-xtest:change
Fired when the component's state changes.

```javascript
document.addEventListener('wb-xtest:change', (e) => {
    console.log('State changed:', e.detail);
});
```

## Methods

### `.render()`
Re-renders the component with current state.

```javascript
const component = document.querySelector('wb-xtest');
component.render();
```

## Properties

### `.variant`
Get or set the variant.

```javascript
const component = document.querySelector('wb-xtest');
component.variant = 'secondary';
console.log(component.variant); // 'secondary'
```

### `.value`
Get or set the value.

```javascript
const component = document.querySelector('wb-xtest');
component.value = 'new value';
console.log(component.value); // 'new value'
```

## Styling

The component uses CSS custom properties for theming:

```css
:root {
    --wb-component-padding: 1rem;
    --wb-component-border-radius: 8px;
    --wb-component-transition: all 0.2s ease;
}
```

### Dark Mode

The component automatically responds to dark mode via `data-mode` attributes:

```html
<body data-mode="dark">
    <wb-xtest>...</wb-xtest>
</body>
```

## Examples

### Basic Example
```html
<wb-xtest variant="primary">
    Click me!
</wb-xtest>
```

### With Value
```html
<wb-xtest variant="secondary" value="example">
    Component content
</wb-xtest>
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- All modern browsers with Custom Elements v1 support

## Dependencies

- `WBBaseComponent` - Base component class
- WB Design System CSS variables

## Version History

### 1.0.0
- Initial release
- Basic variants (primary, secondary)
- Event system
- Dark mode support
