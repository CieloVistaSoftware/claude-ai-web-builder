# Website Builder Plugin System

This document describes how to create and use plugins for the Website Builder.

## Overview

The Website Builder plugin system allows developers to extend the functionality of the website builder without modifying the core code. Plugins can add new UI controls, modify existing behaviors, add new features, and more.

## How Plugins Work

Plugins are JavaScript modules that register themselves with the PluginSystem. Once registered, they can interact with the Website Builder through its API and events.

## Creating a Plugin

To create a plugin, you need to:

1. Create a JavaScript file for your plugin
2. Define your plugin object with required methods
3. Register your plugin with the PluginSystem

Here's a basic template:

```javascript
(function() {
  const MyPlugin = {
    id: 'my-unique-plugin-id',
    name: 'My Plugin Name',
    version: '1.0.0',
    
    // Called when the plugin is initialized
    initialize: function() {
      console.log('My plugin initialized!');
      // Setup your plugin here
    },
    
    // Cleanup function when plugin is disabled/unloaded
    cleanup: function() {
      // Clean up any resources, event listeners, etc.
    }
  };
  
  // Register the plugin with the system
  if (window.PluginSystem) {
    window.PluginSystem.register('my-unique-plugin-id', MyPlugin);
  } else {
    console.error('Plugin system not found. Cannot register plugin.');
  }
})();
```

## Plugin API

Plugins can access the following API:

### PluginSystem API

- `PluginSystem.register(id, plugin)`: Register a new plugin
- `PluginSystem.get(id)`: Get a registered plugin by ID
- `PluginSystem.loadPlugin(url)`: Dynamically load a plugin from a URL

### Events

Plugins can listen for and dispatch events:

```javascript
// Listen for theme changes
document.addEventListener('theme:changed', (event) => {
  console.log('Theme changed:', event.detail);
});

// Dispatch a custom event
document.dispatchEvent(new CustomEvent('my-plugin:action', {
  detail: { action: 'something-happened' }
}));
```

## Loading Plugins

Plugins can be loaded in several ways:

1. **Automatically via plugin-loader.js**: Add your plugin to the `pluginConfig.autoload` array
2. **Dynamically at runtime**: Use `PluginSystem.loadPlugin(url)`
3. **Directly in HTML**: Add a script tag to load your plugin

## Plugin Examples

See the `plugins/demo-plugin.js` file for a complete example of how to create a plugin.

## Best Practices

1. Use unique IDs for your plugins to avoid conflicts
2. Clean up resources when your plugin is disabled
3. Use events for loose coupling with the core application
4. Follow the single responsibility principle
5. Document your plugin's API and usage
