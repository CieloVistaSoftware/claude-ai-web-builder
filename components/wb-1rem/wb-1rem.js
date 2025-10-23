import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WB1Rem extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    await loadComponentCSS(this, 'wb-1rem.css');
    this.render();
  }

  render() {
    const shadow = this.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    container.className = 'wb-1rem-container';
    const slot = document.createElement('slot');
    container.appendChild(slot);
    const style = document.createElement('style');
    style.textContent = `
      .wb-1rem-container {
        display: block;
        box-sizing: border-box;
        padding-top: 1rem;
        padding-right: 1rem;
        padding-left: 1rem;
        padding-bottom: 0;
        width: 100%;
        height: 100%;
      }
    `;
    shadow.appendChild(style);
    shadow.appendChild(container);
  }
}

customElements.define('wb-1rem', WB1Rem);
