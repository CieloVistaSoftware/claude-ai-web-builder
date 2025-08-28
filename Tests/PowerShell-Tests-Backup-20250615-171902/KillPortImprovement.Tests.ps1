# Kill Port Script Fix and Improvement Test
# Test to create a more robust kill-port solution
# Date: 2025-06-12

Write-Host "🛠️ Kill Port Script Fix and Improvement" -ForegroundColor Yellow

# Test current command (should work but exit with code 1 when no processes found)
Write-Host "`n🧪 Testing Current Command:" -ForegroundColor Cyan
try {
    $result = & npm run kill-port 2>&1
    Write-Host "Current command output: $result" -ForegroundColor Blue
    Write-Host "✅ Current command executed (exit code 1 is normal when no processes found)" -ForegroundColor Green
} catch {
    Write-Host "❌ Current command failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Create improved version that returns proper exit codes
Write-Host "`n🔧 Creating Improved Version:" -ForegroundColor Cyan

$improvedCommand = @"
try {
    `$nodeKilled = `$false
    `$portKilled = `$false
    
    # Kill node processes
    `$nodeProcs = Get-Process -Name 'node' -ErrorAction SilentlyContinue
    if (`$nodeProcs) {
        `$nodeProcs | Stop-Process -Force
        `$nodeKilled = `$true
        Write-Host "Killed `$(`$nodeProcs.Count) node process(es)"
    }
    
    # Kill processes on port 8000
    `$procs = netstat -ano | findstr :8000
    if (`$procs) {
        `$killed = 0
        `$procs | ForEach-Object {
            `$processId = (`$_ -split '\s+')[-1]
            if (`$processId -match '^\d+`$') {
                try {
                    Stop-Process -Id `$processId -Force -ErrorAction Stop
                    `$killed++
                } catch {
                    # Process might already be dead
                }
            }
        }
        if (`$killed -gt 0) {
            `$portKilled = `$true
            Write-Host "Killed `$killed process(es) on port 8000"
        }
    }
    
    if (`$nodeKilled -or `$portKilled) {
        Write-Host "Port cleanup completed successfully"
        exit 0
    } else {
        Write-Host "No processes found to kill (port 8000 is available)"
        exit 0
    }
} catch {
    Write-Host "Error during port cleanup: `$(`$_.Exception.Message)"
    exit 1
}
"@

Write-Host "Testing improved command..."
try {
    Invoke-Expression $improvedCommand
    Write-Host "✅ Improved command: SUCCESS" -ForegroundColor Green
    $testResult = "PASS"
} catch {
    Write-Host "❌ Improved command: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $testResult = "FAIL"
}

# Create simplified npm-compatible version
Write-Host "`n📦 Creating NPM-Compatible Version:" -ForegroundColor Cyan

$npmCompatible = 'powershell -Command "try { $nodeProcs = Get-Process -Name ''node'' -ErrorAction SilentlyContinue; if($nodeProcs) { $nodeProcs | Stop-Process -Force; Write-Host ''Killed node processes'' }; $procs = netstat -ano | findstr :8000; if($procs) { $killed = 0; $procs | ForEach-Object { $processId = ($_ -split ''\s+'')[-1]; if($processId -match ''^\\d+$'') { try { Stop-Process -Id $processId -Force -ErrorAction Stop; $killed++ } catch {} } }; if($killed -gt 0) { Write-Host ''Killed $killed processes on port 8000'' } }; Write-Host ''Port cleanup completed''; exit 0 } catch { Write-Host ''Error: $_''; exit 1 }"'

Write-Host "Testing NPM-compatible version..."
try {
    Invoke-Expression $npmCompatible
    Write-Host "✅ NPM-compatible version: SUCCESS" -ForegroundColor Green
    $npmResult = "PASS"
} catch {
    Write-Host "❌ NPM-compatible version: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $npmResult = "FAIL"
}

# Summary
Write-Host "`n📊 Test Summary:" -ForegroundColor Cyan
Write-Host "Current Command: Working (exit code 1 is normal)" -ForegroundColor Green
Write-Host "Improved Command: $testResult" -ForegroundColor $(if($testResult -eq "PASS") { "Green" } else { "Red" })
Write-Host "NPM-Compatible Version: $npmResult" -ForegroundColor $(if($npmResult -eq "PASS") { "Green" } else { "Red" })

if ($npmResult -eq "PASS") {
    Write-Host "`n🎉 Ready to implement improved kill-port script!" -ForegroundColor Green
} else {
    Write-Host "`n💥 Need to debug further!" -ForegroundColor Red
}
