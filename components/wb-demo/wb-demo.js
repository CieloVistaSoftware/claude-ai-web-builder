/**
 * WB DEMO - Light DOM Component
 * Loads HTML examples, injects directly (no slots, no markdown complexity)
 */

class WBDemo extends HTMLElement {
  constructor() {
    super();
    this.templateUrl = '/components/wb-demo/template.html';
  }

  async connectedCallback() {
    // Load external CSS
    this.loadCSS('/components/wb-demo/wb-demo.css');

    // Render template
    await this.render();

    // Load and inject examples
    await this.loadExamples();

    // Dispatch ready event
    this.dispatchEvent(new CustomEvent('wbDemoReady', {
      bubbles: true,
      detail: { component: this }
    }));
  }

  async render() {
    try {
      const response = await fetch(this.templateUrl);
      if (!response.ok) throw new Error(`Template not found: ${this.templateUrl}`);
      let html = await response.text();

      // Simple template rendering
      const data = {
        title: this.getAttribute('title') || 'Component Demo'
      };

      // Replace {{title}}
      html = html.replace(/\{\{title\}\}/g, data.title);

      // Insert into Light DOM
      this.innerHTML = html;
    } catch (error) {
      console.error('WB Demo render error:', error);
      this.innerHTML = `<div class="demo-container"><p>Error loading demo template</p></div>`;
    }
  }

  async loadExamples() {
    const examplesPanel = this.querySelector('#examples-panel');
    if (!examplesPanel) return;

    let examplesUrl = this.getAttribute('examples-url');

    // If no examples-url, auto-detect wb-demo-examples.html
    if (!examplesUrl) {
      const pathParts = window.location.pathname.split('/');
      const folderIndex = pathParts.findIndex(part => part.startsWith('wb-'));
      let folderName = 'wb-demo';
      if (folderIndex !== -1) {
        folderName = pathParts[folderIndex];
      }
      examplesUrl = `/components/${folderName}/wb-demo-examples.html`;
    }

    try {
      const response = await fetch(examplesUrl);
      if (!response.ok) throw new Error('Failed to load examples');
      const html = await response.text();

      // DIRECTLY INJECT EXAMPLES INTO PANEL (no slots)
      examplesPanel.innerHTML = html;
    } catch (error) {
      examplesPanel.innerHTML = `<p style="color: #ef4444;">Error loading examples: ${error.message}</p>`;
    }
  }

  loadCSS(path) {
    if (!document.querySelector(`link[href="${path}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path;
      document.head.appendChild(link);
    }
  }

  static get observedAttributes() {
    return ['title', 'examples-url'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'title') {
      const titleEl = this.querySelector('.demo-title');
      if (titleEl) titleEl.textContent = newValue;
    }

    if (name === 'examples-url') {
      this.loadExamples();
    }
  }
}

customElements.define('wb-demo', WBDemo);
console.log('✅ WB Demo: Light DOM (examples only)');

export { WBDemo };
export default WBDemo;
