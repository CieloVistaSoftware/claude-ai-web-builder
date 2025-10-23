# Rename claude file to mark status - v3 format (claude.<STATUS>.md)
# Status code comes AFTER "claude"

param(
    [Parameter(Mandatory=$true)]
    [string]$Path,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("NEW", "UPD", "OK", "ARC")]
    [string]$Status = "UPD"
)

# Resolve full path
$fullPath = $Path
if (-not [System.IO.Path]::IsPathRooted($Path)) {
    $fullPath = Join-Path (Get-Location) $Path
    if (Test-Path $fullPath) {
        $fullPath = Resolve-Path $fullPath
    }
}

if (-not (Test-Path $fullPath)) {
    Write-Host "❌ File not found: $fullPath" -ForegroundColor Red
    exit 1
}

# Get directory and current filename
$directory = Split-Path $fullPath -Parent
$currentFilename = Split-Path $fullPath -Leaf

# Build new filename: claude.<STATUS>.md
$newFilename = "claude.$Status.md"
$newPath = Join-Path $directory $newFilename

# Check if already at target status
if ($currentFilename -eq $newFilename) {
    Write-Host "✅ File already has status: $Status" -ForegroundColor Green
    $projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"
    $relativePath = $fullPath.Replace($projectRoot, "").TrimStart('\')
    Write-Host "📁 Location: $relativePath`n" -ForegroundColor White
    exit 0
}

# Verify it's a claude file
if ($currentFilename -notmatch "^claude\.\w+\.md$" -and $currentFilename -ne "claude.md" -and $currentFilename -ne "CLAUDE.md") {
    Write-Host "⚠️ Warning: File doesn't match claude.*.md pattern: $currentFilename" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Gray
        exit 0
    }
}

# Check if target file already exists
if ((Test-Path $newPath) -and ($fullPath -ne $newPath)) {
    Write-Host "❌ Target file already exists: $newPath" -ForegroundColor Red
    Write-Host "   Please resolve this conflict manually." -ForegroundColor Yellow
    exit 1
}

# Rename the file
try {
    Rename-Item -Path $fullPath -NewName $newFilename -ErrorAction Stop
    
    Write-Host "✅ Successfully renamed:" -ForegroundColor Green
    Write-Host "   From: $currentFilename" -ForegroundColor Gray
    Write-Host "   To:   $newFilename" -ForegroundColor Cyan
    
    # Show status indicator
    switch ($Status) {
        "NEW" { Write-Host "`n🔴 Status: NEW - Will be aggregated on next run" -ForegroundColor Red }
        "UPD" { Write-Host "`n🟡 Status: UPDATED - Will be aggregated on next run" -ForegroundColor Yellow }
        "OK"  { Write-Host "`n✅ Status: CURRENT - No aggregation needed" -ForegroundColor Green }
        "ARC" { Write-Host "`n⚫ Status: ARCHIVED - Will be skipped" -ForegroundColor Gray }
    }
    
    # Show location
    $projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"
    $relativePath = $newPath.Replace($projectRoot, "").TrimStart('\')
    Write-Host "📁 Location: $relativePath`n" -ForegroundColor White
    
    Write-Host "💡 Tip: Run 'npm run check-status' to see updated count" -ForegroundColor Cyan
    Write-Host ""
    
    exit 0
}
catch {
    Write-Host "❌ Error renaming file: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
