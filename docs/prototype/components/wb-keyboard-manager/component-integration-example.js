/**
 * Example: How WB Components Should Integrate with Keyboard Manager
 * This example shows best practices for avoiding duplicate events
 */

// Example: wb-event-log integration
class WBEventLogExample extends HTMLElement {
    constructor() {
        super();
        this._keyboardShortcutsRegistered = false;
        this._shortcutHandlers = new Map();
    }
    
    connectedCallback() {
        // Register shortcuts when component is added to DOM
        this.registerKeyboardShortcuts();
    }
    
    disconnectedCallback() {
        // Unregister shortcuts when component is removed
        this.unregisterKeyboardShortcuts();
    }
    
    registerKeyboardShortcuts() {
        // Guard against duplicate registration
        if (this._keyboardShortcutsRegistered) return;
        
        const keyboardManager = document.querySelector('wb-keyboard-manager');
        if (!keyboardManager) {
            if (window.WBEventLog) {
                WBEventLog.logWarning('WB Keyboard Manager not found', { 
                    component: 'component-integration-example', 
                    method: 'registerKeyboardShortcuts', 
                    line: 30 
                });
            } else {
                console.warn('⚠️ WB Keyboard Manager not found');
            }
            return;
        }
        
        // Define shortcuts for this component
        const shortcuts = [
            {
                keys: 'ctrl+shift+e',
                action: 'toggleEventLog',
                description: 'Toggle Event Log visibility',
                context: 'global',
                handler: () => this.toggle()
            },
            {
                keys: 'ctrl+e',
                action: 'clearEventLog',
                description: 'Clear all events',
                context: 'wb-event-log', // Only when this component is focused
                handler: () => this.clearEvents()
            },
            {
                keys: 'ctrl+c',
                action: 'copyEventLog',
                description: 'Copy selected events',
                context: 'wb-event-log',
                handler: () => this.copySelectedEvents()
            },
            {
                keys: 'escape',
                action: 'closeEventLog',
                description: 'Close Event Log',
                context: 'wb-event-log',
                handler: () => this.hideComponent()
            }
        ];
        
        // Register each shortcut
        shortcuts.forEach(shortcut => {
            // Store handler reference for cleanup
            this._shortcutHandlers.set(shortcut.keys, shortcut);
            
            // Add component instance to action name to ensure uniqueness
            const uniqueShortcut = {
                ...shortcut,
                action: `${shortcut.action}_${this.id || window.WBComponentUtils.generateId()}`
            };
            
            keyboardManager.registerShortcut(uniqueShortcut);
        });
        
        this._keyboardShortcutsRegistered = true;
        if (window.WBEventLog) {
            WBEventLog.logSuccess('Keyboard shortcuts registered', { 
                component: 'component-integration-example', 
                method: 'registerKeyboardShortcuts', 
                line: 81, 
                tagName: this.tagName 
            });
        } else {
            console.log('✅ Keyboard shortcuts registered for', this.tagName);
        }
    }
    
    unregisterKeyboardShortcuts() {
        // Guard against duplicate unregistration
        if (!this._keyboardShortcutsRegistered) return;
        
        const keyboardManager = document.querySelector('wb-keyboard-manager');
        if (!keyboardManager) return;
        
        // Unregister all shortcuts
        this._shortcutHandlers.forEach((shortcut, keys) => {
            keyboardManager.unregisterShortcut(keys);
        });
        
        this._shortcutHandlers.clear();
        this._keyboardShortcutsRegistered = false;
        if (window.WBEventLog) {
            WBEventLog.logInfo('Keyboard shortcuts unregistered', { 
                component: 'component-integration-example', 
                method: 'unregisterKeyboardShortcuts', 
                line: 115, 
                tagName: this.tagName 
            });
        } else {
            console.log('✅ Keyboard shortcuts unregistered for', this.tagName);
        }
    }
    
    // Ensure focus management for context
    focus() {
        super.focus();
        // Dispatch event so keyboard manager knows this component is focused
        document.dispatchEvent(new CustomEvent('wb:component-focused', {
            detail: { component: this.tagName.toLowerCase() }
        }));
    }
    
    // Component methods
    toggle() {
        if (window.WBEventLog) {
            WBEventLog.logUser('Toggle event log', { 
                component: 'component-integration-example', 
                method: 'toggle', 
                line: 129 
            });
        } else {
            console.log('Toggle event log');
        }
    }
    
    clearEvents() {
        if (window.WBEventLog) {
            WBEventLog.logUser('Clear events', { 
                component: 'component-integration-example', 
                method: 'clearEvents', 
                line: 133 
            });
        } else {
            console.log('Clear events');
        }
    }
    
    copySelectedEvents() {
        if (window.WBEventLog) {
            WBEventLog.logUser('Copy selected events', { 
                component: 'component-integration-example', 
                method: 'copySelectedEvents', 
                line: 137 
            });
        } else {
            console.log('Copy selected events');
        }
    }
    
    hideComponent() {
        if (window.WBEventLog) {
            WBEventLog.logUser('Hide component', { 
                component: 'component-integration-example', 
                method: 'hideComponent', 
                line: 141 
            });
        } else {
            console.log('Hide component');
        }
    }
    
}

// Example: Modal with exclusive escape handling
class WBModalExample extends HTMLElement {
    constructor() {
        super();
        this._keyboardShortcutsRegistered = false;
    }
    
    connectedCallback() {
        this.registerKeyboardShortcuts();
    }
    
    disconnectedCallback() {
        this.unregisterKeyboardShortcuts();
    }
    
    registerKeyboardShortcuts() {
        if (this._keyboardShortcutsRegistered) return;
        
        const keyboardManager = document.querySelector('wb-keyboard-manager');
        if (!keyboardManager) return;
        
        // Modal shortcuts with higher priority
        keyboardManager.registerShortcut({
            keys: 'escape',
            action: `closeModal_${this.id}`,
            description: 'Close this modal',
            context: 'wb-modal',
            handler: () => this.close(),
            // High priority for modals
            priority: 100
        });
        
        keyboardManager.registerShortcut({
            keys: 'enter',
            action: `confirmModal_${this.id}`,
            description: 'Confirm modal action',
            context: 'wb-modal',
            handler: () => this.confirm()
        });
        
        this._keyboardShortcutsRegistered = true;
    }
    
    unregisterKeyboardShortcuts() {
        if (!this._keyboardShortcutsRegistered) return;
        
        const keyboardManager = document.querySelector('wb-keyboard-manager');
        if (!keyboardManager) return;
        
        keyboardManager.unregisterShortcut('escape');
        keyboardManager.unregisterShortcut('enter');
        
        this._keyboardShortcutsRegistered = false;
    }
    
    show() {
        this.style.display = 'block';
        this.focus();
        // Set context when modal opens
        document.dispatchEvent(new CustomEvent('wb:component-focused', {
            detail: { component: 'wb-modal' }
        }));
    }
    
    close() {
        this.style.display = 'none';
        // Reset context when modal closes
        document.dispatchEvent(new CustomEvent('wb:component-focused', {
            detail: { component: 'global' }
        }));
    }
    
    confirm() {
        if (window.WBEventLog) {
            WBEventLog.logUser('Modal confirmed', { 
                component: 'component-integration-example', 
                method: 'confirm', 
                line: 219 
            });
        } else {
            console.log('Modal confirmed');
        }
        this.close();
    }
}

// Example: Color picker with arrow key navigation
class WBColorPickerExample extends HTMLElement {
    constructor() {
        super();
        this._keyboardShortcutsRegistered = false;
    }
    
    connectedCallback() {
        this.registerKeyboardShortcuts();
    }
    
    disconnectedCallback() {
        this.unregisterKeyboardShortcuts();
    }
    
    registerKeyboardShortcuts() {
        if (this._keyboardShortcutsRegistered) return;
        
        const keyboardManager = document.querySelector('wb-keyboard-manager');
        if (!keyboardManager) return;
        
        // Arrow key shortcuts for color adjustment
        const arrowShortcuts = [
            { keys: 'up', delta: { h: 0, s: 0, l: 1 } },
            { keys: 'down', delta: { h: 0, s: 0, l: -1 } },
            { keys: 'left', delta: { h: -1, s: 0, l: 0 } },
            { keys: 'right', delta: { h: 1, s: 0, l: 0 } },
            { keys: 'shift+up', delta: { h: 0, s: 1, l: 0 } },
            { keys: 'shift+down', delta: { h: 0, s: -1, l: 0 } },
            { keys: 'shift+left', delta: { h: -10, s: 0, l: 0 } },
            { keys: 'shift+right', delta: { h: 10, s: 0, l: 0 } }
        ];
        
        arrowShortcuts.forEach(({ keys, delta }) => {
            keyboardManager.registerShortcut({
                keys,
                action: `colorAdjust_${keys}_${this.id}`,
                description: `Adjust color ${keys}`,
                context: 'wb-color-picker',
                handler: () => this.adjustColor(delta),
                preventDefault: true, // Prevent scrolling
                stopPropagation: true
            });
        });
        
        this._keyboardShortcutsRegistered = true;
    }
    
    unregisterKeyboardShortcuts() {
        if (!this._keyboardShortcutsRegistered) return;
        
        const keyboardManager = document.querySelector('wb-keyboard-manager');
        if (!keyboardManager) return;
        
        // Unregister all arrow shortcuts
        ['up', 'down', 'left', 'right', 'shift+up', 'shift+down', 'shift+left', 'shift+right']
            .forEach(keys => keyboardManager.unregisterShortcut(keys));
        
        this._keyboardShortcutsRegistered = false;
    }
    
    adjustColor(delta) {
        if (window.WBEventLog) {
            WBEventLog.logUser('Adjusting color', { 
                component: 'component-integration-example', 
                method: 'adjustColor', 
                line: 286, 
                delta: delta 
            });
        } else {
            console.log('Adjusting color:', delta);
        }
        // Implement color adjustment logic
    }
}

// Best Practices Summary:
// 1. Use _keyboardShortcutsRegistered flag to prevent duplicates
// 2. Register in connectedCallback, unregister in disconnectedCallback
// 3. Use unique action names with component ID
// 4. Properly manage context with wb:component-focused events
// 5. Store shortcut references for proper cleanup
// 6. Never add direct keydown listeners
// 7. Use context-specific shortcuts when appropriate