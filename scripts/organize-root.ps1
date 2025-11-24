# WB Root Directory Organization Script
# Moves loose files into appropriate subdirectories

$rootPath = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "=== WB Root Organization ===" -ForegroundColor Cyan
Write-Host ""

# Create directories if they don't exist
$directories = @{
    "scripts\cleanup" = "Cleanup scripts"
    "demos" = "Demo HTML files"
}

Write-Host "Creating directories..." -ForegroundColor Yellow
foreach ($dir in $directories.Keys) {
    $fullPath = Join-Path $rootPath $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -Path $fullPath -ItemType Directory -Force | Out-Null
        Write-Host "  ✓ Created: $dir - $($directories[$dir])" -ForegroundColor Green
    } else {
        Write-Host "  → Exists: $dir" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Moving files..." -ForegroundColor Yellow

# Cleanup scripts → scripts/cleanup/
$cleanupScripts = @(
    @{ File = "cleanup-duplicates.ps1"; Desc = "Cleanup script" },
    @{ File = "run-cleanup.bat"; Desc = "Cleanup batch file" }
)

foreach ($item in $cleanupScripts) {
    $sourcePath = Join-Path $rootPath $item.File
    $destPath = Join-Path $rootPath "scripts\cleanup\$($item.File)"
    
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✓ Moved: $($item.File) → scripts/cleanup/" -ForegroundColor Green
        Write-Host "    ($($item.Desc))" -ForegroundColor Gray
    }
}

# Component loader → build/
$buildFiles = @(
    @{ File = "component-loader.js"; Desc = "Component loader script" },
    @{ File = "COMPONENT-LOADER.md"; Desc = "Component loader docs" }
)

foreach ($item in $buildFiles) {
    $sourcePath = Join-Path $rootPath $item.File
    $destPath = Join-Path $rootPath "build\$($item.File)"
    
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✓ Moved: $($item.File) → build/" -ForegroundColor Green
        Write-Host "    ($($item.Desc))" -ForegroundColor Gray
    }
}

# Configs → config/
$configFiles = @(
    @{ File = "components.config.json"; Desc = "Components configuration" }
)

foreach ($item in $configFiles) {
    $sourcePath = Join-Path $rootPath $item.File
    $destPath = Join-Path $rootPath "config\$($item.File)"
    
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✓ Moved: $($item.File) → config/" -ForegroundColor Green
        Write-Host "    ($($item.Desc))" -ForegroundColor Gray
    }
}

# Generated data → data/
$dataFiles = @(
    @{ File = "knowledge-base.json"; Desc = "Generated knowledge base" }
)

foreach ($item in $dataFiles) {
    $sourcePath = Join-Path $rootPath $item.File
    $destPath = Join-Path $rootPath "data\$($item.File)"
    
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✓ Moved: $($item.File) → data/" -ForegroundColor Green
        Write-Host "    ($($item.Desc))" -ForegroundColor Gray
    }
}

# Demo HTML → demos/
$demoFiles = @(
    @{ File = "index-enhanced.html"; Desc = "Enhanced color harmony demo" }
)

foreach ($item in $demoFiles) {
    $sourcePath = Join-Path $rootPath $item.File
    $destPath = Join-Path $rootPath "demos\$($item.File)"
    
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✓ Moved: $($item.File) → demos/" -ForegroundColor Green
        Write-Host "    ($($item.Desc))" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Organization Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files moved:" -ForegroundColor Yellow
Write-Host "  • Cleanup scripts → scripts/cleanup/" -ForegroundColor Gray
Write-Host "  • Component loader → build/" -ForegroundColor Gray
Write-Host "  • Config files → config/" -ForegroundColor Gray
Write-Host "  • Generated data → data/" -ForegroundColor Gray
Write-Host "  • Demo files → demos/" -ForegroundColor Gray
Write-Host ""
Write-Host "Root directory now contains only:" -ForegroundColor Yellow
Write-Host "  • Core configs (package.json, tsconfig.json, etc.)" -ForegroundColor Gray
Write-Host "  • Main entry point (index.html, index.js, index.css)" -ForegroundColor Gray
Write-Host "  • Documentation (README.md, CHANGELOG.md, etc.)" -ForegroundColor Gray
Write-Host "  • Essential configs (.gitignore, .env.example, etc.)" -ForegroundColor Gray
Write-Host ""
