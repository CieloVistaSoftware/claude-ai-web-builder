# Website Builder Fixes Log

## 2025-01-06 - Fixed UIController Duplicate Initialization Issue

**Problem:**

- Playwright test "Contextual insert media buttons appear when edit mode is enabled" was failing
- Expected 5 contextual buttons but found 0
- Edit mode toggle was not properly activating due to duplicate event listeners

**Root Cause:**

- `UIController.init()` was being called multiple times (lines 1410, 1428, 1434)
- Each call added duplicate event listeners to the edit mode toggle button
- Multiple conflicting event handlers prevented proper state changes
- No initialization guards were in place

**Solution:**

- Added `isInitialized` and `eventListenersSetup` flags to UIController
- Added initialization guard in `UIController.init()` to prevent duplicate initialization
- Added event listener guard in `setupEventListeners()` to prevent duplicate listeners
- Added console logging for debugging edit mode state changes

**Files Modified:**

- `script.js`: UIController object (lines ~1125-1285)

**Testing:**

- Need to run Playwright test to verify fix works
- Should see 5 contextual insert media buttons when edit mode is enabled
- Edit mode toggle should properly activate/deactivate

## 2025-01-06 - Claude AI Integration Analysis & API Key Configuration

**Claude AI API Key Configuration:**

✅ **CONFIRMED**: Claude AI uses ONLY the `CLAUDE_API_KEY` system environment variable for authentication.

**API Key Loading System (Two-tier approach):**

1. **Environment Loader** (`env-loader.js`):

   - Initializes `window.env` object on page load
   - Contains placeholder for secure server endpoint to fetch API key from system environment
   - Current implementation is client-side only (no server endpoint active)
   - Provides utility functions: `setTemporaryApiKey()`, `clearApiKey()`

2. **Claude AI Helper** (`claude-ai.js` lines 44-66):
   - Checks `window.env.CLAUDE_API_KEY` (populated by env-loader or user input)
   - If API key not found, shows user prompt for temporary session-only key input
   - Temporary keys are stored only in memory and never persisted
   - No hardcoded API keys or alternate authentication methods

**Security Notes:**

- API keys are never persisted client-side (memory-only storage)
- No localStorage, sessionStorage, or cookies used for API key storage
- Server endpoint implementation is commented out in `env-loader.js` (ready for production)
- All temporary keys are cleared on page refresh

**Site-Content.JSON Integration:**

✅ **CONFIRMED**: Claude AI is specifically designed to work with `site-content.json`.

**How Claude AI Knows About site-content.json:**

1. **System Prompt Instructions** (lines 15, 145 in `claude-ai.js`):

   - Base system prompt: "You are an AI assistant helping to modify website content stored in JSON format. When the user asks you to change content, provide specific changes to make to the site-content.json file."
   - Extended prompt: "Your primary task is to help modify website content stored in the site-content.json file."

2. **Content Context Provision** (lines 127-132):

   - Current `window.siteContentData` is sent as context to Claude API
   - If not available, falls back to loading from `./site-content.json` file directly
   - Full content structure is included in every API request

3. **Change Application Process** (lines 490-580):
   - Claude responses are parsed for JSON content
   - Changes are applied recursively to `window.siteContentData`
   - Modified content triggers re-rendering via `renderSiteContent()`
   - UI shows confirmation dialog before applying changes

**Site Content Loading Process:**

- `index.html` loads `site-content.json` via fetch() on page load
- Content stored globally as `window.siteContent` and `window.siteContentData`
- Page title, meta tags, and UI are rendered from this JSON data
- Claude AI monitors and modifies this global content object

**Files Involved:**

- `claude-ai.js`: Complete Claude AI integration logic and API key validation
- `env-loader.js`: Environment variable loading system and temporary key management
- `site-content.json`: Website content data structure (191 lines)
- `index.html`: Initial content loading from JSON file, includes both env-loader.js and claude-ai.js
- `script.js`: Content rendering and UI management

**Security Notes:**

- API key is only retrieved from system environment variable or temporary user input
- Two-tier security: env-loader.js manages environment loading, claude-ai.js validates and uses keys
- Temporary session keys are memory-only and not persisted anywhere
- No hardcoded API keys, localStorage, sessionStorage, or cookie storage found
- All API key handling code reviewed - no alternate authentication methods exist

## 2025-01-06 - Fixed: Missing showApiKeyConfigurationUI Method

**Problem**

- `claude-ai.js:447` error: `this.showApiKeyConfigurationUI is not a function`
- Method was being called in `handleUserMessage` but not defined
- Caused Claude AI panel to crash when no API key was configured

**Solution**

- Added missing `showApiKeyConfigurationUI()` method to `ClaudeAIHelper` class
- Method displays user-friendly configuration instructions
- Includes links to Anthropic Console and retry functionality
- Provides graceful error handling and clear setup guidance

**Result**

- ✅ Claude AI panel no longer crashes on missing API key
- ✅ Users get clear instructions for API key setup
- ✅ Professional error handling with retry options
- ✅ Maintains functionality while gracefully handling missing configuration
