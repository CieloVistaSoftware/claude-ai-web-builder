# WB Global Configuration System

## Overview

The WB Global Configuration System provides centralized configuration management for all WB components. This system allows you to define default settings, customize component behavior, and maintain consistency across your entire application.

## Table of Contents

- [Core Concepts](#core-concepts)
- [Global Configuration](#global-configuration)
- [Overriding Global Configuration](#overriding-global-configuration)
- [Configuration Structure](#configuration-structure)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Core Concepts

### 1. Global Configuration

**Global Configuration** is the foundation of the WB component system. It provides:

- **Default Settings**: Base configuration values that apply to all components
- **System-wide Preferences**: Theme, layout, and behavior settings that affect the entire application
- **Component Defaults**: Default properties and behaviors for each WB component type
- **Auto-loader Settings**: Configuration for automatic CSS/JS file loading
- **Development Options**: Debugging, logging, and development-specific features

#### Key Benefits:
- **Consistency**: Ensures uniform behavior across all components
- **Maintainability**: Single location to manage application-wide settings
- **Flexibility**: Easy to modify system behavior without touching individual components
- **Performance**: Optimized loading and caching strategies

#### Global Configuration Scope:
```javascript
// Global config affects:
- All wb-button components will use these defaults
- All wb-card components will inherit these settings
- System-wide theme and layout preferences
- Auto-loader behavior for all components
- Development and debugging features
```

### 2. Overriding Global Configuration

**Configuration Overriding** allows you to customize settings at different levels:

- **Application Level**: Override global defaults for your specific application needs
- **Component Level**: Customize settings for specific component types
- **Instance Level**: Override settings for individual component instances
- **Runtime Level**: Dynamically change configuration during application execution

#### Override Hierarchy (highest to lowest priority):
1. **Instance Attributes** - Individual component attributes (highest priority)
2. **Runtime Overrides** - Dynamic configuration changes via JavaScript
3. **Application Overrides** - Custom configuration in your application
4. **Global Defaults** - Base WB system configuration (lowest priority)

#### Override Methods:

**Method 1: JavaScript API**
```javascript
// Override at application startup
WBGlobalConfig.override({
    theme: {
        default: 'light'
    },
    components: {
        'wb-button': {
            variant: 'primary',
            size: 'large'
        }
    }
});
```

**Method 2: Configuration File**
```json
// wb-config.json
{
    "theme": {
        "default": "light"
    },
    "components": {
        "wb-button": {
            "variant": "primary"
        }
    }
}
```

**Method 3: HTML Attributes**
```html
<!-- Instance-level override -->
<wb-button variant="secondary" size="small">Click Me</wb-button>
```

## Configuration Structure

### Top-Level Sections

#### System Information
```javascript
system: {
    version: '1.0.0',
    name: 'WB Component System',
    lastUpdated: '2025-10-05'
}
```

#### Theme Configuration
```javascript
theme: {
    default: 'dark',                    // Default theme
    available: ['light', 'dark', 'auto'], // Available themes
    cssVariables: '/styles/_variables.css', // CSS variables file
    transitions: {
        duration: '0.3s',
        easing: 'ease-in-out'
    }
}
```

#### Layout System
```javascript
layout: {
    default: 'top-nav',                 // Default layout
    available: ['top-nav', 'left-nav', 'right-nav', 'ad-layout'],
    useGrid: true,
    responsive: true,
    breakpoints: {
        mobile: '768px',
        tablet: '1024px',
        desktop: '1200px',
        wide: '1400px'
    }
}
```

#### Component Defaults
```javascript
components: {
    'wb-button': {
        variant: 'default',
        size: 'standard',
        disabled: false,
        loading: false
    },
    'wb-card': {
        variant: 'default',
        size: 'standard',
        layout: 'vertical',
        clickable: false
    }
    // ... more components
}
```

#### Auto-Loader Settings
```javascript
autoLoader: {
    enabled: true,
    autoDetect: true,
    loadSequentially: true,
    basePaths: {
        components: '/components',
        styles: '/styles'
    }
}
```

## API Reference

### WBGlobalConfig Methods

#### Initialization
```javascript
// Initialize with custom configuration
await WBGlobalConfig.init(customConfig);
```

#### Getting Configuration Values
```javascript
// Get value by path
const theme = WBGlobalConfig.get('theme.default');
const buttonDefaults = WBGlobalConfig.get('components.wb-button');

// Get component-specific configuration
const cardConfig = WBGlobalConfig.getComponentConfig('wb-card');
```

#### Setting Configuration Values
```javascript
// Set single value
WBGlobalConfig.set('theme.default', 'light');

// Set with persistence
WBGlobalConfig.set('theme.default', 'light', true);
```

#### Overriding Configuration
```javascript
// Apply overrides
WBGlobalConfig.override({
    theme: { default: 'light' },
    components: {
        'wb-button': { variant: 'primary' }
    }
});

// Apply persistent overrides
WBGlobalConfig.override(overrides, true);
```

#### Watching Configuration Changes
```javascript
// Watch for changes
const unwatch = WBGlobalConfig.watch('theme.default', (newValue) => {
    console.log('Theme changed to:', newValue);
});

// Stop watching
unwatch();
```

#### Resetting Configuration
```javascript
// Reset specific section
WBGlobalConfig.reset('theme');

// Reset all configuration
WBGlobalConfig.reset();
```

## Examples

### Example 1: Basic Application Setup

```javascript
// app.js
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize with custom configuration
    await WBGlobalConfig.init({
        theme: {
            default: 'light'
        },
        components: {
            'wb-button': {
                variant: 'primary',
                size: 'large'
            }
        },
        development: {
            enableLogging: true,
            debugMode: true
        }
    });
    
    console.log('Application initialized with custom config');
});
```

### Example 2: Runtime Theme Switching

```javascript
// theme-switcher.js
function switchTheme(themeName) {
    WBGlobalConfig.set('theme.default', themeName, true);
    document.body.setAttribute('data-theme', themeName);
}

// Watch for theme changes
WBGlobalConfig.watch('theme.default', (newTheme) => {
    document.body.setAttribute('data-theme', newTheme);
    console.log(`Theme switched to: ${newTheme}`);
});
```

### Example 3: Component-Specific Overrides

```javascript
// Customize all wb-card components
WBGlobalConfig.override({
    components: {
        'wb-card': {
            variant: 'elevated',
            clickable: true,
            showActions: true
        }
    }
});
```

### Example 4: External Configuration File

```json
// wb-config.json
{
    "theme": {
        "default": "auto",
        "transitions": {
            "duration": "0.2s"
        }
    },
    "layout": {
        "default": "left-nav",
        "containerMaxWidth": "1400px"
    },
    "components": {
        "wb-header": {
            "sticky": true,
            "showActions": true
        },
        "wb-nav": {
            "showIcons": true,
            "variant": "pills"
        }
    },
    "development": {
        "enableLogging": false,
        "debugMode": false
    }
}
```

### Example 5: Component Instance Override

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>WB Components</title>
    <script src="/components/wb-global-config/wb-global-config.js"></script>
</head>
<body data-theme="dark">
    <!-- These buttons will use global defaults -->
    <wb-button>Default Button</wb-button>
    <wb-button>Another Default</wb-button>
    
    <!-- This button overrides the global config -->
    <wb-button variant="danger" size="small">Override Button</wb-button>
    
    <!-- This card uses global defaults -->
    <wb-card>
        <h3>Default Card</h3>
        <p>Uses global configuration</p>
    </wb-card>
    
    <!-- This card overrides specific settings -->
    <wb-card variant="outlined" clickable="true">
        <h3>Custom Card</h3>
        <p>Overrides global settings</p>
    </wb-card>
</body>
</html>
```

## Best Practices

### 1. Global Configuration Best Practices

- **Set Once, Use Everywhere**: Define global settings at application startup
- **Use Semantic Defaults**: Choose defaults that make sense for most use cases
- **Document Your Overrides**: Keep track of what you've customized and why
- **Test Across Components**: Ensure global changes work well with all components

### 2. Override Best Practices

- **Minimal Overrides**: Only override what you need to change
- **Layer Overrides Logically**: Use the override hierarchy effectively
- **Use Persistent Storage Wisely**: Only persist user preferences, not temporary states
- **Validate Override Values**: Ensure override values are valid and safe

### 3. Performance Best Practices

- **Cache Configuration**: Enable caching for better performance
- **Lazy Load When Possible**: Use lazy loading for non-critical components
- **Minimize Runtime Changes**: Avoid frequent configuration changes during runtime
- **Profile Configuration Impact**: Monitor how configuration affects performance

### 4. Development Best Practices

- **Enable Logging in Development**: Use logging to debug configuration issues
- **Use Schema Validation**: Validate configuration against the schema
- **Test Override Scenarios**: Test various override combinations
- **Document Custom Configurations**: Keep documentation updated with your customizations

## Events

The global configuration system dispatches several events:

### wbGlobalConfigReady
Fired when the configuration system is fully initialized.

```javascript
document.addEventListener('wbGlobalConfigReady', (event) => {
    console.log('Config ready:', event.detail.config);
    console.log('Version:', event.detail.version);
});
```

### wbGlobalConfigChanged
Fired when configuration values change.

```javascript
document.addEventListener('wbGlobalConfigChanged', (event) => {
    console.log('Config changed:', event.detail);
});
```

### wbGlobalConfigReset
Fired when configuration is reset to defaults.

```javascript
document.addEventListener('wbGlobalConfigReset', (event) => {
    console.log('Config reset:', event.detail.section);
});
```

## Troubleshooting

### Common Issues

1. **Configuration Not Loading**
   - Check file paths in configuration
   - Verify script loading order
   - Check browser console for errors

2. **Overrides Not Working**
   - Verify override timing (after initialization)
   - Check override object structure
   - Ensure proper path notation

3. **Components Not Using Configuration**
   - Verify component supports global configuration
   - Check component attribute priority
   - Ensure configuration system is initialized

### Debug Mode

Enable debug mode for detailed logging:

```javascript
WBGlobalConfig.override({
    development: {
        enableLogging: true,
        debugMode: true,
        logLevel: 'debug'
    }
});
```

## Migration Guide

If you're upgrading from a previous version or migrating from individual component configurations:

1. **Audit Current Configuration**: Document your current component settings
2. **Create Global Configuration**: Move common settings to global configuration
3. **Update Component Usage**: Remove redundant individual component settings
4. **Test Thoroughly**: Verify all components work with the new configuration system
5. **Update Documentation**: Update your project documentation

## Support

For issues, questions, or contributions related to the WB Global Configuration System:

- Check the troubleshooting section above
- Review the examples for common use cases
- Ensure you're using the latest version
- Validate your configuration against the schema