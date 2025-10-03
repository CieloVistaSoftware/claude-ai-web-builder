# install-new-structure.ps1
# This script sets up the new folder structure and moves files to their correct locations

# Define paths
$workingDir = "c:\Users\jwpmi\Downloads\AI\wb\Working"

# Create a backup of the current Working directory
Write-Host "📦 Creating backup of current Working directory..."
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "c:\Users\jwpmi\Downloads\AI\wb\Working_backup_$timestamp"
Copy-Item -Path $workingDir -Destination $backupDir -Recurse
Write-Host "✅ Backup created at: $backupDir"

# Create directory structure if it doesn't exist
Write-Host "📂 Creating directory structure..."
$directories = @(
    "$workingDir\core",
    "$workingDir\core\state",
    "$workingDir\core\theme",
    "$workingDir\core\layout",
    "$workingDir\core\utils",
    "$workingDir\core\api",
    "$workingDir\components",
    "$workingDir\components\control-panel",
    "$workingDir\plugins",
    "$workingDir\dev-plugins",
    "$workingDir\assets",
    "$workingDir\assets\images",
    "$workingDir\assets\icons",
    "$workingDir\assets\fonts",
    "$workingDir\docs",
    "$workingDir\dist"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory | Out-Null
        Write-Host "  ✓ Created: $($dir.Replace("$workingDir\", ''))"
    } else {
        Write-Host "  ✓ Already exists: $($dir.Replace("$workingDir\", ''))"
    }
}
Write-Host "✅ Directory structure created"

# Replace the old files with new modular versions
Write-Host "🔄 Implementing new structure..."

# Replace index.html with the new version
if (Test-Path "$workingDir\index.new.html") {
    Copy-Item -Path "$workingDir\index.new.html" -Destination "$workingDir\index.html" -Force
    Remove-Item "$workingDir\index.new.html"
    Write-Host "✅ Updated index.html"
}

# Replace script.js with the new version
if (Test-Path "$workingDir\main.js") {
    Copy-Item -Path "$workingDir\main.js" -Destination "$workingDir\script.js" -Force
    Write-Host "✅ Updated script.js with modular version"
}

# Move ControlPanel.js to components directory if it exists in the root
if (Test-Path "$workingDir\ControlPanel.js") {
    Remove-Item "$workingDir\ControlPanel.js"
    Write-Host "✅ Removed old ControlPanel.js (now using components version)"
}

# Update the README.md with a section on modular architecture
$readmeFile = "$workingDir\README.md"
if (Test-Path $readmeFile) {
    $readme = Get-Content -Path $readmeFile -Raw
    
    # Check if modular architecture section already exists
    if (-not ($readme -match "## Modular Architecture")) {
        $modularSection = @"

## Modular Architecture (Updated July 8, 2025)

The project has been restructured with a modular architecture for better maintainability:

```
Working/
├── core/             # Core application modules
│   ├── state/        # State management
│   ├── theme/        # Theme management
│   ├── layout/       # Layout functionality
│   ├── utils/        # Utility functions
│   └── api/          # API interfaces
├── components/       # Web components
├── plugins/          # User plugins (included in exports)
├── dev-plugins/      # Developer plugins (stripped during export)
├── assets/           # Static assets
├── index.html        # Main HTML file
├── script.js         # Main JS file (loads modular code)
└── styles.css        # Main CSS file
```

For detailed documentation, see [Modular Architecture Documentation](./docs/modular-architecture.md)

"@
        
        # Insert modular section after the quick start section
        if ($readme -match "## Quick Start") {
            $updatedReadme = $readme -replace "## Quick Start", "$modularSection`n`n## Quick Start"
            Set-Content -Path $readmeFile -Value $updatedReadme
            Write-Host "✅ Updated README.md with modular architecture section"
        } else {
            # If no quick start section, append to the end of the file
            Add-Content -Path $readmeFile -Value $modularSection
            Write-Host "✅ Added modular architecture section to README.md"
        }
    } else {
        Write-Host "ℹ️ README.md already contains modular architecture information"
    }
}

# Create the JSDoc configuration file if it doesn't exist
$jsdocConfigFile = "$workingDir\jsdoc.config.json"
if (-not (Test-Path $jsdocConfigFile)) {
    $jsdocConfig = @'
{
  "source": {
    "include": ["core", "components", "plugins"],
    "includePattern": ".+\\.js(doc|x)?$"
  },
  "opts": {
    "destination": "./docs/code",
    "recurse": true,
    "template": "node_modules/docdash"
  },
  "plugins": ["plugins/markdown"],
  "templates": {
    "cleverLinks": true,
    "monospaceLinks": false
  },
  "docdash": {
    "static": true,
    "sort": true,
    "sectionOrder": [
      "Classes",
      "Modules",
      "Externals",
      "Events",
      "Namespaces",
      "Mixins",
      "Tutorials",
      "Interfaces"
    ],
    "meta": {
      "title": "Website Builder Documentation",
      "description": "Documentation for the modular Website Builder",
      "keyword": "website-builder, documentation"
    },
    "search": true,
    "collapse": true,
    "wrap": true
  }
}
'@
    Set-Content -Path $jsdocConfigFile -Value $jsdocConfig
    Write-Host "✅ Created JSDoc configuration file"
}

# Update the paths to ControlPanelContent.html
Write-Host "📝 Updating control panel paths..."
if (Test-Path "$workingDir\script.js") {
    $scriptContent = Get-Content -Path "$workingDir\script.js" -Raw
    $updatedScriptContent = $scriptContent -replace 'fetch\("\.\/ControlPanelContent\.html"\)', 'fetch("./components/control-panel/ControlPanelContent.html")'
    Set-Content -Path "$workingDir\script.js" -Value $updatedScriptContent
    Write-Host "✅ Updated control panel paths in script.js"
}

# If the ControlPanelContent.html exists in the root, remove it
if (Test-Path "$workingDir\ControlPanelContent.html") {
    Remove-Item "$workingDir\ControlPanelContent.html"
    Write-Host "✅ Removed old ControlPanelContent.html from root"
}

# Optional - cleanup any files we don't need anymore
Write-Host "🧹 Cleaning up..."
# Don't delete files in the backup process yet
# We'll manually remove them after verifying everything works

Write-Host @"

✅ Installation complete!

Your new folder structure is now:

Working/
├── core/             # Core application modules
├── components/       # Web components
├── plugins/          # User plugins
├── dev-plugins/      # Developer plugins
├── assets/           # Static assets
├── index.html        # Main HTML file
├── script.js         # Main JS file  
└── styles.css        # Main CSS file

The application is now using a modular architecture with better organization.

Next steps:
1. Review the backup at $backupDir if needed
2. Check the updated documentation in docs/modular-architecture.md
3. Test the application to ensure everything works as expected
4. Run 'npm run docs' to generate code documentation
"@
