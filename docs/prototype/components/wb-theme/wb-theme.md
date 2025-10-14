# WB Theme Manager & Styles System Integration

A comprehensive theming system that bridges the foundational Styles folder with dynamic theme management.

## Architecture Overview

The WB Theme system creates a multi-layer architecture:

### Layer 1: Foundation (Styles Folder)
- **`styles/_variables.css`** - Global CSS custom properties (design tokens)
- **`styles/_base.css`** - Reset, typography, and foundational component styles  
- **`styles/_utilities.css`** - Utility classes for common patterns

### Layer 2: Theme Control (wb-theme-manager)
- **`wb-theme-manager.js`** - Dynamic theme switching and state management
- **`wb-theme.css`** - Theme-specific overrides and component styles

### Layer 3: Component Integration
- Components consume CSS variables from the foundation
- Theme changes propagate automatically through CSS variable cascade
- Event-driven architecture for theme change notifications

## How the System Works Together

### 1. **Foundation Variables** (styles/_variables.css)
```css
:root {
  --bg-primary: #1e293b;     /* Dark theme default */
  --text-primary: #f1f5f9;
  --primary: #6366f1;
}

/* Light theme overrides */
[data-theme="light"] {
  --bg-primary: #ffffff;     /* Automatically switches */
  --text-primary: #1e293b;
}
```

### 2. **Theme Manager Control** (wb-theme-manager.js)
```javascript
applyTheme(theme) {
  // Changes data-theme attribute to trigger CSS cascade
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
}
```

### 3. **Automatic Component Updates**
```css
/* Any component using foundation variables */
.my-component {
  background-color: var(--bg-primary);  /* Auto-updates when theme changes */
  color: var(--text-primary);           /* No component-specific theme logic needed */
}
```

### 4. **Event-Driven Communication**
```javascript
// Theme manager dispatches events
document.dispatchEvent(new CustomEvent('wb:theme-changed', {
  detail: { theme: 'dark', isDark: true }
}));

// Components can listen and react
document.addEventListener('wb:theme-changed', (e) => {
  this.updateThemeSpecificLogic(e.detail);
});
```

## Features

- 🎨 **Light/Dark/Auto themes** with system preference detection
- 🎯 **Design tokens** for consistent spacing, colors, typography
- 🔧 **Utility classes** for rapid development
- ♿ **Accessibility** support (high contrast, reduced motion)
- ⌨️ **Keyboard shortcuts** (Ctrl+Shift+T to toggle)
- 📱 **Responsive** design utilities
- 🎛️ **Component base styles** for buttons, inputs, cards, modals

## Quick Start

### 1. Include Global Styles

Add to your HTML head:
```html
<link rel="stylesheet" href="components/wb-theme/wb-theme.css">
```

### 2. Add Theme Manager

Add to your HTML body:
```html
<wb-theme-manager show-toggle></wb-theme-manager>
<script src="components/wb-theme/wb-theme-manager.js"></script>
```

### 3. Use in Your Components

```css
.my-component {
    background-color: var(--wb-bg-secondary);
    color: var(--wb-text-primary);
    padding: var(--wb-space-4);
    border-radius: var(--wb-radius-md);
    box-shadow: var(--wb-shadow-sm);
}
```

```html
<div class="wb-card wb-p-4 wb-rounded-lg">
    <h2 class="wb-text-xl wb-font-semibold wb-text-primary">Card Title</h2>
    <p class="wb-text-secondary">Card content with themed colors.</p>
</div>
```

## CSS Custom Properties (From styles/_variables.css)

### Colors
```css
/* Semantic Colors (auto-switch in light/dark themes) */
--bg-primary          /* Main background */
--bg-secondary        /* Card/surface background */
--bg-tertiary         /* Hover/active background */
--text-primary        /* Main text color */
--text-secondary      /* Secondary text */
--text-tertiary       /* Tertiary text */
--text-muted          /* Muted/disabled text */
--border-color        /* Primary border color */
--border-light        /* Light border */
--border-dark         /* Dark border */

/* Brand Colors */
--primary             /* Primary brand color */
--primary-dark        /* Darker primary variant */
--primary-light       /* Lighter primary variant */
--success-color       /* Success state */
--error-color         /* Error state */
--warning-color       /* Warning state */
--info-color          /* Info state */

/* State Colors with RGB variants */
--success-color-rgb: 16, 185, 129;
--error-color-rgb: 239, 68, 68;
--warning-color-rgb: 245, 158, 11;
--info-color-rgb: 59, 130, 246;
```

### Typography
```css
/* Font Families */
--font-sans              /* System font stack */
--font-mono              /* Monospace font stack */

/* Font Sizes */
--text-xs                /* 12px */
--text-sm                /* 14px */
--text-base              /* 16px */
--text-lg                /* 18px */
--text-xl                /* 20px */
--text-2xl               /* 24px */
--text-3xl               /* 30px */
--text-4xl               /* 36px */

/* Font Weights */
--font-light             /* 300 */
--font-normal            /* 400 */
--font-medium            /* 500 */
--font-semibold          /* 600 */
--font-bold              /* 700 */

/* Line Heights */
--leading-tight          /* 1.25 */
--leading-normal         /* 1.5 */
--leading-relaxed        /* 1.75 */
```

### Spacing Scale
```css
--space-xs               /* 4px */
--space-sm               /* 8px */
--space-md               /* 16px */
--space-lg               /* 24px */
--space-xl               /* 32px */
--space-2xl              /* 48px */
--space-3xl              /* 64px */
```

### Other Properties
```css
/* Shadows */
--wb-shadow-xs, --wb-shadow-sm, --wb-shadow-md, --wb-shadow-lg, --wb-shadow-xl

/* Border Radius */
--wb-radius-sm, --wb-radius-base, --wb-radius-md, --wb-radius-lg, --wb-radius-xl

/* Z-Index Scale */
--wb-z-dropdown (1000), --wb-z-modal (1050), --wb-z-tooltip (1070)

/* Transitions */
--wb-transition-colors, --wb-transition-all, --wb-transition-opacity
```

## Utility Classes

### Typography
```css
.wb-text-xs, .wb-text-sm, .wb-text-base, .wb-text-lg, .wb-text-xl
.wb-font-light, .wb-font-normal, .wb-font-medium, .wb-font-semibold, .wb-font-bold
.wb-text-primary, .wb-text-secondary, .wb-text-muted
```

### Spacing
```css
.wb-p-0, .wb-p-1, .wb-p-2, .wb-p-3, .wb-p-4, .wb-p-5, .wb-p-6, .wb-p-8
.wb-m-0, .wb-m-1, .wb-m-2, .wb-m-3, .wb-m-4, .wb-m-5, .wb-m-6, .wb-m-8
```

### Layout
```css
.wb-bg-primary, .wb-bg-secondary, .wb-bg-tertiary
.wb-border, .wb-border-t, .wb-border-b, .wb-border-l, .wb-border-r
.wb-rounded-sm, .wb-rounded, .wb-rounded-md, .wb-rounded-lg, .wb-rounded-xl
.wb-shadow-xs, .wb-shadow-sm, .wb-shadow, .wb-shadow-lg, .wb-shadow-xl
```

### Responsive Utilities
```css
.wb-sm:text-lg    /* >= 640px */
.wb-md:text-xl    /* >= 768px */
.wb-lg:text-2xl   /* >= 1024px */
.wb-xl:text-3xl   /* >= 1280px */
```

## Component Base Styles

### Buttons
```css
.wb-btn              /* Base button style */
.wb-btn-primary      /* Primary button */
.wb-btn-secondary    /* Secondary button */
```

### Inputs
```css
.wb-input           /* Base input style */
```

### Cards
```css
.wb-card            /* Card container */
```

### Modals
```css
.wb-modal           /* Modal content */
.wb-modal-overlay   /* Modal backdrop */
```

## Theme Manager API

### Methods
```javascript
const themeManager = document.querySelector('wb-theme-manager');

themeManager.setTheme('dark');        // Set specific theme
themeManager.toggleTheme();           // Toggle between light/dark
themeManager.cycleTheme();            // Cycle through all themes
themeManager.getTheme();              // Get current theme mode
themeManager.getEffectiveTheme();     // Get active theme (resolves auto)
themeManager.isDarkMode();            // Check if dark mode is active
```

### Events
```javascript
// Listen for theme changes
document.addEventListener('wb:theme-changed', (e) => {
    console.log('Theme changed to:', e.detail.theme);
    console.log('Is dark mode:', e.detail.isDark);
});
```

### Attributes
```html
<!-- Show floating toggle button -->
<wb-theme-manager show-toggle></wb-theme-manager>

<!-- Set initial theme -->
<wb-theme-manager theme="dark"></wb-theme-manager>
```

## Integration with Existing WB Components

### Update Component CSS
Instead of hardcoded colors, use CSS custom properties:

```css
/* Before */
.my-component {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #cccccc;
}

/* After */
.my-component {
    background-color: var(--wb-bg-secondary);
    color: var(--wb-text-primary);
    border: 1px solid var(--wb-border-primary);
}
```

### Add Utility Classes
```html
<!-- Before -->
<div style="padding: 16px; margin: 8px; border-radius: 6px;">

<!-- After -->
<div class="wb-p-4 wb-m-2 wb-rounded-md">
```

### Component Base Classes
```html
<!-- Use predefined component styles -->
<button class="wb-btn wb-btn-primary">Primary Button</button>
<input class="wb-input" type="text" placeholder="Themed input">
<div class="wb-card">Card content</div>
```

## Accessibility Features

- **High Contrast Mode**: Automatically detects and adjusts for high contrast preferences
- **Reduced Motion**: Respects user's motion preferences
- **Focus Indicators**: Consistent focus styling across all components
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard support with logical tab order

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Migration Guide

### From Existing WB Components

1. **Replace hardcoded colors** with CSS custom properties
2. **Add utility classes** instead of custom CSS where possible
3. **Use component base styles** for common elements
4. **Test in both light and dark themes**
5. **Verify accessibility** with high contrast and reduced motion

### Example Migration

```css
/* Before */
.wb-button {
    background: #6366f1;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.wb-button:hover {
    background: #4f46e5;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* After */
.wb-button {
    background: var(--wb-primary);
    color: white;
    padding: var(--wb-button-padding-y) var(--wb-button-padding-x);
    border-radius: var(--wb-radius-md);
    border: none;
    box-shadow: var(--wb-shadow-sm);
    transition: var(--wb-transition-colors);
}

.wb-button:hover {
    background: var(--wb-primary-700);
    box-shadow: var(--wb-shadow-md);
}

/* Or even simpler - use base class */
.wb-button {
    @extend .wb-btn-primary;
}
```

## Best Practices

1. **Always use CSS custom properties** for colors
2. **Prefer utility classes** over custom CSS
3. **Test in both light and dark themes**
4. **Use semantic color names** (primary, secondary) not specific colors
5. **Respect user preferences** (motion, contrast)
6. **Keep consistent spacing** using the spacing scale
7. **Use proper z-index values** from the z-index scale