// @ts-nocheck
// Simple WordPress Color Transformer
// Keeps original names, just changes the hex values based on hue shift
class SimpleColorTransformer {
    constructor() {
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
        // Initialize any WordPress-specific custom styles that need to be attached
        this.init();
    }
    // Initialize and check for WordPress environment
    init() {
        // Check if we're in a WordPress environment
        this.isWordPress = this.detectWordPress();
        if (this.isWordPress) {
            console.log('WordPress environment detected - color transformer ready');
            // Add a small event listener for the wb-controller's color changes
            document.addEventListener('wb-color-changed', (event) => {
                if (event.detail && event.detail.color) {
                    this.applyToDocument(event.detail.color);
                }
            });
        }
    }
    // Detect if this is a WordPress environment
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
        // If we're in an iframe, also check if the parent document is WordPress
        // This helps with iframe communication
        if (!wpDetected && window !== window.parent) {
            try {
                // Try to check if we're in a WordPress environment based on body classes or other markers
                // This is useful for WordPress sites that might not have the variables directly accessible
                if (document.body && document.body.classList.contains('wp-site') ||
                    document.body.classList.contains('elementor') ||
                    document.body.classList.contains('wordpress')) {
                    wpDetected = true;
                }
                // If we have ancestor elements with wp classes
                if (document.querySelectorAll('.wp-block, .wp-site, .elementor-widget').length > 0) {
                    wpDetected = true;
                }
            }
            catch (e) {
                // Silently fail for cross-origin issues
            }
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
        }
        else {
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
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    // Convert HSL to hex
    hslToHex(h, s, l) {
        h = ((h % 360) + 360) % 360;
        s = Math.max(0, Math.min(100, s)) / 100;
        l = Math.max(0, Math.min(100, l)) / 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r, g, b;
        if (h >= 0 && h < 60) {
            r = c;
            g = x;
            b = 0;
        }
        else if (h >= 60 && h < 120) {
            r = x;
            g = c;
            b = 0;
        }
        else if (h >= 120 && h < 180) {
            r = 0;
            g = c;
            b = x;
        }
        else if (h >= 180 && h < 240) {
            r = 0;
            g = x;
            b = c;
        }
        else if (h >= 240 && h < 300) {
            r = x;
            g = 0;
            b = c;
        }
        else {
            r = c;
            g = 0;
            b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    // Transform all colors based on new primary
    transformColors(newPrimaryHex) {
        // Calculate hue shift
        const originalHSL = this.hexToHSL(this.originalPrimary);
        const newPrimaryHSL = this.hexToHSL(newPrimaryHex);
        let hueShift = newPrimaryHSL.h - originalHSL.h;
        if (hueShift > 180)
            hueShift -= 360;
        if (hueShift < -180)
            hueShift += 360;
        const transformedColors = {};
        // Transform each color
        for (const [name, originalHex] of Object.entries(this.wpColors)) {
            const originalHSL = this.hexToHSL(originalHex);
            // Skip neutrals (low saturation colors)
            if (originalHSL.s < 15 || name === 'black' || name === 'white') {
                transformedColors[name] = originalHex;
                continue;
            }
            // Apply hue shift while keeping saturation and lightness
            const newHue = (originalHSL.h + hueShift + 360) % 360;
            const newHex = this.hslToHex(newHue, originalHSL.s, originalHSL.l);
            transformedColors[name] = newHex;
        }
        return {
            colors: transformedColors,
            hueShift: hueShift,
            originalPrimary: this.originalPrimary,
            newPrimary: newPrimaryHex
        };
    }
    // Generate CSS with exact WordPress variable names
    generateWPCSS(newPrimaryHex) {
        const transformed = this.transformColors(newPrimaryHex);
        let css = '/* WordPress Color Scheme - Transformed Values */\n';
        css += `/* Original Primary: ${transformed.originalPrimary} */\n`;
        css += `/* New Primary: ${transformed.newPrimary} */\n`;
        css += `/* Hue Shift: ${transformed.hueShift}° */\n\n`;
        css += ':root {\n';
        // Generate CSS variables with exact WordPress naming
        for (const [name, hex] of Object.entries(transformed.colors)) {
            css += `  --wp--preset--color--${name}: ${hex};\n`;
        }
        css += '}\n';
        return css;
    }
    // Apply to document immediately
    applyToDocument(newPrimaryHex) {
        if (!this.isWordPress) {
            console.log('Not a WordPress environment, skipping color transformation');
            return false;
        }
        const transformed = this.transformColors(newPrimaryHex);
        // Apply CSS variables to document
        for (const [name, hex] of Object.entries(transformed.colors)) {
            document.documentElement.style.setProperty(`--wp--preset--color--${name}`, hex);
        }
        console.log(`Applied WordPress colors with ${transformed.hueShift}° hue shift based on primary color ${newPrimaryHex}`);
        // Dispatch an event that the colors were updated
        document.dispatchEvent(new CustomEvent('wp-colors-updated', {
            detail: {
                colors: transformed.colors,
                primary: newPrimaryHex
            }
        }));
        return transformed;
    }
    // Integration with the wb-controller color bar system
    integrateWithColorBar(colorValue) {
        // This can be called from the controller component
        return this.applyToDocument(colorValue);
    }
}
// Create an instance and make it globally available
window.wpColorTransformer = new SimpleColorTransformer();
// Expose global functions for easier access
window.applyWPColors = function (hexColor) {
    return window.wpColorTransformer.applyToDocument(hexColor);
};
export {};
//# sourceMappingURL=color-transformer.js.map