# Move all .ts and .tsx files to ts folder and update references
# Run from scripts folder

Write-Host "=== MOVING TYPESCRIPT FILES AND UPDATING REFERENCES ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Ensure ts folder exists
if (-not (Test-Path "ts")) {
    New-Item -ItemType Directory -Name "ts" | Out-Null
    Write-Host "📁 Created ts/ folder" -ForegroundColor Green
}

# Find all .ts and .tsx files in root directory
Write-Host "`n🔍 Scanning for TypeScript files in root directory..." -ForegroundColor Blue

$tsFiles = Get-ChildItem -Filter "*.ts" | Where-Object { 
    $_.PSIsContainer -eq $false 
}

$tsxFiles = Get-ChildItem -Filter "*.tsx" | Where-Object { 
    $_.PSIsContainer -eq $false 
}

$allTsFiles = $tsFiles + $tsxFiles

if ($allTsFiles.Count -eq 0) {
    Write-Host "No TypeScript files found in root directory" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

Write-Host "Found $($allTsFiles.Count) TypeScript files to move:" -ForegroundColor Green
foreach ($file in $allTsFiles) {
    $icon = if ($file.Extension -eq ".tsx") { "⚛️" } else { "📘" }
    Write-Host "  $icon $($file.Name)" -ForegroundColor Gray
}

# Track moved files for reference updates
$movedFiles = @()

# Move TypeScript files
Write-Host "`n📦 Moving TypeScript files..." -ForegroundColor Blue
foreach ($file in $allTsFiles) {
    try {
        $targetPath = "ts\$($file.Name)"
        if (Test-Path $targetPath) {
            Write-Host "  ⚠️  $($file.Name) already exists in ts/ - skipping" -ForegroundColor Yellow
        } else {
            Move-Item $file.FullName "ts\" -Force
            $icon = if ($file.Extension -eq ".tsx") { "⚛️" } else { "📘" }
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

# Define file types that might contain TypeScript references
$fileTypesToScan = @('*.html', '*.css', '*.js', '*.md', '*.ts', '*.tsx', '*.json', '*.config.*', '*.rc.*')

$filesScanned = 0
$referencesUpdated = 0

foreach ($filePattern in $fileTypesToScan) {
    $filesToScan = Get-ChildItem -Recurse -Filter $filePattern | Where-Object { 
        $_.PSIsContainer -eq $false -and 
        $_.DirectoryName -notlike "*node_modules*" -and
        $_.DirectoryName -notlike "*\.git*" -and
        $_.DirectoryName -notlike "*dist*" -and
        $_.DirectoryName -notlike "*ts*"  # Don't update files inside ts folder
    }
    
    foreach ($file in $filesToScan) {
        try {
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            $originalContent = $content
            $fileUpdated = $false
            
            foreach ($tsName in $movedFiles) {
                # Update various reference patterns for TypeScript files
                $patterns = @(
                    # Direct references: component.ts -> ts/component.ts
                    "(?<!ts/)(?<!['""`"])$([regex]::Escape($tsName))(?!['""`"])",
                    # Quoted references: "component.ts" -> "ts/component.ts"
                    "`"$([regex]::Escape($tsName))`"",
                    # Single quoted: 'component.ts' -> 'ts/component.ts'
                    "'$([regex]::Escape($tsName))'",
                    # Import statements: import from "./component.ts" -> import from "./ts/component.ts"
                    "import\s+.*\s+from\s+`"\./($([regex]::Escape($tsName)))`"",
                    "import\s+.*\s+from\s+'\./($([regex]::Escape($tsName)))'"
                    # Dynamic imports: import("./component.ts") -> import("./ts/component.ts")
                    "import\(`"\./($([regex]::Escape($tsName)))`"\)",
                    "import\('\./($([regex]::Escape($tsName)))'\)",
                    # Require statements (if any): require("./component.ts") -> require("./ts/component.ts")
                    "require\(`"\./($([regex]::Escape($tsName)))`"\)",
                    "require\('\./($([regex]::Escape($tsName)))'\)",
                    # TypeScript config references: "files": ["component.ts"] -> "files": ["ts/component.ts"]
                    "`"files`":\s*\[\s*`"$([regex]::Escape($tsName))`"",
                    "`"include`":\s*\[\s*`"$([regex]::Escape($tsName))`"",
                    # Script tags: <script src="component.ts"> -> <script src="ts/component.ts">
                    "src=`"$([regex]::Escape($tsName))`"",
                    # Vite/Webpack entry points
                    "entry:\s*`"$([regex]::Escape($tsName))`"",
                    "entry:\s*'$([regex]::Escape($tsName))'",
                    # Path mappings in tsconfig
                    "`"@/($([regex]::Escape($tsName)))`"",
                    # Module resolution
                    "resolve\(`"$([regex]::Escape($tsName))`"\)",
                    "resolve\('$([regex]::Escape($tsName))'\)"
                )
                
                $replacements = @(
                    "ts/$tsName",
                    "`"ts/$tsName`"",
                    "'ts/$tsName'",
                    "import `$1 from `"./ts/$tsName`"",
                    "import `$1 from './ts/$tsName'",
                    "import(`"./ts/$tsName`")",
                    "import('./ts/$tsName')",
                    "require(`"./ts/$tsName`")",
                    "require('./ts/$tsName')",
                    "`"files`": [`"ts/$tsName`"",
                    "`"include`": [`"ts/$tsName`"",
                    "src=`"ts/$tsName`"",
                    "entry: `"ts/$tsName`"",
                    "entry: 'ts/$tsName'",
                    "`"@/ts/$tsName`"",
                    "resolve(`"ts/$tsName`")",
                    "resolve('ts/$tsName')"
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
Write-Host "  📘 TypeScript files moved: $($movedFiles.Count)" -ForegroundColor Green
Write-Host "  📄 Files scanned: $filesScanned" -ForegroundColor Cyan
Write-Host "  🔄 Files with updated references: $referencesUpdated" -ForegroundColor Green

Write-Host "`nMoved TypeScript files:" -ForegroundColor Blue
foreach ($ts in $movedFiles) {
    $icon = if ($ts.EndsWith(".tsx")) { "⚛️" } else { "📘" }
    Write-Host "  $icon $ts -> ts/$ts" -ForegroundColor Gray
}

# Show what's now in ts folder
Write-Host "`nContents of ts/ folder:" -ForegroundColor Blue
Get-ChildItem "ts" | ForEach-Object {
    $icon = if ($_.Extension -eq ".tsx") { "⚛️" } else { "📘" }
    Write-Host "  $icon $($_.Name)" -ForegroundColor Gray
}

# Show current root structure (should have no TS files)
Write-Host "`nRoot TypeScript files (should be empty):" -ForegroundColor Blue
$remainingTs = Get-ChildItem -Filter "*.ts"
$remainingTsx = Get-ChildItem -Filter "*.tsx"
$remainingAll = $remainingTs + $remainingTsx

if ($remainingAll.Count -eq 0) {
    Write-Host "  ✅ No TypeScript files remaining in root" -ForegroundColor Green
} else {
    foreach ($file in $remainingAll) {
        $icon = if ($file.Extension -eq ".tsx") { "⚛️" } else { "📘" }
        Write-Host "  $icon $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ TYPESCRIPT ORGANIZATION AND REFERENCE UPDATE COMPLETE!" -ForegroundColor Green

Write-Host "`nRecommendations:" -ForegroundColor Yellow
Write-Host "1. Update tsconfig.json baseUrl and paths if needed" -ForegroundColor Cyan
Write-Host "2. Test TypeScript compilation: tsc --noEmit" -ForegroundColor Cyan
Write-Host "3. Verify import statements resolve correctly" -ForegroundColor Cyan
Write-Host "4. Check Vite/Webpack build configurations" -ForegroundColor Cyan
Write-Host "5. Test any dynamic imports in your application" -ForegroundColor Cyan
Write-Host "6. Update IDE/editor workspace settings for new paths" -ForegroundColor Cyan

Read-Host "Press Enter to continue"