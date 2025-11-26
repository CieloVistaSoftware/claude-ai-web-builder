import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBDevToolbox extends WBBaseComponent {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    
    // Create reactive state
    this._state = new Proxy({
      log: [],
      showLocalLog: true,
      maxEntries: 50
    }, {
      set: (target, prop, value) => {
        target[prop] = value;
        if (prop === 'log' || prop === 'showLocalLog') {
          this._render();
        }
        return true;
      }
    });
    
    // Bind methods
    this._onError = this._onError.bind(this);
    this._onRejection = this._onRejection.bind(this);
    this._onWbError = this._onWbError.bind(this);
    
    this._setupShadowDOM();
  }
  
  static get observedAttributes() {
    return ['show-local-log', 'max-entries'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'show-local-log':
        this._state.showLocalLog = newValue !== 'false';
        const checkbox = this.shadowRoot.getElementById('showLocalLog');
        if (checkbox) checkbox.checked = this._state.showLocalLog;
        break;
      case 'max-entries':
        const max = parseInt(newValue);
        if (!isNaN(max) && max > 0) {
          this._state.maxEntries = max;
        }
        break;
    }
  }
  
  _setupShadowDOM() {
    // Load external CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('./wb-dev-toolbox.css', import.meta.url).href;
    this.shadowRoot.appendChild(link);
    
    // Create structure
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="toolbar">
        <label><input type="checkbox" id="showLocalLog" checked> Show errors in Dev Toolbox</label>
      </div>
      <div id="log"></div>
    `;
    this.shadowRoot.appendChild(container);
    this.logDiv = this.shadowRoot.getElementById('log');
  }
  connectedCallback() {
    super.connectedCallback(); // Inherit dark mode and other base functionality
    
    this.logInfo('WBDevToolbox connected');
    
    // Listen for error events reactively
    window.addEventListener('error', this._onError, true);
    window.addEventListener('unhandledrejection', this._onRejection, true);
    
    // Listen for wb: events from other components
    document.addEventListener('wb:error', this._onWbError);
    document.addEventListener('wb:warning', this._onWbError);
    document.addEventListener('wb:info', this._onWbError);
    
    // Setup reactive toggle handling
    const showLocalLogBox = this.shadowRoot.getElementById('showLocalLog');
    if (showLocalLogBox) {
      showLocalLogBox.addEventListener('change', (e) => {
        this._state.showLocalLog = e.target.checked;
      });
    }
    
    // Auto-detect wb-event-log presence
    if (document.querySelector('wb-event-log')) {
      this._state.showLocalLog = false;
      if (showLocalLogBox) showLocalLogBox.checked = false;
    }
    
    this.fireEvent('wb-dev-toolbox:ready', { component: 'wb-dev-toolbox' });
    this.logInfo('WBDevToolbox ready');
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    
    window.removeEventListener('error', this._onError, true);
    window.removeEventListener('unhandledrejection', this._onRejection, true);
    document.removeEventListener('wb:error', this._onWbError);
    document.removeEventListener('wb:warning', this._onWbError);
    document.removeEventListener('wb:info', this._onWbError);
    
    this.logDebug('WBDevToolbox disconnected');
  }
  _onError = (event) => {
    let msg;
    if (event.target && (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK' || event.target.tagName === 'IMG')) {
      msg = `Resource load error: <${event.target.tagName.toLowerCase()}> src/href: ${event.target.src || event.target.href}`;
    } else {
      msg = `JS error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
    }
    this._addLog(msg, 'error');
  }
  _onRejection = (event) => {
    this._addLog('Unhandled promise rejection: ' + event.reason, 'error');
  }
  _onWbError(event) {
    if (event.detail && event.detail.source !== 'wb-dev-toolbox') {
      const type = event.type.replace('wb:', '');
      this._addLog(event.detail.message, type);
    }
  }
  
  _addLog(msg, type = 'info') {
    const entry = {msg, type, time: new Date().toLocaleTimeString()};
    
    // Always publish as custom event for observers like wb-event-log
    const eventType = {
      'error': 'wb:error',
      'warn': 'wb:warning',
      'warning': 'wb:warning',
      'info': 'wb:info',
      'debug': 'wb:debug',
      'success': 'wb:success',
      'user': 'wb:user'
    }[type] || 'wb:info';
    
    // Extract event name without 'wb:' prefix for fireEvent
    const eventName = eventType.replace('wb:', '');
    this.fireEvent(eventName, {
      message: msg,
      type,
      time: entry.time,
      source: 'wb-dev-toolbox',
    });
    
    // Update reactive state
    if (this._state.showLocalLog) {
      const newLog = [entry, ...this._state.log].slice(0, this._state.maxEntries);
      this._state.log = newLog;
    }
  }
  _render() {
    if (!this.logDiv) return;
    this.logDiv.innerHTML = this._state.log
      .map(e => `<div class="log-entry ${e.type}">[${e.time}] ${e.msg}</div>`)
      .join('');
  }
}
customElements.define('wb-dev-toolbox', WBDevToolbox);