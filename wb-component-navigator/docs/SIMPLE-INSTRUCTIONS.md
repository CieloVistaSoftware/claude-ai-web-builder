
# SUPER SIMPLE WB COMPONENT NAVIGATOR INSTALL

## Easiest Solution: Use SETUP.bat or MANUAL-INSTALL.bat

### Option 1: Double-click SETUP.bat
Runs all npm install and compile steps automatically.

### Option 2: Double-click MANUAL-INSTALL.bat
Copies the extension to VS Code's extensions folder automatically.

### Option 3: Manual Commands
```bash
# 1. Install root dependencies
npm install

# 2. Install & compile client
cd client
npm install
npx tsc
cd ..

# 3. Install & compile server
cd server
npm install
npx tsc
cd ..
```

### Option 4: Use npm scripts
```bash
npm run compile-client
npm run compile-server
```

## Verify Success

After running any option above, check for these files:
- `client\out\extension.js` ✓
- `server\out\server.js` ✓

## Launch & Test

1. Open folder in VS Code
2. Press F5
3. New window opens
4. In new window, open: `C:\Users\jwpmi\Downloads\AI\wb`
5. Test it!

## No More "npm run compile" Errors!

Just use SETUP.bat, MANUAL-INSTALL.bat, or the manual commands above.

---

## If 'code' Command Isn't Installed

### Easiest Solution: Just Copy the Folder

1. Double-click: MANUAL-INSTALL.bat
	- Copies extension to VS Code's extensions folder automatically.
2. Restart VS Code (close all windows)
3. Open your WB folder: `C:\Users\jwpmi\Downloads\AI\wb`
4. Look for "WB COMPONENTS" in the left sidebar!

---

## Manual Install Steps

If the script doesn't work, do this by hand:

1. Open Extensions Folder
	- Press **Windows+R**, paste: `%USERPROFILE%\.vscode\extensions`
2. Copy Extension Folder
	- Copy: `C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator`
	- Paste into extensions folder
3. Restart VS Code
4. Open WB folder
	- `C:\Users\jwpmi\Downloads\AI\wb`
5. Look for "WB COMPONENTS" in sidebar!

---

## Verify It Worked

1. **Check Extensions:**
	- View → Extensions (Ctrl+Shift+X)
	- Look for "WB Component Navigator"
	- Should show as installed
2. **Check Output:**
	- View → Output (Ctrl+Shift+U)
	- Dropdown: Select "WB Component Navigator"
	- Should see: "Indexed X components"
3. **Check Sidebar:**
	- Left sidebar should show "WB COMPONENTS"
	- Expand to see your components
4. **Test It:**
	- Open index.html
	- Ctrl+Click on `<wb-button>`
	- Should open wb-button.js

---

## Still Not Working?

1. Make sure you opened the WB folder (`C:\Users\jwpmi\Downloads\AI\wb`)
2. NOT the extension folder
3. Wait 10 seconds for extension to activate
4. Check: View → Output → "WB Component Navigator" for errors

---

## Summary

**Easiest way:**
1. Run: `MANUAL-INSTALL.bat`
2. Close VS Code
3. Open your WB folder
4. See "WB COMPONENTS" in sidebar!

**No code command needed!**
**No complicated setup!**
**Just works!** ✅
