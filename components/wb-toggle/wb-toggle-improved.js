// wb-toggle-improved.js
// Improved toggle component for Claude AI Web Builder
// Features: checked state, proper toggle logic, accessibility

class WBToggleImproved extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <label id="label"></label>
      <input id="toggle" type="checkbox" />
      <span id="state"></span>
    `;
    this.toggle = this.shadowRoot.getElementById('toggle');
    this.stateSpan = this.shadowRoot.getElementById('state');
    this.label = this.shadowRoot.getElementById('label');
  }

  connectedCallback() {
    this.label.textContent = this.getAttribute('label') || 'Toggle:';
    this.toggle.checked = this.hasAttribute('checked');
    this.updateState();
    this.toggle.addEventListener('change', this.onToggle.bind(this));
    this.setAccessibility();
  }

  onToggle() {
    this.updateState();
    // Custom event for toggle logic
    this.dispatchEvent(new CustomEvent('toggle', { detail: { checked: this.toggle.checked } }));
  }

  updateState() {
    this.stateSpan.textContent = this.toggle.checked ? 'On' : 'Off';
  }

  setAccessibility() {
    this.toggle.setAttribute('aria-checked', this.toggle.checked);
    this.toggle.setAttribute('role', 'switch');
    this.toggle.setAttribute('aria-label', this.label.textContent);
  }
}

customElements.define('wb-toggle-improved', WBToggleImproved);
