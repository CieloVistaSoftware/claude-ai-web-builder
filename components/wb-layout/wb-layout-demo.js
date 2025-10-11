/**
 * WB Layout Demo JavaScript
 * Handles interactive demo functionality for wb-layout component
 */

(function () {
    'use strict';

    let layoutComponent = null;

    // No DOM element caching - wb-layout component handles all its own display updates

    // No reactive state management here - wb-layout component handles all state and display updates internally

    // No hard-coded layout configs - get all data from wb-layout component
    // This ensures the demo always reflects the actual component state

    function initializeDemo() {
        // Initialization started

        // Get layout component reference - find it in the DOM
        // Try multiple approaches to find the wb-layout component
        layoutComponent = document.querySelector('wb-layout') ||
                         window.currentWBLayoutInstance ||
                         (document.currentScript && document.currentScript.closest('wb-layout'));

        // If component exists but not fully initialized, wait for it
        if (layoutComponent && !layoutComponent.setLayout) {
            // WB Layout component found but not fully initialized, waiting...
            // Wait for component to be fully initialized
            if (layoutComponent.addEventListener) {
                layoutComponent.addEventListener('wb-layout-ready', () => {
                    // WB Layout component ready event received
                    initializeDemo(); // Retry initialization
                });
            }
            return;
        }

        if (!layoutComponent || typeof layoutComponent.setLayout !== 'function') {
            // WB Layout component not found or not properly initialized
            return;
        }

        // No DOM caching needed - wb-layout component manages its own elements

        // wb-layout component is fully reactive - no event listeners or coordination needed

        // WB Layout Demo: Initialization complete - component is fully reactive
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDemo);
    } else {
        initializeDemo();
    }

    // No global interface needed - wb-layout component is fully reactive and self-contained

})();