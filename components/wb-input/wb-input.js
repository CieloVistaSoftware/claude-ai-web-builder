/**
 * WB Input Web Component
 * 
 * A standardized input component with validation, theming support, and consistent styling.
 * Supports various input types, validation rules, and visual states.
 * 
 * @example
 * <wb-input type="text" label="Name" placeholder="Enter your name" required></wb-input>
 * <wb-input type="email" label="Email" validation-rules='{"required": true, "type": "email"}'></wb-input>
 * 
 * @events
 * - wb-input:ready - Fired when component is fully initialized
 * - wb-input:change - Fired when input value changes
 * - wb-input:validate - Fired when validation occurs
 * 
 * @version 2.1.0
 * @author Website Builder Team
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

// Configuration fallback
const fallbackConfig = {
    classes: {
        base: 'wb-input',
        wrapper: 'wb-input-wrapper',
        label: 'wb-input-label',
        input: 'wb-input-field',
        message: 'wb-input-message',
        counter: 'wb-input-counter',
        variants: {
            text: 'wb-input--text',
            email: 'wb-input--email',
            password: 'wb-input--password',
            search: 'wb-input--search',
            url: 'wb-input--url',
            tel: 'wb-input--tel',
            textarea: 'wb-input--textarea'
        },
        sizes: {
            small: 'wb-input--small',
            medium: '',
            large: 'wb-input--large'
        },
        states: {
            error: 'wb-input--error',
            success: 'wb-input--success',
            warning: 'wb-input--warning',
            disabled: 'wb-input--disabled',
            focused: 'wb-input--focused'
        }
    },
    defaults: {
        type: 'text',
        size: 'medium'
    }
};

class WBInput extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
        
        this.config = fallbackConfig;
        this.initialized = false;
        this.inputElement = null;
        this.labelElement = null;
        this.messageElement = null;
        this.counterElement = null;
        
        // Bind methods
        this.handleInput = this.handleInput.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    static get observedAttributes() {
        return ['type', 'label', 'placeholder', 'value', 'size', 'disabled', 
               'readonly', 'required', 'max-length', 'min-length', 'pattern', 
               'help', 'validation-rules'];
    }

    async connectedCallback() {
        super.connectedCallback();
        
        this.logInfo('WBInput connecting', { type: this.type });
        
        await loadComponentCSS(this, 'wb-input.css');
        this.render();
        this.setupEventListeners();
        this.initialized = true;
        
        this.fireEvent('wb-input:ready', { component: 'wb-input', type: this.type });
        this.logInfo('WBInput ready', { type: this.type });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanup();
        this.logDebug('WBInput disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (!this.initialized || oldValue === newValue) return;
        
        switch (name) {
            case 'type':
            case 'label':
            case 'placeholder':
            case 'help':
                this.render();
                break;
            case 'value':
                this.updateValue();
                break;
            case 'size':
                this.updateSize();
                break;
            case 'disabled':
                this.updateDisabled();
                break;
            case 'max-length':
                this.updateMaxLength();
                break;
        }
    }

    // Property getters/setters
    get type() {
        return this.getAttr('type', 'text');
    }
    
    set type(value) {
        this.setAttr('type', value);
    }
    
    get label() {
        return this.getAttr('label', '');
    }
    
    set label(value) {
        this.setAttr('label', value);
    }
    
    get placeholder() {
        return this.getAttr('placeholder', '');
    }
    
    set placeholder(value) {
        this.setAttr('placeholder', value);
    }
    
    get value() {
        return this.inputElement ? this.inputElement.value : this.getAttr('value', '');
    }
    
    set value(val) {
        this.setAttr('value', val);
        if (this.inputElement) {
            this.inputElement.value = val;
        }
    }
    
    get size() {
        return this.getAttr('size', 'medium');
    }
    
    set size(value) {
        this.setAttr('size', value);
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

    render() {
        if (!this.shadowRoot) return;
        
        const inputType = this.type;
        const isTextarea = inputType === 'textarea';
        const labelText = this.label;
        const helpText = this.getAttr('help', '');
        const maxLength = this.getAttr('max-length', '');
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('./wb-input.css', import.meta.url).href}">
            <div class="${this.config.classes.wrapper}">
                ${labelText ? `<label class="${this.config.classes.label}">${labelText}</label>` : ''}
                ${isTextarea 
                    ? `<textarea class="${this.config.classes.input}" placeholder="${this.placeholder}"></textarea>`
                    : `<input type="${inputType}" class="${this.config.classes.input}" placeholder="${this.placeholder}">`
                }
                ${helpText ? `<div class="${this.config.classes.message} wb-input__message--help">${helpText}</div>` : ''}
                ${maxLength ? `<div class="${this.config.classes.counter}">0/${maxLength}</div>` : ''}
            </div>
        `;
        
        // Cache elements
        this.inputElement = this.shadowRoot.querySelector('input, textarea');
        this.labelElement = this.shadowRoot.querySelector('label');
        this.counterElement = this.shadowRoot.querySelector(`.${this.config.classes.counter}`);
        
        // Apply initial values
        this.applyAttributes();
        
        // Re-setup listeners after render
        this.setupEventListeners();
    }

    applyAttributes() {
        if (!this.inputElement) return;
        
        const value = this.getAttr('value', '');
        if (value) this.inputElement.value = value;
        
        if (this.hasAttribute('disabled')) this.inputElement.disabled = true;
        if (this.hasAttribute('readonly')) this.inputElement.readOnly = true;
        if (this.hasAttribute('required')) this.inputElement.required = true;
        
        const maxLength = this.getAttr('max-length', '');
        if (maxLength) this.inputElement.maxLength = parseInt(maxLength);
        
        const minLength = this.getAttr('min-length', '');
        if (minLength) this.inputElement.minLength = parseInt(minLength);
        
        const pattern = this.getAttr('pattern', '');
        if (pattern) this.inputElement.pattern = pattern;
        
        this.updateSize();
        this.updateCharacterCounter();
    }

    setupEventListeners() {
        if (!this.inputElement) return;
        
        // Remove old listeners first
        this.inputElement.removeEventListener('input', this.handleInput);
        this.inputElement.removeEventListener('focus', this.handleFocus);
        this.inputElement.removeEventListener('blur', this.handleBlur);
        
        // Add new listeners
        this.inputElement.addEventListener('input', this.handleInput);
        this.inputElement.addEventListener('focus', this.handleFocus);
        this.inputElement.addEventListener('blur', this.handleBlur);
    }

    handleInput(event) {
        this.clearError();
        this.updateCharacterCounter();
        
        this.fireEvent('wb-input:change', { 
            value: this.inputElement.value,
            component: this
        });
        
        this.logDebug('WBInput value changed', { value: this.inputElement.value });
    }

    handleFocus(event) {
        this.classList.add(this.config.classes.states.focused);
        this.fireEvent('wb-input:focus', { component: this });
    }

    handleBlur(event) {
        this.classList.remove(this.config.classes.states.focused);
        this.fireEvent('wb-input:blur', { component: this });
        
        // Auto-validate on blur
        const validationRules = this.getAttr('validation-rules', '');
        if (validationRules) {
            try {
                const rules = JSON.parse(validationRules);
                this.validate(rules);
            } catch (e) {
                this.logError('Invalid validation rules JSON', { error: e.message });
            }
        }
    }

    updateValue() {
        if (this.inputElement) {
            this.inputElement.value = this.getAttr('value', '');
            this.updateCharacterCounter();
        }
    }

    updateSize() {
        const size = this.size;
        Object.values(this.config.classes.sizes).forEach(cls => {
            if (cls) this.classList.remove(cls);
        });
        const sizeClass = this.config.classes.sizes[size];
        if (sizeClass) this.classList.add(sizeClass);
    }

    updateDisabled() {
        if (this.inputElement) {
            this.inputElement.disabled = this.disabled;
            this.classList.toggle(this.config.classes.states.disabled, this.disabled);
        }
    }

    updateMaxLength() {
        if (this.inputElement) {
            const maxLength = this.getAttr('max-length', '');
            if (maxLength) {
                this.inputElement.maxLength = parseInt(maxLength);
            }
            this.updateCharacterCounter();
        }
    }

    updateCharacterCounter() {
        if (!this.counterElement || !this.inputElement) return;
        
        const maxLength = this.getAttr('max-length', '');
        const current = this.inputElement.value.length;
        this.counterElement.textContent = `${current}/${maxLength}`;
        this.counterElement.classList.toggle('wb-input__counter--over-limit', current > parseInt(maxLength));
    }

    // Public API
    getValue() {
        return this.inputElement ? this.inputElement.value : '';
    }

    setValue(value) {
        if (this.inputElement) {
            this.inputElement.value = value;
            this.updateCharacterCounter();
        }
    }

    focus() {
        if (this.inputElement) this.inputElement.focus();
    }

    blur() {
        if (this.inputElement) this.inputElement.blur();
    }

    validate(rules = {}) {
        if (!this.inputElement) return true;
        
        const value = this.inputElement.value;
        let isValid = true;
        let errorMessage = '';
        
        if (rules.required && (!value || value.trim().length === 0)) {
            isValid = false;
            errorMessage = 'Field is required';
        }
        
        if (value && rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email';
        }
        
        if (value && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Minimum ${rules.minLength} characters required`;
        }
        
        if (!isValid) {
            this.setError(errorMessage);
        } else {
            this.clearError();
            if (rules.showSuccess) this.setSuccess();
        }
        
        this.fireEvent('wb-input:validate', { valid: isValid, message: errorMessage });
        this.logDebug('WBInput validated', { valid: isValid, message: errorMessage });
        
        return isValid;
    }

    setError(message) {
        this.classList.remove(this.config.classes.states.success, this.config.classes.states.warning);
        this.classList.add(this.config.classes.states.error);
        
        const wrapper = this.shadowRoot?.querySelector(`.${this.config.classes.wrapper}`);
        if (!wrapper) return;
        
        let messageEl = wrapper.querySelector(`.${this.config.classes.message}:not(.wb-input__message--help)`);
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = this.config.classes.message;
            wrapper.appendChild(messageEl);
        }
        messageEl.textContent = message;
    }

    setSuccess(message = '') {
        this.classList.remove(this.config.classes.states.error, this.config.classes.states.warning);
        this.classList.add(this.config.classes.states.success);
    }

    clearError() {
        this.classList.remove(
            this.config.classes.states.error,
            this.config.classes.states.success,
            this.config.classes.states.warning
        );
        
        const wrapper = this.shadowRoot?.querySelector(`.${this.config.classes.wrapper}`);
        if (wrapper) {
            const messageEl = wrapper.querySelector(`.${this.config.classes.message}:not(.wb-input__message--help)`);
            if (messageEl) messageEl.remove();
        }
    }

    cleanup() {
        if (this.inputElement) {
            this.inputElement.removeEventListener('input', this.handleInput);
            this.inputElement.removeEventListener('focus', this.handleFocus);
            this.inputElement.removeEventListener('blur', this.handleBlur);
        }
    }
}

// Static utility methods
WBInput.create = function(type = 'text', options = {}) {
    const wbInput = document.createElement('wb-input');
    wbInput.setAttribute('type', type);
    if (options.label) wbInput.setAttribute('label', options.label);
    if (options.placeholder) wbInput.setAttribute('placeholder', options.placeholder);
    if (options.value) wbInput.setAttribute('value', options.value);
    if (options.size) wbInput.setAttribute('size', options.size);
    if (options.help) wbInput.setAttribute('help', options.help);
    if (options.maxLength) wbInput.setAttribute('max-length', options.maxLength);
    if (options.disabled) wbInput.setAttribute('disabled', '');
    if (options.required) wbInput.setAttribute('required', '');
    return wbInput;
};

// Register the custom element
if (!customElements.get('wb-input')) {
    customElements.define('wb-input', WBInput);
}

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-input', WBInput, ['wb-event-log'], {
        version: '2.1.0',
        type: 'form',
        role: 'ui-element',
        description: 'Enhanced input component with validation, theming, and accessibility features',
        api: {
            events: ['wb-input:ready', 'wb-input:change', 'wb-input:focus', 'wb-input:blur', 'wb-input:validate'],
            attributes: ['type', 'label', 'placeholder', 'value', 'size', 'disabled', 'readonly', 'required', 'max-length', 'min-length', 'pattern', 'help', 'validation-rules'],
            methods: ['getValue', 'setValue', 'validate', 'focus', 'blur', 'setError', 'clearError']
        },
        priority: 4
    });
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBInput = WBInput;
window.WBInput = WBInput;

export { WBInput };
export default WBInput;
