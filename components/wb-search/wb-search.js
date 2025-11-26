/**
 * WB Search Web Component
 * A reusable search component with modal and button variants
 * 
 * @example
 * <wb-search variant="button" placeholder="Search..."></wb-search>
 * 
 * @version 2.0.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBSearch extends WBBaseComponent {
    static useShadow = false;
    
    constructor() {
        super();
        this.isInitialized = false;
        this.searchData = [];
    }

    static get observedAttributes() {
        return ['variant', 'button-text', 'button-icon', 'placeholder', 'data-search-data'];
    }

    async connectedCallback() {
        super.connectedCallback();
        
        if (this.isInitialized) return;
        
        this.logInfo('WBSearch connecting');
        
        await loadComponentCSS(this, 'wb-search.css');
        this.render();
        this.setupEventListeners();
        this.isInitialized = true;
        
        this.fireEvent('wb-search:ready', { component: 'wb-search' });
        this.logInfo('WBSearch ready');
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.logDebug('WBSearch disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (oldValue === newValue) return;
        
        if (this.isInitialized) {
            this.render();
            this.setupEventListeners();
        }
    }

    // Property getters/setters
    get variant() {
        return this.getAttr('variant', 'button');
    }
    
    set variant(value) {
        this.setAttr('variant', value);
    }
    
    get buttonText() {
        return this.getAttr('button-text', 'Search');
    }
    
    set buttonText(value) {
        this.setAttr('button-text', value);
    }
    
    get buttonIcon() {
        return this.getAttr('button-icon', '🔍');
    }
    
    set buttonIcon(value) {
        this.setAttr('button-icon', value);
    }
    
    get placeholder() {
        return this.getAttr('placeholder', 'Search website...');
    }
    
    set placeholder(value) {
        this.setAttr('placeholder', value);
    }

    render() {
        this.innerHTML = `
            ${this.getButtonHTML()}
            ${this.getModalHTML()}
        `;
    }

    getButtonHTML() {
        if (this.variant === 'floating') {
            return `
                <button class="wb-search-floating" data-action="open-search">
                    <span class="wb-search-icon">${this.buttonIcon}</span>
                </button>
            `;
        }
        
        if (this.variant === 'icon-only') {
            return `
                <button class="wb-search-button wb-search-icon-only" data-action="open-search">
                    <span class="wb-search-icon">${this.buttonIcon}</span>
                </button>
            `;
        }

        return `
            <button class="wb-search-button" data-action="open-search">
                <span class="wb-search-icon">${this.buttonIcon}</span>
                <span class="wb-search-text">${this.buttonText}</span>
            </button>
        `;
    }

    getModalHTML() {
        return `
            <div class="wb-search-modal" data-modal="search">
                <div class="wb-search-container">
                    <button class="wb-search-close" data-action="close-search">✕</button>
                    <input type="text" class="wb-search-input" placeholder="${this.placeholder}" data-search-input>
                    <div class="wb-search-results" data-search-results>
                        <div class="wb-search-no-results">Start typing to search...</div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        this.querySelectorAll('[data-action="open-search"]').forEach(button => {
            button.addEventListener('click', () => this.openSearch());
        });

        this.querySelectorAll('[data-action="close-search"]').forEach(button => {
            button.addEventListener('click', () => this.closeSearch());
        });

        const searchInput = this.querySelector('[data-search-input]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));
        }

        const modal = this.querySelector('[data-modal="search"]');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeSearch();
                }
            });
        }

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
            
            this.fireEvent('wb-search:opened', {});
            this.logDebug('WBSearch opened');
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
            
            this.fireEvent('wb-search:closed', {});
            this.logDebug('WBSearch closed');
        }
    }

    performSearch(query) {
        const resultsContainer = this.querySelector('[data-search-results]');
        if (!resultsContainer) return;

        if (!query.trim()) {
            resultsContainer.innerHTML = '<div class="wb-search-no-results">Start typing to search...</div>';
            return;
        }

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

        this.fireEvent('wb-search:results', { query, results });
        this.logDebug('WBSearch results', { query, count: results.length });
    }

    getSearchData() {
        const dataAttr = this.getAttribute('data-search-data');
        if (dataAttr) {
            try {
                return JSON.parse(dataAttr);
            } catch (e) {
                this.logError('Invalid search data JSON', { error: e.message });
            }
        }

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
            this.fireEvent('wb-search:select', { result });
            this.logDebug('WBSearch result selected', { resultId });
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

if (!customElements.get('wb-search')) {
    customElements.define('wb-search', WBSearch);
}

if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-search', WBSearch, [], {
        version: '2.0.0',
        type: 'form',
        role: 'ui-element',
        description: 'Search component with modal and button variants',
        api: {
            events: ['wb-search:ready', 'wb-search:opened', 'wb-search:closed', 'wb-search:results', 'wb-search:select'],
            attributes: ['variant', 'button-text', 'button-icon', 'placeholder', 'data-search-data'],
            methods: ['openSearch', 'closeSearch', 'setSearchData', 'getSearchQuery', 'focusSearch', 'render']
        },
        priority: 4
    });
}

if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBSearch = WBSearch;
window.WBSearch = WBSearch;

export { WBSearch };
export default WBSearch;
