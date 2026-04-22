// Theme Event System - Decoupled communication between components
class ThemeEventBus {
    static dispatch(eventType, data) {
        const event = new CustomEvent(eventType, {
            detail: data,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    static listen(eventType, callback) {
        document.addEventListener(eventType, callback);
    }
}

// Theme event types
window.ThemeEvents = {
    COLOR_CHANGED: 'theme:color-changed',
    THEME_APPLIED: 'theme:theme-applied', 
    LAYOUT_CHANGED: 'theme:layout-changed',
    EDIT_MODE_CHANGED: 'theme:edit-mode-changed',
    SAVE_REQUESTED: 'theme:save-requested',
    RESET_REQUESTED: 'theme:reset-requested'
};

window.ThemeEventBus = ThemeEventBus;