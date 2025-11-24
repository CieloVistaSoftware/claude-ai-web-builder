// wb-input-improved.js
// Improved input component for Claude AI Web Builder
// Features: validation, error handling, accessibility, XSS prevention, reduced logging

class WBInputImproved extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <label id="label"></label>
      <input id="input" type="text" aria-label="Input field" />
      <span id="error" role="alert" style="color:red;display:none;"></span>
    `;
    this.input = this.shadowRoot.getElementById('input');
    this.error = this.shadowRoot.getElementById('error');
    this.label = this.shadowRoot.getElementById('label');
  }

  connectedCallback() {
    this.label.textContent = this.getAttribute('label') || 'Input:';
    this.input.value = this.sanitize(this.getAttribute('value') || '');
    this.input.addEventListener('input', this.onInput.bind(this));
    this.input.addEventListener('blur', this.validate.bind(this));
    this.setAccessibility();
  }

  sanitize(value) {
    // Basic XSS prevention
    return value.replace(/[<>&"']/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  onInput(e) {
    this.input.value = this.sanitize(e.target.value);
    this.error.style.display = 'none';
  }

  validate() {
    const value = this.input.value;
    if (!value) {
      this.showError('Input required');
      return false;
    }
    if (value.length < 3) {
      this.showError('Input too short');
      return false;
    }
    this.error.style.display = 'none';
    return true;
  }

  showError(msg) {
    this.error.textContent = msg;
    this.error.style.display = 'inline';
    // Minimal logging
    if (window.wbLogError) window.wbLogError(msg);
  }

  setAccessibility() {
    this.input.setAttribute('aria-required', 'true');
    this.input.setAttribute('aria-describedby', 'error');
    this.input.setAttribute('aria-invalid', 'false');
  }
}

customElements.define('wb-input-improved', WBInputImproved);
