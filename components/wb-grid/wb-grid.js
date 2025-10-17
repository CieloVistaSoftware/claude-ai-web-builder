// wb-grid.js
// A simple, flexible grid web component for layout

class WBGrid extends HTMLElement {
  static get observedAttributes() {
    return ['columns', 'gap'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._render();
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const columns = this.getAttribute('columns') || 'auto-fit';
    const min = this.getAttribute('min') || '200px';
    const gap = this.getAttribute('gap') || '1rem';
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

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBGrid = WBGrid;

// Expose globally (backward compatibility)
window.WBGrid = WBGrid;

// ES6 Module Exports
export { WBGrid };
export default WBGrid;
