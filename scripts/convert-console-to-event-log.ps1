# Convert Console Calls to Reactive WBEventLog
# This script converts all console.log/warn/error calls to WBEventLog with proper context

$componentsPath = "C:\Users\jwpmi\Downloads\AI\wb\components"
$utilsPath = "C:\Users\jwpmi\Downloads\AI\wb\utils"

# Get all JavaScript files
$jsFiles = Get-ChildItem -Path $componentsPath, $utilsPath -Recurse -Filter "*.js" | 
    Where-Object { $_.Name -notmatch "\.min\.js$" -and $_.Name -notmatch "node_modules" }

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $jsFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileChanged = $false
    $replacements = 0
    
    # Extract component name from file
    $componentName = $file.BaseName
    
    # Pattern to match console calls with context
    # Match: console.log('message')  console.warn('message', var)  etc.
    
    # Replace console.log with WBEventLog.logInfo
    if ($content -match "console\.log\(") {
        $lines = Get-Content $file.FullName
        for ($i = 0; $i < $lines.Count; $i++) {
            $line = $lines[$i]
            $lineNum = $i + 1
            
            # Simple console.log pattern
            if ($line -match "console\.log\((.*)\);?\s*$") {
                $message = $matches[1]
                # Remove emoji and special characters from message
                $cleanMessage = $message -replace '🔧|✅|⚠️|❌|💡|🔍|🔄|📱|🎨|🔘|📊|🏷️', ''
                $cleanMessage = $cleanMessage.Trim()
                
                $newLine = $line -replace "console\.log\((.*)\);?\s*$", "WBEventLog.logInfo($cleanMessage, { component: '$componentName', line: $lineNum });"
                $lines[$i] = $newLine
                $replacements++
                $fileChanged = $true
            }
        }
        if ($fileChanged) {
            $lines | Set-Content $file.FullName
            $content = Get-Content $file.FullName -Raw
        }
    }
    
    # Replace console.warn with WBEventLog.logWarning
    if ($content -match "console\.warn\(") {
        $lines = Get-Content $file.FullName
        for ($i = 0; $i < $lines.Count; $i++) {
            $line = $lines[$i]
            $lineNum = $i + 1
            
            if ($line -match "console\.warn\((.*)\);?\s*$") {
                $message = $matches[1]
                $cleanMessage = $message -replace '🔧|✅|⚠️|❌|💡|🔍|🔄|📱|🎨|🔘|📊|🏷️', ''
                $cleanMessage = $cleanMessage.Trim()
                
                $newLine = $line -replace "console\.warn\((.*)\);?\s*$", "WBEventLog.logWarning($cleanMessage, { component: '$componentName', line: $lineNum });"
                $lines[$i] = $newLine
                $replacements++
                $fileChanged = $true
            }
        }
        if ($fileChanged) {
            $lines | Set-Content $file.FullName
        }
    }
    
    # Replace console.error with WBEventLog.logError
    if ($content -match "console\.error\(") {
        $lines = Get-Content $file.FullName
        for ($i = 0; $i < $lines.Count; $i++) {
            $line = $lines[$i]
            $lineNum = $i + 1
            
            if ($line -match "console\.error\((.*)\);?\s*$") {
                $message = $matches[1]
                $cleanMessage = $message -replace '🔧|✅|⚠️|❌|💡|🔍|🔄|📱|🎨|🔘|📊|🏷️', ''
                $cleanMessage = $cleanMessage.Trim()
                
                $newLine = $line -replace "console\.error\((.*)\);?\s*$", "WBEventLog.logError($cleanMessage, { component: '$componentName', line: $lineNum });"
                $lines[$i] = $newLine
                $replacements++
                $fileChanged = $true
            }
        }
        if ($fileChanged) {
            $lines | Set-Content $file.FullName
        }
    }
    
    if ($replacements > 0) {
        Write-Host "✅ $($file.Name): $replacements replacements" -ForegroundColor Green
        $totalFiles++
        $totalReplacements += $replacements
    }
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "Files modified: $totalFiles" -ForegroundColor Yellow
Write-Host "Total replacements: $totalReplacements" -ForegroundColor Yellow
