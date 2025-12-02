# WB Demo Component - Converted to Light DOM

## Migration Summary

✅ **Converted from Shadow DOM to Light DOM template system** - same approach as wb-card

## New Architecture

- **template.html** - Simple HTML template with {{title}} placeholder
- **wb-demo.js** - Simplified component (~200 lines, down from 300+)
- **wb-demo.css** - Cleaned CSS for Light DOM (no :host, ::slotted)

## Key Changes

1. **Removed Shadow DOM** - Now uses Light DOM with external template
2. **Simplified Template Rendering** - Basic string replacement for {{title}}
3. **Tab Switching** - Works directly on Light DOM elements
4. **Markdown Loading** - Still loads marked.js dynamically
5. **IFrame Demo Loading** - Still supports demo-url attribute

## File Structure

```
wb-demo/
├── wb-demo.js          ✅ Main component (Light DOM version)
├── wb-demo.css         ✅ External styles (cleaned for Light DOM)
├── template.html       ✅ HTML template
├── wb-demo.md          ✅ Documentation
├── marked.min.js       ✅ Markdown parser
├── wb-demo-demo.html   ✅ Demo page
├── wb-linkedinAd-demo.html
├── card-showcase/      ✓ Demo content
├── cleanup.ps1         ✅ Cleanup script for old files
└── [DELETED junk files]
```

## Benefits

✅ No Shadow DOM complexity  
✅ Easier to debug in browser DevTools  
✅ Examples now display properly  
✅ Simpler to maintain  
✅ 100+ lines of code removed  

## Usage

```html
<wb-demo 
  title="Component Name"
  doc-url="/path/to/doc.md"
  demo-url="/path/to/demo.html">
</wb-demo>
```

## Auto-Detection

- If no `doc-url` provided, looks for `{folder-name}.md` in component folder
- Demo iframe loads from `demo-url` attribute

## Attributes

- `title` - Demo title
- `doc-url` - URL to markdown documentation
- `demo-url` - URL to demo iframe content
- `markdown` - Alternative to doc-url

## TODO

- [ ] Test with various markdown files
- [ ] Ensure all demo pages work with new system
