# move-html-and-js.ps1
param(
    [string]$WbPath = (Get-Location)
)

$htmlDir = Join-Path $WbPath "html"

# Create html directory if it doesn't exist
if (-not (Test-Path $htmlDir)) {
    New-Item -ItemType Directory -Path $htmlDir | Out-Null
}

# Get all .html files in wb root (not subfolders)
$htmlFiles = Get-ChildItem -Path $WbPath -Filter *.html -File

foreach ($htmlFile in $htmlFiles) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($htmlFile.Name)
    $jsFile = Join-Path $WbPath "$baseName.js"

    # Move the .html file
    Move-Item -Path $htmlFile.FullName -Destination $htmlDir

    # If a .js file with the same base name exists, move it too
    if (Test-Path $jsFile) {
        Move-Item -Path $jsFile -Destination $htmlDir
    }
}
Write-Host "All .html and associated .js files moved to 'html/'."