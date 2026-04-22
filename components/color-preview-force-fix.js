/* Direct Color Preview Fix - Forces Background Color Updates */

// More aggressive approach to ensure background color changes
function forceColorPreviewUpdate(colorValue, previewElementId = 'color-preview') {
    console.log('Updating color preview:', previewElementId, 'with color:', colorValue);
    
    const previewElement = document.getElementById(previewElementId) || 
                          document.querySelector('.color-preview') ||
                          document.querySelector('[class*="color-preview"]');
    
    if (previewElement) {
        // Multiple ways to set the background color to ensure it takes effect
        previewElement.style.backgroundColor = colorValue;
        previewElement.style.setProperty('background-color', colorValue, 'important');
        previewElement.style.setProperty('--preview-color', colorValue);
        
        // Force a reflow to ensure the change is applied
        previewElement.offsetHeight;
        
        // Update any color display text
        const colorLabel = previewElement.querySelector('.color-preview-label') || 
                          previewElement.querySelector('[class*="color-label"]') ||
                          previewElement.querySelector('span');
        if (colorLabel) {
            colorLabel.textContent = colorValue;
        }
        
        console.log('Color preview updated successfully');
        return true;
    } else {
        console.warn('Color preview element not found:', previewElementId);
        return false;
    }
}

// Enhanced event binding that works with any color input
function bindColorInputs() {
    console.log('Binding color inputs...');
    
    // Find all possible color input elements
    const selectors = [
        'input[type="color"]',
        '.color-picker',
        '.color-input',
        '[class*="color"]input',
        'input[class*="color"]'
    ];
    
    selectors.forEach(selector => {
        const inputs = document.querySelectorAll(selector);
        console.log(`Found ${inputs.length} elements for selector: ${selector}`);
        
        inputs.forEach((input, index) => {
            const previewId = input.getAttribute('data-preview-target') || 
                            input.id + '-preview' ||
                            'color-preview';
            
            console.log(`Binding input ${index} to preview ${previewId}`);
            
            // Remove existing listeners to avoid duplicates
            input.removeEventListener('input', input._colorHandler);
            input.removeEventListener('change', input._colorHandler);
            
            // Create handler function
            const handler = function(e) {
                console.log('Color input changed:', e.target.value);
                forceColorPreviewUpdate(e.target.value, previewId);
            };
            
            // Store handler reference for removal
            input._colorHandler = handler;
            
            // Add event listeners
            input.addEventListener('input', handler);
            input.addEventListener('change', handler);
            
            // Initialize with current value
            if (input.value) {
                forceColorPreviewUpdate(input.value, previewId);
            }
        });
    });
}

// Alternative approach: Create a MutationObserver to watch for changes
function setupColorPreviewObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                const input = mutation.target;
                if (input.type === 'color') {
                    const previewId = input.getAttribute('data-preview-target') || 'color-preview';
                    forceColorPreviewUpdate(input.value, previewId);
                }
            }
        });
    });
    
    // Start observing
    document.querySelectorAll('input[type="color"]').forEach(input => {
        observer.observe(input, { attributes: true, attributeFilter: ['value'] });
    });
}

// Initialize everything when DOM is ready
function initializeColorPreview() {
    console.log('Initializing color preview system...');
    
    // Method 1: Direct event binding
    bindColorInputs();
    
    // Method 2: Mutation observer as backup
    setupColorPreviewObserver();
    
    // Method 3: Periodic check as last resort
    setInterval(() => {
        document.querySelectorAll('input[type="color"]').forEach(input => {
            const previewId = input.getAttribute('data-preview-target') || 'color-preview';
            const preview = document.getElementById(previewId);
            if (preview && preview.style.backgroundColor !== input.value) {
                forceColorPreviewUpdate(input.value, previewId);
            }
        });
    }, 1000);
}

// Run immediately if DOM is already loaded, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeColorPreview);
} else {
    initializeColorPreview();
}

// Also run when the page becomes visible (in case of tab switching)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        bindColorInputs();
    }
});

// Export functions for manual use
window.forceColorPreviewUpdate = forceColorPreviewUpdate;
window.bindColorInputs = bindColorInputs;

console.log('Color preview fix script loaded');