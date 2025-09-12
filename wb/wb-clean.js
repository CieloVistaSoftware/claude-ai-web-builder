// Website Builder JavaScript - Clean Version
console.log('wb.js loaded');

// Error handling utility functions
function getElementByIdWithError(id, elementName) {
    try {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`${elementName} not found with ID: ${id}`);
            return null;
        }
        return element;
    } catch (error) {
        console.error(`Error finding ${elementName} with ID ${id}:`, error);
        return null;
    }
}

// Utility function to safely get elements by querySelector with error handling
function getQuerySelectorWithError(selector, elementName) {
    try {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`${elementName} not found with selector: ${selector}`);
            return null;
        }
        return element;
    } catch (error) {
        console.error(`Error finding ${elementName} with selector ${selector}:`, error);
        return null;
    }
}

// Initialize edit mode functionality
function initializeEditMode() {
    const editModeBtn = getElementByIdWithError('editModeBtn', 'Edit Mode Button');
    const editableContent = getQuerySelectorWithError('.editable-content', 'Editable Content');
    
    if (!editModeBtn || !editableContent) return;

    editModeBtn.addEventListener('click', function() {
        const isCurrentlyEditing = editableContent.contentEditable === 'true';
        
        if (isCurrentlyEditing) {
            // Switch to view mode
            editableContent.contentEditable = 'false';
            editModeBtn.textContent = 'Edit Mode';
            document.body.classList.remove('edit-mode');
            console.log('Switched to view mode');
        } else {
            // Switch to edit mode
            editableContent.contentEditable = 'true';
            editModeBtn.textContent = 'View Mode';
            document.body.classList.add('edit-mode');
            editableContent.focus();
            console.log('Switched to edit mode');
        }
    });
}

// Initialize save functionality
function initializeSave() {
    const saveBtn = getElementByIdWithError('saveBtn', 'Save Button');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', function() {
        const editableContent = getQuerySelectorWithError('.editable-content', 'Editable Content');
        if (editableContent) {
            const content = editableContent.innerHTML;
            
            // Save to localStorage for now
            localStorage.setItem('websiteContent', content);
            
            // Visual feedback
            saveBtn.textContent = 'Saved!';
            saveBtn.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                saveBtn.textContent = 'Save';
                saveBtn.style.backgroundColor = '#8e44ad';
            }, 2000);
            
            console.log('Content saved to localStorage');
        }
    });
}

// Initialize layout functionality
function initializeLayout() {
    const layoutSelect = getElementByIdWithError('layoutSelect', 'Layout Select');
    if (!layoutSelect) return;

    layoutSelect.addEventListener('change', function() {
        const selectedLayout = this.value;
        const previewArea = getElementByIdWithError('previewArea', 'Preview Area');
        
        if (previewArea) {
            // Remove existing layout classes
            previewArea.className = 'preview-area';
            // Add new layout class
            previewArea.classList.add('layout-' + selectedLayout);
            
            console.log('Layout changed to:', selectedLayout);
        }
    });
}

// Initialize theme functionality
function initializeTheme() {
    const themeSelect = getElementByIdWithError('themeSelect', 'Theme Select');
    if (!themeSelect) return;

    themeSelect.addEventListener('change', function() {
        const selectedTheme = this.value;
        
        // Remove existing theme classes
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        
        // Add new theme class
        document.body.classList.add('theme-' + selectedTheme);
        
        console.log('Theme changed to:', selectedTheme);
    });
}

// Initialize color explorer
function initializeColorExplorer() {
    const colorExplorer = getElementByIdWithError('colorExplorer', 'Color Explorer');
    if (!colorExplorer) return;

    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#F8BBD9', '#A8E6CF',
        '#FFB6C1', '#87CEEB', '#DEB887', '#F0E68C'
    ];

    // Clear existing content
    colorExplorer.innerHTML = '';
    
    // Set up grid layout
    colorExplorer.style.display = 'grid';
    colorExplorer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    colorExplorer.style.gap = '8px';
    colorExplorer.style.marginTop = '10px';

    colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.width = '40px';
        swatch.style.height = '40px';
        swatch.style.backgroundColor = color;
        swatch.style.borderRadius = '6px';
        swatch.style.cursor = 'pointer';
        swatch.style.border = '2px solid transparent';
        swatch.style.transition = 'all 0.3s ease';
        swatch.title = color;
        swatch.dataset.color = color;
        
        swatch.addEventListener('click', function() {
            // Remove previous selection
            colorExplorer.querySelectorAll('.color-swatch').forEach(s => {
                s.style.borderColor = 'transparent';
                s.classList.remove('selected');
            });
            
            // Highlight selected color
            this.style.borderColor = '#fff';
            this.classList.add('selected');
            
            // Apply color to content
            const editableContent = getQuerySelectorWithError('.editable-content', 'Editable Content');
            if (editableContent) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0 && !selection.isCollapsed) {
                    // Apply to selected text
                    const range = selection.getRangeAt(0);
                    const span = document.createElement('span');
                    span.style.color = color;
                    try {
                        range.surroundContents(span);
                    } catch (e) {
                        // If can't surround, apply background
                        editableContent.style.backgroundColor = color + '20';
                    }
                } else {
                    // Apply as background color
                    editableContent.style.backgroundColor = color + '20';
                }
            }
            
            console.log('Color applied:', color);
        });
        
        swatch.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            if (!this.classList.contains('selected')) {
                this.style.borderColor = '#ccc';
            }
        });
        
        swatch.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            if (!this.classList.contains('selected')) {
                this.style.borderColor = 'transparent';
            }
        });
        
        colorExplorer.appendChild(swatch);
    });
    
    console.log('Color explorer initialized with', colors.length, 'colors');
}

// Load saved content
function loadSavedContent() {
    const savedContent = localStorage.getItem('websiteContent');
    if (savedContent) {
        const editableContent = getQuerySelectorWithError('.editable-content', 'Editable Content');
        if (editableContent) {
            editableContent.innerHTML = savedContent;
            console.log('Loaded saved content from localStorage');
        }
    }
}

// Main initialization function
function initializeElements() {
    console.log('Initializing website builder elements...');
    
    try {
        initializeEditMode();
        initializeSave();
        initializeLayout();
        initializeTheme();
        initializeColorExplorer();
        loadSavedContent();
        
        // Mark as initialized
        window.wbInitialized = true;
        console.log('Website builder initialization complete');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing website builder...');
    initializeElements();
});

// Backup initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeElements);
} else {
    console.log('DOM already loaded, initializing immediately...');
    initializeElements();
}