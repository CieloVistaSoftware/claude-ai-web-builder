# WB Framework Component Architecture v2.0

**Status:** Updated for Light DOM  
**Last Updated:** December 1, 2025  
**Scope:** Standardizing 41+ components into decorator + light DOM pattern

---

## Design Principles

### Single Responsibility
- **Decorators**: Add ONE behavior (examples, clipboard, theme, layout)
- **Components**: Render ONE UI element (button, input, card)
- Never do both in same component

### Composability
- Decorators stack freely
- Components work inside decorators
- Clear parent-child relationships

### Framework Agnostic
- Pure Web Components (no React/Vue)
- Works anywhere (vanilla JS, React, Vue, Angular)
- No external dependencies

---

## Component Types

### Type 1: Decorators (Wrapper Components)

**Purpose:** Wrap elements and add behavior

**Key Rules:**
✅ Accept any HTML as children  
✅ Keep children completely untouched  
✅ Add decorator output AFTER children  
✅ Use Light DOM (NOT Shadow DOM)  
✅ Dispatch `wb-decorator:ready` event  

❌ DON'T modify children  
❌ DON'T clear `.innerHTML`  
❌ DON'T use Shadow DOM  
❌ DON'T assume child structure  

**Examples:**
- `wb-examples-decorator` - Code examples
- `wb-clipboard-decorator` - Copy to clipboard
- `wb-theme-provider` - CSS variables
- `wb-layout-grid` - Grid layout
- `wb-control-panel` - Master orchestrator

### Type 2: Standalone Components

**Purpose:** Create UI elements

**Key Rules:**
✅ Extend `WBBaseComponent`  
✅ Use Light DOM (`useShadow = false`)  
✅ Implement `render()` method  
✅ Use external CSS for styling  
✅ Dispatch component events  

❌ DON'T use Shadow DOM  
❌ DON'T wrap other components  
❌ DON'T modify children  
❌ DON'T use `<slot>` unless container  

**Examples:**
- `wb-button` - Button element
- `wb-input` - Input field
- `wb-card` - Card container
- `wb-modal` - Modal dialog

---

## Standard Decorator Pattern

```javascript
class WBExamplesDecorator extends HTMLElement {
  static useShadow = false; // Light DOM for decorators

  connectedCallback() {
    // 1. SAVE original content
    const originalHTML = this.innerHTML;

    // 2. CREATE decorator output
    const codeBlock = this.createCodeBlock(originalHTML);

    // 3. APPEND to DOM (children stay untouched)
    this.appendChild(codeBlock);

    // 4. DISPATCH event
    this.dispatchEvent(new CustomEvent('wb-decorator:ready', {
      bubbles: true,
      detail: { type: 'examples' }
    }));
  }

  createCodeBlock(markup) {
    const container = document.createElement('div');
    container.className = 'decorator-code-container';
    // ... build code display ...
    return container;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // Only affect decorator, not children
  }

  static get observedAttributes() {
    return ['enabled'];
  }
}
```

---

## Standard Component Pattern

```javascript
class WBButton extends WBBaseComponent {
  static useShadow = false; // Light DOM - no encapsulation

  connectedCallback() {
    this.render();
    this.setupListeners();
    
    this.dispatchEvent(new CustomEvent('wb-button:ready', {
      bubbles: true,
      detail: { variant: this.variant }
    }));
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'medium';
    
    // Clear Light DOM content
    this.innerHTML = '';
    
    // Create button element
    const button = document.createElement('button');
    button.className = 'wb-btn';
    button.classList.add(`wb-btn--${variant}`);
    button.classList.add(`wb-btn--${size}`);
    button.textContent = this.textContent || 'Button';
    
    // Add to Light DOM
    this.appendChild(button);
    
    this.button = button;
  }

  setupListeners() {
    if (!this.button) return;
    this.button.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('wb-button:click', {
        bubbles: true,
        detail: { variant: this.getAttribute('variant') }
      }));
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this.isConnected) this.render();
  }

  static get observedAttributes() {
    return ['variant', 'size', 'disabled'];
  }
}
```

---

## Light DOM vs Shadow DOM

### Why Light DOM (Our Choice)

✅ **Simpler** - No encapsulation complexity  
✅ **Faster** - No shadow tree overhead  
✅ **CSS Easier** - External stylesheets work naturally  
✅ **Accessible** - Full DOM visible in inspector  
✅ **Composable** - Works perfectly with decorators  
✅ **Cleaner HTML** - HTML visible in browser  

### Why NOT Shadow DOM

❌ Complex for decorators  
❌ CSS encapsulation overhead  
❌ Slower with many components  
❌ Harder to style from outside  
❌ Creates nested DOM trees  

---

## Composition Rules

### Rule 1: Decorators Wrap Decorators
```html
<wb-layout-grid>
  <wb-examples-decorator>
    <wb-clipboard-decorator>
      <wb-button>Save</wb-button>
    </wb-clipboard-decorator>
  </wb-examples-decorator>
</wb-layout-grid>
```

### Rule 2: Components Inside Decorators
```html
<wb-examples-decorator>
  <wb-button>Click</wb-button>
  <wb-input placeholder="Name"></wb-input>
</wb-examples-decorator>
```

### Rule 3: Components Should NOT Wrap Each Other
```html
<!-- ❌ WRONG -->
<wb-button><wb-input></wb-input></wb-button>

<!-- ✅ RIGHT -->
<wb-button>Save</wb-button>
<wb-input placeholder="Name"></wb-input>
```

---

## Styling Components (Light DOM)

### External CSS File

**wb-button.css:**
```css
.wb-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.wb-btn--primary {
  background-color: #6366f1;
  color: white;
}

.wb-btn--secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.wb-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### CSS Variables

```css
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --secondary: #e5e7eb;
  --text-primary: #1f2937;
}

.wb-btn--primary {
  background-color: var(--primary);
  color: white;
}
```

### From Parent (Easy with Light DOM!)

```css
/* Parent can easily style children */
.container .wb-btn--primary {
  background-color: blue;
}
```

---

## File Structure

### Per-Component Layout

```
wb-button/
├── wb-button.js
├── wb-button.css        (External CSS - applies directly)
├── wb-button.md
├── wb-button.playwright.spec.js
├── wb-button-demo.html
└── claude.md
```

### Repository Layout

```
components/
├── ARCHITECTURE/
├── docs/
├── scripts/
└── wb-*/  (all components)
```

---

## Testing Standards

Every component must pass:

✅ Renders without error  
✅ All attributes work  
✅ All events fire  
✅ Re-renders on change  
✅ CSS applies correctly  
✅ No console errors  
✅ Works with decorators  
✅ Playwright tests pass  

---

## Migration Phases

### Phase 1: Preparation ✅
- Create architecture docs
- Update templates for Light DOM
- Create migration guide

### Phase 2: Foundation (Week 2)
- Refactor wb-base
- Refactor utilities
- Update CSS

### Phase 3: Decorators (Week 3-4)
- Refactor all decorators
- Test composition
- Create new decorators

### Phase 4: Components (Week 5-6)
- Refactor all components to Light DOM
- Update CSS files
- Test thoroughly

### Phase 5: Validation (Week 7)
- Integration testing
- Performance check
- v2.0 Release

---

## Success Metrics

✅ 41+ components follow Light DOM pattern  
✅ All tests passing  
✅ Iteration speed 5-10 min  
✅ Easy composition  
✅ Clear responsibility  
✅ Cleaner HTML output  

---

**Version:** 2.0 (Light DOM)  
**Status:** Ready for Implementation
