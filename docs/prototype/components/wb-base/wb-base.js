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

class WBBaseComponent extends HTMLElement {
    constructor() {
        super();
        // Attach shadow root if not already present
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }
        // Optionally, auto-load styles if a static styleUrl is defined
        if (this.constructor.styleUrl) {
            this._loadStyles(this.constructor.styleUrl);
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

    // Utility: Fire a custom event
    fireEvent(name, detail = {}, options = {}) {
        this.dispatchEvent(new CustomEvent(name, {
            detail,
            bubbles: options.bubbles ?? true,
            composed: options.composed ?? true,
            cancelable: options.cancelable ?? false
        }));
    }

    // Logging helpers
    logInfo(msg, ctx) {
        if (window.WBEventLog && WBEventLog.logInfo) {
            WBEventLog.logInfo(msg, ctx);
        } else {
            console.info('[WB]', msg, ctx);
        }
    }
    logError(msg, ctx) {
        if (window.WBEventLog && WBEventLog.logError) {
            WBEventLog.logError(msg, ctx);
        } else {
            console.error('[WB]', msg, ctx);
        }
    }
    logDebug(msg, ctx) {
        if (window.WBEventLog && WBEventLog.logDebug) {
            WBEventLog.logDebug(msg, ctx);
        } else {
            console.debug('[WB]', msg, ctx);
        }
    }
    reportError(error, context) {
        this.logError(error?.message || error, context);
        this.fireEvent('wb:error', { error, context });
    }

    // Attribute/property reflection helpers
    static get observedAttributes() { return []; }
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

    // Utility: Set/get attribute as property
    setAttr(name, value) {
        if (value === false || value === undefined || value === null) {
            this.removeAttribute(name);
        } else {
            this.setAttribute(name, value === true ? '' : value);
        }
    }
    getAttr(name) {
        return this.hasAttribute(name) ? this.getAttribute(name) : null;
    }

    // Slot/content helpers
    getSlotNodes(name) {
        const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
        return slot ? slot.assignedNodes({ flatten: true }) : [];
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
            if (window.marked) return Promise.resolve(window.marked);
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
                script.onload = () => resolve(window.marked);
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
                el = document.querySelector(target);
            }
            if (el) {
                el.innerHTML = html;
            }
        } catch (error) {
            let el = target;
            if (typeof target === 'string') {
                el = document.querySelector(target);
            }
            if (el) {
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
    static get schemaUrl() { return null; }
    async loadSchema() {
        if (!this.constructor.schemaUrl) return null;
        try {
            const resp = await fetch(this.constructor.schemaUrl);
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

// Make WBBaseComponent available globally
window.WBBaseComponent = WBBaseComponent;

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
window.WBDemoBase = WBDemoBase;
