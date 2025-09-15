/**
 * Video Editor Web Component
 * Usage: Include this script and add data-editable="true" to video elements
 */

(function() {
    'use strict';
    
    // Store for managing editor states
    const videoStates = new Map();
    let activeEditor = null;
    
    // Default video state
    const defaultState = {
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        poster: '',
        width: '320',
        height: '240',
        controls: true,
        autoplay: false,
        muted: false,
        loop: false,
        style: 'default'
    };
    
    // CSS styles for the editor
    const editorStyles = `
        .video-editor {
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
        
        .video-editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid #374151;
        }
        
        .video-editor-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .video-editor-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
        }
        
        .video-editor-close:hover {
            color: #d1d5db;
        }
        
        .video-editor-content {
            padding: 16px;
        }
        
        .video-form-group {
            margin-bottom: 16px;
        }
        
        .video-form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #d1d5db;
            margin-bottom: 4px;
        }
        
        .video-form-input, .video-form-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #4b5563;
            background-color: #374151;
            color: #f9fafb;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .video-form-input:focus, .video-form-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        .video-form-checkbox {
            margin-right: 8px;
        }
        
        .video-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .video-editable {
            position: relative;
            cursor: pointer;
        }
        
        .video-editable:hover {
            outline: 2px dashed #3b82f6;
            outline-offset: 2px;
        }
        
        .video-edit-indicator {
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
        
        .video-editable:hover .video-edit-indicator {
            opacity: 1;
        }
        
        /* Video styles */
        .video-default { border: 1px solid transparent; }
        .video-rounded { border-radius: 8px; }
        .video-shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .video-border { border: 2px solid #d1d5db; }
    `;
    
    // Inject CSS styles
    function injectStyles() {
        if (document.querySelector('#video-editor-styles')) return;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'video-editor-styles';
        styleSheet.textContent = editorStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Get current state of a video element
    function getVideoState(element) {
        const id = element.dataset.videoEditorId || generateId();
        element.dataset.videoEditorId = id;
        
        if (!videoStates.has(id)) {
            videoStates.set(id, {
                src: element.getAttribute('src') || element.querySelector('source')?.getAttribute('src') || defaultState.src,
                poster: element.getAttribute('poster') || defaultState.poster,
                width: element.getAttribute('width') || defaultState.width,
                height: element.getAttribute('height') || defaultState.height,
                controls: element.hasAttribute('controls'),
                autoplay: element.hasAttribute('autoplay'),
                muted: element.hasAttribute('muted'),
                loop: element.hasAttribute('loop'),
                style: element.dataset.style || defaultState.style
            });
        }
        
        return videoStates.get(id);
    }
    
    // Update video element with new state
    function updateVideoElement(element, state) {
        // Update src
        if (element.querySelector('source')) {
            element.querySelector('source').setAttribute('src', state.src);
        } else {
            element.setAttribute('src', state.src);
        }
        
        // Update poster
        if (state.poster) {
            element.setAttribute('poster', state.poster);
        } else {
            element.removeAttribute('poster');
        }
        
        // Update dimensions
        element.setAttribute('width', state.width);
        element.setAttribute('height', state.height);
        
        // Update boolean attributes
        if (state.controls) element.setAttribute('controls', '');
        else element.removeAttribute('controls');
        
        if (state.autoplay) element.setAttribute('autoplay', '');
        else element.removeAttribute('autoplay');
        
        if (state.muted) element.setAttribute('muted', '');
        else element.removeAttribute('muted');
        
        if (state.loop) element.setAttribute('loop', '');
        else element.removeAttribute('loop');
        
        // Update style
        element.dataset.style = state.style;
        element.className = element.className.replace(/video-\w+/g, '');
        element.classList.add(`video-${state.style}`);
        
        // Reload video to apply changes
        element.load();
    }
    
    // Generate unique ID
    function generateId() {
        return 'video-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Create editor interface
    function createEditor(videoElement) {
        const state = getVideoState(videoElement);
        const rect = videoElement.getBoundingClientRect();
        
        const editor = document.createElement('div');
        editor.className = 'video-editor';
        
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
            <div class="video-editor-header">
                <h3 class="video-editor-title">Edit Video</h3>
                <button class="video-editor-close" type="button">×</button>
            </div>
            <div class="video-editor-content">
                <div class="video-form-group">
                    <label class="video-form-label">Video URL</label>
                    <input type="url" class="video-form-input" id="video-src" value="${state.src}" placeholder="https://example.com/video.mp4" title="Video source URL">
                </div>
                
                <div class="video-form-group">
                    <label class="video-form-label">Poster Image URL</label>
                    <input type="url" class="video-form-input" id="video-poster" value="${state.poster}" placeholder="https://example.com/poster.jpg" title="Poster image shown before video plays">
                </div>
                
                <div class="video-grid-2">
                    <div class="video-form-group">
                        <label class="video-form-label">Width</label>
                        <input type="number" class="video-form-input" id="video-width" value="${state.width}" placeholder="320" title="Video width in pixels">
                    </div>
                    <div class="video-form-group">
                        <label class="video-form-label">Height</label>
                        <input type="number" class="video-form-input" id="video-height" value="${state.height}" placeholder="240" title="Video height in pixels">
                    </div>
                </div>
                
                <div class="video-form-group">
                    <label class="video-form-label">Style</label>
                    <select class="video-form-select" id="video-style" title="Video styling options">
                        <option value="default" ${state.style === 'default' ? 'selected' : ''}>Default</option>
                        <option value="rounded" ${state.style === 'rounded' ? 'selected' : ''}>Rounded Corners</option>
                        <option value="shadow" ${state.style === 'shadow' ? 'selected' : ''}>Drop Shadow</option>
                        <option value="border" ${state.style === 'border' ? 'selected' : ''}>Border</option>
                    </select>
                </div>
                
                <div class="video-form-group">
                    <label class="video-form-label">
                        <input type="checkbox" class="video-form-checkbox" id="video-controls" ${state.controls ? 'checked' : ''}>
                        Show Controls
                    </label>
                </div>
                
                <div class="video-form-group">
                    <label class="video-form-label">
                        <input type="checkbox" class="video-form-checkbox" id="video-autoplay" ${state.autoplay ? 'checked' : ''}>
                        Autoplay
                    </label>
                </div>
                
                <div class="video-form-group">
                    <label class="video-form-label">
                        <input type="checkbox" class="video-form-checkbox" id="video-muted" ${state.muted ? 'checked' : ''}>
                        Muted
                    </label>
                </div>
                
                <div class="video-form-group">
                    <label class="video-form-label">
                        <input type="checkbox" class="video-form-checkbox" id="video-loop" ${state.loop ? 'checked' : ''}>
                        Loop
                    </label>
                </div>
            </div>
        `;
        
        // Add event listeners
        const srcInput = editor.querySelector('#video-src');
        const posterInput = editor.querySelector('#video-poster');
        const widthInput = editor.querySelector('#video-width');
        const heightInput = editor.querySelector('#video-height');
        const styleSelect = editor.querySelector('#video-style');
        const controlsCheckbox = editor.querySelector('#video-controls');
        const autoplayCheckbox = editor.querySelector('#video-autoplay');
        const mutedCheckbox = editor.querySelector('#video-muted');
        const loopCheckbox = editor.querySelector('#video-loop');
        const closeBtn = editor.querySelector('.video-editor-close');
        
        function updateState() {
            const newState = {
                src: srcInput.value,
                poster: posterInput.value,
                width: widthInput.value,
                height: heightInput.value,
                style: styleSelect.value,
                controls: controlsCheckbox.checked,
                autoplay: autoplayCheckbox.checked,
                muted: mutedCheckbox.checked,
                loop: loopCheckbox.checked
            };
            
            videoStates.set(videoElement.dataset.videoEditorId, newState);
            updateVideoElement(videoElement, newState);
        }
        
        srcInput.addEventListener('input', updateState);
        posterInput.addEventListener('input', updateState);
        widthInput.addEventListener('input', updateState);
        heightInput.addEventListener('input', updateState);
        styleSelect.addEventListener('change', updateState);
        controlsCheckbox.addEventListener('change', updateState);
        autoplayCheckbox.addEventListener('change', updateState);
        mutedCheckbox.addEventListener('change', updateState);
        loopCheckbox.addEventListener('change', updateState);
        
        closeBtn.addEventListener('click', () => {
            closeEditor();
        });
        
        // Close editor when clicking outside
        function handleClickOutside(event) {
            if (!editor.contains(event.target) && event.target !== videoElement) {
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
    
    // Add edit indicator to editable videos
    function addEditIndicator(video) {
        if (!video.querySelector('.video-edit-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'video-edit-indicator';
            indicator.innerHTML = '✎';
            indicator.title = 'Click to edit';
            video.style.position = 'relative';
            video.parentNode.style.position = 'relative';
            video.parentNode.appendChild(indicator);
        }
    }
    
    // Initialize editable videos
    function initializeEditableVideos() {
        const editableVideos = document.querySelectorAll('video[data-editable="true"]');
        
        editableVideos.forEach(video => {
            video.classList.add('video-editable');
            addEditIndicator(video);
            
            // Remove existing listeners to prevent duplicates
            video.removeEventListener('click', handleVideoClick);
            video.addEventListener('click', handleVideoClick);
        });
    }
    
    // Handle video click
    function handleVideoClick(event) {
        // Close any existing editor
        if (activeEditor) {
            activeEditor.parentNode.removeChild(activeEditor);
            activeEditor = null;
        }
        
        // Prevent default video behavior when editing
        event.preventDefault();
        event.stopPropagation();
        
        createEditor(this);
    }
    
    // Auto-initialize when DOM is ready
    function initialize() {
        injectStyles();
        initializeEditableVideos();
        
        // Watch for new videos added to the page
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('video[data-editable="true"]')) {
                            node.classList.add('video-editable');
                            addEditIndicator(node);
                            node.addEventListener('click', handleVideoClick);
                        }
                        
                        // Check children too
                        const editableVideos = node.querySelectorAll && node.querySelectorAll('video[data-editable="true"]');
                        if (editableVideos) {
                            editableVideos.forEach(video => {
                                video.classList.add('video-editable');
                                addEditIndicator(video);
                                video.addEventListener('click', handleVideoClick);
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
    window.VideoEditor = {
        init: initialize,
        makeEditable: function(selector) {
            const videos = document.querySelectorAll(selector);
            videos.forEach(video => {
                video.setAttribute('data-editable', 'true');
                video.classList.add('video-editable');
                addEditIndicator(video);
                video.addEventListener('click', handleVideoClick);
            });
        },
        getState: function(video) {
            return getVideoState(video);
        },
        setState: function(video, state) {
            const id = video.dataset.videoEditorId || generateId();
            video.dataset.videoEditorId = id;
            videoStates.set(id, state);
            updateVideoElement(video, state);
        }
    };
    
})();