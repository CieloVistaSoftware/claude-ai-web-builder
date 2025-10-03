class PopupController {
  constructor() {
    this.currentTab = null;
    this.extractedData = null;
    this.initialize();
  }

  async initialize() {
    console.log('Popup initializing...');
    
    this.elements = {
      siteTitle: document.getElementById('site-title'),
      siteUrl: document.getElementById('site-url'),
      varCount: document.getElementById('var-count'),
      styleCount: document.getElementById('style-count'),
      colorCount: document.getElementById('color-count'),
      extractBtn: document.getElementById('extract-btn'),
      scanBtn: document.getElementById('scan-btn'),
      status: document.getElementById('status'),
      loading: document.getElementById('loading'),
      progress: document.getElementById('progress'),
      exportCSS: document.getElementById('export-css'),
      exportJSON: document.getElementById('export-json'),
      exportColors: document.getElementById('export-colors')
    };

    this.setupEventListeners();
    await this.loadTabInfo();
    await this.quickScan();
  }

  setupEventListeners() {
    this.elements.extractBtn.addEventListener('click', () => this.extractAndDownload());
    this.elements.scanBtn.addEventListener('click', () => this.quickScan());
  }

  async loadTabInfo() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        this.currentTab = tab;
        this.elements.siteTitle.textContent = tab.title || 'Current Page';
        this.elements.siteUrl.textContent = tab.url || 'Unknown URL';
        
        // Try to get more accurate info from the page
        try {
          const results = await chrome.tabs.sendMessage(tab.id, { action: 'getPageInfo' });
          if (results) {
            this.elements.siteTitle.textContent = results.title || tab.title;
            this.elements.siteUrl.textContent = results.url || tab.url;
          }
        } catch (e) {
          console.log('Using tab info as fallback');
        }
      }
    } catch (error) {
      console.error('Error loading tab info:', error);
      this.showStatus('Error loading page info', 'error');
    }
  }

  async quickScan() {
    if (!this.currentTab) {
      this.showStatus('No active tab found', 'error');
      return;
    }

    const url = this.currentTab.url;
    if (!url || !url.startsWith('http')) {
      this.showStatus('Please navigate to a website', 'error');
      this.setStats(0, 0, 0);
      return;
    }

    this.showLoading(true, 'Scanning page...');

    try {
      // Send message to content script
      const response = await chrome.tabs.sendMessage(this.currentTab.id, { 
        action: 'quickScan' 
      });
      
      if (response && response.success) {
        this.setStats(
          response.data.variableCount || 0,
          response.data.styleCount || 0,
          response.data.colorCount || 0
        );
        this.showStatus(`Found ${response.data.variableCount} variables, ${response.data.styleCount} styles`, 'success');
      } else {
        throw new Error('Scan failed');
      }
    } catch (error) {
      console.error('Scan error:', error);
      this.showStatus('Unable to scan this page', 'error');
      this.setStats(0, 0, 0);
    } finally {
      this.showLoading(false);
    }
  }

  async extractAndDownload() {
    if (!this.currentTab) {
      this.showStatus('No active tab found', 'error');
      return;
    }

    this.showLoading(true, 'Extracting all CSS...');
    this.updateProgress(0);

    try {
      // Send extraction request to content script
      const response = await chrome.tabs.sendMessage(this.currentTab.id, { 
        action: 'extractAll',
        options: {
          includeVariables: true,
          includeStyles: true,
          includeColors: true,
          includeMedia: true,
          includeKeyframes: true,
          includeFonts: true
        }
      });

      this.updateProgress(50);
      
      if (response && response.success && response.data) {
        this.extractedData = response.data;
        this.updateProgress(75);
        
        // Update stats
        this.setStats(
          response.data.summary.totalVariables || 0,
          response.data.summary.totalStyles || 0,
          response.data.summary.colorCount || 0
        );
        
        // Download selected formats
        await this.downloadFiles();
        this.updateProgress(100);
        
        this.showStatus('Files downloaded successfully!', 'success');
        
        // Close popup after successful download
        setTimeout(() => window.close(), 2000);
      } else {
        throw new Error('No data extracted');
      }
    } catch (error) {
      console.error('Extraction error:', error);
      this.showStatus('Extraction failed: ' + error.message, 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async downloadFiles() {
    if (!this.extractedData) return;

    const downloads = [];

    // Download CSS file
    if (this.elements.exportCSS.checked && this.extractedData.css) {
      downloads.push(this.download(
        this.extractedData.css.content,
        this.extractedData.css.filename,
        'text/css'
      ));
    }

    // Download JSON file
    if (this.elements.exportJSON.checked && this.extractedData.json) {
      downloads.push(this.download(
        this.extractedData.json.content,
        this.extractedData.json.filename,
        'application/json'
      ));
    }

    // Download colors file
    if (this.elements.exportColors.checked && this.extractedData.colors) {
      downloads.push(this.download(
        this.extractedData.colors.content,
        this.extractedData.colors.filename,
        'text/css'
      ));
    }

    await Promise.all(downloads);
  }

  async download(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    
    try {
      await chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: false
      });
    } catch (error) {
      // Fallback for direct download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  setStats(variables, styles, colors) {
    this.elements.varCount.textContent = this.formatNumber(variables);
    this.elements.styleCount.textContent = this.formatNumber(styles);
    this.elements.colorCount.textContent = this.formatNumber(colors);
  }

  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  showLoading(show, message = 'Loading...') {
    if (show) {
      this.elements.loading.classList.add('active');
      this.elements.loading.querySelector('p').textContent = message;
      this.elements.extractBtn.disabled = true;
      this.elements.scanBtn.disabled = true;
    } else {
      this.elements.loading.classList.remove('active');
      this.elements.extractBtn.disabled = false;
      this.elements.scanBtn.disabled = false;
      this.updateProgress(0);
    }
  }

  updateProgress(percent) {
    this.elements.progress.style.width = percent + '%';
  }

  showStatus(message, type) {
    this.elements.status.textContent = message;
    this.elements.status.className = `status ${type} show`;
    
    setTimeout(() => {
      this.elements.status.classList.remove('show');
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});