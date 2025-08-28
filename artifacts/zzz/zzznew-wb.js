// State management
let isEditMode = false;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let isMinimized = false;
let currentPage = 'home';
let colorBarState = {
    hue: 0,
    saturation: 70,
    lightness: 50
};

// DOM Elements (will be initialized after DOM loads)
let body, controlPanel, controlPanelBody, minimizeBtn, editModeToggle, layoutSelect, themeSelect, colorModeSelect, primaryColorPicker, secondaryColorPicker, accentColorPicker, applyColorsBtn, resetColorsBtn, footerPositionSelect, exportBtn, saveTemplateBtn, resetBtn, colorBarSlider, lightnessSlider, saturationSlider;

// Initialize DOM elements
function initializeElements() {
    body = document.body;
    controlPanel = document.getElementById('control-panel');
    controlPanelBody = controlPanel.querySelector('.control-panel-body');
    minimizeBtn = document.getElementById('minimize-btn');
    editModeToggle = document.getElementById('edit-mode-toggle');
    layoutSelect = document.getElementById('layout-select');
    themeSelect = document.getElementById('theme-select');
    colorModeSelect = document.getElementById('color-mode-select');
    primaryColorPicker = document.getElementById('primary-color');
    secondaryColorPicker = document.getElementById('secondary-color');
    accentColorPicker = document.getElementById('accent-color');
    applyColorsBtn = document.getElementById('apply-colors');
    resetColorsBtn = document.getElementById('reset-colors');
    footerPositionSelect = document.getElementById('footer-position-select');
    exportBtn = document.getElementById('export-btn');
    saveTemplateBtn = document.getElementById('save-template-btn');
    resetBtn = document.getElementById('reset-btn');    colorBarSlider = document.getElementById('color-bar');
    lightnessSlider = document.getElementById('lightness-slider');
    saturationSlider = document.getElementById('saturation-slider');
}

// Initialize
function init() {
    console.log('Initializing website builder...');
    initializeElements();
    setupControlPanel();
    setupEditMode();
    setupLayoutControl();
    setupThemeControl();
    setupColorModeControl();
    setupColorControls();
    setupColorBarControl();
    setupFooterPositionControl();
    setupButtonActions();
    setupMediaPlaceholders();
    setupDynamicPagesNavigation();
    loadSavedState();
}

// Control Panel Setup
function setupControlPanel() {
    const header = controlPanel.querySelector('.control-panel-header');
    
    // Dragging
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        const rect = controlPanel.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        controlPanel.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            controlPanel.style.left = `${x}px`;
            controlPanel.style.top = `${y}px`;
            controlPanel.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        controlPanel.classList.remove('dragging');
    });

    // Minimize/Expand
    minimizeBtn.addEventListener('click', () => {
        isMinimized = !isMinimized;
        controlPanel.classList.toggle('minimized', isMinimized);
        minimizeBtn.textContent = isMinimized ? '+' : '−';
        minimizeBtn.title = isMinimized ? 'Expand' : 'Minimize';
    });
}

// Edit Mode Setup
function setupEditMode() {
    editModeToggle.addEventListener('click', () => {
        isEditMode = !isEditMode;
        body.classList.toggle('edit-mode', isEditMode);
        editModeToggle.classList.toggle('active', isEditMode);
        editModeToggle.textContent = isEditMode ? 'Exit Edit' : 'Edit Mode';
        
        // Toggle contenteditable on all editable elements
        const editables = document.querySelectorAll('.editable');
        editables.forEach(el => {
            el.contentEditable = isEditMode;
        });
        
        // Properly handle media placeholders
        const mediaPlaceholders = document.querySelectorAll('.media-placeholder');
        mediaPlaceholders.forEach(placeholder => {
            if (!isEditMode && !placeholder.classList.contains('has-media')) {
                // Hide all placeholders without images when exiting edit mode
                placeholder.style.display = 'none';
            } else if (isEditMode) {
                // Show all placeholders when entering edit mode
                placeholder.style.display = 'flex';
            }
        });
    });
}

// Layout Control
function setupLayoutControl() {
    layoutSelect.addEventListener('change', (e) => {
        body.setAttribute('data-layout', e.target.value);
        console.log('Layout changed to:', e.target.value);
        saveState();
    });
}

// Theme Control
function setupThemeControl() {
    themeSelect.addEventListener('change', (e) => {
        body.setAttribute('data-theme', e.target.value);
        console.log('Theme changed to:', e.target.value);
        // Update color bar preview when theme changes
        updateColorBarPreview();
        saveState();
    });
}

// Color Mode Control (Light/Dark)
function setupColorModeControl() {
    colorModeSelect.addEventListener('change', (e) => {
        const mode = e.target.value;
        body.setAttribute('data-mode', mode);
        console.log('Color mode changed to:', mode);
        
        // Update document theme to apply light/dark mode properly
        document.documentElement.setAttribute('data-mode', mode);
        
        // Update color pickers based on theme and mode
        updateColorPickersFromTheme();
        // Update color bar preview when color mode changes
        updateColorBarPreview();
        // Apply theme colors after mode change to ensure consistency
        applyThemeColorsFromColorBar(false);
        saveState();
    });
}

// Color Controls
function setupColorControls() {
    // Initialize color pickers with current theme values
    updateColorPickersFromTheme();
    
    // Update color value display when picker changes
    primaryColorPicker.addEventListener('input', (e) => {
        const valueDisplay = primaryColorPicker.nextElementSibling;
        valueDisplay.textContent = e.target.value.toUpperCase();
    });
    
    secondaryColorPicker.addEventListener('input', (e) => {
        const valueDisplay = secondaryColorPicker.nextElementSibling;
        valueDisplay.textContent = e.target.value.toUpperCase();
    });
    
    accentColorPicker.addEventListener('input', (e) => {
        const valueDisplay = accentColorPicker.nextElementSibling;
        valueDisplay.textContent = e.target.value.toUpperCase();
    });
    
    // Apply button - apply custom colors to the site
    applyColorsBtn.addEventListener('click', () => {
        applyCustomColors();
        saveState();
    });
    
    // Reset button - revert to theme defaults
    resetColorsBtn.addEventListener('click', () => {
        updateColorPickersFromTheme();
        // Reset to theme values (removes custom colors)
        document.documentElement.style.removeProperty('--primary');
        document.documentElement.style.removeProperty('--secondary');
        document.documentElement.style.removeProperty('--accent');
        saveState();
    });
}

// Helper to update color pickers based on current theme
function updateColorPickersFromTheme() {
    // Get computed style to get actual color values
    const computedStyle = getComputedStyle(document.documentElement);
    
    // Extract colors
    const primaryColor = computedStyle.getPropertyValue('--primary').trim();
    const secondaryColor = computedStyle.getPropertyValue('--secondary').trim();
    const accentColor = computedStyle.getPropertyValue('--accent').trim();
    
    // Convert to hex if needed and update pickers
    primaryColorPicker.value = rgbToHex(primaryColor);
    secondaryColorPicker.value = rgbToHex(secondaryColor);
    accentColorPicker.value = rgbToHex(accentColor);
    
    // Update value displays
    primaryColorPicker.nextElementSibling.textContent = primaryColorPicker.value.toUpperCase();
    secondaryColorPicker.nextElementSibling.textContent = secondaryColorPicker.value.toUpperCase();
    accentColorPicker.nextElementSibling.textContent = accentColorPicker.value.toUpperCase();
}

// Helper to apply custom colors
function applyCustomColors() {
    // Apply custom colors directly to root
    document.documentElement.style.setProperty('--primary', primaryColorPicker.value);
    document.documentElement.style.setProperty('--secondary', secondaryColorPicker.value);
    document.documentElement.style.setProperty('--accent', accentColorPicker.value);
    
    // Also calculate and set related colors
    const primaryRGB = hexToRgb(primaryColorPicker.value);
    if (primaryRGB) {
        // Set light and dark variants
        document.documentElement.style.setProperty(
            '--primary-light', 
            `rgb(${Math.min(primaryRGB.r + 50, 255)}, ${Math.min(primaryRGB.g + 50, 255)}, ${Math.min(primaryRGB.b + 50, 255)})`
        );
        document.documentElement.style.setProperty(
            '--primary-dark', 
            `rgb(${Math.max(primaryRGB.r - 50, 0)}, ${Math.max(primaryRGB.g - 50, 0)}, ${Math.max(primaryRGB.b - 50, 0)})`
        );
    }
}

// Helper to convert RGB to hex
function rgbToHex(rgb) {
    if (!rgb || rgb === 'initial' || rgb === 'inherit' || rgb === 'unset') {
        return '#6366f1'; // Default primary color
    }
    
    // If it's already a hex value
    if (rgb.startsWith('#')) {
        return rgb;
    }
    
    // Extract RGB values
    const rgbMatch = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    return '#6366f1'; // Default primary color
}

// Helper to convert hex to RGB object
function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Helper to convert HSL to RGB
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// Helper to convert RGB to Hex
function rgbToHexString(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Color Bar Control
function setupColorBarControl() {
    // Set initial slider values
    colorBarSlider.value = colorBarState.hue;
    saturationSlider.value = colorBarState.saturation;
    lightnessSlider.value = colorBarState.lightness;
    
    // Initialize preview color and saturation slider gradient
    updateColorBarPreview();
    updateSaturationSliderGradient();
    
    // Update color preview when any slider moves
    colorBarSlider.addEventListener('input', function() {
        colorBarState.hue = parseInt(colorBarSlider.value);
        updateColorBarPreview();
        updateSaturationSliderGradient();
        applyThemeColorsFromColorBar();
    });
    
    lightnessSlider.addEventListener('input', function() {
        colorBarState.lightness = parseInt(lightnessSlider.value);
        updateColorBarPreview();
        applyThemeColorsFromColorBar();
    });
    
    saturationSlider.addEventListener('input', function() {
        colorBarState.saturation = parseInt(saturationSlider.value);
        updateColorBarPreview();
        applyThemeColorsFromColorBar();
    });
    
    // Update the theme colors when color mode changes
    colorModeSelect.addEventListener('change', function() {
        updateColorBarPreview();
        updateSaturationSliderGradient();
        applyThemeColorsFromColorBar();
    });
    
    // Update sliders when theme changes
    themeSelect.addEventListener('change', function() {
        const theme = themeSelect.value;
        
        // Set sliders based on theme selection
        switch(theme) {
            case 'cyberpunk':
                colorBarState.hue = 180; // Cyan
                colorBarState.saturation = 90;
                colorBarState.lightness = 50;
                break;
            case 'ocean':
                colorBarState.hue = 195; // Blue
                colorBarState.saturation = 60;
                colorBarState.lightness = 55;
                break;
            case 'sunset':
                colorBarState.hue = 25; // Orange
                colorBarState.saturation = 80;
                colorBarState.lightness = 50;
                break;
            case 'forest':
                colorBarState.hue = 140; // Green
                colorBarState.saturation = 60;
                colorBarState.lightness = 45;
                break;
            case 'dark':
                colorBarState.hue = 230; // Indigo
                colorBarState.saturation = 70;
                colorBarState.lightness = 60;
                break;
            case 'light':
            default:
                colorBarState.hue = 230; // Indigo
                colorBarState.saturation = 70;
                colorBarState.lightness = 50;
        }
        
        // Update slider UI
        colorBarSlider.value = colorBarState.hue;
        saturationSlider.value = colorBarState.saturation;
        lightnessSlider.value = colorBarState.lightness;
        
        updateColorBarPreview();
        updateSaturationSliderGradient();
    });
}

// Apply theme colors based on color bar settings
function applyThemeColorsFromColorBar(saveChanges = true) {
    const { hue, saturation, lightness } = colorBarState;
    
    // Generate colors from HSL values
    const primaryRgb = hslToRgb(hue, saturation, lightness);
    const primaryHex = rgbToHexString(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    
    // Generate complementary colors
    const secondaryHue = (hue + 30) % 360;
    const accentHue = (hue + 180) % 360;
    
    const secondaryRgb = hslToRgb(secondaryHue, Math.max(30, saturation - 10), lightness);
    const accentRgb = hslToRgb(accentHue, Math.min(100, saturation + 10), lightness);
    
    const secondaryHex = rgbToHexString(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
    const accentHex = rgbToHexString(accentRgb.r, accentRgb.g, accentRgb.b);
    
    // Update color pickers
    primaryColorPicker.value = primaryHex;
    primaryColorPicker.nextElementSibling.textContent = primaryHex.toUpperCase();
    
    secondaryColorPicker.value = secondaryHex;
    secondaryColorPicker.nextElementSibling.textContent = secondaryHex.toUpperCase();
    
    accentColorPicker.value = accentHex;
    accentColorPicker.nextElementSibling.textContent = accentHex.toUpperCase();
    
    // Apply the colors
    document.documentElement.style.setProperty('--primary', primaryHex);
    document.documentElement.style.setProperty('--secondary', secondaryHex);
    document.documentElement.style.setProperty('--accent', accentHex);
    
    // Also calculate and set related colors
    document.documentElement.style.setProperty(
        '--primary-light', 
        `hsl(${hue}, ${saturation}%, ${Math.min(lightness + 15, 90)}%)`
    );
    document.documentElement.style.setProperty(
        '--primary-dark', 
        `hsl(${hue}, ${saturation}%, ${Math.max(lightness - 15, 10)}%)`
    );
    
    // Save state if needed
    if (saveChanges) {
        saveState();
    }
}

// Helper to update color bar appearance based on current slider values
function updateColorBarPreview() {
    const { hue, saturation, lightness } = colorBarState;
    const colorValue = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Apply color to the wrapper element which serves as the visual background
    colorBarSlider.style.opacity = "0.85"; // Allow hue visibility through semi-transparent slider
    colorBarSlider.parentNode.style.backgroundColor = colorValue;
    
    // Set the slider background for consistent appearance on all browsers
    colorBarSlider.style.backgroundColor = "transparent";
}

// Helper to update saturation slider gradient based on current hue
function updateSaturationSliderGradient() {
    const hue = colorBarState.hue;
    const lightness = colorBarState.lightness;
    saturationSlider.style.background = `linear-gradient(to right, 
        hsl(${hue}, 0%, ${lightness}%), 
        hsl(${hue}, 50%, ${lightness}%), 
        hsl(${hue}, 100%, ${lightness}%)
    )`;
}

// Footer Position Control
function setupFooterPositionControl() {
    footerPositionSelect.addEventListener('change', (e) => {
        body.setAttribute('data-footer', e.target.value);
        console.log('Footer position changed to:', e.target.value);
        saveState();
    });
}

// Button Actions
function setupButtonActions() {
    // Export HTML
    exportBtn.addEventListener('click', () => {
        // Clone the document
        const clone = document.documentElement.cloneNode(true);
        
        // Remove control panel from export
        const panel = clone.querySelector('.control-panel');
        if (panel) panel.remove();
        
        // Remove script tag
        const scripts = clone.querySelectorAll('script');
        scripts.forEach(script => script.remove());
        
        // Clean up body attributes
        const cloneBody = clone.querySelector('body');
        cloneBody.classList.remove('edit-mode');
        
        // Make editables non-editable
        clone.querySelectorAll('.editable').forEach(el => {
            el.removeAttribute('contenteditable');
        });
        
        // Get the current styles
        const styles = document.querySelector('link[rel="stylesheet"]');
        if (styles) {
            // Replace external CSS link with inline styles
            const styleLink = clone.querySelector('link[rel="stylesheet"]');
            if (styleLink) {
                styleLink.remove();
            }
            
            // Add inline style tag with all CSS
            const styleTag = document.createElement('style');
            // Get all stylesheets
            const allStyles = Array.from(document.styleSheets)
                .map(sheet => {
                    try {
                        return Array.from(sheet.cssRules)
                            .map(rule => rule.cssText)
                            .join('\n');
                    } catch (e) {
                        console.warn('Could not access stylesheet:', e);
                        return '';
                    }
                })
                .join('\n');
            
            // If we couldn't get styles from stylesheets, include a basic style
            styleTag.textContent = allStyles || getBasicExportStyles();
            clone.querySelector('head').appendChild(styleTag);
        }
        
        // Create download
        const html = '<!DOCTYPE html>\n' + clone.outerHTML;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website.html';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Save Template
    saveTemplateBtn.addEventListener('click', () => {
        saveState();
        alert('Template saved successfully!');
    });

    // Reset Content
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all content to defaults?')) {
            localStorage.removeItem('websiteBuilderState');
            location.reload();
        }
    });
}

// Media Placeholders
function setupMediaPlaceholders() {
    document.querySelectorAll('.media-placeholder').forEach(placeholder => {
        // Check if placeholder already has an image
        if (placeholder.style.backgroundImage && placeholder.style.backgroundImage !== 'none' && 
            placeholder.style.backgroundImage !== '') {
            placeholder.classList.add('has-media');
            const span = placeholder.querySelector('span');
            if (span) span.style.display = 'none';
        }
        
        // Initialize visibility based on edit mode and has-media class
        if (!isEditMode && !placeholder.classList.contains('has-media')) {
            placeholder.style.display = 'none';
        } else {
            placeholder.style.display = 'flex';
        }
        
        // Add caption element if it doesn't exist
        if (!placeholder.querySelector('.media-caption')) {
            const captionEl = document.createElement('div');
            captionEl.className = 'media-caption editable';
            captionEl.contentEditable = isEditMode;
            captionEl.textContent = 'Add caption here';
            placeholder.appendChild(captionEl);
            
            // Add event listeners for caption editing
            captionEl.addEventListener('focus', () => {
                if (captionEl.textContent === 'Add caption here') {
                    captionEl.textContent = '';
                }
            });
            
            captionEl.addEventListener('blur', () => {
                if (captionEl.textContent.trim() === '') {
                    captionEl.textContent = 'Add caption here';
                    placeholder.classList.remove('has-caption');
                } else {
                    placeholder.classList.add('has-caption');
                }
                saveState();
            });
            
            // If previously saved caption exists, show it
            if (placeholder.dataset.caption) {
                captionEl.textContent = placeholder.dataset.caption;
                placeholder.classList.add('has-caption');
            }
        }
        
        placeholder.addEventListener('click', (e) => {
            // Don't trigger file upload if clicking on caption
            if (e.target.classList.contains('media-caption')) {
                return;
            }
            
            if (!isEditMode) return;
            
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        placeholder.style.backgroundImage = `url(${e.target.result})`;
                        placeholder.style.backgroundSize = 'cover';
                        placeholder.style.backgroundPosition = 'center';
                        const span = placeholder.querySelector('span');
                        if (span) span.style.display = 'none';
                        placeholder.classList.add('has-media');
                        
                        // After adding image, prompt for caption
                        const captionEl = placeholder.querySelector('.media-caption');
                        if (captionEl && captionEl.textContent === 'Add caption here') {
                            setTimeout(() => {
                                captionEl.focus();
                            }, 500);
                        }
                        
                        saveState();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            input.click();
        });
        
        // Add right-click handler to remove images in edit mode
        placeholder.addEventListener('contextmenu', (e) => {
            if (!isEditMode) return;
            
            e.preventDefault(); // Prevent default context menu
            
            if (placeholder.classList.contains('has-media')) {
                const confirmRemove = confirm('Do you want to remove this image?');
                
                if (confirmRemove) {
                    placeholder.style.backgroundImage = '';
                    placeholder.classList.remove('has-media');
                    
                    // Reset placeholder appearance
                    const span = placeholder.querySelector('span');
                    if (span) span.style.display = '';
                    
                    // Hide placeholder if not in edit mode
                    if (!isEditMode) {
                        placeholder.style.display = 'none';
                    }
                    
                    saveState();
                }
            }
        });
    });
}

// Dynamic Page Creation and Navigation
function setupDynamicPagesNavigation() {
    console.log('Setting up dynamic pages navigation');
    
    // Event delegation for all navigation links
    document.addEventListener('click', function(event) {
        const link = event.target.closest('a');
        if (link && link.href && link.href.includes('#')) {
            console.log('Link clicked:', link.href);
            event.preventDefault();
            
            const pageName = link.href.split('#').pop();
            console.log('Page name:', pageName);
            
            // Special case for home or empty hash
            if (pageName === '' || pageName === 'home') {
                console.log('Showing home page');
                showHomePage();
                window.location.hash = 'home';
                return;
            }
            
            // Check if we're already on this page
            if (window.location.hash === `#${pageName}`) {
                console.log('Already on page:', pageName);
                return;
            }
            
            // Check if a div with this ID already exists
            let pageExists = document.getElementById(`page-${pageName}`);
            console.log('Page exists?', pageExists ? 'Yes' : 'No');
            
            if (!pageExists) {
                console.log('Creating new page:', pageName);
                createNewPage(pageName);
            } else {
                console.log('Showing existing page:', pageName);
                showPage(pageName);
            }
            
            window.location.hash = pageName;
        }
    });
    
    // Handle hash changes (browser back/forward buttons)
    window.addEventListener('hashchange', handleHashNavigation);
    
    // Handle initial page load
    function handleHashNavigation() {
        const hash = window.location.hash.substring(1);
        
        if (hash && hash !== 'home') {
            console.log('Hash navigation to:', hash);
            const pageExists = document.getElementById(`page-${hash}`);
            
            if (!pageExists) {
                createNewPage(hash);
            } else {
                showPage(hash);
            }
        } else {
            showHomePage();
        }
    }
    
    // Call initially with a short delay to ensure DOM is fully loaded
    setTimeout(handleHashNavigation, 100);
}

function createNewPage(pageName) {
    // Get reference to main content
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content element not found!');
        return;
    }

    // Hide all existing pages
    const existingPages = mainContent.querySelectorAll('.page-content');
    existingPages.forEach(page => {
        page.style.display = 'none';
    });

    // Hide the default home content
    const homeContent = mainContent.querySelector('#site-header');
    const heroSection = mainContent.querySelector('#hero-section');
    const featuresSection = mainContent.querySelector('#features-section');
    const gallerySection = mainContent.querySelector('#gallery-section');
    const aboutSection = mainContent.querySelector('#about-section');
    
    if (homeContent && !homeContent.closest('.page-content')) homeContent.style.display = 'none';
    if (heroSection && !heroSection.closest('.page-content')) heroSection.style.display = 'none';
    if (featuresSection && !featuresSection.closest('.page-content')) featuresSection.style.display = 'none';
    if (gallerySection && !gallerySection.closest('.page-content')) gallerySection.style.display = 'none';
    if (aboutSection && !aboutSection.closest('.page-content')) aboutSection.style.display = 'none';
      // Hide the footer when creating new pages
    const footer = document.getElementById('site-footer');
    if (footer) {
        footer.style.display = 'none';
        console.log('Hiding footer for new page');
    }

    // Create new page
    const newPage = document.createElement('div');
    newPage.id = `page-${pageName}`;
    newPage.className = 'page-content';
    newPage.style.display = 'block'; // Make sure it's visible
    
    // Add header and main area to new page
    newPage.innerHTML = `
        <!-- Header -->
        <header class="site-header">
            <h1 class="site-title editable" contenteditable="${isEditMode}">${pageName.charAt(0).toUpperCase() + pageName.slice(1)}</h1>
            <p class="site-subtitle editable" contenteditable="${isEditMode}">Add your content here</p>
        </header>

        <section class="content-section">
            <h2 class="section-title editable" contenteditable="${isEditMode}">About ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}</h2>
            <div class="content-card">
                <p class="card-description editable" contenteditable="${isEditMode}">This is a new page for ${pageName}. Edit this content in edit mode.</p>
            </div>
        </section>
    `;
    
    mainContent.appendChild(newPage);
    currentPage = pageName;
    console.log(`Created new page: ${pageName}`);
    saveState();
}

function showHomePage() {
    // Get reference to main content
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Hide all dynamic pages
    const allPages = mainContent.querySelectorAll('.page-content');
    allPages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Show the default home content
    const homeContent = mainContent.querySelector('#site-header');
    const heroSection = mainContent.querySelector('#hero-section');
    const featuresSection = mainContent.querySelector('#features-section');
    const gallerySection = mainContent.querySelector('#gallery-section');
    const aboutSection = mainContent.querySelector('#about-section');
    
    if (homeContent && !homeContent.closest('.page-content')) homeContent.style.display = 'block';
    if (heroSection && !heroSection.closest('.page-content')) heroSection.style.display = 'block';
    if (featuresSection && !featuresSection.closest('.page-content')) featuresSection.style.display = 'block';
    if (gallerySection && !gallerySection.closest('.page-content')) gallerySection.style.display = 'block';
    if (aboutSection && !aboutSection.closest('.page-content')) aboutSection.style.display = 'block';
    
    // Show the footer when returning to home page
    const footer = document.getElementById('site-footer');
    if (footer) {
        footer.style.display = 'block';
        console.log('Showing footer for home page');
    }
    
    currentPage = 'home';
    console.log('Showing home page');
}

function showPage(pageName) {
    // Get reference to main content
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content element not found!');
        return;
    }

    // Hide all pages
    const allPages = mainContent.querySelectorAll('.page-content');
    allPages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Hide the default home content too
    const homeContent = mainContent.querySelector('#site-header');
    const heroSection = mainContent.querySelector('#hero-section');
    const featuresSection = mainContent.querySelector('#features-section');
    const gallerySection = mainContent.querySelector('#gallery-section');
    const aboutSection = mainContent.querySelector('#about-section');
    
    if (homeContent && !homeContent.closest('.page-content')) homeContent.style.display = 'none';
    if (heroSection && !heroSection.closest('.page-content')) heroSection.style.display = 'none';
    if (featuresSection && !featuresSection.closest('.page-content')) featuresSection.style.display = 'none';
    if (gallerySection && !gallerySection.closest('.page-content')) gallerySection.style.display = 'none';
    if (aboutSection && !aboutSection.closest('.page-content')) aboutSection.style.display = 'none';
    
    // Hide the footer when showing dynamic pages
    const footer = document.getElementById('site-footer');
    if (footer) {
        footer.style.display = 'none';
        console.log('Hiding footer for dynamic page');
    }
    
    // Show the requested page
    const pageToShow = document.getElementById(`page-${pageName}`);
    if (pageToShow) {
        pageToShow.style.display = 'block';
        currentPage = pageName;
        console.log(`Showing page: ${pageName}`);
    } else {
        console.error(`Page not found: page-${pageName}`);
    }
}

// Save State
function saveState() {    const state = {
        layout: body.getAttribute('data-layout'),
        theme: body.getAttribute('data-theme'),
        colorMode: body.getAttribute('data-mode'),
        customColors: {
            primary: document.documentElement.style.getPropertyValue('--primary') || null,
            secondary: document.documentElement.style.getPropertyValue('--secondary') || null,
            accent: document.documentElement.style.getPropertyValue('--accent') || null,
            primaryLight: document.documentElement.style.getPropertyValue('--primary-light') || null,
            primaryDark: document.documentElement.style.getPropertyValue('--primary-dark') || null
        },
        colorBarState: {
            hue: colorBarState.hue, 
            saturation: colorBarState.saturation, 
            lightness: colorBarState.lightness
        },
        footerPosition: body.getAttribute('data-footer'),
        content: {},
        images: {},
        captions: {},
        currentPage: currentPage
    };
    
    // Save editable content
    document.querySelectorAll('.editable').forEach(el => {
        if (el.id) {
            state.content[el.id] = el.innerHTML;
        }
    });
    
    // Save images
    document.querySelectorAll('.media-placeholder').forEach(el => {
        if (el.id && el.style.backgroundImage) {
            state.images[el.id] = el.style.backgroundImage;
            
            // Save caption if exists
            const captionEl = el.querySelector('.media-caption');
            if (captionEl && captionEl.textContent !== 'Add caption here') {
                state.captions[el.id] = captionEl.textContent;
                el.dataset.caption = captionEl.textContent;
            }
        }
    });
    
    // Save all pages content
    const pages = document.querySelectorAll('.page-content');
    if (pages.length > 0) {
        state.pages = {};
        pages.forEach(page => {
            if (page.id) {
                state.pages[page.id] = page.innerHTML;
            }
        });
    }
    
    localStorage.setItem('websiteBuilderState', JSON.stringify(state));
}

// Load State
function loadSavedState() {
    const savedState = localStorage.getItem('websiteBuilderState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            
            // Apply layout
            if (state.layout) {
                body.setAttribute('data-layout', state.layout);
                layoutSelect.value = state.layout;
            }
              // Apply theme
            if (state.theme) {
                body.setAttribute('data-theme', state.theme);
                themeSelect.value = state.theme;
            }
              // Apply color mode
            if (state.colorMode) {
                body.setAttribute('data-mode', state.colorMode);
                document.documentElement.setAttribute('data-mode', state.colorMode);
                if (colorModeSelect) {
                    colorModeSelect.value = state.colorMode;
                }
            }
            
            // Apply custom colors if any
            if (state.customColors) {
                if (state.customColors.primary) {
                    document.documentElement.style.setProperty('--primary', state.customColors.primary);
                    if (primaryColorPicker) {
                        primaryColorPicker.value = rgbToHex(state.customColors.primary);
                        primaryColorPicker.nextElementSibling.textContent = primaryColorPicker.value.toUpperCase();
                    }
                }
                if (state.customColors.secondary) {
                    document.documentElement.style.setProperty('--secondary', state.customColors.secondary);
                    if (secondaryColorPicker) {
                        secondaryColorPicker.value = rgbToHex(state.customColors.secondary);
                        secondaryColorPicker.nextElementSibling.textContent = secondaryColorPicker.value.toUpperCase();
                    }
                }
                if (state.customColors.accent) {
                    document.documentElement.style.setProperty('--accent', state.customColors.accent);
                    if (accentColorPicker) {
                        accentColorPicker.value = rgbToHex(state.customColors.accent);
                        accentColorPicker.nextElementSibling.textContent = accentColorPicker.value.toUpperCase();
                    }
                }
                if (state.customColors.primaryLight) {
                    document.documentElement.style.setProperty('--primary-light', state.customColors.primaryLight);
                }
                if (state.customColors.primaryDark) {
                    document.documentElement.style.setProperty('--primary-dark', state.customColors.primaryDark);
                }
            }
              // Apply footer position
            if (state.footerPosition) {
                body.setAttribute('data-footer', state.footerPosition);
                footerPositionSelect.value = state.footerPosition;
            }
              // Apply color bar state if saved
            if (state.colorBarState) {
                // Update color bar state object
                colorBarState.hue = state.colorBarState.hue || 0;
                colorBarState.saturation = state.colorBarState.saturation || 70;
                colorBarState.lightness = state.colorBarState.lightness || 50;
                
                // Update UI elements
                colorBarSlider.value = colorBarState.hue;
                saturationSlider.value = colorBarState.saturation;
                lightnessSlider.value = colorBarState.lightness;
                
                // Update visual elements
                updateColorBarPreview();
                updateSaturationSliderGradient();
            }
            // Fallback for older saved states with just colorBarValue
            else if (state.colorBarValue && colorBarSlider) {
                colorBarState.hue = parseInt(state.colorBarValue);
                colorBarSlider.value = colorBarState.hue;
                updateColorBarPreview();
                updateSaturationSliderGradient();
            }
            
            // Restore content
            if (state.content) {
                Object.keys(state.content).forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.innerHTML = state.content[id];
                    }
                });
            }
            
            // Restore images
            if (state.images) {
                Object.keys(state.images).forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.backgroundImage = state.images[id];
                        el.style.backgroundSize = 'cover';
                        el.style.backgroundPosition = 'center';
                        const span = el.querySelector('span');
                        if (span) span.style.display = 'none';
                        el.classList.add('has-media');
                        
                        // Restore caption
                        if (state.captions && state.captions[id]) {
                            const captionEl = el.querySelector('.media-caption');
                            if (captionEl) {
                                captionEl.textContent = state.captions[id];
                                el.classList.add('has-caption');
                                el.dataset.caption = state.captions[id];
                            }
                        }
                    }
                });
            }
            
            // Restore pages
            if (state.pages) {
                const mainContent = document.getElementById('main-content');
                
                Object.keys(state.pages).forEach(pageId => {
                    // Check if page already exists, if not create it
                    let page = document.getElementById(pageId);
                    
                    if (!page) {
                        page = document.createElement('div');
                        page.id = pageId;
                        page.className = 'page-content';
                        page.style.display = 'none'; // Hide by default
                        mainContent.appendChild(page);
                    }
                    
                    page.innerHTML = state.pages[pageId];
                });
                
                // Show current page or default to home
                if (state.currentPage && state.currentPage !== 'home') {
                    showPage(state.currentPage);
                } else {
                    showHomePage();
                }
            }
        } catch (e) {
            console.error('Error loading saved state:', e);
        }
    }
}

// Get basic export styles (fallback)
function getBasicExportStyles() {
    return `
        /* Basic export styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; }
        .site-container { min-height: 100vh; display: flex; flex-direction: column; }
        .site-nav { background: #f8f9fa; padding: 1rem; }
        .nav-list { list-style: none; display: flex; gap: 1rem; }
        .nav-link { text-decoration: none; color: #333; padding: 0.5rem 1rem; }
        .main-content { flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .content-section { margin-bottom: 3rem; }
        .content-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .content-card { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; }
        .site-footer { background: #f8f9fa; padding: 2rem; text-align: center; }
    `;
}

// Auto-save on content changes
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('editable')) {
        saveState();
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
