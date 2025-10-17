# WB Modal

## Overview

`<wb-modal>` is a flexible modal dialog component with animations, backdrops, and accessibility features. Perfect for alerts, confirmations, forms, and content overlays.

## Purpose

- **Dialog Windows**: Display content in overlay windows
- **User Confirmations**: Get user input before actions
- **Content Focus**: Draw attention to important information
- **Accessibility**: Full keyboard navigation and ARIA support

## Features

✅ **Animations** - Smooth open/close transitions  
✅ **Backdrop** - Clickable overlay background  
✅ **Keyboard support** - ESC to close, focus trap  
✅ **Sizes** - Small, medium, large, fullscreen  
✅ **Close button** - Optional X button  
✅ **Events** - Open, close, confirm, cancel  
✅ **Scrollable content** - Long content support  
✅ **Center alignment** - Auto-centered on screen  

## Installation

```html
<wb-modal id="myModal">
    <h2 slot="header">Modal Title</h2>
    <p slot="body">Modal content goes here.</p>
    <div slot="footer">
        <wb-button onclick="document.getElementById('myModal').close()">Close</wb-button>
    </div>
</wb-modal>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | `false` | Show/hide modal |
| `size` | string | `'medium'` | Size: small, medium, large, fullscreen |
| `closeable` | boolean | `true` | Show close button |
| `backdrop` | boolean | `true` | Show backdrop overlay |
| `close-on-backdrop` | boolean | `true` | Close when clicking backdrop |
| `close-on-esc` | boolean | `true` | Close on ESC key |

## Events

| Event Name | Detail | Description |
|------------|--------|-------------|
| `wb-modal:open` | `{ modal }` | Modal opened |
| `wb-modal:close` | `{ modal }` | Modal closed |
| `wb-modal:confirm` | `{ modal, data }` | Confirm button clicked |
| `wb-modal:cancel` | `{ modal }` | Cancel button clicked |

## Usage Examples

### Basic Modal
```html
<wb-modal id="basic">
    <h2 slot="header">Welcome!</h2>
    <p slot="body">This is a basic modal dialog.</p>
</wb-modal>

<wb-button onclick="document.getElementById('basic').open()">
    Open Modal
</wb-button>
```

### Confirmation Dialog
```html
<wb-modal id="confirm" size="small">
    <h2 slot="header">Confirm Action</h2>
    <p slot="body">Are you sure you want to delete this?</p>
    <div slot="footer">
        <wb-button variant="secondary" onclick="document.getElementById('confirm').cancel()">
            Cancel
        </wb-button>
        <wb-button variant="primary" onclick="document.getElementById('confirm').confirm()">
            Delete
        </wb-button>
    </div>
</wb-modal>
```

### Form Modal
```html
<wb-modal id="formModal">
    <h2 slot="header">Edit Profile</h2>
    <div slot="body">
        <form id="profileForm">
            <wb-input label="Name" required></wb-input>
            <wb-input type="email" label="Email" required></wb-input>
        </form>
    </div>
    <div slot="footer">
        <wb-button onclick="document.getElementById('formModal').close()">Cancel</wb-button>
        <wb-button variant="primary" onclick="submitForm()">Save</wb-button>
    </div>
</wb-modal>
```

## API Methods

### `open()`
Opens the modal.

```javascript
const modal = document.querySelector('wb-modal');
modal.open();
```

### `close()`
Closes the modal.

```javascript
modal.close();
```

### `toggle()`
Toggles modal open/closed.

```javascript
modal.toggle();
```

### `confirm(data)`
Triggers confirm event and closes.

```javascript
modal.confirm({ userId: 123 });
```

### `cancel()`
Triggers cancel event and closes.

```javascript
modal.cancel();
```

## Keyboard Navigation

- **ESC**: Close modal (if `close-on-esc` enabled)
- **Tab**: Navigate through modal elements
- **Shift+Tab**: Navigate backwards
- **Focus trap**: Keeps focus inside modal when open

## Styling

### CSS Classes
```css
.wb-modal                /* Base */
.wb-modal__backdrop      /* Overlay */
.wb-modal__dialog        /* Dialog box */
.wb-modal__header        /* Header section */
.wb-modal__body          /* Body section */
.wb-modal__footer        /* Footer section */
.wb-modal__close         /* Close button */
.wb-modal--open          /* Open state */
.wb-modal--small         /* Small size */
.wb-modal--large         /* Large size */
```

### Custom Styling
```css
wb-modal {
    --modal-bg: white;
    --modal-backdrop: rgba(0, 0, 0, 0.5);
    --modal-border-radius: 8px;
    --modal-max-width: 600px;
}
```

## Accessibility

- Traps focus inside modal when open
- Returns focus to trigger element on close
- Proper ARIA attributes (`role="dialog"`, `aria-modal="true"`)
- ESC key closes modal
- Screen reader announcements

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Dependencies

- **wb-modal.css**: Required styles
- **component-utils.js**: Optional utilities

## Related Components

- **[wb-button](../wb-button/wb-button.md)**: Modal buttons
- **[wb-input](../wb-input/wb-input.md)**: Form inputs in modals

## Version History

- **v2.0.0** (Current): Web Component with accessibility

---

**Need help?** Check [claude.md](./claude.md) for details.
