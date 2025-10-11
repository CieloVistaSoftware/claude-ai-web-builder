# Claude Validation Errors

This file documents the current validation errors found in the WB component project, as reported by the automated build tools. Each entry includes the file, line number, and the unknown web component or class detected. Use this as a checklist to resolve outstanding issues and improve codebase quality.

---

## How to Fix Validation Errors

1. **Unknown Web Component:**
   - Ensure the component is defined and registered with `customElements.define`.
   - Check for typos in the tag name in your HTML/JS files.
   - If the component is intentionally missing (e.g., a demo placeholder), document it or remove the usage.

2. **Unknown Class:**
   - Make sure the class is defined and imported where used.
   - If the class is deprecated or removed, update the code to use the correct class or utility.

3. **General Steps:**
   - Search for the error location in your codebase.
   - Add missing definitions, correct typos, or remove invalid usages.
   - Re-run validation after each fix to confirm resolution.

---


### Unknown Web Components

<!-- Check off each as you resolve it -->
* [ ] components\wb-base\wb-base-demo.html:30 - wb-demo
* [ ] components\wb-base\wb-base-demo.html:88 - wb-demo-base
* [ ] components\wb-control-panel\wb-control-panel-demo.html:154 - wb-demo
* [ ] components\wb-demo\wb-demo-demo.html:19 - wb-demo
* [ ] components\wb-demo\wb-demo-demo.html:19 - wb-demo
* [ ] components\wb-dev-toolbox\wb-dev-toolbox-demo2.html:12 - wb-demo
* [ ] components\wb-dev-toolbox\wb-dev-toolbox-demo2.html:19 - wb-demo-section
* [ ] components\wb-dev-toolbox\wb-dev-toolbox-diagnostics.html:32 - wb-dev-toolbox-log
* [ ] components\wb-event-log\wb-event-log-demo.html:51 - wb-tab-item
* [ ] components\wb-event-log\wb-event-log-demo.html:51 - wb-tab-item
* [ ] components\wb-event-log\wb-event-log-demo.html:51 - wb-tab-item
* [ ] components\wb-event-log\wb-event-log-demo.html:59 - wb-tab-panel
* [ ] components\wb-event-log\wb-event-log-demo.html:59 - wb-tab-panel
* [ ] components\wb-event-log\wb-event-log-demo.html:59 - wb-tab-panel
* [ ] components\wb-event-log\wb-event-log-schema-viewer.html:82 - wb-btn (x12)
* [ ] components\wb-nav\wb-nav-demo.html:157 - wb-tab-item (x2)
* [ ] components\wb-slider\wb-slider-demo.html:15 - wb-demo
* [ ] components\wb-slider\wb-slider-demo.html:28 - wb-demo-section
* [ ] components\wb-slider\wb-slider-demo.html:30 - wb-demo-grid
* [ ] components\wb-slider\wb-slider-demo.html:31 - wb-demo-item (x8)
* [ ] components\wb-slider\wb-slider-demo.html:34 - wb-slider (x14)
* [ ] components\wb-slider\wb-slider-demo.html:35 - wb-demo-output (x7)
* [ ] components\wb-status\wb-status-demo.html:293 - wb-demo
* [ ] components\wb-tab\wb-tab-demo-clean.html:219 - wb-tab-item (x8)
* [ ] components\wb-tab\wb-tab-demo-clean.html:223 - wb-tab-panel (x8)
* [ ] components\wb-tab\wb-tab-demo.html:181 - wb-tab-item (x16)
* [ ] components\wb-tab\wb-tab-demo.html:186 - wb-tab-panel (x16)
* [ ] components\wb-tab\wb-tab-test.html:65 - wb-tab-item (x6)
* [ ] components\wb-tab\wb-tab-test.html:69 - wb-tab-panel (x6)
* [ ] components\wb-table\wb-table-demo.html:174 - wb-demo (x4)
* [ ] server\api-test-client.html:30 - wb-tab-item (x2)
* [ ] server\api-test-client.html:33 - wb-tab-panel (x2)
* [ ] tests\intellisense\intellisense-test.html:63 - wb-slider
* [ ] tests\intellisense\intellisense-test.html:85 - wb-viewport
* [ ] tools\component-ide.html:315 - wb-'
* [ ] tools\component-ide.html:520 - wb-')

### Unknown Classes

* [ ] archive\wb-website-builder\dist\wb-component-loader.js:191 - WBComponentUtils
* [ ] archive\wb-website-builder\dist\wb-website-builder.js:53 - WBComponentUtils (x4)
* [ ] components\wb-button\wb-button.js:217 - WBComponentUtils (x2)
* [ ] components\wb-button\wb-button.js:781 - WBComponentRegistry (x2)
* [ ] components\wb-card\wb-card.js:114 - WBComponentUtils
* [ ] components\wb-card\wb-card.js:115 - WBComponentUtils
* [ ] components\wb-card\wb-card.js:471 - WBComponentRegistry (x2)
* [ ] components\wb-change-text\wb-change-text.js:84 - WBComponentUtils
* [ ] components\wb-change-text\wb-change-text.js:85 - WBComponentUtils
* [ ] components\wb-change-text\wb-change-text.js:385 - WBComponentRegistry (x2)
* [ ] components\wb-color-bar\wb-color-bar-bundle.js:26 - WBMainJS
* [ ] components\wb-color-bar\wb-color-bar.js:937 - WBComponentRegistry
* [ ] components\wb-color-bars\wb-color-bars-bundle.js:30 - WBMainJS (x3)
* [ ] components\wb-color-bars\wb-color-bars-semantic-bundle.js:14 - WBSafeLogger (x2)
* [ ] components\wb-color-bars\wb-color-bars-semantic-bundle.js:23 - WBSafeLogger (x6)
* [ ] components\wb-color-bars\wb-color-bars-semantic-bundle.js:27 - WBSafeLogger (x2)
* [ ] components\wb-color-bars\wb-color-bars-semantic-demo.js:43 - WBSafeLogger
* [ ] components\wb-color-bars\wb-color-bars-semantic-demo.js:51 - WBSafeLogger (x4)
* [ ] components\wb-color-bars\wb-color-bars-semantic-demo.js:75 - WBSafeLogger (x4)
* [ ] components\wb-color-bars\wb-color-bars-semantic-demo.js:95 - WBSafeLogger (x3)
* [ ] components\wb-color-bars\wb-color-bars-semantic-demo.js:166 - WBSafeLogger
* [ ] components\wb-color-bars\wb-color-bars-semantic-demo.js:225 - WBSafeLogger
* [ ] components\wb-color-bars\wb-color-bars.js:72 - WBComponentRegistry
* [ ] components\wb-color-bars\wb-color-bars.js:73 - WBSafeLogger (x6)
* [ ] components\wb-color-bars\wb-color-bars.js:76 - WBSafeLogger (x6)
* [ ] components\wb-color-bars\wb-color-bars.js:93 - WBComponentUtils (x2)
* [ ] components\wb-color-bars\wb-color-bars.js:110 - WBSafeLogger (x2)
* [ ] components\wb-color-bars\wb-color-bars.js:137 - WBSafeLogger
* [ ] components\wb-color-bars\wb-color-bars.js:676 - WBComponentRegistry
* [ ] components\wb-color-picker\wb-color-picker.js:50 - WBComponentUtils
* [ ] components\wb-color-picker\wb-color-picker.js:51 - WBComponentUtils
* [ ] components\wb-color-picker\wb-color-picker.js:654 - WBComponentRegistry (x2)
* [ ] components\wb-control-panel\wb-control-panel.js:25 - WBComponentUtils (x2)
* [ ] components\wb-control-panel\wb-control-panel.js:29 - WBComponentUtils (x2)
* [ ] components\wb-control-panel\wb-control-panel.js:35 - WBComponentUtils (x3)
* [ ] components\wb-control-panel\wb-control-panel.js:1372 - WBComponentRegistry
* [ ] components\wb-control-panel\wb-control-panel.js:1498 - WBComponentRegistry
* [ ] components\wb-control-panel\wb-control-panel.js:1659 - WBComponentUtils
* [ ] components\wb-control-panel\wb-control-panel.js:1941 - WBComponentRegistry (x2)
* [ ] components\wb-event-log\wb-event-log.js:84 - WBComponentUtils (x2)
* [ ] components\wb-event-log\wb-event-log.js:101 - WBComponentUtils (x2)
* [ ] components\wb-event-log\wb-event-log.js:1002 - WBComponentUtils (x2)
* [ ] components\wb-event-log\wb-event-log.js:2666 - WBComponentRegistry (x2)
* [ ] components\wb-footer\wb-footer.js:108 - WBComponentUtils (x2)
* [ ] components\wb-footer\wb-footer.js:140 - WBComponentUtils
* [ ] components\wb-footer\wb-footer.js:728 - WBComponentRegistry (x2)
* [ ] components\wb-image-insert\image-insert.js:17 - WBComponentUtils
* [ ] components\wb-image-insert\image-insert.js:18 - WBComponentUtils
* [ ] components\wb-image-insert\image-insert.js:835 - WBComponentUtils (x2)
* [ ] components\wb-inject-test\wb-inject-test.js:98 - WBComponentUtils
* [ ] components\wb-inject-test\wb-inject-test.js:100 - WBComponentUtils
* [ ] components\wb-input\wb-input.js:413 - WBComponentUtils
* [ ] components\wb-input\wb-input.js:900 - WBComponentRegistry (x2)
* [ ] components\wb-keyboard-manager\component-integration-example.js:82 - WBComponentUtils
* [ ] components\wb-keyboard-manager\wb-keyboard-manager.js:116 - WBComponentUtils (x2)
* [ ] components\wb-keyboard-manager\wb-keyboard-manager.js:131 - WBComponentUtils (x2)
* [ ] components\wb-keyboard-manager\wb-keyboard-manager.js:898 - WBComponentRegistry (x2)
* [ ] components\wb-layout\wb-layout-reactive.js:531 - WBComponentRegistry (x2)
* [ ] components\wb-layout\wb-layout.js:534 - WBComponentRegistry (x2)
* [ ] components\wb-log-error\wb-log-error.js:226 - WBComponentUtils
* [ ] components\wb-log-error\wb-log-error.js:227 - WBComponentUtils
* [ ] components\wb-log-error\wb-log-error.js:861 - WBComponentRegistry (x2)
* [ ] components\wb-modal\wb-modal.js:220 - WBComponentRegistry (x2)
* [ ] components\wb-modal\wb-modal.js:426 - WBComponentUtils (x2)
* [ ] components\wb-nav\wb-nav.js:101 - WBComponentUtils (x2)
* [ ] components\wb-nav\wb-nav.js:104 - WBComponentUtils
* [ ] components\wb-nav\wb-nav.js:499 - WBComponentRegistry (x2)
* [ ] components\wb-search\wb-search.js:34 - WBComponentUtils
* [ ] components\wb-search\wb-search.js:35 - WBComponentUtils
* [ ] components\wb-search\wb-search.js:276 - WBComponentRegistry (x2)
* [ ] components\wb-select\wb-select.js:254 - WBComponentUtils
* [ ] components\wb-select\wb-select.js:1111 - WBComponentRegistry (x2)
* [ ] components\wb-slider\wb-slider.js:19 - WBComponentUtils
* [ ] components\wb-slider\wb-slider.js:20 - WBComponentUtils
* [ ] components\wb-status\wb-status.js:101 - WBComponentUtils (x2)
* [ ] components\wb-status\wb-status.js:113 - WBComponentUtils
* [ ] components\wb-status\wb-status.js:490 - WBComponentRegistry (x2)
* [ ] components\wb-tab\wb-tab.js:908 - WBComponentRegistry (x4)
* [ ] components\wb-table\wb-table.js:45 - WBComponentUtils
* [ ] components\wb-table\wb-table.js:46 - WBComponentUtils
* [ ] components\wb-table\wb-table.js:236 - WBComponentRegistry (x2)
* [ ] components\wb-theme\wb-theme-manager.js:49 - WBComponentUtils
* [ ] components\wb-theme\wb-theme-manager.js:50 - WBComponentUtils
* [ ] components\wb-theme\wb-theme-manager.js:65 - WBComponentUtils (x2)
* [ ] components\wb-theme\wb-theme-manager.js:321 - WBComponentRegistry (x2)
* [ ] components\wb-theme\wb-theme-manager.js:394 - WBComponentUtils (x2)
* [ ] components\wb-toggle\wb-toggle.js:13 - WBSafeLogger (x2)
* [ ] components\wb-toggle\wb-toggle.js:40 - WBSafeLogger
* [ ] components\wb-toggle\wb-toggle.js:100 - WBComponentUtils
* [ ] components\wb-toggle\wb-toggle.js:101 - WBComponentUtils
* [ ] components\wb-toggle\wb-toggle.js:112 - WBComponentUtils
* [ ] components\wb-toggle\wb-toggle.js:139 - WBComponentUtils
* [ ] components\wb-toggle\wb-toggle.js:326 - WBComponentRegistry (x2)
* [ ] components\wb-viewport\wb-viewport.js:18 - WBComponentUtils (x2)
* [ ] components\wb-viewport\wb-viewport.js:61 - WBComponentUtils
* [ ] components\wb-viewport\wb-viewport.js:300 - WBComponentUtils (x2)
* [ ] material-design.colorpicker\script.js:194 - WBComponentUtils (x7)
* [ ] scripts\build-manifest.js:92 - WBComponentRegistry
* [ ] styles\layout-manager.js:35 - WBComponentUtils
* [ ] styles\layout-manager.js:162 - WBLayoutManager (x2)
* [ ] styles\main.js:23 - WBSafeLogger
* [ ] tests\wb-layout.test.js:79 - WBSafeLogger (x4)
* [ ] tests\wb-layout.test.js:86 - WBSafeLogger (x7)
* [ ] tests\wb-layout.test.js:128 - WBSafeLogger (x2)
* [ ] tools\component-data.js:71 - WB_DISCOVERY_DATA
* [ ] utils\auto-loader.js:43 - WBConfig
* [ ] utils\color\color-analysis.js:384 - WBComponentUtils
* [ ] utils\color\color-transformer.js:20 - WBComponentUtils
* [ ] utils\color\color-transformer.js:21 - WBComponentUtils
* [ ] utils\color\color-transformer.js:342 - WBComponentUtils
* [ ] utils\wb\wb-component-base.js:150 - WBComponentUtils
* [ ] utils\wb\wb-component-base.js:162 - WBComponentUtils (x2)
* [ ] utils\wb\wb-component-base.js:179 - WBComponentUtils
* [ ] utils\wb\wb-component-base.js:212 - WBComponentUtils
* [ ] utils\wb\wb-component-base.js:240 - WBComponentUtils
* [ ] utils\wb\wb-component-base.js:287 - WBComponentUtils (x2)
* [ ] utils\wb\wb-component-registry.js:201 - WBComponentUtils
* [ ] utils\wb\wb-component-registry.js:451 - WBComponentUtils
* [ ] utils\wb\wb-component-registry.js:458 - WBComponentRegistry
* [ ] utils\wb\wb-component-registry.js:462 - WBComponentRegistry
* [ ] utils\wb\wb-component-utils.js:1006 - WBComponentUtils
* [ ] utils\wb\wb-safe-logger.js:13 - WBSafeLogger
* [ ] utils\wb\wb-safe-logger.js:14 - WBSafeLogger
* [ ] utils\wb\wb-safe-logger.js:15 - WBSafeLogger
* [ ] utils\wb\wb-safe-logger.js:142 - WBSafeLogger
* [ ] utils\wb\wb-safe-logger.js:144 - WBSafeLogger
* [ ] utils\wb\wb-safe-logger.js:145 - WBSafeLogger

---

_Last updated: <!--DATE-->_
