# WB Base Component (`wb-base`)

## Purpose
The WB Base Component provides a foundational ES6 class (`WBBaseComponent`) for all WB Web Components in the WB ecosystem. It is designed to encapsulate shared logic, lifecycle management, event dispatching, logging, and style loading, ensuring consistency and reducing duplication across all WB components.

## Features
- Shadow DOM setup and style attachment
- Event dispatch helpers (`fireEvent`)
- Logging integration with `WBEventLog` (fallbacks to console)
- Attribute/property reflection helpers
- Lifecycle hooks (`connectedCallback`, `disconnectedCallback`, etc.)
- Utility methods for attribute management

## Usage Example
```js
import { WBBaseComponent } from './wb-base/wb-base.js';

class MyComponent extends WBBaseComponent {
  connectedCallback() {
    super.connectedCallback();
    this.logInfo('MyComponent connected');
  }
}
customElements.define('my-component', MyComponent);
```

## Demo
See `wb-base-demo.html` for a minimal working example and lifecycle event logging.

## File Structure
- `wb-base.js` — Base class implementation
- `wb-base-demo.html` — Demo page
- `wb-base-demo.css` — Demo styles
- `wb-base.md` — This documentation file
- `claude.md` — Project log and architecture notes

## Status
- ✅ Base class implemented
- ✅ Demo and CSS provided
- ✅ Documentation provided
- ✅ Ready for use by all WB components

_Last updated: 2025-10-10_
