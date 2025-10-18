# Edit Mode Implementation Guide

## Overview
Edit Mode is a state toggle in the control panel that shows/hides editing UI elements like the event log and error log.

## Changes Needed

### 1. Add Edit Mode Toggle to Control Panel HTML

In `wb-control-panel.js`, add this section after the mode toggle in the `render()` method:

```javascript
<div class="panel-body">
    <!-- NEW: Edit Mode Toggle -->
    <div class="control-group" style="border-bottom: 2px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
        <div class="section-title">✏️ Edit Mode</div>
        <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <span>Show Editing Tools</span>
            <input type="checkbox" id="edit-mode-toggle" style="width: auto; height: auto; cursor: pointer;">
        </label>
        <p class="info-text">Toggle event log, error log, and other dev tools</p>
    </div>
    
    <!-- Rest of existing controls -->
    <div class="control-group">
        <label>Theme Category</label>
        ...
```

### 2. Add Event Listener

In `attachEventListeners()` method, add:

```javascript
// Edit Mode Toggle
const editModeToggle = this.shadowRoot.getElementById('edit-mode-toggle');
if (editModeToggle) {
    editModeToggle.checked = this.state.editMode;
    editModeToggle.addEventListener('change', (e) => {
        this.state.editMode = e.target.checked;
        this.dispatch('edit-mode-changed', { editMode: this.state.editMode });
        this.saveState();
        console.log(`✏️ Edit Mode: ${this.state.editMode ? 'ON' : 'OFF'}`);
    });
}
```

### 3. Update Demo JS to Listen for Edit Mode Changes

In `wb-control-panel-demo.js`, add:

```javascript
// ===== EDIT MODE LISTENER =====
document.addEventListener('wb:edit-mode-changed', (e) => {
    const editMode = e.detail.editMode;
    console.log('✏️ Edit Mode changed:', editMode);
    
    const eventLogPanel = document.getElementById('event-log-panel');
    const logError = document.querySelector('wb-log-error');
    
    if (editMode) {
        // Show editing tools
        if (eventLogPanel) eventLogPanel.style.display = 'flex';
        if (logError) logError.style.display = 'block';
        console.log('✅ Editing tools shown');
    } else {
        // Hide editing tools
        if (eventLogPanel) eventLogPanel.style.display = 'none';
        if (logError) logError.style.display = 'none';
        console.log('✅ Editing tools hidden');
    }
});

// Apply saved edit mode state on load
setTimeout(() => {
    const controlPanel = document.getElementById('main-control-panel');
    if (controlPanel && controlPanel.state) {
        const event = new CustomEvent('wb:edit-mode-changed', {
            detail: { editMode: controlPanel.state.editMode }
        });
        document.dispatchEvent(event);
    }
}, 100);
```

### 4. Add wb-resize-both to Control Panel

In `wb-control-panel-demo.html`, wrap the control panel:

```html
<!-- Control Panel with resize handles -->
<wb-resize-both 
    target="#main-control-panel"
    min-width="280"
    max-width="600"
    min-height="400"
    max-height="900"
    storage-key="wb-control-panel-size">
    <wb-control-panel id="main-control-panel"></wb-control-panel>
</wb-resize-both>
```

## Benefits

1. ✅ Control panel always visible
2. ✅ Edit Mode toggle inside panel
3. ✅ Resizable with wb-resize-both
4. ✅ Clean separation: control panel = always visible, editing tools = toggle
5. ✅ State persists to localStorage

## User Flow

1. **Page loads**: Control panel visible, event log/error log hidden (unless Edit Mode was on)
2. **Toggle Edit Mode ON**: Event log and error log appear
3. **Toggle Edit Mode OFF**: Event log and error log hide
4. **Resize Panel**: Drag corners/edges to resize control panel
5. **Refresh Page**: Last state (edit mode + size) restored

## File Changes Summary

- `wb-control-panel.js`: Add editMode state, toggle UI, event listener
- `wb-control-panel-demo.js`: Listen for edit-mode-changed event
- `wb-control-panel-demo.html`: Add wb-resize-both wrapper
- `wb-control-panel-demo.css`: Keep event log hidden by default

