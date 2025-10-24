// @ts-nocheck
// WebsiteState.js - Single source of truth for application state
// =============================================================================
// STATE MANAGEMENT - Single source of truth
// =============================================================================
const WebsiteState = {
  // Application state
  state: {
    theme: 'default',
    mode: 'dark',
    layout: 'top-nav',
    isEditMode: false,
    isGradientMode: false,
    colors: {
      hue: 240,
      saturation: 70,
      lightness: 50,
      harmonyAngle: 60,
      primary: '#6366f1',
      secondary: '#64748b',
      accent: '#10b981',
      primaryLight: '#8f91f3',
      primaryDark: '#4244b8',
      hoverColor: '#6366f1'
    }
  },

  // State change listeners
  listeners: new Set(),

  // Get current state
  getState() {
    return { ...this.state };
  },

  // Update state and notify listeners
  setState(newState) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };

    // Notify all listeners of state change
    this.listeners.forEach(listener => {
      try {
        listener(this.state, oldState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });

    console.log('State updated:', newState);
  },

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // Return unsubscribe function
  },

  // Initialize state from localStorage
  async loadFromStorage() {
    try {
      const stored = localStorage.getItem('workingSettings');
      if (stored) {
        const settings = JSON.parse(stored);
        this.setState({
          theme: settings.theme || 'default',
          mode: settings.mode || 'dark',
          layout: settings.layout || 'top-nav'
        });
      }
    } catch (error) {
      console.error('Error loading state from storage:', error);
    }
  },

  // Save state to localStorage
  saveToStorage() {
    try {
      const settings = {
        theme: this.state.theme,
        mode: this.state.mode,
        layout: this.state.layout,
        colors: this.state.colors
      };
      localStorage.setItem('workingSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving state to storage:', error);
    }
  }
};

export default WebsiteState;
