/**
 * test
 * 
 * @webcomponent
 * @tag user-test
 * @shadow open
 *  * @attribute {string} name - the name
 * 
 * @fires onclick - onclick
 * @fires onClick - 
 * 
 * @slot default - default
 */
class UserTest extends HTMLElement {
  constructor() {
    super();
    
    // Set up shadow DOM
    this.attachShadow({ mode: 'open' });

    // Initialize state
    this._name = '';

    // Bind methods
    this._handleClick = this._handleClick.bind(this);
  }
  
  static get observedAttributes() {
    return ['name'];
  }
  
  connectedCallback() {
    // Set ARIA attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'region');
    }
    
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    
    // Load styles
    this._loadStyles();
    
    // Initial render
    this.render();
    
    // Add event listeners
    this.addEventListener('click', this._handleClick);
  }
  
  disconnectedCallback() {
    // Clean up event listeners
    this.removeEventListener('click', this._handleClick);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'name':
        this._name = newValue;
        break;
    }
    
    // Re-render if already connected
    if (this.shadowRoot) {
      this.render();
    }
  }
  
  /**
   * Get name
   * @returns {string}
   */
  get name() {
    return this.getAttribute('name');
  }
  
  /**
   * Set name
   * @param {string} value
   */
  set name(value) {
    if (value) {
      this.setAttribute('name', value);
    } else {
      this.removeAttribute('name');
    }
  }

  /**
   * Load component styles
   * @private
   */
  _loadStyles() {
    const style = document.createElement('style');
    // In production, load from external CSS file
    style.textContent = `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    `;
    this.shadowRoot.appendChild(style);
  }
  
  /**
   * Render component
   */
  render() {
    const name = this.getAttribute('name') || '';

    const template = `
      <div class="container">
        <h3>UserTest</h3>
        <p><strong>name:</strong> ${name}</p>

        <slot name="default"></slot>

      </div>
    `;
    
    this.shadowRoot.innerHTML = template;
  }
  
  /**
   * Handle click events
   * @param {Event} event
   * @private
   */
  _handleClick(event) {
    this.dispatchEvent(new CustomEvent('onclick', {
      detail: { timestamp: Date.now() },
      bubbles: true,
      composed: true
    }));
    this.dispatchEvent(new CustomEvent('onClick', {
      detail: { timestamp: Date.now() },
      bubbles: true,
      composed: true
    }));

  }
}

// Register the custom element
customElements.define('user-test', UserTest);