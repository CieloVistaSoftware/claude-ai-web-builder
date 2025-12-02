// wb-base.js
// Enhanced base class for all WB Web Components
import {
    reflectAttribute,
    getAttributeOrDefault,
    dispatchWBEvent,
    defineObservedAttributes
} from '../component-helpers/component-utils.js';

// Global reactive event log state for WB components
// MUST be defined BEFORE WBBaseComponent class since it's used in static methods
const WBEventLogState = { entries: [] };

/**
 * WBBaseComponent - Base class for all WB Web Components
 * 
 * Provides:
 * - Light DOM only (CSS-first, AI-friendly architecture)
 * - Event log state management
 * - Theme/mode handling
 * - Attribute reflection utilities
 * - Error reporting
 * - Component registration
 * 
 * @example
 * ```javascript
 * class MyButton extends WBBaseComponent {
 *   connectedCallback() {
 *     super.connectedCallback();
 *     const button = document.createElement('button');
 *     button.textContent = 'Click me';
 *     this.appendChild(button);
 *   }
 * }
 * customElements.define('my-button', MyButton);
 * ```
 */
class WBBaseComponent extends HTMLElement {
    // Default static styleUrl property to avoid missing property errors
    static styleUrl = null;
    
    asHTMLElement(el) {
        return el instanceof HTMLElement ? el : null;
    }
    
    constructor() {
        super();
        // Light DOM only - no Shadow DOM
        // Theme handling
        this._themeChangeHandler = this._onThemeChange.bind(this);
        // For convenience, expose event log state
        this.WBEventLogState = WBEventLogState;
    }
    
    /**
     * Log an event to the global event log
     * @param {string} message - Message to log
     * @param {string} type - Log level (info, error, debug)
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
        // Trigger update event
        WBEventLogState.entries = WBEventLogState.entries;
    }

    /**
     * Get the current event log
     * @returns {Array} Event log entries
     */
    static getEventLog() {
        return WBEventLogState.entries;
    }



    setStyleIfHTMLElement(el, styleProps) {
        if (el instanceof HTMLElement && el.style) {
            Object.assign(el.style, styleProps);
        }
    }

    /**
     * Fire a custom WB event
     * @param {string} name - Event name (e.g., 'wb-button:click')
     * @param {object} detail - Event detail
     * @param {object} options - Event options
     */
    fireEvent(name, detail = {}, options = {}) {
        dispatchWBEvent(this, name, detail, options.bubbles ?? true, options.composed ?? true);
    }

    /**
     * Log info message
     * @param {string} msg - Message to log
     * @param {object} ctx - Optional context
     */
    logInfo(msg, ctx) {
        WBBaseComponent.logEvent(msg, 'info');
        if (typeof window !== 'undefined' && window.WBEventLog && typeof window.WBEventLog.logInfo === 'function') {
            window.WBEventLog.logInfo(msg, ctx);
        } else {
            console.info('[WB]', msg, ctx);
        }
    }
    
    /**
     * Log error message
     * @param {string} msg - Message to log
     * @param {object} ctx - Optional context
     */
    logError(msg, ctx) {
        WBBaseComponent.logEvent(msg, 'error');
        if (typeof window !== 'undefined' && window.WBEventLog && typeof window.WBEventLog.logError === 'function') {
            window.WBEventLog.logError(msg, ctx);
        } else {
            console.error('[WB]', msg, ctx);
        }
    }
    
    /**
     * Log debug message
     * @param {string} msg - Message to log
     * @param {object} ctx - Optional context
     */
    logDebug(msg, ctx) {
        WBBaseComponent.logEvent(msg, 'debug');
        if (typeof window !== 'undefined' && window.WBEventLog && typeof window.WBEventLog.logDebug === 'function') {
            window.WBEventLog.logDebug(msg, ctx);
        } else {
            console.debug('[WB]', msg, ctx);
        }
    }
    
    /**
     * Report an error
     * @param {Error} error - Error object
     * @param {object} context - Error context
     */
    reportError(error, context) {
        this.logError(error?.message || error, context);
        this.fireEvent('wb:error', { error, context });
    }

    // Attribute/property reflection helpers
    static get observedAttributes() { return defineObservedAttributes([]); }
    
    attributeChangedCallback(name, oldValue, newValue) {
        // Override in subclass if needed
    }

    /**
     * Called when component is inserted into DOM
     */
    connectedCallback() {
        // Set global mode to dark for all WB components
        document.documentElement.setAttribute('data-mode', 'dark');
        document.body.setAttribute('data-mode', 'dark');

        // Theme event listener
        document.addEventListener('wb:theme-changed', this._themeChangeHandler);
    }
    
    /**
     * Called when component is removed from DOM
     */
    disconnectedCallback() {
        document.removeEventListener('wb:theme-changed', this._themeChangeHandler);
    }

    /**
     * Set attribute and reflect to property
     * @param {string} name - Attribute name
     * @param {*} value - Value to set
     */
    setAttr(name, value) {
        reflectAttribute(this, name, value);
    }
    
    /**
     * Get attribute value with default
     * @param {string} name - Attribute name
     * @param {*} defaultValue - Default value if not set
     * @returns {*} Attribute value or default
     */
    getAttr(name, defaultValue = null) {
        return getAttributeOrDefault(this, name, defaultValue);
    }



    /**
     * Render markdown documentation
     * @static
     * @param {string} mdUrl - URL to markdown file
     * @param {string|HTMLElement} target - Target element selector or element
     */
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
                    return;
                }
            }
            if (el instanceof HTMLElement) {
                el.innerHTML = '<p>Error loading documentation: ' + error.message + '</p>';
            }
        }
    }

    /**
     * Handle theme change event
     * @private
     * @param {Event} event - Theme change event
     */
    _onThemeChange(event) {
        const theme = event?.detail?.theme || document.documentElement.getAttribute('data-theme') || 'light';
        this.setAttribute('theme', theme);
        this.logDebug('Theme updated', { theme });
    }
    
    /**
     * Get current theme
     * @returns {string} Current theme name
     */
    getCurrentTheme() {
        return this.getAttribute('theme') || document.documentElement.getAttribute('data-theme') || 'light';
    }

    /**
     * Get schema URL for this component
     * @static
     * @returns {string|null} Schema URL or null
     */
    static get schemaUrl() { return null; }
    
    /**
     * Load schema configuration
     * @async
     * @returns {object|null} Parsed schema or null
     */
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

    /**
     * Register a custom element
     * @static
     * @param {string} tagName - Tag name for the element
     */
    static register(tagName) {
        if (!customElements.get(tagName)) {
            customElements.define(tagName, this);
        }
    }

    /**
     * Get component name
     * @static
     * @returns {string} Component class name
     */
    static get componentName() { return this.name; }
    
    /**
     * Get component version
     * @static
     * @returns {string} Version string
     */
    static get version() { return '2.0.0'; }
}

// Make WBBaseComponent available globally
if (typeof window !== 'undefined') {
    window['WBBaseComponent'] = WBBaseComponent;

    // Compositional Namespace
    if (!window['WB']) window['WB'] = { components: {}, utils: {} };
    window['WB'].components.WBBaseComponent = WBBaseComponent;
}

// ES6 Module Exports
export { WBBaseComponent };
export default WBBaseComponent;
