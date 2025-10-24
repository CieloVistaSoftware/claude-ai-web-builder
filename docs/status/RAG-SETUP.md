# 🚀 WB RAG Assistant - Quick Setup

## ⚡ Quick Start (3 Steps)

### Step 1: Set Your API Key

**Option A: Create .env file (Recommended)**
```bash
# Copy the example file
copy .env.example .env

# Edit .env and add your key:
ANTHROPIC_API_KEY=your-actual-api-key-here
```

**Option B: Set environment variable**

*Windows (PowerShell):*
```powershell
$env:ANTHROPIC_API_KEY="your-api-key-here"
```

*Windows (Command Prompt):*
```cmd
set ANTHROPIC_API_KEY=your-api-key-here
```

*Mac/Linux:*
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

### Step 2: Build Knowledge Base
```bash
npm run build:kb
```

### Step 3: Launch RAG Server
```bash
npm run rag
```

That's it! Open: **http://localhost:8080/wb-rag-assistant.html**

## 📋 What Just Happened?

1. ✅ **rag-server.js** - Express server that proxies Claude API calls (fixes CORS)
2. ✅ **wb-rag-assistant.html** - Updated to use the proxy server
3. ✅ **package.json** - Added `npm run rag` command

## 🔑 Get Your API Key

1. Go to: https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new key
5. Copy and use it in Step 1 above

## 🐛 Troubleshooting

### "Failed to fetch" error
→ Make sure the server is running: `npm run rag:server`

### "API error: 401"
→ Set your ANTHROPIC_API_KEY (see Step 1)

### "Knowledge base not found"
→ Run: `npm run build:kb`

## 📝 All Commands

| Command | Description |
|---------|-------------|
| `npm run build:kb` | Build knowledge base only |
| `npm run rag` | Build KB + start server |
| `npm run rag:server` | Just start server (KB already built) |

## 🎯 How It Works

```
Browser → rag-server.js → Claude API
   ↓
wb-rag-assistant.html
   ↑
knowledge-base.json
```

The server acts as a proxy to avoid CORS issues when calling Claude API from the browser.

## 🎉 You're Ready!

Now you can chat with your AI assistant that knows everything about your WB Framework! 🚀
