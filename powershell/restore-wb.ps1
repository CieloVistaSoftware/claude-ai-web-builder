# PowerShell script to restore wb folder from git
# filepath: c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\restore-wb.ps1

param(
    [switch]$Force,
    [switch]$BackupFirst,
    [string]$Branch = "main"
)

Write-Host "🔄 Restoring wb folder from git..." -ForegroundColor Cyan

# Get the script directory (project root)
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

Write-Host "📁 Working in: $ProjectRoot" -ForegroundColor Gray

try {
    # Check if we're in a git repository
    if (-not (Test-Path ".git")) {
        Write-Error "❌ Not in a git repository. Please run this script from the project root."
        exit 1
    }

    # Backup current wb folder if requested
    if ($BackupFirst -and (Test-Path "wb")) {
        $BackupName = "wb-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Write-Host "💾 Creating backup: $BackupName" -ForegroundColor Yellow
        Copy-Item -Path "wb" -Destination $BackupName -Recurse
        Write-Host "✅ Backup created successfully" -ForegroundColor Green
    }

    # Fetch latest changes from remote
    Write-Host "🌐 Fetching latest changes from remote..." -ForegroundColor Blue
    git fetch origin
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Failed to fetch from remote"
        exit 1
    }

    # Check if wb folder exists locally
    if (Test-Path "wb") {
        if ($Force) {
            Write-Host "🗑️  Removing existing wb folder..." -ForegroundColor Red
            Remove-Item -Path "wb" -Recurse -Force
        } else {
            Write-Host "⚠️  wb folder exists. Use -Force to overwrite or -BackupFirst to backup first." -ForegroundColor Yellow
            $response = Read-Host "Continue anyway? (y/N)"
            if ($response -ne "y" -and $response -ne "Y") {
                Write-Host "❌ Operation cancelled" -ForegroundColor Red
                exit 0
            }
        }
    }

    # Restore wb folder from git
    Write-Host "📥 Restoring wb folder from origin/$Branch..." -ForegroundColor Green
    git checkout "origin/$Branch" -- wb/
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Failed to restore wb folder from git"
        exit 1
    }

    Write-Host "✅ wb folder restored successfully from origin/$Branch" -ForegroundColor Green
    
    # Show what was restored
    if (Test-Path "wb") {
        $files = Get-ChildItem -Path "wb" -Recurse -File | Measure-Object
        Write-Host "📊 Restored $($files.Count) files" -ForegroundColor Cyan
        
        Write-Host "`n📝 Files in wb folder:" -ForegroundColor Gray
        Get-ChildItem -Path "wb" -File | ForEach-Object {
            Write-Host "   $($_.Name)" -ForegroundColor Gray
        }
    }

} catch {
    Write-Error "❌ Error occurred: $($_.Exception.Message)"
    exit 1
}

Write-Host "`n🎉 wb folder restoration complete!" -ForegroundColor Green