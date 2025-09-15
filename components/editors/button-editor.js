/**
 * Button Editor Web Component
 * Usage: Include this script and add data-editable="true" to button elements
 */

(function() {
    'use strict';
    
    // Store for managing editor states
    const buttonStates = new Map();
    let activeEditor = null;
    
    // Default button state
    const defaultState = {
        text: 'Button',
        style: 'primary',
        size: 'medium',
        disabled: false,
        type: 'button'
    };
    
    // CSS styles for the editor
    const editorStyles = `
        .button-editor {
            position: fixed;
            z-index: 10000;
            background: #1f2937;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            border: 1px solid #374151;
            width: 320px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #f9fafb;
        }
        
        .button-editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid #374151;
        }
        
        .button-editor-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .button-editor-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
        }
        
        .button-editor-close:hover {
            color: #d1d5db;
        }
        
        .button-editor-content {
            padding: 16px;
        }
        
        .button-form-group {
            margin-bottom: 16px;
        }
        
        .button-form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #d1d5db;
            margin-bottom: 4px;
        }
        
        .button-form-input, .button-form-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #4b5563;
            background-color: #374151;
            color: #f9fafb;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .button-form-input:focus, .button-form-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        .button-form-checkbox {
            margin-right: 8px;
        }
        
        .button-editable {
            position: relative;
            cursor: pointer;
        }
        
        .button-editable:hover {
            outline: 2px dashed #3b82f6;
            outline-offset: 2px;
        }
        
        .button-edit-indicator {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 1000;
        }
        
        .button-editable:hover .button-edit-indicator {
            opacity: 1;
        }
        
        /* Button styles */
        .btn {
            font-weight: 500;
            border-radius: 8px;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
        }
        
        .btn-small { padding: 6px 12px; font-size: 14px; }
        .btn-medium { padding: 8px 16px; font-size: 16px; }
        .btn-large { padding: 12px 24px; font-size: 18px; }
        
        .btn-primary { background-color: #3b82f6; color: white; }
        .btn-secondary { background-color: #6b7280; color: white; }
        .btn-success { background-color: #10b981; color: white; }
        .btn-danger { background-color: #ef4444; color: white; }
        
        .btn:hover:not(:disabled) { opacity: 0.9; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    `;
    
    // Inject CSS styles
    function injectStyles() {
        if (document.querySelector('#button-editor-styles')) return;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'button-editor-styles';
        styleSheet.textContent = editorStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Get current state of a button element
    function getButtonState(element) {
        const id = element.dataset.buttonEditorId || generateId();
        element.dataset.buttonEditorId = id;
        
        if (!buttonStates.has(id)) {
            buttonStates.set(id, {
                text: element.textContent || defaultState.text,
                style: element.dataset.style || defaultState.style,
                size: element.dataset.size || defaultState.size,
                disabled: element.disabled || defaultState.disabled,
                type: element.getAttribute('type') || defaultState.type
            });
        }
        
        return buttonStates.get(id);
    }
    
    // Update button element with new state
    function updateButtonElement(element, state) {
        element.textContent = state.text;
        element.setAttribute('type', state.type);
        element.disabled = state.disabled;
        element.dataset.style = state.style;
        element.dataset.size = state.size;
        
        // Apply style classes
        element.className = element.className.replace(/btn-\w+/g, '');
        element.classList.add('btn', `btn-${state.style}`, `btn-${state.size}`);
    }
    
    // Generate unique ID
    function generateId() {
        return 'button-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Create editor interface
    function createEditor(buttonElement) {
        const state = getButtonState(buttonElement);
        const rect = buttonElement.getBoundingClientRect();
        
        const editor = document.createElement('div');
        editor.className = 'button-editor';
        
        // Position editor
        let x = rect.right + 10;
        let y = rect.top + window.scrollY;
        
        if (x + 320 > window.innerWidth) {
            x = rect.left - 330;
        }
        if (y + 350 > window.innerHeight + window.scrollY) {
            y = window.innerHeight + window.scrollY - 350;
        }
        if (y < window.scrollY) y = window.scrollY + 10;
        
        editor.style.left = x + 'px';
        editor.style.top = y + 'px';
        
        editor.innerHTML = `
            <div class="button-editor-header">
                <h3 class="button-editor-title">Edit Button</h3>
                <button class="button-editor-close" type="button">×</button>
            </div>
            <div class="button-editor-content">
                <div class="button-form-group">
                    <label class="button-form-label">Button Text</label>
                    <input type="text" class="button-form-input" id="button-text" value="${state.text}" placeholder="Enter button text" title="Button text content">
                </div>
                
                <div class="button-form-group">
                    <label class="button-form-label">Style</label>
                    <select class="button-form-select" id="button-style" title="Button style">
                        <option value="primary" ${state.style === 'primary' ? 'selected' : ''}>Primary</option>
                        <option value="secondary" ${state.style === 'secondary' ? 'selected' : ''}>Secondary</option>
                        <option value="success" ${state.style === 'success' ? 'selected' : ''}>Success</option>
                        <option value="danger" ${state.style === 'danger' ? 'selected' : ''}>Danger</option>
                    </select>
                </div>
                
                <div class="button-form-group">
                    <label class="button-form-label">Size</label>
                    <select class="button-form-select" id="button-size" title="Button size">
                        <option value="small" ${state.size === 'small' ? 'selected' : ''}>Small</option>
                        <option value="medium" ${state.size === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="large" ${state.size === 'large' ? 'selected' : ''}>Large</option>
                    </select>
                </div>
                
                <div class="button-form-group">
                    <label class="button-form-label">Type</label>
                    <select class="button-form-select" id="button-type" title="Button type">
                        <option value="button" ${state.type === 'button' ? 'selected' : ''}>Button</option>
                        <option value="submit" ${state.type === 'submit' ? 'selected' : ''}>Submit</option>
                        <option value="reset" ${state.type === 'reset' ? 'selected' : ''}>Reset</option>
                    </select>
                </div>
                
                <div class="button-form-group">
                    <label class="button-form-label">
                        <input type="checkbox" class="button-form-checkbox" id="button-disabled" ${state.disabled ? 'checked' : ''}>
                        Disabled
                    </label>
                </div>
            </div>
        `;
        
        // Add event listeners
        const textInput = editor.querySelector('#button-text');
        const styleSelect = editor.querySelector('#button-style');
        const sizeSelect = editor.querySelector('#button-size');
        const typeSelect = editor.querySelector('#button-type');
        const disabledCheckbox = editor.querySelector('#button-disabled');
        const closeBtn = editor.querySelector('.button-editor-close');
        
        function updateState() {
            const newState = {
                text: textInput.value,
                style: styleSelect.value,
                size: sizeSelect.value,
                type: typeSelect.value,
                disabled: disabledCheckbox.checked
            };
            
            buttonStates.set(buttonElement.dataset.buttonEditorId, newState);
            updateButtonElement(buttonElement, newState);
        }
        
        textInput.addEventListener('input', updateState);
        styleSelect.addEventListener('change', updateState);
        sizeSelect.addEventListener('change', updateState);
        typeSelect.addEventListener('change', updateState);
        disabledCheckbox.addEventListener('change', updateState);
        
        closeBtn.addEventListener('click', () => {
            closeEditor();
        });
        
        // Close editor when clicking outside
        function handleClickOutside(event) {
            if (!editor.contains(event.target) && event.target !== buttonElement) {
                closeEditor();
            }
        }
        
        function closeEditor() {
            if (editor.parentNode) {
                editor.parentNode.removeChild(editor);
            }
            document.removeEventListener('mousedown', handleClickOutside);
            activeEditor = null;
        }
        
        setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);
        
        document.body.appendChild(editor);
        activeEditor = editor;
        
        // Focus first input
        textInput.focus();
        textInput.select();
    }
    
    // Add edit indicator to editable buttons
    function addEditIndicator(button) {
        if (!button.querySelector('.button-edit-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'button-edit-indicator';
            indicator.innerHTML = '✎';
            indicator.title = 'Click to edit';
            button.appendChild(indicator);
        }
    }
    
    // Initialize editable buttons
    function initializeEditableButtons() {
        const editableButtons = document.querySelectorAll('button[data-editable="true"]');
        
        editableButtons.forEach(button => {
            button.classList.add('button-editable');
            addEditIndicator(button);
            
            // Remove existing listeners to prevent duplicates
            button.removeEventListener('click', handleButtonClick);
            button.addEventListener('click', handleButtonClick);
        });
    }
    
    // Handle button click
    function handleButtonClick(event) {
        // Close any existing editor
        if (activeEditor) {
            activeEditor.parentNode.removeChild(activeEditor);
            activeEditor = null;
        }
        
        // Prevent default button behavior when editing
        event.preventDefault();
        event.stopPropagation();
        
        createEditor(this);
    }
    
    // Auto-initialize when DOM is ready
    function initialize() {
        injectStyles();
        initializeEditableButtons();
        
        // Watch for new buttons added to the page
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('button[data-editable="true"]')) {
                            node.classList.add('button-editable');
                            addEditIndicator(node);
                            node.addEventListener('click', handleButtonClick);
                        }
                        
                        // Check children too
                        const editableButtons = node.querySelectorAll && node.querySelectorAll('button[data-editable="true"]');
                        if (editableButtons) {
                            editableButtons.forEach(button => {
                                button.classList.add('button-editable');
                                addEditIndicator(button);
                                button.addEventListener('click', handleButtonClick);
                            });
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Expose public API
    window.ButtonEditor = {
        init: initialize,
        makeEditable: function(selector) {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(button => {
                button.setAttribute('data-editable', 'true');
                button.classList.add('button-editable');
                addEditIndicator(button);
                button.addEventListener('click', handleButtonClick);
            });
        },
        getState: function(button) {
            return getButtonState(button);
        },
        setState: function(button, state) {
            const id = button.dataset.buttonEditorId || generateId();
            button.dataset.buttonEditorId = id;
            buttonStates.set(id, state);
            updateButtonElement(button, state);
        }
    };
    
})();