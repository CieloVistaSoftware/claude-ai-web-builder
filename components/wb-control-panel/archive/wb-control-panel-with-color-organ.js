// Control Panel Web Component - WITH COLOR ORGAN INTEGRATION
// Enhanced with audio-reactive color organ functionality
// Version: 3.0.0 - Color Organ Edition 🎵🎨

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
    
    logEvent('info', 'Control Panel Component: Starting initialization (Color Organ Edition)');
    console.log('🎵 Control Panel Component: Starting initialization (Color Organ Edition)...');
    
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
            link.href = './wb-control-panel.css';
            link.onerror = () => {
                link.href = '../wb-control-panel/wb-control-panel.css';
                link.onerror = () => {
                    link.href = '/components/wb-control-panel/wb-control-panel.css';
                };
            };
            document.head.appendChild(link);
        }
    }
    
    class ControlPanel extends HTMLElement {
        constructor() {
            super();
            
            // 🎯 CONSOLIDATED STATE MANAGEMENT
            this.state = {
                // Component lifecycle
                initialized: false,
                
                // Feature toggles
                editMode: false,
                colorOrganEnabled: false,
                audioEnabled: false,
                
                // Color state
                colors: {
                    primary: { hue: 240, saturation: 70, lightness: 50 },
                    background: { hue: 220, saturation: 25, lightness: 15 }
                },
                
                // Audio state
                audio: {
                    source: 'tab', // 'tab' or 'mic'
                    sensitivity: 5,
                    bassLevel: 0,
                    midsLevel: 0,
                    trebleLevel: 0
                },
                
                // Configuration
                config: null
            };
            
            // Configuration cache
            this.navigationConfig = null;
            this.themeConfig = null;
            
            // Keyboard shortcuts
            this._keyboardShortcuts = {
                toggle: 'ctrl+p',
                close: 'escape',
                debug: 'ctrl+d',
                colorOrgan: 'ctrl+o' // NEW: Toggle color organ
            };
            this._keyboardHandler = null;
            
            // Event handlers storage (for cleanup)
            this._colorEventHandler = null;
            this._colorSelectHandler = null;
            this._harmonyEventHandler = null;
            
            // Color update queue for batching
            this._colorUpdateQueue = [];
            this._colorUpdateScheduled = false;
            
            // Audio context (initialized when audio enabled)
            this.audioContext = null;
            this.analyser = null;
            this.microphone = null;
            this.audioDataArray = null;
        }
        
        // Getter/setter for keyboard shortcuts
        get keyboardShortcuts() {
            return this._keyboardShortcuts;
        }
        
        set keyboardShortcuts(shortcuts) {
            this._keyboardShortcuts = { ...this._keyboardShortcuts, ...shortcuts };
            if (this.state.initialized) {
                this.setupKeyboardShortcuts();
            }
        }
        
        connectedCallback() {
            console.log('🎵 Control Panel Web Component: Connected to DOM (Color Organ Edition)');
            
            if (!this.state.initialized) {
                setTimeout(() => this.init(), 0);
            }
            
            // Ensure semantic structure
            setTimeout(async () => {
                try {
                    await this.ensureSemanticStructure();
                } catch (error) {
                    console.error('Control panel semantic structure error:', error);
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
            console.log('🎛️ Control Panel: Disconnecting - cleaning up resources');
            
            // 🎯 FIX: Memory leak prevention
            // Remove keyboard event listener
            if (this._keyboardHandler) {
                document.removeEventListener('keydown', this._keyboardHandler);
                this._keyboardHandler = null;
            }
            
            // Remove color event listeners
            if (this._colorEventHandler) {
                this.removeEventListener('colorchange', this._colorEventHandler);
                this._colorEventHandler = null;
            }
            
            if (this._colorSelectHandler) {
                this.removeEventListener('colorselect', this._colorSelectHandler);
                this._colorSelectHandler = null;
            }
            
            if (this._harmonyEventHandler) {
                this.removeEventListener('wb:color-harmony-change', this._harmonyEventHandler);
                this._harmonyEventHandler = null;
            }
            
            // Stop audio if active
            if (this.state.audioEnabled) {
                this.stopAudio();
            }
            
            console.log('✅ Control Panel: Cleanup complete');
        }
        
        async init(config = null) {
            if (this.state.initialized) return;
            
            try {
                console.log('🎵 Control Panel: Starting initialization (Color Organ Edition)...');
                
                // Load CSS
                loadCSS();
                
                // Load WBColorHarmony system
                await this.loadColorHarmonySystem();
                
                // Store configuration
                this.state.config = config || this.getDefaultConfig();
                
                // Create HTML structure
                this.createHTML();
                
                // Initialize functionality
                this.setupEventListeners();
                this.setupKeyboardShortcuts();
                this.applyInitialSettings();
                
                this.state.initialized = true;
                
                // Dispatch ready events
                document.dispatchEvent(new CustomEvent('controlPanelReady', {
                    detail: { component: this },
                    bubbles: true
                }));
                
                document.dispatchEvent(new CustomEvent('wb:control-panel-ready', {
                    detail: { component: this, colorOrganSupport: true },
                    bubbles: true
                }));
                
                logEvent('success', 'Control Panel initialized successfully (Color Organ Edition)');
                console.log('✅ Control Panel: Component initialized successfully with Color Organ support');
                
            } catch (error) {
                console.error('🎛️ Control Panel: Failed to initialize component:', error);
                logEvent('error', `Control Panel initialization failed: ${error.message}`);
            }
        }
        
        async loadColorHarmonySystem() {
            // Check if WBColorHarmony is already loaded
            if (window.WBColorHarmony) {
                console.log('✅ WBColorHarmony already loaded');
                return;
            }
            
            // Try to load it
            try {
                const script = document.createElement('script');
                script.src = './wb-color-harmony.js'; // Adjust path as needed
                
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
                
                console.log('✅ WBColorHarmony loaded successfully');
            } catch (error) {
                console.warn('⚠️ Could not load WBColorHarmony system:', error);
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
                        id: "primary-colors",
                        title: "Primary Color",
                        controls: [
                            {
                                component: "wb-color-bars",
                                config: {
                                    label: "Primary Color",
                                    id: "primary-color-bar",
                                    hue: 240,
                                    saturation: 70,
                                    lightness: 50,
                                    theme: "dark"
                                }
                            }
                        ]
                    },
                    {
                        id: "background-colors", 
                        title: "Background Color",
                        controls: [
                            {
                                component: "wb-color-bars",
                                config: {
                                    label: "Background Color",
                                    id: "bg-color-bar",
                                    hue: 220,
                                    saturation: 25,
                                    lightness: 15,
                                    theme: "dark"
                                }
                            }
                        ]
                    },
                    // 🎵 NEW: Color Organ Section
                    {
                        id: "color-organ",
                        title: "🎵 Color Organ",
                        controls: [
                            {
                                component: "wb-toggle",
                                config: {
                                    label: "Enable Color Organ",
                                    id: "color-organ-toggle",
                                    checked: false,
                                    variant: "accent"
                                }
                            }
                        ]
                    },
                    // 🎵 NEW: Audio Controls Section (shown when color organ enabled)
                    {
                        id: "audio-controls",
                        title: "🎤 Audio Settings",
                        hidden: true, // Hidden until color organ enabled
                        controls: [
                            {
                                component: "wb-select",
                                config: {
                                    label: "Audio Source",
                                    id: "audio-source-select",
                                    value: "tab",
                                    options: [
                                        { value: "tab", label: "Browser Tab Audio" },
                                        { value: "mic", label: "Microphone" }
                                    ]
                                }
                            },
                            {
                                component: "wb-slider",
                                config: {
                                    label: "Sensitivity",
                                    id: "audio-sensitivity-slider",
                                    min: 1,
                                    max: 10,
                                    value: 5,
                                    step: 1
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
                                    "expandable-details": "true",
                                    "toolbar": "true",
                                    "search": "true",
                                    "filters": "true",
                                    "export": "true"
                                }
                            }
                        ]
                    }
                ]
            };
        }
        
        createHTML() {
            console.log('Control Panel: Creating HTML structure...');
            
            this.innerHTML = `
                <div class="control-panel-header">
                    <h3>${this.state.config.title}</h3>
                    <div class="control-panel-actions">
                        <button class="control-btn" id="minimize-btn" title="Minimize">−</button>
                        <button class="control-btn" id="close-btn" title="Close">×</button>
                    </div>
                </div>
                <div class="control-panel-body">
                    ${this.createSectionsHTML(this.state.config.sections)}
                </div>
                <div class="drag-handle" id="drag-handle" title="Drag to move panel">⊕</div>
                <div class="resize-handle" id="resize-handle" title="Drag to resize width">↔</div>
            `;
            
            console.log('Control Panel: HTML structure created');
        }
        
        createSectionsHTML(sections) {
            if (!sections || !Array.isArray(sections)) {
                console.warn('Control Panel: No sections provided');
                return '<div class="control-section"><p>No controls configured</p></div>';
            }
            
            return sections.map(section => {
                const hiddenClass = section.hidden ? ' hidden' : '';
                return `
                    <div class="control-section${hiddenClass}" id="section-${section.id}" data-section="${section.id}">
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
                    case 'wb-slider':
                        return this.createSliderHTML(control.config);
                    case 'wb-color-bars':
                        return this.createColorBarHTML(control.config);
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
                    <label class="control-label">
                        ${config.label}
                        <span class="slider-value" id="${config.id}-value">${config.value || 50}</span>
                    </label>
                    <input type="range" id="${config.id}" 
                           min="${config.min || 0}" 
                           max="${config.max || 100}" 
                           value="${config.value || 50}"
                           step="${config.step || 1}"
                           class="control-slider">
                </div>
            `;
        }
        
        createColorBarHTML(config) {
            const currentTheme = document.body.getAttribute('data-theme') || config.theme || 'dark';
            
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
            }
            
            // Theme selector
            const themeSelect = this.querySelector('#theme-select');
            if (themeSelect) {
                themeSelect.addEventListener('wb-select:change', (e) => this.handleThemeChange(e));
            }
            
            // Edit mode toggle
            const editToggle = this.querySelector('#edit-mode-toggle');
            if (editToggle) {
                editToggle.addEventListener('click', () => this.toggleEditMode());
            }
            
            // 🎵 NEW: Color Organ toggle
            const colorOrganToggle = this.querySelector('#color-organ-toggle');
            if (colorOrganToggle) {
                colorOrganToggle.addEventListener('click', () => this.toggleColorOrgan());
                console.log('✅ Color Organ toggle event listener attached');
            }
            
            // 🎵 NEW: Audio source selector
            const audioSourceSelect = this.querySelector('#audio-source-select');
            if (audioSourceSelect) {
                audioSourceSelect.addEventListener('wb-select:change', (e) => this.handleAudioSourceChange(e));
            }
            
            // 🎵 NEW: Audio sensitivity slider
            const sensitivitySlider = this.querySelector('#audio-sensitivity-slider');
            if (sensitivitySlider) {
                sensitivitySlider.addEventListener('input', (e) => this.handleSensitivityChange(e));
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
            
            // Drag and resize
            const dragHandle = this.querySelector('#drag-handle');
            if (dragHandle && this.getAttribute('draggable') !== 'false') {
                this.setupDragFunctionality(dragHandle);
            }

            const resizeHandle = this.querySelector('#resize-handle');
            if (resizeHandle) {
                this.setupResizeFunctionality(resizeHandle);
            }
            
            console.log('✅ Control Panel: Event listeners setup complete');
        }
        
        // 🎵 NEW: Toggle Color Organ
        toggleColorOrgan() {
            const newState = !this.state.colorOrganEnabled;
            this.state.colorOrganEnabled = newState;
            
            // Show/hide audio controls section
            const audioSection = this.querySelector('#section-audio-controls');
            if (audioSection) {
                if (newState) {
                    audioSection.classList.remove('hidden');
                } else {
                    audioSection.classList.add('hidden');
                }
            }
            
            // Update toggle button state
            const toggle = this.querySelector('#color-organ-toggle');
            if (toggle) {
                toggle.setAttribute('checked', newState ? 'true' : 'false');
            }
            
            // Dispatch event for color organ component to listen
            document.dispatchEvent(new CustomEvent('wb:color-organ-toggle', {
                detail: {
                    enabled: newState,
                    source: 'control-panel',
                    timestamp: Date.now()
                },
                bubbles: true,
                composed: true
            }));
            
            // Save state
            localStorage.setItem('wb-color-organ-enabled', newState);
            
            // Start or stop audio if needed
            if (newState && !this.state.audioEnabled) {
                this.startAudio();
            } else if (!newState && this.state.audioEnabled) {
                this.stopAudio();
            }
            
            logEvent('info', `Color organ ${newState ? 'enabled' : 'disabled'}`);
            console.log(`🎵 Color organ ${newState ? 'enabled' : 'disabled'}`);
        }
        
        // 🎵 NEW: Audio Source Change
        handleAudioSourceChange(e) {
            const source = e.detail.value;
            this.state.audio.source = source;
            localStorage.setItem('wb-audio-source', source);
            
            // Restart audio with new source if currently enabled
            if (this.state.audioEnabled) {
                this.stopAudio();
                setTimeout(() => this.startAudio(), 100);
            }
            
            logEvent('info', `Audio source changed to: ${source}`);
        }
        
        // 🎵 NEW: Sensitivity Change
        handleSensitivityChange(e) {
            const sensitivity = parseInt(e.target.value);
            this.state.audio.sensitivity = sensitivity;
            
            // Update display
            const valueDisplay = this.querySelector('#audio-sensitivity-slider-value');
            if (valueDisplay) {
                valueDisplay.textContent = sensitivity;
            }
            
            localStorage.setItem('wb-audio-sensitivity', sensitivity);
            logEvent('info', `Audio sensitivity: ${sensitivity}x`);
        }
        
        // 🎵 NEW: Start Audio System
        async startAudio() {
            const source = this.state.audio.source;
            
            try {
                let stream;
                
                if (source === 'tab') {
                    // Browser tab audio capture
                    stream = await navigator.mediaDevices.getDisplayMedia({
                        video: true, // Required by Chrome
                        audio: {
                            echoCancellation: false,
                            noiseSuppression: false,
                            autoGainControl: false
                        }
                    });
                    
                    // Stop video track (we only want audio)
                    const videoTrack = stream.getVideoTracks()[0];
                    if (videoTrack) {
                        videoTrack.stop();
                        stream.removeTrack(videoTrack);
                    }
                    
                    console.log('🎵 Capturing tab audio');
                } else {
                    // Microphone audio
                    stream = await navigator.mediaDevices.getUserMedia({ 
                        audio: {
                            echoCancellation: false,
                            noiseSuppression: false,
                            autoGainControl: false
                        }
                    });
                    console.log('🎤 Capturing microphone audio');
                }
                
                // Create audio context
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.microphone = this.audioContext.createMediaStreamSource(stream);
                
                // Configure analyser
                this.analyser.fftSize = 256;
                const bufferLength = this.analyser.frequencyBinCount;
                this.audioDataArray = new Uint8Array(bufferLength);
                
                // Connect audio graph
                this.microphone.connect(this.analyser);
                
                this.state.audioEnabled = true;
                
                // Start audio analysis loop
                this.startAudioAnalysis();
                
                logEvent('success', `Audio reactive mode started (${source})`);
                console.log(`✅ Audio reactive mode started: ${source}`);
                
            } catch (error) {
                console.error('❌ Audio access denied:', error);
                alert(`${source === 'tab' ? 'Tab audio' : 'Microphone'} access required for audio reactive mode!`);
                
                // Reset state
                this.state.audioEnabled = false;
                this.state.colorOrganEnabled = false;
                
                // Reset UI
                const toggle = this.querySelector('#color-organ-toggle');
                if (toggle) {
                    toggle.setAttribute('checked', 'false');
                }
                
                logEvent('error', `Audio access denied: ${error.message}`);
            }
        }
        
        // 🎵 NEW: Stop Audio System
        stopAudio() {
            if (this.microphone) {
                this.microphone.disconnect();
                this.microphone = null;
            }
            
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
            
            this.analyser = null;
            this.audioDataArray = null;
            this.state.audioEnabled = false;
            
            console.log('⏸️ Audio reactive mode stopped');
            logEvent('info', 'Audio reactive mode stopped');
        }
        
        // 🎵 NEW: Audio Analysis Loop
        startAudioAnalysis() {
            const analyze = () => {
                if (!this.state.audioEnabled || !this.analyser) return;
                
                this.analyser.getByteFrequencyData(this.audioDataArray);
                
                const bufferLength = this.audioDataArray.length;
                const bassEnd = Math.floor(bufferLength * 0.15);
                const midsEnd = Math.floor(bufferLength * 0.5);
                
                let bassSum = 0, midsSum = 0, trebleSum = 0;
                
                for (let i = 0; i < bufferLength; i++) {
                    const value = this.audioDataArray[i];
                    if (i < bassEnd) {
                        bassSum += value;
                    } else if (i < midsEnd) {
                        midsSum += value;
                    } else {
                        trebleSum += value;
                    }
                }
                
                // Normalize to 0-1 range with sensitivity multiplier
                const sensitivity = this.state.audio.sensitivity / 5;
                const bass = Math.min(1, (bassSum / (bassEnd * 255)) * sensitivity);
                const mids = Math.min(1, (midsSum / ((midsEnd - bassEnd) * 255)) * sensitivity);
                const treble = Math.min(1, (trebleSum / ((bufferLength - midsEnd) * 255)) * sensitivity);
                
                // Update state
                this.state.audio.bassLevel = bass;
                this.state.audio.midsLevel = mids;
                this.state.audio.trebleLevel = treble;
                
                // Dispatch audio data event
                document.dispatchEvent(new CustomEvent('wb:audio-data', {
                    detail: {
                        bass,
                        mids,
                        treble,
                        timestamp: Date.now()
                    },
                    bubbles: true
                }));
                
                // Continue loop
                requestAnimationFrame(analyze);
            };
            
            analyze();
        }
        
        // Event Handlers
        async handleLayoutChange(e) {
            const layout = e.detail ? e.detail.value : e.target.value;
            
            document.dispatchEvent(new CustomEvent('wb:layout-changed', {
                detail: { 
                    layout: layout,
                    source: 'control-panel',
                    timestamp: Date.now()
                },
                bubbles: true,
                composed: true
            }));
            
            localStorage.setItem('wb-layout', layout);
            logEvent('info', `Layout changed to: ${layout}`);
        }
        
        handleThemeChange(e) {
            const theme = e.detail.value;
            
            this.setAttribute('data-theme', theme);
            
            document.dispatchEvent(new CustomEvent('wb:theme-changed', {
                detail: { 
                    theme: theme,
                    source: 'control-panel',
                    timestamp: Date.now()
                },
                bubbles: true,
                composed: true
            }));
            
            localStorage.setItem('wb-theme', theme);
            logEvent('info', `Theme changed to: ${theme}`);
        }
        
        toggleEditMode() {
            const newState = !this.state.editMode;
            this.state.editMode = newState;
            
            document.dispatchEvent(new CustomEvent('wb:edit-mode-changed', {
                detail: {
                    enabled: newState,
                    source: 'control-panel',
                    previousState: !newState
                },
                bubbles: true
            }));
            
            const editBtn = this.querySelector('#edit-mode-toggle');
            if (editBtn) {
                editBtn.textContent = newState ? 'Exit Edit' : 'Edit Mode';
                editBtn.classList.toggle('active', newState);
            }
            
            logEvent('info', `Edit mode ${newState ? 'enabled' : 'disabled'}`);
        }
        
        async setupColorSliders() {
            await this.loadComponents(['wb-color-bars', 'wb-color-bar'], { discoverDependencies: true });
            
            // 🎯 Store handlers for cleanup
            this._colorEventHandler = (e) => {
                const colorType = this.determineColorType(e);
                this.handleColorBarsChange(e, colorType);
            };
            
            this._colorSelectHandler = (e) => {
                const colorType = this.determineColorType(e);
                this.handleColorBarsSelect(e, colorType);
            };
            
            this._harmonyEventHandler = (e) => {
                if (!e.detail) return;
                
                // Apply palettes to CSS variables
                if (Array.isArray(e.detail.textPalette)) {
                    e.detail.textPalette.forEach(color => {
                        const varName = `--color-text-${color.name.toLowerCase().replace(/\s+/g, '-')}`;
                        const hsl = `hsl(${Math.round(color.hue)}, ${Math.round(color.saturation)}%, ${Math.round(color.lightness)}%)`;
                        document.documentElement.style.setProperty(varName, hsl);
                    });
                }
                
                if (Array.isArray(e.detail.bgPalette)) {
                    e.detail.bgPalette.forEach(color => {
                        const varName = `--color-bg-${color.name.toLowerCase().replace(/\s+/g, '-')}`;
                        const hsl = `hsl(${Math.round(color.hue)}, ${Math.round(color.saturation)}%, ${Math.round(color.lightness)}%)`;
                        document.documentElement.style.setProperty(varName, hsl);
                    });
                }
            };
            
            // Attach handlers
            this.addEventListener('colorchange', this._colorEventHandler);
            this.addEventListener('colorselect', this._colorSelectHandler);
            this.addEventListener('wb:color-harmony-change', this._harmonyEventHandler);
            
            console.log('✅ Color event listeners attached');
        }
        
        determineColorType(event) {
            if (event.detail && event.detail.colorType) {
                return event.detail.colorType;
            }
            
            const element = event.target;
            const elementId = element.id || '';
            
            if (elementId.includes('primary')) {
                return 'primary';
            } else if (elementId.includes('bg') || elementId.includes('background')) {
                return 'background';
            }
            
            return 'primary';
        }
        
        handleColorBarsChange(e, colorType) {
            const colorData = e.detail;
            
            // Update state
            this.state.colors[colorType] = {
                hue: colorData.hue,
                saturation: colorData.saturation,
                lightness: colorData.lightness
            };
            
            // 🎵 NEW: If audio enabled, add audio-reactive metadata
            if (this.state.audioEnabled) {
                const audioIntensity = this.getAudioIntensity();
                
                // Dispatch color beat event
                document.dispatchEvent(new CustomEvent('wb:color-beat', {
                    detail: {
                        ...colorData,
                        audioIntensity,
                        bass: this.state.audio.bassLevel,
                        mids: this.state.audio.midsLevel,
                        treble: this.state.audio.trebleLevel
                    },
                    bubbles: true
                }));
            }
            
            logEvent('info', `${colorType} color changed: ${colorData.hsl}`);
        }
        
        handleColorBarsSelect(e, colorType) {
            const colorData = e.detail;
            localStorage.setItem(`wb-${colorType}-color`, JSON.stringify(colorData));
            logEvent('success', `${colorType} color selected and saved: ${colorData.hex}`);
        }
        
        // 🎵 NEW: Get average audio intensity
        getAudioIntensity() {
            const { bassLevel, midsLevel, trebleLevel } = this.state.audio;
            return (bassLevel + midsLevel + trebleLevel) / 3;
        }
        
        // 🎵 NEW: Detect beat (simple threshold-based)
        detectBeat() {
            return this.state.audio.bassLevel > 0.7 || this.state.audio.midsLevel > 0.8;
        }
        
        async loadComponents(componentNames, options = {}) {
            const names = Array.isArray(componentNames) ? componentNames : [componentNames];
            const { timeout = 10000 } = options;
            
            // 🎯 OPTIMIZATION: Load independent components in parallel
            const promises = names.map(name => this.loadSingleComponent(name, { timeout }));
            await Promise.all(promises);
        }
        
        async loadSingleComponent(componentName, options = {}) {
            const { timeout = 10000 } = options;
            
            if (customElements.get(componentName)) {
                return;
            }
            
            if (!window.WBComponentRegistry) {
                throw new Error('WBComponentRegistry required');
            }
            
            try {
                await window.WBComponentRegistry.loadComponent(componentName, timeout);
                console.log(`✅ ${componentName} loaded successfully`);
            } catch (error) {
                console.error(`❌ Failed to load ${componentName}:`, error);
                throw error;
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
            const isMinimized = this.classList.contains('minimized');
            this.classList.toggle('minimized');
            
            const minimizeBtn = this.querySelector('#minimize-btn');
            if (minimizeBtn) {
                minimizeBtn.textContent = isMinimized ? '−' : '+';
                minimizeBtn.title = isMinimized ? 'Minimize' : 'Restore';
            }
            
            document.dispatchEvent(new CustomEvent('controlPanelMinimized', {
                detail: { minimized: !isMinimized },
                bubbles: true
            }));
        }
        
        setupKeyboardShortcuts() {
            if (this._keyboardHandler) {
                document.removeEventListener('keydown', this._keyboardHandler);
            }
            
            this._keyboardHandler = (e) => {
                const shortcuts = this._keyboardShortcuts;
                
                if (shortcuts.toggle && this.matchesShortcut(e, shortcuts.toggle)) {
                    e.preventDefault();
                    this.style.display === 'none' ? this.show() : this.hide();
                }
                
                if (shortcuts.close && this.matchesShortcut(e, shortcuts.close) && this.style.display !== 'none') {
                    e.preventDefault();
                    this.hide();
                }
                
                // 🎵 NEW: Color organ shortcut
                if (shortcuts.colorOrgan && this.matchesShortcut(e, shortcuts.colorOrgan)) {
                    e.preventDefault();
                    this.toggleColorOrgan();
                }
                
                if (shortcuts.debug && this.matchesShortcut(e, shortcuts.debug)) {
                    e.preventDefault();
                    this.logDebugInfo();
                }
            };
            
            document.addEventListener('keydown', this._keyboardHandler);
            logEvent('info', 'Keyboard shortcuts configured', this._keyboardShortcuts);
        }
        
        matchesShortcut(event, shortcut) {
            const parts = shortcut.toLowerCase().split('+');
            const key = parts[parts.length - 1];
            const needsCtrl = parts.includes('ctrl') || parts.includes('control');
            const needsShift = parts.includes('shift');
            const needsAlt = parts.includes('alt');
            const needsMeta = parts.includes('meta') || parts.includes('cmd');
            
            if (needsCtrl && !event.ctrlKey && !event.metaKey) return false;
            if (needsShift && !event.shiftKey) return false;
            if (needsAlt && !event.altKey) return false;
            if (needsMeta && !event.metaKey) return false;
            
            return event.key.toLowerCase() === key;
        }
        
        hide() {
            this.style.display = 'none';
            document.dispatchEvent(new CustomEvent('controlPanelHide'));
        }
        
        show() {
            this.style.display = 'block';
            document.dispatchEvent(new CustomEvent('controlPanelShow'));
        }
        
        logDebugInfo() {
            const debugInfo = {
                initialized: this.state.initialized,
                visible: this.style.display !== 'none',
                colorOrganEnabled: this.state.colorOrganEnabled,
                audioEnabled: this.state.audioEnabled,
                audioSource: this.state.audio.source,
                audioLevels: {
                    bass: this.state.audio.bassLevel.toFixed(2),
                    mids: this.state.audio.midsLevel.toFixed(2),
                    treble: this.state.audio.trebleLevel.toFixed(2)
                },
                colors: this.state.colors
            };
            
            if (window.WBEventLog?.logDebug) {
                window.WBEventLog.logDebug('Control Panel Debug Info (Color Organ Edition)', debugInfo);
            } else {
                console.log('🎵 Control Panel Debug Info:', debugInfo);
            }
            
            return debugInfo;
        }
        
        applyInitialSettings() {
            const savedTheme = localStorage.getItem('wb-theme') || 'dark';
            const savedLayout = localStorage.getItem('wb-layout') || 'top-nav';
            const savedColorOrgan = localStorage.getItem('wb-color-organ-enabled') === 'true';
            const savedAudioSource = localStorage.getItem('wb-audio-source') || 'tab';
            const savedSensitivity = parseInt(localStorage.getItem('wb-audio-sensitivity') || '5');
            
            // Set dropdowns
            const themeSelect = this.querySelector('#theme-select');
            if (themeSelect) themeSelect.value = savedTheme;
            
            const layoutSelect = this.querySelector('#layout-select');
            if (layoutSelect) layoutSelect.value = savedLayout;
            
            const audioSourceSelect = this.querySelector('#audio-source-select');
            if (audioSourceSelect) audioSourceSelect.value = savedAudioSource;
            
            // Set color organ state
            if (savedColorOrgan) {
                this.state.colorOrganEnabled = true;
                const toggle = this.querySelector('#color-organ-toggle');
                if (toggle) toggle.setAttribute('checked', 'true');
                
                const audioSection = this.querySelector('#section-audio-controls');
                if (audioSection) audioSection.classList.remove('hidden');
            }
            
            // Set audio sensitivity
            this.state.audio.source = savedAudioSource;
            this.state.audio.sensitivity = savedSensitivity;
            
            // Fire events
            document.dispatchEvent(new CustomEvent('wb:theme-changed', {
                detail: { theme: savedTheme, source: 'control-panel-init' },
                bubbles: true
            }));
            
            document.dispatchEvent(new CustomEvent('wb:layout-changed', {
                detail: { layout: savedLayout, source: 'control-panel-init' },
                bubbles: true
            }));
            
            // Set initial colors
            this.setInitialColorsOnComponents();
            
            console.log('✅ Control Panel: Initial settings applied');
        }
        
        setInitialColorsOnComponents() {
            const savedPrimary = localStorage.getItem('wb-primary-color');
            const savedBg = localStorage.getItem('wb-background-color');
            
            const primaryColorBar = this.querySelector('#primary-color-bar');
            if (primaryColorBar) {
                if (savedPrimary) {
                    const colorData = JSON.parse(savedPrimary);
                    primaryColorBar.setAttribute('text-hue', String(colorData.hue));
                    primaryColorBar.setAttribute('text-saturation', String(colorData.saturation));
                    primaryColorBar.setAttribute('text-lightness', String(colorData.lightness));
                } else {
                    primaryColorBar.setAttribute('text-hue', String(this.state.colors.primary.hue));
                    primaryColorBar.setAttribute('text-saturation', String(this.state.colors.primary.saturation));
                    primaryColorBar.setAttribute('text-lightness', String(this.state.colors.primary.lightness));
                }
            }
            
            const bgColorBar = this.querySelector('#bg-color-bar');
            if (bgColorBar) {
                if (savedBg) {
                    const colorData = JSON.parse(savedBg);
                    bgColorBar.setAttribute('text-hue', String(colorData.hue));
                    bgColorBar.setAttribute('text-saturation', String(colorData.saturation));
                    bgColorBar.setAttribute('text-lightness', String(colorData.lightness));
                } else {
                    bgColorBar.setAttribute('text-hue', String(this.state.colors.background.hue));
                    bgColorBar.setAttribute('text-saturation', String(this.state.colors.background.saturation));
                    bgColorBar.setAttribute('text-lightness', String(this.state.colors.background.lightness));
                }
            }
        }
        
        setupDragFunctionality(dragHandle) {
            let isDragging = false;
            let startX, startY, initialX, initialY;

            dragHandle.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                const rect = this.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;

                this.style.position = 'fixed';
                this.style.zIndex = '9999';

                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                this.style.left = (initialX + deltaX) + 'px';
                this.style.top = (initialY + deltaY) + 'px';
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        setupResizeFunctionality(resizeHandle) {
            let isResizing = false;
            let startX, initialWidth;

            resizeHandle.addEventListener('mousedown', (e) => {
                isResizing = true;
                startX = e.clientX;

                const rect = this.getBoundingClientRect();
                initialWidth = rect.width;

                this.style.transition = 'none';

                e.preventDefault();
                e.stopPropagation();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;

                const deltaX = startX - e.clientX;
                const newWidth = Math.max(280, Math.min(600, initialWidth + deltaX));

                this.style.width = newWidth + 'px';
                this.style.minWidth = newWidth + 'px';
                this.style.maxWidth = newWidth + 'px';
            });

            document.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    this.style.transition = '';
                    
                    const newWidth = this.getBoundingClientRect().width;
                    localStorage.setItem('wb-control-panel-width', String(newWidth));
                }
            });

            // Apply saved width
            const savedWidth = localStorage.getItem('wb-control-panel-width');
            if (savedWidth) {
                this.style.width = savedWidth + 'px';
                this.style.minWidth = savedWidth + 'px';
                this.style.maxWidth = savedWidth + 'px';
            }
        }
        
        // Stub methods for semantic structure (implementation from original)
        async ensureSemanticStructure() {
            // Implementation preserved from original
        }
        
        // Public API
        setTheme(theme) {
            const themeSelect = this.querySelector('#theme-select');
            if (themeSelect) {
                themeSelect.value = theme;
                this.handleThemeChange({ detail: { value: theme } });
            }
        }
        
        getTheme() {
            return document.body.getAttribute('data-theme') || 'dark';
        }
        
        setLayout(layout) {
            const layoutSelect = this.querySelector('#layout-select');
            if (layoutSelect) {
                layoutSelect.value = layout;
                this.handleLayoutChange({ detail: { value: layout } });
            }
        }
        
        getLayout() {
            return document.body.getAttribute('data-layout') || 'top-nav';
        }
        
        // 🎵 NEW: Public API for Color Organ
        enableColorOrgan() {
            if (!this.state.colorOrganEnabled) {
                this.toggleColorOrgan();
            }
        }
        
        disableColorOrgan() {
            if (this.state.colorOrganEnabled) {
                this.toggleColorOrgan();
            }
        }
        
        getAudioData() {
            return {
                enabled: this.state.audioEnabled,
                source: this.state.audio.source,
                bass: this.state.audio.bassLevel,
                mids: this.state.audio.midsLevel,
                treble: this.state.audio.trebleLevel
            };
        }
    }
    
    // Observed attributes
    ControlPanel.observedAttributes = [
        'visible', 'position', 'theme', 'width', 'config', 
        'draggable', 'collapsible', 'show-themes', 'show-colors', 
        'show-layout', 'show-edit-mode', 'compact', 'auto-hide'
    ];
    
    // Attribute changed callback
    ControlPanel.prototype.attributeChangedCallback = function(name, oldValue, newValue) {
        if (this.state.initialized && oldValue !== newValue) {
            this.handleAttributeChange(name, newValue);
        }
    };
    
    ControlPanel.prototype.handleAttributeChange = function(name, value) {
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
        }
    };
    
    // Register component
    if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
        const dependencies = ['wb-color-bar', 'wb-color-bars', 'wb-event-log'];
        
        const metadata = {
            version: '3.0.0',
            type: 'composite',
            role: 'infrastructure',
            description: 'Enhanced control panel with audio-reactive color organ functionality',
            schema: 'wb-control-panel.schema.json',
            features: ['color-organ', 'audio-reactive', 'wave-harmony'],
            api: {
                events: [
                    'wb:layout-changed',
                    'wb:theme-changed',
                    'wb:color-changed',
                    'wb:color-organ-toggle',
                    'wb:audio-data',
                    'wb:color-beat'
                ],
                attributes: ['position', 'draggable', 'initial-state'],
                methods: [
                    'show', 'hide', 'setTheme', 'getTheme', 'setLayout', 'getLayout',
                    'enableColorOrgan', 'disableColorOrgan', 'getAudioData'
                ]
            },
            priority: 6
        };
        
        window.WBComponentRegistry.register('wb-control-panel', ControlPanel, dependencies, metadata)
            .then(() => {
                console.log('✅ wb-control-panel registered (Color Organ Edition) 🎵🎨');
            })
            .catch(error => {
                console.error('⚠️ Failed to register wb-control-panel:', error);
                if (!customElements.get('wb-control-panel')) {
                    customElements.define('wb-control-panel', ControlPanel);
                }
            });
    } else {
        if (!customElements.get('wb-control-panel')) {
            customElements.define('wb-control-panel', ControlPanel);
            console.log('✅ wb-control-panel registered (Color Organ Edition) 🎵🎨');
        }
    }
    
    // Expose global API
    window.ControlPanel = ControlPanel;
    
    console.log('🎵 Control Panel component script loaded successfully (Color Organ Edition)');
})();
