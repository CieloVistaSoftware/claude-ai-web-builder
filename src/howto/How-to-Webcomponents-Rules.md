# Webcomponents Rules

## General Rules

- Use kebab-case for custom element names (e.g., `my-component`)
- Always use shadow DOM unless there is a strong reason not to
- Prefix all CSS custom properties with the component name
- Document all public properties, methods, and events
- Write unit and integration tests
- Ensure accessibility (ARIA roles, keyboard navigation)
- Avoid global side effects

## Naming Conventions

- Custom elements: `prefix-name` (e.g., `wb-grid`)
- CSS variables: `--prefix-name-property`

## Example

```js
class WbGrid extends HTMLElement {
  // ...component code...
}
customElements.define('wb-grid', WbGrid);
```

## References

- [Webcomponents Guide](./How-to-Webcomponents.md)
