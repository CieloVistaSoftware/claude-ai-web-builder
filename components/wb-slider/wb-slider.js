/**
 * WB Slider Component
 * A customizable range slider with accessibility and theming support
 */

import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBSlider {
  constructor() {
    this.sliders = new Map();
    this.init();
  }
    static get observedAttributes() {
        return ['disabled'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch(name) {
            case 'disabled':
                this.disabled = newValue;
                break;
        }
        
        if (this.shadowRoot) {
            this.render();
        }
    }



  async init() {
    await this.loadCSS();
    this.initializeExistingSliders();
  }

  async loadCSS() {
    await loadComponentCSS(this, 'wb-slider.css');
  }

  initializeExistingSliders() {
    document.querySelectorAll('wb-slider').forEach(element => {
      if (!element.dataset.wbSliderInitialized) {
        this.initializeSlider(element);
      }
    });
  }

  create(options = {}) {
    const defaults = {
      id: `wb-slider-${Date.now()}`,
      label: '',
      min: 0,
      max: 100,
      value: 50,
      step: 1,
      unit: '',
      size: 'standard',
      orientation: 'horizontal',
      variant: 'primary',
      disabled: false,
      showValue: true,
      showTicks: false,
      onchange: null,
      oninput: null
    };

    const config = { ...defaults, ...options };
    const wrapper = document.createElement('div');
    wrapper.className = 'wb-slider-wrapper';
    wrapper.innerHTML = this.generateHTML(config);

    const sliderElement = wrapper.querySelector('.wb-slider');
    this.initializeSlider(sliderElement, config);

    return wrapper;
  }

  generateHTML(config) {
    const labelHTML = config.label ? 
      `<label class="wb-slider-label" for="${config.id}">${config.label}</label>` : '';

    const valueHTML = config.showValue ? 
      `<span class="wb-slider-value" data-unit="${config.unit}">${config.value}${config.unit}</span>` : '';

    const ticksHTML = config.showTicks ? this.generateTicks(config) : '';

    const classes = [
      'wb-slider',
      config.size !== 'standard' ? `wb-slider--${config.size}` : '',
      config.orientation !== 'horizontal' ? `wb-slider--${config.orientation}` : '',
      config.variant !== 'primary' ? `wb-slider--${config.variant}` : '',
      config.disabled ? 'wb-slider--disabled' : ''
    ].filter(Boolean).join(' ');

    return `
      ${labelHTML}
      <div class="wb-slider-container" style="display: flex; align-items: center; gap: 1rem;">
        <div class="${classes}" 
             data-min="${config.min}"
             data-max="${config.max}"
             data-step="${config.step}"
             data-value="${config.value}"
             data-unit="${config.unit}"
             role="slider"
             aria-valuemin="${config.min}"
             aria-valuemax="${config.max}"
             aria-valuenow="${config.value}"
             aria-label="${config.label}"
             tabindex="0">
          <div class="wb-slider-track">
            <div class="wb-slider-fill" style="width: ${this.getPercentage(config.value, config.min, config.max)}%"></div>
            <div class="wb-slider-thumb" style="left: ${this.getPercentage(config.value, config.min, config.max)}%"></div>
          </div>
          <input type="range" 
                 class="wb-slider-input"
                 id="${config.id}"
                 min="${config.min}"
                 max="${config.max}"
                 step="${config.step}"
                 value="${config.value}"
                 ${config.disabled ? 'disabled' : ''}>
          ${ticksHTML}
        </div>
        ${valueHTML}
      </div>
    `;
  }

  generateTicks(config) {
    const range = config.max - config.min;
    const stepCount = Math.floor(range / config.step);
    const maxTicks = 10;
    const tickInterval = Math.max(1, Math.floor(stepCount / maxTicks));
    
    let ticks = '';
    for (let i = 0; i <= stepCount; i += tickInterval) {
      const value = config.min + (i * config.step);
      const percentage = this.getPercentage(value, config.min, config.max);
      ticks += `<div class="wb-slider-tick" style="left: ${percentage}%" data-value="${value}"></div>`;
    }
    
    return `<div class="wb-slider-ticks">${ticks}</div>`;
  }

  initializeSlider(element, config = null) {
    if (element.dataset.wbSliderInitialized) return;

    const input = element.querySelector('.wb-slider-input');
    const fill = element.querySelector('.wb-slider-fill');
    const thumb = element.querySelector('.wb-slider-thumb');
    const valueDisplay = element.parentElement?.querySelector('.wb-slider-value');

    if (!input || !fill || !thumb) return;

    const sliderConfig = config || {
      min: parseFloat(element.dataset.min || '0'),
      max: parseFloat(element.dataset.max || '100'),
      step: parseFloat(element.dataset.step || '1'),
      unit: element.dataset.unit || '',
      onchange: null,
      oninput: null
    };

    this.sliders.set(element, sliderConfig);

    // Input event handling
    input.addEventListener('input', (e) => {
      this.updateSliderDisplay(element, e.target.value);
      this.dispatchEvent(element, 'wbSliderInput', { value: parseFloat(e.target.value) });
      if (sliderConfig.oninput) sliderConfig.oninput(parseFloat(e.target.value));
    });

    input.addEventListener('change', (e) => {
      this.dispatchEvent(element, 'wbSliderChange', { value: parseFloat(e.target.value) });
      if (sliderConfig.onchange) sliderConfig.onchange(parseFloat(e.target.value));
    });

    // Keyboard navigation
    element.addEventListener('keydown', (e) => {
      this.handleKeyDown(e, element, input);
    });

    // Focus/blur events
    element.addEventListener('focus', () => {
      element.classList.add('wb-slider--focused');
      this.dispatchEvent(element, 'wbSliderFocus');
    });

    element.addEventListener('blur', () => {
      element.classList.remove('wb-slider--focused');
      this.dispatchEvent(element, 'wbSliderBlur');
    });

    // Mouse/touch events for custom thumb interaction
    this.initializeThumbInteraction(element, input);

    element.dataset.wbSliderInitialized = 'true';
    this.dispatchEvent(element, 'wbSliderReady');
  }

  initializeThumbInteraction(element, input) {
    const thumb = element.querySelector('.wb-slider-thumb');
    const track = element.querySelector('.wb-slider-track');
    let isDragging = false;

    const startDrag = (e) => {
      isDragging = true;
      element.classList.add('wb-slider--dragging');
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchmove', handleDrag, { passive: false });
      document.addEventListener('touchend', endDrag);
    };

    const handleDrag = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const rect = track.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      
      const config = this.sliders.get(element);
      const value = config.min + ((config.max - config.min) * percentage / 100);
      const steppedValue = Math.round(value / config.step) * config.step;
      
      input.value = steppedValue;
      this.updateSliderDisplay(element, steppedValue);
      this.dispatchEvent(element, 'wbSliderInput', { value: steppedValue });
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      element.classList.remove('wb-slider--dragging');
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', endDrag);
      
      const config = this.sliders.get(element);
      this.dispatchEvent(element, 'wbSliderChange', { value: parseFloat(input.value) });
      if (config.onchange) config.onchange(parseFloat(input.value));
    };

    thumb.addEventListener('mousedown', startDrag);
    thumb.addEventListener('touchstart', startDrag, { passive: true });
    track.addEventListener('click', (e) => {
      if (e.target === thumb) return;
      
      const rect = track.getBoundingClientRect();
      const percentage = ((e.clientX - rect.left) / rect.width) * 100;
      const config = this.sliders.get(element);
      const value = config.min + ((config.max - config.min) * percentage / 100);
      const steppedValue = Math.round(value / config.step) * config.step;
      
      input.value = steppedValue;
      this.updateSliderDisplay(element, steppedValue);
      this.dispatchEvent(element, 'wbSliderChange', { value: steppedValue });
      if (config.onchange) config.onchange(steppedValue);
    });
  }

  handleKeyDown(e, element, input) {
    const config = this.sliders.get(element);
    let newValue = parseFloat(input.value);
    
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(config.min, newValue - config.step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(config.max, newValue + config.step);
        break;
      case 'Home':
        newValue = config.min;
        break;
      case 'End':
        newValue = config.max;
        break;
      case 'PageDown':
        newValue = Math.max(config.min, newValue - (config.step * 10));
        break;
      case 'PageUp':
        newValue = Math.min(config.max, newValue + (config.step * 10));
        break;
      default:
        return;
    }

    e.preventDefault();
    input.value = newValue;
    this.updateSliderDisplay(element, newValue);
    this.dispatchEvent(element, 'wbSliderChange', { value: newValue });
    if (config.onchange) config.onchange(newValue);
  }

  updateSliderDisplay(element, value) {
    const config = this.sliders.get(element);
    const percentage = this.getPercentage(value, config.min, config.max);
    
    const fill = element.querySelector('.wb-slider-fill');
    const thumb = element.querySelector('.wb-slider-thumb');
    const valueDisplay = element.parentElement?.querySelector('.wb-slider-value');

    if (fill) fill.style.width = `${percentage}%`;
    if (thumb) thumb.style.left = `${percentage}%`;
    if (valueDisplay) valueDisplay.textContent = `${value}${config.unit}`;

    element.setAttribute('aria-valuenow', value);
  }

  getPercentage(value, min, max) {
    return ((value - min) / (max - min)) * 100;
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
  setValue(slider, value) {
    const input = slider.querySelector('.wb-slider-input');
    if (input) {
      input.value = value;
      this.updateSliderDisplay(slider, value);
    }
  }

  getValue(slider) {
    const input = slider.querySelector('.wb-slider-input');
    return input ? parseFloat(input.value) : null;
  }

  setDisabled(slider, disabled) {
    const input = slider.querySelector('.wb-slider-input');
    if (input) {
      input.disabled = disabled;
      slider.classList.toggle('wb-slider--disabled', disabled);
    }
  }

  setRange(slider, min, max) {
    const input = slider.querySelector('.wb-slider-input');
    if (input) {
      input.min = min;
      input.max = max;
      slider.dataset.min = min;
      slider.dataset.max = max;
      slider.setAttribute('aria-valuemin', min);
      slider.setAttribute('aria-valuemax', max);
      
      const config = this.sliders.get(slider);
      if (config) {
        config.min = min;
        config.max = max;
      }
    }
  }
}

// Initialize global instance and expose for demo compatibility
const wbSlider = new WBSlider();
window.wbSlider = wbSlider;
window.WBSlider = {
  create: (...args) => wbSlider.create(...args),
  setValue: (...args) => wbSlider.setValue(...args),
  getValue: (...args) => wbSlider.getValue(...args),
  setDisabled: (...args) => wbSlider.setDisabled(...args),
  setRange: (...args) => wbSlider.setRange(...args)
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => wbSlider.initializeExistingSliders());
} else {
  wbSlider.initializeExistingSliders();
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBSlider = WBSlider;

// Expose globally (backward compatibility)
window.WBSlider = WBSlider;

// ES6 Module Exports
export { WBSlider };
export default WBSlider;