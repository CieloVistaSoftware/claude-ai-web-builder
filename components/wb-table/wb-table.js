/**
 * WB Table Web Component
 * 
 * True web component that binds to data and uses first row as headers.
 * 
 * @example
 * <wb-table striped hover></wb-table>
 * 
 * @version 2.0.0
 */

import { WBBaseComponent } from '../wb-base/wb-base.js';
import { loadComponentCSS } from '../wb-css-loader/wb-css-loader.js';

class WBTable extends WBBaseComponent {
    static useShadow = true;
    
    constructor() {
        super();
        this.data = [];
        this.headers = [];
        this.dataWatcher = null;
    }

    static get observedAttributes() {
        return ['data-source', 'data-json', 'striped', 'hover', 'bordered'];
    }

    async connectedCallback() {
        super.connectedCallback();
        
        this.logInfo('WBTable connecting');
        
        await loadComponentCSS(this, 'wb-table.css');
        this.render();
        
        // Handle JSON data attribute
        const jsonData = this.getAttribute('data-json');
        if (jsonData) {
            try {
                const data = JSON.parse(jsonData);
                this.setData(data);
            } catch (e) {
                this.logError('Invalid JSON data', { error: e.message });
            }
        }
        
        // Watch for data changes if data-source is provided
        const dataSource = this.getAttribute('data-source');
        if (dataSource && window[dataSource]) {
            this.watchDataSource(dataSource);
        }
        
        this.fireEvent('wb-table:ready', { component: 'wb-table' });
        this.logInfo('WBTable ready');
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        
        if (this.dataWatcher) {
            clearInterval(this.dataWatcher);
            this.dataWatcher = null;
        }
        
        this.logDebug('WBTable disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        
        if (oldValue !== newValue) {
            this.render();
        }
    }

    // Property getters/setters
    get striped() {
        return this.hasAttribute('striped');
    }
    
    set striped(value) {
        if (value) {
            this.setAttribute('striped', '');
        } else {
            this.removeAttribute('striped');
        }
    }
    
    get hover() {
        return this.hasAttribute('hover');
    }
    
    set hover(value) {
        if (value) {
            this.setAttribute('hover', '');
        } else {
            this.removeAttribute('hover');
        }
    }
    
    get bordered() {
        return this.hasAttribute('bordered');
    }
    
    set bordered(value) {
        if (value) {
            this.setAttribute('bordered', '');
        } else {
            this.removeAttribute('bordered');
        }
    }

    // Set data programmatically (JSON objects)
    setData(data) {
        if (!Array.isArray(data) || data.length === 0) {
            this.data = [];
            this.headers = [];
            this.render();
            return;
        }

        // If first item is an object, extract headers from keys
        if (typeof data[0] === 'object' && data[0] !== null && !Array.isArray(data[0])) {
            this.headers = Object.keys(data[0]);
            this.data = data.map(obj => this.headers.map(key => obj[key]));
        } 
        // If first item is array, treat first row as headers
        else if (Array.isArray(data[0])) {
            this.headers = data[0];
            this.data = data.slice(1);
        }
        // Otherwise treat as simple array data
        else {
            this.headers = ['Value'];
            this.data = data.map(item => [item]);
        }
        
        this.render();
        
        this.fireEvent('wb-table:dataChanged', {
            headers: this.headers, 
            rowCount: this.data.length
        });
        
        this.logDebug('WBTable data set', { rowCount: this.data.length });
    }

    // Add single row (JSON object or array)
    addRow(rowData) {
        if (typeof rowData === 'object' && rowData !== null && !Array.isArray(rowData)) {
            if (this.headers.length === 0) {
                this.headers = Object.keys(rowData);
                this.render();
                return;
            }
            const rowArray = this.headers.map(key => rowData[key] || '');
            this.data.unshift(rowArray);
        }
        else if (Array.isArray(rowData)) {
            if (this.headers.length === 0) {
                this.headers = rowData;
                this.render();
                return;
            }
            this.data.unshift(rowData);
        }
        else {
            this.logError('Invalid row data type');
            return;
        }
        
        this.render();
        
        this.fireEvent('wb-table:rowAdded', { rowCount: this.data.length });
        this.logDebug('WBTable row added', { rowCount: this.data.length });
    }

    // Clear all data
    clear() {
        this.data = [];
        this.render();
        
        this.fireEvent('wb-table:cleared', { rowCount: 0 });
        this.logDebug('WBTable cleared');
    }

    // Get row count
    getRowCount() {
        return this.data.length;
    }

    // Watch external data source
    watchDataSource(dataSourceName) {
        const checkData = () => {
            const source = window[dataSourceName];
            if (source && Array.isArray(source) && source.length > 0) {
                this.setData([...source]);
            }
        };

        checkData();
        this.dataWatcher = setInterval(checkData, 1000);
    }

    render() {
        if (!this.shadowRoot) return;
        
        let tableClass = 'wb-table';
        if (this.striped) tableClass += ' wb-table--striped';
        if (this.hover) tableClass += ' wb-table--hover';
        if (this.bordered) tableClass += ' wb-table--bordered';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('./wb-table.css', import.meta.url).href}">
            <div class="wb-table-container">
                <table class="${tableClass}">
                    <thead class="wb-table-header">
                        ${this.renderHeaders()}
                    </thead>
                    <tbody class="wb-table-body">
                        ${this.renderRows()}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderHeaders() {
        if (this.headers.length === 0) return '';
        
        return `
            <tr>
                ${this.headers.map(header => `<th>${this.escapeHtml(header)}</th>`).join('')}
            </tr>
        `;
    }

    renderRows() {
        if (this.data.length === 0) {
            const colSpan = this.headers.length || 1;
            return `
                <tr>
                    <td colspan="${colSpan}" class="wb-table-empty">No data available</td>
                </tr>
            `;
        }

        return this.data.map(row => `
            <tr>
                ${row.map(cell => `<td>${this.escapeHtml(cell)}</td>`).join('')}
            </tr>
        `).join('');
    }

    escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }
}

// Register the web component
if (!customElements.get('wb-table')) {
    customElements.define('wb-table', WBTable);
}

// Register with WBComponentRegistry if available
if (window.WBComponentRegistry && typeof window.WBComponentRegistry.register === 'function') {
    window.WBComponentRegistry.register('wb-table', WBTable, ['wb-event-log'], {
        version: '2.0.0',
        type: 'data',
        role: 'ui-element',
        description: 'Data table component with data binding support',
        api: {
            events: ['wb-table:ready', 'wb-table:dataChanged', 'wb-table:rowAdded', 'wb-table:cleared'],
            attributes: ['data-source', 'data-json', 'striped', 'hover', 'bordered'],
            methods: ['setData', 'addRow', 'clear', 'getRowCount', 'render']
        },
        priority: 5
    });
}

// Compositional Namespace
if (!window.WB) window.WB = { components: {}, utils: {} };
window.WB.components.WBTable = WBTable;
window.WBTable = WBTable;

export { WBTable };
export default WBTable;
