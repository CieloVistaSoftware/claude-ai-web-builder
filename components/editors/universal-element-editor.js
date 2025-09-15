/**
 * Universal HTML Element Editor Web Components
 * Supports: Anchors, Buttons, Images, Text, Forms, Tables, Videos
 * Usage: Include this script and add data-editable="true" to any supported element
 */

(function() {
    'use strict';
    
    // Store for managing editor states
    const editorStates = new Map();
    let activeEditor = null;
    
    // Default states for different element types
    const defaultStates = {
        anchor: {
            text: '',
            url: '#',
            target: '_self',
            style: 'default'
        },
        button: {
            text: 'Button',
            style: 'primary',
            size: 'medium',
            disabled: false,
            type: 'button'
        },
        image: {
            src: 'https://picsum.photos/200/150',
            alt: 'Image',
            width: '200',
            height: '150',
            style: 'default'
        },
        text: {
            content: 'Text content',
            tag: 'p',
            style: 'default'
        }
    };
    
    // CSS styles for all editors
    const editorStyles = `
        .element-editor {
            position: fixed;
            z-index: 10000;
            background: #1f2937;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            border: 1px solid #374151;
            width: 350px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #f9fafb;
        }
        
        .element-editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid #374151;
            position: sticky;
            top: 0;
            background: #1f2937;
        }
        
        .element-editor-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .element-editor-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
        }
        
        .element-editor-close:hover {
            color: #d1d5db;
        }
        
        .element-editor-content {
            padding: 16px;
        }
        
        .element-form-group {
            margin-bottom: 16px;
        }
        
        .element-form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #d1d5db;
            margin-bottom: 4px;
        }
        
        .element-form-input, .element-form-select, .element-form-textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #4b5563;
            background-color: #374151;
            color: #f9fafb;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
            font-family: inherit;
        }
        
        .element-form-textarea {
            min-height: 80px;
            resize: vertical;
        }
        
        .element-form-input:focus, .element-form-select:focus, .element-form-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        .element-form-checkbox {
            margin-right: 8px;
        }
        
        .element-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .element-info {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 4px;
        }
        
        .element-editable {
            position: relative;
            cursor: pointer;
        }
        
        .element-editable:hover {
            outline: 2px dashed #3b82f6;
            outline-offset: 2px;
        }
        
        .element-edit-indicator {
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
        
        .element-editable:hover .element-edit-indicator {
            opacity: 1;
        }
        
        /* Element styles */
        .link-default {
            color: #3b82f6;
            text-decoration: underline;
        }
        
        .link-button {
            display: inline-block;
            padding: 8px 16px;
            background-color: #3b82f6;
            color: white;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
        }
        
        .link-subtle {
            color: #6b7280;
            text-decoration: none;
            border-bottom: 1px solid #d1d5db;
        }
        
        .link-bold {
            font-weight: bold;
            color: #1d4ed8;
            text-decoration: underline;
            text-decoration-thickness: 2px;
        }
        
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
        
        .img-default { border: 1px solid transparent; }
        .img-rounded { border-radius: 8px; }
        .img-circle { border-radius: 50%; }
        .img-shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .img-border { border: 2px solid #d1d5db; }
        
        .text-default { }
        .text-highlight { background-color: #fef3c7; padding: 2px 4px; }
        .text-emphasis { font-style: italic; color: #6b7280; }
        .text-strong { font-weight: bold; }
    `;
    
    // Inject CSS styles
    function injectStyles() {
        if (document.querySelector('#element-editor-styles')) return;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'element-editor-styles';
        styleSheet.textContent = editorStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Detect element type
    function getElementType(element) {
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'a') return 'anchor';
        if (tagName === 'button') return 'button';
        if (tagName === 'img') return 'image';
        if (['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) return 'text';
        return 'unknown';
    }
    
    // Get current state of an element
    function getElementState(element) {
        const type = getElementType(element);
        const id = element.dataset.editorId || generateId();
        element.dataset.editorId = id;
        
        if (!editorStates.has(id)) {
            let state = { ...defaultStates[type] };
            
            switch (type) {
                case 'anchor':
                    state.text = element.textContent || defaultStates.anchor.text;
                    state.url = element.getAttribute('href') || defaultStates.anchor.url;
                    state.target = element.getAttribute('target') || defaultStates.anchor.target;
                    state.style = element.dataset.style || defaultStates.anchor.style;
                    break;
                    
                case 'button':
                    state.text = element.textContent || defaultStates.button.text;
                    state.style = element.dataset.style || defaultStates.button.style;
                    state.size = element.dataset.size || defaultStates.button.size;
                    state.disabled = element.disabled || defaultStates.button.disabled;
                    state.type = element.getAttribute('type') || defaultStates.button.type;
                    break;
                    
                case 'image':
                    state.src = element.getAttribute('src') || defaultStates.image.src;
                    state.alt = element.getAttribute('alt') || defaultStates.image.alt;
                    state.width = element.getAttribute('width') || defaultStates.image.width;
                    state.height = element.getAttribute('height') || defaultStates.image.height;
                    state.style = element.dataset.style || defaultStates.image.style;
                    break;
                    
                case 'text':
                    state.content = element.textContent || defaultStates.text.content;
                    state.tag = element.tagName.toLowerCase();
                    state.style = element.dataset.style || defaultStates.text.style;
                    break;
            }
            
            editorStates.set(id, state);
        }
        
        return editorStates.get(id);
    }
    
    // Update element with new state
    function updateElement(element, state) {
        const type = getElementType(element);
        
        switch (type) {
            case 'anchor':
                element.textContent = state.text;
                element.setAttribute('href', state.url);
                element.setAttribute('target', state.target);
                element.dataset.style = state.style;
                element.className = element.className.replace(/link-\w+/g, '');
                element.classList.add(`link-${state.style}`);
                break;
                
            case 'button':
                element.textContent = state.text;
                element.setAttribute('type', state.type);
                element.disabled = state.disabled;
                element.dataset.style = state.style;
                element.dataset.size = state.size;
                element.className = element.className.replace(/btn-\w+/g, '');
                element.classList.add('btn', `btn-${state.style}`, `btn-${state.size}`);
                break;
                
            case 'image':
                element.setAttribute('src', state.src);
                element.setAttribute('alt', state.alt);
                element.setAttribute('width', state.width);
                element.setAttribute('height', state.height);
                element.dataset.style = state.style;
                element.className = element.className.replace(/img-\w+/g, '');
                element.classList.add(`img-${state.style}`);
                break;
                
            case 'text':
                element.textContent = state.content;
                element.dataset.style = state.style;
                element.className = element.className.replace(/text-\w+/g, '');
                element.classList.add(`text-${state.style}`);
                break;
        }
    }
    
    // Generate unique ID
    function generateId() {
        return 'element-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Create editor interface
    function createEditor(element) {
        const type = getElementType(element);
        const state = getElementState(element);
        const rect = element.getBoundingClientRect();
        
        const editor = document.createElement('div');
        editor.className = 'element-editor';
        
        // Position editor
        let x = rect.right + 10;
        let y = rect.top + window.scrollY;
        
        if (x + 350 > window.innerWidth) {
            x = rect.left - 360;
        }
        if (y + 400 > window.innerHeight + window.scrollY) {
            y = window.innerHeight + window.scrollY - 400;
        }
        if (y < window.scrollY) y = window.scrollY + 10;
        
        editor.style.left = x + 'px';
        editor.style.top = y + 'px';
        
        // Generate editor content based on element type
        let content = '';
        
        switch (type) {
            case 'anchor':
                content = createAnchorEditor(state);
                break;
            case 'button':
                content = createButtonEditor(state);
                break;
            case 'image':
                content = createImageEditor(state);
                break;
            case 'text':
                content = createTextEditor(state);
                break;
            default:
                content = createGenericEditor(type);
        }
        
        editor.innerHTML = content;
        
        // Add event listeners
        setupEditorListeners(editor, element, type);
        
        document.body.appendChild(editor);
        activeEditor = editor;
        
        // Focus first input
        const firstInput = editor.querySelector('input, textarea, select');
        if (firstInput) {
            firstInput.focus();
            if (firstInput.select) firstInput.select();
        }
    }
    
    // Create anchor editor content
    function createAnchorEditor(state) {
        return `
            <div class="element-editor-header">
                <h3 class="element-editor-title">Edit Link</h3>
                <button class="element-editor-close" type="button">×</button>
            </div>
            <div class="element-editor-content">
                <div class="element-form-group">
                    <label class="element-form-label">Link Text</label>
                    <input type="text" class="element-form-input" data-field="text" value="${state.text}" placeholder="Enter link text">
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">URL</label>
                    <input type="url" class="element-form-input" data-field="url" value="${state.url}" placeholder="https://example.com">
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">Target</label>
                    <select class="element-form-select" data-field="target">
                        <option value="_self" ${state.target === '_self' ? 'selected' : ''}>Same window</option>
                        <option value="_blank" ${state.target === '_blank' ? 'selected' : ''}>New window</option>
                        <option value="_parent" ${state.target === '_parent' ? 'selected' : ''}>Parent frame</option>
                        <option value="_top" ${state.target === '_top' ? 'selected' : ''}>Full window</option>
                    </select>
                    <div class="element-info">Current: ${state.target}</div>
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">Style</label>
                    <select class="element-form-select" data-field="style">
                        <option value="default" ${state.style === 'default' ? 'selected' : ''}>Default Link</option>
                        <option value="button" ${state.style === 'button' ? 'selected' : ''}>Button Style</option>
                        <option value="subtle" ${state.style === 'subtle' ? 'selected' : ''}>Subtle Link</option>
                        <option value="bold" ${state.style === 'bold' ? 'selected' : ''}>Bold Link</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    // Create button editor content
    function createButtonEditor(state) {
        return `
            <div class="element-editor-header">
                <h3 class="element-editor-title">Edit Button</h3>
                <button class="element-editor-close" type="button">×</button>
            </div>
            <div class="element-editor-content">
                <div class="element-form-group">
                    <label class="element-form-label">Button Text</label>
                    <input type="text" class="element-form-input" data-field="text" value="${state.text}" placeholder="Enter button text">
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">Style</label>
                    <select class="element-form-select" data-field="style">
                        <option value="primary" ${state.style === 'primary' ? 'selected' : ''}>Primary</option>
                        <option value="secondary" ${state.style === 'secondary' ? 'selected' : ''}>Secondary</option>
                        <option value="success" ${state.style === 'success' ? 'selected' : ''}>Success</option>
                        <option value="danger" ${state.style === 'danger' ? 'selected' : ''}>Danger</option>
                    </select>
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">Size</label>
                    <select class="element-form-select" data-field="size">
                        <option value="small" ${state.size === 'small' ? 'selected' : ''}>Small</option>
                        <option value="medium" ${state.size === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="large" ${state.size === 'large' ? 'selected' : ''}>Large</option>
                    </select>
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">Type</label>
                    <select class="element-form-select" data-field="type">
                        <option value="button" ${state.type === 'button' ? 'selected' : ''}>Button</option>
                        <option value="submit" ${state.type === 'submit' ? 'selected' : ''}>Submit</option>
                        <option value="reset" ${state.type === 'reset' ? 'selected' : ''}>Reset</option>
                    </select>
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">
                        <input type="checkbox" class="element-form-checkbox" data-field="disabled" ${state.disabled ? 'checked' : ''}>
                        Disabled
                    </label>
                </div>
            </div>
        `;
    }
    
    // Create image editor content
    function createImageEditor(state) {
        return `
            <div class="element-editor-header">
                <h3 class="element-editor-title">Edit Image</h3>
                <button class="element-editor-close" type="button">×</button>
            </div>
            <div class="element-editor-content">
                <div class="element-form-group">
                    <label class="element-form-label">Image URL</label>
                    <input type="url" class="element-form-input" data-field="src" value="${state.src}" placeholder="https://example.com/image.jpg">
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">Alt Text</label>
                    <input type="text" class="element-form-input" data-field="alt" value="${state.alt}" placeholder="Describe the image">
                </div>
                
                <div class="element-grid-2">
                    <div class="element-form-group">
                        <label class="element-form-label">Width</label>
                        <input type="number" class="element-form-input" data-field="width" value="${state.width}" placeholder="200">
                    </div>
                    <div class="element-form-group">
                        <label class="element-form-label">Height</label>
                        <input type="number" class="element-form-input" data-field="height" value="${state.height}" placeholder="150">
                    </div>
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">Style</label>
                    <select class="element-form-select" data-field="style">
                        <option value="default" ${state.style === 'default' ? 'selected' : ''}>Default</option>
                        <option value="rounded" ${state.style === 'rounded' ? 'selected' : ''}>Rounded Corners</option>
                        <option value="circle" ${state.style === 'circle' ? 'selected' : ''}>Circle</option>
                        <option value="shadow" ${state.style === 'shadow' ? 'selected' : ''}>Drop Shadow</option>
                        <option value="border" ${state.style === 'border' ? 'selected' : ''}>Border</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    // Create text editor content
    function createTextEditor(state) {
        return `
            <div class="element-editor-header">
                <h3 class="element-editor-title">Edit Text</h3>
                <button class="element-editor-close" type="button">×</button>
            </div>
            <div class="element-editor-content">
                <div class="element-form-group">
                    <label class="element-form-label">Text Content</label>
                    <textarea class="element-form-textarea" data-field="content" placeholder="Enter text content">${state.content}</textarea>
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">Tag Type</label>
                    <select class="element-form-select" data-field="tag">
                        <option value="p" ${state.tag === 'p' ? 'selected' : ''}>Paragraph (p)</option>
                        <option value="span" ${state.tag === 'span' ? 'selected' : ''}>Span</option>
                        <option value="div" ${state.tag === 'div' ? 'selected' : ''}>Div</option>
                        <option value="h1" ${state.tag === 'h1' ? 'selected' : ''}>Heading 1</option>
                        <option value="h2" ${state.tag === 'h2' ? 'selected' : ''}>Heading 2</option>
                        <option value="h3" ${state.tag === 'h3' ? 'selected' : ''}>Heading 3</option>
                        <option value="h4" ${state.tag === 'h4' ? 'selected' : ''}>Heading 4</option>
                        <option value="h5" ${state.tag === 'h5' ? 'selected' : ''}>Heading 5</option>
                        <option value="h6" ${state.tag === 'h6' ? 'selected' : ''}>Heading 6</option>
                    </select>
                </div>
                
                <div class="element-form-group">
                    <label class="element-form-label">Style</label>
                    <select class="element-form-select" data-field="style">
                        <option value="default" ${state.style === 'default' ? 'selected' : ''}>Default</option>
                        <option value="highlight" ${state.style === 'highlight' ? 'selected' : ''}>Highlighted</option>
                        <option value="emphasis" ${state.style === 'emphasis' ? 'selected' : ''}>Emphasis</option>
                        <option value="strong" ${state.style === 'strong' ? 'selected' : ''}>Strong</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    // Create generic editor content
    function createGenericEditor(type) {
        return `
            <div class="element-editor-header">
                <h3 class="element-editor-title">Edit ${type}</h3>
                <button class="element-editor-close" type="button">×</button>
            </div>
            <div class="element-editor-content">
                <p class="element-info">Editor for ${type} elements is not yet implemented.</p>
            </div>
        `;
    }
    
    // Setup editor event listeners
    function setupEditorListeners(editor, element, type) {
        const closeBtn = editor.querySelector('.element-editor-close');
        const inputs = editor.querySelectorAll('[data-field]');
        
        function updateState() {
            const newState = {};
            inputs.forEach(input => {
                const field = input.dataset.field;
                if (input.type === 'checkbox') {
                    newState[field] = input.checked;
                } else {
                    newState[field] = input.value;
                }
            });
            
            const currentState = editorStates.get(element.dataset.editorId);
            const mergedState = { ...currentState, ...newState };
            editorStates.set(element.dataset.editorId, mergedState);
            updateElement(element, mergedState);
            
            // Update info displays
            const targetInfo = editor.querySelector('.element-info');
            if (targetInfo && newState.target) {
                targetInfo.textContent = `Current: ${newState.target}`;
            }
        }
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.addEventListener('change', updateState);
            } else {
                input.addEventListener('input', updateState);
            }
        });
        
        closeBtn.addEventListener('click', () => {
            closeEditor();
        });
        
        // Close editor when clicking outside
        function handleClickOutside(event) {
            if (!editor.contains(event.target) && event.target !== element) {
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
    }
    
    // Add edit indicator to editable elements
    function addEditIndicator(element) {
        if (!element.querySelector('.element-edit-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'element-edit-indicator';
            indicator.innerHTML = '✎';
            indicator.title = 'Click to edit';
            element.appendChild(indicator);
        }
    }
    
    // Initialize editable elements
    function initializeEditableElements() {
        const editableElements = document.querySelectorAll('[data-editable="true"]');
        
        editableElements.forEach(element => {
            element.classList.add('element-editable');
            addEditIndicator(element);
            
            // Remove existing listeners to prevent duplicates
            element.removeEventListener('click', handleElementClick);
            element.addEventListener('click', handleElementClick);
        });
    }
    
    // Handle element click
    function handleElementClick(event) {
        // Close any existing editor
        if (activeEditor) {
            activeEditor.parentNode.removeChild(activeEditor);
            activeEditor = null;
        }
        
        // Prevent default behavior when editing
        event.preventDefault();
        event.stopPropagation();
        
        createEditor(this);
    }
    
    // Auto-initialize when DOM is ready
    function initialize() {
        injectStyles();
        initializeEditableElements();
        
        // Watch for new elements added to the page
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('[data-editable="true"]')) {
                            node.classList.add('element-editable');
                            addEditIndicator(node);
                            node.addEventListener('click', handleElementClick);
                        }
                        
                        // Check children too
                        const editableElements = node.querySelectorAll && node.querySelectorAll('[data-editable="true"]');
                        if (editableElements) {
                            editableElements.forEach(element => {
                                element.classList.add('element-editable');
                                addEditIndicator(element);
                                element.addEventListener('click', handleElementClick);
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
    window.ElementEditor = {
        init: initialize,
        makeEditable: function(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.setAttribute('data-editable', 'true');
                element.classList.add('element-editable');
                addEditIndicator(element);
                element.addEventListener('click', handleElementClick);
            });
        },
        getState: function(element) {
            return getElementState(element);
        },
        setState: function(element, state) {
            const id = element.dataset.editorId || generateId();
            element.dataset.editorId = id;
            editorStates.set(id, state);
            updateElement(element, state);
        },
        getType: getElementType
    };
    
})();