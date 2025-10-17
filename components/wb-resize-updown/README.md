# wb-resize-updown

A lightweight, reusable web component for adding vertical resize functionality to any container.

## Features

- ✅ **Invisible handle** - Only shows cursor on hover
- ✅ **Drag up/down** - Intuitive vertical resizing
- ✅ **LocalStorage persistence** - Automatically saves height
- ✅ **Configurable constraints** - Set min/max heights
- ✅ **Event-driven** - Dispatch custom events for integration
- ✅ **Zero dependencies** - Pure web component
- ✅ **Shadow DOM** - Encapsulated styles

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
        max-height="600">
    </wb-resize-updown>
    
    <div>Your content here...</div>
</div>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `storage-key` | string | null | localStorage key to persist height |
| `min-height` | number | 100 | Minimum height in pixels |
| `max-height` | number | 600 | Maximum height in pixels |
| `handle-height` | string | "40px" | Height of the drag area |
| `target` | string | parent | CSS selector of element to resize |

## Events

The component dispatches three custom events:

### `wb:resize-start`
Fired when the user starts dragging.

```javascript
element.addEventListener('wb:resize-start', (e) => {
    console.log('Start height:', e.detail.startHeight);
    console.log('Start Y:', e.detail.startY);
});
```

### `wb:resizing`
Fired continuously while dragging (can be frequent).

```javascript
element.addEventListener('wb:resizing', (e) => {
    console.log('Current height:', e.detail.height);
    console.log('Delta Y:', e.detail.deltaY);
});
```

### `wb:resize-end`
Fired when the user releases the mouse button.

```javascript
element.addEventListener('wb:resize-end', (e) => {
    console.log('Final height:', e.detail.finalHeight);
});
```

## Public API

```javascript
const resizer = document.querySelector('wb-resize-updown');

// Set constraints programmatically
resizer.setMinHeight(150);
resizer.setMaxHeight(800);

// Change target element
resizer.setTarget('#another-element');

// Get current target height
const height = resizer.getTargetHeight();
```

## Styling

The component uses Shadow DOM. You can style the handle using CSS parts:

```css
wb-resize-updown::part(handle) {
    /* Custom styles for the drag handle */
}
```

## Example: Event Log Panel

```html
<div id="event-log-panel" style="position: relative; height: 250px;">
    <wb-resize-updown 
        storage-key="event-log-height"
        min-height="100"
        max-height="600"
        handle-height="40px">
    </wb-resize-updown>
    
    <div style="padding-top: 40px;">
        <div>Event log entry 1</div>
        <div>Event log entry 2</div>
    </div>
</div>
```

## How It Works

1. **Invisible by default** - The handle is transparent until hovered
2. **Cursor changes** - Browser shows `ns-resize` cursor on hover
3. **Drag behavior** - Drag UP = taller, Drag DOWN = shorter
4. **Automatic save** - Height persists to localStorage if `storage-key` provided
5. **Constrained** - Height is clamped between `min-height` and `max-height`

## Browser Support

Works in all modern browsers that support:
- Custom Elements (Web Components)
- Shadow DOM
- ES6 Classes

## License

MIT

## Demo

Run `wb-resize-updown-demo.html` to see it in action!
