# Table Component

## Overview

The Table Component is a reusable web component for the ClaudeAIWebSiteBuilder project that displays tabular data with various features like sorting, filtering, and theming support.

## Features

- Responsive design that works across different screen sizes
- Themeable using CSS variables to match your site's design
- Support for sorting columns
- Support for filtering data
- Pagination for large datasets
- Accessible with proper ARIA attributes
- Shadow DOM encapsulation to prevent style conflicts
- **JSON binding** - Automatically binds to data from any JSON file
- **Theme integration** - Implements and extends the project's Theme component with table-specific styling

## Usage

```html
<table-component>
  <table-header>
    <table-column sortable>Name</table-column>
    <table-column>Email</table-column>
    <table-column>Role</table-column>
    <table-column>Status</table-column>
  </table-header>
  <table-body>
    <table-row>
      <table-cell>John Doe</table-cell>
      <table-cell>john@example.com</table-cell>
      <table-cell>Admin</table-cell>
      <table-cell>Active</table-cell>
    </table-row>
    <!-- Additional rows -->
  </table-body>
</table-component>
```

## API Reference

### Properties

| Name         | Type    | Default | Description                                     |
|--------------|---------|--------|-------------------------------------------------|
| `sortable`   | Boolean | `false` | Enable sorting functionality for the table      |
| `filterable` | Boolean | `false` | Enable filtering functionality for the table    |
| `paginated`  | Boolean | `false` | Enable pagination for the table                 |
| `rowsPerPage`| Number  | `10`    | Number of rows to display per page when paginated |
| `bordered`   | Boolean | `true`  | Display borders around cells                    |
| `striped`    | Boolean | `false` | Apply alternating row colors                    |
| `hoverable`  | Boolean | `true`  | Apply hover effect to rows                      |
| `dataSource` | String  | `null`  | Path to JSON file to bind data from             |
| `dataKey`    | String  | `null`  | Optional key in JSON to access nested data array |
| `theme`      | String  | `"default"` | Theme name to use from the theme registry    |

### Events

| Event Name      | Description                                               |
|-----------------|-----------------------------------------------------------|
| `sort-changed`  | Fired when the sort order of a column changes             |
| `filter-applied`| Fired when a filter is applied to the table               |
| `page-changed`  | Fired when the current page changes in paginated mode     |
| `row-selected`  | Fired when a row is selected                              |

### Methods

| Method Name       | Parameters           | Return   | Description                                |
|-------------------|----------------------|----------|--------------------------------------------|
| `sort(column)`    | `column`: String     | void     | Sort the table by the specified column     |
| `filter(criteria)`| `criteria`: Object   | void     | Filter the table data by criteria object   |
| `goToPage(page)`  | `page`: Number       | void     | Navigate to a specific page                |
| `refresh()`       | none                 | void     | Refresh the table with current data        |
| `loadData(source)`| `source`: String     | Promise  | Load data from a JSON file or URL          |
| `setTheme(name)`  | `name`: String       | void     | Apply a specific theme to the table        |
| `exportData(format)` | `format`: String  | Blob     | Export table data in CSV, JSON, or Excel format |

## Theming

The table component extends the project's theme system but adds table-specific variables and styling. It integrates with the Theme component while providing additional customization specifically for tables.

### CSS Variables

```css
table-component {
  /* Base theme variables extended from the Theme component */
  --primary-color: var(--primary, #3b82f6);
  --accent-color: var(--accent, #f59e0b);
  --background-color: var(--background, #ffffff);
  --text-color: var(--text-primary, #333333);
  --border-color: var(--border, #e5e7eb);
  
  /* Table-specific theme variables */
  --table-background: var(--surface, white);
  --table-color: var(--text-color, #333);
  --table-border-color: var(--border-color, #ddd);
  --table-header-background: var(--primary-color-light, #f5f5f5);
  --table-header-color: var(--primary-color-dark, #333);
  --table-row-hover-background: rgba(0, 0, 0, 0.03);
  --table-stripe-background: var(--background-color, #f9f9f9);
  --table-border-radius: 4px;
  --table-cell-padding: 0.75rem;
  --table-font-family: inherit;
  --table-font-size: inherit;
  --table-header-font-weight: 600;
  --table-pagination-active-bg: var(--primary-color, #3b82f6);
  --table-pagination-active-color: white;
  --table-sort-icon-color: var(--primary-color, #3b82f6);
  --table-filter-background: var(--surface, white);
}
```

### Theme Implementation

The table component inherits from the project's Theme system but adds its own specialized implementation:

1. It listens for theme changes from the Theme component
2. Automatically applies theme colors to table elements
3. Provides additional table-specific theming variables
4. Supports both light and dark mode themes
5. Can override project theme with table-specific theme

## Accessibility

The table component follows accessibility best practices:

- Proper ARIA roles and attributes
- Keyboard navigation support
- Screen reader announcements for sorting and filtering changes
- Sufficient color contrast

## Integration with Component Registry

This table component is registered in the component catalog system and can be discovered through the component registry UI:

```javascript
// Example of retrieving the table component from the registry
const tableComponent = componentRegistry.get('table');
```

## JSON Data Binding

The Table Component can bind directly to JSON data from any file or URL. The component will automatically parse the data and render it in the table.

### JSON Format

The component accepts any valid JSON array of objects, where each object represents a row and its properties represent column values:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Admin",
    "status": "Active"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "User",
    "status": "Pending"
  }
]
```

### Binding Methods

#### Attribute Binding
```html
<table-component data-source="data/users.json"></table-component>
```

#### JavaScript Binding
```javascript
const table = document.querySelector('table-component');
table.loadData('data/users.json');
```

#### Nested Data Access
If your JSON has a nested structure, use the `data-key` attribute to specify the path to the array:

```html
<table-component data-source="data/response.json" data-key="results.users"></table-component>
```

### Dynamic Column Generation

The component can automatically generate columns based on the JSON data structure:

```html
<table-component data-source="data/users.json" auto-columns></table-component>
```

Or you can explicitly define columns while still using JSON data:

```html
<table-component data-source="data/users.json">
  <table-header>
    <table-column field="name">Full Name</table-column>
    <table-column field="email">Email Address</table-column>
    <!-- Only specified columns will be shown -->
  </table-header>
</table-component>
```

### Data Transformation

You can provide custom transformation functions for formatting data:

```javascript
const table = document.querySelector('table-component');
table.setTransformer('price', (value) => `$${value.toFixed(2)}`);
table.setTransformer('date', (value) => new Date(value).toLocaleDateString());
```

## Example

```html
<table-component sortable paginated rows-per-page="5">
  <table-header>
    <table-column sortable>Product</table-column>
    <table-column sortable>Category</table-column>
    <table-column sortable>Price</table-column>
    <table-column>Actions</table-column>
  </table-header>
  <table-body>
    <table-row>
      <table-cell>Laptop</table-cell>
      <table-cell>Electronics</table-cell>
      <table-cell>$999</table-cell>
      <table-cell><button>View</button></table-cell>
    </table-row>
    <!-- More rows -->
  </table-body>
</table-component>
```
