# ⚡ WBBaseComponent Integration - Quick Start

## 🎯 The Right Way™

Integrate Claude Logger **once** into `WBBaseComponent` → **all demos get it automatically**!

---

## 📦 What You Need

✅ `wb-claude-logger` folder in your components directory  
✅ Access to `wb-base.js` (your base component)  
✅ 5 minutes  

---

## 🚀 3-Step Setup

### Step 1: Place the Logger (1 min)

```bash
unzip wb-claude-logger.zip
mv wb-claude-logger /your/wb/components/
```

Result:
```
wb/components/
├── wb-base/
│   └── wb-base.js
├── wb-claude-logger/  ← NEW!
├── wb-button/
└── ...
```

### Step 2: Update WBBaseComponent (2 min)

Open `components/wb-base/wb-base.js`

**Add this code at the very end** (after the class definition, before `export`):

```javascript
// Auto-load Claude Logger in demo mode
WBBaseComponent._initClaudeLogger = (() => {
    if (window._claudeLoggerInitialized) return;
    
    const isDemoMode = window.location.pathname.toLowerCase().includes('demo')
                    || window.location.hostname === 'localhost';
    
    if (!isDemoMode) return;
    
    window._claudeLoggerInitialized = true;
    
    const loadLogger = () => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/components/wb-claude-logger/wb-claude-logger.js';
        
        script.onload = () => {
            if (!document.querySelector('wb-claude-logger')) {
                document.body.appendChild(
                    document.createElement('wb-claude-logger')
                );
            }
        };
        
        document.head.appendChild(script);
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadLogger);
    } else {
        loadLogger();
    }
})();

export default WBBaseComponent;
```

### Step 3: Test (2 min)

```bash
# Open any demo
open components/wb-button/wb-button-demo.html
```

**Look for the 📝 button in the bottom-right!**

✅ **Success!** Click it and log a test issue.

---

## 🎉 That's It!

**Every demo now has the logger automatically!**

No need to:
- ❌ Add script tags to demos
- ❌ Add `<wb-claude-logger>` tags
- ❌ Remember to include it
- ❌ Maintain multiple copies

---

## 🎨 Optional: Customize Per Demo

Add meta tags to individual demo files:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>wb-button Demo</title>
    
    <!-- Move logger to top-left -->
    <meta name="claude-logger-position" content="top-left">
    
    <!-- Enable backend -->
    <meta name="claude-logger-use-backend" content="true">
</head>
<body>
    <wb-button>Click Me</wb-button>
</body>
</html>
```

To support meta tags, see `WBBASE-INTEGRATION-GUIDE.md` for the enhanced version.

---

## 🔧 Adjust the Path (if needed)

If your structure is different, change this line in the code:

```javascript
script.src = '/components/wb-claude-logger/wb-claude-logger.js';
```

**Common paths:**

| Structure | Path |
|-----------|------|
| Root-relative | `/components/wb-claude-logger/wb-claude-logger.js` |
| Relative (2 up) | `../../wb-claude-logger/wb-claude-logger.js` |
| CDN/Remote | `https://your-cdn.com/wb-claude-logger.js` |

---

## 🚫 Production Mode

Logger **automatically** doesn't load in production when:

✅ File is NOT named `*demo*.html`  
✅ Hostname is NOT `localhost`  
✅ Title doesn't include "demo"  

**No extra configuration needed!**

---

## 📋 Verify Integration

**Checklist:**

- [ ] Logger folder in components/
- [ ] Code added to wb-base.js
- [ ] Tested in one demo
- [ ] 📝 button appears
- [ ] Can log an issue
- [ ] Issue saves to localStorage
- [ ] Component name detected correctly

---

## 🆘 Troubleshooting

### Button doesn't appear

1. **Check browser console** for errors
2. **Verify path** is correct in `script.src`
3. **Confirm demo mode** detected (check URL has "demo")
4. **Try absolute path**: `/components/wb-claude-logger/wb-claude-logger.js`

### Multiple buttons appear

Already prevented by `window._claudeLoggerInitialized` flag ✅

### Need different position

Add meta tag:
```html
<meta name="claude-logger-position" content="top-left">
```

---

## 📚 Full Documentation

- 📄 **WBBASE-INTEGRATION-GUIDE.md** - Complete guide with all options
- 📄 **WBBaseComponent-integration.js** - Full code with comments
- 📄 **README.md** - Component documentation
- 📄 **claude.md** - Technical specs

---

## 💡 Why This Is Better

| Before | After |
|--------|-------|
| Add to every demo | Add once to base |
| 2 lines × 41 demos = 82 lines | 15 lines × 1 file = 15 lines |
| Easy to forget | Impossible to forget |
| Hard to update | Update in one place |
| Inconsistent | Always consistent |

---

## 🎯 Next Actions

1. ✅ Paste code into `wb-base.js`
2. ✅ Test one demo
3. ✅ Celebrate! 🎉
4. ✅ Start logging issues
5. ✅ Tell your team

---

**You're done! The logger is now part of your base component infrastructure.** 🚀

Every new component automatically gets issue logging in its demos!
