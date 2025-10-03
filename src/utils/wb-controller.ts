// @ts-nocheck
// Website Builder Controller as a Web Component
// This separates the controller from the website content

class WbController extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    this.attachShadow({ mode: 'open' });

    // Initialize properties
    this.isEditMode = false;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.isMinimized = false;
    this.colorMode = 'light'; // Default color mode

    // Render the component
    this.render();

    // Set up event listeners
    this.setupEventListeners();
  }

  // Render the controller UI
  render() {    // Load styles from the main wb.css
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '/wb-core/wb.css'); // Use absolute path for more reliability

    // Create controller styles specific to web component
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        position: fixed;
        z-index: 10000;
      }
      
      .control-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.7);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        width: 320px;
        min-width: 200px;
        transition: opacity 0.3s ease, transform 0.3s ease;
        padding: 15px;
        font-family: system-ui, sans-serif;
        overflow: hidden;
      }
      
      .control-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        cursor: move;
      }
      
      .control-title {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }
      
      .control-actions {
        display: flex;
        gap: 8px;
      }
      
      .btn {
        background: rgba(0, 123, 255, 0.9);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .btn:hover {
        background: rgba(0, 105, 217, 0.9);
      }
      
      .btn-square {
        width: 24px;
        height: 24px;
        padding: 2px;
        font-size: 12px;
        border-radius: 4px;
      }
      
      .minimized {
        transform: translateX(calc(100% - 40px));
      }
      
      /* Color bar styles */
      .color-bar {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }
      
      .color-bar-title {
        font-size: 14px;
        font-weight: 500;
        margin: 0;
      }
      
      .color-bar-presets {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }
      
      .color-preset {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .color-preset:hover {
        transform: scale(1.1);
      }
      
      .color-preset.active {
        border-color: white;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
      }
      
      .color-preset-light { background-color: #f8f9fa; }
      .color-preset-dark { background-color: #212529; }      .color-preset-cyberpunk { background-color: #ff00ff; }
      .color-preset-ocean { background-color: #0077be; }
      .color-preset-sunset { background-color: #ff7e5f; }
      .color-preset-forest { background-color: #2e8b57; }
      
      /* Theme Toggle Switch */
      .theme-toggle {
        display: flex;
        align-items: center;
        margin-top: 10px;
      }
      
      .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
        margin-right: 10px;
      }
      
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: var(--primary, #6366f1);
      }
      
      input:checked + .slider:before {
        transform: translateX(26px);
      }
      
      .slider.round {
        border-radius: 24px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }
      
      .toggle-label {
        font-size: 14px;
      }
    `;

    // Create the controller HTML structure
    const panel = document.createElement('div');
    panel.className = 'control-panel';
    panel.innerHTML = `
      <div class="control-header">
        <h3 class="control-title">Website Builder</h3>
        <div class="control-actions">
          <button class="btn-square btn-minimize" title="Minimize">−</button>
          <button class="btn-square btn-close" title="Close">×</button>
        </div>
      </div>
      
      <div class="control-buttons">
        <button class="btn btn-edit">Edit Mode</button>
        <button class="btn btn-save">Save Changes</button>
        <button class="btn btn-export">Export</button>
      </div>
        <div class="color-bar">
        <h4 class="color-bar-title">Color Theme</h4>
        <div class="color-bar-presets">
          <div class="color-preset color-preset-light" data-theme="light" title="Light"></div>
          <div class="color-preset color-preset-dark" data-theme="dark" title="Dark"></div>
          <div class="color-preset color-preset-cyberpunk" data-theme="cyberpunk" title="Cyberpunk"></div>
          <div class="color-preset color-preset-ocean" data-theme="ocean" title="Ocean"></div>
          <div class="color-preset color-preset-sunset" data-theme="sunset" title="Sunset"></div>
          <div class="color-preset color-preset-forest" data-theme="forest" title="Forest"></div>
        </div>
        <div class="theme-toggle">
          <label class="switch">
            <input type="checkbox" id="theme-toggle-switch">
            <span class="slider round"></span>
          </label>
          <span class="toggle-label">Dark Mode</span>
        </div>
      </div>
    `;

    // Attach to shadow DOM
    this.shadowRoot.appendChild(linkElem);
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(panel);    // Save references to key elements
    this.panel = this.shadowRoot.querySelector('.control-panel');
    this.minimizeBtn = this.shadowRoot.querySelector('.btn-minimize');
    this.closeBtn = this.shadowRoot.querySelector('.btn-close');
    this.editBtn = this.shadowRoot.querySelector('.btn-edit');
    this.saveBtn = this.shadowRoot.querySelector('.btn-save');
    this.exportBtn = this.shadowRoot.querySelector('.btn-export');
    this.colorPresets = this.shadowRoot.querySelectorAll('.color-preset');
    this.themeToggle = this.shadowRoot.querySelector('#theme-toggle-switch');

    // Mark active color preset
    this.updateActiveColorPreset();
  }

  // Set up event listeners for controller functionality
  setupEventListeners() {
    const header = this.shadowRoot.querySelector('.control-header');

    // Minimize/Maximize button
    this.minimizeBtn.addEventListener('click', (): any => {
      this.isMinimized = !this.isMinimized;
      this.panel.classList.toggle('minimized', this.isMinimized);
      this.minimizeBtn.textContent = this.isMinimized ? '+' : '−';
    });

    // Close button
    this.closeBtn.addEventListener('click', (): any => {
      if (confirm('Remove Website Builder controls?')) {
        this.remove();
      }
    });

    // Edit mode toggle
    this.editBtn.addEventListener('click', (): any => {
      this.isEditMode = !this.isEditMode;
      this.editBtn.textContent = this.isEditMode ? 'Exit Edit Mode' : 'Edit Mode';
      this.setEditMode(this.isEditMode);
    });

    // Save button
    this.saveBtn.addEventListener('click', (): any => {
      this.saveChanges();
    });

    // Export button
    this.exportBtn.addEventListener('click', (): any => {
      this.exportSite();
    });    // Color preset selection
    this.colorPresets.forEach(preset => {
      preset.addEventListener('click', (): any => {
        const theme = preset.getAttribute('data-theme');
        this.setColorMode(theme);
      });
    });
    
    // Theme toggle switch
    this.themeToggle.addEventListener('change', (): any => {
      const theme = this.themeToggle.checked ? 'dark' : 'light';
      this.setColorMode(theme);
    });

    // Dragging functionality
    header.addEventListener('mousedown', (e): any => {
      this.startDragging(e);
    });

    document.addEventListener('mousemove', (e): any => {
      if (this.isDragging) {
        this.drag(e);
      }
    });

    document.addEventListener('mouseup', (): any => {
      if (this.isDragging) {
        this.stopDragging();
      }
    });
  }

  // Start dragging the controller
  startDragging(e) {
    this.isDragging = true;
    const rect = this.panel.getBoundingClientRect();
    this.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // Update position during dragging
  drag(e) {
    if (this.isDragging) {
      const x = e.clientX - this.dragOffset.x;
      const y = e.clientY - this.dragOffset.y;

      this.panel.style.right = 'auto';
      this.panel.style.left = `${x}px`;
      this.panel.style.top = `${y}px`;
    }
  }

  // Stop dragging
  stopDragging() {
    this.isDragging = false;
  }

  // Toggle edit mode
  setEditMode(enabled) {
    document.body.classList.toggle('edit-mode', enabled);
    const editables = document.querySelectorAll('.editable');

    editables.forEach(el => {
      el.contentEditable = enabled.toString();
      el.classList.toggle('editing', enabled);
    });

    console.log(`Edit mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Save changes
  saveChanges() {
    // In a real implementation, this would save changes back to the server
    console.log('Saving changes...');
    alert('Changes saved!');
  }

  // Export the site
  exportSite() {
    console.log('Exporting site...');

    // Create export data
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = document.title ? `${document.title}.html` : 'exported-site.html';

    // Trigger download
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout((): any => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);

    alert('Site exported!');
  }

  // Set color mode/theme
  setColorMode(mode) {
    console.log(`Setting color mode to: ${mode}`);

    // Validate theme mode
    if (!mode || !['light', 'dark', 'cyberpunk', 'ocean', 'sunset', 'forest'].includes(mode)) {
      console.error(`Invalid theme mode: ${mode}, defaulting to light`);
      mode = 'light';
    }

    this.colorMode = mode;

    // Set theme on document
    document.body.setAttribute('data-theme', mode);

    // Update active preset indicator
    this.updateActiveColorPreset();

    // Dispatch event for other components
    const event = new CustomEvent('wb-theme-changed', {
      detail: { theme: mode },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
  // Update which color preset is marked as active
  updateActiveColorPreset() {
    this.colorPresets.forEach(preset => {
      const isActive = preset.getAttribute('data-theme') === this.colorMode;
      preset.classList.toggle('active', isActive);
    });
    
    // Update the toggle switch state for light/dark
    if (this.themeToggle) {
      if (this.colorMode === 'dark') {
        this.themeToggle.checked = true;
      } else if (this.colorMode === 'light') {
        this.themeToggle.checked = false;
      }
      // For other themes, leave the toggle in its current state
    }
  }
}

// Define the custom element
customElements.define('wb-controller', WbController);

// On DOMContentLoaded, add the controller to the page if needed
document.addEventListener('DOMContentLoaded', (): any => {
  // Only add the controller if this is a converted page
  if (document.documentElement.getAttribute('data-wb-compatible') === 'true') {
    // Look for an injection point or use body as fallback
    const injectionPoint = document.querySelector('wb-controller-injection-point') ||
      document.querySelector('body');

    // Only inject if not already present
    if (!document.querySelector('wb-controller')) {
      const controller = document.createElement('wb-controller');

      if (injectionPoint) {
        if (injectionPoint.tagName === 'BODY') {
          injectionPoint.appendChild(controller);
        } else {
          injectionPoint.parentNode.insertBefore(controller, injectionPoint);
          // Remove the injection point marker element if it exists
          if (injectionPoint.tagName === 'WB-CONTROLLER-INJECTION-POINT') {
            injectionPoint.parentNode.removeChild(injectionPoint);
          }
        }
        console.log('Website Builder controller injected');
      }
    }
  } else {
    console.log('Page is not marked as wb-compatible. Controller not injected.');
  }
});
