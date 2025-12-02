/**
 * WB Component Loader
 * Auto-discovers and loads WB components from HTML markup
 * Follows the wb-event-log auto-injection architecture pattern
 * 
 * Features:
 * - Zero-configuration component loading
 * - Convention-based (components/wb-xyz/wb-xyz.js)
 * - Dynamic component detection via MutationObserver
 * - Single instance pattern with global API
 * - Debug helpers and event dispatching
 * 
 * Usage:
 *   <script type="module" src="../../component-loader.js"></script>
 * 
 * Debug:
 *   WBComponentLoader.showLoadedComponents()
 *   WBComponentLoader.loadComponent('wb-button')
 * 
 * @version 1.0.0
 */

class WBComponentLoader {
    // ===== STATIC PROPERTIES (Like wb-event-log pattern) =====
    
    /** @type {Set<string>} Track loaded components to prevent duplicates */
    static loaded = new Set();
    
    /** @type {MutationObserver|null} Observer for dynamically added components */
    static observer = null;
    
    /** @type {boolean} Initialization flag to ensure single instance */
    static _initialized = false;
    
    /** @type {string} Base path for component imports */
    static basePath = '../components';
    
    // ===== INITIALIZATION (Like _initializeGlobalEventLog) =====
    
    /**
     * Initialize the component loader
     * Scans HTML for wb-* tags and loads them
     * Similar to wb-event-log's _initializeGlobalEventLog()
     */
    static async init() {
        if (this._initialized) {
            console.log('⏭️  WB Component Loader already initialized');
            return;
        }
        
        this._initialized = true;
        console.log('🔧 WB Component Loader: Initializing...');
        
        try {
            // Scan HTML source for component tags
            const components = this._scanHTMLForComponents();
            
            if (components.size === 0) {
                console.log('📦 No WB components found in HTML');
                this._startObserving();
                return;
            }
            
            console.log(`📦 Found ${components.size} components:`, [...components]);
            
            // Load all components in parallel
            const loadPromises = [...components].map(name => this.loadComponent(name));
            await Promise.allSettled(loadPromises);
            
            console.log('✅ All components loaded');
            
            // Dispatch ready event (like wb:event-log-ready)
            document.dispatchEvent(new CustomEvent('wb:component-loader-ready', {
                detail: { 
                    componentsLoaded: this.loaded.size,
                    components: [...this.loaded]
                }
            }));
            
            // Start watching for dynamic components
            this._startObserving();
            
        } catch (error) {
            console.error('❌ WB Component Loader initialization failed:', error);
        }
    }
    
    // ===== COMPONENT DISCOVERY =====
    
    /**
     * Scan HTML source for wb-* component tags
     * Uses regex on raw HTML to find components before they're parsed
     * @returns {Set<string>} Set of component names found
     */
    static _scanHTMLForComponents() {
        const components = new Set();
        
        // Get the full HTML as text
        const htmlSource = document.documentElement.outerHTML;
        
        // Regex to find all <wb-* opening tags
        // Matches: <wb-layout, <wb-nav, etc.
        const wbTagRegex = /<(wb-[\w-]+)/gi;
        
        let match;
        while ((match = wbTagRegex.exec(htmlSource)) !== null) {
            const componentName = match[1].toLowerCase();
            components.add(componentName);
        }
        
        return components;
    }
    
    // ===== COMPONENT LOADING =====
    
    /**
     * Load a single component by name
     * Convention: components/wb-xyz/wb-xyz.js
     * Similar to how wb-event-log creates its element
     * 
     * @param {string} name - Component name (e.g., 'wb-layout')
     * @returns {Promise<void>}
     */
    static async loadComponent(name) {
        // Check if already loaded
        if (this.loaded.has(name)) {
            console.log(`⏭️  ${name} already loaded`);
            return;
        }
        
        try {
            // Convention-based path: components/wb-xyz/wb-xyz.js
            const path = `${this.basePath}/${name}/${name}.js`;
            
            // Dynamic import
            await import(path);
            
            // Mark as loaded
            this.loaded.add(name);
            console.log(`  ✅ ${name}`);
            
            // Dispatch event for each component loaded (like wb:event-log-ready)
            document.dispatchEvent(new CustomEvent('wb:component-loaded', {
                detail: { 
                    component: name,
                    path: path
                }
            }));
            
        } catch (err) {
            console.warn(`  ⚠️ Failed to load ${name}:`, err.message);
            
            // Dispatch error event
            document.dispatchEvent(new CustomEvent('wb:component-load-error', {
                detail: { 
                    component: name,
                    error: err.message
                }
            }));
        }
    }
    
    // ===== DYNAMIC COMPONENT DETECTION (Like observeNewComponents) =====
    
    /**
     * Start observing DOM for dynamically added wb-* components
     * Similar to wb-event-log's MutationObserver pattern
     * @private
     */
    static _startObserving() {
        if (this.observer) {
            console.log('👁️  Already observing for dynamic components');
            return;
        }
        
        this.observer = new MutationObserver((mutations) => {
            const newComponents = new Set();
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check the node itself
                        this._checkElementForComponents(node, newComponents);
                        
                        // Check all descendants
                        if (node.querySelectorAll) {
                            node.querySelectorAll('*').forEach(child => {
                                this._checkElementForComponents(child, newComponents);
                            });
                        }
                    }
                });
            });
            
            // Load any new components found
            if (newComponents.size > 0) {
                console.log('🔄 Detected new components:', [...newComponents]);
                newComponents.forEach(name => this.loadComponent(name));
            }
        });
        
        // Watch the entire document for changes
        this.observer.observe(document.body, {
            childList: true,  // Watch for added/removed nodes
            subtree: true     // Watch entire tree, not just direct children
        });
        
        console.log('👁️  Watching for dynamically added components...');
    }
    
    /**
     * Check if element is a wb-* component and add to set
     * @private
     * @param {Element} element - Element to check
     * @param {Set<string>} componentsSet - Set to add component name to
     */
    static _checkElementForComponents(element, componentsSet) {
        const tagName = element.tagName?.toLowerCase();
        if (tagName?.startsWith('wb-') && !this.loaded.has(tagName)) {
            componentsSet.add(tagName);
        }
    }
    
    /**
     * Stop observing for dynamic components
     * Similar to wb-event-log cleanup
     */
    static stopObserving() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
            console.log('🛑 Stopped watching for components');
        }
    }
    
    // ===== PUBLIC API (Like getGlobalEventLog) =====
    
    /**
     * Get list of all loaded components
     * Similar to WBBaseComponent.getGlobalEventLog()
     * @returns {string[]} Array of loaded component names
     */
    static getLoadedComponents() {
        return [...this.loaded];
    }
    
    /**
     * Check if a specific component is loaded
     * @param {string} name - Component name to check
     * @returns {boolean}
     */
    static isLoaded(name) {
        return this.loaded.has(name);
    }
    
    /**
     * Get count of loaded components
     * @returns {number}
     */
    static getLoadedCount() {
        return this.loaded.size;
    }
    
    // ===== DEBUG HELPERS (Like toggleEventLogVisibility) =====
    
    /**
     * Display loaded components in console
     * Similar to toggleEventLogVisibility() for debugging
     * @returns {number} Number of components loaded
     */
    static showLoadedComponents() {
        if (this.loaded.size === 0) {
            console.log('📦 No components loaded yet');
            return 0;
        }
        
        console.group('📦 Loaded WB Components');
        console.table(
            [...this.loaded].map(name => ({
                Component: name,
                Status: '✅ Loaded',
                Path: `${this.basePath}/${name}/${name}.js`
            }))
        );
        console.groupEnd();
        
        return this.loaded.size;
    }
    
    /**
     * Display component loader status
     */
    static showStatus() {
        console.group('🔧 WB Component Loader Status');
        console.log('Initialized:', this._initialized);
        console.log('Observing:', this.observer !== null);
        console.log('Components Loaded:', this.loaded.size);
        console.log('Base Path:', this.basePath);
        if (this.loaded.size > 0) {
            console.log('Loaded:', [...this.loaded].join(', '));
        }
        console.groupEnd();
    }
    
    // ===== CONFIGURATION =====
    
    /**
     * Set custom base path for components
     * @param {string} path - New base path
     */
    static setBasePath(path) {
        this.basePath = path;
        console.log(`📁 Base path set to: ${path}`);
    }
}

// ===== AUTO-INITIALIZATION (Like wb-event-log injection trigger) =====

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WBComponentLoader.init());
} else {
    // DOM already loaded, initialize immediately
    WBComponentLoader.init();
}

// ===== GLOBAL API EXPOSURE (Like WBBaseComponent global exposure) =====

// Direct global access
window.WBComponentLoader = WBComponentLoader;

// Compositional namespace (follows WB.components pattern)
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.utils.ComponentLoader = WBComponentLoader;

// ===== ES6 MODULE EXPORT =====

export default WBComponentLoader;

console.log('✅ WB Component Loader registered');
