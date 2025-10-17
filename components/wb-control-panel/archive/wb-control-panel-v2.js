// wb-control-panel-v2.js - IMPROVED VERSION
// Simple control panel with theme support and customizable CSS variables

class WBControlPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // 🎨 Customizable CSS variable names (can be set via attributes)
        this.cssVars = {
            hue: '--text-primary',
            sat: '--text-primary', 
            light: '--text-primary',
            primary: '--primary'
        };
    }
    
    connectedCallback() {
        // Read custom CSS variable names from attributes
        if (this.hasAttribute('css-hue')) this.cssVars.hue = this.getAttribute('css-hue');
        if (this.hasAttribute('css-sat')) this.cssVars.sat = this.getAttribute('css-sat');
        if (this.hasAttribute('css-light')) this.cssVars.light = this.getAttribute('css-light');
        if (this.hasAttribute('css-primary')) this.cssVars.primary = this.getAttribute('css-primary');
        
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    width: 320px;
                    max-height: calc(100vh - 2rem);
                    background: rgba(17, 24, 39, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                    color: white;
                    font-family: system-ui, -apple-system, sans-serif;
                    z-index: 10000;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                
                .panel-header {
                    padding: 1.5rem 1.5rem 1rem 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    flex-shrink: 0;
                }
                
                h3 {
                    margin: 0;
                    font-size: 1.25rem;
                }
                
                .panel-body {
                    padding: 1rem 1.5rem 1.5rem 1.5rem;
                    overflow-y: auto;
                    overflow-x: hidden;
                    flex: 1;
                }
                
                /* Custom scrollbar */
                .panel-body::-webkit-scrollbar {
                    width: 8px;
                }
                
                .panel-body::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                
                .panel-body::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.5);
                    border-radius: 4px;
                }
                
                .panel-body::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.7);
                }
                
                .control-group {
                    margin-bottom: 1.5rem;
                }
                
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.8);
                }
                
                input[type="range"] {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: rgba(255, 255, 255, 0.1);
                    outline: none;
                    -webkit-appearance: none;
                }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #6366f1;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                
                input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }
                
                input[type="range"]::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #6366f1;
                    cursor: pointer;
                    border: none;
                    transition: transform 0.2s;
                }
                
                input[type="range"]::-moz-range-thumb:hover {
                    transform: scale(1.2);
                }
                
                .value-display {
                    display: inline-block;
                    margin-left: 0.5rem;
                    font-weight: 600;
                    color: #6366f1;
                    min-width: 3rem;
                    text-align: right;
                }
                
                select {
                    width: 100%;
                    padding: 0.625rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    color: white;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                select:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                
                select:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }
                
                select option {
                    background: #1e293b;
                    padding: 0.5rem;
                }
                
                .color-preview {
                    width: 100%;
                    height: 50px;
                    border-radius: 6px;
                    margin-top: 0.5rem;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                }
                
                .section-title {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: rgba(255, 255, 255, 0.5);
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .info-text {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 0.5rem;
                    font-style: italic;
                }
            </style>
            
            <div class="panel-header">
                <h3>🎛️ Control Panel</h3>
            </div>
            
            <div class="panel-body">
                <div class="control-group">
                    <div class="section-title">Appearance</div>
                    <label>Theme</label>
                    <select id="theme-select">
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="cyberpunk">Cyberpunk</option>
                        <option value="ocean">Ocean</option>
                        <option value="sunset">Sunset</option>
                    </select>
                </div>
                
                <div class="control-group">
                    <label>Layout</label>
                    <select id="layout-select">
                        <option value="top-nav">Top Navigation</option>
                        <option value="left-nav">Left Sidebar</option>
                        <option value="right-nav">Right Sidebar</option>
                    </select>
                </div>
                
                <div class="control-group">
                    <div class="section-title">Primary Color</div>
                    <label>
                        Hue
                        <span class="value-display" id="hue-value">240°</span>
                    </label>
                    <input type="range" id="text-hue" min="0" max="360" value="240">
                </div>
                
                <div class="control-group">
                    <label>
                        Saturation
                        <span class="value-display" id="sat-value">70%</span>
                    </label>
                    <input type="range" id="text-sat" min="0" max="100" value="70">
                </div>
                
                <div class="control-group">
                    <label>
                        Lightness
                        <span class="value-display" id="light-value">50%</span>
                    </label>
                    <input type="range" id="text-light" min="0" max="100" value="50">
                    <div class="color-preview" id="text-preview"></div>
                    <div class="info-text">Applying to: ${this.cssVars.primary}</div>
                </div>
                
                <div class="control-group">
                    <div class="section-title">Background Color</div>
                    <label>
                        BG Hue
                        <span class="value-display" id="bg-hue-value">220°</span>
                    </label>
                    <input type="range" id="bg-hue" min="0" max="360" value="220">
                </div>
                
                <div class="control-group">
                    <label>
                        BG Saturation
                        <span class="value-display" id="bg-sat-value">25%</span>
                    </label>
                    <input type="range" id="bg-sat" min="0" max="100" value="25">
                </div>
                
                <div class="control-group">
                    <label>
                        BG Lightness
                        <span class="value-display" id="bg-light-value">15%</span>
                    </label>
                    <input type="range" id="bg-light" min="0" max="100" value="15">
                    <div class="color-preview" id="bg-preview"></div>
                    <div class="info-text">Applying to: --bg-primary, --background</div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // ✅ Theme change - Apply to page immediately
        const themeSelect = this.shadowRoot.getElementById('theme-select');
        themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            
            // Apply theme to body immediately
            document.body.setAttribute('data-theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            
            console.log(`✅ Applied theme: ${theme}`);
            
            // Also fire event for other components
            this.dispatchEvent(new CustomEvent('theme-change', {
                detail: { theme },
                bubbles: true,
                composed: true
            }));
        });
        
        // Layout change
        const layoutSelect = this.shadowRoot.getElementById('layout-select');
        layoutSelect.addEventListener('change', (e) => {
            const layout = e.target.value;
            
            // Apply layout to body immediately
            document.body.setAttribute('data-layout', layout);
            
            console.log(`✅ Applied layout: ${layout}`);
            
            // Also fire event
            this.dispatchEvent(new CustomEvent('layout-change', {
                detail: { layout },
                bubbles: true,
                composed: true
            }));
        });
        
        // Primary color controls
        const hueSlider = this.shadowRoot.getElementById('text-hue');
        const satSlider = this.shadowRoot.getElementById('text-sat');
        const lightSlider = this.shadowRoot.getElementById('text-light');
        
        const updatePrimaryColor = () => {
            const hue = parseInt(hueSlider.value);
            const sat = parseInt(satSlider.value);
            const light = parseInt(lightSlider.value);
            
            // Update value displays
            this.shadowRoot.getElementById('hue-value').textContent = `${hue}°`;
            this.shadowRoot.getElementById('sat-value').textContent = `${sat}%`;
            this.shadowRoot.getElementById('light-value').textContent = `${light}%`;
            
            // Update preview
            const color = `hsl(${hue}, ${sat}%, ${light}%)`;
            this.shadowRoot.getElementById('text-preview').style.backgroundColor = color;
            
            // ✅ Apply to CSS variables immediately
            document.documentElement.style.setProperty('--text-primary', color);
            document.documentElement.style.setProperty('--primary', color);
            document.documentElement.style.setProperty(this.cssVars.primary, color);
            
            console.log(`✅ Applied primary color: ${color} to ${this.cssVars.primary}`);
        };
        
        hueSlider.addEventListener('input', updatePrimaryColor);
        satSlider.addEventListener('input', updatePrimaryColor);
        lightSlider.addEventListener('input', updatePrimaryColor);
        
        // Background color controls
        const bgHueSlider = this.shadowRoot.getElementById('bg-hue');
        const bgSatSlider = this.shadowRoot.getElementById('bg-sat');
        const bgLightSlider = this.shadowRoot.getElementById('bg-light');
        
        const updateBgColor = () => {
            const hue = parseInt(bgHueSlider.value);
            const sat = parseInt(bgSatSlider.value);
            const light = parseInt(bgLightSlider.value);
            
            // Update value displays
            this.shadowRoot.getElementById('bg-hue-value').textContent = `${hue}°`;
            this.shadowRoot.getElementById('bg-sat-value').textContent = `${sat}%`;
            this.shadowRoot.getElementById('bg-light-value').textContent = `${light}%`;
            
            // Update preview
            const color = `hsl(${hue}, ${sat}%, ${light}%)`;
            this.shadowRoot.getElementById('bg-preview').style.backgroundColor = color;
            
            // ✅ Apply to CSS variables immediately
            document.documentElement.style.setProperty('--bg-primary', color);
            document.documentElement.style.setProperty('--background', color);
            
            console.log(`✅ Applied background color: ${color}`);
        };
        
        bgHueSlider.addEventListener('input', updateBgColor);
        bgSatSlider.addEventListener('input', updateBgColor);
        bgLightSlider.addEventListener('input', updateBgColor);
        
        // Set initial colors
        updatePrimaryColor();
        updateBgColor();
    }
}

customElements.define('wb-control-panel-v2', WBControlPanel);

console.log('✅ wb-control-panel-v2 loaded - IMPROVED VERSION with theme support');
