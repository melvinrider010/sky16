/**
 * Sky16 Cafe Clone Server
 * Serves the React SPA on port 3000 and the API on port 3001 (and also port 3000/api)
 * Built with native Node.js (Zero external dependencies needed!)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const FRONTEND_PORT = process.env.PORT || 3000;
const API_PORT = process.env.API_PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const DATA_FILE = path.join(__dirname, 'data', 'images.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function loadImages() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading data file:', e);
  }
  return [];
}

function saveImages(images) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(images, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving data file:', e);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8'
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function handleApi(req, res, parsedUrl) {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }

  const pathname = parsedUrl.pathname;

  // GET /api/ping
  if (pathname === '/api/ping' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', message: 'Sky16 API is running' }));
    return true;
  }

  // GET /api/images?section=...
  if (pathname === '/api/images' && req.method === 'GET') {
    const section = parsedUrl.query.section || 'slider';
    const images = loadImages();
    const filtered = images.filter(img => img.section === section);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filtered));
    return true;
  }

  // POST /api/login
  if (pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (data.password === ADMIN_PASSWORD) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid password' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return true;
  }

  // DELETE /api/images/:id
  if (pathname.startsWith('/api/images/') && req.method === 'DELETE') {
    const id = pathname.split('/').pop();
    let images = loadImages();
    images = images.filter(img => String(img.id) !== String(id));
    saveImages(images);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, deleted: id }));
    return true;
  }

  // POST /api/upload
  if (pathname === '/api/upload' && req.method === 'POST') {
    const boundaryMatch = (req.headers['content-type'] || '').match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      // Basic multipart parser
      const boundary = boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]) : null;
      let filename = 'upload_' + Date.now() + '.jpg';
      let section = 'slider';

      if (boundary) {
        const parts = buffer.toString('binary').split('--' + boundary);
        for (const part of parts) {
          if (part.includes('name="section"')) {
            const lines = part.split('\r\n\r\n');
            if (lines[1]) section = lines[1].replace(/\r\n.*$/, '').trim();
          }
          if (part.includes('filename="')) {
            const nameMatch = part.match(/filename="([^"]+)"/);
            if (nameMatch) {
              filename = Date.now() + '_' + path.basename(nameMatch[1]).replace(/\s+/g, '_');
            }
            const fileStart = part.indexOf('\r\n\r\n') + 4;
            const fileEnd = part.lastIndexOf('\r\n');
            if (fileStart > 3 && fileEnd > fileStart) {
              const fileData = Buffer.from(part.substring(fileStart, fileEnd), 'binary');
              fs.writeFileSync(path.join(UPLOADS_DIR, filename), fileData);
            }
          }
        }
      }

      const newImage = {
        id: Date.now(),
        image_url: `/uploads/${filename}`,
        section: section,
        created_at: new Date().toISOString()
      };

      const images = loadImages();
      images.unshift(newImage);
      saveImages(images);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newImage));
    });
    return true;
  }

  return false;
}

function handleStatic(req, res, parsedUrl) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(parsedUrl.pathname);
  } catch (e) {
    decodedPath = parsedUrl.pathname;
  }

  let filePath = path.join(__dirname, decodedPath);

  // Prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If /admin is requested, serve admin.html which loads the React admin dashboard
      if (parsedUrl.pathname === '/admin' || parsedUrl.pathname === '/admin/') {
        const adminFile = path.join(__dirname, 'admin.html');
        if (fs.existsSync(adminFile)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(fs.readFileSync(adminFile));
          return;
        }
      }

      // Fallback to index.html
      const indexFile = path.join(__dirname, 'index.html');
      fs.readFile(indexFile, (err2, indexData) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexData);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Stream the file
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

function requestHandler(req, res) {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname.startsWith('/api/')) {
    const handled = handleApi(req, res, parsedUrl);
    if (handled) return;
  }
  handleStatic(req, res, parsedUrl);
}

// Start Frontend Server (port 3000)
const frontendServer = http.createServer(requestHandler);
frontendServer.listen(FRONTEND_PORT, () => {
  console.log(`[Sky16 Frontend] Running at http://localhost:${FRONTEND_PORT}/`);
  console.log(`[Sky16 Admin]    Running at http://localhost:${FRONTEND_PORT}/admin`);
});

// Start API Server (port 3001) for direct localhost:3001 frontend calls
const apiServer = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname.startsWith('/api/')) {
    const handled = handleApi(req, res, parsedUrl);
    if (handled) return;
  }
  handleStatic(req, res, parsedUrl);
});

apiServer.listen(API_PORT, () => {
  console.log(`[Sky16 API]      Running at http://localhost:${API_PORT}/api`);
});
