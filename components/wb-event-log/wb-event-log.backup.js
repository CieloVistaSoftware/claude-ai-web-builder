/**
 * WB Event Log Component
 * Passive event-driven logging system for Website Builder
 * Automatically captures and displays application events
 * 
 * @version 2.0.0 (Simplified & Fixed)
 * @author Website Builder Components
 */

// Use WBBaseComponent from global or import
const WBBaseComponent = window.WBBaseComponent || HTMLElement;

class WBEventLog extends WBBaseComponent {
    // Render in light DOM, not shadow
    static useShadow = false;
    constructor() {
        super();
        // Initialize properties
        this.events = [];
        this.maxEvents = 1000;
        this.autoScroll = true;
        this.isPaused = false;
        this.filters = { error: true, warning: true, info: true, success: true, debug: true, user: true };
        this.searchFilter = '';
        this._processingEvent = false;
        // Store original console methods
        this.originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info,
            debug: console.debug
        };
    }
    
    connectedCallback() {
        super.connectedCallback(); // Inherit dark mode and other base functionality
        // Initialize when element is added to DOM
        console.log('✅ WB Event Log: Component connected');
        this.init();
    }
    
    async init() {
        console.log('⚙️ init() called - Initializing component...');
        // Setup component
        this.className = 'wb-event-log';
        
        // Load CSS if not already loaded
        if (!document.querySelector('link[href*="wb-event-log.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'wb-event-log.css';
            document.head.appendChild(link);
            console.log('📄 CSS loaded');
        }
        
        // Create DOM structure
        console.log('🎨 Calling render()...');
        this.render();
        
        // Setup event listeners
        console.log('🎧 Calling setupEventListeners()...');
        this.setupEventListeners();
        
        console.log('✅ WB Event Log: Ready to capture events');
    }
    
    render() {
        this.innerHTML = '';
        
        // Create main container
        const container = document.createElement('div');
        container.className = 'wb-event-log-container';
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        
        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'wb-event-log-toolbar';
        toolbar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;
            background: #2a2a2a;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            gap: 8px;
            flex-shrink: 0;
        `;
        
        // Left side - title and count
        const leftSection = document.createElement('div');
        leftSection.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        leftSection.innerHTML = `
            <span style="color: #888; font-size: 0.9em; font-weight: bold;">Event Log</span>
            <span class="event-count" style="color: #6366f1; font-size: 0.85em;">(0)</span>
        `;
        
        // Right side - buttons
        const rightSection = document.createElement('div');
        rightSection.style.cssText = 'display: flex; gap: 6px;';
        
        // Copy All button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'wb-event-log-btn';
        copyBtn.innerHTML = '📋 Copy All';
        copyBtn.title = 'Copy all events to clipboard';
        copyBtn.style.cssText = `
            padding: 4px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85em;
            transition: background 0.2s;
        `;
        copyBtn.addEventListener('mouseenter', () => copyBtn.style.background = '#45a049');
        copyBtn.addEventListener('mouseleave', () => copyBtn.style.background = '#4CAF50');
        copyBtn.addEventListener('click', () => this.copyAllEvents());
        
        // Clear button
        const clearBtn = document.createElement('button');
        clearBtn.className = 'wb-event-log-btn';
        clearBtn.innerHTML = '🗑️ Clear';
        clearBtn.title = 'Clear all events';
        clearBtn.style.cssText = `
            padding: 4px 10px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85em;
            transition: background 0.2s;
        `;
        clearBtn.addEventListener('mouseenter', () => clearBtn.style.background = '#da190b');
        clearBtn.addEventListener('mouseleave', () => clearBtn.style.background = '#f44336');
        clearBtn.addEventListener('click', () => this.clearEvents());
        
        // Pause/Resume button
        const pauseBtn = document.createElement('button');
        pauseBtn.className = 'wb-event-log-btn wb-event-log-pause';
        pauseBtn.innerHTML = this.isPaused ? '▶️ Resume' : '⏸️ Pause';
        pauseBtn.title = 'Pause/Resume event logging';
        pauseBtn.style.cssText = `
            padding: 4px 10px;
            background: #ff9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85em;
            transition: background 0.2s;
        `;
        pauseBtn.addEventListener('mouseenter', () => pauseBtn.style.background = '#fb8c00');
        pauseBtn.addEventListener('mouseleave', () => pauseBtn.style.background = '#ff9800');
        pauseBtn.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            pauseBtn.innerHTML = this.isPaused ? '▶️ Resume' : '⏸️ Pause';
        });
        
        rightSection.appendChild(copyBtn);
        rightSection.appendChild(clearBtn);
        rightSection.appendChild(pauseBtn);
        
        toolbar.appendChild(leftSection);
        toolbar.appendChild(rightSection);
        
        // Create event list wrapper
        const listWrapper = document.createElement('div');
        listWrapper.className = 'wb-event-log-list';
        listWrapper.style.flex = '1';
        listWrapper.style.overflowY = 'auto';
        listWrapper.style.padding = '0';
        listWrapper.style.backgroundColor = '#1a1a1a';
        listWrapper.style.borderRadius = '0px';
        
        // Add placeholder message
        const placeholder = document.createElement('div');
        placeholder.style.color = '#888';
        placeholder.style.padding = '20px';
        placeholder.style.textAlign = 'center';
        placeholder.textContent = 'Waiting for events...';
        listWrapper.appendChild(placeholder);
        
        container.appendChild(toolbar);
        container.appendChild(listWrapper);
        this.appendChild(container);
    }
    
    setupEventListeners() {
        console.log('🎧 Setting up event listeners...');
        
        // Listen for custom WB events
        document.addEventListener('wb:info', (e) => {
            console.log('📢 wb:info event received!');
            this.handleEvent('info', e);
        });
        document.addEventListener('wb:warning', (e) => {
            console.log('📢 wb:warning event received!');
            this.handleEvent('warning', e);
        });
        document.addEventListener('wb:error', (e) => {
            console.log('📢 wb:error event received!');
            this.handleEvent('error', e);
        });
        document.addEventListener('wb:success', (e) => {
            console.log('📢 wb:success event received!');
            this.handleEvent('success', e);
        });
        document.addEventListener('wb:debug', (e) => {
            console.log('📢 wb:debug event received!');
            this.handleEvent('debug', e);
        });
        document.addEventListener('wb:user', (e) => {
            console.log('📢 wb:user event received!');
            this.handleEvent('user', e);
        });
        
        // Capture console logs
        this.captureConsole();
        
        console.log('✅ WB Event Log: Event listeners configured');
    }
    
    handleEvent(type, event) {
        console.log('🔔 handleEvent called:', type, event.detail);
        if (this.isPaused) return;
        
        const detail = event.detail || {};
        const message = detail.message || 'Event occurred';
        
        console.log('📤 Passing to addEvent:', type, message);
        this.addEvent(type, message, detail);
    }
    
    captureConsole() {
        const self = this;
        const originalLog = this.originalConsole.log;
        const originalWarn = this.originalConsole.warn;
        const originalError = this.originalConsole.error;
        
        // Override console.log
        console.log = function(...args) {
            originalLog.apply(console, args);
            if (!self.isPaused && !self._processingEvent) {
                const message = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
                if (!message.includes('wb-event-log') && !message.includes('✅')) {
                    self.addEvent('info', message, { source: 'console' });
                }
            }
        };
        
        // Override console.warn
        console.warn = function(...args) {
            originalWarn.apply(console, args);
            if (!self.isPaused && !self._processingEvent) {
                const message = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
                if (!message.includes('wb-event-log')) {
                    self.addEvent('warning', message, { source: 'console' });
                }
            }
        };
        
        // Override console.error
        console.error = function(...args) {
            originalError.apply(console, args);
            if (!self.isPaused && !self._processingEvent) {
                const message = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
                if (!message.includes('wb-event-log') && !message.includes('Maximum call stack')) {
                    self.addEvent('error', message, { source: 'console' });
                }
            }
        };
    }
    
    addEvent(type, message, details = {}) {
        //console.log('📥 addEvent called:', type, message);
        // Prevent recursion
        if (this._processingEvent) return;
        this._processingEvent = true;
        
        try {
            // Prevent self-referential events
            if (details.source === 'wb-event-log' || message.includes('wb-event-log')) {
                return;
            }
            
            // Create event object
            const event = {
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                type: type,
                message: message,
                timestamp: Date.now(),
                details: details
            };
            
          //  console.log('📝 Event object created:', event);
            
            // Add to events array (newest first)
            this.events.unshift(event);
            // console.log('📊 Events array length:', this.events.length);
            
            // Limit stored events
            if (this.events.length > this.maxEvents) {
                this.events.pop();
            }
            
            // Render the event
            //console.log('🎨 Calling renderNewEvent...');
            this.renderNewEvent(event);
            
            // Dispatch custom event for external listeners
            this.dispatchEvent(new CustomEvent('wb-event-logged', {
                detail: event,
                bubbles: true
            }));
            
        } finally {
            this._processingEvent = false;
        }
    }
    
    renderNewEvent(event) {
        const listWrapper = this.querySelector('.wb-event-log-list');
        console.log('🎯 Rendering event:', event.type, event.message, 'List found:', !!listWrapper);
        if (!listWrapper) {
            console.error('❌ No list wrapper found!');
            return;
        }
        
        // Remove placeholder if this is the first event
        const placeholder = listWrapper.querySelector('div:only-child');
        if (placeholder && placeholder.textContent === 'Waiting for events...') {
            console.log('🗑️ Removing placeholder');
            placeholder.remove();
        }
        
        // Create event element
        const eventEl = document.createElement('div');
        eventEl.className = `wb-event-row wb-event-${event.type}`;
        eventEl.style.cssText = `
            padding: 8px 10px;
            margin-bottom: 0;
            border-left: 4px solid ${this.getTypeColor(event.type)};
            background-color: rgba(255, 255, 255, 0.03);
            border-radius: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 0.9em;
            line-height: 1.4;
            color: #e0e0e0;
            word-break: break-word;
            font-family: 'Courier New', monospace;
        `;
        
        // Format time
        const time = new Date(event.timestamp).toLocaleTimeString();
        
        // Create content
        eventEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="font-weight: bold; color: ${this.getTypeColor(event.type)}; text-transform: uppercase;">
                    ${event.type}
                </span>
                <span style="color: #888; font-size: 0.85em;">
                    ${time}
                </span>
            </div>
            <div style="color: #e0e0e0;">
                ${this.escapeHtml(event.message)}
            </div>
        `;
        
        // Add to top of list
        console.log('📌 Appending event to DOM, list has', listWrapper.children.length, 'children');
        listWrapper.insertBefore(eventEl, listWrapper.firstChild);
        console.log('✅ Event appended, list now has', listWrapper.children.length, 'children');
        
        // Update count in toolbar
        this.updateEventCount();
        
        // Scroll to top if auto-scroll enabled
        if (this.autoScroll) {
            listWrapper.scrollTop = 0;
        }
    }
    
    getTypeColor(type) {
        const colors = {
            'error': '#f44336',
            'warning': '#ff9800',
            'info': '#2196F3',
            'success': '#4CAF50',
            'debug': '#9C27B0',
            'user': '#607D8B'
        };
        return colors[type] || '#fff';
    }
    
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    updateEventCount() {
        const countEl = this.querySelector('.event-count');
        if (countEl) {
            countEl.textContent = `(${this.events.length})`;
        }
    }
    
    copyAllEvents() {
        if (this.events.length === 0) {
            this.showNotification('No events to copy', 'warning');
            return;
        }
        
        // Format events as readable text
        const text = this.events.map(event => {
            const time = new Date(event.timestamp).toLocaleString();
            return `[${time}] ${event.type.toUpperCase()}: ${event.message}`;
        }).join('\n');
        
        // Copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('✅ Copied ' + this.events.length + ' events to clipboard', 'success');
        }).catch(err => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                this.showNotification('✅ Copied ' + this.events.length + ' events to clipboard', 'success');
            } catch (e) {
                this.showNotification('❌ Failed to copy events', 'error');
            }
            document.body.removeChild(textarea);
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#f44336'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-size: 0.9em;
            animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        if (!document.getElementById('wb-event-log-notification-style')) {
            style.id = 'wb-event-log-notification-style';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
    
    clearEvents() {
        this.events = [];
        this.render();
        console.log('✅ WB Event Log: Cleared all events');
    }
    
    getEvents() {
        return this.events;
    }
    
    setAutoScroll(enabled) {
        this.autoScroll = enabled;
    }
    
    setPaused(paused) {
        this.isPaused = paused;
    }
}

// Register the custom element
if (!customElements.get('wb-event-log')) {
    customElements.define('wb-event-log', WBEventLog);
    console.log('✅ WB Event Log: Component registered globally');
}

// Ensure it's globally available
if (typeof window !== 'undefined') {
    window.WBEventLog = WBEventLog;
}
