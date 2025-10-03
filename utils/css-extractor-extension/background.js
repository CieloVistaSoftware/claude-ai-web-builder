// Background service worker for CSS Extractor Pro
console.log('CSS Extractor Pro background service worker started');

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received:', request.action);
  
  switch (request.action) {
    case 'fetchCSS':
      // Fetch external CSS files (helps with CORS)
      fetchExternalCSS(request.url)
        .then(content => sendResponse({ success: true, content }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep channel open for async response
    
    case 'downloadFiles':
      // Handle file downloads
      handleDownloads(request.files)
        .then(results => sendResponse({ success: true, results }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Fetch external CSS files
async function fetchExternalCSS(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }
}

// Handle file downloads
async function handleDownloads(files) {
  const results = [];
  
  for (const file of files) {
    try {
      const blob = new Blob([file.content], { type: file.type });
      const url = URL.createObjectURL(blob);
      
      const downloadId = await chrome.downloads.download({
        url: url,
        filename: file.filename,
        saveAs: false
      });
      
      results.push({
        filename: file.filename,
        success: true,
        downloadId
      });
      
      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      results.push({
        filename: file.filename,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    // Inject content script if not already injected
    chrome.tabs.sendMessage(tabId, { action: 'ping' }, response => {
      if (chrome.runtime.lastError) {
        // Content script not injected, inject it now
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
      }
    });
  }
});

// Handle extension icon click (optional - can open popup or perform action)
chrome.action.onClicked.addListener((tab) => {
  // This won't fire if you have a default_popup set in manifest
  // You can use it for badge updates or other background tasks
  console.log('Extension icon clicked for tab:', tab.id);
});

console.log('Background service worker ready');