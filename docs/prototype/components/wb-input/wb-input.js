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
 * @version 2.0.0
 * @author Website Builder Team
 */

(function() {
    'use strict';
    
    if (window.WBEventLog) {
        WBEventLog.logInfo('WB Input Web Component: Starting initialization...', { 
            component: 'wb-input', 
            method: 'moduleLoad', 
            line: 23 
        });
    } else {
        console.log('📝 WB Input Web Component: Starting initialization...');
    }

    // Configuration fallback - used if JSON loading fails
    const fallbackConfig = {
        component: {
            name: 'wb-input',
            version: '2.0.0',
            description: 'Website Builder standardized input component'
        },
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
        },
        attributes: {
            type: 'type',
            label: 'label',
            placeholder: 'placeholder',
            value: 'value',
            size: 'size',
            disabled: 'disabled',
            readonly: 'readonly',
            required: 'required',
            maxLength: 'max-length',
            minLength: 'min-length',
            pattern: 'pattern',
            help: 'help',
            validationRules: 'validation-rules'
        },
        events: {
            ready: 'wb-input:ready',
            change: 'wb-input:change',
            validate: 'wb-input:validate',
            focus: 'wb-input:focus',
            blur: 'wb-input:blur'
        }
    };

    class WBInput extends HTMLElement {
        constructor() {
            super();
            
            // Component state
            this.config = fallbackConfig;
            this.initialized = false;
            this.utils = null;
            this.inputElement = null;
            this.labelElement = null;
            this.messageElement = null;
            this.counterElement = null;
            
            // Bind methods
            this.handleInput = this.handleInput.bind(this);
            this.handleFocus = this.handleFocus.bind(this);
            this.handleBlur = this.handleBlur.bind(this);
        }

        async connectedCallback() {
            try {
                await this.initialize();
            } catch (error) {
                if (window.WBEventLog) {
                    WBEventLog.logError('WB Input initialization failed', { 
                        component: 'wb-input', 
                        method: 'connectedCallback', 
                        line: 112, 
                        error: error.message, 
                        stack: error.stack 
                    });
                } else {
                    console.error('📝 WB Input initialization failed:', error);
                }
                this.initializeFallback();
            }
        }

        disconnectedCallback() {
            this.cleanup();
        }

        // Observed attributes for reactivity
        static get observedAttributes() {
            return ['type', 'label', 'placeholder', 'value', 'size', 'disabled', 
                   'readonly', 'required', 'max-length', 'min-length', 'pattern', 
                   'help', 'validation-rules'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (!this.initialized || oldValue === newValue) return;
            
            switch (name) {
                case 'type':
                    this.updateType();
                    break;
                case 'label':
                    this.updateLabel();
                    break;
                case 'placeholder':
                    this.updatePlaceholder();
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
                case 'readonly':
                    this.updateReadonly();
                    break;
                case 'required':
                    this.updateRequired();
                    break;
                case 'max-length':
                    this.updateMaxLength();
                    break;
                case 'help':
                    this.updateHelp();
                    break;
                default:
                    this.updateInputAttributes();
                    break;
            }
        }

        async initialize() {
            if (window.WBEventLog) {
                WBEventLog.logInfo('WB Input Web Component: initialize() called', { 
                    component: 'wb-input', 
                    method: 'initialize', 
                    line: 169, 
                    type: this.getAttribute('type') || 'text' 
                });
            } else {
                console.log(`📝 WB Input Web Component: initialize() called for type "${this.getAttribute('type') || 'text'}"`); 
            }
            
            // Load utilities
            await this.loadUtils();
            
            // Load configuration
            await this.loadConfig();
            
            // Load CSS
            await this.loadCSS();
            
            // Initialize component
            this.initializeComponent();
            
            // Mark as initialized
            this.initialized = true;
            
            // Dispatch ready event
            this.dispatchReady();
        }

        async loadUtils() {
            if (!window.WBComponentUtils) {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = '../wb-component-utils.js';
                    script.onload = () => {
                        this.utils = window.WBComponentUtils;
                        resolve();
                    };
                    script.onerror = () => reject(new Error('Failed to load WBComponentUtils'));
                    document.head.appendChild(script);
                });
            } else {
                this.utils = window.WBComponentUtils;
            }
        }

        async loadConfig() {
            if (this.utils) {
                try {
                    const configPath = this.utils.getPath('wb-input.js', '../components/wb-input/') + 'wb-input.json';
                    this.config = await this.utils.loadConfig(configPath, fallbackConfig, 'WB Input');
                } catch (error) {
                    if (window.WBEventLog) {
                        WBEventLog.logWarning('WB Input: Using fallback config', { 
                            component: 'wb-input', 
                            method: 'loadConfig', 
                            line: 213, 
                            error: error.message 
                        });
                    } else {
                        console.warn('📝 WB Input: Using fallback config:', error.message);
                    }
                    this.config = fallbackConfig;
                }
            }
        }

        async loadCSS() {
            if (this.utils) {
                const cssPath = this.utils.getPath('wb-input.js', '../components/wb-input/') + 'wb-input.css';
                await this.utils.loadCSS('wb-input', cssPath);
            }
        }

        initializeComponent() {
            // Create the input structure
            this.createInputStructure();
            
            // Apply initial attributes
            this.applyAttributes();
            
            // Setup event listeners
            this.setupEventListeners();
        }

        initializeFallback() {
            if (window.WBEventLog) {
                WBEventLog.logWarning('WB Input: Initializing with basic functionality', { 
                    component: 'wb-input', 
                    method: 'initializeFallback', 
                    line: 238 
                });
            } else {
                console.warn('📝 WB Input: Initializing with basic functionality');
            }
            this.classList.add('wb-input');
            this.createInputStructure();
            this.setupEventListeners();
        }

        createInputStructure() {
            // Clear existing content
            this.innerHTML = '';
            
            // Create wrapper div
            const wrapper = document.createElement('div');
            wrapper.className = this.config.classes.wrapper;
            
            // Create label if specified
            const labelText = this.getAttribute('label');
            if (labelText) {
                this.labelElement = document.createElement('label');
                this.labelElement.className = this.config.classes.label;
                this.labelElement.textContent = labelText;
                wrapper.appendChild(this.labelElement);
            }
            
            // Create input element
            const inputType = this.getAttribute('type') || this.config.defaults.type;
            const isTextarea = inputType === 'textarea';
            
            this.inputElement = document.createElement(isTextarea ? 'textarea' : 'input');
            this.inputElement.className = this.config.classes.input;
            
            if (!isTextarea) {
                this.inputElement.type = inputType;
            }
            
            wrapper.appendChild(this.inputElement);
            
            // Create help text if specified
            const helpText = this.getAttribute('help');
            if (helpText) {
                const helpElement = document.createElement('div');
                helpElement.className = `${this.config.classes.message} wb-input__message--help`;
                helpElement.textContent = helpText;
                wrapper.appendChild(helpElement);
            }
            
            // Add wrapper to component
            this.appendChild(wrapper);
            
            // Set base classes
            this.classList.add(this.config.classes.base);
            
            // Apply variant class if needed
            const variant = this.config.classes.variants[inputType];
            if (variant) {
                this.classList.add(variant);
            }
        }

        applyAttributes() {
            if (!this.inputElement) return;
            
            // Apply basic attributes
            const placeholder = this.getAttribute('placeholder');
            if (placeholder) this.inputElement.placeholder = placeholder;
            
            const value = this.getAttribute('value');
            if (value) this.inputElement.value = value;
            
            // Apply boolean attributes
            if (this.hasAttribute('disabled')) this.inputElement.disabled = true;
            if (this.hasAttribute('readonly')) this.inputElement.readOnly = true;
            if (this.hasAttribute('required')) this.inputElement.required = true;
            
            // Apply validation attributes
            const maxLength = this.getAttribute('max-length');
            if (maxLength) this.inputElement.maxLength = parseInt(maxLength);
            
            const minLength = this.getAttribute('min-length');
            if (minLength) this.inputElement.minLength = parseInt(minLength);
            
            const pattern = this.getAttribute('pattern');
            if (pattern) this.inputElement.pattern = pattern;
            
            // Apply size
            this.updateSize();
            
            // Create character counter if max-length is set
            if (maxLength) {
                this.createCharacterCounter();
            }
        }

        createCharacterCounter() {
            if (this.counterElement) return;
            
            const maxLength = this.getAttribute('max-length');
            this.counterElement = document.createElement('div');
            this.counterElement.className = this.config.classes.counter;
            this.counterElement.textContent = `0/${maxLength}`;
            
            const wrapper = this.querySelector(`.${this.config.classes.wrapper}`);
            if (wrapper) {
                wrapper.appendChild(this.counterElement);
            }
            
            this.updateCharacterCounter();
        }

        updateCharacterCounter() {
            if (!this.counterElement || !this.inputElement) return;
            
            const maxLength = this.getAttribute('max-length');
            const current = this.inputElement.value.length;
            this.counterElement.textContent = `${current}/${maxLength}`;
            
            if (current > maxLength) {
                this.counterElement.classList.add('wb-input__counter--over-limit');
            } else {
                this.counterElement.classList.remove('wb-input__counter--over-limit');
            }
        }

        setupEventListeners() {
            if (!this.inputElement) return;
            
            this.inputElement.addEventListener('input', this.handleInput);
            this.inputElement.addEventListener('focus', this.handleFocus);
            this.inputElement.addEventListener('blur', this.handleBlur);
            
            // Link label to input for accessibility
            if (this.labelElement && this.inputElement) {
                const inputId = this.inputElement.id || window.WBComponentUtils.generateId();
                this.inputElement.id = inputId;
                this.labelElement.setAttribute('for', inputId);
            }
        }

        handleInput(event) {
            // Clear error state on input
            this.clearError();
            
            // Update character counter
            this.updateCharacterCounter();
            
            // Dispatch change event
            this.dispatchEvent(new CustomEvent(this.config.events.change, {
                detail: { 
                    input: this.inputElement,
                    value: this.inputElement.value,
                    component: this
                },
                bubbles: true
            }));
        }

        handleFocus(event) {
            this.classList.add(this.config.classes.states.focused);
            
            this.dispatchEvent(new CustomEvent(this.config.events.focus, {
                detail: { 
                    input: this.inputElement,
                    component: this
                },
                bubbles: true
            }));
        }

        handleBlur(event) {
            this.classList.remove(this.config.classes.states.focused);
            
            this.dispatchEvent(new CustomEvent(this.config.events.blur, {
                detail: { 
                    input: this.inputElement,
                    component: this
                },
                bubbles: true
            }));
            
            // Auto-validate on blur if validation rules are set
            const validationRules = this.getAttribute('validation-rules');
            if (validationRules) {
                try {
                    const rules = JSON.parse(validationRules);
                    this.validate(rules);
                } catch (e) {
                    if (window.WBEventLog) {
                        WBEventLog.logWarning('WB Input: Invalid validation rules JSON', { 
                            component: 'wb-input', 
                            method: 'handleBlur', 
                            line: 423 
                        });
                    } else {
                        console.warn('📝 WB Input: Invalid validation rules JSON');
                    }
                }
            }
        }

        // Update methods for attribute changes
        updateType() {
            if (this.inputElement && this.inputElement.tagName === 'INPUT') {
                this.inputElement.type = this.getAttribute('type') || this.config.defaults.type;
            }
        }

        updateLabel() {
            if (this.labelElement) {
                this.labelElement.textContent = this.getAttribute('label') || '';
            }
        }

        updatePlaceholder() {
            if (this.inputElement) {
                this.inputElement.placeholder = this.getAttribute('placeholder') || '';
            }
        }

        updateValue() {
            if (this.inputElement) {
                this.inputElement.value = this.getAttribute('value') || '';
                this.updateCharacterCounter();
            }
        }

        updateSize() {
            const size = this.getAttribute('size') || this.config.defaults.size;
            
            // Remove existing size classes
            Object.values(this.config.classes.sizes).forEach(cls => {
                if (cls) this.classList.remove(cls);
            });
            
            // Add new size class
            const sizeClass = this.config.classes.sizes[size];
            if (sizeClass) {
                this.classList.add(sizeClass);
            }
        }

        updateDisabled() {
            if (this.inputElement) {
                this.inputElement.disabled = this.hasAttribute('disabled');
                
                if (this.hasAttribute('disabled')) {
                    this.classList.add(this.config.classes.states.disabled);
                } else {
                    this.classList.remove(this.config.classes.states.disabled);
                }
            }
        }

        updateReadonly() {
            if (this.inputElement) {
                this.inputElement.readOnly = this.hasAttribute('readonly');
            }
        }

        updateRequired() {
            if (this.inputElement) {
                this.inputElement.required = this.hasAttribute('required');
            }
        }

        updateMaxLength() {
            if (this.inputElement) {
                const maxLength = this.getAttribute('max-length');
                if (maxLength) {
                    this.inputElement.maxLength = parseInt(maxLength);
                    this.createCharacterCounter();
                } else {
                    this.inputElement.removeAttribute('maxlength');
                    if (this.counterElement) {
                        this.counterElement.remove();
                        this.counterElement = null;
                    }
                }
            }
        }

        updateHelp() {
            const wrapper = this.querySelector(`.${this.config.classes.wrapper}`);
            if (!wrapper) return;
            
            // Remove existing help text
            const existingHelp = wrapper.querySelector('.wb-input__message--help');
            if (existingHelp) {
                existingHelp.remove();
            }
            
            // Add new help text
            const helpText = this.getAttribute('help');
            if (helpText) {
                const helpElement = document.createElement('div');
                helpElement.className = `${this.config.classes.message} wb-input__message--help`;
                helpElement.textContent = helpText;
                wrapper.appendChild(helpElement);
            }
        }

        updateInputAttributes() {
            if (!this.inputElement) return;
            
            const minLength = this.getAttribute('min-length');
            if (minLength) {
                this.inputElement.minLength = parseInt(minLength);
            }
            
            const pattern = this.getAttribute('pattern');
            if (pattern) {
                this.inputElement.pattern = pattern;
            }
        }

        // Public API methods
        getValue() {
            return this.inputElement ? this.inputElement.value : '';
        }

        setValue(value) {
            if (this.inputElement) {
                this.inputElement.value = value;
                this.updateCharacterCounter();
                this.handleInput();
            }
        }

        focus() {
            if (this.inputElement) {
                this.inputElement.focus();
            }
        }

        blur() {
            if (this.inputElement) {
                this.inputElement.blur();
            }
        }

        validate(rules = {}) {
            if (!this.inputElement) return true;
            
            const value = this.inputElement.value;
            
            // Use utility validation if available
            if (this.utils && this.utils.validate) {
                const result = this.utils.validate(value, rules);
                if (!result.isValid) {
                    this.setError(result.message);
                    return false;
                } else {
                    this.clearError();
                    if (rules.showSuccess) {
                        this.setSuccess();
                    }
                }
                return true;
            }
            
            // Fallback validation
            let isValid = true;
            let errorMessage = '';
            
            // Check required
            if (rules.required && (!value || value.trim().length === 0)) {
                isValid = false;
                errorMessage = 'Field is required';
            }
            
            // Check type-specific validation
            if (value && rules.type) {
                switch (rules.type) {
                    case 'email':
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                            isValid = false;
                            errorMessage = 'Please enter a valid email';
                        }
                        break;
                    case 'url':
                        if (!/^https?:\/\/.+/.test(value)) {
                            isValid = false;
                            errorMessage = 'Please enter a valid URL';
                        }
                        break;
                    case 'number':
                        if (isNaN(value) || isNaN(parseFloat(value))) {
                            isValid = false;
                            errorMessage = 'Please enter a valid number';
                        }
                        break;
                }
            }
            
            // Check length constraints
            if (value && rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMessage = `Minimum ${rules.minLength} characters required`;
            }
            
            if (value && rules.maxLength && value.length > rules.maxLength) {
                isValid = false;
                errorMessage = `Maximum ${rules.maxLength} characters allowed`;
            }
            
            // Update UI based on validation result
            if (!isValid) {
                this.setError(errorMessage);
            } else {
                this.clearError();
                if (rules.showSuccess) {
                    this.setSuccess();
                }
            }
            
            // Dispatch validation event
            this.dispatchEvent(new CustomEvent(this.config.events.validate, {
                detail: { 
                    input: this.inputElement,
                    valid: isValid,
                    message: errorMessage,
                    component: this
                },
                bubbles: true
            }));
            
            return isValid;
        }

        setError(message) {
            // Remove other states
            this.classList.remove(this.config.classes.states.success, this.config.classes.states.warning);
            this.classList.add(this.config.classes.states.error);
            
            // Add or update error message
            const wrapper = this.querySelector(`.${this.config.classes.wrapper}`);
            if (!wrapper) return;
            
            let messageEl = wrapper.querySelector(`.${this.config.classes.message}:not(.wb-input__message--help)`);
            if (!messageEl) {
                messageEl = document.createElement('div');
                messageEl.className = this.config.classes.message;
                wrapper.appendChild(messageEl);
            }
            messageEl.textContent = message;
            
            // Add shake animation
            this.classList.add('wb-input--animate');
            setTimeout(() => this.classList.remove('wb-input--animate'), 300);
        }

        setSuccess(message = '') {
            // Remove other states
            this.classList.remove(this.config.classes.states.error, this.config.classes.states.warning);
            this.classList.add(this.config.classes.states.success);
            
            if (message) {
                const wrapper = this.querySelector(`.${this.config.classes.wrapper}`);
                if (!wrapper) return;
                
                let messageEl = wrapper.querySelector(`.${this.config.classes.message}:not(.wb-input__message--help)`);
                if (!messageEl) {
                    messageEl = document.createElement('div');
                    messageEl.className = this.config.classes.message;
                    wrapper.appendChild(messageEl);
                }
                messageEl.textContent = message;
            }
        }

        clearError() {
            this.classList.remove(
                this.config.classes.states.error,
                this.config.classes.states.success,
                this.config.classes.states.warning
            );
            
            // Remove error message (but keep help text)
            const wrapper = this.querySelector(`.${this.config.classes.wrapper}`);
            if (wrapper) {
                const messageEl = wrapper.querySelector(`.${this.config.classes.message}:not(.wb-input__message--help)`);
                if (messageEl) {
                    messageEl.remove();
                }
            }
        }


        cleanup() {
            if (this.inputElement) {
                this.inputElement.removeEventListener('input', this.handleInput);
                this.inputElement.removeEventListener('focus', this.handleFocus);
                this.inputElement.removeEventListener('blur', this.handleBlur);
            }
        }

        dispatchReady() {
            if (this.utils) {
                this.utils.EventDispatcher.dispatchReady('wb-input', this.config);
            } else {
                this.dispatchEvent(new CustomEvent(this.config.events.ready, {
                    detail: { component: 'wb-input', config: this.config },
                    bubbles: true
                }));
            }
            
            if (window.WBEventLog) {
                WBEventLog.logSuccess('WB Input Web Component: Initialized successfully', { 
                    component: 'wb-input', 
                    method: 'dispatchReady', 
                    line: 734 
                });
            } else {
                console.log('📝 WB Input Web Component: Initialized successfully');
            }
        }
    }

    // Static utility methods for backward compatibility
    WBInput.create = function(type = 'text', options = {}) {
        const wbInput = document.createElement('wb-input');
        
        // Set attributes based on options
        wbInput.setAttribute('type', type);
        if (options.label) wbInput.setAttribute('label', options.label);
        if (options.placeholder) wbInput.setAttribute('placeholder', options.placeholder);
        if (options.value) wbInput.setAttribute('value', options.value);
        if (options.size) wbInput.setAttribute('size', options.size);
        if (options.help) wbInput.setAttribute('help', options.help);
        if (options.maxLength) wbInput.setAttribute('max-length', options.maxLength);
        if (options.minLength) wbInput.setAttribute('min-length', options.minLength);
        if (options.pattern) wbInput.setAttribute('pattern', options.pattern);
        if (options.disabled) wbInput.setAttribute('disabled', '');
        if (options.readonly) wbInput.setAttribute('readonly', '');
        if (options.required) wbInput.setAttribute('required', '');
        if (options.id) wbInput.setAttribute('id', options.id);
        
        return wbInput;
    };

    WBInput.validate = function(element, rules) {
        return element.validate ? element.validate(rules) : false;
    };

    WBInput.setError = function(element, message) {
        if (element.setError) element.setError(message);
    };

    WBInput.setSuccess = function(element, message) {
        if (element.setSuccess) element.setSuccess(message);
    };

    WBInput.clearError = function(element) {
        if (element.clearError) element.clearError();
    };

    WBInput.getValue = function(element) {
        return element.getValue ? element.getValue() : '';
    };

    WBInput.setValue = function(element, value) {
        if (element.setValue) element.setValue(value);
    };

    WBInput.setDisabled = function(element, disabled) {
        if (disabled) {
            element.setAttribute('disabled', '');
        } else {
            element.removeAttribute('disabled');
        }
    };

    WBInput.initializeExisting = function() {
        // No longer needed with Web Components
        if (window.WBEventLog) {
            WBEventLog.logInfo('WB Input: initializeExisting() called but not needed with Web Components', { 
                component: 'wb-input', 
                method: 'initializeExisting', 
                line: 794 
            });
        } else {
            console.log('📝 WB Input: initializeExisting() called but not needed with Web Components');
        }
    };

    // Register the custom element
    if (customElements && !customElements.get('wb-input')) {
        customElements.define('wb-input', WBInput);
        if (window.WBEventLog) {
            WBEventLog.logSuccess('WB Input Web Component: Custom element registered', { 
                component: 'wb-input', 
                method: 'componentRegistration', 
                line: 800 
            });
        } else {
            console.log('📝 WB Input Web Component: Custom element registered');
        }
    } else if (customElements.get('wb-input')) {
        if (window.WBEventLog) {
            WBEventLog.logInfo('WB Input Web Component: Already registered', { 
                component: 'wb-input', 
                method: 'componentRegistration', 
                line: 802 
            });
        } else {
            console.log('📝 WB Input Web Component: Already registered');
        }
    } else {
        if (window.WBEventLog) {
            WBEventLog.logError('WB Input Web Component: Custom Elements not supported', { 
                component: 'wb-input', 
                method: 'componentRegistration', 
                line: 804 
            });
        } else {
            console.error('📝 WB Input Web Component: Custom Elements not supported');
        }
    }
    
    // Register with WBComponentRegistry if available
    if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
        window.WBComponentRegistry.register('wb-input', WBInput, ['wb-event-log'], {
            version: '1.0.0',
            type: 'form',
            role: 'ui-element',
            description: 'Enhanced input component with validation, theming, and accessibility features',
            api: {
                static: ['create', 'initializeExisting'],
                events: ['input', 'change', 'focus', 'blur', 'validation-changed'],
                attributes: ['type', 'placeholder', 'required', 'disabled', 'readonly', 'validation-pattern'],
                methods: ['render', 'getValue', 'setValue', 'validate', 'focus', 'blur']
            },
            priority: 4 // UI component depends on infrastructure
        });
    }
    
    // Expose for backward compatibility
    window.WBInput = WBInput;    // Dispatch component loaded event
    document.dispatchEvent(new CustomEvent('wbInputReady', {
        detail: { component: 'wb-input', version: '2.0.0' }
    }));

})();