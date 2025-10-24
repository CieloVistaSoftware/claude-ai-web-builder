# VS Code IntelliSense Setup for wb-btn

## If automatic setup isn't working, try manual setup:

### Method 1: Global User Settings
1. Open VS Code
2. Press `Ctrl+Shift+P` (Command Palette)
3. Type: "Preferences: Open User Settings (JSON)"
4. Add this to your user settings:

```json
{
  "html.customData": [
    "C:\\Users\\jwpmi\\Downloads\\AI\\wb\\components\\wb-button\\html.html-data.json"
  ]
}
```

### Method 2: Workspace Settings
1. In VS Code, go to File → Preferences → Settings
2. Click "Workspace" tab
3. Search for "html.customData"
4. Click "Edit in settings.json"
5. Add the path to our custom data file

### Method 3: Extension Installation
If custom data isn't working, try installing:
- "HTML CSS Support" extension
- "IntelliSense for CSS class names in HTML" extension

### Method 4: Test Simple HTML
Create a new file with just this:
```html
<wb-btn variant="">test</wb-btn>
```

Then try Ctrl+Space between the quotes.

### Method 5: Check VS Code Version
- VS Code version should be 1.60+ for best custom data support
- Update VS Code if needed

### Troubleshooting:
1. Check VS Code Output Panel (View → Output → HTML Language Server)
2. Look for any error messages
3. Try restarting VS Code completely
4. Check if the file paths are correct