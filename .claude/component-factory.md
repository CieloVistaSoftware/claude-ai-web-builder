# Component Factory Documentation

## Overview

The Component Factory is a **data-driven component generator** that creates dynamic web components from JSON definitions. Instead of writing HTML, CSS, and JavaScript separately for each component, you define the component structure, styles, and behavior in a JSON file, and the factory generates the complete working component.

## What the Factory Does

### 🏭 **Core Factory Functions**

1. **Component Registration**: Register component definitions from JSON files
2. **Dynamic Generation**: Create HTML, CSS, and JavaScript from JSON specifications  
3. **Instance Management**: Track and manage component instances
4. **Dependency Loading**: Handle component dependencies automatically
5. **Event Handling**: Setup data-driven event listeners and actions
6. **Data Binding**: Support template interpolation and reactive data

### 🔧 **Factory Pattern Benefits**

- **Separation of Concerns**: Define structure, style, and behavior separately
- **Reusability**: One JSON definition creates unlimited instances
- **Consistency**: Standardized component creation process
- **Maintainability**: Change component behavior by updating JSON
- **Rapid Development**: No manual HTML/CSS/JS coding for each component

## Factory Architecture

### Core Classes

```javascript
window.ComponentFactory = {
    registry: new Map(),      // Component definitions storage
    instances: new Map(),     // Active component instances
    
    // Factory methods
    register(),              // Register a component definition
    create(),               // Create component from definition
    loadDefinition(),       // Load JSON definition files
    generateHTML(),         // Generate HTML from template
    generateCSS()           // Generate CSS from styles
}

class DataDrivenComponent {
    // Individual component instance
    // Handles initialization, rendering, events, lifecycle
}
```

### Component Definition Structure

A JSON component definition includes:

```json
{
  "component": {
    "name": "my-component",
    "version": "1.0.0",
    "dependencies": []
  },
  "template": {
    "structure": [/* HTML structure */]
  },
  "styles": {
    "base": {},
    "variants": {},
    "states": {},
    "responsive": {}
  },
  "handlers": {
    /* Event handlers */
  },
  "defaults": {
    "data": {},
    "state": "default"
  }
}
```

## How It Works

### 1. Component Registration

```javascript
// Load from JSON file
await ComponentFactory.loadDefinition('path/to/component.json');

// Or register directly
ComponentFactory.register(componentDefinition);
```

### 2. Component Creation

```javascript
// Create component instance
const component = await ComponentFactory.create('componentName', {
    data: { title: 'My Title' },
    variant: 'primary'
});

// Append to DOM
document.body.appendChild(component.element);
```

### 3. Template Generation

The factory processes JSON templates to generate HTML:

```json
{
  "template": {
    "structure": [
      {
        "tag": "div",
        "attributes": {
          "class": "component-wrapper"
        },
        "children": [
          {
            "tag": "h1",
            "content": "{{title}}"
          }
        ]
      }
    ]
  }
}
```

Becomes:
```html
<div class="component-wrapper">
  <h1>My Title</h1>
</div>
```

### 4. Style Generation

CSS is generated from JSON style definitions:

```json
{
  "styles": {
    "base": {
      "backgroundColor": "#fff",
      "padding": "16px"
    },
    "variants": {
      "primary": {
        "backgroundColor": "#007bff"
      }
    }
  }
}
```

Becomes:
```css
#component-123 {
  background-color: #fff;
  padding: 16px;
}

#component-123.primary {
  background-color: #007bff;
}
```

### 5. Event Handling

Events are defined declaratively:

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

## Advanced Features

### Data Binding and Interpolation

- **Template Variables**: `{{variableName}}` in templates
- **Conditional Rendering**: Show/hide elements based on data
- **Repeating Elements**: Loop through arrays to generate lists
- **CSS Variable Binding**: Dynamic style values

### State Management

```javascript
// Update component data
component.updateData({ title: 'New Title' });

// Change component state
component.setState('loading');
```

### Event System

```javascript
// Listen for component events
component.element.addEventListener('buttonClicked', (event) => {
    console.log('Button clicked!', event.detail);
});
```

### Dependency Management

Components can depend on other components:

```json
{
  "component": {
    "dependencies": ["button", "modal"]
  }
}
```

The factory automatically loads dependencies before creating the component.

## Real-World Usage Example

### 1. Define Component (button.json)

```json
{
  "component": {
    "name": "button",
    "version": "1.0.0"
  },
  "template": {
    "structure": [
      {
        "tag": "button",
        "attributes": {
          "class": "btn",
          "type": "{{type}}"
        },
        "content": "{{label}}"
      }
    ]
  },
  "styles": {
    "base": {
      "padding": "8px 16px",
      "border": "none",
      "borderRadius": "4px",
      "cursor": "pointer"
    },
    "variants": {
      "primary": {
        "backgroundColor": "#007bff",
        "color": "white"
      },
      "secondary": {
        "backgroundColor": "#6c757d",
        "color": "white"
      }
    }
  },
  "handlers": {
    "click": {
      "action": {
        "type": "dispatch",
        "payload": {
          "event": "clicked"
        }
      }
    }
  },
  "defaults": {
    "data": {
      "label": "Button",
      "type": "button"
    }
  }
}
```

### 2. Use Component

```javascript
// Load the definition
await ComponentFactory.loadDefinition('./components/button/button.json');

// Create instances
const primaryButton = await ComponentFactory.create('button', {
    data: { label: 'Save' },
    variant: 'primary'
});

const secondaryButton = await ComponentFactory.create('button', {
    data: { label: 'Cancel' },
    variant: 'secondary'
});

// Add to page
document.body.appendChild(primaryButton.element);
document.body.appendChild(secondaryButton.element);

// Listen for events
primaryButton.element.addEventListener('buttonClicked', () => {
    console.log('Save button clicked!');
});
```

## Factory vs Manual Component Creation

### Traditional Approach
```javascript
// Manual HTML
const button = document.createElement('button');
button.textContent = 'Save';
button.className = 'btn btn-primary';

// Manual CSS
const style = document.createElement('style');
style.textContent = `
  .btn { padding: 8px 16px; border: none; }
  .btn-primary { background: #007bff; color: white; }
`;

// Manual Events
button.addEventListener('click', handleClick);
```

### Factory Approach
```javascript
// JSON Definition (reusable)
const buttonDefinition = { /* JSON from above */ };

// One line creation
const button = await ComponentFactory.create('button', {
    data: { label: 'Save' },
    variant: 'primary'
});
```

## Benefits of This Factory Pattern

### 🚀 **Development Speed**
- Define once, create many instances
- No repetitive HTML/CSS/JS coding
- Automatic event binding and styling

### 📦 **Maintainability**
- Centralized component definitions
- Update JSON to change all instances
- Version control for component evolution

### 🔄 **Consistency**
- Standardized component structure
- Uniform styling and behavior
- Enforced design system patterns

### ⚡ **Dynamic Generation**
- Create components at runtime
- Data-driven component selection
- Conditional component loading

### 🧪 **Testability**
- JSON definitions are easily testable
- Mock different component variants
- Isolated component behavior

## Integration with Other Systems

### With Build Tools
```javascript
// Webpack can auto-load all JSON definitions
const components = require.context('./components', true, /\.json$/);
components.keys().forEach(key => {
    ComponentFactory.register(components(key));
});
```

### With State Management
```javascript
// Redux integration
store.subscribe(() => {
    const state = store.getState();
    component.updateData(state.componentData);
});
```

### With Design Systems
```json
{
  "styles": {
    "base": {
      "color": "var(--primary-color)",
      "fontSize": "var(--font-size-base)"
    }
  }
}
```

## Performance Considerations

### Lazy Loading
- Load component definitions on demand
- Only generate CSS when components are created
- Cleanup unused components automatically

### Caching
- Component definitions cached in memory
- Generated CSS reused across instances
- DOM templates cached for repeated creation

### Memory Management
```javascript
// Proper cleanup
component.destroy(); // Removes events, styles, DOM elements
```

## Conclusion

The Component Factory represents a **paradigm shift** from imperative component creation to **declarative component definition**. By describing what components should look like and how they should behave in JSON, rather than how to build them in code, we achieve:

- **Higher productivity** through code generation
- **Better consistency** through standardized patterns  
- **Easier maintenance** through centralized definitions
- **Greater flexibility** through data-driven architecture

This factory pattern is particularly powerful for:
- **Design systems** with many similar components
- **Dynamic UIs** that need runtime component generation
- **Content management** systems with configurable layouts
- **Rapid prototyping** of component variations

The factory abstracts away the complexity of manual DOM manipulation, event handling, and style management, allowing developers to focus on component logic and user experience rather than implementation details.