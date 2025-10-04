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
    
    // Initialize text color HSL values
    this._textHue = 240;
    this._textSaturation = 70;
    this._textLightness = 90;
    
    // Initialize background color HSL values
    this._bgHue = 240;
    this._bgSaturation = 40;
    this._bgLightness = 20;
    
    this.render();
  }
  
  static get observedAttributes() {
    return ['text-hue', 'text-saturation', 'text-lightness', 'bg-hue', 'bg-saturation', 'bg-lightness', 'disabled', 'theme'];
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
      case 'text-hue':
        if (newValue !== null) {
          this._textHue = Math.max(0, Math.min(360, parseInt(newValue) || 240));
        }
        break;
      case 'text-saturation':
        if (newValue !== null) {
          this._textSaturation = Math.max(0, Math.min(100, parseInt(newValue) || 70));
        }
        break;
      case 'text-lightness':
        if (newValue !== null) {
          this._textLightness = Math.max(0, Math.min(100, parseInt(newValue) || 90));
        }
        break;
      case 'bg-hue':
        if (newValue !== null) {
          this._bgHue = Math.max(0, Math.min(360, parseInt(newValue) || 240));
        }
        break;
      case 'bg-saturation':
        if (newValue !== null) {
          this._bgSaturation = Math.max(0, Math.min(100, parseInt(newValue) || 40));
        }
        break;
      case 'bg-lightness':
        if (newValue !== null) {
          this._bgLightness = Math.max(0, Math.min(100, parseInt(newValue) || 20));
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
        
        .color-previews {
          display: flex;
          gap: 8px;
        }
        
        .text-preview,
        .bg-preview {
          width: var(--preview-size);
          height: var(--preview-size);
          border-radius: 8px;
          border: 2px solid var(--text-primary);
          cursor: pointer;
          transition: transform var(--transition-speed) ease;
          position: relative;
          overflow: hidden;
        }
        
        .text-preview:hover,
        .bg-preview:hover {
          transform: scale(1.05);
        }
        
        .color-group {
          margin-bottom: 20px;
        }
        
        .group-title {
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          margin-top: 0;
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
          <span class="color-bars-label">Color Controls</span>
          <div class="color-previews">
            <div class="text-preview" title="Text Color Preview"></div>
            <div class="bg-preview" title="Background Color Preview"></div>
          </div>
        </div>
        
        <div class="color-bars-section">
          <!-- Text Color Controls -->
          <div class="color-group">
            <h3 class="group-title">Text Color</h3>
            <wb-color-bar id="text-hue-bar" type="hue" hue="${this._textHue}" saturation="${this._textSaturation}" lightness="${this._textLightness}" theme="${this.getAttribute('theme') || 'light'}">
              <span slot="label">Text Hue</span>
            </wb-color-bar>
            
            <wb-color-bar id="text-saturation-bar" type="saturation" hue="${this._textHue}" saturation="${this._textSaturation}" lightness="${this._textLightness}" value="${this._textSaturation}" theme="${this.getAttribute('theme') || 'light'}">
              <span slot="label">Text Saturation</span>
            </wb-color-bar>
            
            <wb-color-bar id="text-lightness-bar" type="lightness" hue="${this._textHue}" saturation="${this._textSaturation}" lightness="${this._textLightness}" value="${this._textLightness}" theme="${this.getAttribute('theme') || 'light'}">
              <span slot="label">Text Lightness</span>
            </wb-color-bar>
          </div>
          
          <!-- Background Color Controls -->
          <div class="color-group">
            <h3 class="group-title">Background Color</h3>
            <wb-color-bar id="bg-hue-bar" type="hue" hue="${this._bgHue}" saturation="${this._bgSaturation}" lightness="${this._bgLightness}" theme="${this.getAttribute('theme') || 'light'}">
              <span slot="label">Background Hue</span>
            </wb-color-bar>
            
            <wb-color-bar id="bg-saturation-bar" type="saturation" hue="${this._bgHue}" saturation="${this._bgSaturation}" lightness="${this._bgLightness}" value="${this._bgSaturation}" theme="${this.getAttribute('theme') || 'light'}">
              <span slot="label">Background Saturation</span>
            </wb-color-bar>
            
            <wb-color-bar id="bg-lightness-bar" type="lightness" hue="${this._bgHue}" saturation="${this._bgSaturation}" lightness="${this._bgLightness}" value="${this._bgLightness}" theme="${this.getAttribute('theme') || 'light'}">
              <span slot="label">Background Lightness</span>
            </wb-color-bar>
          </div>
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
      // Text color bars
      const textHueBar = this.shadowRoot.querySelector('#text-hue-bar');
      const textSaturationBar = this.shadowRoot.querySelector('#text-saturation-bar');
      const textLightnessBar = this.shadowRoot.querySelector('#text-lightness-bar');
      
      // Background color bars
      const bgHueBar = this.shadowRoot.querySelector('#bg-hue-bar');
      const bgSaturationBar = this.shadowRoot.querySelector('#bg-saturation-bar');
      const bgLightnessBar = this.shadowRoot.querySelector('#bg-lightness-bar');
      
      // Set up event listeners for text color bars
      if (textHueBar) {
        textHueBar.addEventListener('colorchange', (e) => this.handleTextHueChange(e));
        textHueBar.addEventListener('colorselect', (e) => this.handleTextHueChange(e));
      }
      
      if (textSaturationBar) {
        textSaturationBar.addEventListener('colorchange', (e) => this.handleTextSaturationChange(e));
        textSaturationBar.addEventListener('colorselect', (e) => this.handleTextSaturationChange(e));
      }
      
      if (textLightnessBar) {
        textLightnessBar.addEventListener('colorchange', (e) => this.handleTextLightnessChange(e));
        textLightnessBar.addEventListener('colorselect', (e) => this.handleTextLightnessChange(e));
      }
      
      // Set up event listeners for background color bars
      if (bgHueBar) {
        bgHueBar.addEventListener('colorchange', (e) => this.handleBgHueChange(e));
        bgHueBar.addEventListener('colorselect', (e) => this.handleBgHueChange(e));
      }
      
      if (bgSaturationBar) {
        bgSaturationBar.addEventListener('colorchange', (e) => this.handleBgSaturationChange(e));
        bgSaturationBar.addEventListener('colorselect', (e) => this.handleBgSaturationChange(e));
      }
      
      if (bgLightnessBar) {
        bgLightnessBar.addEventListener('colorchange', (e) => this.handleBgLightnessChange(e));
        bgLightnessBar.addEventListener('colorselect', (e) => this.handleBgLightnessChange(e));
      }
      
      // Copy to clipboard functionality
      const textPreview = this.shadowRoot.querySelector('.text-preview');
      const bgPreview = this.shadowRoot.querySelector('.bg-preview');
      
      if (textPreview) {
        textPreview.addEventListener('click', () => this.copyTextColorToClipboard());
      }
      if (bgPreview) {
        bgPreview.addEventListener('click', () => this.copyBgColorToClipboard());
      }
    }, 300);
  }
  
  removeEventListeners() {
    // No global event listeners to remove
  }
  
  // Text color event handlers
  handleTextHueChange(event) {
    this._textHue = event.detail.hue !== undefined ? event.detail.hue : event.detail.value;
    this.updateTextColorBars();
    this.updateDisplay();
    this.dispatchColorChange();
  }
  
  handleTextSaturationChange(event) {
    this._textSaturation = event.detail.value !== undefined ? event.detail.value : event.detail.saturation;
    this.updateTextColorBars();
    this.updateDisplay();
    this.dispatchColorChange();
  }
  
  handleTextLightnessChange(event) {
    this._textLightness = event.detail.value !== undefined ? event.detail.value : event.detail.lightness;
    this.updateTextColorBars();
    this.updateDisplay();
    this.dispatchColorChange();
  }
  
  // Background color event handlers
  handleBgHueChange(event) {
    this._bgHue = event.detail.hue !== undefined ? event.detail.hue : event.detail.value;
    this.updateBgColorBars();
    this.updateDisplay();
    this.dispatchColorChange();
  }
  
  handleBgSaturationChange(event) {
    this._bgSaturation = event.detail.value !== undefined ? event.detail.value : event.detail.saturation;
    this.updateBgColorBars();
    this.updateDisplay();
    this.dispatchColorChange();
  }
  
  handleBgLightnessChange(event) {
    this._bgLightness = event.detail.value !== undefined ? event.detail.value : event.detail.lightness;
    this.updateBgColorBars();
    this.updateDisplay();
    this.dispatchColorChange();
  }
  
  updateTextColorBars() {
    const textHueBar = this.shadowRoot.querySelector('#text-hue-bar');
    const textSaturationBar = this.shadowRoot.querySelector('#text-saturation-bar');
    const textLightnessBar = this.shadowRoot.querySelector('#text-lightness-bar');
    
    // Update context for text color bars so gradients reflect current color
    if (textHueBar && textHueBar.updateContext) {
      textHueBar.updateContext(this._textHue, this._textSaturation, this._textLightness);
    }
    if (textSaturationBar && textSaturationBar.updateContext) {
      textSaturationBar.updateContext(this._textHue, this._textSaturation, this._textLightness);
      textSaturationBar.value = this._textSaturation;
    }
    if (textLightnessBar && textLightnessBar.updateContext) {
      textLightnessBar.updateContext(this._textHue, this._textSaturation, this._textLightness);
      textLightnessBar.value = this._textLightness;
    }
  }
  
  updateBgColorBars() {
    const bgHueBar = this.shadowRoot.querySelector('#bg-hue-bar');
    const bgSaturationBar = this.shadowRoot.querySelector('#bg-saturation-bar');
    const bgLightnessBar = this.shadowRoot.querySelector('#bg-lightness-bar');
    
    // Update context for background color bars so gradients reflect current color
    if (bgHueBar && bgHueBar.updateContext) {
      bgHueBar.updateContext(this._bgHue, this._bgSaturation, this._bgLightness);
    }
    if (bgSaturationBar && bgSaturationBar.updateContext) {
      bgSaturationBar.updateContext(this._bgHue, this._bgSaturation, this._bgLightness);
      bgSaturationBar.value = this._bgSaturation;
    }
    if (bgLightnessBar && bgLightnessBar.updateContext) {
      bgLightnessBar.updateContext(this._bgHue, this._bgSaturation, this._bgLightness);
      bgLightnessBar.value = this._bgLightness;
    }
  }
  
  updateColorBars() {
    this.updateTextColorBars();
    this.updateBgColorBars();
    this.updateDisplay();
  }
  
  updateDisplay() {
    this.updatePreviews();
    this.updateValues();
  }
  
  updatePreviews() {
    const textPreview = this.shadowRoot.querySelector('.text-preview');
    const bgPreview = this.shadowRoot.querySelector('.bg-preview');
    
    if (textPreview) {
      const textColor = `hsl(${this._textHue}, ${this._textSaturation}%, ${this._textLightness}%)`;
      textPreview.style.backgroundColor = textColor;
    }
    
    if (bgPreview) {
      const bgColor = `hsl(${this._bgHue}, ${this._bgSaturation}%, ${this._bgLightness}%)`;
      bgPreview.style.backgroundColor = bgColor;
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
  
  copyTextColorToClipboard() {
    const textRgb = this.hslToRgb(this._textHue, this._textSaturation, this._textLightness);
    const hex = this.rgbToHex(textRgb.r, textRgb.g, textRgb.b);
    navigator.clipboard.writeText(hex).then(() => {
      this.dispatchEvent(new CustomEvent('colorcopied', {
        detail: { type: 'text', hex }
      }));
    }).catch(err => {
      console.warn('Failed to copy text color to clipboard:', err);
    });
  }
  
  copyBgColorToClipboard() {
    const bgRgb = this.hslToRgb(this._bgHue, this._bgSaturation, this._bgLightness);
    const hex = this.rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b);
    navigator.clipboard.writeText(hex).then(() => {
      this.dispatchEvent(new CustomEvent('colorcopied', {
        detail: { type: 'background', hex }
      }));
    }).catch(err => {
      console.warn('Failed to copy background color to clipboard:', err);
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
    const textRgb = this.hslToRgb(this._textHue, this._textSaturation, this._textLightness);
    const bgRgb = this.hslToRgb(this._bgHue, this._bgSaturation, this._bgLightness);
    
    const colorData = {
      text: {
        hue: this._textHue,
        saturation: this._textSaturation,
        lightness: this._textLightness,
        hsl: `hsl(${this._textHue}, ${this._textSaturation}%, ${this._textLightness}%)`,
        hex: this.rgbToHex(textRgb.r, textRgb.g, textRgb.b),
        rgb: textRgb
      },
      background: {
        hue: this._bgHue,
        saturation: this._bgSaturation,
        lightness: this._bgLightness,
        hsl: `hsl(${this._bgHue}, ${this._bgSaturation}%, ${this._bgLightness}%)`,
        hex: this.rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b),
        rgb: bgRgb
      }
    };
    
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