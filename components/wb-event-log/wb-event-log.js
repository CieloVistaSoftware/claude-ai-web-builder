/**
 * WB Event Log Component
 * Passive event-driven logging system for Website Builder
 * Automatically captures and displays application events
 * 
 * @version 1.0.0
 * @author Website Builder Components
 */

(function() {
    'use strict';

    // Load component configuration
    let componentConfig = {};
    
    class WBEventLog extends HTMLElement {
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
            console.log('🔧 WB Event Log: Initializing...');
            
            // Load configuration
            await this.loadConfig();
            
            // Load CSS
            this.loadCSS();
            
            // Setup component
            this.setupComponent();
            this.setupEventListeners();
            this.render();
            
            // Start logging immediately
            this.logInfo('Event log initialized', { source: 'wb-event-log' });
            
            console.log('🔧 WB Event Log: Ready');
        }
        
        async loadConfig() {
            try {
                const configPath = this.getComponentPath() + '/wb-event-log.json';
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
                console.warn('🔧 WB Event Log: Failed to load configuration, using defaults', error);
            }
        }
        
        getComponentPath() {
            if (typeof WBComponentUtils !== 'undefined' && WBComponentUtils.getComponentPath) {
                return WBComponentUtils.getComponentPath('wb-event-log');
            }
            
            // Fallback path detection
            const scripts = document.querySelectorAll('script[src*="wb-event-log"]');
            if (scripts.length > 0) {
                const scriptSrc = scripts[0].src;
                return scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));
            }
            
            return './components/wb-event-log';
        }
        
        loadCSS() {
            if (typeof WBComponentUtils !== 'undefined' && WBComponentUtils.loadComponentCSS) {
                WBComponentUtils.loadComponentCSS('wb-event-log', this.getComponentPath() + '/wb-event-log.css');
            } else {
                // Fallback CSS loading
                const cssPath = this.getComponentPath() + '/wb-event-log.css';
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
                if (!self.isPaused) {
                    self.addEvent('info', args.join(' '), { source: 'console' });
                }
            };
            
            console.warn = function(...args) {
                self.originalConsole.warn.apply(console, args);
                if (!self.isPaused) {
                    self.addEvent('warning', args.join(' '), { source: 'console' });
                }
            };
            
            console.error = function(...args) {
                self.originalConsole.error.apply(console, args);
                if (!self.isPaused) {
                    self.addEvent('error', args.join(' '), { source: 'console' });
                }
            };
            
            console.info = function(...args) {
                self.originalConsole.info.apply(console, args);
                if (!self.isPaused) {
                    self.addEvent('info', args.join(' '), { source: 'console' });
                }
            };
            
            console.debug = function(...args) {
                self.originalConsole.debug.apply(console, args);
                if (!self.isPaused) {
                    self.addEvent('debug', args.join(' '), { source: 'console' });
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
                this._wbEventLog = {
                    method: method,
                    url: url,
                    startTime: null,
                    stackTrace: new Error().stack
                };
                return originalXHROpen.apply(this, [method, url, ...args]);
            };
            
            XMLHttpRequest.prototype.send = function(...args) {
                if (this._wbEventLog) {
                    this._wbEventLog.startTime = Date.now();
                    
                    const onError = () => {
                        const duration = Date.now() - this._wbEventLog.startTime;
                        const errorMsg = `XHR Error: ${this.status} ${this.statusText || 'Network Error'} for ${this._wbEventLog.url}`;
                        
                        self.addEvent('error', errorMsg, {
                            source: 'xhr',
                            url: this._wbEventLog.url,
                            method: this._wbEventLog.method,
                            status: this.status,
                            statusText: this.statusText,
                            duration: duration,
                            responseHeaders: this.getAllResponseHeaders(),
                            stackTrace: this._wbEventLog.stackTrace,
                            code: `xhr.open('${this._wbEventLog.method}', '${this._wbEventLog.url}')`,
                            from: self.extractCallerFromStack(this._wbEventLog.stackTrace),
                            to: this._wbEventLog.url
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
                if (event.target !== window && event.target.src) {
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
            
            // Override Image constructor to catch programmatic image loads
            const OriginalImage = window.Image;
            window.Image = function() {
                const img = new OriginalImage();
                const originalSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
                
                Object.defineProperty(img, 'src', {
                    get: originalSrc.get,
                    set: function(value) {
                        const stackTrace = new Error().stack;
                        
                        img.addEventListener('error', function() {
                            self.addEvent('error', `Image Load Error: Failed to load ${value}`, {
                                source: 'image-error',
                                url: value,
                                resourceType: 'image',
                                code: `new Image(); img.src = '${value}';`,
                                stackTrace: stackTrace,
                                from: self.extractCallerFromStack(stackTrace),
                                to: value,
                                imageDetails: {
                                    url: value,
                                    width: img.width,
                                    height: img.height,
                                    timestamp: Date.now()
                                }
                            });
                        });
                        
                        return originalSrc.set.call(this, value);
                    }
                });
                
                return img;
            };
            
            // Monitor performance entries for failed requests
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver(function(list) {
                        list.getEntries().forEach(entry => {
                            // Check for failed navigation or resource entries
                            if (entry.entryType === 'navigation' || entry.entryType === 'resource') {
                                // Failed requests often have transferSize of 0 and duration issues
                                if (entry.transferSize === 0 && entry.decodedBodySize === 0 && entry.duration > 0) {
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
                    console.warn('Performance Observer not supported for resource monitoring');
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
                this.addEvent('error', `${event.message} at ${event.filename}:${event.lineno}`, {
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
                this.addEvent('error', `Unhandled promise rejection: ${event.reason}`, {
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
            // Prevent duplicate navigation events
            if (details.source === 'navigation' && type === 'info') {
                const recentSimilar = this.events.find(e => 
                    e.type === type && 
                    e.message === message && 
                    e.details.source === 'navigation' &&
                    (Date.now() - e.timestamp) < 1000 // Within 1 second
                );
                if (recentSimilar) {
                    console.log('Duplicate navigation event prevented:', message);
                    return;
                }
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
                        console.log(`🔧 Cleaned up localStorage key: ${key}`);
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
                            console.log(`🔧 Aggressively removed: ${item.key} (${item.size} chars)`);
                        } catch (e) {
                            // Continue even if individual removal fails
                        }
                    } else {
                        break;
                    }
                }
                
                console.log(`🔧 Aggressive cleanup removed ${removedSize} characters from localStorage`);
            } catch (error) {
                console.error('🔧 Failed aggressive cleanup:', error);
            }
        }
        
        generateId() {
            if (typeof WBComponentUtils !== 'undefined' && WBComponentUtils.generateId) {
                return WBComponentUtils.generateId();
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
                            // Extract function name or file name
                            const match = line.match(/at\s+(?:(\w+)\s+\()?(?:.*\/)?([^\/\)]+)(?:\)|:(\d+))/);
                            if (match) {
                                const [, funcName, fileName, lineNum] = match;
                                if (funcName && funcName !== 'Object' && funcName !== 'HTMLDocument') {
                                    return `${funcName}()`;
                                } else if (fileName) {
                                    return lineNum ? `${fileName}:${lineNum}` : fileName;
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                // Fallback if stack trace fails
            }
            
            // Try to get current component or page context
            const activeElement = document.activeElement;
            if (activeElement && activeElement.tagName && activeElement.tagName.includes('-')) {
                return activeElement.tagName.toLowerCase();
            }
            
            return document.location?.pathname || 'unknown';
        }
        
        detectEventTarget(details) {
            // Determine what the event is targeting or affecting
            if (details.target) {
                if (typeof details.target === 'string') {
                    return details.target;
                } else if (details.target.tagName) {
                    const id = details.target.id ? `#${details.target.id}` : '';
                    const className = details.target.className ? `.${details.target.className.split(' ')[0]}` : '';
                    return `${details.target.tagName.toLowerCase()}${id}${className}`;
                }
            }
            
            if (details.element) {
                return details.element;
            }
            
            if (details.component) {
                return details.component;
            }
            
            if (details.api || details.endpoint) {
                return details.api || details.endpoint;
            }
            
            if (details.file || details.filename) {
                return details.file || details.filename;
            }
            
            // For user interactions, try to determine target
            if (details.source === 'user-interaction') {
                return details.element || 'user-interface';
            }
            
            // For console events, target is usually the console
            if (details.source === 'console') {
                return 'console';
            }
            
            // For errors, target might be the system or component
            if (details.error || details.stack) {
                return 'system';
            }
            
            return 'application';
        }
        
        getInteractionTarget(element) {
            // Get a more specific target description for user interactions
            if (!element) return 'unknown';
            
            const tagName = element.tagName.toLowerCase();
            const id = element.id ? `#${element.id}` : '';
            const className = element.className ? `.${element.className.split(' ')[0]}` : '';
            
            // Try to get component context
            let component = element.closest('[data-component]')?.getAttribute('data-component');
            
            // Check for wb- custom elements by traversing up the DOM
            if (!component) {
                let current = element;
                while (current && current !== document.body) {
                    if (current.tagName && current.tagName.toLowerCase().startsWith('wb-')) {
                        component = current.tagName.toLowerCase();
                        break;
                    }
                    current = current.parentElement;
                }
            }
            
            // Check for wb- classes
            if (!component) {
                component = element.closest('[class*="wb-"]')?.className.split(' ').find(c => c.startsWith('wb-'));
            }
            
            if (component) {
                return `${component}${id ? ` (${id})` : ''}`;
            }
            
            return `${tagName}${id}${className}`;
        }
        
        isEventVisible(event) {
            return this.filters.includes(event.type) && 
                   this.matchesSearchFilter(event);
        }
        
        matchesSearchFilter(event) {
            if (!this.searchFilter) return true;
            
            const searchTerm = this.searchFilter.toLowerCase();
            return event.message.toLowerCase().includes(searchTerm) ||
                   event.source.toLowerCase().includes(searchTerm) ||
                   event.type.toLowerCase().includes(searchTerm);
        }
        
        // Rendering
        render() {
            this.innerHTML = `
                <div class="wb-event-log-toolbar">
                    <div class="wb-event-log-title">Event Log</div>
                    <div class="wb-event-log-controls">
                        <input type="text" class="wb-event-log-search" placeholder="Search events...">
                        <button class="wb-event-log-btn wb-event-log-settings" title="Settings">⚙️</button>
                        <button class="wb-event-log-btn wb-event-log-clear" title="Clear">🗑️</button>
                        <button class="wb-event-log-btn wb-event-log-pause" title="Pause">${this.isPaused ? '▶️' : '⏸️'}</button>
                        <button class="wb-event-log-btn wb-event-log-copy" title="Copy All Events (JSON)">📋</button>
                        <button class="wb-event-log-btn wb-event-log-copy-text" title="Copy All Events (Text)">📄</button>
                        <button class="wb-event-log-btn wb-event-log-export" title="Export">📤</button>
                        <button class="wb-event-log-btn wb-event-log-hide" title="Hide Event Log">👁️‍🗨️</button>
                    </div>
                </div>
                
                <div class="wb-event-log-filters">
                    ${this.renderFilters()}
                </div>
                
                <div class="wb-event-log-content" data-wrap-mode="${this.wrapMode}">
                    <div class="wb-event-log-events">
                        ${this.renderEvents()}
                    </div>
                </div>
                
                <div class="wb-event-log-footer">
                    <span>Auto-scroll: ${this.autoScroll ? 'ON' : 'OFF'}</span>
                    <span>Events: ${this.getVisibleEvents().length}/${this.events.length}</span>
                </div>
            `;
            
            this.setupUIEventListeners();
        }
        
        renderFilters() {
            const eventTypes = componentConfig.eventTypes || {
                info: { icon: '📝', label: 'Info' },
                warning: { icon: '⚠️', label: 'Warning' },
                error: { icon: '❌', label: 'Error' },
                success: { icon: '✅', label: 'Success' },
                debug: { icon: '🐛', label: 'Debug' },
                user: { icon: '👤', label: 'User' }
            };
            
            return Object.entries(eventTypes).map(([type, config]) => {
                const isActive = this.filters.includes(type);
                return `
                    <button class="wb-event-log-filter ${isActive ? 'active' : ''}" 
                            data-type="${type}">
                        ${config.icon} ${config.label}
                    </button>
                `;
            }).join('');
        }
        
        renderEvents() {
            const visibleEvents = this.getVisibleEvents();
            return visibleEvents.map(event => this.renderEventHTML(event)).join('');
        }
        
        renderEventHTML(event) {
            const eventTypes = componentConfig.eventTypes || {};
            const typeConfig = eventTypes[event.type] || { icon: '📝' };
            const timestamp = this.formatTimestamp(event.timestamp);
            const message = this.formatMessage(event.message);
            const fromTo = this.formatFromTo(event);
            
            const fullFromTo = `${event.from || 'unknown'} ➜ ${event.to || 'unknown'}`;
            const expandedClass = event.expanded ? 'expanded' : '';
            
            return `
                <div class="wb-event-log-event ${expandedClass}" data-type="${event.type}" data-id="${event.id}">
                    <span class="wb-event-log-icon">${typeConfig.icon}</span>
                    <span class="wb-event-log-timestamp">${timestamp}</span>
                    <span class="wb-event-log-type">[${event.type.toUpperCase()}]</span>
                    <span class="wb-event-log-from-to" title="${fullFromTo}">${fromTo}</span>
                    <span class="wb-event-log-message" title="${event.message}">${message}</span>
                    <button class="wb-event-log-copy-single" data-event-id="${event.id}" title="Copy this event">📋</button>
                    ${event.expanded ? this.renderEventDetails(event) : ''}
                </div>
            `;
        }
        
        renderEvent(event) {
            const eventsContainer = this.querySelector('.wb-event-log-events');
            if (eventsContainer) {
                const eventHTML = this.renderEventHTML(event);
                // Insert at the top for newest-first display
                eventsContainer.insertAdjacentHTML('afterbegin', eventHTML);
                
                // Add click listener to the newly added event
                const newEvent = eventsContainer.firstElementChild;
                if (newEvent) {
                    newEvent.addEventListener('click', (e) => {
                        // Don't expand if clicking on copy button
                        if (!e.target.classList.contains('wb-event-log-copy-single')) {
                            this.toggleEventExpansion(event.id);
                        }
                    });
                    
                    // Add copy button listener
                    const copyBtn = newEvent.querySelector('.wb-event-log-copy-single');
                    if (copyBtn) {
                        copyBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.copySingleEvent(copyBtn.dataset.eventId);
                        });
                    }
                }
            }
        }
        
        renderEventDetails(event) {
            const details = event.details || {};
            const isNetworkError = details.source === 'fetch' || details.source === 'xhr';
            const isResourceError = details.source === 'resource-error' || details.source === 'image-error' || details.source === 'performance';
            const isNavigationEvent = details.source === 'navigation';
            const hasStackTrace = details.stackTrace;
            const hasCode = details.code;
            
            let detailsHTML = `
                <div class="wb-event-log-details">
                    <div><strong>Source:</strong> ${event.source}</div>
                    <div><strong>From:</strong> ${event.from}</div>
                    <div><strong>To:</strong> ${event.to}</div>
                    <div><strong>Timestamp:</strong> ${new Date(event.timestamp).toISOString()}</div>
            `;
            
            // Show network-specific details for HTTP errors
            if (isNetworkError) {
                if (details.status) {
                    detailsHTML += `<div><strong>Status:</strong> ${details.status} ${details.statusText || ''}</div>`;
                }
                if (details.method) {
                    detailsHTML += `<div><strong>Method:</strong> ${details.method}</div>`;
                }
                if (details.url) {
                    detailsHTML += `<div><strong>URL:</strong> <code>${details.url}</code></div>`;
                }
                if (details.duration) {
                    detailsHTML += `<div><strong>Duration:</strong> ${details.duration}ms</div>`;
                }
                if (details.requestHeaders && Object.keys(details.requestHeaders).length > 0) {
                    detailsHTML += `
                        <div><strong>Request Headers:</strong></div>
                        <pre class="wb-event-log-code">${JSON.stringify(details.requestHeaders, null, 2)}</pre>
                    `;
                }
                if (details.headers && Object.keys(details.headers).length > 0) {
                    detailsHTML += `
                        <div><strong>Response Headers:</strong></div>
                        <pre class="wb-event-log-code">${JSON.stringify(details.headers, null, 2)}</pre>
                    `;
                }
            }
            
            // Show resource error-specific details
            if (isResourceError) {
                if (details.resourceType) {
                    detailsHTML += `<div><strong>Resource Type:</strong> ${details.resourceType}</div>`;
                }
                if (details.url) {
                    detailsHTML += `<div><strong>Failed URL:</strong> <code>${details.url}</code></div>`;
                }
                if (details.element) {
                    detailsHTML += `
                        <div><strong>HTML Element:</strong></div>
                        <pre class="wb-event-log-code">${this.escapeHtml(details.element)}</pre>
                    `;
                }
                if (details.resourceDetails) {
                    detailsHTML += `
                        <div><strong>Resource Details:</strong></div>
                        <pre class="wb-event-log-code">${JSON.stringify(details.resourceDetails, null, 2)}</pre>
                    `;
                }
                if (details.imageDetails) {
                    detailsHTML += `
                        <div><strong>Image Details:</strong></div>
                        <pre class="wb-event-log-code">${JSON.stringify(details.imageDetails, null, 2)}</pre>
                    `;
                }
                if (details.performanceDetails) {
                    detailsHTML += `
                        <div><strong>Performance Details:</strong></div>
                        <pre class="wb-event-log-code">${JSON.stringify(details.performanceDetails, null, 2)}</pre>
                    `;
                }
            }
            
            // Show navigation-specific details
            if (isNavigationEvent) {
                if (details.type) {
                    detailsHTML += `<div><strong>Navigation Type:</strong> ${details.type}</div>`;
                }
                if (details.url) {
                    detailsHTML += `<div><strong>Current URL:</strong> <code>${details.url}</code></div>`;
                }
                if (details.previousUrl && details.previousUrl !== details.url) {
                    detailsHTML += `<div><strong>Previous URL:</strong> <code>${details.previousUrl}</code></div>`;
                }
                if (details.scrollPosition !== undefined) {
                    detailsHTML += `<div><strong>Scroll Position:</strong> Y=${details.scrollPosition}px</div>`;
                }
                if (details.previousScrollY !== undefined && details.scrollDelta !== undefined) {
                    detailsHTML += `<div><strong>Scroll Delta:</strong> ${details.scrollDelta}px (from Y=${details.previousScrollY})</div>`;
                }
                if (details.hash) {
                    detailsHTML += `<div><strong>Hash:</strong> <code>${details.hash}</code></div>`;
                }
                if (details.state) {
                    detailsHTML += `
                        <div><strong>History State:</strong></div>
                        <pre class="wb-event-log-code">${JSON.stringify(details.state, null, 2)}</pre>
                    `;
                }
                if (details.fullNavigation) {
                    detailsHTML += `
                        <div><strong>Full Navigation Details:</strong></div>
                        <pre class="wb-event-log-code">${JSON.stringify(details.fullNavigation, null, 2)}</pre>
                    `;
                }
            }
            
            // Show the triggering code
            if (hasCode) {
                detailsHTML += `
                    <div><strong>Code:</strong></div>
                    <pre class="wb-event-log-code">${this.escapeHtml(details.code)}</pre>
                `;
            }
            
            // Show stack trace with syntax highlighting
            if (hasStackTrace) {
                const formattedStack = this.formatStackTrace(details.stackTrace);
                detailsHTML += `
                    <div><strong>Stack Trace:</strong></div>
                    <pre class="wb-event-log-stack">${formattedStack}</pre>
                `;
            }
            
            // Show other details
            const otherDetails = { ...details };
            delete otherDetails.source;
            delete otherDetails.stackTrace;
            delete otherDetails.code;
            delete otherDetails.status;
            delete otherDetails.statusText;
            delete otherDetails.method;
            delete otherDetails.url;
            delete otherDetails.duration;
            delete otherDetails.headers;
            delete otherDetails.requestHeaders;
            delete otherDetails.from;
            delete otherDetails.to;
            delete otherDetails.resourceType;
            delete otherDetails.element;
            delete otherDetails.resourceDetails;
            delete otherDetails.imageDetails;
            delete otherDetails.performanceDetails;
            delete otherDetails.type;
            delete otherDetails.previousUrl;
            delete otherDetails.scrollPosition;
            delete otherDetails.previousScrollY;
            delete otherDetails.scrollDelta;
            delete otherDetails.hash;
            delete otherDetails.state;
            delete otherDetails.title;
            delete otherDetails.fullNavigation;
            
            if (Object.keys(otherDetails).length > 0) {
                detailsHTML += `
                    <div><strong>Additional Details:</strong></div>
                    <pre class="wb-event-log-code">${JSON.stringify(otherDetails, null, 2)}</pre>
                `;
            }
            
            detailsHTML += `</div>`;
            
            return detailsHTML;
        }
        
        formatStackTrace(stackTrace) {
            if (!stackTrace) return '';
            
            return stackTrace
                .split('\n')
                .map(line => {
                    line = this.escapeHtml(line.trim());
                    
                    // Highlight file names and line numbers
                    line = line.replace(
                        /(\w+\.js):(\d+):(\d+)/g, 
                        '<span class="wb-stack-file">$1</span>:<span class="wb-stack-line">$2</span>:<span class="wb-stack-col">$3</span>'
                    );
                    
                    // Highlight function names
                    line = line.replace(
                        /at ([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
                        'at <span class="wb-stack-function">$1</span>'
                    );
                    
                    return line;
                })
                .join('\n');
        }
        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', { hour12: false });
        }
        
        formatMessage(message) {
            if (this.wrapMode === 'wrap') {
                return message;
            } else {
                return message.length > this.wrapLength ? 
                       message.substring(0, this.wrapLength) + '...' : 
                       message;
            }
        }
        
        formatFromTo(event) {
            const from = event.from || 'unknown';
            const to = event.to || 'unknown';
            
            // Increase max length for better visibility
            const maxLength = 25;
            const fromDisplay = from.length > maxLength ? from.substring(0, maxLength) + '...' : from;
            const toDisplay = to.length > maxLength ? to.substring(0, maxLength) + '...' : to;
            
            // Use a more visible arrow
            return `${fromDisplay} ➜ ${toDisplay}`;
        }
        
        getVisibleEvents() {
            return this.events.filter(event => this.isEventVisible(event));
        }
        
        setupUIEventListeners() {
            // Search functionality
            const searchInput = this.querySelector('.wb-event-log-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.searchFilter = e.target.value;
                    this.refreshEvents();
                });
            }
            
            // Control buttons
            const clearBtn = this.querySelector('.wb-event-log-clear');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearEvents());
            }
            
            const pauseBtn = this.querySelector('.wb-event-log-pause');
            if (pauseBtn) {
                pauseBtn.addEventListener('click', () => this.togglePause());
            }
            
            const copyBtn = this.querySelector('.wb-event-log-copy');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => this.copyEventsAsJSON());
            }
            
            const copyTextBtn = this.querySelector('.wb-event-log-copy-text');
            if (copyTextBtn) {
                copyTextBtn.addEventListener('click', () => this.copyEventsAsText());
            }
            
            const exportBtn = this.querySelector('.wb-event-log-export');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => this.exportEvents());
            }
            
            const hideBtn = this.querySelector('.wb-event-log-hide');
            if (hideBtn) {
                hideBtn.addEventListener('click', () => this.hideComponent());
            }
            
            // Filter buttons
            const filterButtons = this.querySelectorAll('.wb-event-log-filter');
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => this.toggleFilter(btn.dataset.type));
            });
            
            // Event expansion
            const eventElements = this.querySelectorAll('.wb-event-log-event');
            eventElements.forEach(el => {
                el.addEventListener('click', (e) => {
                    // Don't expand if clicking on copy button
                    if (!e.target.classList.contains('wb-event-log-copy-single')) {
                        this.toggleEventExpansion(el.dataset.id);
                    }
                });
            });
            
            // Individual event copy buttons
            const copySingleButtons = this.querySelectorAll('.wb-event-log-copy-single');
            copySingleButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event expansion
                    this.copySingleEvent(btn.dataset.eventId);
                });
            });
        }
        
        // Public API methods
        clearEvents() {
            this.events = [];
            this.refreshEvents();
            this.dispatchEvent(new CustomEvent('wb-events-cleared', { bubbles: true }));
        }
        
        pauseLogging() {
            this.isPaused = true;
            const pauseBtn = this.querySelector('.wb-event-log-pause');
            if (pauseBtn) pauseBtn.textContent = '▶️';
        }
        
        resumeLogging() {
            this.isPaused = false;
            const pauseBtn = this.querySelector('.wb-event-log-pause');
            if (pauseBtn) pauseBtn.textContent = '⏸️';
        }
        
        togglePause() {
            if (this.isPaused) {
                this.resumeLogging();
            } else {
                this.pauseLogging();
            }
        }
        
        setFilter(eventTypes) {
            this.filters = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
            this.refreshEvents();
            this.dispatchEvent(new CustomEvent('wb-filter-changed', { 
                detail: { filters: this.filters },
                bubbles: true 
            }));
        }
        
        toggleFilter(eventType) {
            if (this.filters.includes(eventType)) {
                this.filters = this.filters.filter(type => type !== eventType);
            } else {
                this.filters.push(eventType);
            }
            this.refreshEvents();
            this.dispatchEvent(new CustomEvent('wb-filter-changed', { 
                detail: { filters: this.filters },
                bubbles: true 
            }));
        }
        
        setSearchFilter(searchTerm) {
            this.searchFilter = searchTerm;
            const searchInput = this.querySelector('.wb-event-log-search');
            if (searchInput) searchInput.value = searchTerm;
            this.refreshEvents();
        }
        
        setMaxEvents(maxEvents) {
            this.maxEvents = maxEvents;
            while (this.events.length > this.maxEvents) {
                this.events.shift();
            }
            this.refreshEvents();
        }
        
        setAutoScroll(enabled) {
            this.autoScroll = enabled;
            const footer = this.querySelector('.wb-event-log-footer');
            if (footer) {
                footer.innerHTML = `
                    <span>Auto-scroll: ${this.autoScroll ? 'ON' : 'OFF'}</span>
                    <span>Events: ${this.getVisibleEvents().length}/${this.events.length}</span>
                `;
            }
        }
        
        setWrapMode(mode) {
            this.wrapMode = mode;
            const content = this.querySelector('.wb-event-log-content');
            if (content) {
                content.setAttribute('data-wrap-mode', mode);
            }
            this.refreshEvents();
        }
        
        hideComponent() {
            this.style.display = 'none';
            this.dispatchEvent(new CustomEvent('wb-event-log-hidden', { 
                bubbles: true,
                detail: { component: 'wb-event-log' }
            }));
            this.logInfo('Event Log hidden by user', { source: 'wb-event-log', action: 'hide' });
        }
        
        copyEventsAsJSON() {
            const visibleEvents = this.getVisibleEvents();
            const jsonContent = JSON.stringify(visibleEvents, null, 2);
            
            // Copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(jsonContent)
                    .then(() => {
                        // Show success feedback
                        this.showCopyFeedback(true);
                        this.logSuccess('Event log JSON copied to clipboard', { 
                            source: 'wb-event-log',
                            eventCount: visibleEvents.length
                        });
                    })
                    .catch(err => {
                        // Fallback to older method
                        this.fallbackCopyToClipboard(jsonContent);
                    });
            } else {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(jsonContent);
            }
        }
        
        copyEventsAsText() {
            const visibleEvents = this.getVisibleEvents();
            const textContent = this.eventsToText(visibleEvents);
            
            // Copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textContent)
                    .then(() => {
                        // Show success feedback
                        this.showCopyFeedback(true, this.querySelector('.wb-event-log-copy-text'));
                        this.logSuccess('Event log text copied to clipboard', { 
                            source: 'wb-event-log',
                            eventCount: visibleEvents.length
                        });
                    })
                    .catch(err => {
                        // Fallback to older method
                        this.fallbackCopyToClipboard(textContent, this.querySelector('.wb-event-log-copy-text'));
                    });
            } else {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(textContent, this.querySelector('.wb-event-log-copy-text'));
            }
        }
        
        fallbackCopyToClipboard(text, button = null) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showCopyFeedback(true, button);
                this.logSuccess('Event log copied to clipboard (fallback)', { 
                    source: 'wb-event-log'
                });
            } catch (err) {
                this.showCopyFeedback(false, button);
                this.logError('Failed to copy to clipboard', { 
                    source: 'wb-event-log',
                    error: err.message
                });
            }
            
            document.body.removeChild(textArea);
        }
        
        showCopyFeedback(success, button = null) {
            const copyBtn = button || this.querySelector('.wb-event-log-copy');
            if (copyBtn) {
                const originalContent = copyBtn.innerHTML;
                const originalTitle = copyBtn.title;
                
                if (success) {
                    copyBtn.innerHTML = '✅';
                    copyBtn.title = 'Copied!';
                    copyBtn.classList.add('success');
                } else {
                    copyBtn.innerHTML = '❌';
                    copyBtn.title = 'Copy failed';
                    copyBtn.classList.add('error');
                }
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyBtn.innerHTML = originalContent;
                    copyBtn.title = originalTitle;
                    copyBtn.classList.remove('success', 'error');
                }, 2000);
            }
        }
        
        copySingleEvent(eventId) {
            const event = this.events.find(e => e.id === eventId);
            if (!event) return;
            
            // Create a readable text format for the event
            const timestamp = new Date(event.timestamp).toISOString();
            const eventText = `[${timestamp}] [${event.type.toUpperCase()}] ${event.from || 'unknown'} ➜ ${event.to || 'unknown'}
${event.message}`;
            
            const copyButton = this.querySelector(`[data-event-id="${eventId}"]`);
            
            // Copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(eventText)
                    .then(() => {
                        this.showCopyFeedback(true, copyButton);
                        this.logSuccess('Event copied to clipboard', { 
                            source: 'wb-event-log',
                            eventId: eventId,
                            eventType: event.type
                        });
                    })
                    .catch(err => {
                        this.fallbackCopySingleEvent(eventText, copyButton);
                    });
            } else {
                this.fallbackCopySingleEvent(eventText, copyButton);
            }
        }
        
        fallbackCopySingleEvent(text, button) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showCopyFeedback(true, button);
                this.logSuccess('Event copied to clipboard (fallback)', { 
                    source: 'wb-event-log'
                });
            } catch (err) {
                this.showCopyFeedback(false, button);
                this.logError('Failed to copy event to clipboard', { 
                    source: 'wb-event-log',
                    error: err.message
                });
            }
            
            document.body.removeChild(textArea);
        }
        
        exportEvents(format = 'json') {
            const visibleEvents = this.getVisibleEvents();
            let content = '';
            let filename = '';
            let mimeType = '';
            
            switch (format) {
                case 'json':
                    content = JSON.stringify(visibleEvents, null, 2);
                    filename = `wb-events-${Date.now()}.json`;
                    mimeType = 'application/json';
                    break;
                case 'csv':
                    content = this.eventsToCSV(visibleEvents);
                    filename = `wb-events-${Date.now()}.csv`;
                    mimeType = 'text/csv';
                    break;
                case 'txt':
                    content = this.eventsToText(visibleEvents);
                    filename = `wb-events-${Date.now()}.txt`;
                    mimeType = 'text/plain';
                    break;
            }
            
            this.downloadFile(content, filename, mimeType);
        }
        
        eventsToCSV(events) {
            const headers = ['Timestamp', 'Type', 'Message', 'Source'];
            const rows = events.map(event => [
                new Date(event.timestamp).toISOString(),
                event.type,
                `"${event.message.replace(/"/g, '""')}"`,
                event.source
            ]);
            
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        
        eventsToText(events) {
            return events.map(event => {
                const timestamp = new Date(event.timestamp).toISOString();
                return `[${timestamp}] [${event.type.toUpperCase()}] ${event.message}`;
            }).join('\n');
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
        
        toggleEventExpansion(eventId) {
            const event = this.events.find(e => e.id === eventId);
            if (event) {
                event.expanded = !event.expanded;
                
                // Update the specific event element instead of refreshing all
                const eventElement = this.querySelector(`[data-id="${eventId}"]`);
                if (eventElement) {
                    // Remove any existing details first to avoid duplicates
                    const existingDetails = eventElement.querySelector('.wb-event-log-details');
                    if (existingDetails) {
                        existingDetails.remove();
                    }
                    
                    if (event.expanded) {
                        // Add expanded class and details
                        eventElement.classList.add('expanded');
                        const detailsHTML = this.renderEventDetails(event);
                        eventElement.insertAdjacentHTML('beforeend', detailsHTML);
                    } else {
                        // Remove expanded class
                        eventElement.classList.remove('expanded');
                    }
                }
            }
        }
        
        scrollToTop() {
            const content = this.querySelector('.wb-event-log-content');
            if (content) {
                content.scrollTop = 0;
            }
        }
        
        scrollToBottom() {
            const content = this.querySelector('.wb-event-log-content');
            if (content) {
                content.scrollTop = content.scrollHeight;
            }
        }
        
        refreshEvents() {
            const eventsContainer = this.querySelector('.wb-event-log-events');
            const filtersContainer = this.querySelector('.wb-event-log-filters');
            const footer = this.querySelector('.wb-event-log-footer');
            
            if (eventsContainer) {
                eventsContainer.innerHTML = this.renderEvents();
                this.setupEventExpansionListeners();
            }
            
            if (filtersContainer) {
                filtersContainer.innerHTML = this.renderFilters();
                this.setupFilterListeners();
            }
            
            if (footer) {
                footer.innerHTML = `
                    <span>Auto-scroll: ${this.autoScroll ? 'ON' : 'OFF'}</span>
                    <span>Events: ${this.getVisibleEvents().length}/${this.events.length}</span>
                `;
            }
            
            if (this.autoScroll) {
                this.scrollToTop();
            }
        }
        
        setupEventExpansionListeners() {
            const eventElements = this.querySelectorAll('.wb-event-log-event');
            eventElements.forEach(el => {
                el.addEventListener('click', (e) => {
                    // Don't expand if clicking on copy button
                    if (!e.target.classList.contains('wb-event-log-copy-single')) {
                        this.toggleEventExpansion(el.dataset.id);
                    }
                });
            });
            
            // Setup copy button listeners
            const copySingleButtons = this.querySelectorAll('.wb-event-log-copy-single');
            copySingleButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event expansion
                    this.copySingleEvent(btn.dataset.eventId);
                });
            });
        }
        
        setupFilterListeners() {
            const filterButtons = this.querySelectorAll('.wb-event-log-filter');
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => this.toggleFilter(btn.dataset.type));
            });
        }
        
        // Static helper methods
        static logInfo(message, details = {}) {
            document.dispatchEvent(new CustomEvent('wb:info', { 
                detail: { message, ...details } 
            }));
        }
        
        static logWarning(message, details = {}) {
            document.dispatchEvent(new CustomEvent('wb:warning', { 
                detail: { message, ...details } 
            }));
        }
        
        static logError(message, details = {}) {
            document.dispatchEvent(new CustomEvent('wb:error', { 
                detail: { message, ...details } 
            }));
        }
        
        static logSuccess(message, details = {}) {
            document.dispatchEvent(new CustomEvent('wb:success', { 
                detail: { message, ...details } 
            }));
        }
        
        static logDebug(message, details = {}) {
            document.dispatchEvent(new CustomEvent('wb:debug', { 
                detail: { message, ...details } 
            }));
        }
        
        static logUser(message, details = {}) {
            document.dispatchEvent(new CustomEvent('wb:user', { 
                detail: { message, ...details } 
            }));
        }
        
        // Public API methods for logging
        logInfo(message, details = {}) {
            this.addEvent('info', message, details);
        }
        
        logWarning(message, details = {}) {
            this.addEvent('warning', message, details);
        }
        
        logError(message, details = {}) {
            this.addEvent('error', message, details);
        }
        
        logSuccess(message, details = {}) {
            this.addEvent('success', message, details);
        }
        
        logDebug(message, details = {}) {
            this.addEvent('debug', message, details);
        }
        
        logUser(message, details = {}) {
            this.addEvent('user', message, details);
        }
    }
    
    // Register the custom element
    if (!customElements.get('wb-event-log')) {
        customElements.define('wb-event-log', WBEventLog);
        console.log('🔧 WB Event Log: Component registered');
    }
    
    // Make static methods globally available
    window.WBEventLog = WBEventLog;
    
})();