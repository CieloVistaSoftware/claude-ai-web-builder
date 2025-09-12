// Fixed Import Website Functionality - wb-import-simple.js
// Properly handles folder selection and finds index.html

console.log('🚀 Import functionality loaded');

// Show status messages
function showMsg(msg, type = 'info') {
    const statusDiv = document.getElementById('importStatus');
    if (!statusDiv) {
        console.log(msg);
        return;
    }
    
    statusDiv.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'}`;
    statusDiv.innerHTML = msg;
    statusDiv.style.display = 'block';
    
    console.log(`[${type.toUpperCase()}] ${msg}`);
}

// Find index.html in the selected files
function findIndexFile(files) {
    console.log('🔍 Looking for index.html in', files.length, 'files');
    
    // Look for index.html (case insensitive)
    const indexFile = files.find(file => 
        file.name.toLowerCase() === 'index.html'
    );
    
    if (indexFile) {
        console.log('✅ Found index.html:', indexFile.name);
        return indexFile;
    }
    
    // List all HTML files if index.html not found
    const htmlFiles = files.filter(file => 
        file.name.toLowerCase().endsWith('.html')
    );
    
    console.log('📄 HTML files found:', htmlFiles.map(f => f.name));
    
    if (htmlFiles.length > 0) {
        console.log('⚠️ Using first HTML file as fallback:', htmlFiles[0].name);
        return htmlFiles[0];
    }
    
    return null;
}

// Load the website in a new window
function loadSite() {
    const indexFile = window.selectedIndexFile;
    const allFiles = window.selectedFiles;
    
    if (!indexFile) {
        showMsg('❌ No index file available to load', 'error');
        return;
    }
    
    showMsg('🌐 Loading website in new window...', 'info');
    
    try {
        // Create blob URL for the index file
        const blob = new Blob([indexFile], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        console.log('📱 Opening website at:', url);
        
        // Open in new window
        const newWindow = window.open(url, '_blank', 'width=1200,height=800');
        
        if (newWindow) {
            showMsg('✅ Website opened in new window!', 'success');
            
            // Clean up the URL after a delay
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 5000);
            
            // TODO: Inject control panel after website loads
            setTimeout(() => {
                try {
                    injectControlPanel(newWindow, allFiles);
                } catch (e) {
                    console.log('⚠️ Could not inject control panel:', e.message);
                }
            }, 2000);
            
        } else {
            showMsg('❌ Failed to open new window (popup blocked?)', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error loading website:', error);
        showMsg(`❌ Error loading website: ${error.message}`, 'error');
    }
}

// Inject control panel into the loaded website
function injectControlPanel(targetWindow, files) {
    if (!targetWindow || targetWindow.closed) {
        console.log('⚠️ Target window not available for control panel injection');
        return;
    }
    
    try {
        const doc = targetWindow.document;
        
        // Find CSS files to read colors
        const cssFiles = files.filter(file => 
            file.name.toLowerCase().endsWith('.css')
        );
        
        console.log('🎨 Found CSS files:', cssFiles.map(f => f.name));
        
        // Create control panel HTML
        const controlPanelHTML = `
            <div id="wb-control-panel" style="
                position: fixed;
                top: 10px;
                right: 10px;
                width: 300px;
                background: white;
                border: 2px solid #007bff;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 9999;
                font-family: Arial, sans-serif;
                font-size: 14px;
            ">
                <h5 style="margin: 0 0 10px 0; color: #007bff;">🎨 Website Builder Control Panel</h5>
                <div id="wb-color-controls">
                    <p>Colors detected from CSS files:</p>
                    <div id="wb-color-list">Scanning CSS files...</div>
                </div>
                <button onclick="this.parentElement.style.display='none'" style="
                    position: absolute;
                    top: 5px;
                    right: 8px;
                    border: none;
                    background: none;
                    font-size: 18px;
                    cursor: pointer;
                ">×</button>
            </div>
        `;
        
        // Inject control panel
        doc.body.insertAdjacentHTML('beforeend', controlPanelHTML);
        
        // Read CSS files and extract colors
        readCSSColors(cssFiles, targetWindow);
        
        console.log('✅ Control panel injected successfully');
        
    } catch (error) {
        console.error('❌ Error injecting control panel:', error);
    }
}

// Read CSS files and extract color information
function readCSSColors(cssFiles, targetWindow) {
    const colorList = targetWindow.document.getElementById('wb-color-list');
    if (!colorList) return;
    
    colorList.innerHTML = 'Reading CSS files...';
    
    let allColors = [];
    let filesProcessed = 0;
    
    if (cssFiles.length === 0) {
        colorList.innerHTML = 'No CSS files found';
        return;
    }
    
    cssFiles.forEach(cssFile => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const cssContent = e.target.result;
            const colors = extractColorsFromCSS(cssContent);
            allColors = allColors.concat(colors);
            
            filesProcessed++;
            
            if (filesProcessed === cssFiles.length) {
                displayColors(allColors, colorList);
            }
        };
        
        reader.readAsText(cssFile);
    });
}

// Extract colors from CSS content
function extractColorsFromCSS(cssContent) {
    const colors = [];
    
    // Regular expressions for different color formats
    const patterns = [
        /#[0-9a-fA-F]{3,6}/g,           // Hex colors
        /rgb\([^)]+\)/g,                // RGB colors
        /rgba\([^)]+\)/g,               // RGBA colors
        /hsl\([^)]+\)/g,                // HSL colors
        /hsla\([^)]+\)/g                // HSLA colors
    ];
    
    patterns.forEach(pattern => {
        const matches = cssContent.match(pattern);
        if (matches) {
            colors.push(...matches);
        }
    });
    
    // Remove duplicates
    return [...new Set(colors)];
}

// Display extracted colors in the control panel
function displayColors(colors, container) {
    if (colors.length === 0) {
        container.innerHTML = 'No colors found in CSS files';
        return;
    }
    
    const uniqueColors = [...new Set(colors)];
    
    const colorHTML = uniqueColors.map(color => `
        <div style="
            display: flex;
            align-items: center;
            margin: 5px 0;
            padding: 3px;
            border-radius: 3px;
            background: #f8f9fa;
        ">
            <div style="
                width: 20px;
                height: 20px;
                background: ${color};
                border: 1px solid #ccc;
                margin-right: 8px;
                border-radius: 3px;
            "></div>
            <span style="font-family: monospace; font-size: 12px;">${color}</span>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div style="max-height: 200px; overflow-y: auto;">
            ${colorHTML}
        </div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
            Found ${uniqueColors.length} unique colors
        </p>
    `;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Setting up import functionality');
    
    // Get the import button
    const importBtn = document.getElementById('importBtn');
    if (!importBtn) {
        console.error('❌ Import button not found');
        return;
    }
    
    // Create hidden file input for folder selection
    const folderInput = document.createElement('input');
    folderInput.type = 'file';
    folderInput.webkitdirectory = true;
    folderInput.multiple = true;
    folderInput.style.display = 'none';
    document.body.appendChild(folderInput);
    
    // Create file info display area
    const fileInfo = document.createElement('div');
    fileInfo.id = 'fileInfo';
    fileInfo.className = 'alert alert-primary mt-3';
    fileInfo.style.display = 'none';
    importBtn.parentElement.appendChild(fileInfo);
    
    // Handle import button click
    importBtn.addEventListener('click', function() {
        console.log('📁 Import button clicked');
        showMsg('📂 Please select a website folder...', 'info');
        folderInput.click();
    });
    
    // Handle folder selection
    folderInput.addEventListener('change', function(e) {
        showMsg('📁 Scanning folder...', 'info');
        
        const files = Array.from(e.target.files);
        console.log('📁 Files selected:', files.length);
        
        if (files.length === 0) {
            showMsg('❌ No files found in selected folder', 'error');
            return;
        }
        
        // List all files for debugging
        console.log('📄 All files:', files.map(f => f.name).sort());
        
        // Look for index.html specifically
        const indexFile = findIndexFile(files);
        
        if (indexFile) {
            showMsg(`✅ Found: ${indexFile.name}`, 'success');
            console.log('📄 Index file found:', indexFile);
            
            // Show file details
            fileInfo.innerHTML = `
                <strong>📁 Website Found:</strong><br>
                📄 File: ${indexFile.name}<br>
                📁 Path: ${indexFile.webkitRelativePath || 'root'}<br>
                📏 Size: ${(indexFile.size / 1024).toFixed(1)} KB<br>
                📊 Total files: ${files.length}<br>
                <button onclick="loadSite()" class="btn btn-primary mt-2">🌐 Load Website</button>
            `;
            fileInfo.style.display = 'block';
            
            // Store the files globally for access
            window.selectedIndexFile = indexFile;
            window.selectedFiles = files;
            
        } else {
            showMsg('❌ No index.html found in selected folder', 'error');
            console.log('📄 Available HTML files:', files.filter(f => f.name.endsWith('.html')).map(f => f.name));
            
            // Show what files were found
            const htmlFiles = files.filter(f => f.name.toLowerCase().endsWith('.html'));
            if (htmlFiles.length > 0) {
                fileInfo.innerHTML = `
                    <strong>⚠️ No index.html found, but found these HTML files:</strong><br>
                    ${htmlFiles.map(f => `📄 ${f.name}`).join('<br>')}
                    <br><br>
                    <small>Rename one of these to index.html or select a different folder.</small>
                `;
                fileInfo.style.display = 'block';
            }
        }
    });
    
    console.log('✅ Import functionality ready');
});

// Make functions globally available
window.loadSite = loadSite;
window.showMsg = showMsg;