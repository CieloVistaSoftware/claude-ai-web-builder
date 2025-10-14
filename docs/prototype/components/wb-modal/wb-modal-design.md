# WB Modal Component Design

## Overview
The **WB Modal** is a lightweight, self-contained modal dialog Web Component designed for the Website Builder framework. It provides clean animations, accessibility features, and flexible customization options with **zero external dependencies**.

## Features
- ✅ **Self-Contained Web Component** - No external dependencies (WBComponentUtils removed)
- ✅ **Slide Animation** - Animates DOWN from container top to bottom-right position
- ✅ **Accessibility** - Full ARIA support with keyboard navigation
- ✅ **Theming** - Uses CSS custom properties for consistent styling
- ✅ **Responsive** - Mobile-friendly design with viewport constraints
- ✅ **Variants** - Success, warning, danger styling options
- ✅ **Sizes** - Small, default, and large size options
- ✅ **Flexible Content** - Slots for header, body, and footer content

## Animation Behavior

### Key Animation Features
- **Direction**: Modal slides **DOWN** from container top to final position
- **Start Position**: Top of the button's container (demo-section, hero-demo, or parent)
- **End Position**: 1rem from bottom-right corner of viewport
- **Duration**: 1 second (1000ms) with no delay
- **Width Constraint**: Maximum 50% of viewport width
- **Height Constraint**: Always fits within viewport bounds

### Animation Sequence
1. **Trigger**: User clicks button in container
2. **Detection**: Find button's container (.demo-section, .hero-demo, or parent)
3. **Start**: Modal positioned at container top (`--wb-modal-start-top`)
4. **Animate**: Slides down to `calc(100vh - 1rem - modal-height)`
5. **Complete**: Modal rests 1rem from bottom and right edges

## API Reference

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | - | Modal dialog title text |
| `size` | string | 'default' | Modal size: 'small', 'default', 'large' |
| `variant` | string | 'default' | Visual variant: 'success', 'warning', 'danger' |
| `duration` | number | 1000 | Animation duration in milliseconds |
| `bg-color` | string | var(--bg-color) | Custom background color for modal dialog |
| `color` | string | var(--text-primary) | Custom text color for modal content |
| `open` | boolean | false | Controls modal visibility (read-only) |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `show(triggerElement?)` | HTMLElement | void | Show modal with animation from trigger's container |
| `hide()` | - | void | Hide modal with fade-out animation |

### CSS Custom Properties

The modal uses the following CSS variables from the root:

```css
:root {
  --bg-color: #0f172a;           /* Modal background */
  --text-primary: #f1f5f9;      /* Modal text */
  --neutral-600: #475569;       /* Border colors */
  --primary: #6366f1;           /* Accent colors */
  --success-color: #10b981;     /* Success variant */
  --warning-color: #f59e0b;     /* Warning variant */
  --error-color: #ef4444;       /* Danger variant */
}
```

### Slots

| Slot | Description |
|------|-------------|
| default | Main modal body content |
| `footer` | Modal footer content (buttons, actions) |

## Animation Implementation

### Container Detection
```javascript
// Priority order for finding start container
const container = triggerElement.closest('.demo-section') || 
                 triggerElement.closest('.hero-demo') || 
                 triggerElement.parentElement;
```

### Position Calculation
```javascript
const containerRect = container.getBoundingClientRect();
const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
const startTop = containerRect.top + scrollTop;
this.style.setProperty('--wb-modal-start-top', startTop + 'px');
```

### CSS Animation
```css
.wb-modal {
  position: fixed !important;
  right: 1rem !important;
  top: var(--wb-modal-start-top, 0px) !important;
  transition: top 1s ease-out, visibility 1s;
}

.wb-modal.wb-modal--open {
  top: calc(100vh - 1rem - var(--wb-modal-height, 400px)) !important;
  visibility: visible;
}
```

### Constraints
- **Width**: Maximum 50vw (50% of viewport width)
- **Height**: Maximum `calc(100vh - 2rem)` 
- **Right margin**: 1rem from viewport edge
- **Bottom margin**: 1rem from viewport bottom

## Usage Examples

### Basic Modal

```html
<wb-modal title="Basic Modal">
  <p>This is the modal content.</p>
  <div slot="footer">
    <button class="wb-btn" onclick="this.closest('wb-modal').hide()">Close</button>
  </div>
</wb-modal>
```

### Success Modal with Custom Colors

```html
<wb-modal 
  title="Success!" 
  variant="success" 
  duration="1500"
  bg-color="#10b981"
  color="#ffffff">
  <p>Operation completed successfully!</p>
  <div slot="footer">
    <button class="wb-btn wb-btn--success" onclick="this.closest('wb-modal').hide()">Continue</button>
  </div>
</wb-modal>
```

### Large Modal

```html
<wb-modal title="Settings" size="large">
  <div class="settings-content">
    <h4>User Preferences</h4>
    <p>Configure your application settings here.</p>
  </div>
  <div slot="footer">
    <button class="wb-btn wb-btn--secondary" onclick="this.closest('wb-modal').hide()">Cancel</button>
    <button class="wb-btn wb-btn--primary" onclick="this.closest('wb-modal').hide()">Save</button>
  </div>
</wb-modal>
```

### Programmatic Usage with Trigger Element

```javascript
// Create modal
const modal = document.createElement('wb-modal');
modal.setAttribute('title', 'Dynamic Modal');
modal.setAttribute('variant', 'warning');
modal.innerHTML = '<p>This modal was created programmatically.</p>';

// Show modal with trigger element for proper animation
const triggerButton = document.querySelector('#my-button');
modal.show(triggerButton);
```

### Utility Functions

The component provides global utility functions:

```javascript
// Alert modal
WBModal.alert('Save completed!', 'Success', triggerElement);

// Confirm modal
const confirmed = await WBModal.confirm('Delete this item?', 'Confirm Delete', triggerElement);
if (confirmed) {
  // User clicked Confirm
}

// Custom modal
const modal = WBModal.create({
  title: 'Custom Modal',
  content: '<p>Custom content here</p>',
  buttons: [{
    text: 'OK',
    variant: 'primary',
    onclick: () => WBModal.hide(modal)
  }]
});
WBModal.show(modal, triggerElement);
```

## Styling

### Size Variants

- **Small**: `max-width: 20rem` - For confirmations and alerts
- **Default**: `width: 400px` - Standard modal size
- **Large**: `max-width: 48rem` - For complex forms and content

### Color Variants

- **Default**: Uses `--bg-color` and `--text-primary`
- **Success**: Green header accent with `--success-color`
- **Warning**: Orange header accent with `--warning-color` 
- **Danger**: Red header accent with `--error-color`

### Responsive Behavior

On mobile devices (max-width: 640px):
- Width adjusts to `calc(100vw - 1rem)`
- Padding reduces for better mobile experience
- Footer buttons stack vertically
- Position adjusts to `0.5rem` from edges

## Accessibility

- **ARIA Labels**: `role="dialog"`, `aria-modal="true"`, `aria-hidden` support
- **Keyboard Navigation**: Escape key closes modal
- **Focus Management**: Automatically manages focus states
- **Screen Reader**: Proper semantic structure with headings

## Technical Implementation

### Self-Contained Architecture
- **No Dependencies**: Removed WBComponentUtils dependency
- **Inline Styles**: CSS embedded in component for isolation
- **Direct DOM**: Simple DOM manipulation without external libraries
- **Event Handling**: Native event listeners with proper cleanup

### Performance Optimizations
- **Minimal DOM**: Only creates necessary elements
- **CSS Variables**: Efficient styling with custom properties
- **Event Cleanup**: Proper listener removal on disconnect
- **Reflow Management**: Optimized animation timing

### Animation Implementation
```javascript
// Start position calculation
const container = triggerElement.closest('.demo-section') || 
                 triggerElement.closest('.hero-demo') || 
                 triggerElement.parentElement;
const startTop = containerRect.top + scrollTop;
this.style.setProperty('--wb-modal-start-top', startTop + 'px');

// End position via CSS
.wb-modal.wb-modal--open {
  top: calc(100vh - 1rem - var(--wb-modal-height, 400px)) !important;
}
```

## Browser Support

- Chrome 54+ (Web Components support)
- Firefox 63+ (Custom Elements support)
- Safari 10.1+ (Custom Elements support)
- Edge 79+ (Chromium-based)

## Testing

### Real Tests Location: `/tests/wb-modal-animation.spec.ts`

These tests validate actual behavior and **FAIL** when animations break:

#### Critical Animation Tests ✅:
- **Container Position**: Modal starts at exact container top position
- **Final Position**: Modal ends at bottom-right corner (1rem from edges)
- **Direction**: Modal moves DOWNWARD during animation (not upward!)
- **Colors**: Modal uses correct dark background from `--bg-color`
- **Constraints**: Modal respects 50vw width limit
- **Integration**: Complete show/hide cycle works end-to-end

#### Why Previous Tests Failed ❌:
- Didn't actually run animations in browser
- Didn't validate real DOM positions
- Didn't check animation direction or timing
- Assumed behavior instead of measuring it
- Were "worthless" as user noted

## Working Implementation

This design documents the **working** implementation extracted from `wb_modal_webcomponent.html` that:

1. **Actually works** - Proven in standalone HTML file
2. **Self-contained** - No external dependencies to break
3. **Simple** - 345 lines JS vs 945 lines in broken version
4. **Reliable** - Consistent animations and positioning
5. **Tested** - Real tests that catch regressions

The 4-hour debugging session failed because the original implementation was fundamentally over-engineered with external dependencies and complex config systems. This working version proves that simpler is better.