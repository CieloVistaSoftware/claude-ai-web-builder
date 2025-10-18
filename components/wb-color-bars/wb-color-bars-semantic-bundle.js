/**
 * WB Color Bars - Semantic Demo Bundle
 * 
 * This file bundles wb-color-bar + wb-color-bars + semantic demo functionality
 * into a single import with DIRECT script loading (no WBMainJS dependency).
 */

// Direct script loading function
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // Check if script already loaded
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
            console.log(`Script already loaded: ${src}`);
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
            console.log(`Script loaded: ${src}`);
            resolve();
        };
        script.onerror = (error) => {
            console.error(`Failed to load script: ${src}`, error);
            reject(new Error(`Failed to load ${src}`));
        };
        document.head.appendChild(script);
    });
}

// Function to load semantic demo bundle
async function loadColorBarsSemanticBundle() {
    try {
        console.log('Starting semantic bundle load...');

        // Load wb-color-bar component FIRST (dependency of wb-color-bars)
        await loadScript('../wb-color-bar/wb-color-bar.js');
        
        // Wait for wb-color-bar to be defined
        await new Promise(resolve => {
            const checkDefined = () => {
                if (customElements.get('wb-color-bar')) {
                    console.log('wb-color-bar component defined');
                    resolve();
                } else {
                    setTimeout(checkDefined, 50);
                }
            };
            checkDefined();
        });

        // Load wb-color-bars component  
        await loadScript('wb-color-bars.js');
        
        // Wait for wb-color-bars to be defined
        await new Promise(resolve => {
            const checkDefined = () => {
                if (customElements.get('wb-color-bars')) {
                    console.log('wb-color-bars component defined');
                    resolve();
                } else {
                    setTimeout(checkDefined, 50);
                }
            };
            checkDefined();
        });

        // Load semantic demo functionality
        await loadScript('wb-color-bars-semantic-demo.js');

        console.log('WB Color Bars Semantic Bundle: All components ready');
        
        // Dispatch bundle ready event
        window.dispatchEvent(new CustomEvent('wb-color-bars-semantic-ready'));

    } catch (error) {
        console.error('Failed to load WB Color Bars semantic bundle', error);
    }
}

// Auto-load when script is included
loadColorBarsSemanticBundle();
