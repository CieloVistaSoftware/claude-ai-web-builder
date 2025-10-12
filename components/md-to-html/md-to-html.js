/**
 * MD to HTML Component
 * Simple markdown-to-HTML converter for documentation display
 */

(function() {
    'use strict';

    class MdToHtml extends HTMLElement {
        constructor() {
            super();
            this.markdownContent = '';
        }

        connectedCallback() {
            const src = this.getAttribute('src');
            const theme = this.getAttribute('theme') || 'light';
            
            // Apply theme class
            this.className = `md-to-html theme-${theme}`;
            
            if (src) {
                this.loadMarkdown(src);
            } else {
                // Use innerHTML content as markdown
                const content = this.innerHTML;
                if (content.trim()) {
                    this.convertMarkdown(content);
                }
            }
        }

        async loadMarkdown(src) {
            try {
                const response = await fetch(src);
                if (!response.ok) {
                    throw new Error(`Failed to load ${src}: ${response.status}`);
                }
                const markdown = await response.text();
                this.convertMarkdown(markdown);
            } catch (error) {
                console.error('MD to HTML load error:', error);
                this.innerHTML = `<div class="error">Failed to load documentation: ${error.message}</div>`;
            }
        }

        convertMarkdown(markdown) {
            // Simple markdown-to-HTML conversion
            // This handles the basic formatting needed for documentation
            let html = markdown
                // Headers
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                
                // Bold and italic
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                
                // Code blocks (triple backticks)
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                
                // Inline code
                .replace(/`(.*?)`/g, '<code>$1</code>')
                
                // Links
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
                
                // Lists (simple version)
                .replace(/^\- (.*$)/gim, '<li>$1</li>')
                .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
                
                // Line breaks
                .replace(/\n\n/g, '</p><p>')
                .replace(/^\s*$/gm, '') // Remove empty lines
                .replace(/\n/g, '<br>');

            // Wrap in paragraphs if not already wrapped
            if (!html.includes('<p>') && !html.includes('<h1>') && !html.includes('<h2>')) {
                html = '<p>' + html + '</p>';
            }

            this.innerHTML = html;
            
            // Log successful conversion
            if (window.WBEventLog) {
                WBEventLog.logSuccess('Markdown converted to HTML', { 
                    component: 'md-to-html',
                    source: this.getAttribute('src') || 'inline',
                    length: markdown.length
                });
            }
        }
    }

    // Register the component
    if (!customElements.get('md-to-html')) {
        customElements.define('md-to-html', MdToHtml);
    }

})();