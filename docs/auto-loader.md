# Component Auto-Loader System

## Overview

The Component Auto-Loader is an intelligent component loading system that automatically detects components on your page and loads their CSS and JavaScript dependencies. This generic utility works with any component naming convention and eliminates the need for manual script and link tag management, providing a streamlined developer experience.

## Key Features

### 🎯 **Smart Component Detection**
- Automatically scans the DOM for WB components
- Detects both custom elements (`<wb-button>`) and class-based components
- Supports dynamic component detection after page load

### 📦 **Intelligent Dependency Loading**
- Loads only the CSS/JS files for components you actually use
- Prevents duplicate loading of the same component
- Supports both parallel and sequential loading modes

### 🔄 **Dynamic Component Support**
- Uses MutationObserver to detect components added after initial page load
- Perfect for single-page applications and dynamic content
- Automatically loads dependencies for new components

### ⚡ **Performance Optimized**
- Parallel loading by default for better performance
- Caching prevents redundant network requests
- Minimal overhead with efficient DOM scanning

## Quick Start

### Basic Setup
Replace manual component imports with just two script tags:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My WB App</title>
    
    <!-- Component System - Auto-loads all components used on the page -->
    <script src="/config.js"></script>
    <script src="/utils/auto-loader.js"></script>
</head>
<body>
    <!-- Use any WB components - they'll be auto-loaded! -->
    <wb-button variant="primary">Click Me</wb-button>
    <wb-tab active-tab="home">
        <wb-tab-item tab-id="home">Home</wb-tab-item>
        <wb-tab-item tab-id="about">About</wb-tab-item>
    </wb-tab>
</body>
</html>
```

### Migration from Manual Loading

**Before (Manual):**
```html
<head>
    <script src="/config.js"></script>
    <link rel="stylesheet" href="/components/wb-button/wb-button.css">
    <script src="/components/wb-button/wb-button.js"></script>
    <link rel="stylesheet" href="/components/wb-tab/wb-tab.css">
    <script src="/components/wb-tab/wb-tab.js"></script>
    <link rel="stylesheet" href="/components/wb-input/wb-input.css">
    <script src="/components/wb-input/wb-input.js"></script>
</head>
```

**After (Auto-Loader):**
```html
<head>
    <script src="/config.js"></script>
    <script src="/utils/auto-loader.js"></script>
</head>
```

## Configuration

### Global Configuration
Configure the auto-loader through the global `config.js`:

```javascript
const config = {
    autoLoader: {
        enabled: true,              // Enable/disable auto-loading
        autoDetect: true,           // Enable dynamic component detection
        loadSequentially: false,    // Load components in sequence vs parallel
        showProgress: true,         // Show loading progress in console
        basePaths: {
            components: '/components',  // Base path for component files
            styles: '/styles',         // Base path for global styles
            utils: '/utils'            // Base path for utilities
        }
    }
};
```

### Component Detection Rules

The auto-loader detects components based on:

1. **Custom Elements**: Any element with tag name starting with `wb-`
   ```html
   <wb-button>Button</wb-button>
   <wb-tab>Tab Container</wb-tab>
   ```

2. **Class-based Components**: Elements with classes starting with `wb-`
   ```html
   <div class="wb-card">Card Content</div>
   <span class="wb-badge">Badge</span>
   ```

## API Reference

### ComponentAutoLoader Class

#### Methods

##### `initialize()`
Initializes the auto-loader system.
```javascript
await window.ComponentAutoLoader.initialize();
```

##### `loadComponentManually(componentName)`
Manually load a specific component.
```javascript
await window.ComponentAutoLoader.loadComponentManually('wb-button');
```

##### `getLoadedComponents()`
Get list of currently loaded components.
```javascript
const loaded = window.ComponentAutoLoader.getLoadedComponents();
console.log('Loaded components:', loaded);
```

##### `scanAndLoadComponents()`
Manually trigger a scan for new components.
```javascript
await window.ComponentAutoLoader.scanAndLoadComponents();
```

##### `destroy()`
Clean up the auto-loader (removes mutation observer).
```javascript
window.ComponentAutoLoader.destroy();
```

### Events

The auto-loader doesn't emit custom events currently, but logs all activities to the console with the `🚀 WB Auto-Loader:` prefix.

## File Structure

The auto-loader expects components to follow this structure:

```
/components/
├── wb-button/
│   ├── wb-button.css
│   ├── wb-button.js
│   └── wb-button.schema.json
├── wb-tab/
│   ├── wb-tab.css
│   ├── wb-tab.js
│   └── wb-tab.schema.json
└── wb-input/
    ├── wb-input.css
    ├── wb-input.js
    └── wb-input.schema.json
```

## Advanced Usage

### Programmatic Control

```javascript
// Wait for auto-loader to be ready
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize if not already done
    await window.ComponentAutoLoader.initialize();
    
    // Check what's loaded
    console.log('Loaded:', window.ComponentAutoLoader.getLoadedComponents());
    
    // Manually load a component
    await window.ComponentAutoLoader.loadComponentManually('wb-modal');
});
```

### Dynamic Component Addition

```javascript
// Add components dynamically - they'll be auto-loaded
function addComponent() {
    const container = document.getElementById('dynamic-content');
    container.innerHTML = `
        <wb-button variant="success">New Button</wb-button>
        <wb-input type="text" placeholder="New Input"></wb-input>
    `;
    // Auto-loader will detect and load these automatically!
}
```

### Custom Base Paths

```javascript
// Configure custom paths before initialization
window.WBConfig.setConfig({
    autoLoader: {
        basePaths: {
            components: '/my-custom-components',
            styles: '/assets/styles'
        }
    }
});
```

## Performance Considerations

### Loading Strategies

1. **Parallel Loading (Default)**: All components load simultaneously
   - Faster overall loading time
   - May cause network congestion with many components

2. **Sequential Loading**: Components load one after another
   - More predictable loading order
   - Better for slower connections

### Optimization Tips

1. **Group Related Components**: Place related components near each other in the DOM
2. **Minimize Component Variants**: Use fewer component types when possible
3. **Cache Headers**: Ensure your server sends proper cache headers for component files
4. **Bundle Critical Components**: Consider bundling frequently used components

## Troubleshooting

### Common Issues

#### Components Not Loading
1. Check console for error messages with `🚀 WB Auto-Loader:` prefix
2. Verify component files exist at expected paths
3. Check network tab for failed requests
4. Ensure auto-loader is enabled in config

#### Performance Issues
1. Enable sequential loading for slower connections
2. Check for network bottlenecks
3. Verify component files are properly cached
4. Consider reducing the number of components on the page

### Debug Mode

Enable detailed logging by setting:
```javascript
window.WBConfig.setConfig({
    autoLoader: {
        showProgress: true  // Shows detailed loading progress
    }
});
```

## Browser Support

- **Chrome**: 60+
- **Firefox**: 60+
- **Safari**: 12+
- **Edge**: 79+

Requires support for:
- ES6 Classes
- Promises/async-await
- MutationObserver
- fetch API

## Migration Guide

### From Manual Loading

1. Remove all individual component `<script>` and `<link>` tags
2. Add the auto-loader scripts to your `<head>`
3. Test that all components still work correctly
4. Update any build processes that concatenated component files

### Version Compatibility

- Auto-loader v1.0.0+ requires config.js v1.0.0+
- Compatible with all WB components v2.0.0+
- Backwards compatible with older component versions

## Best Practices

### HTML Structure
```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WB Application</title>
    
    <!-- Core WB System -->
    <script src="/config.js"></script>
    <script src="/utils/wb-auto-loader.js"></script>
    
    <!-- Your app styles -->
    <link rel="stylesheet" href="/app.css">
</head>
<body>
    <!-- WB components will be auto-loaded -->
</body>
</html>
```

### Configuration Management
```javascript
// Set up configuration before any components load
const wbConfig = {
    theme: { default: 'dark' },
    autoLoader: { 
        enabled: true,
        loadSequentially: false 
    }
};

window.WBConfig?.setConfig(wbConfig);
```

### Component Usage
```html
<!-- Good: Use semantic component names -->
<wb-button variant="primary">Save</wb-button>
<wb-input type="email" required></wb-input>

<!-- Avoid: Don't mix manual and auto-loading -->
<!-- <script src="/components/wb-button/wb-button.js"></script> -->
```

## Future Enhancements

### Planned Features
- **Lazy Loading**: Load components only when they come into viewport
- **Bundle Splitting**: Automatic code splitting for large applications
- **Preloading**: Preload likely-to-be-used components
- **Error Recovery**: Better handling of failed component loads
- **Performance Metrics**: Built-in performance monitoring

## Contributing

To contribute to the auto-loader:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

See [Contributing Guidelines](../CONTRIBUTING.md) for more details.