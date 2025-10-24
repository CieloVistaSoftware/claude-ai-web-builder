export {};
// @ts-nocheck
// Test script to verify control panel functionality
console.log("Running control panel test script");

// Wait for document to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log("Document loaded, testing control panel functionality");
    
    // Test if control panel element exists
    const controlPanel = document.getElementById('main-control-panel');
    if (!controlPanel) {
        console.error("Control panel element not found!");
        return;
    }
    console.log("Control panel element found:", controlPanel);
    
    // After a short delay, dispatch the content loaded event to test handler reinitialization
    setTimeout((): any => {
        console.log("Dispatching controlpanel:contentloaded event to test handlers");
        window.dispatchEvent(new Event('controlpanel:contentloaded'));
    }, 1000);
    
    // Test clicking the edit mode button
    setTimeout((): any => {
        const editModeToggle = document.getElementById('edit-mode-toggle');
        if (editModeToggle) {
            console.log("Testing edit mode toggle button");
            editModeToggle.click();
            
            setTimeout((): any => {
                // Check if edit mode is active
                const isEditMode = document.body.classList.contains('edit-mode');
                console.log("Edit mode active:", isEditMode);
                
                // Click again to turn it off
                editModeToggle.click();
            }, 1000);
        } else {
            console.error("Edit mode toggle button not found!");
        }
    }, 2000);
});
