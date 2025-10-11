class WBLogViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._log = [];
    this._max = 200;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: monospace; background: #18181b; color: #fbbf24; border-radius: 6px; padding: 0.5em 0.7em; }
        pre { margin: 0; background: #111; color: #fbbf24; border-radius: 4px; font-size: 0.95em; max-height: 10em; overflow: auto; }
      </style>
      <pre id="log"></pre>
    `;
    this.$log = this.shadowRoot.getElementById('log');
  }

  add(entry) {
    this._log.unshift(entry);
    if (this._log.length > this._max) this._log.length = this._max;
    this.render();
  }

  clear() {
    this._log = [];
    this.render();
  }

  render() {
    this.$log.textContent = this._log.join('\n');
  }
}

customElements.define('wb-log-viewer', WBLogViewer);
