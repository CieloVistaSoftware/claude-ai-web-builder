/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WB COLOR HARMONY COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * A comprehensive, production-ready color harmony picker implementing classical
 * color theory principles within the WB component architecture.
 * 
 * @version 3.0.0
 * @author WB Component Library
 * @license MIT
 * @location components/wb-color-harmony/wb-color-harmony.js
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * TABLE OF CONTENTS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 1. OVERVIEW & PURPOSE
 * 2. COLOR THEORY FUNDAMENTALS
 * 3. HSL COLOR MODEL
 * 4. HARMONY ALGORITHMS
 * 5. ARCHITECTURE & SHADOW DOM
 * 6. PUBLIC API REFERENCE
 * 7. EVENTS REFERENCE
 * 8. USAGE EXAMPLES
 * 9. ACCESSIBILITY CONSIDERATIONS
 * 10. PERFORMANCE NOTES
 * 11. BROWSER COMPATIBILITY
 * 12. RELATED COMPONENTS
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 1. OVERVIEW & PURPOSE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This component serves as the cornerstone of the WB color system, providing:
 * 
 * - Interactive HSL-based color selection with real-time preview
 * - Six classical color harmony algorithms from color theory
 * - Clickable harmony swatches for quick color selection
 * - Dynamic gradient backgrounds that update based on current color
 * - Full event system for integration with other components
 * - Accessible keyboard navigation and screen reader support
 * 
 * The component was designed to be the "single source of truth" for color
 * selection across the entire WB ecosystem, enabling consistent theming
 * and color coordination throughout applications.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 2. COLOR THEORY FUNDAMENTALS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Color harmony refers to the property that certain aesthetic color combinations
 * have when viewed together. These combinations create pleasing contrasts and
 * visual balance. The theory dates back to Isaac Newton's color wheel (1666)
 * and was formalized by artists and scientists over centuries.
 * 
 * THE COLOR WHEEL
 * ───────────────
 * The color wheel arranges hues in a circle based on their chromatic relationship.
 * Primary colors (Red, Yellow, Blue in traditional theory; Red, Green, Blue in
 * additive light) are equidistant. Secondary and tertiary colors fill the gaps.
 * 
 *                           0° RED
 *                              │
 *                    330°      │      30°
 *                  MAGENTA     │     ORANGE
 *                        ╲     │     ╱
 *                         ╲    │    ╱
 *                          ╲   │   ╱
 *               300°        ╲  │  ╱        60°
 *              PURPLE ───────  ●  ─────── YELLOW
 *                          ╱   │   ╲
 *                         ╱    │    ╲
 *                        ╱     │     ╲
 *                    270°      │      90°
 *                    BLUE      │     CHARTREUSE
 *                              │
 *                   240°       │       120°
 *                              │
 *                        210°  │  150°
 *                         CYAN │ SPRING GREEN
 *                              │
 *                           180° CYAN
 * 
 * HARMONY RELATIONSHIPS
 * ─────────────────────
 * Harmonies are mathematical relationships between positions on the color wheel:
 * 
 * • COMPLEMENTARY: Colors opposite each other (180° apart)
 *   - Maximum contrast, vibrant when used together
 *   - Example: Blue (#0000FF) and Orange (#FFA500)
 * 
 * • TRIADIC: Three colors equally spaced (120° apart)
 *   - Balanced, vibrant, maintains contrast while being harmonious
 *   - Example: Red, Yellow, Blue
 * 
 * • ANALOGOUS: Colors adjacent on the wheel (typically 30° apart)
 *   - Serene, comfortable, low contrast
 *   - Example: Blue, Blue-Green, Green
 * 
 * • SPLIT-COMPLEMENTARY: Base + two colors adjacent to complement (150°, 210°)
 *   - High contrast but less tension than complementary
 *   - Example: Blue, Yellow-Orange, Red-Orange
 * 
 * • TETRADIC (SQUARE): Four colors equally spaced (90° apart)
 *   - Rich color palette, works best with one dominant color
 *   - Example: Red, Yellow-Green, Cyan, Blue-Purple
 * 
 * • MONOCHROMATIC: Single hue with varying saturation/lightness
 *   - Cohesive, sophisticated, easy to manage
 *   - Example: Dark Blue, Medium Blue, Light Blue
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 3. HSL COLOR MODEL
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This component uses HSL (Hue, Saturation, Lightness) rather than RGB because:
 * 
 * 1. HSL maps directly to how humans perceive color
 * 2. Harmony calculations are simple angular math on the hue wheel
 * 3. Saturation and lightness provide intuitive adjustments
 * 4. CSS native support: hsl() function
 * 
 * HUE (0-360°)
 * ────────────
 * The color's position on the color wheel:
 * - 0°/360° = Red
 * - 60° = Yellow
 * - 120° = Green
 * - 180° = Cyan
 * - 240° = Blue
 * - 300° = Magenta
 * 
 * SATURATION (0-100%)
 * ───────────────────
 * The intensity or purity of the color:
 * - 0% = Grayscale (no color)
 * - 50% = Muted/pastel
 * - 100% = Full, vivid color
 * 
 * LIGHTNESS (0-100%)
 * ──────────────────
 * The amount of white or black mixed in:
 * - 0% = Pure black
 * - 50% = Pure color (most saturated appearance)
 * - 100% = Pure white
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 4. HARMONY ALGORITHMS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Each harmony mode calculates related colors using angular offsets:
 * 
 * COMPLEMENTARY: complement = (baseHue + 180) % 360
 * TRIADIC: +120°, +240°
 * ANALOGOUS: -30°, +30°
 * SPLIT-COMPLEMENTARY: +150°, +210°
 * TETRADIC: +90°, +180°, +270°
 * MONOCHROMATIC: Same hue, varying lightness
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 5. ARCHITECTURE & SHADOW DOM
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This component follows the WB architecture standards:
 * - Extends WBBaseComponent with static useShadow = true
 * - Loads external CSS via wb-css-loader (no inline styles)
 * - Follows WB lifecycle patterns
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

/**
 * WBColorHarmony - Interactive color harmony picker component
 * 
 * @extends WBBaseComponent
 * @fires colorchange - When any color value changes
 * @fires harmonychange - When harmony mode changes
 * @fires swatchselect - When a harmony swatch is clicked
 * @fires colorcopied - When color is copied to clipboard
 */
class WBColorHarmony extends WBBaseComponent {
    /**
     * Enable Shadow DOM encapsulation
     * @type {boolean}
     */
    static useShadow = true;
    
    /**
     * Supported harmony mode values
     * @type {string[]}
     */
    static HARMONY_MODES = [
        'complementary',
        'triadic', 
        'analogous',
        'split',
        'tetradic',
        'monochromatic'
    ];
    
    /**
     * Default color values
     * @type {Object}
     */
    static DEFAULTS = {
        hue: 180,
        saturation: 70,
        lightness: 50,
        harmonyMode: 'complementary'
    };
    
    /**
     * Create a new WBColorHarmony instance
     */
    constructor() {
        super();
        
        // Initialize HSL values with defaults
        this._hue = WBColorHarmony.DEFAULTS.hue;
        this._saturation = WBColorHarmony.DEFAULTS.saturation;
        this._lightness = WBColorHarmony.DEFAULTS.lightness;
        
        // Current harmony mode
        this._harmonyMode = WBColorHarmony.DEFAULTS.harmonyMode;
        
        // Initialization flag
        this._initialized = false;
        
        // Bind event handlers to maintain 'this' context
        this._handleHueChange = this._handleHueChange.bind(this);
        this._handleSaturationChange = this._handleSaturationChange.bind(this);
        this._handleLightnessChange = this._handleLightnessChange.bind(this);
        this._handleSwatchClick = this._handleSwatchClick.bind(this);
        this._handleModeClick = this._handleModeClick.bind(this);
    }
    
    /**
     * Observed attributes for attributeChangedCallback
     * @returns {string[]} List of observed attribute names
     */
    static get observedAttributes() {
        return ['hue', 'saturation', 'lightness', 'harmony-mode'];
    }
    
    /**
     * Handle attribute changes
     * @param {string} name - Attribute name
     * @param {string} oldValue - Previous value
     * @param {string} newValue - New value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch (name) {
            case 'hue':
                this._hue = this._clamp(parseInt(newValue) || WBColorHarmony.DEFAULTS.hue, 0, 360);
                break;
            case 'saturation':
                this._saturation = this._clamp(parseInt(newValue) || WBColorHarmony.DEFAULTS.saturation, 0, 100);
                break;
            case 'lightness':
                this._lightness = this._clamp(parseInt(newValue) || WBColorHarmony.DEFAULTS.lightness, 0, 100);
                break;
            case 'harmony-mode':
                if (WBColorHarmony.HARMONY_MODES.includes(newValue)) {
                    this._harmonyMode = newValue;
                }
                break;
        }
        
        if (this._initialized) {
            this._updateDisplay();
        }
    }
    
    /**
     * Component connected to DOM
     * @async
     */
    async connectedCallback() {
        // Load external CSS (no inline styles per WB standards)
        const cssPath = new URL('./wb-color-harmony.css', import.meta.url).href;
        await loadComponentCSS(this.shadowRoot, cssPath);
        
        // Parse initial attribute values
        this._hue = this._clamp(parseInt(this.getAttribute('hue')) || WBColorHarmony.DEFAULTS.hue, 0, 360);
        this._saturation = this._clamp(parseInt(this.getAttribute('saturation')) || WBColorHarmony.DEFAULTS.saturation, 0, 100);
        this._lightness = this._clamp(parseInt(this.getAttribute('lightness')) || WBColorHarmony.DEFAULTS.lightness, 0, 100);
        this._harmonyMode = this.getAttribute('harmony-mode') || WBColorHarmony.DEFAULTS.harmonyMode;
        
        // Validate harmony mode
        if (!WBColorHarmony.HARMONY_MODES.includes(this._harmonyMode)) {
            this._harmonyMode = WBColorHarmony.DEFAULTS.harmonyMode;
        }
        
        // Render component structure
        this._render();
        
        // Attach event listeners
        this._setupEventListeners();
        
        // Initial display update
        this._updateDisplay();
        
        // Mark as initialized
        this._initialized = true;
    }
    
    /**
     * Component disconnected from DOM - cleanup
     */
    disconnectedCallback() {
        this._removeEventListeners();
    }
    
    /**
     * Render component HTML structure
     * @private
     */
    _render() {
        this.shadowRoot.innerHTML += `
            <div class="color-harmony-container" role="application" aria-label="Color Harmony Picker">
                
                <!-- MAIN COLOR PREVIEW -->
                <section class="main-color-section" aria-label="Selected Color">
                    <div class="main-color-preview" id="mainPreview" role="img" aria-label="Color preview">
                        <span class="color-hex" id="hexValue">#00B3B3</span>
                    </div>
                    <div class="color-info">
                        <span class="color-label">Selected Color</span>
                        <span class="hsl-value" id="hslValue">hsl(180, 70%, 50%)</span>
                        <span class="rgb-value" id="rgbValue">rgb(38, 191, 191)</span>
                    </div>
                </section>
                
                <!-- HSL SLIDERS -->
                <section class="sliders-section" aria-label="Color Adjustments">
                    
                    <!-- Hue Slider (0-360°) -->
                    <div class="slider-group">
                        <label for="hueSlider">
                            <span class="slider-label">Hue</span>
                            <span class="slider-value" id="hueValue">180°</span>
                        </label>
                        <div class="slider-track hue-track">
                            <input type="range" 
                                   id="hueSlider" 
                                   class="slider hue-slider" 
                                   min="0" 
                                   max="360" 
                                   value="180"
                                   aria-label="Hue"
                                   aria-valuemin="0"
                                   aria-valuemax="360"
                                   aria-valuenow="180">
                        </div>
                    </div>
                    
                    <!-- Saturation Slider (0-100%) -->
                    <div class="slider-group">
                        <label for="satSlider">
                            <span class="slider-label">Saturation</span>
                            <span class="slider-value" id="satValue">70%</span>
                        </label>
                        <div class="slider-track saturation-track" id="satTrack">
                            <input type="range" 
                                   id="satSlider" 
                                   class="slider saturation-slider" 
                                   min="0" 
                                   max="100" 
                                   value="70"
                                   aria-label="Saturation"
                                   aria-valuemin="0"
                                   aria-valuemax="100"
                                   aria-valuenow="70">
                        </div>
                    </div>
                    
                    <!-- Lightness Slider (0-100%) -->
                    <div class="slider-group">
                        <label for="lightSlider">
                            <span class="slider-label">Lightness</span>
                            <span class="slider-value" id="lightValue">50%</span>
                        </label>
                        <div class="slider-track lightness-track" id="lightTrack">
                            <input type="range" 
                                   id="lightSlider" 
                                   class="slider lightness-slider" 
                                   min="0" 
                                   max="100" 
                                   value="50"
                                   aria-label="Lightness"
                                   aria-valuemin="0"
                                   aria-valuemax="100"
                                   aria-valuenow="50">
                        </div>
                    </div>
                </section>
                
                <!-- HARMONY MODE SELECTOR -->
                <section class="harmony-mode-section" aria-label="Harmony Mode Selection">
                    <label class="mode-label" id="modeLabel">Color Harmony Mode</label>
                    <div class="mode-buttons" role="radiogroup" aria-labelledby="modeLabel" id="modeButtons">
                        <button class="mode-btn active" 
                                data-mode="complementary" 
                                role="radio" 
                                aria-checked="true"
                                title="Two colors opposite on the wheel (180° apart)">
                            Complementary
                        </button>
                        <button class="mode-btn" 
                                data-mode="triadic" 
                                role="radio" 
                                aria-checked="false"
                                title="Three colors equally spaced (120° apart)">
                            Triadic
                        </button>
                        <button class="mode-btn" 
                                data-mode="analogous" 
                                role="radio" 
                                aria-checked="false"
                                title="Adjacent colors on the wheel (30° apart)">
                            Analogous
                        </button>
                        <button class="mode-btn" 
                                data-mode="split" 
                                role="radio" 
                                aria-checked="false"
                                title="Base plus two colors adjacent to complement">
                            Split-Comp
                        </button>
                        <button class="mode-btn" 
                                data-mode="tetradic" 
                                role="radio" 
                                aria-checked="false"
                                title="Four colors equally spaced (90° apart)">
                            Tetradic
                        </button>
                        <button class="mode-btn" 
                                data-mode="monochromatic" 
                                role="radio" 
                                aria-checked="false"
                                title="Single hue with varying lightness">
                            Monochromatic
                        </button>
                    </div>
                </section>
                
                <!-- HARMONY SWATCHES -->
                <section class="harmony-section" aria-label="Harmony Colors">
                    <label class="section-label">Harmony Palette <span class="mode-indicator" id="modeIndicator">(Complementary)</span></label>
                    <div class="harmony-swatches" id="harmonySwatches" role="listbox" aria-label="Click to select a harmony color">
                        <!-- Dynamically generated swatches -->
                    </div>
                </section>
                
                <!-- ACTION BUTTONS -->
                <section class="actions-section" aria-label="Actions">
                    <button class="action-btn" id="copyBtn" aria-label="Copy hex color to clipboard">
                        📋 Copy Hex
                    </button>
                    <button class="action-btn" id="randomBtn" aria-label="Generate random color">
                        🎲 Random
                    </button>
                    <button class="action-btn" id="resetBtn" aria-label="Reset to default color">
                        ↻ Reset
                    </button>
                </section>
                
            </div>
        `;
    }
    
    /**
     * Setup all event listeners
     * @private
     */
    _setupEventListeners() {
        // Slider inputs
        const hueSlider = this.shadowRoot.getElementById('hueSlider');
        const satSlider = this.shadowRoot.getElementById('satSlider');
        const lightSlider = this.shadowRoot.getElementById('lightSlider');
        
        hueSlider?.addEventListener('input', this._handleHueChange);
        satSlider?.addEventListener('input', this._handleSaturationChange);
        lightSlider?.addEventListener('input', this._handleLightnessChange);
        
        // Mode buttons - attach listener to EACH button individually
        const modeButtons = this.shadowRoot.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', this._handleModeClick);
        });
        
        // Harmony swatches - event delegation on container
        const swatchContainer = this.shadowRoot.getElementById('harmonySwatches');
        swatchContainer?.addEventListener('click', this._handleSwatchClick);
        
        // Action buttons
        const copyBtn = this.shadowRoot.getElementById('copyBtn');
        const randomBtn = this.shadowRoot.getElementById('randomBtn');
        const resetBtn = this.shadowRoot.getElementById('resetBtn');
        
        copyBtn?.addEventListener('click', () => this.copyColor());
        randomBtn?.addEventListener('click', () => this.randomColor());
        resetBtn?.addEventListener('click', () => this.resetColor());
    }
    
    /**
     * Remove all event listeners
     * @private
     */
    _removeEventListeners() {
        const hueSlider = this.shadowRoot.getElementById('hueSlider');
        const satSlider = this.shadowRoot.getElementById('satSlider');
        const lightSlider = this.shadowRoot.getElementById('lightSlider');
        
        hueSlider?.removeEventListener('input', this._handleHueChange);
        satSlider?.removeEventListener('input', this._handleSaturationChange);
        lightSlider?.removeEventListener('input', this._handleLightnessChange);
        
        const modeButtons = this.shadowRoot.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.removeEventListener('click', this._handleModeClick);
        });
        
        const swatchContainer = this.shadowRoot.getElementById('harmonySwatches');
        swatchContainer?.removeEventListener('click', this._handleSwatchClick);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Handle hue slider change
     * @param {Event} e - Input event
     * @private
     */
    _handleHueChange(e) {
        this._hue = parseInt(e.target.value);
        e.target.setAttribute('aria-valuenow', this._hue);
        this._updateDisplay();
        this._fireColorChangeEvent();
    }
    
    /**
     * Handle saturation slider change
     * @param {Event} e - Input event
     * @private
     */
    _handleSaturationChange(e) {
        this._saturation = parseInt(e.target.value);
        e.target.setAttribute('aria-valuenow', this._saturation);
        this._updateDisplay();
        this._fireColorChangeEvent();
    }
    
    /**
     * Handle lightness slider change
     * @param {Event} e - Input event
     * @private
     */
    _handleLightnessChange(e) {
        this._lightness = parseInt(e.target.value);
        e.target.setAttribute('aria-valuenow', this._lightness);
        this._updateDisplay();
        this._fireColorChangeEvent();
    }
    
    /**
     * Handle harmony mode button click
     * @param {Event} e - Click event
     * @private
     */
    _handleModeClick(e) {
        const btn = e.target.closest('.mode-btn');
        if (!btn) return;
        
        const mode = btn.dataset.mode;
        if (!mode || !WBColorHarmony.HARMONY_MODES.includes(mode)) return;
        
        // Update internal state
        this._harmonyMode = mode;
        
        // Update button states
        const allButtons = this.shadowRoot.querySelectorAll('.mode-btn');
        allButtons.forEach(b => {
            const isActive = b.dataset.mode === mode;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-checked', isActive ? 'true' : 'false');
        });
        
        // Update mode indicator text
        const modeIndicator = this.shadowRoot.getElementById('modeIndicator');
        if (modeIndicator) {
            const modeNames = {
                'complementary': 'Complementary',
                'triadic': 'Triadic',
                'analogous': 'Analogous',
                'split': 'Split-Complementary',
                'tetradic': 'Tetradic',
                'monochromatic': 'Monochromatic'
            };
            modeIndicator.textContent = `(${modeNames[mode] || mode})`;
        }
        
        // Update swatches
        this._updateHarmonySwatches();
        
        // Fire event
        this._fireHarmonyChangeEvent();
    }
    
    /**
     * Handle harmony swatch click
     * @param {Event} e - Click event
     * @private
     */
    _handleSwatchClick(e) {
        const swatch = e.target.closest('.harmony-swatch');
        if (!swatch) return;
        
        const hue = parseInt(swatch.dataset.hue);
        const sat = parseInt(swatch.dataset.saturation);
        const light = parseInt(swatch.dataset.lightness);
        
        if (isNaN(hue)) return;
        
        // Update values
        this._hue = hue;
        this._saturation = sat;
        this._lightness = light;
        
        // Update sliders to match
        const hueSlider = this.shadowRoot.getElementById('hueSlider');
        const satSlider = this.shadowRoot.getElementById('satSlider');
        const lightSlider = this.shadowRoot.getElementById('lightSlider');
        
        if (hueSlider) {
            hueSlider.value = this._hue;
            hueSlider.setAttribute('aria-valuenow', this._hue);
        }
        if (satSlider) {
            satSlider.value = this._saturation;
            satSlider.setAttribute('aria-valuenow', this._saturation);
        }
        if (lightSlider) {
            lightSlider.value = this._lightness;
            lightSlider.setAttribute('aria-valuenow', this._lightness);
        }
        
        // Update display
        this._updateDisplay();
        
        // Fire events
        this._fireColorChangeEvent();
        this._fireSwatchSelectEvent(swatch);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // DISPLAY UPDATES
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Update all display elements
     * @private
     */
    _updateDisplay() {
        this._updateValueDisplays();
        this._updateColorPreview();
        this._updateSliderGradients();
        this._updateHarmonySwatches();
    }
    
    /**
     * Update slider value displays
     * @private
     */
    _updateValueDisplays() {
        const hueValue = this.shadowRoot.getElementById('hueValue');
        const satValue = this.shadowRoot.getElementById('satValue');
        const lightValue = this.shadowRoot.getElementById('lightValue');
        
        if (hueValue) hueValue.textContent = `${this._hue}°`;
        if (satValue) satValue.textContent = `${this._saturation}%`;
        if (lightValue) lightValue.textContent = `${this._lightness}%`;
    }
    
    /**
     * Update main color preview
     * @private
     */
    _updateColorPreview() {
        const mainPreview = this.shadowRoot.getElementById('mainPreview');
        const hexValue = this.shadowRoot.getElementById('hexValue');
        const hslValue = this.shadowRoot.getElementById('hslValue');
        const rgbValue = this.shadowRoot.getElementById('rgbValue');
        
        const hsl = `hsl(${this._hue}, ${this._saturation}%, ${this._lightness}%)`;
        const hex = this._hslToHex(this._hue, this._saturation, this._lightness);
        const rgb = this._hslToRgb(this._hue, this._saturation, this._lightness);
        
        if (mainPreview) {
            mainPreview.style.background = hsl;
            mainPreview.style.color = this._lightness > 60 ? '#000' : '#fff';
            mainPreview.setAttribute('aria-label', `Color preview: ${hex}`);
        }
        
        if (hexValue) hexValue.textContent = hex.toUpperCase();
        if (hslValue) hslValue.textContent = hsl;
        if (rgbValue) rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    
    /**
     * Update slider track gradients (FIXES THE BROWN SLIDER ISSUE!)
     * 
     * The key insight: saturation and lightness gradients must be calculated
     * dynamically based on the current hue value. Static gradients show
     * incorrect colors (the "ugly brown" issue).
     * 
     * @private
     */
    _updateSliderGradients() {
        const satTrack = this.shadowRoot.getElementById('satTrack');
        const lightTrack = this.shadowRoot.getElementById('lightTrack');
        
        // Saturation gradient: grayscale at 0% → full color at 100%
        // Uses current hue and lightness for accurate preview
        if (satTrack) {
            satTrack.style.background = `linear-gradient(to right, 
                hsl(${this._hue}, 0%, ${this._lightness}%), 
                hsl(${this._hue}, 100%, ${this._lightness}%))`;
        }
        
        // Lightness gradient: black → pure color → white
        // Uses current hue and saturation for accurate preview
        if (lightTrack) {
            lightTrack.style.background = `linear-gradient(to right, 
                hsl(${this._hue}, ${this._saturation}%, 0%), 
                hsl(${this._hue}, ${this._saturation}%, 50%), 
                hsl(${this._hue}, ${this._saturation}%, 100%))`;
        }
    }
    
    /**
     * Update harmony color swatches
     * @private
     */
    _updateHarmonySwatches() {
        const container = this.shadowRoot.getElementById('harmonySwatches');
        if (!container) return;
        
        const colors = this._calculateHarmonyColors();
        
        container.innerHTML = colors.map((color, index) => {
            const hex = this._hslToHex(color.h, color.s, color.l);
            const textColor = color.l > 60 ? '#000' : '#fff';
            
            return `
                <div class="harmony-swatch" 
                     data-hue="${color.h}" 
                     data-saturation="${color.s}" 
                     data-lightness="${color.l}"
                     data-index="${index}"
                     role="option"
                     tabindex="0"
                     aria-label="${color.name}: ${hex}"
                     style="background: hsl(${color.h}, ${color.s}%, ${color.l}%); color: ${textColor};"
                     title="${color.name} - Click to select">
                    <span class="swatch-hex">${hex.toUpperCase()}</span>
                    <span class="swatch-name">${color.name}</span>
                </div>
            `;
        }).join('');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // HARMONY CALCULATIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Calculate harmony colors based on current mode
     * 
     * Each harmony uses angular relationships on the color wheel:
     * - Complementary: 180° (opposite)
     * - Triadic: 120° spacing (equilateral triangle)
     * - Analogous: 30° spacing (adjacent)
     * - Split-Comp: 150°/210° (complement's neighbors)
     * - Tetradic: 90° spacing (square)
     * - Monochromatic: Same hue, different lightness
     * 
     * @returns {Array<{h: number, s: number, l: number, name: string}>}
     * @private
     */
    _calculateHarmonyColors() {
        const h = this._hue;
        const s = this._saturation;
        const l = this._lightness;
        
        switch (this._harmonyMode) {
            case 'complementary':
                // Two colors, 180° apart
                return [
                    { h, s, l, name: 'Base' },
                    { h: (h + 180) % 360, s, l, name: 'Complement' }
                ];
                
            case 'triadic':
                // Three colors, 120° apart
                return [
                    { h, s, l, name: 'Base' },
                    { h: (h + 120) % 360, s, l, name: 'Triadic +120°' },
                    { h: (h + 240) % 360, s, l, name: 'Triadic +240°' }
                ];
                
            case 'analogous':
                // Three adjacent colors, 30° apart
                return [
                    { h: (h - 30 + 360) % 360, s, l, name: 'Analogous -30°' },
                    { h, s, l, name: 'Base' },
                    { h: (h + 30) % 360, s, l, name: 'Analogous +30°' }
                ];
                
            case 'split':
                // Base + two colors adjacent to complement
                return [
                    { h, s, l, name: 'Base' },
                    { h: (h + 150) % 360, s, l, name: 'Split +150°' },
                    { h: (h + 210) % 360, s, l, name: 'Split +210°' }
                ];
                
            case 'tetradic':
                // Four colors, 90° apart (square)
                return [
                    { h, s, l, name: 'Base' },
                    { h: (h + 90) % 360, s, l, name: 'Tetradic +90°' },
                    { h: (h + 180) % 360, s, l, name: 'Tetradic +180°' },
                    { h: (h + 270) % 360, s, l, name: 'Tetradic +270°' }
                ];
                
            case 'monochromatic':
                // Same hue, varying lightness
                return [
                    { h, s, l: this._clamp(l - 30, 10, 90), name: 'Darkest' },
                    { h, s, l: this._clamp(l - 15, 15, 85), name: 'Dark' },
                    { h, s, l, name: 'Base' },
                    { h, s, l: this._clamp(l + 15, 20, 90), name: 'Light' },
                    { h, s, l: this._clamp(l + 30, 25, 95), name: 'Lightest' }
                ];
                
            default:
                return [{ h, s, l, name: 'Base' }];
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ACTION METHODS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Copy current hex color to clipboard
     * @returns {Promise<void>}
     */
    async copyColor() {
        const hex = this._hslToHex(this._hue, this._saturation, this._lightness).toUpperCase();
        
        try {
            await navigator.clipboard.writeText(hex);
            
            // Visual feedback
            const copyBtn = this.shadowRoot.getElementById('copyBtn');
            if (copyBtn) {
                const original = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied!';
                copyBtn.classList.add('success');
                setTimeout(() => {
                    copyBtn.textContent = original;
                    copyBtn.classList.remove('success');
                }, 1500);
            }
            
            // Fire event
            this.dispatchEvent(new CustomEvent('colorcopied', {
                detail: { hex },
                bubbles: true,
                composed: true
            }));
        } catch (err) {
            console.error('Failed to copy color:', err);
        }
    }
    
    /**
     * Generate and set a random color with good saturation/lightness
     */
    randomColor() {
        this._hue = Math.floor(Math.random() * 360);
        this._saturation = Math.floor(Math.random() * 40) + 50;  // 50-90%
        this._lightness = Math.floor(Math.random() * 30) + 35;   // 35-65%
        
        this._syncSliders();
        this._updateDisplay();
        this._fireColorChangeEvent();
    }
    
    /**
     * Reset to default color values
     */
    resetColor() {
        this._hue = WBColorHarmony.DEFAULTS.hue;
        this._saturation = WBColorHarmony.DEFAULTS.saturation;
        this._lightness = WBColorHarmony.DEFAULTS.lightness;
        
        this._syncSliders();
        this._updateDisplay();
        this._fireColorChangeEvent();
    }
    
    /**
     * Sync slider elements with internal values
     * @private
     */
    _syncSliders() {
        const hueSlider = this.shadowRoot.getElementById('hueSlider');
        const satSlider = this.shadowRoot.getElementById('satSlider');
        const lightSlider = this.shadowRoot.getElementById('lightSlider');
        
        if (hueSlider) {
            hueSlider.value = this._hue;
            hueSlider.setAttribute('aria-valuenow', this._hue);
        }
        if (satSlider) {
            satSlider.value = this._saturation;
            satSlider.setAttribute('aria-valuenow', this._saturation);
        }
        if (lightSlider) {
            lightSlider.value = this._lightness;
            lightSlider.setAttribute('aria-valuenow', this._lightness);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // EVENT DISPATCHERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Fire colorchange event
     * @private
     */
    _fireColorChangeEvent() {
        this.dispatchEvent(new CustomEvent('colorchange', {
            detail: this._getColorData(),
            bubbles: true,
            composed: true
        }));
    }
    
    /**
     * Fire harmonychange event
     * @private
     */
    _fireHarmonyChangeEvent() {
        this.dispatchEvent(new CustomEvent('harmonychange', {
            detail: {
                mode: this._harmonyMode,
                colors: this._calculateHarmonyColors().map(c => ({
                    ...c,
                    hex: this._hslToHex(c.h, c.s, c.l)
                }))
            },
            bubbles: true,
            composed: true
        }));
    }
    
    /**
     * Fire swatchselect event
     * @param {HTMLElement} swatch - The clicked swatch element
     * @private
     */
    _fireSwatchSelectEvent(swatch) {
        const h = parseInt(swatch.dataset.hue);
        const s = parseInt(swatch.dataset.saturation);
        const l = parseInt(swatch.dataset.lightness);
        
        this.dispatchEvent(new CustomEvent('swatchselect', {
            detail: {
                hue: h,
                saturation: s,
                lightness: l,
                name: swatch.querySelector('.swatch-name')?.textContent || 'Unknown',
                hex: this._hslToHex(h, s, l).toUpperCase()
            },
            bubbles: true,
            composed: true
        }));
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // COLOR CONVERSION UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Convert HSL to Hex color
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {string} Hex color string (#RRGGBB)
     * @private
     */
    _hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        
        return `#${f(0)}${f(8)}${f(4)}`;
    }
    
    /**
     * Convert HSL to RGB color
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {{r: number, g: number, b: number}} RGB color object
     * @private
     */
    _hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        
        let r = 0, g = 0, b = 0;
        
        if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
        else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
        else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
        else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
        else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
        else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    
    /**
     * Clamp a value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     * @private
     */
    _clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    
    /**
     * Get complete color data object
     * @returns {Object} Color data
     * @private
     */
    _getColorData() {
        const hex = this._hslToHex(this._hue, this._saturation, this._lightness);
        const rgb = this._hslToRgb(this._hue, this._saturation, this._lightness);
        
        return {
            hue: this._hue,
            saturation: this._saturation,
            lightness: this._lightness,
            hex: hex.toUpperCase(),
            hsl: `hsl(${this._hue}, ${this._saturation}%, ${this._lightness}%)`,
            rgb,
            rgbString: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            harmonyMode: this._harmonyMode,
            harmonyColors: this._calculateHarmonyColors().map(c => ({
                ...c,
                hex: this._hslToHex(c.h, c.s, c.l).toUpperCase()
            }))
        };
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API - PROPERTIES
    // ═══════════════════════════════════════════════════════════════════════════
    
    /** Get current hue value @returns {number} */
    get hue() { return this._hue; }
    
    /** Set hue value @param {number} value */
    set hue(value) {
        this._hue = this._clamp(parseInt(value) || WBColorHarmony.DEFAULTS.hue, 0, 360);
        if (this._initialized) {
            this._syncSliders();
            this._updateDisplay();
        }
    }
    
    /** Get current saturation value @returns {number} */
    get saturation() { return this._saturation; }
    
    /** Set saturation value @param {number} value */
    set saturation(value) {
        this._saturation = this._clamp(parseInt(value) || WBColorHarmony.DEFAULTS.saturation, 0, 100);
        if (this._initialized) {
            this._syncSliders();
            this._updateDisplay();
        }
    }
    
    /** Get current lightness value @returns {number} */
    get lightness() { return this._lightness; }
    
    /** Set lightness value @param {number} value */
    set lightness(value) {
        this._lightness = this._clamp(parseInt(value) || WBColorHarmony.DEFAULTS.lightness, 0, 100);
        if (this._initialized) {
            this._syncSliders();
            this._updateDisplay();
        }
    }
    
    /** Get current harmony mode @returns {string} */
    get harmonyMode() { return this._harmonyMode; }
    
    /** Set harmony mode @param {string} value */
    set harmonyMode(value) {
        if (WBColorHarmony.HARMONY_MODES.includes(value)) {
            this._harmonyMode = value;
            if (this._initialized) {
                const allButtons = this.shadowRoot.querySelectorAll('.mode-btn');
                allButtons.forEach(b => {
                    const isActive = b.dataset.mode === value;
                    b.classList.toggle('active', isActive);
                    b.setAttribute('aria-checked', isActive ? 'true' : 'false');
                });
                
                const modeIndicator = this.shadowRoot.getElementById('modeIndicator');
                if (modeIndicator) {
                    const modeNames = {
                        'complementary': 'Complementary',
                        'triadic': 'Triadic',
                        'analogous': 'Analogous',
                        'split': 'Split-Complementary',
                        'tetradic': 'Tetradic',
                        'monochromatic': 'Monochromatic'
                    };
                    modeIndicator.textContent = `(${modeNames[value] || value})`;
                }
                
                this._updateHarmonySwatches();
            }
        }
    }
    
    /** Get complete color data (read-only) @returns {Object} */
    get color() { return this._getColorData(); }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API - METHODS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Set color using HSL values
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     */
    setColor(h, s, l) {
        this._hue = this._clamp(parseInt(h) || WBColorHarmony.DEFAULTS.hue, 0, 360);
        this._saturation = this._clamp(parseInt(s) || WBColorHarmony.DEFAULTS.saturation, 0, 100);
        this._lightness = this._clamp(parseInt(l) || WBColorHarmony.DEFAULTS.lightness, 0, 100);
        
        if (this._initialized) {
            this._syncSliders();
            this._updateDisplay();
            this._fireColorChangeEvent();
        }
    }
    
    /**
     * Set harmony mode programmatically
     * @param {string} mode - Harmony mode name
     */
    setHarmonyMode(mode) {
        if (WBColorHarmony.HARMONY_MODES.includes(mode)) {
            this.harmonyMode = mode;
            this._fireHarmonyChangeEvent();
        }
    }
    
    /**
     * Get harmony colors for current settings
     * @returns {Array<{h: number, s: number, l: number, name: string, hex: string}>}
     */
    getHarmonyColors() {
        return this._calculateHarmonyColors().map(c => ({
            ...c,
            hex: this._hslToHex(c.h, c.s, c.l).toUpperCase()
        }));
    }
}

// Register custom element
customElements.define('wb-color-harmony', WBColorHarmony);

export { WBColorHarmony };
export default WBColorHarmony;
