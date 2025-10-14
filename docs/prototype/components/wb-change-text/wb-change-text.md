# WB Change Text Component

A Web Component for direct inline text editing that transforms any text element into an editable field using the contenteditable API.

## Overview

The WB Change Text component provides a seamless way to edit text content directly on the page without modal popups or form fields. When edit mode is enabled, users can simply click on any text element to start editing immediately.

## Features

- 🖱️ **Direct Inline Editing** - No modals or popups, edit text right where it appears
- ⌨️ **Keyboard Shortcuts** - Enter to save, Escape to cancel, Ctrl+S for quick save
- 🎯 **Smart Element Detection** - Automatically detects editable elements (headers, paragraphs, lists, etc.)
- 💾 **Auto-Save on Blur** - Changes save automatically when clicking outside
- 🎨 **Visual Feedback** - Clear visual indicators for hover and edit states
- 📋 **Format Stripping** - Paste operations automatically strip formatting
- 🔄 **State Management** - Tracks original content for cancel operations
- 🌐 **Event System** - Comprehensive wb:* events for integration
- 🧩 **Web Component** - Standards-compliant custom element

## Installation

```html
<!-- Include the Web Component -->
<script src="components/wb-change-text/wb-change-text.js"></script>

<!-- Add to your page -->
<wb-change-text></wb-change-text>
```

## Usage

### Basic Web Component Usage

```html
<!-- Simple usage -->
<wb-change-text></wb-change-text>

<!-- With edit mode enabled -->
<wb-change-text edit-mode></wb-change-text>

<!-- With custom target selectors -->
<wb-change-text target-selectors="h1,h2,p,span"></wb-change-text>
```

### Programmatic Control

```javascript
// Get the component
const changeText = document.querySelector('wb-change-text');

// Enable edit mode
changeText.enable();

// Disable edit mode
changeText.disable();

// Check if enabled
const isEnabled = changeText.isEnabled();

// Edit a specific element
const element = document.querySelector('h1');
changeText.edit(element);

// Save all active edits
changeText.saveAll();
```

### Global API (Backward Compatibility)

```javascript
// Create and use component automatically
WBChangeText.enable();
WBChangeText.disable();
WBChangeText.setEditMode(true);
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `edit-mode` | boolean | `false` | Enable edit mode automatically |
| `target-selectors` | string | (see config) | Comma-separated list of CSS selectors for editable elements |

## Supported Elements

The component automatically detects and makes the following elements editable:

- **Headers**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- **Content**: `p`, `div`, `span`, `article`, `section`, `aside`
- **Lists**: `li`
- **Tables**: `td`, `th`
- **Semantic**: `header`, `nav`, `main`, `footer`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Enter** | Save changes (without Shift) |
| **Shift+Enter** | New line within element |
| **Escape** | Cancel edit and restore original |
| **Ctrl/Cmd+S** | Save current edit |

## Events

### Component Events

```javascript
// Component ready
document.addEventListener('wb-change-text-ready', (e) => {
    console.log('Component initialized', e.detail);
});

// Edit started
document.addEventListener('wb:changeTextEdit', (e) => {
    console.log('Editing:', e.detail.element);
    console.log('Original content:', e.detail.content);
});

// Changes saved
document.addEventListener('wb:changeTextSave', (e) => {
    console.log('Saved:', e.detail.element);
    console.log('Old content:', e.detail.oldContent);
    console.log('New content:', e.detail.newContent);
});

// Edit cancelled
document.addEventListener('wb:changeTextCancel', (e) => {
    console.log('Cancelled:', e.detail.element);
});
```

### Integration Events

The component listens for control panel and edit mode events:

```javascript
// Edit mode control
document.dispatchEvent(new Event('wb:editModeOn'));
document.dispatchEvent(new Event('wb:editModeOff'));

// Standard edit mode events
document.dispatchEvent(new CustomEvent('editModeChanged', {
    detail: { enabled: true }
}));
```

## Styling

### CSS Classes

- `.wb-change-text-enabled` - Added to body when edit mode is active
- `.wb-change-text-editable` - Applied to hoverable elements
- `[contenteditable="true"]` - Active editing state

### Visual States

When edit mode is enabled:
- **Hover**: Dashed outline shows editable elements with tooltip
- **Editing**: Solid outline with background highlight and instructions
- **Focus**: Enhanced outline with shadow for active editing

### Customization

```css
/* Custom hover state */
.wb-change-text-enabled h1:hover {
    outline-color: var(--your-primary-color);
}

/* Custom editing state */
[contenteditable="true"] {
    background: rgba(var(--your-color), 0.1);
    outline-color: var(--your-primary-color);
}
```

## Web Component API

### Properties

```javascript
const changeText = document.querySelector('wb-change-text');

// Get/set edit mode
changeText.isEditModeEnabled;  // boolean (read-only)

// Get target selectors
changeText.targetSelectors;    // array (read-only)
```

### Methods

```javascript
// Mode control
changeText.enable()
changeText.disable()
changeText.setEditMode(enabled)
changeText.isEnabled()

// Element control
changeText.edit(element)
changeText.makeEditable(element)
changeText.makeNonEditable(element)
changeText.saveAll()
```

## Integration Examples

### With Control Panel

```html
<control-panel></control-panel>
<wb-change-text></wb-change-text>

<script>
    // Automatically responds to control panel edit mode changes
    document.addEventListener('editModeChanged', (e) => {
        // Component automatically handles this
    });
</script>
```

### Manual Integration

```html
<wb-change-text id="textEditor"></wb-change-text>
<button onclick="document.getElementById('textEditor').enable()">
    Enable Editing
</button>
<button onclick="document.getElementById('textEditor').disable()">
    Disable Editing
</button>
```

## Best Practices

1. **User Feedback** - Always provide clear visual feedback for editable states
2. **Save Handling** - Implement proper save event handlers for persistence
3. **Permissions** - Check user permissions before enabling edit mode
4. **Validation** - Add content validation in save event handlers
5. **Accessibility** - Ensure proper ARIA labels and keyboard navigation

## Schema Integration

The component supports IntelliSense via its schema file:

```json
// In .vscode/settings.json
{
  "html.customData": ["./components/wb-change-text/wb-change-text.schema.json"]
}
```

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- All modern browsers with Web Components v1 support

## Accessibility

- Maintains semantic HTML structure
- Preserves keyboard navigation
- Compatible with screen readers
- Clear visual focus indicators
- High contrast mode support
- Reduced motion support

## Example Implementation

```html
<!DOCTYPE html>
<html data-theme="dark">
<head>
    <title>WB Change Text Example</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <h1>Click to Edit This Title</h1>
    <p>This paragraph can also be edited inline.</p>
    
    <button onclick="WBChangeText.enable()">Enable Editing</button>
    <button onclick="WBChangeText.disable()">Disable Editing</button>
    
    <!-- Web Component -->
    <wb-change-text></wb-change-text>
    
    <script src="components/wb-change-text/wb-change-text.js"></script>
    <script>
        // Listen for saves
        document.addEventListener('wb:changeTextSave', (e) => {
            console.log('Content updated:', e.detail);
            // Send to server, update state, etc.
        });
    </script>
</body>
</html>
```

## Migration from Legacy Version

### From utils/change-text.js

```javascript
// Old way
ChangeText.enable();

// New way (automatically creates component if needed)
WBChangeText.enable();

// Or explicit component usage
const editor = document.querySelector('wb-change-text');
editor.enable();
```

### Event Name Changes

- `changeTextReady` → `wb-change-text-ready`
- `changeTextEdit` → `wb:changeTextEdit`
- `changeTextSave` → `wb:changeTextSave`
- `changeTextCancel` → `wb:changeTextCancel`

## Notes

- Changes are not automatically persisted - implement save handlers
- Original content is stored in memory during editing
- Format stripping on paste prevents style pollution
- Component respects existing click handlers when disabled
- Fully backward compatible with legacy API