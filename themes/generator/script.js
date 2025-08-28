// Theme Generator JavaScript

// Global preview mode state
let currentPreviewMode = 'light';
let isMinimized = false;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Toggle minimize
function toggleMinimize() {
    const container = document.getElementById('floatingPreviewContainer');
    const minimizeBtn = container.querySelector('.minimize-btn');
    isMinimized = !isMinimized;
    container.classList.toggle('minimized', isMinimized);
    minimizeBtn.textContent = isMinimized ? '+' : '−';
}

// Make preview draggable
function initDraggable() {
    const container = document.getElementById('floatingPreviewContainer');
    const header = container.querySelector('.floating-preview-header');
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        const rect = container.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        container.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        container.style.right = 'auto';
        container.style.bottom = 'auto';
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = '';
    });
}

// Switch preview mode
function switchPreviewMode(mode) {
    console.log(`Switching to ${mode} mode`);
    currentPreviewMode = mode;
    
    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        const isActive = btn.textContent.toLowerCase() === mode;
        btn.classList.toggle('active', isActive);
        console.log(`Button "${btn.textContent}" active: ${isActive}`);
    });
    
    // Update the isDark select to match the current mode
    const isDarkSelect = document.getElementById('isDark');
    if (isDarkSelect) {
        isDarkSelect.value = mode === 'dark' ? 'true' : 'false';
        console.log(`Set isDark select to: ${isDarkSelect.value}`);
    }
    
    // Hide semantic demo content in dark mode
    const semanticDemo = document.getElementById('semanticDemo');
    const semanticDemoParent = semanticDemo ? semanticDemo.parentElement : null;
    
    if (mode === 'dark') {
        // Hide the entire semantic demo section
        if (semanticDemoParent && semanticDemoParent.classList.contains('control-panel')) {
            semanticDemoParent.style.display = 'none';
            console.log('Hiding entire semantic demo control panel for dark mode');
        } else if (semanticDemo) {
            semanticDemo.style.display = 'none';
            console.log('Hiding semantic demo div for dark mode');
        }
    } else {
        // Show the semantic demo section
        if (semanticDemoParent && semanticDemoParent.classList.contains('control-panel')) {
            semanticDemoParent.style.display = 'block';
            console.log('Showing entire semantic demo control panel for light mode');
        } else if (semanticDemo) {
            semanticDemo.style.display = 'block';
            console.log('Showing semantic demo div for light mode');
        }
    }
    
    // Apply the theme changes immediately
    console.log('Calling generateAndApplyTheme()');
    generateAndApplyTheme();
}

// Update floating preview configuration
function updateFloatingPreview() {
    const config = {
        name: document.getElementById('themeName').value,
        primaryHue: parseInt(document.getElementById('primaryHue').value),
        colorScheme: document.getElementById('colorScheme').value,
        saturation: parseInt(document.getElementById('saturation').value),
        luminosity: parseInt(document.getElementById('luminosity').value),
        isDark: currentPreviewMode === 'dark'
    };
    
    const theme = generateTheme(config);
    const preview = document.getElementById('floatingPreview');
    
    // Apply styles to the floating preview container
    preview.style.backgroundColor = theme.colors.background;
    preview.style.color = theme.colors.textPrimary;
    preview.style.transition = 'all 0.3s ease';
    
    // Update color swatches
    const primarySwatch = document.getElementById('primarySwatch');
    primarySwatch.style.backgroundColor = theme.colors.primary;
    
    const accentSwatch = document.getElementById('accentSwatch');
    accentSwatch.style.backgroundColor = theme.colors.accent;
    
    // Apply text contrast for better readability
    document.querySelectorAll('.mini-config-group label, .mini-config-group small').forEach(el => {
        el.style.color = theme.colors.textPrimary;
    });
    
    // Style the save button
    const saveButton = document.querySelector('.save-theme-button');
    if (saveButton) {
        saveButton.style.backgroundColor = theme.colors.primary;
        saveButton.style.color = '#fff';
        saveButton.style.borderColor = theme.colors.primaryDark;
    }
}

// Theme Generator Function
function generateTheme(config) {
    const {
        name,
        primaryHue,
        colorScheme = 'complementary',
        saturation = 85,
        luminosity = 50,
        isDark = false
    } = config;
    
    // Calculate accent hue based on color scheme
    let accentHue;
    switch(colorScheme) {
        case 'complementary':
            accentHue = (primaryHue + 180) % 360;
            break;
        case 'triadic':
            accentHue = (primaryHue + 120) % 360;
            break;
        case 'analogous':
            accentHue = (primaryHue + 30) % 360;
            break;
        case 'splitComplementary':
            accentHue = (primaryHue + 150) % 360;
            break;
        case 'tetradic':
            accentHue = (primaryHue + 90) % 360;
            break;
        case 'monochromatic':
            accentHue = primaryHue; // Same hue, different saturation/lightness
            break;
        default:
            accentHue = (primaryHue + 180) % 360;
    }
    
    // Generate theme based on dark/light mode
    let theme = {};
    
    if (isDark) {
        theme = {
            // Primary colors
            primary: `hsl(${primaryHue}, ${saturation}%, ${luminosity}%)`,
            primaryLight: `hsl(${primaryHue}, ${saturation}%, ${Math.min(luminosity + 20, 90)}%)`,
            primaryDark: `hsl(${primaryHue}, ${saturation}%, ${Math.max(luminosity - 20, 10)}%)`,
            
            // Accent colors
            accent: colorScheme === 'monochromatic' 
                ? `hsl(${accentHue}, ${Math.max(saturation - 30, 20)}%, ${luminosity}%)`
                : `hsl(${accentHue}, ${saturation}%, ${luminosity}%)`,
            accentLight: colorScheme === 'monochromatic'
                ? `hsl(${accentHue}, ${Math.max(saturation - 30, 20)}%, ${Math.min(luminosity + 20, 90)}%)`
                : `hsl(${accentHue}, ${saturation}%, ${Math.min(luminosity + 20, 90)}%)`,
            accentDark: colorScheme === 'monochromatic'
                ? `hsl(${accentHue}, ${Math.max(saturation - 30, 20)}%, ${Math.max(luminosity - 20, 10)}%)`
                : `hsl(${accentHue}, ${saturation}%, ${Math.max(luminosity - 20, 10)}%)`,
            
            // Backgrounds
            background: `hsl(${primaryHue}, ${Math.min(saturation * 0.2, 20)}%, 10%)`,
            surface: `hsl(${primaryHue}, ${Math.min(saturation * 0.2, 20)}%, 15%)`,
            
            // Text
            textPrimary: `hsl(0, 0%, 95%)`,
            textSecondary: `hsl(0, 0%, 75%)`,
            
            // Borders
            border: `hsl(${primaryHue}, ${Math.min(saturation * 0.2, 20)}%, 25%)`
        };
    } else {
        theme = {
            // Primary colors
            primary: `hsl(${primaryHue}, ${saturation}%, ${luminosity}%)`,
            primaryLight: `hsl(${primaryHue}, ${Math.max(saturation - 20, 30)}%, ${Math.min(luminosity + 20, 90)}%)`,
            primaryDark: `hsl(${primaryHue}, ${saturation}%, ${Math.max(luminosity - 15, 20)}%)`,
            
            // Accent colors
            accent: colorScheme === 'monochromatic'
                ? `hsl(${accentHue}, ${Math.max(saturation - 30, 20)}%, ${luminosity}%)`
                : `hsl(${accentHue}, ${saturation}%, ${luminosity}%)`,
            accentLight: colorScheme === 'monochromatic'
                ? `hsl(${accentHue}, ${Math.max(saturation - 40, 10)}%, ${Math.min(luminosity + 20, 90)}%)`
                : `hsl(${accentHue}, ${Math.max(saturation - 20, 30)}%, ${Math.min(luminosity + 20, 90)}%)`,
            accentDark: colorScheme === 'monochromatic'
                ? `hsl(${accentHue}, ${Math.max(saturation - 30, 20)}%, ${Math.max(luminosity - 15, 20)}%)`
                : `hsl(${accentHue}, ${saturation}%, ${Math.max(luminosity - 15, 20)}%)`,
            
            // Backgrounds
            background: `hsl(0, 0%, 98%)`,
            surface: `hsl(0, 0%, 100%)`,
            
            // Text - Enhanced contrast for light mode
            textPrimary: `hsl(0, 0%, 15%)`,  // Darker for better contrast
            textSecondary: `hsl(0, 0%, 45%)`,  // Darker for better contrast
            
            // Borders
            border: `hsl(${primaryHue}, ${Math.min(saturation * 0.3, 30)}%, 85%)`
        };
    }
    
    return {
        name,
        config,
        colors: theme,
        accentHue
    };
}

// Apply theme to preview
function applyThemeToPreview(theme, previewId) {
    const preview = document.getElementById(previewId);
    const isDark = theme.config.isDark;
    
    // Apply styles
    preview.style.backgroundColor = theme.colors.background;
    preview.style.color = theme.colors.textPrimary;
    
    // Style headers
    preview.querySelector('.preview-title').style.color = theme.colors.primary;
    preview.querySelector('.preview-subtitle').style.color = theme.colors.textSecondary;
    
    // Style buttons
    const primaryBtn = preview.querySelector('.preview-button.primary');
    primaryBtn.style.backgroundColor = theme.colors.primary;
    primaryBtn.style.color = isDark ? '#fff' : '#fff';
    primaryBtn.style.border = 'none';
    
    const accentBtn = preview.querySelector('.preview-button.accent');
    accentBtn.style.backgroundColor = theme.colors.accent;
    accentBtn.style.color = isDark ? '#fff' : '#fff';
    accentBtn.style.border = 'none';
    
    // Style card
    const card = preview.querySelector('.preview-card');
    card.style.backgroundColor = theme.colors.surface;
    card.style.border = `1px solid ${theme.colors.border}`;
    card.querySelector('h3').style.color = theme.colors.primary;
    card.querySelector('p').style.color = theme.colors.textSecondary;
}

// Apply theme to semantic demo
function applyThemeToSemanticDemo(theme) {
    const demo = document.getElementById('semanticDemo');
    if (!demo) {
        console.warn('Semantic demo element not found');
        return;
    }
    
    console.log('Applying theme to semantic demo:', theme.colors);
    
    // Only apply to the semantic demo element specifically
    // Don't duplicate what's already set on document root
    demo.style.setProperty('--primary', theme.colors.primary);
    demo.style.setProperty('--primary-light', theme.colors.primaryLight);
    demo.style.setProperty('--primary-dark', theme.colors.primaryDark);
    demo.style.setProperty('--accent', theme.colors.accent);
    demo.style.setProperty('--accent-light', theme.colors.accentLight);
    demo.style.setProperty('--accent-dark', theme.colors.accentDark);
    demo.style.setProperty('--background', theme.colors.background);
    demo.style.setProperty('--surface', theme.colors.surface);
    demo.style.setProperty('--text-primary', theme.colors.textPrimary);
    demo.style.setProperty('--text-secondary', theme.colors.textSecondary);
    demo.style.setProperty('--border', theme.colors.border);
}

// Live update as user changes values - apply immediately to entire page
function setupLiveUpdates() {
    const controlInputs = [
        'primaryHue', 
        'colorScheme', 
        'saturation', 
        'luminosity', 
        'isDark',
        'themeName'
    ];
    
    controlInputs.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
            return;
        }
        
        // For sliders, use both input (for real-time updates during drag) and change (for final value)
        element.addEventListener('input', function() {
            console.log(`Input changed: ${id} = ${this.value}`);
            
            // Update display values for sliders
            if (id === 'primaryHue') {
                const hueValueElement = document.getElementById('hueValue');
                if (hueValueElement) {
                    hueValueElement.textContent = this.value;
                }
                // If primaryDegree exists, update it
                const primaryDegreeElement = document.getElementById('primaryDegree');
                if (primaryDegreeElement) {
                    primaryDegreeElement.textContent = this.value + '°';
                
                    // Update color wheel markers if they exist
                    const colorSchemeElement = document.getElementById('colorScheme');
                    if (colorSchemeElement) {
                        const accentHue = calculateAccentHue(
                            parseInt(this.value), 
                            colorSchemeElement.value
                        );
                        
                        const accentDegreeElement = document.getElementById('accentDegree');
                        if (accentDegreeElement) {
                            accentDegreeElement.textContent = accentHue + '°';
                        }
                        
                        if (typeof updateColorWheel === 'function') {
                            updateColorWheel(parseInt(this.value), accentHue);
                        }
                    }
                }
            }
            else if (id === 'saturation') {
                const saturationValueElement = document.getElementById('saturationValue');
                if (saturationValueElement) {
                    saturationValueElement.textContent = this.value;
                }
            }
            else if (id === 'luminosity') {
                const luminosityValueElement = document.getElementById('luminosityValue');
                if (luminosityValueElement) {
                    luminosityValueElement.textContent = this.value;
                }
            }
            else if (id === 'isDark') {
                console.log(`isDark select changed to: ${this.value}`);
                
                // Sync mode buttons with isDark select
                const newMode = this.value === 'true' ? 'dark' : 'light';
                currentPreviewMode = newMode;
                
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    const isActive = btn.textContent.toLowerCase() === newMode;
                    btn.classList.toggle('active', isActive);
                    console.log(`Button "${btn.textContent}" active: ${isActive}`);
                });
                
                // Handle semantic demo visibility
                const semanticDemo = document.getElementById('semanticDemo');
                const semanticDemoParent = semanticDemo ? semanticDemo.parentElement : null;
                
                if (newMode === 'dark') {
                    if (semanticDemoParent && semanticDemoParent.classList.contains('control-panel')) {
                        semanticDemoParent.style.display = 'none';
                        console.log('Hiding semantic demo control panel via isDark select');
                    } else if (semanticDemo) {
                        semanticDemo.style.display = 'none';
                        console.log('Hiding semantic demo div via isDark select');
                    }
                } else {
                    if (semanticDemoParent && semanticDemoParent.classList.contains('control-panel')) {
                        semanticDemoParent.style.display = 'block';
                        console.log('Showing semantic demo control panel via isDark select');
                    } else if (semanticDemo) {
                        semanticDemo.style.display = 'block';
                        console.log('Showing semantic demo div via isDark select');
                    }
                }
            }
            
            // Update theme in real-time - apply to entire page
            console.log('Calling generateAndApplyTheme()');
            generateAndApplyTheme();
        });
    });
}

// Calculate accent hue based on color scheme
function calculateAccentHue(primaryHue, colorScheme) {
    switch(colorScheme) {
        case 'complementary':
            return (primaryHue + 180) % 360;
        case 'triadic':
            return (primaryHue + 120) % 360;
        case 'analogous':
            return (primaryHue + 30) % 360;
        case 'splitComplementary':
            return (primaryHue + 150) % 360;
        case 'tetradic':
            return (primaryHue + 90) % 360;
        case 'monochromatic':
            return primaryHue; // Same hue, different saturation/lightness
        default:
            return (primaryHue + 180) % 360;
    }
}

// Save theme to localStorage
function saveTheme() {
    const config = {
        name: document.getElementById('themeName').value,
        primaryHue: parseInt(document.getElementById('primaryHue').value),
        colorScheme: document.getElementById('colorScheme').value,
        saturation: parseInt(document.getElementById('saturation').value),
        luminosity: parseInt(document.getElementById('luminosity').value),
        isDark: document.getElementById('isDark').value === 'true'
    };
    
    // Generate theme
    const theme = generateTheme(config);
    
    // Save to localStorage
    const savedThemes = JSON.parse(localStorage.getItem('savedThemes') || '[]');
    savedThemes.push({
        name: config.name,
        config: config,
        colors: theme.colors
    });
    localStorage.setItem('savedThemes', JSON.stringify(savedThemes));
    
    alert(`Theme "${config.name}" saved successfully!`);
}

// Update color wheel markers
function updateColorWheel(primaryHue, accentHue) {
    // Position primary marker
    const primaryMarker = document.getElementById('primaryMarker');
    const primaryAngle = primaryHue * Math.PI / 180;
    const primaryRadius = 40; // Slightly less than the 50px radius of the wheel
    const primaryX = 50 + Math.cos(primaryAngle) * primaryRadius;
    const primaryY = 50 + Math.sin(primaryAngle) * primaryRadius;
    primaryMarker.style.left = `${primaryX}px`;
    primaryMarker.style.top = `${primaryY}px`;
    
    // Position accent marker
    const accentMarker = document.getElementById('accentMarker');
    const accentAngle = accentHue * Math.PI / 180;
    const accentRadius = 40; // Same radius as primary
    const accentX = 50 + Math.cos(accentAngle) * accentRadius;
    const accentY = 50 + Math.sin(accentAngle) * accentRadius;
    accentMarker.style.left = `${accentX}px`;
    accentMarker.style.top = `${accentY}px`;
}

// Generate CSS output
function generateCSS(theme) {
    const cssOutput = document.getElementById('cssOutput');
    
    // Generate CSS variables
    const cssVars = `/* ${theme.name} */
:root {
    /* Primary Colors */
    --primary: ${theme.colors.primary};
    --primary-light: ${theme.colors.primaryLight};
    --primary-dark: ${theme.colors.primaryDark};
    
    /* Accent Colors */
    --accent: ${theme.colors.accent};
    --accent-light: ${theme.colors.accentLight};
    --accent-dark: ${theme.colors.accentDark};
    
    /* Backgrounds */
    --background: ${theme.colors.background};
    --surface: ${theme.colors.surface};
    
    /* Text Colors */
    --text-primary: ${theme.colors.textPrimary};
    --text-secondary: ${theme.colors.textSecondary};
    
    /* Border */
    --border: ${theme.colors.border};
}`;
    
    cssOutput.textContent = cssVars;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initDraggable();
    setupLiveUpdates();
    setupFloatingControls();
    generateAndApplyTheme();
    
    // Check initial mode and hide semantic demo if dark mode is active
    const semanticDemo = document.getElementById('semanticDemo');
    if (semanticDemo && currentPreviewMode === 'dark') {
        semanticDemo.style.display = 'none';
    }
});

// Setup floating controls
function setupFloatingControls() {
    // We've moved the main controls to the floating panel
    // No need to sync between different sets of controls anymore
}

// Generate color swatches
function generateSwatches(theme) {
    const swatchesContainer = document.getElementById('colorSwatches');
    swatchesContainer.innerHTML = '';
    
    // Primary hue palette at different saturations and lightness levels
    const hue = parseInt(document.getElementById('primaryHue').value);
    const primaryHueVariations = [];
    
    // Generate a comprehensive palette of the primary hue
    // Show variations with different saturations (20-100%) and lightness levels (20-80%)
    for (let s = 100; s >= 20; s -= 20) {
        for (let l = 20; l <= 80; l += 15) {
            primaryHueVariations.push({
                name: `Hue ${hue}° S:${s}% L:${l}%`,
                color: `hsl(${hue}, ${s}%, ${l}%)`
            });
        }
    }
    
    // Standard theme colors
    const colors = [
        { name: 'Primary', color: theme.colors.primary, isMain: true },
        { name: 'Primary Light', color: theme.colors.primaryLight, isMain: true },
        { name: 'Primary Dark', color: theme.colors.primaryDark, isMain: true },
        { name: 'Accent', color: theme.colors.accent, isMain: true },
        { name: 'Accent Light', color: theme.colors.accentLight, isMain: true },
        { name: 'Accent Dark', color: theme.colors.accentDark, isMain: true },
        { name: 'Background', color: theme.colors.background, isMain: true },
        { name: 'Surface', color: theme.colors.surface, isMain: true },
        { name: 'Text Primary', color: theme.colors.textPrimary, isMain: true },
        { name: 'Text Secondary', color: theme.colors.textSecondary, isMain: true },
        { name: 'Border', color: theme.colors.border, isMain: true },
        ...primaryHueVariations
    ];
    
    // Create a "Standard Colors" section first
    const standardSection = document.createElement('div');
    standardSection.className = 'swatch-section';
    standardSection.innerHTML = '<h3>Theme Colors</h3>';
    swatchesContainer.appendChild(standardSection);
    
    // Add standard colors
    colors.filter(item => item.isMain).forEach(item => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch main-swatch';
        
        // Color display
        const colorDisplay = document.createElement('div');
        colorDisplay.className = 'color-display';
        colorDisplay.style.backgroundColor = item.color;
        
        // Color name
        const label = document.createElement('div');
        label.className = 'color-name';
        label.textContent = item.name;
        
        // Color value
        const value = document.createElement('div');
        value.className = 'color-value';
        value.textContent = item.color;
        
        // Append elements
        swatch.appendChild(colorDisplay);
        swatch.appendChild(label);
        swatch.appendChild(value);
        
        // Add click-to-copy functionality
        swatch.addEventListener('click', () => {
            navigator.clipboard.writeText(item.color).then(() => {
                // Show temporary feedback
                const originalText = value.textContent;
                value.textContent = 'Copied!';
                value.style.color = '#28a745';
                setTimeout(() => {
                    value.textContent = originalText;
                    value.style.color = '#666';
                }, 1000);
            }).catch(err => {
                console.log('Failed to copy: ', err);
            });
        });
        
        // Add to container
        standardSection.appendChild(swatch);
    });

    // Create a "Hue Palette" section for all the variations
    const paletteSection = document.createElement('div');
    paletteSection.className = 'swatch-section';
    paletteSection.innerHTML = '<h3>Primary Hue Palette</h3>';
    swatchesContainer.appendChild(paletteSection);
    
    // Add swatch grid container for the palette
    const paletteGrid = document.createElement('div');
    paletteGrid.className = 'swatch-grid';
    paletteSection.appendChild(paletteGrid);
    
    // Add hue variations
    primaryHueVariations.forEach(item => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch hue-variation';
        
        // Color display
        const colorDisplay = document.createElement('div');
        colorDisplay.className = 'color-display';
        colorDisplay.style.backgroundColor = item.color;
        
        // Color value (simplified for palette)
        const value = document.createElement('div');
        value.className = 'color-value small';
        value.textContent = item.color;
        
        // Append elements
        swatch.appendChild(colorDisplay);
        swatch.appendChild(value);
        
        // Add click-to-copy functionality
        swatch.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent double handling
            navigator.clipboard.writeText(item.color).then(() => {
                // Show temporary feedback
                const originalText = value.textContent;
                value.textContent = 'Copied!';
                value.style.color = '#28a745';
                setTimeout(() => {
                    value.textContent = originalText;
                    value.style.color = '#666';
                }, 1000);
            }).catch(err => {
                console.log('Failed to copy: ', err);
            });
        });
        
        // Make swatch clickable to apply this color as primary
        swatch.addEventListener('dblclick', () => {
            const hueMatch = item.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
            if (hueMatch) {
                document.getElementById('primaryHue').value = hueMatch[1];
                document.getElementById('saturation').value = hueMatch[2];
                document.getElementById('luminosity').value = hueMatch[3];
                generateAndApplyTheme();
            }
        });
        
        // Add to palette grid
        paletteGrid.appendChild(swatch);
    });
}

// Apply theme to whole page body
function applyThemeToBody(theme) {
    console.log('Applying theme to document root:', theme.colors);
    
    // Apply CSS variables to document root only (will inherit to all elements)
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--primary-light', theme.colors.primaryLight);
    root.style.setProperty('--primary-dark', theme.colors.primaryDark);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--accent-light', theme.colors.accentLight);
    root.style.setProperty('--accent-dark', theme.colors.accentDark);
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--surface', theme.colors.surface);
    root.style.setProperty('--text-primary', theme.colors.textPrimary);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--border', theme.colors.border);
    
    // Set body background and color to match theme (visual properties only)
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.textPrimary;
}

// Main function to generate and apply theme
function generateAndApplyTheme() {
    console.log('generateAndApplyTheme() called');
    
    const themeNameElement = document.getElementById('themeName');
    const primaryHueElement = document.getElementById('primaryHue');
    const colorSchemeElement = document.getElementById('colorScheme');
    const saturationElement = document.getElementById('saturation');
    const luminosityElement = document.getElementById('luminosity');
    const isDarkElement = document.getElementById('isDark');
    
    if (!primaryHueElement || !colorSchemeElement || !saturationElement || !luminosityElement || !isDarkElement) {
        console.error('Missing required elements for theme generation');
        return;
    }
    
    const config = {
        name: themeNameElement ? themeNameElement.value : 'Custom Theme',
        primaryHue: parseInt(primaryHueElement.value),
        colorScheme: colorSchemeElement.value,
        saturation: parseInt(saturationElement.value),
        luminosity: parseInt(luminosityElement.value),
        isDark: isDarkElement.value === 'true'
    };
    
    console.log('Theme config:', config);
    
    // Generate theme based on config (not currentPreviewMode)
    const theme = generateTheme(config);
    
    console.log('Generated theme:', theme);
    
    // Apply to document root first (establishes global CSS variables)
    applyThemeToBody(theme);
    
    // Apply additional specific styling to semantic demo if needed
    // (In this case, it inherits from root, so this is optional)
    applyThemeToSemanticDemo(theme);
    
    // Generate swatches
    generateSwatches(theme);
    
    // Generate CSS
    generateCSS(theme);
    
    // Update floating preview configuration
    updateFloatingPreview();
    
    console.log('Theme applied successfully');
}
