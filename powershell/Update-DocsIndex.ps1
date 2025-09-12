# Update Documentation Index Script
param(
    [string]$DocsPath = "../docs",
    [string]$OutputFile = "../docs/docs-index.json"
)

Write-Host "🔍 Updating documentation index..." -ForegroundColor Yellow

# Check if docs directory exists
if (-not (Test-Path $DocsPath)) {
    Write-Host "❌ Docs directory not found: $DocsPath" -ForegroundColor Red
    Write-Host "Creating docs directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $DocsPath -Force
}

# Get all markdown files in docs directory
$markdownFiles = Get-ChildItem -Path $DocsPath -Filter "*.md" -Recurse

Write-Host "📝 Found $($markdownFiles.Count) markdown files" -ForegroundColor Green

# Create index object
$docsIndex = @{
    "generated" = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    "totalFiles" = $markdownFiles.Count
    "files" = @()
}

# Process each markdown file
foreach ($file in $markdownFiles) {
    Write-Host "📄 Processing: $($file.Name)" -ForegroundColor Cyan
    
    try {
        # Read file content
        $content = Get-Content -Path $file.FullName -Raw -ErrorAction Stop
        
        # Extract title (first # heading)
        $titleMatch = [regex]::Match($content, '^#\s+(.+)', [System.Text.RegularExpressions.RegexOptions]::Multiline)
        $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value.Trim() } else { $file.BaseName }
        
        # Extract description (first paragraph after title)
        $lines = $content -split "`n" | Where-Object { $_.Trim() -ne "" }
        $description = ""
        $foundTitle = $false
        
        foreach ($line in $lines) {
            if ($line.StartsWith("#") -and -not $foundTitle) {
                $foundTitle = $true
                continue
            }
            if ($foundTitle -and -not $line.StartsWith("#") -and $line.Trim() -ne "") {
                $description = $line.Trim()
                break
            }
        }
        
        # Get relative path
        $relativePath = $file.FullName.Replace((Resolve-Path $DocsPath).Path, "").TrimStart("\", "/").Replace("\", "/")
        
        # Add to index
        $fileInfo = @{
            "name" = $file.Name
            "path" = $relativePath
            "title" = $title
            "description" = $description
            "size" = $file.Length
            "modified" = $file.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
        }
        
        $docsIndex.files += $fileInfo
        
    } catch {
        Write-Host "⚠️ Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Sort files by name
$docsIndex.files = $docsIndex.files | Sort-Object name

# Convert to JSON and save
try {
    $jsonOutput = $docsIndex | ConvertTo-Json -Depth 10 -Compress:$false
    
    # Ensure output directory exists
    $outputDir = Split-Path -Parent $OutputFile
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force
    }
    
    $jsonOutput | Out-File -FilePath $OutputFile -Encoding UTF8
    
    Write-Host "✅ Documentation index updated successfully!" -ForegroundColor Green
    Write-Host "📄 Output file: $OutputFile" -ForegroundColor Cyan
    Write-Host "📊 Total files indexed: $($docsIndex.files.Count)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error saving index file: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎯 Documentation index update complete!" -ForegroundColor Green