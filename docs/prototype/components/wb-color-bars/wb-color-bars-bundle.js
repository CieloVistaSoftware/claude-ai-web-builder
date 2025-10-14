/**
 * WB Color Bars - Component Bundle
 * 
 * This file bundles wb-color-bar + wb-color-bars + demo functionality
 * into a single import to follow the preferred loading pattern.
 * 
 * Usage:
 * <script src="../../styles/main.js"></script>
 * <script src="wb-color-bars-bundle.js"></script>
 */

// Function to load component scripts in order
async function loadColorBarsBundle() {
    try {
        // Wait for main.js utilities to be ready
        if (!window.WBMainJS?.ready) {
            await new Promise(resolve => {
                const checkReady = () => {
                    if (window.WBMainJS?.ready) {
                        resolve();
                    } else {
                        setTimeout(checkReady, 50);
                    }
                };
                checkReady();
            });
        }

        // Load wb-color-bar component
        await window.WBMainJS.loadScript('../wb-color-bar/wb-color-bar.js');
        console.log('✅ wb-color-bar component loaded');

        // Load wb-color-bars component  
        await window.WBMainJS.loadScript('wb-color-bars.js');
        console.log('✅ wb-color-bars component loaded');

        // Load demo functionality
        await window.WBMainJS.loadScript('wb-color-bars-demo.js');
        console.log('✅ wb-color-bars demo loaded');

        console.log('🎨 WB Color Bars Bundle: All components ready');
        
        // Dispatch bundle ready event
        window.dispatchEvent(new CustomEvent('wb-color-bars-ready'));

    } catch (error) {
        console.error('❌ Failed to load WB Color Bars bundle:', error);
    }
}

// Auto-load when script is included
loadColorBarsBundle();