# WB Keyboard Manager Component Design

## Overview
A centralized keyboard event management system that provides consistent keyboard shortcuts across the entire Website Builder application.

## Design Goals
- **Centralized**: Single place for all keyboard event handling
- **Declarative**: Easy to define shortcuts with simple configuration
- **Conflict Resolution**: Automatic detection and warning of keyboard shortcut conflicts
- **Context Aware**: Support for different contexts (global, component-specific)
- **Accessible**: Proper accessibility features and help system
- **Extensible**: Easy to add new shortcuts dynamically

## API Design

### Basic Usage
```html
<!-- Zero configuration - just include the component -->
<wb-keyboard-manager></wb-keyboard-manager>
```

### Configuration-based Usage
```html
<wb-keyboard-manager 
    data-shortcuts='[
        {
            "keys": "ctrl+k+h",
            "action": "hideComponents",
            "description": "Hide Website Builder Interface",
            "context": "global"
        },
        {
            "keys": "ctrl+k+s", 
            "action": "showComponents",
            "description": "Show Website Builder Interface",
            "context": "global"
        }
    ]'>
</wb-keyboard-manager>
```

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
        // Custom handler function
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

// Show help modal
keyboardManager.showHelp();

// Enable/disable keyboard manager
keyboardManager.disable();
keyboardManager.enable();
```

## Shortcut Definition Schema

```typescript
interface KeyboardShortcut {
    keys: string;           // e.g., "ctrl+k+h", "alt+shift+d", "f1"
    action: string;         // Unique identifier for the action
    description: string;    // Human-readable description
    context?: string;       // "global" | "component-name" | "edit-mode"
    handler?: Function;     // Function to execute
    enabled?: boolean;      // Default: true
    preventDefault?: boolean; // Default: true
    stopPropagation?: boolean; // Default: true
}
```

## Key Sequence Formats

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
- Sequential: `ctrl+k+h` (press Ctrl+K, then H)
- Simultaneous: `ctrl+shift+e` (press all together)

## Context System

### Global Context
```javascript
keyboardManager.registerShortcut({
    keys: 'ctrl+k+h',
    context: 'global',
    // ... available everywhere
});
```

### Component Context
```javascript
keyboardManager.registerShortcut({
    keys: 'ctrl+e',
    context: 'wb-event-log',
    // ... only active when wb-event-log is focused
});
```

### Edit Mode Context
```javascript
keyboardManager.registerShortcut({
    keys: 'escape',
    context: 'edit-mode',
    // ... only active when in edit mode
});
```

## Events Dispatched

```javascript
// Before shortcut execution
document.addEventListener('wb:keyboard-shortcut-before', (e) => {
    console.log('About to execute:', e.detail.shortcut);
    // e.preventDefault() to cancel execution
});

// After shortcut execution
document.addEventListener('wb:keyboard-shortcut-executed', (e) => {
    console.log('Executed:', e.detail.shortcut);
});

// Shortcut conflict detected
document.addEventListener('wb:keyboard-conflict', (e) => {
    console.warn('Shortcut conflict:', e.detail.conflicts);
});

// Help shown/hidden
document.addEventListener('wb:keyboard-help-shown', (e) => {
    console.log('Help modal shown');
});
```

## Built-in Shortcuts

The component comes with sensible defaults:

```javascript
const DEFAULT_SHORTCUTS = [
    {
        keys: 'ctrl+k+h',
        action: 'hideComponents',
        description: 'Hide Website Builder Interface',
        context: 'global'
    },
    {
        keys: 'ctrl+k+s',
        action: 'showComponents', 
        description: 'Show Website Builder Interface',
        context: 'global'
    },
    {
        keys: 'ctrl+k+?',
        action: 'showHelp',
        description: 'Show Keyboard Shortcuts Help',
        context: 'global'
    },
    {
        keys: 'escape',
        action: 'closeModals',
        description: 'Close open modals',
        context: 'global'
    }
];
```

## Help System

### Auto-generated Help Modal
- Shows all registered shortcuts organized by context
- Searchable/filterable
- Displays key combinations with proper styling
- Accessible with keyboard navigation

### Help Modal Trigger
- `Ctrl+K+?` - Show help modal
- `?` - Show help (when not in input field)

## Integration with WB Components

### Event Log Integration
```javascript
// wb-event-log component would register:
keyboardManager.registerShortcut({
    keys: 'ctrl+shift+e',
    action: 'toggleEventLog',
    description: 'Toggle Event Log',
    handler: () => document.querySelector('wb-event-log').hideComponent()
});
```

### Control Panel Integration
```javascript
// Control panel color sliders
keyboardManager.registerShortcut({
    keys: 'left',
    context: 'color-slider',
    action: 'decrementSlider',
    description: 'Decrease color value',
    handler: (e) => {
        if (e.target.matches('input[type="range"]')) {
            e.target.stepDown();
        }
    }
});
```

## Configuration File Support

### JSON Configuration
```json
{
    "shortcuts": [
        {
            "keys": "ctrl+k+h",
            "action": "hideComponents",
            "description": "Hide Website Builder Interface",
            "context": "global"
        }
    ],
    "settings": {
        "sequenceTimeout": 1000,
        "showHelpOnStartup": false,
        "enableConflictWarnings": true
    }
}
```

## Implementation Architecture

### File Structure
```
components/wb-keyboard-manager/
├── wb-keyboard-manager.js      # Main component
├── wb-keyboard-manager.css     # Styling for help modal
├── wb-keyboard-manager.json    # Default configuration
├── wb-keyboard-manager.md      # Documentation
└── wb-keyboard-manager-demo.html # Demo page
```

### Core Features
- **Key Parser**: Parse complex key combinations
- **Event Handler**: Single document-level keydown listener  
- **Context Manager**: Track active contexts
- **Conflict Detector**: Warn about overlapping shortcuts
- **Help Generator**: Auto-generate help documentation
- **Storage Integration**: Save user customizations

## Migration Plan

### Phase 1: Create Component
1. Build basic wb-keyboard-manager component
2. Implement key parsing and event handling
3. Add help system

### Phase 2: Migrate Existing Shortcuts  
1. Move wb.html keyboard shortcuts to component
2. Update control panel arrow key handling
3. Test all existing functionality

### Phase 3: Enhancement
1. Add component-specific context support
2. Implement user customization
3. Add accessibility improvements

## Benefits

1. **Maintainability**: All keyboard shortcuts in one place
2. **Consistency**: Uniform behavior across components
3. **Discoverability**: Built-in help system shows all shortcuts
4. **Conflict Prevention**: Automatic detection of conflicting shortcuts
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **Extensibility**: Easy to add new shortcuts without code changes