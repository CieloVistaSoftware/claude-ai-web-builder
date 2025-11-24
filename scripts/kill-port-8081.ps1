# Kills any process listening on port 8081
$p = Get-NetTCPConnection -LocalPort 8081 -State Listen | Select-Object -First 1
if ($p) {
    Stop-Process -Id $p.OwningProcess -Force
    Write-Host "Killed process on port 8081 (PID: $($p.OwningProcess))"
} else {
    Write-Host "No process found on port 8081."
}
