# File: components/wb-control-panel/wb-control-panel.layout.md
# WB Control Panel Layout 

## Component Layout Structure

```
┌─────────────────────────────────────────────────┐
│ 🎨 Control Panel        [🌙 DARK]              │  ← Header
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌─ Theme System ─────────────────────────────┐ │
│ │ Theme Category: [Named Themes ▼]           │ │
│ │ Select Theme: [Default ▼]                  │ │
│ │ Harmony Mode: [Complementary ▼]            │ │
│ └───────────────────────────────────────────-┘ │
│                                                 │
│ ┌─ Primary Color (HSL) ────────────────────-┐ │
│ │ Hue:        [====●========] 240°          │ │
│ │ Saturation: [============●] 70%           │ │
│ │ Lightness:  [======●======] 50%           │ │
│ │ Preview: [████████████]                    │ │
│ └───────────────────────────────────────────-┘ │
│                                                 │
│ ┌─ Background Color (HSL) ──────────────────┐ │
│ │ Hue:        [===●=========] 220°          │ │
│ │ Saturation: [==●==========] 20%           │ │
│ │ Lightness:  [●============] 15%           │ │
│ │ Preview: [████████████]                    │ │
│ └───────────────────────────────────────────-┘ │
│                                                 │
│ ┌─ Layout & Footer ──────────────────────────┐ │
│ │ Page Layout: [Top Navigation ▼]           │ │
│ │ Footer Position: [Sticky ▼]               │ │
│ └───────────────────────────────────────────-┘ │
│                                                 │
│ ┌─ Edit Mode ────────────────────────────────┐ │
│ │ Enable Image Editing [✓]                  │ │
│ └───────────────────────────────────────────-┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Component Hierarchy

```
wb-control-panel (Web Component)
├── Shadow DOM
│   ├── wb-control-panel-shadow.css (External CSS)
│   └── HTML Template
│       ├── .panel-header
│       │   ├── .header-content
│       │   │   ├── h3 (Title: "🎨 Control Panel")
│       │   │   └── p.subtitle (Description)
│       │   └── .mode-toggle
│       │       ├── .mode-icon (🌙/☀️)
│       │       └── .mode-label (DARK/LIGHT)
│       └── .panel-body
│           ├── Theme System (.control-group)
│           │   ├── #theme-category-dropdown
│           │   ├── #theme-dropdown
│           │   └── #harmony-select
│           ├── Primary Color (.control-group)
│           │   ├── #hue-slider + #hue-display
│           │   ├── #sat-slider + #sat-display
│           │   ├── #light-slider + #light-display
│           │   ├── .hue-swatch (color preview dot)
│           │   └── #color-preview (large preview)
│           ├── Background Color (.control-group) ⚠️ NEW
│           │   ├── #bg-hue-slider + #bg-hue-display
│           │   ├── #bg-sat-slider + #bg-sat-display
│           │   ├── #bg-light-slider + #bg-light-display
│           │   ├── .bg-hue-swatch (color preview dot)
│           │   └── #bg-color-preview (large preview)
│           ├── Layout & Footer (.control-group)
│           │   ├── #layout-select
│           │   └── #footer-position-select
│           └── Edit Mode (.control-group)
│               └── #edit-mode-toggle (checkbox)
```

## State Management

### State Object
```javascript
this.state = {
    // Mode
    mode: 'dark',              // 'dark' | 'light'
    
    // Theme System
    theme: 'default',          // Theme ID
    themeCategory: 'named',    // 'named' | 'hcs'
    harmonyMode: 'complementary', // Harmony algorithm
    
    // Primary Color (HSL)
    primaryHue: 240,           // 0-360
    primarySat: 70,            // 0-100
    primaryLight: 50,          // 0-100
    
    // Background Color (HSL) ⚠️ NEW
    backgroundHue: 220,        // 0-360
    backgroundSat: 20,         // 0-100
    backgroundLight: 15,       // 0-100
    
    // Layout
    layout: 'top-nav',         // 'top-nav' | 'left-nav' | 'right-nav' | 'ad-layout'
    footerPosition: 'sticky',  // 'sticky' | 'normal'
    
    // Edit Mode
    editMode: false            // boolean
}
```

### LocalStorage Keys
```
wb-mode
wb-theme
wb-theme-category
wb-harmony-mode
wb-hue-primary
wb-sat-primary
wb-light-primary
wb-hue-background       ⚠️ NEW
wb-sat-background       ⚠️ NEW
wb-light-background     ⚠️ NEW
wb-layout
wb-footer-position
wb-edit-mode
```

## Events Dispatched

### Standard Events (wb: prefix)
```javascript
// Mode changes
'wb:mode-changed' 
{ mode: 'dark' | 'light' }

// Theme changes  
'wb:theme-changed'
{ theme: string, category: string, data: object }

// Harmony mode changes
'wb:harmony-changed'
{ mode: string }

// Primary color changes
'wb:color-changed'
{ hue: number, saturation: number, lightness: number, harmonyMode: string }

// Background color changes ⚠️ NEW
'wb:background-color-changed'
{ hue: number, saturation: number, lightness: number }

// Layout changes
'wb:layout-changed'
{ layout: string }

// Footer position changes
'wb:footer-position-changed'
{ position: string }
```

### Edit Mode Events (no prefix)
```javascript
'editModeEnabled'  // When edit mode turns on
'editModeDisabled' // When edit mode turns off
```

## CSS Custom Properties Updated

The component updates these CSS variables on `:root`:

```css
/* Primary Color */
--primary
--primary-dark
--primary-light
--primary-rgb

/* Background Color ⚠️ NEW */
--bg-primary
--bg-secondary
--bg-tertiary

/* Mode */
--text-primary
--text-secondary
--border-color
```

## File Structure

```
components/wb-control-panel/
├── wb-control-panel.js             # Main component (class definition first!)
├── wb-control-panel-shadow.css     # Shadow DOM styles (auto-loaded)
├── wb-control-panel.md             # This specification
├── wb-control-panel.schema.json    # JSON schema
├── wb-control-panel-demo.html      # Demo page
├── wb-control-panel-demo.js        # Demo page logic
├── wb-control-panel-demo.css       # Demo page styles
└── ✅ claude.md                     # Development notes
```

## Key Implementation Requirements

### 1. Shadow DOM
- Component uses Shadow DOM for style encapsulation
- WBBaseComponent already attaches shadow root - DO NOT attach again
- External CSS loaded via `<link>` in shadow root

### 2. Class Structure (CRITICAL!)
```javascript
// Class definition MUST be first line of code after imports
import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBControlPanel extends WBBaseComponent {
    constructor() {
        super(); // WBBaseComponent attaches shadow root
        // Do NOT call this.attachShadow() here!
        
        this.state = { /* ... */ };
    }
    // ... rest of class
}
```

### 3. Two Complete HSL Slider Sets
- **Primary Color**: For main UI elements (buttons, links, accents)
- **Background Color**: For page backgrounds and surfaces
- Each set has 3 sliders: Hue (0-360°), Saturation (0-100%), Lightness (0-100%)
- Each set has a color preview swatch
- Real-time updates to CSS custom properties

### 4. Event-Driven Architecture
- Component dispatches events, never manipulates DOM outside shadow root
- Other components listen for events and react accordingly
- No direct component-to-component coupling

### 5. LocalStorage Persistence
- All state saved to localStorage on change
- State restored on component load
- Keys prefixed with `wb-`

## Missing Features to Implement

✅ **Completed:**
- Shadow DOM with external CSS
- Mode toggle (dark/light)
- Theme selection (Named + HCS)
- Primary color HSL sliders
- Layout control
- Footer positioning
- Edit mode toggle
- Event dispatching
- LocalStorage persistence

⚠️ **TO ADD:**
- Background color HSL sliders (3 sliders + preview)
- Update localStorage to save background colors
- Dispatch `wb:background-color-changed` event
- Update CSS custom properties for background colors
- Add background color section to render() method
- Add event listeners for background sliders
- Update loadState() and saveState() methods

## Visual Design Requirements

### Colors
- Dark mode: Semi-transparent dark background with blur
- Light mode: Semi-transparent light background
- Accent: Purple/blue gradient (#6366f1 to #8b5cf6)

### Positioning
- Fixed position: top-right corner
- 1rem margin from edges
- Width: 380px
- Max height: calc(100vh - 2rem)
- Z-index: 10000

### Interactions
- Smooth transitions (0.3s)
- Hover states on all interactive elements
- Focus indicators on sliders
- Mode toggle has scale effect on hover

### Typography
- System font stack
- Headers: 1.5rem, gradient text
- Labels: 0.75rem, uppercase, letter-spacing
- Values: 0.75rem, bold, accent color

## Integration Example

```html
<!DOCTYPE html>
<html lang="en" data-mode="dark">
<head>
    <title>My Site</title>
    <!-- Component auto-loads its CSS -->
</head>
<body>
    <!-- Your content -->
    
    <!-- Control Panel - Self-contained -->
    <wb-control-panel></wb-control-panel>
    
    <script type="module" src="./components/wb-control-panel/wb-control-panel.js"></script>
    
    <script>
        // Listen for color changes
        document.addEventListener('wb:color-changed', (e) => {
            console.log('Primary color:', e.detail);
        });
        
        // Listen for background color changes
        document.addEventListener('wb:background-color-changed', (e) => {
            console.log('Background color:', e.detail);
        });
    </script>
</body>
</html>
```

## Testing Checklist

- [ ] Component loads without errors
- [ ] Shadow DOM created correctly
- [ ] External CSS loads
- [ ] Dark/light mode toggle works
- [ ] Theme dropdown populates
- [ ] Primary color sliders update preview
- [ ] Background color sliders update preview ⚠️ NEW
- [ ] Layout dropdown changes layout
- [ ] Footer position toggle works
- [ ] Edit mode toggle fires events
- [ ] All state persists to localStorage
- [ ] All events dispatch correctly
- [ ] CSS custom properties update
- [ ] Component works in wb.html showcase
- [ ] No console errors

---

**Last Updated**: 2025-10-19
**Version**: 2.0 (Added background color controls)
