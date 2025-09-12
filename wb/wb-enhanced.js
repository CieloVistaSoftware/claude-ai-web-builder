/**
 * Claude AI Website Builder - Main JavaScript Module
 * Enhanced version with modular utilities and improved error handling
 * Author: Claude AI Assistant
 * Last Modified: September 2025
 */

"use strict";

(function() {
    // Website Builder Main Application
    console.log('Loading Website Builder...');

    // Initialize page elements and event listeners with error handling
    function initializeUIElements() {
        const builderForm = document.getElementById('builderForm');
        const previewFrame = document.getElementById('previewFrame');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (!builderForm) {
            console.error('Builder form element not found');
            return false;
        }
        
        if (!previewFrame) {
            console.error('Preview frame element not found');
            return false;
        }
        
        if (!downloadBtn) {
            console.error('Download button element not found');
            return false;
        }
        
        // Setup event listeners
        builderForm.addEventListener('submit', handleFormSubmit);
        downloadBtn.addEventListener('click', downloadWebsite);
        
        return true;
    }

    function initializeColorElements() {
        setupColorControls();
        return true;
    }

    // Combined initialization function
    function initializeElements() {
        return initializeUIElements() && initializeColorElements();
    }

    // Color control functions with debouncing support
    function setupColorControls() {
        const colorInputs = document.querySelectorAll('input[type="color"]');
        const rangeInputs = document.querySelectorAll('input[type="range"]');

        // Use debounced updates if ColorUtils is available, otherwise use direct updates
        const updateFunction = (typeof ColorUtils !== 'undefined' && ColorUtils.debounce) 
            ? ColorUtils.debounce(updateColors, 100) 
            : updateColors;

        colorInputs.forEach(input => {
            if (input) {
                input.addEventListener('change', updateFunction);
            }
        });
        
        rangeInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', updateFunction);
            }
        });
    }

    // Load page templates from external JSON file
    async function loadPageTemplates() {
        const pageTemplates = {};
        
        try {
            const response = await fetch('pageTemplates.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const templates = await response.json();
            Object.assign(pageTemplates, templates);
            
            // Populate page type dropdown
            populatePageTypeDropdown(pageTemplates);
            
            return pageTemplates;
        } catch (error) {
            console.error('Error loading page templates:', error);
            // Fallback to basic template
            pageTemplates.default = {
                title: 'Default Page',
                content: '<h1>${pageTitle}</h1><p>Welcome to your website!</p>'
            };
            return pageTemplates;
        }
    }

    // Populate the page type dropdown with available templates
    function populatePageTypeDropdown(templates) {
        const pageTypeSelect = document.getElementById('pageType');
        if (!pageTypeSelect) {
            console.warn('Page type select element not found');
            return;
        }
        
        // Clear existing options
        pageTypeSelect.innerHTML = '';
        
        // Add template options
        Object.keys(templates).forEach(templateKey => {
            const option = document.createElement('option');
            option.value = templateKey;
            option.textContent = templates[templateKey].title || templateKey;
            pageTypeSelect.appendChild(option);
        });
    }

    // Enhanced initialization with better error handling
    async function init() {
        try {
            console.log('Initializing Website Builder...');
            
            if (!initializeElements()) {
                throw new Error('Failed to initialize elements');
            }
            
            await loadPageTemplates();
            console.log('Website builder initialized successfully');
            
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    }

    // Form submission handler
    function handleFormSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const websiteData = Object.fromEntries(formData.entries());
            
            generateWebsite(websiteData);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    }

    // Generate website based on form data
    function generateWebsite(data) {
        try {
            const content = generatePageContent(data);
            const styles = generateStyles(data);
            
            // Use HTMLUtils if available, otherwise use internal function
            const html = (typeof HTMLUtils !== 'undefined' && HTMLUtils.generateCompleteHTML)
                ? HTMLUtils.generateCompleteHTML(content, styles, data.pageTitle)
                : generateCompleteHTML(content, styles, data.pageTitle);
            
            updatePreview(html);
            
        } catch (error) {
            console.error('Website generation error:', error);
        }
    }

    // Generate page content based on selected template and data
    function generatePageContent(data) {
        const pageType = data.pageType || 'default';
        const templates = window.pageTemplates || {};
        const template = templates[pageType] || templates.default || { content: '<h1>${pageTitle}</h1>' };
        
        let content = template.content;
        
        // Replace placeholders
        content = content.replace(/\${pageTitle}/g, data.pageTitle || 'My Website');
        content = content.replace(/\${companyName}/g, data.companyName || 'My Company');
        content = content.replace(/\${description}/g, data.description || 'Welcome to our website');
        
        return content;
    }

    // Generate CSS styles based on form data
    function generateStyles(data) {
        const primaryColor = data.primaryColor || '#007bff';
        const secondaryColor = data.secondaryColor || '#6c757d';
        const backgroundColor = data.backgroundColor || '#ffffff';
        const textColor = data.textColor || '#333333';
        
        return `
            :root {
                --primary-color: ${primaryColor};
                --secondary-color: ${secondaryColor};
                --background-color: ${backgroundColor};
                --text-color: ${textColor};
            }
            
            body {
                background-color: var(--background-color);
                color: var(--text-color);
            }
            
            .header {
                background-color: var(--primary-color);
                color: white;
                padding: 2rem 0;
                text-align: center;
            }
            
            .nav ul {
                list-style: none;
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin: 1rem 0;
            }
            
            .nav a {
                color: var(--primary-color);
                text-decoration: none;
                font-weight: 500;
                transition: color 0.3s ease;
            }
            
            .nav a:hover {
                color: var(--secondary-color);
            }
            
            .button {
                background-color: var(--primary-color);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s ease;
            }
            
            .button:hover {
                background-color: var(--secondary-color);
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            }
            
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin: 2rem 0;
            }
            
            @media (max-width: 768px) {
                .container {
                    padding: 0 15px;
                }
                
                .nav ul {
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
    }

    // Fallback HTML generation function (used if HTMLUtils not available)
    function generateCompleteHTML(content, styles, title = 'My Website') {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        ${styles}
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
    }

    // Update the preview iframe
    function updatePreview(html) {
        const previewFrame = document.getElementById('previewFrame');
        if (!previewFrame) {
            console.error('Preview frame not found');
            return;
        }
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        previewFrame.src = url;
        
        // Clean up the previous URL
        previewFrame.onload = function() {
            if (previewFrame.dataset.previousUrl) {
                URL.revokeObjectURL(previewFrame.dataset.previousUrl);
            }
            previewFrame.dataset.previousUrl = url;
        };
    }

    // Color update function
    function updateColors() {
        const form = document.getElementById('builderForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        generateWebsite(data);
    }

    // Download website function
    function downloadWebsite() {
        const previewFrame = document.getElementById('previewFrame');
        if (!previewFrame || !previewFrame.src) {
            alert('Please generate a website first');
            return;
        }
        
        // Get the HTML content from the iframe
        fetch(previewFrame.src)
            .then(response => response.text())
            .then(html => {
                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'website.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Download error:', error);
                alert('Error downloading website');
            });
    }

    // Utility function to clean input values (fixes unicode character issues)
    function cleanInputValue(value) {
        if (!value) return value;
        
        // Replace various unicode minus characters with standard minus
        if (value.includes('\u2217') || value.includes('\u2212') || value.includes('\u2013') || value.includes('\u2014')) {
            value = value.replace(/[\u2217\u2212\u2013\u2014]/g, '-');
        }
        
        return value;
    }

    // Store pageTemplates globally for access by other functions
    window.pageTemplates = {};

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();