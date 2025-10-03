# WB Nav Component

A responsive, accessible navigation component for the Website Builder system with dark mode styling and keyboard navigation.

## Overview

The WB Nav component provides a flexible navigation solution that adapts to different screen sizes and integrates seamlessly with the Website Builder's design system. It features dropdown menus, mobile-friendly hamburger navigation, and comprehensive accessibility support.

## Features

### 🎯 **Core Navigation**
- **Responsive Design**: Desktop horizontal, mobile hamburger menu
- **Dropdown Support**: Multi-level nested menu items
- **Active State**: Highlights current page/section
- **Smooth Animations**: CSS transitions for hover and expand states

### 🌓 **Theme Integration**
- **Dark Mode**: Default styling with purple accents
- **Light Mode**: Clean alternative theme
- **CSS Variables**: Fully customizable colors
- **Brand Integration**: Matches Website Builder design system

### ♿ **Accessibility Features**
- **Keyboard Navigation**: Full arrow key and tab support
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators
- **Touch Friendly**: Large touch targets on mobile

### 📱 **Mobile Responsive**
- **Hamburger Menu**: Collapsible mobile navigation
- **Touch Gestures**: Swipe and tap interactions
- **Viewport Adaptive**: Adjusts layout based on screen size
- **Performance Optimized**: Minimal DOM manipulation

## Installation

### Direct Include
```xml
<link rel="stylesheet" href="path/to/wb-nav.css">
<script src="path/to/wb-nav.js"></script>
```

### ES6 Module
```javascript
import './path/to/wb-nav.js';
```

## Basic Usage

### Simple Navigation
```html
<wb-nav id="main-nav"></wb-nav>

<script>
  // Create nav items
  const navItems = [
    {id: 'home', text: 'Home', href: '#home', active: true},
    {id: 'about', text: 'About', href: '#about'},
    {id: 'services', text: 'Services', href: '#services'},
    {id: 'contact', text: 'Contact', href: '#contact'}
  ];
  
  // Initialize navigation
  const nav = WBNav.create(navItems);
  document.getElementById('main-nav').replaceWith(nav);
</script>
```

### Using Web Component Directly
```html
<wb-nav 
  items='[{"text":"Home","href":"#home","active":true},{"text":"About","href":"#about"}]'
  layout="horizontal"
  variant="default">
</wb-nav>
```

### Dropdown Menu Example
```javascript
const navItems = [
  {
    id: 'products',
    text: 'Products',
    href: '#products',
    children: [
      {text: 'Software', href: '#software'},
      {text: 'Hardware', href: '#hardware'},
      {text: 'Services', href: '#services'}
    ]
  },
  {
    id: 'resources',
    text: 'Resources',
    href: '#resources',
    children: [
      {text: 'Documentation', href: '#docs'},
      {text: 'Support', href: '#support'},
      {text: 'Blog', href: '#blog'}
    ]
  }
];

const nav = WBNav.create(navItems, {
  dropdownEnabled: true,
  hoverDelay: 200
});
```

## Configuration Options

### Layout Options
- **horizontal**: Default horizontal navigation bar
- **vertical**: Vertical sidebar navigation
- **top-nav**: Fixed top navigation
- **left-nav**: Left sidebar navigation
- **right-nav**: Right sidebar navigation

### Style Variants
- **default**: Standard navigation style
- **pills**: Pill-shaped navigation items
- **tabs**: Tab-style navigation
- **minimal**: Minimalist design
- **gradient**: Gradient background style

## Styling

### CSS Variables
```css
:root {
  --wb-nav-height: 4rem;
  --wb-nav-font-size: 0.875rem;
  --wb-nav-transition: all 0.3s ease;
  --wb-nav-z-index: 100;
  --wb-nav-padding: 1rem 2rem;
  --wb-nav-item-padding: 0.5rem 1rem;
  --wb-nav-border-radius: 6px;
}
```

### Dark Mode
```css
[data-theme="dark"] .wb-nav {
  background: var(--neutral-800);
  color: var(--neutral-100);
}
```

## Events

### Available Events
- **wbNavReady**: Navigation initialized
- **wbNavItemClick**: Navigation item clicked
- **wbNavActiveChange**: Active item changed
- **wbNavExpand**: Mobile menu expanded
- **wbNavCollapse**: Mobile menu collapsed

### Event Handling
```javascript
document.addEventListener('wbNavItemClick', (e) => {
  console.log('Navigation item clicked:', e.detail);
  // e.detail contains: {item, link, index, id, nav}
});
```

## API Methods

### WBNav.create(items, options)
Creates a new navigation instance.

### WBNav.setLayout(nav, layoutName)
Changes the navigation layout.

### WBNav.setActiveItem(nav, itemId)
Sets the active navigation item.

### WBNav.addItem(nav, item)
Adds a new navigation item.

### WBNav.removeItem(nav, itemId)
Removes a navigation item.

## Accessibility

The navigation component follows WCAG 2.1 guidelines:

- **Keyboard Navigation**: Arrow keys, Tab, Enter, and Escape
- **Screen Reader Support**: Proper ARIA attributes
- **Focus Management**: Clear focus indicators
- **Mobile Accessibility**: Large touch targets

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- Lightweight: ~15KB unminified
- No dependencies
- CSS animations for smooth transitions
- Efficient DOM manipulation

## Best Practices

1. **Limit Top-Level Items**: Keep to 7±2 items for usability
2. **Clear Labels**: Use descriptive, concise text
3. **Active States**: Always indicate current page
4. **Mobile First**: Design for mobile, enhance for desktop
5. **Accessibility**: Test with keyboard and screen readers

## Troubleshooting

### Common Issues

**Navigation not showing:**
- Check that CSS and JS files are loaded
- Verify element IDs match
- Check console for errors

**Mobile menu not working:**
- Ensure viewport meta tag is set
- Check JavaScript is enabled
- Verify touch events are supported

**Styling issues:**
- Check CSS variable definitions
- Verify theme classes are applied
- Inspect for CSS conflicts

## Examples

### Complete Example
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="wb-nav.css">
</head>
<body>
  <wb-nav 
    id="main-nav"
    layout="horizontal"
    variant="default"
    brand-text="My Website"
    brand-href="/">
  </wb-nav>
  
  <script src="wb-nav.js"></script>
  <script>
    const nav = document.getElementById('main-nav');
    nav.setItems([
      {id: 'home', text: 'Home', href: '/', active: true},
      {id: 'about', text: 'About', href: '/about'},
      {id: 'contact', text: 'Contact', href: '/contact'}
    ]);
  </script>
</body>
</html>
```