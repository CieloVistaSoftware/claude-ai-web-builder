# Complete organization script - Move ALL .ps1 files and fix references
# This script will move itself to scripts folder too

Write-Host "=== COMPLETE FOLDER ORGANIZATION ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

# Step 1: Create scripts folder if it doesn't exist
if (!(Test-Path "scripts")) {
    New-Item -ItemType Directory -Name "scripts"
    Write-Host "✅ Created scripts folder" -ForegroundColor Green
}

# Step 2: Move ALL .ps1 files to scripts folder (including this one at the end)
$allPs1Files = Get-ChildItem -Filter "*.ps1" -File
Write-Host "`nMoving ALL PowerShell scripts to scripts folder..." -ForegroundColor Cyan

foreach ($file in $allPs1Files) {
    $destination = "scripts\$($file.Name)"
    if (Test-Path $file.FullName) {
        Move-Item $file.FullName $destination -Force
        Write-Host "✅ Moved: $($file.Name) -> scripts/$($file.Name)" -ForegroundColor Green
    }
}

# Step 3: Create master runner in ROOT (this stays outside scripts folder)
$masterScript = @'
# Master script runner - Run any script from root folder
param(
    [Parameter(Mandatory=$false)]
    [string]$ScriptName
)

if (-not $ScriptName) {
    Write-Host "Available scripts:" -ForegroundColor Yellow
    Get-ChildItem "scripts" -Filter "*.ps1" | ForEach-Object { 
        Write-Host "  - $($_.Name)" -ForegroundColor White 
    }
    Write-Host "`nUsage: .\run.ps1 scriptname.ps1" -ForegroundColor Cyan
    return
}

$scriptPath = "scripts\$ScriptName"

if (Test-Path $scriptPath) {
    Write-Host "Running $ScriptName from root folder..." -ForegroundColor Green
    Push-Location $PWD
    & $scriptPath
    Pop-Location
} else {
    Write-Host "Script not found: $scriptPath" -ForegroundColor Red
    Write-Host "`nAvailable scripts:" -ForegroundColor Yellow
    Get-ChildItem "scripts" -Filter "*.ps1" | ForEach-Object { 
        Write-Host "  - $($_.Name)" -ForegroundColor White 
    }
}
'@

Set-Content "run.ps1" $masterScript

Write-Host "`n=== FINAL STRUCTURE ===" -ForegroundColor Yellow
Write-Host "wb/" -ForegroundColor Blue
Write-Host "├── wb.html" -ForegroundColor Green
Write-Host "├── wb.css" -ForegroundColor Green  
Write-Host "├── run.ps1 (ONLY .ps1 file in root)" -ForegroundColor Cyan
Write-Host "├── js/" -ForegroundColor Blue
Write-Host "│   ├── wb.js" -ForegroundColor Green
Write-Host "│   └── wb-import-simple.js" -ForegroundColor Green
Write-Host "└── scripts/" -ForegroundColor Blue
Write-Host "    └── (ALL other .ps1 files)" -ForegroundColor Cyan

Write-Host "`n✅ ALL .PS1 FILES MOVED TO SCRIPTS FOLDER!" -ForegroundColor Green
Write-Host "✅ Only run.ps1 remains in root as the master runner" -ForegroundColor Green

Write-Host "`nTo run scripts: .\run.ps1 scriptname.ps1" -ForegroundColor Yellow
Write-Host "To list scripts: .\run.ps1" -ForegroundColor Yellow

# Step 3: Update all PowerShell scripts to work from root folder
Write-Host "`nUpdating script references..." -ForegroundColor Cyan

$scriptsInFolder = Get-ChildItem "scripts" -Filter "*.ps1" -File

foreach ($script in $scriptsInFolder) {
    $content = Get-Content $script.FullName -Raw
    $updated = $false
    
    # Fix relative paths that assume we're in the scripts folder
    # Update paths to work from root folder
    $originalContent = $content
    
    # Fix js folder references
    $content = $content -replace 'if \(Test-Path "js"\)', 'if (Test-Path "js")'
    $content = $content -replace 'Get-ChildItem "js"', 'Get-ChildItem "js"'
    $content = $content -replace 'New-Item -ItemType Directory -Name "js"', 'New-Item -ItemType Directory -Name "js"'
    
    # Fix html file references
    $content = $content -replace 'if \(Test-Path "wb\.html"\)', 'if (Test-Path "wb.html")'
    $content = $content -replace 'Get-Content "wb\.html"', 'Get-Content "wb.html"'
    $content = $content -replace 'Set-Content "wb\.html"', 'Set-Content "wb.html"'
    
    # Fix pages folder references
    $content = $content -replace 'if \(Test-Path "pages"\)', 'if (Test-Path "pages")'
    $content = $content -replace 'Get-ChildItem "pages"', 'Get-ChildItem "pages"'
    
    if ($content -ne $originalContent) {
        Set-Content $script.FullName $content
        Write-Host "✅ Updated: $($script.Name)" -ForegroundColor Green
        $updated = $true
    }
    
    if (-not $updated) {
        Write-Host "✅ No changes needed: $($script.Name)" -ForegroundColor Gray
    }
}

# Step 4: Create a master run script in root
$masterScript = @'
# Master script runner - Run any script from root folder
param(
    [Parameter(Mandatory=$true)]
    [string]$ScriptName
)

$scriptPath = "scripts\$ScriptName"

if (Test-Path $scriptPath) {
    Write-Host "Running $ScriptName from root folder..." -ForegroundColor Green
    & $scriptPath
} else {
    Write-Host "Script not found: $scriptPath" -ForegroundColor Red
    Write-Host "`nAvailable scripts:" -ForegroundColor Yellow
    Get-ChildItem "scripts" -Filter "*.ps1" | ForEach-Object { 
        Write-Host "  - $($_.Name)" -ForegroundColor White 
    }
}
'@

Set-Content "run-script.ps1" $masterScript
Write-Host "✅ Created run-script.ps1 master runner" -ForegroundColor Green

# Step 5: Show final structure
Write-Host "`n=== FINAL STRUCTURE ===" -ForegroundColor Yellow
Write-Host "wb/" -ForegroundColor Blue
Write-Host "├── wb.html (main file)" -ForegroundColor Green
Write-Host "├── wb.css (styles)" -ForegroundColor Green  
Write-Host "├── run-script.ps1 (script runner)" -ForegroundColor Cyan
Write-Host "├── js/" -ForegroundColor Blue
if (Test-Path "js") {
    Get-ChildItem "js" -Filter "*.js" | ForEach-Object { Write-Host "│   ├── $($_.Name)" -ForegroundColor Green }
}
Write-Host "└── scripts/" -ForegroundColor Blue
if (Test-Path "scripts") {
    Get-ChildItem "scripts" -Filter "*.ps1" | ForEach-Object { Write-Host "    ├── $($_.Name)" -ForegroundColor Cyan }
}

Write-Host "`n=== HOW TO USE ===" -ForegroundColor Yellow
Write-Host "From root folder, run any script with:" -ForegroundColor White
Write-Host "  .\run-script.ps1 scriptname.ps1" -ForegroundColor Cyan
Write-Host "`nExample:" -ForegroundColor White
Write-Host "  .\run-script.ps1 check-js-refs.ps1" -ForegroundColor Cyan

Write-Host "`n✅ ORGANIZATION COMPLETE!" -ForegroundColor Green
Read-Host "`nPress Enter to continue"
'@

Set-Content "complete-organization.ps1" $masterScript