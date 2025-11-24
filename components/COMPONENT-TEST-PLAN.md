# WB Component Shadow DOM Test Plan

## Test Order (Priority Components First)

### Tier 1: Core UI Components (Test First)
1. ✅ **wb-button** - FIXED (Shadow DOM working, CSS loading)
2. **wb-input** - Form control
3. **wb-select** - Form control  
4. **wb-card** - Layout component
5. **wb-demo** - Demo framework
6. **wb-modal** - Dialog component
7. **wb-table** - Data display

### Tier 2: Interactive Components
8. **wb-toggle** - Form control
9. **wb-slider** - Form control
10. **wb-event-log** - Developer tool
11. **wb-tabs** - Navigation
12. **wb-color-picker** - Color tool

### Tier 3: Layout & Display
13. **wb-header** - Layout
14. **wb-footer** - Layout
15. **wb-nav** - Navigation
16. **wb-hero** - Display
17. **wb-grid** - Layout

### Tier 4: Developer Tools
18. **wb-dev-toolbox** - Developer tool
19. **wb-log-viewer** - Developer tool
20. **wb-claude-logger** - Developer tool

### Tier 5: Specialized/Color Tools
21. **wb-color-harmony**
22. **wb-color-bars**
23. **wb-color-transformer**
24. **wb-viewport**
25. **wb-resize-panel**

## Standard File Structure (per component):
```
/components/wb-{name}/
  ├── wb-{name}.js          ← Component code
  ├── wb-{name}.css         ← Component styles
  ├── wb-{name}.demo.html   ← Demo page (STANDARD NAME)
  ├── wb-{name}.md          ← Documentation
  └── 🟢 claude.md or 🔴 claude.md ← Status
```

## Next: Test wb-input
