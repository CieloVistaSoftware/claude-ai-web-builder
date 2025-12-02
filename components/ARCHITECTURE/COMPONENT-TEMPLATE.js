/**
 * COMPONENT-TEMPLATE.js
 * 
 * Template for all UI components in WB Framework v2.0
 * 
 * ⚠️ LIGHT DOM VERSION (NO Shadow DOM)
 * 
 * COPY THIS and replace:
 * 1. "COMPONENT_NAME" with your component name (wb-button)
 * 2. "ComponentName" with your class name (WBButton)
 * 3. Implement your logic
 * 4. Update claude.md when done
 * 
 * KEY RULES:
 * ✅ Render ONE UI element
 * ✅ Use Light DOM (useShadow = false) - NO Shadow DOM
 * ✅ Implement render() method
 * ✅ Handle observedAttributes
 * ✅ Dispatch component-specific events
 * ✅ Use CSS classes for styling (external CSS)
 * 
 * ❌ Don't use Shadow DOM
 * ❌ Don't wrap other components
 * ❌ Don't modify children
 * ❌ Don't store state in DOM attributes alone
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';

/**
 * COMPONENT_NAME Component
 * 
 * @example
 * <COMPONENT_NAME variant="primary" size="medium">
 *   Button Text
 * </COMPONENT_NAME>
 */
class ComponentName extends WBBaseComponent {
  // REQUIRED: Use Light DOM (NOT Shadow DOM)
  static useShadow = false;

  /**
   * connectedCallback - Called when component is added to DOM
   */
  connectedCallback() {
    // 1. Render the component
    this.render();

    // 2. Setup event listeners
    this.setupEventListeners();

    // 3. Dispatch ready event
    this.dispatchEvent(new CustomEvent('COMPONENT_NAME:ready', {
      bubbles: true,
      detail: {
        variant: this.getAttribute('variant'),
        size: this.getAttribute('size'),
        disabled: this.hasAttribute('disabled')
      }
    }));
  }

  /**
   * render() - Build component UI
   * 
   * Light DOM means:
   * - Build actual DOM elements
   * - No shadow root
   * - CSS applies directly
   * - HTML is visible in inspector
   */
  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const size = this.getAttribute('size') || 'medium';
    const disabled = this.hasAttribute('disabled');
    const text = this.textContent || 'Button';

    // Clear existing content (Light DOM)
    this.innerHTML = '';

    // Create main element
    const element = document.createElement('button');
    element.className = 'wb-COMPONENT_NAME';
    element.classList.add(`wb-COMPONENT_NAME--${variant}`);
    element.classList.add(`wb-COMPONENT_NAME--${size}`);
    
    if (disabled) {
      element.classList.add('wb-COMPONENT_NAME--disabled');
      element.setAttribute('disabled', '');
    }

    // Add text content
    element.textContent = text;

    // Add to Light DOM (directly in this element)
    this.appendChild(element);

    // Save reference for event listeners
    this.element = element;
  }

  /**
   * setupEventListeners() - Add event handlers
   */
  setupEventListeners() {
    if (!this.element) return;

    this.element.addEventListener('click', (e) => {
      if (this.hasAttribute('disabled')) {
        e.preventDefault();
        return;
      }

      this.dispatchEvent(new CustomEvent('COMPONENT_NAME:click', {
        bubbles: true,
        detail: {
          variant: this.getAttribute('variant'),
          text: this.element.textContent
        }
      }));
    });
  }

  /**
   * attributeChangedCallback - Called when observed attributes change
   */
  attributeChangedCallback(name, oldVal, newVal) {
    if (this.isConnected) {
      this.render();
    }
  }

  /**
   * observedAttributes - List of attributes that trigger attributeChangedCallback
   */
  static get observedAttributes() {
    return [
      'variant',
      'size',
      'disabled',
      'active'
    ];
  }

  // Optional: Add getters for easier access
  get variant() {
    return this.getAttribute('variant') || 'primary';
  }

  get size() {
    return this.getAttribute('size') || 'medium';
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
}

// Register component (only if not already registered)
if (!customElements.get('COMPONENT_NAME')) {
  customElements.define('COMPONENT_NAME', ComponentName);
  console.log('✅ COMPONENT_NAME registered');
}

export { ComponentName };
export default ComponentName;

/**
 * USAGE EXAMPLES
 * 
 * Basic:
 * <COMPONENT_NAME>Default Text</COMPONENT_NAME>
 * 
 * With attributes:
 * <COMPONENT_NAME variant="secondary" size="large">
 *   Large Button
 * </COMPONENT_NAME>
 * 
 * Disabled:
 * <COMPONENT_NAME disabled>
 *   Can't click
 * </COMPONENT_NAME>
 * 
 * Dynamic:
 * <script>
 *   const elem = document.querySelector('COMPONENT_NAME');
 *   elem.setAttribute('variant', 'success');
 *   elem.setAttribute('size', 'large');
 * </script>
 */

/**
 * STYLING WITH LIGHT DOM
 * 
 * Since we use Light DOM (no encapsulation), CSS applies directly:
 * 
 * 1. External CSS file (wb-COMPONENT_NAME.css):
 *    .wb-COMPONENT_NAME { ... }
 *    .wb-COMPONENT_NAME--primary { ... }
 *    .wb-COMPONENT_NAME--disabled { ... }
 * 
 * 2. CSS can be:
 *    - In external file (recommended)
 *    - In <style> tag in main document
 *    - Applied via CSS variables
 *    - Overridden by parent styles (good or bad depending on use case)
 * 
 * 3. Advantages:
 *    - Easy to style with parent CSS
 *    - Can use global variables
 *    - No CSS-in-JS needed
 *    - Light and fast
 * 
 * 4. Disadvantages:
 *    - No encapsulation
 *    - Styles can leak in/out
 *    - CSS specificity matters
 */

/**
 * TESTING CHECKLIST
 * 
 * [ ] Renders without error
 * [ ] All attributes work
 * [ ] All events fire
 * [ ] Re-renders on change
 * [ ] CSS applies correctly
 * [ ] No console errors
 * [ ] Works with decorators
 * [ ] Playwright tests pass
 */

/**
 * COMMON PITFALLS
 * 
 * ❌ WRONG: Trying to use Shadow DOM
 * this.attachShadow({ mode: 'open' });
 * 
 * ✅ RIGHT: Use Light DOM
 * this.innerHTML = '';
 * this.appendChild(element);
 * 
 * ❌ WRONG: Trying to preserve CSS from shadow root
 * (Shadow root doesn't exist in Light DOM)
 * 
 * ✅ RIGHT: Use external CSS file
 * (CSS applied automatically to Light DOM elements)
 * 
 * ❌ WRONG: Clearing innerHTML without saving children
 * this.innerHTML = '';  // If this component has slotted children!
 * 
 * ✅ RIGHT: Only clear if no children expected
 * // Or save children first: const children = this.children;
 * 
 * ❌ WRONG: Using this.textContent as the only content
 * (Clears everything)
 * 
 * ✅ RIGHT: Use element.textContent or append elements
 */

/**
 * LIGHT DOM vs SHADOW DOM
 * 
 * Why Light DOM (our choice):
 * ✅ Simpler - no encapsulation complexity
 * ✅ Faster - no shadow tree overhead
 * ✅ CSS easier - external stylesheets work
 * ✅ Accessible - full DOM visible
 * ✅ Composable - with decorators
 * 
 * Why NOT Shadow DOM:
 * ❌ Complex for decorators
 * ❌ CSS encapsulation overkill
 * ❌ Slower for many components
 * ❌ Harder to style from outside
 */
