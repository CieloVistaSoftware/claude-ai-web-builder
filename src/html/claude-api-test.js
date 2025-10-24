// Extracted from claude-api-test.html
const API_BASE = 'http://localhost:3001';

// Initialize theme and check API status on load
window.addEventListener('load', async () => {
    initializeTheme();
    initializeForm();
    await checkApiStatus();
});

function initializeForm() {
    // Set default content with current timestamp
    const defaultContent = `## API Test Event - ${new Date().toLocaleString()}

**Type**: Test Entry
**Source**: Claude Events API Test Client
**Timestamp**: ${new Date().toISOString()}
**Message**: Testing API save functionality

This entry was created by the API test client to verify that events are properly prepended to the TOP of claude.md files, not appended to the bottom.

**Expected Result**: This should appear at the beginning of the claude.md file.

---

`;
    document.getElementById('saveContent').value = defaultContent;
}

function initializeTheme() {
    const isDark = localStorage.getItem('wb-theme') === 'dark';
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').innerHTML = '☀️ Light Mode';
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
        html.removeAttribute('data-theme');
        themeToggle.innerHTML = '🌙 Dark Mode';
        localStorage.setItem('wb-theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '☀️ Light Mode';
        localStorage.setItem('wb-theme', 'dark');
    }
}

async function checkApiStatus() {
    const statusEl = document.getElementById('apiStatus');
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        if (response.ok) {
            const data = await response.json();
            statusEl.innerHTML = `✅ API Server is running (uptime: ${Math.round(data.uptime)}s)`;
            statusEl.className = 'status success';
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        statusEl.innerHTML = `❌ API Server not available: ${error.message}<br><small>Make sure to run: <code>node server/claude-events-api.js</code></small>`;
        statusEl.className = 'status error';
    }
}

async function testEndpoint(endpoint, options = {}) {
    const responseArea = document.getElementById('responseArea');
    const body = document.body;
    // Show loading state
    body.classList.add('loading');
    responseArea.textContent = `⏳ Loading ${endpoint}...`;
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();
        const formatted = JSON.stringify(data, null, 2);
        responseArea.innerHTML = `<strong>Status:</strong> ${response.status}\n<strong>Endpoint:</strong> ${endpoint}\n<strong>Response:</strong>\n\n${formatted}`;
        // Highlight important data
        if (data.totalErrors > 0) {
            responseArea.style.borderLeftColor = 'var(--error-color)';
        } else if (data.status === 'healthy') {
            responseArea.style.borderLeftColor = 'var(--success-color)';
        } else {
            responseArea.style.borderLeftColor = 'var(--info-color)';
        }
    } catch (error) {
        responseArea.innerHTML = `<strong>❌ Error:</strong> ${error.message}\n\nMake sure the API server is running:\n<code>node server/claude-events-api.js</code>`;
        responseArea.style.borderLeftColor = 'var(--error-color)';
    } finally {
        body.classList.remove('loading');
    }
}

async function testRecentEvents() {
    const hours = document.getElementById('hoursInput').value || 24;
    await testEndpoint(`/api/recent/${hours}`);
}

async function testDirectoryEvents() {
    const directory = document.getElementById('directoryInput').value || 'components/wb-color-picker';
    await testEndpoint(`/api/events/dir?path=${encodeURIComponent(directory)}`);
}

async function testSaveEvent() {
    const directory = document.getElementById('saveDirectory').value || '.';
    const content = document.getElementById('saveContent').value;
    const payload = {
        filename: 'claude.md',
        content: content,
        folder: directory,
        referer: window.location.href
    };
    await testEndpoint('/api/save-claude-log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}
