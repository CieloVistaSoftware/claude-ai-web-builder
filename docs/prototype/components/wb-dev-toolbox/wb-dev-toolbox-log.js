// Note: wb-log-viewer import removed to avoid ES6 module syntax errors
// Component will load dependencies dynamically as needed

class WBDevToolboxLog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
      </style>
      <wb-log-viewer id="logViewer"></wb-log-viewer>
    `;
    this.logViewer = this.shadowRoot.getElementById('logViewer');
    this._boundLog = this._logEvent.bind(this);
  }

  connectedCallback() {
    ['wb:error','wb:warning','wb:info','wb:debug','wb:success','wb:user'].forEach(type => {
      document.addEventListener(type, this._boundLog);
    });
    window.addEventListener('error', this._boundLog);
    window.addEventListener('unhandledrejection', this._boundLog);
  }

  disconnectedCallback() {
    ['wb:error','wb:warning','wb:info','wb:debug','wb:success','wb:user'].forEach(type => {
      document.removeEventListener(type, this._boundLog);
    });
    window.removeEventListener('error', this._boundLog);
    window.removeEventListener('unhandledrejection', this._boundLog);
  }

  _logEvent(e) {
    let msg = '';
    if (e.type.startsWith('wb:')) {
      msg = `[${new Date().toLocaleTimeString()}] CustomEvent: ${e.type} | message: ${e.detail?.message} | source: ${e.detail?.source}`;
    } else if (e.type === 'error') {
      msg = `[${new Date().toLocaleTimeString()}] window.error: ${e.message || e.type}`;
    } else if (e.type === 'unhandledrejection') {
      msg = `[${new Date().toLocaleTimeString()}] window.unhandledrejection: ${e.reason}`;
    }
    if (msg) this.logViewer.add(msg);
  }

  clear() {
    this.logViewer.clear();
  }
}

customElements.define('wb-dev-toolbox-log', WBDevToolboxLog);
