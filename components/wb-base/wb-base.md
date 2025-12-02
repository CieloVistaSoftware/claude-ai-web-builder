# WB Base Component (`wb-base`) - v2.0

**Status:** ✅ Production Ready (Phase 2 Complete)  
**Light DOM:** Yes (default, faster and simpler)  
**Shadow DOM:** Optional (use `static useShadow = true` if needed)  
**Last Updated:** December 1, 2025

---

## Quick Start (v2.0)

### Basic Component (Light DOM - Recommended)

```javascript
import WBBaseComponent from './wb-base/wb-base.js';

class MyButton extends WBBaseComponent {
  // Use Light DOM (default - recommended)
  static useShadow = false;

  connectedCallback() {
    super.connectedCallback();
    
    // Create Light DOM content
    const button = document.createElement('button');
    button.textContent = this.getAttribute('label') || 'Click me';
    button.className = 'my-button';
    
    // Add to component
    this.appendChild(button);
    
    // Log event
    this.logInfo('MyButton connected', { label: this.getAttribute('label') });
  }
}

customElements.define('my-button', MyButton);
```

**Usage:**
```html
<my-button label="Save"></my-button>
```

### With Shadow DOM (Optional)

```javascript
class MyEncapsulated extends WBBaseComponent {
  // Enable Shadow DOM if needed for strict encapsulation
  static useShadow = true;

  connectedCallback() {
    super.connectedCallback();
    
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; }
          button { padding: 0.5rem 1rem; }
        </style>
        <button>${this.getAttribute('label') || 'Click'}</button>
      `;
    }
  }
}
```

---

## Why Light DOM in v2.0?

✅ **Simpler** - No encapsulation complexity  
✅ **Faster** - No shadow tree overhead  
✅ **CSS Easier** - External stylesheets work naturally  
✅ **Accessible** - Full DOM visible in inspector  
✅ **Composable** - Works perfectly with decorators  

See `ARCHITECTURE/ARCHITECTURE.md` for detailed architecture rationale.

---

## Purpose

The WB Base Component provides a foundational ES6 class (`WBBaseComponent`) for all WB Web Components in the WB ecosystem. It is designed to encapsulate shared logic, lifecycle management, event dispatching, logging, and style loading, ensuring consistency and reducing duplication across all WB components.

## Features

- ✅ Light DOM by default (optional Shadow DOM)
- ✅ Event dispatch helpers (`fireEvent`)
- ✅ Logging system (event log + console)
- ✅ Attribute/property reflection
- ✅ Theme/mode handling
- ✅ Lifecycle hooks (connected/disconnected)
- ✅ Component registration helper
- ✅ Error reporting
- ✅ Schema/config loading

## Core Methods

### Event Dispatching

```javascript
// Fire a custom event
this.fireEvent('my-event:click', { 
  detail: 'data' 
});

// Listen for events
element.addEventListener('my-event:click', (e) => {
  console.log(e.detail);
});
```

### Logging

```javascript
// Log info (recorded in event log + console)
this.logInfo('Component started', { id: this.id });

// Log error
this.logError('Something went wrong', { action: 'save' });

// Log debug
this.logDebug('Debug info', { state: 'ready' });

// Get event log
const logs = WBBaseComponent.getEventLog();
```

### Attributes

```javascript
// Get attribute with default
const color = this.getAttr('color', 'blue');

// Set attribute with reflection
this.setAttr('color', 'red');

// Get current theme
const theme = this.getCurrentTheme();
```

### Component Registration

```javascript
class MyComponent extends WBBaseComponent {
  // ...
}

// Register component
MyComponent.register('my-component');
```

## Separated Files (v2.0)

In Phase 2 refactoring, concerns were separated into focused files:

### `wb-base.js` (Core Class)
- WBBaseComponent implementation
- All utilities and lifecycle
- ~250 lines (lean and focused)

### `wb-demo-base.js` (Demo Extension)
- WBDemoBase class
- Demo-specific functionality
- Separate from core

### `wb-base-logger-init.js` (Auto-Logger)
- Claude Logger initialization
- Auto-loads in demo mode
- Does not load in production

---

## Usage Example

```javascript
import WBBaseComponent from './wb-base/wb-base.js';

class MyComponent extends WBBaseComponent {
  static useShadow = false; // Light DOM (default)

  connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  render() {
    // Build Light DOM content
    const div = document.createElement('div');
    div.className = 'my-component';
    div.textContent = 'Hello World';
    
    this.appendChild(div);
    
    // Log event
    this.logInfo('MyComponent rendered');
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // Re-render when attributes change
    if (this.isConnected) {
      this.render();
    }
  }

  static get observedAttributes() {
    return ['label', 'variant'];
  }
}

customElements.define('my-component', MyComponent);
```

---

## File Structure

```
wb-base/
├── wb-base.js                  (Core class - v2.0 refactored)
├── wb-base.BACKUP.js           (Backup of original)
├── wb-demo-base.js             (Demo extension - NEW)
├── wb-base-logger-init.js      (Logger init - NEW)
├── wb-base.playwright.spec.js  (20+ tests - NEW)
├── wb-base-demo.html           (Demo page)
├── wb-base-demo.css            (Demo styles)
├── wb-base-demo.md             (Demo docs)
├── wb-base.md                  (This file)
├── wb-base.css                 (Component styles)
└── ✅ claude.md                (Phase 2 status)
```

---

## Testing

Comprehensive test suite in `wb-base.playwright.spec.js`:

- ✅ Class registration
- ✅ Light DOM mode (default)
- ✅ Shadow DOM conditional
- ✅ Event dispatching
- ✅ Event bubbling
- ✅ Event logging
- ✅ Theme handling
- ✅ Lifecycle methods
- ✅ Error reporting
- ✅ 20+ total tests

**All tests passing!** ✅

---

## Demo

See `wb-base-demo.html` for a working example and lifecycle event logging.

---

## Status (v2.0 - Phase 2 Complete)

- ✅ Core class refactored (concerns separated)
- ✅ Demo extended to separate file
- ✅ Logger initialization extracted
- ✅ Comprehensive test coverage added
- ✅ JSDoc comments added
- ✅ Documentation updated
- ✅ Ready for all WB components to extend

---

**v2.0 Released:** December 1, 2025  
**Previous Version:** v1.0.0 (October 2025)

See `✅ claude.md` for Phase 2 details.
