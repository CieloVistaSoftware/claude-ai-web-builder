# F5 Not Working - Troubleshooting

## Quick Checks

### 1. Are you in the RIGHT folder in VS Code?

**Check the window title - it should say:**
```
wb-component-navigator - Visual Studio Code
```

**NOT:**
```
wb - Visual Studio Code  (WRONG - this is your framework folder)
```

**If wrong folder:**
```bash
cd C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator
code .
```

---

### 2. Do the compiled files exist?

Check if these files exist:
- `client\out\extension.js`
- `server\out\server.js`

**Open terminal in VS Code (Ctrl+`) and run:**
```bash
dir client\out\extension.js
dir server\out\server.js
```

**If files don't exist, compile again:**
```bash
cd client
npx tsc
cd ..\server
npx tsc
cd ..
```

---

### 3. What happens when you press F5?

Tell me exactly what you see:

**A) Nothing happens at all?**
- Check if F5 is assigned to something else
- Try: Run → Start Debugging from menu

**B) Error message appears?**
- Copy the exact error and tell me

**C) Terminal/console opens but no new window?**
- Check Debug Console (Ctrl+Shift+Y)
- Look for error messages

**D) Same window refreshes instead of new window opening?**
- The debug configuration might be wrong

---

## Detailed Diagnostics

### Check 1: Verify VS Code recognizes it as an extension

In VS Code, look at the left sidebar. Do you see a "Run and Debug" icon (play button with bug)?

**If YES:**
1. Click the Run and Debug icon (Ctrl+Shift+D)
2. At the top, dropdown should show: "Launch Extension"
3. Click the green play button next to it

**If NO:**
- VS Code doesn't recognize this as an extension project
- Make sure you opened wb-component-navigator folder, not wb folder

---

### Check 2: Look at the Debug Console

1. View → Debug Console (or Ctrl+Shift+Y)
2. Press F5
3. Look for errors in the Debug Console

**Common errors:**

**Error: "Cannot find module"**
```bash
# Solution: Install dependencies
cd client
npm install
cd ..\server
npm install
cd ..
```

**Error: "ENOENT: no such file or directory"**
```bash
# Solution: Recompile
cd client
npx tsc
cd ..\server
npx tsc
cd ..
```

---

### Check 3: Try Alternative Launch Method

Instead of F5, try:
1. View → Command Palette (Ctrl+Shift+P)
2. Type: "Debug: Start Debugging"
3. Select: "Launch Extension"

Does this work?

---

### Check 4: Verify Extension Files

Run this in terminal:
```bash
# Check all required files exist
dir /s /b *.json
dir client\out
dir server\out
```

**You should see:**
- Multiple package.json files
- client\out\extension.js
- server\out\server.js
- .vscode\launch.json

**If any are missing, the extension won't launch.**

---

## Manual Test: Launch Extension Without F5

Try this alternative:

1. Open Command Palette (Ctrl+Shift+P)
2. Type: "Tasks: Run Task"
3. Type: "npm: watch"
4. This starts compilation in watch mode

Then:
1. View → Command Palette (Ctrl+Shift+P)
2. Type: "Debug: Select and Start Debugging"
3. Choose: "Launch Extension"

Does this work?

---

## Create a Simple Test Extension

Let's verify VS Code extension debugging works at all:

1. Create a test file: `test.js` in wb-component-navigator folder
2. Add this code:
```javascript
console.log('test');
```
3. Press F5

**Does ANY debug window open?**

If NO, your VS Code might have a configuration issue.

---

## Check VS Code Extensions

Make sure you don't have conflicting extensions:

1. View → Extensions (Ctrl+Shift+X)
2. Look for any extensions that might interfere
3. Try disabling all extensions temporarily
4. Restart VS Code
5. Try F5 again

---

## Nuclear Option: Reinstall Extension Dependencies

```bash
# Delete everything
rmdir /S /Q node_modules
rmdir /S /Q client\node_modules
rmdir /S /Q server\node_modules
rmdir /S /Q client\out
rmdir /S /Q server\out

# Reinstall everything
npm install
cd client
npm install
npx tsc
cd ..\server
npm install
npx tsc
cd ..

# Close VS Code completely and reopen
# Then try F5
```

---

## Tell Me What You See

Please run these commands and tell me the results:

```bash
# 1. What directory are you in?
cd

# 2. Does launch.json exist?
type .vscode\launch.json

# 3. Do compiled files exist?
dir client\out
dir server\out

# 4. What happens in Debug Console when you press F5?
# (View → Debug Console, then press F5, copy any output)
```

---

## Alternative: Use a PowerShell Script

I can create a PowerShell script that launches the extension directly without F5. Would you like me to do that?

---

## What Exactly Happens?

When you press F5, tell me **EXACTLY** what you see:

1. Does any window flash briefly?
2. Does the status bar at bottom change?
3. Does terminal open?
4. Do you see any error messages anywhere?
5. Does absolutely nothing happen?

This will help me figure out what's wrong.
