// Simple Auto-Attach Image Insert Component
// Automatically attaches to ALL semantic elements - double-click to edit

(function() {
    'use strict';
    
    console.log('🖼️ Image Insert Component: Starting initialization...');
    
    // Configuration
    const SEMANTIC_ELEMENTS = ['header', 'nav', 'main', 'article', 'section', 'aside', 'figure', 'footer'];
    
    console.log('🖼️ Image Insert: Configured for elements:', SEMANTIC_ELEMENTS);
    
    // Load CSS file if not already present
    function loadCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('image-insert.js', '../components/wb-image-insert/') + 'image-insert.css';
            window.WBComponentUtils.loadCSS('image-insert', cssPath);
        } else {
            // Fallback for when WBComponentUtils is not available
            if (document.getElementById('image-insert-styles')) {
                console.log('🖼️ Image Insert: CSS already loaded, skipping');
                return;
            }
            
            console.log('🖼️ Image Insert: Loading CSS file...');
            const link = document.createElement('link');
            link.id = 'image-insert-styles';
            link.rel = 'stylesheet';
            link.href = '/components/wb-image-insert/image-insert.css';
            document.head.appendChild(link);
        }
    }
    
    let currentElement = null;
    let selectedImages = []; // Changed from single image to array
    let modalElement = null;
    let isEditModeEnabled = false; // Track edit mode state internally
    let currentImageIndex = 0; // Track which image is being edited
    let dragState = {
        isDragging: false,
        currentX: 0,
        currentY: 0,
        initialX: 0,
        initialY: 0,
        xOffset: 0,
        yOffset: 0
    };
    
    // Create modal HTML
    function createModal() {
        console.log('🖼️ Image Insert: Creating modal...');
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div id="imageInsertOverlay" class="image-insert-overlay">
                <div class="image-insert-modal">
                    <div class="image-insert-header">
                        <h3 class="image-insert-title" id="imageInsertTitle">Edit Image</h3>
                        <button class="image-insert-close" id="imageInsertCloseBtn">&times;</button>
                    </div>

                    <div class="image-upload-section">
                        <h4>Manage Images</h4>
                        
                        <!-- Images Gallery -->
                        <div id="imagesGallery" class="images-gallery" style="margin-bottom: 15px; max-height: 200px; overflow-y: auto;">
                            <div id="noImagesMessage" class="no-images-message" style="text-align: center; color: #999; padding: 20px;">
                                No images added yet. Click "Add Images" to get started.
                            </div>
                        </div>
                        
                        <!-- Image Controls for Selected Image -->
                        <div id="imageControls" class="image-controls" style="display: none; margin-bottom: 15px;">
                            <h5>Selected Image Settings</h5>
                            <div class="image-resize-controls">
                                <div class="resize-inputs">
                                    <label for="imageWidth">Width (px):</label>
                                    <input type="number" id="imageWidth" min="50" max="1200" value="100">
                                    <label for="imageHeight">Height (px):</label>
                                    <input type="number" id="imageHeight" min="50" max="1200" value="100">
                                    <label for="imagePosition">Position:</label>
                                    <select id="imagePosition">
                                        <option value="inline">Inline</option>
                                        <option value="float-left">Float Left</option>
                                        <option value="float-right">Float Right</option>
                                        <option value="center">Center</option>
                                    </select>
                                </div>
                            </div>
                            <button class="btn btn-danger" id="imageRemoveBtn" style="margin-top: 10px;">Remove Selected Image</button>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="action-buttons" style="display: flex; gap: 10px; margin-bottom: 15px;">
                            <button class="btn btn-primary" id="imageUploadBtn">Add Images</button>
                            <input type="file" id="imageInput" class="hidden-input" accept="image/*" multiple style="display: none;">
                        </div>
                    </div>

                    <div class="edit-actions">
                        <button class="btn btn-primary" id="imageDoneBtn">Done</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modalElement = modal.querySelector('.image-insert-modal');
        
        console.log('🖼️ Image Insert: Modal created and added to DOM');
        console.log('🖼️ Image Insert: Modal element:', modalElement);
        
        // Add event listeners
        setupModalEventListeners();
    }
    
    // Setup modal event listeners
    function setupModalEventListeners() {
        console.log('🖼️ Image Insert: Setting up modal event listeners...');
        
        // Get all elements once for efficiency
        const elements = {
            closeBtn: document.getElementById('imageInsertCloseBtn'),
            doneBtn: document.getElementById('imageDoneBtn'),
            uploadBtn: document.getElementById('imageUploadBtn'),
            removeBtn: document.getElementById('imageRemoveBtn'),
            fileInput: document.getElementById('imageInput'),
            widthInput: document.getElementById('imageWidth'),
            heightInput: document.getElementById('imageHeight'),
            positionSelect: document.getElementById('imagePosition'),
            overlay: document.getElementById('imageInsertOverlay')
        };
        
        console.log('🖼️ Image Insert: Modal elements found:', {
            closeBtn: !!elements.closeBtn,
            doneBtn: !!elements.doneBtn,
            uploadBtn: !!elements.uploadBtn,
            removeBtn: !!elements.removeBtn,
            fileInput: !!elements.fileInput,
            widthInput: !!elements.widthInput,
            heightInput: !!elements.heightInput,
            positionSelect: !!elements.positionSelect,
            overlay: !!elements.overlay
        });
        
        // Button event listeners - all contained within component
        if (elements.closeBtn) {
            elements.closeBtn.addEventListener('click', function(e) {
                console.log('🖼️ Image Insert: Close button clicked');
                e.preventDefault();
                closeModal();
            });
        }
        
        if (elements.doneBtn) {
            elements.doneBtn.addEventListener('click', function(e) {
                console.log('🖼️ Image Insert: Done button clicked');
                e.preventDefault();
                closeModal();
            });
        }
        
        if (elements.uploadBtn) {
            elements.uploadBtn.addEventListener('click', function(e) {
                console.log('🖼️ Image Insert: Upload button clicked');
                e.preventDefault();
                if (elements.fileInput) {
                    elements.fileInput.click();
                }
            });
        }
        
        if (elements.removeBtn) {
            elements.removeBtn.addEventListener('click', function(e) {
                console.log('🖼️ Image Insert: Remove button clicked');
                e.preventDefault();
                removeSelectedImage();
            });
        }
        
        // File input handler
        if (elements.fileInput) {
            elements.fileInput.addEventListener('change', handleImageSelect);
        }
        
        // Width input handler
        document.getElementById('imageWidth').addEventListener('input', function() {
            const width = parseInt(this.value);
            document.getElementById('imageHeight').value = width;
            
            if (selectedImages.length > 0 && currentImageIndex >= 0) {
                selectedImages[currentImageIndex].customWidth = width;
                selectedImages[currentImageIndex].customHeight = width;
                updateImagesGallery();
                updateElementContent();
            }
        });
        
        // Height input handler
        document.getElementById('imageHeight').addEventListener('input', function() {
            const height = parseInt(this.value);
            
            if (selectedImages.length > 0 && currentImageIndex >= 0) {
                selectedImages[currentImageIndex].customHeight = height;
                updateImagesGallery();
                updateElementContent();
            }
        });
        
        // Position change handler
        document.getElementById('imagePosition').addEventListener('change', function() {
            if (selectedImages.length > 0 && currentImageIndex >= 0) {
                selectedImages[currentImageIndex].position = this.value;
                updateElementContent();
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.getElementById('imageInsertOverlay').classList.contains('active')) {
                closeModal();
            }
        });
        
        // Close on overlay click
        document.getElementById('imageInsertOverlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Setup draggable
        setupDraggable();
    }
    
    // Attach listeners to all semantic elements
    function attachListeners() {
        console.log('🖼️ Image Insert: Attaching listeners to semantic elements...');
        
        SEMANTIC_ELEMENTS.forEach(tagName => {
            const elements = document.querySelectorAll(tagName);
            console.log(`🖼️ Image Insert: Found ${elements.length} ${tagName} elements`);
            
            elements.forEach(element => {
                // Add double-click listener
                element.addEventListener('dblclick', handleDoubleClick);
                
                // Add visual hint on hover
                element.addEventListener('mouseenter', function() {
                    // Only show hover effects if edit mode is enabled
                    if (isEditModeEnabled) {
                        this.style.outline = '2px dashed #6200ee';
                        this.style.outlineOffset = '4px';
                        this.style.cursor = 'pointer';
                    }
                });
                
                element.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('editing')) {
                        this.style.outline = '';
                        this.style.cursor = '';
                    }
                });
            });
        });
    }
    
    // Handle double click
    function handleDoubleClick(e) {
        console.log('🖼️ Image Insert: Double-click detected on:', this.tagName, 'Edit mode enabled:', isEditModeEnabled);
        
        // Check if edit mode is enabled
        if (!isEditModeEnabled) {
            console.log('🖼️ Image Insert: Edit mode disabled, ignoring double-click');
            return; // Exit if edit mode is disabled
        }
        
        e.preventDefault();
        e.stopPropagation();
        console.log('🖼️ Image Insert: Opening edit mode for:', this.tagName);
        openEditMode(this);
    }
    
    // Open edit mode for element
    function openEditMode(element) {
        console.log('🖼️ Image Insert: Opening edit mode for element:', element);
        
        currentElement = element;
        const elementType = element.tagName.toUpperCase();
        
        console.log('🖼️ Image Insert: Element type:', elementType);
        
        // Add editing class
        element.classList.add('editing');
        element.style.outline = '2px solid #6200ee';
        
        // Load existing images
        selectedImages = [];
        const existingImages = element.querySelectorAll('.inserted-image');
        console.log('🖼️ Image Insert: Existing images found:', existingImages.length);
        
        existingImages.forEach((img, index) => {
            // Extract dimensions and position
            const style = img.getAttribute('style');
            let customWidth = 100;
            let customHeight = 100;
            
            if (style) {
                const widthMatch = style.match(/width:\s*(\d+)px/);
                const heightMatch = style.match(/height:\s*(\d+)px/);
                if (widthMatch) customWidth = parseInt(widthMatch[1]);
                if (heightMatch) customHeight = parseInt(heightMatch[1]);
            }
            
            // Determine position based on parent element
            let position = 'inline';
            const parent = img.parentElement;
            if (parent && parent.style) {
                if (parent.style.float === 'left') position = 'float-left';
                else if (parent.style.float === 'right') position = 'float-right';
                else if (parent.style.textAlign === 'center') position = 'center';
            }
            
            selectedImages.push({
                id: Date.now() + index,
                url: img.src,
                name: img.alt || `Existing image ${index + 1}`,
                size: 0,
                type: 'existing',
                customWidth: customWidth,
                customHeight: customHeight,
                position: position
            });
        });
        
        // Update UI
        updateImagesGallery();
        
        // Hide image controls initially
        document.getElementById('imageControls').style.display = 'none';
        currentImageIndex = -1;
        
        document.getElementById('imageInsertTitle').textContent = `Edit ${elementType} Images`;
        document.getElementById('imageInsertOverlay').classList.add('active');
        
        console.log('🖼️ Image Insert: Modal opened for', elementType, 'with', selectedImages.length, 'existing images');
    }
    
    // Close modal
    function closeModal() {
        console.log('🖼️ Image Insert: Closing modal...');
        
        if (currentElement) {
            console.log('🖼️ Image Insert: Cleaning up current element:', currentElement.tagName);
            currentElement.classList.remove('editing');
            currentElement.style.outline = '';
            currentElement.style.cursor = '';
            currentElement = null;
        }
        document.getElementById('imageInsertOverlay').classList.remove('active');
        
        // Reset image state
        selectedImages = [];
        currentImageIndex = -1;
        
        // Hide controls
        document.getElementById('imageControls').style.display = 'none';
        
        console.log('🖼️ Image Insert: Modal closed');
        
        // Reset drag state
        dragState = {
            isDragging: false,
            currentX: 0,
            currentY: 0,
            initialX: 0,
            initialY: 0,
            xOffset: 0,
            yOffset: 0
        };
        modalElement.style.transform = 'translate(-50%, -50%)';
    }
    
    // Update element content
    function updateElementContent() {
        if (!currentElement) return;
        
        // Get original text content (remove existing images)
        const existingImages = currentElement.querySelectorAll('.inserted-image');
        let textContent = currentElement.innerHTML;
        
        // Remove all existing inserted images
        existingImages.forEach(img => {
            textContent = textContent.replace(img.outerHTML, '');
        });
        
        // Clean up any wrapper divs that might be left
        textContent = textContent.replace(/<div[^>]*style[^>]*display:\s*flex[^>]*>([^<]*)<\/div>/gi, '$1');
        textContent = textContent.trim();
        
        let newContent = textContent;
        
        // Add all images
        if (selectedImages.length > 0) {
            const imageElements = selectedImages.map(image => {
                let imageStyle = '';
                if (image.customWidth && image.customHeight) {
                    imageStyle = ` style="width: ${image.customWidth}px; height: ${image.customHeight}px; margin: 4px;"`;
                }
                
                let imageHTML = `<img src="${image.url}" alt="${image.name}" class="inserted-image"${imageStyle}>`;
                
                // Apply positioning
                switch (image.position) {
                    case 'float-left':
                        imageHTML = `<div style="float: left; margin: 0 10px 10px 0;">${imageHTML}</div>`;
                        break;
                    case 'float-right':
                        imageHTML = `<div style="float: right; margin: 0 0 10px 10px;">${imageHTML}</div>`;
                        break;
                    case 'center':
                        imageHTML = `<div style="text-align: center; margin: 10px 0;">${imageHTML}</div>`;
                        break;
                    case 'inline':
                    default:
                        // Keep as inline
                        break;
                }
                
                return imageHTML;
            });
            
            // Add images to content
            newContent = textContent + '\n' + imageElements.join('\n');
        }
        
        currentElement.innerHTML = newContent;
    }
    
    // Handle image selection (now supports multiple files)
    function handleImageSelect(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;
        
        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not an image file and will be skipped.`);
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} is too large (>5MB) and will be skipped.`);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const newImage = {
                    id: Date.now() + Math.random(), // Unique ID
                    url: e.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    customWidth: 100,
                    customHeight: 100,
                    position: 'inline'
                };
                
                selectedImages.push(newImage);
                updateImagesGallery();
                updateElementContent();
            };
            reader.readAsDataURL(file);
        });
        
        // Clear the input
        event.target.value = '';
    }
    
    // Update images gallery
    function updateImagesGallery() {
        const gallery = document.getElementById('imagesGallery');
        const noImagesMessage = document.getElementById('noImagesMessage');
        
        if (selectedImages.length === 0) {
            noImagesMessage.style.display = 'block';
            return;
        }
        
        noImagesMessage.style.display = 'none';
        
        // Clear existing gallery items (keep the no-images message)
        const existingItems = gallery.querySelectorAll('.gallery-item');
        existingItems.forEach(item => item.remove());
        
        selectedImages.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px;
                margin: 4px 0;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s ease;
            `;
            
            item.innerHTML = `
                <img src="${image.url}" alt="${image.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                <div style="flex: 1; overflow: hidden;">
                    <div style="font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${image.name}</div>
                    <div style="font-size: 10px; color: #999;">${formatFileSize(image.size)} • ${image.customWidth}x${image.customHeight}px</div>
                </div>
                <button class="gallery-item-remove" data-index="${index}" style="background: #ff4444; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; cursor: pointer;">×</button>
            `;
            
            // Click to select image
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('gallery-item-remove')) {
                    selectImage(index);
                }
            });
            
            // Remove button
            const removeBtn = item.querySelector('.gallery-item-remove');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeImageAtIndex(index);
            });
            
            gallery.appendChild(item);
        });
    }
    
    // Select an image for editing
    function selectImage(index) {
        currentImageIndex = index;
        const image = selectedImages[index];
        
        // Update controls
        document.getElementById('imageWidth').value = image.customWidth;
        document.getElementById('imageHeight').value = image.customHeight;
        document.getElementById('imagePosition').value = image.position;
        
        // Show image controls
        document.getElementById('imageControls').style.display = 'block';
        
        // Highlight selected item
        document.querySelectorAll('.gallery-item').forEach((item, i) => {
            item.style.background = i === index ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)';
        });
    }
    
    // Remove image at specific index
    function removeImageAtIndex(index) {
        selectedImages.splice(index, 1);
        updateImagesGallery();
        updateElementContent();
        
        // Hide controls if no images left or current image was removed
        if (selectedImages.length === 0 || index === currentImageIndex) {
            document.getElementById('imageControls').style.display = 'none';
        }
        
        // Adjust current index if needed
        if (currentImageIndex >= selectedImages.length) {
            currentImageIndex = Math.max(0, selectedImages.length - 1);
        }
    }
    
    // Remove selected image (called by remove button)
    function removeSelectedImage() {
        if (currentImageIndex >= 0 && currentImageIndex < selectedImages.length) {
            removeImageAtIndex(currentImageIndex);
        }
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Setup draggable functionality
    function setupDraggable() {
        const dragHandle = document.querySelector('.image-insert-header');
        
        dragHandle.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);
        
        dragHandle.addEventListener('touchstart', dragStart);
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('touchmove', drag);
    }
    
    function dragStart(e) {
        if (e.type === 'touchstart') {
            dragState.initialX = e.touches[0].clientX - dragState.xOffset;
            dragState.initialY = e.touches[0].clientY - dragState.yOffset;
        } else {
            dragState.initialX = e.clientX - dragState.xOffset;
            dragState.initialY = e.clientY - dragState.yOffset;
        }
        
        if (e.target.closest('.image-insert-header')) {
            dragState.isDragging = true;
        }
    }
    
    function dragEnd(e) {
        dragState.initialX = dragState.currentX;
        dragState.initialY = dragState.currentY;
        dragState.isDragging = false;
    }
    
    function drag(e) {
        if (dragState.isDragging) {
            e.preventDefault();
            
            if (e.type === 'touchmove') {
                dragState.currentX = e.touches[0].clientX - dragState.initialX;
                dragState.currentY = e.touches[0].clientY - dragState.initialY;
            } else {
                dragState.currentX = e.clientX - dragState.initialX;
                dragState.currentY = e.clientY - dragState.initialY;
            }
            
            dragState.xOffset = dragState.currentX;
            dragState.yOffset = dragState.currentY;
            
            modalElement.style.transform = `translate(${dragState.currentX}px, ${dragState.currentY}px)`;
            modalElement.style.top = '50%';
            modalElement.style.left = '50%';
        }
    }
    
    // Add edit buttons to elements
    function addEditButtons() {
        console.log('🖼️ Image Insert: Adding edit buttons to semantic elements...');
        
        SEMANTIC_ELEMENTS.forEach(tagName => {
            const elements = document.querySelectorAll(tagName);
            elements.forEach(element => {
                // Skip if button already exists
                if (element.querySelector('.image-insert-edit-btn')) {
                    return;
                }
                
                // Create edit button
                const editBtn = document.createElement('button');
                editBtn.className = 'image-insert-edit-btn';
                editBtn.innerHTML = '🖼️';
                editBtn.title = 'Insert/Edit Image';
                editBtn.setAttribute('aria-label', 'Insert or edit image for this element');
                
                // Add button styles
                editBtn.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    z-index: 10;
                    background: var(--accent-primary, #6200ee);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    cursor: pointer;
                    font-size: 14px;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                `;
                
                // Button click handler
                editBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖼️ Image Insert: Edit button clicked for:', element.tagName);
                    
                    setEditMode(true);
                    openEditMode(element);
                });
                
                // Make element relative positioned for button placement
                const originalPosition = window.getComputedStyle(element).position;
                if (originalPosition === 'static') {
                    element.style.position = 'relative';
                }
                
                // Add button to element
                element.appendChild(editBtn);
                
                // Show/hide button on hover when edit mode is enabled
                element.addEventListener('mouseenter', function() {
                    if (isEditModeEnabled) {
                        editBtn.style.display = 'flex';
                    }
                });
                
                element.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('editing')) {
                        editBtn.style.display = 'none';
                    }
                });
            });
        });
        
        console.log('🖼️ Image Insert: Edit buttons added successfully');
    }

    // Initialize
    function init() {
        // Load CSS first
        loadCSS();
        
        // Create modal if not exists
        if (!document.getElementById('imageInsertOverlay')) {
            createModal();
        }
        
        // Attach listeners to all semantic elements
        attachListeners();
        
        // Add edit buttons to elements
        addEditButtons();
        
        // Setup event listeners for edit mode changes
        setupEditModeListeners();
        
        // Add global API
        window.ImageInsert = {
            close: closeModal,
            removeImage: removeSelectedImage,
            setEditMode: setEditMode,
            enable: () => setEditMode(true),
            disable: () => setEditMode(false),
            openEditor: (element) => {
                // Open edit mode for a specific element
                if (element && SEMANTIC_ELEMENTS.includes(element.tagName.toLowerCase())) {
                    setEditMode(true);
                    openEditMode(element);
                }
            },
            addEditButtons: addEditButtons
        };
        
        console.log('🖼️ Image Insert Component: Initialization complete! 🎉');
        console.log('🖼️ Image Insert: Ready for double-click editing in edit mode');
        console.log('🖼️ Image Insert: Supported elements:', SEMANTIC_ELEMENTS.join(', '));
    }
    
    // Setup edit mode event listeners
    function setupEditModeListeners() {
        // Listen for custom edit mode events
        document.addEventListener('editModeEnabled', handleEditModeEnabled);
        document.addEventListener('editModeDisabled', handleEditModeDisabled);
        
        // Also support generic editModeChanged event
        document.addEventListener('editModeChanged', handleEditModeChanged);
        
        // Listen for wb-edit-mode events (alternative naming)
        document.addEventListener('wb:editModeOn', handleEditModeEnabled);
        document.addEventListener('wb:editModeOff', handleEditModeDisabled);
    }
    
    // Handle edit mode enabled
    function handleEditModeEnabled(e) {
        console.log('🖼️ Image Insert: Edit mode enabled event received');
        setEditMode(true);
    }
    
    // Handle edit mode disabled
    function handleEditModeDisabled(e) {
        console.log('🖼️ Image Insert: Edit mode disabled event received');
        setEditMode(false);
    }
    
    // Handle generic edit mode change event
    function handleEditModeChanged(e) {
        if (e.detail && typeof e.detail.enabled !== 'undefined') {
            setEditMode(e.detail.enabled);
        }
    }
    
    // Set edit mode state
    function setEditMode(enabled) {
        console.log('🖼️ Image Insert: Setting edit mode to:', enabled);
        isEditModeEnabled = enabled;
        
        // Update all elements based on new state
        SEMANTIC_ELEMENTS.forEach(tagName => {
            const elements = document.querySelectorAll(tagName);
            elements.forEach(element => {
                const editBtn = element.querySelector('.image-insert-edit-btn');
                
                if (!isEditModeEnabled) {
                    // Remove any hover styles when edit mode is disabled
                    element.style.outline = '';
                    element.style.cursor = '';
                    
                    // Hide edit button
                    if (editBtn) {
                        editBtn.style.display = 'none';
                    }
                } else {
                    // Edit mode enabled - buttons will show on hover via existing listeners
                }
            });
        });
        
        // Close any open modal if edit mode is disabled
        if (!isEditModeEnabled && document.getElementById('imageInsertOverlay').classList.contains('active')) {
            closeModal();
        }
        
        // Dispatch edit mode change events
        const event = new CustomEvent('imageInsertEditModeChanged', {
            detail: { enabled: isEditModeEnabled }
        });
        document.dispatchEvent(event);
        
        console.log(`🖼️ Image Insert: Edit mode ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    // Use WBComponentUtils if available, otherwise fallback
    if (window.WBComponentUtils && window.WBComponentUtils.onReady) {
        window.WBComponentUtils.onReady(init);
    } else {
        // Fallback DOM ready check
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
})();