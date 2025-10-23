/**
 * Configuration
 * Centralized configuration management for all WB components
 * 
 * @version 1.0.0
 * @author WB Component System
 */

(function() {
    'use strict';
    
    console.log('🌐 Configuration: Initializing...');
    
    /**
     * Default Configuration
     * This serves as the fallback configuration for all WB components
     */
    const DEFAULT_GLOBAL_CONFIG = {
        // System Information
        system: {
            version: '1.0.0',
            name: 'WB Component System',
            lastUpdated: '2025-10-05'
        },
        
        // Theme and Appearance
        theme: {
            default: 'dark',
            available: ['light', 'dark', 'auto'],
            cssVariables: '/styles/_variables.css',
            transitions: {
                duration: '0.3s',
                easing: 'ease-in-out'
            }
        },
        
        // Layout System Configuration
        layout: {
            default: 'top-nav',
            available: ['top-nav', 'left-nav', 'right-nav', 'ad-layout'],
            useGrid: true,
            responsive: true,
            breakpoints: {
                mobile: '768px',
                tablet: '1024px',
                desktop: '1200px',
                wide: '1400px'
            },
            containerMaxWidth: '1200px'
        },
        
        // Component Default Settings
        components: {
            'wb-header': {
                layout: 'default',
                sticky: false,
                theme: 'inherit',
                brandPosition: 'left',
                showActions: true
            },
            'wb-nav': {
                layout: 'horizontal',
                variant: 'default',
                responsive: true,
                showIcons: false,
                maxItems: 10
            },
            'wb-main': {
                padding: 'standard',
                maxWidth: 'inherit',
                centerContent: false,
                scrollBehavior: 'smooth'
            },
            'wb-footer': {
                layout: 'standard',
                columns: 3,
                showCopyright: true,
                showSocialLinks: false,
                sticky: false
            },
            'wb-button': {
                variant: 'default',
                size: 'standard',
                disabled: false,
                loading: false
            },
            'wb-card': {
                variant: 'default',
                size: 'standard',
                layout: 'vertical',
                clickable: false,
                showActions: false
            },
            'wb-input': {
                variant: 'default',
                size: 'standard',
                required: false,
                validateOnChange: true
            },
            'wb-tab': {
                variant: 'default',
                orientation: 'horizontal',
                activeTab: 0,
                lazy: false
            },
            'wb-event-log': {
                maxEvents: 1000,
                autoScroll: true,
                wrapMode: 'truncate',
                showTimestamps: true,
                claudeSave: {
                    autoSaveErrors: true,
                    autoSaveThreshold: 'error', // 'error', 'warning', 'info'
                    includeContext: true,
                    createFileIfMissing: true,
                    savePromiseRejections: true,
                    saveResourceErrors: true
                }
            }
        },
        
        // Auto-Loader Configuration
        autoLoader: {
            enabled: true,
            autoDetect: true,
            loadSequentially: true,
            showProgress: true,
            basePaths: {
                components: '/components',
                styles: '/styles',
                utils: '/utils',
                core: '/wb-core'
            },
            globalFiles: {
                css: [
                    '/styles/_variables.css',
                    '/styles/_base.css',
                    '/styles/_utilities.css'
                ],
                js: [
                    '/components/wb-component-utils.js'
                ]
            }
        },
        
        // Development and Debugging
        development: {
            enableLogging: true,
            logLevel: 'info', // 'debug', 'info', 'warn', 'error'
            showLoadingInfo: true,
            enableEventLog: false,
            enableHotReload: false,
            debugMode: false
        },
        
        // Accessibility Settings
        accessibility: {
            enabled: true,
            focusVisible: true,
            reducedMotion: 'respect', // 'respect', 'ignore', 'force'
            announceChanges: true,
            keyboardNavigation: true
        },
        
        // Performance Settings
        performance: {
            lazyLoadComponents: false,
            cacheConfigs: true,
            preloadAssets: false,
            debounceDelay: 300,
            throttleDelay: 100
        },
        
        // Storage Settings
        storage: {
            enabled: true,
            prefix: 'wb-',
            cacheTimeout: 3600000, // 1 hour in milliseconds
            syncAcrossTabs: false
        }
    };
    
    /**
     * Configuration Manager
     * Handles loading, merging, and managing configuration
     */
    class WBConfigManager {
        constructor() {
            this.config = { ...DEFAULT_GLOBAL_CONFIG };
            this.overrides = {};
            this.watchers = new Map();
            this.initialized = false;
        }
        
        /**
         * Initialize the global configuration system
         * @param {Object} customConfig - Custom configuration overrides
         * @returns {Promise<void>}
         */
        async init(customConfig = {}) {
            if (this.initialized) {
                console.warn('🌐 Configuration: Already initialized');
                return;
            }
            
            try {
                // Load configuration from file if available
                await this.loadConfigFromFile();
                
                // Apply custom configuration
                if (Object.keys(customConfig).length > 0) {
                    this.override(customConfig);
                }
                
                // Initialize auto-loader if enabled
                if (this.config.autoLoader.enabled) {
                    this.initializeAutoLoader();
                }
                
                // Apply theme settings
                this.applyThemeSettings();
                
                this.initialized = true;
                console.log('🌐 Configuration: Initialized successfully');
                
                // Dispatch ready event
                this.dispatchEvent('wbGlobalConfigReady', {
                    config: this.config,
                    version: this.config.system.version
                });
                
            } catch (error) {
                console.error('🌐 Configuration: Initialization failed:', error);
                this.initialized = true; // Still mark as initialized to prevent retry loops
            }
        }
        
        /**
         * Load configuration from external file
         * @returns {Promise<void>}
         */
        async loadConfigFromFile() {
            try {
                const configPath = '/config.schema.json';
                const response = await fetch(configPath);
                
                if (response.ok) {
                    const fileConfig = await response.json();
                    this.config = this.deepMerge(this.config, fileConfig);
                    console.log('🌐 Configuration: Loaded from file');
                } else {
                    console.log('🌐 Configuration: No external config file found, using defaults');
                }
            } catch (error) {
                console.log('🌐 Configuration: Using default configuration');
            }
        }
        
        /**
         * Override global configuration with custom settings
         * @param {Object} overrides - Configuration overrides
         * @param {boolean} persistent - Whether to persist overrides
         */
        override(overrides, persistent = false) {
            this.overrides = this.deepMerge(this.overrides, overrides);
            this.config = this.deepMerge(this.config, overrides);
            
            if (persistent && this.config.storage.enabled) {
                this.saveToStorage();
            }
            
            console.log('🌐 Configuration: Applied overrides');
            this.dispatchEvent('wbGlobalConfigChanged', {
                overrides: overrides,
                config: this.config
            });
        }
        
        /**
         * Get configuration value by path
         * @param {string} path - Dot-notation path (e.g., 'components.wb-button.variant')
         * @param {*} defaultValue - Default value if path not found
         * @returns {*} Configuration value
         */
        get(path, defaultValue = null) {
            const keys = path.split('.');
            let current = this.config;
            
            for (const key of keys) {
                if (current && typeof current === 'object' && key in current) {
                    current = current[key];
                } else {
                    return defaultValue;
                }
            }
            
            return current;
        }
        
        /**
         * Set configuration value by path
         * @param {string} path - Dot-notation path
         * @param {*} value - Value to set
         * @param {boolean} persistent - Whether to persist the change
         */
        set(path, value, persistent = false) {
            const keys = path.split('.');
            const lastKey = keys.pop();
            let current = this.config;
            
            // Navigate to the parent object
            for (const key of keys) {
                if (!(key in current) || typeof current[key] !== 'object') {
                    current[key] = {};
                }
                current = current[key];
            }
            
            current[lastKey] = value;
            
            if (persistent && this.config.storage.enabled) {
                this.saveToStorage();
            }
            
            // Trigger watchers for this path
            this.triggerWatchers(path, value);
            
            this.dispatchEvent('wbGlobalConfigChanged', {
                path: path,
                value: value,
                config: this.config
            });
        }
        
        /**
         * Get component-specific configuration
         * @param {string} componentName - Name of the component (e.g., 'wb-button')
         * @returns {Object} Component configuration
         */
        getComponentConfig(componentName) {
            return this.get(`components.${componentName}`, {});
        }
        
        /**
         * Reset configuration to defaults
         * @param {string} section - Optional section to reset (e.g., 'theme', 'components')
         */
        reset(section = null) {
            if (section) {
                this.config[section] = { ...DEFAULT_GLOBAL_CONFIG[section] };
            } else {
                this.config = { ...DEFAULT_GLOBAL_CONFIG };
                this.overrides = {};
            }
            
            if (this.config.storage.enabled) {
                this.clearStorage();
            }
            
            console.log(`🌐 Configuration: Reset ${section || 'all'} to defaults`);
            this.dispatchEvent('wbGlobalConfigReset', { section: section });
        }
        
        /**
         * Watch for configuration changes
         * @param {string} path - Path to watch
         * @param {Function} callback - Callback function
         * @returns {Function} Unwatch function
         */
        watch(path, callback) {
            if (!this.watchers.has(path)) {
                this.watchers.set(path, new Set());
            }
            
            this.watchers.get(path).add(callback);
            
            // Return unwatch function
            return () => {
                const pathWatchers = this.watchers.get(path);
                if (pathWatchers) {
                    pathWatchers.delete(callback);
                    if (pathWatchers.size === 0) {
                        this.watchers.delete(path);
                    }
                }
            };
        }
        
        /**
         * Trigger watchers for a specific path
         * @param {string} path - Path that changed
         * @param {*} value - New value
         */
        triggerWatchers(path, value) {
            const pathWatchers = this.watchers.get(path);
            if (pathWatchers) {
                pathWatchers.forEach(callback => {
                    try {
                        callback(value);
                    } catch (error) {
                        console.warn(`🌐 Configuration: Watcher callback error for path '${path}':`, error);
                    }
                });
            }
        }
        
        /**
         * Initialize auto-loader based on configuration
         */
        initializeAutoLoader() {
            // This would integrate with the existing auto-loader system
            console.log('🌐 Configuration: Auto-loader integration ready');
        }
        
        /**
         * Apply theme settings to document
         */
        applyThemeSettings() {
            const theme = this.get('theme.default');
            if (theme && document.body) {
                document.body.setAttribute('data-theme', theme);
            }
        }
        
        /**
         * Save configuration to local storage
         */
        saveToStorage() {
            try {
                const storageKey = `${this.get('storage.prefix')}global-config`;
                const configData = {
                    overrides: this.overrides,
                    timestamp: Date.now()
                };
                localStorage.setItem(storageKey, JSON.stringify(configData));
            } catch (error) {
                console.warn('🌐 Configuration: Failed to save to storage:', error);
            }
        }
        
        /**
         * Load configuration from local storage
         */
        loadFromStorage() {
            try {
                const storageKey = `${this.get('storage.prefix')}global-config`;
                const stored = localStorage.getItem(storageKey);
                
                if (stored) {
                    const configData = JSON.parse(stored);
                    const age = Date.now() - configData.timestamp;
                    
                    if (age < this.get('storage.cacheTimeout')) {
                        this.override(configData.overrides);
                        return true;
                    }
                }
            } catch (error) {
                console.warn('🌐 Configuration: Failed to load from storage:', error);
            }
            
            return false;
        }
        
        /**
         * Clear stored configuration
         */
        clearStorage() {
            try {
                const storageKey = `${this.get('storage.prefix')}global-config`;
                localStorage.removeItem(storageKey);
            } catch (error) {
                console.warn('🌐 Configuration: Failed to clear storage:', error);
            }
        }
        
        /**
         * Deep merge two objects
         * @param {Object} target - Target object
         * @param {Object} source - Source object
         * @returns {Object} Merged object
         */
        deepMerge(target, source) {
            const result = { ...target };
            
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                        result[key] = this.deepMerge(result[key] || {}, source[key]);
                    } else {
                        result[key] = source[key];
                    }
                }
            }
            
            return result;
        }
        
        /**
         * Dispatch configuration events
         * @param {string} eventName - Event name
         * @param {Object} detail - Event detail
         */
        dispatchEvent(eventName, detail) {
            const event = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                cancelable: true
            });
            
            document.dispatchEvent(event);
        }
        
        /**
         * Get current configuration summary
         * @returns {Object} Configuration summary
         */
        getSummary() {
            return {
                version: this.config.system.version,
                theme: this.config.theme.default,
                layout: this.config.layout.default,
                componentsConfigured: Object.keys(this.config.components).length,
                autoLoaderEnabled: this.config.autoLoader.enabled,
                developmentMode: this.config.development.debugMode,
                hasOverrides: Object.keys(this.overrides).length > 0,
                storageEnabled: this.config.storage.enabled
            };
        }
    }
    
    // Create global instance
    const configManager = new WBConfigManager();
    
    // Make it globally available
    window.WBConfig = configManager;
    
    // Auto-initialize when DOM is ready
    function autoInit() {
        configManager.init().then(() => {
            console.log('🌐 Configuration: Auto-initialization complete');
        }).catch(error => {
            console.error('🌐 Configuration: Auto-initialization failed:', error);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        // Small delay to allow other scripts to load
        setTimeout(autoInit, 100);
    }
    
    console.log('🌐 Configuration: System loaded');
    
})();