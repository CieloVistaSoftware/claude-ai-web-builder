# Move all .js files to js folder and update references - COMPREHENSIVE VERSION
# Run from scripts folder

Write-Host "=== MOVING ALL JAVASCRIPT FILES AND UPDATING REFERENCES ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Ensure js folder exists
if (-not (Test-Path "js")) {
    New-Item -ItemType Directory -Name "js" | Out-Null
    Write-Host "📁 Created js/ folder" -ForegroundColor Green
}

# Find all .js files in root directory (excluding already organized files)
Write-Host "`n🔍 Scanning for JavaScript files in root directory..." -ForegroundColor Blue

$jsFiles = Get-ChildItem -Filter "*.js" | Where-Object { 
    $_.PSIsContainer -eq $false 
}

if ($jsFiles.Count -eq 0) {
    Write-Host "No JavaScript files found in root directory" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

Write-Host "Found $($jsFiles.Count) JavaScript files to move:" -ForegroundColor Green
foreach ($file in $jsFiles) {
    Write-Host "  📜 $($file.Name)" -ForegroundColor Gray
}

# Show existing js folder contents
Write-Host "`nExisting js/ folder contents:" -ForegroundColor Blue
if (Test-Path "js") {
    $existingJs = Get-ChildItem "js" -Filter "*.js"
    if ($existingJs.Count -gt 0) {
        foreach ($file in $existingJs) {
            Write-Host "  📜 $($file.Name) (already in js/)" -ForegroundColor Green
        }
    } else {
        Write-Host "  (empty)" -ForegroundColor Gray
    }
}

# Track moved files for reference updates
$movedFiles = @()

# Move JavaScript files
Write-Host "`n📦 Moving JavaScript files..." -ForegroundColor Blue
foreach ($file in $jsFiles) {
    try {
        $targetPath = "js\$($file.Name)"
        if (Test-Path $targetPath) {
            Write-Host "  ⚠️  $($file.Name) already exists in js/ - skipping" -ForegroundColor Yellow
        } else {
            Move-Item $file.FullName "js\" -Force
            Write-Host "  ✅ Moved $($file.Name)" -ForegroundColor Green
            $movedFiles += $file.Name
        }
    } catch {
        Write-Host "  ❌ Failed to move $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($movedFiles.Count -eq 0) {
    Write-Host "No files were moved, no references to update" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

# Update references in files
Write-Host "`n🔄 Updating references in files..." -ForegroundColor Blue

# Define file types that might contain JavaScript references
$fileTypesToScan = @('*.html', '*.css', '*.js', '*.md', '*.ts', '*.tsx', '*.json', '*.php', '*.py')

$filesScanned = 0
$referencesUpdated = 0

foreach ($filePattern in $fileTypesToScan) {
    $filesToScan = Get-ChildItem -Recurse -Filter $filePattern | Where-Object { 
        $_.PSIsContainer -eq $false -and 
        $_.DirectoryName -notlike "*node_modules*" -and
        $_.DirectoryName -notlike "*\.git*" -and
        $_.DirectoryName -notlike "*dist*" -and
        $_.DirectoryName -notlike "*js*"  # Don't update files inside js folder
    }
    
    foreach ($file in $filesToScan) {
        try {
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            $originalContent = $content
            $fileUpdated = $false
            
            foreach ($jsName in $movedFiles) {
                # Update various reference patterns for JavaScript files
                $patterns = @(
                    # Direct references: script.js -> js/script.js
                    "(?<!js/)(?<!['""`"])$([regex]::Escape($jsName))(?!['""`"])",
                    # Quoted references: "script.js" -> "js/script.js"
                    "`"$([regex]::Escape($jsName))`"",
                    # Single quoted: 'script.js' -> 'js/script.js'
                    "'$([regex]::Escape($jsName))'",
                    # Script tags: <script src="script.js"> -> <script src="js/script.js">
                    "src=`"$([regex]::Escape($jsName))`"",
                    # Import statements: import from "./script.js" -> import from "./js/script.js"
                    "import\s+.*\s+from\s+`"\./($([regex]::Escape($jsName)))`"",
                    "import\s+.*\s+from\s+'\./($([regex]::Escape($jsName)))'",
                    # Dynamic imports: import("./script.js") -> import("./js/script.js")
                    "import\(`"\./($([regex]::Escape($jsName)))`"\)",
                    "import\('\./($([regex]::Escape($jsName)))'\)",
                    # Require statements: require("./script.js") -> require("./js/script.js")
                    "require\(`"\./($([regex]::Escape($jsName)))`"\)",
                    "require\('\./($([regex]::Escape($jsName)))'\)",
                    # Worker scripts: new Worker("script.js") -> new Worker("js/script.js")
                    "new\s+Worker\(`"$([regex]::Escape($jsName))`"\)",
                    "new\s+Worker\('$([regex]::Escape($jsName))'\)",
                    # Service worker registration
                    "register\(`"$([regex]::Escape($jsName))`"\)",
                    "register\('$([regex]::Escape($jsName))'\)",
                    # Webpack/bundler entry points
                    "entry:\s*`"$([regex]::Escape($jsName))`"",
                    "entry:\s*'$([regex]::Escape($jsName))'",
                    # Package.json scripts and main
                    "`"main`":\s*`"$([regex]::Escape($jsName))`""
                )
                
                $replacements = @(
                    "js/$jsName",
                    "`"js/$jsName`"",
                    "'js/$jsName'",
                    "src=`"js/$jsName`"",
                    "import `$1 from `"./js/$jsName`"",
                    "import `$1 from './js/$jsName'",
                    "import(`"./js/$jsName`")",
                    "import('./js/$jsName')",
                    "require(`"./js/$jsName`")",
                    "require('./js/$jsName')",
                    "new Worker(`"js/$jsName`")",
                    "new Worker('js/$jsName')",
                    "register(`"js/$jsName`")",
                    "register('js/$jsName')",
                    "entry: `"js/$jsName`"",
                    "entry: 'js/$jsName'",
                    "`"main`": `"js/$jsName`""
                )
                
                for ($i = 0; $i -lt $patterns.Count; $i++) {
                    $newContent = $content -replace $patterns[$i], $replacements[$i]
                    if ($newContent -ne $content) {
                        $content = $newContent
                        $fileUpdated = $true
                    }
                }
            }
            
            if ($fileUpdated) {
                Set-Content $file.FullName -Value $content -Encoding UTF8
                Write-Host "  ✅ Updated references in $($file.Name)" -ForegroundColor Green
                $referencesUpdated++
            }
            
            $filesScanned++
            
        } catch {
            Write-Host "  ❌ Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Show summary
Write-Host "`n📊 SUMMARY:" -ForegroundColor Yellow
Write-Host "  📜 JavaScript files moved: $($movedFiles.Count)" -ForegroundColor Green
Write-Host "  📄 Files scanned: $filesScanned" -ForegroundColor Cyan
Write-Host "  🔄 Files with updated references: $referencesUpdated" -ForegroundColor Green

Write-Host "`nMoved JavaScript files:" -ForegroundColor Blue
foreach ($js in $movedFiles) {
    Write-Host "  📜 $js -> js/$js" -ForegroundColor Gray
}

# Show what's now in js folder
Write-Host "`nComplete contents of js/ folder:" -ForegroundColor Blue
Get-ChildItem "js" -Filter "*.js" | ForEach-Object {
    Write-Host "  📜 $($_.Name)" -ForegroundColor Gray
}

# Show current root structure (should have no JS files)
Write-Host "`nRoot JavaScript files (should be empty):" -ForegroundColor Blue
$remainingJs = Get-ChildItem -Filter "*.js"

if ($remainingJs.Count -eq 0) {
    Write-Host "  ✅ No JavaScript files remaining in root" -ForegroundColor Green
} else {
    foreach ($file in $remainingJs) {
        Write-Host "  📜 $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ JAVASCRIPT ORGANIZATION AND REFERENCE UPDATE COMPLETE!" -ForegroundColor Green

Write-Host "`nRecommendations:" -ForegroundColor Yellow
Write-Host "1. Test all script tags load correctly in HTML files" -ForegroundColor Cyan
Write-Host "2. Verify import/export statements resolve properly" -ForegroundColor Cyan
Write-Host "3. Check any dynamic imports or require() calls" -ForegroundColor Cyan
Write-Host "4. Test Web Workers and Service Workers if used" -ForegroundColor Cyan
Write-Host "5. Verify bundler configurations (Webpack, Vite, etc.)" -ForegroundColor Cyan
Write-Host "6. Check package.json main entry point" -ForegroundColor Cyan
Write-Host "7. Test your website functionality thoroughly" -ForegroundColor Cyan

Read-Host "Press Enter to continue"