export {};
// @ts-nocheck
// Theme Bridge - Cross-frame communication for theme changes
// This allows theme changes to propagate across iframes regardless of hierarchy

(function () {
  // A unique identifier for this script instance to prevent feedback loops
  const instanceId = Math.random().toString(36).substring(2, 15);

  // Store information about our parent frame
  const hasParent = window !== window.parent;

  // Register message event handler
  window.addEventListener('message', function (event) {
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      // Verify this is a theme-bridge message and not from this instance
      if (data && data.type === 'wb-theme-change' && data.instanceId !== instanceId) {
        console.log(`Received theme change message: ${data.theme} from external source`);

        // Apply the theme using the global method
        if (window.applyWbTheme) {
          window.applyWbTheme(data.theme);
        }

        // Forward to any child frames (except the one that sent it)
        if (data.forward !== false) {
          forwardThemeToFrames(data.theme, event.source);
        }
      }
    } catch (err) {
      // Silently ignore parsing errors from unrelated messages
    }
  });

  // Listen for local theme changes
  document.addEventListener('wb-theme-changed', function (event) {
    if (event.detail && event.detail.theme) {
      // Forward the theme change to all frames
      broadcastThemeChange(event.detail.theme);
    }
  });

  // Send theme change to all frames
  function broadcastThemeChange(theme): any {
    // Send to parent frame if we have one
    if (hasParent) {
      try {
        window.parent.postMessage(JSON.stringify({
          type: 'wb-theme-change',
          theme: theme,
          instanceId: instanceId,
          forward: true
        }), '*');
      } catch (err) {
        console.warn('Failed to send theme to parent frame', err);
      }
    }

    // Send to all child frames
    forwardThemeToFrames(theme);
  }

  // Forward theme to all child frames (except the sender)
  function forwardThemeToFrames(theme, sender = null): any {
    try {
      const frames = document.querySelectorAll('iframe');
      frames.forEach(frame => {
        if (frame.contentWindow && frame.contentWindow !== sender) {
          try {
            frame.contentWindow.postMessage(JSON.stringify({
              type: 'wb-theme-change',
              theme: theme,
              instanceId: instanceId,
              forward: true
            }), '*');
          } catch (frameErr) {
            console.warn('Failed to send theme to child frame', frameErr);
          }
        }
      });
    } catch (err) {
      console.warn('Error broadcasting theme to frames', err);
    }
  }

  // Immediately broadcast the current theme when loaded
  setTimeout(function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    broadcastThemeChange(currentTheme);
  }, 1000); // Wait a bit to make sure frames are loaded

  console.log('Theme-Bridge initialized for cross-frame theme sync');
})();
