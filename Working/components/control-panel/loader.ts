/**
 * @file loader.ts
 * @description Helper module for loading the control panel content
 * @module components/control-panel/loader
 */

/**
 * Loads the ControlPanelContent.html into the specified control panel element
 * @param {HTMLElement} controlPanelElement - The control panel element to load content into
 * @returns {Promise<HTMLElement>} - Promise that resolves when the content is loaded
 */
export async function loadControlPanelContent(controlPanelElement: HTMLElement): Promise<HTMLElement> {
  try {
    const response = await fetch('./components/control-panel/ControlPanelContent.html');
    if (!response.ok) {
      throw new Error(`Failed to load control panel content: ${response.status}`);
    }
    
    const html = await response.text();
    controlPanelElement.innerHTML = html;
    
    // If we have a global handler initialization function, call it
    if (window.initControlPanelHandlers) {
      window.initControlPanelHandlers();
    }
    
    // Dispatch a custom event to notify that the content is loaded
    const event = new CustomEvent('controlpanel:contentloaded', {
      bubbles: true,
      detail: { controlPanel: controlPanelElement }
    });
    controlPanelElement.dispatchEvent(event);
    
    return controlPanelElement;
  } catch (error) {
    console.error('Error loading control panel content:', error);
    throw error;
  }
}

/**
 * Updates paths in the ControlPanelContent.html to use the new module structure
 * This is needed for backward compatibility with scripts that expect the content
 * to be in the root directory
 * 
 * @param {HTMLElement} controlPanelElement - The control panel element with loaded content
 * @returns {HTMLElement} - The control panel element with updated paths
 */
export function updateContentPaths(controlPanelElement: HTMLElement): HTMLElement {
  // Update any relative paths that might be in the content
  // For example, if there are images or other resources
  
  // Return the updated element
  return controlPanelElement;
}

// Add global handler type declaration
declare global {
  interface Window {
    initControlPanelHandlers?: () => void;
  }
}
