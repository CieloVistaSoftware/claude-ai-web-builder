import { WBBaseComponent } from '../../wb-base/wb-base.js';

class TOC1Rem extends WBBaseComponent {
  constructor() {
    super();
    const shadow = this.shadowRoot;
    const style = document.createElement('style');
    style.textContent = `
      .toc-1rem-header {
        padding-top: 1rem;
        padding-left: 1rem;
        padding-right: 1rem;
        font-weight: bold;
        font-size: 1.2rem;
        background: var(--surface-raised, #23232b);
        color: var(--text-primary, #fff);
      }
      .toc-1rem-content {
        padding-left: 1rem;
        padding-right: 1rem;
        padding-bottom: 1rem;
        padding-top: 0;
      }
    `;
    const headerSlot = document.createElement('slot');
    headerSlot.name = 'header';
    headerSlot.className = 'toc-1rem-header';
    const contentSlot = document.createElement('slot');
    contentSlot.name = 'content';
    contentSlot.className = 'toc-1rem-content';
    shadow.appendChild(style);
    shadow.appendChild(headerSlot);
    shadow.appendChild(contentSlot);
  }
}

TOC1Rem.register('toc-1rem');
