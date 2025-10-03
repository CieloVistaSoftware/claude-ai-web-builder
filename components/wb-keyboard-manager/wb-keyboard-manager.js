/**
 * WB Keyboard Manager Component
 * Centralized keyboard event management for Website Builder
 * 
 * @version 1.0.0
 * @author Website Builder Components
 */

(function() {
    'use strict';

    class WBKeyboardManager extends HTMLElement {
        constructor() {
            super();
            
            this.shortcuts = new Map();
            this.contexts = new Set(['global']);
            this.activeContext = 'global';
            this.keySequence = [];
            this.sequenceTimeout = 1000;
            this.enabled = true;
            this.helpModalVisible = false;
            this.isInitialized = false;
            
            this.init();
        }
        
        async init() {
            if (this.isInitialized) {
                console.log('⌨️ WB Keyboard Manager: Already initialized, skipping');
                return;
            }
            
            console.log('⌨️ WB Keyboard Manager: Initializing...');
            
            // Load configuration
            await this.loadConfig();
            
            // Load CSS
            this.loadCSS();
            
            // Setup component
            this.setupComponent();
            this.registerDefaultShortcuts();
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('⌨️ WB Keyboard Manager: Ready');
        }
        
        async loadConfig() {
            try {
                const configPath = this.getComponentPath() + '/wb-keyboard-manager.json';
                const response = await fetch(configPath);
                const config = await response.json();
                
                // Apply configuration
                this.sequenceTimeout = config.settings?.sequenceTimeout || 1000;
                
                // Load shortcuts from config
                if (config.shortcuts && Array.isArray(config.shortcuts)) {
                    config.shortcuts.forEach(shortcut => {
                        this.registerShortcut(shortcut);
                    });
                }
                
                console.log('⌨️ WB Keyboard Manager: Configuration loaded', config);
            } catch (error) {
                console.warn('⌨️ WB Keyboard Manager: Failed to load configuration, using defaults', error);
            }
        }
        
        getComponentPath() {
            if (typeof WBComponentUtils !== 'undefined' && WBComponentUtils.getComponentPath) {
                return WBComponentUtils.getComponentPath('wb-keyboard-manager');
            }
            
            // Fallback path detection
            const scripts = document.querySelectorAll('script[src*="wb-keyboard-manager"]');
            if (scripts.length > 0) {
                const scriptSrc = scripts[0].src;
                return scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));
            }
            
            return './components/wb-keyboard-manager';
        }
        
        loadCSS() {
            if (typeof WBComponentUtils !== 'undefined' && WBComponentUtils.loadComponentCSS) {
                WBComponentUtils.loadComponentCSS('wb-keyboard-manager', this.getComponentPath() + '/wb-keyboard-manager.css');
            } else {
                // Fallback CSS loading
                const cssPath = this.getComponentPath() + '/wb-keyboard-manager.css';
                const existingLink = document.querySelector(`link[href*="wb-keyboard-manager.css"]`);
                
                if (!existingLink) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = cssPath;
                    document.head.appendChild(link);
                }
            }
        }
        
        setupComponent() {
            this.className = 'wb-keyboard-manager';
            this.style.display = 'none'; // Hidden by default, only shows help modal
        }
        
        registerDefaultShortcuts() {
            const defaultShortcuts = [
                {
                    keys: 'ctrl+k+h',
                    action: 'hideComponents',
                    description: 'Hide Website Builder Interface',
                    context: 'global',
                    handler: () => {
                        console.log('⌨️ Hide components triggered');
                        if (typeof hideComponents === 'function') {
                            hideComponents();
                        } else {
                            console.warn('hideComponents function not found');
                            alert('Hide components shortcut triggered!');
                        }
                    }
                },
                {
                    keys: 'ctrl+k+s',
                    action: 'showComponents',
                    description: 'Show Website Builder Interface', 
                    context: 'global',
                    handler: () => {
                        console.log('⌨️ Show components triggered');
                        if (typeof showComponents === 'function') {
                            showComponents();
                        } else {
                            console.warn('showComponents function not found');
                            alert('Show components shortcut triggered!');
                        }
                    }
                },
                {
                    keys: 'ctrl+k+?',
                    action: 'showHelp',
                    description: 'Show Keyboard Shortcuts Help',
                    context: 'global',
                    handler: () => {
                        console.log('⌨️ Show help (ctrl+k+?) triggered');
                        this.showHelp();
                    }
                },
                {
                    keys: '?',
                    action: 'showHelpQuestion',
                    description: 'Show Keyboard Shortcuts Help',
                    context: 'global',
                    handler: (e) => {
                        console.log('⌨️ Show help (?) triggered, input focused:', this.isInputFocused());
                        // Only show help if not in an input field
                        if (!this.isInputFocused()) {
                            this.showHelp();
                        }
                    }
                },
                {
                    keys: 'escape',
                    action: 'closeModals',
                    description: 'Close open modals and help',
                    context: 'global',
                    handler: () => {
                        console.log('⌨️ Escape triggered, help visible:', this.helpModalVisible);
                        if (this.helpModalVisible) {
                            this.hideHelp();
                        } else {
                            // Dispatch event for other components to handle
                            document.dispatchEvent(new CustomEvent('wb:escape-pressed', {
                                bubbles: true
                            }));
                        }
                    }
                }
            ];
            
            defaultShortcuts.forEach(shortcut => {
                this.registerShortcut(shortcut);
            });
            
            // Debug: log all registered shortcuts
            console.log('⌨️ Registered shortcuts:', Array.from(this.shortcuts.keys()));
        }
        
        setupEventListeners() {
            // Single document-level keydown listener
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            
            // Context change listeners
            document.addEventListener('focusin', this.handleFocusChange.bind(this));
            document.addEventListener('focusout', this.handleFocusChange.bind(this));
            
            // Component lifecycle listeners
            document.addEventListener('wb:component-focused', this.handleComponentFocus.bind(this));
            document.addEventListener('wb:edit-mode-changed', this.handleEditModeChange.bind(this));
        }
        
        handleKeyDown(e) {
            if (!this.enabled) return;
            
            // Prevent duplicate event processing
            if (e._wbKeyboardHandled) return;
            e._wbKeyboardHandled = true;
            
            // Build key combination string
            const key = this.buildKeyString(e);
            
            console.log('⌨️ Key pressed:', key, 'Current sequence:', this.keySequence);
            
            // Handle multi-key sequences (like Ctrl+K+H)
            if (this.isSequenceStart(key)) {
                console.log('⌨️ Starting sequence with:', key);
                e.preventDefault();
                this.keySequence = [key];
                
                // Clear sequence after timeout
                setTimeout(() => {
                    if (this.keySequence.length > 0) {
                        console.log('⌨️ Sequence timeout, clearing:', this.keySequence);
                        this.keySequence = [];
                    }
                }, this.sequenceTimeout);
                
                return;
            }
            
            // Build full key combination
            let fullKey = key;
            if (this.keySequence.length > 0) {
                fullKey = [...this.keySequence, key].join('+');
                console.log('⌨️ Built sequence:', fullKey);
                this.keySequence = []; // Clear sequence
            }
            
            // Find matching shortcut
            const shortcut = this.findShortcut(fullKey);
            console.log('⌨️ Looking for shortcut:', fullKey, 'Found:', !!shortcut);
            
            if (shortcut && this.isShortcutActive(shortcut)) {
                console.log('⌨️ Executing shortcut:', shortcut.action);
                
                // Dispatch before event
                const beforeEvent = new CustomEvent('wb:keyboard-shortcut-before', {
                    detail: { shortcut, event: e },
                    cancelable: true,
                    bubbles: true
                });
                
                if (!document.dispatchEvent(beforeEvent)) {
                    return; // Event was cancelled
                }
                
                // Prevent default and stop propagation if specified
                if (shortcut.preventDefault !== false) {
                    e.preventDefault();
                }
                if (shortcut.stopPropagation !== false) {
                    e.stopPropagation();
                    e.stopImmediatePropagation(); // Also prevent other handlers on same element
                }
                
                // Execute shortcut handler
                try {
                    if (shortcut.handler) {
                        shortcut.handler(e);
                    }
                    
                    // Dispatch after event
                    document.dispatchEvent(new CustomEvent('wb:keyboard-shortcut-executed', {
                        detail: { shortcut, event: e },
                        bubbles: true
                    }));
                    
                    // Log the action
                    this.logShortcutExecution(shortcut);
                    
                } catch (error) {
                    console.error('⌨️ Error executing keyboard shortcut:', error);
                    
                    // Dispatch error event
                    document.dispatchEvent(new CustomEvent('wb:keyboard-shortcut-error', {
                        detail: { shortcut, error, event: e },
                        bubbles: true
                    }));
                }
            }
        }
        
        buildKeyString(e) {
            const parts = [];
            
            // Add modifiers in consistent order
            if (e.ctrlKey || e.metaKey) parts.push('ctrl');
            if (e.altKey) parts.push('alt');
            if (e.shiftKey && e.key !== '?' && e.key !== 'Shift') parts.push('shift'); // Don't add shift for ? key
            
            // Add main key
            let key = e.key.toLowerCase();
            
            // Handle special characters that might have different key vs code values
            if (e.key === '?') {
                key = '?';
            }
            
            // Map special keys
            const keyMap = {
                ' ': 'space',
                'arrowup': 'up',
                'arrowdown': 'down',
                'arrowleft': 'left',
                'arrowright': 'right',
                'escape': 'escape'
            };
            
            parts.push(keyMap[key] || key);
            
            return parts.join('+');
        }
        
        isSequenceStart(key) {
            // Check if this key starts a multi-key sequence
            for (const [shortcutKey] of this.shortcuts) {
                const parts = shortcutKey.split('+');
                // Check if this is a multi-key sequence (more than 2 parts) and starts with current key
                if (parts.length > 2 && shortcutKey.startsWith(key + '+')) {
                    return true;
                }
            }
            return false;
        }
        
        findShortcut(key) {
            return this.shortcuts.get(key);
        }
        
        isShortcutActive(shortcut) {
            // Check if shortcut is enabled
            if (shortcut.enabled === false) return false;
            
            // Check context
            if (shortcut.context && shortcut.context !== 'global') {
                return this.activeContext === shortcut.context || 
                       this.contexts.has(shortcut.context);
            }
            
            // For global shortcuts, check if there's a more specific context shortcut
            if (shortcut.context === 'global' && this.hasSpecificContextShortcut(shortcut.keys)) {
                // A component-specific shortcut takes priority over global
                return this.activeContext === 'global';
            }
            
            return true;
        }
        
        hasSpecificContextShortcut(keys) {
            // Check if there's a non-global shortcut with the same keys
            for (const [shortcutKeys, shortcut] of this.shortcuts) {
                if (shortcutKeys === keys && shortcut.context !== 'global' && 
                    (this.activeContext === shortcut.context || this.contexts.has(shortcut.context))) {
                    return true;
                }
            }
            return false;
        }
        
        handleFocusChange(e) {
            // Update active context based on focused element
            const focusedElement = document.activeElement;
            
            if (focusedElement && focusedElement.tagName) {
                const tagName = focusedElement.tagName.toLowerCase();
                
                // Check for WB component
                if (tagName.startsWith('wb-')) {
                    this.setActiveContext(tagName);
                } else if (focusedElement.closest('[data-component]')) {
                    const component = focusedElement.closest('[data-component]').getAttribute('data-component');
                    this.setActiveContext(component);
                } else {
                    this.setActiveContext('global');
                }
            }
        }
        
        handleComponentFocus(e) {
            if (e.detail && e.detail.component) {
                this.setActiveContext(e.detail.component);
            }
        }
        
        handleEditModeChange(e) {
            if (e.detail && e.detail.enabled) {
                this.contexts.add('edit-mode');
            } else {
                this.contexts.delete('edit-mode');
            }
        }
        
        setActiveContext(context) {
            this.activeContext = context;
            this.contexts.add(context);
            
            // Dispatch context change event
            document.dispatchEvent(new CustomEvent('wb:keyboard-context-changed', {
                detail: { context, activeContext: this.activeContext },
                bubbles: true
            }));
        }
        
        isInputFocused() {
            const activeElement = document.activeElement;
            if (!activeElement) return false;
            
            const tagName = activeElement.tagName.toLowerCase();
            return tagName === 'input' || 
                   tagName === 'textarea' || 
                   tagName === 'select' ||
                   activeElement.contentEditable === 'true';
        }
        
        logShortcutExecution(shortcut) {
            // Dispatch event for logging
            document.dispatchEvent(new CustomEvent('wb:user', {
                detail: {
                    message: `Keyboard shortcut executed: ${shortcut.description}`,
                    source: 'wb-keyboard-manager',
                    action: shortcut.action,
                    keys: shortcut.keys,
                    context: shortcut.context
                }
            }));
        }
        
        // Public API Methods
        registerShortcut(shortcut) {
            if (!shortcut.keys || !shortcut.action) {
                console.warn('⌨️ Invalid shortcut registration:', shortcut);
                return false;
            }
            
            // Normalize keys
            const normalizedKeys = this.normalizeKeys(shortcut.keys);
            
            // Check for conflicts
            if (this.shortcuts.has(normalizedKeys)) {
                const existing = this.shortcuts.get(normalizedKeys);
                
                // Only warn if it's actually a different shortcut
                if (existing.action !== shortcut.action) {
                    console.warn('⌨️ Keyboard shortcut conflict detected:', {
                        keys: normalizedKeys,
                        existing: { action: existing.action, context: existing.context },
                        new: { action: shortcut.action, context: shortcut.context }
                    });
                    
                    // Dispatch conflict event
                    document.dispatchEvent(new CustomEvent('wb:keyboard-conflict', {
                        detail: { 
                            keys: normalizedKeys,
                            existing: existing,
                            new: shortcut
                        },
                        bubbles: true
                    }));
                } else {
                    // Same shortcut being re-registered, just update it silently
                    console.log('⌨️ Re-registering existing shortcut:', normalizedKeys);
                }
            }
            
            // Set defaults
            const fullShortcut = {
                enabled: true,
                preventDefault: true,
                stopPropagation: true,
                context: 'global',
                ...shortcut,
                keys: normalizedKeys
            };
            
            this.shortcuts.set(normalizedKeys, fullShortcut);
            
            console.log('⌨️ Registered shortcut:', fullShortcut);
            return true;
        }
        
        unregisterShortcut(keys) {
            const normalizedKeys = this.normalizeKeys(keys);
            const removed = this.shortcuts.delete(normalizedKeys);
            
            if (removed) {
                console.log('⌨️ Unregistered shortcut:', normalizedKeys);
            }
            
            return removed;
        }
        
        getShortcuts(context = null) {
            if (!context) {
                return Array.from(this.shortcuts.values());
            }
            
            return Array.from(this.shortcuts.values()).filter(s => s.context === context);
        }
        
        normalizeKeys(keys) {
            // Normalize key combination string
            return keys.toLowerCase()
                      .replace(/\s+/g, '')
                      .replace(/control/g, 'ctrl')
                      .replace(/option/g, 'alt')
                      .replace(/cmd|super|meta/g, 'ctrl');
        }
        
        enable() {
            this.enabled = true;
            console.log('⌨️ Keyboard manager enabled');
        }
        
        disable() {
            this.enabled = false;
            console.log('⌨️ Keyboard manager disabled');
        }
        
        showHelp() {
            this.helpModalVisible = true;
            this.renderHelpModal();
            
            // Dispatch event
            document.dispatchEvent(new CustomEvent('wb:keyboard-help-shown', {
                bubbles: true
            }));
        }
        
        hideHelp() {
            this.helpModalVisible = false;
            const modal = document.getElementById('wb-keyboard-help-modal');
            if (modal) {
                modal.remove();
            }
            
            // Dispatch event
            document.dispatchEvent(new CustomEvent('wb:keyboard-help-hidden', {
                bubbles: true
            }));
        }
        
        renderHelpModal() {
            // Remove existing modal
            const existingModal = document.getElementById('wb-keyboard-help-modal');
            if (existingModal) {
                existingModal.remove();
            }
            
            // Group shortcuts by context
            const shortcutsByContext = this.groupShortcutsByContext();
            
            // Create modal
            const modal = document.createElement('div');
            modal.id = 'wb-keyboard-help-modal';
            modal.className = 'wb-keyboard-help-modal';
            modal.innerHTML = `
                <div class="wb-keyboard-help-overlay" onclick="document.querySelector('wb-keyboard-manager').hideHelp()"></div>
                <div class="wb-keyboard-help-content">
                    <div class="wb-keyboard-help-header">
                        <h2>⌨️ Keyboard Shortcuts</h2>
                        <button class="wb-keyboard-help-close" onclick="document.querySelector('wb-keyboard-manager').hideHelp()">✕</button>
                    </div>
                    <div class="wb-keyboard-help-body">
                        ${this.renderShortcutGroups(shortcutsByContext)}
                    </div>
                    <div class="wb-keyboard-help-footer">
                        <p>Press <kbd>Escape</kbd> to close this help</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Focus the modal for accessibility
            modal.querySelector('.wb-keyboard-help-content').focus();
        }
        
        groupShortcutsByContext() {
            const groups = {};
            
            for (const shortcut of this.shortcuts.values()) {
                const context = shortcut.context || 'global';
                if (!groups[context]) {
                    groups[context] = [];
                }
                groups[context].push(shortcut);
            }
            
            return groups;
        }
        
        renderShortcutGroups(groups) {
            return Object.entries(groups).map(([context, shortcuts]) => {
                const contextName = context === 'global' ? 'Global' : context;
                
                return `
                    <div class="wb-keyboard-help-group">
                        <h3>${contextName}</h3>
                        <div class="wb-keyboard-help-shortcuts">
                            ${shortcuts.map(shortcut => `
                                <div class="wb-keyboard-help-shortcut">
                                    <div class="wb-keyboard-help-keys">
                                        ${this.renderKeys(shortcut.keys)}
                                    </div>
                                    <div class="wb-keyboard-help-description">
                                        ${shortcut.description}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        renderKeys(keys) {
            return keys.split('+').map(key => {
                // Capitalize and format keys
                const formatted = key === 'ctrl' ? 'Ctrl' :
                                 key === 'alt' ? 'Alt' :
                                 key === 'shift' ? 'Shift' :
                                 key === 'space' ? 'Space' :
                                 key.length === 1 ? key.toUpperCase() :
                                 key.charAt(0).toUpperCase() + key.slice(1);
                
                return `<kbd>${formatted}</kbd>`;
            }).join(' + ');
        }
    }
    
    // Register the custom element
    if (!customElements.get('wb-keyboard-manager')) {
        customElements.define('wb-keyboard-manager', WBKeyboardManager);
        console.log('⌨️ WB Keyboard Manager: Component registered');
    }
    
    // Make class globally available
    window.WBKeyboardManager = WBKeyboardManager;
    
})();