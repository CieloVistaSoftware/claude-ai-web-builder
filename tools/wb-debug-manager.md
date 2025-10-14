# wb-debug-manager.js - Dynamic Plugin System for WB Component Debugging

## Overview

The WB Debug Manager is a comprehensive runtime debugging system that provides dynamic plugin-based debugging capabilities for WB components. It can be injected into any WB component page to provide real-time debugging, component inspection, performance monitoring, and error logging.

## Core Features

### 🔧 **Dynamic Plugin System**
- **Runtime Injection**: Can be injected into any running WB application
- **Plugin Architecture**: Modular debugging tools loaded on demand
- **Zero Configuration**: Works out-of-the-box with no setup required
- **Global Accessibility**: Available via multiple activation methods

### 🔍 **Component Discovery & Inspection**
- **Automatic Detection**: Discovers all WB components on the page
- **Real-time Monitoring**: Watches for new components being added
- **Component Status**: Shows initialization state and component type
- **Live Inspector UI**: Interactive component browser with details

### 📊 **Performance Monitoring**
- **Component Load Times**: Tracks individual component initialization
- **Performance Metrics**: Monitors rendering and update performance  
- **Resource Tracking**: Identifies performance bottlenecks
- **Timeline Analysis**: Component lifecycle timing

### 🚨 **Error Logging & Management**
- **Runtime Error Capture**: Automatically catches and logs all errors
- **wb-log-error Integration**: Dynamic injection of error logging component
- **Error Export**: Save debug logs for analysis
- **Auto-visibility**: Error logger appears automatically on first error

## Activation Methods

### 1. **Query Parameter** (Automatic)
```
http://example.com/page.html?debug=true
http://example.com/page.html?wb-debug=true
```

### 2. **Console Commands**
```javascript
// Enable debug mode
WB.debug.enable()

// Disable debug mode  
WB.debug.disable()

// Toggle debug mode
WB.debug.toggle()

// Quick injection (alias for enable)
WB.debug.inject()
```

### 3. **Keyboard Shortcut**
- **Hotkey**: `Ctrl+Shift+D` (toggles debug mode)

### 4. **Bookmarklet**
```javascript
javascript:WB.debug.inject()
```

### 5. **Persistent Setting**
- **LocalStorage**: Remembers debug preference across sessions
- **Auto-enable**: Automatically enables on page load if previously enabled

## Available Plugins

### 1. **Error Logger** (`error-log`)
- **Purpose**: Runtime error capture and logging
- **Auto-Load**: ✅ Enabled by default
- **Component**: Dynamically injects `wb-log-error` component
- **Features**:
  - Bottom-right error panel
  - Export error logs
  - Clear error history
  - Toggle visibility
  - Auto-show on first error

### 2. **Component Inspector** (`component-inspector`)
- **Purpose**: Live component state inspection
- **Auto-Load**: ❌ Manual activation
- **Features**:
  - Real-time component listing
  - Component type identification
  - Initialization status
  - Interactive component browser

### 3. **Event Monitor** (`event-monitor`)
- **Purpose**: Real-time event stream monitoring
- **Auto-Load**: ❌ Manual activation
- **Features**:
  - Captures all `wb:` events
  - Event timeline with timestamps
  - Event detail inspection
  - Target element tracking

### 4. **Performance Tracker** (`performance-tracker`)
- **Purpose**: Component performance monitoring
- **Auto-Load**: ❌ Manual activation
- **Features**:
  - Component load time measurement
  - Performance Observer integration
  - Resource timing analysis
  - Performance bottleneck identification

## Technical Architecture

### **Class Structure**
```javascript
class WBDebugManager {
    constructor()              // Initialize debug manager
    enable()                   // Activate debug mode
    disable()                  // Deactivate debug mode
    toggle()                   // Toggle debug state
    inject()                   // Alias for enable()
    loadPlugin(pluginId)       // Load specific plugin
    discoverComponents()       // Scan for WB components
    createDebugUI()           // Create debug control panel
    startMonitoring()         // Begin component monitoring
    exportDebugData()         // Export debug session data
}
```

### **Global Integration**
```javascript
// Main namespace
window.WB.debug = debugManagerInstance

// Convenience globals
window.WBDebug = {
    enable: () => debugManager.enable(),
    disable: () => debugManager.disable(),
    toggle: () => debugManager.toggle(),
    inject: () => debugManager.inject(),
    stats: () => debugManager.getStats(),
    export: () => debugManager.exportDebugData()
}
```

## Component Detection

### **Detection Patterns**
The debug manager automatically detects WB components using multiple patterns:

1. **Web Components**: `document.querySelectorAll('wb-*')`
2. **Data Attributes**: `[data-component^="wb-"]`
3. **CSS Classes**: `[class*="wb-"]`

### **Component Classification**
- **Web Component**: Custom elements with `WB-` tag names
- **Data Component**: Elements with `data-component` attributes
- **CSS Component**: Elements with `wb-` CSS classes
- **Unknown**: Elements that don't match standard patterns

## Debug UI

### **Control Panel**
- **Position**: Fixed bottom-left corner
- **Content**: Component count, plugin count, keyboard shortcut reminder
- **Controls**: Close button (×) to disable debug mode
- **Styling**: Dark theme with transparency

### **Inspector Panel**
- **Position**: Fixed top-right corner  
- **Content**: Live component listing with status indicators
- **Interaction**: Expandable component details
- **Styling**: Console-style monospace font

## Data Export

### **Debug Session Export**
```javascript
WB.debug.export() // or WBDebug.export()
```

**Exported Data Includes**:
- Session timestamp
- Component discovery results
- Event history
- Performance metrics
- Plugin status
- Error logs

**Export Format**: JSON file with timestamp filename

## Usage Examples

### **Basic Activation**
```javascript
// Quick debug enable
WB.debug.enable()

// Check debug status
console.log(WB.debug.getStats())

// Export session data
WB.debug.exportDebugData()
```

### **Manual Plugin Loading**
```javascript
// Load specific plugins
await WB.debug.loadPlugin('component-inspector')
await WB.debug.loadPlugin('event-monitor')
await WB.debug.loadPlugin('performance-tracker')
```

### **Component Monitoring**
```javascript
// Listen for new components
document.addEventListener('wb:debug:enabled', (event) => {
    console.log('Debug manager enabled:', event.detail.manager)
})
```

## Integration with WB Components

### **Event Integration**
- **Global Events**: Listens for all `wb:` prefixed events
- **Component Events**: Tracks component-specific events
- **Debug Events**: Dispatches `wb:debug:enabled` and `wb:debug:disabled`

### **Path Resolution**
- **Component Discovery**: Automatically resolves component paths
- **Dynamic Loading**: Loads components from standard WB paths
- **Fallback Paths**: Multiple path resolution strategies

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **ES6 Features**: Uses classes, async/await, Map, Set
- **Web APIs**: MutationObserver, PerformanceObserver, CustomEvent
- **Local Storage**: For persistent debug preferences

## Development Integration

### **NPM Scripts Integration**
```json
{
  "scripts": {
    "debug:inject": "echo 'Navigate to your page and press Ctrl+Shift+D'",
    "debug:bookmarklet": "open tools/wb-debug-bookmarklet.html"
  }
}
```

### **CI/CD Integration**
- **Automated Testing**: Can be used in test environments
- **Production Debugging**: Safe for production use (no modifications)
- **Performance Analysis**: Exports data for CI performance tracking

## Security Considerations

- **Read-Only**: Debug manager does not modify component code
- **Non-Invasive**: Only observes and reports, no data manipulation
- **Local Storage**: Only stores debug preferences, no sensitive data
- **Export Control**: Debug data export is user-initiated only

## Best Practices

### **For Developers**
1. **Enable Early**: Activate debug mode before loading complex components
2. **Monitor Performance**: Use performance tracker during development
3. **Export Sessions**: Save debug data for troubleshooting
4. **Check Component Status**: Verify all components initialize correctly

### **For Testing**
1. **Automated Activation**: Use query parameters for test automation
2. **Error Collection**: Monitor error logs during test runs
3. **Performance Baselines**: Track component load times
4. **Component Coverage**: Ensure all components are discovered

### **For Production**
1. **Conditional Loading**: Only load debug manager when needed
2. **Performance Impact**: Minimal overhead when inactive
3. **User Support**: Provide debug instructions for user issues
4. **Data Privacy**: Debug exports contain only technical data

## Troubleshooting

### **Common Issues**
- **Components Not Detected**: Check component naming conventions (`wb-*`)
- **Plugins Fail to Load**: Verify component paths are correct
- **Performance Issues**: Disable unused plugins
- **Export Failures**: Check browser download permissions

### **Debug Commands**
```javascript
// Verify debug manager loaded
console.log(window.WB?.debug ? 'Debug manager available' : 'Debug manager not loaded')

// Check component discovery
console.log(`Found ${WB.debug.getStats().components} components`)

// Manual component discovery
WB.debug.discoverComponents()

// Export current state
WB.debug.exportDebugData()
```

## Future Enhancements

- **Visual Component Highlighting**: Highlight components on hover
- **Dependency Graph**: Show component dependency relationships
- **Real-time Editing**: Live component property editing
- **Network Monitoring**: Track component resource loading
- **Memory Analysis**: Component memory usage tracking

---

**Status**: 🟢 **Production Ready**  
**Version**: 1.0.0  
**Dependencies**: None (self-contained)  
**Size**: ~15KB minified  
**Performance Impact**: Minimal when inactive