// wb-select-improved.js
// Improved select component for Claude AI Web Builder
// Features: keyboard navigation, ARIA attributes, value persistence

class WBSelectImproved extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <label id="label"></label>
      <select id="select" aria-label="Select field"></select>
      <span id="error" role="alert" style="color:red;display:none;"></span>
    `;
    this.select = this.shadowRoot.getElementById('select');
    this.error = this.shadowRoot.getElementById('error');
    this.label = this.shadowRoot.getElementById('label');
  }

  connectedCallback() {
    this.label.textContent = this.getAttribute('label') || 'Select:';
    this.setOptions();
    this.select.value = this.getPersistedValue();
    this.select.addEventListener('change', this.persistValue.bind(this));
    this.select.addEventListener('keydown', this.onKeyDown.bind(this));
    this.setAccessibility();
  }

  setOptions() {
    const options = (this.getAttribute('options') || '').split(',');
    this.select.innerHTML = '';
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.trim();
      option.textContent = opt.trim();
      this.select.appendChild(option);
    });
  }

  persistValue() {
    localStorage.setItem(this.id + '-value', this.select.value);
  }

  getPersistedValue() {
    return localStorage.getItem(this.id + '-value') || '';
  }

  onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.select.selectedIndex = Math.min(this.select.selectedIndex + 1, this.select.options.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.select.selectedIndex = Math.max(this.select.selectedIndex - 1, 0);
    }
  }

  setAccessibility() {
    this.select.setAttribute('aria-required', 'true');
    this.select.setAttribute('aria-describedby', 'error');
    this.select.setAttribute('aria-invalid', 'false');
  }
}

customElements.define('wb-select-improved', WBSelectImproved);
