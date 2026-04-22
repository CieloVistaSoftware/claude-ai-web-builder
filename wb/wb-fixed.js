// wb.js - Fixed Website Builder Core
'use strict';

// Global variables
let currentColor = '#ffffff';
let elements = {};

// Safe element getter
function getElementByIdSafe(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
        return null;
    }
    return element;
}

// Safe element getter with error (non-throwing version)
function getElementByIdWithError(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found, returning null`);
        return null;
    }
    return element;
}

// Initialize elements safely
function initializeElements() {
    console.log('Initializing elements...');
    
    try {
        // Get all required elements
        elements.colorBar = getElementByIdSafe('color-bar');
        elements.colorPicker = getElementByIdSafe('color-picker');
        elements.colorPreview = getElementByIdSafe('color-preview');
        elements.redSlider = getElementByIdSafe('red-slider');
        elements.greenSlider = getElementByIdSafe('green-slider');
        elements.blueSlider = getElementByIdSafe('blue-slider');
        elements.colorDisplay = getElementByIdSafe('color-display');
        
        // Create missing elements if needed
        if (!elements.colorPreview) {
            console.log('Creating color preview element...');
            const colorPreview = document.createElement('div');
            colorPreview.id = 'color-preview';
            colorPreview.className = 'color-preview';
            colorPreview.style.cssText = 'width: 100px; height: 50px; border: 1px solid #ccc; background-color: #ffffff; margin: 10px;';
            
            const container = document.querySelector('.color-container, main, body');
            if (container) {
                container.appendChild(colorPreview);
                elements.colorPreview = colorPreview;
            }
        }
        
        if (!elements.colorBar) {
            console.log('Creating color bar element...');
            const colorBar = document.createElement('div');
            colorBar.id = 'color-bar';
            colorBar.className = 'color-bar';
            colorBar.style.cssText = 'width: 300px; height: 20px; background: linear-gradient(to right, red, yellow, green, cyan, blue, magenta, red); margin: 10px; cursor: pointer;';
            
            const container = document.querySelector('.color-container, main, body');
            if (container) {
                container.appendChild(colorBar);
                elements.colorBar = colorBar;
            }
        }
        
        console.log('Elements initialized:', elements);
        return true;
    } catch (error) {
        console.error('Failed to initialize elements:', error);
        return false;
    }
}

// Update color from sliders
function updateColorFromSliders() {
    console.log('updateColorFromSliders called');
    
    if (!elements.redSlider || !elements.greenSlider || !elements.blueSlider) {
        // Try to get sliders again
        elements.redSlider = getElementByIdSafe('red-slider');
        elements.greenSlider = getElementByIdSafe('green-slider');
        elements.blueSlider = getElementByIdSafe('blue-slider');
    }
    
    if (elements.redSlider && elements.greenSlider && elements.blueSlider) {
        const red = parseInt(elements.redSlider.value) || 0;
        const green = parseInt(elements.greenSlider.value) || 0;
        const blue = parseInt(elements.blueSlider.value) || 0;
        
        const color = `rgb(${red}, ${green}, ${blue})`;
        const hexColor = rgbToHex(red, green, blue);
        
        currentColor = hexColor;
        
        // Update color preview
        updateColorPreview(hexColor);
        
        // Update color display
        if (elements.colorDisplay) {
            elements.colorDisplay.textContent = hexColor;
        }
        
        // Update color input
        const colorInput = document.querySelector('input[type="color"]');
        if (colorInput) {
            colorInput.value = hexColor;
        }
        
        console.log('Color updated from sliders:', color, hexColor);
    } else {
        console.warn('Color sliders not found');
    }
}

// Convert RGB to hex
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Update color preview
function updateColorPreview(color) {
    if (!elements.colorPreview) {
        elements.colorPreview = getElementByIdSafe('color-preview');
    }
    
    if (elements.colorPreview && elements.colorPreview.style) {
        elements.colorPreview.style.backgroundColor = color;
    }
    
    // Also update any other color preview elements
    const previews = document.querySelectorAll('.color-preview, [class*="preview"]');
    previews.forEach(preview => {
        if (preview.style) {
            preview.style.backgroundColor = color;
        }
    });
}

// Setup color bar
function setupColorBar() {
    if (!elements.colorBar) {
        elements.colorBar = getElementByIdSafe('color-bar');
    }
    
    if (elements.colorBar && elements.colorBar.style) {
        elements.colorBar.style.background = 'linear-gradient(to right, red, yellow, green, cyan, blue, magenta, red)';
        
        // Add click event to color bar
        elements.colorBar.addEventListener('click', function(e) {
            const rect = elements.colorBar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            
            // Calculate color based on position
            const hue = percentage * 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            
            updateColorPreview(color);
        });
        
        console.log('Color bar setup completed');
    } else {
        console.warn('Color bar setup skipped - element not found');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Color input listeners
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.addEventListener('input', function() {
            currentColor = input.value;
            updateColorPreview(currentColor);
            updateSlidersFromColor(currentColor);
        });
        
        input.addEventListener('change', function() {
            currentColor = input.value;
            updateColorPreview(currentColor);
            updateSlidersFromColor(currentColor);
        });
    });
    
    // Slider listeners
    if (elements.redSlider) {
        elements.redSlider.addEventListener('input', updateColorFromSliders);
    }
    if (elements.greenSlider) {
        elements.greenSlider.addEventListener('input', updateColorFromSliders);
    }
    if (elements.blueSlider) {
        elements.blueSlider.addEventListener('input', updateColorFromSliders);
    }
}

// Update sliders from color
function updateSlidersFromColor(hexColor) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return;
    
    if (elements.redSlider) elements.redSlider.value = rgb.r;
    if (elements.greenSlider) elements.greenSlider.value = rgb.g;
    if (elements.blueSlider) elements.blueSlider.value = rgb.b;
}

// Main initialization function
function init() {
    console.log('Initializing Website Builder...');
    
    try {
        // Initialize elements
        if (!initializeElements()) {
            console.error('Failed to initialize elements');
            return;
        }
        
        // Setup color bar
        setupColorBar();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize with default color
        updateColorPreview(currentColor);
        updateSlidersFromColor(currentColor);
        
        console.log('Website Builder initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Export functions to global scope
window.init = init;
window.updateColorFromSliders = updateColorFromSliders;
window.updateColorPreview = updateColorPreview;
window.getElementByIdWithError = getElementByIdWithError;
window.getElementByIdSafe = getElementByIdSafe;
window.setupColorBar = setupColorBar;

console.log('wb.js loaded successfully');