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

// Extend Window interface to include the updateStatus function
interface Window {
  updateStatus?: (message: string, type?: string) => void;
}

// TypeScript Interfaces
interface DragOffset {
  x: number;
  y: number;
}

interface WebsiteOptions {
  type: string;
  title: string;
  subtitle: string;
  theme: string;
  layout: string;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ColorBarState {
  hue: number;
  saturation: number;
  lightness: number;
  currentColorRgb: RGB;
  currentColorHex: string;
  customColors: CustomColors;
}

interface MediaPlaceholderState {
  backgroundImage: string;
  hasMedia: boolean;
}

interface WebsiteState {
  websiteOptions: WebsiteOptions;
  colorBar: ColorBarState;
  isEditMode: boolean;
  layout: string;
  theme: string;
  editableContent: Record<string, string>;
  mediaPlaceholders: Record<string, MediaPlaceholderState>;
}

// Function to apply website options (stub for now - will be implemented later)
function applyWebsiteOptions(): void {
  // Apply website options from the websiteOptions object
  if (!websiteOptions) return;
  
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
function updateStatus(message: string, type: string = 'info'): void {
  if (window.updateStatus) {
    window.updateStatus(message, type);
  } else {
    console.log(`Status: [${type}] ${message}`);
  }
}

// Handle URL parameters (stub for now - will be implemented as needed)
function handleUrlParameters(): void {
  // Implementation will go here
}

// State management
let isEditMode = false;
let isDragging = false;
let dragOffset: DragOffset = { x: 0, y: 0 };
let isMinimized = false;

// Website options (replaces URL parameters)
let websiteOptions: WebsiteOptions = {
    type: 'business',
    title: 'Your Amazing Website',
    subtitle: 'Build something beautiful today',
    theme: 'dark',
    layout: 'top-nav'
};

// Color Bar State
let colorBarState: ColorBarState = {
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
let body: HTMLBodyElement;
let controlPanel: HTMLElement;
let controlPanelBody: HTMLElement; 
let minimizeBtn: HTMLButtonElement;
let editModeToggle: HTMLButtonElement;
let layoutSelect: HTMLSelectElement;
let themeSelect: HTMLSelectElement;
let saveBtn: HTMLButtonElement;
let resetBtn: HTMLButtonElement;
let colorBar: HTMLInputElement;
let lightnessSlider: HTMLInputElement;
let saturationSlider: HTMLInputElement;
let primaryColorPicker: HTMLInputElement;
let secondaryColorPicker: HTMLInputElement;
let accentColorPicker: HTMLInputElement;
let colorIndicator: HTMLElement;
let colorPreviewBox: HTMLElement;

/**
 * Initialize all DOM elements needed by the website builder
 * Adds proper TypeScript type casting to avoid null issues
 */
function initializeElements(): void {
    body = document.body;
    controlPanel = document.getElementById('control-panel') as HTMLElement;
    controlPanelBody = controlPanel.querySelector('.control-panel-body') as HTMLElement;
    minimizeBtn = document.getElementById('minimize-btn') as HTMLButtonElement;
    editModeToggle = document.getElementById('edit-mode-toggle') as HTMLButtonElement;
    layoutSelect = document.getElementById('layout-select') as HTMLSelectElement;
    themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
    saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
    resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
    
    // Color related elements
    colorBar = document.getElementById('color-bar') as HTMLInputElement;
    lightnessSlider = document.getElementById('lightness-slider') as HTMLInputElement;
    saturationSlider = document.getElementById('saturation-slider') as HTMLInputElement;
    primaryColorPicker = document.getElementById('primary-color') as HTMLInputElement;
    secondaryColorPicker = document.getElementById('secondary-color') as HTMLInputElement;
    accentColorPicker = document.getElementById('accent-color') as HTMLInputElement;
    colorIndicator = document.getElementById('color-indicator') as HTMLElement;
    colorPreviewBox = document.getElementById('color-bar-preview') as HTMLElement;
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

/**
 * Sets up media placeholders and add media functionality for all editable elements
 * - Allows clicking on media placeholders to add media
 * - Adds ability to insert media above or below any editable element
 */
function setupMediaPlaceholders() {
    // Use event delegation to handle both existing and dynamically created placeholders
    document.addEventListener('click', (e) => {
        const placeholder = e.target.closest('.media-placeholder');
        if (placeholder) {
            // Don't trigger file upload if clicking on caption
            if (e.target.classList.contains('media-caption')) return;

            // Only allow file selection in edit mode
            if (!isEditMode) return;

            addMediaToPlaceholder(placeholder);
        }
    });
    
    // Add right-click context menu to all editable elements
    document.addEventListener('contextmenu', (e) => {
        if (!isEditMode) return;
        
        const editableElement = e.target.closest('.editable');
        if (!editableElement) return;
        
        e.preventDefault();
        
        showMediaContextMenu(e, editableElement);
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
                } else if (file.type.startsWith('video/')) {
                    // Handle video
                    const video = document.createElement('video');
                    video.src = e.target.result as string;
                    video.controls = true;
                    video.style.width = '100%';
                    video.style.height = '100%';
                    placeholder.innerHTML = '';
                    placeholder.appendChild(video);
                } else if (file.type.startsWith('audio/')) {
                    // Handle audio
                    const audio = document.createElement('audio');
                    audio.src = e.target.result as string;
                    audio.controls = true;
                    audio.style.width = '100%';
                    placeholder.innerHTML = '';
                    placeholder.appendChild(audio);
                }
                
                const span = placeholder.querySelector('span');
                if (span) span.style.display = 'none';
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
 * Creates and displays a context menu for adding media around editable elements
 * @param {MouseEvent} e - The mouse event that triggered the context menu
 * @param {HTMLElement} element - The editable element to add media around
 */
function showMediaContextMenu(e, element) {
    // Remove any existing context menu
    const existingMenu = document.querySelector('.media-context-menu');
    if (existingMenu) existingMenu.remove();
    
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
    
    // Add options
    const addMediaAbove = document.createElement('div');
    addMediaAbove.className = 'media-context-menu-item';
    addMediaAbove.textContent = 'Add media above';
    addMediaAbove.style.padding = '8px 16px';
    addMediaAbove.style.cursor = 'pointer';
    addMediaAbove.style.hover = 'background: var(--neutral-100)';
    
    const addMediaBelow = document.createElement('div');
    addMediaBelow.className = 'media-context-menu-item';
    addMediaBelow.textContent = 'Add media below';
    addMediaBelow.style.padding = '8px 16px';
    addMediaBelow.style.cursor = 'pointer';
    
    // Add event listeners
    addMediaAbove.addEventListener('click', () => {
        addMediaNearElement(element, 'above');
        menu.remove();
    });
    
    addMediaBelow.addEventListener('click', () => {
        addMediaNearElement(element, 'below');
        menu.remove();
    });
    
    // Add items to menu
    menu.appendChild(addMediaAbove);
    menu.appendChild(addMediaBelow);
    
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
    } else {
        if (element.nextSibling) {
            element.parentNode.insertBefore(placeholder, element.nextSibling);
        } else {
            element.parentNode.appendChild(placeholder);
        }
    }
    
    // Show notification
    if (window.updateStatus) {
        updateStatus(`Media placeholder added ${position} the element`, 'info');
    }
}

/**
 * Adds media controls to all editable elements
 */
function setupEditableElementsMediaControls() {
    // Add info to status bar about right-click functionality
    const editModeToggle = document.getElementById('edit-mode-toggle');
    
    editModeToggle.addEventListener('click', () => {
        if (isEditMode) {
            const statusInfo = document.getElementById('status-info');
            if (statusInfo) {
                const originalText = statusInfo.textContent;
                statusInfo.textContent = originalText + ' | Right-click editable text to add media';
                
                // Reset after 5 seconds
                setTimeout(() => {
                    if (isEditMode) {
                        statusInfo.textContent = originalText;
                    }
                }, 5000);
            }
        }
    });
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

/**
 * Generates the content for different types of pages
 * @param {string} pageId - The ID of the page to generate
 * @param {string} pageTitle - The title of the page
 * @param {string} websiteType - The type of website (business, portfolio, etc.)
 * @returns {string} - The HTML content for the page
 */
function generatePageContent(pageId, pageTitle, websiteType) {
    const pageTemplates = {
        about: `