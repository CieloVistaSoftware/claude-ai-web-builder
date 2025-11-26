# Fix-HTML-Resource-Paths.ps1
param (
    [string]$Root = "."
)

function Test-ResourcePath {
    param ($HtmlFile, $ResourcePath)
    # Resolve relative path
    $BaseDir = Split-Path $HtmlFile
    $Resolved = Join-Path $BaseDir $ResourcePath
    return (Test-Path $Resolved)
}

function Fix-ResourcePath {
    param ($HtmlFile, $Tag, $Attr)
    Write-Host ("DEBUG: Processing file {0} for <{1} {2}>" -f $HtmlFile, $Tag, $Attr)
    $Content = Get-Content $HtmlFile -Raw
    $Pattern = '<' + $Tag + '[^>]*' + $Attr + '\s*=\s*[''"]([^''"]+)[''""]'
    $Matches = [regex]::Matches($Content, $Pattern)
    Write-Host ("DEBUG: Found {0} matches in {1}" -f $Matches.Count, $HtmlFile)
    foreach ($Match in $Matches) {
        $OrigPath = $Match.Groups[1].Value
        Write-Host ("DEBUG: Checking resource {0} in {1}" -f $OrigPath, $HtmlFile)
        # Ignore external URLs
        if ($OrigPath -match '^(http|https)://') {
            Write-Host ("DEBUG: Skipping external resource {0}" -f $OrigPath)
            continue
        }
        $global:AllRefs += "{0} {1} in {2}: {3}" -f $Tag, $Attr, $HtmlFile, $OrigPath
        if (Test-ResourcePath $HtmlFile $OrigPath) {
            Write-Host ("Verified {0} {1} in {2}: {3}" -f $Tag, $Attr, $HtmlFile, $OrigPath)
        } else {
            # Try to find correct file in project
            $FileName = Split-Path $OrigPath -Leaf
            $Found = Get-ChildItem $Root -Recurse -File | Where-Object { $_.Name -eq $FileName }
            if ($Found) {
                $RelPath = Resolve-Path -Relative -Path $Found.FullName -RelativeTo (Split-Path $HtmlFile)
                $Content = $Content -replace [regex]::Escape($OrigPath), $RelPath
                Write-Host ("Fixed {0} {1} in {2}: {3} -> {4}" -f $Tag, $Attr, $HtmlFile, $OrigPath, $RelPath)
            } else {
                Write-Host ("Missing {0} {1} in {2}: {3}" -f $Tag, $Attr, $HtmlFile, $OrigPath)
            }
        }
    }
    Set-Content $HtmlFile $Content
}

# Main loop
$global:AllRefs = @()
$HtmlFiles = Get-ChildItem $Root -Recurse -Filter *.html
foreach ($File in $HtmlFiles) {
    Fix-ResourcePath $File.FullName "link" "href"
    Fix-ResourcePath $File.FullName "script" "src"
    Fix-ResourcePath $File.FullName "img" "src"
    # Add more tags/attributes as needed (e.g., import statements in <script type="module">)
}

Write-Host "\n--- Non-External Resource References ---"
$global:AllRefs | ForEach-Object { Write-Host $_ }
Write-Host "Resource path correction complete."