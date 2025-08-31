// State management
let isEditMode = false;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let isMinimized = false;

// Website options (replaces URL parameters)
let websiteOptions = {
    type: 'business',
    title: 'Your Amazing Website',
    subtitle: 'Build something beautiful today',
    theme: 'dark',
    layout: 'top-nav'
};

// Color Bar State
let colorBarState = {
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
let body: HTMLElement | null,
    controlPanel: HTMLElement | null,
    controlPanelBody: HTMLElement | null,
    minimizeBtn: HTMLElement | null,
    editModeToggle: HTMLElement | null,
    layoutSelect: HTMLSelectElement | null,
    themeSelect: HTMLSelectElement | null,
    saveBtn: HTMLElement | null,
    resetBtn: HTMLElement | null;
let colorBar: HTMLInputElement | null,
    lightnessSlider: HTMLInputElement | null,
    saturationSlider: HTMLInputElement | null,
    primaryColorPicker: HTMLInputElement | null,
    secondaryColorPicker: HTMLInputElement | null,
    accentColorPicker: HTMLInputElement | null,
    colorIndicator: HTMLElement | null,
    colorPreviewBox: HTMLElement | null;

// Initialize DOM elements
function initializeElements() {
    body = document.body;
    controlPanel = document.getElementById('control-panel');
    controlPanelBody = controlPanel ? controlPanel.querySelector('.control-panel-body') : null;
    minimizeBtn = document.getElementById('minimize-btn');
    editModeToggle = document.getElementById('edit-mode-toggle');
    layoutSelect = document.getElementById('layout-select') as HTMLSelectElement | null;
    themeSelect = document.getElementById('theme-select') as HTMLSelectElement | null;
    saveBtn = document.getElementById('save-btn');
    resetBtn = document.getElementById('reset-btn');
    // Color related elements
    colorBar = document.getElementById('color-bar');
    lightnessSlider = document.getElementById('lightness-slider') as HTMLInputElement | null;
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
    const savedState = localStorage.getItem('websiteBuilderState');
    if (!savedState) {
        // No saved state, always use dark mode
        websiteOptions.theme = 'dark';
        console.log('No saved state, defaulting to dark mode');
    }

    handleUrlParameters(); // Handle URL parameters on init
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

        // Update status bar
        if (window.updateStatus) {
            if (isEditMode) {
                updateStatus('Edit mode ON - Content can now be edited', 'info');
                document.getElementById('status-info').textContent = 'Edit mode: ON';
            } else {
                updateStatus('Edit mode OFF - Content is now locked', 'success');
                document.getElementById('status-info').textContent = 'Edit mode: OFF';
            }
        }

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
        const layout = e.target.value;
        body.setAttribute('data-layout', layout);
        websiteOptions.layout = layout;
        console.log('Layout changed to:', layout);
        saveState();
    });
}

// Theme Control
function setupThemeControl() {
    // Add event listener for theme dropdown changes
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        setColorMode(theme, true);
    });

    // Setup system preference detection and listener for changes
    if (window.matchMedia) {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Setup listener for system preference changes
        try {
            // Modern browsers
            darkModeMediaQuery.addEventListener('change', (e) => {
                if (websiteOptions.theme === 'auto') {
                    const newMode = e.matches ? 'dark' : 'light';
                    setColorMode(newMode, false);
                    console.log('System color preference changed to:', newMode);
                }
            });
        } catch (e) {
            // Fallback for older browsers
            darkModeMediaQuery.addListener((e) => {
                if (websiteOptions.theme === 'auto') {
                    const newMode = e.matches ? 'dark' : 'light';
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
    saveBtn.addEventListener('click', () => {
        const siteName = prompt('Enter the name for your website files (e.g., "MySite" or "folder/MySite"):',
        );
        if (!siteName) return;

        saveWebsiteFiles(siteName);
    });    // Reset Content
    resetBtn.addEventListener('click', () => {
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
    document.addEventListener('click', (e) => {
        const placeholder = e.target.closest('.media-placeholder');
        if (!placeholder) return;

        // Don't trigger file upload if clicking on caption
        if (e.target.classList.contains('media-caption')) return;

        // Only allow file selection in edit mode
        if (!isEditMode) return;

        // Create file input
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
    document.querySelectorAll('.media-placeholder').forEach(placeholder => {        // Check if placeholder already has an image
        if (placeholder.style.backgroundImage && placeholder.style.backgroundImage !== 'none' &&
            placeholder.style.backgroundImage !== '') {
            placeholder.classList.add('has-media');
            const span = placeholder.querySelector('span');
            if (span) span.style.display = 'none';
        }

        // Initialize visibility based on edit mode and has-media class
        updatePlaceholderVisibility(placeholder);
    });
}

function updatePlaceholderVisibility(placeholder) {
    if (!isEditMode && !placeholder.classList.contains('has-media')) {
        placeholder.style.display = 'none';
    } else {
        placeholder.style.display = 'flex';
    }
}

// Dynamic Page Creation and Navigation
function setupDynamicPagesNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's an external link or doesn't start with #
            if (!href || !href.startsWith('#')) return;

            const pageId = href.substring(1); // Remove the #
            const existingPage = document.getElementById(pageId);

            // If page doesn't exist, create it
            if (!existingPage) {
                e.preventDefault(); // Prevent default scroll behavior
                createDynamicPage(pageId, link.textContent);
            }
        });
    });
}

function createDynamicPage(pageId, pageTitle) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Create new page section
    const newPage = document.createElement('section');
    newPage.id = pageId;
    newPage.className = 'dynamic-page';

    // Create page content based on page type
    const pageContent = generatePageContent(pageId, pageTitle, websiteOptions.type);
    newPage.innerHTML = pageContent;

    // Always append to main content - ensures sections are properly contained
    mainContent.appendChild(newPage);

    // Scroll to the new page
    newPage.scrollIntoView({ behavior: 'smooth' });

    // Make elements editable if in edit mode
    if (isEditMode) {
        newPage.querySelectorAll('.editable').forEach(el => {
            el.contentEditable = true;
        });
    }

    console.log(`🆕 Created dynamic page: ${pageId}`);
}

function generatePageContent(pageId, pageTitle, websiteType) {
    const pageTemplates = {
        about: `
            <div class="page-content">
                <h2 class="page-title editable" contenteditable="false">${pageTitle}</h2>
                <div class="page-intro">
                    <p class="editable" contenteditable="false">Learn more about our story, mission, and values.</p>
                </div>
                <div class="content-grid">
                    <div class="content-column">
                        <h3 class="editable" contenteditable="false">Our Story</h3>
                        <p class="editable" contenteditable="false">We started with a simple idea: to create something meaningful that makes a difference in people's lives.</p>
                        <div class="media-placeholder" style="width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin: 1rem 0;">
                            <span>Click to add image (400x200)</span>
                        </div>
                    </div>
                    <div class="content-column">
                        <h3 class="editable" contenteditable="false">Our Mission</h3>
                        <p class="editable" contenteditable="false">To deliver exceptional value and create lasting relationships with our clients through innovation and excellence.</p>
                    </div>
                </div>
            </div>
        `,
        services: `
            <div class="page-content">
                <h2 class="page-title editable" contenteditable="false">${pageTitle}</h2>
                <div class="page-intro">
                    <p class="editable" contenteditable="false">Discover the comprehensive solutions we offer to help you succeed.</p>
                </div>
                <div class="services-grid">
                    <div class="service-card">
                        <div class="media-placeholder" style="width: 100%; height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;">
                            <span>Service Icon (150x150)</span>
                        </div>
                        <h3 class="editable" contenteditable="false">Service One</h3>
                        <p class="editable" contenteditable="false">Description of your first service offering and its benefits.</p>
                    </div>
                    <div class="service-card">
                        <div class="media-placeholder" style="width: 100%; height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;">
                            <span>Service Icon (150x150)</span>
                        </div>
                        <h3 class="editable" contenteditable="false">Service Two</h3>
                        <p class="editable" contenteditable="false">Description of your second service offering and its benefits.</p>
                    </div>
                    <div class="service-card">
                        <div class="media-placeholder" style="width: 100%; height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;">
                            <span>Service Icon (150x150)</span>
                        </div>
                        <h3 class="editable" contenteditable="false">Service Three</h3>
                        <p class="editable" contenteditable="false">Description of your third service offering and its benefits.</p>
                    </div>
                </div>
            </div>
        `,
        portfolio: `
            <div class="page-content">
                <h2 class="page-title editable" contenteditable="false">${pageTitle}</h2>
                <div class="page-intro">
                    <p class="editable" contenteditable="false">Explore our featured work and creative projects.</p>
                </div>
                <div class="portfolio-grid">
                    <div class="portfolio-item">
                        <div class="media-placeholder" style="width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;">
                            <span>Project Image (300x200)</span>
                        </div>
                        <h3 class="editable" contenteditable="false">Project One</h3>
                        <p class="editable" contenteditable="false">Brief description of this portfolio project.</p>
                    </div>
                    <div class="portfolio-item">
                        <div class="media-placeholder" style="width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;">
                            <span>Project Image (300x200)</span>
                        </div>
                        <h3 class="editable" contenteditable="false">Project Two</h3>
                        <p class="editable" contenteditable="false">Brief description of this portfolio project.</p>
                    </div>
                    <div class="portfolio-item">
                        <div class="media-placeholder" style="width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 1rem;">
                            <span>Project Image (300x200)</span>
                        </div>
                        <h3 class="editable" contenteditable="false">Project Three</h3>
                        <p class="editable" contenteditable="false">Brief description of this portfolio project.</p>
                    </div>
                </div>
            </div>
        `,
        contact: `
            <div class="page-content">
                <h2 class="page-title editable" contenteditable="false">${pageTitle}</h2>
                <div class="page-intro">
                    <p class="editable" contenteditable="false">Get in touch with us. We'd love to hear from you!</p>
                </div>
                <div class="contact-content">
                    <div class="contact-info">
                        <h3 class="editable" contenteditable="false">Contact Information</h3>
                        <div class="contact-item">
                            <strong>Email:</strong> <span class="editable" contenteditable="false">info@yourcompany.com</span>
                        </div>
                        <div class="contact-item">
                            <strong>Phone:</strong> <span class="editable" contenteditable="false">(555) 123-4567</span>
                        </div>
                        <div class="contact-item">
                            <strong>Address:</strong> <span class="editable" contenteditable="false">123 Main St, City, State 12345</span>
                        </div>
                    </div>
                    <div class="contact-form">
                        <h3 class="editable" contenteditable="false">Send us a Message</h3>
                        <form>
                            <div class="form-group">
                                <label for="name">Name:</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="message">Message:</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="btn">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        `
    };

    // Return appropriate template or default
    return pageTemplates[pageId.toLowerCase()] || `
        <div class="page-content">
            <h2 class="page-title editable" contenteditable="false">${pageTitle}</h2>
            <div class="page-intro">
                <p class="editable" contenteditable="false">Welcome to the ${pageTitle} page. Add your content here.</p>
            </div>
            <div class="media-placeholder" style="width: 100%; height: 300px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin: 2rem 0;">
                <span>Click to add image (600x300)</span>
            </div>
            <p class="editable" contenteditable="false">This is a dynamically created page. Edit this content to customize your page.</p>
        </div>
    `;
}

// State Management Functions
function saveState() {
    const state = {
        websiteOptions: websiteOptions,
        colorBar: colorBarState,
        isEditMode: isEditMode,
        layout: body.getAttribute('data-layout'),
        theme: body.getAttribute('data-theme'),
        editableContent: {},
        mediaPlaceholders: {}
    };

    // Save all editable content
    document.querySelectorAll('.editable').forEach((el, index) => {
        const id = el.id || `editable-${index}`;
        state.editableContent[id] = el.textContent || el.innerHTML;
    });

    // Update status bar
    if (window.updateStatus) {
        updateStatus('Website state saved', 'success');
    }

    // Save media placeholder states
    document.querySelectorAll('.media-placeholder').forEach((placeholder, index) => {
        const id = placeholder.id || `placeholder-${index}`;
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
        const savedState = localStorage.getItem('websiteBuilderState');
        if (savedState) {
            const state = JSON.parse(savedState);

            // Load website options
            if (state.websiteOptions) {
                websiteOptions = { ...websiteOptions, ...state.websiteOptions };
            }

            // Load color bar state
            if (state.colorBar) {
                colorBarState = { ...colorBarState, ...state.colorBar };
                updateColorBar();
                updateColorBarPreview();
            }

            // Load layout and theme
            if (state.layout) {
                body.setAttribute('data-layout', state.layout);
                if (layoutSelect) layoutSelect.value = state.layout;
            }
            if (state.theme) {
                body.setAttribute('data-theme', state.theme);
                if (themeSelect) themeSelect.value = state.theme;
            }

            // Load editable content
            if (state.editableContent) {
                Object.keys(state.editableContent).forEach(id => {
                    const element = document.getElementById(id) || document.querySelector(`[data-id="${id}"]`);
                    if (element) {
                        element.textContent = state.editableContent[id];
                    }
                });
            }

            // Load media placeholder states
            if (state.mediaPlaceholders) {
                Object.keys(state.mediaPlaceholders).forEach(id => {
                    const placeholder = document.getElementById(id) || document.querySelector(`[data-id="${id}"]`);
                    if (placeholder) {
                        const data = state.mediaPlaceholders[id];
                        if (data.backgroundImage) {
                            placeholder.style.backgroundImage = data.backgroundImage;
                            placeholder.style.backgroundSize = 'cover';
                            placeholder.style.backgroundPosition = 'center';
                        }
                        if (data.hasMedia) {
                            placeholder.classList.add('has-media');
                            const span = placeholder.querySelector('span');
                            if (span) span.style.display = 'none';
                        }
                    }
                });
            }

            console.log('📂 State loaded from localStorage');
        }
    } catch (e) {
        console.error('Error loading saved state:', e);
    }
}

// Color Bar Setup
function setupColorBar() {
    // Create a linear gradient for the color bar with finer hue steps for smoother transition
    const gradientColors = [];
    for (let h = 0; h <= 360; h += 10) { // Reduced step size for more hues
        gradientColors.push(`hsl(${h}, 100%, 50%)`);
    }

    const gradient = `linear-gradient(to right, ${gradientColors.join(', ')})`;
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
    primaryColorPicker.addEventListener('input', (e) => {
        const valueDisplay = primaryColorPicker.nextElementSibling;
        valueDisplay.textContent = e.target.value.toUpperCase();
        applyCustomColors();
        // Also extract HSL from RGB to update the color bar sliders
        const rgb = hexToRgb(e.target.value);
        if (rgb) {
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            colorBarState.hue = Math.round(hsl.h * 360);
            colorBarState.saturation = Math.round(hsl.s * 100);
            colorBarState.lightness = Math.round(hsl.l * 100);
            updateColorBar();
        }
    });

    secondaryColorPicker.addEventListener('input', (e) => {
        const valueDisplay = secondaryColorPicker.nextElementSibling;
        valueDisplay.textContent = e.target.value.toUpperCase();
        applyCustomColors();
    });

    accentColorPicker.addEventListener('input', (e) => {
        const valueDisplay = accentColorPicker.nextElementSibling;
        valueDisplay.textContent = e.target.value.toUpperCase();
        applyCustomColors();
    });

    // Add change event for when color selection is complete
    primaryColorPicker.addEventListener('change', () => {
        if (window.updateStatus) {
            updateStatus(`Primary color set to: ${primaryColorPicker.value.toUpperCase()}`, 'success');
        }
        saveState();
    });

    secondaryColorPicker.addEventListener('change', () => {
        if (window.updateStatus) {
            updateStatus(`Secondary color set to: ${secondaryColorPicker.value.toUpperCase()}`, 'success');
        }
        saveState();
    });

    accentColorPicker.addEventListener('change', () => {
        if (window.updateStatus) {
            updateStatus(`Accent color set to: ${accentColorPicker.value.toUpperCase()}`, 'success');
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
    const computedStyle = getComputedStyle(document.documentElement);

    // Extract colors
    const primaryColor = computedStyle.getPropertyValue('--primary').trim() || '#6366f1';
    const secondaryColor = computedStyle.getPropertyValue('--secondary').trim() || '#64748b';
    const accentColor = computedStyle.getPropertyValue('--accent').trim() || '#10b981';

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
    const primaryRGB = hexToRgb(primaryColorPicker.value);
    if (primaryRGB) {
        // Convert to HSL for better light/dark variants
        const primaryHSL = rgbToHsl(primaryRGB.r, primaryRGB.g, primaryRGB.b);

        // Set light and dark variants using HSL for more natural results
        document.documentElement.style.setProperty(
            '--primary-light',
            `hsl(${Math.round(primaryHSL.h * 360)}, ${Math.min(Math.round(primaryHSL.s * 100) + 10, 100)}%, ${Math.min(Math.round(primaryHSL.l * 100) + 15, 90)}%)`
        );

        document.documentElement.style.setProperty(
            '--primary-dark',
            `hsl(${Math.round(primaryHSL.h * 360)}, ${Math.min(Math.round(primaryHSL.s * 100) + 10, 100)}%, ${Math.max(Math.round(primaryHSL.l * 100) - 15, 15)}%)`
        );

        // Set primary contrast color based on lightness
        const textColor = primaryHSL.l > 0.6 ? '#000000' : '#ffffff';
        document.documentElement.style.setProperty('--primary-contrast', textColor);
    }

    // Apply secondary color variants
    const secondaryRGB = hexToRgb(secondaryColorPicker.value);
    if (secondaryRGB) {
        const secondaryHSL = rgbToHsl(secondaryRGB.r, secondaryRGB.g, secondaryRGB.b);

        document.documentElement.style.setProperty(
            '--secondary-light',
            `hsl(${Math.round(secondaryHSL.h * 360)}, ${Math.min(Math.round(secondaryHSL.s * 100) + 5, 100)}%, ${Math.min(Math.round(secondaryHSL.l * 100) + 15, 90)}%)`
        );

        document.documentElement.style.setProperty(
            '--secondary-dark',
            `hsl(${Math.round(secondaryHSL.h * 360)}, ${Math.min(Math.round(secondaryHSL.s * 100) + 10, 100)}%, ${Math.max(Math.round(secondaryHSL.l * 100) - 15, 15)}%)`
        );

        const textColor = secondaryHSL.l > 0.6 ? '#000000' : '#ffffff';
        document.documentElement.style.setProperty('--secondary-contrast', textColor);
    }

    // Apply accent color variants
    const accentRGB = hexToRgb(accentColorPicker.value);
    if (accentRGB) {
        const accentHSL = rgbToHsl(accentRGB.r, accentRGB.g, accentRGB.b);

        document.documentElement.style.setProperty(
            '--accent-light',
            `hsl(${Math.round(accentHSL.h * 360)}, ${Math.min(Math.round(accentHSL.s * 100) + 5, 100)}%, ${Math.min(Math.round(accentHSL.l * 100) + 15, 90)}%)`
        );

        document.documentElement.style.setProperty(
            '--accent-dark',
            `hsl(${Math.round(accentHSL.h * 360)}, ${Math.min(Math.round(accentHSL.s * 100) + 10, 100)}%, ${Math.max(Math.round(accentHSL.l * 100) - 15, 15)}%)`
        );

        const textColor = accentHSL.l > 0.6 ? '#000000' : '#ffffff';
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
        const reflow = element.offsetHeight;
        // Apply a small transform to force GPU rendering
        element.style.transform = 'translateZ(0)';
        // Remove transform after a short delay
        setTimeout(() => {
            element.style.transform = '';
        }, 50);
    }

    // Use both 'input' and 'change' events to ensure updates happen during sliding and on release
    colorBar.addEventListener('input', (e) => {
        updateColorFromSlider();
        // Force repaint to fix multiple handles issue
        forceRepaint(e.target);
    });

    colorBar.addEventListener('change', (e) => {
        updateColorFromSlider();
        // Provide feedback when the user finishes selecting a color
        if (window.updateStatus) {
            updateStatus(`Color hue set to: ${colorBarState.hue}°`, 'success');
        }
        forceRepaint(e.target);
    });

    // Update interface when light/saturation sliders change
    lightnessSlider.addEventListener('input', updateColorFromLightnessSaturation);
    saturationSlider.addEventListener('input', updateColorFromLightnessSaturation);

    // Add click event on the color bar for direct color selection
    colorBar.parentElement.addEventListener('click', (e) => {
        // Only handle clicks on the wrapper, not the slider itself
        if (e.target === colorBar) return;

        // Calculate position percentage
        const rect = colorBar.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;

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
    const hue = colorBarState.hue;
    const saturation = colorBarState.saturation;
    const lightness = colorBarState.lightness;

    // Update HSL
    const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    // Convert to RGB
    const rgb = hslToRgb(hue / 360, saturation / 100, lightness / 100);
    colorBarState.currentColorRgb = rgb;

    // Convert RGB to HEX
    const hex = '#' +
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
    document.documentElement.style.setProperty(
        '--primary-light',
        `hsl(${hue}, ${Math.min(saturation + 15, 100)}%, ${Math.min(lightness + 15, 90)}%)`
    );
    document.documentElement.style.setProperty(
        '--primary-dark',
        `hsl(${hue}, ${Math.min(saturation + 10, 100)}%, ${Math.max(lightness - 15, 20)}%)`
    );

    // Update accent color with complementary hue
    const accentHue = (hue + 180) % 360;
    document.documentElement.style.setProperty(
        '--accent',
        `hsl(${accentHue}, ${saturation}%, ${lightness}%)`
    );

    // Update status when colors change
    if (window.updateStatus) {
        updateStatus(`Color updated: ${hex}`, 'info');
    }

    // Update indicator position
    updateColorIndicator();
}

function updateColorIndicator() {
    if (!colorBar) return;

    // We're now using the slider thumb as the indicator instead of a separate element
    // This helps prevent the multiple vertical lines issue

    // Update the background color of the handle through a custom property
    const hslColor = `hsl(${colorBarState.hue}, 100%, 50%)`;
    const sliderTrack = colorBar.parentElement;

    if (sliderTrack) {
        // Add a data attribute to help with styling
        sliderTrack.setAttribute('data-current-hue', colorBarState.hue);

        // Add a small pseudo-element with the current color above the slider
        sliderTrack.style.setProperty('--current-color', hslColor);
    }

    // If we still have the indicator element, update it too for backward compatibility
    if (colorIndicator) {
        const percent = (colorBarState.hue / 360) * 100;
        colorIndicator.style.left = `${percent}%`;
        colorIndicator.style.backgroundColor = hslColor;
    }
}

// Color utility functions
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    hex = hex.trim();
    if (hex.startsWith('rgb')) {
        const match = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3])
            };
        }
        return null;
    }

    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(rgb) {
    if (!rgb) return '#000000';

    // Check if already in hex format
    if (rgb.startsWith('#')) return rgb;

    // Extract RGB values
    let match;
    if (rgb.startsWith('rgb')) {
        match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    }

    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    return '#000000'; // Default fallback
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
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

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        // Achromatic (gray)
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

    return { h, s, l };
}

// Function to fix position of any dynamic pages that might be outside the main content
function fixDynamicPagesPosition() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Find all dynamic pages outside of main content
    const dynamicPages = document.querySelectorAll('.dynamic-page');

    dynamicPages.forEach(page => {
        // Check if this page is not inside main-content
        if (page.parentNode !== mainContent) {
            console.log(`Moving ${page.id} section into main-content area`);
            mainContent.appendChild(page);
        }
    });

    if (window.updateStatus) {
        updateStatus('Dynamic page positions corrected', 'success');
    }
}

// Set up a MutationObserver to ensure sections stay in main content
function setupSectionObserver() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const bodyElement = document.body;

    // Create a mutation observer to watch for new sections added to the document
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Check for added nodes
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    // If it's an element node and it's a section with dynamic-page class
                    if (node.nodeType === 1 &&
                        node.tagName === 'SECTION' &&
                        node.classList.contains('dynamic-page') &&
                        node.parentNode !== mainContent) {

                        console.log(`Observer: Moving ${node.id || 'unnamed'} section into main-content`);
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
function setColorMode(mode = 'dark', savePreference = true) {
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
        const themeExists = Array.from(themeSelect.options).some(option => option.value === mode);
        themeSelect.value = themeExists ? mode : (mode === 'dark' ? 'dark' : 'light');
    }

    // Apply theme-appropriate colors and update UI
    updateColorPickersFromTheme();
    updateColorBar();
    updateColorBarPreview();

    // Provide feedback
    if (window.updateStatus) {
        updateStatus(`Theme set to: ${mode}`, 'info');
    }

    // Save preference if requested
    if (savePreference) {
        saveState();
    }

    return mode;
}