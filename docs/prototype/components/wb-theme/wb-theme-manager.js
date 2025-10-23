/**
 * WB Theme Manager Component
 * Manages global theme switching and style application
 * 
 * @version 1.0.0
 * @author Website Builder Components
 */

(function() {
    'use strict';

    class WBThemeManager extends HTMLElement {
        constructor() {
            super();
            
            this.themes = ['light', 'dark', 'auto'];
            this.currentTheme = 'dark';
            this.autoThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            this.init();
        }
        
        async init() {
            WBEventLog.logInfo('WB Theme Manager: Initializing...', { component: 'wb-theme-manager', method: 'init', line: 24 });
            
            // Load global theme CSS first
            this.loadGlobalTheme();
            
            // Load saved theme preference
            this.loadThemePreference();
            
            // Setup component
            this.setupComponent();
            
            // Setup auto theme detection
            this.setupAutoTheme();
            
            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Setup reactive event listeners
            this.setupReactiveListeners();
            
            WBEventLog.logSuccess('WB Theme Manager: Ready', { component: 'wb-theme-manager', method: 'init', line: 41 });
        }
        
        loadGlobalTheme() {
            if (window.WBComponentUtils) {
                const cssPath = window.WBComponentUtils.getPath('wb-theme-manager.js', '../components/wb-theme/') + 'wb-theme.css';
                window.WBComponentUtils.loadCSS('wb-theme', cssPath);
            } else {
                // Check if global theme CSS is already loaded
                const existingLink = document.querySelector('link[href*="wb-theme.css"]');
                if (!existingLink) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = cssPath;
                    document.head.appendChild(link);
                    WBEventLog.logSuccess('Global theme CSS loaded', { component: 'wb-theme-manager', method: 'loadGlobalTheme', line: 56 });
                }
            }
        }
        
        getComponentPath() {
            if (typeof WBComponentUtils !== 'undefined' && WBComponentUtils.getComponentPath) {
                return WBComponentUtils.getComponentPath('wb-theme');
            }
            
            // Fallback path detection
            const scripts = document.querySelectorAll('script[src*="wb-theme-manager"]');
            if (scripts.length > 0) {
                const scriptSrc = scripts[0].src;
                return scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));
            }
            
            return './components/wb-theme';
        }
        
        loadThemePreference() {
            // Check localStorage for saved theme
            const savedTheme = localStorage.getItem('wb-theme');
            if (savedTheme && this.themes.includes(savedTheme)) {
                this.currentTheme = savedTheme;
            } else {
                // Check if user prefers dark mode
                this.currentTheme = this.autoThemeMediaQuery.matches ? 'dark' : 'light';
            }
            
            // Apply theme
            this.applyTheme(this.currentTheme);
        }
        
        setupComponent() {
            this.className = 'wb-theme-manager';
            this.setAttribute('hidden', ''); // Hidden by default
            
            // Add theme toggle button if specified
            if (this.hasAttribute('show-toggle')) {
                this.renderToggleButton();
            }
        }
        
        setupAutoTheme() {
            // Listen for system theme changes
            this.autoThemeMediaQuery.addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme(e.matches ? 'dark' : 'light', false);
                }
            });
        }
        
        setupKeyboardShortcuts() {
            // Register theme toggle shortcut with keyboard manager if available
            setTimeout(() => {
                const keyboardManager = document.querySelector('wb-keyboard-manager');
                if (keyboardManager && keyboardManager.registerShortcut) {
                    keyboardManager.registerShortcut({
                        keys: 'ctrl+shift+t',
                        action: 'toggleTheme',
                        description: 'Toggle Dark/Light Theme',
                        context: 'global',
                        handler: () => this.toggleTheme()
                    });
                }
            }, 100);
        }
        
        setupReactiveListeners() {
            // Listen to wb:theme-changed events from control panel and other components
            document.addEventListener('wb:theme-changed', (event) => {
                const { theme, source } = event.detail;
                WBEventLog.logInfo(`Received theme change request: ${theme}`, {
                    component: 'wb-theme-manager',
                    method: 'setupReactiveListeners',
                    source: source,
                    theme: theme,
                    line: 131
                });
                
                // Apply the theme (don't save if it came from external source to avoid loops)
                this.setTheme(theme, true);
            });
            
            // Listen to wb:theme-change-request events (alternative event name)
            document.addEventListener('wb:theme-change-request', (event) => {
                const { theme, source } = event.detail;
                WBEventLog.logInfo(`Received theme change request: ${theme}`, {
                    component: 'wb-theme-manager',
                    method: 'setupReactiveListeners',
                    source: source,
                    theme: theme,
                    line: 144
                });
                
                // Apply the theme
                this.setTheme(theme, true);
            });
        }
        
        applyTheme(theme, save = true) {
            let effectiveTheme = theme;
            
            // Handle auto theme
            if (theme === 'auto') {
                effectiveTheme = this.autoThemeMediaQuery.matches ? 'dark' : 'light';
            }
            
            // Apply to document
            document.documentElement.setAttribute('data-theme', effectiveTheme);
            document.body.setAttribute('data-theme', effectiveTheme);
            
            // Update meta theme color
            this.updateMetaThemeColor(effectiveTheme);
            
            // Save preference
            if (save) {
                this.currentTheme = theme;
                localStorage.setItem('wb-theme', theme);
            }
            
            // Dispatch theme change event
            this.dispatchThemeChangeEvent(effectiveTheme, theme);
            
            WBEventLog.logInfo(`Theme applied: ${effectiveTheme} (mode: ${theme})`, { component: 'wb-theme-manager', method: 'applyTheme', line: 149, theme: effectiveTheme });
        }
        
        updateMetaThemeColor(theme) {
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            
            // Set theme color based on current theme
            metaThemeColor.content = theme === 'dark' ? '#0f172a' : '#ffffff';
        }
        
        dispatchThemeChangeEvent(effectiveTheme, themeMode) {
            document.dispatchEvent(new CustomEvent('wb:theme-changed', {
                detail: {
                    theme: effectiveTheme,
                    mode: themeMode,
                    isDark: effectiveTheme === 'dark'
                },
                bubbles: true
            }));
            
            // Log to event system
            document.dispatchEvent(new CustomEvent('wb:info', {
                detail: {
                    message: `Theme changed to ${effectiveTheme}`,
                    source: 'wb-theme-manager'
                }
            }));
        }
        
        toggleTheme() {
            // Simple toggle between light and dark (skip auto for toggle)
            const newTheme = this.currentTheme === 'dark' ? 'light' : 
                           this.currentTheme === 'light' ? 'dark' :
                           // If auto, toggle based on current effective theme
                           (document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
            
            this.setTheme(newTheme);
        }
        
        cycleTheme() {
            // Cycle through all themes including auto
            const currentIndex = this.themes.indexOf(this.currentTheme);
            const nextIndex = (currentIndex + 1) % this.themes.length;
            this.setTheme(this.themes[nextIndex]);
        }
        
        setTheme(theme) {
            if (this.themes.includes(theme)) {
                this.applyTheme(theme);
                
                // Update toggle button if exists
                const button = this.querySelector('.wb-theme-toggle');
                if (button) {
                    this.updateToggleButton(button, theme);
                }
            }
        }
        
        getTheme() {
            return this.currentTheme;
        }
        
        getEffectiveTheme() {
            return document.documentElement.getAttribute('data-theme');
        }
        
        isDarkMode() {
            return this.getEffectiveTheme() === 'dark';
        }
        
        renderToggleButton() {
            const button = document.createElement('button');
            button.className = 'wb-theme-toggle';
            button.setAttribute('aria-label', 'Toggle theme');
            button.title = 'Toggle theme (Ctrl+Shift+T)';
            
            this.updateToggleButton(button, this.currentTheme);
            
            button.addEventListener('click', () => {
                this.cycleTheme();
            });
            
            this.appendChild(button);
            this.removeAttribute('hidden');
        }
        
        updateToggleButton(button, theme) {
            const icons = {
                light: '☀️',
                dark: '🌙',
                auto: '🔄'
            };
            
            const labels = {
                light: 'Light theme',
                dark: 'Dark theme',
                auto: 'Auto theme'
            };
            
            button.innerHTML = `<span class="wb-theme-icon">${icons[theme]}</span>`;
            button.setAttribute('aria-label', labels[theme]);
            button.title = `${labels[theme]} (Ctrl+Shift+T)`;
        }
        
        // Custom element lifecycle
        connectedCallback() {
            // Re-apply theme when element is connected
            if (this.currentTheme) {
                this.applyTheme(this.currentTheme, false);
            }
        }
        
        static get observedAttributes() {
            return ['theme', 'show-toggle'];
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'theme' && newValue && this.themes.includes(newValue)) {
                this.setTheme(newValue);
            } else if (name === 'show-toggle' && newValue !== null) {
                if (!this.querySelector('.wb-theme-toggle')) {
                    this.renderToggleButton();
                }
            }
        }
    }
    
    // Register component
    customElements.define('wb-theme-manager', WBThemeManager);
    WBEventLog.logSuccess('WB Theme Manager: Component registered', { component: 'wb-theme-manager', line: 284 });
    
    // Also create fallback if component doesn't render    // Register with WBComponentRegistry if available
    if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
        window.WBComponentRegistry.register('wb-theme-manager', WBThemeManager, ['wb-event-log'], {
            version: '1.0.0',
            type: 'theming',
            role: 'infrastructure',
            description: 'Global theme management system with CSS custom properties and presets',
            api: {
                static: ['setTheme', 'getTheme', 'registerTheme'],
                events: ['theme-changed', 'theme-loaded'],
                attributes: ['theme', 'auto-detect', 'storage-key'],
                methods: ['applyTheme', 'getAvailableThemes', 'createCustomTheme']
            },
            priority: 2 // Theme infrastructure component
        });
    }
    
    // Auto-initialize if added to document
    const autoInit = () => {
        if (!document.querySelector('wb-theme-manager') && !document.querySelector('#wb-theme-manager-fallback')) {
            WBEventLog.logInfo('Creating fallback theme manager to avoid createElement issues', { component: 'wb-theme-manager', line: 307 });
            
            // Create minimal theme manager
            // Skip createElement entirely and use fallback approach
            createFallbackThemeManager();
        }
    };
    
    // Fallback theme manager creation
    const createFallbackThemeManager = () => {
        const themeManager = document.createElement('div');
        themeManager.id = 'wb-theme-manager-fallback';
        themeManager.style.display = 'none'; // Hidden utility
        
        // Add complete theme switching functionality
        themeManager.setTheme = (theme) => {
            document.body.setAttribute('data-theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('wb-theme', theme);
            
            // Dispatch theme change event
            document.dispatchEvent(new CustomEvent('wb:theme-changed', {
                detail: { theme, source: 'wb-theme-manager-fallback' }
            }));
            
            console.log(`🎨 Theme changed to: ${theme}`);
        };
        
        // Add theme detection
        themeManager.getTheme = () => {
            return localStorage.getItem('wb-theme') || 
                   document.body.getAttribute('data-theme') || 
                   'dark';
        };
        
        // Add theme initialization
        themeManager.initTheme = () => {
            const savedTheme = themeManager.getTheme();
            themeManager.setTheme(savedTheme);
        };
        
        // Initialize with saved theme
        themeManager.initTheme();
        
        document.body.appendChild(themeManager);
        
        // Make it globally accessible
        window.WBThemeManager = themeManager;
        window.themeManager = themeManager; // Alternative access
        
        console.log('🎨 WB Theme Manager: Fallback created with full functionality');
    };
    
    // Use WBComponentUtils if available, otherwise fallback
    if (window.WBComponentUtils && window.WBComponentUtils.onReady) {
        window.WBComponentUtils.onReady(autoInit);
    } else {
        // Fallback DOM ready check
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoInit);
        } else {
            autoInit();
        }
    }
    
    // Make class globally available
    window.WBThemeManager = WBThemeManager;
    
})();