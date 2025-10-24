// @ts-nocheck
// UIController.js - Event handling and DOM updates
// =============================================================================
// UI CONTROLLER - Event handling and DOM updates
// =============================================================================
import WebsiteState from "../state/WebsiteState";
import ThemeManager from "../theme/ThemeManager";
import LayoutManager from "../layout/LayoutManager";
import EditModeManager from "../edit/EditModeManager";

const UIController = {
  stateListenerUnsubscribe: null,
  // Flag to prevent multiple initializations
  isInitialized: false,
  eventListenersSetup: false,

  // Initialize UI elements and event listeners
  init() {
    // Prevent multiple initializations
    if (this.isInitialized) {
      console.log('UIController already initialized, skipping...');
      return;
    }

    this.setupStateListener();
    this.setupEventListeners();
    this.syncUIWithState();
    this.isInitialized = true;
    console.log('✅ UIController initialized');
  },

  // Setup state change listener
  setupStateListener() {
    // Remove existing listener if it exists to prevent duplicates
    if (this.stateListenerUnsubscribe) {
      this.stateListenerUnsubscribe();
    }

    // Subscribe to state changes
    this.stateListenerUnsubscribe = WebsiteState.subscribe((newState, oldState): any => {
      // Apply theme changes
      if (newState.theme !== oldState.theme || newState.mode !== oldState.mode || newState.colors !== oldState.colors) {
        ThemeManager.applyTheme(newState.theme, newState.mode, newState.colors);
      }

      // Apply layout changes
      if (newState.layout !== oldState.layout) {
        LayoutManager.applyLayout(newState.layout);
      }

      // Apply edit mode changes
      if (newState.isEditMode !== oldState.isEditMode) {
        EditModeManager.toggleEditMode(newState.isEditMode);
      }

      // Update UI elements
      this.updateUIElements(newState);

      // Save to storage
      WebsiteState.saveToStorage();
    });
  },

  // Setup event listeners
  setupEventListeners() {
    // Prevent duplicate event listeners
    if (this.eventListenersSetup) {
      console.log('Event listeners already setup, skipping...');
      return;
    }

    // Edit mode toggle
    const editModeToggle = document.getElementById('edit-mode-toggle');
    if (editModeToggle) {
      editModeToggle.addEventListener('click', (): any => {
        const currentState = WebsiteState.getState();
        const newEditMode = !currentState.isEditMode;
        console.log(`🔧 Edit mode toggle clicked: ${currentState.isEditMode} -> ${newEditMode}`);
        WebsiteState.setState({ isEditMode: newEditMode });
        console.log(`🔧 Edit mode state updated. New state:`, WebsiteState.getState());
      });
    } else {
      console.error('❌ Edit mode toggle button not found!');
    }

    // Theme select
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e): any => {
        const theme = e.target.value;
        const themeConfig = ThemeManager.themes[theme];
        if (themeConfig) {
          const colors = ThemeManager.calculateColors(
            themeConfig.hue,
            themeConfig.saturation,
            themeConfig.lightness,
            WebsiteState.getState().colors.harmonyAngle
          );
          WebsiteState.setState({ theme, colors });
          // Show status message for theme change
          if (theme !== 'default') {
            this.showStatusMessage(`Theme changed to: ${theme}`);
          }
        }
      });
    }

    // Layout select
    const layoutSelect = document.getElementById('layout-select');
    if (layoutSelect) {
      layoutSelect.addEventListener('change', (e): any => {
        WebsiteState.setState({ layout: e.target.value });
      });
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', (e): any => {
        WebsiteState.setState({ mode: e.target.checked ? 'dark' : 'light' });
      });
    }

    // Gradient toggle
    const gradientToggle = document.getElementById('gradient-toggle');
    if (gradientToggle) {
      gradientToggle.addEventListener('change', (e): any => {
        WebsiteState.setState({ isGradientMode: e.target.checked });
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
          heroSection.classList.toggle('gradient-mode', e.target.checked);
        }
      });
    }

    // Color sliders
    this.setupColorSliders();

    // Save button
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => SaveLoadManager.saveWebsite());
    }

    // Import button
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    if (importBtn && importFile) {
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', (e): any => {
        const file = e.target.files[0];
        if (file) {
          SaveLoadManager.importWebsite(file);
          importFile.value = '';
        }
      });
    }

    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', (): any => {
        if (confirm('Are you sure you want to reset all content to defaults? This will reload the page.')) {
          try {
            localStorage.clear();
            sessionStorage.clear();
          } catch (e) {
            console.log('Could not clear storage:', e);
          }
          window.location.reload();
        }
      });
    }

    // Mark event listeners as setup
    this.eventListenersSetup = true;
    console.log('✅ Event listeners setup completed');
  },

  // Setup color sliders
  setupColorSliders() {
    const sliders = [
      { id: 'hue-slider', property: 'hue' },
      { id: 'saturation-slider', property: 'saturation' },
      { id: 'lightness-slider', property: 'lightness' },
      { id: 'harmony-angle-slider', property: 'harmonyAngle' }
    ];

    sliders.forEach(({ id, property }): any => {
      const slider = document.getElementById(id);
      if (slider) {
        slider.addEventListener('input', (e): any => {
          const currentColors = WebsiteState.getState().colors;
          const newValue = parseInt(e.target.value);

          const updatedColors = { ...currentColors, [property]: newValue };
          const calculatedColors = ThemeManager.calculateColors(
            updatedColors.hue,
            updatedColors.saturation,
            updatedColors.lightness,
            updatedColors.harmonyAngle
          );

          WebsiteState.setState({ colors: calculatedColors });
        });
      }
    });
  },

  // Update UI elements to match state
  updateUIElements(state) {
    // Update edit mode toggle
    const editModeToggle = document.getElementById('edit-mode-toggle');
    if (editModeToggle) {
      editModeToggle.classList.toggle('active', state.isEditMode);
      editModeToggle.textContent = state.isEditMode ? 'Exit Edit Mode' : 'Edit Mode';
    }

    // Update theme select
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect && themeSelect.value !== state.theme) {
      themeSelect.value = state.theme;
    }

    // Update layout select
    const layoutSelect = document.getElementById('layout-select');
    if (layoutSelect && layoutSelect.value !== state.layout) {
      layoutSelect.value = state.layout;
    }

    // Update dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.checked = state.mode === 'dark';
    }

    // Update gradient toggle
    const gradientToggle = document.getElementById('gradient-toggle');
    if (gradientToggle) {
      gradientToggle.checked = state.isGradientMode;
    }

    // Update color sliders
    const sliders = {
      'hue-slider': state.colors.hue,
      'saturation-slider': state.colors.saturation,
      'lightness-slider': state.colors.lightness,
      'harmony-angle-slider': state.colors.harmonyAngle
    };

    Object.entries(sliders).forEach(([id, value]): any => {
      const slider = document.getElementById(id);
      if (slider && slider.value !== String(value)) {
        slider.value = value;
      }
    });

    // Update color preview
    const colorPreview = document.getElementById('color-preview');
    if (colorPreview) {
      colorPreview.textContent = ThemeManager.hslToHex(
        state.colors.hue,
        state.colors.saturation,
        state.colors.lightness
      );
    }

    // Update hue value display
    const hueValue = document.getElementById('hue-value');
    if (hueValue) {
      hueValue.textContent = state.colors.hue + '°';
    }

    // Update harmony value display
    const harmonyValue = document.getElementById('harmony-value');
    if (harmonyValue) {
      const harmonyName = ThemeManager.getHarmonyName(state.colors.harmonyAngle);
      harmonyValue.textContent = `${state.colors.harmonyAngle}° (${harmonyName})`;
    }

    // Update status message
    this.updateStatusMessage(state);
  },

  // Update status message
  updateStatusMessage(state) {
    const statusMessage = document.getElementById('status-message');
    const statusInfo = document.getElementById('status-info');

    if (statusMessage && statusInfo) {
      if (state.isEditMode) {
        statusMessage.textContent = 'Edit mode ON - Click any text to edit';
        statusInfo.textContent = 'Edit mode: ON';
      } else {
        statusMessage.textContent = 'Edit mode OFF - Content is locked';
        statusInfo.textContent = 'Edit mode: OFF';
      }
    }
  },

  // Show status message temporarily
  showStatusMessage(message, duration = 3000) {
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
      const originalMessage = statusMessage.textContent;
      statusMessage.textContent = message;

      setTimeout((): any => {
        const currentState = WebsiteState.getState();
        this.updateStatusMessage(currentState);
      }, duration);
    }
  },

  // Sync UI with current state on initialization
  syncUIWithState() {
    const state = WebsiteState.getState();
    this.updateUIElements(state);
    ThemeManager.applyTheme(state.theme, state.mode, state.colors);
    LayoutManager.applyLayout(state.layout);
    EditModeManager.setupEditableElements(state.isEditMode);
  }
};

export default UIController;
