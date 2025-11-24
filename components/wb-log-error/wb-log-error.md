# WB Log Error Component

This component supersedes any legacy error handler such as `wberrorhandler`. It provides all error capture, logging, and notification features needed for Website Builder applications, making separate error handlers obsolete.

Error logging and notification **web component** for Website Builder applications. Provides comprehensive error tracking, debugging tools, and runtime injection capabilities.
## Comparison: Legacy wberrorhandler

The older `wberrorhandler` was a simple error capture utility. The new `wb-log-error` web component is fully reactive, supports filtering, exporting, and UI controls, and integrates with all WB components. For new projects, use only `wb-log-error`.

## Features

### 🌐 **Web Component Architecture**
- **Custom Element**: `<wb-log-error></wb-log-error>` 
- **Standards Compliant**: Extends HTMLElement with proper lifecycle methods
- **Reactive Attributes**: Configuration via HTML attributes
- **Event-Driven**: Dispatches standard custom events
- **Self-Contained**: Automatic CSS loading and initialization

### 🔧 **Dynamic Plugin System**
- **Runtime Injection**: Can be injected into any page without code changes
- **WB Debug Manager**: Global debugging system for all WB components
- **Multiple Injection Methods**: Query params, hotkeys, console, bookmarklet
- **Zero Overhead**: Only active when needed
- **Development Focus**: Non-invasive debugging for production

### 🚨 **Error Capture**
- **Automatic Console Capture**: Intercepts `console.error()` and `console.warn()` calls
- **Unhandled Error Capture**: Catches unhandled JavaScript errors and exceptions
- **Promise Rejection Capture**: Catches unhandled Promise rejections
- **Component Error Integration**: Works with other WB components for centralized logging

### 📊 **Log Levels**
- **Error** (❌): Critical errors that may break functionality
- **Warning** (⚠️): Important issues that need attention
- **Info** (ℹ️): General information and status messages
- **Debug** (🐛): Detailed debugging information

### 💾 **Persistence**
- **Local Storage**: Saves errors across browser sessions
- **Automatic Cleanup**: Removes old errors based on age and count limits
- **Efficient Storage**: Optimized error data structure

### 📤 **Export Capabilities**
- **Copy to Clipboard**: One-click copy of formatted error log to clipboard
- **JSON Export**: Complete error data with metadata
- **CSV Export**: Spreadsheet-compatible format
- **Markdown Export**: Formatted issues.md file with error history
- **File Download**: Automatic file generation and download

### 🎨 **User Interface**
- **📋 Prominent Header**: Clear section heading with clipboard icon
- **Floating Panel**: Non-intrusive error display
- **Collapsible Design**: Expandable error details and stack traces
- **Responsive Layout**: Works on desktop and mobile devices
- **Dark Theme**: Consistent with WB design system

## Installation & Usage

### Method 1: Direct Web Component Usage

```html
<!-- Include the web component -->
<script src="path/to/wb-log-error-webcomponent.js"></script>

<!-- Use the custom element -->
<wb-log-error 
    position="bottom-right" 
    visible="true" 
    enable-export="true" 
    enable-clear="true" 
    enable-toggle="true"
    max-entries="100">
</wb-log-error>
```

### Method 2: Dynamic Injection (Recommended)

The **WB Debug Manager** allows runtime injection without code changes:

#### Query Parameter
```
http://localhost/wb-button-demo.html?debug=true
```

#### Browser Console
```javascript
// Enable debug mode (injects wb-log-error automatically)
WB.debug.enable()

// Toggle debug mode
WB.debug.toggle()

// Get component stats
WB.debug.getStats()
```

#### Keyboard Shortcut
Press **`Ctrl+Shift+D`** on any WB component page to toggle debug mode.

#### Bookmarklet
Drag this to your bookmarks bar:
```javascript
javascript:(function(){if(window.WB&&window.WB.debug){WB.debug.toggle();return;}var s=document.createElement('script');s.src='../../shared/wb-debug-manager.js';s.onload=function(){WB.debug.enable();};document.head.appendChild(s);})();
```

## Web Component API

### Attributes

```html
<wb-log-error 
    position="bottom-right"    <!-- Position: top-left, top-right, bottom-left, bottom-right, center -->
    visible="false"           <!-- Initial visibility: true, false -->
    enable-export="true"      <!-- Enable export buttons: true, false -->
    enable-clear="true"       <!-- Enable clear button: true, false -->
    enable-toggle="true"      <!-- Enable toggle button: true, false -->
    max-entries="100">        <!-- Maximum stored errors: number -->
</wb-log-error>
```

### JavaScript API

```javascript
// Get the component instance
const logComponent = document.querySelector('wb-log-error');

// Logging methods
logComponent.error('Something went wrong!', 'source.js', stackTrace);
logComponent.warn('This is a warning', 'source.js');
logComponent.info('Information message', 'source.js');
logComponent.debug('Debug information', 'source.js');

// Control methods
logComponent.show();                    // Show the error log
logComponent.hide();                    // Hide the error log
logComponent.toggleVisibility();        // Toggle visibility
logComponent.clearErrors();             // Clear all errors
logComponent.copyToClipboard();         // Copy errors to clipboard
logComponent.exportErrors('json');      // Export errors (json, csv, issues)

// Data access
const errors = logComponent.getErrors();    // Array of all errors
const stats = logComponent.getStats();      // Error statistics
```

### Events

The web component dispatches custom events:

```javascript
// Component ready
document.addEventListener('wb-log-error:ready', (event) => {
    console.log('Component ready:', event.detail.component);
});

// New error logged
document.addEventListener('wb-log-error:new', (event) => {
    console.log('New error:', event.detail.error);
});

// Errors cleared
document.addEventListener('wb-log-error:clear', (event) => {
    console.log('Errors cleared');
});

// Visibility toggled
document.addEventListener('wb-log-error:toggle', (event) => {
    console.log('Visibility changed:', event.detail.visible);
});
```

## Dynamic Plugin System

### WB Debug Manager Features

The **WB Debug Manager** (`wb-debug-manager.js`) provides:

- **Component Discovery**: Automatically finds all WB components on page
- **Plugin Architecture**: Extensible system for debug tools
- **Runtime Injection**: Zero-code debugging activation
- **Performance Monitoring**: Component loading metrics
- **Event Monitoring**: Real-time WB event tracking

### Available Plugins

1. **📋 Error Logger** (auto-loaded)
   - Injects wb-log-error web component
   - Captures all JavaScript errors automatically
   - Provides visual error log with export

2. **🔍 Component Inspector** (manual)
   ```javascript
   WB.debug.loadPlugin('component-inspector')
   ```

3. **📡 Event Monitor** (manual)
   ```javascript
   WB.debug.loadPlugin('event-monitor')
   ```

4. **⚡ Performance Tracker** (manual)
   ```javascript
   WB.debug.loadPlugin('performance-tracker')
   ```

### Debug Manager API

```javascript
// Control debug mode
WB.debug.enable();              // Enable debug mode
WB.debug.disable();             // Disable debug mode
WB.debug.toggle();              // Toggle debug mode

// Get information
WB.debug.getStats();            // Get debug statistics
WB.debug.exportDebugData();     // Export comprehensive debug data

// Plugin management
WB.debug.loadPlugin(pluginId);  // Load specific plugin
WB.debug.plugins;               // List loaded plugins
WB.debug.components;            // Discovered components
```

## Automatic Capture

The component automatically captures:

```javascript
// These will be automatically logged
console.error('This error will be captured');
console.warn('This warning will be captured');

// Unhandled errors
throw new Error('This will be captured');

// Promise rejections
Promise.reject('This will be captured');
```

## Statistics Object

```javascript
const stats = logComponent.getStats();
// Returns:
{
  total: 15,      // Total number of errors
  errors: 5,      // Number of error-level entries
  warnings: 8,    // Number of warning-level entries
  info: 2,        // Number of info-level entries
  debug: 0        // Number of debug-level entries
}
```

## Configuration

The component can be configured via `wb-log-error.json`:

```json
{
  "component": {
    "name": "wb-log-error",
    "version": "2.0.0",
    "description": "Website Builder error logging component"
  },
  "classes": {
    "container": "wb-log-error-container",
    "header": "wb-log-error-header",
    "title": "wb-log-error-title",
    "counter": "wb-log-error-counter",
    "body": "wb-log-error-body",
    "visible": "wb-log-error--visible"
  },
  "defaults": {
    "position": "bottom-right",
    "visible": false,
    "enableExport": true,
    "enableClear": true,
    "enableToggle": true,
    "maxEntries": 100
  },
  "events": {
    "ready": "wb-log-error:ready",
    "new": "wb-log-error:new",
    "clear": "wb-log-error:clear",
    "toggle": "wb-log-error:toggle"
  }
}
```

## Integration Examples

### With Any WB Component Demo

Simply add the debug manager:

```html
<!-- Option 1: Include debug manager -->
<script src="../../shared/wb-debug-manager.js"></script>

<!-- Option 2: Use query parameter -->
<!-- Navigate to: your-demo.html?debug=true -->

<!-- Option 3: Use bookmarklet on any existing demo -->
```

### With React Components

```javascript
// In a React component
useEffect(() => {
  const logComponent = document.querySelector('wb-log-error');
  if (logComponent) {
    logComponent.info('React component mounted', 'MyComponent.jsx');
  }
}, []);
```

### With API Calls

```javascript
// API error logging
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      document.querySelector('wb-log-error')?.warn(`API returned ${response.status}`, 'api.js');
    }
    return response.json();
  } catch (error) {
    document.querySelector('wb-log-error')?.error('API call failed', 'api.js', error.stack);
    throw error;
  }
}
```

## Development vs Production

### Development Mode
- Full debug manager with all plugins
- Runtime injection capabilities
- Detailed error tracking
- Export and analysis tools

### Production Mode
- Error logging only (no debug UI)
- Automatic error reporting
- Minimal performance impact
- Optional remote logging

## Browser Support

- **Modern Browsers**: Full web component support
- **Mobile Browsers**: Responsive design with touch support
- **Custom Elements**: Polyfill available for older browsers
- **LocalStorage**: Graceful degradation if unavailable

## Performance Considerations

- **Lazy Loading**: Components loaded only when needed
- **Minimal Overhead**: ~20KB for full debug system
- **Efficient Storage**: Optimized error data structure
- **Memory Management**: Automatic cleanup of old errors

## Migration from Legacy Version

### Old API (wb-log-error.js)
```javascript
WBLogError.error('message');
WBLogError.show();
```

### New Web Component API
```javascript
const logComponent = document.querySelector('wb-log-error');
logComponent.error('message');
logComponent.show();
```

### Dynamic Injection (Recommended)
```javascript
// No code changes needed - just enable debug mode
WB.debug.enable();
```

## Files Structure

```
wb-log-error/
├── wb-log-error-webcomponent.js    # Main web component
├── wb-log-error.js                 # Legacy version
├── wb-log-error.css                # Component styles
├── wb-log-error.json               # Configuration
├── wb-log-error-demo.html          # Component demo
└── wb-log-error.md                 # This documentation

shared/
├── wb-debug-manager.js             # Dynamic plugin system
├── wb-debug-bookmarklet.html       # Setup guide
└── wb-debug-test.html             # Test page
```

## Troubleshooting

### Common Issues

1. **Component not loading**: Check script path and custom elements support
2. **Debug manager not working**: Verify script inclusion and browser console
3. **Attributes not reactive**: Ensure proper attribute names (kebab-case)
4. **Export not working**: Check browser download permissions

### Debug Commands

```javascript
// Check if web component is registered
console.log(customElements.get('wb-log-error'));

// Check debug manager status
console.log(WB?.debug?.getStats());

// Force debug manager injection
WB.debug.inject();
```

This web component provides a modern, standards-compliant error logging solution with powerful runtime injection capabilities, making debugging and error monitoring seamless across all WB components.