# WB Select

## Overview

`<wb-select>` is a powerful dropdown select component with search, multi-select, option grouping, and keyboard navigation. It provides an enhanced alternative to native `<select>` elements with modern UX features.

## Purpose

- **Enhanced Selects**: Better UX than native select elements
- **Search Functionality**: Built-in search/filter for long option lists
- **Multi-Select**: Select multiple options with tags
- **Grouping**: Organize options into labeled groups
- **Accessibility**: Full keyboard navigation and ARIA support

## Features

✅ **Single & multi-select** - Choose one or many options  
✅ **Searchable** - Filter options by typing  
✅ **Option groups** - Organize with `<optgroup>`  
✅ **Keyboard navigation** - Arrow keys, Enter, Escape  
✅ **Clearable** - Clear selection with X button  
✅ **Size variants** - Small, standard, large  
✅ **Tags for multi-select** - Visual tags with remove buttons  
✅ **Events** - Change, open, close, search events  

## Installation

### HTML
```html
<wb-select placeholder="Choose an option...">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
</wb-select>
```

### With Search
```html
<wb-select searchable placeholder="Search options...">
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="cherry">Cherry</option>
</wb-select>
```

### Multi-Select
```html
<wb-select multiple placeholder="Select multiple...">
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
</wb-select>
```

### With Groups
```html
<wb-select placeholder="Select from groups...">
    <optgroup label="Fruits">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
    </optgroup>
    <optgroup label="Vegetables">
        <option value="carrot">Carrot</option>
        <option value="broccoli">Broccoli</option>
    </optgroup>
</wb-select>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | string | `'Select option...'` | Placeholder text |
| `multiple` | boolean | `false` | Enable multi-select |
| `searchable` | boolean | `false` | Enable search/filter |
| `clearable` | boolean | `false` | Show clear button |
| `disabled` | boolean | `false` | Disable the select |
| `size` | string | `'standard'` | Size: small, standard, large |
| `value` | string | - | Currently selected value(s) |
| `name` | string | - | Form field name |

## Events

| Event Name | Detail | Description |
|------------|--------|-------------|
| `wb-select:ready` | `{ component, config }` | Component initialized |
| `wb-select:change` | `{ value, selectedOptions }` | Selection changed |
| `wb-select:open` | `{ component }` | Dropdown opened |
| `wb-select:close` | `{ component }` | Dropdown closed |
| `wb-select:search` | `{ term, results }` | Search performed |

## Usage Examples

### Basic Select
```html
<wb-select name="country">
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
</wb-select>
```

### Searchable Select
```html
<wb-select searchable placeholder="Search countries...">
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
    <!-- 100+ more options -->
</wb-select>
```

### Multi-Select with Tags
```html
<wb-select multiple clearable placeholder="Select skills...">
    <option value="js">JavaScript</option>
    <option value="py">Python</option>
    <option value="java">Java</option>
    <option value="cpp">C++</option>
</wb-select>
```

### Different Sizes
```html
<!-- Small -->
<wb-select size="small"></wb-select>

<!-- Standard (default) -->
<wb-select></wb-select>

<!-- Large -->
<wb-select size="large"></wb-select>
```

## API Methods

### `getValue()`
Returns current selection (string or array for multiple).

```javascript
const select = document.querySelector('wb-select');
const value = select.getValue();
```

### `setValue(value)`
Sets the selection programmatically.

```javascript
select.setValue('option2');
// For multiple
select.setValue(['option1', 'option2']);
```

### `open()`
Opens the dropdown.

```javascript
select.open();
```

### `close()`
Closes the dropdown.

```javascript
select.close();
```

### `clear()`
Clears current selection.

```javascript
select.clear();
```

### `addOption(value, text, group)`
Adds an option dynamically.

```javascript
select.addOption('new-val', 'New Option', 'Group 1');
```

### `removeOption(value)`
Removes an option.

```javascript
select.removeOption('option1');
```

## Keyboard Navigation

- **Space/Enter**: Open dropdown
- **↑/↓ Arrow**: Navigate options
- **Enter**: Select highlighted option
- **Escape**: Close dropdown
- **Type**: Search (when searchable)
- **Backspace**: Remove last tag (multi-select)

## Form Integration

```html
<form id="myForm">
    <wb-select name="country" required>
        <option value="">Select country...</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
    </wb-select>
    
    <wb-select name="interests" multiple>
        <option value="sports">Sports</option>
        <option value="music">Music</option>
        <option value="art">Art</option>
    </wb-select>
    
    <button type="submit">Submit</button>
</form>

<script>
document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
});
</script>
```

## Styling

### CSS Classes
```css
.wb-select                    /* Base */
.wb-select-trigger           /* Click area */
.wb-select-dropdown          /* Options dropdown */
.wb-select-option            /* Individual option */
.wb-select-tag               /* Multi-select tag */
.wb-select--open             /* Open state */
.wb-select--disabled         /* Disabled state */
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Dependencies

- **component-utils.js** (optional)
- **wb-select.css**: Required styles

## Related Components

- **[wb-input](../wb-input/wb-input.md)**: Text inputs
- **[wb-search](../wb-search/wb-search.md)**: Search inputs
- **[wb-toggle](../wb-toggle/wb-toggle.md)**: Toggle switches

## Version History

- **v2.0.0** (Current): Web Component with search & multi-select

---

**Need help?** Check [claude.md](./claude.md) for details.
