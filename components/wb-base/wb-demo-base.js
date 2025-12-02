/**
 * WBDemoBase - Demo extension of WBBaseComponent
 * 
 * Provides demo-specific features for testing and development.
 * Separated from core WBBaseComponent to keep base class focused.
 */

import WBBaseComponent from './wb-base.js';

class WBDemoBase extends WBBaseComponent {
  constructor() {
    super();
    this._message = 'WBBaseComponent is working!';
  }

  get message() {
    return this._message;
  }

  set message(val) {
    if (this._message !== val) {
      this._message = val;
      this._render();
    }
  }

  _render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <div class="demo-base-message">${this._message}</div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._render();
    this.logInfo('WBDemoBase connected', { component: 'WBDemoBase' });
  }
}

if (!customElements.get('wb-demo-base')) {
  customElements.define('wb-demo-base', WBDemoBase);
}

// Make WBDemoBase available globally
if (typeof window !== 'undefined') {
  /** @type {any} */ (window).WBDemoBase = WBDemoBase;
  
  // Add to WB namespace
  if (!window['WB']) window['WB'] = { components: {}, utils: {} };
  window['WB'].components.WBDemoBase = WBDemoBase;
}

export { WBDemoBase };
export default WBDemoBase;
