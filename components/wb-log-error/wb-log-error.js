import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

/**
 * WB Log Error Web Component - Reactive Version
 * @version 3.0.0
 */

class WBLogError extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
    }

    async connectedCallback() {
        super.connectedCallback();
        
        this.logInfo('WBLogError connecting');
        
        await loadComponentCSS(this, 'wb-log-error.css');
        
        // Create reactive state
        this._state = new Proxy({
            errors: [],
            filteredErrors: [],
            isVisible: false,
            showLocalLog: true,
            position: 'bottom-right',
            isDragging: false,
            dragOffset: { x: 0, y: 0 },
            filters: {
                level: 'all',
                source: 'all',
                search: ''
            },
            sources: new Set(),
            maxEntries: 100
        }, {
            set: (target, prop, value) => {
                const oldValue = target[prop];
                target[prop] = value;
                
                // Handle state changes reactively
                if (prop === 'errors' || prop.startsWith('filters')) {
                    this._applyFilters();
                } else if (prop === 'filteredErrors') {
                    this._render();
                } else if (prop === 'isVisible') {
                    this._updateVisibility();
                } else if (prop === 'position') {
                    this._updatePosition();
                }
                
                return true;
            }
        });
        
        // Bind methods
        this._handleError = this._handleError.bind(this);
        this._handleUnhandledRejection = this._handleUnhandledRejection.bind(this);
        this._handleConsoleError = this._handleConsoleError.bind(this);
        this._handleConsoleWarn = this._handleConsoleWarn.bind(this);
        this._handleWbEvent = this._handleWbEvent.bind(this);
        
        // Store original console methods
        this._originalConsoleError = console.error;
        this._originalConsoleWarn = console.warn;
        
        this._setupShadowDOM();
        
        // Set initial attributes
        const position = this.getAttribute('position') || 'bottom-right';
        const visible = this.getAttribute('visible') === 'true';
        const maxEntries = parseInt(this.getAttribute('max-entries') || '100');
        
        this._state.position = position;
        this._state.isVisible = visible;
        this._state.maxEntries = maxEntries;
        
        this._setupErrorCapture();
        this._loadFromStorage();
        this._render();
        
        this.fireEvent('wb-log-error:ready', { component: 'wb-log-error' });
        this.logInfo('WBLogError ready');
    }
    
    static get observedAttributes() {
        return ['position', 'visible', 'enable-export', 'enable-clear', 'enable-toggle', 'max-entries'];
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up event listeners
        window.removeEventListener('error', this._handleError, true);
        window.removeEventListener('unhandledrejection', this._handleUnhandledRejection, true);
        
        // Restore console methods
        console.error = this._originalConsoleError;
        console.warn = this._originalConsoleWarn;
        
        this.logDebug('WBLogError disconnected');
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (oldValue === newValue || !this._state) return;
        switch (name) {
            case 'position':
                if (newValue) this._state.position = newValue;
                break;
            case 'visible':
                this._state.isVisible = newValue === 'true';
                break;
            case 'max-entries':
                const max = parseInt(newValue);
                if (!isNaN(max) && max > 0) {
                    this._state.maxEntries = max;
                    if (this._state.errors.length > max) {
                        this._state.errors = this._state.errors.slice(0, max);
                    }
                }
                break;
        }
    }
    
    _setupShadowDOM() {
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                position: fixed;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                color: var(--text-primary, #1e293b);
                --error-color: #ef4444;
                --warning-color: #f59e0b;
                --info-color: #3b82f6;
                --debug-color: #8b5cf6;
            }
            
            :host([hidden]) {
                display: none !important;
            }
            
            .container {
                background: var(--bg-secondary, #ffffff);
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                width: 400px;
                max-width: 90vw;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
            }
            
            .container.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .container.dragging {
                transition: none;
                cursor: move;
            }
            
            /* Position classes */
            :host(.top-left) { top: 20px; left: 20px; }
            :host(.top-right) { top: 20px; right: 20px; }
            :host(.bottom-left) { bottom: 20px; left: 20px; }
            :host(.bottom-right) { bottom: 20px; right: 20px; }
            :host(.center) { top: 50%; left: 50%; transform: translate(-50%, -50%); }
            
            .header {
                display: flex;
                align-items: center;
                padding: 12px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                background: var(--bg-primary, #f9fafb);
                border-radius: 8px 8px 0 0;
                cursor: move;
                user-select: none;
            }
            
            .title {
                font-size: 1.1em;
                font-weight: 600;
                color: var(--primary, #007acc);
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1;
            }
            
            .counter {
                background: var(--error-color);
                color: white;
                font-size: 0.75em;
                padding: 2px 6px;
                border-radius: 10px;
                min-width: 20px;
                text-align: center;
            }
            
            .controls {
                display: flex;
                gap: 4px;
            }
            
            .controls button {
                background: transparent;
                border: none;
                padding: 4px;
                cursor: pointer;
                color: var(--text-secondary, #6b7280);
                border-radius: 4px;
                transition: background-color 0.2s, color 0.2s;
            }
            
            .controls button:hover {
                background: var(--bg-secondary, #e5e7eb);
                color: var(--text-primary, #1e293b);
            }
            
            .filters {
                display: flex;
                gap: 8px;
                padding: 8px 12px;
                background: var(--bg-primary, #f9fafb);
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                flex-wrap: wrap;
                align-items: center;
            }
            
            .filters select,
            .filters input {
                background: var(--bg-secondary, #ffffff);
                color: var(--text-primary, #1e293b);
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 0.875em;
            }
            
            .filters input {
                flex: 1;
                min-width: 120px;
            }
            
            .body {
                flex: 1;
                overflow-y: auto;
                padding: 8px 0;
                max-height: 400px;
            }
            
            .entry {
                padding: 8px 12px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 0.875em;
            }
            
            .entry:last-child {
                border-bottom: none;
            }
            
            .entry-header {
                display: flex;
                align-items: baseline;
                gap: 8px;
                margin-bottom: 4px;
            }
            
            .entry-level {
                font-weight: 600;
                text-transform: uppercase;
                font-size: 0.75em;
                padding: 2px 6px;
                border-radius: 4px;
            }
            
            .entry.error .entry-level {
                background: var(--error-color);
                color: white;
            }
            
            .entry.warning .entry-level {
                background: var(--warning-color);
                color: white;
            }
            
            .entry.info .entry-level {
                background: var(--info-color);
                color: white;
            }
            
            .entry.debug .entry-level {
                background: var(--debug-color);
                color: white;
            }
            
            .entry-time {
                color: var(--text-secondary, #6b7280);
                font-size: 0.75em;
            }
            
            .entry-source {
                color: var(--text-secondary, #6b7280);
                font-size: 0.75em;
                margin-left: auto;
            }
            
            .entry-message {
                color: var(--text-primary, #1e293b);
                word-break: break-word;
            }
            
            .entry-stack {
                margin-top: 4px;
                padding: 4px;
                background: var(--bg-primary, #f9fafb);
                border-radius: 4px;
                font-size: 0.8em;
                color: var(--text-secondary, #6b7280);
                white-space: pre-wrap;
                max-height: 100px;
                overflow-y: auto;
            }
            
            .empty {
                text-align: center;
                padding: 40px 20px;
                color: var(--text-secondary, #6b7280);
            }
            
            /* Dark mode */
            @media (prefers-color-scheme: dark) {
                :host {
                    --bg-primary: #1f2937;
                    --bg-secondary: #111827;
                    --text-primary: #f3f4f6;
                    --text-secondary: #9ca3af;
                    --border-color: #374151;
                }
            }
        `;
        
        const container = document.createElement('div');
        container.className = 'container';
        container.id = 'container';
        
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
        
        // Update container reference
        this._container = container;
    }
    
    _setupErrorCapture() {
        // Capture JavaScript errors
        window.addEventListener('error', this._handleError, true);
        
        // Capture unhandled promise rejections
        window.addEventListener('unhandledrejection', this._handleUnhandledRejection, true);
        
        // Override console methods
        console.error = (...args) => {
            this._handleConsoleError(...args);
            this._originalConsoleError.apply(console, args);
        };
        
        console.warn = (...args) => {
            this._handleConsoleWarn(...args);
            this._originalConsoleWarn.apply(console, args);
        };
        
        // Listen for wb: events
        document.addEventListener('wb:error', this._handleWbEvent);
        document.addEventListener('wb:warning', this._handleWbEvent);
        document.addEventListener('wb:info', this._handleWbEvent);
        document.addEventListener('wb:debug', this._handleWbEvent);
    }
    
    _handleError(event) {
        const error = {
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            level: 'error',
            message: event.message || 'Unknown error',
            source: event.filename || 'unknown',
            line: event.lineno,
            column: event.colno,
            stack: event.error?.stack || '',
            type: 'javascript-error'
        };
        
        this._addError(error);
    }
    
    _handleUnhandledRejection(event) {
        const error = {
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            level: 'error',
            message: event.reason?.message || event.reason || 'Unhandled promise rejection',
            source: 'Promise',
            stack: event.reason?.stack || '',
            type: 'promise-rejection'
        };
        
        this._addError(error);
    }
    
    _handleConsoleError(...args) {
        const error = {
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            level: 'error',
            message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '),
            source: 'Console',
            type: 'console-error'
        };
        
        this._addError(error);
    }
    
    _handleConsoleWarn(...args) {
        const error = {
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            level: 'warning',
            message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '),
            source: 'Console',
            type: 'console-warning'
        };
        
        this._addError(error);
    }
    
    _handleWbEvent(event) {
        if (event.detail && event.detail.message) {
            const level = event.type.replace('wb:', '');
            const error = {
                id: this._generateId(),
                timestamp: new Date().toISOString(),
                level: level === 'warning' ? 'warning' : level,
                message: event.detail.message,
                source: event.detail.source || 'WB Event',
                type: `wb-${level}`
            };
            
            this._addError(error);
        }
    }
    
    _addError(error) {
        // Update sources
        const newSources = new Set(this._state.sources);
        newSources.add(error.source);
        
        // Add error
        const errors = [error, ...this._state.errors];
        if (errors.length > this._state.maxEntries) {
            errors.length = this._state.maxEntries;
        }
        
        // Update state (will trigger reactive updates)
        this._state.sources = newSources;
        this._state.errors = errors;
        
        // Save to storage
        this._saveToStorage();
        
        this.fireEvent('wb-log-error:new', { error });
    }
    
    _applyFilters() {
        const { errors, filters } = this._state;
        
        let filtered = errors;
        
        // Filter by level
        if (filters.level !== 'all') {
            filtered = filtered.filter(e => e.level === filters.level);
        }
        
        // Filter by source
        if (filters.source !== 'all') {
            filtered = filtered.filter(e => e.source === filters.source);
        }
        
        // Filter by search
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(e => 
                e.message.toLowerCase().includes(search) ||
                e.source.toLowerCase().includes(search)
            );
        }
        
        this._state.filteredErrors = filtered;
    }
    
    _render() {
        if (!this._container) return;
        
        const { filteredErrors, filters, sources } = this._state;
        
        // Create header
        const header = `
            <div class="header" data-action="drag">
                <div class="title">
                    <span>📋 Error Log</span>
                    <span class="counter">${this._state.errors.length}</span>
                </div>
                <div class="controls">
                    ${this.getAttribute('enable-clear') !== 'false' ? 
                        '<button data-action="clear" title="Clear All Errors">🗑️</button>' : ''}
                    <button data-action="copy" title="Copy to Clipboard">📋</button>
                    ${this.getAttribute('enable-export') !== 'false' ? 
                        '<button data-action="export" title="Export Error Log">⬇️</button>' : ''}
                    ${this.getAttribute('enable-toggle') !== 'false' ? 
                        '<button data-action="toggle" title="Toggle Error Log">👁️</button>' : ''}
                </div>
            </div>
        `;
        
        // Create filters
        const filterOptions = `
            <div class="filters">
                <select data-filter="level">
                    <option value="all" ${filters.level === 'all' ? 'selected' : ''}>All Levels</option>
                    <option value="error" ${filters.level === 'error' ? 'selected' : ''}>Error</option>
                    <option value="warning" ${filters.level === 'warning' ? 'selected' : ''}>Warning</option>
                    <option value="info" ${filters.level === 'info' ? 'selected' : ''}>Info</option>
                    <option value="debug" ${filters.level === 'debug' ? 'selected' : ''}>Debug</option>
                </select>
                <select data-filter="source">
                    <option value="all">All Sources</option>
                    ${Array.from(sources).map(source => 
                        `<option value="${source}" ${filters.source === source ? 'selected' : ''}>${source}</option>`
                    ).join('')}
                </select>
                <input type="text" data-filter="search" placeholder="Filter messages..." 
                       value="${filters.search || ''}">
                <button data-action="clear-filters" title="Clear Filters">✖</button>
            </div>
        `;
        
        // Create body
        let bodyContent = '';
        if (filteredErrors.length === 0) {
            bodyContent = '<div class="empty">No errors logged</div>';
        } else {
            bodyContent = filteredErrors.map(error => `
                <div class="entry ${error.level}">
                    <div class="entry-header">
                        <span class="entry-level">${error.level}</span>
                        <span class="entry-time">${new Date(error.timestamp).toLocaleTimeString()}</span>
                        <span class="entry-source">${error.source}</span>
                    </div>
                    <div class="entry-message">${this._escapeHtml(error.message)}</div>
                    ${error.stack ? `<div class="entry-stack">${this._escapeHtml(error.stack)}</div>` : ''}
                </div>
            `).join('');
        }
        
        const body = `<div class="body">${bodyContent}</div>`;
        
        // Update container
        this._container.innerHTML = header + filterOptions + body;
        
        // Setup event delegation
        this._setupEventDelegation();
    }
    
    _setupEventDelegation() {
        if (!this._container) return;
        
        // Remove existing listener
        if (this._delegationHandler) {
            this._container.removeEventListener('click', this._delegationHandler);
            this._container.removeEventListener('change', this._delegationHandler);
            this._container.removeEventListener('input', this._delegationHandler);
            this._container.removeEventListener('mousedown', this._delegationHandler);
        }
        
        // Create new handler
        this._delegationHandler = (event) => {
            const target = event.target;
            const action = target.getAttribute('data-action');
            const filter = target.getAttribute('data-filter');
            
            if (event.type === 'click' && action) {
                event.preventDefault();
                switch (action) {
                    case 'clear':
                        this.clearErrors();
                        break;
                    case 'copy':
                        this.copyToClipboard();
                        break;
                    case 'export':
                        this.exportErrors();
                        break;
                    case 'toggle':
                        this.toggleVisibility();
                        break;
                    case 'clear-filters':
                        this._state.filters = { level: 'all', source: 'all', search: '' };
                        break;
                }
            } else if ((event.type === 'change' || event.type === 'input') && filter) {
                const newFilters = { ...this._state.filters };
                newFilters[filter] = target.value;
                this._state.filters = newFilters;
            } else if (event.type === 'mousedown' && action === 'drag') {
                this._startDragging(event);
            }
        };
        
        this._container.addEventListener('click', this._delegationHandler);
        this._container.addEventListener('change', this._delegationHandler);
        this._container.addEventListener('input', this._delegationHandler);
        this._container.addEventListener('mousedown', this._delegationHandler);
    }
    
    _startDragging(event) {
        this._state.isDragging = true;
        this._state.dragOffset = {
            x: event.clientX - this.offsetLeft,
            y: event.clientY - this.offsetTop
        };
        
        this._container.classList.add('dragging');
        
        const handleMouseMove = (e) => {
            if (this._state.isDragging) {
                this.style.left = `${e.clientX - this._state.dragOffset.x}px`;
                this.style.top = `${e.clientY - this._state.dragOffset.y}px`;
                this.style.right = 'auto';
                this.style.bottom = 'auto';
            }
        };
        
        const handleMouseUp = () => {
            this._state.isDragging = false;
            this._container.classList.remove('dragging');
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    
    _updateVisibility() {
        if (this._container) {
            if (this._state.isVisible) {
                this._container.classList.add('visible');
                this.hidden = false;
            } else {
                this._container.classList.remove('visible');
                setTimeout(() => {
                    if (!this._state.isVisible) {
                        this.hidden = true;
                    }
                }, 300);
            }
        }
    }
    
    _updatePosition() {
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
        positions.forEach(pos => this.classList.remove(pos));
        this.classList.add(this._state.position);
    }
    
    _generateId() {
        return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    _saveToStorage() {
        try {
            localStorage.setItem('wb-log-errors', JSON.stringify({
                errors: this._state.errors.slice(0, 50), // Store only last 50
                timestamp: Date.now()
            }));
        } catch (e) {
            // Ignore storage errors
        }
    }
    
    _loadFromStorage() {
        try {
            const stored = localStorage.getItem('wb-log-errors');
            if (stored) {
                const data = JSON.parse(stored);
                if (data.errors && Array.isArray(data.errors)) {
                    this._state.errors = data.errors;
                    
                    // Extract sources
                    const sources = new Set();
                    data.errors.forEach(e => sources.add(e.source));
                    this._state.sources = sources;
                }
            }
        } catch (e) {
            // Ignore storage errors
        }
    }
    
    // Public API methods
    error(message, source = 'API') {
        this._addError({
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            level: 'error',
            message,
            source,
            type: 'api-error'
        });
    }
    
    warn(message, source = 'API') {
        this._addError({
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            level: 'warning',
            message,
            source,
            type: 'api-warning'
        });
    }
    
    info(message, source = 'API') {
        this._addError({
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            level: 'info',
            message,
            source,
            type: 'api-info'
        });
    }
    
    debug(message, source = 'API') {
        this._addError({
            id: this._generateId(),
            timestamp: new Date().toISOString(),
            level: 'debug',
            message,
            source,
            type: 'api-debug'
        });
    }
    
    clearErrors() {
        this._state.errors = [];
        this._state.sources = new Set();
        this._state.filteredErrors = [];
        this._saveToStorage();
        
        this.fireEvent('wb-log-error:clear', {});
    }
    
    show() {
        this._state.isVisible = true;
        this.setAttribute('visible', 'true');
    }
    
    hide() {
        this._state.isVisible = false;
        this.setAttribute('visible', 'false');
    }
    
    toggleVisibility() {
        if (this._state.isVisible) {
            this.hide();
        } else {
            this.show();
        }
        
        this.dispatchEvent(new CustomEvent('wb-log-error:toggle', {
            bubbles: true,
            detail: { visible: this._state.isVisible }
        }));
    }
    
    getErrors() {
        return [...this._state.errors];
    }
    
    getFilteredErrors() {
        return [...this._state.filteredErrors];
    }
    
    copyToClipboard() {
        const errors = this._state.filteredErrors;
        const text = errors.map(e => 
            `[${new Date(e.timestamp).toLocaleString()}] ${e.level.toUpperCase()} (${e.source}): ${e.message}`
        ).join('\n');
        
        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback
            const copyBtn = this.shadowRoot.querySelector('[data-action="copy"]');
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1000);
            }
        });
    }
    
    exportErrors(format = 'json') {
        const errors = this._state.errors;
        let content, filename, type;
        
        switch (format) {
            case 'csv':
                content = this._exportToCSV(errors);
                filename = 'error-log.csv';
                type = 'text/csv';
                break;
            case 'markdown':
                content = this._exportToMarkdown(errors);
                filename = 'error-log.md';
                type = 'text/markdown';
                break;
            default: // json
                content = JSON.stringify(errors, null, 2);
                filename = 'error-log.json';
                type = 'application/json';
        }
        
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    _exportToCSV(errors) {
        const headers = ['Timestamp', 'Level', 'Source', 'Message', 'Type'];
        const rows = errors.map(e => [
            new Date(e.timestamp).toISOString(),
            e.level,
            e.source,
            `"${e.message.replace(/"/g, '""')}"`,
            e.type
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    _exportToMarkdown(errors) {
        let md = '# Error Log\n\n';
        md += `Generated: ${new Date().toLocaleString()}\n\n`;
        md += `Total Errors: ${errors.length}\n\n`;
        
        errors.forEach(e => {
            md += `## ${e.level.toUpperCase()}: ${e.message}\n`;
            md += `- **Time:** ${new Date(e.timestamp).toLocaleString()}\n`;
            md += `- **Source:** ${e.source}\n`;
            md += `- **Type:** ${e.type}\n`;
            if (e.stack) {
                md += `\n\`\`\`\n${e.stack}\n\`\`\`\n`;
            }
            md += '\n---\n\n';
        });
        
        return md;
    }
}

// Register the custom element
if (!customElements.get('wb-log-error')) {
    customElements.define('wb-log-error', WBLogError);
}

if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-log-error', WBLogError, [], {
        version: '3.0.0',
        type: 'display',
        role: 'ui-element',
        description: 'Error logging component with filtering and export',
        api: {
            events: ['wb-log-error:ready', 'wb-log-error:new', 'wb-log-error:clear', 'wb-log-error:toggle'],
            attributes: ['position', 'visible', 'enable-export', 'enable-clear', 'enable-toggle', 'max-entries'],
            methods: ['error', 'warn', 'info', 'debug', 'clearErrors', 'show', 'hide', 'toggleVisibility', 'exportErrors']
        },
        priority: 4
    });
}

if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBLogError = WBLogError;
window.WBLogError = WBLogError;

export { WBLogError };
export default WBLogError;