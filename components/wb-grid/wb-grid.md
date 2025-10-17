# wb-grid Web Component

## Overview
`wb-grid` is a flexible, standards-compliant web component for grid layouts. It follows all project rules:
- All logic is in `wb-grid.js`.
- Styles are inlined in the component's shadow DOM (no external CSS needed).
- Naming follows kebab-case.
- Demo and documentation files must be created separately.

## Usage
```html
<wb-grid columns="3" gap="2rem">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</wb-grid>
```
- `columns`: Number of columns or `auto-fit`/`auto-fill` (default: `auto-fit`)
- `min`: Minimum column width (default: `200px`)
- `gap`: Gap between grid items (default: `1rem`)

## Features
- Responsive grid using CSS Grid.
- All attributes are reactive.
- No external dependencies.

## Project Rules Reference
See [CONTRIBUTING.md](../CONTRIBUTING.md) for project rules and review checklist.
