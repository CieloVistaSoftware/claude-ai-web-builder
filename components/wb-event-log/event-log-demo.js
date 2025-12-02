// event-log-demo.js
// Handles event log demo button actions and stats

document.addEventListener('DOMContentLoaded', () => {
    let eventCount = 0;
    let errorCount = 0;
    let eventTimes = [];
    const eventLog = document.getElementById('demoEventLog');

    document.getElementById('infoBtn').addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('wb:info', {
            detail: {
                message: `Info message #${++eventCount}`,
                source: 'demo'
            }
        }));
        updateStats();
    });
    document.getElementById('warningBtn').addEventListener('click', () => {
        const warnings = [
            'API response time exceeded threshold',
            'Memory usage approaching limit',
            'Cache miss rate high',
            'Network latency increased'
        ];
        document.dispatchEvent(new CustomEvent('wb:warning', {
            detail: {
                message: warnings[Math.floor(Math.random() * warnings.length)],
                source: 'demo'
            }
        }));
        updateStats();
    });
    document.getElementById('errorBtn').addEventListener('click', () => {
        const errors = [
            'Failed to connect to database',
            'Authentication token expired',
            'File not found: config.json',
            'Network request timeout'
        ];
        document.dispatchEvent(new CustomEvent('wb:error', {
            detail: {
                message: errors[Math.floor(Math.random() * errors.length)],
                source: 'demo'
            }
        }));
        errorCount++;
        updateStats();
    });
    document.getElementById('successBtn').addEventListener('click', () => {
        const successes = [
            'User authentication successful',
            'Data saved successfully',
            'Connection established',
            'Operation completed successfully'
        ];
        document.dispatchEvent(new CustomEvent('wb:success', {
            detail: {
                message: successes[Math.floor(Math.random() * successes.length)],
                source: 'demo'
            }
        }));
        updateStats();
    });
    document.getElementById('debugBtn').addEventListener('click', () => {
        const debugs = [
            'Component initialized',
            'Event listener attached',
            'Rendering complete',
            'State updated'
        ];
        document.dispatchEvent(new CustomEvent('wb:debug', {
            detail: {
                message: debugs[Math.floor(Math.random() * debugs.length)],
                source: 'demo'
            }
        }));
        updateStats();
    });
    document.getElementById('clearBtn').addEventListener('click', () => {
        if (eventLog && eventLog.clearEvents) {
            eventLog.clearEvents();
            eventCount = 0;
            errorCount = 0;
            eventTimes = [];
            updateStats();
        }
    });
    function updateStats() {
        const now = Date.now();
        eventTimes.push(now);
        eventTimes = eventTimes.filter(time => now - time < 10000);
        document.getElementById('totalEvents').textContent = eventCount;
        document.getElementById('visibleEvents').textContent = eventLog?.events?.length || 0;
        document.getElementById('errorCount').textContent = errorCount;
        document.getElementById('eventRate').textContent = (eventTimes.length / 10).toFixed(1);
    }
    setInterval(updateStats, 1000);
    updateStats();
});
