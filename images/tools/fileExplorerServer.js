const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

const app = express();
const PORT = 3001;

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

// Get list of drives (Windows)
app.get('/api/drives', async (req, res) => {
    try {
        if (process.platform === 'win32') {
            const drives = [];
            for (let i = 65; i <= 90; i++) {
                const drive = String.fromCharCode(i) + ':\\';
                try {
                    await fs.access(drive);
                    const stats = await fs.stat(drive);
                    drives.push({
                        path: drive,
                        name: drive,
                        type: 'drive'
                    });
                } catch (err) {
                    // Drive doesn't exist
                }
            }
            res.json(drives);
        } else {
            // For Unix-like systems, start at root
            res.json([{ path: '/', name: 'Root', type: 'drive' }]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Browse directory
app.post('/api/browse', async (req, res) => {
    try {
        const { path: dirPath = os.homedir() } = req.body;
        
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        const contents = await Promise.all(items.map(async (item) => {
            const fullPath = path.join(dirPath, item.name);
            try {
                const stats = await fs.stat(fullPath);
                return {
                    name: item.name,
                    path: fullPath,
                    type: item.isDirectory() ? 'folder' : 'file',
                    size: stats.size,
                    modified: stats.mtime,
                    extension: item.isFile() ? path.extname(item.name).toLowerCase() : null,
                    isImage: /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico)$/i.test(item.name)
                };
            } catch (err) {
                // Handle permission errors
                return {
                    name: item.name,
                    path: fullPath,
                    type: item.isDirectory() ? 'folder' : 'file',
                    error: 'Access denied'
                };
            }
        }));
        
        // Sort folders first, then files
        contents.sort((a, b) => {
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;
            return a.name.localeCompare(b.name);
        });
        
        res.json({
            currentPath: dirPath,
            parentPath: path.dirname(dirPath),
            contents: contents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get file content (for images)
app.get('/api/file', async (req, res) => {
    try {
        const filePath = req.query.path;
        if (!filePath) {
            return res.status(400).json({ error: 'Path required' });
        }
        
        // Check if it's an image
        if (/\.(jpg|jpeg|png|gif|bmp|webp|svg|ico)$/i.test(filePath)) {
            const stats = await fs.stat(filePath);
            const stream = require('fs').createReadStream(filePath);
            
            const ext = path.extname(filePath).toLowerCase();
            const contentType = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.bmp': 'image/bmp',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon'
            }[ext] || 'application/octet-stream';
            
            res.set('Content-Type', contentType);
            stream.pipe(res);
        } else {
            res.status(400).json({ error: 'Not an image file' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`File Explorer Server running on http://localhost:${PORT}`);
});