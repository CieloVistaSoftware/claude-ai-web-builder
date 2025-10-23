# Rename claude.md file to mark status using filename prefix
# Much faster than editing file content!

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
    $fullPath = Resolve-Path $fullPath -ErrorAction SilentlyContinue
}

if (-not $fullPath) {
    Write-Host "❌ Could not resolve path: $Path" -ForegroundColor Red
    exit 1
}

# Get directory and filename
$directory = Split-Path $fullPath -Parent
$filename = Split-Path $fullPath -Leaf

# Remove any existing prefix from filename
$cleanFilename = $filename -replace "^(NEW-|UPD-|OK-|ARC-)", ""

# Ensure it's a claude.md file (case-insensitive)
if ($cleanFilename -notmatch "^claude\.md$" -and $cleanFilename -notmatch "^CLAUDE\.md$") {
    Write-Host "⚠️ Warning: File doesn't appear to be a claude.md file: $cleanFilename" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Gray
        exit 0
    }
}

# Build new filename with prefix
$newFilename = "$Status-$cleanFilename"
$newFile = Join-Path $directory $newFilename

# Check if old file exists
if (-not (Test-Path $fullPath)) {
    Write-Host "❌ File not found: $fullPath" -ForegroundColor Red
    exit 1
}

# Check if we're already at the target name
if ($filename -eq $newFilename) {
    Write-Host "✅ File already has correct prefix: $Status-" -ForegroundColor Green
    $projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"
    $relativePath = $fullPath.Replace($projectRoot, "").TrimStart('\')
    Write-Host "📁 Location: $relativePath`n" -ForegroundColor White
    exit 0
}

# Check if new file already exists (shouldn't happen but be safe)
if (Test-Path $newFile) {
    Write-Host "❌ Target file already exists: $newFile" -ForegroundColor Red
    Write-Host "   Please resolve this conflict manually." -ForegroundColor Yellow
    exit 1
}

# Rename the file
try {
    Rename-Item -Path $fullPath -NewName $newFilename -ErrorAction Stop
    
    Write-Host "✅ Successfully renamed file:" -ForegroundColor Green
    Write-Host "   From: $filename" -ForegroundColor Gray
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
    $relativePath = $newFile.Replace($projectRoot, "").TrimStart('\')
    Write-Host "📁 Location: $relativePath`n" -ForegroundColor White
    
    Write-Host "💡 Tip: Run 'npm run check-status' to see updated status" -ForegroundColor Cyan
    Write-Host ""
    
    exit 0
}
catch {
    Write-Host "❌ Error renaming file: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
