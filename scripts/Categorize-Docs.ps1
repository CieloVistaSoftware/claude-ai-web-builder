# Categorize-Docs.ps1
param(
    [string]$DocsRoot = ".\docs",
    [string]$MappingFile = ".\docs\docs-mapping.csv"
)

# Load mapping from CSV if available: filename,category
$mapping = @{
    'auto-loader.md' = 'architecture'
    'js-vs-ts-decision.md' = 'architecture'
    'localstorage.md' = 'archictests'
    'save.md' = 'architecture'
    'converter.md' = 'architecture'
}
if (Test-Path $MappingFile) {
    Import-Csv $MappingFile | ForEach-Object {
        $mapping[$_.filename] = $_.category
    }
}


# List of known categories (folder names)
$categories = @(
    "architecture", "build", "component-guides", "configuration", "design",
    "migration", "events-logging", "status-issues", "misc", "howto", "reference", "todo", "archive", "claude", "archictests", "troubleshooting"
)

# Additional keyword-to-category mapping (exact or substring match)
$keywordMap = @{
    'claude'         = 'claude'
    'code'           = 'reference'
    'color'          = 'design'
    'component'      = 'component-guides'
    'components'     = 'component-guides'
    'config'         = 'configuration'
    'configuraiton'  = 'configuration'
    'plan'           = 'misc'
    'summary'        = 'misc'
    'filestructure'  = 'architecture'
    'file'           = 'architecture'
    'event'          = 'events-logging'
    'fixes'          = 'misc'
    'layout'         = 'design'
    'websocket'      = 'api-specs'
    'proposed'       = 'misc'
    'guide'          = 'howto'
    'mcp'            = 'api-specs'
    'consolidation'  = 'misc'
    'reorganization' = 'misc'
    'wb'             = 'misc'
    'testing'        = 'component-guides'
}

# Special rules for prefix/substring matches
function Get-SpecialCategory($fileName) {
    if ($fileName -match '(?i)^architecture') { return 'architecture' }
    if ($fileName -match '(?i)^build') { return 'build' }
    if ($fileName -match '(?i)^color') { return 'design' }
    if ($fileName -match '(?i)^component') { return 'component-guides' }
    if ($fileName -match '(?i)^config') { return 'configuration' }
    if ($fileName -match '(?i)^incomplete') { return 'todo' }
    if ($fileName -match '(?i)^status') { return 'todo' }
    if ($fileName -match '(?i)^current') { return 'todo' }
    if ($fileName -match '(?i)^issues') { return 'todo' }
    if ($fileName -match '(?i)descision') { return 'status-issues' }
    if ($fileName -match '(?i)^convert') { return 'architecture' }
    if ($fileName -match '(?i)converter') { return 'architecture' }
    if ($fileName -match '(?i)questions') { return 'claude' }
    if ($fileName -match '(?i)^removed') { return 'archive' }
    if ($fileName -match '(?i)proposal') { return 'todo' }
    if ($fileName -match '(?i)^refactoring') { return 'troubleshooting' }
    if ($fileName -match '(?i)^save') { return 'architecture' }
    return $null
}

foreach ($file in Get-ChildItem -Path $DocsRoot -File -Filter *.md) {
    $targetFolder = $null
    if ($mapping.ContainsKey($file.Name)) {
        $targetFolder = $mapping[$file.Name]
    } else {
        # Special prefix/substring rules
        $specialCat = Get-SpecialCategory $file.Name
        if ($specialCat) {
            $targetFolder = $specialCat
        } else {
            # Try to infer category from filename (category folder names)
            foreach ($cat in $categories) {
                if ($file.Name -like "*$cat*") {
                    $targetFolder = $cat
                    break
                }
            }
            # If still not found, try additional keyword matches
            if (-not $targetFolder) {
                foreach ($keyword in $keywordMap.Keys) {
                    if ($file.Name -match $keyword) {
                        $targetFolder = $keywordMap[$keyword]
                        break
                    }
                }
            }
        }
    }
    if ($targetFolder) {
        $destDir = Join-Path $DocsRoot $targetFolder
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir | Out-Null
        }
        $destPath = Join-Path $destDir $file.Name
        try {
            Move-Item -Path $file.FullName -Destination $destPath -ErrorAction Stop
            Write-Host "Moved $($file.Name) to $targetFolder"
        } catch {
            if ($_.Exception.Message -notmatch 'already exists') {
                Write-Host "Error moving $($file.Name): $($_.Exception.Message)"
            }
            # Silently ignore 'already exists' errors
        }
    } else {
        Write-Host "No mapping or match for $($file.Name), skipping."
    }
}
