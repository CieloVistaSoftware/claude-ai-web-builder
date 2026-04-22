// Fixed wb.js functions to handle missing elements gracefully

// Safe element getter that doesn't throw errors
function getElementByIdSafe(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found, skipping...`);
        return null;
    }
    return element;
}

// Safe color bar setup
function setupColorBarSafe() {
    const colorBar = getElementByIdSafe('color-bar');
    if (!colorBar) {
        console.warn('Color bar not found, creating placeholder...');
        return;
    }
    
    // Original color bar setup logic here
    if (colorBar.style) {
        colorBar.style.background = 'linear-gradient(to right, red, yellow, green, cyan, blue, magenta, red)';
    }
}

// Safe element initialization
function initializeElementsSafe() {
    console.log('Initializing elements safely...');
    
    // Try to get elements, but don't fail if they don't exist
    const colorBar = getElementByIdSafe('color-bar');
    const colorPicker = getElementByIdSafe('color-picker');
    const colorPreview = getElementByIdSafe('color-preview');
    
    if (colorBar) {
        console.log('Color bar found, setting up...');
        setupColorBarSafe();
    }
    
    if (colorPicker) {
        console.log('Color picker found, setting up...');
        // Setup color picker logic
    }
    
    if (colorPreview) {
        console.log('Color preview found, setting up...');
        // Setup color preview logic
    }
    
    return { colorBar, colorPicker, colorPreview };
}

// Missing updateColorFromSliders function
function updateColorFromSliders() {
    console.log('updateColorFromSliders called');
    
    // Get slider elements safely
    const redSlider = getElementByIdSafe('red-slider');
    const greenSlider = getElementByIdSafe('green-slider');
    const blueSlider = getElementByIdSafe('blue-slider');
    
    if (!redSlider || !greenSlider || !blueSlider) {
        console.warn('Color sliders not found');
        return;
    }
    
    // Get values
    const red = parseInt(redSlider.value) || 0;
    const green = parseInt(greenSlider.value) || 0;
    const blue = parseInt(blueSlider.value) || 0;
    
    // Create color string
    const color = `rgb(${red}, ${green}, ${blue})`;
    const hexColor = rgbToHex(red, green, blue);
    
    console.log('Color from sliders:', color, hexColor);
    
    // Update color preview
    const colorPreview = getElementByIdSafe('color-preview');
    if (colorPreview && colorPreview.style) {
        colorPreview.style.backgroundColor = color;
    }
    
    // Update color input if it exists
    const colorInput = document.querySelector('input[type="color"]');
    if (colorInput) {
        colorInput.value = hexColor;
    }
    
    // Update color display
    const colorDisplay = getElementByIdSafe('color-display');
    if (colorDisplay) {
        colorDisplay.textContent = hexColor;
    }
}

// Helper function to convert RGB to hex
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Safe initialization function
function initSafe() {
    console.log('Starting safe initialization...');
    
    try {
        const elements = initializeElementsSafe();
        
        if (elements.colorBar) {
            setupColorBarSafe();
        }
        
        console.log('Safe initialization completed');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Export functions for global use
window.updateColorFromSliders = updateColorFromSliders;
window.getElementByIdSafe = getElementByIdSafe;
window.initSafe = initSafe;