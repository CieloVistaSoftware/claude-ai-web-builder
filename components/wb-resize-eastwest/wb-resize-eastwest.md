# wb-resize-eastwest

**Horizontal resize handle component for resizing parent containers left/right**

## Overview

`wb-resize-eastwest` provides a draggable handle that allows users to resize containers horizontally. Perfect for sidebars, side panels, and split-view layouts.

## Features

- ✅ Horizontal drag-to-resize functionality
- ✅ Configurable min/max width constraints
- ✅ localStorage persistence of width
- ✅ Visual resize cursor on hover
- ✅ Events for resize start, during, and end
- ✅ Customizable handle width
- ✅ Left or right side positioning
- ✅ Flexbox-compatible layout

## Installation

```html
<script type="module" src="./wb-resize-eastwest.js"></script>
```

## Basic Usage

```html
<div id="sidebar" style="position: relative; width: 300px;">
    <wb-resize-eastwest 
        storage-key="sidebar-width"
        min-width="200"
        max-width="600"
        side="right"
        handle-width="8px">
    </wb-resize-eastwest>
    
    <div class="sidebar-content">
        <!-- Your content here -->
    </div>
</div>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `storage-key` | string | `null` | localStorage key to persist width between sessions |
| `min-width` | number | `200` | Minimum width in pixels |
| `max-width` | number | `1200` | Maximum width in pixels |
| `handle-width` | string | `"8px"` | Width of the draggable area |
| `side` | string | `"right"` | Handle position: `"left"` or `"right"` |
| `target` | string | `null` | CSS selector of element to resize (defaults to parent) |

## Events

### `wb:resize-start`
Fired when user starts dragging the handle.

```javascript
element.addEventListener('wb:resize-start', (e) => {
    console.log('Started at width:', e.detail.startWidth);
    console.log('Mouse X position:', e.detail.startX);
});
```

**Event Detail:**
- `startWidth`: Initial width in pixels
- `startX`: Initial mouse X coordinate

### `wb:resizing`
Fired continuously while dragging.

```javascript
element.addEventListener('wb:resizing', (e) => {
    console.log('Current width:', e.detail.width);
    console.log('Delta X:', e.detail.deltaX);
});
```

**Event Detail:**
- `width`: Current width in pixels
- `deltaX`: Change from start position

### `wb:resize-end`
Fired when user releases the drag handle.

```javascript
element.addEventListener('wb:resize-end', (e) => {
    console.log('Final width:', e.detail.finalWidth);
});
```

**Event Detail:**
- `finalWidth`: Final width in pixels

## Public Methods

### `setMinWidth(width)`
Set minimum width constraint.

```javascript
const resizer = document.querySelector('wb-resize-eastwest');
resizer.setMinWidth(250);
```

### `setMaxWidth(width)`
Set maximum width constraint.

```javascript
resizer.setMaxWidth(800);
```

### `setTarget(selector)`
Change the target element to resize.

```javascript
resizer.setTarget('#custom-sidebar');
```

### `getTargetWidth()`
Get current width of target element.

```javascript
const width = resizer.getTargetWidth();
console.log('Current width:', width);
```

## Common Patterns

### Left Sidebar

```html
<style>
    body {
        display: flex;
        height: 100vh;
    }
    
    #sidebar {
        position: relative;
        width: 300px;
        flex-shrink: 0;
    }
    
    #main-content {
        flex: 1;
        overflow: auto;
    }
</style>

<body>
    <div id="sidebar">
        <wb-resize-eastwest 
            storage-key="left-sidebar-width"
            side="right"
            min-width="200"
            max-width="600">
        </wb-resize-eastwest>
        
        <div class="sidebar-content">
            <!-- Sidebar content -->
        </div>
    </div>
    
    <div id="main-content">
        <!-- Main content -->
    </div>
</body>
```

### Right Panel

```html
<style>
    body {
        display: flex;
        height: 100vh;
    }
    
    #main-content {
        flex: 1;
        overflow: auto;
    }
    
    #right-panel {
        position: relative;
        width: 300px;
        flex-shrink: 0;
    }
</style>

<body>
    <div id="main-content">
        <!-- Main content -->
    </div>
    
    <div id="right-panel">
        <wb-resize-eastwest 
            storage-key="right-panel-width"
            side="left"
            min-width="200"
            max-width="600">
        </wb-resize-eastwest>
        
        <div class="panel-content">
            <!-- Panel content -->
        </div>
    </div>
</body>
```

### Inspector/DevTools Layout

```html
<div style="display: flex; height: 100vh;">
    <div id="code-editor" style="flex: 1;">
        <!-- Code editor -->
    </div>
    
    <div id="inspector" style="position: relative; width: 350px;">
        <wb-resize-eastwest 
            storage-key="inspector-width"
            side="left"
            min-width="250"
            max-width="700">
        </wb-resize-eastwest>
        
        <div class="inspector-content">
            <!-- Inspector panels -->
        </div>
    </div>
</div>
```

## Styling

The component uses Shadow DOM with minimal styling. The handle responds to hover:

```css
/* Custom handle styling via CSS parts */
wb-resize-eastwest::part(handle) {
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
}
```

### Default Behavior
- **Cursor**: `ew-resize` (↔️) on hover
- **Background**: Transparent, subtle highlight on hover
- **Transition**: Smooth background color change

## Drag Direction

- **Right Handle**: Drag LEFT to shrink, RIGHT to expand
- **Left Handle**: Drag RIGHT to shrink, LEFT to expand

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ All modern browsers with Custom Elements v1

## Notes

- **Side Attribute**: Use `side="left"` for right panels, `side="right"` for left sidebars
- **Target Element**: Defaults to parent element if no `target` attribute
- **localStorage**: Width persists only if `storage-key` is provided
- **Flexbox**: Works best in flex layouts with proper constraints

## Troubleshooting

### Resize doesn't work
- Verify parent element has `position: relative` or `position: absolute`
- Check that target element exists in DOM
- Ensure min/max width constraints are reasonable

### Width not persisting
- Provide a unique `storage-key` attribute
- Check browser localStorage is enabled
- Verify no other code is clearing localStorage

### Handle not visible
- Increase `handle-width` (default is only 8px)
- Add custom styling via CSS parts
- Check z-index if content overlaps handle

## Version History

- **v1.0.0** - Initial release with core functionality

## License

Part of the WB Component Library
