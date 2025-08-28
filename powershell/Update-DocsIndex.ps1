# Update Documentation Index Script

<#
.SYNOPSIS
    This script generates an index of documentation files ordered by their last modification date.

.DESCRIPTION
    The script scans the docs directory, extracts metadata about each documentation file,
    and creates a JSON index sorted by the last modification time. This allows the documentation
    to be displayed with the most recently modified files first.

.EXAMPLE
    .\Update-DocsIndex.ps1
#>

# Ensure we're in the project root directory
$projectRoot = (Get-Item $PSScriptRoot).Parent.FullName
$docsDir = Join-Path $projectRoot "docs"

# Define log file
$logFile = Join-Path $projectRoot "docs-index-log.txt"
"Updating documentation index at $(Get-Date)" | Out-File -FilePath $logFile

function Write-LogAndConsole {
    param (
        [string]$message
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Out-File -FilePath $logFile -Append
    Write-Host $message
}

# Get all documentation files
$docFiles = Get-ChildItem -Path $docsDir -File -Recurse | Where-Object { 
    $_.Name -ne "index.html" -and 
    $_.Name -ne "docs-index.json" -and
    $_.Extension -in ".md", ".html", ".txt", ".pdf", ".docx"
}

Write-LogAndConsole "Found $($docFiles.Count) documentation files"

# Create file info objects with metadata
$fileInfoList = $docFiles | ForEach-Object {
    $relativePath = $_.FullName.Replace($docsDir, "").TrimStart("\")
    
    # Create friendly display name
    $displayName = $_.BaseName -replace "-", " " -replace "_", " "
    $displayName = (Get-Culture).TextInfo.ToTitleCase($displayName.ToLower())
    
    # Create object with file metadata
    [PSCustomObject]@{
        name = $relativePath
        displayName = $displayName
        lastModified = $_.LastWriteTime
        size = $_.Length
        extension = $_.Extension
    }
}

# Sort by last modified time (newest first)
$sortedFiles = $fileInfoList | Sort-Object -Property lastModified -Descending

# Convert to JSON
$jsonContent = $sortedFiles | ConvertTo-Json

# Save to JSON file
$jsonPath = Join-Path $docsDir "docs-index.json"
$jsonContent | Out-File -FilePath $jsonPath -Encoding UTF8

Write-LogAndConsole "Generated docs-index.json with $($sortedFiles.Count) entries"
Write-LogAndConsole "Documentation index updated successfully!"

# Open the HTML page in the default browser
$htmlPath = Join-Path $docsDir "index.html"
if (Test-Path $htmlPath) {
    Write-LogAndConsole "Documentation index updated at: $htmlPath"
    # Note: Auto-opening disabled to prevent interfering with main website
    # To view docs manually, visit: http://localhost:8000/docs/
} else {
    Write-LogAndConsole "Warning: Documentation index HTML page not found at: $htmlPath"
}
