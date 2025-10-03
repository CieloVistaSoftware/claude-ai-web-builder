/**
 * WB Search Component
 * A reusable search component with modal and button variants
 */
class WBSearch extends HTMLElement {
    constructor() {
        super();
        this.isInitialized = false;
        this.searchData = [];
    }

    connectedCallback() {
        if (!this.isInitialized) {
            this.init();
        }
    }

    async init() {
        try {
            await this.loadCSS();
            this.render();
            this.setupEventListeners();
            this.isInitialized = true;
            
            this.dispatchEvent(new CustomEvent('wb-search-ready'));
            console.log('✅ WB Search component initialized');
        } catch (error) {
            console.error('❌ Failed to initialize WB Search:', error);
        }
    }

    async loadCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('wb-search.js', '../components/wb-search/') + 'wb-search.css';
            window.WBComponentUtils.loadCSS('wb-search', cssPath);
        } else {
            // Fallback for when WBComponentUtils is not available
            const cssPath = 'components/wb-search/wb-search.css';
            if (!document.querySelector(`link[href="${cssPath}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssPath;
                document.head.appendChild(link);
            }
        }
    }

    render() {
        const variant = this.getAttribute('variant') || 'button';
        const buttonText = this.getAttribute('button-text') || 'Search';
        const buttonIcon = this.getAttribute('button-icon') || '🔍';
        const placeholder = this.getAttribute('placeholder') || 'Search website...';

        this.innerHTML = `
            ${this.getButtonHTML(variant, buttonText, buttonIcon)}
            ${this.getModalHTML(placeholder)}
        `;
    }

    getButtonHTML(variant, buttonText, buttonIcon) {
        if (variant === 'floating') {
            return `
                <button class="wb-search-floating" data-action="open-search">
                    <span class="wb-search-icon">${buttonIcon}</span>
                </button>
            `;
        }
        
        if (variant === 'icon-only') {
            return `
                <button class="wb-search-button wb-search-icon-only" data-action="open-search">
                    <span class="wb-search-icon">${buttonIcon}</span>
                </button>
            `;
        }

        return `
            <button class="wb-search-button" data-action="open-search">
                <span class="wb-search-icon">${buttonIcon}</span>
                <span class="wb-search-text">${buttonText}</span>
            </button>
        `;
    }

    getModalHTML(placeholder) {
        return `
            <div class="wb-search-modal" data-modal="search">
                <div class="wb-search-container">
                    <button class="wb-search-close" data-action="close-search">✕</button>
                    <input type="text" class="wb-search-input" placeholder="${placeholder}" data-search-input>
                    <div class="wb-search-results" data-search-results>
                        <div class="wb-search-no-results">Start typing to search...</div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Open search modal
        this.querySelectorAll('[data-action="open-search"]').forEach(button => {
            button.addEventListener('click', () => this.openSearch());
        });

        // Close search modal
        this.querySelectorAll('[data-action="close-search"]').forEach(button => {
            button.addEventListener('click', () => this.closeSearch());
        });

        // Search input
        const searchInput = this.querySelector('[data-search-input]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));
        }

        // Modal backdrop click
        const modal = this.querySelector('[data-modal="search"]');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeSearch();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen()) {
                this.closeSearch();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
        });
    }

    openSearch() {
        const modal = this.querySelector('[data-modal="search"]');
        const input = this.querySelector('[data-search-input]');
        
        if (modal && input) {
            modal.classList.add('wb-search-active');
            input.focus();
            document.body.style.overflow = 'hidden';
            
            this.dispatchEvent(new CustomEvent('wb-search-opened'));
        }
    }

    closeSearch() {
        const modal = this.querySelector('[data-modal="search"]');
        const input = this.querySelector('[data-search-input]');
        const results = this.querySelector('[data-search-results]');
        
        if (modal) {
            modal.classList.remove('wb-search-active');
            document.body.style.overflow = '';
            
            if (input) input.value = '';
            if (results) results.innerHTML = '<div class="wb-search-no-results">Start typing to search...</div>';
            
            this.dispatchEvent(new CustomEvent('wb-search-closed'));
        }
    }

    performSearch(query) {
        const resultsContainer = this.querySelector('[data-search-results]');
        if (!resultsContainer) return;

        if (!query.trim()) {
            resultsContainer.innerHTML = '<div class="wb-search-no-results">Start typing to search...</div>';
            return;
        }

        // Get search data from attribute or use default
        const searchData = this.getSearchData();
        const results = this.filterResults(searchData, query);

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="wb-search-no-results">No results found</div>';
            return;
        }

        resultsContainer.innerHTML = results.map(result => `
            <div class="wb-search-result" data-result="${result.id}" onclick="this.closest('wb-search').selectResult('${result.id}')">
                <div class="wb-search-result-header">
                    <span class="wb-search-result-title">${this.highlightQuery(result.title, query)}</span>
                    <span class="wb-search-result-type">${result.type}</span>
                </div>
                <div class="wb-search-result-content">${this.highlightQuery(result.content, query)}</div>
            </div>
        `).join('');

        this.dispatchEvent(new CustomEvent('wb-search-results', {
            detail: { query, results }
        }));
    }

    getSearchData() {
        // Try to get data from data-search-data attribute
        const dataAttr = this.getAttribute('data-search-data');
        if (dataAttr) {
            try {
                return JSON.parse(dataAttr);
            } catch (e) {
                console.warn('Invalid search data JSON:', e);
            }
        }

        // Default search data
        return [
            { id: 'components', title: 'Components', type: 'Section', content: 'Web components for building interfaces' },
            { id: 'wb-button', title: 'WB Button', type: 'Component', content: 'Customizable button component with variants' },
            { id: 'wb-search', title: 'WB Search', type: 'Component', content: 'Search component with modal and button variants' },
            { id: 'theme-system', title: 'Theme System', type: 'Feature', content: 'Dark and light theme support' },
            { id: 'plugins', title: 'Plugins', type: 'System', content: 'Extensible plugin architecture' }
        ];
    }

    filterResults(data, query) {
        const normalizedQuery = query.toLowerCase();
        return data.filter(item => 
            item.title.toLowerCase().includes(normalizedQuery) ||
            item.content.toLowerCase().includes(normalizedQuery) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)))
        );
    }

    highlightQuery(text, query) {
        if (!query.trim()) return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark class="wb-search-highlight">$1</mark>');
    }

    selectResult(resultId) {
        const searchData = this.getSearchData();
        const result = searchData.find(item => item.id === resultId);
        
        if (result) {
            this.dispatchEvent(new CustomEvent('wb-search-select', {
                detail: { result }
            }));
            
            // Default behavior - close search
            this.closeSearch();
        }
    }

    isModalOpen() {
        const modal = this.querySelector('[data-modal="search"]');
        return modal && modal.classList.contains('wb-search-active');
    }

    // Public API
    setSearchData(data) {
        this.searchData = data;
        this.setAttribute('data-search-data', JSON.stringify(data));
    }

    getSearchQuery() {
        const input = this.querySelector('[data-search-input]');
        return input ? input.value : '';
    }

    focusSearch() {
        this.openSearch();
    }
}

// Register the component
customElements.define('wb-search', WBSearch);