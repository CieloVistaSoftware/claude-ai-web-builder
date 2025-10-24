// @ts-nocheck
// main.js - Main entry point for the Website Builder application
// =============================================================================
// MODULAR WEBSITE BUILDER - ENTRY POINT
// =============================================================================

// Import core modules
import WebsiteState from "./core/state/WebsiteState";
import ThemeManager from "./core/theme/ThemeManager";
import LayoutManager from "./core/layout/LayoutManager";
import EditModeManager from "./core/edit/EditModeManager";
import MediaManager from "./core/edit/MediaManager";
import SaveLoadManager from "./core/save/SaveLoadManager";
import UIController from "./core/UIController";
import WebsiteBuilder from "./core/WebsiteBuilder";

// Import components
import ControlPanel from "./components/ControlPanel";

// =============================================================================
// LEGACY COMPATIBILITY LAYER
// =============================================================================

// Make key modules globally available
window.WebsiteState = WebsiteState;
window.ThemeManager = ThemeManager;
window.LayoutManager = LayoutManager;
window.EditModeManager = EditModeManager;
window.MediaManager = MediaManager;
window.SaveLoadManager = SaveLoadManager;
window.UIController = UIController;

// Make key functions globally available for backward compatibility
window.saveWebsiteWithTheme = () => SaveLoadManager.saveWebsite();
window.openMediaPicker = (target, position) => MediaManager.openMediaPicker(target, position);
window.showAllInsertMediaButtons = () => MediaManager.showAllInsertMediaButtons();
window.updateAllInsertMediaButtons = () => {
  const state = WebsiteState.getState();
  MediaManager.updateInsertMediaButtons(state.isEditMode);
};

// =============================================================================
// APPLICATION STARTUP
// =============================================================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', (): any => {
  WebsiteBuilder.init();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading, event listener will handle it
} else {
  // DOM is already loaded
  WebsiteBuilder.init();
}

console.log('🏗️ Modular Website Builder architecture loaded!');

// =============================================================================
// BENEFITS OF THIS REFACTORED ARCHITECTURE:
// =============================================================================
/*
✅ SEPARATION OF CONCERNS:
   - Each module has a single responsibility
   - Clear boundaries between UI, business logic, and data
   - State management separated from presentation

✅ MAINTAINABILITY:
   - Easy to modify individual features without affecting others
   - Clear module structure makes debugging easier
   - Consistent patterns across all modules

✅ TESTABILITY:
   - Each module can be tested independently
   - Pure functions without side effects
   - Mocked dependencies for unit testing

✅ SCALABILITY:
   - Easy to add new themes, layouts, or features
   - Modular structure supports growth
   - Clear extension points for new functionality

✅ REUSABILITY:
   - Modules can be reused in other projects
   - Theme management can be extracted as a library
   - UI patterns are consistent and reusable

✅ PERFORMANCE:
   - Single state management reduces redundant operations
   - Event listeners are efficiently managed
   - Minimal DOM manipulation with targeted updates

✅ DEVELOPER EXPERIENCE:
   - Clear API boundaries
   - Self-documenting code structure
   - Consistent naming conventions
   - Comprehensive error handling
*/
