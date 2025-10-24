export {};
// @ts-nocheck
// Test for top navigation position
document.addEventListener('DOMContentLoaded', function() {
  console.log('Testing top navigation position...');
  
  // Check initial layout
  const body = document.body;
  const currentLayout = body.getAttribute('data-layout') || 'top-nav';
  console.log(`Current layout: ${currentLayout}`);
  
  // Get elements
  const siteContainer = document.getElementById('site-container');
  const siteNav = document.getElementById('site-nav');
  const mainContent = document.getElementById('main-content');
  
  // Log DOM structure
  console.log('Site container structure:');
  if (siteContainer) {
    const children = Array.from(siteContainer.children);
    children.forEach((child, index): any => {
      console.log(`Child ${index}: ${child.id || child.tagName} (${child.className})`);
    });
  }
  
  // Check if nav is first child
  if (siteContainer && siteNav) {
    const isNavFirst = siteContainer.children[0] === siteNav;
    console.log(`Navigation is first child: ${isNavFirst}`);
  }
  
  // Check computed styles
  if (siteNav && window.getComputedStyle) {
    const navStyles = window.getComputedStyle(siteNav);
    console.log('Navigation styles:');
    console.log(`- gridArea: ${navStyles.gridArea}`);
    console.log(`- order: ${navStyles.order}`);
    console.log(`- position: ${navStyles.position}`);
    console.log(`- zIndex: ${navStyles.zIndex}`);
  }
  
  // Apply layout again to test positioning
  if (window.LayoutManager) {
    console.log('Applying layout again via LayoutManager...');
    window.LayoutManager.applyLayout('top-nav');
    
    // Check if nav is first child after applying layout
    setTimeout((): any => {
      if (siteContainer && siteNav) {
        const isNavFirst = siteContainer.children[0] === siteNav;
        console.log(`Navigation is first child after layout re-applied: ${isNavFirst}`);
      }
    }, 100);
  }
});
