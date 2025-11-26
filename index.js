// WB Components Index Page JavaScript
import { WBBaseComponent } from './components/wb-base/wb-base.js';

class ComponentsIndex extends WBBaseComponent {
    constructor() {
        super();
        this.logInfo('ComponentsIndex: Constructor called');
        
        // All HTML Files in Solution (Alphabetically Sorted - Only files that exist)
        this.allHtmlFiles = [
            {name: 'index.html', path: 'index.html', folder: 'root'},
            
            // Component Demos
            {name: 'wb-1rem demo', path: 'components/wb-1rem/demo.html', folder: 'components'},
            {name: 'wb-base demo', path: 'components/wb-base/wb-base-demo.html', folder: 'components'},
            {name: 'wb-button demo', path: 'components/wb-button/wb-button-demo.html', folder: 'components'},
            {name: 'wb-card demo', path: 'components/wb-card/wb-card-demo.html', folder: 'components'},
            {name: 'wb-chatbot', path: 'components/wb-chatbot/wb-chatbot.html', folder: 'components'},
            {name: 'wb-color-bar demo', path: 'components/wb-color-bar/wb-color-bar-demo.html', folder: 'components'},
            {name: 'wb-color-bars demo', path: 'components/wb-color-bars/wb-color-bars-demo.html', folder: 'components'},
            {name: 'wb-color-bars semantic demo', path: 'components/wb-color-bars/wb-color-bars-semantic-demo.html', folder: 'components'},
            {name: 'wb-color-harmony demo', path: 'components/wb-color-harmony/wb-color-harmony-demo.html', folder: 'components'},
            {name: 'wb-color-harmony interactive', path: 'components/wb-color-harmony/wb-color-harmony-interactive.html', folder: 'components'},
            {name: 'wb-color-harmony palette gallery', path: 'components/wb-color-harmony/palette-gallery.html', folder: 'components'},
            {name: 'wb-color-organ demo', path: 'components/wb-color-organ/demo.html', folder: 'components'},
            {name: 'wb-color-organ demo cracked ice', path: 'components/wb-color-organ/demo-cracked-ice.html', folder: 'components'},
            {name: 'wb-color-organ demo laser', path: 'components/wb-color-organ/demo-laser.html', folder: 'components'},
            {name: 'wb-color-picker demo', path: 'components/wb-color-picker/wb-color-picker-demo.html', folder: 'components'},
            {name: 'wb-color-picker new demo', path: 'components/wb-color-picker/wb-color-picker-new-demo.html', folder: 'components'},
            {name: 'wb-control-panel demo', path: 'components/wb-control-panel/wb-control-panel-demo.html', folder: 'components'},
            {name: 'wb-demo demo', path: 'components/wb-demo/wb-demo-demo.html', folder: 'components'},
            {name: 'wb-dev-toolbox demo', path: 'components/wb-dev-toolbox/wb-dev-toolbox-demo.html', folder: 'components'},
            {name: 'wb-dev-toolbox demo2', path: 'components/wb-dev-toolbox/wb-dev-toolbox-demo2.html', folder: 'components'},
            {name: 'wb-dev-toolbox diagnostics', path: 'components/wb-dev-toolbox/wb-dev-toolbox-diagnostics.html', folder: 'components'},
            {name: 'wb-event-log demo', path: 'components/wb-event-log/wb-event-log-demo.html', folder: 'components'},
            {name: 'wb-footer demo', path: 'components/wb-footer/wb-footer-demo.html', folder: 'components'},
            {name: 'wb-image-insert', path: 'components/wb-image-insert/image-insert.html', folder: 'components'},
            {name: 'wb-inject-test demo', path: 'components/wb-inject-test/wb-inject-test-demo.html', folder: 'components'},
            {name: 'wb-input demo', path: 'components/wb-input/wb-input-demo.html', folder: 'components'},
            {name: 'wb-input test', path: 'components/wb-input/test-input.html', folder: 'components'},
            {name: 'wb-keyboard-manager demo', path: 'components/wb-keyboard-manager/wb-keyboard-manager-demo.html', folder: 'components'},
            {name: 'wb-layout demo', path: 'components/wb-layout/wb-layout-demo.html', folder: 'components'},
            {name: 'wb-layout demo FIXED', path: 'components/wb-layout/wb-layout-demo-FIXED.html', folder: 'components'},
            {name: 'wb-layout test', path: 'components/wb-layout/test.html', folder: 'components'},
            {name: 'wb-log-error demo', path: 'components/wb-log-error/wb-log-error-demo.html', folder: 'components'},
            {name: 'wb-modal demo', path: 'components/wb-modal/wb-modal-demo.html', folder: 'components'},
            {name: 'wb-nav demo', path: 'components/wb-nav/wb-nav-demo.html', folder: 'components'},
            {name: 'wb-rag demo', path: 'components/wb-rag/wb-rag-demo.html', folder: 'components'},
            {name: 'wb-reactive-base demo', path: 'components/wb-reactive-base/wb-reactive-base-demo.html', folder: 'components'},
            {name: 'wb-resize-both demo', path: 'components/wb-resize-both/wb-resize-both-demo.html', folder: 'components'},
            {name: 'wb-resize-eastwest demo', path: 'components/wb-resize-eastwest/wb-resize-eastwest-demo.html', folder: 'components'},
            {name: 'wb-resize-panel demo', path: 'components/wb-resize-panel/wb-resize-panel-demo.html', folder: 'components'},
            {name: 'wb-resize-updown demo', path: 'components/wb-resize-updown/wb-resize-updown-demo.html', folder: 'components'},
            {name: 'wb-search demo', path: 'components/wb-search/wb-search-demo.html', folder: 'components'},
            {name: 'wb-select demo', path: 'components/wb-select/wb-select-demo.html', folder: 'components'},
            {name: 'wb-semantic-elements demo', path: 'components/wb-semantic-elements/wb-semantic-elements-demo.html', folder: 'components'},
            {name: 'wb-slider demo', path: 'components/wb-slider/wb-slider-demo.html', folder: 'components'},
            {name: 'wb-status demo', path: 'components/wb-status/wb-status-demo.html', folder: 'components'},
            {name: 'wb-tab demo', path: 'components/wb-tab/wb-tab-demo.html', folder: 'components'},
            {name: 'wb-tab demo clean', path: 'components/wb-tab/wb-tab-demo-clean.html', folder: 'components'},
            {name: 'wb-tab test', path: 'components/wb-tab/wb-tab-test.html', folder: 'components'},
            {name: 'wb-table demo', path: 'components/wb-table/wb-table-demo.html', folder: 'components'},
            {name: 'wb-table json demo', path: 'components/wb-table/wb-table-json-demo.html', folder: 'components'},
            {name: 'wb-toggle demo', path: 'components/wb-toggle/wb-toggle-demo.html', folder: 'components'},
            {name: 'wb-viewport demo', path: 'components/wb-viewport/wb-viewport-demo.html', folder: 'components'},
            {name: 'wb-xtest demo', path: 'components/wb-xtest/wb-xtest-demo.html', folder: 'components'},
            
            // Tools & Utilities
            {name: 'component-ide', path: 'src/tools/component-ide.html', folder: 'tools'},
            {name: 'component-ide-enhanced', path: 'src/tools/component-ide-enhanced.html', folder: 'tools'},
            {name: 'documentation', path: 'src/tools/documentation.html', folder: 'tools'},
            {name: 'harmony-comparison-grid-generator', path: 'src/tools/harmony-comparison-grid-generator.html', folder: 'tools'},
            {name: 'simple-component-browser', path: 'src/tools/simple-component-browser.html', folder: 'tools'},
            {name: 'simple-ide', path: 'src/tools/simple-ide.html', folder: 'tools'},
            {name: 'test', path: 'src/tools/test.html', folder: 'tools'},
            {name: 'wb-debug-bookmarklet', path: 'src/tools/wb-debug-bookmarklet.html', folder: 'tools'},
            {name: 'wb-debug-test', path: 'src/tools/wb-debug-test.html', folder: 'tools'},
            
            // Styles & Themes
            {name: 'github-demo', path: 'src/styles/github/github-demo.html', folder: 'styles'},
            {name: 'hsl-harmonic-generator', path: 'src/styles/harmonic/hsl-harmonic-generator.html', folder: 'styles'},
            {name: 'layouts-demo', path: 'src/styles/layouts-demo.html', folder: 'styles'},
            {name: 'main-demo', path: 'src/styles/main-demo.html', folder: 'styles'},
            {name: 'static-colors-demo', path: 'src/styles/static-colors-demo.html', folder: 'styles'},
            
            // Pages
            {name: 'api-test-client (pages)', path: 'src/pages/api-test-client.html', folder: 'pages'},
            {name: 'wb-assistant', path: 'src/pages/wb-assistant.html', folder: 'pages'},
            {name: 'wb-assistant-enhanced', path: 'src/pages/wb-assistant-enhanced.html', folder: 'pages'},
            {name: 'wb-rag-assistant', path: 'src/pages/wb-rag-assistant.html', folder: 'pages'},
            
            // Tests
            {name: 'config-test', path: 'tests/config-test.html', folder: 'tests'},
            {name: 'harmonic-color-mixer', path: 'tests/harmonic/harmonic-color-mixer.html', folder: 'tests'},
            {name: 'harmonic-color-system-test', path: 'tests/harmonic/harmonic-color-system-test.html', folder: 'tests'},
            {name: 'intellisense-test', path: 'tests/intellisense/intellisense-test.html', folder: 'tests'},
            {name: 'intellisense-test-simple', path: 'tests/intellisense/intellisense-test-simple.html', folder: 'tests'},
            {name: 'manual-test', path: 'tests/Color Harmony System/manual-test.html', folder: 'tests'},
            {name: 'test-hue-colors', path: 'tests/wb-misc/test-hue-colors.html', folder: 'tests'},
            {name: 'test-semantic-structure', path: 'tests/wb-misc/test-semantic-structure.html', folder: 'tests'},
            {name: 'test-control-panel-simple', path: 'tests/wb-control-panel/test-control-panel-simple.html', folder: 'tests'},
            {name: 'test-wb-color-bar', path: 'tests/wb-color-bar/test-wb-color-bar.html', folder: 'tests'},
            {name: 'test-wb-color-bar-simple', path: 'tests/wb-color-bar/test-wb-color-bar-simple.html', folder: 'tests'},
            {name: 'test-wb-color-bars', path: 'tests/wb-color-bars/test-wb-color-bars.html', folder: 'tests'},
            {name: 'test-wb-layout', path: 'tests/wb-layout/test-wb-layout.html', folder: 'tests'},
            {name: 'test-wb-layout-simple', path: 'tests/wb-layout/test-wb-layout-simple.html', folder: 'tests'},
            {name: 'test-wb-nav-simple', path: 'tests/wb-nav/test-wb-nav-simple.html', folder: 'tests'},
            {name: 'test-top-nav', path: 'tests/wb-nav/test-top-nav.html', folder: 'tests'},
        ];

        // Component Data - ALL LINKS UPDATED POST-REORGANIZATION
        this.components = [
            // Core Components
            {name: 'wb-base', description: 'Base component providing foundational styling and utilities for all WB components', type: 'core', demo: 'components/wb-base/wb-base-demo.html', doc: 'components/wb-base/wb-base.md'},
            {name: 'wb-button', description: 'Standardized button component with consistent styling, responsive text sizing, and multiple variants', type: 'core', demo: 'components/wb-button/wb-button-demo.html', doc: 'components/wb-button/wb-button.md'},
            {name: 'wb-control-panel', description: 'Interactive control panel for managing themes, layouts, and colors across the entire application', type: 'core', demo: 'components/wb-control-panel/wb-control-panel-demo.html', doc: 'components/wb-control-panel/wb-control-panel.md'},
            {name: 'wb-color-bar', description: 'Visual color display component showing individual color values with harmony relationships', type: 'core', demo: 'components/wb-color-bar/wb-color-bar-demo.html', doc: 'components/wb-color-bar/wb-color-bar.md'},
            {name: 'wb-color-bars', description: 'Collection of color bars displaying the complete harmonic color palette', type: 'core', demo: 'components/wb-color-bars/wb-color-bars-demo.html', doc: 'components/wb-color-bars/wb-color-bars.md'},
            {name: 'wb-color-harmony', description: 'Mathematical color harmony system generating complementary and analogous colors', type: 'core', demo: 'components/wb-color-harmony/wb-color-harmony-demo.html', doc: 'components/wb-color-harmony/wb-color-harmony.md'},
            {name: 'wb-event-log', description: 'Event logging system for debugging and tracking component interactions', type: 'core', demo: 'components/wb-event-log/wb-event-log-demo.html', doc: 'components/wb-event-log/wb-event-log.md'},
            {name: 'wb-input', description: 'Form input component with consistent styling and validation support', type: 'core', demo: 'components/wb-input/wb-input-demo.html', doc: 'components/wb-input/wb-input.md'},
            {name: 'wb-select', description: 'Dropdown select component with keyboard navigation and accessibility features', type: 'core', demo: 'components/wb-select/wb-select-demo.html', doc: 'components/wb-select/wb-select.md'},
            {name: 'wb-slider', description: 'Range slider component for numerical input with visual feedback', type: 'core', demo: 'components/wb-slider/wb-slider-demo.html', doc: 'components/wb-slider/wb-slider.md'},
            {name: 'wb-toggle', description: 'Toggle switch component for boolean state management', type: 'core', demo: 'components/wb-toggle/wb-toggle-demo.html', doc: 'components/wb-toggle/wb-toggle.md'},

            // Layout Components
            {name: 'wb-layout', description: 'Master layout component that organizes page structure with flexible positioning', type: 'layout', demo: 'components/wb-layout/wb-layout-demo.html', doc: 'components/wb-layout/wb-layout.md'},
            {name: 'wb-grid', description: 'CSS Grid-based layout component for responsive content organization', type: 'layout', demo: null, doc: 'components/wb-grid/wb-grid.md'},
            {name: 'wb-nav', description: 'Navigation component with horizontal and vertical layout options', type: 'layout', demo: 'components/wb-nav/wb-nav-demo.html', doc: 'components/wb-nav/wb-nav.md'},
            {name: 'wb-hero', description: 'Hero section component with large hero imagery and call-to-action', type: 'layout', demo: null, doc: 'components/wb-hero/wb-hero.md'},
            {name: 'wb-header', description: 'Page header component providing site identity and primary navigation', type: 'layout', demo: null, doc: 'components/wb-header/wb-header.md'},
            {name: 'wb-footer', description: 'Footer component with contact information and secondary navigation', type: 'layout', demo: 'components/wb-footer/wb-footer-demo.html', doc: 'components/wb-footer/wb-footer.md'},
            {name: 'wb-card', description: 'Card component for content grouping with consistent styling and spacing', type: 'layout', demo: 'components/wb-card/wb-card-demo.html', doc: 'components/wb-card/wb-card.md'},
            {name: 'wb-modal', description: 'Modal dialog component for overlay content and user interactions', type: 'layout', demo: 'components/wb-modal/wb-modal-demo.html', doc: 'components/wb-modal/wb-modal.md'},
            {name: 'wb-table', description: 'Data table component with sorting and pagination support', type: 'layout', demo: 'components/wb-table/wb-table-demo.html', doc: 'components/wb-table/wb-table.md'},
            {name: 'wb-tab', description: 'Tab component for organizing content into separate panels', type: 'layout', demo: 'components/wb-tab/wb-tab-demo.html', doc: 'components/wb-tab/wb-tab.md'},

            // Utility Components
            {name: 'wb-color-picker', description: 'Interactive color picker for precise color selection with HSL controls', type: 'utility', demo: 'components/wb-color-picker/wb-color-picker-demo.html', doc: 'components/wb-color-picker/wb-color-picker.md'},
            {name: 'wb-color-transformer', description: 'Color transformation utility for adjusting hue, saturation, and lightness', type: 'utility', demo: null, doc: 'components/wb-color-transformer/wb-color-transformer.md'},
            {name: 'wb-color-mapper', description: 'Maps colors to semantic meanings (success, warning, error, info)', type: 'utility', demo: null, doc: 'components/wb-color-mapper/wb-color-mapper.md'},
            {name: 'wb-color-organ', description: 'Comprehensive color organization and management system', type: 'utility', demo: 'components/wb-color-organ/demo.html', doc: 'components/wb-color-organ/wb-color-organ.md'},
            {name: 'wb-color-utils', description: 'Utility functions for color calculations and conversions', type: 'utility', demo: null, doc: 'components/wb-color-utils/wb-color-utils.md'},
            {name: 'wb-search', description: 'Search component with debouncing and result highlighting', type: 'utility', demo: 'components/wb-search/wb-search-demo.html', doc: 'components/wb-search/wb-search.md'},
            {name: 'wb-status', description: 'Status indicator component showing system health and notifications', type: 'utility', demo: 'components/wb-status/wb-status-demo.html', doc: 'components/wb-status/wb-status.md'},
            {name: 'wb-theme', description: 'Theme management component for applying color schemes and mode switching', type: 'utility', demo: null, doc: 'components/wb-theme/wb-theme.md'},
            {name: 'wb-viewport', description: 'Viewport management component for responsive design control', type: 'utility', demo: 'components/wb-viewport/wb-viewport-demo.html', doc: 'components/wb-viewport/wb-viewport.md'},
            {name: 'wb-keyboard-manager', description: 'Keyboard event management for accessibility and shortcuts', type: 'utility', demo: 'components/wb-keyboard-manager/wb-keyboard-manager-demo.html', doc: 'components/wb-keyboard-manager/wb-keyboard-manager.md'},
            {name: 'wb-log-viewer', description: 'Log viewer component displaying event logs and debug information', type: 'utility', demo: null, doc: 'components/wb-log-viewer/wb-log-viewer.md'},
            {name: 'wb-log-error', description: 'Error logging component for capturing and displaying errors', type: 'utility', demo: 'components/wb-log-error/wb-log-error-demo.html', doc: 'components/wb-log-error/wb-log-error.md'},
            {name: 'wb-change-text', description: 'Text manipulation component for content editing and transformation', type: 'utility', demo: null, doc: 'components/wb-change-text/wb-change-text.md'},
            {name: 'wb-image-insert', description: 'Image insertion component with preview and metadata editing', type: 'utility', demo: 'components/wb-image-insert/image-insert.html', doc: 'components/wb-image-insert/wb-image-insert.md'},
            {name: 'wb-css-loader', description: 'Dynamic CSS loading component for runtime stylesheet injection', type: 'utility', demo: null, doc: 'components/wb-css-loader/wb-css-loader.md'},

            // Resize Components
            {name: 'wb-resize-panel', description: 'Base resizable panel component providing drag-to-resize functionality', type: 'utility', demo: 'components/wb-resize-panel/wb-resize-panel-demo.html', doc: 'components/wb-resize-panel/wb-resize-panel.md'},
            {name: 'wb-resize-both', description: 'Resizable component supporting both horizontal and vertical resizing', type: 'utility', demo: 'components/wb-resize-both/wb-resize-both-demo.html', doc: 'components/wb-resize-both/wb-resize-both.md'},
            {name: 'wb-resize-eastwest', description: 'Resizable component supporting left-right resizing', type: 'utility', demo: 'components/wb-resize-eastwest/wb-resize-eastwest-demo.html', doc: 'components/wb-resize-eastwest/wb-resize-eastwest.md'},
            {name: 'wb-resize-updown', description: 'Resizable component supporting top-bottom resizing', type: 'utility', demo: 'components/wb-resize-updown/wb-resize-updown-demo.html', doc: 'components/wb-resize-updown/wb-resize-updown.md'},

            // Testing & Development
            {name: 'wb-inject-test', description: 'Testing component for injecting and testing HTML and components', type: 'experimental', demo: 'components/wb-inject-test/wb-inject-test-demo.html', doc: 'components/wb-inject-test/wb-inject-test.md'},
            {name: 'wb-dev-toolbox', description: 'Development toolbox with debugging and testing utilities', type: 'experimental', demo: 'components/wb-dev-toolbox/wb-dev-toolbox-demo.html', doc: 'components/wb-dev-toolbox/wb-dev-toolbox.md'},
            {name: 'wb-demo', description: 'Demo component template for showcasing component features', type: 'experimental', demo: 'components/wb-demo/wb-demo-demo.html', doc: 'components/wb-demo/wb-demo.md'},
            {name: 'wb-semantic-elements', description: 'Wrapper for semantic HTML5 elements with enhanced styling', type: 'utility', demo: 'components/wb-semantic-elements/wb-semantic-elements-demo.html', doc: 'components/wb-semantic-elements/wb-semantic-elements.md'},
            {name: 'wb-rag', description: 'Retrieval-Augmented Generation component for AI-powered search', type: 'experimental', demo: 'components/wb-rag/wb-rag-demo.html', doc: 'components/wb-rag/wb-rag.md'},
            {name: 'wb-chatbot', description: 'Chatbot component for AI-powered conversations', type: 'experimental', demo: 'components/wb-chatbot/wb-chatbot.html', doc: 'components/wb-chatbot/wb-chatbot.md'},
            {name: 'wb-1rem', description: 'Utility component for 1rem sizing and spacing system', type: 'utility', demo: 'components/wb-1rem/demo.html', doc: 'components/wb-1rem/wb-1rem.md'},
            {name: 'wb-xtest', description: 'Extended testing component for comprehensive test scenarios', type: 'experimental', demo: 'components/wb-xtest/wb-xtest-demo.html', doc: 'components/wb-xtest/wb-xtest.md'}
        ];

        // Sort components alphabetically
        this.components.sort((a, b) => a.name.localeCompare(b.name));
    }

    connectedCallback() {
        this.logInfo('ComponentsIndex: connectedCallback called');
        this.setupEventListeners();
        this.renderComponents();
        this.renderHtmlFiles();
        this.logInfo('ComponentsIndex: connectedCallback completed');
    }

    setupEventListeners() {
        // Filter tabs
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleFilterClick(btn));
        });

        // Search box
        const searchBox = document.getElementById('searchInput');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // HTML Files search event listener
        const searchHtmlFiles = document.getElementById('searchHtmlFiles');
        if (searchHtmlFiles) {
            searchHtmlFiles.addEventListener('input', (e) => {
                const activeFilter = document.querySelector('[data-html-filter].active')?.dataset.htmlFilter || 'all';
                this.renderHtmlFiles(activeFilter, e.target.value);
            });
        }

        // HTML Files filter event listeners
        document.querySelectorAll('[data-html-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-html-filter]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const searchValue = document.getElementById('searchHtmlFiles')?.value || '';
                this.renderHtmlFiles(btn.dataset.htmlFilter, searchValue);
            });
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                btn.classList.add('active');
                
                // Show corresponding content
                const tabName = btn.dataset.tab;
                const tabContent = tabName === 'components' ? 
                    document.getElementById('componentsTab') : 
                    document.getElementById('filesTab');
                if (tabContent) tabContent.classList.add('active');
            });
        });
    }

    handleFilterClick(btn) {
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter components
        const filter = btn.dataset.filter;
        let filtered = this.components;

        if (filter !== 'all') {
            filtered = filtered.filter(c => c.type === filter);
        }

        this.renderComponents(filtered);
    }

    handleSearch(searchTerm) {
        const search = searchTerm.toLowerCase();
        const filtered = this.components.filter(component =>
            component.name.toLowerCase().includes(search) ||
            component.description.toLowerCase().includes(search)
        );
        this.renderComponents(filtered);
    }

    renderComponents(filteredComponents = this.components) {
        const grid = document.getElementById('componentsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!grid || !emptyState) return;

        // Clear grid
        grid.innerHTML = '';

        if (filteredComponents.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        // Render cards
        filteredComponents.forEach(comp => {
            const card = document.createElement('div');
            card.className = 'component-card';
            
            const header = document.createElement('div');
            header.className = 'component-header';
            
            const name = document.createElement('h3');
            name.className = 'component-name';
            name.textContent = comp.name;
            
            const type = document.createElement('span');
            type.className = `component-type ${comp.type}`;
            type.textContent = comp.type;
            
            header.appendChild(name);
            header.appendChild(type);
            
            const description = document.createElement('p');
            description.className = 'component-description';
            description.textContent = comp.description;
            
            const demo = document.createElement('wb-demo');
            demo.setAttribute('title', comp.name);
            if (comp.doc) demo.setAttribute('doc-url', comp.doc);
            if (comp.demo) demo.setAttribute('demo-url', comp.demo);
            
            card.appendChild(header);
            card.appendChild(description);
            card.appendChild(demo);
            
            grid.appendChild(card);
        });
    }

    renderHtmlFiles(filter = 'all', search = '') {
        const tbody = document.getElementById('htmlFilesBody');
        const emptyState = document.getElementById('emptyStateHtml');
        
        if (!tbody || !emptyState) return;
        
        let filtered = this.allHtmlFiles;

        // Filter by folder
        if (filter !== 'all') {
            filtered = filtered.filter(f => f.folder === filter);
        }

        // Filter by search
        if (search.trim()) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(f => 
                f.name.toLowerCase().includes(searchLower) ||
                f.path.toLowerCase().includes(searchLower) ||
                f.folder.toLowerCase().includes(searchLower)
            );
        }

        // Clear table
        tbody.innerHTML = '';

        if (filtered.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        // Render rows
        filtered.forEach(file => {
            const row = document.createElement('tr');
            
            // File name with link
            const nameCell = document.createElement('td');
            nameCell.innerHTML = `<a href="${file.path}" class="component-link" target="_blank">${file.name}</a>`;
            
            // Path
            const pathCell = document.createElement('td');
            pathCell.className = 'component-description';
            pathCell.textContent = file.path;
            
            // Folder badge
            const folderCell = document.createElement('td');
            folderCell.innerHTML = `<span class="status-badge ${file.folder}">${file.folder}</span>`;
            
            row.appendChild(nameCell);
            row.appendChild(pathCell);
            row.appendChild(folderCell);
            
            tbody.appendChild(row);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const index = new ComponentsIndex();
    // Since ComponentsIndex extends WBBaseComponent but isn't a custom element,
    // we need to manually call the initialization logic
    index.setupEventListeners();
    index.renderComponents();
    index.renderHtmlFiles();
});