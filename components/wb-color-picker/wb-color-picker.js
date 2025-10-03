/**
 * WB Color Picker Component
 * A customizable color picker with accessibility and theming support
 * Modern Web Component implementation
 */

class WBColorPicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Component state
    this._value = '#6366f1';
    this._format = 'hex';
    this._showAlpha = false;
    this._showPresets = true;
    this._disabled = false;
    this._isOpen = false;
    
    // Bind methods
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
  }

  static get observedAttributes() {
    return ['value', 'format', 'show-alpha', 'show-presets', 'disabled', 'label', 'size', 'variant'];
  }

  connectedCallback() {
    this.loadCSS();
    this.render();
    this.setupEventListeners();
    this.logEvent('info', 'Color picker initialized');
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.handleAttributeChange(name, newValue);
    }
  }

  loadCSS() {
    if (window.WBComponentUtils) {
      const cssPath = window.WBComponentUtils.getPath('wb-color-picker.js', 'wb-color-picker.css');
      window.WBComponentUtils.loadCSS('wb-color-picker', cssPath);
    } else {
      // Fallback CSS loading
      if (!document.querySelector('link[href*="wb-color-picker.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'wb-color-picker.css';
        document.head.appendChild(link);
      }
    }
  }

  // Property getters and setters
  get value() { return this._value; }
  set value(val) {
    this._value = val;
    this.setAttribute('value', val);
    this.updateDisplay();
    this.dispatchChangeEvent();
  }

  get format() { return this._format; }
  set format(val) {
    this._format = val;
    this.setAttribute('format', val);
    this.updateDisplay();
  }

  get showAlpha() { return this._showAlpha; }
  set showAlpha(val) {
    this._showAlpha = Boolean(val);
    if (val) {
      this.setAttribute('show-alpha', '');
    } else {
      this.removeAttribute('show-alpha');
    }
    this.render();
  }

  get disabled() { return this._disabled; }
  set disabled(val) {
    this._disabled = Boolean(val);
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
    this.updateTriggerState();
  }

  handleAttributeChange(name, value) {
    switch (name) {
      case 'value':
        this._value = value || '#6366f1';
        this.updateDisplay();
        break;
      case 'format':
        this._format = value || 'hex';
        this.updateDisplay();
        break;
      case 'show-alpha':
        this._showAlpha = value !== null;
        this.render();
        break;
      case 'show-presets':
        this._showPresets = value !== null;
        this.render();
        break;
      case 'disabled':
        this._disabled = value !== null;
        this.updateTriggerState();
        break;
      case 'label':
      case 'size':
      case 'variant':
        this.render();
        break;
    }
  }

  setupEventListeners() {
    // Make element focusable and add keyboard support
    this.tabIndex = 0;
    this.addEventListener('click', this.handleTriggerClick);
    this.addEventListener('keydown', this.handleKeydown);
    
    // Global event listeners for closing popup
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  removeEventListeners() {
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  render() {
    const label = this.getAttribute('label') || '';
    const size = this.getAttribute('size') || 'standard';
    const variant = this.getAttribute('variant') || 'primary';
    
    const classes = [
      'wb-color-picker',
      size !== 'standard' ? `wb-color-picker--${size}` : '',
      variant !== 'primary' ? `wb-color-picker--${variant}` : '',
      this._disabled ? 'wb-color-picker--disabled' : '',
      this._isOpen ? 'wb-color-picker--open' : ''
    ].filter(Boolean).join(' ');

    const colorValue = this.parseColor(this._value);
    const displayValue = this.formatColor(colorValue, this._format);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
        }
        
        :host([disabled]) {
          opacity: 0.6;
          pointer-events: none;
        }
        
        .wb-color-picker-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary, #1a1a1a);
        }
        
        .wb-color-picker {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          border-radius: 0.375rem;
          border: 1px solid var(--border-color, #d1d5db);
          background: var(--bg-primary, #ffffff);
          padding: 0.5rem;
          transition: all 0.2s ease;
        }
        
        .wb-color-picker:hover {
          border-color: var(--primary, #6366f1);
        }
        
        .wb-color-picker:focus-within {
          outline: 2px solid var(--primary, #6366f1);
          outline-offset: 2px;
        }
        
        .wb-color-picker-swatch {
          width: 2rem;
          height: 2rem;
          border-radius: 0.25rem;
          border: 1px solid var(--border-color, #d1d5db);
          overflow: hidden;
          position: relative;
        }
        
        .wb-color-picker-swatch-color {
          width: 100%;
          height: 100%;
          background: ${this._value};
        }
        
        .wb-color-picker-value {
          font-family: var(--font-mono, 'Monaco', 'Consolas', monospace);
          font-size: 0.875rem;
          color: var(--text-primary, #1a1a1a);
          min-width: 5rem;
        }
        
        .wb-color-picker-popup {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 9999;
          background: var(--bg-primary, #ffffff);
          border: 1px solid var(--border-color, #d1d5db);
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          min-width: 280px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
        }
        
        .wb-color-picker--open .wb-color-picker-popup {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .wb-color-picker-wheel {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, 
            hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
            hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), 
            hsl(360, 100%, 50%));
          position: relative;
          margin: 1rem auto;
          cursor: pointer;
        }
        
        .wb-color-picker-presets {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.25rem;
          margin-top: 1rem;
        }
        
        .wb-color-picker-preset {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.25rem;
          border: 1px solid var(--border-color, #d1d5db);
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        
        .wb-color-picker-preset:hover {
          transform: scale(1.1);
        }
        
        .wb-color-picker-preset-color {
          width: 100%;
          height: 100%;
          border-radius: inherit;
        }
        
        /* Size variations */
        .wb-color-picker--small .wb-color-picker-swatch {
          width: 1.5rem;
          height: 1.5rem;
        }
        
        .wb-color-picker--large .wb-color-picker-swatch {
          width: 2.5rem;
          height: 2.5rem;
        }
      </style>
      
      ${label ? `<label class="wb-color-picker-label">${label}</label>` : ''}
      <div class="${classes}" 
           role="button"
           aria-haspopup="dialog"
           aria-expanded="${this._isOpen}"
           aria-label="Color picker"
           tabindex="0">
        <div class="wb-color-picker-trigger">
          <div class="wb-color-picker-swatch">
            <div class="wb-color-picker-swatch-color"></div>
          </div>
          <span class="wb-color-picker-value">${displayValue}</span>
        </div>
        <div class="wb-color-picker-popup">
          ${this.generatePickerContent(colorValue)}
        </div>
      </div>
    `;

    this.setupPickerEventListeners();
  }

  generatePickerContent(colorValue) {
    const hsl = this.rgbToHsl(colorValue.r, colorValue.g, colorValue.b);
    const presetColors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
      '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
      '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
      '#ec4899', '#f43f5e'
    ];
    
    return `
      <div class="wb-color-picker-wheel" data-hue="${hsl.h}" data-saturation="${hsl.s}" data-lightness="${hsl.l}">
        <div class="wb-color-picker-wheel-pointer" style="left: ${hsl.s}%; top: ${100 - hsl.l}%"></div>
      </div>
      
      ${this._showPresets ? `
        <div class="wb-color-picker-presets">
          ${presetColors.map(color => `
            <div class="wb-color-picker-preset" data-color="${color}" tabindex="0" role="button" aria-label="Preset color ${color}">
              <div class="wb-color-picker-preset-color" style="background-color: ${color}"></div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  }

  setupPickerEventListeners() {
    // Color wheel interactions
    const wheel = this.shadowRoot.querySelector('.wb-color-picker-wheel');
    if (wheel) {
      wheel.addEventListener('click', (e) => this.handleWheelClick(e));
    }

    // Preset color clicks
    const presets = this.shadowRoot.querySelectorAll('.wb-color-picker-preset');
    presets.forEach(preset => {
      preset.addEventListener('click', () => {
        this.value = preset.dataset.color;
        this.close();
        this.logEvent('user', `Selected preset color: ${preset.dataset.color}`);
      });
    });
  }

  handleTriggerClick(e) {
    if (this._disabled) return;
    e.stopPropagation();
    this.toggle();
  }

  handleKeydown(e) {
    if (this._disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggle();
    }
  }

  handleDocumentClick(e) {
    if (!this.contains(e.target)) {
      this.close();
    }
  }

  handleEscapeKey(e) {
    if (e.key === 'Escape' && this._isOpen) {
      this.close();
    }
  }

  handleWheelClick(e) {
    const wheel = e.currentTarget;
    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const distance = Math.min(Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)), rect.width / 2);
    
    const hue = (angle * 180 / Math.PI + 360) % 360;
    const saturation = (distance / (rect.width / 2)) * 100;
    const lightness = 50; // Default lightness
    
    const rgb = this.hslToRgb(hue / 360, saturation / 100, lightness / 100);
    const hexColor = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    
    this.value = hexColor;
    this.logEvent('user', `Selected color from wheel: ${hexColor}`);
  }

  updateDisplay() {
    const swatch = this.shadowRoot.querySelector('.wb-color-picker-swatch-color');
    const valueDisplay = this.shadowRoot.querySelector('.wb-color-picker-value');
    
    if (swatch) {
      swatch.style.backgroundColor = this._value;
    }
    
    if (valueDisplay) {
      const colorValue = this.parseColor(this._value);
      valueDisplay.textContent = this.formatColor(colorValue, this._format);
    }
  }

  updateTriggerState() {
    const trigger = this.shadowRoot.querySelector('.wb-color-picker');
    if (trigger) {
      trigger.classList.toggle('wb-color-picker--disabled', this._disabled);
    }
  }

  open() {
    if (this._disabled) return;
    this._isOpen = true;
    this.classList.add('wb-color-picker--open');
    const picker = this.shadowRoot.querySelector('.wb-color-picker');
    if (picker) {
      picker.classList.add('wb-color-picker--open');
      picker.setAttribute('aria-expanded', 'true');
    }
    this.dispatchEvent(new CustomEvent('wb-color-picker-open', { 
      detail: { value: this._value },
      bubbles: true 
    }));
    this.logEvent('info', 'Color picker opened');
  }

  close() {
    this._isOpen = false;
    this.classList.remove('wb-color-picker--open');
    const picker = this.shadowRoot.querySelector('.wb-color-picker');
    if (picker) {
      picker.classList.remove('wb-color-picker--open');
      picker.setAttribute('aria-expanded', 'false');
    }
    this.dispatchEvent(new CustomEvent('wb-color-picker-close', { 
      detail: { value: this._value },
      bubbles: true 
    }));
    this.logEvent('info', 'Color picker closed');
  }

  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('wb-color-picker-change', {
      detail: { 
        value: this._value, 
        color: this.parseColor(this._value) 
      },
      bubbles: true
    }));
    this.logEvent('user', `Color changed to: ${this._value}`);
  }

  logEvent(type, message) {
    // Integration with wb-event-log
    const eventLog = document.querySelector('wb-event-log');
    if (eventLog && eventLog.addEvent) {
      eventLog.addEvent(type, `Color Picker: ${message}`, { 
        source: 'wb-color-picker',
        component: this.tagName.toLowerCase(),
        value: this._value
      });
    } else {
      // Fallback to wb: events
      document.dispatchEvent(new CustomEvent(`wb:${type}`, {
        detail: { 
          message: `Color Picker: ${message}`,
          source: 'wb-color-picker',
          component: this.tagName.toLowerCase(),
          value: this._value
        }
      }));
    }
  }

  // Factory method for backward compatibility
  static create(options = {}) {
    const colorPicker = document.createElement('wb-color-picker');
    
    // Set attributes based on options
    if (options.value) colorPicker.setAttribute('value', options.value);
    if (options.label) colorPicker.setAttribute('label', options.label);
    if (options.format) colorPicker.setAttribute('format', options.format);
    if (options.size) colorPicker.setAttribute('size', options.size);
    if (options.variant) colorPicker.setAttribute('variant', options.variant);
    if (options.showAlpha) colorPicker.setAttribute('show-alpha', '');
    if (options.showPresets === false) colorPicker.removeAttribute('show-presets');
    if (options.disabled) colorPicker.setAttribute('disabled', '');
    
    // Add event listeners if provided
    if (options.onchange) {
      colorPicker.addEventListener('wb-color-picker-change', (e) => {
        options.onchange(e.detail.value, e.detail.color);
      });
    }
    
    if (options.oninput) {
      colorPicker.addEventListener('wb-color-picker-input', (e) => {
        options.oninput(e.detail.value, e.detail.color);
      });
    }
    
    return colorPicker;
  }

  // Color utility methods
  parseColor(colorString) {
    if (colorString.startsWith('#')) {
      return this.hexToRgb(colorString);
    } else if (colorString.startsWith('rgb')) {
      return this.parseRgb(colorString);
    } else if (colorString.startsWith('hsl')) {
      return this.parseHsl(colorString);
    }
    
    // Default fallback
    return { r: 99, g: 102, b: 241, a: 1 };
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 1
    } : { r: 0, g: 0, b: 0, a: 1 };
  }

  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  parseRgb(rgb) {
    const match = rgb.match(/rgba?\(([^)]+)\)/);
    if (!match) return { r: 0, g: 0, b: 0, a: 1 };
    
    const values = match[1].split(',').map(v => parseFloat(v.trim()));
    return {
      r: Math.round(values[0] || 0),
      g: Math.round(values[1] || 0),
      b: Math.round(values[2] || 0),
      a: values.length > 3 ? (values[3] || 1) : 1
    };
  }

  parseHsl(hsl) {
    const match = hsl.match(/hsla?\(([^)]+)\)/);
    if (!match) return { r: 0, g: 0, b: 0, a: 1 };
    
    const values = match[1].split(',').map(v => parseFloat(v.trim()));
    const rgb = this.hslToRgb(values[0] / 360, values[1] / 100, values[2] / 100);
    return {
      ...rgb,
      a: values.length > 3 ? (values[3] || 1) : 1
    };
  }

  hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: h * 360,
      s: s * 100,
      l: l * 100
    };
  }

  formatColor(colorValue, format) {
    switch (format) {
      case 'rgb':
        return colorValue.a < 1 
          ? `rgba(${colorValue.r}, ${colorValue.g}, ${colorValue.b}, ${colorValue.a})`
          : `rgb(${colorValue.r}, ${colorValue.g}, ${colorValue.b})`;
      case 'hsl':
        const hsl = this.rgbToHsl(colorValue.r, colorValue.g, colorValue.b);
        return colorValue.a < 1
          ? `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${colorValue.a})`
          : `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
      default: // hex
        return this.rgbToHex(colorValue.r, colorValue.g, colorValue.b);
    }
  }
}

// Register the Web Component
customElements.define('wb-color-picker', WBColorPicker);

// Backward compatibility API - maintain old API while using new Web Component
window.WBColorPicker = {
  create: (options) => WBColorPicker.create(options),
  setValue: (picker, value) => {
    if (picker && picker.tagName === 'WB-COLOR-PICKER') {
      picker.value = value;
    }
  },
  getValue: (picker, format) => {
    if (picker && picker.tagName === 'WB-COLOR-PICKER') {
      const currentFormat = format || picker.format;
      const colorValue = picker.parseColor(picker.value);
      return picker.formatColor(colorValue, currentFormat);
    }
    return '#6366f1';
  },
  setDisabled: (picker, disabled) => {
    if (picker && picker.tagName === 'WB-COLOR-PICKER') {
      picker.disabled = disabled;
    }
  },
  open: (picker) => {
    if (picker && picker.tagName === 'WB-COLOR-PICKER') {
      picker.open();
    }
  },
  close: (picker) => {
    if (picker && picker.tagName === 'WB-COLOR-PICKER') {
      picker.close();
    }
  },
  toggle: (picker) => {
    if (picker && picker.tagName === 'WB-COLOR-PICKER') {
      picker.toggle();
    }
  }
};