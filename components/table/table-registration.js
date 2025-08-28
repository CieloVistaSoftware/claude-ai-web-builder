// Register the table component in the component registry
import componentRegistry from '../registry/component-registry.js';
import TableComponent from './table-component.js';

// Register the table component with detailed metadata
componentRegistry.register({
  name: 'Data Table',
  tagName: 'table-component',
  category: 'Data Display',
  description: 'A reusable, themeable and accessible data table component with sorting, pagination, and row selection capabilities.',
  version: '1.0.0',
  author: 'Claude AI Website Builder',
  props: [
    {
      name: 'columns',
      type: 'Array<Object>',
      description: 'Column definitions (id, label, sortable, renderer)',
      default: '[]'
    },
    {
      name: 'data',
      type: 'Array<Object>',
      description: 'Data to display in the table',
      default: '[]'
    },
    {
      name: 'sortable',
      type: 'boolean',
      description: 'Enable column sorting',
      default: 'false'
    },
    {
      name: 'paginated',
      type: 'boolean',
      description: 'Enable pagination',
      default: 'false'
    },
    {
      name: 'page-size',
      type: 'number',
      description: 'Number of rows per page (when paginated)',
      default: '10'
    },
    {
      name: 'selectable',
      type: 'boolean',
      description: 'Enable row selection via checkboxes',
      default: 'false'
    },
    {
      name: 'striped',
      type: 'boolean',
      description: 'Apply striped row styling',
      default: 'false'
    },
    {
      name: 'bordered',
      type: 'boolean',
      description: 'Apply borders to all cells',
      default: 'false'
    },
    {
      name: 'compact',
      type: 'boolean',
      description: 'Use compact padding for cells',
      default: 'false'
    },
    {
      name: 'caption',
      type: 'string',
      description: 'Table caption text (for accessibility)',
      default: ''
    }
  ],
  events: [
    {
      name: 'data-changed',
      detail: '{ data: Array }',
      description: 'Fired when the table data is changed'
    },
    {
      name: 'columns-changed',
      detail: '{ columns: Array }',
      description: 'Fired when the column configuration is changed'
    },
    {
      name: 'sort-changed',
      detail: '{ columnId: string, direction: "asc"|"desc" }',
      description: 'Fired when the sort column or direction changes'
    },
    {
      name: 'page-changed',
      detail: '{ page: number, totalPages: number }',
      description: 'Fired when the current page changes'
    },
    {
      name: 'selection-changed',
      detail: '{ selectedRows: Array }',
      description: 'Fired when the selected rows change'
    }
  ],
  methods: [
    {
      name: 'setData',
      params: 'data: Array<Object>',
      returns: 'void',
      description: 'Set the data to be displayed in the table'
    },
    {
      name: 'setColumns',
      params: 'columns: Array<Object>',
      returns: 'void',
      description: 'Set the column configuration'
    },
    {
      name: 'sort',
      params: 'columnId: string, direction?: "asc"|"desc"',
      returns: 'void',
      description: 'Sort the table by the specified column and direction'
    },
    {
      name: 'goToPage',
      params: 'page: number',
      returns: 'void',
      description: 'Navigate to the specified page'
    },
    {
      name: 'getSelectedRows',
      params: 'none',
      returns: 'Array<Object>',
      description: 'Get the currently selected rows'
    },
    {
      name: 'selectAll',
      params: 'none',
      returns: 'void',
      description: 'Select all rows on the current page'
    },
    {
      name: 'deselectAll',
      params: 'none',
      returns: 'void',
      description: 'Deselect all rows'
    }
  ],
  slots: [],
  examples: [
    `// Basic usage
<table-component 
  columns='[
    {"id": "name", "label": "Name"},
    {"id": "email", "label": "Email"},
    {"id": "role", "label": "Role"}
  ]'
  data='[
    {"name": "John Doe", "email": "john@example.com", "role": "Admin"},
    {"name": "Jane Smith", "email": "jane@example.com", "role": "User"},
    {"name": "Bob Johnson", "email": "bob@example.com", "role": "User"}
  ]'
></table-component>`,
    `// With sorting and pagination
<table-component 
  sortable
  paginated
  page-size="5"
  columns='[
    {"id": "id", "label": "ID"}, 
    {"id": "name", "label": "Product Name"},
    {"id": "price", "label": "Price"},
    {"id": "stock", "label": "Stock"}
  ]'
  data='[
    {"id": 1, "name": "Laptop", "price": 999.99, "stock": 45},
    {"id": 2, "name": "Smartphone", "price": 499.99, "stock": 125},
    {"id": 3, "name": "Headphones", "price": 99.99, "stock": 67},
    {"id": 4, "name": "Tablet", "price": 299.99, "stock": 39},
    {"id": 5, "name": "Monitor", "price": 249.99, "stock": 28},
    {"id": 6, "name": "Keyboard", "price": 49.99, "stock": 83}
  ]'
></table-component>`,
    `// With custom rendering
<script>
  // Function to format currency
  function formatCurrency(value) {
    return '$' + parseFloat(value).toFixed(2);
  }
  
  // Function to render stock status
  function renderStock(stock) {
    if (stock > 50) {
      return '<span style="color: green">In Stock (' + stock + ')</span>';
    } else if (stock > 0) {
      return '<span style="color: orange">Low Stock (' + stock + ')</span>';
    } else {
      return '<span style="color: red">Out of Stock</span>';
    }
  }
  
  // Set up the table with custom renderers
  const table = document.querySelector('table-component');
  table.setColumns([
    {id: 'id', label: 'ID'}, 
    {id: 'name', label: 'Product Name'},
    {id: 'price', label: 'Price', renderer: formatCurrency},
    {id: 'stock', label: 'Stock Status', renderer: renderStock}
  ]);
</script>

<table-component 
  sortable
  striped
  bordered
  caption="Product Inventory"
></table-component>`
  ],
  // Optional fields
  dateAdded: new Date().toISOString(),
}, TableComponent);

export default TableComponent;
