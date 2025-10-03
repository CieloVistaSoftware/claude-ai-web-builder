# Website Builder Layout System

---
*Last Updated: 2025-09-29*
*Version: 2.0.0*
*Author: Claude Code Assistant*
*Status: Current - Updated for code deduplication & Web Components*
---

## Overview

The Website Builder Layout System provides a centralized, consistent approach to managing page layouts across all components and demo pages. This document establishes the single source of truth for layout implementation to eliminate duplication and confusion.

## Core Principles

1. **NO DUPLICATE CSS ANYWHERE**: All layout styles defined in one central location - NEVER duplicate
2. **Use Global Styles First**: Always use `/styles/_variables.css`, `_base.css`, `_utilities.css` before adding component-specific styles
3. **WBComponentUtils.loadCSS()**: Use centralized CSS loading, never manual `createElement('link')`
4. **Single Source of Truth**: All layout styles defined in one central location
5. **Consistent Selectors**: Standardized CSS selectors across all components
6. **Component Agnostic**: Layout system works independently of specific components
7. **Web Components API**: Use proper HTMLElement extension with customElements.define()

## Layout Types

### 1. Top Navigation (`top-nav`)
- **Description**: Horizontal navigation bar at the top of the page
- **Use Case**: Traditional website layout, content-focused pages
- **Structure**: Header → Navigation → Main → Footer
- **Content Width**: 100% width, centered content

### 2. Left Navigation (`left-nav`)
- **Description**: Fixed sidebar navigation on the left side
- **Use Case**: Dashboard interfaces, admin panels
- **Structure**: Fixed Sidebar | (Header → Main → Footer)
- **Content Width**: Full width minus 220px left margin

### 3. Right Navigation (`right-nav`)
- **Description**: Fixed sidebar navigation on the right side
- **Use Case**: Alternative dashboard layout, RTL interfaces
- **Structure**: (Header → Main → Footer) | Fixed Sidebar
- **Content Width**: Full width minus 220px right margin

## File Structure

```
styles/
├── _variables.css           # Global CSS variables (USE FIRST)
├── _base.css               # Base styles (USE SECOND)
└── _utilities.css          # Utility classes (USE THIRD)

components/
├── wb-component-utils.js   # Centralized component utilities
└── component-name/
    ├── component-name.js   # Component logic (extends HTMLElement)
    ├── component-name.css  # Component-specific styles ONLY
    └── component-name.json # Data-driven config

wb-core/
├── layouts/
│   ├── layout-manager.js      # JavaScript layout controller
│   ├── layouts.css           # All layout styles (centralized)
│   ├── layout-variables.css  # Layout-specific CSS variables
│   └── layout-utilities.css  # Layout helper classes

docs/
├── LayoutSystem.md         # This documentation
└── HowToCreateWebcomponent.md # Implementation guide
```

## CSS Architecture

### 1. Centralized Layout Styles (`wb-core/layouts/layouts.css`)

```css
/* =============================================================================
   WEBSITE BUILDER LAYOUT SYSTEM
   Centralized layout definitions - DO NOT DUPLICATE ELSEWHERE
   ============================================================================= */

/* Layout Variables */
:root {
    --layout-sidebar-width: 200px;
    --layout-sidebar-margin: 220px; /* sidebar width + gap */
    --layout-transition: 0.3s ease;
    --layout-mobile-breakpoint: 768px;
}

/* Base Layout Reset */
.site-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* TOP NAVIGATION LAYOUT */
body[data-layout="top-nav"] .site-container {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
}

body[data-layout="top-nav"] .site-nav {
    position: static;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px 0;
}

body[data-layout="top-nav"] .site-nav .nav-list {
    flex-direction: row;
    justify-content: center;
    gap: var(--space-xl, 2rem);
}

body[data-layout="top-nav"] .site-header {
    text-align: center;
    width: 100%;
    padding: 20px;
}

body[data-layout="top-nav"] .main-content {
    width: 100%;
    padding: 20px;
    margin: 0;
}

/* LEFT NAVIGATION LAYOUT */
body[data-layout="left-nav"] .site-nav {
    position: fixed;
    left: 0;
    top: 0;
    width: var(--layout-sidebar-width);
    height: 100vh;
    background: var(--surface-color, #2d2d2d);
    border-right: 1px solid var(--border-color, #404040);
    z-index: 1000;
    overflow-y: auto;
    padding: 20px 0;
}

body[data-layout="left-nav"] .site-nav .nav-list {
    flex-direction: column;
    gap: var(--space-sm, 0.5rem);
    justify-content: flex-start;
}

body[data-layout="left-nav"] .site-header {
    margin-left: var(--layout-sidebar-margin);
    padding: 20px;
    transition: margin-left var(--layout-transition);
}

body[data-layout="left-nav"] .main-content {
    margin-left: var(--layout-sidebar-margin);
    padding: 20px;
    transition: margin-left var(--layout-transition);
}

/* RIGHT NAVIGATION LAYOUT */
body[data-layout="right-nav"] .site-nav {
    position: fixed;
    right: 0;
    top: 0;
    width: var(--layout-sidebar-width);
    height: 100vh;
    background: var(--surface-color, #2d2d2d);
    border-left: 1px solid var(--border-color, #404040);
    z-index: 1000;
    overflow-y: auto;
    padding: 20px 0;
}

body[data-layout="right-nav"] .site-nav .nav-list {
    flex-direction: column;
    gap: var(--space-sm, 0.5rem);
    justify-content: flex-start;
}

body[data-layout="right-nav"] .site-header {
    margin-right: var(--layout-sidebar-margin);
    padding: 20px;
    transition: margin-right var(--layout-transition);
}

body[data-layout="right-nav"] .main-content {
    margin-right: var(--layout-sidebar-margin);
    padding: 20px;
    transition: margin-right var(--layout-transition);
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
    body[data-layout="left-nav"] .site-nav,
    body[data-layout="right-nav"] .site-nav {
        position: static;
        width: 100%;
        height: auto;
        padding: 10px 0;
    }
    
    body[data-layout="left-nav"] .site-nav .nav-list,
    body[data-layout="right-nav"] .site-nav .nav-list {
        flex-direction: row;
        justify-content: center;
    }
    
    body[data-layout="left-nav"] .site-header,
    body[data-layout="left-nav"] .main-content,
    body[data-layout="right-nav"] .site-header,
    body[data-layout="right-nav"] .main-content {
        margin-left: 0;
        margin-right: 0;
        padding: 20px;
    }
}
```

### 2. Layout Manager (`wb-core/layouts/layout-manager.js`)

```javascript
/**
 * Website Builder Layout Manager
 * Centralized layout control system
 */

class WBLayoutManager {
    static LAYOUTS = {
        TOP_NAV: 'top-nav',
        LEFT_NAV: 'left-nav',
        RIGHT_NAV: 'right-nav'
    };
    
    static currentLayout = 'top-nav';
    static initialized = false;
    
    /**
     * Initialize the layout system
     */
    static init() {
        if (this.initialized) return;
        
        this.loadLayoutCSS();
        this.detectCurrentLayout();
        this.setupLayoutListeners();
        this.initialized = true;
        
        console.log('🔧 Layout Manager: Initialized');
    }
    
    /**
     * Load centralized layout CSS using WBComponentUtils
     * ✅ CORRECT - Uses centralized CSS loading
     */
    static loadLayoutCSS() {
        // Always use WBComponentUtils.loadCSS() - NEVER manual createElement
        if (typeof WBComponentUtils !== 'undefined') {
            // Load global styles first
            WBComponentUtils.loadCSS('wb-variables', '/styles/_variables.css');
            WBComponentUtils.loadCSS('wb-base', '/styles/_base.css');
            WBComponentUtils.loadCSS('wb-utilities', '/styles/_utilities.css');
            // Then load layout-specific styles
            WBComponentUtils.loadCSS('wb-layouts', '/wb-core/layouts/layouts.css');
        } else {
            console.error('WBComponentUtils not available - cannot load layout CSS');
        }
    }
    
    /**
     * Detect current layout from body attribute
     */
    static detectCurrentLayout() {
        const bodyLayout = document.body.getAttribute('data-layout');
        if (bodyLayout && Object.values(this.LAYOUTS).includes(bodyLayout)) {
            this.currentLayout = bodyLayout;
        }
    }
    
    /**
     * Apply a specific layout
     * @param {string} layout - Layout type (top-nav, left-nav, right-nav)
     */
    static applyLayout(layout) {
        if (!Object.values(this.LAYOUTS).includes(layout)) {
            console.error(`Invalid layout: ${layout}`);
            return false;
        }
        
        // Update body attribute
        document.body.setAttribute('data-layout', layout);
        this.currentLayout = layout;
        
        // Dispatch layout change event
        document.dispatchEvent(new CustomEvent('layoutChanged', {
            detail: { layout: layout, previous: this.currentLayout }
        }));
        
        // Log the change
        if (typeof document !== 'undefined') {
            document.dispatchEvent(new CustomEvent('wb:info', {
                detail: { 
                    message: `Layout changed to ${layout}`,
                    source: 'layout-manager',
                    from: 'WBLayoutManager',
                    to: layout
                }
            }));
        }
        
        return true;
    }
    
    /**
     * Get current layout
     */
    static getCurrentLayout() {
        return this.currentLayout;
    }
    
    /**
     * Get available layouts
     */
    static getAvailableLayouts() {
        return Object.values(this.LAYOUTS);
    }
    
    /**
     * Check if layout is mobile-responsive
     */
    static isMobile() {
        return window.innerWidth <= 768;
    }
    
    /**
     * Setup event listeners for layout changes
     */
    static setupLayoutListeners() {
        // Listen for window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Listen for layout change requests
        document.addEventListener('requestLayoutChange', (e) => {
            if (e.detail && e.detail.layout) {
                this.applyLayout(e.detail.layout);
            }
        });
    }
    
    /**
     * Handle window resize events
     */
    static handleResize() {
        // Force mobile layout on small screens
        if (this.isMobile() && (this.currentLayout === 'left-nav' || this.currentLayout === 'right-nav')) {
            // Mobile adjustments are handled by CSS, no JS changes needed
            console.log('Layout Manager: Mobile view activated');
        }
    }
    
    /**
     * Validate layout structure
     */
    static validateLayout() {
        const requiredElements = ['.site-container', '.site-header', '.site-nav', '.main-content'];
        const missing = [];
        
        requiredElements.forEach(selector => {
            if (!document.querySelector(selector)) {
                missing.push(selector);
            }
        });
        
        if (missing.length > 0) {
            console.warn('Layout Manager: Missing required elements:', missing);
            return false;
        }
        
        return true;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WBLayoutManager.init());
} else {
    WBLayoutManager.init();
}

// Make globally available
window.WBLayoutManager = WBLayoutManager;
```

## HTML Structure Requirements

### Required HTML Structure
All pages must follow this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- ✅ CORRECT: Load global styles first, then layout styles -->
    <!-- Global CSS Variables (REQUIRED FIRST) -->
    <link rel="stylesheet" href="/styles/_variables.css">
    <!-- Base Styles (REQUIRED SECOND) -->
    <link rel="stylesheet" href="/styles/_base.css">
    <!-- Utility Classes (REQUIRED THIRD) -->
    <link rel="stylesheet" href="/styles/_utilities.css">
    <!-- Layout System CSS (FOURTH) -->
    <link rel="stylesheet" href="/wb-core/layouts/layouts.css">
    <!-- Component-specific CSS (LAST) -->
</head>
<body data-theme="dark" data-layout="top-nav">
    <!-- Control Panel (if needed) -->
    <control-panel></control-panel>
    
    <!-- Required Site Structure -->
    <div class="site-container">
        <!-- Header -->
        <header class="site-header">
            <h1>Page Title</h1>
            <p>Page subtitle</p>
        </header>
        
        <!-- Navigation -->
        <nav class="site-nav" id="nav-container">
            <!-- Navigation content populated by wb-nav-menu -->
        </nav>
        
        <!-- Main Content -->
        <main class="main-content">
            <!-- Page content -->
        </main>
        
        <!-- Footer -->
        <footer class="site-footer">
            <!-- Footer content -->
        </footer>
    </div>
    
    <!-- Scripts: Load utilities first -->
    <script src="/components/wb-component-utils.js"></script>
    <script src="/wb-core/layouts/layout-manager.js"></script>
</body>
</html>
```

## CSS Class Standards

### Required CSS Classes
- `.site-container` - Main page wrapper
- `.site-header` - Page header section
- `.site-nav` - Navigation container
- `.main-content` - Main content area
- `.site-footer` - Footer section

### Layout-specific Classes
- `[data-layout="top-nav"]` - Top navigation layout
- `[data-layout="left-nav"]` - Left sidebar layout
- `[data-layout="right-nav"]` - Right sidebar layout

## Component Integration

### 1. Control Panel Integration
The control panel automatically applies layouts using `WBLayoutManager.applyLayout()`:

```javascript
// In control panel component
handleLayoutChange(event) {
    const layout = event.target.value;
    WBLayoutManager.applyLayout(layout);
}
```

### 2. Navigation Component Integration
Navigation components should respond to layout changes:

```javascript
// In wb-nav-menu component
document.addEventListener('layoutChanged', (e) => {
    this.updateNavigationLayout(e.detail.layout);
});
```

### 3. Demo Page Integration
Demo pages should NOT define their own layout CSS:

```html
<!-- ❌ WRONG: Don't duplicate layout styles or manual CSS loading -->
<style>
    [data-layout="left-nav"] .main-content {
        margin-left: 220px;
    }
</style>
<script>
    // ❌ WRONG: Manual CSS loading
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/some-styles.css';
    document.head.appendChild(link);
</script>

<!-- ✅ CORRECT: Use global styles first, then layout system -->
<link rel="stylesheet" href="/styles/_variables.css">
<link rel="stylesheet" href="/styles/_base.css">
<link rel="stylesheet" href="/styles/_utilities.css">
<link rel="stylesheet" href="/wb-core/layouts/layouts.css">
<script>
    // ✅ CORRECT: Use centralized utility
    WBComponentUtils.loadCSS('my-styles', '/path/to/styles.css');
</script>
```

## Migration Guidelines

### From Current System to Centralized System

1. **Remove ALL Duplicate CSS** (HIGH PRIORITY)
   - Delete layout-specific styles from individual components
   - Remove layout CSS from demo pages  
   - Remove ALL manual `createElement('link')` implementations
   - Use only `WBComponentUtils.loadCSS()` for CSS loading

2. **Follow Global CSS Order** (HIGH PRIORITY)
   - ALWAYS load `/styles/_variables.css` FIRST
   - THEN load `/styles/_base.css`
   - THEN load `/styles/_utilities.css`  
   - THEN load component-specific styles
   - NEVER duplicate any styles from global files

3. **Update Components to Web Components API** (MEDIUM PRIORITY)
   - Convert IIFE patterns to proper HTMLElement classes
   - Use `customElements.define()` registration
   - Remove duplicate `getPath()` and `generateId()` functions
   - Use `WBComponentUtils` for all utility functions

4. **Validate HTML Structure**
   - Ensure all required CSS classes are present
   - Follow the standardized HTML structure
   - Test all three layout modes
   - Include `wb-component-utils.js` before other scripts

## Testing Requirements

### Layout Testing Checklist
- [ ] Top navigation displays horizontally
- [ ] Left navigation creates fixed sidebar with content margin
- [ ] Right navigation creates fixed sidebar with content margin
- [ ] Mobile responsive behavior works correctly
- [ ] Layout switching works without page reload
- [ ] No console errors during layout changes
- [ ] Content doesn't overlap with navigation
- [ ] Footer stays at bottom in all layouts

### Cross-Component Testing
- [ ] Control panel layout switching works
- [ ] Navigation menu adapts to layout changes
- [ ] Event log captures layout change events
- [ ] All components respect layout margins
- [ ] No CSS conflicts between components

## Error Prevention

### Common Mistakes to Avoid
1. **Duplicating ANY CSS** - Never redefine styles that exist in global files
2. **Manual CSS Loading** - NEVER use `createElement('link')` - use `WBComponentUtils.loadCSS()`
3. **Wrong CSS Load Order** - ALWAYS load global styles first: variables → base → utilities → component
4. **Duplicate Utility Functions** - Use `WBComponentUtils` for `getPath()`, `generateId()`, etc.
5. **IIFE Pattern** - Convert to proper Web Components with `customElements.define()`
6. **Wrong Selectors** - Always use `body[data-layout="..."]` format
7. **Missing HTML Structure** - Ensure all required CSS classes exist
8. **Component-Specific Layout** - Layout system should be component-agnostic

### Validation Tools
```javascript
// Use layout manager validation
if (!WBLayoutManager.validateLayout()) {
    console.error('Invalid layout structure detected');
}
```

## Future Enhancements

### Planned Features
- [ ] Animation transitions between layouts
- [ ] Custom layout themes
- [ ] Layout presets for different use cases
- [ ] Advanced mobile layouts
- [ ] Layout configuration persistence
- [ ] Layout preview system

### Extensibility
The system is designed to be extensible. New layouts can be added by:
1. Adding CSS rules following the existing pattern
2. Updating `WBLayoutManager.LAYOUTS` constant
3. Adding validation for the new layout
4. Documenting the new layout structure

## Conclusion

This centralized layout system eliminates duplication, ensures consistency, and provides a maintainable foundation for the Website Builder. All components and pages must follow these standards to prevent layout conflicts and confusion.

**Key Rules:**
1. **NO DUPLICATE CSS ANYWHERE** - Use the centralized system
2. **Global CSS First**: variables → base → utilities → component-specific
3. **WBComponentUtils.loadCSS()** - Never manual `createElement('link')`
4. **Web Components API** - Use `customElements.define()`, not IIFE patterns
5. **WBComponentUtils for utilities** - No duplicate `getPath()`, `generateId()` functions
6. **Follow HTML structure requirements** - Consistent markup is essential  
7. **Use standard CSS classes** - Required for layout system to work
8. **Test all layout modes** - Ensure compatibility across layouts
9. **Include wb-component-utils.js first** - Required for all components

By following this system, we eliminate the chaos of scattered layout definitions and 700+ lines of duplicate utility code, creating a robust, maintainable codebase that follows the current project priorities.