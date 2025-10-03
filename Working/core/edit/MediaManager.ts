// @ts-nocheck
// MediaManager.js - File insertion functionality
// =============================================================================
// MEDIA MANAGEMENT MODULE - File insertion functionality
// =============================================================================
const MediaManager = {
  // Current media input element
  mediaInput: null,

  // Open file picker and insert media
  openMediaPicker(target, position = 'below') {
    if (this.mediaInput) this.mediaInput.remove();

    this.mediaInput = document.createElement('input');
    this.mediaInput.type = 'file';
    this.mediaInput.accept = 'image/*,video/*,audio/*';
    this.mediaInput.style.display = 'none';
    document.body.appendChild(this.mediaInput);

    this.mediaInput.onchange = (e) => {
      const file = this.mediaInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const element = this.createMediaElement(file, ev.target.result);
        this.insertElement(element, target, position);
        this.mediaInput.remove();
        this.showAllInsertMediaButtons();
      };
      reader.readAsDataURL(file);
    };

    this.mediaInput.click();
  },

  // Create media element based on file type
  createMediaElement(file, src) {
    let element;

    if (file.type.startsWith('image/')) {
      element = document.createElement('img');
      element.src = src;
      element.alt = file.name;
      element.style.maxWidth = '100%';
    } else if (file.type.startsWith('video/')) {
      element = document.createElement('video');
      element.src = src;
      element.controls = true;
      element.style.maxWidth = '100%';
    } else if (file.type.startsWith('audio/')) {
      element = document.createElement('audio');
      element.src = src;
      element.controls = true;
    } else {
      element = document.createElement('a');
      element.href = src;
      element.textContent = file.name;
      element.target = '_blank';
    }

    return element;
  },

  // Insert element relative to target
  insertElement(element, target, position) {
    if (position === 'above') {
      target.parentNode.insertBefore(element, target);
    } else {
      if (target.nextSibling) {
        target.parentNode.insertBefore(element, target.nextSibling);
      } else {
        target.parentNode.appendChild(element);
      }
    }
  },

  // Show all insert media buttons
  showAllInsertMediaButtons() {
    // Always remove existing contextual buttons first
    this.removeContextualButtons();

    const editables = document.querySelectorAll('.editable');
    console.log(`Adding contextual buttons for ${editables.length} editable elements`);

    editables.forEach((target, index): any => {
      // Double-check that no button already exists before this element
      if (target.previousSibling?.classList?.contains('contextual-insert-media-btn')) {
        console.log(`Skipping element ${index}, button already exists`);
        return;
      }

      const btn = document.createElement('button');
      btn.textContent = '➕ Insert Media';
      btn.className = 'contextual-insert-media-btn insert-media-above-btn';
      btn.onclick = (e) => {
        e.stopPropagation();
        this.openMediaPicker(target, 'above');
      };
      target.parentNode.insertBefore(btn, target);
    });

    const finalCount = document.querySelectorAll('.contextual-insert-media-btn').length;
    console.log(`✅ Added ${finalCount} contextual insert media buttons`);
  },

  // Remove contextual buttons
  removeContextualButtons() {
    const existingButtons = document.querySelectorAll('.contextual-insert-media-btn');
    console.log(`Removing ${existingButtons.length} existing contextual buttons`);
    existingButtons.forEach(btn => btn.remove());
  },

  // Update insert media buttons based on edit mode
  updateInsertMediaButtons(editMode) {
    console.log(`📷 MediaManager.updateInsertMediaButtons called with: ${editMode}`);
    if (editMode) {
      console.log(`📷 Edit mode is ON, calling showAllInsertMediaButtons()`);
      this.showAllInsertMediaButtons();
    } else {
      console.log(`📷 Edit mode is OFF, calling removeContextualButtons()`);
      this.removeContextualButtons();
    }
  }
};

export default MediaManager;
