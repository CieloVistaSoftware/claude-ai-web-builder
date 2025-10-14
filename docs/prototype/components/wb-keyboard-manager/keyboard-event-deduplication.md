# Keyboard Event Deduplication Strategies

## The Problem

When implementing keyboard shortcuts across multiple components, several issues can cause duplicate events:

1. **Event Bubbling**: Events propagate up the DOM tree
2. **Multiple Listeners**: Components registering the same shortcut
3. **Context Overlap**: Multiple contexts active simultaneously
4. **Component Lifecycle**: Components registering shortcuts multiple times

## Solutions Implemented in WB Keyboard Manager

### 1. **Single Global Listener** ✅
```javascript
// ONLY ONE listener on document
document.addEventListener('keydown', this.handleKeyDown.bind(this));
```
- No component should add its own keydown listeners
- All keyboard events flow through the central manager

### 2. **Event Deduplication** ✅
```javascript
// In wb-keyboard-manager.js
handleKeyDown(e) {
    // Mark event as handled to prevent duplicate processing
    if (e._wbKeyboardHandled) return;
    e._wbKeyboardHandled = true;
    
    // Process the event...
}
```

### 3. **Shortcut Registration Guards** ✅
```javascript
registerShortcut(shortcut) {
    // Check if already registered
    const normalizedKeys = this.normalizeKeys(shortcut.keys);
    if (this.shortcuts.has(normalizedKeys)) {
        console.warn('⌨️ Keyboard shortcut already registered:', normalizedKeys);
        return false;
    }
    // Register shortcut...
}
```

### 4. **Component Registration Pattern** ✅
```javascript
// In each component
connectedCallback() {
    // Use a flag to prevent duplicate registration
    if (!this._keyboardShortcutsRegistered) {
        this.registerKeyboardShortcuts();
        this._keyboardShortcutsRegistered = true;
    }
}

disconnectedCallback() {
    // Unregister when component is removed
    if (this._keyboardShortcutsRegistered) {
        this.unregisterKeyboardShortcuts();
        this._keyboardShortcutsRegistered = false;
    }
}
```

### 5. **Context Priority System** ✅
```javascript
// More specific contexts override global
isShortcutActive(shortcut) {
    // Component-specific context has priority over global
    if (shortcut.context === this.activeContext) return true;
    if (shortcut.context === 'global' && !this.hasSpecificContextShortcut(shortcut.keys)) return true;
    return false;
}
```

### 6. **Event Stop Propagation** ✅
```javascript
// In keyboard manager
if (shortcut.stopPropagation !== false) {
    e.stopPropagation(); // Prevents bubbling
    e.stopImmediatePropagation(); // Prevents other listeners on same element
}
```

## Best Practices for Components

### DO ✅
```javascript
class WBEventLog extends HTMLElement {
    connectedCallback() {
        // Register shortcuts through the manager
        const manager = document.querySelector('wb-keyboard-manager');
        if (manager && !this._shortcutsRegistered) {
            manager.registerShortcut({
                keys: 'ctrl+shift+e',
                action: 'toggleEventLog',
                description: 'Toggle Event Log',
                context: 'global',
                handler: () => this.toggle()
            });
            this._shortcutsRegistered = true;
        }
    }
    
    disconnectedCallback() {
        // Clean up shortcuts
        const manager = document.querySelector('wb-keyboard-manager');
        if (manager && this._shortcutsRegistered) {
            manager.unregisterShortcut('ctrl+shift+e');
            this._shortcutsRegistered = false;
        }
    }
}
```

### DON'T ❌
```javascript
class WBEventLog extends HTMLElement {
    connectedCallback() {
        // DON'T add direct keyboard listeners
        document.addEventListener('keydown', this.handleKeyDown); // ❌
        
        // DON'T register shortcuts multiple times
        setInterval(() => {
            this.registerShortcuts(); // ❌
        }, 1000);
    }
}
```

## Advanced Deduplication Techniques

### 1. **Unique Action IDs**
```javascript
// Use component instance ID in action names
registerShortcut({
    keys: 'escape',
    action: `closeModal_${this.id || this.generateId()}`,
    context: this.tagName.toLowerCase(),
    handler: () => this.close()
});
```

### 2. **Namespace by Component**
```javascript
// Prefix actions with component name
registerShortcut({
    keys: 'ctrl+c',
    action: 'wb-event-log:copy', // Namespaced action
    context: 'wb-event-log',
    handler: () => this.copyEvents()
});
```

### 3. **Priority Levels**
```javascript
registerShortcut({
    keys: 'escape',
    action: 'closeModal',
    priority: 10, // Higher priority executes first
    handler: () => this.close()
});
```

### 4. **Exclusive Shortcuts**
```javascript
registerShortcut({
    keys: 'ctrl+s',
    action: 'save',
    exclusive: true, // Prevents other handlers from executing
    handler: () => this.save()
});
```

## Event Flow Diagram

```
User Presses Key
       ↓
Document Keydown Event
       ↓
WB Keyboard Manager (Single Listener)
       ↓
Check if Event Already Handled ← [If Yes: Return]
       ↓
Mark Event as Handled
       ↓
Find Matching Shortcut
       ↓
Check Context Priority
       ↓
Execute Handler (Once)
       ↓
Stop Propagation
       ↓
Dispatch Success Event
```

## Testing for Duplicates

### Debug Mode
```javascript
// Enable debug mode to see all events
keyboardManager.debug = true;

// Will log:
// ⌨️ Key event: ctrl+s
// ⌨️ Shortcut found: save
// ⌨️ Executing handler for: save
// ⌨️ Handler executed successfully
```

### Event Counter
```javascript
// Track event execution
let eventCount = {};
document.addEventListener('wb:keyboard-shortcut-executed', (e) => {
    const key = `${e.detail.shortcut.keys}_${Date.now()}`;
    eventCount[key] = (eventCount[key] || 0) + 1;
    if (eventCount[key] > 1) {
        console.error('Duplicate event detected!', e.detail);
    }
});
```

## Component Integration Checklist

- [ ] No direct keydown/keyup listeners
- [ ] Register shortcuts in connectedCallback
- [ ] Unregister shortcuts in disconnectedCallback  
- [ ] Use registration flags to prevent duplicates
- [ ] Namespace actions appropriately
- [ ] Test with multiple component instances
- [ ] Verify no duplicate executions

## Summary

The WB Keyboard Manager prevents duplicate events through:
1. **Single global listener** - Only one keydown handler
2. **Event marking** - Flags events as handled
3. **Registration guards** - Prevents duplicate shortcuts
4. **Context priority** - Resolves conflicts intelligently
5. **Proper lifecycle** - Clean registration/unregistration