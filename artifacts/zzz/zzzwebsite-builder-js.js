// State management
let isEditMode = false;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let isMinimized = false;

// DOM Elements (will be initialized after DOM loads)
let body, controlPanel, controlPanelBody, minimizeBtn, editModeToggle, layoutSelect, themeSelect, exportBtn, saveTemplateBtn, resetBtn;

// Initialize DOM elements
function initializeElements() {
    body = document.body;
    controlPanel = document.getElementById('control-panel');
    controlPanelBody = controlPanel.querySelector('.control-panel-body');
    minimizeBtn = document.getElementById('minimize-btn');
    editModeToggle = document.getElementById('edit-mode-toggle');
    layoutSelect = document.getElementById('layout-select');
    themeSelect = document.getElementById('theme-select');
    exportBtn = document.getElementById('export-btn');
    saveTemplateBtn = document.getElementById('save-template-btn');
    resetBtn = document.getElementById('reset-btn');
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
            const styleTag = clone.createElement('style');
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
        // Check if placeholder already has an image (backgroundImage property exists)
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

// Save State
function saveState() {
    const state = {
        layout: body.getAttribute('data-layout'),
        theme: body.getAttribute('data-theme'),
        content: {},
        images: {}
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
        }
    });
    
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
                    }
                });
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