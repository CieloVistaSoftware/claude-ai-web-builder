/**
 * Color Transformer Component
 * WordPress color scheme transformer with hue shifting capabilities
 */

class ColorTransformer {
  constructor() {
    this.transformers = new Map();
    this.init();
  }

  init() {
    this.loadCSS();
    this.initializeExistingTransformers();
    this.setupGlobalEventListeners();
  }

  loadCSS() {
    if (window.WBComponentUtils) {
      const cssPath = window.WBComponentUtils.getPath('color-transformer.js', '../components/color-transformer/') + 'color-transformer.css';
      window.WBComponentUtils.loadCSS('color-transformer', cssPath);
    } else {
      // Fallback for when WBComponentUtils is not available
      if (!document.querySelector('link[href*="color-transformer.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'color-transformer.css';
        document.head.appendChild(link);
      }
    }
  }

  initializeExistingTransformers() {
    document.querySelectorAll('color-transformer').forEach(element => {
      if (!element.dataset.colorTransformerInitialized) {
        this.initializeTransformer(element);
      }
    });
  }

  setupGlobalEventListeners() {
    // Listen for wb-color-changed events from control panel
    document.addEventListener('wb-color-changed', (e) => {
      this.transformers.forEach((config, transformer) => {
        if (config.autoDetect && this.detectWordPress()) {
          this.transformColors(transformer, e.detail.color);
        }
      });
    });
  }

  create(options = {}) {
    const defaults = {
      id: `color-transformer-${Date.now()}`,
      variant: 'detailed',
      size: 'standard',
      showPreview: true,
      showStats: true,
      autoDetect: true,
      onTransform: null,
      onApply: null,
      onDetect: null
    };

    const config = { ...defaults, ...options };
    const wrapper = document.createElement('div');
    wrapper.className = 'color-transformer-wrapper';
    wrapper.innerHTML = this.generateHTML(config);

    const transformerElement = wrapper.querySelector('.color-transformer');
    this.initializeTransformer(transformerElement, config);

    return wrapper;
  }

  generateHTML(config) {
    const classes = [
      'color-transformer',
      config.size !== 'standard' ? `color-transformer--${config.size}` : '',
      config.variant !== 'detailed' ? `color-transformer--${config.variant}` : ''
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}" 
           data-variant="${config.variant}"
           data-auto-detect="${config.autoDetect}"
           role="region"
           aria-label="WordPress Color Transformer">
        
        <div class="color-transformer-header">
          <h3 class="color-transformer-title">WordPress Color Transformer</h3>
          <p class="color-transformer-description">
            Transform WordPress color schemes by shifting hues while maintaining relationships
          </p>
        </div>

        <div class="color-transformer-controls">
          <div class="color-transformer-picker">
            <label>Primary Color</label>
            <input type="color" 
                   id="${config.id}-color" 
                   value="#0693e3" 
                   class="color-transformer-color-input">
            <span class="color-transformer-color-value">#0693e3</span>
          </div>
          
          <div class="color-transformer-actions">
            <button class="color-transformer-button color-transformer-button--transform" type="button">
              Transform Colors
            </button>
            <button class="color-transformer-button color-transformer-button--apply" type="button" disabled>
              Apply to Document
            </button>
            <button class="color-transformer-button color-transformer-button--copy" type="button" disabled>
              Copy CSS
            </button>
          </div>
        </div>

        ${config.showStats ? this.generateStatsHTML() : ''}
        ${config.showPreview ? this.generatePreviewHTML() : ''}
        
        <div class="color-transformer-output" style="display: none;">
          <textarea readonly placeholder="Generated CSS will appear here..."></textarea>
        </div>
      </div>
    `;
  }

  generateStatsHTML() {
    return `
      <div class="color-transformer-stats">
        <div class="color-transformer-stat">
          <label>WordPress Detected</label>
          <span class="color-transformer-stat-value" data-stat="wordpress">Checking...</span>
        </div>
        <div class="color-transformer-stat">
          <label>Hue Shift</label>
          <span class="color-transformer-stat-value" data-stat="hue-shift">0°</span>
        </div>
        <div class="color-transformer-stat">
          <label>Colors Transformed</label>
          <span class="color-transformer-stat-value" data-stat="colors-count">0</span>
        </div>
      </div>
    `;
  }

  generatePreviewHTML() {
    return `
      <div class="color-transformer-preview">
        <h4>Color Preview</h4>
        <div class="color-transformer-colors">
          ${this.getWordPressColors().map(color => `
            <div class="color-transformer-color" data-color-name="${color.name}">
              <div class="color-transformer-color-swatch" style="background-color: ${color.value}"></div>
              <div class="color-transformer-color-info">
                <span class="color-transformer-color-name">${color.displayName}</span>
                <span class="color-transformer-color-value">${color.value}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  initializeTransformer(element, config = null) {
    if (element.dataset.colorTransformerInitialized) return;

    const transformerConfig = config || {
      variant: element.dataset.variant || 'detailed',
      autoDetect: element.dataset.autoDetect !== 'false',
      showPreview: !element.hasAttribute('hide-preview'),
      showStats: !element.hasAttribute('hide-stats'),
      onTransform: null,
      onApply: null
    };

    this.transformers.set(element, transformerConfig);

    // Initialize WordPress detection
    this.updateWordPressStatus(element);

    // Color input handling
    const colorInput = element.querySelector('.color-transformer-color-input');
    const colorValue = element.querySelector('.color-transformer-color-value');
    
    if (colorInput && colorValue) {
      colorInput.addEventListener('input', (e) => {
        colorValue.textContent = e.target.value;
      });
    }

    // Button event handlers
    const transformBtn = element.querySelector('.color-transformer-button--transform');
    const applyBtn = element.querySelector('.color-transformer-button--apply');
    const copyBtn = element.querySelector('.color-transformer-button--copy');

    if (transformBtn) {
      transformBtn.addEventListener('click', () => {
        const color = colorInput ? colorInput.value : '#0693e3';
        this.transformColors(element, color);
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.applyToDocument(element);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copyCSS(element);
      });
    }

    element.dataset.colorTransformerInitialized = 'true';
    this.dispatchEvent(element, 'colorTransformerReady');
  }

  getWordPressColors() {
    return [
      { name: 'black', displayName: 'Black', value: '#000000' },
      { name: 'cyan-bluish-gray', displayName: 'Cyan Bluish Gray', value: '#abb8c3' },
      { name: 'white', displayName: 'White', value: '#ffffff' },
      { name: 'pale-pink', displayName: 'Pale Pink', value: '#f78da7' },
      { name: 'vivid-red', displayName: 'Vivid Red', value: '#cf2e2e' },
      { name: 'luminous-vivid-orange', displayName: 'Luminous Vivid Orange', value: '#ff6900' },
      { name: 'luminous-vivid-amber', displayName: 'Luminous Vivid Amber', value: '#fcb900' },
      { name: 'light-green-cyan', displayName: 'Light Green Cyan', value: '#7bdcb5' },
      { name: 'vivid-green-cyan', displayName: 'Vivid Green Cyan', value: '#00d084' },
      { name: 'pale-cyan-blue', displayName: 'Pale Cyan Blue', value: '#8ed1fc' },
      { name: 'vivid-cyan-blue', displayName: 'Vivid Cyan Blue', value: '#0693e3' },
      { name: 'vivid-purple', displayName: 'Vivid Purple', value: '#9b51e0' }
    ];
  }

  detectWordPress() {
    // Check for WordPress CSS variables
    const wpStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    let wpDetected = false;

    wpStyles.forEach(style => {
      if (style.textContent && style.textContent.includes('--wp--preset--color--')) {
        wpDetected = true;
      }
    });

    // Check computed styles
    const computedStyle = getComputedStyle(document.documentElement);
    if (computedStyle.getPropertyValue('--wp--preset--color--vivid-cyan-blue')) {
      wpDetected = true;
    }

    // Check for WordPress body classes
    if (document.body && (
      document.body.classList.contains('wp-site') ||
      document.body.classList.contains('wordpress') ||
      document.querySelectorAll('.wp-block, .wp-site').length > 0
    )) {
      wpDetected = true;
    }

    return wpDetected;
  }

  updateWordPressStatus(element) {
    const isWP = this.detectWordPress();
    const statusElement = element.querySelector('[data-stat="wordpress"]');
    
    if (statusElement) {
      statusElement.textContent = isWP ? 'Yes' : 'No';
      statusElement.className = `color-transformer-stat-value ${isWP ? 'success' : 'warning'}`;
    }

    if (isWP) {
      element.classList.add('color-transformer--wordpress');
    }

    this.dispatchEvent(element, 'colorTransformerDetect', { wordpress: isWP });
  }

  hexToHSL(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

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
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }


  transformColors(element, newPrimaryHex) {
    const originalPrimary = '#0693e3'; // vivid-cyan-blue
    const wpColors = this.getWordPressColors();

    // Calculate hue shift
    const originalHSL = this.hexToHSL(originalPrimary);
    const newPrimaryHSL = this.hexToHSL(newPrimaryHex);

    let hueShift = newPrimaryHSL.h - originalHSL.h;
    if (hueShift > 180) hueShift -= 360;
    if (hueShift < -180) hueShift += 360;

    const transformedColors = {};
    let transformedCount = 0;

    // Transform each color
    wpColors.forEach(color => {
      const originalHSL = this.hexToHSL(color.value);

      // Skip neutrals (low saturation colors)
      if (originalHSL.s < 15 || color.name === 'black' || color.name === 'white') {
        transformedColors[color.name] = color.value;
      } else {
        // Apply hue shift while keeping saturation and lightness
        const newHue = (originalHSL.h + hueShift + 360) % 360;
        const newHex = window.WBComponentUtils.ColorUtils.hslToHex(newHue, originalHSL.s, originalHSL.l);
        transformedColors[color.name] = newHex;
        transformedCount++;
      }
    });

    // Update UI
    this.updatePreview(element, transformedColors);
    this.updateStats(element, hueShift, transformedCount);
    this.generateCSS(element, transformedColors);

    // Enable action buttons
    const applyBtn = element.querySelector('.color-transformer-button--apply');
    const copyBtn = element.querySelector('.color-transformer-button--copy');
    if (applyBtn) applyBtn.disabled = false;
    if (copyBtn) copyBtn.disabled = false;

    // Store transformed colors
    const config = this.transformers.get(element);
    config.transformedColors = transformedColors;
    config.hueShift = hueShift;

    this.dispatchEvent(element, 'colorTransformerTransform', {
      colors: transformedColors,
      hueShift,
      originalPrimary,
      newPrimary: newPrimaryHex
    });

    if (config.onTransform) {
      config.onTransform(transformedColors, hueShift);
    }

    return {
      colors: transformedColors,
      hueShift,
      originalPrimary,
      newPrimary: newPrimaryHex
    };
  }

  updatePreview(element, transformedColors) {
    const colorElements = element.querySelectorAll('.color-transformer-color');
    
    colorElements.forEach(colorEl => {
      const colorName = colorEl.dataset.colorName;
      const swatch = colorEl.querySelector('.color-transformer-color-swatch');
      const valueEl = colorEl.querySelector('.color-transformer-color-value');
      
      if (transformedColors[colorName]) {
        swatch.style.backgroundColor = transformedColors[colorName];
        valueEl.textContent = transformedColors[colorName];
      }
    });
  }

  updateStats(element, hueShift, transformedCount) {
    const hueShiftEl = element.querySelector('[data-stat="hue-shift"]');
    const countEl = element.querySelector('[data-stat="colors-count"]');
    
    if (hueShiftEl) hueShiftEl.textContent = `${hueShift}°`;
    if (countEl) countEl.textContent = transformedCount;
  }

  generateCSS(element, transformedColors) {
    let css = '/* WordPress Color Scheme - Transformed Values */\n';
    css += ':root {\n';

    Object.entries(transformedColors).forEach(([name, hex]) => {
      css += `  --wp--preset--color--${name}: ${hex};\n`;
    });

    css += '}\n';

    const textarea = element.querySelector('.color-transformer-output textarea');
    if (textarea) {
      textarea.value = css;
    }

    return css;
  }

  applyToDocument(element) {
    const config = this.transformers.get(element);
    if (!config.transformedColors) return false;

    if (!this.detectWordPress()) {
      console.warn('Not a WordPress environment, colors may not take effect');
    }

    // Apply CSS variables to document
    Object.entries(config.transformedColors).forEach(([name, hex]) => {
      document.documentElement.style.setProperty(`--wp--preset--color--${name}`, hex);
    });

    this.dispatchEvent(element, 'colorTransformerApply', {
      colors: config.transformedColors
    });

    if (config.onApply) {
      config.onApply(config.transformedColors);
    }

    // Show success feedback
    const applyBtn = element.querySelector('.color-transformer-button--apply');
    if (applyBtn) {
      const originalText = applyBtn.textContent;
      applyBtn.textContent = 'Applied!';
      applyBtn.classList.add('success');
      setTimeout(() => {
        applyBtn.textContent = originalText;
        applyBtn.classList.remove('success');
      }, 2000);
    }

    return true;
  }

  copyCSS(element) {
    const textarea = element.querySelector('.color-transformer-output textarea');
    if (!textarea || !textarea.value) return false;

    navigator.clipboard.writeText(textarea.value).then(() => {
      const copyBtn = element.querySelector('.color-transformer-button--copy');
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('success');
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('success');
        }, 2000);
      }
    });

    return true;
  }

  dispatchEvent(element, eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail: { element, ...detail },
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  }

  // Public API methods
  transform(transformer, primaryColor) {
    return this.transformColors(transformer, primaryColor);
  }

  apply(transformer) {
    return this.applyToDocument(transformer);
  }

  detectWordPress(transformer) {
    return this.detectWordPress();
  }

  getCSS(transformer) {
    const config = this.transformers.get(transformer);
    return config.transformedColors ? this.generateCSS(transformer, config.transformedColors) : '';
  }
}

// Initialize global instance
const colorTransformer = new ColorTransformer();

// Global API
window.ColorTransformer = {
  create: (options) => colorTransformer.create(options),
  transform: (transformer, primaryColor) => colorTransformer.transform(transformer, primaryColor),
  apply: (transformer) => colorTransformer.apply(transformer),
  detectWordPress: (transformer) => colorTransformer.detectWordPress(transformer),
  getCSS: (transformer) => colorTransformer.getCSS(transformer)
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => colorTransformer.initializeExistingTransformers());
} else {
  colorTransformer.initializeExistingTransformers();
}

// Backward compatibility - expose global functions
window.applyWPColors = function(hexColor) {
  // Find the first transformer and apply colors
  const transformer = document.querySelector('.color-transformer');
  if (transformer) {
    colorTransformer.transformColors(transformer, hexColor);
    return colorTransformer.applyToDocument(transformer);
  }
  return false;
};

window.wpColorTransformer = {
  applyToDocument: window.applyWPColors,
  detectWordPress: () => colorTransformer.detectWordPress()
};