// Component Catalog UI for Claude AI Website Builder
// A visual interface to browse and use available components

import componentRegistry from '../registry/component-registry.js';

class ComponentCatalog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // State
    this._selectedCategory = 'All';
    this._searchQuery = '';
    this._components = [];
    this._filteredComponents = [];
    this._categories = [];
  }
  
  connectedCallback() {
    // Initialize data
    this._components = componentRegistry.getAllComponents();
    this._categories = ['All', ...componentRegistry.getAllCategories()];
    this._filteredComponents = [...this._components];
    
    // Render initial view
    this.render();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Listen for new component registrations
    window.addEventListener('component-registered', this.handleComponentRegistered.bind(this));
  }
  
  disconnectedCallback() {
    window.removeEventListener('component-registered', this.handleComponentRegistered.bind(this));
  }
  
  static get observedAttributes() {
    return ['filter-category', 'default-view'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'filter-category':
        if (this._categories.includes(newValue)) {
          this._selectedCategory = newValue;
          this.filterComponents();
        }
        break;
        
      case 'default-view':
        // Update default view mode (grid, list, detailed)
        this.render();
        break;
    }
  }
  
  handleComponentRegistered(event) {
    // Update component list when new components are registered
    this._components = componentRegistry.getAllComponents();
    this._categories = ['All', ...componentRegistry.getAllCategories()];
    this.filterComponents();
    this.render();
  }
  
  setupEventListeners() {
    // Search input handler
    const searchInput = this.shadowRoot.querySelector('#component-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this._searchQuery = e.target.value;
        this.filterComponents();
      });
    }
    
    // Category filter handlers
    const categoryFilters = this.shadowRoot.querySelector('.category-filters');
    if (categoryFilters) {
      categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-filter')) {
          this._selectedCategory = e.target.dataset.category;
          this.filterComponents();
          
          // Update active category
          categoryFilters.querySelectorAll('.category-filter').forEach(button => {
            button.classList.toggle('active', button.dataset.category === this._selectedCategory);
          });
        }
      });
    }
  }
  
  filterComponents() {
    // Filter by category first
    let filtered = this._components;
    
    if (this._selectedCategory !== 'All') {
      filtered = filtered.filter(comp => comp.category === this._selectedCategory);
    }
    
    // Then filter by search query
    if (this._searchQuery) {
      const query = this._searchQuery.toLowerCase();
      filtered = filtered.filter(comp => 
        comp.name.toLowerCase().includes(query) || 
        comp.description.toLowerCase().includes(query));
    }
    
    this._filteredComponents = filtered;
    
    // Update displayed components without full re-render
    this.updateComponentGrid();
  }
  
  updateComponentGrid() {
    const grid = this.shadowRoot.querySelector('.component-grid');
    if (!grid) return;
    
    if (this._filteredComponents.length === 0) {
      grid.innerHTML = `
        <div class="no-components">
          <p>No components found matching your criteria</p>
        </div>
      `;
      return;
    }
    
    grid.innerHTML = this._filteredComponents.map(component => this.renderComponentCard(component)).join('');
    
    // Re-attach event listeners for component cards
    grid.querySelectorAll('.component-card').forEach(card => {
      card.addEventListener('click', () => {
        this.showComponentDetails(card.dataset.componentName);
      });
    });
  }
  
  renderComponentCard(component) {
    const thumbnailHtml = component.thumbnail ? 
      `<img src="${component.thumbnail}" alt="${component.name}" class="component-thumbnail">` :
      `<div class="component-thumbnail placeholder">
         <span class="component-icon">${component.name.charAt(0)}</span>
       </div>`;
    
    return `
      <div class="component-card" data-component-name="${component.name}">
        ${thumbnailHtml}
        <div class="component-info">
          <h3 class="component-name">${component.name}</h3>
          <span class="component-category">${component.category}</span>
          <p class="component-description">${component.description}</p>
        </div>
      </div>
    `;
  }
  
  showComponentDetails(componentName) {
    const component = componentRegistry.getComponent(componentName);
    if (!component) return;
    
    const info = component.info;
    
    // Create modal for component details
    const modal = document.createElement('div');
    modal.className = 'component-details-modal';
    
    // Prepare property documentation
    const propsTable = info.props.length > 0 ? `
      <table class="properties-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${info.props.map(prop => `
            <tr>
              <td>${prop.name}</td>
              <td><code>${prop.type}</code></td>
              <td>${prop.default !== undefined ? `<code>${prop.default}</code>` : '-'}</td>
              <td>${prop.description}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p>No properties documented.</p>';
    
    // Prepare events documentation
    const eventsTable = info.events.length > 0 ? `
      <table class="events-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Detail</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${info.events.map(event => `
            <tr>
              <td>${event.name}</td>
              <td>${event.detail ? `<code>${event.detail}</code>` : '-'}</td>
              <td>${event.description}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p>No events documented.</p>';
    
    // Prepare methods documentation
    const methodsTable = info.methods.length > 0 ? `
      <table class="methods-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Parameters</th>
            <th>Returns</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${info.methods.map(method => `
            <tr>
              <td>${method.name}</td>
              <td>${method.params ? `<code>${method.params}</code>` : '-'}</td>
              <td>${method.returns ? `<code>${method.returns}</code>` : '-'}</td>
              <td>${method.description}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p>No methods documented.</p>';
    
    // Prepare examples section
    const examplesSection = info.examples.length > 0 ? `
      <div class="component-examples">
        <h3>Examples</h3>
        ${info.examples.map((example, index) => `
          <div class="example">
            <h4>Example ${index + 1}</h4>
            <pre><code>${example}</code></pre>
            <button class="copy-example-btn" data-example="${index}">Copy</button>
          </div>
        `).join('')}
      </div>
    ` : '';
    
    // Complete modal content
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${info.name}</h2>
          <button class="close-modal-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="component-meta">
            <span class="component-tag">Tag: <code>&lt;${info.tagName}&gt;</code></span>
            <span class="component-version">Version: ${info.version}</span>
            <span class="component-author">By: ${info.author}</span>
            <span class="component-added">Added: ${new Date(info.dateAdded).toLocaleDateString()}</span>
          </div>
          
          <p class="component-description">${info.description}</p>
          
          <div class="component-preview">
            <h3>Preview</h3>
            <div class="preview-container" id="component-preview-container">
              <!-- Component instance will be rendered here -->
            </div>
          </div>
          
          <div class="component-usage">
            <h3>Usage</h3>
            <pre><code>&lt;${info.tagName}&gt;&lt;/${info.tagName}&gt;</code></pre>
            <button class="copy-usage-btn">Copy</button>
          </div>
          
          <div class="component-tabs">
            <div class="tabs-header">
              <button class="tab-btn active" data-tab="properties">Properties</button>
              <button class="tab-btn" data-tab="events">Events</button>
              <button class="tab-btn" data-tab="methods">Methods</button>
              ${info.slots.length > 0 ? '<button class="tab-btn" data-tab="slots">Slots</button>' : ''}
            </div>
            
            <div class="tab-content active" id="properties-tab">
              <h3>Properties</h3>
              ${propsTable}
            </div>
            
            <div class="tab-content" id="events-tab">
              <h3>Events</h3>
              ${eventsTable}
            </div>
            
            <div class="tab-content" id="methods-tab">
              <h3>Methods</h3>
              ${methodsTable}
            </div>
            
            ${info.slots.length > 0 ? `
              <div class="tab-content" id="slots-tab">
                <h3>Slots</h3>
                <ul class="slots-list">
                  ${info.slots.map(slot => `
                    <li>
                      <code>${slot.name || 'default'}</code> - ${slot.description}
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
          
          ${examplesSection}
          
          ${info.documentation ? `
            <div class="component-documentation">
              <a href="${info.documentation}" target="_blank" class="documentation-link">
                View Full Documentation
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // Append modal to shadow DOM
    this.shadowRoot.appendChild(modal);
    
    // Setup modal event listeners
    const closeBtn = modal.querySelector('.close-modal-btn');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    // Setup tabs
    const tabButtons = modal.querySelectorAll('.tab-btn');
    const tabContents = modal.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        
        // Update active tab button
        tabButtons.forEach(btn => {
          btn.classList.toggle('active', btn === button);
        });
        
        // Show active tab content
        tabContents.forEach(content => {
          content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
      });
    });
    
    // Handle copy buttons
    const copyUsageBtn = modal.querySelector('.copy-usage-btn');
    copyUsageBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(`<${info.tagName}></${info.tagName}>`);
      this.showToast('Usage copied to clipboard');
    });
    
    const copyExampleBtns = modal.querySelectorAll('.copy-example-btn');
    copyExampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const exampleIndex = parseInt(btn.dataset.example, 10);
        navigator.clipboard.writeText(info.examples[exampleIndex]);
        this.showToast('Example copied to clipboard');
      });
    });
    
    // Create an instance of the component for the preview
    setTimeout(() => {
      const previewContainer = modal.querySelector('#component-preview-container');
      try {
        const componentInstance = document.createElement(info.tagName);
        previewContainer.appendChild(componentInstance);
      } catch (error) {
        previewContainer.innerHTML = `
          <div class="preview-error">
            <p>Error creating component preview</p>
            <pre>${error.message}</pre>
          </div>
        `;
      }
    }, 0);
    
    // Close when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
  
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    this.shadowRoot.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }, 0);
  }
  
  render() {
    // Generate category filter buttons
    const categoryFilters = this._categories.map(category => `
      <button class="category-filter ${category === this._selectedCategory ? 'active' : ''}" 
        data-category="${category}">
        ${category}
      </button>
    `).join('');
    
    // Generate component cards
    const componentCards = this._filteredComponents.length > 0 ?
      this._filteredComponents.map(component => this.renderComponentCard(component)).join('') :
      `<div class="no-components">
         <p>No components found</p>
       </div>`;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif);
          color: var(--text-color, #333);
        }
        
        .component-catalog {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }
        
        .catalog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .catalog-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }
        
        .search-container {
          position: relative;
          flex-grow: 1;
          max-width: 400px;
        }
        
        .search-container input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 4px;
          font-size: 0.9rem;
          background-color: var(--card-background, white);
          color: var(--text-color, #333);
        }
        
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-color-secondary, #666);
        }
        
        .category-filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        
        .category-filter {
          padding: 0.5rem 1rem;
          background-color: var(--card-background, white);
          border: 1px solid var(--border-color, #ddd);
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        
        .category-filter:hover {
          background-color: var(--primary-color-light, #f0f0f0);
        }
        
        .category-filter.active {
          background-color: var(--primary-color, #0d6efd);
          color: white;
          border-color: var(--primary-color, #0d6efd);
        }
        
        .component-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .component-card {
          border: 1px solid var(--border-color, #ddd);
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          background-color: var(--card-background, white);
        }
        
        .component-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        
        .component-thumbnail {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
          background-color: var(--primary-color-light, #f0f0f0);
        }
        
        .component-thumbnail.placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .component-icon {
          font-size: 3rem;
          color: var(--primary-color, #0d6efd);
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          background-color: var(--card-background, white);
        }
        
        .component-info {
          padding: 1rem;
        }
        
        .component-name {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
        }
        
        .component-category {
          font-size: 0.8rem;
          color: var(--text-color-secondary, #666);
          background-color: var(--background-color, #f5f5f5);
          padding: 0.25rem 0.5rem;
          border-radius: 100px;
          display: inline-block;
          margin-bottom: 0.75rem;
        }
        
        .component-description {
          font-size: 0.9rem;
          margin: 0;
          color: var(--text-color-secondary, #666);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .no-components {
          grid-column: 1 / -1;
          padding: 3rem;
          text-align: center;
          color: var(--text-color-secondary, #666);
          background-color: var(--background-color, #f5f5f5);
          border-radius: 8px;
        }
        
        .component-details-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          z-index: 1000;
          padding: 2rem;
          overflow-y: auto;
        }
        
        .modal-content {
          background-color: var(--card-background, white);
          border-radius: 8px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color, #ddd);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background-color: var(--card-background, white);
          z-index: 10;
        }
        
        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }
        
        .close-modal-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          color: var(--text-color-secondary, #666);
        }
        
        .modal-body {
          padding: 1.5rem;
        }
        
        .component-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        
        .component-meta span {
          color: var(--text-color-secondary, #666);
        }
        
        .component-preview {
          margin: 1.5rem 0;
        }
        
        .preview-container {
          padding: 2rem;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 8px;
          background-color: var(--background-color, #f5f5f5);
          min-height: 100px;
        }
        
        .preview-error {
          color: #dc3545;
          font-size: 0.9rem;
        }
        
        .component-usage {
          margin: 1.5rem 0;
          position: relative;
        }
        
        .component-usage pre {
          background-color: var(--background-color, #f5f5f5);
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          margin: 0;
        }
        
        .component-usage code {
          font-family: monospace;
        }
        
        .copy-usage-btn,
        .copy-example-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: var(--primary-color, #0d6efd);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          cursor: pointer;
        }
        
        .component-tabs {
          margin: 2rem 0;
        }
        
        .tabs-header {
          display: flex;
          border-bottom: 1px solid var(--border-color, #ddd);
          margin-bottom: 1rem;
        }
        
        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 500;
        }
        
        .tab-btn.active {
          border-color: var(--primary-color, #0d6efd);
          color: var(--primary-color, #0d6efd);
        }
        
        .tab-content {
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.9rem;
        }
        
        table th, table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color, #ddd);
        }
        
        table th {
          background-color: var(--background-color, #f5f5f5);
          font-weight: 600;
        }
        
        .slots-list {
          padding-left: 1.5rem;
        }
        
        .slots-list li {
          margin-bottom: 0.5rem;
        }
        
        .component-examples {
          margin: 2rem 0;
        }
        
        .example {
          position: relative;
          margin: 1.5rem 0;
        }
        
        .example h4 {
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        
        .example pre {
          background-color: var(--background-color, #f5f5f5);
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          margin: 0;
          position: relative;
        }
        
        .documentation-link {
          display: inline-block;
          color: var(--primary-color, #0d6efd);
          text-decoration: none;
          margin-top: 1.5rem;
          font-weight: 500;
          padding: 0.5rem 0;
          border-bottom: 1px solid currentColor;
        }
        
        .toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%) translateY(100%);
          background-color: var(--primary-color, #0d6efd);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          opacity: 0;
          transition: transform 0.3s, opacity 0.3s;
          z-index: 2000;
        }
        
        .toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .component-grid {
            grid-template-columns: 1fr;
          }
          
          .component-details-modal {
            padding: 0;
          }
          
          .modal-content {
            border-radius: 0;
            max-height: 100vh;
            height: 100vh;
            max-width: 100%;
          }
          
          .tabs-header {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          
          .tab-btn {
            padding: 0.5rem 1rem;
          }
          
          .component-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      </style>
      
      <div class="component-catalog">
        <div class="catalog-header">
          <h2 class="catalog-title">Component Catalog</h2>
          
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input type="text" id="component-search" placeholder="Search components..." 
              value="${this._searchQuery}">
          </div>
        </div>
        
        <div class="category-filters">
          ${categoryFilters}
        </div>
        
        <div class="component-grid">
          ${componentCards}
        </div>
      </div>
    `;
    
    // Re-attach event listeners
    this.setupEventListeners();
  }
}

// Register the web component
customElements.define('component-catalog', ComponentCatalog);

export default ComponentCatalog;
