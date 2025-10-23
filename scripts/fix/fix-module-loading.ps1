# Fix ES6 module loading in wb-* component demos
# This script updates all wb-* demo HTML files to load component JS files as modules

$componentsDir = "c:\Users\jwpmi\Downloads\AI\wb\components"

# Get all wb-* directories with demo files
$wbDirs = Get-ChildItem -Directory wb-* -Path $componentsDir

foreach ($dir in $wbDirs) {
    $demoFiles = Get-ChildItem "$($dir.FullName)/*-demo.html"
    foreach ($demoFile in $demoFiles) {
        Write-Host "Processing $($demoFile.FullName)"

        # Read the file content
        $content = Get-Content $demoFile.FullName -Raw

        # Find script tags that load local JS files (not external URLs)
        $scriptPattern = '<script src="([^"]*\.js)"></script>'
        $matches = [regex]::Matches($content, $scriptPattern)

        foreach ($match in $matches) {
            $scriptSrc = $match.Groups[1].Value

            # Skip external URLs (containing http/https or starting with /)
            if ($scriptSrc -notmatch '^https?://' -and $scriptSrc -notmatch '^/') {
                # Check if the JS file exists and has export statements
                $jsFilePath = Join-Path $dir.FullName $scriptSrc
                if (Test-Path $jsFilePath) {
                    $jsContent = Get-Content $jsFilePath -Raw
                    if ($jsContent -match 'export\s+') {
                        # Replace the script tag with type="module"
                        $oldScriptTag = '<script src="' + $scriptSrc + '"></script>'
                        $newScriptTag = '<script type="module" src="' + $scriptSrc + '"></script>'

                        $content = $content -replace [regex]::Escape($oldScriptTag), $newScriptTag
                        Write-Host "  Fixed: $scriptSrc -> module"
                    }
                }
            }
        }

        # Write back the updated content
        Set-Content $demoFile.FullName $content
    }
}

Write-Host "All wb-* component demos have been updated to use ES6 modules."