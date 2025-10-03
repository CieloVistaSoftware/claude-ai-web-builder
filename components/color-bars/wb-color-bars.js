/**
 * Color Bars Web Component
 * A comprehensive HSL color picker with hue, saturation, and lightness controls
 * Uses three color-bar components for individual HSL control
 * 
 * Features:
 * - Full HSL color control with three bars
 * - Interactive hue spectrum bar
 * - Saturation gradient bar  
 * - Lightness gradient bar
 * - Real-time color preview
 * - Mouse, touch, and keyboard support
 * - Accessibility features
 * - Theme support
 * 
 * Usage:
 * <color-bars hue="240" saturation="70" lightness="50"></color-bars>
 * 
 * Events:
 * - colorchange: Fired when color changes (real-time)
 * - colorselect: Fired when user finishes selecting a color
 */

class ColorBars extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default values
    this._hue = 240;
    this._saturation = 70;
    this._lightness = 50;
    
    // Bind methods
    this.handleHueChange = this.handleHueChange.bind(this);
    this.handleSaturationChange = this.handleSaturationChange.bind(this);
    this.handleLightnessChange = this.handleLightnessChange.bind(this);
  }
  
  static get observedAttributes() {
    return ['hue', 'saturation', 'lightness', 'disabled', 'theme', 'label'];
  }
  
  connectedCallback() {
    // Initialize from attributes first
    this.initializeFromAttributes();
    
    this.render();
    this.setupEventListeners();
    this.detectTheme();
    
    // Make the host element focusable
    this.tabIndex = 0;
  }
  
  initializeFromAttributes() {
    // Only update if attribute is actually present
    if (this.hasAttribute('hue')) {
      this._hue = Math.max(0, Math.min(360, parseInt(this.getAttribute('hue')) || 240));
    }
    if (this.hasAttribute('saturation')) {
      this._saturation = Math.max(0, Math.min(100, parseInt(this.getAttribute('saturation')) || 70));
    }
    if (this.hasAttribute('lightness')) {
      this._lightness = Math.max(0, Math.min(100, parseInt(this.getAttribute('lightness')) || 50));
    }
  }
  
  detectTheme() {
    // Auto-detect theme from parent document if not explicitly set
    if (!this.hasAttribute('theme')) {
      const bodyTheme = document.body.getAttribute('data-theme');
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      
      if (bodyTheme === 'dark' || htmlTheme === 'dark') {
        this.setAttribute('theme', 'dark');
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setAttribute('theme', 'dark');
      }
    }
  }
  
  disconnectedCallback() {
    this.removeEventListeners();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'hue':
        if (newValue !== null) {
          this._hue = Math.max(0, Math.min(360, parseInt(newValue) || 240));
        }
        break;
      case 'saturation':
        if (newValue !== null) {
          this._saturation = Math.max(0, Math.min(100, parseInt(newValue) || 70));
        }
        break;
      case 'lightness':
        if (newValue !== null) {
          this._lightness = Math.max(0, Math.min(100, parseInt(newValue) || 50));
        }
        break;
      case 'disabled':
        this.updateDisabledState();
        break;
      case 'theme':
        this.updateTheme();
        break;
    }
    
    if (this.shadowRoot) {
      this.updateDisplay();
    }
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --text-primary: #333;
          --text-secondary: #666;
          --preview-size: 40px;
          --transition-speed: 0.2s;
        }
        
        :host([disabled]) {
          opacity: 0.6;
          pointer-events: none;
        }
        
        :host([theme="dark"]) {
          --text-primary: #e6e1e5;
          --text-secondary: #cac4d0;
        }
        
        .color-bars-container {
          position: relative;
          padding: 16px 0;
        }
        
        .color-bars-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .color-bars-label {
          font-size: 16px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .color-preview {
          width: var(--preview-size);
          height: var(--preview-size);
          border-radius: 8px;
          border: 2px solid var(--text-primary);
          cursor: pointer;
          transition: transform var(--transition-speed) ease;
          position: relative;
          overflow: hidden;
        }
        
        .color-preview:hover {
          transform: scale(1.05);
        }
        
        .color-bars-section {
          margin-bottom: 20px;
        }
        
        .color-bars-section > color-bar {
          margin-bottom: 16px;
        }
        
        .color-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          font-size: 14px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        :host([theme="dark"]) .color-info {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .color-values {
          display: flex;
          gap: 16px;
        }
        
        .color-value {
          color: var(--text-secondary);
        }
        
        .hex-value {
          color: var(--text-primary);
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color var(--transition-speed) ease;
        }
        
        .hex-value:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        
        :host([theme="dark"]) .hex-value:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      </style>
      
      <div class="color-bars-container">
        <div class="color-bars-header">
          <span class="color-bars-label">\${this.getAttribute('label') || 'Color'}</span>
          <div class="color-preview" title="Click to copy hex value"></div>
        </div>
        
        <div class="color-bars-section">
          <!-- Hue Bar -->
          <color-bar id="hue-bar" type="hue" hue="\${this._hue}" saturation="\${this._saturation}" lightness="\${this._lightness}" theme="\${this.getAttribute('theme') || 'light'}">
            <span slot="label">Hue</span>
          </color-bar>
          
          <!-- Saturation Bar -->
          <color-bar id="saturation-bar" type="saturation" hue="\${this._hue}" saturation="\${this._saturation}" lightness="\${this._lightness}" value="\${this._saturation}" theme="\${this.getAttribute('theme') || 'light'}">
            <span slot="label">Saturation</span>
          </color-bar>
          
          <!-- Lightness Bar -->
          <color-bar id="lightness-bar" type="lightness" hue="\${this._hue}" saturation="\${this._saturation}" lightness="\${this._lightness}" value="\${this._lightness}" theme="\${this.getAttribute('theme') || 'light'}">
            <span slot="label">Lightness</span>
          </color-bar>
        </div>
        
        <!-- Color Info -->
        <div class="color-info">
          <div class="color-values">
            <span class="color-value hsl-display">HSL(240, 70%, 50%)</span>
            <span class="color-value rgb-display">RGB(99, 102, 241)</span>
          </div>
          <span class="hex-value" title="Click to copy">#6366f1</span>
        </div>
      </div>
    `;
    
    // Update the color bars after render
    setTimeout(() => this.updateColorBars(), 200);
  }
  
  setupEventListeners() {
    // Wait for color-bar components to be rendered
    setTimeout(() => {
      const hueBar = this.shadowRoot.querySelector('#hue-bar');
      const saturationBar = this.shadowRoot.querySelector('#saturation-bar');
      const lightnessBar = this.shadowRoot.querySelector('#lightness-bar');
      const preview = this.shadowRoot.querySelector('.color-preview');
      const hexValue = this.shadowRoot.querySelector('.hex-value');
      
      // Set up event listeners for all color-bar components
      if (hueBar) {
        hueBar.addEventListener('colorchange', this.handleHueChange);
        hueBar.addEventListener('colorselect', this.handleHueChange);
      }
      
      if (saturationBar) {
        saturationBar.addEventListener('colorchange', this.handleSaturationChange);
        saturationBar.addEventListener('colorselect', this.handleSaturationChange);
      }
      
      if (lightnessBar) {
        lightnessBar.addEventListener('colorchange', this.handleLightnessChange);
        lightnessBar.addEventListener('colorselect', this.handleLightnessChange);
      }
      
      // Copy to clipboard functionality
      if (preview) {
        preview.addEventListener('click', () => this.copyToClipboard());
      }
      if (hexValue) {
        hexValue.addEventListener('click', () => this.copyToClipboard());
      }
    }, 300);
  }
  
  removeEventListeners() {
    // No global event listeners to remove
  }
  
  handleHueChange(event) {
    this._hue = event.detail.hue;
    this.updateOtherBars();
    this.updateDisplay();
    this.dispatchColorChange();
  }
  
  handleSaturationChange(event) {
    this._saturation = event.detail.value;
    this.updateOtherBars();
    this.updateDisplay();
    this.dispatchColorChange();
  }
  
  handleLightnessChange(event) {
    this._lightness = event.detail.value;
    this.updateOtherBars();
    this.updateDisplay();
    this.dispatchColorChange();
  }
  
  updateOtherBars() {
    const hueBar = this.shadowRoot.querySelector('#hue-bar');
    const saturationBar = this.shadowRoot.querySelector('#saturation-bar');
    const lightnessBar = this.shadowRoot.querySelector('#lightness-bar');
    
    // Update context for all bars so gradients reflect current color
    if (hueBar) {
      hueBar.updateContext(this._hue, this._saturation, this._lightness);
    }
    if (saturationBar) {
      saturationBar.updateContext(this._hue, this._saturation, this._lightness);
      saturationBar.value = this._saturation;
    }
    if (lightnessBar) {
      lightnessBar.updateContext(this._hue, this._saturation, this._lightness);
      lightnessBar.value = this._lightness;
    }
  }
  
  updateColorBars() {
    this.updateOtherBars();
    this.updateDisplay();
  }
  
  updateDisplay() {
    this.updatePreview();
    this.updateValues();
  }
  
  updatePreview() {
    const preview = this.shadowRoot.querySelector('.color-preview');
    if (preview) {
      const color = `hsl(${this._hue}, ${this._saturation}%, ${this._lightness}%)`;
      preview.style.backgroundColor = color;
    }
  }
  
  updateValues() {
    const hslDisplay = this.shadowRoot.querySelector('.hsl-display');
    const rgbDisplay = this.shadowRoot.querySelector('.rgb-display');
    const hexValue = this.shadowRoot.querySelector('.hex-value');
    
    const rgb = this.hslToRgb(this._hue, this._saturation, this._lightness);
    const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    
    if (hslDisplay) hslDisplay.textContent = `HSL(${this._hue}, ${this._saturation}%, ${this._lightness}%)`;
    if (rgbDisplay) rgbDisplay.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    if (hexValue) hexValue.textContent = hex;
  }
  
  copyToClipboard() {
    const hex = this.color.hex;
    navigator.clipboard.writeText(hex).then(() => {
      this.dispatchEvent(new CustomEvent('colorcopied', {
        detail: { hex }
      }));
    }).catch(err => {
      console.warn('Failed to copy to clipboard:', err);
    });
  }
  
  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / (1/12)) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };
    
    return {
      r: f(0),
      g: f(8),
      b: f(4)
    };
  }
  
  rgbToHex(r, g, b) {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }
  
  dispatchColorChange() {
    const colorData = this.color;
    this.dispatchEvent(new CustomEvent('colorchange', {
      detail: colorData,
      bubbles: true
    }));
  }
  
  dispatchColorSelect() {
    const colorData = this.color;
    this.dispatchEvent(new CustomEvent('colorselect', {
      detail: colorData,
      bubbles: true
    }));
  }
  
  updateDisabledState() {
    // Implementation for disabled state
  }
  
  updateTheme() {
    // Theme is handled via CSS custom properties
  }
  
  // Getters and setters
  get hue() { return this._hue; }
  set hue(value) {
    this._hue = Math.max(0, Math.min(360, parseInt(value) || 0));
    this.updateDisplay();
  }
  
  get saturation() { return this._saturation; }
  set saturation(value) {
    this._saturation = Math.max(0, Math.min(100, parseInt(value) || 0));
    this.updateDisplay();
  }
  
  get lightness() { return this._lightness; }
  set lightness(value) {
    this._lightness = Math.max(0, Math.min(100, parseInt(value) || 0));
    this.updateDisplay();
  }
  
  get color() {
    const rgb = this.hslToRgb(this._hue, this._saturation, this._lightness);
    return {
      hue: this._hue,
      saturation: this._saturation,
      lightness: this._lightness,
      hsl: `hsl(${this._hue}, ${this._saturation}%, ${this._lightness}%)`,
      hex: this.rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb: rgb
    };
  }
  
  setColor(hue, saturation, lightness) {
    if (hue !== undefined) this._hue = Math.max(0, Math.min(360, parseInt(hue) || 0));
    if (saturation !== undefined) this._saturation = Math.max(0, Math.min(100, parseInt(saturation) || 0));
    if (lightness !== undefined) this._lightness = Math.max(0, Math.min(100, parseInt(lightness) || 0));
    this.updateColorBars();
    this.updateDisplay();
  }
}

// Register the custom element
customElements.define('wb-color-bars', ColorBars);

// Expose for external access
window.ColorBars = ColorBars;

console.log('🎨 Color Bars component loaded successfully');