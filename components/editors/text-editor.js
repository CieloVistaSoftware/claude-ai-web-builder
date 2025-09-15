/**
 * Text Editor Web Component
 * Usage: Include this script and add data-editable="true" to text elements (p, span, div, h1-h6)
 */

(function() {
    'use strict';
    
    // Store for managing editor states
    const textStates = new Map();
    let activeEditor = null;
    
    // Default text state
    const defaultState = {
        content: 'Text content',
        tag: 'p',
        style: 'default',
        fontSize: '16',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#000000'
    };
    
    // CSS styles for the editor
    const editorStyles = `
        .text-editor {
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
        
        .text-editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid #374151;
        }
        
        .text-editor-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .text-editor-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
        }
        
        .text-editor-close:hover {
            color: #d1d5db;
        }
        
        .text-editor-content {
            padding: 16px;
        }
        
        .text-form-group {
            margin-bottom: 16px;
        }
        
        .text-form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #d1d5db;
            margin-bottom: 4px;
        }
        
        .text-form-input, .text-form-select, .text-form-textarea {
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
        
        .text-form-textarea {
            min-height: 80px;
            resize: vertical;
        }
        
        .text-form-input:focus, .text-form-select:focus, .text-form-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        .text-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .text-editable {
            position: relative;
            cursor: pointer;
        }
        
        .text-editable:hover {
            outline: 2px dashed #3b82f6;
            outline-offset: 2px;
        }
        
        .text-edit-indicator {
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
        
        .text-editable:hover .text-edit-indicator {
            opacity: 1;
        }
        
        /* Text styles */
        .text-default { }
        .text-highlight { background-color: #fef3c7; padding: 2px 4px; border-radius: 4px; }
        .text-emphasis { font-style: italic; color: #6b7280; }
        .text-strong { font-weight: bold; }
        .text-quote { font-style: italic; border-left: 4px solid #d1d5db; padding-left: 16px; margin-left: 8px; }
        .text-code { font-family: monospace; background-color: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
    `;
    
    // Inject CSS styles
    function injectStyles() {
        if (document.querySelector('#text-editor-styles')) return;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'text-editor-styles';
        styleSheet.textContent = editorStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Get current state of a text element
    function getTextState(element) {
        const id = element.dataset.textEditorId || generateId();
        element.dataset.textEditorId = id;
        
        if (!textStates.has(id)) {
            const computedStyle = window.getComputedStyle(element);
            textStates.set(id, {
                content: element.textContent || defaultState.content,
                tag: element.tagName.toLowerCase(),
                style: element.dataset.style || defaultState.style,
                fontSize: element.dataset.fontSize || parseInt(computedStyle.fontSize) || defaultState.fontSize,
                fontWeight: element.dataset.fontWeight || computedStyle.fontWeight || defaultState.fontWeight,
                fontStyle: element.dataset.fontStyle || computedStyle.fontStyle || defaultState.fontStyle,
                textAlign: element.dataset.textAlign || computedStyle.textAlign || defaultState.textAlign,
                color: element.dataset.color || rgbToHex(computedStyle.color) || defaultState.color
            });
        }
        
        return textStates.get(id);
    }
    
    // Convert RGB to Hex
    function rgbToHex(rgb) {
        if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return '#000000';
        const result = rgb.match(/\d+/g);
        if (!result) return '#000000';
        return '#' + ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1);
    }
    
    // Update text element with new state
    function updateTextElement(element, state) {
        // Update content
        element.textContent = state.content;
        
        // Store data attributes
        element.dataset.style = state.style;
        element.dataset.fontSize = state.fontSize;
        element.dataset.fontWeight = state.fontWeight;
        element.dataset.fontStyle = state.fontStyle;
        element.dataset.textAlign = state.textAlign;
        element.dataset.color = state.color;
        
        // Apply style classes
        element.className = element.className.replace(/text-\w+/g, '');
        element.classList.add(`text-${state.style}`);
        
        // Apply direct styles
        element.style.fontSize = state.fontSize + 'px';
        element.style.fontWeight = state.fontWeight;
        element.style.fontStyle = state.fontStyle;
        element.style.textAlign = state.textAlign;
        element.style.color = state.color;
        
        // Change tag if needed
        if (state.tag !== element.tagName.toLowerCase()) {
            const newElement = document.createElement(state.tag);
            newElement.textContent = state.content;
            newElement.className = element.className;
            newElement.dataset.textEditorId = element.dataset.textEditorId;
            newElement.dataset.editable = 'true';
            
            // Copy all data attributes
            Object.keys(state).forEach(key => {
                newElement.dataset[key] = state[key];
            });
            
            // Apply styles
            newElement.style.fontSize = state.fontSize + 'px';
            newElement.style.fontWeight = state.fontWeight;
            newElement.style.fontStyle = state.fontStyle;
            newElement.style.textAlign = state.textAlign;
            newElement.style.color = state.color;
            
            // Replace the element
            element.parentNode.replaceChild(newElement, element);
            
            // Add editor functionality to new element
            newElement.classList.add('text-editable');
            addEditIndicator(newElement);
            newElement.addEventListener('click', handleTextClick);
        }
    }
    
    // Generate unique ID
    function generateId() {
        return 'text-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Create editor interface
    function createEditor(textElement) {
        const state = getTextState(textElement);
        const rect = textElement.getBoundingClientRect();
        
        const editor = document.createElement('div');
        editor.className = 'text-editor';
        
        // Position editor
        let x = rect.right + 10;
        let y = rect.top + window.scrollY;
        
        if (x + 350 > window.innerWidth) {
            x = rect.left - 360;
        }
        if (y + 500 > window.innerHeight + window.scrollY) {
            y = window.innerHeight + window.scrollY - 500;
        }
        if (y < window.scrollY) y = window.scrollY + 10;
        
        editor.style.left = x + 'px';
        editor.style.top = y + 'px';
        
        editor.innerHTML = `
            <div class="text-editor-header">
                <h3 class="text-editor-title">Edit Text</h3>
                <button class="text-editor-close" type="button">×</button>
            </div>
            <div class="text-editor-content">
                <div class="text-form-group">
                    <label class="text-form-label">Text Content</label>
                    <textarea class="text-form-textarea" id="text-content" placeholder="Enter text content" title="Text content">${state.content}</textarea>
                </div>
                
                <div class="text-form-group">
                    <label class="text-form-label">Tag Type</label>
                    <select class="text-form-select" id="text-tag" title="HTML tag type">
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
                
                <div class="text-form-group">
                    <label class="text-form-label">Style</label>
                    <select class="text-form-select" id="text-style" title="Text styling options">
                        <option value="default" ${state.style === 'default' ? 'selected' : ''}>Default</option>
                        <option value="highlight" ${state.style === 'highlight' ? 'selected' : ''}>Highlighted</option>
                        <option value="emphasis" ${state.style === 'emphasis' ? 'selected' : ''}>Emphasis</option>
                        <option value="strong" ${state.style === 'strong' ? 'selected' : ''}>Strong</option>
                        <option value="quote" ${state.style === 'quote' ? 'selected' : ''}>Quote</option>
                        <option value="code" ${state.style === 'code' ? 'selected' : ''}>Code</option>
                    </select>
                </div>
                
                <div class="text-grid-2">
                    <div class="text-form-group">
                        <label class="text-form-label">Font Size</label>
                        <input type="number" class="text-form-input" id="text-fontSize" value="${state.fontSize}" placeholder="16" title="Font size in pixels" min="8" max="72">
                    </div>
                    <div class="text-form-group">
                        <label class="text-form-label">Color</label>
                        <input type="color" class="text-form-input" id="text-color" value="${state.color}" title="Text color">
                    </div>
                </div>
                
                <div class="text-grid-2">
                    <div class="text-form-group">
                        <label class="text-form-label">Font Weight</label>
                        <select class="text-form-select" id="text-fontWeight" title="Font weight">
                            <option value="normal" ${state.fontWeight === 'normal' ? 'selected' : ''}>Normal</option>
                            <option value="bold" ${state.fontWeight === 'bold' ? 'selected' : ''}>Bold</option>
                            <option value="lighter" ${state.fontWeight === 'lighter' ? 'selected' : ''}>Lighter</option>
                            <option value="bolder" ${state.fontWeight === 'bolder' ? 'selected' : ''}>Bolder</option>
                        </select>
                    </div>
                    <div class="text-form-group">
                        <label class="text-form-label">Font Style</label>
                        <select class="text-form-select" id="text-fontStyle" title="Font style">
                            <option value="normal" ${state.fontStyle === 'normal' ? 'selected' : ''}>Normal</option>
                            <option value="italic" ${state.fontStyle === 'italic' ? 'selected' : ''}>Italic</option>
                            <option value="oblique" ${state.fontStyle === 'oblique' ? 'selected' : ''}>Oblique</option>
                        </select>
                    </div>
                </div>
                
                <div class="text-form-group">
                    <label class="text-form-label">Text Align</label>
                    <select class="text-form-select" id="text-textAlign" title="Text alignment">
                        <option value="left" ${state.textAlign === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${state.textAlign === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${state.textAlign === 'right' ? 'selected' : ''}>Right</option>
                        <option value="justify" ${state.textAlign === 'justify' ? 'selected' : ''}>Justify</option>
                    </select>
                </div>
            </div>
        `;
        
        // Add event listeners
        const contentTextarea = editor.querySelector('#text-content');
        const tagSelect = editor.querySelector('#text-tag');
        const styleSelect = editor.querySelector('#text-style');
        const fontSizeInput = editor.querySelector('#text-fontSize');
        const colorInput = editor.querySelector('#text-color');
        const fontWeightSelect = editor.querySelector('#text-fontWeight');
        const fontStyleSelect = editor.querySelector('#text-fontStyle');
        const textAlignSelect = editor.querySelector('#text-textAlign');
        const closeBtn = editor.querySelector('.text-editor-close');
        
        function updateState() {
            const newState = {
                content: contentTextarea.value,
                tag: tagSelect.value,
                style: styleSelect.value,
                fontSize: fontSizeInput.value,
                color: colorInput.value,
                fontWeight: fontWeightSelect.value,
                fontStyle: fontStyleSelect.value,
                textAlign: textAlignSelect.value
            };
            
            textStates.set(textElement.dataset.textEditorId, newState);
            updateTextElement(textElement, newState);
        }
        
        contentTextarea.addEventListener('input', updateState);
        tagSelect.addEventListener('change', updateState);
        styleSelect.addEventListener('change', updateState);
        fontSizeInput.addEventListener('input', updateState);
        colorInput.addEventListener('change', updateState);
        fontWeightSelect.addEventListener('change', updateState);
        fontStyleSelect.addEventListener('change', updateState);
        textAlignSelect.addEventListener('change', updateState);
        
        closeBtn.addEventListener('click', () => {
            closeEditor();
        });
        
        // Close editor when clicking outside
        function handleClickOutside(event) {
            if (!editor.contains(event.target) && event.target !== textElement) {
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
        contentTextarea.focus();
        contentTextarea.select();
    }
    
    // Add edit indicator to editable text elements
    function addEditIndicator(textElement) {
        if (!textElement.querySelector('.text-edit-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'text-edit-indicator';
            indicator.innerHTML = '✎';
            indicator.title = 'Click to edit';
            textElement.appendChild(indicator);
        }
    }
    
    // Initialize editable text elements
    function initializeEditableTextElements() {
        const editableElements = document.querySelectorAll('p[data-editable="true"], span[data-editable="true"], div[data-editable="true"], h1[data-editable="true"], h2[data-editable="true"], h3[data-editable="true"], h4[data-editable="true"], h5[data-editable="true"], h6[data-editable="true"]');
        
        editableElements.forEach(element => {
            element.classList.add('text-editable');
            addEditIndicator(element);
            
            // Remove existing listeners to prevent duplicates
            element.removeEventListener('click', handleTextClick);
            element.addEventListener('click', handleTextClick);
        });
    }
    
    // Handle text element click
    function handleTextClick(event) {
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
        initializeEditableTextElements();
        
        // Watch for new text elements added to the page
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        const textTags = ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
                        if (node.matches && textTags.some(tag => node.matches(`${tag}[data-editable="true"]`))) {
                            node.classList.add('text-editable');
                            addEditIndicator(node);
                            node.addEventListener('click', handleTextClick);
                        }
                        
                        // Check children too
                        const editableElements = node.querySelectorAll && node.querySelectorAll('p[data-editable="true"], span[data-editable="true"], div[data-editable="true"], h1[data-editable="true"], h2[data-editable="true"], h3[data-editable="true"], h4[data-editable="true"], h5[data-editable="true"], h6[data-editable="true"]');
                        if (editableElements) {
                            editableElements.forEach(element => {
                                element.classList.add('text-editable');
                                addEditIndicator(element);
                                element.addEventListener('click', handleTextClick);
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
    window.TextEditor = {
        init: initialize,
        makeEditable: function(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.setAttribute('data-editable', 'true');
                element.classList.add('text-editable');
                addEditIndicator(element);
                element.addEventListener('click', handleTextClick);
            });
        },
        getState: function(element) {
            return getTextState(element);
        },
        setState: function(element, state) {
            const id = element.dataset.textEditorId || generateId();
            element.dataset.textEditorId = id;
            textStates.set(id, state);
            updateTextElement(element, state);
        }
    };
    
})();