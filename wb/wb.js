// Website Builder - Main JavaScript Module
// Claude AI Website Builder
// 
// This file contains the core functionality for the website builder including:
// - Edit mode management
// - Dynamic page creation
// - Media placeholder handling
// - State management

"use strict";

// State management variables
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

// DOM Elements (core website elements only)
let body;
let mainContent;
let siteNav;
let siteFooter;

// Initialize DOM elements (only core website elements)
function initializeElements() {
    try {
        body = document.body;
        mainContent = document.getElementById('main-content');
        siteNav = document.getElementById('site-nav');
        siteFooter = document.getElementById('site-footer');
        
        if (!mainContent) {
            console.warn('Main content not found');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Failed to initialize core elements:', error);
        return false;
    }
}

// Initialize
function init() {
    if (!initializeElements()) {
        console.error('Failed to initialize core elements');
        return;
    }
    
    setupMediaPlaceholders();
    setupDynamicPagesNavigation();
    setupThemeEventListeners();
    loadSavedState();
    
    console.log('wb.js initialized successfully');
}

// Theme event listeners
function setupThemeEventListeners() {
    // Listen for theme changes from any source
    document.addEventListener('theme:color-changed', (event) => {
        const { colors } = event.detail;
        applyColorsToSite(colors);
        saveState();
    });
    
    document.addEventListener('theme:layout-changed', (event) => {
        const { layout } = event.detail;
        body.setAttribute('data-layout', layout);
        websiteOptions.layout = layout;
        saveState();
    });
    
    document.addEventListener('theme:edit-mode-changed', (event) => {
        const { isEditMode: editMode } = event.detail;
        handleEditModeChange(editMode);
    });
    
    document.addEventListener('theme:save-requested', () => {
        saveWebsiteToFile();
    });
    
    document.addEventListener('theme:reset-requested', () => {
        resetWebsiteContent();
    });
}

function applyColorsToSite(colors) {
    // Apply colors without depending on control panel
    const root = document.documentElement;
    if (colors.primary) root.style.setProperty('--primary', colors.primary);
    if (colors.secondary) root.style.setProperty('--secondary', colors.secondary);
    if (colors.accent) root.style.setProperty('--accent', colors.accent);
    
    // Also set the alternate property names for compatibility
    if (colors.primary) root.style.setProperty('--color-primary', colors.primary);
    if (colors.secondary) root.style.setProperty('--color-secondary', colors.secondary);
    if (colors.accent) root.style.setProperty('--color-accent', colors.accent);
    
    if (window.updateStatus) {
        window.updateStatus('Colors applied to website', 'success');
    }
}

function handleEditModeChange(editMode) {
    isEditMode = editMode;
    body.classList.toggle('edit-mode', isEditMode);
    
    // Handle editable elements
    const editables = document.querySelectorAll('.editable');
    editables.forEach(el => {
        el.contentEditable = String(isEditMode);
    });
    
    // Handle media placeholders
    const mediaPlaceholders = document.querySelectorAll('.media-placeholder');
    mediaPlaceholders.forEach(placeholder => {
        if (!isEditMode && !placeholder.classList.contains('has-media')) {
            placeholder.style.display = 'none';
        } else if (isEditMode) {
            placeholder.style.display = 'flex';
        }
    });
    
    // Update status
    if (window.updateStatus) {
        const statusInfo = document.getElementById('status-info');
        if (statusInfo) {
            statusInfo.textContent = `Edit mode: ${isEditMode ? 'ON' : 'OFF'}`;
        }
        window.updateStatus(isEditMode ? 'Edit mode active' : 'Edit mode disabled', 'success');
    }
}

// Media Placeholders with File Explorer
function setupMediaPlaceholders() {
    // Use event delegation to handle both existing and dynamically created placeholders
    document.addEventListener('click', (e) => {
        const placeholder = e.target?.closest('.media-placeholder');
        if (!placeholder) return;
        
        // Don't trigger file upload if clicking on caption
        if (e.target?.classList.contains('media-caption')) return;
        
        // Only allow file selection in edit mode
        if (!isEditMode) return;
        
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    placeholder.style.backgroundImage = `url(${e.target?.result})`;
                    placeholder.style.backgroundSize = 'cover';
                    placeholder.style.backgroundPosition = 'center';
                    const span = placeholder.querySelector('span');
                    if (span) span.style.display = 'none';
                    placeholder.classList.add('has-media');
                    
                    // Save state after image is loaded
                    saveState();
                    
                    if (window.updateStatus) {
                        window.updateStatus('Image uploaded successfully', 'success');
                    }
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
    const placeholders = document.querySelectorAll('.media-placeholder');
    if (placeholders.length === 0) {
        console.warn('No media placeholders found');
        return;
    }
    
    placeholders.forEach(placeholder => {
        const el = placeholder;
        if (el.style.backgroundImage && el.style.backgroundImage !== 'none' && el.style.backgroundImage !== '') {
            el.classList.add('has-media');
            const span = el.querySelector('span');
            if (span) span.style.display = 'none';
        }
        
        // Initialize visibility based on edit mode and has-media class
        updatePlaceholderVisibility(placeholder);
    });
}

function updatePlaceholderVisibility(placeholder) {
    const el = placeholder;
    if (!isEditMode && !el.classList.contains('has-media')) {
        el.style.display = 'none';
    } else {
        el.style.display = 'flex';
    }
}

// Dynamic Page Creation and Navigation
function setupDynamicPagesNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length === 0) {
        console.warn('No navigation links found with class .nav-link');
        return;
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            const href = link.getAttribute('href');
            // Skip if it's an external link or doesn't start with #
            if (!href || !href.startsWith('#')) return;
            
            const pageId = href.substring(1); // Remove the #
            try {
                const existingPage = document.getElementById(pageId);
                if (!existingPage) {
                    // If page doesn't exist, create it
                    e.preventDefault(); // Prevent default scroll behavior
                    await createDynamicPage(pageId, link.textContent);
                }
                // Page exists, let default behavior handle scrolling
            } catch (error) {
                console.warn('Error handling navigation:', error);
            }
        });
    });
}

function createDynamicPage(pageId, pageTitle) {
    if (!mainContent) return;
    
    // Create new page section
    const newPage = document.createElement('section');
    newPage.id = pageId;
    newPage.className = 'dynamic-page content-section';
    
    // Create page content based on page type
    const pageContent = generatePageContent(pageId, pageTitle, websiteOptions.type);
    newPage.innerHTML = pageContent;
    
    // Always append to main content - ensures sections are properly contained
    mainContent.appendChild(newPage);
    
    // Scroll to the new page
    newPage.scrollIntoView({ behavior: 'smooth' });
    
    // Make elements editable if in edit mode
    if (isEditMode) {
        const editableElements = newPage.querySelectorAll('.editable');
        if (editableElements.length > 0) {
            editableElements.forEach(el => {
                el.contentEditable = 'true';
            });
        }
    }
    
    console.log(`Created dynamic page: ${pageId}`);
    if (window.updateStatus) {
        window.updateStatus(`Created new page: ${pageTitle}`, 'success');
    }
}

function generatePageContent(pageId, pageTitle, websiteType) {
    // Simple page template
    return `
        <h2 class="section-title editable" contenteditable="false">${pageTitle}</h2>
        <div class="content-card">
            <p class="card-description editable" contenteditable="false">
                This is the ${pageTitle} page. Click to edit this content when in edit mode.
            </p>
            <div class="media-placeholder" data-media-tip="Click to add background image">
                <span>Click to add media</span>
            </div>
        </div>
    `;
}

// State Management Functions
function saveState() {
    const state = {
        websiteOptions: websiteOptions,
        isEditMode: isEditMode,
        layout: body.getAttribute('data-layout'),
        theme: body.getAttribute('data-theme'),
        editableContent: {},
        mediaPlaceholders: {}
    };
    
    // Save all editable content
    const editables = document.querySelectorAll('.editable');
    if (editables.length > 0) {
        editables.forEach((el, index) => {
            const id = el.id || `editable-${index}`;
            state.editableContent[id] = el.textContent || el.innerHTML;
        });
    }
    
    // Save media placeholder states
    const mediaPlaceholders = document.querySelectorAll('.media-placeholder');
    if (mediaPlaceholders.length > 0) {
        mediaPlaceholders.forEach((placeholder, index) => {
            const id = placeholder.id || `placeholder-${index}`;
            state.mediaPlaceholders[id] = {
                backgroundImage: placeholder.style.backgroundImage,
                hasMedia: placeholder.classList.contains('has-media')
            };
        });
    }
    
    localStorage.setItem('websiteBuilderState', JSON.stringify(state));
    console.log('State saved to localStorage');
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
            
            // Load layout and theme
            if (state.layout) {
                body.setAttribute('data-layout', state.layout);
            }
            if (state.theme) {
                body.setAttribute('data-theme', state.theme);
            }
            
            // Load editable content
            if (state.editableContent) {
                Object.keys(state.editableContent).forEach(id => {
                    try {
                        const element = document.getElementById(id);
                        if (element) {
                            element.textContent = state.editableContent[id];
                        }
                    } catch (error) {
                        console.warn(`Could not restore content for element '${id}':`, error.message);
                    }
                });
            }
            
            // Load media placeholder states
            if (state.mediaPlaceholders) {
                Object.keys(state.mediaPlaceholders).forEach(id => {
                    try {
                        const placeholder = document.getElementById(id);
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
                    } catch (error) {
                        console.warn(`Could not restore media placeholder '${id}':`, error.message);
                    }
                });
            }
            
            console.log('State loaded from localStorage');
        }
    } catch (e) {
        console.error('Error loading saved state:', e);
    }
}

// Save website to file
function saveWebsiteToFile() {
    const siteName = prompt('Enter the name for your website (e.g., "MySite"):') || 'MyWebsite';
    
    // Generate the complete website HTML
    const websiteHTML = generateCompleteHTML();
    
    // Create download link
    const blob = new Blob([websiteHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${siteName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (window.updateStatus) {
        window.updateStatus(`Website saved as ${siteName}.html`, 'success');
    }
}

function generateCompleteHTML() {
    // Clone the current document to avoid modifying the original
    const docClone = document.cloneNode(true);
    
    // Remove the control panel from the clone
    const controlPanel = docClone.getElementById('control-panel-container') || 
                        docClone.getElementById('color-control-panel-container');
    if (controlPanel) {
        controlPanel.remove();
    }
    
    // Remove edit mode classes and attributes
    docClone.body.classList.remove('edit-mode');
    const editableElements = docClone.querySelectorAll('.editable');
    editableElements.forEach(el => {
        el.removeAttribute('contenteditable');
        el.classList.remove('editable');
    });
    
    // Hide media placeholders that don't have content
    const mediaPlaceholders = docClone.querySelectorAll('.media-placeholder');
    mediaPlaceholders.forEach(placeholder => {
        if (!placeholder.classList.contains('has-media')) {
            placeholder.style.display = 'none';
        }
    });
    
    // Add meta tags for responsive design
    let headContent = docClone.head.innerHTML;
    if (!headContent.includes('viewport')) {
        headContent = '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' + headContent;
    }
    if (!headContent.includes('charset')) {
        headContent = '<meta charset="UTF-8">\n' + headContent;
    }
    
    // Generate complete HTML
    return `<!DOCTYPE html>
<html lang="en">
<head>
${headContent}
<title>${websiteOptions.title || 'My Website'}</title>
</head>
${docClone.body.outerHTML}
</html>`;
}

function resetWebsiteContent() {
    if (confirm('Are you sure you want to reset all content to defaults?')) {
        // Reset editable content to defaults
        const defaults = {
            'site-title': 'Your Amazing Website',
            'site-subtitle': 'Build something beautiful today',
            'hero-title': 'Welcome to the Future',
            'hero-description': 'Create stunning websites with our powerful template generator. No coding required.',
            'cta-button': 'Get Started',
            'features-title': 'Features',
            'feature-title-1': 'Lightning Fast',
            'feature-desc-1': 'Built for speed and performance. Your website will load instantly.',
            'feature-title-2': 'Beautiful Design',
            'feature-desc-2': 'Choose from multiple themes and customize every aspect of your site.',
            'feature-title-3': 'Fully Responsive',
            'feature-desc-3': 'Looks perfect on all devices, from mobile phones to desktop computers.',
            'gallery-title': 'Gallery',
            'about-title': 'About Us',
            'about-description': 'We are passionate about creating beautiful, functional websites that help businesses grow. Our template generator makes it easy for anyone to build a professional website without any coding knowledge.',
            'footer-copyright': '&copy; 2024 Your Company. All rights reserved.'
        };
        
        Object.keys(defaults).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = defaults[id];
            }
        });
        
        // Reset layout and theme
        body.setAttribute('data-layout', 'top-nav');
        body.setAttribute('data-theme', 'dark');
        
        // Clear localStorage
        localStorage.removeItem('websiteBuilderState');
        
        if (window.updateStatus) {
            window.updateStatus('Content reset to defaults', 'warning');
        }
        
        // Force page reload to reset all content
        location.reload();
    }
}

// Document ready function
document.addEventListener('DOMContentLoaded', function () {
    // Initialize wb.js without waiting for other components
    init();
    
    // Set default theme
    body.setAttribute('data-theme', 'dark');
    
    if (window.updateStatus) {
        window.updateStatus('Website Builder core loaded', 'success');
    }
});