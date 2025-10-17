# Web Components Architecture

## Overview

This document describes the recommended architecture for building scalable, maintainable web components in the Cielo Vista Software ecosystem.

## Principles

- **Encapsulation**: Use Shadow DOM for style and DOM isolation.
- **Reusability**: Design components to be composable and reusable.
- **Separation of Concerns**: Keep logic, style, and markup modular.
- **Accessibility**: Follow ARIA and WCAG guidelines.
- **Performance**: Optimize for fast rendering and low memory usage.

## Folder Structure

```
src/components/
  my-component/
    my-component.js
    my-component.css
    my-component.test.js
    README.md
    examples/
```

## Component Lifecycle

- `constructor`: Setup state, bind methods
- `connectedCallback`: DOM insertion, render, event listeners
- `disconnectedCallback`: Cleanup
- `attributeChangedCallback`: React to attribute changes

## State Management

- Use internal state (Map or object)
- Expose public API via properties and methods
- Use events for communication

## Theming

- Use CSS custom properties for theming
- Support light/dark modes

## Testing

- Unit tests for logic
- Integration tests for DOM and events
- Accessibility tests

## Example

```js
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.state = {};
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `<div>Hello, world!</div>`;
  }
}
customElements.define('my-component', MyComponent);
```

## References

- [Web Components Guide](./How-to-Web-Component-Guide.md)
- [MDN Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
