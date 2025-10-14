/**
 * WB Color Mapper Component
 * Web Component that maps existing color variables to match WB theme system
 */
class WBColorMapper extends HTMLElement {
    constructor() {
        super();
        this.originalValues = {};
        this.initialized = false;
        this.observer = null;
        
        // Bind methods
        this.handleThemeChange = this.handleThemeChange.bind(this);
    }
    
    static get observedAttributes() {
        return ['theme', 'auto-init'];
    }
    
    connectedCallback() {
        if (!this.initialized) {
            this.init();
        }
    }
    
    disconnectedCallback() {
        this.cleanup();
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.initialized) return;
        
        switch (name) {
            case 'theme':
                if (newValue && newValue !== oldValue) {
                    this.mapThemeColors(newValue);
                }
                break;
            case 'auto-init':
                if (newValue === 'false') {
                    this.cleanup();
                } else if (oldValue === 'false' && newValue !== 'false') {
                    this.init();
                }
                break;
        }
    }
    
    init() {
        console.log('🎨 WB Color Mapper: Initializing...');
        
        // Hide the component - it's just a controller
        this.style.display = 'none';
        
        // Initial theme mapping
        const currentTheme = this.getAttribute('theme') || 
                           document.documentElement.getAttribute('data-theme') || 
                           'light';
        this.mapThemeColors(currentTheme);
        
        // Setup theme change observers
        this.observeThemeChanges();
        
        this.initialized = true;
        
        // Dispatch ready event
        this.dispatchEvent(new CustomEvent('wb-color-mapper-ready', {
            bubbles: true,
            detail: { component: this }
        }));
        
        console.log('🎨 WB Color Mapper: Ready!');
    }
    
    cleanup() {
        // Remove observer
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        // Remove event listeners
        document.removeEventListener('wb-theme-changed', this.handleThemeChange);
        document.removeEventListener('wb:theme-changed', this.handleThemeChange);
        
        // Remove styles
        const style = document.getElementById('wb-color-mapper');
        if (style) {
            style.remove();
        }
    }
    
    storeOriginalValues() {
        const computedStyle = getComputedStyle(document.documentElement);
        const variablesToStore = [
            '--page-bg', '--content-bg', '--body-bg', '--text-color',
            '--link-color', '--border-color', '--accent-color',
            '--e-global-color-primary', '--e-global-color-secondary',
            '--e-global-color-text', '--e-global-color-accent',
            '--e-global-color-6216c8c', '--e-global-color-9e89a0d',
            '--e-global-color-d9d0ad5', '--e-global-color-5354007',
            '--e-global-color-8b76756', '--e-global-color-f56f1d5',
            'color', 'background-color', 'border-color'
        ];
        
        variablesToStore.forEach(varName => {
            if (varName.startsWith('--')) {
                this.originalValues[varName] = computedStyle.getPropertyValue(varName);
            } else {
                this.originalValues[varName] = computedStyle[varName];
            }
        });
        
        // Dispatch event
        this.dispatchEvent(new CustomEvent('wb-color-mapper-stored', {
            bubbles: true,
            detail: { 
                valuesCount: Object.keys(this.originalValues).length,
                originalValues: this.originalValues 
            }
        }));
    }
    
    mapThemeColors(theme) {
        if (!theme) return;
        
        // Store original values on first run
        if (!this.initialized) {
            this.storeOriginalValues();
        }
        
        // Get theme mappings
        const mappings = this.getThemeMappings();
        
        if (!mappings[theme]) {
            console.error(`Theme not found in mappings: ${theme}`);
            return;
        }
        
        // Create and apply styles
        this.applyThemeStyles(theme, mappings[theme]);
        
        // Apply direct CSS variables for legacy support
        this.applyDirectCSSVariables(theme, mappings[theme]);
        
        // Dispatch event
        this.dispatchEvent(new CustomEvent('wb-color-mapper-applied', {
            bubbles: true,
            detail: { theme }
        }));
    }
    
    getThemeMappings() {
        return {
            light: {
                // Main backgrounds
                '--page-bg': 'var(--bg-primary, #f8fafc)',
                '--content-bg': 'var(--bg-primary, #f8fafc)',
                '--body-bg': 'var(--bg-primary, #f8fafc)',
                '--section-bg': 'var(--bg-secondary, #ffffff)',
                '--card-bg': 'var(--bg-secondary, #ffffff)',
                '--container-bg': 'var(--bg-secondary, #ffffff)',
                '--surface': 'var(--bg-secondary, #ffffff)',
                'background-color': 'var(--bg-primary, #f8fafc)',
                // Text colors
                '--text-color': 'var(--text-primary, #1e293b)',
                '--heading-color': 'var(--text-primary, #0f172a)',
                '--text': 'var(--text-primary, #1e293b)',
                '--text-light': 'var(--text-secondary, #475569)',
                '--text-muted': 'var(--text-secondary, #475569)',
                '--subtitle-color': 'var(--text-secondary, #475569)',
                'color': 'var(--text-primary, #1e293b)',
                // UI element colors
                '--link-color': 'var(--primary, #6366f1)',
                '--link-hover': 'var(--primary-dark, #4338ca)',
                '--button-color': 'var(--primary, #6366f1)',
                '--button-hover': 'var(--primary-dark, #4338ca)',
                '--primary-color': 'var(--primary, #6366f1)',
                '--secondary-color': 'var(--secondary, #64748b)',
                '--accent-color': 'var(--accent, #10b981)',
                // Elementor specific variables
                '--e-global-color-primary': 'var(--primary, #6366f1)',
                '--e-global-color-secondary': 'var(--secondary, #64748b)',
                '--e-global-color-text': 'var(--text-primary, #1e293b)',
                '--e-global-color-accent': 'var(--accent, #10b981)',
                '--e-global-color-aed9d57': 'var(--neutral-300, #cbd5e1)',
                '--e-global-color-d38321b': 'var(--neutral-400, #94a3b8)',
                '--e-global-color-d34c2b5': 'var(--primary-light, #a5b4fc)',
                '--e-global-color-6216c8c': 'var(--primary, #6366f1)',
                '--e-global-color-9e89a0d': 'var(--neutral-800, #1e293b)',
                '--e-global-color-d9d0ad5': 'var(--neutral-700, #334155)',
                '--e-global-color-5354007': 'var(--neutral-500, #64748b)',
                '--e-global-color-8b76756': 'var(--neutral-900, #0f172a)',
                '--e-global-color-f56f1d5': 'var(--neutral-300, #cbd5e1)',
                // Borders and dividers
                '--border-color': 'var(--neutral-200, #e2e8f0)',
                '--divider-color': 'var(--neutral-200, #e2e8f0)',
                '--border': 'var(--neutral-200, #e2e8f0)',
                // Shadows
                '--shadow-color': 'rgba(0, 0, 0, 0.05)',
                '--shadow': '0 4px 6px var(--shadow-color, rgba(0, 0, 0, 0.05))'
            },
            dark: {
                // Main backgrounds
                '--page-bg': 'var(--bg-primary, #0f172a)',
                '--content-bg': 'var(--bg-primary, #0f172a)',
                '--body-bg': 'var(--bg-primary, #0f172a)',
                '--section-bg': 'var(--bg-secondary, #1e293b)',
                '--card-bg': 'var(--bg-secondary, #1e293b)',
                '--container-bg': 'var(--bg-secondary, #1e293b)',
                '--surface': 'var(--bg-secondary, #1e293b)',
                'background-color': 'var(--bg-primary, #0f172a)',
                // Text colors
                '--text-color': 'var(--text-primary, #f1f5f9)',
                '--heading-color': 'var(--text-primary, #f8fafc)',
                '--text': 'var(--text-primary, #f1f5f9)',
                '--text-light': 'var(--text-secondary, #cbd5e1)',
                '--text-muted': 'var(--text-secondary, #94a3b8)',
                '--subtitle-color': 'var(--text-secondary, #94a3b8)',
                'color': 'var(--text-primary, #f1f5f9)',
                // UI element colors
                '--link-color': 'var(--primary-light, #a5b4fc)',
                '--link-hover': 'var(--primary, #6366f1)',
                '--button-color': 'var(--primary-light, #a5b4fc)',
                '--button-hover': 'var(--primary, #6366f1)',
                '--primary-color': 'var(--primary, #6366f1)',
                '--secondary-color': 'var(--secondary, #64748b)',
                '--accent-color': 'var(--accent, #10b981)',
                // Elementor specific variables
                '--e-global-color-primary': 'var(--primary-light, #a5b4fc)',
                '--e-global-color-secondary': 'var(--neutral-400, #94a3b8)',
                '--e-global-color-text': 'var(--text-primary, #f1f5f9)',
                '--e-global-color-accent': 'var(--accent, #10b981)',
                '--e-global-color-aed9d57': 'var(--neutral-600, #475569)',
                '--e-global-color-d38321b': 'var(--neutral-500, #64748b)',
                '--e-global-color-d34c2b5': 'var(--primary, #6366f1)',
                '--e-global-color-6216c8c': 'var(--primary-light, #a5b4fc)',
                '--e-global-color-9e89a0d': 'var(--neutral-300, #cbd5e1)',
                '--e-global-color-d9d0ad5': 'var(--neutral-400, #94a3b8)',
                '--e-global-color-5354007': 'var(--neutral-300, #cbd5e1)',
                '--e-global-color-8b76756': 'var(--neutral-50, #f8fafc)',
                '--e-global-color-f56f1d5': 'var(--neutral-600, #475569)',
                // Borders and dividers
                '--border-color': 'var(--neutral-700, #334155)',
                '--divider-color': 'var(--neutral-700, #334155)',
                '--border': 'var(--neutral-700, #334155)',
                // Shadows
                '--shadow-color': 'rgba(0, 0, 0, 0.3)',
                '--shadow': '0 4px 6px var(--shadow-color, rgba(0, 0, 0, 0.3))'
            },
            cyberpunk: {
                // Main backgrounds
                '--page-bg': 'var(--bg-primary, #0a0a0a)',
                '--content-bg': 'var(--bg-primary, #0a0a0a)',
                '--body-bg': 'var(--bg-primary, #0a0a0a)',
                '--section-bg': 'var(--bg-secondary, #1a1a2e)',
                '--card-bg': 'var(--bg-secondary, #1a1a2e)',
                '--container-bg': 'var(--bg-secondary, #1a1a2e)',
                '--surface': 'var(--bg-secondary, #1a1a2e)',
                'background-color': 'var(--bg-primary, #0a0a0a)',
                // Text colors
                '--text-color': 'var(--text-primary, #00ffff)',
                '--heading-color': 'var(--primary, #ff00ff)',
                '--text': 'var(--text-primary, #00ffff)',
                '--text-light': '#80ffff',
                '--text-muted': '#80ffff',
                '--subtitle-color': '#ee00ff',
                'color': 'var(--text-primary, #00ffff)',
                // UI element colors
                '--link-color': 'var(--primary, #00ffff)',
                '--link-hover': '#80ffff',
                '--button-color': 'var(--accent, #ff0080)',
                '--button-hover': '#ff80bf',
                '--primary-color': 'var(--primary, #00ffff)',
                '--secondary-color': '#ff00ff',
                '--accent-color': 'var(--accent, #ff0080)',
                // Elementor specific variables
                '--e-global-color-primary': '#00ffff',
                '--e-global-color-secondary': '#ff00ff',
                '--e-global-color-text': '#00ffff',
                '--e-global-color-accent': '#ff0080',
                '--e-global-color-aed9d57': '#6600cc',
                '--e-global-color-d38321b': '#9900ff',
                '--e-global-color-d34c2b5': '#00ccff',
                '--e-global-color-6216c8c': '#00ffff',
                '--e-global-color-9e89a0d': '#ff00ff',
                '--e-global-color-d9d0ad5': '#cc00cc',
                '--e-global-color-5354007': '#80ffff',
                '--e-global-color-8b76756': '#ff00ff',
                '--e-global-color-f56f1d5': '#6600cc',
                // Borders and dividers
                '--border-color': 'var(--border-color, #00ffff)',
                '--divider-color': 'var(--border-color, #00ffff)',
                '--border': 'var(--border-color, #00ffff)',
                // Shadows
                '--shadow-color': 'rgba(0, 255, 255, 0.3)',
                '--shadow': '0 0 10px var(--shadow-color, rgba(0, 255, 255, 0.3))'
            },
            ocean: {
                // Main backgrounds
                '--page-bg': '#e3f2fd',
                '--content-bg': '#e3f2fd',
                '--body-bg': '#e3f2fd',
                '--section-bg': '#cce6ff',
                '--card-bg': '#cce6ff',
                '--container-bg': '#cce6ff',
                '--surface': '#ffffff',
                'background-color': '#e3f2fd',
                // Text colors
                '--text-color': '#0d47a1',
                '--heading-color': '#01579b',
                '--text': '#0d47a1',
                '--text-light': '#1565c0',
                '--text-muted': '#1976d2',
                '--subtitle-color': '#1976d2',
                'color': '#0d47a1',
                // UI element colors
                '--link-color': 'var(--primary, #0ea5e9)',
                '--link-hover': '#0284c7',
                '--button-color': 'var(--primary, #0ea5e9)',
                '--button-hover': '#0284c7',
                '--primary-color': 'var(--primary, #0ea5e9)',
                '--secondary-color': '#7dd3fc',
                '--accent-color': 'var(--accent, #06b6d4)',
                // Elementor specific variables
                '--e-global-color-primary': '#0ea5e9',
                '--e-global-color-secondary': '#7dd3fc',
                '--e-global-color-text': '#0d47a1',
                '--e-global-color-accent': '#06b6d4',
                '--e-global-color-aed9d57': '#bae6fd',
                '--e-global-color-d38321b': '#38bdf8',
                '--e-global-color-d34c2b5': '#0284c7',
                '--e-global-color-6216c8c': '#0ea5e9',
                '--e-global-color-9e89a0d': '#01579b',
                '--e-global-color-d9d0ad5': '#0369a1',
                '--e-global-color-5354007': '#0ea5e9',
                '--e-global-color-8b76756': '#0c4a6e',
                '--e-global-color-f56f1d5': '#bae6fd',
                // Borders and dividers
                '--border-color': '#b3e5fc',
                '--divider-color': '#b3e5fc',
                '--border': '#b3e5fc',
                // Shadows
                '--shadow-color': 'rgba(14, 165, 233, 0.15)',
                '--shadow': '0 4px 6px var(--shadow-color, rgba(14, 165, 233, 0.15))'
            },
            sunset: {
                // Main backgrounds
                '--page-bg': '#fff7ed',
                '--content-bg': '#fff7ed',
                '--body-bg': '#fff7ed',
                '--section-bg': '#ffedd5',
                '--card-bg': '#ffedd5',
                '--container-bg': '#ffedd5',
                '--surface': '#ffffff',
                'background-color': '#fff7ed',
                // Text colors
                '--text-color': '#431407',
                '--heading-color': '#7c2d12',
                '--text': '#431407',
                '--text-light': '#7c2d12',
                '--text-muted': '#9a3412',
                '--subtitle-color': '#9a3412',
                'color': '#431407',
                // UI element colors
                '--link-color': 'var(--primary, #f97316)',
                '--link-hover': '#ea580c',
                '--button-color': 'var(--primary, #f97316)',
                '--button-hover': '#ea580c',
                '--primary-color': 'var(--primary, #f97316)',
                '--secondary-color': '#fdba74',
                '--accent-color': 'var(--accent-alt, #fbbf24)',
                // Elementor specific variables
                '--e-global-color-primary': '#f97316',
                '--e-global-color-secondary': '#fdba74',
                '--e-global-color-text': '#431407',
                '--e-global-color-accent': '#fbbf24',
                '--e-global-color-aed9d57': '#fed7aa',
                '--e-global-color-d38321b': '#fb923c',
                '--e-global-color-d34c2b5': '#ea580c',
                '--e-global-color-6216c8c': '#f97316',
                '--e-global-color-9e89a0d': '#7c2d12',
                '--e-global-color-d9d0ad5': '#9a3412',
                '--e-global-color-5354007': '#fdba74',
                '--e-global-color-8b76756': '#431407',
                '--e-global-color-f56f1d5': '#fed7aa',
                // Borders and dividers
                '--border-color': '#fed7aa',
                '--divider-color': '#fed7aa',
                '--border': '#fed7aa',
                // Shadows
                '--shadow-color': 'rgba(249, 115, 22, 0.15)',
                '--shadow': '0 4px 6px var(--shadow-color, rgba(249, 115, 22, 0.15))'
            },
            forest: {
                // Main backgrounds
                '--page-bg': '#f0fdf4',
                '--content-bg': '#f0fdf4',
                '--body-bg': '#f0fdf4',
                '--section-bg': '#dcfce7',
                '--card-bg': '#dcfce7',
                '--container-bg': '#dcfce7',
                '--surface': '#ffffff',
                'background-color': '#f0fdf4',
                // Text colors
                '--text-color': '#14532d',
                '--heading-color': '#166534',
                '--text': '#14532d',
                '--text-light': '#166534',
                '--text-muted': '#15803d',
                '--subtitle-color': '#15803d',
                'color': '#14532d',
                // UI element colors
                '--link-color': 'var(--primary, #059669)',
                '--link-hover': '#047857',
                '--button-color': 'var(--primary, #059669)',
                '--button-hover': '#047857',
                '--primary-color': 'var(--primary, #059669)',
                '--secondary-color': '#6ee7b7',
                '--accent-color': 'var(--accent, #84cc16)',
                // Elementor specific variables
                '--e-global-color-primary': '#059669',
                '--e-global-color-secondary': '#6ee7b7',
                '--e-global-color-text': '#14532d',
                '--e-global-color-accent': '#84cc16',
                '--e-global-color-aed9d57': '#bbf7d0',
                '--e-global-color-d38321b': '#34d399',
                '--e-global-color-d34c2b5': '#047857',
                '--e-global-color-6216c8c': '#059669',
                '--e-global-color-9e89a0d': '#166534',
                '--e-global-color-d9d0ad5': '#15803d',
                '--e-global-color-5354007': '#4ade80',
                '--e-global-color-8b76756': '#14532d',
                '--e-global-color-f56f1d5': '#bbf7d0',
                // Borders and dividers
                '--border-color': '#bbf7d0',
                '--divider-color': '#bbf7d0',
                '--border': '#bbf7d0',
                // Shadows
                '--shadow-color': 'rgba(5, 150, 105, 0.15)',
                '--shadow': '0 4px 6px var(--shadow-color, rgba(5, 150, 105, 0.15))'
            }
        };
    }
    
    applyThemeStyles(theme, themeVars) {
        const style = document.createElement('style');
        style.id = 'wb-color-mapper';
        
        // Build CSS text
        let cssText = `:root[data-theme="${theme}"],\n`;
        cssText += `body[data-theme="${theme}"],\n`;
        cssText += `html[data-theme="${theme}"] {\n`;
        
        for (const [siteVar, ourVar] of Object.entries(themeVars)) {
            if (typeof ourVar === 'string' && siteVar.startsWith('--')) {
                cssText += `  ${siteVar}: ${ourVar};\n`;
            }
        }
        cssText += `}\n`;
        
        // Add specific selectors
        cssText += `html[data-theme="${theme}"], body[data-theme="${theme}"] {\n`;
        if (themeVars['color']) {
            cssText += `  color: ${themeVars['color']};\n`;
        }
        if (themeVars['background-color']) {
            cssText += `  background-color: ${themeVars['background-color']};\n`;
        }
        cssText += `}\n`;
        
        // Text elements
        cssText += `body[data-theme="${theme}"] p,\n`;
        cssText += `body[data-theme="${theme}"] li,\n`;
        cssText += `body[data-theme="${theme}"] span:not([class*="elementor"]),\n`;
        cssText += `body[data-theme="${theme}"] div:not([class*="elementor"]) {\n`;
        cssText += `  color: var(--text-color, ${themeVars['--text-color']});\n`;
        cssText += `}\n`;
        
        // Heading elements
        cssText += `body[data-theme="${theme}"] h1, body[data-theme="${theme}"] h2, `;
        cssText += `body[data-theme="${theme}"] h3, body[data-theme="${theme}"] h4, `;
        cssText += `body[data-theme="${theme}"] h5, body[data-theme="${theme}"] h6 {\n`;
        cssText += `  color: var(--heading-color, ${themeVars['--heading-color']});\n`;
        cssText += `}\n`;
        
        // Link elements
        cssText += `body[data-theme="${theme}"] a:not([class*="elementor"]) {\n`;
        cssText += `  color: var(--link-color, ${themeVars['--link-color']});\n`;
        cssText += `}\n`;
        
        // Handle Elementor if present
        if (document.querySelector('.elementor') || document.querySelector('[class*="elementor"]')) {
            cssText += `.elementor[data-theme="${theme}"], .elementor-kit-5[data-theme="${theme}"] {\n`;
            for (const [siteVar, ourVar] of Object.entries(themeVars)) {
                if (siteVar.startsWith('--e-global-color')) {
                    cssText += `  ${siteVar}: ${ourVar};\n`;
                }
            }
            cssText += `}\n`;
            
            cssText += `.elementor[data-theme="${theme}"] .elementor-text-editor,\n`;
            cssText += `.elementor[data-theme="${theme}"] .elementor-widget-text-editor,\n`;
            cssText += `.elementor[data-theme="${theme}"] p {\n`;
            cssText += `  color: var(--text-color, ${themeVars['--text-color']});\n`;
            cssText += `}\n`;
            
            cssText += `.elementor[data-theme="${theme}"] .elementor-heading-title,\n`;
            cssText += `.elementor[data-theme="${theme}"] h1.elementor-heading-title,\n`;
            cssText += `.elementor[data-theme="${theme}"] h2.elementor-heading-title,\n`;
            cssText += `.elementor[data-theme="${theme}"] h3.elementor-heading-title {\n`;
            cssText += `  color: var(--heading-color, ${themeVars['--heading-color']});\n`;
            cssText += `}\n`;
        }
        
        style.textContent = cssText;
        
        // Remove existing style and add new one
        const existingStyle = document.getElementById('wb-color-mapper');
        if (existingStyle) {
            existingStyle.remove();
        }
        document.head.appendChild(style);
    }
    
    applyDirectCSSVariables(theme, themeVars) {
        if (!themeVars) return;
        
        // Apply to both documentElement and body
        [document.documentElement, document.body].forEach(element => {
            for (const [siteVar, ourVar] of Object.entries(themeVars)) {
                // If the value is a var() reference, try to resolve it
                if (typeof ourVar === 'string' && ourVar.startsWith('var(')) {
                    const varName = ourVar.match(/var\((.*?)(,|\))/)?.[1]?.trim();
                    if (varName) {
                        const computedValue = getComputedStyle(document.documentElement)
                            .getPropertyValue(varName).trim();
                        if (computedValue) {
                            element.style.setProperty(siteVar, computedValue);
                            continue;
                        }
                    }
                }
                // Use the raw value
                element.style.setProperty(siteVar, ourVar);
            }
            
            // For non-CSS variable styles
            if (themeVars['color']) {
                element.style.color = themeVars['color'];
            }
            if (themeVars['background-color']) {
                element.style.backgroundColor = themeVars['background-color'];
            }
        });
        
        // Handle Elementor elements if present
        if (document.querySelector('.elementor') || document.querySelector('[class*="elementor"]')) {
            const elementorSelectors = [
                '.elementor',
                '.elementor-kit-5',
                '.elementor-element',
                '.elementor-widget',
                '.elementor-section',
                '.elementor-column',
                '.elementor-text-editor',
                '.elementor-heading-title'
            ];
            
            elementorSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    // Apply Elementor-specific variables
                    for (const [siteVar, ourVar] of Object.entries(themeVars)) {
                        if (siteVar.startsWith('--e-global-color')) {
                            element.style.setProperty(siteVar, ourVar);
                        }
                    }
                    
                    // Force additional properties for specific elements
                    if (selector === '.elementor-text-editor' || selector === '.elementor-heading-title') {
                        if (themeVars['color']) {
                            element.style.color = themeVars['color'];
                        }
                    }
                    if (selector === '.elementor-section') {
                        if (themeVars['background-color']) {
                            const currentBg = getComputedStyle(element).backgroundColor;
                            if (currentBg === 'rgba(0, 0, 0, 0)' || currentBg === 'transparent') {
                                element.style.backgroundColor = themeVars['background-color'];
                            }
                        }
                    }
                });
            });
        }
    }
    
    observeThemeChanges() {
        // Set up mutation observer
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'data-theme') {
                    const newTheme = mutation.target.getAttribute('data-theme');
                    if (newTheme) {
                        this.mapThemeColors(newTheme);
                    }
                }
            });
        });
        
        // Observe both html and body
        this.observer.observe(document.documentElement, { attributes: true });
        this.observer.observe(document.body, { attributes: true });
        
        // Listen for theme change events
        document.addEventListener('wb-theme-changed', this.handleThemeChange);
        document.addEventListener('wb:theme-changed', this.handleThemeChange);
    }
    
    handleThemeChange(event) {
        const theme = event.detail?.theme;
        if (theme) {
            this.mapThemeColors(theme);
        }
    }
    
    // Public API methods
    debugColorVariables() {
        const styles = getComputedStyle(document.documentElement);
        const allProps = [];
        const colorKeywords = ['color', 'bg', 'background', 'border', 'shadow', 
                             'accent', 'primary', 'secondary', 'link', 'text', 
                             'heading', 'global'];
        
        for (let i = 0; i < styles.length; i++) {
            const prop = styles[i];
            if (prop.startsWith('--') && 
                colorKeywords.some(keyword => prop.toLowerCase().includes(keyword))) {
                const value = styles.getPropertyValue(prop).trim();
                allProps.push({ prop, value });
            }
        }
        
        console.log('===== COLOR VARIABLES DETECTED =====');
        allProps.forEach(({ prop, value }) => {
            console.log(`${prop}: ${value}`);
        });
        console.log('===================================');
        
        return allProps;
    }
    
    debugCurrentThemeMappings() {
        const currentTheme = this.getAttribute('theme') || 
                           document.documentElement.getAttribute('data-theme') || 
                           'light';
        const mappings = this.getThemeMappings();
        const themeMapping = mappings[currentTheme];
        
        console.log(`===== THEME MAPPINGS FOR '${currentTheme}' =====`);
        for (const [siteVar, ourVar] of Object.entries(themeMapping)) {
            console.log(`${siteVar} → ${ourVar}`);
        }
        console.log('==========================================');
        
        return themeMapping;
    }
    
    diagnoseColorIssues() {
        const currentTheme = this.getAttribute('theme') || 
                           document.documentElement.getAttribute('data-theme') || 
                           'light';
        const results = {
            summary: `Color diagnosis for theme: ${currentTheme}`,
            problematicElements: []
        };
        
        const allElements = document.querySelectorAll('*');
        const ignoreClasses = ['wb-controller', 'control-panel', 'wb-color-mapper'];
        
        allElements.forEach(el => {
            if (ignoreClasses.some(cls => el.classList.contains(cls))) return;
            
            const styles = getComputedStyle(el);
            const textColor = styles.color;
            const bgColor = styles.backgroundColor;
            const hasInlineColor = el.style.color;
            const hasInlineBg = el.style.backgroundColor;
            
            if (hasInlineColor || hasInlineBg) {
                results.problematicElements.push({
                    element: el.tagName + 
                            (el.id ? `#${el.id}` : '') + 
                            (el.className ? `.${el.className.replace(/\s+/g, '.')}` : ''),
                    inlineColor: hasInlineColor,
                    inlineBg: hasInlineBg,
                    computed: { color: textColor, backgroundColor: bgColor }
                });
            }
        });
        
        console.log('===== COLOR DIAGNOSIS =====');
        console.log(results);
        console.log('==========================');
        
        return results;
    }
    
    forceThemeUpdate() {
        const currentTheme = this.getAttribute('theme') || 
                           document.documentElement.getAttribute('data-theme') || 
                           'light';
        this.mapThemeColors(currentTheme);
    }
}

// Register the custom element
if (!customElements.get('wb-color-mapper')) {
    customElements.define('wb-color-mapper', WBColorMapper);
}

// Export for use in other modules
window.WBColorMapper = WBColorMapper;