# build.ps1
# Installs dependencies if needed and starts the Vite dev server

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Green
    npm install
}

Write-Host "Starting Vite development server on port 5173..." -ForegroundColor Green
npm run dev
