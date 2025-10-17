# WB Component Rules & Standards

**Official WB Component Development Standards and Guidelines**

*Last Updated: October 9, 2025*

---

## 🎯 **CORE NAMING RULES**

### 1. Component Naming Convention
- **All components start with `wb-` prefix** (wb-layout, wb-nav, wb-card, wb-demo)
- **Support `<complex-name>` format** (e.g., `<wb-color-bars>`, `<wb-control-panel>`)
- **Use kebab-case for multi-word components** (wb-color-picker, wb-image-insert)

### 2. File Naming Standards
- **Main component file**: `wb-component-name.js`
- **External stylesheet**: `wb-component-name.css`
- **Demo file**: `wb-component-name-demo.html`
- **Development log**: `claude.md` (REQUIRED in every component folder)
- **Schema validation**: `wb-component-name.schema.json` (optional)

**Example file structure:**
```
components/wb-example/
├── wb-example.js              # Main component (ES6 class)
├── wb-example.css             # External styles (CSS-first)
├── wb-example-demo.html       # Two-tab demo
├── claude.md                  # Development log (REQUIRED)
└── wb-example.schema.json     # Optional data validation
```

---

## 🏛️ **ARCHITECTURE RULES**

## Current Component Architecture

### Key Patterns Discovered

1. **Self-Contained Modules**
   - Each component includes JS, CSS, and JSON configuration files
   - Components auto-load their own dependencies and styles
   - No external build process required

2. **Configuration-Driven Behavior**
   - Components use JSON files to define structure, behavior, and styling
   - Configuration includes CSS variables, color bindings, events, and API methods
   - Runtime configuration loading allows dynamic component behavior

3. **Event-Based Communication**
   - Components dispatch custom events for all state changes
   - Loose coupling between components via event system
   - Standardized event naming conventions

4. **Consistent Structure**
   ```
   component-name/
   ├── component-name.js       # Component logic
   ├── component-name.css      # Component styles
   ├── component-name.json     # Component definition
   ├── component-name.md       # Documentation
   └── component-name-demo.html # Demo/examples
   ```

## Component Categories

### 1. **UI Components** (User Interface Elements) 
**✅ Converted to Web Components:**
   - `wb-button` - Standardized button with variants, sizes, and states ✅
   - `wb-select` - Dropdown selection component ✅
   - `wb-slider` - Range slider component ✅
   - `wb-toggle` - Toggle switch component ✅
   - `wb-status` - Status indicator component ✅
   - `wb-modal` - Modal dialogs with overlay and animations
   - `wb-nav-menu` - Navigation menu component
   - `wb-color-picker` - Color selection component

**⚠️ Legacy Components (Need Conversion):**
   - `wb-input` - Input field component (CRITICAL: inputs not functional)
   - `wb-viewport` - Viewport/container component
   - `wb-button-v2` - Alternative button implementation
   - `wb-table` - Table component

### 2. **System Components** (Core Functionality)
   - `control-panel` - Master control panel for theme, layout, and settings
   - `control-panel-new` - New control panel (⚠️ JSON parsing issues)
   - `image-insert` - Image insertion and management (⚠️ needs edit button)
   - `change-text` - Text modification utilities (⚠️ edit mode issues)
   - `change-text-simple` - Simplified text editing

### 3. **Utility Components** (Helpers and Transformers)
   - `wb-component-utils` - **NEW: Shared utility system** eliminating duplicate code
   - `color-transformer` - Color format conversions
   - `color-mapper` - Color mapping utilities
   - `color-bar` - Color visualization (⚠️ needs tabs)
   - `theme-bridge` - Theme integration
   - `md-to-html` - Markdown to HTML converter
   - `color-analysis` - Color analysis utilities
   - `wb-event-log` - Passive event logging (zero-configuration)
   - `wb-log-error` - Error logging utilities

### 4. **Extensions**
   - `rootextractor` - Chrome extension for content extraction

## Data-Driven Architecture Analysis

### Current Data Patterns

1. **JSON Configuration Files**
   ```json
   {
     "component": {
       "name": "component-name",
       "version": "1.0.0",
       "dependencies": [],
       "assets": ["css", "js"]
     },
     "configuration": {
       "cssVariables": {},
       "colorBindings": {},
       "spacingBindings": {}
     },
     "classes": {
       "base": "component-base",
       "variants": {},
       "states": {}
     },
     "events": {},
     "api": {
       "methods": {}
     }
   }
   ```

2. **CSS Variable Integration**
   - Components bind to centralized CSS custom properties
   - Theme changes automatically cascade to all components
   - Responsive sizing using CSS clamp() functions

3. **Event-Driven Updates**
   - Components listen for system events (colorChanged, themeChanged)
   - State changes trigger custom events
   - Enables reactive UI without direct coupling

## Path to Complete Data-Driven Components

### 1. **Enhanced JSON Schema**
   - Add template/structure definitions to JSON
   - Define data bindings and conditional rendering
   - Include behavior definitions (handlers, actions)

### 2. **Component Factory Pattern**
   - Single factory to generate components from JSON
   - Runtime component creation
   - Dynamic style injection
   - Event handler attachment

### 3. **Benefits of Data-Driven Approach**
   - **Consistency**: All components follow same patterns
   - **Maintainability**: Changes in JSON reflect immediately
   - **Extensibility**: New components created without coding
   - **Testability**: Data definitions can be validated
   - **Documentation**: JSON serves as self-documentation

### 4. **Implementation Strategy**
   1. Create component factory (completed)
   2. Define enhanced JSON schema
   3. Convert existing components incrementally
   4. Build visual component designer
   5. Generate components from UI

## Component Integration Points

### Control Panel Integration
Most components integrate with the control panel for:
- Color system updates
- Theme switching
- Layout changes
- Global settings

### Event Flow
```
User Action → Component Event → System Handler → Update CSS Variables → All Components Update
```

## Best Practices Observed

1. **Accessibility First**
   - ARIA attributes
   - Keyboard navigation
   - Screen reader support
   - Focus management

2. **Performance Optimization**
   - Lazy loading of assets
   - Minimal CSS footprint
   - Hardware-accelerated animations
   - Event delegation

3. **Responsive Design**
   - Mobile-first approach
   - Breakpoint-based layouts
   - Flexible sizing with clamp()
   - Touch-friendly interfaces

4. **Developer Experience**
   - Clear naming conventions
   - Comprehensive documentation
   - Working demos
   - Simple integration

## Future Enhancements

1. **Visual Component Designer**
   - Drag-and-drop component creation
   - Real-time preview
   - JSON export/import

2. **Component Marketplace**
   - Share component definitions
   - Version management
   - Dependency resolution

3. **Advanced Features**
   - Component composition
   - Slot-based content
   - Dynamic loading
   - State management

## Conclusion

The Website Builder component system already demonstrates sophisticated patterns that align well with data-driven development. The existing JSON configuration approach provides an excellent foundation for building a complete data-driven component factory system. By enhancing the current patterns with template definitions and a unified factory, we can achieve a truly dynamic, maintainable, and extensible component ecosystem.

---
## Current Priority Tasks

### 1. **Convert CSS Loading to Shared Utility** (HIGH PRIORITY)
- 18 components still use manual CSS loading patterns
- Need to adopt `WBComponentUtils.loadCSS()` method
- Estimated savings: ~90-144 lines of duplicate code

### 2. **Complete Web Component Conversions** (MEDIUM PRIORITY)
- 8 legacy IIFE components remain
- Convert to extend HTMLElement and register with customElements.define()
- Priority: wb-input (critical functionality issue), wb-viewport, change-text, etc.

### 3. **Consolidate Color Utilities** (MEDIUM PRIORITY)
- 6 components have duplicate `hslToHex` functions
- Adopt `WBComponentUtils.ColorUtils.hslToHex()` 
- Estimated savings: ~120 lines

### 4. **Final ID Generation Cleanup** (LOW PRIORITY)
- 2 components with local `generateId()` functions
- Use `WBComponentUtils.generateId()` instead
- Estimated savings: ~13 lines

## Build System Status

✅ **RESOLVED**: npm workspaces implemented in root package.json
- Single node_modules in project root
- Removed duplicate node_modules from sub-projects
- Clean dependency management structure

---
*Last Updated: 2025-01-02*
*Version: 2.0.0*
*Author: Claude Code Assistant*
*Status: Current - Reflects 23+ component architecture with 65% Web Components conversion*
---
