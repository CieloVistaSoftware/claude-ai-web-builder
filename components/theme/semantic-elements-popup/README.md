# Semantic Elements Popup Component

A comprehensive, reusable semantic HTML5 elements showcase component with dark mode styling and interactive features.

## Features

- 🏗️ **Comprehensive HTML5 Semantic Elements**: Complete showcase of all semantic HTML5 elements
- 🌙 **Dark Mode Design**: Professional dark theme with glassmorphism effects
- 🎨 **Dynamic Theming**: Real-time color theme updates
- ♿ **Accessibility**: Full keyboard navigation and focus management
- 📱 **Responsive**: Mobile-friendly responsive design
- 🔧 **Modular**: Easy to integrate into any project

## Files Structure

```
semantic-elements-popup/
├── semantic-elements-popup.html    # Main HTML file with complete demo
├── semantic-elements-popup.css     # Comprehensive styling with dark theme
├── semantic-elements-popup.js      # Interactive functionality and API
└── README.md                       # This documentation
```

## Usage

### Basic Integration

1. **Include the files in your project:**
```html
<link rel="stylesheet" href="path/to/semantic-elements-popup.css">
<script src="path/to/semantic-elements-popup.js"></script>
```

2. **Add the popup HTML to your page:**
```html
<!-- Trigger Button -->
<button class="popup-trigger" onclick="showSemanticPopup()">
    🏗️ View Semantic HTML Elements
</button>

<!-- Popup Container (copy from semantic-elements-popup.html) -->
<div class="semantic-popup" id="semanticPopup">
    <!-- ... popup content ... -->
</div>
```

### JavaScript API

#### Basic Functions
```javascript
// Show the popup
showSemanticPopup();

// Hide the popup
hideSemanticPopup();
```

#### Advanced Usage with Class
```javascript
// Create instance
const popup = new SemanticElementsPopup();

// Update theme colors
popup.updateTheme('#e74c3c', '#f39c12');

// Add dynamic content
popup.addDynamicContent({
    primaryColor: '#3498db',
    accentColor: '#f39c12',
    backgroundColor: '#1a1a2e'
});
```

#### Theme Integration
```javascript
// Update theme when color picker changes
document.getElementById('colorPicker').addEventListener('change', function(e) {
    updateSemanticTheme(e.target.value);
});
```

## Semantic Elements Included

### Document Structure
- `<header>` - Website header
- `<nav>` - Navigation menu
- `<main>` - Main content area
- `<footer>` - Page footer

### Content Elements
- `<article>` - Self-contained content
- `<section>` - Thematic grouping
- `<aside>` - Sidebar content

### Media & Interactive
- `<figure>` & `<figcaption>` - Media with captions
- `<blockquote>` - Quoted content
- `<details>` & `<summary>` - Collapsible content

### Form Elements
- `<fieldset>` & `<legend>` - Form grouping
- Various input types with semantic labeling

### Text Semantics
- `<strong>` - Important text
- `<em>` - Emphasized text
- `<mark>` - Highlighted text
- `<code>` - Inline code
- `<kbd>` - Keyboard input
- `<small>` - Fine print

### List Elements
- `<ol>` - Ordered lists
- `<ul>` - Unordered lists
- `<dl>`, `<dt>`, `<dd>` - Description lists

### HTML5 Semantic Tags
- `<time>` - Date/time values
- `<progress>` - Progress indicators
- `<meter>` - Scalar measurements
- `<address>` - Contact information

### Data Elements
- `<data>` - Machine-readable data
- `<output>` - Calculation results
- `<var>` - Variables
- `<samp>` - Sample output
- `<abbr>` - Abbreviations
- `<dfn>` - Definitions

### Interactive Elements
- `<dialog>` - Modal dialogs
- Advanced `<details>` implementations

## Customization

### CSS Custom Properties
The component uses CSS custom properties for easy theming:

```css
:root {
    --bg-primary: #1a1a2e;
    --bg-secondary: #16213e;
    --bg-tertiary: #0f3460;
    --text-primary: #eee;
    --text-secondary: #ccc;
    --theme-primary: #3498db;
    --theme-accent: #f39c12;
    /* ... more variables ... */
}
```

### Responsive Breakpoints
- Desktop: > 768px (multi-column grid)
- Tablet: 768px (single column)
- Mobile: 480px (stacked layout)

## Accessibility Features

- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Focus Management**: Focus trapping within popup
- ✅ **ARIA Labels**: Proper semantic labeling
- ✅ **Screen Reader**: Compatible with screen readers
- ✅ **Color Contrast**: WCAG compliant color ratios

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Integration Examples

### With Theme Generators
```javascript
// Integrate with color picker
function onColorChange(newColor) {
    updateSemanticTheme(newColor);
    // Update other theme elements
}
```

### With Existing Popups
```javascript
// Use the same popup system
const popup = window.semanticPopup;
popup.showSemanticPopup();
```

### Custom Styling
```css
/* Override default theme */
.semantic-popup {
    --theme-primary: #your-color;
    --theme-accent: #your-accent;
}
```

## License

This component is part of the Claude AI Web Builder project.

## Contributing

Feel free to submit issues and enhancement requests!