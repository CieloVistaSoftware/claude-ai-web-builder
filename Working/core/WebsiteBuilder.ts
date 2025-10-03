// @ts-nocheck
// WebsiteBuilder.js - Main application controller
// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================
import WebsiteState from "./state/WebsiteState";
import UIController from "./UIController";

const WebsiteBuilder = {
  // Initialize the entire application
  async init() {
    try {
      console.log('🚀 Initializing Website Builder with modular architecture...');

      // Load state from storage
      await WebsiteState.loadFromStorage();

      // Initialize UI controller
      UIController.init();

      // Set up global event handlers for control panel content loading
      this.setupControlPanelHandlers();

      console.log('✅ Website Builder initialized successfully!');
      console.log('Current state:', WebsiteState.getState());

    } catch (error) {
      console.error('❌ Error initializing Website Builder:', error);
    }
  },

  // Setup control panel handlers for dynamic content loading
  setupControlPanelHandlers() {
    // Listen for control panel content loaded event
    window.addEventListener('controlpanel:contentloaded', () => {
      console.log('Control panel content loaded - reinitializing UI');
      // Reset the event listeners setup flag since control panel content was reloaded
      UIController.eventListenersSetup = false;
      UIController.setupEventListeners();
      UIController.syncUIWithState();
    });

    // Make initialization function globally available for backward compatibility
    window.initControlPanelHandlers = () => {
      console.log('Legacy initControlPanelHandlers called - using new modular system');
      // Reset the event listeners setup flag for legacy compatibility
      UIController.eventListenersSetup = false;
      UIController.setupEventListeners();
      UIController.syncUIWithState();
    };
  }
};

export default WebsiteBuilder;
