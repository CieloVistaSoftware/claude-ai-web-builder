// @ts-nocheck
// SaveLoadManager.js - Import/export with theme preservation
// =============================================================================
// SAVE/LOAD MODULE - Import/export with theme preservation
// =============================================================================
const SaveLoadManager = {
  // Get current CSS content
  async getStylesCSS() {
    try {
      const response = await fetch('./styles.css');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.text();
    } catch (error) {
      console.warn('Could not fetch styles.css, using fallback CSS:', error);
      return this.getFallbackCSS();
    }
  },

  // Fallback CSS
  getFallbackCSS() {
    return `
/* Essential theme styles */
:root {
  --primary: #6366f1; --secondary: #64748b; --accent: #10b981;
  --primary-light: #8f91f3; --primary-dark: #4244b8;
  --dark-bg-primary: #222222; --dark-bg-secondary: #333333;
  --dark-text-primary: #ffffff; --dark-text-secondary: #cccccc;
  --light-bg-primary: #f8fafc; --light-bg-secondary: #ffffff;
  --light-text-primary: #0f172a; --light-text-secondary: #475569;
}

body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; min-height: 100vh; }
body[data-mode="dark"] { background: var(--dark-bg-primary); color: var(--dark-text-primary); }
body[data-mode="light"] { background: var(--light-bg-primary); color: var(--light-text-primary); }

.site-container { display: grid; min-height: 100vh; }
body[data-layout="top-nav"] .site-container { grid-template-areas: "nav" "content" "footer"; }
body[data-layout="left-nav"] .site-container { grid-template-columns: 200px 1fr; grid-template-areas: "nav content" "nav footer"; }
body[data-layout="right-nav"] .site-container { grid-template-columns: 1fr 200px; grid-template-areas: "content nav" "footer nav"; }

.site-nav { grid-area: nav; background: var(--bg-secondary); }
.main-content { grid-area: content; padding: 2rem; }
.site-footer { grid-area: footer; }
.site-title, .section-title, .card-title { color: var(--primary) !important; }
    `;
  },

  // Save website with theme preservation
  async saveWebsite() {
    try {
      const state = WebsiteState.getState();
      console.log('Saving website with state:', state);

      // Prompt for website title
      let websiteTitle = document.querySelector('.site-title')?.textContent.trim() || 'My Website';
      const customTitle = prompt('Enter title for your website:', websiteTitle);

      // Use custom title if provided
      if (customTitle && customTitle.trim()) {
        websiteTitle = customTitle.trim();
      }

      // Create sanitized filename from title
      const sanitizedTitle = websiteTitle
        .replace(/[^a-z0-9\s-]/gi, '')
        .replace(/\s+/g, '-')
        .toLowerCase();

      // Clone site container and clean it
      const siteContainer = document.getElementById('site-container');
      if (!siteContainer) throw new Error('Site container not found');

      const clonedSite = this.cleanSiteContainer(siteContainer.cloneNode(true));

      // Create export document with custom title
      const exportDoc = document.implementation.createHTMLDocument(websiteTitle);

      // Save title in state for the HTML generation
      state.websiteTitle = websiteTitle;

      // Generate base HTML content
      let htmlContent = await this.generateHTMLContent(exportDoc, clonedSite, state);

      // Process with developer plugins if present (to remove development tools)
      if (window.DevPluginSystem && window.DevPluginSystem.initialized) {
        console.log('Processing with developer plugins before save...');
        htmlContent = await window.DevPluginSystem.beforeSave(htmlContent);
      }

      // Create and trigger download with custom title in filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const filename = `${sanitizedTitle}-${state.theme}-${state.mode}-${timestamp}.html`;
      this.downloadFile(htmlContent, filename);

      UIController.showStatusMessage(`Website "${websiteTitle}" saved successfully!`, 4000);
      console.log(`Website saved: ${filename} (${websiteTitle})`);

    } catch (error) {
      console.error('Error saving website:', error);
      UIController.showStatusMessage('Error saving website: ' + error.message, 5000);
    }
  },

  // Clean site container for export
  cleanSiteContainer(clonedSite) {
    // Remove edit mode classes and attributes
    clonedSite.classList.remove('edit-mode');
    const editables = clonedSite.querySelectorAll('.editable');
    editables.forEach(el => {
      el.removeAttribute('contenteditable');
      el.classList.remove('edit-mode');
    });

    // Remove insert media buttons
    const buttons = clonedSite.querySelectorAll('.contextual-insert-media-btn, .insert-media-btn, .insert-media-above-btn, .insert-media-below-btn');
    buttons.forEach(btn => btn.remove());

    // Remove conflicting inline styles that might override CSS layout rules
    clonedSite.removeAttribute('style');

    // Ensure site container has clean classes
    clonedSite.className = 'site-container';

    return clonedSite;
  },

  // Generate complete HTML content
  async generateHTMLContent(exportDoc, clonedSite, state) {
    // Setup head
    const exportHead = await this.setupExportHead(exportDoc, state);

    // Setup body
    const exportBody = exportDoc.body;
    exportBody.appendChild(clonedSite);

    // Apply all necessary attributes and classes for theme preservation
    exportBody.setAttribute('data-theme', state.theme);
    exportBody.setAttribute('data-layout', state.layout);
    exportBody.setAttribute('data-mode', state.mode);
    exportBody.className = `theme-${state.theme} ${state.mode}-mode`;

    // Get the title of the website for the HTML title tag (use custom title if provided)
    const siteTitle = state.websiteTitle || document.querySelector('.site-title')?.textContent.trim() || 'My Website';

    // Apply inline styles to ensure proper appearance
    exportBody.style.backgroundColor = state.mode === 'dark' ?
      'var(--dark-bg-primary, #222222)' :
      'var(--light-bg-primary, #f8fafc)';
    exportBody.style.color = state.mode === 'dark' ?
      'var(--dark-text-primary, #ffffff)' :
      'var(--light-text-primary, #333333)';

    // Create the enhanced HTML document with proper attributes
    return `<!DOCTYPE html>
<html lang="en" data-theme="${state.theme}" data-mode="${state.mode}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteTitle}</title>
  ${exportHead.innerHTML}
</head>
${exportBody.outerHTML}
</html>`;
  },

  // Setup export document head
  async setupExportHead(exportDoc, state) {
    const originalHead = document.head;
    const exportHead = exportDoc.head;

    // Copy meta tags
    originalHead.querySelectorAll('meta').forEach(tag => {
      exportHead.appendChild(tag.cloneNode(true));
    });

    // Set title
    const titleTag = originalHead.querySelector('title');
    if (titleTag) {
      exportHead.querySelector('title').textContent = titleTag.textContent;
    }

    // Add embedded CSS
    const cssContent = await this.getStylesCSS();
    const styleElement = document.createElement('style');
    styleElement.textContent = this.generateThemeCSS(cssContent, state);
    exportHead.appendChild(styleElement);

    // Add initialization script
    const initScript = document.createElement('script');
    initScript.textContent = this.generateInitScript(state);
    exportHead.appendChild(initScript);

    return exportHead;
  },

  // Generate theme-specific CSS
  generateThemeCSS(cssContent, state) {
    // Get all computed CSS variables from document
    const computedStyle = getComputedStyle(document.documentElement);
    const cssVars: any = {};

    // Get all CSS variables directly related to theming
    [
      '--primary', '--secondary', '--accent',
      '--primary-light', '--primary-dark', '--hover-color',
      '--bg-primary', '--bg-secondary',
      '--text-primary', '--text-secondary',
      '--dark-bg-primary', '--dark-bg-secondary',
      '--dark-text-primary', '--dark-text-secondary',
      '--light-bg-primary', '--light-bg-secondary',
      '--light-text-primary', '--light-text-secondary'
    ].forEach(varName => {
      cssVars[varName] = computedStyle.getPropertyValue(varName).trim() || '';
    });

    // Create a more robust CSS with all theme variables
    return `
${cssContent}

/* Current theme variables override - ENHANCED */
:root {
  --primary: ${state.colors.primary || '#6366f1'};
  --secondary: ${state.colors.secondary || '#64748b'};
  --accent: ${state.colors.accent || '#10b981'};
  --primary-light: ${state.colors.primaryLight || '#8f91f3'};
  --primary-dark: ${state.colors.primaryDark || '#4244b8'};
  --hover-color: ${state.colors.hoverColor || state.colors.primary || '#6366f1'};
  
  /* Current computed values from document - ensures exact colors */
  --bg-primary: ${cssVars['--bg-primary'] || (state.mode === 'dark' ? '#222222' : '#f8fafc')};
  --bg-secondary: ${cssVars['--bg-secondary'] || (state.mode === 'dark' ? '#333333' : '#ffffff')};
  --text-primary: ${cssVars['--text-primary'] || (state.mode === 'dark' ? '#f8fafc' : '#333333')};
  --text-secondary: ${cssVars['--text-secondary'] || (state.mode === 'dark' ? '#cccccc' : '#555555')};
  
  /* Mode-specific variables */
  --dark-bg-primary: ${cssVars['--dark-bg-primary'] || '#222222'};
  --dark-bg-secondary: ${cssVars['--dark-bg-secondary'] || '#333333'};
  --dark-text-primary: ${cssVars['--dark-text-primary'] || '#f8fafc'};
  --dark-text-secondary: ${cssVars['--dark-text-secondary'] || '#cccccc'};
  --light-bg-primary: ${cssVars['--light-bg-primary'] || '#f8fafc'};
  --light-bg-secondary: ${cssVars['--light-bg-secondary'] || '#ffffff'};
  --light-text-primary: ${cssVars['--light-text-primary'] || '#333333'};
  --light-text-secondary: ${cssVars['--light-text-secondary'] || '#555555'};
}

/* Enhanced layout styles for saved websites */
.site-container {
  display: grid !important;
  min-height: 100vh !important;
}

/* Top Navigation Layout - Enhanced */
body[data-layout="top-nav"] .site-container,
.site-container.has-top-nav {
  grid-template-columns: 1fr !important;
  grid-template-rows: auto 1fr auto !important;
  grid-template-areas:
    "nav"
    "content"
    "footer" !important;
}

body[data-layout="top-nav"] .site-nav {
  grid-area: nav !important;
  width: 100% !important;
  order: -1 !important;
  position: relative !important;
  z-index: 100 !important;
  display: flex !important;
  flex-direction: column !important;
}

body[data-layout="top-nav"] .main-content {
  grid-area: content !important;
}

body[data-layout="top-nav"] .site-footer {
  grid-area: footer !important;
}

/* Left Navigation Layout - Enhanced */
body[data-layout="left-nav"] .site-container {
  grid-template-columns: 200px 1fr !important;
  grid-template-rows: 1fr auto !important;
  grid-template-areas:
    "nav content"
    "nav footer" !important;
}

body[data-layout="left-nav"] .site-nav {
  grid-area: nav !important;
}

body[data-layout="left-nav"] .main-content {
  grid-area: content !important;
}

/* Right Navigation Layout - Enhanced */
body[data-layout="right-nav"] .site-container {
  grid-template-columns: 1fr 200px !important;
  grid-template-rows: 1fr auto !important;
  grid-template-areas:
    "content nav"
    "footer nav" !important;
}

body[data-layout="right-nav"] .site-nav {
  grid-area: nav !important;
}

body[data-layout="right-nav"] .main-content {
  grid-area: content !important;
}

/* Theme-specific rules */
body.theme-${state.theme} {
  --primary: ${state.colors.primary || '#6366f1'};
  --secondary: ${state.colors.secondary || '#64748b'};
  --accent: ${state.colors.accent || '#10b981'};
}

/* Mode-specific styling */
body.light-mode, body[data-mode="light"] {
  background-color: var(--light-bg-primary) !important;
  color: var(--light-text-primary) !important;
}

body.dark-mode, body[data-mode="dark"] {
  background-color: var(--dark-bg-primary) !important;
  color: var(--dark-text-primary) !important;
}

/* Enhanced Layout CSS - Ensures proper layout structure */
.site-container {
  display: grid !important;
  min-height: 100vh !important;
  transition: all 0.3s ease !important;
}

/* Enhanced Top Navigation Layout */
body[data-layout="top-nav"] .site-container {
  grid-template-columns: 1fr !important;
  grid-template-rows: auto 1fr auto !important;
  grid-template-areas:
    "nav"
    "content"
    "footer" !important;
}

body[data-layout="top-nav"] .site-nav {
  grid-area: nav !important;
  width: 100% !important;
  order: -1 !important;
}

body[data-layout="top-nav"] .main-content {
  grid-area: content !important;
}

body[data-layout="top-nav"] .site-footer {
  grid-area: footer !important;
}

/* Left Navigation Layout */
body[data-layout="left-nav"] .site-container {
  grid-template-columns: 200px 1fr !important;
  grid-template-rows: 1fr auto !important;
  grid-template-areas:
    "nav content"
    "nav footer" !important;
}

/* Right Navigation Layout */
body[data-layout="right-nav"] .site-container {
  grid-template-columns: 1fr 200px !important;
  grid-template-rows: 1fr auto !important;
  grid-template-areas:
    "content nav"
    "footer nav" !important;
}
    `;
  },

  // Generate initialization script
  generateInitScript(state) {
    return `
// Enhanced initialization script that runs immediately
(function() {
  // Store the original settings from when the site was saved
  const savedSettings = ${JSON.stringify(state)};
  console.log('Website loaded with preserved settings:', savedSettings);
  
  // Function to apply all theme settings and layout
  function applyThemeAndLayout(): any {
    // Set attributes on HTML element
    document.documentElement.setAttribute('data-theme', savedSettings.theme);
    document.documentElement.setAttribute('data-mode', savedSettings.mode);
    
    // Set attributes on BODY element
    document.body.setAttribute('data-theme', savedSettings.theme);
    document.body.setAttribute('data-mode', savedSettings.mode);
    document.body.setAttribute('data-layout', savedSettings.layout || 'top-nav');
    
    // Set proper class names
    let classNames = ['theme-' + savedSettings.theme];
    if (savedSettings.mode === 'dark') {
      classNames.push('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      classNames.push('light-mode');
      document.body.classList.remove('dark-mode');
    }
    
    // Apply all classes
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-') && cls !== 'dark-mode' && cls !== 'light-mode')
      .concat(classNames)
      .join(' ');
    
    // Apply gradient mode if enabled
    if (savedSettings.isGradientMode) {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) heroSection.classList.add('gradient-mode');
    }
    
    // Apply all color variables to :root
    const root = document.documentElement;
    
    // Apply theme color variables
    root.style.setProperty('--primary', savedSettings.colors.primary || '#6366f1');
    root.style.setProperty('--secondary', savedSettings.colors.secondary || '#64748b');
    root.style.setProperty('--accent', savedSettings.colors.accent || '#10b981');
    root.style.setProperty('--primary-light', savedSettings.colors.primaryLight || '#8f91f3');
    root.style.setProperty('--primary-dark', savedSettings.colors.primaryDark || '#4244b8');
    root.style.setProperty('--hover-color', savedSettings.colors.hoverColor || savedSettings.colors.primary || '#6366f1');
    
    // Apply any other colors from the saved state
    Object.entries(savedSettings.colors).forEach(([key, value]): any => {
      if (value && key !== 'hue' && key !== 'saturation' && key !== 'lightness' && key !== 'harmonyAngle') {
        const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(cssVarName, value);
      }
    });
    
    // ENHANCED: Ensure proper layout structure
    ensureProperLayoutStructure();
    
    console.log('✓ Theme and layout settings applied successfully');
  }
  
  // Function to ensure proper layout structure
  function ensureProperLayoutStructure(): any {
    const siteContainer = document.getElementById('site-container');
    const siteNav = document.getElementById('site-nav');
    const mainContent = document.getElementById('main-content');
    const siteFooter = document.getElementById('site-footer');
    
    if (!siteContainer || !siteNav || !mainContent) return;
    
    // Apply proper structure based on layout
    const layout = savedSettings.layout || 'top-nav';
    
    // Ensure site-container has grid display
    siteContainer.style.display = 'grid';
    siteContainer.style.minHeight = '100vh';
    
    // Apply layout-specific styles
    if (layout === 'top-nav') {
      // Top Navigation Layout
      siteContainer.style.gridTemplateColumns = '1fr';
      siteContainer.style.gridTemplateRows = 'auto 1fr auto';
      siteContainer.style.gridTemplateAreas = '"nav" "content" "footer"';
      
      // Ensure navigation is at the top
      siteNav.style.gridArea = 'nav';
      siteNav.style.order = '-1';
      mainContent.style.gridArea = 'content';
      if (siteFooter) siteFooter.style.gridArea = 'footer';
      
      // Ensure navigation is first in DOM order
      if (siteContainer.children[0] !== siteNav) {
        siteContainer.insertBefore(siteNav, siteContainer.firstChild);
      }
    } else if (layout === 'left-nav') {
      // Left Navigation Layout
      siteContainer.style.gridTemplateColumns = '200px 1fr';
      siteContainer.style.gridTemplateRows = '1fr auto';
      siteContainer.style.gridTemplateAreas = '"nav content" "nav footer"';
      
      siteNav.style.gridArea = 'nav';
      mainContent.style.gridArea = 'content';
      if (siteFooter) siteFooter.style.gridArea = 'footer';
    } else if (layout === 'right-nav') {
      // Right Navigation Layout
      siteContainer.style.gridTemplateColumns = '1fr 200px';
      siteContainer.style.gridTemplateRows = '1fr auto';
      siteContainer.style.gridTemplateAreas = '"content nav" "footer nav"';
      
      siteNav.style.gridArea = 'nav';
      mainContent.style.gridArea = 'content';
      if (siteFooter) siteFooter.style.gridArea = 'footer';
    }
    
    console.log('✓ Layout structure enforced for:', layout);
  }

  // Apply settings immediately
  applyThemeAndLayout();
  
  // Also apply settings when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    applyThemeAndLayout();
    console.log('✓ Theme and layout settings re-applied after DOM loaded');
  });
  
  // Additional check after all resources are loaded
  window.addEventListener('load', function() {
    // One final check to ensure navigation is at the top for top-nav layout
    if ((savedSettings.layout || 'top-nav') === 'top-nav') {
      const siteContainer = document.getElementById('site-container');
      const siteNav = document.getElementById('site-nav');
      if (siteContainer && siteNav && siteContainer.children[0] !== siteNav) {
        siteContainer.insertBefore(siteNav, siteContainer.firstChild);
        console.log('✓ Final adjustment: Navigation moved to top position');
      }
    }
  });
})();
    `;
  },

  // Download file
  downloadFile(content, filename) {
    // Create a blob with the HTML content
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create a more user-friendly filename with theme info
    const state = WebsiteState.getState();
    const friendlyName = filename.replace(/website-/, '').split('-').slice(0, 3).join('-');

    // Create or use existing download link
    const link = document.getElementById('download-link') || document.createElement('a');
    link.id = 'download-link';
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    // Add to document if needed
    if (!document.getElementById('download-link')) {
      document.body.appendChild(link);
    }

    // Trigger download
    link.click();

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 1000);

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

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  // Import website
  async importWebsite(file) {
    return new Promise((resolve, reject): any => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const htmlContent = event.target.result;
          const parser = new DOMParser();
          const importedDoc = parser.parseFromString(htmlContent, 'text/html');

          // Extract site container
          const importedSiteContainer = importedDoc.querySelector('#site-container');
          if (!importedSiteContainer) {
            throw new Error('Invalid website file - missing site container');
          }

          // Extract settings
          const importedBody = importedDoc.body;
          const importedTheme = importedBody.getAttribute('data-theme') || 'default';
          const importedLayout = importedBody.getAttribute('data-layout') || 'top-nav';
          const importedMode = importedBody.getAttribute('data-mode') || 'dark';

          // Update current site
          const currentSiteContainer = document.getElementById('site-container');
          if (!currentSiteContainer) {
            throw new Error('Current site container not found');
          }

          // Clear any existing inline styles that might conflict
          currentSiteContainer.removeAttribute('style');
          currentSiteContainer.className = 'site-container';

          // Update content
          currentSiteContainer.innerHTML = importedSiteContainer.innerHTML;

          // Update state first
          WebsiteState.setState({
            theme: importedTheme,
            layout: importedLayout,
            mode: importedMode
          });

          // Force immediate body attribute update to ensure CSS applies correctly
          document.body.setAttribute('data-theme', importedTheme);
          document.body.setAttribute('data-layout', importedLayout);
          document.body.setAttribute('data-mode', importedMode);

          // Force layout reapplication with multiple steps for reliability
          // Step 1: Immediate layout application
          LayoutManager.applyLayout(importedLayout);

          // Step 2: Force navigation to top position if using top-nav layout
          if (importedLayout === 'top-nav') {
            this.ensureNavigationAtTop();
          }

          // Step 3: Final layout reapplication after DOM is settled
          setTimeout((): any => {
            LayoutManager.applyLayout(importedLayout);
            if (importedLayout === 'top-nav') {
              this.ensureNavigationAtTop();
            }
            console.log(`Import completed: Layout "${importedLayout}" forcefully reapplied with navigation positioning`);
          }, 150);

          UIController.showStatusMessage('Website imported successfully!', 3000);
          resolve({ theme: importedTheme, layout: importedLayout, mode: importedMode });

        } catch (error) {
          UIController.showStatusMessage('Error importing website: ' + error.message, 5000);
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Helper method to ensure navigation appears at the top after import
  ensureNavigationAtTop() {
    const siteContainer = document.getElementById('site-container');
    const siteNav = document.getElementById('site-nav');

    if (siteContainer && siteNav) {
      // Ensure the navigation is the first child in the container
      if (siteContainer.children[0] !== siteNav) {
        // Move navigation to the top
        siteContainer.insertBefore(siteNav, siteContainer.firstChild);
        console.log('✓ Navigation repositioned to top during import');
      }

      // Force the CSS classes and attributes
      siteContainer.classList.add('has-top-nav');

      // Apply specific styles to ensure proper layout
      siteContainer.style.display = 'grid';
      siteContainer.style.gridTemplateColumns = '1fr';
      siteContainer.style.gridTemplateRows = 'auto 1fr auto';
      siteContainer.style.gridTemplateAreas = '"nav" "content" "footer"';

      siteNav.style.gridArea = 'nav';
      siteNav.style.order = '-1';
      siteNav.style.position = 'relative';
      siteNav.style.zIndex = '100';
      siteNav.style.display = 'flex';
      siteNav.style.flexDirection = 'column';
      siteNav.style.width = '100%';

      console.log('✓ Navigation layout forcefully applied during import');
    }
  }
};

export default SaveLoadManager;
