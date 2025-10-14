# component-utils.js

This file provides shared utility functions for WB web components, reducing code duplication and promoting composition over inheritance.

## Purpose
- Centralize common logic used by multiple components (e.g., property/attribute reflection, event dispatching, event listener helpers).
- Make component code more maintainable and DRY.

## Utilities Provided
- `reflectPropAttr(element, prop, attr)`: Reflects a property to an attribute and vice versa, so changes to one update the other.
- `dispatchComponentEvent(element, name, detail, options)`: Dispatches a custom event from a component with the given detail and options.
- `addEventListeners(element, listeners)`: Adds multiple event listeners to an element from an object map.
- `removeEventListeners(element, listeners)`: Removes multiple event listeners from an element from an object map.

## Usage Example
```js
import { reflectPropAttr, dispatchComponentEvent } from './component-utils.js';

class MyComponent extends HTMLElement {
  constructor() {
    super();
    reflectPropAttr(this, 'checked', 'checked');
  }
  // ...
  someMethod() {
    dispatchComponentEvent(this, 'myEvent', { foo: 'bar' });
  }
}
```

## References
- Used by: `wb-toggle.js` and other WB components
- Promotes code reuse and maintainability across the component library
