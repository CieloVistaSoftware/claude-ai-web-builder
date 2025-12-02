# WB Button Component
## New Features (2025-12-01)

- **clipboard attribute**: Add `clipboard` to any `<wb-button>` (single or group) to copy the original markup to clipboard when clicked.
- **examples attribute**: Add `examples` to a group `<wb-button>` to automatically generate a code example block below the button group, showing the original markup for copy-paste.
- **Automatic Example Block**: No manual code block needed; the component renders a textarea and copy button when `examples` is present.
- **Playwright/component tests**: Automated tests verify that the examples block is rendered and the copy button works as expected.

### Usage

#### Clipboard (Single Button)
```html
<wb-button clipboard>Copy Me</wb-button>
```

#### Clipboard (Group)
```html
<wb-button group="demo" clipboard>
  <wb-button class="btn-a">A</wb-button>
  <wb-button class="btn-b">B</wb-button>
</wb-button>
```

#### Examples (Auto Code Block)
```html
<wb-button group="demo" examples>
  <wb-button class="btn-a">A</wb-button>
  <wb-button class="btn-b">B</wb-button>
</wb-button>
<!-- The code block is generated automatically below -->
```

#### Combined
```html
<wb-button group="demo" clipboard examples>
  <wb-button class="btn-a">A</wb-button>
  <wb-button class="btn-b">B</wb-button>
</wb-button>
```

#### Test Coverage
- Playwright and Jest tests ensure the examples block is rendered and the copy button works for both single and group buttons.

A versatile, reactive button component built with Web Components (Custom Elements v1), featuring signal-based state management, Shadow DOM architecture, and multiple variants, sizes, and states.

## Features

- ✅ **Shadow DOM Architecture**: Proper encapsulation with automatic CSS loading via `import.meta.url`
- ✅ **CSS Preservation**: Render method preserves `<link>` and `<style>` elements during re-renders
- ✅ **Auto-width Buttons**: Buttons automatically fit text content with exactly 1rem padding on each side
- ✅ **Multiple Variants**: Primary (blue), Secondary (gray), Success (green), Toggle (interactive on/off)
- ✅ **Flexible Sizing**: Small (1.125rem), Medium (1.5rem - default), Large (2rem)
- ✅ **Interactive States**: Normal, Disabled, Active
- ✅ **Status Indicators**: Visual feedback dots (active/green, inactive/red, neutral/gray)
- ✅ **Toggle Functionality**: Built-in toggle state with visual feedback (checkmark when active)
- ✅ **Reactive Architecture**: Signal-based state management with automatic re-rendering
- ✅ **Grid Layouts**: Pre-built grid (`wb-btn-grid--three`) and group (`wb-btn-group`) layouts
- ✅ **CSS Variables**: Fully customizable via CSS custom properties

## Installation

```html
<!-- Load the component -->
<script type="module" src="./wb-button.js"></script>

<!-- Optional: Load global styles -->
<link rel="stylesheet" href="../../styles/main.css">
```

## Basic Usage

```html
<!-- Simple primary button -->
<wb-button variant="primary">Click Me</wb-button>

<!-- Large secondary button -->
<wb-button variant="secondary" size="large">Large Button</wb-button>

<!-- Disabled success button -->
<wb-button variant="success" disabled>Disabled</wb-button>
```

## Shadow DOM Architecture

### CSS Loading
The component uses `import.meta.url` to correctly resolve CSS paths relative to the component file:

```javascript
// CORRECT - Uses import.meta.url for proper path resolution
link.href = new URL('./wb-button.css', import.meta.url).href;

// WRONG - Absolute paths don't work across different contexts
link.href = '/components/wb-button/wb-button.css';

// WRONG - Simple relative paths resolve from HTML page, not component
link.href = './wb-button.css';
```

### Render Method CSS Preservation
The render() method must preserve CSS links when updating innerHTML:

```javascript
render() {
  const html = `<button>...</button>`;
  
  if (this.shadowRoot) {
    // CRITICAL: Save existing links/styles before clearing
    const existingLinks = Array.from(this.shadowRoot.querySelectorAll('link[rel="stylesheet"]'));
    const existingStyles = Array.from(this.shadowRoot.querySelectorAll('style'));
    
    // Update HTML
    this.shadowRoot.innerHTML = html;
    
    // Re-append CSS links and styles
    existingLinks.forEach(link => this.shadowRoot.appendChild(link));
    existingStyles.forEach(style => this.shadowRoot.appendChild(style));
  } else {
    this.innerHTML = html;
  }
}
```

**Why This Matters:**
- Without preservation, `innerHTML` destroys the CSS `<link>` elements
- Results in unstyled components (gray buttons, no colors)
- Diagnostic tool section 6.5 tests for this issue

## Button Sizing

Buttons automatically size to fit their text content with exactly 1rem padding on each side:

```css
.wb-btn {
  --wb-btn-padding: 0 1rem;  /* Exactly 1rem on each side */
  width: auto;               /* Auto-width to fit content */
  min-width: auto;           /* No minimum width constraint */
}
```

**Results:**
- "Save" button: text width + 2rem (1rem each side)
- "Continue" button: text width + 2rem
- "Submit Application" button: text width + 2rem

## Variants

### Primary (Blue)
Used for main/primary actions. Blue background with white text.

```html
<wb-button variant="primary">Primary Action</wb-button>
```

**Colors:**
- Background: `var(--primary, #6366f1)`
- Hover: `var(--primary-dark, #4f46e5)`
- Text: White

### Secondary (Gray)
Used for secondary/alternative actions. Dark gray background.

```html
<wb-button variant="secondary">Secondary Action</wb-button>
```

**Colors:**
- Background: `var(--bg-tertiary, #1e1e1e)`
- Hover: `var(--bg-secondary, #2a2a2a)` with blue border
- Text: White

### Success (Green)
Used for positive/confirm actions. Green background.

```html
<wb-button variant="success">Confirm</wb-button>
```

**Colors:**
- Background: `var(--success-color, #10b981)`
- Hover: `var(--success-dark, #059669)`
- Text: White

### Toggle
Special interactive variant that switches between inactive (gray) and active (green) states. Shows checkmark (✓) when active.

```html
<wb-button variant="toggle">Toggle Me</wb-button>
<wb-button variant="toggle" active>Pre-activated</wb-button>
```

**Colors:**
- Inactive: Dark gray background (`#1e1e1e`), light gray text (`#a0a0a0`)
- Active: Green background (`#10b981`), white text with ✓ checkmark
- Disabled: Grayed out, not interactive

## Sizes

Control button height and font size with the `size` attribute.

```html
<wb-button size="small">Small</wb-button>   <!-- 1.125rem height, 0.6rem font -->
<wb-button size="medium">Medium</wb-button> <!-- 1.5rem height, 0.75rem font (default) -->
<wb-button size="large">Large</wb-button>   <!-- 2rem height, 0.9rem font -->
```

**Size Specifications:**
- **Small**: `height: 1.125rem`, `font-size: 0.6rem`, `padding: 0 0.4rem`
- **Medium**: `height: 1.5rem`, `font-size: 0.75rem`, `padding: 0 1rem` (default)
- **Large**: `height: 2rem`, `font-size: 0.9rem`, `padding: 0 0.75rem`

## States

### Active
Adds the `active` class to the button. Primarily used with toggle buttons to show selected state.

```html
<wb-button variant="primary" active>Active Button</wb-button>
<wb-button variant="toggle" active>Active Toggle</wb-button>
```

### Disabled
Prevents interaction, reduces opacity, and grays out the button.

```html
<wb-button disabled>Cannot Click</wb-button>
<wb-button variant="toggle" disabled>Disabled Toggle</wb-button>
```

**Disabled Styling:**
- Opacity: 0.5
- Background: `var(--neutral-600, #4a5568)`
- Text: `var(--neutral-400, #9ca3af)`
- Cursor: `not-allowed`
- No hover effects

## Status Indicators

Add small colored dots to show status. The dot appears on the right side of the button text.

```html
<wb-button status="active">Active Status</wb-button>     <!-- Green dot -->
<wb-button status="inactive">Inactive Status</wb-button> <!-- Red dot -->
<wb-button status="neutral">Neutral Status</wb-button>   <!-- Gray dot -->
```

**Status Colors:**
- **active**: Green (`#10b981`) with glow effect
- **inactive**: Red (`#ef4444`) with glow effect
- **neutral**: Gray (`#6b7280`) with subtle glow

## Events

The component fires custom events that bubble up the DOM.

### wb-button:click
Fired when button is clicked (unless disabled).

```javascript
document.addEventListener('wb-button:click', (e) => {
  console.log('Variant:', e.detail.variant);
  console.log('Button:', e.detail.button);
});
```

**Event Detail:**
```javascript
{
  button: wb-button,      // Reference to the component
  variant: 'primary',     // Button variant
  value: null            // Optional value property
}
```

### wb-button:toggle
Fired when toggle button state changes (only for `variant="toggle"`).

```javascript
document.addEventListener('wb-button:toggle', (e) => {
  console.log('Toggle is now:', e.detail.active ? 'ON' : 'OFF');
});
```

**Event Detail:**
```javascript
{
  button: wb-button,      // Reference to the component
  active: true,          // Current active state
  value: null           // Optional value property
}
```

### wb-button:ready
Fired when component is fully initialized and connected to DOM.

```javascript
document.addEventListener('wb-button:ready', (e) => {
  console.log('Button ready:', e.detail.variant, e.detail.size);
});
```

## Layout Utilities

### Three-Column Grid
Create a responsive 3-column button grid with automatic spacing.

```html
<div class="wb-btn-grid--three">
  <wb-button>Button 1</wb-button>
  <wb-button>Button 2</wb-button>
  <wb-button>Button 3</wb-button>
  <wb-button>Button 4</wb-button>
  <wb-button>Button 5</wb-button>
  <wb-button>Button 6</wb-button>
</div>
```

**Features:**
- Grid gap: `0.5rem`
- Columns: `repeat(3, auto)`
- Removes button margins automatically
- Mobile responsive (2 columns on small screens)

### Button Groups
Create connected button groups with no gaps.

```html
<div class="wb-btn-group">
  <wb-button variant="success">Save</wb-button>
  <wb-button variant="primary">Edit</wb-button>
  <wb-button variant="secondary">Delete</wb-button>
</div>
```

**Features:**
- No gaps between buttons
- First button: rounded left corners
- Last button: rounded right corners
- Middle buttons: no border radius

### Other Grid Classes
```html
<!-- 2-column grid (default) -->
<div class="wb-btn-grid">...</div>

<!-- Single column -->
<div class="wb-btn-grid--single">...</div>

<!-- 4-column grid -->
<div class="wb-btn-grid--four">...</div>
```

## JavaScript API

The component extends `WBBaseComponent` and provides signal-based reactivity.

### Reactive State
Internal state uses signals (getter/setter/subscriber pattern):

```javascript
const button = document.querySelector('wb-button');

// Get current state
button.getActive();   // Returns: true/false
button.getVariant();  // Returns: 'primary', 'secondary', etc.
button.getSize();     // Returns: 'small', 'medium', 'large'
button.getDisabled(); // Returns: true/false
```

### Programmatic Updates
```javascript
const button = document.querySelector('wb-button');

// Update attributes (triggers re-render)
button.setAttribute('variant', 'success');
button.setAttribute('size', 'large');
button.setAttribute('active', '');
button.removeAttribute('disabled');
```

### Observed Attributes
The following attributes trigger `attributeChangedCallback`:
- `variant` - Button variant
- `size` - Button size
- `disabled` - Disabled state (presence check)
- `active` - Active state (presence check)
- `image` - Image source
- `status` - Status indicator type
- `background-image` - Background image URL

## Styling & Customization

The component uses CSS variables for easy theming. Override these in your CSS:

```css
:root {
  /* Primary color */
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  
  /* Success color */
  --success-color: #10b981;
  --success-dark: #059669;
  
  /* Error color (for status indicators) */
  --error-color: #ef4444;
  
  /* Background colors */
  --bg-secondary: #2a2a2a;
  --bg-tertiary: #1e1e1e;
  
  /* Text colors */
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  
  /* Border */
  --border-color: #404040;
  
  /* Button-specific */
  --wb-btn-height: 1.5rem;
  --wb-btn-font-size: 0.75rem;
  --wb-btn-border-radius: 6px;
  --wb-btn-transition: all 0.2s ease;
  --wb-btn-padding: 0 1rem;
}
```

### Custom Styling Example
```css
/* Make all primary buttons purple */
.wb-btn--primary {
  --primary: #8b5cf6;
  --primary-dark: #7c3aed;
}

/* Larger default buttons */
:root {
  --wb-btn-height: 2rem;
  --wb-btn-font-size: 1rem;
}
```

## Diagnostic Tool

Use `wb-shadow-diagnostics.html` to test and debug the component:

```html
<!-- Navigate to -->
/components/wb-shadow-diagnostics.html
```

**Tests Performed:**
1. **Environment Check** - Custom Elements API, Shadow DOM support
2. **CSS Variables** - Validates all required CSS vars exist
3. **Component Registration** - Confirms customElements.define() worked
4. **Shadow DOM Structure** - Verifies shadowRoot creation
5. **CSS Loading** - Checks CSS link presence and validates path format
6. **CSS Persistence** - Tests if render() preserves CSS links during re-renders
7. **Element Inspection** - Counts and categorizes shadow DOM elements
8. **Computed Styles** - Validates colors and display properties
9. **Dimensions & Visibility** - Measures component size
10. **Attributes & Reactivity** - Tests attribute changes
11. **Raw HTML Dump** - Shows actual shadow DOM content
12. **Final Verdict** - Overall pass/fail with detailed issue list

**Common Issues Detected:**
- ❌ CSS link missing in Shadow DOM
- ❌ Absolute CSS paths (`/components/...`) instead of relative
- ❌ CSS link destroyed by render() using innerHTML
- ❌ Wrong colors (gray instead of variant colors)
- ❌ Red text (CSS failed to load)

## Troubleshooting

### Issue: Buttons are all gray, no colors
**Cause:** CSS not loading in Shadow DOM  
**Fix:** Check that CSS link uses `import.meta.url`:
```javascript
link.href = new URL('./wb-button.css', import.meta.url).href;
```

### Issue: Buttons lose styling after interaction
**Cause:** render() destroying CSS links with innerHTML  
**Fix:** Preserve links before clearing:
```javascript
const existingLinks = Array.from(this.shadowRoot.querySelectorAll('link'));
this.shadowRoot.innerHTML = html;
existingLinks.forEach(link => this.shadowRoot.appendChild(link));
```

### Issue: Buttons too wide or too narrow
**Cause:** Fixed width constraints  
**Fix:** Use auto-width in CSS:
```css
.wb-btn {
  width: auto;
  min-width: auto;
  padding: 0 1rem;
}
```

### Issue: Diagnostic tool shows "No CSS link in Shadow DOM"
**Cause:** CSS link never created or destroyed by render()  
**Solution 1:** Add CSS link in connectedCallback():
```javascript
if (this.shadowRoot) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./wb-button.css', import.meta.url).href;
  this.shadowRoot.appendChild(link);
}
```

**Solution 2:** Fix render() to preserve links (see above)

## Architecture

**Component Structure:**
- Extends `WBBaseComponent` for common functionality (dark mode, etc.)
- Uses Shadow DOM for proper encapsulation
- Signal-based reactive state management
- Automatic CSS loading via `import.meta.url`
- CSS preservation in render() method
- Event-driven architecture with custom events

**File Structure:**
```
wb-button/
├── wb-button.js          # Component implementation
├── wb-button.css         # Component styles (auto-width, 1rem padding)
├── wb-button.md          # Documentation (this file)
├── wb-button-demo.html   # Live demo
└── wb-button.schema.json # JSON schema (optional)
```

**Key Implementation Details:**
1. **Shadow DOM Creation:** Handled by WBBaseComponent when `useShadow = true`
2. **CSS Loading:** Uses `import.meta.url` for correct path resolution
3. **CSS Preservation:** render() saves and re-appends `<link>` elements
4. **Auto-width:** CSS uses `width: auto` and `padding: 0 1rem`
5. **Reactive Updates:** Signal-based subscriptions trigger render()

## Browser Support

Works in all modern browsers that support:
- Web Components (Custom Elements v1)
- Shadow DOM v1
- ES6 Modules with `import.meta.url`
- CSS Custom Properties (CSS Variables)

**Supported:**
- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Examples

### Complete Form
```html
<form>
  <wb-button variant="primary" size="large">Submit</wb-button>
  <wb-button variant="secondary">Cancel</wb-button>
</form>
```

### Settings Toggle
```html
<div class="settings">
  <wb-button variant="toggle">Dark Mode</wb-button>
  <wb-button variant="toggle" active>Notifications</wb-button>
  <wb-button variant="toggle">Auto-save</wb-button>
</div>
```

### Action Bar
```html
<div class="wb-btn-group">
  <wb-button variant="success" status="active">Live</wb-button>
  <wb-button variant="primary">Edit</wb-button>
  <wb-button variant="secondary">Archive</wb-button>
  <wb-button variant="secondary" status="inactive">Delete</wb-button>
</div>
```

## Testing Checklist

Before deploying, verify:
- [ ] Diagnostic tool shows all tests passing
- [ ] CSS link present in Shadow DOM
- [ ] CSS link persists after attribute changes
- [ ] Buttons have correct variant colors (not gray)
- [ ] Buttons auto-size to text + 1rem padding on each side
- [ ] All variants (primary, secondary, success, toggle) work
- [ ] Disabled state works correctly
- [ ] Toggle functionality works (active/inactive)
- [ ] Events fire correctly (wb-button:click, wb-button:toggle)
- [ ] Grid and group layouts work properly

## Version History

- **v2.0.1**: Fixed Shadow DOM CSS loading with import.meta.url, added CSS persistence in render(), auto-width buttons with 1rem padding
- **v2.0.0**: Signal-based reactive architecture, Shadow DOM implementation, improved CSS variable system
- **v1.0.0**: Initial release with basic button functionality

## License

Part of the WB Framework component library.
