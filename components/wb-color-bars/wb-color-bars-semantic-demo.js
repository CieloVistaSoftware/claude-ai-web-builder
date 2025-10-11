// Color Bars Semantic Demo JavaScript
class ColorBarsSemanticDemo {
    constructor() {
        this.colorBars = null;
        this.targetElements = new Set(['h1,h2,h3', 'p']);
        this.currentTextColor = { hue: 240, saturation: 70, lightness: 90 };
        this.currentBgColor = { hue: 240, saturation: 40, lightness: 20 };
        
        this.init();
    }

    init() {
        this.initializeTheme();
        this.setupColorBarsComponent();
        this.setupElementSelector();
        this.setupThemeToggle();
        this.updateColorDisplays();
        this.applyColorsToElements();
        this.addDebugInfo();
    }

    initializeTheme() {
        // REACTIVE: Dispatch theme change request instead of direct DOM manipulation
        document.dispatchEvent(new CustomEvent('wb:theme-change-request', {
            detail: { theme: 'dark', source: 'wb-color-bars-semantic-demo' },
            bubbles: true
        }));
        
        // Listen for theme changes instead of manipulating theme button directly
        document.addEventListener('wb:theme-changed', (e) => {
            const themeButton = document.querySelector('.theme-toggle');
            if (themeButton) {
                const isDark = e.detail.theme === 'dark';
                themeButton.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
            }
        });
    }

    setupColorBarsComponent() {
        this.colorBars = document.getElementById('semantic-color-bars');
        
        if (!this.colorBars) {
            WBSafeLogger.error('wb-color-bars component not found', { component: 'ColorBarsSemanticDemo', method: 'setupColorBarsComponent', line: 35 });
            return;
        }

        // Wait for component to be ready
        setTimeout(() => {
            // Listen for color change events from the updated wb-color-bars component
            this.colorBars.addEventListener('colorchange', (e) => {
                WBSafeLogger.info('Color change event received', { component: 'ColorBarsSemanticDemo', detail: e.detail, line: 42 });
                
                // The new event structure includes both text and background colors
                if (e.detail && e.detail.text && e.detail.background) {
                    this.currentTextColor = {
                        hue: e.detail.text.hue,
                        saturation: e.detail.text.saturation,
                        lightness: e.detail.text.lightness
                    };
                    
                    this.currentBgColor = {
                        hue: e.detail.background.hue,
                        saturation: e.detail.background.saturation,
                        lightness: e.detail.background.lightness
                    };
                    
                    this.updateColorDisplays();
                    this.applyColorsToElements();
                }
            });

            // Initialize with current attribute values
            this.initializeFromAttributes();
            
            WBSafeLogger.success('Color bars component initialized with new event structure', { component: 'ColorBarsSemanticDemo', method: 'setupColorBarsComponent', line: 64 });
        }, 1500);
    }

    updateColorFromBar(colorData, type, barIndex) {
        const targetColor = type === 'text' ? this.currentTextColor : this.currentBgColor;
        
        // Update the appropriate HSL component based on bar index
        switch (barIndex) {
            case 0: // Hue bar
                targetColor.hue = colorData.hue;
                break;
            case 1: // Saturation bar
                targetColor.saturation = colorData.saturation || colorData.value;
                break;
            case 2: // Lightness bar
                targetColor.lightness = colorData.lightness || colorData.value;
                break;
        }
        
        WBSafeLogger.debug(`Updated ${type} color`, { component: 'ColorBarsSemanticDemo', type, color: targetColor, line: 85 });
    }

    initializeFromAttributes() {
        const textHue = this.colorBars.getAttribute('text-hue') || 240;
        const textSat = this.colorBars.getAttribute('text-saturation') || 70;
        const textLight = this.colorBars.getAttribute('text-lightness') || 90;
        
        const bgHue = this.colorBars.getAttribute('bg-hue') || 240;
        const bgSat = this.colorBars.getAttribute('bg-saturation') || 40;
        const bgLight = this.colorBars.getAttribute('bg-lightness') || 20;
        
        this.currentTextColor = {
            hue: parseInt(textHue),
            saturation: parseInt(textSat),
            lightness: parseInt(textLight)
        };
        
        this.currentBgColor = {
            hue: parseInt(bgHue),
            saturation: parseInt(bgSat),
            lightness: parseInt(bgLight)
        };
        
        WBSafeLogger.info('Initialized colors from attributes', { 
            component: 'ColorBarsSemanticDemo', 
            method: 'initializeFromAttributes',
            text: this.currentTextColor,
            background: this.currentBgColor,
            line: 111
        });
        
        this.updateColorDisplays();
        this.applyColorsToElements();
    }

    setupElementSelector() {
        const checkboxes = document.querySelectorAll('.element-selector input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const selector = e.target.value;
                
                if (e.target.checked) {
                    this.targetElements.add(selector);
                } else {
                    this.targetElements.delete(selector);
                }
                
                this.applyColorsToElements();
                WBSafeLogger.info('Target elements updated', { component: 'ColorBarsSemanticDemo', elements: Array.from(this.targetElements), line: 129 });
            });
        });
    }

    setupThemeToggle() {
        window.toggleTheme = () => {
            // REACTIVE: Get current theme from document instead of body classes
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // REACTIVE: Dispatch theme change request instead of direct DOM manipulation
            document.dispatchEvent(new CustomEvent('wb:theme-change-request', {
                detail: { 
                    theme: newTheme, 
                    source: 'wb-color-bars-semantic-demo-toggle',
                    previousTheme: currentTheme
                },
                bubbles: true
            }));
            
            WBSafeLogger.logUser('Theme toggle requested', {
                component: 'ColorBarsSemanticDemo',
                method: 'toggleTheme',
                line: 155,
                newTheme: newTheme,
                previousTheme: currentTheme
            });
        };
    }

    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / (1/12)) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color);
        };
        
        const r = f(0);
        const g = f(8);
        const b = f(4);
        
        return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    }

    hslToString(colorObj) {
        return `hsl(${Math.round(colorObj.hue)}, ${Math.round(colorObj.saturation)}%, ${Math.round(colorObj.lightness)}%)`;
    }

    updateColorDisplays() {
        const textColorValue = document.getElementById('text-color-value');
        const bgColorValue = document.getElementById('bg-color-value');
        const textColorSwatch = document.getElementById('text-color-swatch');
        const bgColorSwatch = document.getElementById('bg-color-swatch');

        if (textColorValue && textColorSwatch) {
            const textHsl = this.hslToString(this.currentTextColor);
            const textHex = this.hslToHex(this.currentTextColor.hue, this.currentTextColor.saturation, this.currentTextColor.lightness);
            
            textColorValue.textContent = textHsl;
            textColorSwatch.style.backgroundColor = textHex;
        }

        if (bgColorValue && bgColorSwatch) {
            const bgHsl = this.hslToString(this.currentBgColor);
            const bgHex = this.hslToHex(this.currentBgColor.hue, this.currentBgColor.saturation, this.currentBgColor.lightness);
            
            bgColorValue.textContent = bgHsl;
            bgColorSwatch.style.backgroundColor = bgHex;
        }
    }

    applyColorsToElements() {
        const contentPreview = document.querySelector('.content-preview');
        if (!contentPreview) {
            WBSafeLogger.warning('Content preview not found', { component: 'ColorBarsSemanticDemo', method: 'applyColorsToElements', line: 222 });
            return;
        }

        // Clear previous styles
        const existingStyle = document.getElementById('dynamic-color-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        // Create new style element
        const style = document.createElement('style');
        style.id = 'dynamic-color-styles';

        const textColor = this.hslToString(this.currentTextColor);
        const bgColor = this.hslToString(this.currentBgColor);

        let css = '';

        // If no elements are selected, apply to common text elements by default
        const elementsToStyle = this.targetElements.size > 0 ? this.targetElements : new Set(['h1,h2,h3', 'p']);

        // Apply colors to selected element types
        elementsToStyle.forEach(selector => {
            css += `
                .content-preview ${selector} {
                    color: ${textColor} !important;
                    background-color: ${bgColor} !important;
                    transition: color 0.3s ease, background-color 0.3s ease !important;
                    padding: 4px 8px !important;
                    border-radius: 4px !important;
                    margin: 4px 0 !important;
                }
            `;
        });

        // Also add some contrast helpers
        css += `
            .content-preview .color-preview-area {
                color: ${textColor} !important;
                background-color: ${bgColor} !important;
                padding: 20px !important;
                border-radius: 8px !important;
                margin: 20px 0 !important;
                border: 2px solid rgba(255,255,255,0.2) !important;
            }
        `;

        style.textContent = css;
        document.head.appendChild(style);

        // REACTIVE: Set CSS custom properties and dispatch event instead of direct element manipulation
        contentPreview.style.setProperty('--demo-text-color', textColor);
        contentPreview.style.setProperty('--demo-bg-color', bgColor);
        
        // REACTIVE: Dispatch color application event for other components to react
        document.dispatchEvent(new CustomEvent('wb:demo-colors-applied', {
            detail: {
                textColor: textColor,
                bgColor: bgColor,
                textColorHsl: this.currentTextColor,
                bgColorHsl: this.currentBgColor,
                targetElements: Array.from(this.targetElements),
                source: 'wb-color-bars-semantic-demo'
            },
            bubbles: true
        }));

        WBSafeLogger.success('Applied colors to elements', { 
            component: 'ColorBarsSemanticDemo',
            method: 'applyColorsToElements',
            elements: Array.from(elementsToStyle),
            textColor,
            bgColor,
            affectedCount: directElements.length,
            line: 278
        });
    }

    addDebugInfo() {
        WBSafeLogger.success('Color Bars Semantic Demo loaded', { component: 'ColorBarsSemanticDemo', method: 'addDebugInfo', line: 284 });
        WBSafeLogger.info('This demo shows how 6 color bars control text and background colors', { component: 'ColorBarsSemanticDemo', line: 285 });
        
        setTimeout(() => {
            const colorBarsElement = document.querySelector('wb-color-bars');
            WBSafeLogger.debug('Component check', { 
                component: 'ColorBarsSemanticDemo',
                element: !!colorBarsElement,
                'wb-color-bars-defined': customElements.get('wb-color-bars') ? 'YES' : 'NO',
                'wb-color-bar-defined': customElements.get('wb-color-bar') ? 'YES' : 'NO',
                line: 288
            });
            
            if (colorBarsElement) {
                WBSafeLogger.debug('Component details', {
                    component: 'ColorBarsSemanticDemo',
                    attributes: Array.from(colorBarsElement.attributes).map(attr => `${attr.name}="${attr.value}"`),
                    shadowRoot: colorBarsElement.shadowRoot ? 'exists' : 'missing',
                    line: 297
                });
            }
        }, 2000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ColorBarsSemanticDemo();
});
