// Extracted from favicon-generator.html
function generateFavicon() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // Clear canvas
    ctx.clearRect(0, 0, 32, 32);
    // Create blue star
    ctx.fillStyle = '#4A90E2';
    ctx.strokeStyle = '#1A5BB8';
    ctx.lineWidth = 1;
    // Star path
    ctx.beginPath();
    const centerX = 16;
    const centerY = 16;
    const outerRadius = 12;
    const innerRadius = 6;
    const spikes = 5;
    for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + Math.cos(angle - Math.PI / 2) * radius;
        const y = centerY + Math.sin(angle - Math.PI / 2) * radius;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Convert to blob and create download link
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const download = document.getElementById('download');
        download.href = url;
        download.download = 'favicon.ico';
        download.style.display = 'inline';
        download.textContent = 'Download Blue Star Favicon';
        console.log('Blue star favicon generated!');
    }, 'image/x-icon');
}
