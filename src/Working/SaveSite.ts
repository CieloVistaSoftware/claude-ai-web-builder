// @ts-nocheck
// Enhanced Save Website Functionality - Preserves Themes, Colors, and Layouts
// Add this to your existing script.js file

// Function to get current theme and layout state
function getCurrentWebsiteState(): any {
  const body = document.body;
  const documentElement = document.documentElement;
  
  return {
    // Layout information
    layout: body.getAttribute('data-layout') || 'top-nav',
    
    // Theme information
    theme: body.getAttribute('data-theme') || documentElement.getAttribute('data-theme') || 'default',
    mode: body.getAttribute('data-mode') || documentElement.getAttribute('data-mode') || 'dark',
    
    // Color information from CSS custom properties
    colors: {
      primary: getComputedStyle(documentElement).getPropertyValue('--primary').trim(),
      secondary: getComputedStyle(documentElement).getPropertyValue('--secondary').trim(),
      accent: getComputedStyle(documentElement).getPropertyValue('--accent').trim(),
    },
    
    // Control panel settings
    gradientEnabled: document.getElementById('gradient-toggle')?.checked || false,
    
    // Get current color slider values if they exist
    hue: document.getElementById('hue-slider')?.value || '240',
    saturation: document.getElementById('saturation-slider')?.value || '70',
    lightness: document.getElementById('lightness-slider')?.value || '50',
    harmonyAngle: document.getElementById('harmony-angle-slider')?.value || '60'
  };
}

// Function to generate the complete website HTML with embedded styles and settings
// Note: This functionality is now handled by SaveLoadManager.ts
function generateCompleteWebsite(): any {
  // Use the SaveLoadManager for consistent save functionality
  if (window.SaveLoadManager) {
    return window.SaveLoadManager.saveWebsite();
  }
  
  // Fallback for when SaveLoadManager is not available
  console.warn('SaveLoadManager not found, using fallback save functionality');
  const currentState = getCurrentWebsiteState();
  
  const siteContainer = document.getElementById('site-container');
  if (!siteContainer) {
    throw new Error('Site container not found');
  }
  
  const clonedSite = siteContainer.cloneNode(true);
  
  // Basic cleanup - detailed logic is in SaveLoadManager
  clonedSite.classList.remove('edit-mode');
  const editableElements = clonedSite.querySelectorAll('[contenteditable]');
  editableElements.forEach(el => {
    el.removeAttribute('contenteditable');
    el.classList.remove('editable');
  });
  
  const insertMediaButtons = clonedSite.querySelectorAll('.insert-media-btn, .contextual-insert-media-btn, .insert-media-above-btn, .insert-media-below-btn');
  insertMediaButtons.forEach(btn => btn.remove());
  
  return `<!DOCTYPE html>
<html lang="en" data-theme="${currentState.theme}" data-mode="${currentState.mode}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <style>${generateThemeCSS(currentState)}</style>
</head>
<body data-theme="${currentState.theme}" data-mode="${currentState.mode}" data-layout="${currentState.layout}" class="theme-${currentState.theme} ${currentState.mode}-mode">
  ${clonedSite.outerHTML}
</body>
</html>`;
}

// Function to generate CSS with current theme
function generateThemeCSS(state): any {
  // Get the current styles.css content (you'll need to fetch this)
  // For now, I'll include the essential theme-related CSS
  return `
/* Theme and Layout Preservation CSS */
:root {
  --primary: ${state.colors.primary || '#6366f1'};
  --secondary: ${state.colors.secondary || '#64748b'};
  --accent: ${state.colors.accent || '#10b981'};
  --primary-light: #8f91f3;
  --primary-dark: #4244b8;

  /* Dark mode colors */
  --dark-bg-primary: #222222;
  --dark-bg-secondary: #333333;
  --dark-text-primary: #ffffff;
  --dark-text-secondary: #cccccc;
  --dark-border-color: #555555;

  /* Light mode colors */
  --light-bg-primary: #f8fafc;
  --light-bg-secondary: #ffffff;
  --light-text-primary: #0f172a;
  --light-text-secondary: #475569;
  --light-border-color: #e2e8f0;
}

/* Theme-specific overrides */
:root[data-theme="cyberpunk"] {
  --primary: #00ffff;
  --secondary: #ff00ff;
  --accent: #ff0080;
  --dark-text-primary: #00ffff;
  --dark-text-secondary: #ff0080;
  --dark-border-color: #00ffff;
  --light-text-primary: #0a0a0a; 
  --light-text-secondary: #9900cc;
  --light-border-color: #00ccff;
}

:root[data-theme="ocean"] {
  --primary: #0ea5e9;
  --secondary: #38bdf8;
  --accent: #06b6d4;
}

:root[data-theme="sunset"] {
  --primary: #f97316;
  --secondary: #fb923c;
  --accent: #ef4444;
}

:root[data-theme="forest"] {
  --primary: #059669;
  --secondary: #10b981;
  --accent: #84cc16;
}

/* Mode-specific variables */
body[data-mode="dark"] {
  --bg-primary: var(--dark-bg-primary);
  --bg-secondary: var(--dark-bg-secondary);
  --text-primary: var(--dark-text-primary);
  --text-secondary: var(--dark-text-secondary);
  --border-color: var(--dark-border-color);
  background-color: var(--dark-bg-primary);
  color: var(--dark-text-primary);
}

body[data-mode="light"] {
  --bg-primary: var(--light-bg-primary);
  --bg-secondary: var(--light-bg-secondary);
  --text-primary: var(--light-text-primary);
  --text-secondary: var(--light-text-secondary);
  --border-color: var(--light-border-color);
  background-color: var(--light-bg-primary);
  color: var(--light-text-primary);
}

/* Base Styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg-primary) !important;
  color: var(--text-primary) !important;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* Layout System */
.site-container {
  display: grid !important;
  min-height: 100vh !important;
  transition: all 0.3s ease !important;
}

/* Top Navigation Layout */
body[data-layout="top-nav"] .site-container {
  grid-template-columns: 1fr !important;
  grid-template-rows: auto 1fr auto !important;
  grid-template-areas: "nav" "content" "footer" !important;
}

body[data-layout="top-nav"] .site-nav {
  grid-area: nav !important;
  background: var(--bg-secondary) !important;
  padding: 0 !important;
}

body[data-layout="top-nav"] .nav-list {
  display: flex !important;
  flex-direction: row !important;
  justify-content: center !important;
  align-items: center !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
  gap: 0 !important;
}

body[data-layout="top-nav"] .nav-link {
  display: block !important;
  padding: 1rem 1.5rem !important;
  color: var(--text-primary) !important;
  text-decoration: none !important;
  transition: all 0.3s ease !important;
  border-bottom: 2px solid transparent !important;
}

body[data-layout="top-nav"] .nav-link:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-bottom-color: var(--primary) !important;
  color: var(--primary) !important;
}

/* Left Navigation Layout */
body[data-layout="left-nav"] .site-container {
  grid-template-columns: 200px 1fr !important;
  grid-template-rows: 1fr auto !important;
  grid-template-areas: "nav content" "nav footer" !important;
}

body[data-layout="left-nav"] .site-nav {
  grid-area: nav !important;
  background: var(--bg-secondary) !important;
  height: 100vh !important;
  overflow-y: auto !important;
}

body[data-layout="left-nav"] .nav-list {
  display: flex !important;
  flex-direction: column !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

body[data-layout="left-nav"] .nav-link {
  display: block !important;
  padding: 0.75rem 1rem !important;
  color: var(--text-primary) !important;
  text-decoration: none !important;
  transition: all 0.3s ease !important;
  border-left: 3px solid transparent !important;
}

body[data-layout="left-nav"] .nav-link:hover {
  background: var(--primary) !important;
  border-left-color: var(--accent) !important;
  color: white !important;
}

/* Right Navigation Layout */
body[data-layout="right-nav"] .site-container {
  grid-template-columns: 1fr 200px !important;
  grid-template-rows: 1fr auto !important;
  grid-template-areas: "content nav" "footer nav" !important;
}

body[data-layout="right-nav"] .site-nav {
  grid-area: nav !important;
  background: var(--bg-secondary) !important;
  height: 100vh !important;
  overflow-y: auto !important;
}

body[data-layout="right-nav"] .nav-list {
  display: flex !important;
  flex-direction: column !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

body[data-layout="right-nav"] .nav-link {
  display: block !important;
  padding: 0.75rem 1rem !important;
  color: var(--text-primary) !important;
  text-decoration: none !important;
  transition: all 0.3s ease !important;
  border-right: 3px solid transparent !important;
}

body[data-layout="right-nav"] .nav-link:hover {
  background: var(--primary) !important;
  border-right-color: var(--accent) !important;
  color: white !important;
}

/* Content Styling */
.main-content { grid-area: content !important; padding: 2rem !important; }
.site-footer { grid-area: footer !important; }

.site-header {
  text-align: center;
  padding: 3rem 0;
  background: var(--bg-primary);
}

.site-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary) !important;
}

.site-subtitle {
  font-size: 1.25rem;
  color: var(--secondary) !important;
}

.hero-section {
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 70%, var(--accent) 30%) 100%) !important;
  border-radius: 12px;
  margin: 2rem 0;
  transition: background 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary) !important;
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: var(--text-secondary) !important;
}

.cta-button {
  background: var(--primary);
  color: var(--text-primary) !important;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.content-section {
  margin: 3rem 0;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--primary) !important;
  border-bottom: 3px solid var(--primary);
  padding-bottom: 0.5rem;
  display: inline-block;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.content-card {
  background: var(--bg-secondary) !important;
  padding: 2rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 3px solid var(--primary);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-left: 3px solid var(--accent);
}

.card-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  color: var(--accent);
  transition: all 0.3s ease;
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary) !important;
}

.card-description {
  color: var(--text-secondary) !important;
  line-height: 1.6;
}

.site-footer {
  background: var(--bg-secondary) !important;
  padding: 2rem;
  text-align: center;
  border-top: 3px solid var(--primary);
  margin-top: auto;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-link {
  color: var(--secondary) !important;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: var(--primary) !important;
}
`;
}

// Function to generate JavaScript for theme variables
function generateThemeVariablesJS(state): any {
  return `
      // Set theme-specific CSS custom properties
      root.style.setProperty('--primary', '${state.colors.primary || '#6366f1'}');
      root.style.setProperty('--secondary', '${state.colors.secondary || '#64748b'}');
      root.style.setProperty('--accent', '${state.colors.accent || '#10b981'}');
      
      // Apply theme-specific overrides
      if ('${state.theme}' === 'cyberpunk') {
        root.style.setProperty('--primary', '#00ffff');
        root.style.setProperty('--secondary', '#ff00ff');
        root.style.setProperty('--accent', '#ff0080');
      } else if ('${state.theme}' === 'ocean') {
        root.style.setProperty('--primary', '#0ea5e9');
        root.style.setProperty('--secondary', '#38bdf8');
        root.style.setProperty('--accent', '#06b6d4');
      } else if ('${state.theme}' === 'sunset') {
        root.style.setProperty('--primary', '#f97316');
        root.style.setProperty('--secondary', '#fb923c');
        root.style.setProperty('--accent', '#ef4444');
      } else if ('${state.theme}' === 'forest') {
        root.style.setProperty('--primary', '#059669');
        root.style.setProperty('--secondary', '#10b981');
        root.style.setProperty('--accent', '#84cc16');
      }
  `;
}

// Enhanced save website function
// Note: This functionality is now handled by SaveLoadManager.ts
function saveWebsiteWithTheme(): any {
  try {
    // Use the SaveLoadManager for consistent save functionality
    if (window.SaveLoadManager) {
      return window.SaveLoadManager.saveWebsite();
    }
    
    // Fallback for when SaveLoadManager is not available
    console.warn('SaveLoadManager not found, using fallback save functionality');
    const completeWebsite = generateCompleteWebsite();
    const currentState = getCurrentWebsiteState();
    
    // Create filename with theme and mode info
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `website-${currentState.theme}-${currentState.mode}-${currentState.layout}-${timestamp}.html`;
    
    // Create and trigger download
    const blob = new Blob([completeWebsite], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.getElementById('download-link') || document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    
    if (!document.getElementById('download-link')) {
      document.body.appendChild(downloadLink);
    }
    
    downloadLink.click();
    
    // Clean up
    setTimeout((): any => {
      URL.revokeObjectURL(url);
    }, 1000);
    
    // Show success message
    console.log(`Website saved as: ${filename}`);
    alert(`Website saved successfully!\nTheme: ${currentState.theme}\nMode: ${currentState.mode}\nLayout: ${currentState.layout}`);
    
  } catch (error) {
    console.error('Error saving website:', error);
    alert('Error saving website. Please check the console for details.');
  }
}

// Enhanced import functionality that preserves themes
// Note: This functionality is now handled by SaveLoadManager.ts
function importWebsiteWithTheme(file): any {
  // Use the SaveLoadManager for consistent import functionality
  if (window.SaveLoadManager) {
    return window.SaveLoadManager.importWebsite(file);
  }
  
  // Fallback for when SaveLoadManager is not available
  console.warn('SaveLoadManager not found, using fallback import functionality');
  return new Promise((resolve, reject): any => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const htmlContent = e.target.result;
        const parser = new DOMParser();
        const importedDoc = parser.parseFromString(htmlContent, 'text/html');
        
        // Extract theme information from the imported document
        const importedBody = importedDoc.body;
        const importedHtml = importedDoc.documentElement;
        
        const theme = importedBody.getAttribute('data-theme') || 
                     importedHtml.getAttribute('data-theme') || 'default';
        const mode = importedBody.getAttribute('data-mode') || 
                    importedHtml.getAttribute('data-mode') || 'dark';
        const layout = importedBody.getAttribute('data-layout') || 'top-nav';
        
        // Extract just the site content
        const siteContainer = importedDoc.querySelector('#site-container, .site-container');
        if (siteContainer) {
          const currentSiteContainer = document.querySelector('#site-container, .site-container');
          if (currentSiteContainer) {
            currentSiteContainer.innerHTML = siteContainer.innerHTML;
          }
        }
        
        // Apply the imported theme settings
        document.body.setAttribute('data-theme', theme);
        document.body.setAttribute('data-mode', mode);
        document.body.setAttribute('data-layout', layout);
        document.body.className = `theme-${theme} ${mode}-mode`;
        
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-mode', mode);
        
        console.log(`Website imported with theme: ${theme}, mode: ${mode}, layout: ${layout}`);
        resolve({ theme, mode, layout });
        
      } catch (error) {
        console.error('Error importing website:', error);
        reject(error);
      }
    };
    
    reader.onerror = function() {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

// Function to update control panel UI to match imported state
function updateControlPanelFromState(state): any {
  // Update theme selector
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.value = state.theme;
  }
  
  // Update mode toggle
  const modeToggle = document.getElementById('dark-mode-toggle');
  if (modeToggle) {
    modeToggle.checked = state.mode === 'dark';
  }
  
  // Update layout selector
  const layoutSelect = document.getElementById('layout-select');
  if (layoutSelect) {
    layoutSelect.value = state.layout;
  }
}

// Example of how to integrate with existing event handlers
// Add this to your existing event handler initialization:

/*
// Enhanced save button handler
document.getElementById('save-btn')?.addEventListener('click', saveWebsiteWithTheme);

// Enhanced import button handler
document.getElementById('import-btn')?.addEventListener('click', (): any => {
  document.getElementById('import-file')?.click();
});

document.getElementById('import-file')?.addEventListener('change', async (e): any => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await importWebsiteWithTheme(file);
      alert(`Website imported successfully!\nTheme: ${result.theme}\nMode: ${result.mode}\nLayout: ${result.layout}`);
    } catch (error) {
      alert('Error importing website: ' + error.message);
    }
  }
});
*/

console.log('Enhanced save/import functionality loaded with theme preservation!');
