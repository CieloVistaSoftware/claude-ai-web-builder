# WB Component Standardization Guide

## Goal
Ensure ALL WB components:
1. ✅ Extend `WBBaseComponent`
2. ✅ Expose all parameters as observable attributes
3. ✅ Use consistent patterns and APIs

## Migration Checklist

### ✅ Step 1: Import WBBaseComponent
```javascript
// OLD
class MyComponent extends HTMLElement {

// NEW
import { WBBaseComponent } from '../wb-base/wb-base.js';
class MyComponent extends WBBaseComponent {
```

### ✅ Step 2: Configure Shadow DOM
```javascript
class MyComponent extends WBBaseComponent {
    static useShadow = true; // or false
    static styleUrl = './my-component.css'; // optional auto-load
```

### ✅ Step 3: Define ALL Observable Attributes
```javascript
// List EVERY parameter your component accepts
static get observedAttributes() {
    return [
        'title',
        'variant',
        'size',
        'disabled',
        'active',
        'theme',
        'icon',
        'value',
        // ... ALL parameters!
    ];
}
```

### ✅ Step 4: Update Constructor
```javascript
constructor() {
    super(); // MUST call super()!
    
    // Remove manual Shadow DOM creation (handled by base)
    // OLD: this.attachShadow({ mode: 'open' });
    
    // Initialize component state
    this._isReady = false;
}
```

### ✅ Step 5: Update connectedCallback
```javascript
async connectedCallback() {
    super.connectedCallback(); // MUST call super()!
    
    await loadComponentCSS(this, 'my-component.css');
    this.render();
    
    // Use inherited logging
    this.logInfo('Component connected', {
        variant: this.variant
    });
    
    // Fire ready event
    this.fireEvent('my-component:ready', {
        component: 'my-component'
    });
}
```

### ✅ Step 6: Add Property Getters/Setters
```javascript
// For EVERY attribute, create getter/setter pair

get title() {
    return this.getAttr('title', 'Default Title');
}

set title(value) {
    this.setAttr('title', value);
}

get variant() {
    return this.getAttr('variant', 'default');
}

set variant(value) {
    this.setAttr('variant', value);
}

// Repeat for ALL attributes!
```

### ✅ Step 7: Update attributeChangedCallback
```javascript
attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    if (oldValue === newValue) return;
    
    switch (name) {
        case 'title':
            this.render();
            break;
        case 'variant':
            this.updateVariant(newValue);
            break;
        case 'disabled':
            this.updateDisabledState(newValue !== null);
            break;
        // Handle ALL attributes!
    }
}
```

### ✅ Step 8: Replace Console Logs
```javascript
// OLD
console.log('Component ready');
console.error('Error occurred', error);

// NEW
this.logInfo('Component ready');
this.logError('Error occurred', { error });
this.logDebug('Debug info', { data });
```

### ✅ Step 9: Replace Event Dispatching
```javascript
// OLD
this.dispatchEvent(new CustomEvent('my-event', {
    detail: { data: 'value' },
    bubbles: true,
    composed: true
}));

// NEW
this.fireEvent('my-event', { data: 'value' });
// Bubbles and composed by default!
```

### ✅ Step 10: Add disconnectedCallback
```javascript
disconnectedCallback() {
    super.disconnectedCallback(); // MUST call super()!
    
    // Cleanup event listeners, timers, etc.
    this.logDebug('Component disconnected');
}
```

## Component Template

Use this template for NEW components or as reference when migrating:

```javascript
import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class MyComponent extends WBBaseComponent {
    // Configuration
    static useShadow = true;
    static styleUrl = null; // Using CSS loader
    
    // Define ALL observable attributes
    static get observedAttributes() {
        return [
            'title',
            'variant',
            'size',
            'disabled',
            'active'
            // ... list ALL parameters
        ];
    }

    constructor() {
        super();
        // Initialize state
        this._isReady = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        await loadComponentCSS(this, 'my-component.css');
        this.render();
        
        this.logInfo('Component connected', {
            variant: this.variant
        });
        
        this.fireEvent('my-component:ready', {
            component: 'my-component'
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.logDebug('Component disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (oldValue === newValue) return;
        
        switch (name) {
            case 'title':
                this.render();
                break;
            case 'variant':
                this.updateVariant(newValue);
                break;
            // Handle ALL attributes
        }
    }

    // Property getters/setters for ALL attributes
    get title() {
        return this.getAttr('title', 'Untitled');
    }

    set title(value) {
        this.setAttr('title', value);
    }

    get variant() {
        return this.getAttr('variant', 'default');
    }

    set variant(value) {
        this.setAttr('variant', value);
    }

    // Add getter/setter for EVERY attribute!

    // Component methods
    updateVariant(variant) {
        this.logDebug('Variant changed', { variant });
    }

    render() {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = `
            <div class="my-component my-component--${this.variant}">
                <h2>${this.title}</h2>
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('my-component', MyComponent);
export default MyComponent;
```

## Components to Migrate

### ✅ Already Compliant
- `wb-button` - Uses WBBaseComponent, exposes attributes

### 🔧 Needs Migration
- `wb-card` - Uses HTMLElement directly
- `wb-modal` - Uses HTMLElement directly
- `wb-grid` - Uses HTMLElement directly
- `wb-input` - Needs to extend WBBaseComponent
- `wb-table` - Needs review
- `wb-toggle` - Needs review
- ... and many more

## Migration Priority

### High Priority (Most Used)
1. ✅ wb-button (Done)
2. 🔧 wb-card
3. 🔧 wb-input
4. 🔧 wb-modal
5. 🔧 wb-grid

### Medium Priority
6. 🔧 wb-table
7. 🔧 wb-toggle
8. 🔧 wb-select
9. 🔧 wb-nav
10. 🔧 wb-footer

### Low Priority (Less Common)
11. 🔧 All other components

## Testing After Migration

After migrating a component:

1. **Test basic rendering**
   - Component displays correctly
   - Styles apply properly

2. **Test all attributes**
   - Set each attribute via HTML
   - Set each via JavaScript property
   - Verify reactivity (changes update UI)

3. **Test events**
   - All events fire correctly
   - Event data is accurate

4. **Test logging**
   - Check Output panel for logs
   - Verify no console errors

5. **Test in demo page**
   - Demo page loads without errors
   - All examples work

## Automation Script

```javascript
// Run this to check which components need migration
const components = [
    'wb-card', 'wb-modal', 'wb-grid', 'wb-input',
    // ... add all component names
];

components.forEach(async (name) => {
    const path = `./components/${name}/${name}.js`;
    const content = await Deno.readTextFile(path);
    
    const hasWBBase = content.includes('extends WBBaseComponent');
    const hasObserved = content.includes('static get observedAttributes');
    
    console.log(`${name}: ${hasWBBase ? '✅' : '❌'} Base, ${hasObserved ? '✅' : '❌'} Attrs`);
});
```

## Benefits After Migration

1. **Consistency** - All components follow same patterns
2. **Logging** - Built-in event logging across all components
3. **Theming** - Automatic dark mode support
4. **Events** - Easy event dispatching
5. **Debugging** - Better error reporting
6. **Maintenance** - Less code duplication
7. **IDE Support** - Better autocomplete and IntelliSense

## Common Gotchas

### ❌ Forgetting super()
```javascript
// BAD
connectedCallback() {
    this.render(); // Missing super()!
}

// GOOD
connectedCallback() {
    super.connectedCallback(); // ✅
    this.render();
}
```

### ❌ Not exposing parameters as attributes
```javascript
// BAD - Parameters only in constructor
constructor() {
    super();
    this.title = 'Default'; // Not observable!
}

// GOOD - Parameters as observed attributes
static get observedAttributes() {
    return ['title'];
}

get title() {
    return this.getAttr('title', 'Default');
}
```

### ❌ Manual Shadow DOM with useShadow=true
```javascript
// BAD
static useShadow = true;
constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Duplicate!
}

// GOOD
static useShadow = true;
constructor() {
    super(); // Shadow DOM handled automatically
}
```

## Next Steps

1. **Choose a component to migrate** (start with wb-card)
2. **Follow the checklist above**
3. **Test thoroughly**
4. **Update demo page**
5. **Repeat for next component**

---

**Need help migrating a specific component? Just ask!**
