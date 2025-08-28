/**
 * Claude AI Website Builder - wb.ts
 *
 * This file contains the main functionality for the Claude AI Website Builder application.
 * It provides a user-friendly interface for building, customizing, and exporting websites
 * with dynamic content, themes, layouts, and media support.
 *
 * Features:
 * - Edit mode for modifying website content
 * - Theme selection and color customization
 * - Layout switching (top, left, right navigation)
 * - Media placeholders for images, videos, and audio
 * - Dynamic page creation
 * - State management for saving/restoring website settings
 * - Export functionality for generated websites
 *
 * Used by: wb.html (main website builder interface)
 */
// Function to apply website options (stub for now - will be implemented later)
function applyWebsiteOptions() {
    // Apply website options from the websiteOptions object
    if (!websiteOptions)
        return;
    // Set title and subtitle if they exist
    const siteTitle = document.getElementById('site-title');
    const siteSubtitle = document.getElementById('site-subtitle');
    if (siteTitle && websiteOptions.title) {
        siteTitle.textContent = websiteOptions.title;
    }
    if (siteSubtitle && websiteOptions.subtitle) {
        siteSubtitle.textContent = websiteOptions.subtitle;
    }
    // Apply theme and layout
    if (websiteOptions.theme) {
        setColorMode(websiteOptions.theme, false);
    }
    if (websiteOptions.layout && body) {
        body.setAttribute('data-layout', websiteOptions.layout);
    }
}
// Status bar utility function
function updateStatus(message, type = 'info') {
    if (window.updateStatus) {
        window.updateStatus(message, type);
    }
    else {
        console.log(`Status: [${type}] ${message}`);
    }
}
// Handle URL parameters (stub for now - will be implemented as needed)
function handleUrlParameters() {
    // Implementation will go here
}
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
let body;
let controlPanel;
let controlPanelBody;
let minimizeBtn;
let editModeToggle;
let layoutSelect;
let themeSelect;
let saveBtn;
let resetBtn;
let colorBar;
let lightnessSlider;
let saturationSlider;
let primaryColorPicker;
let secondaryColorPicker;
let accentColorPicker;
let colorIndicator;
let colorPreviewBox;
/**
 * Initialize all DOM elements needed by the website builder
 * Adds proper TypeScript type casting to avoid null issues
 */
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
        if (e.target.closest('button'))
            return;
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
        minimizeBtn.textContent = isMinimized ? '▲' : '▼';
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
            }
            else {
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
        }
        catch (e) {
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
        const siteName = prompt('Enter the name for your website files (e.g., "MySite" or "folder/MySite"):');
        if (!siteName)
            return;
        saveWebsiteFiles(siteName);
    }); // Reset Content
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
/**
 * Sets up media placeholders and add media functionality for all web elements
 * - Allows clicking on media placeholders to add media
 * - Adds ability to insert media above or below ANY web element
 * - Supports transforming elements into media containers
 */
function setupMediaPlaceholders() {
    // Use event delegation to handle both existing and dynamically created placeholders
    document.addEventListener('click', (e) => {
        const placeholder = e.target.closest('.media-placeholder');
        if (placeholder) {
            // Don't trigger file upload if clicking on caption
            if (e.target.classList.contains('media-caption'))
                return;
            // Only allow file selection in edit mode
            if (!isEditMode)
                return;
            addMediaToPlaceholder(placeholder);
        }
    });
    
    // Add right-click context menu to ALL elements when in edit mode
    document.addEventListener('contextmenu', (e) => {
        if (!isEditMode)
            return;
            
        // Skip elements we definitely don't want to add media to
        const skipElements = ['HTML', 'BODY', 'SCRIPT', 'STYLE', 'LINK', 'META', 'TITLE', 'HEAD'];
        if (skipElements.includes(e.target.tagName))
            return;
            
        // Get the closest meaningful element - first try editable, then any reasonable element
        let targetElement = e.target.closest('.editable');
        
        // If no editable element found, find the closest meaningful element
        if (!targetElement) {
            targetElement = e.target.closest('div, section, article, aside, header, footer, nav, main, p, h1, h2, h3, h4, h5, h6, ul, ol, li, span, a');
        }
        
        if (!targetElement)
            return;
            
        e.preventDefault();
        showMediaContextMenu(e, targetElement);
    });
    
    // Initialize existing placeholders
    initializeExistingPlaceholders();
    
    // Setup media controls for editable elements
    setupEditableElementsMediaControls();
}
/**
 * Adds media to an existing placeholder
 * @param {HTMLElement} placeholder - The placeholder element to add media to
 */
function addMediaToPlaceholder(placeholder) {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*,audio/*';
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (file.type.startsWith('image/')) {
                    // Handle image
                    placeholder.style.backgroundImage = `url(${e.target.result})`;
                    placeholder.style.backgroundSize = 'cover';
                    placeholder.style.backgroundPosition = 'center';
                }
                else if (file.type.startsWith('video/')) {
                    // Handle video
                    const video = document.createElement('video');
                    video.src = e.target.result;
                    video.controls = true;
                    video.style.width = '100%';
                    video.style.height = '100%';
                    placeholder.innerHTML = '';
                    placeholder.appendChild(video);
                }
                else if (file.type.startsWith('audio/')) {
                    // Handle audio
                    const audio = document.createElement('audio');
                    audio.src = e.target.result;
                    audio.controls = true;
                    audio.style.width = '100%';
                    placeholder.innerHTML = '';
                    placeholder.appendChild(audio);
                }
                const span = placeholder.querySelector('span');
                if (span)
                    span.style.display = 'none';
                placeholder.classList.add('has-media');
                placeholder.setAttribute('data-media-type', file.type.split('/')[0]);
                // Save state after media is loaded
                saveState();
            };
            reader.readAsDataURL(file);
        }
    });
    // Trigger file picker
    input.click();
}
/**
 * Creates and displays a context menu for adding media to or around any web element
 * @param {MouseEvent} e - The mouse event that triggered the context menu
 * @param {HTMLElement} element - The element to add media to or around
 */
function showMediaContextMenu(e, element) {
    // Remove any existing context menu
    const existingMenu = document.querySelector('.media-context-menu');
    if (existingMenu)
        existingMenu.remove();
        
    // Create context menu
    const menu = document.createElement('div');
    menu.className = 'media-context-menu';
    menu.style.position = 'absolute';
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.style.background = 'var(--surface, #ffffff)';
    menu.style.border = '1px solid var(--border-color, #e0e0e0)';
    menu.style.borderRadius = '4px';
    menu.style.padding = '8px 0';
    menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    menu.style.zIndex = '1000';
    
    // Add section heading
    const menuTitle = document.createElement('div');
    menuTitle.className = 'media-context-menu-title';
    menuTitle.textContent = 'Add Media';
    menuTitle.style.padding = '4px 16px';
    menuTitle.style.fontWeight = 'bold';
    menuTitle.style.borderBottom = '1px solid var(--border-color, #e0e0e0)';
    menuTitle.style.marginBottom = '4px';
    
    // Add separator function
    function addSeparator() {
        const separator = document.createElement('div');
        separator.className = 'media-context-menu-separator';
        separator.style.height = '1px';
        separator.style.background = 'var(--border-color, #e0e0e0)';
        separator.style.margin = '4px 0';
        menu.appendChild(separator);
    }
    
    // Add menu item function
    function addMenuItem(text, clickHandler) {
        const item = document.createElement('div');
        item.className = 'media-context-menu-item';
        item.textContent = text;
        item.style.padding = '8px 16px';
        item.style.cursor = 'pointer';
        
        // Add hover effect
        item.addEventListener('mouseover', () => {
            item.style.background = 'var(--neutral-100, #f0f0f0)';
        });
        item.addEventListener('mouseout', () => {
            item.style.background = 'transparent';
        });
        
        item.addEventListener('click', () => {
            clickHandler();
            menu.remove();
        });
        menu.appendChild(item);
        return item;
    }
    
    // Add menu items
    menu.appendChild(menuTitle);
    
    // Position options
    addMenuItem('Add media above', () => addMediaNearElement(element, 'above'));
    addMenuItem('Add media below', () => addMediaNearElement(element, 'below'));
    
    addSeparator();
    
    // Transform options
    addMenuItem('Replace with media', () => transformElementToMedia(element));
    addMenuItem('Add media background', () => addMediaBackground(element));
    
    if (element.tagName === 'DIV' || element.tagName === 'SECTION') {
        addSeparator();
        addMenuItem('Add media inside (start)', () => addMediaInsideElement(element, 'start'));
        addMenuItem('Add media inside (end)', () => addMediaInsideElement(element, 'end'));
    }
    
    // Add menu to document
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu() {
        menu.remove();
        document.removeEventListener('click', closeMenu);
    });
}
/**
 * Adds media above or below an editable element
 * @param {HTMLElement} element - The element to add media near
 * @param {string} position - Whether to add media 'above' or 'below' the element
 */
function addMediaNearElement(element, position) {
    // Create a new media placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'media-placeholder';
    placeholder.style.width = '100%';
    placeholder.style.height = '200px';
    placeholder.style.background = '#f0f0f0';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.borderRadius = '8px';
    placeholder.style.margin = '1rem 0';
    // Add span with text
    const span = document.createElement('span');
    span.textContent = 'Click to add media';
    placeholder.appendChild(span);
    // Insert before or after the element
    if (position === 'above') {
        element.parentNode.insertBefore(placeholder, element);
    }
    else {
        if (element.nextSibling) {
            element.parentNode.insertBefore(placeholder, element.nextSibling);
        }
        else {
            element.parentNode.appendChild(placeholder);
        }
    }
    // Show notification
    if (window.updateStatus) {
        updateStatus(`Media placeholder added ${position} the element`, 'info');
    }
}
/**
 * Adds media controls to all web elements
 */
function setupEditableElementsMediaControls() {
    // Add info to status bar about right-click functionality
    const editModeToggle = document.getElementById('edit-mode-toggle');
    editModeToggle.addEventListener('click', () => {
        if (isEditMode) {
            const statusInfo = document.getElementById('status-info');
            if (statusInfo) {
                const originalText = statusInfo.textContent;
                statusInfo.textContent = originalText + ' | Right-click any element to add media';
                
                // Display a more visible notification
                const notification = document.createElement('div');
                notification.className = 'media-notification';
                notification.textContent = 'Right-click ANY element to add media';
                notification.style.position = 'fixed';
                notification.style.top = '60px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.background = 'var(--accent-color, #28a745)';
                notification.style.color = 'white';
                notification.style.padding = '10px 20px';
                notification.style.borderRadius = '5px';
                notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                notification.style.zIndex = '1001';
                notification.style.transition = 'opacity 0.5s ease-in-out';
                
                document.body.appendChild(notification);
                
                // Reset after 5 seconds
                setTimeout(() => {
                    if (isEditMode) {
                        statusInfo.textContent = originalText;
                        notification.style.opacity = '0';
                        setTimeout(() => notification.remove(), 500);
                    }
                }, 5000);
            }
        }
    });
    
    // Show tip when hovering over web elements in edit mode
    document.addEventListener('mouseover', (e) => {
        if (!isEditMode) return;
        
        // Skip certain elements
        const skipElements = ['HTML', 'BODY', 'SCRIPT', 'STYLE'];
        if (skipElements.includes(e.target.tagName)) return;
        
        // Add a data attribute to show the tip is available
        e.target.setAttribute('data-media-tip', 'right-click to add media');
    });
}
function initializeExistingPlaceholders() {
    document.querySelectorAll('.media-placeholder').forEach(placeholder => {
        if (placeholder.style.backgroundImage && placeholder.style.backgroundImage !== 'none' &&
            placeholder.style.backgroundImage !== '') {
            placeholder.classList.add('has-media');
            const span = placeholder.querySelector('span');
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

/**
 * Transforms an existing element into a media element
 * @param {HTMLElement} element - The element to transform
 */
function transformElementToMedia(element) {
    // Store original content in data attribute (for potential restore)
    const originalContent = element.innerHTML;
    element.setAttribute('data-original-content', originalContent);
    
    // Create media placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'media-placeholder';
    placeholder.style.width = '100%';
    placeholder.style.height = '200px';
    placeholder.style.background = '#f0f0f0';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.borderRadius = '8px';
    placeholder.style.margin = '1rem 0';
    
    // Add span with text
    const span = document.createElement('span');
    span.textContent = 'Click to add media';
    placeholder.appendChild(span);
    
    // Clear the element and add the placeholder
    element.innerHTML = '';
    element.appendChild(placeholder);
    
    // Add the original class of the element to maintain styling
    element.classList.add('element-transformed-to-media');
    
    // Show notification
    updateStatus('Element transformed into media element', 'info');
    
    // Add click handler to add media
    placeholder.addEventListener('click', () => {
        if (isEditMode) {
            addMediaToPlaceholder(placeholder);
        }
    });
}

/**
 * Adds a media background to an element
 * @param {HTMLElement} element - The element to add a media background to
 */
function addMediaBackground(element) {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Save original background if any
                const originalBg = element.style.backgroundImage;
                if (originalBg) {
                    element.setAttribute('data-original-bg', originalBg);
                }
                
                // Apply background image
                element.style.backgroundImage = `url(${e.target.result})`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
                element.classList.add('has-media-background');
                
                // Save state
                saveState();
                updateStatus('Media background added to element', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Trigger file picker
    input.click();
}

/**
 * Adds media inside an element at the start or end
 * @param {HTMLElement} element - The element to add media inside
 * @param {string} position - Whether to add media at the 'start' or 'end' of the element
 */
function addMediaInsideElement(element, position) {
    // Create a new media placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'media-placeholder';
    placeholder.style.width = '100%';
    placeholder.style.height = '200px';
    placeholder.style.background = '#f0f0f0';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.borderRadius = '8px';
    placeholder.style.margin = '1rem 0';
    
    // Add span with text
    const span = document.createElement('span');
    span.textContent = 'Click to add media';
    placeholder.appendChild(span);
    
    // Insert at start or end of element
    if (position === 'start') {
        if (element.firstChild) {
            element.insertBefore(placeholder, element.firstChild);
        } else {
            element.appendChild(placeholder);
        }
    } else {
        element.appendChild(placeholder);
    }
    
    // Show notification
    updateStatus(`Media placeholder added inside element (${position})`, 'info');
}
// Dynamic Page Creation and Navigation
function setupDynamicPagesNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Skip if it's an external link or doesn't start with #
            if (!href || !href.startsWith('#'))
                return;
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
    if (!mainContent)
        return;
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
/**
 * Generates the content for different types of pages
 * @param {string} pageId - The ID of the page to generate
 * @param {string} pageTitle - The title of the page
 * @param {string} websiteType - The type of website (business, portfolio, etc.)
 * @returns {string} - The HTML content for the page
 */
function generatePageContent(pageId, pageTitle, websiteType) {
    const pageTemplates = {
        about: `<h2 class="section-title editable" contenteditable="false">${pageTitle}</h2>
                <div class="content-card">
                    <p class="card-description editable" contenteditable="false">
                        This is the ${pageTitle} page. Edit this content to tell visitors about your organization.
                    </p>
                    <div class="media-placeholder">
                        <span>Click to add media</span>
                    </div>
                </div>`,
        services: `<h2 class="section-title editable" contenteditable="false">${pageTitle}</h2>
                  <div class="content-grid">
                      <div class="content-card">
                          <h3 class="card-title editable" contenteditable="false">Service One</h3>
                          <p class="card-description editable" contenteditable="false">
                              Description of your first service offering.
                          </p>
                      </div>
                      <div class="content-card">
                          <h3 class="card-title editable" contenteditable="false">Service Two</h3>
                          <p class="card-description editable" contenteditable="false">
                              Description of your second service offering.
                          </p>
                      </div>
                      <div class="content-card">
                          <h3 class="card-title editable" contenteditable="false">Service Three</h3>
                          <p class="card-description editable" contenteditable="false">
                              Description of your third service offering.
                          </p>
                      </div>
                  </div>`,
        portfolio: `<h2 class="section-title editable" contenteditable="false">${pageTitle}</h2>
                   <div class="content-grid">
                       <div class="media-placeholder">
                           <span>Portfolio item 1</span>
                       </div>
                       <div class="media-placeholder">
                           <span>Portfolio item 2</span>
                       </div>
                       <div class="media-placeholder">
                           <span>Portfolio item 3</span>
                       </div>
                   </div>`,
        contact: `<h2 class="section-title editable" contenteditable="false">${pageTitle}</h2>
                 <div class="content-card">
                     <p class="card-description editable" contenteditable="false">
                         Get in touch with us using the contact information below.
                     </p>
                     <div class="contact-form">
                         <div class="form-group">
                             <label for="name" class="editable" contenteditable="false">Name</label>
                             <input type="text" id="name" placeholder="Your name">
                         </div>
                         <div class="form-group">
                             <label for="email" class="editable" contenteditable="false">Email</label>
                             <input type="email" id="email" placeholder="Your email">
                         </div>
                         <div class="form-group">
                             <label for="message" class="editable" contenteditable="false">Message</label>
                             <textarea id="message" placeholder="Your message"></textarea>
                         </div>
                         <button type="submit" class="editable" contenteditable="false">Send Message</button>
                     </div>
                 </div>`
    };
    
    // Return the template for the requested page, or a generic template if not found
    return pageTemplates[pageId] || `<h2 class="section-title editable" contenteditable="false">${pageTitle}</h2>
                                    <div class="content-card">
                                        <p class="card-description editable" contenteditable="false">
                                            This is the ${pageTitle} page. Add your content here.
                                        </p>
                                    </div>`;
}
