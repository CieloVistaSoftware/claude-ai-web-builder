# wb-resize-both

**Corner resize handle component for resizing parent containers in both directions simultaneously**

## Overview

`wb-resize-both` provides a draggable corner handle that allows users to resize containers both horizontally and vertically at the same time. Perfect for floating windows, modals, and resizable panels.

## Features

- ✅ Diagonal drag-to-resize (both width and height)
- ✅ Configurable min/max width and height constraints
- ✅ localStorage persistence of dimensions
- ✅ Visual resize cursor on hover
- ✅ Events for resize start, during, and end
- ✅ Customizable handle size
- ✅ Four corner positions (bottom-right, bottom-left, top-right, top-left)
- ✅ Proportional or independent resizing

## Installation

```html
<script type="module" src="./wb-resize-both.js"></script>
```

## Basic Usage

```html
<div id="window" style="position: relative; width: 400px; height: 300px;">
    <div class="window-header">Title Bar</div>
    
    <div class="window-content">
        <!-- Your content here -->
    </div>
    
    <wb-resize-both 
        storage-key="window-size"
        min-width="300"
        max-width="1200"
        min-height="200"
        max-height="800"
        corner="bottom-right"
        size="16px">
    </wb-resize-both>
</div>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `storage-key` | string | `null` | localStorage key to persist size between sessions |
| `min-width` | number | `200` | Minimum width in pixels |
| `max-width` | number | `1200` | Maximum width in pixels |
| `min-height` | number | `100` | Minimum height in pixels |
| `max-height` | number | `800` | Maximum height in pixels |
| `corner` | string | `"bottom-right"` | Handle position: `"bottom-right"`, `"bottom-left"`, `"top-right"`, `"top-left"` |
| `size` | string | `"16px"` | Size of the draggable handle (width & height) |
| `target` | string | `null` | CSS selector of element to resize (defaults to parent) |

## Events

### `wb:resize-start`
Fired when user starts dragging the handle.

```javascript
element.addEventListener('wb:resize-start', (e) => {
    console.log('Started at:', e.detail.startWidth, 'x', e.detail.startHeight);
    console.log('Mouse position:', e.detail.startX, e.detail.startY);
});
```

**Event Detail:**
- `startWidth`: Initial width in pixels
- `startHeight`: Initial height in pixels
- `startX`: Initial mouse X coordinate
- `startY`: Initial mouse Y coordinate

### `wb:resizing`
Fired continuously while dragging.

```javascript
element.addEventListener('wb:resizing', (e) => {
    console.log('Current size:', e.detail.width, 'x', e.detail.height);
    console.log('Delta:', e.detail.deltaX, e.detail.deltaY);
});
```

**Event Detail:**
- `width`: Current width in pixels
- `height`: Current height in pixels
- `deltaX`: Change from start X position
- `deltaY`: Change from start Y position

### `wb:resize-end`
Fired when user releases the drag handle.

```javascript
element.addEventListener('wb:resize-end', (e) => {
    console.log('Final size:', e.detail.finalWidth, 'x', e.detail.finalHeight);
});
```

**Event Detail:**
- `finalWidth`: Final width in pixels
- `finalHeight`: Final height in pixels

## Public Methods

### `setMinWidth(width)`
Set minimum width constraint.

```javascript
const resizer = document.querySelector('wb-resize-both');
resizer.setMinWidth(350);
```

### `setMaxWidth(width)`
Set maximum width constraint.

```javascript
resizer.setMaxWidth(1000);
```

### `setMinHeight(height)`
Set minimum height constraint.

```javascript
resizer.setMinHeight(250);
```

### `setMaxHeight(height)`
Set maximum height constraint.

```javascript
resizer.setMaxHeight(900);
```

### `setTarget(selector)`
Change the target element to resize.

```javascript
resizer.setTarget('#custom-window');
```

### `getTargetSize()`
Get current dimensions of target element.

```javascript
const { width, height } = resizer.getTargetSize();
console.log('Current size:', width, 'x', height);
```

## Common Patterns

### Floating Window

```html
<style>
    .floating-window {
        position: fixed;
        top: 100px;
        left: 100px;
        width: 500px;
        height: 400px;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
    }
    
    .window-header {
        padding: 1rem;
        background: #f5f5f5;
        border-bottom: 1px solid #e0e0e0;
        border-radius: 8px 8px 0 0;
    }
    
    .window-content {
        flex: 1;
        padding: 1rem;
        overflow: auto;
    }
</style>

<div class="floating-window">
    <div class="window-header">
        <h3>Resizable Window</h3>
    </div>
    
    <div class="window-content">
        <!-- Content -->
    </div>
    
    <wb-resize-both 
        storage-key="floating-window-size"
        min-width="400"
        max-width="1200"
        min-height="300"
        max-height="900"
        corner="bottom-right">
    </wb-resize-both>
</div>
```

### Resizable Modal

```html
<div class="modal" style="position: relative; width: 600px; height: 400px;">
    <div class="modal-header">Modal Title</div>
    <div class="modal-body">Modal content</div>
    <div class="modal-footer">
        <button>Cancel</button>
        <button>Save</button>
    </div>
    
    <wb-resize-both 
        storage-key="modal-size"
        min-width="500"
        max-width="1000"
        min-height="350"
        max-height="800"
        corner="bottom-right"
        size="20px">
    </wb-resize-both>
</div>
```

### Inspector Panel (Multiple Corners)

```html
<div id="inspector" style="position: absolute; width: 350px; height: 500px;">
    <!-- Content -->
    
    <!-- Bottom-right corner -->
    <wb-resize-both 
        storage-key="inspector-br"
        corner="bottom-right">
    </wb-resize-both>
    
    <!-- Bottom-left corner -->
    <wb-resize-both 
        storage-key="inspector-bl"
        corner="bottom-left">
    </wb-resize-both>
</div>
```

## Corner Positions

The `corner` attribute determines which corner the handle appears in and the drag behavior:

| Corner | Drag Direction | Use Case |
|--------|----------------|----------|
| `bottom-right` | Down-right increases size | Most common, standard resize |
| `bottom-left` | Down-left increases size | Right-anchored panels |
| `top-right` | Up-right increases size | Bottom-anchored windows |
| `top-left` | Up-left increases size | Bottom-right anchored windows |

## Styling

The component uses Shadow DOM with minimal styling:

```css
/* Custom handle styling via CSS parts */
wb-resize-both::part(handle) {
    background: linear-gradient(135deg, 
        rgba(99, 102, 241, 0.1), 
        rgba(99, 102, 241, 0.3));
    border-radius: 0 0 4px 0;
}
```

### Default Behavior
- **Cursor**: Diagonal resize cursors (`nwse-resize`, `nesw-resize`) based on corner
- **Background**: Transparent, subtle highlight on hover
- **Visual**: Small corner indicator

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ All modern browsers with Custom Elements v1

## Notes

- **Position**: Parent element must have `position: relative`, `absolute`, or `fixed`
- **Multiple Handles**: You can add handles to multiple corners of the same element
- **localStorage**: Dimensions persist only if `storage-key` is provided
- **Constraints**: Min/max constraints apply to both dimensions independently

## Troubleshooting

### Resize doesn't work
- Verify parent element has proper positioning (`position: relative`)
- Check that target element exists in DOM
- Ensure min/max constraints allow room for resizing

### Handle not visible
- Increase `size` attribute (default is 16px)
- Add custom styling via CSS parts
- Check z-index if content overlaps handle
- Verify corner position matches your layout

### Size not persisting
- Provide a unique `storage-key` attribute
- Check browser localStorage is enabled
- Verify no other code is clearing localStorage

### Wrong cursor direction
- Verify `corner` attribute matches actual handle position
- Cursors: `bottom-right`/`top-left` use `nwse-resize` (↘️)
- Cursors: `bottom-left`/`top-right` use `nesw-resize` (↙️)

## Version History

- **v1.0.0** - Initial release with core functionality

## License

Part of the WB Component Library
