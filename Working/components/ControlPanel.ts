// @ts-nocheck
/**
 * @file ControlPanel.js
 * @description Reusable web component for the website builder control panel
 * @module components/ControlPanel
 */

/**
 * ControlPanel Web Component
 * A draggable, collapsible control panel for the website builder
 * @class ControlPanel
 * @extends HTMLElement
 */
class ControlPanel extends HTMLElement {
  /**
   * Constructor for the ControlPanel component
   * Creates a shadow DOM with open mode for encapsulation
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Lifecycle callback when the component is added to the DOM
   * Renders the component and initializes event handlers
   */
  connectedCallback() {
    this.render();
    this.initEvents();
  }

  /**
   * Renders the component's HTML and CSS into the shadow DOM
   * Creates the structure for the control panel with header and content area
   */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 320px;
          background: rgba(20, 20, 20, 0.95);
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          z-index: 1000;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        .control-panel-header {
          margin: 0;
          padding: 0.75rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.2);
          box-sizing: border-box;
        }
        .control-panel-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
        }
        .control-btn {
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.7);
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.2s ease;
          padding: 0;
        }
        .control-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .control-panel-body {
          padding: 1rem;
          max-height: calc(80vh - 80px);
          overflow-y: auto;
          box-sizing: border-box;
        }
        ::slotted(*) {
          width: 100%;
        }
        
        /* Control panel content styles */
        ::slotted(.control-group) {
          margin-bottom: 1.5rem;
          box-sizing: border-box;
          width: 100%;
        }
        
        ::slotted(.control-group label) {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #ffffff;
          font-size: 0.9rem;
        }
        
        ::slotted(.control-group select),
        ::slotted(.control-group input[type="range"]) {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          box-sizing: border-box;
        }
        
        ::slotted(.control-group input[type="range"]) {
          padding: 0;
          height: 6px;
          background: transparent;
          outline: none;
        }
        
        ::slotted(.control-button) {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 0.5rem;
        }
        
        ::slotted(.control-button:hover) {
          background: rgba(255, 255, 255, 0.2);
        }
        
        ::slotted(.control-button.primary) {
          background: #6366f1;
        }
        
        ::slotted(.control-button.primary:hover) {
          background: #5b5bd6;
        }
        
        ::slotted(.control-button.danger) {
          background: #dc2626;
        }
        
        ::slotted(.control-button.danger:hover) {
          background: #b91c1c;
        }
        
        ::slotted(.toggle-switch-wrapper) {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fff;
        }
        
        ::slotted(.toggle-switch) {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        
        ::slotted(.toggle-switch input) {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        ::slotted(.toggle-slider) {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 24px;
        }
        
        ::slotted(.toggle-slider:before) {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        
        ::slotted(input:checked + .toggle-slider) {
          background-color: #6366f1;
        }
        
        ::slotted(input:checked + .toggle-slider:before) {
          transform: translateX(26px);
        }
      </style>
      <div class="control-panel-header" id="drag-handle">
        <h3><slot name="title">Website Builder</slot></h3>
        <div class="control-panel-actions">
          <button id="minimize-btn" class="control-btn" title="Minimize Panel">⊟</button>
        </div>
      </div>
      <div class="control-panel-body">
        <slot></slot>
      </div>
    `;
  }

  /**
   * Initializes all event handlers for the control panel
   * Sets up drag functionality and minimize button behavior
   */
  initEvents() {
    // Drag functionality
    const dragHandle = this.shadowRoot.getElementById('drag-handle');
    let isDragging = false, startX, startY, startLeft, startTop;
    dragHandle.addEventListener('mousedown', (e): any => {
      if (e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = this.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      this.style.transition = 'none';
      document.body.style.cursor = 'grabbing';
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e): any => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newLeft = Math.max(0, Math.min(startLeft + deltaX, window.innerWidth - this.offsetWidth));
      const newTop = Math.max(0, Math.min(startTop + deltaY, window.innerHeight - this.offsetHeight));
      this.style.left = newLeft + 'px';
      this.style.top = newTop + 'px';
      this.style.right = 'auto';
    });
    document.addEventListener('mouseup', (): any => {
      if (isDragging) {
        isDragging = false;
        this.style.transition = '';
        document.body.style.cursor = '';
      }
    });
    // Minimize functionality
    const minimizeBtn = this.shadowRoot.getElementById('minimize-btn');
    const body = this.shadowRoot.querySelector('.control-panel-body');
    let isMinimized = false;
    minimizeBtn.addEventListener('click', (): any => {
      isMinimized = !isMinimized;
      body.style.display = isMinimized ? 'none' : 'block';
      minimizeBtn.textContent = isMinimized ? '⊞' : '⊟';
      minimizeBtn.title = isMinimized ? 'Maximize Panel' : 'Minimize Panel';
    });
  }
}
customElements.define('control-panel', ControlPanel);

export default ControlPanel;
