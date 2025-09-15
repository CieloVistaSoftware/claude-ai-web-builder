// Color Control Panel JavaScript

class ColorControlPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.editMode = false;
    this.hasChanges = false;
    this.currentHue = 0;
    this.currentSaturation = 100;
    this.currentLightness = 50;
    
    this.themes = {
      'ocean': { primary: '#0ea5e9', description: 'Ocean Blue' },
      'forest': { primary: '#059669', description: 'Forest Green' },
      'sunset': { primary: '#f59e0b', description: 'Sunset Orange' },
      'rose': { primary: '#e11d48', description: 'Rose Red' },
      'violet': { primary: '#8b5cf6', description: 'Deep Violet' },
      'emerald': { primary: '#10b981', description: 'Emerald Green' },
      'amber': { primary: '#f59e0b', description: 'Warm Amber' },
      'ruby': { primary: '#dc2626', description: 'Ruby Red' },
      'sapphire': { primary: '#2563eb', description: 'Sapphire Blue' },
      'jade': { primary: '#059669', description: 'Jade Green' },
      'coral': { primary: '#f97316', description: 'Coral Orange' },
      'lavender': { primary: '#a855f7', description: 'Lavender Purple' },
      'mint': { primary: '#06b6d4', description: 'Fresh Mint' },
      'gold': { primary: '#eab308', description: 'Golden Yellow' },
      'crimson': { primary: '#be123c', description: 'Crimson Red' },
      'azure': { primary: '#0284c7', description: 'Azure Blue' },
      'lime': { primary: '#65a30d', description: 'Lime Green' },
      'tangerine': { primary: '#ea580c', description: 'Tangerine' },
      'amethyst': { primary: '#9333ea', description: 'Amethyst Purple' },
      'teal': { primary: '#0d9488', description: 'Teal Blue' },
      'cherry': { primary: '#e11d48', description: 'Cherry Red' },
      'sky': { primary: '#0ea5e9', description: 'Sky Blue' },
      'sage': { primary: '#84cc16', description: 'Sage Green' },
      'bronze': { primary: '#ca8a04', description: 'Bronze Gold' },
      'magenta': { primary: '#c026d3', description: 'Magenta Pink' }
    };
    
    this.init();
  }
  
  init() {
    this.attachEventListeners();
    this.updateColorBar();
    this.loadSavedState();
  }
  
  attachEventListeners() {
    // Edit mode toggle
    const editToggle = this.container.querySelector('.edit-mode-toggle');
    if (editToggle) {
      editToggle.addEventListener('click', () => this.toggleEditMode());
    }
    
    // Save button
    const saveBtn = this.container.querySelector('#save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveChanges());
    }
    
    // Layout selector
    const layoutSelector = this.container.querySelector('#layout-selector');
    if (layoutSelector) {
      layoutSelector.addEventListener('change', (e) => this.changeLayout(e.target.value));
    }
    
    // Color bar slider
    const colorSlider = this.container.querySelector('#color-bar-slider');
    if (colorSlider) {
      colorSlider.addEventListener('input', (e) => this.updateColorFromSlider(e.target.value));
    }
    
    // Fine adjustment buttons
    const fineButtons = this.container.querySelectorAll('.color-fine-btn');
    fineButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.adjustColorFine(e.target.dataset.action));
    });
    
    // Saturation and lightness sliders
    const satSlider = this.container.querySelector('#saturation-slider');
    const lightSlider = this.container.querySelector('#lightness-slider');
    
    if (satSlider) {
      satSlider.addEventListener('input', (e) => this.updateSaturation(e.target.value));
    }
    
    if (lightSlider) {
      lightSlider.addEventListener('input', (e) => this.updateLightness(e.target.value));
    }
    
    // Theme selector
    const themeSelector = this.container.querySelector('#theme-selector');
    if (themeSelector) {
      themeSelector.addEventListener('change', (e) => this.applyTheme(e.target.value));
    }
    
    // Color inputs
    const primaryInput = this.container.querySelector('#primary-color');
    const secondaryInput = this.container.querySelector('#secondary-color');
    const accentInput = this.container.querySelector('#accent-color');
    
    if (primaryInput) {
      primaryInput.addEventListener('change', (e) => this.updatePrimaryColor(e.target.value));
    }
    
    if (secondaryInput) {
      secondaryInput.addEventListener('change', (e) => this.updateSecondaryColor(e.target.value));
    }
    
    if (accentInput) {
      accentInput.addEventListener('change', (e) => this.updateAccentColor(e.target.value));
    }
    
    // Reset button
    const resetBtn = this.container.querySelector('#reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetContent());
    }
    
    // Minimize button
    const minimizeBtn = this.container.querySelector('#minimize-btn');
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => this.toggleMinimize());
    }
  }
  
  toggleEditMode() {
    this.editMode = !this.editMode;
    const toggle = this.container.querySelector('.edit-mode-toggle');
    const body = document.body;
    
    if (this.editMode) {
      toggle.textContent = 'Exit Edit Mode';
      toggle.classList.add('active');
      body.classList.add('edit-mode');
    } else {
      toggle.textContent = 'Enter Edit Mode';
      toggle.classList.remove('active');
      body.classList.remove('edit-mode');
    }
    
    this.markChanged();
  }
  
  saveChanges() {
    if (this.hasChanges) {
      // Save to localStorage
      const state = {
        editMode: this.editMode,
        currentHue: this.currentHue,
        currentSaturation: this.currentSaturation,
        currentLightness: this.currentLightness,
        primaryColor: this.container.querySelector('#primary-color')?.value,
        secondaryColor: this.container.querySelector('#secondary-color')?.value,
        accentColor: this.container.querySelector('#accent-color')?.value,
        layout: this.container.querySelector('#layout-selector')?.value
      };
      
      localStorage.setItem('colorControlPanelState', JSON.stringify(state));
      
      this.hasChanges = false;
      this.updateSaveButton();
      
      // Show feedback
      this.showSaveToast();
    }
  }
  
  loadSavedState() {
    const savedState = localStorage.getItem('colorControlPanelState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        
        if (state.currentHue !== undefined) this.currentHue = state.currentHue;
        if (state.currentSaturation !== undefined) this.currentSaturation = state.currentSaturation;
        if (state.currentLightness !== undefined) this.currentLightness = state.currentLightness;
        
        // Restore UI elements
        const primaryInput = this.container.querySelector('#primary-color');
        const secondaryInput = this.container.querySelector('#secondary-color');
        const accentInput = this.container.querySelector('#accent-color');
        const layoutSelector = this.container.querySelector('#layout-selector');
        
        if (primaryInput && state.primaryColor) primaryInput.value = state.primaryColor;
        if (secondaryInput && state.secondaryColor) secondaryInput.value = state.secondaryColor;
        if (accentInput && state.accentColor) accentInput.value = state.accentColor;
        if (layoutSelector && state.layout) layoutSelector.value = state.layout;
        
        this.updateColorBar();
      } catch (error) {
        console.warn('Failed to load saved state:', error);
      }
    }
  }
  
  changeLayout(layout) {
    const body = document.body;
    
    // Remove existing layout classes
    body.classList.remove('layout-single', 'layout-two-column', 'layout-three-column', 'layout-grid');
    
    // Add new layout class
    if (layout && layout !== 'default') {
      body.classList.add(`layout-${layout}`);
    }
    
    this.markChanged();
  }
  
  updateColorFromSlider(value) {
    this.currentHue = value;
    this.updateColorBar();
    this.updateColorFromHSL();
    this.markChanged();
  }
  
  updateSaturation(value) {
    this.currentSaturation = value;
    this.updateColorFromHSL();
    this.markChanged();
  }
  
  updateLightness(value) {
    this.currentLightness = value;
    this.updateColorFromHSL();
    this.markChanged();
  }
  
  updateColorBar() {
    const indicator = this.container.querySelector('.color-bar-current-indicator');
    const preview = this.container.querySelector('.color-bar-preview');
    const slider = this.container.querySelector('#color-bar-slider');
    
    if (indicator && slider) {
      const percentage = (this.currentHue / 360) * 100;
      indicator.style.left = `${percentage}%`;
      slider.value = this.currentHue;
    }
    
    if (preview) {
      const hslColor = `hsl(${this.currentHue}, ${this.currentSaturation}%, ${this.currentLightness}%)`;
      preview.style.backgroundColor = hslColor;
      preview.textContent = `H:${Math.round(this.currentHue)} S:${this.currentSaturation}% L:${this.currentLightness}%`;
    }
  }
  
  updateColorFromHSL() {
    const hslColor = `hsl(${this.currentHue}, ${this.currentSaturation}%, ${this.currentLightness}%)`;
    const hexColor = this.hslToHex(this.currentHue, this.currentSaturation, this.currentLightness);
    
    // Update primary color input
    const primaryInput = this.container.querySelector('#primary-color');
    if (primaryInput) {
      primaryInput.value = hexColor;
    }
    
    // Update CSS custom property
    document.documentElement.style.setProperty('--primary-color', hexColor);
    
    this.updateColorBar();
  }
  
  adjustColorFine(action) {
    const step = 5;
    
    switch (action) {
      case 'hue-left':
        this.currentHue = Math.max(0, this.currentHue - step);
        break;
      case 'hue-right':
        this.currentHue = Math.min(360, this.currentHue + step);
        break;
      case 'sat-down':
        this.currentSaturation = Math.max(0, this.currentSaturation - step);
        break;
      case 'sat-up':
        this.currentSaturation = Math.min(100, this.currentSaturation + step);
        break;
      case 'light-down':
        this.currentLightness = Math.max(0, this.currentLightness - step);
        break;
      case 'light-up':
        this.currentLightness = Math.min(100, this.currentLightness + step);
        break;
    }
    
    this.updateColorFromHSL();
    this.updateSliders();
    this.markChanged();
  }
  
  updateSliders() {
    const satSlider = this.container.querySelector('#saturation-slider');
    const lightSlider = this.container.querySelector('#lightness-slider');
    
    if (satSlider) satSlider.value = this.currentSaturation;
    if (lightSlider) lightSlider.value = this.currentLightness;
  }
  
  applyTheme(themeName) {
    if (this.themes[themeName]) {
      const theme = this.themes[themeName];
      const primaryInput = this.container.querySelector('#primary-color');
      
      if (primaryInput) {
        primaryInput.value = theme.primary;
        this.updatePrimaryColor(theme.primary);
      }
    }
    this.markChanged();
  }
  
  updatePrimaryColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Update HSL values from color
    const hsl = this.hexToHsl(color);
    if (hsl) {
      this.currentHue = hsl.h;
      this.currentSaturation = hsl.s;
      this.currentLightness = hsl.l;
      this.updateColorBar();
      this.updateSliders();
    }
    
    this.markChanged();
  }
  
  updateSecondaryColor(color) {
    document.documentElement.style.setProperty('--secondary-color', color);
    this.markChanged();
  }
  
  updateAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    this.markChanged();
  }
  
  resetContent() {
    if (confirm('Are you sure you want to reset all content? This action cannot be undone.')) {
      // Reset colors
      document.documentElement.style.setProperty('--primary-color', '#6366f1');
      document.documentElement.style.setProperty('--secondary-color', '#8b5cf6');
      document.documentElement.style.setProperty('--accent-color', '#06b6d4');
      
      // Reset form values
      const primaryInput = this.container.querySelector('#primary-color');
      const secondaryInput = this.container.querySelector('#secondary-color');
      const accentInput = this.container.querySelector('#accent-color');
      const layoutSelector = this.container.querySelector('#layout-selector');
      const themeSelector = this.container.querySelector('#theme-selector');
      
      if (primaryInput) primaryInput.value = '#6366f1';
      if (secondaryInput) secondaryInput.value = '#8b5cf6';
      if (accentInput) accentInput.value = '#06b6d4';
      if (layoutSelector) layoutSelector.value = 'default';
      if (themeSelector) themeSelector.value = '';
      
      // Reset layout
      document.body.classList.remove('layout-single', 'layout-two-column', 'layout-three-column', 'layout-grid');
      
      // Reset HSL values
      this.currentHue = 225;
      this.currentSaturation = 73;
      this.currentLightness = 57;
      
      this.updateColorBar();
      this.updateSliders();
      
      // Clear localStorage
      localStorage.removeItem('colorControlPanelState');
      
      this.markChanged();
    }
  }
  
  toggleMinimize() {
    const panel = this.container;
    const body = panel.querySelector('.control-panel-body');
    const minimizeBtn = panel.querySelector('#minimize-btn');
    
    if (body.style.display === 'none') {
      body.style.display = 'block';
      minimizeBtn.textContent = '−';
      panel.style.height = 'auto';
    } else {
      body.style.display = 'none';
      minimizeBtn.textContent = '+';
      panel.style.height = 'auto';
    }
  }
  
  markChanged() {
    this.hasChanges = true;
    this.updateSaveButton();
  }
  
  updateSaveButton() {
    const saveBtn = this.container.querySelector('#save-btn');
    if (saveBtn) {
      if (this.hasChanges) {
        saveBtn.className = 'btn save-btn-visible';
        saveBtn.textContent = 'Save Changes';
      } else {
        saveBtn.className = 'btn save-btn-hidden';
        saveBtn.textContent = 'No Changes';
      }
    }
  }
  
  showSaveToast() {
    // Create and show a simple toast notification
    const toast = document.createElement('div');
    toast.textContent = 'Changes saved successfully!';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
  
  // Utility functions
  hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  
  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l;
    
    l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
}

// Export for use as module or initialize if used directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ColorControlPanel;
} else {
  // Auto-initialize if element exists
  document.addEventListener('DOMContentLoaded', () => {
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel && controlPanel.id) {
      window.colorControlPanel = new ColorControlPanel(controlPanel.id);
    }
  });
}