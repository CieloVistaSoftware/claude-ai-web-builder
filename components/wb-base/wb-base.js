
// WBDemoBase will be defined after WBBaseComponent
// Helper to inject event log tab into all wb-demo components if enabled in config
let _eventLogTabInjected = false;

// Global reactive event log state for WB components
const WBEventLogState = { entries: [] };
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



// wb-base.js
// Enhanced base class for all WB Web Components
import {
    reflectAttribute,
    getAttributeOrDefault,
    dispatchWBEvent,
    defineObservedAttributes
} from '../component-helpers/component-utils.js';

class WBBaseComponent extends HTMLElement {
    // Default static styleUrl property to avoid missing property errors
    static styleUrl = null;
    // Allow subclasses to opt out of shadow DOM
    static useShadow = true;
    asHTMLElement(el) {
        return el instanceof HTMLElement ? el : null;
    }
    constructor() {
        super();
        // Attach shadow root only if useShadow is true and not already present
        const ctor = /** @type {typeof WBBaseComponent} */ (this.constructor);
        if (ctor.useShadow && !this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }
        // Optionally, auto-load styles if a static styleUrl is defined
        if (ctor.styleUrl) {
            this._loadStyles(ctor.styleUrl);
        }
        // Theme handling
        this._themeChangeHandler = this._onThemeChange.bind(this);
        // For convenience, expose event log state
        this.WBEventLogState = WBEventLogState;
    }
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

    static getEventLog() {
        return WBEventLogState.entries;
    }


    // Utility: Load external CSS into shadow root
    _loadStyles(url) {
        if (!url) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        if (this.shadowRoot) {
            this.shadowRoot.appendChild(link);
        }
    }

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
        WBBaseComponent.logEvent(msg, 'info');
        if (typeof window !== 'undefined' && window.WBEventLog && typeof window.WBEventLog.logInfo === 'function') {
            window.WBEventLog.logInfo(msg, ctx);
        } else {
            console.info('[WB]', msg, ctx);
        }
    }
    logError(msg, ctx) {
        WBBaseComponent.logEvent(msg, 'error');
        if (typeof window !== 'undefined' && window.WBEventLog && typeof window.WBEventLog.logError === 'function') {
            window.WBEventLog.logError(msg, ctx);
        } else {
            console.error('[WB]', msg, ctx);
        }
    }
    logDebug(msg, ctx) {
        WBBaseComponent.logEvent(msg, 'debug');
        if (typeof window !== 'undefined' && window.WBEventLog && typeof window.WBEventLog.logDebug === 'function') {
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
        // Set global mode to dark for all WB components
        document.documentElement.setAttribute('data-mode', 'dark');
        document.body.setAttribute('data-mode', 'dark');

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
        const slotName = name;
        const slot = this.shadowRoot ? this.shadowRoot.querySelector(`slot[name="${slotName}"]`) : null;
        return slot && slot instanceof HTMLSlotElement ? slot.assignedNodes({ flatten: true }) : [];
    }
    isSlotEmpty(name) {
        const nodes = this.getSlotNodes(name);
        return nodes.length === 0 || nodes.every(n => n.nodeType === Node.TEXT_NODE && (!n.textContent || !n.textContent.trim()));
    }

    static async renderMarkdownDoc(mdUrl, target) {
        function loadMarked() {
            if (typeof window !== 'undefined' && window['marked']) return Promise.resolve(window['marked']);
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
// Defines wb-demo-base and attaches demo event/hover logic
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
if (typeof window !== 'undefined') {
    window['WBBaseComponent'] = WBBaseComponent;

    // Compositional Namespace
    if (!window['WB']) window['WB'] = { components: {}, utils: {} };
    window['WB'].components.WBBaseComponent = WBBaseComponent;
    window['WB'].components.WBDemoBase = WBDemoBase;
}
/**
 * ═══════════════════════════════════════════════════════════════════
 * COPY THIS CODE TO wb-base.js (at the very end, before export)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * This auto-loads the Claude Logger in all demo files!
 * No need to manually add it to each demo.
 */

// Auto-load Claude Logger in demo mode
WBBaseComponent._initClaudeLogger = (() => {
    // Only run once per page
    if (window._claudeLoggerInitialized) return;
    
    // Detect demo mode
    const isDemoMode = window.location.pathname.toLowerCase().includes('demo')
                    || document.title.toLowerCase().includes('demo')
                    || window.location.hostname === 'localhost'
                    || window.location.hostname === '127.0.0.1';
    
    if (!isDemoMode) return;
    
    // Mark as initialized
    window._claudeLoggerInitialized = true;
    
    // Load logger when DOM is ready
    const loadLogger = () => {
        const script = document.createElement('script');
        script.type = 'module';
        
        // 🔧 ADJUST THIS PATH based on your directory structure
        // Add version to force cache refresh
        script.src = '/components/wb-claude-logger/wb-claude-logger/wb-claude-logger.js?v=' + Date.now();
        
        script.onload = () => {
            // Add logger to page if not already present
            if (!document.querySelector('wb-claude-logger')) {
                const logger = document.createElement('wb-claude-logger');
                
                // Enable backend by default (save to claude.md files)
                logger.setAttribute('use-backend', 'true');
                
                // Optional: Read configuration from meta tags
                const position = document.querySelector('meta[name="claude-logger-position"]');
                if (position) {
                    logger.setAttribute('position', position.getAttribute('content'));
                }
                
                // Allow meta tag to override backend setting
                const useBackendMeta = document.querySelector('meta[name="claude-logger-use-backend"]');
                if (useBackendMeta) {
                    logger.setAttribute('use-backend', useBackendMeta.getAttribute('content'));
                }
                
                document.body.appendChild(logger);
            }
        };
        
        script.onerror = () => {
            console.warn('Claude Logger not available at:', script.src);
        };
        
        document.head.appendChild(script);
    };
    
    // Load when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadLogger);
    } else {
        loadLogger();
    }
})();

/**
 * ═══════════════════════════════════════════════════════════════════
 * THAT'S IT! Now every demo automatically has the 📝 logger button
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Optional: Customize per demo with meta tags in <head>:
 * 
 * <meta name="claude-logger-position" content="top-left">
 * <meta name="claude-logger-use-backend" content="true">
 * 
 * The logger will only load when:
 * ✅ URL contains "demo"
 * ✅ OR title contains "demo"
 * ✅ OR running on localhost
 * 
 * Production pages are NOT affected! 🎉
 */
// ES6 Module Exports
export { WBBaseComponent, WBDemoBase };
export default WBBaseComponent;
