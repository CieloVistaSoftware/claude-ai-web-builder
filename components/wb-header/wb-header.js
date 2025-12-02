import { WBBaseComponent } from '../wb-base/wb-base.js';
import './wb-header.css';

class WBHeader extends WBBaseComponent {
  static get observedAttributes() {
    return ['layout', 'sticky', 'brand-text', 'brand-href', 'show-nav', 'height'];
  }

  constructor() {
    super();
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const layout = this.getAttribute('layout') || 'default';
    const sticky = this.hasAttribute('sticky');
    const brandText = this.getAttribute('brand-text') || '';
    const brandHref = this.getAttribute('brand-href') || '/';
    const showNav = this.getAttribute('show-nav') !== 'false';
    const height = this.getAttribute('height') || 'default';
    this.innerHTML = `
      <header class="wb-header wb-header--${layout} wb-header--${height}${sticky ? ' wb-header--sticky' : ''}">
        <a class="wb-header__brand" href="${brandHref}">${brandText}</a>
        ${showNav ? '<nav class="wb-header__nav"><slot name="navigation"></slot></nav>' : ''}
        <div class="wb-header__actions"><slot name="actions"></slot></div>
        <slot></slot>
      </header>
    `;
    this.dispatchEvent(new CustomEvent('wb-header-ready', { bubbles: true, composed: true }));
  }
}

customElements.define('wb-header', WBHeader);
export default WBHeader;
