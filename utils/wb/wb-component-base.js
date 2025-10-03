/**
 * WB Component Base Class
 * Base class for all Website Builder components
 * Consolidates common functionality to reduce code duplication
 * 
 * @version 1.0.0
 * @author Website Builder Components
 */

(function() {
    'use strict';
    
    console.log('🏗️ WB Component Base: Initializing...');
    
    /**
     * Base Component Class
     * Provides common functionality for all WB components
     */
    class WBComponentBase {
        /**
         * Create a new component instance
         * @param {string} componentName - Name of the component (e.g., 'wb-button')
         * @param {Object} fallbackConfig - Fallback configuration object
         * @param {Object} options - Component options
         */
        constructor(componentName, fallbackConfig = {}, options = {}) {
            this.componentName = componentName;
            this.fallbackConfig = fallbackConfig;
            this.config = null;
            this.element = null;
            this.isInitialized = false;
            this.listeners = new Map();
            
            // Component options
            this.options = {
                autoInitialize: true,
                loadCSS: true,
                loadConfig: true,
                ...options
            };
            
            console.log(`🏗️ ${componentName}: Base component created`);
            
            // Auto-initialize if enabled
            if (this.options.autoInitialize) {
                this.initialize();
            }
        }
        
        /**
         * Initialize the component
         * @returns {Promise<void>}
         */
        async initialize() {
            if (this.isInitialized) {
                console.warn(`🏗️ ${this.componentName}: Already initialized`);
                return;
            }
            
            try {
                console.log(`🏗️ ${this.componentName}: Starting initialization...`);
                
                // Wait for WBComponentUtils to be available
                await this.waitForUtils();
                
                // Load configuration
                if (this.options.loadConfig) {
                    await this.loadConfiguration();
                }
                
                // Load CSS
                if (this.options.loadCSS) {
                    this.loadStyles();
                }
                
                // Initialize component-specific functionality
                await this.initializeComponent();
                
                // Mark as initialized
                this.isInitialized = true;
                
                // Dispatch ready event
                this.dispatchReady();
                
                console.log(`🏗️ ${this.componentName}: Initialization complete`);
                
            } catch (error) {
                console.error(`🏗️ ${this.componentName}: Initialization failed:`, error);
                throw error;
            }
        }
        
        /**
         * Wait for WBComponentUtils to be available
         * @returns {Promise<void>}
         */
        async waitForUtils() {
            return new Promise((resolve) => {
                if (window.WBComponentUtils) {
                    resolve();
                    return;
                }
                
                const checkUtils = () => {
                    if (window.WBComponentUtils) {
                        resolve();
                    } else {
                        setTimeout(checkUtils, 50);
                    }
                };
                
                // Load utils if not present
                if (!document.querySelector('script[src*="wb-component-utils.js"]')) {
                    const script = document.createElement('script');
                    script.src = this.getUtilsPath();
                    script.onload = checkUtils;
                    document.head.appendChild(script);
                } else {
                    checkUtils();
                }
            });
        }
        
        /**
         * Get the path to wb-component-utils.js
         * @returns {string}
         */
        getUtilsPath() {
            // Try to detect path from current script
            const basePath = window.WBComponentUtils?.getPath?.(
                `${this.componentName}.js`, 
                '../components/'
            ) || '../components/';
            
            return basePath + '../wb-component-utils.js';
        }
        
        /**
         * Load component configuration
         * @returns {Promise<void>}
         */
        async loadConfiguration() {
            if (!window.WBComponentUtils) {
                console.warn(`🏗️ ${this.componentName}: Utils not available, using fallback config`);
                this.config = this.fallbackConfig;
                return;
            }
            
            const configPath = this.getConfigPath();
            this.config = await window.WBComponentUtils.loadConfig(
                configPath, 
                this.fallbackConfig, 
                this.componentName
            );
        }
        
        /**
         * Get the path to component configuration file
         * @returns {string}
         */
        getConfigPath() {
            const basePath = window.WBComponentUtils.getPath(
                `${this.componentName}.js`, 
                `../components/${this.componentName}/`
            );
            return `${basePath}${this.componentName}.json`;
        }
        
        /**
         * Load component styles
         */
        loadStyles() {
            if (!window.WBComponentUtils) {
                console.warn(`🏗️ ${this.componentName}: Utils not available, cannot load CSS`);
                return;
            }
            
            const cssPath = this.getCSSPath();
            window.WBComponentUtils.loadCSS(this.componentName, cssPath);
        }
        
        /**
         * Get the path to component CSS file
         * @returns {string}
         */
        getCSSPath() {
            const basePath = window.WBComponentUtils.getPath(
                `${this.componentName}.js`, 
                `../components/${this.componentName}/`
            );
            return `${basePath}${this.componentName}.css`;
        }
        
        /**
         * Initialize component-specific functionality
         * Override this method in child classes
         * @returns {Promise<void>}
         */
        async initializeComponent() {
            console.log(`🏗️ ${this.componentName}: No specific initialization defined`);
        }
        
        /**
         * Create the component element
         * @param {string} tagName - HTML tag name
         * @param {Object} attributes - Element attributes
         * @param {string|Element|Array} content - Element content
         * @returns {Element}
         */
        createElement(tagName, attributes = {}, content = null) {
            if (window.WBComponentUtils) {
                return window.WBComponentUtils.createElement(tagName, attributes, content);
            }
            
            // Fallback element creation
            const element = document.createElement(tagName);
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className' || key === 'class') {
                    element.className = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            if (content && typeof content === 'string') {
                element.textContent = content;
            }
            
            return element;
        }
        
        /**
         * Generate a unique ID for the component
         * @param {string} prefix - ID prefix
         * @returns {string}
         */
        generateId(prefix = null) {
            const idPrefix = prefix || this.componentName;
            if (window.WBComponentUtils) {
                return window.WBComponentUtils.generateId(idPrefix);
            }
            
            // Fallback ID generation
            return `${idPrefix}-${Math.random().toString(36).substr(2, 9)}`;
        }
        
        /**
         * Add event listener with cleanup tracking
         * @param {Element} element - Target element
         * @param {string} eventName - Event name
         * @param {Function} handler - Event handler
         * @param {Object} options - Event options
         */
        addEventListener(element, eventName, handler, options = {}) {
            element.addEventListener(eventName, handler, options);
            
            // Track for cleanup
            const key = `${element}_${eventName}_${handler}`;
            this.listeners.set(key, { element, eventName, handler });
        }
        
        /**
         * Remove event listener
         * @param {Element} element - Target element
         * @param {string} eventName - Event name
         * @param {Function} handler - Event handler
         */
        removeEventListener(element, eventName, handler) {
            element.removeEventListener(eventName, handler);
            
            // Remove from tracking
            const key = `${element}_${eventName}_${handler}`;
            this.listeners.delete(key);
        }
        
        /**
         * Dispatch a custom event
         * @param {string} eventName - Event name
         * @param {Object} detail - Event detail data
         * @param {Element} target - Target element
         * @returns {CustomEvent}
         */
        dispatch(eventName, detail = {}, target = null) {
            const eventTarget = target || this.element || document;
            
            if (window.WBComponentUtils) {
                return window.WBComponentUtils.dispatch(eventName, {
                    component: this.componentName,
                    ...detail
                }, eventTarget);
            }
            
            // Fallback event dispatch
            const event = new CustomEvent(eventName, {
                bubbles: true,
                cancelable: true,
                detail: {
                    component: this.componentName,
                    ...detail
                }
            });
            
            eventTarget.dispatchEvent(event);
            return event;
        }
        
        /**
         * Dispatch component ready event
         */
        dispatchReady() {
            this.dispatch(`${this.componentName}Ready`, {
                config: this.config,
                element: this.element,
                timestamp: Date.now()
            });
        }
        
        /**
         * Dispatch component change event
         * @param {any} value - New value
         * @param {Object} additionalData - Additional event data
         */
        dispatchChange(value, additionalData = {}) {
            this.dispatch(`${this.componentName}Change`, {
                value: value,
                element: this.element,
                timestamp: Date.now(),
                ...additionalData
            });
        }
        
        /**
         * Get configuration value with fallback
         * @param {string} path - Configuration path (e.g., 'classes.base')
         * @param {any} defaultValue - Default value if not found
         * @returns {any}
         */
        getConfig(path, defaultValue = null) {
            const keys = path.split('.');
            let value = this.config;
            
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                } else {
                    return defaultValue;
                }
            }
            
            return value;
        }
        
        /**
         * Get CSS class from configuration
         * @param {string} classPath - Path to class in config (e.g., 'base', 'variants.primary')
         * @param {string} fallback - Fallback class name
         * @returns {string}
         */
        getClass(classPath, fallback = '') {
            const fullPath = classPath.includes('.') ? `classes.${classPath}` : `classes.${classPath}`;
            return this.getConfig(fullPath, fallback);
        }
        
        /**
         * Apply classes to an element
         * @param {Element} element - Target element
         * @param {string|Array} classes - Classes to apply
         */
        applyClasses(element, classes) {
            if (typeof classes === 'string') {
                element.className = classes;
            } else if (Array.isArray(classes)) {
                element.className = classes.filter(Boolean).join(' ');
            }
        }
        
        /**
         * Destroy the component and clean up resources
         */
        destroy() {
            console.log(`🏗️ ${this.componentName}: Destroying component...`);
            
            // Remove all tracked event listeners
            this.listeners.forEach(({ element, eventName, handler }) => {
                element.removeEventListener(eventName, handler);
            });
            this.listeners.clear();
            
            // Remove element from DOM
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            
            // Clear references
            this.element = null;
            this.config = null;
            this.isInitialized = false;
            
            console.log(`🏗️ ${this.componentName}: Component destroyed`);
        }
        
        /**
         * Get component information
         * @returns {Object}
         */
        getInfo() {
            return {
                name: this.componentName,
                initialized: this.isInitialized,
                hasElement: !!this.element,
                hasConfig: !!this.config,
                listenerCount: this.listeners.size,
                version: this.constructor.version || '1.0.0'
            };
        }
    }
    
    // Make WBComponentBase globally available
    window.WBComponentBase = WBComponentBase;
    
    console.log('🏗️ WB Component Base: Base class initialized successfully');
    
    // Dispatch ready event
    if (window.WBComponentUtils) {
        window.WBComponentUtils.dispatch('wbComponentBaseReady', {
            component: 'WBComponentBase',
            version: '1.0.0',
            timestamp: Date.now()
        });
    }
    
})();