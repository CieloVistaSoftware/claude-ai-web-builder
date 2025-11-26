/**
 * WB Toggle Component
 * 
 * Toggle switch component with accessibility and theming support.
 * 
 * @example
 * <wb-toggle label="Dark Mode" checked></wb-toggle>
 * 
 * @version 2.0.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBToggle extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
        this._initialized = false;
        this._input = null;
        this._slider = null;
        this._labelElement = null;
        
        this.config = {
            classes: {
                base: 'wb-toggle',
                wrapper: 'wb-toggle-wrapper',
                input: 'wb-toggle-input',
                slider: 'wb-toggle-slider',
                thumb: 'wb-toggle-thumb',
                label: 'wb-toggle-label',
                states: { checked: 'wb-toggle--checked', disabled: 'wb-toggle--disabled', focused: 'wb-toggle--focused' },
                positions: {
                    'left': 'wb-toggle--label-left',
                    'right': 'wb-toggle--label-right',
                    'top': 'wb-toggle--label-top',
                    'bottom': 'wb-toggle--label-bottom'
                },
                sizes: { 'small': 'wb-toggle--small', 'large': 'wb-toggle--large' },
                variants: { 'secondary': 'wb-toggle--secondary', 'success': 'wb-toggle--success', 'danger': 'wb-toggle--danger' }
            },
            defaults: { size: 'standard', labelPosition: 'right', variant: 'primary' }
        };
    }
    
    static get observedAttributes() {
        return ['checked', 'disabled', 'label', 'size', 'label-position', 'variant'];
    }
    
    async connectedCallback() {
        super.connectedCallback();
        
        if (this._initialized) return;
        this._initialized = true;
        
        this.logInfo('WBToggle connecting', { label: this.label });
        
        await loadComponentCSS(this, 'wb-toggle.css');
        this.render();
        this.setupEventListeners();
        
        this.fireEvent('wb-toggle:ready', { component: 'wb-toggle' });
        this.logInfo('WBToggle ready');
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        this.logDebug('WBToggle disconnected');
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (!this._initialized || oldValue === newValue) return;
        
        switch (name) {
            case 'checked':
                this.updateCheckedState();
                break;
            case 'disabled':
                this.updateDisabledState();
                break;
            case 'label':
            case 'size':
            case 'label-position':
            case 'variant':
                this.render();
                break;
        }
    }
    
    // Property getters/setters
    get checked() {
        return this.hasAttribute('checked');
    }
    
    set checked(value) {
        if (value) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }
    }
    
    get disabled() {
        return this.hasAttribute('disabled');
    }
    
    set disabled(value) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }
    
    get label() {
        return this.getAttr('label', '');
    }
    
    set label(value) {
        this.setAttr('label', value);
    }
    
    get size() {
        return this.getAttr('size', 'standard');
    }
    
    set size(value) {
        this.setAttr('size', value);
    }
    
    get variant() {
        return this.getAttr('variant', 'primary');
    }
    
    set variant(value) {
        this.setAttr('variant', value);
    }
    
    render() {
        if (!this.shadowRoot) return;
        
        const checked = this.checked;
        const disabled = this.disabled;
        const label = this.label || this.textContent.trim() || '';
        const size = this.size;
        const labelPosition = this.getAttr('label-position', 'right');
        const variant = this.variant;
        const id = this.id || `wb-toggle-${Date.now()}`;
        
        // Build class list
        let wrapperClass = this.config.classes.wrapper;
        if (size !== 'standard' && this.config.classes.sizes[size]) {
            wrapperClass += ' ' + this.config.classes.sizes[size];
        }
        if (this.config.classes.positions[labelPosition]) {
            wrapperClass += ' ' + this.config.classes.positions[labelPosition];
        }
        if (variant !== 'primary' && this.config.classes.variants[variant]) {
            wrapperClass += ' ' + this.config.classes.variants[variant];
        }
        if (disabled) {
            wrapperClass += ' ' + this.config.classes.states.disabled;
        }
        if (checked) {
            wrapperClass += ' ' + this.config.classes.states.checked;
        }
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('./wb-toggle.css', import.meta.url).href}">
            <div class="${wrapperClass}">
                <input type="checkbox" 
                       id="${id}" 
                       class="${this.config.classes.input}" 
                       ${checked ? 'checked' : ''} 
                       ${disabled ? 'disabled' : ''}
                       role="switch"
                       aria-checked="${checked}">
                <div class="${this.config.classes.slider}" aria-hidden="true" tabindex="${disabled ? -1 : 0}">
                    <div class="${this.config.classes.thumb}"></div>
                </div>
                ${label ? `<label class="${this.config.classes.label}" for="${id}">${label}</label>` : ''}
            </div>
        `;
        
        // Cache elements
        this._input = this.shadowRoot.querySelector('input');
        this._slider = this.shadowRoot.querySelector(`.${this.config.classes.slider}`);
        this._labelElement = this.shadowRoot.querySelector('label');
        
        this.setupEventListeners();
    }
    
    updateCheckedState() {
        const wrapper = this.shadowRoot?.querySelector(`.${this.config.classes.wrapper}`);
        if (!wrapper || !this._input) return;
        
        this._input.checked = this.checked;
        this._input.setAttribute('aria-checked', this.checked.toString());
        wrapper.classList.toggle(this.config.classes.states.checked, this.checked);
    }
    
    updateDisabledState() {
        const wrapper = this.shadowRoot?.querySelector(`.${this.config.classes.wrapper}`);
        if (!wrapper || !this._input) return;
        
        this._input.disabled = this.disabled;
        if (this._slider) {
            this._slider.setAttribute('tabindex', this.disabled ? '-1' : '0');
        }
        wrapper.classList.toggle(this.config.classes.states.disabled, this.disabled);
    }
    
    setupEventListeners() {
        if (!this._input || !this._slider) return;

        this._input.addEventListener('change', (e) => {
            this.checked = this._input.checked;
            this.updateCheckedState();
            
            this.fireEvent('wb-toggle:change', {
                checked: this._input.checked,
                id: this._input.id
            });
            
            this.logDebug('WBToggle changed', { checked: this._input.checked });
        });

        this._input.addEventListener('focus', () => {
            const wrapper = this.shadowRoot?.querySelector(`.${this.config.classes.wrapper}`);
            if (wrapper) wrapper.classList.add(this.config.classes.states.focused);
        });
        
        this._input.addEventListener('blur', () => {
            const wrapper = this.shadowRoot?.querySelector(`.${this.config.classes.wrapper}`);
            if (wrapper) wrapper.classList.remove(this.config.classes.states.focused);
        });

        this._slider.addEventListener('click', (e) => {
            if (!this._input.disabled) {
                this._input.click();
            }
        });

        this._slider.addEventListener('keydown', (e) => {
            if (!this._input.disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this._input.click();
            }
        });
    }
    
    // Public API
    toggle() {
        if (!this.disabled) {
            this.checked = !this.checked;
            this.updateCheckedState();
            this.fireEvent('wb-toggle:change', { checked: this.checked });
        }
    }
    
    setChecked(checked) {
        this.checked = checked;
        this.updateCheckedState();
    }
    
    getChecked() {
        return this.checked;
    }
    
    setDisabled(disabled) {
        this.disabled = disabled;
        this.updateDisabledState();
    }
    
    setLabel(label) {
        this.label = label;
    }
}

// Register the Web Component
if (!customElements.get('wb-toggle')) {
    customElements.define('wb-toggle', WBToggle);
}

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-toggle', WBToggle, ['wb-event-log'], {
        version: '2.0.0',
        type: 'form',
        role: 'ui-element',
        description: 'Toggle switch component with customizable styling and accessibility support',
        api: {
            events: ['wb-toggle:ready', 'wb-toggle:change'],
            attributes: ['checked', 'disabled', 'label', 'size', 'label-position', 'variant'],
            methods: ['toggle', 'setChecked', 'getChecked', 'setDisabled', 'setLabel', 'render']
        },
        priority: 4
    });
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBToggle = WBToggle;
window.WBToggle = WBToggle;

export { WBToggle };
export default WBToggle;
