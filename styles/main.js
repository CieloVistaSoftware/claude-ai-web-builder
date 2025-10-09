/**
 * Website Builder - Main JavaScript Entry Point
 * 
 * This file provides a consolidated entry point for common WB utilities.
 * Use this instead of multiple script imports for better organization.
 * 
 * Loading Pattern:
 * <script src="../../styles/main.js"></script>
 * <script src="wb-component-bundle.js"></script> <!-- Component + demo code -->
 * 
 * This replaces the verbose pattern of:
 * <script src="../../utils/wb/wb-component-utils.js"></script>
 * <script src="../wb-dependency/wb-dependency.js"></script>
 * <script src="wb-component.js"></script>
 * <script src="wb-component-demo.js"></script>
 */

// CRITICAL: Load WBSafeLogger FIRST before any other components
// This prevents "WBEventLog is not defined" errors in components
(function loadSafeLoggerSync() {
    const script = document.createElement('script');
    script.src = '../../utils/wb/wb-safe-logger.js';
    document.head.insertBefore(script, document.head.firstChild);
})();

// Dynamic script loader utility
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Load WB Component Utils
loadScript('../../utils/wb/wb-component-utils.js')
    .then(() => {
        if (window.WBSafeLogger) {
            WBSafeLogger.success('WB Main JS: Core utilities loaded', { component: 'main.js', line: 33 });
        }
        // Dispatch event to signal utilities are ready
        window.dispatchEvent(new CustomEvent('wb-utils-ready'));
    })
    .catch(err => {
        if (window.WBSafeLogger) {
            WBSafeLogger.error('Failed to load WB utilities', { component: 'main.js', error: err, line: 38 });
        }
    });

// Export the loader for components that need it
window.WBMainJS = {
    loadScript,
    ready: false
};

// Mark as ready when utils load
window.addEventListener('wb-utils-ready', () => {
    window.WBMainJS.ready = true;
});