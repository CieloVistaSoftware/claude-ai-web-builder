/**
 * WB Log Viewer Web Component
 * Displays event logs in a scrollable panel
 * 
 * @example
 * <wb-log-viewer max-entries="100"></wb-log-viewer>
 * 
 * @version 2.0.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBLogViewer extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
        this._logElement = null;
        this._boundHandleEvent = null;
        this._log = [];
        this._maxEntries = 200;
    }

    static get observedAttributes() {
        return ['max-entries'];
    }

    async connectedCallback() {
        super.connectedCallback();
        
        this.logInfo('WBLogViewer connecting');
        
        await loadComponentCSS(this, 'wb-log-viewer.css');
        this._setupShadowDOM();
        
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
                this._maxEntries = max;
            }
        }
        
        this._render();
        
        this.fireEvent('wb-log-viewer:ready', { component: 'wb-log-viewer' });
        this.logInfo('WBLogViewer ready');
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        
        document.removeEventListener('wb:log', this._boundHandleEvent);
        document.removeEventListener('wb:error', this._boundHandleEvent);
        document.removeEventListener('wb:info', this._boundHandleEvent);
        document.removeEventListener('wb:debug', this._boundHandleEvent);
        
        this.logDebug('WBLogViewer disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (name === 'max-entries' && oldValue !== newValue) {
            const max = parseInt(newValue);
            if (!isNaN(max) && max > 0) {
                this._maxEntries = max;
                if (this._log.length > max) {
                    this._log = this._log.slice(0, max);
                    this._render();
                }
            }
        }
    }

    // Property getters/setters
    get maxEntries() {
        return this._maxEntries;
    }
    
    set maxEntries(value) {
        this._maxEntries = parseInt(value) || 200;
        this.setAttribute('max-entries', this._maxEntries.toString());
    }

    _setupShadowDOM() {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = `
            <style>
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
                    padding: 0.5em;
                }
                .empty { 
                    color: #64748b; 
                    font-style: italic; 
                }
            </style>
            <pre id="log"></pre>
        `;
        
        this._logElement = this.shadowRoot.querySelector('#log');
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
        this._log.unshift(entry);
        if (this._log.length > this._maxEntries) {
            this._log.length = this._maxEntries;
        }
        this._render();
    }

    clear() {
        this._log = [];
        this._render();
        this.fireEvent('wb-log-viewer:cleared', {});
    }

    _render() {
        if (!this._logElement) return;
        
        if (this._log.length === 0) {
            this._logElement.innerHTML = '<span class="empty">No log entries</span>';
        } else {
            this._logElement.textContent = this._log.join('\n');
        }
    }

    // Public API
    getLog() {
        return [...this._log];
    }

    setMaxEntries(max) {
        this.maxEntries = max;
    }
}

if (!customElements.get('wb-log-viewer')) {
    customElements.define('wb-log-viewer', WBLogViewer);
}

if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-log-viewer', WBLogViewer, [], {
        version: '2.0.0',
        type: 'display',
        role: 'ui-element',
        description: 'Log viewer component for displaying event logs',
        api: {
            events: ['wb-log-viewer:ready', 'wb-log-viewer:cleared'],
            attributes: ['max-entries'],
            methods: ['add', 'clear', 'getLog', 'setMaxEntries']
        },
        priority: 4
    });
}

if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBLogViewer = WBLogViewer;
window.WBLogViewer = WBLogViewer;

export { WBLogViewer };
export default WBLogViewer;
