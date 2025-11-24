# WB Component Rules & Standards
# ✅ FIX APPLIED: Shadow DOM Logging, Debugging, and Registration Standards
**Date:** November 22, 2025

All WB components now follow unified standards for Shadow DOM usage, logging, debugging, registration, and documentation. See below for the full list of components using Shadow DOM:

### Components Using Shadow DOM (as of November 22, 2025)

| Component            | File Path                                         | Shadow DOM Implementation                      |
|----------------------|---------------------------------------------------|------------------------------------------------|
| **wb-tab**           | `components/wb-tab/wb-tab.js`                     | ✅ Full Shadow DOM (WBTab, WBTabItem, WBTabPanel classes) |
| **wb-color-picker**  | `components/wb-color-picker/wb-color-picker.js`   | ✅ `this.attachShadow({ mode: 'open' })`        |
| **wb-color-bar**     | `components/wb-color-bar/wb-color-bar.js`         | ✅ `this.attachShadow({ mode: 'open' })`        |
| **wb-color-bars**    | `components/wb-color-bars/wb-color-bars.js`       | ✅ `this.attachShadow({ mode: 'open' })`        |
| **ControlPanel**     | `Working/components/ControlPanel.js`              | ✅ `this.attachShadow({ mode: 'open' })`        |
| **color-bars**       | `components/color-bars/wb-color-bars.js`          | ✅ `this.attachShadow({ mode: 'open' })`        |


**Official WB Component Development Standards and Guidelines**

*Last Updated: November 22, 2025*

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


### Base Class Requirement
- **All components MUST extend `WBBaseComponent`** (not `HTMLElement` directly)
- Located at: `components/wb-base/wb-base.js`
- Import: `import { WBBaseComponent } from '../wb-base/wb-base.js';`

### Shadow DOM Logging, Debugging & Registration Standards
- Always add clear `console.log` statements for custom element registration and lifecycle events (constructor, connectedCallback).
- Use unique log prefixes for each component (e.g., '🏗️ WB Semantic Elements: ...').
- Confirm registration with `customElements.get('your-element')` and log the result.
- Log the source of component loading and registration for traceability.
- Use `type="module"` for all ES6 module scripts to avoid syntax errors (e.g., "Unexpected token 'export'").
- Add debug logs to dependencies and utility scripts to verify execution order.
- Document all findings and fixes in component-specific markdown files.
- Implement a shared event log system for all WB components (see WBBaseComponent).
- Log important events (info, error, success) using a consistent format.
- Expose event log state for debugging and automated tests.
- Every component should have a dedicated markdown doc covering:
   - Registration and lifecycle logging
   - Debugging steps and common errors
   - Event logging and traceability
   - Example console outputs for successful registration
- Link to central standards doc for best practices.

### WBBaseComponent Features
`WBBaseComponent` provides these built-in capabilities:

1. **Shadow DOM**: Auto-attaches shadow root in constructor
2. **Event Logging**: 
   - `this.logInfo(message, context)` - Info logging
   - `this.logError(message, context)` - Error logging
   - `this.logDebug(message, context)` - Debug logging
   - `this.reportError(error, context)` - Error reporting with event
3. **Event Firing**: `this.fireEvent(name, detail, options)` - Dispatch custom events
4. **Theme Handling**: Auto-listens to `wb:theme-changed` events
5. **Attribute Utilities**:
   - `this.setAttr(name, value)` - Set attribute with reflection
   - `this.getAttr(name, defaultValue)` - Get attribute or default
6. **Slot Helpers**:
   - `this.getSlotNodes(name)` - Get nodes assigned to slot
   - `this.isSlotEmpty(name)` - Check if slot is empty
7. **Schema Loading**: `this.loadSchema()` - Load component schema
8. **Markdown Rendering**: `WBBaseComponent.renderMarkdownDoc(url, target)` - Render markdown
9. **Static Registration**: `WBBaseComponent.register(tagName)` - Register component

### Shared Utilities (component-utils.js)
Available utilities for all components:
- `addTrackedEventListener(el, type, handler, options)` - Track listeners for cleanup
- `reflectAttribute(el, name, value)` - Reflect property to attribute
- `getAttributeOrDefault(el, name, defaultValue)` - Get attribute with fallback
- `dispatchWBEvent(el, name, detail, bubbles, composed)` - Dispatch WB-style events
- `defineObservedAttributes(attrs)` - Define observed attributes
- `reflectPropAttr(element, prop, attr)` - Two-way property/attribute binding
- `dispatchComponentEvent(element, name, detail, options)` - Enhanced event dispatch

### Component Template
```javascript
import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBExampleComponent extends WBBaseComponent {
    constructor() {
        super();
        // Your initialization
    }
    
    static get observedAttributes() {
        return ['attr1', 'attr2'];
    }
    
    connectedCallback() {
        super.connectedCallback(); // IMPORTANT: Call parent
        this.render();
    }
    
    disconnectedCallback() {
        super.disconnectedCallback(); // IMPORTANT: Call parent
        // Your cleanup
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Component styles */
            </style>
            <div class="component-content">
                <!-- Your HTML -->
            </div>
        `;
    }
}

if (!customElements.get('wb-example')) {
    customElements.define('wb-example', WBExampleComponent);
}
```

## Current Component Architecture

### 🔄 Reactive Event-Driven Architecture (CRITICAL)

**To prevent infinite loops and ensure proper component behavior:**

1. **Components apply changes immediately** - Don't wait for external confirmation
   ```javascript
   // ✅ CORRECT: Apply change immediately, then fire event
   handleColorChange(newColor) {
       this.applyColorToDOM(newColor);  // Apply first
       this.fireEvent('wb:color-changed', { color: newColor });  // Then notify
   }
   
   // ❌ WRONG: Fire event and wait for something else to apply
   handleColorChange(newColor) {
       this.fireEvent('wb:color-changed', { color: newColor });  // Who applies this?
   }
   ```

2. **Never listen to your own events** - Components should NOT listen to events they dispatch
   ```javascript
   // ❌ WRONG: Creates infinite loop
   connectedCallback() {
       this.addEventListener('wb:color-changed', this.handleColorChange);
   }
   handleColorChange(newColor) {
       this.applyColor(newColor);
       this.fireEvent('wb:color-changed', { color: newColor });  // LOOP!
   }
   
   // ✅ CORRECT: Only external components listen
   // This component changes color, fires event, other components react
   ```

3. **One-way data flow** - Events flow OUT, not back IN
   ```
   User Input → Component Updates Self → Fires Event → Other Components React
   ❌ NOT: User Input → Fires Event → Listens to Own Event → LOOP
   ```

4. **Event listeners go on OTHER components** - Not the one firing the event
   ```javascript
   // In control-panel.js
   setupColorSliders() {
       // Listen to events from wb-color-bars
       this.addEventListener('colorchange', (e) => {
           this.saveToLocalStorage(e.detail);  // Just save, don't reapply
       });
   }
   ```

5. **Guards against recursive calls** - Use flags if needed
   ```javascript
   class WBComponent extends WBBaseComponent {
       constructor() {
           super();
           this._isUpdating = false;
       }
       
       handleChange(value) {
           if (this._isUpdating) return;  // Guard
           this._isUpdating = true;
           
           this.applyChange(value);
           this.fireEvent('change', { value });
           
           this._isUpdating = false;
       }
   }
   ```

**Common Infinite Loop Patterns to AVOID:**
- Slider fires event → Parent listens → Parent updates slider → Slider fires event → LOOP
- Component listens to own events
- Setting attribute that triggers attributeChangedCallback that sets attribute again
- Multiple components updating each other in a cycle

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
   - Logging, debugging, and registration standards for Shadow DOM components
   - Event-driven architecture and one-way data flow
   - Markdown documentation for lifecycle, registration, and event logging

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


The Website Builder component system now fully supports:
- Unified standards for Shadow DOM logging, debugging, and registration
- Event-driven, one-way data flow architecture
- Comprehensive documentation and demo requirements
- Data-driven component creation and configuration
- Accessibility, performance, and developer experience best practices

By following these standards, all WB components will be maintainable, extensible, and robust for future development.

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
*Last Updated: November 22, 2025*
*Version: 2.0.0*
*Author: Claude Code Assistant*
*Status: Current - Reflects 23+ component architecture with 65% Web Components conversion*
---
