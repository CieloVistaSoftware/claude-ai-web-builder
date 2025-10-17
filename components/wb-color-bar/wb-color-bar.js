/**
 * Color Bar Web Component
 * A reusable color picker component based on the Material Design Color Picker
 * 
 * Features:
 * - Interactive color slider with hue selection
 * - Mouse, touch, and keyboard support
 * - Material Design 3 compliant color generation
 * - Custom events for color changes
 * - Accessibility features
 * - Theme support
 * 
 * Usage:
 * <color-bar hue="240" saturation="70" lightness="50"></color-bar>
 * 
 * Events:
 * - colorchange: Fired when color changes
 * - colorselect: Fired when user finishes selecting a color
 */

class ColorBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default values
    this._hue = 240;
    this._saturation = 70;
    this._lightness = 50;
    this._isDragging = false;
    this._type = 'hue'; // 'hue', 'saturation', 'lightness'
    this._value = 50; // Generic value for saturation/lightness types
    
    // Bind methods
    this.handleColorBarClick = this.handleColorBarClick.bind(this);
    this.handleColorBarTouch = this.handleColorBarTouch.bind(this);
    this.startDragging = this.startDragging.bind(this);
    this.startDraggingTouch = this.startDraggingTouch.bind(this);
    this.handleDragging = this.handleDragging.bind(this);
    this.handleDraggingTouch = this.handleDraggingTouch.bind(this);
    this.stopDragging = this.stopDragging.bind(this);
    this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
  }
  
  static get observedAttributes() {
    return ['hue', 'saturation', 'lightness', 'disabled', 'theme', 'type', 'value'];
  }
  
  connectedCallback() {
    // Initialize type from attribute
    this._type = this.getAttribute('type') || 'hue';
    this._value = parseInt(this.getAttribute('value')) || 50;
    
    this.render();
    this.setupEventListeners();
    this.updateBarGradient();
    this.updateDisplay();
    
    // Log component initialization for wb-event-log integration
    this.logEvent('info', 'wb-color-bar component initialized', {
      type: this._type,
      value: this._value
    });
    
    // Make the host element focusable and delegate focus to internal element
    this.tabIndex = 0;
    this.addEventListener('focus', () => {
      const colorBar = this.shadowRoot.querySelector('.color-bar');
      if (colorBar) {
        colorBar.focus();
      }
    });
  }
  
  disconnectedCallback() {
    this.removeEventListeners();
    
    // Log component cleanup for wb-event-log integration
    this.logEvent('info', 'wb-color-bar component disconnected');
  }
  
  /**
   * Log events for wb-event-log integration
   * @param {string} type - Event type (info, warning, error)
   * @param {string} message - Event message
   * @param {Object} details - Additional event details
   */
  logEvent(type, message, details = {}) {
    if (typeof document !== 'undefined' && document.dispatchEvent) {
      document.dispatchEvent(new CustomEvent(`wb:${type}`, {
        detail: { 
          message: message,
          source: 'wb-color-bar',
          component: this.tagName.toLowerCase(),
          timestamp: new Date().toISOString(),
          ...details
        }
      }));
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'hue':
        this._hue = Math.max(0, Math.min(360, parseInt(newValue) || 0));
        break;
      case 'saturation':
        this._saturation = Math.max(0, Math.min(100, parseInt(newValue) || 70));
        break;
      case 'lightness':
        this._lightness = Math.max(0, Math.min(100, parseInt(newValue) || 50));
        break;
      case 'disabled':
        this.updateDisabledState();
        break;
      case 'theme':
        this.updateTheme();
        break;
      case 'type':
        this._type = newValue || 'hue';
        if (this.shadowRoot) {
          this.updateBarGradient();
        }
        break;
      case 'value':
        this._value = Math.max(0, Math.min(100, parseInt(newValue) || 50));
        break;
    }
    
    if (this.shadowRoot) {
      this.updateDisplay();
    }
  }
  
  render() {
    // CSS-first approach - external stylesheet with dynamic path resolution
    const cssPath = '/components/wb-color-bar/wb-color-bar.css';
    
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${cssPath}">
      
      <style>
        :host {
          display: block;
          --color-bar-height: 1.5rem;
          --pointer-size: 1.125rem;
          --transition-speed: 0.2s;
          --text-primary: var(--neutral-900, #333);
          --text-secondary: var(--neutral-700, #666);
          --bg-primary: var(--neutral-50, white);
          --pointer-border: var(--neutral-900, #333);
          --focus-color: var(--primary, #007bff);
        }
        
        .color-bar-label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--text-primary, #333);
        }
        
        .color-bar {
          position: relative;
          height: var(--color-bar-height);
          border-radius: calc(var(--color-bar-height) / 2);
          cursor: pointer;
          overflow: hidden;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
          /* Background will be set dynamically based on type */
          outline: none;
          transition: box-shadow var(--transition-speed) ease;
        }
        
        .color-bar:focus {
          box-shadow: inset 0 2px 8px rgba(var(--neutral-900-rgb, 0, 0, 0), 0.1), 0 0 0 2px var(--focus-color, var(--primary, #007bff));
        }
        
        .color-pointer {
          position: absolute;
          top: 50%;
          left: var(--pointer-position, 50%);
          width: var(--pointer-size);
          height: var(--pointer-size);
          background: var(--bg-primary, white);
          border: 3px solid var(--pointer-border, #333);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          cursor: grab;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all var(--transition-speed) ease;
          z-index: 2;
        }
        
        .color-pointer:hover {
          transform: translate(-50%, -50%) scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        
        .color-pointer:active,
        .color-pointer.dragging {
          cursor: grabbing;
          transform: translate(-50%, -50%) scale(1.1);
        }
        
        .color-pointer::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--current-color, #6750a4);
          border: 1px solid rgba(var(--neutral-900-rgb, 0, 0, 0), 0.2);
        }
        
        .color-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 12px;
        }
        
        .hue-value {
          font-weight: 500;
          color: var(--text-secondary, #666);
        }
        
        .color-preview {
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 11px;
          font-weight: bold;
          color: var(--text-primary-inverse, white);
          background: var(--current-color, #6750a4);
          text-shadow: 0 1px 2px rgba(var(--neutral-900-rgb, 0, 0, 0), 0.5);
          cursor: pointer;
          transition: all var(--transition-speed) ease;
        }
        
        .color-preview:hover {
          transform: scale(1.05);
        }
        
        /* Dark theme support */
        :host([theme="dark"]) {
          --text-primary: var(--neutral-100, #e6e1e5);
          --text-secondary: var(--neutral-300, #cac4d0);
          --pointer-border: var(--neutral-100, #e6e1e5);
          --focus-color: var(--primary-light, #d0bcff);
        }
        
        /* Minimal/Clean theme - no Material Design elements */
        :host([theme="minimal"]) {
          --color-bar-height: 0.7rem;
          --pointer-size: 0.9rem;
          --border-radius: 0.2rem;
          --text-primary: var(--neutral-700, #333);
          --text-secondary: var(--neutral-500, #666);
          --pointer-border: var(--neutral-700, #333);
          --focus-color: var(--primary, #0066cc);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        }
        
        :host([theme="minimal"]) .color-bar-label {
          font-size: 12px;
          font-weight: normal;
          margin-bottom: 6px;
        }
        
        :host([theme="minimal"]) .color-bar {
          border-radius: 4px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        :host([theme="minimal"]) .color-pointer {
          width: 18px;
          height: 18px;
          border: 2px solid var(--neutral-700, #333);
          box-shadow: 0 1px 4px rgba(var(--neutral-900-rgb, 0, 0, 0), 0.3);
        }
        
        :host([theme="minimal"]) .color-info {
          font-size: 11px;
          margin-top: 6px;
        }
        
        :host([theme="minimal"]) .color-preview {
          padding: 2px 6px;
          border-radius: 2px;
          font-size: 10px;
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .color-pointer {
            border-width: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
        
        /* Utility classes for inline style replacements */
        body.color-bar-no-select {
          user-select: none;
        }
        
        .color-pointer.positioned {
          /* Position is set using CSS variable */
          left: var(--pointer-position);
        }
        
        .color-preview.preview-color {
          /* Background color is set using CSS variable */
          background-color: var(--preview-color);
        }
      </style>
      
      <div class="color-bar-container">
        <div class="color-bar-label">
          <slot name="label">Saturation</slot>
        </div>
        <div class="color-bar" tabindex="0" role="slider" 
             aria-valuemin="0" aria-valuemax="360" aria-valuenow="240"
             aria-label="Color hue selector">
          <div class="color-pointer"></div>
        </div>
        <div class="color-info">
          <span class="hue-value"><span class="value-label">Hue:</span> <span class="hue-number">240°</span></span>
          <span class="color-preview" title="Click to copy color">#6366f1</span>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    const colorBar = this.shadowRoot.querySelector('.color-bar');
    const colorPointer = this.shadowRoot.querySelector('.color-pointer');
    const colorPreview = this.shadowRoot.querySelector('.color-preview');
    
    // Mouse events
    colorBar.addEventListener('mousedown', this.handleColorBarClick);
    colorPointer.addEventListener('mousedown', this.startDragging);
    document.addEventListener('mousemove', this.handleDragging);
    document.addEventListener('mouseup', this.stopDragging);
    
    // Touch events for mobile
    colorBar.addEventListener('touchstart', this.handleColorBarTouch, { passive: false });
    colorPointer.addEventListener('touchstart', this.startDraggingTouch, { passive: false });
    document.addEventListener('touchmove', this.handleDraggingTouch, { passive: false });
    document.addEventListener('touchend', this.stopDragging);
    
    // Keyboard accessibility
    colorBar.addEventListener('keydown', this.handleKeyboardNavigation);
    
    // Focus/blur handling for keyboard navigation
    colorBar.addEventListener('focus', () => {
      // Keyboard navigation now enabled
    });
    
    colorBar.addEventListener('blur', () => {
      // Keyboard navigation now disabled  
    });
    
    // Color preview click to copy
    colorPreview.addEventListener('click', this.copyColorToClipboard.bind(this));
  }
  
  removeEventListeners() {
    document.removeEventListener('mousemove', this.handleDragging);
    document.removeEventListener('mouseup', this.stopDragging);
    document.removeEventListener('touchmove', this.handleDraggingTouch);
    document.removeEventListener('touchend', this.stopDragging);
    
    // Remove keyboard listener from color bar
    const colorBar = this.shadowRoot.querySelector('.color-bar');
    if (colorBar) {
      colorBar.removeEventListener('keydown', this.handleKeyboardNavigation);
    }
  }
  
  handleColorBarClick(event) {
    event.preventDefault();
    
    // Focus the color bar for keyboard navigation
    event.currentTarget.focus();
    // Color bar focused for keyboard navigation
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    this.updateColorFromPercentage(percentage);
    this.startDragging(event);
  }
  
  handleColorBarTouch(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = event.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    this.updateColorFromPercentage(percentage);
    this._isDragging = true;
  }
  
  startDragging(event) {
    event.preventDefault();
    this._isDragging = true;
    document.body.classList.add('color-bar-no-select');
    this.shadowRoot.querySelector('.color-pointer').classList.add('dragging');
  }
  
  startDraggingTouch(event) {
    event.preventDefault();
    this._isDragging = true;
    document.body.classList.add('color-bar-no-select');
    this.shadowRoot.querySelector('.color-pointer').classList.add('dragging');
  }
  
  handleDragging(event) {
    if (!this._isDragging) return;
    
    event.preventDefault();
    const colorBar = this.shadowRoot.querySelector('.color-bar');
    const rect = colorBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    this.updateColorFromPercentage(percentage);
  }
  
  handleDraggingTouch(event) {
    if (!this._isDragging) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    const colorBar = this.shadowRoot.querySelector('.color-bar');
    const rect = colorBar.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    this.updateColorFromPercentage(percentage);
  }
  
  stopDragging() {
    if (!this._isDragging) return;
    
    this._isDragging = false;
    document.body.classList.remove('color-bar-no-select');
    this.shadowRoot.querySelector('.color-pointer').classList.remove('dragging');
    
    // Fire colorselect event when user finishes selecting
    this.dispatchEvent(new CustomEvent('colorselect', {
      detail: this.getColorData(),
      bubbles: true
    }));
  }
  
  handleKeyboardNavigation(event) {
    const step = event.shiftKey ? 10 : 1;
    
    switch(event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        this.adjustValue(-step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        this.adjustValue(step);
        break;
      case 'Home':
        event.preventDefault();
        this.jumpToStart();
        break;
      case 'End':
        event.preventDefault();
        this.jumpToEnd();
        break;
    }
  }
  
  adjustValue(step) {
    switch (this._type) {
      case 'hue':
        this._hue = Math.max(0, Math.min(360, this._hue + step));
        break;
      case 'saturation':
        this._value = Math.max(0, Math.min(100, this._value + step));
        break;
      case 'lightness':
        this._value = Math.max(0, Math.min(100, this._value + step));
        break;
    }
    this.updateBarGradient();
    this.updateDisplay();
    this.fireColorChangeEvent();
  }
  
  jumpToStart() {
    switch (this._type) {
      case 'hue':
        this._hue = 0;
        break;
      case 'saturation':
      case 'lightness':
        this._value = 0;
        break;
    }
    this.updateBarGradient();
    this.updateDisplay();
    this.fireColorChangeEvent();
  }
  
  jumpToEnd() {
    switch (this._type) {
      case 'hue':
        this._hue = 360;
        break;
      case 'saturation':
      case 'lightness':
        this._value = 100;
        break;
    }
    this.updateBarGradient();
    this.updateDisplay();
    this.fireColorChangeEvent();
  }
  
  updateColorFromPercentage(percentage) {
    switch (this._type) {
      case 'hue':
        this._hue = (percentage / 100) * 360;
        break;
      case 'saturation':
        this._value = percentage;
        break;
      case 'lightness':
        this._value = percentage;
        break;
    }
    this.updateDisplay();
    this.fireColorChangeEvent();
  }
  
  updateBarGradient() {
    const colorBar = this.shadowRoot.querySelector('.color-bar');
    if (!colorBar) return;
    
    let gradient;
    
    switch (this._type) {
      case 'hue':
        gradient = `linear-gradient(
          to right,
          #ff0000 0%,
          #ff8000 8.33%,
          #ffff00 16.66%,
          #80ff00 25%,
          #00ff00 33.33%,
          #00ff80 41.66%,
          #00ffff 50%,
          #0080ff 58.33%,
          #0000ff 66.66%,
          #8000ff 75%,
          #ff00ff 83.33%,
          #ff0080 91.66%,
          #ff0000 100%
        )`;
        break;
      case 'saturation':
        gradient = `linear-gradient(to right, 
          hsl(${this._hue}, 0%, ${this._lightness}%), 
          hsl(${this._hue}, 100%, ${this._lightness}%))`;
        break;
      case 'lightness':
        gradient = `linear-gradient(to right, 
          hsl(${this._hue}, ${this._saturation}%, 0%), 
          hsl(${this._hue}, ${this._saturation}%, 50%), 
          hsl(${this._hue}, ${this._saturation}%, 100%))`;
        break;
    }
    
    colorBar.style.background = gradient;
  }
  
  updateDisplay() {
    const colorBar = this.shadowRoot.querySelector('.color-bar');
    const colorPointer = this.shadowRoot.querySelector('.color-pointer');
    const hueNumber = this.shadowRoot.querySelector('.hue-number');
    const colorPreview = this.shadowRoot.querySelector('.color-preview');
    
    if (!colorBar || !colorPointer || !hueNumber || !colorPreview) return;
    
    // Update pointer position based on type
    let percentage, currentValue, displayText, currentColor;
    
    switch (this._type) {
      case 'hue':
        percentage = (this._hue / 360) * 100;
        currentValue = this._hue;
        displayText = `${Math.round(this._hue)}°`;
        currentColor = this.hslToHex(this._hue, this._saturation, this._lightness);
        colorBar.setAttribute('aria-valuenow', Math.round(this._hue).toString());
        colorBar.setAttribute('aria-valuemin', '0');
        colorBar.setAttribute('aria-valuemax', '360');
        break;
      case 'saturation':
        percentage = this._value;
        currentValue = this._value;
        displayText = `${Math.round(this._value)}%`;
        currentColor = this.hslToHex(this._hue, this._value, this._lightness);
        colorBar.setAttribute('aria-valuenow', Math.round(this._value).toString());
        colorBar.setAttribute('aria-valuemin', '0');
        colorBar.setAttribute('aria-valuemax', '100');
        break;
      case 'lightness':
        percentage = this._value;
        currentValue = this._value;
        displayText = `${Math.round(this._value)}%`;
        currentColor = this.hslToHex(this._hue, this._saturation, this._value);
        colorBar.setAttribute('aria-valuenow', Math.round(this._value).toString());
        colorBar.setAttribute('aria-valuemin', '0');
        colorBar.setAttribute('aria-valuemax', '100');
        break;
    }
    
    // Update pointer position
    colorPointer.style.setProperty('--pointer-position', `${percentage}%`);
    colorPointer.classList.add('positioned');
    
    // Set custom property on the host element
    this.style.setProperty('--current-color', currentColor);
    
    // Update displays
    hueNumber.textContent = displayText;
    
    // Update the label based on type
    const valueLabel = this.shadowRoot.querySelector('.value-label');
    if (valueLabel) {
      switch (this._type) {
        case 'hue':
          valueLabel.textContent = 'Hue:';
          break;
        case 'saturation':
          valueLabel.textContent = 'Saturation:';
          break;
        case 'lightness':
          valueLabel.textContent = 'Lightness:';
          break;
      }
    }
    
    colorPreview.textContent = currentColor.toUpperCase();
    colorPreview.style.setProperty('--preview-color', currentColor);
    colorPreview.classList.add('preview-color');
  }
  
  fireColorChangeEvent() {
    const colorData = this.getColorData();
    // Color change event fired successfully
    this.dispatchEvent(new CustomEvent('colorchange', {
      detail: colorData,
      bubbles: true
    }));

    // Emit harmony palette event using harmonic-color-mixer logic
    const palette = this.generateHarmonyPalette();
    this.dispatchEvent(new CustomEvent('wb:color-harmony-change', {
      detail: { base: colorData, palette },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Generate a harmony palette using logic from harmonic-color-mixer
   * Returns an array of color objects (hue, saturation, lightness, hex, name, role)
   */
  generateHarmonyPalette(harmonyType = 'complementary') {
    // Use current HSL as base
    const h = Math.round(this._hue);
    const s = Math.round(this._saturation);
    const l = Math.round(this._lightness);
    const palette = [];
    // Always include the primary color
    palette.push({
      name: 'Primary',
      hue: h,
      saturation: s,
      lightness: l,
      hex: this.hslToHex(h, s, l),
      role: 'Foundation color'
    });
    switch (harmonyType) {
      case 'monochromatic':
        palette.push(
          { name: 'Light', hue: h, saturation: Math.max(10, s - 20), lightness: Math.min(90, l + 25), hex: this.hslToHex(h, Math.max(10, s - 20), Math.min(90, l + 25)), role: 'Lighter variant' },
          { name: 'Dark', hue: h, saturation: Math.min(100, s + 10), lightness: Math.max(10, l - 25), hex: this.hslToHex(h, Math.min(100, s + 10), Math.max(10, l - 25)), role: 'Darker variant' },
          { name: 'Muted', hue: h, saturation: Math.max(10, s - 40), lightness: l, hex: this.hslToHex(h, Math.max(10, s - 40), l), role: 'Desaturated variant' }
        );
        break;
      case 'complementary':
        palette.push({
          name: 'Complement',
          hue: (h + 180) % 360,
          saturation: Math.max(50, s - 10),
          lightness: l,
          hex: this.hslToHex((h + 180) % 360, Math.max(50, s - 10), l),
          role: 'Maximum contrast'
        });
        break;
      case 'analogous':
        palette.push(
          { name: 'Analogous -30°', hue: (h - 30 + 360) % 360, saturation: s - 10, lightness: l + 5, hex: this.hslToHex((h - 30 + 360) % 360, s - 10, l + 5), role: 'Harmonious neighbor' },
          { name: 'Analogous +30°', hue: (h + 30) % 360, saturation: s - 10, lightness: l + 5, hex: this.hslToHex((h + 30) % 360, s - 10, l + 5), role: 'Harmonious neighbor' }
        );
        break;
      case 'triadic':
        palette.push(
          { name: 'Triadic 1', hue: (h + 120) % 360, saturation: s - 5, lightness: l, hex: this.hslToHex((h + 120) % 360, s - 5, l), role: '120° spacing' },
          { name: 'Triadic 2', hue: (h + 240) % 360, saturation: s - 5, lightness: l, hex: this.hslToHex((h + 240) % 360, s - 5, l), role: '240° spacing' }
        );
        break;
      case 'split':
        palette.push(
          { name: 'Split 1', hue: (h + 150) % 360, saturation: s - 10, lightness: l, hex: this.hslToHex((h + 150) % 360, s - 10, l), role: 'Split complement' },
          { name: 'Split 2', hue: (h + 210) % 360, saturation: s - 10, lightness: l, hex: this.hslToHex((h + 210) % 360, s - 10, l), role: 'Split complement' }
        );
        break;
      case 'square':
        palette.push(
          { name: 'Square 1', hue: (h + 90) % 360, saturation: s - 5, lightness: l, hex: this.hslToHex((h + 90) % 360, s - 5, l), role: '90° spacing' },
          { name: 'Square 2', hue: (h + 180) % 360, saturation: s - 5, lightness: l, hex: this.hslToHex((h + 180) % 360, s - 5, l), role: '180° spacing' },
          { name: 'Square 3', hue: (h + 270) % 360, saturation: s - 5, lightness: l, hex: this.hslToHex((h + 270) % 360, s - 5, l), role: '270° spacing' }
        );
        break;
      default:
        // Default to complementary
        palette.push({
          name: 'Complement',
          hue: (h + 180) % 360,
          saturation: Math.max(50, s - 10),
          lightness: l,
          hex: this.hslToHex((h + 180) % 360, Math.max(50, s - 10), l),
          role: 'Maximum contrast'
        });
        break;
    }
    return palette;
  }
  
  getColorData() {
    let saturation, lightness;
    
    switch (this._type) {
      case 'hue':
        saturation = this._saturation;
        lightness = this._lightness;
        break;
      case 'saturation':
        saturation = this._value;
        lightness = this._lightness;
        break;
      case 'lightness':
        saturation = this._saturation;
        lightness = this._value;
        break;
    }
    
    const hex = this.hslToHex(this._hue, saturation, lightness);
    return {
      hue: this._hue,
      saturation: saturation,
      lightness: lightness,
      value: this._value, // For saturation/lightness types
      type: this._type,
      hex: hex,
      hsl: `hsl(${Math.round(this._hue)}, ${saturation}%, ${lightness}%)`,
      rgb: this.hexToRgb(hex)
    };
  }
  
  async copyColorToClipboard() {
    const colorData = this.getColorData();
    try {
      await navigator.clipboard.writeText(colorData.hex);
      this.showCopyFeedback();
    } catch (err) {
      // Fallback for older browsers
      this.fallbackCopyToClipboard(colorData.hex);
    }
  }
  
  fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      this.showCopyFeedback();
    } catch (err) {
      // Log error to WBEventLog or dispatch event
      if (window.WBEventLog) {
        WBEventLog.logError('Failed to copy color to clipboard: ' + err.message, { component: 'wb-color-bar', method: 'copyToClipboard', line: 733, error: err });
      } else {
        document.dispatchEvent(new CustomEvent('wb:error', {
          detail: {
            message: 'Failed to copy color to clipboard: ' + err.message,
            component: 'wb-color-bar',
            method: 'copyToClipboard',
            line: 733,
            error: err
          }
        }));
      }
    } finally {
      document.body.removeChild(textArea);
    }
  }
  
  showCopyFeedback() {
    const colorPreview = this.shadowRoot.querySelector('.color-preview');
    const originalText = colorPreview.textContent;
    colorPreview.textContent = 'Copied!';
    setTimeout(() => {
      colorPreview.textContent = originalText;
    }, 1000);
  }
  
  updateDisabledState() {
    const colorBar = this.shadowRoot.querySelector('.color-bar');
    if (colorBar) {
      colorBar.tabIndex = this.hasAttribute('disabled') ? -1 : 0;
    }
  }
  
  updateTheme() {
    // Theme is handled via CSS custom properties and attribute selectors
  }
  
  // Utility methods
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  // Event logging utility using wb-event-log
  logEvent(type, message) {
    // Use WBEventLog static methods if available
    if (window.WBEventLog) {
      const logData = { 
        component: 'wb-color-bar',
        source: 'color-bar',
        hue: this._hue,
        type: this.getAttribute('type')
      };
      
      switch(type) {
        case 'info':
          WBEventLog.logInfo(`Color Bar: ${message}`, logData);
          break;
        case 'success':
          WBEventLog.logSuccess(`Color Bar: ${message}`, logData);
          break;
        case 'warning':
          WBEventLog.logWarning(`Color Bar: ${message}`, logData);
          break;
        case 'error':
          WBEventLog.logError(`Color Bar: ${message}`, logData);
          break;
        default:
          WBEventLog.logInfo(`Color Bar: ${message}`, logData);
      }
    } else {
      // Fallback: dispatch wb: events that wb-event-log listens for
      document.dispatchEvent(new CustomEvent(`wb:${type}`, {
        detail: { 
          message: `Color Bar: ${message}`,
          source: 'color-bar',
          component: this.tagName.toLowerCase(),
          hue: this._hue
        }
      }));
    }
  }

  // Public API
  get hue() { return this._hue; }
  set hue(value) { 
    this._hue = Math.max(0, Math.min(360, parseInt(value) || 0));
    this.updateBarGradient();
    this.updateDisplay();
    this.fireColorChangeEvent();
  }
  
  get saturation() { return this._saturation; }
  set saturation(value) { 
    this._saturation = Math.max(0, Math.min(100, parseInt(value) || 70));
    this.updateBarGradient();
    this.updateDisplay();
    this.fireColorChangeEvent();
  }
  
  get lightness() { return this._lightness; }
  set lightness(value) { 
    this._lightness = Math.max(0, Math.min(100, parseInt(value) || 50));
    this.updateBarGradient();
    this.updateDisplay();
    this.fireColorChangeEvent();
  }
  
  get value() { return this._value; }
  set value(val) {
    this._value = Math.max(0, Math.min(100, parseInt(val) || 50));
    this.updateDisplay();
    this.fireColorChangeEvent();
  }
  
  // CRITICAL FIX: Silent value update to prevent infinite loops
  updateValueSilently(val) {
    this._value = Math.max(0, Math.min(100, parseInt(val) || 50));
    this.updateDisplay();
    // Deliberately NOT calling fireColorChangeEvent() to break infinite loop
  }
  
  get type() { return this._type; }
  set type(newType) {
    this._type = newType || 'hue';
    this.updateBarGradient();
    this.updateDisplay();
  }
  
  get color() { return this.getColorData(); }
  
  setColor(hue, saturation = this._saturation, lightness = this._lightness) {
    this._hue = Math.max(0, Math.min(360, parseInt(hue) || 0));
    this._saturation = Math.max(0, Math.min(100, parseInt(saturation) || 70));
    this._lightness = Math.max(0, Math.min(100, parseInt(lightness) || 50));
    this.updateBarGradient();
    this.updateDisplay();
    this.fireColorChangeEvent();
  }
  
  // Method to update context for saturation/lightness gradients
  updateContext(hue, saturation, lightness) {
    this._hue = hue !== undefined ? hue : this._hue;
    this._saturation = saturation !== undefined ? saturation : this._saturation;
    this._lightness = lightness !== undefined ? lightness : this._lightness;
    this.updateBarGradient();
    this.updateDisplay();
  }
  
  // Color conversion utilities
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
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}

// Register the custom element

customElements.define('wb-color-bar', ColorBar);

if (window.WBEventLog) {
  WBEventLog.logSuccess('wb-color-bar: Registered successfully', { component: 'wb-color-bar', line: 891 });
} else {
  document.dispatchEvent(new CustomEvent('wb:success', {
    detail: {
      message: 'wb-color-bar: Registered successfully',
      component: 'wb-color-bar',
      line: 891
    }
  }));
}

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry) {
    window.WBComponentRegistry.register('wb-color-bar', ColorBar, [], {
        type: 'color-input',
        description: 'Single HSL color slider component',
        api: ['colorchange', 'colorselect', 'colorcopied'],
        attributes: ['type', 'hue', 'saturation', 'lightness', 'value', 'disabled', 'theme']
    });
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBColorBar = WBColorBar;

// Expose globally (backward compatibility)
window.WBColorBar = WBColorBar;

// ES6 Module Exports
export { WBColorBar };
export default WBColorBar;