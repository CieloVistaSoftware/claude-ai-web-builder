
import { WBBaseComponent } from '../../wb-base/wb-base.js';

class WB1Rem extends WBBaseComponent {
  constructor() {
    super();
    const shadow = this.shadowRoot;
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

WB1Rem.register('wb-1rem');
