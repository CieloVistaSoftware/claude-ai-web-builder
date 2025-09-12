1. ✅ COMPLETED - add function to import existing website files made by this tool. It must have .js .css and .html files in the folder. present the folder explorer. When folder is selected bring up the site as is but add the control-panel. This allows the user to change things in their website that was created with this tool.

When the file is read in, the color selector changes to what was in the webiste e.g. primary colors, secondary colors etc.

**Implementation Details:**
- ✅ Folder explorer functionality added
- ✅ File validation for .js, .css, .html files
- ✅ Website loading with control panel activation
- ✅ Color extraction from CSS files
- ✅ Automatic color selector updates
- ✅ Visual color palette display
- ✅ Editing mode enablement

<!-- All issues have been fixed! -->
<!-- Issue #1 Fixed: Added ability to insert media elements above or below editable elements via right-click menu -->
<!-- Issue #2 Fixed: Fixed pages/builder/wb.html path references, structure, and script integration -->

3. convert all .js to .ts and add extensive doc in the header of each file decribing what it does and where it's used. 

4. no standalone test e.g. test-mcp-integration, insted write a playwrigth test instead.
5. put all mcp related files and artifacts into a folder named mcp.
6. create a folder named images, move all .png, .jpg and .svg files into that folder
7. Our tests folder contains only playwrigth tests.
8. we don't want .ps1 files except for special cases. Move all .ps1 files to powershell folder
9. Provide readme files for each .ts name them the same name but add .readme.md
10. put all .sh files in the folder named shell and document each file
11. merge all fix* files into their root name we don't want any file named fix.
12. our standard is that all .html pages for a site should have a header, main, and footer section.  Identify all index.html pages that don't have those.