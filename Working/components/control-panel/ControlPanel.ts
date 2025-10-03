/**
 * @file ControlPanel.ts
 * @description Reusable web component for the website builder control panel
 * @module components/control-panel/ControlPanel
 */

/**
 * ControlPanel Web Component
 * A draggable, collapsible control panel for the website builder
 * @class ControlPanel
 * @extends HTMLElement
 */
class ControlPanel extends HTMLElement {
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private startLeft: number = 0;
  private startTop: number = 0;
  private isMinimized: boolean = false;

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
  connectedCallback(): void {
    this.render();
    this.initEvents();
  }

  /**
   * Renders the component's HTML and CSS into the shadow DOM
   * Creates the structure for the control panel with header and content area
   */
  render(): void {
    if (!this.shadowRoot) return;
    
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
  initEvents(): void {
    if (!this.shadowRoot) return;
    
    // Drag functionality
    const dragHandle = this.shadowRoot.getElementById('drag-handle');
    if (!dragHandle) return;
    
    dragHandle.addEventListener('mousedown', this.handleDragStart.bind(this));
    document.addEventListener('mousemove', this.handleDragMove.bind(this));
    document.addEventListener('mouseup', this.handleDragEnd.bind(this));
    
    // Minimize functionality
    const minimizeBtn = this.shadowRoot.getElementById('minimize-btn');
    if (!minimizeBtn) return;
    
    minimizeBtn.addEventListener('click', this.handleMinimize.bind(this));
  }
  
  /**
   * Handles the start of a drag operation
   * @param {MouseEvent} e - The mouse event
   */
  private handleDragStart(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    
    const rect = this.getBoundingClientRect();
    this.startLeft = rect.left;
    this.startTop = rect.top;
    
    this.style.transition = 'none';
    document.body.style.cursor = 'grabbing';
    e.preventDefault();
  }
  
  /**
   * Handles the drag movement
   * @param {MouseEvent} e - The mouse event
   */
  private handleDragMove(e: MouseEvent): void {
    if (!this.isDragging) return;
    
    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;
    
    const newLeft = Math.max(0, Math.min(this.startLeft + deltaX, window.innerWidth - this.offsetWidth));
    const newTop = Math.max(0, Math.min(this.startTop + deltaY, window.innerHeight - this.offsetHeight));
    
    this.style.left = newLeft + 'px';
    this.style.top = newTop + 'px';
    this.style.right = 'auto';
  }
  
  /**
   * Handles the end of a drag operation
   */
  private handleDragEnd(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.style.transition = '';
      document.body.style.cursor = '';
      
      // Dispatch custom event
      const event = new CustomEvent('controlpanel:dragend', {
        bubbles: true,
        detail: { 
          controlPanel: this,
          position: { 
            left: this.style.left,
            top: this.style.top 
          }
        }
      });
      this.dispatchEvent(event);
    }
  }
  
  /**
   * Handles the minimize/maximize toggle
   */
  private handleMinimize(): void {
    if (!this.shadowRoot) return;
    
    const body = this.shadowRoot.querySelector('.control-panel-body') as HTMLElement;
    const minimizeBtn = this.shadowRoot.getElementById('minimize-btn');
    if (!body || !minimizeBtn) return;
    
    this.isMinimized = !this.isMinimized;
    body.style.display = this.isMinimized ? 'none' : 'block';
    minimizeBtn.textContent = this.isMinimized ? '⊞' : '⊟';
    minimizeBtn.title = this.isMinimized ? 'Maximize Panel' : 'Minimize Panel';
    
    // Dispatch custom event
    const event = new CustomEvent('controlpanel:minimize', {
      bubbles: true,
      detail: { 
        controlPanel: this,
        isMinimized: this.isMinimized 
      }
    });
    this.dispatchEvent(event);
  }
}

customElements.define('control-panel', ControlPanel);

export default ControlPanel;
