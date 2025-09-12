// Test file to check if JavaScript events are working
console.log('Test events file loaded');

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - testing elements...');
    
    // Test element access
    const editBtn = document.getElementById('editModeBtn');
    const saveBtn = document.getElementById('saveBtn');
    const layoutSelect = document.getElementById('layoutSelect');
    const themeSelect = document.getElementById('themeSelect');
    const colorExplorer = document.getElementById('colorExplorer');
    
    console.log('Elements found:');
    console.log('- Edit button:', !!editBtn);
    console.log('- Save button:', !!saveBtn);
    console.log('- Layout select:', !!layoutSelect);
    console.log('- Theme select:', !!themeSelect);
    console.log('- Color explorer:', !!colorExplorer);
    
    // Add test event handlers
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            console.log('Edit button clicked!');
            this.textContent = this.textContent === 'Edit Mode' ? 'View Mode' : 'Edit Mode';
            
            const content = document.querySelector('.editable-content');
            if (content) {
                const isEditing = content.contentEditable === 'true';
                content.contentEditable = !isEditing;
                document.body.classList.toggle('edit-mode', !isEditing);
            }
        });
        console.log('Edit button event handler added');
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            console.log('Save button clicked!');
            alert('Website saved! (This is just a test)');
        });
        console.log('Save button event handler added');
    }
    
    if (layoutSelect) {
        layoutSelect.addEventListener('change', function() {
            console.log('Layout changed to:', this.value);
            const previewArea = document.getElementById('previewArea');
            if (previewArea) {
                previewArea.className = 'preview-area layout-' + this.value;
            }
        });
        console.log('Layout select event handler added');
    }
    
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            console.log('Theme changed to:', this.value);
            document.body.className = 'theme-' + this.value;
        });
        console.log('Theme select event handler added');
    }
    
    // Create color swatches for color explorer
    if (colorExplorer) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FFEAA7', '#DDA0DD', '#F8BBD9', '#A8E6CF',
            '#FFB6C1', '#87CEEB', '#DEB887', '#F0E68C'
        ];
        
        colorExplorer.innerHTML = '';
        colorExplorer.style.display = 'grid';
        colorExplorer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        colorExplorer.style.gap = '8px';
        colorExplorer.style.marginTop = '10px';
        
        colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.style.width = '40px';
            swatch.style.height = '40px';
            swatch.style.backgroundColor = color;
            swatch.style.borderRadius = '6px';
            swatch.style.cursor = 'pointer';
            swatch.style.border = '2px solid transparent';
            swatch.style.transition = 'all 0.3s ease';
            swatch.title = color;
            
            swatch.addEventListener('click', function() {
                console.log('Color selected:', color);
                
                // Remove previous selection
                colorExplorer.querySelectorAll('div').forEach(s => {
                    s.style.borderColor = 'transparent';
                });
                
                // Highlight selected color
                this.style.borderColor = '#fff';
                
                // Apply color to content
                const content = document.querySelector('.editable-content');
                if (content) {
                    content.style.backgroundColor = color + '20'; // 20% opacity
                }
                
                alert('Color applied: ' + color);
            });
            
            swatch.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.borderColor = '#fff';
            });
            
            swatch.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                if (this.style.borderColor === 'rgb(255, 255, 255)') {
                    // Keep border if this is the selected color
                } else {
                    this.style.borderColor = 'transparent';
                }
            });
            
            colorExplorer.appendChild(swatch);
        });
        
        console.log('Color explorer populated with', colors.length, 'colors');
    }
    
    console.log('All event handlers initialized successfully!');
});