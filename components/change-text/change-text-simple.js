// Change Text Component - Simple ContentEditable Version
// Direct inline text editing using contenteditable

(function() {
    'use strict';
    
    console.log('✏️ Change Text (ContentEditable): Starting initialization...');
    
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
        
        // Focus element with a slight delay for better UX
        setTimeout(() => {
            element.focus();
            
            // Select all text for easy replacement
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }, 50);
        
        // Add a helpful tooltip
        element.setAttribute('title', 'Press Enter to save, Escape to cancel, or click outside to finish editing');
        
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
        element.removeAttribute('title');
        
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
        if (!isEditModeEnabled) {
            console.log('✏️ Change Text: Click ignored - edit mode disabled');
            return;
        }
        
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
        console.log('✏️ Change Text: Setting edit mode to:', enabled, 'Current state:', isEditModeEnabled);
        
        // Prevent redundant calls
        if (isEditModeEnabled === enabled) {
            console.log('✏️ Change Text: Mode already set to', enabled, ', ignoring duplicate call');
            return;
        }
        
        isEditModeEnabled = enabled;
        
        // Update cursor style for all elements
        if (enabled) {
            document.body.classList.add('change-text-enabled');
            addStyles();
            
            // Dispatch enable event
            dispatchEvent('changeTextModeEnabled', {
                enabled: true
            });
        } else {
            document.body.classList.remove('change-text-enabled');
            
            // End any active editing first
            document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                // Save current changes before disabling
                makeNonEditable(el);
            });
            
            // Force remove contenteditable from any remaining elements
            document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.contentEditable = 'false';
                el.classList.remove('change-text-editable');
                el.removeAttribute('title');
                el.style.removeProperty('outline');
                el.style.removeProperty('background');
                el.style.removeProperty('cursor');
            });
            
            // Remove any remaining editable styling from all elements
            document.querySelectorAll('.change-text-editable').forEach(el => {
                el.classList.remove('change-text-editable');
                el.style.removeProperty('outline');
                el.style.removeProperty('background');
                el.style.removeProperty('cursor');
            });
            
            // Clear any stored editing elements
            editingElements.clear();
            
            // Remove hover styles by removing the stylesheet
            removeStyles();
            
            // Dispatch disable event
            dispatchEvent('changeTextModeDisabled', {
                enabled: false
            });
            
            console.log('✏️ Change Text: Edit mode disabled completely');
        }
    }
    
    // Add CSS styles
    function addStyles() {
        if (document.getElementById('change-text-simple-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'change-text-simple-styles';
        style.textContent = `
            .change-text-enabled ${targetSelectors.join(', .change-text-enabled ')} {
                cursor: pointer !important;
                transition: all 0.2s ease;
                position: relative;
            }
            
            .change-text-enabled ${targetSelectors.join(':hover, .change-text-enabled ')}:hover {
                outline: 2px dashed #6366f1 !important;
                outline-offset: 2px !important;
                background: rgba(99, 102, 241, 0.05) !important;
                border-radius: 4px !important;
            }
            
            .change-text-enabled ${targetSelectors.join(':hover::before, .change-text-enabled ')}:hover::before {
                content: '✏️ Click to edit';
                position: absolute;
                top: -25px;
                left: 0;
                background: #6366f1;
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 500;
                white-space: nowrap;
                z-index: 1000;
                animation: fadeIn 0.2s ease;
            }
            
            [contenteditable="true"] {
                outline: 3px solid #10b981 !important;
                outline-offset: 2px !important;
                cursor: text !important;
                background: rgba(16, 185, 129, 0.15) !important;
                border-radius: 6px !important;
                padding: 4px 8px !important;
                min-height: 1.2em !important;
                min-width: 20px !important;
                display: inline-block !important;
                animation: change-text-pulse 2s ease-in-out infinite;
                position: relative;
            }
            
            [contenteditable="true"]:focus {
                outline: 3px solid #059669 !important;
                background: rgba(16, 185, 129, 0.2) !important;
                animation: none;
                box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2) !important;
            }
            
            [contenteditable="true"]::before {
                content: '💾 Enter to save, Esc to cancel';
                position: absolute;
                top: -25px;
                left: 0;
                background: #10b981;
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 500;
                white-space: nowrap;
                z-index: 1000;
            }
            
            @keyframes change-text-pulse {
                0%, 100% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
                50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.2); }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-2px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Prevent nested contenteditable */
            [contenteditable="true"] * {
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove CSS styles
    function removeStyles() {
        const existingStyle = document.getElementById('change-text-simple-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Prevent duplicate listeners
        if (window.changeTextListenersAdded) {
            console.log('✏️ Change Text: Event listeners already added, skipping');
            return;
        }
        
        // Use capturing phase to catch clicks before other handlers
        document.addEventListener('click', handleClick, true);
        document.addEventListener('blur', handleBlur, true);
        document.addEventListener('keydown', handleKeydown, true);
        document.addEventListener('paste', handlePaste, true);
        
        // Mark listeners as added
        window.changeTextListenersAdded = true;
        
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
                component: 'change-text-simple',
                ...detail
            }
        });
        document.dispatchEvent(event);
    }
    
    // Initialize
    function initialize() {
        console.log('✏️ Change Text (ContentEditable): Initializing...');
        
        addStyles();
        setupEventListeners();
        
        // Dispatch ready event
        setTimeout(() => {
            dispatchEvent('changeTextReady', {
                isEditModeEnabled: isEditModeEnabled
            });
            console.log('✏️ Change Text (ContentEditable): Ready!');
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