# WB Toggle

## Overview

`<wb-toggle>` is a switch component for binary on/off states. Perfect for settings, preferences, and feature toggles with smooth animations and accessibility.

## Purpose

- **Binary States**: Toggle between on/off, enabled/disabled
- **Settings**: Control application preferences
- **Feature Flags**: Enable/disable features
- **Accessibility**: Full keyboard support

## Features

✅ **Smooth animations** - Sliding toggle effect  
✅ **Keyboard accessible** - Space/Enter to toggle  
✅ **Labels** - Optional text labels  
✅ **Sizes** - Small, medium, large  
✅ **Disabled state** - Prevent interaction  
✅ **Events** - Change event with state  
✅ **Custom styling** - CSS variables  

## Installation

```html
<wb-toggle checked>Enable notifications</wb-toggle>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `checked` | boolean | `false` | Toggle state (on/off) |
| `disabled` | boolean | `false` | Disable interaction |
| `size` | string | `'medium'` | Size: small, medium, large |
| `label` | string | - | Label text |
| `name` | string | - | Form field name |
| `value` | string | `'on'` | Value when checked |

## Events

| Event Name | Detail | Description |
|------------|--------|-------------|
| `wb-toggle:change` | `{ checked, value }` | Toggle state changed |
| `wb-toggle:ready` | `{ component }` | Component initialized |

## Usage Examples

### Basic Toggle
```html
<wb-toggle>Dark Mode</wb-toggle>
```

### Checked by Default
```html
<wb-toggle checked>Enable Feature</wb-toggle>
```

### Different Sizes
```html
<wb-toggle size="small">Small Toggle</wb-toggle>
<wb-toggle size="medium">Medium Toggle</wb-toggle>
<wb-toggle size="large">Large Toggle</wb-toggle>
```

### Disabled Toggle
```html
<wb-toggle disabled>Can't Toggle This</wb-toggle>
<wb-toggle checked disabled>Locked On</wb-toggle>
```

### Form Integration
```html
<form>
    <wb-toggle name="notifications" value="yes" checked>
        Email Notifications
    </wb-toggle>
    
    <wb-toggle name="marketing" value="yes">
        Marketing Emails
    </wb-toggle>
    
    <button type="submit">Save Settings</button>
</form>
```

### With Event Handler
```html
<wb-toggle id="darkMode">Dark Mode</wb-toggle>

<script>
document.getElementById('darkMode').addEventListener('wb-toggle:change', (e) => {
    console.log('Dark mode:', e.detail.checked ? 'ON' : 'OFF');
    
    if (e.detail.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});
</script>
```

## API Methods

### `toggle()`
Toggles the state.

```javascript
const toggle = document.querySelector('wb-toggle');
toggle.toggle();
```

### `check()`
Sets to checked state.

```javascript
toggle.check();
```

### `uncheck()`
Sets to unchecked state.

```javascript
toggle.uncheck();
```

### `isChecked()`
Returns current state.

```javascript
const isOn = toggle.isChecked();
```

### `setDisabled(disabled)`
Enable or disable toggle.

```javascript
toggle.setDisabled(true);  // Disable
toggle.setDisabled(false); // Enable
```

## Keyboard Navigation

- **Space/Enter**: Toggle state
- **Tab**: Focus toggle
- **Disabled**: Cannot be toggled

## Styling

### CSS Classes
```css
.wb-toggle                /* Base */
.wb-toggle__input         /* Hidden checkbox */
.wb-toggle__slider        /* Visual slider */
.wb-toggle__label         /* Label text */
.wb-toggle--checked       /* Checked state */
.wb-toggle--disabled      /* Disabled state */
.wb-toggle--small         /* Small size */
.wb-toggle--large         /* Large size */
```

### Custom Styling
```css
wb-toggle {
    --toggle-bg-off: #cbd5e1;
    --toggle-bg-on: #6366f1;
    --toggle-slider-bg: white;
    --toggle-border-radius: 9999px;
    --toggle-transition: 0.2s;
}
```

## Accessibility

- Uses native checkbox for screen readers
- Proper ARIA labels
- Keyboard accessible (Space/Enter)
- Focus indicators
- Disabled state handling

## Form Integration

Works seamlessly with HTML forms:

```html
<form id="settingsForm">
    <wb-toggle name="option1" value="yes">Option 1</wb-toggle>
    <wb-toggle name="option2" value="yes">Option 2</wb-toggle>
    <button type="submit">Submit</button>
</form>

<script>
document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
});
</script>
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Dependencies

- **wb-toggle.css**: Required styles
- **component-utils.js**: Optional utilities

## Related Components

- **[wb-input](../wb-input/wb-input.md)**: Text inputs
- **[wb-select](../wb-select/wb-select.md)**: Dropdown selects
- **[wb-button](../wb-button/wb-button.md)**: Buttons

## Version History

- **v2.0.0** (Current): Web Component with accessibility

---

**Need help?** Check [claude.md](./claude.md) for details.
