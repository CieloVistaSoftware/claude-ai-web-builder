# wb-event-log Component Design Document

## Overview
The `wb-event-log` component is a **passive, event-driven** logging system for the Website Builder application. It automatically captures and displays events without requiring explicit integration from other components.

## Purpose
- **Passive Event Monitoring**: Automatically listens for and captures events
- **Zero Integration Required**: Works without components needing to know about it
- **Real-time Display**: Shows events as they happen across the application
- **Console Interception**: Captures console.log, console.warn, console.error calls
- **Error Monitoring**: Automatically catches unhandled errors and promise rejections
- **User Activity Tracking**: Monitors user interactions (clicks, form changes, etc.)
- **Component Lifecycle**: Tracks component loading, errors, and state changes

## Component Structure
```
wb-event-log/
├── wb-event-log.js          # Main component logic
├── wb-event-log.css         # Component styles
├── wb-event-log.json        # Data-driven configuration
├── wb-event-log-demo.html   # Demo/testing page
├── wb-event-log.md          # Documentation
├── wb-event-log.design.md   # This design document
└── wb-event-log.issues.md   # Known issues (if any)
```

## Core Features

### Event Types
- **Info**: General information messages (blue icon)
- **Warning**: Non-critical warnings (yellow icon) 
- **Error**: Critical errors and failures (red icon)
- **Success**: Successful operations (green icon)
- **Debug**: Development/debugging messages (gray icon)
- **User**: User actions and interactions (purple icon)

### Display Features
- Real-time event streaming
- Auto-scroll to latest events (toggleable)
- Event timestamps with relative time display
- Color-coded event types with icons
- Expandable event details
- Event source/component identification

### Interaction Features
- Clear all events button
- Event type filtering (show/hide by type)
- Search/filter by text content
- Export events to JSON/CSV
- Pause/resume event logging
- Event details expansion on click

### Performance Features
- Maximum event limit (default: 1000 events)
- Automatic old event cleanup
- Lazy rendering for large event lists
- Virtual scrolling for performance

## API Design

### Event-Driven Architecture
The component operates as a passive listener, automatically capturing events without requiring explicit integration:

```javascript
class WBEventLog extends HTMLElement {
    constructor() {
        super();
        this.setupEventListeners();
    }
    
    // Automatic event listeners
    setupEventListeners() {
        // Listen for custom WB events
        document.addEventListener('wb:info', this.handleInfoEvent.bind(this));
        document.addEventListener('wb:warning', this.handleWarningEvent.bind(this));
        document.addEventListener('wb:error', this.handleErrorEvent.bind(this));
        document.addEventListener('wb:success', this.handleSuccessEvent.bind(this));
        document.addEventListener('wb:debug', this.handleDebugEvent.bind(this));
        
        // Listen for component lifecycle events
        document.addEventListener('wb:component-loaded', this.handleComponentEvent.bind(this));
        document.addEventListener('wb:component-error', this.handleComponentEvent.bind(this));
        
        // Listen for user interaction events
        document.addEventListener('click', this.handleUserInteraction.bind(this));
        document.addEventListener('change', this.handleUserInteraction.bind(this));
        
        // Listen for console events
        this.interceptConsole();
        
        // Listen for window errors
        window.addEventListener('error', this.handleWindowError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }
    
    // Manual logging methods (optional)
    static logInfo(message, details = {}) {
        document.dispatchEvent(new CustomEvent('wb:info', { detail: { message, ...details } }));
    }
    
    static logWarning(message, details = {}) {
        document.dispatchEvent(new CustomEvent('wb:warning', { detail: { message, ...details } }));
    }
    
    static logError(message, details = {}) {
        document.dispatchEvent(new CustomEvent('wb:error', { detail: { message, ...details } }));
    }
    
    static logSuccess(message, details = {}) {
        document.dispatchEvent(new CustomEvent('wb:success', { detail: { message, ...details } }));
    }
    
    // UI management
    clearEvents()
    pauseLogging()
    resumeLogging()
    exportEvents(format = 'json')
    setFilter(eventTypes = [])
    setSearchFilter(searchTerm = '')
    setMaxEvents(maxEvents = 1000)
    setAutoScroll(enabled = true)
}
```

### Event Structure
```javascript
{
    id: 'unique-event-id',
    type: 'info|warning|error|success|debug|user',
    timestamp: Date.now(),
    message: 'Event message',
    source: 'component-name',
    details: {
        // Additional event data
    },
    expanded: false
}
```

### Custom Events
- `wb-event-logged`: Fired when a new event is logged
- `wb-events-cleared`: Fired when events are cleared
- `wb-filter-changed`: Fired when filters are applied

## UI Design

### Layout
```
┌─────────────────────────────────────────────────────────┐
│ [Event Log] [🔍 Search] [⚙️ Settings] [🗑️ Clear] [⏸️ Pause] │
├─────────────────────────────────────────────────────────┤
│ [✓ Info] [⚠️ Warning] [❌ Error] [✅ Success] [🐛 Debug]    │
├─────────────────────────────────────────────────────────┤
│ 📝 12:34:56 [INFO] Component loaded successfully        │
│ ⚠️ 12:34:57 [WARN] API response took 3.2s               │
│ ❌ 12:34:58 [ERROR] Failed to load image: 404           │
│ ✅ 12:34:59 [SUCCESS] File saved successfully           │
│ 🐛 12:35:00 [DEBUG] State updated: {theme: 'dark'}      │
│ 👤 12:35:01 [USER] Button clicked: Save Document        │
│ 📝 12:35:02 [INFO] Theme manager initialized            │
│ ⚠️ 12:35:03 [WARN] Deprecated API usage detected        │
│ ❌ 12:35:04 [ERROR] Network request timeout             │
│ ✅ 12:35:05 [SUCCESS] Settings saved to localStorage    │
│ ...                                                     │
│ [Auto-scroll: ON] [Events: 156/1000]                   │
└─────────────────────────────────────────────────────────┘
```

### Event Display Requirements
- **One Event Per Line**: Each event must appear on its own separate line
- **Configurable Text Handling**: Two modes available:
  - **Truncate Mode** (default): Long messages truncated with ellipsis at 80 characters
  - **Wrap Mode**: Long messages wrap to multiple lines at 80 characters while maintaining event separation
- **Consistent Formatting**: Each line follows the pattern: `[ICON] [TIME] [TYPE] [MESSAGE]`
- **Click to Expand**: Click a line to show full message and details in expanded view
- **Visual Separation**: Clear visual distinction between each event line

### Text Display Modes
```
Truncate Mode (wrapMode: "truncate"):
📝 12:34:56 [INFO] This is a very long message that gets truncated after 80 char...

Wrap Mode (wrapMode: "wrap"):  
📝 12:34:56 [INFO] This is a very long message that wraps to the next line when it
                  exceeds 80 characters but maintains event separation
⚠️ 12:34:57 [WARN] Next event appears clearly separated
```

### Color Scheme
- **Info**: Blue (#007BFF)
- **Warning**: Orange (#FFA500)
- **Error**: Red (#DC3545)
- **Success**: Green (#28A745)
- **Debug**: Gray (#6C757D)
- **User**: Purple (#6F42C1)

### Dark Mode Support
- Uses CSS custom properties for theming
- Automatically adapts to system dark mode
- Compatible with existing theme system

## Integration Points

### Website Builder Integration
- **No Integration Required**: Simply include the component and it starts working
- **Event Bus Pattern**: Uses document-level custom events for communication
- **Existing Component Support**: Other components can emit events without knowing about the logger
- **Uses `wb-component-utils`** for common functionality
- **Follows component registry patterns**

### Automatic Event Sources
The component automatically captures events from multiple sources:

#### 1. Custom WB Events (Document Level)
```javascript
// Any component can emit these events - logger will catch them
document.dispatchEvent(new CustomEvent('wb:info', { 
    detail: { message: 'Component loaded', source: 'wb-button' }
}));

document.dispatchEvent(new CustomEvent('wb:error', { 
    detail: { message: 'API call failed', error: errorObj, source: 'api-service' }
}));
```

#### 2. Console Interception
- Automatically captures `console.log()`, `console.warn()`, `console.error()`
- Preserves original console functionality
- Adds source tracking when possible

#### 3. Global Error Handling
- `window.addEventListener('error')` for JavaScript errors
- `window.addEventListener('unhandledrejection')` for Promise rejections
- Automatic stack trace capture

#### 4. User Interaction Monitoring
- Click events on buttons, links, and interactive elements
- Form changes and submissions
- Navigation events
- Component-specific interactions

#### 5. Component Lifecycle Events
- Component loading/initialization
- Component errors and failures
- State changes and updates
- Performance metrics

## Configuration Options

### JSON Configuration
```json
{
    "maxEvents": 1000,
    "autoScroll": true,
    "defaultFilters": ["info", "warning", "error", "success"],
    "showTimestamps": true,
    "showSource": true,
    "expandableDetails": true,
    "exportFormats": ["json", "csv", "txt"],
    "display": {
        "oneEventPerLine": true,
        "truncateLength": 80,
        "showEllipsis": true,
        "lineHeight": "1.4em",
        "expandOnClick": true,
        "wrapMode": "truncate",
        "wrapLength": 80
    },
    "monitoring": {
        "interceptConsole": true,
        "captureErrors": true,
        "trackUserInteractions": true,
        "trackComponentLifecycle": true,
        "filterUserInteractions": ["data-wb-log"]
    },
    "eventBus": {
        "namespace": "wb:",
        "listenToAllEvents": false,
        "customEventTypes": ["wb:info", "wb:warning", "wb:error", "wb:success", "wb:debug"]
    },
    "theme": {
        "compact": false,
        "fontSize": "14px",
        "iconSize": "16px"
    }
}
```

### Usage Examples

#### Zero Configuration Usage
```html
<!-- Just include the component - it starts logging immediately -->
<wb-event-log></wb-event-log>
```

#### Components Emitting Events (Optional)
```javascript
// Any component can emit events without knowing about the logger
class WBButton extends HTMLElement {
    handleClick() {
        // Optional: Emit a custom event
        document.dispatchEvent(new CustomEvent('wb:user', {
            detail: { 
                message: 'Button clicked', 
                source: 'wb-button',
                element: this.id,
                variant: this.getAttribute('variant')
            }
        }));
    }
}
```

### Responsive Design
- Collapses filters on mobile screens
- Stacks controls vertically on small screens
- Optimizes event display for touch interfaces
- Maintains readability across all screen sizes

## Performance Considerations

### Memory Management
- Automatic cleanup of old events beyond maxEvents
- Efficient event storage using circular buffer
- Memory-conscious event detail storage

### Rendering Optimization
- Virtual scrolling for large event lists
- Debounced search filtering
- Lazy loading of event details
- Efficient DOM updates

### Network Impact
- Local event storage (no automatic network calls)
- Optional event export functionality
- Minimal bandwidth usage

## Security Considerations
- Sanitize event messages to prevent XSS
- Limit event detail object size
- Validate event sources
- Secure export functionality

## Future Enhancements
- Remote logging capability
- Event persistence across sessions
- Advanced filtering with regex support
- Event analytics and insights
- Integration with external monitoring tools
- Real-time collaboration features

## Dependencies
- Uses `wb-component-utils.js` for common utilities
- Integrates with existing theme system
- Compatible with Web Components standards
- No external library dependencies

## Browser Support
- Modern browsers with Web Components support
- Progressive enhancement for older browsers
- Graceful degradation of advanced features

## Testing Strategy
- Unit tests for event logging logic
- Integration tests with other components
- Performance tests with large event volumes
- Accessibility testing for screen readers
- Cross-browser compatibility testing

## Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly event announcements
- High contrast mode support
- Focus management for modal dialogs