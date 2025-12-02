/**
 * WB SELECT - LIGHT DOM SIMPLE VERSION
 * 
 * Dropdown select with label and help text
 * Uses CSS token variables for styling
 */

class WBSelect extends HTMLElement {
  static useShadow = false;

  connectedCallback() {
    const label = this.getAttribute('label') || '';
    const placeholder = this.getAttribute('placeholder') || 'Select an option';
    const disabled = this.hasAttribute('disabled');
    const required = this.hasAttribute('required');
    const selectId = this.getAttribute('id') || `wb-select-${Math.random().toString(36).substr(2, 9)}`;
    const help = this.getAttribute('help') || '';

    // Get options from data attribute or slot content
    let options = [];
    const optionsAttr = this.getAttribute('options');
    if (optionsAttr) {
      try {
        options = JSON.parse(optionsAttr);
      } catch (e) {
        console.error('wb-select: Invalid options JSON');
      }
    }

    // Build options HTML
    const optionsHtml = options.map(opt => 
      `<option value="${opt.value || opt}">${opt.label || opt}</option>`
    ).join('');

    // Render to Light DOM
    const html = `
      <div class="wb-select__wrapper">
        ${label ? `<label class="wb-select__label" for="${selectId}">${label}${required ? '<span class="wb-select__required">*</span>' : ''}</label>` : ''}
        <select 
          id="${selectId}"
          class="wb-select__field"
          ${disabled ? 'disabled' : ''}
          ${required ? 'required' : ''}
        >
          <option value="">${placeholder}</option>
          ${optionsHtml}
        </select>
        ${help ? `<div class="wb-select__help">${help}</div>` : ''}
        <div class="wb-select__feedback"></div>
      </div>
    `;

    this.innerHTML = html;
    this.classList.add('wb-select');

    const select = this.querySelector('.wb-select__field');
    if (select) {
      select.addEventListener('change', () => this.handleChange());
      select.addEventListener('focus', () => this.classList.add('wb-select--focused'));
      select.addEventListener('blur', () => this.classList.remove('wb-select--focused'));
    }
  }

  getValue() {
    const select = this.querySelector('.wb-select__field');
    return select ? select.value : '';
  }

  setValue(value) {
    const select = this.querySelector('.wb-select__field');
    if (select) {
      select.value = value;
      this.handleChange();
    }
  }

  handleChange() {
    this.dispatchEvent(new CustomEvent('wb-select:change', {
      detail: { value: this.getValue() },
      bubbles: true
    }));
    this.clearError();
  }

  setError(message) {
    this.classList.add('wb-select--error');
    const feedback = this.querySelector('.wb-select__feedback');
    if (feedback) feedback.textContent = message;
  }

  clearError() {
    this.classList.remove('wb-select--error');
    const feedback = this.querySelector('.wb-select__feedback');
    if (feedback) feedback.textContent = '';
  }
}

if (!customElements.get('wb-select')) {
  customElements.define('wb-select', WBSelect);
  console.log('✅ wb-select registered');
}

export { WBSelect };
export default WBSelect;
