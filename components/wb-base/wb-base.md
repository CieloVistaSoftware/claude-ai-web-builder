# WB Base Component

## Overview
`WBBaseComponent` is the foundational base class for all WB Web Components. It provides essential functionality that all components inherit, including lifecycle management, event handling, logging, styling, and theming support.

## Key Features

### 🎯 Shadow DOM Support
- Automatic Shadow DOM attachment (opt-in/opt-out)
- Auto-loading of component stylesheets
- Encapsulated component styles

### 🎨 Built-in Theme Support
- Automatic dark mode support
- Theme change event handling
- Consistent theming across all components

### 📝 Event Logging System
- Structured logging (info, warning, error, debug)
- Integration with WB Event Log component
- Fallback to console logging

### 🔥 Event System
- Easy custom event dispatching
- Bubbling and composed events by default
- Consistent event naming conventions

### 🔧 Lifecycle Hooks
- `connectedCallback()` - Component mounted
- `disconnectedCallback()` - Component unmounted
- `attributeChangedCallback()` - Attribute changes

### 📦 Utility Methods
- Attribute reflection helpers
- Slot content management
- Markdown rendering support
- Schema loading capabilities

## Basic Usage

```javascript
import { WBBaseComponent } from '../wb-base/wb-base.js';

class MyComponent extends WBBaseComponent {
    static useShadow = true;
    static styleUrl = './my-component.css';
    
    constructor() {
        super();
        this.render();
    }
    
    connectedCallback() {
        super.connectedCallback();
        this.logInfo('Component connected');
    }
    
    render() {
        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <div class="container">
                <h1>Hello World</h1>
            </div>
        `;
    }
}

customElements.define('my-component', MyComponent);
```

## Logging

```javascript
class MyComponent extends WBBaseComponent {
    someMethod() {
        this.logInfo('Operation started');
        this.logError('Something went wrong', { code: 'ERR_001' });
        this.logDebug('Debug information', { data: {...} });
    }
}
```

## Event System

```javascript
class MyComponent extends WBBaseComponent {
    handleClick() {
        // Fire a custom event
        this.fireEvent('wb:item-selected', {
            itemId: 123,
            timestamp: Date.now()
        });
    }
}
```

## Shadow DOM Configuration

```javascript
// Enable Shadow DOM (default)
class MyComponent extends WBBaseComponent {
    static useShadow = true;
    static styleUrl = './my-component.css';
}

// Disable Shadow DOM
class MyComponent extends WBBaseComponent {
    static useShadow = false;
}
```

## Attribute Management

```javascript
class MyComponent extends WBBaseComponent {
    static get observedAttributes() {
        return ['title', 'active'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (name === 'title') {
            this.render();
        }
    }
    
    get title() {
        return this.getAttr('title', 'Default Title');
    }
    
    set title(value) {
        this.setAttr('title', value);
    }
}
```

## Slot Management

```javascript
class MyComponent extends WBBaseComponent {
    render() {
        // Check if slot is empty
        if (this.isSlotEmpty('header')) {
            // Provide default content
        }
        
        // Get slot nodes
        const nodes = this.getSlotNodes('content');
    }
}
```

## Static Methods

```javascript
// Register component
WBBaseComponent.register('my-component');

// Static logging
WBBaseComponent.logEvent('Global event', 'info');

// Get event log
const events = WBBaseComponent.getEventLog();
```

## Properties & Methods

### Static Properties
- `styleUrl` - URL to component stylesheet
- `useShadow` - Enable/disable Shadow DOM
- `schemaUrl` - URL to component schema
- `componentName` - Component name
- `version` - Component version

### Instance Methods
- `fireEvent(name, detail)` - Dispatch custom event
- `logInfo(msg, ctx)` - Log info message
- `logError(msg, ctx)` - Log error message
- `logDebug(msg, ctx)` - Log debug message
- `reportError(error, context)` - Report error with context
- `setAttr(name, value)` - Set attribute
- `getAttr(name, default)` - Get attribute
- `getSlotNodes(name)` - Get slot nodes
- `isSlotEmpty(name)` - Check if slot is empty
- `getCurrentTheme()` - Get current theme
- `loadSchema()` - Load component schema

## Best Practices

1. **Always call super()** in lifecycle methods
2. **Use logging** for debugging and monitoring
3. **Fire events** for component communication
4. **Set useShadow** appropriately for your needs
5. **Use styleUrl** for component styles
6. **Handle errors** with reportError()

## File Structure
```
wb-base/
├── wb-base.js              # Base class implementation
├── wb-base.css             # Base styles (optional)
├── wb-base-demo.html       # Demo page
├── wb-base-demo.css        # Demo styles
├── wb-base.md              # This documentation
└── wb-base.schema.json     # Component schema (optional)
```

## Browser Support
- Modern browsers with Web Components support
- ES6+ required
- Shadow DOM v1 API

## Version
1.0.0

## License
MIT

---

**Note:** This is the foundation for all WB components. Every WB component should extend `WBBaseComponent` to inherit these capabilities.
