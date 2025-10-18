// Professional-Developer-HCS-System.js
// JavaScript for the Professional Developer HCS System demo

// Update body background color to match theme
function updateBodyBackground() {
  const root = document.documentElement;
  const computed = getComputedStyle(root);
  const bgColor = computed.getPropertyValue('--background').trim();
  if (bgColor) {
    document.body.style.backgroundColor = bgColor;
  }
}

// Event logging utility
function logEvent(emoji, message, data = null) {
  try {
    console.log(`${emoji} ${message}`, data || '');
    const detail = { emoji, message, data, timestamp: new Date().toISOString() };
    document.dispatchEvent(new CustomEvent('wb:event', { detail, bubbles: true, composed: true }));
  } catch (err) {
    console.log(emoji, message, data || '', err);
  }
}

// Theme configurations
const themes = {
  default: { hue: 240, sat: 70, light: 50 },
  cyberpunk: { hue: 320, sat: 100, light: 50 },
  ocean: { hue: 200, sat: 80, light: 50 },
  sunset: { hue: 25, sat: 90, light: 55 },
  forest: { hue: 140, sat: 60, light: 45 },
  lavender: { hue: 270, sat: 65, light: 60 },
  sakura: { hue: 340, sat: 70, light: 70 },
  midnight: { hue: 230, sat: 85, light: 35 },
  neonDreams: { hue: 280, sat: 95, light: 55 },
  retroWave: { hue: 330, sat: 85, light: 60 },
  arctic: { hue: 190, sat: 75, light: 65 },
  desert: { hue: 35, sat: 65, light: 60 },
  emerald: { hue: 150, sat: 75, light: 45 },
  ruby: { hue: 0, sat: 80, light: 50 },
  amber: { hue: 45, sat: 85, light: 55 },
  slate: { hue: 210, sat: 25, light: 45 }
};

// Apply theme function
function applyTheme(themeId) {
  const theme = themes[themeId];
  if (!theme) {
    logEvent('❌', `Theme not found: ${themeId}`);
    return;
  }
  
  const root = document.documentElement;
  
  // Set base HSL values
  root.style.setProperty('--hue-primary', theme.hue);
  root.style.setProperty('--saturation-primary', theme.sat);
  root.style.setProperty('--lightness-primary', theme.light);
  
  // CRITICAL: Set the actual color values directly
  // Primary
  root.style.setProperty('--primary', `hsl(${theme.hue}, ${theme.sat}%, ${theme.light}%)`);
  root.style.setProperty('--primary-dark', `hsl(${theme.hue}, ${theme.sat}%, ${theme.light - 15}%)`);
  root.style.setProperty('--primary-light', `hsl(${theme.hue}, ${theme.sat - 20}%, ${theme.light + 25}%)`);
  
  // Secondary (complementary +180°)
  const secondaryHue = (theme.hue + 180) % 360;
  root.style.setProperty('--secondary', `hsl(${secondaryHue}, ${theme.sat - 10}%, ${theme.light}%)`);
  root.style.setProperty('--secondary-hue', secondaryHue);
  
  // Accent (analogous -30°)
  const accentHue = (theme.hue - 30 + 360) % 360;
  root.style.setProperty('--accent', `hsl(${accentHue}, ${theme.sat - 10}%, ${theme.light}%)`);
  root.style.setProperty('--accent-hue', accentHue);
  
  // Highlight (+45°)
  const highlightHue = (theme.hue + 45) % 360;
  root.style.setProperty('--highlight', `hsl(${highlightHue}, ${theme.sat}%, ${theme.light}%)`);
  
  // All angle variations
  [30, 45, 60, 90].forEach(angle => {
    root.style.setProperty(`--plus${angle}`, `hsl(${(theme.hue + angle) % 360}, ${theme.sat}%, ${theme.light}%)`);
    root.style.setProperty(`--minus${angle}`, `hsl(${(theme.hue - angle + 360) % 360}, ${theme.sat}%, ${theme.light}%)`);
  });
  
  logEvent('🎨', `Applied theme: ${themeId}`, theme);
  
  setTimeout(() => updateBodyBackground(), 100);
}

// Load and render markdown documentation
async function loadDocumentation() {
  try {
    const response = await fetch('Professional-Developer-HCS-System.md');
    const markdown = await response.text();
    const html = marked.parse(markdown);
    const el = document.getElementById('markdown-content');
    if (el) {
      el.innerHTML = html;
      logEvent('📚', 'Documentation loaded successfully');
    }
  } catch (error) {
    const el = document.getElementById('markdown-content');
    if (el) {
      el.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-secondary);"><h2>❌ Failed to load documentation</h2><p>Error: ${error.message}</p></div>`;
    }
    logEvent('❌', 'Failed to load documentation', { error: error.message });
  }
}

// Initialize sidebar nav buttons
function initNavButtons() {
  const navButtons = document.querySelectorAll('.nav-btn');
  
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const b = e.currentTarget;
      
      // Active state
      navButtons.forEach(nb => {
        nb.classList.remove('active');
        nb.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('active');
      b.setAttribute('aria-pressed', 'true');
      
      // Mode buttons
      if (b.dataset && b.dataset.mode) {
        const mode = b.dataset.mode;
        document.body.setAttribute('data-mode', mode);
        document.body.setAttribute('data-theme', mode);
        document.documentElement.setAttribute('data-mode', mode);
        document.documentElement.setAttribute('data-theme', mode);
        logEvent('🌓', `Mode switched to: ${mode}`);
        return;
      }
      
      // View buttons
      if (b.dataset && b.dataset.view) {
        const v = b.dataset.view;
        const demo = document.getElementById('demo-section');
        const docs = document.getElementById('docs-section');
        if (!demo || !docs) return;
        
        if (v === 'code') {
          demo.style.display = 'block';
          docs.style.display = 'none';
          demo.setAttribute('aria-hidden', 'false');
          docs.setAttribute('aria-hidden', 'true');
          logEvent('🔁', 'View switched to: code');
        } else if (v === 'docs') {
          demo.style.display = 'none';
          docs.style.display = 'block';
          demo.setAttribute('aria-hidden', 'true');
          docs.setAttribute('aria-hidden', 'false');
          loadDocumentation();
          logEvent('🔁', 'View switched to: docs');
        }
        return;
      }
      
      // Theme buttons
      if (b.dataset && b.dataset.theme) {
        const t = b.dataset.theme;
        applyTheme(t);
        logEvent('🎨', `Theme button: ${t}`);
      }
    });
  });
}

// Initialize on DOM ready
function init() {
  // Apply default theme
  applyTheme('default');
  
  // Initialize nav buttons
  initNavButtons();
  
  // Set default view
  const demo = document.getElementById('demo-section');
  const docs = document.getElementById('docs-section');
  if (demo && docs) {
    demo.style.display = 'block';
    docs.style.display = 'none';
    demo.setAttribute('aria-hidden', 'false');
    docs.setAttribute('aria-hidden', 'true');
  }
  
  logEvent('🚀', 'Page loaded', { mode: 'dark', theme: 'default' });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
