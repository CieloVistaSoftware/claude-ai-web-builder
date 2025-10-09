/**
 * WB Tab Web Component
 * 
 * A flexible, accessible tab component with multiple variants and features:
 * - Keyboard navigation (Arrow keys, Home, End, Enter, Space)
 * - Multiple visual variants (default, pills, underline, card)
 * - Horizontal and vertical orientations
 * - Closable tabs with close buttons
 * - Lazy loading of tab content
 * - Scrollable tab headers for overflow
 * - Smooth animations and transitions
 * - Theme support (light, dark, auto)
 * - ARIA accessibility compliance
 * 
 * Usage:
 * <wb-tab active-tab="0" variant="pills" theme="dark">
 *   <wb-tab-item tab-id="tab1" icon="🏠">Home</wb-tab-item>
 *   <wb-tab-item tab-id="tab2" icon="👤">Profile</wb-tab-item>
 *   <wb-tab-item tab-id="tab3" closable>Settings</wb-tab-item>
 *   
 *   <wb-tab-panel tab-for="tab1">
 *     <h2>Home Content</h2>
 *     <p>Welcome to the home tab!</p>
 *   </wb-tab-panel>
 *   
 *   <wb-tab-panel tab-for="tab2" lazy>
 *     <h2>Profile Content</h2>
 *     <p>User profile information...</p>
 *   </wb-tab-panel>
 *   
 *   <wb-tab-panel tab-for="tab3">
 *     <h2>Settings</h2>
 *     <p>Application settings...</p>
 *   </wb-tab-panel>
 * </wb-tab>
 * 
 * Events:
 * - tab-change: Fired when active tab changes
 * - tab-close: Fired when a tab is closed
 * - tab-add: Fired when a new tab is added
 */

// Load configuration from schema
let config = {};
(async () => {
    try {
        const configPath = window.WBComponentUtils ? 
            window.WBComponentUtils.getPath('wb-tab.js', '../components/wb-tab/') + 'wb-tab.schema.json' :
            './wb-tab.schema.json';
        const response = await fetch(configPath);
        if (response.ok) {
            config = await response.json();
        }
    } catch (error) {
        console.warn('🏷️ WB Tab: Could not load wb-tab.schema.json, using defaults', error);
    }
})();

class WBTab extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // State management
        this.state = {
            activeTab: null,
            tabs: new Map(),
            panels: new Map(),
            initialized: false
        };
        
        // Configuration
        this.config = {
            activeTab: '0',
            theme: 'auto',
            orientation: 'horizontal',
            variant: 'default',
            closable: false,
            lazyLoad: false,
            scrollable: true,
            animated: true,
            disabled: false
        };
        
        // Bind methods
        this.handleTabClick = this.handleTabClick.bind(this);
        this.handleTabKeydown = this.handleTabKeydown.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleSlotChange = this.handleSlotChange.bind(this);
    }
    
    static get observedAttributes() {
        return [
            'active-tab', 'theme', 'orientation', 'variant', 
            'closable', 'lazy-load', 'scrollable', 'animated', 'disabled'
        ];
    }
    
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.initializeTabs();
        this.updateConfiguration();
        
        // Dispatch ready event
        this.dispatchEvent(new CustomEvent('wb:ready', {
            detail: { component: 'wb-tab', element: this },
            bubbles: true
        }));
    }
    
    disconnectedCallback() {
        this.removeEventListeners();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        switch (name) {
            case 'active-tab':
                this.config.activeTab = newValue || '0';
                if (this.state.initialized) {
                    this.setActiveTab(this.config.activeTab);
                }
                break;
            case 'theme':
                this.config.theme = newValue || 'auto';
                this.updateTheme();
                break;
            case 'orientation':
                this.config.orientation = newValue || 'horizontal';
                this.updateOrientation();
                break;
            case 'variant':
                this.config.variant = newValue || 'default';
                this.updateVariant();
                break;
            case 'closable':
                this.config.closable = newValue !== null;
                this.updateClosableState();
                break;
            case 'lazy-load':
                this.config.lazyLoad = newValue !== null;
                break;
            case 'scrollable':
                this.config.scrollable = newValue !== null;
                this.updateScrollable();
                break;
            case 'animated':
                this.config.animated = newValue !== null;
                this.updateAnimated();
                break;
            case 'disabled':
                this.config.disabled = newValue !== null;
                this.updateDisabledState();
                break;
        }
    }
    
    render() {
        // CSS-first approach - external stylesheet
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./wb-tab.css">
                
                :host([disabled]) {
                    opacity: 0.6;
                    pointer-events: none;
                }
                
                /* Theme variants */
                :host([theme="dark"]) {
                    --tab-bg: var(--neutral-800, #1f2937);
                    --tab-border: var(--neutral-600, #4b5563);
                    --tab-text: var(--neutral-200, #e5e7eb);
                    --tab-text-active: var(--primary-300, #93c5fd);
                    --tab-bg-active: var(--neutral-700, #374151);
                    --tab-bg-hover: var(--neutral-700, #374151);
                    --tab-focus: var(--primary-800, #1e40af);
                }
                
                .tab-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 0;
                }
                
                .tab-header {
                    display: flex;
                    background: var(--tab-bg);
                    border-bottom: 1px solid var(--tab-border);
                    position: relative;
                    min-height: 40px;
                }
                
                .tab-list {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                }
                
                .tab-list.scrollable {
                    overflow-x: auto;
                    scrollbar-width: thin;
                }
                
                .tab-list::-webkit-scrollbar {
                    height: 2px;
                }
                
                .tab-list::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .tab-list::-webkit-scrollbar-thumb {
                    background: var(--tab-border);
                    border-radius: 1px;
                }
                
                .tab-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 16px;
                    background: none;
                    border: none;
                    color: var(--tab-text);
                    cursor: pointer;
                    transition: all var(--transition-speed) ease;
                    position: relative;
                    white-space: nowrap;
                    font-size: 14px;
                    font-weight: 500;
                    text-decoration: none;
                    outline: none;
                    gap: 8px;
                    min-width: 0;
                }
                
                .tab-item:hover:not([disabled]):not(.active) {
                    background: var(--tab-bg-hover);
                }
                
                .tab-item:focus-visible {
                    box-shadow: inset 0 0 0 2px var(--tab-focus);
                }
                
                .tab-item.active {
                    color: var(--tab-text-active);
                    background: var(--tab-bg-active);
                }
                
                .tab-item[disabled] {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .tab-icon {
                    flex-shrink: 0;
                    font-size: 16px;
                }
                
                .tab-label {
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .tab-close {
                    flex-shrink: 0;
                    width: 16px;
                    height: 16px;
                    border: none;
                    background: none;
                    color: inherit;
                    cursor: pointer;
                    border-radius: 3px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    opacity: 0.7;
                    transition: all var(--transition-speed) ease;
                }
                
                .tab-close:hover {
                    opacity: 1;
                    background: var(--tab-bg-hover);
                }
                
                .tab-content {
                    flex: 1;
                    min-height: 0;
                    position: relative;
                    overflow: hidden;
                }
                
                /* Variant styles */
                :host([variant="pills"]) .tab-item {
                    border-radius: var(--tab-radius);
                    margin: 4px 2px;
                }
                
                :host([variant="underline"]) .tab-header {
                    border-bottom: 1px solid var(--tab-border);
                }
                
                :host([variant="underline"]) .tab-item {
                    border-bottom: 2px solid transparent;
                    border-radius: 0;
                }
                
                :host([variant="underline"]) .tab-item.active {
                    border-bottom-color: var(--tab-text-active);
                    background: none;
                }
                
                :host([variant="card"]) .tab-item {
                    border: 1px solid var(--tab-border);
                    border-bottom: none;
                    border-radius: var(--tab-radius) var(--tab-radius) 0 0;
                    margin-right: -1px;
                }
                
                :host([variant="card"]) .tab-item.active {
                    border-bottom: 1px solid var(--tab-bg-active);
                    margin-bottom: -1px;
                }
                
                /* Orientation styles */
                :host([orientation="vertical"]) .tab-container {
                    flex-direction: row;
                }
                
                :host([orientation="vertical"]) .tab-header {
                    flex-direction: column;
                    border-bottom: none;
                    border-right: 1px solid var(--tab-border);
                    min-width: 200px;
                    width: auto;
                }
                
                :host([orientation="vertical"]) .tab-list {
                    flex-direction: column;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
                
                :host([orientation="vertical"]) .tab-item {
                    justify-content: flex-start;
                    text-align: left;
                }
                
                /* Animation styles */
                :host([animated]) .tab-content ::slotted(wb-tab-panel) {
                    transition: opacity var(--transition-speed) ease;
                }
                
                :host(:not([animated])) * {
                    transition: none !important;
                }
                
                /* Responsive design */
                @media (max-width: 768px) {
                    :host([orientation="vertical"]) .tab-container {
                        flex-direction: column;
                    }
                    
                    :host([orientation="vertical"]) .tab-header {
                        flex-direction: row;
                        border-right: none;
                        border-bottom: 1px solid var(--tab-border);
                        min-width: auto;
                    }
                    
                    :host([orientation="vertical"]) .tab-list {
                        flex-direction: row;
                        overflow-x: auto;
                        overflow-y: hidden;
                    }
                }
                
                /* Focus management */
                .tab-list:focus-within .tab-item:not(:focus-visible) {
                    outline: none;
                }
                
                /* Accessibility improvements */
                @media (prefers-reduced-motion: reduce) {
                    :host * {
                        transition: none !important;
                    }
                }
                
                @media (prefers-contrast: high) {
                    .tab-item {
                        border: 1px solid currentColor;
                    }
                    
                    .tab-item.active {
                        background: currentColor;
                        color: var(--tab-bg);
                    }
                }
            </style>
            
            <div class="tab-container">
                <div class="tab-header">
                    <div class="tab-list" role="tablist" aria-orientation="horizontal">
                        <slot name="tabs"></slot>
                    </div>
                </div>
                
                <div class="tab-content">
                    <slot name="panels"></slot>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Listen for slotted content changes
        const tabsSlot = this.shadowRoot.querySelector('slot[name="tabs"]');
        const panelsSlot = this.shadowRoot.querySelector('slot[name="panels"]');
        
        if (tabsSlot) {
            tabsSlot.addEventListener('slotchange', this.handleSlotChange);
        }
        
        if (panelsSlot) {
            panelsSlot.addEventListener('slotchange', this.handleSlotChange);
        }
        
        // Keyboard navigation for tab list
        const tabList = this.shadowRoot.querySelector('.tab-list');
        if (tabList) {
            tabList.addEventListener('keydown', this.handleTabKeydown);
        }
    }
    
    removeEventListeners() {
        const tabsSlot = this.shadowRoot.querySelector('slot[name="tabs"]');
        const panelsSlot = this.shadowRoot.querySelector('slot[name="panels"]');
        
        if (tabsSlot) {
            tabsSlot.removeEventListener('slotchange', this.handleSlotChange);
        }
        
        if (panelsSlot) {
            panelsSlot.removeEventListener('slotchange', this.handleSlotChange);
        }
    }
    
    handleSlotChange() {
        this.initializeTabs();
    }
    
    initializeTabs() {
        // Clear existing state
        this.state.tabs.clear();
        this.state.panels.clear();
        
        // Collect tab items
        const tabItems = Array.from(this.querySelectorAll('wb-tab-item'));
        const tabPanels = Array.from(this.querySelectorAll('wb-tab-panel'));
        
        // Setup tab items
        tabItems.forEach((tab, index) => {
            const tabId = tab.getAttribute('tab-id') || index.toString();
            tab.setAttribute('slot', 'tabs');
            tab.setAttribute('role', 'tab');
            tab.setAttribute('tabindex', '-1');
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('id', `tab-${tabId}`);
            
            // Add click listener
            tab.addEventListener('click', this.handleTabClick);
            
            // Store tab reference
            this.state.tabs.set(tabId, tab);
            
            // Setup close button if needed
            if (this.config.closable || tab.hasAttribute('closable')) {
                this.setupCloseButton(tab, tabId);
            }
        });
        
        // Setup tab panels
        tabPanels.forEach((panel, index) => {
            const tabFor = panel.getAttribute('tab-for') || index.toString();
            panel.setAttribute('slot', 'panels');
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('tabindex', '0');
            panel.setAttribute('aria-labelledby', `tab-${tabFor}`);
            panel.setAttribute('id', `panel-${tabFor}`);
            panel.style.display = 'none';
            
            // Store panel reference
            this.state.panels.set(tabFor, panel);
        });
        
        // Set initial active tab
        this.state.initialized = true;
        this.setActiveTab(this.config.activeTab);
    }
    
    setupCloseButton(tab, tabId) {
        let closeButton = tab.querySelector('.tab-close');
        if (!closeButton) {
            closeButton = document.createElement('button');
            closeButton.className = 'tab-close';
            closeButton.innerHTML = '×';
            closeButton.setAttribute('aria-label', 'Close tab');
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleCloseClick(tabId);
            });
            tab.appendChild(closeButton);
        }
    }
    
    handleTabClick(event) {
        const tab = event.currentTarget;
        const tabId = tab.getAttribute('tab-id') || Array.from(this.state.tabs.keys())[Array.from(this.state.tabs.values()).indexOf(tab)];
        
        if (!tab.hasAttribute('disabled')) {
            this.setActiveTab(tabId);
        }
    }
    
    handleTabKeydown(event) {
        const tabs = Array.from(this.state.tabs.values()).filter(tab => !tab.hasAttribute('disabled'));
        const currentIndex = tabs.findIndex(tab => tab === document.activeElement);
        
        let nextIndex = currentIndex;
        
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                event.preventDefault();
                nextIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                nextIndex = tabs.length - 1;
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (currentIndex >= 0) {
                    tabs[currentIndex].click();
                }
                return;
        }
        
        if (nextIndex !== currentIndex && tabs[nextIndex]) {
            tabs[nextIndex].focus();
            tabs[nextIndex].click();
        }
    }
    
    handleCloseClick(tabId) {
        const tab = this.state.tabs.get(tabId);
        const panel = this.state.panels.get(tabId);
        
        if (tab && panel) {
            // Dispatch close event
            const closeEvent = new CustomEvent('tab-close', {
                detail: { tabId, tab, panel },
                bubbles: true,
                cancelable: true
            });
            
            if (this.dispatchEvent(closeEvent)) {
                // Remove tab and panel
                tab.remove();
                panel.remove();
                this.state.tabs.delete(tabId);
                this.state.panels.delete(tabId);
                
                // If this was the active tab, activate another
                if (this.state.activeTab === tabId) {
                    const remainingTabs = Array.from(this.state.tabs.keys());
                    if (remainingTabs.length > 0) {
                        this.setActiveTab(remainingTabs[0]);
                    }
                }
            }
        }
    }
    
    setActiveTab(tabId) {
        // Deactivate all tabs and panels
        this.state.tabs.forEach((tab, id) => {
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
            tab.classList.remove('active');
        });
        
        this.state.panels.forEach((panel, id) => {
            panel.style.display = 'none';
            panel.setAttribute('aria-hidden', 'true');
        });
        
        // Activate selected tab and panel
        const activeTab = this.state.tabs.get(tabId);
        const activePanel = this.state.panels.get(tabId);
        
        if (activeTab && activePanel) {
            activeTab.setAttribute('aria-selected', 'true');
            activeTab.setAttribute('tabindex', '0');
            activeTab.classList.add('active');
            
            activePanel.style.display = 'block';
            activePanel.setAttribute('aria-hidden', 'false');
            
            // Scroll tab into view if needed
            this.scrollTabIntoView(activeTab);
            
            // Handle lazy loading
            if (this.config.lazyLoad || activePanel.hasAttribute('lazy')) {
                this.loadPanelContent(activePanel);
            }
            
            // Update state
            this.state.activeTab = tabId;
            
            // Dispatch change event
            this.dispatchEvent(new CustomEvent('tab-change', {
                detail: { tabId, tab: activeTab, panel: activePanel },
                bubbles: true
            }));
        }
    }
    
    scrollTabIntoView(tab) {
        const tabList = this.shadowRoot.querySelector('.tab-list');
        if (tabList && this.config.scrollable) {
            const tabRect = tab.getBoundingClientRect();
            const listRect = tabList.getBoundingClientRect();
            
            if (tabRect.left < listRect.left) {
                tabList.scrollLeft -= (listRect.left - tabRect.left) + 20;
            } else if (tabRect.right > listRect.right) {
                tabList.scrollLeft += (tabRect.right - listRect.right) + 20;
            }
        }
    }
    
    loadPanelContent(panel) {
        if (!panel.hasAttribute('data-loaded')) {
            panel.setAttribute('data-loaded', 'true');
            
            // Dispatch load event for lazy content
            panel.dispatchEvent(new CustomEvent('panel-load', {
                detail: { panel },
                bubbles: true
            }));
        }
    }
    
    updateConfiguration() {
        // Apply configuration from attributes
        Object.keys(this.config).forEach(key => {
            const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (this.hasAttribute(attrName)) {
                const value = this.getAttribute(attrName);
                if (typeof this.config[key] === 'boolean') {
                    this.config[key] = value !== null;
                } else {
                    this.config[key] = value;
                }
            }
        });
        
        this.updateTheme();
        this.updateOrientation();
        this.updateVariant();
        this.updateScrollable();
        this.updateAnimated();
        this.updateDisabledState();
    }
    
    updateTheme() {
        this.setAttribute('theme', this.config.theme);
    }
    
    updateOrientation() {
        this.setAttribute('orientation', this.config.orientation);
        const tabList = this.shadowRoot.querySelector('.tab-list');
        if (tabList) {
            tabList.setAttribute('aria-orientation', this.config.orientation);
        }
    }
    
    updateVariant() {
        this.setAttribute('variant', this.config.variant);
    }
    
    updateClosableState() {
        if (this.config.closable) {
            this.setAttribute('closable', '');
            // Add close buttons to existing tabs
            this.state.tabs.forEach((tab, tabId) => {
                this.setupCloseButton(tab, tabId);
            });
        } else {
            this.removeAttribute('closable');
        }
    }
    
    updateScrollable() {
        const tabList = this.shadowRoot.querySelector('.tab-list');
        if (tabList) {
            tabList.classList.toggle('scrollable', this.config.scrollable);
        }
    }
    
    updateAnimated() {
        if (this.config.animated) {
            this.setAttribute('animated', '');
        } else {
            this.removeAttribute('animated');
        }
    }
    
    updateDisabledState() {
        if (this.config.disabled) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }
    
    // Public API
    addTab(tabData) {
        const { id, label, content, icon, closable = false, disabled = false } = tabData;
        
        // Create tab item
        const tabItem = document.createElement('wb-tab-item');
        tabItem.setAttribute('tab-id', id);
        if (icon) tabItem.setAttribute('icon', icon);
        if (closable) tabItem.setAttribute('closable', '');
        if (disabled) tabItem.setAttribute('disabled', '');
        tabItem.textContent = label;
        
        // Create tab panel
        const tabPanel = document.createElement('wb-tab-panel');
        tabPanel.setAttribute('tab-for', id);
        if (typeof content === 'string') {
            tabPanel.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            tabPanel.appendChild(content);
        }
        
        // Add to DOM
        this.appendChild(tabItem);
        this.appendChild(tabPanel);
        
        // Dispatch add event
        this.dispatchEvent(new CustomEvent('tab-add', {
            detail: { tabId: id, tab: tabItem, panel: tabPanel },
            bubbles: true
        }));
        
        return { tab: tabItem, panel: tabPanel };
    }
    
    removeTab(tabId) {
        this.handleCloseClick(tabId);
    }
    
    getActiveTab() {
        return this.state.activeTab;
    }
    
    getAllTabs() {
        return Array.from(this.state.tabs.keys());
    }
    
    enableTab(tabId) {
        const tab = this.state.tabs.get(tabId);
        if (tab) {
            tab.removeAttribute('disabled');
        }
    }
    
    disableTab(tabId) {
        const tab = this.state.tabs.get(tabId);
        if (tab) {
            tab.setAttribute('disabled', '');
        }
    }
}

// Define the custom elements
customElements.define('wb-tab', WBTab);

// Tab Item Component
class WBTabItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
    }
    
    render() {
        const icon = this.getAttribute('icon');
        const disabled = this.hasAttribute('disabled');
        const closable = this.hasAttribute('closable');
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: contents;
                }
                
                .tab-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-width: 0;
                }
                
                .tab-icon {
                    flex-shrink: 0;
                    font-size: 16px;
                }
                
                .tab-label {
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            </style>
            
            <div class="tab-item">
                ${icon ? `<span class="tab-icon">${icon}</span>` : ''}
                <span class="tab-label">
                    <slot></slot>
                </span>
            </div>
        `;
    }
}

customElements.define('wb-tab-item', WBTabItem);

// Tab Panel Component
class WBTabPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 16px;
                    outline: none;
                }
                
                :host([hidden]) {
                    display: none !important;
                }
            </style>
            
            <slot></slot>
        `;
    }
}

customElements.define('wb-tab-panel', WBTabPanel);

// Register tab components with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    // Main tab container component
    window.WBComponentRegistry.register('wb-tab', WBTab, ['wb-event-log'], {
        version: '1.0.0',
        type: 'navigation',
        role: 'ui-element',
        description: 'Tab container component with support for horizontal and vertical layouts',
        api: {
            static: [],
            events: ['tab-changed', 'tab-activated', 'tab-deactivated'],
            attributes: ['layout', 'active-tab', 'variant'],
            methods: ['setActiveTab', 'addTab', 'removeTab', 'getActiveTab']
        },
        priority: 5 // Navigation component depends on infrastructure
    });
    
    // Tab item component
    window.WBComponentRegistry.register('wb-tab-item', WBTabItem, ['wb-event-log'], {
        version: '1.0.0',
        type: 'navigation',
        role: 'ui-element',
        description: 'Individual tab item component for wb-tab container',
        api: {
            static: [],
            events: ['click', 'focus'],
            attributes: ['icon', 'active', 'disabled'],
            methods: ['render']
        },
        priority: 5
    });
    
    // Tab panel component  
    window.WBComponentRegistry.register('wb-tab-panel', WBTabPanel, ['wb-event-log'], {
        version: '1.0.0',
        type: 'navigation',
        role: 'ui-element',
        description: 'Tab panel content component for wb-tab container',
        api: {
            static: [],
            events: ['show', 'hide'],
            attributes: ['active'],
            methods: ['render']
        },
        priority: 5
    });
}