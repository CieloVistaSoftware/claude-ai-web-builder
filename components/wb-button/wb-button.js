// @ts-nocheck
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
 * @version 2.0.1-shadow-dom
 * @author Website Builder Team
 */

// WBBaseComponent import for standardized inheritance
import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

// Initialization logging handled by WBBaseComponent

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
                danger: 'wb-btn--danger',
                warning: 'wb-btn--warning',
                info: 'wb-btn--info',
                minimal: 'wb-btn--minimal',
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
/**
 * Minimal reactive store for state with correct TypeScript types
 */
function createSignal(initial) {
  let value = initial;
  const listeners = [];
  function get() { return value; }
  function set(v) { value = v; listeners.forEach(fn => fn(value)); }
  function subscribe(fn) { listeners.push(fn); }
  return [get, set, subscribe];
}

class WBButton extends WBBaseComponent {
  
  // Signal fields (no type annotations)
  getActive;
  setActive;
  onActive;
  getDisabled;
  setDisabled;
  onDisabled;
  getVariant;
  setVariant;
  onVariant;
  getSize;
  setSize;
  onSize;
  getStatus;
  setStatus;
  onStatus;
  getImage;
  setImage;
  onImage;
  getBgImage;
  setBgImage;
  onBgImage;

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

  async connectedCallback() {
    super.connectedCallback(); // Inherit dark mode and other base functionality
    
    // Save the original text content BEFORE we render
    this._buttonText = this.textContent.trim();
    
    this.logInfo('WBButton connecting', { variant: this.getVariant() });
    
    // Load CSS - different approach for Shadow DOM vs Light DOM
    if (this.shadowRoot) {
      // Shadow DOM: Add CSS link directly to shadowRoot
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL('./wb-button.css', import.meta.url).href;
      this.shadowRoot.appendChild(link);
      
      // Wait for CSS to load
      await new Promise(resolve => {
        link.onload = resolve;
        link.onerror = resolve; // Continue even if CSS fails
      });
    } else {
      // Light DOM: Use standard CSS loader
      await loadComponentCSS(this, 'wb-button.css');
    }
    
    this.render();
    
    // Add click event listener
    const target = this.shadowRoot || this;
    const button = target.querySelector('button');
    if (button) {
      button.addEventListener('click', (e) => this.handleClick(e));
    }
    
    // Fire ready event
    this.fireEvent('wb-button:ready', { component: 'wb-button', variant: this.getVariant() });
    this.logInfo('WBButton ready', { variant: this.getVariant() });
  }

  render() {
    // Render the button declaratively based on state
    const variant = this.getVariant();
    const size = this.getSize();
    const active = this.getActive();
    const disabled = this.getDisabled();
    const image = this.getImage();
    const status = this.getStatus();
    const bgImage = this.getBgImage();
    
    // Use saved text content or current textContent
    const buttonText = this._buttonText || this.textContent.trim();
    
    const html = `
      <button
        class="${this.config.classes.base} ${this.config.classes.variants[variant]} ${this.config.classes.sizes[size]} ${active ? this.config.classes.states.active : ''} ${disabled ? this.config.classes.states.disabled : ''}"
        ${disabled ? 'disabled' : ''}
        type="button"
        style="display: flex !important; align-items: center !important; justify-content: center !important; min-height: 24px !important; padding: 0 8px !important;"
      >
        ${image ? `<img class='${this.config.classes.elements.image}' src='${image}' alt='' />` : ''}
        ${buttonText}
        ${status ? `<span class='${this.config.classes.elements.status} ${this.config.classes.elements.status}--${status}'></span>` : ''}
      </button>
    `;
    
    // WBBase creates shadowRoot automatically if useShadow = true
    const target = this.shadowRoot || this;
    
    // IMPORTANT: Preserve existing link/style elements when re-rendering
    if (this.shadowRoot) {
      // Save CSS links before clearing
      const existingLinks = Array.from(this.shadowRoot.querySelectorAll('link[rel="stylesheet"]'));
      const existingStyles = Array.from(this.shadowRoot.querySelectorAll('style'));
      
      // Clear and set new HTML
      target.innerHTML = html;
      
      // Re-append CSS links and styles
      existingLinks.forEach(link => this.shadowRoot.appendChild(link));
      existingStyles.forEach(style => this.shadowRoot.appendChild(style));
    } else {
      target.innerHTML = html;
    }
    
    if (bgImage) {
      this.style.setProperty('--wb-btn-bg-image', `url(${bgImage})`);
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
      this.fireEvent('wb-button:toggle', { button: this, active: this.getActive(), value: this._value });
      this.logDebug('WBButton toggled', { active: this.getActive() });
    }
    this.fireEvent('wb-button:click', { button: this, variant: this.getVariant(), value: this._value });
    this.logDebug('WBButton clicked', { variant: this.getVariant() });
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

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBButton = WBButton;

// Expose globally (backward compatibility)
window.WBButton = WBButton;

// ES6 Module Exports
export { WBButton };
export default WBButton;
