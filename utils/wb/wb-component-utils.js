/**
 * WB Component Utilities
 * Shared utility functions for Website Builder components
 * Follows composition over inheritance pattern
 * 
 * @version 1.0.0
 * @author Website Builder Components
 */

(function() {
    'use strict';
    
    console.log('🔧 WB Component Utils: Initializing...');
    
    /**
     * CSS Loading Utilities
     * Common functionality for loading component stylesheets
     */
    const CSSLoader = {
        /**
         * Load CSS file for a component if not already present
         * @param {string} componentName - Name of the component (e.g., 'wb-button')
         * @param {string} cssPath - Path to the CSS file
         * @param {boolean} skipDuplicateCheck - Skip checking for existing styles
         * @returns {HTMLLinkElement|null} The created link element or null if already exists
         */
        loadComponentCSS: function(componentName, cssPath, skipDuplicateCheck = false) {
            const styleId = `${componentName}-styles`;
            const existingStyles = document.querySelector(`link[href*="${componentName}.css"]`);
            
            if (!skipDuplicateCheck && (document.getElementById(styleId) || existingStyles)) {
                console.log(`🔧 CSS Loader: ${componentName} CSS already loaded, skipping`);
                return null;
            }
            
            console.log(`🔧 CSS Loader: Loading ${componentName} CSS file...`);
            const link = document.createElement('link');
            link.id = styleId;
            link.rel = 'stylesheet';
            link.href = cssPath;
            
            // Add error handling
            link.onerror = function() {
                console.warn(`🔧 CSS Loader: Failed to load ${componentName} CSS from ${cssPath}`);
            };
            
            link.onload = function() {
                console.log(`🔧 CSS Loader: ${componentName} CSS loaded successfully`);
            };
            
            document.head.appendChild(link);
            return link;
        },
        
        /**
         * Check if a CSS file is already loaded
         * @param {string} componentName - Name of the component
         * @returns {boolean} True if CSS is already loaded
         */
        isCSSLoaded: function(componentName) {
            const styleId = `${componentName}-styles`;
            const existingStyles = document.querySelector(`link[href*="${componentName}.css"]`);
            return !!(document.getElementById(styleId) || existingStyles);
        }
    };
    
    /**
     * Configuration Loading Utilities
     * Common functionality for loading component configurations from JSON
     * 
     * NOTE: fetch() uses HTTP protocol, not WebSocket. For real-time updates,
     * components should subscribe to websocket events after initial load.
     */
    const ConfigLoader = {
        /**
         * Load configuration from JSON file with fallback
         * Uses standard HTTP fetch - for real-time config updates, use websocket
         * @param {string} configPath - Path to the configuration JSON file
         * @param {Object} fallbackConfig - Fallback configuration object
         * @param {string} componentName - Name of the component for logging
         * @returns {Promise<Object>} The loaded or fallback configuration
         */
        loadConfig: async function(configPath, fallbackConfig, componentName = 'Component') {
            try {
                const response = await fetch(configPath);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const config = await response.json();
                console.log(`🔧 Config Loader: ${componentName} configuration loaded`, config);
                return config;
            } catch (error) {
                console.warn(`🔧 Config Loader: Could not load ${componentName} config from ${configPath}, using defaults`, error);
                return fallbackConfig;
            }
        },
        
        /**
         * Merge configuration with defaults
         * @param {Object} config - User provided configuration
         * @param {Object} defaults - Default configuration
         * @returns {Object} Merged configuration
         */
        mergeConfig: function(config, defaults) {
            return { ...defaults, ...config };
        }
    };
    
    /**
     * Component Path Detection Utilities
     * Common functionality for detecting component paths from script sources
     */
    const PathDetector = {
        /**
         * Get the path to a component directory from its script source
         * @param {string} scriptFileName - Name of the script file (e.g., 'wb-button.js')
         * @param {string} fallbackPath - Fallback path if detection fails
         * @returns {string} The component directory path
         */
        getComponentPath: function(scriptFileName, fallbackPath = '../components/') {
            const scripts = document.getElementsByTagName('script');
            
            // First try exact match
            for (let script of scripts) {
                if (script.src && script.src.includes(scriptFileName)) {
                    const path = script.src.replace(scriptFileName, '');
                    console.log(`✅ Path Detector: Found exact match for ${scriptFileName} at: ${path}`);
                    return path;
                }
            }
            
            // Try without extension for more flexible matching
            const baseFileName = scriptFileName.replace('.js', '');
            for (let script of scripts) {
                if (script.src && script.src.includes(baseFileName)) {
                    const path = script.src.replace(/[^\/]*\.js.*$/, '');
                    console.log(`✅ Path Detector: Found base match for ${scriptFileName} at: ${path}`);
                    return path;
                }
            }
            
            // Try to infer from current document location
            const currentPath = window.location.pathname;
            if (currentPath.includes('/components/')) {
                const componentsIndex = currentPath.lastIndexOf('/components/');
                const basePath = currentPath.substring(0, componentsIndex + 12); // '/components/'.length = 12
                const inferredPath = basePath + scriptFileName.replace('.js', '') + '/';
                console.log(`🔍 Path Detector: Inferred path for ${scriptFileName}: ${inferredPath}`);
                return inferredPath;
            }
            
            console.warn(`🔧 Path Detector: Could not detect path for ${scriptFileName}, using fallback: ${fallbackPath}`);
            return fallbackPath;
        },
        
        /**
         * Get the full path to a component file
         * @param {string} scriptFileName - Name of the script file
         * @param {string} targetFileName - Name of the target file
         * @param {string} fallbackPath - Fallback path if detection fails
         * @returns {string} The full path to the target file
         */
        getComponentFilePath: function(scriptFileName, targetFileName, fallbackPath = '../components/') {
            const basePath = this.getComponentPath(scriptFileName, fallbackPath);
            return basePath + targetFileName;
        }
    };
    
    /**
     * Event Dispatching Utilities
     * Common functionality for dispatching custom events
     */
    const EventDispatcher = {
        /**
         * Dispatch a custom event with standardized format
         * @param {string} eventName - Name of the event
         * @param {Object} detail - Event detail data
         * @param {Element} target - Target element (defaults to document)
         * @param {Object} options - Additional event options
         * @returns {CustomEvent} The dispatched event
         */
        dispatch: function(eventName, detail = {}, target = document, options = {}) {
            const defaultOptions = {
                bubbles: true,
                cancelable: true,
                detail: detail
            };
            
            const eventOptions = { ...defaultOptions, ...options };
            const event = new CustomEvent(eventName, eventOptions);
            
            target.dispatchEvent(event);
            return event;
        },
        
        /**
         * Dispatch a component ready event
         * @param {string} componentName - Name of the component
         * @param {Object} config - Component configuration
         * @param {Element} target - Target element
         */
        dispatchReady: function(componentName, config = {}, target = document) {
            this.dispatch(`${componentName}Ready`, {
                component: componentName,
                config: config,
                timestamp: Date.now()
            }, target);
        },
        
        /**
         * Dispatch a component change event
         * @param {string} componentName - Name of the component
         * @param {any} value - The new value
         * @param {Element} element - The component element
         * @param {Object} additionalData - Additional event data
         */
        dispatchChange: function(componentName, value, element, additionalData = {}) {
            this.dispatch(`${componentName}Change`, {
                value: value,
                element: element,
                timestamp: Date.now(),
                ...additionalData
            }, element);
        }
    };
    
    /**
     * DOM Manipulation Utilities
     * Common functionality for DOM operations
     * 
     * ELEMENT CREATION TIMING:
     * - Web Components: Created automatically when browser parses custom element tags in HTML
     * - Dynamic Elements: Created by JavaScript when needed (modals, notifications, etc.)
     * - Template-based: Created when component connectedCallback() builds shadow DOM
     * 
     * Components should self-initialize from DOM - no manual createElement needed for web components
     */
    const DOMUtils = {
        /**
         * Generate a unique ID for an element
         * @param {string} prefix - Prefix for the ID
         * @returns {string} Unique ID
         */
        generateId: function(prefix = 'wb-element') {
            return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
        },
        
        /**
         * Create an element with attributes and content
         * @param {string} tagName - HTML tag name
         * @param {Object} attributes - Element attributes
         * @param {string|Element|Array} content - Element content
         * @returns {Element} Created element
         */
        createElement: function(tagName, attributes = {}, content = null) {
            const element = document.createElement(tagName);
            
            // Set attributes
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className' || key === 'class') {
                    element.className = value;
                } else if (key.startsWith('data-')) {
                    element.setAttribute(key, value);
                } else if (key in element) {
                    element[key] = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            // Set content
            if (content !== null) {
                if (typeof content === 'string') {
                    element.textContent = content;
                } else if (content instanceof Element) {
                    element.appendChild(content);
                } else if (Array.isArray(content)) {
                    content.forEach(item => {
                        if (typeof item === 'string') {
                            element.appendChild(document.createTextNode(item));
                        } else if (item instanceof Element) {
                            element.appendChild(item);
                        }
                    });
                }
            }
            
            return element;
        },
        
        /**
         * Add multiple event listeners to an element
         * @param {Element} element - Target element
         * @param {Object} events - Object mapping event names to handlers
         */
        addEventListeners: function(element, events) {
            Object.entries(events).forEach(([eventName, handler]) => {
                if (typeof handler === 'function') {
                    element.addEventListener(eventName, handler);
                }
            });
        },
        
        /**
         * Get focusable elements within a container
         * @param {Element} container - Container element
         * @returns {NodeList} Focusable elements
         */
        getFocusableElements: function(container) {
            return container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
        }
    };
    
    /**
     * Color Manipulation Utilities
     * Common functionality for color operations
     */
    const ColorUtils = {
        /**
         * Convert HSL to HEX color
         * @param {number} h - Hue (0-360)
         * @param {number} s - Saturation (0-100)
         * @param {number} l - Lightness (0-100)
         * @returns {string} HEX color string
         */
        hslToHex: function(h, s, l) {
            h = h % 360;
            s = Math.max(0, Math.min(100, s)) / 100;
            l = Math.max(0, Math.min(100, l)) / 100;
            
            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs((h / 60) % 2 - 1));
            const m = l - c / 2;
            
            let r, g, b;
            
            if (0 <= h && h < 60) {
                r = c; g = x; b = 0;
            } else if (60 <= h && h < 120) {
                r = x; g = c; b = 0;
            } else if (120 <= h && h < 180) {
                r = 0; g = c; b = x;
            } else if (180 <= h && h < 240) {
                r = 0; g = x; b = c;
            } else if (240 <= h && h < 300) {
                r = x; g = 0; b = c;
            } else if (300 <= h && h < 360) {
                r = c; g = 0; b = x;
            } else {
                r = g = b = 0;
            }
            
            r = Math.round((r + m) * 255);
            g = Math.round((g + m) * 255);
            b = Math.round((b + m) * 255);
            
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        },
        
        /**
         * Convert HEX to HSL color
         * @param {string} hex - HEX color string
         * @returns {Object|null} HSL object {h, s, l} or null if invalid
         */
        hexToHsl: function(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) return null;
            
            let r = parseInt(result[1], 16) / 255;
            let g = parseInt(result[2], 16) / 255;
            let b = parseInt(result[3], 16) / 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            
            return {
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                l: Math.round(l * 100)
            };
        },
        
        /**
         * Parse a color string to RGB object
         * @param {string} colorString - Color string (hex, rgb, hsl)
         * @returns {Object} RGB object {r, g, b, a}
         */
        parseColor: function(colorString) {
            if (colorString.startsWith('#')) {
                return this.hexToRgb(colorString);
            } else if (colorString.startsWith('rgb')) {
                return this.parseRgb(colorString);
            } else if (colorString.startsWith('hsl')) {
                return this.parseHsl(colorString);
            }
            
            // Default fallback
            return { r: 0, g: 0, b: 0, a: 1 };
        },
        
        /**
         * Convert HEX to RGB
         * @param {string} hex - HEX color string
         * @returns {Object} RGB object {r, g, b, a}
         */
        hexToRgb: function(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
                a: 1
            } : { r: 0, g: 0, b: 0, a: 1 };
        },
        
        /**
         * Parse RGB string
         * @param {string} rgb - RGB string
         * @returns {Object} RGB object {r, g, b, a}
         */
        parseRgb: function(rgb) {
            const match = rgb.match(/rgba?\(([^)]+)\)/);
            if (!match) return { r: 0, g: 0, b: 0, a: 1 };
            
            const values = match[1].split(',').map(v => parseFloat(v.trim()));
            return {
                r: Math.round(values[0] || 0),
                g: Math.round(values[1] || 0),
                b: Math.round(values[2] || 0),
                a: values.length > 3 ? (values[3] || 1) : 1
            };
        },
        
        /**
         * Parse HSL string and convert to RGB
         * @param {string} hsl - HSL string
         * @returns {Object} RGB object {r, g, b, a}
         */
        parseHsl: function(hsl) {
            const match = hsl.match(/hsla?\(([^)]+)\)/);
            if (!match) return { r: 0, g: 0, b: 0, a: 1 };
            
            const values = match[1].split(',').map(v => parseFloat(v.trim()));
            const rgb = this.hslToRgb(values[0] / 360, values[1] / 100, values[2] / 100);
            return {
                ...rgb,
                a: values.length > 3 ? (values[3] || 1) : 1
            };
        },
        
        /**
         * Convert HSL to RGB
         * @param {number} h - Hue (0-1)
         * @param {number} s - Saturation (0-1)
         * @param {number} l - Lightness (0-1)
         * @returns {Object} RGB object {r, g, b}
         */
        hslToRgb: function(h, s, l) {
            let r, g, b;

            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };

                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }
    };
    
    /**
     * Local Storage Utilities
     * Common functionality for local storage operations
     */
    const StorageUtils = {
        /**
         * Save data to localStorage with error handling and quota management
         * @param {string} key - Storage key
         * @param {any} value - Value to store
         * @param {string} componentName - Component name for logging
         * @returns {boolean} Success status
         */
        save: function(key, value, componentName = 'Component') {
            try {
                const serialized = JSON.stringify(value);
                localStorage.setItem(key, serialized);
                return true;
            } catch (error) {
                if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    console.warn(`🔧 Storage Utils: localStorage quota exceeded while saving ${componentName} data, attempting cleanup...`);
                    
                    // Try to free up space and retry once
                    if (this.performQuotaCleanup()) {
                        try {
                            localStorage.setItem(key, serialized);
                            console.log(`🔧 Storage Utils: Successfully saved ${componentName} data after cleanup`);
                            return true;
                        } catch (retryError) {
                            console.error(`🔧 Storage Utils: Failed to save ${componentName} data even after cleanup:`, retryError);
                            return false;
                        }
                    }
                } else {
                    console.warn(`🔧 Storage Utils: Failed to save ${componentName} data to localStorage:`, error);
                }
                return false;
            }
        },
        
        /**
         * Load data from localStorage with error handling
         * @param {string} key - Storage key
         * @param {any} defaultValue - Default value if not found
         * @param {string} componentName - Component name for logging
         * @returns {any} Loaded value or default
         */
        load: function(key, defaultValue = null, componentName = 'Component') {
            try {
                const item = localStorage.getItem(key);
                if (item === null) return defaultValue;
                return JSON.parse(item);
            } catch (error) {
                console.warn(`🔧 Storage Utils: Failed to load ${componentName} data from localStorage:`, error);
                return defaultValue;
            }
        },
        
        /**
         * Remove data from localStorage
         * @param {string} key - Storage key
         * @param {string} componentName - Component name for logging
         * @returns {boolean} Success status
         */
        remove: function(key, componentName = 'Component') {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.warn(`🔧 Storage Utils: Failed to remove ${componentName} data from localStorage:`, error);
                return false;
            }
        },
        
        /**
         * Perform emergency localStorage cleanup when quota is exceeded
         * @returns {boolean} Success status
         */
        performQuotaCleanup: function() {
            try {
                console.warn('🔧 Storage Utils: Performing localStorage quota cleanup...');
                
                // First pass: Remove temporary and cache-type data
                const tempKeys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (
                        key.includes('temp-') || 
                        key.includes('cache-') || 
                        key.includes('log-') ||
                        key.includes('debug-') ||
                        key.includes('test-')
                    )) {
                        tempKeys.push(key);
                    }
                }
                
                tempKeys.forEach(key => {
                    try {
                        localStorage.removeItem(key);
                        console.log(`🔧 Cleaned up temporary key: ${key}`);
                    } catch (e) {
                        // Continue cleanup even if individual removal fails
                    }
                });
                
                // Test if we have space now
                try {
                    localStorage.setItem('wb-quota-test', 'test');
                    localStorage.removeItem('wb-quota-test');
                    console.log('🔧 Storage Utils: Quota cleanup successful - storage available');
                    return true;
                } catch (stillFullError) {
                    // Still full, try more aggressive cleanup
                    console.warn('🔧 Storage Utils: Still over quota, performing aggressive cleanup...');
                    return this.aggressiveCleanup();
                }
                
            } catch (error) {
                console.error('🔧 Storage Utils: Failed to perform quota cleanup:', error);
                return false;
            }
        },
        
        /**
         * Aggressive localStorage cleanup - removes largest non-essential items
         * @returns {boolean} Success status
         */
        aggressiveCleanup: function() {
            try {
                // Get all keys with their sizes
                const items = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key) {
                        const value = localStorage.getItem(key);
                        const size = (value ? value.length : 0) + key.length;
                        items.push({ key, size });
                    }
                }
                
                // Sort by size (largest first)
                items.sort((a, b) => b.size - a.size);
                
                let removedSize = 0;
                const targetRemoval = 1024 * 1024; // Remove at least 1MB
                
                for (const item of items) {
                    if (removedSize >= targetRemoval) break;
                    
                    // Skip essential configuration and settings
                    if (item.key.includes('config') || 
                        item.key.includes('settings') || 
                        item.key.includes('auth') ||
                        item.key.includes('user-')) {
                        continue;
                    }
                    
                    try {
                        localStorage.removeItem(item.key);
                        removedSize += item.size;
                        console.log(`🔧 Aggressively removed: ${item.key} (${item.size} chars)`);
                    } catch (e) {
                        // Continue even if removal fails
                    }
                }
                
                console.log(`🔧 Storage Utils: Aggressive cleanup removed ${removedSize} characters`);
                
                // Final test
                try {
                    localStorage.setItem('wb-quota-test', 'test');
                    localStorage.removeItem('wb-quota-test');
                    return true;
                } catch (e) {
                    console.error('🔧 Storage Utils: localStorage still full after aggressive cleanup');
                    return false;
                }
                
            } catch (error) {
                console.error('🔧 Storage Utils: Failed aggressive cleanup:', error);
                return false;
            }
        },
        
        /**
         * Get current localStorage usage statistics
         * @returns {Object} Usage statistics
         */
        getUsageStats: function() {
            try {
                let totalSize = 0;
                let itemCount = 0;
                const items = [];
                
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key) {
                        const value = localStorage.getItem(key);
                        const size = (value ? value.length : 0) + key.length;
                        totalSize += size;
                        itemCount++;
                        items.push({ key, size });
                    }
                }
                
                // Estimate quota (usually 5MB for most browsers)
                const estimatedQuota = 5 * 1024 * 1024;
                const usagePercent = Math.round((totalSize / estimatedQuota) * 100);
                
                return {
                    totalSize,
                    itemCount,
                    usagePercent,
                    estimatedQuota,
                    items: items.sort((a, b) => b.size - a.size)
                };
            } catch (error) {
                console.warn('🔧 Storage Utils: Failed to get usage stats:', error);
                return { totalSize: 0, itemCount: 0, usagePercent: 0, estimatedQuota: 5242880, items: [] };
            }
        }
    };
    
    /**
     * Component Initialization Utilities
     * Common functionality for component initialization
     */
    const InitUtils = {
        /**
         * Wait for DOM to be ready and execute callback
         * @param {Function} callback - Function to execute when DOM is ready
         */
        onDOMReady: function(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                // DOM is already ready, execute immediately with small delay
                setTimeout(callback, 0);
            }
        },
        
        /**
         * Wait for a component to be ready in the DOM
         * @param {string} componentId - ID of the component element
         * @param {number} timeout - Timeout in milliseconds (default: 5000)
         * @returns {Promise<Element>} Resolves with the component element
         */
        waitForComponent: function(componentId, timeout = 5000) {
            return new Promise((resolve, reject) => {
                const element = document.getElementById(componentId);
                if (element) {
                    resolve(element);
                    return;
                }
                
                const observer = new MutationObserver((mutations, obs) => {
                    const element = document.getElementById(componentId);
                    if (element) {
                        obs.disconnect();
                        resolve(element);
                    }
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`Component ${componentId} not found within ${timeout}ms`));
                }, timeout);
            });
        }
    };
    
    /**
     * Validation Utilities
     * Common functionality for input validation
     */
    const ValidationUtils = {
        /**
         * Common validation functions
         */
        validators: {
            required: (value) => value && value.trim().length > 0,
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            url: (value) => /^https?:\/\/.+/.test(value),
            phone: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value),
            minLength: (value, min) => value && value.length >= min,
            maxLength: (value, max) => value && value.length <= max,
            pattern: (value, pattern) => new RegExp(pattern).test(value),
            number: (value) => !isNaN(value) && !isNaN(parseFloat(value))
        },
        
        /**
         * Validate a value against multiple rules
         * @param {any} value - Value to validate
         * @param {Object} rules - Validation rules
         * @returns {Object} Validation result {isValid, message}
         */
        validate: function(value, rules = {}) {
            for (const [ruleName, ruleValue] of Object.entries(rules)) {
                const validator = this.validators[ruleName];
                if (validator) {
                    let isValid;
                    if (typeof ruleValue === 'boolean' && ruleValue) {
                        isValid = validator(value);
                    } else if (typeof ruleValue !== 'boolean') {
                        isValid = validator(value, ruleValue);
                    } else {
                        continue; // Skip if rule is false
                    }
                    
                    if (!isValid) {
                        return {
                            isValid: false,
                            message: this.getValidationMessage(ruleName, ruleValue)
                        };
                    }
                }
            }
            
            return { isValid: true, message: '' };
        },
        
        /**
         * Get validation error message
         * @param {string} ruleName - Name of the validation rule
         * @param {any} ruleValue - Value of the validation rule
         * @returns {string} Error message
         */
        getValidationMessage: function(ruleName, ruleValue) {
            const messages = {
                required: 'This field is required',
                email: 'Please enter a valid email address',
                url: 'Please enter a valid URL',
                phone: 'Please enter a valid phone number',
                minLength: `Minimum ${ruleValue} characters required`,
                maxLength: `Maximum ${ruleValue} characters allowed`,
                pattern: 'Please match the requested format',
                number: 'Please enter a valid number'
            };
            
            return messages[ruleName] || 'Invalid input';
        }
    };
    
    /**
     * Symbol Registry - Compiler-like symbol resolution
     * Maps logical symbols to their runtime locations
     * Symbols are discovered at runtime from schema files and component registration
     */
    const SymbolRegistry = {
        // Dynamic symbol storage - populated at runtime
        symbols: {
            'wb.event-log.config': 'components/wb-event-log/wb-event-log.config.json',
            'wb.color-bars.js': 'components/wb-color-bars/wb-color-bars.js',
            'wb.color-bar.js': 'components/wb-color-bar/wb-color-bar.js',
            'wb.nav.js': 'components/wb-nav/wb-nav.js'
        },
        
        /**
         * Resolve a symbol to its actual path
         * @param {string} symbol - The logical symbol name
         * @returns {string} The resolved path
         */
        resolve: function(symbol) {
            // Initialize cache and tracking if not exists
            this._resolveCache = this._resolveCache || new Map();
            this._loggedSymbols = this._loggedSymbols || new Set();
            this._cacheHits = this._cacheHits || 0;
            this._cacheRequests = this._cacheRequests || 0;
            
            this._cacheRequests++;
            
            // Check cache first
            if (this._resolveCache.has(symbol)) {
                this._cacheHits++;
                return this._resolveCache.get(symbol);
            }
            
            // Check if symbols object exists and is initialized
            if (!this.symbols || typeof this.symbols !== 'object') {
                console.error(`🔧 Symbol Registry: symbols object not initialized`);
                this._resolveCache.set(symbol, symbol);
                return symbol;
            }
            
            let resolvedPath;
            if (this.symbols[symbol]) {
                // If it's an absolute path (starts with /), return as-is
                if (this.symbols[symbol].startsWith('/')) {
                    resolvedPath = this.symbols[symbol];
                } else {
                    // Otherwise, prepend the base URL (ensure no double slashes)
                    resolvedPath = '/' + this.symbols[symbol];
                }
                
                // Log only first resolution to prevent spam
                if (!this._loggedSymbols.has(symbol)) {
                    this._loggedSymbols.add(symbol);
                    console.log(`🔧 Symbol Registry: Resolved '${symbol}' -> '${resolvedPath}'`);
                }
            } else {
                resolvedPath = symbol;
                console.warn(`🔧 Symbol Registry: Unknown symbol '${symbol}', returning as-is`);
            }
            
            // Cache the result
            this._resolveCache.set(symbol, resolvedPath);
            return resolvedPath;
        },
        
        /**
         * Get cache statistics and performance info
         */
        getCacheStats: function() {
            const cache = this._resolveCache || new Map();
            return {
                size: cache.size,
                entries: Array.from(cache.entries()),
                hitRatio: this._cacheHits && this._cacheRequests ? 
                    (this._cacheHits / this._cacheRequests * 100).toFixed(1) + '%' : 'N/A'
            };
        },
        
        /**
         * Clear the resolution cache (useful for testing/debugging)
         */
        clearCache: function() {
            this._resolveCache = new Map();
            this._loggedSymbols = new Set();
            this._cacheHits = 0;
            this._cacheRequests = 0;
            console.log('🔧 Symbol Registry: Cache cleared');
        },
        
        /**
         * Register a new symbol
         * @param {string} symbol - The symbol name
         * @param {string} path - The path to register
         */
        register: function(symbol, path) {
            console.log(`🔧 Symbol Registry: Registering ${symbol} -> ${path}`);
            this.symbols[symbol] = path;
        },
        
        /**
         * Get the base path for a component from its symbol
         * @param {string} componentSymbol - Component symbol like 'wb.color-bar.js'
         * @returns {string} Base component path
         */
        getComponentBase: function(componentSymbol) {
            const fullPath = this.resolve(componentSymbol);
            return fullPath.substring(0, fullPath.lastIndexOf('/') + 1);
        }
    };
    
    // Create global WBComponentUtils object
    window.WBComponentUtils = {
        CSSLoader,
        ConfigLoader,
        PathDetector,
        EventDispatcher,
        DOMUtils,
        ColorUtils,
        StorageUtils,
        InitUtils,
        ValidationUtils,
        SymbolRegistry,
        
        // Convenience methods for common operations
        loadCSS: CSSLoader.loadComponentCSS,
        loadConfig: ConfigLoader.loadConfig,
        getPath: PathDetector.getComponentPath,
        resolve: function(symbol) { return SymbolRegistry.resolve(symbol); },
        register: function(symbol, path) { return SymbolRegistry.register(symbol, path); },
        dispatch: EventDispatcher.dispatch,
        createElement: DOMUtils.createElement,
        generateId: DOMUtils.generateId,
        onReady: InitUtils.onDOMReady,
        waitForComponent: InitUtils.waitForComponent,
        validate: ValidationUtils.validate,
        
        // Version info
        version: '1.0.0',
        
        // Utility info
        getInfo: function() {
            return {
                version: this.version,
                modules: Object.keys(this).filter(key => typeof this[key] === 'object' && key !== 'getInfo'),
                loadedAt: new Date().toISOString()
            };
        }
    };
    
    console.log('🔧 WB Component Utils: Initialized successfully');
    console.log('🔧 Available utilities:', Object.keys(window.WBComponentUtils));
    
    // Dispatch ready event
    EventDispatcher.dispatchReady('wbComponentUtils', window.WBComponentUtils.getInfo());
    
})();