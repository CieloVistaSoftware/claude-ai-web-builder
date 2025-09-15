/**
 * Form Editor Web Component
 * Usage: Include this script and add data-editable="true" to form elements
 */

(function() {
    'use strict';
    
    // Store for managing editor states
    const formStates = new Map();
    let activeEditor = null;
    
    // Default form state
    const defaultState = {
        action: '',
        method: 'post',
        enctype: 'application/x-www-form-urlencoded',
        target: '_self',
        autocomplete: 'on',
        novalidate: false,
        fields: [
            { type: 'text', name: 'name', label: 'Name', placeholder: 'Enter your name', required: true },
            { type: 'email', name: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
            { type: 'submit', value: 'Submit' }
        ]
    };
    
    // CSS styles for the editor
    const editorStyles = `
        .form-editor {
            position: fixed;
            z-index: 10000;
            background: #1f2937;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            border: 1px solid #374151;
            width: 450px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #f9fafb;
        }
        
        .form-editor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid #374151;
        }
        
        .form-editor-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .form-editor-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
        }
        
        .form-editor-close:hover {
            color: #d1d5db;
        }
        
        .form-editor-content {
            padding: 16px;
        }
        
        .form-form-group {
            margin-bottom: 16px;
        }
        
        .form-form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #d1d5db;
            margin-bottom: 4px;
        }
        
        .form-form-input, .form-form-select, .form-form-textarea {
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
        
        .form-form-input:focus, .form-form-select:focus, .form-form-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        .form-form-checkbox {
            margin-right: 8px;
        }
        
        .form-checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .form-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .form-fields-editor {
            background: #374151;
            border: 1px solid #4b5563;
            border-radius: 8px;
            padding: 12px;
            margin-top: 8px;
        }
        
        .form-field-item {
            background: #1f2937;
            border: 1px solid #4b5563;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 8px;
        }
        
        .form-field-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .form-field-type {
            font-weight: 500;
            color: #3b82f6;
            font-size: 12px;
            text-transform: uppercase;
        }
        
        .form-field-remove {
            background: #dc2626;
            color: white;
            border: none;
            border-radius: 4px;
            width: 20px;
            height: 20px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .form-field-remove:hover {
            background: #b91c1c;
        }
        
        .form-actions {
            margin-top: 12px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        
        .form-btn {
            padding: 6px 12px;
            border: 1px solid #4b5563;
            background: #374151;
            color: #f9fafb;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .form-btn:hover {
            background: #4b5563;
        }
        
        .form-btn-primary {
            background: #3b82f6;
            border-color: #3b82f6;
        }
        
        .form-btn-primary:hover {
            background: #2563eb;
        }
        
        .form-editable {
            position: relative;
            cursor: pointer;
        }
        
        .form-editable:hover {
            outline: 2px dashed #3b82f6;
            outline-offset: 2px;
        }
        
        .form-edit-indicator {
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
        
        .form-editable:hover .form-edit-indicator {
            opacity: 1;
        }
    `;
    
    // Inject CSS styles
    function injectStyles() {
        if (document.querySelector('#form-editor-styles')) return;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'form-editor-styles';
        styleSheet.textContent = editorStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Get current state of a form element
    function getFormState(element) {
        const id = element.dataset.formEditorId || generateId();
        element.dataset.formEditorId = id;
        
        if (!formStates.has(id)) {
            const fields = extractFormFields(element);
            formStates.set(id, {
                action: element.action || defaultState.action,
                method: element.method || defaultState.method,
                enctype: element.enctype || defaultState.enctype,
                target: element.target || defaultState.target,
                autocomplete: element.autocomplete || defaultState.autocomplete,
                novalidate: element.noValidate || defaultState.novalidate,
                fields: fields.length > 0 ? fields : defaultState.fields
            });
        }
        
        return formStates.get(id);
    }
    
    // Extract fields from existing form
    function extractFormFields(form) {
        const fields = [];
        const inputs = form.querySelectorAll('input, select, textarea, button');
        
        inputs.forEach(input => {
            const field = {
                type: input.type || input.tagName.toLowerCase(),
                name: input.name || '',
                label: input.previousElementSibling && input.previousElementSibling.tagName === 'LABEL' 
                    ? input.previousElementSibling.textContent : '',
                placeholder: input.placeholder || '',
                value: input.value || '',
                required: input.required || false,
                disabled: input.disabled || false,
                readonly: input.readOnly || false
            };
            
            if (input.tagName === 'SELECT') {
                field.options = Array.from(input.options).map(opt => ({
                    value: opt.value,
                    text: opt.textContent
                }));
            }
            
            fields.push(field);
        });
        
        return fields.length > 0 ? fields : defaultState.fields;
    }
    
    // Update form element with new state
    function updateFormElement(element, state) {
        // Store data attributes
        Object.keys(state).forEach(key => {
            if (key !== 'fields') {
                element.dataset[key] = state[key];
            }
        });
        
        // Update form attributes
        element.action = state.action;
        element.method = state.method;
        element.enctype = state.enctype;
        element.target = state.target;
        element.autocomplete = state.autocomplete;
        element.noValidate = state.novalidate;
        
        // Clear existing content except the edit indicator
        const indicator = element.querySelector('.form-edit-indicator');
        element.innerHTML = '';
        if (indicator) {
            element.appendChild(indicator);
        }
        
        // Create form fields
        state.fields.forEach(field => {
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'form-field';
            
            if (field.type === 'submit' || field.type === 'button' || field.type === 'reset') {
                const button = document.createElement(field.type === 'submit' ? 'input' : 'button');
                if (field.type === 'submit') {
                    button.type = 'submit';
                    button.value = field.value || 'Submit';
                } else {
                    button.type = field.type;
                    button.textContent = field.value || field.type;
                }
                button.name = field.name;
                button.disabled = field.disabled;
                fieldContainer.appendChild(button);
            } else {
                if (field.label) {
                    const label = document.createElement('label');
                    label.textContent = field.label;
                    label.htmlFor = field.name;
                    fieldContainer.appendChild(label);
                }
                
                let inputElement;
                
                if (field.type === 'textarea') {
                    inputElement = document.createElement('textarea');
                    inputElement.textContent = field.value;
                } else if (field.type === 'select') {
                    inputElement = document.createElement('select');
                    if (field.options) {
                        field.options.forEach(option => {
                            const opt = document.createElement('option');
                            opt.value = option.value;
                            opt.textContent = option.text;
                            if (option.value === field.value) {
                                opt.selected = true;
                            }
                            inputElement.appendChild(opt);
                        });
                    }
                } else {
                    inputElement = document.createElement('input');
                    inputElement.type = field.type;
                    inputElement.value = field.value;
                    inputElement.placeholder = field.placeholder;
                }
                
                inputElement.name = field.name;
                inputElement.id = field.name;
                inputElement.required = field.required;
                inputElement.disabled = field.disabled;
                inputElement.readOnly = field.readonly;
                
                fieldContainer.appendChild(inputElement);
            }
            
            element.appendChild(fieldContainer);
        });
        
        // Re-add edit indicator
        addEditIndicator(element);
    }
    
    // Generate unique ID
    function generateId() {
        return 'form-' + Math.random().toString(36).substr(2, 9);
    }
    
    // Create field editor
    function createFieldEditor(field, index, onUpdate, onRemove) {
        const container = document.createElement('div');
        container.className = 'form-field-item';
        
        container.innerHTML = `
            <div class="form-field-header">
                <span class="form-field-type">${field.type}</span>
                <button class="form-field-remove" type="button">×</button>
            </div>
            <div class="form-grid-2">
                <div class="form-form-group">
                    <label class="form-form-label">Type</label>
                    <select class="form-form-select field-type">
                        <option value="text" ${field.type === 'text' ? 'selected' : ''}>Text</option>
                        <option value="email" ${field.type === 'email' ? 'selected' : ''}>Email</option>
                        <option value="password" ${field.type === 'password' ? 'selected' : ''}>Password</option>
                        <option value="tel" ${field.type === 'tel' ? 'selected' : ''}>Phone</option>
                        <option value="url" ${field.type === 'url' ? 'selected' : ''}>URL</option>
                        <option value="number" ${field.type === 'number' ? 'selected' : ''}>Number</option>
                        <option value="date" ${field.type === 'date' ? 'selected' : ''}>Date</option>
                        <option value="time" ${field.type === 'time' ? 'selected' : ''}>Time</option>
                        <option value="datetime-local" ${field.type === 'datetime-local' ? 'selected' : ''}>DateTime</option>
                        <option value="textarea" ${field.type === 'textarea' ? 'selected' : ''}>Textarea</option>
                        <option value="select" ${field.type === 'select' ? 'selected' : ''}>Select</option>
                        <option value="checkbox" ${field.type === 'checkbox' ? 'selected' : ''}>Checkbox</option>
                        <option value="radio" ${field.type === 'radio' ? 'selected' : ''}>Radio</option>
                        <option value="file" ${field.type === 'file' ? 'selected' : ''}>File</option>
                        <option value="submit" ${field.type === 'submit' ? 'selected' : ''}>Submit Button</option>
                        <option value="button" ${field.type === 'button' ? 'selected' : ''}>Button</option>
                        <option value="reset" ${field.type === 'reset' ? 'selected' : ''}>Reset Button</option>
                    </select>
                </div>
                <div class="form-form-group">
                    <label class="form-form-label">Name</label>
                    <input type="text" class="form-form-input field-name" value="${field.name || ''}" placeholder="Field name">
                </div>
            </div>
            <div class="form-form-group">
                <label class="form-form-label">Label</label>
                <input type="text" class="form-form-input field-label" value="${field.label || ''}" placeholder="Field label">
            </div>
            <div class="form-grid-2">
                <div class="form-form-group">
                    <label class="form-form-label">Placeholder</label>
                    <input type="text" class="form-form-input field-placeholder" value="${field.placeholder || ''}" placeholder="Placeholder text">
                </div>
                <div class="form-form-group">
                    <label class="form-form-label">Value</label>
                    <input type="text" class="form-form-input field-value" value="${field.value || ''}" placeholder="Default value">
                </div>
            </div>
            <div class="form-grid-2">
                <div class="form-checkbox-group">
                    <input type="checkbox" class="form-form-checkbox field-required" ${field.required ? 'checked' : ''}>
                    <label>Required</label>
                </div>
                <div class="form-checkbox-group">
                    <input type="checkbox" class="form-form-checkbox field-disabled" ${field.disabled ? 'checked' : ''}>
                    <label>Disabled</label>
                </div>
            </div>
        `;
        
        // Add event listeners
        const typeSelect = container.querySelector('.field-type');
        const nameInput = container.querySelector('.field-name');
        const labelInput = container.querySelector('.field-label');
        const placeholderInput = container.querySelector('.field-placeholder');
        const valueInput = container.querySelector('.field-value');
        const requiredCheckbox = container.querySelector('.field-required');
        const disabledCheckbox = container.querySelector('.field-disabled');
        const removeBtn = container.querySelector('.form-field-remove');
        
        function updateField() {
            field.type = typeSelect.value;
            field.name = nameInput.value;
            field.label = labelInput.value;
            field.placeholder = placeholderInput.value;
            field.value = valueInput.value;
            field.required = requiredCheckbox.checked;
            field.disabled = disabledCheckbox.checked;
            
            // Update type display
            container.querySelector('.form-field-type').textContent = field.type;
            
            onUpdate();
        }
        
        function updatePlaceholderForType() {
            const fieldType = typeSelect.value;
            const placeholderMap = {
                'text': 'Enter your text',
                'email': 'Enter your email',
                'password': 'Enter your password',
                'tel': 'Enter your phone',
                'url': 'Enter your URL',
                'number': 'Enter your number',
                'date': 'Select your date',
                'time': 'Select your time',
                'datetime-local': 'Select your datetime',
                'textarea': 'Enter your message',
                'select': 'Choose your option',
                'checkbox': 'Check your option',
                'radio': 'Select your option',
                'file': 'Choose your file'
            };
            
            if (placeholderMap[fieldType]) {
                placeholderInput.value = placeholderMap[fieldType];
                field.placeholder = placeholderInput.value;
            }
        }
        
        function updatePlaceholderForType() {
            const fieldType = typeSelect.value;
            const placeholderMap = {
                'text': 'Enter your text',
                'email': 'Enter your email',
                'password': 'Enter your password',
                'tel': 'Enter your phone',
                'url': 'Enter your URL',
                'number': 'Enter your number',
                'date': 'Select your date',
                'time': 'Select your time',
                'datetime-local': 'Select your datetime',
                'textarea': 'Enter your message',
                'select': 'Choose your option',
                'checkbox': 'Check your option',
                'radio': 'Select your option',
                'file': 'Choose your file'
            };
            
            if (placeholderMap[fieldType] && !placeholderInput.value) {
                placeholderInput.value = placeholderMap[fieldType];
                field.placeholder = placeholderInput.value;
            }
        }
        
        typeSelect.addEventListener('change', () => {
            updatePlaceholderForType();
            updateField();
        });
        nameInput.addEventListener('input', updateField);
        labelInput.addEventListener('input', updateField);
        placeholderInput.addEventListener('input', updateField);
        valueInput.addEventListener('input', updateField);
        requiredCheckbox.addEventListener('change', updateField);
        disabledCheckbox.addEventListener('change', updateField);
        
        removeBtn.addEventListener('click', () => {
            onRemove(index);
        });
        
        return container;
    }
    
    // Create editor interface
    function createEditor(formElement) {
        const state = getFormState(formElement);
        const rect = formElement.getBoundingClientRect();
        
        const editor = document.createElement('div');
        editor.className = 'form-editor';
        
        // Position editor
        let x = rect.right + 10;
        let y = rect.top + window.scrollY;
        
        if (x + 450 > window.innerWidth) {
            x = rect.left - 460;
        }
        if (y + 600 > window.innerHeight + window.scrollY) {
            y = window.innerHeight + window.scrollY - 600;
        }
        if (y < window.scrollY) y = window.scrollY + 10;
        
        editor.style.left = x + 'px';
        editor.style.top = y + 'px';
        
        editor.innerHTML = `
            <div class="form-editor-header">
                <h3 class="form-editor-title">Edit Form</h3>
                <button class="form-editor-close" type="button">×</button>
            </div>
            <div class="form-editor-content">
                <div class="form-form-group">
                    <label class="form-form-label">Action URL</label>
                    <input type="text" class="form-form-input" id="form-action" value="${state.action}" placeholder="Form action URL">
                </div>
                
                <div class="form-grid-2">
                    <div class="form-form-group">
                        <label class="form-form-label">Method</label>
                        <select class="form-form-select" id="form-method">
                            <option value="get" ${state.method === 'get' ? 'selected' : ''}>GET</option>
                            <option value="post" ${state.method === 'post' ? 'selected' : ''}>POST</option>
                        </select>
                    </div>
                    <div class="form-form-group">
                        <label class="form-form-label">Target</label>
                        <select class="form-form-select" id="form-target">
                            <option value="_self" ${state.target === '_self' ? 'selected' : ''}>Same Window</option>
                            <option value="_blank" ${state.target === '_blank' ? 'selected' : ''}>New Window</option>
                            <option value="_parent" ${state.target === '_parent' ? 'selected' : ''}>Parent Frame</option>
                            <option value="_top" ${state.target === '_top' ? 'selected' : ''}>Top Frame</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-grid-2">
                    <div class="form-form-group">
                        <label class="form-form-label">Encoding</label>
                        <select class="form-form-select" id="form-enctype">
                            <option value="application/x-www-form-urlencoded" ${state.enctype === 'application/x-www-form-urlencoded' ? 'selected' : ''}>URL Encoded</option>
                            <option value="multipart/form-data" ${state.enctype === 'multipart/form-data' ? 'selected' : ''}>Multipart (Files)</option>
                            <option value="text/plain" ${state.enctype === 'text/plain' ? 'selected' : ''}>Plain Text</option>
                        </select>
                    </div>
                    <div class="form-form-group">
                        <label class="form-form-label">Autocomplete</label>
                        <select class="form-form-select" id="form-autocomplete">
                            <option value="on" ${state.autocomplete === 'on' ? 'selected' : ''}>On</option>
                            <option value="off" ${state.autocomplete === 'off' ? 'selected' : ''}>Off</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-checkbox-group">
                    <input type="checkbox" class="form-form-checkbox" id="form-novalidate" ${state.novalidate ? 'checked' : ''}>
                    <label for="form-novalidate">No Validation</label>
                </div>
                
                <div class="form-form-group">
                    <label class="form-form-label">Form Fields</label>
                    <div class="form-fields-editor" id="fields-container"></div>
                    <div class="form-actions">
                        <button class="form-btn form-btn-primary" type="button" id="add-text-field">+ Text Field</button>
                        <button class="form-btn" type="button" id="add-email-field">+ Email</button>
                        <button class="form-btn" type="button" id="add-textarea-field">+ Textarea</button>
                        <button class="form-btn" type="button" id="add-select-field">+ Select</button>
                        <button class="form-btn" type="button" id="add-submit-button">+ Submit</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const actionInput = editor.querySelector('#form-action');
        const methodSelect = editor.querySelector('#form-method');
        const targetSelect = editor.querySelector('#form-target');
        const enctypeSelect = editor.querySelector('#form-enctype');
        const autocompleteSelect = editor.querySelector('#form-autocomplete');
        const novalidateCheckbox = editor.querySelector('#form-novalidate');
        const fieldsContainer = editor.querySelector('#fields-container');
        const closeBtn = editor.querySelector('.form-editor-close');
        
        function updateState() {
            const newState = {
                ...state,
                action: actionInput.value,
                method: methodSelect.value,
                target: targetSelect.value,
                enctype: enctypeSelect.value,
                autocomplete: autocompleteSelect.value,
                novalidate: novalidateCheckbox.checked
            };
            
            Object.assign(state, newState);
            formStates.set(formElement.dataset.formEditorId, state);
            updateFormElement(formElement, state);
        }
        
        function renderFields() {
            fieldsContainer.innerHTML = '';
            state.fields.forEach((field, index) => {
                const fieldEditor = createFieldEditor(field, index, updateState, removeField);
                fieldsContainer.appendChild(fieldEditor);
            });
        }
        
        function removeField(index) {
            state.fields.splice(index, 1);
            renderFields();
            updateState();
        }
        
        function addField(type) {
            const placeholderMap = {
                'text': 'Enter your text',
                'email': 'Enter your email',
                'password': 'Enter your password',
                'tel': 'Enter your phone',
                'url': 'Enter your URL',
                'number': 'Enter your number',
                'date': 'Select your date',
                'time': 'Select your time',
                'datetime-local': 'Select your datetime',
                'textarea': 'Enter your message',
                'select': 'Choose your option',
                'checkbox': 'Check your option',
                'radio': 'Select your option',
                'file': 'Choose your file'
            };
            
            const newField = {
                type: type,
                name: `field_${state.fields.length}`,
                label: type.charAt(0).toUpperCase() + type.slice(1),
                placeholder: placeholderMap[type] || `Enter ${type}`,
                value: '',
                required: false,
                disabled: false
            };
            
            if (type === 'submit') {
                newField.value = 'Submit';
                newField.label = '';
                newField.placeholder = '';
            }
            
            state.fields.push(newField);
            renderFields();
            updateState();
        }
        
        // Initial field rendering
        renderFields();
        
        actionInput.addEventListener('input', updateState);
        methodSelect.addEventListener('change', updateState);
        targetSelect.addEventListener('change', updateState);
        enctypeSelect.addEventListener('change', updateState);
        autocompleteSelect.addEventListener('change', updateState);
        novalidateCheckbox.addEventListener('change', updateState);
        
        // Add field buttons
        editor.querySelector('#add-text-field').addEventListener('click', () => addField('text'));
        editor.querySelector('#add-email-field').addEventListener('click', () => addField('email'));
        editor.querySelector('#add-textarea-field').addEventListener('click', () => addField('textarea'));
        editor.querySelector('#add-select-field').addEventListener('click', () => addField('select'));
        editor.querySelector('#add-submit-button').addEventListener('click', () => addField('submit'));
        
        closeBtn.addEventListener('click', () => {
            closeEditor();
        });
        
        // Close editor when clicking outside
        function handleClickOutside(event) {
            if (!editor.contains(event.target) && event.target !== formElement) {
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
    
    // Add edit indicator to editable form elements
    function addEditIndicator(formElement) {
        if (!formElement.querySelector('.form-edit-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'form-edit-indicator';
            indicator.innerHTML = '📝';
            indicator.title = 'Click to edit';
            formElement.appendChild(indicator);
        }
    }
    
    // Initialize editable form elements
    function initializeEditableFormElements() {
        const editableElements = document.querySelectorAll('form[data-editable="true"]');
        
        editableElements.forEach(element => {
            element.classList.add('form-editable');
            addEditIndicator(element);
            
            // Remove existing listeners to prevent duplicates
            element.removeEventListener('click', handleFormClick);
            element.addEventListener('click', handleFormClick);
        });
    }
    
    // Handle form element click
    function handleFormClick(event) {
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
        initializeEditableFormElements();
        
        // Watch for new form elements added to the page
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('form[data-editable="true"]')) {
                            node.classList.add('form-editable');
                            addEditIndicator(node);
                            node.addEventListener('click', handleFormClick);
                        }
                        
                        // Check children too
                        const editableElements = node.querySelectorAll && node.querySelectorAll('form[data-editable="true"]');
                        if (editableElements) {
                            editableElements.forEach(element => {
                                element.classList.add('form-editable');
                                addEditIndicator(element);
                                element.addEventListener('click', handleFormClick);
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
    window.FormEditor = {
        init: initialize,
        makeEditable: function(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.setAttribute('data-editable', 'true');
                element.classList.add('form-editable');
                addEditIndicator(element);
                element.addEventListener('click', handleFormClick);
            });
        },
        getState: function(element) {
            return getFormState(element);
        },
        setState: function(element, state) {
            const id = element.dataset.formEditorId || generateId();
            element.dataset.formEditorId = id;
            formStates.set(id, state);
            updateFormElement(element, state);
        }
    };
    
})();