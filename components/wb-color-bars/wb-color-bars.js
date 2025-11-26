/**
 * WB Color Bars - Complete HSL Color Picker
 * A comprehensive color picker with text and background color controls
 * 
 * @version 2.0.0 - Shadow DOM compliant, extends WBBaseComponent
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBColorBars extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
        // Text color HSL values
        this._textHue = 240;
        this._textSaturation = 70;
        this._textLightness = 90;
        
        // Background color HSL values
        this._bgHue = 240;
        this._bgSaturation = 40;
        this._bgLightness = 20;
        
        // Track which mode we're in
        this._mode = 'text'; // 'text' or 'background'
    }
    
    static get observedAttributes() {
        return ['text-hue', 'text-saturation', 'text-lightness', 'bg-hue', 'bg-saturation', 'bg-lightness', 'disabled', 'theme', 'mode'];
    }
    
    async connectedCallback() {
        super.connectedCallback();
        
        // Initialize from attributes
        this._textHue = parseInt(this.getAttribute('text-hue')) || 240;
        this._textSaturation = parseInt(this.getAttribute('text-saturation')) || 70;
        this._textLightness = parseInt(this.getAttribute('text-lightness')) || 90;
        this._bgHue = parseInt(this.getAttribute('bg-hue')) || 240;
        this._bgSaturation = parseInt(this.getAttribute('bg-saturation')) || 40;
        this._bgLightness = parseInt(this.getAttribute('bg-lightness')) || 20;
        this._mode = this.getAttribute('mode') || 'text';
        
        this.render();
        this.setupEventListeners();
        this.updatePreview();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch (name) {
            case 'text-hue':
                this._textHue = parseInt(newValue) || 240;
                break;
            case 'text-saturation':
                this._textSaturation = parseInt(newValue) || 70;
                break;
            case 'text-lightness':
                this._textLightness = parseInt(newValue) || 90;
                break;
            case 'bg-hue':
                this._bgHue = parseInt(newValue) || 240;
                break;
            case 'bg-saturation':
                this._bgSaturation = parseInt(newValue) || 40;
                break;
            case 'bg-lightness':
                this._bgLightness = parseInt(newValue) || 20;
                break;
            case 'mode':
                this._mode = newValue || 'text';
                break;
        }
        
        if (this.shadowRoot) {
            this.updatePreview();
        }
    }
    
    render() {
        // Inject CSS directly into Shadow DOM
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/components/wb-color-bars/wb-color-bars.css">
            <style>
                /* Inline critical styles for immediate rendering */
                :host {
                    display: block;
                    width: 100%;
                    font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
                }
                .color-bars-container {
                    padding: 1rem;
                    background: var(--surface-700, #334155);
                    border-radius: 8px;
                }
                .mode-tabs {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }
                .mode-tab {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--border-color, #4b5563);
                    border-radius: 6px;
                    background: var(--surface-800, #1e293b);
                    color: var(--text-secondary, #94a3b8);
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .mode-tab:hover {
                    background: var(--surface-600, #475569);
                    color: var(--text-primary, #f1f5f9);
                }
                .mode-tab.active {
                    background: var(--primary, #6366f1);
                    border-color: var(--primary, #6366f1);
                    color: white;
                }
                .bars-section {
                    display: grid;
                    gap: 1.25rem;
                    margin-bottom: 1.5rem;
                }
                .bar-group {
                    display: grid;
                    grid-template-columns: 80px 1fr 50px;
                    align-items: center;
                    gap: 1rem;
                }
                .bar-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-secondary, #94a3b8);
                }
                .value-display {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-primary, #f1f5f9);
                    text-align: right;
                    font-family: monospace;
                }
                .color-slider {
                    position: relative;
                    height: 1.5rem;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                .slider-pointer {
                    position: absolute;
                    top: 50%;
                    width: 1.25rem;
                    height: 1.25rem;
                    background: white;
                    border: 3px solid var(--pointer-color, #6366f1);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    cursor: grab;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    z-index: 10;
                }
                .slider-pointer:hover {
                    transform: translate(-50%, -50%) scale(1.15);
                }
                .slider-pointer:active {
                    cursor: grabbing;
                }
                .preview-section {
                    background: var(--surface-800, #1e293b);
                    border-radius: 8px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                .preview-box {
                    height: 80px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                .color-values {
                    display: flex;
                    justify-content: space-around;
                }
                .color-value {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }
                .color-value .label {
                    color: var(--text-secondary, #94a3b8);
                }
                .color-value .hex {
                    font-family: monospace;
                    font-weight: 600;
                    color: var(--text-primary, #f1f5f9);
                    padding: 0.25rem 0.5rem;
                    background: var(--surface-700, #334155);
                    border-radius: 4px;
                }
                .quick-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .action-btn {
                    flex: 1;
                    padding: 0.5rem 0.75rem;
                    border: 1px solid var(--border-color, #4b5563);
                    border-radius: 6px;
                    background: var(--surface-800, #1e293b);
                    color: var(--text-secondary, #94a3b8);
                    font-size: 0.75rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .action-btn:hover {
                    background: var(--surface-600, #475569);
                    color: var(--text-primary, #f1f5f9);
                }
            </style>
            
            <div class="color-bars-container">
                <!-- Mode Tabs -->
                <div class="mode-tabs">
                    <button class="mode-tab ${this._mode === 'text' ? 'active' : ''}" data-mode="text">
                        <span class="tab-icon">T</span>
                        <span>Text Color</span>
                    </button>
                    <button class="mode-tab ${this._mode === 'background' ? 'active' : ''}" data-mode="background">
                        <span class="tab-icon">🎨</span>
                        <span>Background</span>
                    </button>
                </div>
                
                <!-- Color Bars -->
                <div class="bars-section">
                    <div class="bar-group">
                        <label class="bar-label">Hue</label>
                        <div class="hue-bar color-slider" data-type="hue"></div>
                        <span class="value-display" id="hue-value">${this._mode === 'text' ? Math.round(this._textHue) : Math.round(this._bgHue)}°</span>
                    </div>
                    
                    <div class="bar-group">
                        <label class="bar-label">Saturation</label>
                        <div class="saturation-bar color-slider" data-type="saturation"></div>
                        <span class="value-display" id="sat-value">${this._mode === 'text' ? Math.round(this._textSaturation) : Math.round(this._bgSaturation)}%</span>
                    </div>
                    
                    <div class="bar-group">
                        <label class="bar-label">Lightness</label>
                        <div class="lightness-bar color-slider" data-type="lightness"></div>
                        <span class="value-display" id="light-value">${this._mode === 'text' ? Math.round(this._textLightness) : Math.round(this._bgLightness)}%</span>
                    </div>
                </div>
                
                <!-- Preview -->
                <div class="preview-section">
                    <div class="preview-box" id="preview">
                        <span class="preview-text">Sample Text</span>
                    </div>
                    <div class="color-values">
                        <div class="color-value">
                            <span class="label">Text:</span>
                            <span class="hex" id="text-hex">#FFFFFF</span>
                        </div>
                        <div class="color-value">
                            <span class="label">Background:</span>
                            <span class="hex" id="bg-hex">#1E1E1E</span>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="quick-actions">
                    <button class="action-btn" data-action="copy-text" title="Copy text color">📋 Text</button>
                    <button class="action-btn" data-action="copy-bg" title="Copy background color">📋 BG</button>
                    <button class="action-btn" data-action="swap" title="Swap colors">🔄 Swap</button>
                    <button class="action-btn" data-action="reset" title="Reset colors">↺ Reset</button>
                </div>
            </div>
        `;
        
        // Setup sliders
        this.initSliders();
    }
    
    initSliders() {
        const sliders = this.shadowRoot.querySelectorAll('.color-slider');
        sliders.forEach(slider => {
            this.createSliderBar(slider);
        });
    }
    
    createSliderBar(container) {
        const type = container.dataset.type;
        const pointer = document.createElement('div');
        pointer.className = 'slider-pointer';
        container.appendChild(pointer);
        
        // Update gradient
        this.updateSliderGradient(container, type);
        
        // Position pointer
        this.updatePointerPosition(container, type);
        
        // Add drag functionality
        let isDragging = false;
        
        const startDrag = (e) => {
            isDragging = true;
            updateValue(e);
        };
        
        const updateValue = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const rect = container.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            this.setValueFromPercentage(type, percentage);
            this.updateSliderGradient(container, type);
            this.updatePointerPosition(container, type);
            this.updatePreview();
            this.fireChangeEvent();
        };
        
        const stopDrag = () => {
            if (isDragging) {
                isDragging = false;
                this.fireSelectEvent();
            }
        };
        
        container.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', updateValue);
        document.addEventListener('mouseup', stopDrag);
        
        container.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', updateValue, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }
    
    updateSliderGradient(container, type) {
        const isText = this._mode === 'text';
        const h = isText ? this._textHue : this._bgHue;
        const s = isText ? this._textSaturation : this._bgSaturation;
        const l = isText ? this._textLightness : this._bgLightness;
        
        let gradient;
        switch (type) {
            case 'hue':
                gradient = `linear-gradient(to right,
                    hsl(0, ${s}%, ${l}%),
                    hsl(60, ${s}%, ${l}%),
                    hsl(120, ${s}%, ${l}%),
                    hsl(180, ${s}%, ${l}%),
                    hsl(240, ${s}%, ${l}%),
                    hsl(300, ${s}%, ${l}%),
                    hsl(360, ${s}%, ${l}%))`;
                break;
            case 'saturation':
                gradient = `linear-gradient(to right, hsl(${h}, 0%, ${l}%), hsl(${h}, 100%, ${l}%))`;
                break;
            case 'lightness':
                gradient = `linear-gradient(to right, hsl(${h}, ${s}%, 0%), hsl(${h}, ${s}%, 50%), hsl(${h}, ${s}%, 100%))`;
                break;
        }
        container.style.background = gradient;
    }
    
    updatePointerPosition(container, type) {
        const pointer = container.querySelector('.slider-pointer');
        if (!pointer) return;
        
        const isText = this._mode === 'text';
        let percentage;
        
        switch (type) {
            case 'hue':
                percentage = ((isText ? this._textHue : this._bgHue) / 360) * 100;
                break;
            case 'saturation':
                percentage = isText ? this._textSaturation : this._bgSaturation;
                break;
            case 'lightness':
                percentage = isText ? this._textLightness : this._bgLightness;
                break;
        }
        
        pointer.style.left = `${percentage}%`;
        
        // Update color indicator
        const h = isText ? this._textHue : this._bgHue;
        const s = isText ? this._textSaturation : this._bgSaturation;
        const l = isText ? this._textLightness : this._bgLightness;
        pointer.style.borderColor = `hsl(${h}, ${s}%, ${l}%)`;
    }
    
    setValueFromPercentage(type, percentage) {
        const isText = this._mode === 'text';
        
        switch (type) {
            case 'hue':
                const hue = (percentage / 100) * 360;
                if (isText) this._textHue = hue;
                else this._bgHue = hue;
                break;
            case 'saturation':
                if (isText) this._textSaturation = percentage;
                else this._bgSaturation = percentage;
                break;
            case 'lightness':
                if (isText) this._textLightness = percentage;
                else this._bgLightness = percentage;
                break;
        }
        
        // Update value displays
        this.updateValueDisplays();
    }
    
    updateValueDisplays() {
        const isText = this._mode === 'text';
        const hueDisplay = this.shadowRoot.getElementById('hue-value');
        const satDisplay = this.shadowRoot.getElementById('sat-value');
        const lightDisplay = this.shadowRoot.getElementById('light-value');
        
        if (hueDisplay) hueDisplay.textContent = `${Math.round(isText ? this._textHue : this._bgHue)}°`;
        if (satDisplay) satDisplay.textContent = `${Math.round(isText ? this._textSaturation : this._bgSaturation)}%`;
        if (lightDisplay) lightDisplay.textContent = `${Math.round(isText ? this._textLightness : this._bgLightness)}%`;
    }
    
    updatePreview() {
        const preview = this.shadowRoot.getElementById('preview');
        const textHex = this.shadowRoot.getElementById('text-hex');
        const bgHex = this.shadowRoot.getElementById('bg-hex');
        
        if (!preview) return;
        
        const textColor = this.hslToHex(this._textHue, this._textSaturation, this._textLightness);
        const bgColor = this.hslToHex(this._bgHue, this._bgSaturation, this._bgLightness);
        
        preview.style.background = bgColor;
        preview.style.color = textColor;
        
        if (textHex) textHex.textContent = textColor.toUpperCase();
        if (bgHex) bgHex.textContent = bgColor.toUpperCase();
        
        // Update all slider gradients
        this.shadowRoot.querySelectorAll('.color-slider').forEach(slider => {
            this.updateSliderGradient(slider, slider.dataset.type);
            this.updatePointerPosition(slider, slider.dataset.type);
        });
        
        this.updateValueDisplays();
    }
    
    setupEventListeners() {
        // Mode tabs
        this.shadowRoot.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this._mode = mode;
                
                // Update tab styles
                this.shadowRoot.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Update sliders for new mode
                this.updatePreview();
            });
        });
        
        // Quick actions
        this.shadowRoot.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleAction(action);
            });
        });
    }
    
    handleAction(action) {
        switch (action) {
            case 'copy-text':
                const textHex = this.hslToHex(this._textHue, this._textSaturation, this._textLightness);
                navigator.clipboard.writeText(textHex);
                break;
            case 'copy-bg':
                const bgHex = this.hslToHex(this._bgHue, this._bgSaturation, this._bgLightness);
                navigator.clipboard.writeText(bgHex);
                break;
            case 'swap':
                [this._textHue, this._bgHue] = [this._bgHue, this._textHue];
                [this._textSaturation, this._bgSaturation] = [this._bgSaturation, this._textSaturation];
                [this._textLightness, this._bgLightness] = [this._bgLightness, this._textLightness];
                this.updatePreview();
                this.fireChangeEvent();
                break;
            case 'reset':
                this._textHue = 240;
                this._textSaturation = 70;
                this._textLightness = 90;
                this._bgHue = 240;
                this._bgSaturation = 40;
                this._bgLightness = 20;
                this.updatePreview();
                this.fireChangeEvent();
                break;
        }
    }
    
    fireChangeEvent() {
        this.dispatchEvent(new CustomEvent('colorchange', {
            detail: this.getColorData(),
            bubbles: true
        }));
    }
    
    fireSelectEvent() {
        this.dispatchEvent(new CustomEvent('colorselect', {
            detail: this.getColorData(),
            bubbles: true
        }));
    }
    
    getColorData() {
        return {
            text: {
                hue: this._textHue,
                saturation: this._textSaturation,
                lightness: this._textLightness,
                hex: this.hslToHex(this._textHue, this._textSaturation, this._textLightness),
                hsl: `hsl(${Math.round(this._textHue)}, ${Math.round(this._textSaturation)}%, ${Math.round(this._textLightness)}%)`
            },
            background: {
                hue: this._bgHue,
                saturation: this._bgSaturation,
                lightness: this._bgLightness,
                hex: this.hslToHex(this._bgHue, this._bgSaturation, this._bgLightness),
                hsl: `hsl(${Math.round(this._bgHue)}, ${Math.round(this._bgSaturation)}%, ${Math.round(this._bgLightness)}%)`
            },
            mode: this._mode
        };
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
    get textColor() {
        return {
            hue: this._textHue,
            saturation: this._textSaturation,
            lightness: this._textLightness,
            hex: this.hslToHex(this._textHue, this._textSaturation, this._textLightness)
        };
    }
    
    get backgroundColor() {
        return {
            hue: this._bgHue,
            saturation: this._bgSaturation,
            lightness: this._bgLightness,
            hex: this.hslToHex(this._bgHue, this._bgSaturation, this._bgLightness)
        };
    }
    
    setTextColor(h, s, l) {
        this._textHue = h;
        this._textSaturation = s;
        this._textLightness = l;
        this.updatePreview();
        this.fireChangeEvent();
    }
    
    setBackgroundColor(h, s, l) {
        this._bgHue = h;
        this._bgSaturation = s;
        this._bgLightness = l;
        this.updatePreview();
        this.fireChangeEvent();
    }
}

customElements.define('wb-color-bars', WBColorBars);

export { WBColorBars };
export default WBColorBars;
