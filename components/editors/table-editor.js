/**
 * Table Editor Web Component
 * Usage: Include this script and add data-editable="true" to table elements
 */

(function() {
    'use strict';
    
    // Store for managing editor states
    const tableStates = new Map();
    let activeEditor = null;
    
    // Default table state
    const defaultState = {
        rows: 3,
        columns: 3,
        headers: true,
        striped: false,
        bordered: true,
        hover: false,
        size: 'medium',
        theme: 'light',
        responsive: true,
        data: [
            ['Header 1', 'Header 2', 'Header 3'],
            ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
            ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
        ]
    };
    
    // CSS styles for the editor
    const editorStyles = `
        .table-editor {
            position: fixed;
            z-index: 10000;
            background: #1f2937;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            border: 1px solid #374151;
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #f9fafb;
        }
        
        .table-editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid #374151;
        }
        
        .table-editor-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .table-editor-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
        }
        
        .table-editor-close:hover {
            color: #d1d5db;
        }
        
        .table-editor-content {
            padding: 16px;
        }
        
        .table-form-group {
            margin-bottom: 16px;
        }
        
        .table-form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #d1d5db;
            margin-bottom: 4px;
        }
        
        .table-form-input, .table-form-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #4b5563;
            background-color: #374151;
            color: #f9fafb;
            border-radius: 8px;
            font-size: 14px;
            box-sizing: border-box;
            font-family: inherit;
        }
        
        .table-form-input:focus, .table-form-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        .table-form-checkbox {
            margin-right: 8px;
        }
        
        .table-checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .table-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .table-data-editor {
            background: #374151;
            border: 1px solid #4b5563;
            border-radius: 8px;
            padding: 12px;
            margin-top: 8px;
        }
        
        .table-data-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .table-data-cell {
            border: 1px solid #6b7280;
            padding: 4px 8px;
            background: #1f2937;
            color: #f9fafb;
            font-size: 12px;
            min-width: 80px;
        }
        
        .table-data-cell:focus {
            outline: 2px solid #3b82f6;
            background: #111827;
        }
        
        .table-actions {
            margin-top: 12px;
            display: flex;
            gap: 8px;
        }
        
        .table-btn {
            padding: 6px 12px;
            border: 1px solid #4b5563;
            background: #374151;
            color: #f9fafb;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .table-btn:hover {
            background: #4b5563;
        }
        
        .table-editable {
            position: relative;
            cursor: pointer;
        }
        
        .table-editable:hover {
            outline: 2px dashed #3b82f6;
            outline-offset: 2px;
        }
        
        .table-edit-indicator {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 1000;
        }
        
        .table-editable:hover .table-edit-indicator {
            opacity: 1;
        }
        
        /* Table styling classes */
        .table-responsive {
            overflow-x: auto;
        }
        
        .table-striped tbody tr:nth-child(odd) {
            background-color: rgba(0, 0, 0, 0.05);
        }
        
        .table-bordered {
            border: 1px solid #dee2e6;
        }
        
        .table-bordered th, .table-bordered td {
            border: 1px solid #dee2e6;
        }
        
        .table-hover tbody tr:hover {
            background-color: rgba(0, 0, 0, 0.075);
        }
        
        .table-sm th, .table-sm td {
            padding: 0.25rem;
        }
        
        .table-lg th, .table-lg td {
            padding: 1rem;
        }
        
        .table-dark {
            background-color: #343a40;
            color: #fff;
        }
        
        .table-dark th, .table-dark td {
            border-color: #454d55;
        }
    `;
    
    // Inject CSS styles
    function injectStyles() {
        if (document.querySelector('#table-editor-styles')) return;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'table-editor-styles';
        styleSheet.textContent = editorStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Get current state of a table element
    function getTableState(element) {
        const id = element.dataset.tableEditorId || generateId();
        element.dataset.tableEditorId = id;
        
        if (!tableStates.has(id)) {
            const tableData = extractTableData(element);
            tableStates.set(id, {
                rows: tableData.length,
                columns: tableData[0] ? tableData[0].length : 3,
                headers: element.querySelector('thead') !== null,
                striped: element.classList.contains('table-striped'),
                bordered: element.classList.contains('table-bordered'),
                hover: element.classList.contains('table-hover'),
                size: element.classList.contains('table-sm') ? 'small' : 
                      element.classList.contains('table-lg') ? 'large' : 'medium',
                theme: element.classList.contains('table-dark') ? 'dark' : 'light',
                responsive: element.parentElement && element.parentElement.classList.contains('table-responsive'),
                data: tableData.length > 0 ? tableData : defaultState.data
            });
        }
        
        return tableStates.get(id);
    }
    
    // Extract data from existing table
    function extractTableData(table) {
        const data = [];
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('th, td');
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim() || '');
            });
            if (rowData.length > 0) {
                data.push(rowData);
            }
        });
        
        return data.length > 0 ? data : defaultState.data;
    }
    
    // Update table element with new state
    function updateTableElement(element, state) {
        // Store data attributes
        element.dataset.rows = state.rows;
        element.dataset.columns = state.columns;
        element.dataset.headers = state.headers;
        element.dataset.striped = state.striped;
        element.dataset.bordered = state.bordered;
        element.dataset.hover = state.hover;
        element.dataset.size = state.size;
        element.dataset.theme = state.theme;
        element.dataset.responsive = state.responsive;
        
        // Clear existing content
        element.innerHTML = '';
        
        // Apply CSS classes
        element.className = 'table table-editable';
        if (state.striped) element.classList.add('table-striped');
        if (state.bordered) element.classList.add('table-bordered');
        if (state.hover) element.classList.add('table-hover');
        if (state.size === 'small') element.classList.add('table-sm');
        if (state.size === 'large') element.classList.add('table-lg');
        if (state.theme === 'dark') element.classList.add('table-dark');
        
        // Handle responsive wrapper
        const parent = element.parentElement;
        if (state.responsive && !parent.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            parent.insertBefore(wrapper, element);
            wrapper.appendChild(element);
        } else if (!state.responsive && parent.classList.contains('table-responsive')) {
            const grandParent = parent.parentElement;
            grandParent.insertBefore(element, parent);
            grandParent.removeChild(parent);
        }
        
        // Create table content
        if (state.headers && state.data.length > 0) {
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            state.data[0].forEach(cellData => {
                const th = document.createElement('th');
                th.textContent = cellData;
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            element.appendChild(thead);
            
            // Create tbody with remaining rows
            if (state.data.length > 1) {
                const tbody = document.createElement('tbody');
                
                for (let i = 1; i < state.data.length; i++) {
                    const row = document.createElement('tr');
                    state.data[i].forEach(cellData => {
                        const td = document.createElement('td');
                        td.textContent = cellData;
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                }
                
                element.appendChild(tbody);
            }
        } else {
            // Create tbody without headers
            const tbody = document.createElement('tbody');
            
            state.data.forEach(rowData => {
                const row = document.createElement('tr');
                rowData.forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData;
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });
            
            element.appendChild(tbody);
        }
        
        // Add edit indicator
        addEditIndicator(element);
    }
    
    // Generate unique ID
    function generateId() {
        return 'table-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Create data editor table
    function createDataEditor(state, onUpdate) {
        const container = document.createElement('div');
        container.className = 'table-data-editor';
        
        const table = document.createElement('table');
        table.className = 'table-data-table';
        
        // Create editable table
        function rebuildTable() {
            table.innerHTML = '';
            
            state.data.forEach((rowData, rowIndex) => {
                const row = document.createElement('tr');
                
                rowData.forEach((cellData, colIndex) => {
                    const cell = document.createElement('input');
                    cell.className = 'table-data-cell';
                    cell.value = cellData;
                    cell.addEventListener('input', (e) => {
                        state.data[rowIndex][colIndex] = e.target.value;
                        onUpdate();
                    });
                    
                    const cellWrapper = document.createElement('td');
                    cellWrapper.appendChild(cell);
                    row.appendChild(cellWrapper);
                });
                
                table.appendChild(row);
            });
        }
        
        rebuildTable();
        container.appendChild(table);
        
        // Add action buttons
        const actions = document.createElement('div');
        actions.className = 'table-actions';
        
        const addRowBtn = document.createElement('button');
        addRowBtn.className = 'table-btn';
        addRowBtn.textContent = '+ Row';
        addRowBtn.addEventListener('click', () => {
            const newRow = new Array(state.columns).fill('');
            state.data.push(newRow);
            state.rows = state.data.length;
            rebuildTable();
            onUpdate();
        });
        
        const addColBtn = document.createElement('button');
        addColBtn.className = 'table-btn';
        addColBtn.textContent = '+ Column';
        addColBtn.addEventListener('click', () => {
            state.data.forEach(row => row.push(''));
            state.columns = state.data[0].length;
            rebuildTable();
            onUpdate();
        });
        
        const removeRowBtn = document.createElement('button');
        removeRowBtn.className = 'table-btn';
        removeRowBtn.textContent = '- Row';
        removeRowBtn.addEventListener('click', () => {
            if (state.data.length > 1) {
                state.data.pop();
                state.rows = state.data.length;
                rebuildTable();
                onUpdate();
            }
        });
        
        const removeColBtn = document.createElement('button');
        removeColBtn.className = 'table-btn';
        removeColBtn.textContent = '- Column';
        removeColBtn.addEventListener('click', () => {
            if (state.data[0] && state.data[0].length > 1) {
                state.data.forEach(row => row.pop());
                state.columns = state.data[0].length;
                rebuildTable();
                onUpdate();
            }
        });
        
        actions.appendChild(addRowBtn);
        actions.appendChild(addColBtn);
        actions.appendChild(removeRowBtn);
        actions.appendChild(removeColBtn);
        
        container.appendChild(actions);
        
        return container;
    }
    
    // Create editor interface
    function createEditor(tableElement) {
        const state = getTableState(tableElement);
        const rect = tableElement.getBoundingClientRect();
        
        const editor = document.createElement('div');
        editor.className = 'table-editor';
        
        // Position editor
        let x = rect.right + 10;
        let y = rect.top + window.scrollY;
        
        if (x + 400 > window.innerWidth) {
            x = rect.left - 410;
        }
        if (y + 600 > window.innerHeight + window.scrollY) {
            y = window.innerHeight + window.scrollY - 600;
        }
        if (y < window.scrollY) y = window.scrollY + 10;
        
        editor.style.left = x + 'px';
        editor.style.top = y + 'px';
        
        editor.innerHTML = `
            <div class="table-editor-header">
                <h3 class="table-editor-title">Edit Table</h3>
                <button class="table-editor-close" type="button">×</button>
            </div>
            <div class="table-editor-content">
                <div class="table-form-group">
                    <label class="table-form-label">Table Options</label>
                    <div class="table-checkbox-group">
                        <input type="checkbox" class="table-form-checkbox" id="table-headers" ${state.headers ? 'checked' : ''}>
                        <label for="table-headers">Headers</label>
                    </div>
                    <div class="table-checkbox-group">
                        <input type="checkbox" class="table-form-checkbox" id="table-striped" ${state.striped ? 'checked' : ''}>
                        <label for="table-striped">Striped Rows</label>
                    </div>
                    <div class="table-checkbox-group">
                        <input type="checkbox" class="table-form-checkbox" id="table-bordered" ${state.bordered ? 'checked' : ''}>
                        <label for="table-bordered">Bordered</label>
                    </div>
                    <div class="table-checkbox-group">
                        <input type="checkbox" class="table-form-checkbox" id="table-hover" ${state.hover ? 'checked' : ''}>
                        <label for="table-hover">Hover Effect</label>
                    </div>
                    <div class="table-checkbox-group">
                        <input type="checkbox" class="table-form-checkbox" id="table-responsive" ${state.responsive ? 'checked' : ''}>
                        <label for="table-responsive">Responsive</label>
                    </div>
                </div>
                
                <div class="table-grid-2">
                    <div class="table-form-group">
                        <label class="table-form-label">Size</label>
                        <select class="table-form-select" id="table-size">
                            <option value="small" ${state.size === 'small' ? 'selected' : ''}>Small</option>
                            <option value="medium" ${state.size === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="large" ${state.size === 'large' ? 'selected' : ''}>Large</option>
                        </select>
                    </div>
                    <div class="table-form-group">
                        <label class="table-form-label">Theme</label>
                        <select class="table-form-select" id="table-theme">
                            <option value="light" ${state.theme === 'light' ? 'selected' : ''}>Light</option>
                            <option value="dark" ${state.theme === 'dark' ? 'selected' : ''}>Dark</option>
                        </select>
                    </div>
                </div>
                
                <div class="table-form-group">
                    <label class="table-form-label">Table Data</label>
                    <div id="table-data-container"></div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const headersCheckbox = editor.querySelector('#table-headers');
        const stripedCheckbox = editor.querySelector('#table-striped');
        const borderedCheckbox = editor.querySelector('#table-bordered');
        const hoverCheckbox = editor.querySelector('#table-hover');
        const responsiveCheckbox = editor.querySelector('#table-responsive');
        const sizeSelect = editor.querySelector('#table-size');
        const themeSelect = editor.querySelector('#table-theme');
        const dataContainer = editor.querySelector('#table-data-container');
        const closeBtn = editor.querySelector('.table-editor-close');
        
        function updateState() {
            const newState = {
                ...state,
                headers: headersCheckbox.checked,
                striped: stripedCheckbox.checked,
                bordered: borderedCheckbox.checked,
                hover: hoverCheckbox.checked,
                responsive: responsiveCheckbox.checked,
                size: sizeSelect.value,
                theme: themeSelect.value
            };
            
            Object.assign(state, newState);
            tableStates.set(tableElement.dataset.tableEditorId, state);
            updateTableElement(tableElement, state);
        }
        
        // Create data editor
        const dataEditor = createDataEditor(state, updateState);
        dataContainer.appendChild(dataEditor);
        
        headersCheckbox.addEventListener('change', updateState);
        stripedCheckbox.addEventListener('change', updateState);
        borderedCheckbox.addEventListener('change', updateState);
        hoverCheckbox.addEventListener('change', updateState);
        responsiveCheckbox.addEventListener('change', updateState);
        sizeSelect.addEventListener('change', updateState);
        themeSelect.addEventListener('change', updateState);
        
        closeBtn.addEventListener('click', () => {
            closeEditor();
        });
        
        // Close editor when clicking outside
        function handleClickOutside(event) {
            if (!editor.contains(event.target) && event.target !== tableElement) {
                closeEditor();
            }
        }
        
        function closeEditor() {
            if (editor.parentNode) {
                editor.parentNode.removeChild(editor);
            }
            document.removeEventListener('mousedown', handleClickOutside);
            activeEditor = null;
        }
        
        setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);
        
        document.body.appendChild(editor);
        activeEditor = editor;
    }
    
    // Add edit indicator to editable table elements
    function addEditIndicator(tableElement) {
        if (!tableElement.querySelector('.table-edit-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'table-edit-indicator';
            indicator.innerHTML = '⚏';
            indicator.title = 'Click to edit';
            tableElement.appendChild(indicator);
        }
    }
    
    // Initialize editable table elements
    function initializeEditableTableElements() {
        const editableElements = document.querySelectorAll('table[data-editable="true"]');
        
        editableElements.forEach(element => {
            element.classList.add('table-editable');
            addEditIndicator(element);
            
            // Remove existing listeners to prevent duplicates
            element.removeEventListener('click', handleTableClick);
            element.addEventListener('click', handleTableClick);
        });
    }
    
    // Handle table element click
    function handleTableClick(event) {
        // Close any existing editor
        if (activeEditor) {
            activeEditor.parentNode.removeChild(activeEditor);
            activeEditor = null;
        }
        
        // Prevent default behavior when editing
        event.preventDefault();
        event.stopPropagation();
        
        createEditor(this);
    }
    
    // Auto-initialize when DOM is ready
    function initialize() {
        injectStyles();
        initializeEditableTableElements();
        
        // Watch for new table elements added to the page
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('table[data-editable="true"]')) {
                            node.classList.add('table-editable');
                            addEditIndicator(node);
                            node.addEventListener('click', handleTableClick);
                        }
                        
                        // Check children too
                        const editableElements = node.querySelectorAll && node.querySelectorAll('table[data-editable="true"]');
                        if (editableElements) {
                            editableElements.forEach(element => {
                                element.classList.add('table-editable');
                                addEditIndicator(element);
                                element.addEventListener('click', handleTableClick);
                            });
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Expose public API
    window.TableEditor = {
        init: initialize,
        makeEditable: function(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.setAttribute('data-editable', 'true');
                element.classList.add('table-editable');
                addEditIndicator(element);
                element.addEventListener('click', handleTableClick);
            });
        },
        getState: function(element) {
            return getTableState(element);
        },
        setState: function(element, state) {
            const id = element.dataset.tableEditorId || generateId();
            element.dataset.tableEditorId = id;
            tableStates.set(id, state);
            updateTableElement(element, state);
        }
    };
    
})();