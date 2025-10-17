# WB Component Architecture Standards

## 📅 October 16, 2025 - Architecture Standardization

All `.js` files in the `/components` directory must follow these principles:

---

## ✅ **Standard ES6 Module Pattern**

Every component `.js` file must:

### 1. **Use ES6 Module Syntax**
- NO IIFE wrappers: `(function() { ... })()`
- Use `export` statements
- Can use `import` statements for dependencies

### 2. **Module Structure**
```javascript
// 1. IMPORTS (if needed)
import { WBBaseComponent } from '../wb-base/wb-base.js';
import { AudioAnalyzer } from '../wb-color-utils/wb-color-utils.js';

// 2. HELPER FUNCTIONS (module-scoped, private)
function helperFunction() {
    // Private to this module
}

// 3. CLASS DEFINITION
class WBMyComponent extends HTMLElement {
    constructor() {
        super();
    }
}

// 4. REGISTRATION
if (!customElements.get('wb-my-component')) {
    customElements.define('wb-my-component', WBMyComponent);
}

// 5. GLOBAL EXPOSURE (for backward compatibility)
window.WBMyComponent = WBMyComponent;

// 6. EXPORTS
export { WBMyComponent };
export default WBMyComponent;

console.log('✅ wb-my-component loaded');
```

### 3. **Encapsulation Benefits**
- **ES6 modules are ALREADY scoped** - No IIFE needed!
- Helper functions at module scope = private
- Only exported members are public
- Same benefits as IIFE, cleaner syntax

### 4. **Naming Conventions**
- File: `wb-component-name.js`
- Class: `WBComponentName` (PascalCase)
- Tag: `wb-component-name` (kebab-case)
- Global: `window.WBComponentName`

### 5. **Backward Compatibility**
- Always expose to `window` for non-module scripts
- This allows both module and script loading

---

## 📋 **Component Categories**

### Category A: Pure ES6 Module (Preferred)
**Used for:** New components, utility modules
```javascript
import { Something } from '../other/other.js';

class WBComponent extends HTMLElement { }

export { WBComponent };
export default WBComponent;
```

### Category B: Dual Export (Most Common)
**Used for:** Components that may be loaded as script or module
```javascript
class WBComponent extends HTMLElement { }

// Register
customElements.define('wb-component', WBComponent);

// Expose globally
window.WBComponent = WBComponent;

// Export for modules
export { WBComponent };
export default WBComponent;
```

### Category C: Window-Only (Legacy Support)
**Used for:** Components with external dependencies via window
```javascript
class WBComponent extends HTMLElement {
    connectedCallback() {
        // Access window.AudioAnalyzer if available
        if (window.AudioAnalyzer) {
            // Use it
        }
    }
}

window.WBComponent = WBComponent;
export { WBComponent };
export default WBComponent;
```

---

## 🚫 **What NOT to Do**

### ❌ Don't Use IIFE
```javascript
// BAD
(function() {
    'use strict';
    class WBComponent { }
})();
```

### ❌ Don't Forget Exports
```javascript
// BAD - No exports
class WBComponent extends HTMLElement { }
customElements.define('wb-component', WBComponent);
// Missing: export { WBComponent };
```

### ❌ Don't Mix Patterns
```javascript
// BAD - IIFE with exports
(function() {
    class WBComponent { }
    export { WBComponent }; // Won't work inside IIFE
})();
```

---

## ✅ **Migration Checklist**

For each component `.js` file:

- [ ] Remove IIFE wrapper if present
- [ ] Add `export { ComponentClass }` at bottom
- [ ] Add `export default ComponentClass` at bottom
- [ ] Keep `window.ComponentClass = ComponentClass` for compatibility
- [ ] Fix indentation (remove one level if had IIFE)
- [ ] Add imports at top if using other modules
- [ ] Test that component still works

---

## 📊 **Current Status**

### ✅ **Completed (15 components)**

| # | Component | Status | Changes Made |
|---|-----------|--------|-------------|
| 1 | wb-color-utils | ✅ Complete | Compositional namespace + exports |
| 2 | wb-color-harmony | ✅ Complete | Compositional namespace + exports |
| 3 | wb-control-panel | ✅ Complete | IIFE removed + namespace + exports |
| 4 | wb-color-organ | ✅ Complete | Compositional namespace + exports |
| 5 | wb-base | ✅ Complete | Compositional namespace + exports |
| 6 | wb-button | ✅ Complete | Compositional namespace + exports |
| 7 | wb-toggle | ✅ Complete | Compositional namespace + exports |
| 8 | wb-select | ✅ Complete | Compositional namespace + exports |
| 9 | wb-input | ✅ Complete | Compositional namespace + exports |
| 10 | wb-event-log | ✅ Complete | Compositional namespace + exports |
| 11 | wb-modal | ✅ Complete | Compositional namespace + exports |
| 12 | wb-card | ✅ Complete | Compositional namespace + exports |
| 13 | wb-slider | ✅ Complete | Compositional namespace + exports |
| 14 | wb-status | ✅ Complete | Compositional namespace + exports |
| 15 | ... | 🔄 In Progress | Converting remaining ~25 components |

### ⏳ **Remaining (~25 components)**

All other wb-* components need standardization.

**Next Batch:**
- wb-layout
- wb-nav  
- wb-theme
- wb-viewport
- wb-table
- wb-footer
- wb-header
- wb-hero
- wb-grid
- wb-tab
- ... and 15 more

---

## 🎯 **Benefits of Standardization**

1. **Consistency** - All components follow same pattern
2. **Maintainability** - Easy to understand and modify
3. **Flexibility** - Can be loaded as module or script
4. **Tree-shaking** - Bundlers can optimize
5. **Imports** - Components can import from each other
6. **Modern** - ES6 standard, no legacy patterns

---

## 📝 **Example Conversion**

### Before (IIFE):
```javascript
(function() {
    'use strict';
    
    function helper() { }
    
    class WBComponent extends HTMLElement {
        connectedCallback() {
            helper();
        }
    }
    
    customElements.define('wb-component', WBComponent);
    window.WBComponent = WBComponent;
})();
```

### After (ES6 Module):
```javascript
// Helper at module scope (still private!)
function helper() { }

class WBComponent extends HTMLElement {
    connectedCallback() {
        helper(); // Direct access, no querySelector needed
    }
}

if (!customElements.get('wb-component')) {
    customElements.define('wb-component', WBComponent);
}

window.WBComponent = WBComponent;

export { WBComponent };
export default WBComponent;
```

---

## 🔧 **Testing Checklist**

After converting a component:

1. ✅ Component loads without errors
2. ✅ `customElements.get('wb-component')` returns class
3. ✅ `window.WBComponent` is defined
4. ✅ Can import: `import { WBComponent } from './wb-component.js'`
5. ✅ Helper functions still work
6. ✅ Component renders correctly
7. ✅ Events fire correctly

---

**This standard applies to ALL components in `/components` directory!**

*Documented: October 16, 2025*
