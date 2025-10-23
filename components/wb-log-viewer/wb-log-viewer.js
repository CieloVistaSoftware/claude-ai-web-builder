import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBLogViewer extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    await loadComponentCSS(this, 'wb-log-viewer.css');
    this.attachShadow({ mode: 'open' });
    
    // Create reactive state using Proxy
    this._state = new Proxy({
      log: [],
      maxEntries: 200
    }, {
      set: (target, prop, value) => {
        target[prop] = value;
        if (prop === 'log') {
          this._render();
        }
        return true;
      }
    });
    
    this._setupShadowDOM();
  }
  
  static get observedAttributes() {
    return ['max-entries'];
  }
  
  connectedCallback() {
    // Listen for wb: events
    this._boundHandleEvent = this._handleWbEvent.bind(this);
    document.addEventListener('wb:log', this._boundHandleEvent);
    document.addEventListener('wb:error', this._boundHandleEvent);
    document.addEventListener('wb:info', this._boundHandleEvent);
    document.addEventListener('wb:debug', this._boundHandleEvent);
    
    // Check for initial max-entries attribute
    const maxEntries = this.getAttribute('max-entries');
    if (maxEntries) {
      const max = parseInt(maxEntries);
      if (!isNaN(max) && max > 0) {
        this._state.maxEntries = max;
      }
    }
    
    // Initial render
    this._render();
  }
  
  disconnectedCallback() {
    document.removeEventListener('wb:log', this._boundHandleEvent);
    document.removeEventListener('wb:error', this._boundHandleEvent);
    document.removeEventListener('wb:info', this._boundHandleEvent);
    document.removeEventListener('wb:debug', this._boundHandleEvent);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'max-entries') {
      const max = parseInt(newValue);
      if (!isNaN(max) && max > 0) {
        this._state.maxEntries = max;
        // Trim log if needed
        if (this._state.log.length > max) {
          this._state.log = this._state.log.slice(0, max);
        }
      }
    }
  }
  
  _setupShadowDOM() {
    const style = document.createElement('style');
    style.textContent = `
      :host { 
        display: block; 
        font-family: monospace; 
        background: #18181b; 
        color: #fbbf24; 
        border-radius: 6px; 
        padding: 0.5em 0.7em; 
      }
      pre { 
        margin: 0; 
        background: #111; 
        color: #fbbf24; 
        border-radius: 4px; 
        font-size: 0.95em; 
        max-height: 10em; 
        overflow: auto; 
      }
      .empty { 
        color: #64748b; 
        font-style: italic; 
      }
    `;
    
    const pre = document.createElement('pre');
    pre.id = 'log';
    
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(pre);
    
    this._logElement = pre;
  }
  
  _handleWbEvent(event) {
    if (event.detail && event.detail.message) {
      const timestamp = new Date().toLocaleTimeString();
      const type = event.type.replace('wb:', '').toUpperCase();
      const entry = `[${timestamp}] ${type}: ${event.detail.message}`;
      this.add(entry);
    }
  }

  add(entry) {
    const newLog = [entry, ...this._state.log];
    if (newLog.length > this._state.maxEntries) {
      newLog.length = this._state.maxEntries;
    }
    this._state.log = newLog;
  }

  clear() {
    this._state.log = [];
  }
  
  _render() {
    if (!this._logElement) return;
    
    if (this._state.log.length === 0) {
      this._logElement.innerHTML = '<span class="empty">No log entries</span>';
    } else {
      this._logElement.textContent = this._state.log.join('\n');
    }
  }
  
  // Public API methods
  getLog() {
    return [...this._state.log];
  }
  
  setMaxEntries(max) {
    this.setAttribute('max-entries', max.toString());
  }
}

customElements.define('wb-log-viewer', WBLogViewer);
