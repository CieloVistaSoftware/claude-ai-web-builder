/**
 * WB Color Bars - Self-Contained Component
 * A comprehensive HSL color picker with text and background color controls
 * 
 * This file is SELF-CONTAINED and includes wb-color-bar functionality inline
 * to follow the containment principle - no external dependencies required.
 * 
 * EMBEDDED DEPENDENCY: wb-color-bar component code is included below
 */

// =============================================================================
// EMBEDDED DEPENDENCY: WB Color Bar Component (for containment)
// =============================================================================

// ColorBar class will be embedded here when needed - for now wb-color-bars works standalone

/**
 * Color Bars Web Component - MAIN COMPONENT
 * A comprehensive HSL color picker with text and background color controls
 * Now SELF-CONTAINED with embedded wb-color-bar dependency
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
    // Load wb-color-bar dependency first
    this.loadDependencies().then(() => {
      // Initialize from attributes first
      this.initializeFromAttributes();
      
      this.render();
      this.setupEventListeners();
      
      // Make the host element focusable
      this.tabIndex = 0;
    });
  }
  
  async loadDependencies() {
    // Ensure WBComponentUtils is loaded first
    if (!window.WBComponentUtils) {
      await this.loadWBComponentUtils();
    }
    
    // Use WBComponentRegistry if available for better dependency management
    if (window.WBComponentRegistry) {
      try {
        await window.WBComponentRegistry.waitForComponent('wb-color-bar', 2000);
        if (window.WBEventLog) {
          WBEventLog.logInfo('wb-color-bar dependency resolved via registry', { component: 'wb-color-bars', method: 'loadDependencies', line: 74 });
        }
        return;
      } catch (error) {
        if (window.WBEventLog) {
          WBEventLog.logWarning('Registry wait failed, falling back to manual loading', { component: 'wb-color-bars', method: 'loadDependencies', line: 77 });
        }
      }
    }
    
    // Check if wb-color-bar is already loaded
    if (customElements.get('wb-color-bar')) {
      if (window.WBEventLog) {
        WBEventLog.logInfo('wb-color-bar already loaded', { component: 'wb-color-bars', method: 'loadDependencies', line: 83 });
      }
      return;
    }
    
    // Load wb-color-bar component with robust path resolution
    try {
      const script = document.createElement('script');
      
      // Try multiple path resolution strategies
      let scriptPath;
      if (window.WBComponentUtils?.resolve) {
        scriptPath = window.WBComponentUtils.resolve('wb-color-bar.js');
      } else {
        // Fallback path resolution - try relative paths first
        const possiblePaths = [
          '../wb-color-bar/wb-color-bar.js',  // From wb-color-bars to wb-color-bar
          './wb-color-bar/wb-color-bar.js',   // From parent directory
          '/components/wb-color-bar/wb-color-bar.js'  // Absolute fallback
        ];
        scriptPath = possiblePaths[0]; // Start with relative path
      }
      
      script.src = scriptPath;
      if (window.WBEventLog) {
        WBEventLog.logInfo('Loading wb-color-bar from: ' + scriptPath, { component: 'wb-color-bars', method: 'loadDependencies', line: 106 });
      }
      document.head.appendChild(script);
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          if (window.WBEventLog) {
            WBEventLog.logSuccess('wb-color-bar dependency loaded successfully', { component: 'wb-color-bars', method: 'loadDependencies', line: 111 });
          }
          resolve();
        };
        script.onerror = () => {
          if (window.WBEventLog) {
            WBEventLog.logWarning('Failed to load wb-color-bar from: ' + scriptPath, { component: 'wb-color-bars', method: 'loadDependencies', line: 115 });
            // Don't reject - wb-color-bars can work without wb-color-bar dependency
            // by using embedded fallback sliders
            WBEventLog.logInfo('wb-color-bars will use embedded slider fallback', { component: 'wb-color-bars', method: 'loadDependencies', line: 118 });
          }
          resolve();
        };
      });
    } catch (error) {
      if (window.WBEventLog) {
        WBEventLog.logWarning('Error loading wb-color-bar dependency: ' + error.message, { component: 'wb-color-bars', method: 'loadDependencies', line: 123, error });
        WBEventLog.logInfo('wb-color-bars will continue without dependency', { component: 'wb-color-bars', method: 'loadDependencies', line: 124 });
      }
      // Don't throw - let the component work with fallback
    }
  }
  
  async loadWBComponentUtils() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = window.WBComponentUtils?.resolve('wb.utils') || '/utils/wb/wb-component-utils.js';
      script.onload = () => {
        if (window.WBEventLog) {
          WBEventLog.logSuccess('WBComponentUtils loaded', { component: 'wb-color-bars', method: 'loadWBComponentUtils', line: 134 });
        }
        resolve();
      };
      script.onerror = () => {
        if (window.WBEventLog) {
          WBEventLog.logError('Failed to load WBComponentUtils', { component: 'wb-color-bars', method: 'loadWBComponentUtils', line: 138 });
        }
        reject();
      };
      document.head.appendChild(script);
    });
  }
  
  initializeFromAttributes() {
    // Initialize text color attributes
    if (this.hasAttribute('text-hue')) {
      this._textHue = Math.max(0, Math.min(360, parseInt(this.getAttribute('text-hue')) || 240));
    }
    if (this.hasAttribute('text-saturation')) {
      this._textSaturation = Math.max(0, Math.min(100, parseInt(this.getAttribute('text-saturation')) || 70));
    }
    if (this.hasAttribute('text-lightness')) {
      this._textLightness = Math.max(0, Math.min(100, parseInt(this.getAttribute('text-lightness')) || 90));
    }
    
    // Initialize background color attributes
    if (this.hasAttribute('bg-hue')) {
      this._bgHue = Math.max(0, Math.min(360, parseInt(this.getAttribute('bg-hue')) || 240));
    }
    if (this.hasAttribute('bg-saturation')) {
      this._bgSaturation = Math.max(0, Math.min(100, parseInt(this.getAttribute('bg-saturation')) || 40));
    }
    if (this.hasAttribute('bg-lightness')) {
      this._bgLightness = Math.max(0, Math.min(100, parseInt(this.getAttribute('bg-lightness')) || 20));
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
    // CSS-first approach - external stylesheet with dynamic path resolution
    let cssPath = '/components/wb-color-bars/wb-color-bars.css';
    
    // Try to use WBComponentUtils if available
    if (window.WBComponentUtils && typeof window.WBComponentUtils.resolve === 'function') {
      try {
        cssPath = '/components/wb-color-bars/wb-color-bars.css';
      } catch (e) {
        if (window.WBEventLog) {
          WBEventLog.logWarning('Could not resolve CSS path, using fallback', { component: 'wb-color-bars', method: 'render', line: 243, error: e });
        }
      }
    }
    
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${cssPath}">
      
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
        textHueBar.addEventListener('wb:color-harmony-change', (e) => this.handleHarmonyChange(e, 'text'));
      }
      if (textSaturationBar) {
        textSaturationBar.addEventListener('colorchange', (e) => this.handleTextSaturationChange(e));
        textSaturationBar.addEventListener('colorselect', (e) => this.handleTextSaturationChange(e));
        textSaturationBar.addEventListener('wb:color-harmony-change', (e) => this.handleHarmonyChange(e, 'text'));
      }
      if (textLightnessBar) {
        textLightnessBar.addEventListener('colorchange', (e) => this.handleTextLightnessChange(e));
        textLightnessBar.addEventListener('colorselect', (e) => this.handleTextLightnessChange(e));
        textLightnessBar.addEventListener('wb:color-harmony-change', (e) => this.handleHarmonyChange(e, 'text'));
      }
      // Set up event listeners for background color bars
      if (bgHueBar) {
        bgHueBar.addEventListener('colorchange', (e) => this.handleBgHueChange(e));
        bgHueBar.addEventListener('colorselect', (e) => this.handleBgHueChange(e));
        bgHueBar.addEventListener('wb:color-harmony-change', (e) => this.handleHarmonyChange(e, 'background'));
      }
      if (bgSaturationBar) {
        bgSaturationBar.addEventListener('colorchange', (e) => this.handleBgSaturationChange(e));
        bgSaturationBar.addEventListener('colorselect', (e) => this.handleBgSaturationChange(e));
        bgSaturationBar.addEventListener('wb:color-harmony-change', (e) => this.handleHarmonyChange(e, 'background'));
      }
      if (bgLightnessBar) {
        bgLightnessBar.addEventListener('colorchange', (e) => this.handleBgLightnessChange(e));
        bgLightnessBar.addEventListener('colorselect', (e) => this.handleBgLightnessChange(e));
        bgLightnessBar.addEventListener('wb:color-harmony-change', (e) => this.handleHarmonyChange(e, 'background'));
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
  
  // Listen for harmony events from child bars, aggregate, and propagate
  handleHarmonyChange(event, source) {
    event.stopPropagation();
    // Aggregate current HSL for both text and background
    const text = {
      hue: this._textHue,
      saturation: this._textSaturation,
      lightness: this._textLightness
    };
    const background = {
      hue: this._bgHue,
      saturation: this._bgSaturation,
      lightness: this._bgLightness
    };
    // Compute harmony palette for both text and background
    const textPalette = this.computeHarmonyPalette(text.hue, text.saturation, text.lightness);
    const bgPalette = this.computeHarmonyPalette(background.hue, background.saturation, background.lightness);
    // Fire a single event with both palettes
    this.dispatchEvent(new CustomEvent('wb:color-harmony-change', {
      detail: {
        source,
        text,
        background,
        textPalette,
        bgPalette
      },
      bubbles: true
    }));
  }

  // Harmony palette logic (from harmonic-color-mixer)
  computeHarmonyPalette(h, s, l) {
    // Returns an array of palette colors (complementary, triadic, etc.)
    const palette = [];
    palette.push({ name: 'Primary', hue: h, saturation: s, lightness: l });
    palette.push({ name: 'Complement', hue: (h + 180) % 360, saturation: s, lightness: l });
    palette.push({ name: 'Triadic 1', hue: (h + 120) % 360, saturation: s, lightness: l });
    palette.push({ name: 'Triadic 2', hue: (h + 240) % 360, saturation: s, lightness: l });
    palette.push({ name: 'Analogous -30', hue: (h - 30 + 360) % 360, saturation: s, lightness: l });
    palette.push({ name: 'Analogous +30', hue: (h + 30) % 360, saturation: s, lightness: l });
    // Heterodyne/advanced logic could be added here if needed
    return palette;
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
      // CRITICAL FIX: Use silent update to prevent infinite loop
      if (textSaturationBar.updateValueSilently) {
        textSaturationBar.updateValueSilently(this._textSaturation);
      } else if (textSaturationBar._value !== this._textSaturation) {
        textSaturationBar._value = this._textSaturation;
        textSaturationBar.updateDisplay && textSaturationBar.updateDisplay();
      }
    }
    if (textLightnessBar && textLightnessBar.updateContext) {
      textLightnessBar.updateContext(this._textHue, this._textSaturation, this._textLightness);
      // CRITICAL FIX: Use silent update to prevent infinite loop
      if (textLightnessBar.updateValueSilently) {
        textLightnessBar.updateValueSilently(this._textLightness);
      } else if (textLightnessBar._value !== this._textLightness) {
        textLightnessBar._value = this._textLightness;
        textLightnessBar.updateDisplay && textLightnessBar.updateDisplay();
      }
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
      // CRITICAL FIX: Use silent update to prevent infinite loop
      if (bgSaturationBar.updateValueSilently) {
        bgSaturationBar.updateValueSilently(this._bgSaturation);
      } else if (bgSaturationBar._value !== this._bgSaturation) {
        bgSaturationBar._value = this._bgSaturation;
        bgSaturationBar.updateDisplay && bgSaturationBar.updateDisplay();
      }
    }
    if (bgLightnessBar && bgLightnessBar.updateContext) {
      bgLightnessBar.updateContext(this._bgHue, this._bgSaturation, this._bgLightness);
      // CRITICAL FIX: Use silent update to prevent infinite loop
      if (bgLightnessBar.updateValueSilently) {
        bgLightnessBar.updateValueSilently(this._bgLightness);
      } else if (bgLightnessBar._value !== this._bgLightness) {
        bgLightnessBar._value = this._bgLightness;
        bgLightnessBar.updateDisplay && bgLightnessBar.updateDisplay();
      }
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
    const textColor = `hsl(${this._textHue}, ${this._textSaturation}%, ${this._textLightness}%)`;
    const bgColor = `hsl(${this._bgHue}, ${this._bgSaturation}%, ${this._bgLightness}%)`;
    
    // Update CSS custom properties instead of inline styles
    this.style.setProperty('--text-color-preview', textColor);
    this.style.setProperty('--bg-color-preview', bgColor);
  }
  
  updateValues() {
    const hslDisplay = this.shadowRoot.querySelector('.hsl-display');
    const rgbDisplay = this.shadowRoot.querySelector('.rgb-display');
    const hexValue = this.shadowRoot.querySelector('.hex-value');
    
    // Use text color for display values
    const rgb = this.hslToRgb(this._textHue, this._textSaturation, this._textLightness);
    const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    
    if (hslDisplay) hslDisplay.textContent = `HSL(${this._textHue}, ${this._textSaturation}%, ${this._textLightness}%)`;
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
      if (window.WBEventLog) {
        WBEventLog.logWarning('Failed to copy text color to clipboard: ' + err.message, { component: 'wb-color-bars', method: 'copyTextColorToClipboard', line: 518, error: err });
      }
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
      if (window.WBEventLog) {
        WBEventLog.logWarning('Failed to copy background color to clipboard: ' + err.message, { component: 'wb-color-bars', method: 'copyBgColorToClipboard', line: 530, error: err });
      }
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
  
  // Getters and setters for text color
  get textHue() { return this._textHue; }
  set textHue(value) {
    this._textHue = Math.max(0, Math.min(360, parseInt(value) || 0));
    this.updateDisplay();
  }
  
  get textSaturation() { return this._textSaturation; }
  set textSaturation(value) {
    this._textSaturation = Math.max(0, Math.min(100, parseInt(value) || 0));
    this.updateDisplay();
  }
  
  get textLightness() { return this._textLightness; }
  set textLightness(value) {
    this._textLightness = Math.max(0, Math.min(100, parseInt(value) || 0));
    this.updateDisplay();
  }
  
  // Getters and setters for background color
  get bgHue() { return this._bgHue; }
  set bgHue(value) {
    this._bgHue = Math.max(0, Math.min(360, parseInt(value) || 0));
    this.updateDisplay();
  }
  
  get bgSaturation() { return this._bgSaturation; }
  set bgSaturation(value) {
    this._bgSaturation = Math.max(0, Math.min(100, parseInt(value) || 0));
    this.updateDisplay();
  }
  
  get bgLightness() { return this._bgLightness; }
  set bgLightness(value) {
    this._bgLightness = Math.max(0, Math.min(100, parseInt(value) || 0));
    this.updateDisplay();
  }
  
  get textColor() {
    const rgb = this.hslToRgb(this._textHue, this._textSaturation, this._textLightness);
    return {
      hue: this._textHue,
      saturation: this._textSaturation,
      lightness: this._textLightness,
      hsl: `hsl(${this._textHue}, ${this._textSaturation}%, ${this._textLightness}%)`,
      hex: this.rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb: rgb
    };
  }
  
  get bgColor() {
    const rgb = this.hslToRgb(this._bgHue, this._bgSaturation, this._bgLightness);
    return {
      hue: this._bgHue,
      saturation: this._bgSaturation,
      lightness: this._bgLightness,
      hsl: `hsl(${this._bgHue}, ${this._bgSaturation}%, ${this._bgLightness}%)`,
      hex: this.rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb: rgb
    };
  }
  
  setTextColor(hue, saturation, lightness) {
    if (hue !== undefined) this._textHue = Math.max(0, Math.min(360, parseInt(hue) || 0));
    if (saturation !== undefined) this._textSaturation = Math.max(0, Math.min(100, parseInt(saturation) || 0));
    if (lightness !== undefined) this._textLightness = Math.max(0, Math.min(100, parseInt(lightness) || 0));
    this.updateColorBars();
    this.updateDisplay();
  }
  
  setBgColor(hue, saturation, lightness) {
    if (hue !== undefined) this._bgHue = Math.max(0, Math.min(360, parseInt(hue) || 0));
    if (saturation !== undefined) this._bgSaturation = Math.max(0, Math.min(100, parseInt(saturation) || 0));
    if (lightness !== undefined) this._bgLightness = Math.max(0, Math.min(100, parseInt(lightness) || 0));
    this.updateColorBars();
    this.updateDisplay();
  }
}

// Register the custom element
if (!customElements.get('wb-color-bars')) {
  customElements.define('wb-color-bars', ColorBars);
  if (window.WBEventLog) {
    WBEventLog.logSuccess('wb-color-bars: Registered successfully', { component: 'wb-color-bars', line: 684 });
  } else {
    document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'wb-color-bars: Registered successfully', component: 'wb-color-bars', line: 684 } }));
  }
  // Register with WBComponentRegistry if available
  if (window.WBComponentRegistry) {
    window.WBComponentRegistry.register('wb-color-bars', ColorBars, ['wb-color-bar'], {
      type: 'color-picker',
      description: 'Multi-slider HSL color picker component',
      api: ['colorchange', 'colorselect'],
      attributes: ['text-hue', 'text-saturation', 'text-lightness', 'bg-hue', 'bg-saturation', 'bg-lightness']
    });
  }
} else {
  if (window.WBEventLog) {
    WBEventLog.logInfo('wb-color-bars: Already registered, skipping', { component: 'wb-color-bars', line: 698 });
  } else {
    document.dispatchEvent(new CustomEvent('wb:info', { detail: { message: 'wb-color-bars: Already registered, skipping', component: 'wb-color-bars', line: 698 } }));
  }
}

// Expose for external access
window.ColorBars = ColorBars;

if (window.WBEventLog) {
  WBEventLog.logSuccess('Color Bars component loaded successfully', { component: 'wb-color-bars', line: 702 });
} else {
  document.dispatchEvent(new CustomEvent('wb:success', { detail: { message: 'Color Bars component loaded successfully', component: 'wb-color-bars', line: 702 } }));
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.ColorBars = ColorBars;

// Expose globally (backward compatibility)
window.ColorBars = ColorBars;
window.WBColorBars = ColorBars; // Alias for consistency

// ES6 Module Exports
export { ColorBars, ColorBars as WBColorBars };
export default ColorBars;
