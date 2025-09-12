# Table Theme Component

A reusable, customizable table component with theming capabilities. This component integrates with the project's theming system and provides enhanced functionality like sorting, filtering, and pagination.

## Features

- Responsive design that works across devices
- Theme-aware styling using CSS variables
- Optional advanced features:
  - Column sorting
  - Table filtering
  - Pagination
- Customizable appearance through CSS variables

## Files

This component consists of three main files:

1. `table-theme.html` - Demo and example usage
2. `table-theme.css` - Core styling for the table component
3. `table-theme.js` - Optional enhanced functionality

## Usage

### Basic Usage

To use the basic themed table, simply include the CSS file and apply the `table-theme` class to your table:

```html
<link rel="stylesheet" href="path/to/table-theme.css">

<table class="table-theme">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
    <!-- More rows... -->
  </tbody>
</table>
```

### Enhanced Features

To enable advanced features, include the JavaScript file and add data attributes:

```html
<link rel="stylesheet" href="path/to/table-theme.css">
<script src="path/to/table-theme.js"></script>

<table class="table-theme" 
       data-auto-init 
       data-sortable 
       data-filterable 
       data-page-size="10">
  <!-- Table content -->
</table>
```

### Data Attributes

- `data-auto-init` - Enable automatic initialization
- `data-sortable` - Enable column sorting
- `data-filterable` - Enable table filtering
- `data-page-size="n"` - Enable pagination with n rows per page

### Manual JavaScript Initialization

You can also initialize the enhanced features manually:

```javascript
const table = document.querySelector('.table-theme');
const tableTheme = new TableTheme(table, {
  sortable: true,
  filterable: true,
  pageSize: 10
});
```

## CSS Variables

The table component uses the following CSS variables for theming:

| Variable | Purpose | Default |
|----------|---------|---------|
| `--primary` | Header background | `#0072c6` |
| `--light` | Light background | `#ffffff` |
| `--bg-alt` | Alternate row background | `#f8f9fa` |
| `--border` | Border color | `#dee2e6` |
| `--hover` | Row hover background | `#e9ecef` |

## Integration with Theme Generator

This component is fully compatible with the Theme Generator. When you generate a new theme, the table will automatically inherit the theme colors and styling.

## Customization

You can customize the appearance by overriding the CSS variables:

```css
:root {
  --primary: #3498db;
  --light: #f5f5f5;
  --bg-alt: #eaeaea;
  --border: #cccccc;
  --hover: #d5d5d5;
}
```

## Accessibility

The table component follows accessibility best practices:
- Proper semantic markup
- Keyboard navigation for interactive elements
- ARIA attributes where appropriate

## Browser Support

The table component works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)