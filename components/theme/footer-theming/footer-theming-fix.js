// Footer theming JavaScript fix for html-element-editor-fullwidth.html

function forceFooterTheming() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    const primaryColor = document.getElementById('primaryColor')?.value || 
                        getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim() || 
                        '#3498db';
    const accentColor = document.getElementById('accentColor')?.value || 
                       getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || 
                       '#f39c12';
    
    // Force footer background and colors
    footer.style.setProperty('background', primaryColor, 'important');
    footer.style.setProperty('border-top-color', accentColor, 'important');
    footer.style.setProperty('color', 'white', 'important');
    
    // Update all footer elements
    const allFooterElements = footer.querySelectorAll('*');
    allFooterElements.forEach(element => {
        if (element.tagName.match(/^H[1-6]$/)) {
            element.style.setProperty('color', 'white', 'important');
        } else if (element.tagName.match(/^(P|DIV|SPAN|LI|UL|OL)$/)) {
            element.style.setProperty('color', 'rgba(255, 255, 255, 0.9)', 'important');
        } else if (element.tagName === 'A') {
            if (element.classList.contains('social-link') || element.closest('.social-links')) {
                element.style.setProperty('background-color', accentColor, 'important');
                element.style.setProperty('color', 'white', 'important');
            } else {
                element.style.setProperty('color', accentColor, 'important');
            }
        } else if (element.tagName === 'BUTTON') {
            element.style.setProperty('background-color', accentColor, 'important');
            element.style.setProperty('color', 'white', 'important');
        }
    });
}

// Override existing updateTheme function if it exists
function wrapUpdateTheme() {
    const originalUpdateTheme = window.updateTheme;
    window.updateTheme = function() {
        if (originalUpdateTheme) {
            originalUpdateTheme.apply(this, arguments);
        }
        setTimeout(forceFooterTheming, 50);
    };
}

// Initialize footer theming
document.addEventListener('DOMContentLoaded', function() {
    // Wrap existing updateTheme function
    wrapUpdateTheme();
    
    // Initial footer theming
    setTimeout(forceFooterTheming, 100);
    
    // Add listeners to color inputs
    const primaryInput = document.getElementById('primaryColor');
    const accentInput = document.getElementById('accentColor');
    
    if (primaryInput) {
        primaryInput.addEventListener('input', function() {
            setTimeout(forceFooterTheming, 10);
        });
    }
    
    if (accentInput) {
        accentInput.addEventListener('input', function() {
            setTimeout(forceFooterTheming, 10);
        });
    }
    
    // Monitor for theme changes on document element
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (mutation.target === document.documentElement) {
                    setTimeout(forceFooterTheming, 10);
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style']
    });
    
    // Also listen for CSS custom property changes
    const root = document.documentElement;
    if (root.style.setProperty) {
        const originalSetProperty = root.style.setProperty;
        root.style.setProperty = function(property, value, priority) {
            originalSetProperty.call(this, property, value, priority);
            if (property === '--theme-primary' || property === '--theme-accent') {
                setTimeout(forceFooterTheming, 10);
            }
        };
    }
});

// Force update periodically as fallback
setInterval(forceFooterTheming, 2000);

// Export function for manual calls
window.forceFooterTheming = forceFooterTheming;