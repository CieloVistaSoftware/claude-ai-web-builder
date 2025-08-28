# Project Reorganization Script Guide

## Overview

The `reorganize-project.ps1` script helps organize the Claude AI Website Builder project files according to the architectural principles defined in `ARCHITECTURE_ORGANIZATION.md`. This guide explains how to use the script and what it does.

## What the Script Does

1. **Creates Directory Structure**
   - Creates all necessary directories if they don't exist
   - Follows the structure defined in `PROJECT_STRUCTURE.md`

2. **Moves Files to Appropriate Locations**
   - Moves HTML files to appropriate directories based on their purpose
   - Organizes JavaScript utilities in `components/core`
   - Moves theme components to `themes/components`
   - Relocates wizard and builder pages to their respective directories
   - Puts test-related files in appropriate test directories

3. **Updates References**
   - Updates file references in HTML files
   - Updates import statements in JavaScript and TypeScript files
   - Ensures all moved files are properly linked

4. **Handles Artifacts**
   - Moves legacy files to `artifacts` subdirectories
   - Preserves the original structure within artifacts folders

5. **Creates Documentation**
   - Updates `PROJECT_STRUCTURE.md` with the new organization
   - Logs all actions to a log file for review

## How to Run the Script

1. Open PowerShell in the project root directory
2. Run the script:

```powershell
.\reorganize-project.ps1
```

By default, the script will:
- Create all necessary directories
- Copy files to their new locations (preserving originals)
- Update references in all files
- Create or update documentation

## Clean-up Mode

The script includes a clean-up phase that can remove original files after successful copying. This is disabled by default.

To enable clean-up mode:

1. Edit `reorganize-project.ps1`
2. Change `$shouldCleanupOriginals = $false` to `$shouldCleanupOriginals = $true`
3. Run the script

**CAUTION**: Only enable clean-up mode after verifying that the copied files work correctly.

## Logging

The script creates a log file `reorganize-log.txt` in the project root directory. This log contains:
- All actions performed by the script
- Timestamps for each action
- Errors encountered during execution

## What to Do After Running the Script

1. Check `reorganize-log.txt` for any errors
2. Test the application to ensure all links and imports are working
3. Review the new project structure in `PROJECT_STRUCTURE.md`
4. Update any CI/CD pipelines or build scripts to reflect the new structure

## Customization

You can customize the script by:
- Adding more files to the various file arrays
- Adding new directory paths to the `$directories` array
- Modifying the reference update patterns

## Troubleshooting

If you encounter issues:

1. Check the log file for errors
2. Verify that files were copied correctly
3. Check for hardcoded paths in your code that may need manual updates
4. Run the script again with modifications if needed
