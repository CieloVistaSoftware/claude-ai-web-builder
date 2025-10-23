/**
 * WB Theme Manager Component
 * Manages global theme switching and style application
 * 
 * @version 1.0.0
 * @author Website Builder Components
 */

class WBThemeManager extends HTMLElement {
        constructor() {
            super();
            
            this.themes = ['light', 'dark', 'auto'];
            this.currentTheme = 'dark';
            this.autoThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            this.init();
        }
        
        async init() {
            if (typeof WBEventLog !== 'undefined' && WBEventLog.logInfo) {
                WBEventLog.logInfo('WB Theme Manager: Initializing...', { component: 'wb-theme-manager', method: 'init', line: 24 });
            } else {
                console.log('🎨 WB Theme Manager: Initializing...');
            }
            
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
            
            if (typeof WBEventLog !== 'undefined' && WBEventLog.logSuccess) {
                WBEventLog.logSuccess('WB Theme Manager: Ready', { component: 'wb-theme-manager', method: 'init', line: 41 });
            } else {
                console.log('✅ WB Theme Manager: Ready');
            }
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
                    if (typeof WBEventLog !== 'undefined' && WBEventLog.logSuccess) {
                        WBEventLog.logSuccess('Global theme CSS loaded', { component: 'wb-theme-manager', method: 'loadGlobalTheme', line: 56 });
                    }
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
            // Listen to wb:color-changed events from control panel
            document.addEventListener('wb:color-changed', (event) => {
                const { hue, saturation, lightness, harmonyMode } = event.detail;
                console.log('🎨 WB Theme Manager: Color change received', event.detail);
                
                // Calculate ALL colors from primary using HCS formulas
                this.applyHCSColors(hue, saturation, lightness, harmonyMode);
                
                console.log('✅ All HCS colors calculated and applied');
                
                // Dispatch notification that colors have been applied
                document.dispatchEvent(new CustomEvent('wb:colors-applied', {
                    detail: { hue, saturation, lightness, harmonyMode, source: 'wb-theme-manager' }
                }));
            });
            
            // Listen to wb:theme-changed events from control panel and other components
            document.addEventListener('wb:theme-changed', (event) => {
                const { theme, source } = event.detail;
                if (typeof WBEventLog !== 'undefined' && WBEventLog.logInfo) {
                    WBEventLog.logInfo(`Received theme change request: ${theme}`, {
                        component: 'wb-theme-manager',
                        method: 'setupReactiveListeners',
                        source: source,
                        theme: theme,
                        line: 131
                    });
                } else {
                    console.log(`🎨 Received theme change request: ${theme}`);
                }
                
                // Apply the theme (don't save if it came from external source to avoid loops)
                this.setTheme(theme, true);
            });
            
            // Listen to wb:theme-change-request events (alternative event name)
            document.addEventListener('wb:theme-change-request', (event) => {
                const { theme, source } = event.detail;
                if (typeof WBEventLog !== 'undefined' && WBEventLog.logInfo) {
                    WBEventLog.logInfo(`Received theme change request: ${theme}`, {
                        component: 'wb-theme-manager',
                        method: 'setupReactiveListeners',
                        source: source,
                        theme: theme,
                        line: 144
                    });
                } else {
                    console.log(`🎨 Received theme change request: ${theme}`);
                }
                
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
            
            if (typeof WBEventLog !== 'undefined' && WBEventLog.logInfo) {
                WBEventLog.logInfo(`Theme applied: ${effectiveTheme} (mode: ${theme})`, { component: 'wb-theme-manager', method: 'applyTheme', line: 149, theme: effectiveTheme });
            } else {
                console.log(`✅ Theme applied: ${effectiveTheme} (mode: ${theme})`);
            }
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
        
        applyHCSColors(hue, saturation, lightness, harmonyMode = 'complementary') {
            // Calculate ALL colors from primary using HCS formulas
            const root = document.documentElement;
            
            // PRIMARY COLOR FOUNDATION
            root.style.setProperty('--hue-primary', hue);
            root.style.setProperty('--saturation-primary', saturation);
            root.style.setProperty('--lightness-primary', lightness);
            
            // PRIMARY COLOR
            root.style.setProperty('--primary', `hsl(${hue}, ${saturation}%, ${lightness}%)`);
            root.style.setProperty('--primary-dark', `hsl(${hue}, ${saturation}%, ${Math.max(lightness - 15, 0)}%)`);
            root.style.setProperty('--primary-light', `hsl(${hue}, ${Math.max(saturation - 20, 0)}%, ${Math.min(lightness + 25, 100)}%)`);
            
            // SECONDARY COLOR (Complementary - 180°)
            const secondaryHue = (hue + 180) % 360;
            const secondarySat = Math.max(saturation - 10, 0);
            root.style.setProperty('--secondary', `hsl(${secondaryHue}, ${secondarySat}%, ${lightness}%)`);
            root.style.setProperty('--secondary-dark', `hsl(${secondaryHue}, ${secondarySat}%, ${Math.max(lightness - 10, 0)}%)`);
            root.style.setProperty('--secondary-light', `hsl(${secondaryHue}, ${Math.max(secondarySat - 10, 0)}%, ${Math.min(lightness + 15, 100)}%)`);
            
            // ACCENT COLOR (Analogous - 30°)
            const accentHue = (hue - 30 + 360) % 360;
            const accentSat = Math.max(saturation - 10, 0);
            root.style.setProperty('--accent', `hsl(${accentHue}, ${accentSat}%, ${lightness}%)`);
            root.style.setProperty('--accent-dark', `hsl(${accentHue}, ${accentSat}%, ${Math.max(lightness - 15, 0)}%)`);
            root.style.setProperty('--accent-light', `hsl(${accentHue}, ${Math.max(accentSat - 15, 0)}%, ${Math.min(lightness + 20, 100)}%)`);
            
            // EXTENDED PALETTE
            root.style.setProperty('--highlight', `hsl(${(hue + 45) % 360}, ${saturation}%, ${lightness}%)`);
            root.style.setProperty('--plus30', `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness}%)`);
            root.style.setProperty('--plus45', `hsl(${(hue + 45) % 360}, ${saturation}%, ${lightness}%)`);
            root.style.setProperty('--plus60', `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`);
            root.style.setProperty('--plus90', `hsl(${(hue + 90) % 360}, ${saturation}%, ${lightness}%)`);
            root.style.setProperty('--minus30', `hsl(${(hue - 30 + 360) % 360}, ${saturation}%, ${lightness}%)`);
            root.style.setProperty('--minus45', `hsl(${(hue - 45 + 360) % 360}, ${saturation}%, ${lightness}%)`);
            root.style.setProperty('--minus60', `hsl(${(hue - 60 + 360) % 360}, ${saturation}%, ${lightness}%)`);
            root.style.setProperty('--minus90', `hsl(${(hue - 90 + 360) % 360}, ${saturation}%, ${lightness}%)`);
            
            // NEUTRAL SCALE (with subtle hue tint)
            root.style.setProperty('--neutral-50', `hsl(${hue}, 1%, 99%)`);
            root.style.setProperty('--neutral-100', `hsl(${hue}, 1%, 97%)`);
            root.style.setProperty('--neutral-200', `hsl(${hue}, 2%, 92%)`);
            root.style.setProperty('--neutral-300', `hsl(${hue}, 2%, 85%)`);
            root.style.setProperty('--neutral-400', `hsl(${hue}, 3%, 75%)`);
            root.style.setProperty('--neutral-500', `hsl(${hue}, 4%, 50%)`);
            root.style.setProperty('--neutral-600', `hsl(${hue}, 6%, 35%)`);
            root.style.setProperty('--neutral-700', `hsl(${hue}, 8%, 30%)`);
            root.style.setProperty('--neutral-800', `hsl(${hue}, 10%, 22%)`);
            root.style.setProperty('--neutral-900', `hsl(${hue}, 12%, 12%)`);
            
            console.log('🎨 HCS Colors Applied:', {
                primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                secondary: `hsl(${secondaryHue}, ${secondarySat}%, ${lightness}%)`,
                accent: `hsl(${accentHue}, ${accentSat}%, ${lightness}%)`
            });
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
    
    // REPORT WHERE THIS FILE IS BEING LOADED FROM
    const scriptElements = document.querySelectorAll('script[src*="wb-theme-manager"]');
    if (scriptElements.length > 0) {
        console.log('✅ WB Theme Manager: Component registered');
        console.log('📍 LOADED FROM:', scriptElements[0].src);
    } else {
        console.log('✅ WB Theme Manager: Component registered');
        console.log('📍 LOADED FROM: inline or module import');
    }
    
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
    if (typeof WBEventLog !== 'undefined' && WBEventLog.logInfo) {
                    WBEventLog.logInfo('Creating fallback theme manager to avoid createElement issues', { component: 'wb-theme-manager', line: 307 });
                } else {
                    console.log('🎨 Creating fallback theme manager to avoid createElement issues');
                }
            
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

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBThemeManager = WBThemeManager;

// ES6 Module Exports
export { WBThemeManager };
export default WBThemeManager;