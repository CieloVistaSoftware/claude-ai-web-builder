# Change Text Component

A direct inline text editing component that transforms any text element into an editable field using the contenteditable API.

## Overview

The Change Text component provides a seamless way to edit text content directly on the page without modal popups or form fields. When edit mode is enabled, users can simply click on any text element to start editing immediately.

## Features

- 🖱️ **Direct Inline Editing** - No modals or popups, edit text right where it appears
- ⌨️ **Keyboard Shortcuts** - Enter to save, Escape to cancel, Ctrl+S for quick save
- 🎯 **Smart Element Detection** - Automatically detects editable elements (headers, paragraphs, lists, etc.)
- 💾 **Auto-Save on Blur** - Changes save automatically when clicking outside
- 🎨 **Visual Feedback** - Clear visual indicators for hover and edit states
- 📋 **Format Stripping** - Paste operations automatically strip formatting
- 🔄 **State Management** - Tracks original content for cancel operations
- 🌐 **Event System** - Comprehensive events for edit, save, and cancel actions

## Installation

```html
<script src="path/to/change-text.js"></script>
```

Or for the simplified version:

```html
<script src="path/to/change-text-simple.js"></script>
```

## Usage

### Basic Setup

1. Include the component script in your HTML
2. Enable edit mode programmatically or through events
3. Click any text element to start editing

### Enabling Edit Mode

```javascript
// Enable edit mode
ChangeText.enable();

// Disable edit mode
ChangeText.disable();

// Toggle edit mode
ChangeText.setEditMode(true);

// Check if enabled
const isEnabled = ChangeText.isEnabled();
```

### Direct Element Editing

```javascript
// Edit a specific element
const element = document.querySelector('h1');
ChangeText.edit(element);

// Save all active edits
ChangeText.saveAll();
```

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

### Event Listening

```javascript
// Component ready
document.addEventListener('changeTextReady', (e) => {
    console.log('Component initialized', e.detail);
});

// Edit started
document.addEventListener('changeTextEdit', (e) => {
    console.log('Editing:', e.detail.element);
    console.log('Original content:', e.detail.content);
});

// Changes saved
document.addEventListener('changeTextSave', (e) => {
    console.log('Saved:', e.detail.element);
    console.log('Old content:', e.detail.oldContent);
    console.log('New content:', e.detail.newContent);
});

// Edit cancelled
document.addEventListener('changeTextCancel', (e) => {
    console.log('Cancelled:', e.detail.element);
});
```

### Edit Mode Events

The component listens for various edit mode events:

```javascript
// Standard events
document.dispatchEvent(new Event('editModeEnabled'));
document.dispatchEvent(new Event('editModeDisabled'));

// With detail
document.dispatchEvent(new CustomEvent('editModeChanged', {
    detail: { enabled: true }
}));

// WB-specific events
document.dispatchEvent(new Event('wb:editModeOn'));
document.dispatchEvent(new Event('wb:editModeOff'));
```

## Styling

### CSS Classes

- `.change-text-enabled` - Added to body when edit mode is active
- `.change-text-editable` - Applied to elements being edited

### Visual States

When edit mode is enabled:
- **Hover**: Dashed outline shows editable elements
- **Editing**: Solid outline with background highlight
- **Focus**: Enhanced outline for active editing

### Customization

The component injects styles automatically, but you can override them:

```css
/* Custom hover state */
.change-text-enabled h1:hover {
    outline-color: #your-color;
}

/* Custom editing state */
[contenteditable="true"] {
    background: rgba(your-color, 0.1);
    outline-color: #your-color;
}
```

## API Reference

### Global Object

```javascript
window.ChangeText = {
    // Enable edit mode
    enable: Function,
    
    // Disable edit mode
    disable: Function,
    
    // Set edit mode state
    setEditMode: Function(enabled: boolean),
    
    // Check if edit mode is enabled
    isEnabled: Function() => boolean,
    
    // Start editing specific element
    edit: Function(element: HTMLElement),
    
    // Save all active edits
    saveAll: Function()
}
```

## Best Practices

1. **User Feedback** - Always provide clear visual feedback for editable states
2. **Save Confirmation** - Consider adding save confirmations for critical content
3. **Permissions** - Implement proper authorization before enabling edit mode
4. **Validation** - Add content validation in save event handlers
5. **History** - Consider implementing undo/redo functionality

## Example Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <title>Change Text Example</title>
</head>
<body>
    <h1>Click to Edit This Title</h1>
    <p>This paragraph can also be edited inline.</p>
    
    <button onclick="ChangeText.enable()">Enable Editing</button>
    <button onclick="ChangeText.disable()">Disable Editing</button>
    
    <script src="change-text.js"></script>
    <script>
        // Listen for saves
        document.addEventListener('changeTextSave', (e) => {
            console.log('Content updated:', e.detail);
            // Send to server, update state, etc.
        });
    </script>
</body>
</html>
```

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- All modern browsers with contenteditable support

## Accessibility

- Maintains semantic HTML structure
- Preserves keyboard navigation
- Compatible with screen readers
- Clear visual focus indicators

## Notes

- Changes are not automatically persisted - implement save handlers
- Original content is stored in memory during editing
- Format stripping on paste prevents style pollution
- Component respects existing click handlers when disabled