var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// State management
var isEditMode = false;
var isDragging = false;
var dragOffset = { x: 0, y: 0 };
var isMinimized = false;
// Website options (replaces URL parameters)
var websiteOptions = {
    type: 'business',
    title: 'Your Amazing Website',
    subtitle: 'Build something beautiful today',
    theme: 'dark',
    layout: 'top-nav'
};
// Color Bar State
var colorBarState = {
    hue: 0,
    saturation: 70,
    lightness: 50,
    currentColorRgb: { r: 255, g: 0, b: 0 },
    currentColorHex: '#ff0000',
    customColors: {
        primary: '#6366f1',
        secondary: '#64748b',
        accent: '#10b981'
    }
};
// DOM Elements (will be initialized after DOM loads)
var body, controlPanel, controlPanelBody, minimizeBtn, editModeToggle, layoutSelect, themeSelect, saveBtn, resetBtn;
var colorBar, lightnessSlider, saturationSlider, primaryColorPicker, secondaryColorPicker, accentColorPicker, colorIndicator, colorPreviewBox;
// Initialize DOM elements
function initializeElements() {
    body = document.body;
    controlPanel = document.getElementById('control-panel');
    controlPanelBody = controlPanel.querySelector('.control-panel-body');
    minimizeBtn = document.getElementById('minimize-btn');
    editModeToggle = document.getElementById('edit-mode-toggle');
    layoutSelect = document.getElementById('layout-select');
    themeSelect = document.getElementById('theme-select');
    saveBtn = document.getElementById('save-btn');
    resetBtn = document.getElementById('reset-btn');
    // Color related elements
    colorBar = document.getElementById('color-bar');
    lightnessSlider = document.getElementById('lightness-slider');
    saturationSlider = document.getElementById('saturation-slider');
    primaryColorPicker = document.getElementById('primary-color');
    secondaryColorPicker = document.getElementById('secondary-color');
    accentColorPicker = document.getElementById('accent-color');
    colorIndicator = document.getElementById('color-indicator');
    colorPreviewBox = document.getElementById('color-bar-preview');
}
// Initialize
function init() {
    initializeElements();
    setupControlPanel();
    setupEditMode();
    setupLayoutControl();
    setupThemeControl();
    setupButtonActions();
    setupMediaPlaceholders();
    setupDynamicPagesNavigation();
    setupColorBar();
    setupColorControls();
    setupColorBarControl();
    // Load saved state (which includes theme preferences)
    loadSavedState();
    // Always default to dark mode when there's no saved state
    var savedState = localStorage.getItem('websiteBuilderState');
    if (!savedState) {
        // No saved state, always use dark mode
        websiteOptions.theme = 'dark';
        console.log('No saved state, defaulting to dark mode');
    }
    handleUrlParameters(); // Handle URL parameters on init
}
// Control Panel Setup
function setupControlPanel() {
    var header = controlPanel.querySelector('.control-panel-header');
    // Dragging
    header.addEventListener('mousedown', function (e) {
        if (e.target.closest('button'))
            return;
        isDragging = true;
        var rect = controlPanel.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        controlPanel.classList.add('dragging');
    });
    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            var x = e.clientX - dragOffset.x;
            var y = e.clientY - dragOffset.y;
            controlPanel.style.left = "".concat(x, "px");
            controlPanel.style.top = "".concat(y, "px");
            controlPanel.style.right = 'auto';
        }
    });
    document.addEventListener('mouseup', function () {
        isDragging = false;
        controlPanel.classList.remove('dragging');
    });
    // Minimize/Expand
    minimizeBtn.addEventListener('click', function () {
        isMinimized = !isMinimized;
        controlPanel.classList.toggle('minimized', isMinimized);
        minimizeBtn.textContent = isMinimized ? '▸' : '▾';
        minimizeBtn.title = isMinimized ? 'Expand' : 'Minimize';
    });
}
// Edit Mode Setup
function setupEditMode() {
    editModeToggle.addEventListener('click', function () {
        isEditMode = !isEditMode;
        body.classList.toggle('edit-mode', isEditMode);
        editModeToggle.classList.toggle('active', isEditMode);
        editModeToggle.textContent = isEditMode ? 'Exit Edit' : 'Edit Mode';
        // Update status bar
        if (window.updateStatus) {
            if (isEditMode) {
                updateStatus('Edit mode ON - Content can now be edited', 'info');
                document.getElementById('status-info').textContent = 'Edit mode: ON';
            }
            else {
                updateStatus('Edit mode OFF - Content is now locked', 'success');
                document.getElementById('status-info').textContent = 'Edit mode: OFF';
            }
        }
        // Toggle contenteditable on all editable elements
        var editables = document.querySelectorAll('.editable');
        editables.forEach(function (el) {
            el.contentEditable = isEditMode;
        });
        // Properly handle media placeholders
        var mediaPlaceholders = document.querySelectorAll('.media-placeholder');
        mediaPlaceholders.forEach(function (placeholder) {
            if (!isEditMode && !placeholder.classList.contains('has-media')) {
                // Hide all placeholders without images when exiting edit mode
                placeholder.style.display = 'none';
            }
            else if (isEditMode) {
                // Show all placeholders when entering edit mode
                placeholder.style.display = 'flex';
            }
        });
    });
}
// Layout Control
function setupLayoutControl() {
    layoutSelect.addEventListener('change', function (e) {
        var layout = e.target.value;
        body.setAttribute('data-layout', layout);
        websiteOptions.layout = layout;
        console.log('Layout changed to:', layout);
        saveState();
    });
}
// Theme Control
function setupThemeControl() {
    // Add event listener for theme dropdown changes
    themeSelect.addEventListener('change', function (e) {
        var theme = e.target.value;
        setColorMode(theme, true);
    });
    // Setup system preference detection and listener for changes
    if (window.matchMedia) {
        var darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        // Setup listener for system preference changes
        try {
            // Modern browsers
            darkModeMediaQuery.addEventListener('change', function (e) {
                if (websiteOptions.theme === 'auto') {
                    var newMode = e.matches ? 'dark' : 'light';
                    setColorMode(newMode, false);
                    console.log('System color preference changed to:', newMode);
                }
            });
        }
        catch (e) {
            // Fallback for older browsers
            darkModeMediaQuery.addListener(function (e) {
                if (websiteOptions.theme === 'auto') {
                    var newMode = e.matches ? 'dark' : 'light';
                    setColorMode(newMode, false);
                    console.log('System color preference changed to:', newMode);
                }
            });
        }
    }
}
// Button Actions
function setupButtonActions() {
    // Save Website Files
    saveBtn.addEventListener('click', function () {
        var siteName = prompt('Enter the name for your website files (e.g., "MySite" or "folder/MySite"):');
        if (!siteName)
            return;
        saveWebsiteFiles(siteName);
    }); // Reset Content
    resetBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to reset all content to defaults?')) {
            // Update status bar
            if (window.updateStatus) {
                updateStatus('Resetting website to defaults...', 'warning');
            }
            // Reset websiteOptions to defaults
            websiteOptions = {
                type: 'business',
                title: 'Your Amazing Website',
                subtitle: 'Build something beautiful today',
                theme: 'light',
                layout: 'top-nav'
            };
            // Clear localStorage
            localStorage.removeItem('websiteBuilderState');
            // Apply default options
            applyWebsiteOptions();
            // Reset color bar state
            colorBarState = {
                hue: 0,
                saturation: 70,
                lightness: 50,
                currentColorRgb: { r: 255, g: 0, b: 0 },
                currentColorHex: '#ff0000',
                customColors: {
                    primary: '#6366f1',
                    secondary: '#64748b',
                    accent: '#10b981'
                }
            };
            updateColorBar();
            updateColorBarPreview();
            // Update status bar again
            if (window.updateStatus) {
                updateStatus('Website reset to defaults', 'success');
            }
            // Force page reload to reset all content
            location.reload();
        }
    });
}
// Media Placeholders with File Explorer
function setupMediaPlaceholders() {
    // Use event delegation to handle both existing and dynamically created placeholders
    document.addEventListener('click', function (e) {
        var placeholder = e.target.closest('.media-placeholder');
        if (!placeholder)
            return;
        // Don't trigger file upload if clicking on caption
        if (e.target.classList.contains('media-caption'))
            return;
        // Only allow file selection in edit mode
        if (!isEditMode)
            return;
        // Create file input
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', function (e) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    placeholder.style.backgroundImage = "url(".concat(e.target.result, ")");
                    placeholder.style.backgroundSize = 'cover';
                    placeholder.style.backgroundPosition = 'center';
                    var span = placeholder.querySelector('span');
                    if (span)
                        span.style.display = 'none';
                    placeholder.classList.add('has-media');
                    // Save state after image is loaded
                    saveState();
                };
                reader.readAsDataURL(file);
            }
        });
        // Trigger file picker
        input.click();
    });
    // Initialize existing placeholders
    initializeExistingPlaceholders();
}
function initializeExistingPlaceholders() {
    document.querySelectorAll('.media-placeholder').forEach(function (placeholder) {
        if (placeholder.style.backgroundImage && placeholder.style.backgroundImage !== 'none' &&
            placeholder.style.backgroundImage !== '') {
            placeholder.classList.add('has-media');
            var span = placeholder.querySelector('span');
            if (span)
                span.style.display = 'none';
        }
        // Initialize visibility based on edit mode and has-media class
        updatePlaceholderVisibility(placeholder);
    });
}
function updatePlaceholderVisibility(placeholder) {
    if (!isEditMode && !placeholder.classList.contains('has-media')) {
        placeholder.style.display = 'none';
    }
    else {
        placeholder.style.display = 'flex';
    }
}
// Dynamic Page Creation and Navigation
function setupDynamicPagesNavigation() {
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            // Skip if it's an external link or doesn't start with #
            if (!href || !href.startsWith('#'))
                return;
            var pageId = href.substring(1); // Remove the #
            var existingPage = document.getElementById(pageId);
            // If page doesn't exist, create it
            if (!existingPage) {
                e.preventDefault(); // Prevent default scroll behavior
                createDynamicPage(pageId, link.textContent);
            }
        });
    });
}
function createDynamicPage(pageId, pageTitle) {
    var mainContent = document.getElementById('main-content');
    if (!mainContent)
        return;
    // Create new page section
    var newPage = document.createElement('section');
    newPage.id = pageId;
    newPage.className = 'dynamic-page';
    // Create page content based on page type
    var pageContent = generatePageContent(pageId, pageTitle, websiteOptions.type);
    newPage.innerHTML = pageContent;
    // Always append to main content - ensures sections are properly contained
    mainContent.appendChild(newPage);
    // Scroll to the new page
    newPage.scrollIntoView({ behavior: 'smooth' });
    // Make elements editable if in edit mode
    if (isEditMode) {
        newPage.querySelectorAll('.editable').forEach(function (el) {
            el.contentEditable = true;
        });
    }
    console.log("\uD83C\uDD95 Created dynamic page: ".concat(pageId));
}
function generatePageContent(pageId, pageTitle, websiteType) {
    var pageTemplates = {
        about: "\n            <div class=\"page-content\">\n                <h2 class=\"page-title editable\" contenteditable=\"false\">".concat(pageTitle, "</h2>\n                <div class=\"page-intro\">\n                    <p class=\"editable\" contenteditable=\"false\">Learn more about our story, mission, and values.</p>\n                </div>\n                <div class=\"content-grid\">\n                    <div class=\"content-column\">\n                        <h3 class=\"editable\" contenteditable=\"false\">Our Story</h3>\n                        <p class=\"editable\" contenteditable=\"false\">We started with a simple idea: to create something meaningful that makes a difference in people's lives.</p>\n                        <div class=\"media-placeholder\" style=\"width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin: 1rem 0;\">\n                            <span>Click to add image (400x200)</span>\n                        </div>\n                    </div>\n                    <div class=\"content-column\">\n                        <h3 class=\"editable\" contenteditable=\"false\">Our Mission</h3>\n                        <p class=\"editable\" contenteditable=\"false\">To deliver exceptional value and create lasting relationships with our clients through innovation and excellence.</p>\n                    </div>\n                </div>\n            </div>\n        "),
        services: "\n            <div class=\"page-content\">\n                <h2 class=\"page-title editable\" contenteditable=\"false\">".concat(pageTitle, "</h2>\n                <div class=\"page-intro\">\n                    <p class=\"editable\" contenteditable=\"false\">Discover the comprehensive solutions we offer to help you succeed.</p>\n                </div>\n                <div class=\"services-grid\">\n                    <div class=\"service-card\">\n                        <div class=\"media-placeholder\" style=\"width: 100%; height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;\">\n                            <span>Service Icon (150x150)</span>\n                        </div>\n                        <h3 class=\"editable\" contenteditable=\"false\">Service One</h3>\n                        <p class=\"editable\" contenteditable=\"false\">Description of your first service offering and its benefits.</p>\n                    </div>\n                    <div class=\"service-card\">\n                        <div class=\"media-placeholder\" style=\"width: 100%; height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;\">\n                            <span>Service Icon (150x150)</span>\n                        </div>\n                        <h3 class=\"editable\" contenteditable=\"false\">Service Two</h3>\n                        <p class=\"editable\" contenteditable=\"false\">Description of your second service offering and its benefits.</p>\n                    </div>\n                    <div class=\"service-card\">\n                        <div class=\"media-placeholder\" style=\"width: 100%; height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;\">\n                            <span>Service Icon (150x150)</span>\n                        </div>\n                        <h3 class=\"editable\" contenteditable=\"false\">Service Three</h3>\n                        <p class=\"editable\" contenteditable=\"false\">Description of your third service offering and its benefits.</p>\n                    </div>\n                </div>\n            </div>\n        "),
        portfolio: "\n            <div class=\"page-content\">\n                <h2 class=\"page-title editable\" contenteditable=\"false\">".concat(pageTitle, "</h2>\n                <div class=\"page-intro\">\n                    <p class=\"editable\" contenteditable=\"false\">Explore our featured work and creative projects.</p>\n                </div>\n                <div class=\"portfolio-grid\">\n                    <div class=\"portfolio-item\">\n                        <div class=\"media-placeholder\" style=\"width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;\">\n                            <span>Project Image (300x200)</span>\n                        </div>\n                        <h3 class=\"editable\" contenteditable=\"false\">Project One</h3>\n                        <p class=\"editable\" contenteditable=\"false\">Brief description of this portfolio project.</p>\n                    </div>\n                    <div class=\"portfolio-item\">\n                        <div class=\"media-placeholder\" style=\"width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;\">\n                            <span>Project Image (300x200)</span>\n                        </div>\n                        <h3 class=\"editable\" contenteditable=\"false\">Project Two</h3>\n                        <p class=\"editable\" contenteditable=\"false\">Brief description of this portfolio project.</p>\n                    </div>\n                    <div class=\"portfolio-item\">\n                        <div class=\"media-placeholder\" style=\"width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;\">\n                            <span>Project Image (300x200)</span>\n                        </div>\n                        <h3 class=\"editable\" contenteditable=\"false\">Project Three</h3>\n                        <p class=\"editable\" contenteditable=\"false\">Brief description of this portfolio project.</p>\n                    </div>\n                </div>\n            </div>\n        "),
        contact: "\n            <div class=\"page-content\">\n                <h2 class=\"page-title editable\" contenteditable=\"false\">".concat(pageTitle, "</h2>\n                <div class=\"page-intro\">\n                    <p class=\"editable\" contenteditable=\"false\">Get in touch with us. We'd love to hear from you!</p>\n                </div>\n                <div class=\"contact-content\">\n                    <div class=\"contact-info\">\n                        <h3 class=\"editable\" contenteditable=\"false\">Contact Information</h3>\n                        <div class=\"contact-item\">\n                            <strong>Email:</strong> <span class=\"editable\" contenteditable=\"false\">info@yourcompany.com</span>\n                        </div>\n                        <div class=\"contact-item\">\n                            <strong>Phone:</strong> <span class=\"editable\" contenteditable=\"false\">(555) 123-4567</span>\n                        </div>\n                        <div class=\"contact-item\">\n                            <strong>Address:</strong> <span class=\"editable\" contenteditable=\"false\">123 Main St, City, State 12345</span>\n                        </div>\n                    </div>\n                    <div class=\"contact-form\">\n                        <h3 class=\"editable\" contenteditable=\"false\">Send us a Message</h3>\n                        <form>\n                            <div class=\"form-group\">\n                                <label for=\"name\">Name:</label>\n                                <input type=\"text\" id=\"name\" name=\"name\" required>\n                            </div>\n                            <div class=\"form-group\">\n                                <label for=\"email\">Email:</label>\n                                <input type=\"email\" id=\"email\" name=\"email\" required>\n                            </div>\n                            <div class=\"form-group\">\n                                <label for=\"message\">Message:</label>\n                                <textarea id=\"message\" name=\"message\" rows=\"5\" required></textarea>\n                            </div>\n                            <button type=\"submit\" class=\"btn\">Send Message</button>\n                        </form>\n                    </div>\n                </div>\n            </div>\n        ")
    };
    // Return appropriate template or default
    return pageTemplates[pageId.toLowerCase()] || "\n        <div class=\"page-content\">\n            <h2 class=\"page-title editable\" contenteditable=\"false\">".concat(pageTitle, "</h2>\n            <div class=\"page-intro\">\n                <p class=\"editable\" contenteditable=\"false\">Welcome to the ").concat(pageTitle, " page. Add your content here.</p>\n            </div>\n            <div class=\"media-placeholder\" style=\"width: 100%; height: 300px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin: 2rem 0;\">\n                <span>Click to add image (600x300)</span>\n            </div>\n            <p class=\"editable\" contenteditable=\"false\">This is a dynamically created page. Edit this content to customize your page.</p>\n        </div>\n    ");
}
// State Management Functions
function saveState() {
    var state = {
        websiteOptions: websiteOptions,
        colorBar: colorBarState,
        isEditMode: isEditMode,
        layout: body.getAttribute('data-layout'),
        theme: body.getAttribute('data-theme'),
        editableContent: {},
        mediaPlaceholders: {}
    };
    // Save all editable content
    document.querySelectorAll('.editable').forEach(function (el, index) {
        var id = el.id || "editable-".concat(index);
        state.editableContent[id] = el.textContent || el.innerHTML;
    });
    // Update status bar
    if (window.updateStatus) {
        updateStatus('Website state saved', 'success');
    }
    // Save media placeholder states
    document.querySelectorAll('.media-placeholder').forEach(function (placeholder, index) {
        var id = placeholder.id || "placeholder-".concat(index);
        state.mediaPlaceholders[id] = {
            backgroundImage: placeholder.style.backgroundImage,
            hasMedia: placeholder.classList.contains('has-media')
        };
    });
    localStorage.setItem('websiteBuilderState', JSON.stringify(state));
    console.log('💾 State saved to localStorage');
}
function loadSavedState() {
    try {
        var savedState = localStorage.getItem('websiteBuilderState');
        if (savedState) {
            var state_1 = JSON.parse(savedState);
            // Load website options
            if (state_1.websiteOptions) {
                websiteOptions = __assign(__assign({}, websiteOptions), state_1.websiteOptions);
            }
            // Load color bar state
            if (state_1.colorBar) {
                colorBarState = __assign(__assign({}, colorBarState), state_1.colorBar);
                updateColorBar();
                updateColorBarPreview();
            }
            // Load layout and theme
            if (state_1.layout) {
                body.setAttribute('data-layout', state_1.layout);
                if (layoutSelect)
                    layoutSelect.value = state_1.layout;
            }
            if (state_1.theme) {
                body.setAttribute('data-theme', state_1.theme);
                if (themeSelect)
                    themeSelect.value = state_1.theme;
            }
            // Load editable content
            if (state_1.editableContent) {
                Object.keys(state_1.editableContent).forEach(function (id) {
                    var element = document.getElementById(id) || document.querySelector("[data-id=\"".concat(id, "\"]"));
                    if (element) {
                        element.textContent = state_1.editableContent[id];
                    }
                });
            }
            // Load media placeholder states
            if (state_1.mediaPlaceholders) {
                Object.keys(state_1.mediaPlaceholders).forEach(function (id) {
                    var placeholder = document.getElementById(id) || document.querySelector("[data-id=\"".concat(id, "\"]"));
                    if (placeholder) {
                        var data = state_1.mediaPlaceholders[id];
                        if (data.backgroundImage) {
                            placeholder.style.backgroundImage = data.backgroundImage;
                            placeholder.style.backgroundSize = 'cover';
                            placeholder.style.backgroundPosition = 'center';
                        }
                        if (data.hasMedia) {
                            placeholder.classList.add('has-media');
                            var span = placeholder.querySelector('span');
                            if (span)
                                span.style.display = 'none';
                        }
                    }
                });
            }
            console.log('📂 State loaded from localStorage');
        }
    }
    catch (e) {
        console.error('Error loading saved state:', e);
    }
}
// Color Bar Setup
function setupColorBar() {
    // Create a linear gradient for the color bar with finer hue steps for smoother transition
    var gradientColors = [];
    for (var h = 0; h <= 360; h += 10) { // Reduced step size for more hues
        gradientColors.push("hsl(".concat(h, ", 100%, 50%)"));
    }
    var gradient = "linear-gradient(to right, ".concat(gradientColors.join(', '), ")");
    colorBar.style.background = gradient;
    // Initial setup
    updateColorBar();
    updateColorBarPreview();
}
// Color Controls Setup
function setupColorControls() {
    // Initialize color pickers with current theme values
    updateColorPickersFromTheme();
    // Update color value display and apply changes immediately when picker changes
    primaryColorPicker.addEventListener('input', function (e) {
        var valueDisplay = primaryColorPicker.nextElementSibling;
        valueDisplay.textContent = e.target.value.toUpperCase();
        applyCustomColors();
        // Also extract HSL from RGB to update the color bar sliders
        var rgb = hexToRgb(e.target.value);
        if (rgb) {
            var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            colorBarState.hue = Math.round(hsl.h * 360);
            colorBarState.saturation = Math.round(hsl.s * 100);
            colorBarState.lightness = Math.round(hsl.l * 100);
            updateColorBar();
        }
    });
    secondaryColorPicker.addEventListener('input', function (e) {
        var valueDisplay = secondaryColorPicker.nextElementSibling;
        valueDisplay.textContent = e.target.value.toUpperCase();
        applyCustomColors();
    });
    accentColorPicker.addEventListener('input', function (e) {
        var valueDisplay = accentColorPicker.nextElementSibling;
        valueDisplay.textContent = e.target.value.toUpperCase();
        applyCustomColors();
    });
    // Add change event for when color selection is complete
    primaryColorPicker.addEventListener('change', function () {
        if (window.updateStatus) {
            updateStatus("Primary color set to: ".concat(primaryColorPicker.value.toUpperCase()), 'success');
        }
        saveState();
    });
    secondaryColorPicker.addEventListener('change', function () {
        if (window.updateStatus) {
            updateStatus("Secondary color set to: ".concat(secondaryColorPicker.value.toUpperCase()), 'success');
        }
        saveState();
    });
    accentColorPicker.addEventListener('change', function () {
        if (window.updateStatus) {
            updateStatus("Accent color set to: ".concat(accentColorPicker.value.toUpperCase()), 'success');
        }
        saveState();
    });
    // Save custom colors to state
    colorBarState.customColors.primary = primaryColorPicker.value;
    colorBarState.customColors.secondary = secondaryColorPicker.value;
    colorBarState.customColors.accent = accentColorPicker.value;
    // Update status when colors change
    if (window.updateStatus) {
        updateStatus('Custom colors applied', 'info');
    }
}
// Helper to update color pickers based on current theme
function updateColorPickersFromTheme() {
    // Get computed style to get actual color values
    var computedStyle = getComputedStyle(document.documentElement);
    // Extract colors
    var primaryColor = computedStyle.getPropertyValue('--primary').trim() || '#6366f1';
    var secondaryColor = computedStyle.getPropertyValue('--secondary').trim() || '#64748b';
    var accentColor = computedStyle.getPropertyValue('--accent').trim() || '#10b981';
    // Convert to hex if needed and update pickers
    primaryColorPicker.value = rgbToHex(primaryColor);
    secondaryColorPicker.value = rgbToHex(secondaryColor);
    accentColorPicker.value = rgbToHex(accentColor);
    // Update value displays
    primaryColorPicker.nextElementSibling.textContent = primaryColorPicker.value.toUpperCase();
    secondaryColorPicker.nextElementSibling.textContent = secondaryColorPicker.value.toUpperCase();
    accentColorPicker.nextElementSibling.textContent = accentColorPicker.value.toUpperCase();
    // Save to state
    colorBarState.customColors.primary = primaryColorPicker.value;
    colorBarState.customColors.secondary = secondaryColorPicker.value;
    colorBarState.customColors.accent = accentColorPicker.value;
}
// Apply custom colors to the website
function applyCustomColors() {
    // Apply custom colors directly to root for global effect
    document.documentElement.style.setProperty('--primary', primaryColorPicker.value);
    document.documentElement.style.setProperty('--secondary', secondaryColorPicker.value);
    document.documentElement.style.setProperty('--accent', accentColorPicker.value);
    // Also calculate and set related colors
    var primaryRGB = hexToRgb(primaryColorPicker.value);
    if (primaryRGB) {
        // Convert to HSL for better light/dark variants
        var primaryHSL = rgbToHsl(primaryRGB.r, primaryRGB.g, primaryRGB.b);
        // Set light and dark variants using HSL for more natural results
        document.documentElement.style.setProperty('--primary-light', "hsl(".concat(Math.round(primaryHSL.h * 360), ", ").concat(Math.min(Math.round(primaryHSL.s * 100) + 10, 100), "%, ").concat(Math.min(Math.round(primaryHSL.l * 100) + 15, 90), "%)"));
        document.documentElement.style.setProperty('--primary-dark', "hsl(".concat(Math.round(primaryHSL.h * 360), ", ").concat(Math.min(Math.round(primaryHSL.s * 100) + 10, 100), "%, ").concat(Math.max(Math.round(primaryHSL.l * 100) - 15, 15), "%)"));
        // Set primary contrast color based on lightness
        var textColor = primaryHSL.l > 0.6 ? '#000000' : '#ffffff';
        document.documentElement.style.setProperty('--primary-contrast', textColor);
    }
    // Apply secondary color variants
    var secondaryRGB = hexToRgb(secondaryColorPicker.value);
    if (secondaryRGB) {
        var secondaryHSL = rgbToHsl(secondaryRGB.r, secondaryRGB.g, secondaryRGB.b);
        document.documentElement.style.setProperty('--secondary-light', "hsl(".concat(Math.round(secondaryHSL.h * 360), ", ").concat(Math.min(Math.round(secondaryHSL.s * 100) + 5, 100), "%, ").concat(Math.min(Math.round(secondaryHSL.l * 100) + 15, 90), "%)"));
        document.documentElement.style.setProperty('--secondary-dark', "hsl(".concat(Math.round(secondaryHSL.h * 360), ", ").concat(Math.min(Math.round(secondaryHSL.s * 100) + 10, 100), "%, ").concat(Math.max(Math.round(secondaryHSL.l * 100) - 15, 15), "%)"));
        var textColor = secondaryHSL.l > 0.6 ? '#000000' : '#ffffff';
        document.documentElement.style.setProperty('--secondary-contrast', textColor);
    }
    // Apply accent color variants
    var accentRGB = hexToRgb(accentColorPicker.value);
    if (accentRGB) {
        var accentHSL = rgbToHsl(accentRGB.r, accentRGB.g, accentRGB.b);
        document.documentElement.style.setProperty('--accent-light', "hsl(".concat(Math.round(accentHSL.h * 360), ", ").concat(Math.min(Math.round(accentHSL.s * 100) + 5, 100), "%, ").concat(Math.min(Math.round(accentHSL.l * 100) + 15, 90), "%)"));
        document.documentElement.style.setProperty('--accent-dark', "hsl(".concat(Math.round(accentHSL.h * 360), ", ").concat(Math.min(Math.round(accentHSL.s * 100) + 10, 100), "%, ").concat(Math.max(Math.round(accentHSL.l * 100) - 15, 15), "%)"));
        var textColor = accentHSL.l > 0.6 ? '#000000' : '#ffffff';
        document.documentElement.style.setProperty('--accent-contrast', textColor);
    }
    // Update semantic UI colors to ensure they're derived from our theme colors
    document.documentElement.style.setProperty('--bg-primary', 'var(--neutral-50)');
    document.documentElement.style.setProperty('--bg-secondary', '#ffffff');
    document.documentElement.style.setProperty('--text-primary', 'var(--neutral-900)');
    document.documentElement.style.setProperty('--text-secondary', 'var(--neutral-600)');
    document.documentElement.style.setProperty('--border-color', 'var(--neutral-200)');
    // Update status when colors applied
    if (window.updateStatus) {
        updateStatus('Custom colors applied to entire page', 'success');
    }
    // Save state
    colorBarState.customColors.primary = primaryColorPicker.value;
    colorBarState.customColors.secondary = secondaryColorPicker.value;
    colorBarState.customColors.accent = accentColorPicker.value;
    saveState();
}
// Setup color bar control
function setupColorBarControl() {
    // Fix Chrome rendering issues with the slider thumb by forcing a repaint
    function forceRepaint(element) {
        // Read a layout property to force a repaint
        var reflow = element.offsetHeight;
        // Apply a small transform to force GPU rendering
        element.style.transform = 'translateZ(0)';
        // Remove transform after a short delay
        setTimeout(function () {
            element.style.transform = '';
        }, 50);
    }
    // Use both 'input' and 'change' events to ensure updates happen during sliding and on release
    colorBar.addEventListener('input', function (e) {
        updateColorFromSlider();
        // Force repaint to fix multiple handles issue
        forceRepaint(e.target);
    });
    colorBar.addEventListener('change', function (e) {
        updateColorFromSlider();
        // Provide feedback when the user finishes selecting a color
        if (window.updateStatus) {
            updateStatus("Color hue set to: ".concat(colorBarState.hue, "\u00B0"), 'success');
        }
        forceRepaint(e.target);
    });
    // Update interface when light/saturation sliders change
    lightnessSlider.addEventListener('input', updateColorFromLightnessSaturation);
    saturationSlider.addEventListener('input', updateColorFromLightnessSaturation);
    // Add click event on the color bar for direct color selection
    colorBar.parentElement.addEventListener('click', function (e) {
        // Only handle clicks on the wrapper, not the slider itself
        if (e.target === colorBar)
            return;
        // Calculate position percentage
        var rect = colorBar.getBoundingClientRect();
        var position = (e.clientX - rect.left) / rect.width;
        // Convert to hue (0-360)
        colorBarState.hue = Math.round(position * 360);
        colorBar.value = colorBarState.hue;
        // Update color preview and apply to page
        updateColorBarPreview();
        // Force repaint to fix display issues
        forceRepaint(colorBar);
    });
    // Initial update
    updateColorBar();
}
function updateColorFromSlider() {
    colorBarState.hue = parseInt(colorBar.value);
    updateColorBarPreview();
}
function updateColorFromLightnessSaturation() {
    colorBarState.lightness = parseInt(lightnessSlider.value);
    colorBarState.saturation = parseInt(saturationSlider.value);
    updateColorBarPreview();
}
function updateColorBar() {
    // Set sliders to match state
    colorBar.value = colorBarState.hue;
    lightnessSlider.value = colorBarState.lightness;
    saturationSlider.value = colorBarState.saturation;
    // Position color indicator
    updateColorIndicator();
}
function updateColorBarPreview() {
    // Calculate color
    var hue = colorBarState.hue;
    var saturation = colorBarState.saturation;
    var lightness = colorBarState.lightness;
    // Update HSL
    var hslColor = "hsl(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%)");
    // Convert to RGB
    var rgb = hslToRgb(hue / 360, saturation / 100, lightness / 100);
    colorBarState.currentColorRgb = rgb;
    // Convert RGB to HEX
    var hex = '#' +
        ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b)
            .toString(16).slice(1).toUpperCase();
    colorBarState.currentColorHex = hex;
    // Update color preview
    if (colorPreviewBox) {
        colorPreviewBox.style.backgroundColor = hslColor;
        colorPreviewBox.textContent = hex;
        // Set text color based on background lightness for contrast
        colorPreviewBox.style.color = lightness > 70 ? '#000' : '#fff';
    }
    // Apply color to the entire page by setting the primary color
    document.documentElement.style.setProperty('--primary', hex);
    // Also calculate and set related colors for a complete theme update
    document.documentElement.style.setProperty('--primary-light', "hsl(".concat(hue, ", ").concat(Math.min(saturation + 15, 100), "%, ").concat(Math.min(lightness + 15, 90), "%)"));
    document.documentElement.style.setProperty('--primary-dark', "hsl(".concat(hue, ", ").concat(Math.min(saturation + 10, 100), "%, ").concat(Math.max(lightness - 15, 20), "%)"));
    // Update accent color with complementary hue
    var accentHue = (hue + 180) % 360;
    document.documentElement.style.setProperty('--accent', "hsl(".concat(accentHue, ", ").concat(saturation, "%, ").concat(lightness, "%)"));
    // Update status when colors change
    if (window.updateStatus) {
        updateStatus("Color updated: ".concat(hex), 'info');
    }
    // Update indicator position
    updateColorIndicator();
}
function updateColorIndicator() {
    if (!colorBar)
        return;
    // We're now using the slider thumb as the indicator instead of a separate element
    // This helps prevent the multiple vertical lines issue
    // Update the background color of the handle through a custom property
    var hslColor = "hsl(".concat(colorBarState.hue, ", 100%, 50%)");
    var sliderTrack = colorBar.parentElement;
    if (sliderTrack) {
        // Add a data attribute to help with styling
        sliderTrack.setAttribute('data-current-hue', colorBarState.hue);
        // Add a small pseudo-element with the current color above the slider
        sliderTrack.style.setProperty('--current-color', hslColor);
    }
    // If we still have the indicator element, update it too for backward compatibility
    if (colorIndicator) {
        var percent = (colorBarState.hue / 360) * 100;
        colorIndicator.style.left = "".concat(percent, "%");
        colorIndicator.style.backgroundColor = hslColor;
    }
}
// Color utility functions
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    hex = hex.trim();
    if (hex.startsWith('rgb')) {
        var match = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3])
            };
        }
        return null;
    }
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function rgbToHex(rgb) {
    if (!rgb)
        return '#000000';
    // Check if already in hex format
    if (rgb.startsWith('#'))
        return rgb;
    // Extract RGB values
    var match;
    if (rgb.startsWith('rgb')) {
        match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    }
    if (match) {
        var r = parseInt(match[1]);
        var g = parseInt(match[2]);
        var b = parseInt(match[3]);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return '#000000'; // Default fallback
}
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
// Convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) {
        // Achromatic (gray)
        h = s = 0;
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, l: l };
}
// Function to fix position of any dynamic pages that might be outside the main content
function fixDynamicPagesPosition() {
    var mainContent = document.getElementById('main-content');
    if (!mainContent)
        return;
    // Find all dynamic pages outside of main content
    var dynamicPages = document.querySelectorAll('.dynamic-page');
    dynamicPages.forEach(function (page) {
        // Check if this page is not inside main-content
        if (page.parentNode !== mainContent) {
            console.log("Moving ".concat(page.id, " section into main-content area"));
            mainContent.appendChild(page);
        }
    });
    if (window.updateStatus) {
        updateStatus('Dynamic page positions corrected', 'success');
    }
}
// Set up a MutationObserver to ensure sections stay in main content
function setupSectionObserver() {
    var mainContent = document.getElementById('main-content');
    if (!mainContent)
        return;
    var bodyElement = document.body;
    // Create a mutation observer to watch for new sections added to the document
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // Check for added nodes
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function (node) {
                    // If it's an element node and it's a section with dynamic-page class
                    if (node.nodeType === 1 &&
                        node.tagName === 'SECTION' &&
                        node.classList.contains('dynamic-page') &&
                        node.parentNode !== mainContent) {
                        console.log("Observer: Moving ".concat(node.id || 'unnamed', " section into main-content"));
                        mainContent.appendChild(node);
                    }
                });
            }
        });
    });
    // Start observing with the configured parameters
    observer.observe(bodyElement, {
        childList: true,
        subtree: true
    });
}
// Document ready function
document.addEventListener('DOMContentLoaded', function () {
    // Initialize everything
    init();
    // Fix any dynamic pages that might be in the wrong position
    fixDynamicPagesPosition();
    // Setup observer to catch future section additions
    setupSectionObserver();
    // Always start with dark mode by default
    setColorMode('dark', true); // Force dark mode and save preference
    // Update status bar with theme info
    if (window.updateStatus) {
        updateStatus('Website Builder loaded with dark theme', 'success');
    }
});
/**
 * Sets the color mode/theme of the website
 * @param {string} mode - The mode to set ('light', 'dark', 'auto', or any theme name)
 * @param {boolean} savePreference - Whether to save this preference to localStorage
 */
function setColorMode(mode, savePreference) {
    if (mode === void 0) { mode = 'dark'; }
    if (savePreference === void 0) { savePreference = true; }
    // Default to dark mode if mode is not specified
    if (!mode || mode === 'auto') {
        // Even in auto mode, we'll default to dark
        mode = 'dark';
        console.log('Dark mode set by default');
    }
    // Apply the theme
    body.setAttribute('data-theme', mode);
    websiteOptions.theme = mode;
    // Update theme selector dropdown if it exists
    if (themeSelect) {
        // If the exact theme doesn't exist in the dropdown, default to closest match
        var themeExists = Array.from(themeSelect.options).some(function (option) { return option.value === mode; });
        themeSelect.value = themeExists ? mode : (mode === 'dark' ? 'dark' : 'light');
    }
    // Apply theme-appropriate colors and update UI
    updateColorPickersFromTheme();
    updateColorBar();
    updateColorBarPreview();
    // Provide feedback
    if (window.updateStatus) {
        updateStatus("Theme set to: ".concat(mode), 'info');
    }
    // Save preference if requested
    if (savePreference) {
        saveState();
    }
    return mode;
}
