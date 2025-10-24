/**
 * @file ControlPanel.ts
 * @description Reusable web component for the website builder control panel
 * @module components/control-panel/ControlPanel
 */

/**
 * ControlPanel Web Component

// Minimal reactive store for state
type Listener<T> = (value: T) => void;
function createSignal<T>(initial: T): [() => T, (v: T) => void, (fn: Listener<T>) => void] {
  let value = initial;
  const listeners: Listener<T>[] = [];
  const get = () => value;
  const set = (v: T) => {
    value = v;
    listeners.forEach(fn => fn(value));
  };
  const subscribe = (fn: Listener<T>) => { listeners.push(fn); };
  return [get, set, subscribe];
}

class ControlPanel extends HTMLElement {
  private minimized = false;
  private [getMinimized, setMinimized, onMinimized] = createSignal(false);

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Subscribe to state changes and re-render
    onMinimized(() => this.render());
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    const isMin = this.getMinimized();
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
          display: ${isMin ? 'none' : 'block'};
        }
        ::slotted(*) {
          width: 100%;
        }
      </style>
      <div class="control-panel-header">
        <h3><slot name="title">Website Builder</slot></h3>
        <div class="control-panel-actions">
          <button class="control-btn" title="${isMin ? 'Maximize Panel' : 'Minimize Panel'}" onclick="this.getRootNode().host.toggleMinimized()">${isMin ? '&#8854;' : '&#8855;'}</button>
        </div>
      </div>
      <div class="control-panel-body">
        <slot></slot>
      </div>
    `;
  }

  getMinimized() {
    return this.getMinimizedSignal();
  }

  toggleMinimized() {
    this.setMinimizedSignal(!this.getMinimizedSignal());
    // Dispatch custom event for minimize
    this.dispatchEvent(new CustomEvent('controlpanel:minimize', {
      bubbles: true,
      detail: { controlPanel: this, isMinimized: this.getMinimizedSignal() }
    }));
  }

  // Signal accessors for template
  private getMinimizedSignal = this.getMinimized;
  private setMinimizedSignal = this.setMinimized;
}

customElements.define('control-panel', ControlPanel);

export default ControlPanel;

customElements.define('control-panel', ControlPanel);

export default ControlPanel;
