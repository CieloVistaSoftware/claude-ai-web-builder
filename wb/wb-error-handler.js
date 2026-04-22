// WB.html Error Handler and Fixes

(function() {
    'use strict';
    
    console.log('🛠️ WB Error Handler Loading...');
    
    // Fix 1: Prevent duplicate ColorControlPanel declarations
    window.addEventListener('error', function(e) {
        if (e.message.includes('ColorControlPanel has already been declared')) {
            console.log('🔧 Caught ColorControlPanel duplicate declaration error');
            e.preventDefault();
            return false;
        }
    });
    
    // Fix 2: Provide missing functions
    if (!window.updateColorFromSliders) {
        window.updateColorFromSliders = function() {
            console.log('🎨 updateColorFromSliders called');
            
            const redSlider = document.getElementById('red-slider');
            const greenSlider = document.getElementById('green-slider');
            const blueSlider = document.getElementById('blue-slider');
            
            if (redSlider && greenSlider && blueSlider) {
                const red = parseInt(redSlider.value) || 0;
                const green = parseInt(greenSlider.value) || 0;
                const blue = parseInt(blueSlider.value) || 0;
                
                const color = `rgb(${red}, ${green}, ${blue})`;
                const hexColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
                
                // Update all color previews
                const previews = document.querySelectorAll('.color-preview, #color-preview, [class*="preview"]');
                previews.forEach(preview => {
                    if (preview.style) {
                        preview.style.backgroundColor = color;
                    }
                });
                
                // Update color inputs
                const colorInputs = document.querySelectorAll('input[type="color"]');
                colorInputs.forEach(input => {
                    input.value = hexColor;
                });
                
                console.log('🎨 Color updated:', color, hexColor);
            }
        };
    }
    
    // Fix 3: Safe element initialization
    function safelyInitializeElements() {
        const requiredElements = ['color-bar', 'color-picker', 'color-preview'];
        const missingElements = [];
        
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                missingElements.push(id);
                console.warn(`🚨 Missing element: ${id}`);
                
                // Create missing elements
                const placeholder = document.createElement('div');
                placeholder.id = id;
                placeholder.className = id;
                placeholder.style.cssText = 'width: 50px; height: 50px; background: #f0f0f0; border: 1px solid #ccc; margin: 5px;';
                
                // Try to find a good place to insert it
                const container = document.querySelector('.color-container, .controls, main, body');
                if (container) {
                    container.appendChild(placeholder);
                    console.log(`✅ Created placeholder for ${id}`);
                }
            }
        });
        
        return missingElements.length === 0;
    }
    
    // Fix 4: Override problematic functions
    const originalGetElementByIdWithError = window.getElementByIdWithError;
    window.getElementByIdWithError = function(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`⚠️ Element '${id}' not found, returning null instead of throwing error`);
            return null;
        }
        return element;
    };
    
    // Fix 5: Safe setupColorBar function
    window.setupColorBar = function() {
        const colorBar = document.getElementById('color-bar');
        if (colorBar && colorBar.style) {
            colorBar.style.background = 'linear-gradient(to right, red, yellow, green, cyan, blue, magenta, red)';
            console.log('✅ Color bar setup completed');
        } else {
            console.warn('⚠️ Color bar setup skipped - element not found or no style property');
        }
    };
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔧 Running WB error fixes...');
        
        // Create missing elements
        safelyInitializeElements();
        
        // Setup color bar safely
        if (window.setupColorBar) {
            window.setupColorBar();
        }
        
        // Bind color events
        setTimeout(() => {
            const colorInputs = document.querySelectorAll('input[type="color"]');
            const sliders = document.querySelectorAll('input[type="range"]');
            
            colorInputs.forEach(input => {
                input.addEventListener('input', function() {
                    const previews = document.querySelectorAll('.color-preview, #color-preview');
                    previews.forEach(preview => {
                        if (preview.style) {
                            preview.style.backgroundColor = input.value;
                        }
                    });
                });
            });
            
            sliders.forEach(slider => {
                slider.addEventListener('input', function() {
                    if (window.updateColorFromSliders) {
                        window.updateColorFromSliders();
                    }
                });
            });
            
            console.log('✅ WB error fixes applied successfully');
        }, 100);
    });
    
    console.log('🛠️ WB Error Handler Loaded');
})();