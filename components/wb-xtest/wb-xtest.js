// @ts-nocheck
/**
 * WB xtest Web Component Template
 * 
 * USAGE: Find and replace:
 * - xtest → your-component-name
 * - Xtest → YourXtest
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';

console.log('🔷 WB xtest: Starting...');

const fallbackConfig = {
    component: { name: 'wb-xtest', version: '1.0.0' },
    classes: {
        base: 'wb-component',
        variants: { primary: 'wb-component--primary', secondary: 'wb-component--secondary' }
    },
    defaults: { variant: 'primary' },
    events: { ready: 'wb-xtest:ready', change: 'wb-xtest:change' }
};

function createSignal(initialValue) {
    let value = initialValue;
    const listeners = [];
    return [
        () => value,
        (newValue) => { value = newValue; listeners.forEach(fn => fn(value)); },
        (fn) => listeners.push(fn)
    ];
}

class WBXtest extends WBBaseComponent {
    constructor() {
        super(); // CRITICAL: Parent creates shadow root!
        this.config = fallbackConfig;
        [this.getVariant, this.setVariant, this.onVariant] = createSignal('primary');
        this.onVariant(() => this.render());
        
        // Attach the stylesheet to shadow root
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = new URL('./wb-xtest.css', import.meta.url).pathname;
        this.shadowRoot.appendChild(style);
    }

    connectedCallback() {
        super.connectedCallback(); // Inherit dark mode and other base functionality
        this.render();
        this.dispatchEvent(new CustomEvent(this.config.events.ready, { bubbles: true }));
        console.log('✅ WB xtest connected:', this.textContent);
    }

    render() {
        // Render into shadow DOM, not light DOM
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./wb-xtest.css">
            <div class="${this.config.classes.base} ${this.config.classes.variants[this.getVariant()]}">
                <slot></slot>
            </div>
        `;
    }

    static get observedAttributes() { return ['variant']; }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'variant' && oldValue !== newValue) {
            this.setVariant(newValue || 'primary');
        }
    }
}

customElements.define('wb-xtest', WBXtest);
export { WBXtest };
export default WBXtest;
