/**
 * WB Slider Web Component
 * A customizable range slider with accessibility and theming support
 * 
 * @example
 * <wb-slider min="0" max="100" value="50" label="Volume"></wb-slider>
 * 
 * @version 2.0.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBSlider extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
        this._value = 50;
        this._isDragging = false;
    }

    static get observedAttributes() {
        return ['min', 'max', 'value', 'step', 'label', 'unit', 'disabled', 'show-value', 'variant'];
    }

    async connectedCallback() {
        super.connectedCallback();
        
        this.logInfo('WBSlider connecting', { value: this.value });
        
        await loadComponentCSS(this, 'wb-slider.css');
        this.render();
        this.setupEventListeners();
        
        this.fireEvent('wb-slider:ready', { component: 'wb-slider', value: this.value });
        this.logInfo('WBSlider ready', { min: this.min, max: this.max, value: this.value });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.logDebug('WBSlider disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (oldValue === newValue) return;
        
        if (name === 'value') {
            this._value = parseFloat(newValue) || 0;
            this.updateDisplay();
        } else {
            this.render();
        }
    }

    // Property getters/setters
    get min() {
        return parseFloat(this.getAttr('min', '0'));
    }
    
    set min(value) {
        this.setAttr('min', value);
    }
    
    get max() {
        return parseFloat(this.getAttr('max', '100'));
    }
    
    set max(value) {
        this.setAttr('max', value);
    }
    
    get value() {
        return this._value;
    }
    
    set value(val) {
        this._value = parseFloat(val) || 0;
        this.setAttr('value', this._value);
        this.updateDisplay();
    }
    
    get step() {
        return parseFloat(this.getAttr('step', '1'));
    }
    
    set step(value) {
        this.setAttr('step', value);
    }
    
    get label() {
        return this.getAttr('label', '');
    }
    
    set label(value) {
        this.setAttr('label', value);
    }
    
    get unit() {
        return this.getAttr('unit', '');
    }
    
    set unit(value) {
        this.setAttr('unit', value);
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
    
    get showValue() {
        return this.getAttribute('show-value') !== 'false';
    }
    
    get variant() {
        return this.getAttr('variant', '');
    }
    
    set variant(value) {
        this.setAttr('variant', value);
    }

    getPercentage(value) {
        return ((value - this.min) / (this.max - this.min)) * 100;
    }

    render() {
        if (!this.shadowRoot) return;
        
        const percentage = this.getPercentage(this._value);
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('./wb-slider.css', import.meta.url).href}">
            <style>
                :host { display: block; }
                .wb-slider-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
                .wb-slider-container { display: flex; align-items: center; gap: 1rem; }
                .wb-slider-label { font-weight: 500; color: var(--text-color, #e0e0e0); }
                .wb-slider { position: relative; flex: 1; height: 24px; cursor: pointer; }
                .wb-slider--disabled { opacity: 0.5; pointer-events: none; }
                .wb-slider-track { position: absolute; top: 50%; left: 0; right: 0; height: 6px; background: var(--track-bg, #333); border-radius: 3px; transform: translateY(-50%); }
                .wb-slider-fill { position: absolute; top: 0; left: 0; height: 100%; background: var(--fill-color, #4a9eff); border-radius: 3px; transition: width 0.1s; }
                .wb-slider-thumb { position: absolute; top: 50%; width: 18px; height: 18px; background: var(--thumb-color, #fff); border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 2px 4px rgba(0,0,0,0.3); cursor: grab; transition: transform 0.1s; }
                .wb-slider-thumb:hover { transform: translate(-50%, -50%) scale(1.1); }
                .wb-slider--dragging .wb-slider-thumb { cursor: grabbing; transform: translate(-50%, -50%) scale(1.15); }
                .wb-slider-input { position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer; margin: 0; }
                .wb-slider-value { min-width: 3rem; text-align: right; font-family: monospace; color: var(--text-color, #e0e0e0); }
                /* Hue variant - full color spectrum */
                .wb-slider--hue .wb-slider-track { background: linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%)); }
                .wb-slider--hue .wb-slider-fill { display: none; }
                .wb-slider--hue .wb-slider-thumb { background: white; border: 2px solid rgba(0,0,0,0.3); }
            </style>
            <div class="wb-slider-wrapper">
                ${this.label ? `<label class="wb-slider-label">${this.label}</label>` : ''}
                <div class="wb-slider-container">
                    <div class="wb-slider ${this.disabled ? 'wb-slider--disabled' : ''} ${this.variant ? 'wb-slider--' + this.variant : ''}"
                         role="slider"
                         aria-valuemin="${this.min}"
                         aria-valuemax="${this.max}"
                         aria-valuenow="${this._value}"
                         aria-label="${this.label || 'Slider'}"
                         tabindex="0">
                        <div class="wb-slider-track">
                            <div class="wb-slider-fill" style="width: ${percentage}%"></div>
                            <div class="wb-slider-thumb" style="left: ${percentage}%"></div>
                        </div>
                        <input type="range"
                               class="wb-slider-input"
                               min="${this.min}"
                               max="${this.max}"
                               step="${this.step}"
                               value="${this._value}"
                               ${this.disabled ? 'disabled' : ''}>
                    </div>
                    ${this.showValue ? `<span class="wb-slider-value">${this._value}${this.unit}</span>` : ''}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        if (!this.shadowRoot) return;
        
        const slider = this.shadowRoot.querySelector('.wb-slider');
        const input = this.shadowRoot.querySelector('.wb-slider-input');
        const thumb = this.shadowRoot.querySelector('.wb-slider-thumb');
        const track = this.shadowRoot.querySelector('.wb-slider-track');
        
        if (!input || !slider) return;

        // Input events
        input.addEventListener('input', (e) => {
            this._value = parseFloat(e.target.value);
            this.updateDisplay();
            this.fireEvent('wb-slider:input', { value: this._value });
        });

        input.addEventListener('change', (e) => {
            this._value = parseFloat(e.target.value);
            this.setAttr('value', this._value);
            this.fireEvent('wb-slider:change', { value: this._value });
            this.logDebug('WBSlider changed', { value: this._value });
        });

        // Keyboard navigation
        slider.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Thumb drag interaction
        if (thumb && track) {
            this.setupDragInteraction(slider, input, thumb, track);
        }
    }

    setupDragInteraction(slider, input, thumb, track) {
        const startDrag = (e) => {
            if (this.disabled) return;
            this._isDragging = true;
            slider.classList.add('wb-slider--dragging');
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchmove', handleDrag, { passive: false });
            document.addEventListener('touchend', endDrag);
        };

        const handleDrag = (e) => {
            if (!this._isDragging) return;
            e.preventDefault();

            const rect = track.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            
            const rawValue = this.min + ((this.max - this.min) * percentage / 100);
            this._value = Math.round(rawValue / this.step) * this.step;
            
            input.value = this._value;
            this.updateDisplay();
            this.fireEvent('wb-slider:input', { value: this._value });
        };

        const endDrag = () => {
            if (!this._isDragging) return;
            this._isDragging = false;
            slider.classList.remove('wb-slider--dragging');
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', handleDrag);
            document.removeEventListener('touchend', endDrag);
            
            this.setAttr('value', this._value);
            this.fireEvent('wb-slider:change', { value: this._value });
            this.logDebug('WBSlider drag ended', { value: this._value });
        };

        thumb.addEventListener('mousedown', startDrag);
        thumb.addEventListener('touchstart', startDrag, { passive: true });
        
        track.addEventListener('click', (e) => {
            if (this.disabled || e.target === thumb) return;
            
            const rect = track.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            const rawValue = this.min + ((this.max - this.min) * percentage / 100);
            this._value = Math.round(rawValue / this.step) * this.step;
            
            input.value = this._value;
            this.updateDisplay();
            this.setAttr('value', this._value);
            this.fireEvent('wb-slider:change', { value: this._value });
        });
    }

    handleKeyDown(e) {
        if (this.disabled) return;
        
        let newValue = this._value;
        
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                newValue = Math.max(this.min, newValue - this.step);
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                newValue = Math.min(this.max, newValue + this.step);
                break;
            case 'Home':
                newValue = this.min;
                break;
            case 'End':
                newValue = this.max;
                break;
            case 'PageDown':
                newValue = Math.max(this.min, newValue - (this.step * 10));
                break;
            case 'PageUp':
                newValue = Math.min(this.max, newValue + (this.step * 10));
                break;
            default:
                return;
        }

        e.preventDefault();
        this._value = newValue;
        
        const input = this.shadowRoot?.querySelector('.wb-slider-input');
        if (input) input.value = newValue;
        
        this.updateDisplay();
        this.setAttr('value', this._value);
        this.fireEvent('wb-slider:change', { value: this._value });
    }

    updateDisplay() {
        if (!this.shadowRoot) return;
        
        const percentage = this.getPercentage(this._value);
        const fill = this.shadowRoot.querySelector('.wb-slider-fill');
        const thumb = this.shadowRoot.querySelector('.wb-slider-thumb');
        const valueDisplay = this.shadowRoot.querySelector('.wb-slider-value');
        const slider = this.shadowRoot.querySelector('.wb-slider');

        if (fill) fill.style.width = `${percentage}%`;
        if (thumb) thumb.style.left = `${percentage}%`;
        if (valueDisplay) valueDisplay.textContent = `${this._value}${this.unit}`;
        if (slider) slider.setAttribute('aria-valuenow', this._value);
    }

    // Public API
    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this._value;
    }

    setRange(min, max) {
        this.min = min;
        this.max = max;
        this.render();
    }

    setDisabled(disabled) {
        this.disabled = disabled;
    }
}

if (!customElements.get('wb-slider')) {
    customElements.define('wb-slider', WBSlider);
}

if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-slider', WBSlider, [], {
        version: '2.0.0',
        type: 'form',
        role: 'ui-element',
        description: 'Range slider with keyboard navigation and accessibility',
        api: {
            events: ['wb-slider:ready', 'wb-slider:input', 'wb-slider:change'],
            attributes: ['min', 'max', 'value', 'step', 'label', 'unit', 'disabled', 'show-value'],
            methods: ['setValue', 'getValue', 'setRange', 'setDisabled', 'render']
        },
        priority: 4
    });
}

if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBSlider = WBSlider;
window.WBSlider = WBSlider;

export { WBSlider };
export default WBSlider;
