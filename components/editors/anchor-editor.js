/**
 * Anchor Editor Web Component
 * Usage: Include this script in your HTML and all anchor tags will get editing capabilities
 * Add data-editable="true" to anchor tags you want to be editable
 */

(function() {
    'use strict';
    
    // Store for managing editor states
    const editorStates = new Map();
    let activeEditor = null;
    
    // Default anchor state
    const defaultAnchorState = {
        text: '',
        url: '#',
        target: '_self',
        style: 'default'
    };
    
    // CSS styles for the editor
    const editorStyles = `
        .anchor-editor {
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
        
        .anchor-editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid #374151;
        }
        
        .anchor-editor-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .anchor-editor-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
        }
        
        .anchor-editor-close:hover {
            color: #d1d5db;
        }
        
        .anchor-editor-content {
            padding: 16px;
        }
        
        .anchor-form-group {
            margin-bottom: 16px;
        }
        
        .anchor-form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #d1d5db;
            margin-bottom: 4px;
        }
        
        .anchor-form-input, .anchor-form-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #4b5563;
            background-color: #374151;
            color: #f9fafb;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .anchor-form-input:focus, .anchor-form-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        .anchor-target-display {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 4px;
        }
        
        .anchor-editable {
            position: relative;
            cursor: pointer;
        }
        
        .anchor-editable:hover {
            outline: 2px dashed #3b82f6;
            outline-offset: 2px;
        }
        
        .anchor-edit-indicator {
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
        }
        
        .anchor-editable:hover .anchor-edit-indicator {
            opacity: 1;
        }
    `;
    
    // Inject CSS styles
    function injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = editorStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Get current state of an anchor element
    function getAnchorState(element) {
        const id = element.dataset.editorId || generateId();
        element.dataset.editorId = id;
        
        if (!editorStates.has(id)) {
            editorStates.set(id, {
                text: element.textContent || defaultAnchorState.text,
                url: element.getAttribute('href') || defaultAnchorState.url,
                target: element.getAttribute('target') || defaultAnchorState.target,
                style: element.dataset.style || defaultAnchorState.style
            });
        }
        
        return editorStates.get(id);
    }
    
    // Update anchor element with new state
    function updateAnchorElement(element, state) {
        element.textContent = state.text;
        element.setAttribute('href', state.url);
        element.setAttribute('target', state.target);
        element.dataset.style = state.style;
        
        // Apply style classes
        element.className = element.className.replace(/link-\w+/g, '');
        element.classList.add(`link-${state.style}`);
    }
    
    // Generate unique ID
    function generateId() {
        return 'anchor-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Create editor interface
    function createEditor(anchorElement) {
        const state = getAnchorState(anchorElement);
        const rect = anchorElement.getBoundingClientRect();
        
        const editor = document.createElement('div');
        editor.className = 'anchor-editor';
        
        // Position editor
        let x = rect.right + 10;
        let y = rect.top + window.scrollY;
        
        if (x + 320 > window.innerWidth) {
            x = rect.left - 330;
        }
        if (y + 300 > window.innerHeight + window.scrollY) {
            y = window.innerHeight + window.scrollY - 300;
        }
        if (y < window.scrollY) y = window.scrollY + 10;
        
        editor.style.left = x + 'px';
        editor.style.top = y + 'px';
        
        editor.innerHTML = `
            <div class="anchor-editor-header">
                <h3 class="anchor-editor-title">Edit Link</h3>
                <button class="anchor-editor-close" type="button">×</button>
            </div>
            <div class="anchor-editor-content">
                <div class="anchor-form-group">
                    <label class="anchor-form-label">Link Text</label>
                    <input type="text" class="anchor-form-input" id="anchor-text" value="${state.text}" placeholder="Enter link text">
                </div>
                
                <div class="anchor-form-group">
                    <label class="anchor-form-label">URL</label>
                    <input type="url" class="anchor-form-input" id="anchor-url" value="${state.url}" placeholder="https://example.com">
                </div>
                
                <div class="anchor-form-group">
                    <label class="anchor-form-label">Target</label>
                    <select class="anchor-form-select" id="anchor-target">
                        <option value="_self" ${state.target === '_self' ? 'selected' : ''}>Same window</option>
                        <option value="_blank" ${state.target === '_blank' ? 'selected' : ''}>New window</option>
                        <option value="_parent" ${state.target === '_parent' ? 'selected' : ''}>Parent frame</option>
                        <option value="_top" ${state.target === '_top' ? 'selected' : ''}>Full window</option>
                    </select>
                    <div class="anchor-target-display">Current: ${state.target}</div>
                </div>
                
                <div class="anchor-form-group">
                    <label class="anchor-form-label">Style</label>
                    <select class="anchor-form-select" id="anchor-style">
                        <option value="default" ${state.style === 'default' ? 'selected' : ''}>Default Link</option>
                        <option value="button" ${state.style === 'button' ? 'selected' : ''}>Button Style</option>
                        <option value="subtle" ${state.style === 'subtle' ? 'selected' : ''}>Subtle Link</option>
                        <option value="bold" ${state.style === 'bold' ? 'selected' : ''}>Bold Link</option>
                    </select>
                </div>
            </div>
        `;
        
        // Add event listeners
        const textInput = editor.querySelector('#anchor-text');
        const urlInput = editor.querySelector('#anchor-url');
        const targetSelect = editor.querySelector('#anchor-target');
        const styleSelect = editor.querySelector('#anchor-style');
        const closeBtn = editor.querySelector('.anchor-editor-close');
        const targetDisplay = editor.querySelector('.anchor-target-display');
        
        function updateState() {
            const newState = {
                text: textInput.value,
                url: urlInput.value,
                target: targetSelect.value,
                style: styleSelect.value
            };
            
            editorStates.set(anchorElement.dataset.editorId, newState);
            updateAnchorElement(anchorElement, newState);
            targetDisplay.textContent = `Current: ${newState.target}`;
        }
        
        textInput.addEventListener('input', updateState);
        urlInput.addEventListener('input', updateState);
        targetSelect.addEventListener('change', updateState);
        styleSelect.addEventListener('change', updateState);
        
        closeBtn.addEventListener('click', () => {
            closeEditor();
        });
        
        // Close editor when clicking outside
        function handleClickOutside(event) {
            if (!editor.contains(event.target) && event.target !== anchorElement) {
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
    
    // Add edit indicator to editable anchors
    function addEditIndicator(anchor) {
        if (!anchor.querySelector('.anchor-edit-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'anchor-edit-indicator';
            indicator.innerHTML = '✎';
            indicator.title = 'Click to edit';
            anchor.appendChild(indicator);
        }
    }
    
    // Initialize editable anchors
    function initializeEditableAnchors() {
        const editableAnchors = document.querySelectorAll('a[data-editable="true"]');
        
        editableAnchors.forEach(anchor => {
            anchor.classList.add('anchor-editable');
            addEditIndicator(anchor);
            
            // Remove existing listeners to prevent duplicates
            anchor.removeEventListener('click', handleAnchorClick);
            anchor.addEventListener('click', handleAnchorClick);
        });
    }
    
    // Handle anchor click
    function handleAnchorClick(event) {
        // Close any existing editor
        if (activeEditor) {
            activeEditor.parentNode.removeChild(activeEditor);
            activeEditor = null;
        }
        
        // Prevent default link behavior when editing
        event.preventDefault();
        event.stopPropagation();
        
        createEditor(this);
    }
    
    // Auto-initialize when DOM is ready
    function initialize() {
        injectStyles();
        initializeEditableAnchors();
        
        // Watch for new anchors added to the page
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('a[data-editable="true"]')) {
                            node.classList.add('anchor-editable');
                            addEditIndicator(node);
                            node.addEventListener('click', handleAnchorClick);
                        }
                        
                        // Check children too
                        const editableAnchors = node.querySelectorAll && node.querySelectorAll('a[data-editable="true"]');
                        if (editableAnchors) {
                            editableAnchors.forEach(anchor => {
                                anchor.classList.add('anchor-editable');
                                addEditIndicator(anchor);
                                anchor.addEventListener('click', handleAnchorClick);
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
    window.AnchorEditor = {
        init: initialize,
        makeEditable: function(selector) {
            const anchors = document.querySelectorAll(selector);
            anchors.forEach(anchor => {
                anchor.setAttribute('data-editable', 'true');
                anchor.classList.add('anchor-editable');
                addEditIndicator(anchor);
                anchor.addEventListener('click', handleAnchorClick);
            });
        },
        getState: function(anchor) {
            return getAnchorState(anchor);
        },
        setState: function(anchor, state) {
            const id = anchor.dataset.editorId || generateId();
            anchor.dataset.editorId = id;
            editorStates.set(id, state);
            updateAnchorElement(anchor, state);
        }
    };
    
})();