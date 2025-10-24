#!/usr/bin/env pwsh
# Claude Issue Logging System Setup
# Adds wb-event-log component to all WB demo files for debugging Claude issues

Write-Host "🔍 Setting up Claude Issue Logging System..." -ForegroundColor Cyan

# Template for adding to demo files
$claudeLogTemplate = @'
    <!-- WB System with Auto-loader and Claude Issue Tracking -->
    <script src="/config.js"></script>
    <script src="/utils/auto-loader.js"></script>
'@

$claudeDebugLog = @'
    <!-- Claude Debug Log -->
    <div style="position: fixed; top: 20px; right: 20px; width: 300px; height: 200px; z-index: 10000; background: rgba(26, 26, 26, 0.95); border: 1px solid #444; border-radius: 6px; overflow: hidden;">
        <div style="background: #007acc; color: white; padding: 4px 8px; font-size: 10px; font-weight: bold;">🔍 Claude Issues</div>
        <wb-event-log id="claudeDebugLog"></wb-event-log>
    </div>
'@

$claudeTrackingScript = @'
        // Claude Issue Tracking
        setTimeout(() => {
            const componentName = document.title.match(/WB (\w+)/)?.[1]?.toLowerCase() || 'unknown';
            
            WBEventLog.logInfo(`${componentName} demo initialized`, { 
                source: `${componentName}-demo`, 
                component: `wb-${componentName}`,
                location: window.location.pathname 
            });
            
            // Check if component loaded properly
            const components = document.querySelectorAll(`wb-${componentName}`);
            if (components.length > 0) {
                WBEventLog.logSuccess(`Found ${components.length} wb-${componentName} components`, { 
                    source: 'component-detection', 
                    component: `wb-${componentName}` 
                });
            } else {
                WBEventLog.logWarning(`No wb-${componentName} components detected`, { 
                    source: 'component-detection', 
                    component: `wb-${componentName}` 
                });
            }
            
            // Log component interactions
            components.forEach((comp, index) => {
                comp.addEventListener('click', () => {
                    WBEventLog.logUser(`${componentName} ${index} clicked`, { 
                        source: 'user-interaction', 
                        component: `wb-${componentName}`
                    });
                });
            });
        }, 2000);
'@

Write-Host "✅ Templates created" -ForegroundColor Green

# Find all demo files
$demoFiles = Get-ChildItem -Path "components" -Recurse -Filter "*demo*.html" | Where-Object { $_.Name -notlike "*test*" }

Write-Host "Found $($demoFiles.Count) demo files:" -ForegroundColor Yellow
$demoFiles | ForEach-Object { Write-Host "  - $($_.FullName)" -ForegroundColor Gray }

Write-Host "`n🎯 Template usage:" -ForegroundColor Cyan
Write-Host "1. Add to <head>: WB System scripts" -ForegroundColor White
Write-Host "2. Add after <body>: Claude Debug Log" -ForegroundColor White  
Write-Host "3. Add before </body>: Claude Tracking Script" -ForegroundColor White

Write-Host "`n📋 Already updated files:" -ForegroundColor Green
Write-Host "  ✅ /tests/config-test.html" -ForegroundColor Gray
Write-Host "  ✅ /tests/test-wb-layout.html" -ForegroundColor Gray
Write-Host "  ✅ /tests/test-wb-color-bar.html" -ForegroundColor Gray
Write-Host "  ✅ /components/wb-event-log/wb-event-log-demo.html" -ForegroundColor Gray
Write-Host "  ✅ /components/wb-button/wb-button-demo.html" -ForegroundColor Gray

Write-Host "`n🚀 Benefits:" -ForegroundColor Cyan
Write-Host "  • Auto-loading of all WB components" -ForegroundColor White
Write-Host "  • Real-time Claude issue tracking" -ForegroundColor White
Write-Host "  • Load existing claude.md files (📂 button)" -ForegroundColor White
Write-Host "  • Save issues to claude.md (🪵 button)" -ForegroundColor White
Write-Host "  • Duplicate prevention" -ForegroundColor White
Write-Host "  • Component detection logging" -ForegroundColor White
Write-Host "  • User interaction tracking" -ForegroundColor White

Write-Host "`n🔧 Enhanced wb-event-log features:" -ForegroundColor Cyan
Write-Host "  📂 Load Claude.md - Read existing issues" -ForegroundColor White
Write-Host "  🪵 Save to Claude.md - Save new issues (no duplicates)" -ForegroundColor White
Write-Host "  🔍 Smart filtering - Only saves unique events" -ForegroundColor White
Write-Host "  📊 Status reporting - Shows duplicates filtered" -ForegroundColor White

Write-Host "`nSetup complete! 🎉" -ForegroundColor Green