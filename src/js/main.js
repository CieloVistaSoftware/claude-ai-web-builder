/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WB MAIN.JS - ONE-TIME-ONE-PLACE COMPONENT LOADER
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Central entry point that imports ALL WB web components.
 * Include this single file in any HTML page to load the entire component library.
 * 
 * @version 2.0.0
 * @location src/js/main.js
 * 
 * USAGE IN HTML (from component demo files):
 *   <script type="module" src="../../src/js/main.js"></script>
 * 
 * USAGE IN HTML (from root):
 *   <script type="module" src="./src/js/main.js"></script>
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CORE / BASE COMPONENTS (load first - others depend on these)
// ═══════════════════════════════════════════════════════════════════════════════

import '../../components/wb-base/wb-base.js';
import '../../components/wb-css-loader/wb-css-loader.js';
import '../../components/wb-reactive-base/wb-reactive-base.js';

// ═══════════════════════════════════════════════════════════════════════════════
// 2. UI COMPONENTS - Basic Elements
// ═══════════════════════════════════════════════════════════════════════════════

import '../../components/wb-button/wb-button.js';
import '../../components/wb-card/wb-card.js';
import '../../components/wb-input/wb-input.js';
import '../../components/wb-select/wb-select.js';
import '../../components/wb-slider/wb-slider.js';
import '../../components/wb-toggle/wb-toggle.js';
import '../../components/wb-modal/wb-modal.js';
import '../../components/wb-tab/wb-tab.js';
import '../../components/wb-table/wb-table.js';
import '../../components/wb-search/wb-search.js';
import '../../components/wb-status/wb-status.js';

// ═══════════════════════════════════════════════════════════════════════════════
// 3. LAYOUT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

import '../../components/wb-layout/wb-layout.js';
import '../../components/wb-grid/wb-grid.js';
import '../../components/wb-nav/wb-nav.js';
import '../../components/wb-footer/wb-footer.js';
import '../../components/wb-viewport/wb-viewport.js';
import '../../components/wb-1rem/wb-1rem.js';

// ═══════════════════════════════════════════════════════════════════════════════
// 4. RESIZE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

import '../../components/wb-resize-panel/wb-resize-panel.js';
import '../../components/wb-resize-both/wb-resize-both.js';
import '../../components/wb-resize-eastwest/wb-resize-eastwest.js';
import '../../components/wb-resize-updown/wb-resize-updown.js';

// ═══════════════════════════════════════════════════════════════════════════════
// 5. COLOR COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

import '../../components/wb-color-bar/wb-color-bar.js';
import '../../components/wb-color-bars/wb-color-bars.js';
import '../../components/wb-color-harmony/wb-color-harmony.js';
import '../../components/wb-color-picker/wb-color-picker.js';
import '../../components/wb-color-mapper/wb-color-mapper.js';
import '../../components/wb-color-organ/wb-color-organ.js';
import '../../components/wb-color-transformer/wb-color-transformer.js';
import '../../components/wb-color-utils/wb-color-utils.js';

// ═══════════════════════════════════════════════════════════════════════════════
// 6. DEVELOPER / DEBUG COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

import '../../components/wb-demo/wb-demo.js';
import '../../components/wb-event-log/wb-event-log.js';
import '../../components/wb-dev-toolbox/wb-dev-toolbox.js';
import '../../components/wb-log-error/wb-log-error.js';
import '../../components/wb-log-viewer/wb-log-viewer.js';
import '../../components/wb-inject-test/wb-inject-test.js';
import '../../components/wb-keyboard-manager/wb-keyboard-manager.js';

// ═══════════════════════════════════════════════════════════════════════════════
// 7. CONTROL PANEL & THEME
// ═══════════════════════════════════════════════════════════════════════════════

import '../../components/wb-control-panel/wb-control-panel.js';
import '../../components/wb-theme/wb-theme-manager.js';

// ═══════════════════════════════════════════════════════════════════════════════
// 8. SPECIALIZED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

import '../../components/wb-chatbot/wb-chatbot.js';

import '../../components/wb-change-text/wb-change-text.js';
import '../../components/wb-semantic-elements/wb-semantic-elements.js';
import '../../components/wb-linkedinAd/wb-linkedinAd.js';
import '../../components/wb-image-insert/image-insert.js';
import '../../components/wb-rag/wb-rag.js';

// ═══════════════════════════════════════════════════════════════════════════════
// 9. INITIALIZATION & EVENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Log successful load
console.log('[WB] main.js loaded - All components imported');

// Dispatch ready event
window.dispatchEvent(new CustomEvent('wb-components-ready', {
    detail: {
        timestamp: Date.now(),
        version: '2.0.0'
    }
}));

// Optional: Log to WBEventLog if available
if (window.WBEventLog) {
    WBEventLog.logSuccess('WB Components Library loaded', { 
        component: 'main.js', 
        version: '2.0.0'
    });
}

// Export version info
export const WB_VERSION = '2.0.0';
export const WB_COMPONENTS_LOADED = true;
