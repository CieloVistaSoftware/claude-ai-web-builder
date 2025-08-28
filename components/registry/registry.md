# Component Registry System

## Overview

The Component Registry is a central system for registering, discovering, and managing web components in the ClaudeAIWebSiteBuilder project. It provides a consistent way to catalog components, making them easily discoverable and reusable across the application.

## Features

- Central registration of all web components
- Component metadata for discovery and documentation
- Component categorization and tagging
- Search and filter capabilities
- UI for browsing available components
- Component versioning support

## Architecture

The registry system consists of two main parts:

1. **Component Registry** (`component-registry.js`) - The core registration system that manages component definitions
2. **Component Catalog** (`component-catalog.js`) - A UI component for discovering and browsing available components

## Usage

### Registering a Component

```javascript
// Import the registry
import { componentRegistry } from '../registry/component-registry.js';

// Define your component
class MyCustomComponent extends HTMLElement {
  // Component implementation
}

// Register with browser
customElements.define('my-component', MyCustomComponent);

// Register with the component registry
componentRegistry.register({
  name: 'my-component',
  displayName: 'My Component',
  description: 'A reusable component that does something useful',
  category: 'ui',
  tags: ['input', 'form'],
  version: '1.0.0',
  author: 'Your Name',
  dependencies: [],
  props: {
    // Document component properties
    value: {
      type: 'string',
      description: 'The current value',
      default: ''
    }
  },
  events: {
    // Document component events
    'value-changed': {
      description: 'Fired when the value changes',
      detail: 'The new value'
    }
  },
  examples: [
    {
      name: 'Basic usage',
      code: '<my-component value="example"></my-component>'
    }
  ]
});
```

### Retrieving Components

```javascript
// Get a specific component by name
const component = componentRegistry.get('my-component');

// Get all components in a category
const uiComponents = componentRegistry.getByCategory('ui');

// Search for components
const searchResults = componentRegistry.search('input');

// Get components with specific tag
const formComponents = componentRegistry.getByTag('form');
```

### Using the Component Catalog UI

```html
<!-- Add the component catalog to your page -->
<component-catalog></component-catalog>

<!-- With filtering for a specific category -->
<component-catalog category="ui"></component-catalog>

<!-- With search capabilities -->
<component-catalog searchable></component-catalog>
```

## Component Metadata Schema

Each component registered with the system should provide metadata in the following format:

```javascript
{
  // Required fields
  name: 'component-name',       // The HTML tag name (kebab-case)
  displayName: 'Component Name', // Human-readable name
  description: 'Description of what the component does',
  category: 'ui',               // Primary category
  
  // Optional fields
  tags: ['tag1', 'tag2'],       // Additional categorization tags
  version: '1.0.0',             // Semantic version
  author: 'Author Name',        // Component author
  dependencies: [],             // Other component dependencies
  
  props: {                      // Component properties/attributes
    propName: {
      type: 'string|number|boolean|array|object',
      description: 'What this property does',
      default: 'Default value',
      required: false
    }
    // More properties...
  },
  
  events: {                     // Events emitted by component
    'event-name': {
      description: 'When this event fires',
      detail: 'What data is included in the event'
    }
    // More events...
  },
  
  slots: {                      // Component slots
    default: 'Description of the default slot',
    named: 'Description of a named slot'
    // More slots...
  },
  
  cssProperties: {              // CSS custom properties
    '--property-name': {
      description: 'What this property affects',
      default: 'Default value'
    }
    // More CSS properties...
  },
  
  examples: [                   // Usage examples
    {
      name: 'Example name',
      description: 'What this example demonstrates',
      code: '<component-name prop="value"></component-name>'
    }
    // More examples...
  ]
}
```

## Component Catalog UI

The Component Catalog provides a visual interface for browsing and discovering components:

- **Category Filter**: Browse components by category
- **Tag Cloud**: Filter components by tags
- **Search**: Find components by keyword
- **Component Cards**: Visual representation of available components
- **Component Details**: View full documentation and examples
- **Code Preview**: Copy-paste example snippets
- **Live Demo**: Test components in an interactive playground

## Integration with Development Workflow

The Component Registry is integrated with the development workflow in several ways:

1. **Component Documentation**: Generates documentation from component metadata
2. **Development Tools**: Provides autocomplete and validation in editors
3. **Build Process**: Optimizes bundling based on component usage
4. **Testing**: Facilitates component testing and validation

## Example: Complete Registration

```javascript
// Import registry
import { componentRegistry } from '../registry/component-registry.js';

// Register the table component
componentRegistry.register({
  name: 'table-component',
  displayName: 'Table',
  description: 'A responsive, accessible, and customizable data table',
  category: 'data',
  tags: ['table', 'data', 'grid'],
  version: '1.0.0',
  author: 'Claude AI Website Builder Team',
  
  props: {
    sortable: {
      type: 'boolean',
      description: 'Enable sorting functionality for the table',
      default: false
    },
    filterable: {
      type: 'boolean',
      description: 'Enable filtering functionality for the table',
      default: false
    },
    paginated: {
      type: 'boolean',
      description: 'Enable pagination for the table',
      default: false
    },
    rowsPerPage: {
      type: 'number',
      description: 'Number of rows to display per page when paginated',
      default: 10
    }
  },
  
  events: {
    'sort-changed': {
      description: 'Fired when the sort order of a column changes',
      detail: '{ column: string, direction: "asc"|"desc" }'
    },
    'page-changed': {
      description: 'Fired when the current page changes in paginated mode',
      detail: '{ page: number, totalPages: number }'
    }
  },
  
  cssProperties: {
    '--table-background': {
      description: 'Table background color',
      default: 'white'
    },
    '--table-border-color': {
      description: 'Table border color',
      default: '#ddd'
    }
  },
  
  examples: [
    {
      name: 'Basic Table',
      description: 'A simple table with header and rows',
      code: `
<table-component>
  <table-header>
    <table-column>Name</table-column>
    <table-column>Email</table-column>
  </table-header>
  <table-body>
    <table-row>
      <table-cell>John Doe</table-cell>
      <table-cell>john@example.com</table-cell>
    </table-row>
  </table-body>
</table-component>
      `
    }
  ]
});
```
