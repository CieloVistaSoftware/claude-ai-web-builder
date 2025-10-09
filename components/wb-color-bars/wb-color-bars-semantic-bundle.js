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
            WBSafeLogger.info(`Script already loaded: ${src}`, { component: 'wb-color-bars-semantic-bundle', line: 13 });
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
            WBSafeLogger.success(`Script loaded: ${src}`, { component: 'wb-color-bars-semantic-bundle', src, line: 22 });
            resolve();
        };
        script.onerror = (error) => {
            WBSafeLogger.error(`Failed to load script: ${src}`, { component: 'wb-color-bars-semantic-bundle', src, error, line: 26 });
            reject(new Error(`Failed to load ${src}`));
        };
        document.head.appendChild(script);
    });
}

// Function to load semantic demo bundle
async function loadColorBarsSemanticBundle() {
    try {
        WBSafeLogger.info('Starting semantic bundle load...', { component: 'wb-color-bars-semantic-bundle', line: 36 });

        // Load wb-color-bar component FIRST (dependency of wb-color-bars)
        await loadScript('../wb-color-bar/wb-color-bar.js');
        
        // Wait for wb-color-bar to be defined
        await new Promise(resolve => {
            const checkDefined = () => {
                if (customElements.get('wb-color-bar')) {
                    WBSafeLogger.success('wb-color-bar component defined', { component: 'wb-color-bars-semantic-bundle', line: 45 });
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
                    WBSafeLogger.success('wb-color-bars component defined', { component: 'wb-color-bars-semantic-bundle', line: 61 });
                    resolve();
                } else {
                    setTimeout(checkDefined, 50);
                }
            };
            checkDefined();
        });

        // Load semantic demo functionality
        await loadScript('wb-color-bars-semantic-demo.js');

        WBSafeLogger.success('WB Color Bars Semantic Bundle: All components ready', { component: 'wb-color-bars-semantic-bundle', line: 73 });
        
        // Dispatch bundle ready event
        window.dispatchEvent(new CustomEvent('wb-color-bars-semantic-ready'));

    } catch (error) {
        WBSafeLogger.error('Failed to load WB Color Bars semantic bundle', { 
            component: 'wb-color-bars-semantic-bundle',
            error: error.message,
            stack: error.stack,
            line: 82 
        });
    }
}

// Auto-load when script is included
loadColorBarsSemanticBundle();
