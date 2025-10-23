/**
 * WB CSS Loader Utility
 * 
 * Automatically loads CSS files for web components.
 * Designed to be called from connectedCallback() in components.
 * 
 * @version 1.0.0
 * @author Website Builder Team
 * 
 * @example
 * import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';
 * 
 * class MyComponent extends HTMLElement {
 *   async connectedCallback() {
 *     await loadComponentCSS(this, 'my-component.css');
 *     this.render();
 *   }
 * }
 */

/**
 * Load a single CSS file for a component
 * 
 * @param {HTMLElement} component - The component element (usually `this`)
 * @param {string} filename - The CSS filename (relative to component folder)
 * @returns {Promise<void>} Resolves when CSS is loaded
 * 
 * @example
 * await loadComponentCSS(this, 'wb-button.css');
 */
export async function loadComponentCSS(component, filename) {
  try {
    // Get the component's folder path from import.meta.url if available
    // Otherwise, construct it from the component element's tagName
    const componentPath = getComponentPath(component);
    
    // Construct the full CSS file path
    const cssPath = `${componentPath}/${filename}`;
    
    // Create and inject a <link> tag into the document head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    link.dataset.component = component.tagName.toLowerCase();
    link.dataset.cssFile = filename;
    
    // Wait for the link to load
    return new Promise((resolve, reject) => {
      link.onload = () => {
        console.log(`✅ CSS loaded: ${filename} (${component.tagName.toLowerCase()})`);
        resolve();
      };
      
      link.onerror = () => {
        console.error(`❌ Failed to load CSS: ${cssPath}`);
        reject(new Error(`Failed to load CSS: ${cssPath}`));
      };
      
      // Append to head
      document.head.appendChild(link);
    });
  } catch (error) {
    console.error(`❌ CSS Loader Error for ${component.tagName}: ${error.message}`);
    throw error;
  }
}

/**
 * Load multiple CSS files for a component
 * 
 * @param {HTMLElement} component - The component element (usually `this`)
 * @param {string[]} filenames - Array of CSS filenames
 * @returns {Promise<void>} Resolves when all CSS files are loaded
 * 
 * @example
 * await loadComponentCSSMultiple(this, ['base.css', 'theme.css', 'animations.css']);
 */
export async function loadComponentCSSMultiple(component, filenames) {
  try {
    // Load all CSS files in parallel
    const promises = filenames.map(filename => loadComponentCSS(component, filename));
    await Promise.all(promises);
  } catch (error) {
    console.error(`❌ Failed to load multiple CSS files: ${error.message}`);
    throw error;
  }
}

/**
 * Helper: Get the component's folder path
 * Uses component's folder structure: /components/wb-component-name/
 * 
 * @param {HTMLElement} component - The component element
 * @returns {string} The path to the component's folder
 * @private
 */
function getComponentPath(component) {
  // Component folder is typically: /components/{tag-name}/
  const tagName = component.tagName.toLowerCase();
  return `/components/${tagName}`;
}

/**
 * Advanced: Load CSS with custom path
 * Use this if your component folder structure is non-standard
 * 
 * @param {HTMLElement} component - The component element
 * @param {string} fullPath - Full path to CSS file (e.g., '/styles/custom.css')
 * @returns {Promise<void>} Resolves when CSS is loaded
 * 
 * @example
 * await loadComponentCSSWithPath(this, '/styles/shared-button-styles.css');
 */
export async function loadComponentCSSWithPath(component, fullPath) {
  try {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fullPath;
    link.dataset.component = component.tagName.toLowerCase();
    
    return new Promise((resolve, reject) => {
      link.onload = () => {
        console.log(`✅ CSS loaded: ${fullPath}`);
        resolve();
      };
      
      link.onerror = () => {
        console.error(`❌ Failed to load CSS: ${fullPath}`);
        reject(new Error(`Failed to load CSS: ${fullPath}`));
      };
      
      document.head.appendChild(link);
    });
  } catch (error) {
    console.error(`❌ CSS Loader Error: ${error.message}`);
    throw error;
  }
}

/**
 * Check if CSS is already loaded for a component
 * 
 * @param {string} componentTag - Component tag name (e.g., 'wb-button')
 * @param {string} filename - CSS filename to check
 * @returns {boolean} True if CSS is already loaded
 * 
 * @example
 * if (!isCSSLoaded('wb-button', 'wb-button.css')) {
 *   await loadComponentCSS(this, 'wb-button.css');
 * }
 */
export function isCSSLoaded(componentTag, filename) {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  return Array.from(links).some(link => 
    link.dataset.component === componentTag && 
    link.dataset.cssFile === filename
  );
}

/**
 * Unload CSS for a component (cleanup)
 * Useful for removing styles when component is no longer needed
 * 
 * @param {string} componentTag - Component tag name (e.g., 'wb-button')
 * @param {string} filename - CSS filename to unload
 * 
 * @example
 * unloadComponentCSS('wb-button', 'wb-button.css');
 */
export function unloadComponentCSS(componentTag, filename) {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    if (link.dataset.component === componentTag && link.dataset.cssFile === filename) {
      link.remove();
      console.log(`🗑️ CSS unloaded: ${filename}`);
    }
  });
}
