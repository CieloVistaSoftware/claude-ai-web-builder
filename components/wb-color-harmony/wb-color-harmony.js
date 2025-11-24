/**
 * WB Color Harmony Component
 * Enhanced with heterodyne mixing and full harmony mode support
 * Extends WBBaseComponent for behavior injection
 * NOW USES SHARED wb-color-utils FOR ALL FORMULAS
 */
import { WBBaseComponent } from '../wb-base/wb-base.js';
import { Heterodyne, ColorConversion } from '../wb-color-utils/wb-color-utils.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

// Export palette keys for use in demos and integration
export const PALETTE_KEYS = [
  'primary', 'secondary', 'accent', 'highlight',
  'background', 'foreground', 'border',
  'plus30', 'plus45', 'plus60', 'plus90',
  'minus30', 'minus45', 'minus60', 'minus90'
];

class WBColorHarmony extends WBBaseComponent {
  constructor() {
    super();
    
    // State - REACTIVE: Component owns and applies its own state
    this.hue = 240;
    this.saturation = 70;
    this.lightness = 50;
    this.harmonyMode = 'complementary';
    this.palette = {};
    
    // Heterodyne mixing properties (wave-based frequency mixing)
    this.modulatorHue = 60;
    this.mixingDepth = 50;
    
    // Guard flag to prevent infinite loops
    this._isUpdating = false;
    
    this.logInfo('WBColorHarmony initialized', { 
      component: 'wb-color-harmony',
      harmonyMode: this.harmonyMode 
    });
  }
  
  static get observedAttributes() {
    return ['hue', 'saturation', 'lightness', 'harmony-mode', 'modulator-hue', 'mixing-depth'];
  }
  
  async connectedCallback() {
    super.connectedCallback();
    await loadComponentCSS(this, 'wb-color-harmony.css');
    this.updatePalette();
    this.render();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected) return;
    
    switch (name) {
      case 'hue':
        this.hue = parseInt(newValue) || 240;
        break;
      case 'saturation':
        this.saturation = parseInt(newValue) || 70;
        break;
      case 'lightness':
        this.lightness = parseInt(newValue) || 50;
        break;
      case 'harmony-mode':
        this.harmonyMode = newValue || 'complementary';
        break;
      case 'modulator-hue':
        this.modulatorHue = parseInt(newValue) || 60;
        break;
      case 'mixing-depth':
        this.mixingDepth = parseInt(newValue) || 50;
        break;
    }
    
    if (this.shadowRoot) {
      this.updatePalette();
      this.renderPalette();
    }
  }
  
  render() {
    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="wb-color-harmony.css">
      <div class="harmony-wrapper">
        <div class="controls">
          <!-- Base Color Controls -->
          <div class="slider-block">
            <label for="hue-slider">Hue:</label>
            <input type="range" min="0" max="360" value="${this.hue}" 
                   id="hue-slider" class="color-range">
            <span class="value-unit" id="hue-val">${this.hue}°</span>
          </div>
          
          <div class="slider-block">
            <label for="sat-slider">Saturation:</label>
            <input type="range" min="0" max="100" value="${this.saturation}" id="sat-slider">
            <span class="value-unit" id="sat-val">${this.saturation}%</span>
          </div>
          
          <div class="slider-block">
            <label for="light-slider">Lightness:</label>
            <input type="range" min="0" max="100" value="${this.lightness}" id="light-slider">
            <span class="value-unit" id="light-val">${this.lightness}%</span>
          </div>
          
          <!-- Harmony Mode Selector -->
          <div class="slider-block">
            <label for="harmony-mode">Harmony Mode:</label>
            <select id="harmony-mode">
              <optgroup label="Traditional Color Theory">
                <option value="complementary" ${this.harmonyMode === 'complementary' ? 'selected' : ''}>Complementary</option>
                <option value="analogous" ${this.harmonyMode === 'analogous' ? 'selected' : ''}>Analogous</option>
                <option value="triadic" ${this.harmonyMode === 'triadic' ? 'selected' : ''}>Triadic</option>
                <option value="split" ${this.harmonyMode === 'split' ? 'selected' : ''}>Split-Complementary</option>
                <option value="square" ${this.harmonyMode === 'square' ? 'selected' : ''}>Square</option>
                <option value="monochromatic" ${this.harmonyMode === 'monochromatic' ? 'selected' : ''}>Monochromatic</option>
              </optgroup>
              <optgroup label="Wave Theory">
                <option value="heterodyne" ${this.harmonyMode === 'heterodyne' ? 'selected' : ''}>🎛️ Heterodyne Mixing</option>
              </optgroup>
              <optgroup label="Palette Keys">
                <option value="all-keys" ${this.harmonyMode === 'all-keys' ? 'selected' : ''}>All Keys</option>
              </optgroup>
            </select>
          </div>
          
          <!-- Heterodyne Controls (only visible when heterodyne selected) -->
          <div id="heterodyne-controls" style="display: ${this.harmonyMode === 'heterodyne' ? 'block' : 'none'}; padding-left: 1rem; border-left: 3px solid var(--primary, #6366f1);">
            <div class="slider-block">
              <label for="modulator-slider">Modulator Hue:</label>
              <input type="range" min="0" max="360" value="${this.modulatorHue}" 
                     id="modulator-slider" class="color-range">
              <span class="value-unit" id="modulator-val">${this.modulatorHue}°</span>
            </div>
            
            <div class="slider-block">
              <label for="mixing-depth-slider">Mixing Depth:</label>
              <input type="range" min="0" max="100" value="${this.mixingDepth}" id="mixing-depth-slider">
              <span class="value-unit" id="mixing-depth-val">${this.mixingDepth}%</span>
            </div>
          </div>
        </div>
        
        <div class="harmony-container" id="harmony-container"></div>
      </div>
    `;
    
    this.renderPalette();
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    if (this._isUpdating) return;
    
    const shadow = this.shadowRoot;
    
    // REACTIVE PATTERN: Sliders update component state immediately, then fire event
    shadow.getElementById('hue-slider')?.addEventListener('input', e => {
      this.hue = parseInt(e.target.value);
      shadow.getElementById('hue-val').textContent = `${this.hue}°`;
      this.updatePalette();
    });
    
    shadow.getElementById('sat-slider')?.addEventListener('input', e => {
      this.saturation = parseInt(e.target.value);
      shadow.getElementById('sat-val').textContent = `${this.saturation}%`;
      this.updatePalette();
    });
    
    shadow.getElementById('light-slider')?.addEventListener('input', e => {
      this.lightness = parseInt(e.target.value);
      shadow.getElementById('light-val').textContent = `${this.lightness}%`;
      this.updatePalette();
    });
    
    // Harmony mode selector
    shadow.getElementById('harmony-mode')?.addEventListener('change', e => {
      this.harmonyMode = e.target.value;
      
      // Show/hide heterodyne controls
      const hetControls = shadow.getElementById('heterodyne-controls');
      if (hetControls) {
        hetControls.style.display = this.harmonyMode === 'heterodyne' ? 'block' : 'none';
      }
      
      this.updatePalette();
      this.renderPalette();
    });
    
    // Heterodyne controls
    shadow.getElementById('modulator-slider')?.addEventListener('input', e => {
      this.modulatorHue = parseInt(e.target.value);
      shadow.getElementById('modulator-val').textContent = `${this.modulatorHue}°`;
      if (this.harmonyMode === 'heterodyne') {
        this.updatePalette();
      }
    });
    
    shadow.getElementById('mixing-depth-slider')?.addEventListener('input', e => {
      this.mixingDepth = parseInt(e.target.value);
      shadow.getElementById('mixing-depth-val').textContent = `${this.mixingDepth}%`;
      if (this.harmonyMode === 'heterodyne') {
        this.updatePalette();
      }
    });
  }
  
  /**
   * Calculate color harmonies based on selected mode
   * REACTIVE: This applies changes to palette immediately
   */
  calculateHarmony(mode) {
    const h = this.hue;
    const s = this.saturation;
    const l = this.lightness;
    const colors = [];
    
    // Always include primary
    colors.push({
      name: 'Primary',
      hue: h,
      saturation: s,
      lightness: l,
      role: 'Foundation color'
    });
    
    switch(mode) {
      case 'heterodyne':
        // Use shared Heterodyne class from wb-color-utils
        return Heterodyne.generatePalette(this.hue, this.modulatorHue, this.mixingDepth, this.saturation, this.lightness);
        
      case 'monochromatic':
        colors.push(
          { name: 'Light', hue: h, saturation: Math.max(10, s - 20), lightness: Math.min(90, l + 25), role: 'Lighter variant' },
          { name: 'Dark', hue: h, saturation: Math.min(100, s + 10), lightness: Math.max(10, l - 25), role: 'Darker variant' },
          { name: 'Muted', hue: h, saturation: Math.max(10, s - 40), lightness: l, role: 'Desaturated' }
        );
        break;
        
      case 'complementary':
        colors.push({
          name: 'Complement',
          hue: (h + 180) % 360,
          saturation: Math.max(50, s - 10),
          lightness: l,
          role: 'Maximum contrast'
        });
        break;
        
      case 'analogous':
        colors.push(
          { name: 'Analogous -30°', hue: (h - 30 + 360) % 360, saturation: s - 10, lightness: l + 5, role: 'Neighbor' },
          { name: 'Analogous +30°', hue: (h + 30) % 360, saturation: s - 10, lightness: l + 5, role: 'Neighbor' }
        );
        break;
        
      case 'triadic':
        colors.push(
          { name: 'Triadic 1', hue: (h + 120) % 360, saturation: s - 5, lightness: l, role: '120° spacing' },
          { name: 'Triadic 2', hue: (h + 240) % 360, saturation: s - 5, lightness: l, role: '240° spacing' }
        );
        break;
        
      case 'split':
        colors.push(
          { name: 'Split 1', hue: (h + 150) % 360, saturation: s - 10, lightness: l, role: 'Split complement' },
          { name: 'Split 2', hue: (h + 210) % 360, saturation: s - 10, lightness: l, role: 'Split complement' }
        );
        break;
        
      case 'square':
        colors.push(
          { name: 'Square 1', hue: (h + 90) % 360, saturation: s - 5, lightness: l, role: '90°' },
          { name: 'Square 2', hue: (h + 180) % 360, saturation: s - 5, lightness: l, role: '180°' },
          { name: 'Square 3', hue: (h + 270) % 360, saturation: s - 5, lightness: l, role: '270°' }
        );
        break;
        
      case 'all-keys':
        return this.generateAllKeys();
    }
    
    return colors;
  }
  
  /**
   * Generate all palette keys (original functionality)
   */
  generateAllKeys() {
    const h = this.hue;
    const s = this.saturation;
    const l = this.lightness;
    
    return PALETTE_KEYS.map(key => {
      switch (key) {
        case 'primary':
          return { name: 'Primary', hue: h, saturation: s, lightness: l };
        case 'secondary':
          return { name: 'Secondary', hue: (h + 180) % 360, saturation: s, lightness: l };
        case 'accent':
          return { name: 'Accent', hue: (h + 90) % 360, saturation: s, lightness: l };
        case 'highlight':
          return { name: 'Highlight', hue: (h + 45) % 360, saturation: s, lightness: l };
        case 'background':
          return { name: 'Background', hue: (h + 210) % 360, saturation: s, lightness: Math.max(95, l + 40) };
        case 'foreground':
          return { name: 'Foreground', hue: h, saturation: Math.max(0, s - 60), lightness: Math.min(20, l - 30) };
        case 'border':
          return { name: 'Border', hue: (h + 120) % 360, saturation: s, lightness: Math.max(30, l - 20) };
        case 'plus30':
          return { name: 'plus30', hue: (h + 30) % 360, saturation: s, lightness: l };
        case 'plus45':
          return { name: 'plus45', hue: (h + 45) % 360, saturation: s, lightness: l };
        case 'plus60':
          return { name: 'plus60', hue: (h + 60) % 360, saturation: s, lightness: l };
        case 'plus90':
          return { name: 'plus90', hue: (h + 90) % 360, saturation: s, lightness: l };
        case 'minus30':
          return { name: 'minus30', hue: (h - 30 + 360) % 360, saturation: s, lightness: l };
        case 'minus45':
          return { name: 'minus45', hue: (h - 45 + 360) % 360, saturation: s, lightness: l };
        case 'minus60':
          return { name: 'minus60', hue: (h - 60 + 360) % 360, saturation: s, lightness: l };
        case 'minus90':
          return { name: 'minus90', hue: (h - 90 + 360) % 360, saturation: s, lightness: l };
        default:
          return null;
      }
    }).filter(Boolean);
  }
  
  /**
   * REACTIVE: Update palette immediately and fire event
   * NEVER listen to your own events!
   */
  updatePalette() {
    if (this._isUpdating) return;
    this._isUpdating = true;
    
    // Calculate new palette based on current harmony mode
    const colors = this.calculateHarmony(this.harmonyMode);
    
    // Convert to palette object
    this.palette = {};
    colors.forEach(color => {
      const key = color.name.toLowerCase().replace(/\s+/g, '-');
      this.palette[key] = color;
    });
    
    // REACTIVE: Fire event for OTHER components to listen
    this.fireEvent('wb:color-harmony-change', {
      palette: this.palette,
      harmonyMode: this.harmonyMode,
      baseColor: { hue: this.hue, saturation: this.saturation, lightness: this.lightness }
    });
    
    this.logDebug('Palette updated', {
      component: 'wb-color-harmony',
      harmonyMode: this.harmonyMode,
      colorCount: colors.length
    });
    
    this._isUpdating = false;
  }
  
  renderPalette() {
    const container = this.shadowRoot?.querySelector('.harmony-container');
    if (!container) return;
    
    const colors = this.calculateHarmony(this.harmonyMode);
    
    container.innerHTML = colors.map(color => {
      const hsl = ColorConversion.toHslString(color.hue, color.saturation, color.lightness);
      const hex = ColorConversion.hslToHex(color.hue, color.saturation, color.lightness);
      
      return `
        <div class="color-swatch" 
             style="background: ${hsl} !important;" 
             title="${color.role}: ${hex}">
          <div class="color-label">${color.name}</div>
        </div>
      `;
    }).join('');
  }
  
  // Public API
  setHarmonyMode(mode) {
    this.harmonyMode = mode;
    this.setAttribute('harmony-mode', mode);
    this.updatePalette();
    this.renderPalette();
  }
  
  getHarmonyMode() {
    return this.harmonyMode;
  }
  
  getPalette() {
    return this.palette;
  }
}

// Register component
if (!customElements.get('wb-color-harmony')) {
  customElements.define('wb-color-harmony', WBColorHarmony);
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBColorHarmony = WBColorHarmony;

// Expose globally (backward compatibility)
window.WBColorHarmony = WBColorHarmony;

// ES6 Module Exports
export { WBColorHarmony };
export default WBColorHarmony;

console.log('✅ wb-color-harmony loaded - Now using shared wb-color-utils!');
