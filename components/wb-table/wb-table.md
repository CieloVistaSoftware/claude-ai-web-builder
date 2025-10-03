# WB Table Web Component

## Overview
A true web component for the Website Builder project that automatically handles JSON data and creates proper table headers. No configuration needed - just feed it JSON data and it works!

## Features
- ✅ **True Web Component** - Use as HTML `<wb-table>` tag
- ✅ **JSON Native** - Automatically handles JSON objects and arrays
- ✅ **Auto Headers** - Extracts headers from JSON object keys
- ✅ **Zero Configuration** - Works immediately with any JSON data
- ✅ **Data Binding** - Can watch global variables for changes
- ✅ **Multiple Data Sources** - HTML attributes, JavaScript, or data binding
- ✅ **Proper Table Structure** - Always creates proper HTML tables
- ✅ **Consistent Styling** - Matches WB design system

## Usage

### 1. Direct JSON in HTML
```html
<wb-table striped hover bordered data-json='[
    {"level": "error", "time": "10:30", "source": "app.js", "message": "Failed"},
    {"level": "warn", "time": "10:31", "source": "utils.js", "message": "Warning"}
]'></wb-table>
```

### 2. Programmatic JSON
```javascript
const table = document.querySelector('wb-table');

// Set JSON data (headers automatically extracted from object keys)
table.setData([
    {level: 'error', time: '10:30:45', source: 'app.js', message: 'Error occurred'},
    {level: 'warn', time: '10:31:12', source: 'utils.js', message: 'Warning'}
]);

// Add single JSON object
table.addRow({level: 'info', time: '10:32:00', source: 'main.js', message: 'Info'});
```

### 3. Data Binding
```html
<!-- Table automatically watches global variable -->
<wb-table data-source="myGlobalData" striped hover></wb-table>

<script>
window.myGlobalData = [
    {id: 1, name: 'Task 1', status: 'pending'},
    {id: 2, name: 'Task 2', status: 'complete'}
];
</script>
```

## HTML Attributes

### Data Attributes
- **`data-json`**: JSON string containing table data
- **`data-source`**: Name of global variable to watch for data changes

### Style Attributes
- **`striped`**: Alternating row colors
- **`hover`**: Hover effects on rows
- **`bordered`**: Border around table

## JavaScript API

### Methods

#### `setData(jsonArray)`
Sets table data from JSON array. Headers automatically extracted from object keys.
```javascript
table.setData([
    {name: 'John', age: 30, city: 'NYC'},
    {name: 'Jane', age: 25, city: 'LA'}
]);
```

#### `addRow(jsonObject)`
Adds single row from JSON object. Must match existing headers.
```javascript
table.addRow({name: 'Bob', age: 35, city: 'Chicago'});
```

#### `clear()`
Removes all data from table.
```javascript
table.clear();
```

#### `getRowCount()`
Returns current number of rows.
```javascript
const count = table.getRowCount();
```

### Events

#### `wb-table:dataChanged`
Fired when table data is set or changed.
```javascript
table.addEventListener('wb-table:dataChanged', (e) => {
    console.log('Data changed:', e.detail);
});
```

#### `wb-table:rowAdded`
Fired when a row is added.
```javascript
table.addEventListener('wb-table:rowAdded', (e) => {
    console.log('Row added:', e.detail);
});
```

#### `wb-table:cleared`
Fired when table is cleared.
```javascript
table.addEventListener('wb-table:cleared', (e) => {
    console.log('Table cleared');
});
```

## Data Formats Supported

### JSON Objects (Recommended)
Headers automatically extracted from object keys:
```javascript
[
    {level: 'error', time: '10:30', message: 'Error occurred'},
    {level: 'warn', time: '10:31', message: 'Warning message'}
]
```

### Array of Arrays
First row becomes headers:
```javascript
[
    ['Level', 'Time', 'Message'],
    ['error', '10:30', 'Error occurred'],
    ['warn', '10:31', 'Warning message']
]
```

### Simple Arrays
Single column with 'Value' header:
```javascript
['Item 1', 'Item 2', 'Item 3']
```

## Real-World Examples

### Error Log Table
```html
<wb-table id="error-log" striped hover bordered></wb-table>

<script>
const errorLog = document.getElementById('error-log');

function logError(level, message, source) {
    errorLog.addRow({
        level: level,
        timestamp: new Date().toLocaleTimeString(),
        source: source || 'unknown',
        message: message
    });
}

// Usage
logError('error', 'Database connection failed', 'db.js');
logError('warn', 'API response slow', 'api.js');
</script>
```

### User Management Table
```html
<wb-table data-json='[
    {"id": 1, "name": "John Doe", "email": "john@example.com", "role": "Admin"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "User"}
]' striped hover bordered></wb-table>
```

### Dynamic Data Binding
```html
<wb-table data-source="tasksList" striped hover></wb-table>

<script>
// Global data that table watches
window.tasksList = [
    {id: 1, title: 'Setup project', status: 'complete'},
    {id: 2, title: 'Write tests', status: 'pending'}
];

// Add new task - table updates automatically
function addTask(title) {
    window.tasksList.unshift({
        id: Date.now(),
        title: title,
        status: 'pending'
    });
}
</script>
```

## CSS Customization

The component uses CSS custom properties for theming:
```css
:root {
    --wb-table-border-color: #475569;
    --wb-table-header-bg: #334155;
    --wb-table-header-text: #f1f5f9;
    --wb-table-row-even: rgba(255, 255, 255, 0.02);
    --wb-table-row-hover: rgba(255, 255, 255, 0.05);
}
```

## Benefits Over Manual Tables

1. **Prevents Confusion** - Always creates proper table structure
2. **JSON Native** - No need to convert data formats
3. **Auto Headers** - Headers extracted automatically from data
4. **True Web Component** - Standard HTML element
5. **Zero Configuration** - Works immediately
6. **Event System** - Proper event dispatching
7. **Data Binding** - Automatic updates from global variables

## Migration from Manual Tables

Replace manual table creation:
```html
<!-- Old way -->
<table>
    <thead><tr><th>Level</th><th>Message</th></tr></thead>
    <tbody id="error-rows"></tbody>
</table>

<!-- New way -->
<wb-table id="error-table" striped hover bordered></wb-table>
```

Replace manual row insertion:
```javascript
// Old way
const row = document.createElement('tr');
row.innerHTML = `<td>${level}</td><td>${message}</td>`;
document.getElementById('error-rows').appendChild(row);

// New way
document.getElementById('error-table').addRow({level, message});
```

## Browser Support
- ✅ Chrome 54+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Edge 79+

## File Structure
- `wb-table-webcomponent.js` - Main web component
- `wb-table.css` - Component styling
- `wb-table-json-demo.html` - JSON-focused demo
- `wb-table.json` - Component configuration
- `wb-table.md` - This documentation

This component ensures we never have to manually create table structures again - just feed it JSON and it handles everything!