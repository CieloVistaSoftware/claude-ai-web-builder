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
    
    // Load CSS file if not already present
    function loadCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('control-panel.js', '../components/control-panel/') + 'control-panel.css';
            window.WBComponentUtils.loadCSS('control-panel', cssPath);
        } else {
            const existingStyles = document.querySelector('link[href*="control-panel.css"]');
            if (!document.getElementById('control-panel-styles') && !existingStyles) {
                console.log('🎛️ Control Panel: Loading CSS file...');
                const link = document.createElement('link');
                link.id = 'control-panel-styles';
                link.rel = 'stylesheet';
                
                // Auto-detect path from current script
                const scripts = document.getElementsByTagName('script');
                const currentScript = scripts[scripts.length - 1];
                const scriptPath = currentScript.src;
                const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
                
                link.href = basePath + '/control-panel.css';
                document.head.appendChild(link);
            }
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
                        type: "ad-layout-controls",
                        cssClass: "ad-layout-controls initially-hidden",
                        sections: [
                            { id: "ad-header-toggle", label: "Header", checked: true },
                            { id: "ad-hero-toggle", label: "Hero", checked: true },
                            { id: "ad-features-toggle", label: "Features", checked: true },
                            { id: "ad-gallery-toggle", label: "Gallery", checked: true },
                            { id: "ad-about-toggle", label: "About", checked: true },
                            { id: "ad-footer-toggle", label: "Footer", checked: true }
                        ]
                    },
                    {
                        id: "footer-section",
                        type: "footer-toggle",
                        button: {
                            id: "spa-mode-toggle",
                            label: "Fixed Footer",
                            checked: false
                        }
                    },
                    {
                        id: "palette-section", 
                        type: "palette-select",
                        select: {
                            id: "palette-select",
                            options: [
                                { value: "", text: "Color Palette Presets", disabled: true, selected: true },
                                { value: "", text: "Custom Colors" },
                                { value: "material-design-3", text: "Material Design 3" },
                                { value: "material-design-dark", text: "Material Design Dark" },
                                { value: "tailwind-blue", text: "Tailwind Blue" },
                                { value: "dracula", text: "Dracula Theme" },
                                { value: "github-dark", text: "GitHub Dark" },
                                { value: "nord", text: "Nord Theme" },
                                { value: "one-dark", text: "One Dark" },
                                { value: "solarized-dark", text: "Solarized Dark" },
                                { value: "brand-tech", text: "Tech Brands" }
                            ]
                        }
                    },
                    {
                        id: "layout-theme-section",
                        type: "layout-theme-controls",
                        controls: [
                            {
                                id: "layout-select",
                                label: "Layout",
                                type: "select",
                                options: [
                                    { value: "top-nav", text: "Top Navigation" },
                                    { value: "left-nav", text: "Left Navigation" },
                                    { value: "right-nav", text: "Right Navigation" },
                                    { value: "ad-layout", text: "Ad Layout" }
                                ]
                            },
                            {
                                id: "theme-select", 
                                label: "Theme",
                                type: "select",
                                options: [
                                    { value: "dark", text: "Dark", selected: true },
                                    { value: "light", text: "Light" },
                                    { value: "auto", text: "Auto (System)" },
                                    { value: "cyberpunk", text: "Cyberpunk" },
                                    { value: "ocean", text: "Ocean" },
                                    { value: "sunset", text: "Sunset" },
                                    { value: "forest", text: "Forest" }
                                ]
                            }
                        ]
                    },
                    {
                        id: "color-controls-section",
                        type: "color-controls",
                        cssClass: "color-controls",
                        label: "Color Controls",
                        primary: {
                            id: "primary-color",
                            label: "Primary Color",
                            hue: 240,
                            saturation: 70,
                            lightness: 50
                        },
                        background: {
                            id: "bg-color", 
                            label: "Background Color",
                            hue: 220,
                            saturation: 25,
                            lightness: 15
                        }
                    },
                    {
                        id: "hidden-inputs-section",
                        type: "hidden-inputs",
                        inputs: [
                            { id: "directory-input", type: "file", attributes: "webkitdirectory directory" },
                            { id: "import-html-input", type: "file", accept: ".html,.htm" },
                            { id: "load-converted-input", type: "file", accept: ".html,.htm", directory: "converted" }
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
        
        createToggleHTML(control) {
            return `
                <div class="control-item">
                    <button id="${control.id}" class="footer-toggle-button ${control.checked ? 'active' : ''}" 
                            data-checked="${control.checked}">
                        <span>${control.label}</span>
                        <span class="footer-toggle-check">✓</span>
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
        
        createButtonHTML(control) {
            const variantClass = control.variant === 'toggle' ? 'edit-mode-toggle' : 'btn';
            return `
                <div class="control-item">
                    <button id="${control.id}" class="${variantClass}" data-variant="${control.variant}">
                        ${control.label}
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
            
            // Palette selector
            const paletteSelect = this.querySelector('#palette-select');
            if (paletteSelect) {
                paletteSelect.addEventListener('change', (e) => this.handlePaletteChange(e));
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
            localStorage.setItem('wb-theme', theme);
            
            // Update color-bars components theme
            this.updateColorBarsTheme(theme);
            
            document.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme, source: 'controlPanel' }
            }));
            
            logEvent('info', `Theme changed to: ${theme}`);
        }
        
        updateColorBarsTheme(theme) {
            const colorBarsElements = this.querySelectorAll('color-bars');
            colorBarsElements.forEach(element => {
                element.setAttribute('theme', theme);
            });
        }
        
        handlePaletteChange(e) {
            const paletteId = e.target.value;
            
            if (!paletteId) {
                logEvent('info', 'Switched to custom colors');
                return;
            }
            
            const palette = this.getColorPalette(paletteId);
            if (palette) {
                this.applyColorPalette(palette);
                logEvent('success', `Applied ${palette.name} palette`);
            }
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
            const primaryColorBars = this.querySelector('#primary-color');
            if (primaryColorBars) {
                primaryColorBars.addEventListener('colorchange', (e) => this.handleColorBarsChange(e, 'primary'));
                primaryColorBars.addEventListener('colorselect', (e) => this.handleColorBarsSelect(e, 'primary'));
            }
            
            // Background color bars
            const bgColorBars = this.querySelector('#bg-color');
            if (bgColorBars) {
                bgColorBars.addEventListener('colorchange', (e) => this.handleColorBarsChange(e, 'background'));
                bgColorBars.addEventListener('colorselect', (e) => this.handleColorBarsSelect(e, 'background'));
            }
        }
        
        loadColorBarsComponent() {
            // Check if color-bars is already loaded
            if (customElements.get('color-bars')) {
                return;
            }
            
            // Load color-bars component
            const script = document.createElement('script');
            script.src = '../components/color-bars/color-bars.js';
            script.onload = () => console.log('🎨 Color-bars component loaded');
            script.onerror = () => console.error('❌ Failed to load color-bars component');
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
        
        // Color system
        getColorPalette(paletteId) {
            const palettes = {
                'material-design-3': {
                    name: 'Material Design 3',
                    colors: {
                        primary: '#6750A4',
                        secondary: '#625B71',
                        tertiary: '#7D5260',
                        surface: '#FEF7FF',
                        background: '#FEF7FF',
                        error: '#BA1A1A'
                    }
                },
                'material-design-dark': {
                    name: 'Material Design Dark',
                    colors: {
                        primary: '#D0BCFF',
                        secondary: '#CCC2DC',
                        tertiary: '#EFB8C8',
                        surface: '#141218',
                        background: '#141218',
                        error: '#F2B8B5'
                    }
                },
                'tailwind-blue': {
                    name: 'Tailwind Blue',
                    colors: {
                        primary: '#3B82F6',
                        secondary: '#1E40AF',
                        tertiary: '#60A5FA',
                        surface: '#F8FAFC',
                        background: '#FFFFFF',
                        error: '#EF4444'
                    }
                },
                'dracula': {
                    name: 'Dracula Theme',
                    colors: {
                        primary: '#BD93F9',
                        secondary: '#FF79C6',
                        tertiary: '#50FA7B',
                        surface: '#282A36',
                        background: '#282A36',
                        error: '#FF5555'
                    }
                },
                'github-dark': {
                    name: 'GitHub Dark',
                    colors: {
                        primary: '#58A6FF',
                        secondary: '#F85149',
                        tertiary: '#56D364',
                        surface: '#0D1117',
                        background: '#0D1117',
                        error: '#F85149'
                    }
                },
                'nord': {
                    name: 'Nord Theme',
                    colors: {
                        primary: '#5E81AC',
                        secondary: '#81A1C1',
                        tertiary: '#88C0D0',
                        surface: '#2E3440',
                        background: '#2E3440',
                        error: '#BF616A'
                    }
                },
                'one-dark': {
                    name: 'One Dark',
                    colors: {
                        primary: '#61AFEF',
                        secondary: '#C678DD',
                        tertiary: '#98C379',
                        surface: '#282C34',
                        background: '#282C34',
                        error: '#E06C75'
                    }
                },
                'solarized-dark': {
                    name: 'Solarized Dark',
                    colors: {
                        primary: '#268BD2',
                        secondary: '#2AA198',
                        tertiary: '#859900',
                        surface: '#002B36',
                        background: '#002B36',
                        error: '#DC322F'
                    }
                },
                'brand-tech': {
                    name: 'Tech Brands',
                    colors: {
                        primary: '#1877F2',
                        secondary: '#0A66C2',
                        tertiary: '#1DA1F2',
                        surface: '#FFFFFF',
                        background: '#F8F9FA',
                        error: '#EA4335'
                    }
                }
            };
            
            return palettes[paletteId];
        }
        
        applyColorPalette(palette) {
            const root = document.documentElement;
            
            // Apply main color variables
            Object.entries(palette.colors).forEach(([key, value]) => {
                root.style.setProperty(`--${key}`, value);
            });
            
            // Set common aliases
            root.style.setProperty('--primary-color', palette.colors.primary);
            root.style.setProperty('--secondary-color', palette.colors.secondary);
            root.style.setProperty('--accent-color', palette.colors.primary);
            
            console.log(`🎨 Applied palette: ${palette.name}`);
        }
        
        applyInitialSettings() {
            // Apply saved settings
            const savedTheme = localStorage.getItem('wb-theme') || 'dark';
            const savedLayout = localStorage.getItem('wb-layout') || 'top-nav';
            
            const themeSelect = this.querySelector('#theme-select');
            if (themeSelect) {
                themeSelect.value = savedTheme;
                document.body.setAttribute('data-theme', savedTheme);
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
                hex: window.WBComponentUtils.ColorUtils.hslToHex(this.currentColors.primary.hue, this.currentColors.primary.saturation, this.currentColors.primary.lightness)
            };
            this.applyColorChanges('primary', primaryData);
            
            // Apply default background color
            const bgData = {
                hue: this.currentColors.background.hue,
                saturation: this.currentColors.background.saturation,
                lightness: this.currentColors.background.lightness,
                hsl: `hsl(${this.currentColors.background.hue}, ${this.currentColors.background.saturation}%, ${this.currentColors.background.lightness}%)`,
                hex: window.WBComponentUtils.ColorUtils.hslToHex(this.currentColors.background.hue, this.currentColors.background.saturation, this.currentColors.background.lightness)
            };
            this.applyColorChanges('background', bgData);
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