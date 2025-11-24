# IGNORE npm run compile - Use This Instead

## The package.json has been updated, but if npm still can't find it, just run these commands:

### Option 1: Use SETUP.bat (Easiest)
```
Double-click SETUP.bat in this folder
```

It will do everything automatically.

### Option 2: Manual Commands
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

### Option 3: Use the new npm scripts
The package.json now has simpler scripts:
```bash
npm run compile-client
npm run compile-server
```

## Verify Success

After running any option above, check for these files:
- `client\out\extension.js` ✓
- `server\out\server.js` ✓

## Then Launch

1. Open folder in VS Code
2. Press F5
3. New window opens
4. In new window, open: C:\Users\jwpmi\Downloads\AI\wb
5. Test it!

## No More "npm run compile" Errors!

Just use SETUP.bat or the manual commands above.
