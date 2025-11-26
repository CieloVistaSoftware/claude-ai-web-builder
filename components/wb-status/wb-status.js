import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBStatus extends WBBaseComponent {
    static useShadow = false;
    
    constructor() {
        super();
        this.config = null;
        this._initialized = false;
        this.eventQueue = [];
        this.isProcessingQueue = false;
        this.shownEvents = new Set();
        this.lastColorEvent = null;
        this.colorEventTimeout = null;
        this.settings = new Map();
        this._eventsContainer = null;
        this._settingsContainer = null;
        this._cleanupInterval = null;
    }
    
    static get observedAttributes() {
        return ['position', 'max-events', 'event-duration', 'fade-delay', 'height'];
    }
    
    async connectedCallback() {
        super.connectedCallback();
        
        if (this._initialized) return;
        this._initialized = true;
        
        this.logInfo('WBStatus connecting');
        
        try {
            await loadComponentCSS(this, 'wb-status.css');
            await this.loadConfig();
            this.render();
            this.setupGlobalAPI();
            this.init();
            
            this.fireEvent('wb-status:ready', { component: 'wb-status' });
            this.logInfo('WBStatus ready');
        } catch (error) {
            this.logError('WBStatus initialization failed', { error: error.message });
        }
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        
        if (this._cleanupInterval) {
            clearInterval(this._cleanupInterval);
        }
        if (this.colorEventTimeout) {
            clearTimeout(this.colorEventTimeout);
        }
        
        this.logDebug('WBStatus disconnected');
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (!this._initialized || oldValue === newValue) return;
        
        switch (name) {
            case 'position':
                this.updatePosition();
                break;
            case 'max-events':
            case 'event-duration':
            case 'fade-delay':
            case 'height':
                this.updateOptions();
                break;
        }
    }
    
    async loadConfig() {
        const fallbackConfig = {
            classes: {
                base: 'wb-status',
                container: 'wb-status-bar',
                left: 'wb-status-left',
                right: 'wb-status-right',
                events: 'wb-status-events',
                event: 'wb-status-event',
                settings: 'wb-status-settings',
                setting: 'wb-status-setting'
            },
            defaults: { 
                height: '1rem', 
                maxEvents: 1, 
                eventDuration: 4000, 
                fadeDelay: 2000,
                queueDelay: 100,
                showDuplicates: false
            },
            events: { ready: 'wbStatusReady', eventAdded: 'wbStatusEventAdded' }
        };
        
        if (window.WBComponentUtils) {
            const configPath = window.WBComponentUtils.getPath('wb-status.js', '../components/wb-status/') + 'wb-status.schema.json';
            this.config = await window.WBComponentUtils.loadConfig(configPath, fallbackConfig, 'WB Status');
        } else {
            this.config = fallbackConfig;
        }
        return this.config;
    }
    
    loadCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('wb-status.js', '../components/wb-status/') + 'wb-status.css';
            window.WBComponentUtils.loadCSS('wb-status', cssPath);
        } else {
            const existingStyles = document.querySelector('link[href*="wb-status.css"]');
            if (document.getElementById('wb-status-styles') || existingStyles) {
                return;
            }
            
            const link = document.createElement('link');
            link.id = 'wb-status-styles';
            link.rel = 'stylesheet';
            link.href = './wb-status.css';  // Fixed path - same directory as wb-status.js
            document.head.appendChild(link);
        }
    }
    
    render() {
        this.logDebug('WBStatus rendering');
        
        // Safety check for config
        if (!this.config || !this.config.classes || !this.config.events) {
            // Full fallback config (must match loadConfig)
            this.config = {
                classes: {
                    base: 'wb-status',
                    container: 'wb-status-bar',
                    left: 'wb-status-left',
                    right: 'wb-status-right',
                    events: 'wb-status-events',
                    event: 'wb-status-event',
                    settings: 'wb-status-settings',
                    setting: 'wb-status-setting'
                },
                defaults: {
                    height: '1rem',
                    maxEvents: 1,
                    eventDuration: 4000,
                    fadeDelay: 2000,
                    queueDelay: 100,
                    showDuplicates: false
                },
                events: { ready: 'wbStatusReady', eventAdded: 'wbStatusEventAdded' }
            };
        }
        
        this.className = this.config.classes.container;
        this.setAttribute('role', 'status');
        this.setAttribute('aria-live', 'polite');
        this.setAttribute('aria-label', 'Status bar');
        
        // Apply position class
        const position = this.getAttribute('position');
        if (position) {
            this.classList.add(`wb-status--${position}`);
        }
        
        // Clear existing content
        this.innerHTML = '';
        
        // Create structure
        const leftSection = document.createElement('div');
        leftSection.className = this.config.classes.left;
        leftSection.innerHTML = `
            <div class="wb-status-title">Events</div>
            <div class="${this.config.classes.events}"></div>
        `;
        
        const divider = document.createElement('div');
        divider.className = 'wb-status-divider';
        
        const rightSection = document.createElement('div');
        rightSection.className = this.config.classes.right;
        rightSection.innerHTML = `
            <div class="wb-status-title">Settings</div>
            <div class="${this.config.classes.settings}"></div>
        `;
        
        this.appendChild(leftSection);
        this.appendChild(divider);
        this.appendChild(rightSection);
        
        // Store references
        const classes = this.config?.classes || { events: 'wb-status-events', settings: 'wb-status-settings' };
        this._eventsContainer = this.querySelector(`.${classes.events}`);
        this._settingsContainer = this.querySelector(`.${classes.settings}`);
    }
    
    getOptions() {
        const defaults = this.config?.defaults || {
            height: '60px',
            maxEvents: 5,
            eventDuration: 5000,
            fadeDelay: 4000,
            queueDelay: 300,
            showDuplicates: false
        };
        
        return {
            height: this.getAttribute('height') || defaults.height,
            maxEvents: parseInt(this.getAttribute('max-events')) || defaults.maxEvents,
            eventDuration: parseInt(this.getAttribute('event-duration')) || defaults.eventDuration,
            fadeDelay: parseInt(this.getAttribute('fade-delay')) || defaults.fadeDelay,
            queueDelay: defaults.queueDelay,
            showDuplicates: defaults.showDuplicates
        };
    }
    
    updatePosition() {
        // Remove existing position classes
        this.classList.remove('wb-status--top', 'wb-status--bottom', 'wb-status--fixed');
        
        const position = this.getAttribute('position');
        if (position) {
            this.classList.add(`wb-status--${position}`);
        }
    }
    
    updateOptions() {
        // Options are read dynamically from attributes, no action needed
    }
    
    // Add event to queue
    addEvent(message, type = 'info', options = {}) {
        const opts = this.getOptions();
        
        // Create unique key for this event
        const eventKey = `${message}:${type}`;
        
        if (!opts.showDuplicates && this.shownEvents.has(eventKey)) {
            return;
        }
        
        // Check if this event is already in the queue
        const alreadyQueued = this.eventQueue.some(event => event.eventKey === eventKey);
        if (alreadyQueued) {
            return;
        }
        
        // Add to queue
        this.eventQueue.push({ 
            message, 
            type, 
            eventKey,
            duration: options.duration || opts.eventDuration,
            priority: options.priority || 0
        });
        
        this.logDebug('WBStatus event queued', { message, queueLength: this.eventQueue.length });
        
        this.fireEvent('wb-status:event-added', { message, type });
        
        // Start processing queue if not already running
        if (!this.isProcessingQueue) {
            this.processEventQueue();
        }
    }
    
    // Process events from queue one at a time
    processEventQueue() {
        if (this.eventQueue.length === 0) {
            this.isProcessingQueue = false;
            return;
        }
        
        this.isProcessingQueue = true;
        const opts = this.getOptions();
        
        // Sort by priority (higher priority first)
        this.eventQueue.sort((a, b) => b.priority - a.priority);
        const eventData = this.eventQueue.shift();
        
        // Show the event immediately
        this.showEventNow(eventData.message, eventData.type, eventData.eventKey, eventData.duration);
        
        // Schedule next event after delay
        setTimeout(() => {
            this.processEventQueue();
        }, opts.queueDelay);
    }
    
    // Actually display the event
    showEventNow(message, type, eventKey, duration) {
        if (!this._eventsContainer) return;
        
        const opts = this.getOptions();
        
        // Mark this event as shown
        this.shownEvents.add(eventKey);
        
        // Don't clear existing events immediately - let them fade naturally
        // Only clear if we have too many events
        const existingEvents = this._eventsContainer.querySelectorAll(`.${this.config.classes.event}`);
        if (existingEvents.length >= opts.maxEvents) {
            existingEvents.forEach(event => {
                if (!event.classList.contains('wb-status--fadeout')) {
                    event.classList.add('wb-status--fadeout');
                    setTimeout(() => {
                        if (event.parentNode) event.remove();
                    }, 500);
                }
            });
        }
        
        // Create new event element
        const eventElement = document.createElement('div');
        eventElement.className = `${this.config.classes.event} wb-status-event--${type}`;
        eventElement.textContent = message;
        eventElement.setAttribute('data-event-key', eventKey);
        
        // Add new event immediately (no delay)
        this._eventsContainer.appendChild(eventElement);
        this.logDebug('WBStatus event displayed', { message });
        
        this.fireEvent('wb-status:event-shown', { message, type });
        
        // Auto-remove after duration + fade delay
        setTimeout(() => {
            if (eventElement.parentNode) {
                eventElement.classList.add('wb-status--fadeout');
                setTimeout(() => {
                    if (eventElement.parentNode) {
                        eventElement.remove();
                        
                        this.fireEvent('wb-status:event-hidden', { message, type });
                    }
                }, 500); // CSS fadeout animation duration
            }
        }, duration + opts.fadeDelay);
    }
    
    // Update setting display
    updateSetting(key, value, isError = false) {
        if (!this._settingsContainer) return;
        
        this.settings.set(key, { value, isError });
        
        // Find or create setting element
        let settingElement = this._settingsContainer.querySelector(`[data-setting-key="${key}"]`);
        
        if (!settingElement) {
            settingElement = document.createElement('div');
            settingElement.className = this.config.classes.setting;
            settingElement.setAttribute('data-setting-key', key);
            
            const label = document.createElement('span');
            label.className = 'wb-status-setting-label';
            label.textContent = `${key}:`;
            
            const valueEl = document.createElement('span');
            valueEl.className = 'wb-status-setting-value';
            
            settingElement.appendChild(label);
            settingElement.appendChild(valueEl);
            this._settingsContainer.appendChild(settingElement);
        }
        
        // Update value
        const valueEl = settingElement.querySelector('.wb-status-setting-value');
        if (valueEl) {
            valueEl.textContent = value;
            valueEl.classList.remove('wb-status-setting-value--error');
            if (isError) {
                valueEl.classList.add('wb-status-setting-value--error');
            }
        }
        
        this.fireEvent('wb-status:setting-updated', { key, value, isError });
    }
    
    // Handle color events with smart debouncing
    handleColorEvent(message, type) {
        this.logDebug('WBStatus color event received', { message });
        
        // Determine event priority (hue changes are primary)
        const isHueEvent = message.toLowerCase().includes('hue');
        const isPrimaryColorEvent = message.toLowerCase().includes('color changed to:');
        const isSecondaryEvent = message.toLowerCase().includes('saturation') || 
                               message.toLowerCase().includes('lightness');
        
        // Clear any pending timeout
        if (this.colorEventTimeout) {
            clearTimeout(this.colorEventTimeout);
        }
        
        // If this is a primary event (hue or main color change), show it
        if (isHueEvent || isPrimaryColorEvent) {
            this.lastColorEvent = { message, type, timestamp: Date.now() };
            this.addEvent(message, type);
            
            // Set timeout to allow secondary events to be grouped
            this.colorEventTimeout = setTimeout(() => {
                this.lastColorEvent = null;
                this.colorEventTimeout = null;
            }, 500); // 500ms window for grouping
            
        } else if (isSecondaryEvent) {
            // If we just had a primary color event, ignore secondary events
            if (this.lastColorEvent && (Date.now() - this.lastColorEvent.timestamp < 500)) {
                this.logDebug('WBStatus secondary color event grouped');
                return;
            }
            
            // If no recent primary event, show the secondary event
            this.addEvent(message, type);
        } else {
            // Other color events (palette changes, etc.)
            this.addEvent(message, type);
        }
    }
    
    // Clear old shown events periodically
    clearOldEvents() {
        if (this.shownEvents.size > 10) {
            const eventsArray = Array.from(this.shownEvents);
            this.shownEvents.clear();
            // Keep only the last 5 events
            eventsArray.slice(-5).forEach(event => this.shownEvents.add(event));
            this.logDebug('WBStatus cleared old events');
        }
    }
    
    // Show/hide status bar
    show() {
        this.classList.remove('wb-status--hidden');
    }
    
    hide() {
        this.classList.add('wb-status--hidden');
    }
    
    // Clear all events
    clearEvents() {
        this.eventQueue = [];
        this.shownEvents.clear();
        this.isProcessingQueue = false;
        
        if (this._eventsContainer) {
            this._eventsContainer.innerHTML = '';
        }
    }
    
    // Initialize with default settings
    init() {
        this.addEvent('Status bar initialized', 'success');
        
        // Set up periodic cleanup of old events (every 30 seconds)
        this._cleanupInterval = setInterval(() => {
            this.clearOldEvents();
        }, 30000);
    }
    
    setupGlobalAPI() {
        // Set this as the current status bar
        window._currentWBStatus = this;
        
        // Set up the _wbStatusManager property for compatibility
        this._wbStatusManager = this;
        
        this.logDebug('WBStatus global API set up');
    }
}

// Register the Web Component
customElements.define('wb-status', WBStatus);

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-status', WBStatus, ['wb-event-log'], {
        version: '1.0.0',
        type: 'display',
        role: 'ui-element',
        description: 'Status indicator component with various states and styling options',
        api: {
            static: ['getConfig', 'setConfig', 'create'],
            events: ['status-changed'],
            attributes: ['status', 'variant', 'size', 'animated'],
            methods: ['setStatus', 'getStatus', 'render']
        },
        priority: 4 // UI component depends on infrastructure
    });
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBStatus = WBStatus;

// Expose globally (backward compatibility)
window.WBStatus = WBStatus;

// ES6 Module Exports
export { WBStatus };
export default WBStatus;