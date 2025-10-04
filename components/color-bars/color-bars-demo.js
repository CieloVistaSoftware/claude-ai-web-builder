// Color Bars Demo JavaScript
class ColorBarsDemo {
    constructor() {
        this.themes = {
            material: { hue: 240, saturation: 70, lightness: 50 },
            ocean: { hue: 200, saturation: 80, lightness: 45 },
            forest: { hue: 120, saturation: 60, lightness: 40 },
            sunset: { hue: 25, saturation: 85, lightness: 55 },
            purple: { hue: 280, saturation: 75, lightness: 50 }
        };
        
        this.colorPickers = [
            { id: 'main-color', previewId: 'main-preview', valuesId: 'main-values' },
            { id: 'theme-color', previewId: 'theme-preview', valuesId: 'theme-values' }
        ];

        this.init();
    }

    init() {
        this.initializeTheme();
        this.setupEventListeners();
        this.initializeColorPickers();
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

    calculateAccentColor(primaryHue, primarySaturation, primaryLightness) {
        const accentHue = (primaryHue + 180) % 360;
        const accentSaturation = Math.max(60, primarySaturation - 10);
        const accentLightness = primaryLightness > 50 ? primaryLightness - 15 : primaryLightness + 15;
        
        return { hue: accentHue, saturation: accentSaturation, lightness: accentLightness };
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

    updateAccentDisplay(primaryColor) {
        const accent = this.calculateAccentColor(primaryColor.hue, primaryColor.saturation, primaryColor.lightness);
        const accentHex = this.hslToHex(accent.hue, accent.saturation, accent.lightness);
        const accentHsl = `hsl(${accent.hue}, ${accent.saturation}%, ${accent.lightness}%)`;
        
        const accentPreview = document.getElementById('accent-preview');
        const accentValues = document.getElementById('accent-values');
        
        if (accentPreview) {
            accentPreview.style.backgroundColor = accentHex;
            accentPreview.style.color = accentHex;
        }
        
        if (accentValues) {
            accentValues.innerHTML = `
                HSL: ${accentHsl}<br>
                HEX: ${accentHex}<br>
                RGB: rgb(${Math.round(accent.hue)}, ${accent.saturation}, ${accent.lightness})
            `;
        }
    }

    setupEventListeners() {
        // Theme toggle
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
            
            document.querySelectorAll('wb-color-bars').forEach(picker => {
                picker.setAttribute('theme', isDark ? 'light' : 'dark');
            });
        };
    }

    initializeColorPickers() {
        setTimeout(() => {
            this.colorPickers.forEach(({ id, previewId, valuesId }) => {
                const picker = document.getElementById(id);
                const preview = document.getElementById(previewId);
                const values = document.getElementById(valuesId);
                
                if (!picker || !preview || !values) {
                    console.warn(`Missing elements for ${id}:`, { picker, preview, values });
                    return;
                }
                
                const updateDisplay = (colorData) => {
                    preview.style.backgroundColor = colorData.hex;
                    preview.style.color = colorData.hex;
                    values.innerHTML = `
                        HSL: ${colorData.hsl}<br>
                        HEX: ${colorData.hex}<br>
                        RGB: rgb(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b})
                    `;
                };
                
                picker.addEventListener('colorchange', (e) => {
                    updateDisplay(e.detail);
                    
                    // Update accent color for both main and theme color pickers
                    if (id === 'main-color' || id === 'theme-color') {
                        this.updateAccentDisplay(e.detail);
                    }
                });
                
                picker.addEventListener('colorselect', (e) => {
                    console.log(`${id} selected:`, e.detail.hex);
                });
                
                picker.addEventListener('colorcopied', (e) => {
                    console.log(`Copied ${e.detail.hex} to clipboard`);
                });
                
                // Initialize display
                if (picker.color) {
                    updateDisplay(picker.color);
                    if (id === 'primary-color') {
                        this.updateAccentDisplay(picker.color);
                    }
                } else {
                    const hue = picker.getAttribute('hue') || 240;
                    const saturation = picker.getAttribute('saturation') || 70;
                    const lightness = picker.getAttribute('lightness') || 50;
                    
                    const fallbackColor = {
                        hue: parseInt(hue),
                        saturation: parseInt(saturation),
                        lightness: parseInt(lightness),
                        hsl: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                        hex: this.hslToHex(parseInt(hue), parseInt(saturation), parseInt(lightness)),
                        rgb: { r: 0, g: 0, b: 0 }
                    };
                    
                    updateDisplay(fallbackColor);
                }
            });

            // Theme selector
            const themeSelector = document.getElementById('theme-selector');
            const themePicker = document.getElementById('theme-color');
            
            if (themeSelector && themePicker) {
                themeSelector.addEventListener('change', (e) => {
                    const selectedTheme = e.target.value;
                    
                    if (selectedTheme !== 'custom' && this.themes[selectedTheme]) {
                        const theme = this.themes[selectedTheme];
                        if (themePicker.setColor) {
                            themePicker.setColor(theme.hue, theme.saturation, theme.lightness);
                        }
                        e.target.value = selectedTheme;
                    }
                });
                
                themePicker.addEventListener('colorchange', () => {
                    setTimeout(() => {
                        themeSelector.value = 'custom';
                    }, 100);
                });
            }
        }, 1000);
    }

    addDebugInfo() {
        console.log('🎨 Color Bars Demo loaded');
        console.log('Try changing colors and check the console for events!');
        
        setTimeout(() => {
            const colorBarsElements = document.querySelectorAll('wb-color-bars');
            console.log(`Found ${colorBarsElements.length} wb-color-bars elements`);
            
            colorBarsElements.forEach((element, index) => {
                console.log(`wb-color-bars ${index + 1}:`, {
                    tagName: element.tagName,
                    attributes: Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`),
                    hasColorProperty: 'color' in element,
                    hasSetColorMethod: 'setColor' in element,
                    shadowRoot: element.shadowRoot ? 'exists' : 'missing'
                });
            });
            
            console.log('Web component definitions:');
            console.log('wb-color-bars defined:', customElements.get('wb-color-bars') ? 'YES' : 'NO');
            console.log('wb-color-bar defined:', customElements.get('wb-color-bar') ? 'YES' : 'NO');
        }, 2000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ColorBarsDemo();
});