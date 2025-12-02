/**
 * WB INPUT - LIGHT DOM WITH WBBASECOMPONENT
 * 
 * Text input with label, help text, and validation states
 * Uses CSS token variables for styling
 */

import WBBaseComponent from '../wb-base/wb-base.js';

export class WBInput extends WBBaseComponent {
  static elementName = 'wb-input';
  static version = '1.0.0';
  static useShadow = false;

  static get observedAttributes() {
    return ['type', 'label', 'placeholder', 'disabled', 'required', 'value', 'help'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupDOM();
    this.attachEventListeners();
  }

  setupDOM() {
    // Get attributes
    const type = this.getAttribute('type') || 'text';
    const label = this.getAttribute('label') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    const disabled = this.hasAttribute('disabled');
    const required = this.hasAttribute('required');
    const value = this.getAttribute('value') || '';
    const help = this.getAttribute('help') || '';

    // Build unique ID for label
    const inputId = this.getAttribute('id') || `wb-input-${Math.random().toString(36).substr(2, 9)}`;

    // Render to Light DOM
    let html = `
      <div class="wb-input__wrapper">
        ${label ? `<label class="wb-input__label" for="${inputId}">${label}${required ? '<span class="wb-input__required">*</span>' : ''}</label>` : ''}
        <input 
          type="${type}"
          id="${inputId}"
          class="wb-input__field"
          placeholder="${placeholder}"
          value="${value}"
          ${disabled ? 'disabled' : ''}
          ${required ? 'required' : ''}
        />
        ${help ? `<div class="wb-input__help">${help}</div>` : ''}
        <div class="wb-input__feedback"></div>
      </div>
    `;

    this.innerHTML = html;
    this.classList.add('wb-input');
  }

  attachEventListeners() {
    // Get input element for events
    const input = this.querySelector('.wb-input__field');
    if (input) {
      input.addEventListener('input', () => this.handleInput());
      input.addEventListener('focus', () => this.classList.add('wb-input--focused'));
      input.addEventListener('blur', () => {
        this.classList.remove('wb-input--focused');
        this.validate();
      });
    }
  }

  getValue() {
    const input = this.querySelector('.wb-input__field');
    return input ? input.value : '';
  }

  setValue(value) {
    const input = this.querySelector('.wb-input__field');
    if (input) {
      input.value = value;
      this.handleInput();
    }
  }

  handleInput() {
    this.dispatchEvent(new CustomEvent('wb-input:change', {
      detail: { value: this.getValue() },
      bubbles: true
    }));
    this.clearError();
  }

  validate() {
    const input = this.querySelector('.wb-input__field');
    if (!input) return true;

    const feedback = this.querySelector('.wb-input__feedback');
    if (!feedback) return true;

    if (input.hasAttribute('required') && !input.value.trim()) {
      this.setError('This field is required');
      return false;
    }

    if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      this.setError('Please enter a valid email');
      return false;
    }

    this.clearError();
    return true;
  }

  setError(message) {
    this.classList.remove('wb-input--success');
    this.classList.add('wb-input--error');
    const feedback = this.querySelector('.wb-input__feedback');
    if (feedback) feedback.textContent = message;
  }

  clearError() {
    this.classList.remove('wb-input--error');
    const feedback = this.querySelector('.wb-input__feedback');
    if (feedback) feedback.textContent = '';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    const input = this.querySelector('.wb-input__field');
    if (!input) return;

    switch(name) {
      case 'value':
        input.value = newValue || '';
        break;
      case 'disabled':
        input.disabled = newValue !== null;
        break;
      case 'required':
        input.required = newValue !== null;
        break;
      case 'placeholder':
        input.placeholder = newValue || '';
        break;
      case 'type':
        input.type = newValue || 'text';
        break;
    }
  }
}

customElements.define(WBInput.elementName, WBInput);
