import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

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
        }

        async connectedCallback() {
            await loadComponentCSS(this, 'wb-keyboard-manager.css');
            this.init();
        }

        init() {
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
                if (window.WBEventLog) {
                    WBEventLog.logInfo('WB Keyboard Manager: Already initialized, skipping', { 
                        component: 'wb-keyboard-manager', 
                        method: 'init', 
                        line: 30 
                    });
                } else {
                    console.log('⌨️ WB Keyboard Manager: Already initialized, skipping');
                }
                return;
            }
            
            if (window.WBEventLog) {
                WBEventLog.logInfo('WB Keyboard Manager: Initializing...', { 
                    component: 'wb-keyboard-manager', 
                    method: 'init', 
                    line: 34 
                });
            } else {
                console.log('⌨️ WB Keyboard Manager: Initializing...');
            }
            
            // Load configuration
            await this.loadConfig();
            
            // Load CSS
            this.loadCSS();
            
            // Setup component
            this.setupComponent();
            this.registerDefaultShortcuts();
            this.setupEventListeners();
            
            this.isInitialized = true;
            if (window.WBEventLog) {
                WBEventLog.logSuccess('WB Keyboard Manager: Ready', { 
                    component: 'wb-keyboard-manager', 
                    method: 'init', 
                    line: 48 
                });
            } else {
                console.log('⌨️ WB Keyboard Manager: Ready');
            }
        }
        
        async loadConfig() {
            try {
                const configPath = window.WBComponentUtils?.resolve('wb.keyboard-manager.config') || (this.getComponentPath() + '/wb-keyboard-manager.json');
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
                
                if (window.WBEventLog) {
                    WBEventLog.logSuccess('WB Keyboard Manager: Configuration loaded', { 
                        component: 'wb-keyboard-manager', 
                        method: 'loadConfig', 
                        line: 67, 
                        config: config 
                    });
                } else {
                    console.log('⌨️ WB Keyboard Manager: Configuration loaded', config);
                }
            } catch (error) {
                if (window.WBEventLog) {
                    WBEventLog.logWarning('WB Keyboard Manager: Failed to load configuration, using defaults', { 
                        component: 'wb-keyboard-manager', 
                        method: 'loadConfig', 
                        line: 69, 
                        error: error.message 
                    });
                } else {
                    console.warn('⌨️ WB Keyboard Manager: Failed to load configuration, using defaults', error);
                }
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
                WBComponentUtils.loadComponentCSS('wb-keyboard-manager', window.WBComponentUtils?.resolve('wb.keyboard-manager.css') || (this.getComponentPath() + '/wb-keyboard-manager.css'));
            } else {
                // Fallback CSS loading
                const cssPath = window.WBComponentUtils?.resolve('wb.keyboard-manager.css') || (this.getComponentPath() + '/wb-keyboard-manager.css');
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
                        if (window.WBEventLog) {
                            WBEventLog.logUser('Hide components triggered', { 
                                component: 'wb-keyboard-manager', 
                                method: 'hideComponentsHandler', 
                                line: 118 
                            });
                        } else {
                            console.log('⌨️ Hide components triggered');
                        }
                        if (typeof hideComponents === 'function') {
                            hideComponents();
                        } else {
                            if (window.WBEventLog) {
                                WBEventLog.logWarning('hideComponents function not found', { 
                                    component: 'wb-keyboard-manager', 
                                    method: 'hideComponentsHandler', 
                                    line: 122 
                                });
                            } else {
                                console.warn('hideComponents function not found');
                            }
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
                        if (window.WBEventLog) {
                            WBEventLog.logUser('Show components triggered', { 
                                component: 'wb-keyboard-manager', 
                                method: 'showComponentsHandler', 
                                line: 133 
                            });
                        } else {
                            console.log('⌨️ Show components triggered');
                        }
                        if (typeof showComponents === 'function') {
                            showComponents();
                        } else {
                            if (window.WBEventLog) {
                                WBEventLog.logWarning('showComponents function not found', { 
                                    component: 'wb-keyboard-manager', 
                                    method: 'showComponentsHandler', 
                                    line: 137 
                                });
                            } else {
                                console.warn('showComponents function not found');
                            }
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
                        if (window.WBEventLog) {
                            WBEventLog.logUser('Show help (ctrl+k+?) triggered', { 
                                component: 'wb-keyboard-manager', 
                                method: 'showHelpHandler', 
                                line: 148 
                            });
                        } else {
                            console.log('⌨️ Show help (ctrl+k+?) triggered');
                        }
                        this.showHelp();
                    }
                },
                {
                    keys: '?',
                    action: 'showHelpQuestion',
                    description: 'Show Keyboard Shortcuts Help',
                    context: 'global',
                    handler: (e) => {
                        if (window.WBEventLog) {
                            WBEventLog.logUser('Show help (?) triggered', { 
                                component: 'wb-keyboard-manager', 
                                method: 'questionMarkHandler', 
                                line: 158, 
                                inputFocused: this.isInputFocused() 
                            });
                        } else {
                            console.log('⌨️ Show help (?) triggered, input focused:', this.isInputFocused());
                        }
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
                        if (window.WBEventLog) {
                            WBEventLog.logUser('Escape triggered', { 
                                component: 'wb-keyboard-manager', 
                                method: 'escapeHandler', 
                                line: 171, 
                                helpVisible: this.helpModalVisible 
                            });
                        } else {
                            console.log('⌨️ Escape triggered, help visible:', this.helpModalVisible);
                        }
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
            if (window.WBEventLog) {
                WBEventLog.logDebug('Registered shortcuts', { 
                    component: 'wb-keyboard-manager', 
                    method: 'registerDefaultShortcuts', 
                    line: 189, 
                    shortcuts: Array.from(this.shortcuts.keys()) 
                });
            } else {
                console.log('⌨️ Registered shortcuts:', Array.from(this.shortcuts.keys()));
            }
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
            
            if (window.WBEventLog) {
                WBEventLog.logDebug('Key pressed', { 
                    component: 'wb-keyboard-manager', 
                    method: 'handleKeyDown', 
                    line: 215, 
                    key: key, 
                    sequence: this.keySequence 
                });
            } else {
                console.log('⌨️ Key pressed:', key, 'Current sequence:', this.keySequence);
            }
            
            // Handle multi-key sequences (like Ctrl+K+H)
            if (this.isSequenceStart(key)) {
                if (window.WBEventLog) {
                    WBEventLog.logDebug('Starting sequence', { 
                        component: 'wb-keyboard-manager', 
                        method: 'handleKeyDown', 
                        line: 219, 
                        key: key 
                    });
                } else {
                    console.log('⌨️ Starting sequence with:', key);
                }
                e.preventDefault();
                this.keySequence = [key];
                
                // Clear sequence after timeout
                setTimeout(() => {
                    if (this.keySequence.length > 0) {
                        if (window.WBEventLog) {
                            WBEventLog.logDebug('Sequence timeout, clearing', { 
                                component: 'wb-keyboard-manager', 
                                method: 'sequenceTimeoutHandler', 
                                line: 226, 
                                sequence: this.keySequence 
                            });
                        } else {
                            console.log('⌨️ Sequence timeout, clearing:', this.keySequence);
                        }
                        this.keySequence = [];
                    }
                }, this.sequenceTimeout);
                
                return;
            }
            
            // Build full key combination
            let fullKey = key;
            if (this.keySequence.length > 0) {
                fullKey = [...this.keySequence, key].join('+');
                if (window.WBEventLog) {
                    WBEventLog.logDebug('Built sequence', { 
                        component: 'wb-keyboard-manager', 
                        method: 'handleKeyDown', 
                        line: 238, 
                        fullKey: fullKey 
                    });
                } else {
                    console.log('⌨️ Built sequence:', fullKey);
                }
                this.keySequence = []; // Clear sequence
            }
            
            // Find matching shortcut
            const shortcut = this.findShortcut(fullKey);
            if (window.WBEventLog) {
                WBEventLog.logDebug('Looking for shortcut', { 
                    component: 'wb-keyboard-manager', 
                    method: 'handleKeyDown', 
                    line: 244, 
                    fullKey: fullKey, 
                    found: !!shortcut 
                });
            } else {
                console.log('⌨️ Looking for shortcut:', fullKey, 'Found:', !!shortcut);
            }
            
            if (shortcut && this.isShortcutActive(shortcut)) {
                if (window.WBEventLog) {
                    WBEventLog.logUser('Executing shortcut', { 
                        component: 'wb-keyboard-manager', 
                        method: 'handleKeyDown', 
                        line: 247, 
                        action: shortcut.action, 
                        keys: shortcut.keys 
                    });
                } else {
                    console.log('⌨️ Executing shortcut:', shortcut.action);
                }
                
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
                    if (window.WBEventLog) {
                        WBEventLog.logError('Error executing keyboard shortcut', { 
                            component: 'wb-keyboard-manager', 
                            method: 'handleKeyDown', 
                            line: 285, 
                            error: error.message, 
                            stack: error.stack 
                        });
                    } else {
                        console.error('⌨️ Error executing keyboard shortcut:', error);
                    }
                    
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
                if (window.WBEventLog) {
                    WBEventLog.logWarning('Invalid shortcut registration', { 
                        component: 'wb-keyboard-manager', 
                        method: 'registerShortcut', 
                        line: 444, 
                        shortcut: shortcut 
                    });
                } else {
                    console.warn('⌨️ Invalid shortcut registration:', shortcut);
                }
                return false;
            }
            
            // Normalize keys
            const normalizedKeys = this.normalizeKeys(shortcut.keys);
            
            // Check for conflicts
            if (this.shortcuts.has(normalizedKeys)) {
                const existing = this.shortcuts.get(normalizedKeys);
                
                // Only warn if it's actually a different shortcut
                if (existing.action !== shortcut.action) {
                    if (window.WBEventLog) {
                        WBEventLog.logWarning('Keyboard shortcut conflict detected', { 
                            component: 'wb-keyboard-manager', 
                            method: 'registerShortcut', 
                            line: 457, 
                            keys: normalizedKeys,
                            existing: { action: existing.action, context: existing.context },
                            new: { action: shortcut.action, context: shortcut.context }
                        });
                    } else {
                        console.warn('⌨️ Keyboard shortcut conflict detected:', {
                            keys: normalizedKeys,
                            existing: { action: existing.action, context: existing.context },
                            new: { action: shortcut.action, context: shortcut.context }
                        });
                    }
                    
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
                    if (window.WBEventLog) {
                        WBEventLog.logInfo('Re-registering existing shortcut', { 
                            component: 'wb-keyboard-manager', 
                            method: 'registerShortcut', 
                            line: 474, 
                            keys: normalizedKeys 
                        });
                    } else {
                        console.log('⌨️ Re-registering existing shortcut:', normalizedKeys);
                    }
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
            
            if (window.WBEventLog) {
                WBEventLog.logSuccess('Registered shortcut', { 
                    component: 'wb-keyboard-manager', 
                    method: 'registerShortcut', 
                    line: 490, 
                    shortcut: fullShortcut 
                });
            } else {
                console.log('⌨️ Registered shortcut:', fullShortcut);
            }
            return true;
        }
        
        unregisterShortcut(keys) {
            const normalizedKeys = this.normalizeKeys(keys);
            const removed = this.shortcuts.delete(normalizedKeys);
            
            if (removed) {
                if (window.WBEventLog) {
                    WBEventLog.logInfo('Unregistered shortcut', { 
                        component: 'wb-keyboard-manager', 
                        method: 'unregisterShortcut', 
                        line: 499, 
                        keys: normalizedKeys 
                    });
                } else {
                    console.log('⌨️ Unregistered shortcut:', normalizedKeys);
                }
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
            if (window.WBEventLog) {
                WBEventLog.logSuccess('Keyboard manager enabled', { 
                    component: 'wb-keyboard-manager', 
                    method: 'enable', 
                    line: 524 
                });
            } else {
                console.log('⌨️ Keyboard manager enabled');
            }
        }
        
        disable() {
            this.enabled = false;
            if (window.WBEventLog) {
                WBEventLog.logInfo('Keyboard manager disabled', { 
                    component: 'wb-keyboard-manager', 
                    method: 'disable', 
                    line: 529 
                });
            } else {
                console.log('⌨️ Keyboard manager disabled');
            }
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
        if (window.WBEventLog) {
            WBEventLog.logSuccess('WB Keyboard Manager: Component registered', { 
                component: 'wb-keyboard-manager', 
                method: 'componentRegistration', 
                line: 647 
            });
        } else {
            console.log('⌨️ WB Keyboard Manager: Component registered');
        }
    }
    
    // Register with WBComponentRegistry if available
    if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
        window.WBComponentRegistry.register('wb-keyboard-manager', WBKeyboardManager, ['wb-event-log'], {
            version: '1.0.0',
            type: 'input',
            role: 'infrastructure',
            description: 'Global keyboard shortcut management system for WB components',
            api: {
                static: ['register', 'unregister', 'trigger', 'disable', 'enable'],
                events: ['keydown', 'keyup', 'shortcut-triggered'],
                attributes: ['data-shortcuts', 'data-global', 'data-scope'],
                methods: ['registerShortcut', 'unregisterShortcut', 'getShortcuts', 'formatShortcut']
            },
            priority: 2 // High priority infrastructure component, depends on wb-event-log
        });
    }
    
    // Make class globally available
    window.WBKeyboardManager = WBKeyboardManager;
    
})();