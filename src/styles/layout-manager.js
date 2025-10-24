/**
 * Website Builder Layout Manager
 * Centralized layout control system
 */

class WBLayoutManager {
    static LAYOUTS = {
        TOP_NAV: 'top-nav',
        LEFT_NAV: 'left-nav',
        RIGHT_NAV: 'right-nav'
    };
    
    static currentLayout = 'top-nav';
    static initialized = false;
    
    /**
     * Initialize the layout system
     */
    static init() {
        if (this.initialized) return;
        
        this.loadLayoutCSS();
        this.detectCurrentLayout();
        this.setupLayoutListeners();
        this.initialized = true;
        
        console.log('🔧 Layout Manager: Initialized');
    }
    
    /**
     * Load centralized layout CSS
     */
    static loadLayoutCSS() {
        if (typeof WBComponentUtils !== 'undefined') {
            WBComponentUtils.loadCSS('wb-layouts', '/styles/layouts.css');
        } else {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/styles/layouts.css';
            link.id = 'wb-layout-styles';
            document.head.appendChild(link);
        }
    }
    
    /**
     * Detect current layout from body attribute
     */
    static detectCurrentLayout() {
        const bodyLayout = document.body.getAttribute('data-layout');
        if (bodyLayout && Object.values(this.LAYOUTS).includes(bodyLayout)) {
            this.currentLayout = bodyLayout;
        }
    }
    
    /**
     * Apply a specific layout
     * @param {string} layout - Layout type (top-nav, left-nav, right-nav)
     */
    static applyLayout(layout) {
        if (!Object.values(this.LAYOUTS).includes(layout)) {
            console.error(`Invalid layout: ${layout}`);
            return false;
        }
        
        // Update body attribute
        document.body.setAttribute('data-layout', layout);
        this.currentLayout = layout;
        
        // Dispatch layout change event
        document.dispatchEvent(new CustomEvent('layoutChanged', {
            detail: { layout: layout, previous: this.currentLayout }
        }));
        
        // Log the change
        if (typeof document !== 'undefined') {
            document.dispatchEvent(new CustomEvent('wb:info', {
                detail: { 
                    message: `Layout changed to ${layout}`,
                    source: 'layout-manager',
                    from: 'WBLayoutManager',
                    to: layout
                }
            }));
        }
        
        return true;
    }
    
    /**
     * Get current layout
     */
    static getCurrentLayout() {
        return this.currentLayout;
    }
    
    /**
     * Get available layouts
     */
    static getAvailableLayouts() {
        return Object.values(this.LAYOUTS);
    }
    
    /**
     * Check if layout is mobile-responsive
     */
    static isMobile() {
        return window.innerWidth <= 768;
    }
    
    /**
     * Setup event listeners for layout changes
     */
    static setupLayoutListeners() {
        // Listen for window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Listen for layout change requests
        document.addEventListener('requestLayoutChange', (e) => {
            if (e.detail && e.detail.layout) {
                this.applyLayout(e.detail.layout);
            }
        });
    }
    
    /**
     * Handle window resize events
     */
    static handleResize() {
        // Force mobile layout on small screens
        if (this.isMobile() && (this.currentLayout === 'left-nav' || this.currentLayout === 'right-nav')) {
            // Mobile adjustments are handled by CSS, no JS changes needed
            console.log('Layout Manager: Mobile view activated');
        }
    }
    
    /**
     * Validate layout structure
     */
    static validateLayout() {
        const requiredElements = ['.site-container', '.site-header', '.site-nav', '.main-content'];
        const missing = [];
        
        requiredElements.forEach(selector => {
            if (!document.querySelector(selector)) {
                missing.push(selector);
            }
        });
        
        if (missing.length > 0) {
            console.warn('Layout Manager: Missing required elements:', missing);
            return false;
        }
        
        return true;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WBLayoutManager.init());
} else {
    WBLayoutManager.init();
}

// Make globally available
window.WBLayoutManager = WBLayoutManager;