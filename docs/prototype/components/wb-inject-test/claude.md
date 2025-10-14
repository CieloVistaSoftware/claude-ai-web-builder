# ./components/wb-inject-test/claude.md - WB Inject Test Component

## 🕒 RECENT ACTIVITY (October 10, 2025)

### ✅ Component Created (October 10, 2025)
- **Status**: ✅ **COMPLETED** - New component for runtime JavaScript injection and testing
- **Purpose**: Debug and test DOM elements by injecting and executing JavaScript code at runtime
- **Features**:
  - CSS selector-based element targeting
  - Live JavaScript code editor
  - Code execution with console capture
  - Display of executed code and results
  - Copy code to clipboard
  - Error handling and display
  - Event system for integration

## Overview
The wb-inject-test component is a developer tool that allows runtime JavaScript injection and execution on any DOM element. It provides a code editor, execution environment, and results display for testing and debugging.

## Purpose
wb-inject-test allows developers to:
- **Test DOM elements** - Select any element via CSS selector
- **Execute JavaScript** - Run code with the element available as a variable
- **Capture console output** - See console.log, warn, error messages
- **View results** - Display return values and execution results
- **Debug issues** - Test hypotheses and inspect element state

## Key Features
- Target element selection via CSS selector
- Live JavaScript code editor (textarea)
- Code execution with error handling
- Console output capture and display
- Return value display
- Executed code history
- Copy code to clipboard
- Success/error visual feedback
- Event-driven architecture

## Usage

### Basic HTML
```html
<wb-inject-test target="#my-element"></wb-inject-test>
```

### With Event Listening
```html
<wb-inject-test target=".my-class"></wb-inject-test>

<script>
  document.querySelector('wb-inject-test').addEventListener('wb:inject-test:executed', (e) => {
    console.log('Code executed:', e.detail.code);
    console.log('Result:', e.detail.result);
    console.log('Logs:', e.detail.logs);
  });
</script>
```

## Component Interface

### Attributes
- `target` - CSS selector for the target element (default: "#layout-select")

### Events
- `wb:inject-test:ready` - Component initialized
- `wb:inject-test:executed` - Code executed successfully
- `wb:inject-test:error` - Execution failed

### Methods
- `selectTarget()` - Select target element from input
- `runTest()` - Execute the JavaScript code
- `clear()` - Clear code and results
- `copyCode()` - Copy code to clipboard

## Example Test Scripts

### Inspect Element
```javascript
console.log('Tag:', element.tagName);
console.log('ID:', element.id);
console.log('Classes:', element.className);
console.log('Children:', element.children.length);
```

### Modify Styles
```javascript
element.style.background = '#10b981';
element.style.color = 'white';
element.style.padding = '1rem';
```

### Check wb-select Options
```javascript
if (element._options) {
    console.log('Options:', element._options);
    console.log('Filtered options:', element._filteredOptions);
    console.log('Selected values:', element._selectedValues);
}
```

### Get Dimensions
```javascript
const rect = element.getBoundingClientRect();
console.log('Width:', rect.width);
console.log('Height:', rect.height);
console.log('Position:', {x: rect.x, y: rect.y});
```

## Use Cases

### Debugging Control Panel Dropdown
Target: `#layout-select`
```javascript
console.log('wb-select element:', element);
console.log('Options:', element._options);
console.log('Dropdown:', element.querySelector('.wb-select-dropdown'));
console.log('Options container:', element.querySelector('.wb-select-options'));
console.log('Children:', element.querySelector('.wb-select-options').children.length);
```

### Testing Event Handlers
```javascript
element.addEventListener('click', () => {
    console.log('Click event fired!');
});
console.log('Event listener added');
```

### Modifying Component State
```javascript
if (element.setLayout) {
    element.setLayout('left-nav');
    console.log('Layout changed to:', element.getLayout());
}
```

## Files
- `wb-inject-test.js` - Component implementation
- `wb-inject-test.css` - Component styles
- `wb-inject-test.schema.json` - JSON schema
- `wb-inject-test-demo.html` - Demo page
- `claude.md` - This documentation

## Integration
Add to manifest.json:
```json
{
  "name": "wb-inject-test",
  "path": "components/wb-inject-test/wb-inject-test.js",
  "category": "development"
}
```

## Status
✅ **FULLY FUNCTIONAL** - Component complete and integrated

## Changelog

### October 10, 2025 - Integration Complete
- ✅ Added to [manifest.json](../manifest.json) for automatic loading
- ✅ Added to [index.html](../../index.html) at bottom-left corner targeting #layout-select
- ✅ Added to [wb-nav](../wb-nav/wb-nav.js) navigation menu as "🧪 Inject Test" link
- ✅ All files created: .js, .css, .schema.json, -demo.html, claude.md
- ✅ Ready for debugging control panel dropdown issue

## Next Steps
- Test with control panel #layout-select dropdown
- Use for debugging why only 1 option shows instead of 4
- Create test library of common scripts
- Document findings in CLAUDE.md
