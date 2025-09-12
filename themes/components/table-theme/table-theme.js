/**
 * Table Theme Functionality
 * 
 * This script adds optional functionality to themed tables:
 * - Sorting
 * - Filtering
 * - Pagination (if enabled)
 */

class TableTheme {
    constructor(tableElement, options = {}) {
        this.table = tableElement;
        this.options = {
            sortable: options.sortable || false,
            filterable: options.filterable || false,
            pageSize: options.pageSize || 0, // 0 means no pagination
            ...options
        };
        
        this.init();
    }
    
    init() {
        if (this.options.sortable) {
            this.initSorting();
        }
        
        if (this.options.filterable) {
            this.initFiltering();
        }
        
        if (this.options.pageSize > 0) {
            this.initPagination();
        }
    }
    
    initSorting() {
        const headers = this.table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                this.sortTable(index);
            });
            
            // Add sort indicator
            const sortIndicator = document.createElement('span');
            sortIndicator.className = 'sort-indicator';
            sortIndicator.textContent = ' ↕';
            sortIndicator.style.fontSize = '0.8em';
            header.appendChild(sortIndicator);
        });
    }
    
    sortTable(columnIndex) {
        const tbody = this.table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const headers = this.table.querySelectorAll('th');
        const currentHeader = headers[columnIndex];
        
        // Get current direction
        const currentDirection = currentHeader.getAttribute('data-sort-direction') || 'asc';
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        
        // Reset all headers
        headers.forEach(h => {
            h.setAttribute('data-sort-direction', '');
            const indicator = h.querySelector('.sort-indicator');
            if (indicator) indicator.textContent = ' ↕';
        });
        
        // Set new direction
        currentHeader.setAttribute('data-sort-direction', newDirection);
        const indicator = currentHeader.querySelector('.sort-indicator');
        if (indicator) {
            indicator.textContent = newDirection === 'asc' ? ' ↑' : ' ↓';
        }
        
        // Sort rows
        const sortedRows = rows.sort((a, b) => {
            const cellA = a.cells[columnIndex].textContent.trim();
            const cellB = b.cells[columnIndex].textContent.trim();
            
            if (!isNaN(cellA) && !isNaN(cellB)) {
                return newDirection === 'asc' 
                    ? parseFloat(cellA) - parseFloat(cellB)
                    : parseFloat(cellB) - parseFloat(cellA);
            } else {
                return newDirection === 'asc'
                    ? cellA.localeCompare(cellB)
                    : cellB.localeCompare(cellA);
            }
        });
        
        // Reorder table
        tbody.innerHTML = '';
        sortedRows.forEach(row => {
            tbody.appendChild(row);
        });
    }
    
    initFiltering() {
        // Create filter input
        const filterContainer = document.createElement('div');
        filterContainer.className = 'table-filter-container';
        filterContainer.style.margin = '10px 0';
        
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.className = 'table-filter';
        filterInput.placeholder = 'Filter table...';
        filterInput.style.padding = '8px';
        filterInput.style.width = '100%';
        
        filterContainer.appendChild(filterInput);
        this.table.parentNode.insertBefore(filterContainer, this.table);
        
        // Add filter functionality
        filterInput.addEventListener('input', () => {
            const filterText = filterInput.value.toLowerCase();
            const rows = this.table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filterText) ? '' : 'none';
            });
        });
    }
    
    initPagination() {
        const rows = this.table.querySelectorAll('tbody tr');
        const rowCount = rows.length;
        const pageCount = Math.ceil(rowCount / this.options.pageSize);
        
        if (pageCount <= 1) return; // No pagination needed
        
        this.currentPage = 1;
        
        // Create pagination container
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'table-pagination';
        paginationContainer.style.margin = '15px 0';
        paginationContainer.style.textAlign = 'center';
        
        for (let i = 1; i <= pageCount; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.style.margin = '0 5px';
            pageBtn.style.padding = '5px 10px';
            pageBtn.style.cursor = 'pointer';
            
            pageBtn.addEventListener('click', () => {
                this.goToPage(i);
            });
            
            paginationContainer.appendChild(pageBtn);
        }
        
        this.table.parentNode.insertBefore(paginationContainer, this.table.nextSibling);
        this.paginationContainer = paginationContainer;
        
        // Show first page
        this.goToPage(1);
    }
    
    goToPage(pageNum) {
        const rows = this.table.querySelectorAll('tbody tr');
        const startIndex = (pageNum - 1) * this.options.pageSize;
        const endIndex = startIndex + this.options.pageSize;
        
        rows.forEach((row, index) => {
            row.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
        });
        
        this.currentPage = pageNum;
        
        // Update pagination buttons
        const buttons = this.paginationContainer.querySelectorAll('button');
        buttons.forEach((btn, index) => {
            if (index + 1 === pageNum) {
                btn.style.backgroundColor = 'var(--primary)';
                btn.style.color = 'var(--light)';
            } else {
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }
        });
    }
}

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Find all table-theme tables and initialize with default options
    const tables = document.querySelectorAll('.table-theme[data-auto-init]');
    tables.forEach(table => {
        const options = {
            sortable: table.hasAttribute('data-sortable'),
            filterable: table.hasAttribute('data-filterable'),
            pageSize: parseInt(table.getAttribute('data-page-size') || '0')
        };
        
        new TableTheme(table, options);
    });
});