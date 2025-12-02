/**
 * WB BUTTON - LIGHT DOM VERSION
 * 
 * Handles: variants, sizes, disabled, active state, status, toggle behavior
 */

class WBButton extends HTMLElement {
  // Shadow DOM is not used; only Light DOM

  connectedCallback() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'medium';
    const disabled = this.hasAttribute('disabled');
    const active = this.hasAttribute('active');
    const status = this.getAttribute('status');
    const text = this.textContent.trim() || 'Button';
      const group = this.hasAttribute('group');

    // Save original markup for clipboard/examples BEFORE clearing innerHTML
    let originalMarkup = '';
    if (this.hasAttribute('examples') || this.hasAttribute('clipboard')) {
      // Only capture markup of child wb-buttons (not the rendered button)
      originalMarkup = Array.from(this.childNodes)
        .filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'WB-BUTTON')
        .map(node => node.outerHTML.trim())
        .join('\n');
      if (!originalMarkup) {
        // fallback to all children
        originalMarkup = this.innerHTML.trim();
      }
      this.setAttribute('clipboard-original', originalMarkup);
    }

    // Build button element (Light DOM only)
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'wb-btn';
    button.classList.add(`wb-btn--${variant}`);
    button.classList.add(`wb-btn--${size}`);
    if (group) {
      button.classList.add('wb-btn--group');
    }
    if (disabled) {
      button.disabled = true;
      button.classList.add('wb-btn--disabled');
    }
    if (active) {
      button.classList.add('wb-btn--active');
    }
    if (status) {
      button.setAttribute('data-status', status);
    }
    // Add text
    const textSpan = document.createElement('span');
    textSpan.className = 'wb-btn__text';
    textSpan.textContent = text;
    button.appendChild(textSpan);

    // Add copy-to-clipboard support if 'copy' or 'clipboard' attribute is present
    if (this.hasAttribute('copy') || this.hasAttribute('clipboard')) {
      button.style.cursor = 'pointer';
      button.addEventListener('click', () => {
        let copyText;
        if (this.hasAttribute('clipboard')) {
          copyText = this.getAttribute('clipboard-original') || originalMarkup;
        } else {
          copyText = textSpan.textContent;
        }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(copyText);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = copyText;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        button.classList.add('copied');
        setTimeout(() => {
          button.classList.remove('copied');
        }, 1500);
      });
    }

    // Clear and append
    this.innerHTML = '';
    this.appendChild(button);

    // If 'examples' attribute is present, render code example block
    if (this.hasAttribute('examples')) {
      const codeContainer = document.createElement('div');
      codeContainer.className = 'code-container';
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = 'Copy';
      const textarea = document.createElement('textarea');
      textarea.className = 'wb-code-example';
      textarea.readOnly = true;
      textarea.value = originalMarkup.trim();
      copyBtn.onclick = function() {
        textarea.select();
        document.execCommand('copy');
        copyBtn.classList.add('copied');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.textContent = 'Copy';
        }, 2000);
      };
      codeContainer.appendChild(copyBtn);
      codeContainer.appendChild(textarea);
      this.appendChild(codeContainer);
    }

    // Store reference for toggle
    this.button = button;

    // Handle toggle variant
    if (variant === 'toggle') {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    // Dispatch ready event
    this.dispatchEvent(new CustomEvent('wbButtonReady', {
      bubbles: true,
      detail: { variant, size, disabled, active }
    }));
  }

  toggle() {
    if (this.button.classList.contains('wb-btn--active')) {
      this.button.classList.remove('wb-btn--active');
      this.removeAttribute('active');
    } else {
      this.button.classList.add('wb-btn--active');
      this.setAttribute('active', '');
    }

    this.dispatchEvent(new CustomEvent('wb-button:toggle', {
      bubbles: true,
      detail: { active: this.button.classList.contains('wb-btn--active') }
    }));
  }

  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'active', 'status', 'group', 'clipboard'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.button) return;

    if (name === 'variant') {
      // Remove old variant
      this.button.classList.forEach(cls => {
        if (cls.startsWith('wb-btn--') && !['wb-btn--active', 'wb-btn--disabled'].includes(cls)) {
          this.button.classList.remove(cls);
        }
      });
      if (newValue) {
        this.button.classList.add(`wb-btn--${newValue}`);
      }
    }

    if (name === 'size' && newValue) {
      // Remove old size
      this.button.classList.forEach(cls => {
        if (cls.match(/wb-btn--(small|medium|large)/)) {
          this.button.classList.remove(cls);
        }
      });
      this.button.classList.add(`wb-btn--${newValue}`);
    }

    if (name === 'disabled') {
      this.button.disabled = newValue !== null;
      if (newValue !== null) {
        this.button.classList.add('wb-btn--disabled');
      } else {
        this.button.classList.remove('wb-btn--disabled');
      }
    }

    if (name === 'active') {
      if (newValue !== null) {
        this.button.classList.add('wb-btn--active');
      } else {
        this.button.classList.remove('wb-btn--active');
      }
    }

    if (name === 'status') {
      if (newValue) {
        this.button.setAttribute('data-status', newValue);
      } else {
        this.button.removeAttribute('data-status');
      }
    }

      if (name === 'group') {
        if (newValue !== null) {
          this.button.classList.add('wb-btn--group');
        } else {
          this.button.classList.remove('wb-btn--group');
        }
      }
  }
}

if (!customElements.get('wb-button')) {
  customElements.define('wb-button', WBButton);
  console.log('✅ wb-button registered');
}

export { WBButton };
export default WBButton;
