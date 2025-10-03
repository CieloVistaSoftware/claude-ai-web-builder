# Node Modules Consolidation Script
# Safely removes duplicate node_modules folders while preserving the main root one

Write-Host "🔍 Node Modules Consolidation Analysis" -ForegroundColor Cyan
Write-Host "=====================================`n"

# List all node_modules folders found
Write-Host "📂 Current node_modules folders found:" -ForegroundColor Yellow
$nodeModulesFolders = Get-ChildItem -Path . -Name "node_modules" -Recurse -Directory -ErrorAction SilentlyContinue

# Filter to get only the top-level ones (not nested dependencies)
$topLevelFolders = @()
foreach ($folder in $nodeModulesFolders) {
    $path = $folder
    # Skip nested node_modules inside other node_modules
    if (($path -split "\\node_modules\\").Count -eq 1) {
        $topLevelFolders += $path
        $fullPath = Join-Path (Get-Location) $path
        $size = (Get-ChildItem $fullPath -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $sizeGB = [math]::Round($size / 1GB, 2)
        Write-Host "   ✓ $path ($sizeGB GB)" -ForegroundColor Green
    }
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "   Total top-level node_modules folders: $($topLevelFolders.Count)"
Write-Host "   Target: Keep only 1 (root folder)"
Write-Host "   To remove: $($topLevelFolders.Count - 1) folders`n"

# Define which folders to keep and remove
$keepFolder = "node_modules"  # Root folder
$foldersToRemove = $topLevelFolders | Where-Object { $_ -ne $keepFolder }

Write-Host "📋 Consolidation Plan:" -ForegroundColor Yellow
Write-Host "   KEEP:   ./$keepFolder (main dependencies)" -ForegroundColor Green

if ($foldersToRemove.Count -gt 0) {
    Write-Host "   REMOVE:" -ForegroundColor Red
    foreach ($folder in $foldersToRemove) {
        Write-Host "     - ./$folder" -ForegroundColor Red
    }
    
    Write-Host "`n⚠️  WARNING: This will permanently delete the folders listed above!" -ForegroundColor Yellow
    Write-Host "   Make sure you have backups if needed.`n"
    
    $confirmation = Read-Host "Do you want to proceed with the deletion? (y/N)"
    
    if ($confirmation -eq "y" -or $confirmation -eq "Y") {
        Write-Host "`n🗑️  Removing duplicate node_modules folders..." -ForegroundColor Cyan
        
        foreach ($folder in $foldersToRemove) {
            $fullPath = Join-Path (Get-Location) $folder
            if (Test-Path $fullPath) {
                Write-Host "   Removing: $folder" -ForegroundColor Yellow
                try {
                    Remove-Item $fullPath -Recurse -Force
                    Write-Host "   ✓ Removed: $folder" -ForegroundColor Green
                } catch {
                    Write-Host "   ❌ Failed to remove: $folder - $($_.Exception.Message)" -ForegroundColor Red
                }
            } else {
                Write-Host "   ⚠️  Path not found: $folder" -ForegroundColor Yellow
            }
        }
        
        Write-Host "`n✅ Consolidation complete!" -ForegroundColor Green
        Write-Host "   Remaining node_modules: ./$keepFolder"
        
        # Verify final state
        Write-Host "`n🔍 Final verification:" -ForegroundColor Cyan
        $remainingFolders = Get-ChildItem -Path . -Name "node_modules" -Recurse -Directory -ErrorAction SilentlyContinue | Where-Object { ($_ -split "\\node_modules\\").Count -eq 1 }
        Write-Host "   Top-level node_modules folders remaining: $($remainingFolders.Count)"
        foreach ($folder in $remainingFolders) {
            Write-Host "   ✓ $folder" -ForegroundColor Green
        }
        
    } else {
        Write-Host "`n❌ Consolidation cancelled by user." -ForegroundColor Yellow
        Write-Host "   No folders were modified."
    }
} else {
    Write-Host "`n✅ No duplicate folders found!" -ForegroundColor Green
    Write-Host "   Only the root node_modules folder exists."
}

Write-Host "`n📝 Note: The nested node_modules folders inside dependencies are normal and were left untouched." -ForegroundColor Cyan
Write-Host "========================================`n"