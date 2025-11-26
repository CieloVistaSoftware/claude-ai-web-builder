# 🎯 WB Demo Component

A reusable component for creating two-tab documentation and examples layouts following WB component standards.

---

## Features

- ✅ **Two-tab structure** (Documentation/Examples) 
- ✅ **Debug toggle button** - Built-in event log panel for debugging
- ✅ **95% width by default** - Responsive, full-width layout
- ✅ **Slotted content architecture** - Flexible content projection
- ✅ **Dark theme styling** - Consistent with WB design system
- ✅ **CSS-first architecture** - External stylesheet

---

## File Structure

```
components/wb-demo/
├── wb-demo.js              # Main component (ES6 class)
├── wb-demo.css             # External styles (CSS-first)
├── wb-demo-demo.html       # Two-tab demo
└── wb-demo.md              # This documentation
```

---

## Quick Start

```html
<wb-demo title="🎨 My Component Demo">
    <div slot="examples">
        <h2>Examples Content</h2>
        <p>Interactive examples go here...</p>
    </div>
</wb-demo>
```

---

## Debug Toggle (New in v3.0)

The component now includes a **🐛 Debug** button in the header that toggles an event log panel. This panel automatically captures and displays events from slotted components.

### Enabling Debug Mode

**Method 1: Click the button**
```
Click the 🐛 Debug button in the demo header
```

**Method 2: Attribute**
```html
<wb-demo title="My Demo" debug>
    ...
</wb-demo>
```

**Method 3: JavaScript API**
```javascript
const demo = document.querySelector('wb-demo');
demo.showDebug();   // Show panel
demo.hideDebug();   // Hide panel
demo.toggleDebug(); // Toggle visibility
```

### Captured Events

The debug panel automatically captures these events from slotted content:
- `colorchange`, `harmonychange`, `swatchselect`, `colorcopied`
- `click`, `change`, `input`, `submit`
- `wb-event`, `statechange`, `valuechange`
- `open`, `close`, `toggle`, `select`

### Custom Event Logging

```javascript
const demo = document.querySelector('wb-demo');
demo.logDebugEvent('custom-event', { foo: 'bar' });
```

---

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | 'Component Demo' | Demo title in header |
| `doc-url` | String | null | URL to documentation file |
| `markdown` | String | null | Path to markdown file |
| `demo-url` | String | null | URL for iframe demo |
| `debug` | Boolean | false | Show debug panel on load |

---

## Slots

| Slot | Purpose |
|------|---------|
| `documentation` | Documentation tab content |
| `examples` | Examples tab content |
| `code` | Code examples section |

---

## JavaScript API

### Properties

```javascript
const demo = document.querySelector('wb-demo');

// Access event history
demo.eventHistory; // Array of captured events

// Active filters
demo.activeFilters; // ['info', 'warning', 'error', 'success', 'debug', 'user']
```

### Methods

```javascript
// Debug panel control
demo.showDebug();   // Show debug panel
demo.hideDebug();   // Hide debug panel
demo.toggleDebug(); // Toggle visibility

// Custom event logging
demo.logDebugEvent('type', { detail: 'data' });
```

---

## Styling

The component uses **95% width by default** and is centered. Override with CSS:

```css
wb-demo {
    --primary-color: #6366f1;
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
}
```

---

## Documentation Loading Behavior

1. If `doc-url` attribute is set → loads referenced file
2. If `markdown` attribute is set → loads markdown file
3. If `<div slot="documentation">` is provided → uses slot content
4. Otherwise → auto-detects `.md` file matching folder name

---

## Usage Examples

### Basic Demo

```html
<wb-demo title="🎨 Color Picker Demo">
    <div slot="examples">
        <wb-color-harmony></wb-color-harmony>
    </div>
</wb-demo>
```

### With Debug Enabled

```html
<wb-demo title="🐛 Debug Example" debug>
    <div slot="examples">
        <my-component></my-component>
    </div>
</wb-demo>
```

### With Markdown Documentation

```html
<wb-demo title="📖 Documented Demo" markdown="./component.md">
    <div slot="examples">
        <my-component></my-component>
    </div>
</wb-demo>
```

### Nested Demos

```html
<wb-demo title="Outer Demo">
    <div slot="examples">
        <wb-demo title="Inner Demo">
            <div slot="examples">
                <p>Nested content</p>
            </div>
        </wb-demo>
    </div>
</wb-demo>
```

---

## Subcomponents

wb-demo provides several helper elements for structuring demos:

| Element | Purpose |
|---------|---------|
| `<wb-demo-section>` | Section container with heading styles |
| `<wb-demo-grid>` | Auto-fit grid layout |
| `<wb-demo-item>` | Card-style item container |
| `<wb-demo-output>` | Monospace output display |
| `<wb-example>` | Generic example wrapper |

### Example

```html
<wb-demo-section>
    <h2>Section Title</h2>
    <wb-demo-grid>
        <wb-demo-item>
            <h3>Item 1</h3>
            <p>Content here</p>
            <wb-demo-output>Output: value</wb-demo-output>
        </wb-demo-item>
        <wb-demo-item>
            <h3>Item 2</h3>
            <p>More content</p>
        </wb-demo-item>
    </wb-demo-grid>
</wb-demo-section>
```

---

## Changelog

### v3.0.0 (Current)
- Added debug toggle button
- Added debug event log panel
- Changed default width to 95%
- Added JavaScript API for debug control
- Auto-capture events from slotted content

### v2.0.0
- Two-tab structure
- Markdown support
- Slotted content

### v1.0.0
- Initial release

---

## Standards Compliance

- ✅ **wb- prefix**: wb-demo
- ✅ **CSS-First**: External wb-demo.css file
- ✅ **ES6 modules**: No CommonJS
- ✅ **Shadow DOM**: Encapsulated styles
- ✅ **Event system**: Captures and logs events
- ✅ **Composition**: Supports slotted content

---

<div align="center">

**Built with 💜 for the WB Project**

</div>
