# wb-resize-updown

**Vertical resize handle component for resizing parent containers up/down**

## Overview

`wb-resize-updown` provides a draggable handle that allows users to resize containers vertically. Typically placed at the top of a bottom-anchored panel, dragging upward increases the panel height while shrinking content above it.

## Features

- ✅ Vertical drag-to-resize functionality
- ✅ Configurable min/max height constraints
- ✅ localStorage persistence of height
- ✅ Visual resize cursor on hover
- ✅ Events for resize start, during, and end
- ✅ Customizable handle height
- ✅ Automatic scroll prevention on load
- ✅ Flexbox-compatible layout

## Installation

```html
<script type="module" src="./wb-resize-updown.js"></script>
```

## Basic Usage

```html
<div id="my-panel" style="position: relative; height: 250px;">
    <wb-resize-updown 
        storage-key="my-panel-height"
        min-height="100"
        max-height="600"
        handle-height="40px">
    </wb-resize-updown>
    
    <div class="panel-content">
        <!-- Your content here -->
    </div>
</div>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `storage-key` | string | `null` | localStorage key to persist height between sessions |
| `min-height` | number | `100` | Minimum height in pixels |
| `max-height` | number | `600` | Maximum height in pixels |
| `handle-height` | string | `"40px"` | Height of the draggable area at top of panel |
| `target` | string | `null` | CSS selector of element to resize (defaults to parent) |

## Events

### `wb:resize-start`
Fired when user starts dragging the handle.

```javascript
element.addEventListener('wb:resize-start', (e) => {
    console.log('Started at height:', e.detail.startHeight);
    console.log('Mouse Y position:', e.detail.startY);
});
```

**Event Detail:**
- `startHeight`: Initial height in pixels
- `startY`: Initial mouse Y coordinate

### `wb:resizing`
Fired continuously while dragging.

```javascript
element.addEventListener('wb:resizing', (e) => {
    console.log('Current height:', e.detail.height);
    console.log('Delta Y:', e.detail.deltaY);
});
```

**Event Detail:**
- `height`: Current height in pixels
- `deltaY`: Change from start position

### `wb:resize-end`
Fired when user releases the drag handle.

```javascript
element.addEventListener('wb:resize-end', (e) => {
    console.log('Final height:', e.detail.finalHeight);
});
```

**Event Detail:**
- `finalHeight`: Final height in pixels

## Public Methods

### `setMinHeight(height)`
Set minimum height constraint.

```javascript
const resizer = document.querySelector('wb-resize-updown');
resizer.setMinHeight(150);
```

### `setMaxHeight(height)`
Set maximum height constraint.

```javascript
resizer.setMaxHeight(800);
```

### `setTarget(selector)`
Change the target element to resize.

```javascript
resizer.setTarget('#custom-panel');
```

### `getTargetHeight()`
Get current height of target element.

```javascript
const height = resizer.getTargetHeight();
console.log('Current height:', height);
```

## Common Patterns

### Push Content Layout

Place at bottom of page with flexbox to push content up:

```html
<style>
    body {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
    
    #main-content {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
    }
    
    #bottom-panel {
        flex-shrink: 0;
        position: relative;
    }
</style>

<body>
    <div id="main-content">
        <!-- Content that gets pushed up -->
    </div>
    
    <div id="bottom-panel">
        <wb-resize-updown 
            storage-key="bottom-panel-height"
            min-height="100"
            max-height="600">
        </wb-resize-updown>
        
        <div class="panel-content">
            <!-- Panel content -->
        </div>
    </div>
</body>
```

### Event Log Panel

```html
<div id="event-log" style="position: relative; height: 250px;">
    <wb-resize-updown 
        storage-key="event-log-height"
        min-height="100"
        max-height="600">
    </wb-resize-updown>
    
    <div class="log-content" style="height: 100%; overflow-y: auto;">
        <!-- Log entries -->
    </div>
</div>
```

### Prevent Content Scroll During Resize

```javascript
const panel = document.getElementById('my-panel');
const mainContent = document.getElementById('main-content');

panel.addEventListener('wb:resizing', () => {
    // Keep main content anchored to top
    mainContent.scrollTop = 0;
});
```

## Styling

The component uses Shadow DOM with minimal styling. The handle responds to hover:

```css
/* Custom handle styling via CSS parts (if needed) */
wb-resize-updown::part(handle) {
    background: rgba(99, 102, 241, 0.1);
}
```

### Default Behavior
- **Cursor**: `ns-resize` (↕️) on hover
- **Background**: Transparent, subtle highlight on hover
- **Transition**: Smooth background color change

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ All modern browsers with Custom Elements v1

## Notes

- **Drag Direction**: Drag UP increases height, drag DOWN decreases height
- **Target Element**: Defaults to parent element if no `target` attribute
- **Scroll Prevention**: Automatically prevents unwanted scrolling on page load
- **localStorage**: Height persists only if `storage-key` is provided
- **Flexbox**: Works best in flex layouts with proper constraints

## Examples

See `wb-resize-updown-demo.html` for live examples including:
- Push content layout
- Event log panel
- Height persistence
- Event handling

## Troubleshooting

### Panel auto-scrolls on page load
- Ensure you're not manually setting `scrollTop` in your code
- Check for auto-scroll in event handlers
- The component includes built-in scroll prevention

### Resize doesn't work
- Verify parent element has `position: relative` or `position: absolute`
- Check that target element exists in DOM
- Ensure min/max height constraints are reasonable

### Height not persisting
- Provide a unique `storage-key` attribute
- Check browser localStorage is enabled
- Verify no other code is clearing localStorage

## Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added scroll prevention on load
- **v1.2.0** - Fixed auto-scroll issues in event handlers

## License

Part of the WB Component Library
