# Phase 2: wb-base Execution Guide

**Time:** 2-3 hours  
**Difficulty:** Medium  
**Status:** All materials ready  

---

## 9 Steps to Complete Phase 2 wb-base

### Step 1: Backup Original

```bash
cd C:\Users\jwpmi\Downloads\AI\wb\components\wb-base
copy wb-base.js wb-base.BACKUP.js
```

### Step 2: Clean wb-base.js

**Open:** `wb-base/wb-base.js`

**REMOVE:** These sections:
```javascript
// ❌ DELETE: WBDemoBase class (entire class, ~40 lines)
class WBDemoBase extends WBBaseComponent {
    constructor() {
        super();
        // ... all demo code
    }
    // ... rest of class
}

// ❌ DELETE: Auto-registration of WBDemoBase
if (!customElements.get('wb-demo-base')) {
    customElements.define('wb-demo-base', WBDemoBase);
}

// ❌ DELETE: Claude Logger initialization (entire _initClaudeLogger function, ~60 lines)
WBBaseComponent._initClaudeLogger = (() => {
    // ... entire function
})();

// ❌ DELETE: Event log injection function (entire function, ~20 lines)
async function injectEventLogTabIfEnabled() {
    // ... entire function
}
let _eventLogTabInjected = false;
```

**KEEP:** Everything else (WBBaseComponent and utilities)

**Result:** File should be ~200 lines (down from 400+)

---

### Step 3: Create wb-demo-base.js

**Create new file:** `wb-base/wb-demo-base.js`

**Copy this content:**

```javascript
/**
 * WBDemoBase - Demo extension of WBBaseComponent
 */

import WBBaseComponent from './wb-base.js';

class WBDemoBase extends WBBaseComponent {
  constructor() {
    super();
    this._message = 'WBBaseComponent is working!';
  }

  get message() {
    return this._message;
  }

  set message(val) {
    if (this._message !== val) {
      this._message = val;
      this._render();
    }
  }

  _render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <div class="demo-base-message">${this._message}</div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._render();
    this.logInfo('WBDemoBase connected', { component: 'WBDemoBase' });
  }
}

if (!customElements.get('wb-demo-base')) {
  customElements.define('wb-demo-base', WBDemoBase);
}

export { WBDemoBase };
export default WBDemoBase;
```

---

### Step 4: Create wb-base-logger-init.js

**Create new file:** `wb-base/wb-base-logger-init.js`

**Copy this content:**

```javascript
/**
 * Auto-initialize Claude Logger in demo mode
 * Only loads when URL contains "demo" or running on localhost
 */

function initClaudeLogger() {
  if (window._claudeLoggerInitialized) return;
  
  const isDemoMode = 
    window.location.pathname.toLowerCase().includes('demo')
    || document.title.toLowerCase().includes('demo')
    || window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1';
  
  if (!isDemoMode) return;
  
  window._claudeLoggerInitialized = true;
  
  const loadLogger = () => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/components/wb-claude-logger/wb-claude-logger/wb-claude-logger.js?v=' + Date.now();
    
    script.onload = () => {
      if (!document.querySelector('wb-claude-logger')) {
        const logger = document.createElement('wb-claude-logger');
        logger.setAttribute('use-backend', 'true');
        document.body.appendChild(logger);
      }
    };
    
    script.onerror = () => console.warn('Claude Logger not available');
    document.head.appendChild(script);
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLogger);
  } else {
    loadLogger();
  }
}

if (typeof window !== 'undefined') {
  initClaudeLogger();
}

export { initClaudeLogger };
```

---

### Step 5: Add JSDoc to wb-base.js

Add this comment block before the WBBaseComponent class:

```javascript
/**
 * WBBaseComponent - Base class for all WB Web Components
 * 
 * Provides:
 * - Light DOM by default (no Shadow DOM overhead)
 * - Event log state management
 * - Theme/mode handling
 * - Attribute reflection utilities
 * - Error reporting
 * - Component registration
 * 
 * @example
 * ```javascript
 * class MyButton extends WBBaseComponent {
 *   static useShadow = false;
 *   
 *   connectedCallback() {
 *     super.connectedCallback();
 *     const button = document.createElement('button');
 *     button.textContent = 'Click me';
 *     this.appendChild(button);
 *   }
 * }
 * customElements.define('my-button', MyButton);
 * ```
 */
class WBBaseComponent extends HTMLElement {
  // ... rest of class
}
```

---

### Step 6: Run Tests

```bash
cd C:\Users\jwpmi\Downloads\AI\wb\components

npx playwright test wb-base/wb-base.playwright.spec.js
```

**Expected:** ✅ All 20+ tests pass

**If tests fail:**
- Read the error message
- Find the failing test
- Check your code
- Fix and re-run

---

### Step 7: Verify Dependent Components

Test that components depending on wb-base still work:

```bash
npx playwright test wb-button/wb-button.playwright.spec.js
npx playwright test wb-input/wb-input.playwright.spec.js
```

Should still pass ✅

---

### Step 8: Update claude.md

**File:** `wb-base/✅ claude.md`

Change this line:
```markdown
**Status**: 🟡 IN PROGRESS
```

To this:
```markdown
**Status**: ✅ DONE
```

Add this section:
```markdown
## Phase 2 Refactoring (December 1, 2025)

✅ Separated concerns into multiple files:
  - wb-base.js (core class only)
  - wb-demo-base.js (demo functionality)
  - wb-base-logger-init.js (auto-logger initialization)

✅ Added comprehensive tests (20+ tests all passing)

✅ Code cleaned and optimized
```

---

### Step 9: Update wb-base.md

Add this section at the top of `wb-base/wb-base.md`:

```markdown
# WBBaseComponent v2.0

**Status:** ✅ Production Ready (Phase 2 Complete)  
**Light DOM:** Yes (default, faster and simpler)  
**Shadow DOM:** Optional (use `static useShadow = true` if needed)  

## Quick Start

```javascript
import WBBaseComponent from './wb-base.js';

class MyComponent extends WBBaseComponent {
  connectedCallback() {
    super.connectedCallback();
    const button = document.createElement('button');
    button.textContent = 'Click me';
    this.appendChild(button);
  }
}

customElements.define('my-component', MyComponent);
```
```

---

## Verification Checklist

Before declaring Phase 2 wb-base complete:

```
✅ wb-base.js is cleaned (no demo/logger code)
✅ wb-demo-base.js created and imports correctly
✅ wb-base-logger-init.js created and works
✅ All 20+ tests pass
✅ Dependent components still work
✅ JSDoc comments added
✅ claude.md status changed to ✅ DONE
✅ wb-base.md updated with v2.0 info
```

---

## Troubleshooting

### Tests timeout
Add to failing test:
```javascript
await page.waitForFunction(() => customElements.get('test-component'), { timeout: 5000 });
```

### Import error
Check paths: `import WBBaseComponent from './wb-base.js';`

### Components broken
- Verify no demo code left in wb-base.js
- Check exports at end of file
- Re-run tests to verify

---

## Next Phase

Once Phase 2 wb-base ✅ DONE:

Start Phase 2 color utilities:
1. wb-color-harmony.js
2. wb-color-mapper.js
3. wb-color-transformer.js
4. wb-color-utils.js

Same process: audit, refactor, test, update docs.

---

**Ready? Start with Step 1: Backup!**
