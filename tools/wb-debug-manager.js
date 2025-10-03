/**
 * WB Debug Manager - Dynamic Plugin System
 * 
 * A runtime injectable debugging system that can add error logging, 
 * component inspection, and debugging tools to any WB component page.
 * 
 * @usage
 * // Inject via query parameter: ?debug=true
 * // Inject via console: WB.debug.enable()
 * // Inject via hotkey: Ctrl+Shift+D
 * // Inject via bookmarklet: javascript:WB.debug.inject()
 * 
 * @features
 * - Dynamic wb-log-error injection
 * - Component discovery and inspection
 * - Real-time debugging controls
 * - Export debug data
 * - Performance monitoring
 * - Event stream monitoring
 * 
 * @version 1.0.0
 * @author Website Builder Team
 */

(function() {
    'use strict';

    console.log('🔧 WB Debug Manager: Initializing...');

    // Global WB namespace
    if (!window.WB) {
        window.WB = {};
    }

    // Debug Manager Class
    class WBDebugManager {
        constructor() {
            this.isActive = false;
            this.plugins = new Map();
            this.components = new Map();
            this.events = [];
            this.performance = [];
            this.ui = null;
            
            // Plugin registry
            this.availablePlugins = {
                'error-log': {
                    name: 'Error Logger',
                    description: 'Runtime error capture and logging',
                    component: 'wb-log-error',
                    autoLoad: true
                },
                'component-inspector': {
                    name: 'Component Inspector',
                    description: 'Live component state inspection',
                    component: 'wb-inspector',
                    autoLoad: false
                },
                'event-monitor': {
                    name: 'Event Monitor',
                    description: 'Real-time event stream monitoring',
                    component: 'wb-event-monitor',
                    autoLoad: false
                },
                'performance-tracker': {
                    name: 'Performance Tracker',
                    description: 'Component performance monitoring',
                    component: 'wb-perf-tracker',
                    autoLoad: false
                }
            };

            this.bindMethods();
            this.setupAutoInjection();
        }

        bindMethods() {
            this.enable = this.enable.bind(this);
            this.disable = this.disable.bind(this);
            this.toggle = this.toggle.bind(this);
            this.inject = this.inject.bind(this);
            this.handleKeyboard = this.handleKeyboard.bind(this);
        }

        setupAutoInjection() {
            // Check query parameters
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('debug') === 'true' || urlParams.get('wb-debug') === 'true') {
                this.enable();
            }

            // Setup keyboard shortcut (Ctrl+Shift+D)
            document.addEventListener('keydown', this.handleKeyboard);

            // Check for localStorage setting
            if (localStorage.getItem('wb-debug-enabled') === 'true') {
                this.enable();
            }
        }

        handleKeyboard(event) {
            // Ctrl+Shift+D to toggle debug mode
            if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                this.toggle();
            }
        }

        async enable() {
            if (this.isActive) {
                console.log('🔧 WB Debug Manager: Already active');
                return;
            }

            console.log('🔧 WB Debug Manager: Enabling debug mode...');
            this.isActive = true;
            
            // Store preference
            localStorage.setItem('wb-debug-enabled', 'true');
            
            // Discover existing components
            this.discoverComponents();
            
            // Load default plugins
            await this.loadDefaultPlugins();
            
            // Create debug UI
            this.createDebugUI();
            
            // Start monitoring
            this.startMonitoring();
            
            console.log('🔧 WB Debug Manager: Debug mode enabled');
            
            // Dispatch global event
            document.dispatchEvent(new CustomEvent('wb:debug:enabled', {
                detail: { manager: this }
            }));
        }

        disable() {
            if (!this.isActive) {
                console.log('🔧 WB Debug Manager: Already inactive');
                return;
            }

            console.log('🔧 WB Debug Manager: Disabling debug mode...');
            this.isActive = false;
            
            // Remove preference
            localStorage.removeItem('wb-debug-enabled');
            
            // Unload plugins
            this.unloadAllPlugins();
            
            // Remove debug UI
            this.removeDebugUI();
            
            // Stop monitoring
            this.stopMonitoring();
            
            console.log('🔧 WB Debug Manager: Debug mode disabled');
            
            // Dispatch global event
            document.dispatchEvent(new CustomEvent('wb:debug:disabled'));
        }

        toggle() {
            if (this.isActive) {
                this.disable();
            } else {
                this.enable();
            }
        }

        // Alias for bookmarklet/external injection
        inject() {
            this.enable();
        }

        discoverComponents() {
            console.log('🔧 WB Debug Manager: Discovering components...');
            
            // Find all WB components
            const wbElements = document.querySelectorAll('[data-component^="wb-"], [class*="wb-"], wb-*');
            
            wbElements.forEach(element => {
                const componentName = element.tagName.toLowerCase() || 
                                    element.dataset.component || 
                                    Array.from(element.classList).find(cls => cls.startsWith('wb-'));
                
                if (componentName) {
                    this.components.set(componentName, {
                        element,
                        type: this.getComponentType(element),
                        initialized: this.isComponentInitialized(element),
                        events: [],
                        performance: {}
                    });
                }
            });

            console.log(`🔧 WB Debug Manager: Found ${this.components.size} components:`, 
                       Array.from(this.components.keys()));
        }

        getComponentType(element) {
            if (element.tagName.startsWith('WB-')) return 'web-component';
            if (element.dataset.component) return 'data-component';
            if (element.classList.toString().includes('wb-')) return 'css-component';
            return 'unknown';
        }

        isComponentInitialized(element) {
            // Check various initialization indicators
            return element.dataset.initialized === 'true' || 
                   element.classList.contains('initialized') ||
                   (element.connectedCallback !== undefined);
        }

        async loadDefaultPlugins() {
            // Load error logger by default
            await this.loadPlugin('error-log');
        }

        async loadPlugin(pluginId) {
            const plugin = this.availablePlugins[pluginId];
            if (!plugin) {
                console.warn(`🔧 WB Debug Manager: Unknown plugin: ${pluginId}`);
                return false;
            }

            if (this.plugins.has(pluginId)) {
                console.log(`🔧 WB Debug Manager: Plugin already loaded: ${pluginId}`);
                return true;
            }

            console.log(`🔧 WB Debug Manager: Loading plugin: ${plugin.name}`);

            try {
                switch (pluginId) {
                    case 'error-log':
                        await this.loadErrorLogger();
                        break;
                    case 'component-inspector':
                        await this.loadComponentInspector();
                        break;
                    case 'event-monitor':
                        await this.loadEventMonitor();
                        break;
                    case 'performance-tracker':
                        await this.loadPerformanceTracker();
                        break;
                    default:
                        throw new Error(`Unknown plugin: ${pluginId}`);
                }

                this.plugins.set(pluginId, {
                    ...plugin,
                    loaded: true,
                    loadedAt: Date.now()
                });

                console.log(`🔧 WB Debug Manager: Plugin loaded successfully: ${plugin.name}`);
                return true;

            } catch (error) {
                console.error(`🔧 WB Debug Manager: Failed to load plugin ${plugin.name}:`, error);
                return false;
            }
        }

        async loadErrorLogger() {
            // Dynamically inject wb-log-error component
            const scriptPath = this.resolveComponentPath('wb-log-error', 'wb-log-error-webcomponent.js');
            
            // Load the script
            await this.loadScript(scriptPath);
            
            // Create and append the component
            const errorLogger = document.createElement('wb-log-error');
            errorLogger.setAttribute('position', 'bottom-right');
            errorLogger.setAttribute('visible', 'false'); // Start hidden
            errorLogger.setAttribute('enable-export', 'true');
            errorLogger.setAttribute('enable-clear', 'true');
            errorLogger.setAttribute('enable-toggle', 'true');
            errorLogger.setAttribute('max-entries', '100');
            errorLogger.id = 'wb-debug-error-logger';
            
            document.body.appendChild(errorLogger);

            // Auto-show on first error
            document.addEventListener('wb-log-error:new', () => {
                errorLogger.setAttribute('visible', 'true');
            }, { once: true });

            return errorLogger;
        }

        async loadComponentInspector() {
            // Create a simple component inspector UI
            const inspector = document.createElement('div');
            inspector.id = 'wb-debug-inspector';
            inspector.innerHTML = `
                <div style="position: fixed; top: 10px; right: 10px; width: 300px; max-height: 400px; 
                           background: rgba(0,0,0,0.9); color: white; padding: 15px; border-radius: 8px;
                           font-family: monospace; font-size: 12px; z-index: 10001; overflow-y: auto;">
                    <h3 style="margin: 0 0 10px 0;">🔍 Component Inspector</h3>
                    <div id="wb-inspector-content"></div>
                    <button onclick="this.parentElement.remove()" style="float: right; margin-top: 10px;">Close</button>
                </div>
            `;
            
            document.body.appendChild(inspector);
            
            // Populate with component data
            this.updateInspector();
            
            return inspector;
        }

        async loadEventMonitor() {
            // Create event monitor that logs all WB events
            const eventMonitor = {
                events: [],
                start: () => {
                    // Listen for all wb: events
                    document.addEventListener('wb:', (event) => {
                        this.events.push({
                            type: event.type,
                            timestamp: Date.now(),
                            detail: event.detail,
                            target: event.target?.tagName || 'document'
                        });
                    });
                }
            };
            
            eventMonitor.start();
            return eventMonitor;
        }

        async loadPerformanceTracker() {
            // Create performance tracker
            const perfTracker = {
                start: () => {
                    // Track component load times
                    const observer = new PerformanceObserver((list) => {
                        list.getEntries().forEach(entry => {
                            if (entry.name.includes('wb-')) {
                                this.performance.push({
                                    name: entry.name,
                                    duration: entry.duration,
                                    timestamp: entry.startTime
                                });
                            }
                        });
                    });
                    observer.observe({ entryTypes: ['measure', 'navigation'] });
                }
            };
            
            perfTracker.start();
            return perfTracker;
        }

        resolveComponentPath(componentName, filename) {
            // Try to resolve component path intelligently
            const possiblePaths = [
                `./components/${componentName}/${filename}`,
                `../components/${componentName}/${filename}`,
                `../../components/${componentName}/${filename}`,
                `./${filename}`,
                filename
            ];

            // For now, return the most likely path
            // In a real implementation, we could test these paths
            return `../../components/${componentName}/${filename}`;
        }

        async loadScript(src) {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
                document.head.appendChild(script);
            });
        }

        createDebugUI() {
            // Create a minimal debug UI
            this.ui = document.createElement('div');
            this.ui.id = 'wb-debug-ui';
            this.ui.innerHTML = `
                <div style="position: fixed; bottom: 10px; left: 10px; 
                           background: rgba(0,0,0,0.8); color: white; 
                           padding: 10px; border-radius: 5px; font-family: monospace; 
                           font-size: 11px; z-index: 10000; max-width: 200px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span>🔧 WB Debug</span>
                        <button onclick="WB.debug.disable()" style="background: #ff4444; color: white; border: none; 
                               padding: 2px 6px; border-radius: 3px; cursor: pointer;">×</button>
                    </div>
                    <div style="margin-top: 5px; font-size: 10px;">
                        Components: ${this.components.size}<br>
                        Plugins: ${this.plugins.size}<br>
                        <span style="color: #4CAF50;">Ctrl+Shift+D to toggle</span>
                    </div>
                </div>
            `;
            
            document.body.appendChild(this.ui);
        }

        removeDebugUI() {
            if (this.ui) {
                this.ui.remove();
                this.ui = null;
            }
        }

        updateInspector() {
            const content = document.getElementById('wb-inspector-content');
            if (!content) return;

            let html = '';
            this.components.forEach((component, name) => {
                html += `
                    <div style="margin-bottom: 8px; padding: 5px; background: rgba(255,255,255,0.1);">
                        <strong>${name}</strong> (${component.type})<br>
                        <small>Initialized: ${component.initialized ? '✅' : '❌'}</small>
                    </div>
                `;
            });

            content.innerHTML = html;
        }

        startMonitoring() {
            // Monitor for new components being added
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.checkForNewComponents(node);
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            this.mutationObserver = observer;
        }

        stopMonitoring() {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
            }
        }

        checkForNewComponents(element) {
            if (element.tagName && element.tagName.startsWith('WB-') || 
                element.dataset?.component?.startsWith('wb-') ||
                Array.from(element.classList || []).some(cls => cls.startsWith('wb-'))) {
                
                console.log('🔧 WB Debug Manager: New component detected:', element);
                this.discoverComponents(); // Re-scan
            }
        }

        unloadAllPlugins() {
            // Remove injected components
            document.getElementById('wb-debug-error-logger')?.remove();
            document.getElementById('wb-debug-inspector')?.remove();
            
            this.plugins.clear();
        }

        // Public API methods
        getStats() {
            return {
                active: this.isActive,
                components: this.components.size,
                plugins: this.plugins.size,
                events: this.events.length,
                performance: this.performance.length
            };
        }

        exportDebugData() {
            const data = {
                timestamp: new Date().toISOString(),
                stats: this.getStats(),
                components: Array.from(this.components.entries()),
                events: this.events,
                performance: this.performance,
                plugins: Array.from(this.plugins.entries())
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wb-debug-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    // Create global debug manager instance
    const debugManager = new WBDebugManager();

    // Expose on WB namespace
    window.WB.debug = debugManager;

    // Also expose convenient global methods
    window.WBDebug = {
        enable: () => debugManager.enable(),
        disable: () => debugManager.disable(),
        toggle: () => debugManager.toggle(),
        inject: () => debugManager.inject(),
        stats: () => debugManager.getStats(),
        export: () => debugManager.exportDebugData()
    };

    console.log('🔧 WB Debug Manager: Ready! Use WB.debug.enable() or Ctrl+Shift+D');

})();