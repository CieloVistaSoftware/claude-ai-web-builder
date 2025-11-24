# ═══════════════════════════════════════════════════════════════════════════════
# WB FRAMEWORK - COMPREHENSIVE HTML PATH FIXER v2
# ENHANCED: Catches all malformed paths including .... sequences
# ═══════════════════════════════════════════════════════════════════════════════

param(
    [string]$ProjectRoot = (Get-Location).Path
)

Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔧 WB FRAMEWORK - HTML PATH FIXER v2                ║" -ForegroundColor Cyan
Write-Host "║  Enhanced: Catches malformed paths                   ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

# CRITICAL: Define all path mappings - ORDER MATTERS!
# Most specific patterns FIRST, then general ones
$pathMappings = @{
    # CRITICAL: Fix malformed dot sequences FIRST
    '..../styles/'                            = '../../styles/'
    '..../components/'                        = '../../components/'
    '..../lib/'                               = '../../lib/'
    '..../utils/'                             = '../../utils/'
    '../../../../../../../'                   = '../../'
    '../../../../'                            = '../../'
    '../../../'                               = '../../'
    
    # Absolute paths → relative paths
    '/styles/'                                = '../styles/'
    '/components/'                            = '../components/'
    '/lib/'                                   = '../lib/'
    '/utils/'                                 = '../utils/'
    '/templates/'                             = '../templates/'
    
    # Old organizational paths → new paths
    'utils/wb/wb-component-registry.js'      = '../lib/wb-component-registry.js'
    'utils/wb/wb-component-utils.js'         = '../lib/wb-component-utils.js'
    'utils/wb/wb-theme-manager.js'           = '../lib/wb-theme-manager.js'
    'utils/wb/wb-control-panel.js'           = '../lib/wb-control-panel.js'
    
    # Broken relative paths
    '../../lib/'                              = '../lib/'
    '../../components/'                       = '../components/'
    '../../styles/'                           = '../styles/'
    '../../utils/'                            = '../utils/'
}

Write-Host "📁 Project Root: $ProjectRoot" -ForegroundColor Yellow
Write-Host "📄 Scanning for ALL HTML files..." -ForegroundColor Yellow
Write-Host "`n"

# Find all HTML files, excluding node_modules
$files = Get-ChildItem -Path $ProjectRoot -Recurse -Include "*.html" -ErrorAction SilentlyContinue | 
    Where-Object { $_.FullName -notmatch "node_modules|\.git|\.vs" }

Write-Host "✅ Found $($files.Count) HTML files`n" -ForegroundColor Green

$fileCount = $files.Count
$fixCount = 0
$fixedFiles = @()
$issueFiles = @()

# Process each file
foreach ($file in $files) {
    $relativePath = Resolve-Path -Relative $file.FullName
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $fileFixed = $false
    
    # Apply each path mapping IN ORDER
    foreach ($oldPath in $pathMappings.Keys) {
        $newPath = $pathMappings[$oldPath]
        
        # Check if old path exists in file
        if ($content -match [regex]::Escape($oldPath)) {
            $content = $content -replace [regex]::Escape($oldPath), $newPath
            $fileFixed = $true
        }
    }
    
    # Write back if changes were made
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        $fixCount++
        $fixedFiles += $relativePath
        
        Write-Host "  ✅ Fixed: $(Split-Path -Leaf $file.FullName)" -ForegroundColor Green
    }
    
    # Check for remaining malformed paths
    if ($content -match '\.{3,}' -and $content -match 'src=|href=|import') {
        $issueFiles += $relativePath
    }
}

# Print summary
Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ HTML PATH FIXING COMPLETE                        ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📊 Results:" -ForegroundColor Yellow
Write-Host "  📁 Files scanned: $fileCount" -ForegroundColor Cyan
Write-Host "  ✏️  Files fixed: $fixCount" -ForegroundColor Cyan

if ($fixCount -gt 0) {
    Write-Host "`n📝 Fixed Files:" -ForegroundColor Yellow
    $fixedFiles | ForEach-Object {
        Write-Host "   ✓ $_" -ForegroundColor Green
    }
}

if ($issueFiles.Count -gt 0) {
    Write-Host "`n⚠️  Files that may need manual review:" -ForegroundColor Yellow
    $issueFiles | ForEach-Object {
        Write-Host "   ⚠️  $_" -ForegroundColor Yellow
    }
}

Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. npm run dev" -ForegroundColor White
Write-Host "  2. Check browser console (F12) for any 404 errors" -ForegroundColor White
Write-Host "  3. If still seeing 404s, check the malformed path files above" -ForegroundColor White
Write-Host "`n"
