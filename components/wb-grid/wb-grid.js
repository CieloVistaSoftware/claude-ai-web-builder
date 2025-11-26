/**
 * WB Grid Web Component
 * 
 * A simple, flexible grid web component for layout.
 * 
 * @example
 * <wb-grid columns="3" gap="1rem">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </wb-grid>
 * 
 * @version 2.0.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBGrid extends WBBaseComponent {
  static useShadow = true;
  
  static get observedAttributes() {
    return ['columns', 'gap', 'min'];
  }

  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
    
    this.logInfo('WBGrid connecting', { columns: this.columns });
    
    await loadComponentCSS(this, 'wb-grid.css');
    this.render();
    
    this.fireEvent('wb-grid:ready', { component: 'wb-grid', columns: this.columns });
    this.logInfo('WBGrid ready', { columns: this.columns, gap: this.gap });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.logDebug('WBGrid disconnected');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    if (oldValue !== newValue) {
      this.render();
      this.logDebug('WBGrid attribute changed', { name, oldValue, newValue });
    }
  }

  // Property getters/setters
  get columns() {
    return this.getAttr('columns', 'auto-fit');
  }
  
  set columns(value) {
    this.setAttr('columns', value);
  }
  
  get gap() {
    return this.getAttr('gap', '1rem');
  }
  
  set gap(value) {
    this.setAttr('gap', value);
  }
  
  get min() {
    return this.getAttr('min', '200px');
  }
  
  set min(value) {
    this.setAttr('min', value);
  }

  render() {
    if (!this.shadowRoot) return;
    
    const columns = this.columns;
    const min = this.min;
    const gap = this.gap;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(${columns}, minmax(${min}, 1fr));
          gap: ${gap};
        }
      </style>
      <div class="grid">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('wb-grid')) {
  customElements.define('wb-grid', WBGrid);
}

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
  window.WBComponentRegistry.register('wb-grid', WBGrid, [], {
    version: '2.0.0',
    type: 'layout',
    role: 'container',
    description: 'Flexible CSS grid layout component',
    api: {
      events: ['wb-grid:ready'],
      attributes: ['columns', 'gap', 'min'],
      methods: ['render']
    },
    priority: 3
  });
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBGrid = WBGrid;
window.WBGrid = WBGrid;

export { WBGrid };
export default WBGrid;
