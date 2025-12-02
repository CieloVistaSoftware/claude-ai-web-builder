/**
 * WB MAIN.JS - ONE-TIME-ONE-PLACE COMPONENT LOADER
 * Central entry point that imports ALL WB web components.
 * Include this single file in any HTML page to load the entire component library.
 * @version 2.0.0
 * @location components/wb-websitebuilder/main.js
 */

// 1. CORE / BASE COMPONENTS
import '../../wb-base/wb-base.js';
import '../../wb-css-loader/wb-css-loader.js';
import '../../wb-reactive-base/wb-reactive-base.js';

// 2. UI COMPONENTS
import '../../wb-button/wb-button.js';
import '../../wb-card/wb-card.js';
import '../../wb-input/wb-input.js';
import '../../wb-select/wb-select.js';
import '../../wb-slider/wb-slider.js';
import '../../wb-toggle/wb-toggle.js';
import '../../wb-modal/wb-modal.js';
import '../../wb-tab/wb-tab.js';
import '../../wb-table/wb-table.js';
import '../../wb-search/wb-search.js';
import '../../wb-status/wb-status.js';

// 3. LAYOUT COMPONENTS
import '../../wb-layout/wb-layout.js';
import '../../wb-grid/wb-grid.js';
import '../../wb-nav/wb-nav.js';
import '../../wb-footer/wb-footer.js';
import '../../wb-viewport/wb-viewport.js';
import '../../wb-1rem/wb-1rem.js';

// 4. RESIZE COMPONENTS
import '../../wb-resize-panel/wb-resize-panel.js';
import '../../wb-resize-both/wb-resize-both.js';
import '../../wb-resize-eastwest/wb-resize-eastwest.js';
import '../../wb-resize-updown/wb-resize-updown.js';

// 5. COLOR COMPONENTS
import '../../wb-color-bar/wb-color-bar.js';
import '../../wb-color-bars/wb-color-bars.js';
import '../../wb-color-harmony/wb-color-harmony.js';
import '../../wb-color-picker/wb-color-picker.js';
import '../../wb-color-mapper/wb-color-mapper.js';
import '../../wb-color-organ/wb-color-organ.js';
import '../../wb-color-transformer/wb-color-transformer.js';
import '../../wb-color-utils/wb-color-utils.js';

// 6. DEVELOPER / DEBUG COMPONENTS
import '../../wb-demo/wb-demo.js';
import '../../wb-event-log/wb-event-log.js';
import '../../wb-dev-toolbox/wb-dev-toolbox.js';
import '../../wb-log-error/wb-log-error.js';
import '../../wb-log-viewer/wb-log-viewer.js';
import '../../wb-inject-test/wb-inject-test.js';
import '../../wb-keyboard-manager/wb-keyboard-manager.js';

// 7. CONTROL PANEL & THEME
import '../../wb-control-panel/wb-control-panel.js';
import '../../wb-theme/wb-theme-manager.js';

// 8. SPECIALIZED COMPONENTS
import '../../wb-change-text/wb-change-text.js';
import '../../wb-semantic-elements/wb-semantic-elements.js';
import '../../wb-linkedinAd/wb-linkedinAd.js';
import '../../wb-image-insert/image-insert.js';
import '../../wb-rag/wb-rag.js';

// 9. INITIALIZATION & EVENTS
console.log('[WB] main.js loaded - All components imported');
window.dispatchEvent(new CustomEvent('wb-components-ready', {
    detail: {
        timestamp: Date.now(),
        version: '2.0.0'
    }
}));
if (window.WBEventLog) {
    WBEventLog.logSuccess('WB Components Library loaded', { 
        component: 'main.js', 
        version: '2.0.0'
    });
}
export const WB_VERSION = '2.0.0';
export const WB_COMPONENTS_LOADED = true;
