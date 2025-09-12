# Move all .json files to json folder and update references
# Run from scripts folder

Write-Host "=== MOVING JSON FILES AND UPDATING REFERENCES ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Ensure json folder exists
if (-not (Test-Path "json")) {
    New-Item -ItemType Directory -Name "json" | Out-Null
    Write-Host "📁 Created json/ folder" -ForegroundColor Green
}

# Find all .json files in root directory
Write-Host "`n🔍 Scanning for JSON files in root directory..." -ForegroundColor Blue

$jsonFiles = Get-ChildItem -Filter "*.json" | Where-Object { 
    $_.PSIsContainer -eq $false 
}

if ($jsonFiles.Count -eq 0) {
    Write-Host "No JSON files found in root directory" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

Write-Host "Found $($jsonFiles.Count) JSON files to move:" -ForegroundColor Green
foreach ($file in $jsonFiles) {
    Write-Host "  📋 $($file.Name)" -ForegroundColor Gray
}

# Track moved files for reference updates
$movedFiles = @()

# Move JSON files
Write-Host "`n📦 Moving JSON files..." -ForegroundColor Blue
foreach ($file in $jsonFiles) {
    try {
        $targetPath = "json\$($file.Name)"
        if (Test-Path $targetPath) {
            Write-Host "  ⚠️  $($file.Name) already exists in json/ - skipping" -ForegroundColor Yellow
        } else {
            Move-Item $file.FullName "json\" -Force
            Write-Host "  ✅ Moved $($file.Name)" -ForegroundColor Green
            $movedFiles += $file.Name
        }
    } catch {
        Write-Host "  ❌ Failed to move $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($movedFiles.Count -eq 0) {
    Write-Host "No files were moved, no references to update" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

# Update references in files
Write-Host "`n🔄 Updating references in files..." -ForegroundColor Blue

# Define file types that might contain JSON references
$fileTypesToScan = @('*.html', '*.css', '*.js', '*.md', '*.ts', '*.tsx', '*.json', '*.php', '*.py')

$filesScanned = 0
$referencesUpdated = 0

foreach ($filePattern in $fileTypesToScan) {
    $filesToScan = Get-ChildItem -Recurse -Filter $filePattern | Where-Object { 
        $_.PSIsContainer -eq $false -and 
        $_.DirectoryName -notlike "*node_modules*" -and
        $_.DirectoryName -notlike "*\.git*" -and
        $_.DirectoryName -notlike "*dist*" -and
        $_.DirectoryName -notlike "*json*"  # Don't update files inside json folder
    }
    
    foreach ($file in $filesToScan) {
        try {
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            $originalContent = $content
            $fileUpdated = $false
            
            foreach ($jsonName in $movedFiles) {
                # Update various reference patterns for JSON files
                $patterns = @(
                    # Direct references: data.json -> json/data.json
                    "(?<!json/)(?<!['""`"])$([regex]::Escape($jsonName))(?!['""`"])",
                    # Quoted references: "data.json" -> "json/data.json"
                    "`"$([regex]::Escape($jsonName))`"",
                    # Single quoted: 'data.json' -> 'json/data.json'
                    "'$([regex]::Escape($jsonName))'",
                    # In fetch/ajax calls: fetch("data.json") -> fetch("json/data.json")
                    "fetch\(`"$([regex]::Escape($jsonName))`"\)",
                    "fetch\('$([regex]::Escape($jsonName))'\)",
                    # XMLHttpRequest: xhr.open("GET", "data.json") -> xhr.open("GET", "json/data.json")
                    "open\(`"GET`",\s*`"$([regex]::Escape($jsonName))`"\)",
                    "open\('GET',\s*'$([regex]::Escape($jsonName))'\)",
                    # jQuery: $.getJSON("data.json") -> $.getJSON("json/data.json")
                    "getJSON\(`"$([regex]::Escape($jsonName))`"\)",
                    "getJSON\('$([regex]::Escape($jsonName))'\)",
                    # Import statements: import data from "./data.json" -> import data from "./json/data.json"
                    "import\s+.*\s+from\s+`"\./($([regex]::Escape($jsonName)))`"",
                    "import\s+.*\s+from\s+'\./($([regex]::Escape($jsonName)))'",
                    # Require statements: require("./data.json") -> require("./json/data.json")
                    "require\(`"\./($([regex]::Escape($jsonName)))`"\)",
                    "require\('\./($([regex]::Escape($jsonName)))'\)",
                    # URL/src attributes: src="data.json" -> src="json/data.json"
                    "src=`"$([regex]::Escape($jsonName))`"",
                    "href=`"$([regex]::Escape($jsonName))`"",
                    # Data attributes: data-config="config.json" -> data-config="json/config.json"
                    "data-[^=]*=`"$([regex]::Escape($jsonName))`""
                )
                
                $replacements = @(
                    "json/$jsonName",
                    "`"json/$jsonName`"",
                    "'json/$jsonName'",
                    "fetch(`"json/$jsonName`")",
                    "fetch('json/$jsonName')",
                    "open(`"GET`", `"json/$jsonName`")",
                    "open('GET', 'json/$jsonName')",
                    "getJSON(`"json/$jsonName`")",
                    "getJSON('json/$jsonName')",
                    "import `$1 from `"./json/$jsonName`"",
                    "import `$1 from './json/$jsonName'",
                    "require(`"./json/$jsonName`")",
                    "require('./json/$jsonName')",
                    "src=`"json/$jsonName`"",
                    "href=`"json/$jsonName`"",
                    "data-config=`"json/$jsonName`""
                )
                
                for ($i = 0; $i -lt $patterns.Count; $i++) {
                    $newContent = $content -replace $patterns[$i], $replacements[$i]
                    if ($newContent -ne $content) {
                        $content = $newContent
                        $fileUpdated = $true
                    }
                }
            }
            
            if ($fileUpdated) {
                Set-Content $file.FullName -Value $content -Encoding UTF8
                Write-Host "  ✅ Updated references in $($file.Name)" -ForegroundColor Green
                $referencesUpdated++
            }
            
            $filesScanned++
            
        } catch {
            Write-Host "  ❌ Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Show summary
Write-Host "`n📊 SUMMARY:" -ForegroundColor Yellow
Write-Host "  📋 JSON files moved: $($movedFiles.Count)" -ForegroundColor Green
Write-Host "  📄 Files scanned: $filesScanned" -ForegroundColor Cyan
Write-Host "  🔄 Files with updated references: $referencesUpdated" -ForegroundColor Green

Write-Host "`nMoved JSON files:" -ForegroundColor Blue
foreach ($json in $movedFiles) {
    Write-Host "  📋 $json -> json/$json" -ForegroundColor Gray
}

# Show what's now in json folder
Write-Host "`nContents of json/ folder:" -ForegroundColor Blue
Get-ChildItem "json" -Filter "*.json" | ForEach-Object {
    Write-Host "  📋 $($_.Name)" -ForegroundColor Gray
}

# Show current root structure (should have no JSON files)
Write-Host "`nRoot JSON files (should be empty):" -ForegroundColor Blue
$remainingJson = Get-ChildItem -Filter "*.json"
if ($remainingJson.Count -eq 0) {
    Write-Host "  ✅ No JSON files remaining in root" -ForegroundColor Green
} else {
    foreach ($file in $remainingJson) {
        Write-Host "  📋 $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ JSON ORGANIZATION AND REFERENCE UPDATE COMPLETE!" -ForegroundColor Green

Write-Host "`nRecommendations:" -ForegroundColor Yellow
Write-Host "1. Test AJAX/fetch calls to ensure JSON files load correctly" -ForegroundColor Cyan
Write-Host "2. Check any dynamic JSON loading in JavaScript" -ForegroundColor Cyan
Write-Host "3. Verify configuration files are being read properly" -ForegroundColor Cyan
Write-Host "4. Test any import/require statements for JSON modules" -ForegroundColor Cyan
Write-Host "5. Check server-side code that might reference JSON files" -ForegroundColor Cyan

Read-Host "Press Enter to continue"