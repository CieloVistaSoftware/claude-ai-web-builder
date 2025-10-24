# WB Component Utils Documentation

## Overview

`WBComponentUtils` is a comprehensive utility library providing shared functionality for Website Builder components. It follows a composition over inheritance pattern, offering modular utilities for CSS loading, configuration management, path detection, event handling, DOM manipulation, and more.

## Features

- **CSS Loading**: Automatic stylesheet loading with duplicate prevention
- **Configuration Management**: JSON-based configuration loading with fallbacks
- **Path Detection**: Smart path resolution for component resources
- **Event System**: Standardized event dispatching and handling
- **DOM Utilities**: Element creation, ID generation, and manipulation
- **Color Utilities**: Comprehensive color conversion and manipulation
- **Storage Management**: localStorage with quota management and cleanup
- **Validation**: Input validation with customizable rules
- **Symbol Registry**: Compiler-like symbol resolution for component paths

## Module Structure

The utility library is organized into specialized modules:

- **CSSLoader**: Stylesheet loading and management
- **ConfigLoader**: Configuration file handling
- **PathDetector**: Component path detection
- **EventDispatcher**: Custom event handling
- **DOMUtils**: DOM manipulation utilities
- **ColorUtils**: Color conversion and parsing
- **StorageUtils**: localStorage management
- **InitUtils**: Component initialization helpers
- **ValidationUtils**: Input validation
- **SymbolRegistry**: Path resolution system

## CSS Loading Module

### `loadComponentCSS(componentName, cssPath, skipDuplicateCheck)`

Load CSS files for components with automatic duplicate prevention.

```javascript
// Load component CSS
WBComponentUtils.loadCSS('wb-button', '/components/wb-button/wb-button.css');

// Skip duplicate check if needed
WBComponentUtils.CSSLoader.loadComponentCSS('wb-modal', '/path/to/modal.css', true);
```

**Features:**
- Automatic duplicate detection
- Error handling with console warnings
- Success confirmation logging
- Performance optimization through caching

### `isCSSLoaded(componentName)`

Check if CSS is already loaded for a component.

```javascript
if (!WBComponentUtils.CSSLoader.isCSSLoaded('wb-dropdown')) {
    // Load CSS if not already present
    WBComponentUtils.loadCSS('wb-dropdown', '/components/wb-dropdown/wb-dropdown.css');
}
```

## Configuration Management

### `loadConfig(configPath, fallbackConfig, componentName)`

Load JSON configuration with automatic fallback handling.

```javascript
// Load component configuration
const config = await WBComponentUtils.loadConfig(
    '/components/wb-slider/wb-slider.json',
    { min: 0, max: 100, step: 1 },  // Fallback config
    'wb-slider'
);

// Use configuration
const slider = new WBSlider(config);
```

**Features:**
- HTTP-based loading (uses fetch API)
- Automatic fallback to default configuration
- Error handling with detailed logging
- JSON parsing with validation

### `mergeConfig(config, defaults)`

Merge user configuration with defaults.

```javascript
const userConfig = { theme: 'dark', showLabels: true };
const defaults = { theme: 'light', showLabels: false, animate: true };
const finalConfig = WBComponentUtils.ConfigLoader.mergeConfig(userConfig, defaults);
// Result: { theme: 'dark', showLabels: true, animate: true }
```

## Path Detection

### `getComponentPath(scriptFileName, fallbackPath)`

Detect component directory paths from script sources.

```javascript
// Detect path for current component
const componentPath = WBComponentUtils.getPath('wb-calendar.js');
// Returns: '/components/wb-calendar/'

// With custom fallback
const path = WBComponentUtils.PathDetector.getComponentPath('wb-charts.js', '/custom/components/');
```

**Detection Methods:**
1. **Exact Match**: Looks for exact script filename in document
2. **Base Match**: Matches without file extension
3. **Path Inference**: Infers from current document location
4. **Fallback**: Uses provided fallback path

### `getComponentFilePath(scriptFileName, targetFileName, fallbackPath)`

Get full path to specific component files.

```javascript
// Get path to component CSS file
const cssPath = WBComponentUtils.PathDetector.getComponentFilePath(
    'wb-button.js',     // Current script
    'wb-button.css',    // Target file
    '/components/'      // Fallback base path
);
```

## Event System

### `dispatch(eventName, detail, target, options)`

Dispatch custom events with standardized format.

```javascript
// Basic event dispatch
WBComponentUtils.dispatch('wb:component-ready', {
    component: 'wb-slider',
    value: 50
});

// Advanced event with custom target and options
WBComponentUtils.EventDispatcher.dispatch('wb:value-changed', {
    oldValue: 25,
    newValue: 75,
    component: 'wb-range-slider'
}, document.getElementById('slider-container'), {
    bubbles: false,
    cancelable: true
});
```

### Pre-built Event Dispatchers

```javascript
// Component ready event
WBComponentUtils.EventDispatcher.dispatchReady('wb-calendar', config);

// Component change event  
WBComponentUtils.EventDispatcher.dispatchChange('wb-input', newValue, inputElement, {
    source: 'user-input',
    validation: 'passed'
});
```

## DOM Utilities

### `createElement(tagName, attributes, content)`

Create DOM elements with attributes and content.

```javascript
// Create simple element
const button = WBComponentUtils.createElement('button', {
    class: 'wb-button wb-button--primary',
    'data-action': 'submit',
    disabled: false
}, 'Click Me');

// Create complex element with nested content
const container = WBComponentUtils.createElement('div', {
    class: 'component-container',
    id: 'slider-wrapper'
}, [
    'Label: ',
    WBComponentUtils.createElement('span', { class: 'value' }, '50'),
    WBComponentUtils.createElement('input', { type: 'range', min: 0, max: 100 })
]);
```

### `generateId(prefix)`

Generate unique IDs for elements.

```javascript
const uniqueId = WBComponentUtils.generateId('wb-modal');
// Returns: 'wb-modal-a7c8f9d2e'

const formId = WBComponentUtils.generateId('form-section');
// Returns: 'form-section-x9k2m5p8q'
```

### `addEventListeners(element, events)`

Add multiple event listeners efficiently.

```javascript
const button = document.getElementById('my-button');
WBComponentUtils.DOMUtils.addEventListeners(button, {
    click: () => console.log('Clicked'),
    mouseenter: () => console.log('Mouse entered'),
    mouseleave: () => console.log('Mouse left'),
    keydown: (e) => {
        if (e.key === 'Enter') console.log('Enter pressed');
    }
});
```

### `getFocusableElements(container)`

Get all focusable elements within a container.

```javascript
const modal = document.getElementById('modal');
const focusableElements = WBComponentUtils.DOMUtils.getFocusableElements(modal);

// Tab trap implementation
focusableElements[0].focus(); // Focus first element
```

## Color Utilities

### Color Conversion

```javascript
// HSL to HEX conversion
const hexColor = WBComponentUtils.ColorUtils.hslToHex(240, 100, 50);
// Returns: '#0000ff'

// HEX to HSL conversion
const hslColor = WBComponentUtils.ColorUtils.hexToHsl('#ff0000');
// Returns: { h: 0, s: 100, l: 50 }

// Parse any color format
const rgbColor = WBComponentUtils.ColorUtils.parseColor('hsl(120, 100%, 50%)');
// Returns: { r: 0, g: 255, b: 0, a: 1 }
```

### Color Parsing

```javascript
// Parse different color formats
const colors = [
    '#ff5733',                    // HEX
    'rgb(255, 87, 51)',          // RGB
    'rgba(255, 87, 51, 0.8)',    // RGBA
    'hsl(9, 100%, 60%)',         // HSL
    'hsla(9, 100%, 60%, 0.8)'    // HSLA
];

colors.forEach(color => {
    const parsed = WBComponentUtils.ColorUtils.parseColor(color);
    console.log(`${color} -> R:${parsed.r} G:${parsed.g} B:${parsed.b} A:${parsed.a}`);
});
```

## Storage Management

### `save(key, value, componentName)`

Save data to localStorage with quota management.

```javascript
// Save component state
const success = WBComponentUtils.StorageUtils.save(
    'wb-slider-state',
    { value: 75, min: 0, max: 100 },
    'wb-slider'
);

if (success) {
    console.log('State saved successfully');
} else {
    console.warn('Failed to save state - quota exceeded or other error');
}
```

### `load(key, defaultValue, componentName)`

Load data with error handling and defaults.

```javascript
// Load component state with fallback
const sliderState = WBComponentUtils.StorageUtils.load(
    'wb-slider-state',
    { value: 50, min: 0, max: 100 },  // Default if not found
    'wb-slider'
);

// Use loaded state
const slider = new WBSlider(sliderState);
```

### Quota Management

```javascript
// Check storage usage
const stats = WBComponentUtils.StorageUtils.getUsageStats();
console.log(`Storage usage: ${stats.usagePercent}% (${stats.totalSize} bytes)`);

if (stats.usagePercent > 80) {
    console.warn('Storage quota nearly full');
    // Perform cleanup if needed
    WBComponentUtils.StorageUtils.performQuotaCleanup();
}
```

## Validation System

### Built-in Validators

```javascript
const ValidationUtils = WBComponentUtils.ValidationUtils;

// Available validators
const validators = {
    required: true,
    email: true,
    url: true,
    phone: true,
    minLength: 5,
    maxLength: 50,
    pattern: '^[A-Za-z]+$',
    number: true
};
```

### `validate(value, rules)`

Validate input against multiple rules.

```javascript
// Validate email field
const emailValidation = WBComponentUtils.validate('user@example.com', {
    required: true,
    email: true,
    maxLength: 100
});

if (emailValidation.isValid) {
    console.log('Email is valid');
} else {
    console.error('Validation error:', emailValidation.message);
}

// Validate complex input
const passwordValidation = WBComponentUtils.validate('myPassword123', {
    required: true,
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$'
});
```

### Custom Validation Messages

```javascript
// Get specific validation message
const message = ValidationUtils.getValidationMessage('minLength', 8);
// Returns: "Minimum 8 characters required"
```

## Symbol Registry

### Path Resolution System

The Symbol Registry provides compiler-like symbol resolution for component paths.

```javascript
// Register symbols
WBComponentUtils.SymbolRegistry.register('wb.calendar.js', 'components/wb-calendar/wb-calendar.js');
WBComponentUtils.SymbolRegistry.register('wb.modal.css', 'components/wb-modal/wb-modal.css');

// Resolve symbols
const calendarPath = WBComponentUtils.resolve('wb.calendar.js');
// Returns: '/components/wb-calendar/wb-calendar.js'

const modalCSS = WBComponentUtils.resolve('wb.modal.css');
// Returns: '/components/wb-modal/wb-modal.css'
```

### Component Base Paths

```javascript
// Get component base directory
const basePath = WBComponentUtils.SymbolRegistry.getComponentBase('wb.calendar.js');
// Returns: '/components/wb-calendar/'
```

### Cache Management

```javascript
// Get cache statistics
const cacheStats = WBComponentUtils.SymbolRegistry.getCacheStats();
console.log(`Cache hit ratio: ${cacheStats.hitRatio}`);
console.log(`Cache size: ${cacheStats.size} entries`);

// Clear cache for testing
WBComponentUtils.SymbolRegistry.clearCache();
```

## Initialization Utilities

### `onDOMReady(callback)`

Execute code when DOM is ready.

```javascript
WBComponentUtils.onReady(() => {
    console.log('DOM is ready, initializing components...');
    
    // Initialize components
    const components = document.querySelectorAll('[data-wb-component]');
    components.forEach(element => {
        const componentType = element.dataset.wbComponent;
        // Initialize specific component type
    });
});
```

### `waitForComponent(componentId, timeout)`

Wait for specific component to appear in DOM.

```javascript
// Wait for component to be added to DOM
try {
    const calendar = await WBComponentUtils.waitForComponent('main-calendar', 10000);
    console.log('Calendar component is ready:', calendar);
    
    // Safe to interact with component
    calendar.setDate(new Date());
} catch (error) {
    console.error('Calendar component not found:', error);
    // Show fallback UI
}
```

## Global API

### Convenience Methods

```javascript
// Direct access to common utilities
WBComponentUtils.loadCSS(componentName, cssPath);
WBComponentUtils.loadConfig(configPath, fallback, componentName);
WBComponentUtils.getPath(scriptName, fallback);
WBComponentUtils.resolve(symbol);
WBComponentUtils.register(symbol, path);
WBComponentUtils.dispatch(eventName, detail);
WBComponentUtils.createElement(tag, attrs, content);
WBComponentUtils.generateId(prefix);
WBComponentUtils.onReady(callback);
WBComponentUtils.waitForComponent(id, timeout);
WBComponentUtils.validate(value, rules);
```

### Version Information

```javascript
// Get utility information
const info = WBComponentUtils.getInfo();
console.log(`WB Component Utils v${info.version}`);
console.log('Available modules:', info.modules);
console.log('Loaded at:', info.loadedAt);
```

## Advanced Usage Examples

### Component Factory Pattern

```javascript
async function createComponent(type, config = {}) {
    try {
        // Load component CSS
        WBComponentUtils.loadCSS(type, `/components/${type}/${type}.css`);
        
        // Load component configuration
        const componentConfig = await WBComponentUtils.loadConfig(
            `/components/${type}/${type}.json`,
            config,
            type
        );
        
        // Create component element
        const element = WBComponentUtils.createElement(type, {
            id: WBComponentUtils.generateId(type),
            class: componentConfig.classes?.base || type
        });
        
        // Dispatch ready event
        WBComponentUtils.dispatch(`${type}:created`, {
            element,
            config: componentConfig
        });
        
        return element;
    } catch (error) {
        console.error(`Failed to create ${type} component:`, error);
        return null;
    }
}

// Usage
const button = await createComponent('wb-button', { variant: 'primary' });
if (button) {
    document.body.appendChild(button);
}
```

### State Management Integration

```javascript
class ComponentStateManager {
    constructor(componentName) {
        this.componentName = componentName;
        this.storageKey = `${componentName}-state`;
    }
    
    saveState(state) {
        return WBComponentUtils.StorageUtils.save(
            this.storageKey,
            state,
            this.componentName
        );
    }
    
    loadState(defaultState = {}) {
        return WBComponentUtils.StorageUtils.load(
            this.storageKey,
            defaultState,
            this.componentName
        );
    }
    
    clearState() {
        return WBComponentUtils.StorageUtils.remove(
            this.storageKey,
            this.componentName
        );
    }
}

// Usage
const stateManager = new ComponentStateManager('wb-calendar');
const savedState = stateManager.loadState({ selectedDate: new Date() });
```

## Performance Considerations

### CSS Loading Optimization

```javascript
// Batch CSS loading for multiple components
const components = ['wb-button', 'wb-input', 'wb-modal'];
components.forEach(component => {
    if (!WBComponentUtils.CSSLoader.isCSSLoaded(component)) {
        WBComponentUtils.loadCSS(component, `/components/${component}/${component}.css`);
    }
});
```

### Memory Management

```javascript
// Monitor storage usage
function monitorStorageUsage() {
    const stats = WBComponentUtils.StorageUtils.getUsageStats();
    
    if (stats.usagePercent > 90) {
        console.warn('Storage nearly full, cleaning up...');
        WBComponentUtils.StorageUtils.performQuotaCleanup();
    }
    
    return stats;
}

// Run periodically
setInterval(monitorStorageUsage, 300000); // Every 5 minutes
```

## Error Handling Best Practices

### Graceful Degradation

```javascript
async function initializeComponentWithFallback(componentName) {
    try {
        // Try to load component configuration
        const config = await WBComponentUtils.loadConfig(
            `/components/${componentName}/${componentName}.json`,
            null, // No fallback initially
            componentName
        );
        
        if (!config) {
            throw new Error('Configuration not available');
        }
        
        return config;
    } catch (error) {
        console.warn(`Failed to load ${componentName} config, using minimal defaults:`, error);
        
        // Return minimal working configuration
        return {
            classes: { base: componentName },
            attributes: {},
            options: {}
        };
    }
}
```

## Browser Support

- **ES6+ Required**: Async/await, Promises, Classes
- **DOM APIs**: fetch, localStorage, CustomEvent
- **Modern Features**: MutationObserver, FileReader
- **Optional Features**: Web Components (for component registration)

## Related Documentation

- [WB Component Base](wb-component-base.md)
- [WB Component Registry](wb-component-registry.md)
- [WB Status Service](wb-status-service.md)
- [Component Architecture Guide](../../docs/component-architecture.md)