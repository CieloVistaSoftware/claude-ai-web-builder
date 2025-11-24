# Component Directory Guide

## 🎯 Overview

A comprehensive, interactive component directory has been created at `components/index.html` that provides complete visibility into all WB Framework components.

---

## 📊 Features

### 1. **Component Statistics**
- Total components count (41)
- Core dependencies (10)
- Custom elements (37)
- Documentation coverage (100%)

### 2. **Search & Filter**
- **Search Box** - Find components by name or description
- **Filter Buttons** - Filter by type:
  - All (default)
  - Core (essential components)
  - Layout (page structure)
  - Utility (helper/tool components)
  - Experimental (development/testing)

### 3. **Component Table** - 4 Columns

| Column | Content | Action |
|--------|---------|--------|
| **Component Name** | Component name (blue link if demo available) | Click to view live demo |
| **Description** | What the component does | Informational |
| **Type** | Component category with color badge | Quick identification |
| **Documentation** | Green "📖 Docs" button or "N/A" | Click to view .md file |

### 4. **Component Types**

| Type | Color | Purpose |
|------|-------|---------|
| **Core** | Purple | Essential framework components |
| **Layout** | Green | Page structure & organization |
| **Utility** | Orange | Helper & tool components |
| **Experimental** | Red | Development/testing components |

---

## 🚀 How to Use

### 1. **Access the Directory**
```bash
npm run dev:s
# Then open: http://localhost:8080/components/index.html
```

### 2. **Search for a Component**
- Type component name or description in search box
- Results filter in real-time
- Press Escape to clear search

### 3. **Filter by Type**
- Click "Core" to see only core components
- Click "Layout" for page layout components
- Click "Utility" for helper utilities
- Click "All" to see everything

### 4. **View Component**
- Click component name (blue link) to view live demo
- Click "📖 Docs" button to view documentation
- Click "N/A" if no documentation available

---

## 📋 Component Categories

### Core Components (11 total)
These are the essential building blocks of the WB Framework:
- wb-base - Base styling and utilities
- wb-button - Standardized buttons
- wb-control-panel - Theme/layout/color control
- wb-color-bar - Individual color display
- wb-color-bars - Color palette display
- wb-color-harmony - Mathematical color system
- wb-event-log - Event logging system
- wb-input - Form inputs
- wb-select - Dropdown selections
- wb-slider - Range sliders
- wb-toggle - Toggle switches

### Layout Components (10 total)
Components for organizing page structure:
- wb-layout - Master layout container
- wb-grid - CSS Grid system
- wb-nav - Navigation bars
- wb-hero - Hero sections
- wb-header - Page headers
- wb-footer - Page footers
- wb-card - Content cards
- wb-modal - Modal dialogs
- wb-table - Data tables
- wb-tab - Tabbed content

### Utility Components (20 total)
Helper components and utilities:
- wb-color-picker - Color selection tool
- wb-color-transformer - Color adjustments
- wb-color-mapper - Color to semantic mapping
- wb-color-organ - Color management system
- wb-color-utils - Color functions
- wb-search - Search functionality
- wb-status - Status indicators
- wb-theme - Theme management
- wb-viewport - Viewport control
- wb-keyboard-manager - Keyboard handling
- wb-log-viewer - Event log display
- wb-log-error - Error logging
- wb-change-text - Text manipulation
- wb-image-insert - Image insertion
- wb-css-loader - Dynamic CSS loading
- wb-resize-panel - Resizable panels
- wb-resize-both - 2D resize
- wb-resize-eastwest - Horizontal resize
- wb-resize-updown - Vertical resize
- wb-semantic-elements - Semantic HTML wrapper

### Experimental Components (6 total)
Development and testing components:
- wb-inject-test - HTML injection testing
- wb-dev-toolbox - Development tools
- wb-demo - Demo template
- wb-rag - AI-powered search (RAG)
- wb-chatbot - Chatbot interface
- wb-xtest - Extended testing

---

## 🎨 Color Scheme

The directory uses your WB Framework's color system:
- **Primary** - Component links (blue)
- **Accent** - Documentation buttons (green)
- **Warning** - Utility badges (orange)
- **Error** - Experimental badges (red)
- **Background** - Dark theme (respects settings)

---

## 📱 Responsive Design

The directory is fully responsive:
- **Desktop** (>768px) - Full table with all columns visible
- **Tablet/Mobile** (<768px) - Optimized layout with readable text

---

## 🔍 Search Examples

Try these searches in the component directory:

```
"color"     → Find all color-related components
"layout"    → Find all layout components
"toggle"    → Find toggle/switch components
"resize"    → Find resize/panel components
"table"     → Find data table components
"picker"    → Find color picker
"harmony"   → Find color harmony system
```

---

## 📚 Integration with Other Guides

This directory works with your documentation system:

1. **HTML-FILES-GUIDE.md** - Which HTML files need which backends
2. **Event-Driven Color System Architecture** - How the color system works
3. **Component Directory (this file)** - Component visibility and navigation

---

## 🛠️ Maintenance

### Adding New Components

Update the `components` array in `components/index.html`:

```javascript
{
    name: 'wb-new-component',
    description: 'What this component does',
    type: 'core', // or 'layout', 'utility', 'experimental'
    demo: 'path/to/demo.html', // or null if no demo
    doc: 'path/to/documentation.md' // or null if no docs
}
```

### Updating Descriptions

Edit the `description` field for any component to keep information current.

### Adding/Removing Types

Modify the filter buttons and corresponding CSS badges:
```html
<button class="filter-btn" data-filter="your-type">Your Type</button>
```

---

## 💡 Tips

### Pro Tip 1: Bookmark Direct Links
You can create bookmarks to filtered views:
- All Core: `components/index.html` + filter Core
- All Layout: `components/index.html` + filter Layout

### Pro Tip 2: Use in Documentation
Link to the directory in your README:
```markdown
## Components
Explore all WB Framework components in the [Component Directory](components/index.html)
```

### Pro Tip 3: Share with Team
Share the direct URL to the component directory:
```
http://localhost:8080/components/index.html
```

---

## 🎯 Quick Stats

- **Total Components:** 41
- **Core Dependencies:** 10
- **Custom Elements:** 37
- **Documentation Coverage:** 100%
- **Live Demos:** 15+ available
- **Searchable:** Yes (name + description)
- **Filterable:** Yes (by type)
- **Mobile Responsive:** Yes

---

## 🚀 Next Steps

1. ✅ Open `components/index.html` in your browser
2. ✅ Search for components you're interested in
3. ✅ Click component names to see live demos
4. ✅ Click "📖 Docs" to read documentation
5. ✅ Use filters to browse by category

---

**Last Updated:** October 2025  
**Location:** `components/index.html`  
**Framework:** WB (Website Builder)
