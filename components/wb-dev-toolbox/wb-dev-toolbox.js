class WBDevToolbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
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
    this.logDiv = this.shadowRoot.getElementById('log');
    this.maxEntries = 50;
    this._log = [];
    this.showLocalLog = true;
  }
  connectedCallback() {
    window.addEventListener('error', this._onError);
    window.addEventListener('unhandledrejection', this._onRejection);
    // Setup toggle for local log display
    const showLocalLogBox = this.shadowRoot.getElementById('showLocalLog');
    if (showLocalLogBox) {
      showLocalLogBox.addEventListener('change', (e) => {
        this.showLocalLog = e.target.checked;
        this._render();
      });
    }
    // If wb-event-log is present, default to not showing local log
    if (document.querySelector('wb-event-log')) {
      this.showLocalLog = false;
      if (showLocalLogBox) showLocalLogBox.checked = false;
    }
  }
  disconnectedCallback() {
    window.removeEventListener('error', this._onError);
    window.removeEventListener('unhandledrejection', this._onRejection);
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
    document.dispatchEvent(new CustomEvent(eventType, {
      detail: {
        message: msg,
        type,
        time: entry.time,
        source: 'wb-dev-toolbox',
      }
    }));
    // Only show in local log if enabled
    if (this.showLocalLog) {
      this._log.unshift(entry);
      if (this._log.length > this.maxEntries) this._log.length = this.maxEntries;
      this._render();
    }
  }
  _render() {
    this.logDiv.innerHTML = this._log.map(e => `<div class="log-entry ${e.type}">[${e.time}] ${e.msg}</div>`).join('');
  }
}
customElements.define('wb-dev-toolbox', WBDevToolbox);