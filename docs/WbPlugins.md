# WB Plugin Architecture Guide

---
*Last Updated: 2025-09-29*
*Version: 1.0.0*
*Author: Claude Code Assistant*
*Status: Current - Plugin system documentation*
---

## Overview

The Website Builder (WB) features a modular plugin architecture that allows you to extend your websites with additional functionality. Plugins are configured through the `plugins` section of your wb.json file and provide optional features that can be enabled or disabled as needed.

## How the Plugin System Works

### Plugin Configuration Structure

All plugins are configured within the `plugins` section of your wb.json file:

```json
{
  "metadata": {
    "title": "My Website",
    "description": "A website with plugins"
  },
  "plugins": {
    "pluginName": {
      "enabled": true,
      // plugin-specific configuration options
    },
    "anotherPlugin": {
      "enabled": false,
      // this plugin is disabled
    }
  },
  "navigation": { ... },
  "sections": { ... }
}
```

### Plugin Lifecycle

1. **Initialization**: When a website loads, the WB engine scans the `plugins` section
2. **Validation**: Each enabled plugin's configuration is validated
3. **Loading**: Plugin code is dynamically loaded based on configuration
4. **Integration**: Plugins integrate with the website's content and structure
5. **Runtime**: Plugins operate independently while sharing the wb.json data

### Plugin Enable/Disable

Plugins can be easily enabled or disabled by setting the `enabled` property:

```json
{
  "plugins": {
    "search": {
      "enabled": true,  // Plugin is active
      "buttonText": "Search"
    },
    "analytics": {
      "enabled": false  // Plugin is disabled
    }
  }
}
```

## Available Plugins

### Search Plugin
**Status**: Available  
**Purpose**: Provides site-wide search functionality  
**Documentation**: [wb-search-plugin.md](wb-search-plugin.md)

Basic configuration:
```json
{
  "plugins": {
    "search": {
      "enabled": true,
      "placement": "navigation",
      "buttonText": "Search",
      "buttonIcon": "🔍",
      "placeholder": "Search website..."
    }
  }
}
```

### Future Plugins
The plugin architecture is designed to support additional plugins as they are developed:

- **Analytics Plugin** - Website traffic and user behavior tracking
- **Contact Forms Plugin** - Dynamic form generation and handling
- **Social Media Plugin** - Social sharing and integration features
- **SEO Plugin** - Advanced SEO optimization tools
- **E-commerce Plugin** - Shopping cart and payment functionality

## Plugin Development Guidelines

### Plugin Structure

Each plugin should follow this structure:
```
plugins/
  pluginName/
    index.ts          // Main plugin entry point
    plugin-name.ts    // Core functionality
    types.ts          // TypeScript interfaces
    styles.css        // Plugin-specific styles
    README.md         // Plugin documentation
```

### Plugin Interface

All plugins must implement a standard interface:

```typescript
interface WBPlugin {
  name: string;
  version: string;
  initialize(config: PluginConfig, wbData: WBJsonData): void;
  destroy(): void;
  isEnabled(): boolean;
}
```

### Plugin Configuration Schema

Each plugin should define its configuration schema:

```typescript
interface PluginConfig {
  enabled: boolean;
  // plugin-specific options
}
```

## Best Practices

### Configuration

1. **Always include `enabled` property** - This allows users to easily disable plugins
2. **Provide sensible defaults** - Plugins should work with minimal configuration
3. **Validate configuration** - Check for required options and provide helpful error messages
4. **Document all options** - Include examples and descriptions for each configuration option

### Performance

1. **Lazy loading** - Only load plugin code when the plugin is enabled
2. **Minimal impact** - Plugins should not significantly affect page load times
3. **Clean up** - Properly dispose of resources when plugins are disabled
4. **Optimize for mobile** - Ensure plugins work well on all device types

### Integration

1. **Respect wb.json structure** - Work with the existing data format
2. **Don't modify core data** - Plugins should extend, not alter, wb.json content
3. **Event-driven** - Use events to communicate between plugins and the core system
4. **Graceful degradation** - Websites should function even if plugins fail

## Plugin Installation

### Built-in Plugins

Built-in plugins (like search) are included with the Website Builder and only need to be enabled in wb.json:

```json
{
  "plugins": {
    "search": {
      "enabled": true
    }
  }
}
```

### Custom Plugins

For custom plugins, add the plugin files to your project structure:

1. Create plugin directory: `plugins/custom-plugin/`
2. Add plugin files to the directory
3. Include plugin in your wb.json configuration
4. Reference plugin scripts in your HTML if needed

## Troubleshooting

### Common Issues

1. **Plugin not loading**:
   - Check that `enabled: true` is set
   - Verify plugin files exist in the correct location
   - Check browser console for JavaScript errors

2. **Configuration errors**:
   - Validate JSON syntax in wb.json
   - Ensure all required configuration options are provided
   - Check plugin documentation for correct option names

3. **Conflicts between plugins**:
   - Review plugin dependencies
   - Check for conflicting CSS styles
   - Verify plugins are compatible with each other

### Debug Mode

Enable debug mode for plugins by adding debug configuration:

```json
{
  "plugins": {
    "search": {
      "enabled": true,
      "debug": true
    }
  }
}
```

This will output detailed logging information to the browser console.

## Plugin API Reference

### Core Functions

```javascript
// Get plugin instance
const plugin = WB.Plugins.get('pluginName');

// Check if plugin is enabled
if (WB.Plugins.isEnabled('search')) {
  // Plugin-specific code
}

// Get plugin configuration
const config = WB.Plugins.getConfig('search');

// Listen for plugin events
WB.Plugins.on('search:initialized', function(data) {
  console.log('Search plugin ready');
});
```

### Data Access

Plugins have access to the wb.json data structure:

```javascript
// Access wb.json data
const wbData = WB.getData();
const navigation = wbData.navigation;
const sections = wbData.sections;

// Get specific section
const heroSection = WB.getSection('hero');
```

## Examples

### Minimal Plugin Configuration

```json
{
  "plugins": {
    "search": {
      "enabled": true
    }
  }
}
```

### Advanced Multi-Plugin Setup

```json
{
  "plugins": {
    "search": {
      "enabled": true,
      "placement": "navigation",
      "categories": [
        {
          "name": "Products",
          "icon": "📦",
          "filter": "product,item"
        }
      ]
    },
    "analytics": {
      "enabled": true,
      "trackingId": "GA-XXXXX-X",
      "anonymizeIp": true
    },
    "socialShare": {
      "enabled": true,
      "platforms": ["twitter", "facebook", "linkedin"],
      "placement": "footer"
    }
  }
}
```

## Conclusion

The WB plugin architecture provides a flexible way to extend website functionality while maintaining clean separation between core features and optional enhancements. By following the guidelines and best practices outlined in this document, you can effectively use and develop plugins for the Website Builder platform.

For specific plugin documentation, refer to individual plugin guides such as [wb-search-plugin.md](wb-search-plugin.md).