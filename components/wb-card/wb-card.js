/**
 * WB CARD - TRUE LIGHT DOM (NO TEMPLATES, NO SLOTS, NO SHADOW DOM)
 * 
 * Just a styled container. Children are rendered normally inside it.
 * No template rendering, no innerHTML manipulation, no slots.
 */

class WBCard extends HTMLElement {
  static useShadow = false;

  connectedCallback() {
    // CSS is loaded globally in HTML head, not here

    // Add classes based on attributes
    this.classList.add('wb-card');
    
    const variant = this.getAttribute('variant');
    if (variant && variant !== 'default') {
      this.classList.add(`wb-card--${variant}`);
    }

    const size = this.getAttribute('size');
    if (size && size !== 'standard') {
      this.classList.add(`wb-card--${size}`);
    }

    const layout = this.getAttribute('layout');
    if (layout && layout !== 'vertical') {
      this.classList.add(`wb-card--${layout}`);
    }

    if (this.hasAttribute('clickable')) {
      this.classList.add('wb-card--clickable');
      this.addEventListener('click', () => this.handleClick());
    }

    if (this.hasAttribute('loading')) {
      this.classList.add('wb-card--loading');
    }

    // Dispatch ready event
    this.dispatchEvent(new CustomEvent('wbCardReady', {
      bubbles: true,
      detail: { component: this }
    }));
  }

  handleClick() {
    this.classList.toggle('wb-card--selected');
    this.dispatchEvent(new CustomEvent('wbCardClick', {
      bubbles: true,
      detail: { selected: this.classList.contains('wb-card--selected') }
    }));
  }

  static get observedAttributes() {
    return ['variant', 'size', 'layout'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'variant') {
      // Remove old variant class
      this.classList.forEach(cls => {
        if (cls.startsWith('wb-card--') && cls !== 'wb-card--clickable' && cls !== 'wb-card--selected') {
          this.classList.remove(cls);
        }
      });
      // Add new variant
      if (newValue && newValue !== 'default') {
        this.classList.add(`wb-card--${newValue}`);
      }
    }
  }
}

if (!customElements.get('wb-card')) {
  customElements.define('wb-card', WBCard);
  console.log('✅ wb-card registered (pure Light DOM)');
}

export { WBCard };
export default WBCard;
