/**
 * WebSocket Dependency Loader
 * 
 * This module provides utilities to load dependencies through WebSocket
 * instead of making HTTP requests. This is particularly useful when
 * we already have an active WebSocket connection.
 */

import { Socket } from 'socket.io-client';

// Define interfaces for type safety
interface LoadScriptOptions {
  executeScript?: boolean;
  appendToBody?: boolean;
  async?: boolean;
  defer?: boolean;
  module?: boolean;
}

interface LoadCSSOptions {
  id?: string;
  media?: string;
}

interface LoadHTMLOptions {
  containerId?: string;
  replace?: boolean;
}

interface CacheEntry {
  content: string;
  timestamp: number;
  type: string;
}

class WebSocketDependencyLoader {
  private socket: Socket;
  private loaded: Map<string, string>;
  private cache: Map<string, CacheEntry>;
  private cacheTTL: number = 60 * 60 * 1000; // 1 hour cache TTL by default
  private resourceTimeout: number = 10000; // 10 seconds timeout for resource loading
  
  constructor(socket?: Socket, options: { cacheTTL?: number; resourceTimeout?: number } = {}) {
    // Use provided socket or existing global socket
    if (!socket) {
      if (typeof window !== 'undefined') {
        // @ts-ignore - These are dynamically added to the window object
        this.socket = window.socket || (window.io ? window.io() : null);
      } else {
        throw new Error('Socket must be provided when not running in browser environment');
      }
    } else {
      this.socket = socket;
    }
    
    if (!this.socket) {
      throw new Error('WebSocket connection required for dependency loading');
    }
    
    // Keep track of loaded resources
    this.loaded = new Map<string, string>();
    
    // Setup cache for dependencies to avoid duplicate requests
    this.cache = new Map<string, CacheEntry>();
    
    // Set options
    if (options.cacheTTL) this.cacheTTL = options.cacheTTL;
    if (options.resourceTimeout) this.resourceTimeout = options.resourceTimeout;
    
    console.log('WebSocket Dependency Loader initialized');
  }
  
  /**
   * Load a JavaScript file via WebSocket
   * @param path - Path to the JavaScript file
   * @param options - Options for loading
   * @returns The script content
   */
  public async loadScript(path: string, options: LoadScriptOptions = {}): Promise<string> {
    const { executeScript = true, appendToBody = false, async = false, defer = false, module = false } = options;
    
    if (this.loaded.has(path)) {
      console.log(`Script already loaded: ${path}`);
      return this.loaded.get(path) || '';
    }
    
    try {
      console.log(`Loading script via WebSocket: ${path}`);
      const content = await this._fetchResource('file', path);
      
      if (executeScript && typeof document !== 'undefined') {
        // Create script element
        const script = document.createElement('script');
        script.textContent = content;
        script.setAttribute('data-src', path);
        script.setAttribute('data-loaded-by', 'websocket');
        
        if (async) script.setAttribute('async', '');
        if (defer) script.setAttribute('defer', '');
        if (module) script.setAttribute('type', 'module');
        
        // Add to document
        if (appendToBody) {
          document.body.appendChild(script);
        } else {
          document.head.appendChild(script);
        }
        
        console.log(`Script executed: ${path}`);
      }
      
      // Store in loaded map
      this.loaded.set(path, content);
      
      return content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error loading script via WebSocket: ${path}`, errorMessage);
      throw error;
    }
  }
  
  /**
   * Load a CSS file via WebSocket
   * @param path - Path to the CSS file
   * @param options - Options for loading
   * @returns The CSS content
   */
  public async loadCSS(path: string, options: LoadCSSOptions = {}): Promise<string> {
    const { id, media } = options;
    
    if (this.loaded.has(path)) {
      console.log(`CSS already loaded: ${path}`);
      return this.loaded.get(path) || '';
    }
    
    try {
      console.log(`Loading CSS via WebSocket: ${path}`);
      const content = await this._fetchResource('file', path);
      
      if (typeof document !== 'undefined') {
        // Create style element
        const style = document.createElement('style');
        style.textContent = content;
        style.setAttribute('data-href', path);
        style.setAttribute('data-loaded-by', 'websocket');
        
        if (id) style.id = id;
        if (media) style.media = media;
        
        // Add to document
        document.head.appendChild(style);
        console.log(`CSS applied: ${path}`);
      }
      
      // Store in loaded map
      this.loaded.set(path, content);
      
      return content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error loading CSS via WebSocket: ${path}`, errorMessage);
      throw error;
    }
  }
  
  /**
   * Load a component via WebSocket
   * @param name - Component name
   * @returns The component content
   */
  public async loadComponent(name: string): Promise<string> {
    try {
      console.log(`Loading component via WebSocket: ${name}`);
      const content = await this._fetchResource('component', name);
      
      // Store in loaded map
      this.loaded.set(`component:${name}`, content);
      
      return content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error loading component via WebSocket: ${name}`, errorMessage);
      throw error;
    }
  }
  
  /**
   * Load a plugin via WebSocket
   * @param name - Plugin name
   * @param execute - Whether to execute the plugin immediately
   * @returns The plugin content
   */
  public async loadPlugin(name: string, execute: boolean = true): Promise<string> {
    try {
      console.log(`Loading plugin via WebSocket: ${name}`);
      const content = await this._fetchResource('plugin', name);
      
      if (execute && typeof document !== 'undefined') {
        // Create script element
        const script = document.createElement('script');
        script.textContent = content;
        script.setAttribute('data-plugin', name);
        script.setAttribute('data-loaded-by', 'websocket');
        
        // Add to document
        document.head.appendChild(script);
        console.log(`Plugin executed: ${name}`);
      }
      
      // Store in loaded map
      this.loaded.set(`plugin:${name}`, content);
      
      return content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error loading plugin via WebSocket: ${name}`, errorMessage);
      throw error;
    }
  }
  
  /**
   * Load an HTML template via WebSocket
   * @param path - Path to the HTML template
   * @param options - Options for loading
   * @returns The HTML content
   */
  public async loadHTML(path: string, options: LoadHTMLOptions = {}): Promise<string> {
    const { containerId, replace = false } = options;
    
    try {
      console.log(`Loading HTML via WebSocket: ${path}`);
      const content = await this._fetchResource('file', path);
      
      if (containerId && typeof document !== 'undefined') {
        const container = document.getElementById(containerId);
        if (container) {
          if (replace) {
            container.innerHTML = content;
          } else {
            container.insertAdjacentHTML('beforeend', content);
          }
          console.log(`HTML ${replace ? 'replaced' : 'appended'} in container: ${containerId}`);
        } else {
          console.warn(`Container element not found: ${containerId}`);
        }
      }
      
      // Store in loaded map
      this.loaded.set(path, content);
      
      return content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error loading HTML via WebSocket: ${path}`, errorMessage);
      throw error;
    }
  }
  
  /**
   * Load multiple dependencies in parallel
   * @param resources - Array of resources to load
   * @returns Map of resources and their content
   */
  public async loadMany(resources: Array<{type: 'script'|'css'|'html'|'component'|'plugin', path: string, options?: any}>): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    
    await Promise.all(resources.map(async (resource): any => {
      try {
        let content: string;
        
        switch(resource.type) {
          case 'script':
            content = await this.loadScript(resource.path, resource.options);
            break;
          case 'css':
            content = await this.loadCSS(resource.path, resource.options);
            break;
          case 'html':
            content = await this.loadHTML(resource.path, resource.options);
            break;
          case 'component':
            content = await this.loadComponent(resource.path);
            break;
          case 'plugin':
            content = await this.loadPlugin(resource.path, resource.options?.execute);
            break;
          default:
            throw new Error(`Unknown resource type: ${resource.type}`);
        }
        
        results.set(resource.path, content);
      } catch (error) {
        console.error(`Failed to load ${resource.type} ${resource.path}:`, error);
        // Continue with other resources even if one fails
      }
    }));
    
    return results;
  }
  
  /**
   * Fetch any resource type via WebSocket
   * @param resourceType - Type of resource ('file', 'component', 'plugin')
   * @param path - Resource path or name
   * @returns The resource content
   * @private
   */
  private _fetchResource(resourceType: string, path: string): Promise<string> {
    const cacheKey = `${resourceType}:${path}`;
    
    // Check cache first
    const cachedEntry = this.cache.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < this.cacheTTL) {
      return Promise.resolve(cachedEntry.content);
    }
    
    return new Promise<string>((resolve, reject) => {
      let eventName: string;
      let emitEvent: string;
      
      switch (resourceType) {
        case 'file':
          eventName = `file:${path}`;
          emitEvent = 'get:file';
          break;
        case 'component':
          eventName = `component:${path}`;
          emitEvent = 'load:component';
          break;
        case 'plugin':
          eventName = `plugin:${path}`;
          emitEvent = 'load:plugin';
          break;
        default:
          return reject(new Error(`Unknown resource type: ${resourceType}`));
      }
      
      // Set up timeout
      const timeout = setTimeout((): any => {
        this.socket.off(eventName);
        reject(new Error(`Timeout loading ${resourceType}: ${path}`));
      }, this.resourceTimeout);
      
      // Listen for response
      this.socket.once(eventName, (data: { content?: string; error?: string }) => {
        clearTimeout(timeout);
        
        if (data.error) {
          return reject(new Error(data.error));
        }
        
        if (data.content) {
          // Store in cache
          this.cache.set(cacheKey, {
            content: data.content,
            timestamp: Date.now(),
            type: resourceType
          });
          resolve(data.content);
        } else {
          reject(new Error(`Invalid response for ${resourceType}: ${path}`));
        }
      });
      
      // Request resource
      this.socket.emit(emitEvent, { path, name: path });
    });
  }
  
  /**
   * Clear loader cache
   */
  public clearCache(): void {
    this.cache.clear();
    console.log('WebSocket Dependency Loader cache cleared');
  }
  
  /**
   * Check if a resource has been loaded
   * @param path - Resource path
   * @returns Whether the resource has been loaded
   */
  public isLoaded(path: string): boolean {
    return this.loaded.has(path);
  }
  
  /**
   * Get the content of a loaded resource
   * @param path - Resource path
   * @returns The resource content or null if not loaded
   */
  public getLoadedContent(path: string): string | null {
    return this.loaded.get(path) || null;
  }
}

// Create global instance if socket is available
if (typeof window !== 'undefined' && (window as any).socket && !(window as any).wsLoader) {
  (window as any).wsLoader = new WebSocketDependencyLoader();
  console.log('Global WebSocket Dependency Loader created');
}

export default WebSocketDependencyLoader;
