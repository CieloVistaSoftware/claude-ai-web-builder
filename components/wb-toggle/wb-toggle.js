// WB Toggle Component - Pure Web Component
// Toggle switch component with accessibility and theming support

class WBToggle extends HTMLElement {
    constructor() {
        super();
        this.config = null;
        this._initialized = false;
        this._input = null;
        this._slider = null;
        this._labelElement = null;
        
        WBSafeLogger.debug('WB Toggle: Web Component constructed', { component: 'wb-toggle', method: 'constructor', line: 13 });
    }
    
    static get observedAttributes() {
        return ['checked', 'disabled', 'label', 'size', 'label-position', 'variant'];
    }
    
    async connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;
        
        console.log('🔘 WB Toggle: Connected to DOM');
        
        try {
            await this.loadConfig();
            this.loadCSS();
            this.render();
            this.setupEventListeners();
            this.setupColorResponseHandler();
            
            this.dispatchEvent(new CustomEvent('wbToggleReady', {
                bubbles: true,
                detail: { component: this, config: this.config }
            }));
            
            console.log('🔘 WB Toggle: Web Component initialized successfully');
        } catch (error) {
            WBSafeLogger.error('WB Toggle: Initialization failed - ' + error.message, { component: 'wb-toggle', method: 'connectedCallback', line: 40, error });
        }
    }
    
    disconnectedCallback() {
        WBSafeLogger.debug('WB Toggle: Disconnected from DOM', { component: 'wb-toggle', method: 'disconnectedCallback', line: 45 });
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this._initialized || oldValue === newValue) return;
        
        switch (name) {
            case 'checked':
                this.setChecked(this.hasAttribute('checked'));
                break;
            case 'disabled':
                this.setDisabled(this.hasAttribute('disabled'));
                break;
            case 'label':
                this.setLabel(newValue);
                break;
            case 'size':
            case 'label-position':
            case 'variant':
                this.render();
                break;
        }
    }
    
    async loadConfig() {
        const fallbackConfig = {
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
                sizes: {
                    'small': 'wb-toggle--small',
                    'large': 'wb-toggle--large'
                },
                variants: {
                    'secondary': 'wb-toggle--secondary',
                    'success': 'wb-toggle--success',
                    'danger': 'wb-toggle--danger'
                }
            },
            defaults: { size: 'standard', labelPosition: 'right', variant: 'primary' },
            events: { ready: 'wbToggleReady', change: 'wbToggleChange' }
        };
        
        if (window.WBComponentUtils) {
            const configPath = window.WBComponentUtils.getPath('wb-toggle.js', '../components/wb-toggle/') + 'wb-toggle.schema.json';
            this.config = await window.WBComponentUtils.loadConfig(configPath, fallbackConfig, 'WB Toggle');
        } else {
            console.warn('🔘 WB Toggle: Component utils not available, using fallback config');
            this.config = fallbackConfig;
        }
        return this.config;
    }
    
    loadCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('wb-toggle.js', '../components/wb-toggle/') + 'wb-toggle.css';
            window.WBComponentUtils.loadCSS('wb-toggle', cssPath);
        } else {
            const existingStyles = document.querySelector('link[href*="wb-toggle.css"]');
            if (document.getElementById('wb-toggle-styles') || existingStyles) {
                return;
            }
            
            const link = document.createElement('link');
            link.id = 'wb-toggle-styles';
            link.rel = 'stylesheet';
            link.href = '../components/wb-toggle/wb-toggle.css';
            document.head.appendChild(link);
        }
    }
    
    render() {
        console.log('🔘 WB Toggle: Rendering toggle');
        
        this.className = this.config.classes.wrapper;
        
        // Get attributes
        const checked = this.hasAttribute('checked');
        const disabled = this.hasAttribute('disabled');
        const label = this.getAttribute('label') || this.textContent.trim() || '';
        const size = this.getAttribute('size') || this.config.defaults.size;
        const labelPosition = this.getAttribute('label-position') || this.config.defaults.labelPosition;
        const variant = this.getAttribute('variant') || this.config.defaults.variant;
        const id = this.getAttribute('id') || (window.WBComponentUtils ? window.WBComponentUtils.generateId('wb-toggle') : 'wb-toggle-' + Date.now());
        
        // Apply size class
        if (size !== 'standard' && this.config.classes.sizes && this.config.classes.sizes[size]) {
            this.classList.add(this.config.classes.sizes[size]);
        }
        
        // Apply label position class
        if (this.config.classes.positions && this.config.classes.positions[labelPosition]) {
            this.classList.add(this.config.classes.positions[labelPosition]);
        }
        
        // Apply variant class
        if (variant !== 'primary' && this.config.classes.variants && this.config.classes.variants[variant]) {
            this.classList.add(this.config.classes.variants[variant]);
        }
        
        // Apply state classes
        if (disabled) {
            this.classList.add(this.config.classes.states.disabled);
        }
        
        // Clear existing content
        this.innerHTML = '';
        
        // Create input (hidden checkbox)
        this._input = document.createElement('input');
        this._input.type = 'checkbox';
        this._input.id = id;
        this._input.className = this.config.classes.input;
        this._input.checked = checked;
        this._input.disabled = disabled;
        this._input.setAttribute('role', 'switch');
        this._input.setAttribute('aria-checked', checked.toString());
        
        // Create slider
        this._slider = document.createElement('div');
        this._slider.className = this.config.classes.slider;
        this._slider.setAttribute('aria-hidden', 'true');
        this._slider.setAttribute('tabindex', disabled ? '-1' : '0');
        
        // Create thumb
        const thumb = document.createElement('div');
        thumb.className = this.config.classes.thumb;
        this._slider.appendChild(thumb);
        
        // Create label if provided
        if (label) {
            this._labelElement = document.createElement('label');
            this._labelElement.className = this.config.classes.label;
            this._labelElement.setAttribute('for', id);
            this._labelElement.textContent = label;
        }
        
        // Update checked state
        this.updateCheckedState();
        
        // Assemble component
        this.appendChild(this._input);
        this.appendChild(this._slider);
        if (this._labelElement) {
            this.appendChild(this._labelElement);
        }
        
        // Set id if not already set
        if (!this.hasAttribute('id')) {
            this.setAttribute('id', id);
        }
    }
    
    updateCheckedState() {
        if (this._input.checked) {
            this.classList.add(this.config.classes.states.checked);
        } else {
            this.classList.remove(this.config.classes.states.checked);
        }
        this._input.setAttribute('aria-checked', this._input.checked.toString());
    }
    
    setupEventListeners() {
        if (!this._input || !this._slider) return;
        
        // Input change event
        this._input.addEventListener('change', (e) => {
            this.updateCheckedState();
            
            // Dispatch custom event
            const changeEvent = new CustomEvent(this.config.events.change, {
                detail: {
                    toggle: this,
                    input: this._input,
                    checked: this._input.checked,
                    id: this._input.id
                },
                bubbles: true
            });
            this.dispatchEvent(changeEvent);
        });
        
        // Input focus/blur events
        this._input.addEventListener('focus', (e) => {
            this.classList.add(this.config.classes.states.focused);
        });
        
        this._input.addEventListener('blur', (e) => {
            this.classList.remove(this.config.classes.states.focused);
        });
        
        // Make slider clickable
        this._slider.addEventListener('click', (e) => {
            if (!this._input.disabled) {
                this._input.click();
            }
        });
        
        // Keyboard support for slider
        this._slider.addEventListener('keydown', (e) => {
            if (!this._input.disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this._input.click();
            }
        });
    }
    
    setupColorResponseHandler() {
        document.addEventListener('wbColorChanged', (event) => {
            const { primary, accent } = event.detail;
            console.log('🔘 WB Toggle: Responding to color change', event.detail);
            
            const root = document.documentElement;
            if (primary) {
                root.style.setProperty('--wb-toggle-primary', primary);
            }
            if (accent) {
                root.style.setProperty('--wb-toggle-accent', accent);
            }
        });
    }
    
    // Public API methods
    setChecked(checked) {
        if (this._input) {
            this._input.checked = checked;
            this.updateCheckedState();
            
            // Update attribute to reflect state
            if (checked) {
                this.setAttribute('checked', '');
            } else {
                this.removeAttribute('checked');
            }
        }
    }
    
    getChecked() {
        return this._input ? this._input.checked : false;
    }
    
    setDisabled(disabled) {
        if (this._input) {
            this._input.disabled = disabled;
            if (this._slider) {
                this._slider.setAttribute('tabindex', disabled ? '-1' : '0');
            }
            
            if (disabled) {
                this.classList.add(this.config.classes.states.disabled);
                this.setAttribute('disabled', '');
            } else {
                this.classList.remove(this.config.classes.states.disabled);
                this.removeAttribute('disabled');
            }
        }
    }
    
    setLabel(label) {
        if (this._labelElement) {
            this._labelElement.textContent = label;
        }
        this.setAttribute('label', label);
    }
}

// Register the Web Component
customElements.define('wb-toggle', WBToggle);

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-toggle', WBToggle, ['wb-event-log'], {
        version: '1.0.0',
        type: 'form',
        role: 'ui-element',
        description: 'Toggle switch component with customizable styling and accessibility support',
        api: {
            static: ['create'],
            events: ['change', 'toggle'],
            attributes: ['checked', 'disabled', 'label', 'size', 'variant'],
            methods: ['toggle', 'setChecked', 'isChecked', 'render']
        },
        priority: 4 // UI component depends on infrastructure
    });
}

console.log('🔘 WB Toggle: Pure Web Component registered');
