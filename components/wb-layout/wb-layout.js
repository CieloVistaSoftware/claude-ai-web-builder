/**
 * WB Layout Component
 * Handles website layout switching between different navigation configurations
 * 
 * Supported layouts:
 * - top-nav: Horizontal navigation at page top
 * - left-nav: Fixed left sidebar navigation
 * - right-nav: Fixed right sidebar navigation  
 * - ad-layout: Advertisement optimized with enhanced navigation
 */

(function() {
    'use strict';

    class WBLayout extends HTMLElement {
        constructor() {
            super();
            this.currentLayout = 'top-nav';
            this.layoutConfigs = {
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
        }

        connectedCallback() {
            this.init();
        }

        static get observedAttributes() {
            return ['layout', 'auto-apply'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'layout' && newValue !== oldValue) {
                this.setLayout(newValue);
            }
        }

        init() {
            // Get initial layout from attribute or default
            const initialLayout = this.getAttribute('layout') || 'top-nav';
            const autoApply = this.getAttribute('auto-apply') !== 'false';
            
            // Store existing content before adding template
            const existingContent = this.innerHTML;
            
            // Add control template while preserving existing content
            if (!this.querySelector('.wb-layout-control')) {
                this.insertAdjacentHTML('afterbegin', this.getTemplate());
            }
            
            this.setupEventListeners();
            
            if (autoApply) {
                this.setLayout(initialLayout);
            }

            console.log('🎨 WB Layout component initialized');
            this.dispatchEvent(new CustomEvent('wb-layout-ready', {
                detail: { component: this }
            }));
        }

        getTemplate() {
            return `
                <div class="wb-layout-control" style="display: none;">
                    <label for="wb-layout-select">Layout:</label>
                    <select id="wb-layout-select">
                        ${Object.entries(this.layoutConfigs).map(([key, config]) => 
                            `<option value="${key}">${config.name}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        }

        setupEventListeners() {
            const select = this.querySelector('#wb-layout-select');
            if (select) {
                select.addEventListener('change', (e) => {
                    this.setLayout(e.target.value);
                });
            }

            // Listen for external layout change requests
            document.addEventListener('wb-layout-change', (e) => {
                if (e.detail.layout) {
                    this.setLayout(e.detail.layout);
                }
            });
        }

        setLayout(layoutType) {
            if (!this.layoutConfigs[layoutType]) {
                console.warn(`🎨 WB Layout: Unknown layout type '${layoutType}'`);
                return;
            }

            const config = this.layoutConfigs[layoutType];
            const oldLayout = this.currentLayout;
            this.currentLayout = layoutType;

            // Update body attributes and classes
            this.applyLayoutToPage(config, oldLayout);

            // Update navigation component if present
            this.updateNavigationComponent(config);

            // Update select value if it exists
            const select = this.querySelector('#wb-layout-select');
            if (select && select.value !== layoutType) {
                select.value = layoutType;
            }

            // Update component attribute
            this.setAttribute('layout', layoutType);

            // Dispatch layout change event
            this.dispatchEvent(new CustomEvent('wb-layout-changed', {
                detail: {
                    layout: layoutType,
                    config: config,
                    previousLayout: oldLayout
                },
                bubbles: true
            }));

            console.log(`🎨 WB Layout: Changed from '${oldLayout}' to '${layoutType}'`);
        }

        applyLayoutToPage(config, oldLayout) {
            const body = document.body;
            
            // Remove old layout classes
            if (oldLayout && this.layoutConfigs[oldLayout]) {
                body.classList.remove(this.layoutConfigs[oldLayout].bodyClass);
            }

            // Add new layout class
            body.classList.add(config.bodyClass);

            // Update data-layout attribute
            body.setAttribute('data-layout', this.currentLayout);

            // Apply layout-specific CSS custom properties
            this.applyLayoutStyles(config);
            
            // Apply layout to this component's structure
            this.applyLayoutStructure(config);
        }

        applyLayoutStyles(config) {
            const root = document.documentElement;
            
            switch (this.currentLayout) {
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

        applyLayoutStructure(config) {
            // Apply CSS classes to organize child elements based on layout
            this.className = `wb-layout wb-layout-${this.currentLayout}`;
            
            // Ensure the component displays as flex with proper layout
            this.style.display = 'flex';
            
            switch (this.currentLayout) {
                case 'top-nav':
                    this.style.flexDirection = 'column';
                    this.organizeTopNavLayout();
                    break;
                case 'left-nav':
                    this.style.flexDirection = 'row';
                    this.organizeLeftNavLayout();
                    break;
                case 'right-nav':
                    this.style.flexDirection = 'row-reverse';
                    this.organizeRightNavLayout();
                    break;
                case 'ad-layout':
                    this.style.flexDirection = 'column';
                    this.organizeAdLayout();
                    break;
            }
        }
        
        organizeTopNavLayout() {
            // For top-nav: nav, header, main, footer in column
            // Remove content column if it exists
            this.removeContentColumn();
        }
        
        organizeLeftNavLayout() {
            // For left-nav: nav (sidebar) + content column (header, main, footer)
            this.createContentColumn();
        }
        
        organizeRightNavLayout() {
            // For right-nav: content column (header, main, footer) + nav (sidebar)
            this.createContentColumn();
        }
        
        organizeAdLayout() {
            // For ad-layout: nav, header, main, footer, aside in column
            // Remove content column if it exists
            this.removeContentColumn();
        }
        
        createContentColumn() {
            // Find all non-nav elements (header, main, footer)
            const nav = this.querySelector('wb-nav');
            const header = this.querySelector('header');
            const main = this.querySelector('main');
            const footer = this.querySelector('footer');
            const aside = this.querySelector('aside');
            
            // Remove existing content column if it exists
            const existingColumn = this.querySelector('.wb-content-column');
            if (existingColumn) {
                // Move children back to parent before removing
                while (existingColumn.firstChild) {
                    this.appendChild(existingColumn.firstChild);
                }
                existingColumn.remove();
            }
            
            // Create content column container
            const contentColumn = document.createElement('div');
            contentColumn.className = 'wb-content-column';
            contentColumn.style.cssText = 'display: flex; flex-direction: column; flex: 1; min-height: 100vh; width: 100%;';
            
            // Move header, main, footer into content column
            if (header) {
                contentColumn.appendChild(header);
            }
            if (main) {
                contentColumn.appendChild(main);
            }
            if (footer) {
                contentColumn.appendChild(footer);
            }
            
            // Insert content column after nav (for left-nav) or before nav (handled by row-reverse for right-nav)
            if (nav) {
                this.insertBefore(contentColumn, nav.nextSibling);
            } else {
                this.appendChild(contentColumn);
            }
            
            // Add aside if it exists (for ad-layout variations)
            if (aside && !contentColumn.contains(aside)) {
                this.appendChild(aside);
            }
            
            console.log('🎨 WB Layout: Created content column with header, main, footer');
        }
        
        removeContentColumn() {
            const contentColumn = this.querySelector('.wb-content-column');
            if (contentColumn) {
                // Move children back to parent
                while (contentColumn.firstChild) {
                    this.appendChild(contentColumn.firstChild);
                }
                contentColumn.remove();
                console.log('🎨 WB Layout: Removed content column');
            }
        }

        updateNavigationComponent(config) {
            const navElement = this.querySelector('wb-nav') || document.querySelector('wb-nav');
            if (navElement) {
                // Remove existing layout classes
                navElement.classList.remove('wb-nav--horizontal', 'wb-nav--vertical', 'wb-nav--left', 'wb-nav--right', 'wb-nav--top');
                
                // Set layout attribute and classes based on current layout
                if (this.currentLayout === 'top-nav' || this.currentLayout === 'ad-layout') {
                    navElement.setAttribute('layout', 'horizontal');
                    navElement.classList.add('wb-nav--horizontal', 'wb-nav--top');
                } else if (this.currentLayout === 'left-nav') {
                    navElement.setAttribute('layout', 'vertical');
                    navElement.setAttribute('position', 'left');
                    navElement.classList.add('wb-nav--vertical', 'wb-nav--left');
                } else if (this.currentLayout === 'right-nav') {
                    navElement.setAttribute('layout', 'vertical');
                    navElement.setAttribute('position', 'right');
                    navElement.classList.add('wb-nav--vertical', 'wb-nav--right');
                }
                
                // Update navigation component configuration
                Object.entries(config.navConfig).forEach(([key, value]) => {
                    navElement.setAttribute(key, value);
                });

                // Trigger re-render of nav component if it has the method
                if (navElement.render && typeof navElement.render === 'function') {
                    navElement.render();
                }

                // Dispatch event to navigation component
                navElement.dispatchEvent(new CustomEvent('wb-nav-layout-change', {
                    detail: {
                        layout: this.currentLayout,
                        config: config.navConfig
                    }
                }));
                
                console.log(`🎨 WB Layout: Updated nav component for ${this.currentLayout} layout`);
            }
        }

        getLayout() {
            return {
                current: this.currentLayout,
                config: this.layoutConfigs[this.currentLayout],
                available: Object.keys(this.layoutConfigs)
            };
        }

        getAvailableLayouts() {
            return Object.entries(this.layoutConfigs).map(([key, config]) => ({
                value: key,
                label: config.name,
                description: config.description
            }));
        }

        // Public API methods
        showControl() {
            const control = this.querySelector('.wb-layout-control');
            if (control) {
                control.style.display = 'block';
            }
        }

        hideControl() {
            const control = this.querySelector('.wb-layout-control');
            if (control) {
                control.style.display = 'none';
            }
        }
    }

    // Define the custom element
    if (!customElements.get('wb-layout')) {
        customElements.define('wb-layout', WBLayout);
        console.log('🎨 WB Layout component registered');
    }
    
    // Register with WBComponentRegistry if available
    if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
        window.WBComponentRegistry.register('wb-layout', WBLayout, ['wb-event-log'], {
            version: '1.0.0',
            type: 'layout',
            role: 'structural',
            description: 'Responsive layout management system with CSS grid and flexbox support',
            api: {
                static: ['setLayout'],
                events: ['layout-changed', 'breakpoint-changed'],
                attributes: ['data-layout', 'data-responsive', 'data-grid-columns', 'data-gap'],
                methods: ['setLayout', 'getLayout', 'updateLayout', 'hideControls']
            },
            priority: 3 // Layout component depends on logging
        });
    }

    // Global API
    window.WBLayout = {
        setLayout: function(layout) {
            const layoutComponent = document.querySelector('wb-layout');
            if (layoutComponent) {
                layoutComponent.setLayout(layout);
            } else {
                // Dispatch event for control panel or other listeners
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

})();