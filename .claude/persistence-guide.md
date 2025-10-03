# Claude Code Persistence Guide

## Overview
Claude Code provides persistence between sessions through **CLAUDE.md** files that maintain context and project information.

## Memory Hierarchy (Highest to Lowest Priority)
1. **Enterprise Policy Memory** - Organization-wide standards and policies
2. **Project Memory** - Team-shared context stored in project root
3. **User Memory** - Your personal preferences across all projects  
4. **Local Project Memory** (deprecated) - Project-specific memories

## Key Features
- Memories automatically load when starting Claude Code
- Higher-level memories take precedence over lower-level ones
- Memories are searched recursively from your working directory upwards
- You can import other files using `@path/to/file` syntax

## Quick Commands
- `#` - Quickly add information to memory during a session
- `/memory` - View or edit current memories
- `@path/to/file` - Import content from another file into memory

## Common Use Cases

### Project Architecture
```markdown
# Project Structure
- `/src` - Main source code
- `/tests` - Test files
- `/docs` - Documentation
```

### Coding Standards
```markdown
# Code Style
- Use TypeScript for all new files
- Follow ESLint configuration
- Prefer functional components over class components
```

### Tool Commands
```markdown
# Build Commands
- `npm run build` - Build the project
- `npm run test` - Run tests
- `npm run lint` - Check code style
```

### Personal Workflow
```markdown
# My Preferences
- Always run tests before committing
- Use feature branches for new work
- Commit messages should be descriptive
```

## Best Practices
1. Create a `CLAUDE.md` file in your project root with relevant project information
2. Use the `#` command during sessions to save important context
3. Keep memories concise and focused on reusable information
4. Update memories when project conventions change
5. Use imports (`@file`) to avoid duplicating information

## Example CLAUDE.md File
```markdown
# Website Builder Project

## Architecture
- TypeScript-based web application
- Component-based architecture in `/components`
- Core functionality in `/Working`

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite

## Important Files
- `/Working/index.html` - Main entry point
- `/Working/core/WebsiteBuilder.ts` - Core builder logic
- `/Working/components/ControlPanel.ts` - Control panel component

## Current Focus
- Improving control panel functionality
- Adding persistence features
- Enhancing theme management
```

This persistence mechanism ensures that Claude Code maintains context about your project, preferences, and workflow across sessions.