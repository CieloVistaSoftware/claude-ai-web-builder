/**
 * WB Select Web Component
 * 
 * A comprehensive dropdown select component with search, multi-select, grouping, and theming support.
 * 
 * @example
 * <wb-select placeholder="Select option...">
 *   <option value="1">Option 1</option>
 * </wb-select>
 * 
 * @version 2.1.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

const fallbackConfig = {
    classes: {
        base: 'wb-select',
        wrapper: 'wb-select-wrapper',
        trigger: 'wb-select-trigger',
        value: 'wb-select-value',
        placeholder: 'wb-select-placeholder',
        icon: 'wb-select-icon',
        dropdown: 'wb-select-dropdown',
        search: 'wb-select-search',
        options: 'wb-select-options',
        option: 'wb-select-option',
        group: 'wb-select-group',
        groupLabel: 'wb-select-group-label',
        tag: 'wb-select-tag',
        sizes: { small: 'wb-select--small', standard: '', large: 'wb-select--large' },
        states: {
            open: 'wb-select--open',
            disabled: 'wb-select--disabled',
            error: 'wb-select--error',
            selected: 'wb-select-option--selected',
            highlighted: 'wb-select-option--highlighted',
            multiple: 'wb-select--multiple',
            searchable: 'wb-select--searchable'
        }
    },
    defaults: { size: 'standard', placeholder: 'Select option...' }
};

class WBSelect extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
        
        this.config = fallbackConfig;
        this.initialized = false;
        this._isOpen = false;
        this._selectedValues = [];
        this._options = [];
        this._filteredOptions = [];
        this._highlightedIndex = -1;
        this._searchTerm = '';
        
        this.wrapper = null;
        this.trigger = null;
        this.valueElement = null;
        this.dropdown = null;
        this.searchInput = null;
        this.optionsContainer = null;
        
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
    }

    static get observedAttributes() {
        return ['placeholder', 'multiple', 'searchable', 'clearable', 'disabled', 'size', 'value', 'options'];
    }

    async connectedCallback() {
        super.connectedCallback();
        
        this.logInfo('WBSelect connecting');
        
        await loadComponentCSS(this, 'wb-select.css');
        
        const optionsAttr = this.getAttribute('options');
        if (optionsAttr) {
            this.setOptions(optionsAttr);
        } else {
            this.parseExistingOptions();
        }
        
        this.render();
        this.setupEventListeners();
        this.initialized = true;
        
        this.fireEvent('wb-select:ready', { component: 'wb-select' });
        this.logInfo('WBSelect ready');
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanup();
        this.logDebug('WBSelect disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (!this.initialized || oldValue === newValue) return;
        
        switch (name) {
            case 'disabled':
                this.setDisabled(newValue !== null);
                break;
            case 'value':
                this.setValue(newValue);
                break;
            case 'options':
                this.setOptions(newValue);
                break;
            default:
                this.render();
                break;
        }
    }

    // Property getters/setters
    get placeholder() {
        return this.getAttr('placeholder', 'Select option...');
    }
    
    set placeholder(value) {
        this.setAttr('placeholder', value);
    }
    
    get multiple() {
        return this.hasAttribute('multiple');
    }
    
    set multiple(value) {
        if (value) {
            this.setAttribute('multiple', '');
        } else {
            this.removeAttribute('multiple');
        }
    }
    
    get searchable() {
        return this.hasAttribute('searchable');
    }
    
    set searchable(value) {
        if (value) {
            this.setAttribute('searchable', '');
        } else {
            this.removeAttribute('searchable');
        }
    }
    
    get disabled() {
        return this.hasAttribute('disabled');
    }
    
    set disabled(value) {
        if (value) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }
    
    get size() {
        return this.getAttr('size', 'standard');
    }
    
    set size(value) {
        this.setAttr('size', value);
    }

    parseExistingOptions() {
        this._options = [];
        const optionElements = this.querySelectorAll('option');
        optionElements.forEach(option => {
            this._options.push({
                value: option.value,
                text: option.textContent.trim(),
                disabled: option.disabled,
                selected: option.selected,
                group: option.parentElement?.tagName === 'OPTGROUP' ? option.parentElement.label : null
            });
        });
        
        this._selectedValues = this._options.filter(opt => opt.selected).map(opt => opt.value);
        this._filteredOptions = [...this._options];
    }

    render() {
        if (!this.shadowRoot) return;
        
        const size = this.size;
        const isSearchable = this.searchable;
        
        let wrapperClass = this.config.classes.wrapper;
        if (size !== 'standard' && this.config.classes.sizes[size]) {
            wrapperClass += ' ' + this.config.classes.sizes[size];
        }
        if (this.multiple) {
            wrapperClass += ' ' + this.config.classes.states.multiple;
        }
        if (isSearchable) {
            wrapperClass += ' ' + this.config.classes.states.searchable;
        }
        if (this.disabled) {
            wrapperClass += ' ' + this.config.classes.states.disabled;
        }
        
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('./wb-select.css', import.meta.url).href}">
            <div class="${wrapperClass}">
                <div class="${this.config.classes.trigger}" role="combobox" aria-expanded="false" tabindex="${this.disabled ? -1 : 0}">
                    <div class="${this.config.classes.value}"></div>
                    <div class="${this.config.classes.icon}">▼</div>
                </div>
                <div class="${this.config.classes.dropdown}" role="listbox">
                    ${isSearchable ? `<input type="text" class="${this.config.classes.search}" placeholder="Search...">` : ''}
                    <div class="${this.config.classes.options}"></div>
                </div>
            </div>
        `;
        
        this.wrapper = this.shadowRoot.querySelector(`.${this.config.classes.wrapper}`);
        this.trigger = this.shadowRoot.querySelector(`.${this.config.classes.trigger}`);
        this.valueElement = this.shadowRoot.querySelector(`.${this.config.classes.value}`);
        this.dropdown = this.shadowRoot.querySelector(`.${this.config.classes.dropdown}`);
        this.searchInput = this.shadowRoot.querySelector(`.${this.config.classes.search}`);
        this.optionsContainer = this.shadowRoot.querySelector(`.${this.config.classes.options}`);
        
        this.renderOptions();
        this.updateDisplay();
        this.setupEventListeners();
    }

    renderOptions() {
        if (!this.optionsContainer) return;
        
        this.optionsContainer.innerHTML = '';
        
        this._filteredOptions.forEach((option, index) => {
            const div = document.createElement('div');
            div.className = this.config.classes.option;
            div.setAttribute('data-value', option.value);
            div.setAttribute('data-index', index);
            div.setAttribute('role', 'option');
            div.textContent = option.text;
            
            if (this._selectedValues.includes(option.value)) {
                div.classList.add(this.config.classes.states.selected);
            }
            if (index === this._highlightedIndex) {
                div.classList.add(this.config.classes.states.highlighted);
            }
            
            this.optionsContainer.appendChild(div);
        });
    }

    setupEventListeners() {
        if (this.trigger) {
            this.trigger.removeEventListener('click', this.handleTriggerClick);
            this.trigger.removeEventListener('keydown', this.handleKeyDown);
            this.trigger.addEventListener('click', this.handleTriggerClick);
            this.trigger.addEventListener('keydown', this.handleKeyDown);
        }
        
        if (this.searchInput) {
            this.searchInput.removeEventListener('input', this.handleSearch);
            this.searchInput.addEventListener('input', this.handleSearch);
        }
        
        if (this.optionsContainer) {
            this.optionsContainer.removeEventListener('click', this.handleOptionClick);
            this.optionsContainer.addEventListener('click', this.handleOptionClick);
        }
        
        document.removeEventListener('click', this.handleDocumentClick);
        document.addEventListener('click', this.handleDocumentClick);
    }

    handleTriggerClick(event) {
        event.stopPropagation();
        if (this.disabled) return;
        
        if (this._isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    handleKeyDown(event) {
        if (this.disabled) return;
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (!this._isOpen) this.open();
                else this.highlightNext();
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (this._isOpen) this.highlightPrevious();
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (!this._isOpen) this.open();
                else if (this._highlightedIndex >= 0) {
                    this.selectOption(this._filteredOptions[this._highlightedIndex]);
                }
                break;
            case 'Escape':
                event.preventDefault();
                this.close();
                break;
        }
    }

    handleDocumentClick(event) {
        if (!this.contains(event.target) && !this.shadowRoot?.contains(event.target)) {
            this.close();
        }
    }

    handleSearch(event) {
        this._searchTerm = event.target.value.toLowerCase();
        this.filterOptions();
        this.renderOptions();
        this._highlightedIndex = 0;
        
        this.fireEvent('wb-select:search', { searchTerm: this._searchTerm });
    }

    handleOptionClick(event) {
        const optionElement = event.target.closest(`.${this.config.classes.option}`);
        if (!optionElement) return;
        
        const index = parseInt(optionElement.dataset.index);
        const option = this._filteredOptions[index];
        if (option) this.selectOption(option);
    }

    open() {
        if (this._isOpen || this.disabled) return;
        
        this._isOpen = true;
        this.wrapper?.classList.add(this.config.classes.states.open);
        this.trigger?.setAttribute('aria-expanded', 'true');
        
        if (this.searchInput) {
            setTimeout(() => this.searchInput.focus(), 0);
        }
        
        this.fireEvent('wb-select:open', {});
        this.logDebug('WBSelect opened');
    }

    close() {
        if (!this._isOpen) return;
        
        this._isOpen = false;
        this.wrapper?.classList.remove(this.config.classes.states.open);
        this.trigger?.setAttribute('aria-expanded', 'false');
        
        if (this.searchInput) {
            this.searchInput.value = '';
            this._searchTerm = '';
            this.filterOptions();
            this.renderOptions();
        }
        
        this.fireEvent('wb-select:close', {});
        this.logDebug('WBSelect closed');
    }

    selectOption(option) {
        if (option.disabled) return;
        
        if (this.multiple) {
            const index = this._selectedValues.indexOf(option.value);
            if (index >= 0) {
                this._selectedValues.splice(index, 1);
            } else {
                this._selectedValues.push(option.value);
            }
        } else {
            this._selectedValues = [option.value];
            this.close();
        }
        
        this.updateDisplay();
        this.renderOptions();
        this.setAttribute('value', this.multiple ? this._selectedValues.join(',') : this._selectedValues[0] || '');
        
        this.fireEvent('wb-select:change', {
            value: this.multiple ? this._selectedValues : this._selectedValues[0],
            option: option
        });
        
        this.logDebug('WBSelect option selected', { value: option.value });
    }

    setValue(value) {
        if (typeof value === 'string') {
            this._selectedValues = value ? value.split(',') : [];
        } else if (Array.isArray(value)) {
            this._selectedValues = [...value];
        } else {
            this._selectedValues = value ? [value] : [];
        }
        this.updateDisplay();
        this.renderOptions();
    }

    getValue() {
        return this.multiple ? this._selectedValues : this._selectedValues[0] || null;
    }

    setDisabled(disabled) {
        if (disabled) {
            this.wrapper?.classList.add(this.config.classes.states.disabled);
            this.trigger?.setAttribute('tabindex', '-1');
        } else {
            this.wrapper?.classList.remove(this.config.classes.states.disabled);
            this.trigger?.setAttribute('tabindex', '0');
        }
    }

    setOptions(optionsData) {
        if (!optionsData) return;
        
        try {
            const options = typeof optionsData === 'string' ? JSON.parse(optionsData) : optionsData;
            
            if (Array.isArray(options)) {
                this._options = options.map(opt => ({
                    value: opt.value,
                    text: opt.label || opt.text || opt.value,
                    disabled: opt.disabled || false,
                    selected: opt.selected || false,
                    group: opt.group || null
                }));
                
                this.filterOptions();
                this.renderOptions();
                this.updateDisplay();
                
                this.logDebug('WBSelect options set', { count: this._options.length });
            }
        } catch (error) {
            this.logError('Failed to parse options', { error: error.message });
        }
    }

    filterOptions() {
        if (!this._searchTerm) {
            this._filteredOptions = [...this._options];
        } else {
            this._filteredOptions = this._options.filter(opt => opt.text.toLowerCase().includes(this._searchTerm));
        }
    }

    updateDisplay() {
        if (!this.valueElement) return;
        
        if (this._selectedValues.length === 0) {
            this.valueElement.innerHTML = `<span class="${this.config.classes.placeholder}">${this.placeholder}</span>`;
        } else if (this.multiple) {
            const tags = this._selectedValues.map(value => {
                const option = this._options.find(opt => opt.value === value);
                return option ? `<span class="${this.config.classes.tag}">${option.text}</span>` : '';
            }).join('');
            this.valueElement.innerHTML = tags;
        } else {
            const option = this._options.find(opt => opt.value === this._selectedValues[0]);
            this.valueElement.textContent = option ? option.text : '';
        }
    }

    highlightNext() {
        if (this._highlightedIndex < this._filteredOptions.length - 1) {
            this._highlightedIndex++;
            this.updateHighlight();
        }
    }

    highlightPrevious() {
        if (this._highlightedIndex > 0) {
            this._highlightedIndex--;
            this.updateHighlight();
        }
    }

    updateHighlight() {
        this.optionsContainer?.querySelectorAll(`.${this.config.classes.states.highlighted}`)
            .forEach(el => el.classList.remove(this.config.classes.states.highlighted));
        
        if (this._highlightedIndex >= 0) {
            const el = this.optionsContainer?.querySelector(`[data-index="${this._highlightedIndex}"]`);
            if (el) {
                el.classList.add(this.config.classes.states.highlighted);
                el.scrollIntoView({ block: 'nearest' });
            }
        }
    }

    clear() {
        this._selectedValues = [];
        this.updateDisplay();
        this.renderOptions();
        this.setAttribute('value', '');
        this.fireEvent('wb-select:change', { value: null });
    }

    cleanup() {
        document.removeEventListener('click', this.handleDocumentClick);
    }
}

if (!customElements.get('wb-select')) {
    customElements.define('wb-select', WBSelect);
}

if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-select', WBSelect, [], {
        version: '2.1.0',
        type: 'form',
        role: 'ui-element',
        description: 'Advanced select dropdown with search and multi-select',
        api: {
            events: ['wb-select:ready', 'wb-select:change', 'wb-select:open', 'wb-select:close', 'wb-select:search'],
            attributes: ['placeholder', 'multiple', 'searchable', 'disabled', 'size', 'value', 'options'],
            methods: ['open', 'close', 'setValue', 'getValue', 'setOptions', 'clear', 'render']
        },
        priority: 4
    });
}

if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBSelect = WBSelect;
window.WBSelect = WBSelect;

export { WBSelect };
export default WBSelect;
