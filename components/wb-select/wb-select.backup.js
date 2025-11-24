/**
 * WB Select Web Component
 * 
 * A comprehensive dropdown select component with search, multi-select, grouping, and theming support.
 * Features keyboard navigation, accessibility support, and dynamic option management.
 * 
 * @example
 * <wb-select placeholder="Select option...">
 *   <option value="1">Option 1</option>
 *   <option value="2">Option 2</option>
 * </wb-select>
 * 
 * <wb-select searchable multiple placeholder="Search and select multiple...">
 *   <optgroup label="Group 1">
 *     <option value="a">Option A</option>
 *     <option value="b">Option B</option>
 *   </optgroup>
 * </wb-select>
 * 
 * @events
 * - wb-select:change - Fired when selection changes
 * - wb-select:open - Fired when dropdown opens
 * - wb-select:close - Fired when dropdown closes
 * - wb-select:search - Fired during search
 * - wb-select:ready - Fired when component is fully initialized
 * 
 * @version 2.0.0
 * @author Website Builder Team
 */

import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

if (window.WBEventLog) {
        WBEventLog.logInfo('WB Select Web Component: Starting initialization...', { 
            component: 'wb-select', 
            method: 'moduleLoad', 
            line: 34 
        });
    } else {
        console.log('📋 WB Select Web Component: Starting initialization...');
    }

    // Configuration fallback - used if JSON loading fails
    const fallbackConfig = {
        component: {
            name: 'wb-select',
            version: '2.0.0',
            description: 'Website Builder select dropdown component'
        },
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
            label: 'wb-select-label',
            message: 'wb-select-message',
            tag: 'wb-select-tag',
            tagRemove: 'wb-select-tag-remove',
            sizes: {
                small: 'wb-select--small',
                standard: '',
                large: 'wb-select--large'
            },
            states: {
                open: 'wb-select--open',
                disabled: 'wb-select--disabled',
                error: 'wb-select--error',
                success: 'wb-select--success',
                focused: 'wb-select--focused',
                loading: 'wb-select--loading',
                selected: 'wb-select-option--selected',
                highlighted: 'wb-select-option--highlighted',
                multiple: 'wb-select--multiple',
                searchable: 'wb-select--searchable'
            }
        },
        defaults: {
            size: 'standard',
            placeholder: 'Select option...',
            searchable: false,
            multiple: false,
            clearable: false,
            disabled: false
        },
        attributes: {
            placeholder: 'placeholder',
            multiple: 'multiple',
            searchable: 'searchable',
            clearable: 'clearable',
            disabled: 'disabled',
            size: 'size',
            value: 'value',
            name: 'name'
        },
        events: {
            ready: 'wb-select:ready',
            change: 'wb-select:change',
            open: 'wb-select:open',
            close: 'wb-select:close',
            search: 'wb-select:search',
            focus: 'wb-select:focus',
            blur: 'wb-select:blur'
        }
    };

    class WBSelect extends HTMLElement {
        constructor() {
            super();
            
            // Component state
            this.config = fallbackConfig;
            this.initialized = false;
            this.utils = null;
            this._isOpen = false;
            this._selectedValues = [];
            this._options = [];
            this._filteredOptions = [];
            this._highlightedIndex = -1;
            this._searchTerm = '';
            
            // DOM references
            this.wrapper = null;
            this.trigger = null;
            this.valueElement = null;
            this.dropdown = null;
            this.searchInput = null;
            this.optionsContainer = null;
            
            // Bind methods
            this.handleTriggerClick = this.handleTriggerClick.bind(this);
            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.handleDocumentClick = this.handleDocumentClick.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.handleOptionClick = this.handleOptionClick.bind(this);
        }

        async connectedCallback() {
            try {
                await this.initialize();
            } catch (error) {
                if (window.WBEventLog) {
                    WBEventLog.logError('WB Select initialization failed', { 
                        component: 'wb-select', 
                        method: 'connectedCallback', 
                        line: 142, 
                        error: error.message, 
                        stack: error.stack 
                    });
                } else {
                    console.error('📋 WB Select initialization failed:', error);
                }
                this.initializeFallback();
            }
        }

        disconnectedCallback() {
            this.cleanup();
        }

        // Observed attributes for reactivity
        static get observedAttributes() {
            return ['placeholder', 'multiple', 'searchable', 'clearable', 'disabled', 
                   'size', 'value', 'name', 'options'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (!this.initialized) return;
            
            switch (name) {
                case 'placeholder':
                    this.updatePlaceholder();
                    break;
                case 'multiple':
                    this.updateMultiple();
                    break;
                case 'searchable':
                    this.updateSearchable();
                    break;
                case 'disabled':
                    this.setDisabled(newValue !== null);
                    break;
                case 'size':
                    this.setSize(newValue);
                    break;
                case 'value':
                    this.setValue(newValue);
                    break;
                case 'options':
                    this.setOptions(newValue);
                    break;
            }
        }

        async initialize() {
            // Load utilities
            await this.loadUtils();
            
            // Load configuration
            await this.loadConfig();
            
            // Load CSS
            await this.loadCSS();
            
            // Initialize component
            this.initializeComponent();
            
            // Mark as initialized
            this.initialized = true;
            
            // Dispatch ready event
            this.dispatchReady();
        }

        async loadUtils() {
            if (!window.WBComponentUtils) {
                // WBComponentUtils is not available, continue without it
                this.utils = null;
                if (window.WBEventLog) {
                    WBEventLog.logWarning('WB Select: WBComponentUtils not available, using basic functionality', { 
                        component: 'wb-select', 
                        method: 'loadUtils' 
                    });
                }
            } else {
                this.utils = window.WBComponentUtils;
            }
        }

        async loadConfig() {
            // Always use fallback config - it has all necessary structure
            this.config = fallbackConfig;
            
            // Don't attempt to load external config - just use fallback
            // This prevents path resolution issues and errors
            if (window.WBEventLog) {
                WBEventLog.logInfo('WB Select: Using built-in fallback config', { 
                    component: 'wb-select', 
                    method: 'loadConfig'
                });
            }
        }

        async loadCSS() {
            await loadComponentCSS(this, 'wb-select.css');
        }

        initializeComponent() {
            // Check for options attribute first (schema-driven)
            const optionsAttr = this.getAttribute('options');
            if (optionsAttr) {
                // Schema-driven: options from JSON attribute
                this.setOptions(optionsAttr);
            } else {
                // Legacy: parse existing option elements from HTML
                this.parseExistingOptions();
            }
            
            // Create component structure
            this.createComponentStructure();
            
            // Set base classes
            this.classList.add(this.config.classes.base);
            
            // Apply initial attributes
            this.applyAttributes();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize dropdown state
            this.updateDisplay();
        }

        initializeFallback() {
            if (window.WBEventLog) {
                WBEventLog.logWarning('WB Select: Initializing with basic functionality', { 
                    component: 'wb-select', 
                    method: 'initializeFallback', 
                    line: 267 
                });
            } else {
                console.warn('📋 WB Select: Initializing with basic functionality');
            }
            this.classList.add('wb-select');
            this.createBasicStructure();
            this.setupEventListeners();
        }

        parseExistingOptions() {
            this._options = [];
            
            // Parse option elements
            const optionElements = this.querySelectorAll('option');
            optionElements.forEach(option => {
                this._options.push({
                    value: option.value,
                    text: option.textContent.trim(),
                    disabled: option.disabled,
                    selected: option.selected,
                    group: option.parentElement.tagName === 'OPTGROUP' ? 
                           option.parentElement.label : null
                });
            });
            
            // Parse optgroup elements
            const optgroups = this.querySelectorAll('optgroup');
            optgroups.forEach(group => {
                const groupOptions = group.querySelectorAll('option');
                groupOptions.forEach(option => {
                    // Already handled above, but ensure group is set
                    const existingOption = this._options.find(opt => opt.value === option.value);
                    if (existingOption) {
                        existingOption.group = group.label;
                    }
                });
            });
            
            // Set initial selected values
            this._selectedValues = this._options
                .filter(option => option.selected)
                .map(option => option.value);
            
            this._filteredOptions = [...this._options];
        }

        createComponentStructure() {
            // Ensure config exists
            if (!this.config || !this.config.classes) {
                if (window.WBEventLog) {
                    WBEventLog.logError('WB Select: Config missing, cannot create structure', { 
                        component: 'wb-select', 
                        method: 'createSelectStructure', 
                        line: 356 
                    });
                } else {
                    console.error('📋 WB Select: Config missing, cannot create structure');
                }
                return;
            }
            
            // Clear existing content
            this.innerHTML = '';
            
            // Create wrapper
            this.wrapper = this.utils ? 
                this.utils.createElement('div', { className: this.config.classes.wrapper }) :
                this.createWrapper();
            
            // Create trigger
            this.trigger = this.utils ?
                this.utils.createElement('div', { 
                    className: this.config.classes.trigger,
                    role: 'combobox',
                    'aria-expanded': 'false',
                    'aria-haspopup': 'listbox',
                    tabindex: '0'
                }) :
                this.createTrigger();
            
            // Create value display
            this.valueElement = this.utils ?
                this.utils.createElement('div', { className: this.config.classes.value }) :
                this.createValueElement();
            
            // Create dropdown icon
            const icon = this.utils ?
                this.utils.createElement('div', { 
                    className: this.config.classes.icon,
                    innerHTML: '▼'
                }) :
                this.createIcon();
            
            // Create dropdown
            this.dropdown = this.utils ?
                this.utils.createElement('div', { 
                    className: this.config.classes.dropdown,
                    role: 'listbox'
                }) :
                this.createDropdown();
            
            // Create search input (if searchable)
            if (this.hasAttribute('searchable')) {
                this.searchInput = this.utils ?
                    this.utils.createElement('input', {
                        className: this.config.classes.search,
                        type: 'text',
                        placeholder: 'Search options...'
                    }) :
                    this.createSearchInput();
                
                this.dropdown.appendChild(this.searchInput);
            }
            
            // Create options container
            this.optionsContainer = this.utils ?
                this.utils.createElement('div', { className: this.config.classes.options }) :
                this.createOptionsContainer();
            
            // Assemble structure
            this.trigger.appendChild(this.valueElement);
            this.trigger.appendChild(icon);
            this.dropdown.appendChild(this.optionsContainer);
            this.wrapper.appendChild(this.trigger);
            this.wrapper.appendChild(this.dropdown);
            this.appendChild(this.wrapper);
            
            // Render options
            this.renderOptions();
        }

        createBasicStructure() {
            this.innerHTML = `
                <div class="wb-select-wrapper">
                    <div class="wb-select-trigger" role="combobox" tabindex="0">
                        <div class="wb-select-value"></div>
                        <div class="wb-select-icon">▼</div>
                    </div>
                    <div class="wb-select-dropdown" role="listbox">
                        <div class="wb-select-options"></div>
                    </div>
                </div>
            `;
            
            this.wrapper = this.querySelector('.wb-select-wrapper');
            this.trigger = this.querySelector('.wb-select-trigger');
            this.valueElement = this.querySelector('.wb-select-value');
            this.dropdown = this.querySelector('.wb-select-dropdown');
            this.optionsContainer = this.querySelector('.wb-select-options');
        }

        renderOptions() {
            if (!this.optionsContainer) return;
            
            this.optionsContainer.innerHTML = '';
            
            let currentGroup = null;
            let groupContainer = null;
            
            this._filteredOptions.forEach((option, index) => {
                // Handle groups
                if (option.group && option.group !== currentGroup) {
                    currentGroup = option.group;
                    
                    const groupLabel = this.utils ?
                        this.utils.createElement('div', {
                            className: this.config.classes.groupLabel,
                            textContent: option.group
                        }) :
                        this.createGroupLabel(option.group);
                    
                    groupContainer = this.utils ?
                        this.utils.createElement('div', { className: this.config.classes.group }) :
                        this.createGroup();
                    
                    this.optionsContainer.appendChild(groupLabel);
                    this.optionsContainer.appendChild(groupContainer);
                } else if (!option.group && currentGroup) {
                    currentGroup = null;
                    groupContainer = null;
                }
                
                // Create option element
                const optionElement = this.utils ?
                    this.utils.createElement('div', {
                        className: this.config.classes.option,
                        'data-value': option.value,
                        'data-index': index,
                        role: 'option',
                        'aria-selected': this._selectedValues.includes(option.value) ? 'true' : 'false'
                    }) :
                    this.createOptionElement(option, index);
                
                optionElement.textContent = option.text;
                
                // Apply states
                if (this._selectedValues.includes(option.value)) {
                    optionElement.classList.add(this.config.classes.states.selected);
                }
                
                if (option.disabled) {
                    optionElement.classList.add(this.config.classes.states.disabled);
                }
                
                if (index === this._highlightedIndex) {
                    optionElement.classList.add(this.config.classes.states.highlighted);
                }
                
                // Add to appropriate container
                if (groupContainer) {
                    groupContainer.appendChild(optionElement);
                } else {
                    this.optionsContainer.appendChild(optionElement);
                }
            });
        }

        applyAttributes() {
            // Apply size
            const size = this.getAttribute('size') || this.config.defaults.size;
            this.setSize(size);
            
            // Apply disabled state
            if (this.hasAttribute('disabled')) {
                this.setDisabled(true);
            }
            
            // Apply multiple state
            this.updateMultiple();
            
            // Apply searchable state
            this.updateSearchable();
            
            // Apply initial value
            const value = this.getAttribute('value');
            if (value) {
                this.setValue(value);
            }
            
            // Update placeholder
            this.updatePlaceholder();
        }

        setupEventListeners() {
            if (this.trigger) {
                this.trigger.addEventListener('click', this.handleTriggerClick);
                this.trigger.addEventListener('keydown', this.handleKeyDown);
            }
            
            if (this.searchInput) {
                this.searchInput.addEventListener('input', this.handleSearch);
                this.searchInput.addEventListener('keydown', this.handleKeyDown);
            }
            
            if (this.optionsContainer) {
                this.optionsContainer.addEventListener('click', this.handleOptionClick);
            }
            
            // Global click listener for closing dropdown
            document.addEventListener('click', this.handleDocumentClick);
        }

        // Event handlers
        handleTriggerClick(event) {
            event.stopPropagation();
            
            if (this.hasAttribute('disabled')) return;
            
            if (this._isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        handleKeyDown(event) {
            if (this.hasAttribute('disabled')) return;
            
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (!this._isOpen) {
                        this.open();
                    } else {
                        this.highlightNext();
                    }
                    break;
                
                case 'ArrowUp':
                    event.preventDefault();
                    if (this._isOpen) {
                        this.highlightPrevious();
                    }
                    break;
                
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    if (!this._isOpen) {
                        this.open();
                    } else if (this._highlightedIndex >= 0) {
                        this.selectOption(this._filteredOptions[this._highlightedIndex]);
                    }
                    break;
                
                case 'Escape':
                    event.preventDefault();
                    this.close();
                    break;
                
                case 'Home':
                    event.preventDefault();
                    if (this._isOpen) {
                        this.highlightFirst();
                    }
                    break;
                
                case 'End':
                    event.preventDefault();
                    if (this._isOpen) {
                        this.highlightLast();
                    }
                    break;
            }
        }

        handleDocumentClick(event) {
            if (!this.contains(event.target)) {
                this.close();
            }
        }

        handleSearch(event) {
            this._searchTerm = event.target.value.toLowerCase();
            this.filterOptions();
            this.renderOptions();
            this._highlightedIndex = 0;
            this.updateHighlight();
            
            // Dispatch search event
            this.dispatchEvent(new CustomEvent(this.config.events.search, {
                detail: { searchTerm: this._searchTerm },
                bubbles: true
            }));
        }

        handleOptionClick(event) {
            const optionElement = event.target.closest(`.${this.config.classes.option}`);
            if (!optionElement || optionElement.classList.contains(this.config.classes.states.disabled)) {
                return;
            }
            
            const index = parseInt(optionElement.dataset.index);
            const option = this._filteredOptions[index];
            
            if (option) {
                this.selectOption(option);
            }
        }

        // Public API methods
        open() {
            if (this._isOpen || this.hasAttribute('disabled')) return;
            
            this._isOpen = true;
            this.wrapper.classList.add(this.config.classes.states.open);
            this.trigger.setAttribute('aria-expanded', 'true');
            
            // Focus search input if available
            if (this.searchInput) {
                setTimeout(() => this.searchInput.focus(), 0);
            }
            
            // Reset highlight
            this._highlightedIndex = this._selectedValues.length > 0 ? 
                this._filteredOptions.findIndex(opt => opt.value === this._selectedValues[0]) : 0;
            this.updateHighlight();
            
            // Dispatch open event
            this.dispatchEvent(new CustomEvent(this.config.events.open, {
                detail: { select: this },
                bubbles: true
            }));
        }

        close() {
            if (!this._isOpen) return;
            
            this._isOpen = false;
            this.wrapper.classList.remove(this.config.classes.states.open);
            this.trigger.setAttribute('aria-expanded', 'false');
            
            // Clear search
            if (this.searchInput) {
                this.searchInput.value = '';
                this._searchTerm = '';
                this.filterOptions();
                this.renderOptions();
            }
            
            // Focus trigger
            this.trigger.focus();
            
            // Dispatch close event
            this.dispatchEvent(new CustomEvent(this.config.events.close, {
                detail: { select: this },
                bubbles: true
            }));
        }

        selectOption(option) {
            if (option.disabled) return;
            
            const isMultiple = this.hasAttribute('multiple');
            
            if (isMultiple) {
                const index = this._selectedValues.indexOf(option.value);
                if (index >= 0) {
                    // Deselect
                    this._selectedValues.splice(index, 1);
                } else {
                    // Select
                    this._selectedValues.push(option.value);
                }
            } else {
                // Single select
                this._selectedValues = [option.value];
                this.close();
            }
            
            this.updateDisplay();
            this.renderOptions();
            
            // Update value attribute
            this.setAttribute('value', isMultiple ? 
                this._selectedValues.join(',') : 
                this._selectedValues[0] || ''
            );
            
            // Dispatch change event
            this.dispatchEvent(new CustomEvent(this.config.events.change, {
                detail: { 
                    value: isMultiple ? this._selectedValues : this._selectedValues[0],
                    option: option,
                    select: this
                },
                bubbles: true
            }));
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
            const isMultiple = this.hasAttribute('multiple');
            return isMultiple ? this._selectedValues : this._selectedValues[0] || null;
        }

        setDisabled(disabled) {
            if (disabled) {
                this.setAttribute('disabled', '');
                this.wrapper.classList.add(this.config.classes.states.disabled);
                this.trigger.setAttribute('tabindex', '-1');
            } else {
                this.removeAttribute('disabled');
                this.wrapper.classList.remove(this.config.classes.states.disabled);
                this.trigger.setAttribute('tabindex', '0');
            }
        }

        setSize(size) {
            // Remove existing size classes
            Object.values(this.config.classes.sizes).forEach(cls => {
                if (cls) this.wrapper.classList.remove(cls);
            });
            
            // Add new size class
            const sizeClass = this.config.classes.sizes[size];
            if (sizeClass) {
                this.wrapper.classList.add(sizeClass);
            }
        }

        addOption(option) {
            this._options.push(option);
            this.filterOptions();
            this.renderOptions();
        }

        removeOption(value) {
            this._options = this._options.filter(opt => opt.value !== value);
            this._selectedValues = this._selectedValues.filter(val => val !== value);
            this.filterOptions();
            this.renderOptions();
            this.updateDisplay();
        }

        clear() {
            this._selectedValues = [];
            this.updateDisplay();
            this.renderOptions();
            this.setAttribute('value', '');
        }

        setOptions(optionsData) {
            if (!optionsData) return;
            
            try {
                // Handle both JSON string and array - schema-driven approach
                const options = typeof optionsData === 'string' ? 
                    JSON.parse(optionsData) : optionsData;
                
                if (Array.isArray(options)) {
                    // Convert schema format to internal format
                    this._options = options.map(opt => ({
                        value: opt.value,
                        text: opt.label || opt.text || opt.value,
                        disabled: opt.disabled || false,
                        selected: opt.selected || false,
                        group: opt.group || null
                    }));
                    
                    // Update filtered options and re-render
                    this.filterOptions();
                    this.renderOptions();
                    this.updateDisplay();
                    
                    if (window.WBEventLog) {
                        WBEventLog.logInfo(`WB Select: Options loaded from schema - ${this._options.length} options`, { 
                            component: 'wb-select', 
                            method: 'setOptions', 
                            optionsCount: this._options.length 
                        });
                    } else {
                        console.log(`📋 WB Select: Options loaded from schema - ${this._options.length} options`);
                    }
                } else {
                    if (window.WBEventLog) {
                        WBEventLog.logWarning('WB Select: Options data is not an array', { 
                            component: 'wb-select', 
                            method: 'setOptions', 
                            dataType: typeof options 
                        });
                    } else {
                        console.warn('📋 WB Select: Options data is not an array');
                    }
                }
            } catch (error) {
                if (window.WBEventLog) {
                    WBEventLog.logError('WB Select: Failed to parse options JSON', { 
                        component: 'wb-select', 
                        method: 'setOptions', 
                        error: error.message,
                        data: optionsData 
                    });
                } else {
                    console.error('📋 WB Select: Failed to parse options JSON:', error);
                }
            }
        }

        // Helper methods
        filterOptions() {
            if (!this._searchTerm) {
                this._filteredOptions = [...this._options];
            } else {
                this._filteredOptions = this._options.filter(option =>
                    option.text.toLowerCase().includes(this._searchTerm)
                );
            }
        }

        updateDisplay() {
            if (!this.valueElement) return;
            
            const isMultiple = this.hasAttribute('multiple');
            const placeholder = this.getAttribute('placeholder') || this.config.defaults.placeholder;
            
            if (this._selectedValues.length === 0) {
                this.valueElement.innerHTML = `<span class="${this.config.classes.placeholder}">${placeholder}</span>`;
            } else if (isMultiple) {
                // Show tags for multiple selection
                const tags = this._selectedValues.map(value => {
                    const option = this._options.find(opt => opt.value === value);
                    return option ? `<span class="${this.config.classes.tag}">${option.text}</span>` : '';
                }).join('');
                this.valueElement.innerHTML = tags;
            } else {
                // Show single selected value
                const option = this._options.find(opt => opt.value === this._selectedValues[0]);
                this.valueElement.textContent = option ? option.text : '';
            }
        }

        updatePlaceholder() {
            this.updateDisplay();
        }

        updateMultiple() {
            const isMultiple = this.hasAttribute('multiple');
            
            if (isMultiple) {
                this.wrapper.classList.add(this.config.classes.states.multiple);
            } else {
                this.wrapper.classList.remove(this.config.classes.states.multiple);
                // Convert to single selection if needed
                if (this._selectedValues.length > 1) {
                    this._selectedValues = [this._selectedValues[0]];
                    this.updateDisplay();
                }
            }
        }

        updateSearchable() {
            const isSearchable = this.hasAttribute('searchable');
            
            if (isSearchable) {
                this.wrapper.classList.add(this.config.classes.states.searchable);
                if (!this.searchInput && this.dropdown) {
                    this.createSearchInput();
                    this.dropdown.insertBefore(this.searchInput, this.optionsContainer);
                }
            } else {
                this.wrapper.classList.remove(this.config.classes.states.searchable);
                if (this.searchInput) {
                    this.searchInput.remove();
                    this.searchInput = null;
                }
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

        highlightFirst() {
            this._highlightedIndex = 0;
            this.updateHighlight();
        }

        highlightLast() {
            this._highlightedIndex = this._filteredOptions.length - 1;
            this.updateHighlight();
        }

        updateHighlight() {
            // Remove existing highlights
            this.optionsContainer.querySelectorAll(`.${this.config.classes.states.highlighted}`)
                .forEach(el => el.classList.remove(this.config.classes.states.highlighted));
            
            // Add highlight to current option
            if (this._highlightedIndex >= 0) {
                const optionElement = this.optionsContainer.querySelector(`[data-index="${this._highlightedIndex}"]`);
                if (optionElement) {
                    optionElement.classList.add(this.config.classes.states.highlighted);
                    optionElement.scrollIntoView({ block: 'nearest' });
                }
            }
        }

        // Fallback element creation methods
        createWrapper() {
            const div = document.createElement('div');
            div.className = 'wb-select-wrapper';
            return div;
        }

        createTrigger() {
            const div = document.createElement('div');
            div.className = 'wb-select-trigger';
            div.setAttribute('role', 'combobox');
            div.setAttribute('aria-expanded', 'false');
            div.setAttribute('aria-haspopup', 'listbox');
            div.setAttribute('tabindex', '0');
            return div;
        }

        createValueElement() {
            const div = document.createElement('div');
            div.className = 'wb-select-value';
            return div;
        }

        createIcon() {
            const div = document.createElement('div');
            div.className = 'wb-select-icon';
            div.innerHTML = '▼';
            return div;
        }

        createDropdown() {
            const div = document.createElement('div');
            div.className = 'wb-select-dropdown';
            div.setAttribute('role', 'listbox');
            return div;
        }

        createSearchInput() {
            const input = document.createElement('input');
            input.className = 'wb-select-search';
            input.type = 'text';
            input.placeholder = 'Search options...';
            return input;
        }

        createOptionsContainer() {
            const div = document.createElement('div');
            div.className = 'wb-select-options';
            return div;
        }

        createGroupLabel(text) {
            const div = document.createElement('div');
            div.className = 'wb-select-group-label';
            div.textContent = text;
            return div;
        }

        createGroup() {
            const div = document.createElement('div');
            div.className = 'wb-select-group';
            return div;
        }

        createOptionElement(option, index) {
            const div = document.createElement('div');
            div.className = 'wb-select-option';
            div.setAttribute('data-value', option.value);
            div.setAttribute('data-index', index);
            div.setAttribute('role', 'option');
            div.setAttribute('aria-selected', this._selectedValues.includes(option.value) ? 'true' : 'false');
            return div;
        }


        cleanup() {
            document.removeEventListener('click', this.handleDocumentClick);
            
            if (this.trigger) {
                this.trigger.removeEventListener('click', this.handleTriggerClick);
                this.trigger.removeEventListener('keydown', this.handleKeyDown);
            }
            
            if (this.searchInput) {
                this.searchInput.removeEventListener('input', this.handleSearch);
                this.searchInput.removeEventListener('keydown', this.handleKeyDown);
            }
            
            if (this.optionsContainer) {
                this.optionsContainer.removeEventListener('click', this.handleOptionClick);
            }
        }

        dispatchReady() {
            if (this.utils) {
                this.utils.EventDispatcher.dispatchReady('wb-select', this.config);
            } else {
                this.dispatchEvent(new CustomEvent(this.config.events.ready, {
                    detail: { component: 'wb-select', config: this.config },
                    bubbles: true
                }));
            }
            
            if (window.WBEventLog) {
                WBEventLog.logSuccess('WB Select Web Component: Initialized successfully', { 
                    component: 'wb-select', 
                    method: 'dispatchReady', 
                    line: 1025 
                });
            } else {
                console.log('📋 WB Select Web Component: Initialized successfully');
            }
        }
    }

    // Register the custom element
    if (customElements && !customElements.get('wb-select')) {
        customElements.define('wb-select', WBSelect);
        if (window.WBEventLog) {
            WBEventLog.logSuccess('WB Select Web Component: Custom element registered', { 
                component: 'wb-select', 
                method: 'componentRegistration', 
                line: 1032 
            });
        } else {
            console.log('📋 WB Select Web Component: Custom element registered');
        }
        
        // Register with WBComponentRegistry if available
        if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
            window.WBComponentRegistry.register('wb-select', WBSelect, ['wb-event-log'], {
                version: '1.0.0',
                type: 'form',
                role: 'ui-element',
                description: 'Advanced select dropdown component with search, multi-select, and custom styling',
                api: {
                    static: ['create'],
                    events: ['change', 'select', 'open', 'close', 'search'],
                    attributes: ['options', 'selected', 'multiple', 'searchable', 'placeholder', 'disabled'],
                    methods: ['render', 'setOptions', 'getSelected', 'setSelected', 'open', 'close']
                },
                priority: 4 // UI component depends on infrastructure
            });
        }
    } else if (customElements.get('wb-select')) {
        if (window.WBEventLog) {
            WBEventLog.logInfo('WB Select Web Component: Already registered', { 
                component: 'wb-select', 
                method: 'componentRegistration', 
                line: 1051 
            });
        } else {
            console.log('📋 WB Select Web Component: Already registered');
        }
    } else {
        if (window.WBEventLog) {
            WBEventLog.logError('WB Select Web Component: Custom Elements not supported', { 
                component: 'wb-select', 
                method: 'componentRegistration', 
                line: 1053 
            });
        } else {
            console.error('📋 WB Select Web Component: Custom Elements not supported');
        }
    }

    // Compositional Namespace
    if (!window.WB) window.WB = { components: {}, utils: {} };
    window.WB.components.WBSelect = WBSelect;
    
    // Expose for backward compatibility
    window.WBSelect = WBSelect;

// ES6 Module Exports
export { WBSelect };
export default WBSelect;