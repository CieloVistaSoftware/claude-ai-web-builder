// WB Viewport Component
// Viewport simulator for testing responsive designs

(function() {
    'use strict';
    
    console.log('📱 WB Viewport Component: Starting initialization...');
    
    // Component configuration
    let config = null;
    let currentViewport = 'auto';
    let controlsVisible = false;
    
    // Load configuration from wb-viewport.schema.json
    async function loadConfig() {
        try {
            const configPath = (window.WBComponentUtils ? 
                window.WBComponentUtils.getPath('wb-viewport.js', '../components/wb-viewport/') : 
                '../components/wb-viewport/') + 'wb-viewport.schema.json';
            const response = await fetch(configPath);
            config = await response.json();
            console.log('📱 WB Viewport: Configuration loaded', config);
            return config;
        } catch (error) {
            console.warn('📱 WB Viewport: Could not load wb-viewport.schema.json, using defaults', error);
            config = {
                configuration: {
                    viewports: {
                        mobile: { width: 400, name: 'Mobile', icon: '📱', color: '#6366f1' },
                        tablet: { width: 768, name: 'Tablet', icon: '📟', color: '#10b981' },
                        desktop: { width: 1200, name: 'Desktop', icon: '🖥️', color: '#6366f1' }
                    },
                    defaultViewport: 'auto',
                    showControls: true
                },
                classes: {
                    controls: 'wb-viewport-controls',
                    controlsButton: 'wb-viewport-btn',
                    status: 'wb-viewport-status',
                    states: {
                        active: 'wb-viewport--active',
                        mobile: 'wb-viewport--mobile',
                        tablet: 'wb-viewport--tablet',
                        desktop: 'wb-viewport--desktop'
                    }
                },
                events: {
                    ready: 'wbViewportReady',
                    change: 'wbViewportChange',
                    reset: 'wbViewportReset'
                }
            };
            return config;
        }
    }
    
    // Load CSS file if not already present
    function loadViewportCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('wb-viewport.js', '../components/wb-viewport/') + 'wb-viewport.css';
            window.WBComponentUtils.loadCSS('wb-viewport', cssPath);
        } else {
            // Fallback for when WBComponentUtils is not available
            const existingStyles = document.querySelector('link[href*="wb-viewport.css"]');
            if (document.getElementById('wb-viewport-styles') || existingStyles) {
                console.log('📱 WB Viewport: CSS already loaded, skipping');
                return;
            }
            
            console.log('📱 WB Viewport: Loading CSS file...');
            const link = document.createElement('link');
            link.id = 'wb-viewport-styles';
            link.rel = 'stylesheet';
            link.href = '../components/wb-viewport/wb-viewport.css';
            document.head.appendChild(link);
        }
    }
    
    // Create viewport controls
    function createControls() {
        if (!config || document.querySelector(`.${config.classes.controls}`)) {
            return;
        }
        
        const controls = document.createElement('div');
        controls.className = config.classes.controls;
        controls.classList.add('wb-viewport-controls--visible');
        
        // Add viewport buttons
        Object.entries(config.configuration.viewports).forEach(([key, viewport]) => {
            const button = document.createElement('button');
            button.className = config.classes.controlsButton;
            button.classList.add(`wb-viewport-btn--${key}`);
            button.innerHTML = `${viewport.icon} ${viewport.name}`;
            button.onclick = () => window.WBViewport.setViewport(key);
            button.dataset.viewport = key;
            controls.appendChild(button);
        });
        
        // Add auto button
        const autoButton = document.createElement('button');
        autoButton.className = config.classes.controlsButton;
        autoButton.innerHTML = '🔄 Auto';
        autoButton.onclick = () => window.WBViewport.reset();
        autoButton.dataset.viewport = 'auto';
        controls.appendChild(autoButton);
        
        // Add status display
        const status = document.createElement('div');
        status.className = config.classes.status;
        status.id = 'wb-viewport-status';
        status.textContent = 'Viewport: Auto';
        controls.appendChild(status);
        
        // Add to body
        document.body.insertBefore(controls, document.body.firstChild);
        document.body.classList.add('wb-viewport-active');
        controlsVisible = true;
        
        // Set initial active button
        updateActiveButton('auto');
    }
    
    // Update active button state
    function updateActiveButton(viewport) {
        const buttons = document.querySelectorAll(`.${config.classes.controlsButton}`);
        buttons.forEach(btn => {
            if (btn.dataset.viewport === viewport) {
                btn.classList.add('wb-viewport-btn--active');
            } else {
                btn.classList.remove('wb-viewport-btn--active');
            }
        });
    }
    
    // Update viewport
    function setViewport(viewport) {
        if (!config) return;
        
        // Remove all viewport classes
        Object.keys(config.classes.states).forEach(state => {
            if (state !== 'active') {
                document.body.classList.remove(config.classes.states[state]);
            }
        });
        
        // Update status
        const status = document.getElementById('wb-viewport-status');
        
        if (viewport === 'auto') {
            currentViewport = 'auto';
            if (status) status.textContent = 'Viewport: Auto (full width)';
        } else if (config.configuration.viewports[viewport]) {
            const vp = config.configuration.viewports[viewport];
            document.body.classList.add(config.classes.states[viewport]);
            currentViewport = viewport;
            if (status) status.textContent = `Viewport: ${vp.icon} ${vp.name} (${vp.width}px)`;
        }
        
        // Update active button
        updateActiveButton(viewport);
        
        // Dispatch change event
        const event = new CustomEvent(config.events.change, {
            detail: {
                viewport: viewport,
                width: viewport === 'auto' ? 'auto' : config.configuration.viewports[viewport]?.width
            }
        });
        document.dispatchEvent(event);
    }
    
    // Keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!controlsVisible || !e.altKey) return;
            
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    window.WBViewport.setViewport('mobile');
                    break;
                case '2':
                    e.preventDefault();
                    window.WBViewport.setViewport('tablet');
                    break;
                case '3':
                    e.preventDefault();
                    window.WBViewport.setViewport('desktop');
                    break;
                case '4':
                    e.preventDefault();
                    window.WBViewport.setViewport('wide');
                    break;
                case '0':
                    e.preventDefault();
                    window.WBViewport.reset();
                    break;
            }
        });
    }
    
    // Viewport API
    window.WBViewport = {
        // Initialize viewport simulator
        init: function(options = {}) {
            if (!config) {
                console.warn('WB Viewport: Configuration not loaded yet');
                return;
            }
            
            // Merge options with config
            if (options.showControls !== undefined) {
                config.configuration.showControls = options.showControls;
            }
            
            // Create controls if enabled
            if (config && config.configuration && config.configuration.showControls) {
                createControls();
                setupKeyboardShortcuts();
            }
            
            // Set default viewport
            if (options.defaultViewport) {
                this.setViewport(options.defaultViewport);
            } else if (config.configuration.defaultViewport && config.configuration.defaultViewport !== 'auto') {
                this.setViewport(config.configuration.defaultViewport);
            }
        },
        
        // Set viewport to specific size
        setViewport: function(viewport) {
            setViewport(viewport);
        },
        
        // Get current viewport
        getViewport: function() {
            return currentViewport;
        },
        
        // Reset to auto viewport
        reset: function() {
            setViewport('auto');
        },
        
        // Add custom viewport
        addCustomViewport: function(name, width, options = {}) {
            if (!config) return false;
            
            config.configuration.viewports[name] = {
                width: width,
                name: options.name || name,
                icon: options.icon || '📐',
                color: options.color || '#6366f1',
                description: options.description || `Custom ${width}px viewport`
            };
            
            // Recreate controls to include new viewport
            if (controlsVisible) {
                const controls = document.querySelector(`.${config.classes.controls}`);
                if (controls) controls.remove();
                createControls();
            }
            
            return true;
        },
        
        // Get configuration
        getConfig: function() {
            return config;
        }
    };
    
    // Auto-initialize when DOM is ready
    async function initialize() {
        try {
            await loadConfig();
            loadViewportCSS();
            
            setTimeout(() => {
                console.log('📱 WB Viewport: Component initialized successfully');
                
                const eventName = config?.events?.ready || 'wbViewportReady';
                const event = new CustomEvent(eventName, {
                    detail: { component: 'wb-viewport', config: config }
                });
                document.dispatchEvent(event);
                
                // Auto-init if controls are enabled by default
                if (config && config.configuration && config.configuration.showControls) {
                    window.WBViewport.init();
                }
            }, 100);
        } catch (error) {
            console.error('📱 WB Viewport: Initialization failed', error);
        }
    }
    
    // Use WBComponentUtils if available, otherwise fallback
    if (window.WBComponentUtils && window.WBComponentUtils.onReady) {
        window.WBComponentUtils.onReady(initialize);
    } else {
        // Fallback DOM ready check
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }
    
})();