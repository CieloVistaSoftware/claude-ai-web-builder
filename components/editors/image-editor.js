/**
 * Image Editor Web Component
 * Usage: Include this script and add data-editable="true" to img elements
 */

(function() {
    'use strict';
    
    // Store for managing editor states
    const imageStates = new Map();
    let activeEditor = null;
    
    // Default image state
    const defaultState = {
        src: 'https://picsum.photos/200/150',
        alt: 'Image',
        width: '200',
        height: '150',
        style: 'default'
    };
    
    // CSS styles for the editor
    const editorStyles = `
        .image-editor {
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
        
        .image-editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid #374151;
        }
        
        .image-editor-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .image-editor-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
        }
        
        .image-editor-close:hover {
            color: #d1d5db;
        }
        
        .image-editor-content {
            padding: 16px;
        }
        
        .image-form-group {
            margin-bottom: 16px;
        }
        
        .image-form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #d1d5db;
            margin-bottom: 4px;
        }
        
        .image-form-input, .image-form-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #4b5563;
            background-color: #374151;
            color: #f9fafb;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .image-form-input:focus, .image-form-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        .image-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .image-editable {
            position: relative;
            cursor: pointer;
        }
        
        .image-editable:hover {
            outline: 2px dashed #3b82f6;
            outline-offset: 2px;
        }
        
        .image-edit-indicator {
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
        
        .image-editable:hover .image-edit-indicator {
            opacity: 1;
        }
        
        /* Image styles */
        .img-default { border: 1px solid transparent; }
        .img-rounded { border-radius: 8px; }
        .img-circle { border-radius: 50%; }
        .img-shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .img-border { border: 2px solid #d1d5db; }
    `;
    
    // Inject CSS styles
    function injectStyles() {
        if (document.querySelector('#image-editor-styles')) return;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'image-editor-styles';
        styleSheet.textContent = editorStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Get current state of an image element
    function getImageState(element) {
        const id = element.dataset.imageEditorId || generateId();
        element.dataset.imageEditorId = id;
        
        if (!imageStates.has(id)) {
            imageStates.set(id, {
                src: element.getAttribute('src') || defaultState.src,
                alt: element.getAttribute('alt') || defaultState.alt,
                width: element.getAttribute('width') || defaultState.width,
                height: element.getAttribute('height') || defaultState.height,
                style: element.dataset.style || defaultState.style
            });
        }
        
        return imageStates.get(id);
    }
    
    // Update image element with new state
    function updateImageElement(element, state) {
        element.setAttribute('src', state.src);
        element.setAttribute('alt', state.alt);
        element.setAttribute('width', state.width);
        element.setAttribute('height', state.height);
        element.dataset.style = state.style;
        
        // Apply style classes
        element.className = element.className.replace(/img-\w+/g, '');
        element.classList.add(`img-${state.style}`);
    }
    
    // Generate unique ID
    function generateId() {
        return 'image-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Create editor interface
    function createEditor(imageElement) {
        const state = getImageState(imageElement);
        const rect = imageElement.getBoundingClientRect();
        
        const editor = document.createElement('div');
        editor.className = 'image-editor';
        
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
        
        editor.innerHTML = `
            <div class="image-editor-header">
                <h3 class="image-editor-title">Edit Image</h3>
                <button class="image-editor-close" type="button">×</button>
            </div>
            <div class="image-editor-content">
                <div class="image-form-group">
                    <label class="image-form-label">Image URL</label>
                    <input type="url" class="image-form-input" id="image-src" value="${state.src}" placeholder="https://example.com/image.jpg" title="Image source URL">
                </div>
                
                <div class="image-form-group">
                    <label class="image-form-label">Alt Text</label>
                    <input type="text" class="image-form-input" id="image-alt" value="${state.alt}" placeholder="Describe the image" title="Alternative text for accessibility">
                </div>
                
                <div class="image-grid-2">
                    <div class="image-form-group">
                        <label class="image-form-label">Width</label>
                        <input type="number" class="image-form-input" id="image-width" value="${state.width}" placeholder="200" title="Image width in pixels">
                    </div>
                    <div class="image-form-group">
                        <label class="image-form-label">Height</label>
                        <input type="number" class="image-form-input" id="image-height" value="${state.height}" placeholder="150" title="Image height in pixels">
                    </div>
                </div>
                
                <div class="image-form-group">
                    <label class="image-form-label">Style</label>
                    <select class="image-form-select" id="image-style" title="Image styling options">
                        <option value="default" ${state.style === 'default' ? 'selected' : ''}>Default</option>
                        <option value="rounded" ${state.style === 'rounded' ? 'selected' : ''}>Rounded Corners</option>
                        <option value="circle" ${state.style === 'circle' ? 'selected' : ''}>Circle</option>
                        <option value="shadow" ${state.style === 'shadow' ? 'selected' : ''}>Drop Shadow</option>
                        <option value="border" ${state.style === 'border' ? 'selected' : ''}>Border</option>
                    </select>
                </div>
            </div>
        `;
        
        // Add event listeners
        const srcInput = editor.querySelector('#image-src');
        const altInput = editor.querySelector('#image-alt');
        const widthInput = editor.querySelector('#image-width');
        const heightInput = editor.querySelector('#image-height');
        const styleSelect = editor.querySelector('#image-style');
        const closeBtn = editor.querySelector('.image-editor-close');
        
        function updateState() {
            const newState = {
                src: srcInput.value,
                alt: altInput.value,
                width: widthInput.value,
                height: heightInput.value,
                style: styleSelect.value
            };
            
            imageStates.set(imageElement.dataset.imageEditorId, newState);
            updateImageElement(imageElement, newState);
        }
        
        srcInput.addEventListener('input', updateState);
        altInput.addEventListener('input', updateState);
        widthInput.addEventListener('input', updateState);
        heightInput.addEventListener('input', updateState);
        styleSelect.addEventListener('change', updateState);
        
        closeBtn.addEventListener('click', () => {
            closeEditor();
        });
        
        // Close editor when clicking outside
        function handleClickOutside(event) {
            if (!editor.contains(event.target) && event.target !== imageElement) {
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
        srcInput.focus();
        srcInput.select();
    }
    
    // Add edit indicator to editable images
    function addEditIndicator(image) {
        if (!image.querySelector('.image-edit-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'image-edit-indicator';
            indicator.innerHTML = '✎';
            indicator.title = 'Click to edit';
            image.style.position = 'relative';
            image.parentNode.insertBefore(indicator, image.nextSibling);
            
            // Position indicator relative to image
            const updateIndicatorPosition = () => {
                const rect = image.getBoundingClientRect();
                indicator.style.position = 'absolute';
                indicator.style.left = (rect.right - 8) + 'px';
                indicator.style.top = (rect.top - 8) + 'px';
            };
            
            updateIndicatorPosition();
            window.addEventListener('resize', updateIndicatorPosition);
            window.addEventListener('scroll', updateIndicatorPosition);
        }
    }
    
    // Initialize editable images
    function initializeEditableImages() {
        const editableImages = document.querySelectorAll('img[data-editable="true"]');
        
        editableImages.forEach(image => {
            image.classList.add('image-editable');
            addEditIndicator(image);
            
            // Remove existing listeners to prevent duplicates
            image.removeEventListener('click', handleImageClick);
            image.addEventListener('click', handleImageClick);
        });
    }
    
    // Handle image click
    function handleImageClick(event) {
        // Close any existing editor
        if (activeEditor) {
            activeEditor.parentNode.removeChild(activeEditor);
            activeEditor = null;
        }
        
        // Prevent default image behavior when editing
        event.preventDefault();
        event.stopPropagation();
        
        createEditor(this);
    }
    
    // Auto-initialize when DOM is ready
    function initialize() {
        injectStyles();
        initializeEditableImages();
        
        // Watch for new images added to the page
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('img[data-editable="true"]')) {
                            node.classList.add('image-editable');
                            addEditIndicator(node);
                            node.addEventListener('click', handleImageClick);
                        }
                        
                        // Check children too
                        const editableImages = node.querySelectorAll && node.querySelectorAll('img[data-editable="true"]');
                        if (editableImages) {
                            editableImages.forEach(image => {
                                image.classList.add('image-editable');
                                addEditIndicator(image);
                                image.addEventListener('click', handleImageClick);
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
    window.ImageEditor = {
        init: initialize,
        makeEditable: function(selector) {
            const images = document.querySelectorAll(selector);
            images.forEach(image => {
                image.setAttribute('data-editable', 'true');
                image.classList.add('image-editable');
                addEditIndicator(image);
                image.addEventListener('click', handleImageClick);
            });
        },
        getState: function(image) {
            return getImageState(image);
        },
        setState: function(image, state) {
            const id = image.dataset.imageEditorId || generateId();
            image.dataset.imageEditorId = id;
            imageStates.set(id, state);
            updateImageElement(image, state);
        }
    };
    
})();