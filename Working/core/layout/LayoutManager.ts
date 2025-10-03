// @ts-nocheck
// LayoutManager.js - Navigation layouts
// =============================================================================
// LAYOUT MANAGEMENT MODULE - Navigation layouts
// =============================================================================
const LayoutManager = {
  // Apply layout to document
  applyLayout(layout) {
    // Default to top-nav if not specified
    const layoutToApply = layout || 'top-nav';

    // Apply layout to body element
    document.body.setAttribute('data-layout', layoutToApply);

    // Ensure top-nav layout is correctly applied when it's the default
    if (layoutToApply === 'top-nav') {
      this.ensureTopNavLayout();
    }

    console.log(`Layout applied: ${layoutToApply}`);
  },

  // Ensure top navigation layout is properly applied
  ensureTopNavLayout() {
    const siteContainer = document.getElementById('site-container');
    const siteNav = document.getElementById('site-nav');
    const mainContent = document.getElementById('main-content');
    const siteFooter = document.getElementById('site-footer');

    if (siteContainer && siteNav && mainContent) {
      // Force the correct grid layout
      siteContainer.style.display = 'grid';
      siteContainer.style.gridTemplateColumns = '1fr';
      siteContainer.style.gridTemplateRows = 'auto 1fr auto';
      siteContainer.style.gridTemplateAreas = '"nav" "content" "footer"';

      // Apply explicit positioning for the navigation
      siteNav.style.gridArea = 'nav';
      siteNav.style.order = '-1';
      siteNav.style.position = 'relative';
      siteNav.style.zIndex = '100';
      mainContent.style.gridArea = 'content';
      if (siteFooter) siteFooter.style.gridArea = 'footer';

      // Add a class specifically for top navigation
      siteContainer.classList.add('has-top-nav');

      // Ensure navigation is displayed before main content
      if (siteContainer.children[0] !== siteNav) {
        siteContainer.insertBefore(siteNav, siteContainer.firstChild);
        console.log('✓ Navigation positioned at the top of the container');
      }

      // Also add flex layout inside navigation for better control
      siteNav.style.display = 'flex';
      siteNav.style.flexDirection = 'column';
      siteNav.style.width = '100%';
    }
  },

  // Get available layouts
  getLayouts() {
    return ['top-nav', 'left-nav', 'right-nav'];
  }
};

export default LayoutManager;
