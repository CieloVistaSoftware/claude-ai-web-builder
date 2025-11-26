// wb-slider-improved.js
// Improved slider component for Claude AI Web Builder
// Features: range validation, keyboard support, accessibility

class WBSliderImproved extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <label id="label"></label>
      <input id="slider" type="range" />
      <span id="value"></span>
      <span id="error" role="alert" style="color:red;display:none;"></span>
    `;
    this.slider = this.shadowRoot.getElementById('slider');
    this.valueSpan = this.shadowRoot.getElementById('value');
    this.error = this.shadowRoot.getElementById('error');
    this.label = this.shadowRoot.getElementById('label');
  }

  connectedCallback() {
    this.label.textContent = this.getAttribute('label') || 'Slider:';
    this.slider.min = this.getAttribute('min') || '0';
    this.slider.max = this.getAttribute('max') || '100';
    this.slider.value = this.getAttribute('value') || '50';
    this.valueSpan.textContent = this.slider.value;
    this.slider.addEventListener('input', this.onInput.bind(this));
    this.slider.addEventListener('blur', this.validate.bind(this));
    this.slider.addEventListener('keydown', this.onKeyDown.bind(this));
    this.setAccessibility();
  }

  onInput(e) {
    this.valueSpan.textContent = e.target.value;
    this.error.style.display = 'none';
  }

  validate() {
    const value = parseInt(this.slider.value, 10);
    const min = parseInt(this.slider.min, 10);
    const max = parseInt(this.slider.max, 10);
    if (value < min || value > max) {
      this.showError('Value out of range');
      return false;
    }
    this.error.style.display = 'none';
    return true;
  }

  showError(msg) {
    this.error.textContent = msg;
    this.error.style.display = 'inline';
    if (window.wbLogError) window.wbLogError(msg);
  }

  onKeyDown(e) {
    if (e.key === 'ArrowLeft') {
      this.slider.stepDown();
      this.valueSpan.textContent = this.slider.value;
    } else if (e.key === 'ArrowRight') {
      this.slider.stepUp();
      this.valueSpan.textContent = this.slider.value;
    }
  }

  setAccessibility() {
    this.slider.setAttribute('aria-valuemin', this.slider.min);
    this.slider.setAttribute('aria-valuemax', this.slider.max);
    this.slider.setAttribute('aria-valuenow', this.slider.value);
    this.slider.setAttribute('aria-describedby', 'error');
    this.slider.setAttribute('aria-label', this.label.textContent);
  }
}

customElements.define('wb-slider-improved', WBSliderImproved);
