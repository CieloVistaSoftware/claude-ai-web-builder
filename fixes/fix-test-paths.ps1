# Test Path Fix Script

# Define log file
$logFile = Join-Path $PSScriptRoot "test-fix-log.txt"
"Starting test path fixes at $(Get-Date)" | Out-File -FilePath $logFile

function Write-LogAndConsole {
    param (
        [string]$message
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Out-File -FilePath $logFile -Append
    Write-Host $message
}

# Path mappings: old path -> new path
$pathMappings = @{
    "/wb.html" = "./wb.html"
    "/website-builder.html" = "/pages/wizard/website-builder.html"
    "/website_template_generator.html" = "/html/pages/website_template_generator.html"
    "/test-dynamic-pages.html" = "/html/pages/test-dynamic-pages.html"
}

# Process all .ts files in the Tests directory and subdirectories
$testFiles = Get-ChildItem -Path (Join-Path $PSScriptRoot "Tests") -Filter "*.ts" -Recurse

$totalFiles = $testFiles.Count
$filesUpdated = 0

Write-LogAndConsole "Found $totalFiles test files to process"

foreach ($file in $testFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $modified = $false

    foreach ($oldPath in $pathMappings.Keys) {
        $newPath = $pathMappings[$oldPath]
        
        # Replace direct page.goto calls
        if ($content -match [regex]::Escape("page.goto('$oldPath')") -or 
            $content -match [regex]::Escape("page.goto(`"$oldPath`")")) {
            $content = $content -replace [regex]::Escape("page.goto('$oldPath')"), "page.goto('$newPath')"
            $content = $content -replace [regex]::Escape("page.goto(`"$oldPath`")"), "page.goto(`"$newPath`")"
            $modified = $true
        }
    }

    # If the content was modified, write it back to the file
    if ($modified) {
        $content | Set-Content -Path $file.FullName -Encoding UTF8
        $filesUpdated++
        Write-LogAndConsole "Updated paths in $($file.FullName)"
    }
}

Write-LogAndConsole "Updated $filesUpdated of $totalFiles files"
Write-LogAndConsole "Test path fixes completed!"
