# Stack Trace Update for wb-xtest-demo.html

## CSS to Add (after `.event-details` style):

```css
.stack-trace-toggle {
    color: #6366f1;
    cursor: pointer;
    font-size: 0.75rem;
    margin-top: 0.5rem;
    display: inline-block;
    text-decoration: underline;
    user-select: none;
}

.stack-trace-toggle:hover {
    color: #8b8cf5;
}

.stack-trace {
    display: none;
    background: #0d0d0d;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #999;
    max-height: 200px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-all;
}

.stack-trace.visible {
    display: block;
}
```

## Updated logEvent Function:

```javascript
function logEvent(type, details, className = '') {
    eventCounter++;
    
    const log = document.getElementById('event-log');
    const timestamp = new Date().toLocaleTimeString();
    
    // Capture stack trace
    const stack = new Error().stack;
    const stackLines = stack.split('\n').slice(2); // Remove "Error" and logEvent lines
    const formattedStack = stackLines.join('\n');
    
    // Remove the "waiting" message if it exists
    if (eventCounter === 1) {
        log.innerHTML = '';
    }
    
    const entry = document.createElement('div');
    entry.className = `event-entry ${className}`;
    
    const stackId = `stack-${eventCounter}`;
    entry.innerHTML = `
        <div class="event-timestamp">${timestamp}</div>
        <div class="event-type">${type}</div>
        <div class="event-details">${details}</div>
        <div class="stack-trace-toggle" onclick="window.toggleStack('${stackId}')">📋 View Stack Trace</div>
        <div class="stack-trace" id="${stackId}">${formattedStack || 'No stack trace available'}</div>
    `;
    
    // Add to top of log
    log.insertBefore(entry, log.firstChild);
    
    // Update counter
    document.getElementById('event-count').textContent = eventCounter;
    
    // Keep only last 50 entries
    const entries = log.querySelectorAll('.event-entry');
    if (entries.length > 50) {
        entries[entries.length - 1].remove();
    }
}

// Add this function globally
window.toggleStack = function(stackId) {
    const stackElement = document.getElementById(stackId);
    if (stackElement) {
        stackElement.classList.toggle('visible');
    }
};
```

##Summary

These changes add:
1. **Clickable "📋 View Stack Trace" link** on each event
2. **Collapsible stack trace display** with proper formatting
3. **Stack trace capture** showing the call chain that led to each event
