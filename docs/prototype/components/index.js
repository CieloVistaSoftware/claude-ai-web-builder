// WB Components Index Page JavaScript
class ComponentsIndex {
    constructor() {
        this.components = [
            // UI Components
            {
                name: 'wb-button',
                category: 'ui',
                status: 'complete',
                type: 'Web Component',
                description: 'Customizable button with variants and themes',
                demo: 'wb-button/wb-button-demo.html',
                docs: 'wb-button/wb-button.md'
            },
            {
                name: 'wb-color-picker',
                category: 'ui',
                status: 'complete',
                type: 'Component',
                description: 'Color picker with Material Design support',
                demo: 'wb-color-picker/wb-color-picker-demo.html',
                docs: 'wb-color-picker/wb-color-picker.md'
            },
            {
                name: 'wb-slider',
                category: 'ui',
                status: 'complete',
                type: 'Component',
                description: 'Range slider for numeric inputs',
                demo: 'wb-slider/wb-slider-demo.html',
                docs: 'wb-slider/wb-slider.md'
            },
            {
                name: 'wb-toggle',
                category: 'ui',
                status: 'complete',
                type: 'Component',
                description: 'Toggle switch component',
                demo: 'wb-toggle/wb-toggle-demo.html',
                docs: 'wb-toggle/wb-toggle.md'
            },
            {
                name: 'wb-select',
                category: 'ui',
                status: 'complete',
                type: 'Web Component',
                description: 'Dropdown select component with dark mode',
                demo: 'wb-select/wb-select-demo.html',
                docs: 'wb-select/wb-select.md'
            },
            {
                name: 'wb-input',
                category: 'ui',
                status: 'broken',
                type: 'Component',
                description: 'Input elements for text entry',
                issues: 'Input elements not functional - users cannot enter text',
                demo: 'wb-input/wb-input-demo.html',
                docs: 'wb-input/wb-input.md'
            },
            {
                name: 'wb-modal',
                category: 'ui',
                status: 'complete',
                type: 'Component',
                description: 'Modal dialog component',
                demo: 'wb-modal/wb-modal-demo.html',
                docs: 'wb-modal/wb-modal.md'
            },
            {
                name: 'wb-nav',
                category: 'ui',
                status: 'complete',
                type: 'Component',
                description: 'Navigation menu component',
                demo: 'wb-nav/wb-nav-demo.html',
                docs: 'wb-nav/wb-nav.md'
            },

            // Data Display Components
            {
                name: 'wb-table',
                category: 'data',
                status: 'complete',
                type: 'Web Component',
                description: 'Auto-header table that handles JSON data',
                demo: 'wb-table/wb-table-json-demo.html',
                docs: 'wb-table/wb-table.md'
            },
            {
                name: 'wb-status',
                category: 'data',
                status: 'complete',
                type: 'Component',
                description: 'Status bar for events and settings',
                demo: 'wb-status/wb-status-demo.html',
                docs: 'wb-status/wb-status.md'
            },
            {
                name: 'wb-log-error',
                category: 'data',
                status: 'complete',
                type: 'Web Component',
                description: 'Error logging with table display',
                demo: 'wb-log-error/wb-log-error-demo.html',
                docs: 'wb-log-error/wb-log-error.md'
            },

            // Layout Components
            {
                name: 'wb-viewport',
                category: 'layout',
                status: 'complete',
                type: 'Component',
                description: 'Viewport simulator for responsive testing',
                issues: 'Content appears darker in smaller viewports',
                demo: 'wb-viewport/wb-viewport-demo.html',
                docs: 'wb-viewport/wb-viewport.md'
            },
            {
                name: 'wb-control-panel',
                category: 'layout',
                status: 'complete',
                type: 'Component',
                description: 'Main control panel for website builder',
                demo: 'wb-control-panel/control-panel-demo.html',
                docs: 'wb-control-panel/control-panel.md'
            },

            // Content Components
            {
                name: 'wb-change-text',
                category: 'content',
                status: 'broken',
                type: 'Component',
                description: 'Text editing component',
                issues: 'Edit mode functionality not working, buttons need to be sticky'
            },
            {
                name: 'wb-image-insert',
                category: 'content',
                status: 'broken',
                type: 'Component',
                description: 'Image insertion component',
                issues: 'Insert function not working, needs edit button'
            },
            {
                name: 'wb-color-bars',
                category: 'content',
                status: 'complete',
                type: 'Component',
                description: 'Color visualization component with theme bars',
                demo: 'color-bars/color-bars-demo.html',
                docs: 'color-bars/color-bars.md'
            },

            // Utility Components
            {
                name: 'wb-event-log',
                category: 'utility',
                status: 'complete',
                type: 'Component',
                description: 'Passive event logging system',
                demo: 'wb-event-log/wb-event-log-demo.html',
                docs: 'wb-event-log/wb-event-log.md'
            },
            {
                name: 'wb-website-builder',
                category: 'utility',
                status: 'complete',
                type: 'Web Component',
                description: 'Complete website builder system',
                docs: 'wb-website-builder/wb-website-builder.md'
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderComponents();
    }

    setupEventListeners() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => this.handleFilterClick(tab));
        });

        // Search box
        const searchBox = document.getElementById('searchBox');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }

    handleFilterClick(tab) {
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter components
        const filter = tab.dataset.filter;
        let filtered = this.components;

        if (filter !== 'all') {
            filtered = this.components.filter(component => {
                switch (filter) {
                    case 'complete':
                        return component.status === 'complete';
                    case 'web-component':
                        return component.type === 'Web Component';
                    case 'broken':
                        return component.status === 'broken';
                    case 'ui':
                        return component.category === 'ui';
                    case 'data':
                        return component.category === 'data';
                    default:
                        return true;
                }
            });
        }

        this.renderComponents(filtered);
    }

    handleSearch(searchTerm) {
        const search = searchTerm.toLowerCase();
        const filtered = this.components.filter(component => 
            component.name.toLowerCase().includes(search) ||
            component.description.toLowerCase().includes(search) ||
            component.type.toLowerCase().includes(search)
        );
        this.renderComponents(filtered);
    }

    renderComponents(filteredComponents = this.components) {
        const categories = {
            'ui': document.getElementById('ui-components'),
            'data': document.getElementById('data-components'),
            'layout': document.getElementById('layout-components'),
            'content': document.getElementById('content-components'),
            'utility': document.getElementById('utility-components')
        };

        // Clear all categories
        Object.values(categories).forEach(container => {
            if (container) container.innerHTML = '';
        });

        // Render filtered components
        filteredComponents.forEach(component => {
            const container = categories[component.category];
            if (!container) return;

            const card = this.createComponentCard(component);
            container.appendChild(card);
        });
    }

    createComponentCard(component) {
        const card = document.createElement('div');
        card.className = 'component-card';
        
        const statusText = component.status === 'complete' ? '✅ Complete' : 
                          component.status === 'progress' ? '🔄 In Progress' : 
                          component.status === 'broken' ? '❌ Broken' : component.status;

        card.innerHTML = `
            <div class="component-header">
                <div class="component-name">${component.name}</div>
                <div class="status-badge status-${component.status}">
                    ${statusText}
                </div>
            </div>
            <div class="component-type">${component.type}</div>
            <div class="component-description">${component.description}</div>
            ${component.issues ? `
                <div class="issues">
                    <div class="issues-title">Issues:</div>
                    <div class="issues-text">${component.issues}</div>
                </div>
            ` : ''}
            <div class="component-links">
                ${component.demo ? `<a href="${component.demo}" class="component-link demo">Demo</a>` : ''}
                ${component.docs ? `<a href="${component.docs}" class="component-link docs">Docs</a>` : ''}
                <a href="${component.name}/" class="component-link">Files</a>
            </div>
        `;
        
        return card;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComponentsIndex();
});