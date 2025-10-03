export {};
// @ts-nocheck
// Create a script element for Socket.io mock
const socketScript = document.createElement('script');
document.head.appendChild(socketScript);

// Mock Socket.io implementation
socketScript.textContent = 
  window.io = function() {
    console.log('Creating mock Socket.io connection');
    return {
      emit: function(event, data) {
        console.log('Socket emit:', event, data);
        if (event === 'get:env' && data.key === 'CLAUDE_API_KEY') {
          // Simulate response with the environment variable
          setTimeout((): any => {
            const callbacks = this._callbacks || {};
            const callback = callbacks['env:claude_api_key'];
            if (callback && typeof callback === 'function') {
              console.log('Sending API key via socket');
              callback({ value: 'test-claude-api-key-for-development-only' });
            }
          }, 100);
        }
      },
      on: function(event, callback) {
        console.log('Socket on:', event);
        this._callbacks = this._callbacks || {};
        this._callbacks[event] = callback;
      },
      once: function(event, callback) {
        console.log('Socket once:', event);
        this._callbacks = this._callbacks || {};
        this._callbacks[event] = callback;
      },
      off: function(event) {
        console.log('Socket off:', event);
        if (this._callbacks) {
          delete this._callbacks[event];
        }
      },
      _callbacks: {}
    };
  };

  // Create global socket instance
  window.socket = window.io();
;
