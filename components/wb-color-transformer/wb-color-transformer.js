/**
 * WB Color Transformer Component
 * Web Component that transforms WordPress color schemes based on hue shift
 */
import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBColorTransformer extends WBBaseComponent {
    constructor() {
        super();
        this.initialized = false;
        
        // Original WordPress color scheme - keep these names exactly
        this.wpColors = {
            'black': '#000000',
            'cyan-bluish-gray': '#abb8c3',
            'white': '#ffffff',
            'pale-pink': '#f78da7',
            'vivid-red': '#cf2e2e',
            'luminous-vivid-orange': '#ff6900',
            'luminous-vivid-amber': '#fcb900',
            'light-green-cyan': '#7bdcb5',
            'vivid-green-cyan': '#00d084',
            'pale-cyan-blue': '#8ed1fc',
            'vivid-cyan-blue': '#0693e3',
            'vivid-purple': '#9b51e0'
        };
        
        // Detect the original primary (vivid-cyan-blue appears to be the main one)
        this.originalPrimary = '#0693e3'; // vivid-cyan-blue
        
        // Current transformation state
        this.currentHue = 0;
        this.transformedColors = {};
        
        // Bind methods
        this.handleColorChange = this.handleColorChange.bind(this);
    }
    
    static get observedAttributes() {
        return ['primary-color', 'hue-shift', 'auto-detect'];
    }
    
    connectedCallback() {
        super.connectedCallback(); // Inherit dark mode and other base functionality
        if (!this.initialized) {
            this.init();
        }
    }
    
    disconnectedCallback() {
        this.cleanup();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.initialized) return;
        
        switch (name) {
            case 'primary-color':
                if (newValue && newValue !== oldValue) {
                    this.applyToDocument(newValue);
                }
                break;
            case 'hue-shift':
                const shift = parseFloat(newValue);
                if (!isNaN(shift)) {
                    this.applyHueShift(shift);
                }
                break;
            case 'auto-detect':
                if (newValue === 'true' || newValue === '') {
                    this.autoDetectAndTransform();
                }
                break;
        }
    }
    
    init() {
        this.logInfo('🎨 WB Color Transformer: Initializing...');
        
        // Hide the component - it's just a controller
        this.style.display = 'none';
        
        // Check WordPress environment
        this.isWordPress = this.detectWordPress();
        
        if (this.isWordPress) {
            this.logInfo('🎨 WB Color Transformer: WordPress environment detected');
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check for initial attributes
        const primaryColor = this.getAttribute('primary-color');
        if (primaryColor) {
            this.applyToDocument(primaryColor);
        }
        
        const hueShift = this.getAttribute('hue-shift');
        if (hueShift) {
            this.applyHueShift(parseFloat(hueShift));
        }
        
        const autoDetect = this.getAttribute('auto-detect');
        if (autoDetect === 'true' || autoDetect === '') {
            this.autoDetectAndTransform();
        }
        
        this.initialized = true;
        
        // Dispatch ready event
        this.fireEvent('wb-color-transformer-ready', {
            component: this,
            isWordPress: this.isWordPress
        });
        
        this.logInfo('🎨 WB Color Transformer: Ready!');
    }
    
    cleanup() {
        // Remove event listeners
        document.removeEventListener('wb-color-changed', this.handleColorChange);
        document.removeEventListener('wb:color-changed', this.handleColorChange);
        
        // Remove styles
        const style = document.getElementById('wp-color-transform');
        if (style) {
            style.remove();
        }
    }
    
    setupEventListeners() {
        // Listen for color change events
        document.addEventListener('wb-color-changed', this.handleColorChange);
        document.addEventListener('wb:color-changed', this.handleColorChange);
    }
    
    handleColorChange(event) {
        if (event.detail?.color) {
            this.applyToDocument(event.detail.color);
        }
    }
    
    detectWordPress() {
        const wpStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
        let wpDetected = false;
        
        // Check for WP CSS variables in styles
        wpStyles.forEach(style => {
            if (style.textContent && style.textContent.includes('--wp--preset--color--')) {
                wpDetected = true;
            }
        });
        
        // Check for WP CSS variables in computed styles
        const computedStyle = getComputedStyle(document.documentElement);
        if (computedStyle.getPropertyValue('--wp--preset--color--vivid-cyan-blue')) {
            wpDetected = true;
        }
        
        // Check for WordPress body classes
        if (document.body && (
            document.body.classList.contains('wp-site') ||
            document.body.classList.contains('elementor') ||
            document.body.classList.contains('wordpress'))) {
            wpDetected = true;
        }
        
        // Check for WordPress block elements
        if (document.querySelectorAll('.wp-block, .wp-site, .elementor-widget').length > 0) {
            wpDetected = true;
        }
        
        return wpDetected;
    }
    
    // Convert hex to HSL
    hexToHSL(hex) {
        hex = hex.replace('#', '');
        
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }
    
    // Convert HSL to hex
    hslToHex(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    // Transform all colors based on a new primary
    transformColors(newPrimaryHex) {
        // Get the HSL values of both old and new primary
        const oldHSL = this.hexToHSL(this.originalPrimary);
        const newHSL = this.hexToHSL(newPrimaryHex);
        
        // Calculate the hue difference
        const hueDiff = newHSL.h - oldHSL.h;
        this.currentHue = hueDiff;
        
        // Transform each color
        const transformedColors = {};
        
        for (const [name, hex] of Object.entries(this.wpColors)) {
            // Skip black and white
            if (hex === '#000000' || hex === '#ffffff') {
                transformedColors[name] = hex;
                continue;
            }
            
            // Get original HSL
            const hsl = this.hexToHSL(hex);
            
            // Apply hue shift
            let newHue = hsl.h + hueDiff;
            if (newHue < 0) newHue += 360;
            if (newHue > 360) newHue -= 360;
            
            // Convert back to hex
            transformedColors[name] = this.hslToHex(newHue, hsl.s, hsl.l);
        }
        
        this.transformedColors = transformedColors;
        return transformedColors;
    }
    
    // Apply hue shift directly
    applyHueShift(hueDiff) {
        const transformedColors = {};
        
        for (const [name, hex] of Object.entries(this.wpColors)) {
            // Skip black and white
            if (hex === '#000000' || hex === '#ffffff') {
                transformedColors[name] = hex;
                continue;
            }
            
            // Get original HSL
            const hsl = this.hexToHSL(hex);
            
            // Apply hue shift
            let newHue = hsl.h + hueDiff;
            if (newHue < 0) newHue += 360;
            if (newHue > 360) newHue -= 360;
            
            // Convert back to hex
            transformedColors[name] = this.hslToHex(newHue, hsl.s, hsl.l);
        }
        
        this.transformedColors = transformedColors;
        this.currentHue = hueDiff;
        
        // Apply to document
        this.applyTransformToDocument(transformedColors);
        
        // Dispatch event
        this.fireEvent('wb-color-transformer-applied', {
            hueShift: hueDiff,
            colors: transformedColors
        });
    }
    
    // Apply the transformed colors to the document
    applyToDocument(primaryHex) {
        const transformedColors = this.transformColors(primaryHex);
        this.applyTransformToDocument(transformedColors);
        
        // Dispatch event
        this.fireEvent('wb-color-transformer-applied', {
            primaryColor: primaryHex,
            colors: transformedColors
        });
    }
    
    // Apply transformed colors to document
    applyTransformToDocument(colors) {
        // Create or update the style element
        let style = document.getElementById('wp-color-transform');
        if (!style) {
            style = document.createElement('style');
            style.id = 'wp-color-transform';
            document.head.appendChild(style);
        }
        
        // Build the CSS
        let css = ':root {\n';
        for (const [name, hex] of Object.entries(colors)) {
            css += `  --wp--preset--color--${name}: ${hex} !important;\n`;
        }
        css += '}\n';
        
        // Also add specific selectors for WordPress elements
        for (const [name, hex] of Object.entries(colors)) {
            css += `.has-${name}-color { color: ${hex} !important; }\n`;
            css += `.has-${name}-background-color { background-color: ${hex} !important; }\n`;
            css += `.has-${name}-border-color { border-color: ${hex} !important; }\n`;
        }
        
        style.textContent = css;
    }
    
    // Auto-detect current WordPress primary color
    autoDetectAndTransform() {
        const computedStyle = getComputedStyle(document.documentElement);
        
        // Try to find the current primary color
        let currentPrimary = null;
        
        // Check various possible primary color variables
        const possiblePrimaries = [
            '--wp--preset--color--primary',
            '--wp--preset--color--vivid-cyan-blue',
            '--wp--preset--color--theme-primary',
            '--primary-color',
            '--theme-color-primary'
        ];
        
        for (const varName of possiblePrimaries) {
            const value = computedStyle.getPropertyValue(varName);
            if (value && value.startsWith('#')) {
                currentPrimary = value.trim();
                break;
            }
        }
        
        if (currentPrimary && currentPrimary !== this.originalPrimary) {
            this.logInfo(`🎨 Auto-detected primary color: ${currentPrimary}`);
            this.applyToDocument(currentPrimary);
        }
    }
    
    // Get current transformed colors
    getTransformedColors() {
        return { ...this.transformedColors };
    }
    
    // Get original WordPress colors
    getOriginalColors() {
        return { ...this.wpColors };
    }
    
    // Reset to original colors
    reset() {
        this.currentHue = 0;
        this.transformedColors = { ...this.wpColors };
        this.applyTransformToDocument(this.wpColors);
        
        // Dispatch reset event
        this.fireEvent('wb-color-transformer-reset');
    }
}

// Register the custom element
if (!customElements.get('wb-color-transformer')) {
    customElements.define('wb-color-transformer', WBColorTransformer);
}

// Export for use in other modules
window.WBColorTransformer = WBColorTransformer;