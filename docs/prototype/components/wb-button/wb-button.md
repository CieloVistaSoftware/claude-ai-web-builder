# WB Button Component

A standardized button component for the Website Builder system with consistent styling, responsive text sizing, and uniform dimensions across all interfaces.

## Overview

The WB Button component provides a unified button system that ensures consistency across the entire Website Builder application. All buttons have a fixed 5rem width with automatic text scaling and built-in spacing for perfect alignment.

## Key Features

### 📏 **Fixed Dimensions**
- **Width**: Exactly 5rem for all buttons
- **Height**: 1.5rem (configurable via CSS variables)
- **Consistent**: Same size regardless of content length
- **Responsive**: Text automatically scales to fit

### 🎨 **Smart Text Handling**
- **Auto-scaling**: Font size adapts from 0.5rem to 0.75rem based on viewport
- **Text Fitting**: Content automatically shrinks to fit within 5rem width
- **Overflow Protection**: Ellipsis for extremely long text
- **Word Breaking**: Intelligent word wrapping when needed

### 📐 **Built-in Spacing**
- **Margins**: 0.5rem gap on bottom, left, and right sides
- **Grid Ready**: Works perfectly in flex and grid layouts
- **No Overlap**: Automatic spacing prevents button crowding
- **Consistent**: Same spacing behavior across all components

### 🎯 **Multiple Variants**
- **Primary**: Main action buttons with primary color
- **Success**: Confirmation and positive actions
- **Toggle**: On/off state buttons with checkmarks
- **Status Indicators**: Green/red/gray dots for system status
- **Sizes**: Small, default, and large variations

## Installation

### CSS Import
```css
@import url('./path/to/wb-button.css');
```

### HTML Link
```html
<link rel="stylesheet" href="path/to/wb-button.css">
```

## Basic Usage

### Primary Button
```html
<button class="wb-btn wb-btn--primary">
    Save Changes
</button>
```

### Success Button
```html
<button class="wb-btn wb-btn--success">
    ✓ Complete
</button>
```

### Toggle Button
```html
<button class="wb-btn wb-btn--toggle" onclick="toggleFeature()">
    Feature Name
    <span class="wb-btn__check">✓</span>
</button>
```

### Button with Status Indicator
```html
<button class="wb-btn wb-btn--primary">
    <span>Server Status</span>
    <span class="wb-btn__status wb-btn__status--active"></span>
</button>
```

### Button with Icon
```html
<button class="wb-btn wb-btn--primary">
    <span class="wb-btn__icon">🏠</span>
    <span>Home</span>
</button>
```

### Button with Image
```html
<button class="wb-btn wb-btn--primary">
    <img class="wb-btn__image" src="icon.png" alt="Profile">
    <span>Profile</span>
</button>
```

### Icon-Only Button
```html
<button class="wb-btn wb-btn--primary wb-btn--icon-only" title="Settings">
    <span class="wb-btn__icon wb-btn__icon--only">⚙️</span>
</button>
```

### Background Image Button
```html
<button class="wb-btn wb-btn--primary wb-btn--bg-image" style="background-image: url('bg.jpg')">
    Overlay Text
</button>
```

## Button Variants

### Color Variants

| Class | Purpose | Appearance |
|-------|---------|------------|
| `wb-btn--primary` | Main actions, navigation | Primary color background |
| `wb-btn--success` | Confirmations, completion | Success/accent color |
| `wb-btn--toggle` | On/off states, settings | Toggle with checkmark |
| `wb-btn--bg-image` | Visual appeal, branding | Background image with overlay |
| `wb-btn--icon-only` | Compact icon buttons | Square button with only icon |
| `wb-btn--image-only` | Compact image buttons | Square button with only image |

### Status Indicator Classes

| Class | Purpose | Appearance |
|-------|---------|------------|
| `wb-btn__status--active` | Active/healthy state | Green dot with glow |
| `wb-btn__status--inactive` | Inactive/error state | Red dot with glow |
| `wb-btn__status--neutral` | Neutral/pending state | Gray dot with subtle glow |

### Icon & Image Classes

| Class | Purpose | Appearance |
|-------|---------|------------|
| `wb-btn__icon` | Icon left of text | Emoji/symbol with right margin |
| `wb-btn__icon--right` | Icon right of text | Emoji/symbol with left margin |
| `wb-btn__icon--only` | Solo icon | Centered icon, no margins |
| `wb-btn__image` | Image left of text | Small image with right margin |
| `wb-btn__image--right` | Image right of text | Small image with left margin |
| `wb-btn__image--only` | Solo image | Centered image, no margins |

### Size Variants

| Class | Height | Font Size | Use Case |
|-------|--------|-----------|----------|
| `wb-btn--small` | 1.2rem | 0.5-0.65rem | Compact interfaces |
| *(default)* | 1.5rem | 0.5-0.75rem | Standard buttons |
| `wb-btn--large` | 2rem | 0.65-0.9rem | Prominent actions |

## Layout Systems

### Button Grid
```html
<div class="wb-btn-grid">
    <button class="wb-btn wb-btn--primary">Button 1</button>
    <button class="wb-btn wb-btn--primary">Button 2</button>
</div>
```

### Grid Variations
```html
<!-- Single column -->
<div class="wb-btn-grid wb-btn-grid--single">
    <button class="wb-btn wb-btn--primary">Full Width</button>
</div>

<!-- Three columns -->
<div class="wb-btn-grid wb-btn-grid--three">
    <button class="wb-btn wb-btn--primary">One</button>
    <button class="wb-btn wb-btn--primary">Two</button>
    <button class="wb-btn wb-btn--primary">Three</button>
</div>

<!-- Four columns -->
<div class="wb-btn-grid wb-btn-grid--four">
    <button class="wb-btn wb-btn--primary">A</button>
    <button class="wb-btn wb-btn--primary">B</button>
    <button class="wb-btn wb-btn--primary">C</button>
    <button class="wb-btn wb-btn--primary">D</button>
</div>
```

### Button Groups
```html
<div class="wb-btn-group">
    <button class="wb-btn wb-btn--primary">Left</button>
    <button class="wb-btn wb-btn--primary">Center</button>
    <button class="wb-btn wb-btn--primary">Right</button>
</div>
```

## Interactive States

### Toggle Button States
```javascript
// Toggle button functionality
function toggleButton(button) {
    button.classList.toggle('active');
    const isActive = button.classList.contains('active');
    
    // Update aria-pressed for accessibility
    button.setAttribute('aria-pressed', isActive);
    
    // Custom event
    button.dispatchEvent(new CustomEvent('wb-toggle', {
        detail: { active: isActive }
    }));
}

// Status indicator management
function setButtonStatus(button, status) {
    if (window.WBButton && window.WBButton.setStatus) {
        window.WBButton.setStatus(button, status);
    }
}

function getButtonStatus(button) {
    if (window.WBButton && window.WBButton.getStatus) {
        return window.WBButton.getStatus(button);
    }
    return null;
}

// Create buttons with icons and images
function createIconButton(text, icon, variant = 'primary') {
    return window.WBButton.create(text, variant, {
        icon: icon,
        onclick: () => console.log(`${text} clicked`)
    });
}

function createImageButton(text, imageSrc, variant = 'primary') {
    return window.WBButton.create(text, variant, {
        image: imageSrc,
        imageAlt: text,
        onclick: () => console.log(`${text} clicked`)
    });
}

function createIconOnlyButton(icon, title) {
    return window.WBButton.create('', 'iconOnly', {
        icon: icon,
        title: title,
        onclick: () => console.log(`${title} clicked`)
    });
}
```

### Event Handling
```javascript
// Listen for button toggles
document.addEventListener('wb-toggle', (e) => {
    console.log('Button toggled:', e.detail.active);
});

// Button click handling
document.querySelectorAll('.wb-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    });
});
```

## CSS Customization

### CSS Variables
```css
:root {
    /* Button dimensions */
    --wb-btn-height: 1.5rem;
    --wb-btn-font-size: clamp(0.5rem, 2vw, 0.75rem);
    --wb-btn-border-radius: 6px;
    --wb-btn-padding: 0 0.2rem;
    
    /* Animation */
    --wb-btn-transition: all 0.2s ease;
    
    /* Colors (inherited from theme) */
    --primary: #6366f1;
    --primary-dark: #4338ca;
    --accent: #10b981;
}
```

### Custom Button Styles
```css
/* Custom variant */
.wb-btn--custom {
    background: var(--custom-color);
    color: white;
}

.wb-btn--custom:hover {
    background: var(--custom-hover-color);
    transform: translateY(-1px);
}

/* Override font size for specific use case */
.wb-btn--tiny {
    --wb-btn-font-size: 0.35rem;
    --wb-btn-height: 0.6rem;
}
```

## Best Practices

### Text Content
```html
<!-- Good: Concise, clear labels -->
<button class="wb-btn wb-btn--primary">Save</button>
<button class="wb-btn wb-btn--success">✓ Done</button>
<button class="wb-btn wb-btn--primary">🎨 Edit</button>

<!-- Avoid: Long text that doesn't fit -->
<button class="wb-btn wb-btn--primary">Save All Changes to Database</button>
```

### Accessibility
```html
<!-- Include ARIA labels for clarity -->
<button class="wb-btn wb-btn--primary" aria-label="Save document">
    💾 Save
</button>

<!-- Toggle buttons need aria-pressed -->
<button class="wb-btn wb-btn--toggle" aria-pressed="false">
    Dark Mode
    <span class="wb-btn__check">✓</span>
</button>
```

### Layout Guidelines
```html
<!-- Use containers for proper spacing -->
<div class="button-container">
    <button class="wb-btn wb-btn--primary">Action 1</button>
    <button class="wb-btn wb-btn--success">Action 2</button>
</div>

<!-- Let button margins handle spacing automatically -->
<div style="margin: 0 -0.5rem;">
    <button class="wb-btn wb-btn--primary">Auto Spaced</button>
    <button class="wb-btn wb-btn--primary">Auto Spaced</button>
</div>
```

## Integration Examples

### With Form Elements
```html
<form class="form-controls">
    <input type="text" placeholder="Enter text">
    <div class="form-actions">
        <button type="submit" class="wb-btn wb-btn--success">Submit</button>
        <button type="reset" class="wb-btn wb-btn--primary">Reset</button>
    </div>
</form>
```

### With Navigation
```html
<nav class="nav-controls">
    <button class="wb-btn wb-btn--primary">🏠 Home</button>
    <button class="wb-btn wb-btn--primary">📄 Docs</button>
    <button class="wb-btn wb-btn--success">💾 Save</button>
</nav>
```

### With Control Panels
```html
<div class="control-panel">
    <div class="wb-btn-grid wb-btn-grid--three">
        <button class="wb-btn wb-btn--toggle">
            Option 1
            <span class="wb-btn__check">✓</span>
        </button>
        <button class="wb-btn wb-btn--toggle active">
            Option 2
            <span class="wb-btn__check">✓</span>
        </button>
        <button class="wb-btn wb-btn--toggle">
            Option 3
            <span class="wb-btn__check">✓</span>
        </button>
    </div>
</div>
```

### With Status Monitoring
```html
<div class="status-panel">
    <div class="wb-btn-grid">
        <button class="wb-btn wb-btn--primary">
            <span>Database</span>
            <span class="wb-btn__status wb-btn__status--active"></span>
        </button>
        <button class="wb-btn wb-btn--primary">
            <span>API Server</span>
            <span class="wb-btn__status wb-btn__status--inactive"></span>
        </button>
        <button class="wb-btn wb-btn--success">
            <span>Cache</span>
            <span class="wb-btn__status wb-btn__status--neutral"></span>
        </button>
        <button class="wb-btn wb-btn--primary">
            <span>CDN</span>
            <span class="wb-btn__status wb-btn__status--active"></span>
        </button>
    </div>
</div>
```

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 88+ | ✅ Full Support |
| Firefox | 78+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 88+ | ✅ Full Support |

## Technical Specifications

### CSS Features Used
- **CSS Custom Properties**: For theming and configuration
- **CSS Grid**: For button layouts
- **Flexbox**: For button internal alignment
- **CSS Clamp**: For responsive font sizing
- **CSS Transitions**: For hover effects

### Performance Considerations
- **Minimal CSS**: Only essential styles included
- **Hardware Acceleration**: Transform animations use GPU
- **No JavaScript Required**: Pure CSS implementation
- **Small Bundle Size**: ~3KB minified

## Responsive Behavior

### Mobile (≤600px)
- **Grid Collapse**: Multi-column grids become single column
- **Touch Targets**: Buttons maintain minimum 44px touch area
- **Font Scaling**: Text remains readable at smaller sizes

### Desktop (>600px)
- **Grid Layouts**: Full multi-column layouts supported
- **Hover Effects**: Enhanced hover states and transitions
- **Keyboard Navigation**: Full focus management

## Common Use Cases

### Website Builder Interface
```html
<!-- Tool palette -->
<div class="tool-palette">
    <button class="wb-btn wb-btn--primary">🎨 Color</button>
    <button class="wb-btn wb-btn--primary">📝 Text</button>
    <button class="wb-btn wb-btn--primary">🖼️ Image</button>
    <button class="wb-btn wb-btn--success">💾 Save</button>
</div>
```

### Settings Panel
```html
<!-- Settings toggles -->
<div class="settings-panel">
    <div class="wb-btn-grid">
        <button class="wb-btn wb-btn--toggle active">
            Dark Mode
            <span class="wb-btn__check">✓</span>
        </button>
        <button class="wb-btn wb-btn--toggle">
            Auto Save
            <span class="wb-btn__check">✓</span>
        </button>
    </div>
</div>
```

### Action Bar
```html
<!-- Document actions -->
<div class="action-bar">
    <button class="wb-btn wb-btn--primary">✏️ Edit</button>
    <button class="wb-btn wb-btn--primary">📋 Copy</button>
    <button class="wb-btn wb-btn--success">📤 Export</button>
</div>
```

---

## Conclusion

The WB Button component provides a robust, consistent, and accessible button system for the entire Website Builder application. With automatic text scaling, built-in spacing, and multiple variants, it ensures a professional and cohesive user interface across all components.

**Start using** wb-button in your components for instant consistency and improved user experience! 🚀