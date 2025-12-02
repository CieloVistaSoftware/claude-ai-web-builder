/**
 * DECORATOR-TEMPLATE.js
 * 
 * Template for decorator components in WB Framework v2.0
 * 
 * Decorators WRAP other components and add behavior WITHOUT modifying them.
 * 
 * COPY THIS and replace:
 * 1. "DECORATOR_NAME" with your name (wb-examples-decorator)
 * 2. "DecoratorName" with your class name (WBExamplesDecorator)
 * 3. Implement your logic
 * 4. Update claude.md when done
 * 
 * KEY RULES:
 * ✅ Accept ANY HTML as children
 * ✅ Keep children completely untouched
 * ✅ Add decorator output AFTER children
 * ✅ Use Light DOM (NOT Shadow DOM)
 * ✅ Dispatch wb-decorator:ready event
 * 
 * ❌ DON'T modify child elements
 * ❌ DON'T clear .innerHTML
 * ❌ DON'T use Shadow DOM
 * ❌ DON'T assume specific children
 * 
 * EXAMPLE USAGE:
 * <wb-examples-decorator>
 *   <wb-button>Click</wb-button>  ← Child unchanged
 * </wb-examples-decorator>
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';

/**
 * DecoratorName Decorator
 * 
 * Purpose: [What this decorator does]
 * 
 * @example
 * <DECORATOR_NAME>
 *   <any-component>Content</any-component>
 * </DECORATOR_NAME>
 */
class DecoratorName extends WBBaseComponent {
  // REQUIRED: Use Light DOM (NOT Shadow DOM) for child access
  static useShadow = false;

  /**
   * connectedCallback - Called when decorator is added to DOM
   */
  connectedCallback() {
    // 1. Save original content before any modifications
    const originalHTML = this.innerHTML;

    // 2. Keep children as-is (don't modify them)
    // They stay exactly where they are in the Light DOM

    // 3. Create decorator output
    const decoratorOutput = this.createDecoratorOutput(originalHTML);

    // 4. Append decorator output AFTER children
    this.appendChild(decoratorOutput);

    // 5. Save reference for updates
    this.decoratorOutput = decoratorOutput;

    // 6. Dispatch ready event
    this.dispatchEvent(new CustomEvent('wb-decorator:ready', {
      bubbles: true,
      detail: {
        type: 'DECORATOR_NAME',
        childrenCount: this.children.length,
        contentLength: originalHTML.length
      }
    }));
  }

  /**
   * createDecoratorOutput() - Build the decorator's UI
   * 
   * This appears AFTER the children.
   * It's NOT part of the children, it's additional output.
   * 
   * @param {string} originalHTML - Original HTML of children
   * @returns {HTMLElement} - Decorator output element
   */
  createDecoratorOutput(originalHTML) {
    // Create main container
    const container = document.createElement('div');
    container.className = 'decorator-DECORATOR_NAME';

    // Example: Create a code block showing original HTML
    const heading = document.createElement('div');
    heading.className = 'decorator-heading';
    heading.textContent = 'Code Example';
    container.appendChild(heading);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'decorator-copy-btn';
    copyBtn.textContent = 'Copy';

    const textarea = document.createElement('textarea');
    textarea.className = 'decorator-code-example';
    textarea.readOnly = true;
    textarea.value = originalHTML.trim();

    // Copy to clipboard on button click
    copyBtn.addEventListener('click', () => {
      textarea.select();
      navigator.clipboard.writeText(textarea.value)
        .catch(() => document.execCommand('copy'));
      
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    });

    container.appendChild(copyBtn);
    container.appendChild(textarea);

    return container;
  }

  /**
   * attributeChangedCallback - Called when observed attributes change
   * 
   * IMPORTANT: Only update the DECORATOR output, never touch children
   */
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'enabled') {
      // Example: Toggle decorator visibility
      if (this.decoratorOutput) {
        this.decoratorOutput.style.display = newVal !== null ? 'block' : 'none';
      }
    }
  }

  /**
   * observedAttributes - Decorator-specific attributes
   */
  static get observedAttributes() {
    return ['enabled'];
  }

  /**
   * Optional: Add getter for easier attribute access
   */
  get enabled() {
    return this.hasAttribute('enabled');
  }
}

// Register decorator (only if not already registered)
if (!customElements.get('DECORATOR_NAME')) {
  customElements.define('DECORATOR_NAME', DecoratorName);
  console.log('✅ DECORATOR_NAME registered');
}

export { DecoratorName };
export default DecoratorName;

/**
 * USAGE EXAMPLES
 * 
 * Basic:
 * <DECORATOR_NAME>
 *   <wb-button>Click Me</wb-button>
 * </DECORATOR_NAME>
 * 
 * Multiple children:
 * <DECORATOR_NAME>
 *   <wb-button>Button 1</wb-button>
 *   <wb-input placeholder="Name"></wb-input>
 * </DECORATOR_NAME>
 * 
 * Stacked decorators:
 * <wb-theme-provider colors="dark">
 *   <DECORATOR_NAME>
 *     <wb-button>Themed & Decorated</wb-button>
 *   </DECORATOR_NAME>
 * </wb-theme-provider>
 */

/**
 * TESTING CHECKLIST
 * 
 * [ ] Decorator renders without error
 * [ ] Children are NOT modified
 * [ ] Decorator output appears AFTER children
 * [ ] Works with any child components
 * [ ] Works stacked with other decorators
 * [ ] Attribute changes work
 * [ ] No console errors
 * [ ] wb-decorator:ready event fires
 * [ ] Playwright tests pass
 */

/**
 * COMMON PITFALLS
 * 
 * ❌ WRONG: Modifying children
 * this.children[0].setAttribute('style', '...');
 * 
 * ✅ RIGHT: Leave children alone
 * const originalHTML = this.innerHTML;
 * const output = this.createOutput();
 * this.appendChild(output);
 * 
 * ❌ WRONG: Using Shadow DOM
 * static useShadow = true;
 * 
 * ✅ RIGHT: Use Light DOM
 * static useShadow = false;
 * 
 * ❌ WRONG: Clearing innerHTML
 * this.innerHTML = '';
 * 
 * ✅ RIGHT: Only append
 * this.appendChild(newElement);
 */
