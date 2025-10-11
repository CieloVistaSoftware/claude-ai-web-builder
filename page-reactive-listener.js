/**
 * Page Reactive Listener - Makes entire page respond to control panel changes
 * This script listens to control panel events and applies changes globally
 */

(function() {
    'use strict';
    
    console.log('🎛️ Page Reactive Listener: Setting up global control panel reactivity...');
    
    // Helper function to log events
    function logEvent(message, type = 'info') {
        if (window.WBEventLog && window.WBEventLog.logInfo) {
            window.WBEventLog.logInfo(message, { component: 'page-reactive-listener' });
        } else {
            console.log(`[PAGE] ${message}`);
        }
    }
    
    // Theme change listener
    document.addEventListener('wb:theme-changed', (e) => {
        const { theme } = e.detail;
        logEvent(`Applying theme: ${theme}`);
        
        // Update HTML data attribute
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        
        // Apply theme-specific CSS custom properties
        const root = document.documentElement;
        
        switch (theme) {
            case 'light':
                root.style.setProperty('--bg-primary', '#ffffff');
                root.style.setProperty('--bg-secondary', '#f8fafc');
                root.style.setProperty('--text-primary', '#1a202c');
                root.style.setProperty('--text-secondary', '#4a5568');
                root.style.setProperty('--border-color', '#e2e8f0');
                break;
                
            case 'dark':
                root.style.setProperty('--bg-primary', '#1a1a1a');
                root.style.setProperty('--bg-secondary', '#2d3748');
                root.style.setProperty('--text-primary', '#ffffff');
                root.style.setProperty('--text-secondary', '#a0aec0');
                root.style.setProperty('--border-color', '#4a5568');
                break;
                
            case 'cyberpunk':
                root.style.setProperty('--bg-primary', '#0a0a0a');
                root.style.setProperty('--bg-secondary', '#1a1a2e');
                root.style.setProperty('--text-primary', '#00ff41');
                root.style.setProperty('--text-secondary', '#16d9e3');
                root.style.setProperty('--primary-color', '#ff0080');
                root.style.setProperty('--border-color', '#ff0080');
                break;
                
            case 'ocean':
                root.style.setProperty('--bg-primary', '#0f3460');
                root.style.setProperty('--bg-secondary', '#16537e');
                root.style.setProperty('--text-primary', '#ffffff');
                root.style.setProperty('--text-secondary', '#b6effb');
                root.style.setProperty('--primary-color', '#00bcd4');
                root.style.setProperty('--border-color', '#00bcd4');
                break;
                
            case 'sunset':
                root.style.setProperty('--bg-primary', '#2d1b19');
                root.style.setProperty('--bg-secondary', '#4a3426');
                root.style.setProperty('--text-primary', '#fff3e0');
                root.style.setProperty('--text-secondary', '#ffcc80');
                root.style.setProperty('--primary-color', '#ff6d00');
                root.style.setProperty('--border-color', '#ff8f00');
                break;
                
            case 'forest':
                root.style.setProperty('--bg-primary', '#1b2f1b');
                root.style.setProperty('--bg-secondary', '#2e4a2e');
                root.style.setProperty('--text-primary', '#e8f5e8');
                root.style.setProperty('--text-secondary', '#c8e6c8');
                root.style.setProperty('--primary-color', '#4caf50');
                root.style.setProperty('--border-color', '#66bb6a');
                break;
        }
        
        logEvent(`Theme applied: ${theme} - CSS variables updated`);
    });
    
    // Layout change listener
    document.addEventListener('wb:layout-changed', (e) => {
        const { layout } = e.detail;
        logEvent(`Applying layout: ${layout}`);
        
        // Update HTML and body data attributes
        document.documentElement.setAttribute('data-layout', layout);
        document.body.setAttribute('data-layout', layout);
        
        logEvent(`Layout applied: ${layout} - data attributes updated`);
    });
    
    // Color change listener for wb-color-bars
    document.addEventListener('colorchange', (e) => {
        if (e.detail && e.detail.text && e.detail.background) {
            const { text, background } = e.detail;
            
            logEvent(`Applying colors - Text: ${text.hex}, Background: ${background.hex}`);
            
            const root = document.documentElement;
            
            // Update primary color from text color
            if (text.hex) {
                root.style.setProperty('--primary-color', text.hex);
                root.style.setProperty('--text-primary', text.hex);
                root.style.setProperty('--color', text.hex);
                root.style.setProperty('--hue-primary', text.hue);
                root.style.setProperty('--saturation-primary', text.saturation);
                root.style.setProperty('--lightness-primary', text.lightness);
                
                // Also update body text color for immediate visual feedback
                document.body.style.color = text.hex;
            }
            
            // Update background colors
            if (background.hex) {
                root.style.setProperty('--bg-primary', background.hex);
                root.style.setProperty('--bg-secondary', background.hex);
                root.style.setProperty('--background-color', background.hex);
                
                // Also update body background for immediate visual feedback
                document.body.style.backgroundColor = background.hex;
            }
            
            logEvent(`Colors applied - CSS variables updated globally`);
        }
    });
    
    // Additional color events from control panel
    document.addEventListener('wb:color-changed', (e) => {
        const { color, type } = e.detail;
        logEvent(`Color changed via control panel: ${type} = ${color}`);
        
        const root = document.documentElement;
        
        if (type === 'primary' && color) {
            root.style.setProperty('--primary-color', color);
        } else if (type === 'background' && color) {
            root.style.setProperty('--bg-primary', color);
            document.body.style.backgroundColor = color;
        }
    });
    
    // Listen for control panel ready event
    document.addEventListener('wb:control-panel-ready', (e) => {
        logEvent('Control panel ready - reactive listener active');
        
        // Apply initial theme from localStorage or default
        const savedTheme = localStorage.getItem('wb-theme') || 'dark';
        const savedLayout = localStorage.getItem('wb-layout') || 'top-nav';
        
        // Trigger initial theme and layout application
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('wb:theme-changed', {
                detail: { theme: savedTheme, source: 'page-reactive-listener-init' }
            }));
            
            document.dispatchEvent(new CustomEvent('wb:layout-changed', {
                detail: { layout: savedLayout, source: 'page-reactive-listener-init' }
            }));
        }, 100);
    });
    
    logEvent('Page reactive listener initialized - ready to respond to control panel changes');
    
})();