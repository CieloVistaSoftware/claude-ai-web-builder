# Enhanced Test Path Fix Script

# Define log file
$logFile = Join-Path $PSScriptRoot "test-fix-log.txt"
"Starting enhanced test path fixes at $(Get-Date)" | Out-File -FilePath $logFile

function Write-LogAndConsole {
    param (
        [string]$message
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Out-File -FilePath $logFile -Append
    Write-Host $message
}

# Function to create a sorted docs index file
function Update-DocsIndex {
    param (
        [string]$docsPath
    )
    
    Write-LogAndConsole "Sorting docs folder by modification time..."
    
    # Get all markdown and text files in the docs directory
    $docFiles = Get-ChildItem -Path $docsPath -Include *.md,*.txt,*.html,*.json -File | 
               Sort-Object LastWriteTime -Descending
    
    # Create HTML index
    $htmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation Index (Sorted by Last Update)</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            border-bottom: 2px solid #eaecef;
            padding-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            text-align: left;
        }
        th {
            background-color: #f6f8fa;
        }
        tr:hover {
            background-color: #f6f8fa;
        }
        .recent {
            color: #28a745;
            font-weight: bold;
        }
        .older {
            color: #6c757d;
        }
        .very-old {
            color: #adb5bd;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .timestamp {
            font-family: monospace;
            white-space: nowrap;
        }
        .file-type {
            color: #6c757d;
            font-size: 0.9em;
        }
        .summary {
            font-size: 0.9em;
            color: #6c757d;
            max-width: 400px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>
</head>
<body>
    <h1>Documentation Index</h1>
    <p>Files sorted by last modification time. Most recently updated files appear first.</p>
    <table>
        <thead>
            <tr>
                <th>File Name</th>
                <th>Last Updated</th>
                <th>Type</th>
                <th>Summary</th>
            </tr>
        </thead>
        <tbody>
"@

    # Current time for comparison
    $now = Get-Date
    
    # Add each file to the index
    foreach ($file in $docFiles) {
        $relativePath = $file.FullName.Replace($PSScriptRoot, "").TrimStart("\")
        $lastWriteTime = $file.LastWriteTime
        $daysSinceModified = ($now - $lastWriteTime).Days
        
        # Determine how recent the file is
        $timeClass = if ($daysSinceModified -lt 7) {
            "recent"
        } elseif ($daysSinceModified -lt 30) {
            "older"
        } else {
            "very-old"
        }
        
        # Get file extension without the dot
        $fileType = $file.Extension.TrimStart(".")
        
        # Get a summary from the file (first 100 characters)
        $summary = ""
        try {
            $content = Get-Content -Path $file.FullName -Raw
            if ($content) {
                $summary = $content.Substring(0, [Math]::Min(100, $content.Length))
                $summary = $summary -replace "`n", " " -replace "`r", " " -replace "<.*?>", ""
                if ($content.Length -gt 100) { $summary += "..." }
            }
        } catch {
            $summary = "Could not extract summary"
        }
        
        $formattedDate = $lastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
        
        $htmlContent += @"
            <tr>
                <td><a href="/$relativePath">$($file.Name)</a></td>
                <td class="timestamp $timeClass">$formattedDate</td>
                <td class="file-type">$fileType</td>
                <td class="summary">$summary</td>
            </tr>
"@
    }
    
    $htmlContent += @"
        </tbody>
    </table>
    <p><em>Index generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")</em></p>
</body>
</html>
"@

    # Write the HTML to an index file
    $indexPath = Join-Path $docsPath "index.html"
    $htmlContent | Out-File -FilePath $indexPath -Encoding UTF8
    
    Write-LogAndConsole "Created docs index at $indexPath"
    
    # Also create a simple markdown version
    $markdownContent = "# Documentation Index`n`n"
    $markdownContent += "Files sorted by most recent update (as of $(Get-Date -Format 'yyyy-MM-dd'))`n`n"
    
    foreach ($file in $docFiles) {
        $relativePath = $file.FullName.Replace($PSScriptRoot, "").TrimStart("\")
        $formattedDate = $file.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
        $markdownContent += "* [$($file.Name)](./$($file.Name)) - $formattedDate`n"
    }
    
    $markdownIndexPath = Join-Path $docsPath "INDEX.md"
    $markdownContent | Out-File -FilePath $markdownIndexPath -Encoding UTF8
    
    Write-LogAndConsole "Created markdown index at $markdownIndexPath"
}

# Path mappings: old path -> new path
$pathMappings = @{
    "/wb.html" = "./wb.html"
    "/website-builder.html" = "/pages/wizard/website-builder.html"
    "/website_template_generator.html" = "/html/pages/website_template_generator.html"
    "/test-dynamic-pages.html" = "/html/pages/test-dynamic-pages.html"
    "/themes/theme-generator.html" = "/themes/generator/index.html"
    "/themes/generator/component/" = "/themes/components/"
}

# Process all .ts files in the Tests directory and subdirectories
$testFiles = Get-ChildItem -Path (Join-Path $PSScriptRoot "Tests") -Filter "*.ts" -Recurse

$totalFiles = $testFiles.Count
$filesUpdated = 0

Write-LogAndConsole "Found $totalFiles test files to process"

foreach ($file in $testFiles) {    $content = Get-Content -Path $file.FullName -Raw
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
        
        # Replace URL paths in strings
        if ($content -match [regex]::Escape("'$oldPath'") -or 
            $content -match [regex]::Escape("`"$oldPath`"")) {
            $content = $content -replace [regex]::Escape("'$oldPath'"), "'$newPath'"
            $content = $content -replace [regex]::Escape("`"$oldPath`""), "`"$newPath`""
            $modified = $true
        }
        
        # Replace paths in request calls
        if ($content -match [regex]::Escape("request.get('$oldPath')") -or 
            $content -match [regex]::Escape("request.get(`"$oldPath`")")) {
            $content = $content -replace [regex]::Escape("request.get('$oldPath')"), "request.get('$newPath')"
            $content = $content -replace [regex]::Escape("request.get(`"$oldPath`")"), "request.get(`"$newPath`")"
            $modified = $true
        }
        
        # Replace paths in url expectations
        if ($content -match [regex]::Escape("toContain('$oldPath')") -or 
            $content -match [regex]::Escape("toContain(`"$oldPath`")")) {
            $content = $content -replace [regex]::Escape("toContain('$oldPath')"), "toContain('$newPath')"
            $content = $content -replace [regex]::Escape("toContain(`"$oldPath`")"), "toContain(`"$newPath`")"
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

# Also add copies of old files to maintain compatibility during transition
Write-LogAndConsole "Creating compatibility links for moved theme files..."

# Ensure old theme-generator.html redirects to new location
$themeGeneratorContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Theme Generator - Redirecting</title>
    <meta http-equiv="refresh" content="0;url=/themes/generator/index.html">
    <script>
        window.location.href = '/themes/generator/index.html';
    </script>
</head>
<body>
    <p>Redirecting to <a href="/themes/generator/index.html">Theme Generator</a>...</p>
</body>
</html>
"@

$themeGeneratorPath = Join-Path $PSScriptRoot "themes/theme-generator.html"
if (-not (Test-Path $themeGeneratorPath)) {
    $themeGeneratorContent | Out-File -FilePath $themeGeneratorPath -Encoding UTF8
    Write-LogAndConsole "Created compatibility redirect for theme-generator.html"
}

# Generate the docs index sorted by modification time
$docsPath = Join-Path $PSScriptRoot "docs"
if (Test-Path $docsPath) {
    Update-DocsIndex -docsPath $docsPath
    Write-LogAndConsole "Docs folder has been indexed and sorted by modification time"
}

Write-LogAndConsole "Enhanced test path fixes completed!"
