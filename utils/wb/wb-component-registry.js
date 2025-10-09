/**
 * WB Component Registry - Component Orchestration System
 * Manages component lifecycle, dependencies, and health monitoring
 * 
 * @version 1.0.0
 * @author Website Builder Components
 */

(function() {
    'use strict';
    
    console.log('WB Component Registry: Initializing...');
    
    /**
     * Component Registry with lifecycle management
     */
    class WBComponentRegistry {
        constructor() {
            this.components = new Map();
            this.loadingPromises = new Map();
            this.healthChecks = new Map();
            this.eventLog = [];
            this.startTime = Date.now();
            
            // Set up health monitoring
            this.setupHealthMonitoring();
        }
        
        /**
         * Register a component with dependencies
         * @param {string} name - Component name
         * @param {Function} componentClass - Component class
         * @param {Array} dependencies - Array of dependency names
         * @param {Object} metadata - Component metadata
         * @returns {Promise} Component loading promise
         */
        async register(name, componentClass, dependencies = [], metadata = {}) {
            this.log('info', `Registering component: ${name}`, { dependencies, metadata });
            
            try {
                // Check if already registered
                if (this.components.has(name)) {
                    this.log('warning', `Component ${name} already registered`);
                    return this.components.get(name);
                }
                
                // Create loading promise
                const loadingPromise = this.loadWithDependencies(name, componentClass, dependencies, metadata);
                this.loadingPromises.set(name, loadingPromise);
                
                return await loadingPromise;
            } catch (error) {
                this.log('error', `Failed to register component ${name}`, { error: error.message });
                throw error;
            }
        }
        
        /**
         * Load component with dependency resolution
         */
        async loadWithDependencies(name, componentClass, dependencies, metadata) {
            const startTime = Date.now();
            
            try {
                // Wait for all dependencies first
                if (dependencies.length > 0) {
                    this.log('info', `Waiting for dependencies: ${dependencies.join(', ')}`, { component: name });
                    await Promise.all(dependencies.map(dep => this.waitForComponent(dep)));
                }
                
                // Create component instance
                const instance = {
                    name,
                    class: componentClass,
                    status: 'loaded',
                    loadedAt: Date.now(),
                    loadTime: Date.now() - startTime,
                    dependencies,
                    metadata,
                    health: 'healthy'
                };
                
                // Register custom element if it's a web component
                if (componentClass && componentClass.prototype instanceof HTMLElement) {
                    if (!customElements.get(name)) {
                        customElements.define(name, componentClass);
                        this.log('info', `Custom element ${name} defined`);
                    }
                }
                
                this.components.set(name, instance);
                this.log('success', `Component ${name} loaded successfully`, { 
                    loadTime: instance.loadTime 
                });
                
                // Dispatch loaded event
                this.dispatchEvent('componentLoaded', { name, instance });
                
                return instance;
                
            } catch (error) {
                const failedInstance = {
                    name,
                    status: 'failed',
                    loadedAt: Date.now(),
                    loadTime: Date.now() - startTime,
                    dependencies,
                    metadata,
                    error: error.message,
                    health: 'failed'
                };
                
                this.components.set(name, failedInstance);
                this.log('error', `Component ${name} failed to load`, { error: error.message });
                
                throw error;
            }
        }
        
        /**
         * Wait for a component to be loaded
         * @param {string} name - Component name
         * @param {number} timeout - Timeout in milliseconds
         * @returns {Promise} Component instance
         */
        waitForComponent(name, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error(`Timeout waiting for component: ${name}`));
                }, timeout);
                
                const checkComponent = () => {
                    const component = this.components.get(name);
                    
                    if (component && component.status === 'loaded') {
                        clearTimeout(timeoutId);
                        resolve(component);
                    } else if (component && component.status === 'failed') {
                        clearTimeout(timeoutId);
                        reject(new Error(`Component ${name} failed to load: ${component.error}`));
                    } else {
                        // Check again in 50ms
                        setTimeout(checkComponent, 50);
                    }
                };
                
                checkComponent();
            });
        }
        
        /**
         * Load a component dynamically
         * @param {string} name - Component name (e.g., 'wb-color-bar')
         * @param {number} timeout - Timeout in milliseconds
         * @returns {Promise} Component loading promise
         */
        async loadComponent(name, timeout = 10000) {
            // Check if already loaded
            if (this.isLoaded(name)) {
                console.log(`✅ Component ${name} already loaded`);
                return this.components.get(name);
            }
            
            // Check if currently loading
            if (this.loadingPromises.has(name)) {
                console.log(`🔄 Component ${name} already loading, waiting...`);
                return this.loadingPromises.get(name);
            }
            
            // Start loading process
            const loadingPromise = this.performComponentLoad(name, timeout);
            this.loadingPromises.set(name, loadingPromise);
            
            try {
                const result = await loadingPromise;
                this.loadingPromises.delete(name);
                return result;
            } catch (error) {
                this.loadingPromises.delete(name);
                throw error;
            }
        }
        
        /**
         * Perform the actual component loading
         * @private
         */
        async performComponentLoad(name, timeout) {
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error(`Timeout loading component: ${name}`));
                }, timeout);
                
                // Create script element
                const script = document.createElement('script');
                
                // Use WBComponentUtils for path resolution if available
                let scriptPath;
                if (window.WBComponentUtils?.resolve) {
                    const symbolKey = name.replace('wb-', 'wb.') + '.js';
                    scriptPath = window.WBComponentUtils.resolve(symbolKey);
                } else {
                    // Fallback to constructed path
                    scriptPath = `/components/${name}/${name}.js`;
                }
                
                script.src = scriptPath;
                this.log('info', `Loading component ${name} from ${scriptPath}`);
                
                script.onload = () => {
                    clearTimeout(timeoutId);
                    
                    // Wait for component to register itself
                    this.waitForComponent(name, 3000).then(component => {
                        this.log('success', `Component ${name} loaded and registered`);
                        resolve(component);
                    }).catch(error => {
                        this.log('error', `Component ${name} loaded but failed to register: ${error.message}`);
                        reject(error);
                    });
                };
                
                script.onerror = () => {
                    clearTimeout(timeoutId);
                    const error = new Error(`Failed to load component script: ${name} from ${scriptPath}`);
                    this.log('error', error.message);
                    reject(error);
                };
                
                document.head.appendChild(script);
            });
        }
        
        /**
         * Check if component is loaded
         */
        isLoaded(name) {
            const component = this.components.get(name);
            return component && component.status === 'loaded';
        }
        
        /**
         * Check if component is healthy
         */
        isHealthy(name) {
            const component = this.components.get(name);
            return component && component.health === 'healthy';
        }
        
        /**
         * Get component status
         */
        getStatus(name) {
            const component = this.components.get(name);
            return component ? component.status : 'not-registered';
        }
        
        /**
         * Get component dependencies
         * @param {string} name - Component name
         * @returns {Array} Array of dependency names
         */
        getDependencies(name) {
            const component = this.components.get(name);
            return component?.dependencies || [];
        }
        
        /**
         * Get all components
         */
        getAllComponents() {
            return Array.from(this.components.values());
        }
        
        /**
         * Get all registered component names
         */
        getComponentNames() {
            return Array.from(this.components.keys());
        }
        
        /**
         * Check if component has dependencies that need to be loaded
         * @param {string} name - Component name
         * @returns {Array} Array of unloaded dependency names
         */
        getUnloadedDependencies(name) {
            const dependencies = this.getDependencies(name);
            return dependencies.filter(dep => !customElements.get(dep));
        }
        
        /**
         * Get dependency graph
         */
        getDependencyGraph() {
            const graph = {};
            
            for (const [name, component] of this.components) {
                graph[name] = {
                    status: component.status,
                    dependencies: component.dependencies || [],
                    dependents: this.getDependents(name),
                    health: component.health
                };
            }
            
            return graph;
        }
        
        /**
         * Get components that depend on this component
         */
        getDependents(name) {
            const dependents = [];
            
            for (const [componentName, component] of this.components) {
                if (component.dependencies && component.dependencies.includes(name)) {
                    dependents.push(componentName);
                }
            }
            
            return dependents;
        }
        
        /**
         * Set up health monitoring
         */
        setupHealthMonitoring() {
            // Check component health every 5 seconds
            setInterval(() => {
                this.performHealthChecks();
            }, 5000);
        }
        
        /**
         * Perform health checks on all components
         */
        performHealthChecks() {
            for (const [name, component] of this.components) {
                if (component.status === 'loaded') {
                    try {
                        // Check if custom element is still registered
                        if (component.class && component.class.prototype instanceof HTMLElement) {
                            const isRegistered = customElements.get(name) !== undefined;
                            component.health = isRegistered ? 'healthy' : 'unhealthy';
                        }
                        
                        // Check if component instances exist in DOM
                        const instances = document.querySelectorAll(name);
                        component.instanceCount = instances.length;
                        
                    } catch (error) {
                        component.health = 'unhealthy';
                        component.healthError = error.message;
                    }
                }
            }
        }
        
        /**
         * Log events
         */
        log(type, message, details = {}) {
            const logEntry = {
                type,
                message,
                details,
                timestamp: new Date().toISOString(),
                time: Date.now() - this.startTime
            };
            
            this.eventLog.push(logEntry);
            
            // Keep only last 1000 log entries
            if (this.eventLog.length > 1000) {
                this.eventLog.shift();
            }
            
            // Console logging with colors
            const colors = {
                info: 'color: #2196F3',
                success: 'color: #4CAF50',
                warning: 'color: #FF9800',
                error: 'color: #F44336'
            };
            
            console.log(
                `%cRegistry [${type.toUpperCase()}]: ${message}`,
                colors[type] || '',
                details
            );
            
            // Dispatch to wb-event-log if available
            this.dispatchEvent('registryLog', logEntry);
        }
        
        /**
         * Dispatch custom events
         */
        dispatchEvent(eventName, detail) {
            if (typeof document !== 'undefined' && document.dispatchEvent) {
                document.dispatchEvent(new CustomEvent(`wb:${eventName}`, {
                    detail: {
                        source: 'component-registry',
                        ...detail
                    }
                }));
            }
        }
        
        /**
         * Get registry statistics
         */
        getStats() {
            const components = Array.from(this.components.values());
            
            return {
                totalComponents: components.length,
                loadedComponents: components.filter(c => c.status === 'loaded').length,
                failedComponents: components.filter(c => c.status === 'failed').length,
                healthyComponents: components.filter(c => c.health === 'healthy').length,
                averageLoadTime: components.reduce((sum, c) => sum + (c.loadTime || 0), 0) / components.length,
                uptime: Date.now() - this.startTime,
                logEntries: this.eventLog.length
            };
        }
        
        /**
         * Generate health report
         */
        generateHealthReport() {
            const stats = this.getStats();
            const graph = this.getDependencyGraph();
            const recentLogs = this.eventLog.slice(-50);
            
            return {
                timestamp: new Date().toISOString(),
                stats,
                dependencyGraph: graph,
                recentLogs,
                components: this.getAllComponents()
            };
        }
    }
    
    // Create global registry instance
    window.WBComponentRegistry = new WBComponentRegistry();
    
    // Add to WBComponentUtils if available
    if (window.WBComponentUtils) {
        window.WBComponentUtils.Registry = window.WBComponentRegistry;
    }
    
    console.log('WB Component Registry: Initialized successfully');
    
    // Expose convenience methods
    window.registerComponent = (name, componentClass, dependencies, metadata) => {
        return window.WBComponentRegistry.register(name, componentClass, dependencies, metadata);
    };
    
    window.waitForComponent = (name, timeout) => {
        return window.WBComponentRegistry.waitForComponent(name, timeout);
    };
    
})();