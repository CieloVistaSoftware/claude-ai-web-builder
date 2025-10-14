# WB Component Registry Documentation

## Overview

`WBComponentRegistry` is the central orchestration system for managing component lifecycle, dependencies, and health monitoring in the Website Builder platform. It provides a comprehensive solution for registering, loading, and managing web components with automatic dependency resolution.

## Features

- **Component Lifecycle Management**: Complete component registration, loading, and cleanup
- **Dependency Resolution**: Automatic loading of component dependencies in correct order
- **Health Monitoring**: Continuous monitoring of component status and DOM presence
- **Dynamic Loading**: Runtime component loading with path resolution
- **Event System**: Comprehensive event dispatching for component state changes
- **Performance Tracking**: Load time monitoring and performance statistics
- **Logging System**: Detailed logging with color-coded console output

## Core Concepts

### Component Registration

Components are registered with their dependencies and metadata:

```javascript
await WBComponentRegistry.register(
    'wb-button',           // Component name
    WBButtonClass,         // Component class
    ['wb-base'],          // Dependencies
    { version: '1.0.0' }   // Metadata
);
```

### Dependency Graph

The registry maintains a complete dependency graph showing relationships between components:

- **Dependencies**: Components that must load before this component
- **Dependents**: Components that depend on this component
- **Status Tracking**: Real-time status of each component in the graph

### Health Monitoring

Continuous monitoring includes:

- **Registration Status**: Whether custom element is registered
- **DOM Presence**: Number of component instances in the DOM
- **Health State**: healthy, unhealthy, or failed status

## API Reference

### Registration Methods

#### `register(name, componentClass, dependencies, metadata)`

Register a component with dependency management.

```javascript
// Register a simple component
await WBComponentRegistry.register('wb-button', WBButtonClass);

// Register with dependencies
await WBComponentRegistry.register(
    'wb-modal', 
    WBModalClass, 
    ['wb-button', 'wb-overlay'],
    { 
        version: '2.0.0',
        author: 'WB Team'
    }
);
```

**Parameters:**
- `name` (string): Unique component identifier
- `componentClass` (Function): Component constructor or class
- `dependencies` (Array): Array of dependency component names
- `metadata` (Object): Additional component information

**Returns:** Promise resolving to component instance data

### Loading Methods

#### `loadComponent(name, timeout)`

Dynamically load a component at runtime.

```javascript
// Load component with default timeout
const component = await WBComponentRegistry.loadComponent('wb-color-picker');

// Load with custom timeout
const component = await WBComponentRegistry.loadComponent('wb-chart', 15000);
```

**Parameters:**
- `name` (string): Component name to load
- `timeout` (number): Maximum wait time in milliseconds (default: 10000)

**Returns:** Promise resolving to loaded component data

#### `waitForComponent(name, timeout)`

Wait for a component to become available.

```javascript
// Wait for component to be ready
const component = await WBComponentRegistry.waitForComponent('wb-navigation');

// Wait with custom timeout
try {
    const component = await WBComponentRegistry.waitForComponent('wb-sidebar', 5000);
    console.log('Component ready:', component);
} catch (error) {
    console.error('Component failed to load:', error);
}
```

### Status Methods

#### `isLoaded(name)`

Check if a component is successfully loaded.

```javascript
if (WBComponentRegistry.isLoaded('wb-header')) {
    // Component is ready to use
    const header = document.createElement('wb-header');
}
```

#### `isHealthy(name)`

Check if a component is in healthy state.

```javascript
if (WBComponentRegistry.isHealthy('wb-footer')) {
    // Component is functioning properly
} else {
    console.warn('Footer component has health issues');
}
```

#### `getStatus(name)`

Get detailed status of a component.

```javascript
const status = WBComponentRegistry.getStatus('wb-menu');
// Returns: 'not-registered', 'loaded', 'failed'
```

### Dependency Methods

#### `getDependencies(name)`

Get list of component dependencies.

```javascript
const deps = WBComponentRegistry.getDependencies('wb-control-panel');
// Returns: ['wb-button', 'wb-slider', 'wb-color-picker']
```

#### `getDependents(name)`

Get components that depend on this component.

```javascript
const dependents = WBComponentRegistry.getDependents('wb-button');
// Returns: ['wb-modal', 'wb-control-panel', 'wb-toolbar']
```

#### `getUnloadedDependencies(name)`

Get dependencies that haven't been loaded yet.

```javascript
const unloaded = WBComponentRegistry.getUnloadedDependencies('wb-dashboard');
// Returns: ['wb-chart', 'wb-data-table']
```

### Information Methods

#### `getAllComponents()`

Get all registered component data.

```javascript
const components = WBComponentRegistry.getAllComponents();
components.forEach(component => {
    console.log(`${component.name}: ${component.status}`);
});
```

#### `getComponentNames()`

Get list of all registered component names.

```javascript
const names = WBComponentRegistry.getComponentNames();
// Returns: ['wb-button', 'wb-input', 'wb-modal', ...]
```

#### `getDependencyGraph()`

Get complete dependency graph with relationships.

```javascript
const graph = WBComponentRegistry.getDependencyGraph();
// Returns object with component relationships:
// {
//   'wb-button': {
//     status: 'loaded',
//     dependencies: [],
//     dependents: ['wb-modal', 'wb-toolbar'],
//     health: 'healthy'
//   },
//   ...
// }
```

### Statistics and Monitoring

#### `getStats()`

Get registry performance statistics.

```javascript
const stats = WBComponentRegistry.getStats();
console.log(`Total components: ${stats.totalComponents}`);
console.log(`Load success rate: ${stats.loadedComponents / stats.totalComponents * 100}%`);
console.log(`Average load time: ${stats.averageLoadTime}ms`);
```

**Returns:**
```javascript
{
    totalComponents: 15,
    loadedComponents: 14,
    failedComponents: 1,
    healthyComponents: 13,
    averageLoadTime: 245,
    uptime: 30000,
    logEntries: 156
}
```

#### `generateHealthReport()`

Generate comprehensive health and status report.

```javascript
const report = WBComponentRegistry.generateHealthReport();
// Includes: stats, dependency graph, recent logs, component details
```

## Event System

### Registry Events

The registry dispatches events for component lifecycle changes:

```javascript
// Listen for component loading
document.addEventListener('wb:componentLoaded', (event) => {
    const { name, instance } = event.detail;
    console.log(`Component ${name} loaded successfully`);
});

// Listen for registry logs
document.addEventListener('wb:registryLog', (event) => {
    const { type, message, details } = event.detail;
    // Handle registry logging events
});
```

### Event Types

- **`wb:componentLoaded`**: Fired when component loads successfully
- **`wb:registryLog`**: Fired for all registry log messages

## Advanced Usage

### Custom Component Loading

```javascript
// Register component with custom loading logic
class CustomComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<p>Custom Component Loaded</p>';
    }
}

// Register with registry
await WBComponentRegistry.register(
    'wb-custom',
    CustomComponent,
    ['wb-base'],
    {
        version: '1.0.0',
        category: 'ui',
        author: 'Custom Team'
    }
);

// Use the component
document.body.appendChild(document.createElement('wb-custom'));
```

### Dependency Chain Loading

```javascript
// Load component with complex dependency chain
async function loadComplexComponent() {
    try {
        // This will automatically load all dependencies
        const dashboard = await WBComponentRegistry.loadComponent('wb-dashboard');
        
        // Check what dependencies were loaded
        const deps = WBComponentRegistry.getDependencies('wb-dashboard');
        console.log('Loaded dependencies:', deps);
        
        return dashboard;
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        // Handle fallback UI
    }
}
```

### Health Monitoring Integration

```javascript
// Monitor component health changes
setInterval(() => {
    const criticalComponents = ['wb-header', 'wb-navigation', 'wb-footer'];
    
    criticalComponents.forEach(name => {
        if (!WBComponentRegistry.isHealthy(name)) {
            console.warn(`Critical component ${name} is unhealthy`);
            // Trigger recovery or notification
        }
    });
}, 30000); // Check every 30 seconds
```

## Global Convenience Functions

The registry provides global convenience functions:

```javascript
// Simplified registration
registerComponent('wb-new-component', NewComponentClass, ['wb-base']);

// Simplified waiting
const component = await waitForComponent('wb-new-component');
```

## Configuration and Debugging

### Enable Debug Logging

```javascript
// Registry automatically logs with color-coded output
// View logs in browser console:
// - Blue: Info messages
// - Green: Success messages  
// - Orange: Warning messages
// - Red: Error messages
```

### Performance Monitoring

```javascript
// Monitor load performance
const stats = WBComponentRegistry.getStats();
if (stats.averageLoadTime > 1000) {
    console.warn('Component loading is slow, consider optimization');
}

// Check cache efficiency if using symbol resolution
const cacheStats = WBComponentRegistry.SymbolRegistry?.getCacheStats();
console.log('Symbol resolution cache hit ratio:', cacheStats?.hitRatio);
```

## Best Practices

### 1. Declare Dependencies Explicitly

```javascript
// Good: Explicit dependencies
await registerComponent('wb-modal', ModalClass, ['wb-button', 'wb-overlay']);

// Avoid: Missing dependencies (can cause loading issues)
await registerComponent('wb-modal', ModalClass);
```

### 2. Handle Loading Errors

```javascript
// Good: Error handling
try {
    await WBComponentRegistry.loadComponent('wb-chart');
} catch (error) {
    console.error('Chart component failed to load:', error);
    // Show fallback UI or error message
}
```

### 3. Monitor Component Health

```javascript
// Good: Health monitoring
if (WBComponentRegistry.isHealthy('wb-data-table')) {
    // Safe to use component
} else {
    // Handle unhealthy component
}
```

### 4. Use Dependency Graph for Optimization

```javascript
// Analyze dependency graph for optimization
const graph = WBComponentRegistry.getDependencyGraph();
const heavyComponents = Object.entries(graph)
    .filter(([name, data]) => data.dependencies.length > 5)
    .map(([name]) => name);

console.log('Components with many dependencies:', heavyComponents);
```

## Integration with WBComponentUtils

The registry integrates seamlessly with WBComponentUtils:

```javascript
// Registry is available through utils
const registry = window.WBComponentUtils.Registry;

// Use symbol resolution for component paths
const symbolRegistry = window.WBComponentUtils.SymbolRegistry;
symbolRegistry.register('wb.new-component.js', 'components/wb-new-component/wb-new-component.js');
```

## Browser Support

- **Modern Browsers**: Requires ES6+ support
- **Custom Elements**: Web Components API required
- **Promises**: async/await support needed
- **MutationObserver**: For DOM monitoring
- **CustomEvent**: For event system

## Related Documentation

- [WB Component Base](wb-component-base.md)
- [WB Component Utils](wb-component-utils.md) 
- [Component Architecture Guide](../../docs/component-architecture.md)