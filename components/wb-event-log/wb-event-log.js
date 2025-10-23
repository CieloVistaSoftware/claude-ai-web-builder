/**
 * WB Event Log Component
 * Passive event-driven logging system for Website Builder
 * Automatically captures and displays application events
 * 
 * @version 1.0.0
 * @author Website Builder Components
 */

// Load component configuration
let componentConfig = {};
    
import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBEventLog extends WBBaseComponent {
            // Instance method stubs for missing methods (only one set)
            render() {
                // Clear container
                this.innerHTML = '';
                // Create a wrapper for events
                const wrapper = document.createElement('div');
                wrapper.className = 'wb-event-log-list';
                // Render all events
                for (const event of this.events) {
                    const eventElem = this.createEventElement(event);
                    wrapper.appendChild(eventElem);
                }
                this.appendChild(wrapper);
            }
            logWarning(msg, details) {}
            logInfo(msg, details) {}
            logError(msg, details) {}
            logSuccess(msg, details) {}
            logDebug(msg, details) {}
            logUser(msg, details) {}
            isEventVisible(event) { return true; }
            renderEvent(event) {
                // Add only the latest event to the top
                if (!this.querySelector('.wb-event-log-list')) {
                    this.render();
                    return;
                }
                const wrapper = this.querySelector('.wb-event-log-list');
                const eventElem = this.createEventElement(event);
                wrapper.insertBefore(eventElem, wrapper.firstChild);
            }
                        createEventElement(event) {
                            const div = document.createElement('div');
                            div.className = `wb-event wb-event-${event.type}`;
                            div.style.padding = '6px 10px';
                            div.style.borderBottom = '1px solid #333';
                            div.style.fontSize = '0.95rem';
                            div.style.color = '#fff';
                            div.innerHTML = `
                                <span style="font-weight:bold;color:${this.getTypeColor(event.type)};">${event.type.toUpperCase()}</span>
                                <span style="margin-left:8px;">${event.message}</span>
                                <span style="float:right;font-size:0.8em;color:#888;">${new Date(event.timestamp).toLocaleTimeString()}</span>
                            `;
                            return div;
                        }

                        getTypeColor(type) {
                            switch(type) {
                                case 'error': return '#f44336';
                                case 'warning': return '#ff9800';
                                case 'info': return '#2196F3';
                                case 'success': return '#4CAF50';
                                case 'debug': return '#9C27B0';
                                case 'user': return '#607D8B';
                                default: return '#fff';
                            }
                        }
            scrollToTop() {}
            getInteractionTarget(target) { return ''; }
            detectEventTarget(details) { return ''; }
        constructor() {
            super();
            
            this.events = [];
            this.maxEvents = 1000;
            this.autoScroll = true;
            this.isPaused = false;
            this.filters = ['error', 'info'];
            this.searchFilter = '';
            this.wrapMode = 'truncate';
            this.wrapLength = 80;
            
            // Recursion protection flag
            this._processingEvent = false;
            
            // Console interception references
            this.originalConsole = {
                log: console.log,
                warn: console.warn,
                error: console.error,
                info: console.info,
                debug: console.debug
            };
            
            this.init();
        }
        
        async init() {
            this.logInfo('WB Event Log: Initializing...');
            
            // Load configuration
            await this.loadConfig();
            
            // Load CSS
            this.loadCSS();
            
            // Setup component
            this.setupComponent();
            this.setupEventListeners();
            this.render();
            
            // Don't log to self - would create self-referential event
            this.logInfo('WB Event Log: Ready');
        }
        
        async loadConfig() {
            try {
                const configPath = (typeof window !== 'undefined' && window['WBComponentUtils'] && typeof window['WBComponentUtils'].resolve === 'function')
                    ? window['WBComponentUtils'].resolve('wb.event-log.config')
                    : (this.getComponentPath() + '/wb-event-log.json');
                const response = await fetch(configPath);
                const config = await response.json();
                
                componentConfig = config;
                
                // Apply configuration
                this.maxEvents = config.config?.maxEvents || 1000;
                this.autoScroll = config.config?.autoScroll !== false;
                this.filters = config.config?.defaultFilters || ['error', 'info'];
                this.wrapMode = config.config?.display?.wrapMode || 'truncate';
                this.wrapLength = config.config?.display?.wrapLength || 80;
                
                console.log('🔧 WB Event Log: Configuration loaded', config);
            } catch (error) {
                this.logWarning('Failed to load configuration, using defaults', { source: 'wb-event-log', error: error.message });
            }
        }
        
        getComponentPath() {
            if (typeof window !== 'undefined' && window['WBComponentUtils'] && typeof window['WBComponentUtils'].getComponentPath === 'function') {
                return window['WBComponentUtils'].getComponentPath('wb-event-log.js', './components/wb-event-log/');
            }
            
            // Fallback path detection
            const scripts = document.querySelectorAll('script[src*="wb-event-log"]');
            if (scripts.length > 0) {
                const scriptSrc = (scripts[0] instanceof HTMLScriptElement ? scripts[0].src : '');
                return scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));
            }
            
            return './components/wb-event-log';
        }
        
        loadCSS() {
            const cssPath = this.getComponentPath() + '/wb-event-log.css';
            
            // Only call loadComponentCSS if it exists, otherwise fallback
            if (
                typeof window !== 'undefined' &&
                window['WBComponentUtils'] &&
                typeof window['WBComponentUtils']['loadComponentCSS'] === 'function'
            ) {
                window['WBComponentUtils']['loadComponentCSS']('wb-event-log', cssPath);
            } else {
                // Fallback CSS loading
                const existingLink = document.querySelector(`link[href*="wb-event-log.css"]`);
                if (!existingLink) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = cssPath;
                    document.head.appendChild(link);
                }
            }
        }
        
        setupComponent() {
            this.className = 'wb-event-log';
            
            // Apply data attributes
            if (this.hasAttribute('data-max-events')) {
                this.maxEvents = parseInt(this.getAttribute('data-max-events'));
            }
            if (this.hasAttribute('data-auto-scroll')) {
                this.autoScroll = this.getAttribute('data-auto-scroll') !== 'false';
            }
            if (this.hasAttribute('data-wrap-mode')) {
                this.wrapMode = this.getAttribute('data-wrap-mode');
            }
        }
        
        setupEventListeners() {
            // Listen for custom WB events
            document.addEventListener('wb:info', this.handleInfoEvent.bind(this));
            document.addEventListener('wb:warning', this.handleWarningEvent.bind(this));
            document.addEventListener('wb:error', this.handleErrorEvent.bind(this));
            document.addEventListener('wb:success', this.handleSuccessEvent.bind(this));
            document.addEventListener('wb:debug', this.handleDebugEvent.bind(this));
            document.addEventListener('wb:user', this.handleUserEvent.bind(this));
            
            // Listen for component lifecycle events
            document.addEventListener('wb:component-loaded', this.handleComponentEvent.bind(this));
            document.addEventListener('wb:component-error', this.handleComponentEvent.bind(this));
            
            // Listen for user interactions
            document.addEventListener('click', this.handleUserInteraction.bind(this));
            document.addEventListener('change', this.handleUserInteraction.bind(this));
            
            // Listen for window errors
            window.addEventListener('error', this.handleWindowError.bind(this));
            window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
            
            // Intercept network requests for 404 and other errors
            this.interceptFetch();
            this.interceptXHR();
            
            // Monitor navigation events
            this.setupNavigationTracking();
            
            // Monitor all resource loading errors
            this.setupResourceErrorTracking();
            
            // Intercept console methods
            this.interceptConsole();
        }
        
        interceptConsole() {
            const self = this;
            
            console.log = function(...args) {
                self.originalConsole.log.apply(console, args);
                if (!self.isPaused && !self._processingEvent) {
                    const logMessage = args.join(' ');
                    if (!logMessage.includes('wb-event-log')) {
                        self.addEvent('info', logMessage, { source: 'console' });
                    }
                }
            };
            
            console.warn = function(...args) {
                self.originalConsole.warn.apply(console, args);
                if (!self.isPaused && !self._processingEvent) {
                    const warnMessage = args.join(' ');
                    if (!warnMessage.includes('wb-event-log')) {
                        self.addEvent('warning', warnMessage, { source: 'console' });
                    }
                }
            };
            
            console.error = function(...args) {
                // Use original console to prevent recursion
                self.originalConsole.error.apply(console, args);
                
                if (!self.isPaused && !self._processingEvent) {
                    const errorMessage = args.join(' ');
                    // Prevent logging of wb-event-log errors
                    if (!errorMessage.includes('wb-event-log') && !errorMessage.includes('Maximum call stack')) {
                        self.addEvent('error', errorMessage, { source: 'console' });
                    }
                }
            };
            
            console.info = function(...args) {
                self.originalConsole.info.apply(console, args);
                if (!self.isPaused && !self._processingEvent) {
                    const infoMessage = args.join(' ');
                    if (!infoMessage.includes('wb-event-log')) {
                        self.addEvent('info', infoMessage, { source: 'console' });
                    }
                }
            };
            
            console.debug = function(...args) {
                self.originalConsole.debug.apply(console, args);
                if (!self.isPaused && !self._processingEvent) {
                    const debugMessage = args.join(' ');
                    if (!debugMessage.includes('wb-event-log')) {
                        self.addEvent('debug', debugMessage, { source: 'console' });
                    }
                }
            };
        }
        
        interceptFetch() {
            const self = this;
            const originalFetch = window.fetch;
            
            window.fetch = function(...args) {
                const startTime = Date.now();
                const url = args[0];
                const options = args[1] || {};
                
                // Capture stack trace at call site
                const stackTrace = new Error().stack;
                
                return originalFetch.apply(this, args)
                    .then(response => {
                        const duration = Date.now() - startTime;
                        
                        if (!response.ok) {
                            // Log HTTP error responses (404, 500, 503, etc.)
                            const errorMsg = `HTTP ${response.status} ${response.statusText}: ${url}`;
                            self.addEvent('error', errorMsg, {
                                source: 'fetch',
                                url: url,
                                method: options.method || 'GET',
                                status: response.status,
                                statusText: response.statusText,
                                duration: duration,
                                headers: Object.fromEntries(response.headers.entries()),
                                requestHeaders: options.headers || {},
                                stackTrace: stackTrace,
                                code: `fetch('${url}', ${JSON.stringify(options, null, 2)})`,
                                from: self.extractCallerFromStack(stackTrace),
                                to: url
                            });
                        }
                        
                        return response;
                    })
                    .catch(error => {
                        const duration = Date.now() - startTime;
                        
                        // Log network errors (connection failed, timeout, etc.)
                        const errorMsg = `Network Error: ${error.message} for ${url}`;
                        self.addEvent('error', errorMsg, {
                            source: 'fetch',
                            url: url,
                            method: options.method || 'GET',
                            error: error.message,
                            duration: duration,
                            requestHeaders: options.headers || {},
                            stackTrace: stackTrace,
                            code: `fetch('${url}', ${JSON.stringify(options, null, 2)})`,
                            from: self.extractCallerFromStack(stackTrace),
                            to: url
                        });
                        
                        throw error;
                    });
            };
        }
        
        interceptXHR() {
            const self = this;
            const originalXHROpen = XMLHttpRequest.prototype.open;
            const originalXHRSend = XMLHttpRequest.prototype.send;
            
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                this['_wbEventLog'] = {
                    method: method,
                    url: url,
                    startTime: null,
                    stackTrace: new Error().stack
                };
                return originalXHROpen.apply(this, [method, url, ...args]);
            };
            
            XMLHttpRequest.prototype.send = function(...args) {
                if (this['_wbEventLog']) {
                    this['_wbEventLog'].startTime = Date.now();
                    const onError = () => {
                        const wbEventLog = this['_wbEventLog'];
                        const duration = Date.now() - (wbEventLog && wbEventLog.startTime ? wbEventLog.startTime : Date.now());
                        const errorMsg = `XHR Error: ${this.status} ${this.statusText || 'Network Error'} for ${(wbEventLog && wbEventLog.url ? wbEventLog.url : '')}`;
                        self.addEvent('error', errorMsg, {
                            source: 'xhr',
                            url: wbEventLog && wbEventLog.url ? wbEventLog.url : '',
                            method: wbEventLog && wbEventLog.method ? wbEventLog.method : '',
                            status: this.status,
                            statusText: this.statusText,
                            duration: duration,
                            responseHeaders: typeof this.getAllResponseHeaders === 'function' ? this.getAllResponseHeaders() : '',
                            stackTrace: wbEventLog && wbEventLog.stackTrace ? wbEventLog.stackTrace : '',
                            code: `xhr.open('${wbEventLog && wbEventLog.method ? wbEventLog.method : ''}', '${wbEventLog && wbEventLog.url ? wbEventLog.url : ''}')`,
                            from: self.extractCallerFromStack(wbEventLog && wbEventLog.stackTrace ? wbEventLog.stackTrace : ''),
                            to: wbEventLog && wbEventLog.url ? wbEventLog.url : ''
                        });
                    };
                    this.addEventListener('error', onError);
                    this.addEventListener('load', () => {
                        if (this.status >= 400) {
                            onError();
                        }
                    });
                }
                return originalXHRSend.apply(this, args);
            };
        }
        
        setupNavigationTracking() {
            const self = this;
            
            // Track initial page load
            this.currentUrl = window.location.href;
            this.lastScrollY = 0;
            
            // Monitor popstate events (back/forward navigation)
            window.addEventListener('popstate', function(event) {
                const newUrl = window.location.href;
                const scrollY = Math.round(window.scrollY);
                
                self.addEvent('info', `RETURNED: Back to page at Y=${scrollY}`, {
                    source: 'navigation',
                    type: 'popstate',
                    url: newUrl,
                    previousUrl: self.currentUrl,
                    scrollPosition: scrollY,
                    state: event.state,
                    from: self.getUrlShort(self.currentUrl),
                    to: self.getUrlShort(newUrl),
                    code: `window.history.back() or browser back button`,
                    fullNavigation: {
                        currentUrl: newUrl,
                        previousUrl: self.currentUrl,
                        scrollY: scrollY,
                        timestamp: Date.now()
                    }
                });
                
                self.currentUrl = newUrl;
                self.lastScrollY = scrollY;
            });
            
            // Monitor hashchange events
            window.addEventListener('hashchange', function(event) {
                const newUrl = event.newURL;
                const oldUrl = event.oldURL;
                const scrollY = Math.round(window.scrollY);
                
                self.addEvent('info', `NAVIGATION: Hash changed to ${window.location.hash}`, {
                    source: 'navigation',
                    type: 'hashchange',
                    url: newUrl,
                    previousUrl: oldUrl,
                    hash: window.location.hash,
                    scrollPosition: scrollY,
                    from: self.getUrlShort(oldUrl),
                    to: self.getUrlShort(newUrl),
                    code: `window.location.hash = '${window.location.hash}'`,
                    fullNavigation: {
                        currentUrl: newUrl,
                        previousUrl: oldUrl,
                        hash: window.location.hash,
                        scrollY: scrollY,
                        timestamp: Date.now()
                    }
                });
                
                self.currentUrl = newUrl;
            });
            
            // Monitor programmatic navigation
            this.interceptHistoryMethods();
            
            // Monitor significant scroll events
            let scrollTimeout;
            window.addEventListener('scroll', function() {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const scrollY = Math.round(window.scrollY);
                    const scrollDelta = Math.abs(scrollY - self.lastScrollY);
                    
                    // Only log significant scroll changes (> 200px)
                    if (scrollDelta > 200) {
                        self.addEvent('debug', `SCROLL: Page scrolled to Y=${scrollY}`, {
                            source: 'navigation',
                            type: 'scroll',
                            url: window.location.href,
                            scrollPosition: scrollY,
                            previousScrollY: self.lastScrollY,
                            scrollDelta: scrollDelta,
                            from: `Y=${self.lastScrollY}`,
                            to: `Y=${scrollY}`,
                            fullNavigation: {
                                currentUrl: window.location.href,
                                scrollY: scrollY,
                                previousScrollY: self.lastScrollY,
                                timestamp: Date.now()
                            }
                        });
                        
                        self.lastScrollY = scrollY;
                    }
                }, 150); // Debounce scroll events
            });
        }
        
        interceptHistoryMethods() {
            const self = this;
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            
            history.pushState = function(state, title, url) {
                const result = originalPushState.apply(this, arguments);
                const newUrl = url ? new URL(url, window.location.origin).href : window.location.href;
                const scrollY = Math.round(window.scrollY);
                
                self.addEvent('info', `NAVIGATION: Pushed new state`, {
                    source: 'navigation',
                    type: 'pushstate',
                    url: newUrl,
                    previousUrl: self.currentUrl,
                    state: state,
                    title: title,
                    scrollPosition: scrollY,
                    from: self.getUrlShort(self.currentUrl),
                    to: self.getUrlShort(newUrl),
                    code: `history.pushState(${JSON.stringify(state)}, '${title}', '${url}')`,
                    fullNavigation: {
                        currentUrl: newUrl,
                        previousUrl: self.currentUrl,
                        state: state,
                        title: title,
                        scrollY: scrollY,
                        timestamp: Date.now()
                    }
                });
                
                self.currentUrl = newUrl;
                return result;
            };
            
            history.replaceState = function(state, title, url) {
                const result = originalReplaceState.apply(this, arguments);
                const newUrl = url ? new URL(url, window.location.origin).href : window.location.href;
                const scrollY = Math.round(window.scrollY);
                
                self.addEvent('info', `NAVIGATION: Replaced current state`, {
                    source: 'navigation',
                    type: 'replacestate',
                    url: newUrl,
                    previousUrl: self.currentUrl,
                    state: state,
                    title: title,
                    scrollPosition: scrollY,
                    from: self.getUrlShort(self.currentUrl),
                    to: self.getUrlShort(newUrl),
                    code: `history.replaceState(${JSON.stringify(state)}, '${title}', '${url}')`,
                    fullNavigation: {
                        currentUrl: newUrl,
                        previousUrl: self.currentUrl,
                        state: state,
                        title: title,
                        scrollY: scrollY,
                        timestamp: Date.now()
                    }
                });
                
                self.currentUrl = newUrl;
                return result;
            };
        }
        
        getUrlShort(url) {
            if (!url) return 'unknown';
            try {
                const urlObj = new URL(url);
                return urlObj.pathname + urlObj.search + urlObj.hash;
            } catch {
                return url;
            }
        }
        
        setupResourceErrorTracking() {
            const self = this;
            
            // Capture all resource loading errors (images, scripts, stylesheets, etc.)
            window.addEventListener('error', function(event) {
                // Check if this is a resource loading error
                    if (event.target !== window && event.target instanceof HTMLElement && 'src' in event.target) {
                    const errorMsg = `Resource Load Error: ${event.target.tagName} failed to load ${event.target.src}`;
                    
                    self.addEvent('error', errorMsg, {
                        source: 'resource-error',
                        url: event.target.src,
                        resourceType: event.target.tagName.toLowerCase(),
                        element: event.target.outerHTML,
                        code: `<${event.target.tagName.toLowerCase()} src="${event.target.src}">`,
                        from: 'html-element',
                        to: event.target.src,
                        stackTrace: new Error().stack,
                        resourceDetails: {
                            url: event.target.src,
                            type: event.target.tagName,
                            id: event.target.id,
                            className: event.target.className,
                            timestamp: Date.now()
                        }
                    });
                }
            }, true); // Use capture phase to catch resource errors
            
            
            // Monitor performance entries for failed requests
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver(function(list) {
                        list.getEntries().forEach(entry => {
                            // Check for failed navigation or resource entries
                            if (entry.entryType === 'navigation' || entry.entryType === 'resource') {
                                // Failed requests often have transferSize of 0 and duration issues
                                if (entry.entryType === 'resource' && 'transferSize' in entry && 'decodedBodySize' in entry && entry.transferSize === 0 && entry.decodedBodySize === 0 && entry.duration > 0) {
                                    self.addEvent('error', `Performance: Possible failed request to ${entry.name}`, {
                                        source: 'performance',
                                        url: entry.name,
                                        entryType: entry.entryType,
                                        duration: entry.duration,
                                        transferSize: entry.transferSize,
                                        code: `Network request to: ${entry.name}`,
                                        from: 'browser',
                                        to: entry.name,
                                        performanceDetails: {
                                            name: entry.name,
                                            entryType: entry.entryType,
                                            startTime: entry.startTime,
                                            duration: entry.duration,
                                            transferSize: entry.transferSize,
                                            decodedBodySize: entry.decodedBodySize,
                                            timestamp: Date.now()
                                        }
                                    });
                                }
                            }
                        });
                    });
                    
                    observer.observe({ entryTypes: ['navigation', 'resource'] });
                } catch (e) {
                    this.logWarning('Performance Observer not supported for resource monitoring', { source: 'wb-event-log', error: e.message });
                }
            }
        }
        
        extractCallerFromStack(stack) {
            if (!stack) return 'unknown';
            
            const lines = stack.split('\n');
            // Skip the first few lines (Error constructor, this method, interceptor)
            for (let i = 3; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line && !line.includes('wb-event-log') && !line.includes('XMLHttpRequest')) {
                    // Extract file and line number
                    const match = line.match(/at .* \((.+):(\d+):(\d+)\)/);
                    if (match) {
                        const [, file, lineNum] = match;
                        const fileName = file.split('/').pop();
                        return `${fileName}:${lineNum}`;
                    }
                }
            }
            return 'unknown';
        }
        
        // Event handlers
        handleInfoEvent(event) {
            if (!this.isPaused) {
                this.addEvent('info', event.detail.message, event.detail);
            }
        }
        
        handleWarningEvent(event) {
            if (!this.isPaused) {
                this.addEvent('warning', event.detail.message, event.detail);
            }
        }
        
        handleErrorEvent(event) {
            if (!this.isPaused) {
                this.addEvent('error', event.detail.message, event.detail);
            }
        }
        
        handleSuccessEvent(event) {
            if (!this.isPaused) {
                this.addEvent('success', event.detail.message, event.detail);
            }
        }
        
        handleDebugEvent(event) {
            if (!this.isPaused) {
                this.addEvent('debug', event.detail.message, event.detail);
            }
        }
        
        handleUserEvent(event) {
            if (!this.isPaused) {
                this.addEvent('user', event.detail.message, event.detail);
            }
        }
        
        handleComponentEvent(event) {
            if (!this.isPaused) {
                const type = event.type.includes('error') ? 'error' : 'info';
                this.addEvent(type, event.detail.message, event.detail);
            }
        }
        
        handleUserInteraction(event) {
            if (!this.isPaused && this.shouldLogInteraction(event)) {
                const message = this.formatInteractionMessage(event);
                this.addEvent('user', message, { 
                    source: 'user-interaction',
                    element: event.target.tagName.toLowerCase(),
                    id: event.target.id,
                    className: event.target.className,
                    from: 'user',
                    to: this.getInteractionTarget(event.target),
                    target: event.target
                });
            }
        }
        
        shouldLogInteraction(event) {
            // Skip if target is part of the event log itself
            if (event.target.closest('.wb-event-log')) {
                return false;
            }
            
            // Skip if target has ignore attribute
            if (event.target.hasAttribute('data-wb-ignore') || 
                event.target.closest('[data-wb-ignore]')) {
                return false;
            }
            
            // Only log meaningful interactions
            const tagName = event.target.tagName.toLowerCase();
            return ['button', 'a', 'input', 'select', 'textarea'].includes(tagName) ||
                   event.target.hasAttribute('data-wb-log');
        }
        
        formatInteractionMessage(event) {
            const target = event.target;
            const tagName = target.tagName.toLowerCase();
            const id = target.id ? `#${target.id}` : '';
            const text = target.textContent?.trim().slice(0, 30) || '';
            
            switch (event.type) {
                case 'click':
                    return `Clicked ${tagName}${id}: ${text}`;
                case 'change':
                    return `Changed ${tagName}${id}: ${target.value?.slice(0, 30) || ''}`;
                default:
                    return `${event.type} on ${tagName}${id}`;
            }
        }
        
        handleWindowError(event) {
            if (!this.isPaused) {
                const errorMessage = `${event.message} at ${event.filename}:${event.lineno}`;
                
                // ALWAYS LOG TO TERMINAL CONSOLE
                console.error('\n🚨🚨🚨 === WB-EVENT-LOG WINDOW ERROR === 🚨🚨🚨');
                console.error(`⏰ TIME: ${new Date().toISOString()}`);
                console.error(`📝 MESSAGE: ${event.message}`);
                console.error(`📍 LOCATION: ${event.filename}:${event.lineno}:${event.colno}`);
                console.error(`📜 STACK: ${event.error?.stack || 'No stack trace'}`);
                console.error('🚨🚨🚨 ================================ 🚨🚨🚨\n');
                
                this.addEvent('error', errorMessage, {
                    source: 'window-error',
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: event.error?.stack,
                    from: `${event.filename}:${event.lineno}`,
                    to: 'error-handler'
                });
            }
        }
        
        handlePromiseRejection(event) {
            if (!this.isPaused) {
                const errorMessage = `Unhandled promise rejection: ${event.reason}`;
                
                // ALWAYS LOG TO TERMINAL CONSOLE
                console.error('\n🚨🚨🚨 === WB-EVENT-LOG PROMISE REJECTION === 🚨🚨🚨');
                console.error(`⏰ TIME: ${new Date().toISOString()}`);
                console.error(`📝 REASON: ${event.reason}`);
                console.error(`📜 STACK: ${event.reason?.stack || 'No stack trace'}`);
                console.error('🚨🚨🚨 =================================== 🚨🚨🚨\n');
                
                this.addEvent('error', errorMessage, {
                    source: 'promise-rejection',
                    reason: event.reason,
                    stack: event.reason?.stack,
                    from: 'promise',
                    to: 'rejection-handler'
                });
            }
        }
        
        // Core event management
        addEvent(type, message, details = {}) {
            // CRITICAL: Prevent infinite recursion by detecting if we're already processing an event
            if (this._processingEvent) {
                // Use original console to avoid recursion
                this.originalConsole.warn('🚨 WB Event Log: Recursion prevented in addEvent:', type, message);
                return;
            }
            
            // Set recursion protection flag
            this._processingEvent = true;
            
            try {
                // Prevent duplicate navigation events
                if (details.source === 'navigation' && type === 'info') {
                    const recentSimilar = this.events.find(e => 
                        e.type === type && 
                        e.message === message && 
                        e.details.source === 'navigation' &&
                        (Date.now() - e.timestamp) < 1000 // Within 1 second
                    );
                    if (recentSimilar) {
                        this.originalConsole.log('Duplicate navigation event prevented:', message);
                        return;
                    }
                }
                
                // Prevent wb-event-log errors from logging themselves (silently drop)
                if (details.source === 'wb-event-log' || message.includes('wb-event-log') || message.includes('Maximum call stack')) {
                    // Silently prevent self-referential events - don't log about it
                    return;
                }
                
                // Truncate very long messages for localStorage efficiency
                const truncatedMessage = message.length > 200 ? 
                    message.substring(0, 200) + '...' : message;
                
                // Clean up details to prevent localStorage bloat
                const cleanDetails = this.sanitizeDetailsForStorage(details);
                
                const event = {
                    id: this.generateId(),
                    type: type,
                    timestamp: Date.now(),
                    message: truncatedMessage,
                    originalMessage: message !== truncatedMessage ? message : undefined,
                    source: cleanDetails.source || 'unknown',
                    from: cleanDetails.from || this.detectEventOrigin(),
                    to: cleanDetails.to || this.detectEventTarget(cleanDetails),
                    details: cleanDetails,
                    expanded: false
                };
                
                // Add new events to the beginning (newest first)
                this.events.unshift(event);
                
                // Enforce max events limit (remove from end)
                if (this.events.length > this.maxEvents) {
                    this.events.pop();
                }
                
                // Manage localStorage quota before any storage operations
                this.manageLocalStorageQuota();
                
                // Render new event if visible
                if (this.isEventVisible(event)) {
                    this.renderEvent(event);
                    
                    if (this.autoScroll) {
                        this.scrollToTop();
                    }
                }
            
                // Dispatch custom event
                this.dispatchEvent(new CustomEvent('wb-event-logged', { 
                    detail: event,
                    bubbles: true
                }));
                
            } catch (error) {
                // Use original console to avoid recursion
                this.originalConsole.error('🚨 WB Event Log: Error in addEvent:', error);
            } finally {
                // Always clear recursion protection flag
                this._processingEvent = false;
            }
        }
        
        sanitizeDetailsForStorage(details) {
            // Create a clean copy of details, removing large or non-essential data
            const cleanDetails = { ...details };
            
            // Remove or truncate large properties that can cause localStorage issues
            if (cleanDetails.stackTrace && cleanDetails.stackTrace.length > 500) {
                cleanDetails.stackTrace = cleanDetails.stackTrace.substring(0, 500) + '...\n(truncated)';
            }
            
            if (cleanDetails.code && cleanDetails.code.length > 300) {
                cleanDetails.code = cleanDetails.code.substring(0, 300) + '...\n(truncated)';
            }
            
            // Remove DOM elements and complex objects that don't serialize well
            delete cleanDetails.target;
            delete cleanDetails.element;
            
            // Truncate headers if they're too large
            if (cleanDetails.headers && typeof cleanDetails.headers === 'object') {
                const headerSize = JSON.stringify(cleanDetails.headers).length;
                if (headerSize > 200) {
                    cleanDetails.headers = { _truncated: 'Headers too large, removed for storage' };
                }
            }
            
            if (cleanDetails.requestHeaders && typeof cleanDetails.requestHeaders === 'object') {
                const reqHeaderSize = JSON.stringify(cleanDetails.requestHeaders).length;
                if (reqHeaderSize > 200) {
                    cleanDetails.requestHeaders = { _truncated: 'Request headers too large, removed for storage' };
                }
            }
            
            return cleanDetails;
        }
        
        manageLocalStorageQuota() {
            try {
                // Test if localStorage is available and has space
                const testKey = 'wb-event-log-quota-test';
                localStorage.setItem(testKey, 'test');
                localStorage.removeItem(testKey);
            } catch (error) {
                if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    console.warn('🔧 WB Event Log: localStorage quota exceeded, performing cleanup...');
                    this.emergencyCleanup();
                }
            }
        }
        
        emergencyCleanup() {
            try {
                // Clear old event log data first
                const eventLogKeys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (key.startsWith('wb-event-log') || key.startsWith('wb-') && key.includes('log'))) {
                        eventLogKeys.push(key);
                    }
                }
                
                // Remove event log specific keys
                eventLogKeys.forEach(key => {
                    try {
                        localStorage.removeItem(key);
                        this.logInfo(`Cleaned up localStorage key: ${key}`, { source: 'wb-event-log', action: 'cleanup' });
                    } catch (e) {
                        // Continue cleaning even if individual removals fail
                    }
                });
                
                // If still having issues, perform more aggressive cleanup
                if (this.getLocalStorageSize() > 4.5 * 1024 * 1024) { // > 4.5MB
                    this.aggressiveCleanup();
                }
                
                // Log the cleanup action
                console.warn('🔧 WB Event Log: Emergency localStorage cleanup completed');
            } catch (error) {
                console.error('🔧 WB Event Log: Failed to perform emergency cleanup:', error);
            }
        }
        
        getLocalStorageSize() {
            let totalSize = 0;
            try {
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        totalSize += localStorage[key].length + key.length;
                    }
                }
            } catch (error) {
                console.warn('🔧 Could not calculate localStorage size:', error);
                return 5 * 1024 * 1024; // Assume it's full (5MB)
            }
            return totalSize;
        }
        
        aggressiveCleanup() {
            try {
                // Get all keys and their sizes
                const keysSizes = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key) {
                        const value = localStorage.getItem(key);
                        keysSizes.push({
                            key: key,
                            size: (value ? value.length : 0) + key.length
                        });
                    }
                }
                
                // Sort by size (largest first) and remove the largest items
                keysSizes.sort((a, b) => b.size - a.size);
                
                let removedSize = 0;
                const targetRemoval = 1 * 1024 * 1024; // Remove at least 1MB
                
                for (const item of keysSizes) {
                    if (removedSize < targetRemoval) {
                        // Skip essential wb-component configurations
                        if (!item.key.includes('wb-') || item.key.includes('config') || item.key.includes('settings')) {
                            continue;
                        }
                        
                        try {
                            localStorage.removeItem(item.key);
                            removedSize += item.size;
                            this.logInfo(`Aggressively removed: ${item.key} (${item.size} chars)`, { source: 'wb-event-log', action: 'cleanup', size: item.size });
                        } catch (e) {
                            // Continue even if individual removal fails
                        }
                    } else {
                        break;
                    }
                }
                
                this.logInfo(`Aggressive cleanup removed ${removedSize} characters from localStorage`, { source: 'wb-event-log', action: 'cleanup', totalSize: removedSize });
            } catch (error) {
                console.error('🔧 Failed aggressive cleanup:', error);
            }
        }
        
        generateId() {
            if (typeof window !== 'undefined' && window['WBComponentUtils'] && typeof window['WBComponentUtils'].generateId === 'function') {
                return window['WBComponentUtils'].generateId();
            }
            return 'event-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        detectEventOrigin() {
            // Try to detect where the event is coming from
            try {
                const stack = (new Error()).stack;
                if (stack) {
                    const lines = stack.split('\n');
                    // Skip the first few lines (this function and addEvent)
                    for (let i = 3; i < Math.min(lines.length, 8); i++) {
                        const line = lines[i];
                        if (line && !line.includes('wb-event-log')) {
                            return line.trim();
                        }
                    }
                }
            } catch (e) {
                // Ignore errors
            }
            return 'unknown';
        }

    // ...existing code...

    if (!customElements.get('wb-event-log')) {
        customElements.define('wb-event-log', WBEventLog);
    }
}
