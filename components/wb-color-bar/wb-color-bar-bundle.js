/**
 * WB Color Bar - Component Bundle
 * 
 * This file bundles wb-color-bar + demo functionality
 * into a single import to follow the preferred loading pattern.
 */

// Function to load color bar bundle
async function loadColorBarBundle() {
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
        await window.WBMainJS.loadScript('wb-color-bar.js');
        console.log('✅ wb-color-bar component loaded');

        console.log('🎨 WB Color Bar Bundle: Component ready');
        
        // Dispatch bundle ready event
        window.dispatchEvent(new CustomEvent('wb-color-bar-ready'));

    } catch (error) {
        console.error('❌ Failed to load WB Color Bar bundle:', error);
    }
}

// Auto-load when script is included
loadColorBarBundle();