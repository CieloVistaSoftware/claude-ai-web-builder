# wb-semantic-elements

Web component that ensures all required semantic HTML5 elements exist on the page and creates them if missing.

## Overview

The `wb-semantic-elements` component automatically detects and generates missing semantic HTML5 elements (`<nav>`, `<header>`, `<main>`, `<footer>`) to ensure proper page structure and accessibility compliance.

## Features

- **Auto-Detection**: Checks for existing semantic elements
- **Auto-Generation**: Creates missing elements in correct DOM order
- **Visual Feedback**: Applies visual indicators to auto-generated elements
- **Non-Destructive**: Only adds elements that don't already exist
- **Accessibility**: Improves page structure for screen readers and SEO

## Usage

### Basic Implementation

```html
<wb-semantic-elements></wb-semantic-elements>
```

### With Custom Content

```html
<!-- Component will detect existing elements and only create missing ones -->
<header>
  <h1>My Site</h1>
</header>

<wb-semantic-elements></wb-semantic-elements>

<main>
  <p>Main content here</p>
</main>
```

## Element Creation Order

The component creates missing elements in the following order:

1. **`<nav>`** - Inserted at beginning of body
2. **`<header>`** - Inserted after nav (if nav exists)
3. **`<main>`** - Inserted after header (if header exists)
4. **`<footer>`** - Inserted at end of body

## Visual Indicators

Auto-generated elements receive distinctive styling:

- **Dashed purple borders** (`#6366f1`)
- **Semi-transparent background** highlighting
- **CSS labels** showing element type (e.g., "`<nav> (auto)`")
- **`data-wb-semantic="true"`** attribute for identification

## CSS Classes and Selectors

### Base Styling
```css
[data-wb-semantic] {
  outline: 2px dashed #6366f1;
  background: rgba(99,102,241,0.05);
  margin: 0.5rem 0;
  padding: 0.5rem;
}
```

### Element-Specific Labels
```css
nav[data-wb-semantic]::before { content: "<nav> (auto)"; }
header[data-wb-semantic]::before { content: "<header> (auto)"; }
main[data-wb-semantic]::before { content: "<main> (auto)"; }
footer[data-wb-semantic]::before { content: "<footer> (auto)"; }
```

## Integration Examples

### Development Environment
```html
<!DOCTYPE html>
<html>
<head>
  <title>Dev Page</title>
</head>
<body>
  <!-- Automatically ensures semantic structure -->
  <wb-semantic-elements></wb-semantic-elements>
  
  <div class="content">
    <!-- Your content here -->
  </div>
</body>
</html>
```

### With Existing Structure
```html
<body>
  <header>
    <h1>Existing Header</h1>
  </header>
  
  <!-- Will only create nav, main, and footer if missing -->
  <wb-semanticElements></wb-semanticElements>
  
  <div class="page-content">
    <!-- Content -->
  </div>
</body>
```

## Use Cases

### Development & Testing
- **HTML5 Compliance**: Ensures semantic structure during development
- **Accessibility Auditing**: Identifies missing semantic landmarks
- **SEO Optimization**: Improves page structure for search engines

### Production Support
- **Legacy Page Migration**: Adds semantic structure to existing pages
- **CMS Integration**: Ensures proper structure regardless of content
- **Template Enhancement**: Guarantees semantic compliance

## Browser Support

- **Modern Browsers**: Full support for Web Components
- **CSS Variables**: Uses project design tokens for theming
- **Accessibility**: Compatible with screen readers and assistive technology

## Configuration

The component uses the project's global CSS variables:

```css
:root {
  --primary: #6366f1;        /* Border color */
  --bg-secondary: #1e293b;   /* Background highlight */
  --space-md: 1rem;          /* Spacing */
  --radius-md: 0.375rem;     /* Border radius */
}
```

## API Reference

### Attributes
- **`data-wb-semantic="true"`** - Applied to auto-generated elements

### Methods
- **`ensureSemanticElements()`** - Manually trigger element creation
- **`loadCSS()`** - Load component styles (called automatically)

### Events
The component integrates with the project's event system:

```javascript
// Listen for component initialization
document.addEventListener('wb:semantic-ready', (e) => {
  console.log('Semantic elements ensured');
});
```

## Accessibility Features

- **ARIA Landmarks**: Creates proper landmark structure
- **Screen Reader Support**: Semantic elements improve navigation
- **Keyboard Navigation**: Proper heading hierarchy and structure
- **SEO Benefits**: Search engines can better understand page structure

## Integration with Other Components

### With wb-nav
```html
<wb-semanticElements></wb-semanticElements>
<wb-nav data-layout="top-nav">
  <!-- Navigation items -->
</wb-nav>
```

### With wb-layout
```html
<wb-layout data-layout="left-nav">
  <wb-semanticElements></wb-semanticElements>
  <!-- Layout content -->
</wb-layout>
```

## Troubleshooting

### Common Issues

**Elements not appearing visually:**
- Check if CSS is loaded properly
- Verify `data-wb-semantic` attributes in DevTools

**Elements created when they shouldn't be:**
- Ensure existing elements use proper tag names (`<nav>`, not `<div class="nav">`)
- Check DOM structure before component initialization

**Styling conflicts:**
- Component uses project CSS variables
- Visual indicators can be disabled by overriding CSS

### Debugging

```javascript
// Check what elements were created
const autoElements = document.querySelectorAll('[data-wb-semantic="true"]');
console.log('Auto-generated elements:', autoElements);
```

## Performance

- **Lightweight**: Minimal DOM manipulation
- **Efficient**: Only creates missing elements
- **CSS Loading**: Automatic stylesheet loading with path resolution
- **Memory**: No ongoing listeners or observers

## Version History

- **v1.0.0**: Initial release with basic semantic element creation
- **v1.1.0**: Added visual indicators and CSS integration
- **v1.2.0**: Improved path resolution and project standards compliance

---

*Part of the WB Website Builder component library. For more components and documentation, see the [component overview](../README.md).*