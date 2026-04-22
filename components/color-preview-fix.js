/* Color Preview Fix Implementation */

// Function to update color preview background
function updateColorPreview(colorValue, previewElementId = 'color-preview') {
    const previewElement = document.getElementById(previewElementId);
    if (previewElement) {
        previewElement.style.setProperty('--preview-color', colorValue);
        previewElement.style.backgroundColor = colorValue;
        
        // Update color display text if it exists
        const colorLabel = previewElement.querySelector('.color-preview-label');
        if (colorLabel) {
            colorLabel.textContent = colorValue;
        }
    }
}

// Enhanced function to create color preview elements
function createColorPreview(containerId, initialColor = '#ffffff', onColorChange = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const previewDiv = document.createElement('div');
    previewDiv.className = 'color-preview';
    previewDiv.id = containerId + '-preview';
    previewDiv.style.setProperty('--preview-color', initialColor);
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = initialColor;
    colorInput.className = 'color-preview-input';
    colorInput.setAttribute('aria-label', 'Choose color');
    colorInput.setAttribute('title', 'Choose color');
    
    const colorLabel = document.createElement('span');
    colorLabel.className = 'color-preview-label';
    colorLabel.textContent = initialColor;
    
    // Event handlers
    const handleColorChange = (newColor) => {
        updateColorPreview(newColor, previewDiv.id);
        if (onColorChange) {
            onColorChange(newColor);
        }
    };
    
    colorInput.addEventListener('input', (e) => handleColorChange(e.target.value));
    colorInput.addEventListener('change', (e) => handleColorChange(e.target.value));
    
    previewDiv.appendChild(colorInput);
    previewDiv.appendChild(colorLabel);
    container.appendChild(previewDiv);
    
    return previewDiv;
}

// Event listener for color input changes
document.addEventListener('DOMContentLoaded', function() {
    // Find all existing color input elements and bind them to preview updates
    const colorInputs = document.querySelectorAll('input[type="color"]');
    
    colorInputs.forEach(input => {
        // Find associated preview element
        const previewId = input.getAttribute('data-preview-target') || 'color-preview';
        
        input.addEventListener('input', function(e) {
            const newColor = e.target.value;
            updateColorPreview(newColor, previewId);
        });
        
        input.addEventListener('change', function(e) {
            const newColor = e.target.value;
            updateColorPreview(newColor, previewId);
        });
        
        // Initialize preview with current value
        if (input.value) {
            updateColorPreview(input.value, previewId);
        }
    });
    
    // Also handle custom color pickers if they exist
    const customColorInputs = document.querySelectorAll('.color-picker, .color-input');
    customColorInputs.forEach(input => {
        const previewId = input.getAttribute('data-preview-target') || 'color-preview';
        
        input.addEventListener('input', function(e) {
            const newColor = e.target.value;
            updateColorPreview(newColor, previewId);
        });
        
        input.addEventListener('change', function(e) {
            const newColor = e.target.value;
            updateColorPreview(newColor, previewId);
        });
    });
});

export { updateColorPreview, createColorPreview };