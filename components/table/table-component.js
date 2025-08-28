// Table Web Component for Claude AI Website Builder
// A reusable, themeable and accessible data table component

class TableComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default state
    this._data = [];
    this._columns = [];
    this._sortBy = null;
    this._sortDirection = 'asc';
    this._page = 1;
    this._pageSize = 10;
    this._totalPages = 1;
    this._isPaginated = false;
    this._isSelectable = false;
    this._selectedRows = new Set();
  }
  
  // Lifecycle callbacks
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  
  disconnectedCallback() {
    this.removeEventListeners();
  }
  
  // Observed attributes
  static get observedAttributes() {
    return [
      'columns',
      'data',
      'sortable',
      'paginated',
      'page-size',
      'selectable',
      'striped',
      'bordered',
      'compact',
      'caption'
    ];
  }
  
  // Handle attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'columns':
        try {
          this._columns = JSON.parse(newValue);
          this.render();
        } catch (e) {
          console.error('Invalid columns format', e);
        }
        break;
        
      case 'data':
        try {
          this._data = JSON.parse(newValue);
          this._totalPages = this._isPaginated ? 
            Math.ceil(this._data.length / this._pageSize) : 1;
          this.render();
        } catch (e) {
          console.error('Invalid data format', e);
        }
        break;
        
      case 'sortable':
        this.render();
        break;
        
      case 'paginated':
        this._isPaginated = newValue !== null;
        this._totalPages = this._isPaginated ? 
          Math.ceil(this._data.length / this._pageSize) : 1;
        this.render();
        break;
        
      case 'page-size':
        this._pageSize = parseInt(newValue, 10) || 10;
        this._totalPages = this._isPaginated ? 
          Math.ceil(this._data.length / this._pageSize) : 1;
        this.render();
        break;
        
      case 'selectable':
        this._isSelectable = newValue !== null;
        this.render();
        break;
        
      case 'caption':
      case 'striped':
      case 'bordered':
      case 'compact':
        this.render();
        break;
    }
  }
  
  // Public API methods
  setData(data) {
    this._data = data;
    this._totalPages = this._isPaginated ? 
      Math.ceil(this._data.length / this._pageSize) : 1;
    this.render();
    
    // Dispatch data-changed event
    this.dispatchEvent(new CustomEvent('data-changed', {
      detail: { data },
      bubbles: true,
      composed: true
    }));
  }
  
  setColumns(columns) {
    this._columns = columns;
    this.render();
    
    // Dispatch columns-changed event
    this.dispatchEvent(new CustomEvent('columns-changed', {
      detail: { columns },
      bubbles: true,
      composed: true
    }));
  }
  
  sort(columnId, direction) {
    this._sortBy = columnId;
    this._sortDirection = direction || 'asc';
    this.sortData();
    this.render();
    
    // Dispatch sort-changed event
    this.dispatchEvent(new CustomEvent('sort-changed', {
      detail: { columnId, direction: this._sortDirection },
      bubbles: true,
      composed: true
    }));
  }
  
  goToPage(page) {
    if (page < 1 || page > this._totalPages) return;
    this._page = page;
    this.render();
    
    // Dispatch page-changed event
    this.dispatchEvent(new CustomEvent('page-changed', {
      detail: { page, totalPages: this._totalPages },
      bubbles: true,
      composed: true
    }));
  }
  
  getSelectedRows() {
    return Array.from(this._selectedRows).map(index => this._data[index]);
  }
  
  selectAll() {
    const startIdx = this._isPaginated ? (this._page - 1) * this._pageSize : 0;
    const endIdx = this._isPaginated ? 
      Math.min(startIdx + this._pageSize, this._data.length) : 
      this._data.length;
    
    for (let i = startIdx; i < endIdx; i++) {
      this._selectedRows.add(i);
    }
    
    this.render();
    
    // Dispatch selection-changed event
    this.dispatchEvent(new CustomEvent('selection-changed', {
      detail: { selectedRows: this.getSelectedRows() },
      bubbles: true,
      composed: true
    }));
  }
    deselectAll() {
    const startIdx = this._isPaginated ? (this._page - 1) * this._pageSize : 0;
    const endIdx = this._isPaginated ? 
      Math.min(startIdx + this._pageSize, this._data.length) : 
      this._data.length;
    
    // Remove only the rows visible on current page
    for (let i = startIdx; i < endIdx; i++) {
      this._selectedRows.delete(i);
    }
    
    this.render();
    
    // Dispatch selection-changed event
    this.dispatchEvent(new CustomEvent('selection-changed', {
      detail: { selectedRows: this.getSelectedRows() },
      bubbles: true,
      composed: true
    }));
  }
  
  // Private methods
  setupEventListeners() {
    this.shadowRoot.addEventListener('click', this.handleClick.bind(this));
  }
  
  removeEventListeners() {
    this.shadowRoot.removeEventListener('click', this.handleClick.bind(this));
  }
  
  handleClick(event) {
    const target = event.target;
    
    // Handle sort header click
    if (target.classList.contains('sort-header')) {
      const columnId = target.dataset.columnId;
      const newDirection = this._sortBy === columnId && this._sortDirection === 'asc' ? 'desc' : 'asc';
      this.sort(columnId, newDirection);
    }
    
    // Handle pagination click
    if (target.classList.contains('page-button')) {
      const page = parseInt(target.dataset.page, 10);
      this.goToPage(page);
    }
    
    // Handle checkbox selection
    if (target.classList.contains('row-select')) {
      const rowIndex = parseInt(target.dataset.index, 10);
      if (target.checked) {
        this._selectedRows.add(rowIndex);
      } else {
        this._selectedRows.delete(rowIndex);
      }
      
      // Dispatch selection-changed event
      this.dispatchEvent(new CustomEvent('selection-changed', {
        detail: { selectedRows: this.getSelectedRows() },
        bubbles: true,
        composed: true
      }));
    }
    
    // Handle header checkbox (select all)
    if (target.classList.contains('select-all')) {
      if (target.checked) {
        this.selectAll();
      } else {
        this.deselectAll();
      }
    }
  }
  
  sortData() {
    if (!this._sortBy) return;
    
    const column = this._columns.find(col => col.id === this._sortBy);
    if (!column) return;
    
    const sortFn = column.sortFn || this.defaultSortFn;
    const direction = this._sortDirection === 'asc' ? 1 : -1;
    
    this._data.sort((a, b) => {
      return sortFn(a[this._sortBy], b[this._sortBy]) * direction;
    });
  }
  
  defaultSortFn(a, b) {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    } else {
      return a - b;
    }
  }
  
  getCurrentPageData() {
    if (!this._isPaginated) return this._data;
    
    const startIdx = (this._page - 1) * this._pageSize;
    const endIdx = Math.min(startIdx + this._pageSize, this._data.length);
    return this._data.slice(startIdx, endIdx);
  }
  
  renderSortIcon(column) {
    if (this._sortBy !== column.id) {
      return '<span class="sort-icon">↕</span>';
    }
    
    return this._sortDirection === 'asc' ? 
      '<span class="sort-icon">↑</span>' : 
      '<span class="sort-icon">↓</span>';
  }
  
  renderTableHeader() {
    if (!this._columns.length) return '';
    
    const isSortable = this.hasAttribute('sortable');
    const selectColumn = this._isSelectable ? 
      '<th class="select-column"><input type="checkbox" class="select-all" aria-label="Select all rows"></th>' : '';
    
    const headers = this._columns.map(column => {
      const sortClass = isSortable && column.sortable !== false ? 'sort-header' : '';
      const sortAttr = sortClass ? `data-column-id="${column.id}"` : '';
      const sortIcon = isSortable && sortClass && column.sortable !== false ? 
        this.renderSortIcon(column) : '';
      
      return `<th class="${sortClass}" ${sortAttr}>${column.label} ${sortIcon}</th>`;
    }).join('');
    
    return `
      <thead>
        <tr>
          ${selectColumn}
          ${headers}
        </tr>
      </thead>
    `;
  }
  
  renderTableBody() {
    const pageData = this.getCurrentPageData();
    if (!pageData.length) {
      return `
        <tbody>
          <tr>
            <td colspan="${this._isSelectable ? this._columns.length + 1 : this._columns.length}" class="no-data">No data available</td>
          </tr>
        </tbody>
      `;
    }
    
    const rows = pageData.map((row, idx) => {
      const actualIndex = this._isPaginated ? (this._page - 1) * this._pageSize + idx : idx;
      const isSelected = this._selectedRows.has(actualIndex);
      const selectCell = this._isSelectable ? 
        `<td class="select-column">
           <input type="checkbox" class="row-select" data-index="${actualIndex}" 
             ${isSelected ? 'checked' : ''} aria-label="Select row">
         </td>` : '';
      
      const cells = this._columns.map(column => {
        const cellData = row[column.id] !== undefined ? row[column.id] : '';
        const cellRenderer = column.renderer || (data => String(data));
        return `<td>${cellRenderer(cellData, row)}</td>`;
      }).join('');
      
      return `
        <tr class="${isSelected ? 'selected' : ''}">
          ${selectCell}
          ${cells}
        </tr>
      `;
    }).join('');
    
    return `<tbody>${rows}</tbody>`;
  }
  
  renderPagination() {
    if (!this._isPaginated || this._totalPages <= 1) return '';
    
    let pages = '';
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, this._page - halfVisible);
    const endPage = Math.min(this._totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pages += `
      <button class="page-button prev" data-page="${this._page - 1}" 
        ${this._page === 1 ? 'disabled' : ''} aria-label="Previous page">
        &laquo;
      </button>
    `;
    
    // First page button if not visible
    if (startPage > 1) {
      pages += `
        <button class="page-button" data-page="1">1</button>
        ${startPage > 2 ? '<span class="page-ellipsis">...</span>' : ''}
      `;
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages += `
        <button class="page-button ${i === this._page ? 'current' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }
    
    // Last page button if not visible
    if (endPage < this._totalPages) {
      pages += `
        ${endPage < this._totalPages - 1 ? '<span class="page-ellipsis">...</span>' : ''}
        <button class="page-button" data-page="${this._totalPages}">${this._totalPages}</button>
      `;
    }
    
    // Next button
    pages += `
      <button class="page-button next" data-page="${this._page + 1}" 
        ${this._page === this._totalPages ? 'disabled' : ''} aria-label="Next page">
        &raquo;
      </button>
    `;
    
    return `
      <div class="pagination" role="navigation" aria-label="Pagination">
        <div class="pagination-info">
          Showing ${(this._page - 1) * this._pageSize + 1} to 
          ${Math.min(this._page * this._pageSize, this._data.length)} of ${this._data.length} entries
        </div>
        <div class="pagination-controls">${pages}</div>
      </div>
    `;
  }
  
  render() {
    const striped = this.hasAttribute('striped') ? 'striped' : '';
    const bordered = this.hasAttribute('bordered') ? 'bordered' : '';
    const compact = this.hasAttribute('compact') ? 'compact' : '';
    const caption = this.getAttribute('caption') || '';
    
    const captionHtml = caption ? `<caption>${caption}</caption>` : '';
    const tableHeader = this.renderTableHeader();
    const tableBody = this.renderTableBody();
    const pagination = this.renderPagination();
    
    this.shadowRoot.innerHTML = `      <style>
        :host {
          display: block;
          font-family: var(--table-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif);
          --table-border-color: var(--border-color, #ddd);
          --table-header-bg: var(--primary-color-light, #f5f5f5);
          --table-header-color: var(--primary-color-dark, #333);
          --table-bg-color: var(--card-background, #fff);
          --table-text-color: var(--text-color, #333);
          --table-stripe-color: var(--background-color, #f9f9f9);
          --table-hover-color: var(--primary-color-light, rgba(0, 0, 0, 0.05));
          --table-selected-color: var(--primary-color-light, #e8f0fe);
          --table-sort-icon-color: var(--primary-color, #333);
          --table-pagination-active: var(--primary-color, #0d6efd);
          --table-pagination-hover: var(--primary-color-light, #e9ecef);
          --table-font-size: var(--font-size, 0.9rem);
        }

        /* Dark mode support */
        :host-context([data-theme="dark"]) {
          --table-border-color: #404040;
          --table-header-bg: #2d2d2d;
          --table-header-color: #e0e0e0;
          --table-bg-color: #1a1a1a;
          --table-text-color: #e0e0e0;
          --table-stripe-color: #262626;
          --table-hover-color: rgba(255, 255, 255, 0.05);
          --table-selected-color: rgba(59, 130, 246, 0.2);
          --table-sort-icon-color: #e0e0e0;
          --table-pagination-active: #4f92ff;
          --table-pagination-hover: #333;
        }

        /* Cyberpunk theme support */
        :host-context([data-theme="cyberpunk"]) {
          --table-border-color: #00ff88;
          --table-header-bg: #0a0a0a;
          --table-header-color: #00ff88;
          --table-bg-color: #000;
          --table-text-color: #00ff88;
          --table-stripe-color: rgba(0, 255, 136, 0.05);
          --table-hover-color: rgba(0, 255, 136, 0.1);
          --table-selected-color: rgba(0, 255, 136, 0.2);
        }
        
        .table-container {
          width: 100%;
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
          color: var(--table-text-color);
          font-size: var(--table-font-size);
          background-color: var(--table-bg-color);
        }
        
        caption {
          padding: 0.75rem;
          caption-side: top;
          text-align: left;
          font-weight: bold;
          color: var(--table-header-color);
        }
        
        th, td {
          padding: 0.75rem;
          text-align: left;
          vertical-align: top;
          border-bottom: 1px solid var(--table-border-color);
        }
        
        th {
          background-color: var(--table-header-bg);
          color: var(--table-header-color);
          font-weight: 600;
          vertical-align: bottom;
          border-bottom: 2px solid var(--table-border-color);
        }
        
        .sort-header {
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
        }
        
        .sort-header:hover {
          background-color: var(--table-hover-color);
        }
        
        .sort-icon {
          margin-left: 5px;
          color: var(--table-sort-icon-color);
        }
        
        tbody tr:hover {
          background-color: var(--table-hover-color);
        }
        
        tr.selected {
          background-color: var(--table-selected-color);
        }
        
        tr.selected:hover {
          background-color: var(--table-selected-color);
        }
        
        .no-data {
          text-align: center;
          padding: 2rem;
          color: var(--text-color-secondary, #666);
          font-style: italic;
        }
          /* Striped rows */
        table.striped tbody tr:nth-child(odd) {
          background-color: var(--table-stripe-bg, var(--table-stripe-color));
        }
        
        table.striped tbody tr:nth-child(odd).selected {
          background-color: var(--table-selected-color);
        }
        
        /* Ensure consistent stripe color with primary theme */
        table.striped tbody tr:nth-child(odd):hover {
          background-color: var(--table-hover-color);
        }
        
        /* Bordered table */
        table.bordered th,
        table.bordered td {
          border: 1px solid var(--table-border-color);
        }
        
        /* Compact layout */
        table.compact th,
        table.compact td {
          padding: 0.3rem;
        }
        
        /* Selection column */
        .select-column {
          width: 40px;
          text-align: center;
        }
        
        /* Pagination styles */
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .pagination-info {
          color: var(--text-color-secondary, #666);
          font-size: 0.9em;
        }
        
        .pagination-controls {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }
        
        .page-button {
          padding: 0.375rem 0.75rem;
          border: 1px solid var(--table-border-color);
          background-color: var(--table-bg-color);
          color: var(--text-color);
          border-radius: 4px;
          cursor: pointer;
          min-width: 38px;
          text-align: center;
          font-family: inherit;
        }
        
        .page-button:hover:not(:disabled):not(.current) {
          background-color: var(--table-pagination-hover);
        }
        
        .page-button.current {
          background-color: var(--table-pagination-active);
          color: white;
          border-color: var(--table-pagination-active);
        }
        
        .page-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .page-ellipsis {
          padding: 0.375rem 0.5rem;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .pagination {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .pagination-controls {
            overflow-x: auto;
            max-width: 100%;
          }
        }

        /* Additional accessibility features */
        button:focus,
        input:focus {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }
      </style>
      
      <div class="table-container">
        <table class="${striped} ${bordered} ${compact}">
          ${captionHtml}
          ${tableHeader}
          ${tableBody}
        </table>
      </div>
      ${pagination}
    `;
  }
}

// Register the web component
customElements.define('table-component', TableComponent);

export default TableComponent;
