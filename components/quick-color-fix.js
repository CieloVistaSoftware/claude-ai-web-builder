// QUICK COLOR PREVIEW FIX - Add this script to your HTML file

(function() {
    'use strict';
    
    console.log('🎨 Quick Color Preview Fix Loading...');
    
    function updateColorPreview(input) {
        const color = input.value;
        console.log('🎨 Color changed to:', color);
        
        // Find the preview element - try multiple strategies
        let preview = null;
        
        // Strategy 1: Use data-preview-target attribute
        const targetId = input.getAttribute('data-preview-target');
        if (targetId) {
            preview = document.getElementById(targetId);
        }
        
        // Strategy 2: Look for parent with color-preview class
        if (!preview) {
            preview = input.closest('.color-preview');
        }
        
        // Strategy 3: Look for sibling elements
        if (!preview) {
            preview = input.parentElement;
        }
        
        // Strategy 4: Use default ID
        if (!preview) {
            preview = document.getElementById('color-preview');
        }
        
        // Strategy 5: Find any element with color-preview class
        if (!preview) {
            preview = document.querySelector('.color-preview');
        }
        
        if (preview) {
            console.log('🎨 Found preview element:', preview);
            
            // Force background color update with multiple methods
            preview.style.backgroundColor = color;
            preview.style.setProperty('background-color', color, 'important');
            
            // Also update CSS custom property if used
            preview.style.setProperty('--preview-color', color);
            
            // Force browser reflow
            preview.offsetHeight;
            
            // Update color label if it exists
            const label = preview.querySelector('.color-preview-label, .color-label, [class*="label"]');
            if (label) {
                label.textContent = color;
            }
            
            console.log('✅ Color preview updated successfully');
        } else {
            console.warn('❌ Could not find color preview element for input:', input);
        }
    }
    
    function bindColorInputs() {
        const inputs = document.querySelectorAll('input[type="color"]');
        console.log(`🎨 Found ${inputs.length} color inputs`);
        
        inputs.forEach((input, index) => {
            console.log(`🎨 Binding input ${index + 1}:`, input);
            
            // Remove existing listeners
            if (input._colorFixHandler) {
                input.removeEventListener('input', input._colorFixHandler);
                input.removeEventListener('change', input._colorFixHandler);
            }
            
            // Create new handler
            const handler = () => updateColorPreview(input);
            input._colorFixHandler = handler;
            
            // Add listeners
            input.addEventListener('input', handler);
            input.addEventListener('change', handler);
            
            // Initialize with current value
            updateColorPreview(input);
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindColorInputs);
    } else {
        bindColorInputs();
    }
    
    // Re-bind when new elements are added
    const observer = new MutationObserver((mutations) => {
        let shouldRebind = false;
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.matches('input[type="color"]') || node.querySelector('input[type="color"]')) {
                        shouldRebind = true;
                    }
                }
            });
        });
        if (shouldRebind) {
            console.log('🎨 New color inputs detected, rebinding...');
            setTimeout(bindColorInputs, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Quick Color Preview Fix Loaded');
})();