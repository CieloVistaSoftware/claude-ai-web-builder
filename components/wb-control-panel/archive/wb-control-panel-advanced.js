// wb-control-panel-advanced.js
// CLEAN VERSION - Single Responsibility Principle Compliant
// Fixed: Dark/Light toggle, Theme category dropdown, HCS naming

class WBControlPanelAdvanced extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.state = {
            mode: 'dark',
            theme: 'default',
            themeCategory: 'named',
            harmonyMode: 'complementary',
            layout: 'top-nav',
            primaryHue: 240,
            primarySat: 70,
            primaryLight: 50
        };
    }

    connectedCallback() {
        this.loadState();
        this.render();
        this.attachEventListeners();
        this.applyState();
    }

    loadState() {
        this.state.mode = localStorage.getItem('wb-mode') || 'dark';
        this.state.theme = localStorage.getItem('wb-theme') || 'default';
        this.state.themeCategory = localStorage.getItem('wb-theme-category') || 'named';
        this.state.harmonyMode = localStorage.getItem('wb-harmony-mode') || 'complementary';
        this.state.layout = localStorage.getItem('wb-layout') || 'top-nav';
        this.state.primaryHue = parseInt(localStorage.getItem('wb-hue-primary') || '240');
        this.state.primarySat = parseInt(localStorage.getItem('wb-sat-primary') || '70');
        this.state.primaryLight = parseInt(localStorage.getItem('wb-light-primary') || '50');
    }

    saveState() {
        localStorage.setItem('wb-mode', this.state.mode);
        localStorage.setItem('wb-theme', this.state.theme);
        localStorage.setItem('wb-theme-category', this.state.themeCategory);
        localStorage.setItem('wb-harmony-mode', this.state.harmonyMode);
        localStorage.setItem('wb-layout', this.state.layout);
        localStorage.setItem('wb-hue-primary', this.state.primaryHue);
        localStorage.setItem('wb-sat-primary', this.state.primarySat);
        localStorage.setItem('wb-light-primary', this.state.primaryLight);
    }

    getNamedThemes() {
        return {
            'default': { name: 'Default', hue: 240, sat: 70, light: 50 },
            'cyberpunk': { name: 'Cyberpunk', hue: 320, sat: 85, light: 55 },
            'neon-city': { name: 'Neon City', hue: 180, sat: 90, light: 50 },
            'ocean': { name: 'Ocean', hue: 200, sat: 80, light: 50 },
            'forest': { name: 'Forest', hue: 140, sat: 70, light: 45 },
            'sunset': { name: 'Sunset', hue: 25, sat: 85, light: 55 },
            'aurora': { name: 'Aurora', hue: 160, sat: 70, light: 50 },
            'purple': { name: 'Purple', hue: 280, sat: 75, light: 50 },
            'emerald': { name: 'Emerald', hue: 150, sat: 70, light: 45 },
            'ruby': { name: 'Ruby', hue: 350, sat: 80, light: 50 },
            'sapphire': { name: 'Sapphire', hue: 220, sat: 85, light: 50 },
            'amber': { name: 'Amber', hue: 45, sat: 80, light: 55 },
            'mint': { name: 'Mint', hue: 160, sat: 60, light: 60 },
            'coral': { name: 'Coral', hue: 10, sat: 75, light: 60 }
        };
    }

    getHCSThemes() {
        return {
            'corporate-blue': {
                name: 'Corporate Blue',
                colors: {
                    primary: { hue: 215, sat: 75, light: 50 },
                    secondary: { hue: 190, sat: 60, light: 45 },
                    accent: { hue: 35, sat: 80, light: 55 },
                    success: { hue: 145, sat: 70, light: 45 },
                    warning: { hue: 40, sat: 85, light: 55 },
                    danger: { hue: 355, sat: 80, light: 50 },
                    info: { hue: 200, sat: 75, light: 50 },
                    neutral: { hue: 220, sat: 15, light: 40 }
                }
            },
            'creative-studio': {
                name: 'Creative Studio',
                colors: {
                    primary: { hue: 280, sat: 75, light: 55 },
                    secondary: { hue: 320, sat: 70, light: 50 },
                    accent: { hue: 180, sat: 80, light: 50 },
                    success: { hue: 155, sat: 65, light: 50 },
                    warning: { hue: 45, sat: 85, light: 55 },
                    danger: { hue: 350, sat: 85, light: 55 },
                    info: { hue: 200, sat: 70, light: 50 },
                    neutral: { hue: 280, sat: 10, light: 40 }
                }
            },
            'tech-startup': {
                name: 'Tech Startup',
                colors: {
                    primary: { hue: 195, sat: 80, light: 50 },
                    secondary: { hue: 270, sat: 70, light: 55 },
                    accent: { hue: 330, sat: 75, light: 55 },
                    success: { hue: 145, sat: 70, light: 48 },
                    warning: { hue: 38, sat: 85, light: 55 },
                    danger: { hue: 5, sat: 80, light: 52 },
                    info: { hue: 210, sat: 75, light: 50 },
                    neutral: { hue: 220, sat: 12, light: 38 }
                }
            },
            'gaming-portal': {
                name: 'Gaming Portal',
                colors: {
                    primary: { hue: 0, sat: 85, light: 50 },
                    secondary: { hue: 340, sat: 80, light: 48 },
                    accent: { hue: 280, sat: 90, light: 55 },
                    success: { hue: 120, sat: 75, light: 45 },
                    warning: { hue: 45, sat: 90, light: 55 },
                    danger: { hue: 0, sat: 85, light: 50 },
                    info: { hue: 200, sat: 70, light: 50 },
                    neutral: { hue: 0, sat: 5, light: 35 }
                }
            }
        };
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    width: 380px;
                    max-height: calc(100vh - 2rem);
                    background: rgba(17, 24, 39, 0.98);
                    backdrop-filter: blur(16px);
                    border-radius: 16px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
                    color: white;
                    font-family: system-ui, -apple-system, sans-serif;
                    z-index: 10000;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }
                
                :host([data-mode="light"]) {
                    background: rgba(255, 255, 255, 0.98);
                    color: #1e293b;
                    border-color: rgba(0, 0, 0, 0.1);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
                }
                
                .panel-header {
                    padding: 1.5rem;
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    flex-shrink: 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                :host([data-mode="light"]) .panel-header {
                    border-bottom-color: rgba(0, 0, 0, 0.1);
                }
                
                h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.5rem;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .subtitle {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin: 0;
                }
                
                :host([data-mode="light"]) .subtitle {
                    color: rgba(0, 0, 0, 0.5);
                }
                
                .mode-toggle {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50px;
                    padding: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    min-width: 80px;
                }
                
                :host([data-mode="light"]) .mode-toggle {
                    background: rgba(0, 0, 0, 0.05);
                    border-color: rgba(0, 0, 0, 0.2);
                }
                
                .mode-toggle:hover {
                    background: rgba(255, 255, 255, 0.15);
                    transform: scale(1.05);
                }
                
                :host([data-mode="light"]) .mode-toggle:hover {
                    background: rgba(0, 0, 0, 0.1);
                }
                
                .mode-icon { font-size: 1.25rem; }
                .mode-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .panel-body {
                    padding: 1.5rem;
                    overflow-y: auto;
                    flex: 1;
                }
                
                .control-group { margin-bottom: 1.5rem; }
                
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                :host([data-mode="light"]) label {
                    color: rgba(0, 0, 0, 0.7);
                }
                
                select, input[type="range"] { width: 100%; }
                select {
                    padding: 0.75rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    color: white;
                    font-size: 0.875rem;
                    cursor: pointer;
                }
                
                :host([data-mode="light"]) select {
                    background: rgba(0, 0, 0, 0.05);
                    border-color: rgba(0, 0, 0, 0.2);
                    color: #1e293b;
                }
                
                select option { background: #1e293b; }
                :host([data-mode="light"]) select option { background: white; }
                
                input[type="range"] {
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    outline: none;
                    -webkit-appearance: none;
                    margin: 0.5rem 0;
                }
                
                :host([data-mode="light"]) input[type="range"] {
                    background: rgba(0, 0, 0, 0.1);
                }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #6366f1;
                    cursor: pointer;
                }
                
                .value-display {
                    float: right;
                    font-weight: 600;
                    color: #6366f1;
                    font-size: 0.75rem;
                }
                
                .color-preview {
                    width: 100%;
                    height: 60px;
                    border-radius: 8px;
                    margin-top: 0.75rem;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: white;
                }
                
                .section-title {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.4);
                    margin: 1.5rem 0 0.75rem 0;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                :host([data-mode="light"]) .section-title {
                    color: rgba(0, 0, 0, 0.4);
                    border-bottom-color: rgba(0, 0, 0, 0.1);
                }
                
                .info-text {
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.4);
                    margin-top: 0.5rem;
                    font-style: italic;
                }
                
                :host([data-mode="light"]) .info-text {
                    color: rgba(0, 0, 0, 0.4);
                }
            </style>
            
            <div class="panel-header">
                <div class="header-content">
                    <h3>🎨 Control Panel</h3>
                    <p class="subtitle">Theme System</p>
                </div>
                <div class="mode-toggle" id="mode-toggle">
                    <span class="mode-icon" id="mode-icon">🌙</span>
                    <span class="mode-label" id="mode-label">DARK</span>
                </div>
            </div>
            
            <div class="panel-body">
                <div class="control-group">
                    <label>Theme Category</label>
                    <select id="theme-category-dropdown">
                        <option value="named">🎨 Named Colors</option>
                        <option value="hcs">🌊 HCS (Harmonic Color System)</option>
                    </select>
                    <p class="info-text" id="category-info">Single-color themes with auto-calculated harmonies</p>
                </div>
                
                <div class="control-group">
                    <label>Select Theme</label>
                    <select id="theme-dropdown"></select>
                </div>
                
                <div class="section-title">Color Harmony</div>
                
                <div class="control-group">
                    <label>Harmony Mode</label>
                    <select id="harmony-select">
                        <optgroup label="Traditional">
                            <option value="complementary">Complementary</option>
                            <option value="splitComplementary">Split Complementary</option>
                            <option value="triadic">Triadic</option>
                            <option value="tetradic">Tetradic</option>
                            <option value="analogous">Analogous</option>
                        </optgroup>
                        <optgroup label="Wave Theory">
                            <option value="beatPattern">Beat Pattern</option>
                            <option value="harmonicSeries">Harmonic Series</option>
                            <option value="dopplerShift">Doppler Shift</option>
                            <option value="standingWave">Standing Wave</option>
                        </optgroup>
                    </select>
                </div>
                
                <div class="section-title">Fine-Tune Colors</div>
                
                <div class="control-group">
                    <label>Primary Hue <span class="value-display" id="hue-display">240°</span></label>
                    <input type="range" id="hue-slider" min="0" max="360" value="240">
                </div>
                
                <div class="control-group">
                    <label>Saturation <span class="value-display" id="sat-display">70%</span></label>
                    <input type="range" id="sat-slider" min="0" max="100" value="70">
                </div>
                
                <div class="control-group">
                    <label>Lightness <span class="value-display" id="light-display">50%</span></label>
                    <input type="range" id="light-slider" min="0" max="100" value="50">
                    <div class="color-preview" id="color-preview">PREVIEW</div>
                </div>
                
                <div class="section-title">Layout</div>
                
                <div class="control-group">
                    <label>Page Layout</label>
                    <select id="layout-select">
                        <option value="top-nav">Top Navigation</option>
                        <option value="left-nav">Left Sidebar</option>
                        <option value="right-nav">Right Sidebar</option>
                    </select>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const $ = (id) => this.shadowRoot.getElementById(id);
        
        // Dark/Light mode toggle
        $('mode-toggle').addEventListener('click', () => {
            this.state.mode = this.state.mode === 'dark' ? 'light' : 'dark';
            this.updateModeUI();
            this.setAttribute('data-mode', this.state.mode);
            this.dispatch('mode-changed', { mode: this.state.mode });
            this.saveState();
        });
        
        // Theme category dropdown
        $('theme-category-dropdown').addEventListener('change', (e) => {
            this.state.themeCategory = e.target.value;
            this.updateCategoryInfo();
            this.updateThemeDropdown();
            this.saveState();
        });
        
        // Theme dropdown
        $('theme-dropdown').addEventListener('change', (e) => {
            this.state.theme = e.target.value;
            if (this.state.themeCategory === 'named') {
                const themeData = this.getNamedThemes()[this.state.theme];
                if (themeData) {
                    this.state.primaryHue = themeData.hue;
                    this.state.primarySat = themeData.sat;
                    this.state.primaryLight = themeData.light;
                    this.updateSliders();
                }
            }
            this.dispatchThemeChange();
            this.saveState();
        });
        
        // Harmony
        $('harmony-select').addEventListener('change', (e) => {
            this.state.harmonyMode = e.target.value;
            this.dispatch('harmony-changed', { mode: this.state.harmonyMode });
            this.saveState();
        });
        
        // Color sliders
        $('hue-slider').addEventListener('input', (e) => {
            this.state.primaryHue = parseInt(e.target.value);
            $('hue-display').textContent = `${e.target.value}°`;
            this.updatePreview();
            this.dispatchColorChange();
            this.saveState();
        });
        
        $('sat-slider').addEventListener('input', (e) => {
            this.state.primarySat = parseInt(e.target.value);
            $('sat-display').textContent = `${e.target.value}%`;
            this.updatePreview();
            this.dispatchColorChange();
            this.saveState();
        });
        
        $('light-slider').addEventListener('input', (e) => {
            this.state.primaryLight = parseInt(e.target.value);
            $('light-display').textContent = `${e.target.value}%`;
            this.updatePreview();
            this.dispatchColorChange();
            this.saveState();
        });
        
        // Layout
        $('layout-select').addEventListener('change', (e) => {
            this.state.layout = e.target.value;
            this.dispatch('layout-changed', { layout: this.state.layout });
            this.saveState();
        });
    }

    updateModeUI() {
        const $ = (id) => this.shadowRoot.getElementById(id);
        $('mode-icon').textContent = this.state.mode === 'dark' ? '🌙' : '☀️';
        $('mode-label').textContent = this.state.mode.toUpperCase();
    }

    updateCategoryInfo() {
        const info = this.shadowRoot.getElementById('category-info');
        info.textContent = this.state.themeCategory === 'named' 
            ? 'Single-color themes with auto-calculated harmonies'
            : 'Complete color palettes with predefined element colors';
    }

    updateThemeDropdown() {
        const dropdown = this.shadowRoot.getElementById('theme-dropdown');
        dropdown.innerHTML = '';
        
        const themes = this.state.themeCategory === 'named' ? this.getNamedThemes() : this.getHCSThemes();
        Object.entries(themes).forEach(([id, data]) => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = data.name;
            dropdown.appendChild(opt);
        });
        
        // Reset to first theme when switching categories
        this.state.theme = Object.keys(themes)[0];
        dropdown.value = this.state.theme;
        
        // Dispatch theme change
        this.dispatchThemeChange();
    }

    updateSliders() {
        const $ = (id) => this.shadowRoot.getElementById(id);
        $('hue-slider').value = this.state.primaryHue;
        $('sat-slider').value = this.state.primarySat;
        $('light-slider').value = this.state.primaryLight;
        $('hue-display').textContent = `${this.state.primaryHue}°`;
        $('sat-display').textContent = `${this.state.primarySat}%`;
        $('light-display').textContent = `${this.state.primaryLight}%`;
        this.updatePreview();
    }

    updatePreview() {
        const { primaryHue, primarySat, primaryLight } = this.state;
        this.shadowRoot.getElementById('color-preview').style.backgroundColor = 
            `hsl(${primaryHue}, ${primarySat}%, ${primaryLight}%)`;
    }

    dispatch(name, detail) {
        document.dispatchEvent(new CustomEvent(`wb:${name}`, { detail, bubbles: true, composed: true }));
        console.log(`📢 wb:${name}`, detail);
    }

    dispatchThemeChange() {
        const themes = this.state.themeCategory === 'named' ? this.getNamedThemes() : this.getHCSThemes();
        this.dispatch('theme-changed', {
            theme: this.state.theme,
            category: this.state.themeCategory,
            data: themes[this.state.theme]
        });
    }

    dispatchColorChange() {
        this.dispatch('color-changed', {
            hue: this.state.primaryHue,
            saturation: this.state.primarySat,
            lightness: this.state.primaryLight
        });
    }

    applyState() {
        const $ = (id) => this.shadowRoot.getElementById(id);
        
        this.setAttribute('data-mode', this.state.mode);
        this.updateModeUI();
        $('theme-category-dropdown').value = this.state.themeCategory;
        this.updateCategoryInfo();
        this.updateThemeDropdown();
        $('harmony-select').value = this.state.harmonyMode;
        $('layout-select').value = this.state.layout;
        this.updateSliders();
        
        // Dispatch all events on load
        this.dispatch('mode-changed', { mode: this.state.mode });
        this.dispatchThemeChange();
        this.dispatch('harmony-changed', { mode: this.state.harmonyMode });
        this.dispatch('layout-changed', { layout: this.state.layout });
        this.dispatchColorChange();
    }
}

customElements.define('wb-control-panel-advanced', WBControlPanelAdvanced);

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBControlPanelAdvanced = WBControlPanelAdvanced;

// Backward compatibility
window.WBControlPanelAdvanced = WBControlPanelAdvanced;

// ES6 Module Export
export { WBControlPanelAdvanced };
export default WBControlPanelAdvanced;

console.log('✅ Clean Control Panel - Fixed: Dark/Light toggle, Category dropdown, HCS naming');
