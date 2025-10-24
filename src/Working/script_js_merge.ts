export {};
// @ts-nocheck
// ADD THESE FUNCTIONS TO THE END OF YOUR EXISTING script.js FILE
// (After the closing brace of window.initControlPanelHandlers function)

// =============================================================================
// ENHANCED SAVE FUNCTIONALITY WITH THEME PRESERVATION
// =============================================================================

// Function to get current website state including theme, layout, and colors
function getCurrentWebsiteState(): any {
  const body = document.body;
  const documentElement = document.documentElement;
  
  return {
    layout: body.getAttribute('data-layout') || 'top-nav',
    theme: body.getAttribute('data-theme') || documentElement.getAttribute('data-theme') || 'default',
    mode: body.getAttribute('data-mode') || documentElement.getAttribute('data-mode') || 'dark',
    colors: {
      primary: getComputedStyle(documentElement).getPropertyValue('--primary').trim(),
      secondary: getComputedStyle(documentElement).getPropertyValue('--secondary').trim(),
      accent: getComputedStyle(documentElement).getPropertyValue('--accent').trim(),
      primaryLight: getComputedStyle(documentElement).getPropertyValue('--primary-light').trim(),
      primaryDark: getComputedStyle(documentElement).getPropertyValue('--primary-dark').trim(),
      hoverColor: getComputedStyle(documentElement).getPropertyValue('--hover-color').trim(),
    },
    gradientEnabled: document.getElementById('gradient-toggle')?.checked || false,
  };
}

// Function to fetch CSS content from styles.css
async function getStylesCSS(): any {
  try {
    const response = await fetch('./styles.css');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.warn('Could not fetch styles.css, using fallback CSS:', error);
    return getFallbackCSS();
  }
}

// Fallback CSS with essential theme styles
function getFallbackCSS(): any {
  return `
/* Essential theme styles - fallback when styles.css can't be fetched */
:root {
  --primary: #6366f1; --secondary: #64748b; --accent: #10b981;
  --primary-light: #8f91f3; --primary-dark: #4244b8;
  --dark-bg-primary: #222222; --dark-bg-secondary: #333333;
  --dark-text-primary: #ffffff; --dark-text-secondary: #cccccc;
  --light-bg-primary: #f8fafc; --light-bg-secondary: #ffffff;
  --light-text-primary: #0f172a; --light-text-secondary: #475569;
}

body { 
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
  margin: 0; padding: 0; min-height: 100vh; transition: all 0.3s ease;
}

body[data-mode="dark"] { 
  background: var(--dark-bg-primary); color: var(--dark-text-primary); 
  --bg-primary: var(--dark-bg-primary); --bg-secondary: var(--dark-bg-secondary);
  --text-primary: var(--dark-text-primary); --text-secondary: var(--dark-text-secondary);
}

body[data-mode="light"] { 
  background: var(--light-bg-primary); color: var(--light-text-primary); 
  --bg-primary: var(--light-bg-primary); --bg-secondary: var(--light-bg-secondary);
  --text-primary: var(--light-text-primary); --text-secondary: var(--light-text-secondary);
}

.site-container { display: grid; min-height: 100vh; transition: all 0.3s ease; }

/* Layout system */
body[data-layout="top-nav"] .site-container { 
  grid-template-columns: 1fr; grid-template-rows: auto 1fr auto; 
  grid-template-areas: "nav" "content" "footer"; 
}
body[data-layout="left-nav"] .site-container { 
  grid-template-columns: 200px 1fr; grid-template-rows: 1fr auto; 
  grid-template-areas: "nav content" "nav footer"; 
}
body[data-layout="right-nav"] .site-container { 
  grid-template-columns: 1fr 200px; grid-template-rows: 1fr auto; 
  grid-template-areas: "content nav" "footer nav"; 
}

.site-nav { grid-area: nav; background: var(--bg-secondary); }
.main-content { grid-area: content; padding: 2rem; }
.site-footer { grid-area: footer; background: var(--bg-secondary); padding: 2rem; text-align: center; }

/* Theme colors */
.site-title, .section-title, .card-title, .hero-title { color: var(--primary) !important; }
.nav-link { color: var(--text-primary); text-decoration: none; padding: 1rem; display: block; transition: all 0.3s ease; }
.nav-link:hover { background: var(--primary); color: white; }
.cta-button { background: var(--primary); color: white; padding: 1rem 2rem; border: none; border-radius: 50px; cursor: pointer; }
.content-card { background: var(--bg-secondary); padding: 2rem; border-radius: 12px; border-left: 3px solid var(--primary); }
.card-icon { color: var(--accent); }

/* Theme overrides */
:root[data-theme="cyberpunk"] { --primary: #00ffff; --secondary: #ff00ff; --accent: #ff0080; }
:root[data-theme="ocean"] { --primary: #0ea5e9; --secondary: #38bdf8; --accent: #06b6d4; }
:root[data-theme="sunset"] { --primary: #f97316; --secondary: #fb923c; --accent: #ef4444; }
:root[data-theme="forest"] { --primary: #059669; --secondary: #10b981; --accent: #84cc16; }
  `;
}

// Enhanced save function with complete theme preservation
async function saveWebsiteWithTheme(): any {
  try {
    console.log('Starting enhanced save with theme preservation...');
    
    const currentState = getCurrentWebsiteState();
    console.log('Current website state:', currentState);

    // Clone the site container
    const siteContainer = document.getElementById('site-container');
    if (!siteContainer) {
      throw new Error('Site container not found');
    }
    
    const clonedSite = siteContainer.cloneNode(true);

    // Remove edit mode attributes and classes
    clonedSite.classList.remove('edit-mode');
    const editables = clonedSite.querySelectorAll('.editable');
    editables.forEach((el): any => {
      el.removeAttribute('contenteditable');
      el.classList.remove('edit-mode');
    });

    // Remove all insert media buttons
    const insertMediaButtons = clonedSite.querySelectorAll('.contextual-insert-media-btn, .insert-media-btn, .insert-media-above-btn, .insert-media-below-btn');
    insertMediaButtons.forEach((button) => button.remove());

    // Create new HTML document
    const exportDoc = document.implementation.createHTMLDocument('My Website');
    
    // Copy meta tags and title
    const originalHead = document.head;
    const exportHead = exportDoc.head;
    
    const metaTags = originalHead.querySelectorAll('meta');
    metaTags.forEach((tag): any => {
      exportHead.appendChild(tag.cloneNode(true));
    });
    
    const titleTag = originalHead.querySelector('title');
    if (titleTag) {
      exportHead.querySelector('title').textContent = titleTag.textContent;
    }

    // Get CSS content and create embedded styles
    const cssContent = await getStylesCSS();
    const styleElement = document.createElement('style');
    
    // Create comprehensive CSS with current theme variables
    const themeCSS = `
/* Embedded CSS with current theme variables */
${cssContent}

/* Current theme variables override */
:root {
  --primary: ${currentState.colors.primary || '#6366f1'};
  --secondary: ${currentState.colors.secondary || '#64748b'};
  --accent: ${currentState.colors.accent || '#10b981'};
  --primary-light: ${currentState.colors.primaryLight || '#8f91f3'};
  --primary-dark: ${currentState.colors.primaryDark || '#4244b8'};
  --hover-color: ${currentState.colors.hoverColor || currentState.colors.primary || '#6366f1'};
}

/* Ensure proper theme application */
body[data-theme="${currentState.theme}"][data-mode="${currentState.mode}"] {
  background: var(${currentState.mode === 'dark' ? '--dark-bg-primary' : '--light-bg-primary'});
  color: var(${currentState.mode === 'dark' ? '--dark-text-primary' : '--light-text-primary'});
}
    `;
    
    styleElement.textContent = themeCSS;
    exportHead.appendChild(styleElement);

    // Set up the body with proper attributes and classes
    const exportBody = exportDoc.body;
    exportBody.appendChild(clonedSite);
    
    exportBody.setAttribute('data-theme', currentState.theme);
    exportBody.setAttribute('data-layout', currentState.layout);
    exportBody.setAttribute('data-mode', currentState.mode);
    
    // Set appropriate classes
    exportBody.className = `theme-${currentState.theme} ${currentState.mode}-mode`;

    // Add initialization script to preserve theme on load
    const initScript = document.createElement('script');
    initScript.textContent = `
// Theme initialization - ensures proper theme application on page load
(function() {
  const savedSettings = {
    theme: '${currentState.theme}',
    layout: '${currentState.layout}',
    mode: '${currentState.mode}',
    gradientEnabled: ${currentState.gradientEnabled}
  };
  
  console.log('Website loaded with preserved settings:', savedSettings);
  
  // Apply settings immediately to prevent flash of unstyled content
  document.documentElement.setAttribute('data-theme', savedSettings.theme);
  document.documentElement.setAttribute('data-mode', savedSettings.mode);
  document.body.setAttribute('data-theme', savedSettings.theme);
  document.body.setAttribute('data-mode', savedSettings.mode);
  document.body.setAttribute('data-layout', savedSettings.layout);
  document.body.className = 'theme-' + savedSettings.theme + ' ' + savedSettings.mode + '-mode';
  
  // Apply gradient if it was enabled
  if (savedSettings.gradientEnabled) {
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      heroSection.classList.add('gradient-mode');
    }
  }
  
  // Set CSS custom properties
  const root = document.documentElement;
  root.style.setProperty('--primary', '${currentState.colors.primary || '#6366f1'}');
  root.style.setProperty('--secondary', '${currentState.colors.secondary || '#64748b'}');
  root.style.setProperty('--accent', '${currentState.colors.accent || '#10b981'}');
  root.style.setProperty('--primary-light', '${currentState.colors.primaryLight || '#8f91f3'}');
  root.style.setProperty('--primary-dark', '${currentState.colors.primaryDark || '#4244b8'}');
  root.style.setProperty('--hover-color', '${currentState.colors.hoverColor || currentState.colors.primary || '#6366f1'}');
})();
    `;
    exportHead.appendChild(initScript);

    // Generate final HTML
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `website-${currentState.theme}-${currentState.mode}-${currentState.layout}-${timestamp}.html`;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en" data-theme="${currentState.theme}" data-mode="${currentState.mode}">
${exportHead.outerHTML}
${exportBody.outerHTML}
</html>`;

    // Create and trigger download
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    let downloadLink = document.getElementById('download-link');
    if (!downloadLink) {
      downloadLink = document.createElement('a');
      downloadLink.id = 'download-link';
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
    }
    
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    // Update status message
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
      statusMessage.textContent = `Website saved successfully! (${filename})`;
      setTimeout((): any => {
        const isEditMode = document.body.classList.contains('edit-mode');
        statusMessage.textContent = isEditMode
          ? 'Edit mode ON - Click any text to edit'
          : 'Edit mode OFF - Content is locked';
      }, 4000);
    }
    
    console.log(`Website saved successfully as: ${filename}`);
    console.log('Preserved settings:', currentState);
    
  } catch (error) {
    console.error('Error saving website:', error);
    
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
      statusMessage.textContent = 'Error saving website: ' + error.message;
      setTimeout((): any => {
        const isEditMode = document.body.classList.contains('edit-mode');
        statusMessage.textContent = isEditMode
          ? 'Edit mode ON - Click any text to edit'
          : 'Edit mode OFF - Content is locked';
      }, 5000);
    }
  }
}

// Make the function globally available
window.saveWebsiteWithTheme = saveWebsiteWithTheme;

console.log('Enhanced save functionality loaded with complete theme preservation!');
