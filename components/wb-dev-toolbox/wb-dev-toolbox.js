import WBBaseComponent from '../wb-base/wb-base.js';

class WBDevToolbox extends WBBaseComponent {
  constructor() {
    super();
    
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
    
    this._setupDOM();
  }
  
  static get observedAttributes() {
    return ['show-local-log', 'max-entries'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'show-local-log':
        this._state.showLocalLog = newValue !== 'false';
        const checkbox = this.getElementById('showLocalLog');
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
  
  _setupDOM() {
    this.innerHTML = `
      <style>
        :host { display: block; font-family: monospace; background: #18181b; color: #fbbf24; padding: 0.5em 1em; border-radius: 6px; margin: 1em 0; max-width: 100vw; overflow-x: auto; }
        .log-entry { margin-bottom: 0.25em; font-size: 0.95em; }
        .error { color: #ef4444; }
        .warn { color: #f59e42; }
        .info { color: #38bdf8; }
        .toolbar { margin-bottom: 0.5em; }
        .toolbar label { font-size: 0.9em; margin-right: 1em; }
      </style>
      <div class="toolbar">
        <label><input type="checkbox" id="showLocalLog" checked> Show errors in Dev Toolbox</label>
      </div>
      <div id="log"></div>
    `;
    this.logDiv = this.getElementById('log');
  }
  connectedCallback() {
    super.connectedCallback(); // Inherit dark mode and other base functionality
    // Listen for error events reactively
    window.addEventListener('error', this._onError, true);
    window.addEventListener('unhandledrejection', this._onRejection, true);
    
    // Listen for wb: events from other components
    document.addEventListener('wb:error', this._onWbError);
    document.addEventListener('wb:warning', this._onWbError);
    document.addEventListener('wb:info', this._onWbError);
    
    // Setup reactive toggle handling
    const showLocalLogBox = this.getElementById('showLocalLog');
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
  }
  disconnectedCallback() {
    window.removeEventListener('error', this._onError, true);
    window.removeEventListener('unhandledrejection', this._onRejection, true);
    document.removeEventListener('wb:error', this._onWbError);
    document.removeEventListener('wb:warning', this._onWbError);
    document.removeEventListener('wb:info', this._onWbError);
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
