export {};
// @ts-nocheck
/**
 * Demo Plugin for Website Builder
 * 
 * This is an example of how to create a plugin for the website builder.
 * Plugins can extend functionality, add new UI components, or modify existing behavior.
 */

(function() {
  // Define the plugin object
  const DemoPlugin = {
    id: 'demo-plugin',
    name: 'Demo Plugin',
    version: '1.0.0',
    
    // Called when the plugin is initialized
    initialize: function() {
      console.log('Demo Plugin initialized!');
      this.addControlPanelButton();
      this.registerEventListeners();
    },
    
    // Add a button to the control panel
    addControlPanelButton: function() {
      const controlPanel = document.querySelector('#main-control-panel');
      if (!controlPanel) {
        console.warn('Control panel not found, cannot add button');
        return;
      }
      
      // Find the button container in the control panel
      const buttonContainer = controlPanel.querySelector('.control-buttons') || 
                              controlPanel.querySelector('.button-container');
      
      if (!buttonContainer) {
        console.warn('Button container not found in control panel');
        return;
      }
      
      // Create the plugin button
      const button = document.createElement('button');
      button.id = 'demo-plugin-btn';
      button.className = 'control-btn';
      button.innerHTML = '🧩 Plugin';
      button.title = 'Demo Plugin Action';
      
      // Add click handler
      button.addEventListener('click', (): any => {
        this.performAction();
      });
      
      // Add to control panel
      buttonContainer.appendChild(button);
      console.log('Demo plugin button added to control panel');
    },
    
    // Register event listeners
    registerEventListeners: function() {
      // Listen for theme changes
      document.addEventListener('theme:changed', (event) => {
        console.log('Theme changed event detected by plugin:', event.detail);
        // You could perform actions based on theme changes here
      });
      
      // Listen for layout changes
      document.addEventListener('layout:changed', (event) => {
        console.log('Layout changed event detected by plugin:', event.detail);
      });
    },
    
    // Example action performed by the plugin
    performAction: function() {
      alert('Demo Plugin Action: This is where your plugin functionality goes!');
      
      // Example: Add a special effect to headings
      const headings = document.querySelectorAll('h1, h2, h3');
      headings.forEach(heading => {
        // Toggle a special class
        if (heading.classList.contains('plugin-enhanced')) {
          heading.classList.remove('plugin-enhanced');
        } else {
          heading.classList.add('plugin-enhanced');
          
          // Add some temporary styling
          heading.style.transition = 'all 0.5s ease';
          heading.style.textShadow = '0 0 10px rgba(100, 100, 255, 0.8)';
          heading.style.color = 'var(--primary)';
          
          // Remove the effect after 2 seconds
          setTimeout((): any => {
            heading.style.textShadow = '';
          }, 2000);
        }
      });
    },
    
    // Cleanup function when plugin is disabled/unloaded
    cleanup: function() {
      // Remove any added elements, event listeners, etc.
      const button = document.getElementById('demo-plugin-btn');
      if (button) button.remove();
      
      console.log('Demo Plugin cleaned up');
    }
  };
  
  // Register the plugin with the plugin system
  if (window.PluginSystem) {
    window.PluginSystem.register('demo-plugin', DemoPlugin);
  } else {
    console.error('Plugin system not found. Cannot register Demo Plugin.');
  }
})();
