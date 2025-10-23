import { WBBaseComponent } from '../../wb-base/wb-base.js';

class TOC1RemPad extends WBBaseComponent {
  constructor() {
    super();
    const shadow = this.shadowRoot;
    const style = document.createElement('style');
    style.textContent = `
      .toc1rempad-header {
        padding-top: 1rem;
        padding-left: 1rem;
        padding-right: 1rem;
        font-weight: bold;
        font-size: 1.2rem;
        background: var(--surface-raised, #23232b);
        color: var(--text-primary, #fff);
      }
      .toc1rempad-content {
        padding-left: 1rem;
        padding-right: 1rem;
        padding-bottom: 1rem;
        padding-top: 0;
      }
      .toc1rempad-content, .toc1rempad-header {
        /* Ensure all text inside has 1rem padding */
        box-sizing: border-box;
      }
      .toc1rempad-content * {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      .toc1rempad-header * {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    `;
    const headerSlot = document.createElement('slot');
    headerSlot.name = 'header';
    headerSlot.className = 'toc1rempad-header';
    const contentSlot = document.createElement('slot');
    contentSlot.name = 'content';
    contentSlot.className = 'toc1rempad-content';
    shadow.appendChild(style);
    shadow.appendChild(headerSlot);
    shadow.appendChild(contentSlot);
  }
}

TOC1RemPad.register('toc1rempad');
