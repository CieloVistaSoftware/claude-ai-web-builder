/**
 * WB Button Web Component
 * 
 * A standardized button component with dynamic configuration, variants, and theming support.
 * Supports toggle functionality, status indicators, icons, and images.
 * 
 * @example
 * <wb-button variant="primary" size="medium">Click Me</wb-button>
 * <wb-button variant="toggle" active="true">Toggle Button</wb-button>
 * 
 * @events
 * - wb-button:click - Fired when button is clicked
 * - wb-button:toggle - Fired when toggle button state changes
 * - wb-button:ready - Fired when component is fully initialized
 * 
 * @version 2.0.0
 * @author Website Builder Team
 */

// Note: WBBaseComponent import removed to avoid ES6 module syntax errors
// Component will check for WBBaseComponent availability at runtime

console.log('🔘 WB Button Web Component: Starting initialization...');

// Configuration fallback - used if JSON loading fails
const fallbackConfig = {
        component: {
            name: 'wb-button',
            version: '2.0.0',
            description: 'Website Builder standardized button component'
        },
        classes: {
            base: 'wb-btn',
            variants: {
                primary: 'wb-btn--primary',
                secondary: 'wb-btn--secondary',
                success: 'wb-btn--success',
                toggle: 'wb-btn--toggle',
                iconOnly: 'wb-btn--icon-only',
                imageOnly: 'wb-btn--image-only'
            },
            sizes: {
                small: 'wb-btn--small',
                medium: '',
                large: 'wb-btn--large'
            },
            states: {
                active: 'active',
                disabled: 'disabled',
                loading: 'wb-btn--loading'
            },
            elements: {
                icon: 'wb-btn__icon',
                image: 'wb-btn__image',
                status: 'wb-btn__status',
                checkmark: 'wb-btn__checkmark'
            },
            layouts: {
                grid: 'wb-btn-grid',
                gridSingle: 'wb-btn-grid--single',
                gridThree: 'wb-btn-grid--three',
                gridFour: 'wb-btn-grid--four',
                group: 'wb-btn-group'
            }
        },
        defaults: {
            variant: 'primary',
            size: 'medium',
            disabled: false,
            active: false
        },
        attributes: {
            variant: 'variant',
            size: 'size',
            disabled: 'disabled',
            active: 'active',
            image: 'image',
            imagePosition: 'image-position',
            imageAlt: 'image-alt',
            status: 'status',
            backgroundImage: 'background-image'
        },
        events: {
            ready: 'wb-button:ready',
            click: 'wb-button:click',
            toggle: 'wb-button:toggle'
        }
    };


// Minimal reactive store for state
function createSignal(initial) {
  let value = initial;
  const listeners = [];
  const get = () => value;
  const set = (v) => {
    value = v;
    listeners.forEach(fn => fn(value));
  };
  const subscribe = (fn) => { listeners.push(fn); };
  return [get, set, subscribe];
}

class WBButton extends HTMLElement {
  constructor() {
    super();
    this.config = fallbackConfig;
    this.utils = null;
    this._value = null;
    // Reactive signals
    [this.getActive, this.setActive, this.onActive] = createSignal(false);
    [this.getDisabled, this.setDisabled, this.onDisabled] = createSignal(false);
    [this.getVariant, this.setVariant, this.onVariant] = createSignal(this.config.defaults.variant);
    [this.getSize, this.setSize, this.onSize] = createSignal(this.config.defaults.size);
    [this.getStatus, this.setStatus, this.onStatus] = createSignal(null);
    [this.getImage, this.setImage, this.onImage] = createSignal(null);
    [this.getBgImage, this.setBgImage, this.onBgImage] = createSignal(null);
    // Subscribe to state changes and re-render
    this.onActive(() => this.render());
    this.onDisabled(() => this.render());
    this.onVariant(() => this.render());
    this.onSize(() => this.render());
    this.onStatus(() => this.render());
    this.onImage(() => this.render());
    this.onBgImage(() => this.render());
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // Render the button declaratively based on state
    this.innerHTML = `
      <button
        class="${this.config.classes.base} ${this.config.classes.variants[this.getVariant()]} ${this.config.classes.sizes[this.getSize()]} ${this.getActive() ? this.config.classes.states.active : ''} ${this.getDisabled() ? this.config.classes.states.disabled : ''}"
        ${this.getDisabled() ? 'disabled' : ''}
        onclick="this.getRootNode().host.handleClick(event)"
        type="button"
      >
        ${this.getImage() ? `<img class='${this.config.classes.elements.image}' src='${this.getImage()}' alt='' />` : ''}
        <slot></slot>
        ${this.getStatus() ? `<span class='${this.config.classes.elements.status} ${this.config.classes.elements.status}--${this.getStatus()}'></span>` : ''}
        ${this.getVariant() === 'toggle' ? `<span class='${this.config.classes.elements.checkmark}'>✓</span>` : ''}
      </button>
    `;
    if (this.getBgImage()) {
      this.style.setProperty('--wb-btn-bg-image', `url(${this.getBgImage()})`);
    } else {
      this.style.removeProperty('--wb-btn-bg-image');
    }
  }

  handleClick(event) {
    if (this.getDisabled()) {
      event.preventDefault();
      return;
    }
    if (this.getVariant() === 'toggle') {
      this.setActive(!this.getActive());
      this.dispatchEvent(new CustomEvent(this.config.events.toggle, {
        detail: { button: this, active: this.getActive(), value: this._value },
        bubbles: true
      }));
    }
    this.dispatchEvent(new CustomEvent(this.config.events.click, {
      detail: { button: this, variant: this.getVariant(), value: this._value },
      bubbles: true
    }));
  }

  // Attribute reflection for reactivity
  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'active', 'image', 'status', 'background-image'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'variant':
        this.setVariant(newValue || this.config.defaults.variant);
        break;
      case 'size':
        this.setSize(newValue || this.config.defaults.size);
        break;
      case 'disabled':
        this.setDisabled(newValue !== null);
        break;
      case 'active':
        this.setActive(newValue !== null);
        break;
      case 'image':
        this.setImage(newValue);
        break;
      case 'status':
        this.setStatus(newValue);
        break;
      case 'background-image':
        this.setBgImage(newValue);
        break;
    }
  }
}

if (customElements && !customElements.get('wb-button')) {
  customElements.define('wb-button', WBButton);
  console.log('🔘 WB Button Web Component: Custom element registered');
} else if (customElements.get('wb-button')) {
  console.log('🔘 WB Button Web Component: Already registered');
} else {
  console.error('🔘 WB Button Web Component: Custom Elements not supported');
}

    // Static utility methods for creating button grids and groups
    WBButton.createGrid = function(columns = 2) {
        const grid = document.createElement('div');
        const config = fallbackConfig;
        
        if (columns === 1) {
            grid.className = config.classes.layouts.gridSingle;
        } else if (columns === 3) {
            grid.className = config.classes.layouts.gridThree;
        } else if (columns === 4) {
            grid.className = config.classes.layouts.gridFour;
        } else {
            grid.className = config.classes.layouts.grid;
        }
        return grid;
    };

    WBButton.createGroup = function() {
        const group = document.createElement('div');
        group.className = fallbackConfig.classes.layouts.group;
        return group;
    };

// Register the custom element
if (customElements && !customElements.get('wb-button')) {
    customElements.define('wb-button', WBButton);
    console.log('🔘 WB Button Web Component: Custom element registered');
} else if (customElements.get('wb-button')) {
    console.log('🔘 WB Button Web Component: Already registered');
} else {
    console.error('🔘 WB Button Web Component: Custom Elements not supported');
}

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-button', WBButton, ['wb-event-log'], {
        version: '1.0.0',
        type: 'form',
        role: 'ui-element',
        description: 'Versatile button component with multiple styles, sizes, and interaction states',
        api: {
            static: ['createGroup'],
            events: ['click', 'focus', 'blur', 'hover'],
            attributes: ['label', 'variant', 'size', 'disabled', 'loading', 'icon', 'icon-position'],
            methods: ['render', 'setLabel', 'setVariant', 'setSize', 'disable', 'enable']
        },
        priority: 4 // UI component depends on infrastructure
    });
}