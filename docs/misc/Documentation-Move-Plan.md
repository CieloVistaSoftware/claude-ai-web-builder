# Documentation Categorization and Move Plan

## Purpose
Organize all documentation in the `docs/` folder by moving each markdown file into its correct category subfolder. This improves discoverability, maintainability, and logical grouping of all project documentation.

## Plan
- **Move each markdown file in `docs/` to its correct category subfolder**
  - Categories: `architecture`, `build`, `component-guides`, `configuration`, `design`, `migration`, `events-logging`, `status-issues`, `api-specs`, `misc`, `howto`, `reference`
- **Use only the real file content**
  - No placeholders, no annotations, no content loss
- **Delete the original after the move**
- **Example moves:**
  - `docs/BUILD.md` → `docs/build/BUILD.md`
  - `docs/COMPONENT-GUIDE.md` → `docs/component-guides/COMPONENT-GUIDE.md`
  - `docs/Config.md` → `docs/configuration/Config.md`

## Steps
1. Review all markdown files in the root of `docs/`
2. Assign each file to the most appropriate category folder
3. Move the file, preserving its content exactly
4. Delete the original file from the root after moving
5. Repeat until all docs are categorized

## Notes
- No file should be left in the root of `docs/` except for the category folders and this plan file
- If a file does not fit any category, place it in `misc/`
- If a new category is needed, create it and document the reason

---
*Created by GitHub Copilot on October 14, 2025*