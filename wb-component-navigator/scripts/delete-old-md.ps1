# delete-old-md.ps1
# Deletes all .md files in the parent folder except those in docs/

$parent = Split-Path $PSScriptRoot -Parent
$targetFolder = "$parent"
$mdFiles = Get-ChildItem -Path $targetFolder -Filter *.md -File
foreach ($file in $mdFiles) {
    Remove-Item $file.FullName -Force
    Write-Host "Deleted: $($file.Name)"
}
