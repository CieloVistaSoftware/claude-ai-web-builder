// component-utils.js
// Shared utility functions for WB components
// Expanded with additional helpers for deduplication and reactivity
/**
 * Adds an event listener and tracks it for later removal.
 * @param {HTMLElement} el - The element to attach the event to.
 * @param {string} type - The event type.
 * @param {Function} handler - The event handler.
 * @param {Object} [options] - Optional event options.
 * @returns {Function} - A function to remove the event listener.
 */
export function addTrackedEventListener(el, type, handler, options) {
  el.addEventListener(type, handler, options);
  return () => el.removeEventListener(type, handler, options);
}

/**
 * Reflects a property to an attribute.
 * @param {HTMLElement} el - The element.
 * @param {string} name - The attribute name.
 * @param {any} value - The value to set.
 */
export function reflectAttribute(el, name, value) {
  if (value === false || value == null) {
    el.removeAttribute(name);
  } else if (value === true) {
    el.setAttribute(name, '');
  } else {
    el.setAttribute(name, value);
  }
}

/**
 * Gets an attribute value, falling back to a default if not present.
 * @param {HTMLElement} el - The element.
 * @param {string} name - The attribute name.
 * @param {any} [defaultValue] - The default value if not present.
 * @returns {any}
 */
export function getAttributeOrDefault(el, name, defaultValue = null) {
  return el.hasAttribute(name) ? el.getAttribute(name) : defaultValue;
}

/**
 * Dispatches a custom event from an element (WB style).
 * @param {HTMLElement} el - The element.
 * @param {string} name - The event name.
 * @param {any} detail - The event detail.
 * @param {boolean} [bubbles=true] - Whether the event bubbles.
 * @param {boolean} [composed=true] - Whether the event is composed.
 */
export function dispatchWBEvent(el, name, detail, bubbles = true, composed = true) {
  el.dispatchEvent(new CustomEvent(name, { detail, bubbles, composed }));
}

/**
 * Helper to define observed attributes for a component.
 * @param {string[]} attrs - The attribute names.
 * @returns {string[]}
 */
export function defineObservedAttributes(attrs) {
  return attrs;
}

/**
 * Reflect a property to an attribute (and vice versa)
 */
export function reflectPropAttr(element, prop, attr) {
  Object.defineProperty(element, prop, {
    get() {
      return this.hasAttribute(attr) ? this.getAttribute(attr) : null;
    },
    set(val) {
      if (val === null || val === undefined || val === false) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, val);
      }
    }
  });
}

/**
 * Dispatch a custom event with detail
 */
export function dispatchComponentEvent(element, name, detail = {}, options = {}) {
  element.dispatchEvent(new CustomEvent(name, {
    detail,
    bubbles: options.bubbles !== false,
    composed: options.composed !== false,
    cancelable: options.cancelable === true
  }));
}

/**
 * Add event listeners in bulk
 */
export function addEventListeners(element, listeners) {
  Object.entries(listeners).forEach(([event, handler]) => {
    element.addEventListener(event, handler);
  });
}

/**
 * Remove event listeners in bulk
 */
export function removeEventListeners(element, listeners) {
  Object.entries(listeners).forEach(([event, handler]) => {
    element.removeEventListener(event, handler);
  });
}
