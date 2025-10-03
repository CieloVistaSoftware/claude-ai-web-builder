// Change Text Component
// Direct inline text editing using contenteditable

(function() {
    'use strict';
    
    console.log('✏️ Change Text: Starting initialization...');
    
    // Component state
    let isEditModeEnabled = false;
    let editingElements = new Map(); // Track original content
    
    // Target selectors
    const targetSelectors = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer', 
                           'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'li', 'td', 'th'];
    
    // Make element editable
    function makeEditable(element) {
        if (!element || element.isContentEditable) return;
        
        // Store original content
        editingElements.set(element, element.innerHTML);
        
        // Make editable
        element.contentEditable = 'true';
        element.classList.add('change-text-editable');
        
        // Focus element
        element.focus();
        
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Dispatch edit start event
        dispatchEvent('changeTextEdit', {
            element: element,
            content: element.innerHTML
        });
    }
    
    // Make element non-editable
    function makeNonEditable(element) {
        if (!element || !element.isContentEditable) return;
        
        element.contentEditable = 'false';
        element.classList.remove('change-text-editable');
        
        // Get original content
        const originalContent = editingElements.get(element);
        const newContent = element.innerHTML;
        
        // Clean up stored content
        editingElements.delete(element);
        
        // Dispatch save event
        dispatchEvent('changeTextSave', {
            element: element,
            oldContent: originalContent,
            newContent: newContent
        });
    }
    
    // Handle clicks
    function handleClick(e) {
        if (!isEditModeEnabled) return;
        
        const target = e.target;
        
        // Check if target is editable element
        const isTargetEditable = targetSelectors.some(selector => 
            target.matches(selector) || target.closest(selector)
        );
        
        if (isTargetEditable && !target.isContentEditable) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the actual element to edit
            let elementToEdit = target;
            for (const selector of targetSelectors) {
                if (target.matches(selector)) {
                    elementToEdit = target;
                    break;
                } else if (target.closest(selector)) {
                    elementToEdit = target.closest(selector);
                    break;
                }
            }
            
            makeEditable(elementToEdit);
        }
    }
    
    // Handle blur (when clicking outside)
    function handleBlur(e) {
        if (e.target.isContentEditable) {
            makeNonEditable(e.target);
        }
    }
    
    // Handle keyboard shortcuts
    function handleKeydown(e) {
        if (!e.target.isContentEditable) return;
        
        // Save on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            makeNonEditable(e.target);
        }
        
        // Cancel on Escape
        if (e.key === 'Escape') {
            e.preventDefault();
            const originalContent = editingElements.get(e.target);
            if (originalContent !== undefined) {
                e.target.innerHTML = originalContent;
            }
            makeNonEditable(e.target);
            
            // Dispatch cancel event
            dispatchEvent('changeTextCancel', {
                element: e.target
            });
        }
        
        // Save on Ctrl+S
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            makeNonEditable(e.target);
        }
    }
    
    // Handle paste - strip formatting
    function handlePaste(e) {
        if (!e.target.isContentEditable) return;
        
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(text));
        selection.collapseToEnd();
    }
    
    // Set edit mode
    function setEditMode(enabled) {
        console.log('✏️ Change Text: Setting edit mode to:', enabled);
        isEditModeEnabled = enabled;
        
        // Update cursor style for all elements
        if (enabled) {
            document.body.classList.add('change-text-enabled');
            addStyles();
        } else {
            document.body.classList.remove('change-text-enabled');
            // End any active editing
            document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                makeNonEditable(el);
            });
        }
    }
    
    // Add CSS styles
    function addStyles() {
        if (document.getElementById('change-text-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'change-text-styles';
        style.textContent = `
            .change-text-enabled ${targetSelectors.join(', .change-text-enabled ')} {
                cursor: pointer !important;
                transition: all 0.2s ease;
            }
            
            .change-text-enabled ${targetSelectors.join(':hover, .change-text-enabled ')}:hover {
                outline: 2px dashed #6366f1;
                outline-offset: 2px;
            }
            
            [contenteditable="true"] {
                outline: 2px solid #6366f1 !important;
                outline-offset: 2px !important;
                cursor: text !important;
                background: rgba(99, 102, 241, 0.05);
                border-radius: 4px;
                padding: 2px 4px;
                min-height: 1.2em;
                min-width: 20px;
                display: inline-block;
            }
            
            [contenteditable="true"]:focus {
                outline: 3px solid #6366f1 !important;
                background: rgba(99, 102, 241, 0.1);
            }
            
            /* Prevent nested contenteditable */
            [contenteditable="true"] * {
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Use capturing phase to catch clicks before other handlers
        document.addEventListener('click', handleClick, true);
        document.addEventListener('blur', handleBlur, true);
        document.addEventListener('keydown', handleKeydown, true);
        document.addEventListener('paste', handlePaste, true);
        
        // Listen for edit mode events
        document.addEventListener('editModeEnabled', () => setEditMode(true));
        document.addEventListener('editModeDisabled', () => setEditMode(false));
        document.addEventListener('editModeChanged', (e) => {
            if (e.detail && typeof e.detail.enabled !== 'undefined') {
                setEditMode(e.detail.enabled);
            }
        });
        
        // Listen for wb-edit-mode events
        document.addEventListener('wb:editModeOn', () => setEditMode(true));
        document.addEventListener('wb:editModeOff', () => setEditMode(false));
    }
    
    // Dispatch custom events
    function dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail: {
                component: 'change-text',
                ...detail
            }
        });
        document.dispatchEvent(event);
    }
    
    // Initialize
    function initialize() {
        console.log('✏️ Change Text: Initializing...');
        
        addStyles();
        setupEventListeners();
        
        // Dispatch ready event
        setTimeout(() => {
            dispatchEvent('changeTextReady', {
                isEditModeEnabled: isEditModeEnabled
            });
            console.log('✏️ Change Text: Ready!');
        }, 100);
    }
    
    // Global API
    window.ChangeText = {
        enable: () => setEditMode(true),
        disable: () => setEditMode(false),
        setEditMode: setEditMode,
        isEnabled: () => isEditModeEnabled,
        
        // Direct editing
        edit: (element) => {
            if (element) {
                setEditMode(true);
                makeEditable(element);
            }
        },
        
        // Save any active edits
        saveAll: () => {
            document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                makeNonEditable(el);
            });
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
})();