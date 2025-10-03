// WB Table Web Component
// True web component that binds to data and uses first row as headers

class WBTable extends HTMLElement {
    constructor() {
        super();
        this.data = [];
        this.headers = [];
    }

    static get observedAttributes() {
        return ['data-source', 'data-json', 'striped', 'hover', 'bordered'];
    }

    connectedCallback() {
        this.render();
        this.loadCSS();
        
        // Handle JSON data attribute
        const jsonData = this.getAttribute('data-json');
        if (jsonData) {
            try {
                const data = JSON.parse(jsonData);
                this.setData(data);
            } catch (e) {
                console.error('WB Table: Invalid JSON data:', e);
            }
        }
        
        // Watch for data changes if data-source is provided
        const dataSource = this.getAttribute('data-source');
        if (dataSource && window[dataSource]) {
            this.watchDataSource(dataSource);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    loadCSS() {
        if (window.WBComponentUtils) {
            const cssPath = window.WBComponentUtils.getPath('wb-table.js', '../components/wb-table/') + 'wb-table.css';
            window.WBComponentUtils.loadCSS('wb-table', cssPath);
        } else {
            // Check if CSS is already loaded
            if (document.querySelector('link[href*="wb-table"]')) return;
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = this.getComponentPath() + 'wb-table.css';
            document.head.appendChild(link);
        }
    }

    getComponentPath() {
        const script = document.currentScript || 
                      Array.from(document.scripts).find(s => s.src.includes('wb-table'));
        if (script) {
            return script.src.substring(0, script.src.lastIndexOf('/') + 1);
        }
        return './components/wb-table/';
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
        if (typeof data[0] === 'object' && data[0] !== null) {
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
        this.dispatchEvent(new CustomEvent('wb-table:dataChanged', {
            detail: { headers: this.headers, data: this.data, rowCount: this.data.length }
        }));
    }

    // Add single row (JSON object or array)
    addRow(rowData) {
        // Handle JSON object
        if (typeof rowData === 'object' && rowData !== null && !Array.isArray(rowData)) {
            // If no headers set, use object keys as headers
            if (this.headers.length === 0) {
                this.headers = Object.keys(rowData);
                this.render();
                return;
            }
            
            // Convert object to array using existing headers order
            const rowArray = this.headers.map(key => rowData[key] || '');
            this.data.unshift(rowArray);
        }
        // Handle array data
        else if (Array.isArray(rowData)) {
            // If no headers set, use this as headers
            if (this.headers.length === 0) {
                this.headers = rowData;
                this.render();
                return;
            }
            
            // Add to beginning (newest first)
            this.data.unshift(rowData);
        }
        else {
            return; // Invalid data type
        }
        
        this.render();
        
        this.dispatchEvent(new CustomEvent('wb-table:rowAdded', {
            detail: { row: rowData, rowCount: this.data.length }
        }));
    }

    // Clear all data
    clear() {
        this.data = [];
        this.render();
        
        this.dispatchEvent(new CustomEvent('wb-table:cleared', {
            detail: { rowCount: 0 }
        }));
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
                this.setData([...source]); // Copy to avoid reference issues
            }
        };

        // Initial check
        checkData();

        // Set up periodic checking (simple approach)
        this.dataWatcher = setInterval(checkData, 1000);
    }

    disconnectedCallback() {
        if (this.dataWatcher) {
            clearInterval(this.dataWatcher);
        }
    }

    render() {
        const striped = this.hasAttribute('striped');
        const hover = this.hasAttribute('hover');
        const bordered = this.hasAttribute('bordered');

        let tableClass = 'wb-table';
        if (striped) tableClass += ' wb-table--striped';
        if (hover) tableClass += ' wb-table--hover';
        if (bordered) tableClass += ' wb-table--bordered';

        this.innerHTML = `
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
customElements.define('wb-table', WBTable);

// Also provide a simple API for backward compatibility
window.WBTable = {
    create: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('WB Table: Container not found:', containerId);
            return null;
        }

        const table = document.createElement('wb-table');
        table.setAttribute('striped', '');
        table.setAttribute('hover', '');
        table.setAttribute('bordered', '');
        container.appendChild(table);

        return {
            setData: (data) => table.setData(data),
            addRow: (row) => table.addRow(row),
            clear: () => table.clear(),
            getRowCount: () => table.getRowCount()
        };
    }
};

console.log('📊 WB Table Web Component: Ready!');