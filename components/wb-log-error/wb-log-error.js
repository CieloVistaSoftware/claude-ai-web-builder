/**
 * WB Log Error Web Component
 * 
 * A standardized error logging and notification component for debugging and monitoring.
 * Captures JavaScript errors, warnings, and debug messages with export functionality.
 * 
 * @example
 * <wb-log-error position="bottom-right" visible="true"></wb-log-error>
 * <wb-log-error position="top-left" enable-export="true"></wb-log-error>
 * 
 * @events
 * - wb-log-error:ready - Fired when component is fully initialized
 * - wb-log-error:new - Fired when a new error is logged
 * - wb-log-error:clear - Fired when errors are cleared
 * - wb-log-error:toggle - Fired when visibility is toggled
 * 
 * @version 2.0.0
 * @author Website Builder Team
 */

(function() {
    'use strict';

    console.log('📋 WB Log Error Web Component: Starting initialization...');

    // Configuration fallback - used if JSON loading fails
    const fallbackConfig = {
        component: {
            name: 'wb-log-error',
            version: '2.0.0',
            description: 'Website Builder error logging component'
        },
        classes: {
            container: 'wb-log-error-container',
            header: 'wb-log-error-header',
            title: 'wb-log-error-title',
            counter: 'wb-log-error-counter',
            controls: 'wb-log-error-controls',
            body: 'wb-log-error-body',
            entry: 'wb-log-error-entry',
            visible: 'wb-log-error--visible',
            positions: {
                'top-left': 'wb-log-error--top-left',
                'top-right': 'wb-log-error--top-right',
                'bottom-left': 'wb-log-error--bottom-left',
                'bottom-right': 'wb-log-error--bottom-right',
                'center': 'wb-log-error--center'
            },
            levels: {
                error: 'wb-log-error--error',
                warn: 'wb-log-error--warn', 
                info: 'wb-log-error--info',
                debug: 'wb-log-error--debug'
            }
        },
        defaults: {
            position: 'bottom-right',
            visible: false,
            enableExport: true,
            enableClear: true,
            enableToggle: true,
            maxEntries: 100
        },
        attributes: {
            position: 'position',
            visible: 'visible',
            enableExport: 'enable-export',
            enableClear: 'enable-clear',
            enableToggle: 'enable-toggle',
            maxEntries: 'max-entries'
        },
        events: {
            ready: 'wb-log-error:ready',
            new: 'wb-log-error:new',
            clear: 'wb-log-error:clear',
            toggle: 'wb-log-error:toggle'
        }
    };

    class WBLogError extends HTMLElement {
        constructor() {
            super();
            
            // Component state
            this.config = fallbackConfig;
            this.initialized = false;
            this.utils = null;
            this.errors = [];
            this.filteredErrors = [];
            this.container = null;
            this.body = null;
            this.counter = null;
            this.isVisible = false;
            this.filters = {
                level: 'all',
                source: 'all',
                search: ''
            };
            
            // Drag state
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            
            // Bind methods
            this.handleError = this.handleError.bind(this);
            this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
            this.handleConsoleError = this.handleConsoleError.bind(this);
            this.toggleVisibility = this.toggleVisibility.bind(this);
            this.clearErrors = this.clearErrors.bind(this);
            this.exportErrors = this.exportErrors.bind(this);
            this.handleMouseDown = this.handleMouseDown.bind(this);
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.handleMouseUp = this.handleMouseUp.bind(this);
        }

        async connectedCallback() {
            try {
                await this.initialize();
            } catch (error) {
                console.error('📋 WB Log Error initialization failed:', error);
                this.initializeFallback();
            }
        }

        disconnectedCallback() {
            this.cleanup();
        }

        // Observed attributes for reactivity
        static get observedAttributes() {
            return ['position', 'visible', 'enable-export', 'enable-clear', 'enable-toggle', 'max-entries'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (!this.initialized) return;
            
            switch (name) {
                case 'position':
                    this.updatePosition(newValue);
                    break;
                case 'visible':
                    this.updateVisibility(newValue === 'true');
                    break;
                case 'enable-export':
                case 'enable-clear': 
                case 'enable-toggle':
                    this.updateControls();
                    break;
                case 'max-entries':
                    this.updateMaxEntries(parseInt(newValue, 10));
                    break;
            }
        }

        async initialize() {
            console.log('📋 WB Log Error: Initializing component...');
            
            // Load utilities
            await this.loadUtils();
            
            // Load configuration
            await this.loadConfig();
            
            // Load CSS
            await this.loadCSS();
            
            // Create DOM structure
            this.createStructure();
            
            // Setup error capture
            this.setupErrorCapture();
            
            // Apply initial attributes
            this.applyAttributes();
            
            // Load existing errors from localStorage
            this.loadStoredErrors();
            
            this.initialized = true;
            
            console.log('📋 WB Log Error: Component initialized successfully');
            this.dispatchEvent(new CustomEvent(this.config.events.ready, {
                detail: { component: this },
                bubbles: true
            }));
        }

        initializeFallback() {
            console.warn('📋 WB Log Error: Using fallback initialization');
            this.createStructure();
            this.setupErrorCapture();
            this.applyAttributes();
            this.initialized = true;
        }

        async loadUtils() {
            if (window.WBComponentUtils) {
                this.utils = window.WBComponentUtils;
                return;
            }
            
            try {
                const utilsPath = this.utils?.getPath?.() || '../../shared/wb-component-utils.js';
                await import(utilsPath);
                this.utils = window.WBComponentUtils;
            } catch (error) {
                console.warn('📋 WB Log Error: Component utils not available');
            }
        }

        async loadConfig() {
            try {
                const configPath = this.utils?.getPath?.() || './wb-log-error.schema.json';
                const response = await fetch(configPath.replace('.js', '.schema.json'));
                if (response.ok) {
                    const config = await response.json();
                    this.config = { ...this.config, ...config };
                }
            } catch (error) {
                console.warn('📋 WB Log Error: Could not load config, using fallback');
            }
        }

        async loadCSS() {
            if (window.WBComponentUtils) {
                const cssPath = window.WBComponentUtils.getPath('wb-log-error.js', '../components/wb-log-error/') + 'wb-log-error.css';
                await window.WBComponentUtils.loadCSS('wb-log-error', cssPath);
            } else if (this.utils?.loadCSS) {
                await this.utils.loadCSS('wb-log-error');
            } else {
                const cssPath = './wb-log-error.css';
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssPath;
                document.head.appendChild(link);
            }
        }

        createStructure() {
            // Create main container
            this.container = document.createElement('div');
            this.container.id = 'wb-log-error-main-container';
            this.container.className = this.config.classes.container;
            this.container.setAttribute('data-component', 'wb-log-error');
            this.container.setAttribute('role', 'alert');
            this.container.setAttribute('aria-live', 'polite');
            
            // Create header
            const header = document.createElement('div');
            header.id = 'wb-log-error-header';
            header.className = this.config.classes.header;
            
            // Create title with icon (draggable handle)
            const title = document.createElement('h2');
            title.id = 'wb-log-error-title';
            title.className = this.config.classes.title;
            title.innerHTML = '📋 Error Log';
            title.style.cssText = 'margin: 0; font-size: 1.2em; color: var(--primary, #007acc); display: inline-block; margin-right: auto; cursor: move; user-select: none;';
            
            // Simple count display
            this.counter = document.createElement('span');
            this.counter.id = 'wb-log-error-count';
            this.counter.textContent = '0';
            this.counter.style.cssText = 'font-size: 10px; color: var(--text-secondary, #cbd5e1); margin-left: 8px;';
            
            // Controls
            const controls = document.createElement('div');
            controls.id = 'wb-log-error-controls';
            controls.className = this.config.classes.controls;
            
            this.createControls(controls);
            
            // Create filter controls
            const filters = document.createElement('div');
            filters.className = 'wb-log-error-filters';
            filters.style.cssText = 'display: flex; gap: 8px; align-items: center; margin: 8px 0; padding: 8px; background: rgba(0,0,0,0.1); border-radius: 4px;';
            this.createFilters(filters);
            
            // Add drag event listeners to title
            title.addEventListener('mousedown', this.handleMouseDown);
            
            header.appendChild(title);
            header.appendChild(this.counter);
            header.appendChild(controls);
            header.appendChild(filters);
            
            // Create body
            this.body = document.createElement('div');
            this.body.id = 'wb-log-error-body';
            this.body.className = this.config.classes.body;
            
            this.container.appendChild(header);
            this.container.appendChild(this.body);
            
            // Append to shadow root or document
            this.appendChild(this.container);
        }

        createControls(controls) {
            // Clear button
            if (this.getAttribute('enable-clear') !== 'false') {
                const clearBtn = document.createElement('button');
                clearBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
                clearBtn.title = 'Clear All Errors';
                clearBtn.addEventListener('click', this.clearErrors);
                controls.appendChild(clearBtn);
            }
            
            // Copy to clipboard button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'wb-log-error-copy';
            copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>';
            copyBtn.title = 'Copy to Clipboard';
            copyBtn.addEventListener('click', () => this.copyToClipboard());
            controls.appendChild(copyBtn);
            
            // Export button
            if (this.getAttribute('enable-export') !== 'false') {
                const exportBtn = document.createElement('button');
                exportBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/></svg>';
                exportBtn.title = 'Export Error Log';
                exportBtn.addEventListener('click', () => this.exportErrors('json'));
                controls.appendChild(exportBtn);
            }
            
            // Toggle button  
            if (this.getAttribute('enable-toggle') !== 'false') {
                const toggleBtn = document.createElement('button');
                toggleBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>';
                toggleBtn.title = 'Toggle Error Log';
                toggleBtn.addEventListener('click', this.toggleVisibility);
                controls.appendChild(toggleBtn);
            }
        }

        createFilters(filters) {
            // Level filter
            const levelLabel = document.createElement('label');
            levelLabel.textContent = 'Level:';
            levelLabel.style.cssText = 'color: var(--text-primary); font-size: 12px; margin-right: 4px;';
            
            const levelSelect = document.createElement('select');
            levelSelect.id = 'wb-log-error-level-filter';
            levelSelect.style.cssText = 'background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 6px; font-size: 12px;';
            levelSelect.innerHTML = `
                <option value="all">All</option>
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
            `;
            levelSelect.addEventListener('change', (e) => {
                this.filters.level = e.target.value;
                this.applyFilters();
            });
            
            // Source filter
            const sourceLabel = document.createElement('label');
            sourceLabel.textContent = 'Source:';
            sourceLabel.style.cssText = 'color: var(--text-primary); font-size: 12px; margin-left: 8px; margin-right: 4px;';
            
            const sourceSelect = document.createElement('select');
            sourceSelect.id = 'wb-log-error-source-filter';
            sourceSelect.style.cssText = 'background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 6px; font-size: 12px;';
            sourceSelect.innerHTML = '<option value="all">All Sources</option>';
            sourceSelect.addEventListener('change', (e) => {
                this.filters.source = e.target.value;
                this.applyFilters();
            });
            
            // Search filter
            const searchLabel = document.createElement('label');
            searchLabel.textContent = 'Search:';
            searchLabel.style.cssText = 'color: var(--text-primary); font-size: 12px; margin-left: 8px; margin-right: 4px;';
            
            const searchInput = document.createElement('input');
            searchInput.id = 'wb-log-error-search-filter';
            searchInput.type = 'text';
            searchInput.placeholder = 'Filter messages...';
            searchInput.style.cssText = 'background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 6px; font-size: 12px; width: 120px;';
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
            
            // Clear filters button
            const clearBtn = document.createElement('button');
            clearBtn.innerHTML = '✖';
            clearBtn.title = 'Clear Filters';
            clearBtn.style.cssText = 'background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 6px; font-size: 12px; margin-left: 8px; cursor: pointer;';
            clearBtn.addEventListener('click', () => {
                this.filters = { level: 'all', source: 'all', search: '' };
                levelSelect.value = 'all';
                sourceSelect.value = 'all';
                searchInput.value = '';
                this.applyFilters();
            });
            
            filters.appendChild(levelLabel);
            filters.appendChild(levelSelect);
            filters.appendChild(sourceLabel);
            filters.appendChild(sourceSelect);
            filters.appendChild(searchLabel);
            filters.appendChild(searchInput);
            filters.appendChild(clearBtn);
        }

        // Drag handling methods
        handleMouseDown(e) {
            if (e.target.closest('.wb-log-error-controls') || e.target.closest('.wb-log-error-filters')) {
                return; // Don't drag when clicking controls or filters
            }
            
            this.isDragging = true;
            const rect = this.container.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            // Add global mouse event listeners
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
            
            // Prevent text selection
            e.preventDefault();
        }

        handleMouseMove(e) {
            if (!this.isDragging) return;
            
            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;
            
            // Keep within viewport bounds
            const rect = this.container.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;
            
            const clampedX = Math.max(0, Math.min(x, maxX));
            const clampedY = Math.max(0, Math.min(y, maxY));
            
            this.container.style.left = clampedX + 'px';
            this.container.style.top = clampedY + 'px';
            this.container.style.right = 'auto';
            this.container.style.bottom = 'auto';
        }

        handleMouseUp() {
            if (this.isDragging) {
                this.isDragging = false;
                document.removeEventListener('mousemove', this.handleMouseMove);
                document.removeEventListener('mouseup', this.handleMouseUp);
            }
        }

        setupErrorCapture() {
            // Capture JavaScript errors
            window.addEventListener('error', this.handleError);
            
            // Capture unhandled promise rejections  
            window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
            
            // Capture console errors (override console methods)
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.error = (...args) => {
                this.handleConsoleError('error', args);
                originalError.apply(console, args);
            };
            
            console.warn = (...args) => {
                this.handleConsoleError('warn', args);
                originalWarn.apply(console, args);
            };
        }

        handleError(event) {
            this.addError({
                level: 'error',
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack
            });
        }

        handleUnhandledRejection(event) {
            this.addError({
                level: 'error',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                source: 'Promise',
                stack: event.reason?.stack
            });
        }

        handleConsoleError(level, args) {
            this.addError({
                level,
                message: args.join(' '),
                source: 'Console'
            });
        }

        addError(errorData) {
            const error = {
                id: Date.now() + Math.random(),
                timestamp: new Date().toISOString(),
                ...errorData
            };
            
            this.errors.push(error);
            
            // Limit number of errors
            const maxEntries = parseInt(this.getAttribute('max-entries') || this.config.defaults.maxEntries, 10);
            if (this.errors.length > maxEntries) {
                this.errors = this.errors.slice(-maxEntries);
            }
            
            // Update source filter options
            this.updateSourceFilter();
            
            // Apply filters and re-render
            this.applyFilters();
            this.updateCounter();
            this.saveToStorage();
            
            // Auto-show on first error
            if (!this.isVisible) {
                this.show();
            }
            
            this.dispatchEvent(new CustomEvent(this.config.events.new, {
                detail: { error },
                bubbles: true
            }));
        }

        applyFilters() {
            // Filter errors based on current filter settings
            this.filteredErrors = this.errors.filter(error => {
                // Level filter
                if (this.filters.level !== 'all' && error.level !== this.filters.level) {
                    return false;
                }
                
                // Source filter
                if (this.filters.source !== 'all' && error.source !== this.filters.source) {
                    return false;
                }
                
                // Search filter
                if (this.filters.search && !error.message.toLowerCase().includes(this.filters.search)) {
                    return false;
                }
                
                return true;
            });
            
            // Re-render all filtered errors
            this.renderAll();
        }

        updateSourceFilter() {
            const sourceSelect = this.container?.querySelector('#wb-log-error-source-filter');
            if (!sourceSelect) return;
            
            // Get unique sources
            const sources = [...new Set(this.errors.map(error => error.source).filter(Boolean))];
            const currentValue = sourceSelect.value;
            
            // Update options
            sourceSelect.innerHTML = '<option value="all">All Sources</option>';
            sources.forEach(source => {
                const option = document.createElement('option');
                option.value = source;
                option.textContent = source;
                sourceSelect.appendChild(option);
            });
            
            // Restore selection if still valid
            if (sources.includes(currentValue)) {
                sourceSelect.value = currentValue;
            } else if (currentValue !== 'all') {
                sourceSelect.value = 'all';
                this.filters.source = 'all';
            }
        }

        renderError(error) {
            const entry = document.createElement('div');
            entry.className = `${this.config.classes.entry} ${this.config.classes.levels[error.level]}`;
            entry.innerHTML = `
                <div class="wb-log-error-entry-header">
                    <span class="wb-log-error-entry-level">${error.level.toUpperCase()}</span>
                    <span class="wb-log-error-entry-time">${new Date(error.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="wb-log-error-entry-message">${error.message}</div>
                ${error.source ? `<div class="wb-log-error-entry-source">${error.source}${error.line ? `:${error.line}` : ''}</div>` : ''}
                ${error.stack ? `<details class="wb-log-error-entry-stack"><summary>Stack Trace</summary><pre>${error.stack}</pre></details>` : ''}
            `;
            
            this.body.appendChild(entry);
            this.body.scrollTop = this.body.scrollHeight;
        }

        updateCounter() {
            const total = this.errors.length;
            this.counter.textContent = total;
        }

        applyAttributes() {
            const position = this.getAttribute('position') || this.config.defaults.position;
            this.updatePosition(position);
            
            const visible = this.getAttribute('visible') === 'true';
            this.updateVisibility(visible);
        }

        updatePosition(position) {
            // Remove all position classes
            Object.values(this.config.classes.positions).forEach(cls => {
                this.container.classList.remove(cls);
            });
            
            // Add new position class
            const positionClass = this.config.classes.positions[position];
            if (positionClass) {
                this.container.classList.add(positionClass);
            }
        }

        updateVisibility(visible) {
            this.isVisible = visible;
            if (visible) {
                this.container.classList.add(this.config.classes.visible);
            } else {
                this.container.classList.remove(this.config.classes.visible);
            }
        }

        updateControls() {
            // Recreate controls based on current attributes
            const controls = this.container.querySelector('.wb-log-error-controls');
            if (controls) {
                controls.innerHTML = '';
                this.createControls(controls);
            }
        }

        updateMaxEntries(maxEntries) {
            if (this.errors.length > maxEntries) {
                this.errors = this.errors.slice(-maxEntries);
                this.renderAll();
            }
        }

        renderAll() {
            this.body.innerHTML = '';
            this.filteredErrors.forEach(error => this.renderError(error));
            this.updateCounter();
        }

        toggleVisibility() {
            this.isVisible = !this.isVisible;
            this.updateVisibility(this.isVisible);
            this.setAttribute('visible', this.isVisible.toString());
            
            this.dispatchEvent(new CustomEvent(this.config.events.toggle, {
                detail: { visible: this.isVisible },
                bubbles: true
            }));
        }

        show() {
            this.updateVisibility(true);
            this.setAttribute('visible', 'true');
        }

        hide() {
            this.updateVisibility(false);
            this.setAttribute('visible', 'false');
        }

        clearErrors() {
            this.errors = [];
            this.body.innerHTML = '';
            this.updateCounter();
            this.saveToStorage();
            
            this.dispatchEvent(new CustomEvent(this.config.events.clear, {
                bubbles: true
            }));
        }

        async copyToClipboard() {
            try {
                const errors = this.errors;
                let logText = `WB Log Error Report - ${new Date().toLocaleString()}\n`;
                logText += `${'='.repeat(60)}\n\n`;
                
                if (errors.length === 0) {
                    logText += 'No errors logged.\n';
                } else {
                    errors.forEach((error, index) => {
                        logText += `[${index + 1}] ${new Date(error.timestamp).toLocaleString()} - ${error.level.toUpperCase()}\n`;
                        logText += `Message: ${error.message}\n`;
                        if (error.source) logText += `Source: ${error.source}\n`;
                        if (error.stack) {
                            logText += `Stack Trace:\n${error.stack}\n`;
                        }
                        logText += `${'-'.repeat(40)}\n\n`;
                    });
                }
                
                await navigator.clipboard.writeText(logText);
                
                // Visual feedback
                const copyBtn = this.container.querySelector('.wb-log-error-copy');
                if (copyBtn) {
                    const originalHTML = copyBtn.innerHTML;
                    const originalTitle = copyBtn.title;
                    copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>';
                    copyBtn.title = 'Copied!';
                    copyBtn.style.color = '#10b981';
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.title = originalTitle;
                        copyBtn.style.color = '';
                    }, 2000);
                }
                
                this.info('Error log copied to clipboard', 'wb-log-error');
            } catch (error) {
                console.error('Failed to copy to clipboard:', error);
                this.error('Failed to copy to clipboard: ' + error.message, 'wb-log-error');
            }
        }

        exportErrors(format = 'json') {
            const data = this.errors;
            let content, filename, mimeType;
            
            switch (format) {
                case 'json':
                    content = JSON.stringify(data, null, 2);
                    filename = 'wb-log-errors.json';
                    mimeType = 'application/json';
                    break;
                case 'csv':
                    content = this.convertToCSV(data);
                    filename = 'wb-log-errors.csv';
                    mimeType = 'text/csv';
                    break;
                default:
                    content = this.convertToMarkdown(data);
                    filename = 'issues.md';
                    mimeType = 'text/markdown';
            }
            
            this.downloadFile(content, filename, mimeType);
        }

        convertToCSV(data) {
            const headers = ['timestamp', 'level', 'message', 'source', 'line', 'column'];
            const rows = data.map(error => headers.map(h => error[h] || '').join(','));
            return [headers.join(','), ...rows].join('\n');
        }

        convertToMarkdown(data) {
            let md = `# Error Log Report\n\nGenerated: ${new Date().toLocaleString()}\n\n`;
            data.forEach((error, index) => {
                md += `## Error ${index + 1}\n\n`;
                md += `- **Level:** ${error.level}\n`;
                md += `- **Message:** ${error.message}\n`;
                md += `- **Time:** ${new Date(error.timestamp).toLocaleString()}\n`;
                if (error.source) md += `- **Source:** ${error.source}\n`;
                if (error.stack) md += `\n**Stack Trace:**\n\`\`\`\n${error.stack}\n\`\`\`\n`;
                md += '\n---\n\n';
            });
            return md;
        }

        downloadFile(content, filename, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        saveToStorage() {
            try {
                localStorage.setItem('wb-log-errors', JSON.stringify(this.errors));
            } catch (error) {
                console.warn('Failed to save errors to localStorage:', error);
            }
        }

        loadStoredErrors() {
            try {
                const stored = localStorage.getItem('wb-log-errors');
                if (stored) {
                    this.errors = JSON.parse(stored);
                    this.renderAll();
                }
            } catch (error) {
                console.warn('Failed to load errors from localStorage:', error);
            }
        }

        cleanup() {
            window.removeEventListener('error', this.handleError);
            window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
        }

        // Public API methods
        error(message, source, stack) {
            this.addError({ level: 'error', message, source, stack });
        }

        warn(message, source, stack) {
            this.addError({ level: 'warn', message, source, stack });
        }

        info(message, source, stack) {
            this.addError({ level: 'info', message, source, stack });
        }

        debug(message, source, stack) {
            this.addError({ level: 'debug', message, source, stack });
        }

        getErrors() {
            return [...this.errors];
        }

        getStats() {
            return {
                total: this.errors.length,
                errors: this.errors.filter(e => e.level === 'error').length,
                warnings: this.errors.filter(e => e.level === 'warn').length,
                info: this.errors.filter(e => e.level === 'info').length,
                debug: this.errors.filter(e => e.level === 'debug').length
            };
        }
    }

    // Register the custom element
    if (!customElements.get('wb-log-error')) {
        customElements.define('wb-log-error', WBLogError);
        console.log('📋 WB Log Error: Web component registered successfully');
    }
    
    // Register with WBComponentRegistry if available
    if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
        window.WBComponentRegistry.register('wb-log-error', WBLogError, ['wb-event-log'], {
            version: '1.0.0',
            type: 'logging',
            role: 'infrastructure',
            description: 'Error logging and display component with detailed stack traces and error categorization',
            api: {
                static: ['logError', 'clearErrors', 'getErrors'],
                events: ['error-logged', 'error-cleared'],
                attributes: ['max-errors', 'auto-clear', 'show-stack'],
                methods: ['addError', 'clearAll', 'exportErrors', 'setMaxErrors']
            },
            priority: 1 // High priority infrastructure component
        });
    }
    
    // Make it globally available for legacy compatibility
    window.WBLogError = WBLogError;})();