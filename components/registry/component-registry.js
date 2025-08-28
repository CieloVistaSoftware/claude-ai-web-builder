// Component Registry System for Claude AI Website Builder
// A centralized system to register, discover, and document components

class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.categories = new Set();
  }
  
  /**
   * Register a component with the registry
   * 
   * @param {Object} componentInfo - Component metadata and definition
   * @param {string} componentInfo.name - Component name (must be unique)
   * @param {string} componentInfo.tagName - HTML tag name for the component
   * @param {string} componentInfo.category - Category for grouping components
   * @param {string} componentInfo.description - Description of the component
   * @param {string} componentInfo.version - Component version
   * @param {string} componentInfo.author - Component author
   * @param {Array<Object>} componentInfo.props - Component properties/attributes
   * @param {Array<Object>} componentInfo.events - Events emitted by the component
   * @param {Array<Object>} componentInfo.slots - Slots available in the component
   * @param {Array<Object>} componentInfo.methods - Public methods exposed by the component
   * @param {Array<string>} componentInfo.examples - Code examples of component usage
   * @param {string} [componentInfo.thumbnail] - URL to component thumbnail
   * @param {string} [componentInfo.documentation] - URL to detailed documentation
   * @param {Function} componentClass - The component class constructor
   * @returns {boolean} - True if registration successful
   */
  register(componentInfo, componentClass) {
    if (!componentInfo.name || !componentInfo.tagName) {
      console.error('Component registration failed: name and tagName are required');
      return false;
    }
    
    // Check if already registered
    if (this.components.has(componentInfo.name)) {
      console.error(`Component "${componentInfo.name}" is already registered`);
      return false;
    }
    
    // Add to categories
    if (componentInfo.category) {
      this.categories.add(componentInfo.category);
    }
    
    // Set default values for required properties
    const defaultedInfo = {
      name: componentInfo.name,
      tagName: componentInfo.tagName,
      category: componentInfo.category || 'Uncategorized',
      description: componentInfo.description || '',
      version: componentInfo.version || '1.0.0',
      author: componentInfo.author || 'Unknown',
      props: componentInfo.props || [],
      events: componentInfo.events || [],
      slots: componentInfo.slots || [],
      methods: componentInfo.methods || [],
      examples: componentInfo.examples || [],
      dateAdded: componentInfo.dateAdded || new Date().toISOString(),
      thumbnail: componentInfo.thumbnail || '',
      documentation: componentInfo.documentation || '',
    };
    
    // Register the component
    this.components.set(componentInfo.name, {
      info: defaultedInfo,
      class: componentClass
    });
    
    console.log(`Component "${componentInfo.name}" registered successfully`);
    
    // Dispatch a global event for component registration
    window.dispatchEvent(new CustomEvent('component-registered', {
      detail: {
        name: componentInfo.name,
        category: defaultedInfo.category,
        component: componentClass
      }
    }));
    
    return true;
  }
  
  /**
   * Get all registered components
   * 
   * @returns {Array<Object>} - Array of component metadata
   */
  getAllComponents() {
    return Array.from(this.components.values()).map(entry => entry.info);
  }
  
  /**
   * Get components by category
   * 
   * @param {string} category - Category name
   * @returns {Array<Object>} - Array of component metadata
   */
  getComponentsByCategory(category) {
    return Array.from(this.components.values())
      .filter(entry => entry.info.category === category)
      .map(entry => entry.info);
  }
  
  /**
   * Get all available categories
   * 
   * @returns {Array<string>} - Array of category names
   */
  getAllCategories() {
    return Array.from(this.categories);
  }
  
  /**
   * Find a component by its name
   * 
   * @param {string} name - Component name
   * @returns {Object|null} - Component metadata and class or null if not found
   */
  getComponent(name) {
    return this.components.get(name) || null;
  }
  
  /**
   * Find a component by its tag name
   * 
   * @param {string} tagName - HTML tag name for the component
   * @returns {Object|null} - Component metadata and class or null if not found
   */
  getComponentByTagName(tagName) {
    for (const [, component] of this.components) {
      if (component.info.tagName === tagName) {
        return component;
      }
    }
    return null;
  }
  
  /**
   * Search components by name, description, or category
   * 
   * @param {string} query - Search query
   * @returns {Array<Object>} - Array of matching component metadata
   */
  searchComponents(query) {
    if (!query) return this.getAllComponents();
    
    const lowerQuery = query.toLowerCase();
    return Array.from(this.components.values())
      .filter(entry => {
        const info = entry.info;
        return (
          info.name.toLowerCase().includes(lowerQuery) ||
          info.description.toLowerCase().includes(lowerQuery) ||
          info.category.toLowerCase().includes(lowerQuery)
        );
      })
      .map(entry => entry.info);
  }
}

// Create global singleton instance
const componentRegistry = new ComponentRegistry();

// Initialize custom elements registry watcher
const originalDefine = customElements.define;
customElements.define = function(name, constructor, options) {
  // Call original method
  originalDefine.call(this, name, constructor, options);
  
  // Auto-register components with minimal metadata
  // (can be enhanced later using the full register method)
  if (!Array.from(componentRegistry.components.values())
      .some(c => c.info.tagName === name)) {
    const componentName = name
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    
    componentRegistry.register({
      name: componentName,
      tagName: name,
      category: 'Uncategorized',
      description: `${componentName} component`,
      dateAdded: new Date().toISOString(),
    }, constructor);
  }
};

export default componentRegistry;
