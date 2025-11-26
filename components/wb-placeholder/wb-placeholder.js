/**
 * WB Placeholder Component
 * 
 * A reusable SVG placeholder image component with customizable dimensions.
 * Useful for prototyping, demos, and as fallbacks for missing images.
 * 
 * @version 1.0.1
 * @location components/wb-placeholder/wb-placeholder.js
 * 
 * Usage:
 *   <wb-placeholder></wb-placeholder>
 *   <wb-placeholder width="600" height="300"></wb-placeholder>
 *   <wb-placeholder width="200" height="200" label="Avatar"></wb-placeholder>
 *   <wb-placeholder color="#22c55e" text-color="#000"></wb-placeholder>
 */

import WBBaseComponent from '../wb-base/wb-base.js';

class WBPlaceholder extends WBBaseComponent {
    static useShadow = true;
    
    static DEFAULTS = {
        width: 400,
        height: 200,
        color: '#6366f1',
        textColor: '#ffffff',
        label: 'Placeholder Image'
    };
    
    static STYLES = `
        :host {
            display: inline-block;
        }
        .placeholder-figure {
            margin: 0;
            padding: 0;
            display: inline-block;
        }
        .placeholder-figure svg {
            display: block;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .placeholder-figure:hover svg {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        .placeholder-caption {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: var(--text-secondary, #94a3b8);
            font-style: italic;
            text-align: center;
        }
        .placeholder-caption:empty {
            display: none;
        }
        ::slotted(figcaption) {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: var(--text-secondary, #94a3b8);
            font-style: italic;
            text-align: center;
        }
    `;
    
    constructor() {
        super();
        this._width = WBPlaceholder.DEFAULTS.width;
        this._height = WBPlaceholder.DEFAULTS.height;
        this._color = WBPlaceholder.DEFAULTS.color;
        this._textColor = WBPlaceholder.DEFAULTS.textColor;
        this._label = WBPlaceholder.DEFAULTS.label;
    }
    
    static get observedAttributes() {
        return ['width', 'height', 'color', 'text-color', 'label'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch (name) {
            case 'width':
                this._width = parseInt(newValue) || WBPlaceholder.DEFAULTS.width;
                break;
            case 'height':
                this._height = parseInt(newValue) || WBPlaceholder.DEFAULTS.height;
                break;
            case 'color':
                this._color = newValue || WBPlaceholder.DEFAULTS.color;
                break;
            case 'text-color':
                this._textColor = newValue || WBPlaceholder.DEFAULTS.textColor;
                break;
            case 'label':
                this._label = newValue || WBPlaceholder.DEFAULTS.label;
                break;
        }
        
        if (this.shadowRoot?.querySelector('svg')) {
            this._render();
        }
    }
    
    connectedCallback() {
        super.connectedCallback();
        
        // Parse attributes
        this._width = parseInt(this.getAttribute('width')) || WBPlaceholder.DEFAULTS.width;
        this._height = parseInt(this.getAttribute('height')) || WBPlaceholder.DEFAULTS.height;
        this._color = this.getAttribute('color') || WBPlaceholder.DEFAULTS.color;
        this._textColor = this.getAttribute('text-color') || WBPlaceholder.DEFAULTS.textColor;
        this._label = this.getAttribute('label') || WBPlaceholder.DEFAULTS.label;
        
        // Render
        this._render();
    }
    
    _render() {
        const w = this._width;
        const h = this._height;
        const cx = w / 2;
        const cy = h / 2;
        const labelY = cy - 10;
        const dimsY = cy + 20;
        const dims = `${w} × ${h}`;
        
        // Calculate font sizes based on dimensions
        const labelSize = Math.min(24, Math.max(12, w / 16));
        const dimsSize = Math.min(16, Math.max(10, w / 25));
        
        // Build shadow DOM with styles included
        this.shadowRoot.innerHTML = `
            <style>${WBPlaceholder.STYLES}</style>
            <figure class="placeholder-figure" data-wb-semantic="true">
                <svg width="${w}" height="${h}" role="img" aria-label="${this._label}">
                    <rect width="${w}" height="${h}" fill="${this._color}" rx="8"></rect>
                    <text x="${cx}" y="${labelY}" text-anchor="middle" fill="${this._textColor}" 
                          font-size="${labelSize}" font-family="system-ui, -apple-system, sans-serif" 
                          font-weight="500">${this._label}</text>
                    <text x="${cx}" y="${dimsY}" text-anchor="middle" fill="${this._textColor}" 
                          font-size="${dimsSize}" font-family="system-ui, -apple-system, sans-serif" 
                          opacity="0.7">${dims}</text>
                </svg>
                <slot name="caption"></slot>
            </figure>
        `;
    }
    
    // Public API
    get width() { return this._width; }
    set width(value) {
        this._width = parseInt(value) || WBPlaceholder.DEFAULTS.width;
        this._render();
    }
    
    get height() { return this._height; }
    set height(value) {
        this._height = parseInt(value) || WBPlaceholder.DEFAULTS.height;
        this._render();
    }
    
    get color() { return this._color; }
    set color(value) {
        this._color = value || WBPlaceholder.DEFAULTS.color;
        this._render();
    }
    
    get textColor() { return this._textColor; }
    set textColor(value) {
        this._textColor = value || WBPlaceholder.DEFAULTS.textColor;
        this._render();
    }
    
    get label() { return this._label; }
    set label(value) {
        this._label = value || WBPlaceholder.DEFAULTS.label;
        this._render();
    }
    
    /**
     * Set all properties at once
     * @param {Object} options - { width, height, color, textColor, label }
     */
    setOptions(options = {}) {
        if (options.width) this._width = parseInt(options.width);
        if (options.height) this._height = parseInt(options.height);
        if (options.color) this._color = options.color;
        if (options.textColor) this._textColor = options.textColor;
        if (options.label) this._label = options.label;
        this._render();
    }
}

customElements.define('wb-placeholder', WBPlaceholder);

export { WBPlaceholder };
export default WBPlaceholder;
