# WB Input

## Overview

`<wb-input>` is a comprehensive form input component with built-in validation, theming support, and consistent styling. It provides a standardized way to create accessible, validated form inputs across the WB Design System.

## Purpose

- **Standardized Inputs**: Consistent styling and behavior across all input types
- **Built-in Validation**: Client-side validation with customizable rules
- **Accessibility**: Proper labeling, ARIA attributes, and keyboard navigation
- **Theme Integration**: Automatically adapts to WB theme system
- **Multiple Types**: Supports text, email, password, search, URL, tel, and textarea

## Features

✅ **Multiple input types** - text, email, password, search, url, tel, textarea  
✅ **Validation system** - Required, min/max length, pattern matching, custom rules  
✅ **Visual states** - Error, success, warning, disabled, focused  
✅ **Character counter** - Automatic counter for max-length inputs  
✅ **Help text** - Optional helper text below input  
✅ **Size variants** - Small, medium (default), large  
✅ **Accessibility** - Proper label linking and ARIA attributes  
✅ **Event system** - Ready, change, validate, focus, blur events  

## Installation

### HTML
```html
<wb-input 
    type="text" 
    label="Full Name" 
    placeholder="Enter your name"
    required>
</wb-input>
```

### JavaScript
```javascript
const input = WBInput.create('email', {
    label: 'Email Address',
    placeholder: 'you@example.com',
    required: true,
    maxLength: 100
});
document.querySelector('form').appendChild(input);
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | `'text'` | Input type: text, email, password, search, url, tel, textarea |
| `label` | string | - | Label text displayed above input |
| `placeholder` | string | - | Placeholder text inside input |
| `value` | string | - | Initial/current value of input |
| `size` | string | `'medium'` | Size: small, medium, large |
| `disabled` | boolean | `false` | Disables the input |
| `readonly` | boolean | `false` | Makes input read-only |
| `required` | boolean | `false` | Makes input required for validation |
| `max-length` | number | - | Maximum character length (shows counter) |
| `min-length` | number | - | Minimum character length |
| `pattern` | string | - | Regex pattern for validation |
| `help` | string | - | Help text displayed below input |
| `validation-rules` | JSON | - | Custom validation rules object |

## Events

### Dispatched Events

| Event Name | Detail | Description |
|------------|--------|-------------|
| `wb-input:ready` | `{ component, config }` | Fired when component initialized |
| `wb-input:change` | `{ input, value, component }` | Fired when input value changes |
| `wb-input:validate` | `{ input, valid, message, component }` | Fired during validation |
| `wb-input:focus` | `{ input, component }` | Fired when input receives focus |
| `wb-input:blur` | `{ input, component }` | Fired when input loses focus |

### Event Listeners

```javascript
const input = document.querySelector('wb-input');

// Listen for value changes
input.addEventListener('wb-input:change', (e) => {
    console.log('New value:', e.detail.value);
});

// Listen for validation
input.addEventListener('wb-input:validate', (e) => {
    if (!e.detail.valid) {
        console.log('Validation failed:', e.detail.message);
    }
});
```

## Usage Examples

### Basic Text Input
```html
<wb-input 
    type="text" 
    label="Username" 
    placeholder="Enter username"
    required>
</wb-input>
```

### Email with Validation
```html
<wb-input 
    type="email" 
    label="Email Address" 
    placeholder="you@example.com"
    required
    validation-rules='{"type": "email", "required": true}'>
</wb-input>
```

### Password with Min Length
```html
<wb-input 
    type="password" 
    label="Password" 
    placeholder="Enter password"
    min-length="8"
    required
    help="Password must be at least 8 characters">
</wb-input>
```

### Textarea with Character Counter
```html
<wb-input 
    type="textarea" 
    label="Bio" 
    placeholder="Tell us about yourself"
    max-length="500"
    help="Maximum 500 characters">
</wb-input>
```

### Different Sizes
```html
<!-- Small -->
<wb-input type="text" label="Small Input" size="small"></wb-input>

<!-- Medium (default) -->
<wb-input type="text" label="Medium Input"></wb-input>

<!-- Large -->
<wb-input type="text" label="Large Input" size="large"></wb-input>
```

### With Help Text
```html
<wb-input 
    type="url" 
    label="Website" 
    placeholder="https://example.com"
    help="Please include http:// or https://">
</wb-input>
```

### Disabled/Readonly States
```html
<!-- Disabled -->
<wb-input 
    type="text" 
    label="Disabled Input" 
    value="Cannot edit"
    disabled>
</wb-input>

<!-- Readonly -->
<wb-input 
    type="text" 
    label="Readonly Input" 
    value="Can view only"
    readonly>
</wb-input>
```

## API Methods

### Instance Methods

#### `getValue()`
Returns the current value of the input.

```javascript
const input = document.querySelector('wb-input');
const value = input.getValue();
console.log(value);
```

#### `setValue(value)`
Sets the input value programmatically.

```javascript
const input = document.querySelector('wb-input');
input.setValue('New value');
```

#### `focus()`
Programmatically focuses the input.

```javascript
const input = document.querySelector('wb-input');
input.focus();
```

#### `blur()`
Programmatically removes focus from the input.

```javascript
const input = document.querySelector('wb-input');
input.blur();
```

#### `validate(rules)`
Validates the input against provided rules.

```javascript
const input = document.querySelector('wb-input');
const isValid = input.validate({
    required: true,
    type: 'email',
    minLength: 5,
    maxLength: 100
});

if (!isValid) {
    console.log('Validation failed');
}
```

#### `setError(message)`
Sets the input to error state with message.

```javascript
const input = document.querySelector('wb-input');
input.setError('This field is required');
```

#### `setSuccess(message)`
Sets the input to success state with optional message.

```javascript
const input = document.querySelector('wb-input');
input.setSuccess('Email verified!');
```

#### `clearError()`
Clears error/success states.

```javascript
const input = document.querySelector('wb-input');
input.clearError();
```

### Static Methods

#### `WBInput.create(type, options)`
Creates a new wb-input element programmatically.

```javascript
const input = WBInput.create('email', {
    label: 'Email',
    placeholder: 'Enter email',
    required: true,
    maxLength: 100,
    help: 'We will never share your email'
});
```

#### `WBInput.validate(element, rules)`
Validates an input element.

```javascript
const input = document.querySelector('wb-input');
const isValid = WBInput.validate(input, {
    required: true,
    type: 'email'
});
```

#### `WBInput.getValue(element)`
Gets value from an input element.

```javascript
const input = document.querySelector('wb-input');
const value = WBInput.getValue(input);
```

#### `WBInput.setValue(element, value)`
Sets value on an input element.

```javascript
const input = document.querySelector('wb-input');
WBInput.setValue(input, 'new@email.com');
```

## Validation System

### Validation Rules Object

```javascript
{
    required: true,           // Field must have value
    type: 'email',           // Built-in type validation
    minLength: 5,            // Minimum character length
    maxLength: 100,          // Maximum character length
    showSuccess: true        // Show success state when valid
}
```

### Built-in Validation Types

- **email**: Validates email format
- **url**: Validates URL format (requires http:// or https://)
- **number**: Validates numeric input

### Custom Validation Example

```javascript
const input = document.querySelector('wb-input');

input.addEventListener('wb-input:blur', () => {
    const value = input.getValue();
    
    // Custom validation logic
    if (value.includes('test')) {
        input.setError('Value cannot contain "test"');
    } else {
        input.setSuccess('Looks good!');
    }
});
```

## Visual States

The component supports multiple visual states:

### Error State
```javascript
input.setError('This field is required');
```

### Success State
```javascript
input.setSuccess('Email verified successfully');
```

### Focused State
Automatically applied when input has focus.

### Disabled State
```html
<wb-input type="text" disabled></wb-input>
```

## Styling & Theming

### CSS Classes

```css
.wb-input                    /* Base component */
.wb-input-wrapper           /* Container for label, input, messages */
.wb-input-label             /* Label element */
.wb-input-field             /* The actual input element */
.wb-input-message           /* Error/success message */
.wb-input-counter           /* Character counter */

/* Type variants */
.wb-input--text
.wb-input--email
.wb-input--password
.wb-input--textarea

/* Size variants */
.wb-input--small
.wb-input--large

/* State modifiers */
.wb-input--error
.wb-input--success
.wb-input--warning
.wb-input--disabled
.wb-input--focused
```

### Custom Styling

```css
/* Override input colors */
wb-input {
    --input-border-color: #e2e8f0;
    --input-focus-color: #6366f1;
    --input-error-color: #ef4444;
    --input-success-color: #10b981;
}

/* Custom input field styling */
.wb-input-field {
    font-size: 1rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
}
```

## Form Integration

### Complete Form Example

```html
<form id="contact-form">
    <wb-input 
        type="text" 
        label="Full Name" 
        required
        min-length="2">
    </wb-input>
    
    <wb-input 
        type="email" 
        label="Email" 
        required
        validation-rules='{"type": "email"}'>
    </wb-input>
    
    <wb-input 
        type="tel" 
        label="Phone" 
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        help="Format: 123-456-7890">
    </wb-input>
    
    <wb-input 
        type="textarea" 
        label="Message" 
        required
        max-length="500">
    </wb-input>
    
    <button type="submit">Submit</button>
</form>

<script>
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputs = e.target.querySelectorAll('wb-input');
    let allValid = true;
    
    inputs.forEach(input => {
        const rules = {
            required: input.hasAttribute('required')
        };
        
        if (!input.validate(rules)) {
            allValid = false;
        }
    });
    
    if (allValid) {
        console.log('Form is valid!');
        // Submit form data
    }
});
</script>
```

## Accessibility

### ARIA Attributes

The component automatically handles:
- `aria-label` from label attribute
- `aria-required` for required inputs
- `aria-invalid` for validation errors
- `aria-describedby` for help text and error messages

### Keyboard Navigation

- **Tab**: Move focus to/from input
- **Enter**: Submit form (on text inputs)
- **Escape**: Clear input (optional)

### Screen Reader Support

```html
<wb-input 
    type="email" 
    label="Email Address"
    help="We'll never share your email"
    required>
</wb-input>

<!-- Screen reader will announce: -->
<!-- "Email Address, required, edit text. We'll never share your email" -->
```

## Troubleshooting

### Input Not Validating

**Problem**: Validation rules not being applied  
**Solution**: Ensure validation-rules attribute is valid JSON

```html
<!-- ❌ Wrong -->
<wb-input validation-rules="{required: true}"></wb-input>

<!-- ✅ Correct -->
<wb-input validation-rules='{"required": true}'></wb-input>
```

### Character Counter Not Showing

**Problem**: Counter doesn't appear  
**Solution**: Must set max-length attribute

```html
<wb-input type="text" max-length="100"></wb-input>
```

### Styles Not Loading

**Problem**: Input appears unstyled  
**Solution**: Ensure wb-input.css is loaded

```html
<link rel="stylesheet" href="path/to/wb-input.css">
```

### Value Not Updating

**Problem**: getValue() returns old value  
**Solution**: Use setValue() method, not setAttribute

```javascript
// ❌ Wrong
input.setAttribute('value', 'new value');

// ✅ Correct
input.setValue('new value');
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires support for:
- Custom Elements v1
- Shadow DOM (optional)
- ES6 Classes
- CSS Custom Properties

## Dependencies

- **wb-component-utils.js** (optional): Enhanced utilities
- **wb-input.css**: Component styles
- **wb-event-log** (optional): Event logging

## Related Components

- **[wb-select](../wb-select/wb-select.md)**: Dropdown selection
- **[wb-toggle](../wb-toggle/wb-toggle.md)**: Toggle switches
- **[wb-button](../wb-button/wb-button.md)**: Form buttons
- **[wb-search](../wb-search/wb-search.md)**: Search inputs

## Version History

- **v2.0.0** (Current): Web Component rewrite with validation
- **v1.0.0**: Initial release

## License

Part of the WB Design System.

---

**Need help?** Check the [claude.md](./claude.md) file for AI assistant context.
