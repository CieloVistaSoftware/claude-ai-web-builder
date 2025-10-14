# PowerShell script to move component discovery files and documentation to build folder

$buildDir = "build/component-discovery"

# Create build/component-discovery if it doesn't exist
if (!(Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir | Out-Null
}

# List of files to move/copy
$files = @(
    "component-discovery-reports/discovery-metadata.json",
    "component-discovery-reports/component-registry.json",
    "component-discovery-reports/symbol-table.json",
    "docs/build-component-discovery.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Copy-Item $file $buildDir -Force
    }
}

Write-Host "Component discovery files and documentation copied to $buildDir."
