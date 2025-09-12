const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist folder (production build)
app.use(express.static(path.join(__dirname, 'dist')));

// Serve wb folder files from dist/wb
app.use('/wb', express.static(path.join(__dirname, 'dist/wb')));

// Main route - serve the built wb.html from dist folder
app.get('/', (req, res) => {
    const htmlFile = path.join(__dirname, 'dist/wb/wb.html');
    
    if (fs.existsSync(htmlFile)) {
        res.sendFile(htmlFile);
    } else {
        res.status(404).send('Built files not found. Please run the build process first.');
    }
});

// Fallback route for wb.html
app.get('/wb.html', (req, res) => {
    const htmlFile = path.join(__dirname, 'dist/wb/wb.html');
    
    if (fs.existsSync(htmlFile)) {
        res.sendFile(htmlFile);
    } else {
        res.status(404).send('Built wb.html not found in dist folder.');
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server running and serving from dist folder',
        dist_exists: fs.existsSync(path.join(__dirname, 'dist/wb/wb.html'))
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving from: ${path.join(__dirname, 'dist')}`);
    console.log(`📄 Main file: ${path.join(__dirname, 'dist/wb/wb.html')}`);
    
    // Check if build files exist
    const htmlExists = fs.existsSync(path.join(__dirname, 'dist/wb/wb.html'));
    const jsExists = fs.existsSync(path.join(__dirname, 'dist/wb/wb.min.js'));
    const cssExists = fs.existsSync(path.join(__dirname, 'dist/wb/wb.css'));
    
    console.log(`✅ Build status:`);
    console.log(`   📄 wb.html: ${htmlExists ? 'Found' : 'Missing'}`);
    console.log(`   📜 wb.min.js: ${jsExists ? 'Found' : 'Missing'}`);
    console.log(`   🎨 wb.css: ${cssExists ? 'Found' : 'Missing'}`);
});