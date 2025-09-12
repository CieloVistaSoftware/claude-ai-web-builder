/**
 * Color Utility Functions
 * Extracted from wb.js for better code organization
 * Author: Claude AI Assistant
 */

"use strict";

// Color utility functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function adjustBrightness(color, amount) {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    rgb.r = Math.min(255, Math.max(0, rgb.r + amount));
    rgb.g = Math.min(255, Math.max(0, rgb.g + amount));
    rgb.b = Math.min(255, Math.max(0, rgb.b + amount));
    
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function getContrastColor(hexColor) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return '#000000';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

function lightenColor(color, percent) {
    const amount = Math.round(255 * (percent / 100));
    return adjustBrightness(color, amount);
}

function darkenColor(color, percent) {
    const amount = Math.round(255 * (percent / 100));
    return adjustBrightness(color, -amount);
}

// Debounce utility function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        hexToRgb,
        rgbToHex,
        adjustBrightness,
        getContrastColor,
        lightenColor,
        darkenColor,
        debounce
    };
} else {
    // Browser environment - attach to window
    window.ColorUtils = {
        hexToRgb,
        rgbToHex,
        adjustBrightness,
        getContrastColor,
        lightenColor,
        darkenColor,
        debounce
    };
}