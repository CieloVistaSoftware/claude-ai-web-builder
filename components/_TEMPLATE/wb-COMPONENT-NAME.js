// @ts-nocheck
/**
 * WB COMPONENT-NAME Web Component Template
 * 
 * USAGE: Find and replace:
 * - COMPONENT-NAME → your-component-name
 * - ComponentName → YourComponentName
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';

console.log('🔷 WB COMPONENT-NAME: Starting...');

const fallbackConfig = {
    component: { name: 'wb-COMPONENT-NAME', version: '1.0.0' },
    classes: {
        base: 'wb-component',
        variants: { primary: 'wb-component--primary', secondary: 'wb-component--secondary' }
    },
    defaults: { variant: 'primary' },
    events: { ready: 'wb-COMPONENT-NAME:ready', change: 'wb-COMPONENT-NAME:change' }
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

class WBComponentName extends WBBaseComponent {
    constructor() {
        super(); // CRITICAL: Parent creates shadow root!
        this.config = fallbackConfig;
        [this.getVariant, this.setVariant, this.onVariant] = createSignal('primary');
        this.onVariant(() => this.render());
    }

    connectedCallback() {
        this.render();
        this.dispatchEvent(new CustomEvent(this.config.events.ready, { bubbles: true }));
    }

    render() {
        this.innerHTML = `
            <div class="${this.config.classes.base} ${this.config.classes.variants[this.getVariant()]}">
                <slot></slot>
            </div>
        `;
    }

    static get observedAttributes() { return ['variant']; }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'variant') this.setVariant(newValue || 'primary');
    }
}

customElements.define('wb-COMPONENT-NAME', WBComponentName);
export { WBComponentName };
export default WBComponentName;
