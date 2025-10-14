# wb-event-log Component

## Overview
The `wb-event-log` component is a passive, event-driven logging system that automatically captures and displays application events without requiring integration from other components.

## Features
- **Zero Integration Required**: Just include the component and it starts working
- **Passive Event Monitoring**: Automatically listens for events, errors, and user interactions
- **Real-time Display**: Shows events as they happen with timestamps
- **One Message Per Line**: All events must issue exactly one message per line for clean readability
- **Configurable Display**: Choose between truncate or wrap modes for long messages
- **Event Filtering**: Filter by event type (Info, Warning, Error, Success, Debug, User)
- **Search Functionality**: Search through event history
- **Export Capabilities**: Export events to JSON, CSV, or TXT formats
- **Claude.md Integration**: Save filtered events directly to claude.md files with proper formatting

## Usage

### Basic Usage
```html
<!-- Zero configuration - starts logging immediately -->
<wb-event-log></wb-event-log>
```

### With Configuration
```html
<wb-event-log 
    data-max-events="500"
    data-auto-scroll="true"
    data-wrap-mode="wrap">
</wb-event-log>
```

## Event Types

### Automatically Captured Events
- **Console Messages**: `console.log()`, `console.warn()`, `console.error()`
- **JavaScript Errors**: Unhandled errors and promise rejections
- **User Interactions**: Clicks, form changes, navigation
- **Component Lifecycle**: Component loading and errors

### Custom Events (Optional)
Components can optionally emit custom events with `from` and `to` information:

```javascript
// Info event with from/to
document.dispatchEvent(new CustomEvent('wb:info', {
    detail: { 
        message: 'Component loaded', 
        source: 'wb-button',
        from: 'component-factory',
        to: 'wb-button'
    }
}));

// Error event with from/to
document.dispatchEvent(new CustomEvent('wb:error', {
    detail: { 
        message: 'API call failed', 
        source: 'api-service', 
        error: errorObj,
        from: 'api-service',
        to: 'endpoint:/api/users'
    }
}));

// User action event with from/to
document.dispatchEvent(new CustomEvent('wb:user', {
    detail: { 
        message: 'Button clicked', 
        source: 'wb-button', 
        action: 'click',
        from: 'user',
        to: 'wb-button#save-btn'
    }
}));
```

### Static Helper Methods
```javascript
// Convenience methods that dispatch events with automatic from/to detection
WBEventLog.logInfo('Component initialized');
WBEventLog.logWarning('API response slow');
WBEventLog.logError('Failed to load data');
WBEventLog.logSuccess('File saved successfully');

// With explicit from/to information
WBEventLog.logInfo('Data processed', { 
    from: 'data-processor', 
    to: 'cache-manager' 
});
```

## Configuration Options

### Display Modes
- **Truncate Mode** (default): Long messages truncated at 80 characters with ellipsis
- **Wrap Mode**: Long messages wrap to multiple lines while maintaining event separation

### Message Line Requirements (ENFORCED)
**CRITICAL RULE: One Message Per Line**
- Every event must issue exactly **one message per line** for clean readability
- Multi-line messages are automatically flattened to single lines with spaces
- Line breaks (`\n`, `\r\n`) are converted to spaces
- Excessive whitespace is normalized to single spaces
- This ensures consistent formatting and prevents event log cluttering

**Implementation:**
```javascript
// ✅ Correct: Single line message
WBEventLog.logInfo('Component initialized successfully');

// ❌ Incorrect: Multi-line message
WBEventLog.logInfo(`Component initialized
    with configuration loaded
    from config.json`);

// ✅ Correct: Flattened message
WBEventLog.logInfo('Component initialized with configuration loaded from config.json');
```

### Event Types
- 📝 **Info**: General information (blue)
- ⚠️ **Warning**: Non-critical warnings (orange)  
- ❌ **Error**: Critical errors (red)
- ✅ **Success**: Successful operations (green)
- 🐛 **Debug**: Development messages (gray)
- 👤 **User**: User interactions (purple)

### Toolbar Features
- 🔍 **Search**: Filter events by text content
- ⚙️ **Settings**: Configure display options
- 🗑️ **Clear**: Clear all events
- ⏸️ **Pause**: Pause/resume event logging
- 📋 **Copy JSON**: Copy filtered events to clipboard as JSON
- 📤 **Export**: Export events in various formats
- 🪵 **Save to Claude.md**: Save filtered events to claude.md with proper formatting

## API Reference

### Static Methods
```javascript
// Manual event logging
WBEventLog.logInfo(message, details = {})
WBEventLog.logWarning(message, details = {})
WBEventLog.logError(message, details = {})
WBEventLog.logSuccess(message, details = {})
WBEventLog.logDebug(message, details = {})
```

### Instance Methods
```javascript
// Get component instance
const eventLog = document.querySelector('wb-event-log');

// Control logging
eventLog.clearEvents()
eventLog.pauseLogging()
eventLog.resumeLogging()

// Copy events to clipboard
eventLog.copyEventsAsJSON()

// Export events
eventLog.exportEvents('json')
eventLog.exportEvents('csv')
eventLog.exportEvents('txt')

// Save to Claude.md
eventLog.saveToClaudeFile()

// Filtering
eventLog.setFilter(['info', 'error'])
eventLog.setSearchFilter('component')

// Configuration
eventLog.setMaxEvents(1000)
eventLog.setAutoScroll(true)
eventLog.setWrapMode('wrap')
```

### Custom Events Fired
- `wb-event-logged`: Fired when a new event is logged
- `wb-events-cleared`: Fired when events are cleared
- `wb-filter-changed`: Fired when filters are applied
- `claude-log-saved`: Fired when events are successfully saved to claude.md

## Claude.md Integration

The wb-event-log component includes built-in functionality to save filtered events directly to `claude.md` files with proper formatting.

### Features
- **🪵 Save Button**: Click the wood log button in the toolbar to save filtered events
- **Smart Formatting**: Events are grouped by type and formatted as markdown
- **Multiple Save Methods**: 
  - Direct file saving (Chrome/Edge via File System Access API)
  - Server endpoint integration (`/api/save-claude-log`)
  - Download fallback for all browsers
- **Visual Feedback**: Green success or red error status notifications
- **Filter Respect**: Only saves currently visible/filtered events

### Save Format
```markdown
## Event Log Export - [timestamp]

### Summary
- Total events: X
- Filters: error, info
- Search: [search term]

### Events
#### ERROR Events (X)
- **time**: message
- **time**: message with stack trace

#### INFO Events (X)  
- **time**: message
```

### Configuration
```html
<!-- Enable/disable claude.md save feature -->
<wb-event-log claude-save-enabled="true"></wb-event-log>

<!-- Custom filename -->
<wb-event-log claude-filename="issues.md"></wb-event-log>

<!-- Disable event grouping -->
<wb-event-log claude-auto-group="false"></wb-event-log>
```

### Programmatic Usage
```javascript
// Save filtered events to claude.md
const eventLog = document.querySelector('wb-event-log');
await eventLog.saveToClaudeFile();

// Listen for save events
eventLog.addEventListener('claude-log-saved', (event) => {
    console.log('Saved to claude.md:', event.detail);
});
```

### Server Integration (Optional)
For seamless file saving, implement the server endpoint:
```javascript
// POST /api/save-claude-log
{
    "filename": "claude.md",
    "content": "# Event log content...",
    "folder": "current-folder-name"
}
```

## Styling

### CSS Custom Properties
```css
wb-event-log {
    --wb-event-log-bg: var(--background-color, #ffffff);
    --wb-event-log-border: var(--border-color, #dee2e6);
    --wb-event-log-text: var(--text-color, #212529);
    --wb-event-log-font-size: 14px;
    --wb-event-log-line-height: 1.4em;
    
    /* Event type colors */
    --wb-event-info: #007BFF;
    --wb-event-warning: #FFA500;
    --wb-event-error: #DC3545;
    --wb-event-success: #28A745;
    --wb-event-debug: #6C757D;
    --wb-event-user: #6F42C1;
}
```

### Dark Mode Support
The component automatically adapts to dark mode using CSS custom properties and system preferences.

## Performance

### Optimization Features
- **Virtual Scrolling**: Efficient rendering of large event lists
- **Event Limit**: Automatic cleanup of old events (default: 1000)
- **Batch Updates**: Debounced rendering for better performance
- **Lazy Loading**: Event details loaded on demand

### Memory Management
- Circular buffer for event storage
- Automatic cleanup of old events
- Efficient DOM updates

## Browser Support
- Modern browsers with Web Components support
- Progressive enhancement for older browsers
- Requires ES6+ features

## Examples

### Basic Event Logging
```html
<!DOCTYPE html>
<html>
<head>
    <script src="wb-component-utils.js"></script>
    <script src="wb-event-log.js"></script>
    <link rel="stylesheet" href="wb-event-log.css">
</head>
<body>
    <wb-event-log></wb-event-log>
    
    <script>
        // Events will be automatically captured
        console.log('Page loaded');
        console.warn('API deprecated');
        console.error('Failed to load');
        
        // Or use static methods
        WBEventLog.logSuccess('User logged in');
    </script>
</body>
</html>
```

## Integration with Website Builder
The component integrates seamlessly with the existing Website Builder component system:

- Uses `wb-component-utils.js` for common functionality
- Follows the established component patterns
- Compatible with the theme system
- Works with the component registry

## Implementation Status

### ✅ Completed Features
- **Core Component**: Full Web Component implementation with passive event monitoring
- **Event Interception**: Console methods, window errors, promise rejections
- **User Interaction Tracking**: Click and change events with smart filtering
- **Custom Event Bus**: Document-level `wb:*` event listening
- **From/To Event Tracking**: Automatic detection and display of event origin and target
- **Newest-First Display**: Events appear at the top of the log with auto-scroll to top
- **Display Modes**: Both truncate and wrap modes for long messages
- **Real-time Filtering**: Event type filters and text search
- **Export Functionality**: JSON, CSV, and TXT export formats
- **Configuration System**: JSON-based configuration with data attributes
- **Performance Optimizations**: Event limits, batch updates, virtual scrolling
- **Responsive Design**: Mobile-friendly layout with collapsing controls
- **Accessibility**: ARIA support, keyboard navigation, high contrast mode
- **Dark Mode**: Complete dark theme implementation for demo and component

### 🎯 Key Implementation Details
- **Zero Integration**: Component works immediately without requiring changes to other components
- **Passive Monitoring**: Automatically captures events without explicit logging calls
- **From/To Detection**: Smart detection of event origins and targets using stack traces
- **Newest-First Order**: Events display with newest at top, auto-scroll to top for new events
- **Memory Management**: Circular buffer with configurable event limits
- **Event Formatting**: Consistent timestamp, from/to, and message formatting
- **CSS Grid Layout**: Flexible responsive design with proper line separation including from/to column
- **Static Helper Methods**: `WBEventLog.logInfo()` etc. for optional manual logging

### 📁 File Structure
```
wb-event-log/
├── wb-event-log.js          ✅ Main component (650+ lines)
├── wb-event-log.css         ✅ Comprehensive styles (400+ lines) 
├── wb-event-log.json        ✅ Configuration schema
├── wb-event-log-demo.html   ✅ Interactive demo with tabs
├── wb-event-log.md          ✅ Documentation (this file)
└── wb-event-log.design.md   ✅ Design specification
```

## Troubleshooting

### Common Issues
- **No events showing**: Ensure the component is properly loaded and initialized
- **Console events not captured**: Check that `interceptConsole` is enabled in config
- **Performance issues**: Reduce `maxEvents` or enable `virtualScrolling`
- **Events not filtering**: Verify filter configuration and event type names
- **Wrap mode not working**: Check CSS custom properties and container width

### Debug Mode
Enable debug mode to see internal component events:
```javascript
document.querySelector('wb-event-log').setAttribute('data-debug', 'true');
```

### Performance Tuning
```javascript
// Reduce memory usage
eventLog.setMaxEvents(500);

// Disable console interception if not needed
componentConfig.monitoring.interceptConsole = false;

// Reduce user interaction tracking
componentConfig.monitoring.trackUserInteractions = false;
```