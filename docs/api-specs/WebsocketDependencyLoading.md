# Using WebSocket for Dependency Loading

This document explains how to use WebSockets for loading dependencies instead of making HTTP GET requests.

## Why WebSocket-Based Dependency Loading?

When a WebSocket connection is already established between the client and server, making additional HTTP requests for dependencies is inefficient. By leveraging the existing WebSocket connection, we can:

1. Reduce the number of connection overhead
2. Simplify server-side code by using a single communication channel
3. Improve security by centralizing access control
4. Enable real-time updates to dependencies

## Implementation

We've implemented a WebSocket-based approach to dependency loading through two main components:

1. `WebSocketServerManager` - Server-side handler for WebSocket connections
2. `WebSocketDependencyLoader` - Client-side utility for loading dependencies through WebSockets

### Server-Side Setup

The server handles WebSocket connections and responds to requests for different types of resources:

- **File requests** - Load any file from the server
- **Component requests** - Load UI components 
- **Plugin requests** - Load plugin scripts

```javascript
// Import the WebSocketServerManager
import WebSocketServerManager from './websocket-server-manager.js';

// Create and start the server
const wsServer = new WebSocketServerManager({ port: 3000 });
wsServer.start();
```

### Client-Side Usage

On the client side, you can use the `WebSocketDependencyLoader` to load various dependencies:

```html
<!-- Load socket.io from server -->
<script src="/socket.io/socket.io.js"></script>

<!-- Create socket connection -->
<script>
  window.socket = io();
</script>

<!-- Load the dependency loader -->
<script type="module">
  import WebSocketDependencyLoader from './websocket-dependency-loader.js';
  
  // Create loader instance
  const loader = new WebSocketDependencyLoader(window.socket);
  
  // Load scripts
  loader.loadScript('./components/control-panel.js').then(() => {
    console.log('Control panel script loaded');
  });
  
  // Load CSS
  loader.loadCSS('./components/control-panel.css').then(() => {
    console.log('Control panel styles loaded');
  });
  
  // Load components
  loader.loadComponent('ControlPanelContent.html').then(content => {
    document.getElementById('control-panel').innerHTML = content;
  });
  
  // Load plugins
  loader.loadPlugin('color-picker').then(() => {
    console.log('Color picker plugin loaded');
  });
</script>
```

### Global Instance

For convenience, a global instance of the loader is created automatically when a socket connection is available:

```javascript
// The global instance is available as window.wsLoader
window.wsLoader.loadScript('./path/to/script.js');
```

## Testing

The implementation includes test files:

1. `test-claude-socket.html` - Tests WebSocket communication with the Claude AI service
2. `claude-socket-real.spec.js` - Playwright test for the WebSocket implementation

## Best Practices

When using WebSocket-based dependency loading:

1. **Use for frequently accessed resources** - Prioritize loading frequently accessed resources via WebSocket
2. **Handle fallbacks** - Include fallbacks to traditional HTTP requests when WebSocket is not available
3. **Monitor connection status** - Check WebSocket connection status before attempting to load dependencies
4. **Cache resources** - The loader caches loaded resources to avoid duplicate requests

## Migration Guide

To migrate from HTTP GET requests to WebSocket-based loading:

1. Replace script tags:

   ```html
   <!-- Before -->
   <script src="./components/control-panel.js"></script>
   
   <!-- After -->
   <script>
     window.wsLoader.loadScript('./components/control-panel.js');
   </script>
   ```

2. Replace CSS loading:

   ```html
   <!-- Before -->
   <link rel="stylesheet" href="./components/control-panel.css">
   
   <!-- After -->
   <script>
     window.wsLoader.loadCSS('./components/control-panel.css');
   </script>
   ```

3. Replace dynamic imports:

   ```javascript
   // Before
   const module = await import('./components/control-panel.js');
   
   // After
   const script = await window.wsLoader.loadScript('./components/control-panel.js', { executeScript: false });
   const module = new Function(`return (async function() { ${script} })()`)();
   ```

4. Replace fetch for HTML:

   ```javascript
   // Before
   const response = await fetch('./components/ControlPanelContent.html');
   const html = await response.text();
   
   // After
   const html = await window.wsLoader.loadHTML('./components/ControlPanelContent.html');
   ```

## Conclusion

By using WebSockets for dependency loading, we can create a more efficient application architecture that reduces network overhead and provides a more unified approach to resource loading.
