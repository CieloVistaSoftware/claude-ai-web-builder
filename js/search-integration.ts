/**
 * @file search-integration.ts
 * @description Example integration code for the search plugin
 */

// Import the search plugin
import SiteSearch from '../plugins/search/site-search.js';

/**
 * Initialize the search plugin with site content
 * This function can be called when the site content is loaded
 * @param {object} siteContent - The site content from site-content.json
 */
export function initializeSearch(siteContent: any): void {
  // Check if search is enabled in the site content
  if (siteContent?.plugins?.search?.enabled) {
    // Create search instance with config from site content
    const search = new SiteSearch(siteContent.plugins.search);
    
    // Initialize the search plugin
    search.initialize();
    
    console.log('Search plugin initialized successfully');
  }
}

/**
 * Add search button to the navigation menu
 * This function should be called after the navigation is rendered
 * @param {HTMLElement} navigationElement - The navigation element
 * @param {object} searchConfig - The search configuration from site-content.json
 */
export function addSearchToNavigation(navigationElement: HTMLElement, searchConfig: any): void {
  // Check if navigation exists and search is enabled
  if (!navigationElement || !searchConfig?.enabled) return;
  
  // Create search button
  const searchButton = document.createElement('button');
  searchButton.className = 'search-button';
  searchButton.setAttribute('data-action', 'open-search');
  
  // Add icon and text
  const buttonIcon = searchConfig.buttonIcon || '🔍';
  const buttonText = searchConfig.buttonText || 'Search';
  
  searchButton.innerHTML = `
    <span class="search-button-icon">${buttonIcon}</span>
    <span class="search-button-text">${buttonText}</span>
  `;
  
  // Add search button to navigation
  const navList = navigationElement.querySelector('ul') || navigationElement;
  
  // Create list item for the button if needed
  if (navigationElement.tagName === 'UL' || navList.tagName === 'UL') {
    const listItem = document.createElement('li');
    listItem.className = 'nav-item search-nav-item';
    listItem.appendChild(searchButton);
    navList.appendChild(listItem);
  } else {
    // Just append the button directly
    navigationElement.appendChild(searchButton);
  }
  
  console.log('Search button added to navigation');
}

/**
 * Create a floating search button
 * This can be used if you want a search button independent of the navigation
 * @param {object} searchConfig - The search configuration from site-content.json
 */
export function addFloatingSearchButton(searchConfig: any): void {
  if (!searchConfig?.enabled) return;
  
  // Create floating search button
  const floatingButton = document.createElement('button');
  floatingButton.className = 'floating-search-button';
  floatingButton.setAttribute('data-action', 'open-search');
  floatingButton.innerHTML = searchConfig.buttonIcon || '🔍';
  
  // Add button to the body
  document.body.appendChild(floatingButton);
  
  console.log('Floating search button added');
}

// Example usage:
/*
document.addEventListener('DOMContentLoaded', (): any => {
  // Assuming site content is loaded and available
  if (window.siteContent) {
    // Initialize search
    initializeSearch(window.siteContent);
    
    // Add search to navigation (if needed)
    const navElement = document.querySelector('nav');
    if (navElement) {
      addSearchToNavigation(navElement, window.siteContent.plugins.search);
    }
    
    // Or add a floating button
    if (window.siteContent.plugins.search?.placement === 'floating') {
      addFloatingSearchButton(window.siteContent.plugins.search);
    }
  }
});
*/
