Write-Host "===== Starting Website Builder ====="

Write-Host "`nKilling any existing processes on port 8080..."
node kill-port.js

Write-Host "`nStarting HTTP server for development..."
$serverProcess = Start-Process -FilePath "npx" -ArgumentList "http-server -p 8080" -WindowStyle Hidden -PassThru

# Wait a bit for the server to start
Write-Host "`nWaiting for server to start..."
Start-Sleep -Seconds 2

Write-Host "`nOpening Website Builder in your browser..."
Start-Process "http://localhost:8080/index.html"

Write-Host "`nWebsite Builder is now running!"
Write-Host "`n=== Access URLs ==="
Write-Host "`n- Main Page: http://localhost:8080/index.html"
Write-Host "- Material Design Editor: http://localhost:8080/Working/MaterialDesign.html"
Write-Host "- Website Builder: http://localhost:8080/wb-core/wb.html"
Write-Host "- Converter UI: http://localhost:8080/ui/converter-ui/index.html"

Write-Host "`nPress Ctrl+C to stop the server and exit..."
try {
    # Keep the script running
    Wait-Process -Id $serverProcess.Id
} catch {
    Write-Host "Server stopped."
}
