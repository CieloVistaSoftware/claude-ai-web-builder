// @ts-nocheck
/**
 * Site Converter Tool
 * 
 * This tool converts external website formats to a format compatible with the Website Builder.
 * It serves as a preparatory conversion layer rather than modifying the core website builder logic.
 */

// Main conversion function
function convertExternalSite(htmlContent): any {
  return new Promise((resolve, reject): any => {
    try {
      console.log('Starting site conversion process...');

      // Create a DOM parser to work with the HTML
      const parser = new DOMParser();
      const externalDoc = parser.parseFromString(htmlContent, 'text/html');

      // Initialize the converted site structure that matches our builder's expectations
      const convertedSite = {
        layout: detectLayout(externalDoc),
        theme: detectTheme(externalDoc),
        sections: extractSections(externalDoc),
        styles: extractStyles(externalDoc),
        media: extractMedia(externalDoc),
        options: {
          spaMode: false, // Default: not SPA
          customStyles: extractCustomStyles(externalDoc)
        }
      };

      console.log('Site conversion completed successfully');
      resolve(convertedSite);
    } catch (error) {
      console.error('Error converting site:', error);
      reject(error);
    }
  });
}

// Detect the layout from the external site
function detectLayout(doc): any {
  const body = doc.body;
  const hasNavigation = !!doc.querySelector('nav');
  const hasHero = !!doc.querySelector('header.hero, .hero, section.hero');
  // Check for single-column layout
  const mainContent = doc.querySelector('main, .main-content, #main-content');
  // Can't use getComputedStyle on parsed doc, check for layout attributes/classes instead
  const isSingleColumn = !hasNavigation ||
    doc.body.classList.contains('single-column') ||
    doc.body.classList.contains('one-column') ||
    (mainContent && mainContent.getAttribute('style')?.includes('width: 100%'));

  console.log('Layout detection:', { hasNavigation, hasHero, isSingleColumn });

  if (isSingleColumn) {
    return 'single-column';
  } else if (hasHero) {
    return 'modern';
  } else {
    return 'classic'; // Default to classic layout
  }
}

// Detect theme by analyzing colors
function detectTheme(doc): any {
  // We can't directly use getComputedStyle on parsed document that's not in the DOM
  // Instead, check for theme classes and inline styles

  // Check for theme class on body
  const bodyClasses = doc.body.classList;
  if (bodyClasses.contains('theme-indigo')) return 'indigo';
  if (bodyClasses.contains('theme-blue')) return 'blue';
  if (bodyClasses.contains('theme-emerald')) return 'emerald';
  if (bodyClasses.contains('theme-amber')) return 'amber';
  if (bodyClasses.contains('theme-red')) return 'red';
  if (bodyClasses.contains('theme-purple')) return 'purple';
  if (bodyClasses.contains('theme-pink')) return 'pink';
  if (bodyClasses.contains('theme-dark')) return 'dark';

  // Try to extract color info from inline styles or style tags
  let primaryColor = null;

  // Look for CSS variables in style tags
  const styleTags = doc.querySelectorAll('style');
  for (const styleTag of styleTags) {
    const cssText = styleTag.textContent;
    const primaryMatch = cssText.match(/--primary:\s*(#[0-9a-f]{3,6}|rgb\([^)]+\))/i);
    if (primaryMatch && primaryMatch[1]) {
      primaryColor = primaryMatch[1];
      break;
    }
  }

  // If not found, try data attributes
  if (!primaryColor) {
    const themeAttr = doc.documentElement.getAttribute('data-theme') ||
      doc.body.getAttribute('data-theme');
    if (themeAttr) {
      return themeAttr; // Return the theme name if specified
    }
  }
  // Try to infer from inline styles and style attributes
  if (!primaryColor) {
    // Look at common theme-bearing elements with style attributes
    const buttons = doc.querySelectorAll('button[style], .btn[style], .button[style]');
    const headings = doc.querySelectorAll('h1[style], h2[style], h3[style]');
    const links = doc.querySelectorAll('a[style]');

    // Color frequency map
    const colorFrequency: any = {};

    // Extract colors from style attributes (background-color or color)
    const extractColorFromStyle = (element) => {
      const style = element.getAttribute('style');
      if (!style) return null;

      // Try to find background-color or color in the style attribute
      const bgColorMatch = style.match(/background-color:\s*(#[0-9a-f]{3,6}|rgb\([^)]+\))/i);
      const colorMatch = style.match(/color:\s*(#[0-9a-f]{3,6}|rgb\([^)]+\))/i);

      return bgColorMatch ? bgColorMatch[1] : (colorMatch ? colorMatch[1] : null);
    };

    // Extract colors from buttons
    buttons.forEach(btn => {
      const btnColor = extractColorFromStyle(btn);
      if (btnColor) {
        colorFrequency[btnColor] = (colorFrequency[btnColor] || 0) + 3; // Weighted higher
      }
    });

    // Extract colors from headings
    headings.forEach(heading => {
      const headingColor = extractColorFromStyle(heading);
      if (headingColor) {
        colorFrequency[headingColor] = (colorFrequency[headingColor] || 0) + 2;
      }
    });

    // Extract colors from links
    links.forEach(link => {
      const linkColor = extractColorFromStyle(link);
      if (linkColor) {
        colorFrequency[linkColor] = (colorFrequency[linkColor] || 0) + 1;
      }
    });
    // Find most frequent color
    let maxFreq = 0;
    Object.keys(colorFrequency).forEach(color => {
      if (colorFrequency[color] > maxFreq) {
        maxFreq = colorFrequency[color];
        primaryColor = color;
      }
    });
  }

  // Convert to hex for consistency (or use default value)
  primaryColor = primaryColor ? rgbToHex(primaryColor) : '#6366f1';

  // Try to determine if the site uses a dark theme
  const isDarkTheme = doc.body.classList.contains('dark-mode') ||
    doc.body.classList.contains('dark-theme') ||
    doc.documentElement.classList.contains('dark-mode');

  console.log('Theme detection:', { primaryColor, isDarkTheme });
  // Map to our theme options
  try {
    // First check if the primary color is close to one of our theme colors
    if (isCloseTo(primaryColor, '#6366F1')) {
      return 'indigo';
    } else if (isCloseTo(primaryColor, '#3B82F6')) {
      return 'blue';
    } else if (isCloseTo(primaryColor, '#10B981')) {
      return 'emerald';
    } else if (isCloseTo(primaryColor, '#F59E0B')) {
      return 'amber';
    } else if (isCloseTo(primaryColor, '#EF4444')) {
      return 'red';
    } else if (isCloseTo(primaryColor, '#8B5CF6')) {
      return 'purple';
    } else if (isCloseTo(primaryColor, '#EC4899')) {
      return 'pink';
    }

    // If we detected a dark theme, use dark theme
    if (isDarkTheme) {
      return 'dark';
    }

    // Default theme as fallback
    return 'indigo';
  } catch (error) {
    console.error('Error in theme detection, using default:', error);
    return 'indigo';
  }
}

// Extract sections from the document
function extractSections(doc): any {
  const sections: any[] = [];

  // Get all section elements
  const sectionElements = doc.querySelectorAll('section, .section, [data-section]');

  if (sectionElements.length > 0) {
    // Process explicit sections
    sectionElements.forEach((section, index): any => {
      sections.push(processSection(section, index));
    });
  } else {
    // If no explicit sections, try to identify logical sections
    const main = doc.querySelector('main') || doc.body;
    const children = main.children;

    // Group elements into logical sections
    let currentSection = null;
    let sectionIndex = 0;

    for (let i = 0; i < children.length; i++) {
      const element = children[i];      // Start a new section for headings or significant block elements
      if (element.tagName.match(/^H[1-3]$/) ||
        element.tagName === 'DIV' && element.classList.length > 0) {

        if (currentSection) {
          sections.push(processSection(currentSection, sectionIndex++));
        }

        currentSection = doc.createElement('div');
        currentSection.id = `auto-section-${sectionIndex}`;
        currentSection.appendChild(element.cloneNode(true));
      }
      // Add to current section
      else if (currentSection) {
        currentSection.appendChild(element.cloneNode(true));
      }      // Start a section if we don't have one yet
      else {
        currentSection = doc.createElement('div');
        currentSection.id = `auto-section-${sectionIndex}`;
        currentSection.appendChild(element.cloneNode(true));
      }
    }

    // Add the last section if it exists
    if (currentSection) {
      sections.push(processSection(currentSection, sectionIndex));
    }
  }

  console.log(`Extracted ${sections.length} sections`);
  return sections;
}

// Process a section element into our expected format
function processSection(section, index): any {
  try {
    const id = section.id || `section-${index}`;
    const titleElement = section.querySelector('h1, h2, h3, h4');
    const title = titleElement?.textContent || `Section ${index + 1}`;

    // Determine section type
    let type = 'content';

    // Check section's class list and content to determine type
    if (section.classList.contains('hero') ||
      section.tagName === 'HEADER' ||
      id.toLowerCase().includes('hero') ||
      (titleElement && titleElement.textContent.toLowerCase().includes('welcome'))) {
      type = 'hero';
    } else if (section.classList.contains('features') ||
      section.classList.contains('services') ||
      section.querySelectorAll('.card, .feature, .service').length > 0 ||
      id.toLowerCase().includes('feature') ||
      id.toLowerCase().includes('service')) {
      type = 'features';
    } else if (section.querySelector('form') ||
      id.toLowerCase().includes('contact') ||
      (titleElement && titleElement.textContent.toLowerCase().includes('contact'))) {
      type = 'contact';
    } else if (section.querySelectorAll('img, .gallery-item, .portfolio-item').length > 1 ||
      id.toLowerCase().includes('gallery') ||
      id.toLowerCase().includes('portfolio')) {
      type = 'gallery';
    }

    // Convert any media in this section
    const mediaElements = section.querySelectorAll('img, video');
    const media: any[] = [];

    mediaElements.forEach((el, mediaIndex): any => {
      if (el.tagName === 'IMG') {
        media.push({
          id: `${id}-media-${mediaIndex}`,
          src: el.src,
          alt: el.alt || title,
          type: 'image'
        });
      } else if (el.tagName === 'VIDEO') {
        media.push({
          id: `${id}-media-${mediaIndex}`,
          src: el.src || el.querySelector('source')?.src,
          type: 'video'
        });
      } else if (el.hasAttribute('style') && el.getAttribute('style').includes('background-image')) {
        const styleAttr = el.getAttribute('style');
        const bgUrlMatch = styleAttr.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
        if (bgUrlMatch && bgUrlMatch[1]) {
          media.push({
            id: `${id}-media-${mediaIndex}`,
            src: bgUrlMatch[1],
            type: 'image'
          });
        }
      }
    });
    return {
      id,
      type,
      title,
      content: section.innerHTML,
      visible: true,
      media
    };
  } catch (error) {
    console.error('Error processing section:', error);
    // Return a basic section as fallback
    return {
      id: `section-${index}`,
      type: 'content',
      title: `Section ${index + 1}`,
      content: section.innerHTML || '<div class="error-message">Error processing content</div>',
      visible: true,
      media: []
    };
  }
}

// Extract styles from the document
function extractStyles(doc): any {
  let styles = '';

  // Extract from style tags
  const styleTags = doc.querySelectorAll('style');
  styleTags.forEach(styleTag => {
    styles += styleTag.textContent + '\n';
  });

  // Extract from link tags (stylesheets)
  const linkTags = doc.querySelectorAll('link[rel="stylesheet"]');
  linkTags.forEach(linkTag => {
    // Note: We can't directly access external stylesheets due to CORS
    // This would require a server-side component in a real implementation
    console.log('External stylesheet detected:', linkTag.href);
  });

  return styles;
}

// Extract all media elements
function extractMedia(doc): any {
  try {
    const media: any[] = [];
    // We need to target elements with style attribute containing background-image
    const mediaElements = doc.querySelectorAll('img, video');
    const bgElements = doc.querySelectorAll('[style]');

    // Process images and videos
    mediaElements.forEach((el, index): any => {
      if (el.tagName === 'IMG') {
        media.push({
          id: `media-${index}`,
          src: el.src,
          alt: el.alt || '',
          type: 'image'
        });
      } else if (el.tagName === 'VIDEO') {
        media.push({
          id: `media-${index}`,
          src: el.src || el.querySelector('source')?.src,
          type: 'video'
        });
      }
    });
    // Process elements with background images in style attributes
    bgElements.forEach((el, index): any => {
      const styleAttr = el.getAttribute('style');
      if (styleAttr && styleAttr.includes('background-image')) {
        const bgUrlMatch = styleAttr.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
        if (bgUrlMatch && bgUrlMatch[1]) {
          media.push({
            id: `bg-media-${index}`,
            src: bgUrlMatch[1],
            type: 'image'
          });
        }
      }
    });
    return media;
  } catch (error) {
    console.error('Error extracting media:', error);
    return [];
  }
}

// Extract any custom styles
function extractCustomStyles(doc): any {
  // Look for inline styles on body or main container
  const bodyStyles = doc.body.getAttribute('style') || '';
  const mainStyles = doc.querySelector('main')?.getAttribute('style') || '';

  // Check for a custom style section
  const customStyleTag = doc.querySelector('style[data-custom="true"], style.custom-styles');
  const customStyles = customStyleTag ? customStyleTag.textContent : '';

  // Combine styles
  return `
/* Extracted custom styles */
${bodyStyles ? `body { ${bodyStyles} }` : ''}
${mainStyles ? `main { ${mainStyles} }` : ''}
${customStyles}
`;
}

// Color utility functions
function rgbToHex(rgb): any {
  try {
    // Handle null or undefined input
    if (!rgb) {
      return '#6366f1'; // Default indigo color
    }

    // Check if already hex
    if (typeof rgb === 'string' && rgb.startsWith('#')) {
      return rgb;
    }

    // Parse RGB format
    if (typeof rgb === 'string') {
      const rgbMatch = rgb.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/i);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      }
    }

    // Default if can't parse
    return '#6366f1';
  } catch (error) {
    console.error('Error parsing color:', error, { rgb });
    return '#6366f1'; // Default if error
  }
}

// Check if a color is dark
function isColorDark(color): any {
  try {
    // Handle null or missing input
    if (!color) return false;

    // Convert to hex for consistency
    const hex = rgbToHex(color);

    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true if color is dark (luminance less than 0.5)
    return luminance < 0.5;
  } catch (error) {
    console.error('Error in isColorDark:', error);
    return false; // Default to light
  }
}

// Check if two colors are similar
function isCloseTo(color1, color2, tolerance = 30): any {
  try {
    // Handle null inputs
    if (!color1 || !color2) return false;

    // Convert to hex
    color1 = rgbToHex(color1);
    color2 = rgbToHex(color2);

    // Extract RGB components
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    // Calculate Euclidean distance
    const distance = Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2)
    );

    return distance <= tolerance;
  } catch (error) {
    console.error('Error in isCloseTo:', error);
    return false; // Default to not similar
  }
}

// Apply the converted site to the website builder
function applySiteToBuilder(convertedSite): any {
  return new Promise((resolve, reject): any => {
    try {
      console.log('Applying converted site to website builder...');

      // Make sure the control panel is initialized and visible
      // Use setTimeout to ensure the control panel is fully loaded before we try to show it
      setTimeout((): any => {
        const controlPanel = document.getElementById('control-panel');
        if (controlPanel) {
          // Ensure the control panel is visible
          controlPanel.style.display = 'block';
          // If it was minimized, un-minimize it
          controlPanel.classList.remove('minimized');
          // Make sure the visibility property is also set
          controlPanel.style.visibility = 'visible';
          console.log('Ensured control panel is visible');
        } else {
          console.warn('Control panel element not found');
        }
      }, 500); // Short delay to ensure DOM is ready

      // Set layout
      if (window.layoutSelect) {
        window.layoutSelect.value = convertedSite.layout;
        const event = new Event('change');
        window.layoutSelect.dispatchEvent(event);
      }

      // Set theme
      if (window.themeSelect) {
        window.themeSelect.value = convertedSite.theme;
        const event = new Event('change');
        window.themeSelect.dispatchEvent(event);
      }
      
      // Ensure navigation remains sticky after import
      const nav = document.querySelector('.site-nav');
      if (nav) {
        nav.style.position = 'sticky';
        nav.style.top = '0';
        nav.style.zIndex = '1000';
        
        // For side navigation layouts
        if (document.body.dataset.layout === 'left-nav' || document.body.dataset.layout === 'right-nav') {
          nav.style.height = '100vh';
        }
      }

      // Process sections
      convertedSite.sections.forEach(section => {
        importSection(section);
      });

      // Apply custom styles
      if (window.websiteOptions && convertedSite.options.customStyles) {
        // Add navigation sticky styling to custom styles
        const navStyles = `
/* Ensure navigation is sticky */
.site-nav {
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
}

body[data-layout="left-nav"] .site-nav,
body[data-layout="right-nav"] .site-nav {
  height: 100vh !important;
}
`;
        window.websiteOptions.customStyles = navStyles + convertedSite.options.customStyles;
      }

      // Save state
      if (window.saveState) {
        window.saveState();
      }

      console.log('Site successfully applied to builder');
      resolve(true);
    } catch (error) {
      console.error('Error applying site to builder:', error);
      reject(error);
    }
  });
}

// Import a section into the builder
function importSection(section): any {
  // Look for the main content container
  const mainContent = document.getElementById('main-content');
  if (!mainContent) {
    console.error('No main content container found');
    return;
  }

  // Create a new section element
  const sectionEl = document.createElement('section');
  sectionEl.id = section.id;
  sectionEl.className = 'imported-section';
  sectionEl.innerHTML = section.content;

  // Make sure we have the section-toggle-control
  const toggleControl = document.createElement('div');
  toggleControl.className = 'section-toggle-control';
  toggleControl.innerHTML = `
        <button class="section-toggle" data-for="${section.id}">
            ${section.visible ? '👁️' : '👁️‍🗨️'} ${section.title}
        </button>
    `;
  sectionEl.prepend(toggleControl);

  // Make elements editable
  sectionEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, a').forEach(el => {
    el.classList.add('editable');
    el.setAttribute('contenteditable', 'false'); // Will be enabled by edit mode logic
  });

  // Add media placeholders where images were
  sectionEl.querySelectorAll('img').forEach((img, index): any => {
    const placeholder = document.createElement('div');
    placeholder.className = 'media-placeholder has-media';
    placeholder.style.backgroundImage = `url('${img.src}')`;
    placeholder.style.width = '100%';
    placeholder.style.height = '200px';
    placeholder.style.backgroundSize = 'cover';
    placeholder.style.backgroundPosition = 'center';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';

    img.parentNode.replaceChild(placeholder, img);
  });

  // Add to main content
  mainContent.appendChild(sectionEl);

  // Initialize section toggle
  if (window.initSectionToggle) {
    window.initSectionToggle(section.id);
  }

  console.log(`Imported section: ${section.id} (${section.title})`);
}

// Main entry point for importing HTML
async function importSiteHTML(file): any {
  try {
    // Show import modal
    const modal = document.createElement('div');
    modal.className = 'save-modal';
    modal.innerHTML = `
            <div class="save-modal-content">
                <h3>Converting Site</h3>
                <p id="import-status">Reading file...</p>
                <div class="progress-bar">
                    <div class="progress-fill" id="import-progress" style="width: 0%"></div>
                </div>
            </div>
        `;
    document.body.appendChild(modal);

    // Read file content
    const importStatus = document.getElementById('import-status');
    const importProgress = document.getElementById('import-progress');

    importStatus.textContent = 'Reading HTML file...';
    importProgress.style.width = '20%';

    const reader = new FileReader();

    reader.onload = async(e): any => {
      const htmlContent = e.target.result;
      importStatus.textContent = 'Analyzing site structure...';
      importProgress.style.width = '40%';

      // Convert the site
      const convertedSite = await convertExternalSite(htmlContent);
      importStatus.textContent = 'Converting site elements...';
      importProgress.style.width = '60%';

      // Apply the converted site to the builder
      importStatus.textContent = 'Applying to website builder...';
      importProgress.style.width = '80%';
      await applySiteToBuilder(convertedSite);

      // Complete
      importStatus.textContent = 'Import complete!';
      importProgress.style.width = '100%';

      // Remove modal after a delay
      setTimeout((): any => {
        modal.remove();

        // Show success message
        if (window.updateStatus) {
          window.updateStatus('Website imported successfully!', 'success');
        }
      }, 1500);
    };

    reader.onerror = () => {
      importStatus.textContent = 'Error reading file';
      importProgress.style.width = '100%';
      importProgress.style.backgroundColor = '#f44336';

      // Remove modal after a delay
      setTimeout((): any => {
        modal.remove();

        // Show error message
        if (window.updateStatus) {
          window.updateStatus('Error importing website', 'error');
        }
      }, 1500);
    };

    // Read the file
    reader.readAsText(file);

  } catch (error) {
    console.error('Error importing site:', error);

    // Show error message
    if (window.updateStatus) {
      window.updateStatus('Error importing website: ' + error.message, 'error');
    }

    // Remove modal if exists
    document.querySelector('.save-modal')?.remove();
  }
}

// Export functions
window.siteConverter = {
  importSiteHTML,
  convertExternalSite,
  applySiteToBuilder
};
