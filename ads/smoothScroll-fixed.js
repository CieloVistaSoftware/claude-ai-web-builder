// Enhanced smooth scrolling with performance optimizations
(function() {
    'use strict';
    
    // Check if smooth scrolling is supported
    const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    
    // Smooth scroll implementation
    function smoothScrollTo(target, duration = 800) {
        if (!target) return;
        
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Initialize smooth scrolling
    function initSmoothScroll() {
        // Handle all anchor links
        document.addEventListener('click', function(e) {
            // Check if clicked element is an anchor or inside an anchor
            let anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;
            
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            
            e.preventDefault();
            
            try {
                const target = document.querySelector(href);
                if (!target) return;
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
                
                // Use native smooth scroll if supported, fallback to custom
                if (supportsSmoothScroll) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });
                } else {
                    smoothScrollTo(target);
                }
                
                // Set focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
                
            } catch (error) {
                console.warn('Smooth scroll error:', error);
            }
        });
        
        // Handle back/forward navigation
        window.addEventListener('popstate', function() {
            const hash = window.location.hash;
            if (hash) {
                const target = document.querySelector(hash);
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 0);
                }
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmoothScroll);
    } else {
        initSmoothScroll();
    }
    
    // Export for external use
    window.smoothScrollTo = smoothScrollTo;
})();