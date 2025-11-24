/**
 * Auto-inject Event Log into Demo Pages
 * This script automatically adds an event log to the bottom of demo/test pages
 * when eventLogging is enabled in config
 * 
 * Usage in HTML:
 * <script src="../../utils/event-log-auto-inject.js"></script>
 * 
 * Or include in your demo page automatically
 */

(async function() {
    'use strict';
    
    // Check if event logging is enabled
    async function isEventLoggingEnabled() {
        try {
            const response = await fetch('/src/config/components.config.json');
            if (!response.ok) return false;
            const config = await response.json();
            return config.eventLogging === true;
        } catch (e) {
            console.warn('Could not load event logging config:', e);
            return false;
        }
    }
    
    // Inject event log at bottom of page
    function injectEventLog() {
        // Check if already injected
        if (document.querySelector('wb-event-log')) {
            console.log('📝 Event log already present on page');
            return;
        }
        
        // Check if page is using wb-demo component (it will inject its own)
        if (document.querySelector('wb-demo')) {
            console.log('📝 Page uses wb-demo, event log will be injected via wb-demo');
            return;
        }
        
        console.log('📝 Auto-injecting event log at bottom of page');
        
        // Create container for event log
        const container = document.createElement('div');
        container.id = 'wb-event-log-auto-container';
        container.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 250px;
            z-index: 9998;
            background: #1a1a1a;
            border-top: 2px solid #6366f1;
            box-shadow: 0 -4px 12px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        `;
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'wb-event-log-toggle';
        toggleBtn.innerHTML = '📝';
        toggleBtn.title = 'Toggle Event Log';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 260px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: #6366f1;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        
        let isCollapsed = false;
        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                container.style.transform = 'translateY(100%)';
                toggleBtn.style.bottom = '10px';
                toggleBtn.innerHTML = '📝';
                toggleBtn.title = 'Show Event Log';
            } else {
                container.style.transform = 'translateY(0)';
                toggleBtn.style.bottom = '260px';
                toggleBtn.innerHTML = '📝';
                toggleBtn.title = 'Hide Event Log';
            }
        });
        
        // Add hover effect to toggle button
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'scale(1.1)';
            toggleBtn.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.5)';
        });
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'scale(1)';
            toggleBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        });
        
        // Create event log element
        const eventLog = document.createElement('wb-event-log');
        eventLog.style.cssText = 'width: 100%; height: 100%; display: block;';
        
        // Assemble
        container.appendChild(eventLog);
        document.body.appendChild(container);
        document.body.appendChild(toggleBtn);
        
        // Add padding to body to prevent content from being hidden
        document.body.style.paddingBottom = '250px';
        
        console.log('✅ Event log injected successfully');
    }
    
    // Wait for DOM and config
    async function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            });
        }
        
        // Check if enabled
        const enabled = await isEventLoggingEnabled();
        if (!enabled) {
            console.log('📝 Event logging is disabled in config');
            return;
        }
        
        // Wait for wb-event-log to be defined
        if (!customElements.get('wb-event-log')) {
            console.log('⏳ Waiting for wb-event-log component to be defined...');
            await customElements.whenDefined('wb-event-log');
        }
        
        // Inject the event log
        injectEventLog();
    }
    
    // Start initialization
    init().catch(err => {
        console.warn('Event log auto-inject failed:', err);
    });
    
})();

export default {};
