// Color Control Panel JavaScript

class ColorControlPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.editMode = false;
    this.hasChanges = false;
    this.selectedColor = '#FF0000';
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
    this.initializeColorSpectrum();
    this.attachEventListeners();
    this.updateSpectrumSelector();
    this.updateSliderValues();
    this.updateColorPreview();
    this.updateSliderBackgrounds();
    this.loadSavedState();
  }

  initializeColorSpectrum() {
    // The spectrum slider will be handled in attachEventListeners
    // This method can be used for any additional spectrum setup if needed
  }

  setHue(hue) {
    this.currentHue = Math.max(0, Math.min(360, hue));
    this.updateSpectrumSelector();
    this.updateSliderValues();
    this.updateColorPreview();
    this.updateSliderBackgrounds();
  }

  updateColorPreview() {
    const preview = document.getElementById('color-preview');
    if (!preview) return;
    
    const hslColor = `hsl(${this.currentHue}, ${this.currentSaturation}%, ${this.currentLightness}%)`;
    const hexColor = this.hslToHex(this.currentHue, this.currentSaturation, this.currentLightness);
    
    preview.style.backgroundColor = hslColor;
    preview.textContent = hexColor.toUpperCase();
    
    this.selectedColor = hexColor;
  }

  updateSpectrumSelector() {
    const spectrumSelector = document.getElementById('spectrum-selector');
    const spectrumBar = document.getElementById('color-spectrum-bar');
    
    if (spectrumSelector && spectrumBar) {
      const percentage = (this.currentHue / 360) * 100;
      const barWidth = spectrumBar.offsetWidth;
      const selectorWidth = spectrumSelector.offsetWidth;
      const position = (percentage / 100) * (barWidth - selectorWidth);
      spectrumSelector.style.left = `${position}px`;
    }
  }

  updateSliderValues() {
    const hueValue = document.getElementById('hue-value');
    const saturationValue = document.getElementById('saturation-value');
    const lightnessValue = document.getElementById('lightness-value');
    const spectrumSlider = document.getElementById('spectrum-slider');
    const hueSlider = document.getElementById('hue-slider');
    const saturationSlider = document.getElementById('saturation-slider');
    const lightnessSlider = document.getElementById('lightness-slider');
    
    if (hueValue) hueValue.textContent = `${this.currentHue}°`;
    if (saturationValue) saturationValue.textContent = `${this.currentSaturation}%`;
    if (lightnessValue) lightnessValue.textContent = `${this.currentLightness}%`;
    
    if (spectrumSlider) spectrumSlider.value = this.currentHue;
    if (hueSlider) hueSlider.value = this.currentHue;
    if (saturationSlider) saturationSlider.value = this.currentSaturation;
    if (lightnessSlider) lightnessSlider.value = this.currentLightness;
  }

  updateSliderBackgrounds() {
    const saturationSlider = document.getElementById('saturation-slider');
    const lightnessSlider = document.getElementById('lightness-slider');
    
    if (saturationSlider) {
      saturationSlider.style.background = `linear-gradient(to right, hsl(${this.currentHue}, 0%, 50%), hsl(${this.currentHue}, 100%, 50%))`;
    }
    
    if (lightnessSlider) {
      lightnessSlider.style.background = `linear-gradient(to right, hsl(${this.currentHue}, 100%, 0%), hsl(${this.currentHue}, 100%, 50%), hsl(${this.currentHue}, 100%, 100%))`;
    }
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
    const layoutSelector = this.container.querySelector('#layout-select');
    if (layoutSelector) {
      layoutSelector.addEventListener('change', (e) => this.changeLayout(e.target.value));
    }
    
    // Theme selector
    const themeSelector = this.container.querySelector('#theme-select');
    if (themeSelector) {
      themeSelector.addEventListener('change', (e) => this.applyTheme(e.target.value));
    }
    
    // Spectrum Slider (main color spectrum control)
    const spectrumSlider = this.container.querySelector('#spectrum-slider');
    if (spectrumSlider) {
      spectrumSlider.addEventListener('input', (e) => {
        this.setHue(parseInt(e.target.value));
      });
    }

    // HSL Sliders
    const hueSlider = this.container.querySelector('#hue-slider');
    const saturationSlider = this.container.querySelector('#saturation-slider');
    const lightnessSlider = this.container.querySelector('#lightness-slider');
    
    if (hueSlider) {
      hueSlider.addEventListener('input', (e) => {
        this.setHue(parseInt(e.target.value));
        this.emitColorChange();
      });
    }
    
    if (saturationSlider) {
      saturationSlider.addEventListener('input', (e) => {
        this.currentSaturation = parseInt(e.target.value);
        this.updateColorPreview();
        this.updateSliderValues();
        this.updateSliderBackgrounds();
        this.emitColorChange();
        this.markChanged();
      });
    }
    
    if (lightnessSlider) {
      lightnessSlider.addEventListener('input', (e) => {
        this.currentLightness = parseInt(e.target.value);
        this.updateColorPreview();
        this.updateSliderValues();
        this.updateSliderBackgrounds();
        this.emitColorChange();
        this.markChanged();
      });
    }
    
    // Color inputs
    const primaryInput = this.container.querySelector('#primary-color');
    const secondaryInput = this.container.querySelector('#secondary-color');
    const accentInput = this.container.querySelector('#accent-color');
    
    if (primaryInput) {
      primaryInput.addEventListener('change', (e) => this.updatePrimaryColor(e.target.value));
      primaryInput.addEventListener('input', (e) => {
        const display = primaryInput.nextElementSibling;
        if (display && display.classList.contains('color-value')) {
          display.textContent = e.target.value.toUpperCase();
        }
      });
    }
    
    if (secondaryInput) {
      secondaryInput.addEventListener('change', (e) => this.updateSecondaryColor(e.target.value));
      secondaryInput.addEventListener('input', (e) => {
        const display = secondaryInput.nextElementSibling;
        if (display && display.classList.contains('color-value')) {
          display.textContent = e.target.value.toUpperCase();
        }
      });
    }
    
    if (accentInput) {
      accentInput.addEventListener('change', (e) => this.updateAccentColor(e.target.value));
      accentInput.addEventListener('input', (e) => {
        const display = accentInput.nextElementSibling;
        if (display && display.classList.contains('color-value')) {
          display.textContent = e.target.value.toUpperCase();
        }
      });
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
  
  // Event emission methods
  emitColorChange() {
    const colors = {
      primary: this.container.querySelector('#primary-color')?.value || this.hslToHex(this.currentHue, this.currentSaturation, this.currentLightness),
      secondary: this.container.querySelector('#secondary-color')?.value || '#64748b',
      accent: this.container.querySelector('#accent-color')?.value || '#10b981'
    };
    
    if (window.ThemeEventBus) {
      ThemeEventBus.dispatch(ThemeEvents.COLOR_CHANGED, { colors });
    }
  }

  emitThemeChange(theme) {
    if (window.ThemeEventBus) {
      ThemeEventBus.dispatch(ThemeEvents.THEME_APPLIED, { theme });
    }
  }

  emitEditModeChange() {
    if (window.ThemeEventBus) {
      ThemeEventBus.dispatch(ThemeEvents.EDIT_MODE_CHANGED, { isEditMode: this.editMode });
    }
  }

  emitLayoutChange(layout) {
    if (window.ThemeEventBus) {
      ThemeEventBus.dispatch(ThemeEvents.LAYOUT_CHANGED, { layout });
    }
  }

  emitSaveRequest() {
    if (window.ThemeEventBus) {
      ThemeEventBus.dispatch(ThemeEvents.SAVE_REQUESTED, {});
    }
  }

  emitResetRequest() {
    if (window.ThemeEventBus) {
      ThemeEventBus.dispatch(ThemeEvents.RESET_REQUESTED, {});
    }
  }
  
  toggleEditMode() {
    this.editMode = !this.editMode;
    const toggle = this.container.querySelector('.edit-mode-toggle');
    
    if (this.editMode) {
      toggle.textContent = 'Exit Edit Mode';
      toggle.classList.add('active');
    } else {
      toggle.textContent = 'Edit Mode';
      toggle.classList.remove('active');
    }
    
    this.emitEditModeChange();
    this.markChanged();
  }
  
  saveChanges() {
    // Emit save request event
    this.emitSaveRequest();
    
    if (this.hasChanges) {
      // Save local state
      const state = {
        editMode: this.editMode,
        currentHue: this.currentHue,
        currentSaturation: this.currentSaturation,
        currentLightness: this.currentLightness,
        primaryColor: this.container.querySelector('#primary-color')?.value,
        secondaryColor: this.container.querySelector('#secondary-color')?.value,
        accentColor: this.container.querySelector('#accent-color')?.value,
        layout: this.container.querySelector('#layout-select')?.value,
        theme: this.container.querySelector('#theme-select')?.value
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
        const layoutSelector = this.container.querySelector('#layout-select');
        const themeSelector = this.container.querySelector('#theme-select');
        
        if (primaryInput && state.primaryColor) {
          primaryInput.value = state.primaryColor;
          const display = primaryInput.nextElementSibling;
          if (display) display.textContent = state.primaryColor.toUpperCase();
        }
        if (secondaryInput && state.secondaryColor) {
          secondaryInput.value = state.secondaryColor;
          const display = secondaryInput.nextElementSibling;
          if (display) display.textContent = state.secondaryColor.toUpperCase();
        }
        if (accentInput && state.accentColor) {
          accentInput.value = state.accentColor;
          const display = accentInput.nextElementSibling;
          if (display) display.textContent = state.accentColor.toUpperCase();
        }
        if (layoutSelector && state.layout) layoutSelector.value = state.layout;
        if (themeSelector && state.theme) themeSelector.value = state.theme;
        
        this.updateColorPreview();
        this.updateSliderValues();
        this.updateSliderBackgrounds();
      } catch (error) {
        console.warn('Failed to load saved state:', error);
      }
    }
  }
  
  changeLayout(layout) {
    this.emitLayoutChange(layout);
    this.markChanged();
  }
  
  applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    
    if (this.themes[themeName]) {
      const theme = this.themes[themeName];
      const primaryInput = this.container.querySelector('#primary-color');
      
      if (primaryInput) {
        primaryInput.value = theme.primary;
        this.updatePrimaryColor(theme.primary);
      }
    }
    
    this.emitThemeChange(themeName);
    this.markChanged();
  }
  
  updatePrimaryColor(color) {
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--color-primary', color);
    
    // Update HSL values from color
    const hsl = this.hexToHsl(color);
    if (hsl) {
      this.currentHue = hsl.h;
      this.currentSaturation = hsl.s;
      this.currentLightness = hsl.l;
      this.updateColorPreview();
      this.updateSliderValues();
      this.updateSliderBackgrounds();
    }
    
    // Update display
    const primaryInput = this.container.querySelector('#primary-color');
    if (primaryInput) {
      const display = primaryInput.nextElementSibling;
      if (display) display.textContent = color.toUpperCase();
    }
    
    this.emitColorChange();
    this.markChanged();
  }
  
  updateSecondaryColor(color) {
    document.documentElement.style.setProperty('--secondary', color);
    document.documentElement.style.setProperty('--color-secondary', color);
    
    // Update display
    const secondaryInput = this.container.querySelector('#secondary-color');
    if (secondaryInput) {
      const display = secondaryInput.nextElementSibling;
      if (display) display.textContent = color.toUpperCase();
    }
    
    this.emitColorChange();
    this.markChanged();
  }
  
  updateAccentColor(color) {
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--color-accent', color);
    
    // Update display
    const accentInput = this.container.querySelector('#accent-color');
    if (accentInput) {
      const display = accentInput.nextElementSibling;
      if (display) display.textContent = color.toUpperCase();
    }
    
    this.emitColorChange();
    this.markChanged();
  }
  
  resetContent() {
    if (confirm('Are you sure you want to reset all content? This action cannot be undone.')) {
      this.emitResetRequest();
      
      // Reset local values
      this.currentHue = 225;
      this.currentSaturation = 73;
      this.currentLightness = 57;
      
      // Reset form values
      const primaryInput = this.container.querySelector('#primary-color');
      const secondaryInput = this.container.querySelector('#secondary-color');
      const accentInput = this.container.querySelector('#accent-color');
      const layoutSelector = this.container.querySelector('#layout-select');
      const themeSelector = this.container.querySelector('#theme-select');
      
      if (primaryInput) {
        primaryInput.value = '#6366f1';
        const display = primaryInput.nextElementSibling;
        if (display) display.textContent = '#6366f1';
      }
      if (secondaryInput) {
        secondaryInput.value = '#64748b';
        const display = secondaryInput.nextElementSibling;
        if (display) display.textContent = '#64748b';
      }
      if (accentInput) {
        accentInput.value = '#10b981';
        const display = accentInput.nextElementSibling;
        if (display) display.textContent = '#10b981';
      }
      if (layoutSelector) layoutSelector.value = 'top-nav';
      if (themeSelector) themeSelector.value = 'dark';
      
      this.updateColorPreview();
      this.updateSliderValues();
      this.updateSliderBackgrounds();
      
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
      minimizeBtn.textContent = '▾';
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

// Safe auto-initialize if element exists
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if not already initialized and theme events are available
  if (!window.colorControlPanel && window.ThemeEventBus) {
    setTimeout(() => {
      const controlPanel = document.querySelector('.control-panel');
      if (controlPanel && controlPanel.id) {
        window.colorControlPanel = new ColorControlPanel(controlPanel.id);
      }
    }, 200); // Small delay to ensure all components are ready
  }
});

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ColorControlPanel;
}