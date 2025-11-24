# 🤖 WB Claude Logger Component

Quick issue logging for all WB component demos.

## ✨ Features

- **Floating Button** - Unobtrusive 📝 button in any corner
- **Quick Logging** - Just describe what happened
- **Optional Fields** - Add Expected/Actual when needed
- **Auto-Detection** - Component name from page title/URL
- **Dual Mode** - localStorage or backend saving
- **Shadow DOM** - No style conflicts
- **Zero Dependencies** - Pure vanilla web component

## 🚀 Quick Start

Add these **2 lines** to ANY demo file:

```html
<!-- At the end of <body> -->
<script type="module" src="../../wb-claude-logger.js"></script>
<wb-claude-logger></wb-claude-logger>
```

That's it! ✅

## 📋 Examples

### Basic Usage
```html
<wb-claude-logger></wb-claude-logger>
```

### Custom Position
```html
<wb-claude-logger position="bottom-left"></wb-claude-logger>
<wb-claude-logger position="top-right"></wb-claude-logger>
```

### With Backend
```html
<wb-claude-logger use-backend="true"></wb-claude-logger>
```

## 🎯 Attributes

| Attribute | Default | Options |
|-----------|---------|---------|
| `position` | `"bottom-right"` | `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `backend-url` | `http://localhost:3000/api/log` | Any valid URL |
| `use-backend` | `false` | `true` / `false` |

## 💾 Storage Options

### localStorage (Default)
- No setup required
- Access in DevTools: Application → Local Storage
- Keys: `wb-claude-logs`, `wb-claude-logs-markdown`

### Backend (Optional)
```bash
npm install
npm start
```

Issues save to `claude.md` file.

## 📝 Output Format

```markdown
## 📝 11/21/2025, 10:30:45 PM

**Component:** wb-button

### Description

Button doesn't respond on rapid clicks

**Expected:** Should handle each click independently  
**Actual:** Button freezes after 3rd click  
**File:** `components/wb-button/wb-button.js`  

---
```

## 🔌 Events

```javascript
document.querySelector('wb-claude-logger')
    .addEventListener('issue-logged', (e) => {
        console.log('Logged:', e.detail);
    });
```

## 🛠️ Backend Setup

```bash
cd components/wb-claude-logger
npm install
node server.js
```

Server: `http://localhost:3000`

## 🔄 Add to All Demos

### Option 1: Manual
Copy to each demo file

### Option 2: Build Script
```bash
node add-logger-to-demos.js
```

### Option 3: Base Component
Add to `WBReactiveBase.connectedCallback()`

## 🧪 Testing

1. Open demo with logger
2. Click 📝 button
3. Log an issue
4. Check localStorage or `claude.md`

## 📊 Access Logs

```javascript
const logs = JSON.parse(localStorage.getItem('wb-claude-logs') || '[]');
const markdown = localStorage.getItem('wb-claude-logs-markdown');
```

## 🔧 Troubleshooting

**Button doesn't appear:**
- Check script path
- Verify component tag added

**Backend not connecting:**
- Run `node server.js`
- Check URL is correct
- Look for console errors

## 🚀 Best Practices

1. Include in all demos
2. Use backend for production
3. Write clear descriptions
4. Review logs regularly

---

**Version:** 1.0.0  
**Part of WB Framework**
