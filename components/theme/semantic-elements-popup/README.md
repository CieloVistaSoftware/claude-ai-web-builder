```markdown
# component: Semantic Elements Popup

A comprehensive, reusable semantic HTML5 elements showcase component with dark mode styling and interactive features.

## What It Does

The Semantic Elements Popup component provides a complete showcase of HTML5 semantic elements with a professional dark mode design. It includes dynamic theming, accessibility features, and responsive layouts, making it easy to integrate into any project. The component is modular and supports interactive features such as keyboard navigation and focus management.

## Features

- 🏗️ **Comprehensive HTML5 Semantic Elements**: Complete showcase of all semantic HTML5 elements
- 🌙 **Dark Mode Design**: Professional dark theme with glassmorphism effects
- 🎨 **Dynamic Theming**: Real-time color theme updates
- ♿ **Accessibility**: Full keyboard navigation and focus management
- 📱 **Responsive**: Mobile-friendly responsive design
- 🔧 **Modular**: Easy to integrate into any project

## Internal Architecture

The component is structured as follows:

```
semantic-elements-popup/
├── semantic-elements-popup.html    # Main HTML file with complete demo
├── semantic-elements-popup.css     # Comprehensive styling with dark theme
├── semantic-elements-popup.js      # Interactive functionality and API
└── README.md                       # This documentation
```

- **HTML**: Contains the semantic elements and popup structure.
- **CSS**: Provides styling, including dark mode and responsive design.
- **JavaScript**: Handles interactivity, theming, and API functions.

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

## Manual Test

1. **Basic Functionality**:
   - Open the popup using the trigger button.
   - Verify that all semantic elements are displayed correctly.

2. **Dark Mode**:
   - Ensure the dark theme is applied and visually consistent.

3. **Dynamic Theming**:
   - Use the JavaScript API to update theme colors and verify changes.

4. **Accessibility**:
   - Test keyboard navigation and focus trapping within the popup.
   - Use a screen reader to confirm proper ARIA labeling.

5. **Responsive Design**:
   - Resize the browser window to test layouts on desktop, tablet, and mobile.

6. **Browser Compatibility**:
   - Test the component in Chrome, Firefox, Safari, and Edge.

## Accessibility Features

- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Focus Management**: Focus trapping within popup
- ✅ **ARIA Labels**: Proper semantic labeling
- ✅ **Screen Reader**: Compatible with screen readers
- ✅ **Color Contrast**: WCAG compliant color ratios

## License

This component is part of the Claude AI Web Builder project.

## Contributing

Feel free to submit issues and enhancement requests!
```