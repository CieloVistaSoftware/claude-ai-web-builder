// wb-control-panel.js
// Clean Control Panel - Single Responsibility Principle Compliant
// ONLY: Render UI, Listen to Input, Dispatch Events, Save State
// Now with external CSS for Shadow DOM
import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBControlPanel extends WBBaseComponent {
    constructor() {
        console.log('[TRACE] WBControlPanel.constructor');
        super();
        // Shadow root already attached by WBBaseComponent

        this.state = {
            mode: 'dark',
            theme: 'default',
            themeCategory: 'named',
            harmonyMode: 'complementary',
            layout: 'top-nav',
            footerPosition: 'sticky',
            editMode: false,
            primaryHue: 240,
            primarySat: 70,
            primaryLight: 50,
            backgroundHue: 220,
            backgroundSat: 20,
            backgroundLight: 15
        };
    }
  static get observedAttributes() {
        return ['mode', 'theme', 'harmony-mode', 'layout', 'edit-mode'];
    }
    async connectedCallback() {
        console.log('[TRACE] WBControlPanel.connectedCallback');
        super.connectedCallback(); // Inherit dark mode and other base functionality
        await loadComponentCSS(this, 'wb-control-panel.css');
        this.loadState();
        this.render();
        this.attachEventListeners();
        this.applyState();
        // Inject wb-event-log if not present
        if (!document.querySelector('wb-event-log')) {
            const eventLog = document.createElement('wb-event-log');
            eventLog.id = 'wb-control-panel-event-log';
            eventLog.style.display = 'none'; // Hidden by default
            document.body.appendChild(eventLog);
            console.log('[WB] wb-event-log injected by WBControlPanel');
        }
    }

    loadState() {
        console.log('[TRACE] WBControlPanel.loadState');
        this.state.mode = localStorage.getItem('wb-mode') || 'dark';
        this.state.theme = localStorage.getItem('wb-theme') || 'default';
        this.state.themeCategory = localStorage.getItem('wb-theme-category') || 'named';
        this.state.harmonyMode = localStorage.getItem('wb-harmony-mode') || 'complementary';
        this.state.layout = localStorage.getItem('wb-layout') || 'top-nav';
        this.state.footerPosition = localStorage.getItem('wb-footer-position') || 'sticky';
        this.state.editMode = localStorage.getItem('wb-edit-mode') === 'true' || false;
        this.state.primaryHue = parseInt(localStorage.getItem('wb-hue-primary') || '240');
        this.state.primarySat = parseInt(localStorage.getItem('wb-sat-primary') || '70');
        this.state.primaryLight = parseInt(localStorage.getItem('wb-light-primary') || '50');
        this.state.backgroundHue = parseInt(localStorage.getItem('wb-hue-background') || '220');
        this.state.backgroundSat = parseInt(localStorage.getItem('wb-sat-background') || '20');
        this.state.backgroundLight = parseInt(localStorage.getItem('wb-light-background') || '15');
    }

    saveState() {
        console.log('[TRACE] WBControlPanel.saveState');
        localStorage.setItem('wb-mode', String(this.state.mode));
        localStorage.setItem('wb-theme', String(this.state.theme));
        localStorage.setItem('wb-theme-category', String(this.state.themeCategory));
        localStorage.setItem('wb-harmony-mode', String(this.state.harmonyMode));
        localStorage.setItem('wb-layout', String(this.state.layout));
        localStorage.setItem('wb-footer-position', String(this.state.footerPosition));
        localStorage.setItem('wb-edit-mode', String(this.state.editMode));
        localStorage.setItem('wb-hue-primary', String(this.state.primaryHue));
        localStorage.setItem('wb-sat-primary', String(this.state.primarySat));
        localStorage.setItem('wb-light-primary', String(this.state.primaryLight));
        localStorage.setItem('wb-hue-background', String(this.state.backgroundHue));
        localStorage.setItem('wb-sat-background', String(this.state.backgroundSat));
        localStorage.setItem('wb-light-background', String(this.state.backgroundLight));
    }

    getNamedThemes() {
        console.log('[TRACE] WBControlPanel.getNamedThemes');
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
        console.log('[TRACE] WBControlPanel.getHCSThemes');
        // Harmonic Color System - Wave Theory Based Palettes
        // Using color harmony theory: complementary, triadic, beatPattern, harmonicSeries, etc.
        return {
            'complementary': {
                name: 'Complementary (180°)',
                description: 'Classic opposite colors on color wheel',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },
                    secondary: { hue: 60, sat: 70, light: 50 },    // 180° opposite
                    accent: { hue: 210, sat: 75, light: 55 },      // -30°
                    success: { hue: 145, sat: 70, light: 45 },
                    warning: { hue: 40, sat: 85, light: 55 },
                    danger: { hue: 0, sat: 80, light: 50 },
                    info: { hue: 200, sat: 75, light: 50 },
                    neutral: { hue: 240, sat: 15, light: 40 }
                }
            },
            'triadic': {
                name: 'Triadic (120°)',
                description: 'Three colors equally spaced on color wheel',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },     // Blue
                    secondary: { hue: 0, sat: 70, light: 50 },      // Red (120° from blue)
                    accent: { hue: 120, sat: 70, light: 50 },       // Green (120° from red)
                    success: { hue: 145, sat: 70, light: 45 },
                    warning: { hue: 40, sat: 85, light: 55 },
                    danger: { hue: 0, sat: 80, light: 50 },
                    info: { hue: 200, sat: 75, light: 50 },
                    neutral: { hue: 240, sat: 10, light: 40 }
                }
            },
            'tetradic': {
                name: 'Tetradic (90°)',
                description: 'Four colors forming a rectangle on color wheel',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },
                    secondary: { hue: 330, sat: 70, light: 50 },    // 90° from primary
                    accent: { hue: 60, sat: 70, light: 50 },        // 180° from primary
                    success: { hue: 145, sat: 70, light: 45 },
                    warning: { hue: 40, sat: 85, light: 55 },
                    danger: { hue: 0, sat: 80, light: 50 },
                    info: { hue: 150, sat: 70, light: 50 },         // 90° from accent
                    neutral: { hue: 240, sat: 12, light: 38 }
                }
            },
            'analogous': {
                name: 'Analogous (±30°)',
                description: 'Adjacent colors creating smooth transitions',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },
                    secondary: { hue: 210, sat: 70, light: 50 },    // -30°
                    accent: { hue: 270, sat: 70, light: 50 },       // +30°
                    success: { hue: 145, sat: 70, light: 45 },
                    warning: { hue: 40, sat: 85, light: 55 },
                    danger: { hue: 0, sat: 80, light: 50 },
                    info: { hue: 200, sat: 75, light: 50 },
                    neutral: { hue: 240, sat: 15, light: 40 }
                }
            },
            'splitComplementary': {
                name: 'Split Complementary',
                description: 'Base color plus two adjacent to complement',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },
                    secondary: { hue: 30, sat: 70, light: 50 },     // Complement -30°
                    accent: { hue: 90, sat: 70, light: 50 },        // Complement +30°
                    success: { hue: 145, sat: 70, light: 45 },
                    warning: { hue: 40, sat: 85, light: 55 },
                    danger: { hue: 0, sat: 80, light: 50 },
                    info: { hue: 200, sat: 75, light: 50 },
                    neutral: { hue: 240, sat: 15, light: 40 }
                }
            },
            'beatPattern': {
                name: 'Beat Pattern (Wave)',
                description: 'Interference pattern between close frequencies',
                colors: {
                    primary: { hue: 240, sat: 75, light: 50 },
                    secondary: { hue: 248, sat: 72, light: 52 },    // +8° beat
                    accent: { hue: 232, sat: 73, light: 48 },       // -8° beat
                    success: { hue: 145, sat: 70, light: 45 },
                    warning: { hue: 40, sat: 85, light: 55 },
                    danger: { hue: 0, sat: 80, light: 50 },
                    info: { hue: 256, sat: 70, light: 54 },         // +16° harmonic
                    neutral: { hue: 240, sat: 10, light: 40 }
                }
            },
            'harmonicSeries': {
                name: 'Harmonic Series',
                description: 'Musical harmonic ratios applied to hue',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },      // Fundamental
                    secondary: { hue: 120, sat: 70, light: 50 },    // 2nd harmonic (÷2)
                    accent: { hue: 80, sat: 70, light: 50 },        // 3rd harmonic (÷3)
                    success: { hue: 145, sat: 70, light: 45 },
                    warning: { hue: 60, sat: 85, light: 55 },       // 4th harmonic (÷4)
                    danger: { hue: 0, sat: 80, light: 50 },
                    info: { hue: 48, sat: 75, light: 50 },          // 5th harmonic (÷5)
                    neutral: { hue: 240, sat: 8, light: 40 }
                }
            },
            'dopplerShift': {
                name: 'Doppler Shift',
                description: 'Frequency shift effect on colors',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },
                    secondary: { hue: 260, sat: 75, light: 55 },    // Blueshift +20°
                    accent: { hue: 220, sat: 65, light: 45 },       // Redshift -20°
                    success: { hue: 145, sat: 70, light: 45 },
                    warning: { hue: 40, sat: 85, light: 55 },
                    danger: { hue: 200, sat: 80, light: 50 },       // Redshift
                    info: { hue: 280, sat: 75, light: 50 },         // Blueshift
                    neutral: { hue: 240, sat: 10, light: 40 }
                }
            },
            'standingWave': {
                name: 'Standing Wave',
                description: 'Nodes and antinodes pattern',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },      // Antinode (peak)
                    secondary: { hue: 240, sat: 35, light: 50 },    // Node (null)
                    accent: { hue: 240, sat: 70, light: 75 },       // Antinode (bright)
                    success: { hue: 145, sat: 70, light: 45 },
                    warning: { hue: 40, sat: 85, light: 55 },
                    danger: { hue: 240, sat: 70, light: 25 },       // Antinode (dark)
                    info: { hue: 240, sat: 50, light: 50 },         // Intermediate
                    neutral: { hue: 240, sat: 15, light: 40 }
                }
            },
            'phase30': {
                name: 'Phase 30° Shift',
                description: 'Phase modulation with 30° increments',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },
                    secondary: { hue: 210, sat: 70, light: 50 },    // -30°
                    accent: { hue: 270, sat: 70, light: 50 },       // +30°
                    success: { hue: 180, sat: 70, light: 45 },      // -60°
                    warning: { hue: 300, sat: 85, light: 55 },      // +60°
                    danger: { hue: 150, sat: 80, light: 50 },       // -90°
                    info: { hue: 330, sat: 75, light: 50 },         // +90°
                    neutral: { hue: 240, sat: 10, light: 40 }
                }
            },
            'phase45': {
                name: 'Phase 45° Shift',
                description: 'Phase modulation with 45° increments',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },
                    secondary: { hue: 195, sat: 70, light: 50 },    // -45°
                    accent: { hue: 285, sat: 70, light: 50 },       // +45°
                    success: { hue: 150, sat: 70, light: 45 },      // -90°
                    warning: { hue: 330, sat: 85, light: 55 },      // +90°
                    danger: { hue: 105, sat: 80, light: 50 },       // -135°
                    info: { hue: 15, sat: 75, light: 50 },          // +135°
                    neutral: { hue: 240, sat: 10, light: 40 }
                }
            },
            'phaseModulation': {
                name: 'Phase Modulation (PM)',
                description: 'Dynamic phase shifts creating interference',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },
                    secondary: { hue: 250, sat: 70, light: 50 },    // +10° modulation
                    accent: { hue: 230, sat: 70, light: 50 },       // -10° modulation
                    success: { hue: 260, sat: 70, light: 45 },      // +20° harmonic
                    warning: { hue: 220, sat: 85, light: 55 },      // -20° harmonic
                    danger: { hue: 270, sat: 80, light: 50 },       // +30° beat
                    info: { hue: 210, sat: 75, light: 50 },         // -30° beat
                    neutral: { hue: 240, sat: 10, light: 40 }
                }
            },
            'frequencyModulation': {
                name: 'Frequency Modulation (FM)',
                description: 'Modulating frequency creates sidebands',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },      // Carrier
                    secondary: { hue: 260, sat: 70, light: 50 },    // Upper sideband
                    accent: { hue: 220, sat: 70, light: 50 },       // Lower sideband
                    success: { hue: 280, sat: 70, light: 45 },      // 2nd upper
                    warning: { hue: 200, sat: 85, light: 55 },      // 2nd lower
                    danger: { hue: 300, sat: 80, light: 50 },       // 3rd upper
                    info: { hue: 180, sat: 75, light: 50 },         // 3rd lower
                    neutral: { hue: 240, sat: 10, light: 40 }
                }
            },
            'amplitudeModulation': {
                name: 'Amplitude Modulation (AM)',
                description: 'Varying intensity creates beat pattern',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },      // Carrier
                    secondary: { hue: 240, sat: 85, light: 50 },    // Peak amplitude
                    accent: { hue: 240, sat: 55, light: 50 },       // Trough amplitude
                    success: { hue: 145, sat: 70, light: 65 },      // Bright beat
                    warning: { hue: 40, sat: 85, light: 70 },       // Bright beat
                    danger: { hue: 0, sat: 80, light: 35 },         // Dark beat
                    info: { hue: 200, sat: 75, light: 35 },         // Dark beat
                    neutral: { hue: 240, sat: 10, light: 40 }
                }
            },
            'waveSuperposition': {
                name: 'Wave Superposition',
                description: 'Multiple waves combining constructively',
                colors: {
                    primary: { hue: 240, sat: 70, light: 50 },
                    secondary: { hue: 245, sat: 72, light: 52 },    // Slight shift
                    accent: { hue: 235, sat: 68, light: 48 },       // Counter shift
                    success: { hue: 250, sat: 75, light: 55 },      // Constructive
                    warning: { hue: 230, sat: 65, light: 45 },      // Destructive
                    danger: { hue: 255, sat: 78, light: 58 },       // Peak constructive
                    info: { hue: 225, sat: 62, light: 42 },         // Peak destructive
                    neutral: { hue: 240, sat: 10, light: 40 }
                }
            }
        };
    }

    render() {
        console.log('[TRACE] WBControlPanel.render');
        // Load external CSS into Shadow DOM
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = './wb-control-panel-shadow.css';
        
        // Create HTML structure
        const template = document.createElement('template');
        template.innerHTML = `
            <div class="panel-header">
                <div class="header-content">
                    <h3>🎨 Control Panel</h3>
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
                        <option value="named">🎨 Named Color Themes</option>
                        <option value="hcs">🌊 HCS (Harmonic Color System)</option>
                    </select>
                    <p class="info-text" id="category-info">Single-color themes with auto-calculated harmonies</p>
                </div>
                
                <div class="control-group">
                    <label>Select Theme</label>
                    <select id="theme-dropdown"></select>
                </div>
                
                <div class="control-group" id="harmony-group" style="display: none;">
                    <div class="section-title">Color Harmony</div>
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
                <div class="control-group" id="slider-group">
                    <label>
                        Primary Hue 
                        <span class="hue-swatch" id="hue-swatch"></span>
                        <span class="value-display" id="hue-display">240°</span>
                    </label>
                    <input type="range" id="hue-slider" min="0" max="360" value="240">
                    <label>Saturation <span class="value-display" id="sat-display">70%</span></label>
                    <input type="range" id="sat-slider" min="0" max="100" value="70">
                    <label>Lightness <span class="value-display" id="light-display">50%</span></label>
                    <input type="range" id="light-slider" min="0" max="100" value="50">
                    <div class="color-preview" id="color-preview">PREVIEW</div>
                </div>

                <div class="section-title">Background Color</div>
                <div class="control-group" id="bg-slider-group">
                    <label>
                        Background Hue
                        <span class="hue-swatch" id="bg-hue-swatch"></span>
                        <span class="value-display" id="bg-hue-display">220°</span>
                    </label>
                    <input type="range" id="bg-hue-slider" min="0" max="360" value="220">
                    <label>Background Saturation <span class="value-display" id="bg-sat-display">20%</span></label>
                    <input type="range" id="bg-sat-slider" min="0" max="100" value="20">
                    <label>Background Lightness <span class="value-display" id="bg-light-display">15%</span></label>
                    <input type="range" id="bg-light-slider" min="0" max="100" value="15">
                    <div class="color-preview" id="bg-color-preview">PREVIEW</div>
                </div>

                <div class="section-title">Layout & Footer</div>
                
                <div class="control-group">
                    <label>Page Layout</label>
                    <select id="layout-select">
                        <option value="top-nav">Top Navigation</option>
                        <option value="left-nav">Left Sidebar</option>
                        <option value="right-nav">Right Sidebar</option>
                        <option value="ad-layout">Ad Layout</option>
                    </select>
                </div>
                
                <div class="control-group">
                    <label>Footer Position</label>
                    <select id="footer-position-select">
                        <option value="sticky">Sticky (Fixed to Viewport Bottom)</option>
                        <option value="normal">Normal (Scrolls with Page)</option>
                    </select>
                    <p class="info-text">Sticky keeps footer visible at all times</p>
                </div>
                
                <div class="section-title">✏️ Edit Mode</div>
                
                <div class="control-group">
                    <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <span>Enable Image Editing</span>
                        <input type="checkbox" id="edit-mode-toggle" style="width: auto; height: auto; cursor: pointer;">
                    </label>
                    <p class="info-text">Double-click semantic elements to add/edit images</p>
                </div>
            </div>
        `;
        
        // Append CSS and HTML to shadow root
        this.shadowRoot.appendChild(cssLink);
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    attachEventListeners() {
        console.log('[TRACE] WBControlPanel.attachEventListeners');
        // Helper function for getting shadow DOM elements
        const $ = (id) => this.shadowRoot.getElementById(id);
        
        // PRIMARY COLOR SLIDERS
        $('hue-slider').addEventListener('input', (e) => {
            const target = /** @type {HTMLInputElement} */ (e.target);
            this.state.primaryHue = parseInt(target.value);
            $('hue-display').textContent = `${target.value}°`;
            this.updateHueSwatch();
            this.updatePreview();
            this.dispatchColorChange();
            this.saveState();
        });
        
        $('sat-slider').addEventListener('input', (e) => {
            const target = /** @type {HTMLInputElement} */ (e.target);
            this.state.primarySat = parseInt(target.value);
            $('sat-display').textContent = `${target.value}%`;
            this.updatePreview();
            this.dispatchColorChange();
            this.saveState();
        });
        
        $('light-slider').addEventListener('input', (e) => {
            const target = /** @type {HTMLInputElement} */ (e.target);
            this.state.primaryLight = parseInt(target.value);
            $('light-display').textContent = `${target.value}%`;
            this.updatePreview();
            this.dispatchColorChange();
            this.saveState();
        });
        
        // Background color sliders
        $('bg-hue-slider').addEventListener('input', (e) => {
            const target = /** @type {HTMLInputElement} */ (e.target);
            this.state.backgroundHue = parseInt(target.value);
            $('bg-hue-display').textContent = `${target.value}°`;
            this.updateBgHueSwatch();
            this.updateBgPreview();
            this.dispatchBackgroundColorChange();
            this.saveState();
        });
        $('bg-sat-slider').addEventListener('input', (e) => {
            const target = /** @type {HTMLInputElement} */ (e.target);
            this.state.backgroundSat = parseInt(target.value);
            $('bg-sat-display').textContent = `${target.value}%`;
            this.updateBgPreview();
            this.dispatchBackgroundColorChange();
            this.saveState();
        });
        $('bg-light-slider').addEventListener('input', (e) => {
            const target = /** @type {HTMLInputElement} */ (e.target);
            this.state.backgroundLight = parseInt(target.value);
            $('bg-light-display').textContent = `${target.value}%`;
            this.updateBgPreview();
            this.dispatchBackgroundColorChange();
            this.saveState();
        });
        $('mode-toggle').addEventListener('click', () => {
            this.state.mode = this.state.mode === 'dark' ? 'light' : 'dark';
            this.updateModeUI();
            this.setAttribute('data-mode', this.state.mode);
            document.documentElement.setAttribute('data-mode', this.state.mode);
            document.body.setAttribute('data-mode', this.state.mode);
            this.dispatch('mode-changed', { mode: this.state.mode });
            this.saveState();
            this.logInfo(`🌓 Mode switched to: ${this.state.mode}`);
        });
        $('theme-category-dropdown').addEventListener('change', (e) => {
            const target = /** @type {HTMLSelectElement} */ (e.target);
            this.state.themeCategory = target.value;
            this.updateCategoryInfo();
            this.updateThemeDropdown();
            this.toggleSliderVisibility();
            this.saveState();
        });
        $('theme-dropdown').addEventListener('change', (e) => {
            const target = /** @type {HTMLSelectElement} */ (e.target);
            this.state.theme = target.value;
            this.saveState();
        });
        $('harmony-select').addEventListener('change', (e) => {
            const target = /** @type {HTMLSelectElement} */ (e.target);
            this.state.harmonyMode = target.value;
            this.saveState();
        });
        $('layout-select').addEventListener('change', (e) => {
            const target = /** @type {HTMLSelectElement} */ (e.target);
            this.state.layout = target.value;
            this.dispatch('layout-changed', { layout: this.state.layout });
            this.saveState();
            this.logInfo(`🎯 Layout changed to: ${this.state.layout}`);
        });
        $('footer-position-select').addEventListener('change', (e) => {
            const target = /** @type {HTMLSelectElement} */ (e.target);
            this.state.footerPosition = target.value;
            this.dispatch('footer-position-changed', { position: this.state.footerPosition });
            this.saveState();
            this.logInfo(`👣 Footer position changed to: ${this.state.footerPosition}`);
        });
        $('edit-mode-toggle').addEventListener('change', (e) => {
            const target = /** @type {HTMLInputElement} */ (e.target);
            this.state.editMode = target.checked;
            if (this.state.editMode) {
                document.dispatchEvent(new CustomEvent('editModeEnabled'));
                this.logInfo('✏️ Edit Mode ENABLED - wb-image-insert activated');
            } else {
                document.dispatchEvent(new CustomEvent('editModeDisabled'));
                this.logInfo('👁️ Edit Mode DISABLED - wb-image-insert deactivated');
            }
            this.saveState();
        });
    }

    updateModeUI() {
        console.log('[TRACE] WBControlPanel.updateModeUI');
        const $ = (id) => this.shadowRoot.getElementById(id);
        $('mode-icon').textContent = this.state.mode === 'dark' ? '🌙' : '☀️';
        $('mode-label').textContent = this.state.mode.toUpperCase();
    }

    updateCategoryInfo() {
        console.log('[TRACE] WBControlPanel.updateCategoryInfo');
        const info = this.shadowRoot.getElementById('category-info');
        info.textContent = this.state.themeCategory === 'named' 
            ? 'Single-color themes with auto-calculated harmonies'
            : 'Complete color palettes with predefined element colors';
    }

    toggleSliderVisibility() {
        console.log('[TRACE] WBControlPanel.toggleSliderVisibility');
        const sliderGroup = this.shadowRoot.getElementById('slider-group');
        // Show sliders for Named category only (HCS themes are pre-defined)
        sliderGroup.style.display = this.state.themeCategory === 'named' ? 'block' : 'none';
    }

    updateThemeDropdown() {
        console.log('[TRACE] WBControlPanel.updateThemeDropdown');
        const dropdown = /** @type {HTMLSelectElement} */ (this.shadowRoot.getElementById('theme-dropdown'));
        dropdown.innerHTML = '';
        const themes = this.state.themeCategory === 'named' ? this.getNamedThemes() : this.getHCSThemes();
        Object.entries(themes).forEach(([id, data]) => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = data.name;
            dropdown.appendChild(opt);
        });
        // Set first theme as default
        this.state.theme = Object.keys(themes)[0];
        dropdown.value = this.state.theme;
        // Apply the theme colors
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
    }

    updateSliders() {
        console.log('[TRACE] WBControlPanel.updateSliders');
        const $ = (id) => this.shadowRoot.getElementById(id);
        /** @type {HTMLInputElement} */ ($('hue-slider')).value = String(this.state.primaryHue);
        /** @type {HTMLInputElement} */ ($('sat-slider')).value = String(this.state.primarySat);
        /** @type {HTMLInputElement} */ ($('light-slider')).value = String(this.state.primaryLight);
        /** @type {HTMLElement} */ ($('hue-display')).textContent = `${this.state.primaryHue}°`;
        /** @type {HTMLElement} */ ($('sat-display')).textContent = `${this.state.primarySat}%`;
        /** @type {HTMLElement} */ ($('light-display')).textContent = `${this.state.primaryLight}%`;
        // Background sliders
        /** @type {HTMLInputElement} */ ($('bg-hue-slider')).value = String(this.state.backgroundHue);
        /** @type {HTMLInputElement} */ ($('bg-sat-slider')).value = String(this.state.backgroundSat);
        /** @type {HTMLInputElement} */ ($('bg-light-slider')).value = String(this.state.backgroundLight);
        /** @type {HTMLElement} */ ($('bg-hue-display')).textContent = `${this.state.backgroundHue}°`;
        /** @type {HTMLElement} */ ($('bg-sat-display')).textContent = `${this.state.backgroundSat}%`;
        /** @type {HTMLElement} */ ($('bg-light-display')).textContent = `${this.state.backgroundLight}%`;
        this.updateBgHueSwatch();
        this.updateBgPreview();
    }

    updateHueSwatch() {
        console.log('[TRACE] WBControlPanel.updateHueSwatch');
        const hueSwatch = this.shadowRoot.getElementById('hue-swatch');
        if (hueSwatch) {
            // Show pure hue at 100% saturation and 50% lightness
            hueSwatch.style.backgroundColor = `hsl(${this.state.primaryHue}, 100%, 50%)`;
        }
    }

    updateBgHueSwatch() {
        console.log('[TRACE] WBControlPanel.updateBgHueSwatch');
        const bgHueSwatch = this.shadowRoot.getElementById('bg-hue-swatch');
        if (bgHueSwatch) {
            bgHueSwatch.style.backgroundColor = `hsl(${this.state.backgroundHue}, 100%, 50%)`;
        }
    }

    updatePreview() {
        console.log('[TRACE] WBControlPanel.updatePreview');
        const { primaryHue, primarySat, primaryLight } = this.state;
        this.shadowRoot.getElementById('color-preview').style.backgroundColor = 
            `hsl(${primaryHue}, ${primarySat}%, ${primaryLight}%)`;
    }

    updateBgPreview() {
        console.log('[TRACE] WBControlPanel.updateBgPreview');
        const { backgroundHue, backgroundSat, backgroundLight } = this.state;
        this.shadowRoot.getElementById('bg-color-preview').style.backgroundColor =
            `hsl(${backgroundHue}, ${backgroundSat}%, ${backgroundLight}%)`;
    }

    dispatch(name, detail) {
        console.log('[TRACE] WBControlPanel.dispatch', name, detail);
        this.fireEvent(name, detail);
        this.logInfo(`📢 wb:${name}`, detail);
    }

    dispatchThemeChange() {
        console.log('[TRACE] WBControlPanel.dispatchThemeChange');
        const themes = this.state.themeCategory === 'named' ? this.getNamedThemes() : this.getHCSThemes();
        this.dispatch('theme-changed', {
            theme: this.state.theme,
            category: this.state.themeCategory,
            data: themes[this.state.theme]
        });
    }

    dispatchColorChange() {
        console.log('[TRACE] WBControlPanel.dispatchColorChange');
        this.dispatch('color-changed', {
            hue: this.state.primaryHue,
            saturation: this.state.primarySat,
            lightness: this.state.primaryLight,
            harmonyMode: this.state.harmonyMode
        });
    }

    dispatchBackgroundColorChange() {
        console.log('[TRACE] WBControlPanel.dispatchBackgroundColorChange');
        this.dispatch('background-color-changed', {
            hue: this.state.backgroundHue,
            saturation: this.state.backgroundSat,
            lightness: this.state.backgroundLight
        });
    }

    applyState() {
        console.log('[TRACE] WBControlPanel.applyState');
        const $ = (id) => this.shadowRoot.getElementById(id);
        this.setAttribute('data-mode', this.state.mode);
        document.documentElement.setAttribute('data-mode', this.state.mode);
        document.body.setAttribute('data-mode', this.state.mode);
        this.updateModeUI();
        /** @type {HTMLSelectElement} */ ($('theme-category-dropdown')).value = this.state.themeCategory;
        this.updateCategoryInfo();
        this.toggleSliderVisibility();
        this.updateThemeDropdown();
        /** @type {HTMLSelectElement} */ ($('harmony-select')).value = this.state.harmonyMode;
        /** @type {HTMLSelectElement} */ ($('layout-select')).value = this.state.layout;
        /** @type {HTMLSelectElement} */ ($('footer-position-select')).value = this.state.footerPosition;
        /** @type {HTMLInputElement} */ ($('edit-mode-toggle')).checked = this.state.editMode;
        this.updateSliders();
        this.updateBgHueSwatch();
        this.updateBgPreview();
        if (this.state.editMode) {
            document.dispatchEvent(new CustomEvent('editModeEnabled'));
            this.logInfo('✏️ Edit Mode restored: ENABLED');
        }
        this.dispatch('mode-changed', { mode: this.state.mode });
        this.dispatchThemeChange();
        this.dispatch('harmony-changed', { mode: this.state.harmonyMode });
        this.dispatch('layout-changed', { layout: this.state.layout });
        this.dispatch('footer-position-changed', { position: this.state.footerPosition });
        this.dispatchColorChange();
        this.dispatchBackgroundColorChange();
    }
}

customElements.define('wb-control-panel', WBControlPanel);

// REPORT WHERE THIS FILE IS BEING LOADED FROM
const scriptElements = document.querySelectorAll('script[src*="wb-control-panel"]');
if (scriptElements.length > 0) {
    console.log('✅ WB Control Panel - Fixed Version');
    console.log('📍 LOADED FROM:', /** @type {HTMLScriptElement} */ (scriptElements[0]).src);
} else {
    console.log('✅ WB Control Panel - Fixed Version');
    console.log('📍 LOADED FROM: inline or module import');
}

// Compositional Namespace
if (!window['WB']) window['WB'] = { components: {}, utils: {} };
window['WB'].components.WBControlPanel = WBControlPanel;

// Backward compatibility
window['WBControlPanel'] = WBControlPanel;

// ES6 Module Export
export { WBControlPanel };
export default WBControlPanel;

console.log('✅ WB Control Panel - Fixed Version');
console.log('📢 Dispatches: wb:mode-changed, wb:theme-changed, wb:harmony-changed, wb:layout-changed, wb:color-changed');
console.log('🎨 Named themes: Ruby, Emerald, Purple + 11 more');
console.log('🌊 HCS themes: 4 complete palettes');
console.log('🔀 Harmony mode hidden for HCS (only for Named)');

const mainPanel = document.getElementById('control-panel');
console.log('Main control panel:', mainPanel);
