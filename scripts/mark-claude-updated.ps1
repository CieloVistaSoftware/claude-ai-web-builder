# Mark a claude.md file with a status marker
# Usage: .\scripts\mark-claude-updated.ps1 -FilePath "path/to/claude.md" -Status "UPDATED"

param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("NEW", "UPDATED", "READ", "ARCHIVED")]
    [string]$Status = "UPDATED"
)

# Resolve full path
$fullPath = $FilePath
if (-not [System.IO.Path]::IsPathRooted($FilePath)) {
    $fullPath = Join-Path (Get-Location) $FilePath
}

# Check if file exists
if (-not (Test-Path $fullPath)) {
    Write-Host "❌ File not found: $fullPath" -ForegroundColor Red
    exit 1
}

# Check if it's a claude.md file
if ($fullPath -notlike "*claude.md") {
    Write-Host "⚠️ Warning: File doesn't appear to be a claude.md file" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Cancelled." -ForegroundColor Gray
        exit 0
    }
}

try {
    # Read entire file
    $content = Get-Content $fullPath -Raw -ErrorAction Stop
    
    # Check if marker exists
    if ($content -match "^<!--\s*STATUS:\s*\w+\s*-->") {
        # Replace existing marker
        $content = $content -replace "^<!--\s*STATUS:\s*\w+\s*-->", "<!-- STATUS: $Status -->"
        Write-Host "✅ Updated existing marker to: $Status" -ForegroundColor Green
    }
    else {
        # Add marker at top
        $content = "<!-- STATUS: $Status -->`n" + $content
        Write-Host "✅ Added new marker: $Status" -ForegroundColor Green
    }
    
    # Write back to file
    Set-Content -Path $fullPath -Value $content -NoNewline -ErrorAction Stop
    
    # Show status indicator
    switch ($Status) {
        "NEW"      { Write-Host "🔴 Status: NEW - Will be aggregated on next run" -ForegroundColor Red }
        "UPDATED"  { Write-Host "🟡 Status: UPDATED - Will be aggregated on next run" -ForegroundColor Yellow }
        "READ"     { Write-Host "✅ Status: READ - No aggregation needed" -ForegroundColor Green }
        "ARCHIVED" { Write-Host "⚫ Status: ARCHIVED - Will be skipped" -ForegroundColor Gray }
    }
    
    Write-Host "📝 File updated: $fullPath" -ForegroundColor Cyan
    
    # Show relative path for easier reading
    $projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"
    $relativePath = $fullPath.Replace($projectRoot, "").TrimStart('\')
    Write-Host "📁 Location: $relativePath`n" -ForegroundColor White
    
    exit 0
}
catch {
    Write-Host "❌ Error updating file: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
