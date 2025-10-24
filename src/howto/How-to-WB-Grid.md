# wb-grid Component Guide

## Overview

`wb-grid` is a flexible, responsive web component for grid layouts. It supports custom row/column templates, gap, alignment, and dynamic content. Designed for use in design systems and UI libraries.

## Features

- CSS grid-based layout
- Customizable rows, columns, gap, alignment
- Responsive by default
- Slot-based content
- Theming support

## Usage

### Basic Example
```html
<wb-grid columns="1fr 2fr" gap="16px">
  <div>Column 1</div>
  <div>Column 2</div>
</wb-grid>
```

### Responsive Example
```html
<wb-grid columns="repeat(auto-fit, minmax(200px, 1fr))" gap="24px">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</wb-grid>
```

## API

### Attributes
- `columns`: CSS grid-template-columns value
- `rows`: CSS grid-template-rows value (optional)
- `gap`: CSS gap value (optional)
- `align`: grid align-items value (optional)
- `justify`: grid justify-items value (optional)

### Slots
- Default slot: grid content

### CSS Custom Properties
- `--wb-grid-gap`: grid gap
- `--wb-grid-bg`: background color

## Accessibility

- Role: `grid`
- Keyboard navigation: Tab/Shift+Tab

## Theming

```css
wb-grid {
  --wb-grid-bg: #f8f9fa;
}
wb-grid[theme="dark"] {
  --wb-grid-bg: #181a1b;
}
```

## Example: Dynamic Content
```js
const grid = document.createElement('wb-grid');
grid.setAttribute('columns', 'repeat(3, 1fr)');
for (let i = 1; i <= 9; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  grid.appendChild(div);
}
document.body.appendChild(grid);
```

## Changelog

- **v1.0.0** (2025-10-13): Initial release
