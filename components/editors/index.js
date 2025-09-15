// Universal Element Editor Test Suite JavaScript

// Edit Mode Toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    let isEditMode = false;
    const toggleButton = document.getElementById('editModeToggle');
    const statusElement = document.getElementById('editModeStatus');
    
    // Update UI based on edit mode state
    function updateEditModeUI() {
        if (isEditMode) {
            document.body.classList.add('edit-mode-on');
            toggleButton.classList.add('active');
            editModeToggle.textContent = '🔒 Disable Edit Mode';
            statusElement.innerHTML = 'Edit Mode: <span class="status-on">ON</span> - Click elements to edit them';
            console.log('🔧 Edit Mode ENABLED - Click elements to edit');
        } else {
            document.body.classList.remove('edit-mode-on');
            toggleButton.classList.remove('active');
            toggleButton.textContent = '🔧 Enable Edit Mode';
            statusElement.innerHTML = 'Edit Mode: <span class="status-off">OFF</span> - Elements will function normally (links navigate, buttons work, etc.)';
            console.log('🚫 Edit Mode DISABLED - Elements work normally');
        }
    }

    // Toggle edit mode
    toggleButton.addEventListener('click', function() {
        isEditMode = !isEditMode;
        updateEditModeUI();
    });

    // Override the universal editor's click handling
    document.addEventListener('click', function(e) {
        const editableElement = e.target.closest('[data-editable="true"]');
        
        if (editableElement) {
            if (!isEditMode) {
                // Edit mode is OFF - let elements behave normally
                console.log('🖱️ Normal click on:', editableElement.tagName, '- Element will function normally');
                // Don't prevent default - let links navigate, buttons submit, etc.
            } else {
                // Edit mode is ON - prevent default behavior and open editor
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Opening editor for:', editableElement.tagName, editableElement);
                
                // Trigger the universal editor
                if (typeof window.UniversalElementEditor !== 'undefined') {
                    const editor = new window.UniversalElementEditor();
                    editor.openEditor(editableElement);
                } else {
                    console.error('Universal editor not loaded');
                }
            }
        }
    }, true); // Use capture phase to intercept before other handlers

    // Initialize UI
    updateEditModeUI();
});

// Debug logging functionality
document.addEventListener('DOMContentLoaded', function() {
    const debugOutput = document.getElementById('debugOutput');
    
    // Function to update debug output
    function updateDebugOutput(message) {
        if (debugOutput) {
            const timestamp = new Date().toLocaleTimeString();
            debugOutput.innerHTML = `[${timestamp}] ${message}`;
        }
    }
    
    // Log when page loads
    updateDebugOutput('✅ Universal Element Editor Test Suite loaded');
    
    // Monitor for universal editor events
    document.addEventListener('click', function(e) {
        const editableElement = e.target.closest('[data-editable="true"]');
        if (editableElement && document.body.classList.contains('edit-mode-on')) {
            updateDebugOutput(`🎯 Editor opened for: ${editableElement.tagName.toLowerCase()}`);
        }
    });
});