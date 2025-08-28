# Generate a visual preview of the themes in HTML format
$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath
$htmlPath = "$projectRoot\hsl-color-picker.html"

if (-not (Test-Path $htmlPath)) {
    Write-Error "HSL Color Picker HTML file not found at $htmlPath"
    exit 1
}

$themes = @("default", "ocean", "sunset", "forest", "cyberpunk", "dark")
$previewPath = "$projectRoot\theme-preview.html"

# Create a preview HTML file
$previewHTML = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Theme Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            padding: 2rem;
            background-color: #f5f5f5;
            color: #333;
        }
        
        h1 {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .theme-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .theme-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .theme-name {
            background-color: #333;
            color: white;
            padding: 0.5rem 1rem;
            text-align: center;
            font-weight: bold;
            text-transform: capitalize;
        }
        
        .theme-preview {
            width: 100%;
            height: 300px;
            border: none;
        }
    </style>
</head>
<body>
    <h1>HSL Color Picker Theme Preview</h1>
    
    <div class="theme-grid">
"@

# Add each theme to the preview
foreach ($theme in $themes) {
    $previewHTML += @"
        <div class="theme-card">
            <div class="theme-name">$theme</div>
            <iframe class="theme-preview" src="hsl-color-picker.html?theme=$theme" title="$theme theme preview"></iframe>
        </div>
"@
}

# Close HTML
$previewHTML += @"
    </div>
    
    <script>
        // Ensure iframes load with correct theme
        document.addEventListener('DOMContentLoaded', () => {
            const iframes = document.querySelectorAll('.theme-preview');
            iframes.forEach(iframe => {
                iframe.onload = () => {
                    const theme = iframe.src.split('theme=')[1];
                    if (theme) {
                        const iframeDoc = iframe.contentWindow.document;
                        const themeSelect = iframeDoc.getElementById('theme-select');
                        if (themeSelect) {
                            themeSelect.value = theme;
                            const event = new Event('change');
                            themeSelect.dispatchEvent(event);
                        }
                    }
                };
            });
        });
    </script>
</body>
</html>
"@

# Save the preview HTML
Set-Content -Path $previewPath -Value $previewHTML

Write-Host "Theme preview generated at $previewPath" -ForegroundColor Green
Write-Host "Open this file in a browser to see all themes"

# Update the original HTML to support query parameters for themes
$originalHTML = Get-Content -Path $htmlPath -Raw
if (-not ($originalHTML -match "const urlParams = new URLSearchParams\(window\.location\.search\)")) {
    $updatedJS = @"
    <script>
        // Check for theme parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const themeParam = urlParams.get('theme');

        // Get elements
"@

    $originalHTML = $originalHTML -replace "<script>\s+// Get elements", $updatedJS

    # Add code to apply theme from URL parameter
    $applyThemeFromURL = @"
        // Apply theme from URL if present
        if (themeParam) {
            themeSelect.value = themeParam;
            applyTheme(themeParam);
        }

        // Initialize
"@

    $originalHTML = $originalHTML -replace "// Initialize", $applyThemeFromURL

    # Save the updated HTML
    Set-Content -Path $htmlPath -Value $originalHTML
    Write-Host "Updated HTML to support theme URL parameters" -ForegroundColor Green
}

Write-Host "`nTo view the themes, open theme-preview.html in your browser" -ForegroundColor Cyan
