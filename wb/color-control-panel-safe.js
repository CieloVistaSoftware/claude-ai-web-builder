// Safe Color Control Panel - prevents duplicate declarations

(function() {
    'use strict';
    
    // Check if ColorControlPanel already exists
    if (window.ColorControlPanel) {
        console.log('ColorControlPanel already exists, skipping redeclaration');
        return;
    }
    
    // Define ColorControlPanel safely
    window.ColorControlPanel = {
        init: function() {
            console.log('ColorControlPanel initializing...');
            this.setupEventListeners();
        },
        
        setupEventListeners: function() {
            // Setup color input listeners
            const colorInputs = document.querySelectorAll('input[type="color"]');
            colorInputs.forEach(input => {
                input.addEventListener('change', this.handleColorChange.bind(this));
                input.addEventListener('input', this.handleColorChange.bind(this));
            });
            
            // Setup slider listeners
            const sliders = document.querySelectorAll('input[type="range"]');
            sliders.forEach(slider => {
                slider.addEventListener('input', this.handleSliderChange.bind(this));
            });
        },
        
        handleColorChange: function(event) {
            const color = event.target.value;
            console.log('Color changed:', color);
            
            // Update preview
            const preview = document.querySelector('.color-preview, #color-preview');
            if (preview) {
                preview.style.backgroundColor = color;
            }
            
            // Update sliders if they exist
            this.updateSlidersFromColor(color);
        },
        
        handleSliderChange: function(event) {
            console.log('Slider changed:', event.target.id, event.target.value);
            
            // Update color from sliders
            if (window.updateColorFromSliders) {
                window.updateColorFromSliders();
            }
        },
        
        updateSlidersFromColor: function(hexColor) {
            // Convert hex to RGB
            const rgb = this.hexToRgb(hexColor);
            if (!rgb) return;
            
            // Update sliders
            const redSlider = document.getElementById('red-slider');
            const greenSlider = document.getElementById('green-slider');
            const blueSlider = document.getElementById('blue-slider');
            
            if (redSlider) redSlider.value = rgb.r;
            if (greenSlider) greenSlider.value = rgb.g;
            if (blueSlider) blueSlider.value = rgb.b;
        },
        
        hexToRgb: function(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
    };
    
    console.log('ColorControlPanel defined safely');
})();