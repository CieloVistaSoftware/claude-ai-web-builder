# Auto-Injection of wb-event-log into WBBaseComponent

## Overview
Instead of requiring developers to explicitly add `<wb-event-log></wb-event-log>` to their HTML, WBBaseComponent should automatically create and inject a wb-event-log instance on first initialization.

## Implementation Pattern

### Step 1: Add Auto-Injection Logic to WBBaseComponent

In `wb-base/wb-base.js`, add this at the class level (as a static property):

```javascript
export class WBBaseComponent extends HTMLElement {
    // Static flag to track if global event log has been initialized
    static _globalEventLogInitialized = false;
    static _globalEventLog = null;
    
    constructor() {
        super();
        
        // Auto-inject event log on FIRST WB component initialization
        if (!WBBaseComponent._globalEventLogInitialized) {
            WBBaseComponent._initializeGlobalEventLog();
        }
        
        // ... rest of constructor
    }
    
    /**
     * Auto-initialize global event log on first component load
     * Ensures every WB component system has event logging without explicit markup
     */
    static _initializeGlobalEventLog() {
        // Prevent multiple initializations
        if (WBBaseComponent._globalEventLogInitialized) return;
        WBBaseComponent._globalEventLogInitialized = true;
        
        try {
            // Create event log element
            const eventLog = document.createElement('wb-event-log');
            
            // Set it to be hidden by default (can be toggled by developer)
            eventLog.id = 'wb-global-event-log';
            eventLog.setAttribute('data-auto-inject', 'true');
            eventLog.style.display = 'none'; // Hidden by default
            eventLog.style.position = 'fixed';
            eventLog.style.bottom = '0';
            eventLog.style.right = '0';
            eventLog.style.zIndex = '999999';
            eventLog.style.width = '400px';
            eventLog.style.height = '300px';
            
            // Add to document
            document.body.appendChild(eventLog);
            
            // Store reference
            WBBaseComponent._globalEventLog = eventLog;
            
            // Log that system is ready
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('wb:event-log-ready', {
                    detail: { eventLog }
                }));
            }, 100);
            
        } catch (error) {
            console.error('Failed to initialize global event log:', error);
        }
    }
    
    /**
     * Get the global event log instance
     * Useful for programmatic access to the event log
     */
    static getGlobalEventLog() {
        return WBBaseComponent._globalEventLog;
    }
    
    /**
     * Toggle visibility of global event log for development/debugging
     */
    static toggleEventLogVisibility() {
        if (WBBaseComponent._globalEventLog) {
            const current = WBBaseComponent._globalEventLog.style.display;
            WBBaseComponent._globalEventLog.style.display = 
                current === 'none' ? 'flex' : 'none';
            return WBBaseComponent._globalEventLog.style.display !== 'none';
        }
        return false;
    }
}
```

## Usage

### Zero Configuration Required
Simply use your WB components as normal:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="/config.js"></script>
    <script src="../../utils/auto-loader.js"></script>
</head>
<body>
    <!-- No need for <wb-event-log> anymore! -->
    <wb-control-panel></wb-control-panel>
    <wb-button>Click me</wb-button>
    
    <!-- Event log is auto-created and hidden by default -->
</body>
</html>
```

### Show Event Log During Development
```javascript
// In console or dev tools:
WBBaseComponent.toggleEventLogVisibility();

// Or programmatically:
const eventLog = WBBaseComponent.getGlobalEventLog();
eventLog.style.display = 'flex';
```

### Override Auto-Injection
If you still want explicit markup control:

```javascript
// Disable auto-injection before any WB component loads
WBBaseComponent._globalEventLogInitialized = true;
```

Then add your own `<wb-event-log>` markup manually.

## Benefits

✅ **Zero Markup Required** - No need to add `<wb-event-log>` to HTML
✅ **Universal Event Logging** - Every WB component system automatically has it
✅ **Hidden by Default** - Doesn't clutter the UI in production
✅ **Easy Access** - Toggle with `WBBaseComponent.toggleEventLogVisibility()`
✅ **Single Instance** - Only one event log per page (efficient)
✅ **Automatic Cleanup** - No need to manually manage lifecycle

## Compatibility

### If Developer Already Has `<wb-event-log>` in Markup
The system detects existing event logs:

```javascript
static _initializeGlobalEventLog() {
    // Check if event log already exists
    const existing = document.querySelector('wb-event-log');
    if (existing) {
        WBBaseComponent._globalEventLog = existing;
        WBBaseComponent._globalEventLogInitialized = true;
        return;
    }
    
    // ... create new one if not found
}
```

## Testing

```javascript
// Test that event log exists
console.log('Event Log exists:', !!WBBaseComponent.getGlobalEventLog());

// Test that events are being captured
WBBaseComponent.toggleEventLogVisibility();

// All wb:* custom events should now be visible
document.dispatchEvent(new CustomEvent('wb:info', {
    detail: { message: 'Test event' }
}));
```

## Configuration

The auto-injected event log can still be configured via data attributes:

```javascript
// In _initializeGlobalEventLog(), before appendChild:
eventLog.setAttribute('data-max-events', '500');
eventLog.setAttribute('data-auto-scroll', 'true');
eventLog.setAttribute('data-wrap-mode', 'truncate');
```

Or enable it after creation:

```javascript
const eventLog = WBBaseComponent.getGlobalEventLog();
eventLog.setAttribute('data-max-events', '2000');
```

## Debugging

The auto-injected event log has special identifier:

```javascript
// Always find the auto-injected event log
const autoEventLog = document.getElementById('wb-global-event-log');

// Or via class method
const eventLog = WBBaseComponent.getGlobalEventLog();

// Check if it's auto-injected
const isAutoInjected = 
    document.getElementById('wb-global-event-log')?.
    hasAttribute('data-auto-inject');
```

## Migration Path

### Before (Manual)
```html
<wb-event-log></wb-event-log>
<wb-control-panel></wb-control-panel>
```

### After (Automatic)
```html
<!-- Just this - event log created automatically! -->
<wb-control-panel></wb-control-panel>
```

No code changes needed - just remove the `<wb-event-log>` markup!
