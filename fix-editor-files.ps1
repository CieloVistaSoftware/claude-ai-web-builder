#!/usr/bin/env pwsh

# Fix the 500+ problems in editor HTML files by replacing React/JSX content with clean HTML

$editorFiles = @(
    "table-editor.html",
    "button-editor.html", 
    "text-editor.html",
    "image-editor.html",
    "video-editor.html"
)

$basePath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\editors"

foreach ($file in $editorFiles) {
    $filePath = Join-Path $basePath $file
    Write-Host "Processing $file..."
    
    # Create clean HTML content for each file
    switch ($file) {
        "table-editor.html" {
            $content = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Editor - Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Table Editor - Demo</h1>
        
        <div class="instructions">
            <h3>Instructions</h3>
            <p>This demo shows different table configurations. Click on any table element when edit mode is enabled to modify its properties.</p>
            <p>Use the controls below to customize table appearance and structure.</p>
        </div>

        <div class="demo-section">
            <h2>Sample Tables</h2>
            
            <div class="table-container">
                <table data-editable="table" data-table-style="modern">
                    <thead>
                        <tr>
                            <th data-editable="th">Product</th>
                            <th data-editable="th">Price</th>
                            <th data-editable="th">Stock</th>
                            <th data-editable="th">Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-editable="td">Laptop Pro</td>
                            <td data-editable="td">$1,299</td>
                            <td data-editable="td">15</td>
                            <td data-editable="td">Electronics</td>
                        </tr>
                        <tr>
                            <td data-editable="td">Wireless Mouse</td>
                            <td data-editable="td">$29</td>
                            <td data-editable="td">50</td>
                            <td data-editable="td">Accessories</td>
                        </tr>
                        <tr>
                            <td data-editable="td">USB-C Hub</td>
                            <td data-editable="td">$79</td>
                            <td data-editable="td">25</td>
                            <td data-editable="td">Accessories</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-container">
                <table data-editable="table" data-table-style="simple">
                    <thead>
                        <tr>
                            <th data-editable="th">Name</th>
                            <th data-editable="th">Department</th>
                            <th data-editable="th">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-editable="td">John Smith</td>
                            <td data-editable="td">Engineering</td>
                            <td data-editable="td">Active</td>
                        </tr>
                        <tr>
                            <td data-editable="td">Sarah Johnson</td>
                            <td data-editable="td">Design</td>
                            <td data-editable="td">Active</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="demo-section">
            <h2>Table Customization</h2>
            <p>Tables can be customized with different styles, borders, and responsive behavior. The table editor allows you to:</p>
            <ul>
                <li>Add/remove rows and columns</li>
                <li>Edit cell content</li>
                <li>Change table styling</li>
                <li>Set responsive behavior</li>
                <li>Configure sorting and filtering</li>
            </ul>
        </div>
    </div>

    <script src="table-editor.js"></script>
    <script src="universal-element-editor.js"></script>
</body>
</html>
'@
        }
        "button-editor.html" {
            $content = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Button Editor - Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Button Editor - Demo</h1>
        
        <div class="instructions">
            <h3>Instructions</h3>
            <p>This demo shows different button styles and configurations. Click on any button when edit mode is enabled to modify its properties.</p>
            <p>Use the gallery below to see various button styles in action.</p>
        </div>

        <div class="demo-section">
            <h2>Button Gallery</h2>
            
            <div class="button-gallery">
                <button class="test-button" data-editable="button" data-button-style="primary">Primary Button</button>
                <button class="test-button secondary" data-editable="button" data-button-style="secondary">Secondary Button</button>
                <button class="test-button success" data-editable="button" data-button-style="success">Success Button</button>
                <button class="test-button danger" data-editable="button" data-button-style="danger">Danger Button</button>
                <button class="test-button warning" data-editable="button" data-button-style="warning">Warning Button</button>
            </div>

            <div class="button-gallery">
                <button class="test-button" data-editable="button" data-button-size="small">Small Button</button>
                <button class="test-button" data-editable="button" data-button-size="medium">Medium Button</button>
                <button class="test-button" data-editable="button" data-button-size="large">Large Button</button>
            </div>
        </div>

        <div class="demo-section">
            <h2>Button Customization</h2>
            <p>Buttons can be customized with different styles, sizes, and states. The button editor allows you to:</p>
            <ul>
                <li>Change button text</li>
                <li>Modify button styles (primary, secondary, success, danger, warning)</li>
                <li>Adjust button sizes</li>
                <li>Set button states (enabled, disabled, loading)</li>
                <li>Configure click actions</li>
            </ul>
        </div>
    </div>

    <script src="button-editor.js"></script>
    <script src="universal-element-editor.js"></script>
</body>
</html>
'@
        }
        "text-editor.html" {
            $content = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Editor - Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Text Editor - Demo</h1>
        
        <div class="instructions">
            <h3>Instructions</h3>
            <p>This demo shows different text elements and typography options. Click on any text element when edit mode is enabled to modify its properties.</p>
            <p>Use the samples below to see various text styles in action.</p>
        </div>

        <div class="demo-section">
            <h2>Text Samples</h2>
            
            <div class="text-samples">
                <div class="text-sample">
                    <h1 data-editable="h1">Main Heading (H1)</h1>
                    <p data-editable="p">This is a paragraph of text that demonstrates the default styling. It shows how text flows and wraps within its container.</p>
                </div>

                <div class="text-sample">
                    <h2 data-editable="h2">Section Heading (H2)</h2>
                    <p data-editable="p">Another paragraph with different content to show text variation and formatting options available in the editor.</p>
                </div>

                <div class="text-sample">
                    <h3 data-editable="h3">Subsection Heading (H3)</h3>
                    <p data-editable="p">A smaller paragraph that might be used for captions, descriptions, or supplementary information.</p>
                </div>

                <div class="text-sample">
                    <span data-editable="span">Inline text element</span> that can be edited separately from surrounding content.
                </div>
            </div>
        </div>

        <div class="demo-section">
            <h2>Text Customization</h2>
            <p>Text elements can be customized with different properties. The text editor allows you to:</p>
            <ul>
                <li>Change text content</li>
                <li>Modify font sizes and weights</li>
                <li>Adjust text alignment</li>
                <li>Set text colors</li>
                <li>Choose different HTML tags (h1, h2, h3, p, span, etc.)</li>
            </ul>
        </div>
    </div>

    <script src="text-editor.js"></script>
    <script src="universal-element-editor.js"></script>
</body>
</html>
'@
        }
        "image-editor.html" {
            $content = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Editor - Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Image Editor - Demo</h1>
        
        <div class="instructions">
            <h3>Instructions</h3>
            <p>This demo shows different image configurations and styles. Click on any image when edit mode is enabled to modify its properties.</p>
            <p>Use the gallery below to see various image layouts and styles.</p>
        </div>

        <div class="demo-section">
            <h2>Image Gallery</h2>
            
            <div class="image-gallery">
                <div class="image-demo">
                    <img data-editable="img" src="https://via.placeholder.com/300x200/4a9eff/ffffff?text=Sample+Image+1" alt="Sample image 1">
                    <p>Standard Image</p>
                </div>

                <div class="image-demo">
                    <img data-editable="img" src="https://via.placeholder.com/300x300/45a049/ffffff?text=Square+Image" alt="Square image">
                    <p>Square Image</p>
                </div>

                <div class="image-demo">
                    <img data-editable="img" src="https://via.placeholder.com/400x200/f44336/ffffff?text=Wide+Image" alt="Wide image">
                    <p>Wide Image</p>
                </div>

                <div class="image-demo">
                    <div class="placeholder" data-editable="img">
                        Click to add image
                    </div>
                    <p>Placeholder</p>
                </div>
            </div>
        </div>

        <div class="demo-section">
            <h2>Image Customization</h2>
            <p>Images can be customized with different properties. The image editor allows you to:</p>
            <ul>
                <li>Change image source URL</li>
                <li>Modify alt text for accessibility</li>
                <li>Adjust image dimensions</li>
                <li>Set loading behavior (lazy, eager)</li>
                <li>Configure responsive behavior</li>
                <li>Add CSS classes for styling</li>
            </ul>
        </div>
    </div>

    <script src="image-editor.js"></script>
    <script src="universal-element-editor.js"></script>
</body>
</html>
'@
        }
        "video-editor.html" {
            $content = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Editor - Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Video Editor - Demo</h1>
        
        <div class="instructions">
            <h3>Instructions</h3>
            <p>This demo shows different video configurations and controls. Click on any video element when edit mode is enabled to modify its properties.</p>
            <p>Use the gallery below to see various video layouts and configurations.</p>
        </div>

        <div class="demo-section">
            <h2>Video Gallery</h2>
            
            <div class="video-gallery">
                <div class="video-demo">
                    <video data-editable="video" controls width="320" height="240">
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <p>Standard Video with Controls</p>
                </div>

                <div class="video-demo">
                    <video data-editable="video" autoplay muted loop width="320" height="240">
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <p>Autoplay Looping Video</p>
                </div>

                <div class="video-demo">
                    <div class="placeholder" data-editable="video">
                        Click to add video
                    </div>
                    <p>Video Placeholder</p>
                </div>
            </div>
        </div>

        <div class="demo-section">
            <h2>Video Customization</h2>
            <p>Videos can be customized with different properties. The video editor allows you to:</p>
            <ul>
                <li>Change video source URL</li>
                <li>Toggle video controls (play, pause, volume, etc.)</li>
                <li>Set autoplay behavior</li>
                <li>Configure looping</li>
                <li>Adjust video dimensions</li>
                <li>Set muted state</li>
                <li>Add poster image</li>
                <li>Configure preload behavior</li>
            </ul>
        </div>
    </div>

    <script src="video-editor.js"></script>
    <script src="universal-element-editor.js"></script>
</body>
</html>
'@
        }
    }
    
    # Write the clean content to the file
    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Fixed $file - replaced React/JSX content with clean HTML"
}

Write-Host "`nAll editor HTML files have been fixed!"
Write-Host "- Removed all React/JSX code"
Write-Host "- Added proper HTML structure with data-editable attributes" 
Write-Host "- Linked to external styles.css"
Write-Host "- Added universal-element-editor.js integration"
Write-Host "`nThe 500+ problems should now be resolved."