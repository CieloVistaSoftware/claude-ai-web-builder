// Color data for the picker
const colorCategories = {
    'Blues': ['#3498db', '#2980b9', '#1abc9c', '#16a085', '#2c3e50', '#34495e'],
    'Reds': ['#e74c3c', '#c0392b', '#e67e22', '#d35400'],
    'Greens': ['#2ecc71', '#27ae60', '#f39c12', '#f1c40f'],
    'Purples': ['#9b59b6', '#8e44ad', '#95a5a6', '#7f8c8d']
};

// Initialize color palettes
function initializeColorPalettes() {
    const container = document.getElementById('color-palettes');
    
    Object.entries(colorCategories).forEach(([category, colors]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `
            <h3 style="color: var(--text-primary); margin-bottom: 15px;">${category}</h3>
            <div class="color-palette">
                ${colors.map(color => 
                    `<div class="color-swatch" style="background: ${color};" title="${color}" onclick="applyThemeColor('${color}')"></div>`
                ).join('')}
            </div>
        `;
        container.appendChild(categoryDiv);
    });
}

// Apply theme color
function applyThemeColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--accent-primary', color);
    
    // Update color inspector
    updateColorInspector(color);
    
    // Generate new palette table
    generatePaletteTable(color);
    
    // Update dropdown selection if popup is open
    updateDropdownSelection(color);
    
    // Show semantic popup to demonstrate color change (manual close only)
    showSemanticPopup();
}

// Show semantic popup
function showSemanticPopup() {
    const popup = document.getElementById('semantic-popup');
    if (popup) {
        popup.classList.add('active');
    }
}

// Update color inspector
function updateColorInspector(hex) {
    document.getElementById('current-hex').textContent = hex;
    document.getElementById('css-hex').textContent = hex;
    document.getElementById('css-color').textContent = hex;
    document.getElementById('selected-color-preview').style.background = hex;
    
    // Convert to RGB and HSL
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    document.getElementById('current-rgb').textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    document.getElementById('current-hsl').textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
}

// Generate palette table with brightness controls
function generatePaletteTable(baseColor) {
    const tableBody = document.getElementById('palette-table-body');
    if (!tableBody) return;
    
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const shadeNames = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    
    tableBody.innerHTML = '';
    
    for (let i = 0; i < 11; i++) {
        const lightness = 95 - (i * 8.5);
        const newHsl = { h: hsl.h, s: hsl.s, l: lightness };
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: bold; color: var(--text-primary);">${shadeNames[i]}</td>
            <td>
                <div class="palette-swatch-cell" 
                     style="background: ${hex};" 
                     onclick="applyThemeColor('${hex}')"
                     title="Click to apply ${hex}"></div>
            </td>
            <td>
                <div class="color-info">
                    <div class="color-value">HEX: ${hex}</div>
                    <div class="color-value">HSL: ${Math.round(newHsl.h)}, ${Math.round(newHsl.s)}%, ${Math.round(newHsl.l)}%</div>
                    <div class="color-value">RGB: ${newRgb.r}, ${newRgb.g}, ${newRgb.b}</div>
                </div>
            </td>
            <td>
                <div class="brightness-control">
                    <span style="color: var(--text-secondary); font-size: 0.8rem;">Dark</span>
                    <input type="range" 
                           class="brightness-slider" 
                           min="0" 
                           max="100" 
                           value="${Math.round(newHsl.l)}"
                           onchange="updateRowBrightness(this, ${newHsl.h}, ${newHsl.s}, '${shadeNames[i]}')"
                           oninput="updateRowBrightness(this, ${newHsl.h}, ${newHsl.s}, '${shadeNames[i]}')"
                           data-shade="${shadeNames[i]}">
                    <span style="color: var(--text-secondary); font-size: 0.8rem;">Light</span>
                </div>
                <div style="margin-top: 5px; text-align: center; font-size: 0.8rem; color: var(--text-secondary);">
                    ${Math.round(newHsl.l)}%
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    }
}

// Apply selected theme from dropdown (enhanced to sync with palette generator)
function applySelectedTheme(hexColor) {
    if (hexColor && hexColor.startsWith('#')) {
        applyThemeColor(hexColor);
        
        // Update the semantic popup dropdown border
        const dropdown = document.getElementById('popup-select');
        if (dropdown) {
            dropdown.style.borderColor = hexColor;
        }
        
        // Update palette generator dropdown if it exists
        const paletteDropdown = document.getElementById('palette-theme-select');
        if (paletteDropdown) {
            updatePaletteDropdownSelection(hexColor);
        }
        
        // Show visual feedback
        const label = dropdown.previousElementSibling;
        if (label) {
            label.style.color = hexColor;
            setTimeout(() => {
                label.style.color = 'var(--text-primary)';
            }, 1000);
        }
    }
}

// Apply selected theme from palette generator dropdown
function applyPaletteTheme(hexColor) {
    if (hexColor && hexColor.startsWith('#')) {
        // Apply the theme color to the entire system
        applyThemeColor(hexColor);
        
        // Update the theme preview and name in the palette generator
        updatePaletteThemeDisplay(hexColor);
        
        // Update semantic popup dropdown if it exists
        const semanticDropdown = document.getElementById('popup-select');
        if (semanticDropdown) {
            updateDropdownSelection(hexColor);
        }
    }
}

// Update palette theme display elements
function updatePaletteThemeDisplay(hexColor) {
    const preview = document.getElementById('current-theme-preview');
    const nameSpan = document.getElementById('current-theme-name');
    const dropdown = document.getElementById('palette-theme-select');
    
    if (preview) {
        preview.style.background = hexColor;
    }
    
    if (dropdown && nameSpan) {
        // Find the selected option and update the theme name
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        if (selectedOption) {
            const themeName = selectedOption.getAttribute('data-name');
            nameSpan.textContent = themeName;
            nameSpan.style.color = hexColor;
        }
    }
}

// Update palette generator dropdown when theme changes from other sources
function updatePaletteDropdownSelection(hexColor) {
    const dropdown = document.getElementById('palette-theme-select');
    if (dropdown) {
        // Find matching option and select it
        const options = dropdown.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === hexColor) {
                dropdown.selectedIndex = i;
                updatePaletteThemeDisplay(hexColor);
                break;
            }
        }
    }
}

// Update dropdown selection when theme changes from other sources
function updateDropdownSelection(hexColor) {
    const dropdown = document.getElementById('popup-select');
    if (dropdown) {
        // Find matching option and select it
        const options = dropdown.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === hexColor) {
                dropdown.selectedIndex = i;
                break;
            }
        }
    }
}

function closeSemanticPopup() {
    document.getElementById('semantic-popup').classList.remove('active');
}

// Update row brightness from slider
function updateRowBrightness(slider, hue, saturation, shade) {
    const lightness = slider.value;
    const rgb = hslToRgb(hue, saturation, lightness);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    
    // Find the row and update swatch and color info
    const row = slider.closest('tr');
    const swatch = row.querySelector('.palette-swatch-cell');
    const colorInfo = row.querySelector('.color-info');
    
    swatch.style.background = hex;
    swatch.setAttribute('onclick', `applyThemeColor('${hex}')`);
    swatch.setAttribute('title', `Click to apply ${hex}`);
    
    colorInfo.innerHTML = `
        <div class="color-value">HEX: ${hex}</div>
        <div class="color-value">HSL: ${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%</div>
        <div class="color-value">RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</div>
    `;
    
    // Update brightness percentage display
    const brightnessDisplay = row.querySelector('div[style*="margin-top: 5px"]');
    if (brightnessDisplay) {
        brightnessDisplay.textContent = Math.round(lightness) + '%';
    }
}

// Color conversion utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };

    if (s === 0) {
        const gray = Math.round(l * 255);
        return { r: gray, g: gray, b: gray };
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    return {
        r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
    };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Copy functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = originalText, 1000);
    });
}

function copyColorInfo() {
    const hex = document.getElementById('current-hex').textContent;
    const rgb = document.getElementById('current-rgb').textContent;
    const hsl = document.getElementById('current-hsl').textContent;
    
    const info = `Color Information:
Hex: ${hex}
RGB: ${rgb}
HSL: ${hsl}

CSS Usage:
:root { --primary-color: ${hex}; }
.element { background-color: ${hex}; }`;
    
    copyToClipboard(info);
}

// Tab functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.tab-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panels
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Show corresponding panel
            const targetPanelId = tab.getAttribute('aria-controls');
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeColorPalettes();
    initializeTabs();
    updateColorInspector('#3498db');
    generatePaletteTable('#3498db');
    initializeColorControlPanel();
    initializePopupControls();
});

// Initialize popup controls
function initializePopupControls() {
    // Manual popup open button
    const openButton = document.getElementById('open-semantic-popup');
    if (openButton) {
        openButton.addEventListener('click', showSemanticPopup);
    }
    
    // Close popup when clicking overlay
    const overlay = document.getElementById('semantic-popup');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeSemanticPopup();
            }
        });
    }
    
    // ESC key to close popup
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('semantic-popup').classList.contains('active')) {
            closeSemanticPopup();
        }
    });
    
    // Initialize dropdown with current theme
    updateDropdownSelection('#3498db');
}

// Initialize Color Control Panel functionality
function initializeColorControlPanel() {
    const hueSlider = document.getElementById('hue-slider');
    const saturationSlider = document.getElementById('saturation-slider');
    const lightnessSlider = document.getElementById('lightness-slider');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const borderRadiusSlider = document.getElementById('border-radius-slider');
    const spacingSlider = document.getElementById('spacing-slider');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // HSL Control listeners
    if (hueSlider) {
        hueSlider.addEventListener('input', updateColorFromHSL);
        hueSlider.addEventListener('change', updateColorFromHSL);
    }
    if (saturationSlider) {
        saturationSlider.addEventListener('input', updateColorFromHSL);
        saturationSlider.addEventListener('change', updateColorFromHSL);
    }
    if (lightnessSlider) {
        lightnessSlider.addEventListener('input', updateColorFromHSL);
        lightnessSlider.addEventListener('change', updateColorFromHSL);
    }

    // Layout control listeners
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', (e) => {
            const value = e.target.value + 'px';
            document.getElementById('font-size-value').textContent = value;
            document.documentElement.style.fontSize = value;
        });
    }

    if (borderRadiusSlider) {
        borderRadiusSlider.addEventListener('input', (e) => {
            const value = e.target.value + 'px';
            document.getElementById('border-radius-value').textContent = value;
            document.documentElement.style.setProperty('--border-radius', value);
        });
    }

    if (spacingSlider) {
        spacingSlider.addEventListener('input', (e) => {
            const value = e.target.value + 'px';
            document.getElementById('spacing-value').textContent = value;
            document.documentElement.style.setProperty('--spacing', value);
        });
    }

    // Theme generation button listeners
    const generateButtons = {
        'generate-complementary-btn': generateComplementaryTheme,
        'generate-triadic-btn': generateTriadicTheme,
        'generate-analogous-btn': generateAnalogousTheme,
        'generate-monochromatic-btn': generateMonochromaticTheme
    };

    Object.entries(generateButtons).forEach(([id, func]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', func);
        }
    });

    // Export button listeners
    const exportButtons = {
        'export-css-btn': exportCSS,
        'export-scss-btn': exportSCSS,
        'reset-defaults-btn': resetToDefaults
    };

    Object.entries(exportButtons).forEach(([id, func]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', func);
        }
    });
}

// Update color from HSL sliders
function updateColorFromHSL() {
    const h = document.getElementById('hue-slider')?.value || 204;
    const s = document.getElementById('saturation-slider')?.value || 100;
    const l = document.getElementById('lightness-slider')?.value || 50;

    // Update value displays
    document.getElementById('hue-value').textContent = h + '°';
    document.getElementById('saturation-value').textContent = s + '%';
    document.getElementById('lightness-value').textContent = l + '%';

    // Convert HSL to RGB to HEX
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    // Update live preview
    const preview = document.getElementById('live-color-preview');
    if (preview) {
        preview.style.background = hex;
    }

    // Apply theme color
    applyThemeColor(hex);
}

// Theme generation functions
function generateComplementaryTheme() {
    const currentHue = parseInt(document.getElementById('hue-slider')?.value || 204);
    const complementaryHue = (currentHue + 180) % 360;
    const colors = [
        `hsl(${currentHue}, 70%, 53%)`,
        `hsl(${complementaryHue}, 70%, 53%)`
    ];
    displayGeneratedTheme(colors);
}

function generateTriadicTheme() {
    const currentHue = parseInt(document.getElementById('hue-slider')?.value || 204);
    const colors = [
        `hsl(${currentHue}, 70%, 53%)`,
        `hsl(${(currentHue + 120) % 360}, 70%, 53%)`,
        `hsl(${(currentHue + 240) % 360}, 70%, 53%)`
    ];
    displayGeneratedTheme(colors);
}

function generateAnalogousTheme() {
    const currentHue = parseInt(document.getElementById('hue-slider')?.value || 204);
    const colors = [
        `hsl(${(currentHue - 30 + 360) % 360}, 70%, 53%)`,
        `hsl(${currentHue}, 70%, 53%)`,
        `hsl(${(currentHue + 30) % 360}, 70%, 53%)`
    ];
    displayGeneratedTheme(colors);
}

function generateMonochromaticTheme() {
    const currentHue = parseInt(document.getElementById('hue-slider')?.value || 204);
    const currentSat = parseInt(document.getElementById('saturation-slider')?.value || 70);
    const colors = [
        `hsl(${currentHue}, ${currentSat}%, 30%)`,
        `hsl(${currentHue}, ${currentSat}%, 53%)`,
        `hsl(${currentHue}, ${currentSat}%, 70%)`
    ];
    displayGeneratedTheme(colors);
}

function displayGeneratedTheme(colors) {
    const preview = document.getElementById('generated-theme-preview');
    if (!preview) return;

    preview.innerHTML = colors.map((color, index) => {
        const rgb = hslStringToRgb(color);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        return `<div class="theme-color-swatch" 
                   style="background: ${color}; width: 60px; height: 60px; border-radius: 8px; cursor: pointer; border: 2px solid var(--border-color);" 
                   title="${hex}" 
                   onclick="applyThemeColor('${hex}')"></div>`;
    }).join('');
}

function hslStringToRgb(hslString) {
    const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
        return hslToRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
    }
    return { r: 0, g: 0, b: 0 };
}

// Export functions
function exportCSS() {
    const currentColor = document.getElementById('current-hex')?.textContent || '#3498db';
    const fontSize = document.getElementById('font-size-value')?.textContent || '16px';
    const borderRadius = document.getElementById('border-radius-value')?.textContent || '8px';
    const spacing = document.getElementById('spacing-value')?.textContent || '20px';

    const css = `:root {
  --primary-color: ${currentColor};
  --accent-primary: ${currentColor};
  --font-size: ${fontSize};
  --border-radius: ${borderRadius};
  --spacing: ${spacing};
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #3a3a3a;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --border-color: #4a4a4a;
}

body {
  font-size: var(--font-size);
  background: var(--bg-primary);
  color: var(--text-primary);
}

.button {
  background: var(--accent-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing);
}`;

    copyToClipboard(css);
    alert('CSS exported to clipboard!');
}

function exportSCSS() {
    const currentColor = document.getElementById('current-hex')?.textContent || '#3498db';
    const scss = `$primary-color: ${currentColor};
$accent-primary: ${currentColor};
$bg-primary: #1a1a1a;
$bg-secondary: #2d2d2d;
$text-primary: #ffffff;

@mixin button-style {
  background: $accent-primary;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba($accent-primary, 0.3);
  }
}`;

    copyToClipboard(scss);
    alert('SCSS exported to clipboard!');
}

function resetToDefaults() {
    // Reset sliders
    document.getElementById('hue-slider').value = 204;
    document.getElementById('saturation-slider').value = 100;
    document.getElementById('lightness-slider').value = 50;
    document.getElementById('font-size-slider').value = 16;
    document.getElementById('border-radius-slider').value = 8;
    document.getElementById('spacing-slider').value = 20;

    // Reset CSS variables
    document.documentElement.style.setProperty('--primary-color', '#3498db');
    document.documentElement.style.setProperty('--accent-primary', '#3498db');
    document.documentElement.style.fontSize = '16px';
    document.documentElement.style.setProperty('--border-radius', '8px');
    document.documentElement.style.setProperty('--spacing', '20px');

    // Update displays
    updateColorFromHSL();
    document.getElementById('font-size-value').textContent = '16px';
    document.getElementById('border-radius-value').textContent = '8px';
    document.getElementById('spacing-value').textContent = '20px';

    alert('Reset to default values!');
}