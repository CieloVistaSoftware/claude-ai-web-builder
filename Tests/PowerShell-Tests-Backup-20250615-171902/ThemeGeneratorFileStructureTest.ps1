# Verification Test for Theme Generator File Structure
Write-Host "Verifying Theme Generator File Structure" -ForegroundColor Cyan

# 1. Check redirect file
Write-Host "
1. Checking theme-generator.html redirect:" -ForegroundColor Yellow
 = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\theme-generator.html"
<!-- filepath: c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\theme-generator.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0;url=generator/index.html">
    <title>Theme Generator - Redirecting</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            line-height: 1.6;
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
        }
        
        .container {
            max-width: 600px;
            margin: 100px auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            margin-bottom: 20px;
        }
        
        p {
            margin-bottom: 20px;
        }
        
        a {
            color: #007bff;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Theme Generator</h1>
        <p>The Theme Generator has been moved to a new location.</p>
        <p>If you are not automatically redirected, <a href="generator/index.html">click here</a> to go to the Theme Generator.</p>
    </div>
</body>
</html> = Get-Content  -Raw

if (<!-- filepath: c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\theme-generator.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0;url=generator/index.html">
    <title>Theme Generator - Redirecting</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            line-height: 1.6;
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
        }
        
        .container {
            max-width: 600px;
            margin: 100px auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            margin-bottom: 20px;
        }
        
        p {
            margin-bottom: 20px;
        }
        
        a {
            color: #007bff;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Theme Generator</h1>
        <p>The Theme Generator has been moved to a new location.</p>
        <p>If you are not automatically redirected, <a href="generator/index.html">click here</a> to go to the Theme Generator.</p>
    </div>
</body>
</html> -match '<meta http-equiv="refresh" content="0;url=generator/index.html">') {
    Write-Host "✅ Redirect meta tag found" -ForegroundColor Green
} else {
    Write-Host "❌ Redirect meta tag not found" -ForegroundColor Red
}

if (<!-- filepath: c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\theme-generator.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0;url=generator/index.html">
    <title>Theme Generator - Redirecting</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            line-height: 1.6;
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
        }
        
        .container {
            max-width: 600px;
            margin: 100px auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            margin-bottom: 20px;
        }
        
        p {
            margin-bottom: 20px;
        }
        
        a {
            color: #007bff;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Theme Generator</h1>
        <p>The Theme Generator has been moved to a new location.</p>
        <p>If you are not automatically redirected, <a href="generator/index.html">click here</a> to go to the Theme Generator.</p>
    </div>
</body>
</html> -match '<div class="container">') {
    Write-Host "✅ Simple container structure found" -ForegroundColor Green
} else {
    Write-Host "❌ Simple container structure not found" -ForegroundColor Red
}

if (<!-- filepath: c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\theme-generator.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0;url=generator/index.html">
    <title>Theme Generator - Redirecting</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            line-height: 1.6;
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
        }
        
        .container {
            max-width: 600px;
            margin: 100px auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            margin-bottom: 20px;
        }
        
        p {
            margin-bottom: 20px;
        }
        
        a {
            color: #007bff;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Theme Generator</h1>
        <p>The Theme Generator has been moved to a new location.</p>
        <p>If you are not automatically redirected, <a href="generator/index.html">click here</a> to go to the Theme Generator.</p>
    </div>
</body>
</html> -notmatch 'generateAndApplyTheme') {
    Write-Host "✅ No script functions in redirect file" -ForegroundColor Green
} else {
    Write-Host "❌ Found script functions in redirect file" -ForegroundColor Red
}

# 2. Check generator folder files
Write-Host "
2. Checking generator folder structure:" -ForegroundColor Yellow
 = @(
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\generator\index.html",
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\generator\script.js",
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\generator\styles.css"
)

foreach (c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\hsl-color-picker.html in ) {
    if (Test-Path c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\hsl-color-picker.html) {
         = (Get-Item c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\hsl-color-picker.html).Length
        Write-Host "✅ Found hsl-color-picker.html - Size:  bytes" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing file: hsl-color-picker.html" -ForegroundColor Red
    }
}

# 3. Verify script.js functions
Write-Host "
3. Checking script.js for required functions:" -ForegroundColor Yellow
 = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\generator\script.js"
 = Get-Content  -Raw

 = @(
    "generateAndApplyTheme",
    "generateTheme",
    "applyThemeToPreview",
    "applyThemeToSemanticDemo", 
    "updateFloatingPreview"
)

foreach ( in ) {
    if ( -match "function\s+") {
        Write-Host "✅ Found function: " -ForegroundColor Green
    } else {
        Write-Host "❌ Missing function: " -ForegroundColor Red
    }
}

# 4. Verify styles.css has required elements
Write-Host "
4. Checking styles.css for required elements:" -ForegroundColor Yellow
 = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\generator\styles.css"
:root {
    /* Golden Ratio Foundation */
    --golden-ratio: 1.618;
    --inverse-golden-ratio: 0.618;
    
    /* Layout Dimensions */
    --header-height: 80px;
    --nav-width: calc(100vw / (var(--golden-ratio) * 2.75)); /* ~22.4% of viewport width */
    --footer-height: 60px;
    --content-padding: 2rem;
    --grid-gap: 1rem;
    
    /* Typography Scale */
    --text-tiny: 0.75rem;
    --text-small: 0.875rem;
    --text-standard: 1rem;
    --text-medium: 1.125rem;
    --text-large: 1.25rem;
    --text-xl: 1.5rem;
    --text-xxl: 2rem;
    --text-xxxl: 3rem;
    
    /* Spacing Scale */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-xxl: 3rem;
    
    /* Color Systems */
    --primary: #6366f1;
    --primary-light: #a5b4fc;
    --primary-dark: #4338ca;
    --secondary: #64748b;
    --accent: #10b981;
    --accent-alt: #f59e0b;
    
    /* Neutral Scale */
    --neutral-50: #f8fafc;
    --neutral-100: #f1f5f9;
    --neutral-200: #e2e8f0;
    --neutral-300: #cbd5e1;
    --neutral-400: #94a3b8;
    --neutral-500: #64748b;
    --neutral-600: #475569;
    --neutral-700: #334155;
    --neutral-800: #1e293b;
    --neutral-900: #0f172a;
    
    /* Glassmorphism */
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
    --glass-shadow: rgba(0, 0, 0, 0.1);
    
    /* Animations */
    --transition-fast: 0.15s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    /* Current Theme Variables */
    --bg-primary: var(--neutral-50);
    --bg-secondary: #ffffff;
    --text-primary: var(--neutral-900);
    --text-secondary: var(--neutral-600);
    --border-color: var(--neutral-200);
}

/* Dark Theme */
[data-theme="dark"] {
    --bg-primary: var(--neutral-900);
    --bg-secondary: var(--neutral-800);
    --text-primary: var(--neutral-100);
    --text-secondary: var(--neutral-400);
    --border-color: var(--neutral-700);
    --glass-bg: rgba(0, 0, 0, 0.3);
    --glass-border: rgba(255, 255, 255, 0.1);
}

/* Cyberpunk Theme */
[data-theme="cyberpunk"] {
    --primary: #00ffff;
    --primary-light: #80ffff;
    --primary-dark: #00cccc;
    --accent: #ff0080;
    --accent-alt: #ffff00;
    --bg-primary: #0a0a0a;
    --bg-secondary: #1a1a2e;
    --text-primary: #00ffff;
    --text-secondary: #ff0080;
    --border-color: #00ffff;
}

/* Ocean Theme */
[data-theme="ocean"] {
    --primary: #0ea5e9;
    --primary-light: #7dd3fc;
    --primary-dark: #0284c7;
    --accent: #06b6d4;
    --accent-alt: #84cc16;
    --bg-primary: #f0f9ff;
    --bg-secondary: #e0f2fe;
    --text-primary: var(--neutral-800);
    --text-secondary: var(--neutral-600);
    --border-color: #b3e5fc;
}

/* Sunset Theme */
[data-theme="sunset"] {
    --primary: #f97316;
    --primary-light: #fdba74;
    --primary-dark: #ea580c;
    --accent: #ef4444;
    --accent-alt: #fbbf24;
    --bg-primary: #fff7ed;
    --bg-secondary: #ffedd5;
    --text-primary: var(--neutral-800);
    --text-secondary: var(--neutral-600);
    --border-color: #fed7aa;
}

/* Forest Theme */
[data-theme="forest"] {
    --primary: #059669;
    --primary-light: #6ee7b7;
    --primary-dark: #047857;
    --accent: #84cc16;
    --accent-alt: #eab308;
    --bg-primary: #f0fdf4;
    --bg-secondary: #dcfce7;
    --text-primary: var(--neutral-800);
    --text-secondary: var(--neutral-600);
    --border-color: #bbf7d0;
}

/* Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: var(--bg-primary);
    transition: all var(--transition-medium);
}

/* Site Container */
.site-container {
    min-height: 100vh;
    display: grid;
    transition: all var(--transition-medium);
}

/* Navigation Styles */
.site-nav {
    background: var(--bg-secondary);
    transition: all var(--transition-medium);
    box-shadow: 0 2px 10px var(--glass-shadow);
}

.nav-list {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
}

.nav-link {
    color: var(--text-primary);
    text-decoration: none;
    padding: var(--space-md) var(--space-lg);
    transition: all var(--transition-fast);
    display: block;
}

.nav-link:hover {
    background: var(--glass-bg);
    color: var(--primary);
}

/* Layout: Top Navigation (Default) */
body[data-layout="top-nav"] .site-container {
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 
        "nav"
        "content"
        "footer";
}

body[data-layout="top-nav"] .site-nav {
    grid-area: nav;
}

body[data-layout="top-nav"] .nav-list {
    justify-content: center;
    align-items: center;
}

body[data-layout="top-nav"] .main-content {
    grid-area: content;
    padding: var(--space-xl);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

body[data-layout="top-nav"] .site-footer {
    grid-area: footer;
}

/* Layout: Left Navigation */
body[data-layout="left-nav"] .site-container {
    grid-template-columns: var(--nav-width) 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas: 
        "nav content"
        "nav footer";
    height: 100vh;
}

body[data-layout="left-nav"] .site-nav {
    grid-area: nav;
    overflow-y: auto;
}

body[data-layout="left-nav"] .nav-list {
    flex-direction: column;
    padding: var(--space-md);
}

body[data-layout="left-nav"] .main-content {
    grid-area: content;
    padding: var(--space-xl);
    overflow-y: auto;
}

body[data-layout="left-nav"] .site-footer {
    grid-area: footer;
}

/* Layout: Right Navigation */
body[data-layout="right-nav"] .site-container {
    grid-template-columns: 1fr var(--nav-width);
    grid-template-rows: 1fr auto;
    grid-template-areas: 
        "content nav"
        "footer nav";
    height: 100vh;
}

body[data-layout="right-nav"] .site-nav {
    grid-area: nav;
    overflow-y: auto;
}

body[data-layout="right-nav"] .nav-list {
    flex-direction: column;
    padding: var(--space-md);
}

body[data-layout="right-nav"] .main-content {
    grid-area: content;
    padding: var(--space-xl);
    overflow-y: auto;
}

body[data-layout="right-nav"] .site-footer {
    grid-area: footer;
}

/* Footer Position: Default (same page) */
body[data-footer="same-page"] .site-footer {
    margin-top: auto;
}

/* Footer Position: Full-width (expanded) */
body[data-footer="expanded"] .site-footer {
    width: 100%;
}

/* Adjust grid template for expanded footer in different layouts */
body[data-layout="top-nav"][data-footer="expanded"] .site-container {
    grid-template-rows: auto 1fr auto;
}

body[data-layout="left-nav"][data-footer="expanded"] .site-container,
body[data-layout="right-nav"][data-footer="expanded"] .site-container {
    grid-template-rows: 1fr auto;
}

/* Responsive adjustments for mobile */
@media (max-width: 767px) {
    body[data-layout="left-nav"] .site-container,
    body[data-layout="right-nav"] .site-container {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas: 
            "nav"
            "content"
            "footer";
    }
    
    body[data-layout="left-nav"] .site-nav,
    body[data-layout="right-nav"] .site-nav {
        position: relative;
    }
    
    body[data-layout="left-nav"] .nav-list,
    body[data-layout="right-nav"] .nav-list {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
}

/* Header */
.site-header {
    padding: var(--space-xxl) 0;
    text-align: center;
}

.site-title {
    font-size: var(--text-xxxl);
    margin-bottom: var(--space-md);
    color: var(--primary);
    animation: fadeInUp 0.8s ease;
}

.site-subtitle {
    font-size: var(--text-large);
    color: var(--text-secondary);
    animation: fadeInUp 0.8s ease 0.2s both;
}

/* Hero Section */
.hero-section {
    padding: var(--space-xxl) 0;
    text-align: center;
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
    color: white;
    border-radius: 20px;
    margin-bottom: var(--space-xxl);
    position: relative;
    overflow: hidden;
}

.hero-content {
    position: relative;
    z-index: 1;
}

.hero-title {
    font-size: var(--text-xxl);
    margin-bottom: var(--space-md);
}

.hero-description {
    font-size: var(--text-medium);
    margin-bottom: var(--space-xl);
    opacity: 0.9;
}

.cta-button {
    background: white;
    color: var(--primary);
    padding: var(--space-md) var(--space-xl);
    border: none;
    border-radius: 50px;
    font-size: var(--text-medium);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: inline-block;
    text-decoration: none;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Content Sections */
.content-section {
    margin-bottom: var(--space-xxl);
    animation: fadeIn 0.6s ease;
}

.section-title {
    font-size: var(--text-xl);
    margin-bottom: var(--space-lg);
    color: var(--text-primary);
    border-bottom: 2px solid var(--primary);
    padding-bottom: var(--space-sm);
    display: inline-block;
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
    margin-top: var(--space-xl);
}

.content-card {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: var(--space-xl);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all var(--transition-medium);
    position: relative;
    overflow: hidden;
}

.content-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card-icon {
    font-size: 3rem;
    margin-bottom: var(--space-md);
    display: block;
}

.card-title {
    font-size: var(--text-large);
    margin-bottom: var(--space-sm);
    color: var(--primary);
}

.card-description {
    color: var(--text-secondary);
    line-height: 1.8;
}

/* Editable Content */
.editable {
    position: relative;
    transition: all var(--transition-fast);
}

.edit-mode .editable {
    outline: 2px dashed var(--primary);
    outline-offset: 4px;
    cursor: text;
}

.edit-mode .editable:hover {
    background: var(--glass-bg);
}

.edit-mode .editable:focus {
    outline: 2px solid var(--primary);
    background: var(--bg-secondary);
}

/* Media Placeholder */
.media-placeholder {
    background: var(--neutral-200);
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: var(--space-sm);
    color: var(--text-secondary);
    font-size: var(--text-small);
    text-align: center;
    transition: all var(--transition-fast);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    min-height: 200px;
    width: 100%;
}

/* Show placeholder styling only in edit mode or when an image is set */
:not(.edit-mode) .media-placeholder:not(.has-media) {
    display: none;
}

/* When we have media or are in edit mode, show the placeholder */
.edit-mode .media-placeholder,
.media-placeholder.has-media {
    display: flex;
}

/* Image Caption */
.media-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-sm);
    background: var(--glass-bg);
    backdrop-filter: blur(4px);
    color: var(--text-primary);
    font-size: var(--text-small);
    text-align: center;
    transition: all var(--transition-fast);
    opacity: 0.9;
    transform: translateY(100%);
}

.media-placeholder.has-caption .media-caption {
    transform: translateY(0);
}

.edit-mode .media-placeholder:hover .media-caption,
.media-placeholder.has-media:hover .media-caption {
    transform: translateY(0);
}

/* Styling for placeholders with images */
.media-placeholder.has-media {
    border: none;
    background-color: transparent;
}

.media-placeholder.has-media::before {
    display: none;
}

.media-placeholder.has-media span {
    display: none;
}

.media-placeholder:hover {
    border-color: var(--primary);
    background-color: var(--glass-bg);
    transform: scale(1.02);
}

.media-placeholder::before {
    content: '🖼️';
    font-size: 3rem;
}

/* Footer */
.site-footer {
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    padding: var(--space-xl);
    text-align: center;
    margin-top: auto;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-lg);
}

.footer-links {
    display: flex;
    gap: var(--space-lg);
    list-style: none;
}

.footer-link {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.footer-link:hover {
    color: var(--primary);
}

/* Control Panel Styles */
.control-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    box-shadow: 0 8px 32px var(--glass-shadow);
    z-index: 1000;
    width: 320px;
    min-width: 200px;
    max-width: 500px;
    resize: both;
    overflow: auto;
    transition: all var(--transition-medium);
}

.control-panel.minimized {
    width: auto;
    height: auto;
    resize: none;
    overflow: hidden;
}

.control-panel.minimized .control-panel-body {
    display: none;
}

.control-panel.dragging {
    opacity: 0.8;
}

.control-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    cursor: move;
    background: var(--glass-bg);
    border-bottom: 1px solid var(--glass-border);
}

.control-panel-body {
    padding: var(--space-md);
    max-height: 70vh;
    overflow-y: auto;
}

.control-panel h3 {
    color: var(--text-primary);
    font-size: var(--text-large);
    margin: 0;
}

.control-panel-actions {
    display: flex;
    gap: var(--space-xs);
}

.control-btn {
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: var(--space-xs);
    border-radius: 4px;
    transition: all var(--transition-fast);
    font-size: var(--text-medium);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.control-btn:hover {
    background: var(--glass-bg);
    color: var(--primary);
}

.edit-mode-toggle {
    background: var(--accent);
    color: white;
    border: none;
    padding: var(--space-xs) var(--space-sm);
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--text-tiny);
    font-weight: 600;
    transition: all var(--transition-fast);
}

.edit-mode-toggle:hover {
    background: var(--accent-alt);
}

.edit-mode-toggle.active {
    background: var(--primary);
}

.control-group {
    margin-bottom: var(--space-lg);
}

.control-group label {
    display: block;
    margin-bottom: var(--space-xs);
    font-weight: 600;
    color: var(--text-secondary);
    font-size: var(--text-small);
}

/* Color Controls */
.color-controls {
    margin-top: var(--space-md);
}

.color-sliders {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-top: var(--space-xs);
}

.color-slider-group {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
}

.color-slider-group label {
    min-width: 70px;
    margin: 0;
    font-size: var(--text-tiny);
}

.color-slider-group input[type="color"] {
    -webkit-appearance: none;
    appearance: none;
    border: none;
    width: 100%;
    height: 24px;
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
}

.color-slider-group input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}

.color-slider-group input[type="color"]::-webkit-color-swatch {
    border-radius: 3px;
    border: 1px solid var(--border-color);
}

.color-value {
    font-size: var(--text-tiny);
    color: var(--text-secondary);
    width: 70px;
    text-align: right;
}

button.btn-sm {
    margin-top: var(--space-sm);
    padding: 6px;
    font-size: var(--text-tiny);
}

#reset-colors {
    background: var(--secondary);
}

/* Dark mode for color picker */
body[data-mode="dark"] .color-slider-group input[type="color"] {
    background: var(--neutral-800);
}

body[data-mode="dark"] .color-slider-group input[type="color"]::-webkit-color-swatch {
    border-color: var(--neutral-600);
}

.control-group select,
.control-group input {
    width: 100%;
    padding: var(--space-sm);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: var(--text-small);
    transition: all var(--transition-fast);
}

.control-group select:focus,
.control-group input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: var(--space-sm) var(--space-md);
    border-radius: 8px;
    cursor: pointer;
    font-size: var(--text-small);
    font-weight: 600;
    transition: all var(--transition-fast);
    width: 100%;
    margin-top: var(--space-sm);
}

.btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
}

.btn:active {
    transform: translateY(0);
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 768px) {
    body[data-layout="left-nav"] .site-nav,
    body[data-layout="right-nav"] .site-nav {
        position: relative;
        width: 100%;
        min-height: auto;
    }

    body[data-layout="left-nav"] .main-content,
    body[data-layout="right-nav"] .main-content {
        margin: 0;
    }

    body[data-layout="left-nav"] .site-container,
    body[data-layout="right-nav"] .site-container {
        flex-direction: column;
    }

    .control-panel {
        width: 90%;
        max-width: none;
        left: 5%;
        right: 5%;
    }

    .site-title {
        font-size: var(--text-xxl);
    }

    .hero-title {
        font-size: var(--text-xl);
    }
}

/* Color Bar Slider */
.color-bar-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
    gap: 8px;
}

.color-bar-wrapper {
    position: relative;
    width: 100%;
    height: 24px;
    margin-bottom: 10px;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
    overflow: hidden;
}

/* Current color indicator */
.color-bar-current-indicator {
    position: absolute;
    top: -3px;
    transform: translateX(-50%);
    width: 10px;
    height: 30px;
    background: transparent;
    border-left: 2px solid #fff;
    border-right: 2px solid #fff;
    pointer-events: none;
    z-index: 3;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.color-bar-slider {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    width: 100%;
    height: 24px;
    background: linear-gradient(to right, 
        hsl(0, 100%, 50%), hsl(30, 100%, 50%), 
        hsl(60, 100%, 50%), hsl(90, 100%, 50%), 
        hsl(120, 100%, 50%), hsl(150, 100%, 50%), 
        hsl(180, 100%, 50%), hsl(210, 100%, 50%), 
        hsl(240, 100%, 50%), hsl(270, 100%, 50%), 
        hsl(300, 100%, 50%), hsl(330, 100%, 50%), 
        hsl(360, 100%, 50%));
    border-radius: 6px;
    outline: none;
    margin: 0;
    padding: 0;
    transition: all var(--transition-fast);
}

.color-bar-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 6px;
    height: 28px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 2;
}

.color-bar-slider::-moz-range-thumb {
    width: 6px;
    height: 28px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 2;
}

.color-adjustment-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.color-preview-box {
    width: 100%;
    height: 30px;
    border-radius: 4px;
    margin-top: 5px;
    border: 1px solid var(--border-color);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.7);
    font-weight: bold;
    font-size: 0.8rem;
}

.slider-container {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.slider-container label {
    font-size: var(--text-tiny);
    margin-bottom: 2px;
}

.adjustment-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    outline: none;
    transition: opacity var(--transition-fast);
}

#lightness-slider {
    background: linear-gradient(to right, #333333, #ffffff);
}

#saturation-slider {
    background: linear-gradient(to right, #808080, var(--primary));
}

.adjustment-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.adjustment-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Dark mode adjustments */
[data-mode="dark"] .color-bar-slider::-webkit-slider-thumb,
[data-mode="dark"] .adjustment-slider::-webkit-slider-thumb {
    background: var(--neutral-800);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

[data-mode="dark"] .color-bar-slider::-moz-range-thumb,
[data-mode="dark"] .adjustment-slider::-moz-range-thumb {
    background: var(--neutral-800);
    border: 2px solid rgba(255, 255, 255, 0.2);
}
 = Get-Content  -Raw

 = @(
    ".hue-slider",
    ".floating-preview", 
    ".semantic-demo",
    ".control-panel"
)

foreach ( in ) {
    if (:root {
    /* Golden Ratio Foundation */
    --golden-ratio: 1.618;
    --inverse-golden-ratio: 0.618;
    
    /* Layout Dimensions */
    --header-height: 80px;
    --nav-width: calc(100vw / (var(--golden-ratio) * 2.75)); /* ~22.4% of viewport width */
    --footer-height: 60px;
    --content-padding: 2rem;
    --grid-gap: 1rem;
    
    /* Typography Scale */
    --text-tiny: 0.75rem;
    --text-small: 0.875rem;
    --text-standard: 1rem;
    --text-medium: 1.125rem;
    --text-large: 1.25rem;
    --text-xl: 1.5rem;
    --text-xxl: 2rem;
    --text-xxxl: 3rem;
    
    /* Spacing Scale */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-xxl: 3rem;
    
    /* Color Systems */
    --primary: #6366f1;
    --primary-light: #a5b4fc;
    --primary-dark: #4338ca;
    --secondary: #64748b;
    --accent: #10b981;
    --accent-alt: #f59e0b;
    
    /* Neutral Scale */
    --neutral-50: #f8fafc;
    --neutral-100: #f1f5f9;
    --neutral-200: #e2e8f0;
    --neutral-300: #cbd5e1;
    --neutral-400: #94a3b8;
    --neutral-500: #64748b;
    --neutral-600: #475569;
    --neutral-700: #334155;
    --neutral-800: #1e293b;
    --neutral-900: #0f172a;
    
    /* Glassmorphism */
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
    --glass-shadow: rgba(0, 0, 0, 0.1);
    
    /* Animations */
    --transition-fast: 0.15s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    /* Current Theme Variables */
    --bg-primary: var(--neutral-50);
    --bg-secondary: #ffffff;
    --text-primary: var(--neutral-900);
    --text-secondary: var(--neutral-600);
    --border-color: var(--neutral-200);
}

/* Dark Theme */
[data-theme="dark"] {
    --bg-primary: var(--neutral-900);
    --bg-secondary: var(--neutral-800);
    --text-primary: var(--neutral-100);
    --text-secondary: var(--neutral-400);
    --border-color: var(--neutral-700);
    --glass-bg: rgba(0, 0, 0, 0.3);
    --glass-border: rgba(255, 255, 255, 0.1);
}

/* Cyberpunk Theme */
[data-theme="cyberpunk"] {
    --primary: #00ffff;
    --primary-light: #80ffff;
    --primary-dark: #00cccc;
    --accent: #ff0080;
    --accent-alt: #ffff00;
    --bg-primary: #0a0a0a;
    --bg-secondary: #1a1a2e;
    --text-primary: #00ffff;
    --text-secondary: #ff0080;
    --border-color: #00ffff;
}

/* Ocean Theme */
[data-theme="ocean"] {
    --primary: #0ea5e9;
    --primary-light: #7dd3fc;
    --primary-dark: #0284c7;
    --accent: #06b6d4;
    --accent-alt: #84cc16;
    --bg-primary: #f0f9ff;
    --bg-secondary: #e0f2fe;
    --text-primary: var(--neutral-800);
    --text-secondary: var(--neutral-600);
    --border-color: #b3e5fc;
}

/* Sunset Theme */
[data-theme="sunset"] {
    --primary: #f97316;
    --primary-light: #fdba74;
    --primary-dark: #ea580c;
    --accent: #ef4444;
    --accent-alt: #fbbf24;
    --bg-primary: #fff7ed;
    --bg-secondary: #ffedd5;
    --text-primary: var(--neutral-800);
    --text-secondary: var(--neutral-600);
    --border-color: #fed7aa;
}

/* Forest Theme */
[data-theme="forest"] {
    --primary: #059669;
    --primary-light: #6ee7b7;
    --primary-dark: #047857;
    --accent: #84cc16;
    --accent-alt: #eab308;
    --bg-primary: #f0fdf4;
    --bg-secondary: #dcfce7;
    --text-primary: var(--neutral-800);
    --text-secondary: var(--neutral-600);
    --border-color: #bbf7d0;
}

/* Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: var(--bg-primary);
    transition: all var(--transition-medium);
}

/* Site Container */
.site-container {
    min-height: 100vh;
    display: grid;
    transition: all var(--transition-medium);
}

/* Navigation Styles */
.site-nav {
    background: var(--bg-secondary);
    transition: all var(--transition-medium);
    box-shadow: 0 2px 10px var(--glass-shadow);
}

.nav-list {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
}

.nav-link {
    color: var(--text-primary);
    text-decoration: none;
    padding: var(--space-md) var(--space-lg);
    transition: all var(--transition-fast);
    display: block;
}

.nav-link:hover {
    background: var(--glass-bg);
    color: var(--primary);
}

/* Layout: Top Navigation (Default) */
body[data-layout="top-nav"] .site-container {
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 
        "nav"
        "content"
        "footer";
}

body[data-layout="top-nav"] .site-nav {
    grid-area: nav;
}

body[data-layout="top-nav"] .nav-list {
    justify-content: center;
    align-items: center;
}

body[data-layout="top-nav"] .main-content {
    grid-area: content;
    padding: var(--space-xl);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

body[data-layout="top-nav"] .site-footer {
    grid-area: footer;
}

/* Layout: Left Navigation */
body[data-layout="left-nav"] .site-container {
    grid-template-columns: var(--nav-width) 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas: 
        "nav content"
        "nav footer";
    height: 100vh;
}

body[data-layout="left-nav"] .site-nav {
    grid-area: nav;
    overflow-y: auto;
}

body[data-layout="left-nav"] .nav-list {
    flex-direction: column;
    padding: var(--space-md);
}

body[data-layout="left-nav"] .main-content {
    grid-area: content;
    padding: var(--space-xl);
    overflow-y: auto;
}

body[data-layout="left-nav"] .site-footer {
    grid-area: footer;
}

/* Layout: Right Navigation */
body[data-layout="right-nav"] .site-container {
    grid-template-columns: 1fr var(--nav-width);
    grid-template-rows: 1fr auto;
    grid-template-areas: 
        "content nav"
        "footer nav";
    height: 100vh;
}

body[data-layout="right-nav"] .site-nav {
    grid-area: nav;
    overflow-y: auto;
}

body[data-layout="right-nav"] .nav-list {
    flex-direction: column;
    padding: var(--space-md);
}

body[data-layout="right-nav"] .main-content {
    grid-area: content;
    padding: var(--space-xl);
    overflow-y: auto;
}

body[data-layout="right-nav"] .site-footer {
    grid-area: footer;
}

/* Footer Position: Default (same page) */
body[data-footer="same-page"] .site-footer {
    margin-top: auto;
}

/* Footer Position: Full-width (expanded) */
body[data-footer="expanded"] .site-footer {
    width: 100%;
}

/* Adjust grid template for expanded footer in different layouts */
body[data-layout="top-nav"][data-footer="expanded"] .site-container {
    grid-template-rows: auto 1fr auto;
}

body[data-layout="left-nav"][data-footer="expanded"] .site-container,
body[data-layout="right-nav"][data-footer="expanded"] .site-container {
    grid-template-rows: 1fr auto;
}

/* Responsive adjustments for mobile */
@media (max-width: 767px) {
    body[data-layout="left-nav"] .site-container,
    body[data-layout="right-nav"] .site-container {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        grid-template-areas: 
            "nav"
            "content"
            "footer";
    }
    
    body[data-layout="left-nav"] .site-nav,
    body[data-layout="right-nav"] .site-nav {
        position: relative;
    }
    
    body[data-layout="left-nav"] .nav-list,
    body[data-layout="right-nav"] .nav-list {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
}

/* Header */
.site-header {
    padding: var(--space-xxl) 0;
    text-align: center;
}

.site-title {
    font-size: var(--text-xxxl);
    margin-bottom: var(--space-md);
    color: var(--primary);
    animation: fadeInUp 0.8s ease;
}

.site-subtitle {
    font-size: var(--text-large);
    color: var(--text-secondary);
    animation: fadeInUp 0.8s ease 0.2s both;
}

/* Hero Section */
.hero-section {
    padding: var(--space-xxl) 0;
    text-align: center;
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
    color: white;
    border-radius: 20px;
    margin-bottom: var(--space-xxl);
    position: relative;
    overflow: hidden;
}

.hero-content {
    position: relative;
    z-index: 1;
}

.hero-title {
    font-size: var(--text-xxl);
    margin-bottom: var(--space-md);
}

.hero-description {
    font-size: var(--text-medium);
    margin-bottom: var(--space-xl);
    opacity: 0.9;
}

.cta-button {
    background: white;
    color: var(--primary);
    padding: var(--space-md) var(--space-xl);
    border: none;
    border-radius: 50px;
    font-size: var(--text-medium);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: inline-block;
    text-decoration: none;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Content Sections */
.content-section {
    margin-bottom: var(--space-xxl);
    animation: fadeIn 0.6s ease;
}

.section-title {
    font-size: var(--text-xl);
    margin-bottom: var(--space-lg);
    color: var(--text-primary);
    border-bottom: 2px solid var(--primary);
    padding-bottom: var(--space-sm);
    display: inline-block;
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
    margin-top: var(--space-xl);
}

.content-card {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: var(--space-xl);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all var(--transition-medium);
    position: relative;
    overflow: hidden;
}

.content-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card-icon {
    font-size: 3rem;
    margin-bottom: var(--space-md);
    display: block;
}

.card-title {
    font-size: var(--text-large);
    margin-bottom: var(--space-sm);
    color: var(--primary);
}

.card-description {
    color: var(--text-secondary);
    line-height: 1.8;
}

/* Editable Content */
.editable {
    position: relative;
    transition: all var(--transition-fast);
}

.edit-mode .editable {
    outline: 2px dashed var(--primary);
    outline-offset: 4px;
    cursor: text;
}

.edit-mode .editable:hover {
    background: var(--glass-bg);
}

.edit-mode .editable:focus {
    outline: 2px solid var(--primary);
    background: var(--bg-secondary);
}

/* Media Placeholder */
.media-placeholder {
    background: var(--neutral-200);
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: var(--space-sm);
    color: var(--text-secondary);
    font-size: var(--text-small);
    text-align: center;
    transition: all var(--transition-fast);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    min-height: 200px;
    width: 100%;
}

/* Show placeholder styling only in edit mode or when an image is set */
:not(.edit-mode) .media-placeholder:not(.has-media) {
    display: none;
}

/* When we have media or are in edit mode, show the placeholder */
.edit-mode .media-placeholder,
.media-placeholder.has-media {
    display: flex;
}

/* Image Caption */
.media-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-sm);
    background: var(--glass-bg);
    backdrop-filter: blur(4px);
    color: var(--text-primary);
    font-size: var(--text-small);
    text-align: center;
    transition: all var(--transition-fast);
    opacity: 0.9;
    transform: translateY(100%);
}

.media-placeholder.has-caption .media-caption {
    transform: translateY(0);
}

.edit-mode .media-placeholder:hover .media-caption,
.media-placeholder.has-media:hover .media-caption {
    transform: translateY(0);
}

/* Styling for placeholders with images */
.media-placeholder.has-media {
    border: none;
    background-color: transparent;
}

.media-placeholder.has-media::before {
    display: none;
}

.media-placeholder.has-media span {
    display: none;
}

.media-placeholder:hover {
    border-color: var(--primary);
    background-color: var(--glass-bg);
    transform: scale(1.02);
}

.media-placeholder::before {
    content: '🖼️';
    font-size: 3rem;
}

/* Footer */
.site-footer {
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    padding: var(--space-xl);
    text-align: center;
    margin-top: auto;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-lg);
}

.footer-links {
    display: flex;
    gap: var(--space-lg);
    list-style: none;
}

.footer-link {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.footer-link:hover {
    color: var(--primary);
}

/* Control Panel Styles */
.control-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    box-shadow: 0 8px 32px var(--glass-shadow);
    z-index: 1000;
    width: 320px;
    min-width: 200px;
    max-width: 500px;
    resize: both;
    overflow: auto;
    transition: all var(--transition-medium);
}

.control-panel.minimized {
    width: auto;
    height: auto;
    resize: none;
    overflow: hidden;
}

.control-panel.minimized .control-panel-body {
    display: none;
}

.control-panel.dragging {
    opacity: 0.8;
}

.control-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    cursor: move;
    background: var(--glass-bg);
    border-bottom: 1px solid var(--glass-border);
}

.control-panel-body {
    padding: var(--space-md);
    max-height: 70vh;
    overflow-y: auto;
}

.control-panel h3 {
    color: var(--text-primary);
    font-size: var(--text-large);
    margin: 0;
}

.control-panel-actions {
    display: flex;
    gap: var(--space-xs);
}

.control-btn {
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: var(--space-xs);
    border-radius: 4px;
    transition: all var(--transition-fast);
    font-size: var(--text-medium);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.control-btn:hover {
    background: var(--glass-bg);
    color: var(--primary);
}

.edit-mode-toggle {
    background: var(--accent);
    color: white;
    border: none;
    padding: var(--space-xs) var(--space-sm);
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--text-tiny);
    font-weight: 600;
    transition: all var(--transition-fast);
}

.edit-mode-toggle:hover {
    background: var(--accent-alt);
}

.edit-mode-toggle.active {
    background: var(--primary);
}

.control-group {
    margin-bottom: var(--space-lg);
}

.control-group label {
    display: block;
    margin-bottom: var(--space-xs);
    font-weight: 600;
    color: var(--text-secondary);
    font-size: var(--text-small);
}

/* Color Controls */
.color-controls {
    margin-top: var(--space-md);
}

.color-sliders {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-top: var(--space-xs);
}

.color-slider-group {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
}

.color-slider-group label {
    min-width: 70px;
    margin: 0;
    font-size: var(--text-tiny);
}

.color-slider-group input[type="color"] {
    -webkit-appearance: none;
    appearance: none;
    border: none;
    width: 100%;
    height: 24px;
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
}

.color-slider-group input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}

.color-slider-group input[type="color"]::-webkit-color-swatch {
    border-radius: 3px;
    border: 1px solid var(--border-color);
}

.color-value {
    font-size: var(--text-tiny);
    color: var(--text-secondary);
    width: 70px;
    text-align: right;
}

button.btn-sm {
    margin-top: var(--space-sm);
    padding: 6px;
    font-size: var(--text-tiny);
}

#reset-colors {
    background: var(--secondary);
}

/* Dark mode for color picker */
body[data-mode="dark"] .color-slider-group input[type="color"] {
    background: var(--neutral-800);
}

body[data-mode="dark"] .color-slider-group input[type="color"]::-webkit-color-swatch {
    border-color: var(--neutral-600);
}

.control-group select,
.control-group input {
    width: 100%;
    padding: var(--space-sm);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: var(--text-small);
    transition: all var(--transition-fast);
}

.control-group select:focus,
.control-group input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: var(--space-sm) var(--space-md);
    border-radius: 8px;
    cursor: pointer;
    font-size: var(--text-small);
    font-weight: 600;
    transition: all var(--transition-fast);
    width: 100%;
    margin-top: var(--space-sm);
}

.btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
}

.btn:active {
    transform: translateY(0);
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 768px) {
    body[data-layout="left-nav"] .site-nav,
    body[data-layout="right-nav"] .site-nav {
        position: relative;
        width: 100%;
        min-height: auto;
    }

    body[data-layout="left-nav"] .main-content,
    body[data-layout="right-nav"] .main-content {
        margin: 0;
    }

    body[data-layout="left-nav"] .site-container,
    body[data-layout="right-nav"] .site-container {
        flex-direction: column;
    }

    .control-panel {
        width: 90%;
        max-width: none;
        left: 5%;
        right: 5%;
    }

    .site-title {
        font-size: var(--text-xxl);
    }

    .hero-title {
        font-size: var(--text-xl);
    }
}

/* Color Bar Slider */
.color-bar-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
    gap: 8px;
}

.color-bar-wrapper {
    position: relative;
    width: 100%;
    height: 24px;
    margin-bottom: 10px;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
    overflow: hidden;
}

/* Current color indicator */
.color-bar-current-indicator {
    position: absolute;
    top: -3px;
    transform: translateX(-50%);
    width: 10px;
    height: 30px;
    background: transparent;
    border-left: 2px solid #fff;
    border-right: 2px solid #fff;
    pointer-events: none;
    z-index: 3;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.color-bar-slider {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    width: 100%;
    height: 24px;
    background: linear-gradient(to right, 
        hsl(0, 100%, 50%), hsl(30, 100%, 50%), 
        hsl(60, 100%, 50%), hsl(90, 100%, 50%), 
        hsl(120, 100%, 50%), hsl(150, 100%, 50%), 
        hsl(180, 100%, 50%), hsl(210, 100%, 50%), 
        hsl(240, 100%, 50%), hsl(270, 100%, 50%), 
        hsl(300, 100%, 50%), hsl(330, 100%, 50%), 
        hsl(360, 100%, 50%));
    border-radius: 6px;
    outline: none;
    margin: 0;
    padding: 0;
    transition: all var(--transition-fast);
}

.color-bar-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 6px;
    height: 28px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 2;
}

.color-bar-slider::-moz-range-thumb {
    width: 6px;
    height: 28px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 2;
}

.color-adjustment-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
}

.color-preview-box {
    width: 100%;
    height: 30px;
    border-radius: 4px;
    margin-top: 5px;
    border: 1px solid var(--border-color);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.7);
    font-weight: bold;
    font-size: 0.8rem;
}

.slider-container {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.slider-container label {
    font-size: var(--text-tiny);
    margin-bottom: 2px;
}

.adjustment-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 4px;
    outline: none;
    transition: opacity var(--transition-fast);
}

#lightness-slider {
    background: linear-gradient(to right, #333333, #ffffff);
}

#saturation-slider {
    background: linear-gradient(to right, #808080, var(--primary));
}

.adjustment-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.adjustment-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Dark mode adjustments */
[data-mode="dark"] .color-bar-slider::-webkit-slider-thumb,
[data-mode="dark"] .adjustment-slider::-webkit-slider-thumb {
    background: var(--neutral-800);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

[data-mode="dark"] .color-bar-slider::-moz-range-thumb,
[data-mode="dark"] .adjustment-slider::-moz-range-thumb {
    background: var(--neutral-800);
    border: 2px solid rgba(255, 255, 255, 0.2);
}
 -match ) {
        Write-Host "✅ Found style: " -ForegroundColor Green
    } else {
        Write-Host "❌ Missing style: " -ForegroundColor Red
    }
}

# 5. Check index.html for script and CSS includes
Write-Host "
5. Checking index.html for script and CSS includes:" -ForegroundColor Yellow
 = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\themes\generator\index.html"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HSL Color Pick        /* Theme Selector */
        .theme-selector {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: var(--space-md);
            gap: var(--space-sm);
        }
        
        .theme-selector label {
            color: var(--text-secondary);
            font-weight: 600;
        }
        
        .theme-selector select {
            background-color: var(--surface);
            color: var(--text-primary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: var(--space-xs) var(--space-sm);
            font-size: var(--text-standard);
            cursor: pointer;
            transition: border-color 0.2s ease;
        }
        
        .theme-selector select:hover {
            border-color: var(--primary);
        }
        
        .theme-selector select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px var(--primary-light);
        }

        /* Color Display */
        .color-display {
            width: 100%;
            height: 200px;
            border-radius: 15px;
            margin-bottom: var(--space-lg);
            position: relative;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s ease;
            border: 1px solid var(--border);
        }    <style>
        /* Theme Variables based on Formula System */
        :root {
            /* Golden Ratio Foundation */
            --golden-ratio: 1.618;
            --inverse-golden-ratio: 0.618;
            
            /* Layout Dimensions */
            --header-height: 20vh;
            --nav-width: calc(100vw / (var(--golden-ratio) * 2.75)); /* ~22.4% */
            --content-padding: calc(1rem * var(--golden-ratio)); /* ~26px */
            --grid-gap: 1rem; /* 16px */
            
            /* Typography Scale */
            --text-tiny: 0.75rem;    /* 12px */
            --text-small: 0.813rem;  /* 13px */
            --text-standard: 0.875rem; /* 14px */
            --text-medium: 0.938rem; /* 15px */
            --text-large: 1rem;      /* 16px */
            --text-xl: 1.125rem;     /* 18px */
            
            /* Spacing Scale */
            --space-xs: 0.25rem;     /* 4px */
            --space-sm: 0.5rem;      /* 8px */
            --space-md: 1rem;        /* 16px */
            --space-lg: calc(1rem * var(--golden-ratio)); /* ~26px */
            --space-xl: calc(1rem * var(--golden-ratio) * var(--golden-ratio)); /* ~42px */
            
            /* Primary Colors - Default Theme */
            --primary: #007bff;
            --primary-light: #66b3ff;
            --primary-dark: #0056b3;
            --primary-contrast: #ffffff;
            
            /* Secondary Colors */
            --secondary: #6c757d;
            --secondary-light: #9ca3a9;
            --secondary-dark: #495057;
            --secondary-contrast: #ffffff;
            
            /* Accent Colors */
            --accent: #28a745;
            --accent-light: #71dd8a;
            --accent-dark: #1e7e34;
            --accent-contrast: #ffffff;
            
            /* Neutral Scale (9 Shades) */
            --neutral-50: #f8f9fa;   /* Lightest */
            --neutral-100: #e9ecef;
            --neutral-200: #dee2e6;
            --neutral-300: #ced4da;
            --neutral-400: #adb5bd;
            --neutral-500: #6c757d;  /* Middle */
            --neutral-600: #495057;
            --neutral-700: #343a40;
            --neutral-800: #212529;
            --neutral-900: #1a1d21;  /* Darkest */
            
            /* Semantic Colors */
            --background: var(--neutral-50);
            --surface: #ffffff;
            --text-primary: var(--neutral-800);
            --text-secondary: var(--neutral-600);
            --border: var(--neutral-300);
        }
        
        /* Theme: Ocean */
        [data-theme="ocean"] {
            --primary: #0088cc;
            --primary-light: #47b0eb;
            --primary-dark: #006699;
            --accent: #00ccaa;
            --accent-light: #47ebdc;
            --accent-dark: #009980;
            --background: #f0f7fc;
            --surface: #ffffff;
        }
        
        /* Theme: Sunset */
        [data-theme="sunset"] {
            --primary: #ff7e00;
            --primary-light: #ffac5e;
            --primary-dark: #cc6500;
            --accent: #e63946;
            --accent-light: #ff8a94;
            --accent-dark: #b52b35;
            --background: #fff5eb;
            --surface: #ffffff;
        }
        
        /* Theme: Forest */
        [data-theme="forest"] {
            --primary: #2d6a4f;
            --primary-light: #74c69d;
            --primary-dark: #1b4332;
            --accent: #e9c46a;
            --accent-light: #f4e3ac;
            --accent-dark: #d4a017;
            --background: #f2f9f6;
            --surface: #ffffff;
        }
        
        /* Theme: Cyberpunk */
        [data-theme="cyberpunk"] {
            --primary: #ff00ff;
            --primary-light: #ff99ff;
            --primary-dark: #cc00cc;
            --accent: #00ffff;
            --accent-light: #99ffff;
            --accent-dark: #00cccc;
            --background: #151520;
            --surface: #252535;
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
            --border: #554488;
        }
        
        /* Dark Theme */
        [data-theme="dark"] {
            --background: #121212;
            --surface: #1e1e1e;
            --text-primary: #f0f0f0;
            --text-secondary: #a0a0a0;
            --border: #404040;
            --neutral-50: #1e1e1e;
            --neutral-100: #2d2d2d;
            --neutral-200: #3a3a3a;
            --neutral-300: #4d4d4d;
            --neutral-400: #777777;
            --neutral-800: #e0e0e0;
            --neutral-900: #f5f5f5;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: var(--background);
            color: var(--text-primary);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .color-picker-container {
            background: var(--surface);
            padding: var(--space-lg);
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            width: 500px;
            max-width: 90vw;
        }

        h2 {
            margin: 0 0 var(--space-xl) 0;
            color: var(--text-primary);
            text-align: center;
            font-size: var(--text-xl);
        }

        /* Color Display */
        .color-display {
            width: 100%;
            height: 200px;
            border-radius: 15px;
            margin-bottom: var(--space-xl);
            position: relative;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s ease;
        }

        /* Slider Container */
        .slider-group {
            margin-bottom: var(--space-md);
        }

        .slider-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-secondary);
        }

        .slider-value {
            font-weight: normal;
            color: var(--text-secondary);
            font-size: var(--text-standard);
        }

        /* Base Slider Styles */
        .color-slider {
            width: 100%;
            height: 30px;
            -webkit-appearance: none;
            appearance: none;
            outline: none;
            cursor: pointer;
            border-radius: 15px;
            position: relative;
        }

        /* Slider Thumbs */
        .color-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 26px;
            height: 26px;
            background: var(--surface);
            cursor: pointer;
            border-radius: 50%;
            border: 3px solid var(--text-primary);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.1s ease;
        }

        .color-slider::-moz-range-thumb {
            width: 26px;
            height: 26px;
            background: var(--surface);
            cursor: pointer;
            border-radius: 50%;
            border: 3px solid var(--text-primary);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.1s ease;
        }

        .color-slider:hover::-webkit-slider-thumb {
            transform: scale(1.1);
        }

        .color-slider:hover::-moz-range-thumb {
            transform: scale(1.1);
        }

        /* Hue Slider */
        #hueSlider {
            background: linear-gradient(to right, 
                hsl(0, 100%, 50%) 0%, 
                hsl(30, 100%, 50%) 8.33%,
                hsl(60, 100%, 50%) 16.66%, 
                hsl(90, 100%, 50%) 25%,
                hsl(120, 100%, 50%) 33.33%,
                hsl(150, 100%, 50%) 41.66%,
                hsl(180, 100%, 50%) 50%, 
                hsl(210, 100%, 50%) 58.33%,
                hsl(240, 100%, 50%) 66.66%, 
                hsl(270, 100%, 50%) 75%,
                hsl(300, 100%, 50%) 83.33%, 
                hsl(330, 100%, 50%) 91.66%,
                hsl(360, 100%, 50%) 100%);
        }

        /* Saturation Slider - Dynamic background */
        #saturationSlider {
            background: linear-gradient(to right, 
                hsl(180, 0%, 50%), 
                hsl(180, 100%, 50%));
        }

        /* Lightness Slider - Dynamic background */
        #lightnessSlider {
            background: linear-gradient(to right, 
                hsl(180, 100%, 0%) 0%, 
                hsl(180, 100%, 50%) 50%, 
                hsl(180, 100%, 100%) 100%);
        }

        /* Color Values Display */
        .color-values {
            background: var(--neutral-100);
            border-radius: 10px;
            padding: var(--space-md);
            margin-top: var(--space-lg);
        }

        .color-value-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--neutral-300);
        }

        .color-value-row:last-child {
            border-bottom: none;
        }

        .color-value-label {
            font-weight: 600;
            color: var(--text-secondary);
            font-size: var(--text-standard);
        }

        .color-value-text {
            font-family: 'Courier New', monospace;
            font-size: var(--text-standard);
            color: var(--text-primary);
            background: var(--surface);
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .color-value-text:hover {
            background: var(--neutral-200);
        }

        /* Copy notification */
        .copy-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--text-primary);
            color: var(--primary-contrast);
            padding: 12px 20px;
            border-radius: 8px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            pointer-events: none;
        }

        .copy-notification.show {
            opacity: 1;
            transform: translateY(0);
        }

        /* Visual Guide */
        .visual-guide {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: var(--space-lg);
            padding-top: var(--space-lg);
            border-top: 1px solid var(--neutral-300);
        }

        .guide-item {
            text-align: center;
        }

        .guide-box {
            width: 100%;
            height: 60px;
            border-radius: 8px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--text-small);
            font-weight: 600;
            color: var(--primary-contrast);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .guide-label {
            font-size: var(--text-standard);
            color: var(--text-secondary);
        }
    </style>
</head>
<body>
    <div class="color-picker-container">
        <h2>HSL Color Picker</h2>
        
        <!-- Theme Selector -->
        <div class="theme-selector">
            <label for="theme-select">Theme:</label>
            <select id="theme-select">
                <option value="default">Default</option>
                <option value="ocean">Ocean</option>
                <option value="sunset">Sunset</option>
                <option value="forest">Forest</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="dark">Dark Mode</option>
            </select>
        </div>
        
        <!-- Color Display -->
        <div class="color-display" id="colorDisplay"></div>
        
        <!-- Hue Slider -->
        <div class="slider-group">
            <div class="slider-label">
                <span>Hue</span>
                <span class="slider-value"><span id="hueValue">180</span>°</span>
            </div>
            <input type="range" class="color-slider" id="hueSlider" min="0" max="360" value="180">
        </div>
        
        <!-- Saturation Slider -->
        <div class="slider-group">
            <div class="slider-label">
                <span>Saturation</span>
                <span class="slider-value"><span id="saturationValue">100</span>%</span>
            </div>
            <input type="range" class="color-slider" id="saturationSlider" min="0" max="100" value="100">
        </div>
        
        <!-- Lightness Slider -->
        <div class="slider-group">
            <div class="slider-label">
                <span>Lightness</span>
                <span class="slider-value"><span id="lightnessValue">50</span>%</span>
            </div>
            <input type="range" class="color-slider" id="lightnessSlider" min="0" max="100" value="50">
        </div>
        
        <!-- Color Values -->
        <div class="color-values">
            <div class="color-value-row">
                <span class="color-value-label">HSL:</span>
                <span class="color-value-text" id="hslValue">hsl(180, 100%, 50%)</span>
            </div>
            <div class="color-value-row">
                <span class="color-value-label">RGB:</span>
                <span class="color-value-text" id="rgbValue">rgb(0, 255, 255)</span>
            </div>
            <div class="color-value-row">
                <span class="color-value-label">HEX:</span>
                <span class="color-value-text" id="hexValue">#00ffff</span>
            </div>
        </div>
        
        <!-- Visual Guide -->
        <div class="visual-guide">
            <div class="guide-item">
                <div class="guide-box" style="background: linear-gradient(to right, gray, red);">HUE</div>
                <div class="guide-label">Changes the color</div>
            </div>
            <div class="guide-item">
                <div class="guide-box" style="background: linear-gradient(to right, #888, #ff0000);">SATURATION</div>
                <div class="guide-label">Gray to vivid</div>
            </div>
            <div class="guide-item">
                <div class="guide-box" style="background: linear-gradient(to right, black, red, white);">LIGHTNESS</div>
                <div class="guide-label">Dark to light</div>
            </div>
        </div>
    </div>
    
    <!-- Copy notification -->
    <div class="copy-notification" id="copyNotification">Copied to clipboard!</div>

    <script>
        // Get elements
        const colorDisplay = document.getElementById('colorDisplay');
        const hueSlider = document.getElementById('hueSlider');
        const saturationSlider = document.getElementById('saturationSlider');
        const lightnessSlider = document.getElementById('lightnessSlider');
        const hueValue = document.getElementById('hueValue');
        const saturationValue = document.getElementById('saturationValue');
        const lightnessValue = document.getElementById('lightnessValue');
        const hslValue = document.getElementById('hslValue');
        const rgbValue = document.getElementById('rgbValue');
        const hexValue = document.getElementById('hexValue');
        const copyNotification = document.getElementById('copyNotification');
        const themeSelect = document.getElementById('theme-select');

        let currentHue = 180;
        let currentSaturation = 100;
        let currentLightness = 50;
        let currentTheme = 'default';

        // Update color display
        function updateColor() {
            const hsl = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;
            
            // Update main display
            colorDisplay.style.backgroundColor = hsl;
            
            // Update value displays
            hueValue.textContent = Math.round(currentHue);
            saturationValue.textContent = Math.round(currentSaturation);
            lightnessValue.textContent = Math.round(currentLightness);
            hslValue.textContent = hsl;
            
            // Update saturation slider background
            saturationSlider.style.background = `linear-gradient(to right, 
                hsl(${currentHue}, 0%, ${currentLightness}%), 
                hsl(${currentHue}, 100%, ${currentLightness}%))`;
            
            // Update lightness slider background
            lightnessSlider.style.background = `linear-gradient(to right, 
                hsl(${currentHue}, ${currentSaturation}%, 0%) 0%, 
                hsl(${currentHue}, ${currentSaturation}%, 50%) 50%, 
                hsl(${currentHue}, ${currentSaturation}%, 100%) 100%)`;
            
            // Convert to RGB and HEX
            const rgb = hslToRgb(currentHue, currentSaturation, currentLightness);
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            
            rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            hexValue.textContent = hex;
        }

        // HSL to RGB conversion
        function hslToRgb(h, s, l) {
            h = h / 360;
            s = s / 100;
            l = l / 100;
            
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }

        // RGB to HEX conversion
        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        // Copy to clipboard function
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                copyNotification.classList.add('show');
                setTimeout(() => {
                    copyNotification.classList.remove('show');
                }, 2000);
            });
        }

        // Event listeners for sliders
        hueSlider.addEventListener('input', (e) => {
            currentHue = parseFloat(e.target.value);
            updateColor();
        });

        saturationSlider.addEventListener('input', (e) => {
            currentSaturation = parseFloat(e.target.value);
            updateColor();
        });

        lightnessSlider.addEventListener('input', (e) => {
            currentLightness = parseFloat(e.target.value);
            updateColor();
        });

        // Click to copy color values
        hslValue.addEventListener('click', () => copyToClipboard(hslValue.textContent));
        rgbValue.addEventListener('click', () => copyToClipboard(rgbValue.textContent));
        hexValue.addEventListener('click', () => copyToClipboard(hexValue.textContent));

        // Apply theme
        function applyTheme(theme) {
            document.body.setAttribute('data-theme', theme);
            currentTheme = theme;
            
            // Adjust guide boxes based on theme
            updateGuideBoxes();
            
            // Save theme preference
            localStorage.setItem('colorPickerTheme', theme);
        }
        
        // Update guide boxes based on current theme
        function updateGuideBoxes() {
            const guides = document.querySelectorAll('.guide-box');
            const colors = {
                hue: {
                    default: 'red',
                    ocean: '#0088cc',
                    sunset: '#ff7e00',
                    forest: '#2d6a4f',
                    cyberpunk: '#ff00ff',
                    dark: '#ff00ff'
                },
                sat: {
                    default: '#ff0000',
                    ocean: '#0088cc',
                    sunset: '#ff7e00',
                    forest: '#2d6a4f',
                    cyberpunk: '#ff00ff',
                    dark: '#ff00ff'
                }
            };
            
            // Update the hue guide
            guides[0].style.background = `linear-gradient(to right, gray, ${colors.hue[currentTheme] || 'red'})`;
            
            // Update the saturation guide
            guides[1].style.background = `linear-gradient(to right, #888, ${colors.sat[currentTheme] || '#ff0000'})`;
            
            // Update the lightness guide with current theme's primary color
            const computed = getComputedStyle(document.documentElement);
            const primaryColor = computed.getPropertyValue('--primary').trim() || '#007bff';
            guides[2].style.background = `linear-gradient(to right, black, ${primaryColor}, white)`;
        }
        
        // Theme selector event listener
        themeSelect.addEventListener('change', (e) => {
            applyTheme(e.target.value);
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('colorPickerTheme');
        if (savedTheme) {
            themeSelect.value = savedTheme;
            applyTheme(savedTheme);
        }
        
        // Layout adjustment based on Golden Ratio
        function adjustLayoutUsingGoldenRatio() {
            const container = document.querySelector('.color-picker-container');
            const goldenRatio = 1.618;
            
            // Calculate width based on viewport
            const viewportWidth = Math.min(window.innerWidth * 0.9, 800);
            container.style.width = `${viewportWidth}px`;
            
            // Set height based on golden ratio
            const height = viewportWidth / goldenRatio;
            container.style.minHeight = `${height}px`;
        }
        
        // Apply golden ratio on resize
        window.addEventListener('resize', adjustLayoutUsingGoldenRatio);
        adjustLayoutUsingGoldenRatio();
        
        // Initialize
        updateColor();
    </script>
</body>
</html> = Get-Content  -Raw

if (<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HSL Color Pick        /* Theme Selector */
        .theme-selector {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: var(--space-md);
            gap: var(--space-sm);
        }
        
        .theme-selector label {
            color: var(--text-secondary);
            font-weight: 600;
        }
        
        .theme-selector select {
            background-color: var(--surface);
            color: var(--text-primary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: var(--space-xs) var(--space-sm);
            font-size: var(--text-standard);
            cursor: pointer;
            transition: border-color 0.2s ease;
        }
        
        .theme-selector select:hover {
            border-color: var(--primary);
        }
        
        .theme-selector select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px var(--primary-light);
        }

        /* Color Display */
        .color-display {
            width: 100%;
            height: 200px;
            border-radius: 15px;
            margin-bottom: var(--space-lg);
            position: relative;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s ease;
            border: 1px solid var(--border);
        }    <style>
        /* Theme Variables based on Formula System */
        :root {
            /* Golden Ratio Foundation */
            --golden-ratio: 1.618;
            --inverse-golden-ratio: 0.618;
            
            /* Layout Dimensions */
            --header-height: 20vh;
            --nav-width: calc(100vw / (var(--golden-ratio) * 2.75)); /* ~22.4% */
            --content-padding: calc(1rem * var(--golden-ratio)); /* ~26px */
            --grid-gap: 1rem; /* 16px */
            
            /* Typography Scale */
            --text-tiny: 0.75rem;    /* 12px */
            --text-small: 0.813rem;  /* 13px */
            --text-standard: 0.875rem; /* 14px */
            --text-medium: 0.938rem; /* 15px */
            --text-large: 1rem;      /* 16px */
            --text-xl: 1.125rem;     /* 18px */
            
            /* Spacing Scale */
            --space-xs: 0.25rem;     /* 4px */
            --space-sm: 0.5rem;      /* 8px */
            --space-md: 1rem;        /* 16px */
            --space-lg: calc(1rem * var(--golden-ratio)); /* ~26px */
            --space-xl: calc(1rem * var(--golden-ratio) * var(--golden-ratio)); /* ~42px */
            
            /* Primary Colors - Default Theme */
            --primary: #007bff;
            --primary-light: #66b3ff;
            --primary-dark: #0056b3;
            --primary-contrast: #ffffff;
            
            /* Secondary Colors */
            --secondary: #6c757d;
            --secondary-light: #9ca3a9;
            --secondary-dark: #495057;
            --secondary-contrast: #ffffff;
            
            /* Accent Colors */
            --accent: #28a745;
            --accent-light: #71dd8a;
            --accent-dark: #1e7e34;
            --accent-contrast: #ffffff;
            
            /* Neutral Scale (9 Shades) */
            --neutral-50: #f8f9fa;   /* Lightest */
            --neutral-100: #e9ecef;
            --neutral-200: #dee2e6;
            --neutral-300: #ced4da;
            --neutral-400: #adb5bd;
            --neutral-500: #6c757d;  /* Middle */
            --neutral-600: #495057;
            --neutral-700: #343a40;
            --neutral-800: #212529;
            --neutral-900: #1a1d21;  /* Darkest */
            
            /* Semantic Colors */
            --background: var(--neutral-50);
            --surface: #ffffff;
            --text-primary: var(--neutral-800);
            --text-secondary: var(--neutral-600);
            --border: var(--neutral-300);
        }
        
        /* Theme: Ocean */
        [data-theme="ocean"] {
            --primary: #0088cc;
            --primary-light: #47b0eb;
            --primary-dark: #006699;
            --accent: #00ccaa;
            --accent-light: #47ebdc;
            --accent-dark: #009980;
            --background: #f0f7fc;
            --surface: #ffffff;
        }
        
        /* Theme: Sunset */
        [data-theme="sunset"] {
            --primary: #ff7e00;
            --primary-light: #ffac5e;
            --primary-dark: #cc6500;
            --accent: #e63946;
            --accent-light: #ff8a94;
            --accent-dark: #b52b35;
            --background: #fff5eb;
            --surface: #ffffff;
        }
        
        /* Theme: Forest */
        [data-theme="forest"] {
            --primary: #2d6a4f;
            --primary-light: #74c69d;
            --primary-dark: #1b4332;
            --accent: #e9c46a;
            --accent-light: #f4e3ac;
            --accent-dark: #d4a017;
            --background: #f2f9f6;
            --surface: #ffffff;
        }
        
        /* Theme: Cyberpunk */
        [data-theme="cyberpunk"] {
            --primary: #ff00ff;
            --primary-light: #ff99ff;
            --primary-dark: #cc00cc;
            --accent: #00ffff;
            --accent-light: #99ffff;
            --accent-dark: #00cccc;
            --background: #151520;
            --surface: #252535;
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
            --border: #554488;
        }
        
        /* Dark Theme */
        [data-theme="dark"] {
            --background: #121212;
            --surface: #1e1e1e;
            --text-primary: #f0f0f0;
            --text-secondary: #a0a0a0;
            --border: #404040;
            --neutral-50: #1e1e1e;
            --neutral-100: #2d2d2d;
            --neutral-200: #3a3a3a;
            --neutral-300: #4d4d4d;
            --neutral-400: #777777;
            --neutral-800: #e0e0e0;
            --neutral-900: #f5f5f5;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: var(--background);
            color: var(--text-primary);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .color-picker-container {
            background: var(--surface);
            padding: var(--space-lg);
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            width: 500px;
            max-width: 90vw;
        }

        h2 {
            margin: 0 0 var(--space-xl) 0;
            color: var(--text-primary);
            text-align: center;
            font-size: var(--text-xl);
        }

        /* Color Display */
        .color-display {
            width: 100%;
            height: 200px;
            border-radius: 15px;
            margin-bottom: var(--space-xl);
            position: relative;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s ease;
        }

        /* Slider Container */
        .slider-group {
            margin-bottom: var(--space-md);
        }

        .slider-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-secondary);
        }

        .slider-value {
            font-weight: normal;
            color: var(--text-secondary);
            font-size: var(--text-standard);
        }

        /* Base Slider Styles */
        .color-slider {
            width: 100%;
            height: 30px;
            -webkit-appearance: none;
            appearance: none;
            outline: none;
            cursor: pointer;
            border-radius: 15px;
            position: relative;
        }

        /* Slider Thumbs */
        .color-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 26px;
            height: 26px;
            background: var(--surface);
            cursor: pointer;
            border-radius: 50%;
            border: 3px solid var(--text-primary);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.1s ease;
        }

        .color-slider::-moz-range-thumb {
            width: 26px;
            height: 26px;
            background: var(--surface);
            cursor: pointer;
            border-radius: 50%;
            border: 3px solid var(--text-primary);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.1s ease;
        }

        .color-slider:hover::-webkit-slider-thumb {
            transform: scale(1.1);
        }

        .color-slider:hover::-moz-range-thumb {
            transform: scale(1.1);
        }

        /* Hue Slider */
        #hueSlider {
            background: linear-gradient(to right, 
                hsl(0, 100%, 50%) 0%, 
                hsl(30, 100%, 50%) 8.33%,
                hsl(60, 100%, 50%) 16.66%, 
                hsl(90, 100%, 50%) 25%,
                hsl(120, 100%, 50%) 33.33%,
                hsl(150, 100%, 50%) 41.66%,
                hsl(180, 100%, 50%) 50%, 
                hsl(210, 100%, 50%) 58.33%,
                hsl(240, 100%, 50%) 66.66%, 
                hsl(270, 100%, 50%) 75%,
                hsl(300, 100%, 50%) 83.33%, 
                hsl(330, 100%, 50%) 91.66%,
                hsl(360, 100%, 50%) 100%);
        }

        /* Saturation Slider - Dynamic background */
        #saturationSlider {
            background: linear-gradient(to right, 
                hsl(180, 0%, 50%), 
                hsl(180, 100%, 50%));
        }

        /* Lightness Slider - Dynamic background */
        #lightnessSlider {
            background: linear-gradient(to right, 
                hsl(180, 100%, 0%) 0%, 
                hsl(180, 100%, 50%) 50%, 
                hsl(180, 100%, 100%) 100%);
        }

        /* Color Values Display */
        .color-values {
            background: var(--neutral-100);
            border-radius: 10px;
            padding: var(--space-md);
            margin-top: var(--space-lg);
        }

        .color-value-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--neutral-300);
        }

        .color-value-row:last-child {
            border-bottom: none;
        }

        .color-value-label {
            font-weight: 600;
            color: var(--text-secondary);
            font-size: var(--text-standard);
        }

        .color-value-text {
            font-family: 'Courier New', monospace;
            font-size: var(--text-standard);
            color: var(--text-primary);
            background: var(--surface);
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .color-value-text:hover {
            background: var(--neutral-200);
        }

        /* Copy notification */
        .copy-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--text-primary);
            color: var(--primary-contrast);
            padding: 12px 20px;
            border-radius: 8px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            pointer-events: none;
        }

        .copy-notification.show {
            opacity: 1;
            transform: translateY(0);
        }

        /* Visual Guide */
        .visual-guide {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: var(--space-lg);
            padding-top: var(--space-lg);
            border-top: 1px solid var(--neutral-300);
        }

        .guide-item {
            text-align: center;
        }

        .guide-box {
            width: 100%;
            height: 60px;
            border-radius: 8px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--text-small);
            font-weight: 600;
            color: var(--primary-contrast);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .guide-label {
            font-size: var(--text-standard);
            color: var(--text-secondary);
        }
    </style>
</head>
<body>
    <div class="color-picker-container">
        <h2>HSL Color Picker</h2>
        
        <!-- Theme Selector -->
        <div class="theme-selector">
            <label for="theme-select">Theme:</label>
            <select id="theme-select">
                <option value="default">Default</option>
                <option value="ocean">Ocean</option>
                <option value="sunset">Sunset</option>
                <option value="forest">Forest</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="dark">Dark Mode</option>
            </select>
        </div>
        
        <!-- Color Display -->
        <div class="color-display" id="colorDisplay"></div>
        
        <!-- Hue Slider -->
        <div class="slider-group">
            <div class="slider-label">
                <span>Hue</span>
                <span class="slider-value"><span id="hueValue">180</span>°</span>
            </div>
            <input type="range" class="color-slider" id="hueSlider" min="0" max="360" value="180">
        </div>
        
        <!-- Saturation Slider -->
        <div class="slider-group">
            <div class="slider-label">
                <span>Saturation</span>
                <span class="slider-value"><span id="saturationValue">100</span>%</span>
            </div>
            <input type="range" class="color-slider" id="saturationSlider" min="0" max="100" value="100">
        </div>
        
        <!-- Lightness Slider -->
        <div class="slider-group">
            <div class="slider-label">
                <span>Lightness</span>
                <span class="slider-value"><span id="lightnessValue">50</span>%</span>
            </div>
            <input type="range" class="color-slider" id="lightnessSlider" min="0" max="100" value="50">
        </div>
        
        <!-- Color Values -->
        <div class="color-values">
            <div class="color-value-row">
                <span class="color-value-label">HSL:</span>
                <span class="color-value-text" id="hslValue">hsl(180, 100%, 50%)</span>
            </div>
            <div class="color-value-row">
                <span class="color-value-label">RGB:</span>
                <span class="color-value-text" id="rgbValue">rgb(0, 255, 255)</span>
            </div>
            <div class="color-value-row">
                <span class="color-value-label">HEX:</span>
                <span class="color-value-text" id="hexValue">#00ffff</span>
            </div>
        </div>
        
        <!-- Visual Guide -->
        <div class="visual-guide">
            <div class="guide-item">
                <div class="guide-box" style="background: linear-gradient(to right, gray, red);">HUE</div>
                <div class="guide-label">Changes the color</div>
            </div>
            <div class="guide-item">
                <div class="guide-box" style="background: linear-gradient(to right, #888, #ff0000);">SATURATION</div>
                <div class="guide-label">Gray to vivid</div>
            </div>
            <div class="guide-item">
                <div class="guide-box" style="background: linear-gradient(to right, black, red, white);">LIGHTNESS</div>
                <div class="guide-label">Dark to light</div>
            </div>
        </div>
    </div>
    
    <!-- Copy notification -->
    <div class="copy-notification" id="copyNotification">Copied to clipboard!</div>

    <script>
        // Get elements
        const colorDisplay = document.getElementById('colorDisplay');
        const hueSlider = document.getElementById('hueSlider');
        const saturationSlider = document.getElementById('saturationSlider');
        const lightnessSlider = document.getElementById('lightnessSlider');
        const hueValue = document.getElementById('hueValue');
        const saturationValue = document.getElementById('saturationValue');
        const lightnessValue = document.getElementById('lightnessValue');
        const hslValue = document.getElementById('hslValue');
        const rgbValue = document.getElementById('rgbValue');
        const hexValue = document.getElementById('hexValue');
        const copyNotification = document.getElementById('copyNotification');
        const themeSelect = document.getElementById('theme-select');

        let currentHue = 180;
        let currentSaturation = 100;
        let currentLightness = 50;
        let currentTheme = 'default';

        // Update color display
        function updateColor() {
            const hsl = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;
            
            // Update main display
            colorDisplay.style.backgroundColor = hsl;
            
            // Update value displays
            hueValue.textContent = Math.round(currentHue);
            saturationValue.textContent = Math.round(currentSaturation);
            lightnessValue.textContent = Math.round(currentLightness);
            hslValue.textContent = hsl;
            
            // Update saturation slider background
            saturationSlider.style.background = `linear-gradient(to right, 
                hsl(${currentHue}, 0%, ${currentLightness}%), 
                hsl(${currentHue}, 100%, ${currentLightness}%))`;
            
            // Update lightness slider background
            lightnessSlider.style.background = `linear-gradient(to right, 
                hsl(${currentHue}, ${currentSaturation}%, 0%) 0%, 
                hsl(${currentHue}, ${currentSaturation}%, 50%) 50%, 
                hsl(${currentHue}, ${currentSaturation}%, 100%) 100%)`;
            
            // Convert to RGB and HEX
            const rgb = hslToRgb(currentHue, currentSaturation, currentLightness);
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            
            rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            hexValue.textContent = hex;
        }

        // HSL to RGB conversion
        function hslToRgb(h, s, l) {
            h = h / 360;
            s = s / 100;
            l = l / 100;
            
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }

        // RGB to HEX conversion
        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        // Copy to clipboard function
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                copyNotification.classList.add('show');
                setTimeout(() => {
                    copyNotification.classList.remove('show');
                }, 2000);
            });
        }

        // Event listeners for sliders
        hueSlider.addEventListener('input', (e) => {
            currentHue = parseFloat(e.target.value);
            updateColor();
        });

        saturationSlider.addEventListener('input', (e) => {
            currentSaturation = parseFloat(e.target.value);
            updateColor();
        });

        lightnessSlider.addEventListener('input', (e) => {
            currentLightness = parseFloat(e.target.value);
            updateColor();
        });

        // Click to copy color values
        hslValue.addEventListener('click', () => copyToClipboard(hslValue.textContent));
        rgbValue.addEventListener('click', () => copyToClipboard(rgbValue.textContent));
        hexValue.addEventListener('click', () => copyToClipboard(hexValue.textContent));

        // Apply theme
        function applyTheme(theme) {
            document.body.setAttribute('data-theme', theme);
            currentTheme = theme;
            
            // Adjust guide boxes based on theme
            updateGuideBoxes();
            
            // Save theme preference
            localStorage.setItem('colorPickerTheme', theme);
        }
        
        // Update guide boxes based on current theme
        function updateGuideBoxes() {
            const guides = document.querySelectorAll('.guide-box');
            const colors = {
                hue: {
                    default: 'red',
                    ocean: '#0088cc',
                    sunset: '#ff7e00',
                    forest: '#2d6a4f',
                    cyberpunk: '#ff00ff',
                    dark: '#ff00ff'
                },
                sat: {
                    default: '#ff0000',
                    ocean: '#0088cc',
                    sunset: '#ff7e00',
                    forest: '#2d6a4f',
                    cyberpunk: '#ff00ff',
                    dark: '#ff00ff'
                }
            };
            
            // Update the hue guide
            guides[0].style.background = `linear-gradient(to right, gray, ${colors.hue[currentTheme] || 'red'})`;
            
            // Update the saturation guide
            guides[1].style.background = `linear-gradient(to right, #888, ${colors.sat[currentTheme] || '#ff0000'})`;
            
            // Update the lightness guide with current theme's primary color
            const computed = getComputedStyle(document.documentElement);
            const primaryColor = computed.getPropertyValue('--primary').trim() || '#007bff';
            guides[2].style.background = `linear-gradient(to right, black, ${primaryColor}, white)`;
        }
        
        // Theme selector event listener
        themeSelect.addEventListener('change', (e) => {
            applyTheme(e.target.value);
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('colorPickerTheme');
        if (savedTheme) {
            themeSelect.value = savedTheme;
            applyTheme(savedTheme);
        }
        
        // Layout adjustment based on Golden Ratio
        function adjustLayoutUsingGoldenRatio() {
            const container = document.querySelector('.color-picker-container');
            const goldenRatio = 1.618;
            
            // Calculate width based on viewport
            const viewportWidth = Math.min(window.innerWidth * 0.9, 800);
            container.style.width = `${viewportWidth}px`;
            
            // Set height based on golden ratio
            const height = viewportWidth / goldenRatio;
            container.style.minHeight = `${height}px`;
        }
        
        // Apply golden ratio on resize
        window.addEventListener('resize', adjustLayoutUsingGoldenRatio);
        adjustLayoutUsingGoldenRatio();
        
        // Initialize
        updateColor();
    </script>
</body>
</html> -match '<link rel="stylesheet" href="styles.css">') {
    Write-Host "✅ CSS file correctly linked" -ForegroundColor Green
} else {
    Write-Host "❌ CSS file not correctly linked" -ForegroundColor Red
}

if (<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HSL Color Pick        /* Theme Selector */
        .theme-selector {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: var(--space-md);
            gap: var(--space-sm);
        }
        
        .theme-selector label {
            color: var(--text-secondary);
            font-weight: 600;
        }
        
        .theme-selector select {
            background-color: var(--surface);
            color: var(--text-primary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: var(--space-xs) var(--space-sm);
            font-size: var(--text-standard);
            cursor: pointer;
            transition: border-color 0.2s ease;
        }
        
        .theme-selector select:hover {
            border-color: var(--primary);
        }
        
        .theme-selector select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px var(--primary-light);
        }

        /* Color Display */
        .color-display {
            width: 100%;
            height: 200px;
            border-radius: 15px;
            margin-bottom: var(--space-lg);
            position: relative;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s ease;
            border: 1px solid var(--border);
        }    <style>
        /* Theme Variables based on Formula System */
        :root {
            /* Golden Ratio Foundation */
            --golden-ratio: 1.618;
            --inverse-golden-ratio: 0.618;
            
            /* Layout Dimensions */
            --header-height: 20vh;
            --nav-width: calc(100vw / (var(--golden-ratio) * 2.75)); /* ~22.4% */
            --content-padding: calc(1rem * var(--golden-ratio)); /* ~26px */
            --grid-gap: 1rem; /* 16px */
            
            /* Typography Scale */
            --text-tiny: 0.75rem;    /* 12px */
            --text-small: 0.813rem;  /* 13px */
            --text-standard: 0.875rem; /* 14px */
            --text-medium: 0.938rem; /* 15px */
            --text-large: 1rem;      /* 16px */
            --text-xl: 1.125rem;     /* 18px */
            
            /* Spacing Scale */
            --space-xs: 0.25rem;     /* 4px */
            --space-sm: 0.5rem;      /* 8px */
            --space-md: 1rem;        /* 16px */
            --space-lg: calc(1rem * var(--golden-ratio)); /* ~26px */
            --space-xl: calc(1rem * var(--golden-ratio) * var(--golden-ratio)); /* ~42px */
            
            /* Primary Colors - Default Theme */
            --primary: #007bff;
            --primary-light: #66b3ff;
            --primary-dark: #0056b3;
            --primary-contrast: #ffffff;
            
            /* Secondary Colors */
            --secondary: #6c757d;
            --secondary-light: #9ca3a9;
            --secondary-dark: #495057;
            --secondary-contrast: #ffffff;
            
            /* Accent Colors */
            --accent: #28a745;
            --accent-light: #71dd8a;
            --accent-dark: #1e7e34;
            --accent-contrast: #ffffff;
            
            /* Neutral Scale (9 Shades) */
            --neutral-50: #f8f9fa;   /* Lightest */
            --neutral-100: #e9ecef;
            --neutral-200: #dee2e6;
            --neutral-300: #ced4da;
            --neutral-400: #adb5bd;
            --neutral-500: #6c757d;  /* Middle */
            --neutral-600: #495057;
            --neutral-700: #343a40;
            --neutral-800: #212529;
            --neutral-900: #1a1d21;  /* Darkest */
            
            /* Semantic Colors */
            --background: var(--neutral-50);
            --surface: #ffffff;
            --text-primary: var(--neutral-800);
            --text-secondary: var(--neutral-600);
            --border: var(--neutral-300);
        }
        
        /* Theme: Ocean */
        [data-theme="ocean"] {
            --primary: #0088cc;
            --primary-light: #47b0eb;
            --primary-dark: #006699;
            --accent: #00ccaa;
            --accent-light: #47ebdc;
            --accent-dark: #009980;
            --background: #f0f7fc;
            --surface: #ffffff;
        }
        
        /* Theme: Sunset */
        [data-theme="sunset"] {
            --primary: #ff7e00;
            --primary-light: #ffac5e;
            --primary-dark: #cc6500;
            --accent: #e63946;
            --accent-light: #ff8a94;
            --accent-dark: #b52b35;
            --background: #fff5eb;
            --surface: #ffffff;
        }
        
        /* Theme: Forest */
        [data-theme="forest"] {
            --primary: #2d6a4f;
            --primary-light: #74c69d;
            --primary-dark: #1b4332;
            --accent: #e9c46a;
            --accent-light: #f4e3ac;
            --accent-dark: #d4a017;
            --background: #f2f9f6;
            --surface: #ffffff;
        }
        
        /* Theme: Cyberpunk */
        [data-theme="cyberpunk"] {
            --primary: #ff00ff;
            --primary-light: #ff99ff;
            --primary-dark: #cc00cc;
            --accent: #00ffff;
            --accent-light: #99ffff;
            --accent-dark: #00cccc;
            --background: #151520;
            --surface: #252535;
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
            --border: #554488;
        }
        
        /* Dark Theme */
        [data-theme="dark"] {
            --background: #121212;
            --surface: #1e1e1e;
            --text-primary: #f0f0f0;
            --text-secondary: #a0a0a0;
            --border: #404040;
            --neutral-50: #1e1e1e;
            --neutral-100: #2d2d2d;
            --neutral-200: #3a3a3a;
            --neutral-300: #4d4d4d;
            --neutral-400: #777777;
            --neutral-800: #e0e0e0;
            --neutral-900: #f5f5f5;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: var(--background);
            color: var(--text-primary);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .color-picker-container {
            background: var(--surface);
            padding: var(--space-lg);
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            width: 500px;
            max-width: 90vw;
        }

        h2 {
            margin: 0 0 var(--space-xl) 0;
            color: var(--text-primary);
            text-align: center;
            font-size: var(--text-xl);
        }

        /* Color Display */
        .color-display {
            width: 100%;
            height: 200px;
            border-radius: 15px;
            margin-bottom: var(--space-xl);
            position: relative;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s ease;
        }

        /* Slider Container */
        .slider-group {
            margin-bottom: var(--space-md);
        }

        .slider-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-secondary);
        }

        .slider-value {
            font-weight: normal;
            color: var(--text-secondary);
            font-size: var(--text-standard);
        }

        /* Base Slider Styles */
        .color-slider {
            width: 100%;
            height: 30px;
            -webkit-appearance: none;
            appearance: none;
            outline: none;
            cursor: pointer;
            border-radius: 15px;
            position: relative;
        }

        /* Slider Thumbs */
        .color-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 26px;
            height: 26px;
            background: var(--surface);
            cursor: pointer;
            border-radius: 50%;
            border: 3px solid var(--text-primary);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.1s ease;
        }

        .color-slider::-moz-range-thumb {
            width: 26px;
            height: 26px;
            background: var(--surface);
            cursor: pointer;
            border-radius: 50%;
            border: 3px solid var(--text-primary);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.1s ease;
        }

        .color-slider:hover::-webkit-slider-thumb {
            transform: scale(1.1);
        }

        .color-slider:hover::-moz-range-thumb {
            transform: scale(1.1);
        }

        /* Hue Slider */
        #hueSlider {
            background: linear-gradient(to right, 
                hsl(0, 100%, 50%) 0%, 
                hsl(30, 100%, 50%) 8.33%,
                hsl(60, 100%, 50%) 16.66%, 
                hsl(90, 100%, 50%) 25%,
                hsl(120, 100%, 50%) 33.33%,
                hsl(150, 100%, 50%) 41.66%,
                hsl(180, 100%, 50%) 50%, 
                hsl(210, 100%, 50%) 58.33%,
                hsl(240, 100%, 50%) 66.66%, 
                hsl(270, 100%, 50%) 75%,
                hsl(300, 100%, 50%) 83.33%, 
                hsl(330, 100%, 50%) 91.66%,
                hsl(360, 100%, 50%) 100%);
        }

        /* Saturation Slider - Dynamic background */
        #saturationSlider {
            background: linear-gradient(to right, 
                hsl(180, 0%, 50%), 
                hsl(180, 100%, 50%));
        }

        /* Lightness Slider - Dynamic background */
        #lightnessSlider {
            background: linear-gradient(to right, 
                hsl(180, 100%, 0%) 0%, 
                hsl(180, 100%, 50%) 50%, 
                hsl(180, 100%, 100%) 100%);
        }

        /* Color Values Display */
        .color-values {
            background: var(--neutral-100);
            border-radius: 10px;
            padding: var(--space-md);
            margin-top: var(--space-lg);
        }

        .color-value-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--neutral-300);
        }

        .color-value-row:last-child {
            border-bottom: none;
        }

        .color-value-label {
            font-weight: 600;
            color: var(--text-secondary);
            font-size: var(--text-standard);
        }

        .color-value-text {
            font-family: 'Courier New', monospace;
            font-size: var(--text-standard);
            color: var(--text-primary);
            background: var(--surface);
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .color-value-text:hover {
            background: var(--neutral-200);
        }

        /* Copy notification */
        .copy-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--text-primary);
            color: var(--primary-contrast);
            padding: 12px 20px;
            border-radius: 8px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            pointer-events: none;
        }

        .copy-notification.show {
            opacity: 1;
            transform: translateY(0);
        }

        /* Visual Guide */
        .visual-guide {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: var(--space-lg);
            padding-top: var(--space-lg);
            border-top: 1px solid var(--neutral-300);
        }

        .guide-item {
            text-align: center;
        }

        .guide-box {
            width: 100%;
            height: 60px;
            border-radius: 8px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--text-small);
            font-weight: 600;
            color: var(--primary-contrast);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .guide-label {
            font-size: var(--text-standard);
            color: var(--text-secondary);
        }
    </style>
</head>
<body>
    <div class="color-picker-container">
        <h2>HSL Color Picker</h2>
        
        <!-- Theme Selector -->
        <div class="theme-selector">
            <label for="theme-select">Theme:</label>
            <select id="theme-select">
                <option value="default">Default</option>
                <option value="ocean">Ocean</option>
                <option value="sunset">Sunset</option>
                <option value="forest">Forest</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="dark">Dark Mode</option>
            </select>
        </div>
        
        <!-- Color Display -->
        <div class="color-display" id="colorDisplay"></div>
        
        <!-- Hue Slider -->
        <div class="slider-group">
            <div class="slider-label">
                <span>Hue</span>
                <span class="slider-value"><span id="hueValue">180</span>°</span>
            </div>
            <input type="range" class="color-slider" id="hueSlider" min="0" max="360" value="180">
        </div>
        
        <!-- Saturation Slider -->
        <div class="slider-group">
            <div class="slider-label">
                <span>Saturation</span>
                <span class="slider-value"><span id="saturationValue">100</span>%</span>
            </div>
            <input type="range" class="color-slider" id="saturationSlider" min="0" max="100" value="100">
        </div>
        
        <!-- Lightness Slider -->
        <div class="slider-group">
            <div class="slider-label">
                <span>Lightness</span>
                <span class="slider-value"><span id="lightnessValue">50</span>%</span>
            </div>
            <input type="range" class="color-slider" id="lightnessSlider" min="0" max="100" value="50">
        </div>
        
        <!-- Color Values -->
        <div class="color-values">
            <div class="color-value-row">
                <span class="color-value-label">HSL:</span>
                <span class="color-value-text" id="hslValue">hsl(180, 100%, 50%)</span>
            </div>
            <div class="color-value-row">
                <span class="color-value-label">RGB:</span>
                <span class="color-value-text" id="rgbValue">rgb(0, 255, 255)</span>
            </div>
            <div class="color-value-row">
                <span class="color-value-label">HEX:</span>
                <span class="color-value-text" id="hexValue">#00ffff</span>
            </div>
        </div>
        
        <!-- Visual Guide -->
        <div class="visual-guide">
            <div class="guide-item">
                <div class="guide-box" style="background: linear-gradient(to right, gray, red);">HUE</div>
                <div class="guide-label">Changes the color</div>
            </div>
            <div class="guide-item">
                <div class="guide-box" style="background: linear-gradient(to right, #888, #ff0000);">SATURATION</div>
                <div class="guide-label">Gray to vivid</div>
            </div>
            <div class="guide-item">
                <div class="guide-box" style="background: linear-gradient(to right, black, red, white);">LIGHTNESS</div>
                <div class="guide-label">Dark to light</div>
            </div>
        </div>
    </div>
    
    <!-- Copy notification -->
    <div class="copy-notification" id="copyNotification">Copied to clipboard!</div>

    <script>
        // Get elements
        const colorDisplay = document.getElementById('colorDisplay');
        const hueSlider = document.getElementById('hueSlider');
        const saturationSlider = document.getElementById('saturationSlider');
        const lightnessSlider = document.getElementById('lightnessSlider');
        const hueValue = document.getElementById('hueValue');
        const saturationValue = document.getElementById('saturationValue');
        const lightnessValue = document.getElementById('lightnessValue');
        const hslValue = document.getElementById('hslValue');
        const rgbValue = document.getElementById('rgbValue');
        const hexValue = document.getElementById('hexValue');
        const copyNotification = document.getElementById('copyNotification');
        const themeSelect = document.getElementById('theme-select');

        let currentHue = 180;
        let currentSaturation = 100;
        let currentLightness = 50;
        let currentTheme = 'default';

        // Update color display
        function updateColor() {
            const hsl = `hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`;
            
            // Update main display
            colorDisplay.style.backgroundColor = hsl;
            
            // Update value displays
            hueValue.textContent = Math.round(currentHue);
            saturationValue.textContent = Math.round(currentSaturation);
            lightnessValue.textContent = Math.round(currentLightness);
            hslValue.textContent = hsl;
            
            // Update saturation slider background
            saturationSlider.style.background = `linear-gradient(to right, 
                hsl(${currentHue}, 0%, ${currentLightness}%), 
                hsl(${currentHue}, 100%, ${currentLightness}%))`;
            
            // Update lightness slider background
            lightnessSlider.style.background = `linear-gradient(to right, 
                hsl(${currentHue}, ${currentSaturation}%, 0%) 0%, 
                hsl(${currentHue}, ${currentSaturation}%, 50%) 50%, 
                hsl(${currentHue}, ${currentSaturation}%, 100%) 100%)`;
            
            // Convert to RGB and HEX
            const rgb = hslToRgb(currentHue, currentSaturation, currentLightness);
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            
            rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            hexValue.textContent = hex;
        }

        // HSL to RGB conversion
        function hslToRgb(h, s, l) {
            h = h / 360;
            s = s / 100;
            l = l / 100;
            
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }

        // RGB to HEX conversion
        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        // Copy to clipboard function
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                copyNotification.classList.add('show');
                setTimeout(() => {
                    copyNotification.classList.remove('show');
                }, 2000);
            });
        }

        // Event listeners for sliders
        hueSlider.addEventListener('input', (e) => {
            currentHue = parseFloat(e.target.value);
            updateColor();
        });

        saturationSlider.addEventListener('input', (e) => {
            currentSaturation = parseFloat(e.target.value);
            updateColor();
        });

        lightnessSlider.addEventListener('input', (e) => {
            currentLightness = parseFloat(e.target.value);
            updateColor();
        });

        // Click to copy color values
        hslValue.addEventListener('click', () => copyToClipboard(hslValue.textContent));
        rgbValue.addEventListener('click', () => copyToClipboard(rgbValue.textContent));
        hexValue.addEventListener('click', () => copyToClipboard(hexValue.textContent));

        // Apply theme
        function applyTheme(theme) {
            document.body.setAttribute('data-theme', theme);
            currentTheme = theme;
            
            // Adjust guide boxes based on theme
            updateGuideBoxes();
            
            // Save theme preference
            localStorage.setItem('colorPickerTheme', theme);
        }
        
        // Update guide boxes based on current theme
        function updateGuideBoxes() {
            const guides = document.querySelectorAll('.guide-box');
            const colors = {
                hue: {
                    default: 'red',
                    ocean: '#0088cc',
                    sunset: '#ff7e00',
                    forest: '#2d6a4f',
                    cyberpunk: '#ff00ff',
                    dark: '#ff00ff'
                },
                sat: {
                    default: '#ff0000',
                    ocean: '#0088cc',
                    sunset: '#ff7e00',
                    forest: '#2d6a4f',
                    cyberpunk: '#ff00ff',
                    dark: '#ff00ff'
                }
            };
            
            // Update the hue guide
            guides[0].style.background = `linear-gradient(to right, gray, ${colors.hue[currentTheme] || 'red'})`;
            
            // Update the saturation guide
            guides[1].style.background = `linear-gradient(to right, #888, ${colors.sat[currentTheme] || '#ff0000'})`;
            
            // Update the lightness guide with current theme's primary color
            const computed = getComputedStyle(document.documentElement);
            const primaryColor = computed.getPropertyValue('--primary').trim() || '#007bff';
            guides[2].style.background = `linear-gradient(to right, black, ${primaryColor}, white)`;
        }
        
        // Theme selector event listener
        themeSelect.addEventListener('change', (e) => {
            applyTheme(e.target.value);
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('colorPickerTheme');
        if (savedTheme) {
            themeSelect.value = savedTheme;
            applyTheme(savedTheme);
        }
        
        // Layout adjustment based on Golden Ratio
        function adjustLayoutUsingGoldenRatio() {
            const container = document.querySelector('.color-picker-container');
            const goldenRatio = 1.618;
            
            // Calculate width based on viewport
            const viewportWidth = Math.min(window.innerWidth * 0.9, 800);
            container.style.width = `${viewportWidth}px`;
            
            // Set height based on golden ratio
            const height = viewportWidth / goldenRatio;
            container.style.minHeight = `${height}px`;
        }
        
        // Apply golden ratio on resize
        window.addEventListener('resize', adjustLayoutUsingGoldenRatio);
        adjustLayoutUsingGoldenRatio();
        
        // Initialize
        updateColor();
    </script>
</body>
</html> -match '<script src="script.js"></script>') {
    Write-Host "✅ JavaScript file correctly linked" -ForegroundColor Green
} else {
    Write-Host "❌ JavaScript file not correctly linked" -ForegroundColor Red
}

Write-Host "
✨ Verification Test Complete!" -ForegroundColor Cyan
