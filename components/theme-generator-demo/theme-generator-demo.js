// Theme Generator Demo JavaScript
// Theme control functionality
const primaryColorInput = document.getElementById('primaryColor');
const accentColorInput = document.getElementById('accentColor');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessValue = document.getElementById('brightnessValue');

function updateTheme() {
    const primaryColor = primaryColorInput.value;
    const accentColor = accentColorInput.value;
    const brightness = brightnessSlider.value;

    // Update CSS custom properties
    document.documentElement.style.setProperty('--theme-primary', primaryColor);
    document.documentElement.style.setProperty('--theme-accent', accentColor);
    
    // Adjust brightness by manipulating the HSL values
    const brightnessMultiplier = brightness / 100;
    const adjustedPrimary = adjustBrightness(primaryColor, brightnessMultiplier);
    const adjustedAccent = adjustBrightness(accentColor, brightnessMultiplier);
    
    document.documentElement.style.setProperty('--theme-primary', adjustedPrimary);
    document.documentElement.style.setProperty('--theme-accent', adjustedAccent);
    
    // Update brightness display
    brightnessValue.textContent = brightness + '%';
}

function adjustBrightness(hexColor, multiplier) {
    const rgb = hexToRgb(hexColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.min(100, Math.max(0, hsl.l * multiplier));
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };

    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Semantic popup functions
function showSemanticPopup() {
    document.getElementById('semanticPopup').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideSemanticPopup() {
    document.getElementById('semanticPopup').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners
    if (primaryColorInput) primaryColorInput.addEventListener('input', updateTheme);
    if (accentColorInput) accentColorInput.addEventListener('input', updateTheme);
    if (brightnessSlider) brightnessSlider.addEventListener('input', updateTheme);

    // Close popup when clicking outside content
    const semanticPopup = document.getElementById('semanticPopup');
    if (semanticPopup) {
        semanticPopup.addEventListener('click', function(e) {
            if (e.target === this) {
                hideSemanticPopup();
            }
        });
    }

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideSemanticPopup();
        }
    });

    // Initialize theme
    updateTheme();
});