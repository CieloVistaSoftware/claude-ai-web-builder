# Website Builder Layout System

---
*Last Updated: 2025-09-29*
*Version: 2.0.0*
*Author: Claude Code Assistant*
*Status: Current - Updated for code deduplication & Web Components*
---

## Overview

The Website Builder Layout System provides a flexible, centralized approach to managing page layouts that works with both **semantic HTML elements** and **WB components**. Users can choose between:

- **Semantic HTML**: Use standard HTML5 elements (`<header>`, `<nav>`, `<main>`, `<footer>`)
- **WB Components**: Use enhanced WB components (`<wb-header>`, `<wb-nav>`, `<wb-main>`, `<wb-footer>`)
- **Mixed Approach**: Combine semantic HTML with specific WB components as needed

This document establishes the single source of truth for layout implementation to eliminate duplication and confusion while providing maximum flexibility.

## Flexibility Philosophy

**The layout system should empower users, not constrain them.** You can use:

- **Pure Semantic HTML**: Perfect for standard websites, accessibility-first projects, or when you prefer familiar HTML5 elements
- **Pure WB Components**: Ideal for complex applications needing enhanced functionality and consistent theming
- **Hybrid Approach**: Mix semantic HTML with specific WB components where enhanced features are needed

## Core Principles

1. **NO DUPLICATE CSS ANYWHERE**: All layout styles defined in one central location - NEVER duplicate
2. **Use Global Styles First**: Always use `/styles/_variables.css`, `_base.css`, `_utilities.css` before adding component-specific styles
3. **WBComponentUtils.loadCSS()**: Use centralized CSS loading, never manual `createElement('link')`
4. **Single Source of Truth**: All layout styles defined in one central location
5. **Consistent Selectors**: Standardized CSS selectors across all element types
6. **Element Agnostic**: Layout system works with semantic HTML AND WB components
7. **Progressive Enhancement**: Start with semantic HTML, enhance with WB components as needed

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

### 4. Advertisement Layout (`ad-layout`)
- **Description**: Enhanced layout with navigation and dedicated ad space
- **Use Case**: Content sites with monetization, marketing pages
- **Structure**: Header → Navigation → Main → Sidebar(Ads) → Footer
- **Content Width**: Flexible with sidebar for advertisements

## CSS Grid Layout Samples

### Grid Areas Implementation

Each layout type can be implemented using CSS Grid with named grid areas for better structure and maintainability:

#### Top Navigation Grid Layout
```css
/* Top Navigation - Grid Areas (works with both approaches) */
.layout-top-nav {
    display: grid;
    grid-template-areas: 
        "header"
        "nav"
        "main"
        "footer";
    grid-template-rows: auto auto 1fr auto;
    grid-template-columns: 1fr;
    min-height: 100vh;
    gap: 0;
}

/* Semantic HTML Support */
.layout-top-nav header { grid-area: header; }
.layout-top-nav nav { grid-area: nav; }
.layout-top-nav main { grid-area: main; }
.layout-top-nav footer { grid-area: footer; }

/* WB Components Support */
.layout-top-nav wb-header { grid-area: header; }
.layout-top-nav wb-nav { grid-area: nav; }
.layout-top-nav wb-main { grid-area: main; }
.layout-top-nav wb-footer { grid-area: footer; }
```

#### Left Navigation Grid Layout
```css
/* Left Navigation - Grid Areas (works with both approaches) */
.layout-left-nav {
    display: grid;
    grid-template-areas: 
        "nav header"
        "nav main"
        "nav footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 200px 1fr;
    min-height: 100vh;
    gap: 0;
}

/* Semantic HTML Support */
.layout-left-nav nav { grid-area: nav; }
.layout-left-nav header { grid-area: header; }
.layout-left-nav main { grid-area: main; }
.layout-left-nav footer { grid-area: footer; }

/* WB Components Support */
.layout-left-nav wb-nav { grid-area: nav; }
.layout-left-nav wb-header { grid-area: header; }
.layout-left-nav wb-main { grid-area: main; }
.layout-left-nav wb-footer { grid-area: footer; }
```

#### Right Navigation Grid Layout
```css
/* Right Navigation - Grid Areas (works with both approaches) */
.layout-right-nav {
    display: grid;
    grid-template-areas: 
        "header nav"
        "main nav"
        "footer nav";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr 200px;
    min-height: 100vh;
    gap: 0;
}

/* Semantic HTML Support */
.layout-right-nav header { grid-area: header; }
.layout-right-nav main { grid-area: main; }
.layout-right-nav footer { grid-area: footer; }
.layout-right-nav nav { grid-area: nav; }

/* WB Components Support */
.layout-right-nav wb-header { grid-area: header; }
.layout-right-nav wb-main { grid-area: main; }
.layout-right-nav wb-footer { grid-area: footer; }
.layout-right-nav wb-nav { grid-area: nav; }
```

#### Advertisement Layout Grid Layout
```css
/* Advertisement Layout - Grid Areas (works with both approaches) */
.layout-ad-layout {
    display: grid;
    grid-template-areas: 
        "header header header"
        "nav main ads"
        "footer footer footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 200px 1fr 180px;
    min-height: 100vh;
    gap: 10px;
    padding: 10px;
}

/* Semantic HTML Support */
.layout-ad-layout header { grid-area: header; }
.layout-ad-layout nav { grid-area: nav; }
.layout-ad-layout main { grid-area: main; }
.layout-ad-layout footer { grid-area: footer; }
.layout-ad-layout aside { grid-area: ads; }

/* WB Components Support */
.layout-ad-layout wb-header { grid-area: header; }
.layout-ad-layout wb-nav { grid-area: nav; }
.layout-ad-layout wb-main { grid-area: main; }
.layout-ad-layout wb-footer { grid-area: footer; }
.layout-ad-layout .wb-ad-sidebar { grid-area: ads; }
```

### Responsive Grid Areas

```css
/* Mobile-First Grid Areas */
@media (max-width: 768px) {
    /* Convert all layouts to single column on mobile */
    .layout-left-nav,
    .layout-right-nav,
    .layout-ad-layout {
        grid-template-areas: 
            "header"
            "nav"
            "main"
            "footer";
        grid-template-columns: 1fr;
        grid-template-rows: auto auto 1fr auto;
    }
    
    /* Hide ads on mobile for ad-layout */
    .layout-ad-layout .ad-sidebar {
        display: none;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    /* Tablet adjustments */
    .layout-ad-layout {
        grid-template-columns: 1fr 160px 140px;
    }
    
    .layout-left-nav,
    .layout-right-nav {
        grid-template-columns: 180px 1fr;
    }
}
```

### Advanced Grid Layouts

#### Dashboard Layout with Multiple Sidebars
```css
.layout-dashboard {
    display: grid;
    grid-template-areas: 
        "left-nav header right-nav"
        "left-nav main right-nav"
        "left-nav footer right-nav";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 200px 1fr 200px;
    min-height: 100vh;
    gap: 0;
}

.layout-dashboard .left-nav { grid-area: left-nav; }
.layout-dashboard .site-header { grid-area: header; }
.layout-dashboard .main-content { grid-area: main; }
.layout-dashboard .site-footer { grid-area: footer; }
.layout-dashboard .right-nav { grid-area: right-nav; }
```

#### Content-Focused Layout
```css
.layout-content-focus {
    display: grid;
    grid-template-areas: 
        "header header header"
        "sidebar main toc"
        "footer footer footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 200px 1fr 180px;
    min-height: 100vh;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.layout-content-focus .site-header { grid-area: header; }
.layout-content-focus .sidebar { grid-area: sidebar; }
.layout-content-focus .main-content { grid-area: main; }
.layout-content-focus .table-of-contents { grid-area: toc; }
.layout-content-focus .site-footer { grid-area: footer; }
```

#### Magazine Layout
```css
.layout-magazine {
    display: grid;
    grid-template-areas: 
        "header header header header"
        "featured featured featured sidebar"
        "article1 article2 article3 sidebar"
        "footer footer footer footer";
    grid-template-rows: auto 300px 1fr auto;
    grid-template-columns: 1fr 1fr 1fr 250px;
    min-height: 100vh;
    gap: 20px;
    padding: 20px;
}

.layout-magazine .site-header { grid-area: header; }
.layout-magazine .featured-article { grid-area: featured; }
.layout-magazine .article-1 { grid-area: article1; }
.layout-magazine .article-2 { grid-area: article2; }
.layout-magazine .article-3 { grid-area: article3; }
.layout-magazine .sidebar { grid-area: sidebar; }
.layout-magazine .site-footer { grid-area: footer; }
```

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

### Grid Layout Integration

```css
/* Add Grid Layout Support to Existing System */
/* wb-core/layouts/layouts.css - Grid Areas Extension */

/* Base Grid Container for WB Components */
.wb-container.grid-layout,
body.grid-layout {
    display: grid;
    min-height: 100vh;
    gap: 0;
}

/* Top Navigation Grid */
body[data-layout="top-nav"] {
    grid-template-areas: 
        "header"
        "nav"
        "main"
        "footer";
    grid-template-rows: auto auto 1fr auto;
    grid-template-columns: 1fr;
}

/* Left Navigation Grid */
body[data-layout="left-nav"] {
    grid-template-areas: 
        "nav header"
        "nav main"
        "nav footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: var(--layout-sidebar-width) 1fr;
}

/* Right Navigation Grid */
body[data-layout="right-nav"] {
    grid-template-areas: 
        "header nav"
        "main nav"
        "footer nav";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr var(--layout-sidebar-width);
}

/* Advertisement Layout Grid */
body[data-layout="ad-layout"] {
    grid-template-areas: 
        "header header ads"
        "nav main ads"
        "footer footer ads";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 200px 1fr 180px;
    gap: 10px;
    padding: 10px;
}

/* Grid Area Assignments - Universal Support */
/* Semantic HTML Elements */
header { grid-area: header; }
nav { grid-area: nav; }
main { grid-area: main; }
footer { grid-area: footer; }
aside { grid-area: ads; }

/* WB Components */
wb-header { grid-area: header; }
wb-nav { grid-area: nav; }
wb-main { grid-area: main; }
wb-footer { grid-area: footer; }
.wb-ad-sidebar { grid-area: ads; }

/* Fallback CSS Classes (for mixed approaches) */
.wb-header { grid-area: header; }
.wb-nav { grid-area: nav; }
.wb-main { grid-area: main; }
.wb-footer { grid-area: footer; }
.wb-sidebar { grid-area: ads; }

/* Responsive Grid Areas */
@media (max-width: 768px) {
    body[data-layout="left-nav"],
    body[data-layout="right-nav"],
    body[data-layout="ad-layout"] {
        grid-template-areas: 
            "header"
            "nav"
            "main"
            "footer";
        grid-template-columns: 1fr;
        grid-template-rows: auto auto 1fr auto;
    }
    
    .wb-ad-sidebar {
        display: none;
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
     * @param {string} layout - Layout type (top-nav, left-nav, right-nav, ad-layout)
     * @param {boolean} useGrid - Whether to use CSS Grid layout (default: false)
     */
    static applyLayout(layout, useGrid = false) {
        if (!Object.values(this.LAYOUTS).includes(layout)) {
            console.error(`Invalid layout: ${layout}`);
            return false;
        }
        
        // Update body attribute
        document.body.setAttribute('data-layout', layout);
        this.currentLayout = layout;
        
        // Toggle grid layout on body for WB components
        if (useGrid) {
            document.body.classList.add('grid-layout');
        } else {
            document.body.classList.remove('grid-layout');
        }
        
        // Dispatch layout change event
        document.dispatchEvent(new CustomEvent('layoutChanged', {
            detail: { 
                layout: layout, 
                previous: this.currentLayout,
                useGrid: useGrid 
            }
        }));
        
        // Log the change
        if (typeof document !== 'undefined') {
            document.dispatchEvent(new CustomEvent('wb:info', {
                detail: { 
                    message: `Layout changed to ${layout}${useGrid ? ' (Grid)' : ' (Flexbox)'}`,
                    source: 'layout-manager',
                    from: 'WBLayoutManager',
                    to: layout
                }
            }));
        }
        
        return true;
    }
    
    /**
     * Toggle between Flexbox and Grid layout systems
     * @param {boolean} useGrid - Whether to use CSS Grid
     */
    static toggleLayoutSystem(useGrid) {
        if (useGrid) {
            document.body.classList.add('grid-layout');
            console.log('🔧 Layout Manager: Switched to CSS Grid with WB Components');
        } else {
            document.body.classList.remove('grid-layout');
            console.log('🔧 Layout Manager: Switched to Flexbox with WB Components');
        }
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

### Option 1: Pure Semantic HTML
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
</head>
<body data-theme="dark" data-layout="top-nav">
    <!-- Standard HTML5 Semantic Elements -->
    <header>
        <h1>My Website</h1>
        <!-- Header content -->
    </header>
    
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>
    
    <main>
        <h1>Page Title</h1>
        <p>Main content goes here...</p>
    </main>
    
    <!-- For ad-layout only -->
    <aside style="display: none;">
        <!-- Advertisement content -->
    </aside>
    
    <footer>
        <p>&copy; 2025 My Company. All rights reserved.</p>
    </footer>
    
    <!-- Layout Manager (optional) -->
    <script src="/wb-core/layouts/layout-manager.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            WBLayoutManager.applyLayout('top-nav', true); // Enable Grid
        });
    </script>
</body>
</html>
```

### Option 2: Pure WB Components
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Same CSS loading as above -->
    <link rel="stylesheet" href="/styles/_variables.css">
    <link rel="stylesheet" href="/styles/_base.css">
    <link rel="stylesheet" href="/styles/_utilities.css">
    <link rel="stylesheet" href="/wb-core/layouts/layouts.css">
</head>
<body data-theme="dark" data-layout="top-nav">
    <!-- Enhanced WB Components -->
    <wb-header 
        brand-text="My Website" 
        layout="default" 
        sticky="false">
    </wb-header>
    
    <wb-nav 
        items='[
            {"text": "Home", "href": "/"},
            {"text": "About", "href": "/about"},
            {"text": "Contact", "href": "/contact"}
        ]'
        layout="horizontal">
    </wb-nav>
    
    <wb-main>
        <h1>Page Title</h1>
        <p>Main content goes here...</p>
    </wb-main>
    
    <aside class="wb-ad-sidebar" style="display: none;">
        <!-- Advertisement content -->
    </aside>
    
    <wb-footer 
        layout="standard" 
        columns="3"
        company-name="My Company"
        copyright="© 2025 My Company. All rights reserved.">
    </wb-footer>
    
    <!-- Scripts for WB Components -->
    <script src="/components/wb-component-utils.js"></script>
    <script src="/wb-core/layouts/layout-manager.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            WBLayoutManager.applyLayout('top-nav', true);
        });
    </script>
</body>
</html>
```

### Option 3: Mixed Approach
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Same CSS loading -->
    <link rel="stylesheet" href="/styles/_variables.css">
    <link rel="stylesheet" href="/styles/_base.css">
    <link rel="stylesheet" href="/styles/_utilities.css">
    <link rel="stylesheet" href="/wb-core/layouts/layouts.css">
</head>
<body data-theme="dark" data-layout="top-nav">
    <!-- Mix semantic HTML with WB components as needed -->
    <header>
        <h1>My Website</h1>
    </header>
    
    <!-- Use WB nav for enhanced functionality -->
    <wb-nav 
        items='[{"text": "Home", "href": "/"}]'
        layout="horizontal">
    </wb-nav>
    
    <!-- Standard main element -->
    <main>
        <h1>Page Title</h1>
        <p>Content goes here...</p>
    </main>
    
    <aside style="display: none;">
        <!-- Ads -->
    </aside>
    
    <!-- Use WB footer for rich functionality -->
    <wb-footer 
        company-name="My Company">
    </wb-footer>
    
    <script src="/components/wb-component-utils.js"></script>
    <script src="/wb-core/layouts/layout-manager.js"></script>
</body>
</html>
```

## Usage Recommendations

### When to Use Semantic HTML
- **Simple websites** with basic functionality
- **Accessibility-first** projects requiring maximum screen reader compatibility
- **Learning projects** or educational content
- **Legacy system integration** where WB components aren't suitable
- **Minimal JavaScript** environments

### When to Use WB Components
- **Complex applications** requiring enhanced functionality
- **Consistent theming** across multiple pages/sites
- **Dynamic content** that needs programmatic updates
- **Advanced responsive behavior** beyond CSS media queries
- **Integration with WB ecosystem** (control panels, theme systems)

### When to Use Mixed Approach
- **Progressive enhancement** - start semantic, enhance selectively
- **Component migration** - gradually adopting WB components
- **Specific feature needs** - use WB components only where enhanced functionality is needed
- **Team preferences** - different developers comfortable with different approaches

## WB Component Integration

### Available WB Components (Optional)
- `wb-header` - Enhanced website header with branding and navigation
- `wb-nav` - Advanced navigation menu component  
- `wb-main` - Content wrapper with enhanced spacing and theming
- `wb-footer` - Rich website footer with links and structured information

### Semantic HTML Elements (Always Available)
- `<header>` - Standard HTML5 header element
- `<nav>` - Standard HTML5 navigation element
- `<main>` - Standard HTML5 main content element
- `<footer>` - Standard HTML5 footer element
- `<aside>` - Standard HTML5 sidebar element

### Layout-specific Classes (Applied to `<body>`)
- `[data-layout="top-nav"]` - Top navigation layout
- `[data-layout="left-nav"]` - Left sidebar layout
- `[data-layout="right-nav"]` - Right sidebar layout
- `[data-layout="ad-layout"]` - Advertisement layout

### Supported Element Types
**Semantic HTML** (works automatically):
- `<header>` - Page header section
- `<nav>` - Navigation container
- `<main>` - Main content area
- `<footer>` - Footer section
- `<aside>` - Sidebar/advertisement area

**WB Components** (enhanced functionality):
- `<wb-header>` - Enhanced header component
- `<wb-nav>` - Advanced navigation component
- `<wb-main>` - Content wrapper component
- `<wb-footer>` - Rich footer component

**CSS Classes** (for mixed approaches):
- `.wb-header` - Fallback header class
- `.wb-nav` - Fallback navigation class
- `.wb-main` - Fallback main class
- `.wb-footer` - Fallback footer class

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
    
    // Enable Grid Layout (optional)
    WBLayoutManager.applyLayout('top-nav', true); // true = use Grid
    // OR
    WBLayoutManager.toggleLayoutSystem(true); // Switch to Grid
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