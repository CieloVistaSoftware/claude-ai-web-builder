# Data-Driven Component System

---
*Last Updated: 2025-09-29*
*Version: 1.0.0*
*Author: Claude Code Assistant*
*Status: Current - Data-driven component architecture*
---

## Overview

The Website Builder now supports fully data-driven components that can be created from JSON definitions. This system allows you to:

- **Define components entirely in JSON** - structure, styling, behavior, and validation
- **Generate components at runtime** - no build process required
- **Update components dynamically** - change the JSON, change the component
- **Create consistent UI** - all components follow the same patterns

## Quick Start

### 1. Include the Component Factory

```html
<script src="components/component-factory.js"></script>
```

### 2. Define a Component in JSON

```json
{
  "component": {
    "name": "my-component",
    "version": "1.0.0"
  },
  "template": {
    "structure": [{
      "tag": "div",
      "content": "{{message}}"
    }]
  },
  "defaults": {
    "data": {
      "message": "Hello World!"
    }
  }
}
```

### 3. Create the Component

```javascript
// Register the definition
ComponentFactory.register(myComponentDefinition);

// Create an instance
const component = await ComponentFactory.create('my-component', {
  data: { message: 'Custom message' }
});

// Add to page
document.body.appendChild(component.element);
```

## JSON Schema Structure

### Component Definition

```json
{
  "component": {
    "name": "component-name",
    "version": "1.0.0",
    "description": "Component description",
    "type": "ui-component",
    "dependencies": ["other-component"],
    "assets": []
  }
}
```

### Template Structure

The template defines the HTML structure with data binding:

```json
{
  "template": {
    "structure": [
      {
        "tag": "div",
        "attributes": {
          "class": "my-class",
          "id": { "bind": { "data": "elementId" } }
        },
        "content": "{{dynamicContent}}",
        "children": [],
        "condition": {
          "field": "showElement",
          "operator": "truthy"
        },
        "repeat": {
          "collection": "items",
          "item": "item"
        }
      }
    ]
  }
}
```

### Styling

Define component styles with variants and responsive behavior:

```json
{
  "styles": {
    "base": {
      "display": "flex",
      "padding": "1rem"
    },
    "variants": {
      "primary": {
        "backgroundColor": "var(--primary)"
      }
    },
    "states": {
      "hover": {
        "transform": "scale(1.05)"
      }
    },
    "responsive": {
      "(max-width: 640px)": {
        "padding": "0.5rem"
      }
    }
  }
}
```

### Event Handlers

Define component behavior:

```json
{
  "handlers": {
    "click": {
      "selector": ".button",
      "action": {
        "type": "dispatch",
        "payload": {
          "event": "buttonClicked"
        }
      }
    }
  }
}
```

### Data Binding

- **Text Interpolation**: `{{fieldName}}`
- **Attribute Binding**: `{ "bind": { "data": "fieldName" } }`
- **CSS Variable Binding**: `{ "bind": { "cssVariable": "varName" } }`
- **Configuration Binding**: `{ "bind": { "config": "configKey" } }`

### Conditional Rendering

```json
{
  "condition": {
    "field": "isVisible",
    "operator": "truthy"
  }
}
```

Operators: `equals`, `notEquals`, `exists`, `notExists`, `truthy`, `falsy`

### Repeating Elements

```json
{
  "repeat": {
    "collection": "items",
    "item": "item"
  }
}
```

## Action Types

### Update Data
```json
{
  "type": "updateData",
  "payload": {
    "field": "value"
  }
}
```

### Set State
```json
{
  "type": "setState",
  "payload": {
    "state": "active"
  }
}
```

### Dispatch Event
```json
{
  "type": "dispatch",
  "payload": {
    "event": "customEvent",
    "data": {}
  }
}
```

### Call Method
```json
{
  "type": "method",
  "payload": {
    "method": "customMethod",
    "args": ["arg1", "arg2"]
  }
}
```

## Examples

### Simple Button Component

```json
{
  "component": {
    "name": "simple-button",
    "version": "1.0.0"
  },
  "template": {
    "structure": [{
      "tag": "button",
      "attributes": {
        "class": "btn btn-{{variant}}"
      },
      "content": "{{label}}"
    }]
  },
  "styles": {
    "base": {
      "padding": "0.5rem 1rem",
      "border": "none",
      "borderRadius": "4px",
      "cursor": "pointer"
    }
  },
  "handlers": {
    "click": {
      "action": {
        "type": "dispatch",
        "payload": { "event": "buttonClick" }
      }
    }
  },
  "defaults": {
    "data": {
      "label": "Click Me",
      "variant": "primary"
    }
  }
}
```

### List Component with Repeat

```json
{
  "component": {
    "name": "item-list",
    "version": "1.0.0"
  },
  "template": {
    "structure": [{
      "tag": "ul",
      "children": [{
        "tag": "li",
        "content": "{{item.name}} - {{item.value}}",
        "repeat": {
          "collection": "items",
          "item": "item"
        }
      }]
    }]
  },
  "defaults": {
    "data": {
      "items": [
        { "name": "Item 1", "value": "$10" },
        { "name": "Item 2", "value": "$20" }
      ]
    }
  }
}
```

## Component API

### Creating Components

```javascript
// From registered definition
const component = await ComponentFactory.create('component-name', {
  data: { /* initial data */ },
  variant: 'primary'
});

// From JSON file
await ComponentFactory.loadDefinition('path/to/component.json');
const component = await ComponentFactory.create('component-name');
```

### Component Instance Methods

```javascript
// Update component data
component.updateData({ field: 'new value' });

// Change component state
component.setState('active');

// Dispatch custom event
component.dispatchEvent('customEvent', { detail: 'data' });

// Destroy component
component.destroy();
```

### Component Events

```javascript
// Listen for component events
component.element.addEventListener('componentReady', (e) => {
  console.log('Component ready:', e.detail);
});

component.element.addEventListener('stateChanged', (e) => {
  console.log('New state:', e.detail.state);
});
```

## Best Practices

1. **Keep Definitions Simple** - Break complex components into smaller parts
2. **Use CSS Variables** - Leverage the existing theme system
3. **Follow Naming Conventions** - Use consistent naming for components and events
4. **Validate Data** - Include validation rules in your definitions
5. **Document Examples** - Provide example configurations in your JSON

## Migration Guide

To convert existing components to data-driven:

1. **Extract Structure** - Move HTML to template.structure
2. **Extract Styles** - Move CSS to styles object
3. **Extract Behavior** - Convert event listeners to handlers
4. **Define Data** - Identify dynamic content and create data fields
5. **Test Thoroughly** - Ensure all functionality is preserved

## Future Enhancements

- Visual component designer
- Component composition/nesting
- Advanced validation rules
- Component marketplace
- TypeScript definitions
- Performance optimizations

## Support

For questions or issues with data-driven components:
- Check the demo at `components/data-driven-demo.html`
- Review existing definitions in `components/`
- Refer to the Component Factory source code