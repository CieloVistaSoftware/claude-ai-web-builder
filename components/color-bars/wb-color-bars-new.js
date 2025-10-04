/**
 * Color Bars Web Component - 6 Bar Version
 * Controls both text color and background color with separate HSL controls
 * 
 * Features:
 * - 6 color bars total: 3 for text color + 3 for background color
 * - Dynamic saturation/lightness gradients based on hue
 * - Real-time color application to page elements
 * - Proper event dispatching for color changes
 */

class ColorBars extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Initialize text color HSL values
    this._textHue = parseInt(this.getAttribute('text-hue')) || 240;
    this._textSaturation = parseInt(this.getAttribute('text-saturation')) || 70;
    this._textLightness = parseInt(this.getAttribute('text-lightness')) || 90;
    
    // Initialize background color HSL values  
    this._bgHue = parseInt(this.getAttribute('bg-hue')) || 240;
    this._bgSaturation = parseInt(this.getAttribute('bg-saturation')) || 40;
    this._bgLightness = parseInt(this.getAttribute('bg-lightness')) || 20;
    
    this.render();
  }
  
  static get observedAttributes() {
    return ['text-hue', 'text-saturation', 'text-lightness', 'bg-hue', 'bg-saturation', 'bg-lightness', 'disabled', 'theme'];
  }
  
  connectedCallback() {
    this.setupEventListeners();
    this.updateAllBars();
    
    // Dispatch initial color values
    setTimeout(() => {
      this.dispatchTextColorChange();
      this.dispatchBgColorChange();
    }, 500);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'text-hue':
        this._textHue = parseInt(newValue) || 240;
        break;
      case 'text-saturation':
        this._textSaturation = parseInt(newValue) || 70;
        break;
      case 'text-lightness':
        this._textLightness = parseInt(newValue) || 90;
        break;
      case 'bg-hue':
        this._bgHue = parseInt(newValue) || 240;
        break;
      case 'bg-saturation':
        this._bgSaturation = parseInt(newValue) || 40;
        break;
      case 'bg-lightness':
        this._bgLightness = parseInt(newValue) || 20;
        break;
    }
    
    if (this.shadowRoot) {
      this.updateAllBars();
    }
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .color-bars-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
          background: var(--bg-secondary, #2d3748);
          border-radius: 12px;
          border: 1px solid var(--border-color, #4a5568);
        }
        
        .color-group {
          padding: 16px;
          background: var(--bg-tertiary, #4a5568);
          border-radius: 8px;
          border: 1px solid var(--border-color, #4a5568);
        }
        
        .color-group h4 {
          margin: 0 0 16px 0;
          color: var(--text-primary, #e2e8f0);
          font-size: 16px;
          font-weight: 600;
        }
        
        .color-bar-wrapper {
          margin-bottom: 16px;
        }
        
        .color-bar-wrapper:last-child {
          margin-bottom: 0;
        }
        
        .color-preview {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }
        
        .color-swatch {
          flex: 1;
          height: 40px;
          border-radius: 6px;
          border: 2px solid var(--border-color, #4a5568);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
        }
        
        :host([theme="dark"]) {
          --bg-secondary: #2d3748;
          --bg-tertiary: #4a5568;
          --border-color: #4a5568;
          --text-primary: #e2e8f0;
        }
        
        :host([theme="light"]) {
          --bg-secondary: #f7fafc;
          --bg-tertiary: #edf2f7;
          --border-color: #e2e8f0;
          --text-primary: #2d3748;
        }
      </style>
      
      <div class="color-bars-container">
        <!-- Text Color Controls -->
        <div class="color-group">
          <h4>Text Color Controls</h4>
          
          <div class="color-bar-wrapper">
            <wb-color-bar id="text-hue-bar" type="hue" 
                         hue="${this._textHue}" 
                         saturation="${this._textSaturation}" 
                         lightness="${this._textLightness}" 
                         theme="${this.getAttribute('theme') || 'dark'}">
              <span slot="label">Text Hue</span>
            </wb-color-bar>
          </div>
          
          <div class="color-bar-wrapper">
            <wb-color-bar id="text-saturation-bar" type="saturation" 
                         hue="${this._textHue}" 
                         saturation="${this._textSaturation}" 
                         lightness="${this._textLightness}" 
                         value="${this._textSaturation}"
                         theme="${this.getAttribute('theme') || 'dark'}">
              <span slot="label">Text Saturation</span>
            </wb-color-bar>
          </div>
          
          <div class="color-bar-wrapper">
            <wb-color-bar id="text-lightness-bar" type="lightness" 
                         hue="${this._textHue}" 
                         saturation="${this._textSaturation}" 
                         lightness="${this._textLightness}" 
                         value="${this._textLightness}"
                         theme="${this.getAttribute('theme') || 'dark'}">
              <span slot="label">Text Lightness</span>
            </wb-color-bar>
          </div>
          
          <div class="color-preview">
            <div class="color-swatch" id="text-color-swatch">Text Color</div>
          </div>
        </div>
        
        <!-- Background Color Controls -->
        <div class="color-group">
          <h4>Background Color Controls</h4>
          
          <div class="color-bar-wrapper">
            <wb-color-bar id="bg-hue-bar" type="hue" 
                         hue="${this._bgHue}" 
                         saturation="${this._bgSaturation}" 
                         lightness="${this._bgLightness}" 
                         theme="${this.getAttribute('theme') || 'dark'}">
              <span slot="label">Background Hue</span>
            </wb-color-bar>
          </div>
          
          <div class="color-bar-wrapper">
            <wb-color-bar id="bg-saturation-bar" type="saturation" 
                         hue="${this._bgHue}" 
                         saturation="${this._bgSaturation}" 
                         lightness="${this._bgLightness}" 
                         value="${this._bgSaturation}"
                         theme="${this.getAttribute('theme') || 'dark'}">
              <span slot="label">Background Saturation</span>
            </wb-color-bar>
          </div>
          
          <div class="color-bar-wrapper">
            <wb-color-bar id="bg-lightness-bar" type="lightness" 
                         hue="${this._bgHue}" 
                         saturation="${this._bgSaturation}" 
                         lightness="${this._bgLightness}" 
                         value="${this._bgLightness}"
                         theme="${this.getAttribute('theme') || 'dark'}">
              <span slot="label">Background Lightness</span>
            </wb-color-bar>
          </div>
          
          <div class="color-preview">
            <div class="color-swatch" id="bg-color-swatch">Background Color</div>
          </div>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    // Wait for wb-color-bar components to be fully loaded
    setTimeout(() => {
      // Text color bar listeners
      const textHueBar = this.shadowRoot.querySelector('#text-hue-bar');
      const textSatBar = this.shadowRoot.querySelector('#text-saturation-bar');
      const textLightBar = this.shadowRoot.querySelector('#text-lightness-bar');
      
      // Background color bar listeners
      const bgHueBar = this.shadowRoot.querySelector('#bg-hue-bar');
      const bgSatBar = this.shadowRoot.querySelector('#bg-saturation-bar');
      const bgLightBar = this.shadowRoot.querySelector('#bg-lightness-bar');
      
      // Text color events
      if (textHueBar) {
        textHueBar.addEventListener('colorchange', (e) => {
          this._textHue = e.detail.hue;
          this.updateTextSaturationLightness();
          this.updateTextColorSwatch();
          this.dispatchTextColorChange();
        });
      }
      
      if (textSatBar) {
        textSatBar.addEventListener('colorchange', (e) => {
          this._textSaturation = e.detail.value || e.detail.saturation;
          this.updateTextColorSwatch();
          this.dispatchTextColorChange();
        });
      }
      
      if (textLightBar) {
        textLightBar.addEventListener('colorchange', (e) => {
          this._textLightness = e.detail.value || e.detail.lightness;
          this.updateTextColorSwatch();
          this.dispatchTextColorChange();
        });
      }
      
      // Background color events
      if (bgHueBar) {
        bgHueBar.addEventListener('colorchange', (e) => {
          this._bgHue = e.detail.hue;
          this.updateBgSaturationLightness();
          this.updateBgColorSwatch();
          this.dispatchBgColorChange();
        });
      }
      
      if (bgSatBar) {
        bgSatBar.addEventListener('colorchange', (e) => {
          this._bgSaturation = e.detail.value || e.detail.saturation;
          this.updateBgColorSwatch();
          this.dispatchBgColorChange();
        });
      }
      
      if (bgLightBar) {
        bgLightBar.addEventListener('colorchange', (e) => {
          this._bgLightness = e.detail.value || e.detail.lightness;
          this.updateBgColorSwatch();
          this.dispatchBgColorChange();
        });
      }
      
      // Initialize color swatches
      this.updateTextColorSwatch();
      this.updateBgColorSwatch();
      
    }, 1000);
  }
  
  updateAllBars() {
    setTimeout(() => {
      this.updateTextSaturationLightness();
      this.updateBgSaturationLightness();
      this.updateTextColorSwatch();
      this.updateBgColorSwatch();
    }, 100);
  }
  
  updateTextSaturationLightness() {
    const textSatBar = this.shadowRoot.querySelector('#text-saturation-bar');
    const textLightBar = this.shadowRoot.querySelector('#text-lightness-bar');
    
    if (textSatBar && textSatBar.updateContext) {
      textSatBar.updateContext(this._textHue, this._textSaturation, this._textLightness);
    }
    if (textLightBar && textLightBar.updateContext) {
      textLightBar.updateContext(this._textHue, this._textSaturation, this._textLightness);
    }
  }
  
  updateBgSaturationLightness() {
    const bgSatBar = this.shadowRoot.querySelector('#bg-saturation-bar');
    const bgLightBar = this.shadowRoot.querySelector('#bg-lightness-bar');
    
    if (bgSatBar && bgSatBar.updateContext) {
      bgSatBar.updateContext(this._bgHue, this._bgSaturation, this._bgLightness);
    }
    if (bgLightBar && bgLightBar.updateContext) {
      bgLightBar.updateContext(this._bgHue, this._bgSaturation, this._bgLightness);
    }
  }
  
  updateTextColorSwatch() {
    const textSwatch = this.shadowRoot.querySelector('#text-color-swatch');
    if (textSwatch) {
      const color = this.hslToHex(this._textHue, this._textSaturation, this._textLightness);
      const hsl = `hsl(${this._textHue}, ${this._textSaturation}%, ${this._textLightness}%)`;
      textSwatch.style.backgroundColor = color;
      textSwatch.style.color = this._textLightness > 50 ? '#000' : '#fff';
      textSwatch.textContent = color;
      textSwatch.title = hsl;
    }
  }
  
  updateBgColorSwatch() {
    const bgSwatch = this.shadowRoot.querySelector('#bg-color-swatch');
    if (bgSwatch) {
      const color = this.hslToHex(this._bgHue, this._bgSaturation, this._bgLightness);
      const hsl = `hsl(${this._bgHue}, ${this._bgSaturation}%, ${this._bgLightness}%)`;
      bgSwatch.style.backgroundColor = color;
      bgSwatch.style.color = this._bgLightness > 50 ? '#000' : '#fff';
      bgSwatch.textContent = color;
      bgSwatch.title = hsl;
    }
  }
  
  dispatchTextColorChange() {
    const textColorData = {
      hue: this._textHue,
      saturation: this._textSaturation,
      lightness: this._textLightness,
      hsl: `hsl(${this._textHue}, ${this._textSaturation}%, ${this._textLightness}%)`,
      hex: this.hslToHex(this._textHue, this._textSaturation, this._textLightness)
    };
    
    this.dispatchEvent(new CustomEvent('textcolorchange', {
      detail: textColorData,
      bubbles: true
    }));
    
    console.log('Text color changed:', textColorData);
  }
  
  dispatchBgColorChange() {
    const bgColorData = {
      hue: this._bgHue,
      saturation: this._bgSaturation,
      lightness: this._bgLightness,
      hsl: `hsl(${this._bgHue}, ${this._bgSaturation}%, ${this._bgLightness}%)`,
      hex: this.hslToHex(this._bgHue, this._bgSaturation, this._bgLightness)
    };
    
    this.dispatchEvent(new CustomEvent('bgcolorchange', {
      detail: bgColorData,
      bubbles: true
    }));
    
    console.log('Background color changed:', bgColorData);
  }
  
  hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / (1/12)) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };
    
    const r = f(0);
    const g = f(8);
    const b = f(4);
    
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  // Public API methods  
  getTextColor() {
    return {
      hue: this._textHue,
      saturation: this._textSaturation,
      lightness: this._textLightness,
      hsl: `hsl(${this._textHue}, ${this._textSaturation}%, ${this._textLightness}%)`,
      hex: this.hslToHex(this._textHue, this._textSaturation, this._textLightness)
    };
  }
  
  getBgColor() {
    return {
      hue: this._bgHue,
      saturation: this._bgSaturation,
      lightness: this._bgLightness,
      hsl: `hsl(${this._bgHue}, ${this._bgSaturation}%, ${this._bgLightness}%)`,
      hex: this.hslToHex(this._bgHue, this._bgSaturation, this._bgLightness)
    };
  }
}

// Register the web component
customElements.define('wb-color-bars', ColorBars);