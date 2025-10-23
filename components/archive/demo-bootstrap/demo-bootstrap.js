// demo-bootstrap.js
// Injects event log tab into all wb-demo components if enabled in config

async function injectEventLogTabIfEnabled() {
    try {
        const response = await fetch('/config/components.config.json');
        if (!response.ok) return;
        const config = await response.json();
        if (config.eventLogging) {
            // Wait for DOM and wb-demo definitions
            if (document.readyState === 'loading') {
                await new Promise(res => document.addEventListener('DOMContentLoaded', res, { once: true }));
            }
            customElements.whenDefined('wb-demo').then(() => {
                document.querySelectorAll('wb-demo').forEach(demo => {
                    // Check if event log tab already exists
                    if (!demo.querySelector('[slot="event-log"]')) {
                        // Create event log tab content
                        const logTab = document.createElement('div');
                        logTab.setAttribute('slot', 'event-log');
                        logTab.innerHTML = '<wb-event-log style="width:100%;height:300px;display:block;"></wb-event-log>';
                        demo.appendChild(logTab);
                    }
                });
            });
        }
    } catch (e) {
        // Fail silently
    }
}

injectEventLogTabIfEnabled();
