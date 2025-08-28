# Project Reorganization Script

# Define log file
$logFile = Join-Path $PSScriptRoot "reorganize-log.txt"
"Starting project reorganization at $(Get-Date)" | Out-File -FilePath $logFile

function Write-LogAndConsole {
    param (
        [string]$message
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Out-File -FilePath $logFile -Append
    Write-Host $message
}

# Create necessary directories if they don't exist
$directories = @(
    "artifacts",
    "artifacts/zzz",
    "artifacts/old-html",
    "artifacts/old-components",
    "artifacts/old-js",
    "components/core",
    "components/ui",
    "components/web",
    "pages",
    "pages/wizard",
    "pages/builder",
    "pages/templates",
    "themes/components",
    "html/layouts",
    "html/pages",
    "html/components"
)

foreach ($dir in $directories) {
    $path = Join-Path $PSScriptRoot $dir
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-LogAndConsole "Created directory: $dir"
    }
}

# Files to move to artifacts/zzz (if not already moved)
$zzzSource = Join-Path $PSScriptRoot "zzz"
$zzzDest = Join-Path $PSScriptRoot "artifacts/zzz"
if (Test-Path $zzzSource) {
    Get-ChildItem -Path $zzzSource -Recurse | Move-Item -Destination $zzzDest -Force
    Write-LogAndConsole "Moved files from zzz to artifacts/zzz"
}

# Files to move to pages/wizard
$wizardFiles = @(
    "website-builder.html",
    "website-builder-test.html",
    "features.html"
)

foreach ($file in $wizardFiles) {
    $source = Join-Path $PSScriptRoot $file
    $dest = Join-Path $PSScriptRoot "pages/wizard"
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $dest
        Write-LogAndConsole "Copied $file to pages/wizard"
    }
}

# Files to move to pages/builder
$builderSource = Join-Path $PSScriptRoot "wb"
$builderDest = Join-Path $PSScriptRoot "pages/builder"
if (Test-Path $builderSource) {
    Copy-Item -Path (Join-Path $builderSource "*") -Destination $builderDest -Recurse
    Write-LogAndConsole "Copied wb folder content to pages/builder"
}

# Files to move to themes/components
$themeComponentsSource = Join-Path $PSScriptRoot "themes/generator/component"
$themeComponentsDest = Join-Path $PSScriptRoot "themes/components"
if (Test-Path $themeComponentsSource) {
    Copy-Item -Path (Join-Path $themeComponentsSource "*") -Destination $themeComponentsDest -Recurse
    Write-LogAndConsole "Copied theme generator components to themes/components"
}

# Move pure HTML files from root to html/pages
$htmlFiles = @(
    "website_template_generator.html",
    "test-dynamic-pages.html"
)

foreach ($file in $htmlFiles) {
    $source = Join-Path $PSScriptRoot $file
    $dest = Join-Path $PSScriptRoot "html/pages"
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $dest
        Write-LogAndConsole "Copied $file to html/pages"
    }
}

# Move standalone JS files to appropriate folders
$standaloneJsFiles = @(
    "dynamic-pages.js",
    "mcp-integration.js",
    "add-favicon.js",
    "add-zia-symbol.js"
)

foreach ($file in $standaloneJsFiles) {
    $source = Join-Path $PSScriptRoot $file
    $dest = Join-Path $PSScriptRoot "components/core"
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $dest
        Write-LogAndConsole "Copied $file to components/core"
    }
}

# Move test files to artifacts if they're not in the Tests folder
$testRelatedFiles = Get-ChildItem -Path $PSScriptRoot -Filter "test-*.html" -File | Where-Object { $_.DirectoryName -eq $PSScriptRoot }
foreach ($file in $testRelatedFiles) {
    $dest = Join-Path $PSScriptRoot "artifacts/old-html"
    Copy-Item -Path $file.FullName -Destination $dest
    Write-LogAndConsole "Moved test file $($file.Name) to artifacts/old-html"
}

# Move old or unused JavaScript files to artifacts/old-js
$oldJsFiles = @(
    "test-mcp-integration.js"
)

foreach ($file in $oldJsFiles) {
    $source = Join-Path $PSScriptRoot $file
    $dest = Join-Path $PSScriptRoot "artifacts/old-js"
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $dest
        Write-LogAndConsole "Copied $file to artifacts/old-js"
    }
}

# Update references in HTML files
$htmlFiles = Get-ChildItem -Path $PSScriptRoot -Filter "*.html" -Recurse

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $modified = $false
    
    # Update wb references
    if ($content -match "/wb/") {
        $content = $content -replace "/wb/", "./"
        $modified = $true
    }
    
    # Update theme generator component references
    if ($content -match "/themes/generator/component/") {
        $content = $content -replace "/themes/generator/component/", "/themes/components/"
        $modified = $true
    }

    # Update JS file references that have been moved to components/core
    $jsFiles = @("dynamic-pages.js", "mcp-integration.js", "add-favicon.js", "add-zia-symbol.js")
    foreach ($jsFile in $jsFiles) {
        if ($content -match "src=['\"]$jsFile['\"]" -or $content -match "src=['\"]\./$jsFile['\"]") {
            $content = $content -replace "src=['\"]\.?/?$jsFile['\"]", "src=""/components/core/$jsFile"""
            $modified = $true
        }
    }

    # Update HTML references for files moved to html/pages
    $htmlPageFiles = @("website_template_generator.html", "test-dynamic-pages.html")
    foreach ($htmlFile in $htmlPageFiles) {
        if ($content -match "href=['\"]$htmlFile['\"]" -or $content -match "href=['\"]\./$htmlFile['\"]") {
            $content = $content -replace "href=['\"]\.?/?$htmlFile['\"]", "href=""/html/pages/$htmlFile"""
            $modified = $true
        }
    }
    
    if ($modified) {
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        Write-LogAndConsole "Updated references in $($file.FullName)"
    }
}

# Update references in JavaScript and TypeScript files
$jstsFiles = Get-ChildItem -Path $PSScriptRoot -Include @("*.js", "*.ts") -Recurse

foreach ($file in $jstsFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $modified = $false
    
    # Update wb references
    if ($content -match "/wb/") {
        $content = $content -replace "/wb/", "./"
        $modified = $true
    }
    
    # Update theme generator component references
    if ($content -match "/themes/generator/component/") {
        $content = $content -replace "/themes/generator/component/", "/themes/components/"
        $modified = $true
    }

    # Update import statements for files moved to components/core
    $jsFiles = @("dynamic-pages.js", "mcp-integration.js", "add-favicon.js", "add-zia-symbol.js")
    foreach ($jsFile in $jsFiles) {
        $basename = [System.IO.Path]::GetFileNameWithoutExtension($jsFile)
        # Handle different import formats
        if ($content -match "import.*from.*['""]\.?/?$basename['""]") {
            $content = $content -replace "from\s+['""]\.?/?$basename['""]", "from ""/components/core/$basename"""
            $modified = $true
        }
        if ($content -match "import.*from.*['""]\.?/?$jsFile['""]") {
            $content = $content -replace "from\s+['""]\.?/?$jsFile['""]", "from ""/components/core/$jsFile"""
            $modified = $true
        }
    }
    
    if ($modified) {
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        Write-LogAndConsole "Updated references in $($file.FullName)"
    }
}

# Create index.html in root to redirect to pages/wizard
$indexHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claude AI Website Builder</title>
    <meta http-equiv="refresh" content="0;url=pages/wizard/website-builder.html">
    <link rel="icon" href="./ziasymbol.svg" type="image/svg+xml">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            padding: 50px;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }
        
        img {
            max-width: 150px;
            margin-bottom: 20px;
        }
        
        .redirect {
            margin-top: 20px;
            color: #666;
        }
        
        a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <img src="ziasymbol.svg" alt="Zia Symbol Logo">
    <h1>Claude AI Website Builder</h1>
    <p>Welcome to the Claude AI Website Builder platform.</p>
    <p class="redirect">If you are not automatically redirected, <a href="pages/wizard/website-builder.html">click here</a> to go to the Website Builder.</p>
    
    <p>Project directories:</p>
    <ul style="list-style: none; padding: 0;">
        <li><a href="pages/wizard/website-builder.html">Website Builder Wizard</a></li>
        <li><a href="pages/wizard/features.html">Features</a></li>
        <li><a href="pages/builder/wb.html">Website Editor</a></li>
        <li><a href="themes/generator/index.html">Theme Generator</a></li>
        <li><a href="components/table/table-theme.html">Table Theme Component</a></li>
    </ul>
    <p><a href="PROJECT_STRUCTURE.md">View Project Structure Documentation</a></p>
</body>
</html>
"@

$indexPath = Join-Path $PSScriptRoot "index.html"
$indexHtml | Set-Content -Path $indexPath
Write-LogAndConsole "Created new index.html with redirects"

Write-LogAndConsole "Project reorganization completed!"

# Clean-up phase - remove original files after successful copy if specified
$shouldCleanupOriginals = $false # Set to true when ready to remove original files
if ($shouldCleanupOriginals) {
    Write-LogAndConsole "Starting cleanup of original files..."

    # Remove original wizard files
    foreach ($file in $wizardFiles) {
        $source = Join-Path $PSScriptRoot $file
        if ((Test-Path $source) -and (Test-Path (Join-Path (Join-Path $PSScriptRoot "pages/wizard") $file))) {
            Remove-Item -Path $source -Force
            Write-LogAndConsole "Removed original $file after successful copy"
        }
    }

    # Remove original HTML page files
    foreach ($file in $htmlFiles) {
        $source = Join-Path $PSScriptRoot $file
        if ((Test-Path $source) -and (Test-Path (Join-Path (Join-Path $PSScriptRoot "html/pages") $file))) {
            Remove-Item -Path $source -Force
            Write-LogAndConsole "Removed original $file after successful copy"
        }
    }

    # Remove original JS files
    foreach ($file in $standaloneJsFiles) {
        $source = Join-Path $PSScriptRoot $file
        if ((Test-Path $source) -and (Test-Path (Join-Path (Join-Path $PSScriptRoot "components/core") $file))) {
            Remove-Item -Path $source -Force
            Write-LogAndConsole "Removed original $file after successful copy"
        }
    }

    # Add other cleanup logic here
    Write-LogAndConsole "Cleanup completed!"
}

# Update PROJECT_STRUCTURE.md with the new organization details
$projectStructureContent = @"
# Claude AI Website Builder Project Structure

## Overview

This document outlines the architecture and folder structure of the Claude AI Website Builder project. The project uses multiple architectural approaches, which have been organized into a clear structure to improve maintainability.

## Folder Structure

### `/pages`

Contains standalone web pages with their associated assets.

- `/pages/wizard` - The website builder wizard (entry point for users)
- `.` - The main website builder interface
- `/pages/templates` - Template example pages

### `/components`

Reusable components organized by functionality.

- `/components/core` - Core JavaScript/TypeScript utilities and shared functions
- `/components/table` - Table-related components
- `/components/theme` - Theme management components
- `/components/registry` - Component registration system
- `/components/ui` - UI components
- `/components/web` - Web components

### `/html`

Pure HTML files separated by purpose.

- `/html/layouts` - Layout templates
- `/html/pages` - Standalone HTML pages
- `/html/components` - HTML component templates

### `/themes`

Theme-related files and components.

- `/themes/generator` - Theme generator tool
- `/themes/components` - Theme-specific components
- `/themes/css` - Theme stylesheets

### `/css`

Global CSS files.

- `/css/bootstrap.css` - Bootstrap framework
- `/css/custom.css` - Custom global styles
- `/css/themes` - Theme-specific CSS files

### `/src`

TypeScript source files.

- `WebsiteBuilderWizard.ts` - Main wizard component
- `main.tsx` - Main entry point for React components
- Other TypeScript implementations

### `/Tests`

Test files and utilities.

- `/Tests/playwright` - Playwright test specs
- Other test utilities

### `/artifacts`

Legacy and deprecated files preserved for reference.

- `/artifacts/old-html` - Old HTML files
- `/artifacts/old-components` - Old component implementations
- `/artifacts/old-js` - Old JavaScript files
- `/artifacts/zzz` - Miscellaneous legacy items

## Organization Guidelines

The project follows these architecture patterns:

1. **Pure HTML** - Located in `/html/pages` and `/html/components`
2. **HTML Components** - Located in `/components/web` and `/themes/components`
3. **HTML with separate CSS/JS** - Located in `.` and `/pages/wizard`
4. **TypeScript components** - Located in `/src` and `/components/core`

To maintain this organization:

1. New pure HTML files should be placed in the appropriate `/html` subdirectory
2. New components should be placed in the appropriate `/components` subdirectory
3. New pages with HTML, CSS, and JS should be placed in `/pages`
4. New TypeScript implementations should be placed in `/src` or appropriate `/components` subdirectory
5. Deprecated or unused files should be moved to `/artifacts`
"@

$projectStructurePath = Join-Path $PSScriptRoot "PROJECT_STRUCTURE.md"
$projectStructureContent | Set-Content -Path $projectStructurePath -Encoding UTF8
Write-LogAndConsole "Updated PROJECT_STRUCTURE.md with new organization details"

Write-LogAndConsole "Project reorganization script completed successfully!"
