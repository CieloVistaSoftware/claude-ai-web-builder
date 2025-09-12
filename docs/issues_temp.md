# Issues

## Issue 1: Add Import Existing Website Functionality

**Priority:** High
**Status:** In Progress

### Description
Add functionality to import existing websites by allowing users to browse and select a folder containing website files (.html, .css, .js).

### Requirements
- Folder browser interface
- Validation that selected folder contains required file types (.html, .css, .js)
- File parsing and import functionality
- Integration with existing website builder

### Implementation Plan
1. Add folder input control to interface
2. Implement file validation logic
3. Create file parsing functions
4. Integrate with existing builder functionality

### Files to Modify
- `wb/wb.html` - Add folder browser UI
- `wb/wb.js` - Add import functionality
- `wb/wb.css` - Style the import interface
