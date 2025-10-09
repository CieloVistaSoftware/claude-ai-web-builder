# WB Tab Component

A flexible, accessible tabbed interface component with multiple variants and keyboard navigation support.

## Features

- **Multiple Variants**: Support for default, pills, underline, and card-style tabs
- **Accessible**: Full keyboard navigation and screen reader support with ARIA attributes
- **Responsive**: Horizontal and vertical orientations with mobile optimization
- **Performance**: Lazy loading and smooth animations for optimal UX
- **Themeable**: Dark and light theme support with CSS custom properties
- **Event-Driven**: Comprehensive event system for tab interactions

## Basic Usage

```html
<wb-tab theme="dark" variant="default" active-tab="tab1">
  <!-- Tab Headers -->
  <wb-tab-item tab-id="tab1" icon="📖">Documentation</wb-tab-item>
  <wb-tab-item tab-id="tab2" icon="🎯">Examples</wb-tab-item>
  
  <!-- Tab Panels -->
  <wb-tab-panel tab-for="tab1">
    <p>Documentation content here...</p>
  </wb-tab-panel>
  <wb-tab-panel tab-for="tab2">
    <p>Examples content here...</p>
  </wb-tab-panel>
</wb-tab>
```

## Attributes

### wb-tab (Main Container)

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `active-tab` | string | `"0"` | Index or ID of the initially active tab |
| `theme` | string | `"auto"` | Theme setting: `light`, `dark`, `auto` |
| `orientation` | string | `"horizontal"` | Layout orientation: `horizontal`, `vertical` |
| `variant` | string | `"default"` | Visual variant: `default`, `pills`, `underline`, `card` |
| `closable` | boolean | `false` | Allow tabs to be closed with close buttons |
| `lazy-load` | boolean | `false` | Only render tab content when the tab becomes active |
| `scrollable` | boolean | `true` | Enable horizontal scrolling for overflow tabs |
| `animated` | boolean | `true` | Enable smooth transitions between tabs |
| `disabled` | boolean | `false` | Disable the entire tab component |

### wb-tab-item (Tab Header)

| Attribute | Type | Description |
|-----------|------|-------------|
| `tab-id` | string | Unique identifier for the tab (required) |
| `disabled` | boolean | Disable this specific tab |
| `closable` | boolean | Allow this tab to be closed |
| `icon` | string | Icon to display in the tab header |

### wb-tab-panel (Tab Content)

| Attribute | Type | Description |
|-----------|------|-------------|
| `tab-for` | string | ID of the tab this panel belongs to (required) |
| `lazy` | boolean | Lazy load this panel's content |

## Variants

### Default
Standard tab styling with clean borders and hover effects.

```html
<wb-tab variant="default">
  <!-- tabs here -->
</wb-tab>
```

### Pills
Rounded, pill-shaped tabs with background fills.

```html
<wb-tab variant="pills">
  <!-- tabs here -->
</wb-tab>
```

### Underline
Minimal tabs with underline indicators for active state.

```html
<wb-tab variant="underline">
  <!-- tabs here -->
</wb-tab>
```

### Card
Card-style tabs with elevated appearance.

```html
<wb-tab variant="card">
  <!-- tabs here -->
</wb-tab>
```

## Orientations

### Horizontal (Default)
Standard horizontal tab layout.

```html
<wb-tab orientation="horizontal">
  <!-- tabs here -->
</wb-tab>
```

### Vertical
Vertical tab layout with side navigation.

```html
<wb-tab orientation="vertical">
  <!-- tabs here -->
</wb-tab>
```

## JavaScript API

### Methods

```javascript
const tabComponent = document.querySelector('wb-tab');

// Switch to a specific tab
tabComponent.switchTo('tab-id');

// Add a new tab
tabComponent.addTab('new-tab-id', 'New Tab', 'Content here');

// Remove a tab
tabComponent.removeTab('tab-id');

// Get active tab
const activeTab = tabComponent.getActiveTab();

// Get all tabs
const allTabs = tabComponent.getAllTabs();

// Enable/disable tabs
tabComponent.enableTab('tab-id');
tabComponent.disableTab('tab-id');
```

### Events

```javascript
// Tab change event
tabComponent.addEventListener('wb-tab-change', (e) => {
  console.log('Active tab:', e.detail.activeTab);
  console.log('Previous tab:', e.detail.previousTab);
  console.log('Tab element:', e.detail.tabElement);
});

// Tab close event (when closable tabs are used)
tabComponent.addEventListener('wb-tab-close', (e) => {
  console.log('Tab closed:', e.detail.tabId);
  console.log('Can be prevented:', e.preventDefault());
});

// Tab add event
tabComponent.addEventListener('wb-tab-add', (e) => {
  console.log('Tab added:', e.detail.tabId);
});

// Tab remove event
tabComponent.addEventListener('wb-tab-remove', (e) => {
  console.log('Tab removed:', e.detail.tabId);
});
```

## Accessibility

The wb-tab component follows WCAG 2.1 guidelines and includes:

- **Keyboard Navigation**: Tab, Arrow keys, Enter, Space, Home, End
- **ARIA Attributes**: Proper roles, labels, and states
- **Screen Reader Support**: Clear announcements and navigation
- **Focus Management**: Visible focus indicators and logical tab order

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from tab list |
| `Arrow Keys` | Navigate between tabs |
| `Enter/Space` | Activate focused tab |
| `Home` | Move to first tab |
| `End` | Move to last tab |
| `Delete` | Close tab (if closable) |

## Theming

### CSS Custom Properties

```css
:root {
  /* Tab colors */
  --wb-tab-bg: #ffffff;
  --wb-tab-border: #e2e8f0;
  --wb-tab-text: #64748b;
  --wb-tab-text-active: #1e293b;
  --wb-tab-bg-active: #f8fafc;
  
  /* Tab spacing */
  --wb-tab-padding: 0.75rem 1rem;
  --wb-tab-gap: 0.25rem;
  --wb-tab-border-radius: 0.375rem;
  
  /* Animations */
  --wb-tab-transition: all 0.2s ease;
}

/* Dark theme */
[data-theme="dark"] {
  --wb-tab-bg: #1e293b;
  --wb-tab-border: #334155;
  --wb-tab-text: #cbd5e1;
  --wb-tab-text-active: #f1f5f9;
  --wb-tab-bg-active: #334155;
}
```

### Custom Styling

```css
/* Custom tab variant */
wb-tab[variant="custom"] .wb-tab-item {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
}

/* Custom active state */
wb-tab[variant="custom"] .wb-tab-item[aria-selected="true"] {
  background: linear-gradient(135deg, #4338ca, #7c3aed);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
}
```

## Examples

### Basic Two-Tab Example

```html
<wb-tab theme="dark" active-tab="overview">
  <wb-tab-item tab-id="overview" icon="📋">Overview</wb-tab-item>
  <wb-tab-item tab-id="details" icon="📊">Details</wb-tab-item>
  
  <wb-tab-panel tab-for="overview">
    <h3>Overview</h3>
    <p>This is the overview content...</p>
  </wb-tab-panel>
  
  <wb-tab-panel tab-for="details">
    <h3>Details</h3>
    <p>This is the detailed content...</p>
  </wb-tab-panel>
</wb-tab>
```

### Pills Variant with Icons

```html
<wb-tab variant="pills" theme="dark" active-tab="home">
  <wb-tab-item tab-id="home" icon="🏠">Home</wb-tab-item>
  <wb-tab-item tab-id="profile" icon="👤">Profile</wb-tab-item>
  <wb-tab-item tab-id="settings" icon="⚙️">Settings</wb-tab-item>
  
  <wb-tab-panel tab-for="home">
    <p>Welcome to the home page!</p>
  </wb-tab-panel>
  
  <wb-tab-panel tab-for="profile">
    <p>Your profile information...</p>
  </wb-tab-panel>
  
  <wb-tab-panel tab-for="settings">
    <p>Application settings...</p>
  </wb-tab-panel>
</wb-tab>
```

### Vertical Orientation

```html
<wb-tab orientation="vertical" variant="underline" active-tab="docs">
  <wb-tab-item tab-id="docs">Documentation</wb-tab-item>
  <wb-tab-item tab-id="api">API Reference</wb-tab-item>
  <wb-tab-item tab-id="examples">Examples</wb-tab-item>
  
  <wb-tab-panel tab-for="docs">
    <h3>Documentation</h3>
    <p>Component documentation...</p>
  </wb-tab-panel>
  
  <wb-tab-panel tab-for="api">
    <h3>API Reference</h3>
    <p>API methods and properties...</p>
  </wb-tab-panel>
  
  <wb-tab-panel tab-for="examples">
    <h3>Code Examples</h3>
    <p>Usage examples...</p>
  </wb-tab-panel>
</wb-tab>
```

### Closable Tabs

```html
<wb-tab closable="true" active-tab="tab1">
  <wb-tab-item tab-id="tab1" closable="true">Closable Tab 1</wb-tab-item>
  <wb-tab-item tab-id="tab2" closable="true">Closable Tab 2</wb-tab-item>
  <wb-tab-item tab-id="tab3" closable="false">Fixed Tab</wb-tab-item>
  
  <wb-tab-panel tab-for="tab1">Content 1</wb-tab-panel>
  <wb-tab-panel tab-for="tab2">Content 2</wb-tab-panel>
  <wb-tab-panel tab-for="tab3">Content 3</wb-tab-panel>
</wb-tab>
```

## Browser Support

- **Chrome/Edge**: 67+
- **Firefox**: 63+
- **Safari**: 13.1+
- **Mobile**: iOS Safari 13.1+, Chrome Android 67+

## Dependencies

- **Custom Elements API**: Required for web component functionality
- **CSS Custom Properties**: Required for theming
- **ES6 Classes**: Required for component implementation

## File Structure

```
wb-tab/
├── wb-tab.js           # Component implementation
├── wb-tab.css          # Component styles
├── wb-tab.schema.json  # Component schema
├── wb-tab.md           # Documentation (this file)
├── wb-tab-demo.html    # Interactive demo
└── wb-tab-test.html    # Component test page
```

## Development

### Testing

Use the test page to verify component functionality:

```bash
# Serve the component directory
python -m http.server 8080

# Open test page
http://localhost:8080/wb-tab-test.html
```

### Building

The component is built with vanilla JavaScript and requires no build step. Simply include the CSS and JavaScript files:

```html
<link rel="stylesheet" href="wb-tab.css">
<script src="wb-tab.js"></script>
```

## Contributing

1. Test changes using `wb-tab-test.html`
2. Update documentation in `wb-tab.md`
3. Ensure accessibility compliance
4. Follow the component API patterns
5. Update schema if attributes change

## License

Part of the WB Component System. See main project license for details.