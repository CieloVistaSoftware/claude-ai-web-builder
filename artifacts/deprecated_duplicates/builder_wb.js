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
    theme: 'light',
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
let body, controlPanel, controlPanelBody, minimizeBtn, editModeToggle, layoutSelect, themeSelect, saveBtn, resetBtn;
let colorBar, lightnessSlider, saturationSlider, primaryColorPicker, secondaryColorPicker, accentColorPicker, colorIndicator, colorPreviewBox;

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
    colorPreviewBox = document.getElementById('color-preview-box');
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
    loadSavedState();
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
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        body.setAttribute('data-theme', theme);
        websiteOptions.theme = theme;
        console.log('Theme changed to:', theme);
        
        // Update status bar
        if (window.updateStatus) {
            updateStatus(`Theme changed to: ${theme}`, 'info');
        }
        
        saveState();
    });
}

// Button Actions
function setupButtonActions() {
    // Save Website Files
    saveBtn.addEventListener('click', () => {
        const siteName = prompt('Enter the name for your website files (e.g., "MySite" or "folder/MySite"):');
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
            
            // Update color controls
            updateColorBar();
            updateColorBarPreview();
            
            console.log('🔄 Website reset to default options');
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
    
    // Insert the page before the footer
    const footer = document.getElementById('site-footer');
    if (footer) {
        footer.parentNode.insertBefore(newPage, footer);
    } else {
        mainContent.appendChild(newPage);
    }
    
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