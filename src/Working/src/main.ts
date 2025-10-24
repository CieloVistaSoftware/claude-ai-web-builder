// Main TypeScript entry point for Website Builder
import WebsiteState from "../core/state/WebsiteState.js";
import ThemeManager from "../core/theme/ThemeManager.js";
import LayoutManager from "../core/layout/LayoutManager.js";
import EditModeManager from "../core/edit/EditModeManager.js";
import MediaManager from "../core/edit/MediaManager.js";
import SaveLoadManager from "../core/save/SaveLoadManager.js";
import UIController from "../core/UIController.js";

// Type definitions for state
interface AppState {
  theme: string;
  mode: "light" | "dark";
  layout: string;
  isGradientMode: boolean;
  websiteTitle: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    hue: number;
    saturation: number;
    lightness: number;
    harmonyAngle: number;
  };
}

// Global state management
declare global {
  interface Window {
    WebsiteState: typeof WebsiteState;
    ThemeManager: typeof ThemeManager;
    LayoutManager: typeof LayoutManager;
    EditModeManager: typeof EditModeManager;
    MediaManager: typeof MediaManager;
    SaveLoadManager: typeof SaveLoadManager;
    UIController: typeof UIController;
  }
}

// Make managers available globally
window.WebsiteState = WebsiteState;
window.ThemeManager = ThemeManager;
window.LayoutManager = LayoutManager;
window.EditModeManager = EditModeManager;
window.MediaManager = MediaManager;
window.SaveLoadManager = SaveLoadManager;
window.UIController = UIController;

// Global utility functions
window.saveWebsiteWithTheme = (): void => {
  SaveLoadManager.saveWebsite().catch(console.error);
};
window.openMediaPicker = (target: HTMLElement, position?: string): void =>
  MediaManager.openMediaPicker(target, position);
window.showAllInsertMediaButtons = (): void =>
  MediaManager.showAllInsertMediaButtons();
window.updateAllInsertMediaButtons = (): void => {
  const isEditMode = document.body.classList.contains("edit-mode");
  MediaManager.updateInsertMediaButtons(isEditMode);
};

/**
 * Initialize the application
 */
function initializeApp(): void {
  console.log("🚀 Initializing Website Builder...");

  try {
    // Initialize managers
    UIController.init();

    // Set up content loading
    setupContentLoading();

    // Set up edit mode functionality
    setupEditMode();

    console.log("✅ Website Builder initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Website Builder:", error);
  }
}

/**
 * Setup content loading from site-content.json
 */
function setupContentLoading(): void {
  // Load site content
  fetch("./site-content.json")
    .then((response) => response.json())
    .then((data: any) => {
      window.siteContentData = data;
      window.siteContent = data;

      if (typeof window.renderSiteContent === "function") {
        window.renderSiteContent(data);
      }

      console.log("📄 Site content loaded");
    })
    .catch((error): any => {
      console.warn("⚠️ Could not load site-content.json:", error);
    });
}

/**
 * Setup edit mode functionality
 */
function setupEditMode(): void {
  // Add edit mode styles and behaviors
  const editModeToggle = document.getElementById(
    "edit-mode-toggle"
  ) as HTMLButtonElement;
  if (editModeToggle) {
    editModeToggle.addEventListener("click", (): any => {
      const isEditMode = document.body.classList.toggle("edit-mode");
      EditModeManager.toggleEditMode(isEditMode);

      // Update button text
      editModeToggle.textContent = isEditMode ? "Exit Edit Mode" : "Edit Mode";

      // Update status
      const statusMessage = document.getElementById("status-message");
      if (statusMessage) {
        statusMessage.textContent = isEditMode
          ? "Edit mode ON - Click elements to edit"
          : "Edit mode OFF - Content is locked";
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Export for module system
export { initializeApp, setupContentLoading, setupEditMode };
