# WB Component Compliance Checker
# Quick check to see which components need migration

$componentsDir = "C:\Users\jwpmi\Downloads\AI\wb\components"
$results = @()

Get-ChildItem -Path $componentsDir -Directory | Where-Object { $_.Name -like "wb-*" } | ForEach-Object {
    $componentName = $_.Name
    $jsFile = Join-Path $_.FullName "$componentName.js"
    
    if (Test-Path $jsFile) {
        $content = Get-Content $jsFile -Raw
        
        $checks = @{
            ExtendsWBBase = $content -match 'extends WBBaseComponent'
            HasObservedAttrs = $content -match 'static get observedAttributes'
            HasSuper = $content -match 'super\.connectedCallback'
            UsesLogging = $content -match 'this\.log(Info|Error|Debug)'
            UsesFireEvent = $content -match 'this\.fireEvent'
        }
        
        $score = ($checks.Values | Where-Object { $_ }).Count
        $total = $checks.Count
        $percentage = [math]::Round(($score / $total) * 100)
        
        $results += [PSCustomObject]@{
            Component = $componentName
            Percentage = $percentage
            ExtendsWBBase = $checks.ExtendsWBBase
            HasObservedAttrs = $checks.HasObservedAttrs
            HasSuper = $checks.HasSuper
            UsesLogging = $checks.UsesLogging
            UsesFireEvent = $checks.UsesFireEvent
        }
    }
}

Write-Host "`nWB Component Compliance Report`n" -ForegroundColor Cyan

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$needsWork = $results | Where-Object { $_.Percentage -lt 100 } | Sort-Object Percentage

if ($needsWork) {
    Write-Host "`n❌ Components Needing Migration:`n" -ForegroundColor Red
    
    $needsWork | ForEach-Object {
        $color = if ($_.Percentage -ge 70) { "Yellow" } else { "Red" }
        $symbol = if ($_.Percentage -ge 70) { "⚠️ " } else { "❌" }
        
        Write-Host "$symbol  $($_.Component) " -NoNewline
        Write-Host "($($_.Percentage)%)" -ForegroundColor $color
        
        Write-Host "   $( if ($_.ExtendsWBBase) { '✅' } else { '❌' } ) Extends WBBaseComponent"
        Write-Host "   $( if ($_.HasObservedAttrs) { '✅' } else { '❌' } ) Has observedAttributes"
        Write-Host "   $( if ($_.HasSuper) { '✅' } else { '❌' } ) Calls super()"
        Write-Host "   $( if ($_.UsesLogging) { '✅' } else { '❌' } ) Uses logging"
        Write-Host "   $( if ($_.UsesFireEvent) { '✅' } else { '❌' } ) Uses fireEvent"
        Write-Host ""
    }
}

$compliant = $results | Where-Object { $_.Percentage -eq 100 }

if ($compliant) {
    Write-Host "`n✅ Fully Compliant Components:`n" -ForegroundColor Green
    $compliant | ForEach-Object {
        Write-Host "✅  $($_.Component) (100%)" -ForegroundColor Green
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "Total Components: $($results.Count)"
Write-Host "Compliant: " -NoNewline
Write-Host "$($compliant.Count)" -ForegroundColor Green
Write-Host "Needs Work: " -NoNewline
Write-Host "$($needsWork.Count)" -ForegroundColor Yellow

$avgCompliance = [math]::Round(($results | Measure-Object -Property Percentage -Average).Average)
Write-Host "`nAverage Compliance: $avgCompliance%"

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`n📋 Migration Priority (start here):`n" -ForegroundColor Cyan
$needsWork | Select-Object -First 10 | ForEach-Object -Begin { $i = 1 } -Process {
    Write-Host "$i. $($_.Component) ($($_.Percentage)%)"
    $i++
}

Write-Host ""
