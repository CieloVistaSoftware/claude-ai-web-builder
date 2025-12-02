# WB Framework Glossary

Terms and concepts used in WB Framework documentation. Click any term to learn more.

## Shadow DOM

**What it is:** A browser feature that creates an isolated DOM tree inside a component. Styles and scripts inside don't leak out, and outside styles don't leak in.

**Why we use it:** Each WB component has its own "bubble" of HTML and CSS that won't conflict with your page or other components.

**Example:**
```javascript
class MyComponent extends HTMLElement {
    constructor() {
        super();
        // Create the shadow DOM
        this.attachShadow({ mode: 'open' });
        // Now this.shadowRoot is our private DOM
        this.shadowRoot.innerHTML = '<p>Only I can see this</p>';
    }
}
```

**Related:** [WBBaseComponent](/components/wb-base/wb-base.md)

---

## CSS Variables

**What it is:** Also called "Custom Properties". Variables in CSS that can be changed dynamically.

**Why we use it:** Theming! Change `--primary` once and all components update.

**Example:**
```css
:root {
    --primary: #667eea;
    --bg-primary: #1a1a2e;
}

.button {
    background: var(--primary);
}
```

**Related:** [wb-theme](/components/wb-theme/wb-theme.md)

---

## Web Components

**What it is:** Browser-native way to create reusable custom HTML elements like `<wb-button>`.

**Why we use it:** No framework needed. Works everywhere. Future-proof.

**Parts:**
- **Custom Elements** - Define new HTML tags
- **Shadow DOM** - Encapsulate styles
- **HTML Templates** - Reusable markup

**Related:** [wb-base](/components/wb-base/wb-base.md)

---

## HCS (Harmonic Color System)

**What it is:** WB Framework's color generation system based on wave theory and musical harmonics.

**Why we use it:** Creates mathematically pleasing color palettes automatically.

**Modes:**
- Complementary
- Triadic  
- Analogous
- Beat Pattern
- FM/AM Modulation

**Related:** [wb-color-harmony](/components/wb-color-harmony/wb-color-harmony.md), [wb-control-panel](/components/wb-control-panel/wb-control-panel.md)

---

## import.meta.url

**What it is:** JavaScript way to get the URL of the current module file.

**Why we use it:** Components can find their own CSS file regardless of where they're imported from.

**Example:**
```javascript
// If this file is at /components/wb-button/wb-button.js
const cssUrl = new URL('./wb-button.css', import.meta.url).href;
// cssUrl = '/components/wb-button/wb-button.css'
```

---

## Slots

**What it is:** Placeholders in a component where you can insert your own content.

**Example:**
```html
<!-- Component definition -->
<template>
    <div class="card">
        <slot name="title">Default Title</slot>
        <slot>Default content</slot>
    </div>
</template>

<!-- Usage -->
<wb-card>
    <span slot="title">My Title</span>
    <p>My content goes here</p>
</wb-card>
```

**Related:** [wb-card](/components/wb-card/wb-card.md), [wb-modal](/components/wb-modal/wb-modal.md)

---

## Reactive / Signals

**What it is:** A pattern where changing a value automatically updates the UI.

**Example:**
```javascript
const count = createSignal(0);
count.value = 5; // UI updates automatically
```

**Related:** [wb-base](/components/wb-base/wb-base.md)

---

## BEM (Block Element Modifier)

**What it is:** CSS naming convention we use for class names.

**Pattern:** `.block__element--modifier`

**Example:**
```css
.wb-button { }           /* Block */
.wb-button__icon { }     /* Element */
.wb-button--primary { }  /* Modifier */
```
