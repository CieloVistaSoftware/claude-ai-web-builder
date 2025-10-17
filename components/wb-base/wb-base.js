// @ts-check

// TypeScript declarations for global objects
/**
 * @typedef {typeof WBBaseComponent} WBBaseComponentConstructor
 * @typedef {typeof WBDemoBase} WBDemoBaseConstructor
 */

// WBDemoBase will be defined after WBBaseComponent
// Helper to inject event log tab into all wb-demo components if enabled in config
let _eventLogTabInjected = false;
async function injectEventLogTabIfEnabled() {
    if (_eventLogTabInjected) return;
    try {
        const response = await fetch('/config/components.config.json');
        if (!response.ok) return;
        const config = await response.json();
        if (config.eventLogging) {
            if (document.readyState === 'loading') {
                await new Promise(res => document.addEventListener('DOMContentLoaded', res, { once: true }));
            }
            customElements.whenDefined('wb-demo').then(() => {
                document.querySelectorAll('wb-demo').forEach(demo => {
                    if (!demo.querySelector('[slot="event-log"]')) {
                        const logTab = document.createElement('div');
                        logTab.setAttribute('slot', 'event-log');
                        logTab.innerHTML = '<wb-event-log style="width:100%;height:300px;display:block;"></wb-event-log>';
                        demo.appendChild(logTab);
                    }
                });
            });
            _eventLogTabInjected = true;
        }
    } catch (e) {}
}

// Reactive event log state (singleton)
const WBEventLogState = new Proxy({ entries: [] }, {
    set(target, prop, value) {
        target[prop] = value;
        if (prop === 'entries') {
            document.dispatchEvent(new CustomEvent('wb:event-log-updated', { detail: target.entries }));
        }
        return true;
    }
});


// wb-base.js
// Enhanced base class for all WB Web Components
import {
    addTrackedEventListener,
    reflectAttribute,
    getAttributeOrDefault,
    dispatchWBEvent,
    defineObservedAttributes
} from '../component-utils.js';

class WBBaseComponent extends HTMLElement {
    // Default static styleUrl property to avoid missing property errors
    /**
     * @type {string|null}
     */
    static styleUrl = null;
    /**
     * Safely cast any variable to HTMLElement if possible, else returns null
     * @param {any} el - The variable to check
     * @returns {HTMLElement|null}
     */
    asHTMLElement(el) {
        return el instanceof HTMLElement ? el : null;
    }
    constructor() {
        super();
        // Attach shadow root if not already present
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }
        // Optionally, auto-load styles if a static styleUrl is defined
        const ctor = /** @type {typeof WBBaseComponent} */ (this.constructor);
        if (ctor.styleUrl) {
            this._loadStyles(ctor.styleUrl);
        }
        // Theme handling
        this._themeChangeHandler = this._onThemeChange.bind(this);
        // For convenience, expose event log state
        this.WBEventLogState = WBEventLogState;
    }
    /**
     * Add an event to the global reactive event log and notify listeners.
     * @param {string} message - The log message
     * @param {string} [type='info'] - Log type: info, error, debug, etc.
     */
    static logEvent(message, type = 'info') {
        WBEventLogState.entries.unshift({
            type,
            message,
            time: new Date().toLocaleTimeString()
        });
        // Keep only last 50 entries
        if (WBEventLogState.entries.length > 50) {
            WBEventLogState.entries.length = 50;
        }
        // Trigger update event (handled by Proxy)
        WBEventLogState.entries = WBEventLogState.entries;
    }

    /**
     * Get the current event log entries (reactive).
     */
    static getEventLog() {
        return WBEventLogState.entries;
    }


    // Utility: Load external CSS into shadow root
    _loadStyles(url) {
        if (!url) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        this.shadowRoot.appendChild(link);
    }

    /**
     * Safely set style properties if the element is an HTMLElement
     * @param {any} el - The element or variable to style
     * @param {Object} styleProps - An object of style properties and values
     */
    setStyleIfHTMLElement(el, styleProps) {
        if (el instanceof HTMLElement && el.style) {
            Object.assign(el.style, styleProps);
        }
    }

    // Utility: Fire a custom event (now uses shared util)
    fireEvent(name, detail = {}, options = {}) {
        dispatchWBEvent(this, name, detail, options.bubbles ?? true, options.composed ?? true);
    }

    // Logging helpers
    logInfo(msg, ctx) {
        if (window.WBEventLog && window.WBEventLog.logInfo) {
            window.WBEventLog.logInfo(msg, ctx);
        } else {
            console.info('[WB]', msg, ctx);
        }
    }
    logError(msg, ctx) {
        if (window.WBEventLog && window.WBEventLog.logError) {
            window.WBEventLog.logError(msg, ctx);
        } else {
            console.error('[WB]', msg, ctx);
        }
    }
    logDebug(msg, ctx) {
        if (window.WBEventLog && window.WBEventLog.logDebug) {
            window.WBEventLog.logDebug(msg, ctx);
        } else {
            console.debug('[WB]', msg, ctx);
        }
    }
    reportError(error, context) {
        this.logError(error?.message || error, context);
        this.fireEvent('wb:error', { error, context });
    }

    // Attribute/property reflection helpers (now uses shared util)
    static get observedAttributes() { return defineObservedAttributes([]); }
    attributeChangedCallback(name, oldValue, newValue) {
        // Override in subclass if needed
    }

    // Lifecycle hooks
    connectedCallback() {
        // Theme event listener
        document.addEventListener('wb:theme-changed', this._themeChangeHandler);

        // Inject event log tab into all wb-demo components if enabled in config (only once)
        injectEventLogTabIfEnabled();
    }
    disconnectedCallback() {
        document.removeEventListener('wb:theme-changed', this._themeChangeHandler);
    }

    // Utility: Set/get attribute as property (now uses shared utils)
    setAttr(name, value) {
        reflectAttribute(this, name, value);
    }
    getAttr(name, defaultValue = null) {
        return getAttributeOrDefault(this, name, defaultValue);
    }

    // Slot/content helpers
    getSlotNodes(name) {
    const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
    return slot && slot instanceof HTMLSlotElement ? slot.assignedNodes({ flatten: true }) : [];
    }
    isSlotEmpty(name) {
        const nodes = this.getSlotNodes(name);
        return nodes.length === 0 || nodes.every(n => n.nodeType === Node.TEXT_NODE && !n.textContent.trim());
    }

    /**
     * Dynamically loads marked.js from CDN if not present, then fetches and renders Markdown into a target element.
     * @param {string} mdUrl - URL of the Markdown file to fetch
     * @param {HTMLElement|string} target - Element or selector to render HTML into
     */
    static async renderMarkdownDoc(mdUrl, target) {
        // Helper to load marked if not present
        function loadMarked() {
            if (window['marked']) return Promise.resolve(window['marked']);
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
                script.onload = () => resolve(window['marked']);
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        try {
            const [markedLib, response] = await Promise.all([
                loadMarked(),
                fetch(mdUrl)
            ]);
            if (!response.ok) throw new Error('Failed to load markdown: ' + mdUrl);
            const markdown = await response.text();
            const html = markedLib.parse(markdown);
            let el = target;
            if (typeof target === 'string') {
                const foundEl = document.querySelector(target);
                if (foundEl instanceof HTMLElement) {
                    el = foundEl;
                } else {
                    console.error('Target element not found or not an HTMLElement:', target);
                    return;
                }
            }
            if (el instanceof HTMLElement) {
                el.innerHTML = html;
            }
        } catch (error) {
            let el = target;
            if (typeof target === 'string') {
                const foundEl = document.querySelector(target);
                if (foundEl instanceof HTMLElement) {
                    el = foundEl;
                } else {
                    return; // silently fail in error handler
                }
            }
            if (el instanceof HTMLElement) {
                el.innerHTML = '<p>Error loading documentation: ' + error.message + '</p>';
            }
        }
    }

    // Theme/mode helpers
    _onThemeChange(event) {
        const theme = event?.detail?.theme || document.documentElement.getAttribute('data-theme') || 'light';
        this.setAttribute('theme', theme);
        this.logDebug('Theme updated', { theme });
    }
    getCurrentTheme() {
        return this.getAttribute('theme') || document.documentElement.getAttribute('data-theme') || 'light';
    }

    // Schema/config loading (stub for override)
    /**
     * @returns {string|null}
     */
    static get schemaUrl() { return null; }
    async loadSchema() {
        const ctor = /** @type {typeof WBBaseComponent} */ (this.constructor);
        if (!ctor.schemaUrl) return null;
        try {
            const resp = await fetch(ctor.schemaUrl);
            if (!resp.ok) throw new Error('Failed to load schema');
            return await resp.json();
        } catch (e) {
            this.reportError(e, { action: 'loadSchema' });
            return null;
        }
    }

    // Static registration helper
    static register(tagName) {
        if (!customElements.get(tagName)) {
            customElements.define(tagName, this);
        }
    }

    // Metadata
    static get componentName() { return this.name; }
    static get version() { return '1.0.0'; }
}

// Export moved to end of file after WBDemoBase definition

// --- DEMO LOGIC FOR wb-base-demo.html ---
// Defines <wb-demo-base> and attaches demo event/hover logic
class WBDemoBase extends WBBaseComponent {
    constructor() {
        super();
        this._message = 'WBBaseComponent is working!';
        this._render();
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
        this.logInfo('WBDemoBase connected', { component: 'WBDemoBase' });
    }
}
if (!customElements.get('wb-demo-base')) {
    customElements.define('wb-demo-base', WBDemoBase);
}

// Make WBDemoBase available globally
if (typeof window !== 'undefined') {
    /** @type {any} */ (window).WBDemoBase = WBDemoBase;
}

// Make WBBaseComponent available globally
window['WBBaseComponent'] = WBBaseComponent;

// Compositional Namespace
if (!window['WB']) window['WB'] = { components: {}, utils: {} };
window['WB'].components.WBBaseComponent = WBBaseComponent;
window['WB'].components.WBDemoBase = WBDemoBase;

// ES6 Module Exports
export { WBBaseComponent, WBDemoBase };
export default WBBaseComponent;
