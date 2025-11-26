/**
 * WB Color Bar Web Component
 * A reusable color picker slider component
 * 
 * @version 2.0.0 - Shadow DOM compliant
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBColorBar extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
        // Default values
        this._hue = 240;
        this._saturation = 70;
        this._lightness = 50;
        this._isDragging = false;
        this._type = 'hue';
        this._value = 50;
        
        // Bind methods
        this.handleColorBarClick = this.handleColorBarClick.bind(this);
        this.startDragging = this.startDragging.bind(this);
        this.handleDragging = this.handleDragging.bind(this);
        this.stopDragging = this.stopDragging.bind(this);
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
    }
    
    static get observedAttributes() {
        return ['hue', 'saturation', 'lightness', 'disabled', 'theme', 'type', 'value'];
    }
    
    async connectedCallback() {
        super.connectedCallback();
        
        // Initialize from attributes
        this._type = this.getAttribute('type') || 'hue';
        this._value = parseInt(this.getAttribute('value')) || 50;
        this._hue = parseInt(this.getAttribute('hue')) || 240;
        this._saturation = parseInt(this.getAttribute('saturation')) || 70;
        this._lightness = parseInt(this.getAttribute('lightness')) || 50;
        
        this.render();
        this.setupEventListeners();
        this.updateBarGradient();
        this.updateDisplay();
        
        // Make focusable
        this.tabIndex = 0;
        this.addEventListener('focus', () => {
            const colorBar = this.shadowRoot.querySelector('.color-bar');
            if (colorBar) colorBar.focus();
        });
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListeners();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch (name) {
            case 'hue':
                this._hue = Math.max(0, Math.min(360, parseInt(newValue) || 0));
                break;
            case 'saturation':
                this._saturation = Math.max(0, Math.min(100, parseInt(newValue) || 70));
                break;
            case 'lightness':
                this._lightness = Math.max(0, Math.min(100, parseInt(newValue) || 50));
                break;
            case 'type':
                this._type = newValue || 'hue';
                if (this.shadowRoot) this.updateBarGradient();
                break;
            case 'value':
                this._value = Math.max(0, Math.min(100, parseInt(newValue) || 50));
                break;
        }
        
        if (this.shadowRoot) this.updateDisplay();
    }
    
    render() {
        // Get label based on type
        let labelText = 'Hue';
        switch (this._type) {
            case 'saturation': labelText = 'Saturation'; break;
            case 'lightness': labelText = 'Lightness'; break;
        }
        
        // Inject CSS directly into Shadow DOM
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/components/wb-color-bar/wb-color-bar.css">
            <style>
                /* Critical inline styles for immediate rendering */
                :host {
                    display: block;
                    width: 100%;
                    font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
                }
                .color-bar-container {
                    position: relative;
                    margin: 8px 0;
                }
                .color-bar-label {
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 8px;
                    color: var(--text-primary, #e6e1e5);
                }
                .color-bar {
                    position: relative;
                    height: 1.5rem;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
                    outline: none;
                }
                .color-bar:focus {
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 2px var(--primary, #6366f1);
                }
                .color-pointer {
                    position: absolute;
                    top: 50%;
                    width: 1.25rem;
                    height: 1.25rem;
                    background: white;
                    border: 3px solid #333;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    cursor: grab;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    transition: transform 0.1s ease;
                    z-index: 2;
                }
                .color-pointer:hover {
                    transform: translate(-50%, -50%) scale(1.2);
                }
                .color-pointer:active,
                .color-pointer.dragging {
                    cursor: grabbing;
                    transform: translate(-50%, -50%) scale(1.1);
                }
                .color-pointer::after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: var(--current-color, #6750a4);
                }
                .color-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 8px;
                    font-size: 12px;
                }
                .value-display {
                    font-weight: 500;
                    color: var(--text-secondary, #cac4d0);
                }
                .color-preview {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 11px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                .color-preview:hover {
                    transform: scale(1.05);
                }
            </style>
            
            <div class="color-bar-container">
                <div class="color-bar-label">
                    <slot name="label">${labelText}</slot>
                </div>
                <div class="color-bar" tabindex="0" role="slider" 
                     aria-valuemin="0" aria-valuemax="${this._type === 'hue' ? '360' : '100'}" 
                     aria-valuenow="${this._type === 'hue' ? this._hue : this._value}"
                     aria-label="${labelText} selector">
                    <div class="color-pointer"></div>
                </div>
                <div class="color-info">
                    <span class="value-display">
                        <span class="value-label">${labelText}:</span> 
                        <span class="value-number">${this._type === 'hue' ? Math.round(this._hue) + '°' : Math.round(this._value) + '%'}</span>
                    </span>
                    <span class="color-preview" title="Click to copy color">#6366f1</span>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const colorBar = this.shadowRoot.querySelector('.color-bar');
        const colorPointer = this.shadowRoot.querySelector('.color-pointer');
        const colorPreview = this.shadowRoot.querySelector('.color-preview');
        
        if (!colorBar) return;
        
        // Mouse events
        colorBar.addEventListener('mousedown', this.handleColorBarClick);
        colorPointer?.addEventListener('mousedown', this.startDragging);
        document.addEventListener('mousemove', this.handleDragging);
        document.addEventListener('mouseup', this.stopDragging);
        
        // Touch events
        colorBar.addEventListener('touchstart', this.handleColorBarClick, { passive: false });
        colorPointer?.addEventListener('touchstart', this.startDragging, { passive: false });
        document.addEventListener('touchmove', this.handleDragging, { passive: false });
        document.addEventListener('touchend', this.stopDragging);
        
        // Keyboard
        colorBar.addEventListener('keydown', this.handleKeyboardNavigation);
        
        // Copy color
        colorPreview?.addEventListener('click', () => this.copyColorToClipboard());
    }
    
    removeEventListeners() {
        document.removeEventListener('mousemove', this.handleDragging);
        document.removeEventListener('mouseup', this.stopDragging);
        document.removeEventListener('touchmove', this.handleDragging);
        document.removeEventListener('touchend', this.stopDragging);
    }
    
    handleColorBarClick(event) {
        event.preventDefault();
        event.currentTarget.focus();
        
        const rect = event.currentTarget.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        this.updateColorFromPercentage(percentage);
        this._isDragging = true;
        document.body.style.userSelect = 'none';
        this.shadowRoot.querySelector('.color-pointer')?.classList.add('dragging');
    }
    
    startDragging(event) {
        event.preventDefault();
        this._isDragging = true;
        document.body.style.userSelect = 'none';
        this.shadowRoot.querySelector('.color-pointer')?.classList.add('dragging');
    }
    
    handleDragging(event) {
        if (!this._isDragging) return;
        event.preventDefault();
        
        const colorBar = this.shadowRoot.querySelector('.color-bar');
        const rect = colorBar.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        this.updateColorFromPercentage(percentage);
    }
    
    stopDragging() {
        if (!this._isDragging) return;
        
        this._isDragging = false;
        document.body.style.userSelect = '';
        this.shadowRoot.querySelector('.color-pointer')?.classList.remove('dragging');
        
        // Fire select event
        this.dispatchEvent(new CustomEvent('colorselect', {
            detail: this.getColorData(),
            bubbles: true
        }));
    }
    
    handleKeyboardNavigation(event) {
        const step = event.shiftKey ? 10 : 1;
        
        switch(event.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                event.preventDefault();
                this.adjustValue(-step);
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                event.preventDefault();
                this.adjustValue(step);
                break;
            case 'Home':
                event.preventDefault();
                this._type === 'hue' ? (this._hue = 0) : (this._value = 0);
                this.updateDisplay();
                this.fireColorChangeEvent();
                break;
            case 'End':
                event.preventDefault();
                this._type === 'hue' ? (this._hue = 360) : (this._value = 100);
                this.updateDisplay();
                this.fireColorChangeEvent();
                break;
        }
    }
    
    adjustValue(step) {
        if (this._type === 'hue') {
            this._hue = Math.max(0, Math.min(360, this._hue + step));
        } else {
            this._value = Math.max(0, Math.min(100, this._value + step));
        }
        this.updateDisplay();
        this.fireColorChangeEvent();
    }
    
    updateColorFromPercentage(percentage) {
        if (this._type === 'hue') {
            this._hue = (percentage / 100) * 360;
        } else {
            this._value = percentage;
        }
        this.updateDisplay();
        this.fireColorChangeEvent();
    }
    
    updateBarGradient() {
        const colorBar = this.shadowRoot?.querySelector('.color-bar');
        if (!colorBar) return;
        
        let gradient;
        
        switch (this._type) {
            case 'hue':
                gradient = `linear-gradient(to right,
                    hsl(0, 100%, 50%),
                    hsl(60, 100%, 50%),
                    hsl(120, 100%, 50%),
                    hsl(180, 100%, 50%),
                    hsl(240, 100%, 50%),
                    hsl(300, 100%, 50%),
                    hsl(360, 100%, 50%))`;
                break;
            case 'saturation':
                gradient = `linear-gradient(to right, 
                    hsl(${this._hue}, 0%, ${this._lightness}%), 
                    hsl(${this._hue}, 100%, ${this._lightness}%))`;
                break;
            case 'lightness':
                gradient = `linear-gradient(to right, 
                    hsl(${this._hue}, ${this._saturation}%, 0%), 
                    hsl(${this._hue}, ${this._saturation}%, 50%), 
                    hsl(${this._hue}, ${this._saturation}%, 100%))`;
                break;
        }
        
        colorBar.style.background = gradient;
    }
    
    updateDisplay() {
        const colorPointer = this.shadowRoot?.querySelector('.color-pointer');
        const valueNumber = this.shadowRoot?.querySelector('.value-number');
        const colorPreview = this.shadowRoot?.querySelector('.color-preview');
        const colorBar = this.shadowRoot?.querySelector('.color-bar');
        
        if (!colorPointer || !valueNumber || !colorPreview) return;
        
        let percentage, displayText, currentColor;
        
        if (this._type === 'hue') {
            percentage = (this._hue / 360) * 100;
            displayText = `${Math.round(this._hue)}°`;
            currentColor = this.hslToHex(this._hue, this._saturation, this._lightness);
            colorBar?.setAttribute('aria-valuenow', Math.round(this._hue).toString());
        } else {
            percentage = this._value;
            displayText = `${Math.round(this._value)}%`;
            const sat = this._type === 'saturation' ? this._value : this._saturation;
            const light = this._type === 'lightness' ? this._value : this._lightness;
            currentColor = this.hslToHex(this._hue, sat, light);
            colorBar?.setAttribute('aria-valuenow', Math.round(this._value).toString());
        }
        
        colorPointer.style.left = `${percentage}%`;
        colorPointer.style.setProperty('--current-color', currentColor);
        valueNumber.textContent = displayText;
        colorPreview.textContent = currentColor.toUpperCase();
        colorPreview.style.background = currentColor;
        
        // Ensure text is readable
        const isLight = this._type === 'lightness' ? this._value > 60 : this._lightness > 60;
        colorPreview.style.color = isLight ? '#000' : '#fff';
        
        // Update bar gradient for saturation/lightness
        this.updateBarGradient();
    }
    
    fireColorChangeEvent() {
        this.dispatchEvent(new CustomEvent('colorchange', {
            detail: this.getColorData(),
            bubbles: true
        }));
    }
    
    getColorData() {
        const sat = this._type === 'saturation' ? this._value : this._saturation;
        const light = this._type === 'lightness' ? this._value : this._lightness;
        const hex = this.hslToHex(this._hue, sat, light);
        
        return {
            hue: this._hue,
            saturation: sat,
            lightness: light,
            value: this._value,
            type: this._type,
            hex: hex,
            hsl: `hsl(${Math.round(this._hue)}, ${sat}%, ${light}%)`
        };
    }
    
    async copyColorToClipboard() {
        const colorData = this.getColorData();
        try {
            await navigator.clipboard.writeText(colorData.hex);
            const preview = this.shadowRoot.querySelector('.color-preview');
            const original = preview.textContent;
            preview.textContent = 'Copied!';
            setTimeout(() => preview.textContent = original, 1000);
        } catch (err) {
            console.error('Failed to copy color:', err);
        }
    }
    
    // Color conversion
    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
    
    // Public API
    get hue() { return this._hue; }
    set hue(value) { 
        this._hue = Math.max(0, Math.min(360, parseInt(value) || 0));
        this.updateBarGradient();
        this.updateDisplay();
        this.fireColorChangeEvent();
    }
    
    get saturation() { return this._saturation; }
    set saturation(value) { 
        this._saturation = Math.max(0, Math.min(100, parseInt(value) || 70));
        this.updateBarGradient();
        this.updateDisplay();
    }
    
    get lightness() { return this._lightness; }
    set lightness(value) { 
        this._lightness = Math.max(0, Math.min(100, parseInt(value) || 50));
        this.updateBarGradient();
        this.updateDisplay();
    }
    
    get value() { return this._value; }
    set value(val) {
        this._value = Math.max(0, Math.min(100, parseInt(val) || 50));
        this.updateDisplay();
        this.fireColorChangeEvent();
    }
    
    get type() { return this._type; }
    set type(newType) {
        this._type = newType || 'hue';
        this.updateBarGradient();
        this.updateDisplay();
    }
    
    get color() { return this.getColorData(); }
    
    setColor(hue, saturation = this._saturation, lightness = this._lightness) {
        this._hue = Math.max(0, Math.min(360, parseInt(hue) || 0));
        this._saturation = Math.max(0, Math.min(100, parseInt(saturation) || 70));
        this._lightness = Math.max(0, Math.min(100, parseInt(lightness) || 50));
        this.updateBarGradient();
        this.updateDisplay();
        this.fireColorChangeEvent();
    }
    
    updateContext(hue, saturation, lightness) {
        if (hue !== undefined) this._hue = hue;
        if (saturation !== undefined) this._saturation = saturation;
        if (lightness !== undefined) this._lightness = lightness;
        this.updateBarGradient();
        this.updateDisplay();
    }
    
    updateValueSilently(val) {
        this._value = Math.max(0, Math.min(100, parseInt(val) || 50));
        this.updateDisplay();
    }
}

customElements.define('wb-color-bar', WBColorBar);

export { WBColorBar };
export default WBColorBar;
