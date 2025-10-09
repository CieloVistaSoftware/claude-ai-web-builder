# ./components/wb-layout/claude.md - WB-Layout Component Specification

## 🕒 RECENT ACTIVITY (October 6, 2025 - Most Recent First)

### 🔴 CRITICAL ISSUE - Demo Unacceptable (October 6, 2025)
- **Status**: Listed as CRITICAL PRIORITY in main project status
- **Issue**: "Demo is completely a mess not acceptable"
- **Impact**: Core layout system demo non-functional
- **Priority**: 🔴 CRITICAL - Layout system is fundamental to entire project

## Overview
The wb-layout component is a fundamental layout container that creates structured semantic HTML layouts with proper CSS grid/flexbox positioning. It provides a simple declarative way to create common webpage layouts.

## Purpose
wb-layout creates:
- **Semantic HTML structure** (header, nav, main, aside, footer)
- **CSS Grid/Flexbox layouts** for responsive design
- **Layout variants** (sidebar, top-nav, footer layouts)
- **Proper content flow** and accessibility structure

## Key Features
- Creates semantic HTML5 structure automatically
- Responsive grid-based layouts
- Multiple layout variants (sidebar-left, sidebar-right, top-nav, footer-sticky)
- Automatic content area management
- CSS custom properties for styling
- Accessibility-compliant markup

## Layout Types
1. **top-nav**: Header with navigation at top, main content below
2. **sidebar-left**: Navigation sidebar on left, content on right  
3. **sidebar-right**: Content on left, navigation sidebar on right
4. **footer-layout**: Content with sticky/fixed footer
5. **full-width**: Simple full-width content container

## Usage
```html
<wb-layout type="sidebar-left">
  <nav slot="navigation">Navigation content</nav>
  <main slot="content">Main content</main>
  <aside slot="sidebar">Sidebar content</aside>
  <footer slot="footer">Footer content</footer>
</wb-layout>
```

## Component Responsibilities
- Generate semantic HTML structure
- Apply appropriate CSS Grid/Flexbox layouts
- Handle responsive breakpoints
- Manage content slots and positioning
- Provide consistent spacing and typography

## Status
❌ **CRITICAL ISSUE**: Demo is "completely a mess not acceptable"
🚨 **HIGHEST PRIORITY**: Needs complete rebuild of demo and component 