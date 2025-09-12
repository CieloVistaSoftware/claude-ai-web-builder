/**
 * HTML Generation Utilities
 * Extracted from wb.js for better code organization
 * Author: Claude AI Assistant
 */

"use strict";

// HTML generation utility functions
function generateCompleteHTML(content, styles, title = 'My Website') {
    const template = `<!DOCTYPE html>
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
    
    <script>
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Add fade-in animation for sections
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    </script>
</body>
</html>`;
    
    return template;
}

function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function generateResponsiveCSS(config) {
    return `
        @media (max-width: 768px) {
            .container {
                padding: 0 15px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .nav ul {
                flex-direction: column;
                gap: 10px;
            }
            
            .grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
        }
        
        @media (max-width: 480px) {
            .header h1 {
                font-size: 1.5rem;
            }
            
            .button {
                padding: 10px 20px;
                font-size: 14px;
            }
        }
    `;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateCompleteHTML,
        sanitizeHTML,
        generateResponsiveCSS
    };
} else {
    // Browser environment - attach to window
    window.HTMLUtils = {
        generateCompleteHTML,
        sanitizeHTML,
        generateResponsiveCSS
    };
}