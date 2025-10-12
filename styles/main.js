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

// NOTE: WBEventLog and WBComponentUtils are now loaded by index.js
// This file is kept for compatibility but doesn't duplicate those loads

// Signal that main.js has loaded
if (window.WBEventLog) {
    WBEventLog.logSuccess('WB Main JS: Core utilities loaded', { component: 'main.js', line: 22 });
}

// Dispatch event to signal utilities are ready
window.dispatchEvent(new CustomEvent('wb-utils-ready'));