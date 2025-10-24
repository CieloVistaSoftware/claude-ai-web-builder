// @ts-nocheck
// EditModeManager.js - Content editing functionality
// =============================================================================
// EDIT MODE MODULE - Content editing functionality
// =============================================================================
import MediaManager from './MediaManager';

const EditModeManager = {
  // Toggle edit mode
  toggleEditMode(enabled) {
    console.log(`🎭 EditModeManager.toggleEditMode called with: ${enabled}`);
    document.body.classList.toggle('edit-mode', enabled);

    // Update contenteditable on all editable elements
    const editables = document.querySelectorAll('.editable');
    console.log(`🎭 Found ${editables.length} editable elements`);
    editables.forEach(el => {
      el.contentEditable = enabled;
    });

    // Update insert media buttons
    console.log(`🎭 Calling MediaManager.updateInsertMediaButtons(${enabled})`);
    MediaManager.updateInsertMediaButtons(enabled);

    console.log(`🎭 Edit mode: ${enabled ? 'ON' : 'OFF'}`);
  },

  // Setup editable elements
  setupEditableElements(editMode = false) {
    const editables = document.querySelectorAll('.editable');
    editables.forEach(el => {
      el.contentEditable = editMode;
    });
  }
};

export default EditModeManager;
