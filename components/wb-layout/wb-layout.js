/**
 * WB Layout Component - Reactive Architecture
 * Handles website layout switching with internal state management
 * 
 * Supported layouts:
 * - top-nav: Horizontal navigation at page top
 * - left-nav: Fixed left sidebar navigation
 * - right-nav: Fixed right sidebar navigation  
 * - ad-layout: Advertisement optimized with enhanced navigation
 */

class WBLayout extends HTMLElement {
        constructor() {
            super();
            // Cache DOM elements during initialization
            this._elements = {};
            // Layout configuration (internal data)
            this._layoutConfigs = {
                'top-nav': {
                    name: 'Top Navigation',
                    description: 'Horizontal navigation bar at page top',
                    bodyClass: 'layout-top-nav',
                    navComponent: 'wb-nav',
                    navConfig: { type: 'horizontal', position: 'top' }
                },
                'left-nav': {
                    name: 'Left Sidebar',
                    description: 'Fixed vertical sidebar with icons and text',
                    bodyClass: 'layout-left-nav',
                    navComponent: 'wb-nav',
                    navConfig: { type: 'vertical', position: 'left', width: '200px' }
                },
                'right-nav': {
                    name: 'Right Sidebar', 
                    description: 'Fixed vertical sidebar with icons and text',
                    bodyClass: 'layout-right-nav',
                    navComponent: 'wb-nav',
                    navConfig: { type: 'vertical', position: 'right', width: '200px' }
                },
                'ad-layout': {
                    name: 'Ad Layout',
                    description: 'Advertisement optimized with branding and CTA',
                    bodyClass: 'layout-ad-layout',
                    navComponent: 'wb-nav',
                    navConfig: { type: 'enhanced', branding: true, cta: true }
                }
            };
            // Reactive state using Proxy for automatic UI updates
            this._state = new Proxy({
                currentLayout: 'top-nav',
                showControls: false,
                responsiveMode: 'desktop',
                autoApply: true
            }, {
                set: (target, property, value) => {
                    if (target[property] !== value) {
                        const oldValue = target[property];
                        target[property] = value;
                        this._updateUI();
                        this._emitStateChange(property, value, oldValue);
                    }
                    return true;
                }
            });
        }

        connectedCallback() {
            this._initializeComponent();
        }

        static get observedAttributes() {
            return ['layout', 'auto-apply', 'show-controls'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (!this._state) return; // Not initialized yet
            
            switch (name) {
                case 'layout':
                    if (newValue && newValue !== oldValue) {
                        this._state.currentLayout = newValue;
                    }
                    break;
                case 'auto-apply':
                    this._state.autoApply = newValue !== 'false';
                    break;
                case 'show-controls':
                    this._state.showControls = newValue === 'true';
                    break;
            }
        }

        // REACTIVE STATE MANAGEMENT
        // All UI updates now handled in _updateUI() reactively
        _updateUI() {
            // Update layout
            const layout = this._state.currentLayout;
            const config = this._layoutConfigs[layout];
            const oldLayout = this.getAttribute('data-prev-layout');
            // Remove old layout class
            if (oldLayout && this._layoutConfigs[oldLayout]) {
                document.body.classList.remove(this._layoutConfigs[oldLayout].bodyClass);
            }
            // Add new layout class
            document.body.classList.add(config.bodyClass);
            document.body.setAttribute('data-layout', layout);
            this.setAttribute('data-prev-layout', layout);
            // Apply layout-specific CSS custom properties
            this._applyLayoutStyles(config);
            // Apply layout to component structure
            this._applyComponentStructure(config);
            // Controls visibility
            if (this._elements.control) {
                this._elements.control.style.display = this._state.showControls ? 'block' : 'none';
            }
            // Responsive mode
            document.documentElement.setAttribute('data-responsive-mode', this._state.responsiveMode);
            // Update control select
            if (this._elements.select && this._elements.select.value !== layout) {
                this._elements.select.value = layout;
            }
            // Update component attributes
            this.setAttribute('layout', layout);
            // Update navigation component
            this._updateNavigationComponent(config);
        }

        // _updateLayout, _updateControlsVisibility, _updateResponsiveMode are now handled in _updateUI

        // INITIALIZATION
        _initializeComponent() {
            // Get initial values from attributes
            const initialLayout = this.getAttribute('layout') || 'top-nav';
            const autoApply = this.getAttribute('auto-apply') !== 'false';
            const showControls = this.getAttribute('show-controls') === 'true';
            
            // Store existing content
            const existingContent = this.innerHTML;
            
            // Add control template if not exists
            if (!this.querySelector('.wb-layout-control')) {
                this.insertAdjacentHTML('afterbegin', this._getControlTemplate());
            }
            
            // Cache DOM elements
            this._cacheElements();
            
            // Setup internal event handlers
            this._setupInternalEventHandlers();
            
            // Initialize reactive state (triggers automatic updates)
            this._state.currentLayout = initialLayout;
            this._state.autoApply = autoApply;
            this._state.showControls = showControls;

            // Detect responsive mode
            this._detectResponsiveMode();

            WBEventLog.logSuccess('WB Layout component initialized with reactive architecture', { component: 'wb-layout', method: '_initializeComponent', line: 175 });
            this.dispatchEvent(new CustomEvent('wb-layout-ready', {
                detail: { component: this, layout: this._state.currentLayout }
            }));
        }

        _cacheElements() {
            // Cache all DOM elements once during initialization
            this._elements = {
                control: this.querySelector('.wb-layout-control'),
                select: this.querySelector('#wb-layout-select'),
                body: document.body,
                documentElement: document.documentElement,
                nav: null // Will be found dynamically
            };
        }

        _getControlTemplate() {
            return `
                <div class="wb-layout-control" style="display: none;">
                    <label for="wb-layout-select">Layout:</label>
                    <select id="wb-layout-select">
                        ${Object.entries(this._layoutConfigs).map(([key, config]) => 
                            `<option value="${key}">${config.name}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        }

        _setupInternalEventHandlers() {
            // Internal control handling
            if (this._elements.select) {
                this._elements.select.addEventListener('change', (e) => {
                    this._state.currentLayout = e.target.value; // Triggers reactive update
                });
            }

            // Listen for external layout change requests (for backward compatibility)
            document.addEventListener('wb-layout-change', (e) => {
                if (e.detail.layout && e.detail.layout !== this._state.currentLayout) {
                    this._state.currentLayout = e.detail.layout; // Triggers reactive update
                }
            });

            // Listen for reactive wb:layout-changed events from control panel
            document.addEventListener('wb:layout-changed', (e) => {
                const { layout, source } = e.detail;
                WBEventLog.logInfo(`Received layout change request: ${layout}`, {
                    component: 'wb-layout',
                    method: '_setupInternalEventHandlers',
                    source: source,
                    layout: layout,
                    line: 220
                });
                
                if (layout && layout !== this._state.currentLayout) {
                    this._state.currentLayout = layout; // Triggers reactive update
                }
            });

            // Responsive breakpoint detection
            if (window.matchMedia) {
                const mobileQuery = window.matchMedia('(max-width: 768px)');
                const tabletQuery = window.matchMedia('(max-width: 1024px)');
                
                const updateResponsiveMode = () => {
                    if (mobileQuery.matches) {
                        this._state.responsiveMode = 'mobile';
                    } else if (tabletQuery.matches) {
                        this._state.responsiveMode = 'tablet';
                    } else {
                        this._state.responsiveMode = 'desktop';
                    }
                };
                
                mobileQuery.addListener(updateResponsiveMode);
                tabletQuery.addListener(updateResponsiveMode);
                updateResponsiveMode(); // Initial check
            }
        }

        // UI UPDATE METHODS (Called automatically by reactive state)
        _updatePageLayout(config, oldLayout) {
            const body = this._elements.body;
            
            // Remove old layout class
            if (oldLayout && this._layoutConfigs[oldLayout]) {
                body.classList.remove(this._layoutConfigs[oldLayout].bodyClass);
            }

            // Add new layout class
            body.classList.add(config.bodyClass);

            // Update data attributes
            body.setAttribute('data-layout', this._state.currentLayout);
            
            // Apply layout-specific CSS custom properties
            this._applyLayoutStyles(config);
            
            // Apply layout to component structure
            this._applyComponentStructure(config);
        }

        _applyLayoutStyles(config) {
            const root = this._elements.documentElement;
            
            switch (this._state.currentLayout) {
                case 'top-nav':
                    root.style.setProperty('--nav-width', '100%');
                    root.style.setProperty('--nav-height', '60px');
                    root.style.setProperty('--content-margin-left', '0');
                    root.style.setProperty('--content-margin-top', '60px');
                    break;
                    
                case 'left-nav':
                    root.style.setProperty('--nav-width', '200px');
                    root.style.setProperty('--nav-height', '100vh');
                    root.style.setProperty('--content-margin-left', '200px');
                    root.style.setProperty('--content-margin-top', '0');
                    break;
                    
                case 'right-nav':
                    root.style.setProperty('--nav-width', '200px');
                    root.style.setProperty('--nav-height', '100vh');
                    root.style.setProperty('--content-margin-left', '0');
                    root.style.setProperty('--content-margin-right', '200px');
                    root.style.setProperty('--content-margin-top', '0');
                    break;
                    
                case 'ad-layout':
                    root.style.setProperty('--nav-width', '100%');
                    root.style.setProperty('--nav-height', '80px');
                    root.style.setProperty('--content-margin-left', '0');
                    root.style.setProperty('--content-margin-top', '80px');
                    break;
            }
        }

        _applyComponentStructure(config) {
            // Apply CSS classes to organize child elements based on layout
            this.className = `wb-layout wb-layout-${this._state.currentLayout}`;
            
            // Ensure the component displays as flex with proper layout
            this.style.display = 'flex';
            
            switch (this._state.currentLayout) {
                case 'top-nav':
                    this.style.flexDirection = 'column';
                    this._organizeTopNavLayout();
                    break;
                case 'left-nav':
                    this.style.flexDirection = 'row';
                    this._organizeLeftNavLayout();
                    break;
                case 'right-nav':
                    this.style.flexDirection = 'row-reverse';
                    this._organizeRightNavLayout();
                    break;
                case 'ad-layout':
                    this.style.flexDirection = 'column';
                    this._organizeAdLayout();
                    break;
            }
        }

        _organizeTopNavLayout() {
            this._removeContentColumn();
        }
        
        _organizeLeftNavLayout() {
            this._createContentColumn();
        }
        
        _organizeRightNavLayout() {
            this._createContentColumn();
        }
        
        _organizeAdLayout() {
            this._removeContentColumn();
        }
        
        _createContentColumn() {
            // Find all non-nav elements
            const nav = this.querySelector('wb-nav');
            const header = this.querySelector('header');
            const main = this.querySelector('main');
            const footer = this.querySelector('footer');
            const aside = this.querySelector('aside');
            
            // Remove existing content column if it exists
            const existingColumn = this.querySelector('.wb-content-column');
            if (existingColumn) {
                while (existingColumn.firstChild) {
                    this.appendChild(existingColumn.firstChild);
                }
                existingColumn.remove();
            }
            
            // Create content column container
            const contentColumn = document.createElement('div');
            contentColumn.className = 'wb-content-column';
            contentColumn.style.cssText = 'display: flex; flex-direction: column; flex: 1; min-height: 100vh; width: 100%;';
            
            // Move elements into content column
            [header, main, footer].forEach(element => {
                if (element) {
                    contentColumn.appendChild(element);
                }
            });
            
            // Insert content column appropriately
            if (nav) {
                this.insertBefore(contentColumn, nav.nextSibling);
            } else {
                this.appendChild(contentColumn);
            }
            
            // Add aside if it exists
            if (aside && !contentColumn.contains(aside)) {
                this.appendChild(aside);
            }
        }
        
        _removeContentColumn() {
            const contentColumn = this.querySelector('.wb-content-column');
            if (contentColumn) {
                while (contentColumn.firstChild) {
                    this.appendChild(contentColumn.firstChild);
                }
                contentColumn.remove();
            }
        }

        _updateNavigationComponent(config) {
            // Find nav element (update cache if needed)
            this._elements.nav = this.querySelector('wb-nav') || document.querySelector('wb-nav');
            const navElement = this._elements.nav;
            
            if (navElement) {
                // Remove existing layout classes
                navElement.classList.remove('wb-nav--horizontal', 'wb-nav--vertical', 'wb-nav--left', 'wb-nav--right', 'wb-nav--top');
                
                // Set layout attributes and classes based on current layout
                if (this._state.currentLayout === 'top-nav' || this._state.currentLayout === 'ad-layout') {
                    navElement.setAttribute('layout', 'horizontal');
                    navElement.classList.add('wb-nav--horizontal', 'wb-nav--top');
                } else if (this._state.currentLayout === 'left-nav') {
                    navElement.setAttribute('layout', 'vertical');
                    navElement.setAttribute('position', 'left');
                    navElement.classList.add('wb-nav--vertical', 'wb-nav--left');
                } else if (this._state.currentLayout === 'right-nav') {
                    navElement.setAttribute('layout', 'vertical');
                    navElement.setAttribute('position', 'right');
                    navElement.classList.add('wb-nav--vertical', 'wb-nav--right');
                }
                
                // Update navigation component configuration
                Object.entries(config.navConfig).forEach(([key, value]) => {
                    navElement.setAttribute(key, value);
                });

                // Trigger re-render if navigation component supports it
                if (navElement.render && typeof navElement.render === 'function') {
                    navElement.render();
                }

                // Dispatch event to navigation component
                navElement.dispatchEvent(new CustomEvent('wb-nav-layout-change', {
                    detail: {
                        layout: this._state.currentLayout,
                        config: config.navConfig
                    }
                }));
            }
        }

        _updateControlSelect() {
            if (this._elements.select && this._elements.select.value !== this._state.currentLayout) {
                this._elements.select.value = this._state.currentLayout;
            }
        }

        _updateComponentAttributes() {
            this.setAttribute('layout', this._state.currentLayout);
        }

        _detectResponsiveMode() {
            const width = window.innerWidth;
            if (width <= 768) {
                this._state.responsiveMode = 'mobile';
            } else if (width <= 1024) {
                this._state.responsiveMode = 'tablet';
            } else {
                this._state.responsiveMode = 'desktop';
            }
        }

        // EVENT EMISSION
        _emitStateChange(property, newValue, oldValue) {
            // Emit specific property change events
            this.dispatchEvent(new CustomEvent(`wb-layout-${property}-changed`, {
                detail: { [property]: newValue, previous: oldValue },
                bubbles: true
            }));

            // Emit general layout change event (for backward compatibility)
            if (property === 'currentLayout') {
                this.dispatchEvent(new CustomEvent('wb-layout-changed', {
                    detail: {
                        layout: newValue,
                        config: this._layoutConfigs[newValue],
                        previousLayout: oldValue
                    },
                    bubbles: true
                }));
            }
        }

        // PUBLIC API (Simplified - reactive state handles the rest)
        setLayout(layoutType) {
            if (this._layoutConfigs[layoutType]) {
                this._state.currentLayout = layoutType; // Triggers automatic updates
            } else {
                console.warn(`🎨 WB Layout: Unknown layout type '${layoutType}'`);
            }
        }

        getLayout() {
            return {
                current: this._state.currentLayout,
                config: this._layoutConfigs[this._state.currentLayout],
                available: Object.keys(this._layoutConfigs),
                responsiveMode: this._state.responsiveMode
            };
        }

        getAvailableLayouts() {
            return Object.entries(this._layoutConfigs).map(([key, config]) => ({
                value: key,
                label: config.name,
                description: config.description
            }));
        }

        showControl() {
            this._state.showControls = true; // Triggers automatic update
        }

        hideControl() {
            this._state.showControls = false; // Triggers automatic update
        }

        // Responsive API
        setResponsiveMode(mode) {
            if (['mobile', 'tablet', 'desktop'].includes(mode)) {
                this._state.responsiveMode = mode;
            }
        }

        getResponsiveMode() {
            return this._state.responsiveMode;
        }
    }

    // Define the custom element
    if (!customElements.get('wb-layout')) {
        customElements.define('wb-layout', WBLayout);
        console.log('🎨 WB Layout component registered with reactive architecture');
    }
    
    // Register with WBComponentRegistry if available
    if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
        window.WBComponentRegistry.register('wb-layout', WBLayout, ['wb-event-log'], {
            version: '2.0.0',
            type: 'layout',
            role: 'structural',
            architecture: 'reactive',
            description: 'Reactive layout management system with internal state management',
            api: {
                static: ['setLayout', 'getLayout'],
                events: ['layout-changed', 'responsive-mode-changed'],
                attributes: ['layout', 'auto-apply', 'show-controls'],
                methods: ['setLayout', 'getLayout', 'showControl', 'hideControl', 'setResponsiveMode']
            },
            priority: 3
        });
    }

    // Global API (Updated for reactive architecture)
    window.WBLayout = {
        setLayout: function(layout) {
            const layoutComponent = document.querySelector('wb-layout');
            if (layoutComponent) {
                layoutComponent.setLayout(layout); // Component handles all updates automatically
            } else {
                // Fallback: dispatch event for components not yet loaded
                document.dispatchEvent(new CustomEvent('wb-layout-change', {
                    detail: { layout: layout }
                }));
            }
        },
        
        getLayout: function() {
            const layoutComponent = document.querySelector('wb-layout');
            return layoutComponent ? layoutComponent.getLayout() : null;
        },

        getAvailableLayouts: function() {
            const layoutComponent = document.querySelector('wb-layout');
            return layoutComponent ? layoutComponent.getAvailableLayouts() : [];
        }
    };

// Register custom element
if (!customElements.get('wb-layout')) {
    customElements.define('wb-layout', WBLayout);
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBLayout = WBLayout;
window.WB.utils.WBLayoutAPI = window.WBLayoutAPI;

// Expose globally (backward compatibility)
window.WBLayout = WBLayout;

// ES6 Module Exports
export { WBLayout };
export default WBLayout;