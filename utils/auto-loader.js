/**
 * Component Auto-Loader
 * Automatically detects components on the page and loads their dependencies
 * Generic utility that works with any component naming convention
 * 
 * @version 1.0.0
 * @author Component System
 */

(function() {
    'use strict';
    
    console.log('🚀 Auto-Loader: Initializing...');
    
    class ComponentAutoLoader {
        constructor() {
            this.config = null; // Will be set in initialize()
            this.loadedComponents = new Set();
            this.loadingPromises = new Map();
            this.observer = null;
        }
        
        getDefaultConfig() {
            return {
                autoLoader: {
                    enabled: true,
                    autoDetect: true,
                    loadSequentially: false,
                    showProgress: true,
                    basePaths: {
                        components: window.WBComponentUtils?.resolve('site.components') || '/components'
                    }
                }
            };
        }
        
        /**
         * Initialize the auto-loader
         */
        async initialize() {
            // Get config now that WBConfig should be available
            this.config = (typeof window.WBConfig !== 'undefined' && window.WBConfig?.getConfig) ? 
                         window.WBConfig.getConfig() : this.getDefaultConfig();
                         
            if (!this.config.autoLoader?.enabled) {
                console.log('🚀 Auto-Loader: Disabled in configuration');
                return;
            }
            
            // Load initial components
            await this.scanAndLoadComponents();
            
            // Set up mutation observer for dynamic components
            if (this.config.autoLoader.autoDetect) {
                this.setupMutationObserver();
            }
            
            console.log('🚀 Auto-Loader: Initialization complete');
        }
        
        /**
         * Scan the document for WB components and load their dependencies
         */
        async scanAndLoadComponents() {
            const componentPrefixes = this.config.autoLoader?.componentPatterns?.customElements || ['wb-'];
            const classPrefixes = this.config.autoLoader?.componentPatterns?.classNames || ['wb-'];
            
            // Get all elements and filter by prefixes (wb-* selector doesn't work in querySelectorAll)
            const allElements = document.querySelectorAll('*');
            const elements = Array.from(allElements).filter(element => {
                const tagName = element.tagName.toLowerCase();
                const className = element.className;
                
                // Check if element tag starts with any component prefix
                for (const prefix of componentPrefixes) {
                    if (tagName.startsWith(prefix.replace('*', ''))) {
                        return true;
                    }
                }
                
                // Check if element has class with any class prefix
                if (typeof className === 'string') {
                    for (const prefix of classPrefixes) {
                        if (className.includes(prefix.replace('*', ''))) {
                            return true;
                        }
                    }
                }
                
                return false;
            });
            const componentNames = new Set();
            
            // Extract component names from elements
            elements.forEach(element => {
                // Handle custom elements
                const tagName = element.tagName.toLowerCase();
                for (const prefix of componentPrefixes) {
                    if (tagName.startsWith(prefix.replace('*', ''))) {
                        componentNames.add(tagName);
                        break;
                    }
                }
                
                // Handle class-based components
                element.classList.forEach(className => {
                    for (const prefix of classPrefixes) {
                        const prefixClean = prefix.replace('*', '');
                        if (className.startsWith(prefixClean)) {
                            const componentName = className.split('-').slice(0, 2).join('-');
                            componentNames.add(componentName);
                            break;
                        }
                    }
                });
            });
            
            console.log(`🚀 Auto-Loader: Found components: ${Array.from(componentNames).join(', ')}`);
            
            // Load components
            const loadPromises = Array.from(componentNames).map(name => this.loadComponent(name));
            
            if (this.config.autoLoader.loadSequentially) {
                for (const promise of loadPromises) {
                    await promise;
                }
            } else {
                await Promise.all(loadPromises);
            }
        }
        
        /**
         * Load a specific component's CSS and JS files
         */
        async loadComponent(componentName) {
            if (this.loadedComponents.has(componentName)) {
                return;
            }
            
            // Check if already loading
            if (this.loadingPromises.has(componentName)) {
                return this.loadingPromises.get(componentName);
            }
            
            const loadPromise = this._loadComponentFiles(componentName);
            this.loadingPromises.set(componentName, loadPromise);
            
            try {
                await loadPromise;
                this.loadedComponents.add(componentName);
                console.log(`🚀 Auto-Loader: ✅ ${componentName} loaded successfully`);
            } catch (error) {
                console.warn(`🚀 Auto-Loader: ❌ Failed to load ${componentName}:`, error);
            } finally {
                this.loadingPromises.delete(componentName);
            }
        }
        
        /**
         * Load CSS and JS files for a component
         */
        async _loadComponentFiles(componentName) {
            const basePath = `${this.config.autoLoader.basePaths.components}/${componentName}`;
            const cssPath = `${basePath}/${componentName}.css`;
            const jsPath = `${basePath}/${componentName}.js`;
            
            // Load CSS first
            await this._loadCSS(componentName, cssPath);
            
            // Then load JS
            await this._loadJS(componentName, jsPath);
        }
        
        /**
         * Load CSS file
         */
        _loadCSS(componentName, cssPath) {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (document.querySelector(`link[href="${cssPath}"]`)) {
                    resolve();
                    return;
                }
                
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssPath;
                link.id = `${componentName}-css`;
                
                link.onload = () => resolve();
                link.onerror = () => {
                    console.warn(`🚀 Auto-Loader: CSS not found: ${cssPath}`);
                    resolve(); // Don't fail the whole loading process
                };
                
                document.head.appendChild(link);
            });
        }
        
        /**
         * Load JS file
         */
        _loadJS(componentName, jsPath) {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (document.querySelector(`script[src="${jsPath}"]`)) {
                    resolve();
                    return;
                }
                
                const script = document.createElement('script');
                script.src = jsPath;
                script.id = `${componentName}-js`;
                script.async = true;
                
                script.onload = () => resolve();
                script.onerror = () => {
                    console.warn(`🚀 Auto-Loader: JS not found: ${jsPath}`);
                    resolve(); // Don't fail the whole loading process
                };
                
                document.head.appendChild(script);
            });
        }
        
        /**
         * Set up mutation observer to detect dynamically added components
         */
        setupMutationObserver() {
            this.observer = new MutationObserver((mutations) => {
                let hasNewComponents = false;
                
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                if (this._isWBComponent(node)) {
                                    hasNewComponents = true;
                                }
                                // Check children too
                                const wbChildren = node.querySelectorAll?.('[class*="wb-"], [is*="wb-"]');
                                const wbElements = node.querySelectorAll?.('wb-button, wb-card, wb-input, wb-tab, wb-event-log, wb-select, wb-toggle');
                                if (wbChildren?.length > 0 || wbElements?.length > 0) {
                                    hasNewComponents = true;
                                }
                            }
                        });
                    }
                });
                
                if (hasNewComponents) {
                    console.log('🚀 Auto-Loader: New components detected, scanning...');
                    this.scanAndLoadComponents();
                }
            });
            
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        /**
         * Check if an element is a WB component
         */
        _isWBComponent(element) {
            if (element.tagName?.toLowerCase().startsWith('wb-')) {
                return true;
            }
            
            for (const className of element.classList || []) {
                if (className.startsWith('wb-')) {
                    return true;
                }
            }
            
            return false;
        }
        
        /**
         * Manually load a component (for programmatic usage)
         */
        async loadComponentManually(componentName) {
            return this.loadComponent(componentName);
        }
        
        /**
         * Get list of loaded components
         */
        getLoadedComponents() {
            return Array.from(this.loadedComponents);
        }
        
        /**
         * Destroy the auto-loader
         */
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    }
    
    // Create global instance
    window.ComponentAutoLoader = new ComponentAutoLoader();
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.ComponentAutoLoader.initialize();
        });
    } else {
        // DOM is already ready
        window.ComponentAutoLoader.initialize();
    }
    
    console.log('🚀 Auto-Loader: Ready');
    
})();