# wb-show-htmlfiles-refresh.ps1
# Background job to keep files.json up to date every 10 seconds

$source = "c:\Users\jwpmi\Downloads\AI\wb\components"
$target = "c:\Users\jwpmi\Downloads\AI\wb\wb-show-htmlfiles\files.json"

while ($true) {
    Get-ChildItem -Path $source -Recurse -Filter *.html |
        Sort-Object LastWriteTime -Descending |
        ForEach-Object {
            $rel = $_.FullName.Replace('C:\\Users\\jwpmi\\Downloads\\AI\\wb\\','').Replace('\\','/');
            $url = '../' + $rel;
            [PSCustomObject]@{
                name = $_.Name;
                relPath = $rel;
                url = $url;
                lastModified = $_.LastWriteTime
            }
        } | ConvertTo-Json | Set-Content -Path $target
    Start-Sleep -Seconds 10
}
