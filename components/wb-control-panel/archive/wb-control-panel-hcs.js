// wb-control-panel-v3.js - HCS-COMPATIBLE VERSION WITH MODE SUPPORT
// Designed to work with Harmonic Color System (HCS) from main.css
// Directly manipulates the root HSL values: --hue-primary, --saturation-primary, --lightness-primary
// NOW WITH MODE DROPDOWN for light/dark mode control

class WBControlPanelHCS extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Read initial values from CSS
        this.initialValues = {
            huePrimary: 240,
            satPrimary: 70,
            lightPrimary: 50,
            hueAccent: 60,
            satAccent: 60,
            lightAccent: 50
        };
        
        // Initialize harmony system
        this.harmonyMode = 'complementary';
        this.harmonySystem = null;
    }

    connectedCallback() {
        this.loadInitialValues();
        this.loadHarmonySystem();
        this.render();
        this.setupEventListeners();

        // Restore saved mode and theme from localStorage
        const savedMode = localStorage.getItem('wb-mode') || 'dark';
        const savedTheme = localStorage.getItem('wb-theme') || 'dark';

        // Apply saved values
        document.body.setAttribute('data-mode', savedMode);
        document.documentElement.setAttribute('data-mode', savedMode);
        document.body.setAttribute('data-theme', savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Set dropdown values
        setTimeout(() => {
            const modeSelect = this.shadowRoot.getElementById('mode-select');
            const themeSelect = this.shadowRoot.getElementById('theme-select');
            if (modeSelect) modeSelect.value = savedMode;
            if (themeSelect) themeSelect.value = savedTheme;

            console.log(`✅ HCS: Restored mode: ${savedMode}, theme: ${savedTheme}`);
        }, 0);
    }

    loadInitialValues() {
        // Read current values from :root
        const root = document.documentElement;
        const styles = getComputedStyle(root);

        this.initialValues.huePrimary = parseInt(styles.getPropertyValue('--hue-primary') || 240);
        this.initialValues.satPrimary = parseInt(styles.getPropertyValue('--saturation-primary') || 70);
        this.initialValues.lightPrimary = parseInt(styles.getPropertyValue('--lightness-primary') || 50);
        
        // Load saved harmony mode
        this.harmonyMode = localStorage.getItem('wb-harmony-mode') || 'complementary';
    }
    
    loadHarmonySystem() {
        // Load WBColorHarmony if available
        if (window.WBColorHarmony) {
            this.harmonySystem = new window.WBColorHarmony();
            console.log('✅ Harmony system loaded!');
        } else {
            console.warn('⚠️ WBColorHarmony not found - using default complementary mode');
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    width: 340px;
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
                    margin: 0 0 0.25rem 0;
                    font-size: 1.25rem;
                }
                
                .subtitle {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                    margin: 0;
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
                
                .control-group:last-child {
                    margin-bottom: 0;
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
                
                .value-display {
                    display: inline-block;
                    margin-left: 0.5rem;
                    font-weight: 600;
                    color: #6366f1;
                    min-width: 3.5rem;
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
                    height: 60px;
                    border-radius: 8px;
                    margin-top: 0.75rem;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
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
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.4);
                    margin-top: 0.5rem;
                    font-style: italic;
                    line-height: 1.4;
                }
                
                .hcs-badge {
                    display: inline-block;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.65rem;
                    font-weight: 600;
                    letter-spacing: 0.05em;
                }
                
                .harmony-info {
                    background: rgba(99, 102, 241, 0.1);
                    border-left: 3px solid #6366f1;
                    padding: 0.75rem;
                    border-radius: 4px;
                    margin-top: 1rem;
                }
                
                .harmony-info p {
                    margin: 0;
                    font-size: 0.75rem;
                    line-height: 1.5;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .color-swatch {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                }
                
                .swatch {
                    flex: 1;
                    height: 40px;
                    border-radius: 6px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
            </style>
            
            <div class="panel-header">
                <h3>🎨 HCS Control Panel</h3>
                <p class="subtitle">Harmonic Color System</p>
            </div>
            
            <div class="panel-body">
                <div class="control-group">
                    <div class="section-title">🌓 Appearance Mode</div>
                    <label>Mode</label>
                    <select id="mode-select">
                        <option value="dark">Dark Mode</option>
                        <option value="light">Light Mode</option>
                    </select>
                    <div class="info-text">Switch between light and dark base modes</div>
                </div>
                
                <div class="control-group">
                    <div class="section-title">🎨 Theme Presets</div>
                    <label>Theme</label>
                    <select id="theme-select">
                        <option value="default">Default</option>
                        <option value="cyberpunk">Cyberpunk</option>
                        <option value="ocean">Ocean</option>
                        <option value="sunset">Sunset</option>
                        <option value="forest">Forest</option>
                    </select>
                    <div class="info-text">Apply theme colors in current mode</div>
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
                    <div class="section-title">
                        🌊 Color Harmony Mode
                        <span class="hcs-badge">WAVE THEORY</span>
                    </div>
                    <label>Harmony Type</label>
                    <select id="harmony-select">
                        <optgroup label="Traditional Color Theory">
                            <option value="complementary" selected>Complementary (180°)</option>
                            <option value="splitComplementary">Split Complementary</option>
                            <option value="triadic">Triadic (120°)</option>
                            <option value="tetradic">Tetradic (90°)</option>
                            <option value="analogous">Analogous (±30°)</option>
                        </optgroup>
                        <optgroup label="Wave Theory">
                            <option value="beatPattern">Beat Pattern</option>
                            <option value="harmonicSeries">Harmonic Series</option>
                            <option value="dopplerShift">Doppler Shift</option>
                            <option value="standingWave">Standing Wave</option>
                        </optgroup>
                    </select>
                    <div class="info-text">Changes how accent & secondary colors are calculated</div>
                </div>
                
                <div class="control-group">
                    <div class="section-title">
                        Primary Color Foundation
                        <span class="hcs-badge">BASE HUE</span>
                    </div>
                    
                    <label>
                        Hue (0-360°)
                        <span class="value-display" id="hue-value">${this.initialValues.huePrimary}°</span>
                    </label>
                    <input type="range" id="hue-primary" min="0" max="360" value="${this.initialValues.huePrimary}">
                    <div class="info-text">Controls --hue-primary (affects all derived colors)</div>
                </div>
                
                <div class="control-group">
                    <label>
                        Saturation (0-100%)
                        <span class="value-display" id="sat-value">${this.initialValues.satPrimary}%</span>
                    </label>
                    <input type="range" id="sat-primary" min="0" max="100" value="${this.initialValues.satPrimary}">
                    <div class="info-text">Controls --saturation-primary</div>
                </div>
                
                <div class="control-group">
                    <label>
                        Lightness (0-100%)
                        <span class="value-display" id="light-value">${this.initialValues.lightPrimary}%</span>
                    </label>
                    <input type="range" id="light-primary" min="0" max="100" value="${this.initialValues.lightPrimary}">
                    <div class="info-text">Controls --lightness-primary</div>
                    
                    <div class="color-preview" id="primary-preview">
                        PRIMARY COLOR
                    </div>
                </div>
                
                <div class="harmony-info">
                    <p><strong>🎯 Color Harmony Active</strong></p>
                    <p>Accent, secondary, and neutral colors automatically calculated using color theory.</p>
                    <div class="color-swatch">
                        <div class="swatch" id="swatch-primary" title="Primary"></div>
                        <div class="swatch" id="swatch-accent" title="Accent (Complementary)"></div>
                        <div class="swatch" id="swatch-secondary" title="Secondary (Analogous)"></div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Mode select - applies data-mode attribute
        const modeSelect = this.shadowRoot.getElementById('mode-select');
        modeSelect.addEventListener('change', (e) => {
            const mode = e.target.value;
            document.body.setAttribute('data-mode', mode);
            document.documentElement.setAttribute('data-mode', mode);

            // Save to localStorage
            localStorage.setItem('wb-mode', mode);

            console.log(`✅ HCS: Applied mode: ${mode}`);

            // Dispatch event
            this.dispatchEvent(new CustomEvent('mode-change', {
                detail: { mode },
                bubbles: true,
                composed: true
            }));
        });

        // Theme select - applies data-theme attribute
        const themeSelect = this.shadowRoot.getElementById('theme-select');
        themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            document.body.setAttribute('data-theme', theme);
            document.documentElement.setAttribute('data-theme', theme);

            // Save to localStorage
            localStorage.setItem('wb-theme', theme);

            console.log(`✅ HCS: Applied theme preset: ${theme}`);

            // Dispatch event
            this.dispatchEvent(new CustomEvent('theme-change', {
                detail: { theme },
                bubbles: true,
                composed: true
            }));
        });

        // Layout select
        const layoutSelect = this.shadowRoot.getElementById('layout-select');
        layoutSelect.addEventListener('change', (e) => {
            const layout = e.target.value;
            document.body.setAttribute('data-layout', layout);
            console.log(`✅ HCS: Applied layout: ${layout}`);
        });
        
        // Harmony select
        const harmonySelect = this.shadowRoot.getElementById('harmony-select');
        if (harmonySelect) {
            // Set saved value
            harmonySelect.value = this.harmonyMode;
            
            harmonySelect.addEventListener('change', (e) => {
                this.harmonyMode = e.target.value;
                localStorage.setItem('wb-harmony-mode', this.harmonyMode);
                
                // Recalculate colors with new harmony
                updatePrimaryColor();
                
                console.log(`🌊 HCS: Harmony mode changed to: ${this.harmonyMode}`);
                
                // Get harmony info
                if (this.harmonySystem) {
                    const info = this.harmonySystem.getHarmonyInfo(this.harmonyMode);
                    console.log(`  → ${info.name}: ${info.description}`);
                    console.log(`  → Theory: ${info.theory}`);
                }
            });
        }

        // Primary color controls - directly update HCS root variables
        const hueSlider = this.shadowRoot.getElementById('hue-primary');
        const satSlider = this.shadowRoot.getElementById('sat-primary');
        const lightSlider = this.shadowRoot.getElementById('light-primary');

        const updatePrimaryColor = () => {
            const hue = parseInt(hueSlider.value);
            const sat = parseInt(satSlider.value);
            const light = parseInt(lightSlider.value);

            // Update value displays
            this.shadowRoot.getElementById('hue-value').textContent = `${hue}°`;
            this.shadowRoot.getElementById('sat-value').textContent = `${sat}%`;
            this.shadowRoot.getElementById('light-value').textContent = `${light}%`;

            // ✅ UPDATE HCS ROOT VARIABLES
            const root = document.documentElement;
            root.style.setProperty('--hue-primary', hue);
            root.style.setProperty('--saturation-primary', sat);
            root.style.setProperty('--lightness-primary', light);

            // 🎯 NEW: Calculate and set the DERIVED colors directly
            // PRIMARY
            const primaryColor = `hsl(${hue}, ${sat}%, ${light}%)`;
            root.style.setProperty('--primary', primaryColor);
            root.style.setProperty('--primary-dark', `hsl(${hue}, ${sat}%, ${light - 15}%)`);
            root.style.setProperty('--primary-light', `hsl(${hue}, ${sat - 20}%, ${light + 25}%)`);

            // Calculate harmony colors using selected mode
            let accentColor, secondaryColor;
            
            if (this.harmonySystem) {
                // Use harmony system to calculate colors
                const hues = this.harmonySystem.calculateHarmony(hue, this.harmonyMode);
                
                // Primary is always hues[0]
                // Accent is typically hues[1]
                // Secondary is typically hues[2] if available
                const accentHue = hues[1] || (hue + 180) % 360;
                const secondaryHue = hues[2] || (hue - 30 + 360) % 360;
                
                const accentSat = sat - 10;
                accentColor = `hsl(${accentHue}, ${accentSat}%, ${light}%)`;
                
                const secondarySat = sat - 20;
                const secondaryLight = light + 5;
                secondaryColor = `hsl(${secondaryHue}, ${secondarySat}%, ${secondaryLight}%)`;
                
                console.log(`🌊 Harmony colors calculated using ${this.harmonyMode}: Accent=${Math.round(accentHue)}°, Secondary=${Math.round(secondaryHue)}°`);
            } else {
                // Fallback to default complementary mode
                const accentHue = (hue + 180) % 360;
                const accentSat = sat - 10;
                accentColor = `hsl(${accentHue}, ${accentSat}%, ${light}%)`;
                
                const secondaryHue = (hue - 30 + 360) % 360;
                const secondarySat = sat - 20;
                const secondaryLight = light + 5;
                secondaryColor = `hsl(${secondaryHue}, ${secondarySat}%, ${secondaryLight}%)`;
            }
            
            // Set accent colors
            root.style.setProperty('--accent', accentColor);
            const accentHueValue = parseInt(accentColor.match(/hsl\((\d+)/)[1]);
            const accentSatValue = sat - 10;
            root.style.setProperty('--accent-light-var', `hsl(${accentHueValue}, ${accentSatValue - 15}%, ${light + 20}%)`);
            root.style.setProperty('--accent-dark', `hsl(${accentHueValue}, ${accentSatValue}%, ${light - 15}%)`);
            
            // Set secondary colors
            root.style.setProperty('--secondary', secondaryColor);
            const secondaryHueValue = parseInt(secondaryColor.match(/hsl\((\d+)/)[1]);
            const secondarySatValue = sat - 20;
            const secondaryLightValue = light + 5;
            root.style.setProperty('--secondary-light-var', `hsl(${secondaryHueValue}, ${secondarySatValue - 10}%, ${secondaryLightValue + 15}%)`);
            root.style.setProperty('--secondary-dark', `hsl(${secondaryHueValue}, ${secondarySatValue}%, ${secondaryLightValue - 10}%)`);

            // Update preview
            const primaryPreview = this.shadowRoot.getElementById('primary-preview');
            primaryPreview.style.backgroundColor = primaryColor;

            // Update harmony swatches
            this.shadowRoot.getElementById('swatch-primary').style.backgroundColor = primaryColor;
            this.shadowRoot.getElementById('swatch-accent').style.backgroundColor = accentColor;
            this.shadowRoot.getElementById('swatch-secondary').style.backgroundColor = secondaryColor;

            console.log(`🎨 HCS: Primary updated to ${primaryColor}`);
            console.log(`   → Accent auto-calculated: ${accentColor}`);
            console.log(`   → Secondary auto-calculated: ${secondaryColor}`);
        };

        hueSlider.addEventListener('input', updatePrimaryColor);
        satSlider.addEventListener('input', updatePrimaryColor);
        lightSlider.addEventListener('input', updatePrimaryColor);

        // Set initial colors
        updatePrimaryColor();
    }
}

customElements.define('wb-control-panel-hcs', WBControlPanelHCS);

console.log('✅ wb-control-panel-hcs loaded - Harmonic Color System compatible WITH MODE SUPPORT 🌓');
console.log('🎨 Manipulates: --hue-primary, --saturation-primary, --lightness-primary');
console.log('🌓 Controls: data-mode (light/dark) and data-theme (cyberpunk/ocean/etc)');
console.log('🎯 All accent, secondary, and neutral colors auto-calculate via HCS');
