# Project Reorganization Script
# Cleans up the messy root directory structure

Write-Host "🗂️ Starting project reorganization..." -ForegroundColor Green

# Create new directory structure
$directories = @(
    "src",
    "src/converters", 
    "src/file-handling",
    "src/servers",
    "src/utils",
    "scripts",
    "config", 
    "build",
    "temp"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "✅ Created directory: $dir" -ForegroundColor Cyan
    }
}

# Move converter files
Write-Host "📁 Moving converter files..." -ForegroundColor Yellow
$converterFiles = @(
    "convert-and-stack.ts",
    "convert-file.ts", 
    "converter-util.ts",
    "converter.css",
    "converter.html",
    "converter.ts",
    "site-converter.ts"
)

foreach ($file in $converterFiles) {
    if (Test-Path $file) {
        Move-Item $file "src/converters/" -Force
        Write-Host "  Moved: $file → src/converters/" -ForegroundColor Gray
    }
}

# Move file handling files
Write-Host "📁 Moving file handling files..." -ForegroundColor Yellow
$fileHandlingFiles = @(
    "file-stacker.ts",
    "file-stacker.minimal.ts", 
    "file-stacker.html",
    "file-stacker.md",
    "direct-file-handler.ts",
    "auto-stack-files.ts",
    "stack-existing-files.ts",
    "file-watcher.ts"
)

foreach ($file in $fileHandlingFiles) {
    if (Test-Path $file) {
        Move-Item $file "src/file-handling/" -Force
        Write-Host "  Moved: $file → src/file-handling/" -ForegroundColor Gray
    }
}

# Move server files
Write-Host "📁 Moving server files..." -ForegroundColor Yellow
$serverFiles = @(
    "claude-socket-server.ts",
    "claude-socket-test-server.ts",
    "claude-websocket-server.ts",
    "unified-claude-websocket-server.ts",
    "websocket-server.ts",
    "websocket-test-server.ts",
    "websocket-server-manager.ts",
    "websocket-dependency-loader.ts",
    "server-health-check.ts",
    "socket-mock.ts",
    "start-websocket-server.ts"
)

foreach ($file in $serverFiles) {
    if (Test-Path $file) {
        Move-Item $file "src/servers/" -Force
        Write-Host "  Moved: $file → src/servers/" -ForegroundColor Gray
    }
}

# Move utility files
Write-Host "📁 Moving utility files..." -ForegroundColor Yellow
$utilFiles = @(
    "kill-port.ts",
    "open-browser.ts", 
    "remove-puppeteer.ts",
    "reorganize-code.ts",
    "wb-controller.ts"
)

foreach ($file in $utilFiles) {
    if (Test-Path $file) {
        Move-Item $file "src/utils/" -Force
        Write-Host "  Moved: $file → src/utils/" -ForegroundColor Gray
    }
}

# Move build/script files
Write-Host "📁 Moving build scripts..." -ForegroundColor Yellow
$scriptFiles = @(
    "build-and-run-socket.ps1",
    "run-claude-socket.ps1", 
    "start-server.ps1",
    "start-wb.bat",
    "test-claude-socket.ps1",
    "test-unified-server.ps1",
    "convert-js-to-ts-new.ps1",
    "convert-js-to-ts.ps1",
    "js-to-ts-converter.ps1",
    "remove-converted-js-files.ps1",
    "remove-js-files.ps1",
    "consolidate-node-modules.ps1"
)

foreach ($file in $scriptFiles) {
    if (Test-Path $file) {
        Move-Item $file "scripts/" -Force
        Write-Host "  Moved: $file → scripts/" -ForegroundColor Gray
    }
}

# Move config files
Write-Host "📁 Moving config files..." -ForegroundColor Yellow
$configFiles = @(
    "config.ts",
    "jest.config.ts", 
    "playwright.config.ts",
    "playwright.real.config.ts",
    "tsconfig.json"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Move-Item $file "config/" -Force
        Write-Host "  Moved: $file → config/" -ForegroundColor Gray
    }
}

# Move temporary/working files
Write-Host "📁 Moving temporary files..." -ForegroundColor Yellow
$tempFiles = @(
    "claude-socket-test-server.ts.new",
    "convert-js-to-ts.js",
    "convert-js-to-ts.ts", 
    "fix-typescript-errors.js",
    "js-to-ts-conversion-success.log",
    "ts-fixes-applied.log",
    "open-browser.cjs",
    "run-all-tests.ts",
    "run-claude-tests.ts",
    "start-claude-test.ts",
    "test-claude-socket.ts",
    "test-with-config.ts"
)

foreach ($file in $tempFiles) {
    if (Test-Path $file) {
        Move-Item $file "temp/" -Force
        Write-Host "  Moved: $file → temp/" -ForegroundColor Gray
    }
}

# Move standalone web files to build
Write-Host "📁 Moving standalone web files..." -ForegroundColor Yellow
$webFiles = @(
    "wb.css",
    "wb.html", 
    "wb.ts",
    "styles.css",
    "test-claude-socket.html",
    "test-claude-socket-styles.css",
    "project-file-stacker.html",
    "index.html"
)

foreach ($file in $webFiles) {
    if (Test-Path $file) {
        Move-Item $file "build/" -Force
        Write-Host "  Moved: $file → build/" -ForegroundColor Gray
    }
}

Write-Host "`n🎉 Project reorganization complete!" -ForegroundColor Green
Write-Host "📊 New structure created with organized directories" -ForegroundColor Cyan

# Show new structure
Write-Host "`n📁 New Directory Structure:" -ForegroundColor Magenta
Get-ChildItem -Directory | Select-Object Name | Sort-Object Name