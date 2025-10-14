# WB Component Base Class Documentation

## Overview

`WBComponentBase` is the foundational base class for all Website Builder components. It provides a unified architecture that consolidates common functionality to reduce code duplication and ensure consistent behavior across all WB components.

## Features

- **Automatic Initialization**: Components self-initialize with dependency resolution
- **Configuration Management**: JSON-based configuration loading with fallbacks
- **CSS Loading**: Automatic stylesheet loading and management
- **Event System**: Built-in event dispatch and listener management
- **Lifecycle Management**: Complete component lifecycle with cleanup
- **Path Resolution**: Smart path detection for resources
- **Utils Integration**: Seamless integration with WBComponentUtils

## Basic Usage

```javascript
// Extend WBComponentBase for your component
class WBButton extends WBComponentBase {
    constructor() {
        super('wb-button', {
            // Fallback configuration
            classes: {
                base: 'wb-button',
                variants: {
                    primary: 'wb-button--primary',
                    secondary: 'wb-button--secondary'
                }
            }
        });
    }
    
    // Override to implement component-specific logic
    async initializeComponent() {
        this.element = this.createElement('button', {
            class: this.getClass('base'),
            id: this.generateId()
        });
        
        // Add component-specific functionality
        this.setupButton();
    }
}
```

## Constructor Options

```javascript
new WBComponentBase(componentName, fallbackConfig, options)
```

### Parameters

- **componentName** (string): Component identifier (e.g., 'wb-button')
- **fallbackConfig** (Object): Default configuration object if JSON config fails to load
- **options** (Object): Component initialization options

### Available Options

```javascript
{
    autoInitialize: true,   // Auto-initialize on creation
    loadCSS: true,         // Load component CSS file
    loadConfig: true       // Load JSON configuration
}
```

## Core Methods

### Initialization

```javascript
// Initialize the component (called automatically if autoInitialize: true)
await component.initialize();

// Override in child classes for component-specific setup
async initializeComponent() {
    // Your component initialization code here
}
```

### Configuration

```javascript
// Get configuration value with dot notation
const buttonClass = component.getConfig('classes.base', 'default-class');

// Get CSS class from configuration
const primaryClass = component.getClass('variants.primary', 'fallback-class');

// Apply classes to element
component.applyClasses(element, ['class1', 'class2']);
```

### Element Creation

```javascript
// Create element with attributes and content
const button = component.createElement('button', {
    class: 'wb-button',
    'data-variant': 'primary'
}, 'Click me');

// Generate unique ID
const uniqueId = component.generateId('button'); // Returns: button-abc123def
```

### Event Management

```javascript
// Add event listener with automatic tracking
component.addEventListener(button, 'click', handleClick);

// Remove event listener
component.removeEventListener(button, 'click', handleClick);

// Dispatch custom events
component.dispatch('wb:button-clicked', {
    value: 'button-value',
    timestamp: Date.now()
});

// Dispatch component-specific events
component.dispatchChange('new-value', { additionalData: 'here' });
component.dispatchReady(); // Called automatically after initialization
```

### Lifecycle Management

```javascript
// Check component status
const info = component.getInfo();
console.log(info);
// {
//     name: 'wb-button',
//     initialized: true,
//     hasElement: true,
//     hasConfig: true,
//     listenerCount: 3,
//     version: '1.0.0'
// }

// Clean up component
component.destroy();
```

## File Structure Integration

WBComponentBase automatically handles the standard WB component file structure:

```
components/
├── wb-button/
│   ├── wb-button.js      # Component implementation
│   ├── wb-button.css     # Component styles
│   ├── wb-button.json    # Configuration file
│   └── wb-button.md      # Documentation
```

### Automatic Path Resolution

- **CSS Path**: `components/wb-button/wb-button.css`
- **Config Path**: `components/wb-button/wb-button.json`
- **Utils Path**: `utils/wb/wb-component-utils.js`

## Event System

### Standard Events

All components automatically dispatch these events:

- **`{componentName}Ready`**: Fired when component initialization completes
- **`{componentName}Change`**: Fired when component value changes

### Event Data Structure

```javascript
{
    component: 'wb-button',    // Component name
    element: buttonElement,    // Component DOM element
    timestamp: 1634567890123,  // Event timestamp
    value: 'button-value',     // Component value (for change events)
    // ... additional event-specific data
}
```

## Advanced Usage

### Custom Configuration Loading

```javascript
class WBCustomButton extends WBComponentBase {
    constructor() {
        super('wb-custom-button', {
            // Comprehensive fallback config
            classes: {
                base: 'wb-custom-button',
                states: {
                    active: 'wb-custom-button--active',
                    disabled: 'wb-custom-button--disabled'
                }
            },
            attributes: {
                role: 'button',
                tabindex: '0'
            }
        }, {
            autoInitialize: false  // Manual initialization
        });
    }
    
    async initializeComponent() {
        // Create button with configuration
        this.element = this.createElement('button', {
            class: this.getClass('base'),
            role: this.getConfig('attributes.role'),
            tabindex: this.getConfig('attributes.tabindex')
        });
        
        // Setup custom functionality
        this.setupCustomBehavior();
    }
}
```

### Manual Initialization

```javascript
const button = new WBCustomButton();
// Component created but not initialized

// Initialize when ready
await button.initialize();
```

### Error Handling

```javascript
try {
    const component = new WBButton();
    await component.initialize();
} catch (error) {
    console.error('Component initialization failed:', error);
    // Handle gracefully with fallback UI
}
```

## Best Practices

### 1. Use Configuration-Driven Design

```javascript
// Good: Use configuration for classes
const buttonClass = this.getClass('variants.primary');

// Avoid: Hardcoded classes
const buttonClass = 'wb-button wb-button--primary';
```

### 2. Leverage Event System

```javascript
// Good: Dispatch events for component changes
this.dispatchChange(newValue, { source: 'user-interaction' });

// Avoid: Direct callback execution
this.options.onChange?.(newValue);
```

### 3. Clean Resource Management

```javascript
// Good: Use tracked event listeners
this.addEventListener(element, 'click', this.handleClick.bind(this));

// Avoid: Untracked listeners (memory leaks)
element.addEventListener('click', this.handleClick.bind(this));
```

### 4. Fallback Configuration

```javascript
// Good: Provide comprehensive fallbacks
const fallbackConfig = {
    classes: { base: 'wb-component' },
    attributes: { role: 'widget' },
    options: { autoClose: true }
};

// Avoid: Empty or minimal fallbacks
const fallbackConfig = {};
```

## Dependencies

- **WBComponentUtils**: Core utility functions
- **Component Schema**: JSON configuration files
- **CSS Files**: Component stylesheets

## Browser Support

- **Modern Browsers**: Full ES6+ support required
- **Custom Elements**: Web Components API support
- **Promises**: Async/await support
- **DOM APIs**: MutationObserver, CustomEvent

## Version History

- **v1.0.0**: Initial release with core functionality
  - Base class architecture
  - Configuration management
  - Event system
  - Lifecycle management
  - Path resolution
  - Utils integration

## Related Documentation

- [WB Component Utils](wb-component-utils.md)
- [WB Component Standards](../../docs/wb-component-standards.md)
- [Component Architecture Guide](../../docs/component-architecture.md)

## Example Components

See these components for WBComponentBase usage examples:

- `components/wb-button/wb-button.js`
- `components/wb-toggle/wb-toggle.js`
- `components/wb-select/wb-select.js`