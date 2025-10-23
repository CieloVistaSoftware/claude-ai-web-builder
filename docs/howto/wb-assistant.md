# WB Framework AI Assistant - Setup & Usage Guide

**Last Updated**: October 20, 2025  
**Location**: `/wb-assistant.html`  
**Category**: Development Tools

---

## 📋 What is the WB Assistant?

The WB Framework AI Assistant is an intelligent chatbot that helps developers learn and use the WB Framework. It provides:

- 📚 **Documentation answers** - Instant access to framework knowledge
- 💻 **Code examples** - Working code samples for components
- 🎨 **Color system help** - Wave-based harmony system guidance
- ⚡ **How-to guides** - Step-by-step instructions

---

## 🚀 Quick Start

### Option 1: Using Existing Dev Server (Recommended)

The assistant is already set up at the project root as `wb-assistant.html`.

**Start the server:**
```bash
npm run dev
```

**Access the assistant:**
```
http://localhost:8080/wb-assistant.html
```

**That's it!** The assistant is now running.

---

### Option 2: Standalone Server

If you want to run just the assistant without the full dev environment:

```bash
# Simple HTTP server on port 8080
http-server -p 8080 -o /wb-assistant.html
```

---

## 📖 How npm run dev Works

### The Dev Script Breakdown

Looking at `package.json`, the `dev` script is:
```json
"dev": "npm run nuke && npm run wb:build && concurrently \"npm run wb:build:watch\" \"http-server -p 8080 -o /index.html\""
```

**What this does:**

1. **`npm run nuke`** 
   - Kills all Node processes
   - Clears port 8080
   - Ensures clean start

2. **`npm run wb:build`**
   - Builds the wb-website-builder component
   - Compiles necessary assets

3. **`concurrently`**
   - Runs multiple commands simultaneously:
   
   **Command 1**: `npm run wb:build:watch`
   - Watches for file changes
   - Rebuilds on changes automatically
   
   **Command 2**: `http-server -p 8080 -o /index.html`
   - Starts HTTP server on port 8080
   - Opens `/index.html` in default browser
   - **Serves ALL files in project root**

### How Files Are Served

The `http-server` package serves the **entire project directory** on port 8080. This means:

- ✅ `http://localhost:8080/index.html` - Main entry point (auto-opens)
- ✅ `http://localhost:8080/wb-assistant.html` - AI Assistant
- ✅ `http://localhost:8080/wb.html` - Alternative entry
- ✅ `http://localhost:8080/components/` - All components
- ✅ `http://localhost:8080/styles/` - All styles
- ✅ **Any file in the project is accessible via its path**

**Key Point**: `http-server` doesn't need configuration - it serves everything in the current directory and subdirectories.

---

## 🎯 Available NPM Scripts

Here are all the relevant server commands:

### Development Scripts

```bash
# Full dev environment (builds + server + watch)
npm run dev

# Safe dev (explicit cleanup, no concurrent watch)
npm run dev:safe

# Simple dev (just server, no build)
npm run dev:simple
```

### Server Only Scripts

```bash
# Serve from /dist folder on port 3000
npm run serve

# Serve from /dist folder on port 8080, open index.html
npm run serve:root
```

### Utility Scripts

```bash
# Kill processes on port 8080
npm run kill-port

# Nuclear option - kill ALL node processes
npm run nuke
```

---

## 📂 File Structure

```
wb/
├── wb-assistant.html          ← AI Assistant (YOU ARE HERE)
├── index.html                 ← Main entry point
├── wb.html                    ← Alternative entry
├── components/                ← All 41 components
├── styles/                    ← Global styles
├── docs/                      ← Documentation
│   └── howto/
│       └── wb-assistant.md    ← This file
└── package.json               ← NPM scripts
```

---

## 🔧 Using the Assistant

### Quick Questions (Pre-made Buttons)

When you first load the assistant, you'll see 4 quick question buttons:
- 📚 "How do I create a new component?"
- 💻 "Show me a button component example"
- 💡 "What is the color harmony system?"
- 📄 "How do events work in WB?"

**Click any button** to instantly ask that question.

### Custom Questions

Type any question in the input field:

**Examples:**
- "How do I use wb-nav?"
- "Show me code for wb-color-harmony"
- "What's the difference between wb-button and wb-btn?"
- "How do I extend WBBaseComponent?"
- "Explain the event system"
- "How do I create a modal?"

### Features

✨ **Markdown Rendering** - Responses are formatted with:
- Syntax-highlighted code blocks
- Bold text in purple
- Inline code snippets
- Proper line breaks

🎨 **Dark Mode** - Easy on the eyes with modern gradient design

🤖 **AI-Powered** - Uses Claude API to generate contextual answers

📚 **Knowledge Base** - 20+ embedded documentation chunks

---

## 🛠️ Troubleshooting

### Port 8080 Already in Use

```bash
# Kill the process using port 8080
npm run kill-port

# Or use the nuclear option
npm run nuke

# Then restart
npm run dev
```

### Assistant Not Loading

**Check if server is running:**
```bash
# Should see "Starting up http-server" message
```

**Verify URL:**
- ✅ Correct: `http://localhost:8080/wb-assistant.html`
- ❌ Wrong: `http://localhost:8080/assistant.html`
- ❌ Wrong: `http://localhost:3000/wb-assistant.html`

### No Response from Assistant

**Check browser console** (F12) for errors:
- CORS errors → Claude API might be blocked
- Network errors → Check internet connection
- 404 errors → File path is wrong

### Styling Issues

**Clear browser cache:**
- Windows: `Ctrl + F5`
- Mac: `Cmd + Shift + R`

---

## 💡 Tips & Best Practices

### 1. Keep It Running
Leave `npm run dev` running in a terminal while developing. It will:
- Auto-rebuild on changes
- Keep the server alive
- Watch for file modifications

### 2. Multiple Terminals
Consider running different servers:
- **Terminal 1**: `npm run dev` (main dev server)
- **Terminal 2**: `npm test` (when testing)
- **Terminal 3**: Additional tasks

### 3. Bookmarks
Bookmark frequently used URLs:
- `http://localhost:8080/wb-assistant.html`
- `http://localhost:8080/index.html`
- `http://localhost:8080/components/wb-[component]/demo.html`

### 4. Ask Specific Questions
The assistant works best with specific questions:
- ✅ "Show me code for wb-nav with vertical layout"
- ✅ "How do I listen for wb:nav-click events?"
- ❌ "Tell me everything about navigation"

### 5. Request Code Examples
When asking questions, explicitly request code:
- "Show me an example of..."
- "Give me code for..."
- "How do I write..."

---

## 🔗 Related Documentation

- **[Getting Started](../setup/START-HERE-FIRST-TIME-SETUP.md)** - First-time setup
- **[Current Status](../status/currentstatus.md)** - Project status
- **[Unified Instructions](../reference/UnifiedInstructions.md)** - All project rules
- **[Component Guide](../component-guides/COMPONENT-GUIDE.md)** - Creating components

---

## 📊 Technical Details

### Technology Stack
- **React 18** - UI framework
- **Lucide Icons** - Icon library (inline SVG fallbacks)
- **Claude API** - AI response generation
- **http-server** - Static file server
- **Babel Standalone** - JSX transpilation in browser

### Knowledge Base
The assistant has 20+ embedded documentation chunks covering:
- Framework overview
- All major components
- Architecture standards
- Color harmony system
- Event patterns
- Testing standards
- Code examples

### API Integration
Uses Claude Sonnet 4 API for intelligent responses:
- Model: `claude-sonnet-4-20250514`
- Max tokens: 1500
- Context-aware responses based on knowledge base

---

## 🎯 Future Enhancements

Potential improvements for the assistant:

1. **Full Documentation Index**
   - Scan all 41 component docs
   - Include actual code from components
   - Add troubleshooting knowledge

2. **File Search**
   - "Show me the wb-button code"
   - "Find the color harmony CSS"
   - Direct file content display

3. **Visual Examples**
   - Inline component demos
   - Live code playgrounds
   - Interactive examples

4. **Export Features**
   - Save code snippets
   - Download examples
   - Share conversations

5. **Advanced Search**
   - Full-text search across all docs
   - Component API search
   - Error message lookup

---

## 📝 Contributing

Want to improve the assistant?

1. **Add more knowledge chunks** in the `knowledgeBase` array
2. **Enhance markdown parsing** in `markdownToHtml` function
3. **Add new quick questions** in the `quickQuestions` array
4. **Improve search algorithm** in `searchKnowledge` function

**Location**: `/wb-assistant.html` (lines 30-200)

---

## ❓ FAQ

### Q: Do I need an API key for Claude?
**A:** No! The assistant handles authentication automatically through the browser environment.

### Q: Does this work offline?
**A:** Partially. The UI works offline, but AI responses require internet for Claude API.

### Q: Can I customize the assistant?
**A:** Yes! Edit `wb-assistant.html` directly. It's a single self-contained file.

### Q: Why isn't my component showing up in answers?
**A:** The knowledge base needs to be updated. Add your component docs to the `knowledgeBase` array.

### Q: Can I deploy this?
**A:** Yes! It's a static HTML file. Deploy it anywhere that serves static files.

---

## 🎉 Summary

**To use the WB Assistant:**

1. Run `npm run dev` in project root
2. Open `http://localhost:8080/wb-assistant.html`
3. Ask questions about the WB Framework
4. Get instant answers with code examples

**The server serves ALL project files** from the root directory, so any HTML file in the project is accessible at its corresponding path.

---

**Questions?** Ask the assistant! 😊

*Last Updated: October 20, 2025*
