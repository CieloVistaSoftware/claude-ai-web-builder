import WBBaseComponent from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBModal extends WBBaseComponent {
  constructor() {
    super();
    this._isOpen = false;
    this._keydownHandler = null;
    this._backdropClickHandler = null;
  }

  static get observedAttributes() {
    return ['title', 'size', 'variant', 'duration', 'bg-color', 'color', 'open'];
  }

  async connectedCallback() {
    super.connectedCallback();
    await loadComponentCSS(this, 'wb-modal.css');
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('aria-hidden', 'true');
    this.className = 'wb-modal';
    this.render();
  }

  disconnectedCallback() {
    this.cleanupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'title':
        this.updateTitle(newValue);
        break;
      case 'size':
        this.updateSize(newValue);
        break;
      case 'variant':
        this.updateVariant(newValue);
        break;
    }
  }

  render() {
    const dialog = document.createElement('div');
    dialog.className = 'wb-modal-dialog';

    const title = this.getAttribute('title');
    if (title) {
      const header = document.createElement('div');
      header.className = 'wb-modal-header';

      const titleElement = document.createElement('h2');
      titleElement.className = 'wb-modal-title';
      titleElement.textContent = title;

      const closeBtn = document.createElement('button');
      closeBtn.className = 'wb-modal-close';
      closeBtn.innerHTML = '×';
      closeBtn.setAttribute('aria-label', 'Close modal');
      closeBtn.addEventListener('click', () => this.hide());

      header.appendChild(titleElement);
      header.appendChild(closeBtn);
      dialog.appendChild(header);
    }

    const body = document.createElement('div');
    body.className = 'wb-modal-body';
    const slot = document.createElement('slot');
    body.appendChild(slot);
    dialog.appendChild(body);

    const footerSlot = document.createElement('slot');
    footerSlot.name = 'footer';
    dialog.appendChild(footerSlot);

    this.appendChild(dialog);
    this.updateSize(this.getAttribute('size'));
    this.updateVariant(this.getAttribute('variant'));
  }

  updateTitle(title) {
    const titleElement = this.querySelector('.wb-modal-title');
    if (titleElement) titleElement.textContent = title || '';
  }

  updateSize(size) {
    this.classList.remove('wb-modal--small', 'wb-modal--large');
    if (size === 'small') this.classList.add('wb-modal--small');
    if (size === 'large') this.classList.add('wb-modal--large');
  }

  updateVariant(variant) {
    this.classList.remove('wb-modal--success', 'wb-modal--warning', 'wb-modal--danger');
    if (variant === 'success') this.classList.add('wb-modal--success');
    if (variant === 'warning') this.classList.add('wb-modal--warning');
    if (variant === 'danger') this.classList.add('wb-modal--danger');
  }

  cleanupEventListeners() {
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
      this._keydownHandler = null;
    }
    if (this._backdropClickHandler) {
      const backdrop = document.querySelector('.wb-modal-backdrop');
      if (backdrop) {
        backdrop.removeEventListener('click', this._backdropClickHandler);
      }
      this._backdropClickHandler = null;
    }
  }

  show(triggerElement = null) {
    if (this._isOpen) return;
    this._isOpen = true;

    const modalWidth = Math.min(window.innerWidth * 0.5, 500);
    const modalHeight = 400;
    this.style.setProperty('--wb-modal-width', modalWidth + 'px');
    this.style.setProperty('--wb-modal-height', modalHeight + 'px');

    if (triggerElement) {
      const container = triggerElement.closest('.demo-section') || 
                       triggerElement.closest('.hero-demo') || 
                       triggerElement.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const startTop = containerRect.top + scrollTop;
        this.style.setProperty('--wb-modal-start-top', startTop + 'px');
      }
    }

    let backdrop = document.querySelector('.wb-modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'wb-modal-backdrop';
      document.body.appendChild(backdrop);
    }

    document.body.appendChild(this);

    this._keydownHandler = (e) => {
      if (e.key === 'Escape') this.hide();
    };
    this._backdropClickHandler = (e) => {
      if (e.target === backdrop) this.hide();
    };

    document.addEventListener('keydown', this._keydownHandler);
    backdrop.addEventListener('click', this._backdropClickHandler);

    this.offsetHeight;

    setTimeout(() => {
      backdrop.classList.add('wb-modal--open');
      this.classList.add('wb-modal--open');
      this.setAttribute('aria-hidden', 'false');
    }, 50);
  }

  hide() {
    if (!this._isOpen) return;
    this._isOpen = false;

    this.classList.remove('wb-modal--open');
    this.setAttribute('aria-hidden', 'true');

    const backdrop = document.querySelector('.wb-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('wb-modal--open');
    }

    this.cleanupEventListeners();

    setTimeout(() => {
      this.remove();
      if (backdrop) backdrop.remove();
    }, 500);
  }

  static register(tagName = 'wb-modal') {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, WBModal);
    }
  }
}

export default WBModal;

// Auto-register
WBModal.register('wb-modal');
