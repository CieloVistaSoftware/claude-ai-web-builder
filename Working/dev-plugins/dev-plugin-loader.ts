// @ts-nocheck
/**
 * Developer Plugins Loader
 * 
 * This file manages development-only plugins that will not be included
 * in the exported website. It loads plugins from the dev-plugins directory.
 * 
 * IMPORTANT: This file is excluded from the exported website build.
 */

class DevPluginSystem {
  constructor() {
    this.plugins = [];
    this.api = null;
    this.initialized = false;
    this.devMode = true; // Set to false to disable all dev plugins
  }

  /**
   * Initialize the development plugin system
   */
  async initialize() {
    if (!this.devMode) {
      console.log('[DevPluginSystem] Development mode is disabled. Dev plugins will not be loaded.');
      return;
    }

    console.log('[DevPluginSystem] Initializing developer plugin system...');
    
    // Create API for plugins
    this.api = this.createPluginAPI();
    
    // Register global function for plugins to register themselves
    window.registerDevPlugin = (plugin) => this.registerPlugin(plugin);
    
    // Load all plugins
    await this.loadPlugins();
    
    this.initialized = true;
    console.log('[DevPluginSystem] Initialized successfully');
  }
  
  /**
   * Create API object for plugins to interact with website builder
   */
  createPluginAPI() {
    return {
      // Command registration and execution
      commands: {},
      registerCommand: (name, handler) => {
        this.api.commands[name] = handler;
        console.log(`[DevPluginSystem] Registered command: ${name}`);
      },
      executeCommand: async(name, ...args): any => {
        if (this.api.commands[name]) {
          return await this.api.commands[name](...args);
        } else {
          console.warn(`[DevPluginSystem] Command not found: ${name}`);
          return null;
        }
      },
      
      // Event system
      events: {},
      on: (event, handler) => {
        this.api.events[event] = this.api.events[event] || [];
        this.api.events[event].push(handler);
      },
      off: (event, handler) => {
        if (this.api.events[event]) {
          this.api.events[event] = this.api.events[event].filter(h => h !== handler);
        }
      },
      emit: async(event, data): any => {
        if (this.api.events[event]) {
          for (const handler of this.api.events[event]) {
            data = await handler(data) || data;
          }
        }
        return data;
      },
      
      // UI helpers
      createToolbarButton: (label, onClick) => {
        const button = document.createElement('button');
        button.className = 'dev-plugin-button';
        button.textContent = label;
        button.addEventListener('click', onClick);
        
        const toolbar = document.querySelector('.developer-toolbar') || document.createElement('div');
        if (!document.querySelector('.developer-toolbar')) {
          toolbar.className = 'developer-toolbar';
          document.body.appendChild(toolbar);
        }
        
        toolbar.appendChild(button);
        return button;
      },
      
      // Access to website builder modules and state
      getWebsiteState: () => WebsiteState?.getState?.() || {},
      getThemeManager: () => window.ThemeManager || {},
      getLayoutManager: () => window.LayoutManager || {},
      getSaveLoadManager: () => window.SaveLoadManager || {},
      
      // Utility functions
      showNotification: (message, duration = 3000) => {
        UIController.showStatusMessage?.(message, duration) || alert(message);
      }
    };
  }
  
  /**
   * Register a plugin
   */
  registerPlugin(plugin) {
    if (!this.devMode) return;
    
    console.log(`[DevPluginSystem] Registering plugin: ${plugin.name || 'Unnamed'}`);
    this.plugins.push(plugin);
    
    // Initialize the plugin if the system is already initialized
    if (this.initialized) {
      plugin.initialize(this.api).catch(error => {
        console.error(`[DevPluginSystem] Error initializing plugin ${plugin.name}:`, error);
      });
    }
  }
  
  /**
   * Load all plugins from the dev-plugins directory
   */
  async loadPlugins() {
    try {
      // In a real implementation, you would dynamically load plugins from the dev-plugins directory
      // For now, we'll manually include the obfuscator plugin
      
      console.log('[DevPluginSystem] Loading plugins from dev-plugins directory...');
      
      // Load the obfuscator plugin
      await this.loadPlugin('obfuscate/obfuscator-plugin.js');
      
      // Initialize all registered plugins
      for (const plugin of this.plugins) {
        try {
          await plugin.initialize(this.api);
          console.log(`[DevPluginSystem] Initialized plugin: ${plugin.name}`);
        } catch (error) {
          console.error(`[DevPluginSystem] Error initializing plugin ${plugin.name}:`, error);
        }
      }
    } catch (error) {
      console.error('[DevPluginSystem] Error loading plugins:', error);
    }
  }
  
  /**
   * Load a specific plugin by path
   */
  async loadPlugin(path) {
    return new Promise((resolve, reject): any => {
      const script = document.createElement('script');
      script.src = `./dev-plugins/${path}`;
      script.onload = () => {
        console.log(`[DevPluginSystem] Loaded plugin: ${path}`);
        resolve();
      };
      script.onerror = (error) => {
        console.error(`[DevPluginSystem] Error loading plugin ${path}:`, error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }
  
  /**
   * Hook into the save process to remove development plugins
   * This should be called before the website is exported
   */
  async beforeSave(htmlContent) {
    if (!this.initialized) return htmlContent;
    
    console.log('[DevPluginSystem] Processing website for export (removing dev tools)...');
    
    try {
      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Remove all developer scripts
      const devScripts = doc.querySelectorAll('script[src*="dev-plugins"]');
      devScripts.forEach(script => script.remove());
      
      // Remove all developer UI elements
      doc.querySelectorAll('.developer-toolbar, .developer-tools-section, .dev-tools-toggle').forEach(el => el.remove());
      
      // Allow plugins to perform their own cleanup
      for (const plugin of this.plugins) {
        if (typeof plugin.beforeExport === 'function') {
          await plugin.beforeExport(doc);
        }
      }
      
      return doc.documentElement.outerHTML;
    } catch (error) {
      console.error('[DevPluginSystem] Error processing website for export:', error);
      return htmlContent;
    }
  }
  
  /**
   * Clean up resources used by the plugin system
   */
  cleanup() {
    if (!this.initialized) return;
    
    console.log('[DevPluginSystem] Cleaning up...');
    
    // Clean up all plugins
    for (const plugin of this.plugins) {
      if (typeof plugin.cleanup === 'function') {
        try {
          plugin.cleanup();
        } catch (error) {
          console.error(`[DevPluginSystem] Error cleaning up plugin ${plugin.name}:`, error);
        }
      }
    }
    
    // Remove global registration function
    delete window.registerDevPlugin;
    
    this.plugins = [];
    this.initialized = false;
  }
}

// Create and initialize the developer plugin system
window.DevPluginSystem = new DevPluginSystem();
window.addEventListener('DOMContentLoaded', (): any => {
  window.DevPluginSystem.initialize().catch(error => {
    console.error('[DevPluginSystem] Error initializing:', error);
  });
});
