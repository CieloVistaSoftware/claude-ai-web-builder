// Control Panel Web Component
// Self-contained component for the Website Builder control panel

// Helper function to emit event log events
function logEvent(type, message, details = {}) {
    if (typeof document !== 'undefined' && document.dispatchEvent) {
        document.dispatchEvent(new CustomEvent(`wb:${type}`, {
            detail: {
                message: message,
                source: 'control-panel',
                ...details
            }
        }));
    }
}

logEvent('info', 'Control Panel Component: Starting initialization');
console.log('Control Panel Component: Starting initialization...');

// Load CSS file using WBComponentUtils
function loadCSS() {
    if (window.WBComponentUtils && window.WBComponentUtils.getComponentPath) {
        try {
            const basePath = window.WBComponentUtils.getComponentPath('wb-control-panel.js', '../components/wb-control-panel/');
            const cssPath = basePath + 'wb-control-panel.css';
            window.WBComponentUtils.loadCSS('wb-control-panel', cssPath);
            console.log('✅ Control Panel: CSS loaded via WBComponentUtils from:', cssPath);
        } catch (error) {
            console.warn('⚠️ Control Panel: WBComponentUtils path detection failed, using manual loading:', error);
            loadCSSManually();
        }
    } else if (window.WBComponentUtils && window.WBComponentUtils.getPath) {
        // Legacy getPath method
        try {
            const cssPath = window.WBComponentUtils.getPath('wb-control-panel.js', '../components/wb-control-panel/') + 'wb-control-panel.css';
            window.WBComponentUtils.loadCSS('wb-control-panel', cssPath);
            console.log('✅ Control Panel: CSS loaded via legacy getPath from:', cssPath);
        } catch (error) {
            console.warn('⚠️ Control Panel: Legacy path detection failed, using manual loading:', error);
            loadCSSManually();
        }
    } else {
        console.log('🎛️ Control Panel: WBComponentUtils not available, loading CSS manually...');
        loadCSSManually();
    }
}

// Manual CSS loading fallback
function loadCSSManually() {
    const existingStyles = document.querySelector('link[href*="wb-control-panel.css"]');
    if (!document.getElementById('wb-control-panel-styles') && !existingStyles) {
        console.log('🎛️ Control Panel: Loading CSS file manually...');
        const link = document.createElement('link');
        link.id = 'wb-control-panel-styles';
        link.rel = 'stylesheet';
        link.href = './wb-control-panel.css'; // Relative to current location
        link.onerror = () => {
            // Try alternative paths
            link.href = '../wb-control-panel/wb-control-panel.css';
            link.onerror = () => {
                link.href = '/components/wb-control-panel/wb-control-panel.css'; // Absolute fallback
            };
        };
        document.head.appendChild(link);
    }
}

class ControlPanel extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
        this.config = null;
        this.currentColors = {
            primary: {
                hue: 240,
                saturation: 70,
                lightness: 50
            },
            background: {
                hue: 220,
                saturation: 25,
                lightness: 15
            }
        };
        // JSON configuration cache
        this.navigationConfig = null;
        this.themeConfig = null;

        // REACTIVE: Internal state instead of reading DOM
        this._editModeEnabled = false;

        // Keyboard shortcut configuration - overridable via property setter
        this._keyboardShortcuts = {
            toggle: 'ctrl+p',
            close: 'escape',
            debug: 'ctrl+d'
        };
        this._keyboardHandler = null;
    }

    // Getter/setter for keyboard shortcuts configuration
    get keyboardShortcuts() {
        return this._keyboardShortcuts;
    }

    set keyboardShortcuts(shortcuts) {
        this._keyboardShortcuts = { ...this._keyboardShortcuts, ...shortcuts };
        // Re-setup keyboard listeners if already initialized
        if (this.initialized) {
            this.setupKeyboardShortcuts();
        }
    }

    connectedCallback() {
        console.log('Control Panel Web Component: Connected to DOM');

        // Auto-initialize when connected to DOM
        if (!this.initialized) {
            setTimeout(() => this.init(), 0);
        }

        // Ensure semantic structure exists on component load
        setTimeout(async () => {
            try {
                await this.ensureSemanticStructure();
                // TODO: Implement validateThemeImplementations method
                // this.validateThemeImplementations();
                // TODO: Implement initializeHostElementIntegration method
                // this.initializeHostElementIntegration();
            } catch (error) {
                console.error('Control panel semantic structure error:', error);
                // Dispatch error event for wb-event-log
                document.dispatchEvent(new CustomEvent('wb:error', {
                    detail: {
                        type: 'control-panel-structure-error',
                        message: `Control panel structure failed: ${error.message}`,
                        data: { error: error.message, stack: error.stack }
                    }
                }));
            }
        }, 100);
    }

    disconnectedCallback() {
        console.log('🎛️ Control Panel Web Component: Disconnected from DOM');
    }

    init(config = null) {
        if (this.initialized) return;

        try {
            console.log('Control Panel: Starting initialization...');

            // Load CSS
            loadCSS();

            // Store configuration if provided
            this.config = config || this.getDefaultConfig();

            // Create HTML structure
            this.createHTML();

            // Initialize functionality
            this.setupEventListeners();
            this.setupKeyboardShortcuts();
            this.applyInitialSettings();

            this.initialized = true;

            // Dispatch component ready event to document so main page receives it
            document.dispatchEvent(new CustomEvent('controlPanelReady', {
                detail: { component: this },
                bubbles: true
            }));

            // Also dispatch generic ready event
            document.dispatchEvent(new CustomEvent('wb:control-panel-ready', {
                detail: { component: this },
                bubbles: true
            }));

            logEvent('success', 'Control Panel initialized successfully');
            console.log('Control Panel: Component initialized successfully');

        } catch (error) {
            console.error('🎛️ Control Panel: Failed to initialize component:', error);
            logEvent('error', `Control Panel initialization failed: ${error.message}`);
        }
    }

    getDefaultConfig() {
        return {
            title: "Control Panel",
            sections: [
                {
                    id: "appearance",
                    title: "Appearance",
                    controls: [
                        {
                            component: "wb-select",
                            config: {
                                label: "Theme",
                                id: "theme-select",
                                value: "dark",
                                options: [
                                    { value: "dark", label: "Dark Theme" },
                                    { value: "light", label: "Light Theme" },
                                    { value: "auto", label: "Auto (System)" },
                                    { value: "cyberpunk", label: "Cyberpunk" },
                                    { value: "ocean", label: "Ocean Blue" },
                                    { value: "sunset", label: "Sunset Orange" },
                                    { value: "forest", label: "Forest Green" }
                                ]
                            }
                        },
                        {
                            component: "wb-select",
                            config: {
                                label: "Layout",
                                id: "layout-select",
                                value: "top-nav",
                                options: [
                                    { value: "top-nav", label: "Top Navigation" },
                                    { value: "left-nav", label: "Left Sidebar" },
                                    { value: "right-nav", label: "Right Sidebar" },
                                    { value: "ad-layout", label: "Ad Layout" }
                                ]
                            }
                        }
                    ]
                },
                {
                    id: "primary-color",
                    title: "🎨 Primary Color",
                    controls: [
                        {
                            component: "wb-color-bars",
                            config: {
                                label: "Primary Color (HSL)",
                                id: "primary-color-bars",
                                hue: 240,
                                saturation: 70,
                                lightness: 50,
                                theme: "dark"
                            }
                        }
                    ]
                },
                {
                    id: "features",
                    title: "Editor Features",
                    controls: [
                        {
                            component: "wb-toggle",
                            config: {
                                label: "Gradient Mode",
                                id: "gradient-toggle",
                                checked: false,
                                variant: "primary"
                            }
                        },
                        {
                            component: "wb-toggle",
                            config: {
                                label: "Dark Mode",
                                id: "dark-mode-toggle",
                                checked: true,
                                variant: "secondary"
                            }
                        },
                        {
                            component: "wb-button",
                            config: {
                                label: "Edit Mode",
                                id: "edit-mode-toggle",
                                variant: "success"
                            }
                        }
                    ]
                },
                {
                    id: "actions",
                    title: "File Operations",
                    controls: [
                        {
                            component: "wb-button",
                            config: {
                                label: "📋 Clone Template",
                                id: "clone-btn",
                                variant: "success"
                            }
                        },
                        {
                            component: "wb-button",
                            config: {
                                label: "Save Website",
                                id: "save-btn",
                                variant: "primary"
                            }
                        },
                        {
                            component: "wb-button",
                            config: {
                                label: "Import Website",
                                id: "import-btn",
                                variant: "secondary"
                            }
                        },
                        {
                            component: "wb-button",
                            config: {
                                label: "Reset Settings",
                                id: "reset-btn",
                                variant: "secondary"
                            }
                        }
                    ]
                },
                {
                    id: "event-log",
                    title: "Event Log",
                    controls: [
                        {
                            component: "wb-event-log",
                            config: {
                                label: "Application Events",
                                id: "control-panel-event-log",
                                "max-events": "50",
                                "auto-scroll": "true",
                                "show-timestamps": "true",
                                "show-source": "true",
                                "expandable-details": "false",
                                "toolbar": "false",
                                "search": "false",
                                "filters": "false",
                                "export": "false"
                            }
                        }
                    ]
                }
            ]
        };
    }

    createHTML() {
        console.log('Control Panel: Creating HTML structure...');

        // Create main structure
        this.innerHTML = `
                <div class="control-panel-header">
                    <h3>${this.config.title}</h3>
                    <div class="control-panel-actions">
                        <button class="control-btn" id="minimize-btn" title="Minimize">−</button>
                        <button class="control-btn" id="close-btn" title="Close">×</button>
                    </div>
                </div>
                <div class="control-panel-body">
                    ${this.createSectionsHTML(this.config.sections)}
                </div>
                <div class="drag-handle" id="drag-handle" title="Drag to move panel" style="position: absolute; bottom: 8px; left: 1rem; width: 32px; height: 32px; cursor: grab; background: linear-gradient(135deg, var(--primary, #6366f1), var(--primary-light, #818cf8)); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; opacity: 0.85; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-weight: bold;">⊕</div>
                <div class="resize-handle" id="resize-handle" title="Drag to resize width" style="position: absolute; bottom: 8px; right: 1rem; width: 32px; height: 32px; cursor: ew-resize; background: linear-gradient(135deg, var(--success, #10b981), var(--success-light, #34d399)); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; opacity: 0.85; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-weight: bold;">↔</div>
            `;

        console.log('Control Panel: HTML structure created');
    }

    createSectionsHTML(sections) {
        if (!sections || !Array.isArray(sections)) {
            console.warn('Control Panel: No sections provided');
            return '<div class="control-section"><p>No controls configured</p></div>';
        }

        return sections.map(section => {
            // Add CHS badge for primary-color section
            let titleHTML = section.title || section.id;
            if (section.id === 'primary-color') {
                titleHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                        <span>${section.title || section.id}</span>
                        <span 
                            title="Color Harmony System - Automatically calculates complementary colors"
                            style="
                            background: linear-gradient(135deg, #6366f1, #8b5cf6);
                            color: white;
                            padding: 0.25rem 0.5rem;
                            border-radius: 4px;
                            font-size: 0.65rem;
                            font-weight: 600;
                            letter-spacing: 0.05em;
                            text-transform: uppercase;
                            cursor: help;
                            transition: transform 0.2s;
                        "
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'"
                        >CHS</span>
                    </div>
                `;
            }
            
            return `
                    <div class="control-section" id="section-${section.id}">
                        <h4 class="section-title">${titleHTML}</h4>
                        <div class="control-group">
                            ${this.createControlsHTML(section.controls || [])}
                        </div>
                    </div>
                `;
        }).join('');
    }

    createControlsHTML(controls) {
        if (!controls || !Array.isArray(controls)) {
            return '';
        }

        return controls.map(control => {
            switch (control.component) {
                case 'wb-select':
                    return this.createSelectHTML(control.config);
                case 'wb-toggle':
                    return this.createToggleHTML(control.config);
                case 'wb-slider':
                    return this.createSliderHTML(control.config);
                case 'wb-color-bar':
                    return this.createSingleColorBarHTML(control.config);
                case 'wb-color-bars':
                    return this.createColorBarsHTML(control.config);
                case 'wb-color-harmony':
                    return this.createColorHarmonyHTML(control.config);
                case 'wb-button':
                    return this.createButtonHTML(control.config);
                case 'wb-event-log':
                    return this.createEventLogHTML(control.config);
                default:
                    console.warn('Unknown control component:', control.component);
                    return '';
            }
        }).join('');
    }

    createSelectHTML(config) {
        const optionsJson = JSON.stringify(config.options.map(opt => ({
            value: opt.value,
            label: opt.label || opt.text
        })));

        return `
                <div class="control-item">
                    <label class="control-label">${config.label}</label>
                    <wb-select 
                        id="${config.id}" 
                        value="${config.value || ''}"
                        options='${optionsJson}'
                        variant="default"
                        size="md">
                    </wb-select>
                </div>
            `;
    }

    createToggleHTML(config) {
        return `
                <div class="control-item">
                    <wb-toggle 
                        id="${config.id}"
                        label="${config.label}"
                        ${config.checked ? 'checked' : ''}
                        variant="${config.variant || 'default'}"
                        size="md">
                    </wb-toggle>
                </div>
            `;
    }

    createSliderHTML(config) {
        return `
                <div class="control-item">
                    <label class="control-label">${config.label}</label>
                    <input type="range" id="${config.id}" 
                           min="${config.min || 0}" 
                           max="${config.max || 100}" 
                           value="${config.value || 50}"
                           step="${config.step || 1}"
                           class="control-slider">
                    <span class="slider-value">${config.value || 50}</span>
                </div>
            `;
    }

    createSingleColorBarHTML(config) {
        const currentTheme = document.body.getAttribute('data-theme') || config.theme || 'dark';
        const type = config.type || 'hue';
        const value = config[type] || (type === 'hue' ? 240 : type === 'saturation' ? 70 : 50);

        console.log(`🎨 Creating single wb-color-bar (${type}) with config:`, config);

        return `
                <div class="control-item">
                    <label class="control-label">${config.label}</label>
                    <wb-color-bar id="${config.id}" 
                                  type="${type}"
                                  value="${value}"
                                  theme="${currentTheme}">
                    </wb-color-bar>
                </div>
            `;
    }

    createColorBarsHTML(config) {
        const currentTheme = document.body.getAttribute('data-theme') || config.theme || 'dark';

        console.log(`🎨 Creating wb-color-bars with config:`, config);

        return `
                <div class="control-item">
                    <label class="control-label">${config.label}</label>
                    <wb-color-bars id="${config.id}" 
                                   text-hue="${config.hue}" 
                                   text-saturation="${config.saturation}" 
                                   text-lightness="${config.lightness}"
                                   theme="${currentTheme}">
                    </wb-color-bars>
                </div>
            `;
    }

    createColorHarmonyHTML(config) {
        const currentTheme = document.body.getAttribute('data-theme') || config.theme || 'dark';

        console.log(`🌊 Creating wb-color-harmony with config:`, config);

        return `
                <div class="control-item">
                    <label class="control-label">${config.label}</label>
                    <wb-color-harmony 
                        id="${config.id}" 
                        hue="${config.hue}" 
                        saturation="${config.saturation}" 
                        lightness="${config.lightness}"
                        harmony-mode="${config.harmonyMode || 'complementary'}"
                        modulator-hue="${config.modulatorHue || 60}"
                        mixing-depth="${config.mixingDepth || 50}"
                        theme="${currentTheme}">
                    </wb-color-harmony>
                </div>
            `;
    }

    createButtonHTML(config) {
        return `
                <div class="control-item">
                    <wb-button 
                        id="${config.id}"
                        variant="${config.variant || 'primary'}"
                        size="md"
                        full-width="true">
                        ${config.label}
                    </wb-button>
                </div>
            `;
    }

    createEventLogHTML(config) {
        return `
                <div class="control-item event-log-container">
                    <label class="control-label">${config.label}</label>
                    <wb-event-log 
                        id="${config.id}"
                        max-events="${config['max-events'] || '50'}"
                        auto-scroll="${config['auto-scroll'] || 'true'}"
                        show-timestamps="${config['show-timestamps'] || 'true'}"
                        show-source="${config['show-source'] || 'true'}"
                        expandable-details="${config['expandable-details'] || 'true'}"
                        toolbar="${config['toolbar'] || 'true'}"
                        search="${config['search'] || 'true'}"
                        filters="${config['filters'] || 'true'}"
                        export="${config['export'] || 'true'}"
                        style="height: 250px; border-radius: 8px; border: 1px solid var(--border-color, #334155);">
                    </wb-event-log>
                </div>
            `;
    }

    setupEventListeners() {
        console.log('Control Panel: Setting up event listeners...');

        // Layout selector
        const layoutSelect = this.querySelector('#layout-select');
        if (layoutSelect) {
            layoutSelect.addEventListener('wb-select:change', (e) => this.handleLayoutChange(e));
            console.log('✅ Layout selector event listener attached');
        } else {
            console.warn('⚠️ Layout selector (#layout-select) not found in DOM');
        }

       

        // SPA toggle
        const spaToggle = this.querySelector('#spa-mode-toggle');
        if (spaToggle) {
            spaToggle.addEventListener('click', (e) => this.handleSpaToggle(e));
        }

        // Edit mode toggle
        const editToggle = this.querySelector('#edit-mode-toggle');
        if (editToggle) {
            editToggle.addEventListener('click', () => this.toggleEditMode());
        }

        // Color sliders - wb-color-bars handles its own events
        // No manual setup needed

        // File operation buttons
        const saveBtn = this.querySelector('#save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveWebsite());
        }

        const resetBtn = this.querySelector('#reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetContent());
        }

        // Panel controls
        const minimizeBtn = this.querySelector('#minimize-btn');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        }

        const closeBtn = this.querySelector('#close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Drag handle functionality
        const dragHandle = this.querySelector('#drag-handle');
        if (dragHandle && this.getAttribute('draggable') !== 'false') {
            this.setupDragFunctionality(dragHandle);
            console.log('Control Panel: Drag functionality enabled');
        }

        // Resize handle functionality
        const resizeHandle = this.querySelector('#resize-handle');
        if (resizeHandle) {
            this.setupResizeFunctionality(resizeHandle);
            console.log('Control Panel: Resize functionality enabled');
        }

        console.log('Control Panel: Event listeners setup complete');
    }

    // Event Handlers - REACTIVE APPROACH
    async handleLayoutChange(e) {
        const layout = e.detail ? e.detail.value : e.target.value;

        // 🎯 REACTIVE APPROACH: Just fire the layout change event
        // wb-layout component (if present) will handle all DOM manipulation
        // Other components listening will react accordingly

        const layoutChangeEvent = new CustomEvent('wb:layout-changed', {
            detail: {
                layout: layout,
                source: 'control-panel',
                timestamp: Date.now()
            },
            bubbles: true,
            composed: true
        });

        document.dispatchEvent(layoutChangeEvent);

        // Save to localStorage - this is control panel's responsibility
        localStorage.setItem('wb-layout', layout);

        // Log the change
        logEvent('info', `Layout changed to: ${layout} - Event dispatched`);
        console.log(`🎯 Fired layout change event: ${layout}`);
        console.log('📡 wb-layout component will handle all DOM updates reactively');

        // Legacy support: Also dispatch old event name for backward compatibility
        document.dispatchEvent(new CustomEvent('layoutChanged', {
            detail: { layout, source: 'controlPanel' },
            bubbles: true
        }));
    }

    async ensureSemanticStructure() {
        // Ensure required semantic elements exist for proper layout functionality
        let structureChanged = false;

        // Check for nav element and create layout-specific navigation
        let nav = this.findNavigationElement();
        const currentLayout = document.body.getAttribute('data-layout') || 'top-nav';

        if (!nav) {
            nav = await this.createLayoutSpecificNav(currentLayout);
            structureChanged = true;
        } else {
            // Update existing nav to match current layout
            this.updateNavForLayout(nav, currentLayout);
        }

        // Check for header element
        let header = document.querySelector('header, .wb-header');
        if (!header) {
            header = document.createElement('header');
            header.className = 'wb-header';
            header.innerHTML = '<h1>Website Title</h1>';
            structureChanged = true;
        }

        // Check for main element
        let main = document.querySelector('main, .main-content, .wb-main');
        if (!main) {
            // Find existing content to wrap
            const existingContent = Array.from(document.body.children)
                .filter(el =>
                    !el.matches('nav, header, footer, main, script, link, style, control-panel') &&
                    !el.hasAttribute('data-wb-component') &&
                    !el.classList.contains('wb-header') &&
                    !el.classList.contains('wb-footer') &&
                    !el.classList.contains('main-content')
                );

            main = document.createElement('main');
            main.className = 'main-content wb-main';

            if (existingContent.length === 0) {
                main.innerHTML = '<div class="demo-content"><h2>Main Content Area</h2><p>Your content goes here.</p></div>';
            }

            structureChanged = true;
        }

        // Check for footer element
        let footer = document.querySelector('footer, .wb-footer');
        if (!footer) {
            footer = document.createElement('footer');
            footer.className = 'wb-footer';
            footer.innerHTML = '<p>&copy; 2025 Website Builder. All rights reserved.</p>';
            structureChanged = true;
        }

        if (structureChanged) {
            // Organize semantic structure in proper order
            this.organizeSemanticStructure(nav, header, main, footer);
            logEvent('info', 'Semantic structure created: nav, header, main, footer elements added');
        }
    }

    /**
     * Load navigation configuration from JSON file
     * @returns {Promise<Object>} Navigation configuration object
     */
    async loadNavigationConfig() {
        try {
            const configPath = this.resolveConfigPath('config/navigation-layouts.json');
            const response = await fetch(configPath);
            if (!response.ok) {
                throw new Error(`Failed to load navigation config: ${response.status}`);
            }
            const config = await response.json();
            console.log('✅ Loaded navigation configuration from JSON');
            return config;
        } catch (error) {
            console.error('⚠️ Error loading navigation config:', error);
            logEvent('error', `Failed to load navigation config: ${error.message}`);
            return null;
        }
    }

    /**
     * Load theme configuration from JSON file
     * @returns {Promise<Object>} Theme configuration object
     */
    async loadThemeConfig() {
        try {
            const configPath = this.resolveConfigPath('config/themes.json');
            const response = await fetch(configPath);
            if (!response.ok) {
                throw new Error(`Failed to load theme config: ${response.status}`);
            }
            const config = await response.json();
            console.log('✅ Loaded theme configuration from JSON');
            return config;
        } catch (error) {
            console.error('⚠️ Error loading theme config:', error);
            logEvent('error', `Failed to load theme config: ${error.message}`);
            return null;
        }
    }

    /**
     * Resolve configuration file path relative to component
     * @param {string} relativePath - Relative path to config file
     * @returns {string} Absolute path to config file
     */
    resolveConfigPath(relativePath) {
        // Use direct path from component location
        const currentScript = document.currentScript;
        let scriptPath;

        if (currentScript && currentScript instanceof HTMLScriptElement) {
            scriptPath = currentScript.src;
        } else {
            const scripts = Array.from(document.querySelectorAll('script'));
            const found = scripts.find(s => s instanceof HTMLScriptElement && s.src.includes('wb-control-panel.js'));
            scriptPath = found instanceof HTMLScriptElement ? found.src : undefined;
        }

        if (scriptPath) {
            const componentDir = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
            return `${componentDir}/${relativePath}`;
        }

        // Fallback: try WBComponentUtils
        if (window.WBComponentUtils && window.WBComponentUtils.getPath) {
            const basePath = window.WBComponentUtils.getPath('wb-control-panel.js', '../components/wb-control-panel/');
            return `${basePath}${relativePath}`;
        }

        // Last resort: relative to current page
        return `components/wb-control-panel/${relativePath}`;
    }

    async createLayoutSpecificNav(layout) {
        // Load wb-nav component first
        await this.loadSingleComponent('wb-nav', { discoverDependencies: true });

        // Create wb-nav custom element
        const nav = document.createElement('wb-nav');
        nav.setAttribute('data-wb-component', 'navigation');

        // Set layout-specific attributes from JSON config
        const layoutConfig = await this.getLayoutConfigForWBNav(layout);
        if (layoutConfig.layout) {
            nav.setAttribute('layout', layoutConfig.layout);
        }
        if (layoutConfig.variant) {
            nav.setAttribute('variant', layoutConfig.variant);
        }
        if (layoutConfig.position) {
            nav.setAttribute('position', layoutConfig.position);
        }

        // Set navigation items from JSON config
        const navItems = await this.getNavItemsForLayout(layout);
        nav.setAttribute('items', JSON.stringify(navItems));

        // Set aria label
        nav.setAttribute('aria-label', 'Main navigation');

        console.log(`📋 Created wb-nav from JSON config for layout: ${layout}`);
        return nav;
    }

    async updateNavForLayout(nav, layout) {
        // Check if this is a wb-nav custom element
        if (nav.tagName.toLowerCase() === 'wb-nav') {
            // Update wb-nav attributes from JSON config
            const layoutConfig = await this.getLayoutConfigForWBNav(layout);

            if (layoutConfig.layout) {
                nav.setAttribute('layout', layoutConfig.layout);
            }
            if (layoutConfig.variant) {
                nav.setAttribute('variant', layoutConfig.variant);
            }
            if (layoutConfig.position) {
                nav.setAttribute('position', layoutConfig.position);
            }

            // Update items if it's a generic navigation
            if (this.isGenericWBNavigation(nav)) {
                const navItems = await this.getNavItemsForLayout(layout);
                nav.setAttribute('items', JSON.stringify(navItems));

                // Call setItems method if available
                if (typeof nav.setItems === 'function') {
                    nav.setItems(navItems);
                }
            }
            console.log(`📋 Updated wb-nav from JSON config for layout: ${layout}`);
        } else {
            // Fallback for non-wb-nav elements
            this.applyLayoutSpecificNavStyles(nav, layout);
        }
    }

    async getLayoutConfigForWBNav(layout) {
        // Load navigation configuration from JSON if not cached
        if (!this.navigationConfig) {
            this.navigationConfig = await this.loadNavigationConfig();
        }

        // Return wb-nav compatible configuration from JSON
        const layoutConfig = this.navigationConfig?.layouts?.[layout];
        if (layoutConfig && layoutConfig.wbNavConfig) {
            return layoutConfig.wbNavConfig;
        }

        // Fallback to default config
        console.warn(`Layout config not found for "${layout}", using default`);
        return {
            layout: 'horizontal',
            variant: 'default',
            position: 'top'
        };
    }

    async getNavItemsForLayout(layout) {
        // Load navigation configuration from JSON if not cached
        if (!this.navigationConfig) {
            this.navigationConfig = await this.loadNavigationConfig();
        }

        // Return navigation items from JSON
        const layoutConfig = this.navigationConfig?.layouts?.[layout];
        if (layoutConfig && layoutConfig.navItems) {
            return layoutConfig.navItems;
        }

        // Fallback to basic navigation items
        console.warn(`Nav items not found for layout "${layout}", using fallback`);
        return [
            { id: 'home', text: 'Home', href: '#home', icon: '🏠', active: true },
            { id: 'about', text: 'About', href: '#about', icon: 'ℹ️' },
            { id: 'services', text: 'Services', href: '#services', icon: '⚙️' },
            { id: 'contact', text: 'Contact', href: '#contact', icon: '📧' }
        ];
    }

    getSchemaSpecForLayout(layout) {
        // Return schema specifications for different layouts
        const layoutSpecs = {
            'top-nav': {
                navClasses: ['wb-nav-top', 'horizontal'],
                navAttributes: {
                    'data-layout': 'top-nav',
                    'orientation': 'horizontal'
                }
            },
            'left-sidebar': {
                navClasses: ['wb-nav-sidebar', 'vertical'],
                navAttributes: {
                    'data-layout': 'left-sidebar',
                    'orientation': 'vertical'
                }
            },
            'right-sidebar': {
                navClasses: ['wb-nav-sidebar', 'vertical'],
                navAttributes: {
                    'data-layout': 'right-sidebar',
                    'orientation': 'vertical'
                }
            },
            'ad-layout': {
                navClasses: ['wb-nav-ad', 'compact'],
                navAttributes: {
                    'data-layout': 'ad-layout',
                    'orientation': 'horizontal'
                }
            }
        };

        return layoutSpecs[layout] || {
            navClasses: ['wb-nav-default'],
            navAttributes: {
                'data-layout': layout || 'default'
            }
        };
    }

    applyLayoutSpecificNavStyles(nav, layout) {
        // Remove existing layout classes
        nav.classList.remove('nav-top', 'nav-left', 'nav-right', 'nav-ad', 'nav-sidebar', 'nav-enhanced');

        // Get schema specifications for this layout
        const schemaSpec = this.getSchemaSpecForLayout(layout);

        // Apply schema-compliant classes
        if (schemaSpec.navClasses) {
            schemaSpec.navClasses.forEach(cls => nav.classList.add(cls));
        }

        // Apply schema-compliant attributes
        if (schemaSpec.navAttributes) {
            Object.entries(schemaSpec.navAttributes).forEach(([attr, value]) => {
                nav.setAttribute(attr, value);
            });
        }

        // Validate against wb-nav schema after applying styles
        this.validateWBNavigationAgainstSchema(nav, layout);
    }

    isGenericWBNavigation(nav) {
        // Check if wb-nav contains only generic items
        if (nav.tagName.toLowerCase() !== 'wb-nav') return false;

        const genericTexts = ['Home', 'About', 'Services', 'Contact', 'Portfolio', 'Get Started'];

        // Check items attribute
        const itemsAttr = nav.getAttribute('items');
        if (itemsAttr) {
            try {
                const items = JSON.parse(itemsAttr);
                return items.every(item => genericTexts.includes(item.text));
            } catch (e) {
                return true; // If can't parse, assume generic
            }
        }

        // Check rendered links as fallback
        const links = nav.querySelectorAll('a, .wb-nav-link');
        if (links.length === 0) return true;

        const linkTexts = Array.from(links).map(link => link.textContent.trim());
        return linkTexts.every(text => genericTexts.includes(text) || text === '');
    }

    validateWBNavigationAgainstSchema(nav, layout) {
        // Validate wb-nav element against layout specifications
        const wbNavSpec = this.getWBNavSpecForLayout(layout);
        const violations = [];

        // Check if it's the correct element type
        if (nav.tagName.toLowerCase() !== wbNavSpec.requiredElement) {
            violations.push(`Expected ${wbNavSpec.requiredElement}, got ${nav.tagName.toLowerCase()}`);
            return violations; // Can't validate further if wrong element type
        }

        // Check required attributes
        if (wbNavSpec.requiredAttributes) {
            Object.entries(wbNavSpec.requiredAttributes).forEach(([attr, value]) => {
                const actualValue = nav.getAttribute(attr);
                if (actualValue !== value) {
                    violations.push(`Missing/incorrect attribute: ${attr}="${value}" (actual: "${actualValue}")`);
                }
            });
        }

        // Check variant validity
        const currentVariant = nav.getAttribute('variant');
        if (currentVariant && wbNavSpec.validVariants && !wbNavSpec.validVariants.includes(currentVariant)) {
            violations.push(`Invalid variant "${currentVariant}" for layout "${layout}". Valid: ${wbNavSpec.validVariants.join(', ')}`);
        }

        // Check items structure if available
        const itemsAttr = nav.getAttribute('items');
        if (itemsAttr) {
            try {
                const items = JSON.parse(itemsAttr);
                if (!Array.isArray(items)) {
                    violations.push('Items attribute must be a JSON array');
                } else if (items.length === 0) {
                    violations.push('Navigation should have at least one item');
                }
            } catch (e) {
                violations.push('Items attribute contains invalid JSON');
            }
        }

        if (violations.length > 0) {
            console.warn('🚨 WB Navigation Schema Violations:', violations);
            logEvent('warning', `WB Navigation schema violations: ${violations.join('; ')}`);
        } else {
            logEvent('success', `WB Navigation validates successfully for layout: ${layout}`);
        }

        return violations.length === 0;
    }

    getWBNavSpecForLayout(layout) {
        // Return wb-nav specifications for layout validation
        const specs = {
            'top-nav': {
                requiredElement: 'wb-nav',
                requiredAttributes: {
                    'layout': 'horizontal',
                    'position': 'top',
                    'role': 'navigation',
                    'aria-label': 'Main navigation'
                },
                validVariants: ['default', 'pills', 'tabs', 'minimal']
            },
            'left-nav': {
                requiredElement: 'wb-nav',
                requiredAttributes: {
                    'layout': 'vertical',
                    'position': 'left',
                    'role': 'navigation',
                    'aria-label': 'Main navigation'
                },
                validVariants: ['pills', 'minimal']
            },
            'right-nav': {
                requiredElement: 'wb-nav',
                requiredAttributes: {
                    'layout': 'vertical',
                    'position': 'right',
                    'role': 'navigation',
                    'aria-label': 'Main navigation'
                },
                validVariants: ['pills', 'minimal']
            },
            'ad-layout': {
                requiredElement: 'wb-nav',
                requiredAttributes: {
                    'layout': 'horizontal',
                    'position': 'top',
                    'variant': 'gradient',
                    'role': 'navigation',
                    'aria-label': 'Main navigation'
                },
                validVariants: ['gradient', 'default']
            }
        };

        return specs[layout] || specs['top-nav'];
    }

    validateWBNavStructure(nav, layout) {
        // Validate wb-nav internal structure based on layout requirements
        if (nav.tagName.toLowerCase() !== 'wb-nav') {
            return false;
        }

        // Check for essential wb-nav internal elements (these get created by wb-nav component)
        const hasContainer = nav.querySelector('.wb-nav-container') !== null;
        const hasNavList = nav.querySelector('.wb-nav-list') !== null;

        // For layouts that require brand/CTA elements
        if (layout === 'ad-layout') {
            const hasBrand = nav.querySelector('.wb-nav-brand') !== null || nav.getAttribute('brand-text');
            return hasContainer && hasNavList && hasBrand;
        }

        // Basic structure validation for other layouts
        return hasContainer && hasNavList;
    }

    organizeSemanticStructure(nav, header, main, footer) {
        // Collect existing content that should go in main
        const existingContent = Array.from(document.body.children)
            .filter(el =>
                !el.matches('nav, header, footer, main, script, link, style, control-panel') &&
                !el.hasAttribute('data-wb-component') &&
                !el.classList.contains('wb-header') &&
                !el.classList.contains('wb-footer') &&
                !el.classList.contains('main-content') &&
                !el.classList.contains('wb-main')
            );

        // Move existing content to main if main is empty
        if (main && existingContent.length > 0 && main.children.length === 0) {
            existingContent.forEach(el => main.appendChild(el));
        }

        // Ensure proper document order: nav -> header -> main -> footer
        const elementsToOrder = [nav, header, main, footer].filter(Boolean);

        elementsToOrder.forEach((element, index) => {
            if (!element.parentNode || element.parentNode !== document.body) {
                document.body.appendChild(element);
            }

            // Set proper order using CSS order property
            element.style.order = index.toString();
        });

        // REACTIVE: Dispatch layout structure event instead of direct body manipulation
        document.dispatchEvent(new CustomEvent('wb:layout-structure-changed', {
            detail: {
                layout: 'semantic',
                elements: { nav: !!nav, header: !!header, main: !!main, footer: !!footer },
                source: 'wb-control-panel-semantic-structure',
                requiresFlexLayout: true,
                elementOrder: ['nav', 'header', 'main', 'footer']
            },
            bubbles: true
        }));

        
    }

    // Theme validation is delegated to wb-theme component
    // Control panel just fires events, doesn't validate implementations

  

    // Get the host element that contains this control panel
    getHostElement() {
        // Try to find a specific host element or container
        let hostElement = this.parentElement;

        // Look for common container elements
        while (hostElement && hostElement !== document.body) {
            if (hostElement.matches('.container, .wrapper, .main-content, main, .page, .app') ||
                hostElement.hasAttribute('data-wb-host') ||
                hostElement.classList.contains('wb-host')) {
                return hostElement;
            }
            hostElement = hostElement.parentElement;
        }

        // Fallback: use the direct parent or body
        return this.parentElement || document.body;
    }

    // Theme application is handled by wb-theme component listening to wb:theme-changed event
    // Components that need theme updates listen to the event themselves

    // REMOVED: applyColorToDescendants() is no longer needed
    // 🎯 REACTIVE APPROACH: wb-color-bars applies CSS immediately when changed
    // Control panel doesn't manipulate CSS or relay events
    // wb-color-bars fires events directly, other components listen

    handleSpaToggle(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const isActive = button.classList.contains('active');
        const newState = !isActive;

        button.classList.toggle('active', newState);
        button.dataset.checked = newState;

        const footerMode = newState ? 'bottom' : 'same-page';

        // REACTIVE: Dispatch footer mode event instead of direct body manipulation
        document.dispatchEvent(new CustomEvent('wb:footer-mode-changed', {
            detail: {
                footerMode: footerMode,
                enabled: newState,
                source: 'wb-control-panel-footer-toggle'
            },
            bubbles: true
        }));

        if (window.WBEventLog) {
            window.WBEventLog.logInfo(`Fixed footer: ${newState ? 'enabled' : 'disabled'}`, {
                component: 'wb-control-panel',
                method: 'toggleFixedFooter',
                footerMode: footerMode,
                line: 1201
            });
        }
    }

    toggleEditMode() {
        // REACTIVE: Get current state from event system instead of body classes
        const currentState = this.isEditModeEnabled();
        const newState = !currentState;

        // REACTIVE: Dispatch edit mode event instead of direct body manipulation
        document.dispatchEvent(new CustomEvent('wb:edit-mode-changed', {
            detail: {
                enabled: newState,
                source: 'wb-control-panel-edit-toggle',
                previousState: currentState
            },
            bubbles: true
        }));

        // Store state internally for next check
        this._editModeEnabled = newState;

        // Update button state
        const editBtn = this.querySelector('#edit-mode-toggle');
        if (editBtn) {
            editBtn.textContent = newState ? 'Exit Edit' : 'Edit Mode';
            editBtn.classList.toggle('active', newState);
        }

        // Dispatch events to document so main page receives them
        document.dispatchEvent(new CustomEvent('editModeChanged', {
            detail: { enabled: newState, source: 'controlPanel' },
            bubbles: true
        }));

        // Also dispatch generic edit mode change event
        document.dispatchEvent(new CustomEvent('wb:edit-mode-changed', {
            detail: { enabled: newState, source: 'controlPanel' },
            bubbles: true
        }));

        logEvent('info', `Edit mode ${newState ? 'enabled' : 'disabled'}`);
    }

    async setupColorSliders() {
        // Load color components first
        await this.loadComponents(['wb-color-bars', 'wb-color-bar'], { discoverDependencies: true });
        // 🎯 REACTIVE APPROACH: Listen to events bubbling up from ANY wb-color-bars component
        // Don't query for specific IDs - just listen to the events they fire

        // Listen for colorchange events from any wb-color-bars component
        this.addEventListener('colorchange', (e) => {
            const customEvent = /** @type {CustomEvent} */ (e);
            // Event bubbles up from wb-color-bars, contains all necessary data
            console.log('🎨 Color change event received:', customEvent.detail);
            // Determine color type from event detail or element ID
            const colorType = this.determineColorType(customEvent);
            // Relay the standardized color change event
            this.handleColorBarsChange(customEvent, colorType);
        });
        // Listen for colorselect events from any wb-color-bars component
        this.addEventListener('colorselect', (e) => {
            const customEvent = /** @type {CustomEvent} */ (e);
            console.log('🎨 Color select event received:', customEvent.detail);
            // Determine color type from event detail or element ID
            const colorType = this.determineColorType(customEvent);
            // Handle final color selection
            this.handleColorBarsSelect(customEvent, colorType);
        });
        // Listen for harmony palette events and apply to :root
        this.addEventListener('wb:color-harmony-change', (e) => {
            const customEvent = /** @type {CustomEvent} */ (e);
            if (!customEvent.detail) return;
            // Apply text palette
            if (Array.isArray(customEvent.detail.textPalette)) {
                customEvent.detail.textPalette.forEach(color => {
                    const varName = `--color-text-${color.name.toLowerCase().replace(/\s+/g, '-')}`;
                    const hsl = `hsl(${Math.round(color.hue)}, ${Math.round(color.saturation)}%, ${Math.round(color.lightness)}%)`;
                    document.documentElement.style.setProperty(varName, hsl);
                });
            }
            // Apply background palette
            if (Array.isArray(customEvent.detail.bgPalette)) {
                customEvent.detail.bgPalette.forEach(color => {
                    const varName = `--color-bg-${color.name.toLowerCase().replace(/\s+/g, '-')}`;
                    const hsl = `hsl(${Math.round(color.hue)}, ${Math.round(color.saturation)}%, ${Math.round(color.lightness)}%)`;
                    document.documentElement.style.setProperty(varName, hsl);
                });
            }
            // Optionally log
            console.log('🎨 CSS variables updated from harmony palette', customEvent.detail);
        });
        console.log('✅ Color event listeners attached - listening for events from all wb-color-bars components');
    }

    /**
     * Determine color type from event source
     * @param {CustomEvent} event - The color change event
     * @returns {string} Color type (primary, background, etc.)
     */
    determineColorType(event) {
        // Check event detail first (if wb-color-bars provides it)
        if (event.detail && event.detail.colorType) {
            return event.detail.colorType;
        }

        // Fallback: Determine from element ID
        const element = /** @type {HTMLElement} */ (event.target);
        const elementId = element.id || '';

        if (elementId.includes('primary')) {
            return 'primary';
        } else if (elementId.includes('bg') || elementId.includes('background')) {
            return 'background';
        }

        // Default to primary if can't determine
        console.warn('⚠️ Could not determine color type, defaulting to primary');
        return 'primary';
    }

    /**
     * Generic component loading with automatic dependency discovery
     * @param {string|Array} componentNames - Component name(s) to load
     * @param {Object} options - Loading options
     */
    async loadComponents(componentNames, options = {}) {
        const names = Array.isArray(componentNames) ? componentNames : [componentNames];
        const { timeout = 10000, discoverDependencies = true } = options;

        for (const componentName of names) {
            await this.loadSingleComponent(componentName, { timeout, discoverDependencies });
        }
    }

    /**
     * Load a single component using schema-driven WBComponentRegistry
     * @param {string} componentName - Component name to load
     * @param {Object} options - Loading options
     */
    async loadSingleComponent(componentName, options = {}) {
        const { timeout = 10000 } = options;

        // Check if already loaded
        if (customElements.get(componentName)) {
            console.log(`✅ ${componentName} already loaded`);
            return;
        }

        // 🎯 SCHEMA-DRIVEN APPROACH: Use WBComponentRegistry exclusively
        // Registry reads component's schema file and handles:
        // - Dependency discovery and resolution
        // - Load order based on schema priority
        // - Custom element registration
        // - Metadata and health monitoring
        //
        // Control panel just requests components by name - registry handles the rest

        if (!window.WBComponentRegistry) {
            console.error(`❌ WBComponentRegistry not available - cannot load ${componentName}`);
            throw new Error('WBComponentRegistry required for schema-driven component loading');
        }

        try {
            console.log(`🔄 Loading ${componentName} via schema-driven registry...`);
            await window.WBComponentRegistry.loadComponent(componentName, timeout);
            console.log(`✅ ${componentName} loaded successfully (schema-driven)`);
        } catch (error) {
            console.error(`❌ Failed to load ${componentName}:`, error);
            throw error;
        }
    }

    // REMOVED: discoverComponentDependencies() and discoverDependenciesFromSchema()
    // 🎯 SCHEMA-DRIVEN APPROACH: WBComponentRegistry handles all dependency discovery
    // by reading component schema files automatically. Control panel doesn't need
    // to implement dependency discovery logic - that's the registry's responsibility.

    handleColorBarsChange(e, colorType) {
        // � REACTIVE APPROACH: wb-color-bars already applied CSS changes immediately
        // Control panel just tracks/logs the change, doesn't manipulate anything

        console.log(`🎨 Color bars change detected for ${colorType}:`, e.detail);

        const colorData = e.detail;

        // Update current colors tracking (for reference only)
        this.currentColors[colorType] = {
            hue: colorData.hue,
            saturation: colorData.saturation,
            lightness: colorData.lightness
        };

        // Just log the change - wb-color-bars already updated CSS
        logEvent('info', `${colorType} color changed: ${colorData.hsl} (applied by wb-color-bars)`);
        console.log(`📡 ${colorType} color changed by wb-color-bars: ${colorData.hex}`);
    }

    handleColorBarsSelect(e, colorType) {
        // 🎯 REACTIVE APPROACH: wb-color-bars already applied final color
        // Control panel just saves to localStorage for persistence

        const colorData = e.detail;
        localStorage.setItem(`wb-${colorType}-color`, JSON.stringify(colorData));

        logEvent('success', `${colorType} color selected and saved: ${colorData.hex}`);
        console.log(`💾 Saved ${colorType} color to localStorage`);
    }

    saveWebsite() {
        try {
            const html = document.documentElement.outerHTML;
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `website-${new Date().toISOString().split('T')[0]}.html`;
            a.click();

            URL.revokeObjectURL(url);
            logEvent('success', 'Website saved successfully');
        } catch (error) {
            logEvent('error', `Save failed: ${error.message}`);
        }
    }

    resetContent() {
        if (confirm('Are you sure you want to reset all content? This cannot be undone.')) {
            location.reload();
        }
    }

   

    setupKeyboardShortcuts() {
        // Remove existing listener if any
        if (this._keyboardHandler) {
            document.removeEventListener('keydown', this._keyboardHandler);
        }

        // Create keyboard handler
        this._keyboardHandler = (e) => {
            const shortcuts = this._keyboardShortcuts;

            // Toggle shortcut (default: Ctrl+P)
            if (shortcuts.toggle && this.matchesShortcut(e, shortcuts.toggle)) {
                e.preventDefault();
                if (this.style.display === 'none') {
                    this.show();
                } else {
                    this.hide();
                }
            }

            // Close shortcut (default: Escape)
            if (shortcuts.close && this.matchesShortcut(e, shortcuts.close) && this.style.display !== 'none') {
                e.preventDefault();
                this.hide();
            }

            // Debug shortcut (default: Ctrl+D)
            if (shortcuts.debug && this.matchesShortcut(e, shortcuts.debug)) {
                e.preventDefault();
                this.logDebugInfo();

                // Also trigger debug on other components
                const eventLog = /** @type {any} */ (document.querySelector('wb-event-log'));
                if (eventLog && typeof eventLog.logDebugInfo === 'function') {
                    eventLog.logDebugInfo();
                }

                if (window.WBComponentRegistry?.generateHealthReport) {
                    const report = window.WBComponentRegistry.generateHealthReport();
                    if (window.WBEventLog?.logDebug) {
                        window.WBEventLog.logDebug('Registry Health Report', report);
                    } else {
                        console.log('Registry Health Report:', report);
                    }
                }
            }
        };

        // Add listener
        document.addEventListener('keydown', this._keyboardHandler);
        logEvent('info', 'Keyboard shortcuts configured', this._keyboardShortcuts);
    }

    matchesShortcut(event, shortcut) {
        // Parse shortcut string (e.g., 'ctrl+p', 'escape', 'ctrl+shift+d')
        const parts = shortcut.toLowerCase().split('+');
        const key = parts[parts.length - 1];
        const needsCtrl = parts.includes('ctrl') || parts.includes('control');
        const needsShift = parts.includes('shift');
        const needsAlt = parts.includes('alt');
        const needsMeta = parts.includes('meta') || parts.includes('cmd');

        // Check modifiers
        if (needsCtrl && !event.ctrlKey && !event.metaKey) return false;
        if (needsShift && !event.shiftKey) return false;
        if (needsAlt && !event.altKey) return false;
        if (needsMeta && !event.metaKey) return false;

        // Check key
        return event.key.toLowerCase() === key;
    }

  

    logDebugInfo() {
        // Component encapsulates getting AND logging its own debug info
        const themeSelect = /** @type {any} */ (this.querySelector('#theme-select'));
        const layoutSelect = /** @type {any} */ (this.querySelector('#layout-select'));
        const debugInfo = {
            initialized: this.initialized || false,
            visible: this.style.display !== 'none',
            currentTheme: themeSelect?.value || 'unknown',
            currentLayout: layoutSelect?.value || 'unknown',
            dependencies: {
                'wb-color-bars': !!this.querySelector('wb-color-bars'),
                'wb-toggle': !!this.querySelector('wb-toggle'),
                'wb-select': !!this.querySelector('wb-select'),
                'wb-button': !!this.querySelector('wb-button')
            },
            config: this.config || null
        };

        if (window.WBEventLog?.logDebug) {
            window.WBEventLog.logDebug('Control Panel Debug Info', debugInfo);
        } else {
            console.log('Control Panel Debug Info:', debugInfo);
        }

        return debugInfo;
    }

    applyInitialSettings() {
        // 🎯 SCHEMA-DRIVEN REACTIVE APPROACH: 
        // Set initial values on wb-color-bars components - THEY apply CSS immediately
        // Fire events for wb-theme and wb-layout to react to

        const savedTheme = localStorage.getItem('wb-theme') || 'dark';
        const savedLayout = localStorage.getItem('wb-layout') || 'top-nav';

        // Set dropdown values (UI state only)
        const themeSelect = /** @type {any} */ (this.querySelector('#theme-select'));
        if (themeSelect) {
            themeSelect.value = savedTheme;
        }

        const layoutSelect = /** @type {any} */ (this.querySelector('#layout-select'));
        if (layoutSelect) {
            layoutSelect.value = savedLayout;
        }

        // Fire events for wb-theme and wb-layout components
        document.dispatchEvent(new CustomEvent('wb:theme-changed', {
            detail: { theme: savedTheme, source: 'control-panel-init' },
            bubbles: true,
            composed: true
        }));

        document.dispatchEvent(new CustomEvent('wb:layout-changed', {
            detail: { layout: savedLayout, source: 'control-panel-init' },
            bubbles: true,
            composed: true
        }));

        // Set initial colors on wb-color-bars components - they will apply CSS immediately
        this.setInitialColorsOnComponents();

        // Restore minimized state
        const isMinimized = localStorage.getItem('wb-control-panel-minimized') === 'true';
        if (isMinimized) {
            const body = this.querySelector('.control-panel-body');
            const minimizeBtn = this.querySelector('#minimize-btn');
            if (body && minimizeBtn) {
                body.style.display = 'none';
                minimizeBtn.textContent = '+';
                minimizeBtn.title = 'Expand';
                this.setAttribute('data-minimized', 'true');
            }
        }

        // Restore visibility state
        const isVisible = localStorage.getItem('wb-control-panel-visible') !== 'false';
        if (!isVisible) {
            this.style.display = 'none';
        }

        console.log('Control Panel: Initial settings applied - components are reactive');
    }

    setInitialColorsOnComponents() {
        // 🎯 REACTIVE APPROACH: Set initial values on wb-color-bars
        // wb-color-bars will immediately apply CSS when their attributes are set
        // Control panel doesn't manipulate CSS - components do

        // Try to load saved colors from localStorage
        const savedPrimary = localStorage.getItem('wb-primary-color');
        const savedBg = localStorage.getItem('wb-background-color');

        // Set primary color bar initial values
        const primaryColorBar = this.querySelector('#primary-color-bar');
        if (primaryColorBar) {
            if (savedPrimary) {
                const colorData = JSON.parse(savedPrimary);
                primaryColorBar.setAttribute('text-hue', String(colorData.hue));
                primaryColorBar.setAttribute('text-saturation', String(colorData.saturation));
                primaryColorBar.setAttribute('text-lightness', String(colorData.lightness));
            } else {
                // Use defaults from config
                primaryColorBar.setAttribute('text-hue', String(this.currentColors.primary.hue));
                primaryColorBar.setAttribute('text-saturation', String(this.currentColors.primary.saturation));
                primaryColorBar.setAttribute('text-lightness', String(this.currentColors.primary.lightness));
            }
        }

        // Set background color bar initial values
        const bgColorBar = this.querySelector('#bg-color-bar');
        if (bgColorBar) {
            if (savedBg) {
                const colorData = JSON.parse(savedBg);
                bgColorBar.setAttribute('text-hue', String(colorData.hue));
                bgColorBar.setAttribute('text-saturation', String(colorData.saturation));
                bgColorBar.setAttribute('text-lightness', String(colorData.lightness));
            } else {
                // Use defaults from config
                bgColorBar.setAttribute('text-hue', String(this.currentColors.background.hue));
                bgColorBar.setAttribute('text-saturation', String(this.currentColors.background.saturation));
                bgColorBar.setAttribute('text-lightness', String(this.currentColors.background.lightness));
            }
        }

        console.log('📡 Initial colors set on wb-color-bars - they will apply CSS immediately');
    }

    // Helper method for manual component loading with proper path resolution
    async loadComponentManually(componentName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');

            // Use WBComponentUtils for path resolution if available
            let scriptPath;
            if (window.WBComponentUtils?.resolve) {
                // Use symbol registry for path resolution
                const symbolKey = componentName.replace('wb-', 'wb.') + '.js';
                scriptPath = window.WBComponentUtils.resolve(symbolKey);
            } else {
                // Fallback to constructed relative path using correct naming
                scriptPath = `../components/${componentName}/${componentName}.js`;
            }

            script.src = scriptPath;
            console.log(`🔄 Loading ${componentName} from:`, scriptPath);
            document.head.appendChild(script);

            script.onload = () => {
                console.log(`✅ ${componentName} loaded successfully`);
                resolve();
            };
            script.onerror = () => {
                console.warn(`⚠️ ${componentName} not found at:`, scriptPath);
                resolve(); // Don't reject, allow graceful degradation
            };
        });
    }





    getTheme() {
        return document.body.getAttribute('data-theme') || 'dark';
    }

    setLayout(layout) {
        const layoutSelect = /** @type {any} */ (this.querySelector('#layout-select'));
        if (layoutSelect) {
            layoutSelect.value = layout;
            this.handleLayoutChange({ target: { value: layout } });
        }
    }

    getLayout() {
        return document.body.getAttribute('data-layout') || 'top-nav';
    }

  
        
        // Save state
  
    }

    

    

    
       
       
  

   
// Add observed attributes for schema compliance
ControlPanel.observedAttributes = [
    'visible', 'position', 'theme', 'width', 'config',
    'draggable', 'collapsible', 'show-themes', 'show-colors',
    'show-layout', 'show-edit-mode', 'compact', 'auto-hide'
];

// Add attributeChangedCallback
ControlPanel.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
    if (this.initialized && oldValue !== newValue) {
        console.log(`🎛️ Control Panel: Attribute ${name} changed from ${oldValue} to ${newValue}`);
        this.handleAttributeChange(name, newValue);
    }
};

ControlPanel.prototype.handleAttributeChange = function (name, value) {
    switch (name) {
        case 'visible':
            this.style.display = (value === 'true' || value === '') ? 'block' : 'none';
            break;
        case 'theme':
            this.setAttribute('data-theme', value);
            break;
        case 'position':
            this.className = `control-panel control-panel--${value}`;
            break;
        case 'draggable':
            const dragHandle = this.querySelector('#drag-handle');
            if (dragHandle instanceof HTMLElement) {
                dragHandle.style.display = (value === 'false') ? 'none' : 'flex';
            }
            break;
    }
};

// 🎯 SCHEMA-DRIVEN REGISTRATION: Let WBComponentRegistry handle registration
// The schema defines all metadata in wb-control-panel.schema.json:
// - Component tag name: "wb-control-panel" (from tags[].name)
// - Dependencies: ["wb-color-bar", "wb-color-bars", "wb-nav", ...]
// - Type: "composite", Role: "infrastructure"
// - Load order and priorities
//
// WBComponentRegistry reads the schema and automatically:
// 1. Calls customElements.define() with correct tag name
// 2. Resolves and loads dependencies in correct order
// 3. Registers metadata and health monitoring
//
// Components should export their class and let registry handle registration

// Register with WBComponentRegistry using schema-defined metadata
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    // Dependencies from schema: wb-control-panel.schema.json
    const dependencies = ['wb-color-bar', 'wb-color-bars', 'wb-event-log'];

    // Metadata from schema
    const metadata = {
        version: '2.1.0',
        type: 'composite',
        role: 'infrastructure',
        description: 'Composition layer that coordinates wb- components for website builder functionality',
        schema: 'wb-control-panel.schema.json',
        api: {
            events: ['wb:layout-changed', 'wb:theme-changed', 'wb:color-changed'],
            attributes: ['position', 'draggable', 'initial-state'],
            methods: ['show', 'hide', 'setTheme', 'getTheme', 'setLayout', 'getLayout']
        },
        priority: 6
    };

    // Registry will call customElements.define('wb-control-panel', ControlPanel) automatically
    window.WBComponentRegistry.register('wb-control-panel', ControlPanel, dependencies, metadata)
        .then(() => {
            console.log('✅ wb-control-panel registered via WBComponentRegistry (schema-driven)');
        })
        .catch(error => {
            console.error('⚠️ Failed to register wb-control-panel:', error);
            // Fallback: register directly if registry fails
            if (!customElements.get('wb-control-panel')) {
                customElements.define('wb-control-panel', ControlPanel);
                console.log('✅ wb-control-panel registered directly (fallback)');
            }
        });
} else {
    // Fallback if registry not available
    if (!customElements.get('wb-control-panel')) {
        customElements.define('wb-control-panel', ControlPanel);
        console.log('✅ wb-control-panel registered directly (no registry available)');
    }
}

// TypeScript: Extend Window interface to include WB property
/**
 * @typedef {Object} WBNamespace
 * @property {Object} components
 * @property {Object} utils
 */

/**
 * @type {Window & { WB?: WBNamespace }}
 */
const win = window;

// Compositional Namespace
if (!win.WB) win.WB = { components: {}, utils: {} };
win.WB.components.ControlPanel = ControlPanel;

// Expose global API (backward compatibility)
win.ControlPanel = ControlPanel;

console.log('Control Panel component script loaded successfully');

// ES6 Module Export
export { ControlPanel };
export default ControlPanel;