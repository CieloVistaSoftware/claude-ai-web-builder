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
        document.body.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        
        const themeButton = document.querySelector('.theme-toggle');
        if (themeButton) {
            themeButton.textContent = '☀️ Light Mode';
        }
    }

    setupColorBarsComponent() {
        this.colorBars = document.getElementById('semantic-color-bars');
        
        if (!this.colorBars) {
            console.error('wb-color-bars component not found');
            return;
        }

        // Wait for component to be ready
        setTimeout(() => {
            // Listen for color change events from the updated wb-color-bars component
            this.colorBars.addEventListener('colorchange', (e) => {
                console.log('Color change event received:', e.detail);
                
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
            
            console.log('Color bars component initialized with new event structure');
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
        
        console.log(`Updated ${type} color:`, targetColor);
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
        
        console.log('Initialized colors from attributes:', {
            text: this.currentTextColor,
            background: this.currentBgColor
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
                console.log('Target elements updated:', Array.from(this.targetElements));
            });
        });
    }

    setupThemeToggle() {
        window.toggleTheme = () => {
            const body = document.body;
            const isDark = body.classList.contains('dark');
            
            if (isDark) {
                body.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                body.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            }
            
            const themeButton = document.querySelector('.theme-toggle');
            if (themeButton) {
                themeButton.textContent = isDark ? '🌙 Dark Mode' : '☀️ Light Mode';
            }
            
            // Update color bars theme
            if (this.colorBars) {
                this.colorBars.setAttribute('theme', isDark ? 'light' : 'dark');
            }
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
            console.warn('Content preview not found');
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

        // Also apply directly to some key elements for immediate feedback
        const directElements = contentPreview.querySelectorAll('h1, h2, h3, p');
        directElements.forEach(element => {
            if (this.targetElements.has('h1,h2,h3') && (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3')) {
                element.style.color = textColor;
                element.style.backgroundColor = bgColor;
            }
            if (this.targetElements.has('p') && element.tagName === 'P') {
                element.style.color = textColor;
                element.style.backgroundColor = bgColor;
            }
        });

        console.log('✅ Applied colors to elements:', Array.from(elementsToStyle));
        console.log('📝 Text color:', textColor);
        console.log('🎨 Background color:', bgColor);
        console.log('🎯 Affected elements:', directElements.length);
    }

    addDebugInfo() {
        console.log('🎨 Color Bars Semantic Demo loaded');
        console.log('This demo shows how 6 color bars control text and background colors');
        
        setTimeout(() => {
            const colorBarsElement = document.querySelector('wb-color-bars');
            console.log('wb-color-bars element:', colorBarsElement);
            console.log('wb-color-bars defined:', customElements.get('wb-color-bars') ? 'YES' : 'NO');
            console.log('wb-color-bar defined:', customElements.get('wb-color-bar') ? 'YES' : 'NO');
            
            if (colorBarsElement) {
                console.log('Component attributes:', Array.from(colorBarsElement.attributes).map(attr => `${attr.name}="${attr.value}"`));
                console.log('Shadow root:', colorBarsElement.shadowRoot ? 'exists' : 'missing');
            }
        }, 2000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ColorBarsSemanticDemo();
});