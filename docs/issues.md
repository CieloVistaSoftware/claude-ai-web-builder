

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