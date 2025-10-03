/**
 * @file site-search.ts
 * @description Main search plugin implementation for the website builder
 * @module plugins/search/site-search
 */

/**
 * SearchPlugin interface for configuring the search functionality
 */
interface SearchConfig {
  enabled: boolean;
  placement?: 'navigation' | 'footer' | 'floating';
  buttonText?: string;
  buttonIcon?: string;
  placeholder?: string;
  indexContent?: boolean;
  searchableElements?: string[];
  highlightResults?: boolean;
  minQueryLength?: number;
  maxResults?: number;
  fuzzySearch?: boolean;
  excludeSections?: string[];
  categories?: SearchCategory[];
  styles?: SearchStyles;
  debug?: boolean;
  analytics?: SearchAnalyticsConfig;
  boostFactors?: Record<string, number>;
}

/**
 * Search category for grouping search results
 */
interface SearchCategory {
  name: string;
  icon: string;
  filter: string;
  description: string;
}

/**
 * Custom styles for the search modal
 */
interface SearchStyles {
  modalBackground?: string;
  inputBorderColor?: string;
  resultHoverColor?: string;
  highlightColor?: string;
}

/**
 * Analytics configuration for search usage tracking
 */
interface SearchAnalyticsConfig {
  enabled: boolean;
  trackQueries?: boolean;
  trackClicks?: boolean;
  storageMethod?: 'localStorage' | 'server' | 'none';
}

/**
 * Indexed content item for searching
 */
interface IndexedItem {
  id: string;
  sectionId: string;
  sectionTitle: string;
  elementType: string;
  content: string;
  boost: number;
  href: string;
  parentSection?: string;
}

/**
 * Search result item from a search query
 */
interface SearchResult {
  id: string;
  sectionId: string;
  sectionTitle: string;
  elementType: string;
  matchedText: string;
  relevance: number;
  href: string;
  originalContent: string;
  highlightedContent?: string;
}

/**
 * Custom search handler for specialized content
 */
interface SearchHandler {
  name: string;
  filter: (query: string, callback: (results: SearchResult[]) => void) => void;
}

/**
 * WebsiteBuilder namespace for plugins
 */
interface WebsiteBuilderNamespace {
  Plugins: {
    Search: SiteSearch;
  };
}

// Create namespace if it doesn't exist
declare global {
  interface Window {
    WebsiteBuilder: WebsiteBuilderNamespace;
    siteContent?: any; // Site content from site-content.json
  }
}

// Initialize namespace if not already defined
window.WebsiteBuilder = window.WebsiteBuilder || { Plugins: { Search: {} as SiteSearch } };

/**
 * Site Search class - Main implementation of the search functionality
 */
class SiteSearch {
  private config: SearchConfig;
  private contentIndex: IndexedItem[] = [];
  private searchHandlers: SearchHandler[] = [];
  private searchModal: HTMLElement | null = null;
  private resultsCache: Map<string, SearchResult[]> = new Map();
  private isInitialized: boolean = false;
  private lastQuery: string = '';
  private searchDebounceTimer: number | null = null;

  /**
   * Constructor for the SiteSearch class
   * @param {SearchConfig} config - Configuration for the search plugin
   */
  constructor(config?: Partial<SearchConfig>) {
    // Default configuration
    this.config = {
      enabled: false,
      placement: 'navigation',
      buttonText: 'Search',
      buttonIcon: '🔍',
      placeholder: 'Search website...',
      indexContent: true,
      searchableElements: ['title', 'subtitle', 'description', 'content', 'items'],
      highlightResults: true,
      minQueryLength: 2,
      maxResults: 10,
      fuzzySearch: true,
      excludeSections: [],
      debug: false,
      ...config
    };
    
    // Make available globally
    window.WebsiteBuilder.Plugins.Search = this;
  }

  /**
   * Initialize the search plugin
   * @returns {SiteSearch} - The initialized SiteSearch instance
   */
  initialize(): SiteSearch {
    // Only initialize if enabled
    if (!this.config.enabled) {
      if (this.config.debug) {
        console.log('Search plugin is disabled');
      }
      return this;
    }

    // Check if already initialized
    if (this.isInitialized) {
      if (this.config.debug) {
        console.log('Search plugin is already initialized');
      }
      return this;
    }

    // Create index when the DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.createSearchIndex());
    } else {
      this.createSearchIndex();
    }

    // Bind event listeners for search buttons
    this.bindSearchButtonEvents();
    
    this.isInitialized = true;
    
    if (this.config.debug) {
      console.log('Search plugin initialized with config:', this.config);
    }
    
    return this;
  }

  /**
   * Create the search index from site content
   */
  private createSearchIndex(): void {
    if (!window.siteContent) {
      console.error('Site content not found. Unable to create search index.');
      return;
    }

    try {
      const { sections } = window.siteContent;
      
      // Clear existing index
      this.contentIndex = [];
      
      // Index each section
      Object.entries(sections).forEach(([sectionId, sectionData]: [string, any]) => {
        // Skip excluded sections
        if (this.config.excludeSections?.includes(sectionId)) {
          return;
        }
        
        const sectionTitle = sectionData.title || this.capitalizeFirstLetter(sectionId);
        
        // Index the section title
        this.contentIndex.push({
          id: `${sectionId}-title`,
          sectionId,
          sectionTitle,
          elementType: 'title',
          content: sectionTitle,
          boost: this.getBoostFactor('title', sectionId),
          href: `#${sectionId}`
        });
        
        // Index searchable elements based on configuration
        this.indexSectionElements(sectionId, sectionData, sectionTitle);
      });

      if (this.config.debug) {
        console.log(`Search index created with ${this.contentIndex.length} items`);
      }
      
    } catch (error) {
      console.error('Error creating search index:', error);
    }
  }

  /**
   * Index all searchable elements in a section
   * @param {string} sectionId - The ID of the section
   * @param {any} sectionData - The section data
   * @param {string} sectionTitle - The title of the section
   */
  private indexSectionElements(sectionId: string, sectionData: any, sectionTitle: string): void {
    if (!sectionData || typeof sectionData !== 'object') return;
    
    // Recursively process all properties in the section data
    Object.entries(sectionData).forEach(([key, value]: [string, any]) => {
      // Skip if the key is not in searchable elements
      if (!this.config.searchableElements?.includes(key)) return;
      
      if (typeof value === 'string') {
        // Index string values
        this.contentIndex.push({
          id: `${sectionId}-${key}`,
          sectionId,
          sectionTitle,
          elementType: key,
          content: value,
          boost: this.getBoostFactor(key, sectionId),
          href: `#${sectionId}`
        });
      } else if (Array.isArray(value)) {
        // Index array items (like features, services, etc.)
        value.forEach((item, index): any => {
          if (typeof item === 'object') {
            // Index object properties in arrays
            Object.entries(item).forEach(([itemKey, itemValue]): any => {
              if (typeof itemValue === 'string') {
                this.contentIndex.push({
                  id: `${sectionId}-${key}-${index}-${itemKey}`,
                  sectionId,
                  sectionTitle,
                  elementType: `${key}.${itemKey}`,
                  content: itemValue,
                  boost: this.getBoostFactor(itemKey, sectionId),
                  href: `#${sectionId}`
                });
              }
            });
          } else if (typeof item === 'string') {
            // Index string items in arrays
            this.contentIndex.push({
              id: `${sectionId}-${key}-${index}`,
              sectionId,
              sectionTitle,
              elementType: key,
              content: item,
              boost: this.getBoostFactor(key, sectionId),
              href: `#${sectionId}`
            });
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        // Recursively process nested objects
        Object.entries(value).forEach(([nestedKey, nestedValue]): any => {
          if (typeof nestedValue === 'string') {
            this.contentIndex.push({
              id: `${sectionId}-${key}-${nestedKey}`,
              sectionId,
              sectionTitle,
              elementType: `${key}.${nestedKey}`,
              content: nestedValue,
              boost: this.getBoostFactor(nestedKey, sectionId),
              href: `#${sectionId}`
            });
          }
        });
      }
    });
  }

  /**
   * Get boost factor for a specific element type and section
   * @param {string} elementType - The type of element
   * @param {string} sectionId - The section ID
   * @returns {number} - The boost factor
   */
  private getBoostFactor(elementType: string, sectionId: string): number {
    // Check section-specific boost factor
    if (this.config.boostFactors?.[sectionId]) {
      return this.config.boostFactors[sectionId];
    }
    
    // Check element-type boost factor
    if (this.config.boostFactors?.[elementType]) {
      return this.config.boostFactors[elementType];
    }
    
    // Default boost factors
    switch (elementType) {
      case 'title': return 2.0;
      case 'subtitle': return 1.5;
      case 'heading': return 1.3;
      case 'description': return 1.2;
      default: return 1.0;
    }
  }

  /**
   * Bind event listeners to search buttons
   */
  private bindSearchButtonEvents(): void {
    // Wait for DOM to be loaded
    document.addEventListener('DOMContentLoaded', (): any => {
      // Find search buttons based on placement
      const searchButtons = document.querySelectorAll('[data-action="open-search"]');
      searchButtons.forEach(button => {
        button.addEventListener('click', () => this.openModal());
      });
      
      // Check for navigation search button
      if (this.config.placement === 'navigation') {
        const navSearchButtons = Array.from(document.querySelectorAll('nav a, nav button'))
          .filter(el => el.textContent?.includes(this.config.buttonText || 'Search'));
        
        navSearchButtons.forEach(button => {
          button.addEventListener('click', (e): any => {
            e.preventDefault();
            this.openModal();
          });
        });
      }
      
      // If floating button is enabled, create it
      if (this.config.placement === 'floating') {
        this.createFloatingSearchButton();
      }
    });
  }

  /**
   * Create a floating search button
   */
  private createFloatingSearchButton(): void {
    const floatingButton = document.createElement('button');
    floatingButton.className = 'floating-search-button';
    floatingButton.innerHTML = this.config.buttonIcon || '🔍';
    floatingButton.setAttribute('title', this.config.buttonText || 'Search');
    
    const style = document.createElement('style');
    style.textContent = `
      .floating-search-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: var(--primary, #007bff);
        color: white;
        border: none;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        z-index: 999;
        transition: all 0.2s ease;
      }
      
      .floating-search-button:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(floatingButton);
    
    floatingButton.addEventListener('click', () => this.openModal());
  }

  /**
   * Open the search modal
   */
  openModal(): void {
    // If modal already exists, don't create another one
    if (this.searchModal) {
      this.searchModal.style.display = 'flex';
      const searchInput = this.searchModal.querySelector('.search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
      return;
    }
    
    // Create search modal
    this.searchModal = document.createElement('div');
    this.searchModal.className = 'search-modal';
    
    // Apply custom styles if provided
    if (this.config.styles?.modalBackground) {
      this.searchModal.style.backgroundColor = this.config.styles.modalBackground;
    }
    
    this.searchModal.innerHTML = `
      <div class="search-container">
        <input type="text" class="search-input" placeholder="${this.config.placeholder || 'Search website...'}">
        <button class="close-search">Close</button>
        <div class="search-categories"></div>
        <div class="search-results"></div>
      </div>
    `;
    
    // Add categories if defined
    if (this.config.categories && this.config.categories.length > 0) {
      this.renderSearchCategories();
    }
    
    // Add style for the modal
    const style = document.createElement('style');
    style.textContent = this.getSearchModalStyles();
    document.head.appendChild(style);
    
    document.body.appendChild(this.searchModal);
    
    // Get elements
    const searchInput = this.searchModal.querySelector('.search-input') as HTMLInputElement;
    const closeButton = this.searchModal.querySelector('.close-search');
    
    // Apply custom styles to input if provided
    if (this.config.styles?.inputBorderColor && searchInput) {
      searchInput.style.borderColor = this.config.styles.inputBorderColor;
    }
    
    // Focus the search input
    if (searchInput) {
      searchInput.focus();
      
      // Add event listener for search input
      searchInput.addEventListener('input', (e): any => {
        const query = (e.target as HTMLInputElement).value;
        this.lastQuery = query;
        
        // Debounce search execution
        if (this.searchDebounceTimer !== null) {
          window.clearTimeout(this.searchDebounceTimer);
        }
        
        this.searchDebounceTimer = window.setTimeout((): any => {
          this.executeSearch(query);
        }, 300); // 300ms debounce
      });
      
      // Add event listener for Enter key
      searchInput.addEventListener('keydown', (e): any => {
        if (e.key === 'Enter') {
          this.executeSearch(searchInput.value);
        } else if (e.key === 'Escape') {
          this.closeModal();
        }
      });
    }
    
    // Add event listener for close button
    if (closeButton) {
      closeButton.addEventListener('click', (): any => {
        this.closeModal();
      });
    }
    
    // Add event listener for clicking outside the search container
    this.searchModal.addEventListener('click', (e): any => {
      if (e.target === this.searchModal) {
        this.closeModal();
      }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', this.handleKeyboardNavigation);
  }
  
  /**
   * Handle keyboard navigation within the search modal
   * @param {KeyboardEvent} e - The keyboard event
   */
  private handleKeyboardNavigation = (e: KeyboardEvent): void => {
    if (!this.searchModal) return;
    
    if (e.key === 'Escape') {
      this.closeModal();
    }
  };

  /**
   * Close the search modal
   */
  closeModal(): void {
    if (!this.searchModal) return;
    
    document.removeEventListener('keydown', this.handleKeyboardNavigation);
    
    // Animate closing
    this.searchModal.style.opacity = '0';
    
    setTimeout((): any => {
      if (this.searchModal && this.searchModal.parentNode) {
        this.searchModal.parentNode.removeChild(this.searchModal);
        this.searchModal = null;
      }
    }, 300);
  }

  /**
   * Render search categories in the modal
   */
  private renderSearchCategories(): void {
    if (!this.searchModal || !this.config.categories) return;
    
    const categoriesContainer = this.searchModal.querySelector('.search-categories');
    if (!categoriesContainer) return;
    
    categoriesContainer.innerHTML = '<div class="categories-title">Search By Category</div><div class="categories-list"></div>';
    
    const categoriesList = categoriesContainer.querySelector('.categories-list');
    if (!categoriesList) return;
    
    this.config.categories.forEach(category => {
      const categoryEl = document.createElement('div');
      categoryEl.className = 'search-category';
      categoryEl.innerHTML = `
        <div class="category-icon">${category.icon}</div>
        <div class="category-info">
          <div class="category-name">${category.name}</div>
          <div class="category-description">${category.description}</div>
        </div>
      `;
      
      categoryEl.addEventListener('click', (): any => {
        const searchInput = this.searchModal?.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          // Set the input value to the filter with "category:" prefix
          searchInput.value = `category:${category.filter}`;
          searchInput.focus();
          this.executeSearch(searchInput.value);
        }
      });
      
      categoriesList.appendChild(categoryEl);
    });
  }

  /**
   * Get CSS styles for the search modal
   * @returns {string} - CSS styles as a string
   */
  private getSearchModalStyles(): string {
    const { styles } = this.config;
    
    return `
      .search-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${styles?.modalBackground || 'rgba(0, 0, 0, 0.8)'};
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
      
      .search-container {
        width: 80%;
        max-width: 600px;
        background-color: var(--bg-primary, #ffffff);
        border-radius: var(--border-radius, 8px);
        padding: 2rem;
        position: relative;
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .search-input {
        width: 100%;
        padding: 1rem;
        font-size: 1.2rem;
        border: 2px solid ${styles?.inputBorderColor || 'var(--primary, #007bff)'};
        border-radius: var(--border-radius, 8px);
        margin-bottom: 1rem;
      }
      
      .search-categories {
        margin-bottom: 1.5rem;
      }
      
      .categories-title {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: var(--text-secondary, #666);
      }
      
      .categories-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .search-category {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        background: rgba(0,0,0,0.05);
        border-radius: var(--border-radius, 8px);
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      
      .search-category:hover {
        background: rgba(0,0,0,0.1);
      }
      
      .category-icon {
        margin-right: 0.5rem;
        font-size: 1.2rem;
      }
      
      .category-info {
        display: flex;
        flex-direction: column;
      }
      
      .category-name {
        font-weight: bold;
      }
      
      .category-description {
        font-size: 0.8rem;
        opacity: 0.8;
      }
      
      .search-results {
        max-height: 400px;
        overflow-y: auto;
        margin-top: 1rem;
      }
      
      .search-result {
        padding: 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid var(--border, #eee);
        transition: background-color 0.2s ease;
      }
      
      .search-result:hover {
        background-color: ${styles?.resultHoverColor || 'rgba(0,0,0,0.05)'};
      }
      
      .result-section {
        font-weight: bold;
        display: flex;
        justify-content: space-between;
      }
      
      .result-section-title {
        color: var(--primary, #007bff);
      }
      
      .result-section-type {
        font-size: 0.8rem;
        color: var(--text-secondary, #666);
        font-weight: normal;
      }
      
      .result-content {
        margin-top: 0.25rem;
        font-size: 0.9rem;
      }
      
      .highlight {
        background-color: ${styles?.highlightColor || '#ffde7d'};
        padding: 0 2px;
        border-radius: 2px;
      }
      
      .no-results {
        padding: 1rem;
        text-align: center;
        color: var(--text-secondary, #666);
      }
      
      .close-search {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background-color: var(--primary, #007bff);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius, 8px);
        cursor: pointer;
      }
    `;
  }

  /**
   * Execute a search with the given query
   * @param {string} query - The search query
   */
  executeSearch(query: string): void {
    // Check minimum query length
    if (!query || (query.length < (this.config.minQueryLength || 2) && !query.startsWith('category:'))) {
      this.renderNoResults('Please enter at least ' + (this.config.minQueryLength || 2) + ' characters to search');
      return;
    }
    
    // Check cache first
    const cachedResults = this.resultsCache.get(query);
    if (cachedResults) {
      this.renderSearchResults(cachedResults, query);
      return;
    }
    
    // Log search for analytics if enabled
    if (this.config.analytics?.enabled && this.config.analytics?.trackQueries) {
      this.logSearchQuery(query);
    }
    
    // Handle category filtering
    if (query.startsWith('category:')) {
      const categoryFilter = query.substring(9).toLowerCase();
      this.searchByCategory(categoryFilter);
      return;
    }
    
    // Prepare query terms
    const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    // Search the index
    let results = this.contentIndex
      .filter(item => {
        // Check if all query terms are present in the content
        return queryTerms.every(term => {
          if (this.config.fuzzySearch) {
            // Simple fuzzy search (includes partial matches)
            return item.content.toLowerCase().includes(term);
          } else {
            // Exact word match only (split by non-word characters)
            const words = item.content.toLowerCase().split(/\W+/);
            return words.some(word => word === term);
          }
        });
      })
      .map(item => {
        // Calculate relevance score
        let relevance = item.boost;
        
        // Increase relevance for exact matches
        if (item.content.toLowerCase() === query.toLowerCase()) {
          relevance += 5.0;
        }
        
        // Increase relevance for title or beginning of content matches
        if (item.content.toLowerCase().startsWith(query.toLowerCase())) {
          relevance += 2.0;
        }
        
        // Get snippet with highlighting
        const { highlightedContent, matchedText } = this.getHighlightedSnippet(
          item.content, 
          queryTerms,
          this.config.highlightResults || false
        );
        
        return {
          id: item.id,
          sectionId: item.sectionId,
          sectionTitle: item.sectionTitle,
          elementType: item.elementType,
          matchedText,
          relevance,
          href: item.href,
          originalContent: item.content,
          highlightedContent
        };
      });
    
    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    
    // Limit results
    if (this.config.maxResults) {
      results = results.slice(0, this.config.maxResults);
    }
    
    // Cache results
    this.resultsCache.set(query, results);
    
    // Render results
    this.renderSearchResults(results, query);
  }
  
  /**
   * Search by category filter
   * @param {string} categoryFilter - The category filter string
   */
  private searchByCategory(categoryFilter: string): void {
    const filterTerms = categoryFilter.split(',').map(term => term.trim().toLowerCase());
    
    // Filter content by category terms
    let results = this.contentIndex
      .filter(item => {
        // Check if any filter term matches the section or content
        return filterTerms.some(term => 
          item.sectionId.toLowerCase().includes(term) || 
          item.content.toLowerCase().includes(term)
        );
      })
      .map(item => {
        return {
          id: item.id,
          sectionId: item.sectionId,
          sectionTitle: item.sectionTitle,
          elementType: item.elementType,
          matchedText: this.getSnippet(item.content),
          relevance: item.boost,
          href: item.href,
          originalContent: item.content,
          highlightedContent: item.content
        };
      });
    
    // Sort by section then relevance
    results.sort((a, b): any => {
      // First sort by section
      if (a.sectionId !== b.sectionId) {
        return a.sectionId.localeCompare(b.sectionId);
      }
      // Then by relevance
      return b.relevance - a.relevance;
    });
    
    // Limit results
    if (this.config.maxResults) {
      results = results.slice(0, this.config.maxResults);
    }
    
    // Find the matching category
    const matchingCategory = this.config.categories?.find(cat => 
      cat.filter.toLowerCase() === categoryFilter
    );
    
    // Render results
    this.renderSearchResults(
      results, 
      `Category: ${matchingCategory?.name || categoryFilter}`
    );
  }

  /**
   * Get a highlighted snippet of text containing the search terms
   * @param {string} text - The full text to extract from
   * @param {string[]} searchTerms - The search terms to highlight
   * @param {boolean} shouldHighlight - Whether to highlight the terms
   * @returns {object} - Object containing highlightedContent and matchedText
   */
  private getHighlightedSnippet(
    text: string, 
    searchTerms: string[], 
    shouldHighlight: boolean
  ): { highlightedContent: string, matchedText: string } {
    // Find the first occurrence of any search term
    let firstMatchIndex = -1;
    let matchingTerm = '';
    
    for (const term of searchTerms) {
      const index = text.toLowerCase().indexOf(term);
      if (index !== -1 && (firstMatchIndex === -1 || index < firstMatchIndex)) {
        firstMatchIndex = index;
        matchingTerm = term;
      }
    }
    
    if (firstMatchIndex === -1) {
      // No match found, return first 100 characters
      return {
        highlightedContent: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        matchedText: text.substring(0, 100) + (text.length > 100 ? '...' : '')
      };
    }
    
    // Calculate snippet range (50 chars before and 100 after match)
    const snippetStart = Math.max(0, firstMatchIndex - 50);
    const snippetEnd = Math.min(text.length, firstMatchIndex + matchingTerm.length + 100);
    
    // Create snippet
    let snippet = text.substring(snippetStart, snippetEnd);
    
    // Add ellipsis if needed
    if (snippetStart > 0) {
      snippet = '...' + snippet;
    }
    if (snippetEnd < text.length) {
      snippet = snippet + '...';
    }
    
    // Return plain text if highlighting is disabled
    if (!shouldHighlight) {
      return { highlightedContent: snippet, matchedText: snippet };
    }
    
    // Highlight all search terms in the snippet
    let highlightedSnippet = snippet;
    for (const term of searchTerms) {
      // Use regex to highlight all occurrences while preserving case
      const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
      highlightedSnippet = highlightedSnippet.replace(
        regex, 
        '<span class="highlight">$1</span>'
      );
    }
    
    return { highlightedContent: highlightedSnippet, matchedText: snippet };
  }
  
  /**
   * Get a plain text snippet of content
   * @param {string} text - The text to create a snippet from
   * @returns {string} - The snippet
   */
  private getSnippet(text: string): string {
    if (text.length <= 100) return text;
    return text.substring(0, 100) + '...';
  }
  
  /**
   * Escape special characters for use in a regular expression
   * @param {string} string - The string to escape
   * @returns {string} - The escaped string
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Render search results in the modal
   * @param {SearchResult[]} results - The search results to render
   * @param {string} query - The search query
   */
  private renderSearchResults(results: SearchResult[], query: string): void {
    if (!this.searchModal) return;
    
    const resultsContainer = this.searchModal.querySelector('.search-results');
    if (!resultsContainer) return;
    
    // Show no results message if needed
    if (results.length === 0) {
      this.renderNoResults(`No results found for "${query}"`);
      return;
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Group results by section
    const resultsBySection: Record<string, SearchResult[]> = {};
    results.forEach(result => {
      if (!resultsBySection[result.sectionId]) {
        resultsBySection[result.sectionId] = [];
      }
      resultsBySection[result.sectionId].push(result);
    });
    
    // Add results to container
    Object.keys(resultsBySection).forEach(sectionId => {
      // Get section results
      const sectionResults = resultsBySection[sectionId];
      
      // Create section group
      const sectionGroup = document.createElement('div');
      sectionGroup.className = 'search-result-section';
      
      // Add results for this section
      sectionResults.forEach(result => {
        const resultEl = document.createElement('div');
        resultEl.className = 'search-result';
        resultEl.innerHTML = `
          <div class="result-section">
            <div class="result-section-title">${result.sectionTitle}</div>
            <div class="result-section-type">[${this.formatElementType(result.elementType)}]</div>
          </div>
          <div class="result-content">${result.highlightedContent}</div>
        `;
        
        // Add click handler to navigate to result
        resultEl.addEventListener('click', (): any => {
          this.navigateToResult(result);
          
          // Track click for analytics
          if (this.config.analytics?.enabled && this.config.analytics?.trackClicks) {
            this.logResultClick(query, result);
          }
        });
        
        sectionGroup.appendChild(resultEl);
      });
      
      resultsContainer.appendChild(sectionGroup);
    });
  }
  
  /**
   * Format element type for display
   * @param {string} elementType - The raw element type
   * @returns {string} - Formatted element type
   */
  private formatElementType(elementType: string): string {
    // Handle compound element types (e.g., "items.title")
    if (elementType.includes('.')) {
      const parts = elementType.split('.');
      return `In ${parts[1]}`;
    }
    
    switch (elementType) {
      case 'title': return 'Title';
      case 'subtitle': return 'Subtitle';
      case 'description': return 'Description';
      case 'content': return 'Content';
      default: return `In ${this.capitalizeFirstLetter(elementType)}`;
    }
  }
  
  /**
   * Capitalize the first letter of a string
   * @param {string} str - The input string
   * @returns {string} - The string with first letter capitalized
   */
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Render a no results message
   * @param {string} message - The message to display
   */
  private renderNoResults(message: string): void {
    if (!this.searchModal) return;
    
    const resultsContainer = this.searchModal.querySelector('.search-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
      <div class="no-results">
        <p>${message}</p>
      </div>
    `;
  }

  /**
   * Navigate to a search result
   * @param {SearchResult} result - The result to navigate to
   */
  private navigateToResult(result: SearchResult): void {
    // Close the modal
    this.closeModal();
    
    // Navigate to the section
    if (result.href) {
      window.location.href = result.href;
      
      // Scroll to the section after a brief delay
      setTimeout((): any => {
        const section = document.querySelector(result.href);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  /**
   * Log search query for analytics
   * @param {string} query - The search query
   */
  private logSearchQuery(query: string): void {
    if (this.config.analytics?.storageMethod === 'localStorage') {
      try {
        // Get existing logs
        const logsJson = localStorage.getItem('search_analytics_queries') || '[]';
        const logs = JSON.parse(logsJson);
        
        // Add new log
        logs.push({
          query,
          timestamp: new Date().toISOString()
        });
        
        // Store back (limit to last 100 queries)
        localStorage.setItem(
          'search_analytics_queries', 
          JSON.stringify(logs.slice(-100))
        );
      } catch (error) {
        console.error('Error logging search query:', error);
      }
    }
    
    // Server-side analytics could be implemented here
  }

  /**
   * Log result click for analytics
   * @param {string} query - The search query
   * @param {SearchResult} result - The clicked result
   */
  private logResultClick(query: string, result: SearchResult): void {
    if (this.config.analytics?.storageMethod === 'localStorage') {
      try {
        // Get existing logs
        const logsJson = localStorage.getItem('search_analytics_clicks') || '[]';
        const logs = JSON.parse(logsJson);
        
        // Add new log
        logs.push({
          query,
          resultId: result.id,
          sectionId: result.sectionId,
          timestamp: new Date().toISOString()
        });
        
        // Store back (limit to last 100 clicks)
        localStorage.setItem(
          'search_analytics_clicks', 
          JSON.stringify(logs.slice(-100))
        );
      } catch (error) {
        console.error('Error logging result click:', error);
      }
    }
    
    // Server-side analytics could be implemented here
  }

  /**
   * Search with a specific query
   * @param {string} query - The search query
   * @param {function} callback - Callback function with results
   */
  query(query: string, callback: (results: SearchResult[]) => void): void {
    // Check minimum query length
    if (!query || query.length < (this.config.minQueryLength || 2)) {
      callback([]);
      return;
    }
    
    // Check cache first
    const cachedResults = this.resultsCache.get(query);
    if (cachedResults) {
      callback(cachedResults);
      return;
    }
    
    // Prepare query terms
    const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    // Search the index
    let results = this.contentIndex
      .filter(item => {
        return queryTerms.every(term => {
          if (this.config.fuzzySearch) {
            return item.content.toLowerCase().includes(term);
          } else {
            const words = item.content.toLowerCase().split(/\W+/);
            return words.some(word => word === term);
          }
        });
      })
      .map(item => {
        let relevance = item.boost;
        
        if (item.content.toLowerCase() === query.toLowerCase()) {
          relevance += 5.0;
        }
        
        if (item.content.toLowerCase().startsWith(query.toLowerCase())) {
          relevance += 2.0;
        }
        
        const { highlightedContent, matchedText } = this.getHighlightedSnippet(
          item.content, 
          queryTerms,
          this.config.highlightResults || false
        );
        
        return {
          id: item.id,
          sectionId: item.sectionId,
          sectionTitle: item.sectionTitle,
          elementType: item.elementType,
          matchedText,
          relevance,
          href: item.href,
          originalContent: item.content,
          highlightedContent
        };
      });
    
    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    
    // Limit results
    if (this.config.maxResults) {
      results = results.slice(0, this.config.maxResults);
    }
    
    // Cache results
    this.resultsCache.set(query, results);
    
    // Return results via callback
    callback(results);
  }

  /**
   * Register a custom search handler
   * @param {SearchHandler} handler - The custom search handler
   */
  registerHandler(handler: SearchHandler): void {
    this.searchHandlers.push(handler);
    if (this.config.debug) {
      console.log(`Registered custom search handler: ${handler.name}`);
    }
  }
}

// Auto-initialize the search plugin if we have configuration
document.addEventListener('DOMContentLoaded', (): any => {
  if (window.siteContent?.plugins?.search) {
    const searchConfig = window.siteContent.plugins.search;
    const search = new SiteSearch(searchConfig);
    search.initialize();
  }
});

export default SiteSearch;
