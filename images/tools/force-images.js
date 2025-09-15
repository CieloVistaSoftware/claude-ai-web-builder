// Add this to browser console to force images to display
function forceShowImages() {
    console.log('🚨 FORCING IMAGE DISPLAY');
    
    const grid = document.getElementById('imageGrid');
    if (!grid) {
        console.log('❌ Image grid not found');
        return;
    }
    
    grid.innerHTML = ''; // Clear existing content
    
    // Create working test images
    const testImages = [
        { name: 'Test Blue', url: 'https://via.placeholder.com/300x200/4299e1/ffffff?text=Test+Blue' },
        { name: 'Test Green', url: 'https://via.placeholder.com/300x200/38a169/ffffff?text=Test+Green' },
        { name: 'Test Purple', url: 'https://via.placeholder.com/300x200/805ad5/ffffff?text=Test+Purple' },
        { name: 'Test Red', url: 'https://via.placeholder.com/300x200/e53e3e/ffffff?text=Test+Red' },
        { name: 'Test Orange', url: 'https://via.placeholder.com/300x200/d69e2e/ffffff?text=Test+Orange' },
        { name: 'Random Photo 1', url: 'https://picsum.photos/300/200?random=1' },
        { name: 'Random Photo 2', url: 'https://picsum.photos/300/200?random=2' },
        { name: 'Random Photo 3', url: 'https://picsum.photos/300/200?random=3' },
        { name: 'Random Photo 4', url: 'https://picsum.photos/300/200?random=4' },
        { name: 'Random Photo 5', url: 'https://picsum.photos/300/200?random=5' }
    ];
    
    testImages.forEach((imageData, index) => {
        console.log(`Creating card ${index + 1}: ${imageData.name}`);
        
        const cardDiv = document.createElement('div');
        cardDiv.className = 'image-card';
        cardDiv.style.animation = 'fadeIn 0.5s ease-in';
        
        cardDiv.innerHTML = `
            <div class="image-container">
                <div class="image-loading">⚡ Loading ${imageData.name}...</div>
                <img style="display:none;" alt="${imageData.name}">
                <div class="image-error" style="display:none;">
                    <span>📷</span>
                    <p>Failed to load</p>
                </div>
            </div>
            <div class="image-info">
                <div class="image-name">${imageData.name}</div>
                <p style="font-size: 0.8rem; color: #a0aec0; word-break: break-all;">${imageData.url}</p>
                <div class="image-actions">
                    <button onclick="navigator.clipboard.writeText('${imageData.url}')" class="copy-btn">📋 Copy URL</button>
                </div>
            </div>
        `;
        
        const img = cardDiv.querySelector('img');
        const loadingDiv = cardDiv.querySelector('.image-loading');
        const errorDiv = cardDiv.querySelector('.image-error');
        
        img.onload = () => {
            console.log(`✅ Loaded: ${imageData.name}`);
            loadingDiv.style.display = 'none';
            img.style.display = 'block';
        };
        
        img.onerror = () => {
            console.log(`❌ Failed: ${imageData.name}`);
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'block';
        };
        
        img.src = imageData.url;
        grid.appendChild(cardDiv);
    });
    
    // Update stats
    const statusElement = document.getElementById('totalImages');
    if (statusElement) {
        statusElement.textContent = `${testImages.length} test images forced`;
    }
    
    const visibleElement = document.getElementById('visibleImages');
    if (visibleElement) {
        visibleElement.textContent = `${testImages.length} visible`;
    }
    
    console.log(`🎉 Created ${testImages.length} test image cards`);
}

// Auto-execute after a delay
setTimeout(() => {
    console.log('🚨 AUTO-FORCING IMAGE DISPLAY IN 3 SECONDS...');
    setTimeout(forceShowImages, 3000);
}, 1000);

console.log('📋 COPY AND PASTE THIS IN BROWSER CONSOLE:');
console.log('forceShowImages()');