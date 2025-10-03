// Control Panel Web Component
// Self-contained component for the Website Builder control panel

(function() {
    'use strict';
    
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
    console.log('🎛️ Control Panel Component: Starting initialization...');
    
    // Load CSS file using WBComponentUtils
    function loadCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('control-panel.js', '../components/wb-control-panel/') + 'control-panel.css';
            window.WBComponentUtils.loadCSS('control-panel', cssPath);
        } else {
            // Fallback: Try to load WBComponentUtils first, then load CSS
            const utilsScript = document.createElement('script');
            utilsScript.src = '/utils/wb/wb-component-utils.js';
            utilsScript.onload = () => {
                if (window.WBComponentUtils) {
                    const cssPath = window.WBComponentUtils.getPath('control-panel.js', '../components/wb-control-panel/') + 'control-panel.css';
                    window.WBComponentUtils.loadCSS('control-panel', cssPath);
                }
            };
            utilsScript.onerror = () => {
                // Final fallback: Manual CSS loading
                const existingStyles = document.querySelector('link[href*="control-panel.css"]');
                if (!document.getElementById('control-panel-styles') && !existingStyles) {
                    console.log('🎛️ Control Panel: Loading CSS file manually...');
                    const link = document.createElement('link');
                    link.id = 'control-panel-styles';
                    link.rel = 'stylesheet';
                    link.href = '/components/wb-control-panel/control-panel.css';
                    document.head.appendChild(link);
                }
            };
            document.head.appendChild(utilsScript);
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
        }
        
        connectedCallback() {
            console.log('🎛️ Control Panel Web Component: Connected to DOM');
            
            // Auto-initialize when connected to DOM
            if (!this.initialized) {
                setTimeout(() => this.init(), 0);
            }
        }
        
        disconnectedCallback() {
            console.log('🎛️ Control Panel Web Component: Disconnected from DOM');
        }
        
        init(config = null) {
            if (this.initialized) return;
            
            try {
                console.log('🎛️ Control Panel: Starting initialization...');
                
                // Load CSS
                loadCSS();
                
                // Store configuration if provided
                this.config = config || this.getDefaultConfig();
                
                // Create HTML structure
                this.createHTML();
                
                // Initialize functionality
                this.setupEventListeners();
                this.applyInitialSettings();
                
                this.initialized = true;
                
                // Dispatch component ready event
                document.dispatchEvent(new CustomEvent('controlPanelReady', {
                    detail: { component: this }
                }));
                
                logEvent('success', 'Control Panel initialized successfully');
                console.log('🎛️ Control Panel: Component initialized successfully');
                
            } catch (error) {
                console.error('🎛️ Control Panel: Failed to initialize component:', error);
                logEvent('error', `Control Panel initialization failed: ${error.message}`);
            }
        }
        
        getDefaultConfig() {
            return {
                title: "WB Website Builder",
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
                        id: "colors",
                        title: "Color Scheme",
                        controls: [
                            {
                                component: "color-bar",
                                config: {
                                    id: "primary-color-bar",
                                    hue: 240,
                                    saturation: 70,
                                    lightness: 50,
                                    theme: "dark",
                                    label: "Primary Color"
                                }
                            },
                            {
                                component: "color-bar",
                                config: {
                                    id: "bg-color-bar",
                                    hue: 220,
                                    saturation: 25,
                                    lightness: 15,
                                    theme: "dark",
                                    label: "Background Color"
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
                                    label: "Edit Mode",
                                    id: "edit-mode-toggle",
                                    checked: false,
                                    variant: "success"
                                }
                            },
                            {
                                component: "wb-toggle",
                                config: {
                                    label: "Fixed Footer",
                                    id: "spa-mode-toggle",
                                    checked: false,
                                    variant: "primary"
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
                                    label: "Save Website",
                                    id: "save-btn",
                                    variant: "primary"
                                }
                            },
                            {
                                component: "wb-button",
                                config: {
                                    label: "Reset Content",
                                    id: "reset-btn",
                                    variant: "secondary"
                                }
                            }
                        ]
                    }
                ]
            };
        }
        
        createHTML() {
            console.log('🎛️ Control Panel: Creating HTML structure...');
            
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
            `;
            
            console.log('🎛️ Control Panel: HTML structure created');
        }
        
        createSectionsHTML(sections) {
            if (!sections || !Array.isArray(sections)) {
                console.warn('Control Panel: No sections provided');
                return '<div class="control-section"><p>No controls configured</p></div>';
            }
            
            return sections.map(section => {
                return `
                    <div class="control-section" id="section-${section.id}">
                        <h4 class="section-title">${section.title || section.id}</h4>
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
                    case 'color-bar':
                        return this.createColorBarHTML(control.config);
                    case 'wb-button':
                        return this.createButtonHTML(control.config);
                    default:
                        console.warn('Unknown control component:', control.component);
                        return '';
                }
            }).join('');
        }
        
        createSelectHTML(config) {
            const options = config.options.map(opt => 
                `<option value="${opt.value}" ${opt.value === config.value ? 'selected' : ''}>${opt.label || opt.text}</option>`
            ).join('');
            
            return `
                <div class="control-item">
                    <label class="control-label">${config.label}</label>
                    <select id="${config.id}" class="control-select">
                        ${options}
                    </select>
                </div>
            `;
        }
        
        createToggleHTML(config) {
            return `
                <div class="control-item">
                    <button id="${config.id}" class="wb-toggle ${config.checked ? 'active' : ''}" 
                            data-checked="${config.checked}"
                            data-variant="${config.variant}">
                        <span>${config.label}</span>
                        <span class="toggle-indicator">✓</span>
                    </button>
                </div>
            `;
        }
        
        createColorBarHTML(config) {
            const currentTheme = document.body.getAttribute('data-theme') || config.theme || 'dark';
            
            return `
                <div class="control-item">
                    <label class="control-label">${config.label}</label>
                    <color-bars id="${config.id}" 
                                hue="${config.hue}" 
                                saturation="${config.saturation}" 
                                lightness="${config.lightness}"
                                theme="${currentTheme}">
                    </color-bars>
                </div>
            `;
        }
        
        createButtonHTML(config) {
            const variantClass = `wb-button wb-button--${config.variant || 'primary'}`;
            return `
                <div class="control-item">
                    <button id="${config.id}" class="${variantClass}">
                        ${config.label}
                    </button>
                </div>
            `;
        }
        
        setupEventListeners() {
            console.log('🎛️ Control Panel: Setting up event listeners...');
            
            // Layout selector
            const layoutSelect = this.querySelector('#layout-select');
            if (layoutSelect) {
                layoutSelect.addEventListener('change', (e) => this.handleLayoutChange(e));
            }
            
            // Theme selector
            const themeSelect = this.querySelector('#theme-select');
            if (themeSelect) {
                themeSelect.addEventListener('change', (e) => this.handleThemeChange(e));
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
            
            // Color sliders
            this.setupColorSliders();
            
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
            
            console.log('🎛️ Control Panel: Event listeners setup complete');
        }
        
        // Event Handlers
        handleLayoutChange(e) {
            const layout = e.target.value;
            document.body.setAttribute('data-layout', layout);
            localStorage.setItem('wb-layout', layout);
            
            document.dispatchEvent(new CustomEvent('layoutChanged', {
                detail: { layout, source: 'controlPanel' }
            }));
            
            logEvent('info', `Layout changed to: ${layout}`);
        }
        
        handleThemeChange(e) {
            const theme = e.target.value;
            document.body.setAttribute('data-theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('wb-theme', theme);
            
            // Update color-bars components theme
            this.updateColorBarsTheme(theme);
            
            document.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme, source: 'controlPanel' }
            }));
            
            logEvent('info', `Theme changed to: ${theme}`);
        }
        
        updateColorBarsTheme(theme) {
            const colorBarsElements = this.querySelectorAll('wb-color-bars');
            colorBarsElements.forEach(element => {
                element.setAttribute('theme', theme);
            });
        }
        
        handleSpaToggle(e) {
            e.preventDefault();
            const button = e.currentTarget;
            const isActive = button.classList.contains('active');
            const newState = !isActive;
            
            button.classList.toggle('active', newState);
            button.dataset.checked = newState;
            
            const footerMode = newState ? 'bottom' : 'same-page';
            document.body.setAttribute('data-footer', footerMode);
            
            logEvent('info', `Fixed footer: ${newState ? 'enabled' : 'disabled'}`);
        }
        
        toggleEditMode() {
            const currentState = document.body.classList.contains('edit-mode');
            const newState = !currentState;
            
            document.body.classList.toggle('edit-mode', newState);
            
            // Toggle contentEditable on all editable elements
            const editables = document.querySelectorAll('.editable');
            editables.forEach(el => {
                el.contentEditable = newState;
                el.classList.toggle('editing', newState);
            });
            
            // Update button state
            const editBtn = this.querySelector('#edit-mode-toggle');
            if (editBtn) {
                editBtn.textContent = newState ? 'Exit Edit' : 'Edit Mode';
                editBtn.classList.toggle('active', newState);
            }
            
            // Dispatch events
            document.dispatchEvent(new CustomEvent('editModeChanged', {
                detail: { enabled: newState, source: 'controlPanel' }
            }));
            
            logEvent('info', `Edit mode ${newState ? 'enabled' : 'disabled'}`);
        }
        
        setupColorSliders() {
            // Load color-bars component first if not already loaded
            this.loadColorBarsComponent();
            
            // Primary color bars
            const primaryColorBars = this.querySelector('#primary-color-bar');
            if (primaryColorBars) {
                primaryColorBars.addEventListener('colorchange', (e) => this.handleColorBarsChange(e, 'primary'));
                primaryColorBars.addEventListener('colorselect', (e) => this.handleColorBarsSelect(e, 'primary'));
            }
            
            // Background color bars
            const bgColorBars = this.querySelector('#bg-color-bar');
            if (bgColorBars) {
                bgColorBars.addEventListener('colorchange', (e) => this.handleColorBarsChange(e, 'background'));
                bgColorBars.addEventListener('colorselect', (e) => this.handleColorBarsSelect(e, 'background'));
            }
        }
        
        loadColorBarsComponent() {
            // Check if wb-color-bars is already loaded
            if (customElements.get('wb-color-bars')) {
                return;
            }
            
            // Load color-bars component with correct path
            const script = document.createElement('script');
            script.src = '/components/color-bars/wb-color-bars.js';
            script.onload = () => console.log('🎨 Color-bars component loaded');
            script.onerror = () => {
                console.log('⚠️ Color-bars component not found, control panel will work without color sliders');
                // Don't treat this as an error since control panel can work without it
            };
            document.head.appendChild(script);
        }
        
        handleColorBarsChange(e, colorType) {
            // Update the current colors object with real-time changes
            const colorData = e.detail;
            this.currentColors[colorType] = {
                hue: colorData.hue,
                saturation: colorData.saturation,
                lightness: colorData.lightness
            };
            
            // Apply the color changes in real-time
            this.applyColorChanges(colorType, colorData);
            
            // Log the change
            logEvent('info', `${colorType} color updated: ${colorData.hsl}`);
        }
        
        handleColorBarsSelect(e, colorType) {
            // Final color selection - save to localStorage if needed
            const colorData = e.detail;
            localStorage.setItem(`wb-${colorType}-color`, JSON.stringify(colorData));
            
            logEvent('success', `${colorType} color selected: ${colorData.hex}`);
        }
        
        applyColorChanges(colorType, colorData) {
            const root = document.documentElement;
            
            if (colorType === 'primary') {
                const hslColor = colorData.hsl;
                const hexColor = colorData.hex;
                
                // Apply primary color to various CSS properties
                root.style.setProperty('--primary-color', hexColor);
                root.style.setProperty('--primary', hexColor);
                root.style.setProperty('--accent-color', hexColor);
                root.style.setProperty('--primary-hsl', hslColor);
                
                console.log(`🎨 Applied primary color: ${hslColor} (${hexColor})`);
            } else if (colorType === 'background') {
                const hslColor = colorData.hsl;
                const hexColor = colorData.hex;
                
                // Apply background color to various CSS properties
                root.style.setProperty('--bg-primary', hexColor);
                root.style.setProperty('--background', hexColor);
                root.style.setProperty('--surface', hexColor);
                root.style.setProperty('--bg-primary-hsl', hslColor);
                
                console.log(`🎨 Applied background color: ${hslColor} (${hexColor})`);
            }
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
        
        toggleMinimize() {
            this.classList.toggle('minimized');
        }
        
        hide() {
            this.style.display = 'none';
            document.dispatchEvent(new CustomEvent('controlPanelHide'));
        }
        
        show() {
            this.style.display = 'block';
            document.dispatchEvent(new CustomEvent('controlPanelShow'));
        }
        
        applyInitialSettings() {
            // Apply saved settings
            const savedTheme = localStorage.getItem('wb-theme') || 'dark';
            const savedLayout = localStorage.getItem('wb-layout') || 'top-nav';
            
            const themeSelect = this.querySelector('#theme-select');
            if (themeSelect) {
                themeSelect.value = savedTheme;
                document.body.setAttribute('data-theme', savedTheme);
                document.documentElement.setAttribute('data-theme', savedTheme);
            }
            
            const layoutSelect = this.querySelector('#layout-select');
            if (layoutSelect) {
                layoutSelect.value = savedLayout;
                document.body.setAttribute('data-layout', savedLayout);
            }
            
            // Apply initial colors to CSS custom properties
            this.applyInitialColors();
            
            console.log('🎛️ Control Panel: Initial settings applied');
        }
        
        applyInitialColors() {
            // Apply default primary color
            const primaryData = {
                hue: this.currentColors.primary.hue,
                saturation: this.currentColors.primary.saturation,
                lightness: this.currentColors.primary.lightness,
                hsl: `hsl(${this.currentColors.primary.hue}, ${this.currentColors.primary.saturation}%, ${this.currentColors.primary.lightness}%)`,
                hex: this.hslToHex(this.currentColors.primary.hue, this.currentColors.primary.saturation, this.currentColors.primary.lightness)
            };
            this.applyColorChanges('primary', primaryData);
            
            // Apply default background color
            const bgData = {
                hue: this.currentColors.background.hue,
                saturation: this.currentColors.background.saturation,
                lightness: this.currentColors.background.lightness,
                hsl: `hsl(${this.currentColors.background.hue}, ${this.currentColors.background.saturation}%, ${this.currentColors.background.lightness}%)`,
                hex: this.hslToHex(this.currentColors.background.hue, this.currentColors.background.saturation, this.currentColors.background.lightness)
            };
            this.applyColorChanges('background', bgData);
        }
        
        // Utility function to convert HSL to Hex
        hslToHex(h, s, l) {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        }
        
        // Public API
        setTheme(theme) {
            const themeSelect = this.querySelector('#theme-select');
            if (themeSelect) {
                themeSelect.value = theme;
                this.handleThemeChange({ target: { value: theme } });
            }
        }
        
        getTheme() {
            return document.body.getAttribute('data-theme') || 'dark';
        }
        
        setLayout(layout) {
            const layoutSelect = this.querySelector('#layout-select');
            if (layoutSelect) {
                layoutSelect.value = layout;
                this.handleLayoutChange({ target: { value: layout } });
            }
        }
        
        getLayout() {
            return document.body.getAttribute('data-layout') || 'top-nav';
        }
        
        isEditModeEnabled() {
            return document.body.classList.contains('edit-mode');
        }
    }
    
    // Register as Web Component
    customElements.define('control-panel', ControlPanel);
    
    // Expose global API
    window.ControlPanel = ControlPanel;
    
    console.log('🎛️ Control Panel component script loaded successfully');
})();