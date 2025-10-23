# WB Component Registry

## Overview
Complete registry of all Website Builder components with status, usage, and documentation links.

## Component Status Legend
- ✅ **Complete** - Fully implemented and documented
- 🔄 **In Progress** - Partially implemented or being updated
- ❌ **Broken** - Has known issues that need fixing
- 📋 **Planned** - Designed but not yet implemented

---

## UI Components

### wb-button
- **Status**: ✅ Complete
- **Type**: Web Component
- **Purpose**: Customizable button with variants and themes
- **Files**: `wb-button/wb-button-webcomponent.js`, `wb-button.css`
- **Demo**: `wb-button-demo.html`
- **Usage**: `<wb-button variant="primary" theme="dark">Click me</wb-button>`

### wb-color-picker
- **Status**: ✅ Complete  
- **Type**: Component
- **Purpose**: Color picker with Material Design support
- **Files**: `wb-color-picker/wb-color-picker.js`, `wb-color-picker.css`
- **Demo**: `wb-color-picker-demo.html`

### wb-slider
- **Status**: ✅ Complete
- **Type**: Component
- **Purpose**: Range slider for numeric inputs
- **Files**: `wb-slider/wb-slider.js`, `wb-slider.css`
- **Demo**: `wb-slider-demo.html`

### wb-toggle
- **Status**: ✅ Complete
- **Type**: Component
- **Purpose**: Toggle switch component
- **Files**: `wb-toggle/wb-toggle.js`, `wb-toggle.css`
- **Demo**: `wb-toggle-demo.html`

### wb-select
- **Status**: ✅ Complete
- **Type**: Web Component
- **Purpose**: Dropdown select component with dark mode
- **Files**: `wb-select/wb-select-webcomponent.js`, `wb-select.css`
- **Demo**: `wb-select-demo.html`

### wb-input
- **Status**: ❌ Broken
- **Type**: Component
- **Purpose**: Input elements for text entry
- **Issues**: Input elements not functional - users cannot enter text
- **Files**: `wb-input/wb-input.js`, `wb-input.css`

### wb-modal
- **Status**: ✅ Complete
- **Type**: Component
- **Purpose**: Modal dialog component
- **Files**: `wb-modal/wb-modal.js`, `wb-modal.css`
- **Demo**: `wb-modal-demo.html`

### wb-nav-menu
- **Status**: ✅ Complete
- **Type**: Component
- **Purpose**: Navigation menu component
- **Files**: `wb-nav-menu/wb-nav-menu.js`, `wb-nav-menu.css`
- **Demo**: `wb-nav-menu-demo.html`

---

## Data Display Components

### wb-table
- **Status**: ✅ Complete
- **Type**: Web Component
- **Purpose**: Auto-header table that handles JSON data
- **Files**: `wb-table/wb-table-webcomponent.js`, `wb-table.css`
- **Demo**: `wb-table-json-demo.html`
- **Usage**: `<wb-table data-json='[{...}]' striped hover></wb-table>`

### wb-status
- **Status**: ✅ Complete
- **Type**: Component
- **Purpose**: Status bar for events and settings
- **Files**: `wb-status/wb-status.js`, `wb-status.css`
- **Demo**: `wb-status-demo.html`

### wb-log-error
- **Status**: ✅ Complete
- **Type**: Web Component + Legacy
- **Purpose**: Error logging with table display
- **Files**: `wb-log-error/wb-log-error-webcomponent.js`, `wb-log-error.css`
- **Demo**: `wb-log-error-demo.html`
- **Features**: Draggable, resizable, compact table format

---

## Layout Components

### wb-viewport
- **Status**: ✅ Complete
- **Type**: Component
- **Purpose**: Viewport simulator for responsive testing
- **Files**: `wb-viewport/wb-viewport.js`, `wb-viewport.css`
- **Demo**: `wb-viewport-demo.html`
- **Issues**: Content appears darker in smaller viewports

### control-panel
- **Status**: ✅ Complete
- **Type**: Component
- **Purpose**: Main control panel for website builder
- **Files**: `control-panel/control-panel.js`, `control-panel.css`
- **Demo**: `control-panel-demo.html`

### control-panel-new
- **Status**: ❌ Broken
- **Type**: Component
- **Purpose**: New control panel with enhanced features
- **Issues**: JSON parsing errors and incorrect path references
- **Files**: `control-panel-new/control-panel-new.js`

---

## Content Components

### change-text
- **Status**: ❌ Broken
- **Type**: Component
- **Purpose**: Text editing component
- **Issues**: Edit mode functionality not working, buttons need to be sticky
- **Files**: `change-text/change-text.js`, `change-text.css`

### image-insert
- **Status**: ❌ Broken
- **Type**: Component
- **Purpose**: Image insertion component
- **Issues**: Insert function not working, needs edit button
- **Files**: `image-insert/image-insert.js`, `image-insert.css`

### color-bar
- **Status**: 🔄 In Progress
- **Type**: Component
- **Purpose**: Color visualization component
- **Issues**: Needs tabs for presentation/documentation
- **Files**: `color-bar/color-bar.js`, `color-bar.css`

---

## Utility Components

### wb-component-utils
- **Status**: ✅ Complete
- **Type**: Utility Library
- **Purpose**: Shared utilities for all WB components
- **Files**: `wb-component-utils.js`
- **Functions**: `loadCSS()`, `generateId()`, `getPath()`, `loadConfig()`

### wb-event-log
- **Status**: ✅ Complete
- **Type**: Component
- **Purpose**: Passive event logging system
- **Files**: `wb-event-log/wb-event-log.js`
- **Usage**: Zero-configuration, just dispatch `wb:*` events

---

## Component Architecture Patterns

### Web Components (Modern)
Components using custom elements and proper web standards:
- `wb-button-webcomponent.js`
- `wb-select-webcomponent.js` 
- `wb-log-error-webcomponent.js`
- `wb-table-webcomponent.js`

### Legacy Components (IIFE Pattern)
Older components using IIFE pattern, need conversion:
- Most other components still use this pattern
- Target for future web component conversion

### Component Structure
Standard structure for all components:
```
component-name/
├── component-name.js              # Main logic
├── component-name.css             # Styling
├── component-name.json            # Configuration
├── component-name-demo.html       # Demo page
├── component-name.md              # Documentation
├── component-name.issues.md       # Known issues (if any)
└── component-name-webcomponent.js # Web component version
```

---

## Integration Patterns

### CSS Loading
```javascript
// Via wb-component-utils
WBComponentUtils.loadCSS('component-name', cssPath);

// Manual loading
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'component.css';
document.head.appendChild(link);
```

### Component Initialization
```javascript
// Web components (automatic)
<wb-component></wb-component>

// Legacy components (manual)
WBComponent.init();
```

### Event System
```javascript
// Dispatch WB events
document.dispatchEvent(new CustomEvent('wb:info', {
    detail: { message: 'Something happened' }
}));

// Listen for component events
document.addEventListener('wb-component:ready', (e) => {
    console.log('Component ready:', e.detail);
});
```

---

## Development Guidelines

### Creating New Components
1. Follow the standard folder structure
2. Use web components for new development
3. Include comprehensive documentation
4. Provide working demo
5. Add to this registry

### Component Naming
- Use `wb-` prefix for all components
- Use kebab-case for names
- Be descriptive but concise

### Documentation Requirements
- Complete API documentation
- Usage examples
- Integration patterns
- Known issues/limitations

### Testing
- Each component should have a demo page
- Test in multiple browsers
- Verify mobile compatibility
- Check accessibility

---

## Known Issues Summary

### High Priority Fixes Needed
1. **wb-input**: Input elements not functional
2. **control-panel-new**: JSON parsing errors
3. **change-text**: Edit mode not working
4. **image-insert**: Insert function broken

### Medium Priority Improvements
1. **wb-viewport**: Content darkness in small viewports
2. **color-bar**: Needs tabs for documentation
3. **Legacy conversions**: Convert remaining components to web components

### Code Cleanup Needed
1. **Duplicate utilities**: Remove 500+ lines of duplicate code
2. **Path detection**: Fix duplicate implementations
3. **CSS loading**: Standardize across all components

---

## Usage Statistics

### Most Used Components
1. wb-button (universal)
2. wb-table (data display)
3. wb-status (debugging)
4. wb-log-error (development)
5. control-panel (main interface)

### Least Used Components
1. wb-viewport (specific use case)
2. color-bar (utility)
3. image-insert (broken)

---

## Future Roadmap

### Next Priorities
1. Fix all broken components
2. Convert legacy components to web components
3. Create component discovery tool
4. Standardize APIs across all components
5. Comprehensive testing suite

### New Components Planned
1. wb-grid (layout grid system)
2. wb-tabs (tabbed interface)
3. wb-tooltip (contextual help)
4. wb-notification (toast messages)
5. wb-form (form builder)

This registry provides complete visibility into all WB components, their status, and how to use them effectively.