# WB Keyboard Manager Component

A centralized keyboard event management system that provides consistent keyboard shortcuts across the entire Website Builder application.

## Overview

The WB Keyboard Manager eliminates scattered keyboard event handling by providing a single, centralized component that manages all keyboard shortcuts. It supports multi-key sequences, context-aware shortcuts, conflict detection, and includes a built-in help system.

## Features

- **Centralized Management**: Single place for all keyboard event handling
- **Multi-key Sequences**: Support for complex shortcuts like `Ctrl+K+H`
- **Context Awareness**: Different shortcuts for different contexts (global, component-specific, edit-mode)
- **Conflict Detection**: Automatic detection and warning of conflicting shortcuts
- **Built-in Help**: Auto-generated help modal with all available shortcuts
- **Accessibility**: Full keyboard navigation and screen reader support
- **Zero Configuration**: Works immediately with sensible defaults

## Installation

### Basic Usage (Zero Configuration)

```html
<!-- Just include the component - works immediately -->
<wb-keyboard-manager></wb-keyboard-manager>

<!-- Include the JavaScript -->
<script src="components/wb-keyboard-manager/wb-keyboard-manager.js"></script>
```

### Configuration-based Usage

```html
<wb-keyboard-manager 
    data-shortcuts='[
        {
            "keys": "ctrl+shift+d",
            "action": "toggleDebug",
            "description": "Toggle Debug Mode",
            "context": "global"
        }
    ]'>
</wb-keyboard-manager>
```

## API

### JavaScript API

```javascript
// Get the keyboard manager instance
const keyboardManager = document.querySelector('wb-keyboard-manager');

// Register shortcuts programmatically
keyboardManager.registerShortcut({
    keys: 'ctrl+shift+e',
    action: 'toggleEventLog',
    description: 'Toggle Event Log visibility',
    context: 'global',
    handler: () => {
        console.log('Event log toggled');
    }
});

// Register with function reference
keyboardManager.registerShortcut({
    keys: 'ctrl+k+h',
    action: 'hideComponents',
    description: 'Hide Website Builder Interface',
    context: 'global',
    handler: window.hideComponents
});

// Unregister shortcuts
keyboardManager.unregisterShortcut('ctrl+k+h');

// List all shortcuts
const shortcuts = keyboardManager.getShortcuts();

// Context-specific shortcuts
const globalShortcuts = keyboardManager.getShortcuts('global');

// Show/hide help modal
keyboardManager.showHelp();
keyboardManager.hideHelp();

// Enable/disable keyboard manager
keyboardManager.disable();
keyboardManager.enable();
```

### Shortcut Definition

```javascript
const shortcut = {
    keys: 'ctrl+k+h',           // Key combination
    action: 'hideComponents',   // Unique action identifier
    description: 'Hide Website Builder Interface', // Human-readable description
    context: 'global',          // Context (optional, default: 'global')
    handler: hideComponents,    // Function to execute (optional)
    enabled: true,              // Enable/disable (optional, default: true)
    preventDefault: true,       // Prevent default (optional, default: true)
    stopPropagation: true       // Stop propagation (optional, default: true)
};
```

## Default Shortcuts

The component comes with these built-in shortcuts:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+K+H` | hideComponents | Hide Website Builder Interface |
| `Ctrl+K+S` | showComponents | Show Website Builder Interface |
| `Ctrl+K+?` | showHelp | Show Keyboard Shortcuts Help |
| `?` | showHelpQuestion | Show Keyboard Shortcuts Help (when not in input) |
| `Escape` | closeModals | Close open modals and help |

## Key Formats

### Supported Modifiers
- `ctrl` / `control`
- `alt` / `option`
- `shift`
- `meta` / `cmd` / `super` (Windows key / Cmd key)

### Supported Keys
- Letters: `a-z`
- Numbers: `0-9`
- Function keys: `f1-f12`
- Special keys: `space`, `enter`, `escape`, `tab`, `backspace`, `delete`
- Arrow keys: `up`, `down`, `left`, `right`

### Multi-key Sequences
- Sequential: `ctrl+k+h` (press Ctrl+K, then H within 1 second)
- Simultaneous: `ctrl+shift+e` (press all keys together)

## Context System

### Global Context
Available everywhere in the application:
```javascript
keyboardManager.registerShortcut({
    keys: 'ctrl+k+h',
    context: 'global'
});
```

### Component Context
Only active when specific component is focused:
```javascript
keyboardManager.registerShortcut({
    keys: 'ctrl+e',
    context: 'wb-event-log'
});
```

### Edit Mode Context
Only active when in edit mode:
```javascript
keyboardManager.registerShortcut({
    keys: 'escape',
    context: 'edit-mode'
});
```

## Events

### Dispatched Events

```javascript
// Before shortcut execution (cancellable)
document.addEventListener('wb:keyboard-shortcut-before', (e) => {
    console.log('About to execute:', e.detail.shortcut);
    // e.preventDefault() to cancel execution
});

// After shortcut execution
document.addEventListener('wb:keyboard-shortcut-executed', (e) => {
    console.log('Executed:', e.detail.shortcut);
});

// Shortcut execution error
document.addEventListener('wb:keyboard-shortcut-error', (e) => {
    console.error('Error:', e.detail.error);
});

// Context change
document.addEventListener('wb:keyboard-context-changed', (e) => {
    console.log('Context changed to:', e.detail.context);
});

// Shortcut conflict detected
document.addEventListener('wb:keyboard-conflict', (e) => {
    console.warn('Conflict:', e.detail.conflicts);
});

// Help shown/hidden
document.addEventListener('wb:keyboard-help-shown', (e) => {
    console.log('Help modal shown');
});

// Escape key pressed (for other components)
document.addEventListener('wb:escape-pressed', (e) => {
    console.log('Escape pressed');
});
```

### Listened Events

The component listens for these events to update context:

```javascript
// Component gained focus
document.dispatchEvent(new CustomEvent('wb:component-focused', {
    detail: { component: 'wb-event-log' }
}));

// Edit mode changed
document.dispatchEvent(new CustomEvent('wb:edit-mode-changed', {
    detail: { enabled: true }
}));
```

## Help System

### Auto-generated Help Modal
- Press `Ctrl+K+?` or `?` to show help
- Shows all registered shortcuts organized by context
- Keyboard navigable and accessible
- Press `Escape` to close

### Help Modal Features
- **Organized by Context**: Groups shortcuts by their context
- **Searchable**: Filter shortcuts by typing (future enhancement)
- **Keyboard Navigation**: Fully accessible with keyboard
- **Visual Key Display**: Shows key combinations with proper styling
- **Responsive**: Adapts to mobile devices

## Integration Examples

### Event Log Integration
```javascript
// Register event log specific shortcuts
keyboardManager.registerShortcut({
    keys: 'ctrl+shift+e',
    action: 'toggleEventLog',
    description: 'Toggle Event Log',
    context: 'global',
    handler: () => {
        const eventLog = document.querySelector('wb-event-log');
        if (eventLog) {
            eventLog.hideComponent();
        }
    }
});
```

### Control Panel Color Sliders
```javascript
// Register arrow key handlers for color sliders
keyboardManager.registerShortcut({
    keys: 'left',
    context: 'color-slider',
    action: 'decrementSlider',
    description: 'Decrease color value',
    handler: (e) => {
        if (e.target.matches('input[type="range"]')) {
            e.target.stepDown();
            e.target.dispatchEvent(new Event('input'));
        }
    }
});

keyboardManager.registerShortcut({
    keys: 'right',
    context: 'color-slider',
    action: 'incrementSlider', 
    description: 'Increase color value',
    handler: (e) => {
        if (e.target.matches('input[type="range"]')) {
            e.target.stepUp();
            e.target.dispatchEvent(new Event('input'));
        }
    }
});
```

## Configuration File

Create `wb-keyboard-manager.json` to define shortcuts:

```json
{
    "settings": {
        "sequenceTimeout": 1000,
        "enableConflictWarnings": true
    },
    "shortcuts": [
        {
            "keys": "ctrl+k+h",
            "action": "hideComponents",
            "description": "Hide Website Builder Interface",
            "context": "global"
        }
    ]
}
```

## Accessibility

The component is fully accessible and includes:

- **Keyboard Navigation**: All functionality accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and roles
- **High Contrast Mode**: Supports high contrast themes
- **Reduced Motion**: Respects user motion preferences
- **Focus Management**: Proper focus handling in help modal

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Required Features
- ES6 Classes and Custom Elements
- Keyboard Events API
- CSS Custom Properties
- Event Listeners

## File Structure

```
components/wb-keyboard-manager/
├── wb-keyboard-manager.js      # Main component
├── wb-keyboard-manager.css     # Styling for help modal
├── wb-keyboard-manager.json    # Configuration and metadata
├── wb-keyboard-manager.md      # Documentation (this file)
└── wb-keyboard-manager-demo.html # Demo page
```

## Migration from Scattered Handlers

### Before (Scattered)
```javascript
// In wb.html
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'k') {
        // Handle Ctrl+K sequences
    }
});

// In control-panel.js
input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        // Handle arrow keys
    }
});
```

### After (Centralized)
```javascript
// In wb.html - just include the component
<wb-keyboard-manager></wb-keyboard-manager>

// All shortcuts automatically registered and managed
// Help system automatically available
// Conflicts automatically detected
```

## Troubleshooting

### Common Issues

1. **Shortcuts not working**:
   - Check if component is included and initialized
   - Verify key combination format
   - Check browser console for errors

2. **Context not switching**:
   - Ensure elements dispatch focus events properly
   - Check if context is registered
   - Verify component focus detection

3. **Conflicts**:
   - Check console for conflict warnings
   - Use different key combinations
   - Unregister conflicting shortcuts

### Debug Mode

The component logs all actions to console with `⌨️` prefix. Check browser console for detailed information about:
- Shortcut registration
- Key events
- Context changes
- Execution results

## License

This component is part of the Website Builder project. Please refer to the main project license for usage terms.